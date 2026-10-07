"""Repairs hints. One aggregated, non-fixable issue per finding category."""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir

from .const import DOMAIN, PANEL_URL

ISSUE_IDS = ("orphaned_entities", "unavailable_entities", "broken_automations")


def _category(finding: dict[str, Any]) -> str:
    if finding["rule_id"].startswith(("automation.", "script.", "scene.", "dashboard.")):
        return "broken_automations"
    if finding["classification"] == "orphaned":
        return "orphaned_entities"
    return "unavailable_entities"


def async_sync_issues(hass: HomeAssistant, findings: list[dict[str, Any]]) -> None:
    """Create, update or clear the hints. Housekeeper never offers a fix."""
    counts = dict.fromkeys(ISSUE_IDS, 0)
    for finding in findings:
        # Duplicate suspects and unused automations are hints for the panel, not repairs.
        if finding["classification"] not in {"possible_duplicate", "unused"}:
            counts[_category(finding)] += 1

    for issue_id, count in counts.items():
        if count:
            ir.async_create_issue(
                hass,
                DOMAIN,
                issue_id,
                is_fixable=False,
                learn_more_url=f"/{PANEL_URL}",
                severity=ir.IssueSeverity.WARNING,
                translation_key=issue_id,
                translation_placeholders={"count": str(count)},
            )
        else:
            ir.async_delete_issue(hass, DOMAIN, issue_id)


def async_clear_issues(hass: HomeAssistant) -> None:
    """Remove all hints, for example when the integration is unloaded."""
    for issue_id in ISSUE_IDS:
        ir.async_delete_issue(hass, DOMAIN, issue_id)
