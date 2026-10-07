"""Config flow for HA Housekeeper."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.config_entries import ConfigEntry, ConfigFlowResult, OptionsFlow

from .const import CONF_MIN_UNAVAILABLE_DAYS, DEFAULT_MIN_UNAVAILABLE_DAYS, DOMAIN, NAME


class HAHousekeeperOptionsFlow(OptionsFlow):
    """Diagnosis thresholds."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Edit thresholds."""
        if user_input is not None:
            return self.async_create_entry(data=user_input)
        current = self.config_entry.options.get(
            CONF_MIN_UNAVAILABLE_DAYS, DEFAULT_MIN_UNAVAILABLE_DAYS
        )
        schema = vol.Schema(
            {
                vol.Required(CONF_MIN_UNAVAILABLE_DAYS, default=current): vol.All(
                    vol.Coerce(int), vol.Range(min=0, max=365)
                )
            }
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
