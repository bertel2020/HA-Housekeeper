"""The recorder purge only touches orphaned statistics, never an existing entity or the Energy dashboard."""

from __future__ import annotations

import pytest

pytest.importorskip("homeassistant")

from custom_components.ha_housekeeper.recorder_purge import judge  # noqa: E402


def test_only_orphaned_ids_outside_energy_may_go() -> None:
    orphans = {
        "sensor.gone": {"in_energy": False},
        "sensor.energy": {"in_energy": True},
        "sensor.back": {"in_energy": False},
    }
    allowed, skipped = judge(
        ["sensor.gone", "sensor.energy", "sensor.back", "sensor.unknown", "sensor.gone"],
        orphans,
        exists={"sensor.back"},
    )
    assert allowed == ["sensor.gone"]
    assert {(s["id"], s["reason"]) for s in skipped} == {
        ("sensor.energy", "in_energy"),
        ("sensor.back", "exists"),
        ("sensor.unknown", "not_orphaned"),
    }


def _recorder(monkeypatch: pytest.MonkeyPatch, existing: set[str], backup):
    """A recorder that only records what is cleared; returns the ``hass`` stand-in and that list."""
    from types import SimpleNamespace
    from unittest.mock import MagicMock

    from custom_components.ha_housekeeper import recorder_purge

    registry = SimpleNamespace(async_get=lambda sid: object() if sid in existing else None)
    monkeypatch.setattr(recorder_purge.er, "async_get", lambda hass: registry)
    monkeypatch.setattr(recorder_purge, "_backup", backup)
    cleared: list[list[str]] = []
    instance = MagicMock()
    instance.async_clear_statistics = cleared.append

    async def done():
        return None, "job-1"

    async def run_job(job):
        return job()

    instance.async_block_till_done = done
    instance.async_add_executor_job = run_job
    monkeypatch.setattr("homeassistant.components.recorder.get_instance", lambda hass: instance)
    monkeypatch.setattr(
        "homeassistant.components.recorder.statistics.get_metadata", lambda hass, **kw: {}
    )
    return SimpleNamespace(data={}, states=SimpleNamespace(get=lambda sid: None)), cleared


async def test_entity_back_during_backup_is_not_deleted(monkeypatch: pytest.MonkeyPatch) -> None:
    from custom_components.ha_housekeeper import recorder_purge

    existing: set[str] = set()

    async def backup(hass):
        existing.add("sensor.back")  # the entity returns while the backup runs
        return None, "job-1"

    hass, cleared = _recorder(monkeypatch, existing, backup)
    snapshot = {
        "orphaned_statistics": [
            {"statistic_id": "sensor.gone", "in_energy": False},
            {"statistic_id": "sensor.back", "in_energy": False},
        ]
    }
    result = await recorder_purge.purge_orphans(
        hass, snapshot, ["sensor.gone", "sensor.back"], states=False
    )
    assert cleared == [["sensor.gone"]]
    assert result["removed"] == ["sensor.gone"]
    assert {"id": "sensor.back", "reason": "changed"} in result["skipped"]
    assert hass.data["ha_housekeeper"]["write_holder"] is None


async def test_a_second_purge_waits_while_one_runs(monkeypatch: pytest.MonkeyPatch) -> None:
    import asyncio

    from custom_components.ha_housekeeper import recorder_purge

    gate = asyncio.Event()

    async def backup(hass):
        await gate.wait()  # the first purge sits in its backup
        return None, "job-1"

    hass, cleared = _recorder(monkeypatch, set(), backup)
    snapshot = {"orphaned_statistics": [{"statistic_id": "sensor.gone", "in_energy": False}]}
    first = asyncio.create_task(
        recorder_purge.purge_orphans(hass, snapshot, ["sensor.gone"], states=False)
    )
    await asyncio.sleep(0)
    assert recorder_purge.purge_running(hass)
    second = await recorder_purge.purge_orphans(hass, snapshot, ["sensor.gone"], states=False)
    assert second["error"] == "busy" and second["removed"] == []
    gate.set()
    assert (await first)["removed"] == ["sensor.gone"]
    assert cleared == [["sensor.gone"]], "only the first purge deleted anything"
    assert not recorder_purge.purge_running(hass)


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


async def test_the_purge_waits_for_a_running_query_and_gives_up_without_deleting(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    import asyncio

    from custom_components.ha_housekeeper import recorder_purge

    hass, cleared = _recorder(monkeypatch, set(), None)
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
