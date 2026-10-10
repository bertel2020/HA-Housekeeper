"""Sensors that report nothing new any more: limits, the restart rule and the finding."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest

pytest.importorskip("homeassistant")

from custom_components.ha_housekeeper.stale import StaleStore  # noqa: E402

NOW = datetime(2026, 10, 10, 12, tzinfo=UTC)
STARTED = NOW - timedelta(hours=1)
CUTOFF = STARTED + timedelta(minutes=5)


def _store() -> StaleStore:
    store = StaleStore.__new__(StaleStore)
    store.anchors, store.limits, store.heartbeat, store._shifted = {}, {}, None, False
    store._save = lambda: None  # type: ignore[method-assign]
    return store


def _item(entity_id="sensor.t", reported=None, **extra):
    return {
        "object_id": entity_id,
        "status": "active",
        "state_class": "measurement",
        "last_reported": (reported or NOW).isoformat(),
        "last_updated": (reported or NOW).isoformat(),
        **extra,
    }


def test_limits_default_override_and_off():
    store = _store()
    assert store.limit_hours(_item(), 48) == 48
    assert store.limit_hours(_item(state_class=None), 48) is None  # not a measuring sensor
    assert store.limit_hours(_item("binary_sensor.door", state_class=None), 48) is None
    store.limits = {"binary_sensor.door": 72, "sensor.t": 0}
    assert store.limit_hours(_item("binary_sensor.door", state_class=None), 48) == 72
    assert store.limit_hours(_item(), 48) is None
    assert store.limit_hours(_item(), 0) is None


def test_a_report_restored_at_startup_is_no_activity():
    store = _store()
    old = NOW - timedelta(days=5)
    store.anchors = {"sensor.t": old.isoformat()}
    store.observe([_item(reported=STARTED)], NOW, STARTED, CUTOFF, 48)
    assert store.anchors["sensor.t"] == old.isoformat()
    assert [f["object_id"] for f in store.findings([_item(reported=STARTED)], NOW, 48)] == [
        "sensor.t"
    ]


def test_a_report_after_the_warm_up_is_activity_and_a_new_sensor_starts_now():
    store = _store()
    store.anchors = {"sensor.t": (NOW - timedelta(days=5)).isoformat()}
    store.observe([_item(), _item("sensor.new", reported=STARTED)], NOW, STARTED, CUTOFF, 48)
    assert store.anchors["sensor.t"] == NOW.isoformat()
    assert store.anchors["sensor.new"] == NOW.isoformat()
    assert store.findings([_item()], NOW, 48) == []


def test_downtime_does_not_count_and_unavailable_sensors_are_forgotten():
    store = _store()
    store.heartbeat = (STARTED - timedelta(hours=40)).isoformat()
    store.anchors = {
        "sensor.t": (STARTED - timedelta(hours=44)).isoformat(),
        "sensor.gone": NOW.isoformat(),
    }
    store.observe([_item(reported=STARTED)], NOW, STARTED, CUTOFF, 48)
    assert store.anchors["sensor.t"] == (STARTED - timedelta(hours=4)).isoformat()
    assert "sensor.gone" not in store.anchors
    assert store.findings([_item(reported=STARTED)], NOW, 48) == []
