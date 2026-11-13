"""The numbers behind the start time card: the last start against the usual, with the same rule as the panel."""

from __future__ import annotations

from datetime import UTC, datetime

import pytest

pytest.importorskip("homeassistant")

from homeassistant import config_entries  # noqa: E402
from homeassistant.helpers.dispatcher import async_dispatcher_send  # noqa: E402

from custom_components.ha_housekeeper.const import DOMAIN, SIGNAL_SCAN_COMPLETE  # noqa: E402
from custom_components.ha_housekeeper.runtime import loaded_scanner  # noqa: E402
from custom_components.ha_housekeeper.start_card import start_view  # noqa: E402


def _start(at: str, boot: float | None, items: list | None = None, **extra: object) -> dict:
    return {"at": at, "boot_s": boot, "items": items or [], **extra}


def test_the_last_start_is_slower_when_it_took_a_quarter_longer_than_the_starts_before() -> None:
    starts = [
        _start("2026-11-01T05:00:00+00:00", 140.0),
        _start("2026-11-05T05:00:00+00:00", 150.0),
        _start(
            "2026-11-12T05:12:00+00:00",
            192.4,
            [
                {"domain": "weather", "seconds": 48.2, "state": "loaded", "title": "Wetterdienst"},
                {"domain": "hue", "seconds": 0.4, "state": "loaded"},
                {"domain": "heat", "seconds": 0.0, "state": "setup_error"},
            ],
            update=True,
        ),
    ]
    view = start_view(starts)
    assert view["state"] == 192.4 and view["update"] is True
    assert view["usual_seconds"] == 145.0 and view["change_percent"] == 33
    assert view["slower"] is True, "more than a quarter longer than the mean of the starts before"
    assert view["history"] == [140.0, 150.0, 192.4]
    assert [(s["name"], s["state"]) for s in view["slowest"]] == [
        ("Wetterdienst", "loaded"),
        ("heat", "setup_error"),
    ], (
        "the slow ones and the ones that did not load, named by title or domain; a quick one is left out"
    )

    normal = start_view([*starts[:2], _start("2026-11-12T05:12:00+00:00", 160.0)])
    assert normal["slower"] is False and normal["change_percent"] == 10


def test_without_two_starts_before_nothing_is_called_slow_and_without_a_start_there_is_nothing() -> (
    None
):
    view = start_view(
        [_start("2026-11-12T05:12:00+00:00", 300.0), _start("2026-11-12T06:00:00+00:00", 400.0)]
    )
    assert view["slower"] is False, "one start before is no base"
    assert start_view([]) == {} and start_view([_start("2026-11-12T05:12:00+00:00", None)]) == {}


@pytest.fixture(autouse=True)
def _enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Let the tests find this integration."""


async def test_the_sensor_follows_the_recorded_starts(hass) -> None:
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    await hass.config_entries.flow.async_configure(result["flow_id"], {})
    await hass.async_block_till_done(wait_background_tasks=True)
    scanner = loaded_scanner(hass)
    scanner.starts.starts = []
    async_dispatcher_send(hass, SIGNAL_SCAN_COMPLETE)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.ha_housekeeper_start_time").state == "unknown"

    scanner.starts.record(datetime.now(UTC), "2026.11.1", 192.4, 200.0, "process", [], 30)
    async_dispatcher_send(hass, SIGNAL_SCAN_COMPLETE)
    await hass.async_block_till_done()
    state = hass.states.get("sensor.ha_housekeeper_start_time")
    assert float(state.state) == 192.4 and state.attributes["history"] == [192.4]
