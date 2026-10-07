const TEXT = {
  de: {
    title: "Housekeeper", subtitle: "Deine Home-Assistant-Installation im Blick",
    overview: "Übersicht", inventory: "Inventar", graph: "Abhängigkeiten", findingsNav: "Befunde",
    scan: "Neu scannen", exportJson: "JSON", exportCsv: "CSV", exportTitle: "Befunde exportieren", scanning: "Scan läuft …", all: "Alle Typen",
    allStatus: "Alle Zustände", search: "Name, ID, Integration …",
    name: "Name", type: "Typ", status: "Zustand", reason: "Begründung",
    since: "Beobachtet seit", dependencies: "Beziehungen", objects: "Objekte",
    findings: "Befunde", active: "Aktiv", orphaned: "Verwaist",
    unavailable: "Nicht verfügbar", disabled: "Deaktiviert", unknown: "Unbekannt",
    empty: "Leer", problem: "Problem", details: "Details", close: "Schließen",
    noResults: "Keine passenden Objekte gefunden.", readOnly: "Schreibgeschützt",
    lastScan: "Letzter Scan", evidence: "Nachweis", registry: "Registry",
    state: "Zustand & Attribute", incoming: "Eingehend", outgoing: "Ausgehend",
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
    total: "Gesamt", riskNotice: "Diese Version analysiert ausschließlich und nimmt keine Änderungen vor.",
    recentFindings: "Aktuelle Befunde", affected: "Betroffenes Objekt",
    systemState: "Systemzustand", health: "Housekeeping-Status", healthGood: "Gut", healthCheck: "Prüfen",
    healthBad: "Problematisch", healthHint: "Anteil unauffälliger Entities und Automationen",
    openFindings: "Offene Befunde", needsAttention: "Benötigt Aufmerksamkeit",
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
    noBaseline: "Noch kein früherer Scan vorhanden. Nach dem nächsten Scan erscheint hier der Vergleich.", noChanges: "Keine Änderungen seit diesem Scan.",
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
    mode: "Betriebsart", readOnlyValue: "Nur lesend – ändert nichts in Home Assistant", scanInterval: "Automatischer Scan", unavailableAfter: "Nicht verfügbar gilt als Befund nach", unusedAfter: "Ungenutzte Automationen nach", lowBatteryAt: "Schwache Batterie ab",
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
    cleanupDryRun: "Nur Vorschau (Dry Run): Housekeeper ändert nichts in Home Assistant. Pläne können derzeit nicht ausgeführt werden.",
    cleanupCandidates: "Kandidaten", cleanupCandidatesHint: "Verwaiste und lange nicht verfügbare Entities.", cleanupNone: "Keine Kandidaten gefunden.",
    selectPage: "Seite auswählen", clearSelection: "Auswahl leeren", createPlan: "Vorschau erstellen", selectedCount: "{count} ausgewählt",
    planResult: "Ergebnis der Vorschau", planClose: "Schließen", planCreating: "Erstelle Vorschau …", planError: "Vorschau fehlgeschlagen",
    planSummary: "{total} geprüft: {ok} ohne bekannte Verwendung, {review} zu prüfen, {blocked} blockiert.", planUses: "{count} Verwendungen betroffen", planStats: "{count} mit Langzeitstatistik",
    verdict_ok: "Keine bekannte Verwendung", verdict_review: "Prüfen", verdict_blocked: "Blockiert", journal: "Journal", journalHint: "Frühere Vorschauen (die letzten 50).", journalEmpty: "Noch keine Vorschau erstellt.",
    openPlan: "Öffnen", deletePlan: "Löschen", dryRun: "Dry Run", usedBy: "Verwendet von",
    reason_entity_working: "Die Entity funktioniert noch und ist kein Kandidat.", reason_used_certain: "Wird sicher verwendet – Entfernen würde Verweise brechen.", reason_used_probable: "Wird vermutlich verwendet (Template oder Dashboard).",
    reason_has_statistics: "Hat Langzeitstatistiken im Recorder; sie blieben ohne Entity zurück.", reason_ignored_by_label: "Trägt das Label housekeeper_ignore.", reason_not_found: "Im letzten Scan nicht gefunden.", reason_unsupported_action: "Diese Aktion wird nicht unterstützt.",
    longTermStats: "Langzeitstatistik", yes: "Ja", no: "Nein", statsNote: "Für diese Entity gibt es Langzeitstatistiken im Recorder. Sie blieben nach einem Entfernen bestehen, gehörten dann aber zu keiner Entity mehr.",
    energyDashboard: "Energie-Dashboard",
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
    scan: "Scan now", exportJson: "JSON", exportCsv: "CSV", exportTitle: "Export findings", scanning: "Scanning …", all: "All types",
    allStatus: "All states", search: "Name, ID, integration …",
    name: "Name", type: "Type", status: "Status", reason: "Reason",
    since: "Observed since", dependencies: "Relations", objects: "Objects",
    findings: "Findings", active: "Active", orphaned: "Orphaned",
    unavailable: "Unavailable", disabled: "Disabled", unknown: "Unknown",
    empty: "Empty", problem: "Problem", details: "Details", close: "Close",
    noResults: "No matching objects found.", readOnly: "Read only",
    lastScan: "Last scan", evidence: "Evidence", registry: "Registry",
    state: "State & attributes", incoming: "Incoming", outgoing: "Outgoing",
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
    total: "Total", riskNotice: "This version only analyses and makes no changes.",
    recentFindings: "Current findings", affected: "Affected object",
    systemState: "System health", health: "Housekeeping status", healthGood: "Good", healthCheck: "Review",
    healthBad: "Problematic", healthHint: "Share of entities and automations without findings",
    openFindings: "Open findings", needsAttention: "Needs attention",
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
    noBaseline: "No earlier scan yet. The comparison appears after the next scan.", noChanges: "No changes since this scan.",
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
    mode: "Mode", readOnlyValue: "Read-only – changes nothing in Home Assistant", scanInterval: "Automatic scan", unavailableAfter: "Unavailable becomes a finding after", unusedAfter: "Unused automations after", lowBatteryAt: "Low battery at",
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
    cleanupDryRun: "Preview only (dry run): Housekeeper changes nothing in Home Assistant. Plans cannot be executed at the moment.",
    cleanupCandidates: "Candidates", cleanupCandidatesHint: "Orphaned and long-unavailable entities.", cleanupNone: "No candidates found.",
    selectPage: "Select page", clearSelection: "Clear selection", createPlan: "Create preview", selectedCount: "{count} selected",
    planResult: "Preview result", planClose: "Close", planCreating: "Creating preview …", planError: "Preview failed",
    planSummary: "{total} checked: {ok} with no known use, {review} to review, {blocked} blocked.", planUses: "{count} uses affected", planStats: "{count} with long-term statistics",
    verdict_ok: "No known use", verdict_review: "Review", verdict_blocked: "Blocked", journal: "Journal", journalHint: "Earlier previews (the last 50).", journalEmpty: "No preview created yet.",
    openPlan: "Open", deletePlan: "Delete", dryRun: "Dry run", usedBy: "Used by",
    reason_entity_working: "The entity still works and is not a candidate.", reason_used_certain: "Definitely in use – removing it would break references.", reason_used_probable: "Probably in use (template or dashboard).",
    reason_has_statistics: "Has long-term statistics in the recorder; they would be left without an entity.", reason_ignored_by_label: "Carries the label housekeeper_ignore.", reason_not_found: "Not found in the latest scan.", reason_unsupported_action: "This action is not supported.",
    longTermStats: "Long-term statistics", yes: "Yes", no: "No", statsNote: "This entity has long-term statistics in the recorder. They would remain after a removal but belong to no entity any more.",
    energyDashboard: "Energy dashboard",
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

const PREFS_KEY = "ha_housekeeper.prefs";
const DEFAULT_PREFS = { size: "normal", mode: "auto", scheme: "standard", density: "normal", motion: "auto", pageSize: 20, startView: "overview" };
const USER_DATA_KEY = "ha_housekeeper";
const OPTION_LIMITS = { min_unavailable_days: [0, 365], unused_automation_days: [0, 3650], scan_interval_hours: [0, 720], low_battery_percent: [1, 100] };
// Text scale only; spacing and icons stay put. Normal is a bit larger than the original 1.0.
const SIZES = { small: 1, normal: 1.1, large: 1.25 };
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

const NAV = [
  ["overview", "mdi:view-dashboard-outline"],
  ["inventory", "mdi:database-outline"],
  ["findingsNav", "mdi:alert-outline"],
  ["changes", "mdi:compare-horizontal"],
  ["batteries", "mdi:battery-alert-variant-outline"],
  ["unreferenced", "mdi:link-variant-off"],
  ["cleanup", "mdi:broom"],
  ["settings", "mdi:cog-outline"],
  ["graph", "mdi:source-fork"],
];

const STATUS_TONE = {
  active: "ok", orphaned: "warn", unavailable: "red", problem: "red", broken_reference: "red",
  disabled: "mute", empty: "mute", unknown: "violet", possible_duplicate: "violet", unused: "mute",
};

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
    this.trail = [];
    this.compare = null;
    this.compareBaseline = "previous";
    this.compareLoading = false;
    this.graphSelected = null;
    this.details = new Map();
    this.detailLoading = false;
    this.graphQuery = "";
    this.pages = {};
    this.lv = {};
    this.cleanupSel = new Set();
    this.plan = null;
    this.journal = null;
    this.prefs = this.loadPrefs();
    this.pageSize = this.prefs.pageSize;
    this.sortDir = "asc";
    this.pages = {};
    this.busy = false;
    this.scanStatus = null;
    this.error = null;
  }

  set hass(value) {
    const first = !this._hass, wasDark = this._hass?.themes?.darkMode;
    this._hass = value;
    if (first) { this.load(false); this.loadUserPrefs(); }
    else if (this.prefs.mode === "auto" && wasDark !== value?.themes?.darkMode) this.render();
  }

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
    const compact = this.prefs.density === "compact" ? `.row{padding-top:6px;padding-bottom:6px}.card{padding:10px 12px}.panelhead{min-height:44px;padding-top:8px;padding-bottom:8px}td{padding:6px 14px}th{padding:7px 14px}.nav{min-height:32px;padding-top:4px;padding-bottom:4px}.tile{width:30px;height:30px}.setrow{padding-top:9px;padding-bottom:9px}.chips{padding-top:8px;padding-bottom:8px}.listbar{padding-top:8px;padding-bottom:8px}.summary,.stack,.grid2{gap:10px}.heading{margin-bottom:14px}` : "";
    const calm = "*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}";
    const motion = this.prefs.motion === "reduced" ? calm : `@media(prefers-reduced-motion:reduce){${calm}}`;
    return `:host{${vars}}${compact}${motion}`;
  }
  get hass() { return this._hass; }

  connectedCallback() {
    this._basePath = typeof window === "undefined" ? null : window.location.pathname;
    this.render();
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
  }

  async loadCompare() {
    this.compareLoading = true; this.render();
    try {
      this.compare = await this._hass.callWS({ type: "ha_housekeeper/compare", baseline: this.compareBaseline });
    } catch (err) {
      this.compare = null; this.error = err?.message || String(err);
    }
    this.compareLoading = false; this.render();
  }

  async updateScanStatus() {
    try {
      this.scanStatus = await this._hass.callWS({ type: "ha_housekeeper/status" });
      this.render();
    } catch (_) { /* The main scan request reports actionable errors. */ }
  }

  filtered() {
    if (!this.data) return [];
    const q = this.query.trim().toLowerCase();
    return this.data.objects.filter(item => {
      const haystack = [item.name, item.object_id, item.platform, item.domain, item.unique_id].join(" ").toLowerCase();
      return (!q || haystack.includes(q)) && (!this.typeFilter || item.object_type === this.typeFilter)
        && (!this.statusFilter || item.status === this.statusFilter);
    }).sort((a, b) => {
      const pick = item => this.sort === "status" ? item.status : this.sort === "type" ? item.object_type : this.sort === "since" ? item.status_since : (item.name || item.object_id);
      const x = pick(a), y = pick(b);
      if (!x !== !y) return x ? -1 : 1; // missing values stay last in both directions
      const order = String(x ?? "").localeCompare(String(y ?? ""), this.lang, { numeric: true, sensitivity: "base" });
      return (this.sortDir === "desc" ? -order : order) || String(a.object_id).localeCompare(String(b.object_id), this.lang, { numeric: true });
    });
  }

  async openObject(obj) {
    if (this.selected && this.selected !== obj) this.trail.push(this.selected);
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

  goBack() { this.selected = this.trail.pop() || null; this.render(); }

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
  sortedFindings(includeIgnored = false) {
    return this.data.findings.filter(f => includeIgnored || !f.ignored).sort((a, b) => (b.confidence - a.confidence)
      || String(a.object_id).localeCompare(String(b.object_id)));
  }

  health() {
    const base = this.data.objects.filter(o => ["entity", "automation", "script", "scene"].includes(o.object_type)).length;
    const percent = base ? Math.max(0, Math.round(100 * (1 - this.data.findings.filter(f => !f.ignored).length / base))) : 100;
    const tone = percent >= 95 ? "ok" : percent >= 80 ? "warn" : "red";
    const label = tone === "ok" ? "healthGood" : tone === "warn" ? "healthCheck" : "healthBad";
    return { percent, tone, label };
  }

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

  styles() {
    return `<style>
      :host{--hk-blue:var(--primary-color,#0789cf);--hk-surface:var(--card-background-color,#fff);--hk-bg:var(--primary-background-color,#f4f6f9);--hk-soft:var(--secondary-background-color,#f6f8fa);--hk-text:var(--primary-text-color,#17212b);--hk-muted:var(--secondary-text-color,#637281);--hk-border:var(--divider-color,#dde4ea);--hk-green:#1f9d63;--hk-amber:#d68a00;--hk-red:#d94452;--hk-violet:#7a62c9;--hk-gray:#7b8794;display:block;min-height:100%;background:var(--hk-bg);color:var(--hk-text);font-family:var(--paper-font-body1_-_font-family,Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif)}
      *{box-sizing:border-box} button,input,select{font:inherit;color:inherit} button{cursor:pointer} h1,h2,h3,h4,p{margin:0}
      ha-icon{--mdc-icon-size:20px}
      .shell{min-height:100vh;display:grid;grid-template-columns:calc(208px*var(--hk-fs,1)) minmax(0,1fr)}
      .side{display:flex;flex-direction:column;gap:18px;padding:20px 12px 14px;border-right:1px solid var(--hk-border);background:var(--hk-surface)}
      .brand{display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;padding:4px 8px 8px}.brandmark{width:72px;height:72px;display:grid;place-items:center;flex:none}.brandmark img{width:72px;height:72px;object-fit:contain}.brandmark ha-icon{display:none}.brandmark.nologo{width:34px;height:34px;border-radius:10px;color:#fff;background:linear-gradient(135deg,#0394d5,#087dbb)}.brandmark.nologo ha-icon{display:block}.brand strong{font-weight:600;font-size:calc(19px*var(--hk-fs,1))}.brand small{display:block;color:var(--hk-muted);font-size:calc(13px*var(--hk-fs,1));margin-top:2px}
      .side nav{display:grid;gap:4px}.nav{width:100%;min-height:40px;display:grid;grid-template-columns:22px 1fr auto;align-items:center;gap:9px;padding:7px 10px;border:0;border-radius:8px;color:var(--hk-muted);background:transparent;text-align:left}.nav:hover{background:var(--hk-soft)}
      .nav.active{color:var(--hk-blue);background:color-mix(in srgb,var(--hk-blue) 12%,transparent);font-weight:600}.nav em{min-width:22px;padding:2px 6px;border-radius:10px;color:var(--hk-muted);background:var(--hk-soft);font-size:calc(11px*var(--hk-fs,1));font-style:normal;text-align:center}
      .side-foot{margin-top:auto;display:grid;gap:8px;padding:0 8px}.lock{display:flex;align-items:center;gap:7px;font-size:calc(11px*var(--hk-fs,1));color:var(--hk-green)}.lock ha-icon{--mdc-icon-size:16px}
      .main{min-width:0;padding:26px clamp(16px,2.4vw,32px) 60px}
      .heading{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:20px}.eyebrow{color:var(--hk-blue);font-size:calc(11px*var(--hk-fs,1));font-weight:600;letter-spacing:.09em;text-transform:uppercase;margin-bottom:3px}
      h1{font-size:calc(25px*var(--hk-fs,1));font-weight:600;line-height:1.2}.sub{display:block;margin-top:6px;color:var(--hk-muted);font-size:calc(13px*var(--hk-fs,1))}
      .btn{min-height:37px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:8px 14px;border-radius:8px;font-weight:600;border:1px solid var(--hk-border);background:var(--hk-surface)}.btn:hover{background:var(--hk-soft)}
      .btn.primary{border-color:var(--hk-blue);color:var(--hk-on,#fff);background:var(--hk-blue)}.btn.primary:hover{background:#0a8ccf}.btn[disabled]{opacity:.6;cursor:wait}
      .summary{display:grid;grid-template-columns:1.3fr repeat(4,1fr);gap:12px;margin-bottom:14px}
      .card{min-width:0;display:grid;grid-template-columns:auto 1fr;align-items:center;gap:12px;padding:15px;border:1px solid var(--hk-border);border-radius:12px;background:var(--hk-surface);color:inherit;text-align:left}
      button.card:hover{border-color:var(--hk-blue)}
      .ring{--p:90;--c:var(--hk-green);width:58px;height:58px;display:grid;place-content:center;border-radius:50%;text-align:center;background:radial-gradient(circle at center,var(--hk-surface) 58%,transparent 60%),conic-gradient(var(--c) calc(var(--p)*1%),var(--hk-soft) 0)}.ring b{font-size:calc(16px*var(--hk-fs,1));font-weight:600;line-height:1}.ring.warn{--c:var(--hk-amber)}.ring.red{--c:var(--hk-red)}
      .card-text{min-width:0;display:grid;gap:2px}.card-text small{color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}.card-text strong{font-size:calc(22px*var(--hk-fs,1));font-weight:600;line-height:1.2}.card-text em{overflow:hidden;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1));font-style:normal;text-overflow:ellipsis;white-space:nowrap}
      .tile{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;color:var(--hk-blue);background:color-mix(in srgb,var(--hk-blue) 13%,transparent);flex:none}
      .tile.ok{color:var(--hk-green);background:color-mix(in srgb,var(--hk-green) 14%,transparent)}.tile.warn{color:var(--hk-amber);background:color-mix(in srgb,var(--hk-amber) 15%,transparent)}.tile.red{color:var(--hk-red);background:color-mix(in srgb,var(--hk-red) 13%,transparent)}.tile.mute{color:var(--hk-gray);background:color-mix(in srgb,var(--hk-gray) 15%,transparent)}.tile.violet{color:var(--hk-violet);background:color-mix(in srgb,var(--hk-violet) 14%,transparent)}
      .grid2{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(280px,.8fr);gap:14px;align-items:start}.stack{display:grid;gap:14px}
      .panel{border:1px solid var(--hk-border);border-radius:12px;background:var(--hk-surface);overflow:hidden}.panelhead{min-height:56px;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--hk-border)}.panelhead h2{font-size:calc(15px*var(--hk-fs,1));font-weight:600}.panelhead p{margin-top:3px;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}
      .link{display:inline-flex;align-items:center;gap:4px;padding:4px;border:0;color:var(--hk-blue);background:transparent;font-size:calc(12px*var(--hk-fs,1));font-weight:600}
      .row{width:100%;display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;align-items:center;gap:12px;padding:12px 16px;border:0;border-bottom:1px solid var(--hk-border);background:transparent;color:inherit;text-align:left}.row:last-child{border-bottom:0}.row:hover{background:var(--hk-soft)}
      .row .tile{width:34px;height:34px}.row-text{min-width:0;display:grid;gap:2px}.row-text strong{overflow:hidden;font-size:calc(13px*var(--hk-fs,1));font-weight:600;text-overflow:ellipsis;white-space:nowrap}.row-text small{overflow:hidden;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1));text-overflow:ellipsis;white-space:nowrap}.date{color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1));white-space:nowrap}
      .pill{display:inline-flex;align-items:center;gap:6px;width:max-content;padding:3px 9px;border-radius:99px;font-size:calc(11px*var(--hk-fs,1));font-weight:600;white-space:nowrap;color:var(--hk-blue);background:color-mix(in srgb,var(--hk-blue) 13%,transparent)}
      .pill.ok{color:var(--hk-green);background:color-mix(in srgb,var(--hk-green) 14%,transparent)}.pill.warn{color:var(--hk-amber);background:color-mix(in srgb,var(--hk-amber) 16%,transparent)}.pill.red{color:var(--hk-red);background:color-mix(in srgb,var(--hk-red) 13%,transparent)}.pill.mute{color:var(--hk-gray);background:color-mix(in srgb,var(--hk-gray) 16%,transparent)}.pill.violet{color:var(--hk-violet);background:color-mix(in srgb,var(--hk-violet) 14%,transparent)}
      .bar{display:flex;height:10px;margin:16px;border-radius:99px;overflow:hidden;background:var(--hk-soft)}.bar i{display:block;min-width:2px}.legend{display:grid;gap:9px;padding:0 16px 16px;font-size:calc(12px*var(--hk-fs,1))}.legend div{display:flex;align-items:center;justify-content:space-between;gap:8px}.legend span{display:flex;align-items:center;gap:8px}.dot{width:9px;height:9px;border-radius:50%;background:var(--hk-blue)}
      .dot.ok,.bar .ok{background:var(--hk-green)}.dot.warn,.bar .warn{background:var(--hk-amber)}.dot.red,.bar .red{background:var(--hk-red)}.dot.mute,.bar .mute{background:var(--hk-gray)}.dot.violet,.bar .violet{background:var(--hk-violet)}
      .types{display:grid}.type{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;padding:10px 16px;border:0;border-top:1px solid var(--hk-border);background:transparent;text-align:left;font-size:calc(13px*var(--hk-fs,1))}.type:hover{background:var(--hk-soft)}.type .tile{width:30px;height:30px}.type b{font-weight:600}
      .filters{display:grid;grid-template-columns:minmax(240px,1fr) 190px 190px;gap:10px;padding:14px;border-bottom:1px solid var(--hk-border)}
      input,select{border:1px solid var(--hk-border);border-radius:8px;background:var(--hk-surface);padding:9px 12px;min-width:0}input:focus,select:focus{outline:2px solid color-mix(in srgb,var(--hk-blue) 35%,transparent);border-color:var(--hk-blue)}
      .listbar{display:flex;flex-wrap:wrap;gap:10px;padding:12px 14px;border-bottom:1px solid var(--hk-border)}.listbar input{flex:1 1 220px}.listbar select{flex:0 1 180px}.dirbtn{display:grid;place-items:center;border:1px solid var(--hk-border);border-radius:8px;background:var(--hk-surface);color:inherit;padding:0 10px}.dirbtn:hover{border-color:var(--hk-blue)}
      .setrow{display:grid;grid-template-columns:minmax(150px,240px) 1fr;gap:12px;align-items:center;padding:14px 16px;border-bottom:1px solid var(--hk-border)}.setrow:last-child{border-bottom:0}.setrow small{display:block;margin-top:3px;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}.setrow select{max-width:240px}.setrow .btn{justify-self:start}.seg{display:flex;flex-wrap:wrap;gap:8px}.swatch{display:inline-block;width:10px;height:10px;margin-right:6px;border-radius:50%;vertical-align:-1px}a.btn{color:inherit;text-decoration:none}
      @media(max-width:700px){.setrow{grid-template-columns:1fr}}
      .row,.btn,.card,.chip,.nav,.dirbtn{transition:background-color .15s ease,border-color .15s ease,color .15s ease}.bar i{transition:width .4s ease}@keyframes hk-spin{to{transform:rotate(360deg)}}.loading ha-icon,.btn[disabled] ha-icon{animation:hk-spin 1s linear infinite}
      .tablewrap{overflow:auto}table{border-collapse:collapse;width:100%}th{text-align:left;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1));font-weight:600;text-transform:uppercase;letter-spacing:.05em;padding:11px 16px;background:var(--hk-soft);cursor:pointer;white-space:nowrap}td{padding:11px 16px;border-top:1px solid var(--hk-border);font-size:calc(13px*var(--hk-fs,1))}tbody tr{cursor:pointer}tbody tr:hover{background:var(--hk-soft)}
      .object{display:flex;align-items:center;gap:11px;min-width:260px}.object .tile{width:34px;height:34px}.object strong{display:block;font-weight:600}.id{display:block;color:var(--hk-muted);font-family:ui-monospace,SFMono-Regular,monospace;font-size:calc(11px*var(--hk-fs,1));margin-top:2px;max-width:390px;overflow:hidden;text-overflow:ellipsis}
      .tablefoot{padding:12px 16px;border-top:1px solid var(--hk-border);color:var(--hk-muted);font-size:calc(12px*var(--hk-fs,1));display:flex;align-items:center;justify-content:space-between;gap:10px}.pager{display:flex;align-items:center;gap:8px}.pager button{border:1px solid var(--hk-border);background:var(--hk-surface);border-radius:7px;padding:5px 10px}.pager button:disabled{opacity:.4}
      .chips .spacer{flex:1}.chips{display:flex;flex-wrap:wrap;gap:8px;padding:12px 16px;border-bottom:1px solid var(--hk-border)}.chip{border:1px solid var(--hk-border);background:var(--hk-surface);border-radius:99px;padding:5px 12px;font-size:calc(12px*var(--hk-fs,1));color:var(--hk-muted)}.chip.active{color:var(--hk-blue);border-color:var(--hk-blue);background:color-mix(in srgb,var(--hk-blue) 11%,transparent);font-weight:600}
      .emptymsg,.loading{padding:46px;text-align:center;color:var(--hk-muted)}.emptymsg ha-icon{--mdc-icon-size:34px;color:var(--hk-green);display:block;margin:0 auto 8px}.error{padding:18px;border-radius:12px;background:color-mix(in srgb,var(--hk-red) 12%,transparent);color:var(--hk-red)}
      .pathcard{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:14px;padding:16px;margin-bottom:14px}.pathcard h2{font-size:calc(17px*var(--hk-fs,1));font-weight:600}
      .path{padding:16px;display:grid;gap:0}.node{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;padding:11px 13px;border:1px solid var(--hk-border);border-radius:10px;background:var(--hk-surface);color:inherit;text-align:left;width:100%}button.node:hover{border-color:var(--hk-blue)}
      .node.current{border:2px solid var(--hk-blue);background:color-mix(in srgb,var(--hk-blue) 8%,var(--hk-surface))}.node .tile{width:34px;height:34px}.node small{display:block;color:var(--hk-blue);font-size:calc(11px*var(--hk-fs,1));font-weight:600;letter-spacing:.06em;text-transform:uppercase}.node strong{display:block;font-size:calc(13px*var(--hk-fs,1));font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.node span.meta{display:block;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}
      .link-label{margin:0 0 0 22px;padding:3px 0 3px 14px;border-left:2px solid var(--hk-border);color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1));min-height:26px;display:flex;align-items:center;gap:8px}
      .branch{margin:0 0 0 22px;padding:6px 0 0 18px;border-left:2px solid var(--hk-border);display:grid;gap:8px}
      .sectionlabel{padding:14px 16px 0;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1));font-weight:600;letter-spacing:.07em;text-transform:uppercase}
      .search{padding:14px;border-bottom:1px solid var(--hk-border)}.search input{width:100%}.hits{display:grid;max-height:280px;overflow:auto}.hit{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center;padding:9px 16px;border:0;border-top:1px solid var(--hk-border);background:transparent;text-align:left}.hit:hover{background:var(--hk-soft)}.hit .tile{width:30px;height:30px}
      .crumbs{display:flex;align-items:center;gap:12px;margin-bottom:14px}.crumbs .trail{color:var(--hk-muted);font-size:calc(12px*var(--hk-fs,1));text-transform:uppercase;letter-spacing:.07em}
      .detailhead{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:16px;padding:18px 20px;margin-bottom:14px}.detailhead .tile{width:48px;height:48px}.detailhead h1{margin:6px 0 2px;font-size:calc(22px*var(--hk-fs,1))}.actions{display:flex;flex-wrap:wrap;gap:8px}
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
      .finding{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;border-top:1px solid var(--hk-border);font-size:calc(13px*var(--hk-fs,1))}.finding strong{display:block;font-weight:600}.finding small{display:block;margin-top:3px;color:var(--hk-muted);font-size:calc(11px*var(--hk-fs,1))}.row.dim{opacity:.6}
      .kv{display:grid;grid-template-columns:155px 1fr;gap:8px 14px;font-size:calc(13px*var(--hk-fs,1))}.kv dt{color:var(--hk-muted)}.kv dd{margin:0;overflow-wrap:anywhere}
      .code{white-space:pre-wrap;word-break:break-word;background:var(--hk-soft);border-radius:10px;padding:12px;font:calc(11px*var(--hk-fs,1))/1.55 ui-monospace,SFMono-Regular,monospace;max-height:270px;overflow:auto}
      h4{font-size:calc(12px*var(--hk-fs,1));margin:12px 0 6px;color:var(--hk-muted)}
      @media(max-width:1100px){.summary{grid-template-columns:1fr 1fr}.grid2,.detailgrid{grid-template-columns:1fr}}
      @media(max-width:860px){.brand{flex-direction:row;text-align:left;padding:0 8px}.brandmark,.brandmark img{width:36px;height:36px}.brand strong{font-size:calc(15px*var(--hk-fs,1))}.shell{grid-template-columns:1fr}.side{flex-direction:row;align-items:center;gap:8px;padding:10px;border-right:0;border-bottom:1px solid var(--hk-border);overflow-x:auto}.brand small,.lock{display:none}.side-foot{margin:0;padding:0;display:flex}.side nav{display:flex}.nav{width:auto;grid-template-columns:22px auto auto;white-space:nowrap}.main{padding:16px 12px 40px}.heading{flex-wrap:wrap}.filters{grid-template-columns:1fr}.row{grid-template-columns:auto minmax(0,1fr) auto}.row .date{display:none}th:nth-child(4),td:nth-child(4),th:nth-child(5),td:nth-child(5){display:none}.pathcard{grid-template-columns:auto 1fr}.pathcard .btn{grid-column:1/-1}.detailhead{grid-template-columns:auto 1fr}.actions{grid-column:1/-1}.check{grid-template-columns:22px 1fr auto}.check .val{grid-column:2/-1;grid-row:2;white-space:normal}}
      @media(max-width:520px){.summary{grid-template-columns:1fr}}
      ${this.themeCss()}
    </style>`;
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `${this.styles()}<div class="shell">${this.sidebar()}<main class="main">${this.selected && this.data ? this.detail() : `${this.heading()}${this.content()}`}</main></div>`;
    this.bind();
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
    const obj = this.findObject(params.get("object") || "");
    if (obj) this.openObject(obj);
    else if (this.view === "changes" && !this.compare) this.loadCompare();
  }

  syncUrl() {
    if (typeof window === "undefined" || !this.isConnected || !window.history?.replaceState) return;
    if (window.location.pathname !== this._basePath) return; // HA already navigated elsewhere
    const params = new URLSearchParams();
    if (this.selected) params.set("object", this.objectKey(this.selected));
    else {
      if (this.view !== "overview") params.set("view", this.view);
      if (this.view === "findingsNav" && this.findingFilter) params.set("filter", this.findingFilter);
    }
    const query = params.toString();
    try { window.history.replaceState(window.history.state, "", window.location.pathname + (query ? `?${query}` : "")); } catch (_) { /* ignore */ }
  }

  sidebar() {
    const counts = this.data ? { inventory: this.formatNumber(this.data.meta.object_count), findingsNav: this.data.findings.filter(f => !f.ignored).length, batteries: this.lowBatteries().length || undefined } : {};
    return `<aside class="side"><div class="brand"><span class="brandmark"><img src="/ha_housekeeper/logo.png" alt="" onerror="this.parentNode.classList.add('nologo');this.remove()"><ha-icon icon="mdi:broom"></ha-icon></span><div><strong>${this.t("title")}</strong><small>${this.t("systemState")}</small></div></div>
      <nav>${NAV.filter(([view]) => view !== "settings").map(([view, icon]) => `<button class="nav ${this.view === view ? "active" : ""}" data-view="${view}"><ha-icon icon="${icon}"></ha-icon><span>${this.t(view)}</span>${counts[view] !== undefined ? `<em>${counts[view]}</em>` : ""}</button>`).join("")}</nav>
      <div class="side-foot"><button class="nav ${this.view === "settings" ? "active" : ""}" data-view="settings"><ha-icon icon="mdi:cog-outline"></ha-icon><span>${this.t("settings")}</span></button><span class="lock"><ha-icon icon="mdi:shield-check-outline"></ha-icon>${this.t("readOnly")}</span></div></aside>`;
  }

  heading() {
    const titles = {
      overview: [this.t("systemState"), this.t("health"), this.data ? `${this.t("lastScan")}: <b>${this.formatDate(this.data.meta.scanned_at)}</b>` : this.t("subtitle")],
      inventory: [this.t("objects"), this.t("inventory"), this.t("inventorySubtitle")],
      findingsNav: [this.t("diagnosis"), this.t("findings"), this.t("findingsSubtitle")],
      changes: [this.t("diagnosis"), this.t("changes"), this.t("changesSubtitle")],
      batteries: [this.t("objects"), this.t("batteries"), this.t("batteriesSubtitle")],
      unreferenced: [this.t("objects"), this.t("unreferenced"), this.t("unreferencedSubtitle")],
      graph: [this.t("graph"), this.t("pathTitle"), this.t("pathSubtitle")],
      settings: [this.t("objects"), this.t("settings"), this.t("settingsSubtitle")],
      cleanup: [this.t("diagnosis"), this.t("cleanup"), this.t("cleanupSubtitle")],
    };
    const [eyebrow, title, sub] = titles[this.view] || titles.overview;
    const progress = this.scanStatus?.running ? ` ${this.scanStatus.progress}%` : "";
    return `<div class="heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><span class="sub">${sub}</span></div>
      <button class="btn primary" data-action="scan" ${this.busy ? "disabled" : ""}><ha-icon icon="mdi:refresh"></ha-icon>${this.busy ? this.t("scanning") + progress : this.t("scan")}</button></div>`;
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
    if (this.view === "graph") return this.graph();
    return this.overview();
  }

  tone(status) { return STATUS_TONE[status] || "blue"; }
  pill(status) { return `<span class="pill ${this.tone(status)}">${this.esc(this.statusLabel(status))}</span>`; }
  tile(type, tone = "") { return `<span class="tile ${tone}"><ha-icon icon="${ICONS[type] || "mdi:help-circle-outline"}"></ha-icon></span>`; }

  findingRow(finding) {
    const key = this.findingKey(finding), object = this.findObject(key);
    const title = object?.name || finding.object_id;
    const subtitle = finding.rule_id === "entity.possible_duplicate"
      ? `${this.t("duplicateOf")} ${this.esc(finding.affected_object)}`
      : finding.affected_object
        ? `${this.esc(finding.affected_object)} · ${this.esc(finding.evidence?.[0]?.location || "")}`
        : this.esc(object?.reason ? this.t(object.reason) : this.t(finding.rule_id));
    return `<button class="row ${finding.ignored ? "dim" : ""}" data-object="${this.esc(key)}">${this.tile(object?.object_type || "entity", this.tone(finding.classification))}<span class="row-text"><strong>${this.esc(title)}</strong><small>${subtitle}${finding.ignored ? ` · ${this.t("ignoredLabel")}` : ""}</small></span>${this.pill(finding.classification)}<span class="date">${finding.first_detected_at ? this.formatDate(finding.first_detected_at) : ""}</span></button>`;
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
    return `<div class="summary"><div class="card"><span class="ring ${health.tone}" style="--p:${health.percent}"><b>${health.percent}%</b></span><span class="card-text"><small>${this.t("health")}</small><strong>${this.t(health.label)}</strong><em>${this.t("healthHint")}</em></span></div>
      ${stats.map(([label, value, icon, tone, view, status]) => `<button class="card" data-jump="${view}" data-status="${status || ""}"><span class="tile ${tone}"><ha-icon icon="${icon}"></ha-icon></span><span class="card-text"><small>${this.t(label)}</small><strong>${this.formatNumber(value)}</strong></span></button>`).join("")}</div>
      <div class="grid2"><div class="stack"><div class="panel"><div class="panelhead"><div><h2>${this.t("needsAttention")}</h2><p>${this.t("sortedBySure")}</p></div><button class="link" data-jump="findingsNav">${this.t("allFindings")} (${findings.length}) <ha-icon icon="mdi:chevron-right"></ha-icon></button></div>
      ${findings.length ? findings.slice(0, 8).map(f => this.findingRow(f)).join("") : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("noFindings")}</div>`}</div>${this.integrationProblems()}</div>
      <div class="stack">${this.cleanupCard()}<div class="panel"><div class="panelhead"><h2>${this.t("inventoryStatus")}</h2><span class="date">${this.formatNumber(m.object_count)}</span></div>
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
    ];
    const rows = items.map(([label, icon, view, count, filter]) => `<button class="row" data-jump="${view}"${filter !== undefined && view === "findingsNav" ? ` data-filter="${filter}"` : ""}><span class="tile ${count ? "warn" : "mute"}"><ha-icon icon="${icon}"></ha-icon></span><span class="row-text"><strong>${this.t(label)}</strong></span><span class="pill ${count ? "warn" : "mute"}">${this.formatNumber(count)}</span></button>`).join("");
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("cleanup")}</h2><p>${this.t("cleanupHint")}</p></div></div>${rows}</div>`;
  }

  findingType(f) { return this.findObject(this.findingKey(f))?.object_type || f.rule_id.split(".")[0]; }

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

  changeRank(status) { return { active: 0, disabled: 1, empty: 1, unknown: 2, problem: 3, orphaned: 3, unavailable: 3 }[status] ?? 1; }

  changesView() {
    const c = this.compare;
    if (!c) return `<div class="panel loading"><ha-icon icon="mdi:loading"></ha-icon><p>${this.t("loading")}</p></div>`;
    const options = (c.baselines || []).map(b => `<option value="${this.esc(b.id)}" ${b.id === this.compareBaseline ? "selected" : ""}>${b.id === "previous" ? `${this.t("previousScan")} · ` : ""}${this.esc(this.formatDate(b.at))}</option>`).join("");
    const picker = options ? `<div class="panel" style="margin-bottom:14px"><div class="filters" style="grid-template-columns:auto minmax(220px,360px)"><label style="align-self:center;color:var(--hk-muted);font-size:calc(12px*var(--hk-fs,1))">${this.t("compareWith")}</label><select id="baseline">${options}</select></div></div>` : "";
    if (!c.available) return `${picker}<div class="panel"><div class="emptymsg"><ha-icon icon="mdi:history"></ha-icon>${this.t("noBaseline")}</div></div>`;
    const sections = [
      ["statusChanges", "mdi:swap-horizontal", c.status_changes], ["newFindings", "mdi:alert-outline", c.new_findings],
      ["resolvedFindings", "mdi:check-circle-outline", c.resolved_findings], ["newObjects", "mdi:plus-circle-outline", c.new_objects],
      ["removedObjects", "mdi:minus-circle-outline", c.removed_objects],
    ];
    const total = sections.reduce((n, [, , part]) => n + part.total, 0);
    const cards = sections.map(([label, icon, part]) => `<div class="card"><span class="tile ${part.total ? (label === "resolvedFindings" ? "ok" : label === "newFindings" ? "warn" : "") : "mute"}"><ha-icon icon="${icon}"></ha-icon></span><div class="card-text"><small>${this.t(label)}</small><strong>${this.formatNumber(part.total)}</strong></div></div>`).join("");
    const more = part => part.total > part.items.length ? `<p class="factnote">${this.t("moreItems", { count: part.total - part.items.length })}</p>` : "";
    const paged = (id, items, render) => { const pg = this.paginate(`changes-${id}`, items); return pg.rows.map(render).join("") + pg.footer; };
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
    return `${picker}<p class="sub" style="margin:0 0 14px">${this.t("comparedWith")} <b>${this.formatDate(c.baseline_at)}</b></p><div class="summary changesum">${cards}</div>${total ? panels : `<div class="panel"><div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("noChanges")}</div></div>`}`;
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

  th(key, label) {
    const on = this.sort === key;
    return `<th data-sort="${key}" aria-sort="${on ? (this.sortDir === "desc" ? "descending" : "ascending") : "none"}">${this.t(label)}${on ? ` <span aria-hidden="true">${this.sortDir === "desc" ? "▼" : "▲"}</span>` : ""}</th>`;
  }

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
      ${optionRow("min_unavailable_days", this.t("optMinUnavailable"))}${optionRow("unused_automation_days", this.t("optUnusedAutomation"))}${optionRow("scan_interval_hours", this.t("optScanInterval"))}${optionRow("low_battery_percent", this.t("optLowBattery"))}
      <div class="setrow"><small style="margin:0">${this.esc(this.optionsMessage || "")}</small><button class="btn primary" data-opts-save>${this.t("saveOptions")}</button></div></section>` : "";
    const hidden = (this.data?.findings || []).filter(f => f.ignored);
    const pg = this.paginate("hidden", hidden);
    const hiddenRow = f => {
      const object = this.findObject(this.findingKey(f));
      const action = f.ignored_by === "label" ? `<span class="pill mute">${this.t("ignoredByLabel")}</span>` : `<button class="btn" data-ignore="${this.esc(f.key)}" data-ignore-value="0">${this.t("showFinding")}</button>`;
      return `<div class="row"><span class="tile mute"><ha-icon icon="mdi:eye-off-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(object?.name || f.object_id)}</strong><small>${this.esc(f.object_id)} · ${this.t(f.rule_id)}</small></span>${action}</div>`;
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

  setPref(key, raw) {
    const value = key === "pageSize" ? Number(raw) : raw;
    this.prefs = { ...this.prefs, [key]: value };
    if (key === "pageSize") { this.pageSize = value; this.pages = {}; }
    this.savePrefs();
    this.render();
  }

  cleanupCandidates() {
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

  async loadJournal() {
    try { this.journal = (await this._hass.callWS({ type: "ha_housekeeper/plan_list" })).plans || []; } catch (_) { this.journal = []; }
    this.render();
  }

  async createPlan() {
    if (!this.cleanupSel.size) return;
    this.cleanupBusy = true; this.cleanupError = ""; this.render();
    try {
      const plan = await this._hass.callWS({ type: "ha_housekeeper/plan_create", actions: [...this.cleanupSel].map(object_id => ({ kind: "remove_entity", object_id })) });
      this.plan = plan;
      this.journal = [plan, ...(this.journal || [])];
    } catch (err) { this.cleanupError = err?.message || String(err); }
    this.cleanupBusy = false; this.render();
  }

  async deletePlan(id) {
    try { await this._hass.callWS({ type: "ha_housekeeper/plan_delete", plan_id: id }); } catch (_) { /* already gone */ }
    this.journal = (this.journal || []).filter(p => p.plan_id !== id);
    if (this.plan?.plan_id === id) this.plan = null;
    this.render();
  }

  planCard(plan) {
    const sm = plan.summary || {};
    const rows = plan.actions.map(a => {
      const tone = { ok: "ok", review: "warn", blocked: "red" }[a.verdict] || "mute";
      const uses = (a.used_by || []).slice(0, 4).map(u => {
        const obj = this.findObject(u.source);
        return `<button class="chip" data-object="${this.esc(u.source)}">${this.esc(obj?.name || u.source.split(":").slice(1).join(":"))}</button>`;
      }).join("");
      const more = (a.used_by || []).length > 4 ? `<small>+${a.used_by.length - 4}</small>` : "";
      const reasons = (a.reasons || []).map(r => this.t(`reason_${r}`)).join(" ");
      const obj = this.findObject(`entity:${a.object_id}`);
      return `<div class="row ${a.verdict === "blocked" ? "dim" : ""}"><span class="tile ${tone}"><ha-icon icon="${a.verdict === "ok" ? "mdi:check" : a.verdict === "review" ? "mdi:alert-outline" : "mdi:close-octagon-outline"}"></ha-icon></span>
        <span class="row-text"><strong>${obj ? `<button class="link" data-object="entity:${this.esc(a.object_id)}">${this.esc(a.name)}</button>` : this.esc(a.name)}</strong><small>${this.esc(a.object_id)}${reasons ? ` · ${this.esc(reasons)}` : ""}</small>${uses ? `<span class="chips" style="padding:6px 0 0;border:0">${uses}${more}</span>` : ""}</span>
        <span class="pill ${tone}">${this.t(`verdict_${a.verdict}`)}</span></div>`;
    }).join("");
    const extra = [sm.uses ? this.t("planUses", { count: sm.uses }) : "", sm.statistics ? this.t("planStats", { count: sm.statistics }) : ""].filter(Boolean).join(" · ");
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("planResult")} · ${this.t("dryRun")}</h2><p>${this.esc(this.formatDate(plan.created_at))}</p></div><button class="btn" data-plan-close>${this.t("planClose")}</button></div>
      <p class="factnote">${this.t("planSummary", { total: sm.total ?? 0, ok: sm.ok ?? 0, review: sm.review ?? 0, blocked: sm.blocked ?? 0 })}${extra ? ` ${this.esc(extra)}` : ""}</p>${rows}</section>`;
  }

  cleanupView() {
    if (this.journal === null && !this._journalRequested) { this._journalRequested = true; this.loadJournal(); }
    this.lvState("cleanup", "name", "asc");
    const all = this.cleanupCandidates();
    const sorts = [
      { key: "name", label: "sortName", dir: "asc", get: r => r.item.name },
      { key: "id", label: "sortId", dir: "asc", get: r => r.item.object_id },
      { key: "since", label: "sortSince", dir: "desc", get: r => r.finding.first_detected_at },
      { key: "certainty", label: "sortCertainty", dir: "desc", get: r => r.finding.confidence },
    ];
    const classes = [...new Set(all.map(r => r.finding.classification))];
    const bar = this.listBar("cleanup", { sorts, filters: [{ name: "classification", all: this.t("all"), options: classes.map(c => [c, this.t(c)]) }] });
    const list = this.refine("cleanup", all, {
      text: r => [r.item.name, r.item.object_id, r.item.platform].join(" "),
      filters: { classification: (r, v) => r.finding.classification === v }, sorts, tie: r => r.item.object_id,
    });
    const pg = this.paginate("cleanup", list);
    this._cleanupVisible = pg.rows.map(r => r.item.object_id);
    const row = ({ item, finding }) => `<div class="row"><input type="checkbox" data-sel="${this.esc(item.object_id)}" ${this.cleanupSel.has(item.object_id) ? "checked" : ""} aria-label="${this.esc(item.name)}">
      <button class="row-text link" style="text-align:left" data-object="entity:${this.esc(item.object_id)}"><strong>${this.esc(item.name)}</strong><small>${this.esc(item.object_id)}</small></button>${this.pill(finding.classification)}</div>`;
    const n = this.cleanupSel.size;
    const candidates = `<div class="panel"><div class="panelhead"><div><h2>${this.t("cleanupCandidates")} (${all.length})</h2><p>${this.t("cleanupCandidatesHint")}</p></div>
      <div class="actions" style="display:flex;gap:8px;align-items:center"><span class="date">${this.t("selectedCount", { count: n })}</span><button class="btn" data-sel-page>${this.t("selectPage")}</button><button class="btn" data-sel-clear ${n ? "" : "disabled"}>${this.t("clearSelection")}</button>
      <button class="btn primary" data-plan-create ${n && !this.cleanupBusy ? "" : "disabled"}>${this.cleanupBusy ? this.t("planCreating") : this.t("createPlan")}</button></div></div>
      ${bar}${list.length ? pg.rows.map(row).join("") : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t(all.length ? "noMatches" : "cleanupNone")}</div>`}${pg.footer}</div>`;
    const journal = (this.journal || []).map(plan => `<div class="row"><span class="tile mute"><ha-icon icon="mdi:clipboard-text-clock-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(this.formatDate(plan.created_at))}</strong><small>${this.t("planSummary", { total: plan.summary?.total ?? 0, ok: plan.summary?.ok ?? 0, review: plan.summary?.review ?? 0, blocked: plan.summary?.blocked ?? 0 })}</small></span>
      <span style="display:flex;gap:8px"><button class="btn" data-plan-open="${this.esc(plan.plan_id)}">${this.t("openPlan")}</button><button class="btn" data-plan-delete="${this.esc(plan.plan_id)}">${this.t("deletePlan")}</button></span></div>`).join("");
    const journalCard = `<div class="panel"><div class="panelhead"><div><h2>${this.t("journal")} (${(this.journal || []).length})</h2><p>${this.t("journalHint")}</p></div></div>${journal || `<div class="emptymsg"><ha-icon icon="mdi:clipboard-text-outline"></ha-icon>${this.t("journalEmpty")}</div>`}</div>`;
    return `<div class="stack"><div class="panel"><p class="factnote">${this.t("cleanupDryRun")}</p>${this.cleanupError ? `<div class="error">${this.t("planError")}: ${this.esc(this.cleanupError)}</div>` : ""}</div>
      ${this.plan ? this.planCard(this.plan) : ""}${candidates}${journalCard}</div>`;
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
    return items.filter(it => (!q || text(it).toLowerCase().includes(q))
      && Object.entries(st.f).every(([name, value]) => !value || !filters[name] || filters[name](it, value)))
      .sort((a, b) => {
        const x = get(a), y = get(b);
        if (empty(x) !== empty(y)) return empty(x) ? 1 : -1;
        const order = typeof x === "number" && typeof y === "number" ? x - y : String(x ?? "").localeCompare(String(y ?? ""), this.lang, { numeric: true, sensitivity: "base" });
        return order * sign || String(tie(a)).localeCompare(String(tie(b)), this.lang, { numeric: true });
      });
  }

  listBar(id, { sorts, filters = [] }) {
    const st = this.lv[id];
    (this.lvDirs ||= {})[id] = Object.fromEntries(sorts.map(x => [x.key, x.dir]));
    const selects = filters.map(f => `<select data-lf="${id}|${f.name}" aria-label="${this.esc(f.all)}"><option value="">${this.esc(f.all)}</option>${f.options.map(([v, label]) => `<option value="${this.esc(v)}" ${st.f[f.name] === v ? "selected" : ""}>${this.esc(label)}</option>`).join("")}</select>`).join("");
    const sortOptions = sorts.map(x => `<option value="${x.key}" ${st.sort === x.key ? "selected" : ""}>${this.t(x.label)}</option>`).join("");
    const desc = st.dir === "desc";
    return `<div class="listbar"><input type="search" data-lq="${id}" value="${this.esc(st.q)}" placeholder="${this.t("searchList")}">${selects}<select data-ls="${id}" aria-label="${this.t("sortBy")}">${sortOptions}</select><button class="dirbtn" data-ld="${id}" title="${this.t(desc ? "sortDescending" : "sortAscending")}" aria-label="${this.t(desc ? "sortDescending" : "sortAscending")}"><ha-icon icon="${desc ? "mdi:sort-descending" : "mdi:sort-ascending"}"></ha-icon></button></div>`;
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
    const footer = `<div class="tablefoot"><span>${this.formatNumber(from + 1)}–${this.formatNumber(from + rows.length)} ${this.t("of")} ${this.formatNumber(items.length)} · ${this.t("perPage")} <select data-pagesize>${sizes}</select></span>${count > 1 ? `<span class="pager"><button data-lpage="${id}|${page - 1}" ${page === 1 ? "disabled" : ""}>${this.t("previous")}</button> ${this.t("page")} ${page} ${this.t("of")} ${count} <button data-lpage="${id}|${page + 1}" ${page === count ? "disabled" : ""}>${this.t("next")}</button></span>` : ""}</div>`;
    return { rows, footer };
  }

  inventory() {
    const rows = this.filtered();
    const pg = this.paginate("inventory", rows);
    const visibleRows = pg.rows;
    const types = [...new Set(this.data.objects.map(x => x.object_type))].sort();
    const statuses = [...new Set(this.data.objects.map(x => x.status))].sort();
    return `<div class="panel"><div class="filters"><input id="query" type="search" value="${this.esc(this.query)}" placeholder="${this.t("search")}"><select id="typeFilter"><option value="">${this.t("all")}</option>${types.map(x => `<option value="${x}" ${this.typeFilter === x ? "selected" : ""}>${this.t(x)}</option>`).join("")}</select><select id="statusFilter"><option value="">${this.t("allStatus")}</option>${statuses.map(x => `<option value="${x}" ${this.statusFilter === x ? "selected" : ""}>${this.statusLabel(x)}</option>`).join("")}</select></div>
      <div class="tablewrap"><table><thead><tr>${this.th("name", "name")}${this.th("type", "type")}${this.th("status", "status")}<th>${this.t("reason")}</th>${this.th("since", "since")}</tr></thead><tbody>${visibleRows.map(item => `<tr data-object="${this.esc(this.objectKey(item))}"><td><span class="object">${this.tile(item.object_type, this.tone(item.status) === "ok" ? "" : this.tone(item.status))}<span><strong>${this.esc(item.name)}</strong><span class="id">${this.esc(item.object_id)}</span></span></span></td><td>${this.t(item.object_type)}</td><td>${this.pill(item.status)}</td><td>${this.esc(item.reason ? this.t(item.reason) : item.missing_reference_count ? `${item.missing_reference_count} ${this.t("missingReferences")}` : "—")}</td><td>${this.formatDate(item.status_since)}</td></tr>`).join("")}</tbody></table>${rows.length ? "" : `<div class="emptymsg">${this.t("noResults")}</div>`}</div>
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
    const USAGE = USAGE_RELATIONS;
    const incoming = this.data.edges.filter(e => e.target === key), outgoing = this.data.edges.filter(e => e.source === key);
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
    return `${search}<div class="panel pathcard">${this.tile(item.object_type, this.tone(item.status) === "ok" ? "" : this.tone(item.status))}<div><h2>${this.esc(item.name)} ${this.pill(item.status)}</h2><span class="id">${this.esc(item.object_id)}</span></div><button class="btn" data-object="${this.esc(key)}">${this.t("details")}</button></div>
      <div class="panel"><div class="panelhead"><h2>${this.t("origin")} → ${this.t("usage")}</h2><span class="date">${this.t("origin")} ${originEdges.length} · ${this.t("usage")} ${usageEntries.length}</span></div>
      <div class="path">${origin}<div class="node current">${this.tile(item.object_type, this.tone(item.status) === "ok" ? "" : this.tone(item.status))}<span><small>${this.t(item.object_type)}</small><strong>${this.esc(item.name)}</strong><span class="meta">${this.esc(item.object_id)}</span></span>${this.pill(item.status)}</div>${usage}</div></div>`;
  }

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

  check(label, tone, value, badge) { return { label, tone, value, badge }; }

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
      else rows.push(this.check(t("runtimeState"), "ok", state, t("available")));

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
      else if (state === "loaded") { rows.push(this.check(t("status"), "ok", item.name, t("cs_loaded"))); cause = t("cause_entry_ok"); }
      else { rows.push(this.check(t("status"), tone, item.name, t(`cs_${state}`))); cause = t("cause_entry_problem", { state: t(`cs_${state}`) }); hint = t("hint_integration"); }
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
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("diagnosis")}</h2>${item.reason ? `<p>${this.esc(this.t(item.reason))}</p>` : ""}</div></div>
      <div class="diagcard"><div class="checks">${rows}</div>
      ${d.cause ? `<div class="cause ${d.tone}"><ha-icon icon="mdi:text-search"></ha-icon><div><strong>${this.t("causeLabel")}</strong><p>${this.esc(d.cause)}</p></div></div>` : ""}
      ${d.hint ? `<div class="hintbox"><ha-icon icon="mdi:lightbulb-on-outline"></ha-icon><div><strong>${this.t("hintLabel")}</strong><p>${this.esc(d.hint)}</p></div></div>` : ""}</div></section>`;
  }

  // Read-only what-if: which automations would lose a reference if this object (and what it owns) were removed.
  impact(item, key) {
    if (["automation", "script", "scene", "dashboard"].includes(item.object_type)) return null;
    const OWNED = ["PROVIDES", "OWNS"], USAGE = USAGE_RELATIONS;
    const scope = new Set([key]);
    for (let grew = true; grew;) {
      grew = false;
      for (const e of this.data.edges) {
        if (OWNED.includes(e.relation) && scope.has(e.source) && !scope.has(e.target)) { scope.add(e.target); grew = true; }
      }
    }
    const byAutomation = new Map();
    for (const e of this.data.edges) {
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
    const used = new Set(this.data.edges.filter(e => USAGE_RELATIONS.includes(e.relation)).map(e => e.target));
    const SELF = ["automation", "script", "scene"];
    return this.data.objects.filter(o => o.object_type === "entity" && o.status === "active" && !o.entity_category
      && !SELF.includes(o.object_id.split(".")[0]) && !used.has(this.objectKey(o)))
      .sort((a, b) => a.object_id.localeCompare(b.object_id));
  }

  unreferencedView() {
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
    return `<div class="panel"><p class="factnote">${this.t("unreferencedHint")}</p>${bar}${rows.length ? pg.rows.map(row).join("") : `<div class="emptymsg"><ha-icon icon="mdi:link-variant"></ha-icon>${this.t(all.length ? "noMatches" : "noUnreferenced")}</div>`}${pg.footer}</div>`;
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

  integrationProblems() {
    const broken = this.data.objects.filter(o => o.object_type === "config_entry" && o.status === "problem");
    if (!broken.length) return "";
    const pg = this.paginate("integrations", broken);
    const rows = pg.rows.map(o => `<button class="row rel" data-object="${this.esc(this.objectKey(o))}">${this.tile("config_entry", "red")}<span class="row-text"><strong>${this.esc(o.name)}</strong><small>${this.esc(o.domain)} · ${this.t(`cs_${o.state || "not_loaded"}`)}</small></span>${this.pill(o.status)}</button>`).join("");
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("integrationProblems")} (${broken.length})</h2><p>${this.t("integrationProblemsHint")}</p></div></div>${rows}${pg.footer}</div>`;
  }

  factsCard(item, key) {
    const finding = this.data.findings.find(f => this.findingKey(f) === key);
    const usage = this.data.edges.filter(e => e.target === key && USAGE_RELATIONS.includes(e.relation)).length;
    const min = this.data.meta.min_unavailable_days || 0;
    const facts = [[this.t("status"), this.pill(item.status)]];
    if (item.status_since) facts.push([this.t("since"), `${this.formatDate(item.status_since)}<small>${this.esc(this.relTime(item.status_since))} · ${this.t("firstSeenNote")}</small>`]);
    if (["entity", "automation", "script", "scene", "dashboard"].includes(item.object_type)) {
      facts.push([this.t("finding"), finding ? `${this.pill(finding.classification)}<small>${this.t("certainty")}: ${Math.round(finding.confidence * 100)} %</small>` : this.t("noFinding")]);
    }
    if (item.object_type === "entity") facts.push([this.t("refCount"), this.formatNumber(usage)]);
    if (item.object_type === "entity" && this.data.meta.recorder_available) facts.push([this.t("longTermStats"), this.t(item.has_statistics ? "yes" : "no")]);
    const note = item.status === "unavailable" && !finding && min > 0 ? `<p class="factnote">${this.t("belowThreshold", { days: min })}</p>` : "";
    return `<section class="panel"><div class="panelhead"><h2>${this.t("facts")}</h2></div><div class="facts">${facts.map(([k, v]) => `<div class="fact"><span>${k}</span><b>${v}</b></div>`).join("")}</div>${note}</section>`;
  }

  relationsCard(key) {
    const USAGE = USAGE_RELATIONS;
    const incoming = this.data.edges.filter(e => e.target === key), outgoing = this.data.edges.filter(e => e.source === key);
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

  detail() {
    const base = this.selected;
    const item = { ...base, ...(this.details.get(this.objectKey(base)) || {}) };
    const key = this.objectKey(item);
    const skip = new Set(["attributes", "references", "name", "object_id", "object_type", "status", "reason", "state", "status_since", "status_since_source", "triggers", "conditions", "actions"]);
    const fields = Object.entries(item).filter(([k, v]) => !skip.has(k) && v !== null && v !== undefined && (typeof v !== "object" || Array.isArray(v)));
    const automation = ["automation", "script"].includes(item.object_type) && !this.detailLoading
      ? `<section class="panel"><div class="panelhead"><h2>${this.t("automationStructure")}</h2></div><div class="pad">${(item.object_type === "script" ? ["actions"] : ["triggers", "conditions", "actions"]).map(part => `<h4>${this.t(part)} (${item[part]?.length || 0})</h4><div class="code">${this.esc(JSON.stringify(item[part] || [], null, 2))}</div>`).join("")}</div></section>` : "";
    const attrs = item.attributes && Object.keys(item.attributes).length
      ? `<section class="panel"><div class="panelhead"><h2>${this.t("state")}</h2></div><div class="pad"><div class="code">${this.esc(JSON.stringify(item.attributes, null, 2))}</div></div></section>` : "";
    const path = this.haPath(item), tone = this.tone(item.status) === "ok" ? "" : this.tone(item.status);
    const back = this.trail.length ? this.trail[this.trail.length - 1].name : this.t(this.view);
    return `<div class="crumbs"><button class="btn" data-action="back"><ha-icon icon="mdi:arrow-left"></ha-icon>${this.t("backTo")} ${this.esc(back)}</button><span class="trail">${this.t(item.object_type)}</span></div>
      <div class="panel detailhead">${this.tile(item.object_type, tone)}<div>${this.pill(item.status)}<h1>${this.esc(item.name)}</h1><span class="id">${this.esc(item.object_id)}</span></div>
      <div class="actions">${path ? `<button class="btn" data-ha-path="${this.esc(path)}"><ha-icon icon="mdi:open-in-new"></ha-icon>${this.t("openInHA")}</button>` : ""}<button class="btn" data-graph-open="${this.esc(key)}"><ha-icon icon="mdi:source-fork"></ha-icon>${this.t("showInGraph")}</button></div></div>
      <div class="detailgrid"><div class="stack">${this.diagnosisCard(item)}${this.impactCard(item, key)}
        <section class="panel"><div class="panelhead"><h2>${this.t("registry")}</h2></div><div class="pad"><dl class="kv"><dt>${this.t("type")}</dt><dd>${this.t(item.object_type)}</dd>${fields.map(([k, v]) => `<dt>${this.esc(k)}</dt><dd>${this.esc(Array.isArray(v) ? v.join(", ") : v)}</dd>`).join("")}</dl></div></section>
        ${automation}${attrs}${this.detailLoading ? `<p class="sub">${this.t("loading")}</p>` : ""}</div>
      <div class="stack">${this.factsCard(item, key)}${this.findingsCard(key)}${this.relationsCard(key)}</div></div>`;
  }

  bind() {
    const root = this.shadowRoot;
    root.querySelectorAll("[data-view]").forEach(el => el.onclick = () => { this.view = el.dataset.view; this.pages = {}; this.selected = null; this.trail = []; this.render(); if (this.view === "changes" && !this.compare) this.loadCompare(); });
    root.querySelector("[data-action='scan']")?.addEventListener("click", () => this.load(true));
    root.querySelector("[data-action='back']")?.addEventListener("click", () => this.goBack());
    root.querySelectorAll("[data-graph-open]").forEach(el => el.onclick = () => {
      const obj = this.findObject(el.dataset.graphOpen);
      if (obj) { this.graphSelected = obj; this.graphQuery = ""; this.view = "graph"; this.selected = null; this.trail = []; this.render(); }
    });
    root.querySelectorAll("[data-jump]").forEach(el => el.onclick = () => {
      this.view = el.dataset.jump; this.pages = {};
      if (el.dataset.filter !== undefined) this.findingFilter = el.dataset.filter;
      if (el.dataset.jump === "inventory") { this.statusFilter = el.dataset.status || ""; this.typeFilter = ""; this.pages = {}; }
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
        if (finding) { finding.ignored = ignored; finding.ignored_by = ignored ? "user" : null; }
      } catch (err) { this.error = err?.message || String(err); }
      this.render();
    });
    root.querySelectorAll("[data-finding-filter]").forEach(el => el.onclick = () => { this.findingFilter = el.dataset.findingFilter; this.pages = {}; this.render(); });
    const focusKeep = (selector, setter) => {
      const input = root.querySelector(selector);
      if (!input) return;
      input.oninput = () => {
        setter(input.value);
        const caret = input.selectionStart;
        this.render();
        const next = this.shadowRoot.querySelector(selector);
        if (next) { next.focus(); next.setSelectionRange(caret, caret); }
      };
    };
    focusKeep("#query", v => { this.query = v; this.pages = {}; });
    focusKeep("#graphQuery", v => { this.graphQuery = v; });
    const bl = root.querySelector("#baseline"); if (bl) bl.onchange = () => { this.compareBaseline = bl.value; this.pages = {}; this.loadCompare(); };
    const tf = root.querySelector("#typeFilter"); if (tf) tf.onchange = () => { this.typeFilter = tf.value; this.pages = {}; this.render(); };
    const sf = root.querySelector("#statusFilter"); if (sf) sf.onchange = () => { this.statusFilter = sf.value; this.pages = {}; this.render(); };
    root.querySelectorAll("th[data-sort]").forEach(el => el.onclick = () => {
      if (this.sort === el.dataset.sort) this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
      else { this.sort = el.dataset.sort; this.sortDir = "asc"; }
      this.pages = {}; this.render();
    });
    root.querySelectorAll("[data-object]").forEach(el => el.onclick = () => { const obj = this.findObject(el.dataset.object); if (obj) this.openObject(obj); });
    root.querySelectorAll("[data-graph]").forEach(el => el.onclick = () => { const obj = this.findObject(el.dataset.graph); if (obj) { this.graphSelected = obj; this.graphQuery = ""; this.render(); } });
    root.querySelectorAll("[data-ha-path]").forEach(el => el.onclick = () => this.navigateHA(el.dataset.haPath));
    root.querySelectorAll("[data-pref]").forEach(el => el.onclick = () => { const [key, value] = el.dataset.pref.split("|"); this.setPref(key, value); });
    root.querySelectorAll("[data-pref-select]").forEach(el => el.onchange = () => this.setPref(el.dataset.prefSelect, el.value));
    root.querySelectorAll("[data-sel]").forEach(el => el.onchange = () => { el.checked ? this.cleanupSel.add(el.dataset.sel) : this.cleanupSel.delete(el.dataset.sel); this.render(); });
    root.querySelector("[data-sel-page]")?.addEventListener("click", () => { (this._cleanupVisible || []).forEach(id => this.cleanupSel.add(id)); this.render(); });
    root.querySelector("[data-sel-clear]")?.addEventListener("click", () => { this.cleanupSel.clear(); this.render(); });
    root.querySelector("[data-plan-create]")?.addEventListener("click", () => this.createPlan());
    root.querySelector("[data-plan-close]")?.addEventListener("click", () => { this.plan = null; this.render(); });
    root.querySelectorAll("[data-plan-open]").forEach(el => el.onclick = () => { this.plan = (this.journal || []).find(p => p.plan_id === el.dataset.planOpen) || null; this.render(); });
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
      const caret = input.selectionStart, selector = `[data-lq="${input.dataset.lq}"]`;
      this.render();
      const next = this.shadowRoot.querySelector(selector);
      if (next) { next.focus(); next.setSelectionRange(caret, caret); }
    });
    root.querySelectorAll("[data-lf]").forEach(el => el.onchange = () => { const [id, name] = el.dataset.lf.split("|"); this.lv[id].f[name] = el.value; this.pages = {}; this.render(); });
    root.querySelectorAll("[data-ls]").forEach(el => el.onchange = () => { const st = this.lv[el.dataset.ls]; st.sort = el.value; st.dir = this.lvDirs[el.dataset.ls][el.value] || "asc"; this.pages = {}; this.render(); });
    root.querySelectorAll("[data-ld]").forEach(el => el.onclick = () => { const st = this.lv[el.dataset.ld]; st.dir = st.dir === "desc" ? "asc" : "desc"; this.pages = {}; this.render(); });
    root.querySelectorAll("[data-lpage]").forEach(el => el.onclick = () => { const [id, n] = el.dataset.lpage.split("|"); this.pages[id] = Number(n); this.render(); });
    root.querySelectorAll("[data-pagesize]").forEach(el => el.onchange = () => { this.pageSize = Number(el.value); this.pages = {}; this.render(); });
  }
}

if (!customElements.get("ha-housekeeper-panel")) customElements.define("ha-housekeeper-panel", HAHousekeeperPanel);
