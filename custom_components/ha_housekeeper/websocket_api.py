"""WebSocket API for the HA Housekeeper panel."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .inventory import InventoryScanner


def _scanner(hass: HomeAssistant) -> InventoryScanner:
    """Return the configured scanner."""
    return hass.data[DOMAIN]["scanner"]


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/inventory"})
@websocket_api.async_response
async def websocket_inventory(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the last inventory, scanning on first use."""
    connection.require_admin()
    connection.send_result(msg["id"], await _scanner(hass).async_get_snapshot())


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/scan"})
@websocket_api.async_response
async def websocket_scan(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Run and return a fresh inventory scan."""
    connection.require_admin()
    connection.send_result(msg["id"], await _scanner(hass).async_scan())


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/status"})
@callback
def websocket_status(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return scan progress without triggering work."""
    connection.require_admin()
    connection.send_result(msg["id"], _scanner(hass).status)


def async_register(hass: HomeAssistant) -> None:
    """Register Housekeeper WebSocket commands."""
    websocket_api.async_register_command(hass, websocket_inventory)
    websocket_api.async_register_command(hass, websocket_scan)
    websocket_api.async_register_command(hass, websocket_status)
