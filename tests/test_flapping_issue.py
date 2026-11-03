"""The repair hint that shows while a check keeps changing its level."""

from __future__ import annotations

import pytest

pytest.importorskip("homeassistant")

from homeassistant.core import HomeAssistant  # noqa: E402
from homeassistant.helpers import issue_registry as ir  # noqa: E402

from custom_components.ha_housekeeper.const import DOMAIN  # noqa: E402
from custom_components.ha_housekeeper.issues import (  # noqa: E402
    FLAPPING_ISSUE_ID,
    async_sync_flapping_issue,
)


def _issue(hass: HomeAssistant):
    return ir.async_get(hass).async_get_issue(DOMAIN, FLAPPING_ISSUE_ID)


async def test_the_hint_shows_while_a_check_flaps_and_goes_with_it(hass: HomeAssistant) -> None:
    async_sync_flapping_issue(hass, [])
    assert _issue(hass) is None
    async_sync_flapping_issue(hass, ["system/memory", "backup/newest"])
    issue = _issue(hass)
    assert issue is not None and issue.translation_placeholders["count"] == "2"
    async_sync_flapping_issue(hass, [])
    assert _issue(hass) is None
