"""The five-minute look of the central log: one part that hangs does not stop the others."""

from __future__ import annotations

import asyncio
from datetime import UTC, datetime, timedelta
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest

pytest.importorskip("homeassistant")
pytest.importorskip("pytest_homeassistant_custom_component")

from homeassistant.core import HomeAssistant  # noqa: E402

from custom_components.ha_housekeeper import central_log  # noqa: E402
from custom_components.ha_housekeeper.events import EventLog  # noqa: E402

NOW = datetime(2026, 11, 3, 12, 0, tzinfo=UTC)


def _scanner(hass: HomeAssistant) -> SimpleNamespace:
    return SimpleNamespace(
        events=EventLog(hass),
        attest=None,
        journal=SimpleNamespace(plans=[]),
        health_report=lambda: {"state": "ok"},
    )


async def test_a_backup_target_that_hangs_does_not_keep_the_system_and_the_scan_from_being_read(
    hass: HomeAssistant,
) -> None:
    async def hangs(*args: object) -> None:
        await asyncio.sleep(60)

    scanner = _scanner(hass)
    with (
        patch.object(central_log, "backup_health", hangs),
        patch.object(central_log, "BACKUP_HEALTH_TIMEOUT", 0.01),
        patch.object(central_log, "disk_usage", return_value={"percent": 40.0}),
        patch.object(central_log, "memory", return_value={"ram": {"percent": 40.0}}),
    ):
        await central_log.log_tick(hass, scanner, {}, NOW)
    assert {"system/disk", "system/memory", "scan/scan"} <= set(scanner.events.levels)


async def test_the_backup_targets_are_listed_now_and_then_and_a_run_is_seen_in_between(
    hass: HomeAssistant,
) -> None:
    scanner = _scanner(hass)
    listing = AsyncMock()
    memo: dict[str, datetime] = {}
    with (
        patch.object(central_log, "backup_health", listing),
        patch.object(central_log, "backup_running", return_value=False),
        patch.object(central_log, "disk_usage", return_value={"percent": 40.0}),
        patch.object(central_log, "memory", return_value={"ram": {"percent": 40.0}}),
    ):
        await central_log.log_tick(hass, scanner, memo, NOW)
        await central_log.log_tick(hass, scanner, memo, NOW + timedelta(minutes=5))
        assert listing.await_count == 1
        with patch.object(central_log, "backup_running", return_value=True):
            await central_log.log_tick(hass, scanner, memo, NOW + timedelta(minutes=10))
        assert scanner.events.backup_since is not None and listing.await_count == 1
        await central_log.log_tick(hass, scanner, memo, NOW + timedelta(minutes=15))
        assert listing.await_count == 2, "a run that ended is listed at once"
        await central_log.log_tick(hass, scanner, memo, NOW + timedelta(minutes=70))
        assert listing.await_count == 3
