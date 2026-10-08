"""The shape of what the websocket commands of the newer views send to the panel.

Only descriptions for readers and type checkers: nothing here runs. A field added to a reply is
added here too, and ``tests/test_homeassistant_runtime.py`` keeps the fields the panel reads.
"""

from __future__ import annotations

from typing import Any, NotRequired, TypedDict


class Reply(TypedDict, total=False):
    """Fields every recorder-based reply can carry."""

    available: bool
    busy: bool
    cached: bool
    took_ms: int | None
    thresholds: dict[str, float]
    findings: list[dict[str, Any]]


class ExposureAssistant(TypedDict):
    id: str
    status: str  # ok, inactive or unavailable (never "not exposed")
    exposed: int


class ExposureBridge(TypedDict):
    kind: str
    title: str
    exposed: int


class ExposureItem(TypedDict):
    entity_id: str
    name: str
    assistants: NotRequired[list[str]]


class ExposureFinding(TypedDict):
    kind: str
    level: str
    count: int
    items: NotRequired[list[ExposureItem]]
    assistant: NotRequired[str]
    alias: NotRequired[str]
    domain: NotRequired[str]


class ExposureResult(TypedDict):
    available: bool
    assistants: list[ExposureAssistant]
    bridges: list[ExposureBridge]
    webhooks: int  # a count only, never an id or a url
    checked: int
    findings: list[ExposureFinding]


class ReliabilityCoverage(TypedDict):
    known: int
    with_data: int
    observed_share: int | None


class ReliabilityRow(TypedDict):
    entry_id: str
    title: str
    domain: str | None
    state: str | None
    reauth: bool
    entities: int
    permanent: int
    availability: float | None
    shared_outages: int
    longest_outage: int
    layer: str | None
    last_disruption: dict[str, Any] | None
    previous_availability: NotRequired[float | None]
    delta: NotRequired[float | None]


class ReliabilityResult(Reply):
    entries: list[ReliabilityRow]
    unstable: dict[str, Any]
    window_days: int
    coverage: ReliabilityCoverage
    comparison: dict[str, bool]


class RunsRow(TypedDict, total=False):
    object_type: str
    entity_id: str
    name: str
    status: str
    runs: int
    ok: int
    errors: int
    conditions: int
    mean_ms: int | None
    max_ms: int | None
    per_day: list[int]
    lower_bound: bool
    findings: list[dict[str, Any]]


class RunsResult(TypedDict, total=False):
    items: list[RunsRow]
    since: str | None
    window_days: int
    total: int
    excluded: dict[str, int]
    thresholds: dict[str, float]


class StormsResult(Reply, total=False):
    window_days: int
    total_rows: int
    per_day: int
    entity_count: int
    excluded: dict[str, int]
    entities: list[dict[str, Any]]
    integrations: list[dict[str, Any]]
    events: list[dict[str, Any]]
    event_total: int
    state_changed_events: int


class DbHealthResult(Reply, total=False):
    supported: bool
    dialect: str
    db_bytes: int | None
    wal_bytes: int | None
    growth: dict[str, Any]
    restart_gaps: int
