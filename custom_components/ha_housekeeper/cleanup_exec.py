"""Executing confirmed cleanup plans. This is the only module that changes Home Assistant.

Two actions exist:

* ``disable_entity`` quarantines an entity by disabling it. Nothing is deleted, history and
  statistics are never touched, and the step can be undone while the entity is unchanged.
* ``remove_entity`` removes the registry entry of an entity that has been in quarantine for at
  least ``QUARANTINE_DAYS``. A Home Assistant backup is created first and must complete, and the
  entry is stored in the journal so that it can be restored.

Every step is re-checked right before it runs, journaled, and the run stops at the first surprise.
"""

from __future__ import annotations

import asyncio
import contextlib
import inspect
import secrets
from datetime import UTC, datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from .cleanup import EXECUTABLE_KINDS, PLAN_MAX_AGE_HOURS, judge_action, registry_fingerprint

TOKEN_TTL = timedelta(minutes=5)
BACKUP_TIMEOUT = 30 * 60  # seconds; large installations can take a while


class CleanupError(Exception):
    """A plan cannot be confirmed, executed or undone; the message code is user-facing."""


def _now() -> datetime:
    return datetime.now(UTC)


def _event(plan: dict[str, Any], kind: str, **detail: Any) -> None:
    """Append to the plan's audit log. Entries are only ever added."""
    plan["events"].append({"at": _now().isoformat(), "type": kind, **detail})


def _value(value: Any) -> Any:
    return getattr(value, "value", value)


def entity_restorable(hass: HomeAssistant, entry: Any) -> bool | None:
    """Whether a removed registry entry could be brought back (its config entry still exists)."""
    if entry is None:
        return None
    if entry.config_entry_id is None:
        return True
    return hass.config_entries.async_get_entry(entry.config_entry_id) is not None


def _restore_data(entry: Any) -> dict[str, Any]:
    """Everything needed to recreate a registry entry, stored in the journal before removal."""
    fields = (
        "entity_id",
        "platform",
        "unique_id",
        "config_entry_id",
        "config_subentry_id",
        "device_id",
        "area_id",
        "name",
        "icon",
        "original_name",
        "original_icon",
        "original_device_class",
        "device_class",
        "translation_key",
        "unit_of_measurement",
        "supported_features",
        "has_entity_name",
        "capabilities",
    )
    data = {name: getattr(entry, name, None) for name in fields}
    data.update(
        entity_category=_value(entry.entity_category),
        hidden_by=_value(entry.hidden_by),
        disabled_by=_value(entry.disabled_by),
        labels=sorted(entry.labels),
        aliases=sorted(entry.aliases),
    )
    return data


class CleanupRunner:
    """Confirm, execute and undo plans, one at a time."""

    def __init__(self, hass: HomeAssistant, scanner: Any) -> None:
        self.hass = hass
        self.scanner = scanner
        self._tokens: dict[str, tuple[str, datetime, list[str]]] = {}
        self._cancel = False
        self._task: asyncio.Task[None] | None = None
        self.status: dict[str, Any] = {
            "running": False,
            "plan_id": None,
            "phase": None,
            "done": 0,
            "total": 0,
        }

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
            "removals": [
                a["object_id"]
                for a in plan["actions"]
                if a["object_id"] in selected and a["kind"] == "remove_entity"
            ],
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
        self.status = {
            "running": True,
            "plan_id": plan_id,
            "phase": "starting",
            "done": 0,
            "total": len(saved[2]),
        }
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
            by_id = {action["object_id"]: action for action in plan["actions"]}
            if any(by_id[object_id]["kind"] == "remove_entity" for object_id in object_ids):
                await self._backup(plan)
            if plan["status"] == "running":
                await self._execute(plan, object_ids)
        except Exception as err:  # Never leave the plan in "running".
            _event(plan, "failed", error=f"{type(err).__name__}: {err}")
            plan["status"] = "partial" if plan["executed"] else "aborted"
        finally:
            plan["run"]["finished_at"] = _now().isoformat()
            self.scanner.paused = False
            self.status = {
                "running": False,
                "plan_id": plan["plan_id"],
                "phase": None,
                "done": 0,
                "total": 0,
            }
            journal.save()
        await self._verify(plan)

    async def _backup(self, plan: dict[str, Any]) -> None:
        """Create a Home Assistant backup with the user's own backup settings and wait for it.

        ``async_create_automatic_backup`` returns only after the backup has finished and raises if
        it failed, so reaching the next line means the backup exists.
        """
        self.status["phase"] = "backup"
        plan["status"] = "backup"
        self.scanner.journal.save()
        try:
            from homeassistant.components.backup import async_get_manager

            manager = async_get_manager(self.hass)
        except Exception:
            self._backup_failed(plan, "backup_unavailable")
            return
        if not manager.config.data.create_backup.agent_ids:
            self._backup_failed(plan, "no_backup_agent")
            return
        _event(plan, "backup_started")
        try:
            async with asyncio.timeout(BACKUP_TIMEOUT):
                created = await manager.async_create_automatic_backup()
        except Exception as err:
            self._backup_failed(plan, "backup_failed", error=f"{type(err).__name__}: {err}")
            return
        plan["backup"] = {
            "job_id": getattr(created, "backup_job_id", None),
            "at": _now().isoformat(),
        }
        _event(plan, "backup_done", job_id=plan["backup"]["job_id"])
        plan["status"] = "running"
        self.scanner.journal.save()

    def _backup_failed(self, plan: dict[str, Any], reason: str, **detail: Any) -> None:
        """Without a verified backup nothing is removed or disabled."""
        _event(plan, "aborted", reason=reason, **detail)
        for action in plan["actions"]:
            action.setdefault(
                "result", {"state": "not_run", "at": _now().isoformat(), "reason": reason}
            )
        plan["status"] = "aborted"

    async def _execute(self, plan: dict[str, Any], object_ids: list[str]) -> None:
        self.status["phase"] = "running"
        snapshot = await self.scanner.async_scan()
        objects = {o["object_id"]: o for o in snapshot["objects"] if o["object_type"] == "entity"}
        quarantine = {q["object_id"]: q["since"] for q in snapshot.get("quarantine", [])}
        registry = er.async_get(self.hass)
        by_id = {action["object_id"]: action for action in plan["actions"]}
        acknowledged = set(object_ids)
        for index, object_id in enumerate(object_ids):
            action = by_id[object_id]
            if self._cancel:
                self._abort(plan, "cancelled", object_ids[index:])
                return
            reason = self._precheck(action, acknowledged, objects, snapshot, quarantine, registry)
            if reason:
                self._abort(plan, reason, object_ids[index:], object_id)
                return
            entry = registry.async_get(object_id)
            if action["kind"] == "remove_entity":
                restore = _restore_data(entry)
                registry.async_remove(object_id)
                action["result"] = {
                    "state": "done",
                    "at": _now().isoformat(),
                    "before": registry_fingerprint(entry),
                    "restore": restore,
                }
                _event(plan, "removed", object_id=object_id)
            else:
                updated = registry.async_update_entity(
                    object_id, disabled_by=er.RegistryEntryDisabler.USER
                )
                action["result"] = {
                    "state": "done",
                    "at": _now().isoformat(),
                    "before": registry_fingerprint(entry),
                    "after": registry_fingerprint(updated),
                }
                _event(plan, "disabled", object_id=object_id)
            plan["executed"] = True
            self.status["done"] = index + 1
            self.scanner.journal.save()
        plan["status"] = "executed"

    def _precheck(
        self,
        action: dict[str, Any],
        acknowledged: set[str],
        objects: dict[str, dict[str, Any]],
        snapshot: dict[str, Any],
        quarantine: dict[str, str],
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
        verdict = judge_action(
            action["kind"],
            action["object_id"],
            objects,
            snapshot["edges"],
            quarantine,
            entity_restorable(self.hass, entry),
            _now(),
        )
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
        """Scan again and check that the changed entities are in the expected state."""
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
        checks = []
        for action in plan["actions"]:
            if action.get("result", {}).get("state") != "done":
                continue
            entry = registry.async_get(action["object_id"])
            if action["kind"] == "remove_entity":
                ok = entry is None and self.hass.states.get(action["object_id"]) is None
                checks.append({"check": "removed", "object_id": action["object_id"], "ok": ok})
            else:
                ok = entry is not None and entry.disabled_by is not None
                checks.append({"check": "disabled", "object_id": action["object_id"], "ok": ok})
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
        """Revert steps that are still exactly as Housekeeper left them."""
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
            if action["kind"] == "remove_entity":
                outcome = self._restore(registry, action["object_id"], result["restore"])
            else:
                outcome = self._reenable(registry, action["object_id"], result)
            if outcome == "undone":
                result["state"] = "undone"
                result["undone_at"] = _now().isoformat()
                _event(
                    plan,
                    "restored" if action["kind"] == "remove_entity" else "undone",
                    object_id=action["object_id"],
                )
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

    @staticmethod
    def _reenable(registry: Any, object_id: str, result: dict[str, Any]) -> str:
        entry = registry.async_get(object_id)
        if entry is None:
            return "conflict_gone"
        if registry_fingerprint(entry) != result["after"]:
            return "conflict_changed"
        registry.async_update_entity(object_id, disabled_by=None)
        return "undone"

    def _restore(self, registry: Any, object_id: str, data: dict[str, Any]) -> str:
        """Recreate a removed registry entry from the journal. The entity stays quarantined."""
        if registry.async_get(object_id) is not None:
            return "conflict_taken"
        config_entry = None
        if data.get("config_entry_id"):
            config_entry = self.hass.config_entries.async_get_entry(data["config_entry_id"])
            if config_entry is None:
                return "conflict_unrestorable"
        domain, _, name = data["entity_id"].partition(".")
        try:
            created = registry.async_get_or_create(
                domain,
                data["platform"],
                data["unique_id"],
                suggested_object_id=name,
                disabled_by=er.RegistryEntryDisabler(data["disabled_by"])
                if data["disabled_by"]
                else None,
                hidden_by=er.RegistryEntryHider(data["hidden_by"]) if data["hidden_by"] else None,
                **self._creation_kwargs(registry, data, config_entry),
            )
        except Exception:
            return "conflict_unrestorable"
        if created.entity_id != data["entity_id"]:
            registry.async_remove(created.entity_id)  # the ID is taken: do not leave a stray entry
            return "conflict_taken"
        registry.async_update_entity(
            created.entity_id,
            name=data["name"],
            icon=data["icon"],
            area_id=data["area_id"],
            device_class=data["device_class"],
            labels=set(data["labels"]),
            aliases=set(data["aliases"]),
        )
        return "undone"

    @staticmethod
    def _creation_kwargs(registry: Any, data: dict[str, Any], config_entry: Any) -> dict[str, Any]:
        """Only pass what this Home Assistant version accepts; older or newer builds differ."""
        wanted = {
            "config_entry": config_entry,
            "config_subentry_id": data.get("config_subentry_id"),
            "device_id": data.get("device_id"),
            "capabilities": data.get("capabilities"),
            "original_name": data.get("original_name"),
            "original_icon": data.get("original_icon"),
            "original_device_class": data.get("original_device_class"),
            "translation_key": data.get("translation_key"),
            "unit_of_measurement": data.get("unit_of_measurement"),
            "supported_features": data.get("supported_features"),
            "has_entity_name": data.get("has_entity_name"),
            "entity_category": er.EntityCategory(data["entity_category"])
            if data.get("entity_category")
            else None,
        }
        accepted = inspect.signature(registry.async_get_or_create).parameters
        return {
            key: value for key, value in wanted.items() if key in accepted and value is not None
        }

    def _plan(self, plan_id: str) -> dict[str, Any]:
        plan = self.scanner.journal.get(plan_id)
        if plan is None:
            raise CleanupError("not_found")
        return plan
