// CorrelationMixin: findings that began at about the time of an update or restart; mixed in by 99-register.js.
// Always worded "at about the same time as", never as a cause.
class CorrelationMixin {
  async loadCorrelations() {
    try { this.corr = await this._hass.callWS({ type: "ha_housekeeper/correlations" }); }
    catch (_) { this.corr = { groups: [], by_key: {} }; }
    this.render();
  }

  // Loads once, and again after every new scan.
  ensureCorrelations() {
    const key = this.data?.meta?.scanned_at || "";
    if (!this.data || (this._corrKey === key && this._corrRequested)) return;
    this._corrRequested = true; this._corrKey = key;
    setTimeout(() => this.loadCorrelations(), 0);
  }

  corrText(group) {
    const vars = { domain: this.esc(group.domain || ""), from: this.esc(group.from ?? ""), to: this.esc(group.to ?? "") };
    return this.t(`corr_${group.kind}`, vars);
  }

  // The sentence on one finding, or "" when it began with nothing the log knows.
  corrLine(key) {
    const id = this.corr?.by_key?.[key];
    const group = id && this.corr.groups.find(g => g.id === id);
    return group ? this.t("corrAfter", { what: this.corrText(group), when: this.formatDate(group.at) }) : "";
  }

  corrFindingCount() { return Object.keys(this.corr?.by_key || {}).length; }

  corrGroupsCard() {
    const groups = this.corr?.groups || [];
    if (!groups.length) return "";
    const rows = groups.map(g => {
      const names = g.keys.slice(0, 6).map(k => { const f = this.data.findings.find(x => x.key === k); return f ? (this.findObject(this.findingKey(f))?.name || f.object_id) : ""; }).filter(Boolean).map(n => this.esc(n)).join(", ");
      return `<div class="row rel"><span class="tile ${g.only_group ? "mute" : "warn"}"><ha-icon icon="${g.kind === "start" ? "mdi:restart" : g.kind === "plan" ? "mdi:broom" : "mdi:package-up"}"></ha-icon></span><span class="row-text"><strong>${this.corrText(g)}</strong><small>${this.esc(this.formatDate(g.at))}${names ? ` · ${names}` : ""}</small></span><span class="pill ${g.only_group ? "mute" : "warn"}">${this.t("corrCount", { n: this.formatNumber(g.total) })}</span></div>`;
    }).join("");
    return `<section class="panel" style="margin-bottom:14px"><div class="panelhead"><div><h2>${this.t("corrTitle")}</h2><p>${this.t("corrHint")}</p></div></div>${rows}</section>`;
  }
}
