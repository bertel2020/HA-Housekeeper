"""When an orphaned statistic last received a value."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest

pytest.importorskip("homeassistant")
pytest.importorskip("pytest_homeassistant_custom_component")

from homeassistant.components.recorder.models import StatisticMeanType  # noqa: E402
from homeassistant.components.recorder.statistics import (  # noqa: E402
    async_add_external_statistics,
    async_import_statistics,
)
from homeassistant.core import HomeAssistant  # noqa: E402
from pytest_homeassistant_custom_component.components.recorder.common import (  # noqa: E402
    async_wait_recording_done,
)

from custom_components.ha_housekeeper.statistics_last import statistics_last  # noqa: E402


def seed(hass: HomeAssistant, statistic_id: str, hours: list[datetime], source: str = "recorder"):
    metadata = {
        "source": source,
        "statistic_id": statistic_id,
        "unit_class": None,
        "unit_of_measurement": "%",
        "has_sum": False,
        "name": None,
    }
    try:
        metadata["mean_type"] = StatisticMeanType.ARITHMETIC
    except Exception:  # noqa: BLE001
        metadata["has_mean"] = True
    importer = async_import_statistics if source == "recorder" else async_add_external_statistics
    importer(hass, metadata, [{"start": h, "mean": 1.0, "min": 1.0, "max": 1.0} for h in hours])


def snapshot(*ids: str) -> dict:
    return {"objects": [], "orphaned_statistics": [{"statistic_id": i} for i in ids]}


async def test_without_a_recorder_nothing_is_available(hass: HomeAssistant) -> None:
    result = await statistics_last(hass, snapshot("sensor.a"))
    assert result == {"available": False, "busy": False, "last": {}, "first": {}, "rows": {}}


async def test_the_newest_hourly_row_per_orphan(recorder_mock, hass: HomeAssistant) -> None:
    top = datetime.now(UTC).replace(minute=0, second=0, microsecond=0)
    old, newer = top - timedelta(days=40), top - timedelta(days=3)
    seed(hass, "sensor.gone", [old - timedelta(hours=2), old - timedelta(hours=1), old])
    seed(hass, "sensor.renamed", [newer - timedelta(hours=1), newer])
    seed(hass, "sensor.other", [top])  # not an orphan: not reported
    seed(hass, "hue:external", [top], source="hue")  # external statistics are ignored
    await async_wait_recording_done(hass)

    result = await statistics_last(
        hass, snapshot("sensor.gone", "sensor.renamed", "sensor.empty"), refresh=True
    )
    assert result["available"] is True and result["busy"] is False
    assert result["last"] == {
        "sensor.gone": old.timestamp(),
        "sensor.renamed": newer.timestamp(),
        "sensor.empty": None,
    }
    assert result["first"]["sensor.gone"] == (old - timedelta(hours=2)).timestamp()
    assert result["rows"] == {"sensor.gone": 3, "sensor.renamed": 2, "sensor.empty": 0}


async def test_a_busy_recorder_reports_busy(recorder_mock, hass: HomeAssistant) -> None:
    import asyncio

    from custom_components.ha_housekeeper.const import DOMAIN

    lock = hass.data.setdefault(DOMAIN, {}).setdefault("reliability_lock", asyncio.Lock())
    await lock.acquire()
    try:
        result = await statistics_last(hass, snapshot("sensor.a"), refresh=True)
    finally:
        lock.release()
    assert result["busy"] is True and result["last"] == {}


async def test_given_ids_are_answered_instead_of_the_orphans(
    recorder_mock, hass: HomeAssistant
) -> None:
    top = datetime.now(UTC).replace(minute=0, second=0, microsecond=0)
    seed(hass, "sensor.live", [top - timedelta(hours=1), top])
    await async_wait_recording_done(hass)
    result = await statistics_last(
        hass, snapshot("sensor.gone"), ["sensor.live", "sensor.none"], refresh=True
    )
    assert result["last"] == {"sensor.live": top.timestamp(), "sensor.none": None}
