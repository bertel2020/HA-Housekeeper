"""Taking an entity out of the assistants, or giving Google its PIN back: what a plan reads and writes.

The exposure of an entity is not part of its registry fingerprint, so this module keeps its own: a
hash of the options Home Assistant stores per assistant. Only two things are ever written, the
``should_expose`` flag of an assistant and the ``disable_2fa`` option of Google. Nothing is added to
an assistant, and bridges (HomeKit) are left alone.
"""

from __future__ import annotations

import hashlib
import json
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from .exposure import ASSISTANTS, GOOGLE

EXPOSE_OPTION = "should_expose"
PIN_OPTION = "disable_2fa"
# The cloud keeps the filter of a YAML setup here; with one, the exposure of the UI counts for nothing.
FILTER_KEY = "filter"


def _settings(hass: HomeAssistant, entity_id: str) -> dict[str, dict[str, Any]] | None:
    """The stored options per assistant, or None for an entity Home Assistant does not know."""
    from homeassistant.components.homeassistant.exposed_entities import (
        async_get_entity_settings,
    )

    try:
        found = async_get_entity_settings(hass, entity_id)
    except HomeAssistantError:
        return None
    return {name: dict(options) for name, options in found.items()}


def _exposed(hass: HomeAssistant, entity_id: str) -> list[str]:
    from homeassistant.components.homeassistant.exposed_entities import async_should_expose

    return [name for name in ASSISTANTS if async_should_expose(hass, name, entity_id)]


def yaml_filter(hass: HomeAssistant, assistant: str) -> bool:
    """True when a YAML filter of the Nabu Casa setup decides what ``assistant`` reaches.

    Read from the loaded cloud client; whatever cannot be read counts as no filter.
    """
    attribute = {"cloud.alexa": "_alexa_config", "cloud.google_assistant": "_google_config"}
    client = getattr(hass.data.get("cloud"), "client", None)
    config = getattr(client, attribute.get(assistant, ""), None)
    try:
        return config is not None and not config._config[FILTER_KEY].empty_filter  # noqa: SLF001
    except Exception:  # noqa: BLE001 - another cloud version: judged as before
        return False


def prepare(hass: HomeAssistant, entity_id: str, target: str) -> dict[str, Any]:
    """What an entity holds now for ``target`` ("remove" or "pin")."""
    settings = _settings(hass, entity_id)
    if settings is None:
        return {"exists": False}
    exposed = _exposed(hass, entity_id)
    settings = _settings(hass, entity_id) or {}  # asking may have stored a default
    if target == "pin":
        assistants = [GOOGLE] if settings.get(GOOGLE, {}).get(PIN_OPTION) is True else []
    else:
        assistants = exposed
    return {
        "exists": True,
        "assistants": assistants,
        "filtered": [name for name in assistants if yaml_filter(hass, name)],
        "fingerprint": fingerprint(settings, exposed),
    }


def fingerprint(settings: dict[str, dict[str, Any]], exposed: list[str]) -> str:
    """Short hash of what the assistants hold for one entity."""
    text = json.dumps({"settings": settings, "exposed": exposed}, sort_keys=True, default=str)
    return hashlib.sha256(text.encode()).hexdigest()[:16]


def current_print(hass: HomeAssistant, entity_id: str) -> str | None:
    info = prepare(hass, entity_id, "remove")
    return info.get("fingerprint") if info["exists"] else None


def _write(hass: HomeAssistant, assistant: str, entity_id: str, option: str, value: Any) -> None:
    from homeassistant.components.homeassistant.exposed_entities import (
        async_set_assistant_option,
    )

    async_set_assistant_option(hass, assistant, entity_id, option, value)


def apply(
    hass: HomeAssistant, entity_id: str, target: str, assistants: list[str]
) -> dict[str, Any]:
    """Write ``target`` for ``assistants``; returns what undo needs. The caller checked the print."""
    before = current_print(hass, entity_id)
    option, value = (PIN_OPTION, False) if target == "pin" else (EXPOSE_OPTION, False)
    for name in assistants:
        _write(hass, name, entity_id, option, value)
    return {
        "before": before,
        "after": current_print(hass, entity_id),
        "target": target,
        "assistants": list(assistants),
    }


def undo(hass: HomeAssistant, entity_id: str, result: dict[str, Any]) -> str:
    """Put the flags back; a change made since the run is left alone."""
    after = current_print(hass, entity_id)
    if after is None:
        return "conflict_gone"
    if after != result["after"]:
        return "conflict_changed"
    option, value = (PIN_OPTION, True) if result["target"] == "pin" else (EXPOSE_OPTION, True)
    for name in result["assistants"]:
        _write(hass, name, entity_id, option, value)
    return "undone"


def reached(hass: HomeAssistant, entity_id: str, target: str, assistants: list[str]) -> bool:
    """Is the entity out of ``assistants`` (or, for "pin", does Google ask for the PIN again)."""
    info = prepare(hass, entity_id, target)
    return info["exists"] and not set(assistants) & set(info["assistants"])
