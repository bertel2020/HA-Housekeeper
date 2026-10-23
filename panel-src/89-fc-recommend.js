// FcRecommendMixin: the row "Recommendation" of a card of the cleanup, and the way "Fix" unfolds in the card. The
// recommendation is worked out from the facts the card shows (how long, what hangs on it, how often, what uses it), is
// always exactly one of the answers of that card with its reason, and decides nothing: the person clicks. "Keep"
// ("Ist so gewollt") is never recommended by itself. Mixed into the panel in 99-register.js.
Object.assign(TEXT.de, {
  fcRecLabel: "Empfehlung", fcRecTag: "Empfohlen",
  fcRecFix: "Beheben.", fcRecLater: "Später erinnern.", fcRecTake: "Vermerk setzen.", fcRecPick: "Zum Entfernen vormerken.", fcRecPickAll: "Alle vormerken.", fcRecMerge: "Zusammenführen.", fcRecRest: "Auf „Später“ legen.",
  fcRecFixBroken: "Ein kaputter Verweis oder Fehler geht nicht von selbst weg.",
  fcRecFixNoSince: "Seit wann es besteht, ist nicht bekannt; lieber jetzt ansehen.",
  fcRecFixLong: "Seit {span} aus, die Wirkung ist schon Mittel oder höher.",
  fcRecFixFollows: "{n} Folgen hängen daran; eine Ursache löst sie alle.",
  fcRecLaterShort: "Wird es schlimmer, kommt es von selbst zurück: seit {span} aus, die nächste Stufe ({level}) beginnt in {next}",
  fcRecLaterOften: "Es fällt immer wieder aus; ein einzelner Ausfall sagt wenig. Für ein wiederkehrendes Muster passt ein Vermerk (Etappe 2).",
  fcRecTakeText: "Das Muster wiederholt sich ({n} Ausfälle in {days} Tagen); der Vermerk blendet es aus, bis es sich ändert.",
  fcRecTakeGeneric: "Das Muster wiederholt sich; ein Vermerk blendet es aus, statt jedes Mal einen Befund zu melden.",
  fcRecPickSafe: "Nichts verweist darauf. Es läuft erst am Ende als ein Plan mit Vorschau und Backup.",
  fcRecLaterLook: "Hier spricht etwas dagegen ({reason}). Erst ansehen, später entscheiden.",
  fcRecLaterLookNone: "Hier spricht etwas dagegen. Erst ansehen, später entscheiden.",
  fcRecMergeText: "Es ist ein Duplikat von {name}; Zusammenführen räumt es sauber auf.",
  fcRecPickAllText: "Nichts verweist darauf. Es läuft erst am Ende als ein Plan mit Vorschau und Backup.",
  fcRecRestText: "{n} Befunde mit niedriger Wirkung oder Info, nichts ist zu tun und an Home Assistant ändert sich nichts. Sie kommen nach {days} Tagen zurück.",
  fcFixWaysHead: "Wege zum Beheben", fcFixObject: "Zum Objekt", fcFixObjectHint: "Selbst ansehen und lösen. Von dort kommst du hierher zurück.",
  fcPlanPreview: "Vorschau", fcPlanPreviewHead: "Das wird geändert", fcPlanNothingYet: "Noch ist nichts geändert. Erst „Ausführen“ ändert etwas; vorher wird ein Backup gemacht, und du kannst es danach rückgängig machen.", fcPlanRun: "Ausführen", fcPlanRunning: "Läuft …", fcPlanRunningText: "Housekeeper führt es aus und prüft danach nach.", fcPlanDone: "Erledigt und nachgeprüft", fcPlanCheckFailed: "Ausgeführt, aber die Nachprüfung meldet eine Abweichung", fcPlanAborted: "Nichts geändert", fcPlanUndone: "Rückgängig gemacht", fcPlanOk: "Weiter",
  fcRecNoFixFollows: "{n} Folgen hängen daran. Housekeeper kann hier nichts reparieren; ist es absichtlich aus, stellt ein Vermerk den Ausfall samt Folgen still.",
  fcRecNoFixLong: "Seit {span} aus, und Housekeeper kann hier nichts reparieren. Ist es absichtlich aus, passt ein Vermerk; sonst sieh nach dem Gerät.",
  fcRecNoFixNoSince: "Seit wann es besteht, ist nicht bekannt, und Housekeeper kann hier nichts reparieren. Ist es absichtlich aus, passt ein Vermerk.",
  fcFixNone: "Für diesen Befund führt Housekeeper keinen Schritt aus; die Seite des Objekts zeigt, was du in Home Assistant tun kannst.",
});
Object.assign(TEXT.en, {
  fcRecLabel: "Recommendation", fcRecTag: "Recommended",
  fcRecFix: "Fix.", fcRecLater: "Remind me later.", fcRecTake: "Set a mark.", fcRecPick: "Mark for removal.", fcRecPickAll: "Mark them all.", fcRecMerge: "Merge.", fcRecRest: "Put off to “Later”.",
  fcRecFixBroken: "A broken reference or a fault does not go away by itself.",
  fcRecFixNoSince: "It is not known since when this has been the case; better to look at it now.",
  fcRecFixLong: "Down for {span}, the impact is already medium or higher.",
  fcRecFixFollows: "{n} findings hang on it; one cause solves them all.",
  fcRecLaterShort: "If it gets worse, it comes back by itself: down for {span}, the next level ({level}) starts in {next}",
  fcRecLaterOften: "It keeps failing; a single outage says little. For a recurring pattern a mark fits (stage 2).",
  fcRecTakeText: "The pattern repeats ({n} outages in {days} days); the mark hides it until it changes.",
  fcRecTakeGeneric: "The pattern repeats; a mark hides it instead of reporting a finding every time.",
  fcRecPickSafe: "Nothing refers to it. It only runs at the end as one plan with preview and backup.",
  fcRecLaterLook: "Something speaks against it ({reason}). Look at it first, decide later.",
  fcRecLaterLookNone: "Something speaks against it. Look at it first, decide later.",
  fcRecMergeText: "It is a duplicate of {name}; merging tidies it up cleanly.",
  fcRecPickAllText: "Nothing refers to them. It only runs at the end as one plan with preview and backup.",
  fcRecRestText: "{n} findings with low impact or info, nothing to do and nothing changes in Home Assistant. They come back after {days} days.",
  fcFixWaysHead: "Ways to fix it", fcFixObject: "Go to the object", fcFixObjectHint: "Look at it and solve it yourself. You come back here from there.",
  fcPlanPreview: "Preview", fcPlanPreviewHead: "This will be changed", fcPlanNothingYet: "Nothing is changed yet. Only “Run” changes something; a backup is made first, and you can undo it afterwards.", fcPlanRun: "Run", fcPlanRunning: "Running …", fcPlanRunningText: "Housekeeper is running it and checks afterwards.", fcPlanDone: "Done and checked", fcPlanCheckFailed: "Run, but the check afterwards reports a difference", fcPlanAborted: "Nothing changed", fcPlanUndone: "Undone", fcPlanOk: "Continue",
  fcRecNoFixFollows: "{n} findings hang on it. Housekeeper cannot repair anything here; if it is off on purpose, a mark silences the outage with everything that follows.",
  fcRecNoFixLong: "Down for {span}, and Housekeeper cannot repair anything here. If it is off on purpose, a mark fits; otherwise look at the device.",
  fcRecNoFixNoSince: "It is not known since when this has been the case, and Housekeeper cannot repair anything here. If it is off on purpose, a mark fits.",
  fcFixNone: "Housekeeper runs no step for this finding; the page of the object shows what you can do in Home Assistant.",
});

class FcRecommendMixin {
  // A card of stage 1 or 3: a finding with its object. Returns { act, head, body }; `act` names the answer that is recommended.
  fcRecCard(f, key) {
    const t = (k, p) => this.t(k, p);
    const cause = this.causeList().find(c => c.finding_key === f.key);
    const outage = Boolean(cause) || OUTAGE_RULES.includes(f.rule_id);
    if (!outage) return { act: "fix", head: t("fcRecFix"), body: t("fcRecFixBroken") };
    // "Fix" is only recommended where Housekeeper has a way to fix it; an outage it cannot repair gets the mark instead.
    const fixable = this.fcFixable(f, key), obj = this.findObject(key);
    const instead = body => (this.fcCanMark(obj) ? { act: "mark", head: t("fcRecTake"), body } : { act: "later", head: t("fcRecLater"), body });
    const followers = this.fcFollowers(f), since = Date.parse(f.first_detected_at);
    if (followers >= 5) return fixable ? { act: "fix", head: t("fcRecFix"), body: t("fcRecFixFollows", { n: this.formatNumber(followers) }) } : instead(t("fcRecNoFixFollows", { n: this.formatNumber(followers) }));
    if (!since) return fixable ? { act: "fix", head: t("fcRecFix"), body: t("fcRecFixNoSince") } : instead(t("fcRecNoFixNoSince"));
    const hours = Math.max(0, (Date.now() - since) / 3600000), steps = this.outageSteps();
    if (hours >= (steps.find(([id]) => id === "medium") || [0, 24])[1]) return fixable ? { act: "fix", head: t("fcRecFix"), body: t("fcRecFixLong", { span: this.spanText(hours) }) } : instead(t("fcRecNoFixLong", { span: this.spanText(hours) }));
    if (this.oftenFor?.(f)) return { act: "later", head: t("fcRecLater"), body: t("fcRecLaterOften") };
    const next = steps.find(([, at]) => at > hours);
    return { act: "later", head: t("fcRecLater"), body: next ? t("fcRecLaterShort", { span: this.spanText(hours), level: t(`chip_${next[0]}`), next: this.spanText(next[1] - hours) }) : t("fcRecLaterOften") };
  }

  // Whether Housekeeper has a way of its own for this finding: a plan it runs, or the faults it guides through (a broken
  // reference, a failing automation, an integration or app that is down). A device that is merely offline has none.
  fcFixable(f, key) {
    const obj = this.findObject(key);
    if (!obj) return false;
    if (f.classification === "broken_reference" || f.topic === "failing_automations") return true;
    if (["config_entry.not_loaded", "config_entry.reauth", "app.stopped_in_use"].includes(f.rule_id)) return true;
    return this.fixItems(obj, key).items.some(it => it.plan);
  }

  // A suggestion of stage 2: always "set the mark"; the reason names the pattern.
  fcRecOften(item) {
    const info = item.often?.info || {}, t = (k, p) => this.t(k, p);
    return { act: "take", head: t("fcRecTake"), body: info.episodes ? t("fcRecTakeText", { n: this.formatNumber(info.episodes), days: item.often?.days || "" }) : t("fcRecTakeGeneric") };
  }

  // One object of stage 4: a duplicate merges, what nothing uses is marked, the rest is looked at first.
  fcRecRound(r) {
    const t = (k, p) => this.t(k, p);
    if (r.kind === "merge") return { act: "merge", head: t("fcRecMerge"), body: t("fcRecMergeText", { name: r.duplicate_of || "?" }) };
    if (r.group === "safe") return { act: "pick", head: t("fcRecPick"), body: t("fcRecPickSafe") };
    const reason = (r.reasons || []).filter(x => x !== "config_rewrite").map(x => t(`reason_${x}`))[0];
    return { act: "later", head: t("fcRecLater"), body: reason ? t("fcRecLaterLook", { reason }) : t("fcRecLaterLookNone") };
  }

  fcRecSafe() { return { act: "pick", head: this.t("fcRecPickAll"), body: this.t("fcRecPickAllText") }; }

  fcRecRest(count, days) { return { act: "rest", head: this.t("fcRecRest"), body: this.t("fcRecRestText", { n: this.formatNumber(count), days }) }; }

  // The row for fcInfoHtml.
  fcRecRow(rec) { return { id: "rec", rec: true, label: this.t("fcRecLabel"), head: rec.head, text: rec.body, empty: false, tab: "" }; }

  // One way of an object as a row: its name, what it does, and the preview of its plan (or the old "Open").
  fcWayRow(it, key) {
    return `<div class="fcway"><span class="fcii fcii-blue"><ha-icon icon="${this.esc(it.icon)}"></ha-icon></span><span class="fctxt"><strong>${it.label}</strong><small>${this.t(it.hint)}</small></span>${it.plan ? `<button type="button" class="btn primary" data-fc-plan="${this.esc(JSON.stringify(it.plan))}" data-key="${this.esc(key)}"${this.planBusy ? " disabled" : ""}>${this.t("fcPlanPreview")}</button>` : `<button type="button" class="btn" ${it.attr}>${this.t("actOpen")}</button>`}</div>`;
  }

  // The ways of "Fix" for one object, unfolded in the card: what Housekeeper can do for it, and the page of the object.
  fcFixWays(key, obj) {
    if (!obj || this.fcFixOpen !== key || this.fcPlanKey) return "";
    const items = this.fixItems(obj, key).items;
    // The ways of the finding itself (replace the target, remove the reference, catch the error), as on the page Fix.
    const finding = this.data?.findings?.find(x => x.key === this.fixKey && (this.findingKey(x) === key || this.ownerKey(x) === key));
    const own = finding && this.fixWays ? this.fixWays.filter(w => w.kind !== "panel" && w.way !== "mark").map(w => this.fixWayCard(w, finding)).join("") : "";
    const rows = items.map(it => this.fcWayRow(it, key)).join("") + own;
    const object = `<div class="fcway"><span class="fcii fcii-mute"><ha-icon icon="mdi:open-in-new"></ha-icon></span><span class="fctxt"><strong>${this.t("fcFixObject")}</strong><small>${this.t("fcFixObjectHint")}</small></span><button type="button" class="btn quiet" data-fc-object="${this.esc(key)}">${this.t("actOpen")}</button></div>`;
    return `<div class="fcways"><small class="fceyebrow">${this.t("fcFixWaysHead")}</small>${rows}${object}${rows ? "" : `<p class="fcfacts">${this.t("fcFixNone")}</p>`}</div>`;
  }

  // A way that Housekeeper can run on its own is judged in the card: the preview, one click to run it, the check afterwards.
  async fcPlanStart(key, req) {
    if (this.planBusy) return;
    this.planBusy = true; this.fcPlanError = ""; this.render();
    try {
      const plan = await this._hass.callWS({ type: "ha_housekeeper/plan_create", actions: Array.isArray(req) ? req : [req] });
      this.openNewPlan(plan, "card"); this.planChanges = null; this.cleanupError = "";
      this.fcPlanKey = key; this.fcPlanReq = req;
      if (this.view === "fix") this.fixGo(2);
    } catch (err) { this.fcPlanError = this.errText(err); }
    this.planBusy = false; this.render();
  }

  async fcPlanRun() {
    if (!this.plan || this.cleanupBusy) return;
    await this.confirmAndRun();
    if (this.cleanupError) this.fcPlanError = this.cleanupError;
    this.render();
  }

  async fcPlanDrop() {
    const open = this.plan && this.isOpenPreview(this.plan);
    this.fcPlanKey = ""; this.fcPlanReq = null; this.fcPlanError = "";
    if (this.view === "fix") { if (open) this.fixGo(1); else { this.fixGo(3); this.startFixWatch(); } }
    if (open) await this.discardPlan(); else { this.plan = null; this.render(); }
  }

  // The plan of the card: the preview with its one button, then the progress, then the result with the way back.
  fcPlanBlock() {
    const plan = this.plan, key = this.fcPlanKey;
    if (!key) return this.fcPlanError ? `<section class="panel fcplan"><div class="pad"><div class="error">${this.esc(this.fcPlanError)}</div></div></section>` : "";
    if (!plan) return "";
    const obj = this.findObject(key), name = this.esc(obj?.name || plan.actions[0]?.name || key);
    const status = plan.status || "dry_run", acts = plan.actions;
    const run = acts.filter(a => a.executable), t = (k, p) => this.t(k, p);
    const reasons = a => (a.reasons || []).map(r => t(`reason_${r}`)).join(" ");
    const rows = acts.map(a => `<li><strong>${this.esc(a.name || a.object_id)}</strong><small>${this.esc([a.kind === "replace_references" ? `${a.object_id} → ${a.target || "?"}` : "", reasons(a)].filter(Boolean).join(" · "))}</small></li>`).join("");
    const used = acts.reduce((n, a) => n + (a.used_by || []).length, 0);
    const error = this.fcPlanError ? `<div class="error">${this.esc(this.fcPlanError)}</div>` : "";
    const changed = this.planChanges?.length ? `<p class="fcfacts">${t("planChangedTitle")}</p>` : "";
    let head, body, btns;
    const drop = (label = "confirmCancel") => `<button type="button" class="btn" data-fc-plan-drop>${t(label)}</button>`;
    if (status === "dry_run") {
      head = t("fcPlanPreviewHead");
      body = `<ul class="fcplanrows">${rows}</ul>${used ? `<p class="fcfacts">${t("planUses", { count: used })}</p>` : ""}<p class="fcfacts">${t(run.length ? "fcPlanNothingYet" : "nothingExecutable")}</p>${changed}`;
      btns = `${run.length ? `<button type="button" class="btn primary" data-fc-plan-run${this.cleanupBusy ? " disabled" : ""}>${t("fcPlanRun")}</button>` : ""}${drop()}`;
    } else if (status === "backup" || status === "running" || (status === "executed" && !plan.verification)) {
      head = t("fcPlanRunning");
      body = `${this.planProgressBar()}<p class="fcfacts">${t(status === "backup" ? "backupRunning" : "fcPlanRunningText")}</p>`;
      btns = "";
    } else {
      const done = acts.some(a => a.result?.state === "done"), undone = !done && acts.some(a => a.result?.state === "undone");
      const ok = done && (!plan.verification || plan.verification.ok);
      head = t(undone ? "fcPlanUndone" : ok ? "fcPlanDone" : done ? "fcPlanCheckFailed" : "fcPlanAborted");
      const stop = acts.map(a => a.result?.state === "not_run" ? t(`abort_${a.result.reason}`) : a.result?.stopped ? t(`abort_${a.result.stopped}`) : "").filter(Boolean)[0];
      const checks = plan.verification ? `<div class="checkrow">${plan.verification.checks.map(c => `<span class="pill ${c.ok ? "ok" : "red"}">${c.ok ? "✓" : "✗"} ${t(`check_${c.check}`)}</span>`).join("")}</div>` : "";
      body = `<ul class="fcplanrows">${rows}</ul>${checks}${stop ? `<p class="fcfacts">${this.esc(stop)}</p>` : ""}${this.undoMessage && undone ? `<p class="fcfacts">${this.esc(this.undoMessage)}</p>` : ""}`;
      btns = `${done ? `<button type="button" class="btn accent" data-fc-plan-undo><ha-icon icon="mdi:undo-variant"></ha-icon>${t("fcUndo")}</button>` : ""}<button type="button" class="btn primary" data-fc-plan-drop>${t("fcPlanOk")}</button>`;
    }
    return `<section class="panel fcplan"><div class="pad"><small class="fceyebrow">${name}</small><h3>${head}</h3>${error}${body}<div class="fcplanbtns">${btns}</div></div></section>`;
  }

  bindFcPlan(root) {
    root.querySelectorAll("[data-fc-plan]").forEach(el => el.onclick = () => this.fcPlanStart(el.dataset.key, JSON.parse(el.dataset.fcPlan)));
    root.querySelector("[data-fc-plan-run]")?.addEventListener("click", () => this.fcPlanRun());
    root.querySelectorAll("[data-fc-plan-drop]").forEach(el => el.onclick = () => this.fcPlanDrop());
    root.querySelector("[data-fc-plan-undo]")?.addEventListener("click", () => this.undoPlan());
  }
}
