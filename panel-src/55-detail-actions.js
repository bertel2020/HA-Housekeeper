// DetailActionsMixin: the card "What you can do" on the overview of an object. It collects what the other views
// already offer for this one object: decide its findings, and start a plan (replace, disable, label) that opens under
// Cleanup with a preview. Nothing here changes anything by itself.
class DetailActionsMixin {
  // The entity ids a missing reference points to; only entities can be replaced by another entity.
  missingEntities(key) {
    return [...new Set(this.data.findings.filter(f => !f.ignored && this.findingKey(f) === key && f.classification === "broken_reference" && f.rule_id.endsWith("_entity") && String(f.affected_object).includes(".")).map(f => f.affected_object))];
  }

  // The buttons this object offers; `finding` is the key of the open finding a button answers (the
  // first one becomes the next step). Such a button stands in that finding's row, not on its own.
  fixItems(item, key) {
    const open = this.data.findings.filter(f => !f.ignored && this.findingKey(f) === key);
    const out = this.missingEntities(key).map(id => ({ attr: `data-act-replace="${this.esc(id)}"`, icon: "mdi:swap-horizontal", label: `${this.t("actReplace")} ${this.esc(id)}`, hint: "actHintReplace", finding: open.find(f => f.affected_object === id && f.classification === "broken_reference")?.key || true }));
    const broken = open.some(f => f.classification === "broken_reference");
    const dup = item.object_type === "entity" ? open.find(f => f.rule_id === "entity.possible_duplicate" && f.affected_object) : null;
    const down = item.object_type === "entity" ? open.find(f => f.rule_id.startsWith("entity.") && ["orphaned", "unavailable"].includes(f.classification)) : null;
    // With a working twin, replacing it is the answer to the duplicate, filled in; offered once, there.
    if (dup) out.push({ attr: `data-act-replace="${this.esc(item.object_id)}"`, icon: "mdi:swap-horizontal", label: this.t("actReplaceTwin"), hint: "actHintReplaceTwin", finding: dup.key, ...(item.duplicate_of ? { plan: { kind: "replace_references", object_id: item.object_id, target: item.duplicate_of } } : {}) });
    if (down) {
      if (!dup) out.push({ attr: `data-act-replace="${this.esc(item.object_id)}"`, icon: "mdi:swap-horizontal", label: this.t("actReplaceThis"), hint: "actHintReplace", finding: down.key });
      // Disabling an entity its integration no longer provides changes nothing; it is removed straight away (within its first day the plan asks to confirm).
      if (item.reason === "not_provided") out.unshift({ attr: `data-act-remove="${this.esc(item.object_id)}"`, icon: "mdi:delete-outline", label: this.t("actRemove"), hint: "actHintRemove", finding: down.key, plan: { kind: "remove_entity", object_id: item.object_id } });
      else if (item.status !== "disabled") out.push({ attr: `data-act-disable="${this.esc(item.object_id)}"`, icon: "mdi:cancel", label: this.t("actDisable"), hint: "actHintDisable", finding: down.key, plan: { kind: "disable_entity", object_id: item.object_id } });
    }
    const blocked = item.object_type === "automation" ? open.find(f => f.rule_id === "automation.blocked") : null;
    if (blocked) out.push({ attr: `data-act-disable-auto="${this.esc(item.object_id)}"`, icon: "mdi:cancel", label: this.t("actDisableAuto"), hint: "actHintDisableAuto", finding: blocked.key, plan: { kind: "disable_entity", object_id: item.object_id } });
    // A sensor with long-term statistics can have wrong values repaired or be swapped for a new meter.
    if (item.object_type === "entity" && item.has_statistics && item.object_id.startsWith("sensor.")) {
      out.push({ attr: `data-act-repair="${this.esc(item.object_id)}"`, icon: "mdi:chart-line", label: this.t("actRepairValues"), hint: "actHintRepair" });
      out.push({ attr: `data-act-meter="${this.esc(item.object_id)}"`, icon: "mdi:gauge", label: this.t("actMeter"), hint: "actHintMeter" });
    }
    // An integration that did not load, or a device that is down and belongs to one integration: loading it anew is a plan of its own.
    const reload = item.object_type === "config_entry" ? (open.find(f => f.rule_id === "config_entry.not_loaded" && !["setup_retry", "setup_in_progress", "migration_error", "failed_unload"].includes(f.evidence?.[0]?.kind)) ? item.object_id : "")
      : item.object_type === "device" && open.some(f => f.rule_id === "device.down") && item.config_entry_ids?.length === 1 ? item.config_entry_ids[0] : "";
    if (reload) out.push({ attr: `data-act-reload="${this.esc(reload)}"`, icon: "mdi:reload", label: this.t("actReload"), hint: "actHintReload", finding: open.find(f => f.rule_id === "config_entry.not_loaded" || f.rule_id === "device.down")?.key, plan: { kind: "reload_integration", object_id: reload } });
    // An integration that keeps failing to set up can be sent into the auto-pause, which tries it again later on its own.
    const failing = item.object_type === "config_entry" ? open.find(f => f.rule_id === "config_entry.not_loaded") : null;
    if (failing && (this.autoPause?.pausable || []).some(p => p.entry_id === item.object_id)) out.push({ attr: `data-ap-send="${this.esc(item.object_id)}"`, icon: "mdi:pause-circle-outline", label: this.t("apSend"), hint: "apSendHint", btn: "apDo", finding: failing.key, ap: true });
    if (item.object_type === "entity") out.push({ attr: `data-act-replace-many="${this.esc(item.object_id)}"`, icon: "mdi:swap-horizontal-variant", label: this.t("actReplaceMany"), hint: "actHintReplaceMany" });
    // An entity a helper builds cannot be removed on its own: the helper makes it anew. Says so and points to the helper.
    const owner = item.object_type === "entity" && item.config_entry_id && HELPER_DOMAINS.has(item.platform) ? this.findObject(`config_entry:${item.config_entry_id}`) : null;
    if (owner) out.push({ attr: `data-object="${this.esc(owner.object_type)}:${this.esc(owner.object_id)}"`, icon: "mdi:function-variant", label: this.t("actHelperOwner", { name: this.esc(owner.name) }), hint: "actHintHelperOwner" });
    // A helper entry can be deleted by a plan, from its own page or from the page of one of its entities.
    const helperId = item.object_type === "config_entry" && HELPER_DOMAINS.has(item.domain) ? item.object_id : owner?.object_id;
    if (helperId) out.push({ attr: `data-act-export-helper="${this.esc(helperId)}"`, icon: "mdi:export", label: this.t("actExportHelper"), hint: "actHintExportHelper" });
    if (helperId) out.push({ attr: `data-act-remove-helper="${this.esc(helperId)}"`, icon: "mdi:delete-outline", label: this.t("actRemoveHelper"), hint: "actHintRemoveHelper" });
    // An entity that still works can be removed too, on purpose: no quarantine, backup and confirmation as for any removal.
    if (item.object_type === "entity" && !owner && item.status && !["orphaned", "unavailable", "unknown", "disabled"].includes(item.status)) out.push({ attr: `data-act-remove-working="${this.esc(item.object_id)}"`, icon: "mdi:delete-outline", label: this.t("actRemoveWorking"), hint: "actHintRemoveWorking" });
    // Any entity can be switched off or hidden by a plan; a step that already answers a finding (disable, remove) is not offered twice.
    if (item.object_type === "entity") {
      const state = (target, icon) => out.push({ attr: `data-act-state="${this.esc(item.object_id)}|${target}"`, icon, label: this.t(`actState_${target}`), hint: `actStateHint_${target}` });
      if (!item.disabled_by && !out.some(o => /data-act-(disable|remove)=/.test(o.attr))) state("disable", "mdi:cancel");
      else if (item.disabled_by === "user") state("enable", "mdi:check-circle-outline");
      if (!item.disabled_by) state(item.hidden_by ? "unhide" : "hide", item.hidden_by ? "mdi:eye-outline" : "mdi:eye-off-outline");
    }
    // A device disabled by the person is in quarantine; removing it asks the integration, or is forced when it offers no removal.
    if (item.object_type === "device" && item.disabled_by === "user") out.push({ attr: `data-act-remove-device="${this.esc(item.object_id)}|${item.removal_supported ? "remove_device" : "forget_device"}"`, icon: "mdi:delete-outline", label: this.t(item.removal_supported ? "actRemoveDevice" : "actForgetDevice"), hint: item.removal_supported ? "actHintRemoveDevice" : "actHintForgetDevice" });
    if (item.object_type === "device") out.push({ attr: `data-act-exchange="${this.esc(item.object_id)}"`, icon: "mdi:devices", label: this.t("actExchange"), hint: "actHintExchange" });
    return { items: out, broken };
  }

  fixTile(it) { return `<button class="taskcard" ${it.attr}><ha-icon icon="${it.icon}"></ha-icon><strong>${it.label}</strong><small>${this.t(it.hint)}</small></button>`; }

  // On the overview of an entity: the one step that answers its open finding, with a way to the other actions.
  nextStepBand(item, key) {
    const first = this.fixItems(item, key).items.find(it => it.finding);
    if (!first) return "";
    return `<section class="panel"><div class="nextstep"><span><strong>${this.t("nextStep")}:</strong> ${first.label}<small>${this.t(first.hint)}</small></span><span class="dbtns"><button class="btn quiet" data-detail-tab="actions">${this.t("moreActions")}</button><button class="btn primary" ${first.attr}>${first.label}</button></span></div></section>`;
  }

  // Whether the tab "Actions" has anything to show for this object: findings to decide, buttons, a label or an edit form.
  hasActionsTab(item, key) {
    if (!ACTION_TYPES.includes(item.object_type) && item.object_type !== "app") return false;
    return Boolean(this.findingRows(key, item) || this.fixItems(item, key).items.length || this.labelForm(item) || this.detailEditCard(item) || this.entityTrimCard(item) || this.staleCard(item) || (MARK_TYPES.includes(item.object_type) && this.markRows(item).length));
  }

  // The tab "Actions" of an object: everything that changes something as rows in one card, grouped by purpose.
  actionsTab(item, key) {
    const findings = this.findingRows(key, item);
    const { items, broken } = this.fixItems(item, key);
    // What answers an open finding is recommended; the tools that are always there (exchange, repair, meter) are "more actions".
    const recommended = [], tools = [];
    if (findings) recommended.push(`<div class="actblock">${findings}</div>`);
    // A step that answers a finding stands in that finding's row (findingRows); only one without a row of its own is listed here.
    for (const it of items.filter(it => typeof it.finding !== "string")) (it.finding ? recommended : tools).push(this.actRow(it.label, this.t(it.hint), `<button class="btn${it.finding ? " primary" : ""}" ${it.attr}>${this.t("actOpen")}</button>`));
    if (broken) recommended.push(`<div class="actblock"><small class="factnote">${this.t("actEditInHa")}</small></div>`);
    const labelControls = broken ? null : this.labelParts(item, true);
    const name = [...this.detailEditRows(item), labelControls ? this.actRow(this.t("actLabelTitle"), this.t("actLabelHint"), labelControls) : ""];
    const notes = this.markRows(item);
    const record = [...this.entityTrimRows(item), this.staleRow(item)];
    const group = (title, rows, sub = "") => { const html = rows.filter(Boolean).join(""); return html ? `<div class="actsec">${this.t(title)}${sub ? `<small>${sub}</small>` : ""}</div>${html}` : ""; };
    // What always exists (tools, name, record) is folded away while something answers a finding; it opens when nothing else is there.
    const lead = [recommended, notes].some(rows => rows.filter(Boolean).length);
    const fold = (id, title, rows, sub = "") => {
      const html = rows.filter(Boolean).join("");
      if (!html) return "";
      const open = this.foldOpen(id, !lead);
      return `<button type="button" class="actsec actfold" data-fold="${id}" aria-expanded="${open}"><ha-icon icon="mdi:chevron-${open ? "down" : "right"}"></ha-icon>${this.t(title)}</button>${open ? `${sub ? `<div class="pad"><small class="factnote">${sub}</small></div>` : ""}${html}` : ""}`;
    };
    const preview = this.t("actPreviewOnly");
    // A tab with nothing but the mark (a healthy integration or app) says what it is for.
    const onlyMark = notes.length && ![recommended, tools, name, record].some(rows => rows.filter(Boolean).length);
    const body = [group("actGroupRecommended", recommended, items.some(it => it.finding) ? preview : ""), group("actGroupNotes", notes), fold("act_tools", "moreActions", tools, preview), fold("act_name", "actGroupName", name), fold("act_record", "actGroupRecord", record)].join("") + (onlyMark ? `<div class="pad"><p class="factnote">${this.t("actOnlyNotes")}</p></div>` : "");
    return body ? `<section class="panel actpanel">${body}</section>` : `<p class="factnote">${this.t("actNone")}</p>`;
  }

  // The label list and its button; null when the object cannot take a label or no label exists.
  labelParts(item, short = false) {
    if (!LABEL_TYPES.includes(item.object_type)) return null;
    const labels = (this.data.objects || []).filter(o => o.object_type === "label").sort((x, y) => String(x.name).localeCompare(String(y.name)));
    if (!labels.length) return null;
    const chosen = this.actLabel && labels.some(l => l.object_id === this.actLabel) ? this.actLabel : labels[0].object_id;
    return `<select data-act-label aria-label="${this.esc(this.t("labelChoose"))}">${labels.map(l => `<option value="${this.esc(l.object_id)}" ${chosen === l.object_id ? "selected" : ""}>${this.esc(l.name)}</option>`).join("")}</select>
      <button class="btn primary" data-act-label-plan="${this.esc(item.object_id)}" ${this.planBusy ? 'disabled aria-busy="true"' : ""}>${this.t(short ? "actLabelPreviewShort" : "actLabelPreview")}</button>`;
  }

  labelForm(item) {
    const controls = this.labelParts(item);
    if (!controls) return "";
    return `<div class="labelbox"><span class="tile"><ha-icon icon="mdi:label-outline"></ha-icon></span><div class="labeltext"><strong>${this.t("actLabelTitle")}</strong><small>${this.t("actLabelHint")}</small></div>${controls}</div>`;
  }

  actionsCard(item, key, withLabel = true) {
    const rows = this.findingRows(key, item);
    const { items, broken } = this.fixItems(item, key);
    const buttons = items.filter(it => typeof it.finding !== "string").map(it => this.fixTile(it)).join("");
    const label = withLabel && !broken ? this.labelForm(item) : "";
    if (!rows && !buttons && !label && !broken) return "";
    const fix = buttons || label || broken ? `<div class="pad actpad"><small class="factnote">${this.t("actPreviewOnly")}</small>${buttons ? `<div class="taskgrid compactgrid">${buttons}</div>` : ""}${label}${broken ? `<small class="factnote">${this.t("actEditInHa")}</small>` : ""}</div>` : "";
    return `<section class="panel"><div class="panelhead"><h2>${this.t("actionsTitle")}</h2></div>${rows}${fix}</section>`;
  }

  // One row of the tab "Actions": the name with its explanation, and the control.
  // Long explanations are cut at two lines; "More" opens the rest.
  actRow(title, hint, control) {
    const long = hint && String(hint).length > 150;
    return `<div class="actrow"><span class="acttext"><strong>${title}</strong>${hint ? `<small${long ? ' class="clamp"' : ""}>${hint}</small>` : ""}${long ? `<button type="button" class="linkbtn morebtn" data-act-more aria-expanded="false">${this.t("actMore")}</button>` : ""}</span>${control ? `<span class="actctl">${control}</span>` : ""}</div>`;
  }

  // The Cleanup view takes over from here: the assistant is filled in, the person looks at the preview and confirms.
  startCleanup(kind, fill) {
    // Replacing references and carrying a meter on are one view of the replace assistant: one entity, then what should happen.
    if (kind === "replace_references" || kind === "migrate_meter") {
      const inner = fill, how = kind === "migrate_meter" ? "replace_statistics" : "";
      kind = "replace_wizard";
      fill = () => { inner(); this.rwState().single = true; this.replHow = how; };
    }
    this.noteJump?.("cleanup");
    this.cleanupKind = kind; this.cleanupSel = new Set(); this.plan = null; fill();
    if (this.lv.cleanup) this.lv.cleanup.f = {};
    this.view = viewForKind(kind); (this.viewTab ||= {}).cleanup = ["remove_entity", "remove_device", "forget_device"].includes(kind) ? "quarantine" : DEVICE_KINDS.includes(kind) ? "devices" : "entities"; if (kind === "remove_device" || kind === "forget_device") this.quarantineType = "device"; else if (kind === "remove_entity") this.quarantineType = "entity"; this.repairTask = this.view === "repair" ? kind : null; this.pages = {}; this.selected = null;
    this.render();
  }

  // A blocked automation is switched off by a plan like any entity: preview, confirmation, journal, undo.
  async planDisable(entityId) {
    try {
      if (!await this.newPlan([{ kind: "disable_entity", object_id: entityId }])) return;
      this.selected = null;
    } catch (err) { this.failed(err); }
    this.render();
  }

  async planRemove(entityId) {
    try {
      if (!await this.newPlan([{ kind: "remove_entity", object_id: entityId }])) return;
      this.selected = null;
    } catch (err) { this.failed(err); }
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
    this.bindHelperIo(root);
    root.querySelectorAll("[data-act-more]").forEach(el => el.onclick = () => {
      const open = el.previousElementSibling?.classList.toggle("open");
      el.setAttribute("aria-expanded", String(Boolean(open)));
      el.textContent = this.t(open ? "actLess" : "actMore");
    });
    root.querySelectorAll("[data-act-repair]").forEach(el => el.onclick = () => this.repairValues(el.dataset.actRepair));
    root.querySelectorAll("[data-act-meter]").forEach(el => el.onclick = () => this.startCleanup("migrate_meter", () => { this.replOld = el.dataset.actMeter; this.replNew = ""; }));
    root.querySelectorAll("[data-act-exchange]").forEach(el => el.onclick = () => this.startCleanup("exchange_device", () => { const ex = this.exchangeState(); ex.oldDev = el.dataset.actExchange; ex.newDev = ""; ex.result = null; ex.choices = {}; }));
    root.querySelectorAll("[data-act-replace]").forEach(el => el.onclick = () => this.startCleanup("replace_references", () => { this.replOld = el.dataset.actReplace; this.replNew = el.dataset.replNew || this.findObject(`entity:${el.dataset.actReplace}`)?.duplicate_of || ""; }));
    root.querySelectorAll("[data-act-reload]").forEach(el => el.onclick = async () => { try { await this.newPlan(el.dataset.actReload.split(",").map(object_id => ({ kind: "reload_integration", object_id }))); } catch (err) { this.failed(err); } this.render(); });
    root.querySelectorAll("[data-act-disable]").forEach(el => el.onclick = () => this.startCleanup("disable_entity", () => this.cleanupSel.add(el.dataset.actDisable)));
    root.querySelectorAll("[data-act-state]").forEach(el => el.onclick = async () => {
      const [object_id, target] = el.dataset.actState.split("|");
      try { if (!await this.newPlan([{ kind: "set_entity_state", object_id, target }])) return; this.selected = null; } catch (err) { this.failed(err); }
      this.render();
    });
    root.querySelectorAll("[data-act-remove-helper]").forEach(el => el.onclick = async () => {
      try { if (!await this.newPlan([{ kind: "remove_helper", object_id: el.dataset.actRemoveHelper }])) return; this.selected = null; } catch (err) { this.failed(err); }
      this.render();
    });
    root.querySelectorAll("[data-act-remove-working]").forEach(el => el.onclick = async () => {
      try { if (!await this.newPlan([{ kind: "remove_entity", object_id: el.dataset.actRemoveWorking, confirm_working: true }])) return; this.selected = null; } catch (err) { this.failed(err); }
      this.render();
    });
    root.querySelectorAll("[data-act-remove-device]").forEach(el => el.onclick = async () => {
      const [object_id, kind] = el.dataset.actRemoveDevice.split("|");
      try { if (!await this.newPlan([{ kind, object_id }])) return; this.selected = null; } catch (err) { this.failed(err); }
      this.render();
    });
    root.querySelectorAll("[data-act-remove]").forEach(el => el.onclick = () => this.planRemove(el.dataset.actRemove));
    root.querySelectorAll("[data-act-disable-auto]").forEach(el => el.onclick = () => this.planDisable(el.dataset.actDisableAuto));
    root.querySelector("[data-act-label]")?.addEventListener("change", e => { this.actLabel = e.target.value; });
    root.querySelector("[data-act-label-plan]")?.addEventListener("click", e => this.planLabel(e.currentTarget.dataset.actLabelPlan, root.querySelector("[data-act-label]")?.value || this.actLabel));
  }
}
Object.assign(TEXT.de, {
  actOpen: "Öffnen", tabActions: "Aktionen", nextStep: "Nächster Schritt", moreActions: "Weitere Aktionen", actGroupRecommended: "Empfohlen", actGroupName: "Benennen und einordnen", actGroupNotes: "Notizen", actOnlyNotes: "Hier legst du fest, was bei diesem Objekt normal ist, zum Beispiel „nachts offline“. Housekeeper meldet es dann nicht mehr als „nicht verfügbar“.", actMore: "Mehr", actLess: "Weniger", actLabelPreviewShort: "Vorschau", actGroupRecord: "Aufzeichnung und Überwachung", actNone: "Hier gibt es nichts zu tun.",
  actionsTitle: "Was möchtest du tun?", actReplace: "Ersetzen:", actReplaceThis: "Durch andere Entität ersetzen", actDisable: "Deaktivieren planen", actRemove: "Entfernen planen", actReplaceTwin: "Durch funktionierende Entität ersetzen", actHintReplaceTwin: "Überall durch die funktionierende Entität ersetzen; sie ist schon eingetragen.", actHintRemove: "Die Integration stellt sie nicht mehr bereit, darum ohne Quarantäne: mit Vorschau, Backup und Wiederherstellen.", actDisableAuto: "Automation deaktivieren (Plan)", actHintDisableAuto: "Keiner ihrer Auslöser kann feuern. Der Plan schaltet sie aus, mit Vorschau, Bestätigung und Rückgängig.",
  actLabelTitle: "Label ergänzen", actLabelHint: "Fügt ein vorhandenes Label hinzu, zum Beispiel zum Filtern. Du siehst zuerst eine Vorschau.", actLabelPreview: "Vorschau erstellen",
  actPreviewOnly: "Hier startest du nur eine Vorschau. Geändert wird erst, wenn du sie bestätigst.",
  actEditInHa: "Eine einzelne Referenz entfernt Housekeeper nicht selbst. Öffne die Automation in Home Assistant und bearbeite sie dort.",
});
Object.assign(TEXT.en, {
  actOpen: "Open", tabActions: "Actions", nextStep: "Next step", moreActions: "More actions", actGroupRecommended: "Recommended", actGroupName: "Name and classify", actGroupNotes: "Notes", actOnlyNotes: "Here you say what is normal for this object, for example “offline at night”. Housekeeper then stops reporting it as “not available”.", actMore: "More", actLess: "Less", actLabelPreviewShort: "Preview", actGroupRecord: "Recording and monitoring", actNone: "There is nothing to do here.",
  actionsTitle: "What would you like to do?", actReplace: "Replace:", actReplaceThis: "Replace by another entity", actDisable: "Plan to disable", actRemove: "Plan to remove", actReplaceTwin: "Replace by the working entity", actHintReplaceTwin: "Replace it everywhere by the working entity; it is already filled in.", actHintRemove: "Its integration no longer provides it, so no quarantine: with preview, backup and restore.", actDisableAuto: "Disable automation (plan)", actHintDisableAuto: "None of its triggers can fire. The plan switches it off, with preview, confirmation and undo.",
  actLabelTitle: "Add a label", actLabelHint: "Adds an existing label, for example for filtering. You see a preview first.", actLabelPreview: "Create preview",
  actPreviewOnly: "This only starts a preview. Nothing changes until you confirm it.",
  actEditInHa: "Housekeeper does not remove a single reference itself. Open the automation in Home Assistant and edit it there.",
});

// Switching one entity off or hiding it from its own page: a plan like any other (preview, backup, undo).
Object.assign(TEXT.de, {
  actState_disable: "Deaktivieren", actStateHint_disable: "Legt die Entität in Quarantäne: Sie wird nicht mehr geladen, Statistik und Einstellungen bleiben, du kannst sie wieder aktivieren.",
  actState_enable: "Wieder aktivieren", actStateHint_enable: "Aktiviert die Entität, die du deaktiviert hast, wieder.",
  actState_hide: "Ausblenden", actStateHint_hide: "Die Entität läuft weiter, taucht aber nicht mehr in Auto-Dashboards und Bereichen auf.",
  actState_unhide: "Einblenden", actStateHint_unhide: "Zeigt die Entität wieder in Auto-Dashboards und Bereichen.",
});
Object.assign(TEXT.en, {
  actState_disable: "Disable", actStateHint_disable: "Puts the entity in quarantine: it is no longer loaded, its statistics and settings stay, and you can enable it again.",
  actState_enable: "Enable again", actStateHint_enable: "Enables the entity you disabled again.",
  actState_hide: "Hide", actStateHint_hide: "The entity keeps running but no longer appears in auto-generated dashboards and areas.",
  actState_unhide: "Show", actStateHint_unhide: "Shows the entity in auto-generated dashboards and areas again.",
});

// An entity of a helper (template, derivative, ...): where it comes from, and what uses it is named a helper.
Object.assign(TEXT.de, {
  helperKind: "Helfer", actHelperOwner: "Gehört dem Helfer {name}", actHintHelperOwner: "Diese Entität erzeugt ein Helfer und legt sie sofort neu an. Zum Entfernen löschst du den Helfer in Home Assistant (Einstellungen → Geräte & Dienste → Helfer).",
});
Object.assign(TEXT.en, {
  helperKind: "Helper", actHelperOwner: "Belongs to the helper {name}", actHintHelperOwner: "A helper builds this entity and creates it again at once. To remove it, delete the helper in Home Assistant (Settings → Devices & services → Helpers).",
});

// A working entity removed on purpose.
Object.assign(TEXT.de, { actRemoveWorking: "Entfernen (läuft noch)", actHintRemoveWorking: "Entfernt den Registry-Eintrag, obwohl die Entität noch Werte liefert. Ohne Quarantäne, aber mit Backup und Vorschau; wird sie sicher verwendet, bleibt der Plan gesperrt.", reason_working_confirmed: "Die Entität liefert noch Werte. Du hast ausdrücklich gewählt, sie ohne Quarantäne zu entfernen." });
Object.assign(TEXT.en, { actRemoveWorking: "Remove (still working)", actHintRemoveWorking: "Removes the registry entry although the entity still delivers values. No quarantine, but with a backup and a preview; if it is certainly used, the plan stays blocked.", reason_working_confirmed: "The entity still delivers values. You chose explicitly to remove it without quarantine." });

// A helper that reads the entity loses its source when the entity is switched off or removed.
Object.assign(TEXT.de, { reason_feeds_helper: "Ein Helfer liest diese Entität und verliert damit seine Quelle: er meldet danach „nicht verfügbar“ oder falsche Werte." });
Object.assign(TEXT.en, { reason_feeds_helper: "A helper reads this entity and loses its source: it then reports unavailable or wrong values." });

// Deleting a helper entry: a plan with a backup first; only the backup brings it back.
Object.assign(TEXT.de, {
  actRemoveHelper: "Helfer löschen", actHintRemoveHelper: "Löscht den Helfer mit allen seinen Entitäten. Vorher legt Housekeeper ein Backup an; „Rückgängig“ erstellt ihn aus den gespeicherten Optionen neu.",
  reason_not_helper: "Das ist kein Helfer, den Housekeeper löschen darf.", check_helper_gone: "Helfer ist gelöscht", actKind_remove_helper: "Helfer gelöscht", goneKind_remove_helper: "Helfer gelöscht",
  confirmedSummaryHelper: "Der Helfer wird mit allen seinen Entitäten gelöscht. Vorher entsteht ein Backup. „Rückgängig“ erstellt ihn neu, die Statistik der Entitäten bleibt im Recorder.",
});
Object.assign(TEXT.en, {
  actRemoveHelper: "Delete the helper", actHintRemoveHelper: "Deletes the helper with all its entities. Housekeeper makes a backup first; “Undo” creates it anew from the saved options.",
  reason_not_helper: "This is not a helper Housekeeper may delete.", check_helper_gone: "Helper is deleted", actKind_remove_helper: "Helper deleted", goneKind_remove_helper: "Helper deleted",
  confirmedSummaryHelper: "The helper is deleted with all its entities. A backup is made first. “Undo” creates it anew, the statistics of its entities stay in the recorder.",
});

Object.assign(TEXT.de, {
  actRemoveDevice: "Gerät entfernen", actHintRemoveDevice: "Fragt die Integration und entfernt das Gerät mit seinen Entitäten. Erst nach der Quarantäne, mit Backup und Vorschau.",
  actForgetDevice: "Gerät lokal vergessen", actHintForgetDevice: "Die Integration bietet kein Entfernen; Housekeeper löscht den Eintrag erzwungen. Erst nach der Quarantäne, mit Backup und Vorschau; die Integration kann das Gerät wieder anlegen.",
  releaseByHand: "von Hand deaktiviert; in Home Assistant wieder aktivieren",
});
Object.assign(TEXT.en, {
  actRemoveDevice: "Remove device", actHintRemoveDevice: "Asks the integration and removes the device with its entities. Only after the quarantine, with a backup and a preview.",
  actForgetDevice: "Forget device locally", actHintForgetDevice: "The integration offers no removal; Housekeeper deletes the entry by force. Only after the quarantine, with a backup and a preview; the integration may create the device again.",
  releaseByHand: "disabled by hand; enable it again in Home Assistant",
});
