"""Cleanup plans: a dry run that judges candidates, and the journal that records every plan.

Nothing in this module changes Home Assistant. Executing a confirmed plan lives in
``cleanup_exec`` so that all writes stay in one small, reviewable place.
"""

from __future__ import annotations

import hashlib
import json
import secrets
from collections.abc import Callable
from datetime import UTC, datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import IGNORE_LABEL, JOURNAL_STORAGE_KEY, QUARANTINE_DAYS, STORAGE_VERSION

USAGE_RELATIONS = frozenset(
    {"TRIGGERS_ON", "USES_AS_CONDITION", "TARGETS", "REFERENCES", "SHOWS", "INCLUDES"}
)
ACTION_KINDS = frozenset({"disable_entity", "remove_entity"})
# Disabling is the quarantine; removing is only allowed after a full quarantine period.
EXECUTABLE_KINDS = frozenset({"disable_entity", "remove_entity"})
REMOVABLE_STATUSES = frozenset({"orphaned", "unavailable", "unknown", "disabled"})
DISABLEABLE_STATUSES = frozenset({"orphaned", "unavailable", "unknown"})
PLAN_MAX_AGE_HOURS = 24
MAX_ACTIONS = 200
MAX_PLANS = 50
SAVE_DELAY = 5


def _enum_value(value: Any) -> Any:
    return getattr(value, "value", value)


def registry_fingerprint(entry: Any) -> str:
    """Short hash of the registry fields a cleanup action must find unchanged."""
    fields = [
        entry.entity_id,
        entry.unique_id,
        entry.platform,
        entry.config_entry_id,
        entry.device_id,
        entry.area_id,
        entry.name,
        sorted(entry.labels),
        _enum_value(entry.disabled_by),
        _enum_value(entry.hidden_by),
        _enum_value(entry.entity_category),
    ]
    return hashlib.sha256(json.dumps(fields, default=str).encode()).hexdigest()[:16]


def quarantine_entries(
    plans: list[dict[str, Any]], entities: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """Entities Housekeeper quarantined that are still disabled by the user.

    The journal says when an entity was disabled; the live inventory says whether it still
    is. Entities that were re-enabled, undone or removed since are no longer in quarantine.
    """
    live = {item["object_id"]: item for item in entities}
    latest: dict[str, dict[str, Any]] = {}
    for plan in plans:
        for action in plan.get("actions", []):
            result = action.get("result") or {}
            if action["kind"] != "disable_entity" or result.get("state") != "done":
                continue
            current = latest.get(action["object_id"])
            if current is None or result["at"] > current["since"]:
                latest[action["object_id"]] = {
                    "object_id": action["object_id"],
                    "plan_id": plan["plan_id"],
                    "since": result["at"],
                }
    return sorted(
        (
            entry
            for object_id, entry in latest.items()
            if (item := live.get(object_id)) and item.get("disabled_by") == "user"
        ),
        key=lambda entry: entry["since"],
    )


def _used_by(edges: list[dict[str, Any]], key: str) -> list[dict[str, Any]]:
    """Objects that use ``key``, with how sure Housekeeper is."""
    return [
        {
            "source": edge["source"],
            "relation": edge["relation"],
            "confidence": edge.get("confidence", "certain"),
            "location": edge.get("location"),
        }
        for edge in edges
        if edge["target"] == key and edge["relation"] in USAGE_RELATIONS
    ]


def judge_action(
    kind: str,
    object_id: str,
    objects: dict[str, dict[str, Any]],
    edges: list[dict[str, Any]],
    quarantine: dict[str, str] | None = None,
    restorable: bool | None = None,
    now: datetime | None = None,
) -> dict[str, Any]:
    """Judge one candidate. Verdicts: ``ok`` (no known use), ``review``, ``blocked``.

    ``quarantine`` maps entity IDs to when Housekeeper disabled them; removal is only
    allowed after ``QUARANTINE_DAYS``. ``restorable`` tells whether a removed entity could be
    brought back (its config entry still exists).
    """
    action: dict[str, Any] = {
        "kind": kind,
        "object_id": object_id,
        "name": object_id,
        "verdict": "blocked",
        "reasons": [],
        "used_by": [],
        "has_statistics": False,
    }
    if kind not in ACTION_KINDS:
        action["reasons"].append("unsupported_action")
        return action
    item = objects.get(object_id)
    if item is None:
        action["reasons"].append("not_found")
        return action
    action["name"] = item.get("name") or object_id
    action["status"] = item["status"]
    action["has_statistics"] = bool(item.get("has_statistics"))
    used_by = _used_by(edges, f"entity:{object_id}")
    action["used_by"] = used_by

    reasons = action["reasons"]
    allowed = DISABLEABLE_STATUSES if kind == "disable_entity" else REMOVABLE_STATUSES
    if kind == "disable_entity" and item["status"] == "disabled":
        reasons.append("already_disabled")
    elif item["status"] not in allowed:
        reasons.append("entity_working")
    if any(use["confidence"] == "certain" for use in used_by):
        reasons.append("used_certain")
    elif used_by:
        reasons.append("used_probable")
    if action["has_statistics"]:
        reasons.append("has_statistics")
    if item.get("labels") and IGNORE_LABEL in item["labels"]:
        reasons.append("ignored_by_label")
    if kind == "remove_entity":
        since = (quarantine or {}).get(object_id)
        if since is None:
            reasons.append("not_quarantined")
        else:
            age = (now or datetime.now(UTC)) - datetime.fromisoformat(since)
            action["quarantine_since"] = since
            if age < timedelta(days=QUARANTINE_DAYS):
                reasons.append("quarantine_too_short")
                action["quarantine_days_left"] = QUARANTINE_DAYS - age.days
        action["restorable"] = restorable
        if restorable is False:
            reasons.append("not_restorable")

    if {
        "entity_working",
        "used_certain",
        "already_disabled",
        "not_quarantined",
        "quarantine_too_short",
    } & set(reasons):
        action["verdict"] = "blocked"
    elif reasons:
        action["verdict"] = "review"
    else:
        action["verdict"] = "ok"
    return action


def build_plan(
    snapshot: dict[str, Any],
    requested: list[dict[str, str]],
    now: datetime,
    fingerprint: Callable[[str], str | None] | None = None,
    restorable: Callable[[str], bool | None] | None = None,
) -> dict[str, Any]:
    """Create a dry-run plan for ``requested`` actions from the latest snapshot.

    ``fingerprint`` returns the registry fingerprint of an entity so that execution can
    detect changes made after the preview; ``restorable`` tells whether a removal could be undone.
    """
    quarantine = {q["object_id"]: q["since"] for q in snapshot.get("quarantine", [])}
    objects = {
        item["object_id"]: item for item in snapshot["objects"] if item["object_type"] == "entity"
    }
    seen: set[tuple[str, str]] = set()
    actions = []
    for request in requested[:MAX_ACTIONS]:
        identity = (request["kind"], request["object_id"])
        if identity in seen:
            continue
        seen.add(identity)
        action = judge_action(
            *identity,
            objects,
            snapshot["edges"],
            quarantine,
            restorable(identity[1]) if restorable else None,
            now,
        )
        action["fingerprint"] = fingerprint(identity[1]) if fingerprint else None
        action["executable"] = identity[0] in EXECUTABLE_KINDS and action["verdict"] != "blocked"
        actions.append(action)
    counts = {
        verdict: sum(a["verdict"] == verdict for a in actions)
        for verdict in ("ok", "review", "blocked")
    }
    return {
        "plan_id": secrets.token_hex(6),
        "created_at": now.isoformat(),
        "scanned_at": snapshot["meta"]["scanned_at"],
        "status": "dry_run",
        "executed": False,
        "confirmed": None,
        "run": None,
        "actions": actions,
        "summary": {
            "total": len(actions),
            **counts,
            "uses": sum(len(a["used_by"]) for a in actions),
            "statistics": sum(a["has_statistics"] for a in actions),
        },
        "events": [{"at": now.isoformat(), "type": "created"}],
    }


class JournalStore:
    """Journal of dry-run plans, newest first. Stored by Housekeeper only."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, JOURNAL_STORAGE_KEY)
        self._plans: list[dict[str, Any]] = []

    async def async_load(self) -> None:
        """Load the journal."""
        data = await self._store.async_load()
        if isinstance(data, dict) and isinstance(data.get("plans"), list):
            self._plans = data["plans"]

    @property
    def plans(self) -> list[dict[str, Any]]:
        """All plans, newest first."""
        return self._plans

    def add(self, plan: dict[str, Any]) -> None:
        """Record a plan, keeping the newest ones."""
        self._plans.insert(0, plan)
        del self._plans[MAX_PLANS:]
        self._save()

    def get(self, plan_id: str) -> dict[str, Any] | None:
        """Return one plan by ID."""
        return next((plan for plan in self._plans if plan["plan_id"] == plan_id), None)

    def remove(self, plan_id: str) -> bool:
        """Remove a plan that was never executed. Executed plans stay as the audit trail."""
        for plan in self._plans:
            if plan["plan_id"] == plan_id and not plan.get("executed") and not plan.get("run"):
                self._plans.remove(plan)
                self._save()
                return True
        return False

    def save(self) -> None:
        """Persist changes made to a plan in place."""
        self._save()

    def _save(self) -> None:
        self._store.async_delay_save(lambda: {"plans": self._plans}, SAVE_DELAY)
