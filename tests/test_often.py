"""The "no thanks" answers to the suggestions for marks."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

from homeassistant.core import HomeAssistant

from custom_components.ha_housekeeper.often import OftenStore

NOW = datetime(2026, 10, 23, 12, 0, tzinfo=UTC)


async def test_no_thanks_holds_for_half_a_year_and_can_be_taken_back(hass: HomeAssistant) -> None:
    store = OftenStore(hass)
    old = (NOW - timedelta(days=200)).isoformat()
    store.skip(
        {"entity:light.a": NOW.isoformat(), "device:d1": old, "light.b": NOW.isoformat()}, NOW
    )
    assert store.view(NOW) == {
        "entity:light.a": NOW.isoformat()
    }  # d1 is past its time, light.b is no key
    store.skip({"entity:light.c": (NOW + timedelta(days=5)).isoformat()}, NOW)
    assert store.view(NOW)["entity:light.c"] == NOW.isoformat()  # never later than now
    store.unskip(["entity:light.a"])
    assert "entity:light.a" not in store.view(NOW)
