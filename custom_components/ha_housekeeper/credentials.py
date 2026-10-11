"""Stored credentials of the integrations: which fields hold one, masked, and one value on request.

``credentials`` lists the fields of each config entry whose name marks them as a password, token,
key or the like, with the value masked. The value itself leaves the server only through
``reveal``, one field at a time, on a click of an administrator; it is never logged and never
stored. Everything else in Housekeeper keeps its promise not to read credentials.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from homeassistant.core import HomeAssistant

# Field names that hold credentials, and names that contain one of them but do not.
SECRET_HINTS = (
    "api_key",
    "apikey",
    "api_token",
    "access_token",
    "refresh_token",
    "token",
    "secret",
    "client_secret",
    "client_id",
    "password",
    "passwd",
    "pwd",
    "private_key",
    "app_key",
    "app_secret",
    "credential",
    "auth",
    "pin",
    "webhook",
    "key",
)
SECRET_IGNORE = (
    "keyboard",
    "keep",
    "key_press",
    "monkey",
    "public_key",  # public keys are not secret
    "auth_implementation",  # OAuth: only the name of the sign-in method
    "token_type",  # OAuth: "Bearer"
    "ping",  # contains "pin"
    "expires",  # OAuth: when the token expires (expires_at, expires_in)
)
SOURCES = ("data", "options")
MAX_DEPTH = 3  # nested mappings below a field (OAuth keeps the tokens in "token")


def is_secret_key(key: Any) -> bool:
    """Whether a field name marks a credential (API key, token, password …)."""
    low = str(key).lower()
    if any(ignore in low for ignore in SECRET_IGNORE):
        return False
    return any(hint in low for hint in SECRET_HINTS)


def mask(value: Any) -> str:
    """The first and last four characters of a long value, dots for the rest; short ones all dots."""
    text = str(value)
    if len(text) <= 8:
        return "•" * len(text)
    return f"{text[:4]}{'•' * (len(text) - 8)}{text[-4:]}"


def find_secrets(entry: Any) -> list[dict[str, Any]]:
    """The credential fields of a config entry, masked: source, dotted path and masked value."""
    found: list[dict[str, Any]] = []

    def walk(source: str, mapping: Mapping[str, Any], prefix: str, depth: int) -> None:
        for key, value in mapping.items():
            path = f"{prefix}{key}"
            if isinstance(value, Mapping):
                if depth < MAX_DEPTH:
                    walk(source, value, f"{path}.", depth + 1)
                continue
            if isinstance(value, bool) or value in (None, "", [], {}) or not is_secret_key(key):
                continue
            if isinstance(value, list | tuple):
                continue  # lists of hosts and the like, not a single credential
            found.append(
                {"source": source, "key": path, "masked": mask(value), "length": len(str(value))}
            )

    for source in SOURCES:
        mapping = getattr(entry, source, None)
        if isinstance(mapping, Mapping):
            walk(source, mapping, "", 0)
    return found


def reveal(entry: Any, source: str, path: str) -> str | None:
    """The plain value of one credential field, or None.

    Only a field that ``find_secrets`` lists can be read: the path must exist and its last part
    must be a credential name, so this cannot be used to read any other part of a config entry.
    """
    if source not in SOURCES or entry is None:
        return None
    current: Any = getattr(entry, source, None)
    rest = str(path)
    for _ in range(MAX_DEPTH + 1):
        if not isinstance(current, Mapping):
            return None
        for key, value in current.items():
            name = str(key)
            if name == rest:
                if isinstance(value, Mapping | bool | list | tuple) or value in (None, ""):
                    return None
                return str(value) if is_secret_key(name) else None
            if rest.startswith(f"{name}.") and isinstance(value, Mapping):
                current, rest = value, rest[len(name) + 1 :]
                break
        else:
            return None
    return None


def credentials(hass: HomeAssistant) -> dict[str, Any]:
    """The credential fields of every config entry, masked; never the values themselves."""
    rows = []
    for entry in hass.config_entries.async_entries():
        for secret in find_secrets(entry):
            rows.append(
                {"entry_id": entry.entry_id, "domain": entry.domain, "title": entry.title, **secret}
            )
    rows.sort(key=lambda r: (r["domain"], str(r["title"]).lower(), r["source"], r["key"]))
    return {"credentials": rows, "entries": len({r["entry_id"] for r in rows})}
