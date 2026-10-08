"""Recorder load: loud entities, attribute floods, updates without a new state, shares, events."""

from __future__ import annotations

from datetime import timedelta

import pytest

pytest.importorskip("homeassistant")
pytest.importorskip("pytest_homeassistant_custom_component")

from homeassistant.core import HomeAssistant  # noqa: E402
from pytest_homeassistant_custom_component.components.recorder.common import (  # noqa: E402
    async_wait_recording_done,
)

from custom_components.ha_housekeeper import storms as module  # noqa: E402
from custom_components.ha_housekeeper.storms import (  # noqa: E402
    evaluate_storms,
    followers,
    storms,
)


def raw(entities: dict, events: dict | None = None) -> dict:
    return {
        "start": 0.0,
        "end": 86400.0,
        "entities": entities,
        "events": events or {},
        "took_ms": 1,
    }


def counts(
    rows: int,
    *,
    attr_rows: int = 0,
    day_rows: int | None = None,
    day_bytes: int = 0,
    peak: int | None = None,
) -> dict:
    item = {
        "rows": rows,
        "attr_rows": attr_rows,
        "day_rows": rows if day_rows is None else day_rows,
        "day_bytes": day_bytes,
    }
    if peak is not None:
        item["peak_hour"] = peak
    return item


def evaluate(
    entities: dict,
    *,
    info: dict | None = None,
    events: dict | None = None,
    edges=None,
    ignored=None,
    days: int = 1,
):
    meta = info or {
        name: {"name": name, "config_entry_id": "e1", "platform": "hue"} for name in entities
    }
    entries = {"e1": {"title": "Hue", "domain": "hue"}}
    return evaluate_storms(
        raw(entities, events), meta, entries, edges or [], ignored or set(), days
    )


def kinds(result: dict) -> list[str]:
    return [f["kind"] for f in result["findings"]]


# --- thresholds: just below and exactly at each ---------------------------------------------


def storm_kinds(result: dict) -> list[str]:
    return [k for k in kinds(result) if k == "storm"]


def test_a_storm_is_3600_rows_in_the_busiest_hour_or_50000_rows_a_day() -> None:
    assert storm_kinds(evaluate({"sensor.a": counts(10000, peak=3599)})) == []
    assert storm_kinds(evaluate({"sensor.a": counts(10000, peak=3600)})) == ["storm"]
    assert storm_kinds(evaluate({"sensor.a": counts(49999, peak=100)})) == []
    assert storm_kinds(evaluate({"sensor.a": counts(50000, peak=100)})) == ["storm"]
    # Over a week the rows are averaged per day.
    assert storm_kinds(evaluate({"sensor.a": counts(7 * 49999)}, days=7)) == []
    assert storm_kinds(evaluate({"sensor.a": counts(7 * 50000)}, days=7)) == ["storm"]


def test_an_attribute_flood_needs_4_kb_per_row_and_1000_rows_a_day() -> None:
    assert kinds(evaluate({"sensor.a": counts(1000, day_bytes=1000 * 4095)})) == []
    assert kinds(evaluate({"sensor.a": counts(1000, day_bytes=1000 * 4096)})) == ["attribute_flood"]
    assert kinds(evaluate({"sensor.a": counts(999, day_bytes=999 * 9000)})) == []


def test_updates_without_a_new_state_need_80_percent_and_1000_rows_a_day() -> None:
    assert kinds(evaluate({"sensor.a": counts(1000, attr_rows=799)})) == []
    assert kinds(evaluate({"sensor.a": counts(1000, attr_rows=800)})) == ["no_new_state"]
    assert kinds(evaluate({"sensor.a": counts(999, attr_rows=999)})) == []


def test_an_integration_with_a_quarter_of_the_load_and_10000_rows_a_day_is_named() -> None:
    quiet = {f"sensor.q{i}": counts(100) for i in range(3)}
    loud = {"sensor.loud": counts(10000)}
    info = {n: {"name": n, "config_entry_id": "other", "platform": "x"} for n in quiet}
    info["sensor.loud"] = {"name": "loud", "config_entry_id": "e1", "platform": "hue"}
    entries = {"e1": {"title": "Hue", "domain": "hue"}, "other": {"title": "Other", "domain": "x"}}
    result = evaluate_storms(raw({**quiet, **loud}), info, entries, [], set(), 1)
    shares = [f for f in result["findings"] if f["kind"] == "integration_share"]
    assert len(shares) == 1 and shares[0]["title"] == "Hue" and shares[0]["load_share"] > 90
    # Just below 10000 rows a day nothing is named, however large the share.
    result = evaluate_storms(
        raw({**quiet, "sensor.loud": counts(9999)}), info, entries, [], set(), 1
    )
    assert "integration_share" not in kinds(result)


def test_an_event_type_is_a_burst_from_100000_but_state_changed_never() -> None:
    result = evaluate(
        {}, events={"state_changed": 900000, "call_service": 99999, "zha_event": 100000}
    )
    assert [(f["kind"], f["event_type"]) for f in result["findings"]] == [
        ("event_burst", "zha_event")
    ]
    assert result["state_changed_events"] == 900000
    assert [e["type"] for e in result["events"]][:2] == ["state_changed", "zha_event"]


def test_ignored_entities_are_left_out_and_the_table_is_capped_and_sorted() -> None:
    many = {f"sensor.e{i}": counts(i + 1) for i in range(150)}
    result = evaluate({**many, "sensor.skip": counts(10**6)}, ignored={"sensor.skip"})
    assert result["entity_count"] == 150 and len(result["entities"]) == module.TABLE_LIMIT
    assert result["entities"][0]["entity_id"] == "sensor.e149"
    assert all(e["entity_id"] != "sensor.skip" for e in result["entities"])


def test_without_data_for_the_last_day_the_attribute_length_is_unknown_not_zero() -> None:
    result = evaluate({"sensor.a": {"rows": 5, "attr_rows": 0}})
    assert result["entities"][0]["attr_bytes"] is None


# --- the chain ------------------------------------------------------------------------------


def edge(
    source: str, target: str, relation: str = "TRIGGERS_ON", confidence: str = "certain"
) -> dict:
    return {"source": source, "target": target, "relation": relation, "confidence": confidence}


def test_followers_are_counted_by_type_up_to_three_steps_over_certain_usage_edges() -> None:
    edges = [
        edge("entity:sensor.t", "entity:sensor.a", "REFERENCES"),
        edge("automation:automation.x", "entity:sensor.t"),
        edge("script:script.s", "automation:automation.x", "TARGETS"),
        edge("scene:scene.deep", "script:script.s", "TARGETS"),  # fourth step: not counted
        edge("automation:automation.guess", "entity:sensor.a", confidence="possible"),
        edge("entity:sensor.a", "device:d", "BELONGS_TO"),  # not a usage relation
    ]
    assert followers(edges, "entity:sensor.a") == {"entity": 1, "automation": 1, "script": 1}


def test_a_loop_in_the_edges_ends() -> None:
    edges = [edge("entity:a", "entity:b", "REFERENCES"), edge("entity:b", "entity:a", "REFERENCES")]
    assert followers(edges, "entity:a") == {"entity": 1}


def test_a_finding_carries_the_followers_of_its_entity() -> None:
    edges = [edge("automation:automation.x", "entity:sensor.a")]
    result = evaluate({"sensor.a": counts(60000)}, edges=edges)
    assert result["findings"][0]["followers"] == {"automation": 1}


# --- the recorder ---------------------------------------------------------------------------


async def test_without_a_recorder_there_is_no_result(hass: HomeAssistant) -> None:
    assert (await storms(hass, {"objects": []}))["available"] is False


def snapshot_for(*names: str) -> dict:
    return {
        "objects": [
            {
                "object_type": "entity",
                "object_id": n,
                "name": n,
                "config_entry_id": None,
                "platform": "test",
            }
            for n in names
        ],
        "edges": [],
        "findings": [],
    }


async def test_the_recorder_separates_new_states_from_updates_without_one(
    recorder_mock, hass: HomeAssistant, freezer
) -> None:
    from homeassistant.util import dt as dt_util

    now = dt_util.utcnow()
    # Ten past a full hour, so the five later updates share one hour bucket whatever time the test runs.
    base = (now - timedelta(hours=3)).replace(minute=10, second=0, microsecond=0)
    freezer.move_to(base)
    hass.states.async_set("sensor.loud", "1", {"blob": "x" * 5000})
    hass.states.async_set("sensor.calm", "1")
    for i in range(1, 6):
        freezer.move_to(base + timedelta(minutes=i))
        hass.states.async_set(
            "sensor.loud", "1", {"blob": "x" * 5000, "n": i}
        )  # same state, new attributes
    freezer.move_to(now - timedelta(hours=2))
    hass.states.async_set("sensor.calm", "2")
    hass.bus.async_fire("probe_event")
    hass.bus.async_fire("probe_event")
    freezer.move_to(now)
    await async_wait_recording_done(hass)

    result = await storms(hass, snapshot_for("sensor.loud", "sensor.calm"), refresh=True)
    rows = {r["entity_id"]: r for r in result["entities"]}
    assert rows["sensor.loud"]["rows"] == 6 and rows["sensor.calm"]["rows"] == 2
    assert rows["sensor.loud"]["no_new_state"] == round(5 / 6, 3)
    assert rows["sensor.calm"]["no_new_state"] == 0.0
    assert rows["sensor.loud"]["attr_bytes"] >= 5000 > rows["sensor.calm"]["attr_bytes"]
    assert rows["sensor.loud"]["peak_hour"] == 6
    assert result["entities"][0]["entity_id"] == "sensor.loud"
    assert {"type": "probe_event", "count": 2} in result["events"]
    assert result["cached"] is False and isinstance(result["took_ms"], int)
    assert (await storms(hass, snapshot_for("sensor.loud")))["cached"] is True


async def test_a_second_query_does_not_start_while_one_runs(
    recorder_mock, hass: HomeAssistant
) -> None:
    import asyncio

    from custom_components.ha_housekeeper.const import DOMAIN

    lock = hass.data.setdefault(DOMAIN, {}).setdefault("reliability_lock", asyncio.Lock())
    await lock.acquire()
    try:
        result = await storms(hass, snapshot_for(), refresh=True)
    finally:
        lock.release()
    assert result["busy"] is True and result["findings"] == []
