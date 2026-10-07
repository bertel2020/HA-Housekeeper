"""Pure housekeeping heuristics: duplicate entity suspects and forgotten automations."""

from __future__ import annotations

import re
from datetime import datetime, timedelta
from typing import Any

SUFFIXED_NAME = re.compile(r"^(?P<base>.+?)_(?P<number>\d+)$")
LEFTOVER_STATUSES = frozenset({"unavailable", "orphaned", "unknown"})


def finding_key(finding: dict[str, Any]) -> str:
    """Stable identity of a finding across scans."""
    return f"{finding['rule_id']}|{finding['object_id']}|{finding.get('affected_object') or ''}"


def mark_duplicates(entities: list[dict[str, Any]]) -> None:
    """Set ``duplicate_of`` on entities that look like leftovers of an active twin.

    Re-adding a device often creates ``sensor.x_2`` while the old ``sensor.x`` stays.
    Only an entity that is not working, from the same integration as a working
    entity with the unsuffixed name, is marked; two active entities are never.
    """
    by_id = {item["object_id"]: item for item in entities}
    for item in entities:
        item["duplicate_of"] = None
        if item["status"] not in LEFTOVER_STATUSES:
            continue
        domain, _, name = item["object_id"].partition(".")
        match = SUFFIXED_NAME.match(name)
        if not match:
            continue
        twin = by_id.get(f"{domain}.{match['base']}")
        if twin and twin["status"] == "active" and twin["platform"] == item["platform"]:
            item["duplicate_of"] = twin["object_id"]


def duplicate_findings(entities: list[dict[str, Any]], keep: Any) -> list[dict[str, Any]]:
    """Create findings for marked duplicates; ``keep`` filters out short outages."""
    return [
        {
            "rule_id": "entity.possible_duplicate",
            "object_id": item["object_id"],
            "classification": "possible_duplicate",
            "confidence": 0.7,
            "first_detected_at": item.get("status_since"),
            "affected_object": item["duplicate_of"],
            "evidence": [{"kind": "possible_duplicate", "source": "entity_registry"}],
        }
        for item in entities
        if item.get("duplicate_of") and keep(item)
    ]


def _age(value: str | None, now: datetime) -> timedelta | None:
    if not value:
        return None
    try:
        return now - datetime.fromisoformat(value)
    except ValueError:
        return None


def automation_hygiene_findings(
    automations: list[dict[str, Any]], now: datetime, days: int
) -> list[dict[str, Any]]:
    """Find automations that are switched off or never run for ``days`` days."""
    if days <= 0:
        return []
    limit = timedelta(days=days)
    findings: list[dict[str, Any]] = []

    def add(item: dict[str, Any], rule: str, age: timedelta, confidence: float) -> None:
        findings.append(
            {
                "rule_id": f"automation.{rule}",
                "object_id": item["object_id"],
                "classification": "unused",
                "confidence": confidence,
                "first_detected_at": item.get("status_since") if rule == "disabled_long" else None,
                "evidence": [{"kind": rule, "source": "automation_state", "days": age.days}],
            }
        )

    for item in automations:
        if item["object_type"] != "automation":
            continue
        if item["status"] == "disabled":
            age = _age(item.get("status_since"), now)
            if age is not None and age >= limit:
                add(item, "disabled_long", age, 0.7)
        elif item["status"] == "active":
            if item.get("last_triggered"):
                age = _age(item["last_triggered"], now)
                if age is not None and age >= limit:
                    add(item, "stale", age, 0.6)
            else:
                age = _age(item.get("created_at") or item.get("status_since"), now)
                if age is not None and age >= limit:
                    add(item, "never_triggered", age, 0.6)
    return findings


def battery_level(item: dict[str, Any]) -> tuple[float | None, bool]:
    """Return (percent, is_low_flag) for a working battery entity, else (None, False).

    Battery sensors report a percentage; battery binary sensors report ``on`` when low.
    """
    if item.get("device_class") != "battery" or item.get("status") != "active":
        return None, False
    domain = item["object_id"].partition(".")[0]
    if domain == "binary_sensor":
        return None, item.get("state") == "on"
    if domain == "sensor":
        try:
            return float(item["state"]), False
        except (TypeError, ValueError):
            return None, False
    return None, False


def low_battery_ids(entities: list[dict[str, Any]], threshold: int) -> list[str]:
    """Return IDs of working batteries at or below ``threshold`` percent or flagged low."""
    low = []
    for item in entities:
        level, flagged = battery_level(item)
        if flagged or (level is not None and level <= threshold):
            low.append(item["object_id"])
    return low
