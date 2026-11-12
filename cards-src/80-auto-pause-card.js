// The auto-pause card: integrations that are paused because they keep failing, with the time to the next attempt.
// The numbers come from the sensor "paused integrations" and its attributes. The menu of a row (try now, end the
// pause, never pause it) is for administrators and calls the same command as the panel.
class HKAutoPauseCard extends HKCard {
  static tag = "ha-housekeeper-auto-pause-card";
  static pickerName = "HA Housekeeper: Auto-pause";
  static pickerDescription = "Integrations that are paused because they keep failing, with the time to the next attempt.";
  static get defaults() { return { actions: true, progress: true }; }

  static editorSchema() {
    return [
      { name: "actions", selector: { boolean: {} } },
      { name: "progress", selector: { boolean: {} } },
    ];
  }

  get titleKey() { return "cardApTitle"; }
  watchedIds() { return [this.idOf("auto_pause")].filter(Boolean); }
  data() { return this.stateOf("auto_pause")?.attributes || {}; }
  hasData() { return Array.isArray(this.data().paused); }
  // Quiet is: auto-pause is on and nothing is paused. A card that says "off" is no news to hide.
  isQuiet() { return this.hasData() && this.data().enabled === true && !this.data().paused.length; }
  canAct() { return Boolean(this._config.actions && this._hass?.user?.is_admin); }

  row(item) {
    const why = item.reason === "manual" ? this.t("cardApWhyManual") : this.t("cardApWhyAuto", { n: item.failures ?? 0, count: item.failures ?? 0 });
    const next = item.exhausted ? this.t("cardApExhausted", { n: this.data().max_days || 7, count: this.data().max_days || 7 })
      : item.trying ? this.t("cardApTrying")
      : this.t("cardApNext", { when: this.until(item.next) });
    const share = Math.min(100, Math.round(((item.attempts_done || 0) / (item.attempts_total || 1)) * 100));
    const progress = this._config.progress && !item.exhausted
      ? `<div class="hk-bar warn"><i style="width:${Math.max(3, share)}%"></i></div><small>${this.esc(this.t("cardApStep", { done: item.attempts_done, total: item.attempts_total, step: item.step_hours }))}</small>` : "";
    const kebab = this.canAct() ? `<button type="button" class="hk-kebab${this._menu?.id === item.entry_id ? " open" : ""}" data-hk-act="menu:${this.esc(item.entry_id)}" aria-label="${this.esc(this.t("cardApMenu"))}">⋮</button>` : "<span></span>";
    return `<div class="hk-row ap"><div class="hk-name"><b>${this.esc(item.title)}</b><small>${this.esc(why)} · ${this.esc(this.t("cardApSince", { ago: this.ago(item.since) }))}</small><div class="hk-next">${this.esc(next)}</div>${progress}</div>${kebab}</div>`;
  }

  // The menu sits at the button, in front of everything (the card clips what runs over its edge).
  menuHtml() {
    const menu = this._menu;
    if (!menu || !this.canAct()) return "";
    const item = (name, key) => `<button type="button" data-hk-act="${name}:${this.esc(menu.id)}">${this.esc(this.t(key))}</button>`;
    return `<div class="hk-backdrop" data-hk-act="menu-close"></div><div class="hk-menu" style="top:${menu.top}px;right:${menu.right}px">${item("try", "cardApTry")}${item("resume", "cardApResume")}${item("never", "cardApNever")}<button type="button" data-hk-act="open">${this.esc(this.t("cardApOpen"))}</button></div>`;
  }

  renderBody() {
    const data = this.data(), paused = data.paused || [], admin = this._hass?.user?.is_admin && this._config.tap !== "none";
    if (!paused.length && !data.enabled) {
      const link = admin ? `<span class="hk-link" data-hk-panel="view=autopause">${this.esc(this.t("cardApEnable"))}</span>` : "";
      return this.head(this.t("cardApOffSub"), link, false, "", this.t("cardApOff"));
    }
    if (!paused.length) return this.head(this.t("cardApNone"), `<span class="hk-chip">${this.esc(this.t("cardApAllRuns"))}</span>`);
    const days = data.max_days || 7;
    return this.head(this.t("cardApOnSub"), `<span class="hk-chip">${this.esc(this.t("cardApChip", { n: paused.length, count: paused.length }))}</span>`, true)
      + paused.map(item => this.row(item)).join("") + this.foot(this.t("cardApFoot", { n: days, count: days }), "view=autopause") + this.menuHtml();
  }

  act(name, event) {
    const [action, id] = String(name).split(":");
    if (action === "menu-close") { this._menu = null; this.update(true); return; }
    if (action === "menu") {
      const box = event?.currentTarget?.getBoundingClientRect?.();
      this._menu = this._menu?.id === id ? null : { id, top: Math.round((box?.bottom ?? 0) + 4), right: Math.round((globalThis.innerWidth ?? 0) - (box?.right ?? 0)) };
      this.update(true);
      return;
    }
    if (action === "open") { this._menu = null; this.openPanel("view=autopause"); this.update(true); return; }
    if (["try", "resume", "never"].includes(action) && this.canAct()) this.run(action, id);
  }

  // Do what the menu says through the command of the panel; say how it went.
  async run(action, id) {
    this._menu = null;
    const done = { try: "cardApTried", resume: "cardApResumed", never: "cardApExcluded" }[action];
    try {
      await this._hass.callWS({ type: "ha_housekeeper/auto_pause_set", action, entry_id: id, ...(action === "never" ? { on: true } : {}) });
      this.toast(this.t(done));
    } catch (err) {
      this.toast(this.t("cardApFailed", { detail: err?.message || String(err) }));
    }
    this.update(true);
  }
}
