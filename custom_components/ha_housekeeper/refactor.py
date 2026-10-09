"""Mechanical improvements of one automation: small, exact edits that never rewrite logic.

``propose`` looks at the configuration and names what could be improved; ``apply`` makes exactly one
named edit and returns the new configuration with a list of what changed. Templates, conditions and
actions are never touched. A fix needs values from the person where a value cannot be known
(a description). Writing, validation and undo are the cleanup plan's job.
"""

from __future__ import annotations

import copy
import json
from typing import Any

from homeassistant.components.automation.config import async_validate_config_item
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import REFACTOR_STORAGE_KEY, STORAGE_VERSION
from .references import MAX_LISTED, SourceError, load_source, text_hash

FIXES = ("add_description", "remove_duplicate_triggers")
DESCRIPTION_MAX = 300
TRIGGER_KEYS = ("triggers", "trigger")


class RefactorStore:
    """The switch for refactoring (experimental, off until the person turns it on)."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, REFACTOR_STORAGE_KEY)
        self.enabled = False

    async def async_load(self) -> None:
        data = await self._store.async_load()
        self.enabled = isinstance(data, dict) and data.get("enabled") is True

    def set_enabled(self, enabled: bool) -> None:
        self.enabled = enabled
        self._store.async_delay_save(lambda: {"enabled": self.enabled}, 5)


def _trigger_key(item: dict[str, Any]) -> str | None:
    return next((k for k in TRIGGER_KEYS if isinstance(item.get(k), list)), None)


def duplicates(item: dict[str, Any]) -> list[int]:
    """Positions of triggers that equal an earlier one exactly (the first one is kept)."""
    key = _trigger_key(item)
    seen: set[str] = set()
    found: list[int] = []
    for index, trigger in enumerate(item[key] if key else []):
        text = json.dumps(trigger, sort_keys=True, default=str)
        if text in seen:
            found.append(index)
        seen.add(text)
    return found


def propose(item: dict[str, Any]) -> list[dict[str, Any]]:
    """What could be improved in this configuration, without values the person has to give."""
    found: list[dict[str, Any]] = []
    if not str(item.get("description") or "").strip():
        found.append({"fix": "add_description"})
    if doubled := duplicates(item):
        found.append({"fix": "remove_duplicate_triggers", "count": len(doubled)})
    return found


def apply(
    item: dict[str, Any], fix: str, values: dict[str, Any] | None
) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    """The configuration after one fix and what changed; ``ValueError`` names what is wrong."""
    values = values or {}
    new = copy.deepcopy(item)
    if fix == "add_description":
        text = str(values.get("description") or "").strip()
        if str(item.get("description") or "").strip():
            raise ValueError("nothing_to_do")
        if not 1 <= len(text) <= DESCRIPTION_MAX:
            raise ValueError("invalid_fix")
        ordered: dict[str, Any] = {}
        for key, value in new.items():  # right after the alias, where people look for it
            ordered[key] = value
            if key == "alias":
                ordered["description"] = text
        ordered.setdefault("description", text)
        return ordered, [{"path": "description", "before": None, "after": text}]
    if fix == "remove_duplicate_triggers":
        key = _trigger_key(new)
        positions = duplicates(new)
        if key is None or not positions:
            raise ValueError("nothing_to_do")
        diff = [{"path": f"{key}/{i}", "before": new[key][i], "after": None} for i in positions]
        new[key] = [t for i, t in enumerate(new[key]) if i not in positions]
        return new, diff
    raise ValueError("invalid_fix")


async def is_valid(hass: HomeAssistant, ref: str, item: dict[str, Any]) -> bool:
    """Whether Home Assistant accepts this automation configuration."""
    try:
        return await async_validate_config_item(hass, ref, dict(item)) is not None
    except Exception:  # noqa: BLE001 - anything that does not validate is not written
        return False


async def preview(
    hass: HomeAssistant,
    snapshot: dict[str, Any],
    entity_id: str,
    fix: str,
    values: dict[str, Any] | None,
) -> dict[str, Any]:
    """The source of one fix as the plan shows it, or ``error`` with a reason code. Reads only."""
    key = f"automation:{entity_id}"
    entry: dict[str, Any] = {"source": key, "type": "automation", "id": entity_id}
    try:
        loaded = await load_source(hass, snapshot, key)
    except SourceError as err:
        return {"error": "not_editable", "source_reason": str(err), "source": None}
    item = loaded["item"]
    if "use_blueprint" in item:
        return {"error": "not_editable", "source_reason": "blueprint", "source": None}
    try:
        new, diff = apply(item, fix, values)
    except ValueError as err:
        return {"error": str(err), "source": None}
    if not await is_valid(hass, loaded["ref"], new):
        return {"error": "invalid_config", "source": None}
    return {
        "error": None,
        "fingerprint": text_hash(
            f"{loaded['hash']}|{fix}|{json.dumps(values or {}, sort_keys=True)}"
        ),
        "source": {
            **entry,
            "name": loaded["name"],
            "writable": True,
            "reason": None,
            "hash": loaded["hash"],
            "changes": diff[:MAX_LISTED],
            "change_count": len(diff),
            "manual": [],
            "file_bytes": loaded.get("file_bytes"),
        },
    }
