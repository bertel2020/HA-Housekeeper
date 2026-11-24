"""The finding "a template reads an attribute its entity has never shown"."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from types import SimpleNamespace

import pytest

pytest.importorskip("homeassistant")

from pytest_homeassistant_custom_component.common import MockConfigEntry  # noqa: E402

from custom_components.ha_housekeeper.inventory import InventoryScanner  # noqa: E402
from custom_components.ha_housekeeper.observations import ObservationStore  # noqa: E402
from custom_components.ha_housekeeper.outage_levels import is_quiet  # noqa: E402

TEMPLATE = "{{ state_attr('sensor.z', 'power_w') | float(0) }}"


@pytest.fixture(autouse=True)
def _enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Let the tests find this integration."""


async def test_the_names_an_entity_has_shown_only_grow_and_follow_the_templates(hass) -> None:
    store, start = ObservationStore(hass), datetime(2026, 11, 1, tzinfo=UTC)
    await store.async_remember_attributes({"sensor.z"}, {"sensor.z": {"a"}}, start)
    await store.async_remember_attributes(
        {"sensor.z"}, {"sensor.z": {"b"}}, start + timedelta(days=3)
    )
    assert store.attributes_seen("sensor.z") == ({"a", "b"}, start.isoformat())
    await store.async_update({}, start)  # the update of the classifications leaves them alone
    assert store.attributes_seen("sensor.z")[1] == start.isoformat()
    await store.async_remember_attributes(set(), {}, start)  # no template names it any more
    assert store.attributes_seen("sensor.z") == (set(), None)


async def test_a_template_that_reads_an_attribute_never_shown_is_a_finding_after_a_week(
    hass,
) -> None:
    entry = MockConfigEntry(domain="template", title="Strom", options={"state": TEMPLATE})
    entry.add_to_hass(hass)
    hass.states.async_set("sensor.z", "5", {"unit_of_measurement": "W", "friendly_name": "Z"})
    store = ObservationStore(hass)
    scanner = SimpleNamespace(hass=hass, observations=store)

    async def findings() -> list:
        return await InventoryScanner._template_attribute_findings(scanner)

    assert await findings() == [], "watched for the first time: no finding yet"
    # A week later the attribute was never there.
    start = datetime.now(UTC) - timedelta(days=8)
    store._items["attrs:sensor.z"]["since"] = start.isoformat()
    found = await findings()
    assert len(found) == 1 and found[0]["affected_object"] == "sensor.z"
    assert found[0]["evidence"][0]["attributes"] == ["power_w"]
    assert found[0]["classification"] == "problem" and found[0]["object_id"] == entry.entry_id
    assert is_quiet({**found[0], "impact": "low"}), (
        "a hint stays out of the overview and the notices"
    )
    # The attribute shows once: it is no longer missing, for good.
    hass.states.async_set("sensor.z", "5", {"power_w": 3})
    assert await findings() == []
    hass.states.async_set("sensor.z", "5", {"unit_of_measurement": "W"})
    assert await findings() == []


async def test_a_guarded_read_and_an_entity_that_is_off_make_no_finding(hass) -> None:
    MockConfigEntry(
        domain="template",
        title="Guard",
        options={"state": "{{ state_attr('sensor.z', 'x') | default(0) }}"},
    ).add_to_hass(hass)
    hass.states.async_set("sensor.z", "5", {"unit_of_measurement": "W"})
    store = ObservationStore(hass)
    scanner = SimpleNamespace(hass=hass, observations=store)
    await InventoryScanner._template_attribute_findings(scanner)
    store._items["attrs:sensor.z"]["since"] = (datetime.now(UTC) - timedelta(days=9)).isoformat()
    assert await InventoryScanner._template_attribute_findings(scanner) == []
    hass.states.async_set("sensor.z", "off", {})
    assert await InventoryScanner._template_attribute_findings(scanner) == []


def test_the_templates_of_a_config_entry_are_read_from_its_read_only_options() -> None:
    from types import MappingProxyType

    from custom_components.ha_housekeeper.policies import _template_strings

    assert _template_strings(MappingProxyType({"state": TEMPLATE, "name": "x"})) == [TEMPLATE]
