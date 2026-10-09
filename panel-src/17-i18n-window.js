// Texts for the maintenance window; merged into TEXT.
Object.assign(TEXT.de, {
  winTab: "Wartungsfenster", winTitle: "Wartungsfenster", winExperimental: "experimentell", winHint: "Führt dich der Reihe nach durch Prüfung, einen Plan, das Neuladen, den Neustart und den Vergleich. Nichts läuft von allein, Housekeeper startet Home Assistant nie neu.",
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
  winTab: "Maintenance window", winTitle: "Maintenance window", winExperimental: "experimental", winHint: "Guides you through the check, a plan, the reload, the restart and the comparison, one after the other. Nothing runs on its own, Housekeeper never restarts Home Assistant.",
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
