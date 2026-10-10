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
    assert options[0]["id"] == "previous" and options[0]["at"] == day1b["meta"]["scanned_at"]
    assert options[0]["findings"] == 0 and options[0]["objects"] == 1
    # the day's last scan is already the previous one, so it is listed once
    assert len(options) == 1

    result = history.compare(day2, "previous")
    assert result["available"] and result["status_changes"]["total"] == 1
    assert history.compare(day2, "unknown")["available"] is False


def test_history_drops_checkpoints_older_than_the_retention(hass) -> None:
    history = ScanHistory(hass)
    history.retention_days = 3
    for day in range(1, 8):
        history.record(_snapshot(f"2026-10-0{day}T08:00:00+00:00", [("entity", "x.a", "active")]))

    ats = [o["at"][:10] for o in history.baselines()]
    assert ats[0] == "2026-10-06"
    assert min(ats) >= "2026-10-04"
    result = history.compare(_snapshot("2026-10-07T09:00:00+00:00", []), "previous")
    assert result["retention_days"] == 3 and result["current"] == {"objects": 0, "findings": 0}


def test_series_lists_the_days_and_the_latest_scan_with_unavailable(hass) -> None:
    history = ScanHistory(hass)
    assert history.series()["points"] == []
    history.record(_snapshot("2026-10-05T08:00:00+00:00", [("entity", "x.a", "active")]))
    history.record(
        _snapshot(
            "2026-10-06T08:00:00+00:00",
            [("entity", "x.a", "unavailable"), ("entity", "x.b", "active")],
        )
    )
    history.record(_snapshot("2026-10-06T20:00:00+00:00", [("entity", "x.a", "unavailable")]))

    points = history.series()["points"]
    assert [(p["at"][:10], p["objects"], p["unavailable"]) for p in points] == [
        ("2026-10-05", 1, 0),
        ("2026-10-06", 1, 1),
    ]
