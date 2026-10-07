# Changelog / Änderungsprotokoll

All notable changes are documented in English and German.

Alle wesentlichen Änderungen werden auf Englisch und Deutsch dokumentiert.

## 0.1.0 — 2026-10-07

Validated locally against Home Assistant 2026.2.3.

Lokal gegen Home Assistant 2026.2.3 validiert.

### English

- Add a UI-configurable, single-entry Home Assistant custom integration.
- Add an administrator-only Housekeeper sidebar panel in German and English.
- Inventory entities, devices, config entries, areas, and automations.
- Inspect loaded automation structures including triggers, conditions, actions, blueprints, and runtime-extracted references.
- Detect missing entity, device, and area references in automations and retain their configuration locations when available.
- Distinguish active, unavailable, unknown, disabled, missing-device, missing-config-entry, and missing-state cases.
- Persist the first Housekeeper observation of the current entity classification.
- Add filtering, search, sorting, object details, and a registry and automation dependency graph.
- Add scan status reporting while keeping all backend endpoints strictly read-only.
- Add local contract tests, Home Assistant runtime tests, Ruff checks, HACS validation, and Hassfest validation.
- Add a visible findings table that links diagnoses to affected entity and automation details.
- Replace the short project note with complete English and German README documentation and reciprocal language links.

### Deutsch

- Über die Benutzeroberfläche konfigurierbare Home-Assistant-Custom-Integration mit genau einem Konfigurationseintrag hinzugefügt.
- Administrator-Panel in der Seitenleiste auf Deutsch und Englisch hinzugefügt.
- Inventarisierung von Entities, Geräten, Konfigurationseinträgen, Bereichen und Automationen umgesetzt.
- Geladene Automationsstrukturen einschließlich Triggern, Bedingungen, Aktionen, Blueprints und durch Home Assistant ermittelten Referenzen werden analysiert.
- Fehlende Entity-, Geräte- und Bereichsreferenzen in Automationen werden erkannt; soweit verfügbar wird die genaue Fundstelle gespeichert.
- Aktive, nicht verfügbare, unbekannte, deaktivierte sowie durch fehlende Geräte, Konfigurationseinträge oder Zustände verursachte Fälle werden unterschieden.
- Der Zeitpunkt des ersten Housekeeper-Nachweises der aktuellen Entity-Klassifikation wird dauerhaft gespeichert.
- Filter, Suche, Sortierung, Objektdetails sowie ein Registry- und Automations-Abhängigkeitsgraph wurden ergänzt.
- Scanstatus-Abfrage ergänzt; alle Backend-Endpunkte bleiben strikt schreibgeschützt.
- Lokale Vertragstests, Home-Assistant-Laufzeittests, Ruff-Prüfung, HACS-Validierung und Hassfest-Validierung ergänzt.
- Sichtbare Befundtabelle ergänzt, die Diagnosen mit den betroffenen Entity- und Automationsdetails verknüpft.
- Die kurze Projektbeschreibung durch vollständige englische und deutsche README-Dokumentation mit gegenseitigen Sprachverweisen ersetzt.

## 0.1.0-alpha.1 — 2026-10-07

### English

- Created the first installable read-only explorer skeleton.
- Added the initial inventory, detail drawer, dependency view, translations, tests, project plan, logo concept, and MIT license.

### Deutsch

- Erstes installierbares Gerüst des schreibgeschützten Explorers erstellt.
- Erstes Inventar, Detailansicht, Abhängigkeitsansicht, Übersetzungen, Tests, Projektplan, Logokonzept und MIT-Lizenz hinzugefügt.
