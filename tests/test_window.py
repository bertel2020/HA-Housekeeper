"""Maintenance window: the order of the steps, what each needs, and what the reload may touch."""

from __future__ import annotations

import pytest

pytest.importorskip("homeassistant")
pytest.importorskip("pytest_homeassistant_custom_component")

from homeassistant.core import HomeAssistant  # noqa: E402
from test_cleanup_exec import make_scanner  # noqa: E402

from custom_components.ha_housekeeper.window import (  # noqa: E402
    STEPS,
    WindowError,
    WindowStore,
    reload_targets,
)

PLAN = "aabbccddeeff"


async def test_the_store_keeps_the_order_and_drops_bad_saved_data(
    hass: HomeAssistant, hass_storage
) -> None:
    store = WindowStore(hass)
    await store.async_load()
    with pytest.raises(WindowError):
        store.begin("2026-10-01T00:00:00+00:00", PLAN)  # off until switched on
    store.set_enabled(True)
    store.begin("2026-10-01T00:00:00+00:00", PLAN)
    with pytest.raises(WindowError):
        store.begin("2026-10-01T00:00:00+00:00", PLAN)  # one window at a time
    with pytest.raises(WindowError):
        store.set_enabled(False)  # not while one is open
    with pytest.raises(WindowError):
        store.advance("plan", "2026-10-01T00:01:00+00:00")  # not the next step
    for step in STEPS:
        store.advance(step, "2026-10-01T00:02:00+00:00", "x" * 500)
    assert store.current() is None and len(store.state["log"][-1]["note"]) == 200
    await store._store.async_save(store._data())
    hass_storage["ha_housekeeper.window"]["data"]["state"]["plan_id"] = "../etc"
    hass_storage["ha_housekeeper.window"]["data"]["state"]["log"].append(
        {"step": "nope", "at": "x"}
    )
    again = WindowStore(hass)
    await again.async_load()
    assert (
        again.enabled and again.state["plan_id"] is None and len(again.state["log"]) == len(STEPS)
    )
    again.clear()
    assert again.state is None


def test_the_reload_touches_only_entries_of_what_the_plan_changed_and_never_our_own() -> None:
    snapshot = {
        "objects": [
            {"object_type": "config_entry", "object_id": "e1", "name": "Hue", "domain": "hue"},
            {
                "object_type": "config_entry",
                "object_id": "e2",
                "name": "Us",
                "domain": "ha_housekeeper",
            },
            {"object_type": "config_entry", "object_id": "e3", "name": "Other", "domain": "mqtt"},
            {"object_type": "entity", "object_id": "light.a", "config_entry_id": "e1"},
            {"object_type": "entity", "object_id": "light.b", "config_entry_id": "e3"},
            {"object_type": "device", "object_id": "d1", "config_entry_ids": ["e2", "e1"]},
        ]
    }
    done = {"state": "done"}
    plan = {
        "actions": [
            {"object_type": "entity", "object_id": "light.a", "result": done},
            {"object_type": "entity", "object_id": "light.b"},  # never ran
            {"object_type": "device", "object_id": "d1", "result": done},
            {"object_type": "entity", "object_id": "light.gone", "result": done},
        ]
    }
    assert [t["entry_id"] for t in reload_targets(plan, snapshot)] == ["e1"]


async def test_the_panel_commands_walk_the_window_and_refuse_steps_that_do_not_fit(
    hass: HomeAssistant, hass_ws_client
) -> None:
    from homeassistant.setup import async_setup_component

    from custom_components.ha_housekeeper import async_setup
    from custom_components.ha_housekeeper.const import DOMAIN

    assert await async_setup(hass, {})
    scanner = await make_scanner(hass)
    hass.data[DOMAIN]["scanner"] = scanner
    assert await async_setup_component(hass, "websocket_api", {})
    client = await hass_ws_client(hass)
    scanner.journal.add({"plan_id": PLAN, "actions": [], "executed": False, "status": "dry_run"})

    async def call(**fields):
        await client.send_json_auto_id({"type": "ha_housekeeper/window_set", **fields})
        return await client.receive_json()

    assert (await call(action="begin", plan_id=PLAN))["success"] is False  # off
    assert (await call(action="enable"))["success"] is True
    assert (await call(action="begin", plan_id=PLAN))["success"] is True
    for step in ("preflight", "baseline"):
        assert (await call(action="advance", step=step))["success"] is True
    assert (await call(action="advance", step="plan"))["success"] is False  # the plan has not run
    scanner.journal.get(PLAN)["executed"] = True
    assert (await call(action="advance", step="plan"))["success"] is True
    await client.send_json_auto_id({"type": "ha_housekeeper/window_reload", "execute": True})
    assert (await client.receive_json())["result"]["targets"] == []
    assert (await call(action="advance", step="reload", skip=True))["success"] is True
    assert (await call(action="advance", step="restart"))["success"] is False  # no restart seen
    assert (await call(action="advance", step="compare", skip=True))["success"] is False
    assert (await call(action="advance", step="restart", skip=True))["success"] is True
    for step in ("compare", "report"):
        assert (await call(action="advance", step=step))["success"] is True
    done = await call(action="clear")
    assert done["success"] and done["result"]["state"] is None
