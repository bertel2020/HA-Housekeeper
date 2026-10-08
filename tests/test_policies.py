"""Quality policies: every rule at its edges, the switches, hiding and the privacy of the result."""

from __future__ import annotations

import pytest

pytest.importorskip("homeassistant")
pytest.importorskip("pytest_homeassistant_custom_component")

from homeassistant.core import HomeAssistant  # noqa: E402

from custom_components.ha_housekeeper import const  # noqa: E402
from custom_components.ha_housekeeper.hygiene import finding_key  # noqa: E402
from custom_components.ha_housekeeper.policies import (  # noqa: E402
    RULES,
    PolicyStore,
    evaluate,
    policy_key,
)


def entity(object_id: str, **fields) -> dict:
    return {
        "object_type": "entity",
        "object_id": object_id,
        "name": object_id,
        "device_id": "d1",
        "area_id": None,
        "entity_category": None,
        "disabled_by": None,
        "device_class": None,
        "labels": [],
        **fields,
    }


def device(object_id: str = "d1", **fields) -> dict:
    return {
        "object_type": "device",
        "object_id": object_id,
        "name": object_id,
        "area_id": None,
        "status": "active",
        "device_kind": "device",
        "entry_type": None,
        "labels": [],
        **fields,
    }


def automation(object_id: str, **fields) -> dict:
    return {
        "object_type": "automation",
        "object_id": object_id,
        "name": object_id,
        "source": "config",
        "description": "",
        **fields,
    }


def run(objects: list[dict], rule: str, *, ignored=frozenset(), labelled=frozenset()) -> dict:
    result = evaluate({"objects": objects}, {rule}, set(ignored), set(labelled))
    return next(r for r in result["rules"] if r["id"] == rule)


def ids(rule: dict) -> list[str]:
    return [i["object_id"] for i in rule["items"]]


def test_every_rule_is_off_until_switched_on() -> None:
    result = evaluate({"objects": [entity("light.a"), device()]}, set(), set(), set())
    assert [r["enabled"] for r in result["rules"]] == [False] * len(RULES)
    assert result["violations"] == 0 and result["enabled"] == 0
    assert all(r["items"] == [] for r in result["rules"])


# --- entity without an area -----------------------------------------------------------------


def test_entity_area_the_edges() -> None:
    objects = [
        device("d1"),
        device("d2", area_id="kitchen"),
        device("d3", entry_type="service"),
        entity("light.bare"),  # device without area, no area of its own
        entity("light.own", area_id="hall"),  # area of its own
        entity("light.inherits", device_id="d2"),  # area from the device
        entity("sensor.diag", entity_category="diagnostic"),
        entity("switch.off", disabled_by="user"),
        entity("sensor.service", device_id="d3"),  # a service device is not physical
        entity("sensor.nodevice", device_id=None),  # not physical
        entity("sensor.orphan", device_id="missing"),  # device is gone
    ]
    assert ids(run(objects, "entity_area")) == ["light.bare"]


# --- device without an area -----------------------------------------------------------------


def test_device_area_the_edges() -> None:
    objects = [
        device("bare"),
        device("placed", area_id="a"),
        device("off", status="disabled"),
        device("empty", status="empty"),
        device("sub", device_kind="child"),
        device("svc", entry_type="service"),
    ]
    assert ids(run(objects, "device_area")) == ["bare"]


# --- automation without a description -------------------------------------------------------


def test_automation_description_the_edges() -> None:
    objects = [
        automation("automation.empty"),
        automation("automation.blank", description="   "),
        automation("automation.none", description=None),
        automation("automation.ok", description="Turns the light on"),
        automation("automation.fallback", source="state_fallback"),  # no configuration to judge
    ]
    assert sorted(ids(run(objects, "automation_description"))) == [
        "automation.blank",
        "automation.empty",
        "automation.none",
    ]


# --- battery entity without a device --------------------------------------------------------


def test_battery_device_the_edges() -> None:
    objects = [
        entity("sensor.loose", device_class="battery", device_id=None),
        entity("sensor.attached", device_class="battery"),
        entity("sensor.other", device_class="temperature", device_id=None),
        entity("sensor.off", device_class="battery", device_id=None, disabled_by="user"),
    ]
    assert ids(run(objects, "battery_device")) == ["sensor.loose"]


# --- hiding ---------------------------------------------------------------------------------


def test_the_ignore_label_and_the_ignore_list_hide_a_violation() -> None:
    objects = [device("a"), device("b"), device("c")]
    key_b = policy_key("device_area", "b")
    rule = run(objects, "device_area", ignored={key_b}, labelled={"c"})
    assert rule["count"] == 1 and rule["ignored"] == 2
    by = {i["object_id"]: (i["ignored"], i["by"]) for i in rule["items"]}
    assert by == {"a": (False, None), "b": (True, "user"), "c": (True, "label")}
    assert ids(rule)[0] == "a"  # visible violations come first


def test_the_key_has_the_shape_of_a_finding_key() -> None:
    assert policy_key("device_area", "abc") == finding_key(
        {"rule_id": "policy.device_area", "object_id": "abc"}
    )
    assert policy_key("device_area", "abc") == "policy.device_area|abc|"


def test_the_list_is_capped_but_the_count_is_exact() -> None:
    objects = [device(f"d{i:04}") for i in range(250)]
    rule = run(objects, "device_area")
    assert rule["count"] == 250 and len(rule["items"]) == 200


# --- the store ------------------------------------------------------------------------------


async def test_switches_survive_a_reload(hass: HomeAssistant, hass_storage) -> None:
    store = PolicyStore(hass)
    await store.async_load()
    store.set_enabled("entity_area", True)
    store.set_enabled("device_area", True)
    store.set_enabled("device_area", False)
    with pytest.raises(ValueError):
        store.set_enabled("unknown", True)
    await store._store.async_save(store._data())
    again = PolicyStore(hass)
    await again.async_load()
    assert again.enabled == {"entity_area"}


async def test_only_known_rules_set_to_true_load(hass: HomeAssistant, hass_storage) -> None:
    hass_storage[const.POLICIES_STORAGE_KEY] = {
        "version": const.STORAGE_VERSION,
        "minor_version": 1,
        "key": const.POLICIES_STORAGE_KEY,
        "data": {"enabled": {"entity_area": True, "device_area": "yes", "gone": True}},
    }
    store = PolicyStore(hass)
    await store.async_load()
    assert store.enabled == {"entity_area"}


# --- second stage ---------------------------------------------------------------------------


def test_duplicate_name_within_a_domain_only() -> None:
    objects = [
        entity("light.k1", name="Küche"),
        entity("light.k2", name=" küche "),  # case and spaces do not count
        entity("sensor.k", name="Küche"),  # another domain: fine
        entity("light.solo", name="Flur"),
        entity("light.off", name="Küche", disabled_by="user"),  # disabled: not counted
        entity("light.noname", name="light.noname"),  # no friendly name: its id is unique anyway
    ]
    rule = run(objects, "duplicate_name")
    assert sorted(ids(rule)) == ["light.k1", "light.k2"]
    by = {i["object_id"]: i["also"] for i in rule["items"]}
    assert by == {"light.k1": ["light.k2"], "light.k2": ["light.k1"]}


def test_automation_label_needs_a_registry_entry_to_be_judged() -> None:
    objects = [
        automation("automation.bare"),
        automation("automation.tagged"),
        automation("automation.yaml_without_id"),  # not in the registry: cannot carry a label
        automation("automation.fallback", source="state_fallback"),
    ]
    labels = {"automation.bare": False, "automation.tagged": True, "automation.fallback": False}
    result = evaluate({"objects": objects}, {"automation_label"}, set(), set(), labels)
    rule = next(r for r in result["rules"] if r["id"] == "automation_label")
    assert sorted(ids(rule)) == ["automation.bare", "automation.fallback"]


def test_naming_scheme_per_domain() -> None:
    objects = [
        entity("sensor.wz_temp"),
        entity("sensor.temp"),
        entity("sensor.off", disabled_by="user"),
        entity("light.anything"),  # no prefix chosen for lights
    ]
    result = evaluate(
        {"objects": objects}, {"naming_scheme"}, set(), set(), None, {"sensor": "wz_"}
    )
    rule = next(r for r in result["rules"] if r["id"] == "naming_scheme")
    assert ids(rule) == ["sensor.temp"] and rule["items"][0]["expected"] == "wz_"
    assert result["prefixes"] == {"sensor": "wz_"}
    # Switched on without any prefix there is nothing to check.
    none = evaluate({"objects": objects}, {"naming_scheme"}, set(), set(), None, {})
    assert next(r for r in none["rules"] if r["id"] == "naming_scheme")["count"] == 0


async def test_prefixes_are_validated_limited_and_persisted(
    hass: HomeAssistant, hass_storage
) -> None:
    store = PolicyStore(hass)
    await store.async_load()
    store.set_prefix("sensor", "wz_")
    for domain, prefix in (
        ("Sensor", "x"),
        ("sen sor", "x"),
        ("light", "Bad"),
        ("light", "a" * 31),
    ):
        with pytest.raises(ValueError):
            store.set_prefix(domain, prefix)
    for index in range(9):
        store.set_prefix(f"d{index}", "p_")
    with pytest.raises(ValueError):
        store.set_prefix("d9", "p_")  # the eleventh is refused
    store.set_prefix("sensor", "kg_")  # changing an existing one is fine at the limit
    store.set_prefix("d0", "")  # an empty prefix removes
    await store._store.async_save(store._data())
    again = PolicyStore(hass)
    await again.async_load()
    assert (
        again.prefixes["sensor"] == "kg_"
        and "d0" not in again.prefixes
        and len(again.prefixes) == 9
    )
