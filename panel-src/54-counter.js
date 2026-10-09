// CounterMixin: find sensor glitches in counters (a wrong reading that comes back) and repair the recorder rows.
class CounterMixin {
  async loadCounterScan(refresh = false) {
    this.counterLoading = true; this.counterError = ""; this.render();
    try {
      const id = (this.counterId || "").trim();
      this.counterScan = await this._hass.callWS({ type: "ha_housekeeper/counter_scan", refresh, ...(id ? { statistic_id: id } : {}) });
    } catch (err) { this.counterError = err?.message || String(err); }
    this.counterLoading = false; this.render();
  }

  // The reading before and after the repair around one glitch: original dashed, repaired solid.
  counterChart(series) {
    if (!series || series.length < 3) return "";
    const w = 360, h = 90, pad = 4;
    const xs = series.map(p => p[0]), ys = series.flatMap(p => [p[1], p[2]]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const sx = x => pad + ((x - x0) / Math.max(1, x1 - x0)) * (w - 2 * pad);
    const sy = y => h - pad - ((y - y0) / Math.max(1e-9, y1 - y0)) * (h - 2 * pad);
    const line = i => series.map(p => `${sx(p[0]).toFixed(1)},${sy(p[i]).toFixed(1)}`).join(" ");
    return `<svg role="img" aria-label="${this.esc(this.t("counterChartLabel"))}" viewBox="0 0 ${w} ${h}" width="100%" style="max-width:${w}px;display:block;margin:6px 0"><polyline fill="none" stroke="var(--hk-red)" stroke-width="1.5" stroke-dasharray="4 3" points="${line(1)}"/><polyline fill="none" stroke="var(--hk-green)" stroke-width="2" points="${line(2)}"/></svg><small style="display:block;opacity:.8"><span style="color:var(--hk-red)">- - -</span> ${this.t("counterOriginal")} · <span style="color:var(--hk-green)">───</span> ${this.t("counterRepaired")}</small>`;
  }

  counterRange(f) {
    return `${this.formatDate(f.bad_first * 1000)} – ${this.formatDate(f.bad_last * 1000)}`;
  }

  // What a counter repair will change, per glitch and per table.
  counterDetail(action) {
    if (action.kind === "repair_range") return this.rangeDetail(action);
    const c = action.counter || {}, unit = c.unit || "";
    const n = v => this.formatNumber(Math.round(v * 1000) / 1000);
    const lines = (c.findings || []).map(f => `${this.t("counterFinding", { range: this.counterRange(f), low: n(f.low), high: n(f.high), before: n(f.good_before), after: n(f.good_after), unit })}`);
    const counts = c.counts || {};
    const rows = this.t("counterRows", { states: counts.states || 0, short: counts.short_term || 0, long: counts.long_term || 0, tail: (counts.tail_long_term || 0) + (counts.tail_short_term || 0) });
    const skipped = Object.entries(c.skipped || {}).map(([table, list]) => this.t("counterSkipped", { table: this.t(`counterTable_${table}`), count: list.length })).join(" ");
    const undone = action.result?.state === "undone" ? `<small style="display:block">${this.t("counterUndone")}</small>` : "";
    const charts = (c.findings || []).slice(0, 3).map(f => this.counterChart(f.series)).join("");
    return `<span style="display:block;padding:6px 0 0">${lines.map(l => `<small style="display:block">${this.esc(l)}</small>`).join("")}<small style="display:block">${this.esc(rows)}</small>${skipped ? `<small style="display:block;color:var(--hk-amber)">${this.esc(skipped)}</small>` : ""}${charts}${undone}</span>`;
  }

  // One table of a range cleanup: the first rows with the old and the new value.
  rangeTable(name, rows, cols, count, extra = "") {
    const n = v => v == null ? "–" : this.esc(this.formatNumber(Math.round(Number(v) * 1000) / 1000));
    const cell = v => Array.isArray(v) ? v.map(n).join(" / ") : n(v);
    const head = (cols || []).map(c => this.t(`rangeCol_${c}`)).join(" / ");
    const body = rows.map(r => `<tr><td>${r[0] ? this.esc(this.formatDate(r[0] * 1000)) : "–"}</td><td>${cell(r[1])}</td><td>→</td><td>${cell(r[2])}</td></tr>`).join("");
    const more = count > rows.length ? `<small style="display:block">${this.esc(this.t("rangeMoreRows", { count: this.formatNumber(count - rows.length) }))}</small>` : "";
    return `<details><summary>${this.esc(this.t(`counterTable_${name}`))} · ${this.formatNumber(count)}${head ? ` · ${this.esc(head)}` : ""}</summary>${count ? `<table style="width:100%;font-size:12px;border-collapse:collapse;margin:4px 0"><tbody>${body}</tbody></table>${more}` : `<small style="display:block">${this.t("rangeNothingHere")}</small>`}${extra}</details>`;
  }

  // What a range cleanup will do: where the data is, what is replaced by what, per table.
  rangeDetail(action) {
    const c = action.counter || {}, unit = c.unit ? ` ${c.unit}` : "";
    const n = v => v == null ? "–" : `${this.formatNumber(Math.round(v * 1000) / 1000)}${unit}`;
    const range = c.range || action.range || {}, counts = c.counts || {}, avail = c.available || {}, d = c.detail || {};
    const line = text => `<small style="display:block">${this.esc(text)}</small>`;
    const warn = text => `<small style="display:block;color:var(--hk-amber)">${this.esc(text)}</small>`;
    const out = [line(this.t("rangeWhat", { kind: this.t(`rangeKind_${c.kind || "counter"}`), range: `${this.formatDate(range.from * 1000)} – ${this.formatDate(range.to * 1000)}`, mode: this.t(`rangeMode_${action.mode || "hold"}`) + (range.fixed != null ? ` (${n(range.fixed)})` : "") }))];
    if (c.bracket) out.push(line(this.t("rangeBracket", { before: n(c.bracket[1]), after: n(c.bracket[3]) })));
    out.push(line(this.t("rangeAvail", { states: this.formatNumber(avail.states || 0), short: this.formatNumber(avail.short_term || 0), long: this.formatNumber(avail.long_term || 0) })));
    for (const t of ["states", "short_term", "long_term"]) if (c.available && !avail[t]) out.push(warn(this.t("rangeGone", { table: this.t(`counterTable_${t}`) })));
    if (counts.estimated_long_term) out.push(warn(this.t("rangeEstimated", { count: this.formatNumber(counts.estimated_long_term) })));
    if (counts.tail_short_term || counts.tail_long_term) out.push(line(this.t("rangeTail", { short: this.formatNumber(counts.tail_short_term || 0), long: this.formatNumber(counts.tail_long_term || 0) })));
    const skipped = Object.entries(c.skipped || {}).map(([table, list]) => this.t("counterSkipped", { table: this.t(`counterTable_${table}`), count: list.length })).join(" ");
    if (skipped) out.push(warn(skipped));
    const tables = [
      this.rangeTable("states", d.states || [], [], counts.states || 0),
      this.rangeTable("short_term", d.short_term?.rows || [], d.short_term?.cols, counts.short_term || 0),
      this.rangeTable("long_term", d.long_term?.rows || [], d.long_term?.cols, counts.long_term || 0),
    ].join("");
    const undone = action.result?.state === "undone" ? line(this.t("counterUndone")) : "";
    return `<span style="display:block;padding:6px 0 0">${out.join("")}${this.counterChart(c.series)}${tables}${undone}</span>`;
  }

  saveRange(root) {
    const read = (sel, old) => root.querySelector(sel)?.value ?? old ?? "";
    this.rangeFrom = read("[data-range-from]", this.rangeFrom); this.rangeTo = read("[data-range-to]", this.rangeTo); this.rangeFixed = read("[data-range-fixed]", this.rangeFixed);
    this.rangeMode = read("[data-range-mode]", this.rangeMode) || "hold";
  }

  // Picks the range from the two date fields; the plan is only created when the input makes sense.
  pickRange(root) {
    this.saveRange(root);
    const from = new Date(this.rangeFrom).getTime() / 1000, to = new Date(this.rangeTo).getTime() / 1000;
    const mode = this.rangeMode, fixed = Number(String(this.rangeFixed).replace(",", "."));
    this.counterSel = (this.counterId || "").trim();
    if (!this.counterSel || !(from < to) || (mode === "fixed" && !Number.isFinite(fixed))) { this.cleanupError = this.t("rangeNeedInput"); this.render(); return; }
    this.counterRangeReq = { mode, range: { from, to, ...(mode === "fixed" ? { fixed } : {}) } };
    this.createPlan();
  }

  rangeForm() {
    const mode = this.rangeMode || "hold";
    const stamp = value => this.esc(value || "");
    return `<div class="panelhead" style="margin-top:12px"><div><h2>${this.t("rangeTitle")}</h2><p>${this.t("rangeHint")}</p></div></div>
      <div class="setrow"><div><label>${this.t("rangeFrom")}</label></div><input type="datetime-local" data-range-from value="${stamp(this.rangeFrom)}" style="max-width:260px"></div>
      <div class="setrow"><div><label>${this.t("rangeTo")}</label></div><input type="datetime-local" data-range-to value="${stamp(this.rangeTo)}" style="max-width:260px"></div>
      <div class="setrow"><div><label>${this.t("counterMode")}</label></div><select data-range-mode style="max-width:460px">${["hold", "interpolate", "fixed"].map(m => `<option value="${m}" ${mode === m ? "selected" : ""}>${this.t(`rangeMode_${m}`)}</option>`).join("")}</select></div>
      ${mode === "fixed" ? `<div class="setrow"><div><label>${this.t("rangeFixed")}</label></div><input type="text" inputmode="decimal" data-range-fixed value="${stamp(this.rangeFixed)}" style="max-width:160px"></div>` : ""}
      <div class="setrow"><small style="margin:0">${this.t("rangeNote")}</small><button class="btn primary" data-range-pick ${this.cleanupBusy ? "disabled" : ""}>${this.cleanupBusy ? this.t("planCreating") : this.t("counterPreview")}</button></div>`;
  }

  counterCard() {
    const s = this.counterScan, mode = this.counterMode || "hold";
    const head = `<div class="panelhead"><div><h2>${this.t("counterTitle")}</h2><p>${this.t("counterHint")}</p></div><div class="actions">${this.kindSelect()}</div></div>`;
    const controls = `<div class="setrow"><div><label>${this.t("counterEntity")}</label><small>${this.t("counterEntityHint")}</small></div><input type="text" data-counter-id value="${this.esc(this.counterId || "")}" placeholder="sensor.water_meter" autocomplete="off" style="max-width:360px"></div>
      <div class="setrow"><div><label>${this.t("counterMode")}</label></div><select data-counter-mode style="max-width:460px">${["hold", "interpolate"].map(m => `<option value="${m}" ${mode === m ? "selected" : ""}>${this.t(`counterMode_${m}`)}</option>`).join("")}</select></div>
      <div class="setrow"><small style="margin:0">${this.t("counterScanNote")}</small><button class="btn primary" data-counter-scan ${this.counterLoading ? "disabled" : ""}>${this.counterLoading ? this.t("counterScanning") : this.t("counterScan")}</button></div>`;
    let body = "";
    if (this.counterError) body = `<div class="error">${this.esc(this.counterError)}</div>`;
    else if (s && !s.available) body = `<div class="emptymsg">${this.t("counterNoRecorder")}</div>`;
    else if (s?.busy) body = `<p class="factnote">${this.t("relBusy")}</p>`;
    else if (s) {
      const items = s.items.map(item => {
        const lines = item.findings.map(f => `<small style="display:block">${this.esc(this.t("counterFound", { range: this.counterRange(f), low: this.formatNumber(Math.round(f.low * 1000) / 1000), good: this.formatNumber(Math.round(f.good_before * 1000) / 1000), unit: item.unit || "" }))}</small>`).join("");
        return `<div class="row"><span class="tile warn"><ha-icon icon="mdi:chart-line-variant"></ha-icon></span><span class="row-text"><strong>${this.esc(item.name)}</strong><small>${this.esc(item.statistic_id)}</small>${lines}</span><button class="btn primary" data-counter-pick="${this.esc(item.statistic_id)}" ${this.cleanupBusy ? "disabled" : ""}>${this.cleanupBusy ? this.t("planCreating") : this.t("counterPreview")}</button></div>`;
      }).join("");
      body = `${items || `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("counterNone")}</div>`}<p class="factnote">${this.t("counterChecked", { count: this.formatNumber(s.checked) })}</p>`;
    }
    return `<div class="panel">${head}${controls}${body}${this.rangeForm()}</div>`;
  }

  bindCounter(root) {
    root.querySelector("[data-counter-id]")?.addEventListener("change", e => { this.counterId = e.target.value.trim(); });
    root.querySelector("[data-counter-mode]")?.addEventListener("change", e => { this.counterMode = e.target.value; });
    root.querySelector("[data-counter-scan]")?.addEventListener("click", () => this.loadCounterScan(true));
    root.querySelectorAll("[data-counter-pick]").forEach(el => el.addEventListener("click", () => { this.counterSel = el.dataset.counterPick; this.counterRangeReq = null; this.createPlan(); }));
    root.querySelector("[data-range-mode]")?.addEventListener("change", () => { this.saveRange(root); this.render(); });
    root.querySelector("[data-range-pick]")?.addEventListener("click", () => this.pickRange(root));
  }
}
Object.assign(TEXT.de, {
  kindCounter: "Sensorfehler bereinigen (falsche Werte in Verlauf und Statistik, Zähler und Messwerte, mit Backup)",
  counterTitle: "Zählerfehler finden und bereinigen", counterHint: "Ein Zähler darf nie sinken. Hat ein Sensor kurz einen falschen Wert geliefert (zum Beispiel ein Wasserzähler), zählt Home Assistant den Rücksprung als neuen Verbrauch. Housekeeper findet solche Ausreißer und ersetzt die falschen Werte im Verlauf, in den 5-Minuten-Werten und in den Stundenwerten; die verfälschte Summe wird neu berechnet. Ein Wert, der dauerhaft niedrig bleibt (Reset, Zählertausch), wird nie angefasst. Vor jedem Lauf entsteht ein Home-Assistant-Backup; die alten Werte bleiben im Journal und lassen sich zurückspielen, solange niemand die Zeilen danach geändert hat.",
  counterEntity: "Nur diesen Zähler prüfen", counterEntityHint: "Leer lassen, um alle Zähler mit Summe zu prüfen (letztes Jahr).", counterMode: "Womit werden falsche Werte ersetzt?",
  counterMode_hold: "Letzter guter Wert (empfohlen)", counterMode_interpolate: "Gerade Linie zum nächsten guten Wert",
  counterScan: "Zähler prüfen", counterScanning: "Wird geprüft …", counterScanNote: "Liest nur. Bei vielen Zählern kann das einen Moment dauern.", counterNoRecorder: "Ohne Recorder gibt es nichts zu prüfen.",
  counterNone: "Keine Ausreißer gefunden.", counterChecked: "{count} Zähler geprüft.", counterPreview: "Vorschau erstellen",
  counterFound: "{range}: niedrigster Wert {low} {unit} statt etwa {good} {unit}", counterFinding: "{range}: Werte zwischen {low} und {high} {unit}; gute Werte davor {before} und danach {after} {unit}.",
  counterRows: "Geändert werden {states} Verlaufswerte, {short} 5-Minuten-Werte und {long} Stundenwerte; die Summe wird in {tail} späteren Statistikzeilen berichtigt.",
  counterSkipped: "{table}: {count} Fund(e) nicht reparierbar (keine guten Werte davor oder danach).", counterTable_short_term: "5-Minuten-Werte", counterTable_long_term: "Stundenwerte",
  counterOriginal: "Original", counterRepaired: "repariert", counterChartLabel: "Verlauf vor und nach der Reparatur", counterUndone: "Die alten Werte sind wieder eingesetzt.",
  reason_counter_write: "Schreibt in die Recorder-Datenbank (Verlauf und Statistik). Ein Backup entsteht zuerst; die alten Werte lassen sich aus dem Journal zurückspielen.", reason_counter_partial: "Eine der Tabellen kann nicht repariert werden (zu wenig Werte davor oder danach); die anderen schon.",
  reason_no_counter_statistics: "Für diese ID gibt es keine Summenstatistik des Recorders.", reason_nothing_found: "Es gibt nichts zu ändern.", reason_too_many_rows: "Zu viele Zeilen für einen Lauf (mehr als 5000); den Zeitraum erst von Hand eingrenzen.",
  reason_schema_unknown: "Das Datenbankschema dieser Home-Assistant-Version ist Housekeeper nicht bekannt; nichts wird geschrieben.", reason_counter_changed: "Die Daten haben sich seit der Vorschau geändert.",
  confirmWordRepair: "REPARIEREN", confirmedSummaryRepair: "{count} Datenreparatur: Housekeeper legt zuerst ein Home-Assistant-Backup an und startet nur, wenn es erfolgreich ist. Danach überschreibt es falsche Werte im Verlauf und in der Statistik. Die alten Werte bleiben im Journal.",
  result_repaired: "Repariert", check_counter_clean: "Keine Ausreißer mehr", simRepaired: "{count} Sensoren bereinigt",
  abort_counter_changed: "Die Daten wurden nach der Vorschau geändert.", abort_recorder_busy: "Der Recorder ist gerade belegt; später noch einmal versuchen.", abort_verify_failed: "Nach dem Schreiben war der Zähler nicht sauber; es wurde nichts übernommen.",
  undo_recorder_busy: "nicht rückgängig: der Recorder ist gerade belegt, später erneut versuchen",
  abort_schema_unknown: "Das Datenbankschema ist nicht bekannt; nichts wurde geschrieben.", abort_too_many_rows: "Zu viele Zeilen für einen Lauf.", abort_nothing_found: "Es gibt nichts mehr zu reparieren.", abort_no_counter_statistics: "Die Statistik existiert nicht mehr.",
});
Object.assign(TEXT.en, {
  kindCounter: "Repair sensor errors (wrong values in history and statistics, counters and measurements, with backup)",
  counterTitle: "Find and repair counter glitches", counterHint: "A counter must never fall. If a sensor briefly reported a wrong value (a water meter, for example), Home Assistant counts the jump back as new consumption. Housekeeper finds such outliers and replaces the wrong values in the history, in the 5-minute rows and in the hourly rows; the spoiled sum is recalculated. A value that stays low for good (a reset, a replaced meter) is never touched. A Home Assistant backup is created before every run; the old values stay in the journal and can be put back as long as nobody changed the rows afterwards.",
  counterEntity: "Check this counter only", counterEntityHint: "Leave empty to check every counter that has a sum (last year).", counterMode: "What replaces the wrong values?",
  counterMode_hold: "Last good value (recommended)", counterMode_interpolate: "Straight line to the next good value",
  counterScan: "Check counters", counterScanning: "Checking …", counterScanNote: "Only reads. With many counters this can take a moment.", counterNoRecorder: "There is nothing to check without a recorder.",
  counterNone: "No outliers found.", counterChecked: "{count} counters checked.", counterPreview: "Create preview",
  counterFound: "{range}: lowest value {low} {unit} instead of about {good} {unit}", counterFinding: "{range}: values between {low} and {high} {unit}; good values before {before} and after {after} {unit}.",
  counterRows: "{states} history values, {short} 5-minute rows and {long} hourly rows change; the sum is corrected in {tail} later statistics rows.",
  counterSkipped: "{table}: {count} finding(s) cannot be repaired (no good values before or after).", counterTable_short_term: "5-minute rows", counterTable_long_term: "Hourly rows",
  counterOriginal: "original", counterRepaired: "repaired", counterChartLabel: "Readings before and after the repair", counterUndone: "The old values are back.",
  reason_counter_write: "Writes into the recorder database (history and statistics). A backup is created first; the old values can be put back from the journal.", reason_counter_partial: "One of the tables cannot be repaired (too few values before or after); the others can.",
  reason_no_counter_statistics: "The recorder has no sum statistics for this ID.", reason_nothing_found: "There is nothing to change.", reason_too_many_rows: "Too many rows for one run (more than 5000); narrow the period down by hand first.",
  reason_schema_unknown: "Housekeeper does not know the database schema of this Home Assistant version; nothing is written.", reason_counter_changed: "The data changed since the preview.",
  confirmWordRepair: "REPAIR", confirmedSummaryRepair: "{count} data repair: Housekeeper first creates a Home Assistant backup and only continues if it succeeds. It then overwrites wrong values in the history and in the statistics. The old values stay in the journal.",
  result_repaired: "Repaired", check_counter_clean: "No outliers left", simRepaired: "{count} sensors cleaned",
  abort_counter_changed: "The data changed after the preview.", abort_recorder_busy: "The recorder is busy; try again later.", abort_verify_failed: "The counter was not clean after writing; nothing was kept.",
  undo_recorder_busy: "not undone: the recorder is busy, try again later",
  abort_schema_unknown: "The database schema is not known; nothing was written.", abort_too_many_rows: "Too many rows for one run.", abort_nothing_found: "There is nothing left to repair.", abort_no_counter_statistics: "The statistics no longer exist.",
});
Object.assign(TEXT.de, {
  rangeTitle: "Gezielt bereinigen (Zeitraum selbst wählen)", rangeHint: "Für einen Fehler, den du selbst gesehen hast, bei einem Zähler oder einem Messwert (Temperatur, Leistung, …). Die Vorschau zeigt, welche Daten es für den Zeitraum noch gibt und was in jeder Tabelle geändert wird. Verlauf (roh) wird nach der Einstellung des Recorders gelöscht, 5-Minuten-Werte nach etwa 10 Tagen; Stundenwerte bleiben unbegrenzt.",
  rangeFrom: "Von", rangeTo: "Bis", rangeFixed: "Fester Wert", rangeNote: "Es braucht einen guten Wert vor und nach dem Zeitraum. Zähler dürfen dabei nicht sinken.", rangeNeedInput: "Sensor, Von und Bis angeben (Von vor Bis); bei festem Wert auch die Zahl.",
  rangeMode_hold: "Letzter guter Wert (empfohlen)", rangeMode_interpolate: "Gerade Linie zum nächsten guten Wert", rangeMode_fixed: "Fester Wert",
  rangeKind_counter: "Zähler", rangeKind_measurement: "Messwert",
  rangeWhat: "{kind}, Zeitraum {range}, ersetzt durch: {mode}.", rangeBracket: "Gute Werte davor {before} und danach {after}.",
  rangeAvail: "Für den Zeitraum gibt es {states} Verlaufswerte (roh), {short} 5-Minuten-Werte und {long} Stundenwerte.", rangeGone: "{table}: für diesen Zeitraum nicht mehr vorhanden (Aufbewahrung abgelaufen); dort wird nichts angefasst.",
  rangeEstimated: "{count} Stundenwerte lassen sich ohne 5-Minuten-Werte nicht neu berechnen; sie bekommen den Ersatzwert als Schätzung.", rangeTail: "Die Summe wird in {short} späteren 5-Minuten-Zeilen und {long} späteren Stundenzeilen berichtigt.",
  rangeMoreRows: "… und {count} weitere Zeilen", rangeNothingHere: "In dieser Tabelle ändert sich nichts.",
  rangeCol_state: "Stand", rangeCol_sum: "Summe", rangeCol_mean: "Mittel", rangeCol_min: "Min", rangeCol_max: "Max",
  reason_no_range_statistics: "Für diese ID gibt es keine Zähler- oder Mittelwert-Statistik des Recorders.", reason_bad_range: "Der Zeitraum ist ungültig (Von nach Bis, in der Zukunft, länger als 31 Tage oder fester Wert fehlt).",
  reason_no_bracket: "Vor oder nach dem Zeitraum gibt es keinen guten Wert; der Zeitraum muss größer werden oder ein fester Wert gewählt sein.", reason_bracket_not_good: "Der Zähler ist nach dem Zeitraum niedriger als davor; das ist kein Sensorfehler, sondern ein Reset oder Zählertausch.",
  reason_fixed_outside: "Der feste Wert liegt außerhalb der guten Werte davor und danach; ein Zähler darf nicht sinken.",
  abort_no_range_statistics: "Die Statistik existiert nicht mehr.", abort_bad_range: "Der Zeitraum ist nicht mehr gültig.", abort_no_bracket: "Es gibt keinen guten Wert mehr davor oder danach.", abort_bracket_not_good: "Der Zähler ist nach dem Zeitraum niedriger als davor.", abort_fixed_outside: "Der feste Wert liegt außerhalb der guten Werte.",
});
Object.assign(TEXT.en, {
  rangeTitle: "Clean up a range yourself", rangeHint: "For an error you spotted yourself, in a counter or a measurement (temperature, power, …). The preview shows which data still exists for the period and what changes in each table. Raw history is deleted according to the recorder setting, 5-minute rows after about 10 days; hourly rows stay forever.",
  rangeFrom: "From", rangeTo: "To", rangeFixed: "Fixed value", rangeNote: "A good value before and after the period is needed. Counters must not fall.", rangeNeedInput: "Give the sensor, From and To (From before To); with a fixed value also the number.",
  rangeMode_hold: "Last good value (recommended)", rangeMode_interpolate: "Straight line to the next good value", rangeMode_fixed: "Fixed value",
  rangeKind_counter: "Counter", rangeKind_measurement: "Measurement",
  rangeWhat: "{kind}, period {range}, replaced by: {mode}.", rangeBracket: "Good values before {before} and after {after}.",
  rangeAvail: "For the period there are {states} raw history values, {short} 5-minute rows and {long} hourly rows.", rangeGone: "{table}: no longer there for this period (retention expired); nothing is touched there.",
  rangeEstimated: "{count} hourly rows cannot be recalculated without 5-minute rows; they get the replacement value as an estimate.", rangeTail: "The sum is corrected in {short} later 5-minute rows and {long} later hourly rows.",
  rangeMoreRows: "… and {count} more rows", rangeNothingHere: "Nothing changes in this table.",
  rangeCol_state: "Reading", rangeCol_sum: "Sum", rangeCol_mean: "Mean", rangeCol_min: "Min", rangeCol_max: "Max",
  reason_no_range_statistics: "The recorder has no counter or mean statistics for this ID.", reason_bad_range: "The period is invalid (From after To, in the future, longer than 31 days or the fixed value is missing).",
  reason_no_bracket: "There is no good value before or after the period; widen it or choose a fixed value.", reason_bracket_not_good: "The counter is lower after the period than before; that is a reset or a replaced meter, not a sensor error.",
  reason_fixed_outside: "The fixed value lies outside the good values before and after; a counter must not fall.",
  abort_no_range_statistics: "The statistics no longer exist.", abort_bad_range: "The period is no longer valid.", abort_no_bracket: "There is no good value before or after any more.", abort_bracket_not_good: "The counter is lower after the period than before.", abort_fixed_outside: "The fixed value lies outside the good values.",
});
