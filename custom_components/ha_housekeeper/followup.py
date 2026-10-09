"""Watch the system for a day after a plan ran and say whether it stayed clean.

When a plan finishes, the findings that already exist are remembered. Every following scan is
compared with them: a new broken reference, a new unavailable entity or a device that came back
after being forgotten means a ``regression``. After the watch time without such a finding the
plan is ``clean``. The check only reads scans; it does not look at automation runs.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

WATCH_HOURS = 24
SHOWN_NEW = 20  # new findings listed in the plan; the number is always exact
REGRESSION_SHOWN_DAYS = 7  # how long a regression is offered on the overview
BASELINE_KINDS = ("broken_reference", "unavailable")


def _current(snapshot: dict[str, Any]) -> tuple[dict[str, dict[str, Any]], set[str]]:
    findings = {
        f["key"]: f
        for f in snapshot["findings"]
        if f["classification"] in BASELINE_KINDS and not f.get("ignored")
    }
    recurring = {r["device_id"] for r in snapshot.get("recurring_devices", [])}
    return findings, recurring


def start(plan: dict[str, Any], snapshot: dict[str, Any], now: datetime) -> None:
    """Begin watching after a plan that changed something; ``snapshot`` is the state afterwards."""
    if not plan.get("executed"):
        return
    findings, recurring = _current(snapshot)
    plan["followup"] = {
        "state": "watching",
        "since": now.isoformat(),
        "until": (now + timedelta(hours=WATCH_HOURS)).isoformat(),
        "baseline": {"findings": sorted(findings), "recurring": sorted(recurring)},
        "baseline_counts": {
            kind: sum(f["classification"] == kind for f in findings.values())
            for kind in BASELINE_KINDS
        }
        | {"recurring": len(recurring)},
    }


def stop(plan: dict[str, Any]) -> None:
    """A plan that was undone is not watched any more."""
    followup = plan.get("followup")
    if followup and followup["state"] == "watching":
        followup["state"] = "stopped"
        followup.pop("baseline", None)


def check(plans: list[dict[str, Any]], snapshot: dict[str, Any], now: datetime) -> bool:
    """Compare a finished scan with every watched plan; True if a plan changed."""
    changed = False
    findings, recurring = _current(snapshot)
    for plan in plans:
        followup = plan.get("followup")
        if not followup or followup["state"] != "watching":
            continue
        baseline = followup["baseline"]
        known = set(baseline["findings"])
        new = [
            {"key": key, "object_id": f["object_id"], "classification": f["classification"]}
            for key, f in sorted(findings.items())
            if key not in known
        ]
        new += [
            {"key": f"recurring:{d}", "object_id": d, "classification": "recurring"}
            for d in sorted(recurring - set(baseline["recurring"]))
        ]
        if new:
            followup.update(state="regression", at=now.isoformat(), new_count=len(new))
            followup["new"] = new[:SHOWN_NEW]
        elif now >= datetime.fromisoformat(followup["until"]):
            followup.update(state="clean", at=now.isoformat())
        else:
            continue
        followup.pop("baseline", None)
        changed = True
    return changed


def regressions(plans: list[dict[str, Any]], now: datetime) -> list[dict[str, Any]]:
    """Recent regressions for the overview: which plan, when, how many new findings."""
    limit = now - timedelta(days=REGRESSION_SHOWN_DAYS)
    return [
        {
            "plan_id": plan["plan_id"],
            "at": plan["followup"]["at"],
            "new_count": plan["followup"].get("new_count", 0),
        }
        for plan in plans
        if plan.get("followup", {}).get("state") == "regression"
        and datetime.fromisoformat(plan["followup"]["at"]) >= limit
    ]


def public(followup: dict[str, Any] | None) -> dict[str, Any] | None:
    """The part of a follow-up the panel needs: no list of remembered findings."""
    if not followup:
        return None
    return {k: v for k, v in followup.items() if k != "baseline"}
