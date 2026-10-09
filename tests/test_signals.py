"""Events for your own automations: only what is new, nothing on the first run."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest

pytest.importorskip("homeassistant")

from custom_components.ha_housekeeper.protection import allows, allows_undo  # noqa: E402
from custom_components.ha_housekeeper.signals import SignalStore, situations  # noqa: E402

NOW = datetime(2026, 10, 9, tzinfo=UTC)


def test_the_mode_decides_what_may_run_and_what_may_be_undone() -> None:
    disable, remove = {"kind": "disable_entity"}, {"kind": "remove_entity"}
    purge, with_data = {"kind": "purge_statistics"}, {"kind": "remove_entity", "recorder": "states"}
    table = {
        "read_only": (False, False, False, False),
        "quarantine": (True, False, False, False),
        "confirmed": (True, True, False, False),
        "full": (True, True, True, True),
    }
    for mode, expected in table.items():
        assert tuple(allows(mode, a) for a in (disable, remove, purge, with_data)) == expected
    assert not allows_undo("read_only", [disable])
    assert allows_undo("quarantine", [disable]) and not allows_undo("quarantine", [remove])
    assert allows_undo("confirmed", [remove])


async def test_a_situation_is_announced_once_and_again_after_it_ended(hass) -> None:
    snapshot = {
        "findings": [
            {
                "key": "k1",
                "object_id": "lock.door",
                "rule_id": "r",
                "classification": "unavailable",
                "impact": "high",
            },
            {
                "key": "k2",
                "object_id": "sensor.x",
                "rule_id": "r",
                "classification": "unavailable",
                "impact": "low",
            },
        ],
        "quarantine": [
            {
                "object_type": "entity",
                "object_id": "sensor.old",
                "since": (NOW - timedelta(days=20)).isoformat(),
            }
        ],
        "causes": [
            {
                "id": "integration_down:z",
                "kind": "integration_down",
                "object_id": "z",
                "follower_count": 4,
            }
        ],
    }
    backup = {
        "available": True,
        "checks": [{"id": "newest", "level": "problem", "values": {"date": "d1", "age_hours": 90}}],
    }
    plans = [{"plan_id": "p1", "followup": {"state": "regression", "new_count": 2}}]
    found = situations(snapshot, plans, backup, NOW)
    assert sorted(event for event, _ in found.values()) == [
        "backup_overdue",
        "critical_finding",
        "followup_regression",
        "integration_down",
        "quarantine_expired",
    ]

    store = SignalStore(hass)
    assert store.fresh(found) == []  # the first run starts quiet
    assert store.fresh(found) == []  # and nothing is announced twice
    snapshot["findings"].append({**snapshot["findings"][0], "key": "k3", "object_id": "lock.gate"})
    fresh = store.fresh(situations(snapshot, plans, backup, NOW))
    assert [(e, p["object_id"]) for e, p in fresh] == [("critical_finding", "lock.gate")]
    snapshot["findings"].pop()  # it ended ...
    store.fresh(situations(snapshot, plans, backup, NOW))
    snapshot["findings"].append({**snapshot["findings"][0], "key": "k3", "object_id": "lock.gate"})
    assert len(store.fresh(situations(snapshot, plans, backup, NOW))) == 1  # ... and came back
    # An unreadable backup report neither fires nor ends the backup situation.
    store.fresh(situations(snapshot, plans, None, NOW), ("backup:",))
    assert "backup:d1" in store.seen
