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
from custom_components.ha_housekeeper.inventory import (  # noqa: E402
    InventoryScanner,
    _device_config_entry_ids,
    _registry_entries,
)


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


async def test_registry_helpers_accept_old_and_new_home_assistant_shapes() -> None:
    """Registry adapters support mappings and HA 2026.10 read-only collections."""

    class Entry:
        def __init__(self, entry_id: str) -> None:
            self.id = entry_id

    old_entry = Entry("old")
    new_entry = Entry("new")
    assert _registry_entries({"old": old_entry}) == [old_entry]
    assert _registry_entries((new_entry,)) == [new_entry]

    legacy_device = type("LegacyDevice", (), {"config_entries": {"legacy"}})()
    modern_device = type("ModernDevice", (), {"config_entry_id": "modern"})()
    assert _device_config_entry_ids(legacy_device) == ["legacy"]
    assert _device_config_entry_ids(modern_device) == ["modern"]


async def test_scanner_counts_entities_per_device(hass: HomeAssistant) -> None:
    """Devices report how many registry entities they provide."""
    from homeassistant.helpers import device_registry as dr
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    config_entry = MockConfigEntry(domain="test")
    config_entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=config_entry.entry_id, identifiers={("test", "device-1")}
    )
    registry = er.async_get(hass)
    for index in range(2):
        registry.async_get_or_create(
            domain="sensor",
            platform="test",
            unique_id=f"count-{index}",
            config_entry=config_entry,
            device_id=device.id,
        )

    scanner = InventoryScanner(hass)
    await scanner.async_initialize()
    snapshot = await scanner.async_scan()

    item = next(value for value in snapshot["objects"] if value["object_id"] == device.id)
    assert item["entity_count"] == 2
    assert item["status"] == "active"


async def test_scan_payload_omits_attributes_but_details_are_available(hass: HomeAssistant) -> None:
    """Attributes are served on demand instead of inside the list payload."""
    registry = er.async_get(hass)
    entry = registry.async_get_or_create(
        domain="sensor", platform="test", unique_id="detail-test", suggested_object_id="detail_test"
    )
    hass.states.async_set(entry.entity_id, "7", {"unit_of_measurement": "W"})

    scanner = InventoryScanner(hass)
    await scanner.async_initialize()
    snapshot = await scanner.async_scan()

    item = next(value for value in snapshot["objects"] if value["object_id"] == entry.entity_id)
    assert "attributes" not in item
    assert scanner.get_details("entity", entry.entity_id) == {
        "attributes": {"unit_of_measurement": "W"}
    }
    assert scanner.get_details("entity", "sensor.unknown") is None


async def test_diagnostics_exports_only_aggregates(hass: HomeAssistant) -> None:
    """The diagnostics download contains counts but no names or entity IDs."""
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    from custom_components.ha_housekeeper.diagnostics import (
        async_get_config_entry_diagnostics,
    )

    entry = er.async_get(hass).async_get_or_create(
        domain="sensor", platform="test", unique_id="diag-1", suggested_object_id="secret_name"
    )
    scanner = InventoryScanner(hass)
    hass.data.setdefault(DOMAIN, {})["scanner"] = scanner
    await scanner.async_scan()

    config_entry = MockConfigEntry(domain=DOMAIN)
    result = await async_get_config_entry_diagnostics(hass, config_entry)

    assert result["loaded"] is True
    assert result["meta"]["object_count"] >= 1
    assert sum(result["findings_by_rule"].values()) == 1
    assert entry.entity_id not in repr(result)
    assert "secret_name" not in repr(result)

    hass.data[DOMAIN].pop("scanner")
    assert (await async_get_config_entry_diagnostics(hass, config_entry))["loaded"] is False


async def test_options_flow_stores_threshold(hass: HomeAssistant) -> None:
    """The unavailable threshold is editable through the options flow."""
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] == FlowResultType.FORM
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"min_unavailable_days": 7}
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert entry.options["min_unavailable_days"] == 7
    assert entry.options["scan_interval_hours"] == 24
    assert entry.options["unused_automation_days"] == 90


async def test_scan_creates_and_clears_repairs_hints(hass: HomeAssistant) -> None:
    """Findings become aggregated, non-fixable issues that disappear once resolved."""
    from homeassistant.helpers import issue_registry as ir

    registry = er.async_get(hass)
    entry = registry.async_get_or_create(
        domain="sensor", platform="test", unique_id="issue-1", suggested_object_id="issue_test"
    )
    scanner = InventoryScanner(hass)
    await scanner.async_scan()

    issue = ir.async_get(hass).async_get_issue(DOMAIN, "orphaned_entities")
    assert issue is not None
    assert issue.is_fixable is False
    assert issue.learn_more_url == "/ha-housekeeper?view=findingsNav&filter=orphaned"
    assert issue.translation_placeholders == {"count": "1"}

    hass.states.async_set(entry.entity_id, "1")
    await scanner.async_scan()
    assert ir.async_get(hass).async_get_issue(DOMAIN, "orphaned_entities") is None


async def test_scripts_and_scenes_are_inventoried_with_missing_references(
    hass: HomeAssistant,
) -> None:
    """Scripts and scenes become objects, edges and findings like automations."""
    from homeassistant.setup import async_setup_component

    hass.states.async_set("light.present", "on")
    assert await async_setup_component(
        hass,
        "script",
        {
            "script": {
                "tidy": {
                    "alias": "Tidy",
                    "sequence": [
                        {"action": "light.turn_off", "target": {"entity_id": "light.present"}},
                        {"action": "light.turn_off", "target": {"entity_id": "light.gone"}},
                    ],
                }
            }
        },
    )
    hass.states.async_set(
        "scene.evening",
        "scening",
        {"friendly_name": "Evening", "entity_id": ["light.present", "light.vanished"]},
    )

    scanner = InventoryScanner(hass)
    snapshot = await scanner.async_scan()

    types = {item["object_id"]: item["object_type"] for item in snapshot["objects"]}
    assert types["script.tidy"] == "script"
    assert types["scene.evening"] == "scene"

    rules = {(f["rule_id"], f["object_id"], f["affected_object"]) for f in snapshot["findings"]}
    assert ("script.missing_entity", "script.tidy", "light.gone") in rules
    assert ("scene.missing_entity", "scene.evening", "light.vanished") in rules
    assert not any(affected == "light.present" for _, _, affected in rules)

    targets = {(e["source"], e["target"]) for e in snapshot["edges"]}
    assert ("script:script.tidy", "entity:light.present") in targets
    assert ("scene:scene.evening", "entity:light.present") in targets


async def test_dashboards_are_inventoried_with_missing_entities(hass: HomeAssistant) -> None:
    """Dashboard entity references become edges, and gone entities become findings."""
    from types import SimpleNamespace

    from homeassistant.components.lovelace.const import LOVELACE_DATA

    class FakeDashboard:
        mode = "storage"
        config = {"title": "Wohnzimmer"}

        async def async_load(self, force: bool) -> dict:
            return {
                "views": [
                    {"cards": [{"type": "entity", "entity": "light.present"}]},
                    {"cards": [{"type": "entity", "entity": "light.gone"}]},
                ]
            }

    class BrokenDashboard:
        async def async_load(self, force: bool) -> dict:
            raise RuntimeError("auto-generated")

    hass.states.async_set("light.present", "on")
    hass.data[LOVELACE_DATA] = SimpleNamespace(
        dashboards={"dash-living": FakeDashboard(), None: BrokenDashboard()}
    )

    snapshot = await InventoryScanner(hass).async_scan()

    dashboards = [o for o in snapshot["objects"] if o["object_type"] == "dashboard"]
    assert [d["object_id"] for d in dashboards] == ["dash-living"]
    assert dashboards[0]["name"] == "Wohnzimmer"
    assert dashboards[0]["view_count"] == 2
    assert dashboards[0]["missing_reference_count"] == 1

    assert ("dashboard:dash-living", "entity:light.present") in {
        (e["source"], e["target"]) for e in snapshot["edges"]
    }
    finding = next(f for f in snapshot["findings"] if f["rule_id"] == "dashboard.missing_entity")
    assert finding["affected_object"] == "light.gone"
    assert finding["evidence"][0]["location"] == "views/1/cards/0/entity"


async def test_second_scan_can_be_compared_with_the_first(hass: HomeAssistant) -> None:
    """The scanner records history so a later scan shows what changed."""
    registry = er.async_get(hass)
    entry = registry.async_get_or_create(
        domain="sensor", platform="test", unique_id="cmp-1", suggested_object_id="cmp_test"
    )
    hass.states.async_set(entry.entity_id, "1")
    scanner = InventoryScanner(hass)
    await scanner.async_scan()
    assert scanner.history.compare(scanner.snapshot)["available"] is False

    hass.states.async_set(entry.entity_id, "unavailable")
    await scanner.async_scan()

    result = scanner.history.compare(scanner.snapshot)
    assert result["available"] is True
    changes = result["status_changes"]["items"]
    assert [(c["object_id"], c["from"], c["to"]) for c in changes] == [
        (entry.entity_id, "active", "unavailable")
    ]


async def test_scan_flags_duplicates_and_keeps_hints_out_of_repairs(hass: HomeAssistant) -> None:
    """A suffixed leftover becomes a finding, but never a Repairs card."""
    from homeassistant.helpers import issue_registry as ir

    registry = er.async_get(hass)
    base = registry.async_get_or_create(
        domain="media_player", platform="cast", unique_id="a", suggested_object_id="tv"
    )
    twin = registry.async_get_or_create(
        domain="media_player", platform="cast", unique_id="b", suggested_object_id="tv_2"
    )
    hass.states.async_set(base.entity_id, "on")
    hass.states.async_set(twin.entity_id, "unavailable")

    scanner = InventoryScanner(hass)
    scanner.min_unavailable_days = 0
    snapshot = await scanner.async_scan()

    duplicate = next(f for f in snapshot["findings"] if f["rule_id"] == "entity.possible_duplicate")
    assert (duplicate["object_id"], duplicate["affected_object"]) == (
        twin.entity_id,
        base.entity_id,
    )
    assert ir.async_get(hass).async_get_issue(DOMAIN, "orphaned_entities") is None
    assert snapshot["meta"]["unused_automation_days"] == 90


async def test_groups_and_helpers_link_their_members(hass: HomeAssistant) -> None:
    """Group members and helper sources become edges; vanished ones become findings."""
    from pytest_homeassistant_custom_component.common import MockConfigEntry

    hass.states.async_set("light.present", "on")
    hass.states.async_set("light.group", "on", {"entity_id": ["light.present", "light.vanished"]})
    MockConfigEntry(
        domain="derivative", title="Rate", options={"source": "sensor.gone_source"}
    ).add_to_hass(hass)

    snapshot = await InventoryScanner(hass).async_scan()

    edges = {(e["source"], e["target"], e["relation"]) for e in snapshot["edges"]}
    assert ("entity:light.group", "entity:light.present", "INCLUDES") in edges
    rules = {(f["rule_id"], f["object_id"], f["affected_object"]) for f in snapshot["findings"]}
    assert ("entity.missing_member", "light.group", "light.vanished") in rules
    helper = next(f for f in snapshot["findings"] if f["rule_id"] == "config_entry.missing_entity")
    assert helper["affected_object"] == "sensor.gone_source"
    assert any(
        s.startswith("config_entry:") and t == "entity:sensor.gone_source" for s, t, _ in edges
    )


async def test_findings_can_be_hidden_by_the_user_or_by_label(hass: HomeAssistant) -> None:
    """Hidden findings stay in the snapshot but no longer produce Repairs hints."""
    from homeassistant.helpers import issue_registry as ir
    from homeassistant.helpers import label_registry as lr

    registry = er.async_get(hass)
    plain = registry.async_get_or_create(
        domain="sensor", platform="test", unique_id="p", suggested_object_id="plain"
    )
    labelled = registry.async_get_or_create(
        domain="sensor", platform="test", unique_id="l", suggested_object_id="labelled"
    )
    label = lr.async_get(hass).async_create("housekeeper_ignore")
    registry.async_update_entity(labelled.entity_id, labels={label.label_id})

    scanner = InventoryScanner(hass)
    snapshot = await scanner.async_scan()
    by_object = {f["object_id"]: f for f in snapshot["findings"]}

    assert by_object[labelled.entity_id]["ignored_by"] == "label"
    assert by_object[plain.entity_id]["ignored"] is False
    issues = ir.async_get(hass)
    assert issues.async_get_issue(DOMAIN, "orphaned_entities").translation_placeholders == {
        "count": "1"
    }

    key = by_object[plain.entity_id]["key"]
    assert scanner.set_finding_ignored(key, True) is True
    assert by_object[plain.entity_id]["ignored_by"] == "user"
    assert issues.async_get_issue(DOMAIN, "orphaned_entities") is None

    assert scanner.set_finding_ignored(key, False) is True
    assert by_object[plain.entity_id]["ignored"] is False
    assert issues.async_get_issue(DOMAIN, "orphaned_entities") is not None
    assert scanner.set_finding_ignored("does|not|exist", True) is False


async def test_sensors_expose_counts_and_follow_scans(hass: HomeAssistant) -> None:
    """The set-up entry provides count sensors that ignore hidden findings."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    await hass.config_entries.flow.async_configure(result["flow_id"], {})
    await hass.async_block_till_done()

    registry = er.async_get(hass)
    registry.async_get_or_create(
        domain="sensor", platform="test", unique_id="s1", suggested_object_id="ghost"
    )
    scanner = hass.data[DOMAIN]["scanner"]
    await scanner.async_scan()
    await hass.async_block_till_done()

    assert hass.states.get("sensor.ha_housekeeper_orphaned_entities").state == "1"
    assert hass.states.get("sensor.ha_housekeeper_findings").state == "1"
    assert hass.states.get("sensor.ha_housekeeper_last_scan").state not in {
        "unknown",
        "unavailable",
    }

    finding = scanner.snapshot["findings"][0]
    scanner.set_finding_ignored(finding["key"], True)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.ha_housekeeper_findings").state == "0"
