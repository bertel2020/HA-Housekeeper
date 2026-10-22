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
    assert error[0]["way"] == "open_integration" and error[0]["path"].endswith("/hue")
    assert ways_for(entry("migration_error"), snapshot)[0]["way"] == "restart_or_update"
    reauth = {"rule_id": "config_entry.reauth", "object_id": "e1", "topic": "down"}
    assert ways_for(reauth, snapshot)[0]["way"] == "reauth"
    assert (
        ways_for({"rule_id": "automation.stale", "object_id": "a", "topic": "unneeded"}, snapshot)
        == []
    )
