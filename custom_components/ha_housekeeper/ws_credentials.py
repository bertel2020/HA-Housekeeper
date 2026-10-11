"""WebSocket commands for the stored credentials of the integrations.

``credential_reveal`` is the one place where a stored credential leaves the server: one field per
request, for an administrator, never logged and never stored.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .credentials import SOURCES, credentials, reveal
from .inventory import InventoryScanner
from .ws_common import _versioned, with_scanner


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/credentials"})
@callback
@with_scanner
def websocket_credentials(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
    scanner: InventoryScanner,
) -> None:
    """The credential fields of the config entries with masked values. Read-only."""
    connection.send_result(msg["id"], _versioned(credentials(hass)))


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/credential_reveal",
        vol.Required("entry_id"): vol.All(str, vol.Length(min=1, max=64)),
        vol.Required("source"): vol.In(SOURCES),
        vol.Required("key"): vol.All(str, vol.Length(min=1, max=200)),
    }
)
@callback
@with_scanner
def websocket_credential_reveal(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
    scanner: InventoryScanner,
) -> None:
    """The plain value of one credential field that ``credentials`` lists."""
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    value = reveal(entry, msg["source"], msg["key"])
    if value is None:
        connection.send_error(msg["id"], "not_found", "No such credential")
        return
    connection.send_result(msg["id"], {"value": value})


@callback
def async_register(hass: HomeAssistant) -> None:
    """Register the credential commands."""
    websocket_api.async_register_command(hass, websocket_credentials)
    websocket_api.async_register_command(hass, websocket_credential_reveal)
