"""The language of what Housekeeper writes on its own: notifications and logbook entries.

The languages are listed in `languages.json`, which the panel uses too. A text table is picked with
`pick`; a language without an entry, or without a single text of an entry, falls back to English.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant

LANGUAGES: list[dict[str, Any]] = json.loads(
    (Path(__file__).parent / "languages.json").read_text(encoding="utf-8")
)
LANGUAGE_CODES: list[str] = [lang["code"] for lang in LANGUAGES]


def match_language(code: str | None, languages: list[dict[str, Any]] = LANGUAGES) -> str:
    """The language for a Home Assistant language code: an exact match of a pattern, else its main
    part (de-AT is de), else English. zh-Hant does not fall to zh-Hans.
    """
    full = str(code or "en").lower().replace("_", "-")
    for key in (full, full.split("-")[0]):
        for lang in languages:
            if key in lang["patterns"]:
                return str(lang["code"])
    return "en"


def language_of(hass: HomeAssistant) -> str:
    """The language Home Assistant speaks, as one of the languages of Housekeeper."""
    return match_language(hass.config.language)


def pick[T](hass: HomeAssistant, table: dict[str, T]) -> T:
    """The entry of the language of Home Assistant, else the English one.

    An entry that is a dict is completed from the English one, so a text still missing in a new
    language shows in English instead of failing.
    """
    code = language_of(hass)
    entry = table.get(code, table["en"])
    english = table["en"]
    if isinstance(entry, dict) and isinstance(english, dict) and not english.keys() <= entry.keys():
        return {**english, **entry}  # type: ignore[return-value]
    return entry
