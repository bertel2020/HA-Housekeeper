# HA Housekeeper

**Deutsch** · [English](README.md)

[![GitHub Release](https://img.shields.io/github/v/release/roberto/HA-Housekeeping?include_prereleases&style=flat-square)](https://github.com/roberto/HA-Housekeeping/releases)
[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=flat-square)](https://hacs.xyz/docs/faq/custom_repositories/)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-Custom%20Integration-18BCF2.svg?style=flat-square&logo=home-assistant&logoColor=white)](https://www.home-assistant.io/)
[![Lizenz: MIT](https://img.shields.io/badge/Lizenz-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Letzter Commit](https://img.shields.io/github/last-commit/roberto/HA-Housekeeping?style=flat-square)](https://github.com/roberto/HA-Housekeeping/commits/)
[![Validierung](https://img.shields.io/github/actions/workflow/status/roberto/HA-Housekeeping/validate.yml?branch=main&style=flat-square&label=Validierung)](https://github.com/roberto/HA-Housekeeping/actions/workflows/validate.yml)

HA Housekeeper ist eine deutsch- und englischsprachige Wartungs- und Analyseintegration für Home Assistant. Sie erstellt ein übersichtliches Inventar der Installation, erklärt verdächtige oder verwaiste Objekte und zeigt, wie Entities, Geräte, Integrationen, Bereiche und Automationen voneinander abhängen.

Das Ziel ist keine aggressive automatische Bereinigung. Housekeeper hilft zunächst zu verstehen, welche Objekte existieren, weshalb etwas als problematisch gilt und welche anderen Bestandteile von einer späteren Änderung betroffen wären.

> Version 0.1 arbeitet ausschließlich lesend. Sie löscht, deaktiviert oder benennt keine Home-Assistant-Objekte um und nimmt auch sonst keine Änderungen daran vor.

## Warum HA Housekeeper?

In gewachsenen Home-Assistant-Installationen sammeln sich häufig Registry-Einträge, nicht verfügbare Entities, ausgetauschte Geräte, alte Statistiken und schwer nachvollziehbare Automationsreferenzen an. Ein fehlender Zustand allein erklärt nicht, ob eine Entity absichtlich deaktiviert wurde, ihre Integration deaktiviert ist oder das zugrunde liegende Gerät nicht mehr existiert.

Housekeeper verbindet Registry-Daten mit der laufenden Home-Assistant-Instanz und stellt diesen Zusammenhang in einem gemeinsamen, nur für Administratoren erreichbaren Panel dar.

## Funktionen in Version 0.1

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

### Abhängigkeitsansicht

Die Abhängigkeitsansicht stellt direkte Beziehungen dar, zum Beispiel:

```text
Integration → besitzt → Gerät → stellt bereit → Entity
Etage → enthält → Bereich → enthält → Gerät
Automation → reagiert auf / prüft / steuert → Entity oder Gerät
```

Jede Beziehung besitzt eine Vertrauensstufe. Explizite Registry- und Konfigurationsbeziehungen gelten als sicher; von Home Assistant zur Laufzeit ermittelte Referenzen werden gesondert gekennzeichnet.

### Zweisprachige Benutzeroberfläche

Panel und Einrichtungsdialog stehen auf Deutsch und Englisch zur Verfügung. Die in Home Assistant gewählte Sprache bestimmt die Sprache des Panels.

## Sicherheitsmodell

- Das Panel ist ausschließlich für Home-Assistant-Administratoren verfügbar.
- Alle Housekeeper-WebSocket-Endpunkte erfordern Administratorrechte.
- Version 0.1 bietet ausschließlich Lese- und Scanoperationen an.
- `unavailable` wird niemals automatisch mit „verwaist“ gleichgesetzt.
- Deaktivierte Geräte und Integrationen werden von fehlenden Objekten unterschieden.
- `.storage`-Dateien werden nicht direkt bearbeitet.
- Es wird keine Bereinigung automatisch ausgeführt.

Bereinigungspläne, Backups, Verifikation und Rollback sind bewusst späteren Versionen vorbehalten.

## Installation

### Manuelle Installation

1. Dieses Repository herunterladen oder klonen.
2. `custom_components/ha_housekeeper` in das Verzeichnis `custom_components` innerhalb des Home-Assistant-Konfigurationsverzeichnisses kopieren.
3. Home Assistant neu starten.
4. **Einstellungen → Geräte & Dienste → Integration hinzufügen** öffnen.
5. Nach **HA Housekeeper** suchen und die Einrichtung bestätigen.
6. Als Administrator **Housekeeper** in der Seitenleiste öffnen.

Die Verzeichnisstruktur sollte anschließend so aussehen:

```text
config/
└── custom_components/
    └── ha_housekeeper/
        ├── __init__.py
        ├── manifest.json
        └── ...
```

### Benutzerdefiniertes HACS-Repository

Sobald das Repository auf GitHub verfügbar ist, kann es in HACS als benutzerdefiniertes Repository der Kategorie **Integration** hinzugefügt werden. Nach der Installation Home Assistant neu starten und HA Housekeeper anschließend unter **Einstellungen → Geräte & Dienste** hinzufügen.

## Verwendung

**Housekeeper** über die Home-Assistant-Seitenleiste öffnen. Die Übersicht zeigt Objektzahlen, Befunde und den Zeitpunkt des letzten Scans.

- Eine Kategoriekarte auswählen, um das entsprechend gefilterte Inventar zu öffnen.
- Ein Objekt auswählen, um Registry-Informationen, Zustandsdaten, Diagnose und direkte Abhängigkeiten anzuzeigen.
- Unter **Abhängigkeiten** ein Objekt auswählen, um eingehende und ausgehende Beziehungen zu untersuchen.
- Mit **Neu scannen** den Datenbestand nach Konfigurations- oder Geräteänderungen aktualisieren.

Der erste Scan legt die anfänglichen Beobachtungszeitpunkte fest. Nachfolgende Scans behalten den Beginn einer unveränderten Klassifikation bei und setzen ihn zurück, sobald sich die Klassifikation ändert.

## Aktuelle Einschränkungen

- Version 0.1 führt keine Bereinigung und keine Historien- oder Statistikmigration durch.
- Die Automationsanalyse umfasst die aktuell von Home Assistant geladenen Automationen. Bei ungültigen oder extern verwalteten Automationen können weniger Details verfügbar sein.
- Dynamische Templates lassen sich nicht immer eindeutig einem Ziel zuordnen. Solche Beziehungen werden ohne Laufzeitbeleg niemals als sicher dargestellt.
- Die Abhängigkeitsansicht konzentriert sich derzeit auf direkte Registry- und Automationsbeziehungen.
- Die HACS- und Hassfest-Workflows sind konfiguriert, können aber erst in einem veröffentlichten GitHub-Repository ausgeführt werden.

## Entwicklung und Validierung

Version 0.1 wurde lokal gegen Home Assistant 2026.2.3 getestet. Die Tests decken Folgendes ab:

- Manifest- und Paketverträge
- Parität der deutschen und englischen Backend-Übersetzungen
- Ermittlung von Automationsreferenzen und Erkennung fehlender Ziele
- Config Flow und vollständige Einrichtung des Config Entry
- Inventarisierung von Registry-Einträgen und Zuständen
- Python-Linting und -Formatierung
- Python- und Frontend-Syntax

Die von Home Assistant unabhängigen Tests lassen sich so ausführen:

```bash
python3 -m pytest -q
```

Der GitHub-Validierungsworkflow installiert zusätzlich Home Assistant und dessen Frontend, um die Laufzeit-Integrationstests sowie HACS- und Hassfest-Prüfungen auszuführen.

## Änderungsprotokoll

Die Versionshinweise auf Deutsch und Englisch stehen in [CHANGELOG.md](CHANGELOG.md).

## Lizenz

HA Housekeeper wird unter der [MIT-Lizenz](LICENSE) veröffentlicht.
