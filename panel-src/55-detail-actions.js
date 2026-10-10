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
      <button class="btn primary" data-act-label-plan="${this.esc(item.object_id)}" ${this.planBusy ? "disabled" : ""}>${this.t("actLabelPreview")}</button></div>`;
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
      if (!await this.newPlan([{ kind: "add_label", object_id: entityId, target: label }])) return;
      this.selected = null;
    } catch (err) { this.failed(err); }
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
