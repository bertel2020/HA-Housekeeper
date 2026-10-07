<p align="center">
  <img src="https://raw.githubusercontent.com/bertel2020/HA-Housekeeping/main/custom_components/ha_housekeeper/brand/logo.png" alt="HA Housekeeper" width="160">
</p>

<h1 align="center">HA Housekeeper</h1>

<p align="center">
  Maintenance and analysis for Home Assistant: inventory, diagnostics, and dependencies at a glance.
</p>

<p align="center">
  <a href="https://github.com/hacs/integration"><img src="https://img.shields.io/badge/HACS-Custom-41BDF5.svg" alt="HACS Custom"></a>
  <a href="https://www.home-assistant.io/"><img src="https://img.shields.io/badge/Home%20Assistant-Custom%20Integration-18BCF2.svg?logo=home-assistant&logoColor=white" alt="Home Assistant"></a>
  <a href="https://github.com/bertel2020/HA-Housekeeping/releases"><img src="https://img.shields.io/github/v/release/bertel2020/HA-Housekeeping?sort=semver&include_prereleases" alt="Release"></a>
  <a href="https://github.com/bertel2020/HA-Housekeeping/actions/workflows/validate.yml"><img src="https://github.com/bertel2020/HA-Housekeeping/actions/workflows/validate.yml/badge.svg" alt="Validate"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/bertel2020/HA-Housekeeping" alt="License"></a>
</p>

<p align="center">
  <a href="https://buymeacoffee.com/bertel2020"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-FFDD00?logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee"></a>
  <a href="https://ko-fi.com/bertel2020"><img src="https://img.shields.io/badge/Ko--fi-support-FF5E5B?logo=ko-fi&logoColor=white" alt="Ko-fi"></a>
  <a href="https://paypal.me/RobertoMartins"><img src="https://img.shields.io/badge/PayPal-donate-00457C?logo=paypal&logoColor=white" alt="PayPal"></a>
</p>

<p align="center"><em><a href="README.md">Deutsche Version</a></em></p>

HA Housekeeper is a maintenance and analysis integration for Home Assistant. It creates a clear inventory of your installation, explains suspicious or orphaned objects, and shows how entities, devices, integrations, areas, and automations depend on each other.

The goal is not aggressive automatic cleanup. Housekeeper helps you understand what exists, why something is considered problematic, and what would be affected before any future cleanup operation is introduced.

> Housekeeper is strictly read-only. It does not delete, disable, rename, or otherwise modify Home Assistant objects. It stores only its own data (observation times, scan history, hidden findings).

## What Housekeeper does

| Task | Behavior |
| --- | --- |
| **Inventory** | Entities, devices, integrations, areas, floors, labels, and automations with search, filters, and sorting |
| **Diagnostics** | Distinguishes active, unavailable, unknown, disabled, and orphaned objects, each with a reason |
| **Observation time** | Stores since when Housekeeper has observed a classification |
| **Automation analysis** | Triggers, conditions, actions, blueprints, and missing references; likewise for scripts, scenes, dashboards, groups, and helpers |
| **Scan comparison** | New and resolved findings, status changes, new and removed objects since the last scan |
| **Cleanup hints** | Possible duplicates, unused automations, low batteries |
| **Sensors and hints** | Counters as sensors, aggregated repair hints, export as CSV/JSON |
| **Dependencies** | Relationships between integration, device, entity, area, and automation with a confidence level |
| **Safety** | Administrators only, strictly read-only |

## Why HA Housekeeper?

Mature Home Assistant installations often accumulate registry entries, unavailable entities, replaced devices, old statistics, and automation references that are difficult to assess safely. A missing state alone does not explain whether an entity was intentionally disabled, whether its integration is disabled, or whether the underlying device no longer exists.

Housekeeper combines registry data and the live Home Assistant runtime to provide that context in one administrator-only panel.

## Features

### Installation overview

- Inventory of entities, devices, integrations/config entries, areas, floors, labels, and automations
- Search by name, object ID, unique ID, platform, or integration
- Filter by object type and status
- Sortable and paginated inventory for larger installations
- Summary of object counts and current findings

### Entity and device diagnostics

Housekeeper distinguishes between:

- an active entity with a current state
- an entity reporting `unknown`
- an entity reporting `unavailable`
- an intentionally disabled entity
- an entity belonging to a disabled device
- an entity belonging to a disabled integration
- an entity whose device no longer exists in the device registry
- an entity whose config entry no longer exists
- a registry entity that no longer has a state

For every continuously observed classification, Housekeeper stores when it first detected that condition. This timestamp is explicitly presented as a **first Housekeeper observation**, not as an invented deletion or failure date.

### Automation analysis

- Lists loaded automations and their current state
- Shows mode, concurrency limits, last trigger time, and blueprint origin
- Displays triggers, conditions, and actions in the detail view
- Extracts entity, device, area, floor, and label references
- Includes references detected by the Home Assistant runtime, including many template references
- Detects references whose target no longer exists
- Retains the precise configuration location for explicit references when available
- Scripts, scenes and dashboards are checked for references and missing targets in the same way; the detail page shows under **Impact of removal** what a removal would affect (analysis only, no changes)

### Changes since the last scan

The **Changes** view compares the current state with the previous scan or with the last scan of each of the past seven days: status changes (worsened first), new and resolved findings, and new and removed objects. The history is stored compactly in Home Assistant and contains only statuses and IDs.

### More views and sources

- **Hide findings**: a finding can be hidden on the detail page (only in Housekeeper's own list, Home Assistant stays untouched). Alternatively the label `housekeeper_ignore` on an entity hides all of its findings. Hidden findings do not count in the overview, sensors, or repair hints and can be shown again with **Show hidden**.
- **Sensors**: Housekeeper creates a service device with counters (findings, orphaned and unavailable entities, broken references, possible duplicates, unused automations, low batteries, last scan) for use in dashboards and automations.
- **Batteries**: a dedicated view with all battery entities, lowest values first (low from 20 %, configurable).
- **Not used**: a view of active entities that appear in no automation, script, scene, group, helper, or readable dashboard (without diagnostic and configuration entities, filterable by domain). A hint only, not a finding: voice assistants, apps, auto-generated dashboards, and external systems are invisible to Housekeeper.
- **Integrations with problems** appear on the overview, next to a **Tidy up** card with quick access to batteries, duplicates, unused automations, and unused entities.
- **Settings** (cog at the bottom of the sidebar): version and key facts about Housekeeper, font size (small/normal/large), mode (automatic/light/dark), color scheme (Standard, Sage, Indigo), start view, entries per page, and management of hidden findings. Appearance is stored per browser.
- **Long lists** are paged (default 20 per page, selectable 20/50/100) and can be searched, filtered, and sorted (findings, batteries, not used, inventory). The export contains exactly the findings shown.
- **More reference sources**: groups (members) and helpers such as template, derivative, or min/max sensors (source entities) are included in dependencies and impact analysis; missing members and sources are reported as findings.
- **Deep links**: the panel supports addresses like `/ha-housekeeper?view=findingsNav&filter=orphaned` or `?object=entity:sensor.x`; the repair hints use them.

### Dependency explorer

The dependency view visualizes direct relationships such as:

```text
Integration → owns → Device → provides → Entity
Floor → contains → Area → contains → Device
Automation → triggers on / checks / targets → Entity or Device
```

Each relationship includes a confidence level. Explicit registry and configuration relationships are marked as certain; references inferred by Home Assistant at runtime are identified separately.

### Findings, export, and repair hints

- Findings list with reasons and diagnosis confidence; export as **CSV** or **JSON** (respects the selected filter)
- Threshold for unavailable entities: under **Configure** you choose after how many days (default 7, `0` = immediately) an unavailable entity becomes a finding. Short outages, for example after a restart, are ignored. Orphaned entities are always reported immediately.
- **Possible duplicates**: a non-working entity with a number suffix (`…_2`) for which a working entity of the same integration with the same base ID exists is marked as a leftover
- **Unused automations**: switched off for a long time, not triggered for a long time, or never triggered (using the automation's age); threshold under **Configure** (default 90 days, `0` = off)
- **Automatic scan** every 24 hours (adjustable) keeps the history and repair hints current
- Hints under **Settings → Repairs**: at most three aggregated entries (orphaned entities, long-unavailable entities, automations with missing references) linking to the panel. They are informational only and offer no repair.
- **Diagnostics download** for bug reports (integration → Download diagnostics) contains counts only, no names or IDs.

### Languages

The panel and configuration flow are available in German and English. The active Home Assistant language determines which panel language is shown.

## Safety model

- The panel is available to Home Assistant administrators only.
- All Housekeeper WebSocket endpoints require administrator privileges.
- Housekeeper offers read and scan operations. The only write operation is hiding findings in Housekeeper's own storage.
- `unavailable` is never treated as automatically orphaned.
- Disabled devices and integrations are distinguished from missing objects.
- No `.storage` file is edited directly.
- No cleanup action runs automatically.

Cleanup plans, backups, verification, and rollback are intentionally reserved for later versions.

## Installation

### Via HACS (recommended)

[![Open the HACS repository in My Home Assistant](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=bertel2020&repository=HA-Housekeeping&category=integration)
[![Add HA Housekeeper to My Home Assistant](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=ha_housekeeper)

1. Use the first button to open the Housekeeper repository in HACS.
2. Download **HA Housekeeper** and restart Home Assistant.
3. Use the second button to add the integration. Alternatively, open
   **Settings → Devices & services → Add integration → HA Housekeeper** in
   Home Assistant.
4. Then open **Housekeeper** in the sidebar while signed in as an administrator.

If the first button does not work, add
`https://github.com/bertel2020/HA-Housekeeping` in HACS under **Integrations →
Custom repositories** with the category **Integration**.

### Manual

Copy the `custom_components/ha_housekeeper` directory to
`/config/custom_components/ha_housekeeper` and restart Home Assistant. Then add
the integration as described above.

The resulting directory should look like this:

```text
config/
└── custom_components/
    └── ha_housekeeper/
        ├── __init__.py
        ├── manifest.json
        └── ...
```

## Usage

Open **Housekeeper** from the Home Assistant sidebar. The overview shows object totals, findings, and the time of the last scan.

- Select a category card to open a filtered inventory.
- Select an object to inspect registry information, state data, diagnosis, and direct dependencies.
- Open **Dependencies** and select an object to explore incoming and outgoing relationships.
- Use **Scan now** to refresh the snapshot after configuration or device changes. Without intervention Housekeeper scans automatically every 24 hours.
- Under **Settings → Devices & services → HA Housekeeper → Configure** you can set four values: days until an unavailable entity becomes a finding (default 7), days until an automation counts as unused (default 90, `0` = off), the scan interval in hours (default 24, `0` = off), and the low-battery threshold in percent (default 20).
- The **Findings**, **Changes**, **Batteries**, and **Not used** views are available from the panel navigation.

The first scan establishes the initial observation timestamps. Later scans preserve the start of an unchanged classification and reset it when the classification changes.

## Current limitations

- Housekeeper does not perform cleanup or history/statistics migration.
- Automation analysis covers automations currently loaded by Home Assistant. The amount of available detail can vary for invalid or externally managed automations.
- Dynamic templates cannot always be resolved to one definite target. Such relationships are never presented as certain without supporting runtime information.
- The dependency view focuses on direct relationships. The recorder (history, statistics) and unreadable or auto-generated dashboards are not part of the impact analysis; it is a hint, not a guarantee.
- Possible duplicates and unused automations are based on heuristics and are hints, not certainty.

## Development and validation

Housekeeper is tested automatically against Home Assistant 2026.2.3 (locally and in the GitHub workflow, plus the latest release) and has been tried in a running instance on Home Assistant 2026.9.4. The test suite covers:

- manifest and package contracts
- German/English backend translation parity
- automation reference extraction and missing-target detection
- Config Flow creation and complete Config Entry setup
- registry and state inventory scanning, sources (scripts, scenes, dashboards, groups, helpers), scan comparison, hiding findings, and sensors
- Python linting and formatting
- panel logic (views, filters, export, escaping) with Node.js
- Python and frontend syntax

Run the dependency-free local tests with:

```bash
python3 -m pytest -q
```

The GitHub validation workflow additionally installs Home Assistant and its frontend to execute the runtime integration tests, HACS validation, and Hassfest.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release notes in English and German.

## License

This project is released under the [MIT License](LICENSE).
Copyright 2026 Roberto / bertel2020.
