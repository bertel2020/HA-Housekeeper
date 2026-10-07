"""Read-only Home Assistant inventory scanner."""

from __future__ import annotations

import asyncio
from collections import Counter
from datetime import UTC, datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import floor_registry as fr
from homeassistant.helpers import label_registry as lr

from .automation_analysis import (
    missing_references,
    summarize_automation_config,
)
from .observations import ObservationStore


def _iso(value: Any) -> str | None:
    """Serialize a datetime when the registry provides one."""
    return value.isoformat() if hasattr(value, "isoformat") else None


def _edge(source: str, target: str, relation: str) -> dict[str, str]:
    """Build a registry-derived dependency edge."""
    return {"source": source, "target": target, "relation": relation, "confidence": "certain"}


def _enum(value: Any) -> str | None:
    """Serialize an enum-like registry value."""
    if value is None:
        return None
    return str(getattr(value, "value", value))


def _registry_entries(collection: Any) -> list[Any]:
    """Return entries from legacy mappings and modern read-only collections."""
    return [collection[value] if isinstance(value, str) else value for value in collection]


def _device_config_entry_ids(device: Any) -> list[str]:
    """Return owning config entries without using HA's deprecated compatibility API."""
    if config_entry_id := getattr(device, "config_entry_id", None):
        return [config_entry_id]
    return sorted(getattr(device, "config_entries", ()))


def _entity_status(
    entry: Any,
    state: Any,
    config_entries: dict[str, Any],
    devices: dict[str, Any],
) -> tuple[str, str]:
    """Classify an entity conservatively and explain why."""
    if entry.disabled_by is not None:
        return "disabled", "entity_disabled"
    if entry.device_id and entry.device_id not in devices:
        return "orphaned", "device_missing"
    if entry.device_id and devices[entry.device_id].disabled_by is not None:
        return "disabled", "device_disabled"
    if entry.config_entry_id and entry.config_entry_id not in config_entries:
        return "orphaned", "config_entry_missing"
    if entry.config_entry_id and config_entries[entry.config_entry_id].disabled_by is not None:
        return "disabled", "integration_disabled"
    if state is None:
        return "orphaned", "state_missing"
    if state.state == "unavailable":
        return "unavailable", "state_unavailable"
    if state.state == "unknown":
        return "unknown", "state_unknown"
    return "active", "state_available"


def _entity_item(
    entry: Any, state: Any, config_entries: dict[str, Any], devices: dict[str, Any]
) -> dict[str, Any]:
    """Normalize one entity registry entry together with its live state."""
    status, reason = _entity_status(entry, state, config_entries, devices)
    return {
        "object_type": "entity",
        "object_id": entry.entity_id,
        "name": entry.name or entry.original_name or (state.name if state else entry.entity_id),
        "unique_id": entry.unique_id,
        "platform": entry.platform,
        "config_entry_id": entry.config_entry_id,
        "device_id": entry.device_id,
        "area_id": entry.area_id,
        "labels": sorted(entry.labels),
        "disabled_by": _enum(entry.disabled_by),
        "hidden_by": _enum(entry.hidden_by),
        "status": status,
        "reason": reason,
        "status_since": None,
        "status_since_source": "first_housekeeper_observation",
        "state": state.state if state else None,
        "attributes": dict(state.attributes) if state else {},
        "last_changed": _iso(state.last_changed) if state else None,
        "last_updated": _iso(state.last_updated) if state else None,
        "created_at": _iso(getattr(entry, "created_at", None)),
        "modified_at": _iso(getattr(entry, "modified_at", None)),
    }


def _device_item(device: Any, entity_count: int) -> dict[str, Any]:
    """Normalize one device registry entry."""
    status = "disabled" if device.disabled_by is not None else "active" if entity_count else "empty"
    return {
        "object_type": "device",
        "object_id": device.id,
        "name": device.name_by_user or device.name or device.id,
        "manufacturer": device.manufacturer,
        "model": device.model,
        "model_id": getattr(device, "model_id", None),
        "serial_number": getattr(device, "serial_number", None),
        "area_id": device.area_id,
        "config_entry_ids": _device_config_entry_ids(device),
        "via_device_id": device.via_device_id,
        "labels": sorted(device.labels),
        "disabled_by": _enum(device.disabled_by),
        "status": status,
        "entity_count": entity_count,
        "created_at": _iso(getattr(device, "created_at", None)),
        "modified_at": _iso(getattr(device, "modified_at", None)),
    }


def _area_item(area: Any) -> dict[str, Any]:
    return {
        "object_type": "area",
        "object_id": area.id,
        "name": area.name,
        "floor_id": area.floor_id,
        "labels": sorted(area.labels),
        "aliases": sorted(area.aliases),
        "status": "active",
    }


def _floor_item(floor: Any) -> dict[str, Any]:
    return {
        "object_type": "floor",
        "object_id": floor.floor_id,
        "name": floor.name,
        "level": floor.level,
        "aliases": sorted(floor.aliases),
        "status": "active",
    }


def _label_item(label: Any) -> dict[str, Any]:
    return {
        "object_type": "label",
        "object_id": label.label_id,
        "name": label.name,
        "description": label.description,
        "color": label.color,
        "status": "active",
    }


def _config_entry_item(entry: Any) -> dict[str, Any]:
    state = _enum(entry.state)
    status = "disabled" if entry.disabled_by else "active" if state == "loaded" else "problem"
    return {
        "object_type": "config_entry",
        "object_id": entry.entry_id,
        "name": entry.title,
        "domain": entry.domain,
        "source": entry.source,
        "state": state,
        "disabled_by": _enum(entry.disabled_by),
        "status": status,
    }


def _fallback_automation_item(state: Any) -> dict[str, Any]:
    """Describe an automation only known through its state object."""
    attrs = state.attributes
    return {
        "object_type": "automation",
        "object_id": state.entity_id,
        "name": attrs.get("friendly_name", state.entity_id),
        "automation_id": attrs.get("id"),
        "mode": attrs.get("mode"),
        "current": attrs.get("current", 0),
        "max": attrs.get("max"),
        "last_triggered": _iso(attrs.get("last_triggered")),
        "status": "active" if state.state == "on" else "disabled",
        "state": state.state,
        "source": "state_fallback",
        "description": "",
        "triggers": [],
        "conditions": [],
        "actions": [],
        "trigger_count": 0,
        "condition_count": 0,
        "action_count": 0,
        "references": [],
    }


def _long_enough(item: dict[str, Any], now: datetime, min_days: int) -> bool:
    """Whether an unavailable entity has been so for at least ``min_days``.

    Orphaned entities always qualify; only transient outages are filtered.
    """
    if min_days <= 0 or item["status"] != "unavailable":
        return True
    since = item.get("status_since")
    return bool(since) and now - datetime.fromisoformat(since) >= timedelta(days=min_days)


def _entity_findings(
    entities: list[dict[str, Any]],
    now: datetime | None = None,
    min_unavailable_days: int = 0,
) -> list[dict[str, Any]]:
    """Create findings for entities that need attention."""
    now = now or datetime.now(UTC)
    return [
        {
            "rule_id": f"entity.{item['reason']}",
            "object_id": item["object_id"],
            "classification": item["status"],
            "confidence": 0.98 if item["reason"] == "config_entry_missing" else 0.75,
            "first_detected_at": item["status_since"],
            "evidence": [{"kind": item["reason"], "source": "entity_registry"}],
        }
        for item in entities
        if item["status"] in {"orphaned", "unavailable"}
        and _long_enough(item, now, min_unavailable_days)
    ]


def _structure_edges(
    entities: list[dict[str, Any]],
    devices: list[dict[str, Any]],
    areas: list[dict[str, Any]],
) -> list[dict[str, str]]:
    """Create registry-derived dependency edges."""
    edges: list[dict[str, str]] = []
    for entity in entities:
        entity_key = f"entity:{entity['object_id']}"
        if entity["device_id"]:
            edges.append(_edge(f"device:{entity['device_id']}", entity_key, "PROVIDES"))
        if entity["config_entry_id"]:
            edges.append(_edge(f"config_entry:{entity['config_entry_id']}", entity_key, "PROVIDES"))
        if entity["area_id"]:
            edges.append(_edge(f"area:{entity['area_id']}", entity_key, "CONTAINS"))
    for device in devices:
        device_key = f"device:{device['object_id']}"
        edges.extend(
            _edge(f"config_entry:{entry_id}", device_key, "OWNS")
            for entry_id in device["config_entry_ids"]
        )
        if device["via_device_id"]:
            edges.append(_edge(f"device:{device['via_device_id']}", device_key, "VIA_DEVICE"))
        if device["area_id"]:
            edges.append(_edge(f"area:{device['area_id']}", device_key, "CONTAINS"))
    edges.extend(
        _edge(f"floor:{area['floor_id']}", f"area:{area['object_id']}", "CONTAINS")
        for area in areas
        if area["floor_id"]
    )
    return edges


DETAIL_FIELDS = ("attributes", "triggers", "conditions", "actions", "references")


def _split_details(objects: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    """Move bulky per-object fields out of the list payload into a detail index."""
    details: dict[str, dict[str, Any]] = {}
    for item in objects:
        bulky = {name: item.pop(name) for name in DETAIL_FIELDS if name in item}
        if bulky:
            details[f"{item['object_type']}:{item['object_id']}"] = bulky
    return details


class InventoryScanner:
    """Build and cache a normalized, read-only inventory."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.observations = ObservationStore(hass)
        self._lock = asyncio.Lock()
        self._snapshot: dict[str, Any] | None = None
        self._details: dict[str, dict[str, Any]] = {}
        self.min_unavailable_days = 0
        self.status: dict[str, Any] = {
            "running": False,
            "phase": "idle",
            "progress": 0,
            "last_error": None,
        }

    async def async_initialize(self) -> None:
        """Load persisted observations."""
        await self.observations.async_load()

    async def async_scan(self) -> dict[str, Any]:
        """Scan registries and states. Concurrent callers share serialized work."""
        async with self._lock:
            self.status.update(running=True, phase="registries", progress=5, last_error=None)
            try:
                snapshot = await self._async_build_snapshot()
                self._details = _split_details(snapshot["objects"])
                self._snapshot = snapshot
                self.status.update(running=False, phase="complete", progress=100)
                return snapshot
            except Exception as err:
                self.status.update(
                    running=False,
                    phase="failed",
                    last_error=f"{type(err).__name__}: {err}",
                )
                raise

    @property
    def snapshot(self) -> dict[str, Any] | None:
        """Return the latest snapshot without triggering a scan."""
        return self._snapshot

    async def async_get_snapshot(self) -> dict[str, Any]:
        """Return the latest snapshot, scanning on first access."""
        if self._snapshot is None:
            return await self.async_scan()
        return self._snapshot

    def get_details(self, object_type: str, object_id: str) -> dict[str, Any] | None:
        """Return bulky fields of one object from the latest snapshot."""
        if self._snapshot is None:
            return None
        key = f"{object_type}:{object_id}"
        if key in self._details:
            return self._details[key]
        known = any(
            f"{item['object_type']}:{item['object_id']}" == key
            for item in self._snapshot["objects"]
        )
        return {} if known else None

    async def _async_build_snapshot(self) -> dict[str, Any]:
        entity_registry = er.async_get(self.hass)
        device_registry = dr.async_get(self.hass)
        area_registry = ar.async_get(self.hass)
        floor_registry = fr.async_get(self.hass)
        label_registry = lr.async_get(self.hass)
        config_entries = self.hass.config_entries.async_entries()
        config_entries_by_id = {entry.entry_id: entry for entry in config_entries}
        device_entries = _registry_entries(device_registry.devices)
        devices_by_id = {device.id: device for device in device_entries}
        observed_at = datetime.now(UTC)

        entities = [
            _entity_item(
                entry, self.hass.states.get(entry.entity_id), config_entries_by_id, devices_by_id
            )
            for entry in _registry_entries(entity_registry.entities)
        ]
        self.status.update(phase="devices", progress=30)
        await asyncio.sleep(0)

        await self.observations.async_update(
            {f"entity:{item['object_id']}": item["status"] for item in entities}, observed_at
        )
        for item in entities:
            item["status_since"] = self.observations.since(
                f"entity:{item['object_id']}", item["status"]
            )

        entity_counts = Counter(item["device_id"] for item in entities if item["device_id"])
        devices = [_device_item(device, entity_counts[device.id]) for device in device_entries]
        areas = [_area_item(area) for area in _registry_entries(area_registry.areas)]
        floors = [_floor_item(floor) for floor in _registry_entries(floor_registry.floors)]
        labels = [_label_item(label) for label in _registry_entries(label_registry.labels)]
        integrations = [_config_entry_item(entry) for entry in config_entries]

        self.status.update(phase="automations", progress=60)
        await asyncio.sleep(0)
        automations, automation_edges, automation_findings = self._automation_inventory(
            entity_registry,
            device_registry,
            area_registry,
            floor_registry,
            label_registry,
        )
        known_automation_ids = {item["object_id"] for item in automations}
        automations.extend(
            _fallback_automation_item(state)
            for state in self.hass.states.async_all("automation")
            if state.entity_id not in known_automation_ids
        )

        edges = _structure_edges(entities, devices, areas) + automation_edges
        objects = entities + devices + integrations + areas + floors + labels + automations
        findings = (
            _entity_findings(entities, observed_at, self.min_unavailable_days) + automation_findings
        )

        self.status.update(phase="finalizing", progress=90)

        return {
            "meta": {
                "scanned_at": observed_at.isoformat(),
                "read_only": True,
                "object_count": len(objects),
                "status_counts": dict(Counter(item["status"] for item in objects)),
                "type_counts": dict(Counter(item["object_type"] for item in objects)),
            },
            "objects": objects,
            "edges": edges,
            "findings": findings,
        }

    def _automation_inventory(
        self,
        entity_registry: Any,
        device_registry: Any,
        area_registry: Any,
        floor_registry: Any,
        label_registry: Any,
    ) -> tuple[list[dict[str, Any]], list[dict[str, str]], list[dict[str, Any]]]:
        """Inspect loaded automation entities through Home Assistant runtime APIs."""
        try:
            from homeassistant.components.automation import DATA_COMPONENT
        except ImportError:
            return [], [], []

        component = self.hass.data.get(DATA_COMPONENT)
        if component is None:
            return [], [], []

        existing = {
            "entity": {entry.entity_id for entry in _registry_entries(entity_registry.entities)}
            | {state.entity_id for state in self.hass.states.async_all()},
            "device": {entry.id for entry in _registry_entries(device_registry.devices)},
            "area": {entry.id for entry in _registry_entries(area_registry.areas)},
            "floor": {entry.floor_id for entry in _registry_entries(floor_registry.floors)},
            "label": {entry.label_id for entry in _registry_entries(label_registry.labels)},
        }
        automations: list[dict[str, Any]] = []
        edges: list[dict[str, str]] = []
        findings: list[dict[str, Any]] = []

        for automation in component.entities:
            entity_id = automation.entity_id
            state = self.hass.states.get(entity_id)
            raw_config = getattr(automation, "raw_config", None)
            summary = summarize_automation_config(raw_config)
            references = summary["references"]

            # HA's runtime extraction also detects references inside templates.
            explicit_markers = {(ref["kind"], ref["object_id"]) for ref in references}
            runtime_sets = {
                "entity": getattr(automation, "referenced_entities", set()),
                "device": getattr(automation, "referenced_devices", set()),
                "area": getattr(automation, "referenced_areas", set()),
                "floor": getattr(automation, "referenced_floors", set()),
                "label": getattr(automation, "referenced_labels", set()),
            }
            for kind, object_ids in runtime_sets.items():
                for object_id in object_ids:
                    if (kind, object_id) not in explicit_markers:
                        references.append(
                            {
                                "kind": kind,
                                "object_id": object_id,
                                "relation": "REFERENCES",
                                "location": "runtime_extraction",
                                "confidence": "probable",
                            }
                        )

            for reference in references:
                edges.append(
                    {
                        "source": f"automation:{entity_id}",
                        "target": f"{reference['kind']}:{reference['object_id']}",
                        "relation": reference["relation"],
                        "confidence": reference["confidence"],
                        "location": reference["location"],
                    }
                )

            missing = missing_references(references, existing)
            for reference in missing:
                findings.append(
                    {
                        "rule_id": f"automation.missing_{reference['kind']}",
                        "object_id": entity_id,
                        "classification": "broken_reference",
                        "confidence": 0.98,
                        "first_detected_at": None,
                        "affected_object": reference["object_id"],
                        "evidence": [
                            {
                                "kind": "missing_reference",
                                "source": "automation_runtime_config",
                                "location": reference["location"],
                            }
                        ],
                    }
                )

            attrs = state.attributes if state else {}
            blueprint = getattr(automation, "referenced_blueprint", None)
            automations.append(
                {
                    "object_type": "automation",
                    "object_id": entity_id,
                    "name": getattr(automation, "name", None)
                    or attrs.get("friendly_name", entity_id),
                    "automation_id": getattr(automation, "unique_id", None),
                    "mode": attrs.get("mode"),
                    "current": attrs.get("current", 0),
                    "max": attrs.get("max"),
                    "last_triggered": _iso(attrs.get("last_triggered")),
                    "status": "unavailable"
                    if state is None or state.state == "unavailable"
                    else ("active" if state.state == "on" else "disabled"),
                    "state": state.state if state else None,
                    "source": "blueprint" if blueprint else "home_assistant_runtime",
                    "blueprint": blueprint,
                    "missing_reference_count": len(missing),
                    **summary,
                }
            )

        return automations, edges, findings
