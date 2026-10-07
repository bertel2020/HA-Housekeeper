"""Dry-run cleanup plans: judging candidates and the journal."""

from __future__ import annotations

from datetime import UTC, datetime

import pytest

pytest.importorskip("homeassistant")

from custom_components.ha_housekeeper.cleanup import (  # noqa: E402
    MAX_PLANS,
    build_plan,
    judge_action,
)

NOW = datetime(2026, 10, 7, tzinfo=UTC)


def entity(object_id: str, status: str = "orphaned", **extra):
    return {
        "object_type": "entity",
        "object_id": object_id,
        "name": object_id.title(),
        "status": status,
        **extra,
    }


def snapshot(objects, edges=()):
    return {"meta": {"scanned_at": NOW.isoformat()}, "objects": list(objects), "edges": list(edges)}


def use(source: str, target: str, confidence: str = "certain", relation: str = "TARGETS"):
    return {
        "source": source,
        "target": f"entity:{target}",
        "relation": relation,
        "confidence": confidence,
    }


def verdict(objects, edges, object_id, kind="remove_entity"):
    index = {o["object_id"]: o for o in objects}
    return judge_action(kind, object_id, index, list(edges))


def test_unused_orphan_is_ok() -> None:
    result = verdict([entity("sensor.old")], [], "sensor.old")
    assert result["verdict"] == "ok" and result["reasons"] == []


def test_certain_use_blocks_and_probable_use_needs_review() -> None:
    objects = [entity("sensor.a"), entity("sensor.b")]
    edges = [
        use("automation:automation.x", "sensor.a"),
        use("dashboard:main", "sensor.b", "probable", "SHOWS"),
    ]
    a, b = verdict(objects, edges, "sensor.a"), verdict(objects, edges, "sensor.b")
    assert a["verdict"] == "blocked" and "used_certain" in a["reasons"]
    assert b["verdict"] == "review" and "used_probable" in b["reasons"]
    assert a["used_by"][0]["source"] == "automation:automation.x"


def test_working_entities_are_never_removable() -> None:
    result = verdict([entity("light.on", "active")], [], "light.on")
    assert result["verdict"] == "blocked" and "entity_working" in result["reasons"]


def test_statistics_and_unknown_objects() -> None:
    kept = verdict([entity("sensor.s", has_statistics=True)], [], "sensor.s")
    assert kept["verdict"] == "review" and kept["has_statistics"] is True
    assert verdict([], [], "sensor.nope")["reasons"] == ["not_found"]
    assert verdict([entity("sensor.a")], [], "sensor.a", kind="delete_device")["reasons"] == [
        "unsupported_action"
    ]


def test_plan_summary_dedupes_and_never_executes() -> None:
    objects = [entity("sensor.a"), entity("sensor.b", "active")]
    plan = build_plan(
        snapshot(objects),
        [{"kind": "remove_entity", "object_id": "sensor.a"}] * 2
        + [{"kind": "remove_entity", "object_id": "sensor.b"}],
        NOW,
    )
    assert plan["status"] == "dry_run" and plan["executed"] is False
    assert plan["summary"] == {
        "total": 2,
        "ok": 1,
        "review": 0,
        "blocked": 1,
        "uses": 0,
        "statistics": 0,
    }
    assert plan["events"][0]["type"] == "created"


def test_journal_keeps_the_newest_plans_and_only_removes_dry_runs() -> None:
    from custom_components.ha_housekeeper.cleanup import JournalStore

    journal = JournalStore.__new__(JournalStore)
    journal._plans = []
    journal._save = lambda: None
    for number in range(MAX_PLANS + 5):
        journal.add({"plan_id": str(number), "executed": False})
    assert len(journal.plans) == MAX_PLANS and journal.plans[0]["plan_id"] == str(MAX_PLANS + 4)
    journal.plans[0]["executed"] = True
    assert journal.remove(journal.plans[0]["plan_id"]) is False
    assert journal.remove(journal.plans[1]["plan_id"]) is True
