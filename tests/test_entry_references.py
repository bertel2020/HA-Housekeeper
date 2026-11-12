"""Entities named in the settings of an integration hang on the device of the sub-entry, else on the integration."""

from __future__ import annotations

from types import SimpleNamespace

import pytest

pytest.importorskip("homeassistant")
pytest.importorskip("pytest_homeassistant_custom_component")

from homeassistant.core import HomeAssistant  # noqa: E402

from custom_components.ha_housekeeper.inventory import InventoryScanner  # noqa: E402


async def test_sub_entry_reference_hangs_on_its_device(hass: HomeAssistant, monkeypatch) -> None:
    subs = {
        "s1": SimpleNamespace(
            subentry_id="s1", title="Konvektor Bad", data={"thermostat_sensor": "sensor.t"}
        ),
        "s2": SimpleNamespace(subentry_id="s2", title="Ohne Gerät", data={"room": "sensor.t"}),
    }
    entry = SimpleNamespace(
        entry_id="E", domain="pio", source="user", data={}, options={}, subentries=subs
    )
    scanner = InventoryScanner(hass)
    monkeypatch.setattr(scanner, "_subentry_devices", lambda: {("E", "s1"): ["D1"]})
    with monkeypatch.context() as local:
        local.setattr(hass.config_entries, "async_entries", lambda *a, **k: [entry])
        edges, _ = scanner._helper_inventory({"entity": {"sensor.t"}})

    found = {(e["source"], e["target"], e["location"], e["confidence"]) for e in edges}
    assert found == {
        ("device:D1", "entity:sensor.t", "thermostat_sensor", "certain"),
        ("config_entry:E", "entity:sensor.t", "Ohne Gerät/room", "certain"),
    }
