// SafetyMixin: the thin status line under the navigation that says how safe the writing parts are.
class SafetyMixin {
  ensureSafetyData() {
    if (this.journal === null && !this._journalRequested) { this._journalRequested = true; this.loadJournal(); }
    this.ensureBackup();
  }

  // Each item is [key, tone, text, target view]; running work comes first, nothing is invented when data is missing.
  safetyItems() {
    const items = [], plans = this.journal || [];
    const check = this.backup?.available ? (this.backup.checks || []).find(c => c.id === "newest") : null;
    if (this.plan && ["backup", "running"].includes(this.plan.status)) items.push(["run", "warn", this.t(this.plan.status === "backup" ? "safeBackupRunning" : "safeRunning"), "cleanup"]);
    if (check) items.push(["backup", check.level === "ok" ? "ok" : "warn", check.values?.age_hours === null || check.values?.age_hours === undefined ? this.t("safeNoBackup") : this.t("safeBackup", { age: this.bhAge(check.values.age_hours) }), "maintenance"]);
    const last = plans.find(p => p.finished_at);
    if (last) {
      items.push(["last", "mute", this.t("safeLast", { when: this.formatDate(last.finished_at) }), "cleanup"]);
      items.push(["undo", last.undoable ? "ok" : "mute", this.t(last.undoable ? "safeUndo" : "safeNoUndo"), "cleanup"]);
    }
    const watching = plans.filter(p => p.followup === "watching").length;
    if (watching) items.push(["watch", "warn", this.t("safeWatching", { n: watching }), "cleanup"]);
    const regress = plans.filter(p => p.followup === "regression").length;
    if (regress) items.push(["regress", "red", this.t("safeRegression", { n: regress }), "cleanup"]);
    return items;
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
