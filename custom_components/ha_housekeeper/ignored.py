"""Findings the user hid. Stored by Housekeeper only; Home Assistant objects stay untouched."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import IGNORED_STORAGE_KEY, STORAGE_VERSION

SAVE_DELAY = 10


class IgnoreStore:
    """Remember which findings are hidden."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, IGNORED_STORAGE_KEY)
        self._items: dict[str, str] = {}

    async def async_load(self) -> None:
        """Load hidden findings."""
        data = await self._store.async_load()
        if isinstance(data, dict) and isinstance(data.get("items"), dict):
            self._items = data["items"]

    def is_ignored(self, key: str) -> bool:
        """Whether the user hid this finding."""
        return key in self._items

    def set_ignored(self, key: str, ignored: bool, now: datetime) -> None:
        """Hide or show a finding and persist the change."""
        if ignored:
            self._items[key] = now.isoformat()
        elif self._items.pop(key, None) is None:
            return
        self._store.async_delay_save(lambda: {"items": self._items}, SAVE_DELAY)
