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
    {"type": D + "mark_set", "object_type": "device", "object_id": "nope", "kind": "ignore"},
    {"type": D + "mark_clear", "object_type": "device", "object_id": "nope"},
    {"type": D + "set_stale_limit", "entity_id": "sensor.none", "hours": 5},
    {"type": D + "goal_set", "goal": "unknown_goal"},
    {"type": D + "exceptions_preview", "rules": [{"entity": "sensor.none"}]},
    {"type": D + "vacation_set", "entity": "", "grace_hours": 2},
    {"type": D + "exceptions_set", "rules": []},
    {"type": D + "notify_set", "enabled": False},
    {"type": D + "backup_attest", "kind": "restore", "clear": True},
    {"type": D + "auto_pause_set", "action": "never", "entry_id": "nope"},
    {"type": D + "auto_pause_set", "action": "resume", "entry_id": "nope"},
]


async def test_the_care_commands_answer(hass: HomeAssistant, hass_ws_client) -> None:
    scanner, client = await _ws_setup(hass, hass_ws_client)
    await scanner.async_scan()

    async def send(message: dict) -> dict:
        await client.send_json_auto_id(message)
        return await client.receive_json()

    for message in READS:
        assert (await send(message))["success"], message["type"]
    for message in WRITES:
        reply = await send(message)
        assert "success" in reply, message
