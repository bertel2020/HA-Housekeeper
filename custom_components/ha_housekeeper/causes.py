"""Common causes behind many "not available" findings: one failed integration, one dead device.

Only reads the objects, edges and findings of the last scan. A cause is a hint, not a proof: when
an integration is not loaded, every entity it provides is unavailable, and one note at the top is
more useful than a hundred findings. The follow-up findings get a ``cause_id`` and stay in the
list; hidden or marked findings do not count.
"""

from __future__ import annotations

from typing import Any

from .impact import RANK, USAGE

DEVICE_MIN_ENTITIES = 3  # a device with fewer entities is not a pattern
KEY_LIMIT = 500


def _visible(finding: dict[str, Any]) -> bool:
    return finding["classification"] == "unavailable" and not finding.get("ignored")


def _consumers(entity_ids: list[str], edges: list[dict[str, Any]]) -> dict[str, int]:
    """How many automations, scripts and dashboards use the entities of a cause."""
    wanted = {f"entity:{entity_id}" for entity_id in entity_ids}
    sources = {
        edge["source"] for edge in edges if edge["relation"] in USAGE and edge["target"] in wanted
    }
    counts = {"automation": 0, "script": 0, "dashboard": 0}
    for source in sources:
        kind = source.split(":", 1)[0]
        if kind in counts:
            counts[kind] += 1
    return {kind: n for kind, n in counts.items() if n}


def _cause(
    kind: str, item: dict[str, Any], followers: list[dict[str, Any]], edges: list[dict[str, Any]]
) -> dict[str, Any]:
    cause = {
        "id": f"{kind}:{item['object_id']}",
        "kind": kind,
        "object_type": item["object_type"],
        "object_id": item["object_id"],
        "name": item.get("name") or item["object_id"],
        "follower_count": len(followers),
        "follower_keys": [f["key"] for f in followers[:KEY_LIMIT]],
        "consumers": _consumers([f["object_id"] for f in followers], edges),
        "impact": max((f.get("impact", "none") for f in followers), key=RANK.__getitem__),
    }
    if kind == "integration_down":
        cause.update(domain=item.get("domain"), state=item.get("state"), error=item.get("error"))
    return cause


def apply_causes(
    objects: list[dict[str, Any]], edges: list[dict[str, Any]], findings: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """Set ``cause_id`` on the follow-up findings and return the causes, most followers first.

    Call it after the marks and the impact are applied: it counts only findings that are shown.
    """
    for finding in findings:
        finding.pop("cause_id", None)
    entity = {o["object_id"]: o for o in objects if o["object_type"] == "entity"}
    by_object = {
        f["object_id"]: f
        for f in findings
        if f["rule_id"].startswith("entity.") and _visible(f) and f["object_id"] in entity
    }
    causes: list[dict[str, Any]] = []

    def take(kind: str, item: dict[str, Any], entity_ids: list[str]) -> None:
        followers = [
            by_object[i] for i in entity_ids if i in by_object and "cause_id" not in by_object[i]
        ]
        if not followers:
            return
        cause = _cause(kind, item, followers, edges)
        for finding in followers:
            finding["cause_id"] = cause["id"]
        causes.append(cause)

    provided: dict[str, list[str]] = {}
    for item in entity.values():
        if item.get("config_entry_id"):
            provided.setdefault(item["config_entry_id"], []).append(item["object_id"])
    for item in objects:
        if item["object_type"] == "config_entry" and item["status"] == "problem":
            take("integration_down", item, provided.get(item["object_id"], []))

    members: dict[str, list[str]] = {}
    for item in entity.values():
        if item.get("device_id"):
            members.setdefault(item["device_id"], []).append(item["object_id"])
    for item in objects:
        if item["object_type"] != "device":
            continue
        ids = members.get(item["object_id"], [])
        if len(ids) >= DEVICE_MIN_ENTITIES and all(
            entity[i]["status"] == "unavailable" for i in ids
        ):
            take("device_down", item, ids)

    return sorted(causes, key=lambda c: (-c["follower_count"], c["id"]))
