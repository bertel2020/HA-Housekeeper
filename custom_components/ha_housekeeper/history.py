"""Scan history: compact checkpoints and a pure diff between two scans."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DEFAULT_HISTORY_DAYS, HISTORY_STORAGE_KEY, STORAGE_VERSION
from .hygiene import finding_key as _finding_key

SAVE_DELAY = 10
LIST_LIMIT = 500  # entries per section sent to the panel; totals stay exact


def make_checkpoint(snapshot: dict[str, Any]) -> dict[str, Any]:
    """Reduce a snapshot to what a later comparison needs."""
    objects: dict[str, dict[str, str]] = {}
    for item in snapshot["objects"]:
        objects.setdefault(item["object_type"], {})[item["object_id"]] = item["status"]
    return {
        "at": snapshot["meta"]["scanned_at"],
        "objects": objects,
        "findings": sorted({_finding_key(f) for f in snapshot["findings"]}),
    }


def diff_checkpoints(base: dict[str, Any], snapshot: dict[str, Any]) -> dict[str, Any]:
    """Describe what changed between a stored checkpoint and the current snapshot."""
    current = make_checkpoint(snapshot)
    by_key = {(i["object_type"], i["object_id"]): i for i in snapshot["objects"]}

    old = {(t, oid): s for t, objs in base["objects"].items() for oid, s in objs.items()}
    now = {(t, oid): s for t, objs in current["objects"].items() for oid, s in objs.items()}

    new_objects = [
        {
            "object_type": t,
            "object_id": oid,
            "name": by_key[(t, oid)]["name"],
            "status": now[(t, oid)],
        }
        for (t, oid) in now.keys() - old.keys()
    ]
    removed_objects = [{"object_type": t, "object_id": oid} for (t, oid) in old.keys() - now.keys()]
    status_changes = [
        {
            "object_type": t,
            "object_id": oid,
            "name": by_key[(t, oid)]["name"],
            "from": old[(t, oid)],
            "to": now[(t, oid)],
        }
        for (t, oid) in now.keys() & old.keys()
        if old[(t, oid)] != now[(t, oid)]
    ]

    base_findings = set(base["findings"])
    new_findings = [f for f in snapshot["findings"] if _finding_key(f) not in base_findings]
    resolved_findings = []
    for key in sorted(base_findings - set(current["findings"])):
        rule_id, object_id, affected = key.split("|", 2)
        resolved_findings.append(
            {"rule_id": rule_id, "object_id": object_id, "affected_object": affected or None}
        )

    def cut(rows: list[dict[str, Any]]) -> dict[str, Any]:
        rows = sorted(rows, key=lambda r: (r.get("object_type", ""), r["object_id"]))
        return {"total": len(rows), "items": rows[:LIST_LIMIT]}

    return {
        "baseline_at": base["at"],
        "scanned_at": current["at"],
        "new_objects": cut(new_objects),
        "removed_objects": cut(removed_objects),
        "status_changes": cut(status_changes),
        "new_findings": cut(new_findings),
        "resolved_findings": cut(resolved_findings),
    }


def checkpoint_counts(checkpoint: dict[str, Any]) -> dict[str, int]:
    """Totals for the timeline, derived from what a checkpoint already stores."""
    return {
        "objects": sum(len(objs) for objs in checkpoint["objects"].values()),
        "findings": len(checkpoint["findings"]),
    }


def _age_cutoff(at: str, days: int) -> str:
    """ISO timestamp ``days`` before ``at``; checkpoints older than this are dropped."""
    try:
        return (datetime.fromisoformat(at) - timedelta(days=days)).isoformat()
    except ValueError:
        return ""


class ScanHistory:
    """Persist the previous scan and the last scan of each earlier day, for a set number of days."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.retention_days = DEFAULT_HISTORY_DAYS
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, HISTORY_STORAGE_KEY)
        self._latest: dict[str, Any] | None = None
        self._previous: dict[str, Any] | None = None
        self._daily: list[dict[str, Any]] = []

    async def async_load(self) -> None:
        """Load stored checkpoints."""
        data = await self._store.async_load()
        if not isinstance(data, dict):
            return
        self._latest = data.get("latest")
        self._previous = data.get("previous")
        self._daily = data.get("daily") or []

    def record(self, snapshot: dict[str, Any]) -> None:
        """Remember a finished scan; the last one becomes the 'previous' baseline."""
        checkpoint = make_checkpoint(snapshot)
        if self._latest is not None:
            self._previous = self._latest
            if self._latest["at"][:10] != checkpoint["at"][:10]:
                self._daily = [*self._daily, self._latest]
        if self._daily:
            cutoff = _age_cutoff(checkpoint["at"], self.retention_days)
            self._daily = [cp for cp in self._daily if cp["at"] >= cutoff]
        self._latest = checkpoint
        self._store.async_delay_save(self._as_dict, SAVE_DELAY)

    def _as_dict(self) -> dict[str, Any]:
        return {"latest": self._latest, "previous": self._previous, "daily": self._daily}

    def baselines(self) -> list[dict[str, str]]:
        """List selectable comparison points, newest first."""
        options = []
        if self._previous is not None:
            options.append(
                {"id": "previous", "at": self._previous["at"], **checkpoint_counts(self._previous)}
            )
        options.extend(
            {"id": cp["at"], "at": cp["at"], **checkpoint_counts(cp)}
            for cp in reversed(self._daily)
            if self._previous is None or cp["at"] != self._previous["at"]
        )
        return options

    def compare(self, snapshot: dict[str, Any], baseline: str = "previous") -> dict[str, Any]:
        """Compare the current snapshot with a baseline; an empty result if none exists."""
        base = (
            self._previous
            if baseline == "previous"
            else next((cp for cp in self._daily if cp["at"] == baseline), None)
        )
        result: dict[str, Any] = {
            "baselines": self.baselines(),
            "baseline": baseline,
            "retention_days": self.retention_days,
            "current": checkpoint_counts(make_checkpoint(snapshot)),
        }
        if base is None:
            return {**result, "available": False}
        return {**result, "available": True, **diff_checkpoints(base, snapshot)}
