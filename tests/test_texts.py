"""The language of the notifications and logbook entries Housekeeper writes on its own."""

from __future__ import annotations

import re
from types import SimpleNamespace

import pytest

pytest.importorskip("homeassistant")

from custom_components.ha_housekeeper.cleanup_exec import LOGBOOK_DEVICE  # noqa: E402
from custom_components.ha_housekeeper.monitor import MONITOR_REASONS, MONITOR_TEXTS  # noqa: E402
from custom_components.ha_housekeeper.texts import language_of, match_language, pick  # noqa: E402


def hass(language: str) -> SimpleNamespace:
    return SimpleNamespace(config=SimpleNamespace(language=language))


def test_the_region_does_not_matter_and_english_is_the_fallback() -> None:
    assert language_of(hass("de_AT")) == language_of(hass("DE-ch")) == "de"
    assert pick(hass("de-AT"), LOGBOOK_DEVICE) is LOGBOOK_DEVICE["de"]
    assert pick(hass("it"), LOGBOOK_DEVICE) is LOGBOOK_DEVICE["en"]


def test_every_language_has_the_same_texts() -> None:
    assert MONITOR_TEXTS["de"].keys() == MONITOR_TEXTS["en"].keys()
    assert MONITOR_REASONS["de"].keys() == MONITOR_REASONS["en"].keys()


def test_a_language_is_found_by_its_pattern_and_never_by_a_wrong_main_part() -> None:
    langs = [
        {"code": "pt", "patterns": ["pt", "pt-br"]},
        {"code": "zh-Hans", "patterns": ["zh-hans", "zh-cn"]},
    ]
    assert [match_language(c, langs) for c in ("pt_BR", "pt-PT", "zh-Hans", "zh_CN")] == [
        "pt",
        "pt",
        "zh-Hans",
        "zh-Hans",
    ]
    assert [match_language(c, langs) for c in ("zh-Hant", "fr", None)] == ["en", "en", "en"]


def test_a_text_missing_in_a_language_shows_in_english(monkeypatch: pytest.MonkeyPatch) -> None:
    table = {"en": {"a": "A", "b": "B"}, "fr": {"a": "À"}}
    monkeypatch.setattr("custom_components.ha_housekeeper.texts.language_of", lambda _hass: "fr")
    assert pick(hass("fr"), table) == {"a": "À", "b": "B"}
    monkeypatch.setattr("custom_components.ha_housekeeper.texts.language_of", lambda _hass: "en")
    assert pick(hass("en"), table) is table["en"]


def _holders(value: object) -> list[str]:
    if isinstance(value, dict):
        return [h for v in value.values() for h in _holders(v)]
    if isinstance(value, (list, tuple)):
        return [h for v in value for h in _holders(v)]
    return sorted(re.findall(r"\{\w*\}", str(value)))


def _same_shape(english: object, other: object) -> bool:
    if isinstance(english, dict):
        return (
            isinstance(other, dict)
            and english.keys() == other.keys()
            and all(_same_shape(english[k], other[k]) for k in english)
        )
    if isinstance(english, (list, tuple)):
        return (
            type(other) is type(english)
            and len(other) == len(english)
            and all(_same_shape(a, b) for a, b in zip(english, other, strict=True))
        )
    return isinstance(other, str)


def test_every_listed_language_has_complete_backend_texts_with_the_same_placeholders() -> None:
    """locales/<code>.json fills the text tables of the code; each entry has the shape of the English one."""
    from custom_components.ha_housekeeper import audit_report, auto_pause, notify
    from custom_components.ha_housekeeper.texts import LANGUAGE_CODES

    tables = [
        audit_report.TEXTS,
        auto_pause.TEXTS,
        MONITOR_REASONS,
        MONITOR_TEXTS,
        notify.TEXTS,
        LOGBOOK_DEVICE,
    ]
    for code in (c for c in LANGUAGE_CODES if c not in ("de", "en")):
        for table in tables:
            assert code in table, code
            assert _same_shape(table["en"], table[code]), code
            assert _holders(table["en"]) == _holders(table[code]), code
