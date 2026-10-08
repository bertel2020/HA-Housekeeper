// RunsMixin: the automation runs view; mixed into the panel in 99-register.js.
const RUN_FINDINGS = {
  failing: ["rfLabelFailing", "rfFailing"], overlap: ["rfLabelOverlap", "rfOverlap"], never_ok: ["rfLabelNeverOk", "rfNeverOk"],
  no_effect: ["rfLabelNoEffect", "rfNoEffect"], burst: ["rfLabelBurst", "rfBurst"], long_run: ["rfLabelLongRun", "rfLongRun"],
  after_update: ["rfLabelAfterUpdate", "rfAfterUpdate"], long_wait: ["rfLabelLongWait", "rfLongWait"],
  wait_no_timeout: ["rfLabelWaitNoTimeout", "rfWaitNoTimeout"], continue_on_error: ["rfLabelContinue", "rfContinue"],
};

class RunsMixin {
  async loadRuns() {
    this.runsLoading = true; this.runsError = ""; this.render();
    try { this.runs = await this._hass.callWS({ type: "ha_housekeeper/automation_runs" }); }
    catch (err) { this.runsError = err?.message || String(err); }
    this.runsLoading = false; this.render();
  }

  // Loaded once per visit; the button counts again.
  ensureRuns() {
    if (this.runsLoading || this._runsRequested) return;
    this._runsRequested = true;
    setTimeout(() => this.loadRuns(), 0);
  }

  runsDuration(ms) {
    if (ms === null || ms === undefined) return "—";
    if (ms < 1000) return this.t("runsMs", { n: ms });
    if (ms < 60000) return this.t("runsSec", { n: this.formatNumber(Math.round(ms / 100) / 10) });
    return this.relDuration(ms / 1000);
  }

  runFindingText(f) {
    const p = {
      failing: () => this.t("rfFailing", { errors: f.errors, runs: f.runs }) + (f.step ? this.t("rfFailingStep", { step: this.esc(f.step), count: f.step_count }) : ""),
      overlap: () => this.t("rfOverlap", { n: f.already + f.maxed, mode: this.esc(f.mode || "—") }),
      never_ok: () => this.t("rfNeverOk", { runs: f.runs }),
      no_effect: () => this.t("rfNoEffect", { conditions: f.conditions, runs: f.runs }),
      burst: () => this.t("rfBurst", { perDay: this.formatNumber(f.per_day), normal: this.formatNumber(f.normal) }),
      long_run: () => this.t("rfLongRun", { longest: this.runsDuration(f.longest_ms), normal: this.runsDuration(f.normal_ms) }),
      after_update: () => this.t("rfAfterUpdate", { after: f.rate_after, before: f.rate_before, what: this.esc(f.event === "ha_version" ? this.t("rfWhatHa", { to: f.to || "" }) : this.t("rfWhatEntry", { domain: f.domain || "", to: f.to || "" })) }),
      long_wait: () => this.t("rfLongWait", { duration: this.relDuration(f.seconds) }),
      wait_no_timeout: () => this.t("rfWaitNoTimeout", { n: f.count }),
      continue_on_error: () => this.t("rfContinue", { n: f.count }),
    }[f.kind];
    return p ? p() : "";
  }

  runsFindingLines(row) {
    return row.findings.map(f => `<small><span class="pill ${f.level === "info" ? "mute" : f.level}">${this.t((RUN_FINDINGS[f.kind] || ["rfLabelFailing"])[0])}</span> ${this.runFindingText(f)}</small>`).join("");
  }

  runsAttentionRow(row) {
    const tone = row.findings.some(f => f.level === "red") ? "red" : row.findings.some(f => f.level === "warn") ? "warn" : "mute";
    const counts = `${this.t("runsColRuns")}: ${this.formatNumber(row.runs)}${row.lower_bound ? ` (${this.t("runsLowerBound")})` : ""}`;
    return `<button class="row" data-object="${this.esc(`${row.object_type}:${row.entity_id}`)}"><span class="tile ${tone}"><ha-icon icon="${row.object_type === "script" ? "mdi:script-text-outline" : "mdi:robot-outline"}"></ha-icon></span><span class="row-text"><strong>${this.esc(row.name)}</strong><small>${this.esc(row.entity_id)} · ${counts}</small>${this.runsFindingLines(row)}</span></button>`;
  }

  runsTrend(row) {
    const max = Math.max(1, ...row.per_day);
    const bars = row.per_day.map(n => `<i style="height:${Math.round((n / max) * 100)}%"></i>`).join("");
    return `<span class="spark" role="img" aria-label="${this.esc(this.t("runsTrendLabel", { values: row.per_day.join(", ") }))}">${bars}</span>`;
  }

  runsTable(rows) {
    const pg = this.paginate("runsall", rows);
    const body = pg.rows.map(row => `<tr data-object="${this.esc(`${row.object_type}:${row.entity_id}`)}" tabindex="0" role="button" aria-label="${this.esc(row.name)}"><td><strong>${this.esc(row.name)}</strong><span class="id">${this.esc(row.entity_id)}</span></td><td data-label="${this.esc(this.t("runsColRuns"))}">${this.formatNumber(row.runs)}${row.lower_bound ? "+" : ""}</td><td data-label="${this.esc(this.t("runsColErrors"))}">${this.formatNumber(row.errors)}</td><td data-label="${this.esc(this.t("runsColConditions"))}">${this.formatNumber(row.conditions)}</td><td data-label="${this.esc(this.t("runsColDuration"))}">${this.runsDuration(row.mean_ms)} / ${this.runsDuration(row.max_ms)}</td><td data-label="${this.esc(this.t("runsColTrend"))}">${this.runsTrend(row)}</td></tr>`).join("");
    return `<div class="tablewrap"><table><thead><tr><th>${this.t("runsColName")}</th><th>${this.t("runsColRuns")}</th><th>${this.t("runsColErrors")}</th><th>${this.t("runsColConditions")}</th><th>${this.t("runsColDuration")}</th><th>${this.t("runsColTrend")}</th></tr></thead><tbody>${body}</tbody></table></div>${pg.footer}`;
  }

  // The numbers of one automation or script for its detail page; only when runs were counted for it.
  runsRow(item) {
    if (!["automation", "script"].includes(item.object_type)) return null;
    return (this.runs?.items || []).find(row => row.entity_id === item.object_id && (row.runs || row.findings.length)) || null;
  }

  runsDetailCard(row) {
    const since = this.runs?.since ? this.t("runsTabHint", { date: this.formatDate(this.runs.since) }) : "";
    const facts = [["runsColRuns", `${this.formatNumber(row.runs)}${row.lower_bound ? "+" : ""}`], ["runsColErrors", this.formatNumber(row.errors)], ["runsColConditions", this.formatNumber(row.conditions)], ["runsColDuration", `${this.runsDuration(row.mean_ms)} / ${this.runsDuration(row.max_ms)}`]]
      .map(([label, value]) => `<dt>${this.t(label)}</dt><dd>${value}</dd>`).join("");
    const notes = row.findings.length ? `<div class="pad">${this.runsFindingLines(row)}</div>` : "";
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("runsTab")}</h2><p>${since}</p></div></div><div class="pad"><dl class="kv">${facts}<dt>${this.t("runsColTrend")}</dt><dd>${this.runsTrend(row)}</dd></dl></div>${notes}${this.howCounted("runsFootnote")}</section>`;
  }

  runsView() {
    this.ensureRuns();
    const r = this.runs;
    const since = r?.since ? ` · ${this.t("runsSince", { date: this.formatDate(r.since) })}` : "";
    const head = `<div class="panelhead"><div><h2>${this.t("runsTitle")}</h2><p>${this.t("runsHint")}${since}</p></div><div class="actions"><button class="btn" data-runs-refresh ${this.runsLoading ? "disabled" : ""}>${this.t("runsRefresh")}</button></div></div>`;
    if (this.runsError) return `<div class="panel">${head}<div class="error">${this.esc(this.runsError)}</div></div>`;
    if (!r) return `<div class="panel">${head}<div class="panel loading"><ha-icon icon="mdi:loading"></ha-icon><p>${this.t("runsLoading")}</p></div></div>`;
    const flagged = r.items.filter(row => row.findings.length);
    const counted = r.items.filter(row => row.runs);
    const flaggedPage = this.paginate("runsflag", flagged);
    const attention = flagged.length ? flaggedPage.rows.map(row => this.runsAttentionRow(row)).join("") + flaggedPage.footer : `<div class="emptymsg">${this.t(counted.length ? "runsNone" : "runsNoData")}</div>`;
    const more = r.total > r.items.length ? `<p class="factnote">${this.t("runsMore", { shown: r.items.length, total: r.total })}</p>` : "";
    const all = counted.length ? `<div class="panel"><div class="panelhead"><div><h2>${this.t("runsAll")}</h2></div></div>${this.runsTable(counted)}${more}${this.howCounted("runsFootnote")}</div>` : "";
    return `<div class="stack"><div class="panel">${head}${attention}</div>${all}</div>`;
  }
}
