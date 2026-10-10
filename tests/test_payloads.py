"""The descriptions in payloads.py name the fields the code really sends."""

from __future__ import annotations

from datetime import UTC, datetime

from homeassistant.core import HomeAssistant

from custom_components.ha_housekeeper.cleanup import plan_summary
from custom_components.ha_housekeeper.inventory import InventoryScanner
from custom_components.ha_housekeeper.notes import NoteStore
from custom_components.ha_housekeeper.payloads import Note, PlanSummary, Snapshot


async def test_the_described_fields_are_the_fields_sent(hass: HomeAssistant) -> None:
    scanner = InventoryScanner(hass)
    await scanner.async_initialize()
    snapshot = await scanner.async_scan()
    assert set(snapshot) == set(Snapshot.__required_keys__)

    notes = NoteStore(hass)
    notes.upsert(None, "Router", "2026-10-09T20:15:00+00:00", "", "", datetime.now(UTC))
    assert set(notes.view()[0]) == set(Note.__required_keys__)

    assert set(plan_summary({"plan_id": "p", "actions": []})) == set(PlanSummary.__required_keys__)
