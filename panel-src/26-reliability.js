// ReliabilityMixin: the reliability view; mixed into the panel in 99-register.js.
class ReliabilityMixin {
  // Slow recorder views: an old reply is shown at once and renewed once; when another calculation holds the
  // query lock, the panel asks again by itself a few times instead of asking the user to click.
  followUp(name, view, result, reload, refresh) {
    if (!result) return;
    if (!refresh && result.stale) { reload(true); return; }
    this._busyTries = this._busyTries || {};
    if (!result.busy) { this._busyTries[name] = 0; return; }
    this._busyTries[name] = (this._busyTries[name] || 0) + 1;
    if (this._busyTries[name] <= BUSY_RETRIES) setTimeout(() => { if (this.view === view) reload(refresh); }, BUSY_WAIT_MS);
  }

  // " · calculated in 2.8 s", or the age of an old reply.
  tookNote(r) {
    if (!r || !r.available) return "";
    if (r.computed_at && (r.stale || r.age_seconds >= 60)) return ` · ${this.t("relAgeNote", { when: this.relTime(new Date(r.computed_at * 1000).toISOString()) })}`;
    if (r.took_ms === null || r.took_ms === undefined) return "";
    return ` · ${this.t(r.cached ? "relCached" : "relTook", { s: this.formatNumber(Math.round(r.took_ms / 100) / 10) })}`;
  }

  async loadReliability(refresh = false) {
    this.relLoading = true; this.relError = ""; this.render();
    try { this.reliability = await this._hass.callWS({ type: "ha_housekeeper/reliability", window_days: this.relWindow, refresh, ...(this.relCompare ? { compare: true } : {}) }); }
    catch (err) { this.relError = err?.message || String(err); }
    this.relLoading = false; this.render();
    this.followUp("reliability", "reliability", this.reliability, r => this.loadReliability(r), refresh);
  }

  // The first visit and every change of the window load once; the backend keeps the result for a few minutes.
  ensureReliability() {
    if (this.relLoading || this._relRequested === this.relWindow) return;
    this._relRequested = this.relWindow;
    setTimeout(() => this.loadReliability(), 0);
  }

  relDuration(seconds) {
    if (seconds >= 86400) return this.t("relDays", { n: Math.round(seconds / 86400) });
    if (seconds >= 7200) return this.t("relHours", { n: Math.round(seconds / 3600) });
    return this.t("relMinutes", { n: Math.max(1, Math.round(seconds / 60)) });
  }

  relRowBody(item) {
    const percent = item.availability;
    const tone = percent === null ? "mute" : percent >= 99.5 ? "ok" : percent >= 95 ? "warn" : "red";
    const lines = [`${this.esc(item.domain || "")} · ${this.t("relEntities", { n: item.entities })}${item.permanent ? ` · ${this.t("relPermanent", { n: item.permanent })}` : ""}`];
    if (item.shared_outages) {
      const layer = item.layer === "cloud" ? this.t("relLayerCloud") : this.t("relLayerLocal");
      lines.push(`${this.t(item.shared_outages === 1 ? "relSharedOne" : "relShared", { n: item.shared_outages, longest: this.relDuration(item.longest_outage) })} · ${layer}`);
    }
    const flags = [];
    if (item.reauth) flags.push(`<span class="pill red">${this.t("relReauth")}</span>`);
    if (item.state && item.state !== "loaded") flags.push(`<span class="pill warn">${this.esc(item.state)}</span>`);
    lines.push(item.last_disruption
      ? this.t(item.last_disruption.shared ? "relLastShared" : "relLastSingle", { date: this.formatDate(new Date(item.last_disruption.end * 1000).toISOString()), duration: this.relDuration(item.last_disruption.seconds) })
      : this.t("relNoDisruption"));
    if (item.delta !== null && item.delta !== undefined) lines.push(this.t("relDelta", { delta: `${item.delta > 0 ? "+" : item.delta < 0 ? "−" : "±"}${this.formatNumber(Math.abs(item.delta))}`, before: this.formatNumber(item.previous_availability) }));
    else if (this.reliability?.comparison?.available) lines.push(this.t("relDeltaNone"));
    return `<span class="tile ${tone}"><ha-icon icon="mdi:lan-connect"></ha-icon></span><span class="row-text"><strong>${this.esc(item.title)}</strong>${lines.map(line => `<small>${line}</small>`).join("")}${flags.length ? `<span class="relflags">${flags.join(" ")}</span>` : ""}</span><span class="pill ${tone}">${percent === null ? "—" : `${this.formatNumber(percent)} %`}</span>`;
  }

  relRow(item) {
    const key = `config_entry:${item.entry_id}`;
    const open = this.findObject(key) ? ` data-object="${this.esc(key)}"` : "";
    return `<${open ? "button" : "div"} class="row${open ? " rel" : ""}"${open}>${this.relRowBody(item)}</${open ? "button" : "div"}>`;
  }

  // The row of one config entry in the loaded numbers, for its detail page.
  reliabilityRow(item) {
    if (item.object_type !== "config_entry") return null;
    return (this.reliability?.entries || []).find(row => row.entry_id === item.object_id) || null;
  }

  reliabilityDetailCard(row) {
    const r = this.reliability;
    const items = row.affected || [];
    const list = items.map(m => {
      const tone = m.availability >= 99.5 ? "ok" : m.availability >= 95 ? "warn" : "red";
      return `<button class="row rel" data-object="entity:${this.esc(m.entity_id)}">${this.tile("entity", tone)}<span class="row-text"><strong>${this.esc(m.name)}</strong><small>${this.esc(m.entity_id)}</small></span><span class="pill ${tone}">${this.formatNumber(m.availability)} %</span></button>`;
    }).join("");
    const more = row.affected_total > items.length ? `<p class="factnote">${this.t("relAffectedMore", { shown: items.length, total: row.affected_total })}</p>` : "";
    const summary = `<div class="row">${this.relRowBody(row)}</div>`;
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("relTab")}</h2><p>${this.t(r.window_days === 1 ? "relWindow1" : "relWindow7")}${r.stale || r.age_seconds ? ` · ${this.t("relAgeNote", { when: this.relTime(new Date(r.computed_at * 1000).toISOString()) })}` : ""}</p></div></div>${summary}<div class="sectionlabel">${this.t("relAffected", { n: this.formatNumber(row.affected_total || 0) })}</div>${list || `<p class="factnote">${this.t("relNoAffected")}</p>`}${more}</section>`;
  }

  reliabilityView() {
    this.ensureReliability();
    const r = this.reliability;
    const windows = [[1, "relWindow1"], [7, "relWindow7"]].map(([days, key]) => `<button class="chip ${this.relWindow === days ? "active" : ""}" data-rel-window="${days}" aria-pressed="${this.relWindow === days}">${this.t(key)}</button>`).join("") + `<button class="chip ${this.relCompare ? "active" : ""}" data-rel-compare aria-pressed="${this.relCompare}">${this.t("relCompare")}</button>`;
    const took = this.tookNote(r);
    const head = `<div class="panelhead"><div><h2>${this.t("relTitle")}</h2><p>${this.t("relHint")}${took}</p></div><div class="actions" style="display:flex;gap:8px;flex-wrap:wrap">${windows}<button class="btn" data-rel-refresh ${this.relLoading ? "disabled" : ""}>${this.t("relRefresh")}</button></div></div>`;
    if (this.relError) return `<div class="panel">${head}<div class="error">${this.esc(this.relError)}</div></div>`;
    if (!r) return `<div class="panel">${head}${this.skeleton("relLoading")}</div>`;
    if (!r.available) return `<div class="panel">${head}<p class="factnote">${this.t("relNoRecorder")}</p></div>`;
    if (r.busy) return `<div class="panel">${head}${this.skeleton("relBusy")}<p class="factnote">${this.t("relBusy")}</p></div>`;
    if (!r.entries.length) return `<div class="panel">${head}<div class="emptymsg">${this.t("relEmpty")}</div></div>`;
    const loading = this.relLoading ? `<p class="factnote">${this.t("relLoading")}</p>` : "";
    const th = r.thresholds || {};
    const cov = r.coverage;
    const coverage = cov && cov.observed_share !== null && cov.observed_share !== undefined ? this.coverageNote(this.t("relCoverage", { days: r.window_days, withData: this.formatNumber(cov.with_data), known: this.formatNumber(cov.known), share: cov.observed_share })) : "";
    const pg = this.paginate("relentries", r.entries);
    return `<div class="stack"><div class="panel">${head}${coverage}${loading}${pg.rows.map(item => this.relRow(item)).join("")}${pg.footer}${this.howCounted("relFootnote", { days: r.window_days, share: th.shared_share_percent ?? 80, entities: th.shared_min_entities ?? 3, minutes: Math.round((th.shared_min_seconds ?? 300) / 60) })}</div>${this.unstableCard(r)}</div>`;
  }

  unstableRow(item, days) {
    const tone = item.level === "flapping" ? "red" : "warn";
    const lines = [`${this.esc(item.entity_id)}${item.entry_title ? ` · ${this.esc(item.entry_title)}` : ""}`,
      this.t("relEpisodes", { n: item.episodes, days, rate: this.formatNumber(item.per_day), total: this.relDuration(item.total_seconds), mean: this.relDuration(item.mean_seconds) })];
    if (item.pattern_hour !== null && item.pattern_hour !== undefined) lines.push(this.t("relPattern", { from: String(item.pattern_hour).padStart(2, "0"), to: String((item.pattern_hour + 2) % 24).padStart(2, "0") }));
    if (item.used) lines.push(this.t("relFollowers", { n: item.used }));
    return `<button class="row" data-object="entity:${this.esc(item.entity_id)}"><span class="tile ${tone}"><ha-icon icon="mdi:swap-vertical"></ha-icon></span><span class="row-text"><strong>${this.esc(item.name)}</strong>${lines.map(line => `<small>${line}</small>`).join("")}</span><span class="pill ${tone}">${this.t(item.level === "flapping" ? "relFlapping" : "relUnstable")}</span></button>`;
  }

  unstableCard(r) {
    const u = r.unstable, th = r.thresholds || {};
    if (!u) return "";
    const head = `<div class="panelhead"><div><h2>${this.t("relUnstableTitle")}</h2><p>${this.t("relUnstableHint")}</p></div></div>${r.coverage ? this.coverageNote(this.t("relUnstableCoverage", { days: r.window_days, withData: this.formatNumber(r.coverage.with_data) }) + ` ${this.excludedText(u.excluded)}`.trimEnd()) : ""}`;
    if (!u.items.length) return `<div class="panel">${head}<div class="emptymsg">${this.t("relUnstableNone")}</div></div>`;
    const more = u.total > u.items.length ? `<p class="factnote">${this.t("relUnstableMore", { shown: u.items.length, total: u.total })}</p>` : "";
    const pg = this.paginate("relunstable", u.items);
    return `<div class="panel">${head}${pg.rows.map(item => this.unstableRow(item, r.window_days)).join("")}${pg.footer}${more}${this.howCounted("relUnstableFootnote", { episodes: th.unstable_min_episodes ?? 3, rate: this.formatNumber(th.unstable_per_day ?? 0.5), flap: this.formatNumber(th.flapping_per_day ?? 1.5) })}</div>`;
  }
}
