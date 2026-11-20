"""The ways to fix a finding: what Housekeeper can offer for it, the recommended one first.

Only names the ways; nothing here changes anything. A way is a note to wait, a link into Home Assistant
or a step of the panel that has its own preview and confirmation. The three exits (intended, later, hidden)
come with every finding and are not listed.
"""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

from .finding_topics import BROKEN_REFERENCES, DOWN, FAILING_AUTOMATIONS, UNNEEDED

WAIT_STATES = ("setup_retry", "setup_in_progress", "paused")
QUIET_OUTAGE_DAYS = 7  # a device that has been down this long, with (almost) nothing on it, is most likely off on purpose
QUIET_OUTAGE_FOLLOWERS = 2
RESTART_STATES = ("migration_error", "failed_unload")


def _domain(snapshot: dict[str, Any], entry_id: str) -> str | None:
    for item in snapshot.get("objects", []):
        if item["object_type"] == "config_entry" and item["object_id"] == entry_id:
            return item.get("domain")
    return None


def _quiet_outage(finding: dict[str, Any], snapshot: dict[str, Any]) -> bool:
    """Whether an outage has lasted a week or more and almost nothing depends on it."""
    since = finding.get("first_detected_at")
    if not since:
        return False
    try:
        age = datetime.now(UTC) - datetime.fromisoformat(since)
    except ValueError:
        return False
    if age.days < QUIET_OUTAGE_DAYS:
        return False
    cause = next(
        (c for c in snapshot.get("causes", []) if c.get("finding_key") == finding.get("key")), None
    )
    if cause is None:
        return True
    return cause.get("total_followers", 0) <= QUIET_OUTAGE_FOLLOWERS and not any(
        (cause.get("consumers") or {}).values()
    )


def _way(way: str, kind: str, recommended: bool = False, **fields: Any) -> dict[str, Any]:
    return {"way": way, "kind": kind, "recommended": recommended, **fields}


REMOVABLE_TARGETS = ("entity", "device", "area", "floor", "label")
ID_TARGETS = (
    "area",
    "floor",
    "label",
)  # plain identifiers: replaced by an existing one of the same kind
REWRITABLE_OWNERS = ("automation", "script", "scene", "dashboard")


def _broken_ways(finding: dict[str, Any], refactor_enabled: bool) -> list[dict[str, Any]]:
    """The ways for a reference whose target is gone: replace the target (an entity), or open the editor."""
    domain, _, kind = finding["rule_id"].partition(".missing_")
    ways: list[dict[str, Any]] = []
    if kind == "entity" and finding.get("affected_object"):
        suggestions = finding.get("suggestions") or []
        ways.append(
            _way(
                "replace_target",
                "panel",
                True,
                target=finding["affected_object"],
                suggestion=suggestions[0] if suggestions else None,
            )
        )
    elif kind in ID_TARGETS and finding.get("affected_object") and domain in REWRITABLE_OWNERS:
        ways.append(
            _way(
                "replace_target",
                "panel",
                True,
                target=finding["affected_object"],
                target_kind=kind,
            )
        )
    if (
        finding["rule_id"].startswith("automation.")
        and kind in REMOVABLE_TARGETS
        and finding.get("affected_object")
    ):
        ways.append(
            _way(
                "remove_reference",
                "panel",
                target=finding["affected_object"],
                enabled=refactor_enabled,
            )
        )
    ways.append(_way("open_editor", "panel", not ways))
    return ways


def ways_for(
    finding: dict[str, Any], snapshot: dict[str, Any], *, refactor_enabled: bool = False
) -> list[dict[str, Any]]:
    """The ways for one finding of the topics "down" and "broken references"; others have none yet."""
    if finding.get("topic") == BROKEN_REFERENCES:
        return _broken_ways(finding, refactor_enabled)
    if finding.get("topic") == FAILING_AUTOMATIONS:
        caused = bool(finding.get("cause_id"))
        ways: list[dict[str, Any]] = [_way("fix_cause", "panel", True)] if caused else []
        ways.append(_way("open_editor", "panel", not caused))
        if finding["rule_id"] in ("automation.run_failing", "automation.never_ok"):
            ways.append(_way("catch_error", "panel", enabled=refactor_enabled))
        if finding["rule_id"] == "automation.blocked":
            ways.append(_way("object_actions", "panel"))
        return ways
    if finding.get("topic") == UNNEEDED:
        return [
            _way("cleanup_round", "panel", True),
            _way("mark", "panel"),
            _way("object_actions", "panel"),
        ]
    if finding.get("topic") != DOWN:
        return []
    rule = finding["rule_id"]
    ways = []
    if rule == "config_entry.not_loaded":
        state = ((finding.get("evidence") or [{}])[0]).get("kind")
        domain = _domain(snapshot, finding["object_id"])
        page = f"/config/integrations/integration/{domain}" if domain else "/config/integrations"
        if state in WAIT_STATES:
            ways.append(_way("wait", "info", True))
        elif state in RESTART_STATES:
            ways.append(_way("restart_or_update", "info", True))
        reloadable = state not in (*WAIT_STATES, *RESTART_STATES)
        if reloadable:
            ways.append(_way("reload", "panel", True))
        ways.append(_way("open_integration", "link", False, path=page))
        ways.append(_way("mark", "panel"))
    elif rule == "config_entry.reauth":
        domain = _domain(snapshot, finding["object_id"])
        page = f"/config/integrations/integration/{domain}" if domain else "/config/integrations"
        ways.append(_way("reauth", "link", True, path=page))
        ways.append(_way("mark", "panel"))
    elif rule == "device.down":
        device: dict[str, Any] = next(
            (
                i
                for i in snapshot.get("objects", [])
                if i["object_type"] == "device" and i["object_id"] == finding["object_id"]
            ),
            {},
        )
        single = len(device.get("config_entry_ids") or []) == 1
        quiet = _quiet_outage(finding, snapshot)
        if single:
            ways.append(_way("reload", "panel", not quiet))
        ways.extend(
            [
                _way("mark", "panel", quiet or not single),
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
