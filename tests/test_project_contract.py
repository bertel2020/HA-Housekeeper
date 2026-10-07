"""Dependency-free contract tests for the installable alpha package."""

from __future__ import annotations

import json
import re
from pathlib import Path

import pytest

ROOT = Path(__file__).parents[1]
COMPONENT = ROOT / "custom_components" / "ha_housekeeper"


def _json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def _leaf_paths(value: object, prefix: str = "") -> set[str]:
    if isinstance(value, dict):
        result: set[str] = set()
        for key, child in value.items():
            result |= _leaf_paths(child, f"{prefix}.{key}" if prefix else key)
        return result
    return {prefix}


def test_manifest_declares_installable_custom_integration() -> None:
    manifest = _json(COMPONENT / "manifest.json")
    assert manifest["domain"] == "ha_housekeeper"
    assert manifest["config_flow"] is True
    assert manifest["single_config_entry"] is True
    assert re.fullmatch(r"\d+\.\d+\.\d+", manifest["version"])


def test_manifest_version_matches_latest_changelog_entry() -> None:
    manifest = _json(COMPONENT / "manifest.json")
    changelog = (ROOT / "CHANGELOG.md").read_text(encoding="utf-8")
    match = re.search(r"^## (\d+\.\d+\.\d+)", changelog, re.MULTILINE)
    assert match is not None
    assert match.group(1) == manifest["version"]


def test_manifest_points_to_the_owner_repository() -> None:
    manifest = _json(COMPONENT / "manifest.json")
    assert manifest["codeowners"] == ["@bertel2020"]
    assert manifest["documentation"].startswith("https://github.com/bertel2020/")
    assert manifest["issue_tracker"].startswith("https://github.com/bertel2020/")


def test_german_and_english_translation_keys_match() -> None:
    german = _json(COMPONENT / "translations" / "de.json")
    english = _json(COMPONENT / "translations" / "en.json")
    assert _leaf_paths(german) == _leaf_paths(english)


def test_frontend_bundle_is_packaged() -> None:
    bundle = COMPONENT / "frontend" / "ha-housekeeper-panel.js"
    assert bundle.stat().st_size > 1_000
    assert "customElements.define" in bundle.read_text(encoding="utf-8")


def test_websocket_api_is_read_only() -> None:
    source = (COMPONENT / "websocket_api.py").read_text(encoding="utf-8")
    assert "ha_housekeeper/inventory" not in source  # assembled from DOMAIN
    assert "async_remove" not in source
    assert "async_update_entity" not in source


def test_every_websocket_command_uses_current_admin_decorator() -> None:
    source = (COMPONENT / "websocket_api.py").read_text(encoding="utf-8")
    assert source.count("@websocket_api.websocket_command") == 4
    assert source.count("@websocket_api.require_admin") == 4
    assert "connection.require_admin" not in source


def test_websocket_scan_errors_are_actionable() -> None:
    source = (COMPONENT / "websocket_api.py").read_text(encoding="utf-8")
    assert 'connection.send_error(msg["id"], "scan_failed"' in source


def test_initial_scan_uses_a_tracked_background_task() -> None:
    source = (COMPONENT / "__init__.py").read_text(encoding="utf-8")
    assert "entry.async_create_background_task" in source
    assert "hass.async_create_task(scanner.async_scan())" not in source


def test_panel_javascript_unit_tests_pass() -> None:
    """Run the Node-based panel tests; skipped where Node.js is unavailable."""
    import shutil
    import subprocess

    node = shutil.which("node")
    if node is None:
        pytest.skip("Node.js not installed")
    result = subprocess.run(
        [node, "--test", "tests/panel.test.mjs"],
        cwd=COMPONENT.parents[1],
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 0, result.stdout + result.stderr
