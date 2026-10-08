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

  addPolicyPrefix(domain, prefix) {
    domain = (domain || "").trim(); prefix = (prefix || "").trim();
    if (!domain || !prefix) return Promise.resolve();
    return this.changePolicy({ type: "ha_housekeeper/set_policy_prefix", domain, prefix });
  }

  removePolicyPrefix(domain) {
    return this.changePolicy({ type: "ha_housekeeper/set_policy_prefix", domain, prefix: "" });
  }

  polItemNote(item) {
    if (item.also?.length) return `<small>${this.esc(this.t("polAlso", { ids: item.also.join(", ") }))}</small>`;
    if (item.expected) return `<small>${this.esc(this.t("polExpected", { prefix: item.expected }))}</small>`;
    return "";
  }

  // The prefix of each domain for the naming scheme: a row per prefix with a remove button, and a small form to add one.
  polPrefixEditor() {
    const entries = Object.entries(this.policies?.prefixes || {});
    const rows = entries.map(([domain, prefix]) => `<div class="row politem"><span class="tile mute"><ha-icon icon="mdi:format-letter-starts-with"></ha-icon></span><span class="row-text"><strong>${this.esc(domain)}</strong><small>${this.esc(this.t("polPrefixIs", { prefix }))}</small></span><button class="btn" data-policy-prefix-remove="${this.esc(domain)}">${this.t("polPrefixRemove")}</button></div>`).join("");
    const form = `<div class="row politem polform"><label class="sr-only" for="polDomain">${this.t("polPrefixDomain")}</label><input id="polDomain" type="text" placeholder="${this.esc(this.t("polPrefixDomain"))}" autocomplete="off" maxlength="40"><label class="sr-only" for="polPrefix">${this.t("polPrefixValue")}</label><input id="polPrefix" type="text" placeholder="${this.esc(this.t("polPrefixValue"))}" autocomplete="off" maxlength="30"><button class="btn" data-policy-prefix-add>${this.t("polPrefixAdd")}</button></div>`;
    return `${rows}${form}${entries.length ? "" : `<p class="factnote">${this.t("polPrefixNone")}</p>`}`;
  }

  polItemRow(item) {
    const pill = item.ignored ? `<span class="pill mute">${this.t(item.by === "label" ? "polByLabel" : "polHiddenLabel")}</span>` : "";
    const button = item.by === "label" ? "" : `<button class="btn" data-policy-ignore="${this.esc(item.key)}" data-policy-value="${item.ignored ? 0 : 1}">${this.t(item.ignored ? "polShow" : "polHide")}</button>`;
    return `<div class="row politem"><span class="tile mute"><ha-icon icon="mdi:chevron-right"></ha-icon></span><span class="row-text"><button class="linklike" data-object="${this.esc(`${item.object_type}:${item.object_id}`)}"><strong>${this.esc(item.name)}</strong></button><small>${this.esc(item.object_id)}</small>${this.polItemNote(item)}</span>${pill}${button}</div>`;
  }

  polRuleBlock(rule) {
    const state = !rule.enabled ? this.t("polOff") : rule.count === 1 ? this.t("polCountOne") : rule.count ? this.t("polCount", { n: this.formatNumber(rule.count) }) : this.t("polNone");
    const tone = !rule.enabled ? "mute" : rule.count ? "warn" : "ok";
    const toggle = `<input class="policyswitch" type="checkbox" role="switch" aria-label="${this.esc(this.t(`polRule_${rule.id}`))}" data-policy-toggle="${rule.id}" ${rule.enabled ? "checked" : ""}>`;
    const head = `<div class="row"><span class="tile ${tone}"><ha-icon icon="mdi:clipboard-check-outline"></ha-icon></span><span class="row-text"><strong>${this.t(`polRule_${rule.id}`)}</strong><small>${this.t(`polDesc_${rule.id}`)}</small></span><span class="pill ${tone}">${this.esc(state)}</span>${toggle}</div>`;
    if (!rule.enabled) return head;
    const editor = rule.id === "naming_scheme" ? this.polPrefixEditor() : "";
    const visible = rule.items.filter(i => this.policyShowHidden || !i.ignored);
    const shown = visible.slice(0, 10);
    const more = visible.length > shown.length ? `<p class="factnote">${this.t("polMore", { n: this.formatNumber(visible.length - shown.length) })}</p>` : "";
    const hidden = rule.ignored ? `<p class="factnote">${this.t("polHiddenN", { n: this.formatNumber(rule.ignored) })}</p>` : "";
    return head + editor + shown.map(i => this.polItemRow(i)).join("") + more + hidden;
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
