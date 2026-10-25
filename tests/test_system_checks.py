"""The levels the central log reads from the system and the integration entries."""

from __future__ import annotations

from custom_components.ha_housekeeper.system_checks import service_checks, system_checks


def test_disk_and_memory_levels_follow_the_used_share_and_unread_parts_are_unknown() -> None:
    checks = {
        c["id"]: c for c in system_checks({"percent": 91.0, "free": 5}, {"ram": {"percent": 50}})
    }
    assert checks["disk"]["level"] == "problem" and checks["disk"]["values"]["used_percent"] == 91.0
    assert checks["memory"]["level"] == "ok"
    checks = {c["id"]: c for c in system_checks({"percent": 82.0}, {"ram": {}})}
    assert checks["disk"]["level"] == "note" and checks["memory"]["level"] == "unknown"


def test_a_failed_setup_is_a_problem_and_a_retry_a_hint() -> None:
    assert service_checks({"a": "loaded"})[0]["level"] == "ok"
    retry = service_checks({"a": "loaded", "b": "setup_retry"})[0]
    assert retry["level"] == "note" and retry["values"] == {
        "errors": 0,
        "retrying": 1,
        "entries": 2,
    }
    assert service_checks({"a": "setup_retry", "b": "setup_error"})[0]["level"] == "problem"


def test_goals_become_checks_only_when_met_or_missed_and_a_scan_that_needs_repair_is_a_problem() -> (
    None
):
    from custom_components.ha_housekeeper.system_checks import goal_checks, scan_check

    goals = {
        "goals": [
            {"id": "a", "state": "met", "value": 0, "limit": 0},
            {"id": "b", "state": "missed", "value": 7, "limit": 3},
            {"id": "c", "state": "unknown", "value": None, "limit": 3},
            {"id": "d", "state": "off", "value": 1, "limit": 3},
        ]
    }
    levels = {c["id"]: c["level"] for c in goal_checks(goals)}
    assert levels == {"a": "ok", "b": "note"}
    assert scan_check({"state": "ok"})[0]["level"] == "ok"
    assert (
        scan_check({"state": "failed", "needs_repair": False, "consecutive_failures": 1})[0][
            "level"
        ]
        == "note"
    )
    assert scan_check({"state": "failed", "needs_repair": True})[0]["level"] == "problem"
    assert scan_check({"state": "preliminary"}) == []
