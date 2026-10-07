"""HA Housekeeper integration."""

from __future__ import annotations

import logging
from datetime import timedelta
from pathlib import Path
from typing import Any

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.start import async_at_started
from homeassistant.helpers.typing import ConfigType

from .const import (
    CONF_LOW_BATTERY_PERCENT,
    CONF_MIN_UNAVAILABLE_DAYS,
    CONF_SCAN_INTERVAL_HOURS,
    CONF_UNUSED_AUTOMATION_DAYS,
    DEFAULT_LOW_BATTERY_PERCENT,
    DEFAULT_MIN_UNAVAILABLE_DAYS,
    DEFAULT_SCAN_INTERVAL_HOURS,
    DEFAULT_UNUSED_AUTOMATION_DAYS,
    DOMAIN,
    FRONTEND_URL,
    LOGO_URL,
    PANEL_ELEMENT,
    PANEL_URL,
)
from .inventory import InventoryScanner
from .issues import async_clear_issues
from .websocket_api import async_register as async_register_websocket

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

PLATFORMS = [Platform.SENSOR]


async def _async_initial_scan(scanner: InventoryScanner) -> None:
    """Run the initial scan without leaking a background-task exception."""
    try:
        await scanner.async_scan()
    except Exception:  # Scanner status retains the user-facing error.
        _LOGGER.exception("Initial HA Housekeeper inventory scan failed")


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up global API handlers once."""
    hass.data.setdefault(DOMAIN, {})
    async_register_websocket(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up HA Housekeeper from a config entry."""
    scanner = InventoryScanner(hass)
    scanner.min_unavailable_days = entry.options.get(
        CONF_MIN_UNAVAILABLE_DAYS, DEFAULT_MIN_UNAVAILABLE_DAYS
    )
    scanner.unused_automation_days = entry.options.get(
        CONF_UNUSED_AUTOMATION_DAYS, DEFAULT_UNUSED_AUTOMATION_DAYS
    )
    scanner.low_battery_percent = entry.options.get(
        CONF_LOW_BATTERY_PERCENT, DEFAULT_LOW_BATTERY_PERCENT
    )
    scanner.scan_interval_hours = entry.options.get(
        CONF_SCAN_INTERVAL_HOURS, DEFAULT_SCAN_INTERVAL_HOURS
    )
    await scanner.async_initialize()
    hass.data[DOMAIN]["scanner"] = scanner

    frontend_dir = Path(__file__).parent / "frontend"
    if not hass.data[DOMAIN].get("static_path_registered"):
        await hass.http.async_register_static_paths(
            [
                StaticPathConfig(
                    FRONTEND_URL, str(frontend_dir / "ha-housekeeper-panel.js"), False
                ),
                StaticPathConfig(LOGO_URL, str(Path(__file__).parent / "brand" / "logo.png"), True),
            ]
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

    # Scanning while Home Assistant is still starting would classify entities of
    # integrations that have not finished loading as orphaned and persist that.
    def _start_initial_scan(_: HomeAssistant) -> None:
        entry.async_create_background_task(
            hass,
            _async_initial_scan(scanner),
            "HA Housekeeper initial inventory scan",
        )

    # Changed thresholds only affect the findings, so a reload with a fresh scan suffices.
    entry.async_on_unload(entry.add_update_listener(_async_options_updated))
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(async_at_started(hass, _start_initial_scan))

    # Regular scans keep the comparison history, findings and hints current.
    interval_hours = entry.options.get(CONF_SCAN_INTERVAL_HOURS, DEFAULT_SCAN_INTERVAL_HOURS)
    if interval_hours > 0:

        def _scheduled_scan(_: Any) -> None:
            if scanner.paused:  # A cleanup run is in progress and scans itself.
                return
            entry.async_create_background_task(
                hass, _async_initial_scan(scanner), "HA Housekeeper scheduled inventory scan"
            )

        entry.async_on_unload(
            async_track_time_interval(hass, _scheduled_scan, timedelta(hours=interval_hours))
        )
    return True


async def _async_options_updated(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload so the new thresholds apply."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload the integration."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    frontend.async_remove_panel(hass, PANEL_URL)
    hass.data[DOMAIN].pop("scanner", None)
    async_clear_issues(hass)
    return unloaded
