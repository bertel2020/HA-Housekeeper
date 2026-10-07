// CleanupMixin: methods of the panel element, mixed into the class in 99-register.js.
class CleanupMixin {
  // Days since an ISO timestamp, never negative.
  daysSince(value) {
    const ms = Date.now() - new Date(value).getTime();
    return Number.isFinite(ms) ? Math.max(0, Math.floor(ms / 864e5)) : 0;
  }

  quarantineOf(objectId) { return (this.data?.quarantine || []).find(q => q.object_id === objectId) || null; }

  quarantineCard() {
    const entries = this.data.quarantine || [];
    if (!entries.length) return "";
    const limit = this.data.meta.quarantine_days ?? 14;
    const rows = entries.map(q => {
      const item = this.findObject(`entity:${q.object_id}`), days = this.daysSince(q.since), left = limit - days;
      return `<button class="row rel" data-object="entity:${this.esc(q.object_id)}"><span class="tile mute"><ha-icon icon="mdi:archive-clock-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(item?.name || q.object_id)}</strong><small>${this.esc(q.object_id)} · ${this.t("quarantineSince", { date: this.formatDate(q.since), days })}</small></span><span class="pill ${left > 0 ? "mute" : "ok"}">${left > 0 ? this.t("quarantineWait", { days: left }) : this.t("quarantineReady")}</span></button>`;
    }).join("");
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("quarantine")} (${entries.length})</h2><p>${this.t("quarantineHint", { days: limit })}</p></div></div>${rows}</div>`;
  }

  cleanupCandidates() {
    if (this.cleanupKind === "remove_entity") {
      return (this.data.quarantine || []).map(q => ({ item: this.findObject(`entity:${q.object_id}`), finding: null, quarantine: q })).filter(r => r.item);
    }
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
      const plan = await this._hass.callWS({ type: "ha_housekeeper/plan_create", actions: [...this.cleanupSel].map(object_id => ({ kind: this.cleanupKind, object_id })) });
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

  adoptPlan(plan) {
    if (this.plan?.plan_id === plan.plan_id) this.plan = plan;
    this.journal = (this.journal || []).map(p => (p.plan_id === plan.plan_id ? plan : p));
  }

  async undoPlan(objectIds) {
    try {
      const res = await this._hass.callWS({ type: "ha_housekeeper/plan_undo", plan_id: this.plan.plan_id, ...(objectIds ? { object_ids: objectIds } : {}) });
      const kindOf = id => this.plan?.actions.find(a => a.object_id === id)?.kind;
      this.undoMessage = res.results.map(r => `${r.object_id}: ${this.t(r.outcome === "undone" && kindOf(r.object_id) === "remove_entity" ? "undo_restored" : `undo_${r.outcome}`)}`).join(" · ");
      const status = await this._hass.callWS({ type: "ha_housekeeper/plan_status", plan_id: this.plan.plan_id });
      this.adoptPlan(status.plan);
      if (this.data) this.load(false);
    } catch (err) { this.cleanupError = this.errText(err); }
    this.render();
  }

  async deletePlan(id) {
    try { await this._hass.callWS({ type: "ha_housekeeper/plan_delete", plan_id: id }); } catch (_) { /* already gone */ }
    this.journal = (this.journal || []).filter(p => p.plan_id !== id);
    if (this.plan?.plan_id === id) this.plan = null;
    this.render();
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
      const obj = this.findObject(`entity:${a.object_id}`);
      const result = a.result;
      const resultPill = result ? `<span class="pill ${result.state === "done" ? "ok" : result.state === "undone" ? "mute" : "warn"}">${this.t(result.state === "done" && a.kind === "remove_entity" ? "result_removed" : `result_${result.state}`)}</span>` : "";
      const abort = result?.state === "not_run" ? ` · ${this.t(`abort_${result.reason}`)}` : "";
      const ack = open && a.verdict === "review" && a.executable ? `<label class="factnote" style="padding:6px 0 0;display:flex;gap:6px;align-items:center"><input type="checkbox" data-ack="${this.esc(a.object_id)}" ${this.ack.has(a.object_id) ? "checked" : ""}>${this.t("acknowledgeReview")}</label>` : "";
      const undo = result?.state === "done" ? `<button class="btn" data-undo-one="${this.esc(a.object_id)}">${this.t("undoOne")}</button>` : "";
      return `<div class="row ${a.verdict === "blocked" ? "dim" : ""}"><span class="tile ${tone}"><ha-icon icon="${a.verdict === "ok" ? "mdi:check" : a.verdict === "review" ? "mdi:alert-outline" : "mdi:close-octagon-outline"}"></ha-icon></span>
        <span class="row-text"><strong>${obj ? `<button class="link" data-object="entity:${this.esc(a.object_id)}">${this.esc(a.name)}</button>` : this.esc(a.name)}</strong><small>${this.esc(a.object_id)}${reasons ? ` · ${this.esc(reasons)}` : ""}${this.esc(abort)}</small>${uses ? `<span class="chips" style="padding:6px 0 0;border:0">${uses}${more}</span>` : ""}${ack}</span>
        <span style="display:flex;gap:8px;align-items:center">${resultPill}${undo}<span class="pill ${tone}">${this.t(`verdict_${a.verdict}`)}</span></span></div>`;
    }).join("");
    const extra = [sm.uses ? this.t("planUses", { count: sm.uses }) : "", sm.statistics ? this.t("planStats", { count: sm.statistics }) : ""].filter(Boolean).join(" · ");
    const executable = plan.actions.some(a => a.executable);
    const removal = plan.actions.some(a => a.kind === "remove_entity" && a.executable);
    const word = this.t(removal ? "confirmWordRemove" : "confirmWord"), conf = this.confirmation?.plan_id === plan.plan_id ? this.confirmation : null;
    let control = "";
    if (open && !executable) control = `<p class="factnote">${this.t("nothingExecutable")}</p>`;
    else if (open && !conf) control = `<div class="setrow"><small style="margin:0">${this.t("cleanupDryRun")}</small><button class="btn primary" data-plan-confirm>${this.t("confirmPlan")}</button></div>`;
    else if (open && conf) control = `<div class="setrow"><div><strong>${this.t("confirmPlanTitle")}</strong><small>${this.t(removal ? "confirmedSummaryRemove" : "confirmedSummary", { count: conf.execute.length })}</small>${conf.needs_acknowledgement.length ? `<small>${this.t("skippedUnacknowledged", { count: conf.needs_acknowledgement.length })}</small>` : ""}</div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><label class="factnote" style="margin:0">${this.t("confirmTypeWord", { word })}</label><input type="text" data-confirm-word value="${this.esc(this.confirmWord)}" style="max-width:180px" autocomplete="off"><button class="btn primary" data-plan-execute ${this.confirmWord.trim().toUpperCase() === word ? "" : "disabled"}>${this.t("runNow")}</button></div></div>`;
    else if (plan.status === "running" || plan.status === "backup") control = `<div class="setrow"><small style="margin:0">${plan.status === "backup" || this.planProgress?.phase === "backup" ? this.t("backupRunning") : `${this.t("running")} ${this.planProgress ? this.t("progressOf", { done: this.planProgress.done, total: this.planProgress.total }) : ""}`}</small><button class="btn" data-plan-cancel>${this.t("cancelRun")}</button></div>`;
    else if (plan.actions.some(a => a.result?.state === "done")) control = `<div class="setrow"><small style="margin:0">${this.esc(this.undoMessage || "")}</small><button class="btn" data-undo-all>${this.t("undoAll")}</button></div>`;
    const checks = plan.verification ? `<p class="factnote"><b>${this.t("verification")}:</b> ${plan.verification.checks.map(c => `${c.ok ? "✓" : "✗"} ${this.t(`check_${c.check}`)}${c.object_id ? ` (${this.esc(c.object_id)})` : ""}`).join(" · ")}</p>` : "";
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("planResult")} · <span class="pill ${plan.status === "verified" ? "ok" : plan.status === "dry_run" ? "mute" : "warn"}">${this.t(`plan_status_${plan.status}`)}</span></h2><p>${this.esc(this.formatDate(plan.created_at))}</p></div><button class="btn" data-plan-close>${this.t("planClose")}</button></div>
      <p class="factnote">${this.t("planSummary", { total: sm.total ?? 0, ok: sm.ok ?? 0, review: sm.review ?? 0, blocked: sm.blocked ?? 0 })}${extra ? ` ${this.esc(extra)}` : ""}</p>${rows}${checks}${control}</section>`;
  }

  cleanupView() {
    if (this.journal === null && !this._journalRequested) { this._journalRequested = true; this.loadJournal(); }
    this.lvState("cleanup", "name", "asc");
    const all = this.cleanupCandidates();
    const sorts = [
      { key: "name", label: "sortName", dir: "asc", get: r => r.item.name },
      { key: "id", label: "sortId", dir: "asc", get: r => r.item.object_id },
      { key: "since", label: "sortSince", dir: "desc", get: r => (r.quarantine ? r.quarantine.since : r.finding.first_detected_at) },
      { key: "certainty", label: "sortCertainty", dir: "desc", get: r => (r.finding ? r.finding.confidence : null) },
    ];
    const limit = this.data.meta.quarantine_days ?? 14;
    const ready = r => !r.quarantine || this.daysSince(r.quarantine.since) >= limit;
    const classes = [...new Set(all.filter(r => r.finding).map(r => r.finding.classification))];
    const removal = this.cleanupKind === "remove_entity";
    const filterOptions = removal ? [["ready", this.t("removalReady")], ["waiting", this.t("waitingShort")]] : classes.map(c => [c, this.t(c)]);
    const bar = this.listBar("cleanup", { sorts, filters: [{ name: removal ? "readiness" : "classification", all: this.t("all"), options: filterOptions }] });
    const list = this.refine("cleanup", all, {
      text: r => [r.item.name, r.item.object_id, r.item.platform].join(" "),
      filters: { classification: (r, v) => r.finding && r.finding.classification === v, readiness: (r, v) => (v === "ready") === ready(r) }, sorts, tie: r => r.item.object_id,
    });
    const pg = this.paginate("cleanup", list);
    this._cleanupVisible = pg.rows.filter(ready).map(r => r.item.object_id);
    const row = r => {
      const { item, finding, quarantine } = r, left = quarantine ? limit - this.daysSince(quarantine.since) : 0;
      const badge = finding ? this.pill(finding.classification) : `<span class="pill ${left > 0 ? "mute" : "ok"}">${left > 0 ? this.t("daysLeftShort", { days: left }) : this.t("removalReady")}</span>`;
      return `<div class="row"><input type="checkbox" data-sel="${this.esc(item.object_id)}" ${this.cleanupSel.has(item.object_id) ? "checked" : ""} ${left > 0 ? "disabled" : ""} aria-label="${this.esc(item.name)}">
      <button class="row-text link" style="text-align:left" data-object="entity:${this.esc(item.object_id)}"><strong>${this.esc(item.name)}</strong><small>${this.esc(item.object_id)}</small></button>${badge}</div>`;
    };
    const n = this.cleanupSel.size;
    const candidates = `<div class="panel"><div class="panelhead"><div><h2>${this.t("cleanupCandidates")} (${all.length})</h2><p>${removal ? this.t("removalCandidatesHint", { days: limit }) : this.t("cleanupCandidatesHint")}</p></div>
      <div class="actions" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><select data-cleanup-kind aria-label="${this.t("actionKind")}"><option value="disable_entity" ${this.cleanupKind === "disable_entity" ? "selected" : ""}>${this.t("kindDisable")}</option><option value="remove_entity" ${this.cleanupKind === "remove_entity" ? "selected" : ""}>${this.t("kindRemove")}</option></select><span class="date">${this.t("selectedCount", { count: n })}</span><button class="btn" data-sel-page>${this.t("selectPage")}</button><button class="btn" data-sel-clear ${n ? "" : "disabled"}>${this.t("clearSelection")}</button>
      <button class="btn primary" data-plan-create ${n && !this.cleanupBusy ? "" : "disabled"}>${this.cleanupBusy ? this.t("planCreating") : this.t("createPlan")}</button></div></div>
      ${bar}${list.length ? pg.rows.map(row).join("") : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t(all.length ? "noMatches" : "cleanupNone")}</div>`}${pg.footer}</div>`;
    const journal = (this.journal || []).map(plan => `<div class="row"><span class="tile mute"><ha-icon icon="mdi:clipboard-text-clock-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(this.formatDate(plan.created_at))}</strong><small>${this.t("planSummary", { total: plan.summary?.total ?? 0, ok: plan.summary?.ok ?? 0, review: plan.summary?.review ?? 0, blocked: plan.summary?.blocked ?? 0 })}</small></span>
      <span class="pill ${plan.status === "verified" ? "ok" : plan.status === "dry_run" ? "mute" : "warn"}">${this.t(`plan_status_${plan.status || "dry_run"}`)}</span>
      <span style="display:flex;gap:8px"><button class="btn" data-plan-open="${this.esc(plan.plan_id)}">${this.t("openPlan")}</button>${plan.executed || plan.run ? "" : `<button class="btn" data-plan-delete="${this.esc(plan.plan_id)}">${this.t("deletePlan")}</button>`}</span></div>`).join("");
    const journalCard = `<div class="panel"><div class="panelhead"><div><h2>${this.t("journal")} (${(this.journal || []).length})</h2><p>${this.t("journalHint")}</p></div></div>${journal || `<div class="emptymsg"><ha-icon icon="mdi:clipboard-text-outline"></ha-icon>${this.t("journalEmpty")}</div>`}</div>`;
    return `<div class="stack"><div class="panel"><p class="factnote">${this.t("cleanupDryRun")}</p>${this.cleanupError ? `<div class="error">${this.t("planError")}: ${this.esc(this.cleanupError)}</div>` : ""}</div>
      ${this.plan ? this.planCard(this.plan) : ""}${this.quarantineCard()}${candidates}${journalCard}</div>`;
  }
}
