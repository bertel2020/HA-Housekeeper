# Changelog

## 0.2.0 - 2026-10-07

Neu gestaltetes Panel, Befund-Export, Reparaturhinweise und schnellere Scans.
Housekeeper arbeitet weiterhin ausschließlich lesend. Lokal gegen Home Assistant
2026.2.3 getestet.

### Neu

- **Neues Panel-Design** mit Seitennavigation, Gesundheitsanzeige, Kennzahlen,
  „Benötigt Aufmerksamkeit“, Inventarstatus und eigener Befundansicht.
- **Detailansicht** mit Ursachendiagnose (Integration, Gerät, Zustand) und der
  Schaltfläche **In Home Assistant öffnen**.
- **Abhängigkeitsansicht** zeigt Herkunft und Verwendung eines Objekts getrennt.
- **Export der Befunde** als CSV oder JSON, passend zum gewählten Filter.
- **Schwellwert für nicht verfügbare Entities**: Unter **Konfigurieren** wird
  eingestellt, nach wie vielen Tagen (Standard 7, `0` = sofort) eine nicht
  verfügbare Entity als Befund gilt. Verwaiste Entities werden weiterhin sofort
  gemeldet.
- **Reparaturhinweise** unter **Einstellungen → Reparaturen**: höchstens drei
  zusammengefasste Einträge mit Link ins Panel. Sie sind rein informativ.
- **Diagnosedaten** zum Herunterladen für Fehlerberichte; sie enthalten nur
  Zählwerte, keine Namen oder IDs.

### Geändert

- Nicht verfügbare Entities erscheinen standardmäßig erst nach 7 Tagen als
  Befund (zuvor sofort). Im Inventar bleibt der Status unverändert.
- Der erste Scan startet erst, wenn Home Assistant vollständig gestartet ist.
  Das verhindert fälschlich als verwaist erkannte Entities nach einem Neustart.
- Attribute und Automationsstrukturen werden erst beim Öffnen eines Objekts
  geladen. Das verkleinert die Scan-Antwort deutlich.
- Beobachtungszeitpunkte werden gebündelt gespeichert statt bei jeder Änderung.
- Der Scanstatus zeigt während des Scans Zwischenstände.

### Behoben

- Selektorwerte wie `all` und `none` sowie Blueprint-Platzhalter (`!input`)
  gelten nicht mehr als Referenzen. Das behebt falsche Befunde wie „fehlender
  Bereich“ bei `area_id: none`.
- Die WebSocket-Befehle antworten zwischen Entladen und Neuladen der
  Integration mit einer klaren Fehlermeldung.

---

### English

New panel design, findings export, repair hints, and faster scans. Housekeeper
remains strictly read-only. Tested locally against Home Assistant 2026.2.3.

#### New

- **New panel design** with side navigation, health indicator, key figures,
  "Needs attention", inventory status, and a dedicated findings view.
- **Detail view** with root-cause diagnosis (integration, device, state) and an
  **Open in Home Assistant** button.
- **Dependency view** shows origin and usage of an object separately.
- **Findings export** as CSV or JSON, matching the selected filter.
- **Threshold for unavailable entities**: under **Configure** you choose after
  how many days (default 7, `0` = immediately) an unavailable entity becomes a
  finding. Orphaned entities are still reported immediately.
- **Repair hints** under **Settings → Repairs**: at most three aggregated
  entries linking to the panel. They are informational only.
- **Downloadable diagnostics** for bug reports; they contain counts only, no
  names or IDs.

#### Changed

- Unavailable entities become findings only after 7 days by default (previously
  immediately). The status in the inventory is unchanged.
- The first scan waits until Home Assistant has fully started. This prevents
  entities from being wrongly detected as orphaned after a restart.
- Attributes and automation structures are loaded only when an object is
  opened, which makes the scan response much smaller.
- Observation timestamps are saved in batches instead of on every change.
- The scan status shows intermediate progress while scanning.

#### Fixed

- Selector values such as `all` and `none` and blueprint placeholders (`!input`)
  no longer count as references. This fixes false findings such as "missing
  area" for `area_id: none`.
- WebSocket commands answer with a clear error between unloading and reloading
  the integration.

## 0.1.0 - 2026-10-07

Erste Version. Housekeeper arbeitet ausschließlich lesend und verändert
keine Home-Assistant-Objekte. Lokal gegen Home Assistant 2026.2.3 getestet.

### Neu

- **Housekeeper-Panel** in der Seitenleiste, nur für Administratoren, auf
  Deutsch und Englisch.
- **Inventar** von Entities, Geräten, Integrationen, Bereichen, Etagen, Labels
  und Automationen mit Suche, Filtern, Sortierung und Detailansicht.
- **Diagnose** mit Begründung: aktiv, nicht verfügbar, unbekannt, deaktiviert
  (Entity, Gerät oder Integration) sowie verwaist (Gerät, Konfigurationseintrag
  oder Zustand fehlt).
- **Beobachtet seit**: Housekeeper speichert, seit wann eine Klassifikation
  besteht. Der Zeitpunkt gilt ab der ersten Beobachtung durch Housekeeper, nicht
  als tatsächliches Ausfalldatum.
- **Automationsanalyse** mit Triggern, Bedingungen, Aktionen und Blueprints.
  Fehlende Entity-, Geräte- und Bereichsreferenzen werden erkannt, samt
  Fundstelle in der Konfiguration, soweit verfügbar.
- **Abhängigkeitsansicht** zwischen Integration, Gerät, Entity, Bereich und
  Automation, mit Vertrauensstufe je Beziehung.
- **Befundtabelle**, die Diagnosen mit den betroffenen Entities und Automationen
  verknüpft.
- **Scanstatus**; bei einem fehlgeschlagenen Scan zeigt das Panel eine
  verständliche Fehlermeldung.

### Behoben

- Die Administrator-Prüfung der WebSocket-Befehle funktioniert auf aktuellen
  Home-Assistant-Versionen.
- Die Registries aktueller Home-Assistant-Versionen werden ohne veraltete
  Zugriffe gelesen.

---

### English

First release. Housekeeper is strictly read-only and does not modify any Home
Assistant objects. Tested locally against Home Assistant 2026.2.3.

#### New

- **Housekeeper panel** in the sidebar, administrators only, in German and
  English.
- **Inventory** of entities, devices, integrations, areas, floors, labels, and
  automations with search, filters, sorting, and a detail view.
- **Diagnostics** with a reason: active, unavailable, unknown, disabled (entity,
  device, or integration), and orphaned (device, config entry, or state
  missing).
- **Observed since**: Housekeeper stores since when a classification has
  existed. The time counts from Housekeeper's first observation, not from the
  actual failure date.
- **Automation analysis** with triggers, conditions, actions, and blueprints.
  Missing entity, device, and area references are detected, including their
  location in the configuration where available.
- **Dependency view** between integration, device, entity, area, and
  automation, with a confidence level per relationship.
- **Findings table** linking diagnoses to the affected entities and
  automations.
- **Scan status**; if a scan fails, the panel shows an understandable error
  message.

#### Fixed

- The administrator check of the WebSocket commands works on current Home
  Assistant releases.
- Registries of current Home Assistant releases are read without deprecated
  accessors.

## 0.1.0-alpha.1 - 2026-10-07

### Neu

- Erstes installierbares Gerüst des Explorers mit Inventar, Detailansicht und
  Abhängigkeitsansicht.

---

### English

#### New

- First installable skeleton of the explorer with inventory, detail view, and
  dependency view.
