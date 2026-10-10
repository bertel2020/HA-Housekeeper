"""Housekeeper's own backups: protection, the rule's suggestion and the deletion plan."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant
from test_cleanup_exec import make_scanner, run

from custom_components.ha_housekeeper.backup_cleanup import build_rows, delete_backup
from custom_components.ha_housekeeper.cleanup import build_plan, judge_backup_deletion

NOW = datetime(2026, 10, 10, 12, 0, tzinfo=UTC)


def backup(plan_id: str, days: int, *, own: bool = True, size: int = 1000):
    return SimpleNamespace(
        backup_id=f"id-{plan_id}",
        name=f"Housekeeper {plan_id[:8]}" if own else "Automatic backup",
        date=NOW - timedelta(days=days),
        extra_metadata={"housekeeper": True} if own else {},
        agents={"hassio.local": SimpleNamespace(size=size)},
        database_included=True,
    )


def plan(plan_id: str, *, followup=None, kind="remove_entity", status="verified"):
    return {
        "plan_id": plan_id,
        "status": status,
        "executed": True,
        "followup": {"state": followup} if followup else None,
        "actions": [{"kind": kind, "object_id": "x", "result": {"state": "done"}}],
    }


def test_the_rule_protects_what_a_plan_still_needs_and_never_lists_other_backups() -> None:
    ids = ["aaaaaaaa11", "bbbbbbbb22", "cccccccc33", "dddddddd44", "eeeeeeee55", "ffffffff66"]
    backups = {f"id-{p}": backup(p, d) for p, d in zip(ids, (2, 5, 20, 30, 41, 60), strict=True)}
    other = backup("zzzzzzzz99", 90, own=False)
    backups[other.backup_id] = other
    plans = [
        plan(ids[0], followup="watching"),
        plan(ids[2]),
        plan(ids[3]),
        plan(ids[4], kind="migrate_meter"),
    ]
    rows = build_rows(backups, plans, NOW, 3, 14)
    by = {r["plan_id"]: r for r in rows if r["plan_id"]}
    assert [r["backup_id"] for r in rows][:2] == [f"id-{ids[0]}", f"id-{ids[1]}"]
    assert "id-zzzzzzzz99" not in {r["backup_id"] for r in rows}
    assert by[ids[0]]["protected"] == "watching"
    assert by[ids[2]]["protected"] == "undo" and by[ids[3]]["protected"] is None
    assert [r["suggested"] for r in rows] == [False, False, False, True, True, True]
    assert by[ids[4]]["only_return"] is True and by[ids[3]]["only_return"] is False


def test_a_protected_or_missing_backup_is_blocked_and_others_need_review() -> None:
    free = {"name": "Housekeeper a", "protected": None, "only_return": False, "size": 5}
    assert judge_backup_deletion("id-a", free)["verdict"] == "review"
    assert (
        "backup_protected"
        in judge_backup_deletion("id-a", {**free, "protected": "undo"})["reasons"]
    )
    assert judge_backup_deletion("id-a", None)["reasons"] == ["backup_missing"]
    built = build_plan(
        {"objects": [], "edges": [], "meta": {"scanned_at": NOW.isoformat()}},
        [{"kind": "delete_backup", "object_id": "id-a"}],
        NOW,
        backup_data={"id-a": free},
    )
    assert built["simulation"]["backups_deleted"] == 1 and built["simulation"]["backup_bytes"] == 5


async def test_only_housekeeper_backups_are_deleted_and_a_refusal_is_reported(
    hass: HomeAssistant,
) -> None:
    mine, theirs = backup("aaaaaaaa11", 20), backup("zzzzzzzz99", 90, own=False)
    manager = SimpleNamespace(
        async_get_backups=AsyncMock(
            return_value=({mine.backup_id: mine, theirs.backup_id: theirs}, {})
        ),
        async_delete_backup=AsyncMock(return_value={}),
    )
    with patch("homeassistant.components.backup.async_get_manager", return_value=manager):
        assert await delete_backup(hass, theirs.backup_id) == "not_housekeeper_backup"
        assert await delete_backup(hass, "id-gone") is None
        assert await delete_backup(hass, mine.backup_id) is None
        manager.async_delete_backup.assert_awaited_once_with(mine.backup_id)
        manager.async_delete_backup.return_value = {"agent": Exception("x")}
        assert await delete_backup(hass, mine.backup_id) == "delete_failed"
    assert make_scanner and run  # helpers are shared with the plan tests
