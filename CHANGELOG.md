# Changelog

## 0.11.0 - 2026-10-08

Betrieb sichtbar machen: Automationsläufe, Last im Recorder, Datenbankzustand
und Freigaben für Sprachassistenten, dazu eine überarbeitete Einstellungsseite.
Automatisiert gegen Home Assistant 2026.8.3, 2026.9.4 und 2026.10.0b4 getestet
(303 Python- und 149 Panel-Tests). Alles Neue liest nur; es wird nichts
geändert oder gelöscht.

### Neu

- **Automationsläufe (Menü Betrieb):** Housekeeper zählt alle 15 Minuten die
  Läufe aus den Traces von Home Assistant und behält nur Tageszahlen. Die
  Ansicht nennt Automationen und Skripte, die häufig fehlschlagen, nie laufen,
  ungewöhnlich oft laufen oder kaum noch laufen, jeweils mit den Zahlen dahinter.
  Auf der Detailseite zeigt ein Reiter „Läufe“ den Verlauf.
- **Last (Menü Betrieb):** Welche Entities, Integrationen und Ereignistypen den
  Recorder am meisten beschreiben, für 24 Stunden oder 7 Tage: Stürme,
  Attribut-Fluten, Entities ohne neuen Zustand, Anteil je Integration und
  Ereignisfluten, mit „Daran hängen“ (Automationen, Skripte, Template-Sensoren).
- **Datenbank (Karte in der Wartung):** Größe von Datenbank und WAL-Datei (nur
  SQLite), Wachstum, doppelte Statistikzeitpunkte, fehlende Stunden,
  Statistiken, die nicht zur Entity passen, und Lücken im Recorder, getrennt
  nach Neustart und echter Lücke. Probleme erscheinen auch in den Aufgaben der
  Übersicht.
- **Freigaben (Pflegen):** Welche Entities Assist, Alexa, Google Assistant und
  HomeKit erreichen können, mit Hinweisen zu Diagnose- und sensiblen Entities,
  Freigaben für deaktivierte oder verwaiste Entities, doppelten Sprachnamen und
  Webhooks von Integrationen, die es nicht mehr gibt. Passwörter, Tokens, Ports
  und Webhook-IDs werden weder gelesen noch angezeigt.
- **Verlauf von Versionen und Neustarts:** Housekeeper führt ein eigenes
  Protokoll von Versionswechseln und Neustarts; es erklärt Lücken und
  Auffälligkeiten.
- **Verwaiste Statistiken:** erklären die zwei Wege hinaus und nennen
  wahrscheinliche Nachfolger.
- **Änderungen:** Fehlt der Vergleich, erklärt die Ansicht warum und bietet an,
  einen Vergleichspunkt zu setzen. Objekte in Quarantäne lassen sich aus der
  Liste und von der Detailseite zurückholen.

### Geändert

- **Einstellungen neu gestaltet:** Kopfband mit Version und Eckdaten, vier
  Reiter (Darstellung, Scan und Schwellen, Ausgeblendet, Info), Kacheln für
  Schema und Modus, Schwellen als Karten mit Einheit und Standardwert; „Speichern“
  wird erst nach einer Änderung aktiv.
- **Ruhigere Oberfläche:** Die Überschrift nennt die Menügruppe und den
  Zeitpunkt des letzten Scans; die Detailseite zeigt Zustand und Ursache nur
  einmal; Befunde nennen die Regel in Worten; die Aufräum-Leiste ist
  gruppiert; Listenleisten geben der Suche mehr Platz; Zählhinweise klappen
  weg; Änderungen sagen, wenn ein Filter einen Abschnitt leert; Listen der
  Zuverlässigkeit und der Läufe sind in Seiten geteilt.

### English

Making operation visible: automation runs, recorder load, database health and
exposure to voice assistants, plus a reworked settings page. Tested
automatically against Home Assistant 2026.8.3, 2026.9.4 and 2026.10.0b4 (303
Python and 149 panel tests). Everything new only reads; nothing is changed or
deleted.

#### New

- **Automation runs (Operation menu):** Housekeeper counts runs from Home
  Assistant's traces every 15 minutes and keeps daily numbers only. The view
  names automations and scripts that often fail, never run, run unusually often
  or hardly run any more, each with the numbers behind it. A “Runs” tab on the
  detail page shows the history.
- **Load (Operation menu):** Which entities, integrations and event types write
  the most to the recorder, for 24 hours or 7 days: storms, attribute floods,
  entities without a new state, share per integration and event floods, with
  “Depends on it” (automations, scripts, template sensors).
- **Database (card in Maintenance):** size of the database and WAL file
  (SQLite only), growth, duplicate statistics timestamps, missing hours,
  statistics that do not fit their entity, and recorder gaps, told apart as
  restart and real gap. Problems also appear in the overview tasks.
- **Exposure (Maintain):** Which entities Assist, Alexa, Google Assistant and
  HomeKit can reach, with hints on diagnostic and sensitive entities, exposure
  of disabled or orphaned entities, duplicate voice names and webhooks of
  integrations that no longer exist. Passwords, tokens, ports and webhook ids
  are neither read nor shown.
- **Version and restart history:** Housekeeper keeps its own log of version
  changes and restarts; it explains gaps and anomalies.
- **Orphaned statistics:** explain the two ways out and name likely successors.
- **Changes:** If no comparison exists, the view says why and offers to set a
  comparison point. Quarantined objects can be taken out of quarantine from the
  list and the detail page.

#### Changed

- **Settings redesigned:** header band with version and key facts, four tabs
  (Look, Scan and thresholds, Hidden, Info), tiles for scheme and mode,
  thresholds as cards with unit and default; “Save” becomes active only after a
  change.
- **Calmer interface:** the heading names the menu group and the time of the
  last scan; the detail page shows state and cause only once; findings name
  their rule in words; the cleanup toolbar is grouped; list bars give the
  search more room; counting notes fold away; Changes says when a filter empties
  a section; the reliability and runs lists are split into pages.

## 0.10.0 - 2026-10-08

Backup-Schutz, Integrations-Zuverlässigkeit und eine neue Oberfläche: das Menü
liegt jetzt oben, die Gestaltung folgt dem Look der Zeitarchiv-App, IBM Plex
wird mitgeliefert. Automatisiert gegen Home Assistant 2026.8.3, 2026.9.4 und
2026.10.0b4 getestet (224 Python- und 123 Panel-Tests); die Oberfläche
zusätzlich mit Browser-Screenshots und einer axe-Prüfung.

### Neu

- **Backup-Schutz in der Wartung:** Eine Karte prüft die Backups von Home
  Assistant: Einrichtung, Alter des neuesten Backups, letzter Lauf, Ziele,
  Größenverlauf, Aufbewahrung, Verschlüsselung, Notfall-Kit und Restore-Test
  sowie die Backups vor Plänen. Die Übersicht zeigt nur echte Probleme als
  To-do. Notfall-Kit und Restore-Test lassen sich mit Datum bestätigen; ein
  geführter Restore-Test erklärt die Schritte.
- **Zuverlässigkeit:** Neue Ansicht je Konfigurationseintrag mit Verfügbarkeit
  der letzten 24 Stunden oder 7 Tage, gemeinsamen Ausfällen (mindestens 80 %
  der Entities, mindestens drei, mindestens 5 Minuten), einer Vermutung zur
  Ebene (Cloud oder Gerät und Netz), dauerhaft Ausgefallenen getrennt gezählt
  und offener Neu-Anmeldung. Housekeeper liest dafür nur den Recorder, im
  Hintergrund, mit Sperre gegen parallele Abfragen und fünf Minuten
  Zwischenspeicher.
- **Instabile Entities:** Eine Karte darunter nennt Entities, die immer wieder
  ausfallen und zurückkommen (instabil ab 3 Ausfällen und 0,5 pro Tag,
  flatternd ab 1,5 pro Tag), mit Dauer, Tageszeit-Muster und der Zahl der
  Automationen, Skripte und Szenen, die daran hängen. Ausfälle während eines
  gemeinsamen Ausfalls zählen für die Integration.
- **Geräteseite mit Untergeräten:** Art „Untergerät“, übergeordnetes Gerät als
  Link, „Daran hängen“ zählt Untergeräte mit, und Aufräumen nennt die
  strukturellen Sperrgründe.

### Geändert

- **Das Menü liegt oben statt in der Seitenleiste:** Übersicht, Befunde und
  Änderungen sind direkt erreichbar, Erkunden, Pflegen und Spezialansichten
  klappen als Menü auf, Einstellungen stehen rechts. Auf dem Handy öffnet ein
  Menü-Knopf die Liste; Escape und ein Klick außerhalb schließen.
- **Neue Gestaltung im Stil der Zeitarchiv-App:** weichere Karten, kräftigere
  Überschriften, ruhigere Tabellenköpfe, Inhalt mittig bis 1480 px. IBM Plex
  Sans und Mono werden mitgeliefert (Schrift-Lizenz OFL), mit Systemschrift als
  Rückfall. Die Farbschemas bleiben unverändert.

### English

Backup protection, integration reliability and a new interface: the menu is now
on top, the design follows the look of the Zeitarchiv app, and IBM Plex ships
with the panel. Tested automatically against Home Assistant 2026.8.3, 2026.9.4
and 2026.10.0b4 (224 Python and 123 panel tests); the interface was also
checked with browser screenshots and an axe scan.

#### New

- **Backup protection in maintenance:** A card checks Home Assistant's backups:
  setup, age of the newest backup, last run, targets, size trend, retention,
  encryption, emergency kit and restore test, plus the backups taken before
  plans. The overview shows only real problems as a to-do. Emergency kit and
  restore test can be confirmed with a date; a guided restore test explains the
  steps.
- **Reliability:** A new view for each config entry with availability over the
  last 24 hours or 7 days, shared outages (at least 80 % of the entities, at
  least three, at least 5 minutes), a guess at the layer (cloud or device and
  network), entities that were down all the time counted apart, and open
  re-authentication. Housekeeper only reads the recorder for this, in the
  background, with a lock against parallel queries and a five-minute cache.
- **Unstable entities:** A card below lists entities that keep failing and
  coming back (unstable from 3 failures and 0.5 a day, flapping from 1.5 a
  day), with duration, time-of-day pattern and the number of automations,
  scripts and scenes that depend on them. Failures during a shared outage count
  for the integration.
- **Device page with child devices:** kind “Child device”, parent device as a
  link, “Depends on it” counts child devices, and cleanup names the structural
  reasons for a block.

#### Changed

- **The menu is on top instead of in the side bar:** overview, findings and
  changes are one click away, explore, maintain and special views open as
  menus, settings sit on the right. On a phone a menu button opens the list;
  Escape and a click outside close it.
- **New design in the style of the Zeitarchiv app:** softer cards, bolder
  headings, calmer table heads, content centred up to 1480 px. IBM Plex Sans
  and Mono ship with the panel (OFL font licence), with the system font as a
  fallback. The colour schemes are unchanged.

## 0.9.0 - 2026-10-08

Großes Sammelrelease: Härtung nach dem zweiten Code-Review (Journal,
Datenübertragung, Zählerwechsel, ehrliche Kennzahlen) und eine überarbeitete
Oberfläche mit gruppierter Navigation, handlungsorientierter Übersicht,
Detail-Tabs, Abhängigkeitsgraph und Aufräumen als Schrittfolge. Automatisiert
gegen Home Assistant 2026.8.3 und die jeweils neueste vom Testpaket
unterstützte Version getestet; die Oberfläche zusätzlich mit
Browser-Screenshots und einer axe-Prüfung auf Zugänglichkeit.

### Neu

- **Die Navigation ist gruppiert:** Überblick, Erkunden, Pflegen und
  Spezialansichten; die aktive Seite bleibt in der Seitenleiste sichtbar.
- **Die Übersicht beginnt mit „Was muss ich jetzt tun?“.** Die Liste nennt nach
  Dringlichkeit Integrationen mit Problem, neue kritische Befunde, einen
  überfälligen Scan, Backup-Probleme und abgelaufene Quarantäne. Die Karte „Seit
  dem letzten Scan“ zeigt neue und behobene Befunde, Statuswechsel und neue
  Objekte.
- **Objektseiten haben einen Kopf und Tabs:** Zustand, Ursache, Integration,
  Gerät, Bereich und das Risiko beim Entfernen stehen oben; darunter die Tabs
  Übersicht, Abhängigkeiten, Technische Daten und Attribute (Pfeiltasten, Link
  mit `tab=`).
- **Abhängigkeitsgraph:** In der Ansicht Abhängigkeiten lässt sich zwischen Liste
  und Graph umschalten. Der Graph zeigt Herkunft und Verwendung eines Objekts
  über bis zu drei Ebenen, Filter nach Beziehungstyp und „nur sichere“ sowie
  „Was bricht beim Entfernen?“. Knoten sind per Tastatur bedienbar; auf kleinen
  Bildschirmen bleibt die Liste.
- **Aufräumen zeigt die Schritte:** Auswahl, Auswirkungsanalyse, Bestätigung,
  Backup, Ausführung und Verifikation mit dem aktuellen Stand. Je Aktion steht,
  ob Housekeeper sie zurücknehmen kann oder ob nur das Backup hilft; Details wie
  Quellen und Treffer sind eingeklappt.
- **Vorschau-Warnung bei großen Dateien:** Kann eine Ersetzung in einer großen
  Datei nur Eintrag für Eintrag rückgängig gemacht werden, sagt die Vorschau es
  vorher.
- **Recorder-Kosten zeigen die aktuelle Rate.** Je Entity stehen die Zustände der
  letzten 24 Stunden und 7 Tage neben dem Durchschnitt pro Tag; die Liste ist
  nach der aktuellen Rate sortiert und lässt sich auf „Gesamt“ umschalten. Ein
  Ausschluss wird nur bei hoher **aktueller** Rate vorgeschlagen.
- **API-Version:** Antworten des Panels tragen das Feld `schema`.

### Geändert

- **Der Housekeeping-Status zählt betroffene Objekte statt Befunde;** ein Tooltip
  erklärt die Berechnung.
- **Schneller bei großen Installationen:** Sortieren und Filtern nutzen
  zwischengespeicherte Schlüssel, die Suche wartet kurz, Stylesheet und Fokus
  bleiben beim Neuzeichnen erhalten, ein Scan baut die Menge der vorhandenen
  Objekte nur noch einmal. Das Inventar einer Installation mit 8.000 Objekten
  zeichnet sich im Mittel in unter 2 ms statt 26 ms.
- **Die Planliste überträgt keine Wiederherstellungsdaten mehr.** `plan_list`
  liefert kurze Einträge, der neue Befehl `plan_detail` und `plan_status`
  liefern den Plan ohne die intern gespeicherten Dateikopien.

### Behoben

- **Das Journal verdrängt keine ausgeführten Pläne mehr.** Nur noch nie
  gestartete Vorschauen werden nach Anzahl begrenzt (20). Wird das Journal größer
  als 8 MB, geben die ältesten Pläne ihre Dateikopien ab (Rückgängig stellt dann
  einzelne Einträge statt der ganzen Datei wieder her, im Journal vermerkt); ein
  Plan hält höchstens 2 MB Dateikopien. Gelöscht wird nichts.
- **Zählerwechsel:** Der Fingerabdruck deckt alle zu importierenden Zeilen der
  alten Reihe mit allen Werten ab, dazu die erste Zeile der neuen Reihe und die
  Kompatibilität. Ein geänderter Wert zwischen Vorschau und Ausführung stoppt den
  Lauf; eine in der Zwischenzeit berechnete Stunde der laufenden Reihe ändert ihn
  nicht mehr.
- **Scans während einer Bereinigung:** Ein manueller Scan wird abgelehnt, solange
  ein Plan läuft; das Panel sperrt die Schaltfläche.
- **Sicherheitshinweis im Panel und in der README:** Sie nennen Vorschau,
  Bestätigung und Backup und sagen, dass sich manche Änderungen, besonders
  Statistikmigrationen, nur durch Wiederherstellen des Backups zurücknehmen
  lassen. Der Satz, jeder Schritt lasse sich rückgängig machen, ist korrigiert.
- **Mobile Ansicht:** Das Inventar zeigt Begründung und „beobachtet seit“ als
  Karten statt sie unter 860 Pixeln auszublenden; lange Begründungen werden
  umgebrochen.
- **Zugänglichkeit:** Aktive Navigation (`aria-current`), vorgelesener
  Fortschritt, sichtbarer Fokusrahmen, Tastaturbedienung der Inventarzeilen und
  Tabellenköpfe, benannte Auswahlfelder und ausreichender Kontrast für Statuspillen,
  Akzenttext und Schaltflächen (geprüft mit axe in hellem und dunklem Schema).

---

### English

Large collected release: hardening after the second code review (journal, data
transfer, meter change, honest figures) and a reworked interface with grouped
navigation, an action-oriented overview, detail tabs, a dependency graph and
cleanup as a sequence of steps. Tested automatically against Home Assistant
2026.8.3 and the latest version the test package supports; the interface was
also checked with browser screenshots and an axe accessibility scan.

#### New

- **The navigation is grouped:** overview, explore, maintain and special views;
  the active page stays visible in the side bar.
- **The overview starts with “What do I need to do now?”.** The list names, by
  urgency, integrations with a problem, new critical findings, an overdue scan,
  backup problems and an expired quarantine. The “Since the last scan” card shows
  new and fixed findings, status changes and new objects.
- **Object pages have a header and tabs:** status, cause, integration, device,
  area and the risk of removing it are on top; below are the tabs Overview,
  Dependencies, Technical data and Attributes (arrow keys, link with `tab=`).
- **Dependency graph:** the dependencies view switches between list and graph.
  The graph shows the origin and users of an object across up to three levels,
  filters by relation type and “certain only”, and “What breaks on removal?”.
  Nodes work with the keyboard; small screens keep the list.
- **Cleanup shows its steps:** selection, impact analysis, confirmation, backup,
  execution and verification with the current state. Each action says whether
  Housekeeper can take it back or only the backup helps; details such as sources
  and hits are folded.
- **Preview warning for large files:** if a replacement in a large file can only
  be undone item by item, the preview says so beforehand.
- **The recorder costs show the current rate.** Each entity lists the states of
  the last 24 hours and 7 days next to the average per day; the list is sorted by
  the current rate and can be switched to “Total”. An exclusion is suggested only
  when the **current** rate is high.
- **API version:** panel replies carry the field `schema`.

#### Changed

- **The housekeeping status counts affected objects instead of findings;** a
  tooltip explains the calculation.
- **Faster on large installations:** sorting and filtering use cached keys,
  search waits briefly, the style sheet and focus survive a redraw, and a scan
  builds the set of existing objects only once. The inventory of an installation
  with 8,000 objects draws in under 2 ms on average instead of 26 ms.
- **The plan list no longer transfers restore data.** `plan_list` returns short
  entries, the new `plan_detail` command and `plan_status` return the plan
  without the internally stored file copies.

#### Fixed

- **The journal no longer pushes out plans that ran.** Only previews that were
  never started are limited by number (20). If the journal grows beyond 8 MB, the
  oldest plans give up their file copies (undo then restores single items instead
  of the whole file, noted in the journal); a plan keeps at most 2 MB of file
  copies. Nothing is deleted.
- **Meter change:** the fingerprint covers every importable row of the old series
  with all values, plus the first row of the new series and the compatibility. A
  value changed between the preview and the run stops the run; an hour compiled
  meanwhile in the live series no longer changes it.
- **Scans during a cleanup:** a manual scan is refused while a plan runs; the
  panel disables the button.
- **Safety notice in the panel and the README:** they name the preview, the
  confirmation and the backup and say that some changes, especially statistics
  migrations, can only be taken back by restoring the backup. The sentence that
  every step can be undone is corrected.
- **Mobile view:** the inventory shows the reason and “observed since” as cards
  instead of hiding them below 860 pixels; long reasons wrap.
- **Accessibility:** active navigation (`aria-current`), announced progress,
  visible focus outline, keyboard operation of inventory rows and table headers,
  named select fields and sufficient contrast for status pills, accent text and
  buttons (checked with axe in the light and dark scheme).

## 0.8.2 - 2026-10-08

Korrektur zur vorläufigen Aufwärmphase aus 0.8.1. Automatisiert gegen Home
Assistant 2026.8.3 und die jeweils neueste vom Testpaket unterstützte Version
getestet.

### Behoben

- Die **vorläufige Aufwärmphase** beginnt jetzt schon beim Booten von Home
  Assistant und nicht erst mit dem Ereignis „gestartet“. Öffnete man das Panel
  vorher, löste es einen Scan aus, der noch als endgültig galt und viele
  Entities fälschlich als verwaist zählte. Solche Scans sind jetzt ebenfalls
  vorläufig; die Aufwärmphase endet fünf Minuten nach dem Start.

---

### English

Fix for the preliminary warm-up from 0.8.1. Tested automatically against Home
Assistant 2026.8.3 and the latest version the test package supports.

#### Fixed

- The **preliminary warm-up** now begins at the boot of Home Assistant and not
  only with the “started” event. If the panel was opened earlier, it triggered
  a scan that still counted as final and wrongly counted many entities as
  orphaned. Such scans are now preliminary too; the warm-up ends five minutes
  after the start.

## 0.8.1 - 2026-10-08

Zwei Korrekturen aus dem Handtest in einer echten Instanz (Home Assistant
2026.10, rund 8.000 Objekte). Automatisiert gegen Home Assistant 2026.8.3 und
die jeweils neueste vom Testpaket unterstützte Version getestet.

### Behoben

- **Scans beim Start von Home Assistant** waren zu früh: Home Assistant meldet
  „gestartet“, während langsame Integrationen noch Entities anlegen. Der
  Start-Scan stufte deshalb Entities ohne Zustand (vor allem Automationen) als
  „verwaist“ ein, zählte Reparaturhinweise falsch und setzte das „beobachtet
  seit“ zurück, sodass lange nicht verfügbare Entities unter die Schwelle
  fielen. Jetzt sind Scans in den ersten fünf Minuten nach einem Start
  vorläufig: Sie ändern keine gespeicherten Beobachtungen, Reparaturhinweise
  und keinen Verlauf, die Zähler-Sensoren zeigen „unbekannt“, und Aufräumen ist
  gesperrt. Danach folgt ein endgültiger Scan. Das Panel zeigt dazu einen
  Hinweis und lädt sich selbst neu.
- Der **Update-Preflight** zählte auch gespeicherte Reparaturen, die gerade
  keine Integration meldet, und zeigte so Hunderte offene Reparaturen. Es
  zählen nur aktive. Das Backup-Alter steht jetzt als „vor 1 h“.

---

### English

Two fixes from a hand test in a real instance (Home Assistant 2026.10, about
8,000 objects). Tested automatically against Home Assistant 2026.8.3 and the
latest version the test package supports.

#### Fixed

- **Scans while Home Assistant starts** ran too early: Home Assistant reports
  “started” while slow integrations are still adding entities. The startup scan
  therefore classified entities without a state (mostly automations) as
  “orphaned”, counted repairs hints wrongly and reset “observed since”, so that
  entities that had been unavailable for a long time fell below the threshold.
  Scans in the first five minutes after a start are now preliminary: they change
  no stored observations, repairs hints or history, the count sensors show
  “unknown”, and cleanup is locked. A final scan follows. The panel shows a
  notice and reloads itself.
- The **update preflight** also counted stored repairs that no integration
  raises right now and so showed hundreds of open repairs. Only active ones
  count. The backup age now reads “1 h ago”.

## 0.8.0 - 2026-10-08

Sicherheits- und Kompatibilitätsrelease nach einem Code-Review. **Housekeeper
benötigt jetzt Home Assistant 2026.8 oder neuer**, weil ein Gerät dort genau
einem Config Entry gehört. Automatisiert gegen Home Assistant 2026.8.3 und die
jeweils neueste vom Testpaket unterstützte Version getestet (Python 3.14).

### Geändert

- Die Gerätebereinigung nutzt den einzelnen Config Entry eines Geräts. Das
  reguläre Entfernen fragt die Integration und entfernt das Gerät danach über
  den aktuellen Weg von Home Assistant. Journal-Einträge früherer Versionen
  mit einem Config Entry lassen sich weiterhin wiederherstellen.
- Die README (Deutsch und Englisch) unterscheidet jetzt eindeutig zwischen
  bestätigter Bereinigung, Rückgängig im Journal, nicht Rückgängigem (die
  Statistik des Zählerwechsels) und einem vollständigen Backup-Restore.

### Behoben

- **Untergeräte (Child Devices)** werden inventarisiert. Entities eines
  Untergeräts oder einer älteren zusammengesetzten Geräte-ID galten vorher als
  „Gerät fehlt“ und damit als Bereinigungskandidaten. Untergeräte werden
  angezeigt, aber nie deaktiviert, entfernt oder vergessen; ein Gerät mit
  Untergeräten zählt wie ein Hub.
- **Verweise ersetzen**: Eine bereits geschriebene Quelle wird sofort für das
  Zurücksetzen registriert, auch wenn das anschließende Lesen fehlschlägt. Jedes
  Ergebnis eines Rollbacks steht im Journal; bleibt eine Quelle verändert, ist
  der Plan „Teilweise ausgeführt“ und lässt sich mit „Rückgängig“ erneut
  versuchen.
- **Rückgängig bei YAML-Dateien** stellt die ursprüngliche Datei bytegenau
  wieder her (Kommentare, Anführungszeichen, Anker), solange sie noch so ist,
  wie Housekeeper sie geschrieben hat; sonst wird wie bisher nur der geänderte
  Eintrag zurückgesetzt.
- **Zählerwechsel**: Lässt sich die alte Entity nach einer hängenden
  ID-Übernahme nicht zurückbenennen, steht das als unvollständiger Schritt im
  Journal (statt einer unregistrierten alten ID mit einer rohen Fehlermeldung),
  und „Rückgängig“ kann ihn abschließen. Ein in der Zwischenzeit berechneter
  Stundenwert der neuen Reihe lässt den Import nicht mehr als fehlgeschlagen
  gelten. Fehlt dem alten Ende die Summe, verlangt die Vorschau eine Prüfung.
- Der erste und der geplante Scan starteten unter Home Assistant 2026.9 und
  neuer nicht, weil sie in einem Thread statt auf der Event-Loop liefen.
- Das Wiederherstellen einer entfernten Entity schlug mit Python 3.14 fehl.
- Ein abgelehntes Entladen der Plattformen lässt Panel, Scanner und
  Reparaturhinweise bestehen.

---

### English

Security and compatibility release after a code review. **Housekeeper now
needs Home Assistant 2026.8 or newer**, because a device belongs to exactly one
config entry there. Tested automatically against Home Assistant 2026.8.3 and
the latest version the test package supports (Python 3.14).

#### Changed

- Device cleanup uses the single config entry of a device. Regular removal asks
  the integration and then removes the device the way current Home Assistant
  expects. Journal entries of earlier versions with one config entry can still
  be restored.
- The README (German and English) now clearly separates confirmed cleanup,
  undo in the journal, what cannot be undone (the statistics of a meter change)
  and a full backup restore.

#### Fixed

- **Child devices** are inventoried. Entities of a child device or of an older
  composite device ID used to count as “device missing” and so as cleanup
  candidates. Child devices are shown but never disabled, removed or forgotten;
  a device with child devices counts like a hub.
- **Replace references**: a source that was already written is registered for
  rollback at once, even if reading it again fails. Every rollback outcome is
  in the journal; if a source stays changed, the plan is “Partially executed”
  and Undo can try again.
- **Undo for YAML files** restores the original file byte for byte (comments,
  quoting, anchors) while it is still as Housekeeper wrote it; otherwise only
  the changed item is put back, as before.
- **Meter change**: if the old entity cannot be renamed back after a stuck ID
  takeover, the journal shows an incomplete step (instead of an unregistered
  old ID with a raw error), and Undo can finish it. An hourly value compiled in
  the meantime no longer makes the import count as failed. If the old end has
  no total, the preview asks for a look.
- The initial and the scheduled scan did not start on Home Assistant 2026.9 and
  newer, because they ran in a thread instead of on the event loop.
- Restoring a removed entity failed on Python 3.14.
- A refused unload of the platforms keeps the panel, the scanner and the
  repairs hints.

## 0.7.0 - 2026-10-07

Zählerwechsel und eine neue Wartungsansicht. Der Zählerwechsel schreibt in die
Langzeitstatistik des Recorders und benennt Entities um; das geschieht wie alle
Änderungen nur nach ausdrücklicher Bestätigung und mit einem
Home-Assistant-Backup, das vorher gelingen muss. Automatisiert gegen Home
Assistant 2026.2.3 getestet.

### Neu

- **Zählerwechsel**: Die Historie eines ersetzten Zählers wird mit dem neuen
  zusammengeführt. Die stündliche Langzeitstatistik des alten Zählers wird vor
  die des neuen kopiert, und dessen Summe wird um den alten Endstand verschoben;
  die Rohwerte des neuen Zählers bleiben unverändert. Alternativ oder
  zusätzlich übernimmt der neue Zähler die ID des alten (der alte zieht auf eine
  freie `_alt`-ID um), sodass Automationen und Dashboards ohne Umschreiben
  weiterlaufen. Die Vorschau zeigt Umschaltpunkt, Lücken, Überlappungen und den
  Übergang der Summe. Vorhandene Werte werden nie überschrieben. Das Schreiben
  der Statistik ist experimentell und lässt sich nur mit dem Backup
  zurücksetzen; die ID-Übernahme lässt sich über das Journal zurückgeben.
- **Wartung**: Die neue Ansicht zeigt die **Recorder-Kosten** (welche Entities
  die Datenbank füllen, mit einem Vorschlag für einen Recorder-Ausschluss zum
  Kopieren; Housekeeper ändert die Recorder-Konfiguration nicht) und den
  **Update-Preflight** (Backup, Reparaturen, ausgefallene Integrationen,
  fehlende Referenzen, anstehende Updates). Speichert man vor einem Update den
  Ausgangszustand, zeigt Housekeeper danach, was neu ist.

### Behoben

- Geräte mit Kennungen oder Verbindungen aus mehr als zwei Teilen ließen den
  Scan mit „too many values to unpack“ scheitern.

---

### English

Meter change and a new maintenance view. The meter change writes to the
recorder's long-term statistics and renames entities; like every change it
happens only after explicit confirmation and with a Home Assistant backup that
has to succeed first. Tested automatically against Home Assistant 2026.2.3.

#### New

- **Meter change**: joins the history of a replaced meter with the new one. The
  old meter's hourly long-term statistics are copied in front of the new
  meter's, and the new total is shifted by the old final reading; the raw
  readings of the new meter stay as they are. Alternatively or additionally the
  new meter takes over the old one's ID (the old one moves to a free `_alt` ID),
  so automations and dashboards keep working without rewriting. The preview
  shows the switch point, gaps, overlaps and the transition of the total.
  Existing values are never overwritten. Writing the statistics is
  experimental and can only be reset with the backup; the ID takeover can be
  given back through the journal.
- **Maintenance**: the new view shows the **recorder costs** (which entities
  fill the database, with a suggested recorder exclusion to copy; Housekeeper
  does not change the recorder configuration) and the **update preflight**
  (backup, repairs, failed integrations, missing references, pending updates).
  If you save the starting state before an update, Housekeeper shows what is
  new afterwards.

#### Fixed

- Devices with identifiers or connections of more than two parts made the scan
  fail with “too many values to unpack”.

## 0.6.0 - 2026-10-07

Bereinigung in drei Schritten (Deaktivieren, Entfernen, Geräte und Verweise),
ein einstellbarer Scan-Verlauf und deutlich mehr Angaben auf den Detailseiten.
**Housekeeper kann jetzt mehr ändern**, und zwar weiterhin nur nach
ausdrücklicher Bestätigung eines Plans und mit Sicherungen. Für alles, was sich
nicht einfach zurückschalten lässt, legt Housekeeper vorher ein
Home-Assistant-Backup an und startet nur, wenn es gelingt. Automatisiert gegen
Home Assistant 2026.2.3 getestet.

### Neu

- **Entities entfernen**: Erst nach mindestens 14 Tagen Quarantäne und mit
  Backup. Der Registry-Eintrag steht im Journal, sodass sich die Entity
  wiederherstellen lässt, solange ihre ID frei ist und die Integration noch
  existiert. Die **Quarantäne-Karte** zeigt, seit wann eine Entity deaktiviert
  ist und wann sie frühestens entfernt werden kann.
- **Geräte**: deaktivieren (Quarantäne), nach der Quarantäne **entfernen**
  (offizieller Weg, die Integration wird gefragt und kann ablehnen) oder, nur
  wenn die Integration kein Entfernen anbietet, **lokal vergessen**. Hubs und
  Geräte mit angeschlossenen Geräten sind gesperrt. Beim Entfernen verschwinden
  auch die Entities des Geräts; jedes Entfernen braucht eine
  Einzelbestätigung. Kommt ein vergessenes Gerät zurück, zeigt das die Karte
  **Wiederkehrende Geräte**.
- **Verweise ersetzen**: Eine alte Entity wird durch eine neue ersetzt, überall
  wo sie exakt eingetragen ist: Automationen, Skripte und Szenen (YAML-Dateien),
  Dashboards im Speichermodus und das Energie-Dashboard. Die Vorschau zeigt je
  Quelle die Änderungen; Templates, YAML-Dashboards und Dateien mit
  `!secret`/`!include` werden nur gemeldet. Jede Quelle wird vorab gesichert und
  lässt sich zurücksetzen, solange sie unverändert ist. Historie und
  Statistiken werden nicht verschoben.
- **Scan-Verlauf**: Die Aufbewahrung ist einstellbar (1 bis 365 Tage, Standard
  30). In „Änderungen“ zeigt eine Zeitleiste die gespeicherten Scans mit
  Zählern; ein Klick wählt den Vergleichspunkt.
- **Mehr Angaben auf den Detailseiten**: Entities und Geräte zeigen Integration,
  Gerät, Bereich, Labels, Hersteller, Modell, Firmware, Kennungen und Zeiten in
  Karten. Integrationen zeigen Herkunft (eingebaut oder benutzerdefiniert mit
  Pfad), Einrichtungsweg, Fehlermeldung und Zähler.

### Geändert

- **Ignorierte Entdeckungen** gelten nicht mehr als Integrationsproblem und
  werden als „kein Fehler“ erklärt.
- Der Quelltext des Panels liegt in `panel-src/`; die ausgelieferte Datei wird
  daraus gebaut (nur für Entwickler relevant).

---

### English

Cleanup in three steps (disable, remove, devices and references), an
adjustable scan history and much more information on the detail pages.
**Housekeeper can now change more**, still only after you explicitly confirm a
plan and with safeguards. For anything that cannot simply be switched back,
Housekeeper creates a Home Assistant backup first and only continues if it
succeeds. Tested automatically against Home Assistant 2026.2.3.

#### New

- **Remove entities**: only after at least 14 days of quarantine and with a
  backup. The registry entry is kept in the journal so that the entity can be
  restored while its ID is free and the integration still exists. The
  **quarantine card** shows since when an entity has been disabled and when it
  can be removed at the earliest.
- **Devices**: disable (quarantine), **remove** after quarantine (official path,
  the integration is asked and may refuse) or, only if the integration offers
  no removal, **forget locally**. Hubs and devices with attached devices are
  blocked. Removing a device also removes its entities; every removal needs an
  individual confirmation. If a forgotten device comes back, the **Returning
  devices** card says so.
- **Replace references**: an old entity is replaced by a new one wherever it is
  entered exactly: automations, scripts and scenes (YAML files), storage-mode
  dashboards and the Energy dashboard. The preview lists the changes per
  source; templates, YAML dashboards and files using `!secret`/`!include` are
  only reported. Each source is saved beforehand and can be put back while it
  is unchanged. History and statistics are not moved.
- **Scan history**: retention is adjustable (1 to 365 days, default 30). In
  “Changes” a timeline lists the stored scans with counts; a click picks the
  comparison point.
- **More information on the detail pages**: entities and devices show
  integration, device, area, labels, manufacturer, model, firmware, identifiers
  and times in cards. Integrations show origin (built-in or custom with path),
  how they were set up, the error message and counts.

#### Changed

- **Ignored discoveries** no longer count as an integration problem and are
  explained as “not an error”.
- The panel source lives in `panel-src/`; the shipped file is built from it
  (relevant for developers only).

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
