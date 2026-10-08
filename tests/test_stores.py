"""Every store of Housekeeper: bad data on disk never stops loading, and changes survive a reload."""

from __future__ import annotations

from datetime import UTC, date, datetime, timedelta

import pytest

pytest.importorskip("homeassistant")
pytest.importorskip("pytest_homeassistant_custom_component")

from homeassistant.core import HomeAssistant  # noqa: E402
from pytest_homeassistant_custom_component.common import async_fire_time_changed  # noqa: E402

from custom_components.ha_housekeeper import const  # noqa: E402
from custom_components.ha_housekeeper.backup_health import AttestStore  # noqa: E402
from custom_components.ha_housekeeper.cleanup import JournalStore  # noqa: E402
from custom_components.ha_housekeeper.events import EventLog  # noqa: E402
from custom_components.ha_housekeeper.history import ScanHistory  # noqa: E402
from custom_components.ha_housekeeper.ignored import IgnoreStore  # noqa: E402
from custom_components.ha_housekeeper.maintenance import PreflightStore  # noqa: E402
from custom_components.ha_housekeeper.observations import ObservationStore  # noqa: E402
from custom_components.ha_housekeeper.runs import RunStore  # noqa: E402

STORES = [
    (ObservationStore, const.STORAGE_KEY),
    (IgnoreStore, const.IGNORED_STORAGE_KEY),
    (ScanHistory, const.HISTORY_STORAGE_KEY),
    (JournalStore, const.JOURNAL_STORAGE_KEY),
    (PreflightStore, const.PREFLIGHT_STORAGE_KEY),
    (AttestStore, const.ATTEST_STORAGE_KEY),
    (EventLog, const.EVENTS_STORAGE_KEY),
    (RunStore, const.RUNS_STORAGE_KEY),
]
GARBAGE = [
    "text",
    7,
    [1, "a"],
    {},
    {"items": "no", "events": "no", "plans": "no", "record": "no", "days": "no", "sizes": "no"},
    {"items": {"x": 1}, "events": [1, None, {"kind": "start"}], "plans": [1, "a"], "record": [1]},
    {"latest": "x", "previous": 5, "daily": "d"},
    {"since": 3, "items": {"automation.a": {"days": "no", "seen": 5}}},
    {"sizes": {"2026-10-08": "big", "x": -4}, "heartbeat": 5, "versions": "v"},
]


def put(hass_storage, key: str, data) -> None:
    hass_storage[key] = {
        "version": const.STORAGE_VERSION,
        "minor_version": 1,
        "key": key,
        "data": data,
    }


@pytest.mark.parametrize(("cls", "key"), STORES, ids=lambda v: getattr(v, "__name__", v))
@pytest.mark.parametrize("garbage", GARBAGE, ids=range(len(GARBAGE)))
async def test_bad_data_on_disk_never_stops_loading(
    hass: HomeAssistant, hass_storage, cls, key: str, garbage
) -> None:
    put(hass_storage, key, garbage)
    store = cls(hass)
    await store.async_load()  # must not raise


async def flush(hass: HomeAssistant) -> None:
    async_fire_time_changed(hass, datetime.now(UTC) + timedelta(hours=1))
    await hass.async_block_till_done()


async def test_ignored_findings_survive_a_reload(hass: HomeAssistant, hass_storage) -> None:
    store = IgnoreStore(hass)
    await store.async_load()
    store.set_ignored("rule|a", True, datetime.now(UTC))
    await flush(hass)
    again = IgnoreStore(hass)
    await again.async_load()
    assert again.is_ignored("rule|a") and not again.is_ignored("rule|b")
    again.set_ignored("rule|a", False, datetime.now(UTC))
    await flush(hass)
    third = IgnoreStore(hass)
    await third.async_load()
    assert not third.is_ignored("rule|a")


async def test_observations_survive_a_reload_and_forget_what_is_gone(
    hass: HomeAssistant, hass_storage
) -> None:
    store = ObservationStore(hass)
    await store.async_load()
    now = datetime.now(UTC)
    await store.async_update({"sensor.a": "unavailable", "sensor.b": "unused"}, now)
    await flush(hass)
    again = ObservationStore(hass)
    await again.async_load()
    assert again.since("sensor.a", "unavailable") == now.isoformat()
    assert again.since("sensor.a", "unused") is None
    await again.async_update({"sensor.a": "unavailable"}, now + timedelta(days=1))
    await flush(hass)
    third = ObservationStore(hass)
    await third.async_load()
    assert third.since("sensor.b", "unused") is None


async def test_the_attestation_survives_a_reload(hass: HomeAssistant, hass_storage) -> None:
    store = AttestStore(hass)
    await store.async_load()
    store.set("restore_test", date(2026, 9, 1))
    await flush(hass)
    again = AttestStore(hass)
    await again.async_load()
    assert again.record["restore_test"].startswith("2026-09-01")
    again.clear("restore_test")
    await flush(hass)
    third = AttestStore(hass)
    await third.async_load()
    assert third.record["restore_test"] is None


async def test_the_event_log_survives_a_reload_and_stays_bounded(
    hass: HomeAssistant, hass_storage
) -> None:
    log = EventLog(hass)
    await log.async_load()
    now = datetime.now(UTC)
    log.record_start(now)
    log.record_size("2026-10-08", 1234)
    log.observe("2026.9.4", {"demo": "1.0"}, now)
    log.observe("2026.10.0", {"demo": "1.1"}, now + timedelta(days=1))
    await log._store.async_save(log._data())  # its delayed save waits five minutes
    again = EventLog(hass)
    await again.async_load()
    assert [e["kind"] for e in again.events] == ["start", "ha_version", "entry_version"]
    assert again.sizes == {"2026-10-08": 1234} and again.heartbeat
    assert again.versions == {"ha": "2026.10.0", "entries": {"demo": "1.1"}}
    for n in range(200):
        again.record("plan", now + timedelta(seconds=n), n=n)
    assert len(again.events) <= 5000


async def test_the_history_survives_a_reload(hass: HomeAssistant, hass_storage) -> None:
    history = ScanHistory(hass)
    await history.async_load()
    snapshot = {
        "meta": {"scanned_at": "2026-10-07T10:00:00+00:00", "object_count": 1},
        "objects": [],
        "findings": [],
    }
    history.record(snapshot)
    await flush(hass)
    again = ScanHistory(hass)
    await again.async_load()
    assert again.baselines() is not None
    again.record(
        {**snapshot, "meta": {**snapshot["meta"], "scanned_at": "2026-10-08T10:00:00+00:00"}}
    )
    assert again._previous["at"].startswith("2026-10-07")


@pytest.mark.parametrize(
    "garbage", [{"latest": "x", "previous": 5, "daily": "d"}, {"daily": [1, {"at": 3}]}]
)
async def test_a_history_with_bad_content_still_records_and_compares(
    hass: HomeAssistant, hass_storage, garbage
) -> None:
    put(hass_storage, const.HISTORY_STORAGE_KEY, garbage)
    history = ScanHistory(hass)
    await history.async_load()
    snapshot = {
        "meta": {"scanned_at": "2026-10-08T10:00:00+00:00", "object_count": 0},
        "objects": [],
        "findings": [],
    }
    history.record(snapshot)
    history.record(
        {**snapshot, "meta": {**snapshot["meta"], "scanned_at": "2026-10-09T10:00:00+00:00"}}
    )
    assert isinstance(history.baselines(), list)
