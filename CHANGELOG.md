# Changelog

## 1.1.0 - 2026-10-10

Aufräumen wird mächtiger: Pläne als Assistent, Verlauf kürzen, Backups und Automationen löschen, Entitäten umbenennen und Bereiche zuweisen. Dazu Batterien mit Typ und Einkaufsliste.

### Neu

- **Pläne als Assistent:** Prüfen, Bestätigen, Ausführen, Ergebnis in vier Schritten; ein Plan ohne ausführbare Aktion zeigt nur den Grund.
- **Verlauf kürzen:** Gespeicherte Zustände ausgewählter Entitäten löschen, die älter als eine gewählte Zahl von Tagen sind (endgültig, mit Backup davor).
- **Housekeeper-Backups aufräumen:** Liste der eigenen Backups mit Regel „letzte N behalten und alles jünger als M Tage“; Backups beobachteter Pläne und das jüngste mit Rückgängig sind geschützt.
- **Automationen löschen:** Ungenutzte Automationen aus `automations.yaml` als Plan entfernen, mit Vorschau, Prüfung und Rückgängig.
- **Umbenennen mit Verweisen:** Neue Entitäts-ID, Verweise in Automationen, Skripten, Szenen und Dashboards ziehen mit; Rückgängig stellt Dateien und ID wieder her.
- **Bereich zuweisen:** Für Entitäten und Geräte ohne Bereich, mit Vorschlag aus Gerät oder Integration.
- **Batterien:** Batterietyp je Gerät mit Einkaufsliste für 30 Tage, erkannter Batteriewechsel zum Eintragen; Spannungsbatterien zählen in der Übersicht mit.
- **Automationsziele:** Verlauf je Automation und ein Befund, wenn ein Ziel wiederholt verfehlt wird.
- **Recorder:** Karte „Im Recorder“ je Entität und Auswahl für den Ausschluss in `configuration.yaml`.
- **Export** aus dem Inventar als CSV, Markdown oder JSON; eigene Einträge im Verlauf der Änderungen; Sparklines in den Kopfkacheln.

### Behoben

- Recorder-Löschungen warten auf jeden Block, bevor gezählt wird.
- Während ein Plan schreibt, lädt Housekeeper nicht neu; ein durch Neustart unterbrochener Lauf endet als teilweise oder abgebrochen.
- Die Statuszahl ist in jeder Ansicht gleich.
- Scheitert das kleine Backup, bietet Housekeeper ein vollständiges als neue Vorschau an, statt es von selbst zu starten.

### English

Cleanup gets more capable: plans as a guided flow, trimming history, deleting backups and automations, renaming entities and assigning areas. Plus batteries with type and a shopping list.

#### New

- **Plans as a guided flow:** check, confirm, run, result in four steps; a plan with nothing to run shows only the reason.
- **Trim history:** delete stored states of selected entities older than a chosen number of days (final, with a backup first).
- **Tidy Housekeeper backups:** list of its own backups with the rule "keep the last N and everything younger than M days"; backups of watched plans and the newest one with undo are protected.
- **Delete automations:** remove unused automations from `automations.yaml` as a plan, with preview, verification and undo.
- **Rename with references:** new entity ID, references in automations, scripts, scenes and dashboards follow; undo restores files and ID.
- **Assign an area:** for entities and devices without one, suggested from the device or the integration.
- **Batteries:** battery type per device with a 30-day shopping list, a detected battery change to log; batteries in volts count in the overview.
- **Automation goals:** history per automation and a finding when a goal is missed repeatedly.
- **Recorder:** an "In the recorder" card per entity and a selection for the exclusion in `configuration.yaml`.
- **Export** from the inventory as CSV, Markdown or JSON; own entries in the change history; sparklines in the header tiles.

#### Fixed

- Recorder deletions wait for every block before counting.
- Housekeeper does not reload while a plan writes; a run cut off by a restart ends as partial or aborted.
- The status number is the same in every view.
- If the small backup fails, Housekeeper offers a full one as a new preview instead of starting it on its own.

## 1.0.5 - 2026-10-10

Zwei Fehler behoben, die in 1.0.3 und 1.0.4 steckten, und vier neue Wartungsziele.

### Behoben

- **Scan bricht ab (Issue #5):** Mit Home Assistant 2026.10 scheiterte der erste Scan an
  Automationen mit Vorlagen („Template is not a container or iterable“). Housekeeper
  übernimmt aus Home Assistant nur noch echte IDs.
- **Zeilen anhaken ging nicht:** Das Anhaken einzelner Zeilen in Befunden, Aufräumen und
  beim Löschen von Statistiken löste einen Fehler aus.
- **Statistiken löschen:** Mehr als 200 ausgewählte Reihen liefen auf einen leeren Fehler.
  Jetzt nimmt jeder Durchgang die ersten 200, der Rest bleibt ausgewählt; der Knopf zeigt
  die Zahl, und nach „Jetzt ausführen“ springt die Seite zum Fortschritt.

### Neu

- **Wartungsziele:** Sensoren ohne neue Meldung, wiederkehrende Ausfälle, Automationen mit
  Fehlern (30 Tage) und verwaiste Statistiken.

### English

Two bugs fixed that were in 1.0.3 and 1.0.4, and four new maintenance goals.

#### Fixed

- **Scan aborts (issue #5):** with Home Assistant 2026.10 the first scan failed on
  automations with templates ("Template is not a container or iterable"). Housekeeper now
  takes only real IDs from Home Assistant.
- **Ticking rows did not work:** ticking single rows in Findings, Cleanup and when
  deleting statistics raised an error.
- **Deleting statistics:** more than 200 selected series ended in an empty error. Each
  round now takes the first 200 and the rest stays selected; the button shows the count,
  and after "Run now" the page jumps to the progress.

#### New

- **Maintenance goals:** sensors without a new report, recurring outages, automations with
  errors (30 days) and orphaned statistics.

## 1.0.4 - 2026-10-10

Neue Erkennung für Sensoren, die nichts mehr melden.

### Neu

- **„Meldet nicht mehr“:** Ein Sensor, der seinen letzten Wert behält, aber länger als das
  Limit nichts Neues meldet, erscheint als Befund. Standard 48 Stunden (Option
  `stale_hours`, 0 = aus), nur für Sensoren mit Messwerten; pro Sensor einstellbar in der
  Übersicht der Entität, auch für andere Entitäten.
- **Befunde:** In „Ausgeblendet“, „Bekannt“ und „Zurückgestellt“ gibt es „Wieder
  einblenden“.
- **Datenbank:** Die Karte zeigt den ältesten Eintrag im Recorder.

### English

New detection for sensors that stopped reporting.

#### New

- **"Stops reporting":** a sensor that keeps its last value but reports nothing new for
  longer than the limit appears as a finding. Default 48 hours (option `stale_hours`,
  0 = off), for sensors with measurements only; adjustable per sensor on the entity's
  overview, also for other entities.
- **Findings:** "Show again" in "Hidden", "Known" and "Snoozed".
- **Database:** the card shows the oldest entry in the recorder.

## 1.0.3 - 2026-10-09

Bedienung und Lesbarkeit.

### Neu

- **Klares Ergebnis nach einem Plan:** Ein Band zeigt grün, gelb oder rot, wie es ausging
  und ob Rückgängig geht. Der Plan wartet jetzt die Prüfung ab, statt auf „Ausgeführt“
  stehen zu bleiben.
- **Verwaiste Statistiken:** Spalten „Erster Eintrag“ und „Datensätze“, Checkbox im
  Listenkopf, „Nur Ausgewählte zeigen“.
- **Bestätigung:** ein Haken für alle zu prüfenden Einträge statt einem pro Zeile;
  abgebrochene Pläne lassen sich wiederholen; der Prüfbericht lässt sich einklappen.
- **Bedienung:** Shift-Klick wählt Bereiche, Kopierknopf an IDs, „Filter zurücksetzen“,
  Tasten `/` und `Esc`, Pfeiltasten in Listen, kurze Meldungen, „Seit deinem letzten
  Besuch“ auf der Übersicht, „Nur lesen“/„Kann ändern“ pro Seite.
- Knöpfe nach Wirkung abgestuft, Löschen ist rot.

### Geändert

- Schmale Bildschirme: Schrittleiste des Assistenten und Erinnerungen passen jetzt.
- Doppelte Kachelzeile bei „Verwaiste Statistiken“ entfernt.

### English

Usability and readability.

#### New

- **Clear result after a plan:** a band shows green, amber or red, how it went and
  whether undo works. The plan now waits for the check instead of staying on "Executed".
- **Orphaned statistics:** columns "First entry" and "Records", a checkbox in the list
  header, "Show selected only".
- **Confirmation:** one tick for all entries to review instead of one per row; aborted
  plans can be repeated; the audit report can be folded.
- **Handling:** Shift-click selects ranges, copy button on IDs, "Reset filters", keys `/`
  and `Esc`, arrow keys in lists, short messages, "Since your last visit" on the overview,
  "Read only"/"Can change" per page.
- Buttons weighted by effect, deleting is red.

#### Changed

- Narrow screens: the assistant's step bar and reminders now fit.
- Duplicate tile row removed from "Orphaned statistics".

## 1.0.2 - 2026-10-09

Neue Navigation mit Kacheln und einige Korrekturen.

### Neu

- **Kacheln mit Anzahlen** in Aufräumen, Zuverlässigkeit, Recorder, Richtlinien,
  Freigabe, Läufe und Wartung; die gewählte Kachel ist hervorgehoben. Quarantäne ist ein
  eigener Bereich mit Freigabe in der Liste.
- **Erinnerungen** haben eine eigene Ansicht unter „Pflegen“. Batterien stehen in einer
  Liste, auch solche in Volt; die Prognose ist in Gruppen mit Gerät, Raum und Datum
  eingeklappt.
- Abgebrochene Pläne lassen sich per „Plan wiederholen“ als neue Vorschau erneut anlegen.
  Der Prüfbericht lässt sich wieder einklappen.

### Geändert

- Scheitert das kleine Backup vor einem Plan, versucht Housekeeper das volle automatische
  Backup; der Fehlertext erscheint im Plan und im Log.
- Beim Löschen von Statistiken sind die gespeicherten Zustände standardmäßig mit dabei.
- Die Gruppe „Bald“ der Aufgabenliste ist zunächst eingeklappt.

### English

New tile navigation and some fixes.

#### New

- **Tiles with counts** in Cleanup, Reliability, Recorder, Policies, Exposure, Runs and
  Maintenance; the chosen tile is highlighted. Quarantine is its own area with release in
  the list.
- **Reminders** have their own view under "Maintain". Batteries are in one list, including
  those in volts; the forecast is folded into groups with device, room and date.
- Aborted plans can be repeated as a new preview with "Repeat plan". The audit report can
  be folded again.

#### Changed

- If the small backup before a plan fails, Housekeeper tries the full automatic backup;
  the error text shows in the plan and in the log.
- Deleting statistics also deletes the stored states by default.
- The "Soon" group of the to-do list starts folded.

## 1.0.1 - 2026-10-09

Korrekturen und eine Oberfläche, die aufgeräumter ist.

### Geändert

- **Kleineres Backup vor Plänen:** Housekeeper sichert nur Home Assistant, ohne Apps und
  Ordner, und die Datenbank nur, wenn der Plan in sie schreibt. Das Backup erscheint als
  eigenes Backup „Housekeeper …“, zählt nicht zu deiner Aufbewahrung und nicht als
  reguläres Backup. Home Assistant löscht diese Backups nicht von selbst.
- **Zählerreparatur** brach bei laufenden Zählern fast immer mit „Die Daten wurden nach
  der Vorschau geändert“ ab; das ist behoben.
- Der Hinweis „Home Assistant startet noch“ und die Meldung „Ein Plan läuft“ erklären
  sich jetzt und verschwinden von selbst.
- Prüfbericht: Namen und IDs sind standardmäßig im Klartext, mit Haken zum Teilen als
  Platzhalter.
- Oberfläche: Befundzeilen, Journal, Einstellungen, Farbschema-Auswahl und Knöpfe sind
  einheitlicher angeordnet.

### English

Fixes and a tidier interface.

#### Changed

- **Smaller backup before plans:** Housekeeper backs up Home Assistant only, without
  apps and folders, and the database only when the plan writes into it. The backup shows
  up as its own “Housekeeper …” backup, does not count towards your retention and not as
  the regular backup. Home Assistant does not delete these backups by itself.
- **Counter repair** almost always aborted on running counters with “The data changed
  after the preview”; fixed.
- The notes “Home Assistant is still starting” and “A plan is running” explain
  themselves now and go away on their own.
- Audit report: names and IDs are in plain text by default, with a tick to share it with
  placeholders.
- Interface: finding rows, journal, settings, colour scheme choice and buttons are laid
  out more consistently.

## 1.0.0 - 2026-10-09

Erste veröffentlichte Version von HA Housekeeper. Lege vor dem Aufräumen ein Home-Assistant-Backup an, es gibt
keine Gewährleistung (siehe Haftungsausschluss in der README).

### Enthalten

- Bestand und Befunde: Entitäten, Geräte, Automationen, Skripte und Szenen, verwaiste
  und lange nicht verfügbare Objekte, kaputte Verweise, Duplikate, ungenutzte
  Automationen, Batterien (Prozent und Volt) und Wartungsziele.
- Aufräumen nur nach bestätigtem Plan mit Vorschau, Quarantäne, Backup, Prüfung danach
  und Rückgängig im Journal.
- Reparieren: Zählerfehler, Sensorfehler, Zählerwechsel, Verweise ersetzen, Geräte
  austauschen.
- Wartung, Sicherheitsmodus, Befund-Status, eine Suche überall, Farbschemata und
  Deutsch und Englisch.

### English

First published version of HA Housekeeper. Make a
Home Assistant backup before cleaning up; there is no warranty (see the disclaimer
in the README).

#### Included

- Inventory and findings: entities, devices, automations, scripts and scenes, orphaned
  and long-unavailable objects, broken references, duplicates, unused automations,
  batteries (percent and volts) and maintenance goals.
- Cleanup only after a confirmed plan with preview, quarantine, backup, verification
  and undo in the journal.
- Repair: counter glitches, sensor errors, meter change, replacing references,
  exchanging devices.
- Maintenance, protection mode, finding status, one search everywhere, colour schemes
  and German and English.
