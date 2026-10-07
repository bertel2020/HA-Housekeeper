"""Diagnostics for HA Housekeeper.

Only aggregate counts are exported; names, IDs and attributes never leave the
installation, so the download is safe to attach to a bug report.
"""

from __future__ import annotations

from collections import Counter
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import __version__ as HA_VERSION
from homeassistant.core import HomeAssistant

from .const import DOMAIN


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    """Return anonymous scan statistics."""
    scanner = hass.data.get(DOMAIN, {}).get("scanner")
    if scanner is None:
        return {"home_assistant": HA_VERSION, "loaded": False}

    snapshot = scanner.snapshot
    findings = snapshot["findings"] if snapshot else []
    return {
        "home_assistant": HA_VERSION,
        "loaded": True,
        "scan_status": dict(scanner.status),
        "meta": snapshot["meta"] if snapshot else None,
        "edge_count": len(snapshot["edges"]) if snapshot else 0,
        "findings_by_rule": dict(Counter(item["rule_id"] for item in findings)),
        "findings_by_classification": dict(Counter(item["classification"] for item in findings)),
    }
