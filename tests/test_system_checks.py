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
