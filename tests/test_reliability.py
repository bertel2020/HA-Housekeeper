"""Integration reliability: availability per config entry and shared outages."""

from __future__ import annotations

from datetime import timedelta

import pytest

pytest.importorskip("homeassistant")
pytest.importorskip("pytest_homeassistant_custom_component")

from homeassistant.core import HomeAssistant  # noqa: E402
from pytest_homeassistant_custom_component.components.recorder.common import (  # noqa: E402
    async_wait_recording_done,
)

from custom_components.ha_housekeeper.reliability import (  # noqa: E402
    compute,
    reliability,
    shared_outages,
)

HOUR = 3600
START, END = 0.0, 100 * HOUR


def test_a_shared_outage_needs_eighty_percent_of_the_entities() -> None:
    four_of_five = [[(10 * HOUR, 11 * HOUR)] for _ in range(4)] + [[]]
    assert shared_outages(four_of_five) == [(10 * HOUR, 11 * HOUR)]
    three_of_five = [[(10 * HOUR, 11 * HOUR)] for _ in range(3)] + [[], []]
    assert shared_outages(three_of_five) == []


def test_a_shared_outage_needs_five_minutes_and_three_entities() -> None:
    short = [[(0, 299)] for _ in range(3)]
    assert shared_outages(short) == []
    exact = [[(0, 300)] for _ in range(3)]
    assert shared_outages(exact) == [(0, 300)]
    assert shared_outages([[(0, HOUR)], [(0, HOUR)]]) == []


def test_intervals_that_only_touch_do_not_overlap() -> None:
    members = [[(0, 600)], [(600, 1200)], [(0, 600)]]
    # 2 of 3 are down at the same time (66 %), then 1 of 3: never 80 %.
    assert shared_outages(members) == []


def test_overlapping_outages_are_joined_by_the_sweep() -> None:
    members = [[(0, 400)], [(100, 500)], [(100, 400)]]
    assert shared_outages(members) == [(100, 400)]


def entities(*names: str, entry: str = "e1", status: str = "active") -> list[dict]:
    return [{"entity_id": n, "config_entry_id": entry, "status": status} for n in names]


ENTRIES = {"e1": {"title": "Hue", "domain": "hue", "state": "loaded", "iot_class": "local_push"}}


def runs(seen: dict, intervals: dict) -> dict:
    return {"start": START, "end": END, "seen": seen, "intervals": intervals, "took_ms": 5}


def test_availability_is_time_weighted_from_the_first_report() -> None:
    result = compute(
        runs({"a": START, "b": 50 * HOUR}, {"a": [(10 * HOUR, 20 * HOUR)]}),
        entities("a", "b"),
        ENTRIES,
    )
    row = result["entries"][0]
    # a: 10 h of 100 down, b: 0 of 50 down -> 10 of 150.
    assert row["availability"] == round(100 * (1 - 10 / 150), 2)
    assert row["entities"] == 2 and row["permanent"] == 0 and row["layer"] is None


def test_entities_down_the_whole_window_are_counted_apart() -> None:
    result = compute(
        runs(
            {"a": START, "b": START},
            {"a": [(START, END)], "b": [(10 * HOUR, 11 * HOUR)]},
        ),
        entities("a", "b", "c"),
        ENTRIES,
    )
    row = result["entries"][0]
    assert row["permanent"] == 1 and row["entities"] == 1
    assert row["availability"] == 99.0


def test_an_entity_without_rows_that_is_down_now_is_permanent() -> None:
    items = [*entities("a"), *entities("gone", status="unavailable")]
    row = compute(runs({"a": START}, {}), items, ENTRIES)["entries"][0]
    assert row["permanent"] == 1 and row["availability"] == 100.0


def test_a_shared_outage_names_the_likely_layer_from_the_iot_class() -> None:
    outage = {name: [(40 * HOUR, 41 * HOUR)] for name in "abc"}
    seen = {name: START for name in "abc"}
    local = compute(runs(seen, outage), entities("a", "b", "c"), ENTRIES)["entries"][0]
    assert local["shared_outages"] == 1 and local["layer"] == "local"
    assert local["longest_outage"] == HOUR
    assert local["last_disruption"] == {"end": 41 * HOUR, "seconds": HOUR, "shared": True}
    cloud_entries = {"e1": {**ENTRIES["e1"], "iot_class": "cloud_polling"}}
    cloud = compute(runs(seen, outage), entities("a", "b", "c"), cloud_entries)["entries"][0]
    assert cloud["layer"] == "cloud"


def test_a_single_entity_outage_is_the_last_disruption_without_a_layer() -> None:
    row = compute(
        runs({"a": START, "b": START}, {"a": [(5 * HOUR, 6 * HOUR)]}),
        entities("a", "b"),
        ENTRIES,
    )["entries"][0]
    assert row["layer"] is None and row["shared_outages"] == 0
    assert row["last_disruption"] == {"end": 6 * HOUR, "seconds": HOUR, "shared": False}


def test_intervals_are_clipped_to_the_window_and_merged_per_entity() -> None:
    row = compute(
        runs({"a": START}, {"a": [(-5 * HOUR, 5 * HOUR), (4 * HOUR, 6 * HOUR)]}),
        entities("a"),
        ENTRIES,
    )["entries"][0]
    assert row["availability"] == 94.0


def test_the_worst_entry_comes_first() -> None:
    entries = {
        "e1": {**ENTRIES["e1"], "title": "Good"},
        "e2": {**ENTRIES["e1"], "title": "Bad"},
    }
    items = [*entities("a", entry="e1"), *entities("b", entry="e2")]
    result = compute(runs({"a": START, "b": START}, {"b": [(0, 10 * HOUR)]}), items, entries)
    assert [r["title"] for r in result["entries"]] == ["Bad", "Good"]


def snapshot_for(*names: str, entry: str) -> dict:
    return {
        "objects": [
            {
                "object_type": "entity",
                "object_id": n,
                "config_entry_id": entry,
                "status": "active",
            }
            for n in names
        ]
    }


async def test_without_a_recorder_there_is_no_result(hass: HomeAssistant) -> None:
    assert (await reliability(hass, snapshot_for(entry="x")))["available"] is False


async def test_the_recorder_gives_the_unavailable_time(
    recorder_mock, hass: HomeAssistant, freezer
) -> None:
    from homeassistant.util import dt as dt_util
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    entry = MockConfigEntry(domain="test", title="Probe")
    entry.add_to_hass(hass)
    now = dt_util.utcnow()
    names = ("sensor.a", "sensor.b", "sensor.c")
    freezer.move_to(now - timedelta(days=2))
    for name in names:
        hass.states.async_set(name, "1")
    freezer.move_to(now - timedelta(days=1, hours=1))
    for name in names:
        hass.states.async_set(name, "unavailable")
    freezer.move_to(now - timedelta(days=1))
    for name in names:
        hass.states.async_set(name, "2")
    freezer.move_to(now)
    await async_wait_recording_done(hass)

    snapshot = snapshot_for(*names, entry=entry.entry_id)
    result = await reliability(hass, snapshot, refresh=True)
    row = result["entries"][0]
    assert row["entry_id"] == entry.entry_id and row["entities"] == 3
    assert row["shared_outages"] == 1 and row["longest_outage"] == HOUR
    assert row["availability"] == round(100 * (1 - 1 / 48), 2)
    assert result["cached"] is False and isinstance(result["took_ms"], int)

    day = await reliability(hass, snapshot, window_days=1, refresh=True)
    # The outage began before the 24 hour window: it is counted from the first report in it.
    assert day["entries"][0]["shared_outages"] == 0 and day["entries"][0]["availability"] == 100.0

    again = await reliability(hass, snapshot)
    assert again["cached"] is True


async def test_a_second_query_does_not_start_while_one_runs(
    recorder_mock, hass: HomeAssistant
) -> None:
    from custom_components.ha_housekeeper.const import DOMAIN

    lock = hass.data.setdefault(DOMAIN, {}).setdefault(
        "reliability_lock", __import__("asyncio").Lock()
    )
    await lock.acquire()
    try:
        result = await reliability(hass, snapshot_for(entry="x"), refresh=True)
    finally:
        lock.release()
    assert result["busy"] is True and result["entries"] == []
