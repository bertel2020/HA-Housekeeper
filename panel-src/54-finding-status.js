// FindingStatusMixin: the status of a finding as the list shows it. Some are decided by the user (known,
// snoozed, hidden), some follow from what Housekeeper sees (new, in work, fixed). Nothing here stores anything:
// the decisions are the ones of the ignore list, the rest is derived from the scan and the journal of plans.
const DONE_PERIODS = [7, 30, 90], ACTIVE_PLAN = ["dry_run", "backup", "running"];
// The chips of the list are states that exclude each other; "new", "in work" and "due" are parts of the open ones.
const FINDING_STATES = ["known", "snoozed", "hidden"];

Object.assign(TEXT.de, {
  bandChange: "Ändern", bandUndo: "Wieder aufnehmen", bandByLabel: "Per Label ausgeblendet", bandMark: "Objekt-Notiz: {kind}", bandRemoveMark: "Entfernen",
});
Object.assign(TEXT.en, {
  bandChange: "Change", bandUndo: "Take back", bandByLabel: "Hidden by a label", bandMark: "Object note: {kind}", bandRemoveMark: "Remove",
});

class FindingStatusMixin {
  // What the person decided about this object, above all tabs of its page: a decided finding (known, snoozed, hidden) and a mark.
  statusBand(item, key) {
    const change = this.hasActionsTab(item, key) ? `<button class="btn" data-detail-tab="actions">${this.t("bandChange")}</button>` : "";
    const rows = (this.data?.findings || []).filter(f => f.ignored && f.ignored_by !== "mark" && this.findingKey(f) === key).map(f => {
      const info = f.ignore_info, byLabel = f.ignored_by === "label";
      const title = f.ignored_by === "rule" ? this.t("hidByRule") : byLabel ? this.t("bandByLabel") : info ? this.t(`decideKind_${info.kind}`) : this.t("ignoredLabel");
      const until = info?.until ? this.t("decideUntil", { date: this.formatDate(info.until) }) : "";
      const note = [until, info?.reason, f.ignored_by === "rule" ? this.findingRuleLine(f) : ""].filter(Boolean).join(" · ");
      const undo = f.ignored_by === "user" ? `<button class="btn" data-ignore="${this.esc(f.key)}" data-ignore-value="0">${this.t("bandUndo")}</button>` : "";
      return `<div class="row" data-status-band="finding"><span class="tile mute"><ha-icon icon="mdi:bookmark-check-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(title)}</strong><small>${this.esc([this.findingTitle(f), note].filter(Boolean).join(" · "))}</small></span>${change}${undo}</div>`;
    });
    if (item.mark) {
      const clear = MARK_TYPES.includes(item.object_type) ? `<button class="btn quiet" data-mark-clear="${this.esc(key)}">${this.t("bandRemoveMark")}</button>` : "";
      rows.push(`<div class="row" data-status-band="mark"><span class="tile ${item.mark_due ? "warn" : "mute"}"><ha-icon icon="mdi:bookmark-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(this.t("bandMark", { kind: this.t(`mark_${item.mark.kind}`) }))}</strong><small>${this.esc(this.markLine(item.mark))}${item.mark_due ? ` · ${this.t("markDue")}` : ""}</small></span>${change}${clear}</div>`);
    }
    return rows.length ? `<div class="panel u-mb14">${rows.join("")}</div>` : "";
  }

  // The objects of drafted or running plans; rebuilt when the journal changes.
  planSets() {
    const hour = Math.floor(Date.now() / 3600000); // a preview runs out with time, not only with a new journal
    if (this._planSets?.journal === this.journal && this._planSets.data === this.data && this._planSets.hour === hour) return this._planSets;
    const active = new Set();
    // A preview older than a day can no longer be confirmed: it is dropped by the backend and does not count here.
    // A plan for a device puts the findings of its entities in work as well.
    const devices = new Set();
    for (const plan of this.journal || []) if (ACTIVE_PLAN.includes(plan.status) && !this.planStale(plan)) (plan.objects || []).forEach(id => { active.add(id); devices.add(id); });
    for (const o of this.data?.objects || []) if (o.object_type === "entity" && o.device_id && devices.has(o.device_id)) active.add(o.object_id);
    this._planSets = { journal: this.journal, data: this.data, hour, active };
    return this._planSets;
  }

  // What the user decided: known (kept on purpose), snoozed, hidden; "" for an open finding.
  decidedState(f) {
    if (!f.ignored) return "";
    if (f.ignored_by !== "user") return "hidden";
    const kind = f.ignore_info?.kind;
    return kind === "keep" ? "known" : kind === "snooze" ? "snoozed" : "hidden";
  }

  // The last visit of this user to the findings page: when it was and how the findings stood. It comes with the first data;
  // what a leave records becomes the base of the next visit, not of the one in progress.
  ensureVisit() {
    if (this._visitAsked || !this.data) return;
    this._visitAsked = true;
    this.visit = this.data.visit || null;
    this._visitKeys = null;
  }

  // Called with every render: opening the findings page starts a visit, leaving it records the visit.
  trackVisit() {
    this.ensureVisit();
    const on = this.view === "findingsNav";
    if (on && !this._visiting) {
      this._visiting = true;
      if (this._visitNext) { this.visit = this._visitNext; this._visitNext = null; this._visitKeys = null; }
    } else if (!on && this._visiting) { this._visiting = false; this.leaveFindings(); }
  }

  async leaveFindings() {
    try { const v = await this._hass?.callWS?.({ type: "ha_housekeeper/visit_leave" }); if (v) this._visitNext = v; } catch (_) { /* the next visit asks again */ }
  }

  // What is new since the last visit and what got worse, as sets of finding keys. From impact low up; a follow-up counts
  // only when its cause does; a "later" that came back because it got worse counts as worse.
  visitSets() {
    const base = this.visit?.at ? this.visit : null, id = `${this.data?.meta?.scanned_at}|${base?.at}|${this._rev}|${this.data?.findings?.length}`;
    if (this._visitKeys?.id === id) return this._visitKeys;
    const fresh = new Set(), worse = new Set(), found = { id, fresh, worse, all: new Set(), base };
    if (base && this.data?.findings) {
      const rank = level => IMPACT_RANK[level] ?? 0, since = at => at && Date.parse(at) > Date.parse(base.at);
      const follows = f => (this.causeList().find(c => c.finding_key === f.key)?.total_followers) || 0;
      const open = this.data.findings.filter(f => !f.ignored || false);
      const judge = f => {
        if (rank(f.impact) >= IMPACT_RANK.low && since(f.first_seen_at)) return "fresh";
        const was = base.state?.[f.key];
        if (was && (rank(f.impact) > rank(was[0]) || follows(f) > was[1])) return "worse";
        return "";
      };
      const lonely = [], followers = [];
      for (const f of open) { if (f.cause_id && this.causeById(f.cause_id)?.finding_key && this.causeById(f.cause_id).finding_key !== f.key) followers.push(f); else lonely.push(f); }
      for (const f of lonely) { const kind = judge(f); if (kind === "fresh") fresh.add(f.key); else if (kind === "worse") worse.add(f.key); }
      // A "later" that came back because it got worse since the visit.
      for (const f of this.data.findings) if (f.resurfaced && f.due_info?.worse && since(f.due_info.worse) && !fresh.has(f.key)) worse.add(f.key);
      for (const f of followers) {
        const own = this.causeById(f.cause_id).finding_key, kind = judge(f);
        if (kind && (fresh.has(own) || worse.has(own))) (kind === "fresh" ? fresh : worse).add(f.key);
      }
    }
    for (const k of [...fresh, ...worse]) found.all.add(k);
    return (this._visitKeys = found);
  }

  isNewFinding(f) { return this.visitSets().fresh.has(f.key); }
  isWorseFinding(f) { return this.visitSets().worse.has(f.key); }

  // The entry the findings page opens at: what is new since the last visit, when there is something; otherwise all.
  defaultFindingStatus() { return this.visit?.at && this.visitSets().all.size ? "new" : ""; }

  // The outages the overview counts (every cause from medium on) with everything they explain: the jump of its row.
  // A finding belongs when its cause or one above it counts; quiet outages stay out, missing services are in.
  // The outages the overview counts: chains at their top, a device below an integration that is down is part of that
  // integration's chain, not an outage of its own; quiet ones (info, low) stay away.
  // level "high" keeps the urgent ones, "medium" the others; without a level all of them.
  countedOutages(level = "") { return this.causeEntries().filter(c => !c.virtual && !this.quietCause(c) && (level === "high" ? c.impact === "high" : level === "medium" ? c.impact !== "high" : true)); }

  // The missing targets (a virtual cause: the callers of one thing that is gone) are no outage; they have a row of their own.
  countedTargets() { return this.causeEntries().filter(c => c.virtual); }

  // The findings of the counted outages (of one level): every open finding whose chain ends at the top in one of them.
  outageKeys(level = "") {
    const tops = new Set(this.countedOutages(level).map(c => c.id));
    const top = f => { let c = this.causeById(f.cause_id), n = 0; while (c?.parent_id && n < 20) { c = this.causeById(c.parent_id); n++; } return c; };
    return new Set((this.data?.findings || []).filter(f => !f.ignored && f.cause_id && tops.has(top(f)?.id)).map(f => f.key));
  }

  // The findings below one cause, at any depth: the jump of a cause that has no page of its own.
  causeKeys(id) {
    const below = f => { for (let c = this.causeById(f.cause_id), n = 0; c && n < 20; c = this.causeById(c.parent_id), n++) if (c.id === id) return true; return false; };
    return new Set((this.data?.findings || []).filter(f => !f.ignored && f.cause_id && below(f)).map(f => f.key));
  }

  // The findings the vacation mode holds back right now or until its grace ends: what the vacation bar counts.
  heldKeys() { return new Set((this.data?.findings || []).filter(f => f.ignored_by === "rule" && ["vacation", "after"].includes(f.ignore_rule?.phase)).map(f => f.key)); }

  inWork(f) { return !f.ignored && (!!f.in_work || this.planSets().active.has(f.object_id)); }

  // Does a finding belong to the chosen status? "" is the default: everything not decided.
  statusMatch(f) {
    switch (this.findingStatus) {
      case "": return !f.ignored;
      case "all": return true;
      case "new": return this.visitSets().all.has(f.key);
      case "inwork": return this.inWork(f);
      case "due": return !f.ignored && Boolean(f.resurfaced);
      default: return this.decidedState(f) === this.findingStatus;
    }
  }

  statusCount(state) {
    const list = this.data.findings;
    if (state === "") return list.filter(f => !f.ignored).length;
    return list.filter(f => (state === "new" ? this.visitSets().all.has(f.key) : state === "inwork" ? this.inWork(f) : state === "due" ? !f.ignored && f.resurfaced : this.decidedState(f) === state)).length;
  }

  // "New", "In work" next to a row's other facts.
  statusTags(f) {
    return [this.isNewFinding(f) ? this.t("stateNew") : this.isWorseFinding(f) ? this.t("stateWorse") : "", this.inWork(f) ? this.t("stateInwork") : ""].filter(Boolean).map(x => ` · ${x}`).join("");
  }

  // One row for the state of a finding: open with its parts (new in the last days, in work, due again), then what was
  // decided and what was done. The tiles count within the chosen chip.
  statusChips() {
    const chip = (state, label, count, sub = false) => `<button class="chip${sub ? " sub" : ""} ${(this.findingStatus || "") === state ? "active" : ""}" data-fstatus="${state || "open"}" aria-pressed="${(this.findingStatus || "") === state}">${label} (${this.formatNumber(count)})</button>`;
    const parts = [["new", this.t("freshNew")], ["inwork", this.t("freshInwork")]].map(([s, label]) => [s, label, this.statusCount(s)]).filter(([s, , n]) => n || (s === "new" && this.visit?.at));
    const decided = FINDING_STATES.filter(s => this.statusCount(s)), fixed = this.doneCount();
    const rest = [...decided.map(s => chip(s, this.t(`state_${s}`), this.statusCount(s))), ...(fixed ? [chip("fixed", this.t("state_fixed"), fixed)] : [])];
    const due = this.statusCount("due");
    return [chip("", this.t("stateOpen"), this.findingTotal()), ...parts.map(([s, label, n]) => chip(s, label, n, true)), ...(due ? [chip("due", this.t("stateDue"), due).replace('class="chip', 'class="chip warn')] : []), ...(rest.length ? ['<span class="chipsep" aria-hidden="true"></span>', ...rest] : [])].join("");
  }

  doneDays() { return this.doneDaysSel || 30; }

  // The plans that finished in the chosen period and did something, newest first: one event each.
  doneEvents() {
    const limit = Date.now() - this.doneDays() * 864e5;
    return (this.journal || []).filter(p => p.finished_at && Date.parse(p.finished_at) >= limit && (p.done_count ?? (p.done_objects || []).length) > 0)
      .sort((x, y) => Date.parse(y.finished_at) - Date.parse(x.finished_at));
  }

  // What ended between two scans without a plan: read from the comparison with the scan closest to the period. Loaded when the list opens.
  endedNow() { return this.ended?.key === `${this.doneDays()}|${this.data?.meta?.scanned_at}` && !this.ended.error ? this.ended : null; }

  // Findings that went away by themselves and were not counted as done by a plan: "back in order" ones are good news.
  endedSelf() {
    const e = this.endedNow();
    if (!e) return { back: [], removed: [], unread: [], other: [] };
    const byPlan = new Set((this.journal || []).flatMap(p => p.done_objects || []));
    const rest = list => list.filter(f => !byPlan.has(f.object_id));
    const by = reasons => rest(e.ended).filter(f => reasons.includes(f.reason));
    return { back: rest(e.resolved), removed: by(["object_removed"]), unread: by(["unchecked"]), other: by(["unknown", "rules_changed"]) };
  }

  // The number on the chip: plans that fixed something, plus findings that ended by themselves in good order.
  doneCount() { return this.doneEvents().length + this.endedSelf().back.length; }

  async loadEnded() {
    const days = this.doneDays(), key = `${days}|${this.data?.meta?.scanned_at}`;
    if (this._endedKey === key || !this._hass) return;
    this._endedKey = key;
    try {
      let c = await this._hass.callWS({ type: "ha_housekeeper/compare", baseline: "previous" });
      const want = Date.now() - days * 864e5, list = (c.baselines || []).filter(b => b.at);
      const best = list.length ? list.reduce((x, y) => (Math.abs(Date.parse(y.at) - want) < Math.abs(Date.parse(x.at) - want) ? y : x)) : null;
      if (best && best.id !== "previous") c = await this._hass.callWS({ type: "ha_housekeeper/compare", baseline: best.id });
      const ok = c.available !== false;
      this.ended = { key, since: c.baseline_at, resolved: ok ? c.resolved_findings?.items || [] : [], ended: ok ? c.ended_findings?.items || [] : [] };
    } catch (_) { this.ended = { key, error: true }; }
    this.render();
  }

  // "Done": what a plan fixed, and what ended by itself, in the chosen period. Only the first two groups count as fixed.
  // Every group starts folded; its head names the count.
  fixedList() {
    this.loadEnded();
    const days = this.doneDays(), e = this.endedNow(), self = this.endedSelf();
    const picker = `<label class="factnote">${this.t("donePeriod")} <select data-done-days aria-label="${this.esc(this.t("donePeriod"))}">${DONE_PERIODS.map(n => `<option value="${n}" ${n === days ? "selected" : ""}>${this.t("doneDays", { n })}</option>`).join("")}</select></label>`;
    const planRows = this.doneEvents().map(p => {
      const n = p.done_count ?? (p.done_objects || []).length;
      const names = (p.done_objects || []).slice(0, 3).map(id => this.findObject(`entity:${id}`)?.name || id).join(", ") + (n > 3 ? " …" : "");
      const kinds = (p.kinds || []).map(k => { const label = this.t(`actKind_${k}`); return label === `actKind_${k}` ? k : label; }).join(", ");
      return `<button class="row" data-jump="journal"><span class="tile ok"><ha-icon icon="mdi:check"></ha-icon></span><span class="row-text"><strong>${this.esc(kinds || this.t("donePlan"))}</strong><small>${this.esc(this.t("doneObjects", { n: this.formatNumber(n) }))}: ${this.esc(names)} · ${this.esc(this.formatDate(p.finished_at))} · ${this.t(p.undoable ? "doneUndoYes" : "doneUndoNo")}</small></span></button>`;
    });
    const group = (id, title, tone, rows, open) => {
      if (!rows.length) return "";
      const pg = this.paginate(`done_${id}`, rows);
      return this.fold(`done_${id}`, { tone, title: this.t(title), pill: this.formatNumber(rows.length) }, pg.rows.join("") + pg.footer, open);
    };
    const row = (f, tone) => `<div class="row"><span class="tile ${tone}"><ha-icon icon="mdi:${tone === "ok" ? "check" : "help-circle-outline"}"></ha-icon></span><span class="row-text"><strong>${this.esc(this.findObject(`${f.rule_id.split(".")[0]}:${f.object_id}`)?.name || f.object_id)}</strong><small>${this.esc(this.findingTitle(f))}</small></span></div>`;
    const groups = [
      group("plan", "doneByPlan", "ok", planRows, false),
      group("back", "doneBack", "ok", self.back.map(f => row(f, "ok")), false),
      group("removed", "doneRemoved", "mute", self.removed.map(f => row(f, "mute")), false),
      group("unread", "doneUnread", "mute", self.unread.map(f => row(f, "mute")), false),
      group("other", "doneOther", "mute", self.other.map(f => row(f, "mute")), false),
    ].join("");
    const note = e ? `<p class="factnote">${this.esc(this.t("doneSince", { date: this.formatDate(e.since) }))}</p>` : "";
    return `${picker}${groups || `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("doneNone", { days })}</div>`}${note}`;
  }

  // The selected rows whose object can carry a mark (entity, device, integration, app): selection key -> object key.
  markTargets(onDevice = false) {
    const out = new Map();
    for (const key of this.findSel) {
      const finding = this.data.findings.find(f => f.key === key);
      let objectKey = finding && this.findingKey(finding);
      // "On the device": only a device that is down completely, so the mark covers no entity that still works.
      const device = onDevice && objectKey?.startsWith("entity:") && this.findObject(objectKey)?.device_id;
      if (device && this.findObject(`device:${device}`) && this.deviceDown(device)) objectKey = `device:${device}`;
      if (objectKey && MARK_TYPES.includes(objectKey.split(":")[0])) out.set(key, objectKey);
    }
    return out;
  }

  deviceDown(id) { return this.data.findings.some(f => f.rule_id === "device.down" && f.object_id === id); }

  // How many selected entities have a device that is down: only then the form offers to mark the devices instead.
  markDeviceCount() {
    return new Set([...this.markTargets(true).values()].filter(k => k.startsWith("device:"))).size - new Set([...this.markTargets().values()].filter(k => k.startsWith("device:"))).size;
  }

  // The kinds every selected object accepts: integrations and apps take fewer than entities and devices.
  markKindsFor(targets) {
    const all = ["expected_offline", "seasonal", "spare", "keep", "replaced"], few = ["expected_offline", "seasonal", "spare"];
    return [...targets.values()].some(k => ["config_entry", "app"].includes(k.split(":")[0])) ? few : all.filter(k => k !== "replaced");
  }

  async commitMarkBulk() {
    const b = this.bulk, targets = this.markTargets(b.onDevice);
    // One mark per object: several findings of the same device need it once.
    const objects = [...new Set(targets.values())];
    const failed = await this.runBulk(objects, async objectKey => {
      const [object_type, ...rest] = objectKey.split(":");
      const msg = { type: "ha_housekeeper/mark_set", object_type, object_id: rest.join(":"), kind: b.markKind || this.markKindsFor(targets)[0], reason: b.reason.trim() };
      if (Number(b.days)) msg.days = Number(b.days);
      await this._hass.callWS(msg);
      targets.forEach((k, key) => { if (k === objectKey) this.findSel.delete(key); });
    });
    await this.refreshData();
    if (!failed) this.bulk = null;
    this.render();
  }

  // The form under the selection bar: known or snoozed for all selected findings at once.
  bulkForm() {
    const b = this.bulk;
    if (!b) return "";
    if (b.kind === "mark") {
      const targets = this.markTargets(b.onDevice), kinds = this.markKindsFor(targets), devices = this.markDeviceCount();
      const objects = new Set(targets.values()).size;
      const days = [0, 30, 90, 180, 365].map(n => `<option value="${n}" ${Number(b.days) === n ? "selected" : ""}>${n ? this.t("decideDays", { n }) : this.t("markNever")}</option>`).join("");
      const onDevice = devices ? `<label class="nw"><input type="checkbox" data-bulk-ondevice ${b.onDevice ? "checked" : ""}> ${this.esc(this.t("markOnDevice"))}</label>` : "";
      return `<form class="polform bulkform" data-bulk-form><strong>${this.t("markTitle")} (${this.formatNumber(objects)})</strong>${onDevice}
        <select data-bulk-markkind aria-label="${this.esc(this.t("markKind"))}">${kinds.map(k => `<option value="${k}" ${(b.markKind || kinds[0]) === k ? "selected" : ""}>${this.t(`mark_${k}`)}</option>`).join("")}</select>
        <input data-bulk-reason maxlength="200" autocomplete="off" value="${this.esc(b.reason)}" aria-label="${this.esc(this.t("markReason"))}" placeholder="${this.esc(this.t("markReason"))}">
        <select data-bulk-days aria-label="${this.esc(this.t("markReview"))}">${days}</select>
        <button type="submit" class="btn primary">${this.t("saveOptions")}</button><button type="button" class="btn quiet" data-bulk-cancel>${this.t("cancelRun")}</button></form>`;
    }
    if (b.kind === "area") return this.areaForm();
    if (b.kind === "status") {
      return `<form class="polform bulkform statusform" data-bulk-form><strong>${this.t("statusTitle", { n: this.formatNumber(this.findSel.size) })}</strong>${this.statusFields(b, "bulk", b.state)}
        <div class="mbtns"><button type="button" class="btn quiet" data-bulk-cancel>${this.t("cancelRun")}</button><button type="submit" class="btn primary">${this.t("saveOptions")}</button></div>
        ${b.error ? `${this.notice("err", this.t(b.error))}` : ""}</form>`;
    }
    if (b.kind === "label") {
      const labels = (this.data.objects || []).filter(o => o.object_type === "label").sort((x, y) => String(x.name).localeCompare(String(y.name)));
      if (!labels.length) return `<div class="polform bulkform"><small>${this.t("labelNone")}</small><button type="button" class="btn quiet" data-bulk-cancel>${this.t("cancelRun")}</button></div>`;
      return `<form class="polform bulkform" data-bulk-form><strong>${this.t("state_label")}</strong>
        <select data-bulk-label aria-label="${this.esc(this.t("labelChoose"))}">${labels.map(l => `<option value="${this.esc(l.object_id)}" ${b.label === l.object_id ? "selected" : ""}>${this.esc(l.name)}</option>`).join("")}</select>
        <button type="submit" class="btn primary" ${this.planBusy ? 'disabled aria-busy="true"' : ""}>${this.t("refactorPlan")}</button><button type="button" class="btn quiet" data-bulk-cancel>${this.t("cancelRun")}</button>
        ${b.error ? `${this.notice("err", this.t(b.error))}` : ""}</form>`;
    }
    const days = [7, 30, 90, 365].map(n => `<option value="${n}" ${Number(b.days) === n ? "selected" : ""}>${this.t("decideDays", { n })}</option>`).join("");
    return `<form class="polform bulkform" data-bulk-form><strong>${this.t(`state_${b.kind}`)}</strong>
      <input data-bulk-reason maxlength="200" autocomplete="off" value="${this.esc(b.reason)}" aria-label="${this.esc(this.t("decideReason"))}" placeholder="${this.esc(this.t(b.kind === "known" ? "decideReasonNeeded" : "decideReason"))}">
      ${b.kind === "snoozed" ? `<select data-bulk-days aria-label="${this.esc(this.t("decideHow"))}">${days}</select>` : ""}
      <button type="submit" class="btn primary">${this.t("saveOptions")}</button><button type="button" class="btn quiet" data-bulk-cancel>${this.t("cancelRun")}</button>
      ${b.error ? `${this.notice("err", this.t(b.error))}` : ""}</form>`;
  }

  // Adding a label is a plan like any other: it opens under Cleanup with a preview and an undo.
  async makeLabelPlan() {
    const b = this.bulk;
    const ids = [...new Set([...this.findSel].map(key => this.data.findings.find(f => f.key === key)).filter(Boolean)
      .filter(f => LABEL_TYPES.includes(this.findObject(this.findingKey(f))?.object_type)).map(f => f.object_id))];
    if (!ids.length) { b.error = "labelNoEntities"; this.render(); return; }
    const label = b.label || (this.data.objects || []).find(o => o.object_type === "label")?.object_id;
    try {
      if (!await this.newPlan(ids.map(object_id => ({ kind: "add_label", object_id, target: label })))) return;
      this.bulk = null; this.findSel.clear();
    } catch (err) { b.error = ""; this.failed(err); }
    this.render();
  }

  async commitBulk() {
    const b = this.bulk;
    if (!b) return;
    if (b.kind === "label") return this.makeLabelPlan();
    if (b.kind === "area") return this.makeAreaPlan();
    if (b.kind === "mark") return this.commitMarkBulk();
    // "known" and "snoozed" are the older shortcuts of the same form.
    const kind = b.kind === "status" ? b.state : b.kind === "known" ? "keep" : "snooze";
    if (kind === "keep" && !b.reason.trim()) { b.error = "decideNeedReason"; this.render(); return; }
    const keys = [...this.findSel].filter(key => this.data.findings.some(f => f.key === key && !f.ignored));
    const failed = await this.runBulk(keys, async key => {
      const msg = { type: "ha_housekeeper/ignore", finding_key: key, ignored: true, kind, reason: b.reason.trim() };
      if (kind === "snooze") msg.days = Number(b.days) || 30;
      else if (b.kind === "status" && Number(b.days)) msg.days = Number(b.days);
      else if (b.kind === "status" && kind === "keep" && this.findingCritical(this.data.findings.find(f => f.key === key))) msg.days = this.defaultDays("keep");
      await this._hass.callWS(msg);
      const finding = this.data.findings.find(f => f.key === key);
      if (finding) {
        finding.ignored = true; finding.ignored_by = "user"; finding.resurfaced = false;
        finding.ignore_info = { kind: msg.kind, reason: msg.reason, until: msg.days ? new Date(Date.now() + msg.days * 864e5).toISOString() : null, at: new Date().toISOString() };
      }
    });
    if (!failed) this.bulk = null;
    this.render();
    if (failed < keys.length) await this.reloadAfterDecision();
  }

  // After a decision the server works the outages out again: a device marked as known is no outage any more, and its
  // entities stand on their own. The list reads the findings again, so it shows what the server now counts.
  async reloadAfterDecision() {
    if (!this.data || !this._hass) return;
    try { await this.refreshData(); } catch (_) { return; } // the local change stays on screen until the next load
    this.render();
  }

  // Sends one request per selected finding. Done ones leave the selection; failed ones stay selected, so
  // a retry sends only those. Returns the number of failures; the toast says "n of m done, k failed".
  async runBulk(keys, send) {
    let done = 0, failed = 0, last = null;
    for (const key of keys) {
      try { await send(key); done += 1; this.findSel.delete(key); } catch (err) { failed += 1; last = err; }
    }
    if (done) this._rev++;
    if (failed) {
      this.noteError("action", last);
      this.toast(this.t("bulkPartial", { done, total: keys.length, failed, detail: this.errText(last) }), true);
    }
    return failed;
  }

  // "Keep it so": the same reason again, for the same length of time as before (90 days when it had none).
  async keepOn(key) {
    const finding = this.data.findings.find(f => f.key === key), info = finding?.due_info;
    if (!finding || !info) return;
    const span = info.until && info.at ? Math.round((Date.parse(info.until) - Date.parse(info.at)) / 864e5) : 0;
    const days = Math.min(3650, Math.max(1, span || this.defaultDays("keep")));
    try {
      await this._hass.callWS({ type: "ha_housekeeper/ignore", finding_key: key, ignored: true, kind: "keep", reason: info.reason || this.t("dueKeepReason"), days });
      finding.ignored = true; finding.ignored_by = "user"; finding.resurfaced = false; finding.due_info = null;
      finding.ignore_info = { kind: "keep", reason: info.reason, until: new Date(Date.now() + days * 864e5).toISOString(), at: new Date().toISOString() };
      this._rev++;
      this.render();
      await this.reloadAfterDecision();
    } catch (err) { this.failed(err); this.render(); }
  }

  // After the update: the names changed and "intended" without a time got a review date. Said once, until it is read.
  decisionNotice() {
    const n = this.data?.decision_notice;
    if (!n || !n.count) return "";
    return `<div class="notice info decnotice" role="status"><ha-icon icon="mdi:information-outline"></ha-icon><div><p>${this.esc(this.t(n.count === 1 ? "decNoticeText1" : "decNoticeText", { n: this.formatNumber(n.count), days: n.days }))}</p><button type="button" class="btn" data-dnotice-ok>${this.t("decNoticeOk")}</button></div></div>`;
  }

  async dismissDecisionNotice() {
    try { await this._hass.callWS({ type: "ha_housekeeper/decision_notice_dismiss" }); } catch (err) { this.failed(err); }
    if (this.data) this.data.decision_notice = null;
    this.render();
  }

  // "This is no duplicate": a known finding with the reason filled in.
  async markNotDuplicate(key) {
    try {
      await this._hass.callWS({ type: "ha_housekeeper/ignore", finding_key: key, ignored: true, kind: "keep", reason: this.t("notDuplicateReason") });
      const finding = this.data.findings.find(f => f.key === key);
      if (finding) { finding.ignored = true; finding.ignored_by = "user"; finding.resurfaced = false; finding.ignore_info = { kind: "keep", reason: this.t("notDuplicateReason"), until: null, at: new Date().toISOString() }; this._rev++; }
      this.render();
      await this.reloadAfterDecision();
      return;
    } catch (err) { this.failed(err); }
    this.render();
  }

  bindFindingStatus(root) {
    root.querySelector("[data-fsel-exc]")?.addEventListener("click", () => this.openExceptionFor([...this.findSel].map(key => this.data.findings.find(f => f.key === key)).filter(Boolean).map(f => this.findingKey(f))));
    root.querySelectorAll("[data-exc-for]").forEach(el => el.onclick = ev => { ev.stopPropagation(); el.closest("details")?.removeAttribute("open"); this.openExceptionFor([el.dataset.excFor]); });
    // A label from the menu of a row: that finding alone, in the same form as the selection bar.
    root.querySelectorAll("[data-row-label]").forEach(el => el.onclick = ev => { ev.stopPropagation(); this.findSel = new Set([el.dataset.rowLabel]); this.bulk = { kind: "label", reason: "", days: 30, markKind: "", error: "" }; this.render(); });
    root.querySelectorAll("[data-fstatus]").forEach(el => el.onclick = () => { const s = el.dataset.fstatus === "open" ? "" : el.dataset.fstatus; this.findingStatus = this.findingStatus === s ? "" : s; this.pages = {}; this.render(); });
    root.querySelectorAll("[data-fsel-state]").forEach(el => el.onclick = () => { const kind = el.dataset.fselState; this.bulk = { kind, state: "keep", reason: "", days: kind === "status" ? this.defaultDays("keep") : kind === "mark" ? 0 : 30, critical: kind === "status" && [...this.findSel].some(key => this.findingCritical(this.data.findings.find(f => f.key === key))), markKind: "", error: "" }; this.render(); this.shadowRoot?.querySelector?.("[data-bulk-reason]")?.focus?.(); });
    root.querySelectorAll("[data-notdup]").forEach(el => el.onclick = () => this.markNotDuplicate(el.dataset.notdup));
    root.querySelectorAll("[data-due-keep]").forEach(el => el.onclick = ev => { ev.stopPropagation(); el.closest("details")?.removeAttribute("open"); this.keepOn(el.dataset.dueKeep); });
    root.querySelector("[data-dnotice-ok]")?.addEventListener("click", () => this.dismissDecisionNotice());
    const form = root.querySelector("[data-bulk-form]");
    if (form) {
      form.onsubmit = ev => { ev.preventDefault(); this.commitBulk(); };
      const reason = form.querySelector("[data-bulk-reason]");
      if (reason) reason.oninput = ev => { this.bulk.reason = ev.target.value; };
      const label = form.querySelector("[data-bulk-label]");
      if (label) label.onchange = ev => { this.bulk.label = ev.target.value; };
      const area = form.querySelector("[data-bulk-area]");
      if (area) area.onchange = ev => { this.bulk.area = ev.target.value; };
      const onDevice = form.querySelector("[data-bulk-ondevice]");
      if (onDevice) onDevice.onchange = ev => { this.bulk.onDevice = ev.target.checked; this.render(); };
      const markKind = form.querySelector("[data-bulk-markkind]");
      if (markKind) markKind.onchange = ev => { this.bulk.markKind = ev.target.value; };
      form.querySelectorAll("[data-bulk-kind]").forEach(el => el.onchange = () => { const b = this.bulk; b.state = el.value; b.error = ""; b.days = this.defaultDays(b.state); this.render(); });
      const days = form.querySelector("[data-bulk-days]");
      if (days) days.onchange = ev => { this.bulk.days = Number(ev.target.value); };
      form.querySelector("[data-bulk-cancel]").onclick = () => { this.bulk = null; this.render(); };
    }
  }
}
Object.assign(TEXT.de, {
  workExpired: "angefangen am {date}", stateOpen: "Offen", freshNew: "Neu seit dem letzten Besuch", stateWorse: "Schlechter geworden", visitNothing: "Nichts Neues seit {date}.", visitSummary: "{fresh} neu · {worse} schlechter geworden seit {date}.", stateDue: "Fällig", freshInwork: "In Arbeit", state_fixed: "Erledigt", stateNew: "Neu", stateInwork: "In Arbeit", state_new: "Neu", state_inwork: "In Arbeit", state_known: "Ist so gewollt", state_snoozed: "Später", state_hidden: "Nicht gezeigt",
  doneNone: "In den letzten {days} Tagen wurde nichts erledigt.", donePeriod: "Zeitraum", doneDays: "{n} Tage", doneByPlan: "Durch einen Plan behoben", doneBack: "Von selbst wieder in Ordnung", doneRemoved: "Objekt entfernt (nicht behoben)", doneUnread: "Quelle nicht gelesen (nicht behoben)", doneOther: "Grund unbekannt (nicht behoben)", donePlan: "Plan", doneObjects: "{n} Objekte", doneUndoYes: "rückgängig möglich: ja", doneUndoNo: "rückgängig möglich: nein", doneSince: "Verglichen mit dem Scan vom {date}.", actKind_add_label: "Label ergänzt", actKind_delete_automation: "Automation gelöscht", actKind_delete_backup: "Backup gelöscht", actKind_migrate_meter: "Zähler gewechselt", actKind_purge_statistics: "Statistiken bereinigt", actKind_trim_history: "Verlauf gekürzt", actKind_refactor_automation: "Automation umgebaut", actKind_rename_entity: "Entität umbenannt", actKind_replace_references: "Verweise ersetzt", actKind_set_area: "Bereich gesetzt", actKind_disable_entity: "Entität deaktiviert", actKind_remove_entity: "Entität entfernt", actKind_disable_device: "Gerät deaktiviert", actKind_remove_device: "Gerät entfernt", actKind_forget_device: "Gerät vergessen", actKind_repair_range: "Zählerbereich repariert", actKind_quarantine: "In Quarantäne gelegt", excCreate: "Ausnahme anlegen", fselStatus: "Status setzen …", fselStatusChange: "Status ändern …", outageStatusHint: "Ein Status beendet den Ausfall: Die {n} Entitäten dahinter zählen dann einzeln als nicht verfügbar. Ist das Objekt absichtlich aus, passt eine Objekt-Notiz besser; sie blendet den Ausfall samt Folgen aus und greift auch beim nächsten Mal.", outageStatusHint1: "Ein Status beendet den Ausfall: Die Entität dahinter zählt dann einzeln als nicht verfügbar. Ist das Objekt absichtlich aus, passt eine Objekt-Notiz besser; sie blendet den Ausfall samt Folge aus und greift auch beim nächsten Mal.", outageMarkInstead: "Stattdessen Objekt-Notiz setzen", statusTitle: "Status setzen · {n} Befunde",
  decideKindHint_keep: "Das ist bei mir normal. Bleibt still, bis du es änderst. Begründung nötig.", decideKindHint_snooze: "Stimmt, aber nicht jetzt. Kommt nach der Frist als „fällig“ zurück.", decideKindHint_ignore: "Die Regel irrt sich hier. Begründung freiwillig.",
  overviewDue: "{n} fällig", overviewNew: "{n} neu", dueSince: "seit {date}", dueExpired: "Frist abgelaufen am {date}", dueWorse: "schlechter geworden", dueWorseImpact: "Wirkung von {from} auf {to}", dueWorseFollowers: "mehr Folgen", dueKeepOn: "Weiter so gewollt", dueLater: "Noch später", dueKeepReason: "Weiter so gewollt",
  statusCriticalHint: "Kritisches Objekt: „Ist so gewollt“ gilt höchstens befristet und wird danach wieder vorgelegt.",
  decNoticeText: "„Bekannt“ heißt jetzt „Ist so gewollt“, „Zurückgestellt“ heißt „Später“. {n} Befunde mit „Ist so gewollt“ hatten keine Frist; sie werden nach {days} Tagen unter „Fällig“ noch einmal vorgelegt. Die Frist lässt sich je Befund ändern.", decNoticeText1: "„Bekannt“ heißt jetzt „Ist so gewollt“, „Zurückgestellt“ heißt „Später“. Ein Befund mit „Ist so gewollt“ hatte keine Frist; er wird nach {days} Tagen unter „Fällig“ noch einmal vorgelegt. Die Frist lässt sich ändern.", decNoticeOk: "Verstanden",
  statusScopeHint: "Gilt nur für diese Befunde; ein neuer Befund am selben Objekt ist wieder offen. Für das ganze Objekt (etwa dauernd offline): Objekt-Notiz. Für viele Objekte: Ausnahme.", reasonChipsLabel: "Gründe zur Auswahl", reasonChip1: "Absichtlich so", reasonChip2: "Wird ersetzt", reasonChip3: "Nicht relevant", reasonChip4: "Saisonal", reasonChipf1: "Messwert falsch", reasonChipf2: "Gerät wird anders genutzt", reasonChipf3: "Regel passt nicht",
  markOnDeviceSub: "am Gerät {name}", changesHa: "ändert Home Assistant", hiddenBy_user: "Deine Entscheidung", hiddenBy_mark: "Objekt-Notiz", hiddenBy_rule: "Ausnahme", hiddenBy_label: "Label", hiddenByAll: "Alle Gründe",
  hiddenMarkOpen: "Objekt-Notiz ansehen", hiddenRuleOpen: "Regel öffnen", hiddenObjectOpen: "Objekt öffnen", markOnDevice: "bei ganz ausgefallenen Geräten am Gerät statt an jeder Entität", fselLabel: "Label ergänzen", state_label: "Label ergänzen", labelChoose: "Label", labelNone: "Es gibt noch kein Label. Lege in Home Assistant eines an (Einstellungen → Bereiche, Labels & Zonen → Labels).", labelNoEntities: "Unter der Auswahl sind keine Entitäten, Automationen, Skripte oder Szenen.", confirmedSummaryLabel: "{count} Entitäten bekommen ein Label (nur in Home Assistant, Rückgängig entfernt es wieder).", reason_label_missing: "Das Label gibt es nicht mehr.", reason_already_labelled: "Hat dieses Label schon.", result_labeled: "Label ergänzt", undo_unlabelled: "Label wieder entfernt",
  notDuplicate: "Ist kein Duplikat", notDuplicateReason: "Kein Duplikat (bestätigt)", openTwin: "Funktionierende Entität öffnen",
});
Object.assign(TEXT.en, {
  workExpired: "started on {date}", stateOpen: "Open", freshNew: "New since your last visit", stateWorse: "Got worse", visitNothing: "Nothing new since {date}.", visitSummary: "{fresh} new · {worse} got worse since {date}.", stateDue: "Due", freshInwork: "In work", state_fixed: "Done", stateNew: "New", stateInwork: "In work", state_new: "New", state_inwork: "In work", state_known: "Intended", state_snoozed: "Later", state_hidden: "Not shown",
  doneNone: "Nothing was done in the last {days} days.", donePeriod: "Period", doneDays: "{n} days", doneByPlan: "Fixed by a plan", doneBack: "Back in order by itself", doneRemoved: "Object removed (not fixed)", doneUnread: "Source not read (not fixed)", doneOther: "Reason unknown (not fixed)", donePlan: "Plan", doneObjects: "{n} objects", doneUndoYes: "can be undone: yes", doneUndoNo: "can be undone: no", doneSince: "Compared with the scan of {date}.", actKind_add_label: "Label added", actKind_delete_automation: "Automation deleted", actKind_delete_backup: "Backup deleted", actKind_migrate_meter: "Meter replaced", actKind_purge_statistics: "Statistics cleaned", actKind_trim_history: "History trimmed", actKind_refactor_automation: "Automation reworked", actKind_rename_entity: "Entity renamed", actKind_replace_references: "References replaced", actKind_set_area: "Area set", actKind_disable_entity: "Entity disabled", actKind_remove_entity: "Entity removed", actKind_disable_device: "Device disabled", actKind_remove_device: "Device removed", actKind_forget_device: "Device forgotten", actKind_repair_range: "Meter range repaired", actKind_quarantine: "Put in quarantine", excCreate: "Add exception", fselStatus: "Set status …", fselStatusChange: "Change status …", outageStatusHint: "A status ends the outage: the {n} entities behind it then count one by one as unavailable. If the object is off on purpose, an object note fits better; it hides the outage with what follows from it, also the next time.", outageStatusHint1: "A status ends the outage: the entity behind it then counts on its own as unavailable. If the object is off on purpose, a mark fits better; it hides the outage with what follows from it, also the next time.", outageMarkInstead: "Set an object note instead", statusTitle: "Set status · {n} findings",
  decideKindHint_keep: "This is normal for me. Stays quiet until you change it. Needs a reason.", decideKindHint_snooze: "True, but not now. Comes back as “due” after the time.", decideKindHint_ignore: "The rule is wrong here. Reason optional.",
  overviewDue: "{n} due", overviewNew: "{n} new", dueSince: "since {date}", dueExpired: "time ran out on {date}", dueWorse: "got worse", dueWorseImpact: "impact from {from} to {to}", dueWorseFollowers: "more follow-ups", dueKeepOn: "Still intended", dueLater: "Later still", dueKeepReason: "Still intended",
  statusCriticalHint: "Critical object: “Intended” holds only for a time and is shown again afterwards.",
  decNoticeText: "“Known” is now “Intended”, “Snoozed” is now “Later”. {n} findings marked Intended had no time; they are shown again under “Due” after {days} days. The time can be changed for each finding.", decNoticeText1: "“Known” is now “Intended”, “Snoozed” is now “Later”. One finding marked Intended had no time; it is shown again under “Due” after {days} days. The time can be changed.", decNoticeOk: "Understood",
  statusScopeHint: "Applies to these findings only; a new finding on the same object is open again. For the whole object (offline all the time, say): an object note. For many objects: an exception.", reasonChipsLabel: "Ready-made reasons", reasonChip1: "On purpose", reasonChip2: "Being replaced", reasonChip3: "Not relevant", reasonChip4: "Seasonal", reasonChipf1: "Value is wrong", reasonChipf2: "Device is used differently", reasonChipf3: "Rule does not fit",
  markOnDeviceSub: "on the device {name}", changesHa: "changes Home Assistant", hiddenBy_user: "Your decision", hiddenBy_mark: "Object note", hiddenBy_rule: "Exception", hiddenBy_label: "Label", hiddenByAll: "All reasons",
  hiddenMarkOpen: "View object note", hiddenRuleOpen: "Open rule", hiddenObjectOpen: "Open object", markOnDevice: "on devices that are down completely, on the device instead of each entity", fselLabel: "Add label", state_label: "Add label", labelChoose: "Label", labelNone: "There is no label yet. Create one in Home Assistant (Settings → Areas, labels & zones → Labels).", labelNoEntities: "The selection holds no entities, automations, scripts or scenes.", confirmedSummaryLabel: "{count} entities get a label (in Home Assistant only, undo takes it off again).", reason_label_missing: "The label no longer exists.", reason_already_labelled: "Already has this label.", result_labeled: "Label added", undo_unlabelled: "label taken off again",
  notDuplicate: "Not a duplicate", notDuplicateReason: "Not a duplicate (confirmed)", openTwin: "Open the working entity",
});
