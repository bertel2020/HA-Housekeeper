"""Levels of the system and the integrations for the central log: numbers only, no names.

Both are plain functions on plain data, so the thresholds can be tested without Home Assistant.
The log writes a change down only when the level of a check differs from the last look.
"""

from __future__ import annotations

from typing import Any

DISK_NOTE_PERCENT, DISK_PROBLEM_PERCENT = 80.0, 90.0  # used space of the data disk
RAM_NOTE_PERCENT, RAM_PROBLEM_PERCENT = 85.0, 95.0
FAILING_PROBLEM = frozenset({"setup_error", "migration_error", "failed_unload"})
FAILING_NOTE = frozenset({"setup_retry"})


def _level(percent: float | None, note: float, problem: float) -> str:
    if percent is None:
        return "unknown"
    return "problem" if percent >= problem else "note" if percent >= note else "ok"


def system_checks(disk: dict[str, Any], memory: dict[str, Any]) -> list[dict[str, Any]]:
    """Free disk space and memory; a part that could not be read is ``unknown``."""
    ram = (memory or {}).get("ram") or {}
    return [
        {
            "id": "disk",
            "level": _level(disk.get("percent"), DISK_NOTE_PERCENT, DISK_PROBLEM_PERCENT),
            "values": {
                "used_percent": disk.get("percent"),
                "free_bytes": disk.get("free"),
                "limit_percent": DISK_PROBLEM_PERCENT,
            },
        },
        {
            "id": "memory",
            "level": _level(ram.get("percent"), RAM_NOTE_PERCENT, RAM_PROBLEM_PERCENT),
            "values": {"used_percent": ram.get("percent"), "limit_percent": RAM_PROBLEM_PERCENT},
        },
    ]


def service_checks(states: dict[str, str]) -> list[dict[str, Any]]:
    """The integration entries whose setup failed: errors are a problem, retries a hint."""
    values = list(states.values())
    errors = sum(state in FAILING_PROBLEM for state in values)
    retrying = sum(state in FAILING_NOTE for state in values)
    return [
        {
            "id": "setup",
            "level": "problem" if errors else "note" if retrying else "ok",
            "values": {"errors": errors, "retrying": retrying, "entries": len(values)},
        }
    ]
