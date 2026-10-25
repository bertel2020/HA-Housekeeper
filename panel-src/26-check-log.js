// CheckLogMixin: the page "Verlauf" (Watch group). The central log of Housekeeper writes down when a check changes its level
// (backup protection, database, auto-pause), with the numbers behind it; the page only reads `ha_housekeeper/check_log`.
// Mixed into the panel in 99-register.js.
const CL_DAYS = [7, 30, 90];
const CL_LEVEL_PILL = { ok: "ok", note: "warn", problem: "red", unknown: "mute", running: "blue" };
const CL_REASONS = ["backup_running", "restart", "maintenance", "test", "expected", "other"];
const CL_AFTER_MS = 10 * 60 * 1000; // a change this soon after a restart or an update is said to follow it
const CL_AREA_PAGE = { backup: "maintenance", database: "recorder", auto_pause: "autopause", system: "storage", services: "reliability", goals: "policies", scan: "settings" };
Object.assign(TEXT.de, {
  checklog: "Verlauf", checklogSubtitle: "Wann eine Prüfung ihre Stufe gewechselt hat, mit den Zahlen dahinter, dazu Neustarts, Updates und Änderungen an Automationen. Gespeichert werden nur Zeiten, Zahlen und Kennungen, nie Texte.",
  clDays_7: "7 Tage", clDays_30: "30 Tage", clDays_90: "90 Tage",
  clToday: "Heute", clYesterday: "Gestern", clTileRestarts: "Neustarts", clTileRestartsSub: "ohne Update", clTileUpdates: "Updates", clTileUpdatesSub: "mit und ohne Neustart", clTileChanges: "Prüfungswechsel", clTileProblems: "Probleme", clTileFlapping: "Flattern", clTileLongest: "Längstes Problem",
  clTileChangesSub: "in {days} Tagen", clTileProblemsSub: "Stufe „Problem“", clTileFlappingSub: "Prüfungen mit häufigem Wechsel", clTileLongestSub: "bis zur Rückkehr",
  clRecurring: "{what} wurde diese Woche {n}-mal zum Problem.", clRecurringMany: "{n} Prüfungen wurden diese Woche mindestens 3-mal zum Problem, zuletzt: {what}.", clRecurringOpen: "Zu den Zuverlässigkeits-Seiten", clFlapText_1: "1 Prüfung wechselt auffällig oft (mindestens 4 Wechsel in 3 Stunden). Ist das ein Fehlalarm, markiere die Zeilen im Menü.", clFlapText_n: "{n} Prüfungen wechseln auffällig oft (mindestens 4 Wechsel in 3 Stunden). Sind das Fehlalarme, markiere die Zeilen im Menü.", clFlapOnly: "Nur diese zeigen", clFlapAll: "Alle zeigen",
  clStrips: "Zustand je Bereich", clStripsHint: "Das Schlimmste aller Prüfungen eines Bereichs, über {days} Tage. Schraffiert: keine Daten (Home Assistant war aus oder der Verlauf noch nicht eingerichtet).",
  clLegendOk: "in Ordnung", clLegendNote: "Hinweis", clLegendProblem: "Problem", clLegendUnknown: "unbekannt", clLegendNone: "keine Daten",
  clAreaAll: "Alle", clOnlyProblems: "Nur Probleme und Hinweise", clSearch: "Suchen nach Bereich, Prüfung oder Ursache",
  clArea_backup: "Backup-Schutz", clArea_database: "Datenbank", clArea_auto_pause: "Auto-Pause", clArea_system: "System", clArea_services: "Dienste", clArea_goals: "Ziele", clArea_scan: "Scan", clArea_config: "Konfiguration", clConfigEdited: "Konfiguration geändert",
  clCheck_backup_run: "Backup", clCheck_database_integrity: "Integritätsprüfung", clCheck_database_disk_low: "Plattenplatz", clCheck_database_wal_large: "WAL-Datei", clCheck_system_disk: "Speicherplatz", clCheck_system_memory: "Arbeitsspeicher", clCheck_services_setup: "Einrichtung der Integrationen", clCheck_scan_scan: "Läuft der Scan",
  clCheck_auto_pause_paused: "Pausiert", clCheck_auto_pause_exhausted: "Versuche aufgebraucht", clCheck_auto_pause_back: "Wieder aktiv", clCheck_auto_pause_ended: "Pause beendet",
  clLevel_ok: "in Ordnung", clLevel_note: "Hinweis", clLevel_problem: "Problem", clLevel_unknown: "unbekannt", clLevel_running: "läuft",
  clBackupStarted: "Backup gestartet", clBackupDone: "Backup beendet nach {span}", clBackupDoneNoSpan: "Backup beendet",
  clCauseGap: "Abstand {span}", clCauseGapLimit: "Abstand {span} (Grenze {limit})", clCauseRunning: "Backup läuft: {yes}", clCauseSeconds: "Dauer {span}", clCauseDomain: "Integration {domain}",
  clCauseUsed: "belegt {n} %", clCauseUsedLimit: "belegt {n} % (Grenze {limit} %)", clCauseValueLimit: "Wert {value} (Ziel höchstens {limit})", clCauseFailures: "{n} Fehlschläge in Folge", clCauseFailing: "{errors} mit Fehler, {retrying} versuchen es erneut", clCauseAge: "Alter {span}", clCauseAgeLimit: "Alter {span} (Grenze {limit})", clCauseCount: "{name}: {n}", clYes: "ja", clNo: "nein",
  clLasted: "dauerte {span}", clFlaps: "flattert ×{n}",
  clColEvent: "Ereignis", clColTime: "Zeit", clColArea: "Bereich", clColChange: "Wechsel", clAllAreas: "Alle Bereiche", clAllLevels: "Alle Stufen", clArea_updates: "Updates", clArea_restarts: "Neustarts", clOpenUpdates: "Zu den Updates", clOpenIntegration: "Zur Integration", clAfterStart: "kurz nach einem Neustart", clAfterUpdate: "kurz nach einem Update", clStripFilter: "Nur {area} in der Liste zeigen",
  clUpdate_core: "Home Assistant aktualisiert", clUpdate_os: "Betriebssystem aktualisiert", clUpdate_supervisor: "Supervisor aktualisiert", clUpdate_integration: "Integration {domain} aktualisiert", clUpdateText: "Version {from} auf {to}",
  clStart: "Home Assistant gestartet", clStartUnclean: "Home Assistant gestartet, nicht sauber gestoppt", clGap: "Keine Daten", clGapText: "Von {from} bis {to} ({span}) nicht erreichbar, in dieser Zeit lief keine Prüfung",
  clWhy_restart: "Ordentlich heruntergefahren und wieder gestartet", clWhy_update: "Nach einem Update", clDown: "war {span} aus", clMinShort: "Min.", clFirstCheck: "erste Prüfung nach {span}", clAfterFindings: "danach: {what}", clUpdateRestart: "{title} und neu gestartet", clUpdatesRestart: "{n} Updates, danach Neustart", clUpdName_core: "Home Assistant", clUpdName_os: "Betriebssystem", clUpdName_supervisor: "Supervisor", clUpdName_integration: "{domain}",
  clEmpty: "Noch keine Wechsel.", clEmptyNext: "Der Verlauf füllt sich, sobald eine Prüfung ihre Stufe ändert. Aufbewahrt werden {days} Tage, höchstens {max} Einträge.",
  clMarkAs_backup_running: "Fehlalarm: Backup lief gerade", clMarkAs_restart: "Fehlalarm: Neustart", clMarkAs_maintenance: "Fehlalarm: Wartung", clMarkAs_test: "Fehlalarm: Test", clMarkAs_expected: "Fehlalarm: ist so gewollt", clMarkAs_other: "Fehlalarm: anderer Grund",
  clUnmark: "Markierung entfernen", clOpenCheck: "Prüfung öffnen", clOnlyCheck: "Nur diese Prüfung zeigen", clOnlyCheckOn: "Nur: {what}", clOnlyCheckOff: "Alle Prüfungen zeigen",
  clDismissed: "Fehlalarm · {reason}", clReason_backup_running: "Backup lief gerade", clReason_restart: "Neustart", clReason_maintenance: "Wartung", clReason_test: "Test", clReason_expected: "ist so gewollt", clReason_other: "anderer Grund",
  clMarkFailed: "Die Markierung konnte nicht gespeichert werden.",
  clExpName: "verlauf", clExpTitle: "Verlauf der Prüfungen", clExpAt: "Zeit", clExpArea: "Bereich", clExpCheck: "Prüfung", clExpFrom: "von", clExpTo: "nach", clExpCause: "Ursache", clExpLasted: "Dauer (Sekunden)", clExpDismissed: "Fehlalarm",
  clNoMatch: "Nichts gefunden.", clNoMatchNext: "Die Filter oder die Suche lassen keinen Eintrag übrig.",
  clMore: "{shown} von {total} Einträgen gezeigt, der Export enthält alle des Zeitraums.", clRetention: "Aufbewahrt: {days} Tage, höchstens {max} Einträge.", clLoadError: "Der Verlauf konnte nicht gelesen werden.",
});
Object.assign(TEXT.en, {
  checklog: "History", checklogSubtitle: "When a check changed its level, with the numbers behind it, plus restarts, updates and edits of automations. Only times, numbers and identifiers are kept, never texts.",
  clDays_7: "7 days", clDays_30: "30 days", clDays_90: "90 days",
  clToday: "Today", clYesterday: "Yesterday", clTileRestarts: "Restarts", clTileRestartsSub: "without an update", clTileUpdates: "Updates", clTileUpdatesSub: "with or without a restart", clTileChanges: "Check changes", clTileProblems: "Problems", clTileFlapping: "Flapping", clTileLongest: "Longest problem",
  clTileChangesSub: "in {days} days", clTileProblemsSub: "level “Problem”", clTileFlappingSub: "checks that change often", clTileLongestSub: "until it was back",
  clRecurring: "{what} turned into a problem {n} times this week.", clRecurringMany: "{n} checks turned into a problem at least 3 times this week, latest: {what}.", clRecurringOpen: "To the reliability pages", clFlapText_1: "1 check changes level unusually often (at least 4 changes in 3 hours). If that is a false alarm, mark the rows in the menu.", clFlapText_n: "{n} checks change level unusually often (at least 4 changes in 3 hours). If those are false alarms, mark the rows in the menu.", clFlapOnly: "Show only these", clFlapAll: "Show all",
  clStrips: "State per area", clStripsHint: "The worst of all checks of an area, over {days} days. Hatched: no data (Home Assistant was off or the history was not yet running).",
  clLegendOk: "OK", clLegendNote: "Note", clLegendProblem: "Problem", clLegendUnknown: "unknown", clLegendNone: "no data",
  clAreaAll: "All", clOnlyProblems: "Only problems and notes", clSearch: "Search by area, check or cause",
  clArea_backup: "Backup protection", clArea_database: "Database", clArea_auto_pause: "Auto-pause", clArea_system: "System", clArea_services: "Services", clArea_goals: "Goals", clArea_scan: "Scan", clArea_config: "Configuration", clConfigEdited: "Configuration changed",
  clCheck_backup_run: "Backup", clCheck_database_integrity: "Integrity check", clCheck_database_disk_low: "Disk space", clCheck_database_wal_large: "WAL file", clCheck_system_disk: "Disk space", clCheck_system_memory: "Memory", clCheck_services_setup: "Setup of integrations", clCheck_scan_scan: "Scan runs",
  clCheck_auto_pause_paused: "Paused", clCheck_auto_pause_exhausted: "Attempts used up", clCheck_auto_pause_back: "Active again", clCheck_auto_pause_ended: "Pause ended",
  clLevel_ok: "OK", clLevel_note: "Note", clLevel_problem: "Problem", clLevel_unknown: "unknown", clLevel_running: "running",
  clBackupStarted: "Backup started", clBackupDone: "Backup finished after {span}", clBackupDoneNoSpan: "Backup finished",
  clCauseGap: "Gap {span}", clCauseGapLimit: "Gap {span} (limit {limit})", clCauseRunning: "Backup running: {yes}", clCauseSeconds: "Took {span}", clCauseDomain: "Integration {domain}",
  clCauseUsed: "{n} % used", clCauseUsedLimit: "{n} % used (limit {limit} %)", clCauseValueLimit: "Value {value} (goal at most {limit})", clCauseFailures: "{n} failures in a row", clCauseFailing: "{errors} with an error, {retrying} retrying", clCauseAge: "Age {span}", clCauseAgeLimit: "Age {span} (limit {limit})", clCauseCount: "{name}: {n}", clYes: "yes", clNo: "no",
  clLasted: "lasted {span}", clFlaps: "flapping ×{n}",
  clColEvent: "Event", clColTime: "Time", clColArea: "Area", clColChange: "Change", clAllAreas: "All areas", clAllLevels: "All levels", clArea_updates: "Updates", clArea_restarts: "Restarts", clOpenUpdates: "Go to the updates", clOpenIntegration: "Go to the integration", clAfterStart: "shortly after a restart", clAfterUpdate: "shortly after an update", clStripFilter: "Show only {area} in the list",
  clUpdate_core: "Home Assistant updated", clUpdate_os: "Operating system updated", clUpdate_supervisor: "Supervisor updated", clUpdate_integration: "Integration {domain} updated", clUpdateText: "Version {from} to {to}",
  clStart: "Home Assistant started", clStartUnclean: "Home Assistant started, not stopped cleanly", clGap: "No data", clGapText: "Unreachable from {from} to {to} ({span}), no check ran in that time",
  clWhy_restart: "Shut down cleanly and started again", clWhy_update: "After an update", clDown: "was off for {span}", clMinShort: "min", clFirstCheck: "first check after {span}", clAfterFindings: "afterwards: {what}", clUpdateRestart: "{title} and restarted", clUpdatesRestart: "{n} updates, then restart", clUpdName_core: "Home Assistant", clUpdName_os: "Operating system", clUpdName_supervisor: "Supervisor", clUpdName_integration: "{domain}",
  clEmpty: "No changes yet.", clEmptyNext: "The history fills as soon as a check changes its level. It is kept for {days} days, at most {max} entries.",
  clMarkAs_backup_running: "False alarm: a backup was running", clMarkAs_restart: "False alarm: restart", clMarkAs_maintenance: "False alarm: maintenance", clMarkAs_test: "False alarm: test", clMarkAs_expected: "False alarm: as intended", clMarkAs_other: "False alarm: other reason",
  clUnmark: "Remove the mark", clOpenCheck: "Open the check", clOnlyCheck: "Show only this check", clOnlyCheckOn: "Only: {what}", clOnlyCheckOff: "Show all checks",
  clDismissed: "False alarm · {reason}", clReason_backup_running: "a backup was running", clReason_restart: "restart", clReason_maintenance: "maintenance", clReason_test: "test", clReason_expected: "as intended", clReason_other: "other reason",
  clMarkFailed: "The mark could not be saved.",
  clExpName: "history", clExpTitle: "History of the checks", clExpAt: "Time", clExpArea: "Area", clExpCheck: "Check", clExpFrom: "From", clExpTo: "To", clExpCause: "Cause", clExpLasted: "Lasted (seconds)", clExpDismissed: "False alarm",
  clNoMatch: "Nothing found.", clNoMatchNext: "The filters or the search leave no entry.",
  clMore: "{shown} of {total} entries shown; the export holds all of the period.", clRetention: "Kept: {days} days, at most {max} entries.", clLoadError: "The history could not be read.",
});

class CheckLogMixin {
  async loadCheckLog() {
    this.clLoading = true;
    try { this.checkLog = await this._hass.callWS({ type: "ha_housekeeper/check_log", days: this.clDays || 7, limit: 5000 }); this.clError = ""; this.markLoaded("checklog"); }
    catch (err) { this.clError = this.errText(err); }
    this.clLoading = false; this.render();
  }

  // The first visit loads once; the refresh button and a change of the period load again.
  ensureCheckLog() {
    if (this.clLoading || this._clRequested) return;
    this._clRequested = true;
    setTimeout(() => this.loadCheckLog(), 0);
  }

  // Short spans down to seconds ("2 Min. 10 s"), the long ones as hours.
  clSpan(seconds) {
    const s = Math.round(Math.max(0, seconds));
    if (s < 60) return `${s} s`;
    if (s < 3600) return s % 60 ? `${Math.floor(s / 60)} ${this.t("clMinShort")} ${s % 60} s` : `${Math.floor(s / 60)} ${this.t("clMinShort")}`;
    return this.clHours(s);
  }

  clHours(seconds) { return this.spanText(Math.max(0, seconds) / 3600); }

  clAreaName(area) { const k = `clArea_${area}`; return this.t(k) !== k ? this.t(k) : area; }

  clCheckName(area, check) {
    if (area === "backup" && check !== "run") { const k = `bh_${check}`; return this.t(k) !== k ? this.t(k) : check; }
    if (area === "goals") { const g = `goal_${check}`; if (this.t(g) !== g) return this.t(g); }
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
    if (typeof c.used_percent === "number") parts.push(typeof c.limit_percent === "number" ? this.t("clCauseUsedLimit", { n: take("used_percent"), limit: take("limit_percent") }) : this.t("clCauseUsed", { n: take("used_percent") }));
    used.add("limit_percent"); used.add("free_bytes");
    if (typeof c.errors === "number" && typeof c.retrying === "number") { parts.push(this.t("clCauseFailing", { errors: take("errors"), retrying: take("retrying") })); used.add("entries"); }
    if (typeof c.value === "number" && typeof c.limit === "number") parts.push(this.t("clCauseValueLimit", { value: this.formatNumber(take("value")), limit: this.formatNumber(take("limit")) }));
    if (typeof c.failures === "number" && e.area === "scan") parts.push(this.t("clCauseFailures", { n: take("failures") }));
    if (typeof c.running === "boolean") parts.push(this.t("clCauseRunning", { yes: this.t(take("running") ? "clYes" : "clNo") }));
    if (typeof c.seconds === "number" && !(e.area === "backup" && e.check === "run")) parts.push(this.t("clCauseSeconds", { span: this.clHours(take("seconds")) }));
    used.add("seconds");
    if (typeof c.domain === "string") parts.push(this.t("clCauseDomain", { domain: take("domain") }));
    for (const [key, value] of Object.entries(c)) if (!used.has(key) && (typeof value === "number" || typeof value === "boolean")) parts.push(this.t("clCauseCount", { name: key.replace(/_/g, " "), n: typeof value === "boolean" ? this.t(value ? "clYes" : "clNo") : this.formatNumber(value) }));
    return parts.join(" · ");
  }

  clTime(iso) { return new Intl.DateTimeFormat(this.lang, { timeStyle: "short" }).format(new Date(iso)); }

  clUpdateTitle(e) { return this.t(`clUpdate_${e.what}`, { domain: e.domain || "" }); }

  // What a start line says below its title: the reason, later the downtime and what followed.
  clStartSub(e) {
    if (e.gap) return this.clText(e);
    const ups = e.updates || [];
    const what = ups.length === 1 ? this.clText(ups[0]) : ups.map(u => `${this.t(`clUpdName_${u.what}`, { domain: u.domain || "" })} ${this.clText(u)}`).join("; ");
    return [what, !ups.length && e.reason !== "crash" ? this.t(`clWhy_${e.reason || "restart"}`) : "", e.down_seconds > 0 ? this.t("clDown", { span: this.clSpan(e.down_seconds) }) : "", typeof e.first_check_seconds === "number" ? this.t("clFirstCheck", { span: this.clSpan(e.first_check_seconds) }) : "", this.clAfterText(e)].filter(Boolean).join(" · ");
  }

  clStartTitle(e) {
    const ups = e.updates || [];
    if (!ups.length) return this.t(e.gap ? "clGap" : e.unclean ? "clStartUnclean" : "clStart");
    return ups.length === 1 ? this.t("clUpdateRestart", { title: this.clUpdateTitle(ups[0]) }) : this.t("clUpdatesRestart", { n: ups.length });
  }

  // Where an update line leads: the integration's page, or the updates of the maintenance page.
  clUpdateLink(u) { return u.what === "integration" ? (this.findObject(`integration:${u.domain}`) ? `data-object="integration:${this.esc(u.domain)}"` : "") : 'data-jump="maintenance" data-jump-tab="updates"'; }

  // "afterwards: 2× Problem, 1× Hinweis": the checks that turned bad within minutes after a start.
  clAfterText(e) {
    const parts = ["problem", "note"].filter(l => e.after?.[l]).map(l => `${e.after[l]}× ${this.t(`clLevel_${l}`)}`);
    return parts.length ? this.t("clAfterFindings", { what: parts.join(", ") }) : "";
  }

  clText(e) {
    if (e.kind === "update") return this.t("clUpdateText", { from: e.from || "?", to: e.to || "?" });
    if (e.kind === "start") return e.gap ? this.t("clGapText", { span: this.clSpan(e.down_seconds || 0), from: this.formatDate(Date.parse(e.at) - (e.down_seconds || 0) * 1000), to: this.formatDate(e.at) }) : this.t(e.unclean ? "clStartUnclean" : "clStart");
    if (e.area === "backup" && e.check === "run") return e.to === "running" ? this.t("clBackupStarted") : typeof e.cause?.seconds === "number" ? this.t("clBackupDone", { span: this.clHours(e.cause.seconds) }) : this.t("clBackupDoneNoSpan");
    return this.clCause(e);
  }

  // Marks a change as a false alarm (reason) or takes the mark away (null); the page reads again afterwards.
  async clMark(change, reason) {
    try { await this._hass.callWS({ type: "ha_housekeeper/check_log_mark", change, reason }); await this.loadCheckLog(); }
    catch (err) { this.toast(this.errText(err) || this.t("clMarkFailed"), true); }
  }

  clMenu(r) {
    const e = r.e;
    if (e.kind === "update") return this.rowMenuHtml([r.link ? ["mdi:open-in-new", e.what === "integration" ? "clOpenIntegration" : "clOpenUpdates", r.link] : null]);
    if (e.kind === "start") {
      const seen = new Set();
      return this.rowMenuHtml((e.updates || []).map(u => [u, this.clUpdateLink(u)]).filter(([, link]) => link && !seen.has(link) && seen.add(link)).map(([u, link]) => ["mdi:open-in-new", u.what === "integration" ? "clOpenIntegration" : "clOpenUpdates", link]));
    }
    if (e.kind === "config") return this.rowMenuHtml(r.object ? this.objectRowMenu({ key: r.object }) : []);
    if (e.kind !== "change") return "";
    const page = CL_AREA_PAGE[e.area];
    return this.rowMenuHtml([
      ...(e.dismissed ? [["mdi:flag-remove-outline", "clUnmark", `data-cl-unmark="${this.esc(e.id)}"`]] : CL_REASONS.map(x => ["mdi:flag-outline", `clMarkAs_${x}`, `data-cl-mark="${this.esc(e.id)}|${x}"`])),
      null,
      page ? ["mdi:open-in-new", "clOpenCheck", `data-jump="${page}"`] : null,
      ["mdi:filter-outline", "clOnlyCheck", `data-cl-check="${this.esc(`${e.area}/${e.check}`)}"`],
    ]);
  }

  // The entries as rows of the standard table: what happened, when, in which area, and the change of level.
  clRows(log) {
    const marks = log.entries.filter(e => e.kind === "start" || e.kind === "update").map(e => ({ at: Date.parse(e.at), kind: e.kind }));  // an update merged into a start counts as the start
    const follows = e => {
      const at = Date.parse(e.at), near = marks.filter(m => m.at <= at && at - m.at <= CL_AFTER_MS).sort((a, b) => b.at - a.at)[0];
      return near ? this.t(near.kind === "start" ? "clAfterStart" : "clAfterUpdate") : "";
    };
    return log.entries.map((e, i) => {
      const row = { e, key: String(i), rank: 0 };
      if (e.kind === "start") {
        const ups = e.updates || [];
        Object.assign(row, { area: ups.length ? "updates" : "restarts", title: this.clStartTitle(e), sub: this.clStartSub(e), tone: e.unclean ? "warn" : "mute", icon: e.gap ? "mdi:timer-sand-empty" : ups.length ? "mdi:update" : "mdi:restart", rank: e.unclean ? 2 : 0, link: ups.length ? this.clUpdateLink(ups[0]) : "" });
      } else if (e.kind === "update") {
        Object.assign(row, { area: "updates", title: this.clUpdateTitle(e), sub: this.clText(e), tone: "mute", icon: "mdi:update", link: this.clUpdateLink(e) });
      } else if (e.kind === "config") {
        const object = e.key.replace(".", ":"), found = this.findObject(object);
        Object.assign(row, { area: "config", title: this.t("clConfigEdited"), sub: found?.name || e.key, tone: "mute", icon: "mdi:file-edit-outline", object: found ? object : "" });
      } else {
        const level = e.to;
        Object.assign(row, {
          area: e.area, title: this.clCheckName(e.area, e.check), rank: { problem: 3, note: 2, unknown: 1 }[level] || 0,
          tone: e.dismissed ? "mute" : { problem: "red", note: "warn", ok: "ok" }[level] || "mute",
          icon: { problem: "mdi:alert-circle-outline", note: "mdi:alert-outline", ok: "mdi:check", unknown: "mdi:help", running: "mdi:progress-clock" }[level] || "mdi:circle-small",
          sub: [this.clText(e), typeof e.lasted_seconds === "number" ? this.t("clLasted", { span: this.clHours(e.lasted_seconds) }) : "", e.flaps ? this.t("clFlaps", { n: e.flaps }) : "", follows(e)].filter(Boolean).join(" · "),
        });
      }
      row.areaName = this.clAreaName(row.area);
      return row;
    });
  }

  clNameCell(r) {
    const e = r.e, page = e.kind === "change" ? CL_AREA_PAGE[e.area] : "";
    const target = page ? `data-jump="${page}"` : r.link || (r.object ? `data-object="${this.esc(r.object)}"` : "");
    const title = target ? `<button type="button" class="linkbtn" ${target}>${this.esc(r.title)}</button>` : this.esc(r.title);
    return `<div class="statcell"><span class="tile ${r.tone}"><ha-icon icon="${r.icon}"></ha-icon></span><div><strong>${title}</strong>${r.sub ? `<small>${this.esc(r.sub)}</small>` : ""}</div></div>`;
  }

  clChangeCell(r) {
    const e = r.e;
    if (e.kind !== "change") return "";
    const pills = `<span class="pill ${CL_LEVEL_PILL[e.from] || "mute"}">${this.t(`clLevel_${e.from}`)}</span><ha-icon icon="mdi:arrow-right"></ha-icon><span class="pill ${CL_LEVEL_PILL[e.to] || "mute"}">${this.t(`clLevel_${e.to}`)}</span>`;
    return `<span class="clstep">${e.dismissed ? `<span class="pill mute">${this.t("clDismissed", { reason: this.t(`clReason_${e.dismissed}`) })}</span>` : ""}${pills}</span>`;
  }

  clDayName(iso) {
    const day = new Date(iso), today = new Date(), ago = Math.round((new Date(today.getFullYear(), today.getMonth(), today.getDate()) - new Date(day.getFullYear(), day.getMonth(), day.getDate())) / 864e5);
    if (ago === 0) return this.t("clToday");
    if (ago === 1) return this.t("clYesterday");
    return new Intl.DateTimeFormat(this.lang, { weekday: "long", day: "numeric", month: "long", year: day.getFullYear() === today.getFullYear() ? undefined : "numeric" }).format(day);
  }

  // The list of the page: the standard table with search, filters, sorting and pages.
  clList(log, { flap }) {
    const id = "checklog";
    const rows = this.clRows(log).filter(r => (!this.clCheck || (r.e.kind === "change" && `${r.e.area}/${r.e.check}` === this.clCheck)) && (!flap || (r.e.kind === "change" && r.e.flaps)));
    const sorts = [
      { key: "time", label: "clColTime", dir: "desc", get: r => r.e.at },
      { key: "event", label: "clColEvent", dir: "asc", get: r => r.title },
      { key: "area", label: "clColArea", dir: "asc", get: r => r.areaName },
      { key: "level", label: "clColChange", dir: "desc", get: r => r.rank },
    ];
    const areas = [...new Set(rows.map(r => r.area))].sort((a, b) => this.clAreaName(a).localeCompare(this.clAreaName(b), this.lang));
    const levels = ["attention", "problem", "note", "ok"];
    const bar = this.listBar(id, { table: true, dense: true, sorts, filters: [
      { name: "area", all: this.t("clAllAreas"), options: areas.map(a => [a, this.clAreaName(a)]) },
      { name: "level", all: this.t("clAllLevels"), options: levels.map(l => [l, l === "attention" ? this.t("clOnlyProblems") : this.t(`clLevel_${l}`)]) },
    ] });
    const attention = e => e.kind === "change" && (e.to === "problem" || e.to === "note");
    const refined = this.refine(id, rows, {
      text: r => `${r.areaName} ${r.title} ${r.sub}`,
      filters: { area: (r, v) => r.area === v, level: (r, v) => (v === "attention" ? attention(r.e) : r.e.kind === "change" && r.e.to === v) },
      sorts, tie: r => r.e.at + r.key,
    });
    const pg = this.paginate(id, refined);
    const menu = r => this.clMenu(r);
    const columns = [
      { key: "event", label: "clColEvent", dir: "asc", cell: r => this.clNameCell(r) },
      { key: "time", label: "clColTime", dir: "desc", cell: r => this.esc(this.formatDate(r.e.at)) },
      { key: "area", label: "clColArea", dir: "asc", cell: r => `<span class="pill mute">${this.esc(r.areaName)}</span>` },
      { key: "level", label: "clColChange", dir: "desc", cell: r => this.clChangeCell(r) },
      ...(refined.some(r => menu(r)) ? [{ key: "menu", label: "rowMenu", menu: true, narrow: true, sortable: false, cell: menu }] : []),
    ];
    const tone = r => (r.e.dismissed ? "" : r.tone === "red" ? ' data-rowtone="red"' : r.tone === "warn" ? ' data-rowtone="warn"' : "");
    const [area, check] = (this.clCheck || "/").split("/");
    const note = this.clCheck ? this.filterNote([this.t("clOnlyCheckOn", { what: `${this.clAreaName(area)} · ${this.clCheckName(area, check)}` })], "data-cl-check-off") : "";
    const empty = !log.entries.length
      ? `<div class="emptymsg mute"><ha-icon icon="mdi:history"></ha-icon><strong>${this.t("clEmpty")}</strong>${this.t("clEmptyNext", { days: log.retention_days, max: this.formatNumber(log.max_events) })}</div>`
      : `<div class="emptymsg">${this.noMatches(id)}</div>`;
    // Under the time sort a heading row opens each day: today, yesterday, then the date.
    const dayOf = r => new Date(r.e.at).toDateString(), grouped = this.lv[id].sort === "time";
    const dayRow = (r, cols) => {
      const i = pg.rows.indexOf(r);
      if (!grouped || (i > 0 && dayOf(pg.rows[i - 1]) === dayOf(r))) return "";
      return `<tr class="static daygroup"><td colspan="${cols}">${this.esc(this.clDayName(r.e.at))}</td></tr>`;
    };
    const table = refined.length ? this.listTable(id, columns, pg.rows, { cls: "cl", before: dayRow, rowAttrs: r => `class="static${r.e.dismissed ? " cldim" : ""}"${tone(r)}` }) : empty;
    const foot = `<div class="pad"><small class="mute">${this.t("clRetention", { days: log.retention_days, max: this.formatNumber(log.max_events) })}</small></div>`;
    return `<section class="panel">${note}${bar}${table}${pg.footer}${foot}</section>`;
  }

  clStrips(log) {
    if (!log.strips?.length) return "";
    const lines = log.strips.map(s => {
      const label = this.clAreaName(s.area);
      const bar = s.segments.map(g => `<i class="cl-${g.level}" style="flex:${Math.max(g.share, 0.001)}"></i>`).join("");
      return `<div class="clstripline"><button type="button" class="linkbtn" data-lf-set="checklog|area|${this.esc(s.area)}" title="${this.esc(this.t("clStripFilter", { area: label }))}">${this.esc(label)}</button><span class="clstrip" role="img" aria-label="${this.esc(label)}">${bar}</span></div>`;
    }).join("");
    const legend = [["ok", "clLegendOk"], ["note", "clLegendNote"], ["problem", "clLegendProblem"], ["unknown", "clLegendUnknown"], ["none", "clLegendNone"]].map(([k, key]) => `<span><i class="cl-${k}"></i>${this.t(key)}</span>`).join("");
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("clStrips")}</h2><p>${this.t("clStripsHint", { days: log.days })}</p></div></div><div class="clstrips">${lines}</div><div class="cllegend">${legend}</div></section>`;
  }

  checkLogView() {
    this.ensureCheckLog();
    const log = this.checkLog;
    const days = this.clDays || 7;
    const windows = CL_DAYS.map(d => `<button type="button" class="chip${days === d ? " active" : ""}" data-cl-days="${d}" aria-pressed="${days === d}">${this.t(`clDays_${d}`)}</button>`).join("");
    this.lvState("checklog", "time", "desc"); // before the tiles: they set its filters
    this.clRegisterExport();
    const bar = this.pageBar({ left: windows, at: this.loadedAt("checklog"), loading: this.clLoading, attr: "data-cl-refresh" });
    if (this.clError) return `<div class="stack">${bar}<div class="panel">${this.notice("err", this.t("clLoadError"))}<div class="pad"><small>${this.esc(this.clError)}</small></div></div></div>`;
    if (!log) return `<div class="stack">${bar}<div class="panel">${this.skeleton("loading")}</div></div>`;
    const sum = log.summary || {};
    const tiles = this.sumTiles([
      { label: this.t("clTileChanges"), value: this.formatNumber(sum.changes || 0), sub: this.t("clTileChangesSub", { days: log.days }), tone: "mute", lf: ["checklog", "", ""] },
      { label: this.t("clTileProblems"), value: this.formatNumber(sum.problems || 0), sub: this.t("clTileProblemsSub"), tone: sum.problems ? "red" : "ok", lf: ["checklog", "level", "problem"] },
      { label: this.t("clTileFlapping"), value: this.formatNumber(sum.flapping || 0), sub: this.t("clTileFlappingSub"), tone: sum.flapping ? "warn" : "ok", attr: ["data-cl-flap", ""], active: Boolean(this.clFlap) && Boolean(sum.flapping) },
      { label: this.t("clTileRestarts"), value: this.formatNumber(sum.restarts || 0), sub: this.t("clTileRestartsSub"), tone: "mute", lf: ["checklog", "area", "restarts"] },
      { label: this.t("clTileUpdates"), value: this.formatNumber(sum.updates || 0), sub: this.t("clTileUpdatesSub"), tone: "mute", lf: ["checklog", "area", "updates"] },
      { label: this.t("clTileLongest"), value: sum.longest_problem_seconds ? this.esc(this.clHours(sum.longest_problem_seconds)) : "–", sub: this.t("clTileLongestSub"), tone: "mute" },
    ]);
    const rec = log.recurring || [];
    const recText = rec.length === 1 ? this.t("clRecurring", { what: `${this.clAreaName(rec[0].area)} · ${this.clCheckName(rec[0].area, rec[0].check)}`, n: rec[0].count }) : rec.length ? this.t("clRecurringMany", { n: rec.length, what: `${this.clAreaName(rec[0].area)} · ${this.clCheckName(rec[0].area, rec[0].check)}` }) : "";
    const recur = rec.length ? `<div class="panel"><div class="row" data-rowtone="warn"><span class="tile warn"><ha-icon icon="mdi:repeat"></ha-icon></span><span class="row-text"><strong>${this.esc(recText)}</strong></span><button type="button" class="btn" data-jump="reliability">${this.t("clRecurringOpen")}</button></div></div>` : "";
    const flapN = sum.flapping || 0, flap = Boolean(this.clFlap) && flapN > 0;
    const flapStrip = flapN ? `<div class="panel"><div class="row" data-rowtone="warn"><span class="tile warn"><ha-icon icon="mdi:swap-vertical"></ha-icon></span><span class="row-text"><strong>${this.esc(this.t(flapN === 1 ? "clFlapText_1" : "clFlapText_n", { n: flapN }))}</strong></span><button type="button" class="btn" data-cl-flap aria-pressed="${flap}">${this.t(flap ? "clFlapAll" : "clFlapOnly")}</button></div></div>` : "";
    const list = this.clList(log, { flap });
    return `<div class="stack">${bar}${tiles}${recur}${flapStrip}${this.clStrips(log)}${list}</div>`;
  }

  // What the export holds: every change of the period (ids and numbers only), also the ones the page does not draw.
  clRegisterExport() {
    const rows = () => (this.checkLog?.entries || []).filter(e => e.kind === "change").map(e => [e.at, e.area, e.check, e.from, e.to,
      Object.entries(e.cause || {}).map(([k, v]) => `${k}=${v}`).join("; "), e.lasted_seconds ?? "", e.dismissed || ""]);
    this.setExporter("checklog", this.t("clExpName"), ["clExpAt", "clExpArea", "clExpCheck", "clExpFrom", "clExpTo", "clExpCause", "clExpLasted", "clExpDismissed"].map(k => this.t(k)), rows);
  }

  bindCheckLog(root) {
    root.querySelectorAll("[data-cl-mark]").forEach(el => el.onclick = () => { const v = el.dataset.clMark, cut = v.lastIndexOf("|"); this.clMark(v.slice(0, cut), v.slice(cut + 1)); });
    root.querySelectorAll("[data-cl-unmark]").forEach(el => el.onclick = () => this.clMark(el.dataset.clUnmark, null));
    root.querySelectorAll("[data-cl-check]").forEach(el => el.onclick = () => { this.clCheck = el.dataset.clCheck; this.render(); });
    root.querySelector("[data-cl-check-off]")?.addEventListener("click", () => { this.clCheck = ""; this.render(); });
    root.querySelectorAll("[data-cl-days]").forEach(el => el.onclick = () => { this.clDays = Number(el.dataset.clDays); this.loadCheckLog(); });
    root.querySelector("[data-cl-flap]")?.addEventListener("click", () => { this.clFlap = !this.clFlap; this.render(); });
    root.querySelector("[data-cl-refresh]")?.addEventListener("click", () => this.loadCheckLog());
  }
}
