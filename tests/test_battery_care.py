"""Battery types, detected replacements and the criteria findings."""

from __future__ import annotations

from datetime import UTC, date, datetime, timedelta

import pytest
from homeassistant.core import HomeAssistant

from custom_components.ha_housekeeper.battery_care import BatteryError, BatteryStore
from custom_components.ha_housekeeper.battery_trend import DAY, build, detect_replacement
from custom_components.ha_housekeeper.criteria import CriteriaStore

NOW = datetime(2026, 10, 10, 12, 0, tzinfo=UTC)


def _series(*levels: float) -> list[tuple[float, float]]:
    start = NOW - timedelta(days=len(levels) - 1)
    return [((start + timedelta(days=i)).timestamp(), v) for i, v in enumerate(levels)]


async def test_types_and_settled_replacements_are_checked_and_kept(hass: HomeAssistant) -> None:
    store = BatteryStore(hass)
    store.set_type("sensor.flur_battery", " 2× AAA ")
    assert store.types == {"sensor.flur_battery": "2× AAA"}
    store.set_type("sensor.flur_battery", "")
    assert store.types == {}
    for entity_id, value in (("flur", "x"), ("sensor.a", "y" * 31)):
        with pytest.raises(BatteryError):
            store.set_type(entity_id, value)

    found = [{"entity_id": "sensor.a", "day": "2026-10-08"}]
    assert store.open_replacements(found) == found
    store.handle("sensor.a", "2026-10-08", date(2026, 10, 10))
    assert store.open_replacements(found) == []
    assert store.open_replacements([{"entity_id": "sensor.a", "day": "2026-10-09"}])
    with pytest.raises(BatteryError):
        store.handle("sensor.a", "2026-10-11", date(2026, 10, 10))


def test_a_recent_rise_is_a_replacement_and_an_old_one_or_a_small_one_is_not() -> None:
    recent = detect_replacement(_series(30, 28, 9, 100, 99), NOW)
    assert recent == {"day": "2026-10-09", "from": 9, "to": 100}
    assert detect_replacement(_series(30, 28, 27, 31, 30), NOW) is None
    old = detect_replacement(_series(*([50.0] * 5), 10, 100, *([99.0] * 30)), NOW)
    assert old is None and DAY == 86400.0
    built = build({"sensor.a": _series(30, 28, 9, 100, 99)}, {"sensor.a": "A"}, 20, NOW)
    assert built["replaced"][0]["entity_id"] == "sensor.a" and built["replaced"][0]["name"] == "A"


async def test_a_criterion_missed_again_and_again_is_a_finding_of_an_existing_automation(
    hass: HomeAssistant,
) -> None:
    store = CriteriaStore(hass)
    store.items = {"automation.a": [{}], "automation.gone": [{}]}
    today = date(2026, 10, 10)
    store.days = {
        "automation.a": {"2026-10-09": [2, 3], "2026-10-10": [0, 1]},
        "automation.gone": {"2026-10-10": [0, 5]},
    }
    found = store.findings(today, {"automation.a"})
    assert [f["object_id"] for f in found] == ["automation.a"]
    assert found[0]["rule_id"] == "automation.goal_missed"
    assert found[0]["evidence"][0]["missed"] == 4 and found[0]["evidence"][0]["reached"] == 2
    assert store.view("automation.a", today)["days"]["2026-10-09"] == [2, 3]
