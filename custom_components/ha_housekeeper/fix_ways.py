"""The ways to fix a finding: what Housekeeper can offer for it, the recommended one first.

Only names the ways; nothing here changes anything. A way is a note to wait, a link into Home Assistant
or a step of the panel that has its own preview and confirmation. The three exits (intended, later, hidden)
come with every finding and are not listed.
"""

from __future__ import annotations

from typing import Any

from .finding_topics import DOWN

WAIT_STATES = ("setup_retry", "setup_in_progress")
RESTART_STATES = ("migration_error", "failed_unload")


def _domain(snapshot: dict[str, Any], entry_id: str) -> str | None:
    for item in snapshot.get("objects", []):
        if item["object_type"] == "config_entry" and item["object_id"] == entry_id:
            return item.get("domain")
    return None


def _way(way: str, kind: str, recommended: bool = False, **fields: Any) -> dict[str, Any]:
    return {"way": way, "kind": kind, "recommended": recommended, **fields}


def ways_for(finding: dict[str, Any], snapshot: dict[str, Any]) -> list[dict[str, Any]]:
    """The ways for one finding of the topic "down"; other topics have none yet."""
    if finding.get("topic") != DOWN:
        return []
    rule = finding["rule_id"]
    ways: list[dict[str, Any]] = []
    if rule == "config_entry.not_loaded":
        state = ((finding.get("evidence") or [{}])[0]).get("kind")
        domain = _domain(snapshot, finding["object_id"])
        page = f"/config/integrations/integration/{domain}" if domain else "/config/integrations"
        if state in WAIT_STATES:
            ways.append(_way("wait", "info", True))
        elif state in RESTART_STATES:
            ways.append(_way("restart_or_update", "info", True))
        ways.append(
            _way(
                "open_integration", "link", state not in (*WAIT_STATES, *RESTART_STATES), path=page
            )
        )
        ways.append(_way("mark", "panel"))
    elif rule == "config_entry.reauth":
        domain = _domain(snapshot, finding["object_id"])
        page = f"/config/integrations/integration/{domain}" if domain else "/config/integrations"
        ways.append(_way("reauth", "link", True, path=page))
        ways.append(_way("mark", "panel"))
    elif rule == "device.down":
        ways.extend(
            [
                _way("mark", "panel", True),
                _way("exchange", "panel"),
                _way("object_actions", "panel"),
            ]
        )
    elif rule == "app.stopped_in_use":
        ways.extend([_way("start_app", "info", True), _way("mark", "panel")])
    else:  # an entity without a value, or silent
        ways.extend(
            [
                _way("mark", "panel", True),
                _way("replace_entity", "panel"),
                _way("object_actions", "panel"),
            ]
        )
    return ways
