"""HA Housekeeper integration."""

from __future__ import annotations

from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN, FRONTEND_URL, PANEL_ELEMENT, PANEL_URL
from .inventory import InventoryScanner
from .websocket_api import async_register as async_register_websocket


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up global API handlers once."""
    hass.data.setdefault(DOMAIN, {})
    async_register_websocket(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up HA Housekeeper from a config entry."""
    scanner = InventoryScanner(hass)
    await scanner.async_initialize()
    hass.data[DOMAIN]["scanner"] = scanner

    frontend_dir = Path(__file__).parent / "frontend"
    if not hass.data[DOMAIN].get("static_path_registered"):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(FRONTEND_URL, str(frontend_dir / "ha-housekeeper-panel.js"), False)]
        )
        hass.data[DOMAIN]["static_path_registered"] = True
    await panel_custom.async_register_panel(
        hass,
        webcomponent_name=PANEL_ELEMENT,
        frontend_url_path=PANEL_URL,
        module_url=FRONTEND_URL,
        sidebar_title="Housekeeper",
        sidebar_icon="mdi:broom",
        require_admin=True,
        config={"entry_id": entry.entry_id},
        config_panel_domain=DOMAIN,
    )
    hass.async_create_task(scanner.async_scan())
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload the integration."""
    frontend.async_remove_panel(hass, PANEL_URL)
    hass.data[DOMAIN].pop("scanner", None)
    return True
