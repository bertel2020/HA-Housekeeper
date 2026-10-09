// GENERATED FILE - do not edit. Edit panel-src/*.js and run: node scripts/build_panel.mjs

const TEXT = {
  de: {
    title: "Housekeeper", subtitle: "Deine Home-Assistant-Installation im Blick",
    overview: "Übersicht", inventory: "Inventar", graph: "Abhängigkeiten", findingsNav: "Befunde",
    sumLabel: "Kennzahlen", findSumAffected: "{n} von {m} Objekten betroffen", cleanupSumSelected: "Ausgewählt", colsLabel: "Spalten ein- und ausblenden", exportListTitle: "Liste als CSV exportieren (alle Zeilen der Suche)", batterySumLimit: "unter {n} %", batterySumLowest: "Niedrigster Stand", recSumCosts: "Größter Platzbedarf", unrefSumStats: "Mit Statistik", unrefSumStatsHint: "stehen im Recorder", unrefSumDomain: "Häufigste Domain", unrefSumPlatform: "Häufigste Integration", unrefSumEnergy: "Energie", unrefSumEnergyHint: "noch in der Energie-Konfiguration", navMain: "Hauptnavigation", navMenu: "Menü", howCounted: "Wie wird das gezählt?", enabled: "aktiviert", agoNow: "gerade eben", agoMinutes: "vor {n} Min.", agoHours: "vor {n} Std.", agoDays: "vor {n} Tagen", navGroupOverview: "Überblick", navGroupOperation: "Betrieb", navGroupExplore: "Erkunden", navGroupMaintain: "Pflegen",
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
    graphGroup: "{n} × {type}", graphGroupOpen: "Zum Aufklappen anklicken", graphRegroup: "Wieder zusammenfassen", graphImpact: "Was bricht beim Entfernen?", graphBreaks: "bricht", graphLabel: "Abhängigkeitsgraph von {name}", graphNodes: "Objekte: {n}", graphMore: "Mehr anzeigen",
    graphLegend: "Durchgezogen: sicher · Gestrichelt: wahrscheinlich · Rot gepunktet: Zyklus · Roter Rahmen: bricht beim Entfernen · Gestrichelter Rahmen: Objekt fehlt.",
    graphMissing: "Fehlende Ziele: {n}", graphProbable: "Wahrscheinliche Beziehungen: {n}", graphCycles: "Zyklen: {n}", graphHidden: "Ausgeblendet: {n}", graphHitsOutside: "{n} betroffene Objekte liegen außerhalb des Graphen (mehr Ebenen wählen)",
    graphHint: "Wähle ein Objekt aus, um seine direkten Beziehungen zu untersuchen.",
    select: "Objekt auswählen", firstObservation: "Erster durch Housekeeper bestätigter Zeitpunkt",
    entity: "Entität", device: "Gerät", config_entry: "Integration", area: "Bereich",
    automation: "Automation", script: "Skript", scene: "Szene", dashboard: "Dashboard", SHOWS: "zeigt an", entity_disabled: "Entität wurde deaktiviert",
    floor: "Etage", label: "Label", broken_reference: "Defekte Referenz",
    triggers: "Trigger", conditions: "Bedingungen", actions: "Aktionen",
    automationStructure: "Automationsstruktur", previous: "Zurück", next: "Weiter",
    page: "Seite", of: "von", missingReferences: "Fehlende Referenzen",
    integration_disabled: "Zugehörige Integration wurde deaktiviert",
    device_disabled: "Zugehöriges Gerät wurde deaktiviert",
    device_missing: "Zugehöriges Gerät existiert nicht mehr in der Geräte-Registry",
    config_entry_missing: "Zugehöriger Konfigurationseintrag fehlt",
    state_missing: "Entität ist registriert, besitzt aber keinen Zustand",
    state_unavailable: "Integration meldet den Zustand unavailable",
    state_unknown: "Integration meldet den Zustand unknown", state_available: "Zustand ist verfügbar",
    loading: "Inventar wird geladen …", loadError: "Inventar konnte nicht geladen werden",
    total: "Gesamt",
    recentFindings: "Aktuelle Befunde", affected: "Betroffenes Objekt",
    systemState: "Systemzustand", health: "Housekeeping-Status", healthGood: "Gut", healthCheck: "Prüfen",
    healthBad: "Problematisch", healthHint: "Anteil der Entitäten, Automationen, Skripte und Szenen ohne Befund", healthTip: "Gezählt werden betroffene Objekte, nicht einzelne Befunde. Ausgeblendete Befunde und andere Objekttypen (Dashboards, Geräte, Helfer) zählen nicht. Der Wert ist gerundet. Betroffen: {affected} von {base}.",
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
    impactNone: "Keine bekannte Verwendung", impactNoneText: "Keine Automation, kein Skript, keine Szene und kein Dashboard verwendet dieses Objekt oder seine zugehörigen Entitäten.",
    impactCertain: "Nicht sicher entfernbar", impactCertainText: "{count} Automation(en), Skript(e), Szene(n) oder Dashboard(s) verweisen sicher auf dieses Objekt und würden ins Leere laufen.",
    impactProbable: "Vorher prüfen", impactProbableText: "{count} Automation(en), Skript(e), Szene(n) oder Dashboard(s) verweisen wahrscheinlich darauf (z. B. über Templates).",
    impactScope: "Betrachtet werden das Objekt und {count} zugehörige Entitäten.", impactScopeOne: "Betrachtet wird nur dieses Objekt.",
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
    cause_duplicate: "Es gibt eine funktionierende Entität mit fast gleicher ID von derselben Integration ({twin}). Diese hier ist sehr wahrscheinlich ein Überbleibsel, etwa nach dem erneuten Hinzufügen des Geräts.",
    hint_duplicate: "Die funktionierende Entität öffnen und vergleichen. Erst wenn nichts mehr auf diese Entität verweist, ist sie ein Kandidat zum Entfernen.",
    duplicateTwin: "Funktionierende Entität",
    INCLUDES: "hat als Mitglied", missing_member: "Gruppenmitglied",
    cause_group_broken: "Die Gruppe enthält {count} Mitglied(er), die nicht mehr existieren.", hint_group_broken: "Die Gruppe bearbeiten und die fehlenden Mitglieder entfernen.",
    cause_helper_broken: "Dieser Helfer baut auf {count} Entität/Entitäten auf, die nicht mehr existieren.", hint_helper_broken: "Den Helfer bearbeiten und die fehlenden Quellen ersetzen.",
    hideFinding: "Befund ausblenden", showFinding: "Wieder einblenden", ignoredLabel: "Ausgeblendet", showIgnored: "Ausgeblendete anzeigen",
    ignoredByLabel: "Ausgeblendet durch das Label housekeeper_ignore", findingsOfObject: "Befunde zu diesem Objekt",
    batteries: "Batterien", batteriesSubtitle: "Batterie-Entitäten, die niedrigsten Werte zuerst.", batteryLow: "Niedrig", batteryAll: "Alle",
    settings: "Einstellungen", settingsSubtitle: "Infos zu Housekeeper und Anpassung der Darstellung.", about: "Über Housekeeper", version: "Version", haVersion: "Home Assistant",
    mode: "Betriebsart", readOnlyValue: "Liest und analysiert; ändert nur nach ausdrücklicher Bestätigung", scanInterval: "Automatischer Scan", unavailableAfter: "Nicht verfügbar gilt als Befund nach", unusedAfter: "Ungenutzte Automationen nach", lowBatteryAt: "Schwache Batterie ab",
    daysValue: "{n} Tage", hoursValue: "alle {n} Stunden", offValue: "Aus", immediately: "sofort", openOptions: "Optionen öffnen", reportIssue: "Fehler melden", changelog: "Änderungsprotokoll", repository: "GitHub", copyInfo: "Info kopieren", copied: "Kopiert",
    appearance: "Darstellung", fontSize: "Schriftgröße", fontSmall: "Klein", fontNormal: "Normal", fontLarge: "Groß", colorMode: "Modus", modeAuto: "Automatisch", modeLight: "Hell", modeDark: "Dunkel", modeHint: "Automatisch folgt dem Design von Home Assistant.",
    colorScheme: "Farbschema", schemeStandard: "Standard", schemeHousekeeper: "Housekeeper", schemeModern: "Modern", behavior: "Verhalten", startView: "Startansicht", pageSizeSetting: "Einträge pro Seite", resetPrefs: "Einstellungen zurücksetzen",
    hiddenFindings: "Ausgeblendete Befunde", decideKind: "Art der Entscheidung", decideKind_ignore: "Ausgeblendet", decideKind_keep: "Bekannt", decideKind_snooze: "Zurückgestellt", decideReason: "Begründung (optional)", decideReasonNeeded: "Begründung (nötig)", decideNeedReason: "Bewusst behalten braucht eine Begründung.", decideHow: "Wie lange", decideForever: "Unbefristet", decideDays: "{n} Tage", decideUntil: "bis {date}", dueLabel: "Wiedervorlage fällig", dueFilter: "Wiedervorlage fällig", hiddenNone: "Keine Befunde ausgeblendet.", hiddenHint: "Hier lassen sich ausgeblendete Befunde wieder einblenden.",
    sortBy: "Sortieren nach", sortCertainty: "Sicherheit", sortName: "Name", sortId: "Objekt-ID", sortSince: "Erkannt seit", sortRule: "Regel",
    sortLevel: "Ladestand", sortArea: "Bereich", sortType: "Typ", sortStatus: "Status", allTypes: "Alle Typen", allAreas: "Alle Bereiche",
    denseOn: "Kompakte Zeilen", denseOff: "Ausführliche Zeilen", sortAscending: "Aufsteigend", sortDescending: "Absteigend", searchList: "In der Liste suchen …", noMatches: "Keine Treffer für diese Filter.",
    density: "Dichte", densityNormal: "Normal", densityCompact: "Kompakt", motion: "Animationen", motionAuto: "Wie System", motionReduced: "Reduziert",
    motionHint: "Wie System folgt der Einstellung „Bewegung reduzieren“ deines Geräts.", prefsNote: "Die Darstellung wird in deinem Home-Assistant-Benutzerprofil gespeichert (und zusätzlich in diesem Browser).",
    scanSettings: "Scan und Schwellenwerte", scanSettingsHint: "Ändert die Optionen der Integration. Housekeeper lädt danach neu.", optMinUnavailable: "Nicht verfügbar gilt als Befund nach (Tage, 0 = sofort)",
    optUnusedAutomation: "Ungenutzte Automationen nach (Tage, 0 = aus)", optScanInterval: "Automatischer Scan alle (Stunden, 0 = aus)", optLowBattery: "Schwache Batterie ab (Prozent)",
    saveOptions: "Speichern", optionsSaved: "Gespeichert. Housekeeper lädt neu …", optionsInvalid: "Bitte Werte im erlaubten Bereich eingeben.",
    cleanupSubtitle: "Erst deaktivieren, nach der Quarantäne entfernen; Reste in der Datenbank löschen.",
    cleanupCandidates: "Kandidaten", cleanupCandidatesHint: "Verwaiste und lange nicht verfügbare Entitäten.", cleanupNone: "Keine Kandidaten gefunden.",
    selectPage: "Seite auswählen", successorHint: "Mögliche Nachfolger (nur ein Vorschlag):", purgeOpen: "Auswahl aus dem Recorder löschen …", purgeTitle: "Statistiken aus dem Recorder löschen", purgeWarn: "{n} Statistik-Reihen werden mit Lang- und Kurzzeitwerten gelöscht. Vorher legt Housekeeper ein Home-Assistant-Backup an und löscht nur, wenn es gelingt. Danach geht es nur noch aus dem Backup zurück. Reihen im Energie-Dashboard sind ausgenommen.", purgeStates: "Auch die gespeicherten Zustände dieser IDs löschen", purgeWord: "LÖSCHEN", purgeRun: "Jetzt löschen", purgeRunning: "Läuft (Backup, dann Löschen) …", purgeDone: "{n} Reihen gelöscht, {skipped} übersprungen.", purgeError: "Nichts gelöscht: {reason}", purgeReason_backup_unavailable: "Backup nicht verfügbar", purgeReason_no_backup_agent: "kein Backup-Ziel eingerichtet", purgeReason_backup_failed: "Backup fehlgeschlagen", purgeReason_failed: "Fehler beim Löschen", purgeReason_busy: "ein Löschvorgang läuft schon", bpTab: "Blueprints", bpTitle: "Blueprints", bpHint: "Blueprint-Dateien, die keine Automation und kein Skript mehr nutzt, und Automationen oder Skripte, deren Blueprint fehlt oder nicht lädt. Nur Hinweise; es wird nichts gelöscht.", bpMissing: "Blueprint-Datei fehlt", bpBroken: "Blueprint lädt nicht", bpUnused: "wird nicht benutzt", bpFiles: "Dateien", bpNone: "Nichts auffällig.", notifyTitle: "Benachrichtigung", notifyHint: "Das Einzige, was Housekeeper von sich aus tut. Standardmäßig aus.", notifyLabel: "Bei neuen defekten Referenzen melden", notifyDetail: "Eine Benachrichtigung in Home Assistant, sobald eine Automation oder ein Skript auf etwas zeigt, das nicht existiert. Jeder Fund wird einmal gemeldet; beim Einschalten wird nichts Altes gemeldet.", diagDownload: "Diagnose-Datei herunterladen", diagHint: "Nur Zahlen und Versionen, keine Namen, IDs oder Attribute. Passend für eine Fehlermeldung auf GitHub.", weeklyBtn: "Wochenbericht", weeklyHint: "Lädt den Vergleich mit dem Stand von vor etwa einer Woche und speichert ihn als Markdown-Datei.", weeklyTitle: "Housekeeper-Bericht", weeklyRecorder: "Lauteste Entitäten im Recorder", findHideSelected: "Ausgewählte ausblenden", clearSelection: "Auswahl leeren", createPlan: "Vorschau erstellen", selectedCount: "{count} ausgewählt",
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
    reason_entity_working: "Die Entität funktioniert noch und ist kein Kandidat.", reason_used_certain: "Wird sicher verwendet – Entfernen würde Verweise brechen.", reason_used_probable: "Wird vermutlich verwendet (Template oder Dashboard).",
    reason_has_statistics: "Hat Langzeitstatistiken im Recorder; sie blieben ohne Entität zurück.", reason_ignored_by_label: "Trägt das Label housekeeper_ignore.", reason_not_found: "Im letzten Scan nicht gefunden.", reason_unsupported_action: "Diese Aktion wird nicht unterstützt.",
    longTermStats: "Langzeitstatistik", yes: "Ja", no: "Nein", statsNote: "Für diese Entität gibt es Langzeitstatistiken im Recorder. Sie blieben nach einem Entfernen bestehen, gehörten dann aber zu keiner Entität mehr.",
    energyDashboard: "Energie-Dashboard",
    orphanStats: "Verwaiste Statistiken", unreferencedEntities: "Entitäten", noOrphanStats: "Keine verwaisten Statistiken.", noRecorder: "Der Recorder ist nicht verfügbar; es gibt keine Statistiken zu prüfen.",
   
    kindSum: "Zähler (Summe)", kindMean: "Messwert (Mittelwert)", kindBoth: "Zähler und Messwert", inEnergy: "Im Energie-Dashboard", sortUnit: "Einheit", allKinds: "Alle Arten",
    warmupBanner: "Home Assistant startet noch. Die Befunde sind vorläufig und werden nach dem Start neu erhoben; Aufräumen ist bis dahin gesperrt.",
    err_warming_up: "Home Assistant startet noch. Bitte in wenigen Minuten erneut versuchen.",
    staleScan: "Der letzte Scan ist {age} alt. Housekeeper scannt alle {hours} Stunden – die Daten können veraltet sein.", staleScanManual: "Der letzte Scan ist {age} alt.",
    kindDisable: "Deaktivieren (Quarantäne, umkehrbar)", kindRemove: "Entfernen (nach Quarantäne, mit Backup)", actionKind: "Aktion",
    cleanupDryRun: "Nichts wird geändert, bis du einen Plan ausdrücklich bestätigst. Deaktivieren ist umkehrbar; Entfernen geht erst nach der Quarantäne und mit Backup.",
    reason_already_disabled: "Die Entität ist bereits deaktiviert.",
    skippedUnacknowledged: "{count} zu prüfende Einträge ohne ausdrückliche Bestätigung werden übersprungen.",
    confirmPlan: "Bestätigen …", confirmPlanTitle: "Plan bestätigen", acknowledgeReview: "Ich habe das geprüft und will es trotzdem ausführen", confirmedSummary: "{count} Entitäten werden deaktiviert (Quarantäne). Das ist jederzeit umkehrbar, solange die Entität unverändert bleibt.",
    confirmTypeWord: "Zur Bestätigung „{word}“ eintippen:", confirmWord: "DEAKTIVIEREN", runNow: "Jetzt ausführen", cancelRun: "Abbrechen", notExecutableYet: "Entfernen ist noch nicht ausführbar; diese Vorschau dient nur der Prüfung.",
    running: "Läuft …", progressOf: "{done} von {total}", undoAll: "Alles rückgängig machen", undoOne: "Rückgängig", tokenExpired: "Die Bestätigung ist abgelaufen. Bitte erneut bestätigen.", nothingExecutable: "Keine ausführbaren Aktionen in diesem Plan.",
    plan_status_dry_run: "Vorschau", plan_status_running: "Läuft", plan_status_executed: "Ausgeführt", plan_status_verified: "Ausgeführt und geprüft", plan_status_partial: "Teilweise ausgeführt", plan_status_aborted: "Abgebrochen", plan_status_undone: "Rückgängig gemacht", plan_status_partially_undone: "Teilweise rückgängig",
    result_done: "Deaktiviert", result_not_run: "Nicht ausgeführt", result_undone: "Rückgängig gemacht",
    abort_entity_changed: "Die Entität wurde nach der Vorschau geändert.", abort_entity_gone: "Die Entität existiert nicht mehr.", abort_now_blocked: "Die Entität wird inzwischen verwendet.", abort_needs_acknowledgement: "Ohne ausdrückliche Bestätigung.", abort_cancelled: "Auf Wunsch abgebrochen.", abort_aborted: "Wegen eines vorherigen Abbruchs.",
    undo_undone: "wieder aktiviert", undo_conflict_changed: "nicht rückgängig gemacht: zwischenzeitlich geändert", undo_conflict_gone: "nicht rückgängig gemacht: Entität existiert nicht mehr",
    verification: "Prüfung nach dem Lauf", check_disabled: "Entität ist deaktiviert", check_no_new_broken_references: "Keine neuen fehlenden Referenzen",
    err_bad_token: "Bestätigung ungültig oder abgelaufen.", err_busy: "Es läuft bereits ein Plan.", sourceUndoPerItem: "Datei zu groß für eine Kopie: Rückgängig stellt diese Quelle nur Eintrag für Eintrag wieder her (Kommentare und Formatierung kehren nicht zurück).", snapshotDropped: "Die Dateikopie wurde aus Platzgründen entfernt; Rückgängig stellt nur einzelne Einträge wieder her.", err_cleanup_busy: "Es läuft gerade ein Plan. Scans sind bis zu seinem Ende gesperrt.", err_plan_not_open: "Dieser Plan wurde bereits bestätigt oder ausgeführt.", err_plan_too_old: "Der Plan ist älter als 24 Stunden. Bitte neu erstellen.", err_nothing_to_do: "Nichts auszuführen: blockierte Einträge laufen nie, „Zu prüfen“ braucht eine ausdrückliche Bestätigung.", err_not_found: "Plan nicht gefunden.",
    quarantine: "Quarantäne", quarantineHint: "Entitäten, die Housekeeper deaktiviert hat. Entfernen ist frühestens nach {days} Tagen möglich (Aktion „Entfernen“). Das Deaktivieren machst du über das Journal rückgängig.",
    quarantineSince: "seit {date} · {days} Tagen", quarantineWait: "Noch {days} Tage", quarantineReady: "Frühestens entfernbar", quarantineFact: "seit {date} ({days} Tage)",
    confirmWordRemove: "ENTFERNEN", confirmedSummaryRemove: "{count} Entitäten werden entfernt. Vorher legt Housekeeper ein Home-Assistant-Backup an (das kann dauern) und startet nur, wenn es erfolgreich ist. Wiederherstellen geht, solange die Entitäts-ID frei ist und die Integration noch existiert.",
    reason_not_quarantined: "Nicht in Quarantäne: erst deaktivieren, nach der Quarantänezeit entfernen.", reason_quarantine_too_short: "Die Quarantäne ist noch zu kurz.", reason_not_restorable: "Nicht wiederherstellbar: Die Integration existiert nicht mehr, das Entfernen wäre endgültig.",
    abort_backup_failed: "Das Backup ist fehlgeschlagen – es wurde nichts geändert.", abort_backup_unavailable: "Die Backup-Komponente ist nicht verfügbar – es wurde nichts geändert.", abort_no_backup_agent: "Es ist kein Backup-Ziel eingerichtet (Einstellungen → System → Backups) – es wurde nichts geändert.",
    result_removed: "Entfernt", undo_restored: "wiederhergestellt (wieder in Quarantäne)", undo_conflict_taken: "nicht wiederhergestellt: Entitäts-ID inzwischen belegt", undo_conflict_unrestorable: "nicht wiederhergestellt: Integration existiert nicht mehr",
    check_removed: "Entität ist entfernt", plan_status_backup: "Backup läuft", backupRunning: "Backup läuft … das kann etwas dauern.", daysLeftShort: "noch {days} Tage", removalCandidatesHint: "Entitäten in Quarantäne. Entfernen ist erst nach {days} Tagen möglich.", removalReady: "Bereit", waitingShort: "Wartet",
    perPage: "Pro Seite", cleanup: "Aufräumen", cleanupHint: "Hinweise, die einen Blick wert sind",
    unreferenced: "Nicht verwendet", unreferencedSubtitle: "Aktive Entitäten, die in keiner Automation, keinem Skript, keiner Szene, Gruppe, keinem Helfer und keinem lesbaren Dashboard vorkommen.",
    unreferencedHint: "Nur ein Hinweis, keine Empfehlung zum Löschen: Entitäten können auch über Sprachassistenten, Apps, das Energie-Dashboard, automatisch erzeugte Dashboards oder externe Systeme genutzt werden. Diagnose- und Konfigurations-Entitäten sind ausgeblendet.",
    noUnreferenced: "Alle aktiven Entitäten werden irgendwo verwendet.", unrefShown: "{shown} von {total} angezeigt – nach Domäne filtern, um weitere zu sehen.", allDomains: "Alle Domänen",
    noBatteries: "Keine Batterie-Entitäten gefunden.", batteryLevel: "Ladestand", integrationProblems: "Integrationen mit Problemen",
    integrationProblemsHint: "Diese Integrationen sind nicht geladen. Ihre Entitäten sind nicht verfügbar.",
    backTo: "Zurück zu", facts: "Eckdaten", relations: "Beziehungen", showInGraph: "Im Abhängigkeitsdiagramm", noState: "Kein Zustand vorhanden", notExpected: "Nicht erwartet",
    available: "Verfügbar", causeLabel: "Ursache", hintLabel: "Empfehlung", certainty: "Sicherheit", finding: "Befund", noFinding: "Kein Befund",
    belowThreshold: "Noch kein Befund: nicht verfügbare Entitäten werden erst nach {days} Tagen gemeldet.", refCount: "Verwendet von",
    moreItems: "und {count} weitere", automationOff: "Automation ist ausgeschaltet", refsResolved: "Alle Referenzen aufgelöst", entities: "Entitäten",
    cs_loaded: "Geladen", cs_setup_error: "Fehler beim Einrichten", cs_setup_retry: "Einrichtung wird wiederholt", cs_not_loaded: "Nicht geladen",
    cs_migration_error: "Fehler bei der Migration", cs_failed_unload: "Entladen fehlgeschlagen", cs_setup_in_progress: "Wird eingerichtet",
    missing_entity: "Entität", missing_device: "Gerät", missing_area: "Bereich", missing_floor: "Etage", missing_label: "Label",
    cause_ok: "Integration, Gerät und Zustand sind in Ordnung. Hier ist nichts zu tun.",
    cause_entity_disabled: "Die Entität wurde deaktiviert und besitzt deshalb keinen Zustand. Das ist kein Fehler.",
    cause_device_disabled: "Das zugehörige Gerät ist deaktiviert, daher liefert die Entität keinen Zustand. Das ist kein Fehler.",
    cause_integration_disabled: "Die zugehörige Integration ist deaktiviert, daher liefert die Entität keinen Zustand. Das ist kein Fehler.",
    cause_device_missing: "Die Entität verweist auf ein Gerät, das nicht mehr in der Geräte-Registry existiert. Der Registry-Eintrag ist sehr wahrscheinlich ein Überbleibsel.",
    cause_config_entry_missing: "Die Integration, zu der die Entität gehört, wurde entfernt. Der Registry-Eintrag ist verwaist.",
    cause_state_missing: "Die Entität ist registriert, aber die Integration stellt sie nicht mehr bereit. Typisch nach dem Umbau einer Integration, geänderter unique_id oder entferntem Gerät.",
    cause_state_missing_integration: "Die Integration ist nicht geladen ({state}). Deshalb fehlt der Zustand der Entität.",
    cause_state_unavailable: "Integration und Gerät sind vorhanden, aber die Integration meldet die Entität als nicht verfügbar. Meist ist das Gerät oder der Dienst nicht erreichbar, etwa ausgeschaltet, ohne Netzwerk oder Cloud-Ausfall.",
    cause_state_unavailable_integration: "Die Integration ist nicht geladen ({state}). Ihre Entitäten sind deshalb nicht verfügbar.",
    cause_state_unknown: "Die Integration hat bisher keinen Wert geliefert. Das ist nach einem Neustart oder bei selten aktualisierten Entitäten normal.",
    hint_state_unavailable: "Gerät oder Dienst auf Erreichbarkeit prüfen. Ist es erreichbar, die Integration neu laden.",
    hint_integration: "In den Integrationen die Fehlermeldung der Integration prüfen und sie neu laden.",
    hint_state_unknown: "Abwarten. Bleibt der Zustand dauerhaft unbekannt, die Integration prüfen.",
    hint_orphan: "Vor dem Entfernen unter Beziehungen prüfen, ob Automationen oder andere Objekte die Entität noch verwenden.",
    cause_device_active: "Das Gerät ist aktiv und stellt Entitäten bereit.",
    cause_device_empty: "Dem Gerät ist keine Entität zugeordnet. Möglicherweise ist es ein Überbleibsel.",
    cause_device_off: "Das Gerät ist deaktiviert. Das ist kein Fehler.",
    cause_entry_ok: "Die Integration ist geladen.",
    cause_entry_problem: "Die Integration ist nicht geladen ({state}). Ihre Entitäten sind deshalb nicht verfügbar.",
    cause_entry_off: "Die Integration ist deaktiviert. Das ist kein Fehler.",
    cause_automation_ok: "Alle Referenzen zeigen auf vorhandene Objekte.",
    cause_automation_broken: "{count} Referenz(en) zeigen auf Objekte, die nicht mehr existieren. An diesen Stellen läuft das Objekt ins Leere.",
    hint_automation_broken: "Die fehlenden Referenzen ersetzen oder entfernen.",
  },
  en: {
    title: "Housekeeper", subtitle: "Keep your Home Assistant installation in view",
    overview: "Overview", inventory: "Inventory", graph: "Dependencies", findingsNav: "Findings",
    sumLabel: "Key figures", findSumAffected: "{n} of {m} objects affected", cleanupSumSelected: "Selected", colsLabel: "Show or hide columns", exportListTitle: "Export the list as CSV (all rows of the search)", batterySumLimit: "below {n} %", batterySumLowest: "Lowest level", recSumCosts: "Largest footprint", unrefSumStats: "With statistics", unrefSumStatsHint: "are in the recorder", unrefSumDomain: "Most common domain", unrefSumPlatform: "Most common integration", unrefSumEnergy: "Energy", unrefSumEnergyHint: "still in the energy configuration", navMain: "Main navigation", navMenu: "Menu", howCounted: "How is this counted?", enabled: "enabled", agoNow: "just now", agoMinutes: "{n} min ago", agoHours: "{n} h ago", agoDays: "{n} days ago", navGroupOverview: "Overview", navGroupOperation: "Operation", navGroupExplore: "Explore", navGroupMaintain: "Maintain",
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
    graphGroup: "{n} × {type}", graphGroupOpen: "Click to expand", graphRegroup: "Group again", graphImpact: "What breaks when removed?", graphBreaks: "breaks", graphLabel: "Dependency graph of {name}", graphNodes: "Objects: {n}", graphMore: "Show more",
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
    hiddenFindings: "Hidden findings", decideKind: "Kind of decision", decideKind_ignore: "Hidden", decideKind_keep: "Known", decideKind_snooze: "Snoozed", decideReason: "Reason (optional)", decideReasonNeeded: "Reason (required)", decideNeedReason: "Keeping on purpose needs a reason.", decideHow: "For how long", decideForever: "Indefinitely", decideDays: "{n} days", decideUntil: "until {date}", dueLabel: "Due again", dueFilter: "Due again", hiddenNone: "No findings hidden.", hiddenHint: "Hidden findings can be shown again here.",
    sortBy: "Sort by", sortCertainty: "Certainty", sortName: "Name", sortId: "Object ID", sortSince: "Detected since", sortRule: "Rule",
    sortLevel: "Level", sortArea: "Area", sortType: "Type", sortStatus: "Status", allTypes: "All types", allAreas: "All areas",
    denseOn: "Compact rows", denseOff: "Detailed rows", sortAscending: "Ascending", sortDescending: "Descending", searchList: "Search this list …", noMatches: "No matches for these filters.",
    density: "Density", densityNormal: "Normal", densityCompact: "Compact", motion: "Animation", motionAuto: "Like system", motionReduced: "Reduced",
    motionHint: "Like system follows your device's “reduce motion” setting.", prefsNote: "Appearance is stored in your Home Assistant user profile (and in this browser as well).",
    scanSettings: "Scan and thresholds", scanSettingsHint: "Changes the integration options. Housekeeper reloads afterwards.", optMinUnavailable: "Unavailable becomes a finding after (days, 0 = immediately)",
    optUnusedAutomation: "Unused automations after (days, 0 = off)", optScanInterval: "Automatic scan every (hours, 0 = off)", optLowBattery: "Low battery at (percent)",
    saveOptions: "Save", optionsSaved: "Saved. Housekeeper is reloading …", optionsInvalid: "Please enter values within the allowed range.",
    cleanupSubtitle: "Disable first, remove after the quarantine; delete leftovers in the database.",
    cleanupCandidates: "Candidates", cleanupCandidatesHint: "Orphaned and long-unavailable entities.", cleanupNone: "No candidates found.",
    selectPage: "Select page", successorHint: "Possible successors (a suggestion only):", purgeOpen: "Delete selection from the recorder …", purgeTitle: "Delete statistics from the recorder", purgeWarn: "{n} statistic series are deleted with their long-term and short-term values. Housekeeper creates a Home Assistant backup first and only deletes if it succeeds. Afterwards the backup is the only way back. Series in the Energy dashboard are left out.", purgeStates: "Also delete the stored states of these IDs", purgeWord: "DELETE", purgeRun: "Delete now", purgeRunning: "Running (backup, then delete) …", purgeDone: "{n} series deleted, {skipped} skipped.", purgeError: "Nothing deleted: {reason}", purgeReason_backup_unavailable: "backup not available", purgeReason_no_backup_agent: "no backup location set up", purgeReason_backup_failed: "backup failed", purgeReason_failed: "error while deleting", purgeReason_busy: "a purge is already running", bpTab: "Blueprints", bpTitle: "Blueprints", bpHint: "Blueprint files that no automation or script uses any more, and automations or scripts whose blueprint is missing or fails to load. Hints only; nothing is deleted.", bpMissing: "blueprint file is missing", bpBroken: "blueprint fails to load", bpUnused: "not used", bpFiles: "files", bpNone: "Nothing to note.", notifyTitle: "Notification", notifyHint: "The only thing Housekeeper does on its own. Off by default.", notifyLabel: "Tell about new broken references", notifyDetail: "A notification in Home Assistant when an automation or script points to something that does not exist. Each finding is announced once; switching it on announces nothing old.", diagDownload: "Download diagnostics file", diagHint: "Numbers and versions only, no names, ids or attributes. Fit to attach to an issue on GitHub.", weeklyBtn: "Weekly report", weeklyHint: "Loads the comparison with the state from about a week ago and saves it as a Markdown file.", weeklyTitle: "Housekeeper report", weeklyRecorder: "Loudest entities in the recorder", findHideSelected: "Hide selected", clearSelection: "Clear selection", createPlan: "Create preview", selectedCount: "{count} selected",
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
    cleanupDryRun: "Nothing is changed until you explicitly confirm a plan. Disabling is reversible; removal only works after the quarantine and with a backup.",
    reason_already_disabled: "The entity is already disabled.",
    skippedUnacknowledged: "{count} entries to review without explicit confirmation will be skipped.",
    confirmPlan: "Confirm …", confirmPlanTitle: "Confirm plan", acknowledgeReview: "I have checked this and want to run it anyway", confirmedSummary: "{count} entities will be disabled (quarantine). This is reversible at any time while the entity stays unchanged.",
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
const BACKUP_KINDS = ["remove_entity", "remove_device", "forget_device", "replace_references", "migrate_meter", "purge_statistics", "refactor_automation", "repair_counter", "repair_range"];
const REPAIR_KINDS = ["repair_counter", "repair_range"];
const IMPACT_RANK = { none: 0, low: 1, medium: 2, high: 3 };
const BACKUP_FAILURES = ["backup_failed", "backup_unavailable", "no_backup_agent"];
const DEVICE_KINDS = ["disable_device", "remove_device", "forget_device"];

const PREFS_KEY = "ha_housekeeper.prefs";
const DEFAULT_PREFS = { size: "normal", mode: "auto", scheme: "standard", density: "normal", motion: "auto", pageSize: 20, startView: "overview", graphMode: "list", language: "auto" };
const USER_DATA_KEY = "ha_housekeeper";
const OPTION_LIMITS = { min_unavailable_days: [0, 365], unused_automation_days: [0, 3650], scan_interval_hours: [0, 720], low_battery_percent: [1, 100], history_days: [1, 365] };
// Text scale only; spacing and icons stay put. Normal is a bit larger than the original 1.0.
const SIZES = { small: 1, normal: 1.1, large: 1.25 };
// The dependency graph shows this many nodes per side at first; "more" adds another step.
const GRAPH_NODE_STEP = 40;
const GRAPH_GROUP_MIN = 5; // leaf nodes of one type on one node from which the graph folds them into one
// Scan thresholds as cards: option key, title, explanation, unit and default (the defaults of const.py).
const OPTION_FIELDS = [
  ["min_unavailable_days", "optMinUnavailableTitle", "optMinUnavailableHint", "unitDays", 7],
  ["unused_automation_days", "optUnusedAutomationTitle", "optUnusedAutomationHint", "unitDays", 90],
  ["scan_interval_hours", "optScanIntervalTitle", "optScanIntervalHint", "unitHours", 24],
  ["low_battery_percent", "optLowBatteryTitle", "optLowBatteryHint", "unitPercent", 20],
  ["history_days", "optHistoryDaysTitle", "optHistoryDaysHint", "unitDays", 30],
];
const START_VIEWS = ["overview", "findingsNav", "inventory", "changes", "batteries"];
const REPO_URL = "https://github.com/bertel2020/HA-Housekeeper";
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
  ["repair", "mdi:tools"],
  ["journal", "mdi:clipboard-text-clock-outline"],
  ["maintenance", "mdi:wrench-clock"],
  ["exposure", "mdi:shield-search"],
  ["policies", "mdi:clipboard-check-outline"],
  ["reliability", "mdi:chart-timeline-variant"],
  ["runs", "mdi:robot-outline"],
  ["recorder", "mdi:database-clock-outline"],
  ["batteries", "mdi:battery-alert-variant-outline"],
  ["reminders", "mdi:calendar-clock-outline"],
  ["settings", "mdi:cog-outline"],
];

// The sidebar groups every view but "settings", which stands alone at the foot.
const NAV_GROUPS = [
  ["navGroupActions", ["overview", "findingsNav", "cleanup", "repair"]],
  ["navGroupMaintain", ["maintenance", "batteries", "reminders", "policies", "exposure"]],
  ["navGroupOperation", ["reliability", "runs", "recorder"]],
  ["navGroupExplore", ["inventory", "graph", "changes", "journal"]],
];
const BUSY_RETRIES = 12, BUSY_WAIT_MS = 8000; // another recorder query holds the lock: ask again by itself
const NAV_ICONS = { ...Object.fromEntries(NAV), unreferenced: "mdi:link-variant-off" };

// Cleanup removes what is no longer needed; everything else a plan can do repairs something that stays.
const CLEANUP_KINDS = ["disable_entity", "remove_entity", "disable_device", "remove_device", "forget_device"];
const REPAIR_TASKS = [
  ["repair_counter", "mdi:chart-line", "repairTaskCounter", "repairTaskCounterHint"],
  ["migrate_meter", "mdi:gauge", "repairTaskMeter", "repairTaskMeterHint"],
  ["replace_references", "mdi:swap-horizontal", "repairTaskReplace", "repairTaskReplaceHint"],
  ["exchange_device", "mdi:devices", "repairTaskExchange", "repairTaskExchangeHint"],
];
// The view in which the person finishes a plan of this kind.
const viewForKind = kind => (["repair_counter", "repair_range", "migrate_meter", "replace_references", "exchange_device", "refactor_automation"].includes(kind) ? "repair" : "cleanup");

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
  changesFiltered: "Der Filter blendet alle {n} Einträge dieses Abschnitts aus.",
  lastEntry: "Letzter Eintrag", lastEntryNone: "kein Eintrag gefunden", sortLastEntry: "Letzter Eintrag",
  utName: "Name", utDomain: "Domain", utDevice: "Gerät", utArea: "Bereich", utIntegration: "Integration", utChanged: "Letzte Änderung", utReported: "Letzte Meldung", utSince: "Beobachtet seit", utStats: "Statistik",
  utStatId: "Statistik-ID", utKind: "Art", utUnit: "Einheit", utLast: "Letzter Eintrag", utEnergy: "Energie-Dashboard",
  sortKind: "Art", sortDomain: "Domain", sortDevice: "Gerät", sortIntegration: "Integration", sortChanged: "Letzte Änderung", sortReported: "Letzte Meldung", sortStats: "Statistik",
  allUnits: "Alle Einheiten", allAges: "Letzter Eintrag: jeder", allIntegrations: "Alle Integrationen", statAge30: "Letzter Eintrag älter als 30 Tage", statAge365: "Letzter Eintrag älter als 1 Jahr", statAge730: "Letzter Eintrag älter als 2 Jahre", lastEntryBusyShort: "Recorder beschäftigt",
  statSuccessors: "Mögliche Nachfolger:", orphanStatsHint: "Langzeitstatistiken im Recorder, zu denen es keine Entität mehr gibt, zum Beispiel nach Löschen, Umbenennen oder einem Gerätewechsel. Sie kosten nur Platz. Wurde die Entität umbenannt oder ersetzt, lässt sich die Statistik auf die neue übernehmen: Aufräumen → Zählerwechsel (Statistik fortführen). Ist sie wirklich weg, kannst du die Statistik in Home Assistant unter Entwicklerwerkzeuge → Statistiken entfernen. Housekeeper löscht hier nichts. Nachfolger sind Vermutungen aus Name und Einheit.",
  noBaselinePreliminary: "Der letzte Scan war vorläufig, weil Home Assistant gerade gestartet ist. Vorläufige Scans werden nicht gespeichert. Scanne in ein paar Minuten erneut, dann gibt es einen ersten Vergleichspunkt.", noBaselineOneScan: "Es gibt erst einen gespeicherten Scan. Ein Vergleich braucht zwei: Scanne nach Änderungen an deiner Installation erneut oder warte auf den automatischen Scan (alle {hours} Stunden). Jeder Scan wird als Vergleichspunkt gespeichert.", scanPoint: "Jetzt scannen und Vergleichspunkt setzen",
  releaseAction: "Aus Quarantäne holen", releaseQuestion: "Wieder aktivieren?", releaseNothing: "Nichts zurückzuholen: schon nicht mehr in Quarantäne",
  kindDisableDevice: "Gerät deaktivieren (Quarantäne, umkehrbar)", kindRemoveDevice: "Gerät entfernen (nach Quarantäne, mit Backup)",
  kindForgetDevice: "Gerät lokal vergessen (erzwingen, nach Quarantäne, mit Backup)", kindReplace: "Verweise ersetzen (alt → neu, mit Backup)",
  reason_device_has_working_entities: "Mindestens eine Entität des Geräts funktioniert noch.", reason_has_children: "Andere Geräte hängen an diesem Gerät (Hub oder Koordinator).",
  reason_integration_no_support: "Die Integration bietet kein reguläres Entfernen. Dann bleibt nur „lokal vergessen“.", reason_regular_removal_available: "Die Integration kann das Gerät regulär entfernen; Erzwingen ist dann nicht vorgesehen.",
  reason_forced_forget: "Erzwungen: Die Integration wird nicht gefragt, das Quellsystem (Gerät, Hub, Cloud) bleibt unverändert, und das Gerät kann wiederkehren.",
  reason_restore_limited: "Das Gerät und seine Entitäten werden entfernt. Wiederherstellen legt nur den Registry-Eintrag neu an; ob die Integration die Entitäten wieder bereitstellt, entscheidet sie selbst.",
  reason_target_missing: "Die neue Entität existiert nicht.", reason_same_entity: "Alte und neue Entität sind identisch.", reason_different_domain: "Alte und neue Entität haben unterschiedliche Typen.", reason_target_not_working: "Die neue Entität funktioniert noch nicht.",
  reason_nothing_to_replace: "Nichts, was Housekeeper sicher umschreiben kann.", reason_source_manual: "Nicht alles lässt sich automatisch ersetzen: Templates und nicht bearbeitbare Quellen musst du von Hand anpassen.",
  reason_energy_changes: "Ändert das Energie-Dashboard; die Statistik der neuen Entität beginnt neu.", reason_config_rewrite: "Schreibt Konfiguration um (in YAML-Dateien gehen Kommentare verloren).", reason_unit_differs: "Die Einheiten unterscheiden sich.", reason_class_differs: "Die Geräteklassen unterscheiden sich.",
  source_not_in_yaml: "nicht in der YAML-Datei gefunden (anderswo definiert)", source_yaml_uses_tags: "YAML nutzt !secret oder !include", source_yaml_mode: "YAML-Dashboard", source_not_editable: "nicht bearbeitbar",
  abort_device_gone: "Das Gerät existiert nicht mehr.", abort_device_unsupported: "Dieses Gerät (Untergerät) kann nicht bereinigt werden.", reason_child_device: "Untergeräte lassen sich noch nicht entfernen oder wiederherstellen.", abort_device_changed: "Das Gerät wurde nach der Vorschau geändert.", abort_source_changed: "Eine Konfiguration wurde nach der Vorschau geändert.", abort_rejected_by_integration: "Die Integration hat das Entfernen abgelehnt.",
  abort_integration_no_support: "Die Integration unterstützt das Entfernen nicht.", abort_source_write_failed: "Eine Konfiguration konnte nicht geschrieben werden; bereits geänderte Teile wurden zurückgesetzt.", abort_rollback_incomplete: "Eine Konfiguration wurde geändert und konnte nicht zurückgesetzt werden. Bitte unter „Rückgängig“ erneut versuchen oder das Backup verwenden.",
  check_device_disabled: "Gerät ist deaktiviert", check_device_removed: "Gerät ist entfernt", check_not_recurring: "Das Gerät kam nicht wieder", check_references_replaced: "Keine sicheren Verweise auf die alte Entität mehr",
  undo_conflict_partial: "teilweise rückgängig gemacht; Rest zwischenzeitlich geändert", result_replaced: "Ersetzt",
  confirmWordReplace: "ERSETZEN", confirmedSummaryDeviceDisable: "{count} Geräte werden deaktiviert (Quarantäne). Das ist jederzeit umkehrbar, solange das Gerät unverändert bleibt.",
  confirmedSummaryDeviceRemove: "{count} Geräte werden samt Entitäten entfernt. Vorher legt Housekeeper ein Home-Assistant-Backup an und startet nur, wenn es erfolgreich ist. Wiederherstellen legt den Registry-Eintrag neu an; Entitäten stellt die Integration bereit, wenn sie es kann.",
  confirmedSummaryReplace: "In {count} Entitäts-Verweisen wird die alte durch die neue Entität ersetzt (Automationen, Skripte, Szenen, Dashboards, Energie). Vorher legt Housekeeper ein Home-Assistant-Backup an. Jede Quelle wird vorab gesichert und lässt sich zurücksetzen, solange sie unverändert ist.",
  quarantineHint: "Entitäten und Geräte, die Housekeeper deaktiviert hat. Entfernen ist frühestens nach {days} Tagen möglich. Mit „Aus Quarantäne holen“ aktivierst du ein Objekt wieder.",
  deviceCandidatesHint: "Geräte ohne funktionierende Entitäten. Deaktivieren schickt sie in Quarantäne.", removalDeviceHint: "Geräte in Quarantäne. Entfernen ist erst nach {days} Tagen möglich.", deviceEntities: "{count} Entitäten", sortEntities: "Entitäten",
  replaceTitle: "Verweise ersetzen", replaceHint: "Ersetzt die alte Entität überall dort, wo sie exakt eingetragen ist: Automationen, Skripte, Szenen, Dashboards im Speichermodus und das Energie-Dashboard. Templates und YAML-Dashboards zeigt Housekeeper nur an. Die alte Entität bleibt unverändert; danach kannst du sie in Quarantäne schicken.",
  replaceOld: "Alte Entität (wird ersetzt)", replaceNew: "Neue Entität", replacePreview: "Vorschau erstellen", replaceChanges: "{count} Änderungen", replaceManual: "von Hand prüfen: {count} Templates", replaceNoSources: "Keine Verweise gefunden", replaceSources: "Quellen",
  recurringTitle: "Wiederkehrende Geräte", recurringHint: "Diese Geräte hat Housekeeper vergessen, doch die Integration hat sie wieder angelegt. Deaktivieren ist hier meist sinnvoller; oft muss das Gerät am Quellsystem (Hub, App, Cloud) entfernt werden.", recurringSince: "vergessen am {date} · Integration: {domains}",
});
Object.assign(TEXT.en, {
  changesFiltered: "The filter hides all {n} entries of this section.",
  lastEntry: "Last entry", lastEntryNone: "no entry found", sortLastEntry: "Last entry",
  utName: "Name", utDomain: "Domain", utDevice: "Device", utArea: "Area", utIntegration: "Integration", utChanged: "Last change", utReported: "Last report", utSince: "Observed since", utStats: "Statistics",
  utStatId: "Statistic ID", utKind: "Kind", utUnit: "Unit", utLast: "Last entry", utEnergy: "Energy dashboard",
  sortKind: "Kind", sortDomain: "Domain", sortDevice: "Device", sortIntegration: "Integration", sortChanged: "Last change", sortReported: "Last report", sortStats: "Statistics",
  allUnits: "All units", allAges: "Last entry: any", allIntegrations: "All integrations", statAge30: "Last entry older than 30 days", statAge365: "Last entry older than 1 year", statAge730: "Last entry older than 2 years", lastEntryBusyShort: "Recorder busy",
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
  entrySource: "Eingerichtet über", entryError: "Fehlermeldung", entryId: "Eintrags-ID", entryUniqueId: "Eindeutige ID", entryCreated: "Angelegt", entryModified: "Geändert", entryEntities: "Entitäten", entryDevices: "Geräte",
  entryDocs: "Dokumentation", entryHaPath: "Pfad in Home Assistant", noneValue: "keine",
  src_user: "Manuell hinzugefügt", src_import: "Aus der YAML-Konfiguration übernommen", src_ignore: "Ignorierte Entdeckung", src_system: "System", src_discovery: "Automatisch entdeckt ({source})", src_reauth: "Erneute Anmeldung", src_reconfigure: "Neu konfiguriert",
  cause_entry_ignored: "Diese Integration wurde nie eingerichtet: Du hast eine automatisch entdeckte Instanz ausdrücklich ignoriert. Das ist kein Fehler, und es gibt dazu keine Entitäten.",
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
  propAssignment: "Zuordnung", propProperties: "Eigenschaften", propTechnical: "Technische Angaben", propTimes: "Zeiten", propDevice: "Gerät", propEntities: "Entitäten des Geräts",
  propIntegration: "Integration", propDeviceOf: "Gerät", propArea: "Bereich", propAreaInherited: "{area} (vom Gerät)", propLabels: "Labels", propNone: "–",
  propDomain: "Typ", propDeviceClass: "Geräteklasse", propStateClass: "Zustandsklasse", propUnit: "Einheit", propCategory: "Kategorie", propOriginalName: "Originalname", propAliases: "Aliase", propIcon: "Symbol",
  propDisabledBy: "Deaktiviert durch", propHiddenBy: "Ausgeblendet durch", propEntityId: "Entitäts-ID", propUniqueId: "Eindeutige ID", propPlatform: "Plattform",
  propCreated: "Angelegt", propModified: "Geändert", propLastChanged: "Letzter Zustandswechsel", propLastUpdated: "Letzte Aktualisierung", propLastReported: "Letzte Meldung", statLastEntry: "Letzter Statistik-Eintrag", invOk: "Unauffällig", invCheck: "Prüfen", invProblem: "Problematisch", invHint: "Alle erfassten Objekte", dbOvTitle: "Datenbank", dbOvHint: "Größe des Recorders; gemessen ohne Abfrage der Tabellen.", dbOvSize: "Größe", dbOvWal: "WAL-Datei", dbOvGrowth: "Wachstum", dbOvPerDay: "{size} pro Tag", dbOvObserving: "wird beobachtet", dbOvNoSize: "nicht messbar ({dialect})", dbOvDetails: "Details im Recorder",
  propManufacturer: "Hersteller", propModel: "Modell", propSerial: "Seriennummer", propFirmware: "Firmware", propHardware: "Hardware", propEntryType: "Art", propUserName: "Eigener Name", propOriginalDeviceName: "Name laut Integration",
  propKind: "Art", propKindChild: "Untergerät", propParent: "Übergeordnetes Gerät", propCleanupBlock: "Aufräumen gesperrt", propVia: "Verbunden über", propChildren: "Daran hängen", propChildrenCount: "{count} Geräte", propConfigUrl: "Konfigurationsseite", propDeviceId: "Geräte-ID", propIdentifiers: "Kennungen", propConnections: "Verbindungen",
  propMoreEntities: "… und {count} weitere (siehe Beziehungen)", propNoEntities: "Dieses Gerät hat keine Entitäten.",
  by_user: "Benutzer", by_integration: "Integration", by_config_entry: "Integrationseintrag (deaktiviert)", by_device: "Gerät (deaktiviert)", by_hass: "Home Assistant",
  cat_config: "Konfiguration", cat_diagnostic: "Diagnose", type_service: "Dienst (kein physisches Gerät)",
});
Object.assign(TEXT.en, {
  propAssignment: "Assignment", propProperties: "Properties", propTechnical: "Technical details", propTimes: "Times", propDevice: "Device", propEntities: "Entities of the device",
  propIntegration: "Integration", propDeviceOf: "Device", propArea: "Area", propAreaInherited: "{area} (from the device)", propLabels: "Labels", propNone: "–",
  propDomain: "Type", propDeviceClass: "Device class", propStateClass: "State class", propUnit: "Unit", propCategory: "Category", propOriginalName: "Original name", propAliases: "Aliases", propIcon: "Icon",
  propDisabledBy: "Disabled by", propHiddenBy: "Hidden by", propEntityId: "Entity ID", propUniqueId: "Unique ID", propPlatform: "Platform",
  propCreated: "Created", propModified: "Modified", propLastChanged: "Last state change", propLastUpdated: "Last update", propLastReported: "Last report", statLastEntry: "Last statistics entry", invOk: "Unremarkable", invCheck: "Check", invProblem: "Problematic", invHint: "All recorded objects", dbOvTitle: "Database", dbOvHint: "Size of the recorder; measured without querying the tables.", dbOvSize: "Size", dbOvWal: "WAL file", dbOvGrowth: "Growth", dbOvPerDay: "{size} a day", dbOvObserving: "being observed", dbOvNoSize: "not measurable ({dialect})", dbOvDetails: "Details in Recorder",
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
  reason_no_recorder: "Der Recorder läuft nicht.", reason_old_not_in_registry: "Der alte Zähler ist nicht (mehr) in der Entitäts-Registry; die ID lässt sich nicht tauschen.",
  reason_target_not_in_registry: "Der neue Zähler ist nicht in der Entitäts-Registry.", reason_alt_id_taken: "Es ist keine freie Ausweich-ID für den alten Zähler da.",
  reason_stats_overlap: "Die Statistiken überlappen; nur Werte vor dem Start des neuen Zählers werden kopiert.", reason_stats_gap: "Zwischen altem Ende und neuem Start fehlen Werte.",
  reason_stats_new_empty: "Der neue Zähler hat noch keine Langzeitstatistik; prüfe die Summe nach der ersten Auswertung.",
  reason_stats_no_sum: "Der letzte alte Wert hat keine Summe; die Summe des neuen Zählers wird nicht fortgesetzt.",
  reason_stats_write: "Experimentell: schreibt in die Recorder-Datenbank. Die Statistik lässt sich danach nur mit dem Backup zurücksetzen.",
  reason_id_takeover: "Benennt zwei Entitäten um. Verweise auf die bisherige ID des neuen Zählers funktionieren danach nicht mehr.", reason_target_in_use: "Der neue Zähler wird selbst schon verwendet; diese Verweise müssen angepasst werden.",
  confirmWordMeter: "MIGRIEREN", confirmedSummaryMeter: "{count} Zählerwechsel: Housekeeper legt zuerst ein Home-Assistant-Backup an und startet nur, wenn es erfolgreich ist. Danach schreibt es Langzeitstatistiken und/oder benennt Entitäten um. Die IDs lassen sich zurückgeben, die Statistik nur mit dem Backup.",
  result_migrated: "Migriert", check_meter_statistics: "Statistik fortgeführt", check_meter_id_taken: "Neue Entität trägt die stabile ID", undo_conflict_statistics: "nicht rückgängig: Statistik lässt sich nur mit dem Backup zurücksetzen",
  abort_meter_changed: "Entitäten oder Statistik wurden nach der Vorschau geändert.", abort_statistics_changed: "Die Statistik wurde nach der Vorschau geändert.", abort_statistics_failed: "Die Statistik konnte nicht bestätigt werden; der Lauf wurde angehalten.",
  abort_no_recorder: "Der Recorder läuft nicht.", abort_alt_id_taken: "Die Ausweich-ID ist inzwischen belegt.", abort_id_not_freed: "Home Assistant hat die alte ID nicht rechtzeitig freigegeben; alles wurde zurückgesetzt.", abort_id_takeover_failed: "Das Umbenennen ist fehlgeschlagen; alles wurde zurückgesetzt.",
  // maintenance
  maintenance: "Wartung", maintenanceSubtitle: "Backup-Schutz und Update-Preflight. Beides liest nur; gespeichert wird allein Housekeepers eigener Ausgangszustand und was du als erledigt bestätigst.",
  recorderTitle: "Recorder-Kosten", recorderHint: "Welche Entitäten die Datenbank füllen. Ausschließen verkleinert die Datenbank, löscht aber nichts rückwirkend; Housekeeper ändert die Recorder-Konfiguration nicht.",
  recorderLoad: "Analyse starten", recorderReload: "Neu berechnen", recorderLoading: "Datenbank wird ausgewertet …", recorderUnavailable: "Der Recorder läuft nicht, daher gibt es nichts auszuwerten.",
  recorderSummary: "{states} gespeicherte Zustände · {size} · Aufbewahrung {days} Tage · {stats} Statistikwerte", recorderSizeUnknown: "Größe unbekannt", recorderPerDay: "{count} pro Tag", recorderWindows: "24 h: {day} · 7 Tage: {week} · Ø {avg} pro Tag", recorderSortRecent: "Aktuell (24 h)", recorderSortTotal: "Gesamt", recorderTook: "berechnet in {ms} ms", recorderCached: "Ergebnis von vor wenigen Minuten ({ms} ms)", recorderShare: "{share} % aller Zustände",
  recorderUsed: "{count} Verwendungen", recorderUnused: "nicht verwendet", recorderExcluded: "bereits ausgeschlossen", recorderSuggest: "Ausschluss möglich", recorderStats: "Statistikwerte nach Entität",
  recorderSnippetTitle: "Vorschlag für die configuration.yaml", recorderSnippetHint: "Entitäten, die nichts verwendet, keine Statistik haben und sehr oft schreiben. Prüfe die Liste, bevor du sie übernimmst.", recorderCopy: "Kopieren", recorderCopied: "Kopiert",
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
  maintenance: "Maintenance", maintenanceSubtitle: "Backup protection and update preflight. Both only read; the only things stored are Housekeeper's own starting state and what you confirm as done.",
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
  mtProblems: "{n} Problem(e)", mtNotes: "{n} Hinweis(e)", mtChecks: "{n} Prüfungen", mtPreflight: "Preflight", mtOpen: "{n} offen", mtRecord: "Gespeicherter Stand", mtNoRecord: "keiner",
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
  mtProblems: "{n} problem(s)", mtNotes: "{n} note(s)", mtChecks: "{n} checks", mtPreflight: "Preflight", mtOpen: "{n} open", mtRecord: "Saved state", mtNoRecord: "none",
});

// Texts for the reliability view; merged into TEXT.
Object.assign(TEXT.de, {
  reliability: "Zuverlässigkeit", reliabilitySubtitle: "Wie verfügbar die Entitäten jeder Integration waren und wann sie gemeinsam ausfielen. Liest nur den Recorder.",
  relTitle: "Integrationen nach Verfügbarkeit", relHint: "Schlechteste zuerst. Gerechnet aus den Zuständen im Recorder",
  relWindow1: "24 Stunden", relWindow7: "7 Tage", relRefresh: "Neu berechnen", relLoading: "Der Recorder wird ausgewertet. Das kann bei einer großen Datenbank einige Sekunden dauern …",
  relTab: "Zuverlässigkeit", relAllStates: "Alle Zustände", relOnlyOutages: "Mit gemeinsamen Ausfällen", relOnlyReauth: "Neue Anmeldung nötig", relOnlyNotLoaded: "Nicht geladen", relSortAvail: "Verfügbarkeit", relSortOutages: "Ausfälle", relAgeNote: "Stand: {when}", relFactAvail: "Verfügbarkeit ({days} Tage)", relAffected: "Entitäten mit Ausfallzeit ({n})", relAffectedMore: "Gezeigt werden die {shown} mit der niedrigsten Verfügbarkeit von {total}.", relNoAffected: "Keine Entität dieses Eintrags war im Zeitraum nicht verfügbar.", relOpenEntry: "Integration öffnen",
  stability: "Stabilität", stabilityOk: "Stabil im Zeitraum", stabilityMissing: "Noch nicht berechnet. Die Ansicht Zuverlässigkeit rechnet es aus.", cause_unstable: "Die Entität fällt immer wieder aus: {level}.", hint_unstable: "Prüfe Verbindung, Netz und Integration des Geräts; die Zahlen stehen in der Ansicht Zuverlässigkeit.",
  relSumAvail: "Verfügbarkeit gesamt", relSumOutages: "Integrationen mit Ausfällen", relSumOf: "von {n}", relSumUnstable: "Instabile Entitäten", relSumFlapping: "davon {n} flatternd", relSumAttention: "Brauchen Aufmerksamkeit", relSumAttentionHint: "neue Anmeldung oder nicht geladen", relTabIntegrations: "Integrationen", relTabUnstable: "Instabile Entitäten",
  relTook: "berechnet in {s} s", relCached: "aus dem Zwischenspeicher ({s} s)", relNoRecorder: "Der Recorder von Home Assistant ist nicht verfügbar.",
  relBusy: "Eine andere Berechnung läuft noch. Housekeeper fragt automatisch erneut an.", relEmpty: "Im Zeitraum gibt es keine Zustände von Integrationen.",
  relEntities: "{n} Entitäten", relPermanent: "{n} dauerhaft ausgefallen, nicht eingerechnet",
  relShared: "{n} gemeinsame Ausfälle, längster {longest}", relSharedOne: "1 gemeinsamer Ausfall, {longest}", relLayerCloud: "wahrscheinlich Cloud oder API (Vermutung)", relLayerLocal: "wahrscheinlich Gerät, Netz oder Integration (Vermutung)",
  relReauth: "Neu anmelden offen", relLastShared: "Letzter gemeinsamer Ausfall bis {date} ({duration})", relLastSingle: "Letzte Störung bis {date} ({duration})", relNoDisruption: "Keine Störung",
  relMinutes: "{n} Min.", relHours: "{n} Std.", relDays: "{n} Tage",
  relUnstableTitle: "Instabile Entitäten", relUnstableHint: "Fallen immer wieder aus und kommen zurück. Entitäten mit Folgeobjekten stehen weiter oben.", relUnstableNone: "Keine Entität fällt auffällig oft aus.", relUnstableCoverage: "Beobachtet: {days} Tage, {withData} Entitäten mit Daten. Ausfälle während gemeinsamer Ausfälle sind herausgerechnet; sie zählen für die Integration.",
  relUnstable: "instabil", relFlapping: "flatternd", relEpisodes: "{n} Ausfälle in {days} Tagen ({rate} pro Tag) · zusammen {total}, im Mittel {mean}",
  relPattern: "wiederkehrend, meist zwischen {from} und {to} Uhr", relFollowers: "wird von {n} Automationen, Skripten oder Szenen verwendet", relUnstableMore: "{shown} von {total} Entitäten gezeigt.",
  relUnstableFootnote: "Instabil: mindestens {episodes} Ausfälle und {rate} pro Tag, flatternd ab {flap} pro Tag. Ausfälle während eines gemeinsamen Ausfalls der Integration zählen für die Integration, nicht für die Entität. Dauerhaft ausgefallene, deaktivierte und ignorierte Entitäten fehlen.",
  relCoverage: "Letzte {days} Tage · {withData} von {known} Entitäten mit Daten · im Mittel {share} % des Zeitraums beobachtet (neue Entitäten kürzer).",
  relCompare: "Mit Zeitraum davor vergleichen", relDelta: "{delta} Prozentpunkte gegenüber dem Zeitraum davor ({before} %)", relDeltaNone: "Für den Zeitraum davor liegen keine Daten vor.",
  relFootnote: "Verfügbarkeit: Anteil der Zeit ohne „nicht verfügbar“ in den letzten {days} Tagen, gerechnet ab der ersten Meldung im Zeitraum. Ein gemeinsamer Ausfall heißt: mindestens {share} % der Entitäten des Eintrags, mindestens {entities}, mindestens {minutes} Minuten zugleich nicht verfügbar. Ein Ausfall, der vor dem Zeitraum begann, zählt erst ab der ersten Meldung darin.",
  relIntHint: "Schlechteste zuerst. Verfügbarkeit je Integration, gerechnet aus den Zuständen ihrer Entitäten.", relSortRank: "Standard", relSortEpisodes: "Ausfälle", relSortRate: "Ausfälle pro Tag", relSortDuration: "Gesamtdauer", relOnlyFlapping: "Nur flatternd", relOnlyUnstable: "Nur instabil",
});
Object.assign(TEXT.en, {
  reliability: "Reliability", reliabilitySubtitle: "How available each integration's entities were and when they failed together. Only reads the recorder.",
  relTitle: "Integrations by availability", relHint: "Worst first. Calculated from the states in the recorder",
  relWindow1: "24 hours", relWindow7: "7 days", relRefresh: "Recalculate", relLoading: "Evaluating the recorder. On a large database this can take a few seconds …",
  relTab: "Reliability", relAllStates: "All states", relOnlyOutages: "With shared outages", relOnlyReauth: "Re-authentication open", relOnlyNotLoaded: "Not loaded", relSortAvail: "Availability", relSortOutages: "Outages", relAgeNote: "As of {when}", relFactAvail: "Availability ({days} days)", relAffected: "Entities with downtime ({n})", relAffectedMore: "Showing the {shown} with the lowest availability of {total}.", relNoAffected: "No entity of this entry was unavailable in the period.", relOpenEntry: "Open integration",
  stability: "Stability", stabilityOk: "Stable in the period", stabilityMissing: "Not calculated yet. The Reliability view calculates it.", cause_unstable: "The entity keeps failing: {level}.", hint_unstable: "Check the connection, network and integration of the device; the numbers are in the Reliability view.",
  relSumAvail: "Availability overall", relSumOutages: "Integrations with outages", relSumOf: "of {n}", relSumUnstable: "Unstable entities", relSumFlapping: "{n} of them flapping", relSumAttention: "Need attention", relSumAttentionHint: "re-authentication or not loaded", relTabIntegrations: "Integrations", relTabUnstable: "Unstable entities",
  relTook: "calculated in {s} s", relCached: "from the cache ({s} s)", relNoRecorder: "The Home Assistant recorder is not available.",
  relBusy: "Another calculation is still running. Housekeeper asks again by itself.", relEmpty: "There are no integration states in this period.",
  relEntities: "{n} entities", relPermanent: "{n} down all the time, not counted",
  relShared: "{n} shared outages, longest {longest}", relSharedOne: "1 shared outage, {longest}", relLayerCloud: "probably the cloud or its API (a guess)", relLayerLocal: "probably the device, the network or the integration (a guess)",
  relReauth: "Re-authentication open", relLastShared: "Last shared outage until {date} ({duration})", relLastSingle: "Last disruption until {date} ({duration})", relNoDisruption: "No disruption",
  relMinutes: "{n} min", relHours: "{n} h", relDays: "{n} days",
  relUnstableTitle: "Unstable entities", relUnstableHint: "They keep failing and coming back. Entities with dependants come first.", relUnstableNone: "No entity fails unusually often.", relUnstableCoverage: "Observed: {days} days, {withData} entities with data. Failures during shared outages are taken out; they count for the integration.",
  relUnstable: "unstable", relFlapping: "flapping", relEpisodes: "{n} failures in {days} days ({rate} a day) · {total} in all, {mean} on average",
  relPattern: "recurring, mostly between {from} and {to} o'clock", relFollowers: "used by {n} automations, scripts or scenes", relUnstableMore: "{shown} of {total} entities shown.",
  relUnstableFootnote: "Unstable: at least {episodes} failures and {rate} a day, flapping from {flap} a day. Failures during a shared outage of the integration count for the integration, not the entity. Entities that are down all the time, disabled or ignored are left out.",
  relCoverage: "Last {days} days · {withData} of {known} entities with data · on average {share} % of the period observed (new entities less).",
  relCompare: "Compare with the period before", relDelta: "{delta} percentage points against the period before ({before} %)", relDeltaNone: "There is no data for the period before.",
  relFootnote: "Availability: the share of time without “unavailable” in the last {days} days, counted from the first report in the period. A shared outage means at least {share} % of the entry's entities, at least {entities}, were unavailable together for at least {minutes} minutes. An outage that began before the period counts from the first report in it.",
  relIntHint: "Worst first. Availability per integration, calculated from the states of its entities.", relSortRank: "Default", relSortEpisodes: "Outages", relSortRate: "Outages per day", relSortDuration: "Total duration", relOnlyFlapping: "Flapping only", relOnlyUnstable: "Unstable only",
});

// Texts for the automation runs view; merged into TEXT.
Object.assign(TEXT.de, {
  runsSumRuns: "Gezählte Läufe", runsSumOf: "von {n} Automationen und Skripten", runsSumShare: "{n} % der Läufe", runsSumFlagged: "Auffällig", runsSumNeverOk: "Nie erfolgreich",
  runs: "Automationen", runsHeading: "Automationen im Betrieb", runsSubtitle: "Wie oft Automationen und Skripte laufen, scheitern oder ohne Wirkung enden. Gezählt aus den Läufen, die Home Assistant kurz vorhält.",
  runsTitle: "Auffällig", runsHint: "Letzte 7 Tage. Ein fehlerfreier Lauf heißt nicht, dass die Automation ihren Zweck erfüllt",
  runsSince: "Gezählt seit {date}; ältere Läufe sind in Home Assistant nicht mehr vorhanden.", runsRefresh: "Neu zählen",
  runsLoading: "Die Läufe werden gezählt …", runsNone: "Nichts Auffälliges in den gezählten Läufen.", runsFactNone: "Noch keine Läufe gezählt", runsAllOutcomes: "Alle Läufe", runsOnlyErrors: "Mit Fehlern", runsOnlyFlagged: "Mit Auffälligkeit", runsNoData: "Noch keine Läufe gezählt. Der Zähler liest alle 15 Minuten.",
  runsAll: "Alle gezählten Läufe", runsColName: "Name", runsColRuns: "Läufe", runsColErrors: "Fehler", runsColConditions: "Bedingung", runsColDuration: "Dauer Ø / max", runsColTrend: "7 Tage",
  runsCoverageFull: "Letzte {days} Tage · alle Zahlen vollständig, soweit Home Assistant die Läufe noch kannte.", runsCoverageLower: "Letzte {days} Tage · bei {n} Einträgen nur „mindestens“: der Trace-Speicher war voll, Läufe können fehlen.",
  rfHint_failing: "Prüfe die Ablaufverfolgung der Automation an der genannten Stelle.", rfHint_overlap: "Modus oder maximale Läufe anpassen oder die Auslöser entflechten.", rfHint_never_ok: "Ein Schritt oder eine Bedingung verhindert jeden Erfolg; die Ablaufverfolgung zeigt wo.", rfHint_no_effect: "Die Bedingung stoppt fast jeden Lauf; prüfe, ob sie noch passt oder der Auslöser zu breit ist.", rfHint_burst: "Prüfe, was die Automation so oft auslöst.", rfHint_long_run: "Prüfe Wartezeiten und Aktionen, die lange dauern.", rfHint_after_update: "Prüfe die Änderungen der neuen Version.", rfHint_long_wait: "Ein Neustart verwirft die Wartezeit; erwäge einen Zeitplan oder Auslöser statt Warten.", rfHint_wait_no_timeout: "Setze ein Zeitlimit, damit ein Lauf nicht ewig hängt.", rfHint_continue_on_error: "Fehler werden still übergangen; prüfe, ob das gewollt ist.",
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
  cfTitle: "Konflikte und Schleifen", cfHint: "Aus den Konfigurationen und den Tageszahlen der Läufe. Das ist eine Vermutung, kein Beweis: Housekeeper führt nichts aus.", cfNone: "Keine möglichen Konflikte oder Schleifen gefunden.",
  cfStage_static: "möglich", cfStage_observed: "beobachtet", cfStage_confirmed: "wiederholt",
  cfOpposing: "{first} und {second} steuern {entity} gegensätzlich ({a} gegen {b}).", cfLoop: "{chain} führen im Kreis über {path} zurück zum Anfang.",
  cfWhy_trigger: "Beide reagieren auf {detail} und können gemeinsam auslösen.", cfWhy_window: "Beide dürfen im Zeitfenster {detail} laufen.",
  cfSeen: "An {n} von 7 Tagen liefen alle beteiligten Automationen. Gezählt wird je Tag, die Reihenfolge der Läufe ist nicht bekannt.", cfSeenLoop: "An {n} von 7 Tagen lief jede beteiligte Automation mindestens {min}-mal. Gezählt wird je Tag.",
  cfStatic: "Nur die Konfiguration erlaubt es; es gibt noch keine passenden Läufe.", cfHint_opposing: "Prüfe Bedingungen und Zeiten, damit nur eine Automation gewinnt, oder lege beide Befehle in eine Automation.", cfHint_loop: "Prüfe die Filter der Auslöser (zum Beispiel „auf“) oder eine Bedingung, die den Kreis unterbricht.",
});
Object.assign(TEXT.en, {
  runsSumRuns: "Counted runs", runsSumOf: "of {n} automations and scripts", runsSumShare: "{n} % of the runs", runsSumFlagged: "Flagged", runsSumNeverOk: "Never successful",
  runs: "Automations", runsHeading: "Automations in operation", runsSubtitle: "How often automations and scripts run, fail or end without effect. Counted from the runs Home Assistant keeps for a short time.",
  runsTitle: "Needs a look", runsHint: "Last 7 days. A run without an error does not mean the automation does its job",
  runsSince: "Counted since {date}; older runs are no longer in Home Assistant.", runsRefresh: "Count again",
  runsLoading: "Counting the runs …", runsNone: "Nothing stands out in the counted runs.", runsFactNone: "No runs counted yet", runsAllOutcomes: "All runs", runsOnlyErrors: "With errors", runsOnlyFlagged: "Flagged", runsNoData: "No runs counted yet. The counter reads every 15 minutes.",
  runsAll: "All counted runs", runsColName: "Name", runsColRuns: "Runs", runsColErrors: "Errors", runsColConditions: "Condition", runsColDuration: "Duration avg / max", runsColTrend: "7 days",
  runsCoverageFull: "Last {days} days · all numbers complete as far as Home Assistant still knew the runs.", runsCoverageLower: "Last {days} days · “at least” for {n} entries: the trace store was full, runs may be missing.",
  rfHint_failing: "Check the automation's trace at the named step.", rfHint_overlap: "Adjust the mode or max runs, or untangle the triggers.", rfHint_never_ok: "A step or condition prevents every success; the trace shows where.", rfHint_no_effect: "The condition stops almost every run; check whether it still fits or the trigger is too broad.", rfHint_burst: "Check what fires the automation so often.", rfHint_long_run: "Check waits and actions that take long.", rfHint_after_update: "Check the changes of the new version.", rfHint_long_wait: "A restart discards the wait; consider a schedule or trigger instead of waiting.", rfHint_wait_no_timeout: "Set a timeout so a run cannot hang forever.", rfHint_continue_on_error: "Errors are passed over silently; check whether that is intended.",
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
  cfTitle: "Conflicts and loops", cfHint: "From the configurations and the daily numbers of the runs. This is a guess, not proof: Housekeeper runs nothing.", cfNone: "No possible conflicts or loops found.",
  cfStage_static: "possible", cfStage_observed: "observed", cfStage_confirmed: "repeated",
  cfOpposing: "{first} and {second} control {entity} in opposite ways ({a} against {b}).", cfLoop: "{chain} lead around in a circle via {path} back to the start.",
  cfWhy_trigger: "Both react to {detail} and can fire together.", cfWhy_window: "Both may run in the time window {detail}.",
  cfSeen: "On {n} of 7 days all involved automations ran. Counting is per day, the order of the runs is not known.", cfSeenLoop: "On {n} of 7 days every involved automation ran at least {min} times. Counting is per day.",
  cfStatic: "Only the configuration allows it; there are no matching runs yet.", cfHint_opposing: "Check conditions and times so only one automation wins, or put both commands into one automation.", cfHint_loop: "Check the trigger filters (for example “to”) or a condition that breaks the circle.",
});

// Texts for the settings page; merged into TEXT.
Object.assign(TEXT.de, {
  setTabLook: "Darstellung", setTabScan: "Scan und Schwellen", setTabHidden: "Ausgeblendet", setTabInfo: "Info",
  setReadability: "Lesbarkeit",
  unitDays: "Tage", unitHours: "Std.", unitPercent: "%", optDefault: "Standard: {n} {unit}",
  optMinUnavailableTitle: "Nicht verfügbar", optMinUnavailableHint: "Ab wie vielen Tagen ohne Zustand eine Entität als Befund gilt. 0 meldet sofort.",
  optUnusedAutomationTitle: "Ungenutzte Automationen", optUnusedAutomationHint: "Ab wie vielen Tagen ohne Auslösung eine Automation als ungenutzt gilt. 0 schaltet die Prüfung aus.",
  optScanIntervalTitle: "Automatischer Scan", optScanIntervalHint: "Wie oft Housekeeper von selbst scannt. 0 schaltet den automatischen Scan aus.",
  optLowBatteryTitle: "Schwache Batterie", optLowBatteryHint: "Unter diesem Ladestand erscheint ein Batteriegerät in der Liste der schwachen Batterien.",
  optHistoryDaysTitle: "Scanverlauf", optHistoryDaysHint: "Wie viele Tage der letzte Scan jedes Tages als Vergleichspunkt erhalten bleibt.",
  quickPlaceholder: "Suchen …", quickLabel: "Alles durchsuchen", quickNone: "Keine Treffer",
  viewsLabel: "Gespeicherte Ansichten", viewsNone: "Ansichten …", viewSave: "Ansicht speichern", viewDelete: "Ansicht löschen", viewName: "Name der Ansicht (bleibt nur in diesem Browser)",
  exclLine: "Nicht mitgezählt: {list}.", exclIgnored: "{n} ausgeblendet", exclDisabled: "{n} deaktiviert", exclPermanent: "{n} dauerhaft ausgefallen",
  setKeptTitle: "Was Housekeeper speichert", setKeptHint: "Alles liegt im Speicher von Home Assistant (.storage) und verlässt deine Instanz nicht.",
  setKeptObservations: "Beobachtungen", setKeptObservationsText: "Seit wann ein Objekt in seinem Zustand ist. Bleibt, solange das Objekt existiert.",
  setKeptHistory: "Scanverlauf", setKeptHistoryText: "Der letzte Scan jedes Tages als Vergleichspunkt, {days} Tage lang.",
  setKeptJournal: "Journal", setKeptJournalText: "Pläne des Aufräumens mit Ergebnis und Rückgängig-Angaben. Nie ausgeführte Pläne kannst du löschen; ausgeführte bleiben als Nachweis. Alte Dateisnapshots werden verdichtet, wenn die Größenbegrenzung erreicht ist.",
  setKeptEvents: "Ereignisse", setKeptEventsText: "Neustarts, Versionswechsel von Home Assistant und Integrationen sowie ausgeführte Pläne, höchstens 5.000 Einträge.",
  setKeptRuns: "Automationsläufe", setKeptRunsText: "Zähler je Automation und Tag aus den Läufen (ohne Variablen, Auslöserdaten und Fehlertexte), 60 Tage lang.",
  setPrivacy: "Housekeeper sendet nichts nach außen. Die Auswertung der Datenbank liest nur und merkt sich keine Zustandswerte.",
  setLinks: "Links",
});
Object.assign(TEXT.en, {
  setTabLook: "Appearance", setTabScan: "Scan and thresholds", setTabHidden: "Hidden", setTabInfo: "Info",
  setReadability: "Readability",
  unitDays: "days", unitHours: "h", unitPercent: "%", optDefault: "Default: {n} {unit}",
  optMinUnavailableTitle: "Unavailable", optMinUnavailableHint: "After how many days without a state an entity becomes a finding. 0 reports at once.",
  optUnusedAutomationTitle: "Unused automations", optUnusedAutomationHint: "After how many days without a trigger an automation counts as unused. 0 turns the check off.",
  optScanIntervalTitle: "Automatic scan", optScanIntervalHint: "How often Housekeeper scans by itself. 0 turns the automatic scan off.",
  optLowBatteryTitle: "Low battery", optLowBatteryHint: "Below this level a battery device appears in the list of low batteries.",
  optHistoryDaysTitle: "Scan history", optHistoryDaysHint: "How many days the last scan of each day is kept as a comparison point.",
  quickPlaceholder: "Search …", quickLabel: "Search everything", quickNone: "No results",
  viewsLabel: "Saved views", viewsNone: "Views …", viewSave: "Save view", viewDelete: "Delete view", viewName: "Name of the view (stays in this browser only)",
  exclLine: "Not counted: {list}.", exclIgnored: "{n} hidden", exclDisabled: "{n} disabled", exclPermanent: "{n} down all the time",
  setKeptTitle: "What Housekeeper stores", setKeptHint: "Everything lives in Home Assistant's storage (.storage) and does not leave your instance.",
  setKeptObservations: "Observations", setKeptObservationsText: "Since when an object has been in its state. Kept as long as the object exists.",
  setKeptHistory: "Scan history", setKeptHistoryText: "The last scan of each day as a comparison point, for {days} days.",
  setKeptJournal: "Journal", setKeptJournalText: "Cleanup plans with their result and undo details. You can delete plans that were never run; executed ones stay as the audit trail. Old file snapshots are condensed when the size limit is reached.",
  setKeptEvents: "Events", setKeptEventsText: "Restarts, version changes of Home Assistant and integrations, and executed plans, at most 5,000 entries.",
  setKeptRuns: "Automation runs", setKeptRunsText: "Counters per automation and day from the runs (without variables, trigger data and error texts), for 60 days.",
  setPrivacy: "Housekeeper sends nothing out. The database evaluation only reads and does not remember state values.",
  setLinks: "Links",
});

// Texts for the recorder load view; merged into TEXT.
Object.assign(TEXT.de, {
  recSumRows: "Zeilen pro Tag", recSumLoudest: "Lauteste Entität", recSumDb: "Datenbank", recSumPurgeOff: "Bereinigung aus", recSumFindings: "Auffälligkeiten",
  recorder: "Recorder", recorderSubtitle: "Was den Recorder am meisten beschreibt, was die Datenbank füllt und wie gesund sie ist. Liest nur den Recorder.",
  stormTitle: "Last im Recorder", stormHint: "Gezählt werden geschriebene Zeilen, nicht Aufrufe", stormLoading: "Der Recorder wird ausgewertet. Das kann bei einer großen Datenbank einige Sekunden dauern …",
  stormNone: "Nichts schreibt auffällig viel.", stormSummary: "Im Zeitraum: {rows} Zeilen ({perDay} pro Tag) von {entities} Entitäten und {events} Ereignisse.",
  stormKind_storm: "Sturm", stormKind_attribute_flood: "Attribute", stormKind_no_new_state: "ohne neuen Zustand", stormKind_integration_share: "Anteil", stormKind_event_burst: "Ereignisse",
  stormStorm: "{perDay} Zeilen pro Tag, in der lautesten Stunde {peak}.", stormFlood: "{perDay} Zeilen am letzten Tag, im Mittel {kb} KB Attribute je Zeile.",
  stormNoNew: "{share} % der Zeilen sind Updates ohne neuen Zustand ({perDay} pro Tag): nur Attribute ändern sich.", stormShare: "Etwa {share} % der Last im Recorder ({perDay} Zeilen pro Tag).",
  stormEvent: "{count} Ereignisse vom Typ {type} im Zeitraum.", stormFollowers: "Daran hängen: {list}.",
  stormRows: "{rows} Zeilen ({perDay} pro Tag)", stormNoNewShort: "{share} % ohne neuen Zustand", stormAttr: "Attribute im Mittel {kb} KB", stormPeak: "lauteste Stunde {n} Zeilen", stormPerDay: "pro Tag",
  stormLoudest: "Lauteste Entitäten", stormLoudestHint: "Nach geschriebenen Zeilen. Klick öffnet die Detailseite.",
  stormShares: "Anteile der Integrationen", stormSharesHint: "Geschätzter Anteil an der Last, gewichtet mit der Größe der Zeilen. Die Prozentwerte sind eine Hochrechnung, keine Messung in Byte.",
  stormShareLine: "{entities} Entitäten, {rows} Zeilen pro Tag, {rowShare} % der Zeilen",
  stormEvents: "Ereignisse nach Typ", stormEventsHint: "Die häufigsten Typen im Zeitraum.",
  stormFootnote: "Eine Zeile entsteht, wenn sich Zustand oder Attribute einer Entität ändern. Identische Updates schreibt Home Assistant gar nicht; „ohne neuen Zustand“ heißt: der Wert blieb gleich, nur Attribute änderten sich. Die Attributgröße gilt für die letzten 24 Stunden. Housekeeper ändert die Recorder-Einstellungen nicht: ausschließen kannst du Entitäten in der Konfiguration unter recorder, oder das Aktualisierungsintervall der Quelle erhöhen.",
});
Object.assign(TEXT.en, {
  recSumRows: "Rows a day", recSumLoudest: "Loudest entity", recSumDb: "Database", recSumPurgeOff: "purging off", recSumFindings: "Findings",
  recorder: "Recorder", recorderSubtitle: "What writes the most to the recorder, what fills the database and how healthy it is. Only reads the recorder.",
  stormTitle: "Recorder load", stormHint: "Rows written are counted, not calls", stormLoading: "Evaluating the recorder. On a large database this can take a few seconds …",
  stormNone: "Nothing writes unusually much.", stormSummary: "In the period: {rows} rows ({perDay} a day) from {entities} entities and {events} events.",
  stormKind_storm: "Storm", stormKind_attribute_flood: "Attributes", stormKind_no_new_state: "no new state", stormKind_integration_share: "Share", stormKind_event_burst: "Events",
  stormStorm: "{perDay} rows a day, {peak} in the busiest hour.", stormFlood: "{perDay} rows on the last day, {kb} KB of attributes per row on average.",
  stormNoNew: "{share} % of the rows are updates without a new state ({perDay} a day): only attributes change.", stormShare: "About {share} % of the recorder load ({perDay} rows a day).",
  stormEvent: "{count} events of type {type} in the period.", stormFollowers: "Depending on it: {list}.",
  stormRows: "{rows} rows ({perDay} a day)", stormNoNewShort: "{share} % without a new state", stormAttr: "attributes {kb} KB on average", stormPeak: "busiest hour {n} rows", stormPerDay: "a day",
  stormLoudest: "Loudest entities", stormLoudestHint: "By rows written. A click opens the detail page.",
  stormShares: "Integration shares", stormSharesHint: "Estimated share of the load, weighted by the size of the rows. The percentages are an extrapolation, not a measurement in bytes.",
  stormShareLine: "{entities} entities, {rows} rows a day, {rowShare} % of the rows",
  stormEvents: "Events by type", stormEventsHint: "The most frequent types in the period.",
  stormFootnote: "A row is written when the state or the attributes of an entity change. Home Assistant does not write identical updates at all; “without a new state” means the value stayed the same and only attributes changed. The attribute size covers the last 24 hours. Housekeeper does not change the recorder settings: you can exclude entities in the configuration under recorder, or raise the update interval of the source.",
});

// Texts for the database card; merged into TEXT.
Object.assign(TEXT.de, {
  dbKeep: "Aufbewahrung in Home Assistant: {n} Tage", dbOvKeep: "Aufbewahrung", dbOvKeepDays: "{n} Tage", dbOvPurgeOff: "Die automatische Bereinigung ist in Home Assistant aus: die Datenbank wächst weiter.",
  dbTitle: "Datenbank", dbHint2: "Größe, Statistiken und Lücken im Recorder. Nur lesend", dbLoading: "Die Datenbank wird geprüft. Das kann bei einer großen Datenbank einige Sekunden dauern …",
  dbNone: "Keine Auffälligkeit in der Datenbank.", dbProblem: "Problem", dbHint: "Hinweis",
  dbSize: "Datenbank {db}, WAL-Datei {wal}", dbNoSize: "Größe nicht messbar (Datenbank: {dialect}); nur SQLite wird gemessen", dbPerDay: "Wachstum zuletzt etwa {size} pro Tag", dbGrowthUnknown: "Das Wachstum wird beobachtet; nach einer Woche steht es hier", dbRestartGaps: "{n} Lücken durch Neustarts (normal)",
  dbKind_wal_large: "Große WAL-Datei", dbKind_growth: "Ungewöhnliches Wachstum", dbKind_duplicates: "Doppelte Statistikzeitpunkte", dbKind_missing_hours: "Fehlende Stunden in Statistiken", dbKind_statistics_issues: "Statistik passt nicht zur Entität", dbKind_recorder_gap: "Lücken im Recorder",
  dbWal: "Die WAL-Datei ist {wal} groß, die Datenbank {db}.", dbGrowth: "In 7 Tagen {recent} gewachsen, in den Wochen davor etwa {base} pro Woche.",
  dbDuplicates: "{n}{more} Zeitpunkte stehen doppelt in den Statistiken, vor allem bei: {list}.", dbMissing: "{n} Reihen haben Lücken im Stundenverlauf: {list}.", dbMissingHours: "{n} Std. fehlen",
  dbIssues: "{n} Reihen: {list}.", dbRecorderGap: "{n} Zeiträume ohne einen einzigen Eintrag, der längste {longest}, zuletzt ab {latest}. Kein Neustart erklärt sie.",
  dbIssue_units_changed: "Einheit geändert", dbIssue_unsupported_state_class: "State-Class nicht unterstützt", dbIssue_state_class_removed: "State-Class entfernt", dbIssue_unsupported_unit: "Einheit nicht unterstützt", dbIssue_mean_type_changed: "Art des Mittelwerts geändert",
  dbAdvice_wal_large: "Ein Neustart oder ein Checkpoint verkleinert die WAL-Datei; bleibt sie groß, prüfe, ob etwas die Datenbank lange offen hält. Erst ein Backup anlegen.",
  dbAdvice_growth: "Die Ansicht „Last“ zeigt, wer so viel schreibt. Danach Entitäten vom Recorder ausschließen oder die Aufbewahrung senken.",
  dbAdvice_duplicates: "Housekeeper repariert das nicht. Lege ein Backup an und prüfe die Reihen in Entwicklerwerkzeuge → Statistiken.",
  dbAdvice_missing_hours: "Gemeinsame Lücken lassen sich nicht nachholen: Home Assistant stand oder der Recorder arbeitete nicht. Eigene Lücken heißen meist, dass die Entität zeitweise nicht verfügbar war.",
  dbAdvice_statistics_issues: "Entwicklerwerkzeuge → Statistiken bietet an, die Einheit zu korrigieren oder die Reihe zu löschen. Vorher ein Backup anlegen.",
  dbAdvice_recorder_gap: "Prüfe das Protokoll auf Recorder-Fehler (Datenbank gesperrt, Platte voll) und sichere die Datenbank.",
  dbFootnote: "Gemessen wird nur lesend. Die Größe der Datenbank wird jeden Tag notiert (nur die Zahl), daraus entsteht das Wachstum. Eine Lücke ist ein Zeitraum von mindestens {gap} Minuten ohne einen einzigen Eintrag in den Zuständen der letzten {gapDays} Tage; endet sie, wo Home Assistant nach seinem eigenen Protokoll stand, gilt sie als Neustart. Fehlende Stunden zählen ab {missing} in den letzten {missingDays} Tagen. Housekeeper repariert nichts und löscht nichts.",
  todoDbProblem: "Datenbank: Problem",
  stormTabFindings: "Auffälligkeiten", stormTabEntities: "Lauteste Entitäten", stormTabIntegrations: "Integrationen", stormTabEvents: "Ereignisse", dbMissingShared: "{n} Reihen haben Lücken im Stundenverlauf. Bei allen Reihen zugleich fehlen {hours} Stunden in {count} Zeiträumen; dort wurde keine Statistik berechnet.", dbMissingOwn: "{n} Reihen haben darüber hinaus eigene Lücken, vor allem: {list}.", dbMissingOnlyShared: "Alle Lücken fallen in diese gemeinsamen Zeiträume.", dbGapCause_restart: "Home Assistant stand (Neustart)", dbGapCause_recorder: "Recorder lief nicht oder die Statistik wurde nicht berechnet", dbDetails: "Details: {gaps} gemeinsame Zeiträume, {series} Reihen", dbGapsTitle: "Gemeinsame Lücken (bei allen Reihen)", dbSeriesTitle: "Reihen mit fehlenden Stunden", dbColSeries: "Reihe", dbColOwn: "Eigene", dbColShared: "Gemeinsame", dbColMissing: "Gesamt",
});
Object.assign(TEXT.en, {
  dbKeep: "Retention in Home Assistant: {n} days", dbOvKeep: "Retention", dbOvKeepDays: "{n} days", dbOvPurgeOff: "Automatic purging is off in Home Assistant: the database keeps growing.",
  dbTitle: "Database", dbHint2: "Size, statistics and gaps in the recorder. Read only", dbLoading: "Checking the database. On a large database this can take a few seconds …",
  dbNone: "Nothing unusual in the database.", dbProblem: "Problem", dbHint: "Hint",
  dbSize: "Database {db}, WAL file {wal}", dbNoSize: "Size not measurable (database: {dialect}); only SQLite is measured", dbPerDay: "Recent growth about {size} a day", dbGrowthUnknown: "Growth is being observed; it shows here after a week", dbRestartGaps: "{n} gaps from restarts (normal)",
  dbKind_wal_large: "Large WAL file", dbKind_growth: "Unusual growth", dbKind_duplicates: "Duplicate statistics timestamps", dbKind_missing_hours: "Missing hours in statistics", dbKind_statistics_issues: "Statistics do not fit the entity", dbKind_recorder_gap: "Gaps in the recorder",
  dbWal: "The WAL file is {wal}, the database {db}.", dbGrowth: "Grew {recent} in 7 days, about {base} a week in the weeks before.",
  dbDuplicates: "{n}{more} timestamps appear twice in the statistics, mostly in: {list}.", dbMissing: "{n} series have gaps in their hourly record: {list}.", dbMissingHours: "{n} h missing",
  dbIssues: "{n} series: {list}.", dbRecorderGap: "{n} periods without a single entry, the longest {longest}, the latest from {latest}. No restart explains them.",
  dbIssue_units_changed: "unit changed", dbIssue_unsupported_state_class: "state class not supported", dbIssue_state_class_removed: "state class removed", dbIssue_unsupported_unit: "unit not supported", dbIssue_mean_type_changed: "mean type changed",
  dbAdvice_wal_large: "A restart or a checkpoint shrinks the WAL file; if it stays large, check whether something keeps the database open for long. Create a backup first.",
  dbAdvice_growth: "The Load view shows who writes so much. Then exclude entities from the recorder or lower the retention.",
  dbAdvice_duplicates: "Housekeeper does not repair this. Create a backup and check the series in Developer tools → Statistics.",
  dbAdvice_missing_hours: "Shared gaps cannot be made up: Home Assistant was down or the recorder was not working. Own gaps usually mean the entity was unavailable for a while.",
  dbAdvice_statistics_issues: "Developer tools → Statistics offers to fix the unit or delete the series. Create a backup first.",
  dbAdvice_recorder_gap: "Check the log for recorder errors (database locked, disk full) and back up the database.",
  dbFootnote: "Only reads. The size of the database is noted once a day (just the number); the growth comes from that. A gap is a stretch of at least {gap} minutes without a single entry in the states of the last {gapDays} days; if it ends where Home Assistant was down according to its own log, it counts as a restart. Missing hours count from {missing} in the last {missingDays} days. Housekeeper repairs nothing and deletes nothing.",
  todoDbProblem: "Database: problem",
  stormTabFindings: "Findings", stormTabEntities: "Loudest entities", stormTabIntegrations: "Integrations", stormTabEvents: "Events", dbMissingShared: "{n} series have gaps in their hourly record. {hours} hours are missing from all series at once, in {count} periods; no statistics were compiled then.", dbMissingOwn: "{n} series have gaps of their own on top of that, mostly: {list}.", dbMissingOnlyShared: "All gaps fall into these shared periods.", dbGapCause_restart: "Home Assistant was down (restart)", dbGapCause_recorder: "The recorder was not running or the statistics were not compiled", dbDetails: "Details: {gaps} shared periods, {series} series", dbGapsTitle: "Shared gaps (all series)", dbSeriesTitle: "Series with missing hours", dbColSeries: "Series", dbColOwn: "Own", dbColShared: "Shared", dbColMissing: "Total",
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
    if (["auto", "de", "en"].includes(saved.language)) prefs.language = saved.language;
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
    const darkNow = this.isDark();
    let vars = `--hk-fs:${SIZES[size] || 1};font-size:calc(14px*${SIZES[size] || 1});--hk-sh-rgb:${darkNow ? "0,0,0" : "19,28,23"};--hk-hi:inset 0 1px 0 rgba(255,255,255,${darkNow ? ".05" : ".7"})`;
    if (!(scheme === "standard" && mode === "auto")) {
      const dark = this.isDark(), p = (SCHEMES[scheme] || SCHEMES.standard)[dark ? "dark" : "light"];
      vars += `;--hk-blue:${p.accent};--hk-bg:${p.bg};--hk-surface:${p.surface};--hk-soft:${p.soft};--hk-text:${p.text};--hk-muted:${p.muted};--hk-border:${p.border};--hk-on:${p.on || "#ffffff"};--hk-green:${p.positive};--hk-amber:${p.warning};--hk-red:${p.danger};color-scheme:${dark ? "dark" : "light"}`;
    }
    const compact = this.prefs.density === "compact" ? `.row{padding-top:6px;padding-bottom:6px}.card{padding:10px 12px}.panelhead{min-height:44px;padding-top:8px;padding-bottom:8px}td{padding:6px 14px}th{padding:7px 14px}.nav{min-height:36px}.tile{width:30px;height:30px}.setrow{padding-top:9px;padding-bottom:9px}.chips{padding-top:8px;padding-bottom:8px}.listbar{padding-top:8px;padding-bottom:8px}.summary,.stack,.grid2{gap:10px}.heading{margin-bottom:14px}` : "";
    const calm = "*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}.taskcard:hover{transform:none!important}";
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

// Texts for the exposure view; merged into TEXT.
Object.assign(TEXT.de, {
  expoIntro: "Hier siehst du, welche Entitäten Sprachassistenten (Assist, Alexa, Google Assistant) und HomeKit-Bridges erreichen können, und was dabei auffällt. Ein Klick auf eine Kachel zeigt die Entitäten.", expoSumEntities: "Entitäten freigegeben", expoSumFindings: "Auffälligkeiten", expoTabFindings: "Auffälligkeiten", expoFindingsHint: "Freigaben, die einen Blick wert sind: nicht mehr vorhandene oder deaktivierte Entitäten, sensible Geräte, doppelte Sprachnamen und verwaiste Webhooks.", expoSourceHint: "{n} Entitäten sind für {name} freigegeben.", expoAlso: "auch: {list}", expoCapped: "Gezeigt werden die ersten {n}.", expoNoneFor: "Für diese Quelle ist nichts freigegeben.", expoInactiveText: "Nicht eingerichtet: es ist nichts freigegeben.",
  exposure: "Freigaben", exposureSubtitle: "Welche Entitäten Sprachassistenten und Bridges erreichen können. Liest nur; es wird nichts geändert und nichts gespeichert.",
  expoTitle: "Freigaben", expoHint: "Assist, Alexa, Google Assistant und HomeKit", expoLoading: "Die Freigaben werden gelesen …",
  expoNone: "Nichts Auffälliges bei den Freigaben.", expoHint2: "Hinweis", expoWarn: "Prüfen",
  expoAssistants: "Assistenten und Bridges", expoFindings: "Auffälligkeiten",
  expoName_conversation: "Assist", expoName_cloud_alexa: "Alexa", expoName_cloud_google_assistant: "Google Assistant", expoName_homekit: "HomeKit",
  expoOk: "{n} Entitäten freigegeben", expoInactive: "nicht eingerichtet", expoUnavailable: "nicht prüfbar", expoBridge: "{n} Entitäten durch den Filter",
  expoKind_diagnostic_exposed: "Diagnose-Entitäten freigegeben", expoKind_sensitive_exposed: "Sensible Entitäten freigegeben", expoKind_stale_exposed: "Freigabe für deaktivierte oder verwaiste Entitäten", expoKind_alias_duplicate: "Doppelter Sprachname", expoKind_webhook_orphan: "Webhooks ohne Integration",
  expoText_diagnostic_exposed: "{n} Entitäten aus der Kategorie Diagnose oder Konfiguration sind freigegeben. Sie helfen beim Sprechen selten.",
  expoText_sensitive_exposed: "{n} Schlösser, Alarmanlagen, Personen, Tracker oder Garagentore sind freigegeben. Das kann gewollt sein; prüfe, ob der Assistent sie steuern oder verraten darf.",
  expoText_stale_exposed: "{n} Entitäten sind freigegeben, obwohl sie deaktiviert oder verwaist sind.",
  expoText_alias_duplicate: "„{alias}“ heißt bei {assistant} {n} Entitäten. Der Assistent kann sie nicht auseinanderhalten.",
  expoText_webhook_orphan: "{n} Webhooks gehören zu „{domain}“, einer Integration, die nicht mehr eingerichtet ist. Die IDs zeigt Housekeeper bewusst nicht an.",
  expoAdvice_diagnostic_exposed: "Freigabe unter Einstellungen → Sprachassistenten → Entitäten zurücknehmen.",
  expoAdvice_sensitive_exposed: "Nur zur Kenntnis. Housekeeper ändert nichts.",
  expoAdvice_stale_exposed: "Entität aufräumen oder die Freigabe zurücknehmen.",
  expoAdvice_alias_duplicate: "Einen der Namen ändern, damit die Sprachbefehle eindeutig sind.",
  expoAdvice_webhook_orphan: "Die Integration neu einrichten oder die Reste entfernen, falls sie nicht mehr gebraucht werden.",
  expoMore: "und {n} weitere", expoShowAll: "Alle {n} zeigen", expoToCheck: "Zu prüfen", expoToNote: "Zur Kenntnis",
  expoFootnote: "Housekeeper liest je Assistent, welche Entitäten Home Assistant freigibt, bei HomeKit nur den gespeicherten Entitäts-Filter der Bridge. Passwörter, Tokens, Ports und Webhook-IDs werden nie gelesen oder angezeigt. Wenn eine Quelle nicht antwortet, steht „nicht prüfbar“, nie „nicht freigegeben“. Sprachnamen gelten als gleich, wenn sie sich nur in Groß- und Kleinschreibung, Leerzeichen oder Umlauten unterscheiden.",
});
Object.assign(TEXT.en, {
  expoIntro: "Here you see which entities voice assistants (Assist, Alexa, Google Assistant) and HomeKit bridges can reach, and what stands out. A click on a tile shows the entities.", expoSumEntities: "entities exposed", expoSumFindings: "Findings", expoTabFindings: "Findings", expoFindingsHint: "Exposures worth a look: entities that are gone or disabled, sensitive devices, duplicate voice names and orphaned webhooks.", expoSourceHint: "{n} entities are exposed to {name}.", expoAlso: "also: {list}", expoCapped: "The first {n} are shown.", expoNoneFor: "Nothing is exposed to this source.", expoInactiveText: "Not set up: nothing is exposed.",
  exposure: "Exposure", exposureSubtitle: "Which entities voice assistants and bridges can reach. Only reads; nothing is changed and nothing is stored.",
  expoTitle: "Exposure", expoHint: "Assist, Alexa, Google Assistant and HomeKit", expoLoading: "Reading the exposure …",
  expoNone: "Nothing unusual in the exposure.", expoHint2: "Note", expoWarn: "Check",
  expoAssistants: "Assistants and bridges", expoFindings: "Findings",
  expoName_conversation: "Assist", expoName_cloud_alexa: "Alexa", expoName_cloud_google_assistant: "Google Assistant", expoName_homekit: "HomeKit",
  expoOk: "{n} entities exposed", expoInactive: "not set up", expoUnavailable: "cannot be checked", expoBridge: "{n} entities through the filter",
  expoKind_diagnostic_exposed: "Diagnostic entities exposed", expoKind_sensitive_exposed: "Sensitive entities exposed", expoKind_stale_exposed: "Exposed but disabled or orphaned", expoKind_alias_duplicate: "Duplicate voice name", expoKind_webhook_orphan: "Webhooks without integration",
  expoText_diagnostic_exposed: "{n} entities in the diagnostic or configuration category are exposed. They rarely help when speaking.",
  expoText_sensitive_exposed: "{n} locks, alarm panels, persons, trackers or garage doors are exposed. That can be intended; check whether the assistant may control or reveal them.",
  expoText_stale_exposed: "{n} entities are exposed although they are disabled or orphaned.",
  expoText_alias_duplicate: "\"{alias}\" names {n} entities for {assistant}. The assistant cannot tell them apart.",
  expoText_webhook_orphan: "{n} webhooks belong to \"{domain}\", an integration that is no longer set up. Housekeeper deliberately does not show their ids.",
  expoAdvice_diagnostic_exposed: "Take the exposure back under Settings → Voice assistants → Entities.",
  expoAdvice_sensitive_exposed: "For your information only. Housekeeper changes nothing.",
  expoAdvice_stale_exposed: "Clean up the entity or take the exposure back.",
  expoAdvice_alias_duplicate: "Rename one of them so voice commands are unambiguous.",
  expoAdvice_webhook_orphan: "Set the integration up again or remove the leftovers if they are no longer needed.",
  expoMore: "and {n} more", expoShowAll: "Show all {n}", expoToCheck: "To check", expoToNote: "For your information",
  expoFootnote: "Housekeeper reads, per assistant, which entities Home Assistant exposes; for HomeKit only the stored entity filter of the bridge. Passwords, tokens, ports and webhook ids are never read or shown. If a source does not answer, it says \"cannot be checked\", never \"not exposed\". Voice names count as equal when they differ only in case, spaces or umlauts.",
});

// StylesMixin: methods of the panel element, mixed into the class in 99-register.js.
class StylesMixin {
  styles() {
    return `<style data-hk>
      :host{--hk-blue:var(--primary-color,#0789cf);--hk-blue-solid:color-mix(in srgb,var(--hk-blue) 76%,#000);--hk-blue-text:color-mix(in srgb,var(--hk-blue) 58%,var(--hk-text,#1c1c1c));--hk-surface:var(--card-background-color,#fff);--hk-bg:var(--primary-background-color,#f4f6f9);--hk-soft:var(--secondary-background-color,#f6f8fa);--hk-text:var(--primary-text-color,#17212b);--hk-muted:var(--secondary-text-color,#637281);--hk-border:var(--divider-color,#dde4ea);--hk-green:#1f9d63;--hk-amber:#d68a00;--hk-red:#d94452;--hk-violet:#7a62c9;--hk-gray:#7b8794;display:block;min-height:100%;background:var(--hk-bg);color:var(--hk-text);font-family:"IBM Plex Sans",var(--paper-font-body1_-_font-family,Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif)}
      *{box-sizing:border-box} button,input,select{font:inherit;color:inherit} button{cursor:pointer} h1,h2,h3,h4,p{margin:0}
      ha-icon{--mdc-icon-size:20px}
      .shell{min-height:100vh;display:block}
      .stickyhead{position:sticky;top:0;z-index:30}.modeopts{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;padding:12px 16px 16px}.modeopt{display:flex;gap:10px;align-items:flex-start;padding:12px;border:1px solid var(--hk-border);border-radius:10px;background:var(--hk-surface);cursor:pointer}.modeopt.on{border-color:var(--hk-blue);box-shadow:0 0 0 1px var(--hk-blue)}.modeopt input{position:absolute;opacity:0;pointer-events:none}.modeopt:focus-within{outline:2px solid var(--hk-blue);outline-offset:2px}.modepanel{border-left:4px solid var(--hk-blue)}.bulkform{padding:0 14px 10px}.safebar{display:flex;gap:6px 16px;flex-wrap:wrap;align-items:center;padding:6px clamp(16px,2.4vw,32px);border-bottom:1px solid var(--hk-border);background:var(--hk-surface);font-size:calc(12px*var(--hk-fs,1));color:var(--hk-muted)}
      .safeitem{display:inline-flex;align-items:center;gap:6px;padding:2px 0;border:0;background:none;color:inherit;font:inherit;cursor:pointer}
      .safeitem:hover{color:var(--hk-text)}.safeitem .dot{width:8px;height:8px;border-radius:50%;background:var(--hk-muted)}.safeitem .dot.ok{background:var(--hk-green,#2e7d32)}.safeitem .dot.warn{background:var(--hk-amber,#b26a00)}.safeitem .dot.red{background:var(--hk-red,#c62828)}
      @media(max-width:860px){.safebar{flex-wrap:nowrap;overflow-x:auto;white-space:nowrap;padding:6px 12px}}
      .top{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:22px;padding:0 clamp(16px,2.4vw,32px);min-height:calc(60px*var(--hk-fs,1));border-bottom:1px solid var(--hk-border);background:var(--hk-surface)}
      .brand{display:flex;align-items:center;gap:10px;flex:none}.brandmark{width:34px;height:34px;display:grid;place-items:center;flex:none}.brandmark img{width:34px;height:34px;object-fit:contain}.brandmark ha-icon{display:none}.brandmark.nologo{border-radius:10px;color:#fff;background:linear-gradient(135deg,#0394d5,#087dbb)}.brandmark.nologo ha-icon{display:block}.brand strong{font-weight:600;font-size:calc(17px*var(--hk-fs,1));white-space:nowrap}
      .topnav{flex:1;min-width:0;display:flex;align-items:stretch;align-self:stretch;gap:2px}.navmenu{position:relative;display:flex;align-items:stretch}.navend{margin-left:auto;display:flex;align-items:stretch;gap:8px}.quick{position:relative;display:flex;align-items:center;align-self:center}.quick>ha-icon{position:absolute;left:8px;--mdc-icon-size:18px;color:var(--hk-muted);pointer-events:none}.quick input{width:150px;max-width:100%;min-height:36px;padding:0 10px 0 32px;border:1px solid var(--hk-border);border-radius:10px;background:var(--hk-surface);color:var(--hk-text);font:inherit}.quick input:focus{outline:2px solid var(--hk-blue);outline-offset:0}.quicklist{position:absolute;top:calc(100% + 6px);right:0;z-index:30;width:min(380px,90vw);max-height:60vh;overflow:auto;margin:0;padding:6px;list-style:none;border:1px solid var(--hk-border);border-radius:12px;background:var(--hk-surface);box-shadow:0 8px 24px rgba(0,0,0,.14)}.quicklist li{display:grid;grid-template-columns:auto minmax(0,1fr);gap:10px;align-items:center;padding:8px;border-radius:8px;cursor:pointer}.quicklist li.on,.quicklist li:hover{background:color-mix(in srgb,var(--hk-blue) 10%,transparent)}.quicklist li.none{display:block;color:var(--hk-muted);cursor:default}.row.jrow{display:flex;align-items:center;gap:8px 12px;flex-wrap:wrap}.jrow .row-text{flex:1 1 220px}.jrow .tile{flex:none}.jrow input[type=checkbox]{flex:none}.jbtns{display:flex;gap:8px;margin-left:auto}.quicklist .row-text{min-width:0}.quicklist small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}@media(max-width:860px){.quick{display:flex;margin:6px 0}.quick input{width:100%}.navend{flex-direction:column;align-items:stretch}}.navhead{display:none;padding:10px 12px 2px;color:var(--hk-muted);font-size:calc(10.5px*var(--hk-fs,1));font-weight:600;letter-spacing:.06em;text-transform:uppercase}
      .nav{min-height:44px;display:inline-flex;align-items:center;gap:8px;padding:0 12px;border:0;border-bottom:3px solid transparent;border-radius:0;color:var(--hk-muted);background:transparent;font-weight:500;white-space:nowrap}.nav:hover{color:var(--hk-text);background:var(--hk-soft)}.nav ha-icon{--mdc-icon-size:20px}.nav .caret{--mdc-icon-size:16px;margin-left:-2px}
      .navpop{display:none;position:absolute;top:100%;left:0;min-width:210px;padding:6px;border:1px solid var(--hk-border);border-radius:12px;background:var(--hk-surface);box-shadow:0 8px 24px rgba(0,0,0,.14)}.navmenu.open .navpop{display:grid;gap:2px}.navpop .nav{min-height:40px;border-bottom:0;border-radius:8px}.navpop .nav.active{box-shadow:none;background-image:linear-gradient(var(--hk-blue),var(--hk-blue));background-size:3px 100%;background-repeat:no-repeat;background-position:left top}
      .nav.active{color:var(--hk-blue-text);border-bottom-color:var(--hk-blue);font-weight:600}.nav em{min-width:22px;padding:2px 6px;border-radius:10px;color:var(--hk-muted);background:var(--hk-soft);font-size:calc(11px*var(--hk-fs,1));font-style:normal;text-align:center}.nav.group-active{color:var(--hk-blue-text);border-bottom-color:var(--hk-blue);font-weight:600}.navtoggle{display:none;margin-left:auto;min-height:40px;align-items:center;gap:6px;padding:0 10px;border:1px solid var(--hk-border);border-radius:8px;background:var(--hk-surface);color:inherit}
      .lock{display:flex;align-items:center;gap:7px;font-size:calc(11px*var(--hk-fs,1));color:var(--hk-green)}.lock ha-icon{--mdc-icon-size:16px}
      .main{min-width:0;max-width:1480px;margin:0 auto;padding:26px clamp(16px,2.4vw,32px) 60px}
      .heading{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:20px}.eyebrow{color:var(--hk-blue-text);font-size:calc(11px*var(--hk-fs,1));font-weight:600;letter-spacing:.09em;text-transform:uppercase;margin-bottom:3px}
      h1{font-size:calc(25px*var(--hk-fs,1));font-weight:600;line-height:1.2}.sub{display:block;margin-top:6px;color:var(--hk-muted);font-size:calc(13px*var(--hk-fs,1))}
      .btn{min-height:37px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:8px 14px;border-radius:8px;font-weight:600;border:1px solid var(--hk-border);background:var(--hk-surface)}.btn:hover{background:var(--hk-soft)}
      .howto{padding:6px 16px 10px}.howto summary{cursor:pointer;color:var(--hk-blue-text);font-weight:600;font-size:calc(12.5px*var(--hk-fs,1));padding:4px 0}.howto .factnote{margin:4px 0 0;padding:0}
      .setband{display:flex;flex-wrap:wrap;align-items:center;gap:8px 24px;padding:12px 16px;margin-bottom:14px}.setband .grow{flex:1}.bandbit{display:grid;gap:1px}.bandbit small{color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}.bandbit b{font-size:calc(14px*var(--hk-fs,1))}
      .tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:10px;padding:14px 16px}.tilebtn{display:grid;gap:8px;justify-items:start;align-content:start;padding:10px;border:1px solid var(--hk-border);border-radius:12px;background:var(--hk-surface);text-align:left;font-weight:600}.qtype{margin:0 0 12px}.navtiles{grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr))}.taskgrid .taskcard.on{border-color:var(--hk-blue);background:color-mix(in srgb,var(--hk-blue) 9%,var(--hk-surface));box-shadow:0 0 0 1px var(--hk-blue),var(--hk-sh2)}.taskgrid .taskcard.on strong{color:var(--hk-blue-text)}.taskgrid .taskcard.off{opacity:.6;cursor:default}.taskgrid .taskcard.off:hover{transform:none;box-shadow:var(--hk-sh1)}.setpill{gap:6px;flex-wrap:wrap}.schemetiles{grid-template-columns:repeat(auto-fit,minmax(170px,1fr))}.schemetiles .tilebtn{gap:10px;padding:12px}.schemeprev{display:grid;gap:8px;width:100%;box-sizing:border-box;padding:10px;border:1px solid;border-radius:10px}.sp-card{display:grid;grid-template-columns:18px 1fr;grid-template-rows:auto auto;gap:5px 8px;align-items:center;padding:8px;border:1px solid;border-radius:8px}.sp-card b{grid-row:1/3;width:18px;height:18px;border-radius:50%}.sp-card i{display:block;height:5px;border-radius:3px}.sp-row{display:flex;align-items:center;gap:6px}.sp-row em{width:10px;height:10px;border-radius:50%}.sp-row u{margin-left:auto;width:42px;height:14px;border-radius:7px}.tilebtn[aria-pressed=true]>span:last-child:before{content:"\\2713";margin-right:.4em;color:var(--hk-blue-text)}.tilebtn ha-icon{color:var(--hk-blue-text)}.tilebtn:hover{border-color:var(--hk-blue)}.tilebtn[aria-pressed=true]{border-color:var(--hk-blue-solid);box-shadow:0 0 0 2px color-mix(in srgb,var(--hk-blue) 35%,transparent)}
      .mini{display:flex;gap:4px;width:100%;height:38px;padding:5px;border:1px solid;border-radius:8px}.mini i{flex:1;border-radius:4px}.mini b{width:16px;border-radius:4px}
      .optgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;padding:14px 16px}.optcard{display:grid;gap:8px;align-content:start;padding:14px;border:1px solid var(--hk-border);border-radius:12px}.optcard small{color:var(--hk-muted);font-size:calc(12px*var(--hk-fs,1))}.unitrow{display:flex;align-items:center;gap:8px}.unitrow input{width:110px}.savebar{border-bottom:0;border-top:1px solid var(--hk-border)}.quietreset{grid-template-columns:1fr auto}a.row{text-decoration:none}
      .sharebar{display:block;height:6px;border-radius:3px;background:var(--hk-soft);overflow:hidden;margin-top:4px}.sharebar i{display:block;height:100%;background:var(--hk-blue-solid)}
      .recchoice{display:inline-flex;align-items:center;gap:6px;font-size:calc(12px*var(--hk-fs,1));color:var(--hk-muted)}.recwarn{flex:1 1 100%;color:var(--hk-muted)}
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
      .row{width:100%;display:grid;grid-template-columns:auto minmax(0,1fr);grid-auto-flow:column;grid-auto-columns:auto;align-items:center;gap:12px;padding:12px 16px;border:0;border-bottom:1px solid var(--hk-border);background:transparent;color:inherit;text-align:left}.row:last-child{border-bottom:0}.row:hover{background:var(--hk-soft)}
      .row .tile{width:34px;height:34px}.row-text{min-width:0;display:grid;gap:2px}.row-text strong{overflow:hidden;font-size:calc(13px*var(--hk-fs,1));font-weight:600;text-overflow:ellipsis;white-space:nowrap}.row-text small{overflow:hidden;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1));text-overflow:ellipsis;white-space:nowrap}.date{color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1));white-space:nowrap}
      .pill{display:inline-flex;align-items:center;gap:6px;width:max-content;padding:3px 9px;border-radius:99px;font-size:calc(11px*var(--hk-fs,1));font-weight:600;white-space:nowrap;color:color-mix(in srgb,var(--hk-blue) 60%,var(--hk-text));background:color-mix(in srgb,var(--hk-blue) 13%,transparent)}
      .pill.ok{color:color-mix(in srgb,var(--hk-green) 60%,var(--hk-text));background:color-mix(in srgb,var(--hk-green) 14%,transparent)}.pill.warn{color:color-mix(in srgb,var(--hk-amber) 60%,var(--hk-text));background:color-mix(in srgb,var(--hk-amber) 16%,transparent)}.pill.red{color:color-mix(in srgb,var(--hk-red) 60%,var(--hk-text));background:color-mix(in srgb,var(--hk-red) 13%,transparent)}.pill.mute{color:color-mix(in srgb,var(--hk-gray) 60%,var(--hk-text));background:color-mix(in srgb,var(--hk-gray) 16%,transparent)}.pill.violet{color:color-mix(in srgb,var(--hk-violet) 60%,var(--hk-text));background:color-mix(in srgb,var(--hk-violet) 14%,transparent)}
      .linklike{padding:0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.linklike:hover{text-decoration:underline}.qrow{grid-template-columns:auto minmax(0,1fr) auto auto}.qconfirm{display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap}.factaction{display:block;margin-top:6px}
      .spark{display:inline-flex;align-items:flex-end;gap:2px;height:22px}.spark i{display:block;width:5px;min-height:2px;border-radius:1px;background:var(--hk-blue)}
      .bar{display:flex;height:10px;margin:16px;border-radius:99px;overflow:hidden;background:var(--hk-soft)}.bar i{display:block;min-width:2px}.legend{display:grid;gap:9px;padding:0 16px 16px;font-size:calc(12px*var(--hk-fs,1))}.legend div{display:flex;align-items:center;justify-content:space-between;gap:8px}.legend span{display:flex;align-items:center;gap:8px}.legend .nums{gap:14px}.legend .pct{font-style:normal;color:var(--hk-muted);min-width:52px;text-align:right}.invlegend{padding-top:14px}.panelhead+.legend+.bar{margin-top:0}.dot{width:9px;height:9px;border-radius:50%;background:var(--hk-blue)}
      .dot.ok,.bar .ok{background:var(--hk-green)}.dot.warn,.bar .warn{background:var(--hk-amber)}.dot.red,.bar .red{background:var(--hk-red)}.dot.mute,.bar .mute{background:var(--hk-gray)}.dot.violet,.bar .violet{background:var(--hk-violet)}
      .types{display:grid}.type{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;padding:10px 16px;border:0;border-top:1px solid var(--hk-border);background:transparent;text-align:left;font-size:calc(13px*var(--hk-fs,1))}.type:hover{background:var(--hk-soft)}.type .tile{width:30px;height:30px}.type b{font-weight:600}
      .mobsort,.msince{display:none}
      .row.politem{padding-left:44px;background:color-mix(in srgb,var(--hk-soft) 45%,transparent)}.row.politem .tile{width:28px;height:28px}.tablewrap.lt td:not(:first-child){white-space:nowrap}.tablewrap.lt tr.static{cursor:default}.tablewrap.lt tr.static:hover{background:transparent}.tablewrap.lt td .id{display:block;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1));font-family:var(--hk-mono,monospace);margin-top:2px}.tablewrap.lt td small{display:block;margin-top:2px;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}.tablewrap.lt td:first-child{min-width:220px}.tip{position:fixed;z-index:50;display:grid;gap:2px;max-width:min(520px,calc(100vw - 16px));padding:8px 10px;border:1px solid var(--hk-border);border-radius:8px;background:var(--hk-surface);box-shadow:0 6px 20px rgba(0,0,0,.18);font-size:calc(12px*var(--hk-fs,1));pointer-events:none;overflow-wrap:anywhere}.tip[hidden]{display:none}.tip strong{font-weight:700}.tip span{font-family:ui-monospace,SFMono-Regular,monospace;color:var(--hk-muted)}.fflow{padding:6px 14px 12px}.fstep{margin:6px 0;padding:8px 10px;border:1px solid var(--hk-border);border-left:3px solid var(--hk-blue);border-radius:8px;background:var(--hk-surface)}.fstep.broken{border-left-color:var(--hk-red,#b3261e);background:color-mix(in srgb,var(--hk-red,#b3261e) 6%,var(--hk-surface))}.fstep>summary{cursor:pointer;list-style-position:inside}.fhead{display:inline-flex;flex-wrap:wrap;align-items:center;gap:6px 8px;max-width:calc(100% - 20px);vertical-align:middle}.fhead ha-icon{--mdc-icon-size:18px;color:var(--hk-muted)}.ffacts{color:var(--hk-muted);font-size:calc(12px*var(--hk-fs,1))}.fpath{margin-left:auto;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}.fkids{margin:8px 0 2px 14px;padding-left:10px;border-left:1px dashed var(--hk-border)}.fgroup>small{display:block;margin:6px 0 2px;color:var(--hk-muted);text-transform:uppercase;letter-spacing:.05em;font-size:calc(10px*var(--hk-fs,1))}.fbranch{margin:6px 0}.chip.flowref{cursor:pointer;padding:2px 8px;font-size:calc(12px*var(--hk-fs,1))}.chip.flowref.missing{border-color:var(--hk-red,#b3261e);color:var(--hk-red,#b3261e);cursor:default}.listtools{display:flex;gap:8px;justify-content:flex-end;padding:0 14px 10px}.colwrap{position:relative;display:inline-flex}.colpop{position:absolute;right:0;top:calc(100% + 4px);z-index:20;display:grid;gap:6px;min-width:180px;padding:10px 12px;border:1px solid var(--hk-border);border-radius:8px;background:var(--hk-surface);box-shadow:0 6px 20px rgba(0,0,0,.18)}.colpop label{display:flex;gap:8px;align-items:center;font-size:calc(13px*var(--hk-fs,1));cursor:pointer}.dirbtn.on{border-color:var(--hk-blue);color:var(--hk-blue)}.namecell{display:block;min-width:0;max-width:280px}.namecell .cut{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}@media(max-width:860px){.namecell{max-width:none}.namecell .cut{white-space:normal;overflow:visible}}@media(min-width:861px){.tablewrap.lt,.tablewrap.inv{max-height:calc(100vh - 140px)}.tablewrap.lt thead th,.tablewrap.inv thead th{position:sticky;top:0;z-index:2;background:var(--hk-surface)}}.dense .tablewrap td{padding-top:4px;padding-bottom:4px}.dense .tablewrap .namecell .id{display:none}.tablewrap.lt .muted{color:var(--hk-muted)}.polform{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.polform input{flex:1 1 140px;min-width:0;padding:8px 10px;border:1px solid var(--hk-border);border-radius:8px;background:var(--hk-surface);color:inherit;font:inherit}.policyswitch{appearance:none;-webkit-appearance:none;position:relative;width:38px;height:22px;margin:0;border:1px solid var(--hk-border);border-radius:11px;background:var(--hk-soft);flex:none;cursor:pointer;transition:background-color .15s ease,border-color .15s ease}.policyswitch::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:var(--hk-muted);transition:transform .15s ease,background-color .15s ease}.policyswitch:checked{border-color:var(--hk-blue);background:var(--hk-blue)}.policyswitch:checked::after{background:#fff;transform:translateX(16px)}.policyswitch:focus-visible{outline:2px solid var(--hk-blue);outline-offset:2px}.sr-only{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
      button:focus-visible,[data-object]:focus-visible,tr[data-object]:focus-visible,th[data-sort]:focus-visible,.nav:focus-visible,.chip:focus-visible,summary:focus-visible,a:focus-visible{outline:2px solid var(--hk-blue);outline-offset:2px}
      .filters{display:grid;grid-template-columns:minmax(240px,1fr) 190px 190px;gap:10px;padding:14px;border-bottom:1px solid var(--hk-border)}
      input,select{border:1px solid var(--hk-border);border-radius:8px;background:var(--hk-surface);padding:9px 12px;min-width:0}
      select{appearance:none;-webkit-appearance:none;padding-right:36px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%23808a84' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-size:12px 8px;cursor:pointer}input:focus,select:focus{outline:2px solid color-mix(in srgb,var(--hk-blue) 35%,transparent);border-color:var(--hk-blue)}
      .listbar{display:flex;flex-wrap:wrap;gap:10px;padding:12px 14px;border-bottom:1px solid var(--hk-border)}.listbar input{flex:3 1 260px}.listbar select{flex:0 1 150px}.sortgroup{display:flex;gap:4px;margin-left:auto;min-width:0}.sortgroup select{flex:0 1 150px;min-width:0}.dirbtn{flex:none}@media(max-width:560px){.listbar>select{flex:1 1 130px}.viewgroup{flex:1 1 100%}.sortgroup{flex:1 1 100%;margin-left:0}.sortgroup select{flex:1 1 auto}}.dirbtn{display:grid;place-items:center;border:1px solid var(--hk-border);border-radius:8px;background:var(--hk-surface);color:inherit;padding:0 10px}.dirbtn:hover{border-color:var(--hk-blue)}
      .setrow{display:grid;grid-template-columns:minmax(150px,240px) 1fr;gap:12px;align-items:center;padding:14px 16px;border-bottom:1px solid var(--hk-border)}.setrow:last-child{border-bottom:0}.setrow small{display:block;margin-top:3px;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}.setrow select{max-width:240px}.setrow .btn{justify-self:start}.seg{display:flex;flex-wrap:wrap;gap:8px}.swatch{display:inline-block;width:10px;height:10px;margin-right:6px;border-radius:50%;vertical-align:-1px}a.btn{color:inherit;text-decoration:none}
      @media(max-width:700px){.setrow{grid-template-columns:1fr}}
      .row,.btn,.card,.chip,.nav,.dirbtn{transition:background-color .15s ease,border-color .15s ease,color .15s ease}.bar i{transition:width .4s ease}@keyframes hk-spin{to{transform:rotate(360deg)}}.loading ha-icon,.btn[disabled] ha-icon{animation:hk-spin 1s linear infinite}
      .tablewrap{overflow:auto}table{border-collapse:collapse;width:100%}th{text-align:left;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1));font-weight:600;text-transform:uppercase;letter-spacing:.05em;padding:11px 16px;background:var(--hk-soft);cursor:pointer;white-space:nowrap}.thbtn{padding:0;border:0;background:none;color:inherit;font:inherit;letter-spacing:inherit;text-transform:inherit;cursor:pointer}td{padding:11px 16px;border-top:1px solid var(--hk-border);font-size:calc(13px*var(--hk-fs,1))}tbody tr{cursor:pointer}tbody tr:hover{background:var(--hk-soft)}
      .object{display:flex;align-items:center;gap:11px;min-width:260px}.object .tile{width:34px;height:34px}.object strong{display:block;font-weight:600}.id{display:block;color:var(--hk-muted);font-family:ui-monospace,SFMono-Regular,monospace;font-size:calc(11px*var(--hk-fs,1));margin-top:2px;max-width:390px;overflow:hidden;text-overflow:ellipsis}
      .tablefoot{padding:12px 16px;border-top:1px solid var(--hk-border);color:var(--hk-muted);font-size:calc(12px*var(--hk-fs,1));display:flex;align-items:center;justify-content:space-between;gap:10px}.pager{display:flex;align-items:center;gap:8px}.pager button{border:1px solid var(--hk-border);background:var(--hk-surface);border-radius:7px;padding:5px 10px}.pager button:disabled{opacity:.4}
      .chips .spacer{flex:1}.chips{display:flex;flex-wrap:wrap;gap:8px;padding:12px 16px;border-bottom:1px solid var(--hk-border)}.chip{border:1px solid var(--hk-border);background:var(--hk-surface);border-radius:99px;padding:5px 12px;font-size:calc(12px*var(--hk-fs,1));color:var(--hk-muted)}.chip.active{color:var(--hk-blue-text);border-color:var(--hk-blue);background:color-mix(in srgb,var(--hk-blue) 11%,transparent);font-weight:600}
      .emptymsg,.loading{padding:46px;text-align:center;color:var(--hk-muted)}.viewgroup{display:inline-flex;gap:8px;align-items:center;flex-wrap:wrap}.skeleton{display:grid;gap:10px;padding:18px 16px}.skeleton i{display:block;height:14px;border-radius:7px;background:linear-gradient(90deg,var(--hk-soft),color-mix(in srgb,var(--hk-soft) 55%,var(--hk-surface)),var(--hk-soft)) 0 0/200% 100%;animation:hk-shimmer 1.4s ease-in-out infinite}.skeleton i:nth-of-type(2){width:80%}.skeleton i:nth-of-type(3){width:60%}@keyframes hk-shimmer{to{background-position:-200% 0}}@media(prefers-reduced-motion:reduce){.skeleton i{animation:none}}.coverage{display:flex;gap:6px;align-items:flex-start}.coverage ha-icon{--mdc-icon-size:16px;flex:none;margin-top:1px}.fline{display:flex;flex-direction:column;align-items:flex-start;gap:3px;margin-top:6px}.fline .fnote{color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}.emptymsg ha-icon{--mdc-icon-size:34px;color:var(--hk-green);display:block;margin:0 auto 8px}.error{padding:18px;border-radius:12px;background:color-mix(in srgb,var(--hk-red) 12%,transparent);color:var(--hk-red)}
      .bhattest{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;padding:8px 16px 12px 62px;border-top:1px solid var(--hk-border);background:var(--hk-soft)}.bhattest label{display:flex;align-items:center;gap:8px;font-size:calc(12px*var(--hk-fs,1));color:var(--hk-muted)}.bhattest input{padding:6px 8px;border:1px solid var(--hk-border);border-radius:8px;background:var(--hk-surface);color:var(--hk-text);font:inherit}
      .dense .row-text small:not(:first-of-type){display:none}.dense .bh .row-text small:not(:first-of-type){display:block}.dirbtn[aria-pressed="true"]{border-color:var(--hk-blue);color:var(--hk-blue)}
      .bh .row-text small{overflow:visible;white-space:normal;text-overflow:clip}
      .bhguide{padding:12px 16px;border-top:1px solid var(--hk-border)}.bhguide summary{font-size:calc(12px*var(--hk-fs,1))}.bhguide .factnote{padding:8px 0 0;border:0}
      .graphbar{display:flex;flex-wrap:wrap;gap:10px 14px;align-items:center;padding:10px 14px;margin-bottom:14px}.graphctl{display:flex;align-items:center;gap:8px}.graphctl small{color:var(--hk-muted)}.graphwrap{overflow:auto;padding:14px}.graphsvg{display:block;max-width:none}
      .gedge{fill:none;stroke:var(--hk-muted);stroke-width:1.5}.gedge.prob{stroke-dasharray:7 4}.gedge.cycle{stroke:var(--hk-red);stroke-dasharray:2 3}.gedge.hit{stroke:var(--hk-red);stroke-width:2.5}.garrow{fill:var(--hk-muted)}.gdim{opacity:.3}
      .gnode{cursor:pointer}.gnode.center{cursor:default}.gnode rect{fill:var(--hk-surface);stroke:var(--hk-border);stroke-width:1.5}.gnode.center rect{stroke:var(--hk-blue);stroke-width:2.5}.gnode.missing rect{stroke:var(--hk-red);stroke-dasharray:4 3}.gnode.ggroup rect{stroke-dasharray:2 3}.gnode.hit rect{stroke:var(--hk-red);stroke-width:2.5}.gnode rect.bar{stroke:none;fill:var(--hk-blue)}.gnode rect.bar.ok{fill:var(--hk-green)}.gnode rect.bar.warn{fill:var(--hk-amber)}.gnode rect.bar.red{fill:var(--hk-red)}.gnode rect.bar.mute{fill:var(--hk-gray)}.gnode rect.bar.violet{fill:var(--hk-violet)}
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
      .tabs{display:flex;gap:4px;margin-bottom:14px;border-bottom:1px solid var(--hk-border);overflow-x:auto;background:linear-gradient(to right,var(--hk-bg),transparent) left/36px 100% no-repeat local,linear-gradient(to left,var(--hk-bg),transparent) right/36px 100% no-repeat local,linear-gradient(to right,rgba(0,0,0,.16),transparent) left/10px 100% no-repeat scroll,linear-gradient(to left,rgba(0,0,0,.16),transparent) right/10px 100% no-repeat scroll}.tab{flex:none;padding:10px 14px;border:0;border-bottom:2px solid transparent;background:none;color:var(--hk-muted);white-space:nowrap}.tab em{font-style:normal;font-size:calc(11px*var(--hk-fs,1));padding:1px 6px;border-radius:10px;background:var(--hk-soft)}.tab[aria-selected="true"]{color:var(--hk-blue-text);border-bottom-color:var(--hk-blue);font-weight:600}
      .rowwrap{display:flex;align-items:center;border-bottom:1px solid var(--hk-border)}.rowwrap:last-child{border-bottom:0}.rowwrap .row{border-bottom:0;flex:1;min-width:0}.selbox{margin:0 0 0 16px;flex:none}.statcell{display:flex;gap:10px;align-items:flex-start}.statcell .selbox{margin:3px 0 0}.statcell>div{min-width:0}
      .sumtiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:14px}.sumtile{display:flex;flex-direction:column;gap:2px;min-width:0;padding:12px 14px;border:1px solid var(--hk-border);border-left:4px solid var(--hk-gray);border-radius:12px;background:var(--hk-surface);text-align:left;font:inherit;color:inherit}button.sumtile{cursor:pointer}button.sumtile:hover{background:var(--hk-soft)}.sumtile.ok{border-left-color:var(--hk-green)}.sumtile.warn{border-left-color:var(--hk-amber)}.sumtile.red{border-left-color:var(--hk-red)}.sumlabel{color:var(--hk-muted);font-size:calc(12px*var(--hk-fs,1))}.sumvalue{font-size:calc(22px*var(--hk-fs,1));font-weight:600;line-height:1.2;overflow-wrap:anywhere}.sumtile small{color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1));overflow-wrap:anywhere}.tabdot{display:inline-block;width:8px;height:8px;margin-left:6px;border-radius:50%;background:var(--hk-gray)}.tabdot.warn{background:var(--hk-amber)}.tabdot.red{background:var(--hk-red)}
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
      .finding{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;border-top:1px solid var(--hk-border);font-size:calc(13px*var(--hk-fs,1))}.finding strong{display:block;font-weight:600}.planfoot{display:flex;align-items:center;justify-content:space-between;gap:12px 20px;flex-wrap:wrap}.planfoot>:first-child{flex:1 1 280px;min-width:0}.planfoot>.factnote{border:0;padding:0}.planfoot>.btn,.planfoot>span,.planfoot>div:last-child{flex:0 0 auto}.simbox{margin:12px 16px;padding:12px 16px;border:1px solid var(--hk-border);border-radius:10px;background:var(--hk-soft)}.simbox summary{cursor:pointer;font-weight:600;font-size:calc(13px*var(--hk-fs,1))}.simlist{margin:10px 0 0;padding:0;list-style:none;display:grid;gap:6px;font-size:calc(13px*var(--hk-fs,1))}.simlist li{position:relative;padding-left:18px}.simlist li:before{content:"";position:absolute;left:4px;top:.55em;width:6px;height:6px;border-radius:50%;background:var(--hk-blue)}.simlimits{margin:10px 0 0;padding-top:10px;border-top:1px solid var(--hk-border);color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}.step{align-items:center}.fmeta{display:flex!important;flex-wrap:wrap;align-items:center;gap:4px 8px}.nw{white-space:nowrap}
      .finding:has(.polform){flex-wrap:wrap}.finding .polform{flex:1 1 100%;display:grid;grid-template-columns:minmax(150px,200px) minmax(180px,1fr) minmax(130px,170px) auto auto;gap:8px;align-items:center}.finding .polform .error{grid-column:1/-1}.finding .polform input,.finding .polform select{min-height:40px;box-sizing:border-box}@media(max-width:860px){.finding .polform{grid-template-columns:1fr 1fr}.finding .polform input{grid-column:1/-1}}
      .labelbox{display:grid;grid-template-columns:auto minmax(0,1fr) minmax(160px,220px) auto;gap:12px 14px;align-items:center;margin-top:12px;padding:14px 16px;border:1px solid var(--hk-border);border-radius:12px;background:var(--hk-soft)}.labelbox .labeltext strong{display:block;font-weight:600}.labelbox .labeltext small{display:block;margin-top:2px;color:var(--hk-muted);font-size:calc(12px*var(--hk-fs,1))}.labelbox select{min-height:40px;box-sizing:border-box}@media(max-width:860px){.labelbox{grid-template-columns:auto minmax(0,1fr)}.labelbox select,.labelbox .btn{grid-column:1/-1}}
      .picker{position:relative;max-width:360px;width:100%}.search .picker{max-width:none}.picker input{width:100%;box-sizing:border-box}.picker .quicklist{left:0;right:auto;width:100%}
      .btn.accent{border-color:color-mix(in srgb,var(--hk-blue) 40%,var(--hk-border));background:color-mix(in srgb,var(--hk-blue) 7%,var(--hk-surface));box-shadow:var(--hk-sh1)}.btn.accent ha-icon{color:var(--hk-blue)}.btn.accent:hover{background:color-mix(in srgb,var(--hk-blue) 14%,var(--hk-surface));box-shadow:var(--hk-sh2)}.btn.danger{background:var(--hk-red);border-color:var(--hk-red);color:var(--hk-on,#fff)}.btn.danger:hover{filter:brightness(1.08)}
      .askrow{display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end}.askbox{background:color-mix(in srgb,var(--hk-red) 6%,var(--hk-surface))}.askbox strong{display:block}
      .checkrow{display:flex;gap:6px 8px;align-items:center;flex-wrap:wrap;padding:12px 16px;border-top:1px solid var(--hk-border);font-size:calc(13px*var(--hk-fs,1))}.checkrow b{margin-right:4px}
      .reportopt{margin:0;display:flex;gap:10px;align-items:flex-start;cursor:pointer}.reportopt input{margin-top:2px;flex:none}.reportopt strong{display:block;font-weight:600;color:var(--hk-text)}.reportopt small{display:block;margin-top:2px;color:var(--hk-muted)}.reportbox{margin:4px 16px 16px;border:1px solid var(--hk-border);border-radius:10px;overflow:hidden;background:var(--hk-surface)}.reporthead{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 14px;background:var(--hk-soft);border-bottom:1px solid var(--hk-border)}.reporthead strong{display:flex;align-items:center;gap:8px}.reportbtns{display:flex;gap:8px;flex-wrap:wrap}.reportbox .reportpre{margin:0;padding:14px 16px;max-height:320px;overflow:auto;white-space:pre-wrap;font-size:calc(12px*var(--hk-fs,1));line-height:1.55}.reportnote{margin:0;padding:10px 14px;border-top:1px solid var(--hk-border);color:var(--hk-muted);font-size:calc(12px*var(--hk-fs,1))}
      .fbtns{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(150px,1fr);gap:8px;flex:0 0 auto}.fbtns .btn{min-height:44px;padding:8px 12px;text-align:center;line-height:1.2;border-color:color-mix(in srgb,var(--hk-blue) 40%,var(--hk-border));background:color-mix(in srgb,var(--hk-blue) 7%,var(--hk-surface));box-shadow:var(--hk-sh1)}.fbtns .btn:disabled{opacity:.5;box-shadow:none}.toolbar .fbtns{grid-auto-columns:minmax(120px,1fr)}.fbtns .btn ha-icon{color:var(--hk-blue);flex:none}.finding{flex-wrap:wrap;align-items:flex-start}.finding>:first-child{flex:1 1 320px;min-width:0;overflow-wrap:anywhere}.finding>.fbtns{flex:1 1 100%;grid-auto-flow:row;grid-auto-columns:auto;grid-template-columns:repeat(auto-fill,minmax(170px,220px))}.actpad{margin-top:8px;border-top:1px solid var(--hk-border);background:var(--hk-soft);padding-top:14px}.actpad>.factnote{border:0;padding:0;margin-bottom:10px}.actpad .taskcard{background:var(--hk-surface)}.fbtns .btn:hover{background:color-mix(in srgb,var(--hk-blue) 14%,var(--hk-surface));box-shadow:var(--hk-sh2)}@media(max-width:860px){.finding{flex-wrap:wrap}.fbtns{flex:1 1 100%;grid-auto-flow:row;grid-auto-columns:auto;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}}.finding small{display:block;margin-top:3px;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}.row.dim .tile{opacity:.55}.row.dim strong{font-weight:500}
      .kv{display:grid;grid-template-columns:155px 1fr;gap:8px 14px;font-size:calc(13px*var(--hk-fs,1))}.kv dt{color:var(--hk-muted)}.kv dd{margin:0;overflow-wrap:anywhere}
      .code{white-space:pre-wrap;word-break:break-word;background:var(--hk-soft);border-radius:10px;padding:12px;font:calc(11px*var(--hk-fs,1))/1.55 ui-monospace,SFMono-Regular,monospace;max-height:270px;overflow:auto}
      h4{font-size:calc(12px*var(--hk-fs,1));margin:12px 0 6px;color:var(--hk-muted)}
      @media(max-width:1100px){.summary{grid-template-columns:1fr 1fr}.grid2,.detailgrid{grid-template-columns:1fr}}
      @media(max-width:860px){.top{flex-wrap:wrap;gap:8px;padding:8px 12px}.navtoggle{display:inline-flex}.topnav{display:none;flex:1 1 100%;flex-direction:column;align-items:stretch;gap:0;padding-bottom:8px}.top.open .topnav{display:flex}.navmenu{display:block}.navmenu>.menubtn{display:none}.navpop{display:grid;position:static;min-width:0;padding:0;border:0;box-shadow:none;background:transparent}.navhead{display:block}.nav{width:100%;min-height:44px;border-bottom:0;border-radius:8px}.nav.active{box-shadow:none;background:linear-gradient(var(--hk-blue),var(--hk-blue)) left top/3px 100% no-repeat,color-mix(in srgb,var(--hk-blue) 8%,transparent)}.navend{margin:0;display:block}.navend .nav{width:100%}.main{padding:16px 12px 40px}.heading{flex-wrap:wrap}.filters{grid-template-columns:1fr}.row{grid-template-columns:auto minmax(0,1fr) auto}.row .date{display:none}.tablewrap table,.tablewrap thead,.tablewrap tbody,.tablewrap tr,.tablewrap td{display:block}.tablewrap thead{display:none}.tablewrap tr{padding:12px 14px;border-top:1px solid var(--hk-border);cursor:pointer}.tablewrap td{padding:2px 0;border:0}.tablewrap td:nth-child(2),.tablewrap td:nth-child(3){display:inline-block;margin:4px 12px 2px 0}.tablewrap td[data-label]::before{content:attr(data-label) ": ";color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}.tablewrap.lt tr{display:grid;grid-template-columns:1fr 1fr;gap:4px 14px}.tablewrap.lt td:not(:first-child){white-space:normal}.tablewrap.lt td{display:block;margin:0}.tablewrap.lt td:first-child{grid-column:1/-1}.tablewrap.lt td[data-label]::before{display:block;margin-bottom:1px}.tablewrap.lt td:first-child{min-width:0}.tablewrap.runs tr{display:grid;grid-template-columns:1fr 1fr;gap:4px 14px}.tablewrap.runs td{display:block;margin:0}.tablewrap.runs td:first-child,.tablewrap.runs td:last-child{grid-column:1/-1}.tablewrap.runs td[data-label]::before{display:block;margin-bottom:1px}.tablewrap.inv td:nth-child(3)::before{content:""}.mobsort{display:flex;gap:8px}.msince{display:inline}.row-text strong,.row-text small{white-space:normal;overflow:visible;text-overflow:clip;overflow-wrap:anywhere}.pathcard{grid-template-columns:auto 1fr}.pathcard .btn{grid-column:1/-1}.planrow{grid-template-columns:auto minmax(0,1fr)}.planrow>span:last-child{grid-column:1/-1;justify-content:flex-start!important}.detailhead{grid-template-columns:auto 1fr}.actions{grid-column:1/-1}.check{grid-template-columns:22px 1fr auto}.check .val{grid-column:2/-1;grid-row:2;white-space:normal}}
      /* Fixed sidebar: it stays in view while long content scrolls; Settings sits at the visible bottom edge. */
      /* Equal-width tiles on the overview and the changes view. */
      .card:has(.ring) .card-text em{overflow:visible;white-space:normal;text-overflow:clip;line-height:1.35}
      .summary{grid-template-columns:repeat(auto-fit,minmax(210px,1fr))}.summary>.card:has(.ring){grid-template-columns:auto minmax(0,1fr)}.summary .ring{width:56px;height:56px}.summary>.card:has(.ring) .card-text strong{font-size:calc(16px*var(--hk-fs,1));line-height:1.25}
      .summary>.card{min-height:92px;border-top:3px solid var(--hk-border)}
      .summary>.card:has(.ring){border-top-color:var(--hk-green)}.summary>.card:has(.ring.warn){border-top-color:var(--hk-amber)}.summary>.card:has(.ring.red){border-top-color:var(--hk-red)}
      .summary>.card:has(.tile.ok){border-top-color:var(--hk-green)}.summary>.card:has(.tile.warn){border-top-color:var(--hk-amber)}.summary>.card:has(.tile.red){border-top-color:var(--hk-red)}.summary>.card:has(.tile.violet){border-top-color:var(--hk-violet)}
      @media(max-width:520px){.summary{grid-template-columns:1fr 1fr}.summary>.card:has(.ring){grid-column:1/-1}.summary>.card{min-height:0;padding:12px}}
      /* Polish */
      .panel,.card{box-shadow:0 1px 2px color-mix(in srgb,var(--hk-text) 7%,transparent)}
      .card{border-radius:14px}.card .tile{width:46px;height:46px;border-radius:13px}.card-text strong{font-size:calc(26px*var(--hk-fs,1));letter-spacing:-.01em}
      button.card{transition:transform .15s ease,box-shadow .15s ease,border-color .15s ease}button.card:hover{transform:translateY(-2px);box-shadow:0 6px 18px color-mix(in srgb,var(--hk-text) 12%,transparent)}
      h1{font-size:calc(28px*var(--hk-fs,1));letter-spacing:-.015em}.eyebrow{font-weight:700}
      .nav em{font-weight:600}.nav.active em{color:var(--hk-blue-text);background:color-mix(in srgb,var(--hk-blue) 6%,transparent)}
      .panelhead>div:first-child{flex:1 1 0;min-width:0}.panelhead>.actions{flex:0 0 auto;flex-wrap:nowrap;justify-content:flex-end;align-items:center}.panelhead>.actions .btn{white-space:nowrap}@media(max-width:640px){.panelhead:has(>.actions){flex-wrap:wrap}.panelhead>.actions{flex:1 1 100%;flex-wrap:wrap;justify-content:stretch}.panelhead>.actions .btn{flex:1 1 auto}}.panelhead{background:linear-gradient(180deg,color-mix(in srgb,var(--hk-soft) 60%,transparent),transparent)}.panelhead h2{letter-spacing:-.005em}
      .taskgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;padding:16px}.taskcard{display:flex;flex-direction:column;align-items:flex-start;gap:6px;text-align:left;border:1px solid var(--hk-border);border-radius:12px;background:var(--hk-surface);padding:14px;cursor:pointer;color:var(--hk-text);font:inherit}.taskcard:hover,.taskcard.on{background:var(--hk-soft)}.taskcard.on{border-color:var(--hk-blue)}.compactgrid{padding:0 0 14px}.setgrid{grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))}.setgrid .taskcard{display:grid;grid-template-rows:auto auto 24px 1fr;align-content:start;justify-items:start}.setpill{min-height:24px;display:flex;align-items:center}.compactgrid .taskcard{padding:12px}.taskcard ha-icon{--mdc-icon-size:22px;color:var(--hk-blue)}.taskcard strong{font-size:calc(14px*var(--hk-fs,1));font-weight:600}.taskcard small{color:var(--hk-muted);font-size:calc(12px*var(--hk-fs,1));line-height:1.45}.repairhead{font-size:calc(16px*var(--hk-fs,1));font-weight:600;margin:10px 0 6px}
      .propgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;align-items:start}.propgrid>.wide{grid-column:1/-1}.propgrid .panel{margin:0}.propgrid .kv{grid-template-columns:120px minmax(0,1fr)}.propgrid .kv dd small{display:block}
      .steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px;list-style:none;margin:0;padding:12px 16px;border-bottom:1px solid var(--hk-border)}.step{display:flex;gap:9px;align-items:flex-start;padding:8px 10px;border-radius:8px;color:var(--hk-muted)}.step .mark{flex:none;width:22px;height:22px;display:grid;place-items:center;border:1.5px solid currentColor;border-radius:50%;font-size:calc(11px*var(--hk-fs,1));font-weight:700}.steptext{display:grid;gap:2px;min-width:0}.steptext b{font-size:calc(12px*var(--hk-fs,1));font-weight:600;overflow-wrap:break-word;hyphens:auto}.steptext small{font-size:calc(11px*var(--hk-fs,1));overflow-wrap:anywhere}
      .step.done{color:color-mix(in srgb,var(--hk-green) 60%,var(--hk-text))}.step.current{color:color-mix(in srgb,var(--hk-blue) 60%,var(--hk-text));background:color-mix(in srgb,var(--hk-blue) 10%,transparent)}.step.current .mark{background:var(--hk-blue);border-color:var(--hk-blue);color:var(--hk-on,#fff)}.step.failed{color:color-mix(in srgb,var(--hk-red) 60%,var(--hk-text));background:color-mix(in srgb,var(--hk-red) 9%,transparent)}.step.skipped{opacity:.85}
      .qlight{display:none;gap:3px;margin-top:4px}.qlight i{width:9px;height:9px;border-radius:50%;background:var(--hk-muted)}.qlight i.ok{background:var(--hk-ok,#3f7d4e)}.qlight i.warn{background:var(--hk-warn,#b8860b)}.qlight i.red{background:var(--hk-red,#b3392f)}@media(max-width:700px){.qualitytable th:not(:first-child):not(:last-child),.qualitytable td:not(:first-child):not(:last-child){display:none}.qlight{display:flex}}.foldhead{width:100%}.foldbody{margin:0 0 6px 28px;border-left:2px solid var(--hk-line,rgba(128,128,128,.25))}.foldadvice{margin:6px 16px 2px}.foldhd,.expohd{margin:14px 16px 4px;font-size:calc(11px*var(--hk-fs,1));letter-spacing:.08em;text-transform:uppercase;color:var(--hk-muted)}.rowdetails{margin-top:6px}.rowdetails summary{cursor:pointer;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}
      .planrow{align-items:start}.planrow .row-text small{overflow:visible;white-space:normal;text-overflow:clip}
      .row.sel{background:color-mix(in srgb,var(--hk-blue) 10%,var(--hk-soft))}.row.rel .bar i{background:var(--hk-gray)}.row.sel .bar i{background:var(--hk-blue)}
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
      /* depth: three shadow levels, a light edge on top of every surface, state stripes on task tiles */
      :host{--hk-sh1:0 1px 2px rgba(var(--hk-sh-rgb,19,28,23),.07),0 1px 1px rgba(var(--hk-sh-rgb,19,28,23),.04);--hk-sh2:0 6px 16px rgba(var(--hk-sh-rgb,19,28,23),.09),0 1px 3px rgba(var(--hk-sh-rgb,19,28,23),.07);--hk-sh3:0 12px 28px rgba(var(--hk-sh-rgb,19,28,23),.14),0 2px 6px rgba(var(--hk-sh-rgb,19,28,23),.08);--hk-hi:inset 0 1px 0 rgba(255,255,255,.7)}
      .panel,.card,.sumtile,.type,.modeopt{box-shadow:var(--hk-sh1),var(--hk-hi)}
      .panel{margin-bottom:16px}.card[data-jump]:hover,.sumtile:hover,.type:hover{box-shadow:var(--hk-sh2),var(--hk-hi)}
      .card,.sumtile,.type,.taskcard{transition:transform .15s ease,box-shadow .15s ease,background .15s ease,border-color .15s ease}
      .statushead{display:flex;align-items:center;gap:20px;flex-wrap:wrap;padding:20px 22px;margin-bottom:16px;border:1px solid var(--hk-border);border-radius:14px;background:var(--hk-surface);box-shadow:var(--hk-sh2),var(--hk-hi)}
      .statushead .ring{width:84px;height:84px;flex:none;box-shadow:inset 0 0 0 1px var(--hk-border),var(--hk-sh1);background:radial-gradient(circle at center,var(--hk-surface) 66%,transparent 68%),conic-gradient(var(--c) calc(var(--p)*1%),var(--hk-soft) 0)}
      .statushead .ring b{font-size:calc(22px*var(--hk-fs,1));font-weight:600}
      .statustext{min-width:0;flex:1 1 220px}.statustext h2{font-size:calc(18px*var(--hk-fs,1));font-weight:600}.statustext p{margin-top:3px;color:var(--hk-muted);font-size:calc(12px*var(--hk-fs,1))}
      .kpis{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(120px,1fr);gap:10px;margin-left:auto}@media(max-width:640px){.kpis{grid-auto-flow:row;grid-template-columns:repeat(2,minmax(0,1fr));width:100%}}
      .kpi{display:block;min-width:0;text-align:left;padding:9px 14px;border:1px solid var(--hk-border);border-radius:10px;background:var(--hk-soft);color:inherit;font:inherit;cursor:pointer;box-shadow:var(--hk-hi)}.kpi:hover{box-shadow:var(--hk-sh2)}
      .kpi small{display:block;color:var(--hk-muted);font-size:calc(12px*var(--hk-fs,1))}.kpi strong{font-size:calc(20px*var(--hk-fs,1));font-weight:600}.kpi.red strong{color:var(--hk-red)}.kpi.warn strong{color:var(--hk-amber)}
      .taskgrid{gap:14px}
      .taskcard{--c:var(--hk-blue);position:relative;overflow:hidden;padding-left:20px;box-shadow:var(--hk-sh1),var(--hk-hi)}
      .taskcard::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--c)}
      .taskcard ha-icon{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 14%,transparent);color:var(--c);--mdc-icon-size:22px;margin-bottom:2px}
      .taskcard:hover{transform:translateY(-2px);box-shadow:var(--hk-sh3),var(--hk-hi)}.taskcard.on{box-shadow:var(--hk-sh2),var(--hk-hi)}
      .taskcard.t-ok{--c:var(--hk-green)}.taskcard.t-warn{--c:var(--hk-amber)}.taskcard.t-red{--c:var(--hk-red)}.taskcard.t-mute{--c:var(--hk-gray)}
      .emptymsg{display:grid;justify-items:center;gap:6px;padding:38px 22px;text-align:center;color:var(--hk-muted)}
      .emptymsg ha-icon{width:60px;height:60px;border-radius:50%;display:grid;place-items:center;margin:0 0 6px;--mdc-icon-size:30px;background:color-mix(in srgb,var(--hk-green) 14%,transparent);box-shadow:var(--hk-sh2),var(--hk-hi)}
      .emptymsg.mute ha-icon{color:var(--hk-gray);background:var(--hk-soft)}.emptymsg.info ha-icon{color:var(--hk-blue);background:color-mix(in srgb,var(--hk-blue) 14%,transparent)}
      .emptymsg strong{color:var(--hk-text);font-size:calc(15px*var(--hk-fs,1));font-weight:600}.emptymsg .btn{margin-top:10px}
      .stepsbar{display:flex;align-items:center;margin:0 0 16px}.stepsbar .step{display:flex;align-items:center;gap:8px;color:var(--hk-muted);font-size:calc(13px*var(--hk-fs,1))}
      .stepsbar .step i{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-style:normal;font-size:calc(12px*var(--hk-fs,1));background:var(--hk-surface);border:1px solid var(--hk-border);box-shadow:var(--hk-sh1)}
      .stepsbar .step.on{color:var(--hk-text);font-weight:600}.stepsbar .step.on i{background:var(--hk-blue);color:var(--hk-on,#fff);border-color:var(--hk-blue)}
      .stepsbar .step.done i{background:color-mix(in srgb,var(--hk-green) 16%,var(--hk-surface));color:var(--hk-green);border-color:var(--hk-green)}
      .stepsbar .line{flex:1;height:2px;min-width:20px;margin:0 10px;border-radius:2px;background:var(--hk-border)}.stepsbar .line.done{background:var(--hk-green)}
      .rangechart .grid{stroke:var(--hk-border);stroke-width:1}
      ${this.themeCss()}
    </style>`;
  }
}

// Texts for the policies view; merged into TEXT.
Object.assign(TEXT.de, {
  polAllRules: "Alle Regeln", polNoViolations: "Keine Verstöße.", polSumRules: "Regeln an", polSumViolations: "Verstöße", polSumHidden: "Ausgeblendet", polTabViolations: "Verstöße", polTabRules: "Regeln",
  policies: "Richtlinien", policiesSubtitle: "Eigene Regeln für Ordnung in Home Assistant. Hinweise, keine Defekte; liest nur.",
  polTitle: "Qualitätsrichtlinien", polHint: "Schalte ein, was in deiner Installation gelten soll. Alle Regeln sind zunächst aus.", polLoading: "Richtlinien werden geprüft",
  polOff: "aus", polCount: "{n} Verstöße", polCountOne: "1 Verstoß", polNone: "Keine Verstöße", polNoneOn: "Schalte oben eine Regel ein, um Verstöße zu sehen.",
  polRule_entity_area: "Entität ohne Bereich", polDesc_entity_area: "Entitäten von physischen Geräten brauchen einen Bereich, eigenen oder den des Geräts. Diagnose-, Konfigurations- und deaktivierte Entitäten und Dienst-Geräte zählen nicht.",
  polRule_device_area: "Gerät ohne Bereich", polDesc_device_area: "Aktive Geräte brauchen einen Bereich. Dienst-Geräte, Untergeräte, deaktivierte und leere Geräte zählen nicht.",
  polRule_automation_description: "Automation ohne Beschreibung", polDesc_automation_description: "Automationen aus der Konfiguration brauchen eine Beschreibung.",
  polRule_battery_device: "Batterie-Entität ohne Gerät", polDesc_battery_device: "Entitäten mit der Geräteklasse Batterie sollen zu einem Gerät gehören.",
  polRule_duplicate_name: "Doppelter Anzeigename", polDesc_duplicate_name: "Aktive Entitäten derselben Domain sollen nicht gleich heißen (Groß-/Kleinschreibung und Leerzeichen zählen nicht). Über Domains hinweg ist derselbe Name in Ordnung.",
  polRule_automation_label: "Automation ohne Label", polDesc_automation_label: "Automationen sollen mindestens ein Label tragen. Geprüft werden nur Automationen mit Eintrag in der Entitäts-Registry; nur sie können ein Label haben.",
  polRule_naming_scheme: "Namensschema", polDesc_naming_scheme: "Die Entitäts-ID einer Domain beginnt mit einem Präfix, das du unten festlegst, zum Beispiel wz_ für sensor. Ohne Präfix wird nichts geprüft.",
  polAlso: "Gleicher Name wie: {ids}", polExpected: "Erwartet das Präfix {prefix}", polPrefixIs: "Präfix: {prefix}", polPrefixRemove: "Entfernen", polPrefixAdd: "Hinzufügen", polPrefixDomain: "Domain (z. B. sensor)", polPrefixValue: "Präfix (z. B. wz_)", polPrefixNone: "Noch kein Präfix festgelegt. Erlaubt sind Kleinbuchstaben, Ziffern und Unterstrich; höchstens 10 Domains.",
  polHide: "Ausblenden", polShow: "Einblenden", polHiddenLabel: "ausgeblendet", polByLabel: "per Label ausgeblendet",
  polHiddenN: "{n} ausgeblendet", polShowHidden: "Ausgeblendete zeigen", polHideHidden: "Ausgeblendete verbergen", polMore: "und {n} weitere",
  polFootnote: "Richtlinien sind Hinweise zur Ordnung und keine Defekte: Sie zählen nicht in Gesundheit, Befunde, Reparaturhinweise oder Sensoren. Housekeeper vergleicht nur die vorhandenen Daten des letzten Scans. Mit dem Label housekeeper_ignore an einer Entität, einem Gerät oder einer Automation oder über Ausblenden nimmst du ein Objekt aus. Die Schalter liegen nur in Housekeeper.",
  polRule_state_rate: "Zustandsänderungen pro Tag", polDesc_state_rate: "Entitäten, die in den zuletzt berechneten Last-Zahlen mindestens so oft am Tag ihren Zustand geändert haben, wie die Grenze sagt. Die Regel startet keine Recorder-Abfrage.", polLimit: "Grenze (Änderungen pro Entität und Tag)", polLimitSave: "Speichern", polPending: "Noch nicht berechnet: Öffne Recorder → Last einmal, dann prüft die Regel diese Zahlen.", polRate: "{n} Änderungen pro Tag",
});
Object.assign(TEXT.en, {
  polAllRules: "All rules", polNoViolations: "No violations.", polSumRules: "Rules on", polSumViolations: "Violations", polSumHidden: "Hidden", polTabViolations: "Violations", polTabRules: "Rules",
  policies: "Policies", policiesSubtitle: "Your own rules for tidiness in Home Assistant. Hints, not defects; only reads.",
  polTitle: "Quality policies", polHint: "Switch on what should apply to your installation. All rules start off.", polLoading: "Checking policies",
  polOff: "off", polCount: "{n} violations", polCountOne: "1 violation", polNone: "No violations", polNoneOn: "Switch on a rule above to see violations.",
  polRule_entity_area: "Entity without an area", polDesc_entity_area: "Entities of physical devices need an area, their own or the device's. Diagnostic, configuration and disabled entities and service devices do not count.",
  polRule_device_area: "Device without an area", polDesc_device_area: "Active devices need an area. Service devices, sub-devices, disabled and empty devices do not count.",
  polRule_automation_description: "Automation without a description", polDesc_automation_description: "Automations from the configuration need a description.",
  polRule_battery_device: "Battery entity without a device", polDesc_battery_device: "Entities with the battery device class should belong to a device.",
  polRule_duplicate_name: "Duplicate display name", polDesc_duplicate_name: "Active entities of the same domain should not share a name (case and spaces do not count). The same name across domains is fine.",
  polRule_automation_label: "Automation without a label", polDesc_automation_label: "Automations should carry at least one label. Only automations with an entity registry entry are checked; only they can have a label.",
  polRule_naming_scheme: "Naming scheme", polDesc_naming_scheme: "The entity id of a domain starts with a prefix you set below, for example wz_ for sensor. Without a prefix nothing is checked.",
  polAlso: "Same name as: {ids}", polExpected: "Expects the prefix {prefix}", polPrefixIs: "Prefix: {prefix}", polPrefixRemove: "Remove", polPrefixAdd: "Add", polPrefixDomain: "Domain (e.g. sensor)", polPrefixValue: "Prefix (e.g. wz_)", polPrefixNone: "No prefix set yet. Lowercase letters, digits and underscore are allowed; at most 10 domains.",
  polHide: "Hide", polShow: "Show", polHiddenLabel: "hidden", polByLabel: "hidden by label",
  polHiddenN: "{n} hidden", polShowHidden: "Show hidden", polHideHidden: "Hide hidden", polMore: "and {n} more",
  polFootnote: "Policies are hints about tidiness and not defects: they do not count in health, findings, repair hints or sensors. Housekeeper only compares the data of the last scan. The label housekeeper_ignore on an entity, device or automation, or Hide, takes an object out. The switches live only in Housekeeper.",
  polRule_state_rate: "State changes per day", polDesc_state_rate: "Entities that changed state at least as often per day as the limit says, in the last calculated load numbers. The rule never starts a recorder query.", polLimit: "Limit (changes per entity and day)", polLimitSave: "Save", polPending: "Not calculated yet: open Recorder → Load once, then the rule checks those numbers.", polRate: "{n} changes per day",
});

// ListsMixin: methods of the panel element, mixed into the class in 99-register.js.
const VIEWS_KEY = "ha_housekeeper.views";
const VIEWS_LIMIT = 10;

class ListsMixin {
  th(key, label) {
    const on = this.sort === key;
    return `<th data-sort="${key}" aria-sort="${on ? (this.sortDir === "desc" ? "descending" : "ascending") : "none"}"><button type="button" class="thbtn" data-sortbtn="${key}">${this.t(label)}${on ? ` <span aria-hidden="true">${this.sortDir === "desc" ? "▼" : "▲"}</span>` : ""}</button></th>`;
  }

  // Shared list controls: per-list search, filters and sort kept in this.lv[id].
  // The sort and the filters of a list come back at the next visit (this browser only); the search text does not.
  lvState(id, sort, dir) {
    if (this.lv[id]) return this.lv[id];
    const kept = this.lvStored()[id];
    const ok = kept && typeof kept.sort === "string" && (kept.dir === "asc" || kept.dir === "desc");
    return (this.lv[id] = { q: "", sort: ok ? kept.sort : sort, dir: ok ? kept.dir : dir, f: ok && kept.f && typeof kept.f === "object" ? Object.fromEntries(Object.entries(kept.f).filter(([, v]) => typeof v === "string")) : {}, view: "" });
  }

  lvStored() {
    if (this._lvStored) return this._lvStored;
    let stored = {};
    try { stored = JSON.parse(globalThis.localStorage?.getItem("ha_housekeeper.lv") || "{}"); } catch (_) { stored = {}; }
    return (this._lvStored = stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {});
  }

  persistLv(id) {
    const st = this.lv[id];
    if (!st) return;
    this.lvStored()[id] = { sort: st.sort, dir: st.dir, f: Object.fromEntries(Object.entries(st.f).filter(([, v]) => v)) };
    try { globalThis.localStorage?.setItem("ha_housekeeper.lv", JSON.stringify(this._lvStored)); } catch (_) { /* kept until the page closes */ }
  }

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

  // A search box over a list that keeps its own order. The box shows from `min` items on, or while a text is set.
  searchList(id, items, text, min = 6) {
    const st = this.lvState(id, "", "asc"), q = st.q.trim().toLowerCase();
    const rows = q ? items.filter(item => text(item).toLowerCase().includes(q)) : items;
    return { rows, bar: items.length >= min || st.q ? this.listBar(id, { sorts: [] }) : "", none: q && !rows.length ? `<div class="emptymsg">${this.t("noMatches")}</div>` : "" };
  }

  listBar(id, { sorts, filters = [], columns = [] }) {
    const st = this.lv[id];
    for (const f of filters) if (st.f[f.name] && !f.options.some(([v]) => v === st.f[f.name])) delete st.f[f.name]; // a kept value this list no longer offers
    (this.lvDirs ||= {})[id] = Object.fromEntries(sorts.map(x => [x.key, x.dir]));
    const selects = filters.map(f => `<select data-lf="${id}|${f.name}" aria-label="${this.esc(f.all)}"><option value="">${this.esc(f.all)}</option>${f.options.map(([v, label]) => `<option value="${this.esc(v)}" ${st.f[f.name] === v ? "selected" : ""}>${this.esc(label)}</option>`).join("")}</select>`).join("");
    const sortOptions = sorts.map(x => `<option value="${x.key}" ${st.sort === x.key ? "selected" : ""}>${this.t(x.label)}</option>`).join("");
    const desc = st.dir === "desc";
    return `<div class="listbar"><input type="search" data-lq="${id}" value="${this.esc(st.q)}" placeholder="${this.t("searchList")}">${selects}${sorts.length ? `<span class="sortgroup"><select data-ls="${id}" aria-label="${this.t("sortBy")}">${sortOptions}</select><button class="dirbtn" data-ld="${id}" title="${this.t(desc ? "sortDescending" : "sortAscending")}" aria-label="${this.t(desc ? "sortDescending" : "sortAscending")}"><ha-icon icon="${desc ? "mdi:sort-descending" : "mdi:sort-ascending"}"></ha-icon></button></span>` : ""}${this.viewsControl(id)}${this.denseButton()}${this.listTools(id, columns)}</div>`;
  }

  // Column picker and CSV export of a list; both are optional. `columns` are the switchable columns: { key, label }.
  listTools(id, columns = []) {
    const open = this._colOpen === id;
    const picker = columns.length ? `<span class="colwrap"><button type="button" class="dirbtn ${open ? "on" : ""}" data-col-open="${id}" aria-expanded="${open}" title="${this.esc(this.t("colsLabel"))}" aria-label="${this.esc(this.t("colsLabel"))}"><ha-icon icon="mdi:table-column"></ha-icon></button>${open ? `<span class="colpop" role="group" aria-label="${this.esc(this.t("colsLabel"))}">${columns.map(c => `<label><input type="checkbox" data-col="${id}|${c.key}" ${this.colHidden(id, c.key) ? "" : "checked"}> ${this.t(c.label)}</label>`).join("")}</span>` : ""}</span>` : "";
    const download = this._exporters?.[id] ? `<button type="button" class="dirbtn" data-export-list="${id}" title="${this.esc(this.t("exportListTitle"))}" aria-label="${this.esc(this.t("exportListTitle"))}"><ha-icon icon="mdi:download"></ha-icon></button>` : "";
    return picker + download;
  }

  // Hidden columns per list, kept in this browser only.
  colState() {
    if (this._cols) return this._cols;
    let stored = {};
    try { stored = JSON.parse(globalThis.localStorage?.getItem("ha_housekeeper.cols") || "{}"); } catch (_) { stored = {}; }
    const clean = {};
    if (stored && typeof stored === "object") for (const [id, keys] of Object.entries(stored)) if (Array.isArray(keys)) clean[id] = keys.filter(k => typeof k === "string").slice(0, 20);
    return (this._cols = clean);
  }

  colHidden(id, key) { return (this.colState()[id] || []).includes(key); }

  toggleCol(id, key) {
    const state = this.colState(), list = state[id] || [];
    state[id] = list.includes(key) ? list.filter(k => k !== key) : [...list, key];
    try { globalThis.localStorage?.setItem("ha_housekeeper.cols", JSON.stringify(state)); } catch (_) { /* kept until the page closes */ }
    this.render();
  }

  // A list as CSV: every row of the current search and filters, all columns. Same formula guard as the findings export.
  downloadRows(name, header, rows) {
    const cell = v => { let t = String(v ?? ""); if (/^[=+\-@\t\r]/.test(t)) t = "'" + t; return `"${t.replace(/"/g, '""')}"`; };
    const body = "\ufeff" + [header, ...rows].map(r => r.map(cell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = `ha-housekeeper-${name}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // The view registers what its export holds before it draws the list bar: { name, header, rows() }.
  exportList(id) {
    const ex = this._exporters?.[id];
    if (ex) this.downloadRows(ex.name, ex.header, ex.rows());
  }

  setExporter(id, name, header, rows) { (this._exporters ||= {})[id] = { name, header, rows }; }

  // Compact lists show the first line of every row; one switch for all lists, kept in this browser.
  denseButton() {
    if (this.dense === undefined) { try { this.dense = globalThis.localStorage?.getItem("ha_housekeeper.dense") === "1"; } catch (_) { this.dense = false; } }
    const label = this.t(this.dense ? "denseOff" : "denseOn");
    return `<button type="button" class="dirbtn" data-dense aria-pressed="${this.dense}" title="${label}" aria-label="${label}"><ha-icon icon="${this.dense ? "mdi:format-line-spacing" : "mdi:view-agenda-outline"}"></ha-icon></button>`;
  }

  // A sortable table for a list built with lvState/refine: header buttons set sort and direction, the phone shows cards.
  // columns: [{ key, label, cell(item) -> html, sortable, dir }]; rowAttrs(item) adds attributes to the row.
  listTable(id, columns, rows, { rowAttrs = () => "", cls = "" } = {}) {
    const st = this.lv[id];
    columns = columns.filter((c, i) => !i || !this.colHidden(id, c.key));
    const head = columns.map(c => {
      const on = st.sort === c.key;
      const inner = c.sortable === false ? this.t(c.label) : `<button type="button" class="thbtn" data-lsort="${id}|${c.key}|${c.dir || "asc"}">${this.t(c.label)}${on ? ` <span aria-hidden="true">${st.dir === "desc" ? "↓" : "↑"}</span>` : ""}</button>`;
      return `<th scope="col" aria-sort="${on ? (st.dir === "desc" ? "descending" : "ascending") : "none"}">${inner}</th>`;
    }).join("");
    const body = rows.map(item => {
      const attrs = rowAttrs(item);
      return `<tr ${attrs}>${columns.map((c, i) => `<td${i ? ` data-label="${this.esc(this.t(c.label))}"` : ""}>${c.cell(item)}</td>`).join("")}</tr>`;
    }).join("");
    return `<div class="tablewrap lt ${cls}"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
  }

  // Name over id for a table cell: both are cut at the column width and shown in full in the tooltip (see showTip).
  nameCell(name, id, tag = "div") {
    const sub = id || "";
    return `<${tag} class="namecell" data-tip="${this.esc(name)}" data-tip-sub="${this.esc(sub)}"><strong class="cut">${this.esc(name)}</strong>${sub ? `<span class="id cut">${this.esc(sub)}</span>` : ""}</${tag}>`;
  }

  // The date of a table cell: how long ago, with the exact time as a tooltip; empty when unknown.
  ageCell(iso) {
    if (!iso) return `<span class="muted">–</span>`;
    return `<span title="${this.esc(this.formatDate(iso))}">${this.esc(this.relTime(iso))}</span>`;
  }

  // Saved list views: search text, filters and sort under a name, kept in this browser only.
  viewsStore() {
    if (this._views) return this._views;
    let stored = {};
    try { stored = JSON.parse(globalThis.localStorage?.getItem(VIEWS_KEY) || "{}"); } catch (_) { stored = {}; }
    const clean = {};
    if (stored && typeof stored === "object") {
      for (const [id, list] of Object.entries(stored)) {
        if (!Array.isArray(list)) continue;
        clean[id] = list.filter(v => v && typeof v.name === "string" && v.name && typeof v.q === "string" && v.f && typeof v.f === "object" && typeof v.sort === "string" && (v.dir === "asc" || v.dir === "desc"))
          .slice(0, VIEWS_LIMIT).map(v => ({ name: v.name.slice(0, 40), q: v.q, f: Object.fromEntries(Object.entries(v.f).filter(([, x]) => typeof x === "string")), sort: v.sort, dir: v.dir }));
      }
    }
    return (this._views = clean);
  }

  persistViews() {
    try { globalThis.localStorage?.setItem(VIEWS_KEY, JSON.stringify(this._views || {})); } catch (_) { /* a private window: the views last until the page closes */ }
  }

  viewsControl(id) {
    const st = this.lv[id], saved = this.viewsStore()[id] || [];
    const dirty = Boolean(st.q.trim()) || Object.values(st.f).some(Boolean);
    if (!saved.length && !dirty) return "";
    const select = saved.length ? `<select data-lview="${id}" aria-label="${this.esc(this.t("viewsLabel"))}"><option value="">${this.t("viewsNone")}</option>${saved.map(v => `<option value="${this.esc(v.name)}" ${st.view === v.name ? "selected" : ""}>${this.esc(v.name)}</option>`).join("")}</select>` : "";
    if (this.viewNaming === id) {
      return `<form class="viewgroup" data-lview-form="${id}"><input data-lview-name="${id}" maxlength="40" autocomplete="off" value="${this.esc(this.viewDraft)}" aria-label="${this.esc(this.t("viewName"))}" placeholder="${this.esc(this.t("viewName"))}"><button type="submit" class="btn">${this.t("viewSave")}</button><button type="button" class="btn quiet" data-lview-cancel="${id}">${this.t("cancelRun")}</button></form>`;
    }
    const save = dirty ? `<button type="button" class="btn quiet" data-lview-save="${id}">${this.t("viewSave")}</button>` : "";
    const remove = st.view && saved.some(v => v.name === st.view) ? `<button type="button" class="btn quiet" data-lview-delete="${id}">${this.t("viewDelete")}</button>` : "";
    return `<span class="viewgroup">${select}${save}${remove}</span>`;
  }

  applyView(id, name) {
    const st = this.lv[id], view = (this.viewsStore()[id] || []).find(v => v.name === name);
    st.view = view ? view.name : "";
    if (view) { st.q = view.q; st.f = { ...view.f }; st.sort = view.sort; st.dir = view.dir; }
    this.pages = {}; this.render();
  }

  // Naming a view happens in a small inline form (name, save, cancel), not in a browser prompt.
  saveView(id) {
    this.viewNaming = id; this.viewDraft = this.lv[id].view || "";
    this.render();
    this.shadowRoot?.querySelector?.(`[data-lview-name="${id}"]`)?.focus?.();
  }

  cancelView(id) {
    this.viewNaming = null;
    this.render();
    this.shadowRoot?.querySelector?.(`[data-lview-save="${id}"]`)?.focus?.();
  }

  commitView(id, text) {
    const st = this.lv[id], name = String(text || "").trim().slice(0, 40);
    if (!name) return;
    const store = this.viewsStore(), list = (store[id] ||= []);
    const view = { name, q: st.q, f: Object.fromEntries(Object.entries(st.f).filter(([, v]) => v)), sort: st.sort, dir: st.dir };
    const at = list.findIndex(v => v.name === name);
    if (at >= 0) list[at] = view; else if (list.length < VIEWS_LIMIT) list.push(view); else list[list.length - 1] = view;
    st.view = name; this.viewNaming = null; this.persistViews(); this.render();
    this.shadowRoot?.querySelector?.(`[data-lview-save="${id}"]`)?.focus?.();
  }

  deleteView(id) {
    const st = this.lv[id], store = this.viewsStore();
    store[id] = (store[id] || []).filter(v => v.name !== st.view);
    st.view = ""; this.persistViews(); this.render();
  }

  // Long explanations of how a number is counted fold away, so the lists end earlier.
  howCounted(key, vars) {
    return `<details class="howto"><summary>${this.t("howCounted")}</summary><p class="factnote">${this.t(key, vars)}</p></details>`;
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

  // A fold: the head always shows, the body only while open. `def` is the state until the person toggles it.
  // head: { tone, title, sub, pill }; the state lives in this.folds and survives a render.
  foldOpen(id, def) { return this.folds?.[id] ?? def; }

  fold(id, head, body, def, force) {
    const open = force ?? this.foldOpen(id, def);
    const pill = head.pill ? `<span class="pill ${head.tone || "mute"}">${this.esc(head.pill)}</span>` : "";
    const top = `<button class="row foldhead" data-fold="${this.esc(id)}" aria-expanded="${open}"><span class="tile ${head.tone || "mute"}"><ha-icon icon="mdi:${open ? "chevron-down" : "chevron-right"}"></ha-icon></span><span class="row-text"><strong>${head.title}</strong>${head.sub ? `<small>${this.esc(head.sub)}</small>` : ""}</span>${pill}</button>`;
    return `<div class="fold${open ? " open" : ""}">${top}${open ? `<div class="foldbody">${body}</div>` : ""}</div>`;
  }
}

// Texts for the flow tab of automations and scripts; merged into TEXT.
Object.assign(TEXT.de, {
  flowTab: "Ablauf", flowMode: "Modus", flowMax: "Maximal gleichzeitig", flowNone: "Nichts eingerichtet.", flowNoConditions: "Keine Bedingungen: Die Aktionen laufen bei jedem Auslöser.",
  flowIf: "Wenn", flowThen: "Dann", flowElse: "Sonst", flowBranch: "Zweig {n}", flowBranches: "{n} Zweige", flowWhile: "Solange", flowUntil: "Bis", flowForEach: "Für jedes Element", flowFrom: "von", flowTo: "auf", flowFor: "für", flowTemplate: "Vorlage",
  flowContinueOnError: "weiter bei Fehler", flowDisabled: "ausgeschaltet", flowCut: "{n} weitere Schritte sind nicht dargestellt.",
  flowNote: "Der Pfad rechts jedes Schritts ist die Fundstelle, wie sie auch in den Befunden steht. Rot markiert sind Schritte mit fehlenden Objekten oder einem Befund.",
  flow_state: "Zustand", flow_numeric_state: "Zahlenwert", flow_time: "Zeit", flow_time_pattern: "Zeitmuster", flow_sun: "Sonne", flow_event: "Ereignis", flow_template: "Vorlage", flow_webhook: "Webhook", flow_mqtt: "MQTT", flow_homeassistant: "Home Assistant", flow_zone: "Zone", flow_device: "Gerät", flow_trigger: "Auslöser",
  flow_action: "Aktion", flow_choose: "Auswahl", flow_if: "Wenn-Dann", flow_repeat: "Wiederholung", flow_parallel: "Parallel", flow_sequence: "Folge", flow_wait_template: "Warten auf Vorlage", flow_wait_for_trigger: "Warten auf Auslöser", flow_delay: "Verzögerung", flow_variables: "Variablen", flow_stop: "Stopp", flow_scene: "Szene", flow_and: "Alle", flow_or: "Eine davon", flow_not: "Keine", flow_condition: "Bedingung", flow_unknown: "Schritt",
});
Object.assign(TEXT.en, {
  flowTab: "Flow", flowMode: "Mode", flowMax: "Maximum at once", flowNone: "Nothing set up.", flowNoConditions: "No conditions: the actions run on every trigger.",
  flowIf: "If", flowThen: "Then", flowElse: "Else", flowBranch: "Branch {n}", flowBranches: "{n} branches", flowWhile: "While", flowUntil: "Until", flowForEach: "For each item", flowFrom: "from", flowTo: "to", flowFor: "for", flowTemplate: "template",
  flowContinueOnError: "continue on error", flowDisabled: "disabled", flowCut: "{n} more steps are not shown.",
  flowNote: "The path on the right of each step is the location as it appears in the findings. Steps with missing objects or a finding are marked red.",
  flow_state: "State", flow_numeric_state: "Number", flow_time: "Time", flow_time_pattern: "Time pattern", flow_sun: "Sun", flow_event: "Event", flow_template: "Template", flow_webhook: "Webhook", flow_mqtt: "MQTT", flow_homeassistant: "Home Assistant", flow_zone: "Zone", flow_device: "Device", flow_trigger: "Trigger",
  flow_action: "Action", flow_choose: "Choose", flow_if: "If-then", flow_repeat: "Repeat", flow_parallel: "Parallel", flow_sequence: "Sequence", flow_wait_template: "Wait for template", flow_wait_for_trigger: "Wait for trigger", flow_delay: "Delay", flow_variables: "Variables", flow_stop: "Stop", flow_scene: "Scene", flow_and: "All of", flow_or: "Any of", flow_not: "None of", flow_condition: "Condition", flow_unknown: "Step",
});

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
    const causes = this.causeList().length;
    if (causes) items.push({ key: "causes", tone: "red", icon: "mdi:source-branch", label: "actCauses", hint: "actCausesHint", count: causes, view: "findingsNav", filter: "" });
    const regressions = (this.data.regressions || []).length;
    if (regressions) items.push({ key: "followup", tone: "red", icon: "mdi:history", label: "actFollowup", hint: "actFollowupHint", count: regressions, view: "journal" });
    const due = (this.data.reminders || []).filter(r => r.state === "due").length;
    if (due) items.push({ key: "reminders", tone: "warn", icon: "mdi:wrench-clock", label: "actReminders", hint: "actRemindersHint", count: due, view: "reminders" });
    const missed = (this.data.criteria_alerts || []).length;
    if (missed) items.push({ key: "criteria", tone: "warn", icon: "mdi:target", label: "actCriteria", hint: "actCriteriaHint", count: missed, view: "runs" });
    const fresh = (this.trend?.new_findings?.items || []).filter(f => !f.ignored && CRITICAL_CLASSES.includes(f.classification)).length;
    if (fresh) items.push({ key: "critical", tone: "red", icon: "mdi:alert-circle-outline", label: "actNewCritical", hint: "actNewCriticalHint", count: fresh, view: "findingsNav", filter: "" });
    const stale = this.staleScan();
    if (stale) {
      const age = stale.hours >= 48 ? this.t("daysValue", { n: Math.round(stale.hours / 24) }) : `${stale.hours} h`;
      items.push({ key: "stale", tone: "warn", icon: "mdi:clock-alert-outline", text: stale.interval > 0 ? this.t("staleScan", { age, hours: stale.interval }) : this.t("staleScanManual", { age }), scan: true });
    }
    // Only real problems are listed; notes such as "emergency kit not confirmed" stay on the Maintenance card.
    const problems = this.backup?.available && this.backup.overall === "problem" ? this.backup.checks.filter(c => c.level === "problem") : [];
    const dbProblems = this.dbHealth?.available ? this.dbHealth.findings.filter(f => f.level === "problem") : [];
    if (dbProblems.length) items.push({ key: "db", tone: "red", icon: "mdi:database-alert-outline", label: "todoDbProblem", hintText: dbProblems.map(f => this.t(`dbKind_${f.kind}`)).join(", "), view: "recorder" });
    if (problems.length) items.push({ key: "backup", tone: "red", icon: "mdi:backup-restore", label: "todoBackupProblem", hintText: problems.map(c => this.t(`bh_${c.id}`)).join(", "), view: "maintenance" });
    const limit = m.quarantine_days ?? 14;
    const ready = (this.data.quarantine || []).filter(q => this.daysSince(q.since) >= limit).length;
    if (ready) items.push({ key: "quarantine", tone: "warn", icon: "mdi:archive-clock-outline", label: "actQuarantine", hint: "actQuarantineHint", count: ready, view: "cleanup" });
    this.ensureGoals();
    for (const g of (this.goals?.goals || []).filter(x => x.state === "missed")) {
      items.push({ key: `goal_${g.id}`, tone: "warn", icon: "mdi:target", text: this.t("goalMissedTitle", { goal: this.t(`goal_${g.id}`) }), hintText: `${this.goalNow(g)} · ${this.t("goalLimit", { limit: this.goalAmount(g, g.limit) })}`, view: GOAL_VIEWS[g.id] });
    }
    return items;
  }

  // Quarantined objects whose waiting time is over.
  readyQuarantine() {
    const limit = this.data?.meta?.quarantine_days ?? 14;
    return (this.data?.quarantine || []).filter(q => this.daysSince(q.since) >= limit).length;
  }

  // The tasks the person can start from here; a count says where something waits.
  actionTiles() {
    const limit = this.data.meta.quarantine_days ?? 14;
    const ready = (this.data.quarantine || []).filter(q => this.daysSince(q.since) >= limit).length;
    const missed = (this.goals?.goals || []).filter(g => g.state === "missed").length;
    const found = this.counterScan?.items?.length || 0;
    const open = this.data.findings.filter(f => !f.ignored).length;
    const tile = (view, icon, label, hint, pill, tone) => `<button class="taskcard t-${pill ? tone : "ok"}" data-jump="${view}"><ha-icon icon="${icon}"></ha-icon><strong>${this.t(label)}${pill ? ` <span class="pill ${tone}">${this.esc(pill)}</span>` : ""}</strong><small>${this.t(hint)}</small></button>`;
    return `<section class="panel" style="margin-bottom:14px" aria-labelledby="hk-tiles"><div class="panelhead"><div><h2 id="hk-tiles">${this.t("tilesTitle")}</h2></div></div><div class="taskgrid">${[
      tile("cleanup", "mdi:broom", "cleanup", "tilesCleanupHint", ready ? this.t("tilesReady", { count: this.formatNumber(ready) }) : "", "warn"),
      tile("repair", "mdi:tools", "repair", "tilesRepairHint", found ? this.t("repairFound", { count: this.formatNumber(found) }) : "", "warn"),
      tile("maintenance", "mdi:wrench-clock", "maintenance", "tilesMaintenanceHint", missed ? this.t("tilesMissed", { count: this.formatNumber(missed) }) : "", "red"),
      tile("findingsNav", "mdi:alert-outline", "findingsNav", "tilesFindingsHint", open ? this.t("tilesOpen", { count: this.formatNumber(open) }) : "", "mute"),
    ].join("")}</div></section>`;
  }

  // A line under the to-do list instead of a card of its own: how many goals are met, and where the limits are set.
  goalsLine() {
    const r = this.goals;
    if (!r?.goals?.length) return "";
    return `<div class="pad"><small>${this.t("goalsLine", { met: r.met, total: r.met + r.missed })} · <button class="link" data-goals-settings>${this.t("goalsAdjust")}</button></small></div>`;
  }

  todoCard() {
    const items = this.todoItems();
    const row = it => {
      const inner = `<span class="tile ${it.tone}"><ha-icon icon="${it.icon}"></ha-icon></span><span class="row-text"><strong>${this.esc(it.text || this.t(it.label))}</strong>${it.hint || it.hintText ? `<small>${this.esc(it.hintText || this.t(it.hint))}</small>` : ""}</span>`;
      if (it.scan) return `<div class="row todo" data-todo="${it.key}">${inner}<button class="btn" data-action="scan">${this.t("scan")}</button></div>`;
      const target = `data-jump="${it.view}"${it.filter !== undefined ? ` data-filter="${it.filter}"` : ""}${it.type ? ` data-type="${it.type}"` : ""}${it.status ? ` data-status="${it.status}"` : ""}`;
      return `<button class="row todo" data-todo="${it.key}" ${target}>${inner}${it.count !== undefined ? `<span class="pill ${it.tone}">${this.formatNumber(it.count)}</span>` : ""}</button>`;
    };
    // Red items first and open; the rest is a fold of its own once both kinds exist.
    const urgent = items.filter(i => i.tone === "red"), later = items.filter(i => i.tone !== "red");
    const grouped = urgent.length && later.length;
    const body = items.length ? (grouped
      ? `<h3 class="foldhd">${this.t("actNow")}</h3>${urgent.map(row).join("")}${this.fold("todo_later", { tone: "warn", title: this.t("actSoon"), pill: this.formatNumber(later.length) }, later.map(row).join(""), false)}`
      : items.map(row).join(""))
      : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.esc(this.t("actNone", { date: this.formatDate(this.data.meta.scanned_at) }))}</div>`;
    return `<section class="panel" style="margin-bottom:14px" aria-labelledby="hk-todo"><div class="panelhead"><div><h2 id="hk-todo">${this.t("actTitle")}</h2><p>${this.t("actSub")}</p></div></div>${body}${this.goalsLine()}</section>`;
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
    this.ensureTrend();
    this.ensureBackup();
    const kpi = ([label, value, tone, view, status]) => `<button class="kpi ${tone}" data-jump="${view}" data-status="${status || ""}"><small>${this.t(label)}</small><strong>${this.formatNumber(value)}</strong></button>`;
    const headline = health.tasks ? this.t("statusTasks", { count: this.formatNumber(health.tasks) }) : this.t("statusAllGood");
    return `<section class="statushead" title="${this.esc(this.t("healthTip", { affected: health.affected, base: health.base }))}"><span class="ring ${health.tone}" style="--p:${health.percent}"><b>${health.percent}</b></span>
      <div class="statustext"><h2>${headline}</h2><p>${this.t("health")} · ${this.t(`healthWord_${health.tone}`)} · ${this.t("healthAffected", { affected: this.formatNumber(health.affected), base: this.formatNumber(health.base) })}</p></div>
      <div class="kpis">${[["objects", m.object_count, "", "inventory"], ["openFindings", findings.length, findings.length ? "warn" : "", "findingsNav"], ["unavailable", counts.unavailable || 0, counts.unavailable ? "red" : "", "inventory", "unavailable"]].map(kpi).join("")}</div></section>
      ${this.actionTiles()}${this.todoCard()}<div class="grid2"><div class="stack">${this.inventoryStatusCard()}<div class="panel"><div class="panelhead"><div><h2>${this.t("needsAttention")}</h2><p>${this.t("sortedBySure")}</p></div><button class="link" data-jump="findingsNav">${this.t("allFindings")} (${findings.length}) <ha-icon icon="mdi:chevron-right"></ha-icon></button></div>
      ${findings.length ? findings.filter(f => !f.cause_id).slice(0, 8).map(f => this.findingRow(f)).join("") : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("noFindings")}</div>`}</div>${this.integrationProblems()}</div>
      <div class="stack">${this.databaseCard()}${this.trendCard()}${this.cleanupCard()}
      <div class="panel"><div class="panelhead"><h2>${this.t("byType")}</h2></div><div class="types">${["entity", "device", "config_entry", "automation", "script", "scene", "dashboard", "area", "floor", "label"].filter(t => types[t]).map(type => `<button class="type" data-type-jump="${type}">${this.tile(type)}<span>${this.t(type)}</span><b>${this.formatNumber(types[type])}</b></button>`).join("")}</div></div></div></div>`;
  }

  // Three groups instead of seven raw statuses: what is fine, what to look at, what is broken.
  inventoryStatusCard() {
    const m = this.data.meta, counts = m.status_counts || {}, total = Math.max(1, m.object_count);
    const groups = [
      ["invOk", "ok", ["active"]],
      ["invCheck", "warn", ["unknown", "disabled", "empty"]],
      ["invProblem", "red", ["unavailable", "orphaned", "problem"]],
    ].map(([label, tone, statuses]) => ({ label, tone, statuses, n: statuses.reduce((sum, s) => sum + (counts[s] || 0), 0) }));
    const known = groups.reduce((sum, g) => sum + g.n, 0);
    const percent = n => `${new Intl.NumberFormat(this.lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(100 * n / total)} %`;
    const detail = g => g.statuses.filter(s => counts[s]).map(s => `${this.formatNumber(counts[s])} ${this.t(s)}`).join(" · ");
    const rows = groups.map(g => `<div title="${this.esc(detail(g))}"><span><i class="dot ${g.tone}"></i>${this.t(g.label)}</span><span class="nums"><b>${this.formatNumber(g.n)}</b><em class="pct">${percent(g.n)}</em></span></div>`).join("");
    const bar = groups.filter(g => g.n).map(g => `<i class="${g.tone}" style="width:${(100 * g.n / Math.max(1, known)).toFixed(2)}%"></i>`).join("");
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("inventoryStatus")}</h2><p>${this.t("invHint")}</p></div></div><div class="legend invlegend">${rows}</div><div class="bar">${bar}</div></div>`;
  }

  // Size of the recorder database from two file stats taken during the scan; the table queries stay in the Recorder view.
  databaseCard() {
    const d = this.data.meta.database;
    if (!d) return "";
    const measured = d.db_bytes !== null && d.db_bytes !== undefined;
    const rows = measured ? [
      [this.t("dbOvSize"), this.formatBytes(d.db_bytes)],
      [this.t("dbOvWal"), this.formatBytes(d.wal_bytes || 0)],
      ...(d.keep_days ? [[this.t("dbOvKeep"), this.t("dbOvKeepDays", { n: this.formatNumber(d.keep_days) })]] : []),
      [this.t("dbOvGrowth"), d.per_day !== null && d.per_day !== undefined ? this.t("dbOvPerDay", { size: this.formatBytes(Math.max(0, d.per_day)) }) : this.t("dbOvObserving")],
    ] : [[this.t("dbOvSize"), this.t("dbOvNoSize", { dialect: this.esc(d.dialect || "?") })]];
    const purgeOff = d.auto_purge === false ? `<p class="factnote">${this.t("dbOvPurgeOff")}</p>` : "";
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("dbOvTitle")}</h2><p>${this.t("dbOvHint")}</p></div><button class="link" data-jump="recorder">${this.t("dbOvDetails")} <ha-icon icon="mdi:chevron-right"></ha-icon></button></div><div class="facts">${rows.map(([k, v]) => `<div class="fact"><span>${k}</span><b>${v}</b></div>`).join("")}</div>${purgeOff}</div>`;
  }

  // Quick links to the hint views; counts exclude hidden findings.
  cleanupCard() {
    const open = this.data.findings.filter(f => !f.ignored);
    const items = [
      ["batteries", "mdi:battery-alert-variant-outline", "batteries", this.lowBatteries().length, "batteries"],
      ["possible_duplicate", "mdi:content-duplicate", "findingsNav", open.filter(f => f.classification === "possible_duplicate").length, "possible_duplicate"],
      ["unused", "mdi:sleep", "findingsNav", open.filter(f => f.classification === "unused").length, "unused"],
      ["unreferenced", "mdi:link-variant-off", "cleanup", this.unreferencedRows().length, undefined],
      ["quarantine", "mdi:archive-clock-outline", "cleanup", (this.data.quarantine || []).length, undefined],
    ];
    const rows = items.map(([label, icon, view, count, filter]) => `<button class="row" data-jump="${view}"${label === "unreferenced" ? ' data-jump-tab="unused"' : ""}${filter !== undefined && view === "findingsNav" ? ` data-filter="${filter}"` : ""}><span class="tile ${count ? "warn" : "mute"}"><ha-icon icon="${icon}"></ha-icon></span><span class="row-text"><strong>${this.t(label)}</strong></span><span class="pill ${count ? "warn" : "mute"}">${this.formatNumber(count)}</span></button>`).join("");
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("hintsTitle")}</h2><p>${this.t("cleanupHint")}</p></div></div>${rows}</div>`;
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
    return this.data.findings.filter(f => includeIgnored || !f.ignored).sort((a, b) => (this.impactScore(b) - this.impactScore(a))
      || plain.compare(String(a.object_id), String(b.object_id)));
  }

  // Impact first, then how sure the diagnosis is: the fraction keeps the certainty from outranking a level.
  impactScore(f) { return (IMPACT_RANK[f.impact] ?? 0) + (f.confidence || 0) / 2; }

  // The level and the facts behind it, as text: "High impact (critical · used by 3 automations)".
  impactLine(f, withFacts = true) {
    if (!f.impact) return "";
    const facts = withFacts ? (f.impact_facts || []).map(x => this.t(`impactFact_${x.fact}`, { n: x.n ?? "", id: x.id ?? "", why: this.t(`impactWhy_${x.why}`) })) : [];
    return `${this.t(`impact_${f.impact}`)}${facts.length ? ` (${facts.join(" · ")})` : ""}`;
  }

  // The share of objects without a finding. It counts affected objects, not findings, so an object
  // with several findings is subtracted once; only the base types count, hidden findings do not.
  health() {
    const objects = this.data.objects.filter(o => HEALTH_TYPES.includes(o.object_type));
    const base = objects.length;
    const known = new Set(objects.map(o => this.objectKey(o)));
    const affected = new Set(this.data.findings.filter(f => !f.ignored).map(f => this.findingKey(f)).filter(key => known.has(key)));
    // Rounded down, so a few affected objects among thousands never read as 100.
    const share = base ? Math.max(0, Math.floor(100 * (1 - affected.size / base))) : 100;
    // The status is the worse of two readings: the share of objects without a finding, and what the to-do list still asks for
    // (broken integrations, a missed goal, a problem with the backup or the database).
    const open = this.todoItems(), red = open.filter(i => i.tone === "red").length, tasks = open.length;
    const byShare = share >= 95 ? "ok" : share >= 80 ? "warn" : "red";
    // The number takes the open tasks off the share: 4 points for each, 10 for an urgent one.
    const percent = Math.max(0, share - open.reduce((sum, item) => sum + (item.tone === "red" ? 10 : 4), 0));
    const tone = red || byShare === "red" ? "red" : tasks || byShare === "warn" ? "warn" : "ok";
    const label = tone === "ok" ? "healthGood" : tone === "warn" ? "healthCheck" : "healthBad";
    return { percent, share, tone, label, affected: affected.size, base, tasks, red };
  }

  findingRow(finding) {
    const key = this.findingKey(finding), object = this.findObject(key);
    const title = object?.name || finding.object_id;
    const subtitle = finding.rule_id === "entity.possible_duplicate"
      ? `${this.t("duplicateOf")} ${this.esc(finding.affected_object)}`
      : finding.affected_object
        ? `${this.esc(finding.affected_object)} · ${this.esc(finding.evidence?.[0]?.location || "")}`
        : this.esc(object?.reason ? this.t(object.reason) : this.findingTitle(finding));
    const button = `<button class="row ${finding.ignored ? "dim" : ""}" data-object="${this.esc(key)}">${this.tile(object?.object_type || "entity", this.tone(finding.classification))}<span class="row-text"><strong>${this.esc(title)}</strong><small>${subtitle}${finding.ignored ? ` · ${this.esc(finding.mark ? this.markLine(finding.mark) : this.decisionLabel(finding))}` : ""}${finding.resurfaced ? ` · ${this.t("dueLabel")}` : ""}${this.statusTags(finding)}${finding.impact && finding.impact !== "none" ? ` · ${this.t(`impact_${finding.impact}`)}` : ""}${finding.first_detected_at ? `<span class="msince"> · ${this.t("sortSince")} ${this.formatDate(finding.first_detected_at)}</span>` : ""}</small></span>${this.pill(finding.classification)}<span class="date">${finding.first_detected_at ? this.formatDate(finding.first_detected_at) : ""}</span></button>`;
    return `<div class="rowwrap"><input type="checkbox" class="selbox" data-fsel="${this.esc(finding.key)}" ${this.findSel.has(finding.key) ? "checked" : ""} aria-label="${this.esc(title)}">${button}</div>`;
  }

  findingSorts() {
    return [
      { key: "impact", label: "sortImpact", dir: "desc", get: f => this.impactScore(f) },
      { key: "certainty", label: "sortCertainty", dir: "desc", get: f => f.confidence },
      { key: "name", label: "sortName", dir: "asc", get: f => this.findObject(this.findingKey(f))?.name || f.object_id },
      { key: "id", label: "sortId", dir: "asc", get: f => f.object_id },
      { key: "since", label: "sortSince", dir: "desc", get: f => f.first_detected_at },
      { key: "rule", label: "sortRule", dir: "asc", get: f => f.rule_id },
    ];
  }

  // The findings as shown (classification chip, search, type filter, sort); the export uses the same list.
  visibleFindings() {
    const all = this.sortedFindings(true).filter(f => this.statusMatch(f));
    const classed = this.findingFilter ? all.filter(f => f.classification === this.findingFilter) : all;
    const afterOnly = this.findingAfter ? classed.filter(f => this.corr?.by_key?.[f.key]) : classed;
    const byClass = this.findingDue ? afterOnly.filter(f => f.resurfaced) : afterOnly;
    this.lvState("findings", "impact", "desc");
    return this.refine("findings", byClass, {
      text: f => [this.findObject(this.findingKey(f))?.name, f.object_id, f.rule_id, f.affected_object].join(" "),
      filters: { type: (f, v) => this.findingType(f) === v, impact: (f, v) => (f.impact || "none") === v },
      sorts: this.findingSorts(), tie: f => f.object_id,
    });
  }

  exportRows() {
    const shown = this.visibleFindings();
    const list = this.findSel.size ? shown.filter(f => this.findSel.has(f.key)) : shown;
    return list.map(f => {
      const key = this.findingKey(f), object = this.findObject(key);
      return {
        rule_id: f.rule_id, classification: f.classification, confidence: f.confidence, impact: f.impact || "", cause: f.cause_id || "",
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
    const all = this.sortedFindings(true).filter(f => this.statusMatch(f));
    const classes = [...new Set(all.map(f => f.classification))];
    const list = this.collapseFollowers(this.visibleFindings());
    const types = [...new Set(all.map(f => this.findingType(f)))].sort();
    const bar = this.listBar("findings", { sorts: this.findingSorts(), filters: [{ name: "type", all: this.t("allTypes"), options: types.map(x => [x, this.t(x)]) }, { name: "impact", all: this.t("allImpacts"), options: ["high", "medium", "low", "none"].map(x => [x, this.t(`impact_${x}`)]) }] });
    const pg = this.paginate("findings", list);
    const h = this.health();
    const classTone = c => { const tone = this.tone(c); return tone === "red" ? "red" : tone === "warn" ? "warn" : "mute"; };
    this.ensureCorrelations();
    const afterCount = all.filter(f => this.corr?.by_key?.[f.key]).length;
    const tiles = this.sumTiles([
      { label: this.t("health"), value: `${h.percent} %`, sub: this.t("findSumAffected", { n: this.formatNumber(h.affected), m: this.formatNumber(h.base) }), tone: h.tone },
      { label: this.t("all"), value: this.formatNumber(all.length), tone: all.length ? "warn" : "ok", filter: "", active: !this.findingFilter },
      afterCount ? { label: this.t("corrTile"), value: this.formatNumber(afterCount), sub: this.t("corrTileSub"), tone: "warn", attr: ["data-finding-after", "1"], active: this.findingAfter } : null,
      ...classes.map(c => ({ label: this.t(c), value: this.formatNumber(all.filter(f => f.classification === c).length), tone: classTone(c), filter: c, active: this.findingFilter === c })),
    ]);
    const dueCount = this.data.findings.filter(f => f.resurfaced).length;
    const followers = this.followerCount();
    return `<div class="stack">${tiles}${this.causesCard()}${this.fixedCard()}<div class="panel"><div class="chips">${followers ? `<button class="chip ${this.showFollowers ? "active" : ""}" data-toggle-followers>${this.t(this.showFollowers ? "causeHide" : "causeShow")} (${followers})</button>` : ""}${dueCount ? `<button class="chip ${this.findingDue ? "active" : ""}" data-finding-due>${this.t("dueFilter")} (${dueCount})</button>` : ""}${this.statusChips()}<span class="spacer"></span><button class="chip" data-export="csv" title="${this.t("exportTitle")}">${this.t("exportCsv")}</button><button class="chip" data-export="json" title="${this.t("exportTitle")}">${this.t("exportJson")}</button></div>
      ${this.findSelBar(pg.rows)}${bar}${list.length ? pg.rows.map(f => this.findingRow(f)).join("") : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t(all.length ? "noMatches" : "noFindings")}</div>`}${pg.footer}</div></div>`;
  }

  // The selection of findings: hide several at once, or export just those. Kept across pages until cleared.
  findSelBar(pageRows) {
    const n = this.findSel.size;
    this._findPage = pageRows.map(f => f.key);
    if (!pageRows.length && !n) return "";
    return `<div class="toolbar"><span class="date">${this.t("selectedCount", { count: n })}</span><button class="btn quiet" data-fsel-page>${this.t("selectPage")}</button><button class="btn quiet" data-fsel-clear ${n ? "" : "disabled"}>${this.t("clearSelection")}</button><span class="toolgap"></span><div class="fbtns"><button class="btn" data-fsel-state="known" ${n ? "" : "disabled"}>${this.t("fselKnown")}</button><button class="btn" data-fsel-state="snoozed" ${n ? "" : "disabled"}>${this.t("fselSnooze")}</button><button class="btn" data-fsel-state="label" ${n ? "" : "disabled"}>${this.t("fselLabel")}</button><button class="btn" data-fsel-hide ${n ? "" : "disabled"}>${this.t("findHideSelected")}</button></div></div>${this.bulkForm()}`;
  }

  async hideSelectedFindings() {
    const keys = [...this.findSel].filter(key => this.data.findings.some(f => f.key === key && !f.ignored));
    try {
      for (const key of keys) {
        await this._hass.callWS({ type: "ha_housekeeper/ignore", finding_key: key, ignored: true });
        const finding = this.data.findings.find(f => f.key === key);
        if (finding) { finding.ignored = true; finding.ignored_by = "user"; }
      }
      this._rev++;
    } catch (err) { this.error = err?.message || String(err); }
    this.findSel.clear();
    this.render();
  }

  findingTitle(f) {
    const sub = f.rule_id.split(".")[1] || f.rule_id;
    if (sub.startsWith("missing_")) return `${this.t(sub)}: ${f.affected_object}`;
    if (f.rule_id === "entity.possible_duplicate") return `${this.t("duplicateOf")} ${f.affected_object}`;
    const text = this.t(f.rule_id);
    return text === f.rule_id ? this.t(sub) : text;
  }

  // What was decided about a hidden finding, as one line: kind, until when, why.
  decisionLabel(f) {
    const info = f.ignore_info;
    if (!info) return this.t("ignoredLabel");
    const until = info.until ? ` · ${this.t("decideUntil", { date: this.formatDate(info.until) })}` : "";
    return `${this.t(`decideKind_${info.kind}`)}${until}${info.reason ? ` · ${info.reason}` : ""}`;
  }

  // The small form that asks what to do with a finding: hide it, keep it on purpose, or look again later.
  decideForm(f) {
    const d = this.decide, snooze = d.kind === "snooze";
    const kinds = ["ignore", "keep", "snooze"].map(k => `<option value="${k}" ${d.kind === k ? "selected" : ""}>${this.t(`decideKind_${k}`)}</option>`).join("");
    const days = [...(snooze ? [] : [0]), 7, 30, 90, 365].map(n => `<option value="${n}" ${Number(d.days) === n ? "selected" : ""}>${n ? this.t("decideDays", { n }) : this.t("decideForever")}</option>`).join("");
    return `<form class="polform" data-decide-form="${this.esc(f.key)}"><select data-decide-kind aria-label="${this.esc(this.t("decideKind"))}">${kinds}</select>
      <input data-decide-reason maxlength="200" autocomplete="off" value="${this.esc(d.reason)}" aria-label="${this.esc(this.t("decideReason"))}" placeholder="${this.esc(this.t(d.kind === "keep" ? "decideReasonNeeded" : "decideReason"))}">
      <select data-decide-days aria-label="${this.esc(this.t("decideHow"))}">${days}</select>
      <button type="submit" class="btn primary">${this.t("saveOptions")}</button><button type="button" class="btn quiet" data-decide-cancel>${this.t("cancelRun")}</button>
      ${d.error ? `<small class="error" role="alert">${this.esc(this.t(d.error))}</small>` : ""}</form>`;
  }

  openDecide(key, kind = "ignore") { this.decide = { key, kind, days: kind === "snooze" ? 30 : 0, reason: "", error: "" }; this.render(); this.shadowRoot?.querySelector?.("[data-decide-kind]")?.focus?.(); }

  async commitDecide() {
    const d = this.decide;
    if (!d) return;
    if (d.kind === "keep" && !d.reason.trim()) { d.error = "decideNeedReason"; this.render(); return; }
    if (d.kind === "snooze" && !Number(d.days)) d.days = 30;
    try {
      const msg = { type: "ha_housekeeper/ignore", finding_key: d.key, ignored: true, kind: d.kind, reason: d.reason.trim() };
      if (Number(d.days)) msg.days = Number(d.days);
      await this._hass.callWS(msg);
      if (d.key.startsWith("policy.")) { this.decide = null; await this.loadPolicies(); return; }  // a policy violation is no finding
      const finding = this.data.findings.find(f => f.key === d.key);
      if (finding) {
        const until = msg.days ? new Date(Date.now() + msg.days * 864e5).toISOString() : null;
        finding.ignored = true; finding.ignored_by = "user"; finding.resurfaced = false;
        finding.ignore_info = { kind: d.kind, reason: msg.reason, until, at: new Date().toISOString() };
        this._rev++;
      }
      this.decide = null;
    } catch (err) { this.error = err?.message || String(err); this.decide = null; }
    this.render();
  }

  // The findings of one object with what can be decided about each; the detail page shows them in the card of actions.
  findingRows(key) {
    const list = this.data.findings.filter(f => this.findingKey(f) === key);
    if (!list.length) return "";
    const hideButton = f => this.decide && this.decide.key === f.key ? this.decideForm(f)
      : `<div class="fbtns">${f.rule_id === "entity.possible_duplicate" ? `<button class="btn" data-notdup="${this.esc(f.key)}"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("notDuplicate")}</button><button class="btn" data-object="entity:${this.esc(f.affected_object)}"><ha-icon icon="mdi:open-in-new"></ha-icon>${this.t("openTwin")}</button>` : ""}<button class="btn" data-decide-open="${this.esc(f.key)}" data-decide-preset="keep"><ha-icon icon="mdi:bookmark-check-outline"></ha-icon>${this.t("markKnown")}</button><button class="btn" data-decide-open="${this.esc(f.key)}" data-decide-preset="snooze"><ha-icon icon="mdi:clock-outline"></ha-icon>${this.t("fselSnooze")}</button><button class="btn" data-decide-open="${this.esc(f.key)}"><ha-icon icon="mdi:eye-off-outline"></ha-icon>${this.t("hideFinding")}</button></div>`;
    const rows = list.map(f => `<div class="finding"><div><strong>${this.esc(this.findingTitle(f))}</strong><small class="fmeta">${this.pill(f.classification)}<span class="nw">${this.t("certainty")}: ${Math.round(f.confidence * 100)} %</span>${f.ignored ? ` · ${this.esc(f.mark ? this.markLine(f.mark) : this.decisionLabel(f))}` : ""}${f.resurfaced ? ` · ${this.t("dueLabel")}` : ""}</small>${f.impact ? `<small>${this.esc(this.impactLine(f))}</small>` : ""}${this.corrLine(f.key) ? `<small>${this.corrLine(f.key)}</small>` : ""}${f.ignored_by === "label" ? `<small>${this.t("ignoredByLabel")}</small>` : ""}</div>${f.ignored_by === "label" || f.ignored_by === "mark" ? "" : f.ignored ? `<button class="btn" data-ignore="${this.esc(f.key)}" data-ignore-value="0"><ha-icon icon="mdi:eye-outline"></ha-icon>${this.t("showFinding")}</button>` : hideButton(f)}</div>`).join("");
    return rows;
  }
}

// Texts for the findings that began together with an update or restart; merged into TEXT.
Object.assign(TEXT.de, {
  corrAfter: "Zeitlich zusammen mit: {what} ({when})", corrTile: "Nach Update neu", corrTileSub: "begannen zusammen mit einem Update", corrTitle: "Zeitlich zusammen mit Updates und Neustarts",
  corrHint: "Befunde, die zur selben Zeit begannen wie ein Update, ein Neustart oder ein Bereinigungsplan. Das ist ein zeitlicher Zusammenhang, keine Ursache.",
  corr_ha_version: "Home-Assistant-Update {from} → {to}", corr_entry_version: "Update von {domain} {from} → {to}", corr_start: "Neustart von Home Assistant", corr_plan: "Bereinigungsplan ausgeführt", corr_purge: "Statistiken gelöscht", corrCount: "{n} Befunde",
});
Object.assign(TEXT.en, {
  corrAfter: "At about the same time as: {what} ({when})", corrTile: "New after update", corrTileSub: "began together with an update", corrTitle: "At about the same time as updates and restarts",
  corrHint: "Findings that began at the same time as an update, a restart or a cleanup plan. This is a link in time, not a cause.",
  corr_ha_version: "Home Assistant update {from} → {to}", corr_entry_version: "Update of {domain} {from} → {to}", corr_start: "Home Assistant restart", corr_plan: "Cleanup plan run", corr_purge: "Statistics deleted", corrCount: "{n} findings",
});

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

  // The report of the changes as Markdown, for the baseline closest to a week back (loaded first when another is set).
  async weeklyReport() {
    const week = Date.now() - 7 * 864e5;
    const list = (this.compare?.baselines || []).filter(b => b.at);
    const best = list.length ? list.reduce((a, b) => (Math.abs(Date.parse(b.at) - week) < Math.abs(Date.parse(a.at) - week) ? b : a)) : null;
    if (best && best.id !== this.compareBaseline) { this.compareBaseline = best.id; await this.loadCompare(); }
    const c = this.compare;
    if (!c?.available) return;
    const name = o => `${o.name || o.object_id} (${o.object_id})`;
    const list20 = (title, part, line) => (part.total ? [`## ${title} (${part.total})`, ...part.items.slice(0, 20).map(line), part.total > 20 ? `- … ${this.t("moreItems", { count: part.total - 20 })}` : "", ""] : []);
    const h = this.health();
    const lines = [
      `# ${this.t("weeklyTitle")}`, "",
      `${this.t("comparedWith")} ${this.formatDate(c.baseline_at)} → ${this.formatDate(this.data.meta.scanned_at)}`, "",
      `- ${this.t("health")}: ${h.percent} %`,
      ...[["statusChanges", c.status_changes], ["newFindings", c.new_findings], ["resolvedFindings", c.resolved_findings], ["newObjects", c.new_objects], ["removedObjects", c.removed_objects]].map(([label, part]) => `- ${this.t(label)}: ${part.total}`), "",
      ...list20(this.t("newFindings"), c.new_findings, f => `- ${this.findingTitle(f)}: ${name({ name: this.findObject(this.findingKey(f))?.name, object_id: f.object_id })}`),
      ...list20(this.t("resolvedFindings"), c.resolved_findings, f => `- ${this.findingTitle(f)}: ${f.object_id}`),
      ...list20(this.t("newObjects"), c.new_objects, o => `- ${this.t(o.object_type)}: ${name(o)}`),
      ...list20(this.t("removedObjects"), c.removed_objects, o => `- ${this.t(o.object_type)}: ${name(o)}`),
      ...list20(this.t("statusChanges"), c.status_changes, o => `- ${name(o)}: ${this.t(o.from)} → ${this.t(o.to)}`),
    ];
    const loud = this.storms?.available && !this.storms.busy ? (this.storms.entities || []).slice(0, 5) : [];
    if (loud.length) lines.push(`## ${this.t("weeklyRecorder")}`, ...loud.map(e => `- ${e.entity_id}: ${this.t("polRate", { n: this.formatNumber(e.per_day) })}`), "");
    this.downloadText("report.md", lines.filter(l => l !== undefined).join("\n"), "text/markdown");
  }

  changeRank(status) { return { active: 0, disabled: 1, empty: 1, unknown: 2, problem: 3, orphaned: 3, unavailable: 3 }[status] ?? 1; }

  changesView() {
    const c = this.compare;
    if (!c) return `${this.skeleton("loading")}`;
    this.ensureCorrelations();
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
    const cards = this.sumTiles(sections.map(([label, , part]) => ({ label: this.t(label), value: this.formatNumber(part.total), tone: !part.total ? "mute" : label === "resolvedFindings" ? "ok" : label === "newFindings" ? "warn" : "mute" })));
    const more = part => part.total > part.items.length ? `<p class="factnote">${this.t("moreItems", { count: part.total - part.items.length })}</p>` : "";
    const st = this.lvState("changes", "", "asc"), query = st.q.trim().toLowerCase();
    const typeOf = it => it.object_type || String(it.rule_id || "").split(".")[0];
    const matches = it => (!query || [it.name, it.object_id, it.rule_id, it.affected_object, typeOf(it)].join(" ").toLowerCase().includes(query)) && (!st.f.type || typeOf(it) === st.f.type);
    const allTypes = [...new Set(sections.flatMap(([, , part]) => part.items.map(typeOf)).filter(Boolean))].sort();
    const bar = total ? this.listBar("changes", { sorts: [], filters: [{ name: "type", all: this.t("allTypes"), options: allTypes.map(x => [x, this.t(x)]) }] }) : "";
    const paged = (id, items, render) => {
      const shown = items.filter(matches);
      if (items.length && !shown.length) return `<div class="emptymsg">${this.t("changesFiltered", { n: items.length })}</div>`;
      const pg = this.paginate(`changes-${id}`, shown);
      return pg.rows.map(render).join("") + pg.footer;
    };
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
        return objectRow({ object_type: type, object_id: f.object_id }, `${f.affected_object ? `${f.affected_object} · ` : ""}${this.findingTitle(f)}`, `<span class="pill ok">${this.t("improved")}</span>`);
      }),
      newObjects: paged("newObjects", c.new_objects.items, o => objectRow(o, `${this.t(o.object_type)} · ${o.object_id}`, this.pill(o.status))),
      removedObjects: paged("removedObjects", c.removed_objects.items, o => objectRow(o, `${this.t(o.object_type)} · ${this.t("gone")}`, "")),
    };
    const panels = sections.filter(([, , part]) => part.total).map(([label, , part]) => `<section class="panel" style="margin-bottom:14px"><div class="panelhead"><h2>${this.t(label)}</h2><span class="date">${this.formatNumber(part.total)}</span></div>${body[label]}${more(part)}</section>`).join("");
    return `${picker}<p class="sub" style="margin:0 0 14px">${this.t("comparedWith")} <b>${this.formatDate(c.baseline_at)}</b> <button class="btn quiet" data-weekly title="${this.esc(this.t("weeklyHint"))}">${this.t("weeklyBtn")}</button></p>${cards}${this.corrGroupsCard()}${total ? `<div class="panel" style="margin-bottom:14px">${bar}</div>${panels}` : `<div class="panel"><div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("noChanges")}</div></div>`}`;
  }
}

// Texts for the device history and the list of removed devices; merged into TEXT.
Object.assign(TEXT.de, {
  lifeTab: "Verlauf", lifeHint: "Was sich aus der Geräte-Registry, dem Journal und der Zuverlässigkeit über dieses Gerät sagen lässt.", lifeNow: "Jetzt", lifeNone: "Noch keine Schritte bekannt.",
  life_discovered: "Entdeckt", life_quarantine: "In Quarantäne", life_disabled: "Durch einen Plan deaktiviert", life_removed: "Durch einen Plan entfernt", life_replaced: "Ersetzung: {from} → {to}", lifeForgotten: "Durch einen Plan vergessen",
  lifeNote: "Notiz (zum Beispiel Grund der Stilllegung, höchstens 200 Zeichen)", lifeNotePlaceholder: "Nur für dich, bleibt in Housekeeper", lifeNoteSave: "Notiz speichern",
  lifeRemovedTab: "Entfernte Geräte", lifeRemovedTitle: "Entfernte Geräte", lifeRemovedHint: "Geräte, die ein Plan von Housekeeper entfernt oder vergessen hat, nach dem Journal.", lifeRemovedNone: "Housekeeper hat noch kein Gerät entfernt.",
});
Object.assign(TEXT.en, {
  lifeTab: "History", lifeHint: "What the device registry, the journal and the reliability say about this device.", lifeNow: "Now", lifeNone: "No steps known yet.",
  life_discovered: "Discovered", life_quarantine: "In quarantine", life_disabled: "Disabled by a plan", life_removed: "Removed by a plan", life_replaced: "Replacement: {from} → {to}", lifeForgotten: "Forgotten by a plan",
  lifeNote: "Note (for example why it was retired, 200 characters at most)", lifeNotePlaceholder: "Only for you, stays in Housekeeper", lifeNoteSave: "Save note",
  lifeRemovedTab: "Removed devices", lifeRemovedTitle: "Removed devices", lifeRemovedHint: "Devices that a Housekeeper plan removed or forgot, from the journal.", lifeRemovedNone: "Housekeeper has not removed a device yet.",
});

// Texts for the maintenance window; merged into TEXT.
Object.assign(TEXT.de, {
  winTab: "Wartungsfenster", winTitle: "Wartungsfenster", winExperimental: "experimentell", winHint: "Führt dich der Reihe nach durch Prüfung, einen Bereinigungsplan, das Neuladen, den Neustart und den Vergleich. Nichts läuft von allein, Housekeeper startet Home Assistant nie neu.",
  winWarning: "Das Wartungsfenster verkettet Schritte, die es einzeln schon gibt. Es wurde mit simulierten Schritten getestet, aber noch nicht in einer echten Instanz ausprobiert. Es ist deshalb ausgeschaltet.", winEnable: "Experimentell einschalten", winDisable: "Wieder ausschalten",
  winChoose: "Wähle einen Plan, der noch nicht gelaufen ist. Das Fenster begleitet dich durch Prüfung, Ausführung und Vergleich.", winNoPlans: "Es gibt keinen offenen Plan. Lege ihn unter Aufräumen an.", winBegin: "Fenster mit diesem Plan beginnen",
  win_preflight: "1. Vorab prüfen", win_baseline: "2. Ausgangsstand speichern", win_plan: "3. Plan ausführen", win_reload: "4. Integrationen neu laden", win_restart: "5. Neustart (von dir)", win_compare: "6. Vergleichen", win_report: "7. Bericht",
  winPreflightHint: "Prüft Backup, Reparaturen, fehlerhafte Integrationen und defekte Referenzen.", winCheck: "Prüfen", winNext: "Weiter",
  winBaselineHint: "Merkt sich den jetzigen Zustand als Vergleichsbasis.", winSave: "Ausgangsstand speichern",
  winPlanHint: "Öffne den Plan, bestätige ihn und führe ihn aus; der Plan legt vorher selbst ein Backup an. Komm danach hierher zurück.", winOpenPlan: "Plan öffnen", winPlanDone: "Der Plan ist gelaufen, weiter",
  winReloadHint: "Lädt nur die Integrationen neu, deren Objekte der Plan geändert hat.", winShowTargets: "Betroffene anzeigen", winReload: "Jetzt neu laden", winSkip: "Überspringen", winNoTargets: "Der Plan hat keine Integration berührt, die neu geladen werden müsste.",
  winRestartHint: "Starte Home Assistant bei Bedarf selbst neu. Housekeeper tut das nie. Danach erkennt das Fenster den Neustart im Ereignisprotokoll.", winRestartSeen: "Neustart prüfen",
  winCompareHint: "Scannt neu und zeigt, was sich seit dem gespeicherten Ausgangsstand geändert hat.", winCompare: "Vergleichen",
  winReportHint: "Der Bericht fasst die Schritte, den Plan und den Vergleich zusammen.", winDownload: "Bericht herunterladen (Markdown)", winClose: "Fenster schließen", winAbort: "Fenster abbrechen",
  winAfterPlan: "Der Plan ist gelaufen. Zurückgehen geht nur noch über das Journal unter Aufräumen.", winStarted: "Begonnen", winSteps: "Schritte", winPlan: "Plan", winAfter: "Seit dem Ausgangsstand",
});
Object.assign(TEXT.en, {
  winTab: "Maintenance window", winTitle: "Maintenance window", winExperimental: "experimental", winHint: "Guides you through the check, a cleanup plan, the reload, the restart and the comparison, one after the other. Nothing runs on its own, Housekeeper never restarts Home Assistant.",
  winWarning: "The maintenance window chains steps that already exist on their own. It was tested with simulated steps but not yet tried in a real instance, so it is switched off.", winEnable: "Switch on (experimental)", winDisable: "Switch off again",
  winChoose: "Pick a plan that has not run yet. The window guides you through the check, the run and the comparison.", winNoPlans: "There is no open plan. Create one under Cleanup.", winBegin: "Begin the window with this plan",
  win_preflight: "1. Check first", win_baseline: "2. Save the starting state", win_plan: "3. Run the plan", win_reload: "4. Reload integrations", win_restart: "5. Restart (by you)", win_compare: "6. Compare", win_report: "7. Report",
  winPreflightHint: "Checks backup, repairs, failing integrations and broken references.", winCheck: "Check", winNext: "Next",
  winBaselineHint: "Remembers the current state as the base for the comparison.", winSave: "Save the starting state",
  winPlanHint: "Open the plan, confirm it and run it; the plan makes a backup first on its own. Then come back here.", winOpenPlan: "Open the plan", winPlanDone: "The plan has run, next",
  winReloadHint: "Reloads only the integrations whose objects the plan changed.", winShowTargets: "Show affected", winReload: "Reload now", winSkip: "Skip", winNoTargets: "The plan touched no integration that would need a reload.",
  winRestartHint: "Restart Home Assistant yourself if needed. Housekeeper never does. After that the window notices the restart in the event log.", winRestartSeen: "Check for the restart",
  winCompareHint: "Scans again and shows what changed since the saved starting state.", winCompare: "Compare",
  winReportHint: "The report sums up the steps, the plan and the comparison.", winDownload: "Download the report (Markdown)", winClose: "Close the window", winAbort: "Abort the window",
  winAfterPlan: "The plan has run. Going back is only possible through the journal under Cleanup.", winStarted: "Started", winSteps: "Steps", winPlan: "Plan", winAfter: "Since the starting state",
});

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

  // The tab ids of the settings page, in display order.
  // Each group has a tile with its state; the tile opens only that group's settings.
  settingsTabs() {
    const hidden = (this.data?.findings || []).filter(f => f.ignored).length;
    const m = this.data?.meta || {}, missed = (this.goals?.goals || []).filter(g => g.state === "missed").length;
    return [
      ["look", "mdi:palette-outline", "setTabLook", "setHintLook", ""],
      ["protection", "mdi:shield-lock-outline", "setTabProtection", "setHintProtection", this.t(`safeMode_${m.protection || "full"}`), (m.protection || "full") === "full" ? "ok" : "warn"],
      ["scan", "mdi:radar", "setTabScan", "setHintScan", m.scan_interval_hours ? this.t("setEveryHours", { n: m.scan_interval_hours }) : this.t("setManual"), "mute"],
      ["notify", "mdi:bell-outline", "setTabNotify", "setHintNotify", this.t(m.notify ? "setOn" : "setOff"), m.notify ? "ok" : "mute"],
      ["goals", "mdi:target", "setTabGoals", "setHintGoals", missed ? this.t("tilesMissed", { count: missed }) : "", "red"],
      ["hidden", "mdi:eye-off-outline", "setTabHidden", "setHintHidden", hidden ? this.formatNumber(hidden) : "", "mute"],
      ["info", "mdi:information-outline", "setTabInfo", "setHintInfo", ""],
    ];
  }

  // One line with what runs and how fresh the data is, plus the one button for support questions.
  settingsBand() {
    const m = this.data?.meta || {};
    const bit = (label, value) => `<span class="bandbit"><small>${label}</small><b>${value}</b></span>`;
    return `<div class="panel setband">${bit("Housekeeper", this.esc(m.version || "–"))}${bit("Home Assistant", this.esc(m.ha_version || "–"))}${bit(this.t("objects"), this.formatNumber(m.object_count ?? 0))}
      <span class="grow"></span><button class="btn" data-copy-info><ha-icon icon="mdi:content-copy"></ha-icon>${this.t(this.copied ? "copied" : "copyInfo")}</button></div>`;
  }

  // Scheme and mode as tiles: the scheme tile shows its own colors in the mode that is on screen.
  lookCard() {
    const p = this.prefs, dark = this.isDark();
    const tile = (pref, value, label, inner) => `<button class="tilebtn" data-pref="${pref}|${value}" aria-pressed="${String(p[pref]) === String(value)}">${inner}<span>${label}</span></button>`;
    const mini = scheme => {
      const c = SCHEMES[scheme][dark ? "dark" : "light"], bar = (w, col) => `<i style="width:${w}%;background:${col}"></i>`;
      return `<span class="schemeprev" aria-hidden="true" style="background:${c.bg};border-color:${c.border}"><span class="sp-card" style="background:${c.surface};border-color:${c.border}"><b style="background:${c.accent}"></b>${bar(60, c.text)}${bar(35, c.muted)}</span><span class="sp-row"><em style="background:${c.positive}"></em><em style="background:${c.warning}"></em><em style="background:${c.danger}"></em><u style="background:${c.accent}"></u></span></span>`;
    };
    const schemes = [["standard", "schemeStandard"], ["housekeeper", "schemeHousekeeper"], ["modern", "schemeModern"]].map(([id, key]) => tile("scheme", id, this.t(key), mini(id))).join("");
    const modes = [["auto", "modeAuto", "mdi:theme-light-dark"], ["light", "modeLight", "mdi:white-balance-sunny"], ["dark", "modeDark", "mdi:weather-night"]].map(([id, key, icon]) => tile("mode", id, this.t(key), `<ha-icon icon="${icon}"></ha-icon>`)).join("");
    const row = (label, hint, control) => `<div class="setrow"><div>${label}${hint ? `<small>${hint}</small>` : ""}</div>${control}</div>`;
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("setLanguage")}</h2><p>${this.t("setLanguageHint")}</p></div></div>
      ${row(this.t("setLanguage"), "", this.segment("language", [["auto", this.t("langAuto")], ["de", "Deutsch"], ["en", "English"]]))}
      <div class="panelhead"><h2>${this.t("colorScheme")}</h2></div><div class="tiles schemetiles">${schemes}</div>
      <div class="panelhead"><div><h2>${this.t("colorMode")}</h2><p>${this.t("modeHint")}</p></div></div><div class="tiles">${modes}</div>
      <div class="panelhead"><h2>${this.t("setReadability")}</h2></div>
      ${row(this.t("fontSize"), "", this.segment("size", [["small", this.t("fontSmall")], ["normal", this.t("fontNormal")], ["large", this.t("fontLarge")]]))}
      ${row(this.t("density"), "", this.segment("density", [["normal", this.t("densityNormal")], ["compact", this.t("densityCompact")]]))}
      ${row(this.t("motion"), this.t("motionHint"), this.segment("motion", [["auto", this.t("motionAuto")], ["reduced", this.t("motionReduced")]]))}</section>`;
  }

  behaviorCard() {
    const p = this.prefs;
    const row = (label, control) => `<div class="setrow"><div>${label}</div>${control}</div>`;
    const select = (key, options) => `<select data-pref-select="${key}" aria-label="${this.esc(this.t(key === "startView" ? "startView" : "pageSizeSetting"))}">${options.map(([v, l]) => `<option value="${v}" ${String(p[key]) === String(v) ? "selected" : ""}>${l}</option>`).join("")}</select>`;
    return `<section class="panel"><div class="panelhead"><h2>${this.t("behavior")}</h2></div>
      ${row(this.t("startView"), select("startView", START_VIEWS.map(v => [v, this.t(v)])))}
      ${row(this.t("pageSizeSetting"), select("pageSize", [20, 50, 100].map(n => [n, n])))}
      <div class="setrow quietreset"><small>${this.t("prefsNote")}</small><button class="btn quiet" data-pref-reset>${this.t("resetPrefs")}</button></div></section>`;
  }

  // The five thresholds as cards with their unit and default; saving stays off until a value differs.
  scanCard() {
    const m = this.data?.meta || {};
    if (!this.data) return `${this.skeleton("loading")}`;
    const cards = OPTION_FIELDS.map(([key, title, hint, unit, standard]) => {
      const [min, max] = OPTION_LIMITS[key];
      return `<div class="optcard"><label for="opt-${key}"><strong>${this.t(title)}</strong></label><small>${this.t(hint)}</small>
        <div class="unitrow"><input id="opt-${key}" type="number" data-opt="${key}" data-saved="${this.esc(m[key] ?? "")}" min="${min}" max="${max}" step="1" value="${this.esc(m[key] ?? "")}"><span>${this.t(unit)}</span></div>
        <small>${this.t("optDefault", { n: standard, unit: this.t(unit) })} · ${min}–${max}</small></div>`;
    }).join("");
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("scanSettings")}</h2><p>${this.t("scanSettingsHint")}</p></div></div><div class="optgrid">${cards}</div>
      <div class="toolbar savebar"><span class="date" role="status">${this.esc(this.optionsMessage || "")}</span><span class="toolgap"></span><button class="btn quiet" data-ha-path="/config/integrations/integration/ha_housekeeper"><ha-icon icon="mdi:cog-outline"></ha-icon>${this.t("openOptions")}</button><button class="btn primary" data-opts-save disabled>${this.t("saveOptions")}</button></div></section>`;
  }

  hiddenCard() {
    const hidden = (this.data?.findings || []).filter(f => f.ignored);
    const pg = this.paginate("hidden", hidden);
    const hiddenRow = f => {
      const object = this.findObject(this.findingKey(f));
      const action = f.ignored_by === "label" || f.ignored_by === "mark" ? `<span class="pill mute">${this.t(f.ignored_by === "mark" ? "mark_" + f.mark.kind : "ignoredByLabel")}</span>` : `<button class="btn" data-ignore="${this.esc(f.key)}" data-ignore-value="0">${this.t("showFinding")}</button>`;
      return `<div class="row"><span class="tile mute"><ha-icon icon="mdi:eye-off-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(object?.name || f.object_id)}</strong><small>${this.esc(f.object_id)} · ${this.esc(this.findingTitle(f))}${f.ignore_info ? ` · ${this.esc(this.decisionLabel(f))}` : ""}${f.mark ? ` · ${this.esc(this.markLine(f.mark))}` : ""}</small></span>${action}</div>`;
    };
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("hiddenFindings")} (${hidden.length})</h2><p>${this.t("hiddenHint")}</p></div></div>${hidden.length ? pg.rows.map(hiddenRow).join("") : `<div class="emptymsg"><ha-icon icon="mdi:eye-check-outline"></ha-icon>${this.t("hiddenNone")}</div>`}${pg.footer}</section>`;
  }

  // Numbers only, no names, ids or attributes: safe to attach to an issue on GitHub.
  diagnosticsData() {
    const m = this.data?.meta || {}, count = (list, pick) => list.reduce((acc, x) => { const k = pick(x); acc[k] = (acc[k] || 0) + 1; return acc; }, {});
    const { storage, database } = m;
    return {
      housekeeper: m.version, home_assistant: m.ha_version, scanned_at: m.scanned_at, preliminary: Boolean(m.preliminary),
      scan_interval_hours: m.scan_interval_hours, history_days: m.history_days, recorder_available: m.recorder_available,
      object_count: m.object_count, type_counts: m.type_counts, status_counts: m.status_counts, edge_count: (this.data?.edges || []).length,
      findings_by_rule: count(this.data?.findings || [], f => f.rule_id), findings_by_classification: count(this.data?.findings || [], f => f.classification),
      policies_on: this.policies ? this.policies.rules.filter(r => r.enabled).map(r => r.id) : null,
      storage: storage || null, database: database || null,
      panel: { language: this.lang, size: this.prefs?.size, mode: this.prefs?.mode, scheme: this.prefs?.scheme, page_size: this.pageSize },
    };
  }

  infoCard() {
    const m = this.data?.meta || {};
    const fact = (k, v) => `<div class="fact"><span>${k}</span><b>${v}</b></div>`;
    const facts = [fact(this.t("version"), this.esc(m.version || "–")), fact(this.t("haVersion"), this.esc(m.ha_version || "–")), fact(this.t("mode"), this.t("readOnlyValue")),
      fact(this.t("lastScan"), m.scanned_at ? this.formatDate(m.scanned_at) : "–"), fact(this.t("objects"), this.formatNumber(m.object_count ?? 0))].join("");
    const link = (icon, href, label, hint) => `<a class="row" href="${href}" target="_blank" rel="noopener noreferrer"><span class="tile mute"><ha-icon icon="${icon}"></ha-icon></span><span class="row-text"><strong>${label}</strong>${hint ? `<small>${hint}</small>` : ""}</span><ha-icon icon="mdi:open-in-new"></ha-icon></a>`;
    const kept = [["setKeptObservations", "setKeptObservationsText", "observations"], ["setKeptHistory", "setKeptHistoryText", "history"], ["setKeptJournal", "setKeptJournalText", "journal"], ["setKeptEvents", "setKeptEventsText", "events"], ["setKeptRuns", "setKeptRunsText", "runs"]]
      .map(([title, text, store]) => `<div class="row"><span class="tile mute"><ha-icon icon="mdi:database-outline"></ha-icon></span><span class="row-text"><strong>${this.t(title)}</strong><small>${this.t(text, { days: m.history_days ?? 30 })}</small></span>${m.storage?.[store] !== undefined ? `<span class="pill mute">${this.formatBytes(m.storage[store])}</span>` : ""}</div>`).join("");
    return `<div class="stack"><section class="panel"><div class="panelhead"><h2>${this.t("about")}</h2></div><div class="facts">${facts}</div></section>
      <section class="panel"><div class="panelhead"><div><h2>${this.t("setKeptTitle")}</h2><p>${this.t("setKeptHint")}</p></div></div>${kept}<p class="factnote">${this.t("setPrivacy")}</p></section>
      <section class="panel"><div class="panelhead"><h2>${this.t("setLinks")}</h2></div>${link("mdi:github", REPO_URL, this.t("repository"), "")}${link("mdi:bug-outline", `${REPO_URL}/issues`, this.t("reportIssue"), "")}${link("mdi:history", `${REPO_URL}/blob/main/CHANGELOG.md`, this.t("changelog"), "")}
        <button class="row" data-diagnostics><span class="tile mute"><ha-icon icon="mdi:stethoscope"></ha-icon></span><span class="row-text"><strong>${this.t("diagDownload")}</strong><small>${this.t("diagHint")}</small></span><ha-icon icon="mdi:download"></ha-icon></button></section></div>`;
  }

  // The one thing Housekeeper does on its own: tell about a new broken reference. Off until switched on.
  notifyCard() {
    const on = Boolean(this.data?.meta?.notify);
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("notifyTitle")}</h2><p>${this.t("notifyHint")}</p></div></div><div class="row"><span class="tile ${on ? "ok" : "mute"}"><ha-icon icon="mdi:bell-outline"></ha-icon></span><span class="row-text"><strong>${this.t("notifyLabel")}</strong><small>${this.t("notifyDetail")}</small></span><input class="policyswitch" type="checkbox" role="switch" aria-label="${this.esc(this.t("notifyLabel"))}" data-notify ${on ? "checked" : ""}></div></section>`;
  }

  settingsView() {
    const tabs = this.settingsTabs();
    const tab = tabs.some(([id]) => id === this.settingsTab) ? this.settingsTab : "look";
    const tiles = tabs.map(([id, icon, label, hint, pill, tone]) => `<button class="taskcard t-${pill ? tone || "mute" : "ac"}${id === tab ? " on" : ""}" id="hk-set-${id}" aria-pressed="${id === tab}" aria-controls="hk-setpanel" data-set-tab="${id}"><ha-icon icon="${icon}"></ha-icon><strong>${this.t(label)}</strong><span class="setpill">${pill ? `<span class="pill ${tone || "mute"}">${this.esc(pill)}</span>` : ""}</span><small>${this.t(hint)}</small></button>`).join("");
    const body = { look: () => `<div class="grid2">${this.lookCard()}${this.behaviorCard()}</div>`, protection: () => this.protectionCard(), scan: () => `${this.scanCard()}${this.eventsCard()}`, notify: () => this.notifyCard(), goals: () => this.goalsCard(), hidden: () => this.hiddenCard(), info: () => this.infoCard() }[tab]();
    return `${this.settingsBand()}<div class="taskgrid compactgrid setgrid" role="group" aria-label="${this.esc(this.t("settings"))}">${tiles}</div><div id="hk-setpanel">${body}</div>`;
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

  // The tiles of the Cleanup view: one job each, with the number of things to do; the chosen one is marked.
  cleanupTiles(tabs, open) {
    return this.navTiles("cleanup", tabs.map(t => ({ ...t, tone: t.count ? t.tone : "mute" })), open, this.t("cleanup"));
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

  cleanupCandidates(kind = this.cleanupKind) {
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
    if (executable.some(a => a.kind === "purge_statistics")) return this.t("purgeWord");
    if (executable.some(a => REMOVAL_KINDS.includes(a.kind))) return this.t("confirmWordRemove");
    if (executable.some(a => a.kind === "migrate_meter")) return this.t("confirmWordMeter");
    if (executable.some(a => REPAIR_KINDS.includes(a.kind))) return this.t("confirmWordRepair");
    if (executable.some(a => a.kind === "replace_references" || a.kind === "refactor_automation")) return this.t("confirmWordReplace");
    return this.t("confirmWord");
  }

  confirmSummary(plan, count) {
    const executable = plan.actions.filter(a => a.executable);
    const devices = executable.some(a => DEVICE_KINDS.includes(a.kind));
    const key = executable.some(a => a.kind === "purge_statistics") ? "confirmedSummaryPurge" : executable.some(a => REMOVAL_KINDS.includes(a.kind)) ? (devices ? "confirmedSummaryDeviceRemove" : "confirmedSummaryRemove")
      : executable.some(a => a.kind === "migrate_meter") ? "confirmedSummaryMeter"
      : executable.some(a => REPAIR_KINDS.includes(a.kind)) ? "confirmedSummaryRepair"
      : executable.some(a => a.kind === "add_label") ? "confirmedSummaryLabel"
      : executable.some(a => a.kind === "replace_references") ? "confirmedSummaryReplace" : executable.some(a => a.kind === "refactor_automation") ? "confirmedSummaryRefactor" : devices ? "confirmedSummaryDeviceDisable" : "confirmedSummary";
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

  // Recorder purges are no plans and cannot be undone; the journal only notes them.
  purgeJournalCard() {
    const purges = this.purges || [];
    if (!purges.length) return "";
    const me = this._hass?.user?.id;
    const rows = purges.slice(0, 20).map(p => {
      const what = this.t("purgeEntry", { removed: this.formatNumber(p.removed.length), skipped: this.formatNumber(p.skipped.length) });
      const who = p.by && p.by === me ? this.t("purgeByYou") : p.by ? this.t("purgeByOther") : "";
      const parts = [this.formatDate(p.at), what, p.states ? this.t("purgeWithStates") : "", p.backup ? this.t("purgeBackup", { job: p.backup.job_id || "—" }) : this.t("purgeNoBackup"), who, p.error ? this.t("purgeError", { error: p.error }) : ""];
      return `<div class="row"><span class="tile ${p.error ? "warn" : "mute"}"><ha-icon icon="mdi:database-remove-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(p.removed.slice(0, 3).join(", ") + (p.removed.length > 3 ? ` +${p.removed.length - 3}` : "") || this.t("purgeNothing"))}</strong><small>${parts.filter(Boolean).map(x => this.esc(x)).join(" · ")}</small></span></div>`;
    }).join("");
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("purgeJournal")} (${purges.length})</h2><p>${this.t("purgeJournalHint")}</p></div></div>${rows}</div>`;
  }

  async loadJournal() {
    try {
      const reply = await this._hass.callWS({ type: "ha_housekeeper/plan_list" });
      this.journal = reply.plans || []; this.purges = reply.purges || [];
    } catch (_) { this.journal = []; }
    this.render();
  }

  // The journal list holds short entries only; the plan itself is fetched when it is opened.
  async openPlan(planId) {
    try { this.plan = await this._hass.callWS({ type: "ha_housekeeper/plan_detail", plan_id: planId }); this.cleanupError = ""; } catch (err) { this.cleanupError = this.errText(err); }
    this.render();
  }

  // Removing an entity can also delete its recorder data; the default keeps it, and the choice holds for the whole plan.
  recorderChoice(removal) {
    if (!removal || !this.data?.meta?.recorder_available) return "";
    const value = this.cleanupRecorder || "keep";
    return `<label class="recchoice"><span>${this.t("recChoiceLabel")}</span><select data-recorder-choice aria-label="${this.esc(this.t("recChoiceLabel"))}">${["keep", "statistics", "states"].map(k => `<option value="${k}" ${value === k ? "selected" : ""}>${this.t(`recChoice_${k}`)}</option>`).join("")}</select></label>${value !== "keep" ? `<small class="recwarn">${this.t("recChoiceWarn")}</small>` : ""}`;
  }

  async createPlan() {
    if (this.cleanupKind === "exchange_device") return this.createExchangePlan();
    const pair = this.cleanupKind === "replace_references" ? [this.replOld, this.replNew] : this.cleanupKind === "migrate_meter" ? [this.meterOld, this.meterNew] : this.cleanupKind === "repair_counter" ? [this.counterSel, "-"] : null;
    if (pair ? !(pair[0] && pair[1]) : !this.cleanupSel.size) return;
    this.cleanupBusy = true; this.cleanupError = ""; this.render();
    try {
      const actions = this.cleanupKind === "replace_references" ? [{ kind: "replace_references", object_id: this.replOld, target: this.replNew }]
        : this.cleanupKind === "migrate_meter" ? [{ kind: "migrate_meter", object_id: this.meterOld, target: this.meterNew, mode: this.meterMode }]
        : this.cleanupKind === "repair_counter" ? [this.counterRangeReq ? { kind: "repair_range", object_id: this.counterSel, mode: this.counterRangeReq.mode, range: this.counterRangeReq.range } : { kind: "repair_counter", object_id: this.counterSel, mode: this.counterMode || "hold" }]
        : [...this.cleanupSel].map(object_id => ({ kind: this.cleanupKind, object_id, ...(REMOVAL_KINDS.includes(this.cleanupKind) && this.cleanupRecorder && this.cleanupRecorder !== "keep" ? { recorder: this.cleanupRecorder } : {}) }));
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
    this.undoAsk = null;
    try {
      const res = await this._hass.callWS({ type: "ha_housekeeper/plan_undo", plan_id: this.plan.plan_id, ...(objectIds ? { object_ids: objectIds } : {}) });
      const kindOf = id => this.plan?.actions.find(a => a.object_id === id)?.kind;
      this.undoMessage = res.results.map(r => `${r.object_id}: ${this.t(r.outcome === "undone" && REMOVAL_KINDS.includes(kindOf(r.object_id)) ? "undo_restored" : r.outcome === "undone" && kindOf(r.object_id) === "add_label" ? "undo_unlabelled" : `undo_${r.outcome}`)}`).join(" · ");
      const status = await this._hass.callWS({ type: "ha_housekeeper/plan_status", plan_id: this.plan.plan_id });
      this.adoptPlan(status.plan);
      if (this.data) this.load(false);
    } catch (err) { this.cleanupError = this.errText(err); }
    this.render();
  }

  // Open previews can be merged into one plan: the backend rebuilds it from the requests and reports conflicts.
  mergeable(plan) { return !plan.executed && !plan.run; }

  async mergePlans() {
    const ids = [...(this.mergeSel || [])].filter(id => (this.journal || []).some(p => p.plan_id === id && this.mergeable(p)));
    if (ids.length < 2 || this.cleanupBusy) return;
    this.cleanupBusy = true; this.cleanupError = ""; this.mergeNote = ""; this.render();
    try {
      const result = await this._hass.callWS({ type: "ha_housekeeper/plan_merge", plan_ids: ids });
      this.plan = result.plan; this.confirmation = null; this.ack = new Set(); this.confirmWord = ""; this.mergeSel = new Set();
      this.journal = [result.plan, ...(this.journal || []).filter(p => !result.merged.includes(p.plan_id))];
      this.mergeNote = result.conflicts.length ? this.t("mergeConflicts", { count: result.conflicts.length, list: result.conflicts.slice(0, 5).map(c => `${c.object_id} (${c.kinds.join(" / ")})`).join(", ") }) : this.t("mergeDone", { count: result.merged.length });
    } catch (err) { this.cleanupError = this.errText(err); }
    this.cleanupBusy = false; this.render();
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
    else if (backupFailure) steps.push({ id: "stepBackup", state: "failed", note: [this.t(`abort_${backupFailure}`), ...(plan.events || []).filter(e => e.error).slice(-2).map(e => e.error)].join(" · ") });
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
    const backupOnly = action.kind === "migrate_meter" || action.kind === "purge_statistics";
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
      const resultPill = result ? `<span class="pill ${result.state === "done" ? "ok" : result.state === "undone" ? "mute" : "warn"}">${this.t(result.state === "done" && REMOVAL_KINDS.includes(a.kind) ? "result_removed" : result.state === "done" && a.kind === "replace_references" ? "result_replaced" : result.state === "done" && a.kind === "refactor_automation" ? "result_refactored" : result.state === "done" && a.kind === "migrate_meter" ? "result_migrated" : result.state === "done" && REPAIR_KINDS.includes(a.kind) ? "result_repaired" : result.state === "done" && a.kind === "add_label" ? "result_labeled" : result.state === "done" && a.kind === "purge_statistics" ? "result_purged" : `result_${result.state}`)}</span>` : "";
      const sub0 = a.kind === "add_label" ? `${a.object_id} + ${a.label_name || a.target || "?"}` : a.kind === "replace_references" || a.kind === "migrate_meter" ? `${a.object_id} → ${a.target || "?"}` : type === "device" ? `${this.t("deviceEntities", { count: (a.entities || []).length })}` : a.object_id;
      const sub = sub0 + (a.recorder ? ` · ${this.t(`recChoice_${a.recorder}`)}` : "");
      const sources = a.kind === "replace_references" ? this.sourceList(a) : a.kind === "refactor_automation" ? this.refactorDiff(a) : a.kind === "migrate_meter" ? this.meterDetail(a) : REPAIR_KINDS.includes(a.kind) ? this.counterDetail(a) : "";
      const abort = result?.state === "not_run" ? ` · ${this.t(`abort_${result.reason}`)}` : "" + (result?.purge?.state === "failed" ? ` · ${this.t("result_purge_failed")}` : "");
      const ack = open && a.verdict === "review" && a.executable ? `<label class="factnote" style="padding:8px 0 0;display:flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox" data-ack="${this.esc(a.object_id)}" ${this.ack.has(a.object_id) ? "checked" : ""}>${this.t("acknowledgeReview")}</label>` : "";
      const undo = result?.state !== "done" ? "" : this.undoAsk === a.object_id
        ? `<span class="askrow"><span>${this.t("undoAskOne")}</span><button class="btn danger" data-undo-one-yes="${this.esc(a.object_id)}">${this.t("undoYes")}</button><button class="btn accent" data-undo-no>${this.t("cancelRun")}</button></span>`
        : `<button class="btn accent" data-undo-one="${this.esc(a.object_id)}"><ha-icon icon="mdi:undo-variant"></ha-icon>${this.t("undoOne")}</button>`;
      return `<div class="row planrow ${a.verdict === "blocked" ? "dim" : ""}"><span class="tile ${tone}"><ha-icon icon="${a.verdict === "ok" ? "mdi:check" : a.verdict === "review" ? "mdi:alert-outline" : "mdi:close-octagon-outline"}"></ha-icon></span>
        <span class="row-text"><strong>${obj ? `<button class="link" data-object="${this.esc(`${type}:${a.object_id}`)}">${this.esc(a.name)}</button>` : this.esc(a.name)}</strong><small>${this.esc(sub)}${reasons ? ` · ${this.esc(reasons)}` : ""}${this.esc(abort)}</small>${ack}${sources || uses ? `<details class="rowdetails"><summary>${this.t("planDetails")}</summary>${sources}${uses ? `<span class="chips" style="padding:6px 0 0;border:0">${uses}${more}</span>` : ""}</details>` : ""}</span>
        <span style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end">${resultPill}${undo}${a.executable ? this.undoBadge(a) : ""}<span class="pill ${tone}">${this.t(`verdict_${a.verdict}`)}</span></span></div>`;
    }).join("");
    const extra = [sm.uses ? this.t("planUses", { count: sm.uses }) : "", sm.statistics ? this.t("planStats", { count: sm.statistics }) : ""].filter(Boolean).join(" · ");
    const executable = plan.actions.some(a => a.executable);
    const word = this.planWord(plan), conf = this.confirmation?.plan_id === plan.plan_id ? this.confirmation : null;
    let control = "";
    if (open && !executable) control = `<p class="factnote">${this.t("nothingExecutable")}</p>`;
    else if (open && !conf) control = `<div class="setrow planfoot"><small style="margin:0">${this.t("cleanupDryRun")}</small><button class="btn primary" data-plan-confirm>${this.t("confirmPlan")}</button></div>`;
    else if (open && conf) control = `<div class="setrow planfoot"><div><strong>${this.t("confirmPlanTitle")}</strong><small>${this.confirmSummary(plan, conf.execute.length)}</small>${conf.needs_acknowledgement.length ? `<small>${this.t("skippedUnacknowledged", { count: conf.needs_acknowledgement.length })}</small>` : ""}</div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><label class="factnote" style="margin:0">${this.t("confirmTypeWord", { word })}</label><input type="text" data-confirm-word value="${this.esc(this.confirmWord)}" style="max-width:180px" autocomplete="off"><button class="btn primary" data-plan-execute ${this.confirmWord.trim().toUpperCase() === word ? "" : "disabled"}>${this.t("runNow")}</button></div></div>`;
    else if (plan.status === "running" || plan.status === "backup") control = `<div class="setrow planfoot"><small style="margin:0">${plan.status === "backup" || this.planProgress?.phase === "backup" ? this.t("backupRunning") : `${this.t("running")} ${this.planProgress ? this.t("progressOf", { done: this.planProgress.done, total: this.planProgress.total }) : ""}`}</small><button class="btn" data-plan-cancel>${this.t("cancelRun")}</button></div>`;
    else if (plan.actions.some(a => a.result?.state === "done")) control = this.undoAsk === "all"
      ? `<div class="setrow planfoot askbox"><div><strong>${this.t("undoAskAll")}</strong><small>${this.t("undoAskAllHint")}</small></div><span class="askrow"><button class="btn danger" data-undo-all-yes><ha-icon icon="mdi:undo-variant"></ha-icon>${this.t("undoYes")}</button><button class="btn accent" data-undo-no>${this.t("cancelRun")}</button></span></div>`
      : `<div class="setrow planfoot"><small style="margin:0">${this.esc(this.undoMessage || this.t("undoAllHint"))}</small><button class="btn accent" data-undo-all><ha-icon icon="mdi:undo-variant"></ha-icon>${this.t("undoAll")}</button></div>`;
    const checks = plan.verification ? `<div class="checkrow"><b>${this.t("verification")}</b>${plan.verification.checks.map(c => `<span class="pill ${c.ok ? "ok" : "red"}">${c.ok ? "✓" : "✗"} ${this.t(`check_${c.check}`)}${c.object_id ? ` (${this.esc(c.object_id)})` : ""}</span>`).join("")}</div>` : "";
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t(plan.status === "dry_run" ? "planResult" : "planResultDone")} · <span class="pill ${plan.status === "verified" ? "ok" : plan.status === "dry_run" ? "mute" : "warn"}">${this.t(`plan_status_${plan.status}`)}</span></h2><p>${this.esc(this.formatDate(plan.created_at))}</p></div><button class="btn" data-plan-close>${this.t("planClose")}</button></div>
      ${this.planStepper(plan, Boolean(conf))}<p class="factnote">${this.t("planSummary", { total: sm.total ?? 0, ok: sm.ok ?? 0, review: sm.review ?? 0, blocked: sm.blocked ?? 0 })}${extra ? ` ${this.esc(extra)}` : ""}</p>${this.simulationBlock(plan)}${rows}${checks}${this.followupLine(plan)}${control}${this.reportBlock(plan)}</section>`;
  }

  kindSelect() {
    if (this.view !== "cleanup" || (this._cleanupKinds || CLEANUP_KINDS).length < 2) return "";
    const labels = { disable_entity: "kindDisable", remove_entity: "kindRemove", disable_device: "kindDisableDevice", remove_device: "kindRemoveDevice", forget_device: "kindForgetDevice" };
    return `<select data-cleanup-kind aria-label="${this.t("actionKind")}">${(this._cleanupKinds || CLEANUP_KINDS).map(value => `<option value="${value}" ${this.cleanupKind === value ? "selected" : ""}>${this.t(labels[value])}</option>`).join("")}</select>`;
  }


  // Replace one entity by another in every configuration that names it exactly.
  entityUnit(id) { return this.findObject(`entity:${id}`)?.unit; }

  // Candidates for the new entity, shown as buttons below the field. They only fill the field; the person decides.
  successorHints(id, unit, attr) {
    if (!id) return "";
    const found = this.successorsOf(id, unit);
    if (!found.length) return "";
    return `<div class="setrow planfoot"><small style="margin:0">${this.t("successorHint")}</small><span class="chips">${found.map(o => `<button class="chip" ${attr}="${this.esc(o.object_id)}" title="${this.esc(o.name)}">${this.esc(o.object_id)}</button>`).join("")}</span></div>`;
  }

  replaceCard() {
    const usage = new Set([...this.edgeIndex().used].filter(target => target.startsWith("entity:")).map(target => target.slice(7)));
    const entities = new Map(this.data.objects.filter(o => o.object_type === "entity").map(o => [o.object_id, o]));
    const label = id => `${entities.get(id)?.name || id}`;
    const oldOptions = [...usage].sort().map(id => `<option value="${this.esc(id)}">${this.esc(label(id))}</option>`).join("");
    const domain = (this.replOld || "").split(".")[0];
    const newOptions = [...entities.values()].filter(o => o.status === "active" && (!domain || o.object_id.startsWith(`${domain}.`)) && o.object_id !== this.replOld).sort((a, b) => a.object_id.localeCompare(b.object_id)).slice(0, 2000)
      .map(o => `<option value="${this.esc(o.object_id)}">${this.esc(o.name)}</option>`).join("");
    const ready = this.replOld && this.replNew && !this.cleanupBusy;
    const hints = this.successorHints(this.replOld, this.entityUnit(this.replOld), "data-repl-pick");
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("replaceTitle")}</h2><p>${this.t("replaceHint")}</p></div><div class="actions">${this.kindSelect()}</div></div>
      <div class="setrow"><div><label>${this.t("replaceOld")}</label></div><input type="text" list="hk-repl-old" data-repl-old value="${this.esc(this.replOld || "")}" placeholder="sensor.old_entity" autocomplete="off" style="max-width:360px"><datalist id="hk-repl-old">${oldOptions}</datalist></div>
      <div class="setrow"><div><label>${this.t("replaceNew")}</label></div><input type="text" list="hk-repl-new" data-repl-new value="${this.esc(this.replNew || "")}" placeholder="sensor.new_entity" autocomplete="off" style="max-width:360px"><datalist id="hk-repl-new">${newOptions}</datalist></div>
      ${hints}<div class="setrow planfoot"><small style="margin:0">${this.t("cleanupDryRun")}</small><button class="btn primary" data-plan-create ${ready ? "" : "disabled"}>${this.cleanupBusy ? this.t("planCreating") : this.t("replacePreview")}</button></div></div>`;
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
      ${this.successorHints(this.meterOld, byId.get(this.meterOld)?.unit, "data-meter-pick")}<div class="setrow planfoot"><small style="margin:0">${this.t("cleanupDryRun")}</small><button class="btn primary" data-plan-create ${ready ? "" : "disabled"}>${this.cleanupBusy ? this.t("planCreating") : this.t("replacePreview")}</button></div></div>`;
  }

  // Devices that an integration created again after they were forgotten.
  recurringCard() {
    const entries = this.data.recurring_devices || [];
    if (!entries.length) return "";
    const rows = entries.map(r => `<button class="row rel" data-object="${this.esc(`device:${r.device_id}`)}"><span class="tile warn"><ha-icon icon="mdi:backup-restore"></ha-icon></span><span class="row-text"><strong>${this.esc(r.name)}</strong><small>${this.t("recurringSince", { date: this.formatDate(r.forgotten_at), domains: this.esc((r.domains || []).join(", ")) })}</small></span></button>`).join("");
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("recurringTitle")} (${entries.length})</h2><p>${this.t("recurringHint")}</p></div></div>${rows}</div>`;
  }

  cleanupView() {
    this.ensureJournal();
    const purges = this.purges || [];
    const limit = this.data.meta.quarantine_days ?? 14;
    const held = this.data.quarantine || [], heldReady = held.filter(q => this.daysSince(q.since) >= limit).length;
    const unusedCount = this.unreferencedRows().length, statsCount = (this.data.orphaned_statistics || []).length;
    const count = kind => this.cleanupCandidates(kind).length;
    // The tiles are the navigation: each one is one job, with how much there is to do.
    const tabs = [
      { id: "entities", icon: "mdi:shape-outline", label: this.t("cleanupTabEntities"), hint: this.t("cleanupTileEntitiesHint"), count: count("disable_entity"), tone: "warn" },
      { id: "devices", icon: "mdi:devices", label: this.t("cleanupTabDevices"), hint: this.t("cleanupTileDevicesHint"), count: count("disable_device"), tone: "warn" },
      { id: "quarantine", icon: "mdi:archive-clock-outline", label: this.t("cleanupTabQuarantine"), hint: this.t("cleanupTileQuarantineHint", { days: limit }), count: held.length, pill: heldReady ? this.t("cleanupReadyCount", { count: heldReady }) : "", tone: heldReady ? "ok" : "mute" },
      { id: "unused", icon: "mdi:link-variant-off", label: this.t("unreferenced"), hint: this.t("cleanupTileUnusedHint"), count: unusedCount, tone: "mute" },
      { id: "stats", icon: "mdi:database-remove-outline", label: this.t("orphanStats"), hint: this.t("cleanupTileStatsHint"), count: statsCount, tone: "mute" },
      ...(purges.length ? [{ id: "purges", icon: "mdi:history", label: this.t("cleanupTabPurges"), hint: this.t("cleanupTilePurgesHint"), count: purges.length, tone: "mute" }] : []),
    ];
    const open = this.viewTabOf("cleanup", tabs, "entities");
    const tiles = this.cleanupTiles(tabs, open);
    if (["unused", "stats", "purges"].includes(open)) {
      this.unrefTab = open === "stats" ? "statistics" : "entities";
      this._embedUnref = true;
      const body = open === "purges" ? this.purgeJournalCard() : this.unreferencedView();
      this._embedUnref = false;
      return `<div class="stack">${this.planHeader()}${tiles}${body}</div>`;
    }
    const quarantineType = this.quarantineType === "device" ? "device" : "entity";
    this._cleanupKinds = open === "devices" ? ["disable_device"] : open === "quarantine" ? (quarantineType === "device" ? ["remove_device", "forget_device"] : ["remove_entity"]) : ["disable_entity"];
    if (!this._cleanupKinds.includes(this.cleanupKind)) this.cleanupKind = this._cleanupKinds[0];
    this.lvState("cleanup", "name", "asc");
    const all = this.cleanupCandidates();
    const sorts = [
      { key: "name", label: "sortName", dir: "asc", get: r => r.item.name },
      { key: "id", label: "sortId", dir: "asc", get: r => r.item.object_id },
      { key: "since", label: "sortSince", dir: "desc", get: r => (r.quarantine ? r.quarantine.since : r.finding?.first_detected_at) },
      { key: "certainty", label: "sortCertainty", dir: "desc", get: r => (r.finding ? r.finding.confidence : null) },
    ];
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
      <button class="row-text link" style="text-align:left" data-object="${this.esc(`${item.object_type}:${item.object_id}`)}"><strong>${this.esc(item.name)}</strong><small>${this.esc(sub)}</small></button>${badge}${quarantine ? this.releaseControl(quarantine) : ""}</div>`;
    };
    const n = this.cleanupSel.size;
    const candidates = `<div class="panel"><div class="panelhead"><div><h2>${this.t("cleanupCandidates")} (${all.length})</h2><p>${device ? this.t(removal ? "removalDeviceHint" : "deviceCandidatesHint", { days: limit }) : removal ? this.t("removalCandidatesHint", { days: limit }) : this.t("cleanupCandidatesHint")}</p></div></div>
      <div class="toolbar">${this.kindSelect()}${this.recorderChoice(removal)}<span class="toolgap"></span><span class="date" aria-live="polite">${this.t("selectedCount", { count: n })}</span><button class="btn quiet" data-sel-page>${this.t("selectPage")}</button><button class="btn quiet" data-sel-clear ${n ? "" : "disabled"}>${this.t("clearSelection")}</button>
      <button class="btn primary" data-plan-create ${n && !this.cleanupBusy ? "" : "disabled"}>${this.cleanupBusy ? this.t("planCreating") : this.t("createPlan")}</button></div>
      ${bar}${list.length ? pg.rows.map(row).join("") : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t(all.length ? "noMatches" : "cleanupNone")}</div>`}${pg.footer}</div>`;
    const typeSwitch = open === "quarantine" ? `<div class="seg qtype" role="group" aria-label="${this.esc(this.t("cleanupTabQuarantine"))}"><button class="chip ${quarantineType === "entity" ? "active" : ""}" data-qtype="entity">${this.t("qTypeEntities", { count: this.quarantineRows("entity").length })}</button><button class="chip ${quarantineType === "device" ? "active" : ""}" data-qtype="device">${this.t("qTypeDevices", { count: this.quarantineRows("device").length })}</button></div>` : "";
    const message = open === "quarantine" && this.releaseMessage ? `<p class="factnote" role="status">${this.esc(this.releaseMessage)}</p>` : "";
    return `<div class="stack">${this.planHeader()}${tiles}${typeSwitch}${open === "devices" ? this.recurringCard() : ""}${candidates}${message}</div>`;
  }

  ensureJournal() {
    if (this.journal === null && !this._journalRequested) { this._journalRequested = true; this.loadJournal(); }
  }

  // The dry-run note, an error from the last request and the plan that is open, on top of every view that can finish one.
  planHeader() {
    return `<div class="panel"><p class="factnote">${this.t("cleanupDryRun")}</p>${this.cleanupError ? `<div class="error">${this.t("planError")}: ${this.esc(this.cleanupError)}</div>` : ""}</div>${this.plan ? this.planCard(this.plan) : ""}`;
  }

  // Every plan from Cleanup and Repair: what changed, what was checked, and what can be undone.
  journalView() {
    this.ensureJournal();
    const journalFound = this.searchList("journal", this.journal || [], plan => `${this.formatDate(plan.created_at)} ${this.t(`plan_status_${plan.status || "dry_run"}`)}`);
    const journalPage = this.paginate("journal", journalFound.rows);
    const journal = journalPage.rows.map(plan => `<div class="row jrow">${this.mergeable(plan) ? `<input type="checkbox" data-merge-sel="${this.esc(plan.plan_id)}" ${this.mergeSel?.has(plan.plan_id) ? "checked" : ""} aria-label="${this.esc(this.t("mergeSelect"))}">` : ""}<span class="tile mute"><ha-icon icon="mdi:clipboard-text-clock-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(this.formatDate(plan.created_at))}</strong><small>${this.t("planSummary", { total: plan.summary?.total ?? 0, ok: plan.summary?.ok ?? 0, review: plan.summary?.review ?? 0, blocked: plan.summary?.blocked ?? 0 })}${plan.file_snapshot_dropped ? ` · ${this.esc(this.t("snapshotDropped"))}` : ""}</small></span>
      <span class="pill ${plan.status === "verified" ? "ok" : plan.status === "dry_run" ? "mute" : "warn"}">${this.t(`plan_status_${plan.status || "dry_run"}`)}</span>${plan.followup ? `<span class="pill ${this.followupTone(plan.followup?.state ?? plan.followup)}">${this.t(`fu_${plan.followup?.state ?? plan.followup}`)}</span>` : ""}
      <span class="jbtns"><button class="btn" data-plan-open="${this.esc(plan.plan_id)}">${this.t("openPlan")}</button>${plan.executed || plan.run ? "" : `<button class="btn" data-plan-delete="${this.esc(plan.plan_id)}">${this.t("deletePlan")}</button>`}</span></div>`).join("");
    const journalCard = `<div class="panel"><div class="panelhead"><div><h2>${this.t("journal")} (${(this.journal || []).length})</h2><p>${this.t("journalHint")}</p></div><div class="actions"><button class="btn" data-merge ${(this.mergeSel?.size || 0) >= 2 && !this.cleanupBusy ? "" : "disabled"}>${this.t("mergeButton", { count: this.mergeSel?.size || 0 })}</button></div></div>${this.mergeNote ? `<div class="pad"><small role="status">${this.esc(this.mergeNote)}</small></div>` : ""}${journalFound.bar}${journal || journalFound.none || `<div class="emptymsg mute"><ha-icon icon="mdi:clipboard-text-outline"></ha-icon><strong>${this.t("journalEmpty")}</strong>${this.t("journalEmptyNext")}<button class="btn" data-jump="repair">${this.t("repair")}</button></div>`}${journalPage.footer}</div>`;
    return `<div class="stack">${this.planHeader()}${journalCard}</div>`;
  }

  // Where the person is in an assistant: choose, set up, look at the preview.
  stepsBar(current) {
    const names = ["stepChoose", "stepSetup", "stepPreview"];
    return `<div class="stepsbar" role="list">${names.map((name, i) => `${i ? `<span class="line${i < current ? " done" : ""}"></span>` : ""}<span class="step${i + 1 === current ? " on" : i + 1 < current ? " done" : ""}" role="listitem"${i + 1 === current ? ' aria-current="step"' : ""}><i>${i + 1 < current ? "✓" : i + 1}</i>${this.t(name)}</span>`).join("")}</div>`;
  }

  // Tasks that fix something that stays. A tile opens the assistant for one task; the plan is finished in the same view.
  repairView() {
    this.ensureJournal();
    const task = REPAIR_TASKS.some(([kind]) => kind === this.repairTask) ? this.repairTask : null;
    let body;
    if (task) {
      const card = { exchange_device: () => this.exchangeCard(), replace_references: () => this.replaceCard(), migrate_meter: () => this.meterCard(), repair_counter: () => this.counterCard() }[task]();
      const label = REPAIR_TASKS.find(([kind]) => kind === task)[2];
      const chosen = { repair_counter: (this.counterId || "").trim(), migrate_meter: this.meterOld, replace_references: this.replOld, exchange_device: this.exchangeState().oldDev }[task];
      body = `<button class="btn quiet" data-repair-back><ha-icon icon="mdi:arrow-left"></ha-icon>${this.t("repairBack")}</button><h2 class="repairhead">${this.t(label)}</h2>${this.stepsBar(this.plan ? 3 : chosen ? 2 : 1)}${card}`;
    } else {
      const scan = this.counterScan, found = scan?.items?.length || 0;
      // Without a scan there is nothing to count: the tile says so instead of showing nothing (no scan runs by itself).
      const state = kind => kind !== "repair_counter" ? "" : !scan?.available ? ` <span class="pill mute">${this.t("repairNotChecked")}</span>` : found ? ` <span class="pill warn">${this.t("repairFound", { count: found })}</span>` : ` <span class="pill ok">${this.t("repairNoneFound")}</span>`;
      const tone = kind => (kind !== "repair_counter" ? "ac" : !scan?.available ? "mute" : found ? "warn" : "ok");
      const tiles = REPAIR_TASKS.map(([kind, icon, label, hint]) => `<button class="taskcard t-${tone(kind)}" data-repair-task="${kind}"><ha-icon icon="${icon}"></ha-icon><strong>${this.t(label)}${state(kind)}</strong><small>${this.t(hint)}</small></button>`).join("");
      body = `<div class="panel"><div class="panelhead"><div><h2>${this.t("repairTitle")}</h2><p>${this.t("repairHint")}</p></div></div><div class="taskgrid">${tiles}</div></div>`;
    }
    return `<div class="stack">${this.planHeader()}${body}</div>`;
  }
}

// Texts for the second set of policy rules; merged into TEXT.
Object.assign(TEXT.de, {
  polRule_entity_id_suffix: "Entitäts-ID mit angehängter Zahl", polDesc_entity_id_suffix: "IDs, die auf _2, _3 … enden, ohne dass der Name die Zahl trägt. Meist ein Rest von Doppelungen oder Umbenennungen.",
  polRule_default_name: "Standardname bei Automation oder Skript", polDesc_default_name: "Name wie „Neue Automation“ oder „Skript 3“. Ein sprechender Name spart später das Suchen.",
  polRule_script_description: "Skript ohne Beschreibung", polDesc_script_description: "Skripte brauchen eine Beschreibung.",
  polRule_script_label: "Skript ohne Label", polDesc_script_label: "Skripte sollen mindestens ein Label tragen. Geprüft werden nur Skripte mit Eintrag in der Entitäts-Registry.",
  polRule_device_model: "Gerät ohne Hersteller oder Modell", polDesc_device_model: "Aktive Geräte (keine Dienste, keine Untergeräte), die nicht beides nennen. Das trifft meist Helfer und ältere Integrationen.",
  polRule_area_empty: "Leerer Bereich", polDesc_area_empty: "Bereiche ohne Entität und ohne Gerät.",
  polRule_label_unused: "Label ohne Zuordnung", polDesc_label_unused: "Labels, die an keiner Entität, keinem Gerät und keinem Bereich hängen. Das Label housekeeper_ignore zählt nicht.",
  polRule_automation_error_handling: "Automation ohne Fehlerbehandlung (Hinweis)", polDesc_automation_error_handling: "Mindestens zwei Aktionen, keine Bedingung und weder continue_on_error noch Verzweigung. Eine Heuristik: Sie meldet nur, wo ein fehlschlagender Schritt die übrigen mitreißt.",
  polRule_automation_triggers: "Automation mit sehr vielen Auslösern", polDesc_automation_triggers: "Mehr als 10 Auslöser sind schwer zu pflegen. Oft helfen mehrere kleine Automationen.",
  polRule_automation_literal_ids: "Feste Entitäts-IDs in Templates (Hinweis)", polDesc_automation_literal_ids: "Templates, die eine Entität als Text nennen (zum Beispiel states('sensor.x')). Bei einer Umbenennung bricht das ohne Warnung. Eine Heuristik: Die Regel sieht nur Treffer in Anführungszeichen.",
  polRule_automation_self_trigger: "Automation löst sich selbst aus (Hinweis)", polDesc_automation_self_trigger: "Ein Zustandsauslöser auf eine Entität, die dieselbe Automation ändert. Das kann eine Schleife sein, ist aber manchmal gewollt.",
  polRule_turn_on_only: "Wird nur eingeschaltet (Hinweis)", polDesc_turn_on_only: "Schalter, Lichter, Ventilatoren und Helfer, die Automationen oder Skripte einschalten, ohne dass eine Konfiguration sie ausschaltet oder umschaltet. Ausschalten per Hand, Dashboard oder Sprache sieht die Regel nicht.",
  polRule_exposure_unused: "Freigabe ohne Verwendung", polDesc_exposure_unused: "Für Assistenten oder Bridges freigegebene Entitäten, auf die keine Automation, kein Skript, keine Szene und kein Dashboard verweist.",
  polRule_exposure_sensitive: "Sensible Entität freigegeben", polDesc_exposure_sensitive: "Schloss, Alarmanlage, Person, Standort-Tracker und Garagen-/Tor-Abdeckung für einen Assistenten oder eine Bridge freigegeben.",
  polRule_battery_no_automation: "Batterie niedrig ohne Automation", polDesc_battery_no_automation: "Batterien unter der eingestellten Schwelle, auf die keine Automation verweist. Niemand wird benachrichtigt.",
  polRule_recorder_unused: "Schreibt viel in den Recorder, wird nicht verwendet", polDesc_recorder_unused: "Entitäten mit mindestens 200 Änderungen pro Tag in den letzten Last-Zahlen, auf die nichts verweist. Kandidaten für den Recorder-Ausschluss. Die Regel startet keine Recorder-Abfrage.",
  polRule_recorder_retention: "Lange Aufbewahrung bei großer Datenbank", polDesc_recorder_retention: "Der Recorder behält mehr als 30 Tage und die Datenbank ist größer als 2 GB. Die Regel liest die zuletzt berechneten Datenbank-Zahlen.",
  polPendingLoad: "Noch nicht berechnet: Öffne Recorder → Last einmal, dann prüft die Regel diese Zahlen.", polPendingDb: "Noch nicht berechnet: Öffne Recorder → Datenbank einmal, dann prüft die Regel diese Zahlen.",
  polAlso_automation_literal_ids: "Feste IDs: {ids}", polAlso_automation_self_trigger: "Ändert den eigenen Auslöser: {ids}", polAlso_exposure_unused: "Freigegeben für: {ids}", polAlso_exposure_sensitive: "Freigegeben für: {ids}",
  polRetention: "Behält {days} Tage, Datenbank {size}", polTriggers: "{n} Auslöser",
});
Object.assign(TEXT.en, {
  polRule_entity_id_suffix: "Entity id with a trailing number", polDesc_entity_id_suffix: "Ids that end in _2, _3 … without the name carrying the number. Mostly a leftover of duplicates or renames.",
  polRule_default_name: "Default name on an automation or script", polDesc_default_name: "A name like “New automation” or “Script 3”. A telling name saves searching later.",
  polRule_script_description: "Script without a description", polDesc_script_description: "Scripts need a description.",
  polRule_script_label: "Script without a label", polDesc_script_label: "Scripts should carry at least one label. Only scripts with an entity registry entry are checked.",
  polRule_device_model: "Device without manufacturer or model", polDesc_device_model: "Active devices (no services, no sub-devices) that do not name both. Mostly helpers and older integrations.",
  polRule_area_empty: "Empty area", polDesc_area_empty: "Areas with no entity and no device.",
  polRule_label_unused: "Label without use", polDesc_label_unused: "Labels that no entity, device or area carries. The label housekeeper_ignore does not count.",
  polRule_automation_error_handling: "Automation without error handling (hint)", polDesc_automation_error_handling: "At least two actions, no condition, and neither continue_on_error nor a branch. A heuristic: it only shows where one failing step takes the others down.",
  polRule_automation_triggers: "Automation with very many triggers", polDesc_automation_triggers: "More than 10 triggers are hard to maintain. Several small automations often help.",
  polRule_automation_literal_ids: "Literal entity ids in templates (hint)", polDesc_automation_literal_ids: "Templates that name an entity as text (for example states('sensor.x')). A rename breaks them without a warning. A heuristic: the rule only sees hits in quotation marks.",
  polRule_automation_self_trigger: "Automation triggers itself (hint)", polDesc_automation_self_trigger: "A state trigger on an entity the same automation changes. That can be a loop, but sometimes it is intended.",
  polRule_turn_on_only: "Only ever turned on (hint)", polDesc_turn_on_only: "Switches, lights, fans and helpers that automations or scripts turn on while no configuration turns them off or toggles them. Turning off by hand, dashboard or voice is not seen.",
  polRule_exposure_unused: "Exposure without use", polDesc_exposure_unused: "Entities exposed to assistants or bridges that no automation, script, scene or dashboard refers to.",
  polRule_exposure_sensitive: "Sensitive entity exposed", polDesc_exposure_sensitive: "Lock, alarm panel, person, location tracker and garage/gate cover exposed to an assistant or a bridge.",
  polRule_battery_no_automation: "Low battery without an automation", polDesc_battery_no_automation: "Batteries below the set threshold that no automation refers to. Nobody gets notified.",
  polRule_recorder_unused: "Writes a lot to the recorder, unused", polDesc_recorder_unused: "Entities with at least 200 changes per day in the last load numbers that nothing refers to. Candidates for a recorder exclusion. The rule never starts a recorder query.",
  polRule_recorder_retention: "Long retention with a big database", polDesc_recorder_retention: "The recorder keeps more than 30 days and the database is bigger than 2 GB. The rule reads the last calculated database numbers.",
  polPendingLoad: "Not calculated yet: open Recorder → Load once, then the rule checks those numbers.", polPendingDb: "Not calculated yet: open Recorder → Database once, then the rule checks those numbers.",
  polAlso_automation_literal_ids: "Literal ids: {ids}", polAlso_automation_self_trigger: "Changes its own trigger: {ids}", polAlso_exposure_unused: "Exposed to: {ids}", polAlso_exposure_sensitive: "Exposed to: {ids}",
  polRetention: "Keeps {days} days, database {size}", polTriggers: "{n} triggers",
});

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
    const all = this.data.objects, count = pred => all.filter(pred).length;
    const typeTile = type => { const n = count(x => x.object_type === type); return n && { label: this.t(type), value: this.formatNumber(n), tone: "mute", inv: `${type}|`, active: this.typeFilter === type && !this.statusFilter }; };
    const statusTile = (status, tone) => { const n = count(x => x.status === status); return n && { label: this.statusLabel(status), value: this.formatNumber(n), tone, inv: `|${status}`, active: this.statusFilter === status && !this.typeFilter }; };
    const tiles = this.sumTiles([
      { label: this.t("all"), value: this.formatNumber(all.length), tone: "mute", inv: "|", active: !this.typeFilter && !this.statusFilter },
      typeTile("entity"), typeTile("device"), typeTile("automation"), typeTile("config_entry"),
      statusTile("unavailable", "red"), statusTile("orphaned", "warn"),
    ]);
    const hid = key => this.colHidden("inventory", key);
    this.setExporter("inventory", "inventory", [this.t("name"), "ID", this.t("type"), this.t("status"), this.t("reason"), this.t("since")], () => rows.map(i => [i.name, i.object_id, this.t(i.object_type), this.statusLabel(i.status), i.reason ? this.t(i.reason) : i.missing_reference_count ? `${i.missing_reference_count} ${this.t("missingReferences")}` : "", i.status_since || ""]));
    const tools = `<div class="listtools">${this.listTools("inventory", ["type", "status", "reason", "since"].map(k => ({ key: k, label: k })))}</div>`;
    return `<div class="stack">${tiles}<div class="panel"><div class="filters"><input id="query" type="search" value="${this.esc(this.query)}" placeholder="${this.t("search")}"><select id="typeFilter" aria-label="${this.t("type")}"><option value="">${this.t("all")}</option>${types.map(x => `<option value="${x}" ${this.typeFilter === x ? "selected" : ""}>${this.t(x)}</option>`).join("")}</select><select id="statusFilter" aria-label="${this.t("status")}"><option value="">${this.t("allStatus")}</option>${statuses.map(x => `<option value="${x}" ${this.statusFilter === x ? "selected" : ""}>${this.statusLabel(x)}</option>`).join("")}</select>
        <div class="mobsort"><select id="sortKey" aria-label="${this.t("sortBy")}">${[["name", "sortName"], ["type", "sortType"], ["status", "sortStatus"], ["since", "sortSince"]].map(([key, label]) => `<option value="${key}" ${this.sort === key ? "selected" : ""}>${this.t(label)}</option>`).join("")}</select><button class="btn" id="sortDir" aria-label="${this.t("sortBy")}">${this.sortDir === "desc" ? "▼" : "▲"}</button></div></div>${tools}
      <div class="tablewrap inv"><table><thead><tr>${this.th("name", "name")}${hid("type") ? "" : this.th("type", "type")}${hid("status") ? "" : this.th("status", "status")}${hid("reason") ? "" : `<th>${this.t("reason")}</th>`}${hid("since") ? "" : this.th("since", "since")}</tr></thead><tbody>${visibleRows.map(item => `<tr data-object="${this.esc(this.objectKey(item))}" tabindex="0" role="button" aria-label="${this.esc(item.name)}"><td><span class="object">${this.tile(item.object_type, this.tone(item.status) === "ok" ? "" : this.tone(item.status))}${this.nameCell(item.name, item.object_id, "span")}</span></td>${hid("type") ? "" : `<td data-label="${this.esc(this.t("type"))}">${this.t(item.object_type)}</td>`}${hid("status") ? "" : `<td data-label="${this.esc(this.t("status"))}">${this.pill(item.status)}</td>`}${hid("reason") ? "" : `<td data-label="${this.esc(this.t("reason"))}">${this.esc(item.reason ? this.t(item.reason) : item.missing_reference_count ? `${item.missing_reference_count} ${this.t("missingReferences")}` : "—")}</td>`}${hid("since") ? "" : `<td data-label="${this.esc(this.t("since"))}">${this.formatDate(item.status_since)}</td>`}</tr>`).join("")}</tbody></table>${rows.length ? "" : `<div class="emptymsg">${this.t("noResults")}</div>`}</div>
      ${pg.footer || `<div class="tablefoot"><span>${this.formatNumber(rows.length)} ${this.t("of_total")} ${this.formatNumber(this.data.objects.length)} ${this.t("shown")}</span></div>`}</div>`;
  }

  nodeButton(key, label, tone = "") {
    const obj = this.findObject(key);
    const [type, ...rest] = key.split(":");
    const id = rest.join(":");
    return `<button class="node" data-graph="${this.esc(key)}">${this.tile(type, tone)}<span><small>${this.t(type)}</small><strong>${this.esc(obj?.name || id)}</strong><span class="meta">${this.esc(label || (obj ? obj.object_id : this.t("missing")))}</span></span>${obj ? this.pill(obj.status) : `<span class="pill red">${this.t("missing")}</span>`}</button>`;
  }

  graph() {
    const search = `<div class="panel" style="margin-bottom:14px;overflow:visible"><div class="search">${this.pickerBox("graph", this.t("searchObject"), 'id="graphQuery"')}</div></div>`;
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
  graphModel(item, key, { depth = 1, relation = "", certainOnly = false, limit = GRAPH_NODE_STEP, group = true, open = new Set() } = {}) {
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
    // Leaf nodes of one type that hang on the same node, five or more of them, become one node ("12 × Sensor") until it is opened.
    const repl = new Map();
    if (group) {
      for (const [name, side] of Object.entries(sides)) {
        side.levels = side.levels.map((level, i) => {
          const parents = new Set((side.levels[i + 1] || []).map(n => n.parent));
          const buckets = new Map();
          for (const n of level) {
            if (parents.has(n.key)) continue;
            const id = `${name}|${n.parent}|${n.key.split(":")[0]}|${n.via}`;
            if (!buckets.has(id)) buckets.set(id, []);
            buckets.get(id).push(n);
          }
          const grouped = new Set(), made = [];
          for (const [id, members] of buckets) {
            if (members.length < GRAPH_GROUP_MIN || open.has(id)) continue;
            const g = { key: `group:${id}`, level: members[0].level, via: members[0].via, parent: members[0].parent, group: members.map(m => m.key) };
            members.forEach(m => { repl.set(m.key, g.key); grouped.add(m.key); });
            made.push(g);
          }
          return [...level.filter(n => !grouped.has(n.key)), ...made];
        });
      }
    }
    const seenEdge = new Set(), mapped = [];
    for (const e of edges) {
      const from = repl.get(e.from) ?? e.from, to = repl.get(e.to) ?? e.to;
      const id = `${from}>${to}>${e.edge.relation}`;
      if (from === to || seenEdge.has(id)) continue;
      seenEdge.add(id);
      mapped.push({ ...e, from, to });
    }
    const nodes = new Set([key, ...sides.left.levels.flat().map(n => n.key), ...sides.right.levels.flat().map(n => n.key)]);
    const shown = mapped.filter(e => nodes.has(e.from) && nodes.has(e.to));
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
    const W = 232, H = 48, GAPX = 72, GAPY = 14;
    // Children stand in the order of their parents (and then by type and name), so edges run side by side instead of crossing.
    const sortKey = n => { const obj = this.findObject(n.key), [type, ...rest] = n.key.split(":"); return `${type}\u0000${obj?.name || rest.join(":")}`.toLowerCase(); };
    const order = levels => {
      let before = new Map([[model.key, 0]]);
      return levels.map(level => {
        const sorted = [...level].sort((a, b) => (before.get(a.parent) ?? 0) - (before.get(b.parent) ?? 0) || sortKey(a).localeCompare(sortKey(b)));
        before = new Map(sorted.map((n, i) => [n.key, i]));
        return sorted;
      });
    };
    const columns = [...order(model.left).reverse(), [{ key: model.key, center: true }], ...order(model.right)];
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
    // Every edge ends at a port on a node's right or left side. Several edges on one side get their own height
    // (ordered by where the other end stands), so they leave the node side by side instead of on top of each other.
    const geo = model.edges.map(({ from, to, edge, cycle }) => {
      const a = at.get(from), b = at.get(to);
      if (!a || !b) return null;
      const sameColumn = a.x === b.x;
      const [l, r] = sameColumn ? (a.y < b.y ? [a, b] : [b, a]) : a.x < b.x ? [a, b] : [b, a];
      return { from, to, edge, cycle, a, l, r, sameColumn, lp: `${l === a ? from : to}|R`, rp: `${r === a ? from : to}|${sameColumn ? "R" : "L"}` };
    }).filter(Boolean);
    const ports = new Map();
    for (const g of geo) {
      ports.set(g.lp, [...(ports.get(g.lp) || []), { g, end: "l", other: g.r.y }]);
      ports.set(g.rp, [...(ports.get(g.rp) || []), { g, end: "r", other: g.l.y }]);
    }
    for (const list of ports.values()) {
      list.sort((p, q) => p.other - q.other);
      list.forEach((entry, i) => { entry.g[`${entry.end}y`] = (list.length === 1 ? 0.5 : i / (list.length - 1)) * (H - 16) + 8; });
    }
    const edgeSvg = geo.map(({ edge, cycle, a, from, to, l, r, sameColumn, ly, ry }) => {
      const x1 = l.x + W, y1 = l.y + ly, x2 = sameColumn ? r.x + W : r.x, y2 = r.y + ry;
      // Arcs between nodes of one column bulge out further the more rows they span, so nested arcs do not coincide.
      const rows = Math.round(Math.abs(y2 - y1) / (H + 14));
      const dx = sameColumn ? Math.min(14 + 10 * rows, 44) : (x2 - x1) / 2;
      const forward = edge.source === (l === a ? from : to); // the data direction runs from the first to the second end
      const hit = hitKeys && (hitKeys.has(edge.source) && (hitKeys.has(edge.target) || edge.target === model.key));
      const cls = ["gedge", edge.confidence === "certain" ? "" : "prob", cycle ? "cycle" : "", hit ? "hit" : "", hitKeys && !hit ? "gdim" : ""].filter(Boolean).join(" ");
      const mark = forward ? 'marker-end="url(#hk-arrow)"' : 'marker-start="url(#hk-arrow)"';
      return `<path class="${cls}" d="M${x1},${y1} C${x1 + dx},${y1} ${sameColumn ? x2 + dx : x2 - dx},${y2} ${x2},${y2}" ${mark}><title>${this.esc(`${edge.source} → ${edge.target}: ${this.t(edge.relation)} (${this.t(edge.confidence)})`)}</title></path>`;
    }).join("");
    const nodeSvg = [...at.entries()].map(([key, { x, y, node }]) => {
      if (node.group) {
        const type = node.group[0].split(":")[0], hit = hitKeys && node.group.some(k => hitKeys.has(k));
        const names = node.group.slice(0, 8).map(k => this.findObject(k)?.name || k.split(":").slice(1).join(":")).join(", ") + (node.group.length > 8 ? ", …" : "");
        const label = this.t("graphGroup", { n: node.group.length, type: this.t(type) });
        return `<g class="gnode ggroup ${hit ? "hit" : ""}" data-graph-group="${this.esc(key.slice(6))}" tabindex="0" role="button" aria-label="${this.esc(`${label}. ${this.t("graphGroupOpen")}`)}" data-tip="${this.esc(label)}" data-tip-sub="${this.esc(names)}" transform="translate(${x},${y})">
          <rect width="${W}" height="${H}" rx="8"></rect><text class="t1" x="14" y="18">${this.esc(this.graphClip(label, 30))}</text><text x="14" y="36">${this.esc(this.graphClip(this.t("graphGroupOpen"), 30))}</text></g>`;
      }
      const obj = this.findObject(key), [type, ...rest] = key.split(":"), id = rest.join(":");
      const name = obj?.name || id, status = obj ? this.statusLabel(obj.status) : this.t("missing");
      const hit = hitKeys?.has(key), tone = obj ? this.tone(obj.status) : "red";
      const cls = ["gnode", node.center ? "center" : "", obj ? "" : "missing", hit ? "hit" : "", hitKeys && !hit && !node.center ? "gdim" : ""].filter(Boolean).join(" ");
      const label = `${this.t(type)}: ${name}, ${status}${hit ? `, ${this.t("graphBreaks")}` : ""}`;
      return `<g class="${cls}" ${node.center ? "" : `data-graph="${this.esc(key)}" tabindex="0" role="button"`} aria-label="${this.esc(label)}" data-tip="${this.esc(name)}" data-tip-sub="${this.esc(`${this.t(type)} · ${status}${hit ? ` · ${this.t("graphBreaks")}` : ""} · ${id}`)}" transform="translate(${x},${y})">
        <rect width="${W}" height="${H}" rx="8"></rect><rect class="bar ${tone}" width="5" height="${H}" rx="2"></rect>
        <text class="t1" x="14" y="18">${this.esc(this.graphClip(`${this.t(type)} · ${status}${hit ? ` · ${this.t("graphBreaks")}` : ""}`, 38))}</text>
        <text x="14" y="36">${this.esc(this.graphClip(name, 27))}</text></g>`;
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
    const model = this.graphModel(item, key, { depth: this.graphDepth, relation: this.graphRel, certainOnly: this.graphConf === "certain", limit: this.graphLimit, open: this.graphOpen });
    const impact = this.graphImpact ? this.impact(item, key) : null;
    const hitKeys = impact ? new Set([...impact.hits.map(h => h.key)]) : null;
    const nothing = !model.count;
    const shownHits = hitKeys ? [...hitKeys].filter(k => model.left.concat(model.right).some(level => level.some(n => n.key === k || n.group?.includes(k)))).length : 0;
    const notes = [
      hitKeys && hitKeys.size > shownHits ? this.t("graphHitsOutside", { n: hitKeys.size - shownHits }) : "",
      model.missing ? this.t("graphMissing", { n: model.missing }) : "", model.probable ? this.t("graphProbable", { n: model.probable }) : "",
      model.cycles ? this.t("graphCycles", { n: model.cycles }) : "", model.hidden ? this.t("graphHidden", { n: model.hidden }) : "",
    ].filter(Boolean).join(" · ");
    const more = (model.hidden ? `<button class="btn" data-graph-more>${this.t("graphMore")}</button>` : "") + (this.graphOpen.size ? ` <button class="btn" data-graph-regroup>${this.t("graphRegroup")}</button>` : "");
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
      else if (domain === "sensor" && (!o.unit || o.unit === "%") && o.state !== null && o.state !== "" && !Number.isNaN(Number(o.state))) rows.push({ item: o, level: Number(o.state), low: false });
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
    if (this._embedUnref) return "";
    const stats = this.data.orphaned_statistics || [];
    const tabs = [{ id: "entities", label: this.t("unreferencedEntities"), count: this.unreferencedRows().length }, { id: "statistics", label: this.t("orphanStats"), count: stats.length }];
    return this.viewTabBar("unreferenced", tabs, this.unrefTab === "statistics" ? "statistics" : "entities");
  }

  // Key figures of both tabs; the two main ones switch the tab.
  unrefTiles() {
    const stats = this.data.orphaned_statistics || [], rows = this.unreferencedRows();
    const top = list => { const counts = new Map(); list.forEach(x => x && counts.set(x, (counts.get(x) || 0) + 1)); return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]; };
    const domain = top(rows.map(o => o.object_id.split(".")[0])), platform = top(rows.map(o => o.platform));
    const withStats = rows.filter(o => o.has_statistics).length, inEnergy = stats.filter(o => o.in_energy).length;
    return this.sumTiles([
      { label: this.t("unreferencedEntities"), value: this.formatNumber(rows.length), tone: rows.length ? "warn" : "ok", unref: "entities", active: this.unrefTab !== "statistics" },
      this.data.meta.recorder_available && rows.length ? { label: this.t("unrefSumStats"), value: this.formatNumber(withStats), sub: this.t("unrefSumStatsHint"), tone: "mute" } : null,
      domain ? { label: this.t("unrefSumDomain"), value: this.esc(domain[0]), sub: this.formatNumber(domain[1]), tone: "mute" } : null,
      platform ? { label: this.t("unrefSumPlatform"), value: this.esc(platform[0]), sub: this.formatNumber(platform[1]), tone: "mute" } : null,
      { label: this.t("orphanStats"), value: this.formatNumber(stats.length), tone: stats.length ? "warn" : "ok", unref: "statistics", active: this.unrefTab === "statistics" },
      inEnergy ? { label: this.t("unrefSumEnergy"), value: this.formatNumber(inEnergy), sub: this.t("unrefSumEnergyHint"), tone: "red", unref: "statistics" } : null,
    ]);
  }

  // Active entities that look like what an orphaned statistic became after a rename: same domain, same unit, similar name.
  statSuccessors(orphan) { return this.successorsOf(orphan.statistic_id, orphan.unit, 2); }

  // The same idea for any entity id; `unit` is optional. Hints only, never chosen for the person.
  successorsOf(id, unit, limit = 5) {
    const [domain, name = ""] = String(id || "").split(".");
    if (!domain) return [];
    const words = new Set(name.split("_").filter(Boolean));
    const found = [];
    for (const o of this.data.objects) {
      if (o.object_type !== "entity" || o.status !== "active" || o.object_id === id || !o.object_id.startsWith(`${domain}.`)) continue;
      if (unit && o.unit !== unit) continue;
      const other = new Set(o.object_id.split(".")[1].split("_").filter(Boolean));
      const shared = [...words].filter(w => other.has(w)).length;
      const score = shared / (words.size + other.size - shared || 1);
      if (score >= 0.5) found.push({ item: o, score });
    }
    return found.sort((a, b) => b.score - a.score || a.item.object_id.localeCompare(b.item.object_id)).slice(0, limit).map(f => f.item);
  }

  statSuccessorLine(orphan) {
    const successors = this.statSuccessors(orphan);
    if (!successors.length) return "";
    const links = successors.map(s => `<button class="linklike" data-object="entity:${this.esc(s.object_id)}">${this.esc(s.object_id)}</button>`).join(", ");
    return `<small>${this.t("statSuccessors")} ${links}</small>`;
  }

  // When the statistic last received a value: read on the first visit of the list, never during a scan.
  async loadOrphanLast(refresh = false) {
    this.orphanLastLoading = true; this.render();
    try { this.orphanLast = await this._hass.callWS({ type: "ha_housekeeper/statistics_last", refresh }); }
    catch (_) { this.orphanLast = null; }
    this.orphanLastLoading = false; this.render();
  }

  // Switching to the tab asks again after a failure or a busy recorder; rendering alone never loops.
  retryOrphanLast() {
    if (!this.orphanLast || this.orphanLast.busy) this._orphanLastRequested = false;
  }

  ensureOrphanLast() {
    if (this.orphanLastLoading || this._orphanLastRequested || !this.data?.meta?.recorder_available) return;
    this._orphanLastRequested = true;
    setTimeout(() => this.loadOrphanLast(), 0);
  }

  orphanStatsView() {
    const all = this.data.orphaned_statistics || [];
    this.lvState("orphanstats", "id", "asc");
    const kind = o => (o.has_sum && o.has_mean ? "kindBoth" : o.has_sum ? "kindSum" : "kindMean");
    const lastOf = o => this.orphanLast?.last?.[o.statistic_id];
    const sorts = [
      { key: "id", label: "sortId", dir: "asc", get: o => o.statistic_id },
      { key: "kind", label: "sortKind", dir: "asc", get: o => this.t(kind(o)) },
      { key: "unit", label: "sortUnit", dir: "asc", get: o => o.unit },
      { key: "last", label: "sortLastEntry", dir: "desc", get: lastOf },
    ];
    this.ensureOrphanLast();
    const kinds = [...new Set(all.map(kind))];
    const units = [...new Set(all.map(o => o.unit).filter(Boolean))].sort();
    const AGES = [30, 365, 730];
    this.setExporter("orphanstats", "orphaned-statistics", ["ID", this.t("utKind"), this.t("utUnit"), this.t("utLast"), this.t("inEnergy")], () => rows.map(o => [o.statistic_id, this.t(kind(o)), o.unit || "", lastOf(o) ? new Date(lastOf(o) * 1000).toISOString() : "", o.in_energy ? "yes" : "no"]));
    const bar = this.listBar("orphanstats", { columns: [{ key: "kind", label: "utKind" }, { key: "unit", label: "utUnit" }, { key: "last", label: "utLast" }, { key: "energy", label: "utEnergy" }], sorts, filters: [
      { name: "kind", all: this.t("allKinds"), options: kinds.map(k => [k, this.t(k)]) },
      { name: "unit", all: this.t("allUnits"), options: units.map(u => [u, u]) },
      { name: "age", all: this.t("allAges"), options: AGES.map(d => [String(d), this.t(`statAge${d}`)]) },
    ] });
    const rows = this.refine("orphanstats", all, { text: o => [o.statistic_id, o.unit].join(" "), filters: {
      kind: (o, v) => kind(o) === v, unit: (o, v) => o.unit === v,
      age: (o, v) => { const ts = lastOf(o); return typeof ts === "number" && Date.now() - ts * 1000 > Number(v) * 864e5; },
    }, sorts, tie: o => o.statistic_id });
    const pg = this.paginate("orphanstats", rows);
    const lastCell = o => {
      if (this.orphanLastLoading && !this.orphanLast) return `<span class="muted">…</span>`;
      if (this.orphanLast?.busy) return `<span class="muted">${this.t("lastEntryBusyShort")}</span>`;
      const ts = lastOf(o);
      if (ts === null || ts === undefined) return `<span class="muted">${this.orphanLast?.available ? this.t("lastEntryNone") : "–"}</span>`;
      return this.ageCell(new Date(ts * 1000).toISOString());
    };
    const columns = [
      { key: "id", label: "utStatId", dir: "asc", cell: o => `<div class="statcell">${this.purgeBox(o)}<div>${this.nameCell(o.statistic_id, "")}${this.statSuccessorLine(o)}</div></div>` },
      { key: "kind", label: "utKind", cell: o => this.esc(this.t(kind(o))) },
      { key: "unit", label: "utUnit", cell: o => this.esc(o.unit || "–") },
      { key: "last", label: "utLast", dir: "desc", cell: lastCell },
      { key: "energy", label: "utEnergy", sortable: false, cell: o => (o.in_energy ? `<span class="pill warn">${this.t("inEnergy")}</span>` : "") },
    ];
    const empty = this.t(this.data.meta.recorder_available ? (all.length ? "noMatches" : "noOrphanStats") : "noRecorder");
    const table = rows.length ? this.listTable("orphanstats", columns, pg.rows, { cls: "stat", rowAttrs: () => 'class="static"' }) : `<div class="emptymsg"><ha-icon icon="mdi:chart-line-variant"></ha-icon>${empty}</div>`;
    this._purgePage = pg.rows.filter(o => !o.in_energy).map(o => o.statistic_id);
    return `<div class="stack">${this.unrefTiles()}${this.unrefTabs()}<div class="panel"><p class="factnote">${this.t("orphanStatsHint")}</p>${this.purgeBar()}${bar}${table}${pg.footer}</div></div>`;
  }

  // Deleting the recorder data of entities that are gone: pick rows, confirm with a word; a backup comes first.
  purgeBox(o) {
    if (!this.data.meta.recorder_available || o.in_energy) return "";
    return `<input type="checkbox" class="selbox" data-psel="${this.esc(o.statistic_id)}" ${this.purgeSel.has(o.statistic_id) ? "checked" : ""} aria-label="${this.esc(o.statistic_id)}">`;
  }

  purgeBar() {
    if (!this.data.meta.recorder_available) return "";
    const n = this.purgeSel.size, r = this.purgeResult;
    const result = r ? `<p class="${r.error ? "error" : "factnote"}">${this.esc(r.error ? this.t("purgeError", { reason: this.t(`purgeReason_${r.error}`) }) : this.t("purgeDone", { n: r.removed.length, skipped: r.skipped.length }))}</p>` : "";
    const open = this.purgeOpen && n ? `<div class="panel" role="group" aria-label="${this.esc(this.t("purgeTitle"))}"><div class="pad">
      <p><strong>${this.t("purgeTitle")}</strong></p><p class="factnote">${this.t("purgeWarn", { n })}</p>
      <label><input type="checkbox" data-purge-states ${this.purgeStates ? "checked" : ""}> ${this.t("purgeStates")}</label>
      <div class="setrow planfoot"><small style="margin:0">${this.t("purgePlanHint")}</small>
      <button class="btn primary" data-purge-run ${!this.purgeBusy ? "" : "disabled"}>${this.purgeBusy ? this.t("purgeRunning") : this.t("purgePreview")}</button><button class="btn" data-purge-close>${this.t("cancelRun")}</button></div></div></div>` : "";
    return `${result}<div class="toolbar"><span class="date">${this.t("selectedCount", { count: n })}</span><button class="btn quiet" data-purge-page>${this.t("selectPage")}</button><button class="btn quiet" data-purge-clear ${n ? "" : "disabled"}>${this.t("clearSelection")}</button><span class="toolgap"></span><button class="btn" data-purge-open ${n ? "" : "disabled"}>${this.t("purgeOpen")}</button></div>${open}`;
  }

  async purgeRun() {
    // The deletion is an ordinary plan: preview, confirmation of each ID, backup, verification. It is made here and run under Cleanup.
    this.purgeBusy = true; this.purgeResult = null; this.render();
    try {
      const actions = [...this.purgeSel].map(object_id => ({ kind: "purge_statistics", object_id, states: this.purgeStates }));
      const plan = await this._hass.callWS({ type: "ha_housekeeper/plan_create", actions });
      this.plan = plan; this.confirmation = null; this.ack = new Set(); this.confirmWord = "";
      this.journal = [plan, ...(this.journal || [])];
      this.purgeSel = new Set(); this.purgeOpen = false; this.purgeWord = "";
      this.view = "cleanup"; this.pages = {};
    } catch (err) { this.purgeResult = { removed: [], skipped: [], error: "failed", detail: err?.message || String(err) }; }
    this.purgeBusy = false;
    this.render();
  }

  unreferencedView() {
    if (this.unrefTab === "statistics") return this.orphanStatsView();
    const all = this.unreferencedRows();
    this.lvState("unreferenced", "name", "asc");
    const domainOf = o => o.object_id.split(".")[0];
    const deviceName = o => (o.device_id ? this.findObject(`device:${o.device_id}`)?.name : "") || "";
    const ts = v => (v ? Date.parse(v) || null : null);
    const sorts = [
      { key: "id", label: "sortId", dir: "asc", get: o => o.object_id },
      { key: "name", label: "sortName", dir: "asc", get: o => o.name },
      { key: "domain", label: "sortDomain", dir: "asc", get: domainOf },
      { key: "device", label: "sortDevice", dir: "asc", get: deviceName },
      { key: "area", label: "sortArea", dir: "asc", get: o => this.areaName(o) },
      { key: "platform", label: "sortIntegration", dir: "asc", get: o => o.platform },
      { key: "changed", label: "sortChanged", dir: "desc", get: o => ts(o.last_changed) },
      { key: "reported", label: "sortReported", dir: "desc", get: o => ts(o.last_reported || o.last_updated) },
      { key: "since", label: "sortSince", dir: "asc", get: o => ts(o.status_since) },
      { key: "stats", label: "sortStats", dir: "desc", get: o => (o.has_statistics ? 1 : 0) },
    ];
    const domains = [...new Set(all.map(domainOf))].sort();
    const areas = [...new Set(all.map(o => this.areaName(o)).filter(Boolean))].sort();
    const platforms = [...new Set(all.map(o => o.platform).filter(Boolean))].sort();
    const pickCols = ["domain", "device", "area", "platform", "changed", "reported", "since", "stats"].map(k => ({ key: k, label: { domain: "utDomain", device: "utDevice", area: "utArea", platform: "utIntegration", changed: "utChanged", reported: "utReported", since: "utSince", stats: "utStats" }[k] }));
    this.setExporter("unreferenced", "unused-entities", [this.t("utName"), "ID", this.t("utDomain"), this.t("utDevice"), this.t("utArea"), this.t("utIntegration"), this.t("utChanged"), this.t("utReported"), this.t("utSince"), this.t("utStats")], () => rows.map(o => [o.name, o.object_id, domainOf(o), deviceName(o), this.areaName(o), o.platform || "", o.last_changed || "", o.last_reported || o.last_updated || "", o.status_since || "", this.data.meta.recorder_available ? (o.has_statistics ? "yes" : "no") : ""]));
    const bar = this.listBar("unreferenced", { columns: pickCols, sorts, filters: [
      { name: "domain", all: this.t("allDomains"), options: domains.map(d => [d, `${d} (${all.filter(o => domainOf(o) === d).length})`]) },
      { name: "area", all: this.t("allAreas"), options: areas.map(a => [a, a]) },
      { name: "platform", all: this.t("allIntegrations"), options: platforms.map(p => [p, p]) },
    ] });
    const rows = this.refine("unreferenced", all, {
      text: o => [o.name, o.object_id, this.areaName(o), deviceName(o), o.platform].join(" "),
      filters: { domain: (o, v) => domainOf(o) === v, area: (o, v) => this.areaName(o) === v, platform: (o, v) => o.platform === v }, sorts, tie: o => o.object_id,
    });
    const pg = this.paginate("unreferenced", rows);
    const dash = `<span class="muted">–</span>`;
    const columns = [
      { key: "name", label: "utName", dir: "asc", cell: o => this.nameCell(o.name, o.object_id) },
      { key: "domain", label: "utDomain", cell: o => this.esc(domainOf(o)) },
      { key: "device", label: "utDevice", cell: o => this.esc(deviceName(o)) || dash },
      { key: "area", label: "utArea", cell: o => this.esc(this.areaName(o)) || dash },
      { key: "platform", label: "utIntegration", cell: o => this.esc(o.platform || "") || dash },
      { key: "changed", label: "utChanged", dir: "desc", cell: o => this.ageCell(o.last_changed) },
      { key: "reported", label: "utReported", dir: "desc", cell: o => this.ageCell(o.last_reported || o.last_updated) },
      { key: "since", label: "utSince", cell: o => this.ageCell(o.status_since) },
      { key: "stats", label: "utStats", dir: "desc", cell: o => (this.data.meta.recorder_available ? this.t(o.has_statistics ? "yes" : "no") : dash) },
    ];
    const table = rows.length ? this.listTable("unreferenced", columns, pg.rows, { cls: "unref", rowAttrs: o => `data-object="${this.esc(this.objectKey(o))}" tabindex="0" role="button" aria-label="${this.esc(o.name)}"` }) : `<div class="emptymsg"><ha-icon icon="mdi:link-variant"></ha-icon>${this.t(all.length ? "noMatches" : "noUnreferenced")}</div>`;
    return `<div class="stack">${this.unrefTiles()}${this.unrefTabs()}<div class="panel"><p class="factnote">${this.t("unreferencedHint")}</p>${bar}${table}${pg.footer}</div></div>`;
  }

  batterySorts() {
    return [
      // Low batteries first, then the lowest level.
      { key: "level", label: "sortLevel", dir: "asc", get: r => (r.low ? 0 : 1e6) + (r.volt ? 1000 : 0) + (r.level ?? -1) },
      { key: "name", label: "sortName", dir: "asc", get: r => r.item.name },
      { key: "area", label: "sortArea", dir: "asc", get: r => this.areaName(r.item) },
    ];
  }

  lowBatteries() { return this.data ? this.batteryRows().filter(r => r.low) : []; }

  batteriesView() {
    const all = [...this.batteryRows(), ...this.batteryVoltRows()], low = all.filter(r => r.low);
    this.lvState("batteries", "level", "asc");
    const areas = [...new Set(all.map(r => this.areaName(r.item)).filter(Boolean))].sort();
    const bar = this.listBar("batteries", { sorts: this.batterySorts(), filters: [{ name: "area", all: this.t("allAreas"), options: areas.map(a => [a, a]) }] });
    const list = this.refine("batteries", this.batteryFilter === "low" ? low : all, {
      text: r => [r.item.name, r.item.object_id, this.areaName(r.item)].join(" "),
      filters: { area: (r, v) => this.areaName(r.item) === v }, sorts: this.batterySorts(), tie: r => r.item.object_id,
    });
    const limit = this.data.meta.low_battery_percent ?? 20;
    const levels = all.map(r => r.level).filter(x => x !== null && x !== undefined);
    const lowest = all.filter(r => !r.volt && r.level !== null && r.level !== undefined).sort((x, y) => x.level - y.level)[0];
    const chips = this.sumTiles([
      { label: this.t("batteryAll"), value: this.formatNumber(all.length), tone: "mute", attr: ["data-battery-filter", "all"], active: this.batteryFilter !== "low" },
      { label: this.t("batteryLow"), value: this.formatNumber(low.length), sub: this.t("batterySumLimit", { n: limit }), tone: low.length ? "red" : "ok", attr: ["data-battery-filter", "low"], active: this.batteryFilter === "low" },
      lowest ? { label: this.t("batterySumLowest"), value: `${this.formatNumber(lowest.level)} %`, sub: this.esc(lowest.item.name), tone: lowest.low ? "warn" : "mute" } : null,
    ]);
    const row = ({ item, level, low: isLow, volt }) => {
      const device = item.device_id ? this.findObject(`device:${item.device_id}`) : null;
      const area = this.findObject(`area:${item.area_id || device?.area_id}`);
      const tone = volt ? (isLow ? "red" : volt.days_left !== null && volt.days_left <= 30 ? "warn" : "ok") : isLow ? (level !== null && level <= limit / 2 ? "red" : "warn") : "ok";
      const sub = volt ? [area?.name, this.t("bvLine", { now: this.voltNum(level), kind: this.t(`bvType_${volt.type}`), limit: this.voltNum(volt.limit) })] : [area?.name, item.object_id];
      const pill = volt ? this.voltNum(level) : level !== null ? `${Math.round(level)} ${item.unit || "%"}` : this.t("batteryLow");
      return `<button class="row rel" data-object="${this.esc(this.objectKey(item))}"><span class="tile ${tone === "ok" ? "ok" : tone}"><ha-icon icon="${isLow ? "mdi:battery-alert-variant-outline" : "mdi:battery-high"}"></ha-icon></span><span class="row-text"><strong>${this.esc(device?.name && !String(item.name).toLowerCase().includes(device.name.toLowerCase()) ? `${device.name} – ${item.name}` : item.name)}</strong><small>${this.esc(sub.filter(Boolean).join(" · "))}</small></span><span class="pill ${tone}">${this.esc(pill)}</span></button>`;
    };
    const pg = this.paginate(`batteries-${this.batteryFilter}`, list);
    return `<div class="stack">${chips}${this.batteryTrendCard()}<div class="panel">${bar}${list.length ? pg.rows.map(row).join("") : `<div class="emptymsg"><ha-icon icon="mdi:battery-check-outline"></ha-icon>${this.t(all.length ? "noMatches" : "noBatteries")}</div>`}${pg.footer}${this.voltNote()}</div></div>`;
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

      const stable = this.stabilityOf(item);
      if (stable?.info) {
        const flap = stable.info.level === "flapping";
        rows.push(this.check(t("stability"), flap ? "red" : "warn", this.unstableLines(stable.info, stable.r.window_days)[0], t(flap ? "relFlapping" : "relUnstable")));
      }
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
      if (stable?.info) {
        cause = `${t("cause_unstable", { level: t(stable.info.level === "flapping" ? "relFlapping" : "relUnstable") })} ${cause}`;
        if (tone === "ok") tone = stable.info.level === "flapping" ? "red" : "warn";
        if (!hint) hint = t("hint_unstable");
      }
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

  // The newest long-term row of an entity, asked once per entity when its details open.
  ensureStatLast(id) {
    const asked = (this._statLastAsked ||= new Set());
    if (asked.has(id)) return;
    asked.add(id);
    setTimeout(async () => {
      try {
        const r = await this._hass.callWS({ type: "ha_housekeeper/statistics_last", ids: [id] });
        if (r?.busy) { asked.delete(id); return; }
        (this.statLast ||= {})[id] = r?.last?.[id] ?? 0;
      } catch (_) { return; }
      if (this.selected?.object_id === id) this.render();
    }, 0);
  }

  factsCard(item, key) {
    const finding = this.data.findings.find(f => this.findingKey(f) === key);
    const usage = this.edgesTo(key).filter(e => USAGE_RELATIONS.includes(e.relation)).length;
    const min = this.data.meta.min_unavailable_days || 0;
    const facts = [];
    if (item.status_since) facts.push([this.t("since"), `${this.formatDate(item.status_since)}<small>${this.esc(this.relTime(item.status_since))} · ${this.t("firstSeenNote")}</small>`]);
    if (item.object_type === "entity") {
      const when = value => `${this.esc(this.formatDate(value))}<small>${this.esc(this.relTime(value))}</small>`;
      if (item.last_changed) {
        facts.push([this.t("propLastChanged"), when(item.last_changed)]);
        facts.push([this.t("propLastReported"), when(item.last_reported || item.last_updated)]);
      } else facts.push([this.t("propLastChanged"), this.t("noState")]);
    }
    if (["entity", "automation", "script", "scene", "dashboard"].includes(item.object_type)) {
      facts.push([this.t("finding"), finding ? `${this.pill(finding.classification)}<small>${this.t("certainty")}: ${Math.round(finding.confidence * 100)} %</small>` : this.t("noFinding")]);
    }
    if (item.object_type === "entity") facts.push([this.t("refCount"), this.formatNumber(usage)]);
    const quarantined = ["entity", "device"].includes(item.object_type) ? this.quarantineOf(item.object_id) : null;
    if (quarantined) facts.push([this.t("quarantine"), `${this.t("quarantineFact", { date: this.formatDate(quarantined.since), days: this.daysSince(quarantined.since) })}<span class="factaction">${this.releaseControl(quarantined)}</span>`]);
    if (item.object_type === "entity" && this.data.meta.recorder_available) {
      if (item.has_statistics) this.ensureStatLast(item.object_id);
      const last = this.statLast?.[item.object_id];
      const lastLine = item.has_statistics && last ? `<small>${this.t("statLastEntry")}: ${this.esc(this.formatDate(new Date(last * 1000).toISOString()))} · ${this.esc(this.relTime(new Date(last * 1000).toISOString()))}</small>` : "";
      facts.push([this.t("longTermStats"), `${this.t(item.has_statistics ? "yes" : "no")}${lastLine}`]);
    }
    if (["automation", "script"].includes(item.object_type) && this.runs) {
      const row = this.runsRow(item);
      if (!row) facts.push([this.t("runsTab"), this.t("runsFactNone")]);
      else {
        facts.push([this.t("runsColRuns"), `${this.formatNumber(row.runs)}${row.lower_bound ? "+" : ""}<small>${this.t("runsColErrors")}: ${this.formatNumber(row.errors)} · ${this.t("runsColConditions")}: ${this.formatNumber(row.conditions)}</small>`]);
        facts.push([this.t("runsColDuration"), `${this.runsDuration(row.mean_ms)} / ${this.runsDuration(row.max_ms)}`]);
        facts.push([this.t("runsColTrend"), this.runsTrend(row)]);
      }
    }
    if (item.object_type === "config_entry" && this.reliability?.available) {
      const row = this.reliabilityRow(item);
      if (row && row.availability !== null && row.availability !== undefined) facts.push([this.t("relFactAvail", { days: this.reliability.window_days }), `${this.formatNumber(row.availability)} %<small>${this.t("relEntities", { n: row.entities })}${row.shared_outages ? ` · ${this.t(row.shared_outages === 1 ? "relSharedOne" : "relShared", { n: row.shared_outages, longest: this.relDuration(row.longest_outage) })}` : ""}</small>`]);
    }
    if (item.object_type === "entity") {
      const stable = this.stabilityOf(item);
      if (stable?.missing) facts.push([this.t("stability"), this.t("stabilityMissing")]);
      else if (stable?.info) facts.push([this.t("stability"), `<span class="pill ${stable.info.level === "flapping" ? "red" : "warn"}">${this.t(stable.info.level === "flapping" ? "relFlapping" : "relUnstable")}</span>${this.unstableLines(stable.info, stable.r.window_days).map(line => `<small>${line}</small>`).join("")}`]);
      else if (stable) facts.push([this.t("stability"), `${this.t("stabilityOk")}<small>${this.t(stable.r.window_days === 1 ? "relWindow1" : "relWindow7")}</small>`]);
    }
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
    // From 26 entries on a group gets a search box; a search lists up to 100 hits instead of the first 25.
    const body = groups.map(([title, list], i) => {
      const found = this.searchList(`rel-${i}`, list, x => `${this.findObject(x.other)?.name || ""} ${x.other} ${x.label}`, LIMIT + 1);
      const cap = found.rows.length !== list.length ? 100 : LIMIT;
      return `<div class="sectionlabel">${title} (${list.length})</div>${found.bar}${found.none}${found.rows.slice(0, cap).map(row).join("")}${found.rows.length > cap ? `<p class="factnote">${this.t("moreItems", { count: found.rows.length - cap })}</p>` : ""}`;
    }).join("");
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
    if (["automation", "script"].includes(item.object_type) && (item.actions?.length || item.triggers?.length)) tabs.push(["flow", "flowTab"]);
    if (item.object_type === "device") tabs.push(["life", "lifeTab"]);
    if (this.runsRow(item)) tabs.push(["runs", "runsTab"]);
    if (this.reliabilityRow(item)) tabs.push(["reliability", "relTab"]);
    return tabs;
  }

  detail() {
    const base = this.selected;
    const item = { ...base, ...(this.details.get(this.objectKey(base)) || {}) };
    const key = this.objectKey(item);
    if (["automation", "script"].includes(item.object_type)) this.ensureRuns();
    if (item.object_type === "config_entry") this.ensureReliability();
    if (item.object_type === "entity") this.ensureStability();
    if (item.object_type === "device") this.ensureLifecycle(item.object_id);
    this.ensureCorrelations();
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
    if (tab === "relations") return `<div class="stack">${this.markCard(item)}${this.relationsCard(key)}</div>`;
    if (tab === "flow") return this.flowCard(item, key);
    if (tab === "life") return this.lifeCard(item);
    if (tab === "runs") return this.runsDetailCard(this.runsRow(item));
    if (tab === "reliability") return this.reliabilityDetailCard(this.reliabilityRow(item));
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
    return `<div class="detailgrid"><div class="stack">${this.diagnosisCard(item)}${this.actionsCard(item, key)}${this.impactCard(item, key)}</div><div class="stack">${this.factsCard(item, key)}</div></div>`;
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
    this.followUp("costs", "recorder", this.costs, r => this.loadCosts(r), refresh);
  }

  // Opening the costs tab starts the analysis once; the backend answers with the last result at once.
  ensureCosts() {
    if (this.costsLoading || this._costsRequested) return;
    this._costsRequested = true;
    setTimeout(() => this.loadCosts(), 0);
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
    this.ensureCosts();
    const c = this.costs;
    const head = (extra = "") => `<div class="panelhead"><div><h2>${this.t("recorderTitle")}</h2><p>${this.t("recorderHint")}</p></div><div class="actions">${extra}</div></div>`;
    if (this.costsLoading) return `<div class="panel">${head()}${this.skeleton("recorderLoading")}</div>`;
    if (this.costsError) return `<div class="panel">${head(`<button class="btn" data-costs-load>${this.t("recorderReload")}</button>`)}<div class="error">${this.esc(this.costsError)}</div></div>`;
    if (!c) return `<div class="panel">${head(`<button class="btn primary" data-costs-load>${this.t("recorderLoad")}</button>`)}</div>`;
    if (c.busy) return `<div class="panel">${head(`<button class="btn" data-costs-load>${this.t("recorderReload")}</button>`)}<p class="factnote">${this.t("relBusy")}</p></div>`;
    if (!c.available) return `<div class="panel">${head()}<div class="emptymsg"><ha-icon icon="mdi:database-off-outline"></ha-icon>${this.t("recorderUnavailable")}</div></div>`;
    const took = c.computed_at && (c.stale || c.age_seconds >= 60) ? this.tookNote(c) : c.took_ms === null || c.took_ms === undefined ? "" : ` · ${this.t(c.cached ? "recorderCached" : "recorderTook", { ms: this.formatNumber(c.took_ms) })}`;
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
    const head = `<div class="panelhead"><div><h2>${this.t("preflightTitle")}</h2><p>${this.t("preflightHint")}</p></div><div class="actions">${buttons}</div></div>`;
    if (this.preflightError) return `<div class="panel">${head}<div class="error">${this.esc(this.preflightError)}</div></div>`;
    if (!p) return `<div class="panel">${head}${this.skeleton("preflightLoading")}</div>`;
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
    const checks = this.backup?.available ? this.backup.checks || [] : [];
    const problems = checks.filter(c => c.level === "problem").length, notes = checks.filter(c => c.level === "note").length;
    const pf = this.preflight, pfChecks = pf?.checks || [];
    const pfRed = pfChecks.filter(c => c.level === "red").length, pfWarn = pfChecks.filter(c => c.level === "warn").length;
    const updates = pf?.state?.pending_updates?.length || 0;
    const backupTone = !this.backup?.available ? "mute" : problems ? "red" : notes ? "warn" : "ok";
    const pfTone = !pf ? "mute" : pfRed ? "red" : pfWarn ? "warn" : "ok";
    const goalsMissed = (this.goals?.goals || []).filter(g => g.state === "missed").length;
    this.ensureGoals();
    const bp = this.blueprints, bpBad = bp ? (bp.missing || 0) + (bp.broken || 0) : 0;
    const tabs = [
      { id: "backup", icon: "mdi:backup-restore", label: this.t("backupTitle"), hint: "maintHintBackup", pill: !this.backup?.available ? "" : problems ? this.t("mtProblems", { n: problems }) : notes ? this.t("mtNotes", { n: notes }) : this.t("bhLevel_ok"), tone: backupTone },
      { id: "preflight", icon: "mdi:rocket-launch-outline", label: this.t("preflightTitle"), hint: "maintHintPreflight", pill: !pf ? "" : pfRed || pfWarn ? this.t("mtOpen", { n: pfRed + pfWarn }) : this.t("bhLevel_ok"), tone: pfTone },
      { id: "blueprints", icon: "mdi:file-code-outline", label: this.t("bpTab"), hint: "maintHintBlueprints", pill: bpBad ? this.t("mtOpen", { n: bpBad }) : "", tone: "warn" },
      { id: "devices", icon: "mdi:devices", label: this.t("lifeRemovedTab"), hint: "maintHintDevices", pill: this.removed?.length ? this.formatNumber(this.removed.length) : "", tone: "mute" },
      { id: "window", icon: "mdi:calendar-clock-outline", label: this.t("winTab"), hint: "maintHintWindow", pill: "", tone: "mute" },
      { id: "goals", icon: "mdi:target", label: this.t("goalsTitle"), hint: "maintHintGoals", pill: goalsMissed ? this.t("tilesMissed", { count: goalsMissed }) : "", tone: "red" },
    ];
    const open = this.viewTabOf("maintenance", tabs, "backup");
    const grid = this.navTiles("maintenance", tabs.map(tab => ({ ...tab, hint: this.t(tab.hint), tone: tab.pill ? tab.tone : "ok" })), open, this.t("maintenance"));
    return `<div class="stack">${grid}${open === "goals" ? this.goalsCard() : open === "preflight" ? this.preflightCard() : open === "devices" ? this.removedCard() : open === "blueprints" ? this.blueprintsCard() : open === "window" ? this.windowCard() : this.backupCard()}</div>`;
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
    if (!b) return `<div class="panel">${head}${this.skeleton("backupLoading")}</div>`;
    if (!b.available) return `<div class="panel">${head}<div class="emptymsg">${this.t("backupUnavailable")}</div></div>`;
    const guide = `<details class="bhguide"><summary>${this.t("bhGuideTitle")}</summary><p class="factnote">${this.t("bhGuideSteps")}</p></details>`;
    return `<div class="panel">${head}${b.checks.map(c => this.bhRow(c)).join("")}${this.bhBackups(b.backups)}${guide}</div>`;
  }
}

// ReliabilityMixin: the reliability view; mixed into the panel in 99-register.js.
class ReliabilityMixin {
  // Slow recorder views: an old reply is shown at once and renewed once; when another calculation holds the
  // query lock, the panel asks again by itself a few times instead of asking the user to click.
  followUp(name, view, result, reload, refresh) {
    if (!result) return;
    if (!refresh && result.stale) { reload(true); return; }
    this._busyTries = this._busyTries || {};
    if (!result.busy) { this._busyTries[name] = 0; return; }
    this._busyTries[name] = (this._busyTries[name] || 0) + 1;
    if (this._busyTries[name] <= BUSY_RETRIES) setTimeout(() => { if (this.view === view) reload(refresh); }, BUSY_WAIT_MS);
  }

  // " · calculated in 2.8 s", or the age of an old reply.
  tookNote(r) {
    if (!r || !r.available) return "";
    if (r.computed_at && (r.stale || r.age_seconds >= 60)) return ` · ${this.t("relAgeNote", { when: this.relTime(new Date(r.computed_at * 1000).toISOString()) })}`;
    if (r.took_ms === null || r.took_ms === undefined) return "";
    return ` · ${this.t(r.cached ? "relCached" : "relTook", { s: this.formatNumber(Math.round(r.took_ms / 100) / 10) })}`;
  }

  async loadReliability(refresh = false) {
    this.relLoading = true; this.relError = ""; this.render();
    try { this.reliability = await this._hass.callWS({ type: "ha_housekeeper/reliability", window_days: this.relWindow, refresh, ...(this.relCompare ? { compare: true } : {}) }); }
    catch (err) { this.relError = err?.message || String(err); }
    this.relLoading = false; this.render();
    this.followUp("reliability", "reliability", this.reliability, r => this.loadReliability(r), refresh);
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

  relSorts() {
    return [
      { key: "avail", label: "relSortAvail", dir: "asc", get: e => e.availability },
      { key: "title", label: "sortName", dir: "asc", get: e => e.title },
      { key: "outages", label: "relSortOutages", dir: "desc", get: e => e.shared_outages },
    ];
  }

  relRowBody(item) {
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
    if (item.setup) lines.push(`${item.setup.count ? this.t("relSetup", { n: item.setup.count, days: item.setup.days, last: this.formatDate(item.setup.last) }) : ""}${item.setup.state ? `${item.setup.count ? " · " : ""}${this.t("relSetupNow", { state: item.setup.state })}` : ""}`);
    lines.push(item.last_disruption
      ? this.t(item.last_disruption.shared ? "relLastShared" : "relLastSingle", { date: this.formatDate(new Date(item.last_disruption.end * 1000).toISOString()), duration: this.relDuration(item.last_disruption.seconds) })
      : this.t("relNoDisruption"));
    if (item.delta !== null && item.delta !== undefined) lines.push(this.t("relDelta", { delta: `${item.delta > 0 ? "+" : item.delta < 0 ? "−" : "±"}${this.formatNumber(Math.abs(item.delta))}`, before: this.formatNumber(item.previous_availability) }));
    else if (this.reliability?.comparison?.available) lines.push(this.t("relDeltaNone"));
    return `<span class="tile ${tone}"><ha-icon icon="mdi:lan-connect"></ha-icon></span><span class="row-text"><strong>${this.esc(item.title)}</strong>${lines.map(line => `<small>${line}</small>`).join("")}${flags.length ? `<span class="relflags">${flags.join(" ")}</span>` : ""}</span><span class="pill ${tone}">${percent === null ? "—" : `${this.formatNumber(percent)} %`}</span>`;
  }

  relRow(item) {
    const key = `config_entry:${item.entry_id}`;
    const open = this.findObject(key) ? ` data-object="${this.esc(key)}"` : "";
    return `<${open ? "button" : "div"} class="row${open ? " rel" : ""}"${open}>${this.relRowBody(item)}</${open ? "button" : "div"}>`;
  }

  // The row of one config entry in the loaded numbers, for its detail page.
  reliabilityRow(item) {
    if (item.object_type !== "config_entry") return null;
    return (this.reliability?.entries || []).find(row => row.entry_id === item.object_id) || null;
  }

  reliabilityDetailCard(row) {
    const r = this.reliability;
    const items = row.affected || [];
    const list = items.map(m => {
      const tone = m.availability >= 99.5 ? "ok" : m.availability >= 95 ? "warn" : "red";
      return `<button class="row rel" data-object="entity:${this.esc(m.entity_id)}">${this.tile("entity", tone)}<span class="row-text"><strong>${this.esc(m.name)}</strong><small>${this.esc(m.entity_id)}</small></span><span class="pill ${tone}">${this.formatNumber(m.availability)} %</span></button>`;
    }).join("");
    const more = row.affected_total > items.length ? `<p class="factnote">${this.t("relAffectedMore", { shown: items.length, total: row.affected_total })}</p>` : "";
    const summary = `<div class="row">${this.relRowBody(row)}</div>`;
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("relTab")}</h2><p>${this.t(r.window_days === 1 ? "relWindow1" : "relWindow7")}${r.stale || r.age_seconds ? ` · ${this.t("relAgeNote", { when: this.relTime(new Date(r.computed_at * 1000).toISOString()) })}` : ""}</p></div></div>${summary}<div class="sectionlabel">${this.t("relAffected", { n: this.formatNumber(row.affected_total || 0) })}</div>${list || `<p class="factnote">${this.t("relNoAffected")}</p>`}${more}</section>`;
  }

  reliabilityView() {
    this.ensureReliability();
    const r = this.reliability;
    const windows = [[1, "relWindow1"], [7, "relWindow7"]].map(([days, key]) => `<button class="chip ${this.relWindow === days ? "active" : ""}" data-rel-window="${days}" aria-pressed="${this.relWindow === days}">${this.t(key)}</button>`).join("") + `<button class="chip ${this.relCompare ? "active" : ""}" data-rel-compare aria-pressed="${this.relCompare}">${this.t("relCompare")}</button>`;
    const took = this.tookNote(r);
    const head = `<div class="panelhead"><div><h2>${this.t("relTitle")}</h2><p>${this.t("relHint")}${took}</p></div><div class="actions" style="display:flex;gap:8px;flex-wrap:wrap">${windows}<button class="btn" data-rel-refresh ${this.relLoading ? "disabled" : ""}>${this.t("relRefresh")}</button></div></div>`;
    if (this.relError) return `<div class="panel">${head}<div class="error">${this.esc(this.relError)}</div></div>`;
    if (!r) return `<div class="panel">${head}${this.skeleton("relLoading")}</div>`;
    if (!r.available) return `<div class="panel">${head}<p class="factnote">${this.t("relNoRecorder")}</p></div>`;
    if (r.busy) return `<div class="panel">${head}${this.skeleton("relBusy")}<p class="factnote">${this.t("relBusy")}</p></div>`;
    if (!r.entries.length) return `<div class="panel">${head}<div class="emptymsg">${this.t("relEmpty")}</div></div>`;
    const loading = this.relLoading ? `<p class="factnote">${this.t("relLoading")}</p>` : "";
    const th = r.thresholds || {};
    const cov = r.coverage;
    const coverage = cov && cov.observed_share !== null && cov.observed_share !== undefined ? this.coverageNote(this.t("relCoverage", { days: r.window_days, withData: this.formatNumber(cov.with_data), known: this.formatNumber(cov.known), share: cov.observed_share })) : "";
    this.lvState("relentries", "avail", "asc");
    const entries = this.refine("relentries", r.entries, { text: e => [e.title, e.domain].join(" "), sorts: this.relSorts(), tie: e => e.title, filters: {
      state: (e, v) => v === "outages" ? e.shared_outages > 0 : v === "reauth" ? e.reauth : e.state && e.state !== "loaded",
    } });
    const bar = r.entries.length > 5 || this.lv.relentries.q ? this.listBar("relentries", { sorts: this.relSorts(), filters: [
      { name: "state", all: this.t("relAllStates"), options: [["outages", this.t("relOnlyOutages")], ["reauth", this.t("relOnlyReauth")], ["notloaded", this.t("relOnlyNotLoaded")]] },
    ] }) : "";
    const pg = this.paginate("relentries", entries);
    const list = entries.length ? pg.rows.map(item => this.relRow(item)).join("") : `<div class="emptymsg">${this.t("noMatches")}</div>`;
    const u = r.unstable || { total: 0, entities: {} };
    const flapping = Object.values(u.entities || {}).filter(e => e.level === "flapping").length;
    const outages = r.entries.filter(e => e.shared_outages > 0).length;
    const attention = r.entries.filter(e => e.reauth || (e.state && e.state !== "loaded")).length;
    const counted = r.entries.reduce((n, e) => n + (e.availability === null || e.availability === undefined ? 0 : e.entities), 0);
    const overall = counted ? r.entries.reduce((n, e) => n + (e.availability === null || e.availability === undefined ? 0 : e.availability * e.entities), 0) / counted : null;
    const availText = overall === null ? "–" : `${this.formatNumber(Math.round(overall * 10) / 10)} %`;
    const odd = r.entries.filter(e => e.shared_outages > 0 || e.reauth || (e.state && e.state !== "loaded")).length;
    const tabs = [
      { id: "integrations", icon: "mdi:puzzle-outline", label: this.t("relTabIntegrations"), hint: this.t("relTileIntHint", { avail: availText, window: this.t(r.window_days === 1 ? "relWindow1" : "relWindow7") }), count: r.entries.length, tone: outages || attention ? "warn" : "ok", pill: odd ? this.t("relTilePill", { n: this.formatNumber(odd) }) : "", pillTone: attention ? "red" : "warn" },
      { id: "unstable", icon: "mdi:pulse", label: this.t("relTabUnstable"), hint: this.t("relTileUnstableHint"), count: u.total || 0, tone: flapping ? "red" : u.total ? "warn" : "ok", pill: flapping ? this.t("relSumFlapping", { n: this.formatNumber(flapping) }) : "" },
    ];
    const open = this.viewTabOf("reliability", tabs, u.total && !outages ? "unstable" : "integrations");
    const intHead = `<div class="panelhead"><div><h2>${this.t("relTabIntegrations")}</h2><p>${this.t("relIntHint")}</p></div></div>`;
    const body = open === "unstable" ? this.unstableCard(r) : `<div class="panel">${intHead}${coverage}${bar}${loading}${list}${pg.footer}${this.howCounted("relFootnote", { days: r.window_days, share: th.shared_share_percent ?? 80, entities: th.shared_min_entities ?? 3, minutes: Math.round((th.shared_min_seconds ?? 300) / 60) })}</div>`;
    return `<div class="stack"><div class="panel">${head}</div>${this.navTiles("reliability", tabs, open, this.t("reliability"))}${body}</div>`;
  }

  // The numbers behind "unstable" or "flapping" as lines of text; also used on the entity's detail page.
  unstableLines(item, days) {
    const lines = [this.t("relEpisodes", { n: item.episodes, days, rate: this.formatNumber(item.per_day), total: this.relDuration(item.total_seconds), mean: this.relDuration(item.mean_seconds) })];
    if (item.pattern_hour !== null && item.pattern_hour !== undefined) lines.push(this.t("relPattern", { from: String(item.pattern_hour).padStart(2, "0"), to: String((item.pattern_hour + 2) % 24).padStart(2, "0") }));
    if (item.used) lines.push(this.t("relFollowers", { n: item.used }));
    return lines;
  }

  unstableRow(item, days) {
    const tone = item.level === "flapping" ? "red" : "warn";
    const lines = [`${this.esc(item.entity_id)}${item.entry_title ? ` · ${this.esc(item.entry_title)}` : ""}`, ...this.unstableLines(item, days)];
    return `<button class="row" data-object="entity:${this.esc(item.entity_id)}"><span class="tile ${tone}"><ha-icon icon="mdi:swap-vertical"></ha-icon></span><span class="row-text"><strong>${this.esc(item.name)}</strong>${lines.map(line => `<small>${line}</small>`).join("")}</span><span class="pill ${tone}">${this.t(item.level === "flapping" ? "relFlapping" : "relUnstable")}</span></button>`;
  }

  // The stability of an entity for its detail page, from numbers that already exist: it never starts the recorder query.
  ensureStability() {
    if (this._stabRequested === this.relWindow || this.reliability?.available) return;
    this._stabRequested = this.relWindow;
    setTimeout(async () => {
      try { this.stability = await this._hass.callWS({ type: "ha_housekeeper/reliability", window_days: this.relWindow, cached_only: true }); } catch (_) { return; }
      if (this.selected?.object_type === "entity") this.render();
    }, 0);
  }

  // null: unknown; { missing }: never calculated; { info: null }: calculated, stable; { info }: unstable or flapping.
  stabilityOf(item) {
    const r = this.reliability?.available && !this.reliability.busy ? this.reliability : this.stability;
    if (!r || !r.available) return null;
    if (r.missing) return { missing: true };
    const map = r.unstable?.entities;
    if (!map) return null; // a reply kept by an older version
    return { r, info: map[item.object_id] || null };
  }

  unstableCard(r) {
    const u = r.unstable, th = r.thresholds || {};
    if (!u) return "";
    const head = `<div class="panelhead"><div><h2>${this.t("relUnstableTitle")}</h2><p>${this.t("relUnstableHint")}</p></div></div>${r.coverage ? this.coverageNote(this.t("relUnstableCoverage", { days: r.window_days, withData: this.formatNumber(r.coverage.with_data) }) + ` ${this.excludedText(u.excluded)}`.trimEnd()) : ""}`;
    if (!u.items.length) return `<div class="panel">${head}<div class="emptymsg">${this.t("relUnstableNone")}</div></div>`;
    const more = u.total > u.items.length ? `<p class="factnote">${this.t("relUnstableMore", { shown: u.items.length, total: u.total })}</p>` : "";
    const rank = new Map(u.items.map((item, i) => [item, i]));
    const sorts = [
      { key: "rank", label: "relSortRank", dir: "asc", get: item => rank.get(item) },
      { key: "name", label: "sortName", dir: "asc", get: item => item.name },
      { key: "episodes", label: "relSortEpisodes", dir: "desc", get: item => item.episodes },
      { key: "rate", label: "relSortRate", dir: "desc", get: item => item.per_day },
      { key: "duration", label: "relSortDuration", dir: "desc", get: item => item.total_seconds },
    ];
    this.lvState("relunstable", "rank", "asc");
    const rows = this.refine("relunstable", u.items, { text: item => [item.name, item.entity_id, item.entry_title].join(" "), sorts, tie: item => item.entity_id, filters: { level: (item, v) => item.level === v } });
    const bar = u.items.length > 5 || this.lv.relunstable.q ? this.listBar("relunstable", { sorts, filters: [
      { name: "level", all: this.t("relAllStates"), options: [["flapping", this.t("relOnlyFlapping")], ["unstable", this.t("relOnlyUnstable")]] },
    ] }) : "";
    const pg = this.paginate("relunstable", rows);
    const list = rows.length ? pg.rows.map(item => this.unstableRow(item, r.window_days)).join("") : `<div class="emptymsg">${this.t("noMatches")}</div>`;
    return `<div class="panel">${head}${bar}${list}${pg.footer}${more}${this.howCounted("relUnstableFootnote", { episodes: th.unstable_min_episodes ?? 3, rate: this.formatNumber(th.unstable_per_day ?? 0.5), flap: this.formatNumber(th.flapping_per_day ?? 1.5) })}</div>`;
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
    return row.findings.map(f => `<small class="fline"><span class="pill ${f.level === "info" ? "mute" : f.level}">${this.t((RUN_FINDINGS[f.kind] || ["rfLabelFailing"])[0])}</span><span class="fnum">${this.runFindingText(f)}</span><span class="fnote">${this.t(`rfHint_${f.kind}`)}</span></small>`).join("");
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

  // Possible conflicts and loops between automations; only shown when the check found something.
  conflictRow(c) {
    const names = c.automations.map(a => `<b>${this.esc(a.name)}</b>`);
    const links = c.automations.map(a => `<button class="link" data-object="${this.esc(`automation:${a.entity_id}`)}">${this.esc(a.name)}</button>`).join(" · ");
    const text = c.kind === "opposing"
      ? this.t("cfOpposing", { first: names[0], second: names[1], entity: `<code>${this.esc(c.entity_id)}</code>`, a: this.esc(c.commands[0]), b: this.esc(c.commands[1]) }) + " " + this.t(`cfWhy_${c.reason}`, { detail: this.esc(c.detail) })
      : this.t("cfLoop", { chain: names.join(", "), path: c.entities.map(e => `<code>${this.esc(e)}</code>`).join(" → ") });
    const seen = c.stage === "static" ? this.t("cfStatic") : this.t(c.kind === "loop" ? "cfSeenLoop" : "cfSeen", { n: c.days, min: this.runs?.thresholds?.conflicts_loop_min_runs_per_day ?? 20 });
    const tone = c.stage === "confirmed" ? "warn" : "mute";
    return `<div class="row"><span class="tile ${tone}"><ha-icon icon="${c.kind === "loop" ? "mdi:sync-alert" : "mdi:swap-horizontal"}"></ha-icon></span><span class="row-text"><small class="fline"><span class="pill ${tone}">${this.t(`cfStage_${c.stage}`)}</span><span class="fnum">${text}</span></small><small>${seen}</small><small>${links}</small><small class="fnote">${this.t(`cfHint_${c.kind}`)}</small></span></div>`;
  }

  conflictsPanel(r) {
    const c = r.conflicts;
    if (!c) return "";
    const rows = c.items.length ? c.items.map(item => this.conflictRow(item)).join("") : `<div class="emptymsg">${this.t("cfNone")}</div>`;
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("cfTitle")}</h2><p>${this.t("cfHint")}</p></div></div>${rows}</div>`;
  }

  runsSorts() {
    return [
      { key: "name", label: "runsColName", dir: "asc", get: r => r.name },
      { key: "runs", label: "runsColRuns", dir: "desc", get: r => r.runs },
      { key: "errors", label: "runsColErrors", dir: "desc", get: r => r.errors },
      { key: "conditions", label: "runsColConditions", dir: "desc", get: r => r.conditions },
      { key: "duration", label: "runsColDuration", dir: "desc", get: r => r.mean_ms },
    ];
  }

  // Search text and the two filters of the runs view; they cut the table and the list of what stands out alike.
  runsMatch(row) {
    const st = this.lv.runs, q = st.q.trim().toLowerCase();
    if (q && ![row.name, row.entity_id].join(" ").toLowerCase().includes(q)) return false;
    if (st.f.type && row.object_type !== st.f.type) return false;
    if (st.f.outcome === "errors" && !row.errors) return false;
    if (st.f.outcome === "flagged" && !row.findings.length) return false;
    return true;
  }

  runsBar(rows = []) {
    this.setExporter("runs", "runs", [this.t("runsColName"), "ID", this.t("runsColRuns"), this.t("runsColErrors"), this.t("runsColConditions"), `${this.t("runsColDuration")} (ms, mean)`, `${this.t("runsColDuration")} (ms, max)`], () => rows.map(r => [r.name, r.entity_id, r.runs, r.errors, r.conditions, r.mean_ms ?? "", r.max_ms ?? ""]));
    return this.listBar("runs", { columns: [{ key: "runs", label: "runsColRuns" }, { key: "errors", label: "runsColErrors" }, { key: "conditions", label: "runsColConditions" }, { key: "duration", label: "runsColDuration" }, { key: "trend", label: "runsColTrend" }], sorts: this.runsSorts(), filters: [
      { name: "type", all: this.t("allTypes"), options: [["automation", this.t("automation")], ["script", this.t("script")]] },
      { name: "outcome", all: this.t("runsAllOutcomes"), options: [["errors", this.t("runsOnlyErrors")], ["flagged", this.t("runsOnlyFlagged")]] },
    ] });
  }

  runsTable(rows) {
    this.lvState("runs", "runs", "desc");
    const pg = this.paginate("runsall", rows);
    const columns = [
      { key: "name", label: "runsColName", dir: "asc", cell: row => this.nameCell(row.name, row.entity_id) },
      { key: "runs", label: "runsColRuns", dir: "desc", cell: row => `${this.formatNumber(row.runs)}${row.lower_bound ? "+" : ""}` },
      { key: "errors", label: "runsColErrors", dir: "desc", cell: row => this.formatNumber(row.errors) },
      { key: "conditions", label: "runsColConditions", dir: "desc", cell: row => this.formatNumber(row.conditions) },
      { key: "duration", label: "runsColDuration", dir: "desc", cell: row => `${this.runsDuration(row.mean_ms)} / ${this.runsDuration(row.max_ms)}` },
      { key: "trend", label: "runsColTrend", sortable: false, cell: row => this.runsTrend(row) },
    ];
    const table = this.listTable("runs", columns, pg.rows, { cls: "runs", rowAttrs: row => `data-object="${this.esc(`${row.object_type}:${row.entity_id}`)}" tabindex="0" role="button" aria-label="${this.esc(row.name)}"` });
    return `${table}${pg.footer}`;
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
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("runsTab")}</h2><p>${since}</p></div></div><div class="pad"><dl class="kv">${facts}<dt>${this.t("runsColTrend")}</dt><dd>${this.runsTrend(row)}</dd></dl></div>${notes}${this.howCounted("runsFootnote")}</section>`;
  }

  // Two tabs: the counted runs, and the quality of each automation (46-diagnostics.js).
  runsView() {
    const tabs = [
      { id: "runs", icon: "mdi:run-fast", label: this.t("runsTabRuns"), hint: this.t("runsTileRunsHint"), tone: "mute" },
      { id: "quality", icon: "mdi:clipboard-pulse-outline", label: this.t("qualityTab"), hint: this.t("runsTileQualityHint"), tone: "mute" },
    ];
    const open = this.viewTabOf("runs", tabs, "runs");
    if (open === "quality") return `<div class="stack">${this.navTiles("runs", tabs, open, this.t("runs"))}${this.qualityView()}</div>`;
    return `<div class="stack">${this.navTiles("runs", tabs, open, this.t("runs"))}${this.runsListView()}</div>`;
  }

  runsListView() {
    this.ensureRuns();
    const r = this.runs;
    const since = r?.since ? ` · ${this.t("runsSince", { date: this.formatDate(r.since) })}` : "";
    const head = `<div class="panelhead"><div><h2>${this.t("runsTitle")}</h2><p>${this.t("runsHint")}${since}</p></div><div class="actions"><button class="btn" data-runs-refresh ${this.runsLoading ? "disabled" : ""}>${this.t("runsRefresh")}</button></div></div>`;
    if (this.runsError) return `<div class="panel">${head}<div class="error">${this.esc(this.runsError)}</div></div>`;
    if (!r) return `<div class="panel">${head}${this.skeleton("runsLoading")}</div>`;
    this.lvState("runs", "runs", "desc");
    const lower = r.items.filter(row => row.lower_bound).length;
    const coverage = this.coverageNote(this.t(lower ? "runsCoverageLower" : "runsCoverageFull", { n: this.formatNumber(lower), days: r.window_days }) + ` ${this.excludedText(r.excluded)}`.trimEnd());
    const flagged = r.items.filter(row => row.findings.length && this.runsMatch(row));
    const everyCounted = r.items.filter(row => row.runs);
    const counted = this.refine("runs", everyCounted.filter(row => this.runsMatch(row)), { text: row => [row.name, row.entity_id].join(" "), sorts: this.runsSorts(), tie: row => row.entity_id });
    const bar = everyCounted.length > 5 || this.lv.runs.q ? this.runsBar(counted) : "";
    const flaggedPage = this.paginate("runsflag", flagged);
    const attention = flagged.length ? flaggedPage.rows.map(row => this.runsAttentionRow(row)).join("") + flaggedPage.footer : `<div class="emptymsg">${this.t(this.lv.runs.q || this.lv.runs.f.type || this.lv.runs.f.outcome ? "noMatches" : everyCounted.length ? "runsNone" : "runsNoData")}</div>`;
    const more = r.total > r.items.length ? `<p class="factnote">${this.t("runsMore", { shown: r.items.length, total: r.total })}</p>` : "";
    const all = everyCounted.length ? `<div class="panel"><div class="panelhead"><div><h2>${this.t("runsAll")}</h2></div></div>${counted.length ? this.runsTable(counted) : `<div class="emptymsg">${this.t("noMatches")}</div>`}${more}${this.howCounted("runsFootnote")}</div>` : "";
    const runTotal = r.items.reduce((n, row) => n + row.runs, 0), errorTotal = r.items.reduce((n, row) => n + row.errors, 0);
    const neverOk = r.items.filter(row => row.findings.some(f => f.kind === "never_ok")).length;
    const allFlagged = r.items.filter(row => row.findings.length).length;
    const tiles = this.sumTiles([
      { label: this.t("runsSumRuns"), value: this.formatNumber(runTotal), sub: this.t("runsSumOf", { n: this.formatNumber(everyCounted.length) }), tone: "mute" },
      { label: this.t("runsColErrors"), value: this.formatNumber(errorTotal), sub: runTotal ? this.t("runsSumShare", { n: this.formatNumber(Math.round((1000 * errorTotal) / runTotal) / 10) }) : "", tone: errorTotal ? "warn" : "ok" },
      { label: this.t("runsSumFlagged"), value: this.formatNumber(allFlagged), tone: allFlagged ? "warn" : "ok" },
      { label: this.t("runsSumNeverOk"), value: this.formatNumber(neverOk), tone: neverOk ? "red" : "ok" },
    ]);
    return `<div class="stack">${tiles}<div class="panel">${head}${coverage}${bar}${attention}</div>${this.conflictsPanel(r)}${all}</div>`;
  }
}

// StormsMixin: the recorder load view; mixed into the panel in 99-register.js.
class StormsMixin {
  async loadStorms(refresh = false) {
    this.stormsLoading = true; this.stormsError = ""; this.render();
    try { this.storms = await this._hass.callWS({ type: "ha_housekeeper/storms", window_days: this.stormsWindow, refresh }); }
    catch (err) { this.stormsError = err?.message || String(err); }
    this.stormsLoading = false; this.render();
    this.followUp("storms", "recorder", this.storms, r => this.loadStorms(r), refresh);
  }

  // The first visit and every change of the window load once; the backend keeps the result for ten minutes.
  ensureStorms() {
    if (this.stormsLoading || this._stormsRequested === this.stormsWindow) return;
    this._stormsRequested = this.stormsWindow;
    setTimeout(() => this.loadStorms(), 0);
  }

  // "2 automations, 1 script": what hangs on the loud entity, by type.
  stormFollowers(followers) {
    const parts = Object.entries(followers || {}).map(([type, n]) => `${this.formatNumber(n)} ${this.t(type === "config_entry" ? "config_entry" : type)}`);
    return parts.length ? this.t("stormFollowers", { list: parts.join(", ") }) : "";
  }

  stormFindingText(f) {
    const n = v => this.formatNumber(v);
    if (f.kind === "storm") return this.t("stormStorm", { perDay: n(f.per_day), peak: n(f.peak_hour) });
    if (f.kind === "attribute_flood") return this.t("stormFlood", { perDay: n(f.per_day), kb: this.formatNumber(Math.round(f.attr_bytes / 102.4) / 10) });
    if (f.kind === "no_new_state") return this.t("stormNoNew", { share: f.share, perDay: n(f.per_day) });
    if (f.kind === "integration_share") return this.t("stormShare", { share: this.formatNumber(f.load_share), perDay: n(f.per_day) });
    return this.t("stormEvent", { count: n(f.count), type: f.event_type });
  }

  stormFindingRow(f) {
    const tone = f.kind === "storm" || f.kind === "integration_share" ? "red" : "warn";
    const title = f.kind === "event_burst" ? f.event_type : f.kind === "integration_share" ? f.title : f.name || f.entity_id;
    const id = f.entity_id && f.entity_id !== title ? `<small>${this.esc(f.entity_id)}</small>` : "";
    const chain = this.stormFollowers(f.followers);
    const inner = `<span class="tile ${tone}"><ha-icon icon="mdi:chart-bell-curve"></ha-icon></span><span class="row-text"><strong>${this.esc(title)}</strong>${id}<small>${this.esc(this.stormFindingText(f))}</small>${chain ? `<small>${this.esc(chain)}</small>` : ""}</span><span class="pill ${tone}">${this.t(`stormKind_${f.kind}`)}</span>`;
    return f.entity_id ? `<button class="row" data-object="entity:${this.esc(f.entity_id)}">${inner}</button>` : `<div class="row">${inner}</div>`;
  }

  stormEntityRow(item) {
    const parts = [this.t("stormRows", { rows: this.formatNumber(item.rows), perDay: this.formatNumber(item.per_day) })];
    if (item.no_new_state >= 0.1) parts.push(this.t("stormNoNewShort", { share: Math.round(item.no_new_state * 100) }));
    if (item.attr_bytes !== null && item.attr_bytes !== undefined) parts.push(this.t("stormAttr", { kb: this.formatNumber(Math.round(item.attr_bytes / 102.4) / 10) }));
    if (item.peak_hour) parts.push(this.t("stormPeak", { n: this.formatNumber(item.peak_hour) }));
    return `<button class="row" data-object="entity:${this.esc(item.entity_id)}"><span class="tile mute"><ha-icon icon="mdi:database-clock-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(item.name || item.entity_id)}</strong><small>${this.esc(item.entity_id)}</small><small>${this.esc(parts.join(" · "))}</small></span><span class="pill mute">${this.formatNumber(item.per_day)} ${this.t("stormPerDay")}</span></button>`;
  }

  // A bar needs a text next to it: the percentage stands in the row, the bar is decoration.
  stormShareRow(item) {
    const share = Math.max(0, Math.min(100, item.load_share));
    return `<div class="row"><span class="tile mute"><ha-icon icon="mdi:lan"></ha-icon></span><span class="row-text"><strong>${this.esc(item.title)}</strong><small>${this.esc(item.domain || "")} · ${this.t("stormShareLine", { entities: this.formatNumber(item.entities), rows: this.formatNumber(item.per_day), rowShare: this.formatNumber(item.row_share) })}</small><span class="sharebar" aria-hidden="true"><i style="width:${share}%"></i></span></span><span class="pill mute">${this.formatNumber(item.load_share)} %</span></div>`;
  }

  // Operation > Recorder: what writes the most, what fills the database, and how healthy it is.
  // The two recorder queries run one after the other: the second starts when the first is done.
  recorderView() {
    const stormsDone = this.storms || this.stormsError;
    if (stormsDone) this.ensureDbHealth();
    const st = this.storms?.available && !this.storms.busy ? this.storms : null;
    const db = this.dbHealth?.available && !this.dbHealth.busy ? this.dbHealth : null;
    const meta = this.data?.meta?.database;
    const stormFindings = st ? st.findings.length : 0;
    const dbFindings = db ? db.findings.length : 0;
    const dbTone = !db ? "mute" : db.findings.some(f => f.level === "problem") ? "red" : dbFindings ? "warn" : "ok";
    const stormTone = !st ? "mute" : st.findings.some(f => f.kind === "storm" || f.kind === "integration_share") ? "red" : stormFindings ? "warn" : "ok";
    const bytes = db?.db_bytes ?? meta?.db_bytes;
    const perDay = db?.growth?.known ? db.growth.per_day : meta?.per_day;
    const keep = db?.keep_days ?? meta?.keep_days, purge = db?.auto_purge ?? meta?.auto_purge;
    const loud = st?.entities?.[0], topCost = this.costs?.entities?.[0];
    const tabs = [
      { id: "load", icon: "mdi:chart-timeline-variant", label: this.t("stormTitle"), hint: st ? this.t("recTileLoadRows", { n: this.formatNumber(st.per_day), window: this.t(this.stormsWindow === 1 ? "relWindow1" : "relWindow7") }) : this.t("recTileLoadHint"), count: st ? stormFindings : null, tone: stormTone },
      { id: "costs", icon: "mdi:database-search-outline", label: this.t("recorderTitle"), hint: topCost ? this.t("recTileCostsTop", { name: topCost.name || topCost.entity_id, share: topCost.share }) : this.t("recTileCostsHint"), tone: "mute" },
      { id: "db", icon: "mdi:database-outline", label: this.t("dbTitle"), hint: bytes !== null && bytes !== undefined ? [this.formatBytes(bytes), perDay !== null && perDay !== undefined ? this.t("dbOvPerDay", { size: this.formatBytes(Math.max(0, perDay)) }) : ""].filter(Boolean).join(" · ") : this.t("recTileDbHint"), count: db ? dbFindings : null, tone: dbTone, pill: purge === false ? this.t("recSumPurgeOff") : "", pillTone: "warn" },
    ];
    const open = this.viewTabOf("recorder", tabs, "load");
    const body = open === "costs" ? this.recorderCard() : open === "db" ? this.dbCard() : this.stormsView();
    return `<div class="stack">${this.navTiles("recorder", tabs, open, this.t("recorder"))}${body}</div>`;
  }

  stormsView() {
    this.ensureStorms();
    const r = this.storms;
    const windows = [[1, "relWindow1"], [7, "relWindow7"]].map(([days, key]) => `<button class="chip ${this.stormsWindow === days ? "active" : ""}" data-storm-window="${days}" aria-pressed="${this.stormsWindow === days}">${this.t(key)}</button>`).join("");
    const took = this.tookNote(r);
    const head = `<div class="panelhead"><div><h2>${this.t("stormTitle")}</h2><p>${this.t("stormHint")}${took}</p></div><div class="actions" style="display:flex;gap:8px;flex-wrap:wrap">${windows}<button class="btn" data-storm-refresh ${this.stormsLoading ? "disabled" : ""}>${this.t("relRefresh")}</button></div></div>`;
    if (this.stormsError) return `<div class="panel">${head}<div class="error">${this.esc(this.stormsError)}</div></div>`;
    if (!r) return `<div class="panel">${head}${this.skeleton("stormLoading")}</div>`;
    if (!r.available) return `<div class="panel">${head}<p class="factnote">${this.t("relNoRecorder")}</p></div>`;
    if (r.busy) return `<div class="panel">${head}${this.skeleton("relBusy")}<p class="factnote">${this.t("relBusy")}</p></div>`;
    const loading = this.stormsLoading ? `<p class="factnote">${this.t("stormLoading")}</p>` : "";
    const foundFindings = this.searchList("stormfind", r.findings, f => [f.name, f.entity_id, f.title, f.event_type].join(" "));
    const findingPage = this.paginate("stormfind", foundFindings.rows);
    const attention = r.findings.length ? foundFindings.bar + foundFindings.none + findingPage.rows.map(f => this.stormFindingRow(f)).join("") + findingPage.footer : `<div class="emptymsg">${this.t("stormNone")}</div>`;
    const summary = `<p class="factnote">${this.t("stormSummary", { rows: this.formatNumber(r.total_rows), perDay: this.formatNumber(r.per_day), entities: this.formatNumber(r.entity_count), events: this.formatNumber(r.event_total) })}</p>`;
    const foundEntities = this.searchList("stormentities", r.entities, item => [item.name, item.entity_id].join(" "));
    const entityPage = this.paginate("stormentities", foundEntities.rows);
    const table = r.entities.length ? `<div class="panel"><div class="panelhead"><div><h2>${this.t("stormLoudest")}</h2><p>${this.t("stormLoudestHint")}</p></div></div>${foundEntities.bar}${foundEntities.none}${entityPage.rows.map(item => this.stormEntityRow(item)).join("")}${entityPage.footer}</div>` : "";
    const foundShares = this.searchList("stormshares", r.integrations, item => [item.title, item.domain].join(" "));
    const shares = r.integrations.length ? `<div class="panel"><div class="panelhead"><div><h2>${this.t("stormShares")}</h2><p>${this.t("stormSharesHint")}</p></div></div>${foundShares.bar}${foundShares.none}${foundShares.rows.map(item => this.stormShareRow(item)).join("")}</div>` : "";
    const events = r.events.length ? `<div class="panel"><div class="panelhead"><div><h2>${this.t("stormEvents")}</h2><p>${this.t("stormEventsHint")}</p></div></div>${r.events.map(e => `<div class="row"><span class="tile mute"><ha-icon icon="mdi:flash-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(e.type)}</strong></span><span class="pill mute">${this.formatNumber(e.count)}</span></div>`).join("")}${this.howCounted("stormFootnote")}</div>` : "";
    const left = this.excludedText(r.excluded);
    // The sections are tabs, so the lower ones are not hidden far down the page.
    const warn = r.findings.some(f => f.kind === "storm" || f.kind === "integration_share");
    const tabs = [
      { id: "findings", label: this.t("stormTabFindings"), count: r.findings.length, tone: warn ? "red" : r.findings.length ? "warn" : "ok" },
      r.entities.length ? { id: "entities", label: this.t("stormTabEntities"), count: r.entities.length } : null,
      r.integrations.length ? { id: "shares", label: this.t("stormTabIntegrations"), count: r.integrations.length } : null,
      r.events.length ? { id: "events", label: this.t("stormTabEvents"), count: r.events.length } : null,
    ].filter(Boolean);
    const open = this.viewTabOf("recload", tabs, r.findings.length ? "findings" : "entities");
    const body = open === "entities" ? table : open === "shares" ? shares : open === "events" ? events : `<div class="panel"><div class="panelhead"><div><h2>${this.t("stormTabFindings")}</h2></div></div>${attention}</div>`;
    return `<div class="stack"><div class="panel">${head}${loading}${summary}${left ? `<p class="factnote">${left}</p>` : ""}</div>${this.viewTabBar("recload", tabs, open)}${body}</div>`;
  }
}

// DbHealthMixin: the database card in Maintenance; mixed into the panel in 99-register.js.
class DbHealthMixin {
  async loadDbHealth(refresh = false) {
    this.dbLoading = true; this.dbError = ""; this.render();
    try { this.dbHealth = await this._hass.callWS({ type: "ha_housekeeper/db_health", refresh }); }
    catch (err) { this.dbError = err?.message || String(err); }
    this.dbLoading = false; this.render();
    this.followUp("db", "recorder", this.dbHealth, r => this.loadDbHealth(r), refresh);
  }

  // Loads on the first visit of Maintenance only: the query reads the recorder, so the overview never starts it.
  ensureDbHealth() {
    if (this.dbLoading || this._dbRequested) return;
    this._dbRequested = true;
    setTimeout(() => this.loadDbHealth(), 0);
  }

  dbSeriesList(series) {
    return series.map(s => this.esc(s.name || s.statistic_id)).join(", ");
  }

  dbFindingText(f) {
    const n = v => this.formatNumber(v), size = v => this.formatBytes(v);
    if (f.kind === "wal_large") return this.t("dbWal", { wal: size(f.wal_bytes), db: size(f.db_bytes) });
    if (f.kind === "growth") return this.t("dbGrowth", { recent: size(f.recent_bytes), base: size(f.base_bytes) });
    if (f.kind === "duplicates") return this.t("dbDuplicates", { n: n(f.groups), more: f.capped ? "+" : "", list: this.dbSeriesList(f.series) });
    if (f.kind === "missing_hours") {
      const list = (rows) => rows.map(s => `${this.esc(s.name || s.statistic_id)} (${this.t("dbMissingHours", { n: n(s.own ?? s.missing) })})`).join(", ");
      if (!f.gap_hours) return this.t("dbMissing", { n: n(f.series_total), list: list(f.series) });
      const own = f.series.filter(s => s.own >= 6);
      const shared = this.t("dbMissingShared", { n: n(f.series_total), hours: n(f.gap_hours), count: n(f.gaps_total) });
      return `${shared} ${f.own_series ? this.t("dbMissingOwn", { n: n(f.own_series), list: list(own.slice(0, 5)) }) : this.t("dbMissingOnlyShared")}`;
    }
    if (f.kind === "statistics_issues") return this.t("dbIssues", { n: n(f.series_total), list: f.series.map(s => `${this.esc(s.name || s.statistic_id)} (${s.types.map(type => this.t(`dbIssue_${type}`) === `dbIssue_${type}` ? type : this.t(`dbIssue_${type}`)).join(", ")})`).join(", ") });
    return this.t("dbRecorderGap", { n: n(f.gaps), longest: this.relDuration(f.longest_seconds), latest: this.formatDate(new Date(f.latest[0].start * 1000).toISOString()) });
  }

  // What lies behind a finding: the periods all series lack, and the series with their own and their shared hours.
  dbFindingExtra(f) {
    if (f.kind !== "missing_hours" || !(f.gaps?.length || f.series?.length)) return "";
    const gaps = (f.gaps || []).map(g => `<div class="row rel"><span class="tile ${g.cause === "restart" ? "mute" : "warn"}"><ha-icon icon="${g.cause === "restart" ? "mdi:restart" : "mdi:database-clock-outline"}"></ha-icon></span><span class="row-text"><strong>${this.esc(this.formatDate(new Date(g.start * 1000).toISOString()))} – ${this.esc(this.formatDate(new Date(g.end * 1000).toISOString()))}</strong><small>${this.t("dbMissingHours", { n: this.formatNumber(g.hours) })} · ${this.t(`dbGapCause_${g.cause}`)}</small></span></div>`).join("");
    const rows = f.series.map(s => { const obj = this.findObject(`entity:${s.statistic_id}`); const name = this.esc(s.name || s.statistic_id); return `<tr${obj ? ` data-object="${this.esc(`entity:${s.statistic_id}`)}" tabindex="0" role="button"` : ' class="static"'}><td>${this.nameCell(s.name || s.statistic_id, s.statistic_id, "span")}</td><td data-label="${this.esc(this.t("dbColOwn"))}">${this.formatNumber(s.own)}</td><td data-label="${this.esc(this.t("dbColShared"))}">${this.formatNumber(s.shared)}</td><td data-label="${this.esc(this.t("dbColMissing"))}">${this.formatNumber(s.missing)}</td></tr>`; }).join("");
    const more = f.series_total > f.series.length ? `<p class="factnote">${this.t("relUnstableMore", { shown: f.series.length, total: f.series_total })}</p>` : "";
    const table = rows ? `<div class="tablewrap lt"><table><thead><tr><th scope="col">${this.t("dbColSeries")}</th><th scope="col">${this.t("dbColOwn")}</th><th scope="col">${this.t("dbColShared")}</th><th scope="col">${this.t("dbColMissing")}</th></tr></thead><tbody>${rows}</tbody></table></div>${more}` : "";
    return `<details class="howto dbextra"><summary>${this.t("dbDetails", { gaps: this.formatNumber(f.gaps_total || 0), series: this.formatNumber(f.series_total) })}</summary>${f.gaps?.length ? `<div class="sectionlabel">${this.t("dbGapsTitle")}</div>${gaps}` : ""}<div class="sectionlabel">${this.t("dbSeriesTitle")}</div>${table}</details>`;
  }

  dbFindingRow(f) {
    const tone = f.level === "problem" ? "red" : "warn";
    return `<div class="row"><span class="tile ${tone}"><ha-icon icon="mdi:database-alert-outline"></ha-icon></span><span class="row-text"><strong>${this.t(`dbKind_${f.kind}`)}</strong><small>${this.dbFindingText(f)}</small><small>${this.t(`dbAdvice_${f.kind}`)}</small></span><span class="pill ${tone}">${this.t(f.level === "problem" ? "dbProblem" : "dbHint")}</span></div>${this.dbFindingExtra(f)}`;
  }

  dbCard() {
    const r = this.dbHealth;
    const took = this.tookNote(r);
    const head = `<div class="panelhead"><div><h2>${this.t("dbTitle")}</h2><p>${this.t("dbHint2")}${took}</p></div><div class="actions"><button class="btn" data-db-refresh ${this.dbLoading ? "disabled" : ""}>${this.t("relRefresh")}</button></div></div>`;
    if (this.dbError) return `<div class="panel">${head}<div class="error">${this.esc(this.dbError)}</div></div>`;
    if (!r) return `<div class="panel">${head}${this.skeleton("dbLoading")}</div>`;
    if (!r.available) return `<div class="panel">${head}<p class="factnote">${this.t("relNoRecorder")}</p></div>`;
    if (r.busy) return `<div class="panel">${head}${this.skeleton("relBusy")}<p class="factnote">${this.t("relBusy")}</p></div>`;
    const th = r.thresholds || {};
    const facts = [];
    if (r.supported && r.db_bytes !== null && r.db_bytes !== undefined) facts.push(this.t("dbSize", { db: this.formatBytes(r.db_bytes), wal: this.formatBytes(r.wal_bytes || 0) }));
    else facts.push(this.t("dbNoSize", { dialect: this.esc(r.dialect || "?") }));
    if (r.growth?.known) facts.push(this.t("dbPerDay", { size: this.formatBytes(Math.max(0, r.growth.per_day)) }));
    else facts.push(this.t("dbGrowthUnknown"));
    if (r.keep_days) facts.push(this.t("dbKeep", { n: this.formatNumber(r.keep_days) }));
    if (r.auto_purge === false) facts.push(this.t("dbOvPurgeOff"));
    if (r.restart_gaps) facts.push(this.t("dbRestartGaps", { n: this.formatNumber(r.restart_gaps) }));
    const rows = r.findings.length ? r.findings.map(f => this.dbFindingRow(f)).join("") : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("dbNone")}</div>`;
    return `<div class="panel">${head}${rows}<p class="factnote">${facts.join(" · ")}</p>${this.howCounted("dbFootnote", { gap: th.state_gap_minutes ?? 10, gapDays: th.state_gap_window_days ?? 7, missing: th.gap_min_hours ?? 6, missingDays: th.gap_window_days ?? 30 })}</div>`;
  }
}

// ExposureMixin: which entities assistants and bridges can reach; mixed into the panel in 99-register.js.
class ExposureMixin {
  async loadExposure() {
    this.exposureLoading = true; this.exposureError = ""; this.render();
    try { this.exposure = await this._hass.callWS({ type: "ha_housekeeper/exposure" }); }
    catch (err) { this.exposureError = err?.message || String(err); }
    this.exposureLoading = false; this.render();
  }

  // Loads on the first visit; a refresh button reloads. The query is cheap and only reads registries.
  ensureExposure() {
    if (this.exposureLoading || this._exposureRequested) return;
    this._exposureRequested = true;
    setTimeout(() => this.loadExposure(), 0);
  }

  expoAssistantName(id) {
    return this.t(`expoName_${id.replace(/\./g, "_")}`);
  }

  expoAssistantList(ids) {
    return (ids || []).map(id => this.expoAssistantName(id)).join(", ");
  }

  expoFindingText(f) {
    return this.t(`expoText_${f.kind}`, { n: this.formatNumber(f.count), alias: f.alias || "", assistant: f.assistant ? this.expoAssistantName(f.assistant) : "", domain: f.domain || "" });
  }

  // One finding as a fold: the head always shows, the entities and the advice only when open.
  expoFindingRows(f) {
    const tone = f.level === "warn" ? "warn" : "mute";
    const q = (this.lv.exposure?.q || "").trim().toLowerCase();
    const matching = (f.items || []).filter(item => !q || [item.name, item.entity_id, ...(item.assistants || [])].join(" ").toLowerCase().includes(q));
    const all = !!this.expoAll?.[f.kind];
    const shown = all || q ? matching : matching.slice(0, 10);
    const rows = shown.map(item => `<button class="row" data-object="entity:${this.esc(item.entity_id)}"><span class="tile mute"><ha-icon icon="mdi:chevron-right"></ha-icon></span><span class="row-text"><strong>${this.esc(item.name || item.entity_id)}</strong><small>${this.esc(item.entity_id)}${item.assistants?.length ? ` · ${this.esc(this.expoAssistantList(item.assistants))}` : ""}</small></span></button>`).join("");
    const total = q ? matching.length : f.count;
    const more = total > shown.length ? `<p class="factnote"><button class="link" data-expo-all="${this.esc(f.kind)}">${this.t("expoShowAll", { n: this.formatNumber(total) })}</button></p>` : "";
    const body = `<p class="factnote foldadvice">${this.t(`expoAdvice_${f.kind}`)}</p>${rows}${more}`;
    const head = { tone, title: this.t(`expoKind_${f.kind}`), sub: this.expoFindingText(f), pill: this.t(f.level === "warn" ? "expoWarn" : "expoHint2") };
    return this.fold(`expo_${f.kind}`, head, body, false, q ? matching.length > 0 : undefined);
  }

  expoSection(titleKey, list) {
    return list.length ? `<h3 class="expohd">${this.t(titleKey)}</h3>${list.map(f => this.expoFindingRows(f)).join("")}` : "";
  }

  // Voice assistants and bridges as one list: id, name, state and how many entities each one reaches.
  expoSources(r) {
    const list = r.assistants.map(a => ({ id: a.id, label: this.expoAssistantName(a.id), status: a.status, count: a.exposed }));
    const kinds = {};
    for (const b of r.bridges) {
      const kind = (kinds[b.kind] ||= { id: b.kind, label: this.expoAssistantName(b.kind), status: "ok", count: 0, titles: [] });
      kind.count += b.exposed; kind.titles.push(b.title);
    }
    return [...list, ...Object.values(kinds)];
  }

  // The entities one assistant or bridge can reach, searchable; a click opens the entity.
  expoSourceTab(r, source) {
    const all = (r.exposed_entities || []).filter(e => e.assistants.includes(source.id));
    const found = this.searchList(`expo_${source.id}`, all, e => [e.name, e.entity_id].join(" "));
    const pg = this.paginate(`expo_${source.id}`, found.rows);
    const rows = pg.rows.map(e => {
      const others = e.assistants.filter(id => id !== source.id);
      return `<button class="row" data-object="entity:${this.esc(e.entity_id)}"><span class="tile mute"><ha-icon icon="mdi:chevron-right"></ha-icon></span><span class="row-text"><strong>${this.esc(e.name)}</strong><small>${this.esc(e.entity_id)}${others.length ? ` · ${this.esc(this.t("expoAlso", { list: this.expoAssistantList(others) }))}` : ""}</small></span></button>`;
    }).join("");
    const where = source.titles?.length ? ` (${this.esc(source.titles.join(", "))})` : "";
    const capped = r.exposed_total > (r.exposed_entities || []).length ? `<p class="factnote">${this.t("expoCapped", { n: this.formatNumber(r.exposed_entities.length) })}</p>` : "";
    const empty = all.length ? "" : `<div class="emptymsg">${this.t(source.status === "inactive" ? "expoInactiveText" : "expoNoneFor")}</div>`;
    return `<div class="panel"><div class="panelhead"><div><h2>${this.esc(source.label)}${where}</h2><p>${this.t("expoSourceHint", { n: this.formatNumber(source.count), name: this.esc(source.label) })}</p></div></div>${found.bar}${found.none}${empty}${rows}${pg.footer}${capped}</div>`;
  }

  exposureView() {
    this.ensureExposure();
    const r = this.exposure;
    const head = `<div class="panelhead"><div><h2>${this.t("expoTitle")}</h2><p>${this.t("expoHint")}</p></div><div class="actions"><button class="btn" data-expo-refresh ${this.exposureLoading ? "disabled" : ""}>${this.t("relRefresh")}</button></div></div>`;
    if (this.exposureError) return `<div class="panel">${head}<div class="error">${this.esc(this.exposureError)}</div></div>`;
    if (!r) return `<div class="panel">${head}${this.skeleton("expoLoading")}</div>`;
    const sources = this.expoSources(r);
    const live = sources.filter(x => x.status === "ok");
    const warn = r.findings.filter(f => f.level === "warn").length;
    const tabs = [
      { id: "findings", icon: "mdi:shield-alert-outline", label: this.t("expoTabFindings"), hint: this.t("expoTileFindingsHint"), count: r.findings.length, tone: warn ? "warn" : "ok" },
      ...sources.map(x => x.status === "ok"
        ? { id: x.id, icon: "mdi:microphone-outline", label: x.label, hint: this.t("expoTileSourceHint", { n: this.formatNumber(x.count) }), count: x.count, tone: "ok" }
        : { id: x.id, icon: "mdi:microphone-off", label: x.label, hint: this.t(x.status === "inactive" ? "expoInactive" : "expoUnavailable"), disabled: true }),
    ];
    const open = this.viewTabOf("exposure", tabs.filter(x => !x.disabled), r.findings.length || !live.length ? "findings" : live[0].id);
    let body;
    if (open === "findings") {
      this.lvState("exposure", "", "asc");
      const q = this.lv.exposure.q.trim().toLowerCase();
      const itemCount = r.findings.reduce((n, f) => n + (f.items || []).length, 0);
      const bar = itemCount >= 6 || q ? this.listBar("exposure", { sorts: [] }) : "";
      const shown = q ? r.findings.filter(f => (f.items || []).some(item => [item.name, item.entity_id, ...(item.assistants || [])].join(" ").toLowerCase().includes(q))) : r.findings;
      const rows = shown.length ? this.expoSection("expoToCheck", shown.filter(f => f.level === "warn")) + this.expoSection("expoToNote", shown.filter(f => f.level !== "warn")) : q ? `<div class="emptymsg">${this.t("noMatches")}</div>` : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("expoNone")}</div>`;
      body = `<div class="panel"><div class="panelhead"><div><h2>${this.t("expoTabFindings")}</h2><p>${this.t("expoFindingsHint")}</p></div></div>${bar}${rows}${this.howCounted("expoFootnote")}</div>`;
    } else body = this.expoSourceTab(r, sources.find(x => x.id === open));
    return `<div class="stack"><div class="panel">${head}<p class="factnote">${this.t("expoIntro")}</p></div>${this.navTiles("exposure", tabs, open, this.t("exposure"))}${body}</div>`;
  }
}

// SearchMixin: one search box in the top bar for entities, devices, integrations, automations and scripts.
const QUICK_TYPES = ["entity", "device", "config_entry", "automation", "script"];
const QUICK_LIMIT = 12;

class SearchMixin {
  // The one object search: every word must occur in the name, the id, the integration, the maker or the model; names that
  // start with the first word come first. The top bar, the dependency path and the sensor fields all use it.
  searchObjects(query, { types = QUICK_TYPES, limit = QUICK_LIMIT, filter = null } = {}) {
    const terms = String(query).toLowerCase().split(/\s+/).filter(Boolean);
    if (!this.data || !terms.length) return [];
    const found = [];
    for (const item of this.data.objects) {
      if ((types && !types.includes(item.object_type)) || (filter && !filter(item))) continue;
      const name = String(item.name || "").toLowerCase();
      const hay = `${name} ${String(item.object_id).toLowerCase()} ${String(item.platform || item.domain || "").toLowerCase()} ${String(item.manufacturer || "").toLowerCase()} ${String(item.model || "").toLowerCase()}`;
      if (!terms.every(term => hay.includes(term))) continue;
      found.push({ item, rank: name.startsWith(terms[0]) ? 0 : name.includes(terms[0]) ? 1 : 2 });
    }
    const order = types || QUICK_TYPES;
    found.sort((a, b) => a.rank - b.rank || order.indexOf(a.item.object_type) - order.indexOf(b.item.object_type) || String(a.item.name).localeCompare(String(b.item.name)));
    return found.slice(0, limit).map(entry => entry.item);
  }

  quickResults() {
    return this.quickQuery.trim().length < 2 ? [] : this.searchObjects(this.quickQuery);
  }

  quickSearchBox() {
    if (!this.data) return "";
    const results = this.quickOpen ? this.quickResults() : [];
    const active = Math.min(this.quickIndex, Math.max(results.length - 1, 0));
    const list = this.quickOpen && this.quickQuery.trim().length >= 2
      ? `<ul class="quicklist" id="quick-list" role="listbox" aria-label="${this.esc(this.t("quickLabel"))}">${results.length
        ? results.map((item, i) => `<li role="option" id="quick-opt-${i}" aria-selected="${i === active}" data-quick-item="${this.esc(this.objectKey(item))}" class="${i === active ? "on" : ""}">${this.tile(item.object_type)}<span class="row-text"><strong>${this.esc(item.name)}</strong><small>${this.esc(this.t(item.object_type))} · ${this.esc(item.object_id)}</small></span></li>`).join("")
        : `<li class="none">${this.t("quickNone")}</li>`}</ul>` : "";
    return `<div class="quick"><ha-icon icon="mdi:magnify"></ha-icon><input type="search" data-quick autocomplete="off" role="combobox" aria-expanded="${Boolean(list)}" aria-controls="quick-list" aria-autocomplete="list" ${list && results.length ? `aria-activedescendant="quick-opt-${active}"` : ""} placeholder="${this.esc(this.t("quickPlaceholder"))}" aria-label="${this.esc(this.t("quickLabel"))}" value="${this.esc(this.quickQuery)}">${list}</div>`;
  }

  quickPick(key) {
    const obj = this.findObject(key);
    if (!obj) return;
    this.quickQuery = ""; this.quickOpen = false; this.quickIndex = 0; this.menuOpen = null; this.navOpen = false;
    this.openObject(obj);
  }

  bindQuick(root) {
    const input = root.querySelector("[data-quick]");
    if (input) {
      input.oninput = () => { this.quickQuery = input.value; this.quickOpen = true; this.quickIndex = 0; this.scheduleRender(); };
      input.onfocus = () => { if (this.quickQuery && !this.quickOpen) { this.quickOpen = true; this.render(); } };
      input.onkeydown = ev => {
        const results = this.quickResults();
        if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
          if (!results.length) return;
          ev.preventDefault();
          this.quickOpen = true;
          this.quickIndex = (this.quickIndex + (ev.key === "ArrowDown" ? 1 : results.length - 1)) % results.length;
          this.render();
        } else if (ev.key === "Enter" && results.length) {
          ev.preventDefault();
          this.quickPick(this.objectKey(results[Math.min(this.quickIndex, results.length - 1)]));
        } else if (ev.key === "Escape" && (this.quickOpen || this.quickQuery)) {
          ev.stopPropagation();
          this.quickQuery = ""; this.quickOpen = false; this.render();
        }
      };
    }
    root.querySelectorAll("[data-quick-item]").forEach(el => el.onclick = () => this.quickPick(el.dataset.quickItem));
    if (!this._quickBound && root.addEventListener) {
      this._quickBound = true;
      root.addEventListener("click", ev => {
        if (!this.quickOpen || (ev.composedPath?.() || []).some(node => node.classList?.contains?.("quick"))) return;
        this.quickOpen = false; this.render();
      });
    }
  }
}

// PoliciesMixin: quality rules you switch on and the objects that break them; mixed into the panel in 99-register.js.
class PoliciesMixin {
  async loadPolicies() {
    this.policiesLoading = true; this.policiesError = ""; this.render();
    try { this.policies = await this._hass.callWS({ type: "ha_housekeeper/policies" }); }
    catch (err) { this.policiesError = err?.message || String(err); }
    this.policiesLoading = false; this.render();
  }

  // Loads on the first visit; the answer is computed from the last scan and needs no recorder.
  ensurePolicies() {
    if (this.policiesLoading || this._policiesRequested) return;
    this._policiesRequested = true;
    setTimeout(() => this.loadPolicies(), 0);
  }

  async changePolicy(call) {
    try { await this._hass.callWS(call); }
    catch (err) { this.policiesError = err?.message || String(err); }
    await this.loadPolicies();
  }

  addPolicyPrefix(domain, prefix) {
    domain = (domain || "").trim(); prefix = (prefix || "").trim();
    if (!domain || !prefix) return Promise.resolve();
    return this.changePolicy({ type: "ha_housekeeper/set_policy_prefix", domain, prefix });
  }

  removePolicyPrefix(domain) {
    return this.changePolicy({ type: "ha_housekeeper/set_policy_prefix", domain, prefix: "" });
  }

  polItemNote(item) {
    if (item.keep_days !== undefined) return `<small>${this.esc(this.t("polRetention", { days: item.keep_days, size: this.formatBytes(item.db_bytes) }))}</small>`;
    if (item.also?.length) return `<small>${this.esc(this.t(TEXT[this.lang]?.[`polAlso_${item.rule}`] ? `polAlso_${item.rule}` : "polAlso", { ids: item.also.join(", ") }))}</small>`;
    if (item.rate !== undefined) return `<small>${this.esc(this.t("polRate", { n: this.formatNumber(item.rate) }))}</small>`;
    if (item.expected) return `<small>${this.esc(this.t("polExpected", { prefix: item.expected }))}</small>`;
    return "";
  }

  // The prefix of each domain for the naming scheme: a row per prefix with a remove button, and a small form to add one.
  polPrefixEditor() {
    const entries = Object.entries(this.policies?.prefixes || {});
    const rows = entries.map(([domain, prefix]) => `<div class="row politem"><span class="tile mute"><ha-icon icon="mdi:format-letter-starts-with"></ha-icon></span><span class="row-text"><strong>${this.esc(domain)}</strong><small>${this.esc(this.t("polPrefixIs", { prefix }))}</small></span><button class="btn" data-policy-prefix-remove="${this.esc(domain)}">${this.t("polPrefixRemove")}</button></div>`).join("");
    const form = `<div class="row politem polform"><label class="sr-only" for="polDomain">${this.t("polPrefixDomain")}</label><input id="polDomain" type="text" placeholder="${this.esc(this.t("polPrefixDomain"))}" autocomplete="off" maxlength="40"><label class="sr-only" for="polPrefix">${this.t("polPrefixValue")}</label><input id="polPrefix" type="text" placeholder="${this.esc(this.t("polPrefixValue"))}" autocomplete="off" maxlength="30"><button class="btn" data-policy-prefix-add>${this.t("polPrefixAdd")}</button></div>`;
    return `${rows}${form}${entries.length ? "" : `<p class="factnote">${this.t("polPrefixNone")}</p>`}`;
  }

  // The daily limit of the state-changes rule and, while the load numbers are missing, why the rule shows nothing.
  polLimitEditor(rule) {
    const note = rule.pending ? `<p class="factnote">${this.t("polPending")}</p>` : "";
    return `<div class="row politem polform"><label for="polLimit">${this.t("polLimit")}</label><input id="polLimit" type="number" min="100" max="100000" step="100" value="${this.esc(String(this.policies?.limit ?? 5000))}"><button class="btn" data-policy-limit-save>${this.t("polLimitSave")}</button></div>${note}`;
  }

  setPolicyLimit(value) {
    const limit = Number.parseInt(value, 10);
    if (!Number.isFinite(limit)) return Promise.resolve();
    return this.changePolicy({ type: "ha_housekeeper/set_policy_limit", limit });
  }

  polItemRow(item) {
    const pill = item.ignored ? `<span class="pill mute">${this.t(item.by === "label" ? "polByLabel" : "polHiddenLabel")}</span>` : "";
    const due = item.resurfaced ? `<span class="pill warn">${this.t("dueLabel")}</span>` : "";
    const button = item.by === "label" ? ""
      : item.ignored ? `<button class="btn" data-policy-ignore="${this.esc(item.key)}" data-policy-value="0">${this.t("polShow")}</button>`
      : `<button class="btn" data-decide-open="${this.esc(item.key)}">${this.t("polHide")}</button>`;
    const decision = item.ignored && item.by === "user" ? `<small>${this.esc(this.decisionLabel(item))}</small>` : "";
    const form = this.decide?.key === item.key ? this.decideForm(item) : "";
    return `<div class="row politem"><span class="tile mute"><ha-icon icon="mdi:chevron-right"></ha-icon></span><span class="row-text">${item.object_type === "recorder" ? `<strong>${this.esc(item.name)}</strong>` : `<button class="linklike" data-object="${this.esc(`${item.object_type}:${item.object_id}`)}"><strong>${this.esc(item.name)}</strong></button>`}<small>${this.esc(item.object_id)}${item.rule ? ` · ${this.esc(this.t(`polRule_${item.rule}`))}` : ""}</small>${this.polItemNote(item)}${decision}</span>${due}${pill}${button}</div>${form}`;
  }

  // One rule on the "Rules" tab: what it checks, how many violations, and its switch.
  polRuleBlock(rule) {
    const state = !rule.enabled ? this.t("polOff") : rule.count === 1 ? this.t("polCountOne") : rule.count ? this.t("polCount", { n: this.formatNumber(rule.count) }) : this.t("polNone");
    const tone = !rule.enabled ? "mute" : rule.count ? "warn" : "ok";
    const toggle = `<input class="policyswitch" type="checkbox" role="switch" aria-label="${this.esc(this.t(`polRule_${rule.id}`))}" data-policy-toggle="${rule.id}" ${rule.enabled ? "checked" : ""}>`;
    const head = `<div class="row"><span class="tile ${tone}"><ha-icon icon="mdi:clipboard-check-outline"></ha-icon></span><span class="row-text"><strong>${this.t(`polRule_${rule.id}`)}</strong><small>${this.t(`polDesc_${rule.id}`)}</small></span><span class="pill ${tone}">${this.esc(state)}</span>${toggle}</div>`;
    const wait = rule.pending && rule.id !== "state_rate" ? `<p class="factnote">${this.t(rule.id === "recorder_retention" ? "polPendingDb" : "polPendingLoad")}</p>` : "";
    const extra = (rule.enabled && rule.id === "naming_scheme" ? this.polPrefixEditor() : rule.enabled && rule.id === "state_rate" ? this.polLimitEditor(rule) : "") + wait;
    return head + extra;
  }

  // The violations of all switched-on rules in one list: filter by rule, search, open the entity.
  polViolations(r) {
    const on = r.rules.filter(rule => rule.enabled);
    if (!on.length) return `<div class="panel"><div class="emptymsg"><ha-icon icon="mdi:toggle-switch-off-outline"></ha-icon>${this.t("polNoneOn")}</div></div>`;
    const wanted = on.some(rule => rule.id === this.polRule) ? this.polRule : "";
    const chip = (id, label, count) => `<button class="chip ${wanted === id ? "active" : ""}" data-pol-rule="${this.esc(id)}" aria-pressed="${wanted === id}">${this.esc(label)} <em>${this.formatNumber(count)}</em></button>`;
    const chips = `<div class="chips">${chip("", this.t("polAllRules"), on.reduce((n, rule) => n + rule.count, 0))}${on.map(rule => chip(rule.id, this.t(`polRule_${rule.id}`), rule.count)).join("")}</div>`;
    const items = on.filter(rule => !wanted || rule.id === wanted).flatMap(rule => rule.items.map(item => ({ ...item, rule: rule.id })))
      .filter(item => this.policyShowHidden || !item.ignored);
    const found = this.searchList("policies", items, item => [item.name, item.object_id, ...(item.also || [])].join(" "));
    const pg = this.paginate("polviol", found.rows);
    const rows = pg.rows.map(item => this.polItemRow(item)).join("");
    const hidden = on.reduce((n, rule) => n + (rule.ignored || 0), 0);
    const note = hidden && !this.policyShowHidden ? `<p class="factnote">${this.t("polHiddenN", { n: this.formatNumber(hidden) })}</p>` : "";
    const empty = !found.rows.length && !found.none ? `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("polNoViolations")}</div>` : "";
    return `<div class="panel">${chips}${found.bar}${found.none}${empty}${rows}${pg.footer}${note}</div>`;
  }

  policiesView() {
    this.ensurePolicies();
    const r = this.policies;
    const anyHidden = r?.rules?.some(rule => rule.ignored);
    const actions = `${anyHidden ? `<button class="btn" data-policy-hidden>${this.t(this.policyShowHidden ? "polHideHidden" : "polShowHidden")}</button>` : ""}<button class="btn" data-policy-refresh ${this.policiesLoading ? "disabled" : ""}>${this.t("relRefresh")}</button>`;
    const head = `<div class="panelhead"><div><h2>${this.t("polTitle")}</h2><p>${this.t("polHint")}</p></div><div class="actions">${actions}</div></div>`;
    if (this.policiesError) return `<div class="panel">${head}<div class="error">${this.esc(this.policiesError)}</div></div>`;
    if (!r) return `<div class="panel">${head}${this.skeleton("polLoading")}</div>`;
    const on = r.rules.filter(rule => rule.enabled);
    const violations = on.reduce((n, rule) => n + rule.count, 0);
    const hidden = on.reduce((n, rule) => n + (rule.ignored || 0), 0);
    const tabs = [
      { id: "rules", icon: "mdi:clipboard-list-outline", label: this.t("polTabRules"), hint: this.t("polTileRulesHint", { on: this.formatNumber(on.length) }), count: r.rules.length, tone: on.length ? "ok" : "mute" },
      { id: "violations", icon: "mdi:clipboard-alert-outline", label: this.t("polTabViolations"), hint: this.t("polTileViolationsHint"), count: violations, tone: !on.length ? "mute" : violations ? "warn" : "ok", pill: hidden ? this.t("polTileHidden", { n: this.formatNumber(hidden) }) : "", pillTone: "mute" },
    ];
    const open = this.viewTabOf("policies", tabs, violations ? "violations" : "rules");
    const body = open === "rules"
      ? `<div class="panel">${r.rules.map(rule => this.polRuleBlock(rule)).join("")}${on.length ? "" : `<p class="factnote">${this.t("polNoneOn")}</p>`}${this.howCounted("polFootnote")}</div>`
      : this.polViolations(r);
    return `<div class="stack"><div class="panel">${head}</div>${this.navTiles("policies", tabs, open, this.t("policies"))}${body}</div>`;
  }
}

// LayoutMixin: the pieces every long view shares (a row of key figures and tabs for its sections); mixed in by 99-register.js.
class LayoutMixin {
  // A row of key figures. tile: { label, value, sub, tone ("ok"|"warn"|"red"|"mute"), tab, filter } where tab ("view|id") makes it a button.
  sumTiles(tiles) {
    const cells = tiles.filter(Boolean).map(t => {
      const inner = `<span class="sumlabel">${this.esc(t.label)}</span><b class="sumvalue">${t.value}</b>${t.sub ? `<small>${t.sub}</small>` : ""}`;
      if (t.filter !== undefined) return `<button class="sumtile ${t.tone || "mute"}" data-finding-filter="${this.esc(t.filter)}" aria-pressed="${Boolean(t.active)}">${inner}</button>`;
      if (t.attr) return `<button class="sumtile ${t.tone || "mute"}" ${t.attr[0]}="${this.esc(t.attr[1])}" aria-pressed="${Boolean(t.active)}">${inner}</button>`;
      if (t.unref) return `<button class="sumtile ${t.tone || "mute"}" data-unref-tab="${t.unref}" aria-pressed="${Boolean(t.active)}">${inner}</button>`;
      if (t.inv !== undefined) return `<button class="sumtile ${t.tone || "mute"}" data-inv-filter="${this.esc(t.inv)}" aria-pressed="${Boolean(t.active)}">${inner}</button>`;
      return t.tab ? `<button class="sumtile ${t.tone || "mute"}" data-view-tab="${this.esc(t.tab)}">${inner}</button>` : `<div class="sumtile ${t.tone || "mute"}">${inner}</div>`;
    }).join("");
    return cells ? `<div class="sumtiles" role="group" aria-label="${this.esc(this.t("sumLabel"))}">${cells}</div>` : "";
  }

  // Tiles that switch between the areas of one view: icon, title, number and a short hint; the open one is marked.
  // tab: { id, icon, label, hint, count, tone, pill, pillTone, disabled }.
  navTiles(view, tabs, open, label) {
    const cells = tabs.map(t => {
      const tone = t.tone || "mute", has = t.count !== undefined && t.count !== null;
      const pills = `${has ? `<span class="pill ${tone}">${this.esc(this.formatNumber(t.count))}</span>` : ""}${t.pill ? `<span class="pill ${t.pillTone || tone}">${this.esc(t.pill)}</span>` : ""}`;
      const inner = `<ha-icon icon="${t.icon}"></ha-icon><strong>${this.esc(t.label)}</strong><span class="setpill">${pills}</span><small>${this.esc(t.hint || "")}</small>`;
      if (t.disabled) return `<div class="taskcard t-mute off" aria-disabled="true">${inner}</div>`;
      return `<button class="taskcard t-${tone}${t.id === open ? " on" : ""}" aria-pressed="${t.id === open}" data-view-tab="${this.esc(`${view}|${t.id}`)}">${inner}</button>`;
    }).join("");
    return `<div class="taskgrid compactgrid setgrid navtiles" role="group" aria-label="${this.esc(label)}">${cells}</div>`;
  }

  // The tab that is open in a view: the chosen one if it exists, else the first one of `tabs` or `prefer`.
  viewTabOf(view, tabs, prefer) {
    const chosen = (this.viewTab ||= {})[view];
    if (tabs.some(t => t.id === chosen)) return chosen;
    return tabs.some(t => t.id === prefer) ? prefer : tabs[0].id;
  }

  // Tabs of one view; a coloured dot marks a tab that holds something to look at. tab: { id, label, count, tone }.
  viewTabBar(view, tabs, active) {
    const list = tabs.map(t => `<button class="tab" role="tab" aria-selected="${t.id === active}" tabindex="${t.id === active ? 0 : -1}" data-view-tab="${this.esc(`${view}|${t.id}`)}">${this.esc(t.label)}${t.count !== undefined && t.count !== null ? ` <em>${this.formatNumber(t.count)}</em>` : ""}${t.tone && t.tone !== "ok" && t.tone !== "mute" ? `<i class="tabdot ${t.tone}" aria-hidden="true"></i>` : ""}</button>`).join("");
    return `<div class="tabs" role="tablist" aria-label="${this.esc(this.t("tabsLabel"))}">${list}</div>`;
  }

  pickViewTab(tab) {
    const [view, id] = String(tab || "").split("|");
    if (!view || !id) return;
    (this.viewTab ||= {})[view] = id;
    if (view === "cleanup") { this.cleanupSel = new Set(); if (this.lv?.cleanup) this.lv.cleanup.f = {}; this.pages = {}; }
    if (view === "unreferenced") { this.unrefTab = id; this.retryOrphanLast(); this.pages = {}; }
    this.render();
  }
}

// FlowMixin: the "Ablauf" tab of an automation or script: triggers, conditions and actions as a readable tree; mixed in by 99-register.js.
// The configuration is the one the detail request already delivers; nothing here reads Home Assistant.
const FLOW_NESTED = ["sequence", "then", "else", "default", "parallel", "conditions", "condition", "choose", "if", "repeat"];
const FLOW_LIMIT = 300;
const FLOW_DEPTH = 6;
const FLOW_REF_KEYS = ["entity_id", "device_id", "area_id", "floor_id", "label_id"];

class FlowMixin {
  // The concrete ids a block names itself (not what its nested blocks name): target, data and the block's own keys.
  flowRefs(step) {
    const out = [];
    const take = (type, value) => {
      for (const v of Array.isArray(value) ? value : [value]) {
        if (typeof v === "string" && v && !["all", "none"].includes(v) && !v.includes("{{") && !v.startsWith("!input")) out.push([type, v]);
      }
    };
    const walk = (node, depth) => {
      if (!node || typeof node !== "object" || Array.isArray(node) || depth > 3) return;
      for (const [k, v] of Object.entries(node)) {
        if (FLOW_NESTED.includes(k)) continue;
        if (FLOW_REF_KEYS.includes(k)) take(k.replace("_id", ""), v);
        else if (typeof v === "object") walk(v, depth + 1);
      }
    };
    walk(step, 0);
    return out;
  }

  flowType(step, kind) {
    if (!step || typeof step !== "object") return "unknown";
    if (kind === "trigger") return step.trigger || step.platform || "unknown";
    if (kind === "condition") return step.condition || "unknown";
    for (const key of ["choose", "if", "repeat", "parallel", "sequence", "wait_template", "wait_for_trigger", "delay", "variables", "stop", "event", "scene", "set_conversation_response"]) if (key in step) return key;
    if ("action" in step || "service" in step) return "action";
    if ("condition" in step) return "condition";
    if (step.device_id && step.domain && step.type) return "device";
    return "unknown";
  }

  flowLabel(type) { const key = `flow_${type}`; const text = this.t(key); return text === key ? type : text; }

  // One line of facts for a block, built from the keys people look for first.
  flowFacts(step, type) {
    const facts = [];
    const add = v => { if (v !== undefined && v !== null && v !== "" && typeof v !== "object") facts.push(String(v)); };
    if (step.alias) add(step.alias);
    if (type === "action") add(step.action || step.service);
    if (["state", "numeric_state"].includes(type)) { add(step.attribute); add(step.from !== undefined ? `${this.t("flowFrom")} ${step.from}` : ""); add(step.to !== undefined ? `${this.t("flowTo")} ${step.to}` : ""); add(step.state !== undefined ? `= ${Array.isArray(step.state) ? step.state.join(", ") : step.state}` : ""); add(step.above !== undefined ? `> ${step.above}` : ""); add(step.below !== undefined ? `< ${step.below}` : ""); }
    if (["time", "sun"].includes(type)) { add(step.at); add(step.event); add(step.after); add(step.before); add(step.offset); }
    if (type === "time_pattern") add([step.hours, step.minutes, step.seconds].filter(x => x !== undefined).join(":"));
    if (type === "event") add(step.event_type);
    if (type === "delay") add(typeof step.delay === "object" ? Object.entries(step.delay).map(([k, v]) => `${v} ${k}`).join(" ") : step.delay);
    if (type === "wait_template") add(this.t("flowTemplate"));
    if (type === "template") add(this.t("flowTemplate"));
    if (type === "repeat") { const r = step.repeat || {}; add(r.count !== undefined ? `${r.count}×` : r.while ? this.t("flowWhile") : r.until ? this.t("flowUntil") : r.for_each !== undefined ? this.t("flowForEach") : ""); }
    if (type === "choose") add(this.t("flowBranches", { n: (step.choose || []).length }));
    if (type === "stop") add(step.stop);
    if (type === "device") add(`${step.domain} · ${step.type}`);
    if (step.for !== undefined && type === "state") add(`${this.t("flowFor")} ${typeof step.for === "object" ? Object.values(step.for).join(":") : step.for}`);
    if (step.continue_on_error) add(this.t("flowContinueOnError"));
    if (step.enabled === false) add(this.t("flowDisabled"));
    return facts;
  }

  flowRefButton([type, id]) {
    const key = `${type}:${id}`, obj = this.findObject(key);
    return obj
      ? `<button class="chip flowref" data-object="${this.esc(key)}">${this.esc(obj.name || id)}</button>`
      : `<span class="chip flowref missing" title="${this.esc(id)}">${this.esc(id)} · ${this.t("missing")}</span>`;
  }

  // Locations of the findings of this object, with the root keys of the lists made equal ("actions" and "action").
  flowNormal(path) { return String(path).replace(/^(trigger|condition|action)s?(?=\/|$)/, "$1").replace(/\/conditions?\//g, "/condition/"); }

  // One block and what it contains. `ctx` carries the counter, the finding places and the kind of the list.
  flowNode(step, path, kind, depth, ctx) {
    if (ctx.count >= FLOW_LIMIT) { ctx.cut += 1; return ""; }
    ctx.count += 1;
    const type = this.flowType(step, kind);
    const refs = this.flowRefs(step);
    const broken = ctx.places.some(place => place.startsWith(this.flowNormal(path))) || refs.some(([t, id]) => !this.findObject(`${t}:${id}`));
    const facts = this.flowFacts(step, type).map(f => this.esc(f)).join(" · ");
    const head = `<span class="fhead"><ha-icon icon="${FLOW_ICONS[type] || "mdi:circle-small"}"></ha-icon><b>${this.esc(this.flowLabel(type))}</b>${facts ? `<span class="ffacts">${facts}</span>` : ""}${refs.map(r => this.flowRefButton(r)).join("")}<code class="fpath">${this.esc(path)}</code></span>`;
    const kids = depth >= FLOW_DEPTH ? "" : this.flowChildren(step, type, path, depth, ctx);
    const cls = `fstep${broken ? " broken" : ""}`;
    return kids ? `<details class="${cls}" open><summary>${head}</summary><div class="fkids">${kids}</div></details>` : `<div class="${cls}">${head}</div>`;
  }

  flowList(list, path, kind, depth, ctx) {
    return (Array.isArray(list) ? list : list ? [list] : []).map((step, i) => this.flowNode(step, `${path}/${i}`, kind, depth + 1, ctx)).join("");
  }

  flowGroup(label, body) { return body ? `<div class="fgroup"><small>${this.esc(label)}</small>${body}</div>` : ""; }

  flowChildren(step, type, path, depth, ctx) {
    if (type === "choose") {
      const branches = (step.choose || []).map((b, i) => `<div class="fbranch"><b>${this.t("flowBranch", { n: i + 1 })}</b>${this.flowGroup(this.t("flowIf"), this.flowList(b.conditions ?? b.condition, `${path}/choose/${i}/conditions`, "condition", depth + 1, ctx))}${this.flowGroup(this.t("flowThen"), this.flowList(b.sequence, `${path}/choose/${i}/sequence`, "action", depth + 1, ctx))}</div>`).join("");
      return branches + this.flowGroup(this.t("flowElse"), this.flowList(step.default, `${path}/default`, "action", depth, ctx));
    }
    if (type === "if") return this.flowGroup(this.t("flowIf"), this.flowList(step.if, `${path}/if`, "condition", depth, ctx)) + this.flowGroup(this.t("flowThen"), this.flowList(step.then, `${path}/then`, "action", depth, ctx)) + this.flowGroup(this.t("flowElse"), this.flowList(step.else, `${path}/else`, "action", depth, ctx));
    if (type === "repeat") { const r = step.repeat || {}; return this.flowList(r.sequence, `${path}/repeat/sequence`, "action", depth, ctx) + this.flowGroup(this.t("flowWhile"), this.flowList(r.while, `${path}/repeat/while`, "condition", depth, ctx)) + this.flowGroup(this.t("flowUntil"), this.flowList(r.until, `${path}/repeat/until`, "condition", depth, ctx)); }
    if (type === "parallel") return this.flowList(step.parallel, `${path}/parallel`, "action", depth, ctx);
    if (type === "sequence") return this.flowList(step.sequence, `${path}/sequence`, "action", depth, ctx);
    if (["and", "or", "not"].includes(type)) return this.flowList(step.conditions, `${path}/conditions`, "condition", depth, ctx);
    return "";
  }

  flowCard(item, key) {
    const script = item.object_type === "script";
    const places = (this.data?.findings || []).filter(f => this.findingKey(f) === key && !f.ignored).map(f => this.flowNormal(f.evidence?.[0]?.location || "")).filter(Boolean);
    const ctx = { count: 0, cut: 0, places };
    const root = script ? ["sequence"] : ["trigger", "condition", "action"];
    const blocks = script ? [["actions", item.actions, "sequence", "action"]] : [["triggers", item.triggers, "trigger", "trigger"], ["conditions", item.conditions, "condition", "condition"], ["actions", item.actions, "action", "action"]];
    const sections = blocks.map(([label, list, path, kind]) => {
      const body = this.flowList(list, root.length === 1 ? "sequence" : path, kind, 0, ctx);
      return `<section class="panel"><div class="panelhead"><h2>${this.t(label)} <em class="date">${this.formatNumber((list || []).length)}</em></h2></div><div class="fflow">${body || `<p class="factnote">${this.t(label === "conditions" ? "flowNoConditions" : "flowNone")}</p>`}</div></section>`;
    }).join("");
    const facts = [item.mode ? [this.t("flowMode"), item.mode] : null, item.max ? [this.t("flowMax"), item.max] : null].filter(Boolean).map(([k, v]) => `<span><small>${k}</small><b>${this.esc(String(v))}</b></span>`).join("");
    const cut = ctx.cut ? `<p class="factnote">${this.t("flowCut", { n: ctx.cut })}</p>` : "";
    return `<div class="stack">${facts ? `<div class="panel sumline">${facts}</div>` : ""}${sections}${cut}<p class="factnote">${this.t("flowNote")}</p></div>`;
  }
}

const FLOW_ICONS = {
  state: "mdi:toggle-switch-outline", numeric_state: "mdi:numeric", time: "mdi:clock-outline", time_pattern: "mdi:timer-sand", sun: "mdi:weather-sunny", event: "mdi:lightning-bolt-outline", template: "mdi:code-braces", webhook: "mdi:webhook", mqtt: "mdi:message-text-outline", homeassistant: "mdi:home-assistant", zone: "mdi:map-marker-outline", device: "mdi:devices", trigger: "mdi:flash-outline",
  action: "mdi:play-circle-outline", choose: "mdi:source-branch", if: "mdi:help-rhombus-outline", repeat: "mdi:repeat", parallel: "mdi:call-split", sequence: "mdi:format-list-numbered", wait_template: "mdi:timer-sand-empty", wait_for_trigger: "mdi:timer-sand-empty", delay: "mdi:timer-outline", variables: "mdi:variable", stop: "mdi:stop-circle-outline", scene: "mdi:palette-outline", and: "mdi:set-all", or: "mdi:set-merge", not: "mdi:not-equal-variant", condition: "mdi:filter-outline",
};

// CorrelationMixin: findings that began at about the time of an update or restart; mixed in by 99-register.js.
// Always worded "at about the same time as", never as a cause.
class CorrelationMixin {
  async loadCorrelations() {
    try { this.corr = await this._hass.callWS({ type: "ha_housekeeper/correlations" }); }
    catch (_) { this.corr = { groups: [], by_key: {} }; }
    this.render();
  }

  // Loads once, and again after every new scan.
  ensureCorrelations() {
    const key = this.data?.meta?.scanned_at || "";
    if (!this.data || (this._corrKey === key && this._corrRequested)) return;
    this._corrRequested = true; this._corrKey = key;
    setTimeout(() => this.loadCorrelations(), 0);
  }

  corrText(group) {
    const vars = { domain: this.esc(group.domain || ""), from: this.esc(group.from ?? ""), to: this.esc(group.to ?? "") };
    return this.t(`corr_${group.kind}`, vars);
  }

  // The sentence on one finding, or "" when it began with nothing the log knows.
  corrLine(key) {
    const id = this.corr?.by_key?.[key];
    const group = id && this.corr.groups.find(g => g.id === id);
    return group ? this.t("corrAfter", { what: this.corrText(group), when: this.formatDate(group.at) }) : "";
  }

  corrFindingCount() { return Object.keys(this.corr?.by_key || {}).length; }

  corrGroupsCard() {
    const groups = this.corr?.groups || [];
    if (!groups.length) return "";
    const rows = groups.map(g => {
      const names = g.keys.slice(0, 6).map(k => { const f = this.data.findings.find(x => x.key === k); return f ? (this.findObject(this.findingKey(f))?.name || f.object_id) : ""; }).filter(Boolean).map(n => this.esc(n)).join(", ");
      return `<div class="row rel"><span class="tile ${g.only_group ? "mute" : "warn"}"><ha-icon icon="${g.kind === "start" ? "mdi:restart" : g.kind === "plan" ? "mdi:broom" : g.kind === "purge" ? "mdi:database-remove" : "mdi:package-up"}"></ha-icon></span><span class="row-text"><strong>${this.corrText(g)}</strong><small>${this.esc(this.formatDate(g.at))}${names ? ` · ${names}` : ""}</small></span><span class="pill ${g.only_group ? "mute" : "warn"}">${this.t("corrCount", { n: this.formatNumber(g.total) })}</span></div>`;
    }).join("");
    return `<section class="panel" style="margin-bottom:14px"><div class="panelhead"><div><h2>${this.t("corrTitle")}</h2><p>${this.t("corrHint")}</p></div></div>${rows}</section>`;
  }
}

// LifecycleMixin: the "Verlauf" tab of a device and the list of removed devices in Maintenance; mixed in by 99-register.js.
// The steps come from the device registry, the journal and the last reliability numbers; the note is the person's own text.
class LifecycleMixin {
  async loadLifecycle(deviceId) {
    try { (this.life ||= new Map()).set(deviceId, await this._hass.callWS({ type: "ha_housekeeper/lifecycle", device_id: deviceId })); }
    catch (_) { (this.life ||= new Map()).set(deviceId, { steps: [], note: null, error: true }); }
    if (this.selected?.object_id === deviceId) this.render();
  }

  ensureLifecycle(deviceId) {
    this.life ||= new Map();
    if (this.life.has(deviceId) || (this._lifeAsked ||= new Set()).has(deviceId)) return;
    this._lifeAsked.add(deviceId);
    setTimeout(() => this.loadLifecycle(deviceId), 0);
  }

  async saveLifeNote(deviceId, text) {
    try { await this._hass.callWS({ type: "ha_housekeeper/lifecycle_note", device_id: deviceId, text }); }
    catch (err) { this.lifeError = err?.message || String(err); }
    this._lifeAsked?.delete(deviceId); this.life?.delete(deviceId);
    this._removedRequested = false; this.removed = null;
    this.ensureLifecycle(deviceId); this.render();
  }

  lifeStepText(step) {
    return this.t(`life_${step.kind}`, { from: this.esc(step.from ?? ""), to: this.esc(step.to ?? "") });
  }

  lifeCard(item) {
    const life = this.life?.get(item.object_id);
    const head = `<div class="panelhead"><div><h2>${this.t("lifeTab")}</h2><p>${this.t("lifeHint")}</p></div></div>`;
    if (!life) return `<section class="panel">${head}${this.skeleton("loading")}</section>`;
    const state = [this.statusLabel(item.status), life.unstable ? this.t(life.unstable === "flapping" ? "relFlapping" : "relUnstable") : ""].filter(Boolean).join(" · ");
    const rows = life.steps.map(s => `<div class="row rel"><span class="tile ${s.kind === "removed" ? "red" : s.kind === "quarantine" || s.kind === "disabled" ? "warn" : "mute"}"><ha-icon icon="${{ discovered: "mdi:magnify", quarantine: "mdi:timer-sand", disabled: "mdi:power-plug-off-outline", removed: "mdi:delete-outline", replaced: "mdi:swap-horizontal" }[s.kind] || "mdi:circle-small"}"></ha-icon></span><span class="row-text"><strong>${this.lifeStepText(s)}</strong><small>${this.esc(this.formatDate(s.at))}</small></span></div>`).join("");
    const now = `<div class="row rel"><span class="tile ${life.unstable ? "warn" : "ok"}"><ha-icon icon="mdi:flag-outline"></ha-icon></span><span class="row-text"><strong>${this.t("lifeNow")}</strong><small>${this.esc(state)}</small></span></div>`;
    const note = `<div class="pad"><label for="lifeNote">${this.t("lifeNote")}</label><textarea id="lifeNote" rows="2" maxlength="200" data-life-note="${this.esc(item.object_id)}" placeholder="${this.esc(this.t("lifeNotePlaceholder"))}">${this.esc(life.note?.text || "")}</textarea><div class="actions"><button class="btn" data-life-save="${this.esc(item.object_id)}">${this.t("lifeNoteSave")}</button></div>${this.lifeError ? `<div class="error">${this.esc(this.lifeError)}</div>` : ""}</div>`;
    return `<section class="panel">${head}${rows || `<p class="factnote">${this.t("lifeNone")}</p>`}${now}${note}</section>`;
  }

  // Devices that a plan removed or forgot; they no longer exist, so the journal is the only source.
  ensureRemoved() {
    if (this._removedRequested) return;
    this._removedRequested = true;
    setTimeout(async () => {
      try { this.removed = (await this._hass.callWS({ type: "ha_housekeeper/lifecycle" })).removed || []; } catch (_) { this.removed = []; }
      this.render();
    }, 0);
  }

  removedCard() {
    this.ensureRemoved();
    const head = `<div class="panelhead"><div><h2>${this.t("lifeRemovedTitle")}</h2><p>${this.t("lifeRemovedHint")}</p></div></div>`;
    if (!this.removed) return `<div class="panel">${head}${this.skeleton("loading")}</div>`;
    const rows = this.removed.map(d => `<div class="row rel"><span class="tile red"><ha-icon icon="mdi:delete-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(d.name || d.object_id)}</strong><small>${this.esc(this.t(d.kind === "forget_device" ? "lifeForgotten" : "life_removed"))} · ${this.esc(this.formatDate(d.at))}${d.note ? ` · ${this.esc(d.note)}` : ""}</small></span></div>`).join("");
    return `<div class="panel">${head}${rows || `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("lifeRemovedNone")}</div>`}</div>`;
  }
}

// WindowMixin: the maintenance window (experimental): a guided run through checks, one cleanup plan, a reload, a restart you do
// yourself and a comparison; mixed in by 99-register.js. It only chains steps that exist elsewhere and never restarts Home Assistant.
const WINDOW_STEPS = ["preflight", "baseline", "plan", "reload", "restart", "compare", "report"];

class WindowMixin {
  async loadWindow() {
    try { this.win = await this._hass.callWS({ type: "ha_housekeeper/window" }); } catch (_) { this.win = { enabled: false, state: null, current: null, error: true }; }
    this.render();
  }

  ensureWindow() {
    if (this._winRequested) return;
    this._winRequested = true;
    if (this.journal === null && !this._journalRequested) { this._journalRequested = true; this.loadJournal(); }
    setTimeout(() => this.loadWindow(), 0);
  }

  async windowSet(fields) {
    this.winError = "";
    try { this.win = await this._hass.callWS({ type: "ha_housekeeper/window_set", ...fields }); }
    catch (err) { this.winError = this.errText ? this.errText(err) : (err?.message || String(err)); }
    this.render();
    return !this.winError;
  }

  winStepLabel(step) { return this.t(`win_${step}`); }

  async winAct(name, arg) {
    this.winError = "";
    if (["enable", "disable", "clear"].includes(name)) { if (name === "clear") { this.winTargets = null; this.winCompared = false; } return this.windowSet({ action: name }); }
    if (name === "begin") return this.windowSet({ action: "begin", plan_id: arg });
    if (name === "preflight") { await this.loadPreflight(); return; }
    if (name === "next") return this.windowSet({ action: "advance", step: arg });
    if (name === "skip") return this.windowSet({ action: "advance", step: arg, skip: true });
    if (name === "baseline") { await this.loadPreflight("save"); return this.windowSet({ action: "advance", step: "baseline" }); }
    if (name === "plan") { this.noteJump("journal"); this.view = "journal"; await this.openPlan(arg); return; }
    if (name === "targets" || name === "reload") {
      try { this.winTargets = (await this._hass.callWS({ type: "ha_housekeeper/window_reload", execute: name === "reload" })).targets; }
      catch (err) { this.winError = err?.message || String(err); }
      if (name === "reload" && !this.winError) return this.windowSet({ action: "advance", step: "reload" });
      this.render(); return;
    }
    if (name === "compare") { await this.load(true); await this.loadPreflight(); this.winCompared = true; this.render(); return; }
    if (name === "report") { this.downloadText("maintenance-window.md", this.windowReport(), "text/markdown"); }
  }

  downloadText(name, text, type) {
    const url = URL.createObjectURL(new Blob([text], { type: `${type};charset=utf-8` }));
    const a = document.createElement("a");
    a.href = url; a.download = `ha-housekeeper-${name}`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // The report of the window as Markdown: the steps with their times, the plan and what changed since the saved state.
  windowReport() {
    const state = this.win?.state;
    if (!state) return "";
    const plan = (this.journal || []).find(p => p.plan_id === state.plan_id);
    const lines = [`# ${this.t("winTitle")}`, "", `${this.t("winStarted")}: ${this.formatDate(state.started_at)}`, ""];
    lines.push(`## ${this.t("winSteps")}`);
    for (const e of state.log) lines.push(`- ${this.winStepLabel(e.step)} · ${this.formatDate(e.at)}${e.note ? ` · ${e.note}` : ""}`);
    if (plan) lines.push("", `## ${this.t("winPlan")}`, `- ${this.t("planSummary", { total: plan.summary?.total ?? 0, ok: plan.summary?.ok ?? 0, review: plan.summary?.review ?? 0, blocked: plan.summary?.blocked ?? 0 })}`);
    const after = this.preflight?.after;
    if (after) {
      lines.push("", `## ${this.t("winAfter")}`);
      for (const [label, items] of [["pfNewRepairs", after.new_repairs], ["pfNewFailed", after.new_failed_entries], ["pfNewBroken", after.new_broken]]) lines.push(`- ${this.t(label)}: ${items.length}`);
      const inv = after.inventory || {};
      for (const [label, part] of [["newObjects", inv.new_objects], ["removedObjects", inv.removed_objects], ["statusChanges", inv.status_changes], ["newFindings", inv.new_findings], ["resolvedFindings", inv.resolved_findings]]) lines.push(`- ${this.t(label)}: ${part?.total ?? 0}`);
    }
    return `${lines.join("\n")}\n`;
  }

  winButton(label, name, arg = "", primary = false, disabled = false) {
    return `<button class="btn ${primary ? "primary" : ""}" data-win-act="${name}:${this.esc(arg)}" ${disabled ? "disabled" : ""}>${this.t(label)}</button>`;
  }

  // What the open step asks for.
  winStepBody(step, state) {
    const p = this.preflight;
    if (step === "preflight") return `<p class="factnote">${this.t("winPreflightHint")}</p>${p ? this.preflightRows(p.state, p.checks) : ""}<div class="actions">${this.winButton("winCheck", "preflight")}${this.winButton("winNext", "next", step, true, !p)}</div>`;
    if (step === "baseline") return `<p class="factnote">${this.t("winBaselineHint")}</p><div class="actions">${this.winButton("winSave", "baseline", "", true)}</div>`;
    if (step === "plan") return `<p class="factnote">${this.t("winPlanHint")}</p><div class="actions">${this.winButton("winOpenPlan", "plan", state.plan_id)}${this.winButton("winPlanDone", "next", step, true)}</div>`;
    if (step === "reload") {
      const list = this.winTargets ? (this.winTargets.length ? this.winTargets.map(x => `<div class="row rel"><span class="tile ${x.ok === false ? "red" : "mute"}"><ha-icon icon="mdi:reload"></ha-icon></span><span class="row-text"><strong>${this.esc(x.title)}</strong><small>${this.esc(x.domain)}${x.ok === false ? ` · ${this.esc(x.error || "")}` : ""}</small></span></div>`).join("") : `<p class="factnote">${this.t("winNoTargets")}</p>`) : "";
      return `<p class="factnote">${this.t("winReloadHint")}</p>${list}<div class="actions">${this.winButton("winShowTargets", "targets")}${this.winButton("winReload", "reload", "", true, !this.winTargets?.length)}${this.winButton("winSkip", "skip", step)}</div>`;
    }
    if (step === "restart") return `<p class="factnote">${this.t("winRestartHint")}</p><div class="actions">${this.winButton("winRestartSeen", "next", step, true)}${this.winButton("winSkip", "skip", step)}</div>`;
    if (step === "compare") return `<p class="factnote">${this.t("winCompareHint")}</p>${this.winCompared && p?.after ? this.preflightAfter(p.after) : ""}<div class="actions">${this.winButton("winCompare", "compare")}${this.winButton("winNext", "next", step, true, !this.winCompared)}</div>`;
    return `<p class="factnote">${this.t("winReportHint")}</p><div class="actions">${this.winButton("winDownload", "report", "", true)}${this.winButton("winClose", "clear")}</div>`;
  }

  windowCard() {
    this.ensureWindow();
    const head = `<div class="panelhead"><div><h2>${this.t("winTitle")} <span class="pill warn">${this.t("winExperimental")}</span></h2><p>${this.t("winHint")}</p></div></div>`;
    const w = this.win;
    if (!w) return `<div class="panel">${head}${this.skeleton("loading")}</div>`;
    const error = this.winError ? `<div class="error">${this.esc(this.winError)}</div>` : "";
    if (!w.enabled) return `<div class="panel">${head}<div class="pad"><p class="factnote">${this.t("winWarning")}</p><div class="actions">${this.winButton("winEnable", "enable", "", true)}</div>${error}</div></div>`;
    if (!w.state) {
      const plans = (this.journal || []).filter(plan => !plan.executed && plan.status === "dry_run");
      const rows = plans.map(plan => `<div class="row rel"><span class="tile mute"><ha-icon icon="mdi:clipboard-text-clock-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(this.formatDate(plan.created_at))}</strong><small>${this.t("planSummary", { total: plan.summary?.total ?? 0, ok: plan.summary?.ok ?? 0, review: plan.summary?.review ?? 0, blocked: plan.summary?.blocked ?? 0 })}</small></span>${this.winButton("winBegin", "begin", plan.plan_id, true)}</div>`).join("");
      return `<div class="panel">${head}<div class="pad"><p class="factnote">${this.t("winChoose")}</p></div>${rows || `<div class="emptymsg"><ha-icon icon="mdi:clipboard-outline"></ha-icon>${this.t("winNoPlans")}</div>`}<div class="pad"><div class="actions">${this.winButton("winDisable", "disable")}</div>${error}</div></div>`;
    }
    const open = w.current;
    const steps = WINDOW_STEPS.map(step => {
      const done = w.state.done.includes(step), current = step === open;
      const note = w.state.log.find(e => e.step === step)?.note;
      return `<div class="row rel"><span class="tile ${done ? "ok" : current ? "warn" : "mute"}"><ha-icon icon="${done ? "mdi:check" : current ? "mdi:arrow-right-bold" : "mdi:circle-outline"}"></ha-icon></span><span class="row-text"><strong>${this.winStepLabel(step)}</strong>${note ? `<small>${this.esc(note)}</small>` : ""}</span></div>${current ? `<div class="pad">${this.winStepBody(step, w.state)}</div>` : ""}`;
    }).join("");
    const after = w.state.done.includes("plan") ? this.t("winAfterPlan") : "";
    return `<div class="panel">${head}${steps}<div class="pad">${error}${after ? `<p class="factnote">${after}</p>` : ""}<div class="actions">${this.winButton(open ? "winAbort" : "winClose", "clear")}</div></div></div>`;
  }
}

// BlueprintsMixin: blueprints nothing uses and automations whose blueprint is gone; mixed into the panel in 99-register.js.
class BlueprintsMixin {
  ensureBlueprints() {
    if (this._blueprintsRequested) return;
    this._blueprintsRequested = true;
    setTimeout(async () => {
      try { this.blueprints = await this._hass.callWS({ type: "ha_housekeeper/blueprints" }); this.blueprintsError = ""; }
      catch (err) { this.blueprints = null; this.blueprintsError = err?.message || String(err); }
      this.render();
    }, 0);
  }

  blueprintsCount() { const b = this.blueprints; return b ? b.unused + b.missing + b.broken : null; }

  blueprintsCard() {
    this.ensureBlueprints();
    const head = `<div class="panelhead"><div><h2>${this.t("bpTitle")}</h2><p>${this.t("bpHint")}</p></div><div class="actions"><button class="btn" data-bp-refresh>${this.t("relRefresh")}</button></div></div>`;
    if (this.blueprintsError) return `<div class="panel">${head}<div class="error">${this.esc(this.blueprintsError)}</div></div>`;
    if (!this.blueprints) return `<div class="panel">${head}${this.skeleton("loading")}</div>`;
    const users = (b) => (b.users || []).map(u => {
      const obj = this.findObject(`${u.id.split(".")[0]}:${u.id}`);
      return obj ? `<button class="linklike" data-object="${this.esc(this.objectKey(obj))}">${this.esc(u.name)}</button>` : this.esc(u.name);
    }).join(", ") + (b.count > (b.users || []).length ? ` +${b.count - b.users.length}` : "");
    const row = (tone, icon, title, sub) => `<div class="row rel"><span class="tile ${tone}"><ha-icon icon="${icon}"></ha-icon></span><span class="row-text"><strong>${this.esc(title)}</strong><small>${sub}</small></span></div>`;
    const blocks = this.blueprints.domains.map(d => {
      const rows = [
        ...d.missing.map(b => row("red", "mdi:file-question-outline", b.path, `${this.t("bpMissing")} · ${users(b)}`)),
        ...d.broken.map(b => row("red", "mdi:file-alert-outline", b.path, `${this.t("bpBroken")}${b.count ? ` · ${users(b)}` : ""}`)),
        ...d.unused.map(b => row("mute", "mdi:file-hidden", b.name === b.path ? b.path : b.name, `${this.t("bpUnused")} · ${this.esc(b.path)}`)),
      ].join("");
      return `<div class="sectionlabel">${this.t(d.domain)} (${this.formatNumber(d.total)} ${this.t("bpFiles")})</div>${rows || `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("bpNone")}</div>`}`;
    }).join("");
    return `<div class="panel">${head}${blocks}</div>`;
  }
}

// Marks: what to expect of an entity or device (offline on purpose, seasonal, a spare, keep, replaced); mixed into the panel in 99-register.js.
Object.assign(TEXT.de, {
  markTitle: "Vermerk", markHint: "Sagt Housekeeper, was bei diesem Objekt zu erwarten ist. Nur in Housekeeper, Home Assistant bleibt unverändert. Ein Vermerk blendet „nicht verfügbar“ aus, nie eine kaputte Referenz.",
  markNone: "Kein Vermerk.", markSet: "Vermerk setzen", markChange: "Ändern", markClear: "Vermerk entfernen", markKind: "Art des Vermerks", markReason: "Begründung (optional)", markReview: "Prüfen in", markNever: "Nie", markTarget: "Ersetzt durch (Objekt-ID)", markDue: "Prüfdatum erreicht: die Befunde sind wieder sichtbar.", markReviewOn: "prüfen {date}", markBy: "Vermerk: {kind}", markFailed: "Der Vermerk konnte nicht gespeichert werden: {reason}",
  mark_expected_offline: "Absichtlich offline", mark_seasonal: "Saisonal", mark_spare: "Reservegerät", mark_keep: "Nicht entfernen", mark_replaced: "Wird ersetzt",
  markHiddenHint: "Ausgeblendet durch einen Vermerk am Objekt.", reason_marked_keep: "Trägt den Vermerk „Nicht entfernen“.",
});
Object.assign(TEXT.en, {
  markTitle: "Mark", markHint: "Tells Housekeeper what to expect of this object. Only in Housekeeper, Home Assistant stays unchanged. A mark hides “not available”, never a broken reference.",
  markNone: "No mark.", markSet: "Set a mark", markChange: "Change", markClear: "Remove mark", markKind: "Kind of mark", markReason: "Reason (optional)", markReview: "Review in", markNever: "Never", markTarget: "Replaced by (object ID)", markDue: "Review date reached: the findings are visible again.", markReviewOn: "review {date}", markBy: "Mark: {kind}", markFailed: "The mark could not be saved: {reason}",
  mark_expected_offline: "Offline on purpose", mark_seasonal: "Seasonal", mark_spare: "Spare device", mark_keep: "Do not remove", mark_replaced: "Being replaced",
  markHiddenHint: "Hidden by a mark on the object.", reason_marked_keep: "Carries the mark “Do not remove”.",
});

class MarksMixin {
  markLine(mark) {
    const until = mark.until ? ` · ${this.t("markReviewOn", { date: this.formatDate(mark.until) })}` : "";
    return `${this.t(`mark_${mark.kind}`)}${until}${mark.reason ? ` · ${mark.reason}` : ""}${mark.target ? ` → ${mark.target}` : ""}`;
  }

  markCard(item) {
    if (item.object_type !== "entity" && item.object_type !== "device") return "";
    const f = this.markForm, key = this.objectKey(item), mark = item.mark;
    const head = `<div class="panelhead"><div><h2>${this.t("markTitle")}</h2><p>${this.t("markHint")}</p></div></div>`;
    if (f && f.key === key) {
      const kinds = ["expected_offline", "seasonal", "spare", "keep", "replaced"].map(k => `<option value="${k}" ${f.kind === k ? "selected" : ""}>${this.t(`mark_${k}`)}</option>`).join("");
      const days = [0, 30, 90, 180, 365].map(n => `<option value="${n}" ${Number(f.days) === n ? "selected" : ""}>${n ? this.t("decideDays", { n }) : this.t("markNever")}</option>`).join("");
      const target = f.kind === "replaced" ? `<input data-mark-target maxlength="255" autocomplete="off" value="${this.esc(f.target)}" aria-label="${this.esc(this.t("markTarget"))}" placeholder="${this.esc(this.t("markTarget"))}">` : "";
      return `<section class="panel">${head}<form class="pad polform" data-mark-form="${this.esc(key)}"><select data-mark-kind aria-label="${this.esc(this.t("markKind"))}">${kinds}</select>
        <input data-mark-reason maxlength="200" autocomplete="off" value="${this.esc(f.reason)}" aria-label="${this.esc(this.t("markReason"))}" placeholder="${this.esc(this.t("markReason"))}">${target}
        <select data-mark-days aria-label="${this.esc(this.t("markReview"))}">${days}</select>
        <button type="submit" class="btn primary">${this.t("saveOptions")}</button><button type="button" class="btn quiet" data-mark-cancel>${this.t("cancelRun")}</button>
        ${f.error ? `<small class="error" role="alert">${this.esc(f.error)}</small>` : ""}</form></section>`;
    }
    const body = mark
      ? `<div class="row"><span class="tile ${item.mark_due ? "warn" : "mute"}"><ha-icon icon="mdi:bookmark-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(this.t(`mark_${mark.kind}`))}</strong><small>${this.esc(this.markLine(mark))}${item.mark_due ? ` · ${this.t("markDue")}` : ""}</small></span><button class="btn" data-mark-open="${this.esc(key)}">${this.t("markChange")}</button><button class="btn quiet" data-mark-clear="${this.esc(key)}">${this.t("markClear")}</button></div>`
      : `<div class="pad"><p class="factnote">${this.t("markNone")}</p><button class="btn" data-mark-open="${this.esc(key)}"><ha-icon icon="mdi:bookmark-plus-outline"></ha-icon>${this.t("markSet")}</button></div>`;
    return `<section class="panel">${head}${body}</section>`;
  }

  openMark(key) {
    const item = this.findObject(key), mark = item?.mark;
    this.markForm = { key, kind: mark?.kind || "expected_offline", reason: mark?.reason || "", days: 0, target: mark?.target || "", error: "" };
    this.render();
    this.shadowRoot?.querySelector?.("[data-mark-kind]")?.focus?.();
  }

  // The backend refreshes its cached snapshot; the panel fetches that copy, so no new scan is needed.
  async refreshData() {
    const key = this.selected ? this.objectKey(this.selected) : null;
    this.data = await this._hass.callWS({ type: "ha_housekeeper/inventory" });
    this._rev++;
    if (key) this.selected = this.findObject(key) || null;
  }

  async commitMark() {
    const f = this.markForm;
    if (!f) return;
    const [object_type, ...rest] = f.key.split(":");
    const msg = { type: "ha_housekeeper/mark_set", object_type, object_id: rest.join(":"), kind: f.kind, reason: f.reason.trim() };
    if (Number(f.days)) msg.days = Number(f.days);
    if (f.kind === "replaced" && f.target.trim()) msg.target = f.target.trim();
    try {
      await this._hass.callWS(msg);
      this.markForm = null;
      await this.refreshData();
    } catch (err) { f.error = this.t("markFailed", { reason: err?.message || String(err) }); }
    this.render();
  }

  async clearMark(key) {
    const [object_type, ...rest] = key.split(":");
    try {
      await this._hass.callWS({ type: "ha_housekeeper/mark_clear", object_type, object_id: rest.join(":") });
      await this.refreshData();
    } catch (err) { this.error = err?.message || String(err); }
    this.render();
  }

  bindMarks(root) {
    root.querySelectorAll("[data-mark-open]").forEach(el => el.onclick = () => this.openMark(el.dataset.markOpen));
    root.querySelectorAll("[data-mark-clear]").forEach(el => el.onclick = () => this.clearMark(el.dataset.markClear));
    root.querySelectorAll("[data-mark-cancel]").forEach(el => el.onclick = () => { this.markForm = null; this.render(); });
    root.querySelectorAll("[data-mark-form]").forEach(form => {
      form.onsubmit = ev => { ev.preventDefault(); this.commitMark(); };
      form.querySelector("[data-mark-kind]").onchange = ev => { this.markForm.kind = ev.target.value; this.render(); };
      form.querySelector("[data-mark-reason]").oninput = ev => { this.markForm.reason = ev.target.value; };
      form.querySelector("[data-mark-days]").onchange = ev => { this.markForm.days = Number(ev.target.value); };
      const target = form.querySelector("[data-mark-target]");
      if (target) target.oninput = ev => { this.markForm.target = ev.target.value; };
      form.onkeydown = ev => { if (ev.key === "Escape") { ev.preventDefault(); this.markForm = null; this.render(); } };
    });
  }
}

// Texts for the impact of a finding (see impact.py); merged into TEXT.
Object.assign(TEXT.de, {
  sortImpact: "Auswirkung", allImpacts: "Alle Auswirkungen", impact_high: "Hohe Auswirkung", impact_medium: "Mittlere Auswirkung", impact_low: "Geringe Auswirkung", impact_none: "Keine Auswirkung",
  impactFact_critical: "kritisch: {why}", impactFact_target_critical: "fehlendes Ziel {id} ist kritisch", impactFact_controls_critical: "steuert {n} kritische Objekte", impactFact_used_by_active: "von {n} aktiven Automationen oder Skripten genutzt", impactFact_on_dashboards: "auf {n} Dashboards", impactFact_many_dependents: "{n} Abhängige", impactFact_runs_active: "läuft aktiv", impactFact_runs_inactive: "ist deaktiviert",
  reason_critical_object: "Kritisches Objekt (Schloss, Alarm, Wasser- oder Rauchmelder, Label housekeeper_critical): bitte einzeln bestätigen.",
  impactWhy_label: "Label", impactWhy_device_label: "Label am Gerät", impactWhy_area_label: "Label am Bereich", impactWhy_kind: "Art des Objekts",
});
Object.assign(TEXT.en, {
  sortImpact: "Impact", allImpacts: "All impacts", impact_high: "High impact", impact_medium: "Medium impact", impact_low: "Low impact", impact_none: "No impact",
  impactFact_critical: "critical: {why}", impactFact_target_critical: "the missing target {id} is critical", impactFact_controls_critical: "controls {n} critical objects", impactFact_used_by_active: "used by {n} active automations or scripts", impactFact_on_dashboards: "on {n} dashboards", impactFact_many_dependents: "{n} dependents", impactFact_runs_active: "runs actively", impactFact_runs_inactive: "is disabled",
  reason_critical_object: "Critical object (lock, alarm, water or smoke sensor, label housekeeper_critical): confirm it on its own.",
  impactWhy_label: "label", impactWhy_device_label: "label on the device", impactWhy_area_label: "label on the area", impactWhy_kind: "kind of object",
});

// CausesMixin: one note for the common cause behind many "not available" findings (see causes.py).
class CausesMixin {
  causeList() { return this.data?.causes || []; }

  // Follow-up findings of a cause stay out of the list until asked for; the export keeps them.
  collapseFollowers(list) { return this.showFollowers ? list : list.filter(f => !f.cause_id); }

  causeLine(c) {
    const used = ["automation", "script", "dashboard"].filter(k => c.consumers?.[k]).map(k => this.t(`causeUses_${k}`, { n: c.consumers[k] }));
    const why = c.kind === "integration_down" ? [c.state ? this.t("causeState", { state: c.state }) : "", c.error || ""].filter(Boolean) : [];
    return [...why, ...used, c.impact && c.impact !== "none" ? this.t(`impact_${c.impact}`) : ""].filter(Boolean).join(" · ");
  }

  // One headline per cause with the counts of what it touches; the follow-up findings sit in a fold.
  causeCounts(c) {
    const parts = [this.t("causeN_entity", { n: this.formatNumber(c.follower_count) }), ...["automation", "script", "dashboard"].filter(k => c.consumers?.[k]).map(k => this.t(`causeN_${k}`, { n: c.consumers[k] }))];
    return this.t("causeCounts", { parts: parts.join(", ") });
  }

  causesCard() {
    const causes = this.causeList();
    if (!causes.length) return "";
    const followers = id => (this.data.findings || []).filter(f => f.cause_id === id && !f.ignored);
    const rows = causes.map(c => {
      const head = { tone: "red", title: this.esc(this.t(`cause_${c.kind}`, { name: c.name })), sub: [this.causeCounts(c), this.causeLine(c)].filter(Boolean).join(" · "), pill: this.t("causeFollowers", { n: this.formatNumber(c.follower_count) }) };
      const body = `<button class="row" data-object="${this.esc(`${c.object_type}:${c.object_id}`)}">${this.tile(c.object_type, "red")}<span class="row-text"><strong>${this.esc(c.name)}</strong></span></button>${followers(c.id).slice(0, 20).map(f => this.findingRow(f)).join("")}`;
      return this.fold(`cause_${c.id}`, head, body, false);
    }).join("");
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("causesTitle")}</h2><p>${this.t("causesSub")}</p></div></div>${rows}</div>`;
  }

  followerCount() { return this.data.findings.filter(f => f.cause_id && !f.ignored).length; }
}
Object.assign(TEXT.de, {
  causesTitle: "Gemeinsame Ursachen", causesSub: "Viele Befunde haben wahrscheinlich dieselbe Ursache. Beheb sie zuerst.",
  cause_integration_down: "Integration {name} ist nicht geladen", cause_device_down: "Gerät {name} ist ganz ausgefallen",
  causeFollowers: "{n} Folgebefunde", causeState: "Zustand: {state}", causeUses_automation: "{n} Automationen betroffen", causeUses_script: "{n} Skripte betroffen", causeUses_dashboard: "{n} Dashboards betroffen",
  causeShow: "Folgebefunde anzeigen", causeHide: "Folgebefunde ausblenden", actCauses: "Gemeinsame Ursachen", actCausesHint: "Ein Ausfall erklärt viele Befunde",
});
Object.assign(TEXT.en, {
  causesTitle: "Common causes", causesSub: "Many findings probably share one cause. Fix it first.",
  cause_integration_down: "Integration {name} is not loaded", cause_device_down: "Device {name} is down completely",
  causeFollowers: "{n} follow-up findings", causeState: "State: {state}", causeUses_automation: "{n} automations affected", causeUses_script: "{n} scripts affected", causeUses_dashboard: "{n} dashboards affected",
  causeShow: "Show follow-up findings", causeHide: "Hide follow-up findings", actCauses: "Common causes", actCausesHint: "One outage explains many findings",
});

// Maintenance goals: what "in order" means for this house and whether it is so (see goals.py); mixed into the panel in 99-register.js.
Object.assign(TEXT.de, {
  goalsTitle: "Wartungsziele", goalsSub: "Eigene Grenzen für das, was in Ordnung heißt. Housekeeper ändert nichts.", goalsSummary: "{met} erfüllt, {missed} verfehlt",
  goal_broken_references: "Defekte Referenzen", goal_unavailable: "Nicht verfügbare Entitäten", goal_backup_age: "Alter des letzten Backups", goal_restore_test_age: "Alter des Wiederherstellungstests", goal_recorder_growth: "Datenbankwachstum", goal_weak_batteries: "Schwache Batterien", goal_devices_without_area: "Geräte ohne Bereich",
  goalLimit: "höchstens {limit}", goalNow: "jetzt {value}", goalNever: "nie", goalNoBackup: "kein Backup", goalUnknownHint: "noch nicht messbar",
  goalState_met: "Erfüllt", goalState_missed: "Verfehlt", goalState_unknown: "Unbekannt", goalState_off: "Aus",
  goalUnit_mb_per_day: "{n} MB pro Tag", goalEdit: "Anpassen", goalLimitLabel: "Grenze", goalEnabled: "Ziel beachten", goalDefault: "Standard: {n}", goalFailed: "Nicht gespeichert: {reason}", goalSave: "Speichern", goalsAdjust: "Grenzen anpassen", goalsAllMet: "Alle {n} beachteten Ziele sind erreicht.",
});
Object.assign(TEXT.en, {
  goalsTitle: "Maintenance goals", goalsSub: "Your own limits for what in order means. Housekeeper changes nothing.", goalsSummary: "{met} met, {missed} missed",
  goal_broken_references: "Broken references", goal_unavailable: "Unavailable entities", goal_backup_age: "Age of the latest backup", goal_restore_test_age: "Age of the restore test", goal_recorder_growth: "Database growth", goal_weak_batteries: "Weak batteries", goal_devices_without_area: "Devices without an area",
  goalLimit: "at most {limit}", goalNow: "now {value}", goalNever: "never", goalNoBackup: "no backup", goalUnknownHint: "cannot be measured yet",
  goalState_met: "Met", goalState_missed: "Missed", goalState_unknown: "Unknown", goalState_off: "Off",
  goalUnit_mb_per_day: "{n} MB per day", goalEdit: "Adjust", goalLimitLabel: "Limit", goalEnabled: "Watch this goal", goalDefault: "Default: {n}", goalFailed: "Not saved: {reason}", goalSave: "Save", goalsAdjust: "Adjust limits", goalsAllMet: "All {n} watched goals are met.",
});

const GOAL_VIEWS = { broken_references: "findingsNav", unavailable: "findingsNav", backup_age: "maintenance", restore_test_age: "maintenance", recorder_growth: "recorder", weak_batteries: "inventory", devices_without_area: "policies" };
const GOAL_TONES = { met: "ok", missed: "red", unknown: "mute", off: "mute" };

class GoalsMixin {
  async loadGoals() {
    this.goalsLoading = true;
    try { this.goals = await this._hass.callWS({ type: "ha_housekeeper/goals" }); }
    catch (_) { this.goals = null; }
    this.goalsLoading = false; this.render();
  }

  // Loads once, and again after every new scan.
  ensureGoals() {
    const key = this.data?.meta?.scanned_at || "";
    if (this.goalsLoading || (this._goalsKey === key && this._goalsRequested)) return;
    this._goalsRequested = true; this._goalsKey = key;
    setTimeout(() => this.loadGoals(), 0);
  }

  goalAmount(g, n) {
    if (g.unit === "hours") return this.bhAge(n);
    if (g.unit === "days") return this.t("daysValue", { n });
    if (g.unit === "mb_per_day") return this.t("goalUnit_mb_per_day", { n: this.formatNumber(n) });
    return this.formatNumber(n);
  }

  goalNow(g) {
    if (g.never) return this.t(g.id === "backup_age" ? "goalNoBackup" : "goalNever");
    return g.value === null ? this.t("goalUnknownHint") : this.t("goalNow", { value: this.goalAmount(g, g.value) });
  }

  goalRow(g, editable = true) {
    const form = editable && this.goalForm?.id === g.id ? this.goalFormHtml(g) : "";
    const title = `<button class="linklike" data-jump="${GOAL_VIEWS[g.id]}"><strong>${this.t(`goal_${g.id}`)}</strong></button>`;
    return `<div class="row"><span class="tile ${GOAL_TONES[g.state]}"><ha-icon icon="${g.state === "met" ? "mdi:check-circle-outline" : g.state === "missed" ? "mdi:alert-circle-outline" : "mdi:help-circle-outline"}"></ha-icon></span><span class="row-text">${title}<small>${this.esc(this.goalNow(g))} · ${this.esc(this.t("goalLimit", { limit: this.goalAmount(g, g.limit) }))}</small></span><span class="pill ${GOAL_TONES[g.state]}">${this.t(`goalState_${g.state}`)}</span>${editable ? `<button class="btn quiet" data-goal-open="${g.id}">${this.t("goalEdit")}</button>` : ""}</div>${form}`;
  }

  goalFormHtml(g) {
    const f = this.goalForm;
    return `<form class="pad polform" data-goal-form="${g.id}"><label>${this.t("goalLimitLabel")} <input type="number" data-goal-limit min="0" step="1" value="${this.esc(String(f.limit))}"></label>
      <label><input type="checkbox" data-goal-enabled ${f.enabled ? "checked" : ""}> ${this.t("goalEnabled")}</label><small>${this.t("goalDefault", { n: this.goalAmount(g, g.default) })}</small>
      <button type="submit" class="btn primary">${this.t("goalSave")}</button><button type="button" class="btn quiet" data-goal-cancel>${this.t("cancelRun")}</button>
      ${f.error ? `<small class="error" role="alert">${this.esc(f.error)}</small>` : ""}</form>`;
  }

  // The overview shows only what is missed (or that all is met) and leads to the settings, where the limits are set.
  goalsCard(compact = false) {
    this.ensureGoals();
    const r = this.goals;
    if (!r?.goals?.length) return "";
    if (compact) {
      const missed = r.goals.filter(g => g.state === "missed");
      const body = missed.length ? missed.map(g => this.goalRow(g, false)).join("") : `<div class="pad"><small>${this.t("goalsAllMet", { n: r.met })}</small></div>`;
      return `<section class="panel" style="margin-bottom:14px" aria-labelledby="hk-goals"><div class="panelhead"><div><h2 id="hk-goals">${this.t("goalsTitle")}</h2></div><span class="date">${this.t("goalsSummary", { met: r.met, missed: r.missed })}</span><button class="btn quiet" data-goals-settings>${this.t("goalsAdjust")}</button></div>${body}</section>`;
    }
    return `<section class="panel" style="margin-bottom:14px" aria-labelledby="hk-goals"><div class="panelhead"><div><h2 id="hk-goals">${this.t("goalsTitle")}</h2><p>${this.t("goalsSub")}</p></div><span class="date">${this.t("goalsSummary", { met: r.met, missed: r.missed })}</span></div>${r.goals.map(g => this.goalRow(g)).join("")}</section>`;
  }

  openGoal(id) {
    const g = this.goals?.goals?.find(x => x.id === id);
    if (!g) return;
    this.goalForm = { id, limit: g.limit, enabled: g.enabled, error: "" };
    this.render();
    this.shadowRoot?.querySelector?.("[data-goal-limit]")?.focus?.();
  }

  async commitGoal() {
    const f = this.goalForm;
    if (!f) return;
    const limit = Number.parseInt(f.limit, 10);
    if (!Number.isFinite(limit)) { f.error = this.t("goalFailed", { reason: "?" }); this.render(); return; }
    try {
      await this._hass.callWS({ type: "ha_housekeeper/goal_set", goal: f.id, enabled: f.enabled, limit });
      this.goalForm = null;
      await this.loadGoals();
    } catch (err) { f.error = this.t("goalFailed", { reason: err?.message || String(err) }); this.render(); }
  }

  bindGoals(root) {
    root.querySelectorAll("[data-goals-settings]").forEach(el => el.onclick = () => { this.settingsTab = "goals"; this.noteJump?.("settings"); this.view = "settings"; this.selected = null; this.pages = {}; this.render(); });
    root.querySelectorAll("[data-goal-open]").forEach(el => el.onclick = () => this.openGoal(el.dataset.goalOpen));
    root.querySelectorAll("[data-goal-cancel]").forEach(el => el.onclick = () => { this.goalForm = null; this.render(); });
    root.querySelectorAll("[data-goal-form]").forEach(form => {
      form.onsubmit = ev => { ev.preventDefault(); this.commitGoal(); };
      form.querySelector("[data-goal-limit]").oninput = ev => { this.goalForm.limit = ev.target.value; };
      form.querySelector("[data-goal-enabled]").onchange = ev => { this.goalForm.enabled = ev.target.checked; };
      form.onkeydown = ev => { if (ev.key === "Escape") { ev.preventDefault(); this.goalForm = null; this.render(); } };
    });
  }
}

// Texts for the purge entries in the cleanup journal.
Object.assign(TEXT.de, {
  purgeJournal: "Gelöschte Statistiken", purgeJournalHint: "Ältere Löschungen von Recorder-Resten, aus der Zeit vor den Plänen. Neue Löschungen stehen als Plan im Journal.",
  purgeEntry: "{removed} gelöscht, {skipped} übersprungen", purgeWithStates: "mit Zuständen", purgeBackup: "Backup {job}", purgeNoBackup: "ohne Backup", purgeByYou: "von dir", purgeByOther: "von anderem Benutzer", purgeError: "Fehler: {error}", purgeNothing: "nichts gelöscht",
});
Object.assign(TEXT.en, {
  purgeJournal: "Deleted statistics", purgeJournalHint: "Older deletions of recorder leftovers, from before plans. New deletions appear as plans in the journal.",
  purgeEntry: "{removed} deleted, {skipped} skipped", purgeWithStates: "with states", purgeBackup: "backup {job}", purgeNoBackup: "no backup", purgeByYou: "by you", purgeByOther: "by another user", purgeError: "error: {error}", purgeNothing: "nothing deleted",
});
Object.assign(TEXT.de, {
  purgePreview: "Vorschau erstellen", purgePlanHint: "Daraus wird ein Plan unter Aufräumen: Vorschau, Bestätigung je ID, Backup, Nachprüfung.",
  reason_irreversible: "Nur per Backup umkehrbar.", reason_with_states: "Löscht auch die gespeicherten Zustände.", reason_entity_exists: "Eine Entität trägt diese ID wieder.", reason_not_orphaned: "Die ID ist keine verwaiste Statistik.", reason_in_energy: "Das Energie-Dashboard nutzt diese Statistik.",
  check_statistics_gone: "Statistik ist gelöscht", result_purged: "Gelöscht", undo_irreversible: "nicht rückgängig: nur mit dem Backup", confirmedSummaryPurge: "{count} Statistiken werden gelöscht. Vorher legt Housekeeper ein Home-Assistant-Backup an. Das lässt sich nur mit dem Backup zurücknehmen.",
  abort_recorder_busy: "Der Recorder war 30 Sekunden lang mit einer Abfrage belegt; nichts wurde gelöscht.", abort_still_there: "Die Statistik war nach dem Löschen noch da.",
});
Object.assign(TEXT.en, {
  purgePreview: "Create preview", purgePlanHint: "This becomes a plan under Cleanup: preview, confirmation per ID, backup, verification.",
  reason_irreversible: "Reversible only from the backup.", reason_with_states: "Also deletes the stored states.", reason_entity_exists: "An entity carries this ID again.", reason_not_orphaned: "The ID is not an orphaned statistic.", reason_in_energy: "The Energy dashboard uses this statistic.",
  check_statistics_gone: "Statistic is deleted", result_purged: "Deleted", undo_irreversible: "not undone: only with the backup", confirmedSummaryPurge: "{count} statistics will be deleted. Housekeeper creates a Home Assistant backup first. It can only be taken back with that backup.",
  abort_recorder_busy: "The recorder was busy with a query for 30 seconds; nothing was deleted.", abort_still_there: "The statistic was still there after deleting.",
});

// Device exchange, follow-up, audit report and end state simulation of a plan (see device_pairs.py, followup.py, audit_report.py, simulation.py); mixed into the panel in 99-register.js.
Object.assign(TEXT.de, {
  kindExchange: "Gerät austauschen",
  exTitle: "Gerät austauschen", exHint: "Wähle das alte und das neue Gerät. Housekeeper schlägt zu jeder alten Entität eine neue vor; nichts ist vorausgewählt. Was du bestätigst, wird eine normale Vorschau mit Backup, Prüfung und Rückgängig.",
  exOld: "Altes Gerät", exNew: "Neues Gerät", exPick: "Gerät wählen", exLoad: "Vorschläge laden", exLoading: "Lade …", exFailed: "Keine Vorschläge: {reason}",
  exNoPairs: "Das alte Gerät hat keine Entitäten.", exNoTarget: "Kein Ersatz", exSuggested: "Vorschlag", exUsed: "{count} Verwendungen", exUnused: "Nichts zu ersetzen",
  exHow: "Art", exHow_replace: "Referenzen ersetzen", exHow_both: "Zähler wechseln (Verlauf und ID)", exHow_statistics: "Zähler wechseln (nur Verlauf)", exHow_id: "Zähler wechseln (nur ID)",
  exChosen: "{count} Paare bestätigt", exCreate: "Vorschau für {count} Paare", exUnmatched: "Ohne Gegenstück am alten Gerät: {list}",
  exDisableOld: "Altes Gerät deaktivieren …", exDisableHint: "Erst nach dem Austausch. Das geht nur, wenn am alten Gerät nichts mehr funktioniert und nichts mehr darauf verweist.",
  exReason_same_class: "gleiche Geräteklasse", exReason_same_unit: "gleiche Einheit", exReason_same_state_class: "gleiche Zustandsklasse", exReason_same_area: "gleicher Bereich", exReason_similar_name: "ähnlicher Name", exReason_same_id_tail: "gleiche ID-Endung",
  fuWatching: "Nachkontrolle läuft bis {date}", fuClean: "Nachkontrolle bestanden: bis {date} nichts Neues", fuRegression: "Nachkontrolle: {count} neue Funde seit {date}", fuStopped: "Nachkontrolle beendet (Plan rückgängig gemacht)",
  fu_watching: "Beobachtet", fu_clean: "Sauber", fu_regression: "Rückfall", fu_stopped: "Beendet",
  fu_class_broken_reference: "defekte Referenz", fu_class_unavailable: "nicht verfügbar", fu_class_recurring: "Gerät kehrt wieder",
  actFollowup: "Nachkontrolle meldet neue Funde", actFollowupHint: "Nach einem Bereinigungsplan sind neue Probleme aufgetreten.",
  reportButton: "Prüfbericht", reportNames: "Echte Namen und IDs verwenden", reportNamesHint: "Ohne Haken ersetzen Platzhalter alle Namen und IDs. So kannst du den Bericht teilen, ohne etwas preiszugeben.", reportDownload: "Herunterladen", reportCopy: "Kopieren", reportCopied: "Kopiert", reportFailed: "Bericht nicht erstellt: {reason}", reportAnonymous: "IDs und Namen sind durch Platzhalter ersetzt.",
  simPurgeRows: "{count} Zeilen im Recorder werden entfernt (Datei schrumpft erst nach einem Repack)", simKeptRows: "{count} Zeilen Verlauf bleiben im Recorder, bis er sie bereinigt",
  simTitle: "Erwarteter Endzustand", simPurged: "{count} Statistiken werden gelöscht (nur per Backup umkehrbar)",
  simRemoved: "{count} Entitäten entfernt ({devices} Geräte)", simDisabled: "{count} Entitäten deaktiviert ({devices} Geräte)", simReplaced: "{count} Referenzen ersetzt", simMeters: "{count} Zählerwechsel",
  simCertain: "{count} sichere Verwendungen bleiben bestehen", simUncertain: "{count} unsichere oder manuelle Verwendungen bleiben bestehen", simOrphaned: "{count} Statistiken voraussichtlich verwaist", simBlocked: "{count} Aktionen laufen nicht",
  simLimits: "Grenzen: Verweise in Vorlagen und außerhalb von Home Assistant sind nicht sicher prüfbar; eine Speicherersparnis wird nicht geschätzt.",
});
Object.assign(TEXT.en, {
  kindExchange: "Exchange device",
  exTitle: "Exchange device", exHint: "Pick the old and the new device. Housekeeper proposes a new entity for each old one; nothing is preselected. What you confirm becomes an ordinary preview with backup, verification and undo.",
  exOld: "Old device", exNew: "New device", exPick: "Pick a device", exLoad: "Load proposals", exLoading: "Loading …", exFailed: "No proposals: {reason}",
  exNoPairs: "The old device has no entities.", exNoTarget: "No replacement", exSuggested: "suggested", exUsed: "{count} uses", exUnused: "Nothing to replace",
  exHow: "Kind", exHow_replace: "Replace references", exHow_both: "Switch meter (history and ID)", exHow_statistics: "Switch meter (history only)", exHow_id: "Switch meter (ID only)",
  exChosen: "{count} pairs confirmed", exCreate: "Preview for {count} pairs", exUnmatched: "Without a counterpart on the old device: {list}",
  exDisableOld: "Disable old device …", exDisableHint: "Only after the exchange. It works only when nothing on the old device works any more and nothing refers to it.",
  exReason_same_class: "same device class", exReason_same_unit: "same unit", exReason_same_state_class: "same state class", exReason_same_area: "same area", exReason_similar_name: "similar name", exReason_same_id_tail: "same ID ending",
  fuWatching: "Follow-up running until {date}", fuClean: "Follow-up passed: nothing new until {date}", fuRegression: "Follow-up: {count} new findings since {date}", fuStopped: "Follow-up ended (plan undone)",
  fu_watching: "Watching", fu_clean: "Clean", fu_regression: "Regression", fu_stopped: "Ended",
  fu_class_broken_reference: "broken reference", fu_class_unavailable: "unavailable", fu_class_recurring: "device came back",
  actFollowup: "Follow-up reports new findings", actFollowupHint: "New problems appeared after a cleanup plan.",
  reportButton: "Audit report", reportNames: "Use real names and IDs", reportNamesHint: "Without the tick, placeholders replace all names and IDs, so you can share the report without giving anything away.", reportDownload: "Download", reportCopy: "Copy", reportCopied: "Copied", reportFailed: "Report not created: {reason}", reportAnonymous: "IDs and names are replaced by placeholders.",
  simPurgeRows: "{count} recorder rows will be removed (the file only shrinks after a repack)", simKeptRows: "{count} history rows stay in the recorder until it cleans them up",
  simTitle: "Expected end state", simPurged: "{count} statistics will be deleted (reversible only from the backup)",
  simRemoved: "{count} entities removed ({devices} devices)", simDisabled: "{count} entities disabled ({devices} devices)", simReplaced: "{count} references replaced", simMeters: "{count} meter switches",
  simCertain: "{count} certain uses remain", simUncertain: "{count} uncertain or manual uses remain", simOrphaned: "{count} statistics likely orphaned", simBlocked: "{count} actions will not run",
  simLimits: "Limits: references inside templates and outside Home Assistant cannot be checked for certain; saved storage is not estimated.",
});

const EXCHANGE_HOW = ["replace", "both", "statistics", "id"];

class ExchangeMixin {
  exchangeState() {
    return (this.ex ||= { oldDev: "", newDev: "", result: null, choices: {}, loading: false, error: "", planned: "" });
  }

  deviceOptions(selected, skip) {
    const devices = this.data.objects.filter(o => o.object_type === "device" && o.object_id !== skip).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 2000);
    return `<option value="">${this.t("exPick")}</option>${devices.map(o => `<option value="${this.esc(o.object_id)}" ${o.object_id === selected ? "selected" : ""}>${this.esc(o.name)}</option>`).join("")}`;
  }

  async loadPairs() {
    const ex = this.exchangeState();
    if (!ex.oldDev || !ex.newDev || ex.loading) return;
    ex.loading = true; ex.error = ""; ex.choices = {}; this.render();
    try { ex.result = await this._hass.callWS({ type: "ha_housekeeper/device_pairs", old_device_id: ex.oldDev, new_device_id: ex.newDev }); }
    catch (err) { ex.result = null; ex.error = this.t("exFailed", { reason: err?.message || String(err) }); }
    ex.loading = false; this.render();
  }

  // Only what the person chose becomes an action: a pair without a chosen target is left out.
  exchangeActions() {
    const ex = this.exchangeState();
    return Object.entries(ex.choices).filter(([, c]) => c.target).map(([object_id, c]) => (c.how && c.how !== "replace"
      ? { kind: "migrate_meter", object_id, target: c.target, mode: c.how }
      : { kind: "replace_references", object_id, target: c.target }));
  }

  async createExchangePlan() {
    const actions = this.exchangeActions();
    if (!actions.length) return;
    this.cleanupBusy = true; this.cleanupError = ""; this.render();
    try {
      const plan = await this._hass.callWS({ type: "ha_housekeeper/plan_create", actions });
      this.plan = plan; this.confirmation = null; this.ack = new Set(); this.confirmWord = "";
      this.journal = [plan, ...(this.journal || [])];
      this.exchangeState().planned = this.exchangeState().oldDev;
    } catch (err) { this.cleanupError = err?.message || String(err); }
    this.cleanupBusy = false; this.render();
  }

  pairRow(pair) {
    const ex = this.exchangeState(), choice = ex.choices[pair.object_id] || {};
    const candidates = pair.candidates.map((c, i) => {
      const why = c.reasons.map(r => this.t(`exReason_${r}`)).join(", ");
      return `<option value="${this.esc(c.object_id)}" ${choice.target === c.object_id ? "selected" : ""}>${this.esc(c.name)} (${this.esc(c.object_id)})${i === 0 && c.score > 0 ? ` · ${this.t("exSuggested")}` : ""}${why ? ` · ${this.esc(why)}` : ""}</option>`;
    }).join("");
    const locked = !pair.used && !pair.meter;
    const how = choice.target && pair.meter ? `<select data-ex-how="${this.esc(pair.object_id)}" aria-label="${this.t("exHow")}">${EXCHANGE_HOW.map(h => `<option value="${h}" ${(choice.how || "replace") === h ? "selected" : ""}>${this.t(`exHow_${h}`)}</option>`).join("")}</select>` : "";
    return `<div class="row"><span class="row-text"><strong>${this.esc(pair.name)}</strong><small>${this.esc(pair.object_id)} · ${this.esc(pair.used ? this.t("exUsed", { count: pair.used }) : this.t("exUnused"))}</small></span>
      <span style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><select data-ex-target="${this.esc(pair.object_id)}" aria-label="${this.esc(pair.name)}" ${locked ? "disabled" : ""}><option value="">${this.t("exNoTarget")}</option>${candidates}</select>${how}</span></div>`;
  }

  exchangeCard() {
    const ex = this.exchangeState(), chosen = this.exchangeActions().length;
    const planDone = ["executed", "verified"].includes(this.plan?.status) && ex.planned && ex.planned === ex.oldDev;
    const rows = ex.result ? (ex.result.pairs.length ? ex.result.pairs.map(p => this.pairRow(p)).join("") : `<div class="emptymsg">${this.t("exNoPairs")}</div>`) : "";
    const unmatched = ex.result?.unmatched_new?.length ? `<p class="factnote">${this.t("exUnmatched", { list: this.esc(ex.result.unmatched_new.slice(0, 10).join(", ")) })}</p>` : "";
    const create = ex.result ? `<div class="setrow planfoot"><small style="margin:0">${this.t("exChosen", { count: chosen })} · ${this.t("cleanupDryRun")}</small><button class="btn primary" data-ex-create ${chosen && !this.cleanupBusy ? "" : "disabled"}>${this.cleanupBusy ? this.t("planCreating") : this.t("exCreate", { count: chosen })}</button></div>` : "";
    const disable = planDone ? `<div class="setrow planfoot"><small style="margin:0">${this.t("exDisableHint")}</small><button class="btn" data-ex-disable>${this.t("exDisableOld")}</button></div>` : "";
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("exTitle")}</h2><p>${this.t("exHint")}</p></div><div class="actions">${this.kindSelect()}</div></div>
      <div class="setrow"><div><label>${this.t("exOld")}</label></div><select data-ex-old style="max-width:360px">${this.deviceOptions(ex.oldDev, ex.newDev)}</select></div>
      <div class="setrow"><div><label>${this.t("exNew")}</label></div><select data-ex-new style="max-width:360px">${this.deviceOptions(ex.newDev, ex.oldDev)}</select></div>
      <div class="setrow planfoot"><small style="margin:0">${this.esc(ex.error)}</small><button class="btn" data-ex-load ${ex.oldDev && ex.newDev && !ex.loading ? "" : "disabled"}>${ex.loading ? this.t("exLoading") : this.t("exLoad")}</button></div>
      ${rows}${unmatched}${create}${disable}</div>`;
  }

  bindExchange(root) {
    const ex = () => this.exchangeState();
    root.querySelector("[data-ex-old]")?.addEventListener("change", e => { ex().oldDev = e.target.value; ex().result = null; ex().choices = {}; this.render(); });
    root.querySelector("[data-ex-new]")?.addEventListener("change", e => { ex().newDev = e.target.value; ex().result = null; ex().choices = {}; this.render(); });
    root.querySelector("[data-ex-load]")?.addEventListener("click", () => this.loadPairs());
    root.querySelector("[data-ex-create]")?.addEventListener("click", () => this.createExchangePlan());
    root.querySelectorAll("[data-ex-target]").forEach(el => el.onchange = () => { const id = el.dataset.exTarget; ex().choices[id] = { ...(ex().choices[id] || {}), target: el.value }; this.render(); });
    root.querySelectorAll("[data-ex-how]").forEach(el => el.onchange = () => { const id = el.dataset.exHow; ex().choices[id] = { ...(ex().choices[id] || {}), how: el.value }; this.render(); });
    root.querySelector("[data-ex-disable]")?.addEventListener("click", () => { this.cleanupKind = "disable_device"; this.cleanupSel = new Set([ex().oldDev]); this.view = "cleanup"; (this.viewTab ||= {}).cleanup = "devices"; this.render(); });
    root.querySelectorAll("[data-report]").forEach(el => el.onclick = () => this.loadReport(el.dataset.report));
    root.querySelector("[data-report-names]")?.addEventListener("change", e => { this.reportClear = e.target.checked; if (this.report) this.loadReport(this.report.plan_id); else this.render(); });
    root.querySelector("[data-report-download]")?.addEventListener("click", () => this.downloadReport());
    root.querySelector("[data-report-copy]")?.addEventListener("click", () => this.copyReport());
  }

  // -- follow-up --------------------------------------------------------------------------

  followupLine(plan) {
    const f = plan.followup;
    if (!f) return "";
    const key = { watching: "fuWatching", clean: "fuClean", regression: "fuRegression", stopped: "fuStopped" }[f.state];
    const date = this.formatDate(f.state === "watching" ? f.until : f.at || f.until);
    const items = (f.new || []).map(n => `<small style="display:block">${this.esc(this.t(`fu_class_${n.classification}`))}: ${this.esc(n.object_id)}</small>`).join("");
    return `<p class="factnote"><span class="pill ${this.followupTone(f.state)}">${this.t(`fu_${f.state}`)}</span> ${this.esc(this.t(key, { date, count: f.new_count ?? 0 }))}${items}</p>`;
  }

  followupTone(state) { return { watching: "mute", clean: "ok", regression: "red", stopped: "mute" }[state] || "mute"; }

  // -- audit report -----------------------------------------------------------------------

  async loadReport(planId) {
    try {
      const reply = await this._hass.callWS({ type: "ha_housekeeper/plan_report", plan_id: planId, anonymize: !this.reportClear, lang: this.lang });
      this.report = { plan_id: planId, ...reply }; this.reportMessage = "";
    } catch (err) { this.report = null; this.reportMessage = this.t("reportFailed", { reason: err?.message || String(err) }); }
    this.render();
  }

  downloadReport() {
    if (!this.report || typeof document === "undefined") return;
    const url = URL.createObjectURL(new Blob([this.report.markdown], { type: "text/markdown" }));
    const link = document.createElement("a");
    link.href = url; link.download = this.report.filename; link.click();
    URL.revokeObjectURL(url);
  }

  async copyReport() {
    try { await navigator.clipboard.writeText(this.report.markdown); this.reportMessage = this.t("reportCopied"); }
    catch (err) { this.reportMessage = this.t("reportFailed", { reason: err?.message || String(err) }); }
    this.render();
  }

  reportBlock(plan) {
    const shown = this.report?.plan_id === plan.plan_id ? this.report : null;
    const body = shown ? `<div class="reportbox"><div class="reporthead"><strong><ha-icon icon="mdi:file-document-outline"></ha-icon>${this.t("reportTitle")}</strong><span class="reportbtns"><button class="btn accent" data-report-copy><ha-icon icon="mdi:content-copy"></ha-icon>${this.t("reportCopy")}</button><button class="btn accent" data-report-download><ha-icon icon="mdi:download"></ha-icon>${this.t("reportDownload")}</button></span></div><pre class="reportpre">${this.esc(shown.markdown)}</pre>${shown.anonymized || this.reportMessage ? `<p class="reportnote">${this.esc(shown.anonymized ? this.t("reportAnonymous") : "")} ${this.esc(this.reportMessage || "")}</p>` : ""}</div>` : (this.reportMessage ? `<small class="error">${this.esc(this.reportMessage)}</small>` : "");
    return `<div class="setrow planfoot"><label class="factnote reportopt"><input type="checkbox" data-report-names ${this.reportClear ? "checked" : ""}><span><strong>${this.t("reportNames")}</strong><small>${this.t("reportNamesHint")}</small></span></label><button class="btn accent" data-report="${this.esc(plan.plan_id)}"><ha-icon icon="mdi:file-document-outline"></ha-icon>${this.t("reportButton")}</button></div>${body}`;
  }

  // -- end state simulation ---------------------------------------------------------------

  simulationBlock(plan) {
    const s = plan.simulation;
    if (!s) return "";
    const lines = [];
    if (s.removed) lines.push(this.t("simRemoved", { count: s.removed, devices: s.removed_devices }));
    if (s.disabled) lines.push(this.t("simDisabled", { count: s.disabled, devices: s.disabled_devices }));
    if (s.replaced) lines.push(this.t("simReplaced", { count: s.replaced }) + (s.replaced_by_source.length ? ` (${s.replaced_by_source.slice(0, 5).map(r => `${r.name}: ${r.count}`).join(", ")})` : ""));
    if (s.meters) lines.push(this.t("simMeters", { count: s.meters }));
    if (s.repaired) lines.push(this.t("simRepaired", { count: s.repaired }));
    if (s.purged) lines.push(this.t("simPurged", { count: s.purged }));
    lines.push(this.t("simCertain", { count: s.remaining_certain }), this.t("simUncertain", { count: s.remaining_uncertain }));
    if (s.statistics_orphaned_count) lines.push(this.t("simOrphaned", { count: s.statistics_orphaned_count }));
    if (s.rows_counted) { if (s.purge_rows) lines.push(this.t("simPurgeRows", { count: this.formatNumber(s.purge_rows) })); if (s.history_rows_kept) lines.push(this.t("simKeptRows", { count: this.formatNumber(s.history_rows_kept) })); }
    if (s.blocked) lines.push(this.t("simBlocked", { count: s.blocked }));
    return `<div class="simbox"><details ${plan.status === "dry_run" ? "open" : ""}><summary>${this.t("simTitle")}</summary><ul class="simlist">${lines.map(l => `<li>${this.esc(l)}</li>`).join("")}</ul><p class="simlimits">${this.t("simLimits")}</p></details></div>`;
  }
}

// Automation diagnostics: quality dimensions, success criteria, coverage, trace comparison and the dry run (see quality.py, criteria.py, coverage.py, trace_compare.py, dry_run.py); mixed into the panel in 99-register.js.
Object.assign(TEXT.de, {
  qualityTab: "Qualität", runsTabRuns: "Läufe",
  qualityHint: "Sieben getrennte Blickwinkel je Automation, bewusst ohne Gesamtnote. „Unbekannt“ heißt: dazu gibt es noch nichts zu beurteilen.",
  qualityLoading: "Die Qualität wird zusammengestellt …", qualityNone: "Keine Automationen gefunden.", qualityRefresh: "Neu berechnen",
  dim_integrity: "Integrität", dim_reliability: "Zuverlässigkeit", dim_effectiveness: "Wirksamkeit", dim_maintainability: "Wartbarkeit", dim_restart_safety: "Restart-Festigkeit", dim_efficiency: "Effizienz", dim_conflicts: "Konflikte",
  ql_ok: "In Ordnung", ql_info: "Hinweis", ql_warn: "Prüfen", ql_red: "Problem", ql_unknown: "Unbekannt",
  dr_broken: "{count} defekte Referenzen", dr_stale_targets: "{count} Ziele sind deaktiviert oder nicht verfügbar", dr_runs: "{count} Läufe ohne Auffälligkeit", dr_no_runs: "Noch keine Läufe beobachtet",
  dr_no_criteria: "Kein Erfolgskriterium definiert", dr_not_yet_checked: "Noch nicht ausgelöst, seit es ein Kriterium gibt", dr_missed: "{missed} verfehlt, {ok} erreicht (7 Tage)", dr_reached: "{ok} erreicht (7 Tage)",
  dr_no_description: "Keine Beschreibung", dr_large: "Groß: viele Trigger oder Aktionen", dr_deep: "Tief verschachtelt", dr_no_config: "Konfiguration nicht lesbar", dr_no_effect: "Läufe enden meist an Bedingungen", dr_conflict: "{count} mögliche Konflikte",
  dr_failing: "Viele Fehler", dr_never_ok: "Nie erfolgreich", dr_overlap: "Läufe überschneiden sich", dr_burst: "Ungewöhnlich oft", dr_long_run: "Ungewöhnlich lange Läufe", dr_after_update: "Mehr Fehler seit einem Update", dr_long_wait: "Lange Wartezeit", dr_wait_no_timeout: "Warten ohne Timeout",
  diagOpen: "Details", diagClose: "Schließen", diagFor: "Diagnose: {name}",
  critTitle: "Erfolgskriterien", critHint: "Du legst fest, was die Automation erreichen soll. Nach jeder Auslösung wird einmal nach der Frist geprüft. Gespeichert werden nur Zähler.",
  critType: "Art", critTypeState: "Zielzustand", critTypeCall: "Dienst aufgerufen", critService: "Dienst", critCallLine: "ruft {service} auf",
  critCallHint: "Erreicht, wenn genau dieser Lauf der Automation den Dienst aufruft (Benachrichtigung oder Skript). Aufrufe aus anderen Quellen zählen nie.",
  critNone: "Kein Kriterium definiert.", critEdit: "Bearbeiten", critAdd: "Kriterium hinzufügen", critAddTarget: "Ziel hinzufügen", critRemove: "Entfernen", critSave: "Speichern", critCancel: "Abbrechen",
  critEntity: "Entität", critState: "Sollzustand", critWithin: "Frist (Sekunden)", critHold: "Mindestdauer (Sekunden)", critStats: "{ok} erreicht, {missed} verfehlt in 7 Tagen", critSaved: "Gespeichert.", critFailed: "Nicht gespeichert: {reason}",
  actCriteria: "Ziele von Automationen verfehlt", actCriteriaHint: "Mindestens eine Automation verfehlt ihr Erfolgskriterium immer wieder.",
});
Object.assign(TEXT.en, {
  qualityTab: "Quality", runsTabRuns: "Runs",
  qualityHint: "Seven separate views of each automation, deliberately without an overall grade. “Unknown” means there is nothing to judge by yet.",
  qualityLoading: "Putting the quality together …", qualityNone: "No automations found.", qualityRefresh: "Recalculate",
  dim_integrity: "Integrity", dim_reliability: "Reliability", dim_effectiveness: "Effectiveness", dim_maintainability: "Maintainability", dim_restart_safety: "Restart safety", dim_efficiency: "Efficiency", dim_conflicts: "Conflicts",
  ql_ok: "Fine", ql_info: "Note", ql_warn: "Check", ql_red: "Problem", ql_unknown: "Unknown",
  dr_broken: "{count} broken references", dr_stale_targets: "{count} targets are disabled or unavailable", dr_runs: "{count} runs without anything unusual", dr_no_runs: "No runs observed yet",
  dr_no_criteria: "No success criterion defined", dr_not_yet_checked: "Not triggered since there is a criterion", dr_missed: "{missed} missed, {ok} reached (7 days)", dr_reached: "{ok} reached (7 days)",
  dr_no_description: "No description", dr_large: "Large: many triggers or actions", dr_deep: "Deeply nested", dr_no_config: "Configuration not readable", dr_no_effect: "Runs mostly end at conditions", dr_conflict: "{count} possible conflicts",
  dr_failing: "Many errors", dr_never_ok: "Never succeeds", dr_overlap: "Runs overlap", dr_burst: "Unusually often", dr_long_run: "Unusually long runs", dr_after_update: "More errors since an update", dr_long_wait: "Long wait", dr_wait_no_timeout: "Waiting without a timeout",
  diagOpen: "Details", diagClose: "Close", diagFor: "Diagnosis: {name}",
  critTitle: "Success criteria", critHint: "You define what the automation should achieve. After every trigger, one check is made after the time limit. Only counters are kept.",
  critType: "Kind", critTypeState: "Target state", critTypeCall: "Service called", critService: "Service", critCallLine: "calls {service}",
  critCallHint: "Reached when exactly this run of the automation calls the service (a notification or a script). Calls from other sources never count.",
  critNone: "No criterion defined.", critEdit: "Edit", critAdd: "Add criterion", critAddTarget: "Add target", critRemove: "Remove", critSave: "Save", critCancel: "Cancel",
  critEntity: "Entity", critState: "Expected state", critWithin: "Time limit (seconds)", critHold: "Hold for (seconds)", critStats: "{ok} reached, {missed} missed in 7 days", critSaved: "Saved.", critFailed: "Not saved: {reason}",
  actCriteria: "Automation goals missed", actCriteriaHint: "At least one automation misses its success criterion again and again.",
});

const DIM_ORDER = ["integrity", "reliability", "effectiveness", "maintainability", "restart_safety", "efficiency", "conflicts"];
const QL_TONE = { ok: "ok", info: "mute", warn: "warn", red: "red", unknown: "mute" };
const QL_MARK = { ok: "✓", info: "i", warn: "!", red: "✗", unknown: "?" };

class DiagnosticsMixin {
  diagState() {
    return (this.diag ||= { quality: null, loading: false, error: "", sel: "", criteria: {}, draft: null, message: "", detail: {} });
  }

  async loadQuality() {
    const d = this.diagState();
    d.loading = true; d.error = ""; this.render();
    try { d.quality = await this._hass.callWS({ type: "ha_housekeeper/automation_quality" }); }
    catch (err) { d.error = err?.message || String(err); }
    d.loading = false; this.render();
  }

  ensureQuality() {
    if (this.diagState().loading || this._qualityRequested) return;
    this._qualityRequested = true;
    setTimeout(() => this.loadQuality(), 0);
  }

  dimReason(reason) {
    const key = `dr_${reason.key}`;
    return TEXT[this.lang][key] ? this.t(key, reason) : reason.key;
  }

  dimDot(dim) {
    return `<span class="pill ${QL_TONE[dim.level]}" title="${this.esc(dim.reasons.map(r => this.dimReason(r)).join(" · "))}">${QL_MARK[dim.level]}</span>`;
  }

  qualityRow(item) {
    const dots = DIM_ORDER.map(id => `<td aria-label="${this.esc(this.t(`dim_${id}`))}: ${this.esc(this.t(`ql_${item.dimensions[id].level}`))}">${this.dimDot(item.dimensions[id])}</td>`).join("");
    return `<tr><td>${this.nameCell(item.name, item.entity_id)}<span class="qlight" aria-hidden="true">${DIM_ORDER.map(id => `<i class="${QL_TONE[item.dimensions[id].level]}" title="${this.esc(this.t(`dim_${id}`))}"></i>`).join("")}</span></td>${dots}<td><button class="btn" data-diag-open="${this.esc(item.entity_id)}">${this.t("diagOpen")}</button></td></tr>`;
  }

  qualityView() {
    this.ensureQuality();
    const d = this.diagState(), q = d.quality;
    const head = `<div class="panelhead"><div><h2>${this.t("qualityTab")}</h2><p>${this.t("qualityHint")}</p></div><div class="actions"><button class="btn" data-quality-refresh ${d.loading ? "disabled" : ""}>${this.t("qualityRefresh")}</button></div></div>`;
    if (d.error) return `<div class="panel">${head}<div class="error">${this.esc(d.error)}</div></div>`;
    if (!q) return `<div class="panel">${head}${this.skeleton("qualityLoading")}</div>`;
    const issue = i => i.worst === "red" || i.worst === "warn" || i.worst === "info";
    const items = d.issuesOnly ? q.items.filter(issue) : q.items;  // the backend sends them worst first
    const sorted = d.byName ? [...items].sort((a, b) => a.name.localeCompare(b.name)) : items;
    const bar = `<div class="listbar"><label><input type="checkbox" data-quality-issues ${d.issuesOnly ? "checked" : ""}> ${this.t("qualityOnlyIssues")}</label><label><input type="checkbox" data-quality-byname ${d.byName ? "checked" : ""}> ${this.t("qualityName")}</label></div>`;
    const header = `<tr><th>${this.t("utName")}</th>${DIM_ORDER.map(id => `<th>${this.t(`dim_${id}`)}</th>`).join("")}<th></th></tr>`;
    const empty = d.issuesOnly && q.items.length ? this.t("qualityNoIssues") : this.t("qualityNoneNext");
    const table = sorted.length ? `<div class="tablewrap lt qualitytable"><table><thead>${header}</thead><tbody>${sorted.map(i => this.qualityRow(i)).join("")}</tbody></table></div>` : `<div class="emptymsg">${empty}</div>`;
    return `<div class="stack"><div class="panel">${head}${q.items.length ? bar : ""}${table}</div>${d.sel ? this.diagDetail(d.sel) : ""}</div>`;
  }

  // Everything about one automation in one place: why each dimension is as it is, the criteria, and later the coverage, the comparison and the dry run.
  diagDetail(entityId) {
    const d = this.diagState(), item = d.quality?.items.find(i => i.entity_id === entityId);
    if (!item) return "";
    const dims = DIM_ORDER.map(id => {
      const dim = item.dimensions[id];
      return `<div class="row"><span class="tile ${QL_TONE[dim.level]}">${QL_MARK[dim.level]}</span><span class="row-text"><strong>${this.t(`dim_${id}`)}</strong><small>${this.esc(dim.reasons.length ? dim.reasons.map(r => this.dimReason(r)).join(" · ") : this.t(`ql_${dim.level}`))}</small></span><span class="pill ${QL_TONE[dim.level]}">${this.t(`ql_${dim.level}`)}</span></div>`;
    }).join("");
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("diagFor", { name: this.esc(item.name) })}</h2><p>${this.esc(entityId)}</p></div><button class="btn" data-diag-close>${this.t("diagClose")}</button></div>${this.fold("diag_dims", { title: this.t("diagSecDims") }, dims, true)}${this.fold("diag_crit", { title: this.t("diagSecCriteria") }, this.criteriaCard(entityId), true)}${this.fold("diag_improve", { title: this.t("refactorTitle") }, this.refactorCard(entityId), false)}${this.fold("diag_more", { title: this.t("diagSecMore") }, this.diagExtras(entityId), false)}</section>`;
  }

  async openDiag(entityId) {
    const d = this.diagState();
    d.sel = entityId; d.draft = null; d.message = "";
    this.render();
    try { d.criteria[entityId] = await this._hass.callWS({ type: "ha_housekeeper/criteria", entity_id: entityId }); } catch (_) { /* shown as empty */ }
    this.render();
    await this.loadRefactor?.(entityId);
    await this.loadDiagExtras?.(entityId);
  }

  criteriaCard(entityId) {
    const d = this.diagState(), view = d.criteria[entityId];
    const message = d.message ? `<small role="status">${this.esc(d.message)}</small>` : "";
    let body;
    if (d.draft) body = this.criteriaForm(view);
    else if (!view?.criteria.length) body = `<div class="pad"><small>${this.t("critNone")}</small></div>`;
    else body = view.criteria.map(c => `<div class="pad"><small>${c.targets.map(t => `${this.esc(t.entity_id)} = ${this.esc(t.state)}`).join(" · ")} · ${c.within} s${c.hold ? ` + ${c.hold} s` : ""}</small></div>`).join("") + `<div class="pad"><small>${this.t("critStats", view.stats)}</small></div>`;
    const edit = d.draft ? "" : `<button class="btn" data-crit-edit="${this.esc(entityId)}">${this.t("critEdit")}</button>`;
    return `<div class="panelhead"><div><h2>${this.t("critTitle")}</h2><p>${this.t("critHint")}</p></div><div class="actions">${edit}</div></div>${body}${message}`;
  }

  criteriaForm() {
    const draft = this.diagState().draft;
    const typeSelect = (c, i) => `<label>${this.t("critType")} <select data-crit-type="${i}"><option value="state" ${c.type === "call" ? "" : "selected"}>${this.t("critTypeState")}</option><option value="call" ${c.type === "call" ? "selected" : ""}>${this.t("critTypeCall")}</option></select></label>`;
    const callBody = (c, i) => `<div class="setrow"><input type="text" data-crit-service="${i}" value="${this.esc(c.service || "")}" placeholder="notify.mobile_app_phone" aria-label="${this.esc(this.t("critService"))}" style="max-width:300px"></div><small>${this.t("critCallHint")}</small>`;
    const stateBody = (c, i) => `${c.targets.map((t, j) => `<div class="setrow"><input type="text" data-crit-entity="${i}:${j}" value="${this.esc(t.entity_id)}" placeholder="light.hall" aria-label="${this.esc(this.t("critEntity"))}" style="max-width:260px"><input type="text" data-crit-state="${i}:${j}" value="${this.esc(t.state)}" placeholder="on" aria-label="${this.esc(this.t("critState"))}" style="max-width:140px">${c.targets.length > 1 ? `<button class="btn quiet" data-crit-del-target="${i}:${j}">${this.t("critRemove")}</button>` : ""}</div>`).join("")}
      <button class="btn quiet" data-crit-add-target="${i}">${this.t("critAddTarget")}</button>
      <label>${this.t("critHold")} <input type="number" min="0" max="300" data-crit-hold="${i}" value="${this.esc(String(c.hold))}"></label>`;
    const crit = draft.map((c, i) => `<div class="pad polform" data-crit="${i}">${typeSelect(c, i)}${c.type === "call" ? callBody(c, i) : stateBody(c, i)}
      <label>${this.t("critWithin")} <input type="number" min="1" max="300" data-crit-within="${i}" value="${this.esc(String(c.within))}"></label>
      <button class="btn quiet" data-crit-del="${i}">${this.t("critRemove")}</button></div>`).join("");
    return `${crit}<div class="pad" style="display:flex;gap:8px"><button class="btn" data-crit-add>${this.t("critAdd")}</button><button class="btn primary" data-crit-save>${this.t("critSave")}</button><button class="btn quiet" data-crit-cancel>${this.t("critCancel")}</button></div>`;
  }

  editCriteria(entityId) {
    const view = this.diagState().criteria[entityId];
    this.diagState().draft = JSON.parse(JSON.stringify(view?.criteria || []));
    this.diagState().message = "";
    this.render();
  }

  async saveCriteria() {
    const d = this.diagState();
    const criteria = d.draft.map(c => c.type === "call" ? { ...(c.id ? { id: c.id } : {}), type: "call", service: (c.service || "").trim(), within: Number.parseInt(c.within, 10) } : ({ ...(c.id ? { id: c.id } : {}), targets: c.targets.map(t => ({ entity_id: t.entity_id.trim(), state: t.state.trim() })), within: Number.parseInt(c.within, 10), hold: Number.parseInt(c.hold || 0, 10) }));
    try {
      d.criteria[d.sel] = await this._hass.callWS({ type: "ha_housekeeper/criteria_set", entity_id: d.sel, criteria });
      d.draft = null; d.message = this.t("critSaved");
    } catch (err) { d.message = this.t("critFailed", { reason: err?.message || String(err) }); }
    this.render();
  }

  bindDiagnostics(root) {
    const d = () => this.diagState();
    root.querySelector("[data-quality-issues]")?.addEventListener("change", ev => { d().issuesOnly = ev.target.checked; this.render(); });
    root.querySelector("[data-quality-byname]")?.addEventListener("change", ev => { d().byName = ev.target.checked; this.render(); });
    root.querySelector("[data-quality-refresh]")?.addEventListener("click", () => this.loadQuality());
    root.querySelectorAll("[data-diag-open]").forEach(el => el.onclick = () => this.openDiag(el.dataset.diagOpen));
    root.querySelector("[data-diag-close]")?.addEventListener("click", () => { d().sel = ""; d().draft = null; this.render(); });
    root.querySelector("[data-crit-edit]")?.addEventListener("click", ev => this.editCriteria(ev.currentTarget.dataset.critEdit));
    root.querySelector("[data-crit-cancel]")?.addEventListener("click", () => { d().draft = null; this.render(); });
    root.querySelector("[data-crit-save]")?.addEventListener("click", () => this.saveCriteria());
    root.querySelector("[data-crit-add]")?.addEventListener("click", () => { d().draft.push({ targets: [{ entity_id: "", state: "" }], within: 10, hold: 0 }); this.render(); });
    const at = value => value.split(":").map(Number);
    root.querySelectorAll("[data-crit-del]").forEach(el => el.onclick = () => { d().draft.splice(Number(el.dataset.critDel), 1); this.render(); });
    root.querySelectorAll("[data-crit-add-target]").forEach(el => el.onclick = () => { d().draft[Number(el.dataset.critAddTarget)].targets.push({ entity_id: "", state: "" }); this.render(); });
    root.querySelectorAll("[data-crit-del-target]").forEach(el => el.onclick = () => { const [i, j] = at(el.dataset.critDelTarget); d().draft[i].targets.splice(j, 1); this.render(); });
    root.querySelectorAll("[data-crit-entity]").forEach(el => el.oninput = () => { const [i, j] = at(el.dataset.critEntity); d().draft[i].targets[j].entity_id = el.value; });
    root.querySelectorAll("[data-crit-state]").forEach(el => el.oninput = () => { const [i, j] = at(el.dataset.critState); d().draft[i].targets[j].state = el.value; });
    root.querySelectorAll("[data-crit-type]").forEach(el => el.onchange = () => { const c = d().draft[Number(el.dataset.critType)]; c.type = el.value; if (c.type === "state" && !c.targets?.length) c.targets = [{ entity_id: "", state: "" }]; this.render(); });
    root.querySelectorAll("[data-crit-service]").forEach(el => el.oninput = () => { d().draft[Number(el.dataset.critService)].service = el.value; });
    root.querySelectorAll("[data-crit-within]").forEach(el => el.oninput = () => { d().draft[Number(el.dataset.critWithin)].within = el.value; });
    root.querySelectorAll("[data-crit-hold]").forEach(el => el.oninput = () => { d().draft[Number(el.dataset.critHold)].hold = el.value; });
  }
}

// Coverage of triggers and branches, comparison of two runs, and the dry run of one automation; mixed into the panel in 99-register.js.
Object.assign(TEXT.de, {
  covTitle: "Abdeckung von Triggern und Zweigen", covHint: "Zählt aus der Struktur der Läufe, welcher Trigger ausgelöst und welcher Zweig durchlaufen wurde. Variablen und Nutzdaten werden nicht gespeichert.",
  covOffNote: "Ist aus. Zum Zählen liest Housekeeper den Trace jedes Laufs kurz im Arbeitsspeicher (er enthält Variablen) und behält nur Zähler.", covOn: "Zählen einschalten", covOff: "Zählen ausschalten", covClear: "Zähler löschen",
  covRuns: "{runs} Läufe gezählt seit {date}", covNeverNote: "Nie erreicht gilt erst nach {runs} Läufen und {days} Tagen.", covNever: "nie erreicht", covCount: "{n}×", covMean: "Ø {time}", covNoRows: "Keine Trigger oder Zweige gefunden.",
  covKind_trigger: "Trigger", covKind_choose: "Zweig (choose)", covKind_default: "Standardzweig", covKind_then: "Dann-Zweig", covKind_else: "Sonst-Zweig",
  cmpTitle: "Zwei Läufe vergleichen", cmpHint: "Vergleicht die Struktur zweier Läufe aus dem Trace-Puffer von Home Assistant. Nichts wird gespeichert.", cmpNoRuns: "Home Assistant hat keine beendeten Läufe mehr.",
  cmpOlder: "Älterer Lauf", cmpNewer: "Neuerer Lauf", cmpRun: "Vergleichen", cmpSame: "Strukturell gleich: gleicher Trigger, gleiche Zweige, gleiches Ende.",
  cmp_trigger: "Anderer Trigger: {a} → {b}", cmp_branch: "Andere Zweige. Nur im ersten: {a}. Nur im zweiten: {b}.", cmp_execution: "Anderes Ergebnis: {a} → {b}", cmp_last_step: "Anderes Ende: {a} → {b}", cmp_duration: "Laufzeit {a} ms → {b} ms (Faktor {factor})",
  cmpUpdates: "Dazwischen gab es Updates: {list}", cmpCriterion: "Erfolgskriterium: älterer Lauf {a}, neuerer Lauf {b}", cmpReached: "erreicht", cmpMissed: "verfehlt", cmpUnknown: "unbekannt", cmpFailed: "Vergleich nicht möglich: {reason}",
});
Object.assign(TEXT.en, {
  covTitle: "Trigger and branch coverage", covHint: "Counts from the structure of the runs which trigger fired and which branch ran. Variables and payloads are not stored.",
  covOffNote: "It is off. To count, Housekeeper briefly reads each run's trace in memory (it holds variables) and keeps only counters.", covOn: "Switch counting on", covOff: "Switch counting off", covClear: "Clear counts",
  covRuns: "{runs} runs counted since {date}", covNeverNote: "Never reached is only said after {runs} runs and {days} days.", covNever: "never reached", covCount: "{n}×", covMean: "avg {time}", covNoRows: "No triggers or branches found.",
  covKind_trigger: "Trigger", covKind_choose: "Branch (choose)", covKind_default: "Default branch", covKind_then: "Then branch", covKind_else: "Else branch",
  cmpTitle: "Compare two runs", cmpHint: "Compares the structure of two runs from Home Assistant's trace buffer. Nothing is stored.", cmpNoRuns: "Home Assistant has no finished runs left.",
  cmpOlder: "Older run", cmpNewer: "Newer run", cmpRun: "Compare", cmpSame: "Structurally the same: same trigger, same branches, same end.",
  cmp_trigger: "Different trigger: {a} → {b}", cmp_branch: "Different branches. Only in the first: {a}. Only in the second: {b}.", cmp_execution: "Different result: {a} → {b}", cmp_last_step: "Different end: {a} → {b}", cmp_duration: "Run time {a} ms → {b} ms (factor {factor})",
  cmpUpdates: "Updates in between: {list}", cmpCriterion: "Success criterion: older run {a}, newer run {b}", cmpReached: "reached", cmpMissed: "missed", cmpUnknown: "unknown", cmpFailed: "Cannot compare: {reason}",
});

class TraceDiagMixin {
  async loadDiagExtras(entityId) {
    const d = this.diagState();
    try { d.coverage = { ...(d.coverage || {}), [entityId]: await this._hass.callWS({ type: "ha_housekeeper/coverage", entity_id: entityId }) }; } catch (_) { /* section stays empty */ }
    try { d.compare = { runs: (await this._hass.callWS({ type: "ha_housekeeper/trace_compare", entity_id: entityId })).runs, a: "", b: "", result: null, error: "" }; } catch (_) { d.compare = { runs: [], a: "", b: "", result: null, error: "" }; }
    this.render();
  }

  diagExtras(entityId) {
    return `${this.coverageCard(entityId)}${this.compareCard(entityId)}${this.dryRunCard?.(entityId) || ""}`;
  }

  async setCoverage(enabled, clear = false) {
    await this._hass.callWS({ type: "ha_housekeeper/coverage_set", enabled, clear });
    await this.loadDiagExtras(this.diagState().sel);
  }

  coverageCard(entityId) {
    const view = this.diagState().coverage?.[entityId];
    if (!view) return "";
    const toggle = view.enabled ? `<button class="btn" data-cov-set="off">${this.t("covOff")}</button><button class="btn quiet" data-cov-clear>${this.t("covClear")}</button>` : `<button class="btn" data-cov-set="on">${this.t("covOn")}</button>`;
    let body = `<div class="pad"><small>${this.t("covOffNote")}</small></div>`;
    if (view.enabled) {
      const rows = view.rows.map(row => {
        const never = view.never.includes(row.id);
        const time = row.mean_ms === null ? "" : ` · ${this.t("covMean", { time: this.runsDuration(row.mean_ms) })}`;
        return `<div class="row"><span class="row-text"><strong>${this.esc(this.t(`covKind_${row.kind}`))}${row.label ? `: ${this.esc(row.label)}` : ""}</strong><small>${this.esc(row.id)}${this.esc(time)}</small></span>${never ? `<span class="pill warn">${this.t("covNever")}</span>` : ""}<span class="pill ${row.count ? "ok" : "mute"}">${this.t("covCount", { n: this.formatNumber(row.count) })}</span></div>`;
      }).join("");
      const since = view.since ? `<div class="pad"><small>${this.t("covRuns", { runs: this.formatNumber(view.runs), date: this.formatDate(view.since) })}${view.ready ? "" : ` · ${this.t("covNeverNote", { runs: view.thresholds.min_runs, days: view.thresholds.min_days })}`}</small></div>` : "";
      body = `${since}${rows || `<div class="emptymsg">${this.t("covNoRows")}</div>`}`;
    }
    return `<div class="panelhead"><div><h2>${this.t("covTitle")}</h2><p>${this.t("covHint")}</p></div><div class="actions">${toggle}</div></div>${body}`;
  }

  async runCompare() {
    const c = this.diagState().compare;
    c.error = ""; c.result = null;
    try { c.result = await this._hass.callWS({ type: "ha_housekeeper/trace_compare", entity_id: this.diagState().sel, run_a: c.a, run_b: c.b }); }
    catch (err) { c.error = this.t("cmpFailed", { reason: err?.message || String(err) }); }
    this.render();
  }

  compareLines(result) {
    const list = v => (Array.isArray(v) ? (v.join(", ") || "—") : (v ?? "—"));
    const lines = result.differences.map(d => this.t(`cmp_${d.kind}`, { a: list(d.a ?? d.only_a), b: list(d.b ?? d.only_b), factor: d.factor }));
    if (!lines.length) lines.push(this.t("cmpSame"));
    if (result.updates_between.length) lines.push(this.t("cmpUpdates", { list: result.updates_between.map(u => `${u.domain || u.kind} ${u.to || ""}`.trim()).join(", ") }));
    const word = v => (v === true ? this.t("cmpReached") : v === false ? this.t("cmpMissed") : this.t("cmpUnknown"));
    if (result.criterion.older !== null || result.criterion.newer !== null) lines.push(this.t("cmpCriterion", { a: word(result.criterion.older), b: word(result.criterion.newer) }));
    return lines.map(l => `<div class="pad"><small>${this.esc(l)}</small></div>`).join("");
  }

  compareCard() {
    const c = this.diagState().compare;
    if (!c) return "";
    const option = (run, selected) => `<option value="${this.esc(run.run_id)}" ${run.run_id === selected ? "selected" : ""}>${this.esc(this.formatDate(run.start))} · ${this.esc(run.execution || "")}${run.trigger ? ` · ${this.esc(run.trigger)}` : ""}</option>`;
    const picker = (attr, label, selected) => `<div class="setrow"><div><label>${label}</label></div><select ${attr} style="max-width:460px"><option value=""></option>${c.runs.map(r => option(r, selected)).join("")}</select></div>`;
    const body = c.runs.length ? `${picker("data-cmp-a", this.t("cmpOlder"), c.a)}${picker("data-cmp-b", this.t("cmpNewer"), c.b)}<div class="setrow planfoot"><small style="margin:0"></small><button class="btn" data-cmp-run ${c.a && c.b && c.a !== c.b ? "" : "disabled"}>${this.t("cmpRun")}</button></div>` : `<div class="emptymsg">${this.t("cmpNoRuns")}</div>`;
    return `<div class="panelhead"><div><h2>${this.t("cmpTitle")}</h2><p>${this.t("cmpHint")}</p></div></div>${body}${c.error ? `<div class="error">${this.esc(c.error)}</div>` : ""}${c.result ? this.compareLines(c.result) : ""}`;
  }

  bindTraceDiag(root) {
    root.querySelectorAll("[data-cov-set]").forEach(el => el.onclick = () => this.setCoverage(el.dataset.covSet === "on"));
    root.querySelector("[data-cov-clear]")?.addEventListener("click", () => this.setCoverage(true, true));
    root.querySelector("[data-cmp-a]")?.addEventListener("change", e => { this.diagState().compare.a = e.target.value; this.render(); });
    root.querySelector("[data-cmp-b]")?.addEventListener("change", e => { this.diagState().compare.b = e.target.value; this.render(); });
    root.querySelector("[data-cmp-run]")?.addEventListener("click", () => this.runCompare());
    this.bindDryRun?.(root);
  }
}

// The dry run of one automation (see dry_run.py): explains, never executes; mixed into the panel in 99-register.js.
Object.assign(TEXT.de, {
  dryTitle: "Testlauf (erklärend)", dryHint: "Rechnet durch, was die Automation mit den aktuellen Zuständen und deinen Testzuständen tun würde. Es wird nichts ausgeführt und nichts an Geräte gesendet.",
  dryStateEntity: "Entität", dryStateValue: "Testzustand", dryAddState: "Testzustand hinzufügen", dryRemove: "Entfernen", dryRun: "Durchrechnen", dryRunning: "Rechne …", dryFailed: "Nicht möglich: {reason}",
  dryTriggers: "Trigger", dryConditions: "Bedingungen", dryBranches: "Wahrscheinlicher Weg", dryCalls: "Aufgerufene Dienste", dryNoCalls: "Keine Dienste auf dem berechneten Weg.",
  dryYes: "feuert", dryNo: "feuert nicht", dryOpen: "offen", dryTrue: "erfüllt", dryFalse: "nicht erfüllt, die Automation bräche hier ab", dryUnknown: "nicht beurteilbar",
  dryUncertain: "Teile des Wegs lassen sich nicht sicher beurteilen; Dienste daraus sind als „unsicher“ markiert.", dryCertain: "sicher", dryMaybe: "unsicher",
  dryCritical: "kritisch (Schloss, Alarm, Garage)", dryMissing: "fehlt: {list}", dryDisabled: "deaktiviert: {list}", dryTemplated: "Ziel per Vorlage",
  dryLimits: "Grenzen: Vorlagen, Sonne, Zonen, Geräte-Bedingungen und Abläufe außerhalb von Home Assistant werden nicht beurteilt.",
});
Object.assign(TEXT.en, {
  dryTitle: "Test run (explaining)", dryHint: "Works out what the automation would do with the current states and your test states. Nothing is executed and nothing is sent to devices.",
  dryStateEntity: "Entity", dryStateValue: "Test state", dryAddState: "Add test state", dryRemove: "Remove", dryRun: "Work it out", dryRunning: "Working …", dryFailed: "Not possible: {reason}",
  dryTriggers: "Triggers", dryConditions: "Conditions", dryBranches: "Likely path", dryCalls: "Services called", dryNoCalls: "No services on the calculated path.",
  dryYes: "fires", dryNo: "does not fire", dryOpen: "open", dryTrue: "met", dryFalse: "not met, the automation would stop here", dryUnknown: "cannot be judged",
  dryUncertain: "Parts of the path cannot be judged for certain; services from there are marked “uncertain”.", dryCertain: "certain", dryMaybe: "uncertain",
  dryCritical: "critical (lock, alarm, garage)", dryMissing: "missing: {list}", dryDisabled: "disabled: {list}", dryTemplated: "target by template",
  dryLimits: "Limits: templates, sun, zones, device conditions and anything outside Home Assistant are not judged.",
});

class DryRunMixin {
  dryState() {
    const d = this.diagState();
    return (d.dry ||= { states: [{ entity_id: "", state: "" }], result: null, error: "", busy: false });
  }

  async runDry() {
    const dry = this.dryState(), d = this.diagState();
    const states = Object.fromEntries(dry.states.filter(s => s.entity_id.trim() && s.state.trim()).map(s => [s.entity_id.trim(), s.state.trim()]));
    dry.busy = true; dry.error = ""; this.render();
    try { dry.result = await this._hass.callWS({ type: "ha_housekeeper/automation_dry_run", entity_id: d.sel, states }); }
    catch (err) { dry.result = null; dry.error = this.t("dryFailed", { reason: err?.message || String(err) }); }
    dry.busy = false; this.render();
  }

  dryVerdict(value, yes, no) { return value === true ? `<span class="pill ok">${this.t(yes)}</span>` : value === false ? `<span class="pill warn">${this.t(no)}</span>` : `<span class="pill mute">${this.t("dryOpen")}</span>`; }

  dryResult(r) {
    const triggers = r.triggers.map(t => `<div class="row"><span class="row-text"><strong>${this.t("dryTriggers")} ${t.index + 1}</strong><small>${this.esc(t.platform || "")}</small></span>${this.dryVerdict(t.result, "dryYes", "dryNo")}</div>`).join("");
    const conditions = `<div class="row"><span class="row-text"><strong>${this.t("dryConditions")}</strong><small>${this.t(r.conditions === true ? "dryTrue" : r.conditions === false ? "dryFalse" : "dryUnknown")}</small></span>${this.dryVerdict(r.conditions, "dryTrue", "dryNo")}</div>`;
    const path = r.branches.length ? `<div class="pad"><small><b>${this.t("dryBranches")}:</b> ${this.esc(r.branches.join(" → "))}</small></div>` : "";
    const calls = r.calls.length ? r.calls.map(c => {
      const notes = [c.critical ? this.t("dryCritical") : "", c.missing.length ? this.t("dryMissing", { list: c.missing.join(", ") }) : "", c.disabled.length ? this.t("dryDisabled", { list: c.disabled.join(", ") }) : "", c.templated ? this.t("dryTemplated") : ""].filter(Boolean);
      return `<div class="row"><span class="tile ${c.critical ? "red" : "mute"}"><ha-icon icon="${c.critical ? "mdi:alert-outline" : "mdi:flash-outline"}"></ha-icon></span><span class="row-text"><strong>${this.esc(c.service)}</strong><small>${this.esc(c.targets.join(", ") || "—")}${notes.length ? ` · ${this.esc(notes.join(" · "))}` : ""}</small></span><span class="pill ${c.certain ? "ok" : "warn"}">${this.t(c.certain ? "dryCertain" : "dryMaybe")}</span></div>`;
    }).join("") : `<div class="emptymsg">${this.t("dryNoCalls")}</div>`;
    return `${triggers}${conditions}${path}<div class="sectionlabel">${this.t("dryCalls")}</div>${calls}${r.uncertain ? `<div class="pad"><small>${this.t("dryUncertain")}</small></div>` : ""}<div class="pad"><small>${this.t("dryLimits")}</small></div>`;
  }

  dryRunCard() {
    const dry = this.dryState();
    const rows = dry.states.map((s, i) => `<div class="setrow"><input type="text" data-dry-entity="${i}" value="${this.esc(s.entity_id)}" placeholder="binary_sensor.door" aria-label="${this.esc(this.t("dryStateEntity"))}" style="max-width:260px"><input type="text" data-dry-state="${i}" value="${this.esc(s.state)}" placeholder="on" aria-label="${this.esc(this.t("dryStateValue"))}" style="max-width:140px">${dry.states.length > 1 ? `<button class="btn quiet" data-dry-del="${i}">${this.t("dryRemove")}</button>` : ""}</div>`).join("");
    return `<div class="panelhead"><div><h2>${this.t("dryTitle")}</h2><p>${this.t("dryHint")}</p></div></div><div class="pad polform">${rows}<div style="display:flex;gap:8px"><button class="btn quiet" data-dry-add>${this.t("dryAddState")}</button><button class="btn primary" data-dry-run ${dry.busy ? "disabled" : ""}>${dry.busy ? this.t("dryRunning") : this.t("dryRun")}</button></div></div>${dry.error ? `<div class="error">${this.esc(dry.error)}</div>` : ""}${dry.result ? this.dryResult(dry.result) : ""}`;
  }

  bindDryRun(root) {
    const dry = () => this.dryState();
    root.querySelector("[data-dry-run]")?.addEventListener("click", () => this.runDry());
    root.querySelector("[data-dry-add]")?.addEventListener("click", () => { dry().states.push({ entity_id: "", state: "" }); this.render(); });
    root.querySelectorAll("[data-dry-del]").forEach(el => el.onclick = () => { dry().states.splice(Number(el.dataset.dryDel), 1); this.render(); });
    root.querySelectorAll("[data-dry-entity]").forEach(el => el.oninput = () => { dry().states[Number(el.dataset.dryEntity)].entity_id = el.value; });
    root.querySelectorAll("[data-dry-state]").forEach(el => el.oninput = () => { dry().states[Number(el.dataset.dryState)].state = el.value; });
  }
}

// Texts of the panel polish: folds, groups and tabs in the cleanup view, filters of the quality view.
Object.assign(TEXT.de, {
  actNow: "Jetzt", actSoon: "Bald",
  cleanupTabNew: "Neuer Plan", cleanupTabJournal: "Pläne und Journal", cleanupTabPurges: "Gelöschte Statistiken",
  journalEmptyNext: "Noch kein Plan. Wähle unter „Neuer Plan“ Kandidaten aus und lege einen Plan an.",
  qualityOnlyIssues: "Nur mit Problem oder Hinweis", qualityAll: "Alle", qualityWorst: "Schlechteste zuerst", qualityName: "Nach Name",
  qualityNoneNext: "Keine Automationen gefunden. Sie erscheinen nach dem nächsten Scan.", qualityNoIssues: "Keine Automation mit Problem oder Hinweis.",
  mergeButton: "Ausgewählte zusammenführen ({count})", mergeSelect: "Plan zum Zusammenführen auswählen", mergeDone: "{count} Pläne zu einem zusammengeführt. Bewertung und Zahlen sind frisch berechnet.", mergeConflicts: "Zusammengeführt. {count} Objekte wurden nicht übernommen, weil sie in den Plänen verschieden angefragt waren: {list}",
  diagSecDims: "Bewertung", diagSecCriteria: "Erfolgskriterien", diagSecMore: "Abdeckung, Vergleich und Testlauf",
});
Object.assign(TEXT.en, {
  actNow: "Now", actSoon: "Soon",
  cleanupTabNew: "New plan", cleanupTabJournal: "Plans and journal", cleanupTabPurges: "Deleted statistics",
  journalEmptyNext: "No plan yet. Pick candidates under “New plan” and create one.",
  qualityOnlyIssues: "Only with a problem or note", qualityAll: "All", qualityWorst: "Worst first", qualityName: "By name",
  qualityNoneNext: "No automations found. They appear after the next scan.", qualityNoIssues: "No automation with a problem or note.",
  mergeButton: "Merge selected ({count})", mergeSelect: "Select plan to merge", mergeDone: "{count} plans merged into one. Verdicts and numbers are freshly calculated.", mergeConflicts: "Merged. {count} objects were left out because the plans asked for them in different ways: {list}",
  diagSecDims: "Assessment", diagSecCriteria: "Success criteria", diagSecMore: "Coverage, comparison and test run",
});
Object.assign(TEXT.de, {
  recChoiceLabel: "Recorder-Daten", recChoice_keep: "Behalten", recChoice_statistics: "Statistik löschen", recChoice_states: "Statistik und Verlauf löschen",
  recChoiceWarn: "Gilt für alle ausgewählten Entfernungen im Plan. Gelöschte Recorder-Daten lassen sich nur mit dem Backup zurückholen, auch wenn du das Entfernen rückgängig machst.",
  result_purge_failed: "Entfernt, Recorder-Daten nicht gelöscht",
});
Object.assign(TEXT.en, {
  recChoiceLabel: "Recorder data", recChoice_keep: "Keep", recChoice_statistics: "Delete statistics", recChoice_states: "Delete statistics and history",
  recChoiceWarn: "Applies to every removal in the plan. Deleted recorder data can only be restored from the backup, even if you undo the removal.",
  result_purge_failed: "Removed, recorder data not deleted",
});

// Mechanical improvements of one automation (see refactor.py): proposals in the diagnosis card, the plan runs under Cleanup.
Object.assign(TEXT.de, {
  refactorTitle: "Verbessern (experimentell)",
  refactorHint: "Kleine, genau benannte Änderungen an der Konfiguration. Logik, Bedingungen und Templates fasst Housekeeper nie an. Jede Änderung ist ein Plan mit Vorschau, Backup und Rückgängig.",
  refactorOff: "Das Verbessern ist ausgeschaltet. Es schreibt in deine Automationen-Datei und wurde auf einer echten Instanz noch nicht erprobt.",
  refactorTurnOn: "Experimentell einschalten", refactorTurnOff: "Ausschalten", refactorLoading: "Vorschläge werden gesucht …",
  refactorNothing: "Nichts vorzuschlagen.", refactorNotEditable: "Diese Automation lässt sich nicht automatisch ändern: {reason}.",
  refactorFix_add_description: "Beschreibung ergänzen", refactorFixHint_add_description: "Ohne Beschreibung weiß später niemand, wofür die Automation da ist. Den Text schreibst du.",
  refactorFix_remove_duplicate_triggers: "Doppelte Trigger entfernen", refactorFixHint_remove_duplicate_triggers: "{count} Trigger sind völlig gleich. Danach läuft die Automation einmal statt zweimal je Ereignis.",
  refactorFix_hint_device_trigger: "Geräte-Trigger", refactorFixHint_hint_device_trigger: "{count} Trigger hängen an einer Geräte-ID ({paths}). Wird das Gerät neu angelegt, löst die Automation nicht mehr aus. Ein Trigger auf die Entität ist stabiler. Housekeeper ändert das nicht selbst, weil sich dabei das Auslöseverhalten ändern kann.",
  refactorFix_hint_long_delay: "Lange Verzögerung", refactorFixHint_hint_long_delay: "{count} Verzögerungen dauern fünf Minuten oder länger, die längste {longest} ({paths}). Bei einem Neustart von Home Assistant gehen sie verloren und der Rest läuft nie. Ein Trigger mit „for“ oder ein Warteschritt mit Zeitgrenze übersteht den Neustart. Das schreibt Housekeeper nicht um.",
  refactorFix_hint_dead_branch: "Zweig ohne Wirkung", refactorFixHint_hint_dead_branch: "{count} Zweige von „choose“ prüfen Entitäten, die es nicht gibt ({entities}); sie treffen nie zu ({paths}). Ob der Zweig gestrichen oder repariert wird, entscheidest du.", refactorHintOnly: "Nur ein Hinweis, Housekeeper schreibt hier nichts.",
  refactorDescription: "Beschreibung", refactorPlan: "Plan erstellen", refactorFailed: "Plan nicht erstellt: {reason}", refactorDiffBefore: "vorher", refactorDiffNone: "entfällt",
  refactorFix_set_timeout: "Timeout bei Warteschritten ergänzen", refactorFixHint_set_timeout: "{count} Warteschritte (wait_template / wait_for_trigger) haben kein Timeout und können ewig warten: {paths}.",
  refactorTimeout: "Timeout (Sekunden)", refactorKeepGoing: "Nach Ablauf trotzdem weitermachen (Standard von Home Assistant)",
  refactorFix_set_mode: "Modus und Limit ändern", refactorFixHint_set_mode: "Jetzt: {mode}{limit}. Der Modus entscheidet, was bei einer Auslösung geschieht, während die Automation noch läuft.", refactorOverlap: "Läufe überschneiden sich bei dieser Automation.",
  refactorMode: "Modus", refactorMax: "Höchstens gleichzeitig / in der Schlange", mode_single: "single (neue Auslösung verwerfen)", mode_restart: "restart (laufenden Lauf abbrechen)", mode_queued: "queued (hintereinander)", mode_parallel: "parallel (gleichzeitig)",
  fu_class_run_error: "Fehlerlauf",
  source_blueprint: "basiert auf einem Blueprint",
  reason_refactor_disabled: "Das Verbessern ist ausgeschaltet.", reason_not_editable: "Die Automation lässt sich nicht automatisch ändern.", reason_invalid_fix: "Die Angaben für diese Änderung sind nicht gültig.", reason_invalid_config: "Home Assistant würde die geänderte Automation nicht annehmen.",
  abort_invalid_config: "Home Assistant hätte die geänderte Automation nicht angenommen.", abort_reload_failed: "Die Automation wurde nach dem Neuladen nicht geladen; die Datei ist zurückgesetzt.", abort_invalid_fix: "Die Angaben für diese Änderung sind nicht gültig.",
  check_refactor_applied: "Änderung ist in der Datei und die Automation ist geladen", confirmedSummaryRefactor: "{count} Automationen werden in der Konfiguration geändert (Backup vorher, Vorher-Datei bleibt für Rückgängig).", result_refactored: "Geändert",
});
Object.assign(TEXT.en, {
  refactorTitle: "Improve (experimental)",
  refactorHint: "Small, exactly named changes to the configuration. Housekeeper never touches logic, conditions or templates. Every change is a plan with a preview, a backup and an undo.",
  refactorOff: "Improving is switched off. It writes into your automations file and has not been tried on a real instance yet.",
  refactorTurnOn: "Switch on (experimental)", refactorTurnOff: "Switch off", refactorLoading: "Looking for suggestions …",
  refactorNothing: "Nothing to suggest.", refactorNotEditable: "This automation cannot be changed automatically: {reason}.",
  refactorFix_add_description: "Add a description", refactorFixHint_add_description: "Without a description nobody knows later what the automation is for. You write the text.",
  refactorFix_remove_duplicate_triggers: "Remove duplicate triggers", refactorFixHint_remove_duplicate_triggers: "{count} triggers are exactly the same. Afterwards the automation runs once instead of twice per event.",
  refactorFix_hint_device_trigger: "Device triggers", refactorFixHint_hint_device_trigger: "{count} triggers hang on a device id ({paths}). If the device is added again, the automation no longer fires. A trigger on the entity is more stable. Housekeeper does not change this itself because what fires the automation could change.",
  refactorFix_hint_long_delay: "Long delay", refactorFixHint_hint_long_delay: "{count} delays take five minutes or more, the longest {longest} ({paths}). A restart of Home Assistant loses them and the rest never runs. A trigger with “for” or a wait step with a time limit survives a restart. Housekeeper does not rewrite this.",
  refactorFix_hint_dead_branch: "Branch without effect", refactorFixHint_hint_dead_branch: "{count} branches of “choose” check entities that do not exist ({entities}); they never apply ({paths}). Whether to remove or repair the branch is up to you.", refactorHintOnly: "Only a hint, Housekeeper writes nothing here.",
  refactorDescription: "Description", refactorPlan: "Create plan", refactorFailed: "Plan not created: {reason}", refactorDiffBefore: "before", refactorDiffNone: "removed",
  refactorFix_set_timeout: "Add a timeout to wait steps", refactorFixHint_set_timeout: "{count} wait steps (wait_template / wait_for_trigger) have no timeout and can wait forever: {paths}.",
  refactorTimeout: "Timeout (seconds)", refactorKeepGoing: "Carry on after the timeout (Home Assistant's default)",
  refactorFix_set_mode: "Change mode and limit", refactorFixHint_set_mode: "Now: {mode}{limit}. The mode decides what a trigger does while the automation is still running.", refactorOverlap: "Runs of this automation overlap.",
  refactorMode: "Mode", refactorMax: "At most at once / in the queue", mode_single: "single (drop the new trigger)", mode_restart: "restart (stop the running one)", mode_queued: "queued (one after the other)", mode_parallel: "parallel (at the same time)",
  fu_class_run_error: "Error run",
  source_blueprint: "is based on a blueprint",
  reason_refactor_disabled: "Improving is switched off.", reason_not_editable: "The automation cannot be changed automatically.", reason_invalid_fix: "The values for this change are not valid.", reason_invalid_config: "Home Assistant would not accept the changed automation.",
  abort_invalid_config: "Home Assistant would not have accepted the changed automation.", abort_reload_failed: "The automation was not loaded after the reload; the file was put back.", abort_invalid_fix: "The values for this change are not valid.",
  check_refactor_applied: "The change is in the file and the automation is loaded", confirmedSummaryRefactor: "{count} automations are changed in the configuration (backup first, the old file is kept for undo).", result_refactored: "Changed",
});

class RefactorMixin {
  refactorState() {
    return (this.refactor ||= { by: {}, text: {}, message: "" });
  }

  async loadRefactor(entityId) {
    const r = this.refactorState();
    try { r.by[entityId] = await this._hass.callWS({ type: "ha_housekeeper/refactor_proposals", entity_id: entityId }); }
    catch (_) { r.by[entityId] = { enabled: false, editable: false, reason: "not_editable", proposals: [], failed: true }; }
    this.render();
  }

  async setRefactor(enabled) {
    await this._hass.callWS({ type: "ha_housekeeper/refactor_set", enabled });
    await this.loadRefactor(this.diagState().sel);
  }

  refactorCard(entityId) {
    const r = this.refactorState(), view = r.by[entityId];
    const note = r.message ? `<div class="pad"><small role="status">${this.esc(r.message)}</small></div>` : "";
    if (!view) return `<div class="pad"><small>${this.t("refactorLoading")}</small></div>`;
    if (!view.enabled) return `<div class="pad"><small>${this.t("refactorOff")}</small></div><div class="pad"><button class="btn" data-refactor-switch="on">${this.t("refactorTurnOn")}</button></div>`;
    const off = `<div class="pad"><button class="btn quiet" data-refactor-switch="off">${this.t("refactorTurnOff")}</button></div>`;
    if (!view.editable) return `<div class="pad"><small>${this.t("refactorNotEditable", { reason: this.t(`source_${view.reason}`) })}</small></div>${off}`;
    const overlap = this.diagState().quality?.items.find(i => i.entity_id === entityId)?.dimensions.reliability.reasons.some(x => x.key === "overlap");
    const rows = view.proposals.map(p => {
      let input = "", hint = this.t(`refactorFixHint_${p.fix}`, { count: p.count || 0, paths: (p.paths || []).join(", "), mode: p.mode || "", limit: p.max ? ` (max ${p.max})` : "", entities: (p.entities || []).join(", "), longest: this.delayText(p.longest) });
      if (p.fix.startsWith("hint_")) return `<div class="pad polform"><strong>${this.t(`refactorFix_${p.fix}`)}</strong><small style="display:block">${this.esc(hint)}</small><small style="display:block;opacity:.7">${this.t("refactorHintOnly")}</small></div>`;
      if (p.fix === "add_description") input = `<textarea data-refactor-text="add_description" maxlength="300" rows="2" aria-label="${this.esc(this.t("refactorDescription"))}" style="width:100%;max-width:520px">${this.esc(r.text.add_description || "")}</textarea>`;
      if (p.fix === "set_timeout") input = `<div class="setrow"><label>${this.t("refactorTimeout")} <input type="number" min="1" max="86400" data-refactor-timeout value="${this.esc(String(r.timeout || 60))}"></label><label><input type="checkbox" data-refactor-keep ${r.keep === false ? "" : "checked"}> ${this.t("refactorKeepGoing")}</label></div>`;
      if (p.fix === "set_mode") {
        const mode = r.mode || p.mode;
        input = `<div class="setrow"><label>${this.t("refactorMode")} <select data-refactor-mode>${["single", "restart", "queued", "parallel"].map(m => `<option value="${m}" ${m === mode ? "selected" : ""}>${this.esc(this.t(`mode_${m}`))}</option>`).join("")}</select></label>${mode === "queued" || mode === "parallel" ? `<label>${this.t("refactorMax")} <input type="number" min="2" max="100" data-refactor-max value="${this.esc(String(r.max || p.max || 10))}"></label>` : ""}</div>${overlap ? `<small class="error">${this.t("refactorOverlap")}</small>` : ""}`;
      }
      return `<div class="pad polform"><strong>${this.t(`refactorFix_${p.fix}`)}</strong><small style="display:block">${this.esc(hint)}</small>${input}<button class="btn" data-refactor-plan="${this.esc(p.fix)}">${this.t("refactorPlan")}</button></div>`;
    }).join("");
    return `<div class="pad"><small>${this.t("refactorHint")}</small></div>${rows || `<div class="pad"><small>${this.t("refactorNothing")}</small></div>`}${note}${off}`;
  }

  delayText(seconds) {
    if (!seconds) return "";
    return seconds >= 3600 ? `${Math.round(seconds / 360) / 10} h` : `${Math.round(seconds / 60)} min`;
  }

  // What the plan shows for one edit: the path and what stood there.
  refactorDiff(action) {
    const lines = (action.sources || []).flatMap(s => s.changes || []).slice(0, 5).map(c => `<small style="display:block;opacity:.8">${this.esc(c.path)}: ${c.after === null ? this.esc(this.t("refactorDiffNone")) : this.esc(String(c.after))}${c.before === null ? "" : ` (${this.esc(this.t("refactorDiffBefore"))}: ${this.esc(JSON.stringify(c.before)).slice(0, 120)})`}</small>`).join("");
    return `<span style="display:block;padding:6px 0 0">${lines}</span>`;
  }

  async makeRefactorPlan(entityId, fix) {
    const r = this.refactorState();
    const view = r.by[entityId], current = view?.proposals.find(p => p.fix === "set_mode");
    const mode = r.mode || current?.mode;
    const values = fix === "add_description" ? { description: (r.text[fix] || "").trim() }
      : fix === "set_timeout" ? { timeout: Number.parseInt(r.timeout || 60, 10), continue_on_timeout: r.keep !== false }
      : fix === "set_mode" ? { mode, ...(mode === "queued" || mode === "parallel" ? { max: Number.parseInt(r.max || current?.max || 10, 10) } : {}) }
      : {};
    r.message = "";
    try {
      const plan = await this._hass.callWS({ type: "ha_housekeeper/plan_create", actions: [{ kind: "refactor_automation", object_id: entityId, fix, values }] });
      this.plan = plan; this.confirmation = null; this.ack = new Set(); this.confirmWord = "";
      this.journal = [plan, ...(this.journal || [])];
      this.noteJump?.("repair"); this.view = "repair"; this.repairTask = null; this.pages = {};
    } catch (err) { r.message = this.t("refactorFailed", { reason: err?.message || String(err) }); }
    this.render();
  }

  bindRefactor(root) {
    const sel = () => this.diagState().sel;
    root.querySelectorAll("[data-refactor-switch]").forEach(el => el.onclick = () => this.setRefactor(el.dataset.refactorSwitch === "on"));
    root.querySelectorAll("[data-refactor-text]").forEach(el => el.oninput = () => { this.refactorState().text[el.dataset.refactorText] = el.value; });
    root.querySelectorAll("[data-refactor-timeout]").forEach(el => el.oninput = () => { this.refactorState().timeout = el.value; });
    root.querySelectorAll("[data-refactor-keep]").forEach(el => el.onchange = () => { this.refactorState().keep = el.checked; });
    root.querySelectorAll("[data-refactor-max]").forEach(el => el.oninput = () => { this.refactorState().max = el.value; });
    root.querySelectorAll("[data-refactor-mode]").forEach(el => el.onchange = () => { this.refactorState().mode = el.value; this.render(); });
    root.querySelectorAll("[data-refactor-plan]").forEach(el => el.onclick = () => this.makeRefactorPlan(sel(), el.dataset.refactorPlan));
  }
}

// SafetyMixin: the thin status line under the navigation that says how safe the writing parts are.
class SafetyMixin {
  ensureSafetyData() {
    if (this.journal === null && !this._journalRequested) { this._journalRequested = true; this.loadJournal(); }
    this.ensureBackup();
  }

  // Each item is [key, tone, text, target view]; running work comes first, nothing is invented when data is missing.
  safetyItems() {
    const items = [], plans = this.journal || [];
    const mode = this.data?.meta?.protection || "full";
    items.push(["mode", mode === "full" ? "mute" : "warn", this.t(`safeMode_${mode}`), "settings"]);
    const check = this.backup?.available ? (this.backup.checks || []).find(c => c.id === "newest") : null;
    if (this.plan && ["backup", "running"].includes(this.plan.status)) items.push(["run", "warn", this.t(this.plan.status === "backup" ? "safeBackupRunning" : "safeRunning"), "journal"]);
    if (check) items.push(["backup", check.level === "ok" ? "ok" : "warn", check.values?.age_hours === null || check.values?.age_hours === undefined ? this.t("safeNoBackup") : this.t("safeBackup", { age: this.bhAge(check.values.age_hours) }), "maintenance"]);
    const last = plans.find(p => p.finished_at);
    if (last) {
      items.push(["last", "mute", this.t("safeLast", { when: this.formatDate(last.finished_at) }), "journal"]);
      items.push(["undo", last.undoable ? "ok" : "mute", this.t(last.undoable ? "safeUndo" : "safeNoUndo"), "journal"]);
    }
    const watching = plans.filter(p => p.followup === "watching").length;
    if (watching) items.push(["watch", "warn", this.t("safeWatching", { n: watching }), "journal"]);
    const regress = plans.filter(p => p.followup === "regression").length;
    if (regress) items.push(["regress", "red", this.t("safeRegression", { n: regress }), "journal"]);
    return items;
  }

  // Settings > Scan: the protection mode, which the server enforces, and the events Housekeeper fires.
  protectionCard() {
    const mode = this.data?.meta?.protection || "full";
    const icons = { read_only: "mdi:eye-outline", quarantine: "mdi:archive-lock-outline", confirmed: "mdi:shield-check-outline", full: "mdi:shield-lock-outline" };
    const options = ["read_only", "quarantine", "confirmed", "full"].map(m => `<label class="modeopt${m === mode ? " on" : ""}"><input type="radio" name="hk-protection" value="${m}" data-protection ${m === mode ? "checked" : ""}><span class="tile ${m === mode ? (m === "full" ? "ok" : "warn") : "mute"}"><ha-icon icon="${icons[m]}"></ha-icon></span><span class="row-text"><strong>${this.t(`mode_${m}`)}</strong><small>${this.t(`modeText_${m}`)}</small></span></label>`).join("");
    return `<section class="panel modepanel"><div class="panelhead"><div><h2>${this.t("modeTitle")}</h2><p>${this.t("modeHint")}</p></div><span class="pill ${mode === "full" ? "ok" : "warn"}">${this.t(`safeMode_${mode}`)}</span></div>
      <div class="modeopts" role="radiogroup" aria-label="${this.esc(this.t("modeLabel"))}">${options}</div></section>`;
  }

  eventsCard() {
    const events = ["critical_finding", "backup_overdue", "quarantine_expired", "followup_regression", "integration_down", "reminder_due"].map(e => `<li><code>ha_housekeeper_${e}</code> · ${this.t(`event_${e}`)}</li>`).join("");
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("eventsTitle")}</h2><p>${this.t("eventsHint")}</p></div></div><ul class="factnote" style="margin:0;padding:10px 16px 14px 32px">${events}</ul></section>`;
  }

  async setProtection(mode) {
    try { await this._hass.callWS({ type: "ha_housekeeper/protection_set", mode }); this.data.meta.protection = mode; }
    catch (err) { this.error = err?.message || String(err); }
    this.render();
  }

  safetyBar() {
    if (!this.data) return "";
    const items = this.safetyItems();
    if (!items.length) return "";
    return `<div class="safebar" role="region" aria-label="${this.esc(this.t("safeLabel"))}">${items.map(([key, tone, text, view]) => `<button class="safeitem ${tone}" data-safe="${view}" data-safe-key="${key}"><span class="dot ${tone}" aria-hidden="true"></span>${this.esc(text)}</button>`).join("")}</div>`;
  }
}
Object.assign(TEXT.de, {
  safeLabel: "Sicherheitsstatus", safeBackup: "Letztes Backup: vor {age}", safeNoBackup: "Kein Backup gefunden",
  safeLast: "Letzte Änderung: {when}", safeUndo: "Rückgängig möglich", safeNoUndo: "Rückgängig nicht mehr möglich, nur Backup-Restore",
  safeRunning: "Ein Plan läuft", safeBackupRunning: "Backup für einen Plan läuft", safeWatching: "{n} Nachbeobachtung läuft", safeRegression: "{n} Rückfall nach Änderung",
  healthScore: "{percent} / 100 gesund", healthAffected: "{affected} von {base} bewerteten Objekten betroffen",
  healthWord_ok: "In Ordnung", healthWord_warn: "Prüfen nötig", healthWord_red: "Handlungsbedarf",
  causeCounts: "{parts} betroffen", causeN_entity: "{n} Entitäten", causeN_automation: "{n} Automationen", causeN_script: "{n} Skripte", causeN_dashboard: "{n} Dashboards",
});
Object.assign(TEXT.en, {
  safeLabel: "Safety status", safeBackup: "Last backup: {age} ago", safeNoBackup: "No backup found",
  safeLast: "Last change: {when}", safeUndo: "Undo available", safeNoUndo: "Undo no longer possible, backup restore only",
  safeRunning: "A plan is running", safeBackupRunning: "Backup for a plan is running", safeWatching: "{n} follow-up running", safeRegression: "{n} regression after a change",
  healthScore: "{percent} / 100 healthy", healthAffected: "{affected} of {base} rated objects affected",
  healthWord_ok: "All good", healthWord_warn: "Needs a look", healthWord_red: "Action needed",
  causeCounts: "{parts} affected", causeN_entity: "{n} entities", causeN_automation: "{n} automations", causeN_script: "{n} scripts", causeN_dashboard: "{n} dashboards",
});
Object.assign(TEXT.de, {
  safeMode_full: "Schutzmodus: voll", safeMode_read_only: "Schutzmodus: nur lesen", safeMode_quarantine: "Schutzmodus: nur Quarantäne", safeMode_confirmed: "Schutzmodus: ohne unumkehrbare Löschungen",
  modeTitle: "Schutzmodus", modeHint: "Legt auf dem Server fest, was Pläne ändern dürfen. Das gilt für Bestätigen, Starten und Rückgängig, nicht nur für Knöpfe im Panel. Pläne anlegen und alle Ansichten bleiben immer erlaubt.", modeLabel: "Was Housekeeper ändern darf",
  mode_read_only: "1 · Nur lesen", mode_quarantine: "2 · Quarantäne erlaubt", mode_confirmed: "3 · Bestätigte Änderungen mit Backup", mode_full: "4 · Voller Wartungsmodus",
  modeText_read_only: "Nichts wird geändert, auch kein Rückgängig.", modeText_quarantine: "Nur Deaktivieren (und dessen Rückgängig) ist erlaubt.", modeText_confirmed: "Alles mit Einzelbestätigung und Backup außer unumkehrbarem Löschen von Recorder-Daten.", modeText_full: "Alles, wie bisher.",
  err_protection_mode: "Der Schutzmodus erlaubt das nicht. Ändere ihn unter Einstellungen → Scan.",
  eventsTitle: "Ereignisse für eigene Automationen", eventsHint: "Housekeeper löst nach einem Scan für jede neue Lage ein Ereignis auf dem Home-Assistant-Bus aus (einmal je Lage, beim ersten Mal still). Es verlässt nichts Home Assistant.",
  event_critical_finding: "neuer Befund mit hoher Auswirkung", event_backup_overdue: "Backup überfällig", event_quarantine_expired: "Quarantäne abgelaufen", event_followup_regression: "Nachkontrolle: Rückfall", event_integration_down: "Integration nicht geladen (Ursache mit Folgebefunden)",
});
Object.assign(TEXT.en, {
  safeMode_full: "Protection mode: full", safeMode_read_only: "Protection mode: read only", safeMode_quarantine: "Protection mode: quarantine only", safeMode_confirmed: "Protection mode: no irreversible deletions",
  modeTitle: "Protection mode", modeHint: "Sets on the server what plans may change. It holds for confirming, starting and undoing, not only for buttons in the panel. Making plans and every view stay allowed.", modeLabel: "What Housekeeper may change",
  mode_read_only: "1 · Read only", mode_quarantine: "2 · Quarantine allowed", mode_confirmed: "3 · Confirmed changes with backup", mode_full: "4 · Full maintenance",
  modeText_read_only: "Nothing is changed, not even an undo.", modeText_quarantine: "Only disabling (and undoing it) is allowed.", modeText_confirmed: "Everything with one-by-one confirmation and backup except irreversible deletion of recorder data.", modeText_full: "Everything, as before.",
  err_protection_mode: "The protection mode does not allow this. Change it under Settings → Scan.",
  eventsTitle: "Events for your own automations", eventsHint: "After a scan Housekeeper fires an event on the Home Assistant bus for each new situation (once per situation, silent the first time). Nothing leaves Home Assistant.",
  event_critical_finding: "new finding with high impact", event_backup_overdue: "backup overdue", event_quarantine_expired: "quarantine expired", event_followup_regression: "follow-up: regression", event_integration_down: "integration not loaded (cause with follow-up findings)",
});

// Texts for the statistics and dashboard policy rules; merged into TEXT.
Object.assign(TEXT.de, {
  polRule_statistics_unit: "Statistik: Einheit passt nicht mehr", polDesc_statistics_unit: "Die Einheit der Entität weicht von der Einheit der Langzeitstatistik ab, und der Recorder kann sie nicht umrechnen. Neue Werte passen dann nicht zu den alten. Nur Metadaten werden gelesen.", polAlso_statistics_unit: "Statistik → Entität: {ids}",
  polRule_statistics_class: "Statistik: Zustandsklasse passt nicht mehr", polDesc_statistics_class: "Die Zustandsklasse der Entität (Messwert oder Zähler) passt nicht zu den gespeicherten Statistikdaten. Verläufe lassen sich dann nicht zusammen auswerten. Nur Metadaten werden gelesen; Sprünge und Rücksetzer in den Werten prüft Housekeeper nicht.", polAlso_statistics_class: "Statistik → Entität: {ids}",
  polRule_dashboard_navigation: "Dashboard: Navigation führt ins Leere", polDesc_dashboard_navigation: "Eine Karte öffnet eine Ansicht, die es im gelesenen Dashboard nicht gibt. Links zu anderen Bereichen von Home Assistant werden nicht beurteilt.", polAlso_dashboard_navigation: "Ziele: {ids}",
  polRule_dashboard_disabled_entities: "Dashboard zeigt deaktivierte Entitäten", polDesc_dashboard_disabled_entities: "Das Dashboard enthält Karten für Entitäten, die deaktiviert sind.", polAlso_dashboard_disabled_entities: "Deaktiviert: {ids}",
  polRule_dashboard_duplicate_cards: "Dashboard: doppelte Karten", polDesc_dashboard_duplicate_cards: "Dieselbe Karte mit gleicher Einstellung steht mehrmals in derselben Liste.", polAlso_dashboard_duplicate_cards: "Doppelte Karten: {ids}",
  polRule_dashboard_size: "Sehr großes Dashboard", polDesc_dashboard_size: "Mehr als 200 Karten laden langsam und sind schwer zu pflegen.", polAlso_dashboard_size: "{ids} Karten",
  polRule_dashboard_custom_cards: "Dashboard: Custom-Karten ohne Ressource", polDesc_dashboard_custom_cards: "Das Dashboard nutzt Custom-Karten, aber es ist keine Dashboard-Ressource eingetragen. Ob eine einzelne Karte geladen ist, lässt sich von hier nicht sagen; nur dieser sichere Fall zählt.", polAlso_dashboard_custom_cards: "Karten: {ids}",
});
Object.assign(TEXT.en, {
  polRule_statistics_unit: "Statistics: unit no longer fits", polDesc_statistics_unit: "The unit of the entity differs from the unit of its long-term statistics and the recorder cannot convert it. New values then do not fit the old ones. Only metadata is read.", polAlso_statistics_unit: "Statistics → entity: {ids}",
  polRule_statistics_class: "Statistics: state class no longer fits", polDesc_statistics_class: "The state class of the entity (measurement or total) does not match the stored statistics. Histories cannot be read together. Only metadata is read; jumps and resets in the values are not checked.", polAlso_statistics_class: "Statistics → entity: {ids}",
  polRule_dashboard_navigation: "Dashboard: navigation leads nowhere", polDesc_dashboard_navigation: "A card opens a view that the dashboard that was read does not have. Links to other parts of Home Assistant are not judged.", polAlso_dashboard_navigation: "Targets: {ids}",
  polRule_dashboard_disabled_entities: "Dashboard shows disabled entities", polDesc_dashboard_disabled_entities: "The dashboard holds cards for entities that are disabled.", polAlso_dashboard_disabled_entities: "Disabled: {ids}",
  polRule_dashboard_duplicate_cards: "Dashboard: doubled cards", polDesc_dashboard_duplicate_cards: "The same card with the same settings appears more than once in the same list.", polAlso_dashboard_duplicate_cards: "Doubled cards: {ids}",
  polRule_dashboard_size: "Very large dashboard", polDesc_dashboard_size: "More than 200 cards load slowly and are hard to keep.", polAlso_dashboard_size: "{ids} cards",
  polRule_dashboard_custom_cards: "Dashboard: custom cards without a resource", polDesc_dashboard_custom_cards: "The dashboard uses custom cards but no dashboard resource is registered. Whether a single card is loaded cannot be told from here; only this sure case counts.", polAlso_dashboard_custom_cards: "Cards: {ids}",
});

// BatteryCareMixin: the battery forecast and the maintenance reminders in the Batteries view.
class BatteryCareMixin {
  async loadBatteryTrend(refresh = false) {
    this.batteryTrendLoading = true; this.render();
    try { this.batteryTrend = await this._hass.callWS({ type: "ha_housekeeper/battery_trend", refresh }); this.batteryTrendError = ""; }
    catch (err) { this.batteryTrendError = err?.message || String(err); }
    this.batteryTrendLoading = false; this.render();
  }

  ensureBatteryTrend() {
    if (this.batteryTrendLoading || this._btRequested) return;
    this._btRequested = true;
    setTimeout(() => this.loadBatteryTrend(), 0);
  }

  batteryTrendCard() {
    this.ensureBatteryTrend();
    const head = `<div class="panelhead"><div><h2>${this.t("btTitle")}</h2><p>${this.t("btHint")}</p></div><div class="actions"><button class="btn" data-bt-refresh ${this.batteryTrendLoading ? "disabled" : ""}>${this.t("backupRefresh")}</button></div></div>`;
    if (this.batteryTrendError) return `<div class="panel">${head}<div class="error">${this.esc(this.batteryTrendError)}</div></div>`;
    const b = this.batteryTrend;
    if (!b) return `<div class="panel">${head}${this.skeleton("btLoading")}</div>`;
    if (!b.available) return `<div class="panel">${head}<div class="emptymsg">${this.t("btNoRecorder")}</div></div>`;
    if (b.busy) return `<div class="panel">${head}<p class="factnote">${this.t("relBusy")}</p></div>`;
    const falling = b.rows.filter(r => r.days_left !== null);
    const row = r => {
      const tone = r.state === "low" ? "red" : r.days_left <= 30 ? "warn" : "ok";
      const text = r.state === "low" ? this.t("btLow") : this.t("btIn", { n: r.days_left });
      const item = this.findObject(`entity:${r.entity_id}`);
      const device = (item?.device_id ? this.findObject(`device:${item.device_id}`)?.name : "") || "";
      const title = device && !String(r.name).toLowerCase().includes(device.toLowerCase()) ? `${device} – ${r.name}` : r.name;
      const empty = r.state === "low" ? "" : this.formatDate(new Date(Date.now() + r.days_left * 86400000).toISOString()).split(",")[0];
      const area = item ? this.areaName(item) : "";
      const bits = [area, this.t("btNow", { n: this.formatNumber(r.level) }), empty ? this.t("btEmptyOn", { date: empty }) : ""].filter(Boolean).join(" · ");
      return `<button class="row rel" data-object="entity:${this.esc(r.entity_id)}"><span class="tile ${tone}"><ha-icon icon="mdi:battery-clock-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(title)}</strong><small>${this.esc(bits)}</small></span><span class="pill ${tone}">${this.esc(text)}</span></button>`;
    };
    // Batteries that run low in the same fortnight sit in one fold, the nearest one open: change them together.
    const slots = [...b.groups].sort((x, y) => x.from_days - y.from_days);
    const body = falling.length ? slots.map((g, index) => {
      const rows = g.entity_ids.map(id => falling.find(r => r.entity_id === id)).filter(Boolean);
      if (!rows.length) return "";
      const tone = g.from_days <= 13 ? "red" : g.from_days <= 41 ? "warn" : "ok";
      return this.fold(`bt_${g.from_days}`, { tone, title: this.t("btWindow", { from: g.from_days, to: g.to_days }), sub: rows.length > 1 ? this.t("btTogether") : "", pill: this.formatNumber(rows.length) }, rows.map(row).join(""), index === 0);
    }).join("") : `<div class="emptymsg"><ha-icon icon="mdi:battery-check-outline"></ha-icon>${this.t("btNone")}</div>`;
    return `<div class="panel">${head}${body}<p class="factnote">${this.t("btNote", { unknown: this.formatNumber(b.unknown) })}</p></div>`;
  }

  // Batteries that report volts, as rows of the same list: the type is guessed from the full voltage, the limit comes from the type.
  batteryVoltRows() {
    return (this.batteryTrend?.voltage?.rows || []).map(v => {
      const item = this.findObject(`entity:${v.entity_id}`);
      return item ? { item, level: v.level, low: v.state === "low", volt: v } : null;
    }).filter(Boolean);
  }

  voltNum(n) { return `${Number(n).toLocaleString(this.lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} V`; }

  voltNote() {
    const v = this.batteryTrend?.voltage;
    return v && (v.rows.length || v.unknown) ? `<p class="factnote">${this.t("bvNote", { unknown: this.formatNumber(v.unknown) })}</p>` : "";
  }

  reminderRow(r) {
    const tone = { due: "red", soon: "warn", ok: "ok" }[r.state];
    const when = r.state === "due" ? this.t("remOverdue", { n: Math.abs(r.days_left) }) : this.t("remIn", { n: r.days_left });
    return `<div class="row"><span class="tile ${tone}"><ha-icon icon="mdi:wrench-clock"></ha-icon></span><span class="row-text"><strong>${this.esc(r.name)}</strong><small>${this.esc(this.t("remLine", { interval: r.interval_days, last: r.last_done, due: r.due }))}${r.note ? ` · ${this.esc(r.note)}` : ""}</small></span><span class="pill ${tone}">${this.esc(when)}</span><button class="btn" data-rem-done="${this.esc(r.id)}">${this.t("remDone")}</button><button class="btn quiet" data-rem-del="${this.esc(r.id)}" aria-label="${this.esc(this.t("remDelete"))}">${this.t("remDelete")}</button></div>`;
  }

  // Own view under "Maintain": own reminders (filter, descaling, changing batteries) with a date when they are due.
  remindersView() { return `<div class="stack">${this.remindersCard()}</div>`; }

  remindersCard() {
    const items = this.data.reminders || [];
    const draft = this.remDraft || { name: "", interval_days: 90, last_done: new Date().toISOString().slice(0, 10), note: "" };
    const form = `<div class="setrow remform"><input data-rem-field="name" placeholder="${this.esc(this.t("remName"))}" aria-label="${this.esc(this.t("remName"))}" value="${this.esc(draft.name)}" maxlength="80"><label class="recchoice"><span>${this.t("remEvery")}</span><input data-rem-field="interval_days" type="number" min="1" max="3650" value="${this.esc(draft.interval_days)}" style="width:5em"> ${this.t("remDays")}</label><label class="recchoice"><span>${this.t("remLast")}</span><input data-rem-field="last_done" type="date" value="${this.esc(draft.last_done)}"></label><input data-rem-field="note" placeholder="${this.esc(this.t("remNote"))}" aria-label="${this.esc(this.t("remNote"))}" value="${this.esc(draft.note)}" maxlength="200"><button class="btn primary" data-rem-add>${this.t("remAdd")}</button></div>${this.remError ? `<div class="error">${this.esc(this.remError)}</div>` : ""}`;
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("remTitle")}</h2><p>${this.t("remHint")}</p></div></div>${items.length ? items.map(r => this.reminderRow(r)).join("") : `<p class="factnote">${this.t("remNone")}</p>`}${form}</div>`;
  }

  async reminderCall(msg) {
    this.remError = "";
    try { const reply = await this._hass.callWS({ type: "ha_housekeeper/reminder_set", ...msg }); this.data.reminders = reply.reminders; if (msg.action === "save") this.remDraft = null; }
    catch (err) { this.remError = this.t("remInvalid", { field: String(err?.message || err).replace(/^Not accepted: /, "") }); }
    this.render();
  }

  bindBatteryCare(root) {
    root.querySelector("[data-bt-refresh]")?.addEventListener("click", () => this.loadBatteryTrend(true));
    root.querySelectorAll("[data-rem-field]").forEach(el => el.addEventListener("input", () => { this.remDraft = { ...(this.remDraft || { name: "", interval_days: 90, last_done: new Date().toISOString().slice(0, 10), note: "" }), [el.dataset.remField]: el.value }; }));
    root.querySelector("[data-rem-add]")?.addEventListener("click", () => {
      const d = this.remDraft || { name: "", interval_days: 90, last_done: new Date().toISOString().slice(0, 10), note: "" };
      this.reminderCall({ action: "save", name: d.name, interval_days: Number(d.interval_days), last_done: d.last_done, note: d.note });
    });
    root.querySelectorAll("[data-rem-done]").forEach(el => el.addEventListener("click", () => this.reminderCall({ action: "done", reminder_id: el.dataset.remDone })));
    root.querySelectorAll("[data-rem-del]").forEach(el => el.addEventListener("click", () => this.reminderCall({ action: "delete", reminder_id: el.dataset.remDel })));
  }
}
Object.assign(TEXT.de, {
  bvTitle: "Batterien mit Spannung", bvHint: "Sensoren, die Volt statt Prozent melden. Housekeeper schätzt den Typ aus der höchsten Spannung der letzten Wochen und nimmt dessen Grenze.", bvStable: "stabil",
  bvLine: "Jetzt {now} · erkannt als {kind} · Grenze {limit}", bvNote: "Der Typ ist eine Schätzung; liegt er falsch, ist auch die Grenze falsch. Ohne Angabe: {unknown} (zu wenige Tage oder eine Spannung, die zu keinem Typ passt).",
  bvType_cell15: "Einzelzelle 1,5 V (AA/AAA, Alkaline oder NiMH)", bvType_coin3: "3-V-Zelle (z. B. CR2032 oder 2 × AA)", bvType_lithium: "Lithium-Ionen-Zelle", bvType_cells3: "3 Zellen in Reihe (4,5 V)", bvType_cells4: "4 Zellen in Reihe (6 V)", bvType_block9: "9-V-Block", bvType_lead12: "12-V-Akku",
  btTitle: "Batterieprognose", btHint: "Wann eine Batterie voraussichtlich die Grenze erreicht, aus dem Verlauf der letzten fünf Wochen. Eine Schätzung, keine Zusage.", btLoading: "Prognose wird berechnet …", btNoRecorder: "Ohne Recorder gibt es keine Prognose.",
  btNone: "Keine Batterie fällt erkennbar auf die Grenze zu.", btIn: "in etwa {n} Tagen", btLow: "schon unter der Grenze", btLevel: "Jetzt {n} %, fällt um {slope} Prozentpunkte pro Tag", btMore: "{n} weitere nicht gezeigt.",
  btWindow: "In {from} bis {to} Tagen", btTogether: "Gemeinsam wechseln", btNow: "Jetzt {n} %", btEmptyOn: "Grenze etwa am {date}", btNote: "Nur Batteriesensoren mit Langzeitstatistik. Ohne Prognose: {unknown} (zu wenige Tage, stabil oder steigend). Nach einem Wechsel zählt nur der Verlauf danach.",
  remTitle: "Wartungserinnerungen", remHint: "Filter, Entkalken, Batteriewechsel: du trägst Name, Abstand und letztes Datum ein, Housekeeper sagt, wann es wieder fällig ist. Es ändert nichts in Home Assistant.", remNone: "Noch keine Erinnerung.",
  remName: "Name (z. B. Wasserfilter)", remEvery: "alle", remDays: "Tage", remLast: "zuletzt am", remNote: "Notiz (z. B. Batterietyp CR2032)", remAdd: "Hinzufügen", remDone: "Erledigt", remDelete: "Löschen",
  remLine: "Alle {interval} Tage · zuletzt {last} · fällig {due}", remOverdue: "{n} Tage überfällig", remIn: "in {n} Tagen", remInvalid: "Nicht gespeichert, bitte prüfen: {field}",
  reminders: "Erinnerungen", remindersSubtitle: "Eigene Wartungstermine: Filter, Entkalken, Batteriewechsel.", actReminders: "Wartung fällig", actRemindersHint: "Eine eigene Erinnerung ist erreicht",
  relSetup: "Einrichtungsfehler: {n} in {days} Tagen, zuletzt {last}", relSetupNow: "Gerade im Zustand {state}", relSetupNote: "Aus den Scans gezählt, so fein wie das Scan-Intervall.",
  event_reminder_due: "Wartungserinnerung fällig",
});
Object.assign(TEXT.en, {
  bvTitle: "Batteries in volts", bvHint: "Sensors that report volts instead of percent. Housekeeper guesses the type from the highest voltage of the last weeks and uses its limit.", bvStable: "stable",
  bvLine: "Now {now} · recognised as {kind} · limit {limit}", bvNote: "The type is a guess; if it is wrong, so is the limit. Without a result: {unknown} (too few days or a voltage that fits no type).",
  bvType_cell15: "single 1.5 V cell (AA/AAA, alkaline or NiMH)", bvType_coin3: "3 V cell (e.g. CR2032 or 2 × AA)", bvType_lithium: "lithium-ion cell", bvType_cells3: "3 cells in series (4.5 V)", bvType_cells4: "4 cells in series (6 V)", bvType_block9: "9 V block", bvType_lead12: "12 V battery",
  btTitle: "Battery forecast", btHint: "When a battery will probably reach the limit, from the last five weeks. An estimate, not a promise.", btLoading: "Calculating the forecast …", btNoRecorder: "There is no forecast without a recorder.",
  btNone: "No battery is visibly heading for the limit.", btIn: "in about {n} days", btLow: "already below the limit", btLevel: "Now {n} %, falling {slope} points per day", btMore: "{n} more not shown.",
  btWindow: "In {from} to {to} days", btTogether: "Change them together", btNow: "Now {n} %", btEmptyOn: "limit around {date}", btNote: "Only battery sensors with long-term statistics. No forecast for {unknown} (too few days, stable or rising). After a change only the time since counts.",
  remTitle: "Maintenance reminders", remHint: "Filter, descaling, battery change: you enter a name, an interval and the last date, Housekeeper tells you when it is due again. It changes nothing in Home Assistant.", remNone: "No reminder yet.",
  remName: "Name (e.g. water filter)", remEvery: "every", remDays: "days", remLast: "last done", remNote: "Note (e.g. battery type CR2032)", remAdd: "Add", remDone: "Done", remDelete: "Delete",
  remLine: "Every {interval} days · last {last} · due {due}", remOverdue: "{n} days overdue", remIn: "in {n} days", remInvalid: "Not saved, please check: {field}",
  reminders: "Reminders", remindersSubtitle: "Your own maintenance dates: filter, descaling, changing batteries.", actReminders: "Maintenance due", actRemindersHint: "One of your own reminders is reached",
  relSetup: "Setup failures: {n} in {days} days, last {last}", relSetupNow: "Currently in state {state}", relSetupNote: "Counted from the scans, as fine as the scan interval.",
  event_reminder_due: "maintenance reminder due",
});

// CounterMixin: find sensor glitches in counters (a wrong reading that comes back) and repair the recorder rows.
class CounterMixin {
  async loadCounterScan(refresh = false) {
    this.counterLoading = true; this.counterError = ""; this.render();
    try {
      const id = (this.counterId || "").trim();
      this.counterScan = await this._hass.callWS({ type: "ha_housekeeper/counter_scan", refresh, ...(id ? { statistic_id: id } : {}) });
    } catch (err) { this.counterError = err?.message || String(err); }
    this.counterLoading = false; this.render();
  }

  // The reading before and after the repair around one glitch: original dashed, repaired solid.
  counterChart(series) {
    if (!series || series.length < 3) return "";
    const w = 360, h = 90, pad = 4;
    const xs = series.map(p => p[0]), ys = series.flatMap(p => [p[1], p[2]]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const sx = x => pad + ((x - x0) / Math.max(1, x1 - x0)) * (w - 2 * pad);
    const sy = y => h - pad - ((y - y0) / Math.max(1e-9, y1 - y0)) * (h - 2 * pad);
    const line = i => series.map(p => `${sx(p[0]).toFixed(1)},${sy(p[i]).toFixed(1)}`).join(" ");
    return `<svg class="rangechart" role="img" aria-label="${this.esc(this.t("counterChartLabel"))}" viewBox="0 0 ${w} ${h}" width="100%" style="max-width:${w}px;display:block;margin:6px 0">${[1, 2, 3].map(k => `<line class="grid" x1="${pad}" x2="${w - pad}" y1="${(k * h) / 4}" y2="${(k * h) / 4}"/>`).join("")}<polyline fill="none" stroke="var(--hk-red)" stroke-width="1.5" stroke-dasharray="4 3" points="${line(1)}"/><polyline fill="none" stroke="var(--hk-green)" stroke-width="2" points="${line(2)}"/></svg><small style="display:block;opacity:.8"><span style="color:var(--hk-red)">- - -</span> ${this.t("counterOriginal")} · <span style="color:var(--hk-green)">───</span> ${this.t("counterRepaired")}</small>`;
  }

  counterRange(f) {
    return `${this.formatDate(f.bad_first * 1000)} – ${this.formatDate(f.bad_last * 1000)}`;
  }

  // What a counter repair will change, per glitch and per table.
  counterDetail(action) {
    if (action.kind === "repair_range") return this.rangeDetail(action);
    const c = action.counter || {}, unit = c.unit || "";
    const n = v => this.formatNumber(Math.round(v * 1000) / 1000);
    const lines = (c.findings || []).map(f => `${this.t("counterFinding", { range: this.counterRange(f), low: n(f.low), high: n(f.high), before: n(f.good_before), after: n(f.good_after), unit })}`);
    const counts = c.counts || {};
    const rows = this.t("counterRows", { states: counts.states || 0, short: counts.short_term || 0, long: counts.long_term || 0, tail: (counts.tail_long_term || 0) + (counts.tail_short_term || 0) });
    const skipped = Object.entries(c.skipped || {}).map(([table, list]) => this.t("counterSkipped", { table: this.t(`counterTable_${table}`), count: list.length })).join(" ");
    const undone = action.result?.state === "undone" ? `<small style="display:block">${this.t("counterUndone")}</small>` : "";
    const charts = (c.findings || []).slice(0, 3).map(f => this.counterChart(f.series)).join("");
    return `<span style="display:block;padding:6px 0 0">${lines.map(l => `<small style="display:block">${this.esc(l)}</small>`).join("")}<small style="display:block">${this.esc(rows)}</small>${skipped ? `<small style="display:block;color:var(--hk-amber)">${this.esc(skipped)}</small>` : ""}${charts}${undone}</span>`;
  }

  // One table of a range cleanup: the first rows with the old and the new value.
  rangeTable(name, rows, cols, count, extra = "") {
    const n = v => v == null ? "–" : this.esc(this.formatNumber(Math.round(Number(v) * 1000) / 1000));
    const cell = v => Array.isArray(v) ? v.map(n).join(" / ") : n(v);
    const head = (cols || []).map(c => this.t(`rangeCol_${c}`)).join(" / ");
    const body = rows.map(r => `<tr><td>${r[0] ? this.esc(this.formatDate(r[0] * 1000)) : "–"}</td><td>${cell(r[1])}</td><td>→</td><td>${cell(r[2])}</td></tr>`).join("");
    const more = count > rows.length ? `<small style="display:block">${this.esc(this.t("rangeMoreRows", { count: this.formatNumber(count - rows.length) }))}</small>` : "";
    return `<details><summary>${this.esc(this.t(`counterTable_${name}`))} · ${this.formatNumber(count)}${head ? ` · ${this.esc(head)}` : ""}</summary>${count ? `<table style="width:100%;font-size:12px;border-collapse:collapse;margin:4px 0"><tbody>${body}</tbody></table>${more}` : `<small style="display:block">${this.t("rangeNothingHere")}</small>`}${extra}</details>`;
  }

  // What a range cleanup will do: where the data is, what is replaced by what, per table.
  rangeDetail(action) {
    const c = action.counter || {}, unit = c.unit ? ` ${c.unit}` : "";
    const n = v => v == null ? "–" : `${this.formatNumber(Math.round(v * 1000) / 1000)}${unit}`;
    const range = c.range || action.range || {}, counts = c.counts || {}, avail = c.available || {}, d = c.detail || {};
    const line = text => `<small style="display:block">${this.esc(text)}</small>`;
    const warn = text => `<small style="display:block;color:var(--hk-amber)">${this.esc(text)}</small>`;
    const out = [line(this.t("rangeWhat", { kind: this.t(`rangeKind_${c.kind || "counter"}`), range: `${this.formatDate(range.from * 1000)} – ${this.formatDate(range.to * 1000)}`, mode: this.t(`rangeMode_${action.mode || "hold"}`) + (range.fixed != null ? ` (${n(range.fixed)})` : "") }))];
    if (c.bracket) out.push(line(this.t("rangeBracket", { before: n(c.bracket[1]), after: n(c.bracket[3]) })));
    out.push(line(this.t("rangeAvail", { states: this.formatNumber(avail.states || 0), short: this.formatNumber(avail.short_term || 0), long: this.formatNumber(avail.long_term || 0) })));
    for (const t of ["states", "short_term", "long_term"]) if (c.available && !avail[t]) out.push(warn(this.t("rangeGone", { table: this.t(`counterTable_${t}`) })));
    if (counts.estimated_long_term) out.push(warn(this.t("rangeEstimated", { count: this.formatNumber(counts.estimated_long_term) })));
    if (counts.tail_short_term || counts.tail_long_term) out.push(line(this.t("rangeTail", { short: this.formatNumber(counts.tail_short_term || 0), long: this.formatNumber(counts.tail_long_term || 0) })));
    const skipped = Object.entries(c.skipped || {}).map(([table, list]) => this.t("counterSkipped", { table: this.t(`counterTable_${table}`), count: list.length })).join(" ");
    if (skipped) out.push(warn(skipped));
    const tables = [
      this.rangeTable("states", d.states || [], [], counts.states || 0),
      this.rangeTable("short_term", d.short_term?.rows || [], d.short_term?.cols, counts.short_term || 0),
      this.rangeTable("long_term", d.long_term?.rows || [], d.long_term?.cols, counts.long_term || 0),
    ].join("");
    const undone = action.result?.state === "undone" ? line(this.t("counterUndone")) : "";
    return `<span style="display:block;padding:6px 0 0">${out.join("")}${this.counterChart(c.series)}${tables}${undone}</span>`;
  }

  saveRange(root) {
    const read = (sel, old) => root.querySelector(sel)?.value ?? old ?? "";
    this.rangeFrom = read("[data-range-from]", this.rangeFrom); this.rangeTo = read("[data-range-to]", this.rangeTo); this.rangeFixed = read("[data-range-fixed]", this.rangeFixed);
    this.rangeMode = read("[data-range-mode]", this.rangeMode) || "hold";
  }

  // Picks the range from the two date fields; the plan is only created when the input makes sense.
  pickRange(root) {
    this.saveRange(root);
    const from = new Date(this.rangeFrom).getTime() / 1000, to = new Date(this.rangeTo).getTime() / 1000;
    const mode = this.rangeMode, fixed = Number(String(this.rangeFixed).replace(",", "."));
    this.counterSel = (this.counterId || "").trim();
    if (!this.counterSel || !(from < to) || (mode === "fixed" && !Number.isFinite(fixed))) { this.cleanupError = this.t("rangeNeedInput"); this.render(); return; }
    this.counterRangeReq = { mode, range: { from, to, ...(mode === "fixed" ? { fixed } : {}) } };
    this.createPlan();
  }

  localStamp(sec) {
    const d = new Date(sec * 1000), p = v => String(v).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  // Loads the readings the range is picked on; the window is the last N days or an explicit one.
  async loadRangeSeries(win) {
    const id = (this.counterId || "").trim();
    if (!id) { this.cleanupError = this.t("rangeNeedInput"); this.render(); return; }
    const now = Date.now() / 1000;
    this.rangeWin = win || { from: now - (this.rangeDays || 7) * 86400, to: now };
    this.rangeSeries = null; this.rangeSeriesError = ""; this.rangeSeriesLoading = true; this.render();
    try {
      const found = await this._hass.callWS({ type: "ha_housekeeper/range_series", statistic_id: id, from: this.rangeWin.from, to: this.rangeWin.to });
      if (found.error) this.rangeSeriesError = this.t(`reason_${found.error}`); else this.rangeSeries = { ...found, id };
    } catch (err) { this.rangeSeriesError = err?.message || String(err); }
    this.rangeSeriesLoading = false; this.render();
  }

  // The readings with the picked range shaded and two sliders to move its ends.
  rangeChart() {
    const sr = this.rangeSeries, win = this.rangeWin;
    if (this.rangeSeriesLoading) return this.skeleton("counterScanning");
    if (this.rangeSeriesError) return `<div class="error">${this.esc(this.rangeSeriesError)}</div>`;
    if (!sr || !win || !sr.points.length) return sr ? `<p class="factnote">${this.t("rangeNoData")}</p>` : "";
    const w = 640, h = 150, pad = 4, span = Math.max(1, win.to - win.from);
    const ys = sr.points.map(p => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const sx = t => pad + ((t - win.from) / span) * (w - 2 * pad), sy = y => h - pad - ((y - y0) / Math.max(1e-9, y1 - y0)) * (h - 2 * pad);
    const pt = p => `${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`;
    const line = sr.points.map(pt).join(" ");
    const f = new Date(this.rangeFrom).getTime() / 1000, t = new Date(this.rangeTo).getTime() / 1000;
    const has = f < t;
    const area = `M${sx(win.from).toFixed(1)},${h - pad} L${sr.points.map(pt).join(" L")} L${sx(win.to).toFixed(1)},${h - pad} Z`;
    const grid = [1, 2, 3].map(k => `<line class="grid" x1="${pad}" x2="${w - pad}" y1="${(k * h) / 4}" y2="${(k * h) / 4}"/>`).join("");
    const bad = has ? sr.points.filter(p => p[0] >= f && p[0] <= t).map(pt).join(" ") : "";
    const slider = (name, value) => `<input type="range" min="0" max="1000" step="1" value="${Math.round(Math.min(1, Math.max(0, (value - win.from) / span)) * 1000)}" data-range-slide="${name}" aria-label="${this.esc(this.t(name === "from" ? "rangeFrom" : "rangeTo"))}" style="width:100%;max-width:${w}px;display:block">`;
    return `<svg class="rangechart" role="img" aria-label="${this.esc(this.t("rangeChartLabel"))}" viewBox="0 0 ${w} ${h}" width="100%" style="max-width:${w}px;display:block;margin:6px 0">${grid}<rect data-range-band x="${has ? sx(Math.max(win.from, f)).toFixed(1) : 0}" width="${has ? Math.max(1, sx(Math.min(win.to, t)) - sx(Math.max(win.from, f))).toFixed(1) : 0}" y="0" height="${h}" rx="4" fill="var(--hk-amber)" opacity=".2"/><path d="${area}" fill="var(--hk-blue)" opacity=".08"/><polyline fill="none" stroke="var(--hk-blue)" stroke-width="2" stroke-linejoin="round" points="${line}"/>${bad.includes(" ") ? `<polyline fill="none" stroke="var(--hk-red)" stroke-width="2.4" points="${bad}"/>` : ""}</svg>
      <small style="display:block;opacity:.8">${this.esc(this.formatDate(win.from * 1000))} – ${this.esc(this.formatDate(win.to * 1000))} · ${this.esc(this.t(`rangeTable_${sr.table}`))} · ${this.esc(this.formatNumber(Math.round(y0 * 100) / 100))} … ${this.esc(this.formatNumber(Math.round(y1 * 100) / 100))} ${this.esc(sr.unit || "")}</small>
      ${slider("from", has ? f : win.from)}${slider("to", has ? t : win.to)}`;
  }

  // Moves one end of the range with its slider; the fields and the shaded band follow without a redraw.
  slideRange(root, slider) {
    const win = this.rangeWin; if (!win) return;
    const at = el => win.from + (Number(el?.value ?? 0) / 1000) * (win.to - win.from);
    let from = at(root.querySelector('[data-range-slide="from"]')), to = at(root.querySelector('[data-range-slide="to"]'));
    if (from > to) { if (slider.dataset.rangeSlide === "from") from = to; else to = from; }
    this.rangeFrom = this.localStamp(from); this.rangeTo = this.localStamp(to);
    const setValue = (sel, v) => { const el = root.querySelector(sel); if (el) el.value = v; };
    setValue("[data-range-from]", this.rangeFrom); setValue("[data-range-to]", this.rangeTo);
    const band = root.querySelector("[data-range-band]"), span = Math.max(1, win.to - win.from), w = 640, pad = 4;
    if (band) { band.setAttribute("x", (pad + ((from - win.from) / span) * (w - 2 * pad)).toFixed(1)); band.setAttribute("width", Math.max(1, ((to - from) / span) * (w - 2 * pad)).toFixed(1)); }
  }

  // A suggestion from the scan: the range is filled in and the readings around it are shown.
  takeRange(id, from, to) {
    this.counterId = id; this.counterRangeReq = null;
    this.rangeFrom = this.localStamp(from); this.rangeTo = this.localStamp(to); this.rangeMode = "hold";
    const pad = Math.max(2 * (to - from), 86400), now = Date.now() / 1000;
    this.loadRangeSeries({ from: from - pad, to: Math.min(now, to + pad) });
  }

  rangeForm() {
    const mode = this.rangeMode || "hold";
    const stamp = value => this.esc(value || "");
    return `<div class="panelhead" style="margin-top:12px"><div><h2>${this.t("rangeTitle")}</h2><p>${this.t("rangeHint")}</p></div></div>
      <div class="setrow"><div><label>${this.t("rangeWindow")}</label><small>${this.t("rangeWindowHint")}</small></div><span style="display:flex;gap:8px;flex-wrap:wrap"><select data-range-days>${[1, 7, 30, 90, 365].map(d => `<option value="${d}" ${(this.rangeDays || 7) === d ? "selected" : ""}>${this.t("rangeDays", { days: d })}</option>`).join("")}</select><button class="btn" data-range-load ${this.rangeSeriesLoading ? "disabled" : ""}>${this.t("rangeLoad")}</button></span></div>
      ${this.rangeChart()}
      <div class="setrow"><div><label>${this.t("rangeFrom")}</label></div><input type="datetime-local" data-range-from value="${stamp(this.rangeFrom)}" style="max-width:260px"></div>
      <div class="setrow"><div><label>${this.t("rangeTo")}</label></div><input type="datetime-local" data-range-to value="${stamp(this.rangeTo)}" style="max-width:260px"></div>
      <div class="setrow"><div><label>${this.t("counterMode")}</label></div><select data-range-mode style="max-width:460px">${["hold", "interpolate", "fixed"].map(m => `<option value="${m}" ${mode === m ? "selected" : ""}>${this.t(`rangeMode_${m}`)}</option>`).join("")}</select></div>
      ${mode === "fixed" ? `<div class="setrow"><div><label>${this.t("rangeFixed")}</label></div><input type="text" inputmode="decimal" data-range-fixed value="${stamp(this.rangeFixed)}" style="max-width:160px"></div>` : ""}
      <div class="setrow planfoot"><small style="margin:0">${this.t("rangeNote")}</small><button class="btn primary" data-range-pick ${this.cleanupBusy ? "disabled" : ""}>${this.cleanupBusy ? this.t("planCreating") : this.t("rangePreview")}</button></div>`;
  }

  counterCard() {
    const s = this.counterScan, mode = this.counterMode || "hold";
    const head = `<div class="panelhead"><div>${this.view === "repair" ? "" : `<h2>${this.t("counterTitle")}</h2>`}<p>${this.t("counterHint")}</p></div><div class="actions">${this.kindSelect()}</div></div>`;
    const controls = `<div class="setrow"><div><label>${this.t("counterEntity")}</label><small>${this.t("counterEntityHint")}</small></div>${this.pickerBox("counter", "sensor.water_meter", "data-counter-id")}</div>
      <div class="setrow"><div><label>${this.t("counterMode")}</label></div><select data-counter-mode style="max-width:460px">${["hold", "interpolate"].map(m => `<option value="${m}" ${mode === m ? "selected" : ""}>${this.t(`counterMode_${m}`)}</option>`).join("")}</select></div>
      <div class="setrow planfoot"><small style="margin:0">${this.t("counterScanNote")}</small><button class="btn primary" data-counter-scan ${this.counterLoading ? "disabled" : ""}>${this.counterLoading ? this.t("counterScanning") : this.t("counterScan")}</button></div>`;
    let body = "";
    if (this.counterError) body = `<div class="error">${this.esc(this.counterError)}</div>`;
    else if (s && !s.available) body = `<div class="emptymsg">${this.t("counterNoRecorder")}</div>`;
    else if (s?.busy) body = `<p class="factnote">${this.t("relBusy")}</p>`;
    else if (s) {
      const items = s.items.map(item => {
        const measure = item.kind === "measurement", n3 = v => this.formatNumber(Math.round(v * 1000) / 1000);
        const lines = item.findings.map(f => {
          const extreme = Math.abs(f.high - f.good_before) > Math.abs(f.low - f.good_before) ? f.high : f.low;
          return `<small style="display:block">${this.esc(measure ? this.t("spikeFound", { range: this.counterRange(f), extreme: n3(extreme), good: n3(f.good_before), unit: item.unit || "" }) : this.t("counterFound", { range: this.counterRange(f), low: n3(f.low), good: n3(f.good_before), unit: item.unit || "" }))}</small>`;
        }).join("");
        const action = measure ? `<button class="btn primary" data-range-take="${this.esc(item.statistic_id)}" data-take-from="${item.findings[0].suggest.from}" data-take-to="${item.findings[0].suggest.to}">${this.t("rangeTake")}</button>`
          : `<button class="btn primary" data-counter-pick="${this.esc(item.statistic_id)}" ${this.cleanupBusy ? "disabled" : ""}>${this.cleanupBusy ? this.t("planCreating") : this.t("counterFix")}</button>`;
        return `<div class="row"><span class="tile warn"><ha-icon icon="mdi:chart-line-variant"></ha-icon></span><span class="row-text"><strong>${this.esc(item.name)}</strong><small>${this.esc(item.statistic_id)}</small>${lines}</span>${action}</div>`;
      }).join("");
      body = `${items || `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon><strong>${this.t("counterNone")}</strong>${this.t("counterNoneSub", { count: this.formatNumber(s.checked) })}<button class="btn" data-counter-scan>${this.t("counterRescan")}</button></div>`}<p class="factnote">${this.t("counterChecked", { count: this.formatNumber(s.checked) })}</p>`;
    }
    if (!s && !this.counterError && !this.counterLoading) body = `<div class="emptymsg info"><ha-icon icon="mdi:magnify-scan"></ha-icon><strong>${this.t("counterNotChecked")}</strong>${this.t("counterNotCheckedSub")}<button class="btn primary" data-counter-scan>${this.t("counterScanNow")}</button></div>`;
    else if (this.counterLoading) body = this.skeleton("counterScanning");
    return `<div class="panel">${head}${controls}${body}${this.rangeForm()}</div>`;
  }

  bindCounter(root) {
    root.querySelector("[data-counter-id]")?.addEventListener("change", e => { this.counterId = e.target.value.trim(); });
    root.querySelector("[data-counter-mode]")?.addEventListener("change", e => { this.counterMode = e.target.value; });
    root.querySelectorAll("[data-counter-scan]").forEach(el => el.addEventListener("click", () => this.loadCounterScan(true)));
    root.querySelectorAll("[data-counter-pick]").forEach(el => el.addEventListener("click", () => { this.counterSel = el.dataset.counterPick; this.counterRangeReq = null; this.createPlan(); }));
    root.querySelector("[data-range-mode]")?.addEventListener("change", () => { this.saveRange(root); this.render(); });
    root.querySelector("[data-range-pick]")?.addEventListener("click", () => this.pickRange(root));
    root.querySelector("[data-range-days]")?.addEventListener("change", e => { this.rangeDays = Number(e.target.value); });
    root.querySelector("[data-range-load]")?.addEventListener("click", () => { this.saveRange(root); this.counterId = (root.querySelector("[data-counter-id]")?.value || this.counterId || "").trim(); this.loadRangeSeries(); });
    root.querySelectorAll("[data-range-from],[data-range-to]").forEach(el => el.addEventListener("change", () => { this.saveRange(root); this.render(); }));
    root.querySelectorAll("[data-range-slide]").forEach(el => el.addEventListener("input", () => this.slideRange(root, el)));
    root.querySelectorAll("[data-range-take]").forEach(el => el.addEventListener("click", () => this.takeRange(el.dataset.rangeTake, Number(el.dataset.takeFrom), Number(el.dataset.takeTo))));
  }
}
Object.assign(TEXT.de, {
  kindCounter: "Sensorfehler bereinigen (falsche Werte in Verlauf und Statistik, Zähler und Messwerte, mit Backup)",
  counterTitle: "Zählerfehler finden und bereinigen", counterHint: "Ein Zähler darf nie sinken. Hat ein Sensor kurz einen falschen Wert geliefert (zum Beispiel ein Wasserzähler), zählt Home Assistant den Rücksprung als neuen Verbrauch. Housekeeper findet solche Ausreißer (bei Messwerten wie einer Temperatur auch Ausschläge weit außerhalb des Üblichen, etwa 85 °C) und ersetzt die falschen Werte im Verlauf, in den 5-Minuten-Werten und in den Stundenwerten; die verfälschte Summe wird neu berechnet. Ein Wert, der dauerhaft niedrig bleibt (Reset, Zählertausch), wird nie angefasst. Vor jedem Lauf entsteht ein Home-Assistant-Backup; die alten Werte bleiben im Journal und lassen sich zurückspielen, solange niemand die Zeilen danach geändert hat.",
  counterEntity: "Nur diesen Sensor prüfen", counterEntityHint: "Leer lassen, um alle Zähler und Messwerte mit Statistik zu prüfen (letztes Jahr).", counterMode: "Womit werden falsche Werte ersetzt?",
  counterMode_hold: "Letzter guter Wert (empfohlen)", counterMode_interpolate: "Gerade Linie zum nächsten guten Wert",
  counterScan: "Sensoren prüfen", counterScanning: "Wird geprüft …", counterScanNote: "Liest nur. Bei vielen Zählern kann das einen Moment dauern.", counterNoRecorder: "Ohne Recorder gibt es nichts zu prüfen.",
  counterNone: "Keine Ausreißer gefunden.", counterChecked: "{count} Sensoren geprüft.", counterPreview: "Vorschau erstellen", counterFix: "Diesen Fund bereinigen", rangePreview: "Zeitraum bereinigen",
  counterFound: "{range}: niedrigster Wert {low} {unit} statt etwa {good} {unit}", counterFinding: "{range}: Werte zwischen {low} und {high} {unit}; gute Werte davor {before} und danach {after} {unit}.",
  counterRows: "Geändert werden {states} Verlaufswerte, {short} 5-Minuten-Werte und {long} Stundenwerte; die Summe wird in {tail} späteren Statistikzeilen berichtigt.",
  counterSkipped: "{table}: {count} Fund(e) nicht reparierbar (keine guten Werte davor oder danach).", counterTable_short_term: "5-Minuten-Werte", counterTable_long_term: "Stundenwerte",
  counterOriginal: "Original", counterRepaired: "repariert", counterChartLabel: "Verlauf vor und nach der Reparatur", counterUndone: "Die alten Werte sind wieder eingesetzt.",
  reason_counter_write: "Schreibt in die Recorder-Datenbank (Verlauf und Statistik). Ein Backup entsteht zuerst; die alten Werte lassen sich aus dem Journal zurückspielen.", reason_counter_partial: "Eine der Tabellen kann nicht repariert werden (zu wenig Werte davor oder danach); die anderen schon.",
  reason_no_counter_statistics: "Für diese ID gibt es keine Summenstatistik des Recorders.", reason_nothing_found: "Es gibt nichts zu ändern.", reason_too_many_rows: "Zu viele Zeilen für einen Lauf (mehr als 5000); den Zeitraum erst von Hand eingrenzen.",
  reason_schema_unknown: "Das Datenbankschema dieser Home-Assistant-Version ist Housekeeper nicht bekannt; nichts wird geschrieben.", reason_counter_changed: "Die Daten haben sich seit der Vorschau geändert.",
  confirmWordRepair: "REPARIEREN", confirmedSummaryRepair: "{count} Datenreparatur: Housekeeper legt zuerst ein Home-Assistant-Backup an und startet nur, wenn es erfolgreich ist. Danach überschreibt es falsche Werte im Verlauf und in der Statistik. Die alten Werte bleiben im Journal.",
  result_repaired: "Repariert", check_counter_clean: "Keine Ausreißer mehr", simRepaired: "{count} Sensoren bereinigt",
  abort_counter_changed: "Die Daten wurden nach der Vorschau geändert.", abort_recorder_busy: "Der Recorder ist gerade belegt; später noch einmal versuchen.", abort_verify_failed: "Nach dem Schreiben war der Zähler nicht sauber; es wurde nichts übernommen.",
  undo_recorder_busy: "nicht rückgängig: der Recorder ist gerade belegt, später erneut versuchen",
  abort_schema_unknown: "Das Datenbankschema ist nicht bekannt; nichts wurde geschrieben.", abort_too_many_rows: "Zu viele Zeilen für einen Lauf.", abort_nothing_found: "Es gibt nichts mehr zu reparieren.", abort_no_counter_statistics: "Die Statistik existiert nicht mehr.",
});
Object.assign(TEXT.en, {
  kindCounter: "Repair sensor errors (wrong values in history and statistics, counters and measurements, with backup)",
  counterTitle: "Find and repair counter glitches", counterHint: "A counter must never fall. If a sensor briefly reported a wrong value (a water meter, for example), Home Assistant counts the jump back as new consumption. Housekeeper finds such outliers (for measurements such as a temperature also spikes far outside the usual range, say 85 °C) and replaces the wrong values in the history, in the 5-minute rows and in the hourly rows; the spoiled sum is recalculated. A value that stays low for good (a reset, a replaced meter) is never touched. A Home Assistant backup is created before every run; the old values stay in the journal and can be put back as long as nobody changed the rows afterwards.",
  counterEntity: "Check this sensor only", counterEntityHint: "Leave empty to check every counter and measurement with statistics (last year).", counterMode: "What replaces the wrong values?",
  counterMode_hold: "Last good value (recommended)", counterMode_interpolate: "Straight line to the next good value",
  counterScan: "Check sensors", counterScanning: "Checking …", counterScanNote: "Only reads. With many counters this can take a moment.", counterNoRecorder: "There is nothing to check without a recorder.",
  counterNone: "No outliers found.", counterChecked: "{count} sensors checked.", counterPreview: "Create preview", counterFix: "Clean up this finding", rangePreview: "Clean up this range",
  counterFound: "{range}: lowest value {low} {unit} instead of about {good} {unit}", counterFinding: "{range}: values between {low} and {high} {unit}; good values before {before} and after {after} {unit}.",
  counterRows: "{states} history values, {short} 5-minute rows and {long} hourly rows change; the sum is corrected in {tail} later statistics rows.",
  counterSkipped: "{table}: {count} finding(s) cannot be repaired (no good values before or after).", counterTable_short_term: "5-minute rows", counterTable_long_term: "Hourly rows",
  counterOriginal: "original", counterRepaired: "repaired", counterChartLabel: "Readings before and after the repair", counterUndone: "The old values are back.",
  reason_counter_write: "Writes into the recorder database (history and statistics). A backup is created first; the old values can be put back from the journal.", reason_counter_partial: "One of the tables cannot be repaired (too few values before or after); the others can.",
  reason_no_counter_statistics: "The recorder has no sum statistics for this ID.", reason_nothing_found: "There is nothing to change.", reason_too_many_rows: "Too many rows for one run (more than 5000); narrow the period down by hand first.",
  reason_schema_unknown: "Housekeeper does not know the database schema of this Home Assistant version; nothing is written.", reason_counter_changed: "The data changed since the preview.",
  confirmWordRepair: "REPAIR", confirmedSummaryRepair: "{count} data repair: Housekeeper first creates a Home Assistant backup and only continues if it succeeds. It then overwrites wrong values in the history and in the statistics. The old values stay in the journal.",
  result_repaired: "Repaired", check_counter_clean: "No outliers left", simRepaired: "{count} sensors cleaned",
  abort_counter_changed: "The data changed after the preview.", abort_recorder_busy: "The recorder is busy; try again later.", abort_verify_failed: "The counter was not clean after writing; nothing was kept.",
  undo_recorder_busy: "not undone: the recorder is busy, try again later",
  abort_schema_unknown: "The database schema is not known; nothing was written.", abort_too_many_rows: "Too many rows for one run.", abort_nothing_found: "There is nothing left to repair.", abort_no_counter_statistics: "The statistics no longer exist.",
});
Object.assign(TEXT.de, {
  rangeTitle: "Gezielt bereinigen (Zeitraum selbst wählen)", rangeHint: "Für einen Fehler, den du selbst gesehen hast, bei einem Zähler oder einem Messwert (Temperatur, Leistung, …). Die Vorschau zeigt, welche Daten es für den Zeitraum noch gibt und was in jeder Tabelle geändert wird. Verlauf (roh) wird nach der Einstellung des Recorders gelöscht, 5-Minuten-Werte nach etwa 10 Tagen; Stundenwerte bleiben unbegrenzt.",
  rangeFrom: "Von", rangeTo: "Bis", rangeFixed: "Fester Wert", rangeNote: "Es braucht einen guten Wert vor und nach dem Zeitraum. Zähler dürfen dabei nicht sinken.", rangeNeedInput: "Sensor, Von und Bis angeben (Von vor Bis); bei festem Wert auch die Zahl.",
  rangeMode_hold: "Letzter guter Wert (empfohlen)", rangeMode_interpolate: "Gerade Linie zum nächsten guten Wert", rangeMode_fixed: "Fester Wert",
  rangeKind_counter: "Zähler", rangeKind_measurement: "Messwert",
  rangeWhat: "{kind}, Zeitraum {range}, ersetzt durch: {mode}.", rangeBracket: "Gute Werte davor {before} und danach {after}.",
  rangeAvail: "Für den Zeitraum gibt es {states} Verlaufswerte (roh), {short} 5-Minuten-Werte und {long} Stundenwerte.", rangeGone: "{table}: für diesen Zeitraum nicht mehr vorhanden (Aufbewahrung abgelaufen); dort wird nichts angefasst.",
  rangeEstimated: "{count} Stundenwerte lassen sich ohne 5-Minuten-Werte nicht neu berechnen; sie bekommen den Ersatzwert als Schätzung.", rangeTail: "Die Summe wird in {short} späteren 5-Minuten-Zeilen und {long} späteren Stundenzeilen berichtigt.",
  rangeMoreRows: "… und {count} weitere Zeilen", rangeNothingHere: "In dieser Tabelle ändert sich nichts.",
  rangeCol_state: "Stand", rangeCol_sum: "Summe", rangeCol_mean: "Mittel", rangeCol_min: "Min", rangeCol_max: "Max",
  reason_no_range_statistics: "Für diese ID gibt es keine Zähler- oder Mittelwert-Statistik des Recorders.", reason_bad_range: "Der Zeitraum ist ungültig (Von nach Bis, in der Zukunft, länger als 31 Tage oder fester Wert fehlt).",
  reason_no_bracket: "Vor oder nach dem Zeitraum gibt es keinen guten Wert; der Zeitraum muss größer werden oder ein fester Wert gewählt sein.", reason_bracket_not_good: "Der Zähler ist nach dem Zeitraum niedriger als davor; das ist kein Sensorfehler, sondern ein Reset oder Zählertausch.",
  reason_fixed_outside: "Der feste Wert liegt außerhalb der guten Werte davor und danach; ein Zähler darf nicht sinken.",
  abort_no_range_statistics: "Die Statistik existiert nicht mehr.", abort_bad_range: "Der Zeitraum ist nicht mehr gültig.", abort_no_bracket: "Es gibt keinen guten Wert mehr davor oder danach.", abort_bracket_not_good: "Der Zähler ist nach dem Zeitraum niedriger als davor.", abort_fixed_outside: "Der feste Wert liegt außerhalb der guten Werte.",
});
Object.assign(TEXT.en, {
  rangeTitle: "Clean up a range yourself", rangeHint: "For an error you spotted yourself, in a counter or a measurement (temperature, power, …). The preview shows which data still exists for the period and what changes in each table. Raw history is deleted according to the recorder setting, 5-minute rows after about 10 days; hourly rows stay forever.",
  rangeFrom: "From", rangeTo: "To", rangeFixed: "Fixed value", rangeNote: "A good value before and after the period is needed. Counters must not fall.", rangeNeedInput: "Give the sensor, From and To (From before To); with a fixed value also the number.",
  rangeMode_hold: "Last good value (recommended)", rangeMode_interpolate: "Straight line to the next good value", rangeMode_fixed: "Fixed value",
  rangeKind_counter: "Counter", rangeKind_measurement: "Measurement",
  rangeWhat: "{kind}, period {range}, replaced by: {mode}.", rangeBracket: "Good values before {before} and after {after}.",
  rangeAvail: "For the period there are {states} raw history values, {short} 5-minute rows and {long} hourly rows.", rangeGone: "{table}: no longer there for this period (retention expired); nothing is touched there.",
  rangeEstimated: "{count} hourly rows cannot be recalculated without 5-minute rows; they get the replacement value as an estimate.", rangeTail: "The sum is corrected in {short} later 5-minute rows and {long} later hourly rows.",
  rangeMoreRows: "… and {count} more rows", rangeNothingHere: "Nothing changes in this table.",
  rangeCol_state: "Reading", rangeCol_sum: "Sum", rangeCol_mean: "Mean", rangeCol_min: "Min", rangeCol_max: "Max",
  reason_no_range_statistics: "The recorder has no counter or mean statistics for this ID.", reason_bad_range: "The period is invalid (From after To, in the future, longer than 31 days or the fixed value is missing).",
  reason_no_bracket: "There is no good value before or after the period; widen it or choose a fixed value.", reason_bracket_not_good: "The counter is lower after the period than before; that is a reset or a replaced meter, not a sensor error.",
  reason_fixed_outside: "The fixed value lies outside the good values before and after; a counter must not fall.",
  abort_no_range_statistics: "The statistics no longer exist.", abort_bad_range: "The period is no longer valid.", abort_no_bracket: "There is no good value before or after any more.", abort_bracket_not_good: "The counter is lower after the period than before.", abort_fixed_outside: "The fixed value lies outside the good values.",
});
Object.assign(TEXT.de, {
  spikeFound: "{range}: Werte bis {extreme} {unit} statt etwa {good} {unit}", rangeTake: "Als Bereich übernehmen",
  rangeWindow: "Verlauf ansehen", rangeWindowHint: "Zeigt die Werte, in denen du den Zeitraum mit den Reglern wählst.", rangeDays: "Letzte {days} Tage", rangeLoad: "Verlauf anzeigen",
  rangeChartLabel: "Verlauf des Sensors mit dem gewählten Zeitraum", rangeNoData: "In diesem Fenster gibt es keine Werte.", rangeTable_short_term: "5-Minuten-Werte", rangeTable_long_term: "Stundenwerte",
});
Object.assign(TEXT.en, {
  spikeFound: "{range}: values up to {extreme} {unit} instead of about {good} {unit}", rangeTake: "Use as range",
  rangeWindow: "Show readings", rangeWindowHint: "Shows the values on which you pick the period with the sliders.", rangeDays: "Last {days} days", rangeLoad: "Show readings",
  rangeChartLabel: "Readings of the sensor with the picked period", rangeNoData: "There are no values in this window.", rangeTable_short_term: "5-minute rows", rangeTable_long_term: "Hourly rows",
});

// FindingStatusMixin: the status of a finding as the list shows it. Some are decided by the user (known,
// snoozed, hidden), some follow from what Housekeeper sees (new, in work, fixed). Nothing here stores anything:
// the decisions are the ones of the ignore list, the rest is derived from the scan and the journal of plans.
const NEW_FINDING_DAYS = 7, FIXED_DAYS = 30, ACTIVE_PLAN = ["dry_run", "backup", "running"];
const FINDING_STATES = ["new", "inwork", "known", "snoozed", "hidden"];

class FindingStatusMixin {
  // The objects of drafted or running plans, and those a finished plan changed lately; rebuilt when the journal changes.
  planSets() {
    if (this._planSets?.journal === this.journal) return this._planSets;
    const active = new Set(), done = new Map(), limit = Date.now() - FIXED_DAYS * 864e5;
    for (const plan of this.journal || []) {
      if (ACTIVE_PLAN.includes(plan.status)) (plan.objects || []).forEach(id => active.add(id));
      const at = plan.finished_at ? Date.parse(plan.finished_at) : 0;
      if (at >= limit) (plan.done_objects || []).forEach(id => { if (!done.has(id) || done.get(id) < at) done.set(id, at); });
    }
    this._planSets = { journal: this.journal, active, done };
    return this._planSets;
  }

  // What the user decided: known (kept on purpose), snoozed, hidden; "" for an open finding.
  decidedState(f) {
    if (!f.ignored) return "";
    if (f.ignored_by !== "user") return "hidden";
    const kind = f.ignore_info?.kind;
    return kind === "keep" ? "known" : kind === "snooze" ? "snoozed" : "hidden";
  }

  isNewFinding(f) { return !f.ignored && f.first_detected_at && Date.parse(f.first_detected_at) >= Date.now() - NEW_FINDING_DAYS * 864e5; }

  inWork(f) { return !f.ignored && this.planSets().active.has(f.object_id); }

  // Does a finding belong to the chosen status? "" is the default: everything not decided.
  statusMatch(f) {
    switch (this.findingStatus) {
      case "": return !f.ignored;
      case "all": return true;
      case "new": return this.isNewFinding(f);
      case "inwork": return this.inWork(f);
      default: return this.decidedState(f) === this.findingStatus;
    }
  }

  statusCount(state) {
    const list = this.data.findings;
    if (state === "") return list.filter(f => !f.ignored).length;
    return list.filter(f => (state === "new" ? this.isNewFinding(f) : state === "inwork" ? this.inWork(f) : this.decidedState(f) === state)).length;
  }

  // "New", "In work" next to a row's other facts.
  statusTags(f) {
    return [this.isNewFinding(f) ? this.t("stateNew") : "", this.inWork(f) ? this.t("stateInwork") : ""].filter(Boolean).map(x => ` · ${x}`).join("");
  }

  statusChips() {
    const chip = (state, label, count) => `<button class="chip ${(this.findingStatus || "") === state ? "active" : ""}" data-fstatus="${state || "open"}">${label} (${this.formatNumber(count)})</button>`;
    const decided = FINDING_STATES.filter(s => this.statusCount(s));
    return decided.length ? [chip("", this.t("stateOpen"), this.statusCount("")), ...decided.map(s => chip(s, this.t(`state_${s}`), this.statusCount(s)))].join("") : "";
  }

  // Objects a plan changed lately that no longer have a finding: the closed cases.
  fixedLately() {
    const withFinding = new Set(this.data.findings.map(f => f.object_id));
    return [...this.planSets().done].filter(([id]) => !withFinding.has(id)).sort((a, b) => b[1] - a[1]);
  }

  fixedCard() {
    const fixed = this.fixedLately();
    if (!fixed.length) return "";
    const rows = fixed.slice(0, 20).map(([id, at]) => `<div class="row"><span class="tile ok"><ha-icon icon="mdi:check"></ha-icon></span><span class="row-text"><strong>${this.esc(this.findObject(`entity:${id}`)?.name || id)}</strong><small>${this.esc(id)} · ${this.formatDate(new Date(at).toISOString())}</small></span></div>`).join("");
    return this.fold("fixed_lately", { tone: "ok", title: this.t("fixedTitle", { days: FIXED_DAYS }), pill: this.formatNumber(fixed.length) }, rows, false);
  }

  // The form under the selection bar: known or snoozed for all selected findings at once.
  bulkForm() {
    const b = this.bulk;
    if (!b) return "";
    if (b.kind === "label") {
      const labels = (this.data.objects || []).filter(o => o.object_type === "label").sort((x, y) => String(x.name).localeCompare(String(y.name)));
      if (!labels.length) return `<div class="polform bulkform"><small>${this.t("labelNone")}</small><button type="button" class="btn quiet" data-bulk-cancel>${this.t("cancelRun")}</button></div>`;
      return `<form class="polform bulkform" data-bulk-form><strong>${this.t("state_label")}</strong>
        <select data-bulk-label aria-label="${this.esc(this.t("labelChoose"))}">${labels.map(l => `<option value="${this.esc(l.object_id)}" ${b.label === l.object_id ? "selected" : ""}>${this.esc(l.name)}</option>`).join("")}</select>
        <button type="submit" class="btn primary">${this.t("refactorPlan")}</button><button type="button" class="btn quiet" data-bulk-cancel>${this.t("cancelRun")}</button>
        ${b.error ? `<small class="error" role="alert">${this.esc(this.t(b.error))}</small>` : ""}</form>`;
    }
    const days = [7, 30, 90, 365].map(n => `<option value="${n}" ${Number(b.days) === n ? "selected" : ""}>${this.t("decideDays", { n })}</option>`).join("");
    return `<form class="polform bulkform" data-bulk-form><strong>${this.t(`state_${b.kind}`)}</strong>
      <input data-bulk-reason maxlength="200" autocomplete="off" value="${this.esc(b.reason)}" aria-label="${this.esc(this.t("decideReason"))}" placeholder="${this.esc(this.t(b.kind === "known" ? "decideReasonNeeded" : "decideReason"))}">
      ${b.kind === "snoozed" ? `<select data-bulk-days aria-label="${this.esc(this.t("decideHow"))}">${days}</select>` : ""}
      <button type="submit" class="btn primary">${this.t("saveOptions")}</button><button type="button" class="btn quiet" data-bulk-cancel>${this.t("cancelRun")}</button>
      ${b.error ? `<small class="error" role="alert">${this.esc(this.t(b.error))}</small>` : ""}</form>`;
  }

  // Adding a label is a plan like any other: it opens under Cleanup with a preview and an undo.
  async makeLabelPlan() {
    const b = this.bulk;
    const ids = [...new Set([...this.findSel].map(key => this.data.findings.find(f => f.key === key)).filter(Boolean)
      .filter(f => ["entity", "automation"].includes(this.findObject(this.findingKey(f))?.object_type)).map(f => f.object_id))];
    if (!ids.length) { b.error = "labelNoEntities"; this.render(); return; }
    const label = b.label || (this.data.objects || []).find(o => o.object_type === "label")?.object_id;
    try {
      const plan = await this._hass.callWS({ type: "ha_housekeeper/plan_create", actions: ids.map(object_id => ({ kind: "add_label", object_id, target: label })) });
      this.plan = plan; this.confirmation = null; this.ack = new Set(); this.confirmWord = "";
      this.journal = [plan, ...(this.journal || [])];
      this.noteJump?.("cleanup"); this.view = "cleanup"; this.pages = {};
      this.bulk = null; this.findSel.clear();
    } catch (err) { b.error = ""; this.error = err?.message || String(err); }
    this.render();
  }

  async commitBulk() {
    const b = this.bulk;
    if (!b) return;
    if (b.kind === "label") return this.makeLabelPlan();
    if (b.kind === "known" && !b.reason.trim()) { b.error = "decideNeedReason"; this.render(); return; }
    const keys = [...this.findSel].filter(key => this.data.findings.some(f => f.key === key && !f.ignored));
    try {
      for (const key of keys) {
        const msg = { type: "ha_housekeeper/ignore", finding_key: key, ignored: true, kind: b.kind === "known" ? "keep" : "snooze", reason: b.reason.trim() };
        if (b.kind === "snoozed") msg.days = Number(b.days);
        await this._hass.callWS(msg);
        const finding = this.data.findings.find(f => f.key === key);
        if (finding) {
          finding.ignored = true; finding.ignored_by = "user"; finding.resurfaced = false;
          finding.ignore_info = { kind: msg.kind, reason: msg.reason, until: msg.days ? new Date(Date.now() + msg.days * 864e5).toISOString() : null, at: new Date().toISOString() };
        }
      }
      this._rev++;
    } catch (err) { this.error = err?.message || String(err); }
    this.bulk = null; this.findSel.clear();
    this.render();
  }

  // "This is no duplicate": a known finding with the reason filled in.
  async markNotDuplicate(key) {
    try {
      await this._hass.callWS({ type: "ha_housekeeper/ignore", finding_key: key, ignored: true, kind: "keep", reason: this.t("notDuplicateReason") });
      const finding = this.data.findings.find(f => f.key === key);
      if (finding) { finding.ignored = true; finding.ignored_by = "user"; finding.resurfaced = false; finding.ignore_info = { kind: "keep", reason: this.t("notDuplicateReason"), until: null, at: new Date().toISOString() }; this._rev++; }
    } catch (err) { this.error = err?.message || String(err); }
    this.render();
  }

  bindFindingStatus(root) {
    root.querySelectorAll("[data-fstatus]").forEach(el => el.onclick = () => { const s = el.dataset.fstatus === "open" ? "" : el.dataset.fstatus; this.findingStatus = this.findingStatus === s ? "" : s; this.pages = {}; this.render(); });
    root.querySelectorAll("[data-fsel-state]").forEach(el => el.onclick = () => { this.bulk = { kind: el.dataset.fselState, reason: "", days: 30, error: "" }; this.render(); this.shadowRoot?.querySelector?.("[data-bulk-reason]")?.focus?.(); });
    root.querySelectorAll("[data-notdup]").forEach(el => el.onclick = () => this.markNotDuplicate(el.dataset.notdup));
    const form = root.querySelector("[data-bulk-form]");
    if (form) {
      form.onsubmit = ev => { ev.preventDefault(); this.commitBulk(); };
      const reason = form.querySelector("[data-bulk-reason]");
      if (reason) reason.oninput = ev => { this.bulk.reason = ev.target.value; };
      const label = form.querySelector("[data-bulk-label]");
      if (label) label.onchange = ev => { this.bulk.label = ev.target.value; };
      const days = form.querySelector("[data-bulk-days]");
      if (days) days.onchange = ev => { this.bulk.days = Number(ev.target.value); };
      form.querySelector("[data-bulk-cancel]").onclick = () => { this.bulk = null; this.render(); };
    }
  }
}
Object.assign(TEXT.de, {
  stateOpen: "Offen", stateNew: "Neu", stateInwork: "In Arbeit", state_new: "Neu", state_inwork: "In Arbeit", state_known: "Bekannt", state_snoozed: "Zurückgestellt", state_hidden: "Ausgeblendet",
  fixedTitle: "Zuletzt behoben (letzte {days} Tage)", fselKnown: "Als bekannt markieren", fselSnooze: "Zurückstellen", fselLabel: "Label ergänzen", state_label: "Label ergänzen", labelChoose: "Label", labelNone: "Es gibt noch kein Label. Lege in Home Assistant eines an (Einstellungen → Bereiche, Labels & Zonen → Labels).", labelNoEntities: "Unter der Auswahl sind keine Entitäten oder Automationen.", confirmedSummaryLabel: "{count} Entitäten bekommen ein Label (nur in Home Assistant, Rückgängig entfernt es wieder).", reason_label_missing: "Das Label gibt es nicht mehr.", reason_already_labelled: "Hat dieses Label schon.", result_labeled: "Label ergänzt", undo_unlabelled: "Label wieder entfernt",
  notDuplicate: "Ist kein Duplikat", notDuplicateReason: "Kein Duplikat (bestätigt)", openTwin: "Funktionierende Entität öffnen", markKnown: "Als bekannt markieren",
});
Object.assign(TEXT.en, {
  stateOpen: "Open", stateNew: "New", stateInwork: "In work", state_new: "New", state_inwork: "In work", state_known: "Known", state_snoozed: "Snoozed", state_hidden: "Hidden",
  fixedTitle: "Fixed lately (last {days} days)", fselKnown: "Mark as known", fselSnooze: "Snooze", fselLabel: "Add label", state_label: "Add label", labelChoose: "Label", labelNone: "There is no label yet. Create one in Home Assistant (Settings → Areas, labels & zones → Labels).", labelNoEntities: "The selection holds no entities or automations.", confirmedSummaryLabel: "{count} entities get a label (in Home Assistant only, undo takes it off again).", reason_label_missing: "The label no longer exists.", reason_already_labelled: "Already has this label.", result_labeled: "Label added", undo_unlabelled: "label taken off again",
  notDuplicate: "Not a duplicate", notDuplicateReason: "Not a duplicate (confirmed)", openTwin: "Open the working entity", markKnown: "Mark as known",
});

// DetailActionsMixin: the card "What you can do" on the overview of an object. It collects what the other views
// already offer for this one object: decide its findings, and start a plan (replace, disable, label) that opens under
// Cleanup with a preview. Nothing here changes anything by itself.
class DetailActionsMixin {
  // The entity ids a missing reference points to; only entities can be replaced by another entity.
  missingEntities(key) {
    return [...new Set(this.data.findings.filter(f => !f.ignored && this.findingKey(f) === key && f.classification === "broken_reference" && f.rule_id.endsWith("_entity") && String(f.affected_object).includes(".")).map(f => f.affected_object))];
  }

  fixButtons(item, key) {
    const open = this.data.findings.filter(f => !f.ignored && this.findingKey(f) === key);
    const tile = (attr, icon, label, hint) => `<button class="taskcard" ${attr}><ha-icon icon="${icon}"></ha-icon><strong>${label}</strong><small>${this.t(hint)}</small></button>`;
    const out = this.missingEntities(key).map(id => tile(`data-act-replace="${this.esc(id)}"`, "mdi:swap-horizontal", `${this.t("actReplace")} ${this.esc(id)}`, "actHintReplace"));
    const broken = open.some(f => f.classification === "broken_reference");
    if (item.object_type === "entity" && open.some(f => f.rule_id.startsWith("entity.") && ["orphaned", "unavailable"].includes(f.classification))) {
      out.push(tile(`data-act-replace="${this.esc(item.object_id)}"`, "mdi:swap-horizontal", this.t("actReplaceThis"), "actHintReplace"));
      if (item.status !== "disabled") out.push(tile(`data-act-disable="${this.esc(item.object_id)}"`, "mdi:cancel", this.t("actDisable"), "actHintDisable"));
    }
    // A sensor with long-term statistics can have wrong values repaired or be swapped for a new meter.
    if (item.object_type === "entity" && item.has_statistics && item.object_id.startsWith("sensor.")) {
      out.push(tile(`data-act-repair="${this.esc(item.object_id)}"`, "mdi:chart-line", this.t("actRepairValues"), "actHintRepair"));
      out.push(tile(`data-act-meter="${this.esc(item.object_id)}"`, "mdi:gauge", this.t("actMeter"), "actHintMeter"));
    }
    if (item.object_type === "device") out.push(tile(`data-act-exchange="${this.esc(item.object_id)}"`, "mdi:devices", this.t("actExchange"), "actHintExchange"));
    return { buttons: out.join(""), broken };
  }

  labelForm(item) {
    if (!["entity", "automation"].includes(item.object_type)) return "";
    const labels = (this.data.objects || []).filter(o => o.object_type === "label").sort((x, y) => String(x.name).localeCompare(String(y.name)));
    if (!labels.length) return "";
    const chosen = this.actLabel && labels.some(l => l.object_id === this.actLabel) ? this.actLabel : labels[0].object_id;
    return `<div class="labelbox"><span class="tile"><ha-icon icon="mdi:label-outline"></ha-icon></span><div class="labeltext"><strong>${this.t("actLabelTitle")}</strong><small>${this.t("actLabelHint")}</small></div>
      <select data-act-label aria-label="${this.esc(this.t("labelChoose"))}">${labels.map(l => `<option value="${this.esc(l.object_id)}" ${chosen === l.object_id ? "selected" : ""}>${this.esc(l.name)}</option>`).join("")}</select>
      <button class="btn primary" data-act-label-plan="${this.esc(item.object_id)}">${this.t("actLabelPreview")}</button></div>`;
  }

  actionsCard(item, key) {
    const rows = this.findingRows(key);
    const { buttons, broken } = this.fixButtons(item, key);
    const label = this.labelForm(item);
    if (!rows && !buttons && !label) return "";
    const fix = buttons || label ? `<div class="pad actpad"><small class="factnote">${this.t("actPreviewOnly")}</small>${buttons ? `<div class="taskgrid compactgrid">${buttons}</div>` : ""}${label}${broken ? `<small class="factnote">${this.t("actEditInHa")}</small>` : ""}</div>` : "";
    return `<section class="panel"><div class="panelhead"><h2>${this.t("actionsTitle")}</h2></div>${rows}${fix}</section>`;
  }

  // The Cleanup view takes over from here: the assistant is filled in, the person looks at the preview and confirms.
  startCleanup(kind, fill) {
    this.noteJump?.("cleanup");
    this.cleanupKind = kind; this.cleanupSel = new Set(); this.plan = null; fill();
    if (this.lv.cleanup) this.lv.cleanup.f = {};
    this.view = viewForKind(kind); (this.viewTab ||= {}).cleanup = ["remove_entity", "remove_device", "forget_device"].includes(kind) ? "quarantine" : DEVICE_KINDS.includes(kind) ? "devices" : "entities"; if (kind === "remove_device" || kind === "forget_device") this.quarantineType = "device"; else if (kind === "remove_entity") this.quarantineType = "entity"; this.repairTask = this.view === "repair" ? kind : null; this.pages = {}; this.selected = null;
    this.render();
  }

  async planLabel(entityId, label) {
    try {
      const plan = await this._hass.callWS({ type: "ha_housekeeper/plan_create", actions: [{ kind: "add_label", object_id: entityId, target: label }] });
      this.plan = plan; this.confirmation = null; this.ack = new Set(); this.confirmWord = "";
      this.journal = [plan, ...(this.journal || [])];
      this.noteJump?.("cleanup"); this.view = "cleanup"; this.pages = {}; this.selected = null;
    } catch (err) { this.error = err?.message || String(err); }
    this.render();
  }

  // Opens the repair assistant on the readings of this sensor: at the range a scan found, else at the last seven days.
  repairValues(id) {
    this.startCleanup("repair_counter", () => { this.counterId = id; this.counterRangeReq = null; });
    const suggest = (this.counterScan?.items || []).find(i => i.statistic_id === id)?.findings?.[0]?.suggest;
    if (suggest) this.takeRange(id, suggest.from, suggest.to); else this.loadRangeSeries();
  }

  bindDetailActions(root) {
    root.querySelectorAll("[data-act-repair]").forEach(el => el.onclick = () => this.repairValues(el.dataset.actRepair));
    root.querySelectorAll("[data-act-meter]").forEach(el => el.onclick = () => this.startCleanup("migrate_meter", () => { this.meterOld = el.dataset.actMeter; this.meterNew = ""; }));
    root.querySelectorAll("[data-act-exchange]").forEach(el => el.onclick = () => this.startCleanup("exchange_device", () => { const ex = this.exchangeState(); ex.oldDev = el.dataset.actExchange; ex.newDev = ""; ex.result = null; ex.choices = {}; }));
    root.querySelectorAll("[data-act-replace]").forEach(el => el.onclick = () => this.startCleanup("replace_references", () => { this.replOld = el.dataset.actReplace; this.replNew = ""; }));
    root.querySelectorAll("[data-act-disable]").forEach(el => el.onclick = () => this.startCleanup("disable_entity", () => this.cleanupSel.add(el.dataset.actDisable)));
    root.querySelector("[data-act-label]")?.addEventListener("change", e => { this.actLabel = e.target.value; });
    root.querySelector("[data-act-label-plan]")?.addEventListener("click", e => this.planLabel(e.currentTarget.dataset.actLabelPlan, root.querySelector("[data-act-label]")?.value || this.actLabel));
  }
}
Object.assign(TEXT.de, {
  actionsTitle: "Was möchtest du tun?", actReplace: "Ersetzen:", actReplaceThis: "Durch andere Entität ersetzen", actDisable: "Deaktivieren planen",
  actLabelTitle: "Label ergänzen", actLabelHint: "Fügt ein vorhandenes Label hinzu, zum Beispiel zum Filtern. Du siehst zuerst eine Vorschau.", actLabelPreview: "Vorschau erstellen",
  actPreviewOnly: "Hier startest du nur eine Vorschau. Geändert wird erst, wenn du sie bestätigst.",
  actEditInHa: "Eine einzelne Referenz entfernt Housekeeper nicht selbst. Öffne die Automation in Home Assistant und bearbeite sie dort.",
});
Object.assign(TEXT.en, {
  actionsTitle: "What would you like to do?", actReplace: "Replace:", actReplaceThis: "Replace by another entity", actDisable: "Plan to disable",
  actLabelTitle: "Add a label", actLabelHint: "Adds an existing label, for example for filtering. You see a preview first.", actLabelPreview: "Create preview",
  actPreviewOnly: "This only starts a preview. Nothing changes until you confirm it.",
  actEditInHa: "Housekeeper does not remove a single reference itself. Open the automation in Home Assistant and edit it there.",
});

// Navigation split: Cleanup (remove what is not needed), Repair (fix what stays) and the shared Journal.
Object.assign(TEXT.de, {
  planResultDone: "Plan", undoYes: "Ja, rückgängig machen", undoAskOne: "Diese Änderung zurücksetzen?", undoAskAll: "Alles rückgängig machen?",
  undoAskAllHint: "Housekeeper stellt zurück, was dieser Plan geändert hat, soweit es unverändert ist.", undoAllHint: "Housekeeper kann zurückstellen, was dieser Plan geändert hat, solange es unverändert ist.", reportTitle: "Prüfbericht",
  statusTasks: "{count} Aufgaben warten auf dich", statusAllGood: "Alles in Ordnung",
  counterNoneSub: "{count} Sensoren sehen unauffällig aus.", counterRescan: "Neu prüfen", counterNotChecked: "Noch nicht geprüft", counterNotCheckedSub: "Housekeeper sucht falsche Werte in Zählern und Messwerten.", counterScanNow: "Sensoren jetzt prüfen",
  stepChoose: "Auswahl", stepSetup: "Einstellen", stepPreview: "Vorschau",
  setLanguage: "Sprache", setLanguageHint: "Gilt für dieses Panel und wird in deinem Benutzerprofil gespeichert. Automatisch folgt der Sprache von Home Assistant.", langAuto: "Automatisch",
  setTabProtection: "Sicherheit", setTabNotify: "Benachrichtigungen", setTabGoals: "Wartungsziele", setHintLook: "Sprache, Dichte und Darstellung.", setHintProtection: "Schutzmodus: was Housekeeper ändern darf.", setHintScan: "Wann und wie oft geprüft wird, und Grenzwerte.", setHintNotify: "Meldung bei neuen kaputten Referenzen.", setHintGoals: "Eigene Grenzen für „in Ordnung“.", setHintHidden: "Befunde, die du ausgeblendet hast.", setHintInfo: "Version, Diagnose und Support.",
  setEveryHours: "alle {n} h", setManual: "von Hand", setOn: "an", setOff: "aus",
  maintHintBackup: "Backups prüfen und schützen.", maintHintPreflight: "Vor einem Update auf Probleme prüfen.", maintHintBlueprints: "Blueprints, die fehlen oder defekt sind.", maintHintDevices: "Entfernte Geräte ansehen.", maintHintWindow: "Zeitraum für Wartung und Neustarts.", maintHintGoals: "Eigene Grenzen für „in Ordnung“.",
  actRepairValues: "Werte reparieren", actHintRepair: "Falsche Werte im Verlauf und in der Statistik ersetzen.", actMeter: "Zähler wechseln", actHintMeter: "Die Statistik bei einem neuen Zähler fortführen.", actExchange: "Gerät austauschen", actHintExchange: "Durch ein neues Gerät ersetzen und alles übernehmen.",
  actHintReplace: "Überall durch eine andere Entität ersetzen.", actHintDisable: "Erst deaktivieren; nach der Wartezeit entfernen.",
  navGroupActions: "Aktionen",
  err_cleanup_busy: "Ein Plan läuft gerade. Housekeeper lädt die Ansicht neu, sobald er fertig ist.", tilesTitle: "Was möchtest du tun?", tilesCleanupHint: "Verwaiste Entitäten und Geräte deaktivieren oder entfernen.", tilesRepairHint: "Sensorfehler, Zähler, Verweise und Geräte in Ordnung bringen.", tilesMaintenanceHint: "Backups, Update-Preflight, Blueprints und Wartungsziele.", tilesFindingsHint: "Alle Auffälligkeiten durchgehen und entscheiden.",
  tilesReady: "{count} bereit", tilesMissed: "{count} Ziele verfehlt", tilesOpen: "{count} offen",
  goalMissedTitle: "{goal}: Ziel verfehlt", goalsLine: "Wartungsziele: {met} von {total} erfüllt", hintsTitle: "Hinweise",
  healthScore: "{percent} % der Objekte ohne Befund", healthTasks: "{count} Aufgaben offen", healthNoTasks: "keine offenen Aufgaben", healthTip: "{affected} von {base} bewerteten Objekten sind betroffen; gezählt werden Objekte, nicht einzelne Befunde. Der Status ist so gut wie der schlechtere von zwei Werten: der Anteil der Objekte ohne Befund und die offenen Aufgaben (kaputte Integrationen, verfehlte Wartungsziele, Backup- oder Datenbankprobleme). Ausgeblendete Befunde zählen nicht. Die Zahl im Ring ist der abgerundete Anteil ohne Befund, minus 4 Punkte je offener Aufgabe und 10 je dringender.",
  repair: "Reparieren", repairSubtitle: "Dinge in Ordnung bringen, die bleiben sollen. Housekeeper zeigt erst eine Vorschau; geschrieben wird erst nach deiner Bestätigung.",
  journalSubtitle: "Alle Pläne aus Aufräumen und Reparieren: was geändert wurde, was geprüft wurde und was sich rückgängig machen lässt.",
 relTileIntHint: "Verfügbarkeit {avail} in {window}", relTilePill: "{n} auffällig", relTileUnstableHint: "Entitäten, die oft zwischen Zuständen wechseln", recTileLoadRows: "{n} Einträge pro Tag ({window})", recTileLoadHint: "Welche Entitäten den Recorder füllen", recTileCostsTop: "Größter Posten: {name} ({share} %)", recTileCostsHint: "Wer wie viel Platz belegt", recTileDbHint: "Größe, Wachstum und Aufbewahrung", polTileRulesHint: "{on} eingeschaltet", polTileViolationsHint: "Verstöße gegen eingeschaltete Regeln", polTileHidden: "{n} ausgeblendet", expoTileFindingsHint: "Was du prüfen oder wissen solltest", expoTileSourceHint: "{n} Entitäten freigegeben", runsTileRunsHint: "Gezählte Läufe von Automationen und Skripten", runsTileQualityHint: "Sieben Blickwinkel je Automation",
  cleanupTabEntities: "Entitäten deaktivieren", cleanupTabDevices: "Geräte deaktivieren", cleanupTabQuarantine: "Quarantäne und Entfernen", cleanupReadyCount: "{count} bereit", cleanupTileEntitiesHint: "Verwaist oder lange nicht verfügbar", cleanupTileDevicesHint: "Geräte ohne funktionierende Entität", cleanupTileQuarantineHint: "Frühestens nach {days} Tagen entfernbar", cleanupTileUnusedHint: "Entitäten ohne bekannte Verwendung", cleanupTileStatsHint: "Reste in der Datenbank löschen", cleanupTilePurgesHint: "Was schon gelöscht wurde", qTypeEntities: "Entitäten ({count})", qTypeDevices: "Geräte ({count})",
  repairTitle: "Was möchtest du reparieren?", repairHint: "Wähle eine Aufgabe. Jede führt in Schritten durch, mit Vorschau und Bestätigung.", repairBack: "Alle Aufgaben", repairFound: "{count} Funde", repairNotChecked: "nicht geprüft", repairNoneFound: "keine Funde",
  repairTaskCounter: "Sensorfehler bereinigen", repairTaskCounterHint: "Falsche Werte in Zählern und Messwerten korrigieren, zum Beispiel ein Zähler, der kurz sinkt, oder ein Ausschlag auf 85 °C.",
  repairTaskMeter: "Zähler wechseln", repairTaskMeterHint: "Die Statistik eines alten Zählers beim neuen fortführen.",
  repairTaskReplace: "Verweise ersetzen", repairTaskReplaceHint: "Eine Entität überall durch eine andere ersetzen (Automationen, Dashboards, Energie).",
  repairTaskExchange: "Gerät austauschen", repairTaskExchangeHint: "Ein defektes Gerät durch ein neues ersetzen und alles übernehmen.",
});
Object.assign(TEXT.en, {
  planResultDone: "Plan", undoYes: "Yes, undo", undoAskOne: "Undo this change?", undoAskAll: "Undo everything?",
  undoAskAllHint: "Housekeeper puts back what this plan changed, as far as it is still unchanged.", undoAllHint: "Housekeeper can put back what this plan changed, as long as it is unchanged.", reportTitle: "Audit report",
  statusTasks: "{count} tasks are waiting for you", statusAllGood: "All good",
  counterNoneSub: "{count} sensors look fine.", counterRescan: "Check again", counterNotChecked: "Not checked yet", counterNotCheckedSub: "Housekeeper looks for wrong values in counters and measurements.", counterScanNow: "Check sensors now",
  stepChoose: "Choose", stepSetup: "Set up", stepPreview: "Preview",
  setLanguage: "Language", setLanguageHint: "Applies to this panel and is saved in your user profile. Automatic follows the language of Home Assistant.", langAuto: "Automatic",
  setTabProtection: "Safety", setTabNotify: "Notifications", setTabGoals: "Maintenance goals", setHintLook: "Language, density and appearance.", setHintProtection: "Protection mode: what Housekeeper may change.", setHintScan: "When and how often it checks, and limits.", setHintNotify: "A message for new broken references.", setHintGoals: "Your own limits for what in order means.", setHintHidden: "Findings you have hidden.", setHintInfo: "Version, diagnostics and support.",
  setEveryHours: "every {n} h", setManual: "manual", setOn: "on", setOff: "off",
  maintHintBackup: "Check and protect backups.", maintHintPreflight: "Check for problems before an update.", maintHintBlueprints: "Blueprints that are missing or broken.", maintHintDevices: "Look at removed devices.", maintHintWindow: "A period for maintenance and restarts.", maintHintGoals: "Your own limits for what in order means.",
  actRepairValues: "Repair values", actHintRepair: "Replace wrong values in the history and the statistics.", actMeter: "Replace the meter", actHintMeter: "Carry the statistics on with a new meter.", actExchange: "Exchange the device", actHintExchange: "Replace it with a new device and carry everything over.",
  actHintReplace: "Replace it with another entity everywhere.", actHintDisable: "Disable first; remove after the waiting time.",
  navGroupActions: "Actions",
  err_cleanup_busy: "A plan is running. Housekeeper reloads the view as soon as it has finished.", tilesTitle: "What would you like to do?", tilesCleanupHint: "Disable or remove orphaned entities and devices.", tilesRepairHint: "Fix sensor errors, meters, references and devices.", tilesMaintenanceHint: "Backups, update preflight, blueprints and maintenance goals.", tilesFindingsHint: "Go through every finding and decide.",
  tilesReady: "{count} ready", tilesMissed: "{count} goals missed", tilesOpen: "{count} open",
  goalMissedTitle: "{goal}: goal missed", goalsLine: "Maintenance goals: {met} of {total} met", hintsTitle: "Hints",
  healthScore: "{percent}% of objects without a finding", healthTasks: "{count} tasks open", healthNoTasks: "no open tasks", healthTip: "{affected} of {base} rated objects are affected; objects are counted, not single findings. The status is the worse of two readings: the share of objects without a finding, and the open tasks (broken integrations, missed maintenance goals, backup or database problems). Hidden findings do not count. The number in the ring is the share without a finding, rounded down, minus 4 points for each open task and 10 for an urgent one.",
  repair: "Repair", repairSubtitle: "Fix things that are meant to stay. Housekeeper shows a preview first; nothing is written until you confirm.",
  journalSubtitle: "Every plan from Tidy up and Repair: what changed, what was checked and what can be undone.",
 relTileIntHint: "Availability {avail} over {window}", relTilePill: "{n} need a look", relTileUnstableHint: "Entities that often change between states", recTileLoadRows: "{n} rows a day ({window})", recTileLoadHint: "Which entities fill the recorder", recTileCostsTop: "Biggest item: {name} ({share} %)", recTileCostsHint: "Who takes how much space", recTileDbHint: "Size, growth and retention", polTileRulesHint: "{on} switched on", polTileViolationsHint: "Violations of the rules that are on", polTileHidden: "{n} hidden", expoTileFindingsHint: "What you should check or know", expoTileSourceHint: "{n} entities exposed", runsTileRunsHint: "Counted runs of automations and scripts", runsTileQualityHint: "Seven views of each automation",
  cleanupTabEntities: "Disable entities", cleanupTabDevices: "Disable devices", cleanupTabQuarantine: "Quarantine and removal", cleanupReadyCount: "{count} ready", cleanupTileEntitiesHint: "Orphaned or unavailable for a long time", cleanupTileDevicesHint: "Devices without a working entity", cleanupTileQuarantineHint: "Removable after {days} days at the earliest", cleanupTileUnusedHint: "Entities with no known use", cleanupTileStatsHint: "Delete leftovers in the database", cleanupTilePurgesHint: "What has been deleted already", qTypeEntities: "Entities ({count})", qTypeDevices: "Devices ({count})",
  repairTitle: "What would you like to repair?", repairHint: "Pick a task. Each one leads through the steps, with a preview and a confirmation.", repairBack: "All tasks", repairFound: "{count} found", repairNotChecked: "not checked", repairNoneFound: "none found",
  repairTaskCounter: "Repair sensor errors", repairTaskCounterHint: "Correct wrong values in counters and measurements, for example a counter that briefly falls, or a spike to 85 °C.",
  repairTaskMeter: "Replace a meter", repairTaskMeterHint: "Carry the statistics of an old meter on with the new one.",
  repairTaskReplace: "Replace references", repairTaskReplaceHint: "Replace one entity with another everywhere (automations, dashboards, energy).",
  repairTaskExchange: "Exchange a device", repairTaskExchangeHint: "Replace a broken device with a new one and carry everything over.",
});

// PickerMixin: a text field that lists matching objects while typing, like the search in the top bar. A field is
// described by its name: where its text lives, which objects it may offer and what picking one does.
class PickerMixin {
  pickerDef(name) {
    return {
      counter: {
        get: () => this.counterId || "", set: v => { this.counterId = v; }, min: 1, types: ["entity"],
        filter: o => o.has_statistics && o.object_id.startsWith("sensor."), pick: o => { this.counterId = o.object_id; },
      },
      graph: {
        get: () => this.graphQuery, set: v => { this.graphQuery = v; }, min: 2, types: null, limit: 15,
        pick: o => { this.noteGraphStep(o); this.graphSelected = o; this.graphQuery = ""; this.graphLimit = GRAPH_NODE_STEP; },
      },
    }[name];
  }

  pickerResults(name) {
    const def = this.pickerDef(name), q = def ? String(def.get()).trim() : "";
    if (!def || q.length < def.min) return [];
    return this.searchObjects(q, { types: def.types, limit: def.limit || QUICK_LIMIT, filter: def.filter });
  }

  // The input plus, while it is open, the list of matches. `attrs` carries the field's own data attribute.
  pickerBox(name, placeholder, attrs = "") {
    const def = this.pickerDef(name), value = def.get();
    const open = this._picker?.name === name && this._picker.open && String(value).trim().length >= def.min;
    const results = open ? this.pickerResults(name) : [];
    const active = Math.min(this._picker?.index || 0, Math.max(results.length - 1, 0));
    const sub = o => (def.types?.length === 1 ? o.object_id : `${this.t(o.object_type)} · ${o.object_id}`);
    const list = open ? `<ul class="quicklist" id="picker-${name}" role="listbox" aria-label="${this.esc(this.t("quickLabel"))}">${results.length
      ? results.map((o, i) => `<li role="option" id="picker-${name}-${i}" aria-selected="${i === active}" data-picker-item="${this.esc(this.objectKey(o))}" data-picker-name="${name}" class="${i === active ? "on" : ""}">${this.tile(o.object_type)}<span class="row-text"><strong>${this.esc(o.name)}</strong><small>${this.esc(sub(o))}</small></span></li>`).join("")
      : `<li class="none">${this.t("quickNone")}</li>`}</ul>` : "";
    return `<div class="picker"><input type="text" data-picker="${name}" ${attrs} value="${this.esc(value)}" placeholder="${this.esc(placeholder)}" autocomplete="off" role="combobox" aria-expanded="${Boolean(open)}" aria-controls="picker-${name}" aria-autocomplete="list" ${open && results.length ? `aria-activedescendant="picker-${name}-${active}"` : ""}>${list}</div>`;
  }

  pickerPick(name, key) {
    const obj = this.findObject(key);
    if (obj) this.pickerDef(name).pick(obj);
    this._picker = { name, open: false, index: 0 };
    this.render();
  }

  bindPicker(root) {
    root.querySelectorAll("[data-picker]").forEach(input => {
      const name = input.dataset.picker;
      input.oninput = () => { this.pickerDef(name).set(input.value.trim()); this._picker = { name, open: true, index: 0 }; this.scheduleRender(); };
      input.onkeydown = ev => {
        const results = this._picker?.open ? this.pickerResults(name) : [];
        if ((ev.key === "ArrowDown" || ev.key === "ArrowUp") && results.length) {
          ev.preventDefault();
          this._picker.index = (this._picker.index + (ev.key === "ArrowDown" ? 1 : results.length - 1)) % results.length;
          this.render();
        } else if (ev.key === "Enter" && results.length) {
          ev.preventDefault();
          this.pickerPick(name, this.objectKey(results[Math.min(this._picker.index, results.length - 1)]));
        } else if (ev.key === "Escape" && this._picker?.open) {
          ev.stopPropagation();
          this._picker.open = false; this.render();
        }
      };
    });
    root.querySelectorAll("[data-picker-item]").forEach(el => { el.onclick = () => this.pickerPick(el.dataset.pickerName, el.dataset.pickerItem); });
    if (!this._pickerBound && root.addEventListener) {
      this._pickerBound = true;
      root.addEventListener("click", ev => {
        if (!this._picker?.open || (ev.composedPath?.() || []).some(node => node.classList?.contains?.("picker"))) return;
        this._picker.open = false; this.render();
      });
    }
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
    this.findingFilter = ""; this.findingAfter = false; this.findingDue = false; this.showFollowers = false; this.goals = null; this.goalsLoading = false; this.goalForm = null; this.decide = null; this.markForm = null;
    this.findingStatus = ""; this.bulk = null;
    this.batteryFilter = "low";

    this._urlApplied = false;
    this.sort = "name";
    this.selected = null;
    this.detailTab = "overview";
    this.settingsTab = "look";
    this.trail = [];
    this.compare = null;
    this.compareBaseline = "previous";
    this.compareLoading = false;
    this.graphSelected = null;
    this.graphTrail = []; this.graphOrigin = null; this.viewTrail = []; this._tabOf = new Map(); this.viewTab = {};
    this.details = new Map();
    this.detailLoading = false;
    this.graphQuery = "";
    this.graphDepth = 1; this.graphRel = ""; this.graphConf = "all"; this.graphImpact = false; this.graphLimit = GRAPH_NODE_STEP; this.graphOpen = new Set();
    this.pages = {};
    this.lv = {};
    this.unrefTab = "entities";
    this.cleanupSel = new Set();
    this.findSel = new Set();
    this.purgeSel = new Set(); this.purgeOpen = false; this.purgeStates = true; this.purgeWord = ""; this.purgeBusy = false; this.purgeResult = null;
    this.cleanupKind = "disable_entity";
    this.replOld = ""; this.replNew = "";
    this.meterOld = ""; this.meterNew = ""; this.meterMode = "both";
    this.ex = null; this.report = null; this.reportClear = true; this.reportMessage = "";
    this.runs = null; this.runsLoading = false; this.runsError = ""; this.exposure = null; this.exposureLoading = false; this.exposureError = ""; this._exposureRequested = false; this.policies = null; this.policiesLoading = false; this.policiesError = ""; this._policiesRequested = false; this.policyShowHidden = false; this.orphanLast = null; this.orphanLastLoading = false; this._orphanLastRequested = false; this.dbHealth = null; this.dbLoading = false; this.dbError = ""; this._dbRequested = false; this.storms = null; this.stormsLoading = false; this.stormsError = ""; this.stormsWindow = 1; this._stormsRequested = null; this.reliability = null; this.relLoading = false; this.relError = ""; this.relWindow = 7; this.relCompare = false; this.quickQuery = ""; this.quickOpen = false; this.quickIndex = 0; this.backup = null; this.backupLoading = false; this.backupError = ""; this.preflight = null; this.costs = null; this.costSort = "recent"; this.costsLoading = false; this.preflightLoading = false;
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
    this._gone = false;
    this._basePath = typeof window === "undefined" ? null : window.location.pathname;
    this._onPop = () => this.onPopState();
    window.addEventListener?.("popstate", this._onPop);
    this.installFonts();
    this.render();
  }

  // Timers and late answers must not touch a panel that HA has taken out of the page.
  disconnectedCallback() {
    this._gone = true;
    window.removeEventListener?.("popstate", this._onPop);
    for (const name of ["_warmupTimer", "_searchTimer", "_tipTimer"]) {
      if (this[name]) globalThis.clearTimeout?.(this[name]);
      this[name] = null;
    }
  }

  // The browser's back button steps back inside the panel. One history entry is kept in front of
  // the panel's own back steps while there is somewhere to go back to.
  canGoBack() {
    return Boolean(this.view === "graph" ? this.graphTrail?.length || this.graphOrigin : this.selected || this.viewTrail?.length);
  }

  onPopState() {
    if (this._ignorePop) { this._ignorePop = false; return; }
    this._guard = false;
    if (this._gone || window.location.pathname !== this._basePath || !this.canGoBack()) return;
    if (this.view === "graph") this.graphBack();
    else if (this.selected) this.goBack();
    else this.viewBack();
  }

  syncGuard() {
    if (typeof window === "undefined" || !window.history || window.location.pathname !== this._basePath) return;
    try {
      if (this.canGoBack() && !this._guard) { window.history.pushState(window.history.state, "", window.location.href); this._guard = true; }
      else if (!this.canGoBack() && this._guard) { this._guard = false; this._ignorePop = true; window.history.back(); }
    } catch (_) { /* no history access: the panel's own back buttons still work */ }
  }

  installFonts() {
    const head = globalThis.document?.head;
    if (!head || globalThis.document.getElementById("hk-fonts")) return;
    const style = globalThis.document.createElement("style");
    style.id = "hk-fonts"; style.textContent = FONT_CSS;
    head.appendChild(style);
  }

  get lang() {
    const chosen = this.prefs?.language;
    if (chosen === "de" || chosen === "en") return chosen;
    return String(this._hass?.language || "en").toLowerCase().startsWith("de") ? "de" : "en";
  }

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
      this.error = this.errText(err);
      // A plan that is running or a Home Assistant that is still starting only delays the first picture: ask again.
      if (["cleanup_busy", "warming_up"].includes(err?.code)) this.retryWarmup(10000);
    } finally {
      if (progressTimer) window.clearInterval(progressTimer);
      this.scanStatus = null;
      this.busy = false; this.render();
    }
    if (this.view === "changes" && this.data) this.loadCompare();
    if (this.data) this.ensureSafetyData();
    // Preliminary data: fetch the final scan once the backend's warm-up is over.
    if (this.data?.meta?.preliminary) {
      const wait = ((Number(this.data.meta.warmup_seconds_left) || 0) + 20) * 1000;
      this.retryWarmup(wait);
    }
  }

  // Asks again until the final scan has replaced the preliminary one; a busy panel or a failed request tries again later.
  retryWarmup(wait) {
    if (this._warmupTimer) window.clearTimeout(this._warmupTimer);
    this._warmupTimer = window.setTimeout(() => {
      if (!this._hass || this.busy) { this.retryWarmup(15000); return; }
      this.load().then(() => { if (this.data?.meta?.preliminary || this.error) this.retryWarmup(20000); });
    }, wait);
  }

  async updateScanStatus() {
    try {
      this.scanStatus = await this._hass.callWS({ type: "ha_housekeeper/status" });
      this.renderProgress();
    } catch (_) { /* The main scan request reports actionable errors. */ }
  }

  // The scrolling element: HA's page scrolls the document or one of the panel's ancestors.
  scroller() {
    for (let node = this; node; node = node.parentNode || node.host) {
      if (node.scrollTop > 0) return node;
    }
    return globalThis.document?.scrollingElement || null;
  }

  // Where the page was scrolled when it is left, so "back" can land at the same spot.
  rememberScroll() { return this.scroller?.()?.scrollTop || 0; }

  restoreScroll(top) {
    if (!top) return;
    const run = () => { const el = this.scroller?.() || globalThis.document?.scrollingElement; if (el) el.scrollTop = top; };
    if (globalThis.requestAnimationFrame) globalThis.requestAnimationFrame(run); else run();
  }

  async openObject(obj) {
    if (this.selected && this.selected !== obj) { this.trail.push(this.selected); this._tabOf.set(this.objectKey(this.selected), this.detailTab); }
    else if (!this.selected) this._listScroll = this.rememberScroll();
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

  goBack() {
    this.selected = this.trail.pop() || null;
    this.detailTab = (this.selected && this._tabOf.get(this.objectKey(this.selected))) || "overview";
    this.render();
    if (!this.selected) this.restoreScroll(this._listScroll);
  }

  // The graph opened from a detail page or a list: it remembers where, so "back" returns there.
  openGraph(obj) {
    if (!obj) return;
    if (this.selected) this._tabOf.set(this.objectKey(this.selected), this.detailTab);
    this.graphOrigin = { view: this.view, selected: this.selected, trail: this.trail, tab: this.detailTab, scroll: this.rememberScroll() };
    this.graphTrail = [];
    this.graphSelected = obj; this.graphQuery = ""; this.graphLimit = GRAPH_NODE_STEP;
    this.view = "graph"; this.selected = null; this.trail = [];
    this.render();
  }

  // Going to another node of the graph keeps the one left behind for "back".
  noteGraphStep(obj) {
    if (this.graphSelected && this.graphSelected !== obj) this.graphTrail.push(this.graphSelected);
  }

  // Leaving a page through a link (not the menu) keeps it for "back".
  noteJump(view) {
    if (view !== this.view) this.viewTrail.push({ view: this.view, scroll: this.rememberScroll() });
  }

  // Back from the graph: one node at a time, then to where the graph was opened from.
  graphBack() {
    const previous = this.graphTrail.pop();
    if (previous) { this.graphSelected = previous; this.graphLimit = GRAPH_NODE_STEP; this.render(); return; }
    const from = this.graphOrigin;
    this.graphOrigin = null;
    if (!from) return;
    this.view = from.view; this.selected = from.selected; this.trail = from.trail;
    this.detailTab = from.tab || "overview";
    this.render();
    this.restoreScroll(from.scroll);
  }

  // What the graph's back button names: the node before, or the page the graph was opened from.
  graphBackLabel() {
    const node = this.graphTrail[this.graphTrail.length - 1];
    if (node) return node.name;
    const from = this.graphOrigin;
    return from ? (from.selected ? from.selected.name : this.t(from.view)) : "";
  }

  // Back after a jump from one page to another (overview card to a list and the like).
  viewBack() {
    const from = this.viewTrail.pop();
    if (!from) return;
    this.view = from.view; this.pages = {};
    this.render();
    this.restoreScroll(from.scroll);
  }

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

  // One tooltip for name and id: the name in bold, the id below. The browser's own tooltip cannot style the two lines.
  showTip(el) {
    const root = this.shadowRoot;
    let tip = this._tip;
    if (!tip || tip.parentNode !== root) { tip = this._tip = document.createElement("div"); tip.className = "tip"; tip.setAttribute("role", "tooltip"); root.appendChild(tip); }
    tip.innerHTML = `<strong>${this.esc(el.dataset.tip)}</strong><span>${this.esc(el.dataset.tipSub || "")}</span>`;
    const box = el.getBoundingClientRect();
    tip.style.left = `${Math.max(8, Math.min(box.left, globalThis.innerWidth - 320))}px`;
    tip.style.top = `${box.bottom + 6}px`;
    tip.hidden = false;
  }

  hideTip() { if (this._tip) this._tip.hidden = true; }

  render() {
    if (!this.shadowRoot) return;
    if (this._searchTimer) { globalThis.clearTimeout?.(this._searchTimer); this._searchTimer = null; }
    const started = this._debug ? globalThis.performance?.now?.() : null;
    const focus = this.captureFocus();
    const shell = `<div class="shell${this.dense ? " dense" : ""}"><div class="stickyhead">${this.topbar()}${this.safetyBar()}</div><main class="main">${this.selected && this.data ? this.detail() : `${this.heading()}${this.content()}`}</main><div class="sr-only" role="status" aria-live="polite">${this.esc(this.liveStatus())}</div></div>`;
    // The style sheet is only parsed again when the theme changed; otherwise just the page is replaced.
    const root = this.shadowRoot, css = this.themeCss(), current = root.querySelector?.(".shell");
    if (current && this._styleKey === css && root.querySelector("style[data-hk]")) current.outerHTML = shell;
    else { root.innerHTML = `${this.styles()}${shell}`; this._styleKey = css; }
    this.restoreFocus(focus);
    this.bind();
    if (started !== null) console.debug(`[ha_housekeeper] render ${this.selected ? "detail" : this.view}: ${(globalThis.performance.now() - started).toFixed(1)} ms`);
    if (this.data) { this.syncGuard(); this.syncUrl(); }
  }

  // Deep links: /ha-housekeeper?view=findingsNav&filter=orphaned or ?object=entity:sensor.x
  applyUrl() {
    if (this._urlApplied || typeof window === "undefined" || !this.data) return;
    this._urlApplied = true;
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view") === "storms" ? "recorder" : params.get("view"); // the load view moved into "Recorder"
    if (view && (view === "unreferenced" || NAV.some(([name]) => name === view))) this.view = view;
    else if (!params.get("object") && this.prefs.startView !== "overview") this.view = this.prefs.startView;
    if (params.get("filter")) this.findingFilter = params.get("filter");
    this._pendingTab = params.get("tab");
    if (view && params.get("tab") && !params.get("object")) (this.viewTab ||= {})[this.view] = params.get("tab");
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
      if (this.viewTab?.[this.view]) params.set("tab", this.viewTab[this.view]);
      if (this.view === "findingsNav" && this.findingFilter) params.set("filter", this.findingFilter);
    }
    const query = params.toString();
    try { window.history.replaceState(window.history.state, "", window.location.pathname + (query ? `?${query}` : "")); } catch (_) { /* ignore */ }
  }

  topbar() {
    const counts = this.data ? { inventory: this.formatNumber(this.data.meta.object_count), findingsNav: this.data.findings.filter(f => !f.ignored).length, batteries: this.lowBatteries().length || undefined, reminders: (this.data.reminders || []).filter(r => r.state === "due").length || undefined, cleanup: this.readyQuarantine() || undefined, repair: this.counterScan?.items?.length || undefined } : {};
    const item = view => `<button class="nav ${this.view === view ? "active" : ""}" data-view="${view}" ${this.view === view ? 'aria-current="page"' : ""}><ha-icon icon="${NAV_ICONS[view]}"></ha-icon><span>${this.t(view)}</span>${counts[view] !== undefined ? `<em>${counts[view]}</em>` : ""}</button>`;
    const [direct, ...menus] = NAV_GROUPS;
    const menu = ([label, views]) => {
      const open = this.menuOpen === label;
      return `<div class="navmenu${open ? " open" : ""}"><button class="nav menubtn ${views.includes(this.view) ? "group-active" : ""}" data-menu="${label}" aria-expanded="${open}" aria-controls="menu-${label}"><span>${this.t(label)}</span><ha-icon class="caret" icon="mdi:chevron-down"></ha-icon></button><div class="navpop" id="menu-${label}" role="group" aria-label="${this.esc(this.t(label))}"><p class="navhead" aria-hidden="true">${this.t(label)}</p>${views.map(item).join("")}</div></div>`;
    };
    return `<header class="top${this.navOpen ? " open" : ""}"><div class="brand"><span class="brandmark"><img src="/ha_housekeeper/logo.png" alt="" onerror="this.parentNode.classList.add('nologo');this.remove()"><ha-icon icon="mdi:broom"></ha-icon></span><strong>${this.t("title")}</strong></div>
      <button class="navtoggle" data-navtoggle aria-expanded="${Boolean(this.navOpen)}" aria-controls="topnav"><ha-icon icon="mdi:menu"></ha-icon><span>${this.t("navMenu")}</span></button>
      <nav class="topnav" id="topnav" aria-label="${this.esc(this.t("navMain"))}">${direct[1].map(item).join("")}${menus.map(menu).join("")}<div class="navend">${this.quickSearchBox()}${item("settings")}</div></nav></header>`;
  }

  // The small line above the title names the menu group the view belongs to.
  // Placeholder lines while a card loads; the text stays for screen readers.
  skeleton(key) {
    return `<div class="skeleton" role="status" aria-live="polite"><span class="sr-only">${this.t(key)}</span><i></i><i></i><i></i></div>`;
  }

  // "Not counted: 2 hidden, 1 disabled": what a view left out, so a short list is not mistaken for a clean bill.
  excludedText(excluded) {
    const e = excluded || {}, parts = [];
    if (e.ignored) parts.push(this.t("exclIgnored", { n: this.formatNumber(e.ignored) }));
    if (e.disabled) parts.push(this.t("exclDisabled", { n: this.formatNumber(e.disabled) }));
    if (e.permanent) parts.push(this.t("exclPermanent", { n: this.formatNumber(e.permanent) }));
    return parts.length ? this.t("exclLine", { list: parts.join(", ") }) : "";
  }

  // One line that says how complete the numbers are, so a precise figure does not pretend more.
  coverageNote(text) {
    return `<p class="factnote coverage"><ha-icon icon="mdi:information-outline"></ha-icon><span>${text}</span></p>`;
  }

  eyebrowFor(view) {
    if (view === "settings") return this.t("title");
    if (view === "overview") return this.t("navGroupOverview");
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
      reminders: [this.t("reminders"), this.t("remindersSubtitle")],
      unreferenced: [this.t("unreferenced"), this.t("unreferencedSubtitle")],
      graph: [this.t("pathTitle"), this.t("pathSubtitle")],
      settings: [this.t("settings"), this.t("settingsSubtitle")],
      cleanup: [this.t("cleanup"), this.t("cleanupSubtitle")],
      repair: [this.t("repair"), this.t("repairSubtitle")],
      journal: [this.t("journal"), this.t("journalSubtitle")],
      maintenance: [this.t("maintenance"), this.t("maintenanceSubtitle")],
      reliability: [this.t("reliability"), this.t("reliabilitySubtitle")],
      runs: [this.t("runsHeading"), this.t("runsSubtitle")],
      recorder: [this.t("recorder"), this.t("recorderSubtitle")],
      exposure: [this.t("exposure"), this.t("exposureSubtitle")],
      policies: [this.t("policies"), this.t("policiesSubtitle")],
    };
    const [title, sub] = titles[this.view] || titles.overview;
    const scanned = this.data?.meta?.scanned_at;
    const ago = scanned ? `<span class="scanago" title="${this.esc(this.formatDate(scanned))}">${this.t("lastScan")}: ${this.agoText(scanned)}</span>` : "";
    const from = this.viewTrail[this.viewTrail.length - 1];
    // Every back button sits in this row at the top of the page, like the one of the detail page.
    const graphBack = this.view === "graph" && this.graphSelected && this.graphBackLabel() ? `<button class="btn" data-action="graph-back"><ha-icon icon="mdi:arrow-left"></ha-icon>${this.t("backTo")} ${this.esc(this.graphBackLabel())}</button>` : "";
    const viewBack = from ? `<button class="btn" data-action="view-back"><ha-icon icon="mdi:arrow-left"></ha-icon>${this.t("backTo")} ${this.t(from.view)}</button>` : "";
    const back = graphBack || viewBack ? `<div class="crumbs">${viewBack}${graphBack}</div>` : "";
    return `${back}<div class="heading"><div><p class="eyebrow">${this.eyebrowFor(this.view)}</p><h1>${title}</h1><span class="sub">${sub}</span></div>
      <div class="head-actions">${ago}<button class="btn primary" data-action="scan" ${this.busy || this.cleanupRunning() ? "disabled" : ""}>${this.scanButtonInner()}</button></div></div>${this.warmupBanner()}`;
  }

  content() {
    if (this.view === "settings") return this.settingsView();
    if (this.error) return `<div class="error"><strong>${this.t("loadError")}</strong><br>${this.esc(this.error)}</div>`;
    if (!this.data) return `${this.skeleton("loading")}`;
    if (this.view === "inventory") return this.inventory();
    if (this.view === "findingsNav") return this.findingsView();
    if (this.view === "changes") return this.changesView();
    if (this.view === "batteries") return this.batteriesView();
    if (this.view === "reminders") return this.remindersView();
    if (this.view === "unreferenced") return this.unreferencedView();
    if (this.view === "cleanup") return this.cleanupView();
    if (this.view === "repair") return this.repairView();
    if (this.view === "journal") return this.journalView();
    if (this.view === "maintenance") return this.maintenanceView();
    if (this.view === "reliability") return this.reliabilityView();
    if (this.view === "recorder") return this.recorderView();
    if (this.view === "exposure") return this.exposureView();
    if (this.view === "policies") return this.policiesView();
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
    root.querySelectorAll("[data-view]").forEach(el => el.onclick = () => { this.menuOpen = null; this.navOpen = false; this.view = el.dataset.view; this.pages = {}; this.selected = null; this.trail = []; this.viewTrail = []; this.graphTrail = []; this.graphOrigin = null; this.render(); if (this.view === "changes" && !this.compare) this.loadCompare(); });
    root.querySelectorAll("[data-menu]").forEach(el => el.onclick = () => { this.menuOpen = this.menuOpen === el.dataset.menu ? null : el.dataset.menu; this.render(); });
    this.bindQuick(root);
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
    root.querySelectorAll("[data-view-tab]").forEach(el => {
      el.onclick = () => this.pickViewTab(el.dataset.viewTab);
      el.onkeydown = ev => {
        const tabs = [...el.parentElement.querySelectorAll("[data-view-tab]")].map(b => b.dataset.viewTab), at = tabs.indexOf(el.dataset.viewTab);
        const next = { ArrowRight: tabs[(at + 1) % tabs.length], ArrowLeft: tabs[(at - 1 + tabs.length) % tabs.length], Home: tabs[0], End: tabs[tabs.length - 1] }[ev.key];
        if (!next) return;
        ev.preventDefault();
        this.pickViewTab(next);
        const target = this.shadowRoot.querySelector(`[data-view-tab="${next}"]`);
        target?.focus();
        target?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
      };
    });
    root.querySelector("[data-action='graph-back']")?.addEventListener("click", () => this.graphBack());
    root.querySelector("[data-action='view-back']")?.addEventListener("click", () => this.viewBack());
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
    root.querySelectorAll("[data-graph-open]").forEach(el => el.onclick = () => this.openGraph(this.findObject(el.dataset.graphOpen)));
    root.querySelectorAll("[data-safe]").forEach(el => el.onclick = () => {
      if (el.dataset.safeKey === "mode") this.settingsTab = "protection";
      this.noteJump(el.dataset.safe); this.view = el.dataset.safe; this.pages = {}; this.selected = null;
      this.render();
    });
    root.querySelectorAll("[data-jump]").forEach(el => el.onclick = () => {
      this.noteJump(el.dataset.jump);
      this.view = el.dataset.jump; this.pages = {};
      if (el.dataset.jumpTab) (this.viewTab ||= {})[this.view] = el.dataset.jumpTab;
      if (el.dataset.filter !== undefined) this.findingFilter = el.dataset.filter;
      if (el.dataset.jump === "inventory") { this.statusFilter = el.dataset.status || ""; this.typeFilter = el.dataset.type || ""; this.pages = {}; }
      this.render();
    });
    root.querySelectorAll("[data-tip]").forEach(el => { el.onmouseenter = () => this.showTip(el); el.onmouseleave = () => this.hideTip();
      const holder = el.closest?.("tr") || (el.hasAttribute?.("tabindex") ? el : null);
      if (holder) { holder.onfocus = () => this.showTip(el); holder.onblur = () => this.hideTip(); }
      // Touch: a long press shows the tooltip for a few seconds and does not open the object.
      el.ontouchstart = () => { globalThis.clearTimeout?.(this._tipTimer); this._tipTimer = globalThis.setTimeout?.(() => { this._tipShownAt = Date.now(); this.showTip(el); globalThis.clearTimeout?.(this._tipHide); this._tipHide = globalThis.setTimeout?.(() => this.hideTip(), 4000); }, 500); };
      el.ontouchend = el.ontouchmove = el.ontouchcancel = () => globalThis.clearTimeout?.(this._tipTimer);
      el.oncontextmenu = ev => { if (Date.now() - (this._tipShownAt || 0) < 1500) ev.preventDefault(); };
      el.addEventListener?.("click", ev => { if (Date.now() - (this._tipShownAt || 0) < 800) { ev.stopImmediatePropagation(); ev.preventDefault(); } });
    });
    root.querySelectorAll("[data-col-open]").forEach(el => el.onclick = () => { this._colOpen = this._colOpen === el.dataset.colOpen ? "" : el.dataset.colOpen; this.render(); });
    root.querySelectorAll("[data-col]").forEach(el => el.onchange = () => { const [id, key] = el.dataset.col.split("|"); this.toggleCol(id, key); });
    root.querySelectorAll("[data-export-list]").forEach(el => el.onclick = () => this.exportList(el.dataset.exportList));
    root.querySelectorAll("[data-life-save]").forEach(el => el.onclick = () => this.saveLifeNote(el.dataset.lifeSave, root.querySelector("#lifeNote")?.value || ""));
    root.querySelectorAll("[data-win-act]").forEach(el => el.onclick = () => { const [name, ...rest] = el.dataset.winAct.split(":"); this.winAct(name, rest.join(":")); });
    root.querySelectorAll("[data-inv-filter]").forEach(el => el.onclick = () => { const [type, status] = el.dataset.invFilter.split("|"); this.typeFilter = type; this.statusFilter = status; this.pages = {}; this.render(); });
    root.querySelectorAll("[data-type-jump]").forEach(el => el.onclick = () => { this.noteJump("inventory"); this.typeFilter = el.dataset.typeJump; this.statusFilter = ""; this.pages = {}; this.view = "inventory"; this.render(); });
    root.querySelectorAll("[data-export]").forEach(el => el.onclick = () => this.exportFindings(el.dataset.export));
    this.bindFindingStatus(root);
    this.bindDetailActions(root);
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
    root.querySelector("[data-toggle-followers]")?.addEventListener("click", () => { this.showFollowers = !this.showFollowers; this.pages = {}; this.render(); });
    root.querySelector("[data-finding-due]")?.addEventListener("click", () => { this.findingDue = !this.findingDue; this.pages = {}; this.render(); });
    this.bindMarks(root);
    this.bindGoals(root);
    this.bindExchange(root);
    this.bindDiagnostics(root);
    this.bindTraceDiag(root);
    this.bindRefactor(root);
    this.bindBatteryCare(root);
    this.bindCounter(root);
    this.bindPicker(root);
    root.querySelectorAll("[data-decide-open]").forEach(el => el.onclick = () => this.openDecide(el.dataset.decideOpen, el.dataset.decidePreset));
    root.querySelectorAll("[data-decide-form]").forEach(form => {
      form.onsubmit = ev => { ev.preventDefault(); this.commitDecide(); };
      form.querySelector("[data-decide-kind]").onchange = ev => { this.decide.kind = ev.target.value; this.decide.error = ""; if (this.decide.kind === "snooze" && !Number(this.decide.days)) this.decide.days = 30; this.render(); };
      form.querySelector("[data-decide-reason]").oninput = ev => { this.decide.reason = ev.target.value; };
      form.querySelector("[data-decide-days]").onchange = ev => { this.decide.days = Number(ev.target.value); };
      form.onkeydown = ev => { if (ev.key === "Escape") { ev.preventDefault(); this.decide = null; this.render(); } };
    });
    root.querySelectorAll("[data-decide-cancel]").forEach(el => el.onclick = () => { this.decide = null; this.render(); });
    root.querySelectorAll("[data-finding-after]").forEach(el => el.onclick = () => { this.findingAfter = !this.findingAfter; this.pages = {}; this.render(); });
    root.querySelectorAll("[data-finding-filter]").forEach(el => el.onclick = () => { this.findingFilter = el.dataset.findingFilter; this.pages = {}; this.render(); });
    const searchField = (selector, setter) => {
      const input = root.querySelector(selector);
      if (input) input.oninput = () => { setter(input.value); this.scheduleRender(); };
    };
    searchField("#query", v => { this.query = v; this.pages = {}; });
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
    const openByKey = el => el.onkeydown = ev => {
      if (ev.target !== el || (ev.key !== "Enter" && ev.key !== " ")) return;
      ev.preventDefault();
      if (el.click) el.click(); else el.onclick?.();
    };
    root.querySelectorAll("tr[data-object], g[data-graph]").forEach(openByKey);
    root.querySelectorAll("g[data-graph-group]").forEach(openByKey);
    root.querySelectorAll("[data-graph-depth]").forEach(el => el.onclick = () => { this.graphDepth = Number(el.dataset.graphDepth); this.graphLimit = GRAPH_NODE_STEP; this.render(); });
    root.querySelector("[data-graph-impact]")?.addEventListener("click", () => { this.graphImpact = !this.graphImpact; this.render(); });
    root.querySelector("[data-graph-more]")?.addEventListener("click", () => { this.graphLimit += GRAPH_NODE_STEP; this.render(); });
    const gr = root.querySelector("#graphRel"); if (gr) gr.onchange = () => { this.graphRel = gr.value; this.render(); };
    const gc = root.querySelector("#graphConf"); if (gc) gc.onchange = () => { this.graphConf = gc.value; this.render(); };
    root.querySelectorAll("[data-graph-group]").forEach(el => el.onclick = () => { this.graphOpen.add(el.dataset.graphGroup); this.render(); });
    root.querySelector("[data-graph-regroup]")?.addEventListener("click", () => { this.graphOpen = new Set(); this.render(); });
    root.querySelectorAll("[data-graph]").forEach(el => el.onclick = () => { const obj = this.findObject(el.dataset.graph); if (obj) { this.noteGraphStep(obj); this.graphSelected = obj; this.graphQuery = ""; this.graphLimit = GRAPH_NODE_STEP; this.render(); } });
    root.querySelectorAll("[data-ha-path]").forEach(el => el.onclick = () => this.navigateHA(el.dataset.haPath));
    root.querySelectorAll("[data-pref]").forEach(el => el.onclick = () => { const [key, value] = el.dataset.pref.split("|"); this.setPref(key, value); });
    root.querySelectorAll("[data-pref-select]").forEach(el => el.onchange = () => this.setPref(el.dataset.prefSelect, el.value));
    root.querySelectorAll("[data-unref-tab]").forEach(el => el.onclick = () => { this.unrefTab = el.dataset.unrefTab; if (this.view === "cleanup") (this.viewTab ||= {}).cleanup = this.unrefTab === "statistics" ? "stats" : "unused"; this.retryOrphanLast(); this.pages = {}; this.render(); });
    root.querySelector("[data-diagnostics]")?.addEventListener("click", () => this.downloadText("diagnostics.json", JSON.stringify(this.diagnosticsData(), null, 2), "application/json"));
    root.querySelectorAll("[data-protection]").forEach(el => el.addEventListener("change", ev => this.setProtection(ev.target.value)));
    root.querySelector("[data-notify]")?.addEventListener("change", async ev => {
      try { await this._hass.callWS({ type: "ha_housekeeper/notify_set", enabled: ev.target.checked }); this.data.meta.notify = ev.target.checked; }
      catch (err) { this.error = err?.message || String(err); }
      this.render();
    });
    root.querySelector("[data-bp-refresh]")?.addEventListener("click", () => { this._blueprintsRequested = false; this.blueprints = null; this.render(); });
    root.querySelector("[data-weekly]")?.addEventListener("click", () => this.weeklyReport());
    root.querySelectorAll("[data-fsel]").forEach(el => el.onchange = () => { el.checked ? this.findSel.add(el.dataset.fsel) : this.findSel.delete(el.dataset.fsel); this.render(); });
    root.querySelector("[data-fsel-page]")?.addEventListener("click", () => { (this._findPage || []).forEach(key => this.findSel.add(key)); this.render(); });
    root.querySelector("[data-fsel-clear]")?.addEventListener("click", () => { this.findSel.clear(); this.render(); });
    root.querySelector("[data-fsel-hide]")?.addEventListener("click", () => this.hideSelectedFindings());
    root.querySelectorAll("[data-sel]").forEach(el => el.onchange = () => { el.checked ? this.cleanupSel.add(el.dataset.sel) : this.cleanupSel.delete(el.dataset.sel); this.render(); });
    root.querySelector("[data-sel-page]")?.addEventListener("click", () => { (this._cleanupVisible || []).forEach(id => this.cleanupSel.add(id)); this.render(); });
    root.querySelector("[data-sel-clear]")?.addEventListener("click", () => { this.cleanupSel.clear(); this.render(); });
    root.querySelector("[data-recorder-choice]")?.addEventListener("change", ev => { this.cleanupRecorder = ev.target.value; this.render(); });
    root.querySelectorAll("[data-qtype]").forEach(el => el.onclick = () => { this.quarantineType = el.dataset.qtype; this.cleanupKind = el.dataset.qtype === "device" ? "remove_device" : "remove_entity"; this.cleanupSel = new Set(); if (this.lv.cleanup) this.lv.cleanup.f = {}; this.pages = {}; this.render(); });
    const kind = root.querySelector("[data-cleanup-kind]"); if (kind) kind.onchange = () => { this.cleanupKind = kind.value; this.cleanupSel = new Set(); if (this.lv.cleanup) this.lv.cleanup.f = {}; this.pages = {}; this.render(); };
    root.querySelectorAll("[data-repair-task]").forEach(el => el.onclick = () => { this.repairTask = el.dataset.repairTask; this.cleanupKind = this.repairTask; this.cleanupSel = new Set(); this.plan = null; this.render(); });
    root.querySelector("[data-repair-back]")?.addEventListener("click", () => { this.repairTask = null; this.render(); });
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
    root.querySelector("[data-undo-all]")?.addEventListener("click", () => { this.undoAsk = "all"; this.render(); });
    root.querySelector("[data-undo-all-yes]")?.addEventListener("click", () => this.undoPlan());
    root.querySelectorAll("[data-undo-one]").forEach(el => el.onclick = () => { this.undoAsk = el.dataset.undoOne; this.render(); });
    root.querySelectorAll("[data-undo-one-yes]").forEach(el => el.onclick = () => this.undoPlan([el.dataset.undoOneYes]));
    root.querySelectorAll("[data-undo-no]").forEach(el => el.onclick = () => { this.undoAsk = null; this.render(); });
    root.querySelector("[data-plan-create]")?.addEventListener("click", () => this.createPlan());
    root.querySelector("[data-repl-old]")?.addEventListener("change", e => { this.replOld = e.target.value.trim(); if (this.replNew && this.replNew.split(".")[0] !== this.replOld.split(".")[0]) this.replNew = ""; this.render(); });
    root.querySelectorAll("[data-repl-pick]").forEach(el => el.onclick = () => { this.replNew = el.dataset.replPick; this.render(); });
    root.querySelectorAll("[data-meter-pick]").forEach(el => el.onclick = () => { this.meterNew = el.dataset.meterPick; this.render(); });
    root.querySelectorAll("[data-psel]").forEach(el => el.onchange = () => { el.checked ? this.purgeSel.add(el.dataset.psel) : this.purgeSel.delete(el.dataset.psel); this.render(); });
    root.querySelector("[data-purge-page]")?.addEventListener("click", () => { (this._purgePage || []).forEach(id => this.purgeSel.add(id)); this.render(); });
    root.querySelector("[data-purge-clear]")?.addEventListener("click", () => { this.purgeSel.clear(); this.purgeOpen = false; this.render(); });
    root.querySelector("[data-purge-open]")?.addEventListener("click", () => { this.purgeOpen = true; this.purgeWord = ""; this.purgeResult = null; this.render(); });
    root.querySelector("[data-purge-close]")?.addEventListener("click", () => { this.purgeOpen = false; this.render(); });
    root.querySelector("[data-purge-states]")?.addEventListener("change", e => { this.purgeStates = e.target.checked; this.render(); });
    root.querySelector("[data-purge-word]")?.addEventListener("input", e => { this.purgeWord = e.target.value; const b = root.querySelector("[data-purge-run]"); if (b) b.disabled = e.target.value.trim() !== this.t("purgeWord") || this.purgeBusy; });
    root.querySelector("[data-purge-run]")?.addEventListener("click", () => this.purgeRun());
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
    root.querySelector("[data-rel-compare]")?.addEventListener("click", () => { this.relCompare = !this.relCompare; this.reliability = null; this.loadReliability(); });
    root.querySelectorAll("[data-rel-window]").forEach(el => el.onclick = () => { this.relWindow = Number(el.dataset.relWindow); this.reliability = null; this.pages.relentries = 1; this.pages.relunstable = 1; this.loadReliability(); });
    root.querySelectorAll("[data-storm-window]").forEach(el => el.onclick = () => { this.stormsWindow = Number(el.dataset.stormWindow); this.storms = null; this.pages.stormfind = 1; this.pages.stormentities = 1; this.loadStorms(); });
    root.querySelector("[data-storm-refresh]")?.addEventListener("click", () => this.loadStorms(true));
    root.querySelector("[data-rel-refresh]")?.addEventListener("click", () => this.loadReliability(true));
    root.querySelector("[data-expo-refresh]")?.addEventListener("click", () => this.loadExposure());
    root.querySelector("[data-policy-refresh]")?.addEventListener("click", () => this.loadPolicies());
    root.querySelectorAll("[data-pol-rule]").forEach(el => el.onclick = () => { this.polRule = el.dataset.polRule; this.pages = {}; this.render(); });
    root.querySelector("[data-policy-hidden]")?.addEventListener("click", () => { this.policyShowHidden = !this.policyShowHidden; this.render(); });
    root.querySelectorAll("[data-policy-toggle]").forEach(el => el.onchange = () => this.changePolicy({ type: "ha_housekeeper/set_policy", rule: el.dataset.policyToggle, enabled: el.checked }));
    root.querySelector("[data-policy-limit-save]")?.addEventListener("click", () => this.setPolicyLimit(root.querySelector("#polLimit")?.value));
    root.querySelector("[data-policy-prefix-add]")?.addEventListener("click", () => this.addPolicyPrefix(root.querySelector("#polDomain")?.value, root.querySelector("#polPrefix")?.value));
    root.querySelectorAll("[data-policy-prefix-remove]").forEach(el => el.onclick = () => this.removePolicyPrefix(el.dataset.policyPrefixRemove));
    root.querySelectorAll("[data-policy-ignore]").forEach(el => el.onclick = () => this.changePolicy({ type: "ha_housekeeper/ignore", finding_key: el.dataset.policyIgnore, ignored: el.dataset.policyValue === "1" }));
    root.querySelector("[data-db-refresh]")?.addEventListener("click", () => this.loadDbHealth(true));
    root.querySelector("[data-bh-refresh]")?.addEventListener("click", () => this.loadBackup());
    root.querySelectorAll("[data-bh-save]").forEach(el => el.onclick = () => {
      const kind = el.dataset.bhSave, date = root.querySelector(`[data-bh-date="${kind}"]`)?.value;
      this.loadBackup({ type: "ha_housekeeper/backup_attest", kind, ...(date ? { date } : {}) });
    });
    root.querySelectorAll("[data-fold]").forEach(el => el.onclick = () => { this.folds = { ...this.folds, [el.dataset.fold]: el.getAttribute("aria-expanded") !== "true" }; this.render(); });
    root.querySelectorAll("[data-expo-all]").forEach(el => el.onclick = () => { this.expoAll = { ...this.expoAll, [el.dataset.expoAll]: true }; this.render(); });
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
    root.querySelectorAll("[data-merge-sel]").forEach(el => el.onchange = () => { this.mergeSel = new Set(this.mergeSel || []); el.checked ? this.mergeSel.add(el.dataset.mergeSel) : this.mergeSel.delete(el.dataset.mergeSel); this.render(); });
    root.querySelector("[data-merge]")?.addEventListener("click", () => this.mergePlans());
    root.querySelectorAll("[data-plan-delete]").forEach(el => el.onclick = () => this.deletePlan(el.dataset.planDelete));
    root.querySelector("[data-opts-save]")?.addEventListener("click", () => this.saveOptions());
    // Saving stays off until a threshold differs from the saved one; typing must not rebuild the page.
    const optInputs = [...root.querySelectorAll("[data-opt]")];
    optInputs.forEach(el => el.oninput = () => {
      const save = root.querySelector("[data-opts-save]");
      if (save) save.disabled = !optInputs.some(input => input.value !== input.dataset.saved);
    });
    root.querySelectorAll("[data-set-tab]").forEach(el => {
      el.onclick = () => { this.settingsTab = el.dataset.setTab; this.optionsMessage = ""; this.render(); };
      el.onkeydown = ev => {
        const ids = [...root.querySelectorAll("[data-set-tab]")].map(b => b.dataset.setTab), at = ids.indexOf(el.dataset.setTab);
        const next = { ArrowRight: ids[(at + 1) % ids.length], ArrowLeft: ids[(at - 1 + ids.length) % ids.length], Home: ids[0], End: ids[ids.length - 1] }[ev.key];
        if (!next) return;
        ev.preventDefault();
        this.settingsTab = next;
        this.render();
        this.shadowRoot.querySelector(`[data-set-tab="${next}"]`)?.focus();
      };
    });
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
    root.querySelectorAll("[data-lview]").forEach(el => el.onchange = () => this.applyView(el.dataset.lview, el.value));
    root.querySelectorAll("[data-lview-save]").forEach(el => el.onclick = () => this.saveView(el.dataset.lviewSave));
    root.querySelectorAll("[data-lview-form]").forEach(form => form.onsubmit = ev => {
      ev.preventDefault();
      this.commitView(form.dataset.lviewForm, form.querySelector("[data-lview-name]")?.value);
    });
    root.querySelectorAll("[data-lview-name]").forEach(el => {
      el.oninput = () => { this.viewDraft = el.value; };
      el.onkeydown = ev => { if (ev.key === "Escape") { ev.preventDefault(); this.cancelView(el.dataset.lviewName); } };
    });
    root.querySelectorAll("[data-lview-cancel]").forEach(el => el.onclick = () => this.cancelView(el.dataset.lviewCancel));
    root.querySelectorAll("[data-lview-delete]").forEach(el => el.onclick = () => this.deleteView(el.dataset.lviewDelete));
    root.querySelectorAll("[data-lf]").forEach(el => el.onchange = () => { const [id, name] = el.dataset.lf.split("|"); this.lv[id].f[name] = el.value; this.persistLv(id); this.pages = {}; this.render(); });
    root.querySelectorAll("[data-ls]").forEach(el => el.onchange = () => { const st = this.lv[el.dataset.ls]; st.sort = el.value; st.dir = this.lvDirs[el.dataset.ls][el.value] || "asc"; this.persistLv(el.dataset.ls); this.pages = {}; this.render(); });
    root.querySelectorAll("[data-lsort]").forEach(el => el.onclick = () => {
      const [id, key, dir] = el.dataset.lsort.split("|"), st = this.lv[id];
      if (st.sort === key) st.dir = st.dir === "desc" ? "asc" : "desc"; else { st.sort = key; st.dir = dir; }
      this.persistLv(id); this.pages = {}; this.render();
    });
    root.querySelectorAll("[data-dense]").forEach(el => el.onclick = () => { this.dense = !this.dense; try { globalThis.localStorage?.setItem("ha_housekeeper.dense", this.dense ? "1" : "0"); } catch (_) { /* kept until the page closes */ } this.render(); });
    root.querySelectorAll("[data-ld]").forEach(el => el.onclick = () => { const st = this.lv[el.dataset.ld]; st.dir = st.dir === "desc" ? "asc" : "desc"; this.persistLv(el.dataset.ld); this.pages = {}; this.render(); });
    root.querySelectorAll("[data-lpage]").forEach(el => el.onclick = () => { const [id, n] = el.dataset.lpage.split("|"); this.pages[id] = Number(n); this.render(); });
    root.querySelectorAll("[data-pagesize]").forEach(el => el.onchange = () => { this.pageSize = Number(el.value); this.pages = {}; this.render(); });
  }
}

// Mix the grouped methods into the panel element and register it.
for (const mixin of [ThemeMixin, StylesMixin, ListsMixin, OverviewMixin, FindingsMixin, ChangesMixin, SettingsMixin, CleanupMixin, InventoryMixin, GraphMixin, UnusedMixin, DiagnosisMixin, PropertiesMixin, MaintenanceMixin, BackupMixin, ReliabilityMixin, RunsMixin, StormsMixin, DbHealthMixin, ExposureMixin, PoliciesMixin, SearchMixin, LayoutMixin, FlowMixin, CorrelationMixin, LifecycleMixin, WindowMixin, BlueprintsMixin, MarksMixin, CausesMixin, GoalsMixin, ExchangeMixin, DiagnosticsMixin, TraceDiagMixin, DryRunMixin, RefactorMixin, SafetyMixin, BatteryCareMixin, FindingStatusMixin, DetailActionsMixin, CounterMixin, PickerMixin]) {
  for (const name of Object.getOwnPropertyNames(mixin.prototype)) {
    if (name !== "constructor") Object.defineProperty(HAHousekeeperPanel.prototype, name, Object.getOwnPropertyDescriptor(mixin.prototype, name));
  }
}

if (!customElements.get("ha-housekeeper-panel")) customElements.define("ha-housekeeper-panel", HAHousekeeperPanel);
