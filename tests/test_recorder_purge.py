"""The recorder purge only touches orphaned statistics, never an existing entity or the Energy dashboard."""

from __future__ import annotations

import pytest

pytest.importorskip("homeassistant")

from custom_components.ha_housekeeper.recorder_purge import judge  # noqa: E402


def test_only_orphaned_ids_outside_energy_may_go() -> None:
    orphans = {
        "sensor.gone": {"in_energy": False},
        "sensor.energy": {"in_energy": True},
        "sensor.back": {"in_energy": False},
    }
    allowed, skipped = judge(
        ["sensor.gone", "sensor.energy", "sensor.back", "sensor.unknown", "sensor.gone"],
        orphans,
        exists={"sensor.back"},
    )
    assert allowed == ["sensor.gone"]
    assert {(s["id"], s["reason"]) for s in skipped} == {
        ("sensor.energy", "in_energy"),
        ("sensor.back", "exists"),
        ("sensor.unknown", "not_orphaned"),
    }
