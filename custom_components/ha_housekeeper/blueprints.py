"""Blueprints: which ones nothing uses any more, and which automations point to one that is gone.

Only reads. A blueprint is "used" when an automation or script in the snapshot names its path.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from .payloads import BlueprintsResult

DOMAINS = ("automation", "script")
LIST_LIMIT = 100
USERS_LIMIT = 5


def evaluate(
    available: dict[str, dict[str, dict[str, Any]]],
    users: dict[str, dict[str, list[dict[str, str]]]],
) -> BlueprintsResult:
    """``available``: domain -> path -> {name, ok}; ``users``: domain -> path -> [{id, name}]."""
    domains = []
    totals = {"unused": 0, "missing": 0, "broken": 0}
    for domain in DOMAINS:
        files = available.get(domain, {})
        used = users.get(domain, {})
        unused = [
            {"path": path, "name": info["name"]}
            for path, info in sorted(files.items())
            if info["ok"] and not used.get(path)
        ]
        broken = [
            {
                "path": path,
                "users": used.get(path, [])[:USERS_LIMIT],
                "count": len(used.get(path, [])),
            }
            for path, info in sorted(files.items())
            if not info["ok"]
        ]
        missing = [
            {"path": path, "users": people[:USERS_LIMIT], "count": len(people)}
            for path, people in sorted(used.items())
            if path not in files
        ]
        totals["unused"] += len(unused)
        totals["missing"] += len(missing)
        totals["broken"] += len(broken)
        domains.append(
            {
                "domain": domain,
                "total": len(files),
                "unused": unused[:LIST_LIMIT],
                "missing": missing[:LIST_LIMIT],
                "broken": broken[:LIST_LIMIT],
            }
        )
    return {"available": True, "domains": domains, **totals}  # type: ignore[typeddict-item]


async def async_blueprints(hass: HomeAssistant, snapshot: dict[str, Any]) -> BlueprintsResult:
    """Blueprints of Home Assistant against the automations and scripts in the snapshot."""
    from homeassistant.components.automation.helpers import (
        async_get_blueprints as automation_blueprints,
    )
    from homeassistant.components.blueprint.errors import BlueprintException
    from homeassistant.components.script.helpers import async_get_blueprints as script_blueprints

    getters = {"automation": automation_blueprints, "script": script_blueprints}
    available: dict[str, dict[str, dict[str, Any]]] = {}
    for domain, getter in getters.items():
        found: dict[str, dict[str, Any]] = {}
        for path, blueprint in (await getter(hass).async_get_blueprints()).items():
            ok = blueprint is not None and not isinstance(blueprint, BlueprintException)
            found[str(path)] = {"ok": ok, "name": getattr(blueprint, "name", None) or str(path)}
        available[domain] = found
    users: dict[str, dict[str, list[dict[str, str]]]] = {domain: {} for domain in DOMAINS}
    for item in snapshot["objects"]:
        path = item.get("blueprint")
        if item["object_type"] in DOMAINS and isinstance(path, str) and path:
            users[item["object_type"]].setdefault(path, []).append(
                {"id": item["object_id"], "name": item.get("name") or item["object_id"]}
            )
    return evaluate(available, users)
