"""The activity: what was done, kept newest first and trimmed."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

from homeassistant.core import HomeAssistant

from custom_components.ha_housekeeper.activity import ITEM_LIMIT, ActivityStore

NOW = datetime(2026, 10, 23, 12, 0, tzinfo=UTC)


async def test_activity_records_filters_pages_and_takes_over_the_old_records(
    hass: HomeAssistant,
) -> None:
    store = ActivityStore(hass)
    store.backfill(
        {"f1": {"kind": "keep", "at": "2026-10-01T08:00:00+00:00", "reason": "so gewollt"}},
        {},
        [{"title": "Stick replaced", "at": "2026-10-02T08:00:00+00:00", "target": ""}],
        [],
    )
    store.backfill({"f2": {"kind": "ignore", "at": "2026-10-03T08:00:00+00:00"}}, {}, [], [])
    assert store.view()["total"] == 2  # taken over once, without undo
    assert all(e["backfilled"] and e["undo"] is None for e in store.view()["items"])
    store.record(
        "decision", "snooze", NOW, key="f3", by="admin", undo={"type": "ignore", "key": "f3"}
    )
    store.record("nonsense", "x", NOW)
    page = store.view(limit=2)
    assert [e["key"] for e in page["items"]][0] == "f3"
    assert page["next"] and store.view(before=page["next"])["total"] == 1
    assert store.view(kinds=("note",))["total"] == 1
    assert store.view(query="ADMIN")["total"] == 1
    store.record("auto", "gone", NOW + timedelta(days=400))
    assert store.view()["total"] == 1  # the older ones are past a year
    assert ITEM_LIMIT == 2000
