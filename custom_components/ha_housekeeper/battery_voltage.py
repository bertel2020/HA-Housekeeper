"""Batteries that report volts instead of a percentage.

A voltage alone does not say how full a battery is: a coin cell, two AA cells and a lithium cell all
read about 3 V when new but run empty at different values. So the type is guessed from the highest
daily mean in the last weeks (the "full" voltage) and shown with the guess, so a wrong guess is
visible. The limit comes from that type; the forecast is the same straight line as for percent
batteries, scaled to the voltage range. Only the long-term statistics are read.
"""

from __future__ import annotations

from typing import Any

from .battery_trend import estimate

UNITS = {"V": 1.0, "mV": 0.001}
# (lowest full voltage, below this full voltage, key, limit in volts)
TYPES: tuple[tuple[float, float, str, float], ...] = (
    (0.9, 1.75, "cell15", 1.1),  # one AA/AAA, alkaline or NiMH
    (2.2, 3.45, "coin3", 2.5),  # CR2032 and similar, or two AA in series; a dying one peaks lower
    (3.45, 4.45, "lithium", 3.4),  # one lithium-ion cell
    (4.45, 5.4, "cells3", 3.6),  # three AA/AAA in series
    (5.4, 7.0, "cells4", 4.8),  # four AA/AAA in series
    (7.0, 10.5, "block9", 6.5),  # 9 V block
    (10.5, 15.0, "lead12", 11.8),  # 12 V lead-acid or LiFePO4 pack
)
JUMP_SHARE = 0.07  # a rise by this share of the full voltage between two days means a new battery
FLAT_SHARE = 0.000375  # share of the usable range per day below which the curve counts as stable
NAME_HINTS = ("batter", "akku", "accu")


def is_voltage_battery(item: dict[str, Any]) -> bool:
    """A working sensor in volts that is a battery: by device class, or a voltage named like one."""
    if (
        not item["object_id"].startswith("sensor.")
        or item.get("status") != "active"
        or item.get("unit") not in UNITS
    ):
        return False
    if item.get("device_class") == "battery":
        return True
    text = f"{item.get('name', '')} {item['object_id']}".lower()
    return item.get("device_class") == "voltage" and any(hint in text for hint in NAME_HINTS)


def guess_type(full_volts: float) -> tuple[str, float] | None:
    for low, high, key, limit in TYPES:
        if low <= full_volts < high:
            return key, limit
    return None


def build(
    series: dict[str, list[tuple[float, float]]], names: dict[str, str], scale: dict[str, float]
) -> dict[str, Any]:
    """Rows with a guessed type, the limit and the forecast; low ones first, then the soonest."""
    rows = []
    for entity_id, raw in series.items():
        factor = scale.get(entity_id, 1.0)
        points = [(t, v * factor) for t, v in raw]
        if not points:
            continue
        full = max(v for _, v in points)
        kind = guess_type(full)
        if kind is None:
            continue
        key, limit = kind
        found = estimate(
            points, limit, jump=JUMP_SHARE * full, flat=FLAT_SHARE * max(full - limit, 0.1)
        )
        if found is None:
            continue
        rows.append(
            {
                "entity_id": entity_id,
                "name": names.get(entity_id, entity_id),
                "type": key,
                "limit": limit,
                **found,
            }
        )
    rows.sort(
        key=lambda r: (
            r["state"] != "low",
            r["days_left"] is None,
            r["days_left"] or 0,
            r["name"],
        )
    )
    return {"rows": rows, "unknown": len(series) - len(rows)}
