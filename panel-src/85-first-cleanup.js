// FirstCleanupMixin: the cleanup ("Aufräumen") as five stages through the open findings. The backend cuts
// the stages and keeps the record for the whole house; each stage goes through its findings card by card (stage 2 the
// suggestions for marks, stage 4 the cleanup round), or as the plain list with a filter. Every answer is kept in a
// history that can be taken back; the last stage puts the quiet rest off together.

class FirstCleanupMixin {
  ensureFirstCleanup() {
    if (this._fcFor === this.data || !this._hass?.callWS) return;
    this._fcFor = this.data;
    this.loadFirstCleanup(this.data);
  }

  async loadFirstCleanup(data) {
    try {
      const reply = await this._hass.callWS({ type: "ha_housekeeper/first_cleanup" });
      if (this.data !== data) return;
      this.fc = reply || null;
      if (["findingsNav", "round", "firstcleanup"].includes(this.view) && !this.selected) this.render();
    } catch (_) { if (this.data === data) this.fc = null; }
  }

  async firstCleanupSet(msg) {
    try { this.fc = { ...(await this._hass.callWS({ type: "ha_housekeeper/first_cleanup_set", ...msg })), error: "" }; }
    catch (err) { this.fc = { ...(this.fc || {}), error: this.errText(err) }; }
    this.render();
  }

  stageKeys(n) { return new Set(this.fc?.stages?.[String(n)] || []); }

  // Where the stages stand: open findings left in the lists (stage 2 counts the suggestions of the card).
  stageOpen(n) { const keys = this.stageKeys(n); return (this.data?.findings || []).filter(f => !f.ignored && keys.has(f.key)); }

  // The findings the stages hold, and the follow-ups that hang on an outage and are in none of them.
  fcStaged() { const all = new Set(Object.values(this.fc?.stages || {}).flat()); return (this.data?.findings || []).filter(f => !f.ignored && all.has(f.key)); }

  fcFollowing() { return (this.data?.findings || []).filter(f => !f.ignored).length - this.fcStaged().length; }

  stageCount(n) { return n === 2 ? (this.oftenSuggestions?.() || []).length : this.stageOpen(n).length; }

  openFirstCleanup() {
    this.noteJump("firstcleanup");
    this.view = "firstcleanup"; this.selected = null; this.pages = {};
    this.fcWiz = { step: null, look: false, on: true };
    this._fcFor = null; this.ensureFirstCleanup();
    this.render();
  }

  // The offer above the findings: shown while the cleanup has not begun and many findings are open; "Not now" hides it.
  firstCleanupOffer() {
    this.ensureFirstCleanup();
    if (!this.fc?.offered) return "";
    return `<div class="panel fcoffer"><ha-icon icon="mdi:broom"></ha-icon><span class="fctext">${this.t("fcOffer", { n: this.formatNumber(this.fc.open) })}</span><button type="button" class="btn primary" data-fc-begin><ha-icon icon="mdi:broom"></ha-icon>${this.t("fcBegin")}</button><button type="button" class="btn quiet" data-fc-dismiss>${this.t("fcNotNow")}</button></div>`;
  }

  // The cleanup as a wizard: one frame (steps, title, back and next) around the normal list, the card of suggestions, the
  // round or the question of stage 5. Step 0 is the welcome, 6 the end. A page opened from a card (the object, a fix)
  // leaves the tour standing; a band on that page leads back. Another page of the menu puts it aside.
  fcWizOn() {
    if (this.view === "firstcleanup") this.fcWiz ||= { step: null, look: false, on: true };
    if (this.view === "firstcleanup" && this.fcWiz) this.fcWiz.on = true;
    return Boolean(this.fcWiz?.on) && ["findingsNav", "round", "firstcleanup"].includes(this.view);
  }

  fcWizEnd() {
    if (this.fcWiz) this.fcWiz.on = false;
    this.findingStage = 0;
  }

  // The band on the pages left from a card: back to the card where the tour stood.
  fcBand() {
    const w = this.fcWiz, state = this.fc?.state;
    if (!w || !state?.started_at || state.finished_at || !(w.step >= 1 && w.step <= 5)) return "";
    if (this.fcWizOn() && !this.selected) return "";
    return `<div class="fcband"><ha-icon icon="mdi:broom"></ha-icon><span>${this.t("fcBandText", { n: w.step })}</span><button type="button" class="btn primary" data-fc-resume>${this.t("fcBandBack")}</button></div>`;
  }

  fcResume() {
    this.selected = null; this.trail = []; this.pages = {};
    this.fcWiz.on = true;
    this.view = this.fcWiz.step === 4 ? "round" : "findingsNav";
    this.render();
  }

  // Where a cleanup that was begun goes on: the stage it stood at, else the first one not done, else the end.
  fcResumeStep() {
    const state = this.fc?.state;
    if (!state?.started_at) return 0;
    const done = state.done || [];
    if (state.finished_at || done.length >= 5) return 6;
    return done.includes(state.stage) ? [1, 2, 3, 4, 5].find(n => !done.includes(n)) : state.stage;
  }

  // The state of the page for a step, without drawing: the view, the filter of the stage, the round loading.
  fcWizSet(n) {
    this.fcWiz = { step: n, look: false, on: true, history: false };
    this.selected = null; this.pages = {};
    this.clearFindingFilters(); this.findingStatus = "";
    this.view = n === 4 ? "round" : n === 0 || n === 6 ? "firstcleanup" : "findingsNav";
    if (n === 4) { this.round = { rows: null, picked: new Set(), error: "", single: false }; this.loadRound(); }
    else if (n === 2) (this.folds ||= {}).often = true;
  }

  // "As a list": the plain list (or card of suggestions) of the stage instead of the cards.
  fcLook(on) {
    this.fcWiz.look = on; this.findingStage = on && [1, 3, 4, 5].includes(this.fcWiz.step) ? this.fcWiz.step : 0;
    this.pages = {}; this.render();
  }

  fcWizGo(n, record = true) {
    this.fcWizSet(n);
    if (record && n >= 1 && n <= 5) this.firstCleanupSet({ action: "stage", stage: n });
    else this.render();
  }

  // The cards of a stage are all gone through; what is left is what was skipped, and going on needs no question.
  fcSeen(n) { return [1, 2, 3, 4].includes(n) && !this.fcWiz?.look && this.stageCount(n) > 0 && !(n === 2 ? this.fcOftenQueue() : n === 4 ? (this.fcRoundQueue() || [null]) : this.fcUnits(n)).length; }

  // "Next" marks the stage done and goes on; with findings left that were not looked at it asks first.
  fcWizNext() {
    const n = this.fcWiz.step, left = this.fcSeen(n) ? 0 : this.stageCount(n);
    const run = async () => {
      await this.firstCleanupSet({ action: "stage", stage: n, done: true });
      if (n === 5) this.fcWizGo(6, false); else this.fcWizGo(n + 1);
    };
    if (left) this.confirmAsk(this.t("fcSkipAsk", { n: this.formatNumber(left) }), run, { title: this.t("fcSkipTitle"), yes: this.t("fcSkipYes"), danger: false });
    else run();
  }

  // A new pass after the end: the record begins again, and the history of the last one goes with it.
  fcNewRound() {
    this.confirmAsk(this.t("fcNewRoundAsk"), async () => {
      this.fcFocus = ""; this.fcTotal = {}; this.fcToast = null;
      await this.firstCleanupSet({ action: "begin" });
      this.openFirstCleanup();
    }, { title: this.t("fcNewRound"), yes: this.t("fcBegin"), danger: false });
  }

  // "Cancel": the tour starts over from the welcome page; what was decided in it stays decided.
  fcReset() {
    this.confirmAsk(this.t("fcResetAsk"), async () => {
      await this.firstCleanupSet({ action: "reset" });
      this.fcFocus = ""; this.fcTotal = {}; this.fcToast = null;
      this.fcWizSet(0);
      this.render();
    }, { title: this.t("fcResetTitle"), yes: this.t("fcResetYes"), danger: true });
  }

  // Leaving the wizard for another page (the way back to where it was opened from): the tour stays where it stands.
  fcWizLeave() {
    this.fcWiz = null; this.findingStage = 0;
    this.clearFindingFilters(); this.findingStatus = this.defaultFindingStatus();
  }

  // "Pause": the tour is put down where it stands; the chip leads back to it.
  fcWizExit() {
    this.fcWiz = null; this.findingStage = 0;
    this.viewTrail = this.viewTrail.filter(e => e.view !== "findingsNav");
    this.view = "findingsNav"; this.selected = null; this.pages = {};
    this.clearFindingFilters(); this.findingStatus = this.defaultFindingStatus();
    this.render();
  }

  fcStepper(n) {
    const done = this.fc?.state?.done || [];
    const steps = [1, 2, 3, 4, 5].map(i => {
      const isDone = done.includes(i) && !this.stageCount(i), back = i < n && n <= 5;
      const cls = `fcstep${isDone ? " done" : ""}${i === n ? " cur" : ""}`;
      const label = this.t("fcStage", { n: i });
      return `<${back ? "button type=\"button\"" : "span"} class="${cls}" ${back ? `data-fc-goto="${i}"` : ""} ${i === n ? "aria-current=\"step\"" : ""} title="${this.esc(`${label} · ${this.t(`fcStage${i}`)}`)}"><b>${isDone ? "✓" : i}</b></${back ? "button" : "span"}>`;
    });
    return `<nav class="fcsteps" aria-label="${this.esc(this.t("fcStepsLabel"))}">${steps.join('<i class="fcline"></i>')}</nav>`;
  }

  fcWelcome() {
    const icons = { 1: "mdi:link-variant-off", 2: "mdi:lightbulb-on-outline", 3: "mdi:alert-circle-outline", 4: "mdi:broom", 5: "mdi:bell-sleep-outline" };
    const stages = [1, 2, 3, 4, 5].map(n => { const c = this.stageCount(n); return `<li class="fcstagetile"><span class="fcicon"><ha-icon icon="${icons[n]}"></ha-icon></span><strong>${this.t("fcStage", { n })} · ${this.t(`fcStage${n}`)}</strong><small>${this.t(`fcStage${n}Hint`)}</small>${c ? `<span class="pill mute">${this.t("fcLeft", { n: this.formatNumber(c) })}</span>` : ""}</li>`; }).join("");
    const cards = this.stageCount(1) + this.stageCount(2) + this.fcUnits(3).length, minutes = Math.max(1, Math.round(cards / 4));
    const time = cards ? `<p class="fctip">${this.t("fcMinutes", { c: this.formatNumber(cards), n: this.formatNumber(minutes) })}</p>` : "";
    return `<section class="panel fcpanel${this.fcAnim("welcome")}"><div class="pad"><p>${this.t("fcIntro")}</p><ol class="fcstagegrid">${stages}</ol>${time}<div class="mbtns"><button type="button" class="btn primary fcbig" data-fc-begin><ha-icon icon="mdi:broom"></ha-icon>${this.t("fcBegin")}</button></div></div></section>`;
  }

  // What was done in the tour, one line per decision. The history is kept on the server with the rest of the tour, so it
  // is the same in every browser and every decision can be undone from there; the copy here is the one just shown.
  fcLogGet() {
    const state = this.fc?.state;
    if (!state) return (this._fcLogNone ||= []);
    return (state.log ||= []);
  }

  // Tells the server about a change of the history; its answer is the whole record, which replaces the copy here.
  async fcLogCall(msg) {
    try {
      const reply = await this._hass.callWS({ type: "ha_housekeeper/first_cleanup_set", ...msg });
      if (Array.isArray(reply?.state?.log)) this.fc = { ...reply, error: "" };
    } catch (err) { this.failed(err); }
  }

  fcLogAdd(entry) {
    const full = { id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, at: new Date().toISOString(), ...entry };
    this.fcLogGet().push(full);
    this.fcLogCall({ action: "log_add", entry: full });
    return full;
  }

  fcEntryLabel(e) {
    if (e.action === "later_all") return this.t("fcLogLaterAll", { n: this.formatNumber(e.n || 0) });
    if (["keep", "later"].includes(e.action) && e.n > 1) return `${this.t(e.action === "keep" ? "fcKeep" : "fcLater")} · ${this.t("fcLogN", { n: this.formatNumber(e.n) })}`;
    return this.t({ keep: "fcKeep", later: "fcLater", mark: "fcLogMark", nothanks: "fcNoThanks", skip: "fcLogSkip", pick: "fcLogPick" }[e.action] || "fcLogSkip");
  }

  // The note under the card after an answer for many findings at once: what was done, with the way back for a few
  // seconds. A single answer shows none; it is undone with "Undo last".
  fcNotify(entry) {
    if ((entry.n || 1) < 2) return;
    this.fcToast = { id: entry.id, text: `${entry.name ? `${entry.name}: ` : ""}${this.fcEntryLabel(entry)}` };
    clearTimeout(this._fcToastTimer);
    this._fcToastTimer = setTimeout(() => { if (this.fcToast?.id === entry.id) { this.fcToast = null; this.render(); } }, 8000);
    this._fcToastTimer?.unref?.();
  }

  async fcLift(keys) {
    for (const key of keys) {
      try { await this._hass.callWS({ type: "ha_housekeeper/ignore", finding_key: key, ignored: false, source: "cleanup" }); }
      catch (err) { if (err?.code !== "not_found") throw err; }
      const f = this.data.findings.find(x => x.key === key);
      if (f) { f.ignored = false; f.ignore_info = null; this._rev++; }
    }
  }

  // Takes one entry of the log back: the decision is lifted, the mark cleared, the skip dropped; the card shows again.
  async fcUndo(id) {
    const log = this.fcLogGet(), i = log.findIndex(e => e.id === id);
    if (i < 0) return;
    const entry = log[i];
    try {
      if (entry.action === "keep" || entry.action === "later") {
        await this.fcLift(entry.keys || [entry.key]);
        if (entry.stage === 4) for (const target of entry.targets || []) { const [object_type, ...rest] = target.split(":"); try { await this._hass.callWS({ type: "ha_housekeeper/mark_clear", object_type, object_id: rest.join(":"), source: "cleanup" }); } catch (err) { if (err?.code !== "not_found") throw err; } }
      } else if (entry.action === "pick") (entry.keys || [entry.key]).forEach(k => this.round?.picked.delete(k));
      else if (entry.action === "later_all") await this.fcLift(entry.keys || []);
      else if (entry.action === "mark") {
        for (const target of entry.targets || []) { const [object_type, ...rest] = target.split(":"); try { await this._hass.callWS({ type: "ha_housekeeper/mark_clear", object_type, object_id: rest.join(":"), source: "cleanup" }); } catch (err) { if (err?.code !== "not_found") throw err; } }
      } else if (entry.action === "nothanks") this.fcUnskipOften(entry.key, entry.keys);
    } catch (err) { this.failed(err); this.render(); return; }
    log.splice(i, 1); this.fcLogCall({ action: "log_remove", entry_id: id });
    if (entry.stage === 4 && this.round && ["keep", "later"].includes(entry.action)) { this.round = { rows: null, picked: this.round.picked, error: "", single: this.round.single }; this.loadRound(); }
    if (entry.key) this.fcFocus = entry.key;
    if (this.fcToast?.id === id) this.fcToast = null;
    this.render();
    if (!["skip", "nothanks", "pick"].includes(entry.action)) { try { await this.refreshData(); } catch (_) { /* stays on screen */ } this.render(); }
  }

  // "No thanks" of stage 2 taken back: the suggestion is asked about again.
  fcUnskipOften(key, named) {
    const keys = named?.length ? named : key.startsWith("group:") ? this.oftenMembers(key).map(e => `entity:${e}`) : [key];
    for (const k of keys) { delete (this._oftenSkip ||= {})[k]; delete (this._oftenServer ||= {})[k]; }
    this.oftenSend(false, keys, "cleanup");
  }

  // The keys a card button stands for: all findings of the card, or the one named by the button.
  fcKeysOf(el) {
    try { const keys = JSON.parse(el.dataset.keys || "null"); if (Array.isArray(keys) && keys.length) return keys; } catch (_) { /* one key */ }
    return [el.dataset.fcKeep || el.dataset.fcSnooze || el.dataset.fcSkipcard];
  }

  fcSkipped(n) { return new Set(this.fcLogGet().filter(e => e.stage === n && e.action === "skip").flatMap(e => e.keys || [e.key])); }

  fcSummaryRows() {
    const log = this.fcLogGet();
    return [1, 2, 3, 4, 5].map(n => {
      const mine = log.filter(e => e.stage === n), sum = (...actions) => mine.filter(e => actions.includes(e.action)).reduce((c, e) => c + (e.n || 1), 0);
      const parts = [[sum("keep"), "fcSumKeep"], [sum("later", "later_all"), "fcSumLater"], [sum("mark"), "fcSumMark"], [sum("pick"), "fcSumPick"]].filter(([c]) => c).map(([c, k]) => this.t(k, { n: this.formatNumber(c) }));
      const left = this.stageCount(n);
      if (left) parts.push(this.t("fcSumLeft", { n: this.formatNumber(left) }));
      if (!parts.length) parts.push(this.t("fcSumNone"));
      return `<li><b>${this.t("fcStage", { n })} · ${this.t(`fcStage${n}`)}</b><span>${this.esc(parts.join(" · "))}</span></li>`;
    }).join("");
  }

  fcDecided() { return this.fcLogGet().filter(e => e.action !== "skip").reduce((c, e) => c + (e.n || 1), 0); }

  // The end: what was done, what is still open with a way to each part, what comes back, and the next visit.
  fcFinish() {
    const state = this.fc.state, left = this.fcStaged().length, following = this.fcFollowing(), log = this.fcLogGet();
    const later = log.filter(e => ["later", "later_all"].includes(e.action)).reduce((c, e) => c + (e.n || 1), 0);
    const open = [1, 2, 3, 4, 5].map(n => ({ n, c: this.stageCount(n) })).filter(x => x.c)
      .map(x => `<li><span><b>${this.t("fcStage", { n: x.n })} · ${this.t(`fcStage${x.n}`)}</b> · ${this.t("fcSumLeft", { n: this.formatNumber(x.c) })}</span><button type="button" class="btn" data-fc-openlist="${x.n}">${this.t("fcSee")}</button></li>`).join("");
    const until = new Date(Date.now() + (this.fc.later_days || 90) * 864e5).toLocaleDateString(this.lang === "en" ? "en" : "de");
    const kpi = (label, value, tone) => `<div class="fckpi ${tone}"><b>${this.formatNumber(value)}</b><span>${label}</span></div>`;
    return `<section class="panel fcpanel${this.fcAnim("finish")}"><div class="fcdone"><span class="fcbigcheck"><ha-icon icon="mdi:check-bold"></ha-icon></span><strong>${this.t("fcFinishTitle")}</strong><div class="fckpis">${kpi(this.t("fcKpiDecided"), this.fcDecided(), "ok")}${kpi(this.t("fcKpiOpen"), left, left ? "warn" : "ok")}${kpi(this.t("fcKpiLater"), later, "mute")}</div><small>${this.t("fcFinishText2", { d: this.formatNumber(this.fcDecided()), start: this.formatNumber(state.start_count), now: this.formatNumber(left) })}</small></div>
      <div class="pad"><h3>${this.t("fcNextTitle")}</h3>${open ? `<ul class="fcnext">${open}</ul>` : `<p>${this.t("fcNextNone")}</p>`}${following ? `<p>${this.t(following === 1 ? "fcNextFollow1" : "fcNextFollow", { n: this.formatNumber(following) })} <button type="button" class="btn" data-fc-openlist="0">${this.t("fcSee")}</button></p>` : ""}${later ? `<p>${this.t("fcNextLater", { n: this.formatNumber(later), date: until })}</p>` : ""}<p class="fctip">${this.t("fcNextTip")}</p>
      <div class="mbtns"><button type="button" class="btn primary" data-fc-exit>${this.t("fcToFindings")}</button><button type="button" class="btn" data-fc-history="1">${this.t("fcHistory")}</button><button type="button" class="btn" data-fc-newround>${this.t("fcNewRound")}</button><button type="button" class="btn quiet" data-fc-goto="5">${this.t("fcBack")}</button></div>
      <details class="fcdetails"><summary>${this.t("fcSumTitle")}</summary><ul class="fcsum">${this.fcSummaryRows()}</ul></details></div></section>`;
  }

  // Every decision of the tour, the newest first, each with its way back.
  fcHistoryPanel() {
    const log = [...this.fcLogGet()].reverse();
    const rows = log.map(e => `<li><span class="fchstage">${this.t("fcStage", { n: e.stage })}</span><span class="fchtext">${e.name ? `<b>${this.esc(e.name)}</b> · ` : ""}${this.esc(this.fcEntryLabel(e))}</span><button type="button" class="btn" data-fc-undo="${this.esc(e.id)}">${this.t("fcUndo")}</button></li>`).join("");
    return `<section class="panel fcpanel"><div class="panelhead"><div><h2>${this.t("fcHistory")}</h2><p>${this.t("fcHistoryHint")}</p></div></div>${rows ? `<ul class="fchist">${rows}</ul>` : `<div class="emptymsg">${this.t("fcHistoryNone")}</div>`}<div class="pad mbtns"><button type="button" class="btn primary" data-fc-history="0">${this.t("fcHistoryBack")}</button></div></section>`;
  }

  // The part still open from the end page: the list of the stage, outside the tour.
  fcOpenList(n) {
    this.fcWiz.on = false; this.selected = null; this.pages = {};
    if (n === 4) { this.openRound(); return; }
    this.noteJump("findingsNav");
    this.view = "findingsNav"; this.clearFindingFilters(); this.findingStatus = "";
    if (n === 2) (this.folds ||= {}).often = true; else this.findingStage = n;
    this.render();
  }

  // Stage 5 asks one question; "Look first" shows the list of the stage in the same frame.
  fcLaterCard(count) {
    if (!count) return `<section class="panel fcpanel"><div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("fcNothing")}</div></section>`;
    const open = this.stageOpen(5), days = this.fcDays ?? this.fc.later_days, n = this.formatNumber(count);
    const level = k => open.filter(f => f.impact === k).length, owners = new Set(open.map(f => this.ownerKey(f))).size, followers = open.reduce((sum, f) => sum + this.fcFollowers(f), 0);
    const options = [...new Set([30, 90, 180, 365, days])].sort((a, b) => a - b).map(d => `<option value="${d}" ${d === days ? "selected" : ""}>${this.t("fcRestDays", { n: d })}</option>`).join("");
    const info = [
      [this.t("fcInfoImpact"), this.t("fcRestLevels", { low: this.formatNumber(level("low")), info: this.formatNumber(count - level("low")) })],
      [this.t("fcRestObjects"), this.t(owners === 1 ? "fcRestObjects1" : "fcRestObjectsN", { n: this.formatNumber(owners) })],
      [this.t("fcInfoLinks"), followers ? this.t("causeFollowers", { n: this.formatNumber(followers) }) : this.t("fcInfoNothing"), followers ? "" : "fciok"],
    ].map(([label, text, cls = ""]) => `<div class="fcirow static"><span>${this.esc(label)}</span><span class="${cls}">${this.esc(text)}</span><i></i></div>`).join("");
    const back = `<label class="fcirow static"><span>${this.t("fcRestBack")}</span><span><select data-fc-days aria-label="${this.esc(this.t("fcRestBack"))}">${options}</select></span><i></i></label>`;
    return `<section class="panel fccard"><div class="pad"><small class="fceyebrow">${this.t("fcRestEyebrow")}</small><div class="fctitle">${this.tile("entity", "mute")}<div><h3>${this.t(count === 1 ? "fcRestTitle1" : "fcRestTitle", { n })}</h3><small class="fcid">${this.t("fcRestId")}</small></div></div><p class="fcwhat"><strong>${this.t("fcRestWhat")}</strong></p><p class="fcchips"><span class="pill mute">${this.t("fcRestChip")}</span><small>${this.t("fcRestNote")}</small></p><div class="fcinfo">${info}${back}</div><div class="fcacts">${this.fcAct("data-fc-later", this.t("fcLaterGo", { n }), this.t("fcRestLaterHint"), false, "mdi:clock-outline", "amber")}</div><div class="fcmore"><button type="button" class="btn quiet" data-fc-look="1">${this.t("fcAsList")}</button></div></div></section>`;
  }

  fcEmpty() { return `<section class="panel fcpanel"><div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("fcNothing")}</div></section>`; }

  fcFollowers(f) { return this.causeList().find(c => c.finding_key === f.key)?.total_followers || 0; }

  // The findings of a stage still to be looked at, the worst first (stage 1: the most follow-ups first).
  fcQueue(n) {
    return this.stageOpen(n).filter(f => !this.fcSkipped(n).has(f.key))
      .sort((a, b) => (n === 1 ? this.fcFollowers(b) - this.fcFollowers(a) : 0) || this.impactScore(b) - this.impactScore(a) || a.key.localeCompare(b.key));
  }

  // The cards of a stage: the findings of one object are one card (stage 3), so one answer covers them all.
  fcUnits(n) {
    const queue = this.fcQueue(n);
    if (n !== 3) return queue.map(f => [f]);
    const groups = new Map();
    for (const f of queue) { const owner = this.ownerKey(f); (groups.get(owner) || groups.set(owner, []).get(owner)).push(f); }
    return [...groups.values()];
  }

  // "3 of 19": the total is what the stage held when it was first seen; every decision and every skip moves on.
  fcPosition(n, left) {
    const total = (this.fcTotal ||= {});
    total[n] = Math.max(total[n] || 0, left);
    return this.t("fcCardOf", { n: this.formatNumber(total[n] - left + 1), total: this.formatNumber(total[n]) });
  }

  // One action of a card: what it is called and, in a line, what it does.
  fcAct(attr, label, hint, primary = false, icon = "", tone = "") {
    return `<button type="button" class="fcact${primary ? " primary" : ""}${tone ? ` ${tone}` : ""}" ${attr}>${icon ? `<span class="fcicon"><ha-icon icon="${icon}"></ha-icon></span>` : ""}<span class="fctxt"><strong>${label}</strong><small>${hint}</small></span></button>`;
  }

  // A card shows with a short slide-in when it is a new one; renders of the same card within the moment keep it running.
  fcAnim(id) {
    const now = Date.now();
    if (this._fcAnim?.id !== id) this._fcAnim = { id, at: now };
    return now - this._fcAnim.at < 400 ? " fcin" : "";
  }

  // The cards of stage 1 and 3: one finding at a time with the three answers and what each one does.
  fcCards(n) {
    const units = this.fcUnits(n), queue = units, listBtn = `<button type="button" class="btn quiet" data-fc-look="1">${this.t("fcAsList")}</button>`;
    const prevBtn = this.fcPrevButton(n);
    if (!queue.length) {
      const rest = this.stageCount(n);
      return `<section class="panel fcpanel"><div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t(rest ? "fcCardsLeft" : "fcCardsDone", { n: this.formatNumber(rest) })}</div><div class="pad fcmore">${prevBtn}${rest ? `<button type="button" class="btn" data-fc-again>${this.t("fcCardsAgain")}</button>${listBtn}` : ""}</div></section>`;
    }
    const unit = (this.fcFocus && queue.find(u => u.some(x => x.key === this.fcFocus))) || queue[0], f = unit[0], keys = unit.map(x => x.key), many = unit.length > 1, kattr = `data-keys="${this.esc(JSON.stringify(keys))}"`, key = many ? this.ownerKey(f) : this.findingKey(f), obj = this.findObject(key), days = this.fc?.later_days || 90;
    const follows = this.fcFollowers(f), since = f.first_detected_at ? this.t("fcSince", { age: this.agoText(f.first_detected_at) }) : "", ownerType = this.findObject(key)?.object_type || this.findingType(f);
    const acts = [
      obj ? this.fcAct(`data-fc-fix="${this.esc(key)}"`, this.t("fcFix"), this.t("fcFixHint"), false, "mdi:wrench-outline", "blue") : "",
      this.fcAct(`data-fc-keep="${this.esc(f.key)}" ${kattr}`, this.t("fcKeep"), this.t("fcKeepHint", { days: this.defaultDays("keep") }), false, "mdi:check-circle-outline", "green"),
      this.fcAct(`data-fc-snooze="${this.esc(f.key)}" ${kattr}`, this.t("fcLater"), this.t("fcLaterHint", { days }), false, "mdi:clock-outline", "amber"),
    ].join("");
    const chips = `<p class="fcchips">${this.impactChip(f.impact)}${follows ? `<span class="pill red">${this.t(follows === 1 ? "fcFollowsChip1" : "fcFollowsChip", { n: this.formatNumber(follows) })}</span>` : ""}</p>`;
    const title = obj ? `<button type="button" class="linkbtn fclink" data-object="${this.esc(key)}">${this.esc(obj.name)}</button>` : this.esc(f.object_id);
    return `<section class="panel fccard${this.fcAnim(`${n}:${keys.join()}`)}"><div class="pad"><small class="fceyebrow">${this.fcPosition(n, queue.length)}</small><div class="fctitle">${this.tile(ownerType, this.tone(f.classification))}<div><h3>${title}</h3><small class="fcid">${this.esc(many ? key.slice(key.indexOf(":") + 1) : f.object_id)}</small></div></div><p class="fcwhat"><strong>${many ? this.t("fcGroupHead", { n: this.formatNumber(unit.length) }) : this.esc(this.findingTitle(f))}</strong></p>${chips}${this.fcInfoBlock(f, key, obj)}<div class="fcacts">${acts}</div><div class="fcmore">${prevBtn}<button type="button" class="btn" data-fc-skipcard="${this.esc(f.key)}" ${kattr}>${this.t("fcSkipCard")}<ha-icon icon="mdi:arrow-right"></ha-icon></button>${listBtn}</div>${many ? this.fcGroupList(unit) : ""}${this.fcFollowList(f, follows)}</div></section>`;
  }

  // The findings of one object on a card: each with its title, and a note that the answer covers all of them.
  fcGroupList(unit) {
    const rows = unit.map(x => `<li>${this.esc(this.findingTitle(x))}${this.findingKey(x) !== this.ownerKey(x) && this.findObject(this.findingKey(x)) ? ` <small>${this.esc(this.findObject(this.findingKey(x)).name)}</small>` : ""}</li>`).join("");
    return `<ul class="fcgroup">${rows}</ul><p class="fcfacts">${this.t("fcGroupNote")}</p>`;
  }

  // The findings that hang on this one, each a link to its object.
  fcFollowList(f, follows) {
    if (!follows) return "";
    const cause = this.causeList().find(c => c.finding_key === f.key);
    const items = (cause?.follower_keys || []).map(k => this.data.findings.find(x => x.key === k)).filter(Boolean);
    const rows = items.slice(0, 8).map(x => { const k = this.findingKey(x), o = this.findObject(k); return `<li>${o ? `<button type="button" class="linkbtn" data-object="${this.esc(k)}">${this.esc(o.name)}</button>` : this.esc(x.object_id)} <small>${this.esc(this.findingTitle(x))}</small></li>`; }).join("");
    const more = items.length > 8 ? `<li><small>${this.t("fcFollowMore", { n: this.formatNumber(items.length - 8) })}</small></li>` : "";
    const head = this.t(follows === 1 ? "fcFollows1" : "fcFollows", { n: this.formatNumber(follows) });
    return rows ? `<details class="fcfollows"><summary>${head}</summary><ul>${rows}${more}</ul></details>` : `<p class="fcfacts">${head}</p>`;
  }

  // One card back: the last skip or decision of the stage is taken back, and the card shows once more.
  // The actions of a stage that "Previous" can take back: the answers of the cards, or in stage 2 the marks and refusals.
  fcPrevActions(n) { return n === 2 ? ["mark", "nothanks", "skip"] : n === 4 ? ["keep", "later", "skip", "pick"] : ["keep", "later", "skip"]; }

  fcPrevButton(n) {
    const some = this.fcLogGet().some(e => e.stage === n && this.fcPrevActions(n).includes(e.action));
    return `<button type="button" class="btn" data-fc-prev ${some ? "" : "disabled"} title="${this.esc(this.t("fcPrevHint"))}"><ha-icon icon="mdi:arrow-left"></ha-icon>${this.t("fcPrev")}</button>`;
  }

  fcPrev() {
    const n = this.fcWiz.step, last = [...this.fcLogGet()].reverse().find(e => e.stage === n && this.fcPrevActions(n).includes(e.action));
    if (last) this.fcUndo(last.id);
  }

  // The suggestions of stage 2 still to be looked at: those skipped wait until the others are through.
  fcOftenQueue() {
    const skipped = this.fcSkipped(2);
    return (this.oftenSuggestions?.() || []).filter(x => !skipped.has(x.key));
  }

  // Stage 2: one suggestion at a time; the mark is set from the card.
  fcOftenStep(count) {
    const all = this.oftenSuggestions?.() || [], items = this.fcOftenQueue();
    if (!all.length) return `<section class="panel fcpanel"><div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("fcNothing")}</div><div class="pad fcmore">${this.fcPrevButton(2)}</div></section>`;
    if (!items.length) return `<section class="panel fcpanel"><div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("fcCardsLeft", { n: this.formatNumber(all.length) })}</div><div class="pad fcmore">${this.fcPrevButton(2)}<button type="button" class="btn" data-fc-again>${this.t("fcCardsAgain")}</button><button type="button" class="btn quiet" data-fc-look="1">${this.t("fcAsList")}</button></div></section>`;
    const first = (this.fcFocus && items.find(x => x.key === this.fcFocus)) || items[0], r = this.oftenRowOf(first), listBtn = `<button type="button" class="btn quiet" data-fc-look="1">${this.t("fcAsList")}</button>`;
    const takeAll = all.length > 1 ? `<button type="button" class="btn quiet" data-fc-takeall>${this.t("fcTakeAll", { n: this.formatNumber(all.length) })}</button>` : "";
    const acts = this.fcAct(`data-fc-take="${this.esc(r.key)}"`, this.t("fcTake"), this.t("fcTakeHint"), false, "mdi:bookmark-plus-outline", "blue") + this.fcAct(`data-fc-oskip="${this.esc(r.key)}"`, this.t("fcNoThanks"), this.t("fcNoThanksHint"), false, "mdi:close-circle-outline", "mute");
    return `<section class="panel fccard${this.fcAnim(`2:${r.key}`)}"><div class="pad"><small class="fceyebrow">${this.fcPosition(2, items.length)}</small><h3>${this.findObject(r.link) ? `<button type="button" class="linkbtn fclink" data-object="${this.esc(r.link)}">${this.esc(r.title)}</button>` : this.esc(r.title)}</h3><small class="fcid">${this.esc(r.id)}</small><p class="fcwhat"><strong>${this.esc(r.pattern)}</strong> · ${this.oftenFindings(r.hides)}</p>${r.note ? `<p class="fcfacts">${this.esc(r.note)}</p>` : ""}${this.fcOftenInfo(first, r)}<div class="fcacts">${acts}</div><div class="fcmore">${this.fcPrevButton(2)}<button type="button" class="btn" data-fc-skipcard="${this.esc(r.key)}" data-keys="${this.esc(JSON.stringify([r.key]))}">${this.t("fcSkipCard")}<ha-icon icon="mdi:arrow-right"></ha-icon></button>${takeAll}${listBtn}</div></div></section>`;
  }

  async fcTake(keys) {
    const targets = keys.flatMap(k => (k.startsWith("group:") ? this.oftenMembers(k).map(e => `entity:${e}`) : [k]));
    const rows = new Map((this.oftenSuggestions?.() || []).map(x => [x.key, this.oftenRowOf(x)]));
    await this.takeOften(keys);
    if (this.fcFocus && keys.includes(this.fcFocus)) this.fcFocus = "";
    const entry = this.fcLogAdd({ stage: 2, action: "mark", key: keys.length === 1 ? keys[0] : "", keys, targets, n: targets.length, name: keys.length === 1 ? rows.get(keys[0])?.title || "" : this.t("fcLogSeveral", { n: keys.length }) });
    this.fcNotify(entry);
    this.render();
  }

  fcNoThanks(key) {
    const row = (this.oftenSuggestions?.() || []).filter(x => x.key === key).map(x => this.oftenRowOf(x))[0];
    const keys = key.startsWith("group:") ? this.oftenMembers(key).map(e => `entity:${e}`) : [key];
    this.skipOften(key, "cleanup");
    if (this.fcFocus === key) this.fcFocus = "";
    this.fcNotify(this.fcLogAdd({ stage: 2, action: "nothanks", key, keys, name: row?.title || "" }));
    this.render();
  }

  fcTakeAll() {
    const items = this.oftenSuggestions?.() || [], keys = items.map(s => s.key);
    if (!keys.length) return;
    const hides = items.reduce((n, s) => n + s.hides, 0), marks = items.reduce((n, s) => n + (s.key.startsWith("group:") ? this.oftenMembers(s.key).length : 1), 0);
    this.confirmAsk(this.t("oftenAllText", { n: this.formatNumber(marks), hides: this.formatNumber(hides) }), () => this.fcTake(keys), { title: this.t("oftenAllTitle"), yes: this.t("oftenTake"), danger: false });
  }

  // "Intended" or "Later" straight from the card; the card of the next finding follows.
  async fcDecide(keyOrKeys, kind) {
    const keys = [].concat(keyOrKeys), key = keys[0], list = keys.map(k => this.data.findings.find(x => x.key === k)).filter(Boolean), f = list[0];
    if (!f) return;
    const days = kind === "snooze" ? (this.fc?.later_days || 90) : this.defaultDays("keep"), reason = this.t(kind === "snooze" ? "fcLaterOneReason" : "fcKeepReason");
    try {
      for (const x of list) {
        await this._hass.callWS({ type: "ha_housekeeper/ignore", finding_key: x.key, ignored: true, kind, reason, days, source: "cleanup" });
        x.ignored = true; x.ignored_by = "user"; x.resurfaced = false;
        x.ignore_info = { kind, reason, until: new Date(Date.now() + days * 864e5).toISOString(), at: new Date().toISOString() };
        this._rev++;
      }
      const owner = list.length > 1 ? this.ownerKey(f) : this.findingKey(f);
      this.fcNotify(this.fcLogAdd({ stage: this.fcWiz?.step, key, keys: list.map(x => x.key), n: list.length, action: kind === "keep" ? "keep" : "later", name: this.findObject(owner)?.name || f.object_id }));
      if (list.some(x => x.key === this.fcFocus)) this.fcFocus = "";
      this.render();
      await this.reloadAfterDecision();
      return;
    } catch (err) { this.failed(err); }
    this.render();
  }

  wizardView() {
    this.ensureFirstCleanup();
    const fc = this.fc;
    if (!fc) return `<div class="stack"><section class="panel"><div class="pad"><small>${this.t("loading")}</small></div></section></div>`;
    if (this.fcWiz.step === null) this.fcWizSet(this.fcResumeStep());
    const n = this.fcWiz.step, error = fc.error ? this.notice("warn", this.esc(fc.error)) : "";
    if (n === 0) return `<div class="stack">${error}${this.fcWelcome()}</div>`;
    const state = fc.state || { done: [] }, left = this.fcStaged().length;
    const counter = `<span class="fccounter">${this.t("fcCounter", { start: this.formatNumber(state.start_count), now: this.formatNumber(left), d: this.formatNumber(this.fcDecided()) })}</span>`;
    const startN = state.start_count || 0, pct = startN ? Math.max(0, Math.min(100, Math.round(((startN - left) / startN) * 100))) : 0;
    const top = `<div class="fctop">${this.fcStepper(n)}${counter}</div><div class="fcbar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="${this.esc(this.t("fcProgress"))}"><i style="width:${pct}%"></i></div>`;
    if (this.fcWiz.history) return `<div class="stack">${error}${top}${this.fcHistoryPanel()}</div>`;
    if (n === 6) return `<div class="stack">${error}${top}${this.fcFinish()}</div>`;
    const count = this.stageCount(n);
    const head = `<section class="panel fchead"><div class="pad"><div class="fcheadrow"><div><small class="fceyebrow">${this.t("fcStageOf", { n })}</small><h2>${this.t(`fcStage${n}`)}</h2></div><span class="pill ${count ? "warn" : "ok"}">${count ? (n === 3 && this.fcUnits(3).length ? this.t("fcLeftObj", { o: this.formatNumber(new Set(this.stageOpen(3).map(f => this.ownerKey(f))).size), n: this.formatNumber(count) }) : this.t("fcLeft", { n: this.formatNumber(count) })) : this.t("fcStageClear")}</span></div><p>${this.t(`fcStage${n}Hint`)}</p></div></section>`;
    const look = this.fcWiz.look;
    let body;
    if (n === 4 && look) body = this.findingsView();
    else if (n === 4) body = this.fcRoundCards();
    else if (n === 2) body = look ? this.oftenCard() || this.fcEmpty() : this.fcOftenStep(count);
    else if (n === 5) body = look ? this.findingsView() : this.fcLaterCard(count);
    else body = look ? this.findingsView() : this.fcCards(n);
    const lookOff = look ? `<button type="button" class="btn quiet" data-fc-look="0">${this.t(n === 5 ? "fcLookOff" : n === 4 ? "fcToRound" : "fcToCards")}</button>` : "";
    const seen = this.fcSeen(n);
    const next = count && !seen
      ? `<button type="button" class="btn" data-fc-next>${this.t("fcSkip")}</button>`
      : `<button type="button" class="btn primary" data-fc-next>${this.t(n === 5 ? "fcFinish" : "fcNextStage", { n: n + 1 })}</button>`;
    const menu = `<details class="rowmenu fcmenu"><summary aria-label="${this.esc(this.t("rowMenu"))}"><ha-icon icon="mdi:dots-vertical"></ha-icon></summary><div class="menupop"><button type="button" class="menuitem" data-fc-history="1"><ha-icon icon="mdi:history"></ha-icon>${this.t("fcHistory")}</button><button type="button" class="menuitem" data-jump="journal" data-jump-tab="activity"><ha-icon icon="mdi:history"></ha-icon>${this.t("fcAllActivity")}</button><button type="button" class="menuitem" data-fc-exit><ha-icon icon="mdi:pause-circle-outline"></ha-icon>${this.t("fcExit")}</button><button type="button" class="menuitem" data-fc-reset><ha-icon icon="mdi:restart"></ha-icon>${this.t("fcReset")}</button></div></details>`;
    const foot = `<div class="panel fcfoot"><button type="button" class="btn" data-fc-goto="${n - 1}" ${n === 1 ? "disabled" : ""}><ha-icon icon="mdi:arrow-left"></ha-icon>${this.t("fcBack")}</button><span class="fcprogress">${count ? this.t("fcLeftNow", { n: this.formatNumber(count) }) : this.t("fcStageClear")}</span>${lookOff}${next}${menu}</div>`;
    const toast = this.fcToast ? `<div class="fctoast" role="status"><span>✓ ${this.esc(this.fcToast.text)}</span><button type="button" class="btn" data-fc-undo="${this.esc(this.fcToast.id)}">${this.t("fcUndo")}</button></div>` : "";
    return `<div class="stack">${error}${top}${head}${body}${toast}${foot}</div>`;
  }

  bindFirstCleanup(root) {
    root.querySelectorAll("[data-fc-begin]").forEach(el => el.onclick = async () => { this.fcFocus = ""; this.fcTotal = {}; this.fcToast = null; await this.firstCleanupSet({ action: "begin" }); this.openFirstCleanup(); });
    root.querySelector("[data-fc-dismiss]")?.addEventListener("click", () => this.firstCleanupSet({ action: "dismiss" }));
    root.querySelectorAll("[data-fc-open]").forEach(el => el.onclick = () => this.openFirstCleanup());
    root.querySelectorAll("[data-fc-goto]").forEach(el => el.onclick = () => this.fcWizGo(Number(el.dataset.fcGoto), Number(el.dataset.fcGoto) >= 1 && Number(el.dataset.fcGoto) <= 5));
    root.querySelector("[data-fc-next]")?.addEventListener("click", () => this.fcWizNext());
    root.querySelectorAll("[data-fc-exit]").forEach(el => el.onclick = () => this.fcWizExit());
    root.querySelectorAll("[data-fc-look]").forEach(el => el.onclick = () => this.fcLook(el.dataset.fcLook === "1"));
    root.querySelectorAll("[data-fc-keep]").forEach(el => el.onclick = () => this.fcDecide(this.fcKeysOf(el), "keep"));
    root.querySelectorAll("[data-fc-snooze]").forEach(el => el.onclick = () => this.fcDecide(this.fcKeysOf(el), "snooze"));
    this.bindFcInfo(root);
    this.bindFcRound(root);
    root.querySelectorAll("[data-fc-fix]").forEach(el => el.onclick = () => { const obj = this.findObject(el.dataset.fcFix); if (obj) this.openObject(obj); });
    root.querySelectorAll("[data-fc-skipcard]").forEach(el => el.onclick = () => {
      const keys = this.fcKeysOf(el);
      this.fcLogAdd({ stage: this.fcWiz.step, key: keys[0], keys, action: "skip" });
      if (keys.includes(this.fcFocus)) this.fcFocus = "";
      this.render();
    });
    root.querySelector("[data-fc-again]")?.addEventListener("click", () => { const stage = this.fcWiz.step, log = this.fcLogGet(); log.splice(0, log.length, ...log.filter(e => !(e.stage === stage && e.action === "skip"))); this.fcLogCall({ action: "log_unskip", stage }); this.render(); });
    root.querySelector("[data-fc-newround]")?.addEventListener("click", () => this.fcNewRound());
    root.querySelector("[data-fc-prev]")?.addEventListener("click", () => this.fcPrev());
    root.querySelector("[data-fc-reset]")?.addEventListener("click", () => this.fcReset());
    root.querySelectorAll("[data-fc-take]").forEach(el => el.onclick = () => this.fcTake([el.dataset.fcTake]));
    root.querySelectorAll("[data-fc-oskip]").forEach(el => el.onclick = () => this.fcNoThanks(el.dataset.fcOskip));
    root.querySelectorAll("[data-fc-undo]").forEach(el => el.onclick = () => this.fcUndo(el.dataset.fcUndo));
    root.querySelectorAll("[data-fc-history]").forEach(el => el.onclick = () => { this.fcWiz.history = el.dataset.fcHistory === "1"; this.render(); });
    root.querySelectorAll("[data-fc-openlist]").forEach(el => el.onclick = () => this.fcOpenList(Number(el.dataset.fcOpenlist)));
    root.querySelector("[data-fc-resume]")?.addEventListener("click", () => this.fcResume());
    root.querySelector("[data-fc-takeall]")?.addEventListener("click", () => this.fcTakeAll());
    root.querySelector("[data-fc-days]")?.addEventListener("change", e => { this.fcDays = Math.max(1, Math.min(3650, Number(e.target.value) || this.fc.later_days)); this.render(); });
    root.querySelector("[data-fc-later]")?.addEventListener("click", () => this.fcLater());
  }

  // Stage 5: the rest goes to "Later" with a date; it comes back through "Due". Housekeeper's own list only.
  fcLater() {
    const n = this.stageCount(5), days = this.fcDays ?? this.fc.later_days;
    if (n) this.confirmAsk(this.t("fcLaterConfirm", { n: this.formatNumber(n), days }), () => this.fcLaterRun(days, n), { title: this.t("fcLaterTitle"), yes: this.t("fcLaterYes"), danger: false });
  }

  async fcLaterRun(days, n = this.stageCount(5)) {
    const keys = this.stageOpen(5).map(f => f.key);
    try {
      const reply = await this._hass.callWS({ type: "ha_housekeeper/first_cleanup_later", days, reason: this.t("fcLaterReason") });
      this.fcNotify(this.fcLogAdd({ stage: 5, action: "later_all", n, keys }));
      this.fc = { ...reply, error: "" };
      await this.refreshData?.();
    } catch (err) { this.fc = { ...this.fc, error: this.errText(err) }; }
    this.render();
  }
}
Object.assign(TEXT.de, {
  fcAllActivity: "Gesamte Aktivität", fcBandText: "Du bist mitten im Aufräumen, bei Etappe {n}.", fcBandBack: "Zurück zum Aufräumen", fcUndo: "Rückgängig", fcHistory: "Verlauf", fcHistoryHint: "Alles, was du beim Aufräumen entschieden hast, das Neueste zuerst.",
  fcHistoryNone: "Noch nichts entschieden.", fcHistoryBack: "Zurück zum Aufräumen", fcLogMark: "Vermerk angelegt", fcLogSkip: "Übersprungen", fcLogLaterAll: "{n} ruhige Befunde auf „Später“", fcLogSeveral: "{n} Vorschläge",
  fcFollowMore: "… und {n} weitere", fcFinishText2: "Du hast {d} Entscheidungen getroffen. Zu Beginn waren {start} Befunde offen, jetzt sind es {now}.", fcNextTitle: "So geht es weiter",
  fcNextNone: "Nichts mehr offen. Neue Befunde erscheinen unter „Neu“.", fcSee: "Ansehen", fcNextLater: "Befunde auf „Später“ ({n}) kommen ab {date} unter „Fällig“ wieder.",
  fcNextTip: "Neue Befunde erscheinen unter „Neu“. Beginne in etwa 30 Tagen einen neuen Durchgang.", fcSumTitle: "Übersicht pro Etappe",
  fcCardOf: "{n} von {total}", fcFix: "Beheben", fcFixHint: "Öffnet die Seite des Objekts. Von dort kommst du hierher zurück.",
  fcKeep: "Ist so gewollt", fcKeepHint: "Bleibt, wie es ist, und zählt {days} Tage nicht mehr als Befund.", fcLater: "Später erinnern", fcLaterHint: "Kommt in {days} Tagen wieder in die Liste.",
  fcKeepReason: "Beim Aufräumen als gewollt bestätigt", fcLaterOneReason: "Beim Aufräumen zurückgestellt", fcSkipCard: "Überspringen", fcGroupHead: "{n} Befunde an diesem Objekt", fcGroupNote: "Deine Antwort gilt für alle diese Befunde.", fcLogN: "{n} Befunde", fcAsList: "Als Liste ansehen", fcToCards: "Zurück zu den Karten",
  fcSince: "erkannt {age}", fcFollows: "{n} weitere Befunde hängen daran", fcFollows1: "1 weiterer Befund hängt daran",
  fcCardsDone: "Alle Karten dieser Etappe sind durchgesehen.", fcCardsLeft: "Alle Karten sind durchgesehen, {n} übersprungene bleiben offen.", fcCardsAgain: "Übersprungene noch einmal zeigen",
  fcTake: "Vermerk anlegen", fcTakeHint: "Gilt als absichtlich zeitweise offline; nach 90 Tagen wird wieder gefragt.", fcNoThanks: "Nein danke", fcNoThanksHint: "Hier nicht mehr fragen.", fcTakeAll: "Alle {n} übernehmen",
  fcPrev: "Letzte zurücknehmen", fcPrevHint: "Nimmt die letzte Entscheidung oder das Überspringen zurück und zeigt die Karte noch einmal.", fcReset: "Zurücksetzen", fcResetTitle: "Aufräumen zurücksetzen?", fcResetYes: "Zurücksetzen",
  fcResetAsk: "Das Aufräumen wird zurückgesetzt und beginnt wieder bei der Willkommensseite. Was du darin entschieden hast, bleibt entschieden; der Verlauf mit „Rückgängig“ wird geleert.", fcNewRound: "Neuen Durchgang beginnen", fcNewRoundAsk: "Das Aufräumen beginnt von vorn. Was du entschieden hast, bleibt entschieden; der Verlauf mit „Rückgängig“ wird geleert.",
  fcSumKeep: "{n} so gewollt", fcSumLater: "{n} auf „Später“", fcSumMark: "{n} Vermerke angelegt", fcSumLeft: "{n} noch offen", fcSumNone: "nichts zu tun",
  fcStageOf: "Etappe {n} von 5", fcSkip: "Etappe überspringen", fcNextStage: "Weiter zu Etappe {n}", fcFinish: "Abschließen", fcBack: "Zurück", fcExit: "Pause, später weitermachen",
  fcLeft: "{n} offen", fcLeftObj: "{o} Objekte · {n} Befunde", fcToRound: "Zurück zur Runde", fcNextFollow: "{n} Folgebefunde hängen noch an Ursachen und gehören zu keiner Etappe.", fcNextFollow1: "1 Folgebefund hängt noch an einer Ursache und gehört zu keiner Etappe.", fcLeftNow: "{n} offen in dieser Etappe", fcStageClear: "Etappe geschafft", fcNothing: "Hier ist nichts zu tun.", fcStepsLabel: "Etappen",
  fcSkipTitle: "Etappe verlassen?", fcSkipAsk: "In dieser Etappe sind noch {n} offen. Trotzdem weiter?", fcSkipYes: "Weiter",
  fcCounter: "{start} zu Beginn · {now} jetzt offen · {d} entschieden", fcLaterGo: "Alle {n} auf „Später“ legen", fcLookOff: "Zurück zur Frage",
  fcRoundUndo: "Was die Runde ändert, steht danach im Journal und lässt sich dort zurücknehmen.", fcOpenJournal: "Journal öffnen", fcFinishTitle: "Fertig", fcKpiDecided: "Entschieden", fcKpiOpen: "Noch offen", fcKpiLater: "Auf „Später“", fcProgress: "Fortschritt", fcMinutes: "{c} Karten, etwa {n} Minuten.", fcFollowsChip: "{n} Folgen", fcFollowsChip1: "1 Folge", fcFinishText: "Von {start} offenen Befunden sind noch {now} offen.", fcToFindings: "Offene Befunde ansehen",
  firstcleanup: "Aufräumen", round: "Aufräum-Runde", firstTitle: "Aufräumen", firstSubtitle: "Die offenen Befunde in fünf Etappen durchgehen.",
  fcOffer: "{n} Befunde sind offen. Das Aufräumen geht sie in fünf Etappen durch.", fcBegin: "Aufräumen beginnen", fcNotNow: "Nicht jetzt", fcButton: "Aufräumen",
  fcIntro: "Fünf Etappen aus Themen und Wirkung: zuerst, was viele Folgen hat, zuletzt der ruhige Rest. Du gehst die Befunde Karte für Karte durch und kannst jederzeit aufhören, der Stand bleibt.",
 
  fcStageFilter: "Etappe {n}: {name}", fcStage: "Etappe {n}",
  fcStage1: "Ausfälle mit vielen Folgen", fcStage1Hint: "Eine Ursache beseitigt viele Folgen auf einmal.",
  fcStage2: "Vorschläge für Vermerke", fcStage2Hint: "Was oft ausfällt, bekommt besser einen Vermerk als einen Befund.",
  fcStage3: "Hohe und mittlere Wirkung", fcStage3Hint: "Ausgefallen, kaputte Verweise und fehlerhafte Automationen mit Wirkung Hoch oder Mittel.",
  fcStage4: "Überflüssiges", fcStage4Hint: "Die Aufräum-Runde: sicher Entfernbares gesammelt, der Rest einzeln.",
  fcStage5: "Der ruhige Rest", fcStage5Hint: "Wirkung Niedrig oder Info: gesammelt auf „Später“; es kommt über „Fällig“ zurück.",
  fcRestEyebrow: "Der ruhige Rest", fcRestTitle: "{n} ruhige Befunde", fcRestTitle1: "1 ruhiger Befund", fcRestId: "Wirkung Niedrig oder Info", fcRestWhat: "Zum Zurücklegen", fcRestChip: "Ruhig", fcRestNote: "Sie kommen über „Fällig“ zurück, an Home Assistant ändert sich nichts.", fcRestLevels: "{low} Niedrig · {info} Info", fcRestObjects: "Objekte", fcRestObjects1: "1 Objekt", fcRestObjectsN: "{n} Objekte", fcRestBack: "Zurück in", fcRestDays: "{n} Tagen", fcRestLaterHint: "Für die gewählte Zeit.",
  fcLaterTitle: "Rest auf „Später“ legen?", fcLaterYes: "Auf „Später“ legen", fcLaterConfirm: "{n} Befunde für {days} Tage auf „Später“ legen? Sie kommen danach als fällig zurück; nichts an Home Assistant ändert sich.", fcLaterReason: "Beim Aufräumen gesammelt zurückgestellt",
});
Object.assign(TEXT.en, {
  fcAllActivity: "All activity", fcBandText: "You are in the middle of the cleanup, at stage {n}.", fcBandBack: "Back to the cleanup", fcUndo: "Undo", fcHistory: "History", fcHistoryHint: "All you decided in the cleanup, the newest first.",
  fcHistoryNone: "Nothing decided yet.", fcHistoryBack: "Back to the cleanup", fcLogMark: "Mark set", fcLogSkip: "Skipped", fcLogLaterAll: "{n} quiet findings on “Later”", fcLogSeveral: "{n} suggestions",
  fcFollowMore: "… and {n} more", fcFinishText2: "You made {d} decisions. {start} findings were open at the start, {now} are now.", fcNextTitle: "What next",
  fcNextNone: "Nothing left open. New findings show up under “New”.", fcSee: "View", fcNextLater: "Findings on “Later” ({n}) come back under “Due” from {date}.",
  fcNextTip: "New findings show up under “New”. Start a new pass in about 30 days.", fcSumTitle: "Overview per stage",
  fcCardOf: "{n} of {total}", fcFix: "Fix", fcFixHint: "Opens the page of the object. You come back here from there.",
  fcKeep: "Intended", fcKeepHint: "Stays as it is and does not count as a finding for {days} days.", fcLater: "Remind me later", fcLaterHint: "Comes back into the list in {days} days.",
  fcKeepReason: "Confirmed as intended in the cleanup", fcLaterOneReason: "Put off in the cleanup", fcSkipCard: "Skip", fcGroupHead: "{n} findings on this object", fcGroupNote: "Your answer applies to all of these findings.", fcLogN: "{n} findings", fcAsList: "View as list", fcToCards: "Back to the cards",
  fcSince: "found {age}", fcFollows: "{n} more findings hang on it", fcFollows1: "1 more finding hangs on it",
  fcCardsDone: "All cards of this stage are looked at.", fcCardsLeft: "All cards are looked at, {n} skipped ones stay open.", fcCardsAgain: "Show the skipped ones again",
  fcTake: "Set mark", fcTakeHint: "Counts as offline on purpose for a while; asked again after 90 days.", fcNoThanks: "No thanks", fcNoThanksHint: "Do not ask here again.", fcTakeAll: "Take all {n}",
  fcPrev: "Undo last", fcPrevHint: "Takes the last decision or skip back and shows the card once more.", fcReset: "Reset", fcResetTitle: "Reset the cleanup?", fcResetYes: "Reset",
  fcResetAsk: "The cleanup is reset and begins again at the welcome page. What you decided in it stays decided; the history with “Undo” is emptied.", fcNewRound: "Start a new pass", fcNewRoundAsk: "The cleanup begins again. What you decided stays decided; the history with “Undo” is emptied.",
  fcSumKeep: "{n} intended", fcSumLater: "{n} on “Later”", fcSumMark: "{n} marks set", fcSumLeft: "{n} still open", fcSumNone: "nothing to do",
  fcStageOf: "Stage {n} of 5", fcSkip: "Skip stage", fcNextStage: "On to stage {n}", fcFinish: "Finish", fcBack: "Back", fcExit: "Pause, continue later",
  fcLeft: "{n} open", fcLeftObj: "{o} objects · {n} findings", fcToRound: "Back to the round", fcNextFollow: "{n} follow-up findings still hang on causes and belong to no stage.", fcNextFollow1: "1 follow-up finding still hangs on a cause and belongs to no stage.", fcLeftNow: "{n} open in this stage", fcStageClear: "Stage done", fcNothing: "Nothing to do here.", fcStepsLabel: "Stages",
  fcSkipTitle: "Leave the stage?", fcSkipAsk: "{n} are still open in this stage. Go on anyway?", fcSkipYes: "Go on",
  fcCounter: "{start} at the start · {now} open now · {d} decided", fcLaterGo: "Put all {n} off to “Later”", fcLookOff: "Back to the question",
  fcRoundUndo: "What the round changes is listed in the journal afterwards, where it can be taken back.", fcOpenJournal: "Open the journal", fcFinishTitle: "Done", fcKpiDecided: "Decided", fcKpiOpen: "Still open", fcKpiLater: "On “Later”", fcProgress: "Progress", fcMinutes: "{c} cards, about {n} minutes.", fcFollowsChip: "{n} follow-ups", fcFollowsChip1: "1 follow-up", fcFinishText: "Of {start} open findings, {now} are still open.", fcToFindings: "View open findings",
  firstcleanup: "Cleanup", round: "Cleanup round", firstTitle: "Cleanup", firstSubtitle: "Go through the open findings in five stages.",
  fcOffer: "{n} findings are open. The cleanup goes through them in five stages.", fcBegin: "Begin the cleanup", fcNotNow: "Not now", fcButton: "Cleanup",
  fcIntro: "Five stages cut from topics and impact: first what has many follow-ups, last the quiet rest. You go through the findings card by card and can stop at any time; where you stood is kept.",
 
  fcStageFilter: "Stage {n}: {name}", fcStage: "Stage {n}",
  fcStage1: "Outages with many follow-ups", fcStage1Hint: "One cause clears many follow-ups at once.",
  fcStage2: "Suggestions for marks", fcStage2Hint: "What often goes down is better held by a mark than reported as a finding.",
  fcStage3: "High and medium impact", fcStage3Hint: "Down, broken references and failing automations with impact High or Medium.",
  fcStage4: "Unneeded", fcStage4Hint: "The cleanup round: what is safe to remove together, the rest one by one.",
  fcStage5: "The quiet rest", fcStage5Hint: "Impact Low or Info: put off together to “Later”; it comes back through “Due”.",
  fcRestEyebrow: "The quiet rest", fcRestTitle: "{n} quiet findings", fcRestTitle1: "1 quiet finding", fcRestId: "Impact Low or Info", fcRestWhat: "To put aside", fcRestChip: "Quiet", fcRestNote: "They come back through “Due”; nothing in Home Assistant changes.", fcRestLevels: "{low} Low · {info} Info", fcRestObjects: "Objects", fcRestObjects1: "1 object", fcRestObjectsN: "{n} objects", fcRestBack: "Back in", fcRestDays: "{n} days", fcRestLaterHint: "For the chosen time.",
  fcLaterTitle: "Put the rest off to “Later”?", fcLaterYes: "Put off", fcLaterConfirm: "Put {n} findings off for {days} days? They come back as due afterwards; nothing in Home Assistant changes.", fcLaterReason: "Put off together in the cleanup",
});
