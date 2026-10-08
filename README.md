<p align="center">
  <img src="https://raw.githubusercontent.com/bertel2020/HA-Housekeeping/main/custom_components/ha_housekeeper/brand/logo.png" alt="HA Housekeeper" width="160">
</p>

<h1 align="center">HA Housekeeper</h1>

<p align="center">
  Wartung und Analyse für Home Assistant: Inventar, Diagnose und Abhängigkeiten auf einen Blick.
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

<p align="center"><em><a href="README.en.md">English version</a></em></p>

HA Housekeeper ist eine Wartungs- und Analyseintegration für Home Assistant. Sie erstellt ein übersichtliches Inventar der Installation, erklärt verdächtige oder verwaiste Objekte und zeigt, wie Entitäten, Geräte, Integrationen, Bereiche und Automationen voneinander abhängen.

Das Ziel ist keine aggressive automatische Bereinigung. Housekeeper hilft zunächst zu verstehen, welche Objekte existieren, weshalb etwas als problematisch gilt und welche anderen Bestandteile von einer späteren Änderung betroffen wären.

> Housekeeper liest und analysiert zunächst nur. Änderungen gibt es ausschließlich nach ausdrücklicher Bestätigung eines Plans: Entitäten deaktivieren (Quarantäne) und, nach mindestens 14 Tagen Quarantäne und einem erfolgreichen Backup, entfernen. Dasselbe gilt für Geräte (deaktivieren, nach der Quarantäne entfernen oder lokal vergessen). Zusätzlich kann Housekeeper Verweise auf eine alte Entität durch eine neue ersetzen. Vieles davon lässt sich rückgängig machen, solange die Konfiguration unverändert ist. Integrationen und Hubs werden nie verändert, und Housekeeper ändert nur, was ein bestätigter Plan nennt. Gespeichert werden außerdem nur eigene Daten (Beobachtungszeitpunkte, Scanverlauf, ausgeblendete Befunde, Journal).

## Was Housekeeper übernimmt

| Aufgabe | Verhalten |
| --- | --- |
| **Inventar** | Entitäten, Geräte, Integrationen, Bereiche, Etagen, Labels und Automationen mit Suche, Filter und Sortierung |
| **Diagnose** | Unterscheidet aktiv, nicht verfügbar, unbekannt, deaktiviert und verwaist — jeweils mit Begründung |
| **Beobachtungszeitpunkt** | Speichert, seit wann Housekeeper eine Klassifikation beobachtet |
| **Automationsanalyse** | Trigger, Bedingungen, Aktionen, Blueprints und fehlende Referenzen; ebenso für Skripte, Szenen, Dashboards, Gruppen und Helfer |
| **Scanvergleich** | Neue und behobene Befunde, Statuswechsel, neue und entfernte Objekte seit dem letzten Scan |
| **Aufräumhinweise** | Mögliche Duplikate, ungenutzte Automationen, schwache Batterien |
| **Sensoren und Hinweise** | Zähler als Sensoren, zusammengefasste Reparaturhinweise, Export als CSV/JSON |
| **Abhängigkeiten** | Beziehungen zwischen Integration, Gerät, Entität, Bereich und Automation mit Vertrauensstufe |
| **Sicherheit** | Nur für Administratoren; liest und analysiert, ändert nur nach ausdrücklicher Bestätigung (Quarantäne, danach Entfernen mit Backup; Geräte; Verweise ersetzen; Zählerwechsel) |

## Warum HA Housekeeper?

In gewachsenen Home-Assistant-Installationen sammeln sich häufig Registry-Einträge, nicht verfügbare Entitäten, ausgetauschte Geräte, alte Statistiken und schwer nachvollziehbare Automationsreferenzen an. Ein fehlender Zustand allein erklärt nicht, ob eine Entität absichtlich deaktiviert wurde, ihre Integration deaktiviert ist oder das zugrunde liegende Gerät nicht mehr existiert.

Housekeeper verbindet Registry-Daten mit der laufenden Home-Assistant-Instanz und stellt diesen Zusammenhang in einem gemeinsamen, nur für Administratoren erreichbaren Panel dar.

## Installation

### Über HACS (empfohlen)

[![HACS-Repository in My Home Assistant öffnen](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=bertel2020&repository=HA-Housekeeping&category=integration)
[![HA Housekeeper zu My Home Assistant hinzufügen](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=ha_housekeeper)

1. Über den ersten Button das Housekeeper-Repository in HACS öffnen.
2. **HA Housekeeper** herunterladen und Home Assistant neu starten.
3. Über den zweiten Button die Integration hinzufügen. Alternativ in Home
   Assistant **Einstellungen → Geräte & Dienste → Integration hinzufügen →
   HA Housekeeper** öffnen.
4. Anschließend als Administrator **Housekeeper** in der Seitenleiste öffnen.

Falls der erste Button nicht funktioniert, in HACS unter **Integrationen →
Benutzerdefinierte Repositories** `https://github.com/bertel2020/HA-Housekeeping`
als Kategorie **Integration** eintragen.

### Manuell

Das Verzeichnis `custom_components/ha_housekeeper` nach
`/config/custom_components/ha_housekeeper` kopieren und Home Assistant neu
starten. Danach die Integration wie oben beschrieben hinzufügen.

Das Ergebnis sollte so aussehen:

```text
config/
└── custom_components/
    └── ha_housekeeper/
        ├── __init__.py
        ├── manifest.json
        └── ...
```

## Funktionen

### Installationsübersicht

- Inventar für Entitäten, Geräte, Integrationen beziehungsweise Config Entries, Bereiche, Etagen, Labels und Automationen
- Suche nach Name, Objekt-ID, Unique ID, Plattform oder Integration
- Filter nach Objekttyp und Zustand
- sortierbares und paginiertes Inventar für größere Installationen
- Übersicht der Objektanzahl und aktuellen Befunde

### Entitäts- und Gerätediagnose

Housekeeper unterscheidet zwischen:

- einer aktiven Entität mit aktuellem Zustand
- einer Entität mit dem Zustand `unknown`
- einer Entität mit dem Zustand `unavailable`
- einer absichtlich deaktivierten Entität
- einer Entität an einem deaktivierten Gerät
- einer Entität aus einer deaktivierten Integration
- einer Entität, deren Gerät nicht mehr in der Geräte-Registry existiert
- einer Entität, deren Config Entry nicht mehr existiert
- einer registrierten Entität, für die kein Zustand mehr vorhanden ist

Für jede durchgehend beobachtete Klassifikation speichert Housekeeper, wann sie erstmals erkannt wurde. Dieser Zeitpunkt wird ausdrücklich als **erster Housekeeper-Nachweis** bezeichnet – nicht als vermeintliches Lösch- oder Ausfalldatum.

### Automationsanalyse

- Auflistung der geladenen Automationen und ihres aktuellen Zustands
- Anzeige von Modus, Parallelitätsgrenzen, letzter Auslösung und Blueprint-Herkunft
- Darstellung von Triggern, Bedingungen und Aktionen in der Detailansicht
- Ermittlung von Entitäts-, Geräte-, Bereichs-, Etagen- und Labelreferenzen
- Einbeziehung der von Home Assistant zur Laufzeit erkannten Referenzen, darunter viele Templatereferenzen
- Erkennung von Referenzen, deren Ziel nicht mehr existiert
- genaue Fundstelle für explizite Referenzen, soweit verfügbar
- Skripte, Szenen und Dashboards werden ebenso auf Referenzen und fehlende Ziele geprüft; die Detailseite zeigt unter **Auswirkung einer Entfernung**, was eine Entfernung betreffen würde (nur Analyse, ohne Änderung)

### Änderungen seit dem letzten Scan

Die Ansicht **Änderungen** vergleicht den aktuellen Stand mit dem Scan davor oder mit dem letzten Scan jedes früheren Tages (standardmäßig 30 Tage aufbewahrt, unter Einstellungen von 1 bis 365 einstellbar, mit Zeitleiste der gespeicherten Scans): Statuswechsel (verschlechtert zuerst), neue und behobene Befunde sowie neue und entfernte Objekte. Der Verlauf wird kompakt in Home Assistant gespeichert und enthält nur Status und IDs.

### Weitere Ansichten und Quellen

- **Befunde ausblenden**: Ein Befund lässt sich auf der Detailseite ausblenden (nur in Housekeepers eigener Liste, Home Assistant bleibt unverändert). Alternativ blendet das Label `housekeeper_ignore` an einer Entität alle ihre Befunde aus. Ausgeblendete Befunde zählen nicht in Übersicht, Sensoren und Reparaturhinweisen und lassen sich über **Ausgeblendete anzeigen** wieder einblenden.
- **Sensoren**: Housekeeper legt ein Dienstgerät mit Zählern an (Befunde, verwaiste und nicht verfügbare Entitäten, defekte Referenzen, mögliche Duplikate, ungenutzte Automationen, schwache Batterien, letzter Scan), nutzbar in Dashboards und Automationen.
- **Batterien**: Eigene Ansicht mit allen Batterie-Entitäten, niedrigste Werte zuerst (niedrig ab 20 %, einstellbar).
- **Nicht verwendet**: Eigene Ansicht mit aktiven Entitäten, die in keiner Automation, keinem Skript, keiner Szene, Gruppe, keinem Helfer und keinem lesbaren Dashboard vorkommen (ohne Diagnose- und Konfigurations-Entitäten). Entitäten und verwaiste Statistiken stehen in Tabellen, die sich filtern und nach Spalten sortieren lassen (Entitäten: Gerät, Bereich, Integration, letzte Änderung, letzte Meldung, beobachtet seit; Statistiken: Art, Einheit, letzter Eintrag, Energie-Dashboard); auf dem Handy erscheinen sie als Karten. Rein ein Hinweis und kein Befund: Sprachassistenten, Apps, automatisch erzeugte Dashboards oder externe Systeme sieht Housekeeper nicht.
- **Übersicht**: Unter den Kennzahlen steht der **Inventarstatus** in drei Gruppen (Unauffällig, Prüfen, Problematisch) mit Anzahl und Anteil, darunter die Befunde. Rechts folgen Trend, die Karte **Datenbank** (Größe, WAL-Datei, Aufbewahrungszeit aus der Recorder-Einstellung von Home Assistant, Wachstum pro Tag; nur zwei Dateigrößen, keine Abfrage der Tabellen), Aufräumen und die Objekte nach Typ. In den Eckdaten einer Entität stehen letzter Zustandswechsel, letzte Meldung und, bei Langzeitstatistik, der letzte Statistik-Eintrag.
- **Richtlinien (Pflegen)**: Eigene Regeln für Ordnung, einzeln einschaltbar und zunächst alle aus: Entität ohne Bereich (nur Entitäten physischer Geräte, ohne Diagnose-, Konfigurations- und deaktivierte Entitäten und ohne Dienst-Geräte), Gerät ohne Bereich, Automation ohne Beschreibung, Batterie-Entität ohne Gerät, doppelter Anzeigename (je Domain), Automation ohne Label (nur Automationen mit Registry-Eintrag) und Namensschema (ein Präfix je Domain, bis zu 10, zum Beispiel `wz_` für `sensor`). Verstöße sind Hinweise und zählen nicht in Gesundheit, Befunde, Reparaturhinweise oder Sensoren. Mit dem Label `housekeeper_ignore` oder über **Ausblenden** nimmst du ein Objekt aus; die Schalter liegen nur in Housekeeper.
- **Integrationen mit Problemen** erscheinen auf der Übersicht, daneben die Karte **Aufräumen** mit Schnellzugriff auf Batterien, Duplikate, ungenutzte Automationen und nicht verwendete Entitäten.
- **Einstellungen** (Zahnrad rechts im Menü oben) mit Kopfband (Version, Home Assistant, Objekte, „Info kopieren“) und vier Reitern. **Darstellung**: Farbschema und Modus als Kacheln, Schriftgröße (klein/normal/groß), Modus (automatisch/hell/dunkel), Farbschema (Standard, Housekeeper, Modern), Dichte (normal/kompakt), Animationen (wie System/reduziert), Startansicht und Einträge pro Seite; sie wird im Home-Assistant-Benutzerprofil gespeichert (zusätzlich im Browser). **Scan und Schwellen**: Scanintervall und Schwellenwerte als Karten mit Einheit und Standardwert; gespeichert wird erst nach einer Änderung, Housekeeper lädt danach neu. **Ausgeblendet**: ausgeblendete Befunde wieder einblenden. **Info**: welche Daten Housekeeper selbst speichert und wie lange, dazu Links.
- **Bereinigung**: Die Ansicht **Aufräumen** prüft ausgewählte verwaiste oder lange nicht verfügbare Entitäten in einem Dry Run: ohne bekannte Verwendung, zu prüfen oder blockiert (sichere Verwendung, funktionierende Entität), samt Verweisen und Hinweis auf Langzeitstatistiken. Housekeeper ändert dabei nichts. Ein Plan lässt sich ausdrücklich bestätigen (Wort eintippen) und ausführen; ausführbar sind das **Deaktivieren** als Quarantäne (Registry-Eintrag, Historie und Statistiken bleiben unverändert) sowie, nach den unten genannten Bedingungen, das **Entfernen**, die Gerätebereinigung, das Ersetzen von Verweisen und der Zählerwechsel. Blockierte Einträge laufen nie, „zu prüfen“ nur mit Einzelbestätigung. Vor jedem Schritt wird neu geprüft; hat sich eine Entität seit der Vorschau geändert, bricht der Lauf ab. Danach prüft Housekeeper das Ergebnis. Die meisten Schritte lassen sich im Journal rückgängig machen, solange die Entität unverändert ist; die Langzeitstatistik eines Zählerwechsels lässt sich nur mit dem Backup zurücksetzen. Quarantäne-Hinweis: Eine Karte zeigt, seit wann eine Entität in Quarantäne ist und ab wann ein späteres Entfernen frühestens vorgesehen wäre (14 Tage). Jeder Plan steht im Journal (Pläne, die ausgeführt wurden, bleiben als Protokoll erhalten). **Entfernen** (Registry-Eintrag löschen) ist nur für Entitäten möglich, die mindestens 14 Tage in Quarantäne waren: Housekeeper legt vorher ein Home-Assistant-Backup mit deinen Backup-Einstellungen an, wartet auf dessen erfolgreichen Abschluss und startet sonst nichts. Der Registry-Eintrag steht im Journal, sodass sich eine entfernte Entität wiederherstellen lässt, solange ihre ID frei ist und die Integration noch existiert; sie ist danach wieder in Quarantäne.
  **Geräte** folgen denselben Regeln: *Deaktivieren* (Quarantäne) ist nur möglich, wenn keine Entität des Geräts mehr funktioniert, nichts am Gerät hängt (Hubs und Koordinatoren sind gesperrt) und nichts es sicher verwendet. Untergeräte (Child Devices) zeigt Housekeeper an, bereinigt sie aber nie; ein Gerät mit Untergeräten zählt wie ein Hub. *Entfernen* nutzt den offiziellen Weg von Home Assistant (die Integration wird gefragt und kann ablehnen) und ist erst nach 14 Tagen Quarantäne und mit Backup möglich. *Lokal vergessen* ist nur für Integrationen gedacht, die kein reguläres Entfernen anbieten: Housekeeper entfernt den Registry-Eintrag und lädt die Integration neu; das Quellsystem (Gerät, Hub, Cloud) bleibt unverändert, und taucht das Gerät wieder auf, zeigt eine Karte **Wiederkehrende Geräte** das an. Beim Entfernen verschwinden auch die Entitäten des Geräts; Wiederherstellen legt den Registry-Eintrag aus dem Journal neu an, ob die Integration die Entitäten wieder bereitstellt, entscheidet sie selbst. Deshalb braucht jedes Entfernen eine Einzelbestätigung.
  **Verweise ersetzen** tauscht eine alte Entität gegen eine neue überall dort, wo sie exakt eingetragen ist: Automationen, Skripte und Szenen (YAML-Dateien), Dashboards im Speichermodus und das Energie-Dashboard. Die Vorschau zeigt je Quelle die Änderungen. Templates, YAML-Dashboards, Helfer und Dateien mit `!secret`/`!include` ändert Housekeeper nicht, sondern listet sie zur Handarbeit. Jede Quelle wird vorab im Journal gesichert (Kommentare in YAML-Dateien gehen beim Schreiben verloren, wie beim Home-Assistant-Editor; beim Rückgängigmachen wird die ursprüngliche Datei bytegenau zurückgeschrieben, solange sie unverändert ist, sonst nur der geänderte Eintrag), ein Backup ist Pflicht, und das Zurücksetzen klappt, solange die Quelle noch genau so ist, wie Housekeeper sie hinterlassen hat. Historie und Statistiken werden dabei nicht verschoben oder zusammengeführt (dafür gibt es den Zählerwechsel).
  **Zählerwechsel** führt die Historie eines ersetzten Zählers mit dem neuen zusammen. Housekeeper prüft zuerst, ob beide Statistiken zusammenpassen (gleiche Einheit und Art), und zeigt vorab Umschaltpunkt, Lücken, Überlappungen und den Übergang der Summe. Zur Wahl stehen drei Wege: die Langzeitstatistik des alten Zählers vor die des neuen kopieren und dessen Summe um den alten Endstand verschieben (die Rohwerte des neuen Zählers bleiben unverändert), den neuen Zähler die ID des alten übernehmen lassen (der alte zieht auf eine freie `_alt`-ID um; Home Assistant verschiebt Historie und Statistik mit der ID, Automationen und Dashboards laufen ohne Umschreiben weiter) oder beides. Vorhandene Werte werden nie überschrieben: überlappende Werte des alten Zählers werden nicht kopiert. Das Schreiben der Statistik ist experimentell, braucht das Backup und lässt sich nur damit zurücksetzen; die ID-Übernahme lässt sich über das Journal zurückgeben. Nur die stündliche Langzeitstatistik wird zusammengeführt, nicht die Rohzustände und nicht die Kurzzeitstatistik der letzten Tage. Danach kann der alte Zähler in Quarantäne.
- **Wartung**: Die Ansicht **Wartung** beginnt mit dem **Backup-Schutz**: Housekeeper beurteilt, ob die Backup-Strategie belastbar ist (Alter des letzten Backups gegen den Zeitplan, fehlgeschlagene Läufe und Ziele, lokale und externe Ablage, ungewöhnliche Größe, Aufbewahrung, Verschlüsselung, Backup vor Bereinigungen). Emergency Kit und Restore-Test kann Home Assistant nicht erkennen; du bestätigst sie mit Datum, Housekeeper erinnert nach 180 Tagen an den Restore-Test. Housekeeper liest nur, löst keine Backups aus und stellt nie selbst wieder her. Darunter steht der **Update-Preflight**: Backup-Alter, offene Reparaturen, ausgefallene Integrationen, fehlende Referenzen und anstehende Updates. Speichert man vor einem Update den Ausgangszustand, zeigt Housekeeper nach dem Update (Versionswechsel) neue Reparaturen, neu ausgefallene Integrationen, neue fehlende Referenzen sowie neue und entfernte Objekte. Beides liest nur; gespeichert wird allein der Ausgangszustand.
- **Zuverlässigkeit**: Die Ansicht **Zuverlässigkeit** (Menü Betrieb) zeigt je Konfigurationseintrag, wie verfügbar seine Entitäten in den letzten 24 Stunden oder 7 Tagen waren, wann mindestens 80 % von ihnen (mindestens drei, mindestens 5 Minuten) gleichzeitig ausfielen und ob das eher nach Cloud oder nach Gerät und Netz aussieht (als Vermutung benannt). Dauerhaft ausgefallene Entitäten werden getrennt gezählt. Housekeeper liest dafür nur den Recorder, im Hintergrund, und merkt sich das letzte Ergebnis (auch nach einem Neustart, ebenso für Last und Datenbank in der Ansicht Recorder): Die Ansicht öffnet sofort mit dem letzten Stand („Stand: vor …“) und rechnet im Hintergrund neu; für einmal geöffnete Zeiträume rechnet Housekeeper alle 30 Minuten vor. Jede Zeile öffnet die Integration; deren Detailseite hat einen Reiter **Zuverlässigkeit** mit den Entitäten, die ausgefallen waren. Darunter listet **Instabile Entitäten** die Entitäten, die immer wieder ausfallen und zurückkommen (instabil ab 3 Ausfällen und 0,5 pro Tag, flatternd ab 1,5 pro Tag), mit Dauer, Tageszeit-Muster und der Zahl der Automationen, die daran hängen. Ausfälle während eines gemeinsamen Ausfalls der Integration zählen für die Integration. Auf der Detailseite einer Entität stehen „flatternd“ oder „instabil“ mit denselben Zahlen in der Diagnose und in den Eckdaten (aus dem zuletzt berechneten Ergebnis; die Detailseite startet nie die Recorder-Abfrage).
- **Last**: Die Ansicht **Recorder** (Menü Betrieb) beginnt mit der **Last**; sie zeigt, welche Entitäten, Integrationen und Ereignisse den Recorder am meisten beschreiben: Zeilen pro Tag und Entität, die lauteste Stunde, „Updates ohne neuen Zustand“ (der Wert blieb gleich, nur Attribute änderten sich; wirklich identische Updates schreibt Home Assistant nicht), die mittlere Attributgröße der letzten 24 Stunden, den geschätzten Lastanteil jeder Integration (eine Hochrechnung in Prozent, keine Messung in Byte) und die häufigsten Ereignistypen. Auffälliges steht mit Zahlen und den Objekten, die daran hängen (Automationen, Template-Sensoren), obenan. Housekeeper liest dafür nur den Recorder, im Hintergrund, merkt sich wie bei der Zuverlässigkeit das letzte Ergebnis (die Ansicht öffnet sofort mit „Stand: vor …“ und rechnet im Hintergrund neu) und ändert keine Recorder-Einstellung; Empfehlungen sind Text. Läuft gerade eine andere Recorder-Abfrage, fragt das Panel selbst erneut an.
- **Recorder-Kosten**: In der Ansicht **Recorder** (Menü Betrieb) stehen unter der Last die **Recorder-Kosten**: welche Entitäten die Datenbank füllen, mit Anteil, Schreibhäufigkeit, Verwendung und einem Vorschlag für einen Recorder-Ausschluss zum Kopieren in die `configuration.yaml`; Housekeeper ändert die Recorder-Konfiguration nicht.
- **Datenbank**: Die Karte **Datenbank** in der Ansicht Recorder prüft den Recorder nur lesend: Größe von Datenbank und WAL-Datei (nur SQLite; die Tagesgröße wird als Zahl notiert und ergibt das Wachstum), doppelte Statistikzeitpunkte, Stunden, die in den Statistiken fehlen, Statistiken, die nicht zur Entität passen (Einheit, State-Class), und Zeiträume von mindestens 10 Minuten ohne einen einzigen Eintrag, getrennt nach Neustart (laut Protokoll von Housekeeper) und Recorder-Lücke. Jeder Befund nennt Zahlen und eine Empfehlung als Text; Housekeeper repariert und löscht nichts. Die Berechnung startet erst beim Öffnen der Wartung; Probleme erscheinen danach auch in den Aufgaben der Übersicht.
- **Freigaben**: Der Eintrag **Freigaben** unter Pflegen zeigt, welche Entitäten Assist, Alexa, Google Assistant und HomeKit erreichen können, und nennt Auffälligkeiten: Diagnose-Entitäten, sensible Entitäten (Schlösser, Alarmanlagen, Personen, Tracker, Garagentore; nur als Hinweis), Freigaben für deaktivierte oder verwaiste Entitäten, doppelte Sprachnamen und Webhooks von Integrationen, die es nicht mehr gibt. Housekeeper liest nur Metadaten: Passwörter, Tokens, Ports und Webhook-IDs werden weder gelesen noch angezeigt, nichts wird gespeichert oder geändert. Antwortet eine Quelle nicht, steht „nicht prüfbar“.
- **Aufbau der langen Ansichten**: Zuverlässigkeit, Recorder, Automationen, Richtlinien und Freigaben beginnen mit einer Zeile Kennzahlen (Ampelfarbe, ein Klick springt zum Abschnitt) und gliedern sich in Reiter mit Zähler und Markierung bei Auffälligem; der gewählte Reiter steht in der Adresse (`?tab=`). In den Freigaben zeigt jede Kachel (Assist, Alexa, Google Assistant, HomeKit) per Klick die erreichbaren Entitäten; bei den Richtlinien sind Regeln (Schalter) und Verstöße getrennt.
- **Suche in Listen**: Lange Listen haben ein Suchfeld, auch Automationen (Läufe), Zuverlässigkeit (Integrationen, instabile Entitäten), Recorder (lauteste Entitäten, Befunde, Integrationen), Richtlinien und Freigaben; es erscheint ab sechs Einträgen.
- **Suche und Ansichten**: Das Suchfeld im Menü oben findet Entitäten, Geräte, Integrationen, Automationen und Skripte nach Name, ID, Plattform, Hersteller und Modell; Pfeiltasten und Enter öffnen den Treffer. In den Listen lassen sich Suche, Filter und Sortierung als benannte **Ansicht** speichern (nur in diesem Browser). Die Zuverlässigkeit kann den Zeitraum mit dem davor vergleichen (Prozentpunkte je Integration).
- **Automationen** (Menü Betrieb): zählt alle 15 Minuten die Läufe, die Home Assistant je Automation und Skript kurz vorhält (standardmäßig 5), und merkt sich 60 Tage lang nur Zähler je Tag und die Stelle eines Fehlers, keine Variablen, Daten oder Fehlertexte. Die Ansicht nennt Auffälliges mit den Zahlen dahinter: viele Fehler, abgewiesene Läufe wegen „Already running“ oder `max`, nie erfolgreich, fast immer an einer Bedingung beendet, ungewöhnlich oft oder lange, Fehlerquote nach einem Update (als zeitlicher Zusammenhang) sowie Wartezeiten ab 5 Minuten, Warten ohne Timeout und `continue_on_error`. Ein fehlerfreier Lauf heißt nicht, dass die Automation ihren Zweck erfüllt. Die Liste lässt sich durchsuchen, nach Typ und „mit Fehlern“ filtern und nach Spalten sortieren. Auf der Detailseite einer Automation oder eines Skripts zeigen die Eckdaten Läufe, Fehler, Bedingung, Dauer und die 7-Tage-Balken, der Tab **Läufe** die Einzelheiten. Dazu führt Housekeeper ein kleines Protokoll der Versionswechsel von Home Assistant und benutzerdefinierten Integrationen sowie der Neustarts.
- **Recorder und Energie-Dashboard** zählen in der Auswirkungsanalyse mit: Entitäten des Energie-Dashboards gelten als verwendet, und Entitäten mit Langzeitstatistiken sind markiert. In der Ansicht **Nicht verwendet** sind beide Reiter sortier- und filterbare Tabellen (Klick auf eine Spaltenüberschrift sortiert; auf dem Handy werden die Zeilen zu Karten): Die Entitäten nennen Domain, Gerät, Bereich, Integration, letzte Änderung, letzte Meldung, seit wann sie beobachtet werden und ob es Langzeitstatistik gibt. Der Reiter **Verwaiste Statistiken** listet Langzeitstatistiken, zu denen es keine Entität mehr gibt (nur ein Hinweis, Housekeeper löscht nichts; Statistiken im Energie-Dashboard sind gekennzeichnet). Jede Zeile nennt den **letzten Eintrag** der Statistik, und die Liste lässt sich danach sortieren (neueste oder älteste zuerst); so erkennst du kürzlich verwaiste von längst toten Statistiken. Der Eintrag wird erst beim Öffnen des Reiters gelesen, nicht beim Scan.
- **Veralteter Scan**: Ist der letzte Scan deutlich älter als das Scanintervall, weist die Übersicht darauf hin. **Änderungen** und viele Integrationsprobleme lassen sich durchsuchen und filtern.
- **Lange Listen** sind seitenweise aufgeteilt (Standard 20 pro Seite, wählbar 20/50/100) und lassen sich durchsuchen, filtern und sortieren (Befunde, Batterien, Nicht verwendet, Inventar). Der Export enthält genau die angezeigten Befunde.
- **Weitere Referenzquellen**: Gruppen (Mitglieder) und Helfer wie Template, Ableitung oder Min/Max-Sensor (Quell-Entitäten) werden in Abhängigkeiten und Auswirkungsanalyse berücksichtigt; fehlende Mitglieder und Quellen werden als Befund gemeldet.
- **Deep-Links**: Das Panel unterstützt Adressen wie `/ha-housekeeper?view=findingsNav&filter=orphaned` oder `?object=entity:sensor.x`; die Reparaturhinweise nutzen sie.

### Abhängigkeitsansicht

Die Abhängigkeitsansicht stellt direkte Beziehungen dar, zum Beispiel:

```text
Integration → besitzt → Gerät → stellt bereit → Entität
Etage → enthält → Bereich → enthält → Gerät
Automation → reagiert auf / prüft / steuert → Entität oder Gerät
```

Jede Beziehung besitzt eine Vertrauensstufe. Explizite Registry- und Konfigurationsbeziehungen gelten als sicher; von Home Assistant zur Laufzeit ermittelte Referenzen werden gesondert gekennzeichnet.

### Befunde, Export und Reparaturhinweise

- Befundliste mit Begründung und Sicherheit der Diagnose; Export als **CSV** oder **JSON** (berücksichtigt den gewählten Filter)
- Schwellwert für nicht verfügbare Entitäten: Unter **Konfigurieren** lässt sich einstellen, nach wie vielen Tagen (Standard 7, `0` = sofort) eine nicht verfügbare Entität als Befund gilt. Kurze Ausfälle, etwa nach einem Neustart, bleiben so unberücksichtigt. Verwaiste Entitäten werden immer sofort gemeldet.
- **Mögliche Duplikate**: Eine nicht funktionierende Entität mit Zahlensuffix (`…_2`), zu der es eine funktionierende Entität derselben Integration mit gleicher Basis-ID gibt, wird als Überbleibsel markiert
- **Ungenutzte Automationen**: lange ausgeschaltet, seit langem nicht ausgelöst oder nie ausgelöst (mit Alter der Automation)
- Automatischer Scan alle 24 Stunden (einstellbar), damit Verlauf und Hinweise aktuell bleiben
- Hinweise unter **Einstellungen → Reparaturen**: höchstens drei zusammengefasste Einträge (verwaiste Entitäten, lange nicht verfügbare Entitäten, Automationen mit fehlenden Referenzen) mit Link ins Panel. Sie sind rein informativ und bieten keine Reparatur an.
- **Diagnosedaten** für Fehlerberichte (Integration → Diagnosedaten herunterladen) enthalten nur Zählwerte, keine Namen oder IDs.

### Sprachen

Panel und Einrichtungsdialog stehen auf Deutsch und Englisch zur Verfügung. Die in Home Assistant gewählte Sprache bestimmt die Sprache des Panels.

## Sicherheitsmodell

- Das Panel ist ausschließlich für Home-Assistant-Administratoren verfügbar.
- Alle Housekeeper-WebSocket-Endpunkte erfordern Administratorrechte.
- Housekeeper bietet Lese- und Scanoperationen an. Geschrieben wird in Housekeepers eigenen Speicher (Ausblenden von Befunden, Journal), in die Optionen der Integration (auf deinen Wunsch im Panel) und für bestätigte Pläne in die Entitäts- und Geräte-Registry (Deaktivieren, nach Quarantäne und Backup Entfernen) sowie in Automations-, Skript- und Szenen-Dateien, Dashboards im Speichermodus und die Energie-Einstellungen (Verweise ersetzen, mit Backup) sowie, nur beim Zählerwechsel mit Backup, in die Langzeitstatistik des Recorders und in Entitäts-IDs.
- `unavailable` wird niemals automatisch mit „verwaist“ gleichgesetzt.
- Deaktivierte Geräte und Integrationen werden von fehlenden Objekten unterschieden.
- `.storage`-Dateien werden nicht direkt bearbeitet.
- Es wird keine Bereinigung automatisch ausgeführt.

Bewusst nicht Teil von Housekeeper: vorhandene Statistikwerte überschreiben, Rohzustände des Recorders umschreiben und Helfer oder Gruppen als Ersetzungsquelle umschreiben.

## Verwendung

**Housekeeper** über die Home-Assistant-Seitenleiste öffnen. Die Übersicht beginnt mit „Was muss ich jetzt tun?“ und zeigt, was sich seit dem letzten Scan geändert hat, dazu Objektzahlen, Befunde und den Zeitpunkt des letzten Scans.

- Eine Kategoriekarte auswählen, um das entsprechend gefilterte Inventar zu öffnen.
- Ein Objekt auswählen: Oben stehen Zustand, Ursache, Gerät, Bereich und das Risiko beim Entfernen, darunter die Tabs Übersicht, Abhängigkeiten, Technische Daten und Attribute, bei Automationen und Skripten zusätzlich **Läufe**, bei Integrationen **Zuverlässigkeit**.
- Unter **Abhängigkeiten** ein Objekt auswählen, um eingehende und ausgehende Beziehungen zu untersuchen. Ein Umschalter wechselt zwischen Liste und Graph (Herkunft und Verwendung über bis zu drei Ebenen, mit „Was bricht beim Entfernen?“); auf kleinen Bildschirmen steht nur die Liste.
- Mit **Neu scannen** den Datenbestand nach Konfigurations- oder Geräteänderungen aktualisieren. Ohne Eingriff scannt Housekeeper automatisch alle 24 Stunden.
- Unter **Einstellungen → Geräte & Dienste → HA Housekeeper → Konfigurieren** lassen sich vier Werte einstellen: Tage bis eine nicht verfügbare Entität als Befund gilt (Standard 7), Tage bis eine Automation als ungenutzt gilt (Standard 90, `0` = aus) das Scanintervall in Stunden (Standard 24, `0` = aus) und die Schwelle für schwache Batterien in Prozent (Standard 20).
- Das Menü oben ist in Gruppen geordnet: Überblick (Übersicht, Befunde, Änderungen), Betrieb (Zuverlässigkeit, Automationen, Recorder), Erkunden (Inventar, Abhängigkeiten) und Pflegen (Aufräumen, Nicht verwendet, Batterien, Richtlinien, Freigaben, Wartung).
- **Zurück**: Detailseiten, der Graph und Sprünge über Links haben ein „Zurück zu …“. Der Graph geht Knoten für Knoten zurück und zuletzt zur Seite, von der er geöffnet wurde; Detailseiten öffnen den Tab, den man verlassen hat, Listen springen an die alte Stelle. Die Zurück-Taste des Browsers folgt diesen Schritten noch nicht.

Der erste Scan legt die anfänglichen Beobachtungszeitpunkte fest. Nachfolgende Scans behalten den Beginn einer unveränderten Klassifikation bei und setzen ihn zurück, sobald sich die Klassifikation ändert.

## Aktuelle Einschränkungen

- Housekeeper bereinigt nie automatisch: Jede Änderung braucht einen von dir bestätigten Plan. Vier Dinge sind zu unterscheiden:
  - *Bestätigte Bereinigung*: Deaktivieren, Entfernen, Geräte bereinigen, Verweise ersetzen und der Zählerwechsel laufen nur als bestätigter Plan, Entfernen und Zählerwechsel mit vorherigem Home-Assistant-Backup.
  - *Rückgängig im Journal*: Housekeeper stellt Registry-Einträge, Verweise und Entitäts-IDs wieder her, solange sie unverändert sind. Ob ein Gerät seine Entitäten zurückbekommt, entscheidet die Integration.
  - *Nicht rückgängig zu machen*: Die zusammengeführte Langzeitstatistik eines Zählerwechsels lässt sich nur mit dem Backup zurücksetzen.
  - *Vollständiger Backup-Restore*: Das erledigt ausschließlich Home Assistant selbst; Housekeeper stellt keine Backups wieder her.
- Housekeeper benötigt Home Assistant 2026.8 oder neuer, weil ein Gerät dort genau einem Config Entry gehört.
- Die Automationsanalyse umfasst die aktuell von Home Assistant geladenen Automationen. Bei ungültigen oder extern verwalteten Automationen können weniger Details verfügbar sein.
- Dynamische Templates lassen sich nicht immer eindeutig einem Ziel zuordnen. Solche Beziehungen werden ohne Laufzeitbeleg niemals als sicher dargestellt.
- Die Abhängigkeitsansicht konzentriert sich auf direkte Beziehungen. Der Recorder (Verlauf, Statistiken) und nicht lesbare oder automatisch erzeugte Dashboards fließen nicht in die Auswirkungsanalyse ein; sie ist ein Hinweis, keine Garantie.
- Mögliche Duplikate und ungenutzte Automationen beruhen auf Heuristiken und sind Hinweise, keine Gewissheit.

## Entwicklung und Validierung

Housekeeper wird mit Home Assistant 2026.8.3 (der Mindestversion) und mit der jeweils neuesten vom Testpaket unterstützten Version automatisiert getestet (lokal und im GitHub-Workflow, beide verpflichtend, mit Python 3.14) und in einer laufenden Instanz mit Home Assistant 2026.9.4 ausprobiert. Die Tests decken Folgendes ab:

- Manifest- und Paketverträge
- Parität der deutschen und englischen Backend-Übersetzungen
- Ermittlung von Automationsreferenzen und Erkennung fehlender Ziele
- Config Flow und vollständige Einrichtung des Config Entry
- Inventarisierung von Registry-Einträgen und Zuständen, Quellen (Skripte, Szenen, Dashboards, Gruppen, Helfer), Scanvergleich, Ausblenden von Befunden und Sensoren
- Richtlinien, Zuverlässigkeit, Recorder-Abfragen (Last, Datenbank) und der Speicher für das letzte Ergebnis, auch mit beschädigten Dateien
- Python-Linting und -Formatierung
- Panel-Logik (Ansichten, Filter, Export, Escaping) mit Node.js
- Python- und Frontend-Syntax

Das Panel liegt als Quelltext in `panel-src/` (mehrere kleine Dateien) und wird mit `node scripts/build_panel.mjs` zu der einen Datei `custom_components/ha_housekeeper/frontend/ha-housekeeper-panel.js` gebaut, die Home Assistant ausliefert. Tests und CI prüfen mit `--check`, dass sie aktuell ist; nach Änderungen an `panel-src/` also neu bauen.

Die von Home Assistant unabhängigen Tests lassen sich so ausführen:

```bash
python3 -m pytest -q
```

Der GitHub-Validierungsworkflow installiert zusätzlich Home Assistant und dessen Frontend, um die Laufzeit-Integrationstests sowie HACS- und Hassfest-Prüfungen auszuführen.

## Änderungsprotokoll

Die Versionshinweise auf Deutsch und Englisch stehen in [CHANGELOG.md](CHANGELOG.md).

## Lizenz

Dieses Projekt steht unter der [MIT-Lizenz](LICENSE).
Copyright 2026 Roberto / bertel2020.
