"""The numbers behind the database card: size with the journal, the change of the month and the two hints."""

from __future__ import annotations

from datetime import UTC, date, datetime, timedelta

import pytest

pytest.importorskip("homeassistant")

from homeassistant import config_entries  # noqa: E402
from homeassistant.helpers.dispatcher import async_dispatcher_send  # noqa: E402

from custom_components.ha_housekeeper.const import DOMAIN, SIGNAL_SCAN_COMPLETE  # noqa: E402
from custom_components.ha_housekeeper.database_card import database_view  # noqa: E402
from custom_components.ha_housekeeper.runtime import loaded_scanner  # noqa: E402

MB = 1024**2
TODAY = date(2026, 11, 12)


def _sizes(steady: int, last_week: int) -> dict[str, int]:
    """Forty days of daily sizes: ``steady`` bytes a day, ``last_week`` a day in the last seven."""
    sizes, size = {}, 3 * 1024**3
    for back in range(39, -1, -1):
        size += last_week if back < 7 else steady
        sizes[(TODAY - timedelta(days=back)).isoformat()] = size
    return sizes


DATABASE = {"db_bytes": 3 * 1024**3, "wal_bytes": 48 * MB, "keep_days": 10, "dialect": "sqlite"}


def test_a_database_that_grows_fast_and_a_large_journal_are_named_by_the_rules_of_the_panel() -> (
    None
):
    view = database_view(DATABASE, _sizes(3 * MB, 40 * MB), TODAY)
    assert view["state"] == 3 * 1024**3 + 48 * MB, "the files and the journal"
    assert view["growing_fast"] is True and view["wal_large"] is False
    assert view["change_days"] == 30 and view["change_bytes"] > 280 * MB
    assert len(view["history"]) == 40 and view["history"] == sorted(view["history"])
    assert view["per_day"] > 0 and view["keep_days"] == 10 and view["dialect"] == "sqlite"

    calm = database_view({**DATABASE, "wal_bytes": 1024**3}, _sizes(3 * MB, 3 * MB), TODAY)
    assert calm["growing_fast"] is False, "21 MB in a week is no growth to name"
    assert calm["wal_large"] is True, "a journal of a gigabyte is large"


def test_without_a_size_there_is_nothing_and_a_short_history_names_no_change() -> None:
    assert database_view(None, {}, TODAY) == {}
    assert database_view({"db_bytes": None}, {}, TODAY) == {}
    short = database_view(
        {"db_bytes": 5 * MB, "wal_bytes": None}, {TODAY.isoformat(): 5 * MB}, TODAY
    )
    assert (
        short["change_bytes"] is None
        and short["wal_bytes"] is None
        and short["growing_fast"] is False
    )
    assert short["state"] == 5 * MB


@pytest.fixture(autouse=True)
def _enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Let the tests find this integration."""


async def test_the_sensor_follows_what_the_scan_reads(hass) -> None:
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    await hass.config_entries.flow.async_configure(result["flow_id"], {})
    await hass.async_block_till_done(wait_background_tasks=True)
    scanner = loaded_scanner(hass)
    await scanner.async_scan()
    scanner.snapshot["meta"]["database"] = DATABASE
    today = datetime.now(UTC).date()
    scanner.events.sizes = {
        (today - timedelta(days=back)).isoformat(): 3 * 1024**3 + (30 - back) * MB
        for back in range(30, -1, -1)
    }
    async_dispatcher_send(hass, SIGNAL_SCAN_COMPLETE)
    await hass.async_block_till_done()
    state = hass.states.get("sensor.ha_housekeeper_database_size")
    assert state is not None and float(state.state) > 3 * 1024**3, "the state is in bytes"
    assert len(state.attributes["history"]) == 31 and state.attributes["growing_fast"] is False
