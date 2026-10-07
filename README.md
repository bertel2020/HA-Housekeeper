# HA Housekeeper

[Deutsch](README.de.md) · **English**

[![GitHub release](https://img.shields.io/github/v/release/bertel2020/HA-Housekeeping?include_prereleases&style=flat-square)](https://github.com/bertel2020/HA-Housekeeping/releases)
[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=flat-square)](https://hacs.xyz/docs/faq/custom_repositories/)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-Custom%20Integration-18BCF2.svg?style=flat-square&logo=home-assistant&logoColor=white)](https://www.home-assistant.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/bertel2020/HA-Housekeeping?style=flat-square)](https://github.com/bertel2020/HA-Housekeeping/commits/)
[![Validate](https://img.shields.io/github/actions/workflow/status/bertel2020/HA-Housekeeping/validate.yml?branch=main&style=flat-square&label=validation)](https://github.com/bertel2020/HA-Housekeeping/actions/workflows/validate.yml)

HA Housekeeper is a bilingual maintenance and analysis integration for Home Assistant. It creates a clear inventory of your installation, explains suspicious or orphaned objects, and shows how entities, devices, integrations, areas, and automations depend on each other.

The goal is not aggressive automatic cleanup. Housekeeper helps you understand what exists, why something is considered problematic, and what would be affected before any future cleanup operation is introduced.

> Version 0.1 is strictly read-only. It does not delete, disable, rename, or otherwise modify Home Assistant objects.

## Why HA Housekeeper?

Mature Home Assistant installations often accumulate registry entries, unavailable entities, replaced devices, old statistics, and automation references that are difficult to assess safely. A missing state alone does not explain whether an entity was intentionally disabled, whether its integration is disabled, or whether the underlying device no longer exists.

Housekeeper combines registry data and the live Home Assistant runtime to provide that context in one administrator-only panel.

## Features in version 0.1

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

### Dependency explorer

The dependency view visualizes direct relationships such as:

```text
Integration → owns → Device → provides → Entity
Floor → contains → Area → contains → Device
Automation → triggers on / checks / targets → Entity or Device
```

Each relationship includes a confidence level. Explicit registry and configuration relationships are marked as certain; references inferred by Home Assistant at runtime are identified separately.

### Bilingual user interface

The panel and configuration flow are available in German and English. The active Home Assistant language determines which panel language is shown.

## Safety model

- The panel is available to Home Assistant administrators only.
- All Housekeeper WebSocket endpoints require administrator privileges.
- Version 0.1 exposes read and scan operations only.
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
- Use **Scan now** to refresh the snapshot after configuration or device changes.

The first scan establishes the initial observation timestamps. Later scans preserve the start of an unchanged classification and reset it when the classification changes.

## Current limitations

- Version 0.1 does not perform cleanup or history/statistics migration.
- Automation analysis covers automations currently loaded by Home Assistant. The amount of available detail can vary for invalid or externally managed automations.
- Dynamic templates cannot always be resolved to one definite target. Such relationships are never presented as certain without supporting runtime information.
- The dependency view currently focuses on direct registry and automation relationships.
- HACS and Hassfest workflows are configured, but require a published GitHub repository to run remotely.

## Development and validation

Version 0.1 has been tested locally against Home Assistant 2026.2.3. The test suite covers:

- manifest and package contracts
- German/English backend translation parity
- automation reference extraction and missing-target detection
- Config Flow creation and complete Config Entry setup
- registry and state inventory scanning
- Python linting and formatting
- Python and frontend syntax

Run the dependency-free local tests with:

```bash
python3 -m pytest -q
```

The GitHub validation workflow additionally installs Home Assistant and its frontend to execute the runtime integration tests, HACS validation, and Hassfest.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release notes in English and German.

## License

HA Housekeeper is released under the [MIT License](LICENSE).
