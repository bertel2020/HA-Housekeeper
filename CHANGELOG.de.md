# Changelog (Deutsch)

> English version: [CHANGELOG.md](CHANGELOG.md)

## 2.1.1 - 2026-11-13

### Behoben

- **Start auf schwacher Hardware:** Solange Home Assistant startet, läuft kein Scan; der erste folgt, wenn der Start zur Ruhe gekommen ist. Ein Scan lässt Home Assistant zwischendurch arbeiten, so laufen andere Integrationen beim Start nicht mehr in Zeitüberschreitungen (Issue 52).

## 2.1.0 - 2026-11-13

### Neu

- **Dashboard-Karten:** Zehn Lovelace-Karten zeigen, wie es dem Haus geht, ohne das Panel zu öffnen.
  - Alle sehen die Zahlen; Links ins Panel, Scan-Knopf und Menüs sind für Administratoren. Der Karten-Editor bietet die Optionen, die Texte gibt es in allen Sprachen des Panels.
  - Zustand des Hauses: eine Statuszeile, die vier Themen als Kacheln, was sich seit dem letzten Scan geändert hat und ein Scan-Knopf.
  - Batterien: die schwächsten Batterien mit Prognose, die nächste Wechselrunde nach Bereich und eine Einkaufsliste, die die Zellen nach Typ zählt.
  - Hausfunktionen: eine Zeile je Funktion (Heizung, Alarm, Photovoltaik …) mit Zustand, Grund in Worten, den letzten 7, 14 oder 30 Tagen als Streifen und der Verfügbarkeit.
  - Pausierte Integrationen: was die Auto-Pause zurückhält, mit Grund und Zeit bis zum nächsten Versuch; Administratoren versuchen es jetzt, beenden die Pause oder pausieren nie über ein Menü.
  - Nach dem Update: einige Stunden nach einem Update von Home Assistant, Betriebssystem oder Supervisor, was seither nicht mehr läuft, mit der Startzeit gegen das Übliche.
  - Startzeit, Datenbank, Backup und Urlaubsmodus: der letzte Start gegen das Übliche, Größe und Wachstum der Datenbank, das Alter des Backups und die Kopie außer Haus, und woher eine Abwesenheit kommt und was sie zurückhält. Datenbank- und Backup-Karte nutzen die Regeln der Panel-Seiten; die Urlaubskarte ist nur Anzeige.
  - Überblick: alle als Abschnitte einer Karte, in Reitern oder untereinander, mit einer Zahl je Abschnitt.
  - Neue Sensoren für die Karten: „Zustand des Hauses“, „Schwächste Batterie“, „Nächster Batteriewechsel“, „Pausierte Integrationen“, „Nach dem Update“, „Startdauer“, „Größe der Datenbank“, „Backup-Schutz“ und „Urlaubsmodus“; der Sensor jeder Hausfunktion bekommt die Attribute, die die Karte liest.
- **KI-Zugriff: viele Entitäten ersetzen:** Nach einem Wechsel der Integration kann ein Agent die Umstellung vorbereiten, du bestätigst sie.
  - `replacement_candidates` listet die Entitäten, die weg sind, und die, die da sind, mit Name, Geräteklasse, Einheit, Bereich und wie viel sie benutzt; sensible Objekte bleiben draußen.
  - `replacement_plan` (braucht „Befunde beheben“) legt aus bis zu 50 Paaren alt → neu einen Plan an. Er ist eine Vorschau wie jeder andere: Die Planseite sagt, dass er über den KI-Zugriff angelegt wurde, und ein Administrator liest jedes Paar, bestätigt und führt ihn im Panel aus. Die alten Entitäten können danach abgeschaltet, nie gelöscht werden.
- **Template-Regel „liest ein Attribut, das es nicht gibt“:** Ein Template-Helfer, der ein Attribut liest, das seine Entität nicht hat, wird als Hinweis gemeldet (standardmäßig aus). Entitäten, die aus, nicht verfügbar oder unbekannt sind, Mediaplayer und Templates mit Standardwert oder `is defined`-Prüfung bleiben außen vor.

### Behoben

- **Markierungen:** Eine Integration mit einer versteckenden Markierung (erwartet offline, saisonal, Reserve, ersetzt) zeigt in den ersten Minuten nach einem Neustart nicht mehr „Integration … ist nicht geladen“ als Ursache (Issue #50).
- **Aufräumen und Rückgängig:**
  - Die Reparatur eines Zähler-Ausreißers, der älter ist als die 5-Minuten-Statistik, verschiebt jetzt auch deren Summen, damit der Versatz nicht in der Stunde der Reparatur zurückkommt; das Rückgängigmachen funktioniert auch, nachdem die 5-Minuten-Zeilen gelöscht wurden.
  - „Verlauf kürzen“ löschte bei einer Gruppe die Historie ihrer Mitglieder; jetzt werden die Zeilen der gewählten Entität gelöscht.
  - Ein Lauf, der mitten in einem Schritt abbricht (zum Beispiel durch einen Neustart), sagt das, statt „lief nicht“ zu zeigen, und die Daten für ein Rückgängig werden vor einem langen Löschen gespeichert.
  - „Alte Entität löschen“ nach einem Ersetzen sieht sich die anderen Entitäten eines Helfers und deine Markierungen an und schaltet die Entität stattdessen ab, wenn ihre Integration sie wieder bereitstellt. Ein Zählerwechsel nimmt keine ID mehr, zu der noch eine Statistik existiert, und ein wiederhergestellter Helfer gibt seine Entitäten nach Tarif zurück.
- **Hausfunktionen und Prüfungen:**
  - Die Frische-Regel einer Hausfunktion wird am letzten Scan gemessen, nicht an der Uhrzeit von jetzt, und schlägt nicht mehr jede Stunde an, bis der nächste Scan kommt.
  - Weniger falsche Befunde: Eine An- und eine Aus-Automation am selben Sensor sind kein Konflikt; Entitäten ohne Änderung zählen in der Verfügbarkeit als erreichbar; eine HomeKit-Bridge zählt nur, was HomeKit erreicht; der Wachstumshinweis der Datenbank schlägt nicht an, nachdem sie geschrumpft ist; ein Recorder, der eine Woche nichts schrieb, erscheint als Lücke.
  - Die Qualitätsansicht bewertet alle Automationen, nicht nur die ersten 300; Custom-Karten-Ressourcen werden in Zeilen, Layouts und Badges gefunden; eine Statistik ohne Entität wird erst nach zwei Tagen zum Aufräumen angeboten.
  - Eine Antwort aus dem Zwischenspeicher sagt, wie alt ihre Zeilen sind, damit die Lastansicht und die Batterie-Prognose sie nicht mehr als frisch zeigen; die Update-Beobachtung beginnt beim letzten Neustart nur bei Updates, die Core neu starten (Core, Betriebssystem); die Abdeckung läuft reihum, statt immer dieselben Automationen zu zählen.
- **Stabilität:**
  - Ein Neuladen nach geänderten Optionen verliert keine verzögert gespeicherten Notizen, Kriterien oder den Schalter für den KI-Zugriff mehr; ein per Timeout abgebrochener Scan lässt nicht mehr „scannt“ stehen; viele Befehle beim Start teilen sich einen Scan; eine Entscheidung während eines Scans erreicht das neue Ergebnis.
  - Auto-Pause löst seinen Timer nicht mehr immer wieder für einen Eintrag aus, der gerade versucht wird oder entfernt wurde; die vierzehn Sensoren rechnen ihre Zahlen einmal pro Änderung statt jeder für sich.
  - Ignorierte Entitäten und neue Entitäten ohne Wert planen nach einem Ausfall keinen Scan mehr; Erinnerungen und Kriterien zählen den Tag der Person, nicht den in UTC; ein Bereich nimmt kein nan oder inf; eine als beschädigt beiseitegelegte Datenbankkopie steht bei den großen Einträgen.
- **KI-Zugriff:**
  - Das Limit für Änderungen lässt sich nicht durch eine Flut abgelehnter Aufrufe zurücksetzen, das Protokoll behält nur wenige kurze Schlüssel pro Aufruf, „Sensible Objekte zurückhalten“ deckt auch die Geräte von Schlössern und Kameras ab, und Pläne, die eine KI angelegt hat, sind im Journal markiert.
- **Panel:**
  - Eine offene Objektseite zeigt nach einem Neuladen die neuen Daten; „Jetzt ausführen“ führt den Plan aus, den du bestätigt hast; eine neue Zahl in der automatischen Backup-Regel fragt vorher nach, und ein leeres Feld ist keine Regel mehr mit 0; viele Entscheidungen aufzuheben fragt vorher nach.
  - Russische Pluralformen bei Texten wie „{days} Tage“; französische und russische Texte nutzen die vertraute Anrede.

## 2.0.1 - 2026-11-12

### Geändert

- **Auswahlleisten einheitlich:** Alle Listen mit Auswahl haben dieselbe Leiste.
  - „Auswahl aufheben“ und eine klickbare Zähler-Pille, die nur die Auswahl zeigt; die Aktionen erscheinen erst ab der ersten Auswahl.
  - Ab drei Aktionen gibt es ein Menü „Aktionen“ (Befunde, Inventar, Freigaben, Auto-Pause, Objekt-Notizen); die Befund-Zeilen einer Objektseite sammeln mehrere Aktionen im selben Menü.
  - In den Befunden sitzt das Seiten-Häkchen im Spaltenkopf, dazu „Alle n der Liste“.
- **Abhängigkeiten:** Die Seite zeigt, in welche Richtung ein Wert fließt.
  - Zwei Blöcke „Woher kommt es?“ und „Wo wird es verwendet?“ mit Sätzen je Zeile, die Herkunft als eingerückte Kette, der Standort getrennt davon.
  - Der Graph geht bis zu vier Ebenen, die Pfeile folgen dem Datenfluss, die Legende ist immer sichtbar; vom Reiter „Abhängigkeiten“ führt ein Knopf zum Diagramm.
  - Entitäten, die eine Integration in ihren Einstellungen oder Untereinträgen nennt, zählen als verwendet.
- **Oberfläche allgemein:**
  - Der Filter „Neu seit letztem Besuch“ heißt kürzer und hat dieselbe Textfarbe wie die übrigen Filter.

### Behoben

- **Automationen:** Läufe, die absichtlich an einer Bedingung enden, werden nicht mehr als „nie erfolgreich“ gemeldet (Issue #49).

## 2.0.0 - 2026-11-11

Gegenüber 1.14.3. Die Vorabversionen 2.0.0-beta.1 bis beta.5 sind hier zusammengefasst.

### Neu

- **Befunde nach Themen:** Jeder Befund gehört zu einem von vier Themen: Ausgefallen, Kaputte Verweise, Fehlerhafte Automationen, Überflüssig. Die Wirkung (Hoch bis Info) sagt, wie dringend es ist.
  - Themenkacheln mit Wirkungsbalken, ein Filter „Thema“; Übersicht und Befunde-Seite zählen Objekte statt Befunde.
  - Ein fehlendes Ziel ist ab dem ersten Verweis eine Ursache, die verweisenden Automationen sind die Folgen. Automationen und Skripte mit wiederholten Fehlern sind eigene Befunde.
  - Die Spalte „Sicherheit“ heißt „Gewissheit“, mit vier Stufen und einer Begründung im Tooltip.
- **Seit dem letzten Besuch:** Die Befunde-Seite öffnet auf dem, was neu oder schlechter geworden ist, je Benutzer, dazu der Sensor „Neue Befunde“. „Fällig“ sammelt, was wieder angesehen werden will.
- **Beheben:** Jeder Befund hat eine eigene Seite mit vier Schritten (Verstehen, Entscheiden, Ausführen, Nachprüfen) und den Wegen seines Themas.
  - Ziel ersetzen, Verweis entfernen, Fehler abfangen, „Alle n beheben“ für ein fehlendes Ziel; der letzte Fehler einer Automation aus dem Ablaufprotokoll.
  - Geändert wird nur über einen Plan mit Vorschau und Bestätigung. Alle Abläufe zeigen dieselbe Leiste: Einrichten, Prüfen, Bestätigen, Ausführen, Ergebnis.
- **Aufräumen als Rundgang:** Ab 25 offenen Befunden führt ein geführter Rundgang in fünf Etappen durch die Liste, vom Wichtigsten bis zum ruhigen Rest. Jede Antwort lässt sich zurücknehmen.
- **Ansicht „Einfach“ oder „Vollständig“:** Du wählst unter Einstellungen, wie viel von Housekeeper du siehst; die Wahl gilt für dein Benutzerprofil. Vollständig ist die bisherige Oberfläche, eine neue Installation beginnt in Einfach. Die Ansicht ändert keine Regeln.
- **Entitäten ersetzen:** Ein Assistent ersetzt eine oder mehrere Entitäten in einem Plan; „Zähler wechseln“ und „Verweise ersetzen“ gehen darin auf.
  - Fünf Arten je Entität: Verweise umstellen, Verweise und Statistik, Nur Statistik, Statistik und ID, Nur ID. Was bei einem Paar nicht möglich ist, ist gesperrt und sagt warum.
  - Verlauf und ID übernimmt die neue Entität von selbst nur bei echten Zählern. Die Verwendungen lassen sich aufklappen, die alte Entität lässt sich danach deaktivieren oder löschen.
- **Verwendung in Integrationen:** Entitäten, die eine Integration in ihren Einstellungen oder Untereinträgen nennt (etwa ein Raumtemperatursensor im Thermostat eines Geräts), gelten als sicher verwendet; gehört die Einstellung zu einem Untereintrag mit genau einem Gerät, hängt die Beziehung an diesem Gerät (Integration, Gerät, Entität). Sie erscheinen in den Abhängigkeiten, in der Auswirkung einer Entfernung und im Aufräumen.
- **Helfer:** Housekeeper erkennt Helfer (Template, Derivative, Min/Max …) besser.
  - „Helfer löschen“ ist ein Plan mit Vorschau und Backup; Rückgängig erstellt den Helfer neu. Helfer lassen sich als Datei exportieren und wieder importieren.
  - Pläne und Diagnose nennen die Quellen eines Helfers; der Ersetzen-Assistent stellt sie mit um.
  - Neue Qualitätsregeln für Helfer und Templates (aus, Hinweise).
- **Entfernen, Deaktivieren, Ausblenden:** Die Seite eines Geräts bietet „Gerät entfernen“ oder „Gerät lokal vergessen“, die einer Entität „Deaktivieren“ und „Ausblenden“, jeweils per Plan mit Vorschau und Undo.
- **Freigaben ändern:** Freigaben für Assist, Alexa und Google lassen sich per Plan entfernen (Liste, Befund, Zeilenmenü); „Neue nicht mehr automatisch freigeben“ und „PIN wieder verlangen“ gibt es auch. Sensible Entitäten nimmst du einzeln oder gesammelt zurück.
- **Zugangsdaten und Zugriffe:** Beide Seiten beginnen mit „Zu prüfen“, nennen den Grund einer Stufe und haben mehr Auffälligkeiten, etwa Admin von außen ohne Zwei-Faktor oder lange nicht angemeldete Konten. Bekanntes lässt sich als „Ist so gewollt“ vermerken.
- **Notizen und Regeln:** Eine Objekt-Notiz kann von selbst enden. Eine Wirkungszeile zeigt vor dem Speichern, was ausgeblendet wird und wann es zurückkommt.
- **Backups:** Eine Karte bei der Bestätigung zeigt Backup und Folgen; ein Plan kann ohne neues Backup laufen (nicht bei Recorder-Änderungen). Alte Housekeeper-Backups lassen sich stündlich automatisch aufräumen.
- **Batterien:** Die Liste zeigt Hersteller, Modell, Integration, Entität und Bereich. „Akku (ich lade ihn)“ ist ein eigener Typ mit „Laden in …“.
- **Weitere Sprachen:** Französisch, Spanisch, Portugiesisch, Italienisch, Slowakisch, Russisch und Chinesisch (vereinfacht), in der Oberfläche, bei der Einrichtung und in den Meldungen. Die Übersetzungen sind Entwürfe; `docs/TRANSLATING.md` erklärt, wie man sie verbessert.
- **Sonstiges:**
  - Der Seitenleisten-Eintrag „Housekeeper“ lässt sich ausblenden (Einstellungen → Darstellung); das Panel bleibt über die Integrationsseite erreichbar.
  - KI-Zugriff: neue Dienste `finding_fix_options` (lesend) und `finding_fix_plan` hinter dem Schalter „Befunde beheben“ (aus); den Plan bestätigt nur ein Administrator im Panel.

### Geändert

- **Neue Namen für die Ausgänge:** „Bekannt“ heißt „Ist so gewollt“, „Zurückgestellt“ heißt „Später“, „Ausgeblendet“ heißt „Fehlalarm“, „Vermerk“ heißt „Objekt-Notiz“, bei den Ausnahmeregeln heißt „Ausblenden“ „Nicht melden“ (mit Prüfdatum). Gespeicherte Entscheidungen und der Dienst `finding_decide` bleiben unverändert; „Ist so gewollt“ bleibt beim Wechsel von 1.x unbefristet.
- **Menü neu geordnet:** Befunde, Überwachen, Pflegen, Betrieb, Sicherheit, Bestand. Die Ausnahmen haben eine eigene Seite, „Regeln & Ziele“ fasst Richtlinien und Wartungsziele zusammen, alte Links führen auf die neuen Seiten.
- **Abhängigkeiten, Richtung:** Die Beziehungen eines Objekts stehen in zwei Blöcken („Woher kommt es?“, „Wo wird es verwendet?“), jede Zeile sagt, wer was womit tut, im Reiter „Abhängigkeiten“ (zwei Spalten) und in der Liste; beide zeigen die Herkunft als Kette Integration → Gerät → Entität und den Standort (Etage › Bereich) getrennt davon. Im Graph zeigen die Pfeile in Richtung des Datenflusses (Gerät → Entität → Dashboard), die Spalten tragen die Spalten Kopfzeilen mit der Ebene, die Legende erklärt Pfeile und Ebenen, der Filter fasst Herkunft und Verwendung zusammen.
- **Schutzmodus mit drei Stufen:** Beobachten, Ändern und Alles. „Nur Quarantäne“ entfällt und steht danach auf „Beobachten“.
- **Befunde, Bedienung:** Die Auswahlleiste hat ein Menü „Aktionen“; die Regel für genau eine Entität entfällt (dafür gibt es die Objekt-Notiz). Status, Notiz und Regel haben dasselbe Gerüst.
- **Plan:**
  - Ein Plan fasst 250 Entitäten, größere Auswahlen laufen in Runden.
  - Gesperrte Zeilen nennen den Grund zuerst und in Rot. Bei einem Zählerwechsel mit unterschiedlichen Statistik-Arten bietet die Zeile „Referenzen ersetzen“ oder „nur ID“ an.
- **Oberfläche allgemein:** Aktionen je Zeile stehen im ⋮-Menü, die Kacheln von „Beheben“ sind gleich groß, Schrittknöpfe und Reiter haben Namen für Screenreader, Standardfristen sind einheitlich (365 Tage, bei kritischen Objekten 90).
- **Rückweg auf 1.x:** Pläne, die Freigaben ändern (Assistenten, Neu laden), vorher zurücknehmen; 1.x kennt sie nicht und meldet beim Rückgängig einen Konflikt. Die neuen Felder der Entscheidungen gehen beim Wechsel zurück verloren.

### Behoben

- **Sicherheit:** Namen und Links aus Daten von Integrationen werden im Panel sicher angezeigt; der Diagnose-Download enthält keine Titel und Entitäts-IDs mehr, nur Anzahlen.
- **Automationen:** Der letzte Fehlschlag einer Automation und die Laufliste im Vergleich fanden nie etwas und tun es jetzt.
- **Prüfungen und Scan:** Der Ereignisverlauf wird auch zur Laufzeit gespeichert; Speicher- und Plattenwerte an einer Schwelle springen nicht mehr alle fünf Minuten; die Backup-Ziele werden alle 45 statt alle 5 Minuten abgefragt; ein Scan mit unlesbarer Quelle vergisst keine „zuerst gesehen“-Daten mehr.
- **Aktivität und Rundgang:** Seiten überspringen keine Einträge mehr, „Rückgängig“ greift nur, solange die Entscheidung noch so steht, „Behalten“ überschreibt keine Notiz.
- **Freigaben und Neu laden:** Ein Filter eines anderen Assistenten sperrt den Plan nicht mehr; eine Integration, die lange lädt, wird nicht halb abgebrochen.
- **Sonstiges:** Eingegebene Schwellenwerte bleiben bis zum Speichern erhalten; Batterie- und Laufdaten werden nach einem neuen Scan neu geladen; der Bereichsvorschlag vergleicht mit den Nachbargeräten.

## 1.14.3 - 2026-11-08

### Neu

- **Hinweis auf Version 2.0:** Die Übersicht weist einmal pro Browser auf die Beta von 2.0 hin (wegklickbar). Unter Einstellungen → Info bleibt ein Link zu den Vorabversionen.

## 1.14.2 - 2026-11-08

### Neu

- **Vorschau:** Eine Vorschau, die von einer anderen Seite aus geöffnet wurde, hat den Knopf „Zurück zur Auswahl“. Er verwirft die Vorschau.

### Behoben

- **Rückgängig:** Ohne Auswahl macht „Rückgängig“ nichts rückgängig, statt alles.
- **Regel „Ungenutztes Label“:** Sie geht jetzt über die Geräte-Objekte statt über deren IDs.
- **Speicherseite:** Eine gemerkte Ordnerzahl bricht die Seite nicht mehr, wenn eine Blueprint hinzukam oder entfernt wurde.
- **Schutzmodus:** Das Setzen des Schutzmodus gilt nur für die Sitzung des Panels.

## 1.14.1 - 2026-11-04

### Behoben

- **Sicherheit:** Namen und Links aus Daten von Integrationen werden im Panel sicher angezeigt.
  - Bereichs- und Entitätsnamen werden nicht mehr als Markup gelesen.
  - Links zur Dokumentation und zu Reparaturhinweisen werden nur mit `http`, `https` oder als Pfad geöffnet.
- **Diagnose:** Der Diagnose-Download enthält keine Titel von Integrationen und keine Entitäts-IDs mehr, nur noch deren Anzahl.

## 1.14.0 - 2026-10-31

### Neu

- **Objekt-Notiz mit Ende:** Eine Objekt-Notiz kann von selbst enden, sobald das Objekt wieder meldet.
  - Eine neue Notiz endet standardmäßig von selbst.
  - Die Wartezeit ist ein eigenes Feld neben der Option und heißt „Warten“.

### Behoben

- **Ablauf einer Automation:** Eine Entität, die nur als Zustand existiert (etwa `zone.home`), wird im Reiter „Ablauf“ nicht mehr als fehlend gemeldet.
- **Neue Regel:** Die Karten von „Wofür“ werden nicht mehr vom vollbreiten Eingabefeld gequetscht.

## 1.13.0 - 2026-10-26

### Neu

- **Start-Zeiten:** Housekeeper hält fest, wie lange Home Assistant für einen Start brauchte.
  - Unter Speicher & System zeigt der Reiter „Starts“ die Dauer der letzten Starts, je Integration und mit einer Kachel für den letzten Start.
  - Eine Integration lässt sich aufklappen: wie viel langsamer oder schneller sie als üblich war, ihre Einträge, Herkunft und der Grund, warum sie nicht geladen wurde.
  - Ein Start nach einem Absturz ist markiert, mit der Zeit, die Home Assistant ausgefallen war.
  - Die Startmeldung zeigt, wie lange Home Assistant schon lädt, und klappt die noch ladenden Integrationen auf.
- **Auto-Pause:** Eine Integration, die beim Einrichten immer wieder scheitert, wird pausiert und nach 1, 3 und 6 Stunden, danach täglich bis zu 7 Tage erneut versucht. Das gilt für jeden Datenlieferanten, der nicht ausgenommen ist.
  - Die Seite zeigt den Schalter, was pausiert ist, was gerade Fehlversuche sammelt und den Rest eingeklappt; von Hand pausieren geht über die gewohnte Suche mit Rückfrage.
  - Ein pausierter Dienst bleibt ein Befund ab dem Beginn des Ausfalls; die Übersicht zeigt ihn unter Wartung.
- **Verlässlichkeit:** Die Zahl der Einrichtungsversuche einer Integration steht neben den Episoden.

### Geändert

- **Zeilenmenü:** Aktionen pro Zeile stehen im ⋮-Menü statt in mehreren Knöpfen (Markierungen, Updates, Plan-Journal, Inventar, Ohne Verweis, Regelverstöße, Objektlisten, Verlässlichkeit, Integrationen, Änderungen, wiederkehrende Probleme, Übersicht). Probleme stehen zuerst und haben eine rote Kante.
- **Objektseite:** Der Kopf hat einen Hauptknopf, der zum Zustand passt, „In HA öffnen“ und ein Menü.
- **GUI allgemein:**
  - Einstellungen: Felder und Schalter stehen rechts, Felder gleich breit.
  - Regelverstöße: Der Grund steht als ruhiger Absatz, die Umbenennung in einer Zeile mit dem empfohlenen Namen.
  - Aufräumen: Die Kachel „Ohne Verweis“ zeigt die Zahl der Objekte mit Statistik.
  - Speicher & System antwortet beim ersten Besuch sofort.
  - Namen in den Listen der Auto-Pause-Seite öffnen die Integrationsseite.

### Behoben

- **Backup-Schutz:** Ein noch laufendes Backup gilt nicht als gescheiterter letzter Lauf.
- **Plan:** Der erwartete Endzustand nennt Neuladen, Labels, Bereiche, Umbauten, Aktivieren, Ausblenden und gelöschte Backups oder Automationen.
- **Schleifen:** Ein Befehl `turn_off` bei Mediaplayer, Licht, Schalter, Ventilator oder Klima kann nur „aus“ auslösen; eine Liste in `to` wird Wert für Wert gelesen.
- **GUI allgemein:**
  - Der Spaltenkopf einer Spalte mit Zeilenmenü ist leer statt ein Kästchen-Symbol.
  - Die Statusauswahl eines Befunds ist wieder ein Block.

## 1.12.1 - 2026-10-23

### Neu

- **Konflikte und Schleifen als bekannt markieren (Issue #38):** In der Tabelle der Läufe gibt es pro Eintrag „Als bekannt markieren“ und „Wieder melden“. Ein bekannter Eintrag bleibt in der Liste, zählt aber nicht mehr in der Bewertung. Die Entscheidung bleibt bestehen, auch wenn sich die Stufe ändert.

### Geändert

- **Marketplace:** Ab Home Assistant 2026.11 nennen die Texte den Marketplace statt HACS.
- **GUI allgemein:**
  - Recorder → Datenbank: Der Knopf „Platz je Entität messen“ sitzt im Kopf der Karte der größten Tabellen.
  - Speicher & System: Die Teile von „Weitere“ bleiben eingeklappt und zeigen ihren Platz als Balken.

### Behoben

- **Konflikte (Issue #38):** Zwei Automationen, die auf denselben Sensor mit verschiedenen Zuständen (`on` gegen `off`) oder nicht überlappenden Schwellen (`above: 5` gegen `below: 5`) reagieren, gelten nicht mehr als Gegenläufer.
- **Qualitätsansicht (Issue #39):**
  - Deaktivierte Automationen und Ziele mit Vermerk, Ausnahme, Label oder bewusst abgeschaltetem Eintrag gelten nicht mehr als veraltet.
  - Ein Lauf, der an einer Bedingung in den Aktionen endet, zählt als Bedingung statt als Fehlschlag.
  - Befehle, die den Zustand nicht ändern (etwa `snapshot`, `press`), lösen keine Schleife mehr aus; bei unbekannten Befehlen bleibt es bei „statisch“.

## 1.12.0 - 2026-10-22

### Neu

- **Platz pro Entität und Attribut (Issue #36):** Unter Recorder → Datenbank lassen sich die Tabellen `states` und `state_attributes` aufklappen. Auf Knopfdruck misst Housekeeper im Hintergrund, welche Entitäten dort den Platz belegen, mit Fortschritt und Abbrechen. Für jede Entität zeigt es, welche Attribute den Platz ausmachen und welche sich so oft ändern, dass ständig neue Attribut-Zeilen entstehen. Erreichbar auch von der Seite einer Entität und aus der Recorder-Last.

- **Reparaturhinweise einzeln schaltbar:** Auf der Geräteseite von Housekeeper gibt es unter Konfiguration einen Schalter pro Hinweis (verwaiste Entitäten, nicht verfügbare Entitäten, defekte Referenzen, Scan-Probleme, beschädigte Datenbank, Backup-Problem, verwaiste Statistiken). Er wirkt sofort.
  - Neue Hinweise: Backup-Problem (wenn der Backup-Schutz ein Problem meldet) und verwaiste Statistiken.
  - Eine Zahl pro zählender Gruppe legt fest, ab wie vielen Befunden der Hinweis erscheint (Standard 0: ab einem).
  - Standardmäßig an sind defekte Referenzen, Scan-Probleme, beschädigte Datenbank und Backup-Problem. Verwaiste und nicht verfügbare Entitäten sowie verwaiste Statistiken sind aus. Wer die ersten beiden bisher hatte, behält sie.

## 1.11.0 - 2026-10-20

### Neu

- **Labels:**
  - Das Label `housekeeper_keep` an einem Gerät oder einer Entität wirkt wie der Vermerk „Nicht entfernen“: Es sperrt alle Bereinigungsschritte, blendet aber keinen Befund aus. In Home Assistant lässt es sich auf mehreren Objekten gleichzeitig setzen.
  - Unter Einstellungen → Ausnahmen zeigt ein Block die drei Labels `housekeeper_keep`, `housekeeper_ignore` und `housekeeper_critical`: was jedes bewirkt, ob es in Home Assistant angelegt ist und an wie vielen Objekten es hängt.
  - Das Inventar lässt sich nach Label filtern.
- **Entitäten, die die Integration nicht mehr bereitstellt:** Sie werden als verwaist erkannt statt als „nicht verfügbar“, auch bei YAML-Entitäten, nach derselben Wartezeit wie ein Ausfall. Sie lassen sich direkt entfernen, ohne Quarantäne, aber mit Vorschau, Backup und Wiederherstellen, auch unter Bereinigen; am ersten Tag fragt die Vorschau nach, ob die Entität wirklich weg ist.
- **Duplikate:**
  - Auch der umgekehrte Fall wird erkannt: Die alte `sensor.x` ist übrig, die neue `sensor.x_2` läuft (gleiches Gerät oder gleicher Name).
  - Beim Ersetzen ist die funktionierende Entität vorbelegt; Vorschläge bei fehlenden Verweisen öffnen das Ersetzen mit diesem Ziel.
- **Ausnahmen:** Regeln nach Integration gelten auch für den Befund „Integration nicht ladbar“, etwa für den Drucker-Eintrag, solange der Drucker aus ist (Diskussion 28).
- **Entität „Aktivität“:** Zeigt, ob Housekeeper gerade scannt, einen Plan ausführt, auf den Start von Home Assistant wartet oder bereit ist; passt auf ein Dashboard neben den Knopf „Scan starten“.

- **Vorschläge für Vermerke:** Eine Karte über der Befundliste sammelt Entitäten, die regelmäßig ausfallen oder keinen Wert haben (etwa im Standby), die eines Geräts, die gemeinsam ausfallen, in einer Zeile mit erkanntem Zeitfenster; der Vermerk geht an diese Entitäten, die übrigen bleiben überwacht. „Übernehmen“ setzt den Vermerk „Absichtlich offline“, „Alle übernehmen“ alle nach einer Rückfrage. Zeit ohne Wert zählt dafür mit, nicht aber für die Verfügbarkeit.

- **Datenbankgröße bei MariaDB/MySQL und PostgreSQL:** Die Größe wird beim Server abgefragt (Issue #36); damit gibt es auch dort Wachstum pro Tag und Hinweise zur Aufbewahrung. MariaDB/MySQL liefert eine Schätzung. Neu ist außerdem die Liste der größten Tabellen; bei SQLite wird sie einmal am Tag gemessen.

- **Backup-Schutz:** Wer außerhalb von Home Assistant sichert (etwa bei Docker), kann das angeben. Dann entfallen die Prüfungen zu Home-Assistant-Backups samt Problem in der Übersicht und Event; Platz, Restore-Test und Housekeepers eigene Sicherungen bleiben.

### Geändert

- **Betrieb:**
  - Automationsläufe: Zahl und Hinweis eines Befunds stehen getrennt; „bei einem Eintrag“ statt „bei 1 Einträgen“.
  - Zuverlässigkeit: Zustände in Worten („Einrichtung wird wiederholt“); „Alle“ zählt alle instabilen Entitäten und die Liste sagt, dass sie die auffälligsten zeigt; „Meist um 03–05 Uhr“ statt „03–05“; die Tabelle der Integrationen passt ins Fenster.
  - Speicher & System: Kategorien mit Namen in Worten und Anteil am belegten Platz.
  - Hausfunktionen: Kacheln je Zustand, Beschreibung als normaler Text, Titel nur einmal.
  - Eine Kachel „Alle“ ist nirgends mehr als Filter markiert; Zeilen, die sich nicht auswählen lassen, sagen warum.
- **Pflegen:**
  - Backups: „vor 3 Tagen“ statt „3 Tagen“; ein eingestelltes externes Ziel, das das neueste Backup nicht erreicht hat, wird genannt; „Zu prüfen“ nennt Probleme und Hinweise; die Größen der letzten Backups sind ein Säulendiagramm mit Tooltip.
  - Wartung: Kacheln ohne offene Punkte sagen „nichts zu tun“; der Reiter heißt „Ziele“.
  - Batterien: nicht verfügbare Batterien stehen in der Liste und zählen mit; schwache stehen in der Prognose in einem eigenen aufklappbaren Bereich „Jetzt niedrig“; „jetzt“ statt „unter Grenze“; „Typ fehlt“ ist überall ein Knopf.
  - Richtlinien: leere Spalten verschwinden, „Ausgeblendete zeigen“ steht unter der Liste, nicht wählbare Zeilen sagen warum.
- **Bereinigen:**
  - Die Seite heißt wie im Menü „Bereinigen“; der Planknopf heißt überall „Vorschau erstellen“, Spalte und Filter der Gründe „Grund“.
  - Der Text zu verwaisten Statistiken beschreibt, was der Reiter kann, und verweist auf Reparieren → Zähler wechseln.
  - Auswahl-Knöpfe erscheinen mit dem ersten Haken; Datumsangaben wie auf der Befundseite; eine Statistik im Energie-Dashboard sagt, warum sie nicht wählbar ist.
  - Am Handy sind die Zeilen kompakt und die Bedienleiste aller Listen geordnet.
- **Übersicht:**
  - „Wartung“ steht in der Aufgabenliste als eigene Gruppe, abgesetzt von „Dringend“.
  - Die wichtigsten Befunde nennen, was sie sind und seit wann, mit dem Schweregrad als Pille.
  - In „Hinweise“ sind Zeilen mit 0 zurückgenommen; „Ungenutzt“ heißt „Ungenutzte Automation“, „Nicht verwendet“ heißt „Ohne Verweis“.
  - Der Hinweis zu den Stufen der Ausfälle bricht um, statt abgeschnitten zu werden.
- **Ausfälle in der Übersicht:** Dringend sind nur noch Ausfälle der Stufe hoch; die übrigen stehen als „Weitere Ausfälle“ unter Offen. Eine Ausfallkette zählt einmal, ein Gerät unter einer ausgefallenen Integration nicht zusätzlich.
- **Recorder → Datenbank:** Die größten Tabellen stehen als sortierbare Liste mit Klartextnamen und Anteil; jeder Befund der Datenbank ist ein Faltbereich mit Stufe (bei fehlenden Stunden mit Zahl), darin Text, „Was tun?“ und die betroffenen Sensoren; „Datenbank prüfen“ steht in der Kopfleiste, das Ergebnis als Kachel „Integrität“.
- **Befundseite:**
  - Die Kacheln zählen immer die offenen Befunde, unabhängig vom gewählten Status, und alle neun Gründe stehen immer da (ohne offene Befunde als stille 0). Ein Klick auf eine Kachel zeigt die offene Liste; ist ein anderer Status gewählt, sagt ein Hinweis über der Liste das.
  - „Alle Befunde“ steht links über beiden Zeilen und nennt die Folgen von Ausfällen in der Kachel; Störungen und Aufräumen stehen in je einer Zeile, alle Kacheln gleich hoch. Die Gruppenköpfe sind als Filter erkennbar.
  - In der Liste steht ein Objekt mit nur einem Befund als eine Zeile, die Spalte „Befund“ nennt den Grund im Klartext vor der Regel, und der Kopf eines Objekts wählt alle seine Befunde aus.
  - Am Handy sind die Zeilen kompakt.
  - Die gruppierte Liste blättert nach den angezeigten Zeilen, auch wenn Köpfe aufgeklappt sind; die Gruppen unter „Erledigt“ sind anfangs eingeklappt.
- **Kacheln der Übersicht:**
  - Neben dem Ring stehen „Geprüfte Objekte“, „Befunde“, „Störungen“ und „Aufräumen“, wie auf der Befundseite. „Befunde“ zählt alle offenen Befunde, „Nicht verfügbar“ entfällt.
  - Auf der Befundseite filtern die Überschriften „Störungen“ und „Aufräumen“ die Liste auf die ganze Gruppe; die beiden Kacheln der Übersicht führen dorthin.
  - Die Verlaufslinien zeigen höchstens die letzten 7 Tage, und Zahl und Linie zählen jeweils dasselbe.
  - Titel, Zahl und Linie stehen in allen Kacheln einer Reihe auf gleicher Höhe, auch wenn eine Kachel mehr Text hat.
- **Zustand des Hauses:**
  - Der Ring zeigt einen Zustand in Punkten von 100 statt eines Anteils in Prozent. Jedes Objekt mit Befund zieht einmal ab, mit seiner schlimmsten Stufe: hoch 2, mittel 1, gering 0,5, Info nichts. Auch die Folgen eines Ausfalls zählen als eigene Objekte.
  - Die Farbe kommt nicht mehr aus der Zahl, sondern aus dem, was offen ist: rot bei dringenden Themen, gelb bei anderen offenen Themen oder Objekten mit hoher oder mittlerer Auswirkung, sonst grün. Ein Etikett neben dem Ring sagt es in Worten.
  - Die Kachel „Geprüfte Objekte“ zeigt dieselbe Grundzahl wie die Rechnung, und „X von Y mit Befund“ passt zur Summe ihrer Zeilen.
  - Die Verlaufslinie springt bei der Umstellung einmal nach unten, weil ältere Tage noch mit den alten Gewichten gerechnet sind.

- **Ausfälle im Standby:**
  - Ein Gerät, dessen Entitäten alle keinen Wert mehr haben (etwa im Standby), gilt als „Gerät ganz ausgefallen“, nicht mehr nur bei „nicht verfügbar“, auch bei nur einer Entität. Seine Entitäten stehen als Folgen darunter, ein Vermerk am Gerät blendet alle aus. Deaktivierte, verwaiste und Entitäten, die nie einen Wert hatten, zählen nicht mit.
  - Den Vermerk am ganzen Gerät gibt es nur, wenn es ganz ausgefallen ist, auch in der Sammelaktion „Vermerk setzen“. Fallen nur einige Entitäten aus, gehört der Vermerk an diese (Forum).
  - Ein Gerät, das wegen seiner Integration ausgefallen ist, zählt als Folge, nicht als zweites Problem. Ein Vermerk an einer Integration oder App blendet, solange sie ausgefallen ist, auch die Ausfälle ihrer Geräte und Entitäten aus.
- **Befundliste nach Objekten:**
  - In der Ansicht „Gruppiert“ steht jeder Befund unter seinem Objekt: Entitäten mit Gerät unter dem Gerät, alles andere unter sich selbst, schon ab einem Befund, mit allen Arten von Befunden darunter. Ursachen stehen darüber (App › Integration › Gerät, fehlendes Ziel › Automation).
  - Der Kopf zeigt Zusammenfassung, höchste Schwere, Sicherheit und Alter als Spanne sowie einen Vermerk; die Gruppen bleiben bei Filter und Suche stehen. „Einzeln“ zeigt jeden Befund als eigene Zeile.
  - Die Leiste trennt Status, Darstellung und „Alle auf-/zuklappen“; „Nur Ursachen“ ist ein Typ-Filter, die Zeile über der Tabelle nennt „N Befunde an M Objekten“.
- **Oberfläche:**
  - In der Ursachendiagnose öffnen Integration, Gerät und funktionierende Entität per Klick ihre Seite.
  - In der Kopfzeile der Detailseite sind Integration, Gerät und Bereich verlinkt.
  - Das Zeilenmenü eines Duplikat-Befunds öffnet die funktionierende Entität.
  - Im Reiter „Aktionen“ steht der Schritt, der einen Befund löst, als erster Knopf in dessen Zeile (zum Beispiel „Entfernen planen“ oder „Durch funktionierende Entität ersetzen“).
  - Befundliste: Zeilen mit und ohne Aufklapp-Pfeil stehen bündig; „Vermerk am Gerät setzen“ steht im Menü ⋮ der Ursache statt als eigener Knopf; „Offen“ und die Verlaufslinie der Übersicht zählen gruppiert wie die Kacheln; im Zeilenmenü heißt es „Logbuch-Eintrag hinzufügen“, abgesetzt von den Entscheidungen.
  - Vorschläge für Vermerke: eine Kopfleiste mit Summe und „Alle vermerken“, je Zeile ein kleiner Knopf „Vermerken“ und ein ✕ für „Nicht mehr fragen“, kürzerer Text.
  - Die Zeile unter der Navigation zeigt den KI-Zugriff als eigenen Punkt statt eines eigenen Streifens, fasst letzten Plan und Rückgängig in einem Punkt zusammen, stellt Rotes und Gelbes nach vorn und benennt Schutzmodus („Standard“) und Scan („Scan vollständig“) klarer.
  - Die Kacheln der Befundliste zeigen als große Zahl die gruppierte Anzahl (Folgen eines Ausfalls hängen an dessen Ursache), darunter die Gesamtzahl samt Folgen; die Verlaufslinie rechnet ebenso.
  - Der erwartete Endzustand eines Plans sagt, wann der Recorder verbliebene Zustände löscht und dass Langzeitstatistik bleibt (oder dass alles bleibt, wenn die automatische Bereinigung aus ist); „1 Entität“ statt „1 Entitäten (0 Geräte)“.

- **Home-Assistant-Qualitätsskala:**
  - Jede Option im Optionsdialog erklärt, was sie bewirkt.
  - Die Sensoren der Hausfunktionen und die Event-Entität haben übersetzte Namen, die Ereignistypen übersetzte Zustände.
  - Das Benutzerhandbuch beschreibt das Entfernen von Housekeeper und die Fehlersuche und hat Beispiel-Automationen.
  - Das Benutzerhandbuch nennt beim Scanintervall in den Optionen die richtige Vorgabe von 6 Stunden.

### Behoben

- **Aufräumen und Labels:**
  - Unter Bereinigen → „Geräte deaktivieren“ erscheinen Geräte mit dem Vermerk „Nicht entfernen“, dem Label `housekeeper_ignore` oder einer Ausnahmeregel nicht mehr; Geräte ganz ohne Entität (etwa Bluetooth-Proxy) sind als „Keine Entitäten“ gekennzeichnet (Diskussion).
  - Das Label `housekeeper_ignore` an einem Gerät blendet auch dessen Befunde und die seiner Entitäten aus, nicht nur bei Entitäten und Automationen.
- **Priorität:** „Wurde nie ausgelöst“ und „Lange nicht ausgelöst“ sind bei Automationen, die Kritisches steuern (Alarm, Überflutung), nicht mehr „Hoch“ (Diskussion 33).
- **Inventar:** Automationen, Skripte und Szenen erscheinen nur noch einmal und werden einmal gezählt, nicht zusätzlich als Entität; die Detailseite verlinkt beide (Issue 34).
- **Knopf „Scan starten“:** Er gilt während eines Scans nicht mehr als „nicht verfügbar“, darum meldet Housekeeper ihn nicht mehr selbst als flatternd (Issue 35).
- **Oberfläche:**
  - Das Menü am Zeilenende (⋮) wird nicht mehr am Rand der Karte abgeschnitten (Issue 32).
  - Übersicht: Die Kachel „System“ verlinkte mit „Details im Recorder“, führt aber zu Speicher & System; beide Kacheln heißen jetzt nur „Details“.
  - Übersicht: Die Berechnung des Zustands öffnet „Info“ unter dem Ring statt „Wie kommt das zustande?“ in der Textzeile.
  - Sprung aus „Ausfälle“ oder „Weitere Ausfälle“ der Übersicht: Der Filter heißt wie die Zeile, und über der Liste steht „19 Ausfälle mit 496 Befunden“, gezählt wie in der Übersicht, statt aller Objekte darunter.
  - Einzahl bei Ausfällen: „1 Folge“, „erklärt 1 weiteren Befund“, „1 Entität betroffen“.
  - Gruppierte Befundliste: Alle Köpfe starten eingeklappt, auch wenn ein Filter nur wenige Befunde übrig lässt.
  - Gruppierte Befundliste: Die Seiten zählen die obersten Köpfe; ein aufgeklappter Kopf zeigt alles darunter auf derselben Seite. Alle Listen bieten zusätzlich 250 pro Seite.
  - Vorschläge für Vermerke: eine Liste wie die übrigen, mit Spalten, Sortierung, Kästchen und Auswahlleiste („Vermerken“, „Nicht mehr fragen“); einzeln über das Menü ⋮ statt Knopf und ✕ je Zeile.
  - Vorfälle nach Updates: eine Liste mit Ereignis, Zeitpunkt, Befunden und Beobachtung; eine Zeile klappt ihre Details auf. Die Befunde eines Vorfalls stehen nicht mehr doppelt in der Karte, ein Knopf filtert die Befundliste darauf. Die Beobachtung zeigt ihre Objekte als kleine Tabellen.
  - Kacheln von Wartung und Bereinigen: je eine Statuspille unter dem Titel, mit Einheit („2 Updates“, „5 Entitäten“) oder grün „Nichts zu tun“; keine Zusatzzeile mehr unter dem Hinweis.
  - Nach dem Setzen eines Status (bekannt, zurückgestellt, ausgeblendet, wieder einblenden) lädt die Befundliste neu; ein als bekannt markierter Ausfall verschwindet sofort aus der Liste.
  - Das Menü ⋮ eines Befunds ist für offene und entschiedene Befunde gleich; nur oben steht je nach Stand „Status setzen …“ oder „Wieder einblenden“ und „Status ändern …“ (bzw. der Weg zu Vermerk, Regel oder Label). Ein geöffnetes Menü schließt andere offene.
  - Status für einen Ausfall: Das Formular sagt, dass die Entitäten dahinter dann einzeln zählen, und bietet stattdessen einen Vermerk an.
  - Vermerke: Ein Objekt, das seit 30 Tagen ohne Ausfall läuft, fragt in der Liste der Vermerke „noch nötig?“ (mit Filter).
  - Status, deren Befund gerade nicht da ist (etwa weil das Gerät wieder läuft), stehen als „ruhend“ in der Liste der Status, mit „zuletzt am …“, „noch nötig?“ nach 30 Tagen und „Objekt gibt es nicht mehr“; die Liste ist eine Tabelle mit Auswahl und „Entscheidung entfernen“.
  - Erinnerungen: „Erledigt“ bleibt in der Zeile, „Ändern“ und „Löschen“ stehen im Menü ⋮; mehrere lassen sich über Kästchen auf einmal als erledigt markieren.
  - Batterien, vermutlich keine Wechselbatterie: Vorschläge werden über Kästchen ausgewählt und mit „Übernehmen (n)“ bestätigt statt „Alle bestätigen“ mit Rückfrageleiste; „Doch Batterie“ steht im Menü ⋮.
  - Detailseite, Verlauf: Die Pläne stehen als kleine Tabelle wie im Journal (Datum, Status, Ergebnis, Nachkontrolle); ein Klick auf die Zeile öffnet den Plan.
  - Hausmonitor, Formular: Die Typauswahl der Suchtreffer sind Chips wie die Status-Chips der Befunde statt Knöpfen.
  - Einstellungen → Labels: Kopier-Symbol direkt am Namen, Zählung in Worten („an 1 Gerät, 5 Entitäten“), Anleitung zum Anlegen nur einmal, Wirkungen in ruhigerer Schrift mit eingerückten Umbrüchen.
  - Sprung aus „Neue kritische Befunde“: Der Filter heißt wie die Zeile, und über der Liste steht „n Befunde an m Objekten“ statt „n von allen offenen Befunden“; ebenso beim Filter „Nach Updates“. „Anmeldung nötig“ nennt in der Übersicht keine Folgen mehr, die der Sprung nicht zeigt.
  - „In HA öffnen“ führt bei Szenen ohne Editor zur Geräteseite; „Entität öffnen“ gibt es auch für Szenen.
  - Bei einem ausgefallenen Gerät zeigt die Ursachendiagnose, dass alle Entitäten nicht verfügbar sind, statt „aktiv und stellt Entitäten bereit“; die Risiko-Zeile sagt, dass sie das Entfernen meint.
  - Recorder → Datenbank: Die Seite lädt auch beim direkten Aufruf oder Neuladen; der Export ist sofort da; das Wachstum steht mit Vorzeichen und seinem Anteil an der Größe; Sensoren in den Befunden öffnen ihre Seite; „Was tun?“ ist eingeklappt; der Prüfstatus nennt gefundene Schäden; die Kacheln oben werden am Handy nicht mehr abgeschnitten.
- **Backup-Schutz:**
  - Backups anderer Werkzeuge (zum Beispiel Google Drive Backup) stehen in der Tabelle als „Anderes Werkzeug“ statt „Manuell“, denn Home Assistant weiß nicht, ob sie geplant waren.
  - Die Ziele eines Backups stehen mit lesbaren Namen („Lokal“, „Netzwerkspeicher: …“, „Google Drive“) als Pillen statt als Kennungen; das Konto fällt weg.
  - Die Sicherung, die Housekeeper vor einem Eingriff anlegt, zählt nicht mehr als „Letztes Backup“ und nicht für Ziele, Größe oder Aufbewahrung, auch wenn sie die Datenbank enthält.

## 1.10.2 - 2026-10-19

### Behoben

- **Scan:**
  - Ein Konfigurationseintrag mit einer Zahl als Titel ließ den ersten Scan scheitern („'int' object has no attribute 'lower'“).
  - Eine Szene, die etwas anderes als Namen auflistet, lässt den Scan nicht mehr scheitern; bei einem Fehler steht im Debug-Protokoll, wo er auftrat.
  - „Scan starten“ bleibt nach einem Scan nicht mehr nicht verfügbar.
- **Backup-Schutz:** Backups anderer Werkzeuge (zum Beispiel Google Drive Backup) werden erkannt und zählen für die Prüfungen.

### Geändert

- **Diagnose:** Der Download enthält jetzt die Markierungen der Backups (ohne Namen), das hilft bei Meldungen zum Backup-Schutz.

## 1.10.1 - 2026-10-19

### Behoben

- **Inventar und Detailseite:** Enthält die Antwort einen Wert, den Home Assistant nicht als JSON senden kann („Invalid JSON in response“), lädt die Seite trotzdem (zum Beispiel ein ungewöhnliches Attribut einer Entität); das Protokoll nennt die betroffenen Stellen.

## 1.10.0 - 2026-10-18

### Neu

- **KI-Zugriff:**
  - Neuer Reiter Einstellungen → KI-Zugriff, standardmäßig aus: Programme und KI-Agenten, die Home-Assistant-Dienste aufrufen können (zum Beispiel ha-mcp), lesen Housekeeper über die Dienste `status`, `findings`, `object` und `audit`.
  - Ein zweiter Schalter „Merkliste ändern“ erlaubt `finding_decide`, `mark`, `note_set` und `undo`; es ändern sich nur Housekeepers eigene Listen, nie Home Assistant.
  - „Automatisch ausschalten“ wählst du mit Chips (Nie, 1, 8, 24 Stunden).
  - Grenzen gegen Schleifen: standardmäßig 200 Änderungen in 5 Minuten und 120 Lesezugriffe pro Minute, im Reiter einstellbar.
  - Ein Protokoll zeigt jeden Aufruf mit Benutzer und Ergebnis, Änderungen lassen sich dort zurücknehmen. Es ist eine Standard-Tabelle wie die anderen Listen: Suche, Filter nach Art, Sortierung, Seiten, Export (CSV, Markdown, JSON) und aufklappbare Zeilen mit den Parametern. Nur Administratoren, nie Geheimnisse.
- **Urlaubsmodus:** Eine Entität deiner Wahl (z. B. `input_boolean.urlaub`) schaltet Regeln „nur im Urlaubsmodus“ ein. Dazu gibt es Regeln für einzelne Geräte und Entitäten, eine Nachfrist nach dem Urlaub (Standard 24 Stunden) und eine Leiste, solange etwas zurückgehalten wird.
  - Ist noch nichts gewählt und gibt es einen Helfer wie `input_boolean.urlaubsmodus` oder `vacation_mode`, steht er als Vorschlag im Feld und gilt nach dem Speichern.
  - Eine Kalender-Entität kann ein Stichwort bekommen: Dann schaltet in deinem normalen Kalender ein Termin mit „Urlaub“ im Titel den Modus ein, auch wenn gleichzeitig andere Termine laufen. Ohne Stichwort zählt jeder Termin.
- **Ausnahmeregeln:** Unter Einstellungen → Ausnahmen nimmst du Objekte nach Bereich, Label, Integration oder Typ (z. B. Bereich „Lager“, alle `media_player`) aus. Die Regel blendet ihre Befunde aus oder meldet einen Ausfall erst nach einer einstellbaren Zahl Tage.
  - Die Regeln stehen mit einem Umschalter „Immer“ und „Im Urlaubsmodus“ in einer Tabelle, darunter der Urlaubsmodus.
  - Die Art „Alle Typen“ (vorgewählt) findet Bereiche, Labels, Integrationen, Geräte und Entitäten gleichzeitig; beim Speichern entsteht je Art eine Regel.
  - Die Kachel „Ausnahmen“ in den Einstellungen zeigt die Zahl der Regeln, die Zahl der ausgeblendeten Befunde und den Urlaubsmodus: an, aus oder „nicht eingerichtet“.

### Geändert

- **HACS und Marketplace:** Ab Home Assistant 2026.11 ist HACS als „Marketplace“ eingebaut. Housekeeper liest installierte Integrationen, Updates, archivierte und entfernte Repositories aus beiden.
- **In HA öffnen:** Bei Entitäten mit Gerät öffnet der Knopf die Geräteseite statt der ganzen Entitätenliste.
- **Links nach Home Assistant:** Alle Sprünge nach Home Assistant (Apps, Integrationen, HACS, Benutzer, Cloud) öffnen in einem neuen Tab statt im selben.
- **Schutzmodus:** Der Schutzmodus nennt die Wirkung statt der Stufe: „Alles erlaubt“, „Ohne endgültiges Löschen“, „Nur Quarantäne“, „Nur lesen“.
- **Einstellungen, Kacheln:** Die Kacheln stehen in neuer Reihenfolge (Schutzmodus, Ausnahmen, Scan und Meldungen, KI-Zugriff, Darstellung, Info) in drei Spalten. Jede Kachel zeigt ihren Stand, der Randstreifen folgt ihm (z. B. KI-Zugriff: aus grau, Lesen grün, Ändern gelb).
- **Oberfläche, Fehlermeldungen:** Fehler stehen überall im selben Kasten mit Symbol (Seiten, die nicht laden, und Formulare). Die schmale Fehlerzeile in den Speicherleisten ist ohne Fehler unsichtbar.
- **Updates:** Die ausstehenden Updates stehen in der gewohnten Tabelle mit Suche, Sortierung, Filter nach Bereich und Seiten.

### Behoben

- **Mehr Infos:** Beim Schließen des Dialogs „Mehr Infos“ bleibt das Panel auf der Detailseite, statt zurück zur Liste zu springen.
- **Kopieren:** Die Kopier-Knöpfe (z. B. „Angaben für eine Fehlermeldung kopieren“) funktionieren auch ohne HTTPS und melden einen Fehlschlag statt „Kopiert“.

## 1.9.0 - 2026-10-17

### Geändert

- **Wartung, Backups:**
  - „Backup-Schutz“ und „Backups aufräumen“ sind ein Reiter „Backups“; das Aufräumen steht eingeklappt ganz unten, die Zeile „Housekeeper-Backups“ führt dorthin.
  - Oben stehen ein Urteil (Belastbar, Erst ansehen, Problem) und vier Kennzahlen; die Prüfzeilen sind in vier Gruppen geordnet.
  - Neue Prüfungen: Inhalt des neuesten Backups (fehlgeschlagene Apps oder Ordner, fehlende Datenbank), Alter der Kopie je externem Ablageort und Platz fürs nächste Backup.
  - Eine Leiste zeigt die Größe der letzten Backups, so fällt Wachstum früh auf.
  - Fehlende Verschlüsselung lässt sich als gewollt bestätigen; die Zeile steht dann auf „In Ordnung“.
- **Journal:**
  - Das Journal hat Reiter: „Pläne“ und „Entfernte Geräte“ (bisher unter Wartung, jetzt mit einem Sprung zum Plan); ältere Löschungen von Statistiken stehen als dritter Reiter dort, wenn es sie gibt.
  - Ein Fehler beim Laden wird angezeigt statt „Noch keine Vorschau“, und die Seite hat „Aktualisieren“ und einen Zeitstempel.
  - Der Hinweis nennt die richtigen Grenzen (ausgeführte Pläne bis zu einem Jahr, höchstens 300).
  - Der Reiter „Entfernte Geräte“ heißt „Entfernt und gelöscht“ und zeigt auch entfernte Entitäten, gelöschte Automationen, Statistiken und Backups, mit Filter nach Art und dem Hinweis, was sich nicht rückgängig machen lässt.
- **Wartung, Updates:**
  - Der Reiter „Update-Preflight“ heißt jetzt „Updates“: ein Gesamturteil (Bereit, Erst ansehen, Stopp), die Prüfzeilen und die Liste der offenen Updates, gruppiert nach System, Apps, HACS und Geräten, mit Sprung nach Home Assistant.
  - Das Backup wird nach dem Backup-Schutz beurteilt (Zeitplan, letzter Lauf); neu ist die Zeile „Freier Speicher“; HACS-Updates, die HACS nicht installieren kann, sind gekennzeichnet.
  - Auf der Übersicht steht eine Zeile „n Updates offen“ (ohne Einfluss auf den Ring).
  - Ein Knopf prüft die Konfiguration (die Prüfung von Home Assistant, nur auf Knopfdruck); ist sie ungültig, steht das Urteil auf „Stopp“.
  - Die Liste ist übersichtlicher: jede Gruppe eine eigene Karte mit Anzahl, die Versionen als Chip, ruhige Knöpfe rechts, ein Ersatzsymbol, wenn Home Assistant kein Bild liefert.
- **Weniger CPU-Last:**
  - Zeitsteuerung und Code der Hintergrundarbeit sind optimiert.
  - Die Auswertungen aus der Recorder-Datenbank laufen seltener und verteilt, die Abfragen sind sparsamer (abgeschlossene Tage werden nur noch einmal gerechnet, unnötige Suchen entfallen), und Scans nach Ausfällen rücken bei langsamen Systemen weiter auseinander.
- **Speicher & System:** Die Seite lädt schneller: der Durchlauf über die Ordner läuft neben der Abfrage beim Supervisor statt danach, die Plattenbelegung nach Kategorien wird wie die Ordnergrößen einige Minuten wiederverwendet (Aktualisieren liest neu), und beim Öffnen stehen die zuletzt gelesenen Größen sofort da und werden bei Bedarf im Hintergrund erneuert.
- **Befunde, Anmeldung nötig:** Verlangt eine Integration eine neue Anmeldung, ist das ein Befund („Anmeldung nötig“, mindestens mittel) mit den betroffenen Entitäten als Folgen, auch wenn die Integration geladen bleibt. Er erscheint innerhalb etwa einer Minute und verschwindet nach der Anmeldung wieder. In „Was muss ich tun?“ steht er als eigene Zeile ganz oben.
- **Apps & Integrationen, offen in Home Assistant:** Über der Liste steht eine zugeklappte Info-Zeile mit den gefundenen Geräten, die noch auf ihre Einrichtung warten, und den Integrationen, die neu konfiguriert werden möchten. Sie ist ein Hinweis, kein Befund, und fehlt, wenn nichts offen ist.
- **Zuverlässigkeit:**
  - Integrationen, die den ganzen Zeitraum ausgefallen waren, stehen oben als „Ausgefallen“ (statt ohne Wert am Ende der Liste) und haben eine eigene Kachel.
  - Die Kachel „Ø je Integration“ zählt jede Integration einmal und lässt dauerhaft Ausgefallene weg; die Spalte heißt „Gemeinsame Ausfälle“, bei Integrationen mit weniger als drei Entitäten steht „zu klein“ statt einer 0.
  - Die Kacheln und Filter „Neue Anmeldung nötig“ und „Nicht geladen“ entfallen, die Anmeldung bleibt als Hinweis in der Zeile und führt zum Befund.
  - Neues Fenster „30 Tage“ (wie bei den Hausfunktionen); die Fußnote nennt die Farbgrenzen (grün ab 99,5 %, gelb ab 95 %) und dass die Tagesleiste einer Hausfunktion nach der Dauer färbt.
  - Die Detailseite einer Integration zeigt Kennzahlen, eine Tagesleiste mit den Ausfalltagen (wie bei den Hausfunktionen), die Ausfallzeiträume mit Beginn, Dauer und Zahl der betroffenen Entitäten und nennt die Hausfunktionen, die sich auf die Integration stützen; der Vergleich nennt seine Einheit (Prozentpunkte).
- **Zugangsdaten:**
  - Integrationen, die eine neue Anmeldung verlangen, tragen die Marke „Anmeldung nötig“ und haben eine eigene Kachel, ebenso deaktivierte Integrationen, die noch Zugangsdaten halten; mehr Feldnamen werden als Zugangsdaten erkannt (etwa Cookie, Session-ID, Einmalcode).
  - Neuer Reiter „Konten“ mit Rolle, Zwei-Faktor und letzter Anmeldung jedes Benutzers und eine Kachel „Admins ohne Zwei-Faktor“, ein Reiter „Langzeit-Tokens“ mit Name, Konto und Alter; die Kacheln stehen in gleich großen Reihen.
- **Übersicht, Inventarstatus:** Objekte mit einer Markierung (z. B. „Absichtlich offline“), auch die Entitäten eines markierten Geräts, stehen in einer eigenen Zeile „Markiert (erwartet)“ und zählen nicht mehr unter „Problematisch“ (Issue 25).
- **Oberfläche:**
  - Der Start-Hinweis ist eine kompakte Karte: vier Schritte als Leiste, „38 von 41 Integrationen geladen“ mit Balken und Wartezeit daneben, die Namen der noch ladenden Integrationen und beim Scan die aktuelle Phase.
  - Er aktualisiert sich selbst (alle 3 Sekunden) und verschwindet, sobald die endgültigen Befunde da sind.
- **Freigaben:**
  - Als sensibel gelten jetzt auch Kameras, Sirenen, Ventile und Türen.
  - Neue Warnung, wenn Google Assistant Schlösser, Alarmanlagen oder Tore ohne PIN öffnen darf, und ein Hinweis, wenn neue Entitäten automatisch an Alexa oder Google freigegeben werden.
  - Ein weiterer Hinweis nennt KI-Gesprächsagenten und den MCP-Server, die Home Assistant über Assist steuern dürfen und so die Assist-Freigaben an ein Sprachmodell oder verbundene Programme geben.
- **Zugriffe & Datenfluss:**
  - Mehr Integrationen werden erkannt, etwa Bluetooth und Thread als Funk, Frigate und UniFi Protect als Kamera, ESPHome und Matter als Netzwerk; Ollama gilt als lokal.
  - Integrationen aus HACS tragen „Fremdcode, volle Rechte“ und haben mindestens mittleres Risiko.
  - Bei den Apps: Schutzmodus aus (hohes Risiko), offene Ports am Host und eine Spalte zur Herkunft (offiziell, Community, lokal).
  - Neuer Reiter „Von außen erreichbar“: Nabu-Casa-Fernzugriff, Tunnel-, Proxy-, DynDNS- und VPN-Apps, der MCP-Server und offene Webhooks.

### Behoben

- **Oberfläche, Korrekturen:**
  - Ein Blueprint öffnet eine eigene Seite wie andere Objekte (mit „Zurück zu Wartung“ und Kopfkarte) statt unter den Wartungskacheln.
  - In der Liste der Erinnerungen steht der Aufklapp-Pfeil links neben dem Namen statt darüber.
  - Wartung: Untertitel und Hinweis nennen die Reiter richtig, jeder Reiter ist über die Suche zu finden, die Zahl am Reiter Blueprints steht schon beim Öffnen der Seite, es heißt „1 Hinweis“ und „3 Hinweise“, und der Reiter Wartungsziele zeigt einen Ladefehler und hat „Aktualisieren“.
  - Die Tabelle „Alle gezählten Läufe“ nimmt wie die anderen Listen die volle Breite.
  - Auf „Zugriffe & Datenfluss“ steht „Wie wird das gezählt?“ in der Liste wie auf den anderen Sicherheitsseiten statt als eigene Karte darunter.
  - Der Start-Hinweis zeigt nach dem Neuladen der Seite nicht mehr kurz die alten „5 Minuten“, sondern wartet auf die aktuelle Angabe.
  - Der Puffer von einer Minute fängt wegen einer kurz ladenden Integration nicht mehr mehrmals von vorn an.
  - Die Zeile „Beobachtung nach Update“ steht auf der Übersicht unter dem Gesundheitsring statt im Seitenkopf.
  - Der Info-Hinweis „ändert nichts von selbst“ oben auf der Befundseite entfällt; eine kurze Erklärung steht stattdessen unter „Über Housekeeper“ in den Einstellungen, die Zeile „Betriebsart“ entfällt dort.
  - Auf schmalen Bildschirmen (Handy) brechen Zeilen mit Knöpfen um, statt den Text auf eine Buchstabenspalte zu quetschen (z. B. der Hinweis zu den Ausfall-Stufen auf der Übersicht).
  - Die Zeilen der Blueprint-Liste lassen sich anklicken und öffnen eine Detailseite mit Übersicht, Eingaben, Nutzung (mit den dort gesetzten Werten) und Dateidaten.
  - Ein Wartungsziel führt zur passenden Liste mit gesetztem Filter (etwa „Defekte Referenzen“ zu den Befunden dieser Art).
  - Die Verfügbarkeit einer Hausfunktion zeigt Kennzahlen als Kacheln und eine Tagesleiste über die ganze Breite mit Achse; „1 Vorfälle“ heißt jetzt „1 Vorfall“.
  - In der Tagesleiste der Verfügbarkeit ist ein Tag mit weniger als 1 % Ausfallzeit bernsteinfarben statt rot; der Hinweis am Balken nennt die Dauer, darunter steht eine Legende.
  - Die Seite einer Hausfunktion ist kompakter: Kopf, Kennzahlen, Tagesleiste und die zugeordneten Objekte stehen in einer Karte, Scan und Prüfung in einer Zeile unter dem Namen. Die Objekte sind eine Tabelle mit Seiten (zunächst 10 pro Seite).
  - Das Bearbeiten einer Hausfunktion ist aufgeräumter: Allgemeines, Objekte, Suche und Vorschläge stehen in einer Karte, Vorschläge sind „+“-Knöpfe, Entfernen ein X. „Löschen“ ist wie überall der weich rote Knopf (auch bei Notizen). „Speichern“ bleibt aktiv und sagt, was fehlt.
  - Recorder: Die Reiter heißen „Schreiblast“ (wie oft etwas geschrieben wird), „Speicherbedarf“ (wie viel Platz jede Entität belegt) und „Datenbank“.
  - Recorder: „Empfohlen“ zum Ausschließen entscheidet in Schreiblast und Speicherbedarf dieselbe Regel (nirgends verwendet, keine Statistik, mindestens 100 Zeilen in den letzten 24 Stunden); vorher konnte eine Entität im einen Reiter empfohlen sein und im anderen nicht.
  - Recorder, Datenbank: Größe, Zuwachs pro Tag, Aufbewahrung und „Automatisch löschen“ stehen als Kacheln über der Liste statt in einer Textzeile darunter; was sich nicht messen lässt (etwa bei MySQL), steht weiter als kurzer Hinweis.
  - Recorder, Schreiblast: neues Fenster „30 Tage“ neben 24 Stunden und 7 Tagen.
  - Hinweistexte zu Konflikten, Backup-Zielen und Statistik-Nachfolgern sagen nicht mehr „Vermutung“, wo „mögliche“ schon dasteht.
  - Läufe: Die Fußnote „So wird gezählt“ nennt jetzt die Grenzen der Hinweise (Fehler, nie erfolgreich, Überschneidung, ohne Wirkung, sehr oft, lange Läufe) mit den Zahlen aus dem Backend.
  - Der Kurzüberblick einer Integration („Bekannt“) zeigt „Neue Anmeldung offen“ statt „Geladen“, wenn Home Assistant eine neue Anmeldung verlangt.
  - Zuverlässigkeit und Schreiblast: Behält der Recorder weniger Tage, als das gewählte Fenster umfasst, steht ein Hinweis, dass die Zahlen nicht weiter zurückreichen.
  - Apps & Integrationen: Der Pfeil zum Aufklappen steht neben dem Namen statt darüber; alle Namen beginnen auf einer Linie.
  - HACS: Housekeeper liest jetzt alle installierten Repositories (auch Karten und Themes) und erfährt aus den Reparaturen von Home Assistant, welche HACS aus seiner Liste genommen hat.
  - Apps & Integrationen: Neuer Reiter „HACS“ mit allen installierten Repositories (Integrationen, Karten, Themes), Version, offenem Update und dem Hinweis, wenn HACS ein Repository aus seiner Liste genommen hat oder es archiviert ist. Eine Zeile öffnet das Repository in HACS.
  - HACS: Wurde ein Repository aus HACS entfernt, steht in „Was muss ich tun?“ eine Zeile dazu, auf der Integrationsseite der Grund und im Reiter HACS eine Anleitung mit Link zu den Reparaturen. Eine ignorierte Reparatur zeigt der Reiter als „ignoriert“.
  - Freigaben, Datenfluss, Zugangsdaten und Läufe zeigen im Menü eine Zahl, wenn dort etwas anzusehen ist (der Scan zählt sie).
- **Zugriffe & Datenfluss:** Integrationen, deren Tracker nur die Anwesenheit über Router oder Bluetooth melden (etwa die FRITZ!Box), gelten nicht mehr als „Standort“ mit hohem Risiko, sondern zeigen „Anwesenheit im Netz“.
- **Freigaben:** Alexa und Google Assistant, die in den Nabu-Casa-Einstellungen ausgeschaltet sind, zählen nicht mehr als „freigegeben“ und erzeugen keine Befunde; ihre Kachel zeigt „in Nabu Casa ausgeschaltet“.

## 1.8.2 - 2026-10-16

### Geändert

- **Oberfläche, Knöpfe:** Knöpfe, die einen Plan anlegen, heißen einheitlich „Vorschau erstellen (N)“; wer Daten löscht, heißt „Löschen vorbereiten (N)“ und ist dezent rot.
- **Oberfläche, Plan-Vorschau:** „Aus dem Recorder löschen“ führt direkt in die Vorschau. Die Wahl „Auch die gespeicherten Zustände löschen“ ist dort ein hervorgehobener Schiebeschalter unten (an, nur bei Plänen, die Statistiken löschen). „Erwarteter Endzustand“ ist hervorgehoben, nennt Statistik und Rohdaten getrennt und zeigt „bleiben bestehen“-Zeilen nur, wenn sie nicht 0 sind. Das Kästchen „zur Kenntnis genommen“ entfällt: Das Bestätigen-Popup ist die Bestätigung. „Abbrechen“ verwirft die Vorschau ganz und speichert sie nicht im Journal.

### Behoben

- **Start, Anlaufphase:** Sie endet eine Minute, nachdem keine Integration mehr lädt (spätestens nach 5 Minuten), statt immer 5 Minuten zu laufen. Das Banner nennt die Zahl der ladenden Integrationen oder den Sicherheitspuffer.
- **Oberfläche, Korrekturen:** „In HA öffnen“ (Befundseite, HACS-Knöpfe) öffnet Home Assistant in einem neuen Tab statt im selben. Das Schließen des Dialogs „Mehr Infos“ lässt die Seite, auf der man ist. „Ausgewählte zusammenführen“ ist bei mehr als 10 Plänen gesperrt (statt mit Serverfehler abzubrechen).

## 1.8.1 - 2026-10-16

### Geändert

- **Oberfläche:**
  - Befunde: „Entität öffnen“ im Menü „⋯“ und auf der Detailseite öffnet den Dialog „Mehr Infos“ von Home Assistant („In Home Assistant öffnen“ heißt jetzt „In HA öffnen“). Die Seite sagt oben, dass Housekeeper nichts von selbst ändert (schließbar).
  - Befundseite: Die Kacheln zählen alles samt Folgen und nennen die Folgen daneben. Die Chips „Gruppiert | Einzeln“ ersetzen „Alle einzeln“. „Nur Ursachen mit Folgen“ gilt in beiden Ansichten. Listen außerhalb der Befundseite zeigen keine Auswahlkästchen mehr. Die Kachel „Nicht verfügbar“ der Übersicht öffnet die Befunde gefiltert.
  - Plan: Ein neuer Plan öffnet sich auf einer eigenen Seite mit „← Zurück zu …“ und geht direkt in die Vorschau. Vier Stufen (Prüfen, Bestätigen, Ausführen, Ergebnis) in einer Leiste, die laufende Stufe ist offen. Verbietet der Schutzmodus den Plan, sagt die Seite es vor dem Bestätigen und verlinkt die Einstellung.
  - Journal: „Ausgewählte löschen“ entfernt mehrere Vorschauen auf einmal (ausgeführte Pläne bleiben). Nie gestartete Vorschauen werden nach 24 Stunden von selbst entfernt.
  - Tabellen: Unter „vor 1.119 Tagen“ steht der genaue Zeitstempel in kleiner Schrift (bei kompakten Zeilen ausgeblendet).
  - Aufräumen: Die Kachel „Nicht verwendet“ steht zuletzt und nennt sich einen Hinweis.
  - Logbuch: „Ins Logbuch eintragen“ im Menü „⋯“ eines Befunds; Objekte der Beobachtung ohne Befund bekommen dasselbe Menü.
  - Beobachtung nach Updates: Neue Reparaturen zeigen Titel, Schweregrad und Link. Die Gruppen „Wieder in Ordnung“ zeigen nicht mehr den heutigen Zustand. Ereignisse derselben Art, die kurz aufeinander folgen, sind ein Eintrag mit Anzahl.

### Behoben

- **Oberfläche, Korrekturen:** Das Häkchen „zur Kenntnis genommen“ im Plan löscht die Fehlermeldung, und „Bestätigen“ ist mit Hinweis gesperrt, solange kein Schritt ausgeführt würde. Auswahlkästchen stehen nur noch in der Befundliste, wo die Leiste für die Aktionen ist. Objekte ohne Befund haben dasselbe Zeilenmenü, und „Ins Logbuch eintragen“ heißt nicht mehr wie „Vermerk setzen“. Die Gruppen der Beobachtung über die Vergangenheit zeigen nicht mehr Befunde mit dem heutigen Zustand.
- **Scan bei ungewöhnlichem Skript:** Kann Home Assistant die Verweise eines Skripts oder einer Automation nicht lesen (zum Beispiel wegen eines Dicts in einer `entity_id`-Liste), nutzt Housekeeper für dieses Objekt nur dessen Konfiguration und warnt im Log, statt den ganzen Scan abzubrechen (Issue 19). Die Warnung zu `device_registry.devices` im Log entfällt (Issue 22).

## 1.8.0 - 2026-10-15

### Neu

- **Stand beim Start eines Updates:** Beginnt ein Update von Home Assistant, Betriebssystem oder Supervisor, scannt Housekeeper sofort. Die Beobachtung danach vergleicht mit diesem Stand statt mit dem letzten planmäßigen Scan.

- **Reparaturen nach Updates:** Die Beobachtung nach einem Update meldet auch Reparaturen, die seitdem neu aufgetaucht sind, und zählt sie als Verschlechterung.

- **Backup-Liste mit Details:** Die Liste zeigt bis zu 20 Backups (10 pro Seite, wählbar) mit Art (automatisch, manuell, von Housekeeper) und Inhalt. Eine Zeile klappt auf: Name, HA-Version, Datenbank, Apps, Ordner, Größe je Ziel und fehlgeschlagene Teile.

- **Zustand als Anteil der Objekte in Ordnung:** Der Status zählt jetzt Objekte statt Punkte. Ausgangswert ist die Zahl der geprüften Objekte, jedes Objekt mit Befund nimmt nach seiner schlimmsten Stufe ab (hoch voll, mittel halb, niedrig ein Fünftel, Info nichts), Folgen einer Ursache zählen nicht extra. Es gibt keine Obergrenzen mehr, jede Behebung zählt. Die Karte „Wie entsteht die Zahl?“ zeigt zum Beispiel „1575 von 2000 in Ordnung“, Ring und Kurve zeigen den Anteil. Der Verlauf des Zustands beginnt neu.

- **Ausfälle nach Dauer:** Nicht verfügbare Entitäten, Geräte, Integrationen und Apps werden nach 15 Minuten zum Befund und steigen mit der Dauer (Info, niedrig, mittel, hoch). Info und niedrig stehen nur auf der Befundseite; Übersicht, Sensoren und Reparaturhinweise zählen ab mittel. Die Einstellung „Nicht verfügbar nach Tagen“ ist durch vier einstellbare Schwellen ersetzt (ein alter Wert wird übernommen, bis du die neuen speicherst). Bei einem Ausfall scannt Housekeeper zu den Schwellen zusätzlich, ohne den Verlauf zu verändern. Entitäten werden dadurch viel früher gemeldet als bisher nach 7 Tagen.

- **Bewertung und Hinweise:** Die Detailseite zeigt die Bewertung eines Befunds mit Gründen und nächster Stufe. Fällt ein Objekt regelmäßig aus, nennt der Befund die übliche Tageszeit und schlägt einen Vermerk mit Zeitfenster vor.

- **Befundseite:** Eine Erklärung hinter der Überschrift, Kacheln in drei Gruppen, die wie die Liste zählen (die Kurven ebenfalls, ohne Folgen), ein Schweregrad für jeden Befund (Info zieht nichts ab), Folgen eingerückt unter ihrer Ursache, die Größe der Ansicht in der Auswahlzeile und die Filter „Alle einzeln“ und „Ursachen mit Folgen“ mit Anzahl. Auf dem Reiter „Technisch“ stehen Labels bei allen Objekten.

- **Nach Updates und Neustarts:** Eine Karte auf der Befundseite zeigt, was nach einem Update oder Neustart begann, eine Zeile je Vorfall; zeitlich zusammenliegende Updates bilden einen Vorfall. Die Beobachtung nach einem System-Update steht in der Zeile des Vorfalls, mit Urteil (Läuft, Verschlechtert, Stabil), getrennt nach dem, was seitdem nicht mehr läuft, und den Befunden, die dabei begannen. Sie startet nur noch bei Updates von Home Assistant, Betriebssystem und Supervisor, lässt sich vorzeitig beenden (mit Rückfrage; sie wird dann mit den bisherigen Messungen ausgewertet) und das Band im Seitenkopf führt zu ihr. Ein Filter zeigt nur die Befunde, die mit einem Update begannen.

- **Scan alle 6 Stunden:** Der Standard für den automatischen Scan ist 6 statt 24 Stunden (einstellbar; ein selbst gesetzter Wert bleibt). Der Verlauf behält einen Punkt pro Tag.

- **Schutz der Datenbank:** Vor dem Löschen im Recorder prüft Housekeeper die Datenbank vollständig (auch auf Wunsch und nach dem Löschen) und meldet einen Schaden als Befund und Reparaturmeldung, mit Hinweis auf `REINDEX` und das Backup (Issue 12). Dazu kommen Hinweise auf beiseitegelegte Datenbanken, wenig Speicherplatz und unsauberes Herunterfahren; Pläne warten auf einen ruhigen Recorder. Gelöscht wird dabei nichts.

- **Sicherere Pläne:** Das Backup vor einem Plan wird geprüft und mit Namen genannt. Veraltete Vorschauen sind markiert und lassen sich erneuern, große Löschungen zeigen einen deutlichen Hinweis, und zu viele Housekeeper-Backups werden gemeldet. Eine unlesbare Speicherdatei lässt nur ihren Teil leer starten.

- **Export überall:** Die Recorder-Seite hat einen Export-Knopf (CSV, Markdown, JSON) für alles, was ein Reiter zeigt. Alle Listen nutzen jetzt dasselbe Export-Menü statt des Download-Symbols.

- **Sieben neue Farbschemata:** Aurora, Honig, Lagune, Smaragd, Frost, Mitternacht und Olive, jeweils in Hell und Dunkel. Die Kacheln der Auswahl sind kleiner, „Lesbarkeit“ steht jetzt rechts.

### Geändert

- **Update-Preflight nur noch für vorher:** Der manuell gespeicherte Ausgangszustand und der Vergleich danach entfallen. Die Karte prüft den Zustand vor einem Update und sagt unten, was danach geschieht: Die Beobachtung nach Updates übernimmt das Nachher.

- **Wartungsfenster entfernt:** Das experimentelle, standardmäßig ausgeschaltete Wartungsfenster unter Wartung gibt es nicht mehr. Wer es eingeschaltet hatte, verliert den gespeicherten Stand. Nach einem Update zeigt die Beobachtung, was seitdem ausfiel.

- **Oberfläche:** Korrekturen und kleine Verbesserungen an Listen, Dialogen, Beschriftungen und Bedienung, darunter ein geöffnetes Panel, das neue Scans im Hintergrund selbst übernimmt (vorher zeigte die Übersicht danach alte Zahlen), die Kacheln der Befundseite (auf breiten Fenstern in zwei Zeilen, alle gleich hoch und breit), die Spaltenauswahl der Listen (Kästchen in einer Reihe am rechten Rand), die Karten der Schwellen unter Einstellungen (gruppiert, einheitlich aufgebaut, mit Link „Standard“), die Ereignisse für eigene Automationen als Tabelle mit Kopier-Knopf, die Wartungsziele (nur noch unter Wartung, nicht mehr doppelt in den Einstellungen), die Liste der letzten Backups (Pfeil neben dem Datum, Details ausgerichtet), die Einstellungen mit vier statt sieben Reitern (Darstellung, Scan und Meldungen, Schutz und Ausnahmen, Info); Speichern der Schwellen lässt die Seite offen, statt zum Home-Assistant-Dashboard zu springen und die Lesbarkeit der Vorfälle.

### Behoben

- **Nicht eingelöste Bestätigungen:** Abgelaufene Bestätigungen werden jetzt vergessen und sammeln sich nicht mehr im Speicher (Issue 18).

- **Bestätigung gehört dem Administrator, der sie erteilt hat:** Ein anderer Administrator kann sie nicht mehr einlösen, und im Verlauf steht immer der, der bestätigt und gestartet hat (Issue 17).

- **Löschen von Statistiken nur noch über einen Plan:** Ein alter Befehl löschte verwaiste Statistiken ohne Vorschau und Bestätigung. Das Panel nutzte ihn nicht mehr; er ist entfernt (Issue 16).

- **Backup-Prüfung:** Backups einzelner Apps, etwa vor einem App-Update, zählen nicht mehr als Backups von Home Assistant.

## 1.7.0 - 2026-10-14

### Neu

- **Hausfunktionen:** Wichtige Funktionen des Hauses aus direkt gewählten Entitäten, Geräten, Automationen, Szenen, Skripten, Integrationen und Apps/Add-ons zusammenstellen. Die gemeinsame Objektsuche gruppiert Treffer nach Typ und schlägt bekannte Abhängigkeiten vor; nur ausdrücklich hinzugefügte Objekte werden überwacht. Für Entitäten lassen sich Aktualisierungsfrist, Mindestwert und eine Dauer für „nicht verfügbar“ festlegen. Der kompakte Editor hat eine mitwachsende Beschreibung, zeigt eine Vorschau der letzten Scanbewertung und lässt Funktionen vorübergehend deaktivieren. Die Seite unterscheidet belegte Defekte, Prüflücken, unauffällige und deaktivierte Funktionen; die Übersicht meldet aktive Probleme und nennt sonst die zuletzt beeinträchtigte Funktion. Zustandswechsel stehen als HA-Ereignis und Event-Entität bereit, jede Funktion hat einen Sensor, dessen Attribute auch letzten Defekt, Vorfälle, Ausfallminuten und Verfügbarkeit der letzten 30 Tage nennen. Dauerhafte HA-Mitteilungen sind pro Funktion einstellbar. Zugeordnete Objekte sind anklickbar, auch beim Anlegen und Bearbeiten. Jede Funktion hat einen Verlauf mit Zustandswechseln und Änderungen (mit Suche, Filter und Seiten, auch Pläne zu den Objekten; schnelles Hin und Her wird zu einer Zeile zusammengefasst) und zeigt die Verfügbarkeit der letzten 30 Tage mit Vorfällen und einem Feld je Tag; die Aufbewahrung (1 bis 365 Tage, Standard 30) gilt auch für den Scan-Verlauf und steht unter Einstellungen.

- **Vermerk mit Zeitfenster:** Ein Vermerk wie „Absichtlich offline“ gilt auf Wunsch nur zu festen Uhrzeiten oder bei Dunkelheit (Sonnenstand aus Home Assistant), mit einer Anlaufzeit danach (Standard 30 Minuten). Außerhalb des Fensters wird das Objekt wieder überwacht, zum Beispiel ein solarbetriebener Gartensensor tagsüber.

- **Beobachtung nach Updates:** Nach einem Update von Home Assistant oder einer Integration scannt Housekeeper einen Tag lang zusätzlich (30 Minuten, 2 und 6 Stunden danach und am Ende) und vergleicht mit dem Stand vor dem Neustart. Ein Band zeigt, solange es läuft, wie viele Objekte betroffen sind; die Karte auf der Befundseite nennt, was seither ausfiel, kurz gestört war oder wieder läuft, und sagt „unbekannt“, wenn ein Vergleich nicht möglich ist. Das ist ein zeitlicher Zusammenhang, keine Ursache. Dauer unter Einstellungen (0 schaltet aus).

- **Eigener Update-Status:** Unter Einstellungen, Info vergleicht Housekeeper seine tatsächlich geladene Version mit dem Stand von HACS. Die Karte erkennt ein verfügbares Update, abweichende oder fehlende HACS-Daten und besonders eine frühere Commit-Installation, bei der HACS den Wechsel auf Releases übersehen kann. Sie erklärt den passenden nächsten Schritt und öffnet das Housekeeper-Repository direkt in HACS; GitHub wird dafür nicht zusätzlich abgefragt.

- **Entitäten im Inventar gesammelt umschalten:** Die Entitätenzeilen des Inventars haben ein Kästchen. Die Leiste darüber deaktiviert, aktiviert, blendet aus oder ein, bis zu 200 Entitäten pro Plan, mit Vorschau und Rückgängig. Eine Entität, die etwas sicher benutzt, wird nicht deaktiviert; nur selbst Deaktiviertes wird wieder aktiviert.

### Behoben

- **Oberfläche:** Korrekturen und kleine Verbesserungen an Listen, Tabellen, Dialogen und der Bedienung: einheitlichere Listen und Tabellen auf allen Seiten (Suche, Sortierung, Filter, Seiten und CSV-Export, die ganze Zeile klickbar, kompakte Zeilen), Seitenauswahl im Inventar, ein Reiter „Aktionen“ mit festem Aufbau für alle Objekte (auch Apps), Pläne in einem Schritt bestätigen oder abbrechen, ein Menü „Exportieren“ im Inventar (Liste als CSV oder geführter Export), Spaltenauswahl mit Name links und Kästchen rechts, sauber ausgerichtete Aktionen sowie bessere Tastatur- und Screenreader-Unterstützung.

- **Speicher und System:** Die Messung der Ordner stoppt nach 20 Sekunden (etwa bei einer langsamen Netzfreigabe unter /config); die Seite nennt die Größen dann Mindestwerte.

- **Ausfälle:** Die Detailseite einer ausgefallenen Integration nennt, wie lange der Ausfall dauert und wann er schwerer wiegt.

- **Fehlender Blueprint:** Eine Automation oder ein Skript, dessen Blueprint nicht mehr existiert, wird als Befund gemeldet; fehlt er für mehrere, steht er als gemeinsame Ursache in der Liste. Die Blueprint-Seite zählt solche Pfade jetzt auch.

- **Scan von außen starten:** Neuer Dienst `ha_housekeeper.scan` (mit „Auf das Ende warten“ liefert er die Zahlen zurück) und ein Knopf „Scan starten“ für Dashboards. Mehrere Aufrufe ergeben einen Scan, kurz nach einem Scan startet keiner, und während eines Plans oder beim Start von Home Assistant wird abgelehnt.

## 1.6.0 - 2026-10-13

### Geändert

- **Aufklapp-Pfeile einheitlich:** Alle aufklappbaren Bereiche („Wie wird das gezählt?“, Dateigruppen, Details) haben denselben kleinen Pfeil, der nach rechts zeigt und sich beim Öffnen nach unten dreht, statt des groben Standard-Dreiecks.

- **Listenleiste ruhiger:** Die Suche ist 200 px breit, der Filter heißt „Schweregrad“ (Hoch, Mittel, Niedrig, Info, Keine) und die Sortierung zeigt ihre Richtung im Eintrag („Schweregrad ↓“). Gespeicherte Ansichten sind ein Stern-Knopf mit Auswahl, Löschen je Eintrag und „Ansicht speichern“. „Kompakte Zeilen“ wirkt jetzt auch in der Befundliste.

- **Ausfälle von Integrationen mit Schweregrad nach Dauer:** Eine nicht geladene Integration ist sofort ein Befund und wartet nicht mehr, bis die „Mindestdauer nicht verfügbar“ (Standard 7 Tage) vorbei ist. Die Dauer bestimmt die Auswirkung: unter 1 Stunde „Info“, ab 1 Stunde „Niedrig“, ab 1 Tag „Mittel“, ab der Mindestdauer „Hoch“. Neu ist die Stufe „Info“ (1 Punkt, höchstens 5); „Niedrig“ und „Mittel“ ziehen jetzt 2 und 3 Punkte statt 1 und 2 ab. Dadurch springt der Punktestand einmalig. In der Liste trägt jede Zeile ihre Auswirkung als Chip und ein „⋯“-Menü mit „Als bekannt markieren“, „Zurückstellen“, „Befund ausblenden“ (und „Löschen vorbereiten“, wo es passt); die breiten Knöpfe unter den Ausfällen und der Einzelknopf „Löschen vorbereiten“ entfallen. Im Detail stehen dieselben Aktionen jetzt auch bei Ausfällen. Die Zeile eines Ausfalls nennt nur noch, was betroffen ist und wie lange er dauert („seit 6 Std. · Mittel in 18 Std.“); Zustand und Fehlertext stehen im Detail. Jede Zeile hat zwei Chips: den Grund (grauer Umriss, zum Beispiel „Ausfall“, „Ungenutzt“) und die Auswirkung (farbig, Hoch rot bis Info grau); das Datum entfällt in der Zeile. Die Filter „Typ“ und „Auswirkung“ gelten jetzt auch für Ausfälle; neu ist der Filter „Grund“ (mit „Ausfall“ als eigener Kachel). Die Kachel „Housekeeping-Status“ der Befunde-Seite entfällt; ihr Verlauf („−27 in 2 Tagen“) steht in der Übersicht unter der Überschrift, der Link „Wie entsteht die Zahl?“ ist weg.

### Neu

- **Vollständige Prüfung nur noch als Hinweis:** Wurden alle Quellen gelesen, entfällt die Leiste „Prüfung“ in der Übersicht. Stattdessen steht „Prüfung vollständig“ in der Statusleiste unter dem Menü (ein Klick öffnet die Liste). Bei einer Lücke bleibt die gelbe Leiste.

- **Prüfung nennt nicht lesbare Dashboards:** Unter „Was zuletzt geprüft wurde“ steht bei Dashboards jetzt, welche nicht gelesen werden konnten und warum („Konfiguration ungültig“, „Konnte nicht geladen werden“). Ein Dashboard, das Home Assistant automatisch erzeugt und nie gespeichert wurde, gilt nicht mehr als Lücke. Jede gelesene Quelle nennt außerdem ihre Menge („412 Entitäten, 58 Geräte“).

- **Lücken in der Prüfung werden nachgeholt:** Konnte ein Scan eine Quelle nicht vollständig lesen (etwa Dashboards, weil Lovelace noch nicht bereit war), startet Housekeeper nach 5 Minuten einen neuen Scan, höchstens dreimal hintereinander. Die Leiste „Prüfung“ sagt dazu, dass es noch einmal versucht wird. Fehlt eine Komponente ganz, wird nicht wiederholt.

- **Vermerk für mehrere Objekte:** Die Auswahlleiste der Befunde hat den Knopf „Vermerk setzen“. Er setzt Art, Begründung und Prüffrist in einem Zug an allen angekreuzten Entitäten, Geräten, Integrationen und Apps; andere Objekte in der Auswahl (zum Beispiel Automationen) bleiben unberührt.

### Behoben

- **Backup vor dem Löschen ohne eingerichtete Backups:** Wer in Home Assistant noch keine automatischen Backups eingerichtet hat, musste dafür erst ein Backup-Ziel und einen Verschlüsselungsschlüssel anlegen. Housekeeper sichert jetzt in den lokalen Speicher von Home Assistant, ohne Passwort. Die Vorschau und der Backup-Schritt sagen, dass es lokal und unverschlüsselt liegt. Ein abgebrochener Plan nennt den Grund im roten Band („Es wurde nichts gelöscht und nichts geändert“).

- **„Szene fehlt“ bei Szenen, die eine Automation selbst anlegt:** Legt eine Automation oder ein Skript die Szene mit `scene.create` an, nennt der Befund das jetzt: Die Szene existiert erst nach dem ersten Lauf.

- **Richtlinien und andere Ansichten nach „Neu scannen“:** Die Liste der betroffenen Entitäten blieb nach einem neuen Scan auf dem alten Stand, bis man die Seite neu lud. Richtlinien, Freigaben, Automations-Qualität und Blueprints laden nach einem neuen Scan jetzt selbst neu (Issue #11).

- **Menü auf schmalen Fenstern:** Die geöffnete Menüliste ist höher als das Fenster, etwa bei großer Schrift, und scrollt jetzt, sodass auch die unteren Einträge erreichbar sind (Issue #10).

- **Sortierrichtung:** Bei gleichen Werten drehte der Pfeil „Aufsteigend/Absteigend“ die Reihenfolge nicht um; jetzt dreht er die ganze Liste.

- **Befunde:** Wer einen Status wie „Neu“ oder einen Filter wählte, sah die Ausfälle von Integrationen nicht, obwohl sie mitgezählt wurden. Sie stehen jetzt als eigene Zeilen in der Liste.

## 1.5.1 - 2026-10-12

### Geändert

- **Kompaktere Menüleiste:** Damit die Leiste oben schmaler wird und seltener in den „Menü“-Knopf wechseln muss, ist sie umgebaut: „Housekeeper“ mit dem Wort „Übersicht“ darunter ist jetzt der Weg zur Übersicht und ersetzt den Menüpunkt „Übersicht“, und die Einstellungen sind in der Leiste nur noch das Zahnrad (der Name steht als Tooltip und in der Liste des Menü-Knopfs). Das Suchfeld ist dafür etwas breiter.
- **Befunde als eine Liste:** Die Befunde-Seite hat keine getrennten Gruppen „Ausfälle“ und „Einzelne Befunde“ mehr. Jede Zeile ist ein Objekt mit seinem Typ; wer Folgen hat, trägt einen roten Zähler („12 Folgen“, darunter „erklärt 12 weitere Befunde“) und klappt seine Kette auf: App, Integration, Gerät, Entitäten, jeweils mit eigenem Zähler. Der Filter „Mit Folgen“ zeigt nur diese Einträge, „Flache Liste“ zeigt jeden Befund einzeln und nennt bei Folgen die Ursache („Folge von …“).
- **Übersicht „Was muss ich jetzt tun?“ in drei Bereichen:** **Befunde** zeigt die ersten fünf Einträge derselben Liste wie die Befunde-Seite (eine Kette als eine Zeile mit rotem Zähler, „Alle Befunde (n)“ führt zur Liste), **Zustand** Backup, Datenträger und veralteten Scan (dringende Punkte ziehen im Status ab) und **Wartung** Ziele, Erinnerungen und Quarantäne: nie dringend, eingeklappt mit Zahl, solange etwas anderes ansteht. Verfehlte Ziele stehen in Klartext („Schwache Batterien: jetzt 2 · erlaubt: keine“, Ziel verfehlt). Bereiche ohne Zeilen fehlen.
- **Reiter „Erledigt“:** „Zuletzt behoben“ heißt jetzt „Erledigt“ und zeigt Ereignisse statt Objekte, für 7, 30 oder 90 Tage: „Durch einen Plan behoben“ (mit Art der Änderung, Zahl der Objekte, Zeitpunkt und ob sie rückgängig zu machen ist) und „Von selbst beendet“. Dort stehen Befunde, die ohne Plan verschwanden: „Von selbst wieder in Ordnung“ zählt als erledigt, „Objekt entfernt“, „Quelle nicht gelesen“ und „Grund unbekannt“ nicht, denn dort ist nichts behoben. Die Zahl der Objekte eines Plans ist nicht mehr auf 300 begrenzt.
- **Status als Punktestand:** Der Housekeeping-Status ist jetzt ein Punktestand von 100. Jeder Eintrag der Befundliste nimmt je nach Auswirkung Punkte weg (hoch 5, mittel 2, niedrig 1, mit Obergrenze), dringende Zustandsthemen wie Backup oder ein fast voller Datenträger je 10; Folgen eines Ausfalls zählen nicht extra. Grün ab 90, gelb ab 70, darunter rot; ein Eintrag mit hoher Auswirkung färbt den Ring mindestens gelb. Die Zahl der Objekte mit Befund steht daneben, ein Klick auf den Ring zeigt die Rechnung. Der neue Wert ersetzt den alten ohne Übergang: Die Kurve der Übersicht macht an dieser Stelle einen Knick.
- **Speicher und Laufzeit:** Die Seite „Speicher & System“ liest die Ordnergrößen nicht mehr bei jedem Aufruf neu: ein Ergebnis wird bis zu 5 Minuten wiederverwendet, auch für mehrere Browser, und „Aktualisieren“ liest erst nach 30 Sekunden erneut. Die Seite zeigt, wann die Größen gemessen wurden. In Einstellungen, Info steht die Dauer des letzten Scans je Phase, die längste zuerst.
- **Detailseiten:** Was du über ein Objekt entschieden hast, steht jetzt in einem Band über den Reitern: ein als bekannt, zurückgestellt oder ausgeblendeter Befund mit Art, Frist und Grund (mit „Wieder aufnehmen“) und ein Vermerk (mit „Ändern“ und „Entfernen“). Die Karte „Bekannt über …“ nennt dieselbe Entscheidung statt „Der Befund ist ausgeblendet“.
- **Änderungen:** Der Verlauf der Scans zeigt zunächst nur die neuesten Zeilen, damit das Ergebnis des Vergleichs sichtbar bleibt; „Alle anzeigen“ öffnet die ganze Liste. Die Auswahl „Vergleichen mit“ sitzt im Kopf des Verlaufs, gespeicherte Scans tragen den Wochentag im Titel, und ein Satz erklärt den Balken.
- **Ende eines Befunds:** „Behobene Befunde“ zählt nur noch Befunde, deren Objekt weiter existiert. Verschwindet ein Befund, weil sein Objekt entfernt wurde, die Prüfung (zum Beispiel eines Dashboards oder der Apps) nicht lesen konnte oder sich eine Einstellung wie die Ausfalldauer geändert hat, steht er in einer eigenen Rubrik „Ohne Reparatur beendet“ mit dem Grund. Die Zahl „behoben“ kann dadurch kleiner ausfallen als bisher.
- **Kacheln der Unterseiten:** Aufräumen, Recorder und Apps & Integrationen zeigen unter der Beschreibung eine Zeile mit Hinweisen (zum Beispiel „2 mit Problem“, „9,5 GB“, „751 mit Statistik“). Die Kacheln sind dadurch gleich hoch und springen beim Laden nicht mehr; lange Beschreibungen enden mit „…“. In Aufräumen teilen sich die letzten zwei Kacheln die Zeile, und die Zahlenzeile von „Nicht verwendet“ ist in die Kachel gewandert.
- **Apps & Integrationen:** Die obere Kennzahlenreihe entfällt. Die drei Kacheln (Apps, Core, Custom) sind breiter, der Text bricht nicht mehr um, und sie tragen die Hinweise selbst: laufende Apps, belegter Platz, Updates und Integrationen mit Problem.
- **Bestand:** In der Ansicht „Nach Objekttyp“ hebt der Ring den Abschnitt hervor, über dem die Maus liegt oder dessen Tabellenzeile sie berührt; umgekehrt leuchtet die Zeile auf, wenn die Maus auf dem Ringabschnitt liegt.
- **Recorder, Datenbank:** „Fehlende Stunden in Statistiken“ ist verständlicher: ein kurzer Satz sagt, ob die Lücken alle Sensoren oder nur einzelne betreffen, darunter steht offen die Liste „Sensoren mit den meisten Lücken“ als sortierbare, durchsuchbare Tabelle wie die anderen Listen (Spalte „Gemeinsame“ nur, wenn es gemeinsame Lücken gibt).
- **Läufe:** Die Liste „Alle gezählten Läufe“ ist auf großen Bildschirmen besser lesbar: die Namensspalte ist schmaler, die Zahlen stehen näher am Namen.
- **Läufe:** Die Detailseite einer Automation oder eines Skripts zeigt den Verlauf der Läufe über 30 Tage statt 7 (die Zahlen und die Liste bleiben bei 7 Tagen).
- **Befunde:** Die Seite hat einen klareren Aufbau: ein Panel mit den Reitern Offen, Neu, Bekannt … und „Zuletzt behoben“ (statt eines Faltbereichs darüber). Suche und Filter stehen zuerst; im Reiter „Offen“ folgen zuerst die Ausfälle als aufklappbare Gruppe, dann die einzelnen Befunde. Die Auswahl-Knöpfe erscheinen erst nach dem ersten Markieren; vorher gibt es nur das Kästchen „Seite auswählen“.
- **Befunde:** Die Zahl der Befunde zählt jetzt jeden Ausfall einmal und jeden Befund ohne Ausfall dahinter („8 Ausfälle + 6 einzelne = 14“); die Folgebefunde der Ausfälle stehen als Unterzeile unter der Kachel „Alle“. Das gilt für die Zahl am Reiter, die Kachel „Offene Befunde“, den Link „Alle Befunde“ und die Befunde-Seite. Die Kacheln der Unterseiten (z. B. Komponenten) haben mehr Platz für den Text.
- **Recorder, Lauteste Entitäten:** Die Liste ist jetzt eine sortierbare Tabelle wie „Auffälligkeiten“ (Name, Einordnung, Zeilen, Zeilen pro Tag, ohne neuen Zustand, Attribute, lauteste Stunde) statt vierzeiliger Karten; auf dem Telefon wird sie zu Karten. Im Kopf der Auswahlspalte markiert ein Kästchen alle Zeilen der Seite (auch bei „Auffälligkeiten“ und in der Kostenliste).
- **Recorder:** Die Auswahlspalte der Tabellen („Auffälligkeiten“, Lauteste Entitäten) ist nur noch so breit wie das Kästchen; der Kopf zeigt ein Symbol statt des Worts „Auswahl“.
- **Übersicht:** Neue Karte „Backup-Schutz“ neben System und Datenbank: letztes Backup, letzter automatischer Lauf und Gesamtergebnis der Prüfungen, mit Link zu den Details.
- **Übersicht:** Hinweise, „Seit dem letzten Scan“ und der Inventarstatus stehen in einer dreispaltigen Zeile; darunter System und Datenbank.
- **Übersicht:** „Seit deinem letzten Besuch“ steht jetzt in der Fußzeile von „Was muss ich jetzt tun?“, rechts neben den Wartungszielen, und nicht mehr lose zwischen den Karten. Der Text hatte „vor“ doppelt („vor vor 41 Min.“).
- **Übersicht:** „Wichtigste Befunde“ ist in „Was muss ich jetzt tun?“ aufgegangen: die Zeile „Ausfälle“ klappt auf und zeigt die betroffenen Integrationen, „Einzelne Befunde“ steht als aufklappbarer Bereich unter „Bald“, und „Alle Befunde“ ist ein Link im Kopf der Karte.
- **Zugangsdaten:** Die Kachel „Felder mit Wert“ entfällt; die Zahl steht als Unterzeile unter „Integrationen mit Zugangsdaten“.
- **Recorder, Last:** Zeilen, Entitäten und Ereignisse stehen als drei beschriftete Kennzahlen statt in einem Satz; was nicht mitgezählt wird (ausgeblendet, deaktiviert, dauerhaft ausgefallen), steht als eigene Marken mit Erklärung darunter.
- **Reparieren:** Die Karte „Sensorfehler bereinigen“ hat jetzt ihren Titel wie die anderen, und die Titel der Karten tragen den Namen ihrer Kachel („Sensorfehler bereinigen“, „Zähler wechseln“).
- **Übersicht:** Drei Zonen statt zwei Spalten: oben Status und Aufgaben, in der Mitte „Wichtigste Befunde“ (höchstens fünf Zeilen) mit dem Inventarstatus darunter neben den Hinweisen, unten System, Datenbank und Vergleich als Zustandskarten. Die Karte „Nach Objekttyp“ entfällt (das Inventar zeigt die Typen). In der System-Karte steht der Wert jetzt rechts und der Balken darunter.
- **Inventar:** Statt der Kacheln zeigt ein Ring mit Tabelle die Objekttypen: die fünf größten, der Rest auf Knopfdruck. Eine Zeile filtert die Liste, ein zweiter Klick hebt den Filter auf; die Spalten „Nicht verfügbar“ und „Verwaist“ filtern nach Typ und Zustand zugleich.
- **Inventar:** Suche und die Filter Typ, Zustand und Herkunft stehen in einer Zeile; auf schmalen Bildschirmen brechen sie um.
- **Speicher:** Die Kacheln Speicher, Arbeitsspeicher, Prozessor und Swap zeigen eine Kurve der letzten Tage (ein Wert alle fünf Minuten, sieben Tage lang gehalten; beim Prozessor auch die Spitze). Eine Stunde nach der Installation erscheint die erste Kurve.
- **Speicher:** Die zwei Kacheln „Belegung“ und „Sonstiges“ sind weg; drei Chips (Nach Kategorie, Nach Ordner, Weitere) wählen die Liste, jede mit eigener Überschrift.
- **Start von Home Assistant:** Das Banner nennt den Schritt (Home Assistant lädt, Wartezeit mit Countdown, abschließender Scan mit Fortschritt) statt nur „startet noch“.
- **Blueprints und Detailseite:** Jede Blueprint-Art ist ein Bereich mit Zahl (offen nur, wenn es Funde gibt); auf der Detailseite einer Entität oder eines Geräts ist „Umbenennen und Bereich“ eingeklappt.
- **Übersicht:** „Braucht Aufmerksamkeit“ steht vor dem Zustand des Bestands.
- **Batterien in Reitern:** Die Liste steht allein, die Prognose und die Arten der Batterien sind eigene Reiter, sobald es etwas zu zeigen gibt.
- **Änderungen als Bereiche:** Jede Kategorie (Statuswechsel, neue und behobene Befunde, neue und entfernte Objekte) ist ein einklappbarer Bereich mit Zahl; die Kacheln oben öffnen genau diese Kategorie.
- **Ausfälle und Recorder-Kosten kürzer:** Bei vielen Ursachen lässt sich die Karte einklappen, und die Statistik unter den Recorder-Kosten ist ein eingeklappter Bereich mit Zahl.
- **Läufe ohne zweite Liste:** Die Befunde („nie erfolgreich“, „bricht ab“ …) stehen jetzt in der Tabelle unter dem Namen; die Kachel „Auffällig“ filtert sie. Die möglichen Konflikte stehen eingeklappt mit Zahl unter der Tabelle.
- **Kacheln erkennbar:** Eine Zahl ohne Klick ist flach, ein Filter trägt einen Trichter und ist markiert (mit Haken), solange er wirkt, ein Link auf eine andere Seite einen Pfeil. Ein zweiter Klick hebt jeden Filter wieder auf, die Liste kommt ins Bild, und über der Liste steht „Filter aktiv“ mit „Zurücksetzen“.
- **Reparieren wie Aufräumen:** Die Aufgaben stehen als kompakte Kacheln oben und bleiben beim Arbeiten stehen; ein Wechsel braucht kein „Zurück“ mehr. Der Hinweis zum bestätigten Plan sitzt auch hier hinter dem farbigen (i).
- **Kein Kopieren-Knopf mehr in den Listen:** Das Viereck beim Daraufzeigen verdeckte Namen und IDs; die ID lässt sich direkt markieren.
- **Automationen: Diagnose auf der Detailseite:** Die Spalte „Diagnose“ in der Übersicht entfällt; die Zeile öffnet die Detailseite, die einen Reiter „Diagnose“ hat (Blickwinkel, Erfolgskriterien, Verbessern, Ablaufverfolgung). Skripte zeigen dort ihre vier Blickwinkel.
- **Recorder-Kosten als Tabelle:** Die Einträge stehen in einer sortierbaren Liste mit Balken für den Anteil und Spalten für Gesamt, 24 Stunden, 7 Tage und Durchschnitt pro Tag; klickbare Kacheln (Alle, Vorschläge, Ausgeschlossen, Nicht verwendet), Filter und CSV-Export.
- **Schutzmodus startet schreibgeschützt:** Eine neue Installation beginnt im Modus „nur lesen“; Änderungen schaltest du unter Einstellungen → Sicherheit bewusst frei. Bestehende Installationen behalten „voll“.
- **Zuverlässigkeit: Setup-Fehler:** Die Integrationen-Tabelle hat eine sortierbare Spalte „Setup-Fehler“ und eine Kachel dazu; die Detailseite nennt einen möglichen Grund (Gerät offline, Zugang, zu früher Start, Neustart nötig).
- **Zuverlässigkeit als Tabellen:** Integrationen und instabile Entitäten stehen in sortierbaren Listen (Verfügbarkeit, Ausfälle, längster Ausfall, letzte Störung, Veränderung; Episoden, pro Tag, Dauer, Muster) mit klickbaren Kacheln, Filtern und CSV-Export.
- **Recorder: Auffälligkeiten als Tabelle:** Die Auffälligkeiten stehen in einer sortierbaren Liste (Zeilen pro Tag, lauteste Stunde, Anteil ohne neuen Zustand) mit klickbaren Kacheln und Filtern; ein Klick auf die Zeile öffnet die Details, mehrere Entitäten lassen sich per Checkbox für den Ausschluss auswählen.
- **Automationen: neue Übersicht:** Der Reiter „Übersicht“ (vorher „Qualität“) listet alle Automationen mit Status, Läufen, Fehlern und den sieben Blickwinkeln, auch deaktivierte und nie gelaufene. Die Liste hat Suche, Filter, Sortierung nach jeder Spalte, Seitenumbruch und CSV-Export; die Zeile öffnet die Detailseite. Die Kacheln oben sind klickbar und filtern, ebenso die Kacheln unter „Läufe“.
- **Ruhigere Seitenköpfe:** Speicher & System, Zugriffe & Datenfluss, Zugangsdaten, Zuverlässigkeit, Freigaben, Richtlinien, Läufe, Recorder und Wartung zeigen den Untertitel unter dem Titel und eine schmale Zeile mit „Stand“ und „Aktualisieren“; die Reiterkacheln sind flacher.

### Neu

- **Eigene Batterietypen:** Ein Typ, den du bei einem Sensor eintippst, bleibt gespeichert und steht bei allen Sensoren in der Auswahl. Unter der Batterieliste lassen sich eigene Typen hinzufügen, umbenennen und löschen; eingebaute und genutzte Typen bleiben. Die Einkaufsliste zählt sie wie bisher mit.
- **Ausfälle als Kette:** Eine gestoppte App, die Integration, die an ihr hängt, ein Gerät dieser Integration und dessen Entitäten bilden jetzt eine Kette: die Ursache steht oben und trägt die Folgen. Ein Gerät, dessen Entitäten alle nicht verfügbar sind (mindestens drei), ist ein eigener Befund „Gerät ganz ausgefallen“ und lässt sich wie eine Integration als bekannt, zurückgestellt oder ausgeblendet markieren. Eine fehlende Entität, ein fehlendes Gerät oder ein fehlender Bereich, auf den mindestens zwei Automationen, Skripte oder Dashboards verweisen, steht wie ein fehlender Dienst als eine Ursache.
- **Suche nach Seiten und Filtern:** Die Suche oben findet jetzt auch Seiten (auch die Reiter der Einstellungen, auf Deutsch und Englisch, mit Stichwörtern wie „Backup“ oder „dunkel“) und Filter („Befunde: Bekannt“, „Bestand: Nicht verfügbar“ mit der Zahl dahinter) vor den Objekten; Pfeiltasten und Enter gelten über alle Treffer.
- **Prüfabdeckung:** Housekeeper zeigt jetzt, welche Quellen der letzte Scan gelesen hat: eine Zeile in der Übersicht („Prüfung: 5 von 6 Quellen“, gelb mit den Namen, wenn etwas fehlt) und eine Liste in Einstellungen, Info mit Zustand und Grund je Quelle (Register, Automationen, Dashboards, Energie-Dashboard, Apps, Langzeitstatistik, Datenbank). Der Scan-Zustandssensor nennt die nicht gelesenen Quellen. Objekte einer Quelle, die ein Scan nicht lesen konnte, zählen im Vergleich weder als neu noch als entfernt; ein beendeter Befund nennt die nicht gelesene Quelle.
- **Gespeicherte Ansichten:** Auch eine reine Sortierung (Spalte oder Richtung) lässt sich jetzt als Ansicht speichern. Der Knopf erscheint, sobald sich Suche, Filter oder Sortierung von der Standardliste unterscheiden, bei gewählter Ansicht nur, wenn sich etwas gegenüber dieser Ansicht geändert hat.
- **Einstellungen, Info:** „Was Housekeeper speichert“ listet jetzt alle eigenen Dateien mit Zweck, Größe und letzter Änderung, in Gruppen und mit der Gesamtgröße. Es werden nur Art und Größe gezeigt, nie Inhalte.
- **Scan-Zustand:** Schlägt ein Scan fehl oder bleibt er lange aus, zeigt das Panel ein Band mit der Phase und dem letzten erfolgreichen Scan; die Zahlen stammen dann von einem älteren Stand. Ein neuer Diagnose-Sensor „Scan-Zustand“ (in Ordnung, veraltet, fehlgeschlagen, vorläufig) steht für Dashboards und Automationen bereit, und bei anhaltendem Problem erscheint ein Reparaturhinweis.
- **Skripte als eigener Reiter:** Unter „Automationen“ listet der Reiter „Skripte“ alle Skripte mit Läufen, Fehlern, vier Blickwinkeln und der Spalte „Aufgerufen von“ (Automationen und Skripte, die das Skript nutzen); Skripte ohne Aufrufer sind schnell zu finden.
- **Helfer im Inventar:** Der Typfilter hat die Auswahl „Helfer“ (Helfer mit Eintrag und Helfer-Entitäten) mit den Spalten „Verwendet von“ und „Zuletzt geändert“ und einer Auswahl für vermutlich ungenutzte Helfer; Schimmelindikator und Bayes-Sensor werden auf fehlende Quellen geprüft.
- **Risikostufe mit Begründung:** Bei Zugriffe & Datenfluss sagt eine Legende, was Hoch, Mittel und Niedrig bedeuten; die Stufe nennt beim Daraufzeigen den Grund, und die Detailseite einer Integration schreibt ihn aus.
- **Custom Cards mit Status:** Die Liste der Dashboard-Ressourcen zeigt, ob die Datei fehlt, ob ein Dashboard die Karte nutzt oder ob das nicht zu erkennen ist.
- **Speicher & System** (Betrieb): Belegung von Datenträger, RAM und CPU und ein Reiter „Belegung“ mit Umschalter zwischen Kategorie und Ordnern unter `/config`. Apps und Custom-Integrationen stehen unter „Apps & Integrationen“.
- **Zugriffe & Datenfluss** (Sicherheit): Systemzugriffe und Cloud-Datenfluss der Integrationen mit Risikostufe, mit Supervisor auch die Rechte der Apps.
- **Zugangsdaten** (Sicherheit): welche Integrationen Passwörter, Tokens oder Schlüssel gespeichert haben und ob ein Wert hinterlegt ist. Werte zeigt Housekeeper nie.
- **Ausfälle statt drei Listen:** Eine Integration mit Problem steht jetzt auch ohne auffällige Entitäten unter „Befunde“ (Block „Ausfälle“). Auf der Übersicht gibt es dafür eine Zeile, „Benötigt Aufmerksamkeit“ heißt „Wichtigste Befunde“ (Ausfälle zuerst), die Karte „Integrationen mit Problemen“ entfällt.
- **Menü neu geordnet:** Neue Gruppe „Sicherheit“ (Freigaben, Zugriffe & Datenfluss, Zugangsdaten). Speicher & System steht unter Betrieb. Aufräumen, Reparieren und Journal bilden die Gruppe „Bereinigen“, „Erkunden“ heißt „Bestand“ (Inventar, Abhängigkeiten, Änderungen). Die Leiste hat damit sieben Einträge.
- **Übersicht zeigt das System:** Neue Karte „System“ mit Datenträger, Speicher und Prozessor. Ab 75 % belegtem Datenträger steht eine Aufgabe in der Liste, ab 90 % eine dringende.
- **Reiter „Zugriffe & Daten“** auf der Detailseite einer Integration: Systemzugriff, Datenfluss und Zugangsdaten (nie ein Wert); bei hohem Systemzugriff eine rote Zeile in der Übersicht.
- **Apps als Objekte:** Mit Supervisor stehen installierte Apps im Inventar (Status, Version, Update) und haben eine Detailseite mit Rechten, Last und Speicher. Keine Befunde, keine Änderungen an Apps.
- **Apps und Integrationen:** Hängt eine Integration vermutlich an einer App (Hostname in der Konfiguration), zeigt die App den Reiter „Beziehungen“. Die Zuordnung ist immer „vermutet“.
- **Befund „App gestoppt“:** Ist eine App gestoppt und fällt eine Integration aus, die vermutlich daran hängt, meldet Housekeeper das.
- **Befund „Integration nicht geladen“:** Ein aktiver Eintrag, der länger als eine Stunde nicht geladen ist, steht jetzt in den Befunden, mit der Ursache von Home Assistant.
- **Vermerke für Integrationen und Apps:** „Absichtlich offline“, „Saisonal“ und „Reservegerät“ blenden die Ausfall-Befunde aus.
- **Ausfälle:** Die Karte „Ausfälle“ bietet „Bekannt“, „Zurückstellen“ und „Ausblenden“ für nicht geladene Integrationen; ein Befund steht nicht mehr doppelt in der Liste.
- **Zahlen im Menü:** Wartung (verfehlte Ziele) und Richtlinien (Verstöße) zeigen eine Zahl; Bestand nicht mehr.
- **Blockierte Automationen:** Eine Automation, deren Auslöser alle auf ausgefallene Entitäten zeigen, wird als Befund gemeldet.
- **Fehlende Dienste:** Automationen und Skripte, die einen Dienst aufrufen, den es nicht mehr gibt, werden als Befund gemeldet; rufen mehrere denselben auf, steht er als eine Ursache in den Ausfällen.
- **Fehlende Tags:** Eine Automation, die auf einen Tag (NFC/QR) wartet, den es nicht mehr gibt, wird als Befund gemeldet.
- **Richtlinien für den Zugang:** Drei neue Regeln (aus) weisen auf eine Anmeldung ohne Passwort für ein öffentliches Netz (`trusted_networks`), eine externe URL mit `http://` und vertrauenswürdige Proxys mit öffentlichem Netz hin. Normale private Netze werden nicht gemeldet.
- **Richtlinien für Benutzer:** Drei neue Regeln (aus): Benutzer, die sich lange nicht oder nie angemeldet haben, alte Langzeit-Tokens (nur das Alter, denn Home Assistant merkt sich die Nutzung nicht) und Langzeit-Tokens abgeschalteter Konten. Nie ein Token-Wert.
- **Richtlinie für Companion-App-Geräte:** Neue Regel (aus): ein Handy mit der Companion App, von dem seit mindestens 30 Tagen kein beobachteter Sensor etwas gemeldet hat, meist ein altes Handy mit stehengebliebenem Eintrag.
- **Richtlinien für HACS:** Zwei neue Regeln (aus): eine über HACS installierte Integration, deren GitHub-Repository archiviert ist, und eine mit wartendem Update, das eine neuere Home-Assistant-Version braucht. Die Integrationsseite zeigt beides am HACS-Kasten.
- **Fehler aus dem Log:** Bei einer nicht geladenen Integration und bei ausgefallenen Entitäten steht jetzt, wie oft Home Assistant für die Integration einen Fehler oder eine Warnung ins Log geschrieben hat und wann zuletzt. Nur Zahlen und Zeiten, nie der Text.
- **Verweise ersetzen prüft Automationen:** Home Assistant muss die geänderte Automation annehmen und nach dem Neuladen laden, sonst bleibt die Datei unverändert.
- **Automationen ohne Wirkung:** Befunde für Automationen und Skripte, deren Aktionen alle auf ausgefallene Entitäten zielen, und für Bedingungen, die nie wahr werden. Eine blockierte Automation lässt sich per Plan ausschalten.
- **Webhooks:** Zugriffe & Datenfluss zeigt, welche Automationen ein Webhook starten kann und ob er auch von außen erreichbar ist.
- **Vorher/nachher:** Der Reiter „Läufe“ vergleicht Fehler vor und nach einer Änderung der Konfiguration.
- **Seitenleisten-Knopf:** öffnet die Seitenleiste von Home Assistant, wenn sie ausgeblendet ist.
- **Apps & Integrationen** (Bestand): Apps (mit CPU, RAM und Daten) sowie Core- und Custom-Integrationen in eigenen Reitern, mit Version, Status, Entitäten und Geräten; der belegte Speicher der Apps und der Custom-Integrationen steht summiert in Kachel und Reiter. Im Inventar gibt es dazu einen Filter „Core / Custom“.
- **Seite einer Integration:** Core und Custom haben eine eigene Detailseite mit allen Einträgen, Entitäten und Geräten, Zuverlässigkeit sowie Zugriffen und Daten; bei Custom auch Ordner und Größe.
- **HACS-Updates:** Bei Custom-Integrationen, die HACS installiert hat, zeigen die Seite der Integration und die Liste „Apps & Integrationen“ die installierte und die neueste Version samt Hinweis auf ein Update; die Liste lässt sich danach filtern. Bei Apps zeigt die Liste die neueste Version, eine Kachel „App-Updates“ und einen Filter „Update verfügbar“.
- **Sonstiges** (Speicher & System): Custom Cards, Blueprints und die übrigen Ordner und Dateien unter `/config` stehen in einem Reiter.

### Behoben

- **Befunde:** Ausfälle (Integration, Gerät, App) lassen sich in der Liste wieder ankreuzen, um sie gesammelt auszublenden, als bekannt zu markieren oder zurückzustellen.
- **Abhängigkeiten:** Dieselbe Entität, die eine Automation an vielen Stellen nennt, steht nur noch einmal in der Liste („12 Stellen“, die Orte beim Darüberfahren). Objekte ohne eigenen Eintrag im Inventar (zum Beispiel `sun.sun`) zeigen „Nicht im Inventar“ statt „Fehlt“; „Fehlt“ steht nur noch, wo ein Befund es belegt.
- **Defekte Referenzen:** „Label ergänzen“ erscheint dort nicht mehr (Reiter „Aktionen“, Sammelleiste der Befunde). Die Ursache ist ein Satz: „Automation X verweist auf Y, das es nicht mehr gibt.“
- **Befunde:** Über dem Titel stand die Überschrift „Aktionen“, ein Rest der Menügruppe, die nur noch aus „Befunde“ besteht. Sie entfällt, ebenso als Pfad in der Suche.
- **Menüleiste:** Auf Fenstern, die für alle Menüpunkte zu schmal sind (etwa zwischen 860 und 1400 Pixeln), wurde die Leiste rechts abgeschnitten. Sie wechselt jetzt in den „Menü“-Knopf mit einer Liste darunter, sobald sie nicht passt, und zeigt wieder die volle Leiste, wenn der Platz reicht.
- **Scan-Verlauf:** „Je Tag der letzte Scan“ zählt den Tag jetzt in der Zeit von Home Assistant statt in UTC. Vorher konnten zwei Scans desselben Tages nebeneinander stehen und ein anderer Tag fehlen; bereits gespeicherte Doppel verschwinden beim Laden.
- **Sammelaktionen bei Befunden:** Scheitert eine Anfrage mitten in einer Auswahl, bleiben die fehlgeschlagenen Befunde ausgewählt und das Formular offen; die Meldung nennt „x von y erledigt“. Ein neuer Versuch sendet nur die übrigen.
- **Gespeicherte Ansichten:** Ist die Grenze von zehn Ansichten erreicht, überschreibt eine neue Ansicht nicht mehr still die letzte, sondern weist darauf hin.
- **Darstellung:** Gesperrte Knöpfe drehen ihr Symbol nur noch bei laufender Arbeit, nicht mehr bei fehlender Auswahl; Grün und Gelb folgen überall dem Theme; die Tabellen „Nach Objekttyp“ und Backups tragen auf dem Handy ihre Spaltenbezeichnungen.
- **Übersicht:** „Schwache Batterien: Ziel verfehlt“ führt jetzt zu „Pflegen → Batterien“ statt zum Inventar.
- **Recorder aufräumen:** Statistiken löschen und Verlauf kürzen laufen für jede Entität einzeln: Scheitert eine, laufen die übrigen weiter und der Grund steht bei der betroffenen. Vorher stoppte der Lauf nach dem ersten Fehler. Bei einem gemeinsamen Problem (Recorder beschäftigt oder nicht verfügbar) stoppt er weiter.
- **Verweise ersetzen, Umbenennen:** Betreffen mehrere Schritte eines Plans dieselbe Automation oder dieselbe Quelle, brach der Lauf nach dem ersten Schritt mit „Eine Konfiguration wurde nach der Vorschau geändert“ ab. Die eigenen Änderungen früherer Schritte zählen jetzt nicht mehr als fremde Änderung.
- **Kacheln der Unterseiten:** Das Symbol sitzt jetzt mittig in der Kachel und hat mehr Abstand zum Text.
- **Webhooks:** Hat eine Automation mehrere Webhook-Auslöser, gilt sie als offen, sobald einer von außen erreichbar ist (vorher zählte nur der erste). Deaktivierte Automationen sind gekennzeichnet und zählen nicht als offen.
- **Pläne:** Ein einzelner fehlgeschlagener Statusabruf beendet die Fortschrittsanzeige nicht mehr; sie versucht es erneut und weist darauf hin. Ein fehlgeschlagener Abbruch meldet das jetzt.
- **Reparaturhinweise:** Nur nicht verfügbare, verwaiste und defekte Verweise lösen noch einen Hinweis aus; andere Befunde (zum Beispiel eine nicht geladene Integration) erscheinen nicht mehr unter „nicht verfügbare Entitäten“.
- **Läufe: Klick auf „Fehler“:** Die Karte oben zeigte „Keine Treffer“, obwohl die Tabelle darunter die Automationen mit Fehlern auflistete; die leere Meldung entfällt jetzt.
- Unter einem Ausfall zeigte die Karte „Ausfälle“ höchstens 20 Folgebefunde, auch wenn die Zahl mehr nannte. Jetzt gibt es Seiten.

## 1.5.0 - 2026-10-12

Die Änderungen stehen vollständig unter 1.5.1. / The changes are listed in full under 1.5.1.

## 1.4.0 - 2026-10-11

Defekte Referenzen in Dashboards sind jetzt lesbar und gruppiert.

### Neu

- **Defekte Dashboard-Referenzen:** Statt eines Pfads wie `views/12/sections/1/cards/0/…` stehen Tab, Abschnitt und Kartentyp da. Die Referenzen einer Karte sind eine aufklappbare Zeile, und die Diagnose hat eine Zeile je Karte.
- **Vorschläge:** Zu einer fehlenden Entität nennt Housekeeper vorhandene mit ähnlichem Namen („Vielleicht: …“), bei Dashboards, Automationen, Skripten, Szenen und Helfern.
- **Verwaiste Karten:** Ist mehr als die Hälfte der Referenzen einer Karte defekt, weist Housekeeper darauf hin, die Karte ganz zu entfernen.

### Behoben

- Lange Werte in der Diagnose werden nicht mehr mit „…“ abgeschnitten.

## 1.3.0 - 2026-10-11

Ein Logbuch für eigene Einträge, Objektseiten mit Reitern „Aktionen“ und „Verlauf“, Batterien mit Prognose und Knopfzellen in Volt, Richtlinien direkt am Objekt und ein überarbeiteter Recorder.

### Neu

- **Logbuch:** Die eigenen Einträge sind jetzt ein Logbuch: ein Dialog zum Schreiben, ein Reiter unter „Änderungen“, eine kompakte Karte je Objekt und ein Vorschlag nach einer Aktion. Wird ein Gerät entfernt oder vergessen, schreibt Housekeeper es ins Logbuch, und die Liste der entfernten Geräte zeigt den Eintrag. Der Reiter „Verlauf“ eines Geräts hat keine eigene Notiz mehr (alte Notizen entfallen).
- **Verlauf eines Objekts:** Objekte haben einen Reiter „Verlauf“ mit ihrem Logbuch, den Plänen, die sie nannten, und bei Geräten mit ihrem Lebenslauf; auch das, was Housekeeper bemerkt hat.
- **Scanpunkte:** Aus dem Verlauf der Scans lässt sich ein benannter Scanpunkt setzen. Er bleibt bis zum Löschen und dient als Vergleichsbasis.
- **Objektseiten:** Entität, Gerät, Integration, Automation, Skript und Szene lesen sich auf der Übersicht und ändern Dinge im Reiter „Aktionen“ (Formulare als Zeilen einer Karte, nach Zweck gruppiert). Die Karte „Bekannt“ fasst alles zusammen, mit der Quelle jeder Zeile; die technischen Daten stehen in zwei gleich breiten Spalten. Die Markierung wanderte in den Reiter „Aktionen“.
- **Verlauf kürzen** auch auf der Seite einer Entität: Zustände, Kurz- und Langzeitstatistik zum Anhaken, oder ein Stück Zustände.
- **Entfernen mit Recorder-Daten:** Beim Entfernen von Entitäten wählst du die Recorder-Daten je Entität, mit Voreinstellung, Sperre fürs Energie-Dashboard und Zusammenfassung im Plan.
- **Batterien:** eine Tabelle mit Prognose bis 90 Tage (Zeitfenster) und Bedarf der nächsten 30 Tage; jeder Sensor trägt den Namen seines Geräts. Der Typ kommt, wenn vorhanden, aus Battery Notes (dessen übrige Entitäten zählen nicht mit). Sensoren ohne Wechselbatterie werden aus den anderen Sensoren des Geräts vorgeschlagen und nicht gezählt. Knopfzellen in Volt (CR2016, CR2032, CR2450) zeigen Balken und Prozent aus einer Kurve; „Leer in“ sagt „nicht absehbar“ statt „stabil“.
- **Richtlinien:** Verstöße klappen mit einem Klick auf die Zeile auf, mit Grund und Abhilfe (Umbenennen, Bereich zuweisen, Objekt öffnen, Ausblenden). Die Sammelumbenennung entfällt. Die Übersicht eines Objekts zeigt seine Verstöße mit denselben Abhilfen. Beim Umbenennen startet das Feld leer, Vorschläge sind Knöpfe (der beste „empfohlen“, ein Klick wechselt oder leert).
- **Neue Richtlinie „Entitäts-ID mit Geräteadresse“:** meldet IDs, die aus einer Adresse bestehen (IP in privaten Bereichen, MAC, Funk- oder Zigbee-Adresse wie `eltako_gw1_ff_c2_4a_89`), weil sie nichts über das Gerät sagen und sich ändern können. Der erste Vorschlag ist der Name. Wie alle Richtlinien ist sie zunächst aus.
- **Geänderte Richtlinie „Entitäts-ID mit angehängter Zahl“:** zählt nur noch Zähler bis drei Stellen (`_2` bis `_999`) und überspringt Adress-IDs; `switch.schedule_878149` ist damit kein Fund mehr.
- **Recorder:** Reiter „Auffälligkeiten“ (eine Karte je Entität mit allen Gründen und Schwellen, Filter, Markieren zum Ausschließen) und „Ereignisse“ (Balken, Anteil, Rate pro Tag). Empfohlene Ausschlüsse sind erkennbar, „Nur Vorschläge“ blendet den Rest aus. Integrationen zeigen ihre lautesten Entitäten. Alten Verlauf kürzen sagt, was geht und was bleibt.
- **Gerät austauschen, Zähler wechseln, Verweise ersetzen:** Auswahl per Tippen statt Browser-Liste; Prüfzeilen im Formular, Zusammenfassung der Paare, Modi als Karten mit Folgen und Zeitleiste; die Vorschau zeigt jede Quelle mit alter und neuer Zeile. Reparaturen von Zählern und Zeiträumen sagen, was geprüft wurde und was sich ändert.
- **Wartung:** Erinnerungen mit Fälligkeitstag und Verlauf, als Tabelle; Erinnerungen und Logbuch-Einträge entstehen in einem Dialog. Löschen von Erinnerung, Eintrag, Plan, Ansicht oder Vorlage fragt vorher nach. Die Bestätigungen im Backup-Schutz öffnen per Knopf in der Zeile.
- **Status:** Der Ring zählt Themen; nur dringende ziehen Punkte ab, ein Klick erklärt die Zahl.
- **Übersicht und Graph:** ohne die Kachelkarte „Was möchtest du tun?“; auf dem Handy stehen die drei Kennzahlen in einer Reihe, „Neu scannen“ ist kleiner. Der Graph hat feste Höhe, einklappbare Legende, umbrechende Namen und einen Hinweis auf dem Handy.
- **Export:** zeigt, wie viele Entitäten gewählt sind, und kehrt zur Seite zurück, von der er kam.

### Behoben

- „Keine Wechselbatterie“ aktualisiert die Liste sofort, auch bei Volt-Sensoren; die Batterietabelle öffnet mit allen Batterien statt nur den niedrigen.
- Der Klick auf einen Umbenennen-Vorschlag in den Richtlinien tat nichts.
- Der Rahmen eines Dialogfelds überdeckte den Feldtitel; die Chips in den Dialogen sind gleich groß, haben einen Zeiger, und die gewählte ist erkennbar.
- Backup-Schutz: Pillen stehen in einer Linie, der Knopf unter dem Text.
- Die Automationsseite überlappt keinen Text mehr und stapelt die Laufbalken nicht.
- Die Aufräum-Hinweise der Wirkung nennen jetzt, dass beim Entfernen auch die Statistik gelöscht wird, und die nicht geprüften dynamischen Templates.
- Striche über Hinweisen im ganzen Panel entfernt.

## 1.2.0 - 2026-10-10

Mehr Aufräumen direkt an der Entität, ein klarerer Recorder-Ausschluss und ein Panel, das bei Fehlern nicht mehr einfriert.

### Neu

- **Umbenennen und Bereich zuweisen** auch auf der Detailseite einer Entität oder eines Geräts, je als Plan mit Vorschau und Rückgängig; in der Richtlinienliste für viele auf einmal.
- **Recorder-Ausschluss:** eine schmale Leiste statt eines großen Kastens, mit YAML zum Kopieren und den Schritten danach. „Last im Recorder“ und „Recorder-Kosten“ zeigen, was der Recorder schon ausschließt; ausgeschlossene Entitäten lassen sich zum Kürzen des alten Verlaufs wählen.
- **Sparklines** in den Kacheln der Befundliste; ein eigener Reiter für die Housekeeper-Backups in der Wartung.
- **Labels** auch für Skripte und Szenen.
- **Einstellungen:** Die Angaben für eine Fehlermeldung (Versionen, Browser oder App, letzte Fehler) lassen sich kopieren; eine Vorlage für Fehlermeldungen fragt danach.
- **Export:** alle Entitäten mit einem Klick wählen.

### Behoben

- In Safari und der Companion-App blieb das Panel auf „Scanning…“ stehen (#7).
- Ein neuer Plan aus der Befundliste oder der Detailseite öffnete die Seite nicht am Plan (#8).
- Eine Ansicht, die einen Fehler wirft, zeigt eine Meldung mit Weg zurück, statt das Panel einzufrieren; eine fehlgeschlagene Aktion ersetzt die Seite nicht mehr.
- Ein Doppelklick erzeugt keinen zweiten Plan mehr.
- Die Karte „Gerät austauschen“ zeigte den Titel der Recorder-Auswahl.
- Listen mit Entitäten zeigen überall Name, ID und Zusatzangaben gleich; Richtlinienliste, Listenwerkzeuge und Trennlinien sauber ausgerichtet.
- Die Statuskachel der Befundliste zeigt dieselbe Größe wie ihre Linie.
- Das Backup vor dem Löschen im Recorder enthält die Datenbank.

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
