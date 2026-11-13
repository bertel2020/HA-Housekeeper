"""The numbers behind the card after the update: what is worse since the update, named and in a useful order."""

from __future__ import annotations

import pytest

pytest.importorskip("homeassistant")

from custom_components.ha_housekeeper.update_card import start_figures, update_view  # noqa: E402

OBJECTS = [
    {"object_type": "config_entry", "object_id": "e1", "name": "Hue"},
    {"object_type": "entity", "object_id": "sensor.x", "name": "Außentemperatur"},
    {"object_type": "automation", "object_id": "automation.a", "name": "Licht Flur"},
]
TRIGGER = {"kind": "ha_version", "from": "2026.11.0", "to": "2026.11.1"}


def _bad(statuses: dict[str, str]) -> dict:
    return {
        "bad": statuses,
        "bad_total": len(statuses),
        "silent": {},
        "silent_total": 0,
        "findings": [],
        "unchecked": [],
        "repairs": [],
    }


def _watch(samples: list[dict], **extra: object) -> dict:
    return {
        "id": "w1",
        "started_at": "2026-11-12T10:00:00+00:00",
        "detected_at": "2026-11-12T10:05:00+00:00",
        "until": "2026-11-12T22:00:00+00:00",
        "triggers": [TRIGGER],
        "before": {"at": "2026-11-12T09:55:00+00:00", **_bad({})},
        "samples": samples,
        "closed_at": None,
        "verdict": None,
        **extra,
    }


def test_what_is_worse_since_the_update_is_named_and_the_integration_comes_first() -> None:
    sample = {
        "at": "2026-11-12T11:00:00+00:00",
        **_bad(
            {
                "entity:sensor.x": "unavailable",
                "config_entry:e1": "problem",
                "automation:automation.a": "unavailable",
            }
        ),
    }
    view = update_view(_watch([sample]), frozenset(), OBJECTS, [])
    assert view["state"] == "worse" and view["open"] is True
    assert [(p["name"], p["type"], p["status"]) for p in view["problems"]] == [
        ("Hue", "config_entry", "problem"),
        ("Licht Flur", "automation", "unavailable"),
        ("Außentemperatur", "entity", "unavailable"),
    ]
    assert view["problems_total"] == 3
    assert view["triggers"] == [{"kind": "ha_version", "to": "2026.11.1"}]
    quiet = update_view(_watch([sample]), frozenset({"entity:sensor.x"}), OBJECTS, [])
    assert quiet["problems_total"] == 2, "an object marked as expected is no news"


def test_a_watch_without_a_sample_waits_and_no_watch_says_none() -> None:
    waiting = update_view(_watch([]), frozenset(), OBJECTS, [])
    assert waiting["state"] == "pending" and waiting["next_check"] is not None
    assert update_view(None, frozenset(), OBJECTS, []) == {
        "state": "none",
        "start_seconds": None,
        "start_usual_seconds": None,
    }


def test_the_start_is_compared_with_the_starts_before_it() -> None:
    starts = [{"boot_s": 150}, {"boot_s": 140}, {"boot_s": None}, {"boot_s": 192.4}]
    assert start_figures(starts) == {"start_seconds": 192.4, "start_usual_seconds": 145.0}
    assert start_figures([{"boot_s": 100}]) == {"start_seconds": 100.0, "start_usual_seconds": None}
