"""The recorder purge only touches orphaned statistics, never an existing entity or the Energy dashboard."""

from __future__ import annotations

import pytest

pytest.importorskip("homeassistant")


def test_a_purge_action_needs_an_orphan_without_entity_and_is_always_a_review() -> None:
    from custom_components.ha_housekeeper.cleanup import judge_purge_action

    orphans = {"sensor.gone": {"in_energy": False}, "sensor.energy": {"in_energy": True}}
    ok = judge_purge_action("sensor.gone", orphans, False, True, True)
    assert ok["verdict"] == "review" and ok["reasons"] == ["irreversible", "with_states"]
    for sid, exists, recorder, reason in (
        ("sensor.energy", False, True, "in_energy"),
        ("sensor.gone", True, True, "entity_exists"),
        ("sensor.other", False, True, "not_orphaned"),
        ("sensor.gone", False, False, "no_recorder"),
    ):
        action = judge_purge_action(sid, orphans, exists, False, recorder)
        assert action["verdict"] == "blocked" and reason in action["reasons"]


def _recorder(monkeypatch: pytest.MonkeyPatch):
    """A recorder that only records what is cleared; returns the ``hass`` stand-in and that list."""
    from types import SimpleNamespace
    from unittest.mock import MagicMock

    cleared: list[list[str]] = []
    instance = MagicMock()
    instance.async_clear_statistics = cleared.append

    async def done():
        return None

    async def run_job(job):
        return job()

    instance.async_block_till_done = done
    instance.async_add_executor_job = run_job
    monkeypatch.setattr("homeassistant.components.recorder.get_instance", lambda hass: instance)
    monkeypatch.setattr(
        "homeassistant.components.recorder.statistics.get_metadata", lambda hass, **kw: {}
    )
    return SimpleNamespace(data={}, states=SimpleNamespace(get=lambda sid: None)), cleared


async def test_the_purge_waits_for_a_running_query_and_gives_up_without_deleting(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    import asyncio

    from custom_components.ha_housekeeper import recorder_purge

    hass, cleared = _recorder(monkeypatch)
    monkeypatch.setattr(recorder_purge, "QUERY_WAIT", 0.05)
    lock = hass.data.setdefault("ha_housekeeper", {}).setdefault("reliability_lock", asyncio.Lock())
    await lock.acquire()  # a slow recorder query holds the shared lock
    removed, left, error = await recorder_purge.delete_statistics(
        hass, ["sensor.gone"], states=False
    )
    assert (removed, left, error) == ([], [], "recorder_busy") and cleared == []
    lock.release()
    removed, left, error = await recorder_purge.delete_statistics(
        hass, ["sensor.gone"], states=False
    )
    assert removed == ["sensor.gone"] and error is None and cleared == [["sensor.gone"]]
    assert not lock.locked()
