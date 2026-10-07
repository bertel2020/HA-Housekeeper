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
ENTITY_KINDS = frozenset({"disable_entity", "remove_entity"})
DEVICE_KINDS = frozenset({"disable_device", "remove_device", "forget_device"})
REFERENCE_KINDS = frozenset({"replace_references"})
METER_KINDS = frozenset({"migrate_meter"})
METER_MODES = ("both", "statistics", "id")
ACTION_KINDS = ENTITY_KINDS | DEVICE_KINDS | REFERENCE_KINDS | METER_KINDS
# Disabling is the quarantine; removing is only allowed after a full quarantine period.
EXECUTABLE_KINDS = ACTION_KINDS
# Kinds that cannot simply be switched back: a verified backup is created before they run.
BACKUP_KINDS = frozenset(
    {"remove_entity", "remove_device", "forget_device", "replace_references", "migrate_meter"}
)
# Kinds that remove something: they get the strongest confirmation word.
REMOVAL_KINDS = frozenset({"remove_entity", "remove_device", "forget_device"})
QUARANTINE_KINDS = {"disable_entity": "entity", "disable_device": "device"}
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


def device_fingerprint(entry: Any) -> str:
    """Short hash of the device registry fields a cleanup action must find unchanged."""
    fields = [
        entry.id,
        sorted(map(list, entry.identifiers)),
        sorted(map(list, entry.connections)),
        sorted(entry.config_entries),
        entry.area_id,
        entry.name,
        entry.name_by_user,
        sorted(entry.labels),
        _enum_value(entry.disabled_by),
        entry.via_device_id,
        entry.manufacturer,
        entry.model,
    ]
    return hashlib.sha256(json.dumps(fields, default=str).encode()).hexdigest()[:16]


def device_support(hass: HomeAssistant, entry: Any) -> dict[str, Any]:
    """Whether the integrations behind a device offer regular removal, and could restore it."""
    config_entries = [hass.config_entries.async_get_entry(i) for i in entry.config_entries]
    known = [config_entry for config_entry in config_entries if config_entry is not None]
    return {
        "removal_supported": bool(known)
        and len(known) == len(config_entries)
        and all(config_entry.supports_remove_device for config_entry in known),
        "restorable": bool(known),
    }


def quarantine_entries(
    plans: list[dict[str, Any]], items: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """Entities and devices Housekeeper quarantined that are still disabled by the user.

    The journal says when something was disabled; the live inventory says whether it still
    is. Items that were re-enabled, undone or removed since are no longer in quarantine.
    """
    live = {(item.get("object_type", "entity"), item["object_id"]): item for item in items}
    latest: dict[tuple[str, str], dict[str, Any]] = {}
    for plan in plans:
        for action in plan.get("actions", []):
            result = action.get("result") or {}
            object_type = QUARANTINE_KINDS.get(action["kind"])
            if object_type is None or result.get("state") != "done":
                continue
            key = (object_type, action["object_id"])
            current = latest.get(key)
            if current is None or result["at"] > current["since"]:
                latest[key] = {
                    "object_type": object_type,
                    "object_id": action["object_id"],
                    "plan_id": plan["plan_id"],
                    "since": result["at"],
                }
    return sorted(
        (
            entry
            for key, entry in latest.items()
            if (item := live.get(key)) and item.get("disabled_by") == "user"
        ),
        key=lambda entry: entry["since"],
    )


def recurring_devices(
    plans: list[dict[str, Any]], devices: list[tuple[str, str, set[Any]]]
) -> list[dict[str, Any]]:
    """Devices that an integration created again after Housekeeper made Home Assistant forget them.

    ``devices`` holds ``(device_id, name, identifiers_and_connections)`` of the live registry.
    """
    live = [(device_id, name, {tuple(key) for key in keys}) for device_id, name, keys in devices]
    found: dict[str, dict[str, Any]] = {}
    for plan in plans:
        for action in plan.get("actions", []):
            result = action.get("result") or {}
            if action["kind"] != "forget_device" or result.get("state") != "done":
                continue
            restore = result.get("restore", {})
            identifiers = {tuple(key) for key in restore.get("identifiers", [])}
            keys = identifiers | {tuple(key) for key in restore.get("connections", [])}
            for device_id, name, live_keys in live:
                if keys & live_keys:
                    found[device_id] = {
                        "device_id": device_id,
                        "name": name,
                        "forgotten_at": result["at"],
                        "plan_id": plan["plan_id"],
                        "domains": sorted({key[0] for key in identifiers & live_keys}),
                    }
    return sorted(found.values(), key=lambda entry: entry["forgotten_at"])


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
    *,
    devices: dict[str, dict[str, Any]] | None = None,
    support: dict[str, Any] | None = None,
    target: str | None = None,
    sources: list[dict[str, Any]] | None = None,
    meter: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Judge one candidate of any kind; see ``judge_entity_action`` for the verdicts."""
    if kind in METER_KINDS:
        return judge_meter_action(object_id, target, objects, edges, meter or {})
    if kind in DEVICE_KINDS:
        return judge_device_action(
            kind, object_id, objects, devices or {}, edges, quarantine, support, now
        )
    if kind in REFERENCE_KINDS:
        return judge_reference_action(object_id, target, objects, edges, sources)
    return judge_entity_action(kind, object_id, objects, edges, quarantine, restorable, now)


def _quarantine_reasons(
    action: dict[str, Any],
    reasons: list[str],
    since: str | None,
    now: datetime | None,
) -> None:
    if since is None:
        reasons.append("not_quarantined")
        return
    age = (now or datetime.now(UTC)) - datetime.fromisoformat(since)
    action["quarantine_since"] = since
    if age < timedelta(days=QUARANTINE_DAYS):
        reasons.append("quarantine_too_short")
        action["quarantine_days_left"] = QUARANTINE_DAYS - age.days


BLOCKING_REASONS = frozenset(
    {
        "entity_working",
        "used_certain",
        "already_disabled",
        "not_quarantined",
        "quarantine_too_short",
        "device_has_working_entities",
        "has_children",
        "integration_no_support",
        "regular_removal_available",
        "unsupported_action",
        "not_found",
        "target_missing",
        "same_entity",
        "different_domain",
        "target_not_working",
        "nothing_to_replace",
        "stats_missing_old",
        "stats_unit_differs",
        "stats_type_differs",
        "stats_nothing_to_import",
        "no_recorder",
        "old_not_in_registry",
        "target_not_in_registry",
        "alt_id_taken",
        "nothing_to_do",
    }
)


def _verdict(action: dict[str, Any]) -> None:
    reasons = set(action["reasons"])
    if BLOCKING_REASONS & reasons:
        action["verdict"] = "blocked"
    elif reasons:
        action["verdict"] = "review"
    else:
        action["verdict"] = "ok"


def judge_device_action(
    kind: str,
    device_id: str,
    objects: dict[str, dict[str, Any]],
    devices: dict[str, dict[str, Any]],
    edges: list[dict[str, Any]],
    quarantine: dict[str, str] | None = None,
    support: dict[str, Any] | None = None,
    now: datetime | None = None,
) -> dict[str, Any]:
    """Judge one device. Removal and forgetting follow the same rules as entities, plus hubs.

    ``support`` says whether the integration offers regular removal; Force Forget is only an
    option when it does not. Removing a device also removes its entities, so everything that
    could depend on any of them counts as use of the device.
    """
    device = devices.get(device_id)
    action: dict[str, Any] = {
        "kind": kind,
        "object_id": device_id,
        "object_type": "device",
        "name": device_id,
        "verdict": "blocked",
        "reasons": [],
        "used_by": [],
        "has_statistics": False,
        "entities": [],
    }
    if device is None:
        action["reasons"].append("not_found")
        return action
    action["name"] = device.get("name") or device_id
    action["status"] = device["status"]
    members = [
        item
        for item in objects.values()
        if item.get("device_id") == device_id and item["object_type"] == "entity"
    ]
    action["entities"] = sorted(item["object_id"] for item in members)
    action["has_statistics"] = any(item.get("has_statistics") for item in members)
    used_by = _used_by(edges, f"device:{device_id}")
    for item in members:
        used_by.extend(_used_by(edges, f"entity:{item['object_id']}"))
    action["used_by"] = used_by

    reasons = action["reasons"]
    if any(item["status"] not in DISABLEABLE_STATUSES | {"disabled"} for item in members):
        reasons.append("device_has_working_entities")
    if any(other.get("via_device_id") == device_id for other in devices.values()):
        reasons.append("has_children")
    if kind == "disable_device" and device["status"] == "disabled":
        reasons.append("already_disabled")
    if any(use["confidence"] == "certain" for use in used_by):
        reasons.append("used_certain")
    elif used_by:
        reasons.append("used_probable")
    if action["has_statistics"]:
        reasons.append("has_statistics")
    if IGNORE_LABEL in (device.get("labels") or []) or any(
        IGNORE_LABEL in (item.get("labels") or []) for item in members
    ):
        reasons.append("ignored_by_label")
    if kind != "disable_device":
        _quarantine_reasons(action, reasons, (quarantine or {}).get(device_id), now)
        action["removal_supported"] = (support or {}).get("removal_supported")
        action["restorable"] = (support or {}).get("restorable")
        if kind == "remove_device" and not action["removal_supported"]:
            reasons.append("integration_no_support")
        if kind == "forget_device":
            if action["removal_supported"]:
                reasons.append("regular_removal_available")
            reasons.append("forced_forget")
        reasons.append("restore_limited")
        if action["restorable"] is False:
            reasons.append("not_restorable")
    _verdict(action)
    return action


def judge_reference_action(
    object_id: str,
    target: str | None,
    objects: dict[str, dict[str, Any]],
    edges: list[dict[str, Any]],
    sources: list[dict[str, Any]] | None,
) -> dict[str, Any]:
    """Judge replacing every reference to ``object_id`` by ``target``.

    The old entity may be gone already (a broken reference); the new one must exist, work, and
    be of the same domain. A replacement always rewrites configuration, so it is at least
    ``review``: the person confirms it entity by entity.
    """
    action: dict[str, Any] = {
        "kind": "replace_references",
        "object_id": object_id,
        "object_type": "entity",
        "target": target,
        "name": (objects.get(object_id) or {}).get("name") or object_id,
        "verdict": "blocked",
        "reasons": [],
        "used_by": _used_by(edges, f"entity:{object_id}"),
        "has_statistics": bool((objects.get(object_id) or {}).get("has_statistics")),
        "sources": sources or [],
    }
    reasons = action["reasons"]
    new = objects.get(target or "")
    old = objects.get(object_id)
    if not target or new is None:
        reasons.append("target_missing")
    elif target == object_id:
        reasons.append("same_entity")
    elif target.split(".", 1)[0] != object_id.split(".", 1)[0]:
        reasons.append("different_domain")
    elif new["status"] != "active":
        reasons.append("target_not_working")
    if new is not None and old is not None:
        if new.get("unit") != old.get("unit"):
            reasons.append("unit_differs")
        if new.get("device_class") != old.get("device_class"):
            reasons.append("class_differs")
    writable = [source for source in action["sources"] if source["writable"] and source["changes"]]
    if not writable:
        reasons.append("nothing_to_replace")
    elif any(not source["writable"] or source["manual"] for source in action["sources"]):
        reasons.append("source_manual")
    if any(source["type"] == "energy" for source in writable):
        reasons.append("energy_changes")
    if action["has_statistics"]:
        reasons.append("has_statistics")
    reasons.append("config_rewrite")
    _verdict(action)
    return action


def judge_meter_action(
    object_id: str,
    target: str | None,
    objects: dict[str, dict[str, Any]],
    edges: list[dict[str, Any]],
    meter: dict[str, Any],
) -> dict[str, Any]:
    """Judge joining a replaced meter's history onto its successor and/or its entity ID.

    ``meter`` carries ``mode`` (``statistics``, ``id`` or ``both``), the statistics ``analysis``,
    the free ``alt_id`` the old entity moves to, and whether both entities are in the registry.
    Writing statistics is always at least ``review``; nothing in it can be undone without the
    backup.
    """
    mode = meter.get("mode") or "both"
    analysis = meter.get("analysis") or {}
    action: dict[str, Any] = {
        "kind": "migrate_meter",
        "object_id": object_id,
        "object_type": "entity",
        "target": target,
        "mode": mode,
        "alt_id": meter.get("alt_id"),
        "name": (objects.get(object_id) or {}).get("name") or object_id,
        "verdict": "blocked",
        "reasons": [],
        "used_by": _used_by(edges, f"entity:{object_id}"),
        "has_statistics": True,
        "statistics": {k: v for k, v in analysis.items() if k != "reasons"},
    }
    reasons = action["reasons"]
    new = objects.get(target or "")
    if mode not in METER_MODES:
        reasons.append("nothing_to_do")
    if not target or new is None:
        reasons.append("target_missing")
    elif target == object_id:
        reasons.append("same_entity")
    elif target.split(".", 1)[0] != object_id.split(".", 1)[0]:
        reasons.append("different_domain")
    elif new["status"] != "active":
        reasons.append("target_not_working")
    old = objects.get(object_id)
    if new is not None and old is not None:
        if new.get("unit") != old.get("unit"):
            reasons.append("unit_differs")
        if new.get("device_class") != old.get("device_class"):
            reasons.append("class_differs")
    if mode in {"both", "statistics"}:
        reasons.extend(analysis.get("reasons", []))
        reasons.append("stats_write")
    if mode in {"both", "id"}:
        if not meter.get("old_in_registry"):
            reasons.append("old_not_in_registry")
        if not meter.get("target_in_registry"):
            reasons.append("target_not_in_registry")
        if meter.get("alt_taken"):
            reasons.append("alt_id_taken")
        reasons.append("id_takeover")
        if _used_by(edges, f"entity:{target}"):
            reasons.append("target_in_use")
    _verdict(action)
    return action


def judge_entity_action(
    kind: str,
    object_id: str,
    objects: dict[str, dict[str, Any]],
    edges: list[dict[str, Any]],
    quarantine: dict[str, str] | None = None,
    restorable: bool | None = None,
    now: datetime | None = None,
) -> dict[str, Any]:
    """Judge one entity candidate. Verdicts: ``ok`` (no known use), ``review``, ``blocked``.

    ``quarantine`` maps entity IDs to when Housekeeper disabled them; removal is only
    allowed after ``QUARANTINE_DAYS``. ``restorable`` tells whether a removed entity could be
    brought back (its config entry still exists).
    """
    action: dict[str, Any] = {
        "kind": kind,
        "object_id": object_id,
        "object_type": "entity",
        "name": object_id,
        "verdict": "blocked",
        "reasons": [],
        "used_by": [],
        "has_statistics": False,
    }
    if kind not in ENTITY_KINDS:
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
        _quarantine_reasons(action, reasons, (quarantine or {}).get(object_id), now)
        action["restorable"] = restorable
        if restorable is False:
            reasons.append("not_restorable")

    _verdict(action)
    return action


def build_plan(
    snapshot: dict[str, Any],
    requested: list[dict[str, str]],
    now: datetime,
    fingerprint: Callable[[str], str | None] | None = None,
    restorable: Callable[[str], bool | None] | None = None,
    *,
    device_info: Callable[[str], tuple[str | None, dict[str, Any]]] | None = None,
    reference_data: dict[tuple[str, str], tuple[str | None, list[dict[str, Any]]]] | None = None,
    meter_data: dict[tuple[str, str, str], dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """Create a dry-run plan for ``requested`` actions from the latest snapshot.

    ``fingerprint`` returns the registry fingerprint of an entity so that execution can
    detect changes made after the preview; ``restorable`` tells whether a removal could be
    undone. ``device_info`` gives a device's fingerprint and what its integration supports;
    ``reference_data`` maps ``(old, new)`` entity IDs to the fingerprint and the sources found
    for a replacement; ``meter_data`` maps ``(old, new, mode)`` to the fingerprint and judging data
    of a meter migration. A plan holds at most one action per object.
    """
    quarantine = {q["object_id"]: q["since"] for q in snapshot.get("quarantine", [])}
    objects = {
        item["object_id"]: item for item in snapshot["objects"] if item["object_type"] == "entity"
    }
    devices = {
        item["object_id"]: item for item in snapshot["objects"] if item["object_type"] == "device"
    }
    seen: set[str] = set()
    actions = []
    for request in requested[:MAX_ACTIONS]:
        kind, object_id = request["kind"], request["object_id"]
        if object_id in seen:
            continue
        seen.add(object_id)
        if kind in DEVICE_KINDS:
            device_print, support = device_info(object_id) if device_info else (None, {})
            action = judge_action(
                kind,
                object_id,
                objects,
                snapshot["edges"],
                quarantine,
                None,
                now,
                devices=devices,
                support=support,
            )
            action["fingerprint"] = device_print
        elif kind in METER_KINDS:
            target = request.get("target") or ""
            mode = request.get("mode") or "both"
            meter = (meter_data or {}).get((object_id, target, mode), {})
            action = judge_action(
                kind,
                object_id,
                objects,
                snapshot["edges"],
                target=target,
                meter={**meter, "mode": mode},
            )
            action["fingerprint"] = meter.get("fingerprint")
        elif kind in REFERENCE_KINDS:
            target = request.get("target") or ""
            reference_print, sources = (reference_data or {}).get((object_id, target), (None, []))
            action = judge_action(
                kind,
                object_id,
                objects,
                snapshot["edges"],
                target=target,
                sources=sources,
            )
            action["fingerprint"] = reference_print
        else:
            action = judge_action(
                kind,
                object_id,
                objects,
                snapshot["edges"],
                quarantine,
                restorable(object_id) if restorable else None,
                now,
            )
            action["fingerprint"] = fingerprint(object_id) if fingerprint else None
        action["executable"] = kind in EXECUTABLE_KINDS and action["verdict"] != "blocked"
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
