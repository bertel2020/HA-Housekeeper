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
      if (["findingsNav", "firstcleanup"].includes(this.view) && !this.selected) this.render();
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
    this._fcFor = null; this.ensureFirstCleanup();
    this.render();
  }

  // A stage opens the normal list: the keys of the stage as a filter, the card of suggestions for stage 2, the round for 4.
  openStage(n) {
    this.firstCleanupSet({ action: "stage", stage: n });
    if (n === 4) { this.openRound(); return; }
    this.noteJump("findingsNav");
    this.view = "findingsNav"; this.pages = {}; this.selected = null;
    this.clearFindingFilters(); this.findingStatus = "";
    if (n === 2) (this.folds ||= {}).often = true; else this.findingStage = n;
    this.render();
  }

  // The offer above the findings: shown while the cleanup has not begun and many findings are open; "Not now" hides it.
  firstCleanupOffer() {
    this.ensureFirstCleanup();
    if (!this.fc?.offered) return "";
    return `<div class="panel fcoffer"><ha-icon icon="mdi:broom"></ha-icon><span class="fctext">${this.t("fcOffer", { n: this.formatNumber(this.fc.open) })}</span><button type="button" class="btn primary" data-fc-begin>${this.t("fcBegin")}</button><button type="button" class="btn quiet" data-fc-dismiss>${this.t("fcNotNow")}</button></div>`;
  }

  fcStageRow(n, state) {
    const count = this.stageCount(n), done = state.done.includes(n), current = state.stage === n && !done;
    const later = n === 5 && count ? `<label class="fcdays">${this.t("fcLaterDays")} <input type="number" min="1" max="3650" value="${this.esc(this.fcDays ?? this.fc.later_days)}" data-fc-days></label><button type="button" class="btn" data-fc-later>${this.t("fcLaterAll", { n: this.formatNumber(count) })}</button>` : "";
    const open = n === 5 ? "" : `<button type="button" class="btn" data-fc-stage="${n}">${this.t("fcOpen")}</button>`;
    const mark = `<button type="button" class="btn quiet" data-fc-done="${n}" data-fc-undo="${done ? 1 : 0}">${this.t(done ? "fcReopen" : "fcDone")}</button>`;
    const list = n === 5 && count ? `<button type="button" class="btn quiet" data-fc-stage="5">${this.t("fcOpen")}</button>` : "";
    return `<div class="row${done ? " fcdone" : ""}"><ha-icon icon="${done ? "mdi:check-circle" : current ? "mdi:arrow-right-circle-outline" : "mdi:circle-outline"}"></ha-icon><span class="row-text"><strong>${this.t("fcStage", { n })} · ${this.t(`fcStage${n}`)} (${this.formatNumber(count)})</strong><small>${this.t(`fcStage${n}Hint`)}</small></span>${later}${list}${open}${mark}</div>`;
  }

  firstCleanupView() {
    this.ensureFirstCleanup();
    const back = `<div class="pad"><button class="btn" data-action="view-back">${this.t("fixBack")}</button></div>`;
    const fc = this.fc;
    if (!fc) return `<div class="stack"><section class="panel"><div class="pad"><small>${this.t("loading")}</small></div></section>${back}</div>`;
    const state = fc.state || { done: [] }, error = fc.error ? this.notice("warn", this.esc(fc.error)) : "";
    const left = this.data.findings.filter(f => !f.ignored).length;
    const head = state.started_at
      ? `<p>${this.t("fcProgress", { date: this.formatDate(state.started_at), start: this.formatNumber(state.start_count), now: this.formatNumber(left), done: this.formatNumber(state.done.length) })}</p>${state.finished_at ? `<p>${this.t("fcFinished", { date: this.formatDate(state.finished_at) })}</p>` : ""}`
      : `<p>${this.t("fcIntro")}</p><div class="mbtns"><button type="button" class="btn primary" data-fc-begin>${this.t("fcBegin")}</button></div>`;
    const rows = state.started_at ? [1, 2, 3, 4, 5].map(n => this.fcStageRow(n, state)).join("") : "";
    return `<div class="stack">${error}<section class="panel"><div class="panelhead"><div><h2>${this.t("firstTitle")}</h2>${head}</div></div>${rows}</section>${back}</div>`;
  }

  bindFirstCleanup(root) {
    root.querySelectorAll("[data-fc-begin]").forEach(el => el.onclick = async () => { await this.firstCleanupSet({ action: "begin" }); this.openFirstCleanup(); });
    root.querySelector("[data-fc-dismiss]")?.addEventListener("click", () => this.firstCleanupSet({ action: "dismiss" }));
    root.querySelectorAll("[data-fc-open]").forEach(el => el.onclick = () => this.openFirstCleanup());
    root.querySelectorAll("[data-fc-stage]").forEach(el => el.onclick = () => this.openStage(Number(el.dataset.fcStage)));
    root.querySelectorAll("[data-fc-done]").forEach(el => el.onclick = () => this.firstCleanupSet({ action: "stage", stage: Number(el.dataset.fcDone), done: el.dataset.fcUndo !== "1" }));
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
  firstcleanup: "Erstes Aufräumen", round: "Aufräum-Runde", firstTitle: "Erstes Aufräumen", firstSubtitle: "Die offenen Befunde in fünf Etappen durchgehen.",
  fcOffer: "{n} Befunde sind offen. Das erste Aufräumen geht sie in fünf Etappen durch.", fcBegin: "Erstes Aufräumen beginnen", fcNotNow: "Nicht jetzt", fcButton: "Erstes Aufräumen",
  fcIntro: "Fünf Etappen aus Themen und Wirkung: zuerst, was viele Folgen hat, zuletzt der ruhige Rest. Jede Etappe öffnet die normale Liste; du kannst jederzeit aufhören, der Stand bleibt.",
  fcProgress: "Begonnen am {date} mit {start} offenen Befunden, jetzt {now} offen, {done} von 5 Etappen erledigt.", fcFinished: "Fertig am {date}.",
  fcStageFilter: "Etappe {n}: {name}", fcStage: "Etappe {n}", fcOpen: "Öffnen", fcDone: "Erledigt", fcReopen: "Wieder öffnen",
  fcStage1: "Ausfälle mit vielen Folgen", fcStage1Hint: "Eine Ursache beseitigt viele Folgen auf einmal.",
  fcStage2: "Vorschläge für Vermerke", fcStage2Hint: "Was oft ausfällt, bekommt besser einen Vermerk als einen Befund.",
  fcStage3: "Hohe und mittlere Wirkung", fcStage3Hint: "Ausgefallen, kaputte Verweise und fehlerhafte Automationen mit Wirkung Hoch oder Mittel.",
  fcStage4: "Überflüssiges", fcStage4Hint: "Die Aufräum-Runde: sicher Entfernbares gesammelt, der Rest einzeln.",
  fcStage5: "Der ruhige Rest", fcStage5Hint: "Wirkung Niedrig oder Info: gesammelt auf „Später“; es kommt über „Fällig“ zurück.",
  fcLaterTitle: "Rest auf „Später“ legen?", fcLaterYes: "Auf „Später“ legen", fcLaterDays: "Tage", fcLaterAll: "Alle {n} auf „Später“", fcLaterConfirm: "{n} Befunde für {days} Tage auf „Später“ legen? Sie kommen danach als fällig zurück; nichts an Home Assistant ändert sich.", fcLaterReason: "Im ersten Aufräumen gesammelt zurückgestellt",
});
Object.assign(TEXT.en, {
  firstcleanup: "First cleanup", round: "Cleanup round", firstTitle: "First cleanup", firstSubtitle: "Go through the open findings in five stages.",
  fcOffer: "{n} findings are open. The first cleanup goes through them in five stages.", fcBegin: "Begin the first cleanup", fcNotNow: "Not now", fcButton: "First cleanup",
  fcIntro: "Five stages cut from topics and impact: first what has many follow-ups, last the quiet rest. Every stage opens the normal list; you can stop at any time and the stage is kept.",
  fcProgress: "Begun on {date} with {start} open findings, {now} open now, {done} of 5 stages done.", fcFinished: "Finished on {date}.",
  fcStageFilter: "Stage {n}: {name}", fcStage: "Stage {n}", fcOpen: "Open", fcDone: "Done", fcReopen: "Reopen",
  fcStage1: "Outages with many follow-ups", fcStage1Hint: "One cause clears many follow-ups at once.",
  fcStage2: "Suggestions for marks", fcStage2Hint: "What often goes down is better held by a mark than reported as a finding.",
  fcStage3: "High and medium impact", fcStage3Hint: "Down, broken references and failing automations with impact High or Medium.",
  fcStage4: "Unneeded", fcStage4Hint: "The cleanup round: what is safe to remove together, the rest one by one.",
  fcStage5: "The quiet rest", fcStage5Hint: "Impact Low or Info: put off together to “Later”; it comes back through “Due”.",
  fcLaterTitle: "Put the rest off to “Later”?", fcLaterYes: "Put off", fcLaterDays: "Days", fcLaterAll: "Put all {n} off", fcLaterConfirm: "Put {n} findings off for {days} days? They come back as due afterwards; nothing in Home Assistant changes.", fcLaterReason: "Put off together in the first cleanup",
});
