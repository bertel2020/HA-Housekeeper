// SafetyMixin: the thin status line under the navigation that says how safe the writing parts are.
const MODES = ["read_only", "confirmed", "full"];
// What each step allows and blocks, as text keys; and the table: [text key, index of the first step that allows it].
const MODE_INFO = {
  read_only: { allow: ["modeA_view", "modeA_plan", "modeA_notes"], block: ["modeB_run", "modeB_undo"] },
  confirmed: { allow: ["modeA_disable", "modeA_rebuild", "modeA_undo", "modeA_backup"], block: ["modeB_purge", "modeB_trim", "modeB_backups", "modeB_recorder"] },
  full: { allow: ["modeA_same", "modeB_purge", "modeB_trim", "modeB_backups", "modeB_recorder"], block: [] },
};
const MODE_TABLE = [["modeR_view", 0], ["modeR_run", 1], ["modeR_undo", 1], ["modeR_final", 2], ["modeR_recorder", 2]];

class SafetyMixin {
  ensureSafetyData() {
    if (this.journal === null && !this._journalRequested) { this._journalRequested = true; this.loadJournal(); }
    this.ensureBackup();
  }

  // Each item is [key, tone, text, target view]; what needs a look (red, then yellow) comes first, the rest keeps its order.
  // Nothing is invented when data is missing.
  safetyItems() {
    const items = [], plans = this.journal || [];
    const mode = this.data?.meta?.protection || "read_only";
    items.push(["mode", mode === "full" ? "mute" : "warn", this.t(`safeMode_${mode}`), "settings"]);
    items.push(["view", "mute", this.t("safeView", { view: this.t(`view_${this.prefs.view}`) }), "settings"]);
    const check = this.backup?.available ? (this.backup.checks || []).find(c => c.id === "newest") : null;
    if (this.plan && ["backup", "running"].includes(this.plan.status)) items.push(["run", "warn", this.t(this.plan.status === "backup" ? "safeBackupRunning" : "safeRunning"), "journal"]);
    if (check) items.push(["backup", check.level === "ok" ? "ok" : "warn", check.values?.age_hours === null || check.values?.age_hours === undefined ? this.t("safeNoBackup") : this.t("safeBackup", { age: this.bhAge(check.values.age_hours, true) }), "maintenance"]);
    const last = plans.find(p => p.finished_at);
    if (last) items.push(["last", last.undoable ? "ok" : "mute", `${this.t("safeLast", { when: this.shortDay(last.finished_at) })} · ${this.t(last.undoable ? "safeUndo" : "safeNoUndo")}`, "journal", `${this.t("safeLast", { when: this.formatDate(last.finished_at) })} · ${this.t(last.undoable ? "safeUndoTip" : "safeNoUndoTip")}`]);
    if (this.scanCoverageComplete()) items.push(["coverage", "ok", this.t("covBar"), "settings"]);
    // AI access while it is on, so it is not forgotten; yellow while it may change the list.
    const mcp = this.data?.meta?.mcp;
    if (mcp?.enabled) {
      const off = mcp.off_at ? ` · ${this.t("mcpOffAt", { date: `${this.mcpDay(mcp.off_at)}, ${this.mcpTime(mcp.off_at).slice(0, 5)}` })}` : "";
      items.push(["ai", mcp.write ? "warn" : "mute", `${this.t("safeAi", { mode: this.t(mcp.write ? "mcpBarWrite" : "mcpBarRead") })}${off}`, "settings"]);
    }
    const watching = plans.filter(p => p.followup === "watching").length;
    if (watching) items.push(["watch", "warn", this.t(watching === 1 ? "safeWatching1" : "safeWatching", { n: watching }), "journal"]);
    const regress = plans.filter(p => p.followup === "regression").length;
    if (regress) items.push(["regress", "red", this.t("safeRegression", { n: regress }), "journal"]);
    const rank = tone => ({ red: 0, warn: 1 })[tone] ?? 2;
    return items.map((item, i) => [item, i]).sort((a, b) => rank(a[0][1]) - rank(b[0][1]) || a[1] - b[1]).map(([item]) => item);
  }

  // "16 Oct", with the year once it is not this year's any more: the bar needs the day, the journal has the rest.
  shortDay(value) {
    const at = new Date(value);
    if (Number.isNaN(at.getTime())) return "—";
    try { return new Intl.DateTimeFormat(this.lang, { day: "numeric", month: this.lang === "de" ? "numeric" : "short", ...(Date.now() - at.getTime() > 330 * 864e5 ? { year: "numeric" } : {}) }).format(at); }
    catch (_) { return String(value); }
  }

  // Settings > Scan: the protection mode, which the server enforces, and the events Housekeeper fires.
  // The protection mode: one card per step with what it allows and what it blocks, then a table of the same by kind of change.
  protectionCard() {
    const mode = this.data?.meta?.protection || "read_only";
    const icons = { read_only: "mdi:eye-outline", confirmed: "mdi:shield-check-outline", full: "mdi:shield-lock-outline" };
    const chips = (keys, cls) => keys.length ? keys.map(k => `<i class="${cls}">${this.t(k)}</i>`).join("") : `<i>${this.t("modeNothing")}</i>`;
    const options = MODES.map(m => `<label class="modeopt${m === mode ? " on" : ""}"><input type="radio" name="hk-protection" value="${m}" data-protection ${m === mode ? "checked" : ""}><span class="tile ${m === mode ? (m === "full" ? "ok" : "warn") : "mute"}"><ha-icon icon="${icons[m]}"></ha-icon></span><span class="row-text"><strong>${this.t(`mode_${m}`)}</strong><small>${this.t(`modeText_${m}`)}</small><span class="modelbl">${this.t("modeAllowed")}</span><span class="viewchips">${chips(MODE_INFO[m].allow, "okchip")}</span><span class="modelbl">${this.t("modeBlockedLbl")}</span><span class="viewchips">${chips(MODE_INFO[m].block, "nochip")}</span>${m === "full" ? `<small>${this.t("modeFullNote")}</small>` : ""}</span></label>`).join("");
    const cell = (row, m) => (MODES.indexOf(m) >= row[1] ? `<td class="yes" aria-label="${this.esc(this.t("modeYes"))}">✓</td>` : `<td class="no">${this.t("modeLocked")}</td>`);
    const table = `<div class="tablewrap lt viewcmp"><table><thead><tr><th scope="col"></th>${MODES.map(m => `<th scope="col">${this.t(`mode_${m}`)}</th>`).join("")}</tr></thead><tbody>${MODE_TABLE.map(row => `<tr><td>${this.t(row[0])}</td>${MODES.map(m => cell(row, m)).join("")}</tr>`).join("")}</tbody></table></div>`;
    return `<section class="panel modepanel"><div class="panelhead"><div><h2>${this.t("modeTitle")}</h2><p>${this.t("modeHint")}</p></div><span class="pill ${mode === "full" ? "ok" : "warn"}">${this.t(`modeBadge_${mode}`)}</span></div>
      ${this.data?.meta?.protection_migrated ? `<p class="factnote" role="status">${this.t("modeMigrated")}</p>` : ""}
      <div class="modeopts" role="radiogroup" aria-label="${this.esc(this.t("modeLabel"))}">${options}</div>
      <p class="sect">${this.t("modeTableTitle")}</p>${table}
      <p class="modefoot"><ha-icon icon="mdi:information-outline"></ha-icon><span>${this.t("modeFoot")}</span></p></section>`;
  }

  eventsCard() {
    const rows = ["critical_finding", "backup_overdue", "quarantine_expired", "followup_regression", "integration_down", "reminder_due"].map(e => `<tr><td><code>ha_housekeeper_${e}</code></td><td>${this.t(`event_${e}`)}</td><td class="evcopy"><button class="iconbtn" data-copy-event="ha_housekeeper_${e}" title="${this.esc(this.t("eventCopy"))}" aria-label="${this.esc(this.t("eventCopy"))}"><ha-icon icon="${this.copiedEvent === e ? "mdi:check" : "mdi:content-copy"}"></ha-icon></button></td></tr>`).join("");
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("eventsTitle")}</h2><p>${this.t("eventsHint")}</p></div></div><div class="tablewrap"><table class="evtable"><thead><tr><th>${this.t("eventColName")}</th><th>${this.t("eventColWhen")}</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
  }

  async setProtection(mode) {
    try { await this._hass.callWS({ type: "ha_housekeeper/protection_set", mode }); this.data.meta.protection = mode; }
    catch (err) { this.failed(err); }
    this.render();
  }

  safetyBar() {
    if (!this.data) return "";
    const items = this.safetyItems();
    if (!items.length) return "";
    return `<div class="safebar" role="region" aria-label="${this.esc(this.t("safeLabel"))}">${items.map(([key, tone, text, view, tip]) => `<button class="safeitem ${tone}" data-safe="${view}" data-safe-key="${key}"${key === "watch" ? ` title="${this.esc(this.t("safeWatchingTip"))}"` : tip ? ` title="${this.esc(tip)}"` : ""}><span class="dot ${tone}" aria-hidden="true"></span>${this.esc(text)}</button>`).join("")}</div>`;
  }
}
Object.assign(TEXT.de, {
  safeLabel: "Sicherheitsstatus", safeBackup: "Letztes Backup: vor {age}", safeNoBackup: "Kein Backup gefunden",
  safeLast: "Letzter Plan: {when}", safeUndo: "rückgängig möglich", safeNoUndo: "endgültig", safeUndoTip: "Mit dem Backup lässt sich der Plan zurücknehmen. Klick öffnet das Journal.", safeNoUndoTip: "Nicht mehr rückgängig: das Backup dazu ist weg oder zu alt. Klick öffnet das Journal.", safeView: "Ansicht: {view}", safeAi: "KI-Zugriff: {mode}",
  safeRunning: "Ein Plan läuft", safeBackupRunning: "Backup für einen Plan läuft", safeWatching: "{n} Pläne werden nachbeobachtet", safeWatching1: "1 Plan wird nachbeobachtet", safeWatchingTip: "Bis 24 Stunden nach der Ausführung prüft Housekeeper bei jedem Scan, ob neue Befunde dazugekommen sind.", safeRegression: "{n} Rückfall nach Änderung",
  healthScore: "{percent} / 100 gesund", healthAffected: "{affected} von {base} bewerteten Objekten betroffen",
  healthWord_ok: "In Ordnung", healthWord_warn: "Prüfen nötig", healthWord_red: "Handlungsbedarf",
  causeCounts: "{parts} betroffen", causeN_entity: "{n} Entitäten", causeN_automation: "{n} Automationen", causeN_script: "{n} Skripte", causeN_dashboard: "{n} Dashboards", causeN_entity1: "1 Entität", causeN_automation1: "1 Automation", causeN_script1: "1 Skript", causeN_dashboard1: "1 Dashboard",
});
Object.assign(TEXT.en, {
  safeLabel: "Safety status", safeBackup: "Last backup: {age} ago", safeNoBackup: "No backup found",
  safeLast: "Last plan: {when}", safeUndo: "undo available", safeNoUndo: "final", safeUndoTip: "The plan can be rolled back with its backup. A click opens the journal.", safeNoUndoTip: "No longer undoable: the backup for it is gone or too old. A click opens the journal.", safeView: "View: {view}", safeAi: "AI access: {mode}",
  safeRunning: "A plan is running", safeBackupRunning: "Backup for a plan is running", safeWatching: "{n} plans are being watched", safeWatching1: "1 plan is being watched", safeWatchingTip: "For up to 24 hours after the run, Housekeeper checks at every scan whether new findings appeared.", safeRegression: "{n} regression after a change",
  healthScore: "{percent} / 100 healthy", healthAffected: "{affected} of {base} rated objects affected",
  healthWord_ok: "All good", healthWord_warn: "Needs a look", healthWord_red: "Action needed",
  causeCounts: "{parts} affected", causeN_entity: "{n} entities", causeN_automation: "{n} automations", causeN_script: "{n} scripts", causeN_dashboard: "{n} dashboards", causeN_entity1: "1 entity", causeN_automation1: "1 automation", causeN_script1: "1 script", causeN_dashboard1: "1 dashboard",
});
Object.assign(TEXT.de, {
  modeBadge_full: "Alles", modeBadge_confirmed: "Ändern", modeBadge_read_only: "Beobachten",
  safeMode_full: "Schutzmodus: Alles", safeMode_confirmed: "Schutzmodus: Ändern", safeMode_read_only: "Schutzmodus: Beobachten",
  modeTitle: "Schutzmodus", modeHint: "Legt auf dem Server fest, was Pläne ändern dürfen. Das gilt für Bestätigen, Starten und Rückgängig, nicht nur für Knöpfe im Panel. Pläne anlegen und alle Seiten ansehen bleibt immer erlaubt. Ausnahmen, Notizen und der KI-Zugriff haben eigene Schalter.", modeLabel: "Was Housekeeper ändern darf",
  mode_read_only: "Beobachten", mode_confirmed: "Ändern", mode_full: "Alles",
  modeText_read_only: "Housekeeper schaut nur. Für den Einstieg und für alle, die nichts ändern lassen wollen.", modeText_confirmed: "Ändern mit Einzelbestätigung und Backup. Der Alltag für die meisten.", modeText_full: "Auch Endgültiges. Nur wenn du weißt, was es kostet.",
  modeAllowed: "Erlaubt", modeBlockedLbl: "Gesperrt", modeNothing: "nichts", modeYes: "erlaubt", modeLocked: "gesperrt", modeTableTitle: "Was bei welcher Stufe geht",
  modeA_view: "Alle Seiten ansehen", modeA_plan: "Pläne anlegen und prüfen", modeA_notes: "Ausnahmen und Notizen", modeA_disable: "Deaktivieren und Entfernen", modeA_rebuild: "Umbauen, Ersetzen, Tauschen", modeA_undo: "Rückgängig", modeA_backup: "Backup vor jedem Plan", modeA_same: "Alles aus „Ändern“",
  modeB_run: "Plan bestätigen und starten", modeB_undo: "Rückgängig", modeB_purge: "Statistik löschen", modeB_trim: "Verlauf kürzen", modeB_backups: "Backups löschen", modeB_recorder: "Recorder-Reparaturen",
  modeR_view: "Seiten ansehen, Pläne anlegen und prüfen", modeR_run: "Plan bestätigen und starten (deaktivieren, entfernen, umbauen)", modeR_undo: "Rückgängig", modeR_final: "Statistik löschen, Verlauf kürzen, Backups löschen", modeR_recorder: "Recorder-Reparaturen (Zähler, Bereich)",
  modeFullNote: "Endgültiges lässt sich nicht rückgängig machen, auch nicht mit einem Backup von Housekeeper.",
  modeFoot: "Eine neue Installation beginnt in „Beobachten“. Eine frühere Stufe „Quarantäne“ gilt jetzt als „Beobachten“, nie als „Alles“. Die Stufe wird auf dem Server geprüft, nicht nur im Panel.",
  modeMigrated: "Die Stufe „Nur Quarantäne“ gibt es nicht mehr. Housekeeper steht jetzt auf „Beobachten“. Wähle die Stufe, die du willst.",
  plan: "Plan", planPageSubtitle: "Vorschau, Prüfung und Ergebnis eines Plans. Nichts wird geändert, bevor du bestätigst.", planNone: "Dieser Plan ist nicht mehr geöffnet. Alle Pläne stehen im Journal.",
  nothingToRun: "Noch nichts zum Ausführen: Hake darunter an, dass du die zu prüfenden Einträge gesehen hast.",
  modeBlockTitle: "Der Schutzmodus „{mode}“ erlaubt diesen Plan nicht", modeBlockText: "{count} Schritt(e) darf Housekeeper in diesem Modus nicht ausführen. Du kannst den Plan ansehen, aber erst nach einer Änderung des Modus bestätigen.", modeBlockLink: "Schutzmodus ändern",
  err_protection_mode: "Der Schutzmodus erlaubt das nicht. Ändere ihn unter Einstellungen → Schutzmodus.",
  eventsTitle: "Ereignisse für eigene Automationen", eventsHint: "Nach jedem Scan löst Housekeeper für jede neue Lage ein Ereignis aus, einmal je Lage, beim ersten Mal still. Nichts verlässt Home Assistant.", eventColName: "Ereignis", eventColWhen: "Wann", eventCopy: "Namen kopieren",
  event_critical_finding: "neuer Befund mit hoher Auswirkung", event_backup_overdue: "Backup überfällig", event_quarantine_expired: "Quarantäne abgelaufen", event_followup_regression: "Nachkontrolle: Rückfall", event_integration_down: "Integration nicht geladen",
});
Object.assign(TEXT.en, {
  modeBadge_full: "Everything", modeBadge_confirmed: "Change", modeBadge_read_only: "Watch",
  safeMode_full: "Protection mode: Everything", safeMode_confirmed: "Protection mode: Change", safeMode_read_only: "Protection mode: Watch",
  modeTitle: "Protection mode", modeHint: "Sets on the server what plans may change. It holds for confirming, starting and undoing, not only for buttons in the panel. Making plans and looking at every page stay allowed. Exceptions, notes and AI access have their own switches.", modeLabel: "What Housekeeper may change",
  mode_read_only: "Watch", mode_confirmed: "Change", mode_full: "Everything",
  modeText_read_only: "Housekeeper only looks. For getting started and for anyone who wants nothing changed.", modeText_confirmed: "Changes with one-by-one confirmation and a backup. Everyday use for most.", modeText_full: "Including what cannot be undone. Only if you know what it costs.",
  modeAllowed: "Allowed", modeBlockedLbl: "Blocked", modeNothing: "nothing", modeYes: "allowed", modeLocked: "blocked", modeTableTitle: "What each step can do",
  modeA_view: "Look at every page", modeA_plan: "Make and check plans", modeA_notes: "Exceptions and notes", modeA_disable: "Disable and remove", modeA_rebuild: "Rebuild, replace, swap", modeA_undo: "Undo", modeA_backup: "Backup before every plan", modeA_same: "Everything from \"Change\"",
  modeB_run: "Confirm and start a plan", modeB_undo: "Undo", modeB_purge: "Delete statistics", modeB_trim: "Trim history", modeB_backups: "Delete backups", modeB_recorder: "Recorder repairs",
  modeR_view: "Look at pages, make and check plans", modeR_run: "Confirm and start a plan (disable, remove, rebuild)", modeR_undo: "Undo", modeR_final: "Delete statistics, trim history, delete backups", modeR_recorder: "Recorder repairs (counter, range)",
  modeFullNote: "What cannot be undone stays gone, even with a backup from Housekeeper.",
  modeFoot: "A new installation starts in \"Watch\". The former step \"Quarantine\" now counts as \"Watch\", never as \"Everything\". The step is checked on the server, not only in the panel.",
  modeMigrated: "The step “Quarantine only” no longer exists. Housekeeper is now set to “Watch”. Choose the step you want.",
  plan: "Plan", planPageSubtitle: "Preview, check and result of a plan. Nothing changes before you confirm.", planNone: "This plan is no longer open. All plans are in the journal.",
  nothingToRun: "Nothing to run yet: tick the box below this line to say you have seen the entries to review.",
  modeBlockTitle: "The protection mode “{mode}” does not allow this plan", modeBlockText: "Housekeeper may not run {count} step(s) in this mode. You can look at the plan, but only confirm it after changing the mode.", modeBlockLink: "Change protection mode",
  err_protection_mode: "The protection mode does not allow this. Change it under Settings → Protection mode.",
  eventsTitle: "Events for your own automations", eventsHint: "After each scan Housekeeper fires an event for each new situation, once per situation, silent the first time. Nothing leaves Home Assistant.", eventColName: "Event", eventColWhen: "When", eventCopy: "Copy name",
  event_critical_finding: "new finding with high impact", event_backup_overdue: "backup overdue", event_quarantine_expired: "quarantine expired", event_followup_regression: "follow-up: regression", event_integration_down: "integration not loaded",
});
