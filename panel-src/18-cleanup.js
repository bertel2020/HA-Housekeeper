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
    if (executable.some(a => a.kind === "purge_statistics")) return this.t("purgeWord");
    if (executable.some(a => REMOVAL_KINDS.includes(a.kind))) return this.t("confirmWordRemove");
    if (executable.some(a => a.kind === "migrate_meter")) return this.t("confirmWordMeter");
    if (executable.some(a => a.kind === "repair_counter")) return this.t("confirmWordRepair");
    if (executable.some(a => a.kind === "replace_references" || a.kind === "refactor_automation")) return this.t("confirmWordReplace");
    return this.t("confirmWord");
  }

  confirmSummary(plan, count) {
    const executable = plan.actions.filter(a => a.executable);
    const devices = executable.some(a => DEVICE_KINDS.includes(a.kind));
    const key = executable.some(a => a.kind === "purge_statistics") ? "confirmedSummaryPurge" : executable.some(a => REMOVAL_KINDS.includes(a.kind)) ? (devices ? "confirmedSummaryDeviceRemove" : "confirmedSummaryRemove")
      : executable.some(a => a.kind === "migrate_meter") ? "confirmedSummaryMeter"
      : executable.some(a => a.kind === "repair_counter") ? "confirmedSummaryRepair"
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
        : this.cleanupKind === "repair_counter" ? [{ kind: "repair_counter", object_id: this.counterSel, mode: this.counterMode || "hold" }]
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
      const resultPill = result ? `<span class="pill ${result.state === "done" ? "ok" : result.state === "undone" ? "mute" : "warn"}">${this.t(result.state === "done" && REMOVAL_KINDS.includes(a.kind) ? "result_removed" : result.state === "done" && a.kind === "replace_references" ? "result_replaced" : result.state === "done" && a.kind === "refactor_automation" ? "result_refactored" : result.state === "done" && a.kind === "migrate_meter" ? "result_migrated" : result.state === "done" && a.kind === "repair_counter" ? "result_repaired" : result.state === "done" && a.kind === "add_label" ? "result_labeled" : result.state === "done" && a.kind === "purge_statistics" ? "result_purged" : `result_${result.state}`)}</span>` : "";
      const sub0 = a.kind === "add_label" ? `${a.object_id} + ${a.label_name || a.target || "?"}` : a.kind === "replace_references" || a.kind === "migrate_meter" ? `${a.object_id} → ${a.target || "?"}` : type === "device" ? `${this.t("deviceEntities", { count: (a.entities || []).length })}` : a.object_id;
      const sub = sub0 + (a.recorder ? ` · ${this.t(`recChoice_${a.recorder}`)}` : "");
      const sources = a.kind === "replace_references" ? this.sourceList(a) : a.kind === "refactor_automation" ? this.refactorDiff(a) : a.kind === "migrate_meter" ? this.meterDetail(a) : a.kind === "repair_counter" ? this.counterDetail(a) : "";
      const abort = result?.state === "not_run" ? ` · ${this.t(`abort_${result.reason}`)}` : "" + (result?.purge?.state === "failed" ? ` · ${this.t("result_purge_failed")}` : "");
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
      ${this.planStepper(plan, Boolean(conf))}<p class="factnote">${this.t("planSummary", { total: sm.total ?? 0, ok: sm.ok ?? 0, review: sm.review ?? 0, blocked: sm.blocked ?? 0 })}${extra ? ` ${this.esc(extra)}` : ""}</p>${this.simulationBlock(plan)}${rows}${checks}${this.followupLine(plan)}${control}${this.reportBlock(plan)}</section>`;
  }

  kindSelect() {
    const kinds = [["disable_entity", "kindDisable"], ["remove_entity", "kindRemove"], ["disable_device", "kindDisableDevice"], ["remove_device", "kindRemoveDevice"], ["forget_device", "kindForgetDevice"], ["replace_references", "kindReplace"], ["migrate_meter", "kindMeter"], ["repair_counter", "kindCounter"], ["exchange_device", "kindExchange"]];
    return `<select data-cleanup-kind aria-label="${this.t("actionKind")}">${kinds.map(([value, label]) => `<option value="${value}" ${this.cleanupKind === value ? "selected" : ""}>${this.t(label)}</option>`).join("")}</select>`;
  }

  // Replace one entity by another in every configuration that names it exactly.
  entityUnit(id) { return this.findObject(`entity:${id}`)?.unit; }

  // Candidates for the new entity, shown as buttons below the field. They only fill the field; the person decides.
  successorHints(id, unit, attr) {
    if (!id) return "";
    const found = this.successorsOf(id, unit);
    if (!found.length) return "";
    return `<div class="setrow"><small style="margin:0">${this.t("successorHint")}</small><span class="chips">${found.map(o => `<button class="chip" ${attr}="${this.esc(o.object_id)}" title="${this.esc(o.name)}">${this.esc(o.object_id)}</button>`).join("")}</span></div>`;
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
      ${hints}<div class="setrow"><small style="margin:0">${this.t("cleanupDryRun")}</small><button class="btn primary" data-plan-create ${ready ? "" : "disabled"}>${this.cleanupBusy ? this.t("planCreating") : this.t("replacePreview")}</button></div></div>`;
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
      ${this.successorHints(this.meterOld, byId.get(this.meterOld)?.unit, "data-meter-pick")}<div class="setrow"><small style="margin:0">${this.t("cleanupDryRun")}</small><button class="btn primary" data-plan-create ${ready ? "" : "disabled"}>${this.cleanupBusy ? this.t("planCreating") : this.t("replacePreview")}</button></div></div>`;
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
      <div class="toolbar">${this.kindSelect()}${this.recorderChoice(removal)}<span class="toolgap"></span><span class="date" aria-live="polite">${this.t("selectedCount", { count: n })}</span><button class="btn quiet" data-sel-page>${this.t("selectPage")}</button><button class="btn quiet" data-sel-clear ${n ? "" : "disabled"}>${this.t("clearSelection")}</button>
      <button class="btn primary" data-plan-create ${n && !this.cleanupBusy ? "" : "disabled"}>${this.cleanupBusy ? this.t("planCreating") : this.t("createPlan")}</button></div>
      ${bar}${list.length ? pg.rows.map(row).join("") : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t(all.length ? "noMatches" : "cleanupNone")}</div>`}${pg.footer}</div>`;
    const assistant = this.cleanupKind === "exchange_device" ? this.exchangeCard() : this.cleanupKind === "replace_references" ? this.replaceCard() : this.cleanupKind === "migrate_meter" ? this.meterCard() : this.cleanupKind === "repair_counter" ? this.counterCard() : candidates;
    const journalFound = this.searchList("journal", this.journal || [], plan => `${this.formatDate(plan.created_at)} ${this.t(`plan_status_${plan.status || "dry_run"}`)}`);
    const journalPage = this.paginate("journal", journalFound.rows);
    const journal = journalPage.rows.map(plan => `<div class="row">${this.mergeable(plan) ? `<input type="checkbox" data-merge-sel="${this.esc(plan.plan_id)}" ${this.mergeSel?.has(plan.plan_id) ? "checked" : ""} aria-label="${this.esc(this.t("mergeSelect"))}">` : ""}<span class="tile mute"><ha-icon icon="mdi:clipboard-text-clock-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(this.formatDate(plan.created_at))}</strong><small>${this.t("planSummary", { total: plan.summary?.total ?? 0, ok: plan.summary?.ok ?? 0, review: plan.summary?.review ?? 0, blocked: plan.summary?.blocked ?? 0 })}${plan.file_snapshot_dropped ? ` · ${this.esc(this.t("snapshotDropped"))}` : ""}</small></span>
      <span class="pill ${plan.status === "verified" ? "ok" : plan.status === "dry_run" ? "mute" : "warn"}">${this.t(`plan_status_${plan.status || "dry_run"}`)}</span>${plan.followup ? `<span class="pill ${this.followupTone(plan.followup?.state ?? plan.followup)}">${this.t(`fu_${plan.followup?.state ?? plan.followup}`)}</span>` : ""}
      <span style="display:flex;gap:8px"><button class="btn" data-plan-open="${this.esc(plan.plan_id)}">${this.t("openPlan")}</button>${plan.executed || plan.run ? "" : `<button class="btn" data-plan-delete="${this.esc(plan.plan_id)}">${this.t("deletePlan")}</button>`}</span></div>`).join("");
    const journalCard = `<div class="panel"><div class="panelhead"><div><h2>${this.t("journal")} (${(this.journal || []).length})</h2><p>${this.t("journalHint")}</p></div><div class="actions"><button class="btn" data-merge ${(this.mergeSel?.size || 0) >= 2 && !this.cleanupBusy ? "" : "disabled"}>${this.t("mergeButton", { count: this.mergeSel?.size || 0 })}</button></div></div>${this.mergeNote ? `<div class="pad"><small role="status">${this.esc(this.mergeNote)}</small></div>` : ""}${journalFound.bar}${journal || journalFound.none || `<div class="emptymsg"><ha-icon icon="mdi:clipboard-text-outline"></ha-icon>${this.t("journalEmpty")}<br><small>${this.t("journalEmptyNext")}</small></div>`}${journalPage.footer}</div>`;
    const tiles = this.sumTiles([
      { label: this.t("cleanupCandidates"), value: this.formatNumber(all.length), tone: all.length ? "warn" : "ok" },
      removal ? { label: this.t("removalReady"), value: this.formatNumber(all.filter(ready).length), tone: all.some(ready) ? "warn" : "mute" } : null,
      removal ? { label: this.t("waitingShort"), value: this.formatNumber(all.filter(r => !ready(r)).length), tone: "mute" } : null,
      { label: this.t("journal"), value: this.formatNumber((this.journal || []).length), tone: "mute" },
      { label: this.t("cleanupSumSelected"), value: this.formatNumber(n), tone: n ? "warn" : "mute" },
    ]);
    const purges = this.purges || [];
    const tabs = [
      { id: "new", label: this.t("cleanupTabNew"), count: all.length },
      { id: "journal", label: this.t("cleanupTabJournal"), count: (this.journal || []).length },
      ...(purges.length ? [{ id: "purges", label: this.t("cleanupTabPurges"), count: purges.length }] : []),
    ];
    const open = this.viewTabOf("cleanup", tabs, "new");
    const body = open === "journal" ? journalCard : open === "purges" ? this.purgeJournalCard() : `${this.quarantineCard()}${this.recurringCard()}${assistant}`;
    return `<div class="stack">${tiles}<div class="panel"><p class="factnote">${this.t("cleanupDryRun")}</p>${this.cleanupError ? `<div class="error">${this.t("planError")}: ${this.esc(this.cleanupError)}</div>` : ""}</div>
      ${this.plan ? this.planCard(this.plan) : ""}${this.viewTabBar("cleanup", tabs, open)}${body}</div>`;
  }
}
