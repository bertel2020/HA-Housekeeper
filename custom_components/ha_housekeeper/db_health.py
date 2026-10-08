"""Recorder database health: size, growth, duplicate and missing statistics, gaps in the states.

Only reads. Nothing is repaired and nothing is deleted. Only SQLite is measured (the size of the
files); the statistics and gap checks work on every database the recorder supports. The queries
share the lock of the reliability query and the result is kept for a few minutes.
"""

from __future__ import annotations

import os
import time
from datetime import UTC, date, datetime
from typing import Any

from homeassistant.core import HomeAssistant

from .meter import recorder_ready
from .queries import cached_query

DAY = 86400
CACHE_SECONDS = 600
WAL_SHARE = 0.25
WAL_BYTES = 1024**3
GROWTH_FACTOR = 2.0
GROWTH_MIN_BYTES = 100 * 1024**2
GROWTH_RECENT_DAYS = 7
GROWTH_BASE_DAYS = 28
GAP_WINDOW_DAYS = 30
GAP_MIN_HOURS = 6  # missing hours in a statistics series before it is named
GAP_SERIES_LIMIT = 200
DUPLICATE_LIMIT = 5000
STATE_GAP_MINUTES = 10
STATE_GAP_WINDOW_DAYS = 7
RESTART_GRACE = 60  # seconds a gap may reach beyond the downtime and still count as the restart
LIST_LIMIT = 5
# Findings of validate_statistics that mean "gone or not recorded" belong to the unused view.
IGNORED_ISSUES = {"no_state", "entity_no_longer_recorded", "entity_not_recorded"}


def database_files(hass: HomeAssistant) -> dict[str, Any]:
    """Blocking: the size of the database and WAL file, for SQLite only."""
    from homeassistant.components.recorder import get_instance

    instance = get_instance(hass)
    dialect = str(
        getattr(getattr(instance, "dialect_name", None), "value", None)
        or getattr(instance, "dialect_name", "")
        or ""
    )
    result: dict[str, Any] = {"dialect": dialect, "db_bytes": None, "wal_bytes": None}
    if dialect != "sqlite":
        return result
    try:
        from sqlalchemy.engine import make_url

        name = make_url(instance.db_url).database
    except Exception:
        name = None
    if not name or name == ":memory:":
        return result
    path = name if os.path.isabs(name) else hass.config.path(name)
    for key, suffix in (("db_bytes", ""), ("wal_bytes", "-wal")):
        try:
            result[key] = os.stat(path + suffix).st_size
        except OSError:
            result[key] = 0 if suffix else None
    return result


def query_db(hass: HomeAssistant, now: float) -> dict[str, Any]:
    """Blocking: statistics duplicates and gaps, validation issues and gaps in the states."""
    from homeassistant.components.recorder.db_schema import (
        States,
        Statistics,
        StatisticsMeta,
    )
    from homeassistant.components.recorder.statistics import validate_statistics
    from homeassistant.components.recorder.util import session_scope
    from sqlalchemy import Integer, cast, func, select

    started = time.monotonic()
    result: dict[str, Any] = {"now": now, **database_files(hass)}
    with session_scope(hass=hass, read_only=True) as session:
        names = {
            metadata_id: (statistic_id, source)
            for metadata_id, statistic_id, source in session.execute(
                select(StatisticsMeta.id, StatisticsMeta.statistic_id, StatisticsMeta.source)
            ).all()
        }
        duplicates = session.execute(
            select(Statistics.metadata_id, Statistics.start_ts, func.count().label("n"))
            .group_by(Statistics.metadata_id, Statistics.start_ts)
            .having(func.count() > 1)
            .limit(DUPLICATE_LIMIT)
        ).all()
        result["duplicates"] = [
            {"statistic_id": names.get(mid, ("?", ""))[0], "start": float(ts), "count": int(n)}
            for mid, ts, n in duplicates
        ]
        since = now - GAP_WINDOW_DAYS * DAY
        result["series"] = [
            {
                "statistic_id": names[mid][0],
                "rows": int(rows),
                "first": float(first),
                "last": float(last),
            }
            for mid, rows, first, last in session.execute(
                select(
                    Statistics.metadata_id,
                    func.count(func.distinct(Statistics.start_ts)),
                    func.min(Statistics.start_ts),
                    func.max(Statistics.start_ts),
                )
                .where(Statistics.start_ts >= since)
                .group_by(Statistics.metadata_id)
            ).all()
            if mid in names and names[mid][1] == "recorder"
        ]
        bucket = cast(States.last_updated_ts / 60, Integer)
        window = now - STATE_GAP_WINDOW_DAYS * DAY
        result["state_minutes"] = sorted(
            int(minute)
            for (minute,) in session.execute(
                select(bucket).where(States.last_updated_ts >= window).group_by(bucket)
            ).all()
            if minute is not None
        )
    issues: dict[str, list[str]] = {}
    for statistic_id, found in validate_statistics(hass).items():
        types = sorted({str(issue.type) for issue in found} - IGNORED_ISSUES)
        if types:
            issues[statistic_id] = types
    result["issues"] = issues
    result["took_ms"] = round((time.monotonic() - started) * 1000)
    return result


def growth(sizes: dict[str, int], today: date) -> dict[str, Any]:
    """Growth of the last week against the weeks before, from the daily sizes."""

    def at(offset: int) -> int | None:
        """The latest sample on or before ``today - offset`` days within three days of it."""
        for step in range(offset, offset + 4):
            value = sizes.get((today.fromordinal(today.toordinal() - step)).isoformat())
            if value is not None:
                return value
        return None

    latest, week_ago = at(0), at(GROWTH_RECENT_DAYS)
    base_start = at(GROWTH_RECENT_DAYS + GROWTH_BASE_DAYS)
    if latest is None or week_ago is None:
        return {"known": False, "samples": len(sizes)}
    recent = latest - week_ago
    result: dict[str, Any] = {
        "known": True,
        "samples": len(sizes),
        "recent_bytes": recent,
        "per_day": round(recent / GROWTH_RECENT_DAYS),
    }
    if base_start is not None:
        base = (week_ago - base_start) / (GROWTH_BASE_DAYS / GROWTH_RECENT_DAYS)
        result["base_bytes"] = round(base)
    return result


def state_gaps(
    minutes: list[int], now: float, down: list[tuple[float, float]]
) -> list[dict[str, Any]]:
    """Stretches of STATE_GAP_MINUTES or more without any row, told apart from restarts."""
    gaps = []
    pairs = list(zip(minutes, minutes[1:], strict=False))
    if minutes:
        pairs.append((minutes[-1], int(now // 60)))
    for a, b in pairs:
        if b - a < STATE_GAP_MINUTES:
            continue
        start, end = a * 60.0 + 60, b * 60.0
        restart = any(lo - RESTART_GRACE <= end and start <= hi + RESTART_GRACE for lo, hi in down)
        gaps.append(
            {
                "start": start,
                "end": end,
                "seconds": round(end - start),
                "cause": "restart" if restart else "recorder",
            }
        )
    return gaps


def down_periods(events: list[dict[str, Any]]) -> list[tuple[float, float]]:
    """Intervals Home Assistant was down, from the start entries that carry ``down_seconds``."""
    periods = []
    for event in events:
        if event.get("kind") != "start" or not isinstance(event.get("down_seconds"), int):
            continue
        try:
            end = datetime.fromisoformat(event["at"]).timestamp()
        except (KeyError, ValueError):
            continue
        periods.append((end - event["down_seconds"], end))
    return periods


def evaluate(
    raw: dict[str, Any],
    names: dict[str, str],
    sizes: dict[str, int],
    events: list[dict[str, Any]],
    today: date,
) -> dict[str, Any]:
    """Judge the numbers; every finding carries the numbers it rests on."""
    findings: list[dict[str, Any]] = []
    db, wal = raw.get("db_bytes"), raw.get("wal_bytes")
    if db and wal is not None and (wal >= WAL_BYTES or wal >= WAL_SHARE * db):
        findings.append({"kind": "wal_large", "level": "hint", "wal_bytes": wal, "db_bytes": db})
    grown = growth(sizes, today)
    if (
        grown.get("known")
        and grown["recent_bytes"] >= GROWTH_MIN_BYTES
        and grown.get("base_bytes") is not None
        and grown["recent_bytes"] >= GROWTH_FACTOR * max(grown["base_bytes"], 1)
    ):
        findings.append(
            {
                "kind": "growth",
                "level": "hint",
                "recent_bytes": grown["recent_bytes"],
                "base_bytes": grown["base_bytes"],
            }
        )
    duplicates = raw.get("duplicates", [])
    if duplicates:
        by_series: dict[str, int] = {}
        for item in duplicates:
            by_series[item["statistic_id"]] = by_series.get(item["statistic_id"], 0) + 1
        top = sorted(by_series.items(), key=lambda kv: kv[1], reverse=True)[:LIST_LIMIT]
        findings.append(
            {
                "kind": "duplicates",
                "level": "problem",
                "groups": len(duplicates),
                "capped": len(duplicates) >= DUPLICATE_LIMIT,
                "series": [
                    {"statistic_id": sid, "name": names.get(sid), "groups": n} for sid, n in top
                ],
            }
        )
    holes = []
    for series in raw.get("series", []):
        if series["statistic_id"] not in names:
            continue
        missing = round((series["last"] - series["first"]) / 3600) + 1 - series["rows"]
        if missing >= GAP_MIN_HOURS:
            holes.append({**series, "name": names[series["statistic_id"]], "missing": missing})
    holes.sort(key=lambda h: h["missing"], reverse=True)
    if holes:
        findings.append(
            {
                "kind": "missing_hours",
                "level": "hint",
                "series_total": len(holes),
                "series": [
                    {"statistic_id": h["statistic_id"], "name": h["name"], "missing": h["missing"]}
                    for h in holes[:LIST_LIMIT]
                ],
            }
        )
    issues = raw.get("issues", {})
    if issues:
        findings.append(
            {
                "kind": "statistics_issues",
                "level": "problem",
                "series_total": len(issues),
                "series": [
                    {"statistic_id": sid, "name": names.get(sid), "types": types}
                    for sid, types in sorted(issues.items())[: LIST_LIMIT * 4]
                ],
            }
        )
    gaps = state_gaps(raw.get("state_minutes", []), raw["now"], down_periods(events))
    recorder_gaps = [g for g in gaps if g["cause"] == "recorder"]
    if recorder_gaps:
        findings.append(
            {
                "kind": "recorder_gap",
                "level": "problem",
                "gaps": len(recorder_gaps),
                "longest_seconds": max(g["seconds"] for g in recorder_gaps),
                "latest": sorted(recorder_gaps, key=lambda g: g["start"], reverse=True)[
                    :LIST_LIMIT
                ],
            }
        )
    order = {"problem": 0, "hint": 1}
    findings.sort(key=lambda f: order[f["level"]])
    return {
        "supported": raw.get("dialect") == "sqlite",
        "dialect": raw.get("dialect"),
        "db_bytes": db,
        "wal_bytes": wal,
        "growth": grown,
        "restart_gaps": sum(1 for g in gaps if g["cause"] == "restart"),
        "findings": findings,
        "took_ms": raw.get("took_ms"),
    }


async def sample_size(hass: HomeAssistant, events: Any) -> None:
    """Remember today's database size; a number per day, nothing else."""
    if not recorder_ready(hass):
        return
    from homeassistant.components.recorder import get_instance

    files = await get_instance(hass).async_add_executor_job(database_files, hass)
    if files.get("db_bytes") is not None:
        events.record_size(
            datetime.now(UTC).date().isoformat(),
            int(files["db_bytes"]) + int(files.get("wal_bytes") or 0),
        )


async def db_health(
    hass: HomeAssistant,
    snapshot: dict[str, Any],
    events: Any,
    *,
    refresh: bool = False,
) -> dict[str, Any]:
    """Database health: size and growth, statistics duplicates, gaps and issues, recorder gaps."""
    if not recorder_ready(hass):
        return {"available": False, "findings": []}
    now = time.time()
    found = await cached_query(
        hass, "db_health", CACHE_SECONDS, lambda: query_db(hass, now), refresh=refresh
    )
    if found.busy:
        return {"available": True, "busy": True, "findings": []}
    names = {
        item["object_id"]: item.get("name") or item["object_id"]
        for item in snapshot["objects"]
        if item["object_type"] == "entity"
    }
    raw = found.raw
    if raw.get("db_bytes") is not None:
        events.record_size(
            datetime.now(UTC).date().isoformat(),
            int(raw["db_bytes"]) + int(raw.get("wal_bytes") or 0),
        )
    result = evaluate(raw, names, events.sizes, events.events, datetime.now(UTC).date())
    return {"available": True, "busy": False, "cached": found.cached, **result}
