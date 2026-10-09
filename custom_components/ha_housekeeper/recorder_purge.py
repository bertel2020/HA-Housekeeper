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


HISTORY_IDS = 500  # IDs counted in one plan; the rest are simply not counted


def _count_history(hass: HomeAssistant, ids: list[str]) -> dict[str, dict[str, int]]:
    """Blocking: state rows and statistics rows (long and short term) per entity or statistic ID."""
    from homeassistant.components.recorder.db_schema import (
        States,
        StatesMeta,
        Statistics,
        StatisticsMeta,
        StatisticsShortTerm,
    )
    from homeassistant.components.recorder.util import session_scope
    from sqlalchemy import func, select

    rows = {i: {"states": 0, "statistics": 0} for i in ids}
    with session_scope(hass=hass, read_only=True) as session:
        for entity_id, count in session.execute(
            select(StatesMeta.entity_id, func.count(States.state_id))
            .join(StatesMeta, States.metadata_id == StatesMeta.metadata_id)
            .where(StatesMeta.entity_id.in_(ids))
            .group_by(StatesMeta.entity_id)
        ).all():
            rows[entity_id]["states"] = int(count)
        for table in (Statistics, StatisticsShortTerm):
            for statistic_id, count in session.execute(
                select(StatisticsMeta.statistic_id, func.count(table.id))
                .join(StatisticsMeta, table.metadata_id == StatisticsMeta.id)
                .where(StatisticsMeta.statistic_id.in_(ids))
                .group_by(StatisticsMeta.statistic_id)
            ).all():
                rows[statistic_id]["statistics"] += int(count)
    return rows


async def count_history(hass: HomeAssistant, ids: list[str]) -> dict[str, dict[str, int]] | None:
    """Exact row counts the recorder holds for ``ids``; None when they cannot be counted."""
    from homeassistant.components.recorder import get_instance

    wanted = list(dict.fromkeys(ids))[:HISTORY_IDS]
    if not wanted:
        return {}
    try:
        return await get_instance(hass).async_add_executor_job(_count_history, hass, wanted)
    except Exception:  # noqa: BLE001 - the plan is complete without the numbers
        return None
