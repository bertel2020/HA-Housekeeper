// StormsMixin: the recorder load view; mixed into the panel in 99-register.js.
class StormsMixin {
  async loadStorms(refresh = false) {
    this.stormsLoading = true; this.stormsError = ""; this.render();
    try { this.storms = await this._hass.callWS({ type: "ha_housekeeper/storms", window_days: this.stormsWindow, refresh }); }
    catch (err) { this.stormsError = err?.message || String(err); }
    this.stormsLoading = false; this.render();
    this.followUp("storms", "recorder", this.storms, r => this.loadStorms(r), refresh);
  }

  // The first visit and every change of the window load once; the backend keeps the result for ten minutes.
  ensureStorms() {
    if (this.stormsLoading || this._stormsRequested === this.stormsWindow) return;
    this._stormsRequested = this.stormsWindow;
    setTimeout(() => this.loadStorms(), 0);
  }

  // "2 automations, 1 script": what hangs on the loud entity, by type.
  stormFollowers(followers) {
    const parts = Object.entries(followers || {}).map(([type, n]) => `${this.formatNumber(n)} ${this.t(type === "config_entry" ? "config_entry" : type)}`);
    return parts.length ? this.t("stormFollowers", { list: parts.join(", ") }) : "";
  }

  stormFindingText(f) {
    const n = v => this.formatNumber(v);
    if (f.kind === "storm") return this.t("stormStorm", { perDay: n(f.per_day), peak: n(f.peak_hour) });
    if (f.kind === "attribute_flood") return this.t("stormFlood", { perDay: n(f.per_day), kb: this.formatNumber(Math.round(f.attr_bytes / 102.4) / 10) });
    if (f.kind === "no_new_state") return this.t("stormNoNew", { share: f.share, perDay: n(f.per_day) });
    if (f.kind === "integration_share") return this.t("stormShare", { share: this.formatNumber(f.load_share), perDay: n(f.per_day) });
    return this.t("stormEvent", { count: n(f.count), type: f.event_type });
  }

  stormFindingRow(f) {
    const tone = f.kind === "storm" || f.kind === "integration_share" ? "red" : "warn";
    const title = f.kind === "event_burst" ? f.event_type : f.kind === "integration_share" ? f.title : f.name || f.entity_id;
    const id = f.entity_id && f.entity_id !== title ? `<small>${this.esc(f.entity_id)}</small>` : "";
    const chain = this.stormFollowers(f.followers);
    const inner = `<span class="tile ${tone}"><ha-icon icon="mdi:chart-bell-curve"></ha-icon></span><span class="row-text"><strong>${this.esc(title)}</strong>${id}<small>${this.esc(this.stormFindingText(f))}</small>${chain ? `<small>${this.esc(chain)}</small>` : ""}</span><span class="pill ${tone}">${this.t(`stormKind_${f.kind}`)}</span>`;
    return f.entity_id ? `<button class="row" data-object="entity:${this.esc(f.entity_id)}">${inner}</button>` : `<div class="row">${inner}</div>`;
  }

  stormEntityRow(item) {
    const parts = [this.t("stormRows", { rows: this.formatNumber(item.rows), perDay: this.formatNumber(item.per_day) })];
    if (item.no_new_state >= 0.1) parts.push(this.t("stormNoNewShort", { share: Math.round(item.no_new_state * 100) }));
    if (item.attr_bytes !== null && item.attr_bytes !== undefined) parts.push(this.t("stormAttr", { kb: this.formatNumber(Math.round(item.attr_bytes / 102.4) / 10) }));
    if (item.peak_hour) parts.push(this.t("stormPeak", { n: this.formatNumber(item.peak_hour) }));
    return `<button class="row" data-object="entity:${this.esc(item.entity_id)}"><span class="tile mute"><ha-icon icon="mdi:database-clock-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(item.name || item.entity_id)}</strong><small>${this.esc(item.entity_id)}</small><small>${this.esc(parts.join(" · "))}</small></span><span class="pill mute">${this.formatNumber(item.per_day)} ${this.t("stormPerDay")}</span></button>`;
  }

  // A bar needs a text next to it: the percentage stands in the row, the bar is decoration.
  stormShareRow(item) {
    const share = Math.max(0, Math.min(100, item.load_share));
    return `<div class="row"><span class="tile mute"><ha-icon icon="mdi:lan"></ha-icon></span><span class="row-text"><strong>${this.esc(item.title)}</strong><small>${this.esc(item.domain || "")} · ${this.t("stormShareLine", { entities: this.formatNumber(item.entities), rows: this.formatNumber(item.per_day), rowShare: this.formatNumber(item.row_share) })}</small><span class="sharebar" aria-hidden="true"><i style="width:${share}%"></i></span></span><span class="pill mute">${this.formatNumber(item.load_share)} %</span></div>`;
  }

  // Operation > Recorder: what writes the most, what fills the database, and how healthy it is.
  // The two recorder queries run one after the other: the second starts when the first is done.
  recorderView() {
    const stormsDone = this.storms || this.stormsError;
    if (stormsDone) this.ensureDbHealth();
    const st = this.storms?.available && !this.storms.busy ? this.storms : null;
    const db = this.dbHealth?.available && !this.dbHealth.busy ? this.dbHealth : null;
    const meta = this.data?.meta?.database;
    const stormFindings = st ? st.findings.length : 0;
    const dbFindings = db ? db.findings.length : 0;
    const dbTone = !db ? "mute" : db.findings.some(f => f.level === "problem") ? "red" : dbFindings ? "warn" : "ok";
    const stormTone = !st ? "mute" : st.findings.some(f => f.kind === "storm" || f.kind === "integration_share") ? "red" : stormFindings ? "warn" : "ok";
    const bytes = db?.db_bytes ?? meta?.db_bytes;
    const perDay = db?.growth?.known ? db.growth.per_day : meta?.per_day;
    const keep = db?.keep_days ?? meta?.keep_days, purge = db?.auto_purge ?? meta?.auto_purge;
    const loud = st?.entities?.[0], topCost = this.costs?.entities?.[0];
    const tiles = this.sumTiles([
      st && { label: this.t("recSumRows"), value: this.formatNumber(st.per_day), sub: this.t(this.stormsWindow === 1 ? "relWindow1" : "relWindow7"), tone: "mute", tab: "recorder|load" },
      loud && { label: this.t("recSumLoudest"), value: this.esc(loud.name || loud.entity_id), sub: this.t("stormRows", { rows: this.formatNumber(loud.rows), perDay: this.formatNumber(loud.per_day) }), tone: "mute", tab: "recorder|load" },
      topCost && { label: this.t("recSumCosts"), value: this.esc(topCost.name || topCost.entity_id), sub: this.t("recorderShare", { share: topCost.share }), tone: "mute", tab: "recorder|costs" },
      bytes !== null && bytes !== undefined && { label: this.t("recSumDb"), value: this.formatBytes(bytes), sub: perDay !== null && perDay !== undefined ? this.t("dbOvPerDay", { size: this.formatBytes(Math.max(0, perDay)) }) : "", tone: dbTone, tab: "recorder|db" },
      keep && { label: this.t("dbOvKeep"), value: this.t("dbOvKeepDays", { n: this.formatNumber(keep) }), sub: purge === false ? this.t("recSumPurgeOff") : "", tone: purge === false ? "warn" : "mute", tab: "recorder|db" },
      (st || db) && { label: this.t("recSumFindings"), value: this.formatNumber(stormFindings + dbFindings), tone: stormTone === "red" || dbTone === "red" ? "red" : stormFindings + dbFindings ? "warn" : "ok", tab: `recorder|${stormFindings || !dbFindings ? "load" : "db"}` },
    ]);
    const tabs = [
      { id: "load", label: this.t("stormTitle"), count: st ? stormFindings : null, tone: stormTone },
      { id: "costs", label: this.t("recorderTitle") },
      { id: "db", label: this.t("dbTitle"), count: db ? dbFindings : null, tone: dbTone },
    ];
    const open = this.viewTabOf("recorder", tabs, "load");
    const body = open === "costs" ? this.recorderCard() : open === "db" ? this.dbCard() : this.stormsView();
    return `<div class="stack">${tiles}${this.viewTabBar("recorder", tabs, open)}${body}</div>`;
  }

  stormsView() {
    this.ensureStorms();
    const r = this.storms;
    const windows = [[1, "relWindow1"], [7, "relWindow7"]].map(([days, key]) => `<button class="chip ${this.stormsWindow === days ? "active" : ""}" data-storm-window="${days}" aria-pressed="${this.stormsWindow === days}">${this.t(key)}</button>`).join("");
    const took = this.tookNote(r);
    const head = `<div class="panelhead"><div><h2>${this.t("stormTitle")}</h2><p>${this.t("stormHint")}${took}</p></div><div class="actions" style="display:flex;gap:8px;flex-wrap:wrap">${windows}<button class="btn" data-storm-refresh ${this.stormsLoading ? "disabled" : ""}>${this.t("relRefresh")}</button></div></div>`;
    if (this.stormsError) return `<div class="panel">${head}<div class="error">${this.esc(this.stormsError)}</div></div>`;
    if (!r) return `<div class="panel">${head}${this.skeleton("stormLoading")}</div>`;
    if (!r.available) return `<div class="panel">${head}<p class="factnote">${this.t("relNoRecorder")}</p></div>`;
    if (r.busy) return `<div class="panel">${head}${this.skeleton("relBusy")}<p class="factnote">${this.t("relBusy")}</p></div>`;
    const loading = this.stormsLoading ? `<p class="factnote">${this.t("stormLoading")}</p>` : "";
    const foundFindings = this.searchList("stormfind", r.findings, f => [f.name, f.entity_id, f.title, f.event_type].join(" "));
    const findingPage = this.paginate("stormfind", foundFindings.rows);
    const attention = r.findings.length ? foundFindings.bar + foundFindings.none + findingPage.rows.map(f => this.stormFindingRow(f)).join("") + findingPage.footer : `<div class="emptymsg">${this.t("stormNone")}</div>`;
    const summary = `<p class="factnote">${this.t("stormSummary", { rows: this.formatNumber(r.total_rows), perDay: this.formatNumber(r.per_day), entities: this.formatNumber(r.entity_count), events: this.formatNumber(r.event_total) })}</p>`;
    const foundEntities = this.searchList("stormentities", r.entities, item => [item.name, item.entity_id].join(" "));
    const entityPage = this.paginate("stormentities", foundEntities.rows);
    const table = r.entities.length ? `<div class="panel"><div class="panelhead"><div><h2>${this.t("stormLoudest")}</h2><p>${this.t("stormLoudestHint")}</p></div></div>${foundEntities.bar}${foundEntities.none}${entityPage.rows.map(item => this.stormEntityRow(item)).join("")}${entityPage.footer}</div>` : "";
    const foundShares = this.searchList("stormshares", r.integrations, item => [item.title, item.domain].join(" "));
    const shares = r.integrations.length ? `<div class="panel"><div class="panelhead"><div><h2>${this.t("stormShares")}</h2><p>${this.t("stormSharesHint")}</p></div></div>${foundShares.bar}${foundShares.none}${foundShares.rows.map(item => this.stormShareRow(item)).join("")}</div>` : "";
    const events = r.events.length ? `<div class="panel"><div class="panelhead"><div><h2>${this.t("stormEvents")}</h2><p>${this.t("stormEventsHint")}</p></div></div>${r.events.map(e => `<div class="row"><span class="tile mute"><ha-icon icon="mdi:flash-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(e.type)}</strong></span><span class="pill mute">${this.formatNumber(e.count)}</span></div>`).join("")}${this.howCounted("stormFootnote")}</div>` : "";
    const left = this.excludedText(r.excluded);
    return `<div class="stack"><div class="panel">${head}${loading}${attention}${summary}${left ? `<p class="factnote">${left}</p>` : ""}</div>${table}${shares}${events}</div>`;
  }
}
