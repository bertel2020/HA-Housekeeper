// DbHealthMixin: the database card in Maintenance; mixed into the panel in 99-register.js.
class DbHealthMixin {
  async loadDbHealth(refresh = false) {
    this.dbLoading = true; this.dbError = ""; this.render();
    try { this.dbHealth = await this._hass.callWS({ type: "ha_housekeeper/db_health", refresh }); }
    catch (err) { this.dbError = err?.message || String(err); }
    this.dbLoading = false; this.render();
  }

  // Loads on the first visit of Maintenance only: the query reads the recorder, so the overview never starts it.
  ensureDbHealth() {
    if (this.dbLoading || this._dbRequested) return;
    this._dbRequested = true;
    setTimeout(() => this.loadDbHealth(), 0);
  }

  dbSeriesList(series) {
    return series.map(s => this.esc(s.name || s.statistic_id)).join(", ");
  }

  dbFindingText(f) {
    const n = v => this.formatNumber(v), size = v => this.formatBytes(v);
    if (f.kind === "wal_large") return this.t("dbWal", { wal: size(f.wal_bytes), db: size(f.db_bytes) });
    if (f.kind === "growth") return this.t("dbGrowth", { recent: size(f.recent_bytes), base: size(f.base_bytes) });
    if (f.kind === "duplicates") return this.t("dbDuplicates", { n: n(f.groups), more: f.capped ? "+" : "", list: this.dbSeriesList(f.series) });
    if (f.kind === "missing_hours") return this.t("dbMissing", { n: n(f.series_total), list: f.series.map(s => `${this.esc(s.name || s.statistic_id)} (${this.t("dbMissingHours", { n: n(s.missing) })})`).join(", ") });
    if (f.kind === "statistics_issues") return this.t("dbIssues", { n: n(f.series_total), list: f.series.map(s => `${this.esc(s.name || s.statistic_id)} (${s.types.map(type => this.t(`dbIssue_${type}`) === `dbIssue_${type}` ? type : this.t(`dbIssue_${type}`)).join(", ")})`).join(", ") });
    return this.t("dbRecorderGap", { n: n(f.gaps), longest: this.relDuration(f.longest_seconds), latest: this.formatDate(new Date(f.latest[0].start * 1000).toISOString()) });
  }

  dbFindingRow(f) {
    const tone = f.level === "problem" ? "red" : "warn";
    return `<div class="row"><span class="tile ${tone}"><ha-icon icon="mdi:database-alert-outline"></ha-icon></span><span class="row-text"><strong>${this.t(`dbKind_${f.kind}`)}</strong><small>${this.dbFindingText(f)}</small><small>${this.t(`dbAdvice_${f.kind}`)}</small></span><span class="pill ${tone}">${this.t(f.level === "problem" ? "dbProblem" : "dbHint")}</span></div>`;
  }

  dbCard() {
    const r = this.dbHealth;
    const took = r?.available && r.took_ms !== null && r.took_ms !== undefined ? ` · ${this.t(r.cached ? "relCached" : "relTook", { s: this.formatNumber(Math.round(r.took_ms / 100) / 10) })}` : "";
    const head = `<div class="panelhead"><div><h2>${this.t("dbTitle")}</h2><p>${this.t("dbHint2")}${took}</p></div><div class="actions"><button class="btn" data-db-refresh ${this.dbLoading ? "disabled" : ""}>${this.t("relRefresh")}</button></div></div>`;
    if (this.dbError) return `<div class="panel">${head}<div class="error">${this.esc(this.dbError)}</div></div>`;
    if (!r) return `<div class="panel">${head}<div class="loading"><ha-icon icon="mdi:loading"></ha-icon><p>${this.t("dbLoading")}</p></div></div>`;
    if (!r.available) return `<div class="panel">${head}<p class="factnote">${this.t("relNoRecorder")}</p></div>`;
    if (r.busy) return `<div class="panel">${head}<p class="factnote">${this.t("relBusy")}</p></div>`;
    const facts = [];
    if (r.supported && r.db_bytes !== null && r.db_bytes !== undefined) facts.push(this.t("dbSize", { db: this.formatBytes(r.db_bytes), wal: this.formatBytes(r.wal_bytes || 0) }));
    else facts.push(this.t("dbNoSize", { dialect: this.esc(r.dialect || "?") }));
    if (r.growth?.known) facts.push(this.t("dbPerDay", { size: this.formatBytes(Math.max(0, r.growth.per_day)) }));
    else facts.push(this.t("dbGrowthUnknown"));
    if (r.restart_gaps) facts.push(this.t("dbRestartGaps", { n: this.formatNumber(r.restart_gaps) }));
    const rows = r.findings.length ? r.findings.map(f => this.dbFindingRow(f)).join("") : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("dbNone")}</div>`;
    return `<div class="panel">${head}${rows}<p class="factnote">${facts.join(" · ")}</p>${this.howCounted("dbFootnote")}</div>`;
  }
}
