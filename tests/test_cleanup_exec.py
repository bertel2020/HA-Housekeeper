"""Executing cleanup plans (step A: quarantine by disabling) against a real registry."""

from __future__ import annotations

from datetime import UTC, datetime

import pytest

pytest.importorskip("homeassistant")
pytest.importorskip("pytest_homeassistant_custom_component")

from homeassistant.core import HomeAssistant  # noqa: E402
from homeassistant.helpers import entity_registry as er  # noqa: E402

from custom_components.ha_housekeeper.cleanup import build_plan, registry_fingerprint  # noqa: E402
from custom_components.ha_housekeeper.cleanup_exec import CleanupError  # noqa: E402
from custom_components.ha_housekeeper.const import DOMAIN  # noqa: E402
from custom_components.ha_housekeeper.inventory import InventoryScanner  # noqa: E402


async def make_scanner(hass: HomeAssistant) -> InventoryScanner:
    hass.data.setdefault(DOMAIN, {})
    scanner = InventoryScanner(hass)
    await scanner.async_initialize()
    hass.data[DOMAIN]["scanner"] = scanner
    return scanner


def orphan(hass: HomeAssistant, name: str):
    return er.async_get(hass).async_get_or_create(
        domain="sensor", platform="test", unique_id=name, suggested_object_id=name
    )


async def make_plan(
    scanner: InventoryScanner, hass: HomeAssistant, *entity_ids: str, kind="disable_entity"
):
    snapshot = await scanner.async_scan()
    registry = er.async_get(hass)

    def fingerprint(object_id: str):
        entry = registry.async_get(object_id)
        return registry_fingerprint(entry) if entry else None

    plan = build_plan(
        snapshot,
        [{"kind": kind, "object_id": e} for e in entity_ids],
        datetime.now(UTC),
        fingerprint,
    )
    scanner.journal.add(plan)
    return plan


async def run(scanner: InventoryScanner, plan: dict, acknowledged=()):
    confirmation = scanner.cleanup.confirm(plan["plan_id"], list(acknowledged), "user-1")
    scanner.cleanup.start(plan["plan_id"], confirmation["token"], "user-1")
    await scanner.cleanup._task
    return confirmation


async def test_quarantine_runs_is_verified_and_can_be_undone(hass: HomeAssistant) -> None:
    entry = orphan(hass, "old_sensor")
    scanner = await make_scanner(hass)
    plan = await make_plan(scanner, hass, entry.entity_id)
    assert plan["actions"][0]["verdict"] == "ok" and plan["actions"][0]["executable"] is True

    await run(scanner, plan)

    registry = er.async_get(hass)
    assert registry.async_get(entry.entity_id).disabled_by is er.RegistryEntryDisabler.USER
    assert plan["status"] == "verified" and plan["executed"] is True
    assert plan["verification"]["ok"] is True
    assert [e["type"] for e in plan["events"]] == [
        "created",
        "confirmed",
        "started",
        "disabled",
        "verified",
    ]
    assert scanner.paused is False

    assert [q["object_id"] for q in scanner.snapshot["quarantine"]] == [entry.entity_id]
    assert (
        scanner.snapshot["meta"]["quarantined"] == 1
        and scanner.snapshot["meta"]["quarantine_days"] == 14
    )

    result = await scanner.cleanup.undo(plan["plan_id"], None)
    assert scanner.snapshot["quarantine"] == []  # the undo refreshed the inventory
    assert result["results"] == [{"object_id": entry.entity_id, "outcome": "undone"}]
    assert registry.async_get(entry.entity_id).disabled_by is None
    assert plan["status"] == "undone"


async def test_blocked_and_removal_plans_cannot_be_confirmed(hass: HomeAssistant) -> None:
    working = orphan(hass, "working")
    hass.states.async_set(working.entity_id, "on")
    gone = orphan(hass, "gone")
    scanner = await make_scanner(hass)
    blocked = await make_plan(scanner, hass, working.entity_id)
    assert blocked["actions"][0]["verdict"] == "blocked"
    with pytest.raises(CleanupError, match="nothing_to_do"):
        scanner.cleanup.confirm(blocked["plan_id"], [], None)
    preview = await make_plan(scanner, hass, gone.entity_id, kind="remove_entity")
    with pytest.raises(CleanupError, match="nothing_to_do"):  # removal is preview only
        scanner.cleanup.confirm(preview["plan_id"], [], None)
    assert er.async_get(hass).async_get(gone.entity_id) is not None


async def test_changes_after_the_preview_abort_the_run(hass: HomeAssistant) -> None:
    first, second = orphan(hass, "first"), orphan(hass, "second")
    scanner = await make_scanner(hass)
    plan = await make_plan(scanner, hass, first.entity_id, second.entity_id)
    er.async_get(hass).async_update_entity(second.entity_id, name="Renamed by the user")

    await run(scanner, plan)

    registry = er.async_get(hass)
    assert registry.async_get(first.entity_id).disabled_by is er.RegistryEntryDisabler.USER
    assert registry.async_get(second.entity_id).disabled_by is None  # untouched
    assert plan["status"] == "partial"
    assert plan["actions"][1]["result"] == {
        "state": "not_run",
        "at": plan["actions"][1]["result"]["at"],
        "reason": "entity_changed",
    }


async def test_nothing_runs_when_the_first_check_fails(hass: HomeAssistant) -> None:
    entry = orphan(hass, "moved")
    scanner = await make_scanner(hass)
    plan = await make_plan(scanner, hass, entry.entity_id)
    er.async_get(hass).async_update_entity(entry.entity_id, name="Changed")
    await run(scanner, plan)
    assert plan["status"] == "aborted" and plan["executed"] is False
    assert er.async_get(hass).async_get(entry.entity_id).disabled_by is None


async def test_review_actions_need_an_individual_acknowledgement(hass: HomeAssistant) -> None:
    from unittest.mock import AsyncMock, patch

    entry = orphan(hass, "with_stats")
    scanner = await make_scanner(hass)
    statistics = [{"statistic_id": entry.entity_id, "source": "recorder"}]
    with patch.object(InventoryScanner, "_statistics", AsyncMock(return_value=statistics)):
        plan = await make_plan(scanner, hass, entry.entity_id)
        assert plan["actions"][0]["verdict"] == "review"
        with pytest.raises(CleanupError, match="nothing_to_do"):
            scanner.cleanup.confirm(plan["plan_id"], [], None)
        await run(scanner, plan, acknowledged=[entry.entity_id])
    assert (
        er.async_get(hass).async_get(entry.entity_id).disabled_by is er.RegistryEntryDisabler.USER
    )


async def test_tokens_are_single_use_and_plans_run_once(hass: HomeAssistant) -> None:
    entry = orphan(hass, "once")
    scanner = await make_scanner(hass)
    plan = await make_plan(scanner, hass, entry.entity_id)
    with pytest.raises(CleanupError, match="bad_token"):
        scanner.cleanup.start(plan["plan_id"], "guess", None)
    confirmation = scanner.cleanup.confirm(plan["plan_id"], [], None)
    with pytest.raises(CleanupError, match="bad_token"):
        scanner.cleanup.start(plan["plan_id"], "wrong", None)
    # a wrong guess consumed the token; confirming again is required
    confirmation = scanner.cleanup.confirm(plan["plan_id"], [], None)
    scanner.cleanup.start(plan["plan_id"], confirmation["token"], None)
    with pytest.raises(CleanupError, match="busy"):
        scanner.cleanup.start(plan["plan_id"], confirmation["token"], None)
    await scanner.cleanup._task
    with pytest.raises(CleanupError):
        scanner.cleanup.confirm(plan["plan_id"], [], None)  # already executed
    assert scanner.journal.remove(plan["plan_id"]) is False  # the audit trail stays


async def test_undo_refuses_to_overwrite_newer_user_changes(hass: HomeAssistant) -> None:
    entry = orphan(hass, "edited")
    scanner = await make_scanner(hass)
    plan = await make_plan(scanner, hass, entry.entity_id)
    await run(scanner, plan)
    registry = er.async_get(hass)
    registry.async_update_entity(entry.entity_id, name="Edited later")

    result = await scanner.cleanup.undo(plan["plan_id"], None)

    assert result["results"] == [{"object_id": entry.entity_id, "outcome": "conflict_changed"}]
    assert registry.async_get(entry.entity_id).disabled_by is er.RegistryEntryDisabler.USER
    registry.async_remove(entry.entity_id)
    result = await scanner.cleanup.undo(plan["plan_id"], None)
    assert result["results"][0]["outcome"] == "conflict_gone"


async def test_old_plans_must_be_recreated(hass: HomeAssistant) -> None:
    entry = orphan(hass, "stale")
    scanner = await make_scanner(hass)
    plan = await make_plan(scanner, hass, entry.entity_id)
    plan["created_at"] = "2020-01-01T00:00:00+00:00"
    with pytest.raises(CleanupError, match="plan_too_old"):
        scanner.cleanup.confirm(plan["plan_id"], [], None)


async def test_websocket_flow_requires_confirmation_and_reports_status(
    hass: HomeAssistant, hass_ws_client
) -> None:
    from homeassistant.setup import async_setup_component

    from custom_components.ha_housekeeper import async_setup

    entry = orphan(hass, "via_ws")
    assert await async_setup(hass, {})
    scanner = await make_scanner(hass)
    assert await async_setup_component(hass, "websocket_api", {})
    client = await hass_ws_client(hass)
    await scanner.async_scan()

    await client.send_json_auto_id(
        {
            "type": "ha_housekeeper/plan_create",
            "actions": [{"kind": "disable_entity", "object_id": entry.entity_id}],
        }
    )
    plan = (await client.receive_json())["result"]
    await client.send_json_auto_id(
        {"type": "ha_housekeeper/plan_execute", "plan_id": plan["plan_id"], "token": "x"}
    )
    assert (await client.receive_json())["error"]["code"] == "bad_token"

    await client.send_json_auto_id(
        {"type": "ha_housekeeper/plan_confirm", "plan_id": plan["plan_id"]}
    )
    confirmation = (await client.receive_json())["result"]
    assert confirmation["execute"] == [entry.entity_id]
    await client.send_json_auto_id(
        {
            "type": "ha_housekeeper/plan_execute",
            "plan_id": plan["plan_id"],
            "token": confirmation["token"],
        }
    )
    assert (await client.receive_json())["result"] == {"started": True}
    await scanner.cleanup._task

    await client.send_json_auto_id(
        {"type": "ha_housekeeper/plan_status", "plan_id": plan["plan_id"]}
    )
    status = (await client.receive_json())["result"]
    assert status["plan"]["status"] == "verified" and status["progress"]["running"] is False
    await client.send_json_auto_id({"type": "ha_housekeeper/plan_undo", "plan_id": plan["plan_id"]})
    assert (await client.receive_json())["result"]["status"] == "undone"
