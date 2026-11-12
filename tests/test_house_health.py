"""The numbers behind the dashboard card: objects and worst impact per topic, and what changed since the scan before."""

from __future__ import annotations

import pytest

pytest.importorskip("homeassistant")

from custom_components.ha_housekeeper.history import make_checkpoint  # noqa: E402
from custom_components.ha_housekeeper.house_health import house_health  # noqa: E402


def _snapshot(at: str, findings: list[dict]) -> dict:
    return {
        "meta": {"scanned_at": at},
        "objects": [
            {"object_type": "entity", "object_id": i, "name": i, "status": "active"}
            for i in ("sensor.a", "sensor.b", "sensor.c")
        ],
        "edges": [],
        "findings": findings,
    }


def _finding(rule_id: str, object_id: str, impact: str, **extra: object) -> dict:
    return {
        "rule_id": rule_id,
        "object_id": object_id,
        "classification": "unavailable",
        "impact": impact,
        **extra,
    }


def test_the_state_follows_the_worst_impact_and_the_topics_count_their_objects() -> None:
    quiet = _snapshot(
        "2026-11-12T10:00:00+00:00", [_finding("entity.state_missing", "sensor.a", "low")]
    )
    result = house_health(quiet, None)
    assert result["state"] == "ok", (
        "a low impact is listed on the card but does not call for attention"
    )
    assert result["topics"]["unneeded"] == {"objects": 1, "level": "low"}
    assert result["new"] is None and result["resolved"] is None, "no scan to compare with yet"

    snapshot = _snapshot(
        "2026-11-12T11:00:00+00:00",
        [
            _finding("entity.state_missing", "sensor.a", "low"),
            _finding("entity.state_unavailable", "sensor.b", "medium"),
            _finding("entity.state_unavailable", "sensor.c", "high"),
            _finding("entity.state_unavailable", "sensor.a", "high", ignored=True),
        ],
    )
    result = house_health(snapshot, make_checkpoint(quiet))
    assert result["state"] == "urgent"
    assert result["topics"]["down"] == {"objects": 2, "level": "high"}, (
        "a hidden finding counts for nothing"
    )
    assert result["topics"]["broken_references"] == {"objects": 0, "level": "none"}
    assert result["objects"] == 3
    assert (result["new"], result["resolved"]) == (2, 0)
    assert result["since"] == "2026-11-12T10:00:00+00:00"
