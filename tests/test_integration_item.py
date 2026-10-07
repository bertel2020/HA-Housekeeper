"""What the inventory says about a config entry: origin, source, error and counts."""

from __future__ import annotations

import pytest

pytest.importorskip("homeassistant")
pytest.importorskip("pytest_homeassistant_custom_component")

from homeassistant.config_entries import SOURCE_IGNORE, ConfigEntryState  # noqa: E402
from homeassistant.core import HomeAssistant  # noqa: E402
from homeassistant.helpers import device_registry as dr  # noqa: E402
from homeassistant.helpers import entity_registry as er  # noqa: E402
from pytest_homeassistant_custom_component.common import MockConfigEntry  # noqa: E402

from custom_components.ha_housekeeper.inventory import InventoryScanner  # noqa: E402


async def test_config_entries_describe_their_integration_and_ignored_ones_are_no_problem(
    hass: HomeAssistant,
) -> None:
    ignored = MockConfigEntry(domain="battery_notes", title="FBH Diele", source=SOURCE_IGNORE)
    ignored.add_to_hass(hass)
    broken = MockConfigEntry(
        domain="hue", title="Bridge", unique_id="abc", state=ConfigEntryState.SETUP_ERROR
    )
    object.__setattr__(broken, "reason", "Cannot connect")
    broken.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=broken.entry_id, identifiers={("hue", "1")}
    )
    er.async_get(hass).async_get_or_create(
        "light", "hue", "l1", config_entry=broken, device_id=device.id
    )

    snapshot = await InventoryScanner(hass).async_scan()
    items = {o["name"]: o for o in snapshot["objects"] if o["object_type"] == "config_entry"}

    assert items["FBH Diele"]["status"] == "ignored" and items["FBH Diele"]["source"] == "ignore"
    assert items["Bridge"]["status"] == "problem" and items["Bridge"]["error"] == "Cannot connect"
    assert items["Bridge"]["unique_id"] == "abc"
    assert items["Bridge"]["entity_count"] == 1 and items["Bridge"]["device_count"] == 1
    assert items["Bridge"]["custom"] is False and items["Bridge"]["integration_dir"] is None
    assert items["Bridge"]["integration_name"]  # from the integration's manifest
