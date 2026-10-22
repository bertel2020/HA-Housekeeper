// FirstCleanupMixin: the first cleanup ("Erstes Aufräumen") as five stages through the open findings. The backend cuts
// the stages and keeps the record for the whole house; every stage opens the normal list with a filter (or the cleanup
// round, or the card of suggestions for marks). Only the last stage writes: it puts the quiet rest off together.
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
  stageCount(n) { return n === 2 ? (this.oftenSuggestions?.() || []).length : this.stageKeys(n).size; }

  openFirstCleanup() {
    this.noteJump("firstcleanup");
    this.view = "firstcleanup"; this.selected = null; this.pages = {};
    this.fcWiz = { step: null, look: false };
    this._fcFor = null; this.ensureFirstCleanup();
    this.render();
  }

  // The offer above the findings: shown while the cleanup has not begun and many findings are open; "Not now" hides it.
  firstCleanupOffer() {
    this.ensureFirstCleanup();
    if (!this.fc?.offered) return "";
    return `<div class="panel fcoffer"><ha-icon icon="mdi:broom"></ha-icon><span class="fctext">${this.t("fcOffer", { n: this.formatNumber(this.fc.open) })}</span><button type="button" class="btn primary" data-fc-begin>${this.t("fcBegin")}</button><button type="button" class="btn quiet" data-fc-dismiss>${this.t("fcNotNow")}</button></div>`;
  }

  // The cleanup as a wizard: one frame (steps, title, back and next) around the normal list, the card of suggestions, the
  // round or the question of stage 5. Step 0 is the welcome, 6 the end. Leaving the pages of the cleanup ends it.
  fcWizOn() {
    if (this.view === "firstcleanup" && !this.fcWiz) this.fcWiz = { step: null, look: false };
    if (!this.fcWiz) return false;
    if (!["findingsNav", "round", "firstcleanup"].includes(this.view)) { this.fcWizEnd(); return false; }
    return true;
  }

  fcWizEnd() {
    if (!this.fcWiz) return;
    this.fcWiz = null; this.findingStage = 0;
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
    this.fcWiz = { step: n, look: false };
    this.selected = null; this.pages = {};
    this.clearFindingFilters(); this.findingStatus = "";
    this.view = n === 4 ? "round" : n === 0 || n === 6 ? "firstcleanup" : "findingsNav";
    if (n === 4) { this.round = { rows: null, picked: new Set(), error: "" }; this.loadRound(); }
    else if (n === 2) (this.folds ||= {}).often = true;
    else if (n === 1 || n === 3) this.findingStage = n;
  }

  fcWizGo(n, record = true) {
    this.fcWizSet(n);
    if (record && n >= 1 && n <= 5) this.firstCleanupSet({ action: "stage", stage: n });
    else this.render();
  }

  // "Next" marks the stage done and goes on; with findings left it asks first.
  fcWizNext() {
    const n = this.fcWiz.step, left = this.stageCount(n);
    const run = async () => {
      await this.firstCleanupSet({ action: "stage", stage: n, done: true });
      if (n === 5) this.fcWizGo(6, false); else this.fcWizGo(n + 1);
    };
    if (left) this.confirmAsk(this.t("fcSkipAsk", { n: this.formatNumber(left) }), run, { title: this.t("fcSkipTitle"), yes: this.t("fcSkipYes"), danger: false });
    else run();
  }

  fcWizExit() {
    this.fcWizEnd();
    this.view = "findingsNav"; this.selected = null; this.pages = {};
    this.clearFindingFilters(); this.findingStatus = this.defaultFindingStatus();
    this.render();
  }

  fcStepper(n) {
    const done = this.fc?.state?.done || [];
    const steps = [1, 2, 3, 4, 5].map(i => {
      const isDone = done.includes(i), back = i < n && n <= 5;
      const cls = `fcstep${isDone ? " done" : ""}${i === n ? " cur" : ""}`;
      const label = this.t("fcStage", { n: i });
      return `<${back ? "button type=\"button\"" : "span"} class="${cls}" ${back ? `data-fc-goto="${i}"` : ""} ${i === n ? "aria-current=\"step\"" : ""} title="${this.esc(`${label} · ${this.t(`fcStage${i}`)}`)}"><b>${isDone ? "✓" : i}</b></${back ? "button" : "span"}>`;
    });
    return `<nav class="fcsteps" aria-label="${this.esc(this.t("fcStepsLabel"))}">${steps.join('<i class="fcline"></i>')}</nav>`;
  }

  fcWelcome() {
    const stages = [1, 2, 3, 4, 5].map(n => `<li><strong>${this.t("fcStage", { n })} · ${this.t(`fcStage${n}`)}</strong><small>${this.t(`fcStage${n}Hint`)}</small></li>`).join("");
    return `<section class="panel fcpanel"><div class="pad"><p>${this.t("fcIntro")}</p><ol class="fclist">${stages}</ol><div class="mbtns"><button type="button" class="btn primary" data-fc-begin>${this.t("fcBegin")}</button></div></div></section>`;
  }

  fcFinish() {
    const state = this.fc.state, left = this.data.findings.filter(f => !f.ignored).length;
    return `<section class="panel fcpanel"><div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon><strong>${this.t("fcFinishTitle")}</strong><br>${this.t("fcFinishText", { start: this.formatNumber(state.start_count), now: this.formatNumber(left) })}</div><div class="pad mbtns"><button type="button" class="btn primary" data-fc-exit>${this.t("fcToFindings")}</button><button type="button" class="btn" data-fc-goto="5">${this.t("fcBack")}</button></div></section>`;
  }

  // Stage 5 asks one question; "Look first" shows the list of the stage in the same frame.
  fcLaterCard(count) {
    if (!count) return `<section class="panel fcpanel"><div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("fcNothing")}</div></section>`;
    const days = this.esc(this.fcDays ?? this.fc.later_days);
    return `<section class="panel fcpanel"><div class="pad"><p>${this.t("fcLaterAsk", { n: this.formatNumber(count) })}</p><div class="mbtns"><button type="button" class="btn primary" data-fc-later>${this.t("fcLaterGo", { n: this.formatNumber(count) })}</button><label class="fcdays">${this.t("fcLaterDays")} <input type="number" min="1" max="3650" value="${days}" data-fc-days></label><button type="button" class="btn quiet" data-fc-look="1">${this.t("fcLook")}</button></div></div></section>`;
  }

  wizardView() {
    this.ensureFirstCleanup();
    const fc = this.fc;
    if (!fc) return `<div class="stack"><section class="panel"><div class="pad"><small>${this.t("loading")}</small></div></section></div>`;
    if (this.fcWiz.step === null) this.fcWizSet(this.fcResumeStep());
    const n = this.fcWiz.step, error = fc.error ? this.notice("warn", this.esc(fc.error)) : "";
    if (n === 0) return `<div class="stack">${error}${this.fcWelcome()}</div>`;
    const state = fc.state || { done: [] }, left = this.data.findings.filter(f => !f.ignored).length;
    const counter = `<span class="fccounter">${this.t("fcCounter", { start: this.formatNumber(state.start_count), now: this.formatNumber(left) })}</span>`;
    const top = `<div class="fctop">${this.fcStepper(n)}${counter}</div>`;
    if (n === 6) return `<div class="stack">${error}${top}${this.fcFinish()}</div>`;
    const count = this.stageCount(n), look = n === 5 && this.fcWiz.look;
    const head = `<section class="panel fchead"><div class="pad"><small class="fceyebrow">${this.t("fcStageOf", { n })}</small><h2>${this.t(`fcStage${n}`)} <span class="fcleft">${this.t("fcLeft", { n: this.formatNumber(count) })}</span></h2><p>${this.t(`fcStage${n}Hint`)}</p></div></section>`;
    let body;
    if (n === 4) body = this.roundView();
    else if (n === 2) body = this.oftenCard() || `<section class="panel fcpanel"><div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("fcNothing")}</div></section>`;
    else if (n === 5 && !look) body = this.fcLaterCard(count);
    else body = this.findingsView();
    const lookOff = look ? `<button type="button" class="btn quiet" data-fc-look="0">${this.t("fcLookOff")}</button>` : "";
    const next = count
      ? `<button type="button" class="btn" data-fc-next>${this.t("fcSkip")}</button>`
      : `<button type="button" class="btn primary" data-fc-next>${this.t(n === 5 ? "fcFinish" : "fcNextStage", { n: n + 1 })}</button>`;
    const foot = `<div class="panel fcfoot"><button type="button" class="btn" data-fc-goto="${n - 1}" ${n === 1 ? "disabled" : ""}><ha-icon icon="mdi:arrow-left"></ha-icon>${this.t("fcBack")}</button><span class="fcprogress">${count ? this.t("fcLeftNow", { n: this.formatNumber(count) }) : this.t("fcStageClear")}</span>${lookOff}${next}<button type="button" class="btn quiet" data-fc-exit>${this.t("fcExit")}</button></div>`;
    return `<div class="stack">${error}${top}${head}${body}${foot}</div>`;
  }

  bindFirstCleanup(root) {
    root.querySelectorAll("[data-fc-begin]").forEach(el => el.onclick = async () => { await this.firstCleanupSet({ action: "begin" }); this.openFirstCleanup(); });
    root.querySelector("[data-fc-dismiss]")?.addEventListener("click", () => this.firstCleanupSet({ action: "dismiss" }));
    root.querySelectorAll("[data-fc-open]").forEach(el => el.onclick = () => this.openFirstCleanup());
    root.querySelectorAll("[data-fc-goto]").forEach(el => el.onclick = () => this.fcWizGo(Number(el.dataset.fcGoto), Number(el.dataset.fcGoto) >= 1 && Number(el.dataset.fcGoto) <= 5));
    root.querySelector("[data-fc-next]")?.addEventListener("click", () => this.fcWizNext());
    root.querySelectorAll("[data-fc-exit]").forEach(el => el.onclick = () => this.fcWizExit());
    root.querySelectorAll("[data-fc-look]").forEach(el => el.onclick = () => {
      this.fcWiz.look = el.dataset.fcLook === "1"; this.findingStage = this.fcWiz.look ? 5 : 0; this.pages = {}; this.render();
    });
    root.querySelector("[data-fc-days]")?.addEventListener("change", e => { this.fcDays = Math.max(1, Math.min(3650, Number(e.target.value) || this.fc.later_days)); });
    root.querySelector("[data-fc-later]")?.addEventListener("click", () => this.fcLater());
  }

  // Stage 5: the rest goes to "Later" with a date; it comes back through "Due". Housekeeper's own list only.
  fcLater() {
    const n = this.stageCount(5), days = this.fcDays ?? this.fc.later_days;
    if (n) this.confirmAsk(this.t("fcLaterConfirm", { n: this.formatNumber(n), days }), () => this.fcLaterRun(days), { title: this.t("fcLaterTitle"), yes: this.t("fcLaterYes"), danger: false });
  }

  async fcLaterRun(days) {
    try {
      const reply = await this._hass.callWS({ type: "ha_housekeeper/first_cleanup_later", days, reason: this.t("fcLaterReason") });
      this.fc = { ...reply, error: "" };
      await this.refreshData?.();
    } catch (err) { this.fc = { ...this.fc, error: this.errText(err) }; }
    this.render();
  }
}
Object.assign(TEXT.de, {
  fcStageOf: "Etappe {n} von 5", fcSkip: "Überspringen", fcNextStage: "Weiter zu Etappe {n}", fcFinish: "Abschließen", fcBack: "Zurück", fcExit: "Rundgang beenden",
  fcLeft: "{n} offen", fcLeftNow: "{n} offen in dieser Etappe", fcStageClear: "Etappe geschafft", fcNothing: "Hier ist nichts zu tun.", fcStepsLabel: "Etappen",
  fcSkipTitle: "Etappe verlassen?", fcSkipAsk: "In dieser Etappe sind noch {n} offen. Trotzdem weiter?", fcSkipYes: "Weiter",
  fcCounter: "Begonnen mit {start}, jetzt {now} offen", fcLaterGo: "Alle {n} auf „Später“ legen", fcLook: "Erst ansehen", fcLookOff: "Zurück zur Frage",
  fcLaterAsk: "{n} ruhige Befunde mit Wirkung Niedrig oder Info zurückstellen? Sie kommen nach den gewählten Tagen als fällig zurück; nichts an Home Assistant ändert sich.",
  fcFinishTitle: "Fertig", fcFinishText: "Von {start} offenen Befunden sind noch {now} offen.", fcToFindings: "Zu den Befunden",
  firstcleanup: "Erstes Aufräumen", round: "Aufräum-Runde", firstTitle: "Erstes Aufräumen", firstSubtitle: "Die offenen Befunde in fünf Etappen durchgehen.",
  fcOffer: "{n} Befunde sind offen. Das erste Aufräumen geht sie in fünf Etappen durch.", fcBegin: "Erstes Aufräumen beginnen", fcNotNow: "Nicht jetzt", fcButton: "Erstes Aufräumen",
  fcIntro: "Fünf Etappen aus Themen und Wirkung: zuerst, was viele Folgen hat, zuletzt der ruhige Rest. Jede Etappe öffnet die normale Liste; du kannst jederzeit aufhören, der Stand bleibt.",
 
  fcStageFilter: "Etappe {n}: {name}", fcStage: "Etappe {n}",
  fcStage1: "Ausfälle mit vielen Folgen", fcStage1Hint: "Eine Ursache beseitigt viele Folgen auf einmal.",
  fcStage2: "Vorschläge für Vermerke", fcStage2Hint: "Was oft ausfällt, bekommt besser einen Vermerk als einen Befund.",
  fcStage3: "Hohe und mittlere Wirkung", fcStage3Hint: "Ausgefallen, kaputte Verweise und fehlerhafte Automationen mit Wirkung Hoch oder Mittel.",
  fcStage4: "Überflüssiges", fcStage4Hint: "Die Aufräum-Runde: sicher Entfernbares gesammelt, der Rest einzeln.",
  fcStage5: "Der ruhige Rest", fcStage5Hint: "Wirkung Niedrig oder Info: gesammelt auf „Später“; es kommt über „Fällig“ zurück.",
  fcLaterTitle: "Rest auf „Später“ legen?", fcLaterYes: "Auf „Später“ legen", fcLaterDays: "Tage",  fcLaterConfirm: "{n} Befunde für {days} Tage auf „Später“ legen? Sie kommen danach als fällig zurück; nichts an Home Assistant ändert sich.", fcLaterReason: "Im ersten Aufräumen gesammelt zurückgestellt",
});
Object.assign(TEXT.en, {
  fcStageOf: "Stage {n} of 5", fcSkip: "Skip", fcNextStage: "On to stage {n}", fcFinish: "Finish", fcBack: "Back", fcExit: "End the tour",
  fcLeft: "{n} open", fcLeftNow: "{n} open in this stage", fcStageClear: "Stage done", fcNothing: "Nothing to do here.", fcStepsLabel: "Stages",
  fcSkipTitle: "Leave the stage?", fcSkipAsk: "{n} are still open in this stage. Go on anyway?", fcSkipYes: "Go on",
  fcCounter: "Started with {start}, {now} open now", fcLaterGo: "Put all {n} off to “Later”", fcLook: "Look first", fcLookOff: "Back to the question",
  fcLaterAsk: "Put off {n} quiet findings with impact Low or Info? They come back as due after the days chosen; nothing in Home Assistant changes.",
  fcFinishTitle: "Done", fcFinishText: "Of {start} open findings, {now} are still open.", fcToFindings: "To the findings",
  firstcleanup: "First cleanup", round: "Cleanup round", firstTitle: "First cleanup", firstSubtitle: "Go through the open findings in five stages.",
  fcOffer: "{n} findings are open. The first cleanup goes through them in five stages.", fcBegin: "Begin the first cleanup", fcNotNow: "Not now", fcButton: "First cleanup",
  fcIntro: "Five stages cut from topics and impact: first what has many follow-ups, last the quiet rest. Every stage opens the normal list; you can stop at any time and the stage is kept.",
 
  fcStageFilter: "Stage {n}: {name}", fcStage: "Stage {n}",
  fcStage1: "Outages with many follow-ups", fcStage1Hint: "One cause clears many follow-ups at once.",
  fcStage2: "Suggestions for marks", fcStage2Hint: "What often goes down is better held by a mark than reported as a finding.",
  fcStage3: "High and medium impact", fcStage3Hint: "Down, broken references and failing automations with impact High or Medium.",
  fcStage4: "Unneeded", fcStage4Hint: "The cleanup round: what is safe to remove together, the rest one by one.",
  fcStage5: "The quiet rest", fcStage5Hint: "Impact Low or Info: put off together to “Later”; it comes back through “Due”.",
  fcLaterTitle: "Put the rest off to “Later”?", fcLaterYes: "Put off", fcLaterDays: "Days",  fcLaterConfirm: "Put {n} findings off for {days} days? They come back as due afterwards; nothing in Home Assistant changes.", fcLaterReason: "Put off together in the first cleanup",
});
