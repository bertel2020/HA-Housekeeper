"""One way to run the expensive recorder queries: cached, never twice at once, not cut short by a client.

A query runs as its own task. A client that gives up (the websocket timeout) only stops waiting; the
task keeps the lock until its executor job has really finished, so a second query can never start
on top of a slow first one. Every query kind shares one lock, so two different kinds do not read the
recorder at the same time either.
"""

from __future__ import annotations

import asyncio
import time
from collections.abc import Callable
from typing import Any

from homeassistant.core import HomeAssistant

from .const import DOMAIN


class QueryResult:
    """What ``cached_query`` found: the raw rows, whether they came from the cache, or ``busy``."""

    __slots__ = ("busy", "cached", "raw")

    def __init__(self, raw: Any, *, cached: bool, busy: bool) -> None:
        self.raw = raw
        self.cached = cached
        self.busy = busy


def _consume(task: asyncio.Task[Any]) -> None:
    """Read the outcome so a task nobody waits for any more does not log an unretrieved error."""
    if not task.cancelled():
        task.exception()


async def cached_query(
    hass: HomeAssistant,
    name: str,
    ttl: float,
    job: Callable[[], Any],
    *,
    refresh: bool = False,
) -> QueryResult:
    """Run ``job`` (a blocking function, in the recorder executor) unless a fresh result exists.

    ``refresh`` asks for a new run but joins one that is already running. When another kind of query
    holds the lock, the last result is handed out, or ``busy`` when there is none.
    """
    from homeassistant.components.recorder import get_instance

    store = hass.data.setdefault(DOMAIN, {})
    cache: dict[str, tuple[float, Any]] = store.setdefault("query_cache", {})
    inflight: dict[str, asyncio.Task[Any]] = store.setdefault("query_inflight", {})
    lock: asyncio.Lock = store.setdefault("reliability_lock", asyncio.Lock())
    kept = cache.get(name)
    if kept and not refresh and time.monotonic() - kept[0] < ttl:
        return QueryResult(kept[1], cached=True, busy=False)
    task = inflight.get(name)
    if task is not None and task.done():
        # Finished, but its done callback has not cleared it yet.
        del inflight[name]
        task = None
    if task is None:
        if lock.locked():
            if kept:
                return QueryResult(kept[1], cached=True, busy=False)
            return QueryResult(None, cached=False, busy=True)

        async def run() -> Any:
            async with lock:
                raw = await get_instance(hass).async_add_executor_job(job)
                cache[name] = (time.monotonic(), raw)
                return raw

        def finished(done: asyncio.Task[Any]) -> None:
            _consume(done)
            if inflight.get(name) is done:
                del inflight[name]

        # The task may start running at once; it is entered before the callback can fire.
        task = hass.async_create_task(run(), name=f"ha_housekeeper query {name}")
        inflight[name] = task
        task.add_done_callback(finished)
    return QueryResult(await asyncio.shield(task), cached=False, busy=False)
