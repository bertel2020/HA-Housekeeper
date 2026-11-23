// FcQueueMixin: the card of stage 1 and 3 as one recommended answer with the others in a list, and the plans of the cards
// marked for the end of the stage. Whatever changes something is only marked ("Vormerken") on the card; when all cards are
// through, the marked actions are one card with one preview, one backup and one way back. Decisions that hide a finding
// (Later, Intended, False alarm, the object note) take effect at once, as before. Mixed into the panel in 99-register.js.
Object.assign(TEXT.de, {
  fcQueueBtn: "{label} vormerken",
  fcOthersHead: "Andere Möglichkeiten", fcOptionsHead: "Möglichkeiten",
  fcQueueNote: "Was etwas ändert, wird nur vorgemerkt. Am Ende der Etappe läuft alles zusammen, mit Vorschau und Backup.",
  fcQueueTitle1: "{n} Aktion vorgemerkt", fcQueueTitle: "{n} Aktionen vorgemerkt",
  fcQueueDrop: "Entfernen", fcQueueRun: "Prüfen und ausführen", fcQueueRunHead: "Vorgemerkte Aktionen",
  fcQueueHint: "Noch ist nichts geändert. Erst nach der Vorschau läuft alles zusammen; vorher wird ein Backup gemacht, und du kannst danach alles rückgängig machen.",
  fcQueueAsk: "{n} vorgemerkte Aktionen sind noch nicht ausgeführt. Trotzdem weiter?",
});
Object.assign(TEXT.en, {
  fcQueueBtn: "Add to plan: {label}",
  fcOthersHead: "Other options", fcOptionsHead: "Options",
  fcQueueNote: "Whatever changes something is only added to the plan. At the end of the stage everything runs together, with a preview and a backup.",
  fcQueueTitle1: "{n} action in the plan", fcQueueTitle: "{n} actions in the plan",
  fcQueueDrop: "Remove", fcQueueRun: "Review and run", fcQueueRunHead: "Actions in the plan",
  fcQueueHint: "Nothing is changed yet. Only after the preview does everything run together; a backup is made first, and you can undo it all afterwards.",
  fcQueueAsk: "{n} actions in the plan have not been run yet. Go on anyway?",
});

class FcQueueMixin {
  // The plans marked on the cards of a stage, from the history (it is kept on the server, so they survive a reload); one that ran loses its plan.
  fcQueued(n) {
    return this.fcLogGet().filter(e => e.stage === n && e.action === "pick" && e.plan && e.object).map(e => ({ id: e.id, stage: n, key: e.object, keys: e.keys || [e.key], req: e.plan, name: e.name || "", label: e.label || "" }));
  }

  // The buttons of the plans on the cards of stage 1 and 3 mark; on every other page they open the preview at once.
  fcQueuing() { return Boolean(this.fcWizOn() && [1, 3].includes(this.fcWiz?.step) && !this.fcWiz.look && this.fcCardCtx?.n === this.fcWiz.step); }

  fcPlanClick(el) {
    const key = el.dataset.key, req = JSON.parse(el.dataset.fcPlan);
    if (this.fcQueuing()) this.fcQueueAdd(key, req, el.dataset.label || el.textContent.trim());
    else this.fcPlanStart(key, req);
  }

  // A plan of the card is marked: the card is answered, the next one shows, and the plan waits in the queue of the stage.
  fcQueueAdd(key, req, label) {
    const ctx = this.fcCardCtx, name = this.findObject(key)?.name || ctx.f.object_id;
    if (this.fcQueued(ctx.n).some(q => q.key === key && JSON.stringify(q.req) === JSON.stringify(req))) return;
    this.fcLogAdd({ stage: ctx.n, key: ctx.keys[0], keys: ctx.keys, n: ctx.keys.length, action: "pick", name, object: key, label, plan: req });
    this.decide = null; this.markForm = null; this.fcMarkCtx = null;
    if (ctx.keys.includes(this.fcFocus)) this.fcFocus = "";
    this.render();
  }

  fcQueuedPill(n) {
    const c = this.fcQueued(n).length;
    return c ? `<span class="pill warn">${this.t("fcSumPick", { n: this.formatNumber(c) })}</span>` : "";
  }

  // The marked actions of a stage run as one plan: one preview, one backup, one way back.
  fcQueueRunStart(n) {
    const queued = this.fcQueued(n);
    if (!queued.length) return;
    const reqs = [...new Map(queued.map(q => [JSON.stringify(q.req), q.req])).values()];
    return this.fcPlanStart(queued[0].key, reqs, queued.map(q => q.id));
  }

  // The plan ran: the entry stays in the history without its plan, so its cards stay out of the stage (a finding that is still open does not come back as a card).
  fcQueueDone(ids) {
    const log = this.fcLogGet();
    for (const id of ids) {
      const i = log.findIndex(e => e.id === id);
      if (i < 0) continue;
      const { id: _id, at: _at, plan: _plan, object: _object, ...rest } = log[i];
      log.splice(i, 1); this.fcLogCall({ action: "log_remove", entry_id: id });
      this.fcLogAdd(rest);
    }
  }

  // All cards of the stage are through and some plans are marked: the one card left lists them.
  fcQueueCard(n, prevBtn) {
    const q = this.fcQueued(n), t = (k, p) => this.t(k, p), taken = new Set(q.flatMap(e => e.keys)), rest = this.stageOpen(n).filter(f => !taken.has(f.key)).length;
    const rows = q.map(e => `<li><span class="fcqname"><strong>${this.esc(e.name)}</strong><small>${this.esc(e.label)}</small></span><button type="button" class="btn quiet" data-fc-undo="${this.esc(e.id)}">${t("fcQueueDrop")}</button></li>`).join("");
    const again = rest ? `<button type="button" class="btn" data-fc-again>${t("fcCardsAgain")}</button>` : "";
    const error = this.fcPlanError && !this.fcPlanKey ? `<div class="error">${this.esc(this.fcPlanError)}</div>` : "";
    return `<section class="panel fccard${this.fcAnim(`${n}:queue`)}"><div class="pad"><small class="fceyebrow">${t("fcStageOf", { n })}</small><h3>${t(q.length === 1 ? "fcQueueTitle1" : "fcQueueTitle", { n: this.formatNumber(q.length) })}</h3><p class="fcfacts">${t(rest ? "fcCardsLeft" : "fcCardsDone", { n: this.formatNumber(rest) })}</p><ul class="fcplanrows fcqueuerows">${rows}</ul><p class="fcfacts">${t("fcQueueHint")}</p>${error}<div class="fcplanbtns"><button type="button" class="btn primary" data-fc-queue-run="${n}"${this.planBusy ? " disabled" : ""}>${t("fcQueueRun")}</button>${again}</div><div class="fcmore fcnav"><span class="fcnavl">${prevBtn}</span></div></div></section>`;
  }

  // The ways of the finding are asked for as soon as its card shows (they are the answers of the card, not behind a button).
  fcEnsureWays(f, key, obj) {
    this.fixAll = "";
    if (!obj || this.fixKey === f.key || !(OUTAGE_RULES.includes(f.rule_id) || this.fcFixable(f, key))) return;
    this.fixKey = f.key; this.fixWays = null; this.fixWaysFailed = false; this.fixFailure = null;
    this.loadFixWays(f.key);
  }

  // What a card offers, as rows of icon, sentence and button: the one recommended answer in a box of its own, the others in one list.
  // The form of an answer that is open (reason and days, the object note) stands right under its row.
  fcOptions({ f, keys, key, obj, many, rec, chosen, kattr, opt }) {
    const t = k => this.t(k);
    const fixable = Boolean(obj && this.fcFixable(f, key)), check = Boolean(obj && !fixable && OUTAGE_RULES.includes(f.rule_id));
    const row = (id, attr, label, icon, hint, isRec) => ({ id, rec: isRec, html: this.fixRow(icon, t(hint), `<button type="button" class="btn${isRec ? " primary" : ""}" ${attr}>${label}</button>`, isRec, false) });
    // The same as on the page "Fix": for a device that is down, "intended" is said by the object note, which also covers what follows.
    const outageNote = f.rule_id === "device.down" && this.fcCanMark(obj);
    const status = [
      this.fcCanMark(obj) ? row("mark", `data-fc-markopen="${this.esc(key)}" ${kattr}`, t("markSet"), FSEL_ICONS.mark, "fcMarkHint", rec?.act === "mark") : null,
      row("snooze", opt("snooze"), t("fcLater"), STATUS_TONES.snooze.icon, "fcLaterHint", rec?.act === "later"),
      outageNote ? null : row("keep", opt("keep"), t("fcKeep"), STATUS_TONES.keep.icon, "fcKeepHint", false),
      row("ignore", opt("ignore"), t("decideKind_ignore"), STATUS_TONES.ignore.icon, "fcIgnoreHint", false),
    ].filter(Boolean);
    const ways = fixable || check ? this.fcWayEntries(f, key, obj, fixable && rec?.act === "fix") : { entries: [], finding: null };
    const all = [...(fixable ? ways.entries : []), ...status];
    const recEntry = all.find(e => e.rec) || null, others = all.filter(e => e !== recEntry);
    const form = this.fcOptBlock(f, keys, key, obj);
    let placed = !form;
    const place = e => { if (!placed && e.id === chosen) { placed = true; return e.html + form; } return e.html; };
    const why = rec ? `<p class="fcrecwhy"><strong>${this.esc(rec.head)}</strong> ${this.esc(rec.body)}</p>` : "";
    const recBox = rec || recEntry ? `<div class="fcrecbox"><small class="fceyebrow">${t("fcRecTag")}</small>${why}${recEntry ? place(recEntry) : ""}</div>` : "";
    const list = others.map(place).join("");
    const rest = `${placed ? "" : form}${check ? this.fcCheckBlock(ways.finding || f, ways.entries.map(e => e.html).join("")) : ""}`;
    const note = all.concat(ways.entries).some(e => e.html.includes("data-fc-plan=")) ? `<p class="fcfacts">${t("fcQueueNote")}</p>` : "";
    return `${recBox}<div class="fcother"><small class="fceyebrow">${t(recBox ? "fcOthersHead" : "fcOptionsHead")}</small>${list}</div>${rest}${note}`;
  }
}
