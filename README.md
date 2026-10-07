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

HA Housekeeper ist eine Wartungs- und Analyseintegration für Home Assistant. Sie erstellt ein übersichtliches Inventar der Installation, erklärt verdächtige oder verwaiste Objekte und zeigt, wie Entities, Geräte, Integrationen, Bereiche und Automationen voneinander abhängen.

Das Ziel ist keine aggressive automatische Bereinigung. Housekeeper hilft zunächst zu verstehen, welche Objekte existieren, weshalb etwas als problematisch gilt und welche anderen Bestandteile von einer späteren Änderung betroffen wären.

> Housekeeper liest und analysiert zunächst nur. Änderungen gibt es ausschließlich nach ausdrücklicher Bestätigung eines Plans: Entities deaktivieren (Quarantäne) und, nach mindestens 14 Tagen Quarantäne und einem erfolgreichen Backup, entfernen. Beides lässt sich rückgängig machen, solange die Entity unverändert ist. Geräte, Automationen, Dashboards und Integrationen werden nie verändert. Gespeichert werden außerdem nur eigene Daten (Beobachtungszeitpunkte, Scanverlauf, ausgeblendete Befunde, Journal).

## Was Housekeeper übernimmt

| Aufgabe | Verhalten |
| --- | --- |
| **Inventar** | Entities, Geräte, Integrationen, Bereiche, Etagen, Labels und Automationen mit Suche, Filter und Sortierung |
| **Diagnose** | Unterscheidet aktiv, nicht verfügbar, unbekannt, deaktiviert und verwaist — jeweils mit Begründung |
| **Beobachtungszeitpunkt** | Speichert, seit wann Housekeeper eine Klassifikation beobachtet |
| **Automationsanalyse** | Trigger, Bedingungen, Aktionen, Blueprints und fehlende Referenzen; ebenso für Skripte, Szenen, Dashboards, Gruppen und Helfer |
| **Scanvergleich** | Neue und behobene Befunde, Statuswechsel, neue und entfernte Objekte seit dem letzten Scan |
| **Aufräumhinweise** | Mögliche Duplikate, ungenutzte Automationen, schwache Batterien |
| **Sensoren und Hinweise** | Zähler als Sensoren, zusammengefasste Reparaturhinweise, Export als CSV/JSON |
| **Abhängigkeiten** | Beziehungen zwischen Integration, Gerät, Entity, Bereich und Automation mit Vertrauensstufe |
| **Sicherheit** | Nur für Administratoren; liest und analysiert, ändert nur nach ausdrücklicher Bestätigung (Quarantäne, danach Entfernen mit Backup) |

## Warum HA Housekeeper?

In gewachsenen Home-Assistant-Installationen sammeln sich häufig Registry-Einträge, nicht verfügbare Entities, ausgetauschte Geräte, alte Statistiken und schwer nachvollziehbare Automationsreferenzen an. Ein fehlender Zustand allein erklärt nicht, ob eine Entity absichtlich deaktiviert wurde, ihre Integration deaktiviert ist oder das zugrunde liegende Gerät nicht mehr existiert.

Housekeeper verbindet Registry-Daten mit der laufenden Home-Assistant-Instanz und stellt diesen Zusammenhang in einem gemeinsamen, nur für Administratoren erreichbaren Panel dar.

## Funktionen

### Installationsübersicht

- Inventar für Entities, Geräte, Integrationen beziehungsweise Config Entries, Bereiche, Etagen, Labels und Automationen
- Suche nach Name, Objekt-ID, Unique ID, Plattform oder Integration
- Filter nach Objekttyp und Zustand
- sortierbares und paginiertes Inventar für größere Installationen
- Übersicht der Objektanzahl und aktuellen Befunde

### Entity- und Gerätediagnose

Housekeeper unterscheidet zwischen:

- einer aktiven Entity mit aktuellem Zustand
- einer Entity mit dem Zustand `unknown`
- einer Entity mit dem Zustand `unavailable`
- einer absichtlich deaktivierten Entity
- einer Entity an einem deaktivierten Gerät
- einer Entity aus einer deaktivierten Integration
- einer Entity, deren Gerät nicht mehr in der Geräte-Registry existiert
- einer Entity, deren Config Entry nicht mehr existiert
- einer registrierten Entity, für die kein Zustand mehr vorhanden ist

Für jede durchgehend beobachtete Klassifikation speichert Housekeeper, wann sie erstmals erkannt wurde. Dieser Zeitpunkt wird ausdrücklich als **erster Housekeeper-Nachweis** bezeichnet – nicht als vermeintliches Lösch- oder Ausfalldatum.

### Automationsanalyse

- Auflistung der geladenen Automationen und ihres aktuellen Zustands
- Anzeige von Modus, Parallelitätsgrenzen, letzter Auslösung und Blueprint-Herkunft
- Darstellung von Triggern, Bedingungen und Aktionen in der Detailansicht
- Ermittlung von Entity-, Geräte-, Bereichs-, Etagen- und Labelreferenzen
- Einbeziehung der von Home Assistant zur Laufzeit erkannten Referenzen, darunter viele Templatereferenzen
- Erkennung von Referenzen, deren Ziel nicht mehr existiert
- genaue Fundstelle für explizite Referenzen, soweit verfügbar
- Skripte, Szenen und Dashboards werden ebenso auf Referenzen und fehlende Ziele geprüft; die Detailseite zeigt unter **Auswirkung einer Entfernung**, was eine Entfernung betreffen würde (nur Analyse, ohne Änderung)

### Änderungen seit dem letzten Scan

Die Ansicht **Änderungen** vergleicht den aktuellen Stand mit dem Scan davor oder mit dem letzten Scan der vergangenen sieben Tage: Statuswechsel (verschlechtert zuerst), neue und behobene Befunde sowie neue und entfernte Objekte. Der Verlauf wird kompakt in Home Assistant gespeichert und enthält nur Status und IDs.

### Weitere Ansichten und Quellen

- **Befunde ausblenden**: Ein Befund lässt sich auf der Detailseite ausblenden (nur in Housekeepers eigener Liste, Home Assistant bleibt unverändert). Alternativ blendet das Label `housekeeper_ignore` an einer Entity alle ihre Befunde aus. Ausgeblendete Befunde zählen nicht in Übersicht, Sensoren und Reparaturhinweisen und lassen sich über **Ausgeblendete anzeigen** wieder einblenden.
- **Sensoren**: Housekeeper legt ein Dienstgerät mit Zählern an (Befunde, verwaiste und nicht verfügbare Entities, defekte Referenzen, mögliche Duplikate, ungenutzte Automationen, schwache Batterien, letzter Scan), nutzbar in Dashboards und Automationen.
- **Batterien**: Eigene Ansicht mit allen Batterie-Entities, niedrigste Werte zuerst (niedrig ab 20 %, einstellbar).
- **Nicht verwendet**: Eigene Ansicht mit aktiven Entities, die in keiner Automation, keinem Skript, keiner Szene, Gruppe, keinem Helfer und keinem lesbaren Dashboard vorkommen (ohne Diagnose- und Konfigurations-Entities, filterbar nach Domäne). Rein ein Hinweis und kein Befund: Sprachassistenten, Apps, automatisch erzeugte Dashboards oder externe Systeme sieht Housekeeper nicht.
- **Integrationen mit Problemen** erscheinen auf der Übersicht, daneben die Karte **Aufräumen** mit Schnellzugriff auf Batterien, Duplikate, ungenutzte Automationen und nicht verwendete Entities.
- **Einstellungen** (Zahnrad unten in der Seitenleiste): Version und Eckdaten von Housekeeper, Schriftgröße (klein/normal/groß), Modus (automatisch/hell/dunkel), Farbschema (Standard, Housekeeper, Modern), Dichte (normal/kompakt), Animationen (wie System/reduziert), Startansicht, Einträge pro Seite und die Verwaltung ausgeblendeter Befunde. Die Darstellung wird im Home-Assistant-Benutzerprofil gespeichert (zusätzlich im Browser). Scanintervall und Schwellenwerte lassen sich hier ebenfalls ändern; Housekeeper lädt danach neu.
- **Bereinigung**: Die Ansicht **Aufräumen** prüft ausgewählte verwaiste oder lange nicht verfügbare Entities in einem Dry Run: ohne bekannte Verwendung, zu prüfen oder blockiert (sichere Verwendung, funktionierende Entity), samt Verweisen und Hinweis auf Langzeitstatistiken. Housekeeper ändert dabei nichts. Ein Plan lässt sich ausdrücklich bestätigen (Wort eintippen) und ausführen; ausführbar ist bisher nur das **Deaktivieren** als Quarantäne (Registry-Eintrag, Historie und Statistiken bleiben unverändert). Blockierte Einträge laufen nie, „zu prüfen“ nur mit Einzelbestätigung. Vor jedem Schritt wird neu geprüft; hat sich eine Entity seit der Vorschau geändert, bricht der Lauf ab. Danach prüft Housekeeper das Ergebnis, und jeder Schritt lässt sich rückgängig machen, solange die Entity unverändert ist. Quarantäne-Hinweis: Eine Karte zeigt, seit wann eine Entity in Quarantäne ist und ab wann ein späteres Entfernen frühestens vorgesehen wäre (14 Tage). Jeder Plan steht im Journal (Pläne, die ausgeführt wurden, bleiben als Protokoll erhalten). **Entfernen** (Registry-Eintrag löschen) ist nur für Entities möglich, die mindestens 14 Tage in Quarantäne waren: Housekeeper legt vorher ein Home-Assistant-Backup mit deinen Backup-Einstellungen an, wartet auf dessen erfolgreichen Abschluss und startet sonst nichts. Der Registry-Eintrag steht im Journal, sodass sich eine entfernte Entity wiederherstellen lässt, solange ihre ID frei ist und die Integration noch existiert; sie ist danach wieder in Quarantäne.
- **Recorder und Energie-Dashboard** zählen in der Auswirkungsanalyse mit: Entities des Energie-Dashboards gelten als verwendet, und Entities mit Langzeitstatistiken sind markiert. In der Ansicht **Nicht verwendet** listet der Reiter **Verwaiste Statistiken** Langzeitstatistiken, zu denen es keine Entity mehr gibt (nur ein Hinweis, Housekeeper löscht nichts; Statistiken im Energie-Dashboard sind gekennzeichnet).
- **Veralteter Scan**: Ist der letzte Scan deutlich älter als das Scanintervall, weist die Übersicht darauf hin. **Änderungen** und viele Integrationsprobleme lassen sich durchsuchen und filtern.
- **Lange Listen** sind seitenweise aufgeteilt (Standard 20 pro Seite, wählbar 20/50/100) und lassen sich durchsuchen, filtern und sortieren (Befunde, Batterien, Nicht verwendet, Inventar). Der Export enthält genau die angezeigten Befunde.
- **Weitere Referenzquellen**: Gruppen (Mitglieder) und Helfer wie Template, Ableitung oder Min/Max-Sensor (Quell-Entities) werden in Abhängigkeiten und Auswirkungsanalyse berücksichtigt; fehlende Mitglieder und Quellen werden als Befund gemeldet.
- **Deep-Links**: Das Panel unterstützt Adressen wie `/ha-housekeeper?view=findingsNav&filter=orphaned` oder `?object=entity:sensor.x`; die Reparaturhinweise nutzen sie.

### Abhängigkeitsansicht

Die Abhängigkeitsansicht stellt direkte Beziehungen dar, zum Beispiel:

```text
Integration → besitzt → Gerät → stellt bereit → Entity
Etage → enthält → Bereich → enthält → Gerät
Automation → reagiert auf / prüft / steuert → Entity oder Gerät
```

Jede Beziehung besitzt eine Vertrauensstufe. Explizite Registry- und Konfigurationsbeziehungen gelten als sicher; von Home Assistant zur Laufzeit ermittelte Referenzen werden gesondert gekennzeichnet.

### Befunde, Export und Reparaturhinweise

- Befundliste mit Begründung und Sicherheit der Diagnose; Export als **CSV** oder **JSON** (berücksichtigt den gewählten Filter)
- Schwellwert für nicht verfügbare Entities: Unter **Konfigurieren** lässt sich einstellen, nach wie vielen Tagen (Standard 7, `0` = sofort) eine nicht verfügbare Entity als Befund gilt. Kurze Ausfälle, etwa nach einem Neustart, bleiben so unberücksichtigt. Verwaiste Entities werden immer sofort gemeldet.
- **Mögliche Duplikate**: Eine nicht funktionierende Entity mit Zahlensuffix (`…_2`), zu der es eine funktionierende Entity derselben Integration mit gleicher Basis-ID gibt, wird als Überbleibsel markiert
- **Ungenutzte Automationen**: lange ausgeschaltet, seit langem nicht ausgelöst oder nie ausgelöst (mit Alter der Automation)
- Automatischer Scan alle 24 Stunden (einstellbar), damit Verlauf und Hinweise aktuell bleiben
- Hinweise unter **Einstellungen → Reparaturen**: höchstens drei zusammengefasste Einträge (verwaiste Entities, lange nicht verfügbare Entities, Automationen mit fehlenden Referenzen) mit Link ins Panel. Sie sind rein informativ und bieten keine Reparatur an.
- **Diagnosedaten** für Fehlerberichte (Integration → Diagnosedaten herunterladen) enthalten nur Zählwerte, keine Namen oder IDs.

### Sprachen

Panel und Einrichtungsdialog stehen auf Deutsch und Englisch zur Verfügung. Die in Home Assistant gewählte Sprache bestimmt die Sprache des Panels.

## Sicherheitsmodell

- Das Panel ist ausschließlich für Home-Assistant-Administratoren verfügbar.
- Alle Housekeeper-WebSocket-Endpunkte erfordern Administratorrechte.
- Housekeeper bietet Lese- und Scanoperationen an. Geschrieben wird in Housekeepers eigenen Speicher (Ausblenden von Befunden, Journal), in die Optionen der Integration (auf deinen Wunsch im Panel) und für bestätigte Pläne in die Entity-Registry (Deaktivieren, und nach Quarantäne und Backup Entfernen).
- `unavailable` wird niemals automatisch mit „verwaist“ gleichgesetzt.
- Deaktivierte Geräte und Integrationen werden von fehlenden Objekten unterschieden.
- `.storage`-Dateien werden nicht direkt bearbeitet.
- Es wird keine Bereinigung automatisch ausgeführt.

Die Bereinigung von Geräten und das Ersetzen von Entities sind bewusst späteren Versionen vorbehalten.

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

## Verwendung

**Housekeeper** über die Home-Assistant-Seitenleiste öffnen. Die Übersicht zeigt Objektzahlen, Befunde und den Zeitpunkt des letzten Scans.

- Eine Kategoriekarte auswählen, um das entsprechend gefilterte Inventar zu öffnen.
- Ein Objekt auswählen, um Registry-Informationen, Zustandsdaten, Diagnose und direkte Abhängigkeiten anzuzeigen.
- Unter **Abhängigkeiten** ein Objekt auswählen, um eingehende und ausgehende Beziehungen zu untersuchen.
- Mit **Neu scannen** den Datenbestand nach Konfigurations- oder Geräteänderungen aktualisieren. Ohne Eingriff scannt Housekeeper automatisch alle 24 Stunden.
- Unter **Einstellungen → Geräte & Dienste → HA Housekeeper → Konfigurieren** lassen sich vier Werte einstellen: Tage bis eine nicht verfügbare Entity als Befund gilt (Standard 7), Tage bis eine Automation als ungenutzt gilt (Standard 90, `0` = aus) das Scanintervall in Stunden (Standard 24, `0` = aus) und die Schwelle für schwache Batterien in Prozent (Standard 20).
- Die Ansichten **Befunde**, **Änderungen**, **Batterien** und **Nicht verwendet** erreichst du über die Navigation im Panel.

Der erste Scan legt die anfänglichen Beobachtungszeitpunkte fest. Nachfolgende Scans behalten den Beginn einer unveränderten Klassifikation bei und setzen ihn zurück, sobald sich die Klassifikation ändert.

## Aktuelle Einschränkungen

- Housekeeper führt keine Bereinigung und keine Historien- oder Statistikmigration durch.
- Die Automationsanalyse umfasst die aktuell von Home Assistant geladenen Automationen. Bei ungültigen oder extern verwalteten Automationen können weniger Details verfügbar sein.
- Dynamische Templates lassen sich nicht immer eindeutig einem Ziel zuordnen. Solche Beziehungen werden ohne Laufzeitbeleg niemals als sicher dargestellt.
- Die Abhängigkeitsansicht konzentriert sich auf direkte Beziehungen. Der Recorder (Verlauf, Statistiken) und nicht lesbare oder automatisch erzeugte Dashboards fließen nicht in die Auswirkungsanalyse ein; sie ist ein Hinweis, keine Garantie.
- Mögliche Duplikate und ungenutzte Automationen beruhen auf Heuristiken und sind Hinweise, keine Gewissheit.

## Entwicklung und Validierung

Housekeeper wurde mit Home Assistant 2026.2.3 automatisiert getestet (lokal und im GitHub-Workflow, zusätzlich gegen die jeweils neueste Version) und in einer laufenden Instanz mit Home Assistant 2026.9.4 ausprobiert. Die Tests decken Folgendes ab:

- Manifest- und Paketverträge
- Parität der deutschen und englischen Backend-Übersetzungen
- Ermittlung von Automationsreferenzen und Erkennung fehlender Ziele
- Config Flow und vollständige Einrichtung des Config Entry
- Inventarisierung von Registry-Einträgen und Zuständen, Quellen (Skripte, Szenen, Dashboards, Gruppen, Helfer), Scanvergleich, Ausblenden von Befunden und Sensoren
- Python-Linting und -Formatierung
- Panel-Logik (Ansichten, Filter, Export, Escaping) mit Node.js
- Python- und Frontend-Syntax

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
