"""Battery estimate, own reminders and the failed-setup history: each at its edge."""

from __future__ import annotations

from datetime import UTC, date, datetime, timedelta

import pytest

pytest.importorskip("homeassistant")

from custom_components.ha_housekeeper.battery_trend import DAY, build, estimate  # noqa: E402
from custom_components.ha_housekeeper.entry_states import EntryStateHistory  # noqa: E402
from custom_components.ha_housekeeper.reminders import ReminderError, ReminderStore  # noqa: E402

NOW = datetime(2026, 10, 9, 12, tzinfo=UTC)


def days(values: list[float]) -> list[tuple[float, float]]:
    return [(i * DAY, v) for i, v in enumerate(values)]


def test_the_battery_estimate_follows_the_fall_since_the_last_change_and_promises_nothing_else() -> (
    None
):
    falling = estimate(days([80 - i for i in range(10)]), 20)  # one point a day, now at 71
    assert falling["state"] == "falling" and falling["days_left"] == 51
    assert estimate(days([50, 49, 48]), 20) is None  # too few days
    assert estimate(days([60.0] * 10), 20)["state"] == "stable"
    assert estimate(days([15 - i * 0.1 for i in range(10)]), 20)["state"] == "low"
    replaced = estimate(days([30, 29, 28, 27, 100, 99, 98, 97, 96, 95, 94]), 20)
    assert (
        replaced["points"] == 7 and replaced["level"] == 94
    )  # only the days after the change count

    series = {
        "sensor.a": days([80 - i for i in range(10)]),
        "sensor.b": days([70 - i for i in range(10)]),
        "sensor.c": days([1, 2]),
    }
    result = build(series, {}, 20, NOW)
    assert [r["entity_id"] for r in result["rows"]] == ["sensor.b", "sensor.a"] and result[
        "unknown"
    ] == 1
    assert result["groups"] == [
        {"from_days": 28, "to_days": 41, "entity_ids": ["sensor.b"]},
        {"from_days": 42, "to_days": 55, "entity_ids": ["sensor.a"]},
    ]


async def test_reminders_validate_count_the_days_and_start_a_new_round_when_done(hass) -> None:
    store = ReminderStore(hass)
    today = date(2026, 10, 9)
    item = store.upsert(None, " Filter ", 30, "2026-09-01", "", today)
    assert store.view(today)[0]["state"] == "due" and store.view(today)[0]["days_left"] == -8
    for args in (
        (None, "", 30, "2026-09-01", ""),
        (None, "x", 0, "2026-09-01", ""),
        (None, "x", 30, "2026-10-10", ""),
        (None, "x", 30, "no", ""),
    ):
        with pytest.raises(ReminderError):
            store.upsert(*args, today)
    store.done(item, today)
    assert store.view(today)[0]["state"] == "ok" and store.view(today)[0]["due"] == "2026-11-08"
    store.upsert(None, "Entkalken", 14, "2026-09-30", "", today)
    assert [r["state"] for r in store.view(today)] == ["soon", "ok"]
    store.delete(item)
    with pytest.raises(ReminderError):
        store.delete(item)


async def test_a_failing_entry_counts_once_per_episode_and_old_ones_are_dropped(hass) -> None:
    history = EntryStateHistory(hass)
    history.record({"e1": "loaded", "e2": "loaded"}, NOW)
    assert history.summary("e1", NOW) is None
    history.record({"e1": "setup_retry", "e2": "loaded"}, NOW + timedelta(hours=1))
    history.record(
        {"e1": "setup_retry", "e2": "loaded"}, NOW + timedelta(hours=2)
    )  # the same episode
    history.record({"e1": "loaded", "e2": "loaded"}, NOW + timedelta(hours=3))
    history.record({"e1": "setup_error", "e2": "loaded"}, NOW + timedelta(hours=4))
    summary = history.summary("e1", NOW + timedelta(hours=5))
    assert (
        summary["count"] == 2
        and summary["state"] == "setup_error"
        and history.summary("e2", NOW) is None
    )
    assert (
        history.summary("e1", NOW + timedelta(days=30))["count"] == 0
    )  # outside the week, still failing
    history.record({"e1": "loaded"}, NOW + timedelta(days=70))  # older than 60 days: gone
    assert history.summary("e1", NOW + timedelta(days=70)) is None
