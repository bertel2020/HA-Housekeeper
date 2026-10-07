# Changelog

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
