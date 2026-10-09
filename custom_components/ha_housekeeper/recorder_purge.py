"""Delete the recorder data of statistic IDs that were judged as orphaned.

Used by the plan action ``purge_statistics``, which judges, backs up and verifies. This module only
deletes the statistics (long-term and short-term) and optionally the recorded states, under the
shared recorder query lock.
"""

from __future__ import annotations

import asyncio

from homeassistant.core import HomeAssistant

from .const import DOMAIN

MAX_IDS = 50
QUERY_WAIT = 30  # seconds to wait for a running recorder query before giving up


async def statistics_left(hass: HomeAssistant, statistic_ids: list[str]) -> set[str]:
    """The statistic IDs among ``statistic_ids`` that the recorder still knows."""
    from homeassistant.components.recorder import get_instance
    from homeassistant.components.recorder.statistics import get_metadata

    wanted = set(statistic_ids)
    return await get_instance(hass).async_add_executor_job(
        lambda: set(get_metadata(hass, statistic_ids=wanted))
    )


async def delete_statistics(
    hass: HomeAssistant, statistic_ids: list[str], *, states: bool
) -> tuple[list[str], list[dict[str, str]], str | None]:
    """Delete the statistics (and optionally the states) of IDs already judged as orphaned.

    Waits up to ``QUERY_WAIT`` seconds for the shared recorder query lock and holds it while it
    deletes, so no slow query reads the tables in between. Returns the IDs gone, the IDs still
    there, and ``recorder_busy`` when the lock stayed taken (nothing was deleted then).
    """
    from homeassistant.components.recorder import get_instance

    store = hass.data.setdefault(DOMAIN, {})
    lock: asyncio.Lock = store.setdefault("reliability_lock", asyncio.Lock())
    try:
        async with asyncio.timeout(QUERY_WAIT):
            await lock.acquire()
    except TimeoutError:
        return [], [], "recorder_busy"
    try:
        instance = get_instance(hass)
        instance.async_clear_statistics(statistic_ids)
        await instance.async_block_till_done()
        if states:
            await hass.services.async_call(
                "recorder", "purge_entities", {"entity_id": statistic_ids}, blocking=True
            )
            await instance.async_block_till_done()
        left = await statistics_left(hass, statistic_ids)
    finally:
        lock.release()
    removed = [sid for sid in statistic_ids if sid not in left]
    if removed:
        store.get("query_cache", {}).clear()  # cost and statistics answers are out of date now
    return (
        removed,
        [{"id": sid, "reason": "still_there"} for sid in statistic_ids if sid in left],
        None,
    )
