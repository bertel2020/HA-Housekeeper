// StormsMixin: the recorder load view; mixed into the panel in 99-register.js.
class StormsMixin {
  async loadStorms(refresh = false) {
    this.stormsLoading = true; this.stormsError = ""; this.render();
    try { this.storms = await this._hass.callWS({ type: "ha_housekeeper/storms", window_days: this.stormsWindow, refresh }); }
    catch (err) { this.stormsError = err?.message || String(err); }
    this.stormsLoading = false; this.render();
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

  stormsView() {
    this.ensureStorms();
    const r = this.storms;
    const windows = [[1, "relWindow1"], [7, "relWindow7"]].map(([days, key]) => `<button class="chip ${this.stormsWindow === days ? "active" : ""}" data-storm-window="${days}" aria-pressed="${this.stormsWindow === days}">${this.t(key)}</button>`).join("");
    const took = r && r.available && r.took_ms !== null && r.took_ms !== undefined ? ` · ${this.t(r.cached ? "relCached" : "relTook", { s: this.formatNumber(Math.round(r.took_ms / 100) / 10) })}` : "";
    const head = `<div class="panelhead"><div><h2>${this.t("stormTitle")}</h2><p>${this.t("stormHint")}${took}</p></div><div class="actions" style="display:flex;gap:8px;flex-wrap:wrap">${windows}<button class="btn" data-storm-refresh ${this.stormsLoading ? "disabled" : ""}>${this.t("relRefresh")}</button></div></div>`;
    if (this.stormsError) return `<div class="panel">${head}<div class="error">${this.esc(this.stormsError)}</div></div>`;
    if (!r) return `<div class="panel">${head}<div class="panel loading"><ha-icon icon="mdi:loading"></ha-icon><p>${this.t("stormLoading")}</p></div></div>`;
    if (!r.available) return `<div class="panel">${head}<p class="factnote">${this.t("relNoRecorder")}</p></div>`;
    if (r.busy) return `<div class="panel">${head}<p class="factnote">${this.t("relBusy")}</p></div>`;
    const loading = this.stormsLoading ? `<p class="factnote">${this.t("stormLoading")}</p>` : "";
    const findingPage = this.paginate("stormfind", r.findings);
    const attention = r.findings.length ? findingPage.rows.map(f => this.stormFindingRow(f)).join("") + findingPage.footer : `<div class="emptymsg">${this.t("stormNone")}</div>`;
    const summary = `<p class="factnote">${this.t("stormSummary", { rows: this.formatNumber(r.total_rows), perDay: this.formatNumber(r.per_day), entities: this.formatNumber(r.entity_count), events: this.formatNumber(r.event_total) })}</p>`;
    const entityPage = this.paginate("stormentities", r.entities);
    const table = r.entities.length ? `<div class="panel"><div class="panelhead"><div><h2>${this.t("stormLoudest")}</h2><p>${this.t("stormLoudestHint")}</p></div></div>${entityPage.rows.map(item => this.stormEntityRow(item)).join("")}${entityPage.footer}</div>` : "";
    const shares = r.integrations.length ? `<div class="panel"><div class="panelhead"><div><h2>${this.t("stormShares")}</h2><p>${this.t("stormSharesHint")}</p></div></div>${r.integrations.map(item => this.stormShareRow(item)).join("")}</div>` : "";
    const events = r.events.length ? `<div class="panel"><div class="panelhead"><div><h2>${this.t("stormEvents")}</h2><p>${this.t("stormEventsHint")}</p></div></div>${r.events.map(e => `<div class="row"><span class="tile mute"><ha-icon icon="mdi:flash-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(e.type)}</strong></span><span class="pill mute">${this.formatNumber(e.count)}</span></div>`).join("")}${this.howCounted("stormFootnote")}</div>` : "";
    return `<div class="stack"><div class="panel">${head}${loading}${attention}${summary}</div>${table}${shares}${events}</div>`;
  }
}
