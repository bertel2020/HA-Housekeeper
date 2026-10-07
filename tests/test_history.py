"""Tests for scan checkpoints and comparison; they need Home Assistant only for the Store."""

from __future__ import annotations

import pytest

pytest.importorskip("homeassistant")

from custom_components.ha_housekeeper.history import (  # noqa: E402
    ScanHistory,
    diff_checkpoints,
    make_checkpoint,
)


def _snapshot(at: str, objects: list[tuple[str, str, str]], findings: list[dict] | None = None):
    return {
        "meta": {"scanned_at": at},
        "objects": [
            {"object_type": t, "object_id": oid, "name": oid.upper(), "status": status}
            for t, oid, status in objects
        ],
        "edges": [],
        "findings": findings or [],
    }


FINDING = {"rule_id": "entity.state_missing", "object_id": "sensor.b", "classification": "orphaned"}


def test_diff_reports_new_removed_changed_and_findings() -> None:
    old = _snapshot(
        "2026-10-06T10:00:00+00:00",
        [
            ("entity", "sensor.a", "active"),
            ("entity", "sensor.b", "active"),
            ("device", "d1", "active"),
        ],
        [FINDING],
    )
    new = _snapshot(
        "2026-10-07T10:00:00+00:00",
        [
            ("entity", "sensor.a", "unavailable"),
            ("entity", "sensor.c", "active"),
            ("device", "d1", "active"),
        ],
        [
            {
                "rule_id": "entity.state_unavailable",
                "object_id": "sensor.a",
                "classification": "unavailable",
            }
        ],
    )

    diff = diff_checkpoints(make_checkpoint(old), new)

    assert [o["object_id"] for o in diff["new_objects"]["items"]] == ["sensor.c"]
    assert [o["object_id"] for o in diff["removed_objects"]["items"]] == ["sensor.b"]
    change = diff["status_changes"]["items"][0]
    assert (change["object_id"], change["from"], change["to"], change["name"]) == (
        "sensor.a",
        "active",
        "unavailable",
        "SENSOR.A",
    )
    assert [f["rule_id"] for f in diff["new_findings"]["items"]] == ["entity.state_unavailable"]
    assert diff["resolved_findings"]["items"] == [
        {"rule_id": "entity.state_missing", "object_id": "sensor.b", "affected_object": None}
    ]


def test_identical_scans_have_no_differences() -> None:
    snap = _snapshot("2026-10-07T10:00:00+00:00", [("entity", "sensor.a", "active")], [FINDING])
    diff = diff_checkpoints(make_checkpoint(snap), snap)
    assert all(
        diff[key]["total"] == 0
        for key in (
            "new_objects",
            "removed_objects",
            "status_changes",
            "new_findings",
            "resolved_findings",
        )
    )


def test_history_keeps_previous_and_one_checkpoint_per_day(hass) -> None:
    history = ScanHistory(hass)
    day1 = _snapshot("2026-10-05T08:00:00+00:00", [("entity", "x.a", "active")])
    day1b = _snapshot("2026-10-05T20:00:00+00:00", [("entity", "x.a", "active")])
    day2 = _snapshot("2026-10-06T08:00:00+00:00", [("entity", "x.a", "unavailable")])

    assert history.compare(day1, "previous")["available"] is False
    history.record(day1)
    history.record(day1b)
    history.record(day2)

    options = history.baselines()
    assert options[0] == {"id": "previous", "at": day1b["meta"]["scanned_at"]}
    assert [o["at"] for o in options[1:]] == [day1b["meta"]["scanned_at"]]

    result = history.compare(day2, "previous")
    assert result["available"] and result["status_changes"]["total"] == 1
    assert history.compare(day2, "unknown")["available"] is False
