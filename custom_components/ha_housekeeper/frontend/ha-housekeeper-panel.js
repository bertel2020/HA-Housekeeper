// GENERATED FILE - do not edit. Edit panel-src/*.js and run: node scripts/build_panel.mjs

const TEXT = {
  de: {
    title: "Housekeeper", subtitle: "Deine Home-Assistant-Installation im Blick",
    overview: "Übersicht", inventory: "Inventar", graph: "Abhängigkeiten", findingsNav: "Befunde",
    navMain: "Hauptnavigation", navMenu: "Menü", enabled: "aktiviert", agoNow: "gerade eben", agoMinutes: "vor {n} Min.", agoHours: "vor {n} Std.", agoDays: "vor {n} Tagen", navGroupOverview: "Überblick", navGroupOperation: "Betrieb", navGroupExplore: "Erkunden", navGroupMaintain: "Pflegen", navGroupSpecial: "Spezialansichten",
    scan: "Neu scannen", exportJson: "JSON", exportCsv: "CSV", exportTitle: "Befunde exportieren", scanning: "Scan läuft …", all: "Alle Typen",
    allStatus: "Alle Zustände", search: "Name, ID, Integration …",
    name: "Name", type: "Typ", status: "Zustand", reason: "Begründung",
    tabsLabel: "Abschnitte des Objekts", tabOverview: "Übersicht", tabRelations: "Abhängigkeiten", tabTechnical: "Technische Daten", tabAttributes: "Attribute",
    sumCause: "Ursache", sumIntegration: "Integration", sumDevice: "Gerät", sumArea: "Bereich", sumRisk: "Risiko beim Entfernen", riskNone: "keine Verwendung gefunden", riskHits: "{n} Verwendungen, davon sicher: {c}",
    since: "Beobachtet seit", dependencies: "Beziehungen", objects: "Objekte",
    findings: "Befunde", active: "Aktiv", orphaned: "Verwaist",
    unavailable: "Nicht verfügbar", disabled: "Deaktiviert", unknown: "Unbekannt",
    empty: "Leer", problem: "Problem", details: "Details", close: "Schließen",
    noResults: "Keine passenden Objekte gefunden.",
    lastScan: "Letzter Scan", evidence: "Nachweis", registry: "Registry",
    state: "Zustand & Attribute", incoming: "Eingehend", outgoing: "Ausgehend",
    graphMode: "Darstellung", graphList: "Liste", graphGraph: "Graph", graphDepth: "Ebenen", graphRelation: "Beziehungstyp", graphAllRelations: "Alle Beziehungen", graphConfidence: "Sicherheit", graphAllConf: "Alle Sicherheiten", graphCertainOnly: "Nur sichere",
    graphImpact: "Was bricht beim Entfernen?", graphBreaks: "bricht", graphLabel: "Abhängigkeitsgraph von {name}", graphNodes: "Objekte: {n}", graphMore: "Mehr anzeigen",
    graphLegend: "Durchgezogen: sicher · Gestrichelt: wahrscheinlich · Rot gepunktet: Zyklus · Roter Rahmen: bricht beim Entfernen · Gestrichelter Rahmen: Objekt fehlt.",
    graphMissing: "Fehlende Ziele: {n}", graphProbable: "Wahrscheinliche Beziehungen: {n}", graphCycles: "Zyklen: {n}", graphHidden: "Ausgeblendet: {n}", graphHitsOutside: "{n} betroffene Objekte liegen außerhalb des Graphen (mehr Ebenen wählen)",
    graphHint: "Wähle ein Objekt aus, um seine direkten Beziehungen zu untersuchen.",
    select: "Objekt auswählen", firstObservation: "Erster durch Housekeeper bestätigter Zeitpunkt",
    entity: "Entity", device: "Gerät", config_entry: "Integration", area: "Bereich",
    automation: "Automation", script: "Skript", scene: "Szene", dashboard: "Dashboard", SHOWS: "zeigt an", entity_disabled: "Entity wurde deaktiviert",
    floor: "Etage", label: "Label", broken_reference: "Defekte Referenz",
    triggers: "Trigger", conditions: "Bedingungen", actions: "Aktionen",
    automationStructure: "Automationsstruktur", previous: "Zurück", next: "Weiter",
    page: "Seite", of: "von", missingReferences: "Fehlende Referenzen",
    integration_disabled: "Zugehörige Integration wurde deaktiviert",
    device_disabled: "Zugehöriges Gerät wurde deaktiviert",
    device_missing: "Zugehöriges Gerät existiert nicht mehr in der Geräte-Registry",
    config_entry_missing: "Zugehöriger Konfigurationseintrag fehlt",
    state_missing: "Entity ist registriert, besitzt aber keinen Zustand",
    state_unavailable: "Integration meldet den Zustand unavailable",
    state_unknown: "Integration meldet den Zustand unknown", state_available: "Zustand ist verfügbar",
    loading: "Inventar wird geladen …", loadError: "Inventar konnte nicht geladen werden",
    total: "Gesamt",
    recentFindings: "Aktuelle Befunde", affected: "Betroffenes Objekt",
    systemState: "Systemzustand", health: "Housekeeping-Status", healthGood: "Gut", healthCheck: "Prüfen",
    healthBad: "Problematisch", healthHint: "Anteil der Entities, Automationen, Skripte und Szenen ohne Befund", healthTip: "Gezählt werden betroffene Objekte, nicht einzelne Befunde. Ausgeblendete Befunde und andere Objekttypen (Dashboards, Geräte, Helfer) zählen nicht. Der Wert ist gerundet. Betroffen: {affected} von {base}.",
    openFindings: "Offene Befunde", needsAttention: "Benötigt Aufmerksamkeit",
    actTitle: "Was muss ich jetzt tun?", actSub: "Nach Dringlichkeit sortiert", actNone: "Nichts zu tun. Letzter Scan: {date}.",
    actIntegrations: "Integrationen mit Problem", actIntegrationsHint: "Einträge, die nicht geladen sind oder Fehler melden",
    actNewCritical: "Neue kritische Befunde", actNewCriticalHint: "Seit dem letzten Scan: nicht verfügbar, defekte Referenz oder Problem",
   
    actQuarantine: "Quarantäne abgelaufen", actQuarantineHint: "Bereit zur Entfernung nach deiner Bestätigung",
    trendTitle: "Seit dem letzten Scan", trendSince: "Vergleich mit dem Scan vom {date}", trendNewFindings: "Neue Befunde", trendResolved: "Behoben", trendChanged: "Statuswechsel", trendNewObjects: "Neue Objekte", trendNone: "Keine Änderungen seit dem Scan vom {date}.",
    sortedBySure: "Nach Sicherheit der Diagnose sortiert", allFindings: "Alle Befunde",
    inventoryStatus: "Inventarstatus", byType: "Nach Objekttyp", noFindings: "Keine Befunde – alles unauffällig.",
    openInHA: "In Home Assistant öffnen", diagnosis: "Ursachendiagnose", present: "Vorhanden", missing: "Fehlt",
    certain: "Bestätigt", probable: "Wahrscheinlich", confidence: "Sicherheit", origin: "Herkunft",
    usage: "Verwendung", pathTitle: "Abhängigkeitspfad", pathSubtitle: "Herkunft und Verwendung eines Objekts prüfen.",
    searchObject: "Objekt suchen …", noRelations: "Keine Beziehungen gefunden.", firstSeenNote: "seit erster Beobachtung",
    findingsSubtitle: "Alle Diagnosen mit Verweis auf das betroffene Objekt.", inventorySubtitle: "Alle erfassten Objekte der Installation.",
    scanDone: "Scan aktuell", of_total: "von", shown: "angezeigt", integration: "Integration",
    PROVIDES: "stellt bereit", OWNS: "besitzt", CONTAINS: "enthält", VIA_DEVICE: "über Gerät",
    TRIGGERS_ON: "löst aus durch", USES_AS_CONDITION: "prüft als Bedingung", TARGETS: "steuert", REFERENCES: "verweist auf",
    runtimeState: "Laufzeit-Zustand", usedBy: "verwendet von",
    impactTitle: "Auswirkung einer Entfernung", impactSubtitle: "Reine Analyse – Housekeeper entfernt nichts.",
    impactNone: "Keine bekannte Verwendung", impactNoneText: "Keine Automation, kein Skript, keine Szene und kein Dashboard verwendet dieses Objekt oder seine zugehörigen Entities.",
    impactCertain: "Nicht sicher entfernbar", impactCertainText: "{count} Automation(en), Skript(e), Szene(n) oder Dashboard(s) verweisen sicher auf dieses Objekt und würden ins Leere laufen.",
    impactProbable: "Vorher prüfen", impactProbableText: "{count} Automation(en), Skript(e), Szene(n) oder Dashboard(s) verweisen wahrscheinlich darauf (z. B. über Templates).",
    impactScope: "Betrachtet werden das Objekt und {count} zugehörige Entities.", impactScopeOne: "Betrachtet wird nur dieses Objekt.",
    impactLimits: "Nicht geprüft: automatisch erzeugte Dashboards, die Zustandshistorie im Recorder und externe Systeme.",
    changes: "Änderungen", changesSubtitle: "Was sich seit einem früheren Scan verändert hat.", compareWith: "Vergleichen mit", previousScan: "Letzter Scan davor",
    historyTitle: "Verlauf der Scans", historyHint: "Je Tag bleibt der letzte Scan {days} Tage erhalten. Ein Klick wählt ihn als Vergleichsbasis.", historyBuilding: "Der Verlauf baut sich auf: Housekeeper speichert den letzten Scan jedes Tages {days} Tage lang (einstellbar unter Einstellungen). Weitere Vergleichspunkte erscheinen mit jedem neuen Tag.", currentScan: "Aktueller Scan", storedScan: "Gespeicherter Scan", historyCounts: "{objects} Objekte · {findings} Befunde", optHistoryDays: "Scan-Verlauf aufbewahren (Tage)",
    noChanges: "Keine Änderungen seit diesem Scan.",
    statusChanges: "Statuswechsel", newFindings: "Neue Befunde", resolvedFindings: "Behobene Befunde", newObjects: "Neue Objekte", removedObjects: "Entfernte Objekte",
    worsened: "Verschlechtert", changedLabel: "Geändert", improved: "Verbessert", gone: "Nicht mehr vorhanden", comparedWith: "Vergleich mit dem Scan vom",
    possible_duplicate: "Mögliches Duplikat", unused: "Ungenutzt", duplicateOf: "Mögliches Duplikat von", lastTriggered: "Zuletzt ausgelöst", never: "Nie",
    "automation.never_triggered": "Wurde nie ausgelöst", "automation.stale": "Lange nicht ausgelöst", "automation.disabled_long": "Lange ausgeschaltet",
    cause_never_triggered: "Die Automation ist eingeschaltet, wurde aber seit mindestens {days} Tagen nie ausgelöst. Vielleicht passt ein Trigger nicht mehr oder sie wird nicht mehr gebraucht.",
    cause_stale: "Die Automation wurde seit {days} Tagen nicht mehr ausgelöst. Vielleicht passt ein Trigger nicht mehr oder sie wird nicht mehr gebraucht.",
    cause_disabled_long: "Die Automation ist seit {days} Tagen ausgeschaltet. Wenn sie nicht mehr gebraucht wird, kann sie später entfernt werden.",
    hint_unused: "Prüfen, ob die Automation noch gebraucht wird. Housekeeper ändert nichts.",
    cause_duplicate: "Es gibt eine funktionierende Entity mit fast gleicher ID von derselben Integration ({twin}). Diese hier ist sehr wahrscheinlich ein Überbleibsel, etwa nach dem erneuten Hinzufügen des Geräts.",
    hint_duplicate: "Die funktionierende Entity öffnen und vergleichen. Erst wenn nichts mehr auf diese Entity verweist, ist sie ein Kandidat zum Entfernen.",
    duplicateTwin: "Funktionierende Entity",
    INCLUDES: "hat als Mitglied", missing_member: "Gruppenmitglied",
    cause_group_broken: "Die Gruppe enthält {count} Mitglied(er), die nicht mehr existieren.", hint_group_broken: "Die Gruppe bearbeiten und die fehlenden Mitglieder entfernen.",
    cause_helper_broken: "Dieser Helfer baut auf {count} Entity/Entities auf, die nicht mehr existieren.", hint_helper_broken: "Den Helfer bearbeiten und die fehlenden Quellen ersetzen.",
    hideFinding: "Befund ausblenden", showFinding: "Wieder einblenden", ignoredLabel: "Ausgeblendet", showIgnored: "Ausgeblendete anzeigen",
    ignoredByLabel: "Ausgeblendet durch das Label housekeeper_ignore", findingsOfObject: "Befunde zu diesem Objekt",
    batteries: "Batterien", batteriesSubtitle: "Batterie-Entities, die niedrigsten Werte zuerst.", batteryLow: "Niedrig", batteryAll: "Alle",
    settings: "Einstellungen", settingsSubtitle: "Infos zu Housekeeper und Anpassung der Darstellung.", about: "Über Housekeeper", version: "Version", haVersion: "Home Assistant",
    mode: "Betriebsart", readOnlyValue: "Liest und analysiert; ändert nur nach ausdrücklicher Bestätigung", scanInterval: "Automatischer Scan", unavailableAfter: "Nicht verfügbar gilt als Befund nach", unusedAfter: "Ungenutzte Automationen nach", lowBatteryAt: "Schwache Batterie ab",
    daysValue: "{n} Tage", hoursValue: "alle {n} Stunden", offValue: "Aus", immediately: "sofort", openOptions: "Optionen öffnen", reportIssue: "Fehler melden", changelog: "Änderungsprotokoll", repository: "GitHub", copyInfo: "Info kopieren", copied: "Kopiert",
    appearance: "Darstellung", fontSize: "Schriftgröße", fontSmall: "Klein", fontNormal: "Normal", fontLarge: "Groß", colorMode: "Modus", modeAuto: "Automatisch", modeLight: "Hell", modeDark: "Dunkel", modeHint: "Automatisch folgt dem Design von Home Assistant.",
    colorScheme: "Farbschema", schemeStandard: "Standard", schemeHousekeeper: "Housekeeper", schemeModern: "Modern", behavior: "Verhalten", startView: "Startansicht", pageSizeSetting: "Einträge pro Seite", resetPrefs: "Einstellungen zurücksetzen",
    hiddenFindings: "Ausgeblendete Befunde", hiddenNone: "Keine Befunde ausgeblendet.", hiddenHint: "Hier lassen sich ausgeblendete Befunde wieder einblenden.",
    sortBy: "Sortieren nach", sortCertainty: "Sicherheit", sortName: "Name", sortId: "Objekt-ID", sortSince: "Erkannt seit", sortRule: "Regel",
    sortLevel: "Ladestand", sortArea: "Bereich", sortType: "Typ", sortStatus: "Status", allTypes: "Alle Typen", allAreas: "Alle Bereiche",
    sortAscending: "Aufsteigend", sortDescending: "Absteigend", searchList: "In der Liste suchen …", noMatches: "Keine Treffer für diese Filter.",
    density: "Dichte", densityNormal: "Normal", densityCompact: "Kompakt", motion: "Animationen", motionAuto: "Wie System", motionReduced: "Reduziert",
    motionHint: "Wie System folgt der Einstellung „Bewegung reduzieren“ deines Geräts.", prefsNote: "Die Darstellung wird in deinem Home-Assistant-Benutzerprofil gespeichert (und zusätzlich in diesem Browser).",
    scanSettings: "Scan und Schwellenwerte", scanSettingsHint: "Ändert die Optionen der Integration. Housekeeper lädt danach neu.", optMinUnavailable: "Nicht verfügbar gilt als Befund nach (Tage, 0 = sofort)",
    optUnusedAutomation: "Ungenutzte Automationen nach (Tage, 0 = aus)", optScanInterval: "Automatischer Scan alle (Stunden, 0 = aus)", optLowBattery: "Schwache Batterie ab (Prozent)",
    saveOptions: "Speichern", optionsSaved: "Gespeichert. Housekeeper lädt neu …", optionsInvalid: "Bitte Werte im erlaubten Bereich eingeben.",
    cleanupSubtitle: "Vorschau für das Aufräumen: Housekeeper prüft Kandidaten und protokolliert das Ergebnis. Es wird nichts geändert.",
    cleanupCandidates: "Kandidaten", cleanupCandidatesHint: "Verwaiste und lange nicht verfügbare Entities.", cleanupNone: "Keine Kandidaten gefunden.",
    selectPage: "Seite auswählen", clearSelection: "Auswahl leeren", createPlan: "Vorschau erstellen", selectedCount: "{count} ausgewählt",
    stepsLabel: "Ablauf des Plans", stepSelect: "Auswahl", stepAnalysis: "Auswirkungsanalyse", stepConfirm: "Bestätigung", stepBackup: "Backup", stepRun: "Ausführung", stepVerify: "Verifikation",
    stepDone: "erledigt", stepCurrent: "aktuell", stepTodo: "ausstehend", stepSkipped: "entfällt", stepFailed: "fehlgeschlagen",
    stepAnalysisBlocked: "Keine ausführbare Aktion", stepBackupSkipped: "Nicht nötig: alles lässt sich per Housekeeper zurücknehmen", stepBackupDone: "Erstellt am {date}{job}", stepBackupJob: " · Job {id}",
    stepRunPartial: "Nur teilweise ausgeführt", stepVerifyFailed: "Die Prüfung hat Auffälligkeiten ergeben",
    backupRestoreHint: "Ein Backup stellt nur Home Assistant selbst wieder her (Einstellungen → System → Backups); Housekeeper spielt keine Backups ein.",
    undoHousekeeper: "Rückgängig per Housekeeper", undoBackupOnly: "Nur per Backup rückgängig", planDetails: "Details",
    planResult: "Ergebnis der Vorschau", planClose: "Schließen", planCreating: "Erstelle Vorschau …", planError: "Vorschau fehlgeschlagen",
    planSummary: "{total} geprüft: {ok} ohne bekannte Verwendung, {review} zu prüfen, {blocked} blockiert.", planUses: "{count} Verwendungen betroffen", planStats: "{count} mit Langzeitstatistik",
    verdict_ok: "Keine bekannte Verwendung", verdict_review: "Prüfen", verdict_blocked: "Blockiert", journal: "Journal", journalHint: "Frühere Vorschauen (die letzten 50).", journalEmpty: "Noch keine Vorschau erstellt.",
    openPlan: "Öffnen", deletePlan: "Löschen", dryRun: "Dry Run", usedBy: "Verwendet von",
    reason_entity_working: "Die Entity funktioniert noch und ist kein Kandidat.", reason_used_certain: "Wird sicher verwendet – Entfernen würde Verweise brechen.", reason_used_probable: "Wird vermutlich verwendet (Template oder Dashboard).",
    reason_has_statistics: "Hat Langzeitstatistiken im Recorder; sie blieben ohne Entity zurück.", reason_ignored_by_label: "Trägt das Label housekeeper_ignore.", reason_not_found: "Im letzten Scan nicht gefunden.", reason_unsupported_action: "Diese Aktion wird nicht unterstützt.",
    longTermStats: "Langzeitstatistik", yes: "Ja", no: "Nein", statsNote: "Für diese Entity gibt es Langzeitstatistiken im Recorder. Sie blieben nach einem Entfernen bestehen, gehörten dann aber zu keiner Entity mehr.",
    energyDashboard: "Energie-Dashboard",
    orphanStats: "Verwaiste Statistiken", unreferencedEntities: "Entities", noOrphanStats: "Keine verwaisten Statistiken.", noRecorder: "Der Recorder ist nicht verfügbar; es gibt keine Statistiken zu prüfen.",
   
    kindSum: "Zähler (Summe)", kindMean: "Messwert (Mittelwert)", kindBoth: "Zähler und Messwert", inEnergy: "Im Energie-Dashboard", sortUnit: "Einheit", allKinds: "Alle Arten",
    warmupBanner: "Home Assistant startet noch. Die Befunde sind vorläufig und werden nach dem Start neu erhoben; Aufräumen ist bis dahin gesperrt.",
    err_warming_up: "Home Assistant startet noch. Bitte in wenigen Minuten erneut versuchen.",
    staleScan: "Der letzte Scan ist {age} alt. Housekeeper scannt alle {hours} Stunden – die Daten können veraltet sein.", staleScanManual: "Der letzte Scan ist {age} alt.",
    kindDisable: "Deaktivieren (Quarantäne, umkehrbar)", kindRemove: "Entfernen (nach Quarantäne, mit Backup)", actionKind: "Aktion",
    cleanupDryRun: "Nur Vorschau (Dry Run): Housekeeper ändert nichts, bis du einen Plan ausdrücklich bestätigst. Deaktivieren ist umkehrbar und lässt Historie und Statistiken unberührt; Entfernen geht erst nach der Quarantäne und mit Backup.",
    reason_already_disabled: "Die Entity ist bereits deaktiviert.",
    skippedUnacknowledged: "{count} zu prüfende Einträge ohne ausdrückliche Bestätigung werden übersprungen.",
    confirmPlan: "Bestätigen …", confirmPlanTitle: "Plan bestätigen", acknowledgeReview: "Zu prüfen – ausdrücklich bestätigen:", confirmedSummary: "{count} Entities werden deaktiviert (Quarantäne). Das ist jederzeit umkehrbar, solange die Entity unverändert bleibt.",
    confirmTypeWord: "Zur Bestätigung „{word}“ eintippen:", confirmWord: "DEAKTIVIEREN", runNow: "Jetzt ausführen", cancelRun: "Abbrechen", notExecutableYet: "Entfernen ist noch nicht ausführbar; diese Vorschau dient nur der Prüfung.",
    running: "Läuft …", progressOf: "{done} von {total}", undoAll: "Alles rückgängig machen", undoOne: "Rückgängig", tokenExpired: "Die Bestätigung ist abgelaufen. Bitte erneut bestätigen.", nothingExecutable: "Keine ausführbaren Aktionen in diesem Plan.",
    plan_status_dry_run: "Vorschau", plan_status_running: "Läuft", plan_status_executed: "Ausgeführt", plan_status_verified: "Ausgeführt und geprüft", plan_status_partial: "Teilweise ausgeführt", plan_status_aborted: "Abgebrochen", plan_status_undone: "Rückgängig gemacht", plan_status_partially_undone: "Teilweise rückgängig",
    result_done: "Deaktiviert", result_not_run: "Nicht ausgeführt", result_undone: "Rückgängig gemacht",
    abort_entity_changed: "Die Entity wurde nach der Vorschau geändert.", abort_entity_gone: "Die Entity existiert nicht mehr.", abort_now_blocked: "Die Entity wird inzwischen verwendet.", abort_needs_acknowledgement: "Ohne ausdrückliche Bestätigung.", abort_cancelled: "Auf Wunsch abgebrochen.", abort_aborted: "Wegen eines vorherigen Abbruchs.",
    undo_undone: "wieder aktiviert", undo_conflict_changed: "nicht rückgängig gemacht: zwischenzeitlich geändert", undo_conflict_gone: "nicht rückgängig gemacht: Entity existiert nicht mehr",
    verification: "Prüfung nach dem Lauf", check_disabled: "Entity ist deaktiviert", check_no_new_broken_references: "Keine neuen fehlenden Referenzen",
    err_bad_token: "Bestätigung ungültig oder abgelaufen.", err_busy: "Es läuft bereits ein Plan.", sourceUndoPerItem: "Datei zu groß für eine Kopie: Rückgängig stellt diese Quelle nur Eintrag für Eintrag wieder her (Kommentare und Formatierung kehren nicht zurück).", snapshotDropped: "Die Dateikopie wurde aus Platzgründen entfernt; Rückgängig stellt nur einzelne Einträge wieder her.", err_cleanup_busy: "Es läuft gerade ein Plan. Scans sind bis zu seinem Ende gesperrt.", err_plan_not_open: "Dieser Plan wurde bereits bestätigt oder ausgeführt.", err_plan_too_old: "Der Plan ist älter als 24 Stunden. Bitte neu erstellen.", err_nothing_to_do: "Nichts auszuführen: blockierte Einträge laufen nie, „Zu prüfen“ braucht eine ausdrückliche Bestätigung.", err_not_found: "Plan nicht gefunden.",
    quarantine: "Quarantäne", quarantineHint: "Entities, die Housekeeper deaktiviert hat. Entfernen ist frühestens nach {days} Tagen möglich (Aktion „Entfernen“). Das Deaktivieren machst du über das Journal rückgängig.",
    quarantineSince: "seit {date} · {days} Tagen", quarantineWait: "Noch {days} Tage", quarantineReady: "Frühestens entfernbar", quarantineFact: "seit {date} ({days} Tage)",
    confirmWordRemove: "ENTFERNEN", confirmedSummaryRemove: "{count} Entities werden entfernt. Vorher legt Housekeeper ein Home-Assistant-Backup an (das kann dauern) und startet nur, wenn es erfolgreich ist. Wiederherstellen geht, solange die Entity-ID frei ist und die Integration noch existiert.",
    reason_not_quarantined: "Nicht in Quarantäne: erst deaktivieren, nach der Quarantänezeit entfernen.", reason_quarantine_too_short: "Die Quarantäne ist noch zu kurz.", reason_not_restorable: "Nicht wiederherstellbar: Die Integration existiert nicht mehr, das Entfernen wäre endgültig.",
    abort_backup_failed: "Das Backup ist fehlgeschlagen – es wurde nichts geändert.", abort_backup_unavailable: "Die Backup-Komponente ist nicht verfügbar – es wurde nichts geändert.", abort_no_backup_agent: "Es ist kein Backup-Ziel eingerichtet (Einstellungen → System → Backups) – es wurde nichts geändert.",
    result_removed: "Entfernt", undo_restored: "wiederhergestellt (wieder in Quarantäne)", undo_conflict_taken: "nicht wiederhergestellt: Entity-ID inzwischen belegt", undo_conflict_unrestorable: "nicht wiederhergestellt: Integration existiert nicht mehr",
    check_removed: "Entity ist entfernt", plan_status_backup: "Backup läuft", backupRunning: "Backup läuft … das kann etwas dauern.", daysLeftShort: "noch {days} Tage", removalCandidatesHint: "Entities in Quarantäne. Entfernen ist erst nach {days} Tagen möglich.", removalReady: "Bereit", waitingShort: "Wartet",
    perPage: "Pro Seite", cleanup: "Aufräumen", cleanupHint: "Hinweise, die einen Blick wert sind",
    unreferenced: "Nicht verwendet", unreferencedSubtitle: "Aktive Entities, die in keiner Automation, keinem Skript, keiner Szene, Gruppe, keinem Helfer und keinem lesbaren Dashboard vorkommen.",
    unreferencedHint: "Nur ein Hinweis, keine Empfehlung zum Löschen: Entities können auch über Sprachassistenten, Apps, das Energie-Dashboard, automatisch erzeugte Dashboards oder externe Systeme genutzt werden. Diagnose- und Konfigurations-Entities sind ausgeblendet.",
    noUnreferenced: "Alle aktiven Entities werden irgendwo verwendet.", unrefShown: "{shown} von {total} angezeigt – nach Domäne filtern, um weitere zu sehen.", allDomains: "Alle Domänen",
    noBatteries: "Keine Batterie-Entities gefunden.", batteryLevel: "Ladestand", integrationProblems: "Integrationen mit Problemen",
    integrationProblemsHint: "Diese Integrationen sind nicht geladen. Ihre Entities sind nicht verfügbar.",
    backTo: "Zurück zu", facts: "Eckdaten", relations: "Beziehungen", showInGraph: "Im Abhängigkeitsdiagramm", noState: "Kein Zustand vorhanden", notExpected: "Nicht erwartet",
    available: "Verfügbar", causeLabel: "Ursache", hintLabel: "Empfehlung", certainty: "Sicherheit", finding: "Befund", noFinding: "Kein Befund",
    belowThreshold: "Noch kein Befund: nicht verfügbare Entities werden erst nach {days} Tagen gemeldet.", refCount: "Verwendet von",
    moreItems: "und {count} weitere", automationOff: "Automation ist ausgeschaltet", refsResolved: "Alle Referenzen aufgelöst", entities: "Entities",
    cs_loaded: "Geladen", cs_setup_error: "Fehler beim Einrichten", cs_setup_retry: "Einrichtung wird wiederholt", cs_not_loaded: "Nicht geladen",
    cs_migration_error: "Fehler bei der Migration", cs_failed_unload: "Entladen fehlgeschlagen", cs_setup_in_progress: "Wird eingerichtet",
    missing_entity: "Entity", missing_device: "Gerät", missing_area: "Bereich", missing_floor: "Etage", missing_label: "Label",
    cause_ok: "Integration, Gerät und Zustand sind in Ordnung. Hier ist nichts zu tun.",
    cause_entity_disabled: "Die Entity wurde deaktiviert und besitzt deshalb keinen Zustand. Das ist kein Fehler.",
    cause_device_disabled: "Das zugehörige Gerät ist deaktiviert, daher liefert die Entity keinen Zustand. Das ist kein Fehler.",
    cause_integration_disabled: "Die zugehörige Integration ist deaktiviert, daher liefert die Entity keinen Zustand. Das ist kein Fehler.",
    cause_device_missing: "Die Entity verweist auf ein Gerät, das nicht mehr in der Geräte-Registry existiert. Der Registry-Eintrag ist sehr wahrscheinlich ein Überbleibsel.",
    cause_config_entry_missing: "Die Integration, zu der die Entity gehört, wurde entfernt. Der Registry-Eintrag ist verwaist.",
    cause_state_missing: "Die Entity ist registriert, aber die Integration stellt sie nicht mehr bereit. Typisch nach dem Umbau einer Integration, geänderter unique_id oder entferntem Gerät.",
    cause_state_missing_integration: "Die Integration ist nicht geladen ({state}). Deshalb fehlt der Zustand der Entity.",
    cause_state_unavailable: "Integration und Gerät sind vorhanden, aber die Integration meldet die Entity als nicht verfügbar. Meist ist das Gerät oder der Dienst nicht erreichbar, etwa ausgeschaltet, ohne Netzwerk oder Cloud-Ausfall.",
    cause_state_unavailable_integration: "Die Integration ist nicht geladen ({state}). Ihre Entities sind deshalb nicht verfügbar.",
    cause_state_unknown: "Die Integration hat bisher keinen Wert geliefert. Das ist nach einem Neustart oder bei selten aktualisierten Entities normal.",
    hint_state_unavailable: "Gerät oder Dienst auf Erreichbarkeit prüfen. Ist es erreichbar, die Integration neu laden.",
    hint_integration: "In den Integrationen die Fehlermeldung der Integration prüfen und sie neu laden.",
    hint_state_unknown: "Abwarten. Bleibt der Zustand dauerhaft unbekannt, die Integration prüfen.",
    hint_orphan: "Vor dem Entfernen unter Beziehungen prüfen, ob Automationen oder andere Objekte die Entity noch verwenden.",
    cause_device_active: "Das Gerät ist aktiv und stellt Entities bereit.",
    cause_device_empty: "Dem Gerät ist keine Entity zugeordnet. Möglicherweise ist es ein Überbleibsel.",
    cause_device_off: "Das Gerät ist deaktiviert. Das ist kein Fehler.",
    cause_entry_ok: "Die Integration ist geladen.",
    cause_entry_problem: "Die Integration ist nicht geladen ({state}). Ihre Entities sind deshalb nicht verfügbar.",
    cause_entry_off: "Die Integration ist deaktiviert. Das ist kein Fehler.",
    cause_automation_ok: "Alle Referenzen zeigen auf vorhandene Objekte.",
    cause_automation_broken: "{count} Referenz(en) zeigen auf Objekte, die nicht mehr existieren. An diesen Stellen läuft das Objekt ins Leere.",
    hint_automation_broken: "Die fehlenden Referenzen ersetzen oder entfernen.",
  },
  en: {
    title: "Housekeeper", subtitle: "Keep your Home Assistant installation in view",
    overview: "Overview", inventory: "Inventory", graph: "Dependencies", findingsNav: "Findings",
    navMain: "Main navigation", navMenu: "Menu", enabled: "enabled", agoNow: "just now", agoMinutes: "{n} min ago", agoHours: "{n} h ago", agoDays: "{n} days ago", navGroupOverview: "Overview", navGroupOperation: "Operation", navGroupExplore: "Explore", navGroupMaintain: "Maintain", navGroupSpecial: "Special views",
    scan: "Scan now", exportJson: "JSON", exportCsv: "CSV", exportTitle: "Export findings", scanning: "Scanning …", all: "All types",
    allStatus: "All states", search: "Name, ID, integration …",
    name: "Name", type: "Type", status: "Status", reason: "Reason",
    tabsLabel: "Sections of the object", tabOverview: "Overview", tabRelations: "Dependencies", tabTechnical: "Technical data", tabAttributes: "Attributes",
    sumCause: "Cause", sumIntegration: "Integration", sumDevice: "Device", sumArea: "Area", sumRisk: "Risk when removed", riskNone: "no use found", riskHits: "{n} uses, certain: {c}",
    since: "Observed since", dependencies: "Relations", objects: "Objects",
    findings: "Findings", active: "Active", orphaned: "Orphaned",
    unavailable: "Unavailable", disabled: "Disabled", unknown: "Unknown",
    empty: "Empty", problem: "Problem", details: "Details", close: "Close",
    noResults: "No matching objects found.",
    lastScan: "Last scan", evidence: "Evidence", registry: "Registry",
    state: "State & attributes", incoming: "Incoming", outgoing: "Outgoing",
    graphMode: "View", graphList: "List", graphGraph: "Graph", graphDepth: "Levels", graphRelation: "Relation type", graphAllRelations: "All relations", graphConfidence: "Certainty", graphAllConf: "All certainties", graphCertainOnly: "Certain only",
    graphImpact: "What breaks when removed?", graphBreaks: "breaks", graphLabel: "Dependency graph of {name}", graphNodes: "Objects: {n}", graphMore: "Show more",
    graphLegend: "Solid: certain · Dashed: probable · Red dotted: cycle · Red outline: breaks when removed · Dashed outline: object is missing.",
    graphMissing: "Missing targets: {n}", graphProbable: "Probable relations: {n}", graphCycles: "Cycles: {n}", graphHidden: "Hidden: {n}", graphHitsOutside: "{n} affected objects are outside the graph (choose more levels)",
    graphHint: "Select an object to inspect its direct relationships.",
    select: "Select object", firstObservation: "First confirmed observation by Housekeeper",
    entity: "Entity", device: "Device", config_entry: "Integration", area: "Area",
    automation: "Automation", script: "Script", scene: "Scene", dashboard: "Dashboard", SHOWS: "shows", entity_disabled: "Entity was disabled",
    floor: "Floor", label: "Label", broken_reference: "Broken reference",
    triggers: "Triggers", conditions: "Conditions", actions: "Actions",
    automationStructure: "Automation structure", previous: "Previous", next: "Next",
    page: "Page", of: "of", missingReferences: "Missing references",
    integration_disabled: "Related integration was disabled",
    device_disabled: "Related device was disabled",
    device_missing: "Related device no longer exists in the device registry",
    config_entry_missing: "Related config entry is missing",
    state_missing: "Entity is registered but has no state",
    state_unavailable: "Integration reports unavailable",
    state_unknown: "Integration reports unknown", state_available: "State is available",
    loading: "Loading inventory …", loadError: "Could not load inventory",
    total: "Total",
    recentFindings: "Current findings", affected: "Affected object",
    systemState: "System health", health: "Housekeeping status", healthGood: "Good", healthCheck: "Review",
    healthBad: "Problematic", healthHint: "Share of entities, automations, scripts and scenes without findings", healthTip: "Affected objects are counted, not single findings. Hidden findings and other object types (dashboards, devices, helpers) do not count. The value is rounded. Affected: {affected} of {base}.",
    openFindings: "Open findings", needsAttention: "Needs attention",
    actTitle: "What needs doing now?", actSub: "Sorted by urgency", actNone: "Nothing to do. Last scan: {date}.",
    actIntegrations: "Integrations with a problem", actIntegrationsHint: "Entries that are not loaded or report errors",
    actNewCritical: "New critical findings", actNewCriticalHint: "Since the last scan: unavailable, broken reference or problem",
   
    actQuarantine: "Quarantine over", actQuarantineHint: "Ready for removal once you confirm",
    trendTitle: "Since the last scan", trendSince: "Compared with the scan of {date}", trendNewFindings: "New findings", trendResolved: "Resolved", trendChanged: "Status changes", trendNewObjects: "New objects", trendNone: "No changes since the scan of {date}.",
    sortedBySure: "Sorted by diagnosis confidence", allFindings: "All findings",
    inventoryStatus: "Inventory status", byType: "By object type", noFindings: "No findings – everything looks fine.",
    openInHA: "Open in Home Assistant", diagnosis: "Root-cause diagnosis", present: "Present", missing: "Missing",
    certain: "Confirmed", probable: "Probable", confidence: "Confidence", origin: "Origin",
    usage: "Usage", pathTitle: "Dependency path", pathSubtitle: "Inspect the origin and usage of an object.",
    searchObject: "Search object …", noRelations: "No relationships found.", firstSeenNote: "since first observation",
    findingsSubtitle: "All diagnoses with a link to the affected object.", inventorySubtitle: "All recorded objects of the installation.",
    scanDone: "Scan up to date", of_total: "of", shown: "shown", integration: "Integration",
    PROVIDES: "provides", OWNS: "owns", CONTAINS: "contains", VIA_DEVICE: "via device",
    TRIGGERS_ON: "triggers on", USES_AS_CONDITION: "checks as condition", TARGETS: "targets", REFERENCES: "references",
    runtimeState: "Runtime state", usedBy: "used by",
    impactTitle: "Impact of removal", impactSubtitle: "Analysis only – Housekeeper removes nothing.",
    impactNone: "No known usage", impactNoneText: "No automation, script, scene or dashboard uses this object or its related entities.",
    impactCertain: "Not safe to remove", impactCertainText: "{count} automation(s), script(s), scene(s) or dashboard(s) reference this object for certain and would run into nothing.",
    impactProbable: "Check first", impactProbableText: "{count} automation(s), script(s), scene(s) or dashboard(s) probably reference it (for example through templates).",
    impactScope: "Covers this object and {count} related entities.", impactScopeOne: "Covers only this object.",
    impactLimits: "Not checked: auto-generated dashboards, the state history in the recorder, and external systems.",
    changes: "Changes", changesSubtitle: "What changed since an earlier scan.", compareWith: "Compare with", previousScan: "Previous scan",
    historyTitle: "Scan history", historyHint: "The last scan of each day is kept for {days} days. Click one to use it as the comparison base.", historyBuilding: "The history is building up: Housekeeper keeps the last scan of each day for {days} days (adjustable in Settings). More comparison points appear with each new day.", currentScan: "Current scan", storedScan: "Stored scan", historyCounts: "{objects} objects · {findings} findings", optHistoryDays: "Keep scan history for (days)",
    noChanges: "No changes since this scan.",
    statusChanges: "Status changes", newFindings: "New findings", resolvedFindings: "Resolved findings", newObjects: "New objects", removedObjects: "Removed objects",
    worsened: "Worse", changedLabel: "Changed", improved: "Better", gone: "No longer present", comparedWith: "Compared with the scan from",
    possible_duplicate: "Possible duplicate", unused: "Unused", duplicateOf: "Possible duplicate of", lastTriggered: "Last triggered", never: "Never",
    "automation.never_triggered": "Never triggered", "automation.stale": "Not triggered for a long time", "automation.disabled_long": "Switched off for a long time",
    cause_never_triggered: "The automation is switched on but has never run in at least {days} days. A trigger may no longer match, or it may not be needed any more.",
    cause_stale: "The automation has not run for {days} days. A trigger may no longer match, or it may not be needed any more.",
    cause_disabled_long: "The automation has been switched off for {days} days. If it is not needed any more, it can be removed later.",
    hint_unused: "Check whether the automation is still needed. Housekeeper changes nothing.",
    cause_duplicate: "A working entity with an almost identical ID from the same integration exists ({twin}). This one is very likely a leftover, for example after re-adding the device.",
    hint_duplicate: "Open the working entity and compare. Only when nothing references this entity any more is it a candidate for removal.",
    duplicateTwin: "Working entity",
    INCLUDES: "has as member", missing_member: "Group member",
    cause_group_broken: "The group contains {count} member(s) that no longer exist.", hint_group_broken: "Edit the group and remove the missing members.",
    cause_helper_broken: "This helper builds on {count} entity/entities that no longer exist.", hint_helper_broken: "Edit the helper and replace the missing sources.",
    hideFinding: "Hide finding", showFinding: "Show again", ignoredLabel: "Hidden", showIgnored: "Show hidden",
    ignoredByLabel: "Hidden by the label housekeeper_ignore", findingsOfObject: "Findings for this object",
    batteries: "Batteries", batteriesSubtitle: "Battery entities, lowest values first.", batteryLow: "Low", batteryAll: "All",
    settings: "Settings", settingsSubtitle: "About Housekeeper and appearance options.", about: "About Housekeeper", version: "Version", haVersion: "Home Assistant",
    mode: "Mode", readOnlyValue: "Reads and analyzes; changes only after explicit confirmation", scanInterval: "Automatic scan", unavailableAfter: "Unavailable becomes a finding after", unusedAfter: "Unused automations after", lowBatteryAt: "Low battery at",
    daysValue: "{n} days", hoursValue: "every {n} hours", offValue: "Off", immediately: "immediately", openOptions: "Open options", reportIssue: "Report an issue", changelog: "Changelog", repository: "GitHub", copyInfo: "Copy info", copied: "Copied",
    appearance: "Appearance", fontSize: "Font size", fontSmall: "Small", fontNormal: "Normal", fontLarge: "Large", colorMode: "Mode", modeAuto: "Automatic", modeLight: "Light", modeDark: "Dark", modeHint: "Automatic follows the Home Assistant theme.",
    colorScheme: "Color scheme", schemeStandard: "Standard", schemeHousekeeper: "Housekeeper", schemeModern: "Modern", behavior: "Behavior", startView: "Start view", pageSizeSetting: "Entries per page", resetPrefs: "Reset settings",
    hiddenFindings: "Hidden findings", hiddenNone: "No findings hidden.", hiddenHint: "Hidden findings can be shown again here.",
    sortBy: "Sort by", sortCertainty: "Certainty", sortName: "Name", sortId: "Object ID", sortSince: "Detected since", sortRule: "Rule",
    sortLevel: "Level", sortArea: "Area", sortType: "Type", sortStatus: "Status", allTypes: "All types", allAreas: "All areas",
    sortAscending: "Ascending", sortDescending: "Descending", searchList: "Search this list …", noMatches: "No matches for these filters.",
    density: "Density", densityNormal: "Normal", densityCompact: "Compact", motion: "Animation", motionAuto: "Like system", motionReduced: "Reduced",
    motionHint: "Like system follows your device's “reduce motion” setting.", prefsNote: "Appearance is stored in your Home Assistant user profile (and in this browser as well).",
    scanSettings: "Scan and thresholds", scanSettingsHint: "Changes the integration options. Housekeeper reloads afterwards.", optMinUnavailable: "Unavailable becomes a finding after (days, 0 = immediately)",
    optUnusedAutomation: "Unused automations after (days, 0 = off)", optScanInterval: "Automatic scan every (hours, 0 = off)", optLowBattery: "Low battery at (percent)",
    saveOptions: "Save", optionsSaved: "Saved. Housekeeper is reloading …", optionsInvalid: "Please enter values within the allowed range.",
    cleanupSubtitle: "Preview for tidying up: Housekeeper checks candidates and records the result. Nothing is changed.",
    cleanupCandidates: "Candidates", cleanupCandidatesHint: "Orphaned and long-unavailable entities.", cleanupNone: "No candidates found.",
    selectPage: "Select page", clearSelection: "Clear selection", createPlan: "Create preview", selectedCount: "{count} selected",
    stepsLabel: "Steps of the plan", stepSelect: "Selection", stepAnalysis: "Impact analysis", stepConfirm: "Confirmation", stepBackup: "Backup", stepRun: "Execution", stepVerify: "Verification",
    stepDone: "done", stepCurrent: "current", stepTodo: "pending", stepSkipped: "not needed", stepFailed: "failed",
    stepAnalysisBlocked: "No executable action", stepBackupSkipped: "Not needed: everything can be taken back by Housekeeper", stepBackupDone: "Created {date}{job}", stepBackupJob: " · job {id}",
    stepRunPartial: "Only partly executed", stepVerifyFailed: "The check found irregularities",
    backupRestoreHint: "Only Home Assistant itself restores a backup (Settings → System → Backups); Housekeeper does not restore backups.",
    undoHousekeeper: "Undo by Housekeeper", undoBackupOnly: "Backup only", planDetails: "Details",
    planResult: "Preview result", planClose: "Close", planCreating: "Creating preview …", planError: "Preview failed",
    planSummary: "{total} checked: {ok} with no known use, {review} to review, {blocked} blocked.", planUses: "{count} uses affected", planStats: "{count} with long-term statistics",
    verdict_ok: "No known use", verdict_review: "Review", verdict_blocked: "Blocked", journal: "Journal", journalHint: "Earlier previews (the last 50).", journalEmpty: "No preview created yet.",
    openPlan: "Open", deletePlan: "Delete", dryRun: "Dry run", usedBy: "Used by",
    reason_entity_working: "The entity still works and is not a candidate.", reason_used_certain: "Definitely in use – removing it would break references.", reason_used_probable: "Probably in use (template or dashboard).",
    reason_has_statistics: "Has long-term statistics in the recorder; they would be left without an entity.", reason_ignored_by_label: "Carries the label housekeeper_ignore.", reason_not_found: "Not found in the latest scan.", reason_unsupported_action: "This action is not supported.",
    longTermStats: "Long-term statistics", yes: "Yes", no: "No", statsNote: "This entity has long-term statistics in the recorder. They would remain after a removal but belong to no entity any more.",
    energyDashboard: "Energy dashboard",
    orphanStats: "Orphaned statistics", unreferencedEntities: "Entities", noOrphanStats: "No orphaned statistics.", noRecorder: "The recorder is not available; there are no statistics to check.",
   
    kindSum: "Counter (sum)", kindMean: "Measurement (mean)", kindBoth: "Counter and measurement", inEnergy: "In the Energy dashboard", sortUnit: "Unit", allKinds: "All kinds",
    warmupBanner: "Home Assistant is still starting. The findings are preliminary and will be collected again after startup; cleanup is locked until then.",
    err_warming_up: "Home Assistant is still starting. Please try again in a few minutes.",
    staleScan: "The last scan is {age} old. Housekeeper scans every {hours} hours – the data may be out of date.", staleScanManual: "The last scan is {age} old.",
    kindDisable: "Disable (quarantine, reversible)", kindRemove: "Remove (after quarantine, with backup)", actionKind: "Action",
    cleanupDryRun: "Preview only (dry run): Housekeeper changes nothing until you explicitly confirm a plan. Disabling is reversible and leaves history and statistics untouched; removal only works after the quarantine and with a backup.",
    reason_already_disabled: "The entity is already disabled.",
    skippedUnacknowledged: "{count} entries to review without explicit confirmation will be skipped.",
    confirmPlan: "Confirm …", confirmPlanTitle: "Confirm plan", acknowledgeReview: "To review – confirm explicitly:", confirmedSummary: "{count} entities will be disabled (quarantine). This is reversible at any time while the entity stays unchanged.",
    confirmTypeWord: "Type “{word}” to confirm:", confirmWord: "DISABLE", runNow: "Run now", cancelRun: "Cancel", notExecutableYet: "Removal cannot be executed yet; this preview is for checking only.",
    running: "Running …", progressOf: "{done} of {total}", undoAll: "Undo all", undoOne: "Undo", tokenExpired: "The confirmation expired. Please confirm again.", nothingExecutable: "No executable actions in this plan.",
    plan_status_dry_run: "Preview", plan_status_running: "Running", plan_status_executed: "Executed", plan_status_verified: "Executed and verified", plan_status_partial: "Partially executed", plan_status_aborted: "Aborted", plan_status_undone: "Undone", plan_status_partially_undone: "Partially undone",
    result_done: "Disabled", result_not_run: "Not executed", result_undone: "Undone",
    abort_entity_changed: "The entity was changed after the preview.", abort_entity_gone: "The entity no longer exists.", abort_now_blocked: "The entity is in use now.", abort_needs_acknowledgement: "Not explicitly confirmed.", abort_cancelled: "Cancelled on request.", abort_aborted: "Because of an earlier abort.",
    undo_undone: "enabled again", undo_conflict_changed: "not undone: changed in the meantime", undo_conflict_gone: "not undone: the entity no longer exists",
    verification: "Check after the run", check_disabled: "Entity is disabled", check_no_new_broken_references: "No new missing references",
    err_bad_token: "Confirmation invalid or expired.", err_busy: "A plan is already running.", sourceUndoPerItem: "File too large to copy: undo restores this source item by item only (comments and formatting do not come back).", snapshotDropped: "The file copy was dropped to save space; undo restores single items only.", err_cleanup_busy: "A plan is running right now. Scans are locked until it ends.", err_plan_not_open: "This plan was already confirmed or executed.", err_plan_too_old: "The plan is older than 24 hours. Please create it again.", err_nothing_to_do: "Nothing to execute: blocked entries never run, “to review” needs an explicit confirmation.", err_not_found: "Plan not found.",
    quarantine: "Quarantine", quarantineHint: "Entities Housekeeper has disabled. Removal is possible no earlier than after {days} days (action “Remove”). You can undo the disabling from the journal.",
    quarantineSince: "since {date} · {days} days", quarantineWait: "{days} days to go", quarantineReady: "Removable at the earliest", quarantineFact: "since {date} ({days} days)",
    confirmWordRemove: "REMOVE", confirmedSummaryRemove: "{count} entities will be removed. Housekeeper creates a Home Assistant backup first (this can take a while) and only continues if it succeeds. Restoring works while the entity ID is free and the integration still exists.",
    reason_not_quarantined: "Not in quarantine: disable first, remove after the quarantine period.", reason_quarantine_too_short: "The quarantine is still too short.", reason_not_restorable: "Not restorable: the integration no longer exists, so the removal would be final.",
    abort_backup_failed: "The backup failed – nothing was changed.", abort_backup_unavailable: "The backup component is not available – nothing was changed.", abort_no_backup_agent: "No backup location is set up (Settings → System → Backups) – nothing was changed.",
    result_removed: "Removed", undo_restored: "restored (back in quarantine)", undo_conflict_taken: "not restored: entity ID is taken now", undo_conflict_unrestorable: "not restored: the integration no longer exists",
    check_removed: "Entity is removed", plan_status_backup: "Backup running", backupRunning: "Backup running … this can take a while.", daysLeftShort: "{days} days to go", removalCandidatesHint: "Entities in quarantine. Removal is possible only after {days} days.", removalReady: "Ready", waitingShort: "Waiting",
    perPage: "Per page", cleanup: "Tidy up", cleanupHint: "Hints worth a look",
    unreferenced: "Not used", unreferencedSubtitle: "Active entities that appear in no automation, script, scene, group, helper, or readable dashboard.",
    unreferencedHint: "A hint only, not a recommendation to delete: entities can also be used by voice assistants, apps, the energy dashboard, auto-generated dashboards, or external systems. Diagnostic and configuration entities are hidden.",
    noUnreferenced: "Every active entity is used somewhere.", unrefShown: "Showing {shown} of {total} – filter by domain to see more.", allDomains: "All domains",
    noBatteries: "No battery entities found.", batteryLevel: "Level", integrationProblems: "Integrations with problems",
    integrationProblemsHint: "These integrations are not loaded. Their entities are unavailable.",
    backTo: "Back to", facts: "Key facts", relations: "Relationships", showInGraph: "In dependency graph", noState: "No state available", notExpected: "Not expected",
    available: "Available", causeLabel: "Cause", hintLabel: "Recommendation", certainty: "Confidence", finding: "Finding", noFinding: "No finding",
    belowThreshold: "Not a finding yet: unavailable entities are reported only after {days} days.", refCount: "Used by",
    moreItems: "and {count} more", automationOff: "Automation is turned off", refsResolved: "All references resolved", entities: "Entities",
    cs_loaded: "Loaded", cs_setup_error: "Setup error", cs_setup_retry: "Retrying setup", cs_not_loaded: "Not loaded",
    cs_migration_error: "Migration error", cs_failed_unload: "Unload failed", cs_setup_in_progress: "Setting up",
    missing_entity: "Entity", missing_device: "Device", missing_area: "Area", missing_floor: "Floor", missing_label: "Label",
    cause_ok: "Integration, device and state are fine. Nothing to do here.",
    cause_entity_disabled: "The entity was disabled and therefore has no state. This is not an error.",
    cause_device_disabled: "The related device is disabled, so the entity provides no state. This is not an error.",
    cause_integration_disabled: "The related integration is disabled, so the entity provides no state. This is not an error.",
    cause_device_missing: "The entity points to a device that no longer exists in the device registry. The registry entry is very likely a leftover.",
    cause_config_entry_missing: "The integration this entity belongs to was removed. The registry entry is orphaned.",
    cause_state_missing: "The entity is registered, but the integration no longer provides it. Typical after an integration rework, a changed unique_id or a removed device.",
    cause_state_missing_integration: "The integration is not loaded ({state}), which is why the entity has no state.",
    cause_state_unavailable: "Integration and device exist, but the integration reports the entity as unavailable. Usually the device or service is unreachable, for example powered off, offline or a cloud outage.",
    cause_state_unavailable_integration: "The integration is not loaded ({state}), so its entities are unavailable.",
    cause_state_unknown: "The integration has not delivered a value yet. This is normal after a restart or for rarely updated entities.",
    hint_state_unavailable: "Check whether the device or service is reachable. If it is, reload the integration.",
    hint_integration: "Check the integration's error message under integrations and reload it.",
    hint_state_unknown: "Wait. If the state stays unknown permanently, check the integration.",
    hint_orphan: "Before removing it, check under relationships whether automations or other objects still use the entity.",
    cause_device_active: "The device is active and provides entities.",
    cause_device_empty: "No entity is assigned to the device. It may be a leftover.",
    cause_device_off: "The device is disabled. This is not an error.",
    cause_entry_ok: "The integration is loaded.",
    cause_entry_problem: "The integration is not loaded ({state}), so its entities are unavailable.",
    cause_entry_off: "The integration is disabled. This is not an error.",
    cause_automation_ok: "All references point to existing objects.",
    cause_automation_broken: "{count} reference(s) point to objects that no longer exist. At these places the object runs into nothing.",
    hint_automation_broken: "Replace or remove the missing references.",
  },
};

const ICONS = {
  entity: "mdi:shape-outline", device: "mdi:devices", config_entry: "mdi:puzzle-outline",
  area: "mdi:floor-plan", automation: "mdi:robot-outline", floor: "mdi:layers-outline",
  label: "mdi:label-outline", script: "mdi:script-text-outline", scene: "mdi:palette-outline", dashboard: "mdi:view-dashboard-outline",
};

const REMOVAL_KINDS = ["remove_entity", "remove_device", "forget_device"];
// Kinds that get a Home Assistant backup first (as in the backend).
const BACKUP_KINDS = ["remove_entity", "remove_device", "forget_device", "replace_references", "migrate_meter"];
const BACKUP_FAILURES = ["backup_failed", "backup_unavailable", "no_backup_agent"];
const DEVICE_KINDS = ["disable_device", "remove_device", "forget_device"];

const PREFS_KEY = "ha_housekeeper.prefs";
const DEFAULT_PREFS = { size: "normal", mode: "auto", scheme: "standard", density: "normal", motion: "auto", pageSize: 20, startView: "overview", graphMode: "list" };
const USER_DATA_KEY = "ha_housekeeper";
const OPTION_LIMITS = { min_unavailable_days: [0, 365], unused_automation_days: [0, 3650], scan_interval_hours: [0, 720], low_battery_percent: [1, 100], history_days: [1, 365] };
// Text scale only; spacing and icons stay put. Normal is a bit larger than the original 1.0.
const SIZES = { small: 1, normal: 1.1, large: 1.25 };
// The dependency graph shows this many nodes per side at first; "more" adds another step.
const GRAPH_NODE_STEP = 40;
const START_VIEWS = ["overview", "findingsNav", "inventory", "changes", "batteries"];
const REPO_URL = "https://github.com/bertel2020/HA-Housekeeping";
// Palettes for explicit light/dark; taken from the Zeitarchiv app's design system (app.css).
// "standard" keeps the Home Assistant accent and, in automatic mode, the Home Assistant theme itself.
const SCHEMES = {
  standard: {
    light: { accent: "var(--primary-color,#0789cf)", bg: "#f3f3f3", surface: "#ffffff", soft: "#ececec", text: "#202020", muted: "#5e5e5e", border: "#e6e6e6", positive: "#2e7d32", warning: "#b77a00", danger: "#b30532" },
    dark: { accent: "var(--primary-color,#37c8fd)", on: "#141414", bg: "#141414", surface: "#202020", soft: "#363636", text: "#f3f3f3", muted: "#cccccc", border: "#4a4a4a", positive: "#66bb6a", warning: "#ffd166", danger: "#fd8f90" },
  },
  housekeeper: {
    light: { accent: "#0c6b5d", bg: "#f5f6f1", surface: "#ffffff", soft: "#eef1e9", text: "#131c17", muted: "#4b584e", border: "#e1e6db", positive: "#2e7d46", warning: "#8a6d1e", danger: "#a23b36" },
    dark: { accent: "#4fc3ae", on: "#0e1512", bg: "#0e1512", surface: "#171f1b", soft: "#1e2822", text: "#e8ece4", muted: "#9fac9b", border: "#2a362f", positive: "#6fcb88", warning: "#d4b65e", danger: "#e28a85" },
  },
  modern: {
    light: { accent: "#3157c8", bg: "#f6f7fb", surface: "#ffffff", soft: "#eef1f6", text: "#172033", muted: "#566176", border: "#d9dee8", positive: "#1f8a54", warning: "#a96700", danger: "#c83737" },
    dark: { accent: "#7ea1ff", on: "#0f1218", bg: "#0f1218", surface: "#171c25", soft: "#222936", text: "#f3f6fb", muted: "#b3bdcc", border: "#303949", positive: "#5fcb89", warning: "#e6a15a", danger: "#f07a7a" },
  },
};
// Earlier builds saved other scheme names.
const SCHEME_ALIASES = { teal: "housekeeper", amber: "housekeeper", sage: "housekeeper", zeitarchiv: "housekeeper", indigo: "modern" };

const USAGE_RELATIONS = ["TRIGGERS_ON", "USES_AS_CONDITION", "TARGETS", "REFERENCES", "SHOWS", "INCLUDES"];

// Pause after the last key stroke in a search field before the list is rebuilt.
const SEARCH_DEBOUNCE_MS = 150;

const NAV = [
  ["overview", "mdi:view-dashboard-outline"],
  ["findingsNav", "mdi:alert-outline"],
  ["changes", "mdi:compare-horizontal"],
  ["inventory", "mdi:database-outline"],
  ["graph", "mdi:source-fork"],
  ["cleanup", "mdi:broom"],
  ["maintenance", "mdi:wrench-clock"],
  ["reliability", "mdi:chart-timeline-variant"],
  ["runs", "mdi:robot-outline"],
  ["batteries", "mdi:battery-alert-variant-outline"],
  ["unreferenced", "mdi:link-variant-off"],
  ["settings", "mdi:cog-outline"],
];

// The sidebar groups every view but "settings", which stands alone at the foot.
const NAV_GROUPS = [
  ["navGroupOverview", ["overview", "findingsNav", "changes"]],
  ["navGroupOperation", ["reliability", "runs"]],
  ["navGroupExplore", ["inventory", "graph"]],
  ["navGroupMaintain", ["cleanup", "maintenance"]],
  ["navGroupSpecial", ["batteries", "unreferenced"]],
];
const NAV_ICONS = Object.fromEntries(NAV);

// IBM Plex, shipped with the integration. A shadow root cannot declare fonts, so the rules go into the document once.
const FONT_BASE = "/ha_housekeeper/fonts/";
const FONT_CSS = `@font-face{font-family:"IBM Plex Sans";font-weight:400 700;font-display:swap;src:url(${FONT_BASE}ibm-plex-sans-latin.woff2) format("woff2");unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD}@font-face{font-family:"IBM Plex Sans";font-weight:400 700;font-display:swap;src:url(${FONT_BASE}ibm-plex-sans-latin-ext.woff2) format("woff2");unicode-range:U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF}@font-face{font-family:"IBM Plex Mono";font-weight:400;font-display:swap;src:url(${FONT_BASE}ibm-plex-mono-400-latin.woff2) format("woff2");unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD}@font-face{font-family:"IBM Plex Mono";font-weight:500;font-display:swap;src:url(${FONT_BASE}ibm-plex-mono-500-latin.woff2) format("woff2");unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD}`;

const STATUS_TONE = {
  active: "ok", orphaned: "warn", unavailable: "red", problem: "red", broken_reference: "red",
  disabled: "mute", empty: "mute", unknown: "violet", ignored: "mute", possible_duplicate: "violet", unused: "mute",
};

// Finding classes that call for action when they are new.
const CRITICAL_CLASSES = ["broken_reference", "unavailable", "problem"];

// Object types the housekeeping status is calculated from.
const HEALTH_TYPES = ["entity", "automation", "script", "scene"];

// Texts for step C of the cleanup (devices, replacing references); merged into TEXT.
Object.assign(TEXT.de, {
  statSuccessors: "Mögliche Nachfolger:", orphanStatsHint: "Langzeitstatistiken im Recorder, zu denen es keine Entity mehr gibt, zum Beispiel nach Löschen, Umbenennen oder einem Gerätewechsel. Sie kosten nur Platz. Wurde die Entity umbenannt oder ersetzt, lässt sich die Statistik auf die neue übernehmen: Aufräumen → Zählerwechsel (Statistik fortführen). Ist sie wirklich weg, kannst du die Statistik in Home Assistant unter Entwicklerwerkzeuge → Statistiken entfernen. Housekeeper löscht hier nichts. Nachfolger sind Vermutungen aus Name und Einheit.",
  noBaselinePreliminary: "Der letzte Scan war vorläufig, weil Home Assistant gerade gestartet ist. Vorläufige Scans werden nicht gespeichert. Scanne in ein paar Minuten erneut, dann gibt es einen ersten Vergleichspunkt.", noBaselineOneScan: "Es gibt erst einen gespeicherten Scan. Ein Vergleich braucht zwei: Scanne nach Änderungen an deiner Installation erneut oder warte auf den automatischen Scan (alle {hours} Stunden). Jeder Scan wird als Vergleichspunkt gespeichert.", scanPoint: "Jetzt scannen und Vergleichspunkt setzen",
  releaseAction: "Aus Quarantäne holen", releaseQuestion: "Wieder aktivieren?", releaseNothing: "Nichts zurückzuholen: schon nicht mehr in Quarantäne",
  kindDisableDevice: "Gerät deaktivieren (Quarantäne, umkehrbar)", kindRemoveDevice: "Gerät entfernen (nach Quarantäne, mit Backup)",
  kindForgetDevice: "Gerät lokal vergessen (erzwingen, nach Quarantäne, mit Backup)", kindReplace: "Verweise ersetzen (alt → neu, mit Backup)",
  reason_device_has_working_entities: "Mindestens eine Entity des Geräts funktioniert noch.", reason_has_children: "Andere Geräte hängen an diesem Gerät (Hub oder Koordinator).",
  reason_integration_no_support: "Die Integration bietet kein reguläres Entfernen. Dann bleibt nur „lokal vergessen“.", reason_regular_removal_available: "Die Integration kann das Gerät regulär entfernen; Erzwingen ist dann nicht vorgesehen.",
  reason_forced_forget: "Erzwungen: Die Integration wird nicht gefragt, das Quellsystem (Gerät, Hub, Cloud) bleibt unverändert, und das Gerät kann wiederkehren.",
  reason_restore_limited: "Das Gerät und seine Entities werden entfernt. Wiederherstellen legt nur den Registry-Eintrag neu an; ob die Integration die Entities wieder bereitstellt, entscheidet sie selbst.",
  reason_target_missing: "Die neue Entity existiert nicht.", reason_same_entity: "Alte und neue Entity sind identisch.", reason_different_domain: "Alte und neue Entity haben unterschiedliche Typen.", reason_target_not_working: "Die neue Entity funktioniert noch nicht.",
  reason_nothing_to_replace: "Nichts, was Housekeeper sicher umschreiben kann.", reason_source_manual: "Nicht alles lässt sich automatisch ersetzen: Templates und nicht bearbeitbare Quellen musst du von Hand anpassen.",
  reason_energy_changes: "Ändert das Energie-Dashboard; die Statistik der neuen Entity beginnt neu.", reason_config_rewrite: "Schreibt Konfiguration um (in YAML-Dateien gehen Kommentare verloren).", reason_unit_differs: "Die Einheiten unterscheiden sich.", reason_class_differs: "Die Geräteklassen unterscheiden sich.",
  source_not_in_yaml: "nicht in der YAML-Datei gefunden (anderswo definiert)", source_yaml_uses_tags: "YAML nutzt !secret oder !include", source_yaml_mode: "YAML-Dashboard", source_not_editable: "nicht bearbeitbar",
  abort_device_gone: "Das Gerät existiert nicht mehr.", abort_device_unsupported: "Dieses Gerät (Untergerät) kann nicht bereinigt werden.", reason_child_device: "Untergeräte lassen sich noch nicht entfernen oder wiederherstellen.", abort_device_changed: "Das Gerät wurde nach der Vorschau geändert.", abort_source_changed: "Eine Konfiguration wurde nach der Vorschau geändert.", abort_rejected_by_integration: "Die Integration hat das Entfernen abgelehnt.",
  abort_integration_no_support: "Die Integration unterstützt das Entfernen nicht.", abort_source_write_failed: "Eine Konfiguration konnte nicht geschrieben werden; bereits geänderte Teile wurden zurückgesetzt.", abort_rollback_incomplete: "Eine Konfiguration wurde geändert und konnte nicht zurückgesetzt werden. Bitte unter „Rückgängig“ erneut versuchen oder das Backup verwenden.",
  check_device_disabled: "Gerät ist deaktiviert", check_device_removed: "Gerät ist entfernt", check_not_recurring: "Das Gerät kam nicht wieder", check_references_replaced: "Keine sicheren Verweise auf die alte Entity mehr",
  undo_conflict_partial: "teilweise rückgängig gemacht; Rest zwischenzeitlich geändert", result_replaced: "Ersetzt",
  confirmWordReplace: "ERSETZEN", confirmedSummaryDeviceDisable: "{count} Geräte werden deaktiviert (Quarantäne). Das ist jederzeit umkehrbar, solange das Gerät unverändert bleibt.",
  confirmedSummaryDeviceRemove: "{count} Geräte werden samt Entities entfernt. Vorher legt Housekeeper ein Home-Assistant-Backup an und startet nur, wenn es erfolgreich ist. Wiederherstellen legt den Registry-Eintrag neu an; Entities stellt die Integration bereit, wenn sie es kann.",
  confirmedSummaryReplace: "In {count} Entity-Verweisen wird die alte durch die neue Entity ersetzt (Automationen, Skripte, Szenen, Dashboards, Energie). Vorher legt Housekeeper ein Home-Assistant-Backup an. Jede Quelle wird vorab gesichert und lässt sich zurücksetzen, solange sie unverändert ist.",
  quarantineHint: "Entities und Geräte, die Housekeeper deaktiviert hat. Entfernen ist frühestens nach {days} Tagen möglich. Mit „Aus Quarantäne holen“ aktivierst du ein Objekt wieder.",
  deviceCandidatesHint: "Geräte ohne funktionierende Entities. Deaktivieren schickt sie in Quarantäne.", removalDeviceHint: "Geräte in Quarantäne. Entfernen ist erst nach {days} Tagen möglich.", deviceEntities: "{count} Entities", sortEntities: "Entities",
  replaceTitle: "Verweise ersetzen", replaceHint: "Ersetzt die alte Entity überall dort, wo sie exakt eingetragen ist: Automationen, Skripte, Szenen, Dashboards im Speichermodus und das Energie-Dashboard. Templates und YAML-Dashboards zeigt Housekeeper nur an. Die alte Entity bleibt unverändert; danach kannst du sie in Quarantäne schicken.",
  replaceOld: "Alte Entity (wird ersetzt)", replaceNew: "Neue Entity", replacePreview: "Vorschau erstellen", replaceChanges: "{count} Änderungen", replaceManual: "von Hand prüfen: {count} Templates", replaceNoSources: "Keine Verweise gefunden", replaceSources: "Quellen",
  recurringTitle: "Wiederkehrende Geräte", recurringHint: "Diese Geräte hat Housekeeper vergessen, doch die Integration hat sie wieder angelegt. Deaktivieren ist hier meist sinnvoller; oft muss das Gerät am Quellsystem (Hub, App, Cloud) entfernt werden.", recurringSince: "vergessen am {date} · Integration: {domains}",
});
Object.assign(TEXT.en, {
  statSuccessors: "Possible successors:", orphanStatsHint: "Long-term statistics in the recorder that no longer have an entity, for example after deleting, renaming or replacing a device. They only take up space. If the entity was renamed or replaced, the statistic can be moved to the new one: Tidy up → Meter change (continue statistics). If it is really gone, you can remove the statistic in Home Assistant under Developer tools → Statistics. Housekeeper deletes nothing here. Successors are guesses from name and unit.",
  noBaselinePreliminary: "The last scan was preliminary because Home Assistant has just started. Preliminary scans are not saved. Scan again in a few minutes to get a first comparison point.", noBaselineOneScan: "There is only one saved scan so far. A comparison needs two: scan again after changing your installation or wait for the automatic scan (every {hours} hours). Every scan is saved as a comparison point.", scanPoint: "Scan now and set a comparison point",
  releaseAction: "Take out of quarantine", releaseQuestion: "Enable it again?", releaseNothing: "Nothing to restore: no longer in quarantine",
  kindDisableDevice: "Disable device (quarantine, reversible)", kindRemoveDevice: "Remove device (after quarantine, with backup)",
  kindForgetDevice: "Forget device locally (forced, after quarantine, with backup)", kindReplace: "Replace references (old → new, with backup)",
  reason_device_has_working_entities: "At least one entity of the device still works.", reason_has_children: "Other devices hang off this device (hub or coordinator).",
  reason_integration_no_support: "The integration offers no regular removal. Only “forget locally” remains.", reason_regular_removal_available: "The integration can remove the device regularly; forcing is not intended then.",
  reason_forced_forget: "Forced: the integration is not asked, the source system (device, hub, cloud) stays unchanged, and the device may come back.",
  reason_restore_limited: "The device and its entities are removed. Restoring only recreates the registry entry; whether the integration provides the entities again is up to it.",
  reason_target_missing: "The new entity does not exist.", reason_same_entity: "Old and new entity are the same.", reason_different_domain: "Old and new entity are of different types.", reason_target_not_working: "The new entity does not work yet.",
  reason_nothing_to_replace: "Nothing Housekeeper can safely rewrite.", reason_source_manual: "Not everything can be replaced automatically: you have to adjust templates and sources that cannot be edited by hand.",
  reason_energy_changes: "Changes the Energy dashboard; the new entity's statistics start fresh.", reason_config_rewrite: "Rewrites configuration (comments in YAML files are lost).", reason_unit_differs: "The units differ.", reason_class_differs: "The device classes differ.",
  source_not_in_yaml: "not found in the YAML file (defined elsewhere)", source_yaml_uses_tags: "YAML uses !secret or !include", source_yaml_mode: "YAML dashboard", source_not_editable: "not editable",
  abort_device_gone: "The device no longer exists.", abort_device_unsupported: "This device (a child device) cannot be cleaned up.", reason_child_device: "Child devices cannot be removed or restored yet.", abort_device_changed: "The device was changed after the preview.", abort_source_changed: "A configuration was changed after the preview.", abort_rejected_by_integration: "The integration rejected the removal.",
  abort_integration_no_support: "The integration does not support removal.", abort_source_write_failed: "A configuration could not be written; parts already changed were put back.", abort_rollback_incomplete: "A configuration was changed and could not be put back. Try Undo again or use the backup.",
  check_device_disabled: "Device is disabled", check_device_removed: "Device is removed", check_not_recurring: "The device did not come back", check_references_replaced: "No certain references to the old entity remain",
  undo_conflict_partial: "partly undone; the rest changed in the meantime", result_replaced: "Replaced",
  confirmWordReplace: "REPLACE", confirmedSummaryDeviceDisable: "{count} devices will be disabled (quarantine). This is reversible at any time while the device stays unchanged.",
  confirmedSummaryDeviceRemove: "{count} devices will be removed together with their entities. Housekeeper creates a Home Assistant backup first and only continues if it succeeds. Restoring recreates the registry entry; the integration provides the entities if it can.",
  confirmedSummaryReplace: "In {count} entity references the old entity is replaced by the new one (automations, scripts, scenes, dashboards, Energy). Housekeeper creates a Home Assistant backup first. Each source is saved beforehand and can be put back while it is unchanged.",
  quarantineHint: "Entities and devices Housekeeper has disabled. Removal is possible no earlier than after {days} days. “Take out of quarantine” enables an object again.",
  deviceCandidatesHint: "Devices without working entities. Disabling sends them to quarantine.", removalDeviceHint: "Devices in quarantine. Removal is possible only after {days} days.", deviceEntities: "{count} entities", sortEntities: "Entities",
  replaceTitle: "Replace references", replaceHint: "Replaces the old entity wherever it is entered exactly: automations, scripts, scenes, storage-mode dashboards and the Energy dashboard. Housekeeper only lists templates and YAML dashboards. The old entity stays as it is; afterwards you can send it to quarantine.",
  replaceOld: "Old entity (to be replaced)", replaceNew: "New entity", replacePreview: "Create preview", replaceChanges: "{count} changes", replaceManual: "check by hand: {count} templates", replaceNoSources: "No references found", replaceSources: "Sources",
  recurringTitle: "Returning devices", recurringHint: "Housekeeper made Home Assistant forget these devices, but the integration created them again. Disabling usually makes more sense here; often the device has to be removed at the source (hub, app, cloud).", recurringSince: "forgotten on {date} · integration: {domains}",
});

// Texts for the integration detail page; merged into TEXT.
Object.assign(TEXT.de, {
  ignored: "Ignoriert", integrationCard: "Integration", integrationName: "Integration", origin: "Herkunft", originBuiltIn: "In Home Assistant enthalten", originCustom: "Benutzerdefiniert · {path}{version}",
  entrySource: "Eingerichtet über", entryError: "Fehlermeldung", entryId: "Eintrags-ID", entryUniqueId: "Eindeutige ID", entryCreated: "Angelegt", entryModified: "Geändert", entryEntities: "Entities", entryDevices: "Geräte",
  entryDocs: "Dokumentation", entryHaPath: "Pfad in Home Assistant", noneValue: "keine",
  src_user: "Manuell hinzugefügt", src_import: "Aus der YAML-Konfiguration übernommen", src_ignore: "Ignorierte Entdeckung", src_system: "System", src_discovery: "Automatisch entdeckt ({source})", src_reauth: "Erneute Anmeldung", src_reconfigure: "Neu konfiguriert",
  cause_entry_ignored: "Diese Integration wurde nie eingerichtet: Du hast eine automatisch entdeckte Instanz ausdrücklich ignoriert. Das ist kein Fehler, und es gibt dazu keine Entities.",
  hint_entry_ignored: "Möchtest du sie doch nutzen, öffne in Home Assistant Einstellungen → Geräte & Dienste, zeige die ignorierten Einträge an und wähle „Hinzufügen“. Sonst kannst du den Eintrag dort löschen.",
  cause_entry_problem_error: "Die Integration ist nicht geladen ({state}). Meldung: {error}",
});
Object.assign(TEXT.en, {
  ignored: "Ignored", integrationCard: "Integration", integrationName: "Integration", origin: "Origin", originBuiltIn: "Included with Home Assistant", originCustom: "Custom · {path}{version}",
  entrySource: "Set up via", entryError: "Error message", entryId: "Entry ID", entryUniqueId: "Unique ID", entryCreated: "Created", entryModified: "Modified", entryEntities: "Entities", entryDevices: "Devices",
  entryDocs: "Documentation", entryHaPath: "Path in Home Assistant", noneValue: "none",
  src_user: "Added manually", src_import: "Imported from the YAML configuration", src_ignore: "Ignored discovery", src_system: "System", src_discovery: "Discovered automatically ({source})", src_reauth: "Re-authentication", src_reconfigure: "Reconfigured",
  cause_entry_ignored: "This integration was never set up: you explicitly ignored an automatically discovered instance. This is not an error, and it has no entities.",
  hint_entry_ignored: "If you want to use it after all, open Settings → Devices & services in Home Assistant, show the ignored entries and choose “Add”. Otherwise you can delete the entry there.",
  cause_entry_problem_error: "The integration is not loaded ({state}). Message: {error}",
});

// Texts for the property cards on entity and device pages; merged into TEXT.
Object.assign(TEXT.de, {
  propAssignment: "Zuordnung", propProperties: "Eigenschaften", propTechnical: "Technische Angaben", propTimes: "Zeiten", propDevice: "Gerät", propEntities: "Entities des Geräts",
  propIntegration: "Integration", propDeviceOf: "Gerät", propArea: "Bereich", propAreaInherited: "{area} (vom Gerät)", propLabels: "Labels", propNone: "–",
  propDomain: "Typ", propDeviceClass: "Geräteklasse", propStateClass: "Zustandsklasse", propUnit: "Einheit", propCategory: "Kategorie", propOriginalName: "Originalname", propAliases: "Aliase", propIcon: "Symbol",
  propDisabledBy: "Deaktiviert durch", propHiddenBy: "Ausgeblendet durch", propEntityId: "Entity-ID", propUniqueId: "Eindeutige ID", propPlatform: "Plattform",
  propCreated: "Angelegt", propModified: "Geändert", propLastChanged: "Letzter Zustandswechsel", propLastUpdated: "Letzte Aktualisierung",
  propManufacturer: "Hersteller", propModel: "Modell", propSerial: "Seriennummer", propFirmware: "Firmware", propHardware: "Hardware", propEntryType: "Art", propUserName: "Eigener Name", propOriginalDeviceName: "Name laut Integration",
  propKind: "Art", propKindChild: "Untergerät", propParent: "Übergeordnetes Gerät", propCleanupBlock: "Aufräumen gesperrt", propVia: "Verbunden über", propChildren: "Daran hängen", propChildrenCount: "{count} Geräte", propConfigUrl: "Konfigurationsseite", propDeviceId: "Geräte-ID", propIdentifiers: "Kennungen", propConnections: "Verbindungen",
  propMoreEntities: "… und {count} weitere (siehe Beziehungen)", propNoEntities: "Dieses Gerät hat keine Entities.",
  by_user: "Benutzer", by_integration: "Integration", by_config_entry: "Integrationseintrag (deaktiviert)", by_device: "Gerät (deaktiviert)", by_hass: "Home Assistant",
  cat_config: "Konfiguration", cat_diagnostic: "Diagnose", type_service: "Dienst (kein physisches Gerät)",
});
Object.assign(TEXT.en, {
  propAssignment: "Assignment", propProperties: "Properties", propTechnical: "Technical details", propTimes: "Times", propDevice: "Device", propEntities: "Entities of the device",
  propIntegration: "Integration", propDeviceOf: "Device", propArea: "Area", propAreaInherited: "{area} (from the device)", propLabels: "Labels", propNone: "–",
  propDomain: "Type", propDeviceClass: "Device class", propStateClass: "State class", propUnit: "Unit", propCategory: "Category", propOriginalName: "Original name", propAliases: "Aliases", propIcon: "Icon",
  propDisabledBy: "Disabled by", propHiddenBy: "Hidden by", propEntityId: "Entity ID", propUniqueId: "Unique ID", propPlatform: "Platform",
  propCreated: "Created", propModified: "Modified", propLastChanged: "Last state change", propLastUpdated: "Last update",
  propManufacturer: "Manufacturer", propModel: "Model", propSerial: "Serial number", propFirmware: "Firmware", propHardware: "Hardware", propEntryType: "Kind", propUserName: "Custom name", propOriginalDeviceName: "Name from the integration",
  propKind: "Kind", propKindChild: "Child device", propParent: "Parent device", propCleanupBlock: "Cleanup blocked", propVia: "Connected via", propChildren: "Attached devices", propChildrenCount: "{count} devices", propConfigUrl: "Configuration page", propDeviceId: "Device ID", propIdentifiers: "Identifiers", propConnections: "Connections",
  propMoreEntities: "… and {count} more (see relations)", propNoEntities: "This device has no entities.",
  by_user: "User", by_integration: "Integration", by_config_entry: "Integration entry (disabled)", by_device: "Device (disabled)", by_hass: "Home Assistant",
  cat_config: "Configuration", cat_diagnostic: "Diagnostic", type_service: "Service (not a physical device)",
});

// Texts for the meter migration and the maintenance assistant; merged into TEXT.
Object.assign(TEXT.de, {
  kindMeter: "Zählerwechsel (Statistik fortführen / ID übernehmen, mit Backup)",
  meterTitle: "Zählerwechsel", meterHint: "Führt die Historie eines ersetzten Zählers mit dem neuen zusammen. Die Langzeitstatistik des alten Zählers wird vor die des neuen kopiert und die Summe des neuen um den alten Endstand verschoben; die Rohwerte des neuen Zählers bleiben unverändert. Alternativ oder zusätzlich übernimmt der neue Zähler die ID des alten, sodass Automationen, Dashboards und das Energie-Dashboard ohne Umschreiben weiterlaufen. Überlappende Werte werden nie überschrieben. Vor jedem Lauf entsteht ein Home-Assistant-Backup.",
  meterOld: "Alter Zähler", meterNew: "Neuer Zähler", meterMode: "Was soll passieren?",
  meterModeBoth: "Statistik fortführen und ID übernehmen (empfohlen)", meterModeStatistics: "Nur Statistik fortführen (neue ID bleibt)", meterModeId: "Nur ID übernehmen (Statistik bleibt getrennt)",
  meterCopy: "{count} Stundenwerte von {from} bis {to} werden vor die Reihe des neuen Zählers kopiert.", meterSwitch: "Umschaltpunkt: {date}",
  meterOffset: "Die Summe des neuen Zählers wird um {offset} {unit} erhöht, damit die Verbrauchssumme durchläuft.",
  meterOverlap: "{count} überlappende Werte des alten Zählers werden nicht kopiert; vorhandene Werte werden nie überschrieben.", meterGap: "Lücke ohne Werte: {hours} Stunden.",
  meterIdMove: "{old} → {alt}, danach {new} → {old}. Home Assistant verschiebt Historie und Statistik mit der ID.", meterPreviewRows: "Übergang (Summe)",
  meterStatsKept: "IDs zurückgegeben; die zusammengeführte Statistik bleibt bestehen und lässt sich nur mit dem Backup zurücksetzen.",
  reason_nothing_to_do: "Nichts auszuführen.", reason_stats_missing_old: "Für den alten Zähler gibt es keine Langzeitstatistik.", reason_stats_unit_differs: "Die Einheiten der Statistiken unterscheiden sich.",
  reason_stats_type_differs: "Die Statistik-Arten (Summe oder Mittelwert) unterscheiden sich.", reason_stats_nothing_to_import: "Es gibt keine Werte des alten Zählers vor dem Start des neuen.",
  reason_no_recorder: "Der Recorder läuft nicht.", reason_old_not_in_registry: "Der alte Zähler ist nicht (mehr) in der Entity-Registry; die ID lässt sich nicht tauschen.",
  reason_target_not_in_registry: "Der neue Zähler ist nicht in der Entity-Registry.", reason_alt_id_taken: "Es ist keine freie Ausweich-ID für den alten Zähler da.",
  reason_stats_overlap: "Die Statistiken überlappen; nur Werte vor dem Start des neuen Zählers werden kopiert.", reason_stats_gap: "Zwischen altem Ende und neuem Start fehlen Werte.",
  reason_stats_new_empty: "Der neue Zähler hat noch keine Langzeitstatistik; prüfe die Summe nach der ersten Auswertung.",
  reason_stats_no_sum: "Der letzte alte Wert hat keine Summe; die Summe des neuen Zählers wird nicht fortgesetzt.",
  reason_stats_write: "Experimentell: schreibt in die Recorder-Datenbank. Die Statistik lässt sich danach nur mit dem Backup zurücksetzen.",
  reason_id_takeover: "Benennt zwei Entities um. Verweise auf die bisherige ID des neuen Zählers funktionieren danach nicht mehr.", reason_target_in_use: "Der neue Zähler wird selbst schon verwendet; diese Verweise müssen angepasst werden.",
  confirmWordMeter: "MIGRIEREN", confirmedSummaryMeter: "{count} Zählerwechsel: Housekeeper legt zuerst ein Home-Assistant-Backup an und startet nur, wenn es erfolgreich ist. Danach schreibt es Langzeitstatistiken und/oder benennt Entities um. Die IDs lassen sich zurückgeben, die Statistik nur mit dem Backup.",
  result_migrated: "Migriert", check_meter_statistics: "Statistik fortgeführt", check_meter_id_taken: "Neue Entity trägt die stabile ID", undo_conflict_statistics: "nicht rückgängig: Statistik lässt sich nur mit dem Backup zurücksetzen",
  abort_meter_changed: "Entities oder Statistik wurden nach der Vorschau geändert.", abort_statistics_changed: "Die Statistik wurde nach der Vorschau geändert.", abort_statistics_failed: "Die Statistik konnte nicht bestätigt werden; der Lauf wurde angehalten.",
  abort_no_recorder: "Der Recorder läuft nicht.", abort_alt_id_taken: "Die Ausweich-ID ist inzwischen belegt.", abort_id_not_freed: "Home Assistant hat die alte ID nicht rechtzeitig freigegeben; alles wurde zurückgesetzt.", abort_id_takeover_failed: "Das Umbenennen ist fehlgeschlagen; alles wurde zurückgesetzt.",
  // maintenance
  maintenance: "Wartung", maintenanceSubtitle: "Backup-Schutz, Recorder-Kosten und Update-Preflight. Alles liest nur; gespeichert wird allein Housekeepers eigener Ausgangszustand und was du als erledigt bestätigst.",
  recorderTitle: "Recorder-Kosten", recorderHint: "Welche Entities die Datenbank füllen. Ausschließen verkleinert die Datenbank, löscht aber nichts rückwirkend; Housekeeper ändert die Recorder-Konfiguration nicht.",
  recorderLoad: "Analyse starten", recorderReload: "Neu berechnen", recorderLoading: "Datenbank wird ausgewertet …", recorderUnavailable: "Der Recorder läuft nicht, daher gibt es nichts auszuwerten.",
  recorderSummary: "{states} gespeicherte Zustände · {size} · Aufbewahrung {days} Tage · {stats} Statistikwerte", recorderSizeUnknown: "Größe unbekannt", recorderPerDay: "{count} pro Tag", recorderWindows: "24 h: {day} · 7 Tage: {week} · Ø {avg} pro Tag", recorderSortRecent: "Aktuell (24 h)", recorderSortTotal: "Gesamt", recorderTook: "berechnet in {ms} ms", recorderCached: "Ergebnis von vor wenigen Minuten ({ms} ms)", recorderShare: "{share} % aller Zustände",
  recorderUsed: "{count} Verwendungen", recorderUnused: "nicht verwendet", recorderExcluded: "bereits ausgeschlossen", recorderSuggest: "Ausschluss möglich", recorderStats: "Statistikwerte nach Entity",
  recorderSnippetTitle: "Vorschlag für die configuration.yaml", recorderSnippetHint: "Entities, die nichts verwendet, keine Statistik haben und sehr oft schreiben. Prüfe die Liste, bevor du sie übernimmst.", recorderCopy: "Kopieren", recorderCopied: "Kopiert",
  preflightTitle: "Update-Preflight", preflightHint: "Prüft vor einem Home-Assistant-Update Backup, Reparaturen, ausgefallene Integrationen und fehlende Referenzen. Speichere den Ausgangszustand; nach dem Update zeigt Housekeeper, was sich geändert hat.",
  preflightRefresh: "Neu prüfen", preflightSave: "Ausgangszustand speichern", preflightClear: "Gespeicherten Zustand verwerfen", preflightLoading: "Wird geprüft …",
  pf_backup: "Backup", pf_repairs: "Offene Reparaturen", pf_failed_entries: "Ausgefallene Integrationen", pf_broken: "Fehlende Referenzen",
  pf_backup_ok: "Letztes Backup vor {hours} h", pf_backup_old: "Letztes Backup vor {hours} h – ein neues ist ratsam", pf_backup_none: "Kein Backup eingerichtet oder vorhanden", pf_backup_unavailable: "Backup-Komponente nicht verfügbar",
  pf_count_none: "keine", pf_updates: "Verfügbare Updates", pf_updates_none: "keine",
  preflightRecord: "Gespeichert am {date} · Home Assistant {version} · {repairs} Reparaturen, {failed} ausgefallene Integrationen, {broken} fehlende Referenzen, {objects} Objekte",
  preflightAfterTitle: "Seit dem Update: Home Assistant {from} → {to}", preflightAfterNone: "Seit dem gespeicherten Zustand ist nichts Neues aufgefallen.",
  pfNewRepairs: "Neue Reparaturen", pfNewFailed: "Neu ausgefallene Integrationen", pfNewBroken: "Neue fehlende Referenzen", pfNoRecord: "Noch kein Ausgangszustand gespeichert.",
});
Object.assign(TEXT.en, {
  kindMeter: "Meter change (continue statistics / take over ID, with backup)",
  meterTitle: "Meter change", meterHint: "Joins the history of a replaced meter with the new one. The old meter's long-term statistics are copied in front of the new ones and the new total is shifted by the old final reading; the raw readings of the new meter stay as they are. Alternatively or additionally the new meter takes over the old one's ID, so automations, dashboards and the Energy dashboard keep working without rewriting. Overlapping values are never overwritten. A Home Assistant backup is created before every run.",
  meterOld: "Old meter", meterNew: "New meter", meterMode: "What should happen?",
  meterModeBoth: "Continue statistics and take over the ID (recommended)", meterModeStatistics: "Continue statistics only (new ID stays)", meterModeId: "Take over the ID only (statistics stay separate)",
  meterCopy: "{count} hourly values from {from} to {to} are copied in front of the new meter's series.", meterSwitch: "Switch point: {date}",
  meterOffset: "The new meter's total is raised by {offset} {unit} so that the consumption total continues.",
  meterOverlap: "{count} overlapping values of the old meter are not copied; existing values are never overwritten.", meterGap: "Gap without values: {hours} hours.",
  meterIdMove: "{old} → {alt}, then {new} → {old}. Home Assistant moves history and statistics along with the ID.", meterPreviewRows: "Transition (total)",
  meterStatsKept: "IDs given back; the joined statistics remain and can only be reset with the backup.",
  reason_nothing_to_do: "Nothing to do.", reason_stats_missing_old: "The old meter has no long-term statistics.", reason_stats_unit_differs: "The units of the statistics differ.",
  reason_stats_type_differs: "The statistic types (total or mean) differ.", reason_stats_nothing_to_import: "There are no values of the old meter before the new one starts.",
  reason_no_recorder: "The recorder is not running.", reason_old_not_in_registry: "The old meter is not (any more) in the entity registry; the ID cannot be swapped.",
  reason_target_not_in_registry: "The new meter is not in the entity registry.", reason_alt_id_taken: "There is no free fallback ID for the old meter.",
  reason_stats_overlap: "The statistics overlap; only values before the new meter's start are copied.", reason_stats_gap: "Values are missing between the old end and the new start.",
  reason_stats_new_empty: "The new meter has no long-term statistics yet; check the total after the first evaluation.",
  reason_stats_no_sum: "The last old value has no total; the total of the new meter is not continued.",
  reason_stats_write: "Experimental: writes into the recorder database. Afterwards the statistics can only be reset with the backup.",
  reason_id_takeover: "Renames two entities. References to the new meter's current ID stop working afterwards.", reason_target_in_use: "The new meter is already in use itself; those references have to be adjusted.",
  confirmWordMeter: "MIGRATE", confirmedSummaryMeter: "{count} meter changes: Housekeeper first creates a Home Assistant backup and only continues if it succeeds. It then writes long-term statistics and/or renames entities. IDs can be given back, statistics only with the backup.",
  result_migrated: "Migrated", check_meter_statistics: "Statistics continued", check_meter_id_taken: "New entity carries the stable ID", undo_conflict_statistics: "not undone: statistics can only be reset with the backup",
  abort_meter_changed: "Entities or statistics were changed after the preview.", abort_statistics_changed: "The statistics were changed after the preview.", abort_statistics_failed: "The statistics could not be confirmed; the run stopped.",
  abort_no_recorder: "The recorder is not running.", abort_alt_id_taken: "The fallback ID is taken now.", abort_id_not_freed: "Home Assistant did not free the old ID in time; everything was put back.", abort_id_takeover_failed: "Renaming failed; everything was put back.",
  maintenance: "Maintenance", maintenanceSubtitle: "Backup protection, recorder costs and update preflight. All of it only reads; the only things stored are Housekeeper's own starting state and what you confirm as done.",
  recorderTitle: "Recorder costs", recorderHint: "Which entities fill the database. Excluding shrinks the database going forward but does not delete anything retroactively; Housekeeper does not change the recorder configuration.",
  recorderLoad: "Start analysis", recorderReload: "Recalculate", recorderLoading: "Evaluating the database …", recorderUnavailable: "The recorder is not running, so there is nothing to evaluate.",
  recorderSummary: "{states} stored states · {size} · kept {days} days · {stats} statistics values", recorderSizeUnknown: "size unknown", recorderPerDay: "{count} per day", recorderWindows: "24 h: {day} · 7 days: {week} · avg {avg} per day", recorderSortRecent: "Current (24 h)", recorderSortTotal: "Total", recorderTook: "calculated in {ms} ms", recorderCached: "result from a few minutes ago ({ms} ms)", recorderShare: "{share} % of all states",
  recorderUsed: "{count} uses", recorderUnused: "not used", recorderExcluded: "already excluded", recorderSuggest: "can be excluded", recorderStats: "Statistics values by entity",
  recorderSnippetTitle: "Suggestion for configuration.yaml", recorderSnippetHint: "Entities that nothing uses, that have no statistics and that write very often. Review the list before you adopt it.", recorderCopy: "Copy", recorderCopied: "Copied",
  preflightTitle: "Update preflight", preflightHint: "Before a Home Assistant update it checks backup, repairs, failed integrations and missing references. Save the starting state; after the update Housekeeper shows what changed.",
  preflightRefresh: "Check again", preflightSave: "Save starting state", preflightClear: "Discard saved state", preflightLoading: "Checking …",
  pf_backup: "Backup", pf_repairs: "Open repairs", pf_failed_entries: "Failed integrations", pf_broken: "Missing references",
  pf_backup_ok: "Last backup {hours} h ago", pf_backup_old: "Last backup {hours} h ago – a new one is advisable", pf_backup_none: "No backup set up or available", pf_backup_unavailable: "Backup component not available",
  pf_count_none: "none", pf_updates: "Available updates", pf_updates_none: "none",
  preflightRecord: "Saved {date} · Home Assistant {version} · {repairs} repairs, {failed} failed integrations, {broken} missing references, {objects} objects",
  preflightAfterTitle: "Since the update: Home Assistant {from} → {to}", preflightAfterNone: "Nothing new has shown up since the saved state.",
  pfNewRepairs: "New repairs", pfNewFailed: "Newly failed integrations", pfNewBroken: "New missing references", pfNoRecord: "No starting state saved yet.",
});

// Texts for the backup protection card; merged into TEXT.
Object.assign(TEXT.de, {
  backupTitle: "Backup-Schutz", backupHint: "Ist die Backup-Strategie belastbar, nicht nur: Gibt es ein Backup? Housekeeper liest nur und löst nichts aus.",
  backupRefresh: "Neu prüfen", backupLoading: "Backups werden geprüft …", backupUnavailable: "Die Backup-Komponente von Home Assistant ist nicht verfügbar.",
  bhLevel_ok: "In Ordnung", bhLevel_note: "Hinweis", bhLevel_problem: "Problem", bhLevel_unknown: "Unbekannt",
  bh_setup: "Ziele und Zeitplan", bh_newest: "Letztes Backup", bh_last_run: "Letzter automatischer Lauf", bh_targets: "Ablageorte", bh_size: "Größe",
  bh_retention: "Aufbewahrung", bh_encryption: "Verschlüsselung", bh_emergency_kit: "Emergency Kit", bh_restore_test: "Restore-Test", bh_plan_backups: "Backups vor Bereinigungen",
  bhRec_daily: "täglich", bhRec_custom_days: "an bestimmten Tagen", bhRec_never: "ohne Zeitplan", bhNone: "keine", bhNever: "nie",
  bhAgeHours: "{n} Std.", bhAgeDays: "{n} Tagen",
  bhSetupOk: "Ziele: {agents} · Zeitplan: {recurrence}", bhSetupNote: "Kein Ziel für automatische Backups gewählt, ältere Backups sind aber vorhanden.", bhSetupProblem: "Weder ein Backup-Ziel noch ein vorhandenes Backup.",
  bhNewestNone: "Es gibt noch kein Backup.", bhNewestText: "Vor {age} · Grenze für den Zeitplan: {limit}",
  bhRunOk: "Zuletzt erfolgreich: {completed}", bhRunUnknown: "Noch kein automatischer Lauf bekannt.",
  bhRunFailed: "Der letzte Versuch ({attempted}) hat kein Backup ergeben; letzter Erfolg: {completed}.", bhRunAgents: "Ziele mit Fehler: {agents}",
  bhTargetsOk: "Lokal: {local} · extern: {remote}", bhTargetsNote: "Nur lokal ({local}). Eine zweite, externe Kopie schützt vor dem Verlust des Geräts. Die Zuordnung lokal/extern ist eine Vermutung nach dem Namen des Ziels.",
  bhSizeOk: "{size} (erwartet etwa {expected})", bhSizeNote: "{size} statt etwa {expected} ({percent} %): ungewöhnlich klein oder groß.", bhSizeUnknown: "Zu wenige Backups für einen Vergleich.",
  bhRetentionOk: "Aufbewahrung: {limit} · vorhanden: {count}, das älteste vor {oldest} Tagen", bhRetentionNote: "Keine Aufbewahrungsgrenze eingestellt (vorhanden: {count}). Der Speicher kann volllaufen.",
  bhRetCopies: "{n} Backups", bhRetDays: "{n} Tage",
  bhEncOk: "Passwort gesetzt, das jüngste Backup ist geschützt.", bhEncNoPassword: "Kein Backup-Passwort gesetzt.", bhEncNotProtected: "Das jüngste Backup ist nicht geschützt.",
  bhKitNone: "Noch nicht bestätigt. Ohne das Emergency Kit lassen sich verschlüsselte Backups nicht lesen.", bhKitOk: "Bestätigt am {date}.",
  bhRestoreNone: "Noch nie dokumentiert. Ein Backup gilt erst als sicher, wenn eine Wiederherstellung einmal geklappt hat.", bhRestoreOk: "Zuletzt am {date} (vor {days} Tagen).", bhRestoreOld: "Zuletzt am {date}, das ist {days} Tage her (empfohlen: höchstens {limit}).",
  bhPlansOk: "Für die {checked} zuletzt ausgeführten Pläne ist das Backup noch vorhanden.", bhPlansNote: "Für {missing} von {checked} zuletzt ausgeführten Plänen wurde das Backup nicht mehr gefunden (vermutlich durch die Aufbewahrung gelöscht).",
  bhAttestDate: "Datum", bhAttestSave: "Als erledigt speichern", bhAttestClear: "Zurücknehmen",
  bhListTitle: "Letzte Backups", bhColDate: "Datum", bhColSize: "Größe", bhColTargets: "Ziele", bhColProtected: "Verschlüsselt", bhYes: "Ja", bhNo: "Nein",
  bhGuideTitle: "So testest du eine Wiederherstellung", bhGuideSteps: "1. Eine Test-Instanz oder eine zweite Installation bereitstellen (nie zuerst die Hauptinstanz). 2. Dort ein aktuelles Backup einspielen: Einstellungen → System → Backups → Backup hochladen oder bei der Einrichtung wiederherstellen. 3. Prüfen, ob Integrationen, Automationen und Dashboards da sind. 4. Hier das Datum des Tests speichern. Housekeeper führt selbst nie eine Wiederherstellung aus.",
  todoBackupProblem: "Backup-Schutz: Problem",
});
Object.assign(TEXT.en, {
  backupTitle: "Backup protection", backupHint: "Is the backup strategy sound, not only: is there a backup? Housekeeper only reads and starts nothing.",
  backupRefresh: "Check again", backupLoading: "Checking backups …", backupUnavailable: "The backup component of Home Assistant is not available.",
  bhLevel_ok: "OK", bhLevel_note: "Note", bhLevel_problem: "Problem", bhLevel_unknown: "Unknown",
  bh_setup: "Targets and schedule", bh_newest: "Latest backup", bh_last_run: "Last automatic run", bh_targets: "Storage locations", bh_size: "Size",
  bh_retention: "Retention", bh_encryption: "Encryption", bh_emergency_kit: "Emergency kit", bh_restore_test: "Restore test", bh_plan_backups: "Backups before cleanups",
  bhRec_daily: "daily", bhRec_custom_days: "on chosen days", bhRec_never: "no schedule", bhNone: "none", bhNever: "never",
  bhAgeHours: "{n} h", bhAgeDays: "{n} days",
  bhSetupOk: "Targets: {agents} · schedule: {recurrence}", bhSetupNote: "No target chosen for automatic backups, but older backups exist.", bhSetupProblem: "Neither a backup target nor an existing backup.",
  bhNewestNone: "There is no backup yet.", bhNewestText: "{age} ago · limit for the schedule: {limit}",
  bhRunOk: "Last success: {completed}", bhRunUnknown: "No automatic run known yet.",
  bhRunFailed: "The last attempt ({attempted}) produced no backup; last success: {completed}.", bhRunAgents: "Targets with errors: {agents}",
  bhTargetsOk: "Local: {local} · remote: {remote}", bhTargetsNote: "Local only ({local}). A second, remote copy protects against losing the device. Local versus remote is a guess from the name of the target.",
  bhSizeOk: "{size} (expected about {expected})", bhSizeNote: "{size} instead of about {expected} ({percent} %): unusually small or large.", bhSizeUnknown: "Too few backups to compare.",
  bhRetentionOk: "Retention: {limit} · present: {count}, the oldest {oldest} days old", bhRetentionNote: "No retention limit set (present: {count}). The storage can fill up.",
  bhRetCopies: "{n} backups", bhRetDays: "{n} days",
  bhEncOk: "Password set, the latest backup is protected.", bhEncNoPassword: "No backup password set.", bhEncNotProtected: "The latest backup is not protected.",
  bhKitNone: "Not confirmed yet. Without the emergency kit, encrypted backups cannot be read.", bhKitOk: "Confirmed on {date}.",
  bhRestoreNone: "Never documented. A backup counts as safe only once a restore has worked.", bhRestoreOk: "Last on {date} ({days} days ago).", bhRestoreOld: "Last on {date}, {days} days ago (recommended: at most {limit}).",
  bhPlansOk: "The backup of the {checked} most recently executed plans still exists.", bhPlansNote: "The backup of {missing} of the {checked} most recently executed plans was not found any more (probably deleted by the retention).",
  bhAttestDate: "Date", bhAttestSave: "Save as done", bhAttestClear: "Take back",
  bhListTitle: "Latest backups", bhColDate: "Date", bhColSize: "Size", bhColTargets: "Targets", bhColProtected: "Encrypted", bhYes: "Yes", bhNo: "No",
  bhGuideTitle: "How to test a restore", bhGuideSteps: "1. Set up a test instance or a second installation (never the main instance first). 2. Restore a recent backup there: Settings → System → Backups → upload a backup, or restore during setup. 3. Check that integrations, automations and dashboards are there. 4. Save the date of the test here. Housekeeper never performs a restore itself.",
  todoBackupProblem: "Backup protection: problem",
});

// Texts for the reliability view; merged into TEXT.
Object.assign(TEXT.de, {
  reliability: "Zuverlässigkeit", reliabilitySubtitle: "Wie verfügbar die Entities jeder Integration waren und wann sie gemeinsam ausfielen. Liest nur den Recorder.",
  relTitle: "Integrationen nach Verfügbarkeit", relHint: "Schlechteste zuerst. Gerechnet aus den Zuständen im Recorder",
  relWindow1: "24 Stunden", relWindow7: "7 Tage", relRefresh: "Neu berechnen", relLoading: "Der Recorder wird ausgewertet. Das kann bei einer großen Datenbank einige Sekunden dauern …",
  relTook: "berechnet in {s} s", relCached: "aus dem Zwischenspeicher ({s} s)", relNoRecorder: "Der Recorder von Home Assistant ist nicht verfügbar.",
  relBusy: "Eine andere Berechnung läuft noch. Bitte gleich mit „Neu berechnen“ erneut abrufen.", relEmpty: "Im Zeitraum gibt es keine Zustände von Integrationen.",
  relEntities: "{n} Entities", relPermanent: "{n} dauerhaft ausgefallen, nicht eingerechnet",
  relShared: "{n} gemeinsame Ausfälle, längster {longest}", relSharedOne: "1 gemeinsamer Ausfall, {longest}", relLayerCloud: "wahrscheinlich Cloud oder API (Vermutung)", relLayerLocal: "wahrscheinlich Gerät, Netz oder Integration (Vermutung)",
  relReauth: "Neu anmelden offen", relLastShared: "Letzter gemeinsamer Ausfall bis {date} ({duration})", relLastSingle: "Letzte Störung bis {date} ({duration})", relNoDisruption: "Keine Störung",
  relMinutes: "{n} Min.", relHours: "{n} Std.", relDays: "{n} Tage",
  relUnstableTitle: "Instabile Entities", relUnstableHint: "Fallen immer wieder aus und kommen zurück. Entities mit Folgeobjekten stehen weiter oben.", relUnstableNone: "Keine Entity fällt auffällig oft aus.",
  relUnstable: "instabil", relFlapping: "flatternd", relEpisodes: "{n} Ausfälle in {days} Tagen ({rate} pro Tag) · zusammen {total}, im Mittel {mean}",
  relPattern: "wiederkehrend, meist zwischen {from} und {to} Uhr", relFollowers: "wird von {n} Automationen, Skripten oder Szenen verwendet", relUnstableMore: "{shown} von {total} Entities gezeigt.",
  relUnstableFootnote: "Instabil: mindestens 3 Ausfälle und 0,5 pro Tag, flatternd ab 1,5 pro Tag. Ausfälle während eines gemeinsamen Ausfalls der Integration zählen für die Integration, nicht für die Entity. Dauerhaft ausgefallene, deaktivierte und ignorierte Entities fehlen.",
  relFootnote: "Verfügbarkeit: Anteil der Zeit ohne „nicht verfügbar“ in den letzten {days} Tagen, gerechnet ab der ersten Meldung im Zeitraum. Ein gemeinsamer Ausfall heißt: mindestens 80 % der Entities des Eintrags, mindestens drei, mindestens 5 Minuten zugleich nicht verfügbar. Ein Ausfall, der vor dem Zeitraum begann, zählt erst ab der ersten Meldung darin.",
});
Object.assign(TEXT.en, {
  reliability: "Reliability", reliabilitySubtitle: "How available each integration's entities were and when they failed together. Only reads the recorder.",
  relTitle: "Integrations by availability", relHint: "Worst first. Calculated from the states in the recorder",
  relWindow1: "24 hours", relWindow7: "7 days", relRefresh: "Recalculate", relLoading: "Evaluating the recorder. On a large database this can take a few seconds …",
  relTook: "calculated in {s} s", relCached: "from the cache ({s} s)", relNoRecorder: "The Home Assistant recorder is not available.",
  relBusy: "Another calculation is still running. Fetch it again in a moment with “Recalculate”.", relEmpty: "There are no integration states in this period.",
  relEntities: "{n} entities", relPermanent: "{n} down all the time, not counted",
  relShared: "{n} shared outages, longest {longest}", relSharedOne: "1 shared outage, {longest}", relLayerCloud: "probably the cloud or its API (a guess)", relLayerLocal: "probably the device, the network or the integration (a guess)",
  relReauth: "Re-authentication open", relLastShared: "Last shared outage until {date} ({duration})", relLastSingle: "Last disruption until {date} ({duration})", relNoDisruption: "No disruption",
  relMinutes: "{n} min", relHours: "{n} h", relDays: "{n} days",
  relUnstableTitle: "Unstable entities", relUnstableHint: "They keep failing and coming back. Entities with dependants come first.", relUnstableNone: "No entity fails unusually often.",
  relUnstable: "unstable", relFlapping: "flapping", relEpisodes: "{n} failures in {days} days ({rate} a day) · {total} in all, {mean} on average",
  relPattern: "recurring, mostly between {from} and {to} o'clock", relFollowers: "used by {n} automations, scripts or scenes", relUnstableMore: "{shown} of {total} entities shown.",
  relUnstableFootnote: "Unstable: at least 3 failures and 0.5 a day, flapping from 1.5 a day. Failures during a shared outage of the integration count for the integration, not the entity. Entities that are down all the time, disabled or ignored are left out.",
  relFootnote: "Availability: the share of time without “unavailable” in the last {days} days, counted from the first report in the period. A shared outage means at least 80 % of the entry's entities, at least three, were unavailable together for at least 5 minutes. An outage that began before the period counts from the first report in it.",
});

// Texts for the automation runs view; merged into TEXT.
Object.assign(TEXT.de, {
  runs: "Automationen", runsHeading: "Automationen im Betrieb", runsSubtitle: "Wie oft Automationen und Skripte laufen, scheitern oder ohne Wirkung enden. Gezählt aus den Läufen, die Home Assistant kurz vorhält.",
  runsTitle: "Auffällig", runsHint: "Letzte 7 Tage. Ein fehlerfreier Lauf heißt nicht, dass die Automation ihren Zweck erfüllt",
  runsSince: "Gezählt seit {date}; ältere Läufe sind in Home Assistant nicht mehr vorhanden.", runsRefresh: "Neu zählen",
  runsLoading: "Die Läufe werden gezählt …", runsNone: "Nichts Auffälliges in den gezählten Läufen.", runsNoData: "Noch keine Läufe gezählt. Der Zähler liest alle 15 Minuten.",
  runsAll: "Alle gezählten Läufe", runsColName: "Name", runsColRuns: "Läufe", runsColErrors: "Fehler", runsColConditions: "Bedingung", runsColDuration: "Dauer Ø / max", runsColTrend: "7 Tage",
  runsLowerBound: "mindestens, Läufe können fehlen", runsMore: "{shown} von {total} Zeilen gezeigt.", runsTrendLabel: "Läufe je Tag, ältester zuerst: {values}",
  runsMs: "{n} ms", runsSec: "{n} s", runsTab: "Läufe", runsTabHint: "Letzte 7 Tage, gezählt seit {date}",
  runsFootnote: "Gezählt wird, was Home Assistant je Automation kurz vorhält (standardmäßig 5 Läufe), alle 15 Minuten. Gespeichert werden nur Zähler je Tag und die Stelle eines Fehlers, keine Variablen, Daten oder Fehlertexte. Die Hinweise sind Anlässe, genauer hinzusehen, kein Urteil.",
  rfLabelFailing: "Fehler", rfLabelOverlap: "Überschneidung", rfLabelNeverOk: "nie erfolgreich", rfLabelNoEffect: "ohne Wirkung", rfLabelBurst: "sehr oft", rfLabelLongRun: "lange Läufe", rfLabelAfterUpdate: "nach Update", rfLabelLongWait: "lange Wartezeit", rfLabelWaitNoTimeout: "ohne Timeout", rfLabelContinue: "Fehler verdeckt",
  rfFailing: "{errors} von {runs} Läufen endeten mit einem Fehler.", rfFailingStep: " Meist an Stelle {step} ({count}-mal).",
  rfOverlap: "{n} Läufe wurden abgewiesen oder überschritten das Maximum (Modus {mode}).", rfNeverOk: "Kein Lauf war erfolgreich ({runs} Läufe).",
  rfNoEffect: "{conditions} von {runs} Läufen endeten an einer Bedingung.", rfBurst: "Läuft ungewöhnlich oft: {perDay} pro Tag statt üblich {normal}.",
  rfLongRun: "Ein Lauf dauerte {longest}, üblich sind {normal}.",
  rfAfterUpdate: "Fehlerquote {after} % nach dem Update ({what}) statt {before} % davor. Zeitlich zusammen, nicht als Ursache bewiesen.", rfWhatHa: "Home Assistant {to}", rfWhatEntry: "{domain} {to}",
  rfLongWait: "Enthält eine Wartezeit von {duration}; sie geht bei einem Neustart verloren.", rfWaitNoTimeout: "{n} Warteschritt(e) ohne Timeout; sie gehen bei einem Neustart verloren.",
  rfContinue: "{n} Schritt(e) mit „continue_on_error“; Fehler bleiben dort unsichtbar.",
});
Object.assign(TEXT.en, {
  runs: "Automations", runsHeading: "Automations in operation", runsSubtitle: "How often automations and scripts run, fail or end without effect. Counted from the runs Home Assistant keeps for a short time.",
  runsTitle: "Needs a look", runsHint: "Last 7 days. A run without an error does not mean the automation does its job",
  runsSince: "Counted since {date}; older runs are no longer in Home Assistant.", runsRefresh: "Count again",
  runsLoading: "Counting the runs …", runsNone: "Nothing stands out in the counted runs.", runsNoData: "No runs counted yet. The counter reads every 15 minutes.",
  runsAll: "All counted runs", runsColName: "Name", runsColRuns: "Runs", runsColErrors: "Errors", runsColConditions: "Condition", runsColDuration: "Duration avg / max", runsColTrend: "7 days",
  runsLowerBound: "at least, runs may be missing", runsMore: "{shown} of {total} rows shown.", runsTrendLabel: "Runs per day, oldest first: {values}",
  runsMs: "{n} ms", runsSec: "{n} s", runsTab: "Runs", runsTabHint: "Last 7 days, counted since {date}",
  runsFootnote: "What is counted is what Home Assistant keeps for each automation for a short time (5 runs by default), read every 15 minutes. Only counters per day and the place of a failure are stored, no variables, data or error texts. The notes are reasons to look closer, not a verdict.",
  rfLabelFailing: "failing", rfLabelOverlap: "overlap", rfLabelNeverOk: "never succeeds", rfLabelNoEffect: "no effect", rfLabelBurst: "very often", rfLabelLongRun: "long runs", rfLabelAfterUpdate: "after update", rfLabelLongWait: "long wait", rfLabelWaitNoTimeout: "no timeout", rfLabelContinue: "errors hidden",
  rfFailing: "{errors} of {runs} runs ended with an error.", rfFailingStep: " Mostly at step {step} ({count} times).",
  rfOverlap: "{n} runs were rejected or exceeded the maximum (mode {mode}).", rfNeverOk: "No run succeeded ({runs} runs).",
  rfNoEffect: "{conditions} of {runs} runs ended at a condition.", rfBurst: "Runs unusually often: {perDay} a day instead of the usual {normal}.",
  rfLongRun: "One run took {longest}; {normal} is usual.",
  rfAfterUpdate: "Error rate {after} % after the update ({what}) instead of {before} % before. Close in time, not proven as the cause.", rfWhatHa: "Home Assistant {to}", rfWhatEntry: "{domain} {to}",
  rfLongWait: "Contains a wait of {duration}; it is lost on a restart.", rfWaitNoTimeout: "{n} wait step(s) without a timeout; they are lost on a restart.",
  rfContinue: "{n} step(s) with “continue_on_error”; errors stay invisible there.",
});

// ThemeMixin: methods of the panel element, mixed into the class in 99-register.js.
class ThemeMixin {
  // Display preferences live in this browser only; storage may be unavailable.
  loadPrefs() {
    try { return this.sanitizePrefs(JSON.parse(globalThis.localStorage?.getItem(PREFS_KEY) || "{}")); } catch (_) { return { ...DEFAULT_PREFS }; }
  }

  // Keep only known, valid values; anything else falls back to the default.
  sanitizePrefs(saved) {
    const prefs = { ...DEFAULT_PREFS };
    if (!saved || typeof saved !== "object") return prefs;
    if (SIZES[saved.size]) prefs.size = saved.size;
    if (["auto", "light", "dark"].includes(saved.mode)) prefs.mode = saved.mode;
    const scheme = SCHEME_ALIASES[saved.scheme] || saved.scheme;
    if (SCHEMES[scheme]) prefs.scheme = scheme;
    if (["normal", "compact"].includes(saved.density)) prefs.density = saved.density;
    if (["auto", "reduced"].includes(saved.motion)) prefs.motion = saved.motion;
    if ([20, 50, 100].includes(saved.pageSize)) prefs.pageSize = saved.pageSize;
    if (START_VIEWS.includes(saved.startView)) prefs.startView = saved.startView;
    if (["list", "graph"].includes(saved.graphMode)) prefs.graphMode = saved.graphMode;
    return prefs;
  }

  // The Home Assistant user profile keeps the preferences across devices; this browser is the fallback.
  async loadUserPrefs() {
    try {
      const result = await this._hass?.callWS?.({ type: "frontend/get_user_data", key: USER_DATA_KEY });
      if (!result?.value) return;
      const prefs = this.sanitizePrefs(result.value);
      if (JSON.stringify(prefs) === JSON.stringify(this.prefs)) return;
      this.prefs = prefs; this.pageSize = prefs.pageSize; this.pages = {};
      this.savePrefs(false);
      this.render();
    } catch (_) { /* no user data available; local preferences stay */ }
  }

  savePrefs(sync = true) {
    try { globalThis.localStorage?.setItem(PREFS_KEY, JSON.stringify(this.prefs)); } catch (_) { /* ignore */ }
    if (sync) Promise.resolve(this._hass?.callWS?.({ type: "frontend/set_user_data", key: USER_DATA_KEY, value: this.prefs })).catch(() => {});
  }

  isDark() {
    if (this.prefs.mode !== "auto") return this.prefs.mode === "dark";
    const ha = this._hass?.themes?.darkMode;
    if (typeof ha === "boolean") return ha;
    try { return Boolean(globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches); } catch (_) { return false; }
  }

  themeCss() {
    const { scheme, mode, size } = this.prefs;
    let vars = `--hk-fs:${SIZES[size] || 1};font-size:calc(14px*${SIZES[size] || 1})`;
    if (!(scheme === "standard" && mode === "auto")) {
      const dark = this.isDark(), p = (SCHEMES[scheme] || SCHEMES.standard)[dark ? "dark" : "light"];
      vars += `;--hk-blue:${p.accent};--hk-bg:${p.bg};--hk-surface:${p.surface};--hk-soft:${p.soft};--hk-text:${p.text};--hk-muted:${p.muted};--hk-border:${p.border};--hk-on:${p.on || "#ffffff"};--hk-green:${p.positive};--hk-amber:${p.warning};--hk-red:${p.danger};color-scheme:${dark ? "dark" : "light"}`;
    }
    const compact = this.prefs.density === "compact" ? `.row{padding-top:6px;padding-bottom:6px}.card{padding:10px 12px}.panelhead{min-height:44px;padding-top:8px;padding-bottom:8px}td{padding:6px 14px}th{padding:7px 14px}.nav{min-height:36px}.tile{width:30px;height:30px}.setrow{padding-top:9px;padding-bottom:9px}.chips{padding-top:8px;padding-bottom:8px}.listbar{padding-top:8px;padding-bottom:8px}.summary,.stack,.grid2{gap:10px}.heading{margin-bottom:14px}` : "";
    const calm = "*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}";
    const motion = this.prefs.motion === "reduced" ? calm : `@media(prefers-reduced-motion:reduce){${calm}}`;
    return `:host{${vars}}${compact}${motion}`;
  }

  setPref(key, raw) {
    const value = key === "pageSize" ? Number(raw) : raw;
    this.prefs = { ...this.prefs, [key]: value };
    if (key === "pageSize") { this.pageSize = value; this.pages = {}; }
    this.savePrefs();
    this.render();
  }
}

// StylesMixin: methods of the panel element, mixed into the class in 99-register.js.
class StylesMixin {
  styles() {
    return `<style data-hk>
      :host{--hk-blue:var(--primary-color,#0789cf);--hk-blue-solid:color-mix(in srgb,var(--hk-blue) 76%,#000);--hk-blue-text:color-mix(in srgb,var(--hk-blue) 58%,var(--hk-text,#1c1c1c));--hk-surface:var(--card-background-color,#fff);--hk-bg:var(--primary-background-color,#f4f6f9);--hk-soft:var(--secondary-background-color,#f6f8fa);--hk-text:var(--primary-text-color,#17212b);--hk-muted:var(--secondary-text-color,#637281);--hk-border:var(--divider-color,#dde4ea);--hk-green:#1f9d63;--hk-amber:#d68a00;--hk-red:#d94452;--hk-violet:#7a62c9;--hk-gray:#7b8794;display:block;min-height:100%;background:var(--hk-bg);color:var(--hk-text);font-family:"IBM Plex Sans",var(--paper-font-body1_-_font-family,Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif)}
      *{box-sizing:border-box} button,input,select{font:inherit;color:inherit} button{cursor:pointer} h1,h2,h3,h4,p{margin:0}
      ha-icon{--mdc-icon-size:20px}
      .shell{min-height:100vh;display:block}
      .top{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:22px;padding:0 clamp(16px,2.4vw,32px);min-height:calc(60px*var(--hk-fs,1));border-bottom:1px solid var(--hk-border);background:var(--hk-surface)}
      .brand{display:flex;align-items:center;gap:10px;flex:none}.brandmark{width:34px;height:34px;display:grid;place-items:center;flex:none}.brandmark img{width:34px;height:34px;object-fit:contain}.brandmark ha-icon{display:none}.brandmark.nologo{border-radius:10px;color:#fff;background:linear-gradient(135deg,#0394d5,#087dbb)}.brandmark.nologo ha-icon{display:block}.brand strong{font-weight:600;font-size:calc(17px*var(--hk-fs,1));white-space:nowrap}
      .topnav{flex:1;min-width:0;display:flex;align-items:stretch;align-self:stretch;gap:2px}.navmenu{position:relative;display:flex;align-items:stretch}.navend{margin-left:auto;display:flex;align-items:stretch}.navhead{display:none;padding:10px 12px 2px;color:var(--hk-muted);font-size:calc(10.5px*var(--hk-fs,1));font-weight:600;letter-spacing:.06em;text-transform:uppercase}
      .nav{min-height:44px;display:inline-flex;align-items:center;gap:8px;padding:0 12px;border:0;border-bottom:3px solid transparent;border-radius:0;color:var(--hk-muted);background:transparent;font-weight:500;white-space:nowrap}.nav:hover{color:var(--hk-text);background:var(--hk-soft)}.nav ha-icon{--mdc-icon-size:20px}.nav .caret{--mdc-icon-size:16px;margin-left:-2px}
      .navpop{display:none;position:absolute;top:100%;left:0;min-width:210px;padding:6px;border:1px solid var(--hk-border);border-radius:12px;background:var(--hk-surface);box-shadow:0 8px 24px rgba(0,0,0,.14)}.navmenu.open .navpop{display:grid;gap:2px}.navpop .nav{min-height:40px;border-bottom:0;border-radius:8px}.navpop .nav.active{box-shadow:inset 3px 0 0 var(--hk-blue)}
      .nav.active{color:var(--hk-blue-text);border-bottom-color:var(--hk-blue);font-weight:600}.nav em{min-width:22px;padding:2px 6px;border-radius:10px;color:var(--hk-muted);background:var(--hk-soft);font-size:calc(11px*var(--hk-fs,1));font-style:normal;text-align:center}.nav.group-active{color:var(--hk-blue-text);border-bottom-color:var(--hk-blue);font-weight:600}.navtoggle{display:none;margin-left:auto;min-height:40px;align-items:center;gap:6px;padding:0 10px;border:1px solid var(--hk-border);border-radius:8px;background:var(--hk-surface);color:inherit}
      .lock{display:flex;align-items:center;gap:7px;font-size:calc(11px*var(--hk-fs,1));color:var(--hk-green)}.lock ha-icon{--mdc-icon-size:16px}
      .main{min-width:0;max-width:1480px;margin:0 auto;padding:26px clamp(16px,2.4vw,32px) 60px}
      .heading{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:20px}.eyebrow{color:var(--hk-blue-text);font-size:calc(11px*var(--hk-fs,1));font-weight:600;letter-spacing:.09em;text-transform:uppercase;margin-bottom:3px}
      h1{font-size:calc(25px*var(--hk-fs,1));font-weight:600;line-height:1.2}.sub{display:block;margin-top:6px;color:var(--hk-muted);font-size:calc(13px*var(--hk-fs,1))}
      .btn{min-height:37px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:8px 14px;border-radius:8px;font-weight:600;border:1px solid var(--hk-border);background:var(--hk-surface)}.btn:hover{background:var(--hk-soft)}
      .toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 16px;border-bottom:1px solid var(--hk-border)}.toolgap{flex:1}.btn.quiet{border-color:transparent;background:none;color:var(--hk-blue-text);padding:8px 10px}.btn.quiet:hover{background:var(--hk-soft)}.btn.quiet[disabled]{color:var(--hk-muted);opacity:.7;cursor:default}
      .btn.primary{border-color:var(--hk-blue-solid);color:var(--hk-on,#fff);background:var(--hk-blue-solid)}.btn.primary:hover{background:#0a8ccf}.btn[disabled]{opacity:.6;cursor:wait}
      .summary{display:grid;grid-template-columns:repeat(4,1fr) 1.3fr;gap:12px;margin-bottom:14px}
      .card{min-width:0;display:grid;grid-template-columns:auto 1fr;align-items:center;gap:12px;padding:15px;border:1px solid var(--hk-border);border-radius:12px;background:var(--hk-surface);color:inherit;text-align:left}
      button.card:hover{border-color:var(--hk-blue)}
      .ring{--p:90;--c:var(--hk-green);width:58px;height:58px;display:grid;place-content:center;border-radius:50%;text-align:center;background:radial-gradient(circle at center,var(--hk-surface) 66%,transparent 68%),conic-gradient(var(--c) calc(var(--p)*1%),var(--hk-soft) 0)}.ring b{font-size:calc(13px*var(--hk-fs,1));font-weight:600;line-height:1}.ring.warn{--c:var(--hk-amber)}.ring.red{--c:var(--hk-red)}
      .card-text{min-width:0;display:grid;gap:2px}.card-text small{color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}.card-text strong{font-size:calc(22px*var(--hk-fs,1));font-weight:600;line-height:1.2}.card-text em{overflow:hidden;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1));font-style:normal;text-overflow:ellipsis;white-space:nowrap}
      .tile{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;color:var(--hk-blue);background:color-mix(in srgb,var(--hk-blue) 13%,transparent);flex:none}
      .tile.ok{color:var(--hk-green);background:color-mix(in srgb,var(--hk-green) 14%,transparent)}.tile.warn{color:var(--hk-amber);background:color-mix(in srgb,var(--hk-amber) 15%,transparent)}.tile.red{color:var(--hk-red);background:color-mix(in srgb,var(--hk-red) 13%,transparent)}.tile.mute{color:var(--hk-gray);background:color-mix(in srgb,var(--hk-gray) 15%,transparent)}.tile.violet{color:var(--hk-violet);background:color-mix(in srgb,var(--hk-violet) 14%,transparent)}
      .grid2{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(280px,.8fr);gap:14px;align-items:start}.stack{display:grid;gap:14px}
      .panel{border:1px solid var(--hk-border);border-radius:12px;background:var(--hk-surface);overflow:hidden}.panelhead{min-height:56px;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--hk-border)}.panelhead h2{font-size:calc(15px*var(--hk-fs,1));font-weight:600}.panelhead p{margin-top:3px;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}
      .link{display:inline-flex;align-items:center;gap:4px;padding:4px;border:0;color:var(--hk-blue-text);background:transparent;font-size:calc(12px*var(--hk-fs,1));font-weight:600}
      .row{width:100%;display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;align-items:center;gap:12px;padding:12px 16px;border:0;border-bottom:1px solid var(--hk-border);background:transparent;color:inherit;text-align:left}.row:last-child{border-bottom:0}.row:hover{background:var(--hk-soft)}
      .row .tile{width:34px;height:34px}.row-text{min-width:0;display:grid;gap:2px}.row-text strong{overflow:hidden;font-size:calc(13px*var(--hk-fs,1));font-weight:600;text-overflow:ellipsis;white-space:nowrap}.row-text small{overflow:hidden;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1));text-overflow:ellipsis;white-space:nowrap}.date{color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1));white-space:nowrap}
      .pill{display:inline-flex;align-items:center;gap:6px;width:max-content;padding:3px 9px;border-radius:99px;font-size:calc(11px*var(--hk-fs,1));font-weight:600;white-space:nowrap;color:color-mix(in srgb,var(--hk-blue) 60%,var(--hk-text));background:color-mix(in srgb,var(--hk-blue) 13%,transparent)}
      .pill.ok{color:color-mix(in srgb,var(--hk-green) 60%,var(--hk-text));background:color-mix(in srgb,var(--hk-green) 14%,transparent)}.pill.warn{color:color-mix(in srgb,var(--hk-amber) 60%,var(--hk-text));background:color-mix(in srgb,var(--hk-amber) 16%,transparent)}.pill.red{color:color-mix(in srgb,var(--hk-red) 60%,var(--hk-text));background:color-mix(in srgb,var(--hk-red) 13%,transparent)}.pill.mute{color:color-mix(in srgb,var(--hk-gray) 60%,var(--hk-text));background:color-mix(in srgb,var(--hk-gray) 16%,transparent)}.pill.violet{color:color-mix(in srgb,var(--hk-violet) 60%,var(--hk-text));background:color-mix(in srgb,var(--hk-violet) 14%,transparent)}
      .linklike{padding:0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.linklike:hover{text-decoration:underline}.qrow{grid-template-columns:auto minmax(0,1fr) auto auto}.qconfirm{display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap}.factaction{display:block;margin-top:6px}
      .spark{display:inline-flex;align-items:flex-end;gap:2px;height:22px}.spark i{display:block;width:5px;min-height:2px;border-radius:1px;background:var(--hk-blue)}
      .bar{display:flex;height:10px;margin:16px;border-radius:99px;overflow:hidden;background:var(--hk-soft)}.bar i{display:block;min-width:2px}.legend{display:grid;gap:9px;padding:0 16px 16px;font-size:calc(12px*var(--hk-fs,1))}.legend div{display:flex;align-items:center;justify-content:space-between;gap:8px}.legend span{display:flex;align-items:center;gap:8px}.dot{width:9px;height:9px;border-radius:50%;background:var(--hk-blue)}
      .dot.ok,.bar .ok{background:var(--hk-green)}.dot.warn,.bar .warn{background:var(--hk-amber)}.dot.red,.bar .red{background:var(--hk-red)}.dot.mute,.bar .mute{background:var(--hk-gray)}.dot.violet,.bar .violet{background:var(--hk-violet)}
      .types{display:grid}.type{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;padding:10px 16px;border:0;border-top:1px solid var(--hk-border);background:transparent;text-align:left;font-size:calc(13px*var(--hk-fs,1))}.type:hover{background:var(--hk-soft)}.type .tile{width:30px;height:30px}.type b{font-weight:600}
      .mobsort,.msince{display:none}
      .sr-only{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
      button:focus-visible,[data-object]:focus-visible,tr[data-object]:focus-visible,th[data-sort]:focus-visible,.nav:focus-visible,.chip:focus-visible,summary:focus-visible,a:focus-visible{outline:2px solid var(--hk-blue);outline-offset:2px}
      .filters{display:grid;grid-template-columns:minmax(240px,1fr) 190px 190px;gap:10px;padding:14px;border-bottom:1px solid var(--hk-border)}
      input,select{border:1px solid var(--hk-border);border-radius:8px;background:var(--hk-surface);padding:9px 12px;min-width:0}input:focus,select:focus{outline:2px solid color-mix(in srgb,var(--hk-blue) 35%,transparent);border-color:var(--hk-blue)}
      .listbar{display:flex;flex-wrap:wrap;gap:10px;padding:12px 14px;border-bottom:1px solid var(--hk-border)}.listbar input{flex:1 1 220px}.listbar select{flex:0 1 180px}.dirbtn{display:grid;place-items:center;border:1px solid var(--hk-border);border-radius:8px;background:var(--hk-surface);color:inherit;padding:0 10px}.dirbtn:hover{border-color:var(--hk-blue)}
      .setrow{display:grid;grid-template-columns:minmax(150px,240px) 1fr;gap:12px;align-items:center;padding:14px 16px;border-bottom:1px solid var(--hk-border)}.setrow:last-child{border-bottom:0}.setrow small{display:block;margin-top:3px;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}.setrow select{max-width:240px}.setrow .btn{justify-self:start}.seg{display:flex;flex-wrap:wrap;gap:8px}.swatch{display:inline-block;width:10px;height:10px;margin-right:6px;border-radius:50%;vertical-align:-1px}a.btn{color:inherit;text-decoration:none}
      @media(max-width:700px){.setrow{grid-template-columns:1fr}}
      .row,.btn,.card,.chip,.nav,.dirbtn{transition:background-color .15s ease,border-color .15s ease,color .15s ease}.bar i{transition:width .4s ease}@keyframes hk-spin{to{transform:rotate(360deg)}}.loading ha-icon,.btn[disabled] ha-icon{animation:hk-spin 1s linear infinite}
      .tablewrap{overflow:auto}table{border-collapse:collapse;width:100%}th{text-align:left;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1));font-weight:600;text-transform:uppercase;letter-spacing:.05em;padding:11px 16px;background:var(--hk-soft);cursor:pointer;white-space:nowrap}.thbtn{padding:0;border:0;background:none;color:inherit;font:inherit;letter-spacing:inherit;text-transform:inherit;cursor:pointer}td{padding:11px 16px;border-top:1px solid var(--hk-border);font-size:calc(13px*var(--hk-fs,1))}tbody tr{cursor:pointer}tbody tr:hover{background:var(--hk-soft)}
      .object{display:flex;align-items:center;gap:11px;min-width:260px}.object .tile{width:34px;height:34px}.object strong{display:block;font-weight:600}.id{display:block;color:var(--hk-muted);font-family:ui-monospace,SFMono-Regular,monospace;font-size:calc(11px*var(--hk-fs,1));margin-top:2px;max-width:390px;overflow:hidden;text-overflow:ellipsis}
      .tablefoot{padding:12px 16px;border-top:1px solid var(--hk-border);color:var(--hk-muted);font-size:calc(12px*var(--hk-fs,1));display:flex;align-items:center;justify-content:space-between;gap:10px}.pager{display:flex;align-items:center;gap:8px}.pager button{border:1px solid var(--hk-border);background:var(--hk-surface);border-radius:7px;padding:5px 10px}.pager button:disabled{opacity:.4}
      .chips .spacer{flex:1}.chips{display:flex;flex-wrap:wrap;gap:8px;padding:12px 16px;border-bottom:1px solid var(--hk-border)}.chip{border:1px solid var(--hk-border);background:var(--hk-surface);border-radius:99px;padding:5px 12px;font-size:calc(12px*var(--hk-fs,1));color:var(--hk-muted)}.chip.active{color:var(--hk-blue-text);border-color:var(--hk-blue);background:color-mix(in srgb,var(--hk-blue) 11%,transparent);font-weight:600}
      .emptymsg,.loading{padding:46px;text-align:center;color:var(--hk-muted)}.emptymsg ha-icon{--mdc-icon-size:34px;color:var(--hk-green);display:block;margin:0 auto 8px}.error{padding:18px;border-radius:12px;background:color-mix(in srgb,var(--hk-red) 12%,transparent);color:var(--hk-red)}
      .bhattest{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;padding:8px 16px 12px 62px;border-top:1px solid var(--hk-border);background:var(--hk-soft)}.bhattest label{display:flex;align-items:center;gap:8px;font-size:calc(12px*var(--hk-fs,1));color:var(--hk-muted)}.bhattest input{padding:6px 8px;border:1px solid var(--hk-border);border-radius:8px;background:var(--hk-surface);color:var(--hk-text);font:inherit}
      .bh .row-text small{overflow:visible;white-space:normal;text-overflow:clip}
      .bhguide{padding:12px 16px;border-top:1px solid var(--hk-border)}.bhguide summary{font-size:calc(12px*var(--hk-fs,1))}.bhguide .factnote{padding:8px 0 0;border:0}
      .graphbar{display:flex;flex-wrap:wrap;gap:10px 14px;align-items:center;padding:10px 14px;margin-bottom:14px}.graphctl{display:flex;align-items:center;gap:8px}.graphctl small{color:var(--hk-muted)}.graphwrap{overflow:auto;padding:14px}.graphsvg{display:block;max-width:none}
      .gedge{fill:none;stroke:var(--hk-muted);stroke-width:1.5}.gedge.prob{stroke-dasharray:7 4}.gedge.cycle{stroke:var(--hk-red);stroke-dasharray:2 3}.gedge.hit{stroke:var(--hk-red);stroke-width:2.5}.garrow{fill:var(--hk-muted)}.gdim{opacity:.3}
      .gnode{cursor:pointer}.gnode.center{cursor:default}.gnode rect{fill:var(--hk-surface);stroke:var(--hk-border);stroke-width:1.5}.gnode.center rect{stroke:var(--hk-blue);stroke-width:2.5}.gnode.missing rect{stroke:var(--hk-red);stroke-dasharray:4 3}.gnode.hit rect{stroke:var(--hk-red);stroke-width:2.5}.gnode rect.bar{stroke:none;fill:var(--hk-blue)}.gnode rect.bar.ok{fill:var(--hk-green)}.gnode rect.bar.warn{fill:var(--hk-amber)}.gnode rect.bar.red{fill:var(--hk-red)}.gnode rect.bar.mute{fill:var(--hk-gray)}.gnode rect.bar.violet{fill:var(--hk-violet)}
      .gnode text{fill:var(--hk-text);font-size:calc(12px*var(--hk-fs,1));font-weight:600}.gnode text.t1{fill:var(--hk-muted);font-size:calc(10px*var(--hk-fs,1));font-weight:400}.gnode:focus-visible{outline:none}.gnode:focus-visible rect:first-of-type{stroke:var(--hk-blue);stroke-width:3.5}.gnode:hover rect:first-of-type{stroke:var(--hk-blue)}
      .pathcard{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:14px;padding:16px;margin-bottom:14px}.pathcard h2{font-size:calc(17px*var(--hk-fs,1));font-weight:600}
      .path{padding:16px;display:grid;gap:0}.node{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;padding:11px 13px;border:1px solid var(--hk-border);border-radius:10px;background:var(--hk-surface);color:inherit;text-align:left;width:100%}button.node:hover{border-color:var(--hk-blue)}
      .node.current{border:2px solid var(--hk-blue);background:color-mix(in srgb,var(--hk-blue) 8%,var(--hk-surface))}.node .tile{width:34px;height:34px}.node small{display:block;color:var(--hk-blue-text);font-size:calc(11px*var(--hk-fs,1));font-weight:600;letter-spacing:.06em;text-transform:uppercase}.node strong{display:block;font-size:calc(13px*var(--hk-fs,1));font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.node span.meta{display:block;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}
      .link-label{margin:0 0 0 22px;padding:3px 0 3px 14px;border-left:2px solid var(--hk-border);color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1));min-height:26px;display:flex;align-items:center;gap:8px}
      .branch{margin:0 0 0 22px;padding:6px 0 0 18px;border-left:2px solid var(--hk-border);display:grid;gap:8px}
      .sectionlabel{padding:14px 16px 0;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1));font-weight:600;letter-spacing:.07em;text-transform:uppercase}
      .search{padding:14px;border-bottom:1px solid var(--hk-border)}.search input{width:100%}.hits{display:grid;max-height:280px;overflow:auto}.hit{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center;padding:9px 16px;border:0;border-top:1px solid var(--hk-border);background:transparent;text-align:left}.hit:hover{background:var(--hk-soft)}.hit .tile{width:30px;height:30px}
      .crumbs{display:flex;align-items:center;gap:12px;margin-bottom:14px}.crumbs .trail{color:var(--hk-muted);font-size:calc(12px*var(--hk-fs,1));text-transform:uppercase;letter-spacing:.07em}
      .detailhead{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:16px;padding:18px 20px;margin-bottom:14px}.detailhead .tile{width:48px;height:48px}.detailhead h1{margin:6px 0 2px;font-size:calc(22px*var(--hk-fs,1))}.actions{display:flex;flex-wrap:wrap;gap:8px}
      .sumline{display:flex;flex-wrap:wrap;gap:10px 26px;padding:12px 18px;margin-bottom:14px}.sumline span{display:grid;gap:3px;align-content:start}.sumline small{color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}.sumline b{font-size:calc(13px*var(--hk-fs,1));font-weight:600}
      .tabs{display:flex;gap:4px;margin-bottom:14px;border-bottom:1px solid var(--hk-border);overflow-x:auto}.tab{flex:none;padding:10px 14px;border:0;border-bottom:2px solid transparent;background:none;color:var(--hk-muted);white-space:nowrap}.tab em{font-style:normal;font-size:calc(11px*var(--hk-fs,1));padding:1px 6px;border-radius:10px;background:var(--hk-soft)}.tab[aria-selected="true"]{color:var(--hk-blue-text);border-bottom-color:var(--hk-blue);font-weight:600}
      .detailgrid{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(320px,1fr);gap:14px;align-items:start}.pad{padding:16px}
      .facts{display:grid}.fact{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:11px 16px;border-top:1px solid var(--hk-border);font-size:calc(13px*var(--hk-fs,1))}.fact:first-child{border-top:0}.fact span{color:var(--hk-muted)}.fact b{font-weight:600;text-align:right}.fact small{display:block;margin-top:2px;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1));font-weight:400}
      .factnote{padding:12px 16px;border-top:1px solid var(--hk-border);color:var(--hk-muted);font-size:calc(12px*var(--hk-fs,1));line-height:1.5}
      .diagcard{display:grid;gap:12px;padding:16px}.checks{display:grid;gap:8px}
      .check{display:grid;grid-template-columns:22px minmax(100px,150px) minmax(0,1fr) auto;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--hk-border);border-radius:10px;background:var(--hk-soft);font-size:calc(13px*var(--hk-fs,1))}.check b{font-weight:600}.check .val{overflow:hidden;color:var(--hk-muted);text-overflow:ellipsis;white-space:nowrap}
      .check ha-icon{--mdc-icon-size:20px}.check.ok ha-icon{color:var(--hk-green)}.check.warn ha-icon{color:var(--hk-amber)}.check.red ha-icon{color:var(--hk-red)}.check.mute ha-icon{color:var(--hk-gray)}.check.violet ha-icon{color:var(--hk-violet)}
      .cause,.hintbox{display:grid;grid-template-columns:auto 1fr;gap:12px;padding:14px;border:1px solid var(--hk-border);border-radius:10px;background:var(--hk-soft)}.cause strong,.hintbox strong{display:block;margin-bottom:4px;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1));letter-spacing:.07em;text-transform:uppercase}.cause p,.hintbox p{font-size:calc(13px*var(--hk-fs,1));line-height:1.55}
      .cause.ok{background:color-mix(in srgb,var(--hk-green) 9%,transparent);border-color:color-mix(in srgb,var(--hk-green) 35%,transparent)}.cause.warn{background:color-mix(in srgb,var(--hk-amber) 10%,transparent);border-color:color-mix(in srgb,var(--hk-amber) 35%,transparent)}.cause.red{background:color-mix(in srgb,var(--hk-red) 9%,transparent);border-color:color-mix(in srgb,var(--hk-red) 35%,transparent)}.cause.violet{background:color-mix(in srgb,var(--hk-violet) 9%,transparent);border-color:color-mix(in srgb,var(--hk-violet) 35%,transparent)}
      .cause ha-icon{color:var(--hk-muted)}.hintbox ha-icon{color:var(--hk-amber)}.row.rel{grid-template-columns:auto minmax(0,1fr) auto}
      .changesum{grid-template-columns:repeat(5,1fr)}
      .finding{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;border-top:1px solid var(--hk-border);font-size:calc(13px*var(--hk-fs,1))}.finding strong{display:block;font-weight:600}.finding small{display:block;margin-top:3px;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}.row.dim .tile{opacity:.55}.row.dim strong{font-weight:500}
      .kv{display:grid;grid-template-columns:155px 1fr;gap:8px 14px;font-size:calc(13px*var(--hk-fs,1))}.kv dt{color:var(--hk-muted)}.kv dd{margin:0;overflow-wrap:anywhere}
      .code{white-space:pre-wrap;word-break:break-word;background:var(--hk-soft);border-radius:10px;padding:12px;font:calc(11px*var(--hk-fs,1))/1.55 ui-monospace,SFMono-Regular,monospace;max-height:270px;overflow:auto}
      h4{font-size:calc(12px*var(--hk-fs,1));margin:12px 0 6px;color:var(--hk-muted)}
      @media(max-width:1100px){.summary{grid-template-columns:1fr 1fr}.grid2,.detailgrid{grid-template-columns:1fr}}
      @media(max-width:860px){.top{flex-wrap:wrap;gap:8px;padding:8px 12px}.navtoggle{display:inline-flex}.topnav{display:none;flex:1 1 100%;flex-direction:column;align-items:stretch;gap:0;padding-bottom:8px}.top.open .topnav{display:flex}.navmenu{display:block}.navmenu>.menubtn{display:none}.navpop{display:grid;position:static;min-width:0;padding:0;border:0;box-shadow:none;background:transparent}.navhead{display:block}.nav{width:100%;min-height:44px;border-bottom:0;border-radius:8px}.nav.active{box-shadow:inset 3px 0 0 var(--hk-blue);background:color-mix(in srgb,var(--hk-blue) 8%,transparent)}.navend{margin:0;display:block}.navend .nav{width:100%}.main{padding:16px 12px 40px}.heading{flex-wrap:wrap}.filters{grid-template-columns:1fr}.row{grid-template-columns:auto minmax(0,1fr) auto}.row .date{display:none}.tablewrap table,.tablewrap thead,.tablewrap tbody,.tablewrap tr,.tablewrap td{display:block}.tablewrap thead{display:none}.tablewrap tr{padding:12px 14px;border-top:1px solid var(--hk-border);cursor:pointer}.tablewrap td{padding:2px 0;border:0}.tablewrap td:nth-child(2),.tablewrap td:nth-child(3){display:inline-block;margin:4px 12px 2px 0}.tablewrap td[data-label]::before{content:attr(data-label) ": ";color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}.tablewrap td:nth-child(3)::before{content:""}.mobsort{display:flex;gap:8px}.msince{display:inline}.row-text strong,.row-text small{white-space:normal;overflow:visible;text-overflow:clip;overflow-wrap:anywhere}.pathcard{grid-template-columns:auto 1fr}.pathcard .btn{grid-column:1/-1}.planrow{grid-template-columns:auto minmax(0,1fr)}.planrow>span:last-child{grid-column:1/-1;justify-content:flex-start!important}.detailhead{grid-template-columns:auto 1fr}.actions{grid-column:1/-1}.check{grid-template-columns:22px 1fr auto}.check .val{grid-column:2/-1;grid-row:2;white-space:normal}}
      @media(max-width:520px){.summary{grid-template-columns:1fr}}
      /* Fixed sidebar: it stays in view while long content scrolls; Settings sits at the visible bottom edge. */
      /* Equal-width tiles on the overview and the changes view. */
      .summary{grid-template-columns:repeat(auto-fit,minmax(210px,1fr))}.summary>.card:has(.ring){grid-template-columns:auto minmax(0,1fr)}.summary .ring{width:56px;height:56px}.summary>.card:has(.ring) .card-text strong{font-size:calc(16px*var(--hk-fs,1));line-height:1.25}
      .summary>.card{min-height:92px;border-top:3px solid var(--hk-border)}
      .summary>.card:has(.ring){border-top-color:var(--hk-green)}.summary>.card:has(.ring.warn){border-top-color:var(--hk-amber)}.summary>.card:has(.ring.red){border-top-color:var(--hk-red)}
      .summary>.card:has(.tile.ok){border-top-color:var(--hk-green)}.summary>.card:has(.tile.warn){border-top-color:var(--hk-amber)}.summary>.card:has(.tile.red){border-top-color:var(--hk-red)}.summary>.card:has(.tile.violet){border-top-color:var(--hk-violet)}
      /* Polish */
      .panel,.card{box-shadow:0 1px 2px color-mix(in srgb,var(--hk-text) 7%,transparent)}
      .card{border-radius:14px}.card .tile{width:46px;height:46px;border-radius:13px}.card-text strong{font-size:calc(26px*var(--hk-fs,1));letter-spacing:-.01em}
      button.card{transition:transform .15s ease,box-shadow .15s ease,border-color .15s ease}button.card:hover{transform:translateY(-2px);box-shadow:0 6px 18px color-mix(in srgb,var(--hk-text) 12%,transparent)}
      h1{font-size:calc(28px*var(--hk-fs,1));letter-spacing:-.015em}.eyebrow{font-weight:700}
      .nav em{font-weight:600}.nav.active em{color:var(--hk-blue-text);background:color-mix(in srgb,var(--hk-blue) 6%,transparent)}
      .panelhead{background:linear-gradient(180deg,color-mix(in srgb,var(--hk-soft) 60%,transparent),transparent)}.panelhead h2{letter-spacing:-.005em}
      .propgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;align-items:start}.propgrid>.wide{grid-column:1/-1}.propgrid .panel{margin:0}.propgrid .kv{grid-template-columns:120px minmax(0,1fr)}.propgrid .kv dd small{display:block}
      .steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(172px,1fr));gap:8px;list-style:none;margin:0;padding:12px 16px;border-bottom:1px solid var(--hk-border)}.step{display:flex;gap:9px;align-items:flex-start;padding:8px 10px;border-radius:8px;color:var(--hk-muted)}.step .mark{flex:none;width:22px;height:22px;display:grid;place-items:center;border:1.5px solid currentColor;border-radius:50%;font-size:calc(11px*var(--hk-fs,1));font-weight:700}.steptext{display:grid;gap:2px;min-width:0}.steptext b{font-size:calc(12px*var(--hk-fs,1));font-weight:600;overflow-wrap:anywhere}.steptext small{font-size:calc(11px*var(--hk-fs,1));overflow-wrap:anywhere}
      .step.done{color:color-mix(in srgb,var(--hk-green) 60%,var(--hk-text))}.step.current{color:color-mix(in srgb,var(--hk-blue) 60%,var(--hk-text));background:color-mix(in srgb,var(--hk-blue) 10%,transparent)}.step.current .mark{background:var(--hk-blue);border-color:var(--hk-blue);color:var(--hk-on,#fff)}.step.failed{color:color-mix(in srgb,var(--hk-red) 60%,var(--hk-text));background:color-mix(in srgb,var(--hk-red) 9%,transparent)}.step.skipped{opacity:.85}
      .rowdetails{margin-top:6px}.rowdetails summary{cursor:pointer;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}
      .planrow{align-items:start}.planrow .row-text small{overflow:visible;white-space:normal;text-overflow:clip}
      .row.sel{background:color-mix(in srgb,var(--hk-blue) 10%,var(--hk-soft))}.row.sel .bar i{background:var(--hk-blue)}
      .row.rel:hover,button.row:hover{background:color-mix(in srgb,var(--hk-blue) 6%,var(--hk-soft))}
      .btn.primary{box-shadow:0 1px 3px color-mix(in srgb,var(--hk-blue) 40%,transparent)}.btn.primary:hover{filter:brightness(1.06);background:var(--hk-blue)}
      .scanago{color:var(--hk-muted);font-size:calc(12.5px*var(--hk-fs,1))}
      .head-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-end}
      @media(max-width:860px){.heading{flex-direction:column;align-items:stretch}.head-actions{justify-content:flex-start}}
      /* Look of the Zeitarchiv app: larger radius, soft shadow, calm tables, bold headings, Plex Mono for ids. */
      .card,.panel{border-radius:14px;box-shadow:0 1px 2px rgba(19,28,23,.06),0 1px 1px rgba(19,28,23,.04)}
      h1{font-size:calc(28px*var(--hk-fs,1));font-weight:700;letter-spacing:-.01em}
      .panelhead h2{font-size:calc(16px*var(--hk-fs,1));font-weight:600}
      th{background:transparent;font-size:calc(12px*var(--hk-fs,1));font-weight:500;letter-spacing:0;text-transform:none;border-bottom:1px solid var(--hk-border)}
      .id,.ring b,code,.mono{font-family:"IBM Plex Mono",ui-monospace,SFMono-Regular,monospace}
      .btn{border-radius:10px}.chip{padding:5px 13px}input,select{border-radius:10px}
      ${this.themeCss()}
    </style>`;
  }
}

// ListsMixin: methods of the panel element, mixed into the class in 99-register.js.
class ListsMixin {
  th(key, label) {
    const on = this.sort === key;
    return `<th data-sort="${key}" aria-sort="${on ? (this.sortDir === "desc" ? "descending" : "ascending") : "none"}"><button type="button" class="thbtn" data-sortbtn="${key}">${this.t(label)}${on ? ` <span aria-hidden="true">${this.sortDir === "desc" ? "▼" : "▲"}</span>` : ""}</button></th>`;
  }

  // Shared list controls: per-list search, filters and sort kept in this.lv[id].
  lvState(id, sort, dir) { return (this.lv[id] ||= { q: "", sort, dir, f: {} }); }

  areaName(item) {
    const device = item.device_id ? this.findObject(`device:${item.device_id}`) : null;
    return this.findObject(`area:${item.area_id || device?.area_id}`)?.name || "";
  }

  // Filter by search text and select filters, then sort. Empty values always sort last.
  refine(id, items, { text, filters = {}, sorts, tie }) {
    const st = this.lv[id], q = st.q.trim().toLowerCase();
    const get = sorts.find(x => x.key === st.sort)?.get || sorts[0].get;
    const sign = st.dir === "desc" ? -1 : 1;
    const empty = v => v === null || v === undefined || v === "";
    const { natural, ids } = this.collators();
    const rows = items.filter(it => (!q || text(it).toLowerCase().includes(q))
      && Object.entries(st.f).every(([name, value]) => !value || !filters[name] || filters[name](it, value)))
      .map(it => ({ it, key: get(it) })); // the sort key is read once per item, not per comparison
    rows.sort((a, b) => {
      const x = a.key, y = b.key;
      if (empty(x) !== empty(y)) return empty(x) ? 1 : -1;
      const order = typeof x === "number" && typeof y === "number" ? x - y : natural.compare(String(x ?? ""), String(y ?? ""));
      return order * sign || ids.compare(String(tie(a.it)), String(tie(b.it)));
    });
    return rows.map(row => row.it);
  }

  listBar(id, { sorts, filters = [] }) {
    const st = this.lv[id];
    (this.lvDirs ||= {})[id] = Object.fromEntries(sorts.map(x => [x.key, x.dir]));
    const selects = filters.map(f => `<select data-lf="${id}|${f.name}" aria-label="${this.esc(f.all)}"><option value="">${this.esc(f.all)}</option>${f.options.map(([v, label]) => `<option value="${this.esc(v)}" ${st.f[f.name] === v ? "selected" : ""}>${this.esc(label)}</option>`).join("")}</select>`).join("");
    const sortOptions = sorts.map(x => `<option value="${x.key}" ${st.sort === x.key ? "selected" : ""}>${this.t(x.label)}</option>`).join("");
    const desc = st.dir === "desc";
    return `<div class="listbar"><input type="search" data-lq="${id}" value="${this.esc(st.q)}" placeholder="${this.t("searchList")}">${selects}${sorts.length ? `<select data-ls="${id}" aria-label="${this.t("sortBy")}">${sortOptions}</select><button class="dirbtn" data-ld="${id}" title="${this.t(desc ? "sortDescending" : "sortAscending")}" aria-label="${this.t(desc ? "sortDescending" : "sortAscending")}"><ha-icon icon="${desc ? "mdi:sort-descending" : "mdi:sort-ascending"}"></ha-icon></button>` : ""}</div>`;
  }

  // Shared paging for long lists: returns the visible slice and the footer markup.
  paginate(id, items) {
    const count = Math.max(1, Math.ceil(items.length / this.pageSize));
    const page = Math.min(Math.max(1, this.pages[id] || 1), count);
    this.pages[id] = page;
    const from = (page - 1) * this.pageSize;
    const rows = items.slice(from, from + this.pageSize);
    if (items.length <= 20) return { rows, footer: "" };
    const sizes = [20, 50, 100].map(n => `<option value="${n}" ${n === this.pageSize ? "selected" : ""}>${n}</option>`).join("");
    const footer = `<div class="tablefoot"><span>${this.formatNumber(from + 1)}–${this.formatNumber(from + rows.length)} ${this.t("of")} ${this.formatNumber(items.length)} · ${this.t("perPage")} <select data-pagesize aria-label="${this.t("perPage")}">${sizes}</select></span>${count > 1 ? `<span class="pager"><button data-lpage="${id}|${page - 1}" ${page === 1 ? "disabled" : ""}>${this.t("previous")}</button> ${this.t("page")} ${page} ${this.t("of")} ${count} <button data-lpage="${id}|${page + 1}" ${page === count ? "disabled" : ""}>${this.t("next")}</button></span>` : ""}</div>`;
    return { rows, footer };
  }
}

// OverviewMixin: methods of the panel element, mixed into the class in 99-register.js.
class OverviewMixin {
  // Hours since the last scan when it is clearly overdue for the configured interval, else null.
  staleScan() {
    const m = this.data?.meta;
    if (!m?.scanned_at) return null;
    const hours = (Date.now() - new Date(m.scanned_at).getTime()) / 3.6e6;
    const interval = Number(m.scan_interval_hours) || 0;
    if (!Number.isFinite(hours)) return null;
    if (interval > 0 ? hours > interval * 1.5 + 1 : hours > 24 * 7) return { hours: Math.round(hours), interval };
    return null;
  }

  // Shown while the backend treats scans as preliminary because Home Assistant is still starting.
  warmupBanner() {
    if (!this.data?.meta?.preliminary) return "";
    return `<div class="panel" style="margin-bottom:14px"><div class="row"><span class="tile warn"><ha-icon icon="mdi:timer-sand"></ha-icon></span><span class="row-text"><strong>${this.esc(this.t("warmupBanner"))}</strong></span></div></div>`;
  }

  // What to do now, most urgent first: broken integrations and new critical findings, then an
  // overdue scan and the backup, then removals that are ready. Rows without data are left out.
  todoItems() {
    const items = [], m = this.data.meta;
    const broken = this.data.objects.filter(o => o.object_type === "config_entry" && o.status === "problem").length;
    if (broken) items.push({ key: "integrations", tone: "red", icon: "mdi:puzzle-remove-outline", label: "actIntegrations", hint: "actIntegrationsHint", count: broken, view: "inventory", type: "config_entry", status: "problem" });
    const fresh = (this.trend?.new_findings?.items || []).filter(f => !f.ignored && CRITICAL_CLASSES.includes(f.classification)).length;
    if (fresh) items.push({ key: "critical", tone: "red", icon: "mdi:alert-circle-outline", label: "actNewCritical", hint: "actNewCriticalHint", count: fresh, view: "findingsNav", filter: "" });
    const stale = this.staleScan();
    if (stale) {
      const age = stale.hours >= 48 ? this.t("daysValue", { n: Math.round(stale.hours / 24) }) : `${stale.hours} h`;
      items.push({ key: "stale", tone: "warn", icon: "mdi:clock-alert-outline", text: stale.interval > 0 ? this.t("staleScan", { age, hours: stale.interval }) : this.t("staleScanManual", { age }), scan: true });
    }
    // Only real problems are listed; notes such as "emergency kit not confirmed" stay on the Maintenance card.
    const problems = this.backup?.available && this.backup.overall === "problem" ? this.backup.checks.filter(c => c.level === "problem") : [];
    if (problems.length) items.push({ key: "backup", tone: "red", icon: "mdi:backup-restore", label: "todoBackupProblem", hintText: problems.map(c => this.t(`bh_${c.id}`)).join(", "), view: "maintenance" });
    const limit = m.quarantine_days ?? 14;
    const ready = (this.data.quarantine || []).filter(q => this.daysSince(q.since) >= limit).length;
    if (ready) items.push({ key: "quarantine", tone: "warn", icon: "mdi:archive-clock-outline", label: "actQuarantine", hint: "actQuarantineHint", count: ready, view: "cleanup" });
    return items;
  }

  todoCard() {
    const items = this.todoItems();
    const row = it => {
      const inner = `<span class="tile ${it.tone}"><ha-icon icon="${it.icon}"></ha-icon></span><span class="row-text"><strong>${this.esc(it.text || this.t(it.label))}</strong>${it.hint || it.hintText ? `<small>${this.esc(it.hintText || this.t(it.hint))}</small>` : ""}</span>`;
      if (it.scan) return `<div class="row todo" data-todo="${it.key}">${inner}<button class="btn" data-action="scan">${this.t("scan")}</button></div>`;
      const target = `data-jump="${it.view}"${it.filter !== undefined ? ` data-filter="${it.filter}"` : ""}${it.type ? ` data-type="${it.type}"` : ""}${it.status ? ` data-status="${it.status}"` : ""}`;
      return `<button class="row todo" data-todo="${it.key}" ${target}>${inner}${it.count !== undefined ? `<span class="pill ${it.tone}">${this.formatNumber(it.count)}</span>` : ""}</button>`;
    };
    const body = items.length ? items.map(row).join("")
      : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.esc(this.t("actNone", { date: this.formatDate(this.data.meta.scanned_at) }))}</div>`;
    return `<section class="panel" style="margin-bottom:14px" aria-labelledby="hk-todo"><div class="panelhead"><div><h2 id="hk-todo">${this.t("actTitle")}</h2><p>${this.t("actSub")}</p></div></div>${body}</section>`;
  }

  // The comparison with the previous scan is fetched once per data set; the overview shows it when it is there.
  ensureTrend() {
    if (this._trendFor === this.data || !this._hass?.callWS) return;
    this._trendFor = this.data;
    this.loadTrend(this.data);
  }

  async loadTrend(data) {
    try {
      const result = await this._hass.callWS({ type: "ha_housekeeper/compare", baseline: "previous" });
      if (this.data !== data) return;
      this.trend = result?.available === true ? result : null;
      if (this.view === "overview" && !this.selected) this.render();
    } catch (_) { if (this.data === data) this.trend = null; }
  }

  trendCard() {
    const c = this.trend;
    if (!c?.available) return "";
    const date = this.formatDate(c.baseline_at);
    const rows = [
      ["trendNewFindings", c.new_findings?.total, "mdi:arrow-up-bold", "red", "+"],
      ["trendResolved", c.resolved_findings?.total, "mdi:arrow-down-bold", "ok", "−"],
      ["trendChanged", c.status_changes?.total, "mdi:swap-horizontal", "warn", ""],
      ["trendNewObjects", c.new_objects?.total, "mdi:plus-circle-outline", "mute", "+"],
    ].filter(([, n]) => n);
    const body = rows.length
      ? rows.map(([label, n, icon, tone, sign]) => `<button class="row" data-jump="changes"><span class="tile ${tone}"><ha-icon icon="${icon}"></ha-icon></span><span class="row-text"><strong>${this.t(label)}</strong></span><span class="pill ${tone}">${sign}${this.formatNumber(n)}</span></button>`).join("")
      : `<div class="emptymsg">${this.esc(this.t("trendNone", { date }))}</div>`;
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("trendTitle")}</h2><p>${this.esc(this.t("trendSince", { date }))}</p></div></div>${body}</div>`;
  }

  overview() {
    const m = this.data.meta, counts = m.status_counts || {}, types = m.type_counts || {}, health = this.health();
    const findings = this.sortedFindings();
    const stats = [
      ["objects", m.object_count, "mdi:shape-outline", "", "inventory"],
      ["openFindings", findings.length, "mdi:alert-outline", findings.length ? "warn" : "ok", "findingsNav"],
      ["unavailable", counts.unavailable || 0, "mdi:lan-disconnect", counts.unavailable ? "red" : "ok", "inventory", "unavailable"],
      ["disabled", counts.disabled || 0, "mdi:cancel", "mute", "inventory", "disabled"],
    ];
    const order = ["active", "unknown", "unavailable", "orphaned", "disabled", "empty", "problem"].filter(s => counts[s]);
    const total = Math.max(1, m.object_count);
    this.ensureTrend();
    this.ensureBackup();
    return `${this.todoCard()}<div class="summary">
      <div class="card" title="${this.esc(this.t("healthTip", { affected: health.affected, base: health.base }))}"><span class="ring ${health.tone}" style="--p:${health.percent}"><b>${health.percent}%</b></span><span class="card-text"><small>${this.t("health")}</small><strong>${this.t(health.label)}</strong><em>${this.t("healthHint")}</em></span></div>
      ${stats.map(([label, value, icon, tone, view, status]) => `<button class="card" data-jump="${view}" data-status="${status || ""}"><span class="tile ${tone}"><ha-icon icon="${icon}"></ha-icon></span><span class="card-text"><small>${this.t(label)}</small><strong>${this.formatNumber(value)}</strong></span></button>`).join("")}</div>
      <div class="grid2"><div class="stack"><div class="panel"><div class="panelhead"><div><h2>${this.t("needsAttention")}</h2><p>${this.t("sortedBySure")}</p></div><button class="link" data-jump="findingsNav">${this.t("allFindings")} (${findings.length}) <ha-icon icon="mdi:chevron-right"></ha-icon></button></div>
      ${findings.length ? findings.slice(0, 8).map(f => this.findingRow(f)).join("") : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("noFindings")}</div>`}</div>${this.integrationProblems()}</div>
      <div class="stack">${this.trendCard()}${this.cleanupCard()}<div class="panel"><div class="panelhead"><h2>${this.t("inventoryStatus")}</h2><span class="date">${this.formatNumber(m.object_count)}</span></div>
      <div class="bar">${order.map(s => `<i class="${this.tone(s)}" style="width:${(100 * counts[s] / total).toFixed(2)}%"></i>`).join("")}</div>
      <div class="legend">${order.map(s => `<div><span><i class="dot ${this.tone(s)}"></i>${this.t(s)}</span><b>${this.formatNumber(counts[s])}</b></div>`).join("")}</div></div>
      <div class="panel"><div class="panelhead"><h2>${this.t("byType")}</h2></div><div class="types">${["entity", "device", "config_entry", "automation", "script", "scene", "dashboard", "area", "floor", "label"].filter(t => types[t]).map(type => `<button class="type" data-type-jump="${type}">${this.tile(type)}<span>${this.t(type)}</span><b>${this.formatNumber(types[type])}</b></button>`).join("")}</div></div></div></div>`;
  }

  // Quick links to the hint views; counts exclude hidden findings.
  cleanupCard() {
    const open = this.data.findings.filter(f => !f.ignored);
    const items = [
      ["batteries", "mdi:battery-alert-variant-outline", "batteries", this.lowBatteries().length, "batteries"],
      ["possible_duplicate", "mdi:content-duplicate", "findingsNav", open.filter(f => f.classification === "possible_duplicate").length, "possible_duplicate"],
      ["unused", "mdi:sleep", "findingsNav", open.filter(f => f.classification === "unused").length, "unused"],
      ["unreferenced", "mdi:link-variant-off", "unreferenced", this.unreferencedRows().length, undefined],
      ["quarantine", "mdi:archive-clock-outline", "cleanup", (this.data.quarantine || []).length, undefined],
    ];
    const rows = items.map(([label, icon, view, count, filter]) => `<button class="row" data-jump="${view}"${filter !== undefined && view === "findingsNav" ? ` data-filter="${filter}"` : ""}><span class="tile ${count ? "warn" : "mute"}"><ha-icon icon="${icon}"></ha-icon></span><span class="row-text"><strong>${this.t(label)}</strong></span><span class="pill ${count ? "warn" : "mute"}">${this.formatNumber(count)}</span></button>`).join("");
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("cleanup")}</h2><p>${this.t("cleanupHint")}</p></div></div>${rows}</div>`;
  }

  integrationProblems() {
    const broken = this.data.objects.filter(o => o.object_type === "config_entry" && o.status === "problem");
    if (!broken.length) return "";
    this.lvState("integrations", "name", "asc");
    const sorts = [{ key: "name", label: "sortName", dir: "asc", get: o => o.name }, { key: "state", label: "sortStatus", dir: "asc", get: o => o.state || "" }];
    const bar = broken.length > 5 ? this.listBar("integrations", { sorts }) : "";
    const shown = broken.length > 5 ? this.refine("integrations", broken, { text: o => [o.name, o.domain, o.state].join(" "), sorts, tie: o => o.object_id }) : broken;
    const pg = this.paginate("integrations", shown);
    const rows = pg.rows.map(o => `<button class="row rel" data-object="${this.esc(this.objectKey(o))}">${this.tile("config_entry", "red")}<span class="row-text"><strong>${this.esc(o.name)}</strong><small>${this.esc(o.domain)} · ${this.t(`cs_${o.state || "not_loaded"}`)}</small></span>${this.pill(o.status)}</button>`).join("");
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("integrationProblems")} (${broken.length})</h2><p>${this.t("integrationProblemsHint")}</p></div></div>${bar}${rows}${pg.footer}</div>`;
  }
}

// FindingsMixin: methods of the panel element, mixed into the class in 99-register.js.
class FindingsMixin {
  sortedFindings(includeIgnored = false) {
    const { plain } = this.collators();
    return this.data.findings.filter(f => includeIgnored || !f.ignored).sort((a, b) => (b.confidence - a.confidence)
      || plain.compare(String(a.object_id), String(b.object_id)));
  }

  // The share of objects without a finding. It counts affected objects, not findings, so an object
  // with several findings is subtracted once; only the base types count, hidden findings do not.
  health() {
    const objects = this.data.objects.filter(o => HEALTH_TYPES.includes(o.object_type));
    const base = objects.length;
    const known = new Set(objects.map(o => this.objectKey(o)));
    const affected = new Set(this.data.findings.filter(f => !f.ignored).map(f => this.findingKey(f)).filter(key => known.has(key)));
    const percent = base ? Math.max(0, Math.round(100 * (1 - affected.size / base))) : 100;
    const tone = percent >= 95 ? "ok" : percent >= 80 ? "warn" : "red";
    const label = tone === "ok" ? "healthGood" : tone === "warn" ? "healthCheck" : "healthBad";
    return { percent, tone, label, affected: affected.size, base };
  }

  findingRow(finding) {
    const key = this.findingKey(finding), object = this.findObject(key);
    const title = object?.name || finding.object_id;
    const subtitle = finding.rule_id === "entity.possible_duplicate"
      ? `${this.t("duplicateOf")} ${this.esc(finding.affected_object)}`
      : finding.affected_object
        ? `${this.esc(finding.affected_object)} · ${this.esc(finding.evidence?.[0]?.location || "")}`
        : this.esc(object?.reason ? this.t(object.reason) : this.findingTitle(finding));
    return `<button class="row ${finding.ignored ? "dim" : ""}" data-object="${this.esc(key)}">${this.tile(object?.object_type || "entity", this.tone(finding.classification))}<span class="row-text"><strong>${this.esc(title)}</strong><small>${subtitle}${finding.ignored ? ` · ${this.t("ignoredLabel")}` : ""}${finding.first_detected_at ? `<span class="msince"> · ${this.t("sortSince")} ${this.formatDate(finding.first_detected_at)}</span>` : ""}</small></span>${this.pill(finding.classification)}<span class="date">${finding.first_detected_at ? this.formatDate(finding.first_detected_at) : ""}</span></button>`;
  }

  findingSorts() {
    return [
      { key: "certainty", label: "sortCertainty", dir: "desc", get: f => f.confidence },
      { key: "name", label: "sortName", dir: "asc", get: f => this.findObject(this.findingKey(f))?.name || f.object_id },
      { key: "id", label: "sortId", dir: "asc", get: f => f.object_id },
      { key: "since", label: "sortSince", dir: "desc", get: f => f.first_detected_at },
      { key: "rule", label: "sortRule", dir: "asc", get: f => f.rule_id },
    ];
  }

  // The findings as shown (classification chip, search, type filter, sort); the export uses the same list.
  visibleFindings() {
    const all = this.sortedFindings(this.showIgnored);
    const byClass = this.findingFilter ? all.filter(f => f.classification === this.findingFilter) : all;
    this.lvState("findings", "certainty", "desc");
    return this.refine("findings", byClass, {
      text: f => [this.findObject(this.findingKey(f))?.name, f.object_id, f.rule_id, f.affected_object].join(" "),
      filters: { type: (f, v) => this.findingType(f) === v },
      sorts: this.findingSorts(), tie: f => f.object_id,
    });
  }

  exportRows() {
    const list = this.visibleFindings();
    return list.map(f => {
      const key = this.findingKey(f), object = this.findObject(key);
      return {
        rule_id: f.rule_id, classification: f.classification, confidence: f.confidence,
        object_id: f.object_id, name: object?.name || "", affected_object: f.affected_object || "",
        first_detected_at: f.first_detected_at || "", location: f.evidence?.[0]?.location || "",
      };
    });
  }

  exportFindings(format) {
    const rows = this.exportRows();
    let body, type;
    if (format === "json") {
      body = JSON.stringify({ scanned_at: this.data.meta.scanned_at, findings: rows }, null, 2);
      type = "application/json";
    } else {
      const cols = Object.keys(rows[0] || { rule_id: 0, classification: 0, confidence: 0, object_id: 0, name: 0, affected_object: 0, first_detected_at: 0, location: 0 });
      // Leading =,+,-,@ would be evaluated as a formula by spreadsheet tools.
      const cell = v => { let t = String(v ?? ""); if (/^[=+\-@\t\r]/.test(t)) t = "'" + t; return `"${t.replace(/"/g, '""')}"`; };
      body = "\ufeff" + [cols.join(","), ...rows.map(r => cols.map(c => cell(r[c])).join(","))].join("\r\n");
      type = "text/csv";
    }
    const url = URL.createObjectURL(new Blob([body], { type: `${type};charset=utf-8` }));
    const a = document.createElement("a");
    a.href = url; a.download = `ha-housekeeper-findings.${format}`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  findingsView() {
    const all = this.sortedFindings(this.showIgnored);
    const ignoredCount = this.data.findings.filter(f => f.ignored).length;
    const classes = [...new Set(all.map(f => f.classification))];
    const list = this.visibleFindings();
    const types = [...new Set(all.map(f => this.findingType(f)))].sort();
    const bar = this.listBar("findings", { sorts: this.findingSorts(), filters: [{ name: "type", all: this.t("allTypes"), options: types.map(x => [x, this.t(x)]) }] });
    const pg = this.paginate("findings", list);
    return `<div class="panel"><div class="chips"><button class="chip ${this.findingFilter ? "" : "active"}" data-finding-filter="">${this.t("all")} (${all.length})</button>${classes.map(c => `<button class="chip ${this.findingFilter === c ? "active" : ""}" data-finding-filter="${this.esc(c)}">${this.t(c)} (${all.filter(f => f.classification === c).length})</button>`).join("")}${ignoredCount ? `<button class="chip ${this.showIgnored ? "active" : ""}" data-toggle-ignored>${this.t("showIgnored")} (${ignoredCount})</button>` : ""}<span class="spacer"></span><button class="chip" data-export="csv" title="${this.t("exportTitle")}">${this.t("exportCsv")}</button><button class="chip" data-export="json" title="${this.t("exportTitle")}">${this.t("exportJson")}</button></div>
      ${bar}${list.length ? pg.rows.map(f => this.findingRow(f)).join("") : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t(all.length ? "noMatches" : "noFindings")}</div>`}${pg.footer}</div>`;
  }

  findingTitle(f) {
    const sub = f.rule_id.split(".")[1] || f.rule_id;
    if (sub.startsWith("missing_")) return `${this.t(sub)}: ${f.affected_object}`;
    if (f.rule_id === "entity.possible_duplicate") return `${this.t("duplicateOf")} ${f.affected_object}`;
    const text = this.t(f.rule_id);
    return text === f.rule_id ? this.t(sub) : text;
  }

  findingsCard(key) {
    const list = this.data.findings.filter(f => this.findingKey(f) === key);
    if (!list.length) return "";
    const rows = list.map(f => `<div class="finding"><div><strong>${this.esc(this.findingTitle(f))}</strong><small>${this.pill(f.classification)} ${this.t("certainty")}: ${Math.round(f.confidence * 100)} %${f.ignored ? ` · ${this.t("ignoredLabel")}` : ""}</small>${f.ignored_by === "label" ? `<small>${this.t("ignoredByLabel")}</small>` : ""}</div>${f.ignored_by === "label" ? "" : `<button class="btn" data-ignore="${this.esc(f.key)}" data-ignore-value="${f.ignored ? 0 : 1}"><ha-icon icon="${f.ignored ? "mdi:eye-outline" : "mdi:eye-off-outline"}"></ha-icon>${this.t(f.ignored ? "showFinding" : "hideFinding")}</button>`}</div>`).join("");
    return `<section class="panel"><div class="panelhead"><h2>${this.t("findingsOfObject")} (${list.length})</h2></div>${rows}</section>`;
  }
}

// ChangesMixin: methods of the panel element, mixed into the class in 99-register.js.
class ChangesMixin {
  async loadCompare() {
    this.compareLoading = true; this.render();
    try {
      this.compare = await this._hass.callWS({ type: "ha_housekeeper/compare", baseline: this.compareBaseline });
    } catch (err) {
      this.compare = null; this.error = err?.message || String(err);
    }
    this.compareLoading = false; this.render();
  }

  // One row per stored scan (newest first) with its totals; a click picks it as the comparison base.
  historyTimeline(c, baselines) {
    if (baselines.length < 2) return "";
    const rows = [{ id: "", at: this.data?.meta?.scanned_at, ...c.current, now: true }, ...baselines];
    const max = Math.max(1, ...rows.map(r => r.findings || 0));
    const body = rows.map((r, i) => {
      const older = rows[i + 1], delta = older ? (r.findings || 0) - (older.findings || 0) : 0;
      const pill = delta ? `<span class="pill ${delta > 0 ? "red" : "ok"}">${delta > 0 ? "+" : ""}${delta}</span>` : "";
      const selected = !r.now && r.id === this.compareBaseline;
      const label = r.now ? this.t("currentScan") : r.id === "previous" ? this.t("previousScan") : this.t("storedScan");
      const inner = `<span class="tile ${selected ? "" : "mute"}"><ha-icon icon="${r.now ? "mdi:clock-check-outline" : "mdi:history"}"></ha-icon></span><span class="row-text"><strong>${label} · ${this.esc(this.formatDate(r.at))}</strong><small>${this.t("historyCounts", { objects: this.formatNumber(r.objects || 0), findings: this.formatNumber(r.findings || 0) })}</small><span class="bar" style="margin-top:4px"><i style="width:${Math.round(((r.findings || 0) / max) * 100)}%"></i></span></span>${pill}`;
      return r.now ? `<div class="row rel">${inner}</div>` : `<button class="row rel ${selected ? "sel" : ""}" data-baseline="${this.esc(r.id)}">${inner}</button>`;
    }).join("");
    return `<section class="panel" style="margin-bottom:14px"><div class="panelhead"><div><h2>${this.t("historyTitle")}</h2><p>${this.t("historyHint", { days: c.retention_days ?? 30 })}</p></div></div>${body}</section>`;
  }

  changeRank(status) { return { active: 0, disabled: 1, empty: 1, unknown: 2, problem: 3, orphaned: 3, unavailable: 3 }[status] ?? 1; }

  changesView() {
    const c = this.compare;
    if (!c) return `<div class="panel loading"><ha-icon icon="mdi:loading"></ha-icon><p>${this.t("loading")}</p></div>`;
    const baselines = c.baselines || [];
    const options = baselines.map(b => `<option value="${this.esc(b.id)}" ${b.id === this.compareBaseline ? "selected" : ""}>${b.id === "previous" ? `${this.t("previousScan")} · ` : ""}${this.esc(this.formatDate(b.at))}</option>`).join("");
    const hint = baselines.length <= 1 ? `<p class="factnote" style="margin:10px 0 0">${this.t("historyBuilding", { days: c.retention_days ?? 30 })}</p>` : "";
    const picker = options ? `<div class="panel" style="margin-bottom:14px"><div class="filters" style="grid-template-columns:auto minmax(220px,360px)"><label style="align-self:center;color:var(--hk-muted);font-size:calc(12px*var(--hk-fs,1))">${this.t("compareWith")}</label><select id="baseline">${options}</select></div>${hint}</div>${this.historyTimeline(c, baselines)}` : "";
    if (!c.available) {
      const meta = this.data?.meta || {};
      const why = meta.preliminary ? this.t("noBaselinePreliminary") : this.t("noBaselineOneScan", { hours: meta.scan_interval_hours || 24 });
      return `${picker}<div class="panel"><div class="emptymsg"><ha-icon icon="mdi:history"></ha-icon>${why}<button class="btn primary" data-scan-point ${this.busy || this.cleanupRunning() ? "disabled" : ""}>${this.t("scanPoint")}</button></div></div>`;
    }
    const sections = [
      ["statusChanges", "mdi:swap-horizontal", c.status_changes], ["newFindings", "mdi:alert-outline", c.new_findings],
      ["resolvedFindings", "mdi:check-circle-outline", c.resolved_findings], ["newObjects", "mdi:plus-circle-outline", c.new_objects],
      ["removedObjects", "mdi:minus-circle-outline", c.removed_objects],
    ];
    const total = sections.reduce((n, [, , part]) => n + part.total, 0);
    const cards = sections.map(([label, icon, part]) => `<div class="card"><span class="tile ${part.total ? (label === "resolvedFindings" ? "ok" : label === "newFindings" ? "warn" : "") : "mute"}"><ha-icon icon="${icon}"></ha-icon></span><div class="card-text"><small>${this.t(label)}</small><strong>${this.formatNumber(part.total)}</strong></div></div>`).join("");
    const more = part => part.total > part.items.length ? `<p class="factnote">${this.t("moreItems", { count: part.total - part.items.length })}</p>` : "";
    const st = this.lvState("changes", "", "asc"), query = st.q.trim().toLowerCase();
    const typeOf = it => it.object_type || String(it.rule_id || "").split(".")[0];
    const matches = it => (!query || [it.name, it.object_id, it.rule_id, it.affected_object, typeOf(it)].join(" ").toLowerCase().includes(query)) && (!st.f.type || typeOf(it) === st.f.type);
    const allTypes = [...new Set(sections.flatMap(([, , part]) => part.items.map(typeOf)).filter(Boolean))].sort();
    const bar = total ? this.listBar("changes", { sorts: [], filters: [{ name: "type", all: this.t("allTypes"), options: allTypes.map(x => [x, this.t(x)]) }] }) : "";
    const paged = (id, items, render) => { const pg = this.paginate(`changes-${id}`, items.filter(matches)); return pg.rows.map(render).join("") + pg.footer; };
    const objectRow = (o, note, pillHtml) => {
      const key = `${o.object_type}:${o.object_id}`, obj = this.findObject(key);
      const inner = `${this.tile(o.object_type, obj ? (this.tone(obj.status) === "ok" ? "" : this.tone(obj.status)) : "mute")}<span class="row-text"><strong>${this.esc(o.name || obj?.name || o.object_id)}</strong><small>${this.esc(note)}</small></span>${pillHtml}`;
      return obj ? `<button class="row rel" data-object="${this.esc(key)}">${inner}</button>` : `<div class="row rel">${inner}</div>`;
    };
    const changes = [...c.status_changes.items].sort((a, b) => (this.changeRank(b.to) - this.changeRank(b.from)) - (this.changeRank(a.to) - this.changeRank(a.from)));
    const body = {
      statusChanges: paged("statusChanges", changes, ch => objectRow(ch, `${this.t(ch.from)} → ${this.t(ch.to)} · ${this.t(ch.object_type)}`, `<span class="pill ${this.changeRank(ch.to) > this.changeRank(ch.from) ? "red" : this.changeRank(ch.to) < this.changeRank(ch.from) ? "ok" : "mute"}">${this.t(this.changeRank(ch.to) > this.changeRank(ch.from) ? "worsened" : this.changeRank(ch.to) < this.changeRank(ch.from) ? "improved" : "changed")}</span>`)),
      newFindings: paged("newFindings", c.new_findings.items, f => this.findingRow(f)),
      resolvedFindings: paged("resolvedFindings", c.resolved_findings.items, f => {
        const type = f.rule_id.split(".")[0];
        return objectRow({ object_type: type, object_id: f.object_id }, `${f.affected_object ? `${f.affected_object} · ` : ""}${f.rule_id}`, `<span class="pill ok">${this.t("improved")}</span>`);
      }),
      newObjects: paged("newObjects", c.new_objects.items, o => objectRow(o, `${this.t(o.object_type)} · ${o.object_id}`, this.pill(o.status))),
      removedObjects: paged("removedObjects", c.removed_objects.items, o => objectRow(o, `${this.t(o.object_type)} · ${this.t("gone")}`, "")),
    };
    const panels = sections.filter(([, , part]) => part.total).map(([label, , part]) => `<section class="panel" style="margin-bottom:14px"><div class="panelhead"><h2>${this.t(label)}</h2><span class="date">${this.formatNumber(part.total)}</span></div>${body[label]}${more(part)}</section>`).join("");
    return `${picker}<p class="sub" style="margin:0 0 14px">${this.t("comparedWith")} <b>${this.formatDate(c.baseline_at)}</b></p><div class="summary changesum">${cards}</div>${total ? `<div class="panel" style="margin-bottom:14px">${bar}</div>${panels}` : `<div class="panel"><div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("noChanges")}</div></div>`}`;
  }
}

// SettingsMixin: methods of the panel element, mixed into the class in 99-register.js.
class SettingsMixin {
  infoText() {
    const m = this.data?.meta || {};
    return [`HA Housekeeper ${m.version || "?"}`, `Home Assistant ${m.ha_version || "?"}`, `${this.t("lastScan")}: ${m.scanned_at || "-"}`,
      `${this.t("objects")}: ${m.object_count ?? "-"}`, `${this.t("findings")}: ${this.data ? this.data.findings.filter(f => !f.ignored).length : "-"}`].join("\n");
  }

  segment(pref, options) {
    return `<div class="seg">${options.map(([value, label, dot]) => `<button class="chip ${String(this.prefs[pref]) === String(value) ? "active" : ""}" data-pref="${pref}|${value}">${dot ? `<span class="swatch" style="background:${dot}"></span>` : ""}${label}</button>`).join("")}</div>`;
  }

  settingsView() {
    const m = this.data?.meta || {}, p = this.prefs;
    const days = n => (n > 0 ? this.t("daysValue", { n }) : this.t("immediately"));
    const fact = (k, v) => `<div class="fact"><span>${k}</span><b>${v}</b></div>`;
    const facts = [
      fact(this.t("version"), this.esc(m.version || "–")), fact(this.t("haVersion"), this.esc(m.ha_version || "–")),
      fact(this.t("mode"), this.t("readOnlyValue")),
      fact(this.t("lastScan"), m.scanned_at ? this.formatDate(m.scanned_at) : "–"),
      fact(this.t("objects"), this.formatNumber(m.object_count ?? 0)),
      fact(this.t("scanInterval"), m.scan_interval_hours > 0 ? this.t("hoursValue", { n: m.scan_interval_hours }) : this.t("offValue")),
      fact(this.t("unavailableAfter"), days(m.min_unavailable_days ?? 0)),
      fact(this.t("unusedAfter"), m.unused_automation_days > 0 ? this.t("daysValue", { n: m.unused_automation_days }) : this.t("offValue")),
      fact(this.t("lowBatteryAt"), `${this.esc(m.low_battery_percent ?? 20)} %`),
    ].join("");
    const links = `<div class="actions" style="padding:14px 16px;display:flex;flex-wrap:wrap;gap:8px">
      <button class="btn" data-ha-path="/config/integrations/integration/ha_housekeeper"><ha-icon icon="mdi:cog-outline"></ha-icon>${this.t("openOptions")}</button>
      <a class="btn" href="${REPO_URL}" target="_blank" rel="noopener noreferrer"><ha-icon icon="mdi:github"></ha-icon>${this.t("repository")}</a>
      <a class="btn" href="${REPO_URL}/issues" target="_blank" rel="noopener noreferrer"><ha-icon icon="mdi:bug-outline"></ha-icon>${this.t("reportIssue")}</a>
      <a class="btn" href="${REPO_URL}/blob/main/CHANGELOG.md" target="_blank" rel="noopener noreferrer"><ha-icon icon="mdi:history"></ha-icon>${this.t("changelog")}</a>
      <button class="btn" data-copy-info><ha-icon icon="mdi:content-copy"></ha-icon>${this.t(this.copied ? "copied" : "copyInfo")}</button></div>`;
    const row = (label, hint, control) => `<div class="setrow"><div>${label}${hint ? `<small>${hint}</small>` : ""}</div>${control}</div>`;
    const select = (key, options) => `<select data-pref-select="${key}">${options.map(([v, l]) => `<option value="${v}" ${String(p[key]) === String(v) ? "selected" : ""}>${l}</option>`).join("")}</select>`;
    const appearance = `<section class="panel"><div class="panelhead"><h2>${this.t("appearance")}</h2></div>
      ${row(this.t("fontSize"), "", this.segment("size", [["small", this.t("fontSmall")], ["normal", this.t("fontNormal")], ["large", this.t("fontLarge")]]))}
      ${row(this.t("colorMode"), this.t("modeHint"), this.segment("mode", [["auto", this.t("modeAuto")], ["light", this.t("modeLight")], ["dark", this.t("modeDark")]]))}
      ${row(this.t("density"), "", this.segment("density", [["normal", this.t("densityNormal")], ["compact", this.t("densityCompact")]]))}
      ${row(this.t("motion"), this.t("motionHint"), this.segment("motion", [["auto", this.t("motionAuto")], ["reduced", this.t("motionReduced")]]))}
      ${row(this.t("colorScheme"), "", this.segment("scheme", [["standard", this.t("schemeStandard"), "#0789cf"], ["housekeeper", this.t("schemeHousekeeper"), SCHEMES.housekeeper.light.accent], ["modern", this.t("schemeModern"), SCHEMES.modern.light.accent]]))}</section>`;
    const behavior = `<section class="panel"><div class="panelhead"><h2>${this.t("behavior")}</h2></div>
      ${row(this.t("startView"), "", select("startView", START_VIEWS.map(v => [v, this.t(v)])))}
      ${row(this.t("pageSizeSetting"), "", select("pageSize", [20, 50, 100].map(n => [n, n])))}
      <div class="setrow"><small style="margin:0">${this.t("prefsNote")}</small><button class="btn" data-pref-reset>${this.t("resetPrefs")}</button></div></section>`;
    const optionRow = (key, label) => {
      const [min, max] = OPTION_LIMITS[key];
      return row(label, "", `<input type="number" data-opt="${key}" min="${min}" max="${max}" step="1" value="${this.esc(m[key] ?? "")}" style="max-width:160px">`);
    };
    const optionsCard = this.data ? `<section class="panel"><div class="panelhead"><div><h2>${this.t("scanSettings")}</h2><p>${this.t("scanSettingsHint")}</p></div></div>
      ${optionRow("min_unavailable_days", this.t("optMinUnavailable"))}${optionRow("unused_automation_days", this.t("optUnusedAutomation"))}${optionRow("scan_interval_hours", this.t("optScanInterval"))}${optionRow("low_battery_percent", this.t("optLowBattery"))}${optionRow("history_days", this.t("optHistoryDays"))}
      <div class="setrow"><small style="margin:0">${this.esc(this.optionsMessage || "")}</small><button class="btn primary" data-opts-save>${this.t("saveOptions")}</button></div></section>` : "";
    const hidden = (this.data?.findings || []).filter(f => f.ignored);
    const pg = this.paginate("hidden", hidden);
    const hiddenRow = f => {
      const object = this.findObject(this.findingKey(f));
      const action = f.ignored_by === "label" ? `<span class="pill mute">${this.t("ignoredByLabel")}</span>` : `<button class="btn" data-ignore="${this.esc(f.key)}" data-ignore-value="0">${this.t("showFinding")}</button>`;
      return `<div class="row"><span class="tile mute"><ha-icon icon="mdi:eye-off-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(object?.name || f.object_id)}</strong><small>${this.esc(f.object_id)} · ${this.esc(this.findingTitle(f))}</small></span>${action}</div>`;
    };
    const hiddenCard = `<section class="panel"><div class="panelhead"><div><h2>${this.t("hiddenFindings")} (${hidden.length})</h2><p>${this.t("hiddenHint")}</p></div></div>${hidden.length ? pg.rows.map(hiddenRow).join("") : `<div class="emptymsg"><ha-icon icon="mdi:eye-check-outline"></ha-icon>${this.t("hiddenNone")}</div>`}${pg.footer}</section>`;
    return `<div class="grid2"><div class="stack">${appearance}${behavior}${optionsCard}${hiddenCard}</div><div class="stack"><section class="panel"><div class="panelhead"><h2>${this.t("about")}</h2></div><div class="facts">${facts}</div>${links}</section></div></div>`;
  }

  async saveOptions() {
    const changes = {};
    for (const input of this.shadowRoot.querySelectorAll("[data-opt]")) {
      const [min, max] = OPTION_LIMITS[input.dataset.opt], value = Number(input.value);
      if (input.value === "" || !Number.isInteger(value) || value < min || value > max) { this.optionsMessage = this.t("optionsInvalid"); this.render(); return; }
      changes[input.dataset.opt] = value;
    }
    try {
      await this._hass.callWS({ type: "ha_housekeeper/set_options", ...changes });
      this.optionsMessage = this.t("optionsSaved");
      this.data = null; // the integration reloads; fetch again once it is back
      this.render();
      setTimeout(() => { this.optionsMessage = ""; this.busy = false; this.load(false); }, 4000);
    } catch (err) { this.optionsMessage = err?.message || String(err); this.render(); }
  }
}

// CleanupMixin: methods of the panel element, mixed into the class in 99-register.js.
class CleanupMixin {
  // Days since an ISO timestamp, never negative.
  daysSince(value) {
    const ms = Date.now() - new Date(value).getTime();
    return Number.isFinite(ms) ? Math.max(0, Math.floor(ms / 864e5)) : 0;
  }

  quarantineOf(objectId) { return (this.data?.quarantine || []).find(q => q.object_id === objectId) || null; }

  // Takes one disabled object out of quarantine again: the journal's undo for just that object, after a question.
  releaseControl(q) {
    const key = `${q.object_type || "entity"}:${q.object_id}`;
    if (this.releaseConfirm === key) {
      return `<span class="qconfirm" role="group" aria-label="${this.esc(this.t("releaseQuestion"))}"><span>${this.t("releaseQuestion")}</span><button class="btn" data-release-yes="${this.esc(key)}">${this.t("yes")}</button><button class="btn" data-release-no>${this.t("cancelRun")}</button></span>`;
    }
    return `<button class="btn" data-release="${this.esc(key)}" ${this.cleanupRunning() ? "disabled" : ""}>${this.t("releaseAction")}</button>`;
  }

  async releaseQuarantine(key) {
    const q = (this.data?.quarantine || []).find(e => `${e.object_type || "entity"}:${e.object_id}` === key);
    this.releaseConfirm = null;
    if (!q) return this.render();
    try {
      const res = await this._hass.callWS({ type: "ha_housekeeper/plan_undo", plan_id: q.plan_id, object_ids: [q.object_id] });
      this.releaseMessage = res.results.length
        ? res.results.map(r => `${q.object_id}: ${this.t(`undo_${r.outcome}`)}`).join(" · ")
        : `${q.object_id}: ${this.t("releaseNothing")}`;
      this.journal = null;
      if (this.data) await this.load(false);
    } catch (err) { this.releaseMessage = this.errText(err); }
    this.render();
  }

  quarantineCard() {
    const entries = this.data.quarantine || [];
    if (!entries.length) return "";
    const limit = this.data.meta.quarantine_days ?? 14;
    const rows = entries.map(q => {
      const type = q.object_type || "entity", item = this.findObject(`${type}:${q.object_id}`), days = this.daysSince(q.since), left = limit - days;
      return `<div class="row qrow"><span class="tile mute"><ha-icon icon="${type === "device" ? "mdi:devices" : "mdi:archive-clock-outline"}"></ha-icon></span><span class="row-text"><strong><button class="linklike" data-object="${this.esc(`${type}:${q.object_id}`)}">${this.esc(item?.name || q.object_id)}</button></strong><small>${this.esc(type === "device" ? [item?.manufacturer, item?.model].filter(Boolean).join(" ") || q.object_id : q.object_id)} · ${this.t("quarantineSince", { date: this.formatDate(q.since), days })}</small></span><span class="pill ${left > 0 ? "mute" : "ok"}">${left > 0 ? this.t("quarantineWait", { days: left }) : this.t("quarantineReady")}</span>${this.releaseControl(q)}</div>`;
    }).join("");
    const message = this.releaseMessage ? `<p class="factnote" role="status">${this.esc(this.releaseMessage)}</p>` : "";
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("quarantine")} (${entries.length})</h2><p>${this.t("quarantineHint", { days: limit })}</p></div></div>${rows}${message}</div>`;
  }

  // Devices without a working entity: nothing there to lose by quarantining them.
  deviceCandidates() {
    const members = new Map();
    for (const o of this.data.objects) if (o.object_type === "entity" && o.device_id) (members.get(o.device_id) || members.set(o.device_id, []).get(o.device_id)).push(o);
    return this.data.objects.filter(o => o.object_type === "device" && o.status !== "disabled" && (members.get(o.object_id) || []).every(e => ["orphaned", "unavailable", "unknown", "disabled"].includes(e.status)))
      .map(item => ({ item, finding: null, quarantine: null, count: (members.get(item.object_id) || []).length }));
  }

  quarantineRows(type) {
    return (this.data.quarantine || []).filter(q => (q.object_type || "entity") === type).map(q => ({ item: this.findObject(`${type}:${q.object_id}`), finding: null, quarantine: q })).filter(r => r.item);
  }

  cleanupCandidates() {
    const kind = this.cleanupKind;
    if (kind === "remove_entity") return this.quarantineRows("entity");
    if (kind === "remove_device" || kind === "forget_device") return this.quarantineRows("device");
    if (kind === "disable_device") return this.deviceCandidates();
    const seen = new Set(), rows = [];
    for (const f of this.data.findings) {
      if (f.ignored || !f.rule_id.startsWith("entity.") || !["orphaned", "unavailable"].includes(f.classification) || seen.has(f.object_id)) continue;
      const item = this.findObject(`entity:${f.object_id}`);
      if (!item) continue;
      seen.add(f.object_id);
      rows.push({ item, finding: f });
    }
    return rows;
  }

  // The word that has to be typed before a plan runs: the strongest action in it decides.
  planWord(plan) {
    const executable = (plan?.actions || []).filter(a => a.executable);
    if (executable.some(a => REMOVAL_KINDS.includes(a.kind))) return this.t("confirmWordRemove");
    if (executable.some(a => a.kind === "migrate_meter")) return this.t("confirmWordMeter");
    if (executable.some(a => a.kind === "replace_references")) return this.t("confirmWordReplace");
    return this.t("confirmWord");
  }

  confirmSummary(plan, count) {
    const executable = plan.actions.filter(a => a.executable);
    const devices = executable.some(a => DEVICE_KINDS.includes(a.kind));
    const key = executable.some(a => REMOVAL_KINDS.includes(a.kind)) ? (devices ? "confirmedSummaryDeviceRemove" : "confirmedSummaryRemove")
      : executable.some(a => a.kind === "migrate_meter") ? "confirmedSummaryMeter"
      : executable.some(a => a.kind === "replace_references") ? "confirmedSummaryReplace" : devices ? "confirmedSummaryDeviceDisable" : "confirmedSummary";
    const changes = executable.filter(a => a.kind === "replace_references").flatMap(a => a.sources || []).reduce((n, src) => n + (src.change_count || 0), 0);
    return this.t(key, { count: key === "confirmedSummaryReplace" ? changes : count });
  }

  // What a replacement will touch: every source with its change count, or why it stays manual.
  sourceList(action) {
    if (!(action.sources || []).length) return `<small>${this.t("replaceNoSources")}</small>`;
    const rows = action.sources.map(src => {
      const state = src.writable ? this.t("replaceChanges", { count: src.change_count }) : this.t(`source_${src.reason}`);
      const manual = src.manual?.length ? ` · ${this.t("replaceManual", { count: src.manual.length })}` : "";
      const diff = (src.changes || []).slice(0, 5).map(c => `<small style="display:block;opacity:.8">${this.esc(c.location)}: ${this.esc(c.from)} → ${this.esc(c.to)}</small>`).join("");
      return `<span style="display:block;padding:4px 0"><small><ha-icon icon="${src.writable ? "mdi:file-edit-outline" : "mdi:file-lock-outline"}" style="--mdc-icon-size:14px"></ha-icon> <b>${this.esc(src.name)}</b> (${this.esc(this.t(src.type))}) · ${this.esc(state)}${this.esc(manual)}</small>${src.undo_per_item ? `<small style="display:block;color:var(--hk-amber)"><ha-icon icon="mdi:alert-outline" style="--mdc-icon-size:14px"></ha-icon> ${this.esc(this.t("sourceUndoPerItem"))}</small>` : ""}${diff}</span>`;
    }).join("");
    return `<span style="display:block;padding:6px 0 0"><small>${this.t("replaceSources")}:</small>${rows}</span>`;
  }

  // What a meter change will do: copied hours, the shift of the total, the ID move, and the transition.
  meterDetail(action) {
    const s = action.statistics || {}, lines = [];
    const day = ts => this.formatDate(ts * 1000);
    if (action.mode !== "id" && s.import_count) {
      lines.push(this.t("meterCopy", { count: s.import_count, from: day(s.old_first), to: day(s.old_last) }));
      if (s.switch) lines.push(this.t("meterSwitch", { date: day(s.switch) }));
      if (s.offset !== null && s.offset !== undefined) lines.push(this.t("meterOffset", { offset: this.formatNumber(Math.round(s.offset * 1000) / 1000), unit: s.unit || "" }));
      if (s.dropped_overlap) lines.push(this.t("meterOverlap", { count: s.dropped_overlap }));
      if (s.gap_hours > 0) lines.push(this.t("meterGap", { hours: s.gap_hours }));
    }
    if (action.mode !== "statistics" && action.alt_id) lines.push(this.t("meterIdMove", { old: action.object_id, alt: action.alt_id, new: action.target }));
    const before = (s.preview?.before || []), after = (s.preview?.after || []);
    const cell = row => `${this.esc(day(row.start))}: ${this.esc(this.formatNumber(Math.round((row.sum_after ?? row.sum ?? 0) * 1000) / 1000))}`;
    const rows = before.length || after.length ? `<small style="display:block;opacity:.8">${this.t("meterPreviewRows")}: ${[...before, ...after].map(cell).join(" · ")}</small>` : "";
    const kept = action.result?.statistics_kept ? `<small style="display:block">${this.t("meterStatsKept")}</small>` : "";
    return `<span style="display:block;padding:6px 0 0">${lines.map(l => `<small style="display:block">${this.esc(l)}</small>`).join("")}${rows}${kept}</span>`;
  }

  async loadJournal() {
    try { this.journal = (await this._hass.callWS({ type: "ha_housekeeper/plan_list" })).plans || []; } catch (_) { this.journal = []; }
    this.render();
  }

  // The journal list holds short entries only; the plan itself is fetched when it is opened.
  async openPlan(planId) {
    try { this.plan = await this._hass.callWS({ type: "ha_housekeeper/plan_detail", plan_id: planId }); this.cleanupError = ""; } catch (err) { this.cleanupError = this.errText(err); }
    this.render();
  }

  async createPlan() {
    const pair = this.cleanupKind === "replace_references" ? [this.replOld, this.replNew] : this.cleanupKind === "migrate_meter" ? [this.meterOld, this.meterNew] : null;
    if (pair ? !(pair[0] && pair[1]) : !this.cleanupSel.size) return;
    this.cleanupBusy = true; this.cleanupError = ""; this.render();
    try {
      const actions = this.cleanupKind === "replace_references" ? [{ kind: "replace_references", object_id: this.replOld, target: this.replNew }]
        : this.cleanupKind === "migrate_meter" ? [{ kind: "migrate_meter", object_id: this.meterOld, target: this.meterNew, mode: this.meterMode }]
        : [...this.cleanupSel].map(object_id => ({ kind: this.cleanupKind, object_id }));
      const plan = await this._hass.callWS({ type: "ha_housekeeper/plan_create", actions });
      this.plan = plan; this.confirmation = null; this.ack = new Set(); this.confirmWord = "";
      this.journal = [plan, ...(this.journal || [])];
    } catch (err) { this.cleanupError = err?.message || String(err); }
    this.cleanupBusy = false; this.render();
  }

  errText(err) {
    const key = `err_${err?.code}`;
    return TEXT[this.lang][key] ? this.t(key) : (err?.message || String(err));
  }

  async confirmPlan() {
    try {
      this.confirmation = await this._hass.callWS({ type: "ha_housekeeper/plan_confirm", plan_id: this.plan.plan_id, acknowledged: [...this.ack] });
      this.confirmWord = ""; this.cleanupError = "";
    } catch (err) { this.cleanupError = this.errText(err); }
    this.render();
  }

  async executePlan() {
    const { plan_id, token } = this.confirmation;
    try {
      await this._hass.callWS({ type: "ha_housekeeper/plan_execute", plan_id, token });
      this.confirmation = null; this.cleanupError = "";
      this.pollPlan(plan_id);
    } catch (err) { this.cleanupError = this.errText(err); this.confirmation = null; }
    this.render();
  }

  async cancelPlan() { try { await this._hass.callWS({ type: "ha_housekeeper/plan_cancel" }); } catch (_) { /* nothing running */ } }

  // Follow a running plan until it stops; the plan object is replaced everywhere it is shown.
  async pollPlan(planId) {
    this._polling = planId;
    while (this._polling === planId) {
      try {
        const res = await this._hass.callWS({ type: "ha_housekeeper/plan_status", plan_id: planId });
        this.adoptPlan(res.plan); this.planProgress = res.progress; this.render();
        if (!res.progress.running && res.plan.status !== "running") break;
      } catch (_) { break; }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    this._polling = null; this.planProgress = null;
    if (this.data) this.load(false);
    this.render();
  }

  // True while a plan is executed: the backend refuses scans then, so the button is disabled.
  cleanupRunning() { return ["backup", "running"].includes(this.plan?.status); }

  adoptPlan(plan) {
    if (this.plan?.plan_id === plan.plan_id) this.plan = plan;
    this.journal = (this.journal || []).map(p => (p.plan_id === plan.plan_id ? plan : p));
  }

  async undoPlan(objectIds) {
    try {
      const res = await this._hass.callWS({ type: "ha_housekeeper/plan_undo", plan_id: this.plan.plan_id, ...(objectIds ? { object_ids: objectIds } : {}) });
      const kindOf = id => this.plan?.actions.find(a => a.object_id === id)?.kind;
      this.undoMessage = res.results.map(r => `${r.object_id}: ${this.t(r.outcome === "undone" && REMOVAL_KINDS.includes(kindOf(r.object_id)) ? "undo_restored" : `undo_${r.outcome}`)}`).join(" · ");
      const status = await this._hass.callWS({ type: "ha_housekeeper/plan_status", plan_id: this.plan.plan_id });
      this.adoptPlan(status.plan);
      if (this.data) this.load(false);
    } catch (err) { this.cleanupError = this.errText(err); }
    this.render();
  }

  async deletePlan(id) {
    try { await this._hass.callWS({ type: "ha_housekeeper/plan_delete", plan_id: id }); } catch (_) { /* already gone */ }
    this.journal = (this.journal || []).filter(p => p.plan_id !== id);
    if (this.plan?.plan_id === id) this.plan = null;
    this.render();
  }

  // The stages of a plan in the order the backend runs them: the typed confirmation comes first, the backup
  // is made when the run starts. Each step is "done", "current", "todo", "skipped" or "failed".
  planSteps(plan, confirming) {
    const status = plan.status, open = status === "dry_run";
    const executable = plan.actions.filter(a => a.executable);
    const needsBackup = executable.some(a => BACKUP_KINDS.includes(a.kind));
    const backupFailure = plan.actions.map(a => a.result?.reason).find(r => BACKUP_FAILURES.includes(r));
    const steps = [{ id: "stepSelect", state: "done" }];
    steps.push(open && !confirming ? (executable.length ? { id: "stepAnalysis", state: "current" } : { id: "stepAnalysis", state: "failed", note: this.t("stepAnalysisBlocked") }) : { id: "stepAnalysis", state: "done" });
    steps.push({ id: "stepConfirm", state: open ? (confirming ? "current" : "todo") : "done" });
    if (!needsBackup) steps.push({ id: "stepBackup", state: "skipped", note: this.t("stepBackupSkipped") });
    else if (backupFailure) steps.push({ id: "stepBackup", state: "failed", note: this.t(`abort_${backupFailure}`) });
    else if (status === "backup") steps.push({ id: "stepBackup", state: "current", note: this.t("backupRunning") });
    else if (open) steps.push({ id: "stepBackup", state: "todo" });
    else {
      const job = plan.backup?.job_id ? this.t("stepBackupJob", { id: plan.backup.job_id }) : "";
      steps.push({ id: "stepBackup", state: "done", note: plan.backup?.at ? this.t("stepBackupDone", { date: this.formatDate(plan.backup.at), job }) : null });
    }
    const ranStates = ["executed", "verified", "undone", "partially_undone"];
    steps.push(status === "running" ? { id: "stepRun", state: "current" }
      : ranStates.includes(status) ? { id: "stepRun", state: "done" }
      : status === "partial" ? { id: "stepRun", state: "failed", note: this.t("stepRunPartial") }
      : status === "aborted" && !backupFailure ? { id: "stepRun", state: "failed" } : { id: "stepRun", state: "todo" });
    const verification = plan.verification;
    steps.push(verification ? (verification.ok ? { id: "stepVerify", state: "done" } : { id: "stepVerify", state: "failed", note: this.t("stepVerifyFailed") })
      : status === "executed" ? { id: "stepVerify", state: "current" } : { id: "stepVerify", state: "todo" });
    return steps;
  }

  planStepper(plan, confirming) {
    const mark = { done: "✓", failed: "!", skipped: "–" };
    const items = this.planSteps(plan, confirming).map((step, i) => `<li class="step ${step.state}"${step.state === "current" ? ' aria-current="step"' : ""}><span class="mark" aria-hidden="true">${mark[step.state] || i + 1}</span><span class="steptext"><b>${this.t(step.id)}</b><span class="sr-only">: ${this.t(`step${{ done: "Done", current: "Current", todo: "Todo", skipped: "Skipped", failed: "Failed" }[step.state]}`)}</span>${step.note ? `<small>${this.esc(step.note)}</small>` : ""}</span></li>`).join("");
    const backup = plan.backup ? `<p class="factnote">${this.t("backupRestoreHint")}</p>` : "";
    return `<ol class="steps" aria-label="${this.esc(this.t("stepsLabel"))}">${items}</ol>${backup}`;
  }

  // Housekeeper can take every action back except merged statistics, which only a backup restores.
  undoBadge(action) {
    const backupOnly = action.kind === "migrate_meter";
    return `<span class="pill ${backupOnly ? "warn" : "mute"}"><ha-icon icon="${backupOnly ? "mdi:backup-restore" : "mdi:undo-variant"}" style="--mdc-icon-size:14px"></ha-icon>${this.t(backupOnly ? "undoBackupOnly" : "undoHousekeeper")}</span>`;
  }

  planCard(plan) {
    const sm = plan.summary || {};
    const open = plan.status === "dry_run";
    const rows = plan.actions.map(a => {
      const tone = { ok: "ok", review: "warn", blocked: "red" }[a.verdict] || "mute";
      const uses = (a.used_by || []).slice(0, 4).map(u => {
        const obj = this.findObject(u.source);
        return `<button class="chip" data-object="${this.esc(u.source)}">${this.esc(obj?.name || u.source.split(":").slice(1).join(":"))}</button>`;
      }).join("");
      const more = (a.used_by || []).length > 4 ? `<small>+${a.used_by.length - 4}</small>` : "";
      const reasons = (a.reasons || []).map(r => (r === "quarantine_too_short" && a.quarantine_days_left ? `${this.t("reason_quarantine_too_short")} (${this.t("daysLeftShort", { days: a.quarantine_days_left })})` : this.t(`reason_${r}`))).join(" ");
      const type = a.object_type || "entity", obj = this.findObject(`${type}:${a.object_id}`);
      const result = a.result;
      const resultPill = result ? `<span class="pill ${result.state === "done" ? "ok" : result.state === "undone" ? "mute" : "warn"}">${this.t(result.state === "done" && REMOVAL_KINDS.includes(a.kind) ? "result_removed" : result.state === "done" && a.kind === "replace_references" ? "result_replaced" : result.state === "done" && a.kind === "migrate_meter" ? "result_migrated" : `result_${result.state}`)}</span>` : "";
      const sub = a.kind === "replace_references" || a.kind === "migrate_meter" ? `${a.object_id} → ${a.target || "?"}` : type === "device" ? `${this.t("deviceEntities", { count: (a.entities || []).length })}` : a.object_id;
      const sources = a.kind === "replace_references" ? this.sourceList(a) : a.kind === "migrate_meter" ? this.meterDetail(a) : "";
      const abort = result?.state === "not_run" ? ` · ${this.t(`abort_${result.reason}`)}` : "";
      const ack = open && a.verdict === "review" && a.executable ? `<label class="factnote" style="padding:6px 0 0;display:flex;gap:6px;align-items:center"><input type="checkbox" data-ack="${this.esc(a.object_id)}" ${this.ack.has(a.object_id) ? "checked" : ""}>${this.t("acknowledgeReview")}</label>` : "";
      const undo = result?.state === "done" ? `<button class="btn" data-undo-one="${this.esc(a.object_id)}">${this.t("undoOne")}</button>` : "";
      return `<div class="row planrow ${a.verdict === "blocked" ? "dim" : ""}"><span class="tile ${tone}"><ha-icon icon="${a.verdict === "ok" ? "mdi:check" : a.verdict === "review" ? "mdi:alert-outline" : "mdi:close-octagon-outline"}"></ha-icon></span>
        <span class="row-text"><strong>${obj ? `<button class="link" data-object="${this.esc(`${type}:${a.object_id}`)}">${this.esc(a.name)}</button>` : this.esc(a.name)}</strong><small>${this.esc(sub)}${reasons ? ` · ${this.esc(reasons)}` : ""}${this.esc(abort)}</small>${ack}${sources || uses ? `<details class="rowdetails"><summary>${this.t("planDetails")}</summary>${sources}${uses ? `<span class="chips" style="padding:6px 0 0;border:0">${uses}${more}</span>` : ""}</details>` : ""}</span>
        <span style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end">${resultPill}${undo}${a.executable ? this.undoBadge(a) : ""}<span class="pill ${tone}">${this.t(`verdict_${a.verdict}`)}</span></span></div>`;
    }).join("");
    const extra = [sm.uses ? this.t("planUses", { count: sm.uses }) : "", sm.statistics ? this.t("planStats", { count: sm.statistics }) : ""].filter(Boolean).join(" · ");
    const executable = plan.actions.some(a => a.executable);
    const word = this.planWord(plan), conf = this.confirmation?.plan_id === plan.plan_id ? this.confirmation : null;
    let control = "";
    if (open && !executable) control = `<p class="factnote">${this.t("nothingExecutable")}</p>`;
    else if (open && !conf) control = `<div class="setrow"><small style="margin:0">${this.t("cleanupDryRun")}</small><button class="btn primary" data-plan-confirm>${this.t("confirmPlan")}</button></div>`;
    else if (open && conf) control = `<div class="setrow"><div><strong>${this.t("confirmPlanTitle")}</strong><small>${this.confirmSummary(plan, conf.execute.length)}</small>${conf.needs_acknowledgement.length ? `<small>${this.t("skippedUnacknowledged", { count: conf.needs_acknowledgement.length })}</small>` : ""}</div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><label class="factnote" style="margin:0">${this.t("confirmTypeWord", { word })}</label><input type="text" data-confirm-word value="${this.esc(this.confirmWord)}" style="max-width:180px" autocomplete="off"><button class="btn primary" data-plan-execute ${this.confirmWord.trim().toUpperCase() === word ? "" : "disabled"}>${this.t("runNow")}</button></div></div>`;
    else if (plan.status === "running" || plan.status === "backup") control = `<div class="setrow"><small style="margin:0">${plan.status === "backup" || this.planProgress?.phase === "backup" ? this.t("backupRunning") : `${this.t("running")} ${this.planProgress ? this.t("progressOf", { done: this.planProgress.done, total: this.planProgress.total }) : ""}`}</small><button class="btn" data-plan-cancel>${this.t("cancelRun")}</button></div>`;
    else if (plan.actions.some(a => a.result?.state === "done")) control = `<div class="setrow"><small style="margin:0">${this.esc(this.undoMessage || "")}</small><button class="btn" data-undo-all>${this.t("undoAll")}</button></div>`;
    const checks = plan.verification ? `<p class="factnote"><b>${this.t("verification")}:</b> ${plan.verification.checks.map(c => `${c.ok ? "✓" : "✗"} ${this.t(`check_${c.check}`)}${c.object_id ? ` (${this.esc(c.object_id)})` : ""}`).join(" · ")}</p>` : "";
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("planResult")} · <span class="pill ${plan.status === "verified" ? "ok" : plan.status === "dry_run" ? "mute" : "warn"}">${this.t(`plan_status_${plan.status}`)}</span></h2><p>${this.esc(this.formatDate(plan.created_at))}</p></div><button class="btn" data-plan-close>${this.t("planClose")}</button></div>
      ${this.planStepper(plan, Boolean(conf))}<p class="factnote">${this.t("planSummary", { total: sm.total ?? 0, ok: sm.ok ?? 0, review: sm.review ?? 0, blocked: sm.blocked ?? 0 })}${extra ? ` ${this.esc(extra)}` : ""}</p>${rows}${checks}${control}</section>`;
  }

  kindSelect() {
    const kinds = [["disable_entity", "kindDisable"], ["remove_entity", "kindRemove"], ["disable_device", "kindDisableDevice"], ["remove_device", "kindRemoveDevice"], ["forget_device", "kindForgetDevice"], ["replace_references", "kindReplace"], ["migrate_meter", "kindMeter"]];
    return `<select data-cleanup-kind aria-label="${this.t("actionKind")}">${kinds.map(([value, label]) => `<option value="${value}" ${this.cleanupKind === value ? "selected" : ""}>${this.t(label)}</option>`).join("")}</select>`;
  }

  // Replace one entity by another in every configuration that names it exactly.
  replaceCard() {
    const usage = new Set([...this.edgeIndex().used].filter(target => target.startsWith("entity:")).map(target => target.slice(7)));
    const entities = new Map(this.data.objects.filter(o => o.object_type === "entity").map(o => [o.object_id, o]));
    const label = id => `${entities.get(id)?.name || id}`;
    const oldOptions = [...usage].sort().map(id => `<option value="${this.esc(id)}">${this.esc(label(id))}</option>`).join("");
    const domain = (this.replOld || "").split(".")[0];
    const newOptions = [...entities.values()].filter(o => o.status === "active" && (!domain || o.object_id.startsWith(`${domain}.`)) && o.object_id !== this.replOld).sort((a, b) => a.object_id.localeCompare(b.object_id)).slice(0, 2000)
      .map(o => `<option value="${this.esc(o.object_id)}">${this.esc(o.name)}</option>`).join("");
    const ready = this.replOld && this.replNew && !this.cleanupBusy;
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("replaceTitle")}</h2><p>${this.t("replaceHint")}</p></div><div class="actions">${this.kindSelect()}</div></div>
      <div class="setrow"><div><label>${this.t("replaceOld")}</label></div><input type="text" list="hk-repl-old" data-repl-old value="${this.esc(this.replOld || "")}" placeholder="sensor.old_entity" autocomplete="off" style="max-width:360px"><datalist id="hk-repl-old">${oldOptions}</datalist></div>
      <div class="setrow"><div><label>${this.t("replaceNew")}</label></div><input type="text" list="hk-repl-new" data-repl-new value="${this.esc(this.replNew || "")}" placeholder="sensor.new_entity" autocomplete="off" style="max-width:360px"><datalist id="hk-repl-new">${newOptions}</datalist></div>
      <div class="setrow"><small style="margin:0">${this.t("cleanupDryRun")}</small><button class="btn primary" data-plan-create ${ready ? "" : "disabled"}>${this.cleanupBusy ? this.t("planCreating") : this.t("replacePreview")}</button></div></div>`;
  }

  // Join a replaced meter's history to its successor and/or let the successor take over the ID.
  meterCard() {
    const entities = this.data.objects.filter(o => o.object_type === "entity");
    const byId = new Map(entities.map(o => [o.object_id, o]));
    const oldOptions = entities.filter(o => o.has_statistics && o.object_id.startsWith("sensor.")).sort((a, b) => a.object_id.localeCompare(b.object_id)).slice(0, 2000)
      .map(o => `<option value="${this.esc(o.object_id)}">${this.esc(o.name)}</option>`).join("");
    const domain = (this.meterOld || "").split(".")[0], unit = byId.get(this.meterOld)?.unit;
    const newOptions = entities.filter(o => o.status === "active" && (!domain || o.object_id.startsWith(`${domain}.`)) && o.object_id !== this.meterOld && (!unit || o.unit === unit)).sort((a, b) => a.object_id.localeCompare(b.object_id)).slice(0, 2000)
      .map(o => `<option value="${this.esc(o.object_id)}">${this.esc(o.name)}</option>`).join("");
    const modes = [["both", "meterModeBoth"], ["statistics", "meterModeStatistics"], ["id", "meterModeId"]];
    const ready = this.meterOld && this.meterNew && !this.cleanupBusy;
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("meterTitle")}</h2><p>${this.t("meterHint")}</p></div><div class="actions">${this.kindSelect()}</div></div>
      <div class="setrow"><div><label>${this.t("meterOld")}</label></div><input type="text" list="hk-meter-old" data-meter-old value="${this.esc(this.meterOld || "")}" placeholder="sensor.old_meter" autocomplete="off" style="max-width:360px"><datalist id="hk-meter-old">${oldOptions}</datalist></div>
      <div class="setrow"><div><label>${this.t("meterNew")}</label></div><input type="text" list="hk-meter-new" data-meter-new value="${this.esc(this.meterNew || "")}" placeholder="sensor.new_meter" autocomplete="off" style="max-width:360px"><datalist id="hk-meter-new">${newOptions}</datalist></div>
      <div class="setrow"><div><label>${this.t("meterMode")}</label></div><select data-meter-mode style="max-width:460px">${modes.map(([value, label]) => `<option value="${value}" ${this.meterMode === value ? "selected" : ""}>${this.t(label)}</option>`).join("")}</select></div>
      <div class="setrow"><small style="margin:0">${this.t("cleanupDryRun")}</small><button class="btn primary" data-plan-create ${ready ? "" : "disabled"}>${this.cleanupBusy ? this.t("planCreating") : this.t("replacePreview")}</button></div></div>`;
  }

  // Devices that an integration created again after they were forgotten.
  recurringCard() {
    const entries = this.data.recurring_devices || [];
    if (!entries.length) return "";
    const rows = entries.map(r => `<button class="row rel" data-object="${this.esc(`device:${r.device_id}`)}"><span class="tile warn"><ha-icon icon="mdi:backup-restore"></ha-icon></span><span class="row-text"><strong>${this.esc(r.name)}</strong><small>${this.t("recurringSince", { date: this.formatDate(r.forgotten_at), domains: this.esc((r.domains || []).join(", ")) })}</small></span></button>`).join("");
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("recurringTitle")} (${entries.length})</h2><p>${this.t("recurringHint")}</p></div></div>${rows}</div>`;
  }

  cleanupView() {
    if (this.journal === null && !this._journalRequested) { this._journalRequested = true; this.loadJournal(); }
    this.lvState("cleanup", "name", "asc");
    const all = this.cleanupCandidates();
    const sorts = [
      { key: "name", label: "sortName", dir: "asc", get: r => r.item.name },
      { key: "id", label: "sortId", dir: "asc", get: r => r.item.object_id },
      { key: "since", label: "sortSince", dir: "desc", get: r => (r.quarantine ? r.quarantine.since : r.finding?.first_detected_at) },
      { key: "certainty", label: "sortCertainty", dir: "desc", get: r => (r.finding ? r.finding.confidence : null) },
    ];
    const limit = this.data.meta.quarantine_days ?? 14;
    const ready = r => !r.quarantine || this.daysSince(r.quarantine.since) >= limit;
    const classes = [...new Set(all.filter(r => r.finding).map(r => r.finding.classification))];
    const removal = ["remove_entity", "remove_device", "forget_device"].includes(this.cleanupKind);
    const device = DEVICE_KINDS.includes(this.cleanupKind);
    const filterOptions = removal ? [["ready", this.t("removalReady")], ["waiting", this.t("waitingShort")]] : classes.map(c => [c, this.t(c)]);
    const bar = this.listBar("cleanup", { sorts, filters: [{ name: removal ? "readiness" : "classification", all: this.t("all"), options: filterOptions }] });
    const list = this.refine("cleanup", all, {
      text: r => [r.item.name, r.item.object_id, r.item.platform, r.item.manufacturer, r.item.model].join(" "),
      filters: { classification: (r, v) => r.finding && r.finding.classification === v, readiness: (r, v) => (v === "ready") === ready(r) }, sorts, tie: r => r.item.object_id,
    });
    const pg = this.paginate("cleanup", list);
    this._cleanupVisible = pg.rows.filter(ready).map(r => r.item.object_id);
    const row = r => {
      const { item, finding, quarantine } = r, left = quarantine ? limit - this.daysSince(quarantine.since) : 0;
      const badge = finding ? this.pill(finding.classification) : quarantine ? `<span class="pill ${left > 0 ? "mute" : "ok"}">${left > 0 ? this.t("daysLeftShort", { days: left }) : this.t("removalReady")}</span>` : `<span class="pill mute">${this.t("deviceEntities", { count: r.count })}</span>`;
      const sub = item.object_type === "device" ? [item.manufacturer, item.model].filter(Boolean).join(" ") || item.object_id : item.object_id;
      return `<div class="row"><input type="checkbox" data-sel="${this.esc(item.object_id)}" ${this.cleanupSel.has(item.object_id) ? "checked" : ""} ${left > 0 ? "disabled" : ""} aria-label="${this.esc(item.name)}">
      <button class="row-text link" style="text-align:left" data-object="${this.esc(`${item.object_type}:${item.object_id}`)}"><strong>${this.esc(item.name)}</strong><small>${this.esc(sub)}</small></button>${badge}</div>`;
    };
    const n = this.cleanupSel.size;
    const candidates = `<div class="panel"><div class="panelhead"><div><h2>${this.t("cleanupCandidates")} (${all.length})</h2><p>${device ? this.t(removal ? "removalDeviceHint" : "deviceCandidatesHint", { days: limit }) : removal ? this.t("removalCandidatesHint", { days: limit }) : this.t("cleanupCandidatesHint")}</p></div></div>
      <div class="toolbar">${this.kindSelect()}<span class="toolgap"></span><span class="date" aria-live="polite">${this.t("selectedCount", { count: n })}</span><button class="btn quiet" data-sel-page>${this.t("selectPage")}</button><button class="btn quiet" data-sel-clear ${n ? "" : "disabled"}>${this.t("clearSelection")}</button>
      <button class="btn primary" data-plan-create ${n && !this.cleanupBusy ? "" : "disabled"}>${this.cleanupBusy ? this.t("planCreating") : this.t("createPlan")}</button></div>
      ${bar}${list.length ? pg.rows.map(row).join("") : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t(all.length ? "noMatches" : "cleanupNone")}</div>`}${pg.footer}</div>`;
    const assistant = this.cleanupKind === "replace_references" ? this.replaceCard() : this.cleanupKind === "migrate_meter" ? this.meterCard() : candidates;
    const journalPage = this.paginate("journal", this.journal || []);
    const journal = journalPage.rows.map(plan => `<div class="row"><span class="tile mute"><ha-icon icon="mdi:clipboard-text-clock-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(this.formatDate(plan.created_at))}</strong><small>${this.t("planSummary", { total: plan.summary?.total ?? 0, ok: plan.summary?.ok ?? 0, review: plan.summary?.review ?? 0, blocked: plan.summary?.blocked ?? 0 })}${plan.file_snapshot_dropped ? ` · ${this.esc(this.t("snapshotDropped"))}` : ""}</small></span>
      <span class="pill ${plan.status === "verified" ? "ok" : plan.status === "dry_run" ? "mute" : "warn"}">${this.t(`plan_status_${plan.status || "dry_run"}`)}</span>
      <span style="display:flex;gap:8px"><button class="btn" data-plan-open="${this.esc(plan.plan_id)}">${this.t("openPlan")}</button>${plan.executed || plan.run ? "" : `<button class="btn" data-plan-delete="${this.esc(plan.plan_id)}">${this.t("deletePlan")}</button>`}</span></div>`).join("");
    const journalCard = `<div class="panel"><div class="panelhead"><div><h2>${this.t("journal")} (${(this.journal || []).length})</h2><p>${this.t("journalHint")}</p></div></div>${journal || `<div class="emptymsg"><ha-icon icon="mdi:clipboard-text-outline"></ha-icon>${this.t("journalEmpty")}</div>`}${journalPage.footer}</div>`;
    return `<div class="stack"><div class="panel"><p class="factnote">${this.t("cleanupDryRun")}</p>${this.cleanupError ? `<div class="error">${this.t("planError")}: ${this.esc(this.cleanupError)}</div>` : ""}</div>
      ${this.plan ? this.planCard(this.plan) : ""}${this.quarantineCard()}${this.recurringCard()}${assistant}${journalCard}</div>`;
  }
}

// InventoryMixin: methods of the panel element, mixed into the class in 99-register.js.
class InventoryMixin {
  filtered() {
    if (!this.data) return [];
    const q = this.query.trim().toLowerCase();
    return this.memo("inventory", [q, this.typeFilter, this.statusFilter, this.sort, this.sortDir, this.lang], () => {
      const { natural, ids } = this.collators(), desc = this.sortDir === "desc";
      const pick = item => this.sort === "status" ? item.status : this.sort === "type" ? item.object_type : this.sort === "since" ? item.status_since : (item.name || item.object_id);
      const rows = this.data.objects.filter(item => (!q || this.haystack(item).includes(q)) && (!this.typeFilter || item.object_type === this.typeFilter)
        && (!this.statusFilter || item.status === this.statusFilter)).map(item => ({ item, key: pick(item) }));
      rows.sort((a, b) => {
        if (!a.key !== !b.key) return a.key ? -1 : 1; // missing values stay last in both directions
        const order = natural.compare(String(a.key ?? ""), String(b.key ?? ""));
        return (desc ? -order : order) || ids.compare(String(a.item.object_id), String(b.item.object_id));
      });
      return rows.map(row => row.item);
    });
  }

  // The text a search looks in, built once per object.
  haystack(item) {
    const cache = this._haystacks ||= new WeakMap();
    let text = cache.get(item);
    if (text === undefined) { text = [item.name, item.object_id, item.platform, item.domain, item.unique_id].join(" ").toLowerCase(); cache.set(item, text); }
    return text;
  }

  inventory() {
    const rows = this.filtered();
    const pg = this.paginate("inventory", rows);
    const visibleRows = pg.rows;
    const { types, statuses } = this.memo("facets", [], () => ({
      types: [...new Set(this.data.objects.map(x => x.object_type))].sort(),
      statuses: [...new Set(this.data.objects.map(x => x.status))].sort(),
    }));
    return `<div class="panel"><div class="filters"><input id="query" type="search" value="${this.esc(this.query)}" placeholder="${this.t("search")}"><select id="typeFilter" aria-label="${this.t("type")}"><option value="">${this.t("all")}</option>${types.map(x => `<option value="${x}" ${this.typeFilter === x ? "selected" : ""}>${this.t(x)}</option>`).join("")}</select><select id="statusFilter" aria-label="${this.t("status")}"><option value="">${this.t("allStatus")}</option>${statuses.map(x => `<option value="${x}" ${this.statusFilter === x ? "selected" : ""}>${this.statusLabel(x)}</option>`).join("")}</select>
        <div class="mobsort"><select id="sortKey" aria-label="${this.t("sortBy")}">${[["name", "sortName"], ["type", "sortType"], ["status", "sortStatus"], ["since", "sortSince"]].map(([key, label]) => `<option value="${key}" ${this.sort === key ? "selected" : ""}>${this.t(label)}</option>`).join("")}</select><button class="btn" id="sortDir" aria-label="${this.t("sortBy")}">${this.sortDir === "desc" ? "▼" : "▲"}</button></div></div>
      <div class="tablewrap"><table><thead><tr>${this.th("name", "name")}${this.th("type", "type")}${this.th("status", "status")}<th>${this.t("reason")}</th>${this.th("since", "since")}</tr></thead><tbody>${visibleRows.map(item => `<tr data-object="${this.esc(this.objectKey(item))}" tabindex="0" role="button" aria-label="${this.esc(item.name)}"><td><span class="object">${this.tile(item.object_type, this.tone(item.status) === "ok" ? "" : this.tone(item.status))}<span><strong>${this.esc(item.name)}</strong><span class="id">${this.esc(item.object_id)}</span></span></span></td><td data-label="${this.esc(this.t("type"))}">${this.t(item.object_type)}</td><td data-label="${this.esc(this.t("status"))}">${this.pill(item.status)}</td><td data-label="${this.esc(this.t("reason"))}">${this.esc(item.reason ? this.t(item.reason) : item.missing_reference_count ? `${item.missing_reference_count} ${this.t("missingReferences")}` : "—")}</td><td data-label="${this.esc(this.t("since"))}">${this.formatDate(item.status_since)}</td></tr>`).join("")}</tbody></table>${rows.length ? "" : `<div class="emptymsg">${this.t("noResults")}</div>`}</div>
      ${pg.footer || `<div class="tablefoot"><span>${this.formatNumber(rows.length)} ${this.t("of_total")} ${this.formatNumber(this.data.objects.length)} ${this.t("shown")}</span></div>`}</div>`;
  }

  nodeButton(key, label, tone = "") {
    const obj = this.findObject(key);
    const [type, ...rest] = key.split(":");
    const id = rest.join(":");
    return `<button class="node" data-graph="${this.esc(key)}">${this.tile(type, tone)}<span><small>${this.t(type)}</small><strong>${this.esc(obj?.name || id)}</strong><span class="meta">${this.esc(label || (obj ? obj.object_id : this.t("missing")))}</span></span>${obj ? this.pill(obj.status) : `<span class="pill red">${this.t("missing")}</span>`}</button>`;
  }

  graph() {
    const q = this.graphQuery.trim().toLowerCase();
    const hits = q ? this.data.objects.filter(o => [o.name, o.object_id].join(" ").toLowerCase().includes(q)).slice(0, 40) : [];
    const search = `<div class="panel" style="margin-bottom:14px"><div class="search"><input id="graphQuery" type="search" value="${this.esc(this.graphQuery)}" placeholder="${this.t("searchObject")}"></div>${hits.length ? `<div class="hits">${hits.map(o => `<button class="hit" data-graph="${this.esc(this.objectKey(o))}">${this.tile(o.object_type)}<span class="row-text"><strong>${this.esc(o.name)}</strong><small>${this.t(o.object_type)} · ${this.esc(o.object_id)}</small></span></button>`).join("")}</div>` : ""}</div>`;
    if (!this.graphSelected) {
      return `${search}<div class="panel"><div class="emptymsg"><ha-icon icon="mdi:graph-outline"></ha-icon>${this.t("graphHint")}</div></div>`;
    }
    const item = this.graphSelected, key = this.objectKey(item);
    const head = `<div class="panel pathcard">${this.tile(item.object_type, this.tone(item.status) === "ok" ? "" : this.tone(item.status))}<div><h2>${this.esc(item.name)} ${this.pill(item.status)}</h2><span class="id">${this.esc(item.object_id)}</span></div><button class="btn" data-object="${this.esc(key)}">${this.t("details")}</button></div>`;
    if (this.useGraph()) return `${search}${head}${this.graphBar(item, key)}${this.graphPanel(item, key)}`;
    const USAGE = USAGE_RELATIONS;
    const incoming = this.edgesTo(key), outgoing = this.edgesFrom(key);
    const originEdges = incoming.filter(e => !USAGE.includes(e.relation));
    const usageEntries = [
      ...incoming.filter(e => USAGE.includes(e.relation)).map(e => ({ key: e.source, edge: e, label: `${this.t("usedBy")} · ${this.t(e.relation)}` })),
      ...outgoing.map(e => ({ key: e.target, edge: e, label: this.t(e.relation) })),
    ];
    const edgeNote = edge => `${this.t(edge.confidence)}${edge.location && edge.location !== "runtime_extraction" ? ` · ${edge.location}` : ""}`;
    const origin = originEdges.map(e => `${this.nodeButton(e.source, edgeNote(e))}<div class="link-label"><ha-icon icon="mdi:arrow-down" style="--mdc-icon-size:14px"></ha-icon>${this.t(e.relation)}</div>`).join("");
    const usage = usageEntries.length
      ? `<div class="branch">${usageEntries.map(u => `<div><div class="link-label" style="margin:0;border:0;padding:0 0 4px">${u.label}</div>${this.nodeButton(u.key, edgeNote(u.edge))}</div>`).join("")}</div>`
      : `<p style="padding:6px 16px;color:var(--hk-muted);font-size:calc(12px*var(--hk-fs,1))">${this.t("noRelations")}</p>`;
    return `${search}${head}${this.graphBar(item, key)}
      <div class="panel"><div class="panelhead"><h2>${this.t("origin")} → ${this.t("usage")}</h2><span class="date">${this.t("origin")} ${originEdges.length} · ${this.t("usage")} ${usageEntries.length}</span></div>
      <div class="path">${origin}<div class="node current">${this.tile(item.object_type, this.tone(item.status) === "ok" ? "" : this.tone(item.status))}<span><small>${this.t(item.object_type)}</small><strong>${this.esc(item.name)}</strong><span class="meta">${this.esc(item.object_id)}</span></span>${this.pill(item.status)}</div>${usage}</div></div>`;
  }
}

// GraphMixin: methods of the panel element, mixed into the class in 99-register.js.
// The graph is a second view of the dependency list: origin on the left, the object in the middle,
// what uses it on the right, up to three levels deep. The list stays the default and the fallback.
class GraphMixin {
  // The graph needs room; on a narrow screen only the list is offered.
  canGraph() {
    try { return globalThis.matchMedia ? globalThis.matchMedia("(min-width:600px)").matches : true; } catch (_) { return true; }
  }

  useGraph() { return this.prefs.graphMode === "graph" && this.canGraph(); }

  // Walks the edges level by level from the object. Left: what the object comes from (non-usage
  // edges pointing at it). Right: what uses it (usage edges pointing at it) and what it uses
  // (edges leaving it). Returns nodes per level, the edges between included nodes and the notes.
  graphModel(item, key, { depth = 1, relation = "", certainOnly = false, limit = GRAPH_NODE_STEP } = {}) {
    const keep = e => (!relation || e.relation === relation) && (!certainOnly || e.confidence === "certain");
    const sides = {
      left: { levels: [], seen: new Map(), next: node => this.edgesTo(node).filter(e => !USAGE_RELATIONS.includes(e.relation) && keep(e)).map(e => [e.source, e]) },
      right: { levels: [], seen: new Map(), next: (node, via) => (via === "out"
        ? this.edgesFrom(node).filter(keep).map(e => [e.target, e])
        : this.edgesTo(node).filter(e => USAGE_RELATIONS.includes(e.relation) && keep(e)).map(e => [e.source, e])) },
    };
    const edges = [], cycles = new Set();
    let hidden = 0;
    const record = (from, to, edge, cycle) => {
      edges.push({ from, to, edge, cycle });
      if (cycle) cycles.add(edge);
    };
    for (const [name, side] of Object.entries(sides)) {
      let frontier = [{ key, via: null }];
      for (let level = 1; level <= depth && frontier.length; level++) {
        const found = [];
        for (const parent of frontier) {
          const candidates = name === "right" && parent.key === key
            ? [...sides.right.next(key, "in").map(([k, e]) => [k, e, "in"]), ...sides.right.next(key, "out").map(([k, e]) => [k, e, "out"])]
            : side.next(parent.key, parent.via).map(([k, e]) => [k, e, parent.via]);
          for (const [other, edge, via] of candidates) {
            const known = side.seen.get(other);
            const opposite = (name === "left" ? sides.right : sides.left).seen.has(other);
            // Back to the object, to an earlier level or to the other side closes a loop.
            if (other === key || opposite || (known && known.level <= level - 1)) { record(other, parent.key, edge, true); continue; }
            if (known) { record(other, parent.key, edge, false); continue; } // a second way to a node of this level
            if (side.seen.size >= limit) { hidden++; continue; }
            const node = { key: other, level, via, parent: parent.key };
            side.seen.set(other, node);
            found.push(node);
            record(other, parent.key, edge, false);
          }
        }
        if (found.length) side.levels.push(found);
        frontier = found;
      }
    }
    const nodes = new Set([key, ...sides.left.seen.keys(), ...sides.right.seen.keys()]);
    const shown = edges.filter(e => nodes.has(e.from) && nodes.has(e.to));
    const all = [...sides.left.seen.values(), ...sides.right.seen.values()];
    return {
      key, left: sides.left.levels, right: sides.right.levels, edges: shown,
      hidden, cycles: [...cycles].filter(e => shown.some(s => s.edge === e)).length,
      missing: all.filter(n => !this.findObject(n.key)).length,
      probable: shown.filter(e => e.edge.confidence !== "certain").length,
      count: all.length,
    };
  }

  // Columns from the outermost left level to the outermost right level, the object in the middle.
  graphLayout(model) {
    const W = 196, H = 48, GAPX = 72, GAPY = 14;
    const columns = [...[...model.left].reverse(), [{ key: model.key, center: true }], ...model.right];
    const tallest = Math.max(...columns.map(c => c.length));
    const height = tallest * H + (tallest - 1) * GAPY;
    const at = new Map();
    columns.forEach((column, i) => {
      const top = (height - (column.length * H + (column.length - 1) * GAPY)) / 2;
      column.forEach((node, j) => at.set(node.key, { x: i * (W + GAPX), y: top + j * (H + GAPY), node }));
    });
    // Room on the right for the arcs between nodes of one column.
    return { W, H, width: columns.length * W + (columns.length - 1) * GAPX + 48, height, at };
  }

  graphClip(text, max) { const s = String(text ?? ""); return s.length > max ? `${s.slice(0, max - 1)}…` : s; }

  graphSvg(model, item, hitKeys) {
    const layout = this.graphLayout(model), { W, H, at } = layout;
    const edgeSvg = model.edges.map(({ from, to, edge, cycle }) => {
      const a = at.get(from), b = at.get(to);
      if (!a || !b) return "";
      const sameColumn = a.x === b.x;
      // Two nodes of one column are joined by an arc on their right side.
      const [l, r] = sameColumn ? (a.y < b.y ? [a, b] : [b, a]) : a.x < b.x ? [a, b] : [b, a];
      const x1 = l.x + W, y1 = l.y + H / 2, x2 = sameColumn ? r.x + W : r.x, y2 = r.y + H / 2, dx = sameColumn ? 44 : (x2 - x1) / 2;
      const forward = edge.source === (l === a ? from : to); // the data direction runs from the first to the second end
      const hit = hitKeys && (hitKeys.has(edge.source) && (hitKeys.has(edge.target) || edge.target === model.key));
      const cls = ["gedge", edge.confidence === "certain" ? "" : "prob", cycle ? "cycle" : "", hit ? "hit" : "", hitKeys && !hit ? "gdim" : ""].filter(Boolean).join(" ");
      const mark = forward ? 'marker-end="url(#hk-arrow)"' : 'marker-start="url(#hk-arrow)"';
      return `<path class="${cls}" d="M${x1},${y1} C${x1 + dx},${y1} ${sameColumn ? x2 + dx : x2 - dx},${y2} ${x2},${y2}" ${mark}><title>${this.esc(`${edge.source} → ${edge.target}: ${this.t(edge.relation)} (${this.t(edge.confidence)})`)}</title></path>`;
    }).join("");
    const nodeSvg = [...at.entries()].map(([key, { x, y, node }]) => {
      const obj = this.findObject(key), [type, ...rest] = key.split(":"), id = rest.join(":");
      const name = obj?.name || id, status = obj ? this.statusLabel(obj.status) : this.t("missing");
      const hit = hitKeys?.has(key), tone = obj ? this.tone(obj.status) : "red";
      const cls = ["gnode", node.center ? "center" : "", obj ? "" : "missing", hit ? "hit" : "", hitKeys && !hit && !node.center ? "gdim" : ""].filter(Boolean).join(" ");
      const label = `${this.t(type)}: ${name}, ${status}${hit ? `, ${this.t("graphBreaks")}` : ""}`;
      return `<g class="${cls}" ${node.center ? "" : `data-graph="${this.esc(key)}" tabindex="0" role="button"`} aria-label="${this.esc(label)}" transform="translate(${x},${y})"><title>${this.esc(`${label} (${id})`)}</title>
        <rect width="${W}" height="${H}" rx="8"></rect><rect class="bar ${tone}" width="5" height="${H}" rx="2"></rect>
        <text class="t1" x="14" y="18">${this.esc(this.graphClip(`${this.t(type)} · ${status}${hit ? ` · ${this.t("graphBreaks")}` : ""}`, 32))}</text>
        <text x="14" y="36">${this.esc(this.graphClip(name, 21))}</text></g>`;
    }).join("");
    return `<div class="graphwrap"><svg class="graphsvg" role="group" aria-label="${this.esc(this.t("graphLabel", { name: item.name }))}" width="${layout.width}" height="${layout.height}" viewBox="0 0 ${layout.width} ${layout.height}">
      <defs><marker id="hk-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="garrow" d="M0,0 L8,4 L0,8z"></path></marker></defs>${edgeSvg}${nodeSvg}</svg></div>`;
  }

  // The switch between list and graph, and for the graph the depth, filters and the removal highlight.
  graphBar(item, key) {
    const canGraph = this.canGraph(), graph = this.useGraph();
    const toggle = canGraph ? `<div class="seg" role="group" aria-label="${this.esc(this.t("graphMode"))}">${[["list", "graphList"], ["graph", "graphGraph"]].map(([mode, label]) => `<button class="btn ${(graph ? "graph" : "list") === mode ? "primary" : ""}" data-pref="graphMode|${mode}" aria-pressed="${(graph ? "graph" : "list") === mode}">${this.t(label)}</button>`).join("")}</div>` : "";
    if (!graph) return toggle ? `<div class="panel graphbar">${toggle}</div>` : "";
    const depth = [1, 2, 3].map(n => `<button class="btn ${this.graphDepth === n ? "primary" : ""}" data-graph-depth="${n}" aria-pressed="${this.graphDepth === n}">${n}</button>`).join("");
    const relations = [...new Set(this.graphModel(item, key, { depth: this.graphDepth, limit: 400 }).edges.map(e => e.edge.relation))].sort();
    const relSelect = `<select id="graphRel" aria-label="${this.esc(this.t("graphRelation"))}"><option value="">${this.t("graphAllRelations")}</option>${relations.map(r => `<option value="${r}" ${this.graphRel === r ? "selected" : ""}>${this.t(r)}</option>`).join("")}</select>`;
    const confSelect = `<select id="graphConf" aria-label="${this.esc(this.t("graphConfidence"))}"><option value="all" ${this.graphConf === "all" ? "selected" : ""}>${this.t("graphAllConf")}</option><option value="certain" ${this.graphConf === "certain" ? "selected" : ""}>${this.t("graphCertainOnly")}</option></select>`;
    const impact = this.impact(item, key);
    const impactBtn = impact ? `<button class="btn ${this.graphImpact ? "primary" : ""}" data-graph-impact aria-pressed="${this.graphImpact}">${this.t("graphImpact")}</button>` : "";
    return `<div class="panel graphbar">${toggle}<span class="graphctl"><small>${this.t("graphDepth")}</small><span class="seg" role="group" aria-label="${this.esc(this.t("graphDepth"))}">${depth}</span></span>${relSelect}${confSelect}${impactBtn}</div>`;
  }

  graphPanel(item, key) {
    const model = this.graphModel(item, key, { depth: this.graphDepth, relation: this.graphRel, certainOnly: this.graphConf === "certain", limit: this.graphLimit });
    const impact = this.graphImpact ? this.impact(item, key) : null;
    const hitKeys = impact ? new Set([...impact.hits.map(h => h.key)]) : null;
    const nothing = !model.count;
    const shownHits = hitKeys ? [...hitKeys].filter(k => model.left.concat(model.right).some(level => level.some(n => n.key === k))).length : 0;
    const notes = [
      hitKeys && hitKeys.size > shownHits ? this.t("graphHitsOutside", { n: hitKeys.size - shownHits }) : "",
      model.missing ? this.t("graphMissing", { n: model.missing }) : "", model.probable ? this.t("graphProbable", { n: model.probable }) : "",
      model.cycles ? this.t("graphCycles", { n: model.cycles }) : "", model.hidden ? this.t("graphHidden", { n: model.hidden }) : "",
    ].filter(Boolean).join(" · ");
    const more = model.hidden ? `<button class="btn" data-graph-more>${this.t("graphMore")}</button>` : "";
    return `<div class="panel"><div class="panelhead"><h2>${this.t("origin")} → ${this.t("usage")}</h2><span class="date">${this.t("graphNodes", { n: model.count })}</span></div>
      ${nothing ? `<p style="padding:6px 16px;color:var(--hk-muted)">${this.t("noRelations")}</p>` : this.graphSvg(model, item, hitKeys)}
      <p class="factnote">${this.t("graphLegend")}${notes ? ` ${this.esc(notes)}` : ""} ${more}</p></div>`;
  }
}

// UnusedMixin: methods of the panel element, mixed into the class in 99-register.js.
class UnusedMixin {
  batteryRows() {
    const rows = [];
    for (const o of this.data.objects) {
      if (o.object_type !== "entity" || o.device_class !== "battery" || o.status !== "active") continue;
      const domain = o.object_id.split(".")[0];
      if (domain === "binary_sensor") rows.push({ item: o, level: null, low: o.state === "on" });
      else if (domain === "sensor" && o.state !== null && o.state !== "" && !Number.isNaN(Number(o.state))) rows.push({ item: o, level: Number(o.state), low: false });
    }
    const limit = this.data.meta.low_battery_percent ?? 20;
    rows.forEach(r => { r.low = r.low || (r.level !== null && r.level <= limit); });
    return rows.sort((a, b) => (Number(b.low) - Number(a.low)) || ((a.level ?? -1) - (b.level ?? -1)) || a.item.name.localeCompare(b.item.name));
  }

  // Active entities no source refers to. A hint only; see unreferencedHint for the blind spots.
  unreferencedRows() {
    const { used } = this.edgeIndex();
    const SELF = ["automation", "script", "scene"];
    return this.data.objects.filter(o => o.object_type === "entity" && o.status === "active" && !o.entity_category
      && !SELF.includes(o.object_id.split(".")[0]) && !used.has(this.objectKey(o)))
      .sort((a, b) => a.object_id.localeCompare(b.object_id));
  }

  unrefTabs() {
    const stats = this.data.orphaned_statistics || [];
    const chip = (tab, label, count) => `<button class="chip ${this.unrefTab === tab ? "active" : ""}" data-unref-tab="${tab}">${label} (${count})</button>`;
    return `<div class="chips">${chip("entities", this.t("unreferencedEntities"), this.unreferencedRows().length)}${chip("statistics", this.t("orphanStats"), stats.length)}</div>`;
  }

  // Active entities that look like what an orphaned statistic became after a rename: same domain, same unit, similar name.
  statSuccessors(orphan) {
    const [domain, name = ""] = orphan.statistic_id.split(".");
    const words = new Set(name.split("_").filter(Boolean));
    const found = [];
    for (const o of this.data.objects) {
      if (o.object_type !== "entity" || o.status !== "active" || o.object_id === orphan.statistic_id || !o.object_id.startsWith(`${domain}.`)) continue;
      if (orphan.unit && o.unit !== orphan.unit) continue;
      const other = new Set(o.object_id.split(".")[1].split("_").filter(Boolean));
      const shared = [...words].filter(w => other.has(w)).length;
      const score = shared / (words.size + other.size - shared || 1);
      if (score >= 0.5) found.push({ item: o, score });
    }
    return found.sort((a, b) => b.score - a.score || a.item.object_id.localeCompare(b.item.object_id)).slice(0, 2).map(f => f.item);
  }

  statSuccessorLine(orphan) {
    const successors = this.statSuccessors(orphan);
    if (!successors.length) return "";
    const links = successors.map(s => `<button class="linklike" data-object="entity:${this.esc(s.object_id)}">${this.esc(s.object_id)}</button>`).join(", ");
    return `<small>${this.t("statSuccessors")} ${links}</small>`;
  }

  orphanStatsView() {
    const all = this.data.orphaned_statistics || [];
    this.lvState("orphanstats", "id", "asc");
    const kind = o => (o.has_sum && o.has_mean ? "kindBoth" : o.has_sum ? "kindSum" : "kindMean");
    const sorts = [
      { key: "id", label: "sortId", dir: "asc", get: o => o.statistic_id },
      { key: "unit", label: "sortUnit", dir: "asc", get: o => o.unit },
    ];
    const kinds = [...new Set(all.map(kind))];
    const bar = this.listBar("orphanstats", { sorts, filters: [{ name: "kind", all: this.t("allKinds"), options: kinds.map(k => [k, this.t(k)]) }] });
    const rows = this.refine("orphanstats", all, { text: o => [o.statistic_id, o.unit].join(" "), filters: { kind: (o, v) => kind(o) === v }, sorts, tie: o => o.statistic_id });
    const pg = this.paginate("orphanstats", rows);
    const row = o => `<div class="row"><span class="tile mute"><ha-icon icon="mdi:chart-line-variant"></ha-icon></span><span class="row-text"><strong>${this.esc(o.statistic_id)}</strong><small>${this.esc([this.t(kind(o)), o.unit].filter(Boolean).join(" · "))}</small>${this.statSuccessorLine(o)}</span>${o.in_energy ? `<span class="pill warn">${this.t("inEnergy")}</span>` : ""}</div>`;
    const empty = this.t(this.data.meta.recorder_available ? (all.length ? "noMatches" : "noOrphanStats") : "noRecorder");
    return `<div class="panel">${this.unrefTabs()}<p class="factnote">${this.t("orphanStatsHint")}</p>${bar}${rows.length ? pg.rows.map(row).join("") : `<div class="emptymsg"><ha-icon icon="mdi:chart-line-variant"></ha-icon>${empty}</div>`}${pg.footer}</div>`;
  }

  unreferencedView() {
    if (this.unrefTab === "statistics") return this.orphanStatsView();
    const all = this.unreferencedRows();
    this.lvState("unreferenced", "id", "asc");
    const domains = [...new Set(all.map(o => o.object_id.split(".")[0]))].sort();
    const areas = [...new Set(all.map(o => this.areaName(o)).filter(Boolean))].sort();
    const sorts = [
      { key: "id", label: "sortId", dir: "asc", get: o => o.object_id },
      { key: "name", label: "sortName", dir: "asc", get: o => o.name },
      { key: "area", label: "sortArea", dir: "asc", get: o => this.areaName(o) },
    ];
    const bar = this.listBar("unreferenced", { sorts, filters: [
      { name: "domain", all: this.t("allDomains"), options: domains.map(d => [d, `${d} (${all.filter(o => o.object_id.startsWith(`${d}.`)).length})`]) },
      { name: "area", all: this.t("allAreas"), options: areas.map(a => [a, a]) },
    ] });
    const rows = this.refine("unreferenced", all, {
      text: o => [o.name, o.object_id, this.areaName(o)].join(" "),
      filters: { domain: (o, v) => o.object_id.startsWith(`${v}.`), area: (o, v) => this.areaName(o) === v }, sorts, tie: o => o.object_id,
    });
    const pg = this.paginate("unreferenced", rows);
    const row = item => {
      const device = item.device_id ? this.findObject(`device:${item.device_id}`) : null;
      const area = this.findObject(`area:${item.area_id || device?.area_id}`);
      return `<button class="row rel" data-object="${this.esc(this.objectKey(item))}"><span class="tile mute"><ha-icon icon="mdi:link-variant-off"></ha-icon></span><span class="row-text"><strong>${this.esc(item.name)}</strong><small>${this.esc([item.object_id, device?.name, area?.name].filter(Boolean).join(" · "))}</small></span></button>`;
    };
    return `<div class="panel">${this.unrefTabs()}<p class="factnote">${this.t("unreferencedHint")}</p>${bar}${rows.length ? pg.rows.map(row).join("") : `<div class="emptymsg"><ha-icon icon="mdi:link-variant"></ha-icon>${this.t(all.length ? "noMatches" : "noUnreferenced")}</div>`}${pg.footer}</div>`;
  }

  batterySorts() {
    return [
      // Low batteries first, then the lowest level.
      { key: "level", label: "sortLevel", dir: "asc", get: r => (r.low ? 0 : 1e6) + (r.level ?? -1) },
      { key: "name", label: "sortName", dir: "asc", get: r => r.item.name },
      { key: "area", label: "sortArea", dir: "asc", get: r => this.areaName(r.item) },
    ];
  }

  lowBatteries() { return this.data ? this.batteryRows().filter(r => r.low) : []; }

  batteriesView() {
    const all = this.batteryRows(), low = all.filter(r => r.low);
    this.lvState("batteries", "level", "asc");
    const areas = [...new Set(all.map(r => this.areaName(r.item)).filter(Boolean))].sort();
    const bar = this.listBar("batteries", { sorts: this.batterySorts(), filters: [{ name: "area", all: this.t("allAreas"), options: areas.map(a => [a, a]) }] });
    const list = this.refine("batteries", this.batteryFilter === "low" ? low : all, {
      text: r => [r.item.name, r.item.object_id, this.areaName(r.item)].join(" "),
      filters: { area: (r, v) => this.areaName(r.item) === v }, sorts: this.batterySorts(), tie: r => r.item.object_id,
    });
    const limit = this.data.meta.low_battery_percent ?? 20;
    const chips = `<div class="chips"><button class="chip ${this.batteryFilter === "low" ? "active" : ""}" data-battery-filter="low">${this.t("batteryLow")} (${low.length})</button><button class="chip ${this.batteryFilter === "low" ? "" : "active"}" data-battery-filter="all">${this.t("batteryAll")} (${all.length})</button></div>`;
    const row = ({ item, level, low: isLow }) => {
      const device = item.device_id ? this.findObject(`device:${item.device_id}`) : null;
      const area = this.findObject(`area:${item.area_id || device?.area_id}`);
      const tone = isLow ? (level !== null && level <= limit / 2 ? "red" : "warn") : "ok";
      return `<button class="row rel" data-object="${this.esc(this.objectKey(item))}"><span class="tile ${tone === "ok" ? "ok" : tone}"><ha-icon icon="${isLow ? "mdi:battery-alert-variant-outline" : "mdi:battery-high"}"></ha-icon></span><span class="row-text"><strong>${this.esc(item.name)}</strong><small>${this.esc([device?.name, area?.name].filter(Boolean).join(" · ") || item.object_id)}</small></span><span class="pill ${tone}">${level !== null ? `${this.esc(Math.round(level))} ${this.esc(item.unit || "%")}` : this.t("batteryLow")}</span></button>`;
    };
    const pg = this.paginate(`batteries-${this.batteryFilter}`, list);
    return `<div class="panel">${chips}${bar}${list.length ? pg.rows.map(row).join("") : `<div class="emptymsg"><ha-icon icon="mdi:battery-check-outline"></ha-icon>${this.t(all.length ? "noMatches" : "noBatteries")}</div>`}${pg.footer}</div>`;
  }
}

// DiagnosisMixin: methods of the panel element, mixed into the class in 99-register.js.
class DiagnosisMixin {
  relTime(value) {
    if (!value) return "";
    const diff = (Date.now() - new Date(value).getTime()) / 1000;
    if (!(diff >= 0)) return "";
    const rtf = new Intl.RelativeTimeFormat(this.lang, { numeric: "auto" });
    for (const [unit, secs] of [["day", 86400], ["hour", 3600], ["minute", 60]]) {
      if (diff >= secs) return rtf.format(-Math.floor(diff / secs), unit);
    }
    return rtf.format(0, "second");
  }

  integrationCheck(entryId) {
    const entry = this.findObject(`config_entry:${entryId}`), label = this.t("integration");
    if (!entry) return { row: this.check(label, "red", entryId, this.t("missing")), entry };
    if (entry.disabled_by) return { row: this.check(label, "mute", entry.name, this.t("disabled")), entry };
    const state = entry.state || "not_loaded";
    const tone = state === "loaded" ? "ok" : ["setup_error", "migration_error", "failed_unload"].includes(state) ? "red" : "warn";
    return { row: this.check(label, tone, entry.name, this.t(`cs_${state}`)), entry, broken: state !== "loaded", state };
  }

  // Builds the check list and the plain-language cause for one object. Returns null when nothing is worth explaining.
  diagnose(item) {
    const t = (k, v) => this.t(k, v);
    const rows = [];
    let cause = "", hint = "", tone = this.tone(item.status);
    if (tone === "blue") tone = "ok";

    if (item.object_type === "entity") {
      const integ = item.config_entry_id ? this.integrationCheck(item.config_entry_id) : null;
      if (integ) rows.push(integ.row);
      const device = item.device_id ? this.findObject(`device:${item.device_id}`) : null;
      if (item.device_id) {
        rows.push(!device ? this.check(t("device"), "red", item.device_id, t("missing"))
          : device.status === "disabled" ? this.check(t("device"), "mute", device.name, t("disabled"))
          : this.check(t("device"), "ok", device.name, t("active")));
      }
      if (item.disabled_by) rows.push(this.check(t("entity"), "mute", t("entity_disabled"), t("disabled")));
      const state = item.state;
      if (state === null || state === undefined) {
        rows.push(this.check(t("runtimeState"), item.disabled_by ? "mute" : "red", t("noState"), item.disabled_by ? t("notExpected") : t("missing")));
      } else if (state === "unavailable") rows.push(this.check(t("runtimeState"), "red", state, t("unavailable")));
      else if (state === "unknown") rows.push(this.check(t("runtimeState"), "violet", state, t("unknown")));
      else rows.push(this.check(t("runtimeState"), "ok", item.unit ? `${state} ${item.unit}` : state, t("available")));

      const broken = integ?.broken ? { state: t(`cs_${integ.state}`) } : null;
      switch (item.reason) {
        case "state_available": cause = t("cause_ok"); break;
        case "entity_disabled": case "device_disabled": case "integration_disabled": case "device_missing": case "config_entry_missing":
          cause = t(`cause_${item.reason}`); break;
        case "state_missing": cause = broken ? t("cause_state_missing_integration", broken) : t("cause_state_missing"); break;
        case "state_unavailable": cause = broken ? t("cause_state_unavailable_integration", broken) : t("cause_state_unavailable"); break;
        case "state_unknown": cause = t("cause_state_unknown"); break;
        default: cause = item.reason ? t(item.reason) : "";
      }
      const brokenMembers = this.data.findings.filter(f => f.rule_id === "entity.missing_member" && f.object_id === item.object_id);
      brokenMembers.forEach(f => rows.push(this.check(t("missing_member"), "red", f.affected_object, t("missing"))));
      if (item.duplicate_of) {
        rows.push(this.check(t("duplicateTwin"), "violet", item.duplicate_of, t("possible_duplicate")));
        cause = `${t("cause_duplicate", { twin: item.duplicate_of })} ${cause}`;
      }
      if (item.reason === "state_unavailable") hint = broken ? t("hint_integration") : t("hint_state_unavailable");
      else if (item.reason === "state_unknown") hint = t("hint_state_unknown");
      else if (item.reason === "state_missing" && broken) hint = t("hint_integration");
      else if (["state_missing", "device_missing", "config_entry_missing"].includes(item.reason)) hint = t("hint_orphan");
      if (item.duplicate_of) hint = t("hint_duplicate");
      if (brokenMembers.length) {
        cause = `${t("cause_group_broken", { count: brokenMembers.length })} ${cause}`;
        hint = t("hint_group_broken");
        tone = "red";
      }
    } else if (item.object_type === "device") {
      const ids = item.config_entry_ids || [];
      ids.forEach(id => rows.push(this.integrationCheck(id).row));
      rows.push(this.check(t("entities"), item.entity_count ? "ok" : "warn", this.formatNumber(item.entity_count), item.entity_count ? t("present") : t("empty")));
      cause = item.status === "disabled" ? t("cause_device_off") : item.status === "empty" ? t("cause_device_empty") : t("cause_device_active");
    } else if (item.object_type === "config_entry") {
      const state = item.state || "not_loaded";
      if (item.disabled_by) { rows.push(this.check(t("status"), "mute", item.name, t("disabled"))); cause = t("cause_entry_off"); }
      else if (item.source === "ignore") { rows.push(this.check(t("status"), "mute", item.name, t("ignored"))); cause = t("cause_entry_ignored"); hint = t("hint_entry_ignored"); tone = "ok"; }
      else if (state === "loaded") { rows.push(this.check(t("status"), "ok", item.name, t("cs_loaded"))); cause = t("cause_entry_ok"); }
      else {
        rows.push(this.check(t("status"), tone, item.name, t(`cs_${state}`)));
        if (item.error) rows.push(this.check(t("entryError"), tone, item.error, ""));
        cause = t(item.error ? "cause_entry_problem_error" : "cause_entry_problem", { state: t(`cs_${state}`), error: item.error || "" }); hint = t("hint_integration");
      }
      const helperBroken = this.data.findings.filter(f => f.rule_id === "config_entry.missing_entity" && f.object_id === item.object_id);
      helperBroken.forEach(f => rows.push(this.check(t("missing_entity"), "red", `${f.affected_object}${f.evidence?.[0]?.location ? ` · ${f.evidence[0].location}` : ""}`, t("missing"))));
      if (helperBroken.length) { cause = t("cause_helper_broken", { count: helperBroken.length }); hint = t("hint_helper_broken"); tone = "red"; }
    } else if (["automation", "script", "scene", "dashboard"].includes(item.object_type)) {
      const key = this.objectKey(item);
      const broken = this.data.findings.filter(f => this.findingKey(f) === key && f.rule_id.includes(".missing_"));
      broken.forEach(f => rows.push(this.check(t(f.rule_id.split(".")[1]), "red", `${f.affected_object}${f.evidence?.[0]?.location ? ` · ${f.evidence[0].location}` : ""}`, t("missing"))));
      if (item.object_type === "automation" && item.status === "disabled") rows.push(this.check(t("status"), "mute", t("automationOff"), t("disabled")));
      if (!broken.length) rows.push(this.check(t("dependencies"), "ok", t("refsResolved"), t("present")));
      const unused = item.object_type === "automation" ? this.data.findings.find(f => this.findingKey(f) === key && f.classification === "unused") : null;
      if (item.object_type === "automation") {
        rows.push(this.check(t("lastTriggered"), unused ? "warn" : "ok", item.last_triggered ? this.formatDate(item.last_triggered) : t("never"), unused ? t("unused") : t("available")));
      }
      cause = broken.length ? t("cause_automation_broken", { count: broken.length }) : unused ? t(`cause_${unused.rule_id.split(".")[1]}`, { days: unused.evidence?.[0]?.days ?? "" }) : t("cause_automation_ok");
      if (unused && !broken.length) { hint = t("hint_unused"); tone = "warn"; }
      if (broken.length) { hint = t("hint_automation_broken"); tone = "red"; }
    } else return null;
    return { rows, cause, hint, tone };
  }

  diagnosisCard(item) {
    const d = this.diagnose(item);
    if (!d) return "";
    const icon = { ok: "mdi:check-circle", warn: "mdi:alert-circle", red: "mdi:close-circle", mute: "mdi:minus-circle", violet: "mdi:help-circle" };
    const rows = d.rows.map(r => `<div class="check ${r.tone}"><ha-icon icon="${icon[r.tone] || icon.ok}"></ha-icon><b>${this.esc(r.label)}</b><span class="val">${this.esc(r.value)}</span><i class="pill ${r.tone}">${this.esc(r.badge)}</i></div>`).join("");
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("diagnosis")}</h2></div></div>
      <div class="diagcard"><div class="checks">${rows}</div>
      ${d.cause ? `<div class="cause ${d.tone}"><ha-icon icon="mdi:text-search"></ha-icon><div><strong>${this.t("causeLabel")}</strong><p>${this.esc(d.cause)}</p></div></div>` : ""}
      ${d.hint ? `<div class="hintbox"><ha-icon icon="mdi:lightbulb-on-outline"></ha-icon><div><strong>${this.t("hintLabel")}</strong><p>${this.esc(d.hint)}</p></div></div>` : ""}</div></section>`;
  }

  // Read-only what-if: which automations would lose a reference if this object (and what it owns) were removed.
  impact(item, key) {
    if (["automation", "script", "scene", "dashboard"].includes(item.object_type)) return null;
    const OWNED = ["PROVIDES", "OWNS"], USAGE = USAGE_RELATIONS;
    const scope = new Set([key]);
    for (const member of scope) { // grows while iterating: what the object owns, and what that owns
      for (const e of this.edgesFrom(member)) if (OWNED.includes(e.relation)) scope.add(e.target);
    }
    const { order } = this.edgeIndex();
    const byAutomation = new Map();
    const used = [];
    for (const member of scope) used.push(...this.edgesTo(member));
    used.sort((a, b) => order.get(a) - order.get(b)); // the order of the edges as scanned
    for (const e of used) {
      if (!USAGE.includes(e.relation) || !scope.has(e.target) || scope.has(e.source) || !(/^(automation|script|scene|dashboard|config_entry):/.test(e.source) || e.relation === "INCLUDES")) continue;
      const hit = byAutomation.get(e.source) || { key: e.source, certain: false, places: [] };
      if (e.confidence === "certain") hit.certain = true;
      if (e.location && e.location !== "runtime_extraction") hit.places.push(e.location);
      byAutomation.set(e.source, hit);
    }
    const hits = [...byAutomation.values()].sort((a, b) => Number(b.certain) - Number(a.certain));
    const certain = hits.filter(h => h.certain).length;
    const tone = certain ? "red" : hits.length ? "warn" : "ok";
    return { hits, certain, probable: hits.length - certain, tone, related: scope.size - 1 };
  }

  impactCard(item, key) {
    const m = this.impact(item, key);
    if (!m) return "";
    const title = m.certain ? "impactCertain" : m.hits.length ? "impactProbable" : "impactNone";
    const text = m.certain ? this.t("impactCertainText", { count: m.certain }) : m.hits.length ? this.t("impactProbableText", { count: m.probable }) : this.t("impactNoneText");
    const icon = { ok: "mdi:check-circle", warn: "mdi:alert-circle", red: "mdi:alert-octagon" }[m.tone];
    const LIMIT = 15;
    const rows = m.hits.slice(0, LIMIT).map(h => {
      const obj = this.findObject(h.key);
      const note = `${this.t(h.certain ? "certain" : "probable")}${h.places.length ? ` · ${h.places.slice(0, 2).join(", ")}` : ""}`;
      return `<button class="row rel" data-object="${this.esc(h.key)}">${this.tile(h.key.split(":")[0], h.certain ? "red" : "warn")}<span class="row-text"><strong>${this.esc(obj?.name || h.key.split(":").slice(1).join(":"))}</strong><small>${this.esc(note)}</small></span>${obj ? this.pill(obj.status) : ""}</button>`;
    }).join("");
    const more = m.hits.length > LIMIT ? `<p class="factnote">${this.t("moreItems", { count: m.hits.length - LIMIT })}</p>` : "";
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("impactTitle")}</h2><p>${this.t("impactSubtitle")}</p></div></div>
      <div class="diagcard"><div class="cause ${m.tone}"><ha-icon icon="${icon}"></ha-icon><div><strong>${this.t(title)}</strong><p>${this.esc(text)}</p></div></div></div>${rows}${more}
      ${item.object_type === "entity" && item.has_statistics ? `<p class="factnote">${this.t("statsNote")}</p>` : ""}
      <p class="factnote">${m.related ? this.t("impactScope", { count: m.related }) : this.t("impactScopeOne")} ${this.t("impactLimits")}</p></section>`;
  }

  factsCard(item, key) {
    const finding = this.data.findings.find(f => this.findingKey(f) === key);
    const usage = this.edgesTo(key).filter(e => USAGE_RELATIONS.includes(e.relation)).length;
    const min = this.data.meta.min_unavailable_days || 0;
    const facts = [];
    if (item.status_since) facts.push([this.t("since"), `${this.formatDate(item.status_since)}<small>${this.esc(this.relTime(item.status_since))} · ${this.t("firstSeenNote")}</small>`]);
    if (["entity", "automation", "script", "scene", "dashboard"].includes(item.object_type)) {
      facts.push([this.t("finding"), finding ? `${this.pill(finding.classification)}<small>${this.t("certainty")}: ${Math.round(finding.confidence * 100)} %</small>` : this.t("noFinding")]);
    }
    if (item.object_type === "entity") facts.push([this.t("refCount"), this.formatNumber(usage)]);
    const quarantined = ["entity", "device"].includes(item.object_type) ? this.quarantineOf(item.object_id) : null;
    if (quarantined) facts.push([this.t("quarantine"), `${this.t("quarantineFact", { date: this.formatDate(quarantined.since), days: this.daysSince(quarantined.since) })}<span class="factaction">${this.releaseControl(quarantined)}</span>`]);
    if (item.object_type === "entity" && this.data.meta.recorder_available) facts.push([this.t("longTermStats"), this.t(item.has_statistics ? "yes" : "no")]);
    const note = item.status === "unavailable" && !finding && min > 0 ? `<p class="factnote">${this.t("belowThreshold", { days: min })}</p>` : "";
    return `<section class="panel"><div class="panelhead"><h2>${this.t("facts")}</h2></div><div class="facts">${facts.map(([k, v]) => `<div class="fact"><span>${k}</span><b>${v}</b></div>`).join("")}</div>${note}</section>`;
  }

  relationsCard(key) {
    const USAGE = USAGE_RELATIONS;
    const incoming = this.edgesTo(key), outgoing = this.edgesFrom(key);
    const groups = [
      [this.t("origin"), incoming.filter(e => !USAGE.includes(e.relation)).map(e => ({ other: e.source, label: this.t(e.relation), edge: e }))],
      [this.t("usage"), [
        ...incoming.filter(e => USAGE.includes(e.relation)).map(e => ({ other: e.source, label: `${this.t("usedBy")} · ${this.t(e.relation)}`, edge: e })),
        ...outgoing.map(e => ({ other: e.target, label: this.t(e.relation), edge: e })),
      ]],
    ].filter(([, list]) => list.length);
    const LIMIT = 25;
    const row = ({ other, label, edge }) => {
      const obj = this.findObject(other), [type, ...rest] = other.split(":");
      const note = `${label}${edge.location && edge.location !== "runtime_extraction" ? ` · ${edge.location}` : ""}`;
      const text = `${this.tile(obj?.object_type || type, obj ? (this.tone(obj.status) === "ok" ? "" : this.tone(obj.status)) : "red")}<span class="row-text"><strong>${this.esc(obj?.name || rest.join(":"))}</strong><small>${this.esc(note)}</small></span>${obj ? this.pill(obj.status) : `<span class="pill red">${this.t("missing")}</span>`}`;
      return obj ? `<button class="row rel" data-object="${this.esc(other)}">${text}</button>` : `<div class="row rel">${text}</div>`;
    };
    const body = groups.map(([title, list]) => `<div class="sectionlabel">${title} (${list.length})</div>${list.slice(0, LIMIT).map(row).join("")}${list.length > LIMIT ? `<p class="factnote">${this.t("moreItems", { count: list.length - LIMIT })}</p>` : ""}`).join("");
    return `<section class="panel"><div class="panelhead"><h2>${this.t("relations")} (${incoming.length + outgoing.length})</h2></div>${body || `<p class="factnote">${this.t("noRelations")}</p>`}</section>`;
  }

  entrySourceLabel(source) {
    const known = ["user", "import", "ignore", "system", "reauth", "reconfigure"];
    return known.includes(source) ? this.t(`src_${source}`) : this.t("src_discovery", { source });
  }

  // Everything that says which integration an entry belongs to and where it comes from.
  integrationCard(item) {
    if (item.object_type !== "config_entry") return "";
    const state = item.state || "not_loaded";
    const path = this.haPath(item);
    const origin = item.custom ? this.t("originCustom", { path: item.integration_dir || item.domain, version: item.integration_version ? ` · v${item.integration_version}` : "" }) : this.t("originBuiltIn");
    const link = (href, text) => `<a href="${this.esc(href)}" target="_blank" rel="noopener noreferrer">${this.esc(text)}</a>`;
    const rows = [
      [this.t("integrationName"), `${this.esc(item.integration_name || item.domain)} <small>(${this.esc(item.domain)})</small>`],
      [this.t("origin"), this.esc(origin)],
      [this.t("entrySource"), `${this.esc(this.entrySourceLabel(item.source))} <small>(${this.esc(item.source)})</small>`],
      [this.t("status"), `${this.esc(item.disabled_by ? this.t("disabled") : this.t(`cs_${state}`))}${item.disabled_by ? ` <small>(${this.esc(item.disabled_by)})</small>` : ""}`],
      item.error ? [this.t("entryError"), this.esc(item.error)] : null,
      [this.t("entryEntities"), this.formatNumber(item.entity_count ?? 0)],
      [this.t("entryDevices"), this.formatNumber(item.device_count ?? 0)],
      [this.t("entryId"), `<code>${this.esc(item.object_id)}</code>`],
      item.unique_id ? [this.t("entryUniqueId"), `<code>${this.esc(item.unique_id)}</code>`] : null,
      item.created_at ? [this.t("entryCreated"), this.esc(this.formatDate(item.created_at))] : null,
      item.modified_at ? [this.t("entryModified"), this.esc(this.formatDate(item.modified_at))] : null,
      path ? [this.t("entryHaPath"), `<code>${this.esc(path)}</code>`] : null,
      item.documentation ? [this.t("entryDocs"), link(item.documentation, item.documentation)] : null,
    ].filter(Boolean);
    return `<section class="panel"><div class="panelhead"><h2>${this.t("integrationCard")}</h2></div><div class="pad"><dl class="kv">${rows.map(([k, v]) => `<dt>${this.esc(k)}</dt><dd>${v}</dd>`).join("")}</dl></div></section>`;
  }

  // The always-visible summary under the title: status, cause, since when, integration, device, area, risk.
  detailSummary(item, key) {
    const device = item.device_id ? this.findObject(`device:${item.device_id}`) : null;
    const areaId = item.area_id || device?.area_id, area = areaId ? this.findObject(`area:${areaId}`) : null;
    const integration = item.object_type === "entity" ? item.platform : item.object_type === "config_entry" ? (item.integration_name || item.domain) : null;
    const impact = this.impact(item, key);
    const risk = impact ? { tone: impact.tone, text: impact.hits.length ? this.t("riskHits", { n: impact.hits.length, c: impact.certain }) : this.t("riskNone") } : null;
    return [
      item.reason ? [this.t("sumCause"), this.esc(this.t(item.reason))] : null,
      item.status_since ? [this.t("since"), this.esc(this.formatDate(item.status_since))] : null,
      integration ? [this.t("sumIntegration"), this.esc(integration)] : null,
      device ? [this.t("sumDevice"), this.esc(device.name)] : null,
      area ? [this.t("sumArea"), this.esc(area.name)] : null,
      risk ? [this.t("sumRisk"), `<span class="pill ${risk.tone}">${this.esc(risk.text)}</span>`] : null,
    ].filter(Boolean);
  }

  // Tabs offered for one object; "attributes" only when it has some, so an empty tab never shows.
  detailTabs(item, key) {
    const tabs = [["overview", "tabOverview"], ["relations", "tabRelations", this.edgesTo(key).length + this.edgesFrom(key).length], ["technical", "tabTechnical"]];
    if (item.attributes && Object.keys(item.attributes).length) tabs.push(["attributes", "tabAttributes"]);
    if (this.runsRow(item)) tabs.push(["runs", "runsTab"]);
    return tabs;
  }

  detail() {
    const base = this.selected;
    const item = { ...base, ...(this.details.get(this.objectKey(base)) || {}) };
    const key = this.objectKey(item);
    if (["automation", "script"].includes(item.object_type)) this.ensureRuns();
    const tabs = this.detailTabs(item, key);
    const tab = tabs.some(([id]) => id === this.detailTab) ? this.detailTab : "overview";
    const path = this.haPath(item), tone = this.tone(item.status) === "ok" ? "" : this.tone(item.status);
    const back = this.trail.length ? this.trail[this.trail.length - 1].name : this.t(this.view);
    const summary = this.detailSummary(item, key).map(([label, value]) => `<span><small>${label}</small><b>${value}</b></span>`).join("");
    const tablist = tabs.map(([id, label, count]) => `<button class="tab" role="tab" id="hk-tab-${id}" aria-selected="${id === tab}" aria-controls="hk-tabpanel" tabindex="${id === tab ? 0 : -1}" data-detail-tab="${id}">${this.t(label)}${count ? ` <em>${this.formatNumber(count)}</em>` : ""}</button>`).join("");
    return `<div class="crumbs"><button class="btn" data-action="back"><ha-icon icon="mdi:arrow-left"></ha-icon>${this.t("backTo")} ${this.esc(back)}</button><span class="trail">${this.t(item.object_type)}</span></div>
      <div class="panel detailhead">${this.tile(item.object_type, tone)}<div>${this.pill(item.status)}<h1>${this.esc(item.name)}</h1><span class="id">${this.esc(item.object_id)}</span></div>
      <div class="actions">${path ? `<button class="btn" data-ha-path="${this.esc(path)}"><ha-icon icon="mdi:open-in-new"></ha-icon>${this.t("openInHA")}</button>` : ""}<button class="btn" data-graph-open="${this.esc(key)}"><ha-icon icon="mdi:source-fork"></ha-icon>${this.t("showInGraph")}</button></div></div>
      <div class="panel sumline">${summary}</div>
      <div class="tabs" role="tablist" aria-label="${this.esc(this.t("tabsLabel"))}">${tablist}</div>
      <div role="tabpanel" id="hk-tabpanel" aria-labelledby="hk-tab-${tab}" tabindex="0">${this.detailPanel(tab, item, key)}</div>`;
  }

  // Only the open tab is built, so large attributes and relations cost nothing until they are asked for.
  detailPanel(tab, item, key) {
    if (tab === "relations") return `<div class="stack">${this.findingsCard(key)}${this.relationsCard(key)}</div>`;
    if (tab === "runs") return this.runsDetailCard(this.runsRow(item));
    if (tab === "attributes") {
      return `<section class="panel"><div class="panelhead"><h2>${this.t("state")}</h2></div><div class="pad"><div class="code">${this.esc(JSON.stringify(item.attributes, null, 2))}</div></div></section>`;
    }
    if (tab === "technical") {
      const skip = new Set(["attributes", "references", "name", "object_id", "object_type", "status", "reason", "state", "status_since", "status_since_source", "triggers", "conditions", "actions"]);
      if (item.object_type === "config_entry") ["domain", "integration_name", "custom", "integration_dir", "integration_version", "documentation", "source", "error", "unique_id", "entity_count", "device_count", "created_at", "modified_at", "disabled_by"].forEach(k => skip.add(k));
      const fields = Object.entries(item).filter(([k, v]) => !skip.has(k) && v !== null && v !== undefined && (typeof v !== "object" || Array.isArray(v)));
      const automation = ["automation", "script"].includes(item.object_type) && !this.detailLoading
        ? `<section class="panel"><div class="panelhead"><h2>${this.t("automationStructure")}</h2></div><div class="pad">${(item.object_type === "script" ? ["actions"] : ["triggers", "conditions", "actions"]).map(part => `<h4>${this.t(part)} (${item[part]?.length || 0})</h4><div class="code">${this.esc(JSON.stringify(item[part] || [], null, 2))}</div>`).join("")}</div></section>` : "";
      const cards = this.propertyCards(item);
      return `<div class="stack">${cards ? `<div class="propgrid">${cards}</div>` : `<section class="panel"><div class="panelhead"><h2>${this.t("registry")}</h2></div><div class="pad"><dl class="kv"><dt>${this.t("type")}</dt><dd>${this.t(item.object_type)}</dd>${fields.map(([k, v]) => `<dt>${this.esc(k)}</dt><dd>${this.esc(Array.isArray(v) ? v.join(", ") : v)}</dd>`).join("")}</dl></div></section>`}${automation}${this.detailLoading ? `<p class="sub">${this.t("loading")}</p>` : ""}</div>`;
    }
    return `<div class="detailgrid"><div class="stack">${this.diagnosisCard(item)}${this.impactCard(item, key)}</div><div class="stack">${this.factsCard(item, key)}</div></div>`;
  }
}

// PropertiesMixin: property cards for entity and device pages (assignment, properties, technical data, times).
class PropertiesMixin {
  propLink(key, text, sub = "") {
    const obj = this.findObject(key);
    if (!obj) return this.esc(text);
    return `<button class="link" data-object="${this.esc(key)}">${this.esc(text)}</button>${sub ? ` <small>${this.esc(sub)}</small>` : ""}`;
  }

  propChips(names) { return names.length ? `<span class="chips" style="padding:0;border:0">${names.map(n => `<span class="chip">${this.esc(n)}</span>`).join("")}</span>` : ""; }

  propTime(value) { return value ? `${this.esc(this.formatDate(value))} <small>${this.esc(this.relTime(value))}</small>` : ""; }

  propCard(title, icon, rows) {
    const shown = rows.filter(r => r && r[1] !== "" && r[1] !== null && r[1] !== undefined);
    if (!shown.length) return "";
    return `<section class="panel"><div class="panelhead"><h2><ha-icon icon="${icon}" style="--mdc-icon-size:18px;vertical-align:-3px;margin-right:6px;color:var(--hk-muted)"></ha-icon>${this.esc(title)}</h2></div><div class="pad"><dl class="kv">${shown.map(([k, v]) => `<dt>${this.esc(k)}</dt><dd>${v}</dd>`).join("")}</dl></div></section>`;
  }

  propCode(value) { return value ? `<code>${this.esc(value)}</code>` : ""; }

  propArea(areaId, deviceAreaId) {
    const name = id => this.findObject(`area:${id}`)?.name || id;
    if (areaId) return this.propLink(`area:${areaId}`, name(areaId));
    return deviceAreaId ? this.t("propAreaInherited", { area: this.esc(name(deviceAreaId)) }) : "";
  }

  propLabels(ids) { return this.propChips((ids || []).map(id => this.findObject(`label:${id}`)?.name || id)); }

  propBy(value) { return value ? this.t(`by_${value}`) : ""; }

  entityCards(item) {
    const t = k => this.t(k), device = item.device_id ? this.findObject(`device:${item.device_id}`) : null;
    const entry = item.config_entry_id ? this.findObject(`config_entry:${item.config_entry_id}`) : null;
    const integration = entry ? this.propLink(`config_entry:${entry.object_id}`, entry.integration_name || entry.name, entry.integration_name ? `(${entry.domain})` : "") : this.esc(item.platform || "");
    const deviceSub = device ? [device.manufacturer, device.model].filter(Boolean).join(" ") : "";
    const assignment = this.propCard(t("propAssignment"), "mdi:link-variant", [
      [t("propIntegration"), integration],
      [t("propDeviceOf"), device ? this.propLink(`device:${device.object_id}`, device.name, deviceSub) : ""],
      [t("propArea"), this.propArea(item.area_id, device?.area_id)],
      [t("propLabels"), this.propLabels(item.labels)],
    ]);
    const properties = this.propCard(t("propProperties"), "mdi:tune-variant", [
      [t("propDomain"), this.esc(item.object_id.split(".")[0])],
      [t("propDeviceClass"), this.esc(item.device_class || "")],
      [t("propStateClass"), this.esc(item.state_class || item.attributes?.state_class || "")],
      [t("propUnit"), this.esc(item.unit || "")],
      [t("propCategory"), item.entity_category ? this.esc(this.t(`cat_${item.entity_category}`)) : ""],
      [t("propOriginalName"), item.original_name && item.original_name !== item.name ? this.esc(item.original_name) : ""],
      [t("propAliases"), this.propChips(item.aliases || [])],
      [t("propIcon"), item.icon ? this.propCode(item.icon) : ""],
      [t("propDisabledBy"), this.esc(this.propBy(item.disabled_by))],
      [t("propHiddenBy"), this.esc(this.propBy(item.hidden_by))],
    ]);
    const technical = this.propCard(t("propTechnical"), "mdi:identifier", [
      [t("propEntityId"), this.propCode(item.object_id)], [t("propUniqueId"), this.propCode(item.unique_id)], [t("propPlatform"), this.propCode(item.platform)],
    ]);
    const times = this.propCard(t("propTimes"), "mdi:clock-outline", [
      [t("propCreated"), this.propTime(item.created_at)], [t("propModified"), this.propTime(item.modified_at)],
      [t("propLastChanged"), this.propTime(item.last_changed)], [t("propLastUpdated"), this.propTime(item.last_updated)],
    ]);
    return assignment + properties + technical + times;
  }

  deviceCards(item) {
    const t = k => this.t(k);
    const via = item.via_device_id ? this.findObject(`device:${item.via_device_id}`) : null;
    const parent = item.parent_device_id ? this.findObject(`device:${item.parent_device_id}`) : null;
    const children = this.data.objects.filter(o => o.object_type === "device" && (o.via_device_id === item.object_id || o.parent_device_id === item.object_id));
    const isChild = item.device_kind === "child";
    // The same two structural reasons that block a cleanup plan (see cleanup.py), so the page explains the block before a plan is made.
    const blocks = [isChild ? "reason_child_device" : "", children.length ? "reason_has_children" : ""].filter(Boolean).map(k => this.esc(this.t(k))).join("<br>");
    const entries = (item.config_entry_ids || []).map(id => this.findObject(`config_entry:${id}`)).filter(Boolean);
    const info = this.propCard(t("propDevice"), "mdi:devices", [
      [t("propManufacturer"), this.esc(item.manufacturer || "")],
      [t("propModel"), this.esc([item.model, item.model_id && item.model_id !== item.model ? `(${item.model_id})` : ""].filter(Boolean).join(" "))],
      [t("propSerial"), this.propCode(item.serial_number)],
      [t("propFirmware"), this.esc(item.sw_version || "")],
      [t("propHardware"), this.esc(item.hw_version || "")],
      [t("propEntryType"), item.entry_type ? this.esc(this.t(`type_${item.entry_type}`) === `type_${item.entry_type}` ? item.entry_type : this.t(`type_${item.entry_type}`)) : ""],
      [t("propUserName"), item.original_name ? this.esc(item.name) : ""],
      [t("propOriginalDeviceName"), this.esc(item.original_name || "")],
    ]);
    const assignment = this.propCard(t("propAssignment"), "mdi:link-variant", [
      [t("propIntegration"), entries.map(e => this.propLink(`config_entry:${e.object_id}`, e.integration_name || e.name, e.integration_name ? `(${e.domain})` : "")).join("<br>")],
      [t("propArea"), this.propArea(item.area_id, null)],
      [t("propKind"), isChild ? t("propKindChild") : ""],
      [t("propParent"), parent ? this.propLink(`device:${parent.object_id}`, parent.name) : ""],
      [t("propVia"), via ? this.propLink(`device:${via.object_id}`, via.name) : ""],
      [t("propChildren"), children.length ? this.t("propChildrenCount", { count: children.length }) : ""],
      [t("propCleanupBlock"), blocks],
      [t("propLabels"), this.propLabels(item.labels)],
      [t("propConfigUrl"), /^https?:\/\//i.test(item.configuration_url || "") ? `<a href="${this.esc(item.configuration_url)}" target="_blank" rel="noopener noreferrer">${this.esc(item.configuration_url)}</a>` : this.esc(item.configuration_url || "")],
    ]);
    const members = this.data.objects.filter(o => o.object_type === "entity" && o.device_id === item.object_id).sort((a, b) => a.name.localeCompare(b.name));
    const LIMIT = 25;
    const memberRows = members.slice(0, LIMIT).map(m => `<button class="row rel" data-object="entity:${this.esc(m.object_id)}">${this.tile("entity", this.tone(m.status) === "ok" ? "" : this.tone(m.status))}<span class="row-text"><strong>${this.esc(m.name)}</strong><small>${this.esc(m.object_id)}${m.state !== null && m.state !== undefined ? ` · ${this.esc(m.state)}${m.unit ? ` ${this.esc(m.unit)}` : ""}` : ""}</small></span>${this.pill(m.status)}</button>`).join("");
    const entities = `<section class="panel wide"><div class="panelhead"><h2><ha-icon icon="mdi:shape-outline" style="--mdc-icon-size:18px;vertical-align:-3px;margin-right:6px;color:var(--hk-muted)"></ha-icon>${t("propEntities")} (${members.length})</h2></div>${memberRows || `<div class="emptymsg">${t("propNoEntities")}</div>`}${members.length > LIMIT ? `<p class="factnote">${this.t("propMoreEntities", { count: members.length - LIMIT })}</p>` : ""}</section>`;
    const technical = this.propCard(t("propTechnical"), "mdi:identifier", [
      [t("propDeviceId"), this.propCode(item.object_id)],
      [t("propIdentifiers"), (item.identifiers || []).map(v => this.propCode(v)).join("<br>")],
      [t("propConnections"), (item.connections || []).map(v => this.propCode(v)).join("<br>")],
    ]);
    const times = this.propCard(t("propTimes"), "mdi:clock-outline", [[t("propCreated"), this.propTime(item.created_at)], [t("propModified"), this.propTime(item.modified_at)]]);
    return info + assignment + entities + technical + times;
  }

  propertyCards(item) {
    if (item.object_type === "entity") return this.entityCards(item);
    if (item.object_type === "device") return this.deviceCards(item);
    if (item.object_type === "config_entry") return this.integrationCard(item);
    return "";
  }
}

// MaintenanceMixin: recorder costs and the update preflight; mixed into the panel in 99-register.js.
class MaintenanceMixin {
  async loadCosts(refresh = false) {
    this.costsLoading = true; this.costsError = ""; this.render();
    try { this.costs = await this._hass.callWS({ type: "ha_housekeeper/recorder_costs", ...(refresh ? { refresh: true } : {}) }); } catch (err) { this.costs = null; this.costsError = err?.message || String(err); }
    this.costsLoading = false; this.render();
  }

  // `action` is "save" (remember the state as the starting point), "clear" (forget it) or nothing (just check).
  async loadPreflight(action) {
    this.preflightLoading = true; this.preflightError = ""; this.render();
    try {
      this.preflight = await this._hass.callWS(action ? { type: "ha_housekeeper/preflight_save", clear: action === "clear" } : { type: "ha_housekeeper/preflight" });
      if (action === "save" && this.data) this.load(false);
    } catch (err) { this.preflightError = err?.message || String(err); }
    this.preflightLoading = false; this.render();
  }

  formatBytes(bytes) {
    if (bytes === null || bytes === undefined) return this.t("recorderSizeUnknown");
    const units = ["B", "KB", "MB", "GB", "TB"];
    let value = bytes, i = 0;
    while (value >= 1024 && i < units.length - 1) { value /= 1024; i += 1; }
    return `${this.formatNumber(Math.round(value * 10) / 10)} ${units[i]}`;
  }

  // The list as the person sorted it: by the current rate (default) or by the total in the database.
  costRanking() {
    const rows = [...(this.costs?.entities || [])];
    const recent = this.costSort !== "total";
    rows.sort((a, b) => (recent ? (b.states_24h ?? 0) - (a.states_24h ?? 0) || (b.states_7d ?? 0) - (a.states_7d ?? 0) : 0) || b.states - a.states || a.entity_id.localeCompare(b.entity_id));
    return rows.slice(0, 40);
  }

  suggestedExclusions() { return (this.costs?.entities || []).filter(e => e.suggest_exclude && !e.excluded).map(e => e.entity_id); }

  // A recorder exclusion for configuration.yaml; Housekeeper never writes it.
  exclusionSnippet() { return `recorder:\n  exclude:\n    entities:\n${this.suggestedExclusions().map(id => `      - ${id}`).join("\n")}\n`; }

  recorderCard() {
    const c = this.costs;
    const head = (extra = "") => `<div class="panelhead"><div><h2>${this.t("recorderTitle")}</h2><p>${this.t("recorderHint")}</p></div><div class="actions">${extra}</div></div>`;
    if (this.costsLoading) return `<div class="panel">${head()}<div class="panel loading"><ha-icon icon="mdi:loading"></ha-icon><p>${this.t("recorderLoading")}</p></div></div>`;
    if (this.costsError) return `<div class="panel">${head(`<button class="btn" data-costs-load>${this.t("recorderReload")}</button>`)}<div class="error">${this.esc(this.costsError)}</div></div>`;
    if (!c) return `<div class="panel">${head(`<button class="btn primary" data-costs-load>${this.t("recorderLoad")}</button>`)}</div>`;
    if (!c.available) return `<div class="panel">${head()}<div class="emptymsg"><ha-icon icon="mdi:database-off-outline"></ha-icon>${this.t("recorderUnavailable")}</div></div>`;
    const took = c.took_ms === null || c.took_ms === undefined ? "" : ` · ${this.t(c.cached ? "recorderCached" : "recorderTook", { ms: this.formatNumber(c.took_ms) })}`;
    const summary = this.t("recorderSummary", { states: this.formatNumber(c.total_states), size: this.formatBytes(c.size_bytes), days: c.keep_days ?? "—", stats: this.formatNumber(c.statistics_total) }) + took;
    const sortButtons = ["recent", "total"].map(key => `<button class="btn ${this.costSort === key ? "primary" : ""}" data-cost-sort="${key}" aria-pressed="${this.costSort === key}">${this.t(key === "recent" ? "recorderSortRecent" : "recorderSortTotal")}</button>`).join("");
    const rows = this.costRanking().map(e => {
      const obj = this.findObject(`entity:${e.entity_id}`);
      const tags = [
        `<span class="pill ${e.used ? "ok" : "mute"}">${e.used ? this.t("recorderUsed", { count: e.used }) : this.t("recorderUnused")}</span>`,
        e.excluded ? `<span class="pill mute">${this.t("recorderExcluded")}</span>` : "",
        e.suggest_exclude && !e.excluded ? `<span class="pill warn">${this.t("recorderSuggest")}</span>` : "",
      ].join("");
      const inner = `<span class="tile ${e.suggest_exclude && !e.excluded ? "warn" : "mute"}"><ha-icon icon="mdi:database-clock-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(e.name)}</strong><small>${this.esc(e.entity_id)} · ${this.formatNumber(e.states)} · ${this.t("recorderWindows", { day: this.formatNumber(e.states_24h ?? 0), week: this.formatNumber(e.states_7d ?? 0), avg: this.formatNumber(e.per_day_avg ?? e.per_day) })} · ${this.t("recorderShare", { share: e.share })}</small><span class="bar" style="margin-top:4px"><i style="width:${Math.min(100, Math.round(e.share))}%"></i></span></span><span style="display:flex;gap:6px;flex-wrap:wrap">${tags}</span>`;
      return obj ? `<button class="row rel" data-object="${this.esc(`entity:${e.entity_id}`)}">${inner}</button>` : `<div class="row rel">${inner}</div>`;
    }).join("");
    const statRows = (c.statistics || []).slice(0, 10).map(s => `<div class="row rel"><span class="tile mute"><ha-icon icon="mdi:chart-line"></ha-icon></span><span class="row-text"><strong>${this.esc(s.statistic_id)}</strong><small>${this.formatNumber(s.rows)}</small></span></div>`).join("");
    const suggested = this.suggestedExclusions();
    const snippet = suggested.length ? `<div class="panel" style="margin:14px 16px"><div class="panelhead"><div><h3>${this.t("recorderSnippetTitle")}</h3><p>${this.t("recorderSnippetHint")}</p></div><button class="btn" data-copy-snippet>${this.snippetCopied ? this.t("recorderCopied") : this.t("recorderCopy")}</button></div><pre class="code">${this.esc(this.exclusionSnippet())}</pre></div>` : "";
    return `<div class="panel">${head(`${sortButtons}<button class="btn" data-costs-load data-refresh>${this.t("recorderReload")}</button>`)}<p class="factnote">${this.esc(summary)}</p>${rows}${snippet}${statRows ? `<div class="panelhead" style="border-top:1px solid var(--hk-border)"><div><h3>${this.t("recorderStats")}</h3></div></div>${statRows}` : ""}</div>`;
  }

  // One line per check; `level` decides the colour.
  preflightRows(state, checks) {
    const detail = {
      backup: () => {
        const b = state.backup || {};
        if (!b.available) return this.t("pf_backup_unavailable");
        if (!b.configured || b.newest === null) return this.t("pf_backup_none");
        return this.t(b.age_hours > 48 ? "pf_backup_old" : "pf_backup_ok", { hours: Math.round(b.age_hours) });
      },
    };
    return checks.map(c => {
      const items = { repairs: state.repairs, failed_entries: state.failed_entries, broken: state.broken }[c.check];
      const names = (items || []).slice(0, 5).map(i => i.title || i.name || i.issue_id || i.object_id).filter(Boolean).map(n => this.esc(n)).join(", ");
      const text = c.check === "backup" ? detail.backup() : c.count ? `${c.count}${names ? ` · ${names}` : ""}` : this.t("pf_count_none");
      const tone = { ok: "ok", warn: "warn", red: "red" }[c.level] || "mute";
      const icon = c.level === "ok" ? "mdi:check" : c.level === "red" ? "mdi:close-octagon-outline" : "mdi:alert-outline";
      return `<div class="row rel"><span class="tile ${tone}"><ha-icon icon="${icon}"></ha-icon></span><span class="row-text"><strong>${this.t(`pf_${c.check}`)}</strong><small>${text}</small></span></div>`;
    }).join("");
  }

  preflightAfter(after) {
    const parts = [
      ["pfNewRepairs", after.new_repairs, r => `${r.domain} · ${r.issue_id}`],
      ["pfNewFailed", after.new_failed_entries, e => `${e.title} (${e.domain})`],
      ["pfNewBroken", after.new_broken, b => b.name],
    ].filter(([, items]) => items.length);
    const inv = after.inventory || {};
    const counts = [["newObjects", inv.new_objects], ["removedObjects", inv.removed_objects], ["statusChanges", inv.status_changes], ["newFindings", inv.new_findings], ["resolvedFindings", inv.resolved_findings]].filter(([, part]) => part?.total);
    const lists = parts.map(([label, items, text]) => `<div class="row rel"><span class="tile warn"><ha-icon icon="mdi:alert-outline"></ha-icon></span><span class="row-text"><strong>${this.t(label)} (${items.length})</strong><small>${items.slice(0, 8).map(i => this.esc(text(i))).join(" · ")}</small></span></div>`).join("");
    const summary = counts.map(([label, part]) => `<div class="row rel"><span class="tile mute"><ha-icon icon="mdi:compare-horizontal"></ha-icon></span><span class="row-text"><strong>${this.t(label)}</strong></span><span class="pill mute">${this.formatNumber(part.total)}</span></div>`).join("");
    const body = lists + summary || `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("preflightAfterNone")}</div>`;
    return `<div class="panelhead" style="border-top:1px solid var(--hk-border)"><div><h3>${this.t("preflightAfterTitle", { from: this.esc(after.from_version), to: this.esc(after.to_version) })}</h3></div></div>${body}`;
  }

  preflightCard() {
    const p = this.preflight;
    const buttons = `<button class="btn" data-pf-refresh ${this.preflightLoading ? "disabled" : ""}>${this.t("preflightRefresh")}</button><button class="btn primary" data-pf-save ${this.preflightLoading ? "disabled" : ""}>${this.t("preflightSave")}</button>`;
    const head = `<div class="panelhead"><div><h2>${this.t("preflightTitle")}</h2><p>${this.t("preflightHint")}</p></div><div class="actions" style="display:flex;gap:8px;flex-wrap:wrap">${buttons}</div></div>`;
    if (this.preflightError) return `<div class="panel">${head}<div class="error">${this.esc(this.preflightError)}</div></div>`;
    if (!p) return `<div class="panel">${head}<div class="panel loading"><ha-icon icon="mdi:loading"></ha-icon><p>${this.t("preflightLoading")}</p></div></div>`;
    const updates = p.state.pending_updates || [];
    const updateRow = `<div class="row rel"><span class="tile ${updates.length ? "warn" : "ok"}"><ha-icon icon="mdi:package-up"></ha-icon></span><span class="row-text"><strong>${this.t("pf_updates")}</strong><small>${updates.length ? updates.slice(0, 6).map(u => `${this.esc(u.name)} ${this.esc(u.installed ?? "")} → ${this.esc(u.latest ?? "")}`).join(" · ") : this.t("pf_updates_none")}</small></span></div>`;
    const record = p.record
      ? `<p class="factnote">${this.t("preflightRecord", { date: this.formatDate(p.record.at), version: this.esc(p.record.ha_version), repairs: p.record.repairs, failed: p.record.failed_entries, broken: p.record.broken, objects: this.formatNumber(p.record.objects) })} <button class="btn" data-pf-clear>${this.t("preflightClear")}</button></p>`
      : `<p class="factnote">${this.t("pfNoRecord")}</p>`;
    return `<div class="panel">${head}${this.preflightRows(p.state, p.checks)}${updateRow}${record}${p.after ? this.preflightAfter(p.after) : ""}</div>`;
  }

  maintenanceView() {
    if (!this.preflight && !this.preflightLoading && !this._pfRequested) { this._pfRequested = true; setTimeout(() => this.loadPreflight(), 0); }
    this.ensureBackup();
    return `<div class="stack">${this.backupCard()}${this.preflightCard()}${this.recorderCard()}</div>`;
  }
}

// BackupMixin: the backup protection card in Maintenance; mixed into the panel in 99-register.js.
class BackupMixin {
  // `call` is the attest command or nothing (just read). Every reply is the full report.
  async loadBackup(call) {
    this.backupLoading = true; this.backupError = ""; this.render();
    try { this.backup = await this._hass.callWS(call || { type: "ha_housekeeper/backup_health" }); }
    catch (err) { this.backupError = err?.message || String(err); }
    this.backupLoading = false; this.render();
  }

  // Loads once, and again after every new scan, so the overview and Maintenance never show an old report.
  ensureBackup() {
    const key = this.data?.meta?.scanned_at || "";
    if (this.backupLoading || (this._bhKey === key && this._bhRequested)) return;
    this._bhRequested = true; this._bhKey = key;
    setTimeout(() => this.loadBackup(), 0);
  }

  bhAge(hours) { return hours >= 48 ? this.t("bhAgeDays", { n: Math.round(hours / 24) }) : this.t("bhAgeHours", { n: Math.max(1, Math.round(hours)) }); }

  bhDay(iso) {
    if (!iso) return "—";
    try { return new Intl.DateTimeFormat(this.lang, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(iso)); } catch (_) { return iso; }
  }

  bhList(items) { return items?.length ? items.map(i => this.esc(i)).join(", ") : this.t("bhNone"); }

  // The sentence for one check; the backend sends numbers and ids only.
  bhText(c) {
    const v = c.values || {}, t = (k, vars) => this.t(k, vars);
    switch (c.id) {
      case "setup":
        if (c.level === "problem") return t("bhSetupProblem");
        if (c.level === "note") return t("bhSetupNote");
        return t("bhSetupOk", { agents: this.bhList(v.agents), recurrence: t(`bhRec_${v.recurrence}`) });
      case "newest":
        return v.age_hours === null || v.age_hours === undefined ? t("bhNewestNone") : t("bhNewestText", { age: this.bhAge(v.age_hours), limit: this.bhAge(v.limit_hours) });
      case "last_run": {
        if (c.level === "unknown") return t("bhRunUnknown");
        const parts = [];
        if (v.failed_attempt) parts.push(t("bhRunFailed", { attempted: this.formatDate(v.attempted), completed: v.completed ? this.formatDate(v.completed) : t("bhNever") }));
        if (v.failed_agents?.length) parts.push(t("bhRunAgents", { agents: this.bhList(v.failed_agents) }));
        return parts.length ? parts.join(" ") : t("bhRunOk", { completed: this.formatDate(v.completed) });
      }
      case "targets":
        return c.level === "ok" ? t("bhTargetsOk", { local: this.bhList(v.local), remote: this.bhList(v.remote) }) : c.level === "note" ? t("bhTargetsNote", { local: this.bhList(v.local) }) : "";
      case "size":
        if (c.level === "unknown") return t("bhSizeUnknown");
        return t(c.level === "ok" ? "bhSizeOk" : "bhSizeNote", { size: this.formatBytes(v.size), expected: this.formatBytes(v.expected), percent: Math.round(v.ratio * 100) });
      case "retention": {
        if (c.level === "note") return t("bhRetentionNote", { count: v.count });
        const limit = [v.copies !== null && v.copies !== undefined ? t("bhRetCopies", { n: v.copies }) : "", v.days !== null && v.days !== undefined ? t("bhRetDays", { n: v.days }) : ""].filter(Boolean).join(" · ");
        return t("bhRetentionOk", { limit, count: v.count, oldest: v.oldest_days === null ? "—" : Math.round(v.oldest_days) });
      }
      case "encryption":
        if (c.level === "ok") return t("bhEncOk");
        return t(v.configured ? "bhEncNotProtected" : "bhEncNoPassword");
      case "emergency_kit":
        return v.at ? t("bhKitOk", { date: this.bhDay(v.at) }) : t("bhKitNone");
      case "restore_test":
        if (!v.at) return t("bhRestoreNone");
        return t(c.level === "ok" ? "bhRestoreOk" : "bhRestoreOld", { date: this.bhDay(v.at), days: v.age_days, limit: 180 });
      case "plan_backups":
        return c.level === "ok" ? t("bhPlansOk", v) : t("bhPlansNote", v);
      default:
        return "";
    }
  }

  bhRow(c) {
    const tone = { ok: "ok", note: "warn", problem: "red", unknown: "mute" }[c.level] || "mute";
    const icon = { ok: "mdi:check", note: "mdi:alert-outline", problem: "mdi:close-octagon-outline", unknown: "mdi:help-circle-outline" }[c.level] || "mdi:help-circle-outline";
    const row = `<div class="row rel bh"><span class="tile ${tone}"><ha-icon icon="${icon}"></ha-icon></span><span class="row-text"><strong>${this.t(`bh_${c.id}`)}</strong><small>${this.bhText(c)}</small></span><span class="pill ${tone}">${this.t(`bhLevel_${c.level}`)}</span></div>`;
    if (c.id !== "emergency_kit" && c.id !== "restore_test") return row;
    const today = new Date().toISOString().slice(0, 10);
    const clear = c.values?.at ? `<button class="btn" data-bh-clear="${c.id}">${this.t("bhAttestClear")}</button>` : "";
    return `${row}<div class="pad bhattest"><label>${this.t("bhAttestDate")} <input type="date" data-bh-date="${c.id}" value="${today}" max="${today}"></label><button class="btn" data-bh-save="${c.id}">${this.t("bhAttestSave")}</button>${clear}</div>`;
  }

  bhBackups(list) {
    if (!list?.length) return "";
    const rows = list.map(b => `<tr><td>${this.formatDate(b.date)}</td><td>${this.formatBytes(b.size)}</td><td>${this.bhList(b.agents)}</td><td>${this.t(b.protected ? "bhYes" : "bhNo")}</td></tr>`).join("");
    return `<div class="sectionlabel">${this.t("bhListTitle")}</div><div class="tablewrap"><table><thead><tr><th>${this.t("bhColDate")}</th><th>${this.t("bhColSize")}</th><th>${this.t("bhColTargets")}</th><th>${this.t("bhColProtected")}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  backupCard() {
    const head = `<div class="panelhead"><div><h2>${this.t("backupTitle")}</h2><p>${this.t("backupHint")}</p></div><div class="actions"><button class="btn" data-bh-refresh ${this.backupLoading ? "disabled" : ""}>${this.t("backupRefresh")}</button></div></div>`;
    if (this.backupError) return `<div class="panel">${head}<div class="error">${this.esc(this.backupError)}</div></div>`;
    const b = this.backup;
    if (!b) return `<div class="panel">${head}<div class="loading"><ha-icon icon="mdi:loading"></ha-icon><p>${this.t("backupLoading")}</p></div></div>`;
    if (!b.available) return `<div class="panel">${head}<div class="emptymsg">${this.t("backupUnavailable")}</div></div>`;
    const guide = `<details class="bhguide"><summary>${this.t("bhGuideTitle")}</summary><p class="factnote">${this.t("bhGuideSteps")}</p></details>`;
    return `<div class="panel">${head}${b.checks.map(c => this.bhRow(c)).join("")}${this.bhBackups(b.backups)}${guide}</div>`;
  }
}

// ReliabilityMixin: the reliability view; mixed into the panel in 99-register.js.
class ReliabilityMixin {
  async loadReliability(refresh = false) {
    this.relLoading = true; this.relError = ""; this.render();
    try { this.reliability = await this._hass.callWS({ type: "ha_housekeeper/reliability", window_days: this.relWindow, refresh }); }
    catch (err) { this.relError = err?.message || String(err); }
    this.relLoading = false; this.render();
  }

  // The first visit and every change of the window load once; the backend keeps the result for a few minutes.
  ensureReliability() {
    if (this.relLoading || this._relRequested === this.relWindow) return;
    this._relRequested = this.relWindow;
    setTimeout(() => this.loadReliability(), 0);
  }

  relDuration(seconds) {
    if (seconds >= 86400) return this.t("relDays", { n: Math.round(seconds / 86400) });
    if (seconds >= 7200) return this.t("relHours", { n: Math.round(seconds / 3600) });
    return this.t("relMinutes", { n: Math.max(1, Math.round(seconds / 60)) });
  }

  relRow(item) {
    const percent = item.availability;
    const tone = percent === null ? "mute" : percent >= 99.5 ? "ok" : percent >= 95 ? "warn" : "red";
    const lines = [`${this.esc(item.domain || "")} · ${this.t("relEntities", { n: item.entities })}${item.permanent ? ` · ${this.t("relPermanent", { n: item.permanent })}` : ""}`];
    if (item.shared_outages) {
      const layer = item.layer === "cloud" ? this.t("relLayerCloud") : this.t("relLayerLocal");
      lines.push(`${this.t(item.shared_outages === 1 ? "relSharedOne" : "relShared", { n: item.shared_outages, longest: this.relDuration(item.longest_outage) })} · ${layer}`);
    }
    const flags = [];
    if (item.reauth) flags.push(`<span class="pill red">${this.t("relReauth")}</span>`);
    if (item.state && item.state !== "loaded") flags.push(`<span class="pill warn">${this.esc(item.state)}</span>`);
    lines.push(item.last_disruption
      ? this.t(item.last_disruption.shared ? "relLastShared" : "relLastSingle", { date: this.formatDate(new Date(item.last_disruption.end * 1000).toISOString()), duration: this.relDuration(item.last_disruption.seconds) })
      : this.t("relNoDisruption"));
    return `<div class="row"><span class="tile ${tone}"><ha-icon icon="mdi:lan-connect"></ha-icon></span><span class="row-text"><strong>${this.esc(item.title)}</strong>${lines.map(line => `<small>${line}</small>`).join("")}${flags.length ? `<span class="relflags">${flags.join(" ")}</span>` : ""}</span><span class="pill ${tone}">${percent === null ? "—" : `${this.formatNumber(percent)} %`}</span></div>`;
  }

  reliabilityView() {
    this.ensureReliability();
    const r = this.reliability;
    const windows = [[1, "relWindow1"], [7, "relWindow7"]].map(([days, key]) => `<button class="chip ${this.relWindow === days ? "active" : ""}" data-rel-window="${days}" aria-pressed="${this.relWindow === days}">${this.t(key)}</button>`).join("");
    const took = r && r.took_ms !== null && r.took_ms !== undefined && r.available ? ` · ${this.t(r.cached ? "relCached" : "relTook", { s: this.formatNumber(Math.round(r.took_ms / 100) / 10) })}` : "";
    const head = `<div class="panelhead"><div><h2>${this.t("relTitle")}</h2><p>${this.t("relHint")}${took}</p></div><div class="actions" style="display:flex;gap:8px;flex-wrap:wrap">${windows}<button class="btn" data-rel-refresh ${this.relLoading ? "disabled" : ""}>${this.t("relRefresh")}</button></div></div>`;
    if (this.relError) return `<div class="panel">${head}<div class="error">${this.esc(this.relError)}</div></div>`;
    if (!r) return `<div class="panel">${head}<div class="panel loading"><ha-icon icon="mdi:loading"></ha-icon><p>${this.t("relLoading")}</p></div></div>`;
    if (!r.available) return `<div class="panel">${head}<p class="factnote">${this.t("relNoRecorder")}</p></div>`;
    if (r.busy) return `<div class="panel">${head}<p class="factnote">${this.t("relBusy")}</p></div>`;
    if (!r.entries.length) return `<div class="panel">${head}<div class="emptymsg">${this.t("relEmpty")}</div></div>`;
    const loading = this.relLoading ? `<p class="factnote">${this.t("relLoading")}</p>` : "";
    const pg = this.paginate("relentries", r.entries);
    return `<div class="stack"><div class="panel">${head}${loading}${pg.rows.map(item => this.relRow(item)).join("")}${pg.footer}<p class="factnote">${this.t("relFootnote", { days: r.window_days })}</p></div>${this.unstableCard(r)}</div>`;
  }

  unstableRow(item, days) {
    const tone = item.level === "flapping" ? "red" : "warn";
    const lines = [`${this.esc(item.entity_id)}${item.entry_title ? ` · ${this.esc(item.entry_title)}` : ""}`,
      this.t("relEpisodes", { n: item.episodes, days, rate: this.formatNumber(item.per_day), total: this.relDuration(item.total_seconds), mean: this.relDuration(item.mean_seconds) })];
    if (item.pattern_hour !== null && item.pattern_hour !== undefined) lines.push(this.t("relPattern", { from: String(item.pattern_hour).padStart(2, "0"), to: String((item.pattern_hour + 2) % 24).padStart(2, "0") }));
    if (item.used) lines.push(this.t("relFollowers", { n: item.used }));
    return `<button class="row" data-object="entity:${this.esc(item.entity_id)}"><span class="tile ${tone}"><ha-icon icon="mdi:swap-vertical"></ha-icon></span><span class="row-text"><strong>${this.esc(item.name)}</strong>${lines.map(line => `<small>${line}</small>`).join("")}</span><span class="pill ${tone}">${this.t(item.level === "flapping" ? "relFlapping" : "relUnstable")}</span></button>`;
  }

  unstableCard(r) {
    const u = r.unstable;
    if (!u) return "";
    const head = `<div class="panelhead"><div><h2>${this.t("relUnstableTitle")}</h2><p>${this.t("relUnstableHint")}</p></div></div>`;
    if (!u.items.length) return `<div class="panel">${head}<div class="emptymsg">${this.t("relUnstableNone")}</div></div>`;
    const more = u.total > u.items.length ? `<p class="factnote">${this.t("relUnstableMore", { shown: u.items.length, total: u.total })}</p>` : "";
    const pg = this.paginate("relunstable", u.items);
    return `<div class="panel">${head}${pg.rows.map(item => this.unstableRow(item, r.window_days)).join("")}${pg.footer}${more}<p class="factnote">${this.t("relUnstableFootnote")}</p></div>`;
  }
}

// RunsMixin: the automation runs view; mixed into the panel in 99-register.js.
const RUN_FINDINGS = {
  failing: ["rfLabelFailing", "rfFailing"], overlap: ["rfLabelOverlap", "rfOverlap"], never_ok: ["rfLabelNeverOk", "rfNeverOk"],
  no_effect: ["rfLabelNoEffect", "rfNoEffect"], burst: ["rfLabelBurst", "rfBurst"], long_run: ["rfLabelLongRun", "rfLongRun"],
  after_update: ["rfLabelAfterUpdate", "rfAfterUpdate"], long_wait: ["rfLabelLongWait", "rfLongWait"],
  wait_no_timeout: ["rfLabelWaitNoTimeout", "rfWaitNoTimeout"], continue_on_error: ["rfLabelContinue", "rfContinue"],
};

class RunsMixin {
  async loadRuns() {
    this.runsLoading = true; this.runsError = ""; this.render();
    try { this.runs = await this._hass.callWS({ type: "ha_housekeeper/automation_runs" }); }
    catch (err) { this.runsError = err?.message || String(err); }
    this.runsLoading = false; this.render();
  }

  // Loaded once per visit; the button counts again.
  ensureRuns() {
    if (this.runsLoading || this._runsRequested) return;
    this._runsRequested = true;
    setTimeout(() => this.loadRuns(), 0);
  }

  runsDuration(ms) {
    if (ms === null || ms === undefined) return "—";
    if (ms < 1000) return this.t("runsMs", { n: ms });
    if (ms < 60000) return this.t("runsSec", { n: this.formatNumber(Math.round(ms / 100) / 10) });
    return this.relDuration(ms / 1000);
  }

  runFindingText(f) {
    const p = {
      failing: () => this.t("rfFailing", { errors: f.errors, runs: f.runs }) + (f.step ? this.t("rfFailingStep", { step: this.esc(f.step), count: f.step_count }) : ""),
      overlap: () => this.t("rfOverlap", { n: f.already + f.maxed, mode: this.esc(f.mode || "—") }),
      never_ok: () => this.t("rfNeverOk", { runs: f.runs }),
      no_effect: () => this.t("rfNoEffect", { conditions: f.conditions, runs: f.runs }),
      burst: () => this.t("rfBurst", { perDay: this.formatNumber(f.per_day), normal: this.formatNumber(f.normal) }),
      long_run: () => this.t("rfLongRun", { longest: this.runsDuration(f.longest_ms), normal: this.runsDuration(f.normal_ms) }),
      after_update: () => this.t("rfAfterUpdate", { after: f.rate_after, before: f.rate_before, what: this.esc(f.event === "ha_version" ? this.t("rfWhatHa", { to: f.to || "" }) : this.t("rfWhatEntry", { domain: f.domain || "", to: f.to || "" })) }),
      long_wait: () => this.t("rfLongWait", { duration: this.relDuration(f.seconds) }),
      wait_no_timeout: () => this.t("rfWaitNoTimeout", { n: f.count }),
      continue_on_error: () => this.t("rfContinue", { n: f.count }),
    }[f.kind];
    return p ? p() : "";
  }

  runsFindingLines(row) {
    return row.findings.map(f => `<small><span class="pill ${f.level === "info" ? "mute" : f.level}">${this.t((RUN_FINDINGS[f.kind] || ["rfLabelFailing"])[0])}</span> ${this.runFindingText(f)}</small>`).join("");
  }

  runsAttentionRow(row) {
    const tone = row.findings.some(f => f.level === "red") ? "red" : row.findings.some(f => f.level === "warn") ? "warn" : "mute";
    const counts = `${this.t("runsColRuns")}: ${this.formatNumber(row.runs)}${row.lower_bound ? ` (${this.t("runsLowerBound")})` : ""}`;
    return `<button class="row" data-object="${this.esc(`${row.object_type}:${row.entity_id}`)}"><span class="tile ${tone}"><ha-icon icon="${row.object_type === "script" ? "mdi:script-text-outline" : "mdi:robot-outline"}"></ha-icon></span><span class="row-text"><strong>${this.esc(row.name)}</strong><small>${this.esc(row.entity_id)} · ${counts}</small>${this.runsFindingLines(row)}</span></button>`;
  }

  runsTrend(row) {
    const max = Math.max(1, ...row.per_day);
    const bars = row.per_day.map(n => `<i style="height:${Math.round((n / max) * 100)}%"></i>`).join("");
    return `<span class="spark" role="img" aria-label="${this.esc(this.t("runsTrendLabel", { values: row.per_day.join(", ") }))}">${bars}</span>`;
  }

  runsTable(rows) {
    const pg = this.paginate("runsall", rows);
    const body = pg.rows.map(row => `<tr data-object="${this.esc(`${row.object_type}:${row.entity_id}`)}" tabindex="0" role="button" aria-label="${this.esc(row.name)}"><td><strong>${this.esc(row.name)}</strong><span class="id">${this.esc(row.entity_id)}</span></td><td data-label="${this.esc(this.t("runsColRuns"))}">${this.formatNumber(row.runs)}${row.lower_bound ? "+" : ""}</td><td data-label="${this.esc(this.t("runsColErrors"))}">${this.formatNumber(row.errors)}</td><td data-label="${this.esc(this.t("runsColConditions"))}">${this.formatNumber(row.conditions)}</td><td data-label="${this.esc(this.t("runsColDuration"))}">${this.runsDuration(row.mean_ms)} / ${this.runsDuration(row.max_ms)}</td><td data-label="${this.esc(this.t("runsColTrend"))}">${this.runsTrend(row)}</td></tr>`).join("");
    return `<div class="tablewrap"><table><thead><tr><th>${this.t("runsColName")}</th><th>${this.t("runsColRuns")}</th><th>${this.t("runsColErrors")}</th><th>${this.t("runsColConditions")}</th><th>${this.t("runsColDuration")}</th><th>${this.t("runsColTrend")}</th></tr></thead><tbody>${body}</tbody></table></div>${pg.footer}`;
  }

  // The numbers of one automation or script for its detail page; only when runs were counted for it.
  runsRow(item) {
    if (!["automation", "script"].includes(item.object_type)) return null;
    return (this.runs?.items || []).find(row => row.entity_id === item.object_id && (row.runs || row.findings.length)) || null;
  }

  runsDetailCard(row) {
    const since = this.runs?.since ? this.t("runsTabHint", { date: this.formatDate(this.runs.since) }) : "";
    const facts = [["runsColRuns", `${this.formatNumber(row.runs)}${row.lower_bound ? "+" : ""}`], ["runsColErrors", this.formatNumber(row.errors)], ["runsColConditions", this.formatNumber(row.conditions)], ["runsColDuration", `${this.runsDuration(row.mean_ms)} / ${this.runsDuration(row.max_ms)}`]]
      .map(([label, value]) => `<dt>${this.t(label)}</dt><dd>${value}</dd>`).join("");
    const notes = row.findings.length ? `<div class="pad">${this.runsFindingLines(row)}</div>` : "";
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("runsTab")}</h2><p>${since}</p></div></div><div class="pad"><dl class="kv">${facts}<dt>${this.t("runsColTrend")}</dt><dd>${this.runsTrend(row)}</dd></dl></div>${notes}<p class="factnote">${this.t("runsFootnote")}</p></section>`;
  }

  runsView() {
    this.ensureRuns();
    const r = this.runs;
    const since = r?.since ? ` · ${this.t("runsSince", { date: this.formatDate(r.since) })}` : "";
    const head = `<div class="panelhead"><div><h2>${this.t("runsTitle")}</h2><p>${this.t("runsHint")}${since}</p></div><div class="actions"><button class="btn" data-runs-refresh ${this.runsLoading ? "disabled" : ""}>${this.t("runsRefresh")}</button></div></div>`;
    if (this.runsError) return `<div class="panel">${head}<div class="error">${this.esc(this.runsError)}</div></div>`;
    if (!r) return `<div class="panel">${head}<div class="panel loading"><ha-icon icon="mdi:loading"></ha-icon><p>${this.t("runsLoading")}</p></div></div>`;
    const flagged = r.items.filter(row => row.findings.length);
    const counted = r.items.filter(row => row.runs);
    const flaggedPage = this.paginate("runsflag", flagged);
    const attention = flagged.length ? flaggedPage.rows.map(row => this.runsAttentionRow(row)).join("") + flaggedPage.footer : `<div class="emptymsg">${this.t(counted.length ? "runsNone" : "runsNoData")}</div>`;
    const more = r.total > r.items.length ? `<p class="factnote">${this.t("runsMore", { shown: r.items.length, total: r.total })}</p>` : "";
    const all = counted.length ? `<div class="panel"><div class="panelhead"><div><h2>${this.t("runsAll")}</h2></div></div>${this.runsTable(counted)}${more}<p class="factnote">${this.t("runsFootnote")}</p></div>` : "";
    return `<div class="stack"><div class="panel">${head}${attention}</div>${all}</div>`;
  }
}

class HAHousekeeperPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this.data = null;
    this.view = "overview";
    this.query = "";
    this.typeFilter = "";
    this.statusFilter = "";
    this.findingFilter = "";
    this.showIgnored = false;
    this.batteryFilter = "low";

    this._urlApplied = false;
    this.sort = "name";
    this.selected = null;
    this.detailTab = "overview";
    this.trail = [];
    this.compare = null;
    this.compareBaseline = "previous";
    this.compareLoading = false;
    this.graphSelected = null;
    this.details = new Map();
    this.detailLoading = false;
    this.graphQuery = "";
    this.graphDepth = 1; this.graphRel = ""; this.graphConf = "all"; this.graphImpact = false; this.graphLimit = GRAPH_NODE_STEP;
    this.pages = {};
    this.lv = {};
    this.unrefTab = "entities";
    this.cleanupSel = new Set();
    this.cleanupKind = "disable_entity";
    this.replOld = ""; this.replNew = "";
    this.meterOld = ""; this.meterNew = ""; this.meterMode = "both";
    this.runs = null; this.runsLoading = false; this.runsError = ""; this.reliability = null; this.relLoading = false; this.relError = ""; this.relWindow = 7; this.backup = null; this.backupLoading = false; this.backupError = ""; this.preflight = null; this.costs = null; this.costSort = "recent"; this.costsLoading = false; this.preflightLoading = false;
    this.ack = new Set();
    this.confirmation = null;
    this.confirmWord = "";
    this.plan = null;
    this.journal = null;
    this.prefs = this.loadPrefs();
    this.pageSize = this.prefs.pageSize;
    this.sortDir = "asc";
    this.pages = {};
    this.busy = false;
    this.scanStatus = null;
    this.error = null;
    this.trend = null;
    this._rev = 0; // bumped when data is changed in place (ignore flags), so cached lists are rebuilt
    this._debug = this.debugEnabled();
  }

  set hass(value) {
    const first = !this._hass, wasDark = this._hass?.themes?.darkMode;
    this._hass = value;
    if (first) { this.load(false); this.loadUserPrefs(); }
    else if (this.prefs.mode === "auto" && wasDark !== value?.themes?.darkMode) this.render();
  }

  get hass() { return this._hass; }

  connectedCallback() {
    this._basePath = typeof window === "undefined" ? null : window.location.pathname;
    this.installFonts();
    this.render();
  }

  installFonts() {
    const head = globalThis.document?.head;
    if (!head || globalThis.document.getElementById("hk-fonts")) return;
    const style = globalThis.document.createElement("style");
    style.id = "hk-fonts"; style.textContent = FONT_CSS;
    head.appendChild(style);
  }

  get lang() { return String(this._hass?.language || "en").toLowerCase().startsWith("de") ? "de" : "en"; }

  t(key, vars) {
    const text = TEXT[this.lang][key] || TEXT.en[key] || key;
    return vars ? text.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "") : text;
  }

  esc(value) {
    return String(value ?? "—").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  }

  formatDate(value) {
    if (!value) return "—";
    try { return new Intl.DateTimeFormat(this.lang, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
    catch (_) { return value; }
  }

  formatNumber(value) { return new Intl.NumberFormat(this.lang).format(value ?? 0); }

  async load(fresh = false) {
    if (!this._hass || this.busy) return;
    if (this._warmupTimer) window.clearTimeout(this._warmupTimer);
    this.busy = true; this.error = null; this.render();
    let progressTimer = null;
    if (fresh) progressTimer = window.setInterval(() => this.updateScanStatus(), 250);
    try {
      this.data = await this._hass.callWS({ type: fresh ? "ha_housekeeper/scan" : "ha_housekeeper/inventory" });
      this.details = new Map();
      this.compare = null;
      this.applyUrl();
    } catch (err) {
      this.error = err?.message || String(err);
    } finally {
      if (progressTimer) window.clearInterval(progressTimer);
      this.scanStatus = null;
      this.busy = false; this.render();
    }
    if (this.view === "changes" && this.data) this.loadCompare();
    // Preliminary data: fetch the final scan once the backend's warm-up is over.
    if (this.data?.meta?.preliminary) {
      const wait = ((Number(this.data.meta.warmup_seconds_left) || 0) + 20) * 1000;
      this._warmupTimer = window.setTimeout(() => this.load(), wait);
    }
  }

  async updateScanStatus() {
    try {
      this.scanStatus = await this._hass.callWS({ type: "ha_housekeeper/status" });
      this.renderProgress();
    } catch (_) { /* The main scan request reports actionable errors. */ }
  }

  async openObject(obj) {
    if (this.selected && this.selected !== obj) this.trail.push(this.selected);
    if (this.selected !== obj) { this.detailTab = this._pendingTab || "overview"; this._pendingTab = null; }
    this.selected = obj;
    const key = this.objectKey(obj);
    if (this.details.has(key)) { this.render(); this.scrollIntoView?.({ block: "start" }); return; }
    this.detailLoading = true;
    this.render();
    this.scrollIntoView?.({ block: "start" });
    try {
      this.details.set(key, await this._hass.callWS({
        type: "ha_housekeeper/detail", object_type: obj.object_type, object_id: obj.object_id,
      }));
    } catch (_) { this.details.set(key, {}); }
    this.detailLoading = false;
    if (this.selected === obj) this.render();
  }

  goBack() { this.selected = this.trail.pop() || null; this.detailTab = "overview"; this.render(); }

  statusLabel(status) { return this.t(status); }

  objectKey(item) { return `${item.object_type}:${item.object_id}`; }

  findObject(key) {
    if (!this.data) return undefined;
    if (!this._index || this._indexSource !== this.data) {
      this._index = new Map(this.data.objects.map(item => [this.objectKey(item), item]));
      this._indexSource = this.data;
    }
    return this._index.get(key);
  }

  findingKey(finding) { return `${finding.rule_id.split(".")[0]}:${finding.object_id}`; }

  haPath(item) {
    switch (item.object_type) {
      case "entity": return `/config/entities?search=${encodeURIComponent(item.object_id)}`;
      case "device": return `/config/devices/device/${encodeURIComponent(item.object_id)}`;
      case "area": return `/config/areas/area/${encodeURIComponent(item.object_id)}`;
      case "automation": return item.automation_id
        ? `/config/automation/edit/${encodeURIComponent(item.automation_id)}`
        : `/config/entities?search=${encodeURIComponent(item.object_id)}`;
      case "script": return `/config/script/edit/${encodeURIComponent(item.object_id.replace(/^script\./, ""))}`;
      case "scene": return item.scene_id
        ? `/config/scene/edit/${encodeURIComponent(item.scene_id)}`
        : `/config/entities?search=${encodeURIComponent(item.object_id)}`;
      case "dashboard": return `/${encodeURIComponent(item.url_path || "lovelace")}`;
      case "config_entry": return `/config/integrations/integration/${encodeURIComponent(item.domain)}`;
      case "floor": return "/config/areas/dashboard";
      case "label": return "/config/labels";
      default: return null;
    }
  }

  navigateHA(path) {
    window.history.pushState(null, "", path);
    window.dispatchEvent(new CustomEvent("location-changed"));
  }

  // What a screen reader announces: scan, backup and plan progress, nothing while idle.
  liveStatus() {
    if (this.busy) return `${this.t("scanning")}${this.scanStatus?.running ? ` ${this.scanStatus.progress}%` : ""}`;
    const plan = this.plan;
    if (plan && (plan.status === "backup" || plan.status === "running")) {
      if (plan.status === "backup" || this.planProgress?.phase === "backup") return this.t("backupRunning");
      return `${this.t("running")} ${this.planProgress ? this.t("progressOf", { done: this.planProgress.done, total: this.planProgress.total }) : ""}`.trim();
    }
    return "";
  }

  // The sidebar is rebuilt with the page: keep its scroll position, and bring the current entry into
  // view when the view changed (on a small screen the navigation scrolls sideways).
  scanButtonInner() {
    const progress = this.scanStatus?.running ? ` ${this.scanStatus.progress}%` : "";
    return `<ha-icon icon="mdi:refresh"></ha-icon>${this.busy ? this.t("scanning") + progress : this.t("scan")}`;
  }

  // The scan status arrives every few hundred milliseconds: only the scan button and the status
  // line for screen readers change, so the page is not rebuilt for it.
  renderProgress() {
    const root = this.shadowRoot, button = root?.querySelector?.("[data-action='scan']");
    const live = root?.querySelector?.("[role='status']");
    if (!button || !live) { this.render(); return; }
    button.innerHTML = this.scanButtonInner();
    button.disabled = Boolean(this.busy || this.cleanupRunning());
    live.textContent = this.liveStatus();
  }

  // Search fields change their state at once but re-render after a short pause.
  scheduleRender() {
    if (this._searchTimer) globalThis.clearTimeout?.(this._searchTimer);
    this._searchTimer = this.defer(() => { this._searchTimer = null; this.render(); }, SEARCH_DEBOUNCE_MS);
  }

  defer(fn, ms) { return setTimeout(fn, ms); }

  debugEnabled() {
    try { return globalThis.localStorage?.getItem("hk_debug") === "1"; } catch (_) { return false; }
  }

  // A re-render replaces the page, so the focused control is found again by id or data attribute.
  captureFocus() {
    const el = this.shadowRoot?.activeElement;
    if (!el?.getAttribute) return null;
    let selector = null;
    if (el.id) selector = `#${el.id}`;
    else {
      for (const attr of el.attributes || []) {
        if (attr.name.startsWith("data-")) { selector = `${el.localName}[${attr.name}="${String(attr.value).replace(/["\\]/g, "\\$&")}"]`; break; }
      }
    }
    return selector ? { selector, start: el.selectionStart ?? null, end: el.selectionEnd ?? null } : null;
  }

  restoreFocus(saved) {
    if (!saved) return;
    let next = null;
    try { next = this.shadowRoot.querySelector(saved.selector); } catch (_) { return; }
    if (!next || next.disabled) return;
    next.focus({ preventScroll: true });
    if (saved.start !== null && next.setSelectionRange) {
      try { next.setSelectionRange(saved.start, saved.end); } catch (_) { /* not a text field */ }
    }
  }

  // Derived data is kept per data set; it is rebuilt when the data, a change in place or one of the
  // given values changes.
  memo(name, deps, build) {
    const cache = this._memo ||= new Map(), hit = cache.get(name);
    if (hit && hit.data === this.data && hit.rev === this._rev && hit.deps.length === deps.length && hit.deps.every((d, i) => d === deps[i])) return hit.value;
    const value = build();
    cache.set(name, { data: this.data, rev: this._rev, deps, value });
    return value;
  }

  // Collators are created once per language; creating one per comparison is slow.
  collators() {
    if (this._collators?.lang !== this.lang) {
      this._collators = { lang: this.lang, natural: new Intl.Collator(this.lang, { numeric: true, sensitivity: "base" }), ids: new Intl.Collator(this.lang, { numeric: true }), plain: new Intl.Collator() };
    }
    return this._collators;
  }

  // Edges by source and by target, plus every target that something uses (in edge order).
  edgeIndex() {
    return this.memo("edges", [], () => {
      const bySource = new Map(), byTarget = new Map(), used = new Set(), order = new Map();
      (this.data.edges || []).forEach((edge, i) => {
        order.set(edge, i);
        (bySource.get(edge.source) || bySource.set(edge.source, []).get(edge.source)).push(edge);
        (byTarget.get(edge.target) || byTarget.set(edge.target, []).get(edge.target)).push(edge);
        if (USAGE_RELATIONS.includes(edge.relation)) used.add(edge.target);
      });
      return { bySource, byTarget, used, order };
    });
  }

  edgesFrom(key) { return this.edgeIndex().bySource.get(key) || []; }

  edgesTo(key) { return this.edgeIndex().byTarget.get(key) || []; }

  render() {
    if (!this.shadowRoot) return;
    if (this._searchTimer) { globalThis.clearTimeout?.(this._searchTimer); this._searchTimer = null; }
    const started = this._debug ? globalThis.performance?.now?.() : null;
    const focus = this.captureFocus();
    const shell = `<div class="shell">${this.topbar()}<main class="main">${this.selected && this.data ? this.detail() : `${this.heading()}${this.content()}`}</main><div class="sr-only" role="status" aria-live="polite">${this.esc(this.liveStatus())}</div></div>`;
    // The style sheet is only parsed again when the theme changed; otherwise just the page is replaced.
    const root = this.shadowRoot, css = this.themeCss(), current = root.querySelector?.(".shell");
    if (current && this._styleKey === css && root.querySelector("style[data-hk]")) current.outerHTML = shell;
    else { root.innerHTML = `${this.styles()}${shell}`; this._styleKey = css; }
    this.restoreFocus(focus);
    this.bind();
    if (started !== null) console.debug(`[ha_housekeeper] render ${this.selected ? "detail" : this.view}: ${(globalThis.performance.now() - started).toFixed(1)} ms`);
    if (this.data) this.syncUrl();
  }

  // Deep links: /ha-housekeeper?view=findingsNav&filter=orphaned or ?object=entity:sensor.x
  applyUrl() {
    if (this._urlApplied || typeof window === "undefined" || !this.data) return;
    this._urlApplied = true;
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");
    if (view && NAV.some(([name]) => name === view)) this.view = view;
    else if (!params.get("object") && this.prefs.startView !== "overview") this.view = this.prefs.startView;
    if (params.get("filter")) this.findingFilter = params.get("filter");
    this._pendingTab = params.get("tab");
    const obj = this.findObject(params.get("object") || "");
    if (obj) this.openObject(obj);
    else if (this.view === "changes" && !this.compare) this.loadCompare();
  }

  syncUrl() {
    if (typeof window === "undefined" || !this.isConnected || !window.history?.replaceState) return;
    if (window.location.pathname !== this._basePath) return; // HA already navigated elsewhere
    const params = new URLSearchParams();
    if (this.selected) {
      params.set("object", this.objectKey(this.selected));
      if (this.detailTab !== "overview") params.set("tab", this.detailTab);
    }
    else {
      if (this.view !== "overview") params.set("view", this.view);
      if (this.view === "findingsNav" && this.findingFilter) params.set("filter", this.findingFilter);
    }
    const query = params.toString();
    try { window.history.replaceState(window.history.state, "", window.location.pathname + (query ? `?${query}` : "")); } catch (_) { /* ignore */ }
  }

  topbar() {
    const counts = this.data ? { inventory: this.formatNumber(this.data.meta.object_count), findingsNav: this.data.findings.filter(f => !f.ignored).length, batteries: this.lowBatteries().length || undefined } : {};
    const item = view => `<button class="nav ${this.view === view ? "active" : ""}" data-view="${view}" ${this.view === view ? 'aria-current="page"' : ""}><ha-icon icon="${NAV_ICONS[view]}"></ha-icon><span>${this.t(view)}</span>${counts[view] !== undefined ? `<em>${counts[view]}</em>` : ""}</button>`;
    const [direct, ...menus] = NAV_GROUPS;
    const menu = ([label, views]) => {
      const open = this.menuOpen === label;
      return `<div class="navmenu${open ? " open" : ""}"><button class="nav menubtn ${views.includes(this.view) ? "group-active" : ""}" data-menu="${label}" aria-expanded="${open}" aria-controls="menu-${label}"><span>${this.t(label)}</span><ha-icon class="caret" icon="mdi:chevron-down"></ha-icon></button><div class="navpop" id="menu-${label}" role="group" aria-label="${this.esc(this.t(label))}"><p class="navhead" aria-hidden="true">${this.t(label)}</p>${views.map(item).join("")}</div></div>`;
    };
    return `<header class="top${this.navOpen ? " open" : ""}"><div class="brand"><span class="brandmark"><img src="/ha_housekeeper/logo.png" alt="" onerror="this.parentNode.classList.add('nologo');this.remove()"><ha-icon icon="mdi:broom"></ha-icon></span><strong>${this.t("title")}</strong></div>
      <button class="navtoggle" data-navtoggle aria-expanded="${Boolean(this.navOpen)}" aria-controls="topnav"><ha-icon icon="mdi:menu"></ha-icon><span>${this.t("navMenu")}</span></button>
      <nav class="topnav" id="topnav" aria-label="${this.esc(this.t("navMain"))}">${direct[1].map(item).join("")}${menus.map(menu).join("")}<div class="navend">${item("settings")}</div></nav></header>`;
  }

  // The small line above the title names the menu group the view belongs to.
  eyebrowFor(view) {
    if (view === "settings") return this.t("title");
    const group = NAV_GROUPS.find(([, views]) => views.includes(view));
    return group ? this.t(group[0]) : this.t("navGroupOverview");
  }

  // "just now", "3 min ago", "5 h ago", "2 days ago" for the scan time shown next to the scan button.
  agoText(iso) {
    const seconds = (Date.now() - new Date(iso).getTime()) / 1000;
    if (!Number.isFinite(seconds)) return "";
    if (seconds < 90) return this.t("agoNow");
    if (seconds < 5400) return this.t("agoMinutes", { n: Math.round(seconds / 60) });
    if (seconds < 129600) return this.t("agoHours", { n: Math.round(seconds / 3600) });
    return this.t("agoDays", { n: Math.round(seconds / 86400) });
  }

  heading() {
    const titles = {
      overview: [this.t("health"), this.t("subtitle")],
      inventory: [this.t("inventory"), this.t("inventorySubtitle")],
      findingsNav: [this.t("findings"), this.t("findingsSubtitle")],
      changes: [this.t("changes"), this.t("changesSubtitle")],
      batteries: [this.t("batteries"), this.t("batteriesSubtitle")],
      unreferenced: [this.t("unreferenced"), this.t("unreferencedSubtitle")],
      graph: [this.t("pathTitle"), this.t("pathSubtitle")],
      settings: [this.t("settings"), this.t("settingsSubtitle")],
      cleanup: [this.t("cleanup"), this.t("cleanupSubtitle")],
      maintenance: [this.t("maintenance"), this.t("maintenanceSubtitle")],
      reliability: [this.t("reliability"), this.t("reliabilitySubtitle")],
      runs: [this.t("runsHeading"), this.t("runsSubtitle")],
    };
    const [title, sub] = titles[this.view] || titles.overview;
    const scanned = this.data?.meta?.scanned_at;
    const ago = scanned ? `<span class="scanago" title="${this.esc(this.formatDate(scanned))}">${this.t("lastScan")}: ${this.agoText(scanned)}</span>` : "";
    return `<div class="heading"><div><p class="eyebrow">${this.eyebrowFor(this.view)}</p><h1>${title}</h1><span class="sub">${sub}</span></div>
      <div class="head-actions">${ago}<button class="btn primary" data-action="scan" ${this.busy || this.cleanupRunning() ? "disabled" : ""}>${this.scanButtonInner()}</button></div></div>${this.warmupBanner()}`;
  }

  content() {
    if (this.view === "settings") return this.settingsView();
    if (this.error) return `<div class="error"><strong>${this.t("loadError")}</strong><br>${this.esc(this.error)}</div>`;
    if (!this.data) return `<div class="panel loading"><ha-icon icon="mdi:loading"></ha-icon><p>${this.t("loading")}</p></div>`;
    if (this.view === "inventory") return this.inventory();
    if (this.view === "findingsNav") return this.findingsView();
    if (this.view === "changes") return this.changesView();
    if (this.view === "batteries") return this.batteriesView();
    if (this.view === "unreferenced") return this.unreferencedView();
    if (this.view === "cleanup") return this.cleanupView();
    if (this.view === "maintenance") return this.maintenanceView();
    if (this.view === "reliability") return this.reliabilityView();
    if (this.view === "runs") return this.runsView();
    if (this.view === "graph") return this.graph();
    return this.overview();
  }

  tone(status) { return STATUS_TONE[status] || "blue"; }

  pill(status) { return `<span class="pill ${this.tone(status)}">${this.esc(this.statusLabel(status))}</span>`; }

  tile(type, tone = "") { return `<span class="tile ${tone}"><ha-icon icon="${ICONS[type] || "mdi:help-circle-outline"}"></ha-icon></span>`; }

  findingType(f) { return this.findObject(this.findingKey(f))?.object_type || f.rule_id.split(".")[0]; }

  check(label, tone, value, badge) { return { label, tone, value, badge }; }

  bind() {
    const root = this.shadowRoot;
    root.querySelectorAll("[data-view]").forEach(el => el.onclick = () => { this.menuOpen = null; this.navOpen = false; this.view = el.dataset.view; this.pages = {}; this.selected = null; this.trail = []; this.render(); if (this.view === "changes" && !this.compare) this.loadCompare(); });
    root.querySelectorAll("[data-menu]").forEach(el => el.onclick = () => { this.menuOpen = this.menuOpen === el.dataset.menu ? null : el.dataset.menu; this.render(); });
    root.querySelector("[data-navtoggle]")?.addEventListener("click", () => { this.navOpen = !this.navOpen; this.render(); });
    if (!this._menuBound && root.addEventListener) {
      this._menuBound = true;
      root.addEventListener("click", ev => {
        if (!this.menuOpen || (ev.composedPath?.() || []).some(node => node.classList?.contains?.("navmenu"))) return;
        this.menuOpen = null; this.render();
      });
      root.addEventListener("keydown", ev => {
        if (ev.key !== "Escape" || !(this.menuOpen || this.navOpen)) return;
        const label = this.menuOpen;
        this.menuOpen = null; this.navOpen = false; this.render();
        root.querySelector(label ? `[data-menu="${label}"]` : "[data-navtoggle]")?.focus?.();
      });
    }
    root.querySelectorAll("[data-scan-point]").forEach(el => el.addEventListener("click", () => this.load(true)));
    root.querySelectorAll("[data-action='scan']").forEach(el => el.addEventListener("click", () => this.load(true)));
    root.querySelector("[data-action='back']")?.addEventListener("click", () => this.goBack());
    root.querySelectorAll("[data-detail-tab]").forEach(el => {
      el.onclick = () => { this.detailTab = el.dataset.detailTab; this.render(); };
      el.onkeydown = ev => {
        const ids = [...root.querySelectorAll("[data-detail-tab]")].map(b => b.dataset.detailTab), at = ids.indexOf(el.dataset.detailTab);
        const next = { ArrowRight: ids[(at + 1) % ids.length], ArrowLeft: ids[(at - 1 + ids.length) % ids.length], Home: ids[0], End: ids[ids.length - 1] }[ev.key];
        if (!next) return;
        ev.preventDefault();
        this.detailTab = next;
        this.render();
        this.shadowRoot.querySelector(`[data-detail-tab="${next}"]`)?.focus();
      };
    });
    root.querySelectorAll("[data-graph-open]").forEach(el => el.onclick = () => {
      const obj = this.findObject(el.dataset.graphOpen);
      if (obj) { this.graphSelected = obj; this.graphQuery = ""; this.graphLimit = GRAPH_NODE_STEP; this.view = "graph"; this.selected = null; this.trail = []; this.render(); }
    });
    root.querySelectorAll("[data-jump]").forEach(el => el.onclick = () => {
      this.view = el.dataset.jump; this.pages = {};
      if (el.dataset.filter !== undefined) this.findingFilter = el.dataset.filter;
      if (el.dataset.jump === "inventory") { this.statusFilter = el.dataset.status || ""; this.typeFilter = el.dataset.type || ""; this.pages = {}; }
      this.render();
    });
    root.querySelectorAll("[data-type-jump]").forEach(el => el.onclick = () => { this.typeFilter = el.dataset.typeJump; this.statusFilter = ""; this.pages = {}; this.view = "inventory"; this.render(); });
    root.querySelectorAll("[data-export]").forEach(el => el.onclick = () => this.exportFindings(el.dataset.export));
    root.querySelector("[data-toggle-ignored]")?.addEventListener("click", () => { this.showIgnored = !this.showIgnored; this.pages = {}; this.render(); });
    root.querySelectorAll("[data-battery-filter]").forEach(el => el.onclick = () => { this.batteryFilter = el.dataset.batteryFilter; this.pages = {}; this.render(); });
    root.querySelectorAll("[data-ignore]").forEach(el => el.onclick = async () => {
      const key = el.dataset.ignore, ignored = el.dataset.ignoreValue === "1";
      try {
        await this._hass.callWS({ type: "ha_housekeeper/ignore", finding_key: key, ignored });
        const finding = this.data.findings.find(f => f.key === key);
        if (finding) { finding.ignored = ignored; finding.ignored_by = ignored ? "user" : null; this._rev++; }
      } catch (err) { this.error = err?.message || String(err); }
      this.render();
    });
    root.querySelectorAll("[data-finding-filter]").forEach(el => el.onclick = () => { this.findingFilter = el.dataset.findingFilter; this.pages = {}; this.render(); });
    const searchField = (selector, setter) => {
      const input = root.querySelector(selector);
      if (input) input.oninput = () => { setter(input.value); this.scheduleRender(); };
    };
    searchField("#query", v => { this.query = v; this.pages = {}; });
    searchField("#graphQuery", v => { this.graphQuery = v; });
    root.querySelectorAll("[data-baseline]").forEach(b => b.addEventListener("click", () => { this.compareBaseline = b.dataset.baseline; this.pages = {}; this.loadCompare(); }));
    const bl = root.querySelector("#baseline"); if (bl) bl.onchange = () => { this.compareBaseline = bl.value; this.pages = {}; this.loadCompare(); };
    const tf = root.querySelector("#typeFilter"); if (tf) tf.onchange = () => { this.typeFilter = tf.value; this.pages = {}; this.render(); };
    const sf = root.querySelector("#statusFilter"); if (sf) sf.onchange = () => { this.statusFilter = sf.value; this.pages = {}; this.render(); };
    const sk = root.querySelector("#sortKey"); if (sk) sk.onchange = () => { this.sort = sk.value; this.pages = {}; this.render(); };
    const sd = root.querySelector("#sortDir"); if (sd) sd.onclick = () => { this.sortDir = this.sortDir === "asc" ? "desc" : "asc"; this.pages = {}; this.render(); };
    root.querySelectorAll("th[data-sort]").forEach(el => el.onclick = () => {
      if (this.sort === el.dataset.sort) this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
      else { this.sort = el.dataset.sort; this.sortDir = "asc"; }
      this.pages = {}; this.render();
    });
    root.querySelectorAll("[data-object]").forEach(el => el.onclick = () => { const obj = this.findObject(el.dataset.object); if (obj) this.openObject(obj); });
    // Table rows and graph nodes are not native buttons: Enter and Space open them like a click.
    root.querySelectorAll("tr[data-object], g[data-graph]").forEach(el => el.onkeydown = ev => {
      if (ev.target !== el || (ev.key !== "Enter" && ev.key !== " ")) return;
      ev.preventDefault();
      if (el.click) el.click(); else el.onclick?.();
    });
    root.querySelectorAll("[data-graph-depth]").forEach(el => el.onclick = () => { this.graphDepth = Number(el.dataset.graphDepth); this.graphLimit = GRAPH_NODE_STEP; this.render(); });
    root.querySelector("[data-graph-impact]")?.addEventListener("click", () => { this.graphImpact = !this.graphImpact; this.render(); });
    root.querySelector("[data-graph-more]")?.addEventListener("click", () => { this.graphLimit += GRAPH_NODE_STEP; this.render(); });
    const gr = root.querySelector("#graphRel"); if (gr) gr.onchange = () => { this.graphRel = gr.value; this.render(); };
    const gc = root.querySelector("#graphConf"); if (gc) gc.onchange = () => { this.graphConf = gc.value; this.render(); };
    root.querySelectorAll("[data-graph]").forEach(el => el.onclick = () => { const obj = this.findObject(el.dataset.graph); if (obj) { this.graphSelected = obj; this.graphQuery = ""; this.graphLimit = GRAPH_NODE_STEP; this.render(); } });
    root.querySelectorAll("[data-ha-path]").forEach(el => el.onclick = () => this.navigateHA(el.dataset.haPath));
    root.querySelectorAll("[data-pref]").forEach(el => el.onclick = () => { const [key, value] = el.dataset.pref.split("|"); this.setPref(key, value); });
    root.querySelectorAll("[data-pref-select]").forEach(el => el.onchange = () => this.setPref(el.dataset.prefSelect, el.value));
    root.querySelectorAll("[data-unref-tab]").forEach(el => el.onclick = () => { this.unrefTab = el.dataset.unrefTab; this.pages = {}; this.render(); });
    root.querySelectorAll("[data-sel]").forEach(el => el.onchange = () => { el.checked ? this.cleanupSel.add(el.dataset.sel) : this.cleanupSel.delete(el.dataset.sel); this.render(); });
    root.querySelector("[data-sel-page]")?.addEventListener("click", () => { (this._cleanupVisible || []).forEach(id => this.cleanupSel.add(id)); this.render(); });
    root.querySelector("[data-sel-clear]")?.addEventListener("click", () => { this.cleanupSel.clear(); this.render(); });
    const kind = root.querySelector("[data-cleanup-kind]"); if (kind) kind.onchange = () => { this.cleanupKind = kind.value; this.cleanupSel = new Set(); if (this.lv.cleanup) this.lv.cleanup.f = {}; this.pages = {}; this.render(); };
    root.querySelectorAll("[data-ack]").forEach(el => el.onchange = () => { el.checked ? this.ack.add(el.dataset.ack) : this.ack.delete(el.dataset.ack); this.render(); });
    root.querySelector("[data-plan-confirm]")?.addEventListener("click", () => this.confirmPlan());
    const word = root.querySelector("[data-confirm-word]");
    if (word) word.oninput = () => {
      this.confirmWord = word.value;
      const run = this.shadowRoot.querySelector("[data-plan-execute]");
      if (run) run.disabled = word.value.trim().toUpperCase() !== this.planWord(this.plan);
    };
    root.querySelector("[data-plan-execute]")?.addEventListener("click", () => this.executePlan());
    root.querySelector("[data-plan-cancel]")?.addEventListener("click", () => this.cancelPlan());
    root.querySelector("[data-undo-all]")?.addEventListener("click", () => this.undoPlan());
    root.querySelectorAll("[data-undo-one]").forEach(el => el.onclick = () => this.undoPlan([el.dataset.undoOne]));
    root.querySelector("[data-plan-create]")?.addEventListener("click", () => this.createPlan());
    root.querySelector("[data-repl-old]")?.addEventListener("change", e => { this.replOld = e.target.value.trim(); if (this.replNew && this.replNew.split(".")[0] !== this.replOld.split(".")[0]) this.replNew = ""; this.render(); });
    root.querySelector("[data-repl-new]")?.addEventListener("change", e => { this.replNew = e.target.value.trim(); this.render(); });
    root.querySelector("[data-meter-old]")?.addEventListener("change", e => { this.meterOld = e.target.value.trim(); if (this.meterNew && this.meterNew.split(".")[0] !== this.meterOld.split(".")[0]) this.meterNew = ""; this.render(); });
    root.querySelector("[data-meter-new]")?.addEventListener("change", e => { this.meterNew = e.target.value.trim(); this.render(); });
    root.querySelector("[data-meter-mode]")?.addEventListener("change", e => { this.meterMode = e.target.value; this.render(); });
    root.querySelector("[data-costs-load]")?.addEventListener("click", ev => this.loadCosts(ev.currentTarget.hasAttribute("data-refresh")));
    root.querySelectorAll("[data-cost-sort]").forEach(el => el.onclick = () => { this.costSort = el.dataset.costSort; this.render(); });
    root.querySelectorAll("[data-release]").forEach(el => el.onclick = () => { this.releaseConfirm = el.dataset.release; this.releaseMessage = ""; this.render(); });
    root.querySelectorAll("[data-release-yes]").forEach(el => el.onclick = () => this.releaseQuarantine(el.dataset.releaseYes));
    root.querySelectorAll("[data-release-no]").forEach(el => el.onclick = () => { this.releaseConfirm = null; this.render(); });
    root.querySelector("[data-runs-refresh]")?.addEventListener("click", () => this.loadRuns());
    root.querySelectorAll("[data-rel-window]").forEach(el => el.onclick = () => { this.relWindow = Number(el.dataset.relWindow); this.reliability = null; this.pages.relentries = 1; this.pages.relunstable = 1; this.loadReliability(); });
    root.querySelector("[data-rel-refresh]")?.addEventListener("click", () => this.loadReliability(true));
    root.querySelector("[data-bh-refresh]")?.addEventListener("click", () => this.loadBackup());
    root.querySelectorAll("[data-bh-save]").forEach(el => el.onclick = () => {
      const kind = el.dataset.bhSave, date = root.querySelector(`[data-bh-date="${kind}"]`)?.value;
      this.loadBackup({ type: "ha_housekeeper/backup_attest", kind, ...(date ? { date } : {}) });
    });
    root.querySelectorAll("[data-bh-clear]").forEach(el => el.onclick = () => this.loadBackup({ type: "ha_housekeeper/backup_attest", kind: el.dataset.bhClear, clear: true }));
    root.querySelector("[data-pf-refresh]")?.addEventListener("click", () => this.loadPreflight());
    root.querySelector("[data-pf-save]")?.addEventListener("click", () => this.loadPreflight("save"));
    root.querySelector("[data-pf-clear]")?.addEventListener("click", () => this.loadPreflight("clear"));
    root.querySelector("[data-copy-snippet]")?.addEventListener("click", async () => {
      try { await globalThis.navigator?.clipboard?.writeText(this.exclusionSnippet()); this.snippetCopied = true; } catch (_) { this.snippetCopied = false; }
      this.render();
      setTimeout(() => { this.snippetCopied = false; this.render(); }, 1500);
    });
    root.querySelector("[data-plan-close]")?.addEventListener("click", () => { this.plan = null; this.render(); });
    root.querySelectorAll("[data-plan-open]").forEach(el => el.onclick = () => this.openPlan(el.dataset.planOpen));
    root.querySelectorAll("[data-plan-delete]").forEach(el => el.onclick = () => this.deletePlan(el.dataset.planDelete));
    root.querySelector("[data-opts-save]")?.addEventListener("click", () => this.saveOptions());
    root.querySelector("[data-pref-reset]")?.addEventListener("click", () => { this.prefs = { ...DEFAULT_PREFS }; this.pageSize = DEFAULT_PREFS.pageSize; this.pages = {}; this.savePrefs(); this.render(); });
    root.querySelector("[data-copy-info]")?.addEventListener("click", async () => {
      try { await globalThis.navigator?.clipboard?.writeText(this.infoText()); this.copied = true; } catch (_) { this.copied = false; }
      this.render();
      setTimeout(() => { this.copied = false; this.render(); }, 1500);
    });
    root.querySelectorAll("[data-lq]").forEach(input => input.oninput = () => {
      this.lv[input.dataset.lq].q = input.value; this.pages = {};
      this.scheduleRender();
    });
    root.querySelectorAll("[data-lf]").forEach(el => el.onchange = () => { const [id, name] = el.dataset.lf.split("|"); this.lv[id].f[name] = el.value; this.pages = {}; this.render(); });
    root.querySelectorAll("[data-ls]").forEach(el => el.onchange = () => { const st = this.lv[el.dataset.ls]; st.sort = el.value; st.dir = this.lvDirs[el.dataset.ls][el.value] || "asc"; this.pages = {}; this.render(); });
    root.querySelectorAll("[data-ld]").forEach(el => el.onclick = () => { const st = this.lv[el.dataset.ld]; st.dir = st.dir === "desc" ? "asc" : "desc"; this.pages = {}; this.render(); });
    root.querySelectorAll("[data-lpage]").forEach(el => el.onclick = () => { const [id, n] = el.dataset.lpage.split("|"); this.pages[id] = Number(n); this.render(); });
    root.querySelectorAll("[data-pagesize]").forEach(el => el.onchange = () => { this.pageSize = Number(el.value); this.pages = {}; this.render(); });
  }
}

// Mix the grouped methods into the panel element and register it.
for (const mixin of [ThemeMixin, StylesMixin, ListsMixin, OverviewMixin, FindingsMixin, ChangesMixin, SettingsMixin, CleanupMixin, InventoryMixin, GraphMixin, UnusedMixin, DiagnosisMixin, PropertiesMixin, MaintenanceMixin, BackupMixin, ReliabilityMixin, RunsMixin]) {
  for (const name of Object.getOwnPropertyNames(mixin.prototype)) {
    if (name !== "constructor") Object.defineProperty(HAHousekeeperPanel.prototype, name, Object.getOwnPropertyDescriptor(mixin.prototype, name));
  }
}

if (!customElements.get("ha-housekeeper-panel")) customElements.define("ha-housekeeper-panel", HAHousekeeperPanel);
