"""Maintenance window: a guided run through steps that already exist, one after the other.

Experimental and off until you switch it on. The window bundles checks and one cleanup plan; it
adds no new way to change anything, apart from reloading the integrations that the executed plan
named. It never runs on a timer and never restarts Home Assistant: after the plan you restart it
yourself (or skip that), and the window notices the restart in Housekeeper's event log. The state
is kept so that a restart does not lose the place.
"""

from __future__ import annotations

import re
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DOMAIN, STORAGE_VERSION, WINDOW_STORAGE_KEY

SAVE_DELAY = 5
STEPS = ("preflight", "baseline", "plan", "reload", "restart", "compare", "report")
SKIPPABLE = ("reload", "restart")
LOG_LIMIT = 40
NOTE_LIMIT = 200
RELOAD_LIMIT = 20
PLAN_ID = re.compile(r"^[0-9a-f]{12}$")


class WindowError(ValueError):
    """A step that does not follow, a second window, or a plan that did not run."""


class WindowStore:
    """The switch and the state of the one window that may be open."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, WINDOW_STORAGE_KEY)
        self.enabled = False
        self.state: dict[str, Any] | None = None

    async def async_load(self) -> None:
        data = await self._store.async_load()
        if not isinstance(data, dict):
            return
        self.enabled = data.get("enabled") is True
        state = data.get("state")
        if (
            isinstance(state, dict)
            and isinstance(state.get("started_at"), str)
            and isinstance(state.get("done"), list)
            and all(step in STEPS for step in state["done"])
        ):
            plan_id = state.get("plan_id")
            self.state = {
                "started_at": state["started_at"],
                "plan_id": plan_id if isinstance(plan_id, str) and PLAN_ID.match(plan_id) else None,
                "done": [s for s in STEPS if s in state["done"]],
                "log": [
                    {
                        "step": e["step"],
                        "at": e["at"],
                        "note": str(e.get("note") or "")[:NOTE_LIMIT],
                    }
                    for e in state.get("log", [])
                    if isinstance(e, dict)
                    and e.get("step") in STEPS
                    and isinstance(e.get("at"), str)
                ][-LOG_LIMIT:],
            }

    def _save(self) -> None:
        self._store.async_delay_save(self._data, SAVE_DELAY)

    def _data(self) -> dict[str, Any]:
        return {"enabled": self.enabled, "state": self.state}

    def set_enabled(self, on: bool) -> None:
        if not on and self.state is not None:
            raise WindowError("a window is open")
        self.enabled = on
        self._save()

    def current(self) -> str | None:
        """The step that comes next, or ``None`` when there is no window or it is complete."""
        if self.state is None:
            return None
        return next((s for s in STEPS if s not in self.state["done"]), None)

    def begin(self, now: str, plan_id: str) -> None:
        if not self.enabled:
            raise WindowError("not enabled")
        if self.state is not None:
            raise WindowError("a window is open")
        if not PLAN_ID.match(plan_id):
            raise WindowError("plan")
        self.state = {"started_at": now, "plan_id": plan_id, "done": [], "log": []}
        self._save()

    def advance(self, step: str, now: str, note: str = "") -> None:
        """Mark the next step as done (or skipped); steps cannot be taken out of order."""
        if self.state is None or step != self.current():
            raise WindowError("out of order")
        self.state["done"].append(step)
        self.state["log"] = [
            *self.state["log"],
            {"step": step, "at": now, "note": note[:NOTE_LIMIT]},
        ][-LOG_LIMIT:]
        self._save()

    def clear(self) -> None:
        """Close the window (finished or abandoned)."""
        self.state = None
        self._save()


def reload_targets(plan: dict[str, Any], snapshot: dict[str, Any]) -> list[dict[str, str]]:
    """The integrations an executed plan touched: only entries of objects it changed, not our own."""
    objects = {(i["object_type"], i["object_id"]): i for i in snapshot["objects"]}
    entries = {i["object_id"]: i for i in snapshot["objects"] if i["object_type"] == "config_entry"}
    wanted: dict[str, None] = {}
    for action in plan.get("actions") or []:
        result = action.get("result")
        if not isinstance(result, dict) or result.get("state") != "done":
            continue
        item = objects.get((action.get("object_type") or "entity", action.get("object_id")))
        if item is None:
            continue
        ids = item.get("config_entry_ids") or [item.get("config_entry_id")]
        for entry_id in ids:
            if entry_id in entries and entries[entry_id].get("domain") != DOMAIN:
                wanted[entry_id] = None
    return [
        {
            "entry_id": e,
            "title": str(entries[e].get("name") or e),
            "domain": str(entries[e].get("domain") or ""),
        }
        for e in list(wanted)[:RELOAD_LIMIT]
    ]
