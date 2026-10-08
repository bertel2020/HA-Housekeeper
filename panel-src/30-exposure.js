// ExposureMixin: which entities assistants and bridges can reach; mixed into the panel in 99-register.js.
class ExposureMixin {
  async loadExposure() {
    this.exposureLoading = true; this.exposureError = ""; this.render();
    try { this.exposure = await this._hass.callWS({ type: "ha_housekeeper/exposure" }); }
    catch (err) { this.exposureError = err?.message || String(err); }
    this.exposureLoading = false; this.render();
  }

  // Loads on the first visit; a refresh button reloads. The query is cheap and only reads registries.
  ensureExposure() {
    if (this.exposureLoading || this._exposureRequested) return;
    this._exposureRequested = true;
    setTimeout(() => this.loadExposure(), 0);
  }

  expoAssistantName(id) {
    return this.t(`expoName_${id.replace(/\./g, "_")}`);
  }

  expoAssistantList(ids) {
    return (ids || []).map(id => this.expoAssistantName(id)).join(", ");
  }

  expoAssistantRow(a) {
    const state = a.status === "ok" ? this.t("expoOk", { n: this.formatNumber(a.exposed) }) : this.t(a.status === "inactive" ? "expoInactive" : "expoUnavailable");
    const tone = a.status === "ok" ? "ok" : a.status === "inactive" ? "mute" : "warn";
    return `<div class="row"><span class="tile ${tone}"><ha-icon icon="mdi:microphone-message"></ha-icon></span><span class="row-text"><strong>${this.expoAssistantName(a.id)}</strong><small>${this.esc(state)}</small></span></div>`;
  }

  expoBridgeRow(b) {
    return `<div class="row"><span class="tile ok"><ha-icon icon="mdi:home-automation"></ha-icon></span><span class="row-text"><strong>${this.expoAssistantName(b.kind)}: ${this.esc(b.title)}</strong><small>${this.esc(this.t("expoBridge", { n: this.formatNumber(b.exposed) }))}</small></span></div>`;
  }

  expoFindingText(f) {
    return this.t(`expoText_${f.kind}`, { n: this.formatNumber(f.count), alias: f.alias || "", assistant: f.assistant ? this.expoAssistantName(f.assistant) : "", domain: f.domain || "" });
  }

  expoFindingRows(f) {
    const tone = f.level === "warn" ? "warn" : "mute";
    const pill = `<span class="pill ${tone}">${this.t(f.level === "warn" ? "expoWarn" : "expoHint2")}</span>`;
    const head = `<div class="row"><span class="tile ${tone}"><ha-icon icon="mdi:shield-search"></ha-icon></span><span class="row-text"><strong>${this.t(`expoKind_${f.kind}`)}</strong><small>${this.esc(this.expoFindingText(f))}</small><small>${this.t(`expoAdvice_${f.kind}`)}</small></span>${pill}</div>`;
    const shown = (f.items || []).slice(0, 10);
    const rows = shown.map(item => `<button class="row" data-object="entity:${this.esc(item.entity_id)}"><span class="tile mute"><ha-icon icon="mdi:chevron-right"></ha-icon></span><span class="row-text"><strong>${this.esc(item.name || item.entity_id)}</strong><small>${this.esc(item.entity_id)}${item.assistants?.length ? ` · ${this.esc(this.expoAssistantList(item.assistants))}` : ""}</small></span></button>`).join("");
    const more = f.count > shown.length ? `<p class="factnote">${this.t("expoMore", { n: this.formatNumber(f.count - shown.length) })}</p>` : "";
    return head + rows + more;
  }

  exposureView() {
    this.ensureExposure();
    const r = this.exposure;
    const head = `<div class="panelhead"><div><h2>${this.t("expoTitle")}</h2><p>${this.t("expoHint")}</p></div><div class="actions"><button class="btn" data-expo-refresh ${this.exposureLoading ? "disabled" : ""}>${this.t("relRefresh")}</button></div></div>`;
    if (this.exposureError) return `<div class="panel">${head}<div class="error">${this.esc(this.exposureError)}</div></div>`;
    if (!r) return `<div class="panel">${head}<div class="loading"><ha-icon icon="mdi:loading"></ha-icon><p>${this.t("expoLoading")}</p></div></div>`;
    const sources = r.assistants.map(a => this.expoAssistantRow(a)).join("") + r.bridges.map(b => this.expoBridgeRow(b)).join("");
    const findings = r.findings.length ? r.findings.map(f => this.expoFindingRows(f)).join("") : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("expoNone")}</div>`;
    return `<div class="panel">${head}${sources}${findings}${this.howCounted("expoFootnote")}</div>`;
  }
}
