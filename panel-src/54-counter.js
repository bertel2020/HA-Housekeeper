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
    return `<div class="panel">${head}${controls}${body}</div>`;
  }

  bindCounter(root) {
    root.querySelector("[data-counter-id]")?.addEventListener("change", e => { this.counterId = e.target.value.trim(); });
    root.querySelector("[data-counter-mode]")?.addEventListener("change", e => { this.counterMode = e.target.value; });
    root.querySelector("[data-counter-scan]")?.addEventListener("click", () => this.loadCounterScan(true));
    root.querySelectorAll("[data-counter-pick]").forEach(el => el.addEventListener("click", () => { this.counterSel = el.dataset.counterPick; this.createPlan(); }));
  }
}
Object.assign(TEXT.de, {
  kindCounter: "Zählerfehler bereinigen (falsche Messwerte in Verlauf und Statistik, mit Backup)",
  counterTitle: "Zählerfehler bereinigen", counterHint: "Ein Zähler darf nie sinken. Hat ein Sensor kurz einen falschen Wert geliefert (zum Beispiel ein Wasserzähler), zählt Home Assistant den Rücksprung als neuen Verbrauch. Housekeeper findet solche Ausreißer und ersetzt die falschen Werte im Verlauf, in den 5-Minuten-Werten und in den Stundenwerten; die verfälschte Summe wird neu berechnet. Ein Wert, der dauerhaft niedrig bleibt (Reset, Zählertausch), wird nie angefasst. Vor jedem Lauf entsteht ein Home-Assistant-Backup; die alten Werte bleiben im Journal und lassen sich zurückspielen, solange niemand die Zeilen danach geändert hat.",
  counterEntity: "Nur diesen Zähler prüfen", counterEntityHint: "Leer lassen, um alle Zähler mit Summe zu prüfen (letztes Jahr).", counterMode: "Womit werden falsche Werte ersetzt?",
  counterMode_hold: "Letzter guter Wert (empfohlen)", counterMode_interpolate: "Gerade Linie zum nächsten guten Wert",
  counterScan: "Zähler prüfen", counterScanning: "Wird geprüft …", counterScanNote: "Liest nur. Bei vielen Zählern kann das einen Moment dauern.", counterNoRecorder: "Ohne Recorder gibt es nichts zu prüfen.",
  counterNone: "Keine Ausreißer gefunden.", counterChecked: "{count} Zähler geprüft.", counterPreview: "Vorschau erstellen",
  counterFound: "{range}: niedrigster Wert {low} {unit} statt etwa {good} {unit}", counterFinding: "{range}: Werte zwischen {low} und {high} {unit}; gute Werte davor {before} und danach {after} {unit}.",
  counterRows: "Geändert werden {states} Verlaufswerte, {short} 5-Minuten-Werte und {long} Stundenwerte; die Summe wird in {tail} späteren Statistikzeilen berichtigt.",
  counterSkipped: "{table}: {count} Fund(e) nicht reparierbar (keine guten Werte davor oder danach).", counterTable_short_term: "5-Minuten-Werte", counterTable_long_term: "Stundenwerte",
  counterOriginal: "Original", counterRepaired: "repariert", counterChartLabel: "Verlauf vor und nach der Reparatur", counterUndone: "Die alten Werte sind wieder eingesetzt.",
  reason_counter_write: "Schreibt in die Recorder-Datenbank (Verlauf und Statistik). Ein Backup entsteht zuerst; die alten Werte lassen sich aus dem Journal zurückspielen.", reason_counter_partial: "Eine der Tabellen kann nicht repariert werden (zu wenig Werte davor oder danach); die anderen schon.",
  reason_no_counter_statistics: "Für diese ID gibt es keine Summenstatistik des Recorders.", reason_nothing_found: "Keine Ausreißer gefunden.", reason_too_many_rows: "Zu viele Zeilen für einen Lauf (mehr als 5000); den Zeitraum erst von Hand eingrenzen.",
  reason_schema_unknown: "Das Datenbankschema dieser Home-Assistant-Version ist Housekeeper nicht bekannt; nichts wird geschrieben.", reason_counter_changed: "Die Daten haben sich seit der Vorschau geändert.",
  confirmWordRepair: "REPARIEREN", confirmedSummaryRepair: "{count} Zählerreparatur: Housekeeper legt zuerst ein Home-Assistant-Backup an und startet nur, wenn es erfolgreich ist. Danach überschreibt es falsche Werte im Verlauf und in der Statistik. Die alten Werte bleiben im Journal.",
  result_repaired: "Repariert", check_counter_clean: "Keine Ausreißer mehr", simRepaired: "{count} Zähler repariert",
  abort_counter_changed: "Die Daten wurden nach der Vorschau geändert.", abort_recorder_busy: "Der Recorder ist gerade belegt; später noch einmal versuchen.", abort_verify_failed: "Nach dem Schreiben war der Zähler nicht sauber; es wurde nichts übernommen.",
  undo_recorder_busy: "nicht rückgängig: der Recorder ist gerade belegt, später erneut versuchen",
  abort_schema_unknown: "Das Datenbankschema ist nicht bekannt; nichts wurde geschrieben.", abort_too_many_rows: "Zu viele Zeilen für einen Lauf.", abort_nothing_found: "Es gibt nichts mehr zu reparieren.", abort_no_counter_statistics: "Die Statistik existiert nicht mehr.",
});
Object.assign(TEXT.en, {
  kindCounter: "Repair counter glitches (wrong readings in history and statistics, with backup)",
  counterTitle: "Repair counter glitches", counterHint: "A counter must never fall. If a sensor briefly reported a wrong value (a water meter, for example), Home Assistant counts the jump back as new consumption. Housekeeper finds such outliers and replaces the wrong values in the history, in the 5-minute rows and in the hourly rows; the spoiled sum is recalculated. A value that stays low for good (a reset, a replaced meter) is never touched. A Home Assistant backup is created before every run; the old values stay in the journal and can be put back as long as nobody changed the rows afterwards.",
  counterEntity: "Check this counter only", counterEntityHint: "Leave empty to check every counter that has a sum (last year).", counterMode: "What replaces the wrong values?",
  counterMode_hold: "Last good value (recommended)", counterMode_interpolate: "Straight line to the next good value",
  counterScan: "Check counters", counterScanning: "Checking …", counterScanNote: "Only reads. With many counters this can take a moment.", counterNoRecorder: "There is nothing to check without a recorder.",
  counterNone: "No outliers found.", counterChecked: "{count} counters checked.", counterPreview: "Create preview",
  counterFound: "{range}: lowest value {low} {unit} instead of about {good} {unit}", counterFinding: "{range}: values between {low} and {high} {unit}; good values before {before} and after {after} {unit}.",
  counterRows: "{states} history values, {short} 5-minute rows and {long} hourly rows change; the sum is corrected in {tail} later statistics rows.",
  counterSkipped: "{table}: {count} finding(s) cannot be repaired (no good values before or after).", counterTable_short_term: "5-minute rows", counterTable_long_term: "Hourly rows",
  counterOriginal: "original", counterRepaired: "repaired", counterChartLabel: "Readings before and after the repair", counterUndone: "The old values are back.",
  reason_counter_write: "Writes into the recorder database (history and statistics). A backup is created first; the old values can be put back from the journal.", reason_counter_partial: "One of the tables cannot be repaired (too few values before or after); the others can.",
  reason_no_counter_statistics: "The recorder has no sum statistics for this ID.", reason_nothing_found: "No outliers found.", reason_too_many_rows: "Too many rows for one run (more than 5000); narrow the period down by hand first.",
  reason_schema_unknown: "Housekeeper does not know the database schema of this Home Assistant version; nothing is written.", reason_counter_changed: "The data changed since the preview.",
  confirmWordRepair: "REPAIR", confirmedSummaryRepair: "{count} counter repair: Housekeeper first creates a Home Assistant backup and only continues if it succeeds. It then overwrites wrong values in the history and in the statistics. The old values stay in the journal.",
  result_repaired: "Repaired", check_counter_clean: "No outliers left", simRepaired: "{count} counters repaired",
  abort_counter_changed: "The data changed after the preview.", abort_recorder_busy: "The recorder is busy; try again later.", abort_verify_failed: "The counter was not clean after writing; nothing was kept.",
  undo_recorder_busy: "not undone: the recorder is busy, try again later",
  abort_schema_unknown: "The database schema is not known; nothing was written.", abort_too_many_rows: "Too many rows for one run.", abort_nothing_found: "There is nothing left to repair.", abort_no_counter_statistics: "The statistics no longer exist.",
});
