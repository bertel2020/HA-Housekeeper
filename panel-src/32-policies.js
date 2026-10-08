// PoliciesMixin: quality rules you switch on and the objects that break them; mixed into the panel in 99-register.js.
class PoliciesMixin {
  async loadPolicies() {
    this.policiesLoading = true; this.policiesError = ""; this.render();
    try { this.policies = await this._hass.callWS({ type: "ha_housekeeper/policies" }); }
    catch (err) { this.policiesError = err?.message || String(err); }
    this.policiesLoading = false; this.render();
  }

  // Loads on the first visit; the answer is computed from the last scan and needs no recorder.
  ensurePolicies() {
    if (this.policiesLoading || this._policiesRequested) return;
    this._policiesRequested = true;
    setTimeout(() => this.loadPolicies(), 0);
  }

  async changePolicy(call) {
    try { await this._hass.callWS(call); }
    catch (err) { this.policiesError = err?.message || String(err); }
    await this.loadPolicies();
  }

  polItemRow(item) {
    const pill = item.ignored ? `<span class="pill mute">${this.t(item.by === "label" ? "polByLabel" : "polHiddenLabel")}</span>` : "";
    const button = item.by === "label" ? "" : `<button class="btn" data-policy-ignore="${this.esc(item.key)}" data-policy-value="${item.ignored ? 0 : 1}">${this.t(item.ignored ? "polShow" : "polHide")}</button>`;
    return `<div class="row politem"><span class="tile mute"><ha-icon icon="mdi:chevron-right"></ha-icon></span><span class="row-text"><button class="linklike" data-object="${this.esc(`${item.object_type}:${item.object_id}`)}"><strong>${this.esc(item.name)}</strong></button><small>${this.esc(item.object_id)}</small></span>${pill}${button}</div>`;
  }

  polRuleBlock(rule) {
    const state = !rule.enabled ? this.t("polOff") : rule.count === 1 ? this.t("polCountOne") : rule.count ? this.t("polCount", { n: this.formatNumber(rule.count) }) : this.t("polNone");
    const tone = !rule.enabled ? "mute" : rule.count ? "warn" : "ok";
    const toggle = `<input class="policyswitch" type="checkbox" role="switch" aria-label="${this.esc(this.t(`polRule_${rule.id}`))}" data-policy-toggle="${rule.id}" ${rule.enabled ? "checked" : ""}>`;
    const head = `<div class="row"><span class="tile ${tone}"><ha-icon icon="mdi:clipboard-check-outline"></ha-icon></span><span class="row-text"><strong>${this.t(`polRule_${rule.id}`)}</strong><small>${this.t(`polDesc_${rule.id}`)}</small></span><span class="pill ${tone}">${this.esc(state)}</span>${toggle}</div>`;
    if (!rule.enabled) return head;
    const visible = rule.items.filter(i => this.policyShowHidden || !i.ignored);
    const shown = visible.slice(0, 10);
    const more = visible.length > shown.length ? `<p class="factnote">${this.t("polMore", { n: this.formatNumber(visible.length - shown.length) })}</p>` : "";
    const hidden = rule.ignored ? `<p class="factnote">${this.t("polHiddenN", { n: this.formatNumber(rule.ignored) })}</p>` : "";
    return head + shown.map(i => this.polItemRow(i)).join("") + more + hidden;
  }

  policiesView() {
    this.ensurePolicies();
    const r = this.policies;
    const anyHidden = r?.rules?.some(rule => rule.ignored);
    const actions = `${anyHidden ? `<button class="btn" data-policy-hidden>${this.t(this.policyShowHidden ? "polHideHidden" : "polShowHidden")}</button>` : ""}<button class="btn" data-policy-refresh ${this.policiesLoading ? "disabled" : ""}>${this.t("relRefresh")}</button>`;
    const head = `<div class="panelhead"><div><h2>${this.t("polTitle")}</h2><p>${this.t("polHint")}</p></div><div class="actions">${actions}</div></div>`;
    if (this.policiesError) return `<div class="panel">${head}<div class="error">${this.esc(this.policiesError)}</div></div>`;
    if (!r) return `<div class="panel">${head}${this.skeleton("polLoading")}</div>`;
    const none = r.enabled ? "" : `<p class="factnote">${this.t("polNoneOn")}</p>`;
    return `<div class="panel">${head}${r.rules.map(rule => this.polRuleBlock(rule)).join("")}${none}${this.howCounted("polFootnote")}</div>`;
  }
}
