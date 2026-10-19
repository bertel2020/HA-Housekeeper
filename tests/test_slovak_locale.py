"""Translation contracts independent of the Home Assistant runtime."""

from __future__ import annotations

import ast
import json
import re
from pathlib import Path

ROOT = Path(__file__).parents[1]
COMPONENT = ROOT / "custom_components" / "ha_housekeeper"


def leaves(value: object, prefix: str = "") -> dict[str, str]:
    """Flatten Home Assistant translation leaves by dotted path."""
    if isinstance(value, dict):
        result: dict[str, str] = {}
        for key, child in value.items():
            path = f"{prefix}.{key}" if prefix else key
            result.update(leaves(child, path))
        return result
    assert isinstance(value, str)
    return {prefix: value}


def placeholders(text: str) -> set[str]:
    return set(re.findall(r"\{(\w+)\}", text))


def test_slovak_home_assistant_keys_and_placeholders() -> None:
    directory = COMPONENT / "translations"
    english = leaves(json.loads((directory / "en.json").read_text(encoding="utf-8")))
    slovak = leaves(json.loads((directory / "sk.json").read_text(encoding="utf-8")))
    assert set(slovak) == set(english)
    for key, value in english.items():
        assert placeholders(slovak[key]) == placeholders(value), key


def test_slovak_audit_report_has_every_english_key() -> None:
    source = (COMPONENT / "audit_report.py").read_text(encoding="utf-8")
    module = ast.parse(source)
    dictionary = next(
        stmt.value
        for stmt in module.body
        if isinstance(stmt, ast.AnnAssign)
        and isinstance(stmt.target, ast.Name)
        and stmt.target.id == "TEXTS"
    )
    translations = ast.literal_eval(dictionary)
    assert set(translations["sk"]) == set(translations["en"])
