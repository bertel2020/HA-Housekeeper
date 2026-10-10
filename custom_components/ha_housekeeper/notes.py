"""Entries you write yourself in the history: "Zigbee stick replaced", "router updated".

Housekeeper only keeps the title, the time, an optional note and an optional object the entry
concerns. It changes nothing in Home Assistant. The entries show in the history of the changes and
count as an event for the correlation, which words it as "at about the same time", never as a cause.
"""

from __future__ import annotations

import secrets
from datetime import UTC, datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import NOTES_STORAGE_KEY, STORAGE_VERSION

SAVE_DELAY = 5
MAX_ITEMS = 200
TITLE_MAX = 80
NOTE_MAX = 500
TARGET_MAX = 300
FUTURE_SLACK = timedelta(days=1)


class NoteError(Exception):
    """The input was not accepted; the message names the field."""


def _parse(value: Any) -> datetime | None:
    if not isinstance(value, str):
        return None
    try:
        parsed = datetime.fromisoformat(value)
    except ValueError:
        return None
    return parsed if parsed.tzinfo else parsed.replace(tzinfo=UTC)


class NoteStore:
    """The entries, kept until they are deleted."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, NOTES_STORAGE_KEY)
        self.items: list[dict[str, Any]] = []

    async def async_load(self) -> None:
        data = await self._store.async_load()
        items = data.get("items") if isinstance(data, dict) else None
        for item in items if isinstance(items, list) else ():
            if (
                isinstance(item, dict)
                and isinstance(item.get("id"), str)
                and isinstance(item.get("title"), str)
                and _parse(item.get("at"))
            ):
                self.items.append(
                    {
                        "id": item["id"],
                        "title": item["title"][:TITLE_MAX],
                        "at": item["at"],
                        "target": str(item.get("target") or "")[:TARGET_MAX],
                        "note": str(item.get("note") or "")[:NOTE_MAX],
                    }
                )
        del self.items[MAX_ITEMS:]

    def _save(self) -> None:
        self._store.async_delay_save(lambda: {"items": self.items}, SAVE_DELAY)

    def upsert(
        self,
        item_id: str | None,
        title: str,
        at: str,
        target: str,
        note: str,
        now: datetime,
    ) -> str:
        title = title.strip()
        if not title or len(title) > TITLE_MAX:
            raise NoteError("title")
        when = _parse(at)
        if when is None or when > now + FUTURE_SLACK:
            raise NoteError("at")
        if len(note) > NOTE_MAX:
            raise NoteError("note")
        if len(target) > TARGET_MAX:
            raise NoteError("target")
        if item_id is None:
            if len(self.items) >= MAX_ITEMS:
                raise NoteError("too_many")
            item_id = secrets.token_hex(6)
            self.items.append({"id": item_id})  # type: ignore[typeddict-item]
        item = next((i for i in self.items if i["id"] == item_id), None)
        if item is None:
            raise NoteError("not_found")
        item.update(title=title, at=when.isoformat(), target=target, note=note.strip())
        self._save()
        return item_id

    def delete(self, item_id: str) -> None:
        before = len(self.items)
        self.items = [i for i in self.items if i["id"] != item_id]
        if len(self.items) == before:
            raise NoteError("not_found")
        self._save()

    def view(self) -> list[dict[str, Any]]:
        """Every entry, newest first."""
        return sorted(self.items, key=lambda i: i["at"], reverse=True)

    def as_events(self) -> list[dict[str, Any]]:
        """The entries as events for the correlation (the id stands in for the domain)."""
        return [
            {"kind": "note", "at": i["at"], "domain": i["id"], "title": i["title"]}
            for i in self.items
        ]
