// CheckLogMixin: the page "Verlauf" (Watch group). The central log of Housekeeper writes down when a check changes its level
// (backup protection, database, auto-pause), with the numbers behind it; the page only reads `ha_housekeeper/check_log`.
// Mixed into the panel in 99-register.js.
const CL_DAYS = [7, 30, 90];
const CL_LEVEL_PILL = { ok: "ok", note: "warn", problem: "red", unknown: "mute", running: "blue" };
const CL_AREA_PAGE = { backup: "maintenance", database: "recorder", auto_pause: "autopause" };
Object.assign(TEXT.de, {
  checklog: "Verlauf", checklogSubtitle: "Wann eine Prüfung ihre Stufe gewechselt hat, mit den Zahlen dahinter. Nur Zeiten und Zahlen, keine Namen und Texte.",
  clDays_7: "7 Tage", clDays_30: "30 Tage", clDays_90: "90 Tage",
  clTileChanges: "Wechsel", clTileProblems: "Probleme", clTileFlapping: "Flattern", clTileLongest: "Längstes Problem",
  clTileChangesSub: "in {days} Tagen", clTileProblemsSub: "Stufe „Problem“", clTileFlappingSub: "Prüfungen mit häufigem Wechsel", clTileLongestSub: "bis zur Rückkehr",
  clRecurring: "{what} wurde diese Woche {n}-mal zum Problem.", clRecurringMany: "{n} Prüfungen wurden diese Woche mindestens 3-mal zum Problem, zuletzt: {what}.", clRecurringOpen: "Zu den Zuverlässigkeits-Seiten",
  clStrips: "Zustand je Bereich", clStripsHint: "Das Schlimmste aller Prüfungen eines Bereichs, über {days} Tage. Schraffiert: keine Daten (Home Assistant war aus oder der Verlauf noch nicht eingerichtet).",
  clLegendOk: "in Ordnung", clLegendNote: "Hinweis", clLegendProblem: "Problem", clLegendUnknown: "unbekannt", clLegendNone: "keine Daten",
  clAreaAll: "Alle", clOnlyProblems: "Nur Probleme und Hinweise", clSearch: "Suchen nach Bereich, Prüfung oder Ursache",
  clArea_backup: "Backup-Schutz", clArea_database: "Datenbank", clArea_auto_pause: "Auto-Pause",
  clCheck_backup_run: "Backup", clCheck_database_integrity: "Integritätsprüfung", clCheck_database_disk_low: "Plattenplatz", clCheck_database_wal_large: "WAL-Datei",
  clCheck_auto_pause_paused: "Pausiert", clCheck_auto_pause_exhausted: "Versuche aufgebraucht", clCheck_auto_pause_back: "Wieder aktiv", clCheck_auto_pause_ended: "Pause beendet",
  clLevel_ok: "in Ordnung", clLevel_note: "Hinweis", clLevel_problem: "Problem", clLevel_unknown: "unbekannt", clLevel_running: "läuft",
  clBackupStarted: "Backup gestartet", clBackupDone: "Backup beendet nach {span}", clBackupDoneNoSpan: "Backup beendet",
  clCauseGap: "Abstand {span}", clCauseGapLimit: "Abstand {span} (Grenze {limit})", clCauseRunning: "Backup läuft: {yes}", clCauseSeconds: "Dauer {span}", clCauseDomain: "Integration {domain}",
  clCauseAge: "Alter {span}", clCauseAgeLimit: "Alter {span} (Grenze {limit})", clCauseCount: "{name}: {n}", clYes: "ja", clNo: "nein",
  clLasted: "dauerte {span}", clFlaps: "flattert ×{n}",
  clStart: "Home Assistant gestartet", clStartUnclean: "Home Assistant gestartet, nicht sauber gestoppt", clGap: "Keine Daten", clGapText: "Home Assistant war {span} nicht erreichbar, in dieser Zeit lief keine Prüfung",
  clEmpty: "Noch keine Wechsel.", clEmptyNext: "Der Verlauf füllt sich, sobald eine Prüfung ihre Stufe ändert. Aufbewahrt werden {days} Tage, höchstens {max} Einträge.",
  clNoMatch: "Nichts gefunden.", clNoMatchNext: "Die Filter oder die Suche lassen keinen Eintrag übrig.",
  clMore: "{shown} von {total} Einträgen gezeigt, die Filter ändern den Zeitraum nicht.", clRetention: "Aufbewahrt: {days} Tage, höchstens {max} Einträge.", clLoadError: "Der Verlauf konnte nicht gelesen werden.",
});
Object.assign(TEXT.en, {
  checklog: "History", checklogSubtitle: "When a check changed its level, with the numbers behind it. Only times and numbers, no names and no texts.",
  clDays_7: "7 days", clDays_30: "30 days", clDays_90: "90 days",
  clTileChanges: "Changes", clTileProblems: "Problems", clTileFlapping: "Flapping", clTileLongest: "Longest problem",
  clTileChangesSub: "in {days} days", clTileProblemsSub: "level “Problem”", clTileFlappingSub: "checks that change often", clTileLongestSub: "until it was back",
  clRecurring: "{what} turned into a problem {n} times this week.", clRecurringMany: "{n} checks turned into a problem at least 3 times this week, latest: {what}.", clRecurringOpen: "To the reliability pages",
  clStrips: "State per area", clStripsHint: "The worst of all checks of an area, over {days} days. Hatched: no data (Home Assistant was off or the history was not yet running).",
  clLegendOk: "OK", clLegendNote: "Note", clLegendProblem: "Problem", clLegendUnknown: "unknown", clLegendNone: "no data",
  clAreaAll: "All", clOnlyProblems: "Only problems and notes", clSearch: "Search by area, check or cause",
  clArea_backup: "Backup protection", clArea_database: "Database", clArea_auto_pause: "Auto-pause",
  clCheck_backup_run: "Backup", clCheck_database_integrity: "Integrity check", clCheck_database_disk_low: "Disk space", clCheck_database_wal_large: "WAL file",
  clCheck_auto_pause_paused: "Paused", clCheck_auto_pause_exhausted: "Attempts used up", clCheck_auto_pause_back: "Active again", clCheck_auto_pause_ended: "Pause ended",
  clLevel_ok: "OK", clLevel_note: "Note", clLevel_problem: "Problem", clLevel_unknown: "unknown", clLevel_running: "running",
  clBackupStarted: "Backup started", clBackupDone: "Backup finished after {span}", clBackupDoneNoSpan: "Backup finished",
  clCauseGap: "Gap {span}", clCauseGapLimit: "Gap {span} (limit {limit})", clCauseRunning: "Backup running: {yes}", clCauseSeconds: "Took {span}", clCauseDomain: "Integration {domain}",
  clCauseAge: "Age {span}", clCauseAgeLimit: "Age {span} (limit {limit})", clCauseCount: "{name}: {n}", clYes: "yes", clNo: "no",
  clLasted: "lasted {span}", clFlaps: "flapping ×{n}",
  clStart: "Home Assistant started", clStartUnclean: "Home Assistant started, not stopped cleanly", clGap: "No data", clGapText: "Home Assistant was unreachable for {span}, no check ran in that time",
  clEmpty: "No changes yet.", clEmptyNext: "The history fills as soon as a check changes its level. It is kept for {days} days, at most {max} entries.",
  clNoMatch: "Nothing found.", clNoMatchNext: "The filters or the search leave no entry.",
  clMore: "{shown} of {total} entries shown; the filters do not change the period.", clRetention: "Kept: {days} days, at most {max} entries.", clLoadError: "The history could not be read.",
});

class CheckLogMixin {
  async loadCheckLog() {
    this.clLoading = true;
    try { this.checkLog = await this._hass.callWS({ type: "ha_housekeeper/check_log", days: this.clDays || 7 }); this.clError = ""; this.markLoaded("checklog"); }
    catch (err) { this.clError = this.errText(err); }
    this.clLoading = false; this.render();
  }

  // The first visit loads once; the refresh button and a change of the period load again.
  ensureCheckLog() {
    if (this.clLoading || this._clRequested) return;
    this._clRequested = true;
    setTimeout(() => this.loadCheckLog(), 0);
  }

  clHours(seconds) { return this.spanText(Math.max(0, seconds) / 3600); }

  clAreaName(area) { const k = `clArea_${area}`; return this.t(k) !== k ? this.t(k) : area; }

  clCheckName(area, check) {
    if (area === "backup" && check !== "run") { const k = `bh_${check}`; return this.t(k) !== k ? this.t(k) : check; }
    const k = `clCheck_${area}_${check}`;
    return this.t(k) !== k ? this.t(k) : check;
  }

  // The numbers behind a change in words; a key that is not known reads "key: number".
  clCause(e) {
    const c = e.cause || {}, parts = [], used = new Set();
    const take = key => { used.add(key); return c[key]; };
    if (typeof c.gap_minutes === "number") {
      const span = this.clHours(take("gap_minutes") * 60);
      parts.push(typeof c.limit_minutes === "number" ? this.t("clCauseGapLimit", { span, limit: this.clHours(take("limit_minutes") * 60) }) : this.t("clCauseGap", { span }));
    }
    used.add("limit_minutes");
    if (typeof c.age_hours === "number") {
      const span = this.spanText(take("age_hours"));
      parts.push(typeof c.limit_hours === "number" ? this.t("clCauseAgeLimit", { span, limit: this.spanText(take("limit_hours")) }) : this.t("clCauseAge", { span }));
    }
    used.add("limit_hours");
    if (typeof c.running === "boolean") parts.push(this.t("clCauseRunning", { yes: this.t(take("running") ? "clYes" : "clNo") }));
    if (typeof c.seconds === "number" && !(e.area === "backup" && e.check === "run")) parts.push(this.t("clCauseSeconds", { span: this.clHours(take("seconds")) }));
    used.add("seconds");
    if (typeof c.domain === "string") parts.push(this.t("clCauseDomain", { domain: take("domain") }));
    for (const [key, value] of Object.entries(c)) if (!used.has(key) && (typeof value === "number" || typeof value === "boolean")) parts.push(this.t("clCauseCount", { name: key.replace(/_/g, " "), n: typeof value === "boolean" ? this.t(value ? "clYes" : "clNo") : this.formatNumber(value) }));
    return parts.join(" · ");
  }

  clTime(iso) { return new Intl.DateTimeFormat(this.lang, { timeStyle: "short" }).format(new Date(iso)); }

  clText(e) {
    if (e.kind === "start") return e.gap ? this.t("clGapText", { span: this.clHours(e.down_seconds || 0) }) : this.t(e.unclean ? "clStartUnclean" : "clStart");
    if (e.area === "backup" && e.check === "run") return e.to === "running" ? this.t("clBackupStarted") : typeof e.cause?.seconds === "number" ? this.t("clBackupDone", { span: this.clHours(e.cause.seconds) }) : this.t("clBackupDoneNoSpan");
    return this.clCause(e);
  }

  clSearchText(e) { return e.kind === "start" ? `${this.t(e.gap ? "clGap" : "clStart")} ${this.clText(e)}` : `${this.clAreaName(e.area)} ${this.clCheckName(e.area, e.check)} ${this.clText(e)}`.toLowerCase(); }

  clRow(e) {
    const time = this.clTime(e.at);
    if (e.kind === "start") {
      const tone = e.unclean ? ' data-rowtone="warn"' : "";
      return `<div class="row clrow"${tone}><span class="tile ${e.unclean ? "warn" : "mute"}"><ha-icon icon="${e.gap ? "mdi:timer-sand-empty" : "mdi:restart"}"></ha-icon></span><span class="row-text"><strong>${this.t(e.gap ? "clGap" : e.unclean ? "clStartUnclean" : "clStart")}</strong><small>${this.esc(time)}${e.gap ? ` · ${this.esc(this.clText(e))}` : ""}</small></span><span class="clstep">${e.gap ? `<span class="pill mute">${this.t("clGap")}</span>` : ""}</span></div>`;
    }
    const level = e.to, tone = level === "problem" ? ' data-rowtone="red"' : level === "note" ? ' data-rowtone="warn"' : "";
    const icon = { problem: "mdi:alert-circle-outline", note: "mdi:alert-outline", ok: "mdi:check", unknown: "mdi:help", running: "mdi:progress-clock" }[level] || "mdi:circle-small";
    const tile = { problem: "red", note: "warn", ok: "ok" }[level] || "mute";
    const page = CL_AREA_PAGE[e.area], title = `${this.esc(this.clAreaName(e.area))} · ${this.esc(this.clCheckName(e.area, e.check))}`;
    const name = page ? `<button type="button" class="linkbtn" data-jump="${page}">${title}</button>` : title;
    const pills = `<span class="pill ${CL_LEVEL_PILL[e.from] || "mute"}">${this.t(`clLevel_${e.from}`)}</span><ha-icon icon="mdi:arrow-right"></ha-icon><span class="pill ${CL_LEVEL_PILL[e.to] || "mute"}">${this.t(`clLevel_${e.to}`)}</span>`;
    const facts = [this.clText(e), typeof e.lasted_seconds === "number" ? this.t("clLasted", { span: this.clHours(e.lasted_seconds) }) : "", e.flaps ? this.t("clFlaps", { n: e.flaps }) : ""].filter(Boolean).join(" · ");
    return `<div class="row clrow"${tone}><span class="tile ${tile}"><ha-icon icon="${icon}"></ha-icon></span><span class="row-text"><strong>${name}</strong><small>${this.esc(time)}${facts ? ` · ${this.esc(facts)}` : ""}</small></span><span class="clstep">${pills}</span></div>`;
  }

  clStrips(log) {
    if (!log.strips?.length) return "";
    const lines = log.strips.map(s => {
      const label = this.clAreaName(s.area);
      const bar = s.segments.map(g => `<i class="cl-${g.level}" style="flex:${Math.max(g.share, 0.001)}"></i>`).join("");
      return `<div class="clstripline"><span>${this.esc(label)}</span><span class="clstrip" role="img" aria-label="${this.esc(label)}">${bar}</span></div>`;
    }).join("");
    const legend = [["ok", "clLegendOk"], ["note", "clLegendNote"], ["problem", "clLegendProblem"], ["unknown", "clLegendUnknown"], ["none", "clLegendNone"]].map(([k, key]) => `<span><i class="cl-${k}"></i>${this.t(key)}</span>`).join("");
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("clStrips")}</h2><p>${this.t("clStripsHint", { days: log.days })}</p></div></div><div class="clstrips">${lines}</div><div class="cllegend">${legend}</div></section>`;
  }

  checkLogView() {
    this.ensureCheckLog();
    const log = this.checkLog;
    const days = this.clDays || 7;
    const windows = CL_DAYS.map(d => `<button type="button" class="chip${days === d ? " active" : ""}" data-cl-days="${d}" aria-pressed="${days === d}">${this.t(`clDays_${d}`)}</button>`).join("");
    const bar = this.pageBar({ left: windows, at: this.loadedAt("checklog"), loading: this.clLoading, attr: "data-cl-refresh" });
    if (this.clError) return `<div class="stack">${bar}<div class="panel">${this.notice("err", this.t("clLoadError"))}<div class="pad"><small>${this.esc(this.clError)}</small></div></div></div>`;
    if (!log) return `<div class="stack">${bar}<div class="panel">${this.skeleton("loading")}</div></div>`;
    const sum = log.summary || {};
    const tiles = this.sumTiles([
      { label: this.t("clTileChanges"), value: this.formatNumber(sum.changes || 0), sub: this.t("clTileChangesSub", { days: log.days }), tone: "mute" },
      { label: this.t("clTileProblems"), value: this.formatNumber(sum.problems || 0), sub: this.t("clTileProblemsSub"), tone: sum.problems ? "red" : "ok" },
      { label: this.t("clTileFlapping"), value: this.formatNumber(sum.flapping || 0), sub: this.t("clTileFlappingSub"), tone: sum.flapping ? "warn" : "ok" },
      { label: this.t("clTileLongest"), value: sum.longest_problem_seconds ? this.esc(this.clHours(sum.longest_problem_seconds)) : "–", sub: this.t("clTileLongestSub"), tone: "mute" },
    ]);
    const rec = log.recurring || [];
    const recText = rec.length === 1 ? this.t("clRecurring", { what: `${this.clAreaName(rec[0].area)} · ${this.clCheckName(rec[0].area, rec[0].check)}`, n: rec[0].count }) : rec.length ? this.t("clRecurringMany", { n: rec.length, what: `${this.clAreaName(rec[0].area)} · ${this.clCheckName(rec[0].area, rec[0].check)}` }) : "";
    const recur = rec.length ? `<div class="panel"><div class="row" data-rowtone="warn"><span class="tile warn"><ha-icon icon="mdi:repeat"></ha-icon></span><span class="row-text"><strong>${this.esc(recText)}</strong></span><button type="button" class="btn" data-jump="reliability">${this.t("clRecurringOpen")}</button></div></div>` : "";
    const areas = [...new Set([...(log.strips || []).map(s => s.area), ...log.entries.filter(e => e.area).map(e => e.area)])];
    const area = areas.includes(this.clArea) ? this.clArea : "all", only = Boolean(this.clOnly), query = (this.clQuery || "").trim().toLowerCase();
    const chips = [["all", this.t("clAreaAll")], ...areas.map(a => [a, this.clAreaName(a)])].map(([key, label]) => `<button type="button" class="chip${key === area ? " active" : ""}" data-cl-area="${this.esc(key)}" aria-pressed="${key === area}">${this.esc(label)}</button>`).join("")
      + `<button type="button" class="chip${only ? " active" : ""}" data-cl-only aria-pressed="${only}">${this.t("clOnlyProblems")}</button>`;
    const shown = log.entries.filter(e => (area === "all" || e.area === area)
      && (!only || (e.kind === "change" && (e.to === "problem" || e.to === "note")))
      && (!query || this.clSearchText(e).includes(query)));
    const groups = [];
    for (const e of shown) {
      const label = this.activityDay(e.at);
      if (!groups.length || groups[groups.length - 1].label !== label) groups.push({ label, rows: [] });
      groups[groups.length - 1].rows.push(e);
    }
    const list = groups.map(g => `<h3 class="actday">${this.esc(g.label)}</h3>${g.rows.map(e => this.clRow(e)).join("")}`).join("");
    const empty = !log.entries.length
      ? `<div class="emptymsg mute"><ha-icon icon="mdi:history"></ha-icon><strong>${this.t("clEmpty")}</strong>${this.t("clEmptyNext", { days: log.retention_days, max: this.formatNumber(log.max_events) })}</div>`
      : `<div class="emptymsg mute"><ha-icon icon="mdi:filter-off-outline"></ha-icon><strong>${this.t("clNoMatch")}</strong>${this.t("clNoMatchNext")}</div>`;
    const tools = `<div class="pad acttools"><input type="search" class="actsearch" data-cl-q value="${this.esc(this.clQuery || "")}" placeholder="${this.esc(this.t("clSearch"))}" aria-label="${this.esc(this.t("clSearch"))}"><div class="chips bare" role="group">${chips}</div></div>`;
    const foot = `<div class="pad"><small class="mute">${this.t("clRetention", { days: log.retention_days, max: this.formatNumber(log.max_events) })}${log.total > log.entries.length ? ` ${this.t("clMore", { shown: this.formatNumber(log.entries.length), total: this.formatNumber(log.total) })}` : ""}</small></div>`;
    return `<div class="stack">${bar}${tiles}${recur}${this.clStrips(log)}<section class="panel">${tools}${shown.length ? list : empty}${foot}</section></div>`;
  }

  bindCheckLog(root) {
    root.querySelectorAll("[data-cl-days]").forEach(el => el.onclick = () => { this.clDays = Number(el.dataset.clDays); this.loadCheckLog(); });
    root.querySelectorAll("[data-cl-area]").forEach(el => el.onclick = () => { this.clArea = el.dataset.clArea; this.render(); });
    root.querySelector("[data-cl-only]")?.addEventListener("click", () => { this.clOnly = !this.clOnly; this.render(); });
    root.querySelector("[data-cl-q]")?.addEventListener("change", ev => { this.clQuery = ev.target.value; this.render(); });
    root.querySelector("[data-cl-refresh]")?.addEventListener("click", () => this.loadCheckLog());
  }
}
