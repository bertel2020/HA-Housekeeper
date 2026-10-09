"""Remove the recorder data of entities that no longer exist.

The only writing step outside the cleanup plans, and the narrowest: it deletes the statistics
(long-term and short-term) of statistic IDs that the last scan listed as orphaned, optionally the
recorded states of the same IDs too. It never touches an ID that exists now, one the Energy
dashboard uses, or an external statistic. A Home Assistant backup is created first; if it fails,
nothing is deleted. The deletion cannot be undone except from that backup.
"""

from __future__ import annotations

import asyncio
import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

_LOGGER = logging.getLogger(__name__)

MAX_IDS = 50
BACKUP_TIMEOUT = 30 * 60  # seconds, as for the cleanup plans


def judge(
    requested: list[str],
    orphans: dict[str, dict[str, Any]],
    exists: set[str],
) -> tuple[list[str], list[dict[str, str]]]:
    """Which of ``requested`` may be deleted, and why the others may not."""
    allowed, skipped = [], []
    for statistic_id in dict.fromkeys(requested):
        if statistic_id in exists:
            skipped.append({"id": statistic_id, "reason": "exists"})
        elif statistic_id not in orphans:
            skipped.append({"id": statistic_id, "reason": "not_orphaned"})
        elif orphans[statistic_id].get("in_energy"):
            skipped.append({"id": statistic_id, "reason": "in_energy"})
        else:
            allowed.append(statistic_id)
    return allowed, skipped


async def _backup(hass: HomeAssistant) -> str | None:
    """Create the backup and wait for it; the reason as text if there is none."""
    try:
        from homeassistant.components.backup import async_get_manager

        manager = async_get_manager(hass)
    except Exception:  # noqa: BLE001 - no backup component
        return "backup_unavailable"
    if not manager.config.data.create_backup.agent_ids:
        return "no_backup_agent"
    try:
        async with asyncio.timeout(BACKUP_TIMEOUT):
            await manager.async_create_automatic_backup()
    except Exception as err:  # noqa: BLE001 - the reason goes to the person
        _LOGGER.warning("Backup before the recorder purge failed: %s", err)
        return "backup_failed"
    return None


async def purge_orphans(
    hass: HomeAssistant,
    snapshot: dict[str, Any],
    statistic_ids: list[str],
    *,
    states: bool,
) -> dict[str, Any]:
    """Delete the statistics (and optionally the states) of orphaned IDs after a backup."""
    from homeassistant.components.recorder import get_instance
    from homeassistant.components.recorder.statistics import get_metadata

    orphans = {item["statistic_id"]: item for item in snapshot.get("orphaned_statistics", [])}
    registry = er.async_get(hass)
    exists = {
        sid
        for sid in statistic_ids
        if registry.async_get(sid) is not None or hass.states.get(sid) is not None
    }
    allowed, skipped = judge(statistic_ids[:MAX_IDS], orphans, exists)
    result: dict[str, Any] = {"removed": [], "skipped": skipped, "backup": False, "states": states}
    if not allowed:
        return result
    if (reason := await _backup(hass)) is not None:
        result["error"] = reason
        return result
    result["backup"] = True
    instance = get_instance(hass)
    instance.async_clear_statistics(allowed)
    await instance.async_block_till_done()
    if states:
        await hass.services.async_call(
            "recorder", "purge_entities", {"entity_id": allowed}, blocking=True
        )
        await instance.async_block_till_done()
    left = await instance.async_add_executor_job(
        lambda: set(get_metadata(hass, statistic_ids=set(allowed)))
    )
    result["removed"] = [sid for sid in allowed if sid not in left]
    result["skipped"] += [{"id": sid, "reason": "still_there"} for sid in allowed if sid in left]
    return result
