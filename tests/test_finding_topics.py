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
