// ReliabilityMixin: the reliability view; mixed into the panel in 99-register.js.
class ReliabilityMixin {
  async loadReliability(refresh = false) {
    this.relLoading = true; this.relError = ""; this.render();
    try { this.reliability = await this._hass.callWS({ type: "ha_housekeeper/reliability", window_days: this.relWindow, refresh }); }
    catch (err) { this.relError = err?.message || String(err); }
    this.relLoading = false; this.render();
  }

  // The first visit and every change of the window load once; the backend keeps the result for a few minutes.
  ensureReliability() {
    if (this.relLoading || this._relRequested === this.relWindow) return;
    this._relRequested = this.relWindow;
    setTimeout(() => this.loadReliability(), 0);
  }

  relDuration(seconds) {
    if (seconds >= 86400) return this.t("relDays", { n: Math.round(seconds / 86400) });
    if (seconds >= 3600) return this.t("relHours", { n: Math.round(seconds / 3600) });
    return this.t("relMinutes", { n: Math.max(1, Math.round(seconds / 60)) });
  }

  relRow(item) {
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
    return `<div class="row"><span class="tile ${tone}"><ha-icon icon="mdi:lan-connect"></ha-icon></span><span class="row-text"><strong>${this.esc(item.title)}</strong>${lines.map(line => `<small>${line}</small>`).join("")}${flags.length ? `<span class="relflags">${flags.join(" ")}</span>` : ""}</span><span class="pill ${tone}">${percent === null ? "—" : `${this.formatNumber(percent)} %`}</span></div>`;
  }

  reliabilityView() {
    this.ensureReliability();
    const r = this.reliability;
    const windows = [[1, "relWindow1"], [7, "relWindow7"]].map(([days, key]) => `<button class="chip ${this.relWindow === days ? "active" : ""}" data-rel-window="${days}" aria-pressed="${this.relWindow === days}">${this.t(key)}</button>`).join("");
    const took = r && r.took_ms !== null && r.took_ms !== undefined && r.available ? ` · ${this.t(r.cached ? "relCached" : "relTook", { s: this.formatNumber(Math.round(r.took_ms / 100) / 10) })}` : "";
    const head = `<div class="panelhead"><div><h2>${this.t("relTitle")}</h2><p>${this.t("relHint")}${took}</p></div><div class="actions" style="display:flex;gap:8px;flex-wrap:wrap">${windows}<button class="btn" data-rel-refresh ${this.relLoading ? "disabled" : ""}>${this.t("relRefresh")}</button></div></div>`;
    if (this.relError) return `<div class="panel">${head}<div class="error">${this.esc(this.relError)}</div></div>`;
    if (!r) return `<div class="panel">${head}<div class="panel loading"><ha-icon icon="mdi:loading"></ha-icon><p>${this.t("relLoading")}</p></div></div>`;
    if (!r.available) return `<div class="panel">${head}<p class="factnote">${this.t("relNoRecorder")}</p></div>`;
    if (r.busy) return `<div class="panel">${head}<p class="factnote">${this.t("relBusy")}</p></div>`;
    if (!r.entries.length) return `<div class="panel">${head}<div class="emptymsg">${this.t("relEmpty")}</div></div>`;
    const loading = this.relLoading ? `<p class="factnote">${this.t("relLoading")}</p>` : "";
    return `<div class="panel">${head}${loading}${r.entries.map(item => this.relRow(item)).join("")}<p class="factnote">${this.t("relFootnote", { days: r.window_days })}</p></div>`;
  }
}
