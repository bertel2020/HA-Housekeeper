"""Stored credentials: field names, masking, the reveal guard and the WebSocket commands."""

from __future__ import annotations

import json
from types import SimpleNamespace

import pytest

pytest.importorskip("homeassistant")
pytest.importorskip("pytest_homeassistant_custom_component")

from homeassistant.core import HomeAssistant  # noqa: E402
from pytest_homeassistant_custom_component.common import MockConfigEntry  # noqa: E402

from custom_components.ha_housekeeper.const import DOMAIN  # noqa: E402
from custom_components.ha_housekeeper.credentials import (  # noqa: E402
    credentials,
    find_secrets,
    is_secret_key,
    mask,
    reveal,
)
from custom_components.ha_housekeeper.inventory import InventoryScanner  # noqa: E402

TOKEN = "abcd-very-long-SECRET-token-wxyz"
PASSWORD = "p4ss-SECRET"


@pytest.fixture(autouse=True)
def _enable_custom_integrations(enable_custom_integrations: None) -> None:
    """Allow loading the integration from custom_components."""


def entry(data=None, options=None):
    return SimpleNamespace(data=data or {}, options=options or {})


def test_secret_names_and_exceptions() -> None:
    for name in ("api_key", "password", "access_token", "client_secret", "pin", "webhook_id"):
        assert is_secret_key(name), name
    for name in ("host", "public_key", "token_type", "auth_implementation", "ping", "expires_at"):
        assert not is_secret_key(name), name


def test_mask_shows_at_most_the_ends_of_long_values() -> None:
    assert mask("12345678") == "••••••••"
    assert mask(TOKEN) == f"abcd{'•' * (len(TOKEN) - 8)}wxyz"
    assert "SECRET" not in mask(TOKEN)


def test_find_secrets_walks_nested_mappings_and_never_returns_values() -> None:
    found = find_secrets(
        entry(
            data={
                "host": "1.2.3.4",
                "password": PASSWORD,
                "token": {"access_token": TOKEN, "token_type": "Bearer"},
            },
            options={"api_key": TOKEN, "enabled": True, "pin": ""},
        )
    )
    keys = {(f["source"], f["key"]) for f in found}
    assert keys == {("data", "password"), ("data", "token.access_token"), ("options", "api_key")}
    text = json.dumps(found)
    assert PASSWORD not in text and TOKEN not in text


def test_reveal_returns_only_listed_credential_fields() -> None:
    e = entry(data={"host": "1.2.3.4", "password": PASSWORD, "token": {"access_token": TOKEN}})
    assert reveal(e, "data", "password") == PASSWORD
    assert reveal(e, "data", "token.access_token") == TOKEN
    assert reveal(e, "data", "host") is None, "a field that is not a credential cannot be read"
    assert reveal(e, "data", "token") is None, "a mapping is never returned"
    assert reveal(e, "data", "missing") is None
    assert reveal(e, "unique_id", "password") is None
    assert reveal(None, "data", "password") is None


async def test_credentials_of_config_entries_are_masked(hass: HomeAssistant) -> None:
    MockConfigEntry(domain="alexa_media", title="Alexa", data={"password": PASSWORD}).add_to_hass(
        hass
    )
    MockConfigEntry(domain="mobile_app", title="Phone", data={"webhook_id": TOKEN}).add_to_hass(
        hass
    )
    creds = credentials(hass)
    assert {(c["domain"], c["key"]) for c in creds["credentials"]} >= {
        ("alexa_media", "password"),
        ("mobile_app", "webhook_id"),
    }
    text = json.dumps(creds)
    assert PASSWORD not in text and TOKEN not in text


async def _ws(hass: HomeAssistant, hass_ws_client):
    from homeassistant.setup import async_setup_component

    from custom_components.ha_housekeeper import async_setup

    assert await async_setup(hass, {})
    scanner = InventoryScanner(hass)
    hass.data[DOMAIN]["scanner"] = scanner
    await scanner.async_initialize()
    assert await async_setup_component(hass, "websocket_api", {})
    return await hass_ws_client(hass)


async def test_websocket_lists_masked_and_reveals_one_field(
    hass: HomeAssistant, hass_ws_client
) -> None:
    config = MockConfigEntry(
        domain="fritz", title="Box", data={"host": "fritz.box", "password": PASSWORD}
    )
    config.add_to_hass(hass)
    client = await _ws(hass, hass_ws_client)

    await client.send_json_auto_id({"type": f"{DOMAIN}/credentials"})
    listed = (await client.receive_json())["result"]
    assert PASSWORD not in json.dumps(listed)
    row = next(r for r in listed["credentials"] if r["entry_id"] == config.entry_id)

    await client.send_json_auto_id(
        {
            "type": f"{DOMAIN}/credential_reveal",
            "entry_id": config.entry_id,
            "source": row["source"],
            "key": row["key"],
        }
    )
    assert (await client.receive_json())["result"] == {"value": PASSWORD}

    await client.send_json_auto_id(
        {
            "type": f"{DOMAIN}/credential_reveal",
            "entry_id": config.entry_id,
            "source": "data",
            "key": "host",
        }
    )
    answer = await client.receive_json()
    assert answer["success"] is False and answer["error"]["code"] == "not_found"

    await client.send_json_auto_id({"type": f"{DOMAIN}/access"})
    access = (await client.receive_json())["result"]
    assert PASSWORD not in json.dumps(access), "access and data flow never carry a credential"


async def test_credentials_need_an_administrator(
    hass: HomeAssistant, hass_ws_client, hass_read_only_access_token
) -> None:
    from homeassistant.setup import async_setup_component

    from custom_components.ha_housekeeper import async_setup

    MockConfigEntry(domain="fritz", data={"password": PASSWORD}).add_to_hass(hass)
    assert await async_setup(hass, {})
    hass.data[DOMAIN]["scanner"] = InventoryScanner(hass)
    assert await async_setup_component(hass, "websocket_api", {})
    client = await hass_ws_client(hass, hass_read_only_access_token)
    for command in ("credentials", "credential_reveal"):
        extra = (
            {"entry_id": "x", "source": "data", "key": "password"} if "reveal" in command else {}
        )
        await client.send_json_auto_id({"type": f"{DOMAIN}/{command}", **extra})
        answer = await client.receive_json()
        assert answer["success"] is False and answer["error"]["code"] == "unauthorized", command
