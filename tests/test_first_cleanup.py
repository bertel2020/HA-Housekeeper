"""The first cleanup: which stage a finding is in, and how far the house has come."""

from __future__ import annotations

from datetime import UTC, datetime

from custom_components.ha_housekeeper.first_cleanup import FirstCleanupStore, stage_keys

NOW = datetime(2026, 10, 22, tzinfo=UTC)


def _finding(key: str, topic: str, impact: str, **extra) -> dict:
    return {"key": key, "topic": topic, "impact": impact, **extra}


def test_every_open_finding_is_in_one_stage_and_a_follow_up_in_none() -> None:
    snapshot = {
        "findings": [
            _finding("chain", "down", "high"),
            _finding("small", "down", "high"),
            _finding("follow", "down", "high"),
            _finding("ref", "broken_references", "medium"),
            _finding("old", "unneeded", "high"),
            _finding("quiet", "failing_automations", "low"),
            _finding("hidden", "down", "high", ignored=True),
        ],
        "causes": [
            {"finding_key": "chain", "total_followers": 3, "follower_keys": ["follow"]},
            {"finding_key": "small", "total_followers": 1, "follower_keys": []},
        ],
    }
    stages = stage_keys(snapshot)
    assert stages == {1: ["chain"], 2: [], 3: ["small", "ref"], 4: ["old"], 5: ["quiet"]}


async def test_the_record_follows_the_cleanup_and_survives_a_reload(hass) -> None:
    store = FirstCleanupStore(hass)
    assert store.offered(49) is False and store.offered(50) is True
    store.set_stage(2, True, NOW)
    assert store.state()["done"] == [], "nothing runs before it begins"
    store.begin(60, NOW)
    store.set_stage(3, True, NOW)
    assert store.running and store.state()["stage"] == 3 and store.state()["done"] == [3]
    assert store.offered(60) is False, "begun, so no offer"
    store.set_stage(3, False, NOW)
    for stage in (1, 2, 3, 4, 5):
        store.set_stage(stage, True, NOW)
    assert not store.running and store.state()["finished_at"]
    store.begin(5, NOW)
    assert store.state()["done"] == [] and store.state()["start_count"] == 5, "starts over"
    store.set_stage(2, True, NOW)
    store.reset()
    assert (
        not store.running and store.state()["started_at"] is None and store.state()["done"] == []
    ), "reset: as before it began"

    other = FirstCleanupStore(hass)
    await other.async_load()
    other.dismiss()
    assert other.offered(80) is False
