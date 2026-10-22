"""How well a diagnosis is supported: the certainty of a finding.

Not a probability and not how bad the finding is. Every rule has a level by the kind of proof it rests
on (a fact in the registry or the configuration, a report of Home Assistant, a conclusion from state or
time, a guess); named adjustments move the value for the single finding, and a follow-up is never more
certain than its cause. The amounts are fixed, not measured. ``confidence_notes`` says what was applied.
"""

from __future__ import annotations

from typing import Any, Final

PROVEN: Final = "proven"
REPORTED: Final = "reported"
DERIVED: Final = "derived"
GUESSED: Final = "guessed"
LEVEL_VALUE: Final = {PROVEN: 0.98, REPORTED: 0.90, DERIVED: 0.75, GUESSED: 0.60}

MIN_VALUE: Final = 0.30
MAX_VALUE: Final = 0.99
RUNTIME_REFERENCE: Final = (
    -0.10
)  # A: the reference comes from the runtime extraction of Home Assistant

_RULES: Final[dict[str, str]] = {
    "entity.not_provided": PROVEN,
    "entity.config_entry_missing": PROVEN,
    "config_entry.reauth": REPORTED,
    "device.down": REPORTED,
    "entity.missing_member": REPORTED,
    "automation.never_ok": REPORTED,
    "script.never_ok": REPORTED,
    "entity.state_unavailable": DERIVED,
    "entity.state_unknown": DERIVED,
    "entity.device_missing": DERIVED,
    "entity.state_missing": DERIVED,
    "automation.blocked": DERIVED,
    "automation.goal_missed": DERIVED,
    "automation.run_failing": DERIVED,
    "script.run_failing": DERIVED,
    "entity.stale": GUESSED,
    "entity.possible_duplicate": GUESSED,
    "automation.disabled_long": GUESSED,
    "automation.never_triggered": GUESSED,
    "automation.stale": GUESSED,
    "app.stopped_in_use": GUESSED,
}


def level_of(finding: dict[str, Any]) -> str:
    """The level of a finding: from its rule, and for an integration that is not loaded from its state."""
    rule = finding["rule_id"]
    if rule == "config_entry.not_loaded":
        evidence = (finding.get("evidence") or [{}])[0]
        return REPORTED if evidence.get("kind") == "setup_error" else DERIVED
    if rule in _RULES:
        return _RULES[rule]
    suffix = rule.partition(".")[2]
    if suffix == "missing_service":
        return REPORTED
    if suffix.startswith("missing_"):
        return PROVEN
    if suffix in ("dead_condition", "dead_actions"):
        return DERIVED
    return GUESSED


def apply_certainty(findings: list[dict[str, Any]], causes: list[dict[str, Any]]) -> None:
    """Set ``confidence``, ``confidence_level`` and ``confidence_notes`` on every finding.

    Call it after the causes are known: a follow-up is capped by the certainty of its cause.
    """
    for finding in findings:
        level = level_of(finding)
        value = LEVEL_VALUE[level]
        notes: list[dict[str, Any]] = []
        evidence = (finding.get("evidence") or [{}])[0]
        if level == PROVEN and evidence.get("location") == "runtime_extraction":
            value += RUNTIME_REFERENCE
            notes.append({"code": "runtime_reference", "delta": RUNTIME_REFERENCE})
        finding["confidence_base"] = LEVEL_VALUE[level]
        finding["confidence"] = round(min(MAX_VALUE, max(MIN_VALUE, value)), 2)
        finding["confidence_level"] = level
        finding["confidence_notes"] = notes
    by_key = {f["key"]: f for f in findings if "key" in f}
    own = {c["id"]: by_key.get(c.get("finding_key") or "") for c in causes}
    for finding in findings:
        cause = own.get(finding.get("cause_id") or "")
        if cause is None or cause is finding or cause["confidence"] >= finding["confidence"]:
            continue
        finding["confidence"] = cause["confidence"]
        finding["confidence_notes"].append({"code": "cause", "cap": cause["confidence"]})
