"""Blueprint check: unused files, paths nobody answers, files that fail to load."""

from __future__ import annotations

import pytest

pytest.importorskip("homeassistant")

from custom_components.ha_housekeeper.blueprints import evaluate  # noqa: E402


def test_unused_missing_and_broken_blueprints() -> None:
    available = {
        "automation": {
            "a/used.yaml": {"ok": True, "name": "Used"},
            "a/idle.yaml": {"ok": True, "name": "Idle"},
            "a/bad.yaml": {"ok": False, "name": "a/bad.yaml"},
        },
        "script": {},
    }
    users = {
        "automation": {
            "a/used.yaml": [{"id": "automation.x", "name": "X"}],
            "a/gone.yaml": [{"id": "automation.y", "name": "Y"}],
        },
        "script": {},
    }
    result = evaluate(available, users)
    auto = result["domains"][0]
    assert [b["path"] for b in auto["unused"]] == ["a/idle.yaml"]
    assert [b["path"] for b in auto["missing"]] == ["a/gone.yaml"]
    assert [b["path"] for b in auto["broken"]] == ["a/bad.yaml"]
    assert (result["unused"], result["missing"], result["broken"]) == (1, 1, 1)
