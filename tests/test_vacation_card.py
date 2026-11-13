"""The numbers behind the vacation mode card: on, in the grace period after it, off, or no switch chosen."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest

pytest.importorskip("homeassistant")

from homeassistant import config_entries  # noqa: E402
from homeassistant.helpers.dispatcher import async_dispatcher_send  # noqa: E402

from custom_components.ha_housekeeper.const import DOMAIN, SIGNAL_SCAN_COMPLETE  # noqa: E402
from custom_components.ha_housekeeper.runtime import loaded_scanner  # noqa: E402
from custom_components.ha_housekeeper.vacation_card import vacation_view  # noqa: E402

NOW = datetime(2026, 11, 20, 12, 0, tzinfo=UTC)
META = {
    "entity": "calendar.urlaub",
    "keyword": "",
    "active": True,
    "missing": False,
    "ended_at": None,
    "grace_hours": 24,
    "held": 9,
    "rules": 3,
    "after_until": None,
}


def test_the_mode_is_on_in_its_grace_period_off_or_without_a_switch() -> None:
    on = vacation_view(META, NOW)
    assert (
        on["state"] == "on"
        and on["held"] == 9
        and on["rules"] == 3
        and on["entity"] == "calendar.urlaub"
    )

    until = (NOW + timedelta(hours=10)).isoformat()
    after = vacation_view({**META, "active": False, "after_until": until}, NOW)
    assert after["state"] == "after" and after["after_until"] == until

    over = vacation_view(
        {**META, "active": False, "after_until": (NOW - timedelta(hours=1)).isoformat()}, NOW
    )
    assert over["state"] == "off" and over["after_until"] is None, (
        "a grace period that has run out is no state"
    )
    assert vacation_view({**META, "active": False}, NOW)["state"] == "off"
    assert vacation_view(None, NOW) == {"state": "unset"}

    ended = (NOW - timedelta(hours=5)).isoformat()
    quiet_after = vacation_view({**META, "active": False, "held": 0, "ended_at": ended}, NOW)
    assert quiet_after["state"] == "after", (
        "the grace period runs from the end, with nothing held back"
    )
    assert quiet_after["after_until"] == (NOW + timedelta(hours=19)).isoformat()
    long_ago = (NOW - timedelta(days=3)).isoformat()
    assert vacation_view({**META, "active": False, "ended_at": long_ago}, NOW)["state"] == "off"


@pytest.fixture(autouse=True)
def _enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Let the tests find this integration."""


async def test_the_sensor_follows_the_vacation_meta_of_the_scan(hass) -> None:
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    await hass.config_entries.flow.async_configure(result["flow_id"], {})
    await hass.async_block_till_done(wait_background_tasks=True)
    scanner = loaded_scanner(hass)
    scanner.snapshot["meta"]["vacation"] = None
    scanner.snapshot["meta"].pop("preliminary", None)
    async_dispatcher_send(hass, SIGNAL_SCAN_COMPLETE)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.ha_housekeeper_vacation_mode").state == "unset"

    scanner.snapshot["meta"]["vacation"] = META
    async_dispatcher_send(hass, SIGNAL_SCAN_COMPLETE)
    await hass.async_block_till_done()
    state = hass.states.get("sensor.ha_housekeeper_vacation_mode")
    assert state.state == "on" and state.attributes["held"] == 9
