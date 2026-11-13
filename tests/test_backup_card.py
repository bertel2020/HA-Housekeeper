"""The numbers behind the backup card: the verdict follows the checks of the backup protection, red is only for a missing protection."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest

pytest.importorskip("homeassistant")

from homeassistant import config_entries  # noqa: E402
from homeassistant.helpers.dispatcher import async_dispatcher_send  # noqa: E402

from custom_components.ha_housekeeper.backup_card import backup_view  # noqa: E402
from custom_components.ha_housekeeper.backup_health import evaluate  # noqa: E402
from custom_components.ha_housekeeper.const import DOMAIN, SIGNAL_SCAN_COMPLETE  # noqa: E402
from custom_components.ha_housekeeper.runtime import loaded_scanner  # noqa: E402

NOW = datetime(2026, 11, 12, 12, 0, tzinfo=UTC)
ATTEST = {"emergency_kit": NOW.isoformat(), "restore_test": NOW.isoformat()}


def _backup(days_ago: int, agents=("hassio.local", "cloud.cloud"), **extra) -> dict:
    day = (NOW - timedelta(days=days_ago)).replace(hour=3)
    return {
        "date": day.isoformat(),
        "size": 1000,
        "agents": sorted(agents),
        "failed_agents": [],
        "protected": True,
        "automatic": True,
        **extra,
    }


def _report(backups: list[dict], attest: dict | None = None, **config) -> dict:
    state = {
        "available": True,
        "config": {
            "agent_ids": ["hassio.local", "cloud.cloud"],
            "encrypted": True,
            "copies": 3,
            "days": None,
            "recurrence": "daily",
            "last_attempted": backups[0]["date"] if backups else None,
            "last_completed": backups[0]["date"] if backups else None,
            **config,
        },
        "backups": backups,
        "agent_errors": [],
        "disk_free": 10_000_000,
    }
    return evaluate(state, NOW, ATTEST if attest is None else attest, [])


def test_a_fresh_backup_with_a_copy_off_the_device_is_in_order_and_the_week_is_full() -> None:
    view = backup_view(_report([_backup(day) for day in range(7)]), NOW)
    assert view["state"] == "ok" and view["external_copy"] is True and view["external_count"] == 1
    assert view["age_hours"] == 9.0 and view["limit_hours"] == 36
    assert view["history"] == ["ok"] * 7 and view["failed_days"] == 0
    assert view["size"] == 1000 and view["size_unusual"] is False and view["encrypted"] is True


def test_an_old_backup_or_a_failed_copy_is_a_hint_but_a_missing_protection_is_red() -> None:
    old = backup_view(_report([_backup(day) for day in range(3, 9)]), NOW)
    assert old["state"] == "warn", "three days is past the limit of 36 hours, but a copy exists"
    assert old["history"][-3:] == ["none"] * 3 and old["history"][0] == "ok"

    partly = backup_view(
        _report(
            [_backup(0, failed_agents=["cloud.cloud"]), *[_backup(day) for day in range(1, 7)]]
        ),
        NOW,
    )
    assert (
        partly["state"] == "warn"
        and partly["failed_days"] == 1
        and partly["history"][-1] == "failed"
    )

    local = backup_view(_report([_backup(day, agents=("hassio.local",)) for day in range(7)]), NOW)
    assert local["state"] == "bad" and local["external_copy"] is False

    nothing = backup_view(_report([]), NOW)
    assert (
        nothing["state"] == "bad"
        and nothing["age_hours"] is None
        and nothing["history"] == ["none"] * 7
    )


def test_the_report_that_is_missing_or_cannot_be_judged_is_unclear_not_green() -> None:
    assert backup_view(None, NOW) == {}, "before the first scan there is nothing"
    assert backup_view({"available": False, "checks": []}, NOW)["state"] == "unclear"
    outside = backup_view(
        _report([_backup(0)], attest={**ATTEST, "external": NOW.isoformat()}), NOW
    )
    assert outside["state"] == "unclear" and outside["outside"] is True


@pytest.fixture(autouse=True)
def _enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Let the tests find this integration."""


async def test_the_sensor_follows_the_backup_report_of_the_scan(hass) -> None:
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    await hass.config_entries.flow.async_configure(result["flow_id"], {})
    await hass.async_block_till_done(wait_background_tasks=True)
    scanner = loaded_scanner(hass)
    scanner.backup_report = None
    async_dispatcher_send(hass, SIGNAL_SCAN_COMPLETE)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.ha_housekeeper_backup_protection").state == "unknown"

    now = datetime.now(UTC)
    fresh = {**_backup(0), "date": (now - timedelta(hours=5)).isoformat()}
    scanner.backup_report = evaluate(
        {
            "available": True,
            "config": {
                "agent_ids": ["hassio.local", "cloud.cloud"],
                "encrypted": True,
                "copies": 3,
                "days": None,
                "recurrence": "daily",
                "last_attempted": fresh["date"],
                "last_completed": fresh["date"],
            },
            "backups": [fresh],
            "agent_errors": [],
            "disk_free": 10_000_000,
        },
        now,
        {"emergency_kit": now.isoformat(), "restore_test": now.isoformat()},
        [],
    )
    async_dispatcher_send(hass, SIGNAL_SCAN_COMPLETE)
    await hass.async_block_till_done()
    state = hass.states.get("sensor.ha_housekeeper_backup_protection")
    assert state.state == "ok" and state.attributes["external_copy"] is True
