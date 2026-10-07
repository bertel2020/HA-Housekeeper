"""Persistent first-seen observations for diagnoses."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY, STORAGE_VERSION


class ObservationStore:
    """Remember when Housekeeper first observed a classification."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._items: dict[str, dict[str, str]] = {}

    async def async_load(self) -> None:
        """Load observations."""
        data = await self._store.async_load()
        if isinstance(data, dict) and isinstance(data.get("items"), dict):
            self._items = data["items"]

    async def async_update(self, classifications: dict[str, str], observed_at: datetime) -> None:
        """Update classification periods and persist changed data."""
        timestamp = observed_at.isoformat()
        changed = False
        active_ids = set(classifications)

        for object_id, classification in classifications.items():
            previous = self._items.get(object_id)
            if previous is None or previous.get("classification") != classification:
                self._items[object_id] = {
                    "classification": classification,
                    "since": timestamp,
                }
                changed = True

        for object_id in set(self._items) - active_ids:
            del self._items[object_id]
            changed = True

        if changed:
            await self._store.async_save({"items": self._items})

    def since(self, object_id: str, classification: str) -> str | None:
        """Return the start of the current continuously observed classification."""
        item = self._items.get(object_id)
        if item and item.get("classification") == classification:
            return item.get("since")
        return None
