"""Tests for the duplicate and unused-automation heuristics (no Home Assistant required)."""

from __future__ import annotations

from datetime import UTC, datetime

from custom_components.ha_housekeeper.hygiene import (
    automation_hygiene_findings,
    duplicate_findings,
    mark_duplicates,
)

NOW = datetime(2026, 10, 7, tzinfo=UTC)


def _entity(object_id: str, status: str, platform: str = "cast", since: str | None = None) -> dict:
    return {"object_id": object_id, "status": status, "platform": platform, "status_since": since}


def test_unavailable_suffixed_twin_of_an_active_entity_is_a_duplicate() -> None:
    entities = [
        _entity("media_player.tv", "active"),
        _entity("media_player.tv_2", "unavailable"),
        _entity("media_player.tv_3", "orphaned"),
    ]
    mark_duplicates(entities)

    assert [e["duplicate_of"] for e in entities] == [None, "media_player.tv", "media_player.tv"]


def test_two_active_entities_or_other_integrations_are_not_duplicates() -> None:
    entities = [
        _entity("sensor.power", "active", "shelly"),
        _entity("sensor.power_2", "active", "shelly"),
        _entity("light.lamp", "active", "hue"),
        _entity("light.lamp_2", "unavailable", "zha"),
        _entity("sensor.other_2", "unavailable", "hue"),
    ]
    mark_duplicates(entities)

    assert all(e["duplicate_of"] is None for e in entities)


def test_duplicate_findings_respect_the_outage_filter() -> None:
    entities = [
        _entity("a.x", "active"),
        _entity("a.x_2", "unavailable", since="2026-10-06T00:00:00+00:00"),
    ]
    mark_duplicates(entities)

    assert duplicate_findings(entities, lambda item: False) == []
    finding = duplicate_findings(entities, lambda item: True)[0]
    assert (finding["rule_id"], finding["affected_object"], finding["classification"]) == (
        "entity.possible_duplicate",
        "a.x",
        "possible_duplicate",
    )


def _automation(object_id: str, status: str, **extra) -> dict:
    return {"object_type": "automation", "object_id": object_id, "status": status, **extra}


def test_automation_hygiene_rules() -> None:
    automations = [
        _automation("automation.old_never", "active", created_at="2026-01-01T00:00:00+00:00"),
        _automation("automation.new_never", "active", created_at="2026-10-01T00:00:00+00:00"),
        _automation("automation.stale", "active", last_triggered="2026-05-01T00:00:00+00:00"),
        _automation("automation.fresh", "active", last_triggered="2026-10-06T00:00:00+00:00"),
        _automation("automation.off_long", "disabled", status_since="2026-06-01T00:00:00+00:00"),
        _automation("automation.off_short", "disabled", status_since="2026-10-01T00:00:00+00:00"),
        _automation("automation.broken", "unavailable", created_at="2025-01-01T00:00:00+00:00"),
        {"object_type": "script", "object_id": "script.x", "status": "active"},
    ]
    findings = automation_hygiene_findings(automations, NOW, 90)

    assert {(f["rule_id"], f["object_id"]) for f in findings} == {
        ("automation.never_triggered", "automation.old_never"),
        ("automation.stale", "automation.stale"),
        ("automation.disabled_long", "automation.off_long"),
    }
    assert all(f["classification"] == "unused" for f in findings)
    assert next(f for f in findings if f["rule_id"] == "automation.disabled_long")[
        "first_detected_at"
    ]
    assert automation_hygiene_findings(automations, NOW, 0) == []


def test_automation_without_any_age_information_is_never_reported() -> None:
    assert automation_hygiene_findings([_automation("automation.a", "active")], NOW, 90) == []
