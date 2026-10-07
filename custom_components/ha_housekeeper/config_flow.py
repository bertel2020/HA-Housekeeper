"""Config flow for HA Housekeeper."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.config_entries import ConfigEntry, ConfigFlowResult, OptionsFlow

from .const import (
    CONF_MIN_UNAVAILABLE_DAYS,
    CONF_SCAN_INTERVAL_HOURS,
    CONF_UNUSED_AUTOMATION_DAYS,
    DEFAULT_MIN_UNAVAILABLE_DAYS,
    DEFAULT_SCAN_INTERVAL_HOURS,
    DEFAULT_UNUSED_AUTOMATION_DAYS,
    DOMAIN,
    NAME,
)


class HAHousekeeperOptionsFlow(OptionsFlow):
    """Diagnosis thresholds."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Edit thresholds."""
        if user_input is not None:
            return self.async_create_entry(data=user_input)
        options = self.config_entry.options

        def field(key: str, default: int, maximum: int) -> tuple[Any, Any]:
            return (
                vol.Required(key, default=options.get(key, default)),
                vol.All(vol.Coerce(int), vol.Range(min=0, max=maximum)),
            )

        schema = vol.Schema(
            dict(
                [
                    field(CONF_MIN_UNAVAILABLE_DAYS, DEFAULT_MIN_UNAVAILABLE_DAYS, 365),
                    field(CONF_UNUSED_AUTOMATION_DAYS, DEFAULT_UNUSED_AUTOMATION_DAYS, 3650),
                    field(CONF_SCAN_INTERVAL_HOURS, DEFAULT_SCAN_INTERVAL_HOURS, 720),
                ]
            )
        )
        return self.async_show_form(step_id="init", data_schema=schema)


class HAHousekeeperConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Configure HA Housekeeper."""

    VERSION = 1

    @staticmethod
    def async_get_options_flow(config_entry: ConfigEntry) -> HAHousekeeperOptionsFlow:
        """Return the options flow."""
        return HAHousekeeperOptionsFlow()

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Create the single local config entry."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        if user_input is not None:
            return self.async_create_entry(title=NAME, data={})

        return self.async_show_form(step_id="user")
