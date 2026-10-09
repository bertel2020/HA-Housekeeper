"""What the world looks like after a plan, calculated before anything runs.

Only the actions that could run (``executable``) count. The numbers come from the last scan and
from the previews of the replacements; they say what Housekeeper can see. References inside
templates and anything outside Home Assistant stay uncertain, and the report says so.
"""

from __future__ import annotations

from typing import Any

SHOWN = 20
REMOVING = {"remove_entity", "remove_device", "forget_device"}
DISABLING = {"disable_entity", "disable_device"}


def simulate(actions: list[dict[str, Any]]) -> dict[str, Any]:
    """Summarize the end state of ``actions`` (as built by ``build_plan``)."""
    runnable = [a for a in actions if a.get("executable")]
    removed: set[str] = set()
    disabled: set[str] = set()
    devices = {"removed": 0, "disabled": 0}
    changed: dict[tuple[str, str], int] = {}
    meters = 0
    certain: set[tuple[str, str]] = set()
    uncertain: set[tuple[str, str]] = set()
    statistics: set[str] = set()
    manual = 0
    for action in runnable:
        kind, object_id = action["kind"], action["object_id"]
        entities = action.get("entities") or [object_id]
        if kind in REMOVING:
            removed.update(entities)
            devices["removed"] += kind != "remove_entity"
        elif kind in DISABLING:
            disabled.update(entities)
            devices["disabled"] += kind == "disable_device"
        if kind in REMOVING and action.get("has_statistics"):
            statistics.add(object_id)
        if kind == "migrate_meter":
            meters += 1
        if kind == "replace_references":
            for source in action.get("sources") or []:
                if source.get("writable") and source.get("changes"):
                    key = (source["name"], source["type"])
                    changed[key] = changed.get(key, 0) + source.get("change_count", 0)
                else:
                    manual += 1
                manual += len(source.get("manual") or [])
        elif kind in REMOVING | DISABLING:
            for use in action.get("used_by") or []:
                (certain if use["confidence"] == "certain" else uncertain).add(
                    (use["source"], object_id)
                )
    return {
        "removed": len(removed),
        "removed_devices": devices["removed"],
        "disabled": len(disabled),
        "disabled_devices": devices["disabled"],
        "replaced": sum(changed.values()),
        "replaced_by_source": [
            {"name": name, "type": kind, "count": count}
            for (name, kind), count in sorted(changed.items(), key=lambda i: (-i[1], i[0]))[:SHOWN]
        ],
        "meters": meters,
        "remaining_certain": len(certain),
        "remaining_uncertain": len(uncertain) + manual,
        "remaining_sources": sorted({source for source, _ in certain})[:SHOWN],
        "statistics_orphaned": sorted(statistics)[:SHOWN],
        "statistics_orphaned_count": len(statistics),
        "blocked": len(actions) - len(runnable),
    }
