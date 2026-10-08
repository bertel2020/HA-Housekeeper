"""The message about new broken references: off by default, each finding once, nothing old on switch-on."""

from __future__ import annotations

import pytest

pytest.importorskip("homeassistant")
pytest.importorskip("pytest_homeassistant_custom_component")

from homeassistant.core import HomeAssistant  # noqa: E402

from custom_components.ha_housekeeper.notify import NotifyStore, async_announce  # noqa: E402


def finding(key: str, classification: str = "broken_reference", **fields) -> dict:
    return {
        "key": key,
        "classification": classification,
        "object_id": f"automation.{key}",
        **fields,
    }


async def test_only_new_broken_findings_are_announced_once(hass: HomeAssistant) -> None:
    store = NotifyStore(hass)
    assert store.new([finding("a")]) == []  # off
    store.set_enabled(True, [finding("a")])
    assert store.new([finding("a")]) == []  # existing at switch-on
    fresh = store.new(
        [finding("a"), finding("b"), finding("c", "orphaned"), finding("d", ignored=True)]
    )
    assert [f["key"] for f in fresh] == ["b"]
    assert store.new([finding("a"), finding("b")]) == []  # announced already
    store.new([finding("a")])  # b is fixed
    assert [f["key"] for f in store.new([finding("a"), finding("b")])] == ["b"]  # and breaks again


async def test_the_notification_names_the_findings(hass: HomeAssistant) -> None:
    hass.config.language = "de"
    async_announce(hass, [finding("a", affected_object="light.x")])
    await hass.async_block_till_done()
    notes = hass.data["persistent_notification"]
    assert any("light.x" in n["message"] for n in notes.values())
