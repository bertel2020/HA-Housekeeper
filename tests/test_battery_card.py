"""The numbers behind the battery card: the weakest first, the round of changes by room and what to buy."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest

pytest.importorskip("homeassistant")

from custom_components.ha_housekeeper.battery_card import (  # noqa: E402
    battery_overview,
    parse_type,
)

NOW = datetime(2026, 11, 12, 12, 0, tzinfo=UTC)


def _battery(object_id: str, state: str, device: str, name: str) -> dict:
    return {
        "object_type": "entity",
        "object_id": object_id,
        "name": f"{name} Battery",
        "device_class": "battery",
        "status": "active",
        "state": state,
        "unit": "%",
        "device_id": device,
    }


def _snapshot() -> dict:
    devices = {
        "d1": ("Türsensor Keller", "cellar"),
        "d2": ("Rauchmelder Flur", "hall"),
        "d3": ("Thermostat Bad", "bath"),
        "d4": ("Bewegungsmelder Garage", ""),
    }
    objects = [
        {"object_type": "area", "object_id": a, "name": a.title()}
        for a in ("cellar", "hall", "bath")
    ]
    objects += [
        {"object_type": "device", "object_id": d, "name": n, "area_id": a}
        for d, (n, a) in devices.items()
    ]
    objects += [
        _battery("sensor.door", "44", "d1", "Door"),
        _battery("sensor.smoke", "8", "d2", "Smoke"),
        _battery("sensor.bath", "27", "d3", "Bath"),
        _battery("sensor.garage", "12", "d4", "Garage"),
    ]
    return {"meta": {"low_battery_percent": 20}, "objects": objects}


TYPES = {"sensor.door": "CR2032", "sensor.smoke": "9 V", "sensor.bath": "2× AA"}


def test_a_type_names_the_cell_and_how_many_are_needed() -> None:
    assert parse_type("2× AA") == ("AA", 2)
    assert parse_type("CR2032") == ("CR2032", 1)
    assert parse_type("  ") is None and parse_type(None) is None


def test_without_a_forecast_the_card_lists_by_level_and_says_it_follows() -> None:
    overview = battery_overview(_snapshot(), TYPES, None, None, NOW)
    assert [i["name"] for i in overview["weakest"]][:2] == [
        "Rauchmelder Flur",
        "Bewegungsmelder Garage",
    ]
    assert {i["quality"] for i in overview["weakest"] if not i["low"]} == {"pending"}
    assert [i["name"] for i in overview["round"]] == [
        "Rauchmelder Flur",
        "Bewegungsmelder Garage",
    ], "only what is low"
    assert overview["first_change"] == datetime(2026, 11, 12, tzinfo=UTC), (
        "two are low already, so the change is due today, not unknown"
    )
    assert overview["lowest"] == 8


def test_the_round_and_the_shopping_list_follow_the_forecast_and_the_types() -> None:
    read = NOW - timedelta(days=2)
    forecast = {
        "available": True,
        "busy": False,
        "rows": [
            {"entity_id": "sensor.door", "state": "falling", "days_left": 14},
            {"entity_id": "sensor.smoke", "state": "low", "days_left": 0},
            {"entity_id": "sensor.bath", "state": "falling", "days_left": 40},
            {"entity_id": "sensor.garage", "state": "low", "days_left": 0},
        ],
    }
    overview = battery_overview(_snapshot(), TYPES, forecast, read, NOW)
    door = next(i for i in overview["weakest"] if i["name"] == "Türsensor Keller")
    assert (door["days_left"], door["quality"], door["area"]) == (12, "estimate", "Cellar"), (
        "two days have passed"
    )
    assert [i["name"] for i in overview["round"]] == [
        "Rauchmelder Flur",
        "Bewegungsmelder Garage",
        "Türsensor Keller",
    ]
    assert overview["shopping"] == [
        {"type": "9 V", "count": 1, "names": ["Rauchmelder Flur"]},
        {"type": "CR2032", "count": 1, "names": ["Türsensor Keller"]},
    ]
    assert overview["unknown_type"] == ["Bewegungsmelder Garage"]
    assert overview["first_change"] == datetime(2026, 11, 12, tzinfo=UTC), (
        "the first one is low already: today"
    )
    healthy = _snapshot()
    for item in healthy["objects"]:
        if item.get("state") in ("8", "12"):
            item["state"] = "80"  # nothing is low now: only the forecast of the door counts
    later = battery_overview(
        healthy,
        TYPES,
        {**forecast, "rows": [{"entity_id": "sensor.door", "state": "falling", "days_left": 14}]},
        read,
        NOW,
    )
    assert later["first_change"] == datetime(2026, 11, 24, tzinfo=UTC), (
        "14 days left when read, two days ago: 12 days from today, not from the day it was read"
    )

    kinds = {**TYPES, "sensor.bath": "2× AA", "sensor.door": "Rechargeable"}
    due = battery_overview(
        _snapshot(),
        kinds,
        {**forecast, "rows": [{"entity_id": "sensor.bath", "state": "falling", "days_left": 3}]},
        read,
        NOW,
    )
    assert {"type": "AA", "count": 2, "names": ["Thermostat Bad"]} in due["shopping"], (
        "2× AA are two cells for one device"
    )
    assert all(entry["type"] != "Rechargeable" for entry in due["shopping"]), (
        "a rechargeable battery is not bought"
    )


def test_a_device_with_a_level_and_a_low_flag_is_one_battery_and_a_low_one_is_due_now() -> None:
    snapshot = _snapshot()
    snapshot["objects"].append(
        {
            "object_type": "entity",
            "object_id": "binary_sensor.door_battery_low",
            "name": "Door battery low",
            "device_class": "battery",
            "status": "active",
            "state": "on",
            "device_id": "d1",
        }
    )
    types = {"sensor.door": "CR2032", "binary_sensor.door_battery_low": "CR2032"}
    overview = battery_overview(snapshot, types, None, None, NOW)
    doors = [i for i in overview["weakest"] if i["name"] == "Türsensor Keller"]
    assert len(doors) == 1 and doors[0]["entity_id"] == "sensor.door" and doors[0]["percent"] == 44
    assert doors[0]["low"] is True, "the flag makes the device low"
    assert doors[0]["days_left"] == 0 and overview["total"] == 4 and overview["low"] == 3
    assert {"type": "CR2032", "count": 1, "names": ["Türsensor Keller"]} in overview["shopping"]
    assert overview["first_change"] == datetime(2026, 11, 12, tzinfo=UTC), (
        "low now: today, not unknown"
    )
    # The type set on the flag alone is the device's type, and it is not listed as unknown.
    only_flag = battery_overview(
        snapshot, {"binary_sensor.door_battery_low": "CR2032"}, None, None, NOW
    )
    assert "Türsensor Keller" not in only_flag["unknown_type"]
