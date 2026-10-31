"""What is new on the access page, and what was meant to be so.

Stored by Housekeeper only, per integration entry: the level it was given, when it was first seen
(empty for the first look: that is "before tracking", never new) and, when somebody said so, that
its access is meant to be so. Never a value, a detail of an access or a name, only the entry id and
a level. A level that rises lifts the decision, and a rise is shown for a while like a new entry.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import ACCESS_STATE_STORAGE_KEY, STORAGE_VERSION

SAVE_DELAY = 10
NEW_DAYS = 14  # how long an entry counts as new, or as risen
ITEM_LIMIT = 2000
REASON_LIMIT = 200  # characters
RANK = {"low": 0, "medium": 1, "high": 2}


def _clock(value: Any) -> str:
    return value if isinstance(value, str) else ""


class AccessState:
    """Remember the level and first sight of each integration entry, and what is meant to be so."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, ACCESS_STATE_STORAGE_KEY)
        self._seen: dict[str, dict[str, str]] = {}
        self._known: dict[str, dict[str, str]] = {}
        self._tracking = False  # until a first look: what is found is "before tracking"

    async def async_load(self) -> None:
        data = await self._store.async_load()
        if not isinstance(data, dict):
            return
        for key, entry in (data.get("seen") if isinstance(data.get("seen"), dict) else {}).items():
            if isinstance(key, str) and isinstance(entry, dict) and entry.get("level") in RANK:
                self._seen[key] = {
                    "level": entry["level"],
                    "first": _clock(entry.get("first")),
                    "raised": _clock(entry.get("raised")),
                }
        for key, entry in (
            data.get("known") if isinstance(data.get("known"), dict) else {}
        ).items():
            if isinstance(key, str) and isinstance(entry, dict) and entry.get("level") in RANK:
                self._known[key] = {
                    "level": entry["level"],
                    "at": _clock(entry.get("at")),
                    "reason": _clock(entry.get("reason"))[:REASON_LIMIT],
                }
        self._tracking = bool(self._seen)

    def annotate(self, entries: list[dict[str, Any]], now: datetime) -> None:
        """Add ``change`` ("new" or "raised"), ``change_at`` and ``known`` to each entry, and note them."""
        changed = False
        present = set()
        for entry in entries:
            key, level = entry.get("entry_id"), entry.get("risk")
            if not isinstance(key, str) or level not in RANK:
                continue
            present.add(key)
            seen = self._seen.get(key)
            if seen is None:
                if len(self._seen) >= ITEM_LIMIT:
                    continue
                seen = self._seen[key] = {
                    "level": level,
                    "first": now.isoformat() if self._tracking else "",
                    "raised": "",
                }
                changed = True
            elif RANK[level] > RANK[seen["level"]]:
                seen["level"], seen["raised"] = level, now.isoformat()
                changed = True
            elif level != seen["level"]:
                seen["level"] = level
                changed = True
            known = self._known.get(key)
            if known and RANK[level] > RANK[known["level"]]:
                del self._known[key]
                known = None
                changed = True
            entry["known"] = {"at": known["at"], "reason": known["reason"]} if known else None
            entry["change"], entry["change_at"] = self._change(seen, level, now)
        if present:
            for key in self._seen.keys() - present:
                del self._seen[key]
                self._known.pop(key, None)
                changed = True
        if not self._tracking or changed:
            self._tracking = True
            self._save()

    @staticmethod
    def _change(seen: dict[str, str], level: str, now: datetime) -> tuple[str | None, str | None]:
        if level == "low":
            return None, None
        for kind, stamp in (("new", seen["first"]), ("raised", seen["raised"])):
            if stamp:
                try:
                    if now - datetime.fromisoformat(stamp) <= timedelta(days=NEW_DAYS):
                        return kind, stamp
                except ValueError:
                    continue
        return None, None

    def set_known(self, key: str, known: bool, reason: str, now: datetime) -> bool:
        """Say that the access of an entry is meant to be so, or take that back; False for an unknown entry."""
        seen = self._seen.get(key)
        if seen is None:
            return False
        if known:
            self._known[key] = {
                "level": seen["level"],
                "at": now.isoformat(),
                "reason": reason[:REASON_LIMIT],
            }
        else:
            self._known.pop(key, None)
        self._save()
        return True

    def _save(self) -> None:
        self._store.async_delay_save(lambda: {"seen": self._seen, "known": self._known}, SAVE_DELAY)
