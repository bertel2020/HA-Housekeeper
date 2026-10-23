// ActivityMixin: the Journal tab "Activity", what was done in Housekeeper (decisions, marks, plans, logbook, what
// happened by itself), newest first, grouped by day. The backend keeps one append-only record (activity.py); the
// panel only reads it in pages and offers the undo the entry carries.
const ACTIVITY_FILTERS = ["all", "decision", "mark", "plan", "note", "auto"];
class ActivityMixin {
  ensureActivity() {
    if (!this.activityState) this.loadActivity(true);
  }

  async loadActivity(reset = true) {
    const old = reset ? null : this.activityState;
    const state = this.activityState = reset
      ? { items: [], next: null, total: 0, loading: true, error: "", filter: old?.filter || this.activityFilter || "all", query: this.activityQuery || "" }
      : { ...old, loading: true };
    this.activityFilter = state.filter; this.activityQuery = state.query;
    const msg = { type: "ha_housekeeper/activity", query: state.query, kinds: state.filter === "all" ? ACTIVITY_FILTERS.filter(k => k !== "all" && k !== "auto") : [state.filter] };
    if (!reset && state.next) msg.before = state.next;
    this.render();
    try {
      const page = await this._hass.callWS(msg);
      if (this.activityState !== state) return;
      state.items = reset ? page.items : [...state.items, ...page.items];
      state.next = page.next; state.total = page.total; state.loadedAt = new Date().toISOString();
    } catch (err) { if (this.activityState === state) state.error = this.errText(err); }
    if (this.activityState === state) { state.loading = false; if (this.view === "journal") this.render(); }
  }

  activityDay(iso) {
    const day = new Date(iso), now = new Date(), start = d => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const diff = Math.round((start(now) - start(day)) / 864e5);
    if (diff === 0) return this.t("actToday");
    if (diff === 1) return this.t("actYesterday");
    return new Intl.DateTimeFormat(this.lang, { dateStyle: "long" }).format(day);
  }

  activityVerb(e) {
    const key = `act_${e.kind}_${e.action}`;
    return TEXT[this.lang]?.[key] || TEXT.en[key] ? this.t(key) : this.t(`act_${e.kind}`);
  }

  activityIcon(e) {
    return { decision: "mdi:eye-off-outline", mark: "mdi:tag-outline", plan: "mdi:clipboard-text-clock-outline", note: "mdi:notebook-outline", auto: "mdi:autorenew" }[e.kind] || "mdi:history";
  }

  activityRow(e) {
    const what = e.name || e.key || "";
    const details = [
      e.source ? this.t(`actSource_${e.source}`) : "",
      e.by_name || "",
      e.reason ? `„${e.reason}“` : "",
      e.until ? this.t("actUntil", { date: this.formatDate(e.until) }) : "",
      e.backfilled ? this.t("actTakenOver") : "",
    ].filter(Boolean).join(" · ");
    const undo = !e.undo || e.action === "undo" ? ""
      : e.undo.type === "plan" ? `<button type="button" class="btn quiet" data-jump="journal" data-jump-tab="plans">${this.t("actOpenJournal")}</button>`
      : `<button type="button" class="btn quiet" data-act-undo="${this.esc(e.id)}">${this.t("actUndo")}</button>`;
    return `<li class="actrow"><span class="tile mute"><ha-icon icon="${this.activityIcon(e)}"></ha-icon></span><span class="acttext"><strong>${this.esc(this.activityVerb(e))}</strong>${what ? ` ${this.esc(what)}` : ""}${details ? `<small>${this.esc(details)}</small>` : ""}</span><time datetime="${this.esc(e.at)}" title="${this.esc(this.formatDate(e.at))}">${this.esc(new Intl.DateTimeFormat(this.lang, { timeStyle: "short" }).format(new Date(e.at)))}</time>${undo}</li>`;
  }

  activityCard() {
    this.ensureActivity();
    const s = this.activityState || { items: [], loading: true, filter: "all", query: "" };
    const chips = ACTIVITY_FILTERS.map(f => `<button type="button" class="chip${s.filter === f ? " on" : ""}" aria-pressed="${s.filter === f}" data-act-kind="${f}">${this.t(`actFilter_${f}`)}</button>`).join("");
    const groups = [];
    for (const e of s.items) {
      const label = this.activityDay(e.at);
      if (!groups.length || groups[groups.length - 1].label !== label) groups.push({ label, rows: [] });
      groups[groups.length - 1].rows.push(e);
    }
    const list = groups.map(g => `<h3 class="actday">${this.esc(g.label)}</h3><ul class="actlist">${g.rows.map(e => this.activityRow(e)).join("")}</ul>`).join("");
    const body = s.error ? `<div class="pad">${this.notice("err", s.error)}<button type="button" class="btn" data-act-retry>${this.t("actRetry")}</button></div>`
      : s.loading && !s.items.length ? `<div class="pad mute">${this.t("loading")}</div>`
      : !s.items.length ? `<div class="emptymsg mute"><ha-icon icon="mdi:history"></ha-icon><strong>${this.t("actEmpty")}</strong>${this.t("actEmptyNext")}</div>`
      : `${list}${s.next ? `<div class="pad"><button type="button" class="btn" data-act-more ${s.loading ? "disabled" : ""}>${this.t("actvMore")}</button></div>` : ""}`;
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("actvTitle")}</h2><p>${this.t("actHint")}</p></div></div><div class="pad acttools"><input type="search" class="actsearch" data-act-query value="${this.esc(s.query)}" placeholder="${this.esc(this.t("actSearch"))}" aria-label="${this.esc(this.t("actSearch"))}"><div class="chips bare" role="group" aria-label="${this.esc(this.t("actvTitle"))}">${chips}</div><button type="button" class="btn" data-act-csv ${s.items.length ? "" : "disabled"}><ha-icon icon="mdi:download-outline"></ha-icon>${this.t("actCsv")}</button></div>${body}</div>`;
  }

  activityCsv() {
    const cell = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = (this.activityState?.items || []).map(e => [e.at, e.kind, this.activityVerb(e), e.name || "", e.key || "", e.reason || "", e.until || "", e.by_name || e.by || "", e.source || ""].map(cell).join(","));
    this.downloadText("activity.csv", [["at", "kind", "action", "name", "key", "reason", "until", "user", "source"].join(","), ...rows].join("\n") + "\n", "text/csv");
  }

  bindActivity(root) {
    root.querySelectorAll("[data-act-kind]").forEach(el => el.onclick = () => { this.activityFilter = el.dataset.actKind; this.loadActivity(true); });
    root.querySelector("[data-act-query]")?.addEventListener("change", ev => { this.activityQuery = ev.target.value; this.loadActivity(true); });
    root.querySelector("[data-act-more]")?.addEventListener("click", () => this.loadActivity(false));
    root.querySelector("[data-act-retry]")?.addEventListener("click", () => this.loadActivity(true));
    root.querySelector("[data-act-csv]")?.addEventListener("click", () => this.activityCsv());
    root.querySelectorAll("[data-act-undo]").forEach(el => el.onclick = async () => {
      try { await this._hass.callWS({ type: "ha_housekeeper/activity_undo", entry_id: el.dataset.actUndo }); }
      catch (err) { if (err?.code !== "not_found") { this.failed(err); this.render(); return; } }
      await this.refreshData?.();
      this.loadActivity(true);
    });
  }
}
Object.assign(TEXT.de, {
  actTab: "Aktivität", actTabHint: "Was in Housekeeper getan wurde: Entscheidungen, Objekt-Notizen, Pläne, Logbuch.",
  actvTitle: "Aktivität", actHint: "Alles, was getan wurde, das Neueste zuerst. Was von selbst geschah, zeigt der Filter „Automatisch“.",
  actSearch: "Suchen nach Name, Grund oder Benutzer", actCsv: "Als CSV", actRetry: "Erneut versuchen", actvMore: "Ältere laden",
  actToday: "Heute", actYesterday: "Gestern", actUntil: "bis {date}", actTakenOver: "nachträglich übernommen", actUndo: "Rückgängig", actOpenJournal: "Im Journal öffnen",
  actEmpty: "Noch nichts zu zeigen.", actEmptyNext: "Hier erscheint, was entschieden, vermerkt oder ausgeführt wird.",
  actFilter_all: "Alle", actFilter_decision: "Entscheidungen", actFilter_mark: "Objekt-Notizen", actFilter_plan: "Pläne", actFilter_note: "Logbuch", actFilter_auto: "Automatisch",
  actSource_cleanup: "Aufräumen", actSource_list: "Befundliste", actSource_plan: "Plan", actSource_mcp: "Dienst", actSource_system: "Housekeeper",
  act_decision: "Entscheidung", act_decision_ignore: "Als Fehlalarm festgehalten", act_decision_keep: "Als so gewollt festgehalten", act_decision_snooze: "Auf „Später“ gestellt", act_decision_unignore: "Wieder eingeblendet", act_decision_nothanks: "Vorschlag abgelehnt („Nein danke“)", act_decision_undo: "Entscheidung zurückgenommen",
  act_mark: "Objekt-Notiz", act_mark_expected_offline: "Notiert: soll offline sein", act_mark_seasonal: "Notiert: saisonal", act_mark_spare: "Notiert: Reserve", act_mark_keep: "Notiert: geschützt", act_mark_replaced: "Notiert: ersetzt", act_mark_clear: "Objekt-Notiz entfernt", act_mark_undo: "Objekt-Notiz zurückgenommen",
  act_plan: "Plan ausgeführt", act_plan_undo: "Plan zurückgenommen", act_note: "Logbuch", act_note_save: "Logbuch-Eintrag", act_note_delete: "Logbuch-Eintrag gelöscht", act_auto: "Von selbst", act_auto_lifted: "Von selbst zurück, weil es schlimmer wurde:",
});
Object.assign(TEXT.en, {
  actTab: "Activity", actTabHint: "What was done in Housekeeper: decisions, object notes, plans, logbook.",
  actvTitle: "Activity", actHint: "Everything that was done, newest first. What happened by itself shows under the filter “Automatic”.",
  actSearch: "Search by name, reason or user", actCsv: "As CSV", actRetry: "Try again", actvMore: "Load older",
  actToday: "Today", actYesterday: "Yesterday", actUntil: "until {date}", actTakenOver: "taken over later", actUndo: "Undo", actOpenJournal: "Open in the Journal",
  actEmpty: "Nothing to show yet.", actEmptyNext: "What is decided, marked or run shows up here.",
  actFilter_all: "All", actFilter_decision: "Decisions", actFilter_mark: "Object notes", actFilter_plan: "Plans", actFilter_note: "Logbook", actFilter_auto: "Automatic",
  actSource_cleanup: "Cleanup", actSource_list: "Findings list", actSource_plan: "Plan", actSource_mcp: "Service", actSource_system: "Housekeeper",
  act_decision: "Decision", act_decision_ignore: "Marked as false alarm", act_decision_keep: "Kept as intended", act_decision_snooze: "Put on “Later”", act_decision_unignore: "Shown again", act_decision_nothanks: "Suggestion declined (“No thanks”)", act_decision_undo: "Decision undone",
  act_mark: "Object note", act_mark_expected_offline: "Noted: should be offline", act_mark_seasonal: "Noted: seasonal", act_mark_spare: "Noted: spare", act_mark_keep: "Noted: protected", act_mark_replaced: "Noted: replaced", act_mark_clear: "Object note removed", act_mark_undo: "Object note undone",
  act_plan: "Plan run", act_plan_undo: "Plan undone", act_note: "Logbook", act_note_save: "Logbook entry", act_note_delete: "Logbook entry deleted", act_auto: "By itself", act_auto_lifted: "Back by itself because it got worse:",
});
