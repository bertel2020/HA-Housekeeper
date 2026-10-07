# Changelog

## 0.5.0 - 2026-10-07

Aufräumen mit Vorschau und umkehrbarer Quarantäne, Recorder und Energie in der
Auswirkungsanalyse sowie ein überarbeitetes Panel. **Housekeeper kann jetzt
erstmals etwas ändern**, und zwar ausschließlich nach ausdrücklicher
Bestätigung eines Plans und nur als umkehrbare Quarantäne (Entity
deaktivieren). Automatisiert gegen Home Assistant 2026.2.3 getestet.

### Neu

- **Aufräumen**: Ausgewählte verwaiste oder lange nicht verfügbare Entities
  werden zuerst in einem **Dry Run** geprüft (ohne bekannte Verwendung, zu
  prüfen, blockiert) und im **Journal** protokolliert. Ein Plan lässt sich
  bestätigen (Wort eintippen) und ausführen: Das **Deaktivieren** setzt die
  Entity in Quarantäne, Historie und Statistiken bleiben unverändert. Vor jedem
  Schritt wird neu geprüft, bei Änderungen bricht der Lauf ab, danach prüft
  Housekeeper das Ergebnis, und jeder Schritt lässt sich **rückgängig machen**.
  Blockierte Einträge laufen nie, „zu prüfen“ nur mit Einzelbestätigung. Das
  Entfernen ist weiterhin nur eine Vorschau.
- **Recorder und Energie-Dashboard** in der Auswirkungsanalyse: Entities des
  Energie-Dashboards gelten als verwendet, Entities mit Langzeitstatistiken sind
  markiert.
- **Verwaiste Statistiken**: Reiter in „Nicht verwendet“ mit
  Langzeitstatistiken, zu denen es keine Entity mehr gibt (nur ein Hinweis).
- **Optionen im Panel ändern**: Scanintervall und Schwellenwerte unter
  **Einstellungen**.
- **Darstellung im Benutzerprofil**: Die Einstellungen werden pro
  Home-Assistant-Benutzer gespeichert. Neu sind **kompakte Dichte** und
  **reduzierte Animationen**.
- **Hinweis bei veraltetem Scan** auf der Übersicht.
- **Suche und Filter** für „Änderungen“ und für viele Integrationsprobleme.

### Geändert

- **Neue Farbschemata** aus dem Design der Zeitarchiv-App: Standard,
  Housekeeper und Modern, jeweils hell und dunkel (ersetzen Salbei und Indigo).
- Die **Schriftgröße** skaliert nur noch den Text statt der ganzen Oberfläche;
  „Normal“ ist etwas größer als zuvor.
- **Seitenleiste fixiert**, mit Einstellungen am unteren sichtbaren Rand. Das
  Badge im Seitenkopf lautet „Ändert nur nach Bestätigung“ statt
  „Schreibgeschützt“.
- **Gleich breite Kacheln** auf der Übersicht und ein überarbeitetes Aussehen.
- Dokumentation und Texte beschreiben jetzt zutreffend, was Housekeeper ändert.

---

### English

Tidy up with preview and reversible quarantine, recorder and energy in the
impact analysis, and a reworked panel. **Housekeeper can now change something
for the first time**, only after you explicitly confirm a plan and only as a
reversible quarantine (disabling an entity). Tested automatically against Home
Assistant 2026.2.3.

#### New

- **Tidy up**: selected orphaned or long-unavailable entities are first checked
  in a **dry run** (no known use, to review, blocked) and recorded in the
  **journal**. A plan can be confirmed (type a word) and executed: **disabling**
  puts the entity into quarantine, history and statistics stay untouched. Every
  step is re-checked first, the run aborts if something changed, Housekeeper
  verifies the result afterwards, and every step can be **undone**. Blocked
  entries never run, “to review” only with an individual confirmation. Removal
  is still a preview only.
- **Recorder and Energy dashboard** in the impact analysis: entities of the
  Energy dashboard count as used, entities with long-term statistics are
  marked.
- **Orphaned statistics**: tab in “Not used” listing long-term statistics that
  no longer have an entity (a hint only).
- **Change options in the panel**: scan interval and thresholds under
  **Settings**.
- **Appearance in your user profile**: settings are stored per Home Assistant
  user. New are **compact density** and **reduced animation**.
- **Notice for an outdated scan** on the overview.
- **Search and filters** for “Changes” and for many integration problems.

#### Changed

- **New color schemes** from the Zeitarchiv app design: Standard, Housekeeper,
  and Modern, each in light and dark (replacing Sage and Indigo).
- **Font size** now scales only the text instead of the whole interface;
  “Normal” is slightly larger than before.
- **Fixed sidebar**, with Settings at the visible bottom edge. The header badge
  reads “Changes only on confirmation” instead of “Read only”.
- **Equal-width tiles** on the overview and a more polished look.
- Documentation and texts now describe accurately what Housekeeper changes.

## 0.4.0 - 2026-10-07

Einstellungen, Filter und Sortierung für Listen, neue Übersicht und zwei
weitere Hinweise. Housekeeper arbeitet weiterhin ausschließlich lesend. Lokal
gegen Home Assistant 2026.2.3 getestet, zusätzlich in einer laufenden Instanz
mit Home Assistant 2026.9.4 ausprobiert.

### Neu

- **Einstellungen** (unten in der Seitenleiste): Version und Eckdaten von
  Housekeeper, Schriftgröße (klein, normal, groß), Modus (automatisch, hell,
  dunkel), Farbschema (Standard, Salbei, Indigo), Startansicht, Einträge pro
  Seite und Verwaltung ausgeblendeter Befunde. Die Darstellung wird pro Browser
  gespeichert. **Info kopieren** legt die wichtigsten Angaben für Fehlerberichte
  in die Zwischenablage.
- **Nicht verwendet**: Ansicht mit aktiven Entities, die in keiner Automation,
  keinem Skript, keiner Szene, Gruppe, keinem Helfer und keinem lesbaren
  Dashboard vorkommen. Nur ein Hinweis, kein Befund.
- **Batterie-Schwelle** einstellbar unter **Konfigurieren** (Standard 20 %).
- **Listen durchsuchen, filtern und sortieren**: Befunde, Batterien, Nicht
  verwendet und Inventar. Der Export enthält genau die angezeigten Befunde.
- **Seitenweise Listen** (Standard 20 pro Seite, wählbar 20, 50 oder 100).
- **Link in den Reparaturhinweisen**: Die Beschreibung enthält einen Link, der
  direkt in die passend gefilterte Befundliste springt.

### Geändert

- **Neu angeordnete Übersicht** mit der Karte **Aufräumen** (schwache
  Batterien, mögliche Duplikate, ungenutzte Automationen, nicht verwendete
  Entities) und den Integrationsproblemen unter „Benötigt Aufmerksamkeit“.
- Das Inventar zeigt standardmäßig 20 statt 100 Einträge pro Seite und lässt
  sich per Klick auf die Spaltenüberschriften auf- und absteigend sortieren.

### Behoben

- Die Batterie-Ansicht zeigt die Seitenfußzeile mit der Seitennavigation.

---

### English

Settings, filtering and sorting for lists, a new overview, and two more hints.
Housekeeper remains strictly read-only. Tested locally against Home Assistant
2026.2.3 and tried in a running instance on Home Assistant 2026.9.4.

#### New

- **Settings** (bottom of the sidebar): version and key facts about Housekeeper,
  font size (small, normal, large), mode (automatic, light, dark), color scheme
  (Standard, Sage, Indigo), start view, entries per page, and management of
  hidden findings. Appearance is stored per browser. **Copy info** puts the
  essentials for bug reports on the clipboard.
- **Not used**: view of active entities that appear in no automation, script,
  scene, group, helper, or readable dashboard. A hint only, not a finding.
- **Configurable low-battery threshold** under **Configure** (default 20 %).
- **Search, filter, and sort lists**: findings, batteries, not used, and
  inventory. The export contains exactly the findings shown.
- **Paged lists** (default 20 per page, selectable 20, 50, or 100).
- **Link in the repair hints**: the description contains a link that jumps
  straight to the matching filtered findings list.

#### Changed

- **Rearranged overview** with the **Tidy up** card (low batteries, possible
  duplicates, unused automations, unused entities) and the integration problems
  under "Needs attention".
- The inventory shows 20 instead of 100 entries per page by default and can be
  sorted ascending or descending by clicking the column headers.

#### Fixed

- The batteries view shows the page footer with the page navigation.

## 0.3.1 - 2026-10-07

Korrekturen für HACS und Hassfest sowie ein überarbeiteter Seitenleistenkopf.
Housekeeper arbeitet weiterhin ausschließlich lesend. Lokal gegen Home
Assistant 2026.2.3 getestet, zusätzlich in einer laufenden Instanz mit
Home Assistant 2026.9.4 ausprobiert.

### Geändert

- Das Logo steht in der Seitenleiste jetzt über dem Titel, Schrift größer.
- Die Integration deklariert `lovelace` als `after_dependencies` und eine
  Konfigurationsschema-Angabe, wie es Hassfest verlangt.
- `hacs.json` bereinigt, Repository-Themen ergänzt (HACS-Validierung).
- README (Deutsch und Englisch) auf den aktuellen Funktionsumfang gebracht.

---

### English

Fixes for HACS and Hassfest plus a reworked sidebar header. Housekeeper remains
strictly read-only. Tested locally against Home Assistant 2026.2.3 and tried in
a running instance on Home Assistant 2026.9.4.

#### Changed

- The logo now sits above the title in the sidebar, with larger type.
- The integration declares `lovelace` as `after_dependencies` and a config
  schema, as Hassfest requires.
- `hacs.json` cleaned up, repository topics added (HACS validation).
- README (German and English) brought up to date with the current feature set.

## 0.3.0 - 2026-10-07

Mehr Quellen, Scanvergleich und Sensoren. Housekeeper arbeitet weiterhin
ausschließlich lesend. Lokal gegen Home Assistant 2026.2.3 getestet.

### Neu

- **Skripte, Szenen und Dashboards** werden als Quellen berücksichtigt. Fehlende
  Ziele werden als Befund gemeldet.
- **Gruppen und Helfer** (Template, Ableitung, Min/Max, Schwellwert u. a.) zählen
  als Quellen. Fehlende Mitglieder oder Quell-Entities werden gemeldet.
- **Auswirkung einer Entfernung**: Die Detailseite zeigt, welche Automationen,
  Skripte, Szenen, Dashboards, Gruppen und Helfer ein Objekt verwenden.
- **Scanvergleich**: Die Ansicht **Änderungen** zeigt neue und behobene Befunde,
  Statuswechsel sowie neue und entfernte Objekte gegenüber dem vorherigen Scan
  oder dem Scan vor bis zu 7 Tagen.
- **Automatischer Scan** (Standard alle 24 Stunden, `0` = aus).
- **Mögliche Duplikate** (zum Beispiel `licht_2` neben einem aktiven `licht`)
  und **ungenutzte Automationen** (nie ausgelöst, lange nicht ausgelöst, lange
  deaktiviert; Standard 90 Tage, `0` = aus).
- **Befunde ausblenden** im Panel oder per Label `housekeeper_ignore` an der
  Entity. Ausgeblendete Befunde zählen nicht in Übersicht, Sensoren und
  Reparaturhinweisen.
- **Sensoren**: Ein Dienstgerät mit Zählern für Befunde, verwaiste und nicht
  verfügbare Entities, defekte Referenzen, mögliche Duplikate, ungenutzte
  Automationen, schwache Batterien und dem Zeitpunkt des letzten Scans.
- **Batterien**: Neue Ansicht mit allen Batterie-Entities, niedrigste Werte
  zuerst (niedrig ab 20 %).
- **Integrationsprobleme** erscheinen als Karte auf der Übersicht.
- **Direktlinks** ins Panel (`?view=…&filter=…`, `?object=…`). Reparaturhinweise
  springen direkt in die passend gefilterte Befundliste.

### Geändert

- **Neue Detailseite** statt Seitenleiste, mit Zurück-Navigation, neu
  aufgebauter Ursachendiagnose in Klartext mit Empfehlung und Diagnose auch für
  Geräte, Integrationen und Automationen.
- Das Panel nutzt die volle Breite; das Logo steht in der Seitenleiste.
- Der Reparaturhinweis für defekte Automationen umfasst jetzt alle Quellen mit
  fehlenden Referenzen.

---

### English

More sources, scan comparison, and sensors. Housekeeper remains strictly
read-only. Tested locally against Home Assistant 2026.2.3.

#### New

- **Scripts, scenes, and dashboards** are covered as sources. Missing targets
  are reported as findings.
- **Groups and helpers** (template, derivative, min/max, threshold, and others)
  count as sources. Missing members or source entities are reported.
- **Impact of a removal**: the detail page shows which automations, scripts,
  scenes, dashboards, groups, and helpers use an object.
- **Scan comparison**: the **Changes** view shows new and resolved findings,
  status changes, and new and removed objects compared with the previous scan
  or the scan from up to 7 days ago.
- **Automatic scan** (default every 24 hours, `0` = off).
- **Possible duplicates** (for example `light_2` next to an active `light`) and
  **unused automations** (never triggered, not triggered for a long time,
  disabled for a long time; default 90 days, `0` = off).
- **Hide findings** in the panel or with the label `housekeeper_ignore` on the
  entity. Hidden findings do not count in the overview, sensors, or repair hints.
- **Sensors**: a service device with counters for findings, orphaned and
  unavailable entities, broken references, possible duplicates, unused
  automations, low batteries, and the time of the last scan.
- **Batteries**: new view with all battery entities, lowest values first (low
  from 20 %).
- **Integration problems** appear as a card on the overview.
- **Deep links** into the panel (`?view=…&filter=…`, `?object=…`). Repair hints
  jump straight to the matching filtered findings list.

#### Changed

- **New detail page** instead of the sidebar, with back navigation, a rebuilt
  plain-language root-cause diagnosis with a recommendation, and diagnosis for
  devices, integrations, and automations as well.
- The panel uses the full width; the logo is shown in the sidebar.
- The repair hint for broken automations now covers all sources with missing
  references.

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
