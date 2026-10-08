"""Executing confirmed cleanup plans. This is the only module that changes Home Assistant.

Entities:

* ``disable_entity`` quarantines an entity by disabling it. Nothing is deleted, history and
  statistics are never touched, and the step can be undone while the entity is unchanged.
* ``remove_entity`` removes the registry entry of an entity that has been in quarantine for at
  least ``QUARANTINE_DAYS``. A Home Assistant backup is created first and must complete, and the
  entry is stored in the journal so that it can be restored.

Devices (same quarantine and backup rules; removing a device also removes its entities):

* ``disable_device`` quarantines a device.
* ``remove_device`` uses the official path: the integration is asked and may refuse.
* ``forget_device`` removes the registry entry although the integration offers no removal, then
  reloads the integration. Hubs and devices with children are never touched.

References:

* ``replace_references`` rewrites exact references to one entity in automations, scripts, scenes,
  storage dashboards and the Energy dashboard. Each source is stored in the journal before it is
  rewritten and put back on undo while it is still exactly as Housekeeper left it.

Meters:

* ``migrate_meter`` joins the long-term statistics of a replaced meter in front of its successor
  (experimental: it writes into the recorder database, so a backup is mandatory and statistics
  cannot be undone) and/or lets the new entity take over the old entity ID. The old entity moves
  to a free ``_alt`` ID; Home Assistant moves history and statistics along with every rename.

Every step is re-checked right before it runs, journaled, and the run stops at the first surprise.
"""

from __future__ import annotations

import asyncio
import contextlib
import copy
import hashlib
import inspect
import secrets
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Any

from homeassistant import loader
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.util.file import write_utf8_file_atomic
from homeassistant.util.yaml import dump, parse_yaml

from .cleanup import (
    BACKUP_KINDS,
    DEVICE_KINDS,
    EXECUTABLE_KINDS,
    METER_KINDS,
    PLAN_MAX_AGE_HOURS,
    REFERENCE_KINDS,
    REMOVAL_KINDS,
    device_fingerprint,
    device_support,
    get_main_device,
    judge_action,
    registry_fingerprint,
)
from .meter import analyse, prepare_meter, read_series, recorder_ready
from .references import (
    ENERGY_PARTS,
    SourceError,
    find_yaml_item,
    load_file,
    load_source,
    preview_replacement,
    rewrite,
    yaml_hash,
)

TOKEN_TTL = timedelta(minutes=5)
ID_FREE_TIMEOUT = 10.0  # seconds to wait until Home Assistant has removed a renamed entity's state
STATISTIC_KEYS = ("state", "sum", "min", "max", "mean")
BACKUP_TIMEOUT = 30 * 60  # seconds; large installations can take a while


class CleanupError(Exception):
    """A plan cannot be confirmed, executed or undone; the message code is user-facing."""


class StepAbort(Exception):
    """One step must not run; ``reason`` is the user-facing code recorded in the journal."""

    def __init__(self, reason: str, result: dict[str, Any] | None = None) -> None:
        super().__init__(reason)
        self.reason = reason
        # What was already changed and could not be put back; journalled so it is never lost.
        self.result = result


def _now() -> datetime:
    return datetime.now(UTC)


def _event(plan: dict[str, Any], kind: str, **detail: Any) -> None:
    """Append to the plan's audit log. Entries are only ever added."""
    plan["events"].append({"at": _now().isoformat(), "type": kind, **detail})


def _value(value: Any) -> Any:
    return getattr(value, "value", value)


def entity_restorable(hass: HomeAssistant, entry: Any) -> bool | None:
    """Whether a removed registry entry could be brought back (its config entry still exists)."""
    if entry is None:
        return None
    if entry.config_entry_id is None:
        return True
    return hass.config_entries.async_get_entry(entry.config_entry_id) is not None


def _restore_data(entry: Any) -> dict[str, Any]:
    """Everything needed to recreate a registry entry, stored in the journal before removal."""
    fields = (
        "entity_id",
        "platform",
        "unique_id",
        "config_entry_id",
        "config_subentry_id",
        "device_id",
        "area_id",
        "name",
        "icon",
        "original_name",
        "original_icon",
        "original_device_class",
        "device_class",
        "translation_key",
        "unit_of_measurement",
        "supported_features",
        "has_entity_name",
        "capabilities",
    )
    data = {name: getattr(entry, name, None) for name in fields}
    data.update(
        entity_category=_value(entry.entity_category),
        hidden_by=_value(entry.hidden_by),
        disabled_by=_value(entry.disabled_by),
        labels=sorted(entry.labels),
        aliases=sorted(entry.aliases),
    )
    return data


def _device_restore_data(entry: Any) -> dict[str, Any]:
    """The registry fields of a device that a restore needs, stored in the journal."""
    data = {
        name: getattr(entry, name, None)
        for name in (
            "id",
            "name",
            "name_by_user",
            "manufacturer",
            "model",
            "area_id",
            "via_device_id",
        )
    }
    data.update(
        identifiers=sorted(map(list, entry.identifiers)),
        connections=sorted(map(list, entry.connections)),
        config_entry_id=entry.config_entry_id,
        config_subentry_id=entry.config_subentry_id,
        config_entries=[entry.config_entry_id],  # as earlier versions journalled it
        labels=sorted(entry.labels),
        disabled_by=_value(entry.disabled_by),
    )
    return data


def _parameter_names(function: Any) -> set[str]:
    """The names a function takes, read from its code: ``inspect.signature`` evaluates the
    annotations on Python 3.14 and fails on names that Home Assistant imports only for typing."""
    code = getattr(getattr(function, "__func__", function), "__code__", None)
    if code is None:
        return set(inspect.signature(function).parameters)
    return set(code.co_varnames[: code.co_argcount + code.co_kwonlyargcount])


MAX_FILE_BACKUP = 512 * 1024  # larger files are not kept whole in the journal


def _bytes_hash(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()[:16]


def _write_yaml_item(
    path: str, kind: str, ref: str, expected_hash: str, item: Any
) -> tuple[str, dict[str, Any]]:
    """Blocking: replace one item in a YAML file if it is still as it was read.

    Returns the old item as text and, for files up to ``MAX_FILE_BACKUP``, the whole old file
    with the hash of the new one: writing the file again loses comments and formatting, so
    only the old file itself puts it back exactly.
    """
    data, _ = load_file(path)
    current = find_yaml_item(kind, data, ref)
    if current is None or yaml_hash(current) != expected_hash:
        raise StepAbort("source_changed")
    before = dump(current)
    raw = Path(path).read_bytes()
    if kind == "script":
        data[ref] = item
    else:
        data[next(i for i, existing in enumerate(data) if existing is current)] = item
    write_utf8_file_atomic(path, dump(data))
    extra: dict[str, Any] = {}
    if len(raw) <= MAX_FILE_BACKUP:
        try:
            extra = {
                "file_before": raw.decode("utf-8"),
                "file_after_hash": _bytes_hash(Path(path).read_bytes()),
            }
        except UnicodeDecodeError:
            extra = {}
    return before, extra


def _restore_yaml_file(path: str, text_before: str, expected_hash: str) -> bool:
    """Blocking: put the old file back byte for byte if it is still as Housekeeper wrote it."""
    if _bytes_hash(Path(path).read_bytes()) != expected_hash:
        return False
    write_utf8_file_atomic(path, text_before.encode("utf-8"), mode="wb")
    return True


class CleanupRunner:
    """Confirm, execute and undo plans, one at a time."""

    def __init__(self, hass: HomeAssistant, scanner: Any) -> None:
        self.hass = hass
        self.scanner = scanner
        self._tokens: dict[str, tuple[str, datetime, list[str]]] = {}
        self._cancel = False
        self._task: asyncio.Task[None] | None = None
        self.status: dict[str, Any] = {
            "running": False,
            "plan_id": None,
            "phase": None,
            "done": 0,
            "total": 0,
        }

    @property
    def running(self) -> bool:
        """Whether a plan is being executed or undone right now."""
        return bool(self.status["running"])

    def cancel(self) -> None:
        """Stop after the current step."""
        self._cancel = True

    def confirm(self, plan_id: str, acknowledged: list[str], user_id: str | None) -> dict[str, Any]:
        """Select the actions that may run and hand out a short-lived confirmation token."""
        plan = self._plan(plan_id)
        if self.scanner.warming_up:
            raise CleanupError("warming_up")
        if plan["status"] != "dry_run" or plan.get("run"):
            raise CleanupError("plan_not_open")
        age = _now() - datetime.fromisoformat(plan["created_at"])
        if age > timedelta(hours=PLAN_MAX_AGE_HOURS):
            raise CleanupError("plan_too_old")
        acknowledged_set = set(acknowledged)
        selected, needs_ack, skipped = [], [], []
        for action in plan["actions"]:
            if action["kind"] not in EXECUTABLE_KINDS or not action.get("executable"):
                skipped.append(action["object_id"])
            elif action["verdict"] == "ok" or action["object_id"] in acknowledged_set:
                selected.append(action["object_id"])
            else:
                needs_ack.append(action["object_id"])
        if not selected:
            raise CleanupError("nothing_to_do")
        token = secrets.token_urlsafe(16)
        self._tokens[plan_id] = (token, _now() + TOKEN_TTL, selected)
        plan["confirmed"] = {"at": _now().isoformat(), "user_id": user_id, "object_ids": selected}
        _event(plan, "confirmed", user_id=user_id, count=len(selected))
        self.scanner.journal.save()
        return {
            "plan_id": plan_id,
            "token": token,
            "expires_at": (_now() + TOKEN_TTL).isoformat(),
            "execute": selected,
            "removals": [
                a["object_id"]
                for a in plan["actions"]
                if a["object_id"] in selected and a["kind"] in REMOVAL_KINDS
            ],
            "rewrites": [
                a["object_id"]
                for a in plan["actions"]
                if a["object_id"] in selected and a["kind"] in REFERENCE_KINDS
            ],
            "migrations": [
                a["object_id"]
                for a in plan["actions"]
                if a["object_id"] in selected and a["kind"] in METER_KINDS
            ],
            "needs_acknowledgement": needs_ack,
            "skipped": skipped,
        }

    def start(self, plan_id: str, token: str, user_id: str | None) -> None:
        """Validate the token and run the plan in the background."""
        if self.running:
            raise CleanupError("busy")
        plan = self._plan(plan_id)
        if self.scanner.warming_up:
            raise CleanupError("warming_up")
        saved = self._tokens.pop(plan_id, None)
        if saved is None or not secrets.compare_digest(saved[0], token) or saved[1] < _now():
            raise CleanupError("bad_token")
        if plan["status"] != "dry_run" or plan.get("run"):
            raise CleanupError("plan_not_open")
        self._cancel = False
        self.scanner.paused = True
        self.status = {
            "running": True,
            "plan_id": plan_id,
            "phase": "starting",
            "done": 0,
            "total": len(saved[2]),
        }
        self._task = self.hass.async_create_background_task(
            self._run(plan, saved[2], user_id), "HA Housekeeper cleanup run"
        )

    async def _run(self, plan: dict[str, Any], object_ids: list[str], user_id: str | None) -> None:
        journal = self.scanner.journal
        plan["status"] = "running"
        plan["run"] = {"started_at": _now().isoformat(), "user_id": user_id, "finished_at": None}
        _event(plan, "started", user_id=user_id)
        journal.save()
        try:
            by_id = {action["object_id"]: action for action in plan["actions"]}
            if any(by_id[object_id]["kind"] in BACKUP_KINDS for object_id in object_ids):
                await self._backup(plan)
            if plan["status"] == "running":
                await self._execute(plan, object_ids)
        except Exception as err:  # Never leave the plan in "running".
            _event(plan, "failed", error=f"{type(err).__name__}: {err}")
            plan["status"] = "partial" if plan["executed"] else "aborted"
        finally:
            plan["run"]["finished_at"] = _now().isoformat()
            self.scanner.paused = False
            self.status = {
                "running": False,
                "plan_id": plan["plan_id"],
                "phase": None,
                "done": 0,
                "total": 0,
            }
            journal.save()
        await self._verify(plan)

    async def _backup(self, plan: dict[str, Any]) -> None:
        """Create a Home Assistant backup with the user's own backup settings and wait for it.

        ``async_create_automatic_backup`` returns only after the backup has finished and raises if
        it failed, so reaching the next line means the backup exists.
        """
        self.status["phase"] = "backup"
        plan["status"] = "backup"
        self.scanner.journal.save()
        try:
            from homeassistant.components.backup import async_get_manager

            manager = async_get_manager(self.hass)
        except Exception:
            self._backup_failed(plan, "backup_unavailable")
            return
        if not manager.config.data.create_backup.agent_ids:
            self._backup_failed(plan, "no_backup_agent")
            return
        _event(plan, "backup_started")
        try:
            async with asyncio.timeout(BACKUP_TIMEOUT):
                created = await manager.async_create_automatic_backup()
        except Exception as err:
            self._backup_failed(plan, "backup_failed", error=f"{type(err).__name__}: {err}")
            return
        plan["backup"] = {
            "job_id": getattr(created, "backup_job_id", None),
            "at": _now().isoformat(),
        }
        _event(plan, "backup_done", job_id=plan["backup"]["job_id"])
        plan["status"] = "running"
        self.scanner.journal.save()

    def _backup_failed(self, plan: dict[str, Any], reason: str, **detail: Any) -> None:
        """Without a verified backup nothing is removed or disabled."""
        _event(plan, "aborted", reason=reason, **detail)
        for action in plan["actions"]:
            action.setdefault(
                "result", {"state": "not_run", "at": _now().isoformat(), "reason": reason}
            )
        plan["status"] = "aborted"

    async def _execute(self, plan: dict[str, Any], object_ids: list[str]) -> None:
        self.status["phase"] = "running"
        snapshot = await self.scanner.async_scan()
        context = {
            "snapshot": snapshot,
            "entities": {
                o["object_id"]: o for o in snapshot["objects"] if o["object_type"] == "entity"
            },
            "devices": {
                o["object_id"]: o for o in snapshot["objects"] if o["object_type"] == "device"
            },
            "quarantine": {q["object_id"]: q["since"] for q in snapshot.get("quarantine", [])},
            "acknowledged": set(object_ids),
        }
        by_id = {action["object_id"]: action for action in plan["actions"]}
        for index, object_id in enumerate(object_ids):
            action = by_id[object_id]
            if self._cancel:
                self._abort(plan, "cancelled", object_ids[index:])
                return
            reason = await self._precheck(action, context)
            if reason:
                self._abort(plan, reason, object_ids[index:], object_id)
                return
            try:
                result, event = await self._perform(plan, action)
            except StepAbort as stop:
                if stop.result is None:
                    self._abort(plan, stop.reason, object_ids[index:], object_id)
                    return
                # Something stayed changed: keep it as a done step so an undo can retry it.
                action["result"] = {
                    "state": "done",
                    "at": _now().isoformat(),
                    "stopped": stop.reason,
                    **stop.result,
                }
                _event(plan, "rollback_incomplete", object_id=object_id, reason=stop.reason)
                plan["executed"] = True
                self._abort(plan, stop.reason, object_ids[index + 1 :], object_id)
                return
            action["result"] = {"state": "done", "at": _now().isoformat(), **result}
            _event(plan, event, object_id=object_id)
            plan["executed"] = True
            self.status["done"] = index + 1
            self.scanner.journal.save()
            if stopped := action["result"].get("stopped"):
                self._abort(plan, stopped, object_ids[index + 1 :], object_id)
                return
        plan["status"] = "executed"

    async def _perform(self, plan: dict[str, Any], action: dict[str, Any]) -> tuple[dict, str]:
        """Carry out one checked action; returns what to journal and the event name."""
        kind, object_id = action["kind"], action["object_id"]
        if kind == "remove_entity":
            registry = er.async_get(self.hass)
            entry = registry.async_get(object_id)
            restore = _restore_data(entry)
            registry.async_remove(object_id)
            return {"before": registry_fingerprint(entry), "restore": restore}, "removed"
        if kind == "disable_entity":
            registry = er.async_get(self.hass)
            entry = registry.async_get(object_id)
            updated = registry.async_update_entity(
                object_id, disabled_by=er.RegistryEntryDisabler.USER
            )
            return {
                "before": registry_fingerprint(entry),
                "after": registry_fingerprint(updated),
            }, "disabled"
        if kind == "disable_device":
            registry = dr.async_get(self.hass)
            entry = get_main_device(registry, object_id)
            updated = registry.async_update_device(
                object_id, disabled_by=dr.DeviceEntryDisabler.USER
            )
            return {
                "before": device_fingerprint(entry),
                "after": device_fingerprint(updated),
            }, "device_disabled"
        if kind == "remove_device":
            return await self._remove_device(action), "device_removed"
        if kind == "forget_device":
            return await self._forget_device(action), "device_forgotten"
        if kind in METER_KINDS:
            return await self._migrate_meter(action), "meter_migrated"
        return await self._replace_references(action), "references_replaced"

    # -- devices ---------------------------------------------------------------------------

    def _device_entities(self, device_id: str) -> list[Any]:
        registry = er.async_get(self.hass)
        return [e for e in registry.entities.values() if e.device_id == device_id]

    def _device_restore(self, entry: Any) -> dict[str, Any]:
        """Everything needed to recreate a device and the entities that go with it."""
        data = _device_restore_data(entry)
        data["entities"] = [_restore_data(e) for e in self._device_entities(entry.id)]
        return data

    async def _remove_device(self, action: dict[str, Any]) -> dict[str, Any]:
        """Regular removal: the integration behind the device is asked and may refuse."""
        registry = dr.async_get(self.hass)
        entry = get_main_device(registry, action["object_id"])
        restore = self._device_restore(entry)
        config_entry = self.hass.config_entries.async_get_entry(entry.config_entry_id)
        if config_entry is None or not config_entry.supports_remove_device:
            raise StepAbort("integration_no_support")
        try:
            integration = await loader.async_get_integration(self.hass, config_entry.domain)
            component = await integration.async_get_component()
            allowed = await component.async_remove_config_entry_device(
                self.hass, config_entry, entry
            )
        except Exception as err:
            raise StepAbort("integration_no_support") from err
        if not allowed:
            raise StepAbort("rejected_by_integration")
        if registry.async_get(entry.id):
            registry.async_remove_device(entry.id)
        return {"before": device_fingerprint(entry), "restore": restore}

    async def _forget_device(self, action: dict[str, Any]) -> dict[str, Any]:
        """Force Forget: drop the registry entry, then let the integrations load again."""
        registry = dr.async_get(self.hass)
        entry = get_main_device(registry, action["object_id"])
        restore = self._device_restore(entry)
        registry.async_remove_device(entry.id)
        reloaded = []
        for config_entry_id in restore["config_entries"]:
            if self.hass.config_entries.async_get_entry(config_entry_id) is None:
                continue
            try:
                await self.hass.config_entries.async_reload(config_entry_id)
                reloaded.append(config_entry_id)
            except Exception as err:  # the forget itself succeeded; say that the reload did not
                restore.setdefault("reload_errors", []).append(f"{type(err).__name__}: {err}")
        return {"before": device_fingerprint(entry), "restore": restore, "reloaded": reloaded}

    def _restore_device(self, data: dict[str, Any]) -> str:
        """Recreate a removed device and its entities from the journal, as far as possible.

        Home Assistant itself remembers a deleted device and reapplies area, name and labels
        when the same identifiers are created again; Housekeeper reapplies them as well. Whether
        entities come back depends on the integration, so those that did not are restored from
        the journal.
        """
        registry = dr.async_get(self.hass)
        config_entry_id = data.get("config_entry_id")
        if config_entry_id is None:
            # Journalled before a device belonged to a single config entry.
            legacy = data.get("config_entries") or []
            if len(legacy) != 1:
                return "conflict_unrestorable"
            config_entry_id = legacy[0]
        if self.hass.config_entries.async_get_entry(config_entry_id) is None:
            return "conflict_unrestorable"
        if registry.async_get(data["id"]) is not None:
            return "conflict_taken"
        try:
            device = registry.async_get_or_create(
                config_entry_id=config_entry_id,
                identifiers={tuple(i) for i in data["identifiers"]},
                connections={tuple(c) for c in data["connections"]},
                **(
                    {"config_subentry_id": data["config_subentry_id"]}
                    if data.get("config_subentry_id")
                    else {}
                ),
                **{
                    key: data[key]
                    for key in ("manufacturer", "model", "name")
                    if data.get(key) is not None
                },
            )
            registry.async_update_device(
                device.id,
                area_id=data["area_id"],
                name_by_user=data["name_by_user"],
                labels=set(data["labels"]),
                disabled_by=dr.DeviceEntryDisabler(data["disabled_by"])
                if data["disabled_by"]
                else None,
            )
        except Exception:
            return "conflict_unrestorable"
        entity_registry = er.async_get(self.hass)
        for entity in data["entities"]:
            if entity_registry.async_get(entity["entity_id"]) is None:
                self._restore(entity_registry, entity["entity_id"], entity)
        return "undone"

    # -- meters ----------------------------------------------------------------------------

    async def _migrate_meter(self, action: dict[str, Any]) -> dict[str, Any]:
        """Join the statistics, then let the new entity take the old ID, as the mode asks.

        What was written stays in the result even if a later part stops, so it is never lost.
        """
        mode = action["mode"]
        result: dict[str, Any] = {
            "before": action["fingerprint"],
            "mode": mode,
            "statistics": None,
            "take_id": None,
        }
        if mode in {"both", "statistics"}:
            result["statistics"] = await self._join_statistics(action)
            if not result["statistics"]["verified"]:
                result["stopped"] = "statistics_failed"
                return result
        if mode in {"both", "id"}:
            try:
                result["take_id"] = await self._take_id(action)
            except StepAbort as stop:
                if stop.result is not None:  # the old entity could not be put back
                    result["take_id"] = stop.result
                    result["cause"] = stop.reason
                    result["stopped"] = "rollback_incomplete"
                elif result["statistics"] is None:
                    raise
                else:
                    result["stopped"] = stop.reason
        return result

    async def _join_statistics(self, action: dict[str, Any]) -> dict[str, Any]:
        """Copy the old hourly rows in front of the new series and shift the new sums."""
        from homeassistant.components.recorder import get_instance
        from homeassistant.components.recorder.statistics import async_import_statistics

        old, new = action["object_id"], action["target"]
        instance = get_instance(self.hass)
        old_meta, old_rows = await instance.async_add_executor_job(read_series, self.hass, old)
        new_meta, new_rows = await instance.async_add_executor_job(read_series, self.hass, new)
        analysis = analyse(old_meta, old_rows, new_meta, new_rows)
        if analysis["hash"] != action["statistics"]["hash"]:
            raise StepAbort("statistics_changed")
        blocking = {"stats_missing_old", "stats_unit_differs", "stats_type_differs"}
        if blocking & set(analysis["reasons"]) or not analysis["import_count"]:
            raise StepAbort("statistics_changed")
        switch = new_rows[0]["start"] if new_rows else None
        rows = [row for row in old_rows if switch is None or row["start"] < switch]
        metadata = {
            key: value for key, value in (new_meta or old_meta or {}).items() if key != "has_mean"
        }
        metadata.update(statistic_id=new, source="recorder")
        if new_meta is None:
            metadata["name"] = None
        data = []
        for row in rows:
            point: dict[str, Any] = {"start": datetime.fromtimestamp(row["start"], UTC)}
            point.update({key: row[key] for key in STATISTIC_KEYS if row.get(key) is not None})
            point["last_reset"] = (
                datetime.fromtimestamp(row["last_reset"], UTC) if row.get("last_reset") else None
            )
            data.append(point)
        async_import_statistics(self.hass, metadata, data)
        offset = analysis["offset"]
        if offset is not None and switch is not None:
            instance.async_adjust_statistics(
                new,
                datetime.fromtimestamp(switch, UTC),
                offset,
                metadata.get("unit_of_measurement"),
            )
        await instance.async_block_till_done()
        _, after = await instance.async_add_executor_job(read_series, self.hass, new)
        # The new series is live: an hourly value compiled meanwhile is no failure.
        present = {row["start"] for row in after}
        verified = (
            bool(after)
            and after[0]["start"] == rows[0]["start"]
            and all(row["start"] in present for row in (*rows, *new_rows))
        )
        if verified and offset is not None and new_rows:
            moved = next((r for r in after if r["start"] == switch), None)
            verified = (
                moved is not None
                and abs((moved.get("sum") or 0) - ((new_rows[0].get("sum") or 0) + offset)) < 1e-6
            )
        return {
            "imported": len(rows),
            "dropped_overlap": analysis["dropped_overlap"],
            "offset": offset,
            "first": rows[0]["start"],
            "switch": switch,
            "unit": metadata.get("unit_of_measurement"),
            "series_id": new,
            "verified": verified,
        }

    async def _wait_free(self, entity_id: str) -> bool:
        """Wait until the state of a renamed entity is gone, so its ID can be taken."""
        waited = 0.0
        while self.hass.states.get(entity_id) is not None:
            if waited >= ID_FREE_TIMEOUT:
                return False
            await asyncio.sleep(0.1)
            waited += 0.1
        return True

    async def _take_id(self, action: dict[str, Any]) -> dict[str, Any]:
        """Move the old entity to its ``_alt`` ID, then rename the new entity to the old ID."""
        registry = er.async_get(self.hass)
        old, new, alt = action["object_id"], action["target"], action["alt_id"]
        old_entry, new_entry = registry.async_get(old), registry.async_get(new)
        if old_entry is None or new_entry is None:
            raise StepAbort("entity_gone")
        if registry.async_get(alt) is not None or self.hass.states.get(alt) is not None:
            raise StepAbort("alt_id_taken")
        try:
            registry.async_update_entity(old, new_entity_id=alt)
        except ValueError as err:
            raise StepAbort("id_takeover_failed") from err
        try:
            if not await self._wait_free(old):
                raise StepAbort("id_not_freed")
            registry.async_update_entity(new, new_entity_id=old)
        except (StepAbort, ValueError) as err:
            reason = err.reason if isinstance(err, StepAbort) else "id_takeover_failed"
            if await self._put_back(alt, old):
                raise StepAbort(reason) from err
            # The old entity still sits under its other ID: journal that instead of hiding it.
            raise StepAbort(
                reason,
                {
                    "old_id": old,
                    "alt_id": alt,
                    "new_id": new,
                    "partial": True,
                    "old_after": registry_fingerprint(registry.async_get(alt)),
                },
            ) from err
        if recorder_ready(self.hass):
            from homeassistant.components.recorder import get_instance

            await get_instance(self.hass).async_block_till_done()
        return {
            "old_id": old,
            "alt_id": alt,
            "new_id": new,
            "new_unique_id": new_entry.unique_id,
            "old_after": registry_fingerprint(registry.async_get(alt)),
            "new_after": registry_fingerprint(registry.async_get(old)),
        }

    async def _put_back(self, moved_id: str, holder_id: str) -> bool:
        """Give a moved entity the ID ``holder_id`` again; wait for the old state to go first."""
        registry = er.async_get(self.hass)
        await self._wait_free(holder_id)
        try:
            registry.async_update_entity(moved_id, new_entity_id=holder_id)
        except ValueError:
            return False
        return True

    async def _undo_take_id(self, take: dict[str, Any]) -> str:
        """Give both entities their IDs back while they are exactly as Housekeeper left them."""
        registry = er.async_get(self.hass)
        if take.get("partial"):
            # Only the old entity was moved; the new one never took its ID.
            moved = registry.async_get(take["alt_id"])
            if moved is None:
                return "conflict_gone"
            if registry_fingerprint(moved) != take["old_after"]:
                return "conflict_changed"
            await self._wait_free(take["old_id"])
            if registry.async_get(take["old_id"]) is not None or (
                self.hass.states.get(take["old_id"]) is not None
            ):
                return "conflict_taken"
            return (
                "undone"
                if await self._put_back(take["alt_id"], take["old_id"])
                else ("conflict_unrestorable")
            )
        holder, moved = registry.async_get(take["old_id"]), registry.async_get(take["alt_id"])
        if holder is None or moved is None:
            return "conflict_gone"
        if (
            registry_fingerprint(holder) != take["new_after"]
            or registry_fingerprint(moved) != take["old_after"]
        ):
            return "conflict_changed"
        if registry.async_get(take["new_id"]) is not None or (
            self.hass.states.get(take["new_id"]) is not None
        ):
            return "conflict_taken"
        registry.async_update_entity(take["old_id"], new_entity_id=take["new_id"])
        if not await self._wait_free(take["old_id"]) or not await self._put_back(
            take["alt_id"], take["old_id"]
        ):
            # Put the new entity back where it was, as it is the one that moved first.
            if await self._put_back(take["new_id"], take["old_id"]):
                return "conflict_unrestorable"
            # Neither could be moved: say where the new entity sits now.
            take["stuck"] = {"entity_at": take["new_id"], "should_be": take["old_id"]}
            return "conflict_unrestorable"
        if recorder_ready(self.hass):
            from homeassistant.components.recorder import get_instance

            await get_instance(self.hass).async_block_till_done()
        return "undone"

    # -- references ------------------------------------------------------------------------

    async def _replace_references(self, action: dict[str, Any]) -> dict[str, Any]:
        """Rewrite every source of the plan; on a failure put back what was already written."""
        old, new = action["object_id"], action["target"]
        written: list[dict[str, Any]] = []
        snapshot = self.scanner.snapshot
        try:
            for planned in action["sources"]:
                if not planned["writable"] or not planned["change_count"]:
                    continue
                loaded = await load_source(self.hass, snapshot, planned["source"])
                if loaded["hash"] != planned["hash"]:
                    raise StepAbort("source_changed")
                item, changes, _ = rewrite(loaded["item"], old, new)
                if not changes:
                    raise StepAbort("source_changed")
                before, extra = await self._write_source(loaded, item, planned["hash"])
                # Registered at once: from here on the source is changed, so every failure path
                # must be able to put it back, even if reading it again fails.
                source = {
                    "source": loaded["source"],
                    "type": planned["type"],
                    "format": loaded["format"],
                    "before": before,
                    "after_hash": None,
                    "change_count": len(changes),
                    "state": "written",
                    **extra,
                }
                written.append(source)
                # What Home Assistant now holds is the reference for a later undo: it may
                # normalise what was written (the Energy dashboard adds fields).
                after = await load_source(self.hass, snapshot, planned["source"])
                source["after_hash"] = after["hash"]
                source["state"] = "done"
                await self._reload(loaded)
        except (StepAbort, SourceError) as err:
            reason = err.reason if isinstance(err, StepAbort) else str(err)
            await self._roll_back(written, reason, action)
            raise StepAbort(reason) from err
        except Exception as err:
            await self._roll_back(written, "source_write_failed", action)
            raise StepAbort("source_write_failed") from err
        return {"before": action["fingerprint"], "sources": written}

    async def _roll_back(
        self, written: list[dict[str, Any]], reason: str, action: dict[str, Any]
    ) -> None:
        """Put back what was written, newest first; if a source stays changed, say so.

        A source that cannot be put back is not hidden behind a plain abort: the step is
        journalled with it, so the person sees it and a later undo can try again.
        """
        outcomes = [await self._revert_source(source) for source in reversed(written)]
        if any(outcome != "undone" for outcome in outcomes):
            for source, outcome in zip(reversed(written), outcomes, strict=True):
                source["rollback"] = outcome
            raise StepAbort(
                "rollback_incomplete",
                {"before": action["fingerprint"], "sources": written, "cause": reason},
            )

    async def _write_source(
        self, loaded: dict[str, Any], item: Any, expected_hash: str
    ) -> tuple[Any, dict[str, Any]]:
        """Write one rewritten configuration; return the text/value it replaces and extras to keep."""
        fmt = loaded["format"]
        if fmt == "yaml":
            kind = loaded["type"]
            return await self.hass.async_add_executor_job(
                _write_yaml_item, loaded["path"], kind, loaded["ref"], expected_hash, item
            )
        if fmt == "dashboard":
            before = copy.deepcopy(loaded["item"])
            await loaded["dashboard"].async_save(item)
            return before, {}
        from homeassistant.components.energy.data import async_get_manager

        manager = await async_get_manager(self.hass)
        before = copy.deepcopy(
            {key: manager.data[key] for key in ENERGY_PARTS if manager.data and key in manager.data}
        )
        await manager.async_update(item)
        return before, {}

    async def _reload(self, loaded: dict[str, Any]) -> None:
        """Let Home Assistant read a rewritten file. Dashboards and Energy apply at once."""
        if loaded["format"] == "yaml":
            await self.hass.services.async_call(loaded["type"], "reload", blocking=True)

    async def _revert_source(self, source: dict[str, Any]) -> str:
        """Put one rewritten source back while it is exactly as Housekeeper left it."""
        try:
            loaded = await load_source(self.hass, self.scanner.snapshot, source["source"])
        except SourceError:
            return "conflict_gone"
        # Without a verified hash (reading it after the write failed) the file as it is now
        # is the only reference there is.
        if source.get("file_before") is not None:
            try:
                restored = await self.hass.async_add_executor_job(
                    _restore_yaml_file,
                    loaded["path"],
                    source["file_before"],
                    source["file_after_hash"],
                )
            except Exception:
                return "conflict_unrestorable"
            if restored:
                source["state"] = "undone"
                source["restored_as"] = "file"
                # The old file is back; a failing reload is Home Assistant's to report.
                with contextlib.suppress(Exception):
                    await self._reload(loaded)
                return "undone"
        expected = source["after_hash"] or loaded["hash"]
        if loaded["hash"] != expected:
            return "conflict_changed"
        original = parse_yaml(source["before"]) if source["format"] == "yaml" else source["before"]
        try:
            await self._write_source(loaded, original, expected)
            await self._reload(loaded)
        except Exception:
            return "conflict_unrestorable"
        source["state"] = "undone"
        source["restored_as"] = "item"  # the file changed since, so only this item was put back
        return "undone"

    async def _precheck(self, action: dict[str, Any], context: dict[str, Any]) -> str | None:
        """Re-check one action against the live state. Returns an abort reason or None."""
        kind, object_id, snapshot = action["kind"], action["object_id"], context["snapshot"]
        verdict_args: dict[str, Any] = {}
        restorable = None
        if kind in DEVICE_KINDS:
            registry = dr.async_get(self.hass)
            entry = get_main_device(registry, object_id)
            if entry is None:
                # A child device (or a composite ID) is still there but not ours to change.
                return "device_unsupported" if registry.async_get(object_id) else "device_gone"
            if (
                action.get("fingerprint") is None
                or device_fingerprint(entry) != action["fingerprint"]
            ):
                return "device_changed"
            verdict_args = {
                "devices": context["devices"],
                "support": device_support(self.hass, entry),
            }
        elif kind in METER_KINDS:
            if not recorder_ready(self.hass) and action["mode"] != "id":
                return "no_recorder"
            meter = await prepare_meter(self.hass, object_id, action["target"], action["mode"])
            if action.get("fingerprint") is None or meter["fingerprint"] != action["fingerprint"]:
                return "meter_changed"
            verdict_args = {
                "target": action["target"],
                "meter": {**meter, "mode": action["mode"]},
            }
        elif kind in REFERENCE_KINDS:
            fingerprint, sources = await preview_replacement(
                self.hass, snapshot, object_id, action["target"]
            )
            if action.get("fingerprint") is None or fingerprint != action["fingerprint"]:
                return "source_changed"
            action["sources"] = sources
            verdict_args = {"target": action["target"], "sources": sources}
        else:
            entry = er.async_get(self.hass).async_get(object_id)
            if entry is None:
                return "entity_gone"
            if (
                action.get("fingerprint") is None
                or registry_fingerprint(entry) != action["fingerprint"]
            ):
                return "entity_changed"
            restorable = entity_restorable(self.hass, entry)
        verdict = judge_action(
            kind,
            object_id,
            context["entities"],
            snapshot["edges"],
            context["quarantine"],
            restorable,
            _now(),
            **verdict_args,
        )
        if verdict["verdict"] == "blocked":
            return "now_blocked"
        if verdict["verdict"] == "review" and object_id not in context["acknowledged"]:
            return "needs_acknowledgement"
        return None

    def _abort(
        self, plan: dict[str, Any], reason: str, remaining: list[str], object_id: str | None = None
    ) -> None:
        by_id = {action["object_id"]: action for action in plan["actions"]}
        for remaining_id in remaining:
            by_id[remaining_id]["result"] = {
                "state": "not_run",
                "at": _now().isoformat(),
                "reason": reason if remaining_id == (object_id or remaining[0]) else "aborted",
            }
        _event(plan, "aborted", reason=reason, object_id=object_id or (remaining or [None])[0])
        plan["status"] = "partial" if plan["executed"] else "aborted"

    async def _verify(self, plan: dict[str, Any]) -> None:
        """Scan again and check that the changed objects are in the expected state."""
        before = {
            f["key"] for f in (self.scanner.snapshot or {}).get("findings", []) if not f["ignored"]
        }
        try:
            snapshot = await self.scanner.async_scan()
        except Exception as err:
            plan["verification"] = {
                "ok": False,
                "checks": [{"check": "scan", "ok": False, "error": str(err)}],
            }
            self.scanner.journal.save()
            return
        registry = er.async_get(self.hass)
        device_registry = dr.async_get(self.hass)
        recurring = {r["device_id"] for r in snapshot.get("recurring_devices", [])}
        checks = []
        for action in plan["actions"]:
            if action.get("result", {}).get("state") != "done":
                continue
            kind, object_id = action["kind"], action["object_id"]
            if kind == "remove_entity":
                entry = registry.async_get(object_id)
                ok = entry is None and self.hass.states.get(object_id) is None
                checks.append({"check": "removed", "object_id": object_id, "ok": ok})
            elif kind == "disable_entity":
                entry = registry.async_get(object_id)
                ok = entry is not None and entry.disabled_by is not None
                checks.append({"check": "disabled", "object_id": object_id, "ok": ok})
            elif kind == "disable_device":
                entry = device_registry.async_get(object_id)
                ok = entry is not None and entry.disabled_by is not None
                checks.append({"check": "device_disabled", "object_id": object_id, "ok": ok})
            elif kind in {"remove_device", "forget_device"}:
                gone = device_registry.async_get(object_id) is None
                checks.append({"check": "device_removed", "object_id": object_id, "ok": gone})
                if kind == "forget_device":
                    checks.append(
                        {
                            "check": "not_recurring",
                            "object_id": object_id,
                            "ok": not recurring,
                        }
                    )
            elif kind in METER_KINDS:
                checks.extend(await self._verify_meter(action))
            else:
                done = {
                    s["source"] for s in action["result"]["sources"] if s.get("state") != "undone"
                }
                still = [
                    e
                    for e in snapshot["edges"]
                    if e["source"] in done
                    and e["target"] == f"entity:{object_id}"
                    and e.get("confidence", "certain") == "certain"
                ]
                checks.append(
                    {"check": "references_replaced", "object_id": object_id, "ok": not still}
                )
        new_broken = [
            f["key"]
            for f in snapshot["findings"]
            if f["classification"] == "broken_reference"
            and not f["ignored"]
            and f["key"] not in before
        ]
        checks.append(
            {"check": "no_new_broken_references", "ok": not new_broken, "count": len(new_broken)}
        )
        plan["verification"] = {"ok": all(c["ok"] for c in checks), "checks": checks}
        if plan["status"] == "executed" and plan["verification"]["ok"]:
            plan["status"] = "verified"
        _event(plan, "verified", ok=plan["verification"]["ok"])
        self.scanner.journal.save()

    async def _verify_meter(self, action: dict[str, Any]) -> list[dict[str, Any]]:
        result, checks = action["result"], []
        object_id = action["object_id"]
        if (take := result.get("take_id")) and not take.get("partial"):
            registry = er.async_get(self.hass)
            holder, moved = registry.async_get(take["old_id"]), registry.async_get(take["alt_id"])
            ok = (
                holder is not None
                and holder.unique_id == take["new_unique_id"]
                and moved is not None
                and registry.async_get(take["new_id"]) is None
            )
            checks.append({"check": "meter_id_taken", "object_id": object_id, "ok": ok})
        if stats := result.get("statistics"):
            take = result.get("take_id")
            series = take["old_id"] if take and not take.get("partial") else None
            series = series or stats["series_id"]
            ok = False
            if recorder_ready(self.hass):
                from homeassistant.components.recorder import get_instance

                _, rows = await get_instance(self.hass).async_add_executor_job(
                    read_series, self.hass, series
                )
                ok = bool(stats["verified"]) and len(rows) >= stats["imported"]
                ok = ok and bool(rows) and rows[0]["start"] == stats["first"]
            checks.append({"check": "meter_statistics", "object_id": object_id, "ok": ok})
        return checks

    async def undo(self, plan_id: str, object_ids: list[str] | None) -> dict[str, Any]:
        """Revert steps that are still exactly as Housekeeper left them."""
        if self.running:
            raise CleanupError("busy")
        plan = self._plan(plan_id)
        registry = er.async_get(self.hass)
        results = []
        for action in plan["actions"]:
            result = action.get("result") or {}
            if result.get("state") != "done" or (
                object_ids and action["object_id"] not in object_ids
            ):
                continue
            kind = action["kind"]
            if kind == "remove_entity":
                outcome = self._restore(registry, action["object_id"], result["restore"])
            elif kind in {"remove_device", "forget_device"}:
                outcome = self._restore_device(result["restore"])
            elif kind == "disable_device":
                outcome = self._reenable_device(action["object_id"], result)
            elif kind in REFERENCE_KINDS:
                outcome = await self._undo_references(result)
            elif kind in METER_KINDS:
                outcome = await self._undo_meter(result)
            else:
                outcome = self._reenable(registry, action["object_id"], result)
            if outcome == "undone":
                result["state"] = "undone"
                result["undone_at"] = _now().isoformat()
                _event(
                    plan,
                    "restored" if kind in REMOVAL_KINDS else "undone",
                    object_id=action["object_id"],
                )
            results.append({"object_id": action["object_id"], "outcome": outcome})
        if any(r["outcome"] == "undone" for r in results):
            open_actions = [
                a for a in plan["actions"] if (a.get("result") or {}).get("state") == "done"
            ]
            plan["status"] = "partially_undone" if open_actions else "undone"
        self.scanner.journal.save()
        if any(r["outcome"] == "undone" for r in results):
            # Refresh the inventory so the quarantine list is current; the undo itself succeeded.
            with contextlib.suppress(Exception):
                await self.scanner.async_scan()
        return {"results": results, "status": plan["status"]}

    async def _undo_meter(self, result: dict[str, Any]) -> str:
        """Only the ID takeover can be undone; joined statistics need the backup."""
        if not result.get("take_id"):
            return "conflict_statistics"
        outcome = await self._undo_take_id(result["take_id"])
        if outcome == "undone" and result.get("statistics"):
            result["statistics_kept"] = True
        return outcome

    async def _undo_references(self, result: dict[str, Any]) -> str:
        outcomes = [
            await self._revert_source(source)
            for source in result["sources"]
            if source.get("state") != "undone"
        ]
        failed = [o for o in outcomes if o != "undone"]
        if not failed:
            return "undone"
        return failed[0] if len(failed) == len(outcomes) else "conflict_partial"

    def _reenable_device(self, device_id: str, result: dict[str, Any]) -> str:
        registry = dr.async_get(self.hass)
        entry = registry.async_get(device_id)
        if entry is None:
            return "conflict_gone"
        if device_fingerprint(entry) != result["after"]:
            return "conflict_changed"
        registry.async_update_device(device_id, disabled_by=None)
        return "undone"

    @staticmethod
    def _reenable(registry: Any, object_id: str, result: dict[str, Any]) -> str:
        entry = registry.async_get(object_id)
        if entry is None:
            return "conflict_gone"
        if registry_fingerprint(entry) != result["after"]:
            return "conflict_changed"
        registry.async_update_entity(object_id, disabled_by=None)
        return "undone"

    def _restore(self, registry: Any, object_id: str, data: dict[str, Any]) -> str:
        """Recreate a removed registry entry from the journal. The entity stays quarantined."""
        if registry.async_get(object_id) is not None:
            return "conflict_taken"
        config_entry = None
        if data.get("config_entry_id"):
            config_entry = self.hass.config_entries.async_get_entry(data["config_entry_id"])
            if config_entry is None:
                return "conflict_unrestorable"
        domain, _, name = data["entity_id"].partition(".")
        try:
            created = registry.async_get_or_create(
                domain,
                data["platform"],
                data["unique_id"],
                suggested_object_id=name,
                disabled_by=er.RegistryEntryDisabler(data["disabled_by"])
                if data["disabled_by"]
                else None,
                hidden_by=er.RegistryEntryHider(data["hidden_by"]) if data["hidden_by"] else None,
                **self._creation_kwargs(registry, data, config_entry),
            )
        except Exception:
            return "conflict_unrestorable"
        if created.entity_id != data["entity_id"]:
            registry.async_remove(created.entity_id)  # the ID is taken: do not leave a stray entry
            return "conflict_taken"
        registry.async_update_entity(
            created.entity_id,
            name=data["name"],
            icon=data["icon"],
            area_id=data["area_id"],
            device_class=data["device_class"],
            labels=set(data["labels"]),
            aliases=set(data["aliases"]),
        )
        return "undone"

    @staticmethod
    def _creation_kwargs(registry: Any, data: dict[str, Any], config_entry: Any) -> dict[str, Any]:
        """Only pass what this Home Assistant version accepts; older or newer builds differ."""
        wanted = {
            "config_entry": config_entry,
            "config_subentry_id": data.get("config_subentry_id"),
            "device_id": data.get("device_id"),
            "capabilities": data.get("capabilities"),
            "original_name": data.get("original_name"),
            "original_icon": data.get("original_icon"),
            "original_device_class": data.get("original_device_class"),
            "translation_key": data.get("translation_key"),
            "unit_of_measurement": data.get("unit_of_measurement"),
            "supported_features": data.get("supported_features"),
            "has_entity_name": data.get("has_entity_name"),
            "entity_category": er.EntityCategory(data["entity_category"])
            if data.get("entity_category")
            else None,
        }
        accepted = _parameter_names(registry.async_get_or_create)
        return {
            key: value for key, value in wanted.items() if key in accepted and value is not None
        }

    def _plan(self, plan_id: str) -> dict[str, Any]:
        plan = self.scanner.journal.get(plan_id)
        if plan is None:
            raise CleanupError("not_found")
        return plan
