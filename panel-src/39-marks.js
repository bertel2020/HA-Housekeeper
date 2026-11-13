// Marks: what to expect of an entity or device (offline on purpose, seasonal, a spare, keep, replaced); mixed into the panel in 99-register.js.
Object.assign(TEXT.de, {
  confirmMarksRemove: "{count} Objekt-Notizen werden entfernt. Befunde, die sie ausblenden, erscheinen wieder.", confirmDecisionsRemove: "{count} Entscheidungen werden aufgehoben. Die Befunde sind danach wieder offen.",
  decideTabStatus: "Status", decideTabMark: "Objekt-Notiz",
  markTitle: "Objekt-Notiz", markHint: "Halte fest, warum das Objekt so ist, wie es ist, zum Beispiel absichtlich offline. Housekeeper meldet es dann nicht mehr als „nicht verfügbar“, eine kaputte Referenz bleibt sichtbar. Nur in Housekeeper, Home Assistant bleibt unverändert.",
  markNone: "Keine Objekt-Notiz.", markSet: "Objekt-Notiz setzen", markChange: "Ändern", markClear: "Objekt-Notiz entfernen", markKind: "Art der Objekt-Notiz", markReason: "Begründung (optional)", markReview: "Erinnern in", markNever: "Nie", marksSetN: "Objekt-Notiz setzen ({n})", marksSetTitle: "Objekt-Notiz für {n} Entitäten", markShowHidden: "Die ausgeblendeten Befunde zeigen", markColKind: "Art", markColReason: "Begründung", markColReview: "Prüfen am", marksSet: "Objekt-Notiz setzen …", marksReviewN: "Prüfdatum ändern ({n})", marksKindN: "Art ändern ({n})", marksRemoveN: "Objekt-Notiz entfernen ({n})", marksReviewTitle: "Neues Prüfdatum für {n} Objekt-Notizen", marksKindTitle: "Neue Art für {n} Objekt-Notizen", markTarget: "Ersetzt durch (Objekt-ID)", markDue: "Prüfdatum erreicht: die Befunde sind wieder sichtbar.", markReviewOn: "erinnern {date}", markBy: "Objekt-Notiz: {kind}", markFailed: "Die Objekt-Notiz konnte nicht gespeichert werden: {reason}",
  mark_expected_offline: "Absichtlich offline", mark_seasonal: "Saisonal", mark_spare: "Reservegerät", markBulkTitle: "Objekt-Notiz setzen · {n} Objekte", markKindSub_expected_offline: "Das Objekt ist oft oder lange aus, und das ist normal.", markKindSub_seasonal: "Nur in einer Jahreszeit oder zu festen Zeiten in Betrieb.", markKindSub_spare: "Liegt bereit, wird nicht ständig gebraucht.", markKindSub_keep: "Blendet nichts aus, schützt nur vor dem Aufräumen.", markKindSub_replaced: "Ein neues Objekt übernimmt; dann folgt das Ziel.", mark_keep: "Nicht löschen", mark_replaced: "Wird ersetzt",
  markWindowKind: "Wann gilt die Objekt-Notiz", markWindowAlways: "Immer", markWindowTime: "Zu festen Zeiten", markWindowSun: "Bei Dunkelheit (Sonnenstand)", markFrom: "Von", markTo: "Bis", markGrace: "Anlaufzeit nach dem Ende", markGraceMin: "{n} Min.", markWindowTimeLine: "{from}–{to} Uhr", markWindowSunLine: "bei Dunkelheit", markGraceLine: "danach {n} Min. Anlaufzeit", markWindowSame: "Von und Bis dürfen nicht gleich sein.",
  markNoSun: "In Home Assistant gibt es keine Entität sun.sun: ohne sie gilt „Bei Dunkelheit“ nie, der Befund bleibt sichtbar.",
  markOutside: "Objekt-Notiz gilt gerade nicht: wird überwacht", markWindowHint: "Außerhalb des Zeitfensters meldet Housekeeper den Befund wieder, und ein Ausfall zählt erst ab dem Ende des Fensters plus Anlaufzeit.",
  markHiddenHint: "Ausgeblendet durch eine Objekt-Notiz am Objekt.", markScopeHint: "Gilt für das Objekt und künftige Ausfälle. Für einen einzelnen Befund: Ist so gewollt.", reason_marked_keep: "Trägt eine Objekt-Notiz, die das Aufräumen ausschließt, oder das Label housekeeper_keep.",
  markAutoClear: "Automatisch aufheben, sobald sich das Objekt wieder meldet", markGraceBack: "Wartezeit", markAutoClearHint: "Die Objekt-Notiz verschwindet von selbst, wenn das Objekt nach einem Ausfall wieder meldet und die Wartezeit lang durchgehend in Ordnung bleibt. Eine Objekt-Notiz, die vorab bei einem laufenden Objekt gesetzt wird, bleibt bis zum ersten Ausfall.", markAutoClearLine: "wird bei Rückmeldung aufgehoben",
});
Object.assign(TEXT.en, {
  confirmMarksRemove: "{count} object notes will be removed. Findings they hide appear again.", confirmDecisionsRemove: "{count} decisions will be removed. The findings are open again afterwards.",
  decideTabStatus: "Status", decideTabMark: "Object note",
  markTitle: "Object note", markHint: "Note why the object is the way it is, for example offline on purpose. Housekeeper then stops reporting it as “not available”; a broken reference stays visible. Only in Housekeeper, Home Assistant stays unchanged.",
  markNone: "No object note.", markSet: "Set an object note", markChange: "Change", markClear: "Remove object note", markKind: "Kind of object note", markReason: "Reason (optional)", markReview: "Remind in", markNever: "Never", marksSetN: "Set object note ({n})", marksSetTitle: "Object note for {n} entities", markShowHidden: "Show the hidden findings", markColKind: "Kind", markColReason: "Reason", markColReview: "Review on", marksSet: "Set an object note …", marksReviewN: "Change review date ({n})", marksKindN: "Change kind ({n})", marksRemoveN: "Remove object note ({n})", marksReviewTitle: "New review date for {n} object notes", marksKindTitle: "New kind for {n} object notes", markTarget: "Replaced by (object ID)", markDue: "Review date reached: the findings are visible again.", markReviewOn: "remind {date}", markBy: "Object note: {kind}", markFailed: "The object note could not be saved: {reason}",
  mark_expected_offline: "Offline on purpose", mark_seasonal: "Seasonal", mark_spare: "Spare device", markBulkTitle: "Set object note · {n} objects", markKindSub_expected_offline: "The object is often or long off, and that is normal.", markKindSub_seasonal: "Only runs in a season or at fixed times.", markKindSub_spare: "Stands by, not needed all the time.", markKindSub_keep: "Hides nothing, only protects from the cleanup.", markKindSub_replaced: "A new object takes over; the target follows.", mark_keep: "Do not delete", mark_replaced: "Being replaced",
  markWindowKind: "When the object note applies", markWindowAlways: "Always", markWindowTime: "At fixed times", markWindowSun: "In the dark (position of the sun)", markFrom: "From", markTo: "To", markGrace: "Grace period after the end", markGraceMin: "{n} min", markWindowTimeLine: "{from}–{to}", markWindowSunLine: "in the dark", markGraceLine: "then {n} min grace", markWindowSame: "From and to must not be the same.",
  markNoSun: "Home Assistant has no entity sun.sun: without it “In the dark” never applies and the finding stays visible.",
  markOutside: "Object note does not apply right now: watched", markWindowHint: "Outside the window Housekeeper reports the finding again, and an outage counts only from the end of the window plus the grace period.",
  markHiddenHint: "Hidden by an object note on the object.", markScopeHint: "Applies to the object and future outages. For a single finding: Intended.", reason_marked_keep: "Carries an object note that rules out cleanup, or the label housekeeper_keep.",
  markAutoClear: "Remove automatically once the object reports again", markGraceBack: "Wait", markAutoClearHint: "The object note disappears by itself when the object reports again after an outage and stays fine for the whole wait. An object note set in advance on an object that works stays until its first outage.", markAutoClearLine: "ends when it reports again",
});

class MarksMixin {
  // "21:00–06:00 Uhr, then 30 min grace" or "in the dark, …" for a mark with a window.
  windowLine(mark) {
    const w = mark.window;
    if (!w) return "";
    const what = w.mode === "sun" ? this.t("markWindowSunLine") : this.t("markWindowTimeLine", { from: w.from, to: w.to });
    return mark.grace ? `${what}, ${this.t("markGraceLine", { n: mark.grace })}` : what;
  }

  markLine(mark) {
    const until = mark.until ? ` · ${this.t("markReviewOn", { date: this.formatDay(mark.until) })}` : "";
    const window = mark.window ? ` · ${this.windowLine(mark)}` : "";
    const auto = mark.auto_clear ? ` · ${this.t("markAutoClearLine")}` : "";
    return `${this.t(`mark_${mark.kind}`)}${window}${auto}${until}${mark.reason ? ` · ${mark.reason}` : ""}${mark.target ? ` → ${mark.target}` : ""}${mark.via === "mcp" ? ` · ${this.t("viaMcp")}` : ""}`;
  }

  // The fields "when does the note apply" and "end by itself", shared by the form of one object and the one of a selection;
  // p is the prefix of their data attributes ("mark" or "bulk"), f holds wmode, from, to, grace and autoClear.
  markWhen(f, p) {
    const field = (label, body) => `<label class="mfield"><span>${this.t(label)}</span>${body}</label>`;
    const modes = ["", "time", "sun"].map(m => `<label class="chip${(f.wmode || "") === m ? " active" : ""}"><input type="radio" class="sr-only" name="${p}-wmode" value="${m}" data-${p}-wmode ${(f.wmode || "") === m ? "checked" : ""}>${this.t(m === "time" ? "markWindowTime" : m === "sun" ? "markWindowSun" : "markWindowAlways")}</label>`).join("");
    const graces = [0, 15, 30, 60, 120].map(n => `<option value="${n}" ${Number(f.grace ?? 30) === n ? "selected" : ""}>${this.t("markGraceMin", { n })}</option>`).join("");
    const keep = f.kind === "keep", windowed = !keep && f.wmode, auto = !keep && f.autoClear;
    const noSun = f.wmode === "sun" && this._hass?.states && !this._hass.states["sun.sun"];
    const window = (keep ? "" : `<div class="mfield wide"><span>${this.t("markWindowKind")}</span><div class="chips bare" role="radiogroup">${modes}</div></div>`)
      + (windowed && f.wmode === "time" ? field("markFrom", `<input type="time" data-${p}-from value="${this.esc(f.from || "21:00")}">`) + field("markTo", `<input type="time" data-${p}-to value="${this.esc(f.to || "06:00")}">`) : "")
      + (windowed ? field("markGrace", `<select data-${p}-grace>${graces}</select>`) : "");
    const autoBox = keep || f.wmode ? "" : `<div class="mrow"><label class="nw"><input type="checkbox" data-${p}-auto ${f.autoClear ? "checked" : ""}> ${this.t("markAutoClear")}</label></div>`;
    const graceBack = auto ? `<div class="mrow">${field("markGraceBack", `<select data-${p}-grace>${graces}</select>`)}</div>` : "";
    const hints = `${auto ? `<small class="factnote">${this.t("markAutoClearHint")}</small>` : ""}${windowed ? `<small class="factnote">${this.t("markWindowHint")}</small>` : ""}${noSun ? this.notice("err", this.t("markNoSun")) : ""}`;
    return { window, autoBox, graceBack, hints, windowed, auto };
  }

  // The kinds of a mark as tiles with what each one does; one radio per kind carries the attribute that the handlers look for.
  markKindTiles(kinds, current, attr, name) {
    const icons = { expected_offline: "mdi:power-plug-off-outline", seasonal: "mdi:snowflake", spare: "mdi:package-variant-closed", keep: "mdi:shield-check-outline", replaced: "mdi:swap-horizontal" };
    const tile = k => `<label class="statusopt green${current === k ? " on" : ""}"><input type="radio" name="${name}" value="${k}" ${attr} ${current === k ? "checked" : ""}><i class="stico"><ha-icon icon="${icons[k]}"></ha-icon></i><span><b>${this.t(`mark_${k}`)}</b><small>${this.t(`markKindSub_${k}`)}</small></span></label>`;
    return `<div class="mfield"><span>${this.t("markKind")}</span><div class="statusopts markkinds" role="radiogroup">${kinds.map(tile).join("")}</div></div>`;
  }

  // The form to set or change a mark: labelled fields in two rows (what and why, then when it applies and when to review).
  markFormHtml(f, key) {
    const type = key.split(":")[0];
    const allowed = ["config_entry", "app"].includes(type) ? ["expected_offline", "seasonal", "spare"] : ["expected_offline", "seasonal", "spare", "keep", "replaced"];
    const days = [0, 30, 90, 180, 365].map(n => `<option value="${n}" ${Number(f.days) === n ? "selected" : ""}>${this.t("markReview")}: ${n ? this.t("decideDays", { n }) : this.t("markNever")}</option>`).join("");
    const when = this.markWhen(f, "mark");
    const details = `<div class="statusrow">${f.kind === "replaced" ? `<input data-mark-target maxlength="255" autocomplete="off" value="${this.esc(f.target)}" aria-label="${this.esc(this.t("markTarget"))}" placeholder="${this.esc(this.t("markTarget"))}">` : ""}<input data-mark-reason maxlength="200" autocomplete="off" value="${this.esc(f.reason)}" aria-label="${this.esc(this.t("markReason"))}" placeholder="${this.esc(this.t("markReason"))}"><select data-mark-days aria-label="${this.esc(this.t("markReview"))}" title="${this.esc(this.t("markReview"))}">${days}</select></div>`;
    return `<form class="pad markform" data-mark-form="${this.esc(key)}">${this.markKindTiles(allowed, f.kind, "data-mark-kind", "mark-kind")}<div class="mrow">${when.window}</div>${details}${when.autoBox}${when.graceBack}
        ${when.hints}
        ${this.coverHint(this.data.findings.filter(x => this.findingKey(x) === key), ["user", "label", "rule"])}<small class="factnote">${this.t("markScopeHint")}</small>
        ${this.markEffectLine(f, false)}
        ${f.error ? `${this.notice("err", f.error)}` : ""}
        <div class="mbtns"><button type="button" class="btn quiet" data-mark-cancel>${this.t("cancelRun")}</button><button type="submit" class="btn primary">${this.t("saveOptions")}</button></div></form>`;
  }

  markCard(item) {
    if (!MARK_TYPES.includes(item.object_type)) return "";
    const f = this.markForm, key = this.objectKey(item), mark = item.mark;
    const head = `<div class="panelhead"><div><h2>${this.t("markTitle")}</h2><p>${this.t("markHint")}</p></div></div>`;
    if (f && f.key === key) return `<section class="panel">${head}${this.markFormHtml(f, key)}</section>`;
    const body = mark
      ? `<div class="row"><span class="tile ${item.mark_due ? "warn" : "mute"}"><ha-icon icon="mdi:bookmark-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(this.t(`mark_${mark.kind}`))}</strong><small>${this.esc(this.markLine(mark))}${item.mark_due ? ` · ${this.t("markDue")}` : ""}</small></span><button class="btn" data-mark-open="${this.esc(key)}">${this.t("markChange")}</button>${this.rowMenuHtml([["mdi:bookmark-remove-outline", "markClear", `data-mark-clear="${this.esc(key)}"`]])}</div>`
      : `<div class="pad"><p class="factnote">${this.t("markNone")}</p><button class="btn" data-mark-open="${this.esc(key)}"><ha-icon icon="mdi:bookmark-plus-outline"></ha-icon>${this.t("markSet")}</button></div>`;
    return `<section class="panel">${head}${body}</section>`;
  }

  // The same as rows of the tab "Actions": the mark with its buttons, or the form below its title while it is edited.
  markRows(item) {
    if (!MARK_TYPES.includes(item.object_type)) return [];
    const f = this.markForm, key = this.objectKey(item), mark = item.mark;
    if (f && f.key === key) return [this.actRow(this.t("markTitle"), this.t("markHint"), ""), `<div class="actblock">${this.markFormHtml(f, key)}</div>`];
    if (!mark) return [...this.oftenRows(item), this.actRow(this.t("markTitle"), `${this.t("markNone")} ${this.t("markHint")}`, `<button class="btn" data-mark-open="${this.esc(key)}"><ha-icon icon="mdi:bookmark-plus-outline"></ha-icon>${this.t("markSet")}</button>`)];
    return [this.actRow(`${this.esc(this.t("markTitle"))}: ${this.esc(this.t(`mark_${mark.kind}`))}`, `${this.esc(this.markLine(mark))}${item.mark_due ? ` · ${this.t("markDue")}` : ""}`, `<button class="btn" data-mark-open="${this.esc(key)}">${this.t("markChange")}</button>${this.rowMenuHtml([["mdi:bookmark-remove-outline", "markClear", `data-mark-clear="${this.esc(key)}"`]])}`)];
  }

  // The form opens where the button is (under the row of the finding); only where no row can hold it, the page of the object does.
  async openMarkHere(key) {
    const obj = this.findObject(key);
    if (!obj) return;
    if (this.decide && this.findingKey(this.data.findings.find(x => x.key === this.decide.key) || {}) === key) this.decide = null;
    this.openMark(key);
    const form = this.shadowRoot?.querySelector?.("[data-mark-form]");
    if (form) { form.scrollIntoView?.({ block: "nearest" }); return; }
    this._pendingTab = "actions"; await this.openObject(obj); this.openMark(key);
  }

  openMark(key) {
    const item = this.findObject(key), mark = item?.mark;
    this.markForm = { key, kind: mark?.kind || "expected_offline", reason: mark?.reason || "", days: mark ? 0 : MARK_DAYS, target: mark?.target || "", error: "", wmode: mark?.window?.mode || "", from: mark?.window?.from || "21:00", to: mark?.window?.to || "06:00", grace: mark?.grace ?? 30, autoClear: mark ? Boolean(mark.auto_clear) : true };
    this.render();
    this.shadowRoot?.querySelector?.("[data-mark-kind]")?.focus?.();
  }

  // The backend refreshes its cached snapshot; the panel fetches that copy, so no new scan is needed.
  // Days an object with a hiding mark (offline on purpose, spare) has run without a gap, from MARK_QUIET_DAYS on;
  // null below that, while something of it is off, or when it is not known. A device counts from its entities: the
  // shortest run of the ones not disabled. Seasonal marks stay out: a season is long on purpose.
  markQuietDays(o) {
    if (!["expected_offline", "spare"].includes(o.mark?.kind)) return null;
    const run = since => (since ? Math.floor((Date.now() - Date.parse(since)) / 864e5) : null);
    let days;
    if (o.object_type === "device") {
      const ents = (this.data?.objects || []).filter(e => e.object_type === "entity" && e.device_id === o.object_id && e.status !== "disabled");
      if (!ents.length || ents.some(e => e.status !== "active" || !e.status_since)) return null;
      days = Math.min(...ents.map(e => run(e.status_since)));
    } else days = o.status === "active" ? run(o.status_since) : null;
    return Number.isFinite(days) && days >= MARK_QUIET_DAYS ? days : null;
  }

  async refreshData() {
    const key = this.selected ? this.objectKey(this.selected) : null;
    const data = await this._hass.callWS({ type: "ha_housekeeper/inventory" });
    if (!Array.isArray(data?.findings)) return; // an answer without a scan keeps what is on screen
    this.data = data;
    this._rev++;
    if (key) this.selected = this.findObject(key) || null;
  }

  async commitMark() {
    const f = this.markForm;
    if (!f) return;
    const [object_type, ...rest] = f.key.split(":");
    const msg = { type: "ha_housekeeper/mark_set", object_type, object_id: rest.join(":"), kind: f.kind, reason: f.reason.trim() };
    if (Number(f.days)) msg.days = Number(f.days);
    if (f.kind === "replaced" && f.target.trim()) msg.target = f.target.trim();
    if (f.kind !== "keep" && f.wmode) {
      if (f.wmode === "time" && f.from === f.to) { f.error = this.t("markWindowSame"); this.render(); return; }
      msg.window = f.wmode === "sun" ? { mode: "sun" } : { mode: "time", from: f.from, to: f.to };
      msg.grace_minutes = Number(f.grace);
    }
    if (f.kind !== "keep" && !f.wmode && f.autoClear) {
      msg.auto_clear = true;
      msg.grace_minutes = Number(f.grace);
    }
    try {
      await this._hass.callWS(msg);
      this.markForm = null;
      const ctx = this.fcMarkCtx;
      this.fcMarkCtx = null;
      if (ctx) this.fcNotify(this.fcLogAdd({ stage: ctx.stage, key: ctx.keys[0], keys: ctx.keys, targets: [f.key], n: ctx.keys.length, action: "mark", name: ctx.name }));
      await this.refreshData();
    } catch (err) { f.error = this.t("markFailed", { reason: this.errText(err) }); }
    this.render();
  }

  // Takes the picked notes away (asked before by the caller); one run at a time, and a reload that fails is reported.
  async removeMarks(keys) {
    if (this._marksBusy || !keys.length) return;
    this._marksBusy = true;
    try {
      await this.runBulk(keys, async key => {
        const [object_type, ...rest] = key.split(":");
        await this._hass.callWS({ type: "ha_housekeeper/mark_clear", object_type, object_id: rest.join(":") });
        this.markSel?.delete(key);
      });
      try { await this.refreshData(); } catch (err) { this.failed(err); }
    } finally { this._marksBusy = false; }
    this.render();
  }

  // Sends the picked notes again with a new review date or a new kind; everything else of a note stays as it was.
  async commitMarkBulkEdit() {
    const b = this.markBulk, sel = this.markSel;
    if (!b || !sel?.size) return;
    const kinds = this.markKindsFor(new Map([...sel].map(k => [k, k])));
    const kind = b.markKind && kinds.includes(b.markKind) ? b.markKind : kinds[0];
    const failed = await this.runBulk([...sel], async key => {
      const mark = this.findObject(key)?.mark;
      if (!mark) return;
      const [object_type, ...rest] = key.split(":");
      const to = b.kind === "kind" ? kind : mark.kind;
      const msg = { type: "ha_housekeeper/mark_set", object_type, object_id: rest.join(":"), kind: to, reason: mark.reason || "" };
      const days = b.kind === "review" ? Number(b.days) : mark.until ? Math.max(1, Math.ceil((Date.parse(mark.until) - Date.now()) / 864e5)) : 0;
      if (days) msg.days = days;
      if (to === "replaced" && mark.target) msg.target = mark.target;
      if (to !== "keep" && mark.window) { msg.window = mark.window.mode === "sun" ? { mode: "sun" } : { mode: "time", from: mark.window.from, to: mark.window.to }; msg.grace_minutes = Number(mark.grace ?? 30); }
      else if (to !== "keep" && mark.auto_clear) { msg.auto_clear = true; msg.grace_minutes = Number(mark.grace ?? 30); }
      await this._hass.callWS(msg);
    });
    await this.refreshData();
    if (!failed) this.markBulk = null;
    this.render();
  }

  // The findings a note hides: the list of findings, on its hidden ones, searched for the name of the object.
  showHiddenOf(key) {
    const object = this.findObject(key);
    this.noteJump?.("findingsNav");
    this.view = "findingsNav"; this.pages = {}; this.selected = null; this.trail = [];
    this.clearFindingFilters();
    this.findingStatus = "hidden";
    const st = this.lvState("findings", "impact", "desc");
    st.q = object?.name || object?.object_id || ""; this.persistLv("findings");
    this.render();
  }

  async clearMark(key) {
    const [object_type, ...rest] = key.split(":");
    try {
      await this._hass.callWS({ type: "ha_housekeeper/mark_clear", object_type, object_id: rest.join(":") });
      await this.refreshData();
    } catch (err) { this.failed(err); }
    this.render();
  }

  bindMarks(root) {
    root.querySelectorAll("[data-mark-open]").forEach(el => el.onclick = () => this.openMark(el.dataset.markOpen));
    root.querySelectorAll("[data-mark-hidden]").forEach(el => el.onclick = () => this.showHiddenOf(el.dataset.markHidden));
    root.querySelectorAll("[data-mark-clear]").forEach(el => el.onclick = () => this.clearMark(el.dataset.markClear));
    root.querySelectorAll("[data-mark-cancel]").forEach(el => el.onclick = () => { this.markForm = null; this.fcMarkCtx = null; this.render(); });
    root.querySelectorAll("[data-mark-form]").forEach(form => {
      form.onsubmit = ev => { ev.preventDefault(); this.commitMark(); };
      form.querySelectorAll("[data-mark-kind]").forEach(el => el.onchange = () => { this.markForm.kind = el.value; this.render(); });
      form.querySelector("[data-mark-reason]").oninput = ev => { this.markForm.reason = ev.target.value; };
      form.querySelector("[data-mark-days]").onchange = ev => { this.markForm.days = Number(ev.target.value); this.render(); };
      form.querySelectorAll("[data-mark-wmode]").forEach(el => el.onchange = () => { this.markForm.wmode = el.value; if (el.value) this.markForm.autoClear = false; this.render(); });
      [["from", "from"], ["to", "to"]].forEach(([name, field]) => { const el = form.querySelector(`[data-mark-${name}]`); if (el) el.oninput = ev => { this.markForm[field] = ev.target.value; }; });
      const auto = form.querySelector("[data-mark-auto]");
      if (auto) auto.onchange = ev => { this.markForm.autoClear = ev.target.checked; this.render(); };
      const grace = form.querySelector("[data-mark-grace]");
      if (grace) grace.onchange = ev => { this.markForm.grace = Number(ev.target.value); };
      const target = form.querySelector("[data-mark-target]");
      if (target) target.oninput = ev => { this.markForm.target = ev.target.value; };
      form.onkeydown = ev => { if (ev.key === "Escape") { ev.preventDefault(); this.markForm = null; this.render(); } };
    });
  }
}
