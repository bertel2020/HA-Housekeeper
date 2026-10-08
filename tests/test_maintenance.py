"""Maintenance assistant: recorder costs and the update preflight."""

from __future__ import annotations

from unittest.mock import patch

import pytest

pytest.importorskip("homeassistant")
pytest.importorskip("pytest_homeassistant_custom_component")

from homeassistant.config_entries import ConfigEntryState  # noqa: E402
from homeassistant.core import HomeAssistant  # noqa: E402
from homeassistant.helpers import entity_registry as er  # noqa: E402
from homeassistant.helpers import issue_registry as ir  # noqa: E402
from pytest_homeassistant_custom_component.common import MockConfigEntry  # noqa: E402
from pytest_homeassistant_custom_component.components.recorder.common import (  # noqa: E402
    async_wait_recording_done,
)
from test_cleanup_exec import make_scanner  # noqa: E402

from custom_components.ha_housekeeper.maintenance import (  # noqa: E402
    judge_preflight,
    rank_costs,
    recorder_costs,
)


def snapshot_with(*entity_ids: str, used: tuple[str, ...] = ()) -> dict:
    return {
        "objects": [
            {"object_type": "entity", "object_id": e, "name": e, "has_statistics": False}
            for e in entity_ids
        ],
        "edges": [
            {"source": "automation:a", "target": f"entity:{e}", "relation": "TRIGGERS_ON"}
            for e in used
        ],
        "findings": [],
    }


def test_rank_costs_suggests_excluding_only_what_nothing_uses() -> None:
    raw = {
        "total_states": 1000,
        "first": 0,
        "last": 86400 * 2,
        "states": [
            ("sensor.noisy", 800, 0, 86400 * 2),
            ("sensor.noisy_but_used", 150, 0, 86400 * 2),
            ("sensor.quiet", 40, 0, 86400 * 2),
            ("sensor.unknown", 10, 0, 86400 * 2),
        ],
        "statistics_total": 5,
        "statistics": [("sensor.noisy", 5)],
        "size_bytes": 1024,
        "keep_days": 10,
        "recorded": lambda entity_id: entity_id != "sensor.quiet",
    }
    result = rank_costs(
        raw,
        snapshot_with(
            "sensor.noisy", "sensor.noisy_but_used", "sensor.quiet", used=("sensor.noisy_but_used",)
        ),
    )
    by_id = {e["entity_id"]: e for e in result["entities"]}
    assert by_id["sensor.noisy"]["per_day"] == 400.0 and by_id["sensor.noisy"]["share"] == 80.0
    assert by_id["sensor.noisy"]["suggest_exclude"] is True
    assert by_id["sensor.noisy_but_used"]["suggest_exclude"] is False  # an automation depends on it
    assert by_id["sensor.quiet"]["suggest_exclude"] is False and by_id["sensor.quiet"]["excluded"]
    assert (
        by_id["sensor.unknown"]["known"] is False and not by_id["sensor.unknown"]["suggest_exclude"]
    )
    assert result["statistics"] == [{"statistic_id": "sensor.noisy", "rows": 5, "known": True}]


async def test_costs_are_unavailable_without_a_recorder(hass: HomeAssistant) -> None:
    assert (await recorder_costs(hass, snapshot_with()))["available"] is False


async def test_costs_count_the_states_in_the_database(recorder_mock, hass: HomeAssistant) -> None:
    for index in range(30):
        hass.states.async_set("sensor.chatty", str(index))
    hass.states.async_set("sensor.calm", "1")
    await async_wait_recording_done(hass)
    result = await recorder_costs(hass, snapshot_with("sensor.chatty", "sensor.calm"))
    assert result["available"] is True and result["total_states"] == 31
    assert result["entities"][0]["entity_id"] == "sensor.chatty"
    assert result["entities"][0]["states"] == 30
    assert result["entities"][0]["share"] == pytest.approx(96.8, abs=0.1)


def state(**changes) -> dict:
    base = {
        "ha_version": "2026.2.3",
        "backup": {"available": True, "configured": True, "newest": "x", "age_hours": 5},
        "repairs": [],
        "failed_entries": [],
        "broken": [],
    }
    return {**base, **changes}


def test_judging_the_preflight() -> None:
    levels = {c["check"]: c["level"] for c in judge_preflight(state())}
    assert levels == {"backup": "ok", "repairs": "ok", "failed_entries": "ok", "broken": "ok"}
    old = state(backup={"available": True, "configured": True, "newest": "x", "age_hours": 100})
    assert judge_preflight(old)[0]["level"] == "warn"
    none = state(backup={"available": True, "configured": False, "newest": None})
    assert judge_preflight(none)[0]["level"] == "red"
    assert judge_preflight(state(backup={"available": False}))[0]["level"] == "warn"
    counts = {c["check"]: c for c in judge_preflight(state(repairs=[{"issue_id": "a"}]))}
    assert counts["repairs"]["level"] == "warn" and counts["repairs"]["count"] == 1


async def test_preflight_saves_a_record_and_compares_after_an_update(hass: HomeAssistant) -> None:
    from custom_components.ha_housekeeper import maintenance

    er.async_get(hass).async_get_or_create("sensor", "test", "before", suggested_object_id="before")
    ir.async_create_issue(
        hass,
        "demo",
        "old_issue",
        is_fixable=False,
        severity=ir.IssueSeverity.WARNING,
        translation_key="x",
    )
    scanner = await make_scanner(hass)
    snapshot = await scanner.async_scan()

    report = await maintenance.preflight_report(hass, snapshot, scanner.preflight)
    assert report["record"] is None and report["after"] is None
    assert [r["issue_id"] for r in report["state"]["repairs"]] == ["old_issue"]
    scanner.preflight.save(report["state"], snapshot)

    same = await maintenance.preflight_report(hass, snapshot, scanner.preflight)
    assert same["record"]["repairs"] == 1 and same["after"] is None  # no update happened yet

    # The update: a newer version, one more repair, an integration that fails, a new entity.
    ir.async_create_issue(
        hass,
        "demo",
        "new_issue",
        is_fixable=False,
        severity=ir.IssueSeverity.ERROR,
        translation_key="y",
    )
    broken = MockConfigEntry(domain="demo", title="Hub", state=ConfigEntryState.SETUP_RETRY)
    broken.add_to_hass(hass)
    er.async_get(hass).async_get_or_create("sensor", "test", "after", suggested_object_id="after")
    snapshot = await scanner.async_scan()
    installed = maintenance.HA_VERSION
    with patch.object(maintenance, "HA_VERSION", "2099.1.0"):
        after = (await maintenance.preflight_report(hass, snapshot, scanner.preflight))["after"]
    assert after["from_version"] == installed and after["to_version"] == "2099.1.0"
    assert [r["issue_id"] for r in after["new_repairs"]] == ["new_issue"]
    assert [e["title"] for e in after["new_failed_entries"]] == ["Hub"]
    new_ids = {o["object_id"] for o in after["inventory"]["new_objects"]["items"]}
    assert "sensor.after" in new_ids and "sensor.before" not in new_ids


async def test_preflight_ignores_persisted_issues_that_are_not_active(hass: HomeAssistant) -> None:
    """The registry keeps issues no integration raises right now; they are not open repairs."""
    import dataclasses

    from custom_components.ha_housekeeper import maintenance

    for issue_id in ("active_issue", "stale_issue"):
        ir.async_create_issue(
            hass,
            "demo",
            issue_id,
            is_fixable=False,
            severity=ir.IssueSeverity.WARNING,
            translation_key="x",
        )
    registry = ir.async_get(hass)
    stale = registry.issues[("demo", "stale_issue")]
    registry.issues[("demo", "stale_issue")] = dataclasses.replace(stale, active=False)

    assert [r["issue_id"] for r in maintenance._repairs(hass)] == ["active_issue"]


def _raw(states, recent=None, **extra):
    raw = {
        "total_states": sum(count for _, count, _, _ in states),
        "first": 0,
        "last": DAY * 30,
        "states": states,
        "statistics_total": 0,
        "statistics": [],
        "size_bytes": 1,
        "keep_days": 31,
        "recorded": None,
        **extra,
    }
    if recent is not None:
        raw["recent"] = recent
    return raw


DAY = 86400


def test_an_exclusion_is_suggested_for_the_current_rate_not_the_history() -> None:
    raw = _raw(
        [
            ("sensor.was_noisy", 500_000, 0, DAY * 30),  # an old burst: 16,000 a day on average
            ("sensor.is_noisy", 200_000, 0, DAY * 30),
            ("sensor.only_now", 900, DAY * 29, DAY * 30),  # small overall, loud today
        ],
        recent={
            "sensor.was_noisy": (6, 2),
            "sensor.is_noisy": (8_000, 1_200),
            "sensor.only_now": (900, 900),
        },
    )
    result = rank_costs(
        raw, snapshot_with("sensor.was_noisy", "sensor.is_noisy", "sensor.only_now")
    )
    by_id = {e["entity_id"]: e for e in result["entities"]}
    was = by_id["sensor.was_noisy"]
    assert was["per_day_avg"] > 16_000 and was["states_24h"] == 2 and was["states_7d"] == 6
    assert (
        was["suggest_exclude"] is False
    )  # the burst is over: shown with its average, not suggested
    assert by_id["sensor.is_noisy"]["suggest_exclude"] is True
    assert by_id["sensor.is_noisy"]["per_day_7d"] == pytest.approx(1142.9, abs=0.1)
    assert by_id["sensor.only_now"]["suggest_exclude"] is True


def test_without_the_windows_the_average_still_decides() -> None:
    raw = _raw([("sensor.old_caller", 3_000, 0, DAY * 3)])  # no "recent": an older caller
    result = rank_costs(raw, snapshot_with("sensor.old_caller"))
    assert result["entities"][0]["suggest_exclude"] is True
    assert result["took_ms"] is None and result["cached"] is False


async def test_costs_separate_the_windows_and_list_what_is_loud_now(
    recorder_mock, hass: HomeAssistant, freezer
) -> None:
    from datetime import timedelta

    from homeassistant.util import dt as dt_util

    now = dt_util.utcnow()
    for age, count in ((timedelta(days=20), 12), (timedelta(days=3), 6)):
        freezer.move_to(now - age)
        for index in range(count):
            hass.states.async_set("sensor.old_burst", f"{age}-{index}")
    freezer.move_to(now)
    for index in range(5):
        hass.states.async_set("sensor.loud_now", str(index))
    await async_wait_recording_done(hass)

    result = await recorder_costs(
        hass, snapshot_with("sensor.old_burst", "sensor.loud_now"), refresh=True
    )
    by_id = {e["entity_id"]: e for e in result["entities"]}
    assert by_id["sensor.old_burst"]["states"] == 18
    assert (
        by_id["sensor.old_burst"]["states_7d"] == 6 and by_id["sensor.old_burst"]["states_24h"] == 0
    )
    assert (
        by_id["sensor.loud_now"]["states_24h"] == 5 and by_id["sensor.loud_now"]["states_7d"] == 5
    )
    assert isinstance(result["took_ms"], int) and result["cached"] is False


async def test_the_costs_are_kept_for_five_minutes_and_refresh_calculates_again(
    recorder_mock, hass: HomeAssistant
) -> None:
    hass.states.async_set("sensor.chatty", "1")
    await async_wait_recording_done(hass)
    snapshot = snapshot_with("sensor.chatty")
    first = await recorder_costs(hass, snapshot)
    assert first["cached"] is False
    hass.states.async_set("sensor.chatty", "2")
    await async_wait_recording_done(hass)
    second = await recorder_costs(hass, snapshot)
    assert second["cached"] is True and second["total_states"] == first["total_states"]
    third = await recorder_costs(hass, snapshot, refresh=True)
    assert third["cached"] is False and third["total_states"] == first["total_states"] + 1
