"""Pure helpers that find entity references inside dashboard configurations."""

from __future__ import annotations

import re
from collections.abc import Mapping
from typing import Any

ENTITY_ID = re.compile(r"^[a-z0-9_]+\.[a-z0-9_]+$")
ENTITY_IN_TEXT = re.compile(r"\b([a-z0-9_]+\.[a-z0-9_]+)\b")
# Keys whose string values (or lists of strings) name entities in standard cards.
ENTITY_KEYS = frozenset({"entity", "entities", "entity_id", "camera_image", "badges"})


def extract_dashboard_references(
    config: Mapping[str, Any] | None, known_entities: set[str]
) -> list[dict[str, str]]:
    """Return entity references of a dashboard with their location."""
    return extract_entity_references(config, known_entities, ENTITY_KEYS, "SHOWS")


def extract_entity_references(
    config: Mapping[str, Any] | None,
    known_entities: set[str],
    keys: frozenset[str],
    relation: str,
) -> list[dict[str, str]]:
    """Return entity references found under ``keys`` with their location.

    Explicit entity keys are ``certain``. Entity IDs inside templates are only
    reported as ``probable`` and only when the entity exists, so free text can
    never create a false "missing" finding.
    """
    if not config:
        return []
    found: list[dict[str, str]] = []
    seen: set[tuple[str, str]] = set()

    def add(object_id: str, path: str, confidence: str) -> None:
        if (object_id, path) not in seen:
            seen.add((object_id, path))
            found.append(
                {
                    "kind": "entity",
                    "object_id": object_id,
                    "relation": relation,
                    "location": path,
                    "confidence": confidence,
                }
            )

    def walk(value: Any, path: str, key: str | None) -> None:
        if isinstance(value, Mapping):
            for child_key, child in value.items():
                walk(child, f"{path}/{child_key}" if path else str(child_key), str(child_key))
        elif isinstance(value, list):
            for index, child in enumerate(value):
                walk(child, f"{path}/{index}", key)
        elif isinstance(value, str):
            if key in keys and ENTITY_ID.match(value):
                add(value, path, "certain")
            elif "{{" in value or "[[[" in value or "states" in value:
                for match in ENTITY_IN_TEXT.findall(value):
                    if match in known_entities:
                        add(match, path, "probable")

    walk(config, "", None)
    return found


# Config-entry helpers keep the entities they build on in their options.
HELPER_DOMAINS = frozenset(
    {
        "template", "derivative", "integration", "min_max", "threshold", "utility_meter",
        "statistics", "trend", "filter", "history_stats", "switch_as_x", "compensation",
        "generic_hygrostat", "generic_thermostat",
    }
)  # fmt: skip
HELPER_KEYS = frozenset(
    {
        "entity_id",
        "entity_ids",
        "entities",
        "source",
        "target_sensor",
        "heater",
        "cooler",
        "humidifier",
    }
)


def extract_helper_references(
    options: Mapping[str, Any] | None, known_entities: set[str]
) -> list[dict[str, str]]:
    """Return the entities a helper config entry is built on."""
    return extract_entity_references(options, known_entities, HELPER_KEYS, "REFERENCES")
