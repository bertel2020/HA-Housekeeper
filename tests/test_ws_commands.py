"""The remaining WebSocket commands: each one answers, the reading ones with a result."""

from __future__ import annotations

import pytest

pytest.importorskip("homeassistant")
pytest.importorskip("pytest_homeassistant_custom_component")
pytestmark = pytest.mark.asyncio

from homeassistant.core import HomeAssistant  # noqa: E402
from test_homeassistant_runtime import _ws_setup  # noqa: E402

D = "ha_housekeeper/"
AUTOMATION = "automation.none"

READS = [
    {"type": D + "inventory"},
    {"type": D + "status"},
    {"type": D + "history_series"},
    {"type": D + "compare"},
    {"type": D + "cleanup_round"},
    {"type": D + "first_cleanup"},
    {"type": D + "activity", "query": "a", "limit": 10},
    {"type": D + "often"},
    {"type": D + "plan_list"},
    {"type": D + "events"},
    {"type": D + "monitor_list"},
    {"type": D + "system_usage", "quick": True},
    {"type": D + "system_light"},
    {"type": D + "starts"},
    {"type": D + "access"},
    {"type": D + "sensitive_fields"},
    {"type": D + "open_flows"},
    {"type": D + "recorder_costs"},
    {"type": D + "reliability"},
    {"type": D + "reliability", "window_days": 7, "compare": True, "cached_only": True},
    {"type": D + "db_health"},
    {"type": D + "statistics_last"},
    {"type": D + "statistic_detail", "statistic_id": "sensor.none"},
    {"type": D + "database_first"},
    {"type": D + "entity_space"},
    {"type": D + "storms"},
    {"type": D + "automation_runs"},
    {"type": D + "automation_quality"},
    {"type": D + "blueprints"},
    {"type": D + "watches"},
    {"type": D + "correlations"},
    {"type": D + "mcp_audit"},
]

WRITES = [
    {"type": D + "scan_point", "action": "save", "name": "p"},
    {"type": D + "scan_point", "action": "delete", "baseline": "nope"},
    {"type": D + "detail", "object_type": "device", "object_id": "nope"},
    {"type": D + "fix_ways", "finding_key": "nope"},
    {"type": D + "failure_info", "finding_key": "nope"},
    {"type": D + "fix_check", "finding_key": "nope"},
    {"type": D + "work_set", "finding_key": "nope", "active": True},
    {"type": D + "visit_leave"},
    {"type": D + "first_cleanup_set", "action": "begin"},
    {"type": D + "first_cleanup_set", "action": "dismiss"},
    {"type": D + "first_cleanup_set", "action": "reset"},
    {"type": D + "first_cleanup_later", "days": 3},
    {"type": D + "activity_undo", "entry_id": "nope"},
    {"type": D + "often_skip", "skip": True, "keys": ["nope"]},
    {"type": D + "decision_notice_dismiss"},
    {"type": D + "ignore", "finding_key": "nope", "ignored": True},
    {"type": D + "set_options"},
    {"type": D + "plan_create", "actions": [{"kind": "remove_entity", "object_id": "sensor.none"}]},
    {"type": D + "plan_merge", "plan_ids": ["a", "b"]},
    {"type": D + "plan_renew", "plan_id": "nope"},
    {"type": D + "plan_check", "plan_id": "nope"},
    {"type": D + "plan_detail", "plan_id": "nope"},
    {"type": D + "plan_report", "plan_id": "nope"},
    {"type": D + "device_pairs", "old_device_id": "a", "new_device_id": "b"},
    {"type": D + "plan_delete", "plan_id": "nope"},
    {"type": D + "plan_confirm", "plan_id": "nope"},
    {"type": D + "plan_execute", "plan_id": "nope", "token": "nope"},
    {"type": D + "plan_cancel"},
    {"type": D + "plan_status", "plan_id": "nope"},
    {"type": D + "plan_undo", "plan_id": "nope"},
    {"type": D + "monitor_history", "function_id": "nope"},
    {"type": D + "monitor_delete", "function_id": "nope"},
    {"type": D + "monitor_preview", "members": []},
    {"type": D + "access_known", "entry_id": "nope", "known": True},
    {"type": D + "secret_known", "entry_id": "nope", "known": True},
    {"type": D + "entity_recorder", "entity_id": "sensor.none"},
    {"type": D + "entity_attributes", "entity_id": "sensor.none"},
    {"type": D + "range_series", "statistic_id": "sensor.none", "from": 0, "to": 1},
    {"type": D + "counter_scan", "statistic_id": "sensor.none"},
    {"type": D + "criteria", "entity_id": AUTOMATION},
    {"type": D + "criteria_set", "entity_id": AUTOMATION, "criteria": []},
    {"type": D + "coverage", "entity_id": AUTOMATION},
    {"type": D + "coverage_set", "enabled": False, "clear": True},
    {"type": D + "trace_compare", "entity_id": AUTOMATION},
    {"type": D + "refactor_proposals", "entity_id": AUTOMATION},
    {"type": D + "refactor_set", "enabled": False},
    {"type": D + "automation_dry_run", "entity_id": AUTOMATION},
    {"type": D + "blueprint_detail", "domain": "automation", "path": "nope.yaml"},
    {"type": D + "watch_end"},
    {"type": D + "mcp_set", "enabled": False},
    {"type": D + "mcp_undo", "at": "nope"},
    {"type": D + "mcp_undo_all"},
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


async def test_the_commands_answer(hass: HomeAssistant, hass_ws_client) -> None:
    scanner, client = await _ws_setup(hass, hass_ws_client)
    await scanner.async_scan()

    async def send(message: dict) -> dict:
        await client.send_json_auto_id(message)
        return await client.receive_json()

    for message in READS:
        assert (await send(message))["success"], message
    rejected = []
    for message in WRITES:
        reply = await send(message)
        if not answered(reply):
            rejected.append(
                (message["type"], reply["error"]["code"], reply["error"]["message"][:100])
            )
    assert not rejected, rejected


async def test_a_range_takes_no_nan_or_inf() -> None:
    import voluptuous as vol

    from custom_components.ha_housekeeper.ws_common import finite_float

    assert finite_float("1.5") == 1.5 and finite_float(3) == 3.0
    for bad in ("nan", "inf", "-inf", float("nan"), "x", None):
        with pytest.raises(vol.Invalid):
            finite_float(bad)


async def test_no_command_of_the_list_answers_a_non_administrator(
    hass: HomeAssistant, hass_ws_client, hass_admin_user
) -> None:
    """The decorator is counted elsewhere; here every command of both lists is really refused."""
    from test_ws_care import READS as CARE_READS
    from test_ws_care import WRITES as CARE_WRITES

    scanner, _ = await _ws_setup(hass, hass_ws_client)
    await scanner.async_scan()
    hass_admin_user.groups = []
    client = await hass_ws_client(hass)
    allowed = []
    for message in [*READS, *WRITES, *CARE_READS, *CARE_WRITES]:
        await client.send_json_auto_id(message)
        reply = await client.receive_json()
        if not (reply["success"] is False and reply["error"]["code"] == "unauthorized"):
            allowed.append(message["type"])
    assert not allowed, allowed
