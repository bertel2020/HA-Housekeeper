"""Delete the recorder data of statistic IDs that were judged as orphaned.

Used by the plan action ``purge_statistics``, which judges, backs up and verifies. This module only
deletes the statistics (long-term and short-term) and optionally the recorded states, under the
shared recorder query lock.
"""

from __future__ import annotations

import asyncio
from typing import Any

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


TRIM_MAX_DAYS = 3650
TRIM_IDS = 200


def _count_older(hass: HomeAssistant, ids: list[str], keep_days: int) -> dict[str, dict[str, Any]]:
    """Blocking: state rows older than ``keep_days`` days per entity, with the oldest time."""
    from datetime import UTC, datetime, timedelta

    from homeassistant.components.recorder.db_schema import States, StatesMeta
    from homeassistant.components.recorder.util import session_scope
    from sqlalchemy import func, select

    cutoff = (datetime.now(UTC) - timedelta(days=keep_days)).timestamp()
    found: dict[str, dict[str, Any]] = {i: {"rows": 0, "oldest": None} for i in ids}
    with session_scope(hass=hass, read_only=True) as session:
        for entity_id, rows, oldest in session.execute(
            select(
                StatesMeta.entity_id, func.count(States.state_id), func.min(States.last_updated_ts)
            )
            .join(StatesMeta, States.metadata_id == StatesMeta.metadata_id)
            .where(StatesMeta.entity_id.in_(ids), States.last_updated_ts < cutoff)
            .group_by(StatesMeta.entity_id)
        ).all():
            found[entity_id] = {"rows": int(rows), "oldest": float(oldest)}
    return found


async def count_older(
    hass: HomeAssistant, ids: list[str], keep_days: int
) -> dict[str, dict[str, Any]] | None:
    """State rows that ``trim_history`` would delete; None when they cannot be counted."""
    from homeassistant.components.recorder import get_instance

    wanted = list(dict.fromkeys(ids))[:TRIM_IDS]
    if not wanted:
        return {}
    try:
        return await get_instance(hass).async_add_executor_job(
            _count_older, hass, wanted, keep_days
        )
    except Exception:  # noqa: BLE001 - without the count the plan cannot judge, it says so
        return None


async def trim_states(
    hass: HomeAssistant, entity_id: str, keep_days: int
) -> tuple[int | None, str | None]:
    """Delete the state rows of one entity older than ``keep_days`` days; statistics stay.

    Holds the shared recorder query lock. Returns the rows left that are still too old (None when
    they cannot be counted) and ``recorder_busy`` when the lock stayed taken (nothing was deleted).
    """
    from homeassistant.components.recorder import get_instance

    store = hass.data.setdefault(DOMAIN, {})
    lock: asyncio.Lock = store.setdefault("reliability_lock", asyncio.Lock())
    try:
        async with asyncio.timeout(QUERY_WAIT):
            await lock.acquire()
    except TimeoutError:
        return None, "recorder_busy"
    try:
        await hass.services.async_call(
            "recorder",
            "purge_entities",
            {"entity_id": [entity_id], "keep_days": keep_days},
            blocking=True,
        )
        await get_instance(hass).async_block_till_done()
    finally:
        lock.release()
    store.get("query_cache", {}).clear()
    left = await count_older(hass, [entity_id], keep_days)
    return (None if left is None else left[entity_id]["rows"]), None
