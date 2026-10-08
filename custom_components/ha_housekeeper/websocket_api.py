"""WebSocket API for the HA Housekeeper panel."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

from .cleanup import (
    ACTION_KINDS,
    MAX_ACTIONS,
    METER_KINDS,
    METER_MODES,
    REFERENCE_KINDS,
    build_plan,
    device_fingerprint,
    device_support,
    plan_summary,
    public_plan,
    registry_fingerprint,
)
from .cleanup_exec import CleanupError, entity_restorable
from .const import DOMAIN, OPTION_LIMITS
from .inventory import InventoryScanner
from .maintenance import preflight_report, recorder_costs
from .meter import prepare_meter
from .references import preview_replacement


def _scanner(hass: HomeAssistant) -> InventoryScanner | None:
    """Return the configured scanner, or None while the entry is not loaded."""
    return hass.data.get(DOMAIN, {}).get("scanner")


async def _send_inventory_result(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
    *,
    refresh: bool,
) -> None:
    """Send inventory data or a useful, admin-only scanner error."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    # A scan in the middle of a plan would record intermediate states in the history, the
    # observations and the repairs hints. The runner scans for its own verification directly.
    if (refresh or scanner.snapshot is None) and scanner.cleanup.running:
        connection.send_error(msg["id"], "cleanup_busy", "A cleanup plan is running")
        return
    try:
        result = await (scanner.async_scan() if refresh else scanner.async_get_snapshot())
    except Exception as err:
        connection.send_error(msg["id"], "scan_failed", f"{type(err).__name__}: {err}")
        return
    connection.send_result(msg["id"], result)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/inventory"})
@websocket_api.async_response
async def websocket_inventory(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the last inventory, scanning on first use."""
    await _send_inventory_result(hass, connection, msg, refresh=False)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/scan"})
@websocket_api.async_response
async def websocket_scan(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Run and return a fresh inventory scan."""
    await _send_inventory_result(hass, connection, msg, refresh=True)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/status"})
@callback
def websocket_status(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return scan progress without triggering work."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    connection.send_result(msg["id"], scanner.status)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/detail",
        vol.Required("object_type"): str,
        vol.Required("object_id"): str,
    }
)
@callback
def websocket_detail(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return attributes and automation structure of one inventory object."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    details = scanner.get_details(msg["object_type"], msg["object_id"])
    if details is None:
        connection.send_error(msg["id"], "not_found", "Object not found in the latest scan")
        return
    connection.send_result(msg["id"], details)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/compare", vol.Optional("baseline", default="previous"): str}
)
@websocket_api.async_response
async def websocket_compare(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Compare the latest scan with an earlier one."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        snapshot = await scanner.async_get_snapshot()
    except Exception as err:
        connection.send_error(msg["id"], "scan_failed", f"{type(err).__name__}: {err}")
        return
    connection.send_result(msg["id"], scanner.history.compare(snapshot, msg["baseline"]))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/ignore",
        vol.Required("finding_key"): str,
        vol.Required("ignored"): bool,
    }
)
@callback
def websocket_ignore(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Hide or show one finding. Only Housekeeper's own list changes."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    if not scanner.set_finding_ignored(msg["finding_key"], msg["ignored"]):
        connection.send_error(msg["id"], "not_found", "Finding not found in the latest scan")
        return
    connection.send_result(msg["id"], {"ignored": msg["ignored"]})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/set_options",
        **{
            vol.Optional(key): vol.All(int, vol.Range(min=low, max=high))
            for key, (low, high) in OPTION_LIMITS.items()
        },
    }
)
@callback
def websocket_set_options(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Change Housekeeper's own options. The entry reloads afterwards to apply them."""
    entries = hass.config_entries.async_entries(DOMAIN)
    changes = {key: msg[key] for key in OPTION_LIMITS if key in msg}
    if not entries or not changes:
        connection.send_error(msg["id"], "invalid_format", "Nothing to change")
        return
    entry = entries[0]
    options = {**entry.options, **changes}
    if options != dict(entry.options):
        hass.config_entries.async_update_entry(entry, options=options)
    connection.send_result(msg["id"], {"options": options})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/plan_create",
        vol.Required("actions"): vol.All(
            [
                {
                    vol.Required("kind"): vol.In(sorted(ACTION_KINDS)),
                    vol.Required("object_id"): str,
                    vol.Optional("target"): str,
                    vol.Optional("mode"): vol.In(METER_MODES),
                }
            ],
            vol.Length(min=1, max=MAX_ACTIONS),
        ),
    }
)
@websocket_api.async_response
async def websocket_plan_create(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Create a dry-run cleanup plan from the latest scan. Nothing is changed or executed."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    if scanner.warming_up:
        connection.send_error(msg["id"], "warming_up", "Home Assistant is still starting")
        return
    try:
        snapshot = await scanner.async_get_snapshot()
    except Exception as err:
        connection.send_error(msg["id"], "scan_failed", f"{type(err).__name__}: {err}")
        return
    registry = er.async_get(hass)

    def fingerprint(object_id: str) -> str | None:
        entry = registry.async_get(object_id)
        return registry_fingerprint(entry) if entry else None

    def restorable(object_id: str) -> bool | None:
        return entity_restorable(hass, registry.async_get(object_id))

    devices = dr.async_get(hass)

    def device_info(device_id: str) -> tuple[str | None, dict[str, Any]]:
        entry = devices.async_get(device_id)
        return (device_fingerprint(entry), device_support(hass, entry)) if entry else (None, {})

    reference_data = {}
    for action in msg["actions"]:
        if action["kind"] in REFERENCE_KINDS and action.get("target"):
            pair = (action["object_id"], action["target"])
            if pair not in reference_data and pair[0] != pair[1]:
                reference_data[pair] = await preview_replacement(hass, snapshot, *pair)

    meter_data = {}
    for action in msg["actions"]:
        if action["kind"] in METER_KINDS and action.get("target"):
            key = (action["object_id"], action["target"], action.get("mode") or "both")
            if key not in meter_data and key[0] != key[1]:
                meter_data[key] = await prepare_meter(hass, key[0], key[1], key[2])

    plan = build_plan(
        snapshot,
        msg["actions"],
        datetime.now(UTC),
        fingerprint,
        restorable,
        device_info=device_info,
        reference_data=reference_data,
        meter_data=meter_data,
    )
    scanner.journal.add(plan)
    connection.send_result(msg["id"], public_plan(plan))


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/plan_list"})
@callback
def websocket_plan_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the journal of plans as short entries, newest first; details come per plan."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    connection.send_result(msg["id"], {"plans": [plan_summary(p) for p in scanner.journal.plans]})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/plan_detail", vol.Required("plan_id"): str}
)
@callback
def websocket_plan_detail(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return one plan for display, without the data only the server needs to undo it."""
    scanner = _scanner(hass)
    plan = scanner.journal.get(msg["plan_id"]) if scanner else None
    if scanner is None or plan is None:
        connection.send_error(msg["id"], "not_found", "Plan not found")
        return
    connection.send_result(msg["id"], public_plan(plan))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/plan_delete", vol.Required("plan_id"): str}
)
@callback
def websocket_plan_delete(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Remove a dry-run entry from Housekeeper's journal."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    if not scanner.journal.remove(msg["plan_id"]):
        connection.send_error(msg["id"], "not_found", "Plan not found")
        return
    connection.send_result(msg["id"], {"removed": True})


def _cleanup_error(
    connection: websocket_api.ActiveConnection, msg: dict[str, Any], err: CleanupError
) -> None:
    connection.send_error(msg["id"], str(err), f"Cleanup: {err}")


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/plan_confirm",
        vol.Required("plan_id"): str,
        vol.Optional("acknowledged", default=[]): [str],
    }
)
@callback
def websocket_plan_confirm(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Pick the actions that may run and return a short-lived confirmation token."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        result = scanner.cleanup.confirm(msg["plan_id"], msg["acknowledged"], connection.user.id)
    except CleanupError as err:
        _cleanup_error(connection, msg, err)
        return
    connection.send_result(msg["id"], result)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/plan_execute",
        vol.Required("plan_id"): str,
        vol.Required("token"): str,
    }
)
@callback
def websocket_plan_execute(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Start a confirmed plan. It runs in the background; poll ``plan_status``."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        scanner.cleanup.start(msg["plan_id"], msg["token"], connection.user.id)
    except CleanupError as err:
        _cleanup_error(connection, msg, err)
        return
    connection.send_result(msg["id"], {"started": True})


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/plan_cancel"})
@callback
def websocket_plan_cancel(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Stop a running plan after the current step."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    scanner.cleanup.cancel()
    connection.send_result(msg["id"], {"cancelling": scanner.cleanup.running})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/plan_status", vol.Required("plan_id"): str}
)
@callback
def websocket_plan_status(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return progress and the current state of one plan."""
    scanner = _scanner(hass)
    plan = scanner.journal.get(msg["plan_id"]) if scanner else None
    if scanner is None or plan is None:
        connection.send_error(msg["id"], "not_found", "Plan not found")
        return
    connection.send_result(
        msg["id"], {"progress": scanner.cleanup.status, "plan": public_plan(plan)}
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/plan_undo",
        vol.Required("plan_id"): str,
        vol.Optional("object_ids"): [str],
    }
)
@websocket_api.async_response
async def websocket_plan_undo(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Re-enable quarantined entities that are still as Housekeeper left them."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        result = await scanner.cleanup.undo(msg["plan_id"], msg.get("object_ids"))
    except CleanupError as err:
        _cleanup_error(connection, msg, err)
        return
    connection.send_result(msg["id"], result)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/recorder_costs"})
@websocket_api.async_response
async def websocket_recorder_costs(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Rank the entities that fill the recorder database. Read-only."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        snapshot = await scanner.async_get_snapshot()
        result = await recorder_costs(hass, snapshot)
    except Exception as err:
        connection.send_error(msg["id"], "recorder_failed", f"{type(err).__name__}: {err}")
        return
    connection.send_result(msg["id"], result)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/preflight"})
@websocket_api.async_response
async def websocket_preflight(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Check backup, repairs, failing integrations and broken references; compare with the record."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        snapshot = await scanner.async_get_snapshot()
        result = await preflight_report(hass, snapshot, scanner.preflight)
    except Exception as err:
        connection.send_error(msg["id"], "scan_failed", f"{type(err).__name__}: {err}")
        return
    connection.send_result(msg["id"], result)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/preflight_save", vol.Optional("clear", default=False): bool}
)
@websocket_api.async_response
async def websocket_preflight_save(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Remember the current state as the starting point for the next update check."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        if msg["clear"]:
            scanner.preflight.clear()
        else:
            if scanner.cleanup.running:
                connection.send_error(msg["id"], "cleanup_busy", "A cleanup plan is running")
                return
            snapshot = await scanner.async_scan()
            report = await preflight_report(hass, snapshot, scanner.preflight)
            scanner.preflight.save(report["state"], snapshot)
        snapshot = await scanner.async_get_snapshot()
        result = await preflight_report(hass, snapshot, scanner.preflight)
    except Exception as err:
        connection.send_error(msg["id"], "scan_failed", f"{type(err).__name__}: {err}")
        return
    connection.send_result(msg["id"], result)


def async_register(hass: HomeAssistant) -> None:
    """Register Housekeeper WebSocket commands."""
    websocket_api.async_register_command(hass, websocket_inventory)
    websocket_api.async_register_command(hass, websocket_scan)
    websocket_api.async_register_command(hass, websocket_status)
    websocket_api.async_register_command(hass, websocket_detail)
    websocket_api.async_register_command(hass, websocket_compare)
    websocket_api.async_register_command(hass, websocket_ignore)
    websocket_api.async_register_command(hass, websocket_set_options)
    websocket_api.async_register_command(hass, websocket_plan_create)
    websocket_api.async_register_command(hass, websocket_plan_list)
    websocket_api.async_register_command(hass, websocket_plan_detail)
    websocket_api.async_register_command(hass, websocket_plan_delete)
    websocket_api.async_register_command(hass, websocket_plan_confirm)
    websocket_api.async_register_command(hass, websocket_plan_execute)
    websocket_api.async_register_command(hass, websocket_plan_cancel)
    websocket_api.async_register_command(hass, websocket_plan_status)
    websocket_api.async_register_command(hass, websocket_plan_undo)
    websocket_api.async_register_command(hass, websocket_recorder_costs)
    websocket_api.async_register_command(hass, websocket_preflight)
    websocket_api.async_register_command(hass, websocket_preflight_save)
