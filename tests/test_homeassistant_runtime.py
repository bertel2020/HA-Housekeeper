"""Runtime tests executed when Home Assistant test support is installed."""

from __future__ import annotations

import pytest

pytest.importorskip("homeassistant")
pytestmark = pytest.mark.asyncio

from homeassistant import config_entries  # noqa: E402
from homeassistant.core import HomeAssistant  # noqa: E402
from homeassistant.data_entry_flow import FlowResultType  # noqa: E402
from homeassistant.helpers import entity_registry as er  # noqa: E402

from custom_components.ha_housekeeper.const import DOMAIN  # noqa: E402
from custom_components.ha_housekeeper.inventory import InventoryScanner  # noqa: E402


@pytest.fixture(autouse=True)
def _enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Allow loading the integration from custom_components."""


async def test_config_flow_creates_single_entry(hass: HomeAssistant) -> None:
    """The empty confirmation flow creates the local service entry."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"

    result = await hass.config_entries.flow.async_configure(result["flow_id"], {})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "HA Housekeeper"
    assert result["data"] == {}
    await hass.async_block_till_done()
    assert "scanner" in hass.data[DOMAIN]


async def test_scanner_reads_entity_registry_and_state(hass: HomeAssistant) -> None:
    """A registered live entity appears as active in the normalized snapshot."""
    registry = er.async_get(hass)
    entry = registry.async_get_or_create(
        domain="sensor",
        platform="test",
        unique_id="housekeeper-test",
        suggested_object_id="housekeeper_test",
    )
    hass.states.async_set(entry.entity_id, "42", {"unit_of_measurement": "kWh"})

    scanner = InventoryScanner(hass)
    await scanner.async_initialize()
    snapshot = await scanner.async_scan()

    item = next(value for value in snapshot["objects"] if value["object_id"] == entry.entity_id)
    assert item["object_type"] == "entity"
    assert item["status"] == "active"
    assert item["reason"] == "state_available"
    assert snapshot["meta"]["read_only"] is True
