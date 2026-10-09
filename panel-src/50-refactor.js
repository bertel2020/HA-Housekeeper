// Mechanical improvements of one automation (see refactor.py): proposals in the diagnosis card, the plan runs under Cleanup.
Object.assign(TEXT.de, {
  refactorTitle: "Verbessern (experimentell)",
  refactorHint: "Kleine, genau benannte Änderungen an der Konfiguration. Logik, Bedingungen und Templates fasst Housekeeper nie an. Jede Änderung ist ein Plan mit Vorschau, Backup und Rückgängig.",
  refactorOff: "Das Verbessern ist ausgeschaltet. Es schreibt in deine Automationen-Datei und wurde auf einer echten Instanz noch nicht erprobt.",
  refactorTurnOn: "Experimentell einschalten", refactorTurnOff: "Ausschalten", refactorLoading: "Vorschläge werden gesucht …",
  refactorNothing: "Nichts vorzuschlagen.", refactorNotEditable: "Diese Automation lässt sich nicht automatisch ändern: {reason}.",
  refactorFix_add_description: "Beschreibung ergänzen", refactorFixHint_add_description: "Ohne Beschreibung weiß später niemand, wofür die Automation da ist. Den Text schreibst du.",
  refactorFix_remove_duplicate_triggers: "Doppelte Trigger entfernen", refactorFixHint_remove_duplicate_triggers: "{count} Trigger sind völlig gleich. Danach läuft die Automation einmal statt zweimal je Ereignis.",
  refactorDescription: "Beschreibung", refactorPlan: "Plan erstellen", refactorFailed: "Plan nicht erstellt: {reason}", refactorDiffBefore: "vorher", refactorDiffNone: "entfällt",
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
  refactorDescription: "Description", refactorPlan: "Create plan", refactorFailed: "Plan not created: {reason}", refactorDiffBefore: "before", refactorDiffNone: "removed",
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
    const rows = view.proposals.map(p => {
      const input = p.fix === "add_description" ? `<textarea data-refactor-text="${this.esc(p.fix)}" maxlength="300" rows="2" aria-label="${this.esc(this.t("refactorDescription"))}" style="width:100%;max-width:520px">${this.esc(r.text[p.fix] || "")}</textarea>` : "";
      return `<div class="pad polform"><strong>${this.t(`refactorFix_${p.fix}`)}</strong><small style="display:block">${this.t(`refactorFixHint_${p.fix}`, { count: p.count || 0 })}</small>${input}<button class="btn" data-refactor-plan="${this.esc(p.fix)}">${this.t("refactorPlan")}</button></div>`;
    }).join("");
    return `<div class="pad"><small>${this.t("refactorHint")}</small></div>${rows || `<div class="pad"><small>${this.t("refactorNothing")}</small></div>`}${note}${off}`;
  }

  // What the plan shows for one edit: the path and what stood there.
  refactorDiff(action) {
    const lines = (action.sources || []).flatMap(s => s.changes || []).slice(0, 5).map(c => `<small style="display:block;opacity:.8">${this.esc(c.path)}: ${c.after === null ? this.esc(this.t("refactorDiffNone")) : this.esc(String(c.after))}${c.before === null ? "" : ` (${this.esc(this.t("refactorDiffBefore"))}: ${this.esc(JSON.stringify(c.before)).slice(0, 120)})`}</small>`).join("");
    return `<span style="display:block;padding:6px 0 0">${lines}</span>`;
  }

  async makeRefactorPlan(entityId, fix) {
    const r = this.refactorState();
    const values = fix === "add_description" ? { description: (r.text[fix] || "").trim() } : {};
    r.message = "";
    try {
      const plan = await this._hass.callWS({ type: "ha_housekeeper/plan_create", actions: [{ kind: "refactor_automation", object_id: entityId, fix, values }] });
      this.plan = plan; this.confirmation = null; this.ack = new Set(); this.confirmWord = "";
      this.journal = [plan, ...(this.journal || [])];
      this.noteJump?.("cleanup"); this.view = "cleanup"; this.pages = {};
    } catch (err) { r.message = this.t("refactorFailed", { reason: err?.message || String(err) }); }
    this.render();
  }

  bindRefactor(root) {
    const sel = () => this.diagState().sel;
    root.querySelectorAll("[data-refactor-switch]").forEach(el => el.onclick = () => this.setRefactor(el.dataset.refactorSwitch === "on"));
    root.querySelectorAll("[data-refactor-text]").forEach(el => el.oninput = () => { this.refactorState().text[el.dataset.refactorText] = el.value; });
    root.querySelectorAll("[data-refactor-plan]").forEach(el => el.onclick = () => this.makeRefactorPlan(sel(), el.dataset.refactorPlan));
  }
}
