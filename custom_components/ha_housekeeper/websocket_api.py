"""WebSocket API for the HA Housekeeper panel."""

from __future__ import annotations

import asyncio
from datetime import UTC, date, datetime
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util

from . import refactor as refactor_module
from .audit_report import build_report
from .backup_health import ATTEST_KINDS, backup_health
from .blueprints import async_blueprints
from .cleanup import (
    ACTION_KINDS,
    MAX_ACTIONS,
    MAX_MERGE,
    METER_KINDS,
    METER_MODES,
    RECORDER_CHOICES,
    REFACTOR_KINDS,
    REFERENCE_KINDS,
    attach_history,
    build_plan,
    device_fingerprint,
    device_support,
    history_ids,
    merge_requests,
    plan_summary,
    public_plan,
    refactor_key,
    registry_fingerprint,
)
from .cleanup_exec import CleanupError, entity_restorable
from .const import API_SCHEMA, DOMAIN, OPTION_LIMITS
from .correlation import correlate
from .criteria import THRESHOLDS as CRITERIA_LIMITS
from .db_health import db_health, growth
from .device_pairs import pair_devices
from .dry_run import Context as DryRunContext
from .dry_run import dry_run as run_dry
from .exposure import exposure
from .goals import CATALOG as GOAL_CATALOG
from .goals import evaluate as evaluate_goals
from .goals import measure as measure_goals
from .ignored import KINDS as IGNORE_KINDS
from .ignored import REASON_LIMIT as IGNORE_REASON_LIMIT
from .inventory import InventoryScanner
from .lifecycle import removed_devices, timeline
from .maintenance import preflight_report, recorder_costs
from .marks import KINDS as MARK_KINDS
from .marks import OBJECT_TYPES as MARK_TYPES
from .meter import prepare_meter
from .policies import RULES as POLICY_RULES
from .policies import policies
from .protection import MODES as PROTECTION_MODES
from .quality import build as build_quality
from .recorder_purge import MAX_IDS as PURGE_MAX_IDS
from .recorder_purge import count_history
from .references import preview_replacement
from .reliability import WINDOWS as RELIABILITY_WINDOWS
from .reliability import reliability
from .run_health import report as runs_report
from .runs import run_key
from .statistics_last import statistics_last
from .storms import WINDOWS as STORMS_WINDOWS
from .storms import storms
from .trace_compare import compare as compare_traces
from .trace_compare import list_runs as list_trace_runs
from .window import SKIPPABLE, STEPS, WindowError, reload_targets
from .writelock import write_holder

BACKUP_HEALTH_TIMEOUT = 20  # seconds; a cloud backup target can answer slowly
RUNS_TIMEOUT = 20
EXPOSURE_TIMEOUT = 20  # seconds
STATISTICS_LAST_IDS = 50
RELIABILITY_TIMEOUT = 120  # seconds; the recorder query is slow on a large database


def _scanner(hass: HomeAssistant) -> InventoryScanner | None:
    """Return the configured scanner, or None while the entry is not loaded."""
    return hass.data.get(DOMAIN, {}).get("scanner")


def _versioned(result: dict[str, Any]) -> dict[str, Any]:
    """Mark a reply with the version of the API contract.

    Fields may be added without a new version; renaming or removing one needs ``API_SCHEMA`` to
    be raised. A copy is sent so cached snapshots never carry the marker.
    """
    return {**result, "schema": API_SCHEMA}


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
    connection.send_result(msg["id"], _versioned(result))


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
    connection.send_result(msg["id"], _versioned({**scanner.status, "writing": write_holder(hass)}))


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
        vol.Optional("kind", default="ignore"): vol.In(IGNORE_KINDS),
        vol.Optional("reason", default=""): vol.All(str, vol.Length(max=IGNORE_REASON_LIMIT)),
        vol.Optional("days"): vol.All(int, vol.Range(min=1, max=3650)),
    }
)
@callback
def websocket_ignore(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Hide, keep or put off one finding, or show it again. Only Housekeeper's own list changes."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    if msg["ignored"]:
        if msg["kind"] == "keep" and not msg["reason"].strip():
            connection.send_error(msg["id"], "reason_required", "Keeping a finding needs a reason")
            return
        if msg["kind"] == "snooze" and "days" not in msg:
            connection.send_error(msg["id"], "days_required", "Putting a finding off needs days")
            return
    if not scanner.set_finding_ignored(
        msg["finding_key"],
        msg["ignored"],
        kind=msg["kind"],
        reason=msg["reason"],
        days=msg.get("days"),
        by=connection.user.id if connection.user else None,
    ):
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


async def _plan_from_requests(
    hass: HomeAssistant,
    snapshot: dict[str, Any],
    requests: list[dict[str, Any]],
    refactor_enabled: bool = False,
) -> dict[str, Any]:
    """Judge ``requests`` against the snapshot and the live registries: a plan, not yet journaled."""
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
    for action in requests:
        if action["kind"] in REFERENCE_KINDS and action.get("target"):
            pair = (action["object_id"], action["target"])
            if pair not in reference_data and pair[0] != pair[1]:
                reference_data[pair] = await preview_replacement(hass, snapshot, *pair)

    meter_data = {}
    for action in requests:
        if action["kind"] in METER_KINDS and action.get("target"):
            key = (action["object_id"], action["target"], action.get("mode") or "both")
            if key not in meter_data and key[0] != key[1]:
                meter_data[key] = await prepare_meter(hass, key[0], key[1], key[2])

    def statistic_exists(statistic_id: str) -> bool:
        return registry.async_get(statistic_id) is not None or hass.states.get(statistic_id)

    refactor_data = {}
    for action in requests:
        if action["kind"] in REFACTOR_KINDS and refactor_enabled:
            fix, values = action.get("fix") or "", action.get("values") or {}
            key = refactor_key(action["object_id"], fix, values)
            if key not in refactor_data:
                refactor_data[key] = await refactor_module.preview(
                    hass, snapshot, action["object_id"], fix, values
                )

    plan = build_plan(
        snapshot,
        requests,
        datetime.now(UTC),
        fingerprint,
        restorable,
        device_info=device_info,
        reference_data=reference_data,
        meter_data=meter_data,
        statistic_exists=statistic_exists,
        refactor_data=refactor_data,
        refactor_enabled=refactor_enabled,
    )
    await _add_history(hass, snapshot, plan)
    return plan


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
                    vol.Optional("states"): bool,
                    vol.Optional("recorder"): vol.In(RECORDER_CHOICES),
                    vol.Optional("fix"): vol.In(refactor_module.FIXES),
                    vol.Optional("values"): {
                        vol.Optional("description"): vol.All(
                            str, vol.Length(max=refactor_module.DESCRIPTION_MAX)
                        ),
                        vol.Optional("timeout"): vol.All(
                            int, vol.Range(min=1, max=refactor_module.TIMEOUT_MAX)
                        ),
                        vol.Optional("continue_on_timeout"): bool,
                        vol.Optional("mode"): vol.In(refactor_module.MODES),
                        vol.Optional("max"): vol.All(
                            int, vol.Range(min=2, max=refactor_module.MAX_RUNS)
                        ),
                    },
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
    plan = await _plan_from_requests(hass, snapshot, msg["actions"], scanner.refactor.enabled)
    scanner.journal.add(plan)
    connection.send_result(msg["id"], _versioned(public_plan(plan)))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/plan_merge",
        vol.Required("plan_ids"): vol.All([str], vol.Length(min=2, max=MAX_MERGE)),
    }
)
@websocket_api.async_response
async def websocket_plan_merge(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Build one new plan from several open previews and drop those previews. Executes nothing."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    if scanner.warming_up:
        connection.send_error(msg["id"], "warming_up", "Home Assistant is still starting")
        return
    ids = list(dict.fromkeys(msg["plan_ids"]))
    plans = [scanner.journal.get(i) for i in ids]
    if len(ids) < 2 or any(p is None for p in plans):
        connection.send_error(msg["id"], "not_found", "Two or more known plans are needed")
        return
    if any(p.get("executed") or p.get("run") for p in plans):
        connection.send_error(msg["id"], "plan_not_open", "Only open previews can be merged")
        return
    requests, conflicts, dropped = merge_requests(plans)
    if not requests:
        connection.send_error(msg["id"], "nothing_to_merge", "Nothing is left after the conflicts")
        return
    if len(requests) > MAX_ACTIONS:
        connection.send_error(msg["id"], "too_many", f"At most {MAX_ACTIONS} actions in one plan")
        return
    try:
        snapshot = await scanner.async_get_snapshot()
    except Exception as err:
        connection.send_error(msg["id"], "scan_failed", f"{type(err).__name__}: {err}")
        return
    plan = await _plan_from_requests(hass, snapshot, requests, scanner.refactor.enabled)
    plan["events"].append({"at": datetime.now(UTC).isoformat(), "type": "merged", "plans": ids})
    scanner.journal.add(plan)
    for plan_id in ids:
        scanner.journal.remove(plan_id)
    connection.send_result(
        msg["id"],
        _versioned(
            {
                "plan": public_plan(plan),
                "merged": ids,
                "conflicts": conflicts,
                "dropped": dropped,
            }
        ),
    )


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
    connection.send_result(
        msg["id"],
        _versioned(
            {
                "plans": [plan_summary(p) for p in scanner.journal.plans],
                "purges": scanner.journal.purges,
            }
        ),
    )


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
    connection.send_result(msg["id"], _versioned(public_plan(plan)))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/plan_report",
        vol.Required("plan_id"): str,
        vol.Optional("anonymize", default=True): bool,
        vol.Optional("lang", default="en"): vol.In(["de", "en"]),
    }
)
@callback
def websocket_plan_report(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the audit report of one plan as Markdown; IDs are anonymized unless asked."""
    scanner = _scanner(hass)
    plan = scanner.journal.get(msg["plan_id"]) if scanner else None
    if scanner is None or plan is None:
        connection.send_error(msg["id"], "not_found", "Plan not found")
        return
    markdown = build_report(plan, anonymize=msg["anonymize"], lang=msg["lang"])
    connection.send_result(
        msg["id"],
        _versioned(
            {
                "filename": f"housekeeper-plan-{plan['plan_id']}.md",
                "anonymized": msg["anonymize"],
                "markdown": markdown,
            }
        ),
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/device_pairs",
        vol.Required("old_device_id"): str,
        vol.Required("new_device_id"): str,
    }
)
@websocket_api.async_response
async def websocket_device_pairs(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Suggest the entities of a new device for those of an old one. Reads only; nothing is chosen."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        snapshot = await scanner.async_get_snapshot()
    except Exception as err:
        connection.send_error(msg["id"], "scan_failed", f"{type(err).__name__}: {err}")
        return
    pairs = pair_devices(snapshot, msg["old_device_id"], msg["new_device_id"])
    if pairs is None:
        connection.send_error(msg["id"], "not_found", "Two different known devices are needed")
        return
    connection.send_result(msg["id"], _versioned(pairs))


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
        msg["id"],
        _versioned({"progress": scanner.cleanup.status, "plan": public_plan(plan)}),
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
@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/recorder_costs", vol.Optional("refresh", default=False): bool}
)
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
        result = await recorder_costs(hass, snapshot, refresh=msg["refresh"], store=scanner.replies)
    except Exception as err:
        connection.send_error(msg["id"], "recorder_failed", f"{type(err).__name__}: {err}")
        return
    connection.send_result(msg["id"], _versioned(result))


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


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/reliability",
        vol.Optional("window_days", default=7): vol.In(RELIABILITY_WINDOWS),
        vol.Optional("refresh", default=False): bool,
        vol.Optional("compare", default=False): bool,
        vol.Optional("cached_only", default=False): bool,
    }
)
@websocket_api.async_response
async def websocket_reliability(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Availability and shared outages per config entry. Read-only; kept for five minutes."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        snapshot = await scanner.async_get_snapshot()
        async with asyncio.timeout(RELIABILITY_TIMEOUT):
            result = await reliability(
                hass,
                snapshot,
                window_days=msg["window_days"],
                refresh=msg["refresh"],
                compare=msg["compare"],
                store=scanner.replies,
                cached_only=msg["cached_only"],
            )
    except Exception as err:
        connection.send_error(msg["id"], "reliability_failed", f"{type(err).__name__}: {err}")
        return
    connection.send_result(msg["id"], _versioned(result))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/db_health",
        vol.Optional("refresh", default=False): bool,
    }
)
@websocket_api.async_response
async def websocket_db_health(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Database size, statistics and recorder gaps. Read-only; kept for ten minutes."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        snapshot = await scanner.async_get_snapshot()
        async with asyncio.timeout(RELIABILITY_TIMEOUT):
            result = await db_health(
                hass, snapshot, scanner.events, refresh=msg["refresh"], store=scanner.replies
            )
    except Exception as err:
        connection.send_error(msg["id"], "db_health_failed", f"{type(err).__name__}: {err}")
        return
    connection.send_result(msg["id"], _versioned(result))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/statistics_last",
        vol.Optional("ids"): vol.All([str], vol.Length(max=STATISTICS_LAST_IDS)),
        vol.Optional("refresh", default=False): bool,
    }
)
@websocket_api.async_response
async def websocket_statistics_last(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """When statistics last received a value (the orphaned ones by default). Read-only; kept for ten minutes."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        snapshot = await scanner.async_get_snapshot()
        async with asyncio.timeout(RELIABILITY_TIMEOUT):
            result = await statistics_last(hass, snapshot, msg.get("ids"), refresh=msg["refresh"])
    except Exception as err:
        connection.send_error(msg["id"], "statistics_last_failed", f"{type(err).__name__}: {err}")
        return
    connection.send_result(msg["id"], _versioned(result))


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/policies"})
@websocket_api.async_response
async def websocket_policies(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Which quality rules are on and which objects break them. Read-only."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        snapshot = await scanner.async_get_snapshot()
        result = policies(
            hass,
            snapshot,
            scanner.policies,
            scanner.ignored,
            scanner.replies,
            scanner.low_battery_percent,
        )
    except Exception as err:
        connection.send_error(msg["id"], "policies_failed", f"{type(err).__name__}: {err}")
        return
    connection.send_result(msg["id"], _versioned(result))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/set_policy",
        vol.Required("rule"): vol.In(POLICY_RULES),
        vol.Required("enabled"): bool,
    }
)
@callback
def websocket_set_policy(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Switch one quality rule on or off. Only Housekeeper's own setting changes."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    scanner.policies.set_enabled(msg["rule"], msg["enabled"])
    connection.send_result(msg["id"], {"enabled": sorted(scanner.policies.enabled)})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/set_policy_limit", vol.Required("limit"): int}
)
@callback
def websocket_set_policy_limit(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Set the daily limit of the state-changes rule. Only Housekeeper's own setting changes."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        scanner.policies.set_limit(msg["limit"])
    except ValueError as err:
        connection.send_error(msg["id"], "invalid_format", f"Not accepted: {err}")
        return
    connection.send_result(msg["id"], {"limit": scanner.policies.limit})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/set_policy_prefix",
        vol.Required("domain"): str,
        vol.Required("prefix"): str,
    }
)
@callback
def websocket_set_policy_prefix(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Set or remove the naming prefix of one domain (an empty prefix removes it)."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        scanner.policies.set_prefix(msg["domain"].strip().lower(), msg["prefix"].strip().lower())
    except ValueError as err:
        connection.send_error(msg["id"], "invalid_format", f"Not accepted: {err}")
        return
    connection.send_result(msg["id"], {"prefixes": dict(scanner.policies.prefixes)})


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/exposure"})
@websocket_api.async_response
async def websocket_exposure(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Which entities assistants and bridges can reach. Read-only; only metadata, no secrets."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        snapshot = await scanner.async_get_snapshot()
        async with asyncio.timeout(EXPOSURE_TIMEOUT):
            result = exposure(hass, snapshot)
    except Exception as err:
        connection.send_error(msg["id"], "exposure_failed", f"{type(err).__name__}: {err}")
        return
    connection.send_result(msg["id"], _versioned(result))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/storms",
        vol.Optional("window_days", default=1): vol.In(STORMS_WINDOWS),
        vol.Optional("refresh", default=False): bool,
    }
)
@websocket_api.async_response
async def websocket_storms(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Recorder load per entity, integration and event type. Read-only; kept for ten minutes."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        snapshot = await scanner.async_get_snapshot()
        async with asyncio.timeout(RELIABILITY_TIMEOUT):
            result = await storms(
                hass,
                snapshot,
                window_days=msg["window_days"],
                refresh=msg["refresh"],
                store=scanner.replies,
            )
    except Exception as err:
        connection.send_error(msg["id"], "storms_failed", f"{type(err).__name__}: {err}")
        return
    connection.send_result(msg["id"], _versioned(result))


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/backup_health"})
@websocket_api.async_response
async def websocket_backup_health(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Judge the backup strategy; reads the backup manager only."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        async with asyncio.timeout(BACKUP_HEALTH_TIMEOUT):
            result = await backup_health(hass, scanner.attest, scanner.journal.plans)
    except Exception as err:
        connection.send_error(msg["id"], "backup_health_failed", f"{type(err).__name__}: {err}")
        return
    connection.send_result(msg["id"], _versioned(result))


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/automation_runs"})
@websocket_api.async_response
async def websocket_automation_runs(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Rate automation and script runs; reads trace heads and Housekeeper's own numbers."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        async with asyncio.timeout(RUNS_TIMEOUT):
            result = await runs_report(scanner)
    except Exception as err:
        connection.send_error(msg["id"], "automation_runs_failed", f"{type(err).__name__}: {err}")
        return
    connection.send_result(msg["id"], _versioned(result))


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/automation_quality"})
@websocket_api.async_response
async def websocket_automation_quality(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Seven separate quality dimensions per automation; reads only."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        async with asyncio.timeout(RUNS_TIMEOUT):
            runs = await runs_report(scanner)
            snapshot = await scanner.async_get_snapshot()
    except Exception as err:
        connection.send_error(msg["id"], "quality_failed", f"{type(err).__name__}: {err}")
        return
    result = build_quality(
        snapshot,
        runs,
        runs["conflicts"]["items"],
        scanner.criteria,
        datetime.now(UTC).date(),
        lambda entity_id: (scanner.get_details("automation", entity_id) or {}).get("actions"),
    )
    connection.send_result(msg["id"], _versioned(result))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/criteria", vol.Required("entity_id"): str}
)
@callback
def websocket_criteria(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """The success criteria of one automation with their outcomes of the last days."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    result = scanner.criteria.view(msg["entity_id"], datetime.now(UTC).date())
    connection.send_result(msg["id"], _versioned({**result, "limits": CRITERIA_LIMITS}))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/criteria_set",
        vol.Required("entity_id"): str,
        vol.Required("criteria"): list,
    }
)
@callback
def websocket_criteria_set(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Replace the success criteria of one automation; an empty list removes them."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        scanner.criteria.set(msg["entity_id"], msg["criteria"])
    except ValueError as err:
        connection.send_error(msg["id"], "invalid_format", str(err))
        return
    result = scanner.criteria.view(msg["entity_id"], datetime.now(UTC).date())
    connection.send_result(msg["id"], _versioned({**result, "limits": CRITERIA_LIMITS}))


async def _add_history(hass: HomeAssistant, snapshot: dict[str, Any], plan: dict[str, Any]) -> None:
    """Count the recorder rows a plan is about, so the end state can name them (exact, no sizes)."""
    ids = history_ids(plan)
    if ids and snapshot["meta"].get("recorder_available"):
        rows = await count_history(hass, ids)
        if rows is not None:
            attach_history(plan, rows)


async def _snapshot_or_error(
    scanner: Any, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> dict[str, Any] | None:
    """The last snapshot, or None after the error was sent."""
    try:
        return await scanner.async_get_snapshot()
    except Exception as err:
        connection.send_error(msg["id"], "scan_failed", f"{type(err).__name__}: {err}")
        return None


def _automation_key(snapshot: dict[str, Any], entity_id: str) -> tuple[str | None, dict[str, Any]]:
    for obj in snapshot["objects"]:
        if obj["object_type"] == "automation" and obj["object_id"] == entity_id:
            return run_key(obj), obj
    return None, {}


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/coverage", vol.Required("entity_id"): str}
)
@websocket_api.async_response
async def websocket_coverage(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """How often each trigger and branch of one automation ran (only when switched on)."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    snapshot = await _snapshot_or_error(scanner, connection, msg)
    if snapshot is None:
        return
    key, _ = _automation_key(snapshot, msg["entity_id"])
    if key is None:
        connection.send_error(msg["id"], "not_found", "Unknown automation")
        return
    details = scanner.get_details("automation", msg["entity_id"]) or {}
    result = scanner.coverage.view(key, details.get("triggers"), details.get("actions"))
    connection.send_result(msg["id"], _versioned(result))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/coverage_set",
        vol.Required("enabled"): bool,
        vol.Optional("clear", default=False): bool,
    }
)
@callback
def websocket_coverage_set(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Switch the coverage counting on or off; ``clear`` forgets what was counted."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    scanner.coverage.set_enabled(msg["enabled"], clear=msg["clear"])
    connection.send_result(msg["id"], {"enabled": scanner.coverage.enabled})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/trace_compare",
        vol.Required("entity_id"): str,
        vol.Optional("run_a"): str,
        vol.Optional("run_b"): str,
    }
)
@websocket_api.async_response
async def websocket_trace_compare(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """List the runs Home Assistant still has, or compare two of them by structure. Reads only."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    snapshot = await _snapshot_or_error(scanner, connection, msg)
    if snapshot is None:
        return
    key, _ = _automation_key(snapshot, msg["entity_id"])
    if key is None:
        connection.send_error(msg["id"], "not_found", "Unknown automation")
        return
    try:
        if "run_a" not in msg or "run_b" not in msg:
            runs = await list_trace_runs(hass, key)
            connection.send_result(msg["id"], _versioned({"runs": runs}))
            return
        result = await compare_traces(
            hass,
            key,
            msg["run_a"],
            msg["run_b"],
            scanner.events.events,
            scanner.criteria.recent.get(msg["entity_id"], []),
        )
    except Exception as err:
        connection.send_error(msg["id"], "trace_failed", f"{type(err).__name__}: {err}")
        return
    if result is None:
        connection.send_error(msg["id"], "not_found", "A run is no longer in the trace buffer")
        return
    connection.send_result(msg["id"], _versioned(result))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/refactor_proposals", vol.Required("entity_id"): str}
)
@websocket_api.async_response
async def websocket_refactor_proposals(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """What could be improved mechanically in one automation, and whether refactoring is on."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    snapshot = await _snapshot_or_error(scanner, connection, msg)
    if snapshot is None:
        return
    result: dict[str, Any] = {
        "entity_id": msg["entity_id"],
        "enabled": scanner.refactor.enabled,
        "editable": False,
        "reason": None,
        "proposals": [],
    }
    try:
        loaded = await refactor_module.load_source(hass, snapshot, f"automation:{msg['entity_id']}")
        if "use_blueprint" in loaded["item"]:
            result["reason"] = "blueprint"
        else:
            result["editable"] = True
            result["proposals"] = refactor_module.propose(loaded["item"])
    except refactor_module.SourceError as err:
        result["reason"] = str(err)
    connection.send_result(msg["id"], _versioned(result))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/refactor_set", vol.Required("enabled"): bool}
)
@callback
def websocket_refactor_set(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Switch the experimental refactoring on or off."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    scanner.refactor.set_enabled(msg["enabled"])
    connection.send_result(msg["id"], {"enabled": scanner.refactor.enabled})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/protection_set",
        vol.Required("mode"): vol.In(PROTECTION_MODES),
    }
)
@callback
def websocket_protection_set(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Set the protection mode: what plans may change, checked on the server."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    scanner.protection.set_mode(msg["mode"])
    if scanner._snapshot is not None:
        scanner._snapshot["meta"]["protection"] = scanner.protection.mode
    connection.send_result(msg["id"], {"mode": scanner.protection.mode})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/automation_dry_run",
        vol.Required("entity_id"): str,
        vol.Optional("states", default={}): vol.All(
            {vol.Match(r"^[a-z0-9_]+\.[a-z0-9_]+$"): vol.All(str, vol.Length(min=1, max=100))},
            vol.Length(max=20),
        ),
    }
)
@websocket_api.async_response
async def websocket_automation_dry_run(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Explain what one automation would do for the given test states. Never executes anything."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    snapshot = await _snapshot_or_error(scanner, connection, msg)
    if snapshot is None:
        return
    key, _ = _automation_key(snapshot, msg["entity_id"])
    if key is None:
        connection.send_error(msg["id"], "not_found", "Unknown automation")
        return
    details = scanner.get_details("automation", msg["entity_id"]) or {}
    registry = er.async_get(hass)
    overrides = msg["states"]

    def state(entity_id: str) -> str | None:
        if entity_id in overrides:
            return overrides[entity_id]
        found = hass.states.get(entity_id)
        return found.state if found else None

    def attrs(entity_id: str) -> dict[str, Any]:
        found = hass.states.get(entity_id)
        return dict(found.attributes) if found else {}

    def disabled(entity_id: str) -> bool:
        entry = registry.async_get(entity_id)
        return bool(entry and entry.disabled_by)

    ctx = DryRunContext(
        state=state,
        attrs=attrs,
        exists=lambda e: hass.states.get(e) is not None or registry.async_get(e) is not None,
        disabled=disabled,
        now=dt_util.now(),
        overrides=overrides,
    )
    result = run_dry(
        details.get("triggers"), details.get("conditions"), details.get("actions"), ctx
    )
    connection.send_result(msg["id"], _versioned(result))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/lifecycle", vol.Optional("device_id"): str}
)
@websocket_api.async_response
async def websocket_lifecycle(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """The life of one device (steps, state, note), or without a device the removed devices."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    plans = scanner.journal.plans
    if "device_id" not in msg:
        removed = [
            {**d, "note": (scanner.lifecycle.notes.get(d["object_id"]) or {}).get("text")}
            for d in removed_devices(plans)
        ]
        connection.send_result(msg["id"], _versioned({"removed": removed}))
        return
    snapshot = await scanner.async_get_snapshot()
    device = next(
        (
            i
            for i in snapshot["objects"]
            if i["object_type"] == "device" and i["object_id"] == msg["device_id"]
        ),
        None,
    )
    if device is None:
        connection.send_error(msg["id"], "not_found", "Unknown device")
        return
    result = timeline(device, snapshot, plans, scanner.replies)
    result["note"] = scanner.lifecycle.notes.get(msg["device_id"])
    connection.send_result(msg["id"], _versioned(result))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/mark_set",
        vol.Required("object_type"): vol.In(MARK_TYPES),
        vol.Required("object_id"): str,
        vol.Required("kind"): vol.In(MARK_KINDS),
        vol.Optional("reason", default=""): vol.All(str, vol.Length(max=IGNORE_REASON_LIMIT)),
        vol.Optional("days"): vol.All(int, vol.Range(min=1, max=3650)),
        vol.Optional("target"): vol.All(str, vol.Length(max=255)),
    }
)
@callback
def websocket_mark_set(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Tell Housekeeper what to expect of an entity or device. Only its own list changes."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    error = scanner.set_mark(
        msg["object_type"],
        msg["object_id"],
        msg["kind"],
        reason=msg["reason"],
        days=msg.get("days"),
        target=msg.get("target"),
        by=connection.user.id if connection.user else None,
    )
    if error:
        connection.send_error(msg["id"], error, f"Mark not set: {error}")
        return
    connection.send_result(msg["id"], {"marked": True})


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/goals"})
@websocket_api.async_response
async def websocket_goals(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Each maintenance goal with its limit, the current value and whether it is met. Read-only."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        snapshot = await scanner.async_get_snapshot()
        try:  # a missing source makes its goals unknown, it never fails the answer
            async with asyncio.timeout(BACKUP_HEALTH_TIMEOUT):
                backup = await backup_health(hass, scanner.attest, scanner.journal.plans)
        except Exception:  # noqa: BLE001
            backup = None
        rules = policies(
            hass,
            snapshot,
            scanner.policies,
            scanner.ignored,
            scanner.replies,
            scanner.low_battery_percent,
        )["rules"]
        grown = growth(scanner.events.sizes, datetime.now(UTC).date())
        measured = measure_goals(snapshot, backup, grown, rules)
        result = evaluate_goals(measured, scanner.goals.items)
    except Exception as err:
        connection.send_error(msg["id"], "goals_failed", f"{type(err).__name__}: {err}")
        return
    connection.send_result(msg["id"], _versioned(result))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/goal_set",
        vol.Required("goal"): vol.In(tuple(GOAL_CATALOG)),
        vol.Optional("enabled"): bool,
        vol.Optional("limit"): vol.All(int, vol.Range(min=0, max=1_000_000)),
    }
)
@callback
def websocket_goal_set(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Switch a goal on or off or change its limit. Only Housekeeper's own list changes."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    if not scanner.goals.set(msg["goal"], enabled=msg.get("enabled"), limit=msg.get("limit")):
        connection.send_error(msg["id"], "invalid_limit", "The limit is outside the allowed range")
        return
    connection.send_result(msg["id"], {"saved": True})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/mark_clear",
        vol.Required("object_type"): vol.In(MARK_TYPES),
        vol.Required("object_id"): str,
    }
)
@callback
def websocket_mark_clear(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Take a mark away again."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    scanner.clear_mark(msg["object_type"], msg["object_id"])
    connection.send_result(msg["id"], {"marked": False})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/lifecycle_note",
        vol.Required("device_id"): str,
        vol.Required("text"): str,
    }
)
@callback
def websocket_lifecycle_note(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Set or clear the note of a device. Only Housekeeper's own store changes."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        scanner.lifecycle.set_note(msg["device_id"], msg["text"], datetime.now(UTC).isoformat())
    except ValueError as err:
        connection.send_error(msg["id"], "invalid_format", f"Not accepted: {err}")
        return
    connection.send_result(msg["id"], {"note": scanner.lifecycle.notes.get(msg["device_id"])})


def _window_view(scanner: InventoryScanner) -> dict[str, Any]:
    window = scanner.window
    return {"enabled": window.enabled, "state": window.state, "current": window.current()}


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/window"})
@callback
def websocket_window(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """The maintenance window: whether it is switched on and where it stands. Reads the store only."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    connection.send_result(msg["id"], _versioned(_window_view(scanner)))


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/blueprints"})
@websocket_api.async_response
async def websocket_blueprints(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Blueprints nothing uses and automations whose blueprint is gone. Read-only."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    try:
        snapshot = await scanner.async_get_snapshot()
        result = await async_blueprints(hass, snapshot)
    except Exception as err:
        connection.send_error(msg["id"], "blueprints_failed", f"{type(err).__name__}: {err}")
        return
    connection.send_result(msg["id"], _versioned(result))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/purge_statistics",
        vol.Required("statistic_ids"): vol.All([str], vol.Length(min=1, max=PURGE_MAX_IDS)),
        vol.Required("states"): bool,
        vol.Required("confirmed"): True,
    }
)
@websocket_api.async_response
async def websocket_purge_statistics(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Delete the recorder statistics of orphaned entities after a backup. Not undoable."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    if scanner.warming_up or scanner.cleanup.running or write_holder(hass):
        connection.send_error(
            msg["id"], "busy", "Home Assistant is starting or a plan or purge is running"
        )
        return
    if not scanner.snapshot or not scanner.snapshot["meta"].get("recorder_available"):
        connection.send_error(msg["id"], "no_recorder", "The recorder is not available")
        return
    by = connection.user.id if connection.user else None
    registry = er.async_get(hass)
    ids = list(dict.fromkeys(msg["statistic_ids"]))
    plan = build_plan(
        scanner.snapshot,
        [{"kind": "purge_statistics", "object_id": i, "states": msg["states"]} for i in ids],
        datetime.now(UTC),
        statistic_exists=lambda sid: (
            registry.async_get(sid) is not None or hass.states.get(sid) is not None
        ),
    )
    await _add_history(hass, scanner.snapshot, plan)
    scanner.journal.add(plan)
    legacy = {"entity_exists": "exists"}
    result: dict[str, Any] = {
        "removed": [],
        "skipped": [
            {"id": a["object_id"], "reason": legacy.get(a["reasons"][0], a["reasons"][0])}
            for a in plan["actions"]
            if not a["executable"]
        ],
        "backup": False,
        "states": msg["states"],
        "plan_id": plan["plan_id"],
    }
    runnable = [a["object_id"] for a in plan["actions"] if a["executable"]]
    if runnable:
        try:
            confirmation = scanner.cleanup.confirm(plan["plan_id"], runnable, by)
            scanner.cleanup.start(plan["plan_id"], confirmation["token"], by)
        except CleanupError as err:
            _cleanup_error(connection, msg, err)
            return
        await scanner.cleanup.wait()
        results = {a["object_id"]: a.get("result") or {} for a in plan["actions"]}
        result["removed"] = [i for i in runnable if results[i].get("state") == "done"]
        result["skipped"] += [
            {"id": i, "reason": results[i].get("reason", "not_run")}
            for i in runnable
            if i not in result["removed"]
        ]
        result["backup"] = bool(plan.get("backup"))
        failures = {"backup_unavailable", "no_backup_agent", "backup_failed", "recorder_busy"}
        result["error"] = next(
            (r["reason"] for r in results.values() if r.get("reason") in failures), None
        )
    connection.send_result(msg["id"], _versioned(result))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/notify_set",
        vol.Required("enabled"): bool,
    }
)
@callback
def websocket_notify_set(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Switch the message about new broken references. Switching on announces nothing old."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    findings = (scanner.snapshot or {}).get("findings", [])
    scanner.notify.set_enabled(msg["enabled"], findings)
    if scanner.snapshot:
        scanner.snapshot["meta"]["notify"] = scanner.notify.enabled
    connection.send_result(msg["id"], {"enabled": scanner.notify.enabled})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/window_set",
        vol.Required("action"): vol.In(("enable", "disable", "begin", "advance", "clear")),
        vol.Optional("plan_id"): str,
        vol.Optional("step"): vol.In(STEPS),
        vol.Optional("note", default=""): str,
        vol.Optional("skip", default=False): bool,
    }
)
@callback
def websocket_window_set(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Switch the window on or off, open it with a plan, take the next step, or close it.

    Taking a step only records it. The plan step needs the plan to have run; the restart step needs
    a restart in the event log after the window began (or an explicit skip).
    """
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    window, now = scanner.window, datetime.now(UTC).isoformat()
    try:
        action = msg["action"]
        if action in ("enable", "disable"):
            window.set_enabled(action == "enable")
        elif action == "begin":
            window.begin(now, msg.get("plan_id", ""))
        elif action == "clear":
            window.clear()
        else:
            step = msg.get("step")
            if step is None or window.state is None:
                raise WindowError("out of order")
            if msg["skip"] and step not in SKIPPABLE:
                raise WindowError("not skippable")
            if step == "plan":
                plan = scanner.journal.get(window.state["plan_id"] or "")
                if not plan or not plan.get("executed"):
                    raise WindowError("the plan has not run")
            if step == "restart" and not msg["skip"]:
                started = window.state["started_at"]
                if not any(
                    e["kind"] == "start" and e["at"] > started for e in scanner.events.events
                ):
                    raise WindowError("no restart seen yet")
            window.advance(step, now, "skipped" if msg["skip"] else msg["note"])
    except WindowError as err:
        connection.send_error(msg["id"], "invalid_format", f"Not accepted: {err}")
        return
    connection.send_result(msg["id"], _versioned(_window_view(scanner)))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/window_reload",
        vol.Optional("execute", default=False): bool,
    }
)
@websocket_api.async_response
async def websocket_window_reload(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """List, or with ``execute`` reload, the integrations that the window's executed plan changed."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    state = scanner.window.state
    plan = scanner.journal.get((state or {}).get("plan_id") or "")
    if state is None or not plan or not plan.get("executed"):
        connection.send_error(msg["id"], "invalid_format", "Not accepted: the plan has not run")
        return
    snapshot = await scanner.async_get_snapshot()
    targets = reload_targets(plan, snapshot)
    if msg["execute"]:
        if scanner.window.current() != "reload":
            connection.send_error(msg["id"], "invalid_format", "Not accepted: out of order")
            return
        for target in targets:
            try:
                await hass.config_entries.async_reload(target["entry_id"])
                target["ok"] = True
            except Exception as err:
                target["ok"] = False
                target["error"] = type(err).__name__
    connection.send_result(msg["id"], _versioned({"targets": targets, "executed": msg["execute"]}))


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/correlations"})
@websocket_api.async_response
async def websocket_correlations(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Findings that began at about the time of an update or restart. Reads the last scan only."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    snapshot = await scanner.async_get_snapshot()
    result = correlate(snapshot["findings"], scanner.events.recent())
    connection.send_result(msg["id"], _versioned(result))


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/events"})
@callback
def websocket_events(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return Housekeeper's own event log (version changes, restarts); reads the store only."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    connection.send_result(
        msg["id"],
        _versioned({"events": scanner.events.recent(), "heartbeat": scanner.events.heartbeat}),
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/backup_attest",
        vol.Required("kind"): vol.In(ATTEST_KINDS),
        vol.Optional("date"): vol.Match(r"^\d{4}-\d{2}-\d{2}$"),
        vol.Optional("clear", default=False): bool,
    }
)
@websocket_api.async_response
async def websocket_backup_attest(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Record, or clear, a fact only the person can confirm (emergency kit stored, restore tried)."""
    scanner = _scanner(hass)
    if scanner is None:
        connection.send_error(msg["id"], "not_loaded", "HA Housekeeper is not loaded")
        return
    if msg["clear"]:
        scanner.attest.clear(msg["kind"])
    else:
        day = None
        if "date" in msg:
            try:
                day = date.fromisoformat(msg["date"])
            except ValueError:
                connection.send_error(msg["id"], "invalid_date", "The date does not exist")
                return
            if day > datetime.now(UTC).date():
                connection.send_error(msg["id"], "invalid_date", "The date lies in the future")
                return
        scanner.attest.set(msg["kind"], day)
    try:
        async with asyncio.timeout(BACKUP_HEALTH_TIMEOUT):
            result = await backup_health(hass, scanner.attest, scanner.journal.plans)
    except Exception as err:
        connection.send_error(msg["id"], "backup_health_failed", f"{type(err).__name__}: {err}")
        return
    connection.send_result(msg["id"], _versioned(result))


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
    websocket_api.async_register_command(hass, websocket_plan_merge)
    websocket_api.async_register_command(hass, websocket_plan_list)
    websocket_api.async_register_command(hass, websocket_plan_detail)
    websocket_api.async_register_command(hass, websocket_plan_delete)
    websocket_api.async_register_command(hass, websocket_plan_report)
    websocket_api.async_register_command(hass, websocket_device_pairs)
    websocket_api.async_register_command(hass, websocket_plan_confirm)
    websocket_api.async_register_command(hass, websocket_plan_execute)
    websocket_api.async_register_command(hass, websocket_plan_cancel)
    websocket_api.async_register_command(hass, websocket_plan_status)
    websocket_api.async_register_command(hass, websocket_plan_undo)
    websocket_api.async_register_command(hass, websocket_recorder_costs)
    websocket_api.async_register_command(hass, websocket_preflight)
    websocket_api.async_register_command(hass, websocket_preflight_save)
    websocket_api.async_register_command(hass, websocket_backup_health)
    websocket_api.async_register_command(hass, websocket_reliability)
    websocket_api.async_register_command(hass, websocket_storms)
    websocket_api.async_register_command(hass, websocket_db_health)
    websocket_api.async_register_command(hass, websocket_statistics_last)
    websocket_api.async_register_command(hass, websocket_policies)
    websocket_api.async_register_command(hass, websocket_set_policy)
    websocket_api.async_register_command(hass, websocket_set_policy_prefix)
    websocket_api.async_register_command(hass, websocket_set_policy_limit)
    websocket_api.async_register_command(hass, websocket_exposure)
    websocket_api.async_register_command(hass, websocket_backup_attest)
    websocket_api.async_register_command(hass, websocket_window)
    websocket_api.async_register_command(hass, websocket_window_set)
    websocket_api.async_register_command(hass, websocket_notify_set)
    websocket_api.async_register_command(hass, websocket_purge_statistics)
    websocket_api.async_register_command(hass, websocket_blueprints)
    websocket_api.async_register_command(hass, websocket_window_reload)
    websocket_api.async_register_command(hass, websocket_lifecycle)
    websocket_api.async_register_command(hass, websocket_lifecycle_note)
    websocket_api.async_register_command(hass, websocket_mark_set)
    websocket_api.async_register_command(hass, websocket_mark_clear)
    websocket_api.async_register_command(hass, websocket_goals)
    websocket_api.async_register_command(hass, websocket_goal_set)
    websocket_api.async_register_command(hass, websocket_correlations)
    websocket_api.async_register_command(hass, websocket_events)
    websocket_api.async_register_command(hass, websocket_automation_runs)
    websocket_api.async_register_command(hass, websocket_automation_quality)
    websocket_api.async_register_command(hass, websocket_criteria)
    websocket_api.async_register_command(hass, websocket_criteria_set)
    websocket_api.async_register_command(hass, websocket_coverage)
    websocket_api.async_register_command(hass, websocket_coverage_set)
    websocket_api.async_register_command(hass, websocket_trace_compare)
    websocket_api.async_register_command(hass, websocket_automation_dry_run)
    websocket_api.async_register_command(hass, websocket_refactor_proposals)
    websocket_api.async_register_command(hass, websocket_refactor_set)
    websocket_api.async_register_command(hass, websocket_protection_set)
