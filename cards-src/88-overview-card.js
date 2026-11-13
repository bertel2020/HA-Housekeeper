// The overview card: the cards of this integration as the sections of one card, in tabs or one below the other.
// It has no logic of its own: each section is the card itself, kept alive and given the same hass, so a section looks
// and acts exactly like the single card. A tab shows how many things in its section call for a look.
// The first five are the default; the others are chosen in the editor or in YAML.
const HK_SECTION_KEYS = ["health", "batteries", "functions", "auto_pause", "update", "backup", "start", "database", "vacation"];
const HK_SECTION_DEFAULT = ["health", "batteries", "functions", "auto_pause", "update"];
const HK_SECTION_LABELS = { health: "cardOvHealth", batteries: "cardOvBatteries", functions: "cardOvFunctions", auto_pause: "cardOvAutoPause", update: "cardOvUpdate", backup: "cardOvBackup", start: "cardOvStart", database: "cardOvDatabase", vacation: "cardOvVacation" };
const hkSectionClass = key => ({ health: HKHealthCard, batteries: HKBatteryCard, functions: HKFunctionsCard, auto_pause: HKAutoPauseCard, update: HKUpdateCard, backup: HKBackupCard, start: HKStartCard, database: HKDatabaseCard, vacation: HKVacationCard })[key];

// The sections of the configuration: a name ("batteries") or an entry with the options of that card
// ({ type: "batteries", rows: 3 }). An unknown name and a repeated one are left out. `common` is what every
// section gets unless its entry says otherwise.
function sectionSpecs(sections, common) {
  const seen = new Set(), out = [];
  for (const item of Array.isArray(sections) ? sections : []) {
    const spec = typeof item === "string" ? { type: item } : item;
    const key = spec?.type;
    if (!HK_SECTION_KEYS.includes(key) || seen.has(key)) continue;
    seen.add(key);
    const { type, ...options } = spec;
    // The vacation card is there only while the mode is on, whatever the rest of the sections do when quiet.
    out.push({ key, config: { ...common, ...(key === "vacation" ? { quiet: "hide" } : {}), ...options } });
  }
  return out;
}

// Which sections show and which one is open: the one the person picked, else the first with something to look at.
function overviewPlan(keys, hidden, attention, picked) {
  const shown = keys.filter(key => !hidden.has(key));
  const open = shown.includes(picked) ? picked : shown.find(key => (attention[key] || 0) > 0) || shown[0] || null;
  return { shown, open };
}

class HKOverviewCard extends HKCard {
  static tag = "ha-housekeeper-overview-card";
  static pickerName = "HA Housekeeper: Overview";
  static pickerDescription = "The health of the house, batteries, home functions, auto-pause, the update, backup, start time, database and vacation mode in one card, in tabs.";
  static get defaults() { return { sections: [...HK_SECTION_DEFAULT], layout: "tabs" }; }

  static editorSchema(t) {
    return [
      { name: "sections", selector: { select: { multiple: true, mode: "list", options: HK_SECTION_KEYS.map(value => ({ value, label: t(`edit_sections_${value}`) })) } } },
      { name: "layout", selector: { select: { mode: "dropdown", options: ["tabs", "stacked"].map(value => ({ value, label: t(`edit_layout_${value}`) })) } } },
    ];
  }

  getCardSize() { return 6; }
  watchedIds() { return []; }

  // The sections live on between updates: only a new configuration builds them again.
  update(force = false) {
    if (!this._config || !this._hass) return;
    if (force || !this._sections) this.build();
    for (const el of this._sections.values()) { el.preview = this.preview === true; el.hass = this._hass; }
    this.arrange();
  }

  build() {
    const { tap, compact, quiet } = this._config, common = { tap, compact, quiet };
    const doc = globalThis.document, root = this.shadowRoot;
    const title = this._config.title ? `<div class="hk-ovtitle">${this.esc(this._config.title)}</div>` : "";
    root.innerHTML = `<style>${CARD_CSS}</style><ha-card><div class="hk-ov ${this._config.layout === "stacked" ? "stacked" : ""}">${title}<div class="hk-ovtabs" role="tablist"></div><div class="hk-ovpanes"></div></div></ha-card>`;
    const panes = root.querySelector(".hk-ovpanes");
    this._sections = new Map();
    this._panes = new Map();
    this._tabsHtml = null; // the tab bar is new, so it is drawn again
    for (const { key, config } of sectionSpecs(this._config.sections, common)) {
      const el = doc.createElement(hkSectionClass(key).tag);
      // The section is no card of its own here: the frame is the one of the overview.
      el.style.cssText = "--ha-card-border-width: 0; --ha-card-box-shadow: none; --ha-card-border-radius: 0; --ha-card-background: transparent;";
      el.setConfig(config);
      const pane = doc.createElement("div");
      pane.setAttribute("role", "tabpanel");
      pane.appendChild(el);
      panes.appendChild(pane);
      this._sections.set(key, el);
      this._panes.set(key, pane);
    }
    const tabs = root.querySelector(".hk-ovtabs");
    tabs.setAttribute("aria-label", this.t("cardOvTabs"));
    tabs.addEventListener("click", event => { const key = event.target.closest?.("[data-hk-tab]")?.getAttribute("data-hk-tab"); if (key) this.pick(key); });
    tabs.addEventListener("keydown", event => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (!step || !this._shown?.length) return;
      event.preventDefault();
      this.pick(this._shown[(this._shown.indexOf(this._open) + step + this._shown.length) % this._shown.length], true);
    });
  }

  pick(key, focus = false) {
    this._picked = key;
    this.arrange();
    if (focus) this.shadowRoot.querySelector(`[data-hk-tab="${key}"]`)?.focus?.();
  }

  // Which sections show, which one is open, and the tab bar to match.
  arrange() {
    const keys = [...this._sections.keys()];
    const hidden = new Set(keys.filter(key => this._sections.get(key).style.display === "none"));
    const attention = Object.fromEntries(keys.map(key => [key, this._sections.get(key).attention()]));
    const { shown, open } = overviewPlan(keys, hidden, attention, this._picked);
    this._shown = shown; this._open = open;
    this.style.display = !shown.length && this.preview !== true ? "none" : "";
    for (const [key, pane] of this._panes) pane.className = `hk-pane${shown.includes(key) ? " in" : ""}${key === open ? " open" : ""}`;
    const html = shown.map(key => `<button type="button" role="tab" class="hk-tab${key === open ? " on" : ""}" aria-selected="${key === open}" tabindex="${key === open ? 0 : -1}" data-hk-tab="${key}">${this.esc(this.t(HK_SECTION_LABELS[key]))}${attention[key] ? `<span class="hk-badge">${this.esc(attention[key])}</span>` : ""}</button>`).join("");
    const tabs = this.shadowRoot.querySelector(".hk-ovtabs");
    if (tabs && this._tabsHtml !== html) { tabs.innerHTML = html || `<span class="hk-note">${this.esc(this.t("cardOvNone"))}</span>`; this._tabsHtml = html; }
  }
}
