// FixMixin: the page "Fix" (Beheben) of one finding: understand, decide, carry out, check. A page of its own without a
// menu entry; "back" returns to the list with its selection and scroll position. It names the ways and opens the
// existing steps (plan with preview, links into Home Assistant, marks, exits); it changes nothing by itself.
const FIX_WATCH_MS = 15 * 60 * 1000, FIX_WATCH_STEP_MS = 30 * 1000;
class FixMixin {
  // "Fix all n": the page of a missing target; its follow-ups are the places that name it. One of them stands for the page.
  openFixAll(causeId) {
    const below = (this.data?.findings || []).filter(f => this.causeKeys(causeId).has(f.key));
    const rep = below.find(f => f.rule_id.startsWith("automation.")) || below[0];
    if (rep) this.openFix(rep.key, causeId);
  }

  fixAllFindings() { return this.fixAll ? (this.data?.findings || []).filter(f => this.causeKeys(this.fixAll).has(f.key)) : []; }

  openFix(key, all = "") {
    this.noteJump("fix");
    this.fixAll = all;
    this.view = "fix"; this.fixKey = key; this.fixWays = null; this.fixFailure = null; this.fixCheckedFrom = null; this.fixLive = null; this.fixWatchUntil = 0; this.stopFixWatch(); this.selected = null; this.pages = {};
    this.fixStep = 1; this.fixMax = 1; this.fixPreselect = Boolean(all);
    this.fcPlanKey = ""; this.fcPlanReq = null; this.fcPlanError = "";
    this.render();
    this.loadFixWays(key);
  }

  // The page shows one step at a time; a step can be reached once it has been before or the one before it is done.
  fixGo(step) {
    this.fixStep = step; this.fixMax = Math.max(this.fixMax || 1, step);
    if (this.view === "fix") this.render();
  }

  // A way Housekeeper runs itself: its plan is judged in the page, in step 3.
  fixPlan(requests) {
    const f = this.data?.findings?.find(x => x.key === this.fixKey);
    return f ? this.fcPlanStart(this.findingKey(f), requests) : null;
  }

  async loadFixWays(key) {
    try {
      const reply = await this._hass.callWS({ type: "ha_housekeeper/fix_ways", finding_key: key });
      if (this.fixKey === key) { this.fixWays = reply?.ways || []; if (["fix", "firstcleanup"].includes(this.view)) this.render(); }
    } catch (_) { if (this.fixKey === key) { this.fixWays = []; if (["fix", "firstcleanup"].includes(this.view)) this.render(); } }
    const finding = this.data?.findings?.find(x => x.key === key);
    if (finding?.topic !== "failing_automations") return;
    try {
      const info = await this._hass.callWS({ type: "ha_housekeeper/failure_info", finding_key: key });
      if (this.fixKey === key) { this.fixFailure = info || {}; if (["fix", "firstcleanup"].includes(this.view)) this.render(); }
    } catch (_) { /* the last run is a convenience; the ways stand without it */ }
  }

  // A step on a way is "in work": the finding stays open but is marked, and goes back after a week without a step.
  async fixWork(active) {
    const f = this.data?.findings?.find(x => x.key === this.fixKey);
    if (!f) return;
    try {
      const reply = await this._hass.callWS({ type: "ha_housekeeper/work_set", finding_key: f.key, active });
      f.in_work = reply?.in_work || undefined; f.work_expired = reply?.work_expired || undefined;
      this._rev++;
      if (this.view === "fix") this.render();
    } catch (_) { /* a note of progress is a convenience */ }
  }

  // Step 1: what is wrong, since when, what it affects, how sure Housekeeper is.
  fixUnderstand(f) {
    const cause = f.cause_id ? this.causeById(f.cause_id) : this.causeList().find(c => c.finding_key === f.key);
    const own = cause && cause.finding_key === f.key, since = f.first_detected_at || f.first_seen_at;
    const pattern = (f.confidence_notes || []).find(n => n.code === "pattern");
    const all = this.fixAllFindings(), allCause = this.fixAll ? this.causeById(this.fixAll) : null;
    const kinds = ["automation", "script", "dashboard"].map(k => [k, all.filter(x => x.rule_id.startsWith(`${k}.`)).length]).filter(([, n]) => n).map(([k, n]) => this.tCount(`fixAllKind_${k}`, n)).join(", ");
    const [R, A, B, G, M] = ["alert-circle-outline:red", "progress-wrench:amber", "clock-outline:blue", "eye-off-outline:green", "link-variant:blue"];
    const certainty = f.confidence_level ? this.esc(this.certaintyText(f).replace(/^[^.]*\d+\s*%\.\s*/, "")) : "";
    const rows = [
      allCause ? [this.t("fixWhat"), this.esc(this.t(`cause_${allCause.kind}`, { name: allCause.name })), R] : null,
      allCause ? [this.t("fixAffects"), this.esc(`${this.tCount("fixAllPlaces", all.length)}${kinds ? ` (${kinds})` : ""}`), M] : null,
      allCause ? null : [this.t("fixWhat"), this.esc(this.findingTitle(f)), R],
      f.in_work ? [this.t("freshInwork"), this.esc(this.t("fixWorkSince", { date: this.formatDate(f.in_work.started_at) })), A] : f.work_expired ? [this.t("freshInwork"), this.esc(this.t("workExpired", { date: this.formatDate(f.work_expired.started_at) })), A] : null,
      since ? [this.t("sortSince"), this.esc(this.formatDate(since)), B] : null,
      f.impact ? [this.t("sortImpact"), this.esc(this.impactLine(f)), G] : null,
      cause && !own && !allCause ? [this.t("causeLabel"), this.esc(this.t(`cause_${cause.kind}`, { name: cause.name })), M] : null,
      cause && own && cause.total_followers ? [this.t("fixAffects"), this.esc(this.tCount("causeFollowers", cause.total_followers)), M] : null,
      this.fixFailure?.failure ? [this.t("fixLastFailure"), this.esc(this.fixFailureText(this.fixFailure.failure)), A] : null,
      this.fixFailure?.hint ? [this.t("fixFailureHint"), `${this.esc(this.t("fixFailureHintText", { entity: this.fixFailure.hint.entity_id }))} <button type="button" class="btn quiet" data-fix-open="${this.esc(this.fixFailure.hint.finding_key)}">${this.t("fixToFinding")}</button>`, "lightbulb-on-outline:blue"] : null,
      pattern ? [this.t("fixPattern"), this.esc(this.t("fixPatternAt", { hour: pattern.hour })), "chart-timeline-variant:amber"] : null,
      f.confidence_level ? [this.t("sortCertainty"), `<strong>${Math.round(f.confidence * 100)} %</strong>${certainty ? `<small class="factnote">${certainty}</small>` : ""}`, "shield-check-outline:green"] : null,
    ].filter(Boolean);
    return `<div class="fcinfo hasrec fixinfo" role="group">${rows.map(([label, value, look]) => { const [icon, tone] = look.split(":"); return `<div class="fcirow static"><span class="fcii fcii-${tone}"><ha-icon icon="mdi:${icon}"></ha-icon></span><span>${label}</span><span>${value}</span><i></i></div>`; }).join("")}</div>`;
  }

  fixFailureText(failure) {
    return [failure.at ? this.formatDate(failure.at) : "", failure.step ? this.t("fixFailureStep", { step: failure.step }) : "", failure.error || ""].filter(Boolean).join(" · ");
  }

  // One way as a card: its name, what it does, and the button that starts it; the recommended one is marked.
  fixWayCard(w, f) {
    const key = this.findingKey(f), object = this.findObject(key);
    let action = "";
    if (w.kind === "link") action = `<button type="button" class="btn" data-ha-path="${this.esc(w.path)}"><ha-icon icon="mdi:open-in-new"></ha-icon>${this.t("fixOpenHA")}</button>`;
    else if (w.way === "catch_error") {
      const step = this.fixFailure?.failure?.step;
      action = !step ? `<small class="factnote">${this.t("fixCatchNoStep")}</small>` : w.enabled
        ? `<button type="button" class="btn" data-fix-catch="${this.esc(step)}"><ha-icon icon="mdi:shield-check-outline"></ha-icon>${this.t("fixCatchStart")}</button>`
        : `<button type="button" class="btn" data-fix-refactor-on><ha-icon icon="mdi:toggle-switch-outline"></ha-icon>${this.t("fixRefactorOn")}</button>`;
    } else if (w.way === "fix_cause") {
      const cause = f.cause_id ? this.causeById(f.cause_id) : null;
      if (cause?.finding_key) action = `<button type="button" class="btn" data-fix-open="${this.esc(cause.finding_key)}"><ha-icon icon="mdi:arrow-right"></ha-icon>${this.t("fixToFinding")}</button>`;
    } else if (w.way === "cleanup_round") action = `<button type="button" class="btn" data-fix-round><ha-icon icon="mdi:broom"></ha-icon>${this.t("fixRoundStart")}</button>`;
    else if (w.way === "replace_target" && w.target_kind) {
      const options = (this.data?.objects || []).filter(o => o.object_type === w.target_kind && o.object_id !== w.target);
      action = options.length ? `<span class="setrow"><select data-fix-id-new aria-label="${this.esc(this.t("fixReplaceWith"))}">${options.map(o => `<option value="${this.esc(o.object_id)}">${this.esc(o.name || o.object_id)}</option>`).join("")}</select><button type="button" class="btn" data-fix-id-replace="${this.esc(w.target)}" data-fix-id-kind="${this.esc(w.target_kind)}"><ha-icon icon="mdi:swap-horizontal"></ha-icon>${this.t("fixReplaceStart")}</button></span>` : `<small class="factnote">${this.t("fixReplaceNone")}</small>`;
    } else if (w.way === "replace_target") action = `<button type="button" class="btn" data-fix-replace="${this.esc(w.target)}" data-fix-new="${this.esc(w.suggestion || "")}"><ha-icon icon="mdi:swap-horizontal"></ha-icon>${this.t("fixReplaceStart")}</button>`;
    else if (w.way === "remove_reference" && this.fixAll) action = w.enabled
      ? `<button type="button" class="btn" data-fix-remove-all="${this.esc(w.target)}"><ha-icon icon="mdi:link-variant-minus"></ha-icon>${this.tCount("fixRemoveAll", this.fixAllFindings().filter(x => x.rule_id.startsWith("automation.")).length)}</button>`
      : `<button type="button" class="btn" data-fix-refactor-on><ha-icon icon="mdi:toggle-switch-outline"></ha-icon>${this.t("fixRefactorOn")}</button>`;
    else if (w.way === "remove_reference") action = w.enabled
      ? `<button type="button" class="btn" data-fix-remove="${this.esc(w.target)}"><ha-icon icon="mdi:link-variant-minus"></ha-icon>${this.t("fixRemoveStart")}</button>`
      : `<button type="button" class="btn" data-fix-refactor-on><ha-icon icon="mdi:toggle-switch-outline"></ha-icon>${this.t("fixRefactorOn")}</button>`;
    else if (w.way === "open_editor" && object && this.haPath(object)) action = `<button type="button" class="btn" data-ha-path="${this.esc(this.haPath(object))}"><ha-icon icon="mdi:open-in-new"></ha-icon>${this.t("fixOpenHA")}</button>`;
    else if (w.way === "mark" && object && MARK_TYPES.includes(object.object_type)) action = `<button type="button" class="btn" data-watch-mark="${this.esc(key)}"><ha-icon icon="${FSEL_ICONS.mark}"></ha-icon>${this.t("markSet")}</button>`;
    else if (w.kind === "panel" && object) action = `<button type="button" class="btn" data-fix-object="${this.esc(key)}"><ha-icon icon="mdi:tools"></ha-icon>${this.t("fixOpenActions")}</button>`;
    return `<div class="row fixway"><span class="row-text"><strong>${this.esc(this.t(`fixWay_${w.way}`))}${w.recommended ? ` <span class="pill ok">${this.t("fixRecommended")}</span>` : ""}</strong><small>${this.esc(this.t(`fixWayHint_${w.way}`))}</small></span>${action}</div>`;
  }

  // The plans of the object itself (disable, remove, replace the twin), each with its preview here; the rest is one button to the object.
  fixObjectWays(object, key) {
    const items = this.fixItems(object, key).items, own = items.filter(it => it.plan);
    const more = items.length > own.length || !items.length;
    return `<div class="fcways fixobjways"><small class="fceyebrow">${this.t("fixObjectWays")}</small>${own.map(it => this.fcWayRow(it, key)).join("")}${more ? `<div class="fcway"><span class="fcii fcii-mute"><ha-icon icon="mdi:tools"></ha-icon></span><span class="fctxt"><strong>${this.t("fixOpenActions")}</strong><small>${this.t("fixMoreActionsHint")}</small></span><button type="button" class="btn quiet" data-fix-object="${this.esc(key)}">${this.t("actOpen")}</button></div>` : ""}</div>`;
  }

  // Step 2: the recommended way first and large, the others folded, and the three exits as one line.
  fixDecide(f) {
    const ways = this.fixWays, key = this.findingKey(f), object = this.findObject(key);
    const shown = ways && this.fixAll ? ways.filter(w => ["replace_target", "remove_reference"].includes(w.way)) : ways;
    const error = this.fcPlanError && !this.fcPlanKey ? `<div class="error">${this.esc(this.fcPlanError)}</div>` : "";
    let list;
    if (shown === null) list = `<p class="factnote">${this.t("loading")}</p>`;
    else {
      const sorted = [...shown].sort((a, b) => Number(b.recommended) - Number(a.recommended));
      const entries = [];
      for (const w of sorted) {
        if (w.kind === "panel" && object) { if (!entries.some(e => e.panel)) entries.push({ panel: true, html: this.fixObjectWays(object, key) }); }
        else entries.push({ html: this.fixWayCard(w, f) });
      }
      if (!entries.length) list = `<p class="factnote">${this.t("fixNoWays")}</p>`;
      else list = `<div class="fixrec">${entries[0].html}</div>${entries.length > 1 ? `<details class="fixmore"><summary>${this.t("fixOtherWays", { n: entries.length - 1 })}</summary>${entries.slice(1).map(e => e.html).join("")}</details>` : ""}`;
    }
    const exit = (kind, icon) => `<button type="button" class="btn" data-decide-open="${this.esc(f.key)}" data-decide-preset="${kind}" title="${this.esc(this.t(`decideKindHint_${kind}`))}"><ha-icon icon="${icon}"></ha-icon>${this.t(`decideKind_${kind}`)}</button>`;
    // The exits decide one finding; for a missing target the selection below decides several.
    if (this.fixAll) return `${error}${list}`;
    const self = f.in_work ? `<button type="button" class="btn" data-fix-self-done><ha-icon icon="mdi:check"></ha-icon>${this.t("fixSelfDone")}</button>` : "";
    return `${error}${list}<div class="fixexits"><small class="fceyebrow">${this.t("fixExits")}</small><div class="mbtns">${exit("keep", "mdi:check")}${exit("snooze", "mdi:clock-outline")}${exit("ignore", "mdi:bell-off-outline")}${self}</div></div>${this.rowDecide(f)}`;
  }

  // For a cause with several findings below it: pick which to include, then one way for all.
  fixCollect(f) {
    const cause = f.cause_id ? this.causeById(f.cause_id) : this.causeList().find(c => c.finding_key === f.key);
    if (!cause) return "";
    const below = this.data.findings.filter(x => !x.ignored && (this.fixAll || x.key !== f.key) && this.causeKeys(cause.id).has(x.key));
    if (below.length < 2) return "";
    const rows = below.map(x => `<label class="row"><input type="checkbox" data-fix-pick="${this.esc(x.key)}" ${this.findSel.has(x.key) ? "checked" : ""}><span class="row-text"><strong>${this.esc(this.findObject(this.findingKey(x))?.name || x.object_id)}</strong><small>${this.esc(this.findingTitle(x))}</small></span></label>`).join("");
    if (this.fixPreselect) { this.fixPreselect = false; below.forEach(x => this.findSel.add(x.key)); }
    const picked = below.filter(x => this.findSel.has(x.key)).length, off = picked ? "" : "disabled";
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("fixCollectTitle")}</h2><p>${picked ? this.t("fixPickCount", { picked, total: below.length }) : this.t("fixPickNone")}</p></div></div>${rows}
      <div class="mbtns"><button type="button" class="btn" data-fix-pick-all="${this.esc(below.map(x => x.key).join("|"))}">${this.t("fixPickAll")}</button><button type="button" class="btn" data-fsel-state="status" ${off}>${this.t("fselStatus")}</button><button type="button" class="btn" data-fsel-state="mark" ${off}>${this.t("markSet")}</button></div>${this.bulkForm()}</section>`;
  }

  // Step 4: a quick look at the object for 15 minutes, then the next regular scan decides; a whole new scan is the second button.
  fixCheck(f) {
    const scanned = this.fixCheckedFrom && this.data?.meta?.scanned_at !== this.fixCheckedFrom;
    const live = this.fixLive, watching = this.fixWatchUntil && Date.now() < this.fixWatchUntil;
    let verdict = "";
    if (scanned) verdict = f ? this.notice("warn", this.t("fixStillOpen")) : this.notice("info", this.t("fixDone"));
    else if (live) verdict = live.result === "fixed" ? this.notice("info", this.t("fixLooksFixed")) : live.result === "open" ? this.notice("warn", this.t("fixLiveOpen", { detail: this.esc(live.detail || "") })) : this.notice("info", this.t("fixLiveUnknown"));
    const watch = watching ? `<p class="factnote">${this.t("fixWatching")}</p>` : "";
    return `<p class="factnote">${this.t("fixCheckHint")}</p><div class="mbtns"><button type="button" class="btn primary" data-fix-look><ha-icon icon="mdi:magnify"></ha-icon>${this.t("fixLookNow")}</button><button type="button" class="btn" data-fix-check ${this.busy ? "disabled" : ""}><ha-icon icon="mdi:magnify-scan"></ha-icon>${this.t("fixCheckNow")}</button>${f?.in_work ? `<button type="button" class="btn quiet" data-fix-work-off>${this.t("fixWorkOff")}</button>` : ""}</div>${watch}${verdict}`;
  }

  // The quick look: asks the backend for the live state now, and again every 30 seconds for 15 minutes while the page is open.
  async fixLook() {
    const key = this.fixKey;
    try {
      this.fixLive = await this._hass.callWS({ type: "ha_housekeeper/fix_check", finding_key: key });
    } catch (_) { this.fixLive = { result: "unknown", detail: "" }; }
    if (this.view === "fix" && this.fixKey === key) this.render();
  }

  startFixWatch() {
    this.stopFixWatch();
    this.fixWatchUntil = Date.now() + FIX_WATCH_MS;
    this._fixTimer = window.setInterval(() => {
      if (this.view !== "fix" || Date.now() >= this.fixWatchUntil || this.fixLive?.result === "fixed") { this.stopFixWatch(); if (this.view === "fix") this.render(); return; }
      this.fixLook();
    }, FIX_WATCH_STEP_MS);
    this.fixLook();
  }

  stopFixWatch() { if (this._fixTimer) window.clearInterval(this._fixTimer); this._fixTimer = null; }

  fixView() {
    const f = this.data?.findings?.find(x => x.key === this.fixKey);
    const step = (n, title, body) => `<section class="panel fccard fixcard"><div class="pad"><small class="fceyebrow">${this.t("fixStepOf", { n })}</small><h3>${this.t(title)}</h3><div class="fixbody">${body}</div></div></section>`;
    if (!f) return `<div class="stack">${step(3, "fixStepCheck", `${this.fixCheckedFrom ? this.notice("info", this.t("fixDone")) : this.notice("info", this.t("fixGone"))}`)}<div class="pad"><button class="btn" data-action="view-back">${this.t("fixBack")}</button></div></div>`;
    const cur = Math.min(this.fixStep || 1, this.fixMax || 1), max = this.fixMax || 1, planOpen = Boolean(this.fcPlanKey && this.plan);
    const names = ["fixStepUnderstand", "fixStepRun", "fixStepCheck"];
    const bar = `<div class="fctop"><nav class="fcsteps" aria-label="${this.esc(this.t("fixTitle"))}">${names.map((n, i) => `<button type="button" class="fcstep${i + 1 < cur ? " done" : ""}${i + 1 === cur ? " cur" : ""}" data-fix-step="${i + 1}" title="${this.esc(this.t(n))}" ${i + 1 === cur ? 'aria-current="step"' : ""} ${i + 1 > max ? "disabled" : ""}><b>${i + 1 < cur ? "✓" : i + 1}</b></button>`).join('<i class="fcline"></i>')}</nav></div>`;
    const nav = (back, next) => !back && !next ? "" : `<div class="panel fcfoot"><button type="button" class="btn" ${back ? `data-fix-step="${back}"` : "disabled"}><ha-icon icon="mdi:arrow-left"></ha-icon>${this.t("fixBack")}</button><span class="fcprogress"></span>${next ? `<button type="button" class="btn primary" data-fix-step="${next}">${this.t("fixNext")}</button>` : ""}</div>`;
    let body;
    if (cur === 1) body = `${step(1, "fixStepUnderstand", `${this.fixUnderstand(f)}<h4 class="fixsub">${this.t("fixStepDecide")}</h4>${this.fixDecide(f)}`)}${this.fixCollect(f)}${nav(0, 0)}`;
    else if (cur === 2) body = planOpen ? this.fcPlanBlock() : `${step(2, "fixStepRun", `<p class="factnote">${this.t("fixRunNone")}</p>`)}${nav(1, 0)}`;
    else body = `${step(3, "fixStepCheck", this.fixCheck(f))}${nav(1, 0)}`;
    return `<div class="stack">${bar}${body}</div>`;
  }

  bindFix(root) {
    this.bindFcPlan(root);
    root.querySelectorAll("[data-fix-step]").forEach(el => el.onclick = () => this.fixGo(Number(el.dataset.fixStep)));
    root.querySelectorAll("[data-fix-self-done]").forEach(el => el.onclick = () => { this.fixGo(3); this.startFixWatch(); });
    root.querySelectorAll("[data-fix-open]").forEach(el => el.onclick = ev => { ev.stopPropagation(); el.closest("details")?.removeAttribute("open"); this.openFix(el.dataset.fixOpen); });
    root.querySelectorAll("[data-fix-object]").forEach(el => el.onclick = () => { const obj = this.findObject(el.dataset.fixObject); if (obj) { this._pendingTab = "actions"; this.openObject(obj); } });
    root.querySelectorAll("[data-fix-replace]").forEach(el => el.onclick = () => this.startCleanup("replace_references", () => { this.replOld = el.dataset.fixReplace; this.replNew = el.dataset.fixNew || ""; }));
    root.querySelectorAll("[data-fix-id-replace]").forEach(el => el.onclick = async () => {
      const target = el.closest(".row")?.querySelector("[data-fix-id-new]")?.value;
      if (target) await this.fixPlan([{ kind: "replace_references", object_id: el.dataset.fixIdReplace, target, target_kind: el.dataset.fixIdKind }]);
    });
    root.querySelectorAll("[data-fix-catch]").forEach(el => el.onclick = async () => {
      const f = this.data?.findings?.find(x => x.key === this.fixKey);
      if (f) await this.fixPlan([{ kind: "refactor_automation", object_id: f.object_id, fix: "continue_on_error", values: { path: el.dataset.fixCatch } }]);
    });
    root.querySelectorAll("[data-fix-round]").forEach(el => el.onclick = () => this.openRound());
    root.querySelectorAll("[data-fix-remove]").forEach(el => el.onclick = async () => {
      const f = this.data?.findings?.find(x => x.key === this.fixKey);
      if (f) await this.fixPlan([{ kind: "refactor_automation", object_id: f.object_id, fix: "remove_reference", values: { reference: el.dataset.fixRemove } }]);
    });
    root.querySelectorAll("[data-fix-all]").forEach(el => el.onclick = ev => { ev.stopPropagation(); el.closest("details")?.removeAttribute("open"); this.openFixAll(el.dataset.fixAll); });
    root.querySelectorAll("[data-fix-remove-all]").forEach(el => el.onclick = async () => {
      const requests = this.fixAllFindings().filter(x => x.rule_id.startsWith("automation.")).map(x => ({ kind: "refactor_automation", object_id: x.object_id, fix: "remove_reference", values: { reference: el.dataset.fixRemoveAll } }));
      if (requests.length) await this.fixPlan(requests);
    });
    root.querySelectorAll("[data-fix-refactor-on]").forEach(el => el.onclick = async () => { await this._hass.callWS({ type: "ha_housekeeper/refactor_set", enabled: true }); this.loadFixWays(this.fixKey); });
    root.querySelectorAll("[data-fix-pick]").forEach(el => el.onchange = () => { if (el.checked) this.findSel.add(el.dataset.fixPick); else this.findSel.delete(el.dataset.fixPick); this.render(); });
    root.querySelectorAll("[data-fix-pick-all]").forEach(el => el.onclick = () => { el.dataset.fixPickAll.split("|").forEach(k => this.findSel.add(k)); this.render(); });
    root.querySelectorAll("[data-fix-work-off]").forEach(el => el.onclick = () => this.fixWork(false));
    root.querySelectorAll("[data-ha-path],[data-fix-replace],[data-fix-id-replace],[data-fix-remove],[data-fix-remove-all],[data-fix-catch],[data-fix-object],[data-fix-round],[data-fix-look],[data-fix-check]").forEach(el => { if (this.view === "fix") el.addEventListener("click", () => this.fixWork(true)); });
    root.querySelectorAll("[data-fix-look]").forEach(el => el.onclick = () => this.startFixWatch());
    root.querySelectorAll("[data-fix-check]").forEach(el => el.onclick = () => { this.fixCheckedFrom = this.data?.meta?.scanned_at || ""; this.load(true); });
  }
}
Object.assign(TEXT.de, {
  fixNext: "Weiter", fixStepOf: "Schritt {n} von 3", fixObjectWays: "Am Objekt", fixMoreActionsHint: "Weitere Aktionen dieses Objekts, etwa austauschen oder Werte reparieren.", fixOtherWays: "Andere Wege ({n})", fixSelfDone: "Selbst erledigt: nachprüfen", fixRunNone: "Hier läuft noch nichts. Wähle bei „Entscheiden“ einen Weg: was Housekeeper selbst ausführen kann, zeigt sich zuerst als Vorschau, und erst dein Klick ändert etwas.", fixPickCount: "{picked} von {total} gewählt, dann ein Weg für alle.", fixPickNone: "Wähle mindestens eine Stelle, dann ein Weg für alle.",
  fixAllOpen: "Alle {n} beheben", fixAllPlaces: "{n} Stellen verweisen darauf", fixAllKind_automation: "{n} Automationen", fixAllKind_automation1: "1 Automation", fixAllKind_script: "{n} Skripte", fixAllKind_script1: "1 Skript", fixAllKind_dashboard: "{n} Dashboard-Stellen", fixAllKind_dashboard1: "1 Dashboard-Stelle", fixAllPlaces1: "1 Stelle verweist darauf", fixRemoveAll1: "Aus 1 Automation entfernen", fixRemoveAll: "Aus {n} Automationen entfernen",
  fix: "Beheben", fixTitle: "Beheben", fixSubtitle: "Verstehen und entscheiden, ausführen, nachprüfen.", fixBack: "Zurück", fixRowOpen: "Beheben",
  fixStepUnderstand: "Verstehen und entscheiden", fixStepDecide: "Entscheiden", fixStepRun: "Ausführen", fixStepCheck: "Nachprüfen",
  fixWhat: "Was los ist", fixAffects: "Betroffen", fixPattern: "Muster", fixPatternAt: "Fällt immer gegen {hour} Uhr aus", fixRecommended: "empfohlen", fixExits: "Oder entscheiden, nicht zu beheben", fixNoWays: "Für diese Art von Befund gibt es noch keine geführten Wege. Du kannst ihn entscheiden oder das Objekt öffnen.",
  fixOpenHA: "In Home Assistant öffnen", fixOpenActions: "Aktionen des Objekts", fixCollectTitle: "Gesammelt beheben", fixCollectHint: "Wähle aus, was einbezogen wird, dann ein Weg für alle.", fixPickAll: "Alle wählen",
  fixRunHint: "Was etwas ändert, läuft über einen Plan mit Vorschau, Bestätigung, Backup und Zurücknehmen. Wege in Home Assistant öffnen sich dort. Nichts geschieht ohne deinen Klick.",
  fixCheckHint: "Housekeeper schaut sich das Objekt jetzt an und danach 15 Minuten lang alle 30 Sekunden, solange diese Seite offen ist. Entscheiden tut erst der nächste reguläre Scan; der Befund bleibt bis dahin „In Arbeit“.", fixLookNow: "Jetzt ansehen", fixCheckNow: "Ganz neu scannen", fixLooksFixed: "Sieht behoben aus. Vorläufig: der nächste reguläre Scan entscheidet.", fixLiveOpen: "Noch nicht behoben ({detail}).", fixLiveUnknown: "Für diese Art von Befund lässt sich das nicht auf einen Blick sagen; der nächste Scan zeigt es.", fixWatching: "Schaut 15 Minuten lang nach, solange diese Seite offen ist.", fixDone: "Behoben: der Befund ist im neuen Scan nicht mehr da.", fixStillOpen: "Bleibt offen: der Befund ist im neuen Scan noch da. Prüfe, ob der gewählte Weg schon durchgelaufen ist, oder warte auf den nächsten Scan.", fixGone: "Der Befund ist nicht mehr da.",
  fixWay_wait: "Abwarten", fixWayHint_wait: "Die Integration versucht es von selbst noch einmal.",
  fixWay_restart_or_update: "Home Assistant neu starten oder aktualisieren", fixWayHint_restart_or_update: "Eine Migration oder das Entladen ist hängen geblieben; meist hilft ein Neustart oder ein Update der Integration.",
  fixWay_open_integration: "Integration ansehen", fixWayHint_open_integration: "Die Integrationsseite zeigt den Fehler und bietet dort „Neu laden“ an.",
  fixWay_reauth: "Neu anmelden", fixWayHint_reauth: "Die Zugangsdaten gelten nicht mehr. Die Integrationsseite führt durch die Anmeldung.",
  fixWay_mark: "Ist so gewollt (Objekt-Notiz)", fixWayHint_mark: "Sag Housekeeper, dass das Objekt absichtlich offline ist, auch mit Zeitfenster.",
  fixWay_exchange: "Gerät austauschen", fixWayHint_exchange: "Für ein ersetztes Gerät: Automationen und Szenen auf das neue Gerät umstellen.",
  fixWay_replace_entity: "Entität ersetzen", fixWayHint_replace_entity: "Alle Stellen, die diese Entität nutzen, auf eine andere umstellen.",
  fixWay_object_actions: "Deaktivieren oder entfernen", fixWayHint_object_actions: "Die Aktionen des Objekts: deaktivieren, entfernen, austauschen, jeweils mit Vorschau.",
  fixWay_replace_target: "Ziel ersetzen", fixWayHint_replace_target: "Alle Stellen, die das fehlende Ziel nennen, auf ein vorhandenes umstellen: bei einer Entität mit einem ähnlichen Vorschlag, bei Bereich, Etage und Label nach deiner Wahl (nur dort, wo der Schlüssel dafür steht). Die Vorschau zeigt jede Stelle.",
  fixWay_open_editor: "Im Editor öffnen", fixWayHint_open_editor: "Die Stelle in Home Assistant selbst anpassen.", fixReplaceStart: "Ersetzen …", fixReplaceWith: "Ersetzen durch", fixReplaceNone: "Es gibt kein anderes Ziel dieser Art, auf das sich umstellen ließe.",
  fixWay_remove_reference: "Verweis entfernen", fixWayHint_remove_reference: "Nimmt das fehlende Ziel nur aus Ziellisten der Aktionen heraus, in denen weitere Ziele stehen bleiben. Trigger, Bedingungen und Ziele, die allein stehen, fasst Housekeeper nie an; dort bleibt der Editor. Mit Vorschau, Prüfung, Backup und Zurücknehmen.", fixRemoveStart: "Entfernen …", fixRefactorOn: "Verbessern einschalten (experimentell)",
  fixWorkSince: "angefangen am {date}", fixWorkOff: "Nicht mehr bearbeiten",
  fixLastFailure: "Letzter Fehler", fixFailureStep: "bei {step}", fixFailureHint: "Hinweis", fixFailureHintText: "Der Fehlertext nennt {entity}, und die ist ausgefallen. Eine sichere Zuordnung ist das nicht.", fixToFinding: "Zum Befund",
  fixWay_fix_cause: "Erst die Ursache beheben", fixWayHint_fix_cause: "Die Automation scheitert, weil etwas darunter ausgefallen ist. Ist die Ursache behoben, läuft sie von selbst wieder.",
  fixWay_catch_error: "Fehler abfangen", fixWayHint_catch_error: "Setzt „bei Fehler weitermachen“ nur an der einen Aktion, die zuletzt gescheitert ist, nie für die ganze Automation. Der Fehler erscheint danach nicht mehr in den Läufen, und der Rest läuft weiter. Mit Vorschau, Prüfung, Backup und Zurücknehmen.", fixCatchStart: "Abfangen …", fixCatchNoStep: "Dafür braucht es einen letzten Fehler im Ablaufprotokoll von Home Assistant; der ist gerade nicht da.",
  fixWay_start_app: "App starten", fixWayHint_start_app: "Die App ist gestoppt, ihre Integration hängt vermutlich daran. In Home Assistant unter Einstellungen → Apps starten.",
});
Object.assign(TEXT.en, {
  fixNext: "Next", fixStepOf: "Step {n} of 3", fixObjectWays: "On the object", fixMoreActionsHint: "More actions of this object, such as exchanging it or repairing values.", fixOtherWays: "Other ways ({n})", fixSelfDone: "Did it myself: check", fixRunNone: "Nothing runs here yet. Choose a way under “Decide”: what Housekeeper can run itself shows as a preview first, and only your click changes anything.", fixPickCount: "{picked} of {total} chosen, then one way for all.", fixPickNone: "Choose at least one place, then one way for all.",
  fixAllOpen: "Fix all {n}", fixAllPlaces: "{n} places refer to it", fixAllKind_automation: "{n} automations", fixAllKind_automation1: "1 automation", fixAllKind_script: "{n} scripts", fixAllKind_script1: "1 script", fixAllKind_dashboard: "{n} dashboard places", fixAllKind_dashboard1: "1 dashboard place", fixAllPlaces1: "1 place refers to it", fixRemoveAll1: "Remove from 1 automation", fixRemoveAll: "Remove from {n} automations",
  fix: "Fix", fixTitle: "Fix", fixSubtitle: "Understand and decide, carry out, check.", fixBack: "Back", fixRowOpen: "Fix",
  fixStepUnderstand: "Understand and decide", fixStepDecide: "Decide", fixStepRun: "Carry out", fixStepCheck: "Check",
  fixWhat: "What is wrong", fixAffects: "Affects", fixPattern: "Pattern", fixPatternAt: "Always fails around {hour}:00", fixRecommended: "recommended", fixExits: "Or decide not to fix it", fixNoWays: "There are no guided ways for this kind of finding yet. You can decide it or open the object.",
  fixOpenHA: "Open in Home Assistant", fixOpenActions: "Actions of the object", fixCollectTitle: "Fix together", fixCollectHint: "Choose what is included, then one way for all.", fixPickAll: "Pick all",
  fixRunHint: "Whatever changes something goes through a plan with preview, confirmation, backup and undo. Ways in Home Assistant open there. Nothing happens without your click.",
  fixCheckHint: "Housekeeper looks at the object now and then every 30 seconds for 15 minutes while this page is open. Only the next regular scan decides; until then the finding stays “In work”.", fixLookNow: "Look now", fixCheckNow: "Scan everything again", fixLooksFixed: "Looks fixed. Provisional: the next regular scan decides.", fixLiveOpen: "Not fixed yet ({detail}).", fixLiveUnknown: "For this kind of finding that cannot be told at a glance; the next scan shows it.", fixWatching: "Looks for 15 minutes while this page is open.", fixDone: "Fixed: the finding is gone in the new scan.", fixStillOpen: "Still open: the finding is still there in the new scan. Check whether the chosen way has finished, or wait for the next scan.", fixGone: "The finding is gone.",
  fixWay_wait: "Wait", fixWayHint_wait: "The integration tries again by itself.",
  fixWay_restart_or_update: "Restart or update Home Assistant", fixWayHint_restart_or_update: "A migration or an unload got stuck; a restart or an update of the integration usually helps.",
  fixWay_open_integration: "Look at the integration", fixWayHint_open_integration: "The integration page shows the error and offers “Reload” there.",
  fixWay_reauth: "Log in again", fixWayHint_reauth: "The credentials no longer work. The integration page leads through the login.",
  fixWay_mark: "Intended (object note)", fixWayHint_mark: "Tell Housekeeper the object is offline on purpose, also with a time window.",
  fixWay_exchange: "Exchange the device", fixWayHint_exchange: "For a replaced device: move automations and scenes to the new device.",
  fixWay_replace_entity: "Replace the entity", fixWayHint_replace_entity: "Move every place that uses this entity to another one.",
  fixWay_object_actions: "Disable or remove", fixWayHint_object_actions: "The actions of the object: disable, remove, exchange, each with a preview.",
  fixWay_replace_target: "Replace the target", fixWayHint_replace_target: "Move every place that names the missing target to an existing one: for an entity with a similar one proposed, for an area, floor or label as you choose (only where the key for it stands). The preview shows each place.",
  fixWay_open_editor: "Open in the editor", fixWayHint_open_editor: "Adjust the place in Home Assistant yourself.", fixReplaceStart: "Replace …", fixReplaceWith: "Replace with", fixReplaceNone: "There is no other target of this kind to move to.",
  fixWay_remove_reference: "Remove the reference", fixWayHint_remove_reference: "Takes the missing target only out of target lists of the actions in which other targets stay. Housekeeper never touches triggers, conditions or a target that stands alone; the editor is for those. With preview, check, backup and undo.", fixRemoveStart: "Remove …", fixRefactorOn: "Turn on Improve (experimental)",
  fixWorkSince: "started on {date}", fixWorkOff: "Stop working on it",
  fixLastFailure: "Last failure", fixFailureStep: "at {step}", fixFailureHint: "Hint", fixFailureHintText: "The error text names {entity}, and that is down. It is no safe attribution.", fixToFinding: "Go to the finding",
  fixWay_fix_cause: "Fix the cause first", fixWayHint_fix_cause: "The automation fails because something below it is down. Once the cause is fixed, it runs again by itself.",
  fixWay_catch_error: "Catch the error", fixWayHint_catch_error: "Sets “continue on error” only on the one action that failed last, never for the whole automation. Afterwards the error no longer shows in the runs, and the rest keeps running. With preview, check, backup and undo.", fixCatchStart: "Catch …", fixCatchNoStep: "This needs a last failure in Home Assistant's trace buffer; there is none right now.",
  fixWay_start_app: "Start the app", fixWayHint_start_app: "The app is stopped, its integration probably hangs on it. Start it in Home Assistant under Settings → Apps.",
});
