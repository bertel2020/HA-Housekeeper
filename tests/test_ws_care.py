"""The care commands over the WebSocket: each one answers, the reading ones with a result."""

from __future__ import annotations

import pytest

pytest.importorskip("homeassistant")
pytest.importorskip("pytest_homeassistant_custom_component")
pytestmark = pytest.mark.asyncio

from homeassistant.core import HomeAssistant  # noqa: E402
from test_homeassistant_runtime import _ws_setup  # noqa: E402

D = "ha_housekeeper/"

READS = [
    {"type": D + "preflight"},
    {"type": D + "check_config"},
    {"type": D + "policies"},
    {"type": D + "exposure"},
    {"type": D + "check_log", "days": 30},
    {"type": D + "backup_health"},
    {"type": D + "battery_trend", "refresh": True},
    {"type": D + "goals"},
    {"type": D + "exceptions"},
    {"type": D + "auto_pause"},
]

WRITES = [
    {"type": D + "set_policy_limit", "limit": 50},
    {"type": D + "check_log_mark", "change": "x|a|b", "reason": "test"},
    {"type": D + "battery_type_set", "entity_id": "sensor.none", "battery_type": "AA"},
    {"type": D + "battery_class_set", "entity_id": "sensor.none", "volt_class": "lithium"},
    {"type": D + "battery_custom_type", "action": "add", "name": "CR9"},
    {"type": D + "battery_custom_type", "action": "rename", "name": "CR9", "new_name": "CR8"},
    {"type": D + "battery_custom_type", "action": "delete", "name": "CR8"},
    {"type": D + "battery_kind_set", "items": [{"entity_id": "sensor.none", "kind": "x"}]},
    {
        "type": D + "battery_replaced",
        "entity_id": "sensor.none",
        "day": "2026-10-01",
        "action": "dismiss",
    },
    {"type": D + "note_set", "action": "save", "title": "t", "target": "", "note": "n"},
    {"type": D + "note_set", "action": "delete", "note_id": "nope"},
    {"type": D + "reminder_set", "action": "save", "name": "r", "interval_days": 7},
    {"type": D + "reminder_set", "action": "done", "reminder_id": "nope", "day": "2026-10-01"},
    {"type": D + "reminder_set", "action": "delete", "reminder_id": "nope"},
    {"type": D + "protection_set", "mode": "full"},
    {"type": D + "lifecycle", "device_id": "nope"},
    {"type": D + "mark_set", "object_type": "device", "object_id": "nope", "kind": "keep"},
    {"type": D + "mark_clear", "object_type": "device", "object_id": "nope"},
    {"type": D + "set_stale_limit", "entity_id": "sensor.none", "hours": 5},
    {"type": D + "goal_set", "goal": "backup_age"},
    {"type": D + "exceptions_preview", "rules": [{"kind": "entity", "targets": ["sensor.none"]}]},
    {"type": D + "vacation_set", "entity": "", "grace_hours": 2},
    {"type": D + "exceptions_set", "rules": []},
    {"type": D + "notify_set", "enabled": False},
    {"type": D + "backup_attest", "kind": "restore_test", "clear": True},
    {"type": D + "auto_pause_set", "action": "never", "entry_id": "nope"},
    {"type": D + "auto_pause_set", "action": "resume", "entry_id": "nope"},
]


# A command that is gone, a message the schema rejects ("... @ data['x']") and a handler that crashed
# all answer too: only a result or the command's own error counts as an answer.
def answered(reply: dict) -> bool:
    if reply["success"]:
        return True
    error = reply["error"]
    return (
        error["code"] not in ("unknown_command", "unknown_error")
        and "@ data[" not in error["message"]
    )


async def test_the_care_commands_answer(hass: HomeAssistant, hass_ws_client) -> None:
    scanner, client = await _ws_setup(hass, hass_ws_client)
    await scanner.async_scan()

    async def send(message: dict) -> dict:
        await client.send_json_auto_id(message)
        return await client.receive_json()

    for message in READS:
        assert (await send(message))["success"], message["type"]
    rejected = []
    for message in WRITES:
        reply = await send(message)
        if not answered(reply):
            rejected.append(
                (message["type"], reply["error"]["code"], reply["error"]["message"][:100])
            )
    assert not rejected, rejected


async def test_the_exception_choices_name_integrations_without_entities(
    hass: HomeAssistant, hass_ws_client
) -> None:
    """An integration of a config entry is offered for a rule by name, even if no entity names it."""
    scanner, client = await _ws_setup(hass, hass_ws_client)
    await scanner.async_scan()
    await client.send_json_auto_id({"type": D + "exceptions"})
    reply = await client.receive_json()
    own = [i for i in reply["result"]["integrations"] if i["id"] == "ha_housekeeper"]
    assert own and own[0]["name"].endswith("(ha_housekeeper)"), reply["result"]["integrations"]


async def test_the_preview_of_a_rule_counts_a_config_entry_that_is_not_loaded(
    hass: HomeAssistant,
) -> None:
    """A rule for an integration also holds the finding of a config entry that did not load; the reach is counted too."""
    from datetime import UTC, datetime

    from pytest_homeassistant_custom_component.common import MockConfigEntry

    from custom_components.ha_housekeeper.exceptions import clean_rule, preview

    entry = MockConfigEntry(domain="browser_mod", title="Browser Mod")
    entry.add_to_hass(hass)
    rule = clean_rule({"kind": "integration", "targets": ["browser_mod"]})
    assert rule is not None
    snapshot = {
        "objects": [],
        "findings": [
            {
                "object_id": entry.entry_id,
                "rule_id": "config_entry.not_loaded",
                "first_detected_at": datetime.now(UTC).isoformat(),
            }
        ],
    }
    result = preview(hass, rule, snapshot, datetime.now(UTC))
    assert result["hide"] == 1 and result["objects"] == 1
    assert result["of"] == 0  # no device or entity in this snapshot
