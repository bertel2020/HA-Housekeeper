"""The certainty of a finding: a level by the kind of proof, adjustments, a follow-up capped by its cause."""

from __future__ import annotations

import re
from pathlib import Path

from custom_components.ha_housekeeper.certainty import (
    _RULES,
    LEVEL_VALUE,
    apply_certainty,
    level_of,
)
from custom_components.ha_housekeeper.finding_topics import _RULES as TOPIC_RULES

COMPONENT = Path(__file__).parent.parent / "custom_components" / "ha_housekeeper"


def finding(rule, key="k", **extra):
    return {"rule_id": rule, "key": key, "evidence": [{}], **extra}


def test_every_rule_with_a_topic_has_a_level() -> None:
    literal = set()
    for path in COMPONENT.glob("*.py"):
        literal |= set(
            re.findall(r'"rule_id": "([a-z_]+\.[a-z_]+)"', path.read_text(encoding="utf-8"))
        )
    for rule in (*TOPIC_RULES, *literal):
        assert level_of(finding(rule)) in LEVEL_VALUE, rule
    assert set(_RULES) <= set(TOPIC_RULES) | {"script.never_ok", "script.run_failing"}


def test_the_level_follows_the_proof() -> None:
    assert level_of(finding("automation.missing_entity")) == "proven"
    assert level_of(finding("automation.missing_service")) == "reported"
    assert level_of(finding("script.dead_actions")) == "derived"
    assert level_of(finding("entity.stale")) == "guessed"
    reported = finding("config_entry.not_loaded", evidence=[{"kind": "setup_error"}])
    assert level_of(reported) == "reported"
    assert (
        level_of(finding("config_entry.not_loaded", evidence=[{"kind": "not_loaded"}])) == "derived"
    )


def test_a_runtime_reference_is_less_certain_and_a_follow_up_is_never_more_certain_than_its_cause() -> (
    None
):
    sure = finding("automation.missing_entity", "a", evidence=[{"location": "actions/0"}])
    runtime = finding(
        "automation.missing_entity", "b", evidence=[{"location": "runtime_extraction"}]
    )
    cause = finding("device.down", "c")
    follower = finding("entity.state_missing", "d", cause_id="device_down:x")
    heavy = finding("entity.not_provided", "e", cause_id="device_down:x")
    apply_certainty(
        [sure, runtime, cause, follower, heavy],
        [{"id": "device_down:x", "finding_key": "c"}],
    )
    assert (sure["confidence"], runtime["confidence"]) == (0.98, 0.88)
    assert runtime["confidence_notes"] == [{"code": "runtime_reference", "delta": -0.1}]
    assert cause["confidence"] == 0.9 and cause["confidence_level"] == "reported"
    assert follower["confidence"] == 0.75, "already lower than its cause"
    assert heavy["confidence"] == 0.9 and heavy["confidence_notes"][-1] == {
        "code": "cause",
        "cap": 0.9,
    }


def test_a_recurring_outage_is_less_certain_and_a_long_lasting_state_more_certain() -> None:
    from datetime import UTC, datetime

    now = datetime(2026, 10, 22, 12, tzinfo=UTC)
    waits = {"outage_info_minutes": 5, "stale_hours": 12, "unused_automation_days": 60}
    repeating = finding(
        "entity.state_unavailable",
        "a",
        object_id="sensor.r",
        first_detected_at="2026-10-22T11:50:00+00:00",
    )
    lasting = finding(
        "entity.state_unavailable",
        "b",
        object_id="sensor.l",
        first_detected_at="2026-10-10T12:00:00+00:00",
    )
    both = finding(
        "entity.stale", "c", object_id="sensor.r", first_detected_at="2026-10-01T12:00:00+00:00"
    )
    fact = finding(
        "automation.missing_entity", "d", object_id="a", first_seen_at="2026-01-01T00:00:00+00:00"
    )
    idle = finding(
        "automation.disabled_long", "e", object_id="a", first_seen_at="2026-01-01T00:00:00+00:00"
    )
    apply_certainty(
        [repeating, lasting, both, fact, idle], [], now=now, waits=waits, patterns={"sensor.r": 3}
    )
    assert repeating["confidence"] == 0.55 and repeating["confidence_notes"][0]["hour"] == 3
    assert lasting["confidence"] == 0.85 and lasting["confidence_notes"] == [
        {"code": "duration", "delta": 0.1, "days": 12}
    ]
    assert both["confidence"] == 0.5, "pattern −20 %, long lasting +10 % on a guess"
    assert fact["confidence"] == 0.98, "a fact does not get more certain with time"
    assert idle["confidence"] == 0.7, "294 days is more than three times 60"
    apply_certainty([repeating], [], now=now, waits=waits, patterns=None)
    assert repeating["confidence"] == 0.75, "without a pattern there is no adjustment B"
