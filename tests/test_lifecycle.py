"""The life of a device: the steps from registry, journal and reliability, and the note that is kept."""

from __future__ import annotations

import pytest

pytest.importorskip("homeassistant")
pytest.importorskip("pytest_homeassistant_custom_component")

from homeassistant.core import HomeAssistant  # noqa: E402

from custom_components.ha_housekeeper.lifecycle import (  # noqa: E402
    LifecycleStore,
    removed_devices,
    timeline,
)


def done(kind: str, object_id: str, at: str, object_type: str = "device", **fields) -> dict:
    return {
        "kind": kind,
        "object_id": object_id,
        "object_type": object_type,
        "name": object_id,
        "result": {"state": "done", "at": at},
        **fields,
    }


def test_the_timeline_holds_only_what_the_data_says_and_the_removed_list_is_newest_first() -> None:
    plans = [
        {
            "plan_id": "p1",
            "actions": [
                done("disable_device", "d1", "2026-02-01T00:00:00+00:00"),
                done("remove_device", "d9", "2026-03-01T00:00:00+00:00"),
            ],
        },
        {
            "plan_id": "p2",
            "actions": [
                done(
                    "replace_references",
                    "light.old",
                    "2026-02-10T00:00:00+00:00",
                    "entity",
                    target="light.new",
                ),
                done("forget_device", "d8", "2026-04-01T00:00:00+00:00"),
                {"kind": "remove_device", "object_id": "d7", "object_type": "device"},
            ],
        },
    ]
    device = {"object_id": "d1", "created_at": "2026-01-01T00:00:00+00:00", "status": "active"}
    snapshot = {
        "objects": [
            {"object_type": "entity", "object_id": "light.old", "device_id": "d1"},
            {"object_type": "entity", "object_id": "sensor.x", "device_id": "d1"},
        ],
        "quarantine": [{"object_id": "d1", "since": "2026-02-01T00:00:00+00:00"}],
    }

    class Replies:
        replies = {
            "reliability:7:0": {
                "computed_at": 5,
                "unstable": {
                    "entities": {"sensor.x": {"level": "flapping"}, "other": {"level": "unstable"}}
                },
            }
        }

    result = timeline(device, snapshot, plans, Replies())
    assert [s["kind"] for s in result["steps"]] == [
        "discovered",
        "quarantine",
        "disabled",
        "replaced",
    ]
    assert result["unstable"] == "flapping" and result["steps"][-1]["to"] == "light.new"
    assert timeline(device, snapshot, plans, None)["unstable"] is None
    assert [d["object_id"] for d in removed_devices(plans)] == ["d8", "d9"]


async def test_notes_are_short_cleared_by_empty_text_and_kept(
    hass: HomeAssistant, hass_storage
) -> None:
    store = LifecycleStore(hass)
    await store.async_load()
    store.set_note("d1", "  replaced by the new hub  ", "2026-10-01T00:00:00+00:00")
    with pytest.raises(ValueError):
        store.set_note("d2", "x" * 201, "2026-10-01T00:00:00+00:00")
    store.set_note("d3", "gone", "2026-10-01T00:00:00+00:00")
    store.set_note("d3", "   ", "2026-10-01T00:00:00+00:00")
    await store._store.async_save(store._data())
    hass_storage["ha_housekeeper.lifecycle"]["data"]["notes"]["bad"] = {"text": 5, "at": "x"}
    again = LifecycleStore(hass)
    await again.async_load()
    assert list(again.notes) == ["d1"] and again.notes["d1"]["text"] == "replaced by the new hub"
