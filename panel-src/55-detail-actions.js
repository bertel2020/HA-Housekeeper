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
    const btn = (attr, icon, label) => `<button class="btn" ${attr}><ha-icon icon="${icon}"></ha-icon>${label}</button>`;
    const out = this.missingEntities(key).map(id => btn(`data-act-replace="${this.esc(id)}"`, "mdi:swap-horizontal", `${this.t("actReplace")} ${this.esc(id)}`));
    const broken = open.some(f => f.classification === "broken_reference");
    if (item.object_type === "entity" && open.some(f => f.rule_id.startsWith("entity.") && ["orphaned", "unavailable"].includes(f.classification))) {
      out.push(btn(`data-act-replace="${this.esc(item.object_id)}"`, "mdi:swap-horizontal", this.t("actReplaceThis")));
      if (item.status !== "disabled") out.push(btn(`data-act-disable="${this.esc(item.object_id)}"`, "mdi:cancel", this.t("actDisable")));
    }
    return { buttons: out.join(""), broken };
  }

  labelForm(item) {
    if (!["entity", "automation"].includes(item.object_type)) return "";
    const labels = (this.data.objects || []).filter(o => o.object_type === "label").sort((x, y) => String(x.name).localeCompare(String(y.name)));
    if (!labels.length) return "";
    const chosen = this.actLabel && labels.some(l => l.object_id === this.actLabel) ? this.actLabel : labels[0].object_id;
    return `<div class="setrow"><select data-act-label aria-label="${this.esc(this.t("labelChoose"))}">${labels.map(l => `<option value="${this.esc(l.object_id)}" ${chosen === l.object_id ? "selected" : ""}>${this.esc(l.name)}</option>`).join("")}</select>
      <button class="btn" data-act-label-plan="${this.esc(item.object_id)}"><ha-icon icon="mdi:label-outline"></ha-icon>${this.t("fselLabel")}</button></div>`;
  }

  actionsCard(item, key) {
    const rows = this.findingRows(key);
    const { buttons, broken } = this.fixButtons(item, key);
    const label = this.labelForm(item);
    if (!rows && !buttons && !label) return "";
    const fix = buttons || label ? `<div class="pad"><small class="factnote">${this.t("actPreviewOnly")}</small>${buttons ? `<div class="actions">${buttons}</div>` : ""}${label}${broken ? `<small class="factnote">${this.t("actEditInHa")}</small>` : ""}</div>` : "";
    return `<section class="panel"><div class="panelhead"><h2>${this.t("actionsTitle")}</h2></div>${rows}${fix}</section>`;
  }

  // The Cleanup view takes over from here: the assistant is filled in, the person looks at the preview and confirms.
  startCleanup(kind, fill) {
    this.noteJump?.("cleanup");
    this.cleanupKind = kind; this.cleanupSel = new Set(); this.plan = null; fill();
    if (this.lv.cleanup) this.lv.cleanup.f = {};
    this.view = viewForKind(kind); (this.viewTab ||= {}).cleanup = DEVICE_KINDS.includes(kind) ? "devices" : "entities"; this.repairTask = this.view === "repair" ? kind : null; this.pages = {}; this.selected = null;
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

  bindDetailActions(root) {
    root.querySelectorAll("[data-act-replace]").forEach(el => el.onclick = () => this.startCleanup("replace_references", () => { this.replOld = el.dataset.actReplace; this.replNew = ""; }));
    root.querySelectorAll("[data-act-disable]").forEach(el => el.onclick = () => this.startCleanup("disable_entity", () => this.cleanupSel.add(el.dataset.actDisable)));
    root.querySelector("[data-act-label]")?.addEventListener("change", e => { this.actLabel = e.target.value; });
    root.querySelector("[data-act-label-plan]")?.addEventListener("click", e => this.planLabel(e.currentTarget.dataset.actLabelPlan, root.querySelector("[data-act-label]")?.value || this.actLabel));
  }
}
Object.assign(TEXT.de, {
  actionsTitle: "Was du tun kannst", actReplace: "Ersetzen:", actReplaceThis: "Durch andere Entität ersetzen", actDisable: "Deaktivieren planen",
  actPreviewOnly: "Hier startest du nur eine Vorschau. Geändert wird erst, wenn du sie unter Aufräumen bestätigst.",
  actEditInHa: "Eine einzelne Referenz entfernt Housekeeper nicht selbst. Öffne die Automation in Home Assistant und bearbeite sie dort.",
});
Object.assign(TEXT.en, {
  actionsTitle: "What you can do", actReplace: "Replace:", actReplaceThis: "Replace by another entity", actDisable: "Plan to disable",
  actPreviewOnly: "This only starts a preview. Nothing changes until you confirm it under Cleanup.",
  actEditInHa: "Housekeeper does not remove a single reference itself. Open the automation in Home Assistant and edit it there.",
});
