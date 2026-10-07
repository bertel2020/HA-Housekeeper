"""Cleanup plans, preview only: a dry run that judges candidates and a journal of the results.

Nothing in this module changes Home Assistant. A plan records what *would* be removed, why
it is or is not safe, and what depends on it. Executing a plan is deliberately not implemented.
"""

from __future__ import annotations

import secrets
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import IGNORE_LABEL, JOURNAL_STORAGE_KEY, STORAGE_VERSION

USAGE_RELATIONS = frozenset(
    {"TRIGGERS_ON", "USES_AS_CONDITION", "TARGETS", "REFERENCES", "SHOWS", "INCLUDES"}
)
ACTION_KINDS = frozenset({"remove_entity"})
REMOVABLE_STATUSES = frozenset({"orphaned", "unavailable", "unknown", "disabled"})
MAX_ACTIONS = 200
MAX_PLANS = 50
SAVE_DELAY = 5


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
    kind: str, object_id: str, objects: dict[str, dict[str, Any]], edges: list[dict[str, Any]]
) -> dict[str, Any]:
    """Judge one candidate. Verdicts: ``ok`` (no known use), ``review``, ``blocked``."""
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
    if item["status"] not in REMOVABLE_STATUSES:
        reasons.append("entity_working")
    if any(use["confidence"] == "certain" for use in used_by):
        reasons.append("used_certain")
    elif used_by:
        reasons.append("used_probable")
    if action["has_statistics"]:
        reasons.append("has_statistics")
    if item.get("labels") and IGNORE_LABEL in item["labels"]:
        reasons.append("ignored_by_label")

    if {"entity_working", "used_certain"} & set(reasons):
        action["verdict"] = "blocked"
    elif reasons:
        action["verdict"] = "review"
    else:
        action["verdict"] = "ok"
    return action


def build_plan(
    snapshot: dict[str, Any], requested: list[dict[str, str]], now: datetime
) -> dict[str, Any]:
    """Create a dry-run plan for ``requested`` actions from the latest snapshot."""
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
        actions.append(judge_action(*identity, objects, snapshot["edges"]))
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

    def remove(self, plan_id: str) -> bool:
        """Remove a dry-run entry. Entries that were executed are never removed."""
        for plan in self._plans:
            if plan["plan_id"] == plan_id and not plan.get("executed"):
                self._plans.remove(plan)
                self._save()
                return True
        return False

    def _save(self) -> None:
        self._store.async_delay_save(lambda: {"plans": self._plans}, SAVE_DELAY)
