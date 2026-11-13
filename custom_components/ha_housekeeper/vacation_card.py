"""What the dashboard card "vacation mode" shows: whether the mode is on, how many failures it holds back, the grace period.

Pure display of what the exceptions already know (``vacation_meta`` of every scan). The card has no switch: the switch
belongs to the helper or the calendar the person chose. "Since" and "until" are not known here; when the switch is a
calendar, the card reads them from that calendar's own attributes.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Final

STATES: Final = ("off", "on", "after", "unset")


def vacation_view(meta: dict[str, Any] | None, now: datetime) -> dict[str, Any]:
    """The state (``on``, ``after`` the vacation while the grace period runs, ``off``, ``unset`` without a switch)."""
    if not meta:
        return {"state": "unset"}
    try:
        until = datetime.fromisoformat(str(meta.get("after_until")))
    except ValueError:
        until = None
    if meta.get("active"):
        state = "on"
    elif until is not None and until > now:
        state = "after"
    else:
        state = "off"
    return {
        "state": state,
        "entity": meta.get("entity"),
        "held": meta.get("held") or 0,
        "rules": meta.get("rules") or 0,
        "grace_hours": meta.get("grace_hours"),
        "after_until": until.isoformat() if until is not None and state == "after" else None,
        "ended_at": meta.get("ended_at"),
        "missing": bool(meta.get("missing")),
    }
