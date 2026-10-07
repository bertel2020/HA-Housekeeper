"""Device cleanup: quarantine, regular removal, Force Forget, restore and recurring devices."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from unittest.mock import patch

import pytest

pytest.importorskip("homeassistant")
pytest.importorskip("pytest_homeassistant_custom_component")

from homeassistant.core import HomeAssistant  # noqa: E402
from homeassistant.helpers import device_registry as dr  # noqa: E402
from homeassistant.helpers import entity_registry as er  # noqa: E402
from pytest_homeassistant_custom_component.common import (  # noqa: E402
    MockConfigEntry,
    MockModule,
    mock_integration,
)
from test_cleanup_exec import fake_backup, make_scanner, run  # noqa: E402

from custom_components.ha_housekeeper.cleanup import (  # noqa: E402
    build_plan,
    device_fingerprint,
    device_support,
    judge_device_action,
    registry_fingerprint,
)
from custom_components.ha_housekeeper.cleanup_exec import (  # noqa: E402
    CleanupError,
    entity_restorable,
)

NOW = datetime(2026, 10, 7, tzinfo=UTC)


async def make_device(
    hass: HomeAssistant,
    name: str,
    *,
    entities: int = 1,
    supports_removal: bool | None = None,
    allow: bool = True,
    via: str | None = None,
    domain: str = "fakeint",
):
    """A device of a fake integration with orphaned entities, none of them working."""

    async def remove_allowed(hass, config_entry, device_entry) -> bool:
        return allow

    if supports_removal:
        mock_integration(hass, MockModule(domain, async_remove_config_entry_device=remove_allowed))
    else:
        mock_integration(hass, MockModule(domain))
    config_entry = MockConfigEntry(domain=domain, title=name)
    config_entry.add_to_hass(hass)
    config_entry.supports_remove_device = bool(supports_removal)
    registry = dr.async_get(hass)
    device = registry.async_get_or_create(
        config_entry_id=config_entry.entry_id,
        identifiers={(domain, name)},
        name=name,
        manufacturer="Acme",
        model="X1",
        **({"via_device": (domain, via)} if via else {}),
    )
    entity_registry = er.async_get(hass)
    members = [
        entity_registry.async_get_or_create(
            "sensor",
            domain,
            f"{name}-{index}",
            suggested_object_id=f"{name}_{index}",
            config_entry=config_entry,
            device_id=device.id,
        )
        for index in range(entities)
    ]
    return config_entry, device, members


async def make_device_plan(scanner, hass: HomeAssistant, kind: str, *device_ids: str):
    snapshot = await scanner.async_scan()
    devices = dr.async_get(hass)

    def device_info(device_id: str):
        entry = devices.async_get(device_id)
        return (device_fingerprint(entry), device_support(hass, entry)) if entry else (None, {})

    registry = er.async_get(hass)
    plan = build_plan(
        snapshot,
        [{"kind": kind, "object_id": d} for d in device_ids],
        datetime.now(UTC),
        lambda object_id: registry_fingerprint(registry.async_get(object_id)),
        lambda object_id: entity_restorable(hass, registry.async_get(object_id)),
        device_info=device_info,
    )
    scanner.journal.add(plan)
    return plan


async def quarantined_device(hass, scanner, name: str, days: int = 20, **kwargs):
    config_entry, device, members = await make_device(hass, name, **kwargs)
    plan = await make_device_plan(scanner, hass, "disable_device", device.id)
    assert plan["actions"][0]["verdict"] == "ok", plan["actions"][0]["reasons"]
    await run(scanner, plan)
    plan["actions"][0]["result"]["at"] = (datetime.now(UTC) - timedelta(days=days)).isoformat()
    await scanner.async_scan()
    return config_entry, device, members, plan


# ---- judging ------------------------------------------------------------------------------


def item(object_id, status="orphaned", **extra):
    return {"object_type": "entity", "object_id": object_id, "status": status, **extra}


def device_item(device_id, status="active", **extra):
    return {
        "object_type": "device",
        "object_id": device_id,
        "name": device_id,
        "status": status,
        **extra,
    }


def test_working_entities_children_and_use_block_a_device() -> None:
    objects = {
        "sensor.a": item("sensor.a", device_id="d1"),
        "sensor.w": item("sensor.w", "active", device_id="d2"),
    }
    devices = {
        "d1": device_item("d1"),
        "d2": device_item("d2"),
        "d3": device_item("d3", via_device_id="d1"),
    }
    ok = judge_device_action("disable_device", "d2", objects, devices, [])
    assert ok["verdict"] == "blocked" and "device_has_working_entities" in ok["reasons"]
    hub = judge_device_action("disable_device", "d1", objects, devices, [])
    assert hub["verdict"] == "blocked" and "has_children" in hub["reasons"]
    used = judge_device_action(
        "disable_device",
        "d1",
        objects,
        {"d1": device_item("d1")},
        [{"source": "automation:automation.x", "target": "device:d1", "relation": "TRIGGERS_ON"}],
    )
    assert used["verdict"] == "blocked" and "used_certain" in used["reasons"]
    clean = judge_device_action("disable_device", "d1", objects, {"d1": device_item("d1")}, [])
    assert clean["verdict"] == "ok" and clean["entities"] == ["sensor.a"]


def test_removal_needs_quarantine_and_forget_only_without_regular_removal() -> None:
    objects = {"sensor.a": item("sensor.a", device_id="d1")}
    devices = {"d1": device_item("d1")}
    old = {"d1": (NOW - timedelta(days=20)).isoformat()}
    young = {"d1": (NOW - timedelta(days=2)).isoformat()}
    supported = {"removal_supported": True, "restorable": True}
    unsupported = {"removal_supported": False, "restorable": True}

    none = judge_device_action("remove_device", "d1", objects, devices, [], {}, supported, NOW)
    assert "not_quarantined" in none["reasons"] and none["verdict"] == "blocked"
    short = judge_device_action("remove_device", "d1", objects, devices, [], young, supported, NOW)
    assert "quarantine_too_short" in short["reasons"] and short["quarantine_days_left"] == 12
    ready = judge_device_action("remove_device", "d1", objects, devices, [], old, supported, NOW)
    assert ready["verdict"] == "review" and "restore_limited" in ready["reasons"]
    refused = judge_device_action(
        "remove_device", "d1", objects, devices, [], old, unsupported, NOW
    )
    assert refused["verdict"] == "blocked" and "integration_no_support" in refused["reasons"]

    forced = judge_device_action("forget_device", "d1", objects, devices, [], old, unsupported, NOW)
    assert forced["verdict"] == "review" and "forced_forget" in forced["reasons"]
    regular = judge_device_action("forget_device", "d1", objects, devices, [], old, supported, NOW)
    assert regular["verdict"] == "blocked" and "regular_removal_available" in regular["reasons"]


# ---- running ------------------------------------------------------------------------------


async def test_device_quarantine_is_verified_and_can_be_undone(hass: HomeAssistant) -> None:
    scanner = await make_scanner(hass)
    _, device, _, plan = await quarantined_device(hass, scanner, "lamp", days=1)
    registry = dr.async_get(hass)
    assert registry.async_get(device.id).disabled_by is dr.DeviceEntryDisabler.USER
    assert plan["status"] == "verified"
    assert [(q["object_type"], q["object_id"]) for q in scanner.snapshot["quarantine"]] == [
        ("device", device.id)
    ]

    result = await scanner.cleanup.undo(plan["plan_id"], None)
    assert result["results"] == [{"object_id": device.id, "outcome": "undone"}]
    assert registry.async_get(device.id).disabled_by is None
    assert scanner.snapshot["quarantine"] == []


async def test_regular_removal_asks_the_integration_and_can_be_restored(
    hass: HomeAssistant,
) -> None:
    scanner = await make_scanner(hass)
    config_entry, device, members, _ = await quarantined_device(
        hass, scanner, "plug", supports_removal=True, entities=2
    )
    manager, create = fake_backup()
    with patch("homeassistant.components.backup.async_get_manager", return_value=manager):
        plan = await make_device_plan(scanner, hass, "remove_device", device.id)
        action = plan["actions"][0]
        assert action["verdict"] == "review" and action["executable"] is True
        with pytest.raises(CleanupError, match="nothing_to_do"):
            scanner.cleanup.confirm(plan["plan_id"], [], None)  # always needs a person's ack
        await run(scanner, plan, [device.id])

    create.assert_awaited_once()
    assert plan["status"] == "verified", plan["verification"]
    assert dr.async_get(hass).async_get(device.id) is None
    registry = er.async_get(hass)
    assert all(registry.async_get(e.entity_id) is None for e in members)  # they went with it
    assert [e["type"] for e in plan["events"] if e["type"] == "device_removed"]

    result = await scanner.cleanup.undo(plan["plan_id"], None)
    assert result["results"] == [{"object_id": device.id, "outcome": "undone"}]
    restored = dr.async_get(hass).async_get(device.id)
    assert restored is not None and restored.name == "plug"
    assert restored.disabled_by is dr.DeviceEntryDisabler.USER  # back in quarantine
    assert all(registry.async_get(e.entity_id) is not None for e in members)


async def test_the_integration_can_refuse_the_removal(hass: HomeAssistant) -> None:
    scanner = await make_scanner(hass)
    _, device, members, _ = await quarantined_device(
        hass, scanner, "stubborn", supports_removal=True, allow=False
    )
    manager, _ = fake_backup()
    with patch("homeassistant.components.backup.async_get_manager", return_value=manager):
        plan = await make_device_plan(scanner, hass, "remove_device", device.id)
        await run(scanner, plan, [device.id])
    assert plan["status"] == "aborted"
    assert plan["actions"][0]["result"]["reason"] == "rejected_by_integration"
    assert dr.async_get(hass).async_get(device.id) is not None
    assert er.async_get(hass).async_get(members[0].entity_id) is not None


async def test_force_forget_reloads_the_integration_and_reports_a_comeback(
    hass: HomeAssistant,
) -> None:
    scanner = await make_scanner(hass)
    config_entry, device, _, _ = await quarantined_device(hass, scanner, "ghost")
    manager, _ = fake_backup()
    with (
        patch("homeassistant.components.backup.async_get_manager", return_value=manager),
        patch.object(hass.config_entries, "async_reload") as reload,
    ):
        plan = await make_device_plan(scanner, hass, "forget_device", device.id)
        assert plan["actions"][0]["verdict"] == "review"
        await run(scanner, plan, [device.id])
    reload.assert_awaited_once_with(config_entry.entry_id)
    assert plan["status"] == "verified", plan["verification"]
    assert dr.async_get(hass).async_get(device.id) is None
    assert plan["actions"][0]["result"]["reloaded"] == [config_entry.entry_id]
    assert scanner.snapshot["recurring_devices"] == []

    # the integration creates the device again: Housekeeper says so
    dr.async_get(hass).async_get_or_create(
        config_entry_id=config_entry.entry_id, identifiers={("fakeint", "ghost")}, name="ghost"
    )
    snapshot = await scanner.async_scan()
    assert [r["domains"] for r in snapshot["recurring_devices"]] == [["fakeint"]]
    assert snapshot["meta"]["recurring_devices"] == 1


async def test_hubs_and_unquarantined_devices_cannot_be_removed(hass: HomeAssistant) -> None:
    scanner = await make_scanner(hass)
    _, hub, _ = await make_device(hass, "hub", entities=0)
    await make_device(hass, "child", via="hub")
    snapshot_plan = await make_device_plan(scanner, hass, "disable_device", hub.id)
    assert "has_children" in snapshot_plan["actions"][0]["reasons"]
    fresh = await make_device(hass, "fresh", supports_removal=True)
    plan = await make_device_plan(scanner, hass, "remove_device", fresh[1].id)
    assert "not_quarantined" in plan["actions"][0]["reasons"]
    with pytest.raises(CleanupError, match="nothing_to_do"):
        scanner.cleanup.confirm(plan["plan_id"], [fresh[1].id], None)


async def test_a_device_changed_after_the_preview_is_not_touched(hass: HomeAssistant) -> None:
    scanner = await make_scanner(hass)
    _, device, _ = await make_device(hass, "moved")
    plan = await make_device_plan(scanner, hass, "disable_device", device.id)
    dr.async_get(hass).async_update_device(device.id, name_by_user="Renamed by the user")
    await run(scanner, plan)
    assert plan["actions"][0]["result"]["reason"] == "device_changed"
    assert dr.async_get(hass).async_get(device.id).disabled_by is None


async def test_a_device_of_two_integrations_that_is_refused_midway_stays_restorable(
    hass: HomeAssistant,
) -> None:
    scanner = await make_scanner(hass)
    first, device, members, _ = await quarantined_device(
        hass, scanner, "bridge", supports_removal=True
    )

    # the same device also belongs to a second integration that refuses
    async def refuse(hass, config_entry, device_entry) -> bool:
        return False

    mock_integration(hass, MockModule("second", async_remove_config_entry_device=refuse))
    second = MockConfigEntry(domain="second")
    second.add_to_hass(hass)
    second.supports_remove_device = True
    registry = dr.async_get(hass)
    registry.async_update_device(device.id, add_config_entry_id=second.entry_id)
    await scanner.async_scan()
    manager, _ = fake_backup()
    with patch("homeassistant.components.backup.async_get_manager", return_value=manager):
        plan = await make_device_plan(scanner, hass, "remove_device", device.id)
        await run(scanner, plan, [device.id])
    result = plan["actions"][0]["result"]
    assert result["state"] == "done" and result["stopped"] == "rejected_by_integration"
    assert plan["status"] == "partial"
    remaining = registry.async_get(device.id)
    assert remaining is None or first.entry_id not in remaining.config_entries
    outcome = await scanner.cleanup.undo(plan["plan_id"], None)
    assert outcome["results"][0]["outcome"] == "undone"
    assert first.entry_id in registry.async_get(device.id).config_entries
