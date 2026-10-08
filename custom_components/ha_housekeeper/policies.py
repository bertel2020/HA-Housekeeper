"""Quality policies: rules you switch on, and the objects that break them.

Only reads. A policy violation is a hint about tidiness, never a defect: it is not part of the
findings, the health ring, the repair hints or the sensors. All rules are off until switched on.
A violation is hidden through the label ``housekeeper_ignore`` on the object or through the ignore
list of Housekeeper (the key is ``policy.<rule>|<object id>|``).
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import IGNORE_LABEL, POLICIES_STORAGE_KEY, STORAGE_VERSION
from .hygiene import finding_key
from .payloads import PoliciesResult

SAVE_DELAY = 10
ITEM_LIMIT = 200
RULES = ("entity_area", "device_area", "automation_description", "battery_device")
KEY_PREFIX = "policy."


def policy_key(rule: str, object_id: str) -> str:
    """The ignore-list key of one violation; same shape as the key of a finding."""
    return finding_key({"rule_id": f"{KEY_PREFIX}{rule}", "object_id": object_id})


class PolicyStore:
    """Which rules are switched on."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, POLICIES_STORAGE_KEY)
        self.enabled: set[str] = set()

    async def async_load(self) -> None:
        """Load the switches; anything that is not a known rule set to ``true`` is dropped."""
        data = await self._store.async_load()
        if not isinstance(data, dict) or not isinstance(data.get("enabled"), dict):
            return
        self.enabled = {
            rule for rule, on in data["enabled"].items() if rule in RULES and on is True
        }

    def set_enabled(self, rule: str, on: bool) -> None:
        """Switch one rule and persist the change."""
        if rule not in RULES:
            raise ValueError(rule)
        if on == (rule in self.enabled):
            return
        (self.enabled.add if on else self.enabled.discard)(rule)
        self._store.async_delay_save(self._data, SAVE_DELAY)

    def _data(self) -> dict[str, Any]:
        return {"enabled": {rule: True for rule in sorted(self.enabled)}}


def _entity_area(objects: dict[str, dict[str, Any]], devices: dict[str, dict[str, Any]]):
    """Physical entities: with a device, no category, not disabled, and no area of their own or from the device."""
    for item in objects.values():
        device = devices.get(item.get("device_id") or "")
        if (
            device is None
            or item.get("disabled_by")
            or item.get("entity_category")
            or device.get("entry_type") == "service"
            or item.get("area_id")
            or device.get("area_id")
        ):
            continue
        yield item


def _device_area(devices: dict[str, dict[str, Any]]):
    """Devices that are used, not services, not sub-devices, without an area."""
    for item in devices.values():
        if (
            item.get("status") == "active"
            and item.get("device_kind") != "child"
            and item.get("entry_type") != "service"
            and not item.get("area_id")
        ):
            yield item


def _automation_description(automations: list[dict[str, Any]]):
    """Automations with a configuration but an empty description."""
    for item in automations:
        if (
            item.get("source") != "state_fallback"
            and not str(item.get("description") or "").strip()
        ):
            yield item


def _battery_device(entities: dict[str, dict[str, Any]]):
    """Battery entities that belong to no device."""
    for item in entities.values():
        if (
            item.get("device_class") == "battery"
            and not item.get("device_id")
            and not item.get("disabled_by")
        ):
            yield item


def evaluate(
    snapshot: dict[str, Any],
    enabled: set[str] | frozenset[str],
    ignored_keys: set[str],
    labelled: set[str],
) -> PoliciesResult:
    """Violations per rule. ``labelled`` holds the object ids that carry the ignore label."""
    by_type: dict[str, list[dict[str, Any]]] = {}
    for item in snapshot["objects"]:
        by_type.setdefault(item["object_type"], []).append(item)
    entities = {i["object_id"]: i for i in by_type.get("entity", [])}
    devices = {i["object_id"]: i for i in by_type.get("device", [])}
    found = {
        "entity_area": lambda: _entity_area(entities, devices),
        "device_area": lambda: _device_area(devices),
        "automation_description": lambda: _automation_description(by_type.get("automation", [])),
        "battery_device": lambda: _battery_device(entities),
    }
    rules = []
    for rule in RULES:
        if rule not in enabled:
            rules.append({"id": rule, "enabled": False, "count": 0, "ignored": 0, "items": []})
            continue
        items, ignored = [], 0
        for item in found[rule]():
            key = policy_key(rule, item["object_id"])
            hidden = item["object_id"] in labelled or key in ignored_keys
            ignored += hidden
            items.append(
                {
                    "object_type": item["object_type"],
                    "object_id": item["object_id"],
                    "name": item.get("name") or item["object_id"],
                    "key": key,
                    "ignored": bool(hidden),
                    "by": "label" if item["object_id"] in labelled else "user" if hidden else None,
                }
            )
        items.sort(key=lambda i: (i["ignored"], i["name"].casefold(), i["object_id"]))
        rules.append(
            {
                "id": rule,
                "enabled": True,
                "count": len(items) - ignored,
                "ignored": ignored,
                "items": items[:ITEM_LIMIT],
            }
        )
    return {
        "available": True,
        "rules": rules,  # type: ignore[typeddict-item]
        "violations": sum(r["count"] for r in rules),
        "enabled": len(enabled),
    }


def policies(
    hass: HomeAssistant, snapshot: dict[str, Any], store: PolicyStore, ignored: Any
) -> PoliciesResult:
    """The result for the panel: the rules, how many objects break each, and which are hidden."""
    from homeassistant.helpers import entity_registry as er

    registry = er.async_get(hass)
    labelled = {
        item["object_id"]
        for item in snapshot["objects"]
        if item["object_type"] in ("entity", "device")
        and IGNORE_LABEL in (item.get("labels") or [])
    }
    for item in snapshot["objects"]:
        if item["object_type"] == "automation":
            entry = registry.async_get(item["object_id"])
            if entry is not None and IGNORE_LABEL in entry.labels:
                labelled.add(item["object_id"])
    keys = {
        policy_key(rule, item["object_id"])
        for rule in RULES
        for item in snapshot["objects"]
        if ignored.is_ignored(policy_key(rule, item["object_id"]))
    }
    return evaluate(snapshot, store.enabled, keys, labelled)
