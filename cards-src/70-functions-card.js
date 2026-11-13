// The home functions card: one row per function (heating, alarm, photovoltaics ...) with its state now, the reason in
// words, how many of its objects are fine and the days of the last weeks as a strip. The numbers come from the sensor
// of each function (its state and attributes); the strip is Housekeeper's own record, no query of the history.
class HKFunctionsCard extends HKCard {
  static tag = "ha-housekeeper-functions-card";
  static pickerName = "HA Housekeeper: Home functions";
  static pickerDescription = "Heating, alarm, photovoltaics: the functions of the house with their state, the reason and the last weeks.";
  static get defaults() { return { entities: [], history: "30" }; }

  static editorSchema(t) {
    return [
      { name: "entities", selector: { entity: { multiple: true, filter: { integration: "ha_housekeeper", domain: "sensor" } } } },
      { name: "history", selector: { select: { mode: "dropdown", options: ["30", "14", "7", "0"].map(value => ({ value, label: t(`edit_history_${value}`) })) } } },
    ];
  }

  get titleKey() { return "cardFnTitle"; }

  // The sensors of the functions, the chosen ones when the configuration names some. Worst first, then by name.
  functions() {
    const chosen = new Set(this._config.entities || []);
    const rank = { problem: 0, unverified: 1, ok: 2, disabled: 3 };
    return (this.found().byKey.monitor || [])
      .filter(id => id.startsWith("sensor.") && (!chosen.size || chosen.has(id)))
      .map(id => ({ id, state: this._hass?.states?.[id] }))
      .filter(f => f.state)
      .sort((a, b) => (rank[a.state.state] ?? 4) - (rank[b.state.state] ?? 4) || String(a.state.attributes?.function_name).localeCompare(String(b.state.attributes?.function_name)));
  }

  watchedIds() { return this.functions().map(f => f.id); }
  hasData() { return true; }
  attention() { return this.functions().filter(f => ["problem", "unverified"].includes(f.state.state)).length; }
  // Quiet is: every function is fine.
  isQuiet() { return this.functions().length > 0 && this.functions().every(f => f.state.state === "ok"); }

  // What is wrong, in words: the object and what it does, or that the state is not sure.
  reason(attrs, state) {
    if (state === "disabled") return this.t("cardFnOff");
    const name = attrs.problem_object || attrs.function_name || "";
    if (state === "unverified") return this.t("cardFnUnsure");
    const code = String(attrs.reason || "");
    if (code === "disabled") return this.t("cardFnMemberOff", { name });
    if (code === "rule_stale") return this.t("cardFnStale", { name });
    if (code === "rule_below_min") return this.t("cardFnBelow", { name });
    return this.t("cardFnDown", { name });
  }

  strip(days) {
    const count = Number(this._config.history);
    if (!count || !Array.isArray(days) || !days.length) return "<div></div>";
    return `<div class="hk-strip">${days.slice(-count).map(day => `<i class="${this.esc(day || "none")}"></i>`).join("")}</div>`;
  }

  row(item) {
    const state = item.state.state, attrs = item.state.attributes || {};
    const tone = { ok: "ok", problem: "bad", unverified: "warn", disabled: "off" }[state] || "off";
    const sub = state === "ok" || state === "disabled" && !attrs.members_total
      ? this.t("cardFnMembers", { ok: attrs.members_ok ?? 0, total: attrs.members_total ?? 0, count: attrs.members_total ?? 0 })
      : this.reason(attrs, state);
    const go = this._config.tap !== "none" && this._hass?.user?.is_admin && attrs.function_id;
    const link = go ? ` data-hk-panel="view=monitor&amp;function=${this.esc(attrs.function_id)}"` : "";
    const available = attrs.availability_30d == null ? "—" : `${String(attrs.availability_30d).replace(".", this.decimal())} %`;
    return `<div class="hk-row fn${go ? " go" : ""}"${link}><span class="hk-st ${tone}"></span><div class="hk-name"><b>${this.esc(attrs.function_name)}</b><small class="${state === "problem" ? "bad" : state === "unverified" ? "warn" : ""}">${this.esc(sub)}</small></div>${this.strip(attrs.history_30d)}<div class="hk-right"><b>${this.esc(available)}</b><small>${this.esc(this.t("cardFnWindow", { n: 30 }))}</small></div></div>`;
  }

  decimal() { try { return (1.5).toLocaleString(this.lang).replace(/\d/g, ""); } catch (_) { return "."; } }

  renderBody() {
    const list = this.functions(), troubled = list.filter(f => f.state.state === "problem").length, unsure = list.filter(f => f.state.state === "unverified").length;
    if (!list.length) return this.head("", "") + `<div class="hk-note">${this.esc(this.t("cardFnNone"))}</div>` + this.foot("", "view=monitor");
    const chip = troubled ? `<span class="hk-chip bad">${this.esc(this.t("cardFnProblems", { n: troubled, count: troubled }))}</span>`
      : unsure ? `<span class="hk-chip warn">${this.esc(this.t("cardFnUnverified", { n: unsure, count: unsure }))}</span>`
      : `<span class="hk-chip">${this.esc(this.t("cardFnAllOk"))}</span>`;
    return this.head(this.t("cardFnCount", { n: list.length, count: list.length }), chip, true) + list.map(item => this.row(item)).join("") + this.foot("", "view=monitor");
  }
}
