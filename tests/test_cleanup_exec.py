"""Executing cleanup plans (step A: quarantine by disabling) against a real registry."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest

pytest.importorskip("homeassistant")
pytest.importorskip("pytest_homeassistant_custom_component")

from homeassistant.core import HomeAssistant  # noqa: E402
from homeassistant.helpers import entity_registry as er  # noqa: E402

from custom_components.ha_housekeeper.cleanup import build_plan, registry_fingerprint  # noqa: E402
from custom_components.ha_housekeeper.cleanup_exec import (  # noqa: E402
    CleanupError,
    entity_restorable,
)
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
    scanner: InventoryScanner,
    hass: HomeAssistant,
    *entity_ids: str,
    kind="disable_entity",
    recorder=None,
):
    snapshot = await scanner.async_scan()
    if recorder:
        snapshot["meta"]["recorder_available"] = True
    registry = er.async_get(hass)

    def fingerprint(object_id: str):
        entry = registry.async_get(object_id)
        return registry_fingerprint(entry) if entry else None

    plan = build_plan(
        snapshot,
        [
            {"kind": kind, "object_id": e, **({"recorder": recorder} if recorder else {})}
            for e in entity_ids
        ],
        datetime.now(UTC),
        fingerprint,
        lambda object_id: entity_restorable(hass, registry.async_get(object_id)),
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


# ---- step B: removal after quarantine, with a verified backup ------------------------------


def fake_backup(agent_ids=("backup.local",), error=None):
    from types import SimpleNamespace
    from unittest.mock import AsyncMock

    create = (
        AsyncMock(side_effect=error)
        if error
        else AsyncMock(return_value=SimpleNamespace(backup_job_id="job-1"))
    )
    manager = SimpleNamespace(
        config=SimpleNamespace(
            data=SimpleNamespace(create_backup=SimpleNamespace(agent_ids=list(agent_ids)))
        ),
        async_create_automatic_backup=create,
    )
    return manager, create


async def quarantined_entity(
    hass: HomeAssistant, scanner: InventoryScanner, name: str, days: int = 20
):
    """An entity that Housekeeper disabled ``days`` days ago."""
    entry = orphan(hass, name)
    er.async_get(hass).async_update_entity(entry.entity_id, name="Kitchen Old", icon="mdi:lamp")
    plan = await make_plan(scanner, hass, entry.entity_id)
    await run(scanner, plan)
    result = plan["actions"][0]["result"]
    result["at"] = (datetime.now(UTC) - timedelta(days=days)).isoformat()
    await scanner.async_scan()
    return entry, plan


async def run_removal(scanner, hass, entity_id, manager, acknowledged=()):
    from unittest.mock import patch

    with patch("homeassistant.components.backup.async_get_manager", return_value=manager):
        plan = await make_plan(scanner, hass, entity_id, kind="remove_entity")
        await run(scanner, plan, acknowledged)
    return plan


async def test_removal_waits_for_a_backup_removes_and_can_be_restored(hass: HomeAssistant) -> None:
    scanner = await make_scanner(hass)
    entry, _ = await quarantined_entity(hass, scanner, "retired")
    manager, create = fake_backup()

    plan = await run_removal(scanner, hass, entry.entity_id, manager)

    registry = er.async_get(hass)
    create.assert_awaited_once()
    assert registry.async_get(entry.entity_id) is None
    assert plan["status"] == "verified" and plan["backup"]["job_id"] == "job-1"
    types = [e["type"] for e in plan["events"]]
    assert types.index("backup_started") < types.index("backup_done") < types.index("removed")
    assert {"check": "removed", "object_id": entry.entity_id, "ok": True} in plan["verification"][
        "checks"
    ]
    assert scanner.snapshot["quarantine"] == []  # gone from the registry, so no longer quarantined

    result = await scanner.cleanup.undo(plan["plan_id"], None)
    assert result["results"] == [{"object_id": entry.entity_id, "outcome": "undone"}]
    restored = registry.async_get(entry.entity_id)
    assert restored is not None and restored.name == "Kitchen Old" and restored.icon == "mdi:lamp"
    assert restored.disabled_by is er.RegistryEntryDisabler.USER  # back in quarantine, not active
    assert plan["status"] == "undone"
    assert [q["object_id"] for q in scanner.snapshot["quarantine"]] == [entry.entity_id]


async def test_a_removal_can_delete_the_recorder_data_and_says_it_cannot_be_undone(
    hass: HomeAssistant,
) -> None:
    from unittest.mock import AsyncMock, patch

    scanner = await make_scanner(hass)
    entry, _ = await quarantined_entity(hass, scanner, "retired")
    manager, _ = fake_backup()
    delete = AsyncMock(return_value=([entry.entity_id], [], None))

    with (
        patch("homeassistant.components.backup.async_get_manager", return_value=manager),
        patch("custom_components.ha_housekeeper.cleanup_exec.delete_statistics", delete),
    ):
        plan = await make_plan(
            scanner, hass, entry.entity_id, kind="remove_entity", recorder="states"
        )
        action = plan["actions"][0]
        assert action["verdict"] == "review" and {"irreversible", "with_states"} <= set(
            action["reasons"]
        )
        await run(scanner, plan, [entry.entity_id])

    delete.assert_awaited_once()
    assert delete.await_args.args[1] == [entry.entity_id] and delete.await_args.kwargs == {
        "states": True
    }
    assert er.async_get(hass).async_get(entry.entity_id) is None
    result = plan["actions"][0]["result"]
    assert result["purge"] == {"state": "done", "states": True} and result["irreversible"] is True
    assert "statistics_purged" in [e["type"] for e in plan["events"]]


async def test_removal_needs_a_finished_quarantine(hass: HomeAssistant) -> None:
    scanner = await make_scanner(hass)
    young, _ = await quarantined_entity(hass, scanner, "young", days=3)
    never = orphan(hass, "never_quarantined")
    snapshot = await scanner.async_scan()

    plan = build_plan(
        snapshot,
        [
            {"kind": "remove_entity", "object_id": young.entity_id},
            {"kind": "remove_entity", "object_id": never.entity_id},
        ],
        datetime.now(UTC),
    )
    young_action, never_action = plan["actions"]
    assert (
        young_action["verdict"] == "blocked" and "quarantine_too_short" in young_action["reasons"]
    )
    assert young_action["quarantine_days_left"] == 11
    assert never_action["verdict"] == "blocked" and "not_quarantined" in never_action["reasons"]


@pytest.mark.parametrize(
    ("manager_kwargs", "reason"),
    [
        ({"error": RuntimeError("disk full")}, "backup_failed"),
        ({"agent_ids": ()}, "no_backup_agent"),
    ],
)
async def test_no_backup_means_no_removal(hass: HomeAssistant, manager_kwargs, reason) -> None:
    scanner = await make_scanner(hass)
    entry, _ = await quarantined_entity(hass, scanner, "protected")
    manager, _ = fake_backup(**manager_kwargs)

    plan = await run_removal(scanner, hass, entry.entity_id, manager)

    assert er.async_get(hass).async_get(entry.entity_id) is not None
    assert plan["status"] == "aborted" and plan["executed"] is False
    assert plan["actions"][0]["result"]["reason"] == reason


async def test_a_missing_backup_component_blocks_removal(hass: HomeAssistant) -> None:
    from unittest.mock import patch

    from homeassistant.exceptions import HomeAssistantError

    scanner = await make_scanner(hass)
    entry, _ = await quarantined_entity(hass, scanner, "nobackup")
    plan = await make_plan(scanner, hass, entry.entity_id, kind="remove_entity")
    with patch(
        "homeassistant.components.backup.async_get_manager", side_effect=HomeAssistantError("x")
    ):
        await run(scanner, plan)
    assert plan["actions"][0]["result"]["reason"] == "backup_unavailable"
    assert er.async_get(hass).async_get(entry.entity_id) is not None


async def test_reenabling_after_the_preview_stops_the_removal(hass: HomeAssistant) -> None:
    from unittest.mock import patch

    scanner = await make_scanner(hass)
    entry, _ = await quarantined_entity(hass, scanner, "changed_mind")
    manager, _ = fake_backup()
    with patch("homeassistant.components.backup.async_get_manager", return_value=manager):
        plan = await make_plan(scanner, hass, entry.entity_id, kind="remove_entity")
        er.async_get(hass).async_update_entity(entry.entity_id, disabled_by=None)
        await run(scanner, plan)
    assert plan["status"] == "aborted"
    assert plan["actions"][0]["result"]["reason"] == "entity_changed"
    assert er.async_get(hass).async_get(entry.entity_id) is not None


async def test_restore_reports_conflicts_instead_of_overwriting(hass: HomeAssistant) -> None:
    scanner = await make_scanner(hass)
    entry, _ = await quarantined_entity(hass, scanner, "contested")
    manager, _ = fake_backup()
    plan = await run_removal(scanner, hass, entry.entity_id, manager)
    registry = er.async_get(hass)

    taken = registry.async_get_or_create(
        "sensor", "other", "other-unique", suggested_object_id="contested"
    )
    assert taken.entity_id == entry.entity_id  # somebody reused the freed ID
    result = await scanner.cleanup.undo(plan["plan_id"], None)
    assert result["results"][0]["outcome"] == "conflict_taken"
    assert registry.async_get(entry.entity_id).platform == "other"  # untouched

    registry.async_remove(entry.entity_id)
    plan["actions"][0]["result"]["restore"]["config_entry_id"] = "vanished"
    result = await scanner.cleanup.undo(plan["plan_id"], None)
    assert result["results"][0]["outcome"] == "conflict_unrestorable"
    assert registry.async_get(entry.entity_id) is None


async def test_removal_over_the_websocket_reports_backup_progress(
    hass: HomeAssistant, hass_ws_client
) -> None:
    from unittest.mock import patch

    from homeassistant.setup import async_setup_component

    from custom_components.ha_housekeeper import async_setup

    assert await async_setup(hass, {})
    scanner = await make_scanner(hass)
    assert await async_setup_component(hass, "websocket_api", {})
    client = await hass_ws_client(hass)
    entry, _ = await quarantined_entity(hass, scanner, "ws_removal")
    manager, _ = fake_backup()

    await client.send_json_auto_id(
        {
            "type": "ha_housekeeper/plan_create",
            "actions": [{"kind": "remove_entity", "object_id": entry.entity_id}],
        }
    )
    plan = (await client.receive_json())["result"]
    assert plan["actions"][0]["verdict"] == "ok" and plan["actions"][0]["restorable"] is True
    await client.send_json_auto_id(
        {"type": "ha_housekeeper/plan_confirm", "plan_id": plan["plan_id"]}
    )
    confirmation = (await client.receive_json())["result"]
    assert confirmation["removals"] == [entry.entity_id]
    with patch("homeassistant.components.backup.async_get_manager", return_value=manager):
        await client.send_json_auto_id(
            {
                "type": "ha_housekeeper/plan_execute",
                "plan_id": plan["plan_id"],
                "token": confirmation["token"],
            }
        )
        assert (await client.receive_json())["result"] == {"started": True}
        await scanner.cleanup._task
    assert er.async_get(hass).async_get(entry.entity_id) is None
