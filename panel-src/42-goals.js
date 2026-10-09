// Maintenance goals: what "in order" means for this house and whether it is so (see goals.py); mixed into the panel in 99-register.js.
Object.assign(TEXT.de, {
  goalsTitle: "Wartungsziele", goalsSub: "Eigene Grenzen für das, was in Ordnung heißt. Housekeeper ändert nichts.", goalsSummary: "{met} erfüllt, {missed} verfehlt",
  goal_broken_references: "Defekte Referenzen", goal_unavailable: "Nicht verfügbare Entitäten", goal_backup_age: "Alter des letzten Backups", goal_restore_test_age: "Alter des Wiederherstellungstests", goal_recorder_growth: "Datenbankwachstum", goal_weak_batteries: "Schwache Batterien", goal_devices_without_area: "Geräte ohne Bereich",
  goalLimit: "höchstens {limit}", goalNow: "jetzt {value}", goalNever: "nie", goalNoBackup: "kein Backup", goalUnknownHint: "noch nicht messbar",
  goalState_met: "Erfüllt", goalState_missed: "Verfehlt", goalState_unknown: "Unbekannt", goalState_off: "Aus",
  goalUnit_mb_per_day: "{n} MB pro Tag", goalEdit: "Anpassen", goalLimitLabel: "Grenze", goalEnabled: "Ziel beachten", goalDefault: "Standard: {n}", goalFailed: "Nicht gespeichert: {reason}",
});
Object.assign(TEXT.en, {
  goalsTitle: "Maintenance goals", goalsSub: "Your own limits for what in order means. Housekeeper changes nothing.", goalsSummary: "{met} met, {missed} missed",
  goal_broken_references: "Broken references", goal_unavailable: "Unavailable entities", goal_backup_age: "Age of the latest backup", goal_restore_test_age: "Age of the restore test", goal_recorder_growth: "Database growth", goal_weak_batteries: "Weak batteries", goal_devices_without_area: "Devices without an area",
  goalLimit: "at most {limit}", goalNow: "now {value}", goalNever: "never", goalNoBackup: "no backup", goalUnknownHint: "cannot be measured yet",
  goalState_met: "Met", goalState_missed: "Missed", goalState_unknown: "Unknown", goalState_off: "Off",
  goalUnit_mb_per_day: "{n} MB per day", goalEdit: "Adjust", goalLimitLabel: "Limit", goalEnabled: "Watch this goal", goalDefault: "Default: {n}", goalFailed: "Not saved: {reason}",
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

  goalRow(g) {
    const form = this.goalForm?.id === g.id ? this.goalFormHtml(g) : "";
    const title = `<button class="linklike" data-jump="${GOAL_VIEWS[g.id]}"><strong>${this.t(`goal_${g.id}`)}</strong></button>`;
    return `<div class="row"><span class="tile ${GOAL_TONES[g.state]}"><ha-icon icon="${g.state === "met" ? "mdi:check-circle-outline" : g.state === "missed" ? "mdi:alert-circle-outline" : "mdi:help-circle-outline"}"></ha-icon></span><span class="row-text">${title}<small>${this.esc(this.goalNow(g))} · ${this.esc(this.t("goalLimit", { limit: this.goalAmount(g, g.limit) }))}</small></span><span class="pill ${GOAL_TONES[g.state]}">${this.t(`goalState_${g.state}`)}</span><button class="btn quiet" data-goal-open="${g.id}">${this.t("goalEdit")}</button></div>${form}`;
  }

  goalFormHtml(g) {
    const f = this.goalForm;
    return `<form class="pad polform" data-goal-form="${g.id}"><label>${this.t("goalLimitLabel")} <input type="number" data-goal-limit min="0" step="1" value="${this.esc(String(f.limit))}"></label>
      <label><input type="checkbox" data-goal-enabled ${f.enabled ? "checked" : ""}> ${this.t("goalEnabled")}</label><small>${this.t("goalDefault", { n: this.goalAmount(g, g.default) })}</small>
      <button type="submit" class="btn primary">${this.t("viewSave")}</button><button type="button" class="btn quiet" data-goal-cancel>${this.t("cancelRun")}</button>
      ${f.error ? `<small class="error" role="alert">${this.esc(f.error)}</small>` : ""}</form>`;
  }

  goalsCard() {
    this.ensureGoals();
    const r = this.goals;
    if (!r?.goals?.length) return "";
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
