"""When a statistic last received a value: one grouped read of the long-term statistics.

Only reads. The query runs when the list of orphaned statistics or the details of an entity are
opened, never during a scan, and shares cache and lock with the other recorder queries.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from .meter import recorder_ready
from .payloads import StatisticsLastResult
from .queries import cached_query

CACHE_SECONDS = 600


def query_last(hass: HomeAssistant) -> dict[str, float]:
    """Blocking: the start of the newest hourly row of every recorder statistic."""
    from homeassistant.components.recorder.db_schema import Statistics, StatisticsMeta
    from homeassistant.components.recorder.util import session_scope
    from sqlalchemy import func, select

    with session_scope(hass=hass, read_only=True) as session:
        latest = (
            select(Statistics.metadata_id, func.max(Statistics.start_ts).label("last"))
            .group_by(Statistics.metadata_id)
            .subquery()
        )
        rows = session.execute(
            select(StatisticsMeta.statistic_id, latest.c.last)
            .join(latest, latest.c.metadata_id == StatisticsMeta.id)
            .where(StatisticsMeta.source == "recorder")
        ).all()
    return {statistic_id: float(last) for statistic_id, last in rows if last is not None}


async def statistics_last(
    hass: HomeAssistant,
    snapshot: dict[str, Any],
    ids: list[str] | None = None,
    *,
    refresh: bool = False,
) -> StatisticsLastResult:
    """Last hourly value per statistic (epoch seconds); ``None`` when it has no row.

    Without ``ids`` the orphaned statistics of the snapshot are answered.
    """
    if not recorder_ready(hass):
        return {"available": False, "busy": False, "last": {}}
    found = await cached_query(
        hass, "statistics_last", CACHE_SECONDS, lambda: query_last(hass), refresh=refresh
    )
    if found.busy:
        return {"available": True, "busy": True, "last": {}}
    if ids is None:
        ids = [item["statistic_id"] for item in snapshot.get("orphaned_statistics", [])]
    return {
        "available": True,
        "busy": False,
        "last": {statistic_id: found.raw.get(statistic_id) for statistic_id in ids},
    }
