"""The option that hides the sidebar entry."""

from __future__ import annotations

import pytest

pytest.importorskip("homeassistant")
pytest.importorskip("pytest_homeassistant_custom_component")

from homeassistant.components import frontend  # noqa: E402
from homeassistant.core import HomeAssistant  # noqa: E402
from homeassistant.setup import async_setup_component  # noqa: E402
from pytest_homeassistant_custom_component.common import MockConfigEntry  # noqa: E402

from custom_components.ha_housekeeper.const import DOMAIN  # noqa: E402


@pytest.fixture(autouse=True)
def _enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Allow loading the integration from custom_components."""


async def test_the_option_shows_or_hides_the_sidebar_entry(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(domain=DOMAIN, options={"show_in_sidebar": False})
    entry.add_to_hass(hass)
    assert await async_setup_component(hass, DOMAIN, {})
    await hass.async_block_till_done()
    assert hass.data[frontend.DATA_PANELS]["ha-housekeeper"].sidebar_title is None
    hass.config_entries.async_update_entry(entry, options={"show_in_sidebar": True})
    await hass.async_block_till_done()
    assert hass.data[frontend.DATA_PANELS]["ha-housekeeper"].sidebar_title == "Housekeeper"
