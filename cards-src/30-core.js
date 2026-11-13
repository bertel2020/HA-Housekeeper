// What every card shares: finding the Housekeeper entities, deciding whether the card shows, and the frame.
// A concrete card extends HKCard (see 90-register.js) and fills in the parts marked "a card overrides".
const HK_PLATFORM = "ha_housekeeper";
const HK_PANEL_PATH = "/ha-housekeeper";
const HK_DEFAULTS = { quiet: "summary", tap: "panel", compact: false };

// The Housekeeper entities by the translation key of their sensor: { findings: ["sensor.…"], monitor: [... one per function] }.
// The card finds them itself in the entity registry of the frontend, so nobody has to pick an entity.
function findEntities(entities) {
  const byKey = {};
  for (const item of Object.values(entities || {})) {
    if (item?.platform !== HK_PLATFORM || !item.translation_key) continue;
    (byKey[item.translation_key] ||= []).push(item.entity_id);
  }
  return { byKey };
}

// Whether a card shows. "show": normal; "hide": nothing, because it is quiet and the person chose to hide it;
// "placeholder": quiet and hidden, but somebody is editing the dashboard and must still find the card.
function cardVisibility(quiet, choice, editing) {
  if (!quiet || choice !== "hide") return "show";
  return editing ? "placeholder" : "hide";
}

// A short fingerprint of the states a card shows, so it draws itself only when one of them changed.
function watchSignature(hass, ids) {
  return ids.map(id => `${id}:${hass?.states?.[id]?.last_updated || "-"}`).join("|");
}

const escapeHtml = value => String(value ?? "—").replace(/[&<>'"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));

class HKCard extends HTMLElement {
  // A card overrides: static tag (the element name), static pickerName and pickerDescription (English, the picker does not translate).
  static get editorTag() { return `${this.tag}-editor`; }
  static getConfigElement() { return globalThis.document.createElement(this.editorTag); }
  static getStubConfig() { return {}; }
  // A card overrides: the defaults of its own options (merged after the common ones).
  static get defaults() { return {}; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = null;
    this._hass = null;
    this._sig = null;
    this._found = null;
    this._entities = null;
    this.refresh = () => this.update(true);
  }

  connectedCallback() { CardTexts.listeners.add(this.refresh); this.update(true); }
  disconnectedCallback() { CardTexts.listeners.delete(this.refresh); }

  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Invalid configuration");
    this._config = { ...HK_DEFAULTS, ...this.constructor.defaults, ...config };
    this.update(true);
  }

  set hass(hass) {
    this._hass = hass;
    CardTexts.ensure(this.lang);
    this.update();
  }

  get lang() { return CardTexts.language(this._hass); }
  t(key, vars) { return CardTexts.t(this.lang, key, vars); }
  esc(value) { return escapeHtml(value); }
  getCardSize() { return 3; }

  // The Housekeeper entities, worked out again only when the registry changed.
  found() {
    const registry = this._hass?.entities;
    if (!this._found || this._entities !== registry) { this._found = findEntities(registry); this._entities = registry; }
    return this._found;
  }

  // The entity id for a translation key in a domain (a sensor and an event can share a key).
  idOf(key, domain = "sensor") {
    return this.found().byKey[key]?.find(id => id.startsWith(`${domain}.`)) || null;
  }

  // The state of that entity, or null.
  stateOf(key, domain = "sensor") {
    const id = this.idOf(key, domain);
    return (id && this._hass?.states?.[id]) || null;
  }

  // "in 54 minutes" for a time ahead, in the language of the card; "" when the time is not known.
  until(iso) {
    const then = Date.parse(iso || "");
    if (!Number.isFinite(then)) return "";
    const minutes = Math.max(0, Math.round((then - Date.now()) / 60000));
    const [value, unit] = minutes < 60 ? [minutes, "minute"] : minutes < 1440 ? [Math.round(minutes / 60), "hour"] : [Math.round(minutes / 1440), "day"];
    try { return new Intl.RelativeTimeFormat(this.lang, { numeric: "auto" }).format(value, unit); } catch (_) { return ""; }
  }

  // A short message at the foot of the screen, the way Home Assistant shows them.
  toast(message) { this.dispatchEvent(new CustomEvent("hass-notification", { detail: { message }, bubbles: true, composed: true })); }

  // "12 minutes ago" for a time, in the language of the card; "" when the time is not known.
  ago(iso) {
    const then = Date.parse(iso || "");
    if (!Number.isFinite(then)) return "";
    const minutes = Math.max(0, Math.round((Date.now() - then) / 60000));
    const [value, unit] = minutes < 60 ? [minutes, "minute"] : minutes < 1440 ? [Math.round(minutes / 60), "hour"] : [Math.round(minutes / 1440), "day"];
    try { return new Intl.RelativeTimeFormat(this.lang, { numeric: "auto" }).format(-value, unit); } catch (_) { return ""; }
  }

  // A card overrides: the entity ids whose changes it shows (default: every Housekeeper entity).
  watchedIds() { return Object.values(this.found().byKey).flat(); }
  // A card overrides: true while there is nothing to do (the "Show the summary / Hide the card" choice applies).
  isQuiet() { return false; }
  // A card overrides: false while the first scan has not delivered its numbers.
  hasData() { return true; }
  // A card overrides: the text key of its title, shown when the configuration has no title of its own.
  get titleKey() { return "cardTitle"; }
  // A card overrides: the HTML of the card without the frame.
  renderBody() { return ""; }
  // A card overrides: the text that says in the editor why the card would be hidden, and a class for its frame.
  hiddenKey() { return "cardQuietHidden"; }
  frameClass() { return ""; }

  titleText() { return this._config?.title || this.t(this.titleKey); }
  editing() { return this.preview === true || this.editMode === true || this._hass?.editMode === true; }
  mode() { return cardVisibility(this.isQuiet(), this._config.quiet, this.editing()); }

  // Draw again when the language, the shown states or the visibility changed (or when forced).
  update(force = false) {
    if (!this._config || !this._hass) return;
    const sig = [this.lang, this.mode(), Boolean(this._hass.user?.is_admin), watchSignature(this._hass, this.watchedIds()), JSON.stringify(this._config)].join("#");
    if (!force && sig === this._sig) return;
    this._sig = sig;
    this.render();
  }

  render() {
    const mode = this.mode();
    this.style.display = mode === "hide" ? "none" : "";
    if (mode === "hide") { this.shadowRoot.innerHTML = ""; return; }
    let body;
    if (!Object.keys(this.found().byKey).length) body = `<div class="hk-note">${this.esc(this.t("cardNotFound"))}</div>`;
    else if (!this.hasData()) body = `<div class="hk-note">${this.esc(this.t("cardNoData"))}</div>`;
    else body = this.renderBody();
    const banner = mode === "placeholder" ? `<div class="hk-banner">${this.esc(this.t(this.hiddenKey()))}</div>` : "";
    const frame = [this._config.compact ? "hk-compact" : "", this.frameClass()].filter(Boolean).join(" ");
    this.shadowRoot.innerHTML = `<style>${CARD_CSS}</style><ha-card class="${frame}">${banner}${body}</ha-card>`;
    this.shadowRoot.querySelectorAll("[data-hk-panel]").forEach(el => el.addEventListener("click", () => this.openPanel(el.getAttribute("data-hk-panel"))));
    this.shadowRoot.querySelectorAll("[data-hk-act]").forEach(el => el.addEventListener("click", event => this.act(el.getAttribute("data-hk-act"), event)));
  }

  // A card overrides: what a click on an element with data-hk-act does.
  act(_name, _event) {}

  // Open the Housekeeper panel when the configuration allows it and the person is an administrator. The panel
  // reads its deep link from the query (view=findingsNav&filter=topic:down).
  openPanel(query = "") {
    if (this._config?.tap === "none" || !this._hass?.user?.is_admin) return;
    globalThis.history.pushState(null, "", query ? `${HK_PANEL_PATH}?${query}` : HK_PANEL_PATH);
    globalThis.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
  }

  // The head of a card: a title, a line below it and, on the right, what the card puts there (a chip, a button).
  head(subtitle = "", right = "", line = false, left = "", title = this.titleText()) {
    return `<div class="hk-head${line ? " line" : ""}">${left}<div class="hk-t"><b>${this.esc(title)}</b>${subtitle ? `<small>${this.esc(subtitle)}</small>` : ""}</div>${right}</div>`;
  }

  // The foot of a card: a line on the left, the link to the panel on the right (only for administrators).
  foot(left = "", query = "") { return this.footHtml(this.esc(left), query); }

  // The same with a left part that is HTML already (the caller escaped it).
  footHtml(leftHtml = "", query = "") {
    const link = this._config.tap !== "none" && this._hass?.user?.is_admin ? `<span class="hk-link" data-hk-panel="${this.esc(query)}">${this.esc(this.t("cardOpenPanel"))}</span>` : "";
    return `<div class="hk-foot"><span>${leftHtml}</span><span class="hk-sp"></span>${link}</div>`;
  }
}
