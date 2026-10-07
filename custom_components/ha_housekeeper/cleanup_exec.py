"""Executing confirmed cleanup plans. This is the only module that changes Home Assistant.

Step A supports one reversible action: quarantine an entity by disabling it
(``disable_entity``). Nothing is deleted, history and statistics are never touched, and every
step is re-checked, journaled and can be undone while the entity is still as Housekeeper left it.
"""

from __future__ import annotations

import asyncio
import contextlib
import secrets
from datetime import UTC, datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from .cleanup import EXECUTABLE_KINDS, PLAN_MAX_AGE_HOURS, judge_action, registry_fingerprint

TOKEN_TTL = timedelta(minutes=5)


class CleanupError(Exception):
    """A plan cannot be confirmed, executed or undone; the message code is user-facing."""


def _now() -> datetime:
    return datetime.now(UTC)


def _event(plan: dict[str, Any], kind: str, **detail: Any) -> None:
    """Append to the plan's audit log. Entries are only ever added."""
    plan["events"].append({"at": _now().isoformat(), "type": kind, **detail})


class CleanupRunner:
    """Confirm, execute and undo plans, one at a time."""

    def __init__(self, hass: HomeAssistant, scanner: Any) -> None:
        self.hass = hass
        self.scanner = scanner
        self._tokens: dict[str, tuple[str, datetime, list[str]]] = {}
        self._cancel = False
        self._task: asyncio.Task[None] | None = None
        self.status: dict[str, Any] = {"running": False, "plan_id": None, "done": 0, "total": 0}

    @property
    def running(self) -> bool:
        """Whether a plan is being executed or undone right now."""
        return bool(self.status["running"])

    def cancel(self) -> None:
        """Stop after the current step."""
        self._cancel = True

    def confirm(self, plan_id: str, acknowledged: list[str], user_id: str | None) -> dict[str, Any]:
        """Select the actions that may run and hand out a short-lived confirmation token."""
        plan = self._plan(plan_id)
        if plan["status"] != "dry_run" or plan.get("run"):
            raise CleanupError("plan_not_open")
        age = _now() - datetime.fromisoformat(plan["created_at"])
        if age > timedelta(hours=PLAN_MAX_AGE_HOURS):
            raise CleanupError("plan_too_old")
        acknowledged_set = set(acknowledged)
        selected, needs_ack, skipped = [], [], []
        for action in plan["actions"]:
            if action["kind"] not in EXECUTABLE_KINDS or not action.get("executable"):
                skipped.append(action["object_id"])
            elif action["verdict"] == "ok" or action["object_id"] in acknowledged_set:
                selected.append(action["object_id"])
            else:
                needs_ack.append(action["object_id"])
        if not selected:
            raise CleanupError("nothing_to_do")
        token = secrets.token_urlsafe(16)
        self._tokens[plan_id] = (token, _now() + TOKEN_TTL, selected)
        plan["confirmed"] = {"at": _now().isoformat(), "user_id": user_id, "object_ids": selected}
        _event(plan, "confirmed", user_id=user_id, count=len(selected))
        self.scanner.journal.save()
        return {
            "plan_id": plan_id,
            "token": token,
            "expires_at": (_now() + TOKEN_TTL).isoformat(),
            "execute": selected,
            "needs_acknowledgement": needs_ack,
            "skipped": skipped,
        }

    def start(self, plan_id: str, token: str, user_id: str | None) -> None:
        """Validate the token and run the plan in the background."""
        if self.running:
            raise CleanupError("busy")
        plan = self._plan(plan_id)
        saved = self._tokens.pop(plan_id, None)
        if saved is None or not secrets.compare_digest(saved[0], token) or saved[1] < _now():
            raise CleanupError("bad_token")
        if plan["status"] != "dry_run" or plan.get("run"):
            raise CleanupError("plan_not_open")
        self._cancel = False
        self.scanner.paused = True
        self.status = {"running": True, "plan_id": plan_id, "done": 0, "total": len(saved[2])}
        self._task = self.hass.async_create_background_task(
            self._run(plan, saved[2], user_id), "HA Housekeeper cleanup run"
        )

    async def _run(self, plan: dict[str, Any], object_ids: list[str], user_id: str | None) -> None:
        journal = self.scanner.journal
        plan["status"] = "running"
        plan["run"] = {"started_at": _now().isoformat(), "user_id": user_id, "finished_at": None}
        _event(plan, "started", user_id=user_id)
        journal.save()
        try:
            await self._execute(plan, object_ids)
        except Exception as err:  # Never leave the plan in "running".
            _event(plan, "failed", error=f"{type(err).__name__}: {err}")
            plan["status"] = "partial" if plan["executed"] else "aborted"
        finally:
            plan["run"]["finished_at"] = _now().isoformat()
            self.scanner.paused = False
            self.status = {"running": False, "plan_id": plan["plan_id"], "done": 0, "total": 0}
            journal.save()
        await self._verify(plan)

    async def _execute(self, plan: dict[str, Any], object_ids: list[str]) -> None:
        snapshot = await self.scanner.async_scan()
        objects = {o["object_id"]: o for o in snapshot["objects"] if o["object_type"] == "entity"}
        registry = er.async_get(self.hass)
        by_id = {action["object_id"]: action for action in plan["actions"]}
        acknowledged = set(object_ids)
        for index, object_id in enumerate(object_ids):
            action = by_id[object_id]
            if self._cancel:
                self._abort(plan, "cancelled", object_ids[index:])
                return
            reason = self._precheck(action, acknowledged, objects, snapshot, registry)
            if reason:
                self._abort(plan, reason, object_ids[index:], object_id)
                return
            entry = registry.async_get(object_id)
            updated = registry.async_update_entity(
                object_id, disabled_by=er.RegistryEntryDisabler.USER
            )
            action["result"] = {
                "state": "done",
                "at": _now().isoformat(),
                "before": registry_fingerprint(entry),
                "after": registry_fingerprint(updated),
            }
            plan["executed"] = True
            _event(plan, "disabled", object_id=object_id)
            self.status["done"] = index + 1
            self.scanner.journal.save()
        plan["status"] = "executed"

    def _precheck(
        self,
        action: dict[str, Any],
        acknowledged: set[str],
        objects: dict[str, dict[str, Any]],
        snapshot: dict[str, Any],
        registry: Any,
    ) -> str | None:
        """Re-check one action against the live state. Returns an abort reason or None."""
        entry = registry.async_get(action["object_id"])
        if entry is None:
            return "entity_gone"
        if (
            action.get("fingerprint") is None
            or registry_fingerprint(entry) != action["fingerprint"]
        ):
            return "entity_changed"
        verdict = judge_action(action["kind"], action["object_id"], objects, snapshot["edges"])
        if verdict["verdict"] == "blocked":
            return "now_blocked"
        if verdict["verdict"] == "review" and action["object_id"] not in acknowledged:
            return "needs_acknowledgement"
        return None

    def _abort(
        self, plan: dict[str, Any], reason: str, remaining: list[str], object_id: str | None = None
    ) -> None:
        by_id = {action["object_id"]: action for action in plan["actions"]}
        for remaining_id in remaining:
            by_id[remaining_id]["result"] = {
                "state": "not_run",
                "at": _now().isoformat(),
                "reason": reason if remaining_id == (object_id or remaining[0]) else "aborted",
            }
        _event(plan, "aborted", reason=reason, object_id=object_id or remaining[0])
        plan["status"] = "partial" if plan["executed"] else "aborted"

    async def _verify(self, plan: dict[str, Any]) -> None:
        """Scan again and check that the quarantined entities are really off."""
        before = {
            f["key"] for f in (self.scanner.snapshot or {}).get("findings", []) if not f["ignored"]
        }
        try:
            snapshot = await self.scanner.async_scan()
        except Exception as err:
            plan["verification"] = {
                "ok": False,
                "checks": [{"check": "scan", "ok": False, "error": str(err)}],
            }
            self.scanner.journal.save()
            return
        registry = er.async_get(self.hass)
        done = [a for a in plan["actions"] if a.get("result", {}).get("state") == "done"]
        checks = [
            {
                "check": "disabled",
                "object_id": a["object_id"],
                "ok": (e := registry.async_get(a["object_id"])) is not None
                and e.disabled_by is not None,
            }
            for a in done
        ]
        new_broken = [
            f["key"]
            for f in snapshot["findings"]
            if f["classification"] == "broken_reference"
            and not f["ignored"]
            and f["key"] not in before
        ]
        checks.append(
            {"check": "no_new_broken_references", "ok": not new_broken, "count": len(new_broken)}
        )
        plan["verification"] = {"ok": all(c["ok"] for c in checks), "checks": checks}
        if plan["status"] == "executed" and plan["verification"]["ok"]:
            plan["status"] = "verified"
        _event(plan, "verified", ok=plan["verification"]["ok"])
        self.scanner.journal.save()

    async def undo(self, plan_id: str, object_ids: list[str] | None) -> dict[str, Any]:
        """Re-enable quarantined entities that are still exactly as Housekeeper left them."""
        if self.running:
            raise CleanupError("busy")
        plan = self._plan(plan_id)
        registry = er.async_get(self.hass)
        results = []
        for action in plan["actions"]:
            result = action.get("result") or {}
            if result.get("state") != "done" or (
                object_ids and action["object_id"] not in object_ids
            ):
                continue
            entry = registry.async_get(action["object_id"])
            if entry is None:
                outcome = "conflict_gone"
            elif registry_fingerprint(entry) != result["after"]:
                outcome = "conflict_changed"
            else:
                registry.async_update_entity(action["object_id"], disabled_by=None)
                result["state"] = "undone"
                result["undone_at"] = _now().isoformat()
                outcome = "undone"
                _event(plan, "undone", object_id=action["object_id"])
            results.append({"object_id": action["object_id"], "outcome": outcome})
        if any(r["outcome"] == "undone" for r in results):
            open_actions = [
                a for a in plan["actions"] if (a.get("result") or {}).get("state") == "done"
            ]
            plan["status"] = "partially_undone" if open_actions else "undone"
        self.scanner.journal.save()
        if any(r["outcome"] == "undone" for r in results):
            # Refresh the inventory so the quarantine list is current; the undo itself succeeded.
            with contextlib.suppress(Exception):
                await self.scanner.async_scan()
        return {"results": results, "status": plan["status"]}

    def _plan(self, plan_id: str) -> dict[str, Any]:
        plan = self.scanner.journal.get(plan_id)
        if plan is None:
            raise CleanupError("not_found")
        return plan
