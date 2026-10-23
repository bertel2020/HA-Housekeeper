"""Every rule of the scan belongs to one topic."""

from __future__ import annotations

import re
from pathlib import Path

from custom_components.ha_housekeeper.finding_topics import (
    _RULES,
    BROKEN_REFERENCES,
    DOWN,
    FAILING_AUTOMATIONS,
    TOPICS,
    UNNEEDED,
    topic_of,
)

COMPONENT = Path(__file__).parent.parent / "custom_components" / "ha_housekeeper"


def test_every_rule_has_its_topic() -> None:
    assert set(_RULES.values()) <= set(TOPICS) and len(set(_RULES.values())) == 4
    assert topic_of("entity.state_unavailable") == DOWN and topic_of("device.down") == DOWN
    assert topic_of("automation.missing_entity") == BROKEN_REFERENCES
    assert topic_of("config_entry.missing_entity") == BROKEN_REFERENCES
    assert topic_of("script.missing_service") == BROKEN_REFERENCES
    assert topic_of("script.dead_actions") == FAILING_AUTOMATIONS
    assert topic_of("entity.not_provided") == UNNEEDED


def test_every_rule_in_the_code_is_in_the_table() -> None:
    """A rule written as a literal in the scan has an entry; the built ones are covered by their pattern."""
    found = set()
    for path in COMPONENT.glob("*.py"):
        found |= set(
            re.findall(r'"rule_id": "([a-z_]+\.[a-z_]+)"', path.read_text(encoding="utf-8"))
        )
    assert found
    assert found <= set(_RULES), found - set(_RULES)


def test_failing_runs_become_findings_with_their_impact() -> None:
    from datetime import UTC, datetime

    from custom_components.ha_housekeeper.run_health import run_findings
    from custom_components.ha_housekeeper.runs import ERROR, FIELDS, OK, RUNS

    now = datetime(2026, 10, 22, 12, tzinfo=UTC)

    def day(runs: int, ok: int, errors: int) -> dict:
        counts = [0] * FIELDS
        counts[RUNS], counts[OK], counts[ERROR] = runs, ok, errors
        return {"c": counts}

    objects = [
        {"object_type": "automation", "object_id": "automation.a", "name": "A"},
        {"object_type": "script", "object_id": "script.b", "name": "B"},
    ]
    items = {
        "automation.a": {"days": {"2026-10-21": day(6, 0, 6)}},
        "script.b": {"days": {"2026-10-21": day(10, 7, 3)}},
    }
    from custom_components.ha_housekeeper.runs import run_key

    items = {run_key(o): items[o["object_id"]] for o in objects}
    found = {f["rule_id"]: f for f in run_findings(items, objects, now)}
    assert found["automation.never_ok"]["run_level"] == "red"
    assert found["automation.never_ok"]["confidence"] == 0.9
    assert found["script.run_failing"]["run_level"] == "warn"
    assert all(topic_of(rule) == FAILING_AUTOMATIONS for rule in found)


def test_a_checkpoint_counts_the_topics_and_an_old_one_is_recounted_from_its_keys() -> None:
    from custom_components.ha_housekeeper.history import _topics_from_keys, make_checkpoint

    snapshot = {
        "meta": {"scanned_at": "2026-10-22T10:00:00+00:00"},
        "objects": [],
        "causes": [],
        "findings": [
            {"rule_id": "device.down", "object_id": "d", "classification": "unavailable"},
            {
                "rule_id": "entity.state_unavailable",
                "object_id": "sensor.a",
                "classification": "unavailable",
                "cause_id": "device_down:d",
            },
            {"rule_id": "automation.missing_entity", "object_id": "a", "classification": "x"},
        ],
    }
    point = make_checkpoint(snapshot)
    assert point["topics"] == {"down": 2, "broken_references": 1}
    assert point["lead_topics"] == {"down": 1, "broken_references": 1}
    assert _topics_from_keys({"findings": ["device.down|d|", "automation.stale|a|"]}) == {
        "down": 1,
        "unneeded": 1,
    }


def test_a_checkpoint_counts_the_objects_with_findings_and_the_sites_of_work_per_topic() -> None:
    from custom_components.ha_housekeeper.history import make_checkpoint

    snapshot = {
        "meta": {"scanned_at": "2026-10-22T10:00:00+00:00"},
        "objects": [
            {"object_type": "device", "object_id": "d1", "status": "active"},
            {
                "object_type": "entity",
                "object_id": "sensor.a",
                "status": "unavailable",
                "device_id": "d1",
            },
            {
                "object_type": "entity",
                "object_id": "sensor.b",
                "status": "unavailable",
                "device_id": "d1",
            },
        ],
        "causes": [
            {"id": "device_down:d1", "parent_id": None, "object_type": "device", "object_id": "d1"}
        ],
        "findings": [
            {"rule_id": "device.down", "object_id": "d1", "classification": "unavailable"},
            {
                "rule_id": "entity.state_unavailable",
                "object_id": "sensor.a",
                "classification": "u",
                "cause_id": "device_down:d1",
            },
            {
                "rule_id": "entity.state_unavailable",
                "object_id": "sensor.b",
                "classification": "u",
                "cause_id": "device_down:d1",
            },
            {"rule_id": "automation.missing_entity", "object_id": "a", "classification": "x"},
        ],
    }
    point = make_checkpoint(snapshot)
    # The entities belong to their device and a follow-up is no site of work of its own: one device, one automation.
    assert point["affected"] == 2
    assert point["lead_object_topics"] == {"down": 1, "broken_references": 1}


def test_the_sensor_counts_new_findings_of_high_or_medium_impact_in_the_last_day() -> None:
    from custom_components.ha_housekeeper.sensor import compute_values

    def finding(key, impact, first_seen, **extra):
        return {
            "key": key,
            "rule_id": "entity.x",
            "classification": "unavailable",
            "impact": impact,
            "first_seen_at": first_seen,
            **extra,
        }

    snapshot = {
        "meta": {"scanned_at": "2026-10-22T12:00:00+00:00", "preliminary": False},
        "findings": [
            finding("a", "high", "2026-10-22T08:00:00+00:00"),
            finding("b", "medium", "2026-10-21T13:00:00+00:00"),
            finding("c", "low", "2026-10-22T08:00:00+00:00"),
            finding("d", "high", "2026-10-20T08:00:00+00:00"),
            finding("e", "high", None),
            finding("f", "high", "2026-10-22T08:00:00+00:00", ignored=True),
        ],
    }
    assert compute_values(snapshot)["new_findings"] == 2


def test_the_ways_to_fix_an_outage_follow_the_state_of_the_integration() -> None:
    from custom_components.ha_housekeeper.fix_ways import ways_for

    snapshot = {"objects": [{"object_type": "config_entry", "object_id": "e1", "domain": "hue"}]}

    def entry(state):
        return {
            "rule_id": "config_entry.not_loaded",
            "object_id": "e1",
            "topic": "down",
            "evidence": [{"kind": state}],
        }

    wait = ways_for(entry("setup_retry"), snapshot)
    assert wait[0]["way"] == "wait" and wait[0]["recommended"]
    error = ways_for(entry("setup_error"), snapshot)
    assert error[0]["way"] == "reload" and error[0]["recommended"]
    assert error[1]["way"] == "open_integration" and error[1]["path"].endswith("/hue")
    assert ways_for(entry("migration_error"), snapshot)[0]["way"] == "restart_or_update"
    reauth = {"rule_id": "config_entry.reauth", "object_id": "e1", "topic": "down"}
    assert ways_for(reauth, snapshot)[0]["way"] == "reauth"
    assert (
        ways_for({"rule_id": "automation.stale", "object_id": "a", "topic": "unneeded"}, snapshot)[
            0
        ]["way"]
        == "cleanup_round"
    )
    assert ways_for({"rule_id": "x.y", "object_id": "a", "topic": "other"}, snapshot) == []


def test_the_ways_to_fix_a_broken_reference_replace_an_entity_or_open_the_editor() -> None:
    from custom_components.ha_housekeeper.fix_ways import ways_for

    entity = {
        "rule_id": "automation.missing_entity",
        "object_id": "a",
        "topic": "broken_references",
        "affected_object": "sensor.old",
        "suggestions": ["sensor.new"],
    }
    ways = ways_for(entity, {})
    assert [w["way"] for w in ways] == ["replace_target", "remove_reference", "open_editor"]
    assert ways[1]["target"] == "sensor.old" and ways[1]["enabled"] is False
    assert ways[0]["recommended"] and ways[0]["suggestion"] == "sensor.new"
    area = {**entity, "rule_id": "automation.missing_area", "affected_object": "garden"}
    area_ways = ways_for(area, {}, refactor_enabled=True)
    assert [w["way"] for w in area_ways] == ["replace_target", "remove_reference", "open_editor"]
    assert area_ways[0]["target_kind"] == "area" and area_ways[0]["recommended"]
    helper = {**entity, "rule_id": "config_entry.missing_area", "affected_object": "garden"}
    assert [w["way"] for w in ways_for(helper, {})] == ["open_editor"]
    service = {**entity, "rule_id": "automation.missing_service", "affected_object": "x.y"}
    only = ways_for(service, {})
    assert [w["way"] for w in only] == ["open_editor"] and only[0]["recommended"]
    scene = {**entity, "rule_id": "scene.missing_entity"}
    assert "remove_reference" not in [w["way"] for w in ways_for(scene, {})]


def test_the_cleanup_round_sorts_by_what_the_plan_judged() -> None:
    from custom_components.ha_housekeeper.cleanup_round import (
        duplicate_rows,
        needs_first_step,
        removal_requests,
        sort_row,
    )

    def finding(rule, object_id, **extra):
        return {
            "key": f"{rule}|{object_id}",
            "rule_id": rule,
            "object_id": object_id,
            "topic": "unneeded",
            **extra,
        }

    snapshot = {
        "findings": [
            finding("entity.not_provided", "sensor.a"),
            finding("entity.state_missing", "sensor.a"),
            finding("automation.stale", "automation.b"),
            finding("entity.possible_duplicate", "sensor.c"),
            finding("entity.not_provided", "sensor.d", ignored=True),
        ],
        "objects": [{"object_type": "entity", "object_id": "sensor.c", "duplicate_of": "sensor.e"}],
    }
    requests = removal_requests(snapshot)
    assert [(r["kind"], r["object_id"]) for r in requests] == [
        ("remove_entity", "sensor.a"),
        ("delete_automation", "automation.b"),
    ]
    assert duplicate_rows(snapshot)[0]["duplicate_of"] == "sensor.e"
    ok = {"kind": "remove_entity", "verdict": "ok", "reasons": []}
    assert sort_row(requests[0], ok, None)["group"] == "safe"
    review = {**ok, "verdict": "review", "reasons": ["used_probable"]}
    assert sort_row(requests[0], review, None)["group"] == "look"
    held = {**ok, "verdict": "blocked", "reasons": ["not_quarantined"]}
    assert needs_first_step(requests[0], held)
    disable = {"kind": "disable_entity", "verdict": "ok", "reasons": []}
    row = sort_row(requests[0], held, disable)
    assert row["group"] == "look" and row["kind"] == "disable_entity" and row["first_step"]
    blocked = {**ok, "verdict": "blocked", "reasons": ["marked_keep"]}
    assert sort_row(requests[0], blocked, None)["group"] == "blocked"


def test_the_ways_to_fix_a_failing_automation_start_with_its_cause() -> None:
    from custom_components.ha_housekeeper.failure_info import error_hint
    from custom_components.ha_housekeeper.fix_ways import ways_for

    caused = {
        "rule_id": "automation.blocked",
        "object_id": "automation.a",
        "topic": "failing_automations",
        "cause_id": "c1",
    }
    ways = ways_for(caused, {})
    assert [w["way"] for w in ways] == ["fix_cause", "open_editor", "object_actions"]
    assert ways[0]["recommended"] and not ways[1]["recommended"]
    own = {
        "rule_id": "automation.run_failing",
        "object_id": "automation.a",
        "topic": "failing_automations",
    }
    assert [(w["way"], w["recommended"]) for w in ways_for(own, {})] == [
        ("open_editor", True),
        ("catch_error", False),
    ]
    down = {"cover.bath": "entity:cover.bath"}
    hint = error_hint("Entity cover.bath is unavailable", down)
    assert hint == {"entity_id": "cover.bath", "finding_key": "entity:cover.bath"}
    assert (
        error_hint("Entity light.other is unavailable", down) is None
        and error_hint(None, down) is None
    )


def test_the_callers_of_a_missing_target_and_a_cause_without_a_finding_are_counted_as_the_panel_does() -> (
    None
):
    from custom_components.ha_housekeeper.history import make_checkpoint

    def cause(kind: str, object_type: str, object_id: str, **extra: object) -> dict:
        return {
            "id": f"{kind}:{object_id}",
            "object_type": object_type,
            "object_id": object_id,
            **extra,
        }

    snapshot = {
        "meta": {"scanned_at": "2026-10-22T10:00:00+00:00"},
        "objects": [],
        "causes": [
            cause("entity_missing", "entity", "sensor.gone", virtual=True),
            cause("integration_down", "config_entry", "e1", virtual=False),
        ],
        "findings": [
            {
                "rule_id": "automation.missing_entity",
                "object_id": "a1",
                "classification": "x",
                "cause_id": "entity_missing:sensor.gone",
            },
            {
                "rule_id": "automation.missing_entity",
                "object_id": "a2",
                "classification": "x",
                "cause_id": "entity_missing:sensor.gone",
            },
            {
                "rule_id": "entity.state_unavailable",
                "object_id": "sensor.a",
                "classification": "u",
                "cause_id": "integration_down:e1",
            },
            {
                "rule_id": "entity.state_unavailable",
                "object_id": "sensor.b",
                "classification": "u",
                "cause_id": "integration_down:e1",
            },
        ],
    }
    point = make_checkpoint(snapshot)
    assert point["lead_object_topics"] == {"broken_references": 2, "down": 1}
    # Four owners of findings and the integration that stands behind two of them; the missing target is no object.
    assert point["affected"] == 5
    assert make_checkpoint({**snapshot, "findings": []})["lead_object_topics"] == {}


def test_the_server_counts_the_tile_figures_of_the_shared_fixture() -> None:
    """The panel counts the same data to the same numbers (tests/panel.test.mjs reads this file too)."""
    import json
    from pathlib import Path

    from custom_components.ha_housekeeper.history import make_checkpoint

    fixture = json.loads((Path(__file__).parent / "fixtures" / "tile_counts.json").read_text())
    point = make_checkpoint(fixture["snapshot"])
    assert point["affected"] == fixture["expected"]["affected"]
    assert point["lead_object_topics"] == fixture["expected"]["lead_object_topics"]
