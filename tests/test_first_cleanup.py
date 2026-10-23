"""The cleanup: which stage a finding is in, and how far the house has come."""

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
    store.set_stage(5, None, NOW)
    assert store.started and store.state()["stage"] == 5, (
        "a finished tour can still be gone back in"
    )
    store.set_stage(5, False, NOW)
    assert store.running and not store.state()["finished_at"], "an open stage reopens it"
    store.set_stage(5, True, NOW)
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


async def test_the_history_of_the_tour_is_kept_for_the_house_and_cleared_with_it(hass) -> None:
    store = FirstCleanupStore(hass)
    store.begin(60, NOW)
    keep = {
        "id": "a1",
        "at": "2026-10-23T08:00:00+00:00",
        "stage": 3,
        "action": "keep",
        "key": "k1",
        "keys": ["k1", "k2"],
        "n": 2,
    }
    store.log_add(keep)
    store.log_add(keep)
    store.log_add({"id": "bad", "stage": 9, "action": "keep"})
    store.log_add({"id": "s1", "stage": 3, "action": "skip", "key": "k3"})
    assert [e["id"] for e in store.state()["log"]] == ["a1", "s1"], (
        "a repeat and an unknown shape are dropped"
    )
    store.log_unskip(3)
    assert [e["id"] for e in store.state()["log"]] == ["a1"], "the skips of a stage leave"
    other = FirstCleanupStore(hass)
    other._state = store.state()
    other.log_remove("a1")
    assert other.state()["log"] == [] and store.state()["log"][0]["keys"] == ["k1", "k2"]
    for i in range(400):
        store.log_add({"id": f"e{i}", "stage": 1, "action": "later", "key": f"k{i}"})
    assert len(store.state()["log"]) == 300 and store.state()["log"][-1]["id"] == "e399", (
        "the newest are kept"
    )
    store.reset()
    assert store.state()["log"] == [], "reset clears the history"
