# HA Housekeeper

[![GitHub release](https://img.shields.io/github/v/release/roberto/HA-Housekeeping?include_prereleases&style=flat-square)](https://github.com/roberto/HA-Housekeeping/releases)
[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=flat-square)](https://hacs.xyz/docs/faq/custom_repositories/)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-Custom%20Integration-18BCF2.svg?style=flat-square&logo=home-assistant&logoColor=white)](https://www.home-assistant.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/roberto/HA-Housekeeping?style=flat-square)](https://github.com/roberto/HA-Housekeeping/commits/)
[![Validate](https://img.shields.io/github/actions/workflow/status/roberto/HA-Housekeeping/validate.yml?branch=main&style=flat-square&label=validation)](https://github.com/roberto/HA-Housekeeping/actions/workflows/validate.yml)

HA Housekeeper is a German- and English-language, read-only maintenance explorer for Home Assistant. Version 0.1 inventories entities, devices, integrations, areas, and automations; explains entity health; and visualizes registry and automation dependencies.

> Version 0.1 is intentionally read-only. It does not delete or modify Home Assistant objects.

## Version 0.1

- Admin-only sidebar panel
- Searchable, sortable, filterable inventory
- Entity, device, integration, area, floor, label, and automation records
- Conservative distinction between disabled, unavailable, missing, and active entities
- Persistent “observed since” timestamp for every entity classification
- Detail drawer with registry and state information
- Dependency graph from registry relationships and loaded automation references
- Automation details for triggers, conditions, actions, blueprints, and missing references
- German and English UI
- Tested against Home Assistant 2026.2.3

## Manual installation

1. Copy `custom_components/ha_housekeeper` to the same folder below your Home Assistant configuration directory.
2. Restart Home Assistant.
3. Open **Settings → Devices & services → Add integration**.
4. Search for **HA Housekeeper** and confirm setup.
5. Open **Housekeeper** in the sidebar as an administrator.

## License

HA Housekeeper is released under the [MIT License](LICENSE).
