// GENERATED FILE - do not edit. Edit cards-src/*.js and run: node scripts/build_panel.mjs

const LANGUAGES = [{"code":"de","name":"Deutsch","patterns":["de"],"quotes":["„","“"],"lowerKind":false},{"code":"en","name":"English","patterns":["en"],"quotes":["“","”"],"lowerKind":true},{"code":"fr","name":"Français","patterns":["fr"],"quotes":["« "," »"],"lowerKind":true,"status":"community","v":"b4cab019ad"},{"code":"es","name":"Español","patterns":["es"],"quotes":["“","”"],"lowerKind":true,"status":"community","v":"22fef61cd1"},{"code":"pt","name":"Português","patterns":["pt","pt-pt","pt-br"],"quotes":["«","»"],"lowerKind":true,"status":"community","v":"9ca1b7c5ee"},{"code":"it","name":"Italiano","patterns":["it"],"quotes":["«","»"],"lowerKind":true,"status":"community","v":"35900f59ee"},{"code":"sk","name":"Slovenčina","patterns":["sk"],"quotes":["„","“"],"lowerKind":false,"status":"community","v":"931fae709c"},{"code":"ru","name":"Русский","patterns":["ru"],"quotes":["«","»"],"lowerKind":false,"status":"community","v":"b0796e36b1"},{"code":"zh-Hans","name":"简体中文","patterns":["zh-hans","zh-cn","zh-sg"],"quotes":["“","”"],"lowerKind":false,"status":"community","v":"3b2ecfe79a"}];

// The languages of the panel. The list itself (LANGUAGES) is languages.json, put in front of the bundle by the build.

// The language for a Home Assistant language code: an exact match of a pattern, else the main part
// (de-AT -> de), else English. Written like this so zh-Hant does not fall to zh-Hans.
function matchLanguage(list, code) {
  const full = String(code || "en").toLowerCase().replace(/_/g, "-"), main = full.split("-")[0];
  const find = key => list.find(l => l.patterns.includes(key));
  return (find(full) || find(main))?.code || "en";
}

const languageInfo = code => LANGUAGES.find(l => l.code === code) || LANGUAGES.find(l => l.code === "en");

// A text with its own plural forms: the form of the number (`count`, else `n`), else `other`.
// The number may already be formatted ("1.234", "1 234"): only its digits count. Plural texts are for whole numbers.
function pluralText(forms, lang, vars) {
  let form = "other";
  try {
    const raw = vars?.count ?? vars?.n;
    const number = typeof raw === "number" ? raw : Number(String(raw).replace(/[^\d]/g, "") || NaN);
    form = new Intl.PluralRules(lang).select(number);
  } catch (_) { /* no number: the general form */ }
  return forms[form] ?? forms.other ?? "";
}

// Texts of the Lovelace cards. German and English live here; every other language is a file,
// frontend/i18n/cards/<code>.json, that a card fetches once (see 20-texts.js). A text that is missing shows in English.
// Keys: card* are shown on a card, edit_* label the card editor (edit_<field>, edit_<field>_<option>, edit_<field>_help).
const CARD_TEXT = {
  de: {
    cardNotFound: "HA Housekeeper wurde nicht gefunden. Ist die Integration eingerichtet?",
    cardNoData: "Noch keine Daten: der erste Scan steht noch aus.",
    cardQuietHidden: "Im Ruhezustand ist diese Karte ausgeblendet. Im Editor siehst du sie trotzdem.",
    cardOpenPanel: "Im Panel öffnen →",
    edit_title: "Titel",
    edit_quiet: "Im Ruhezustand", edit_quiet_summary: "Zusammenfassung zeigen", edit_quiet_hide: "Karte ausblenden",
    edit_quiet_help: "Ruhezustand heißt: nichts zu tun. Ausgeblendet verschwindet die Karte vom Dashboard, bis wieder etwas anliegt.",
    edit_tap: "Tipp öffnet", edit_tap_panel: "Panel von Housekeeper", edit_tap_none: "Nichts",
    edit_tap_help: "Ins Panel kommen nur Administratoren.",
    edit_compact: "Kompakt",
  },
  en: {
    cardNotFound: "HA Housekeeper was not found. Is the integration set up?",
    cardNoData: "No data yet: the first scan is still to come.",
    cardQuietHidden: "This card is hidden while everything is quiet. You still see it here in the editor.",
    cardOpenPanel: "Open in the panel →",
    edit_title: "Title",
    edit_quiet: "When quiet", edit_quiet_summary: "Show the summary", edit_quiet_hide: "Hide the card",
    edit_quiet_help: "Quiet means there is nothing to do. Hidden removes the card from the dashboard until something is due again.",
    edit_tap: "A tap opens", edit_tap_panel: "The Housekeeper panel", edit_tap_none: "Nothing",
    edit_tap_help: "Only administrators can open the panel.",
    edit_compact: "Compact",
  },
};

// The look shared by all cards. A card uses the colors of the chosen Home Assistant theme, not its own.
const CARD_CSS = `
  :host { display: block; }
  ha-card { overflow: hidden; }
  .hk-head { display: flex; gap: 12px; align-items: center; padding: 14px 16px; }
  .hk-head.line { border-bottom: 1px solid var(--divider-color); }
  .hk-head .hk-t { flex: 1; min-width: 0; }
  .hk-head .hk-t b { display: block; font-size: 16px; color: var(--primary-text-color); }
  .hk-head .hk-t small { color: var(--secondary-text-color); font-size: 12px; }
  .hk-compact .hk-head { padding: 10px 12px; }
  .hk-chip { font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 99px; white-space: nowrap; background: var(--secondary-background-color); color: var(--secondary-text-color); }
  .hk-chip.warn { background: color-mix(in srgb, var(--warning-color) 18%, var(--card-background-color)); color: var(--primary-text-color); }
  .hk-chip.bad { background: color-mix(in srgb, var(--error-color) 16%, var(--card-background-color)); color: var(--primary-text-color); }
  .hk-foot { display: flex; gap: 14px; flex-wrap: wrap; padding: 10px 16px; font-size: 12.5px; color: var(--secondary-text-color); border-top: 1px solid var(--divider-color); }
  .hk-foot .hk-sp { flex: 1; }
  .hk-link { color: var(--primary-color); font-weight: 600; cursor: pointer; }
  .hk-note { padding: 14px 16px; color: var(--secondary-text-color); font-size: 13px; }
  .hk-banner { padding: 8px 16px; font-size: 12.5px; color: var(--secondary-text-color); background: var(--secondary-background-color); border-bottom: 1px dashed var(--divider-color); }
`;

// The language of a card and its texts. German and English are in CARD_TEXT; any other language is fetched once
// (it is shared by every card on the page) and the cards that wait for it draw themselves again.
const CardTexts = {
  loading: {},
  listeners: new Set(),

  // The language of the person looking at the dashboard.
  language(hass) {
    return matchLanguage(LANGUAGES, hass?.locale?.language || hass?.language);
  },

  // Fetch the texts of a language besides German and English; until they are here, English shows.
  ensure(code) {
    const entry = LANGUAGES.find(l => l.code === code);
    if (!entry?.v || CARD_TEXT[code] || this.loading[code]) return;
    this.loading[code] = true;
    fetch(`/ha_housekeeper/i18n/cards/${code}.json?v=${entry.v}`)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(texts => { CARD_TEXT[code] = texts; this.listeners.forEach(refresh => refresh()); })
      .catch(() => { delete this.loading[code]; }); // stays English; the next card that asks tries again
  },

  has(code, key) {
    return Boolean(CARD_TEXT[code]?.[key] || CARD_TEXT.en[key]);
  },

  // A text may be a string or, for a language with more plural forms, an object {one, few, many, other}.
  t(code, key, vars) {
    let text = CARD_TEXT[code]?.[key] || CARD_TEXT.en[key] || key;
    if (text && typeof text === "object") text = pluralText(text, code, vars);
    return vars ? text.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "") : text;
  },
};

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
    this._config = { ...HK_DEFAULTS, ...config };
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

  // The state of the first entity with this translation key, or null.
  stateOf(key) {
    const id = this.found().byKey[key]?.[0];
    return (id && this._hass?.states?.[id]) || null;
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
    const banner = mode === "placeholder" ? `<div class="hk-banner">${this.esc(this.t("cardQuietHidden"))}</div>` : "";
    this.shadowRoot.innerHTML = `<style>${CARD_CSS}</style><ha-card class="${this._config.compact ? "hk-compact" : ""}">${banner}${body}</ha-card>`;
    this.shadowRoot.querySelectorAll("[data-hk-panel]").forEach(el => el.addEventListener("click", () => this.openPanel(el.getAttribute("data-hk-panel"))));
  }

  // Open the Housekeeper panel (or a page of it) when the configuration allows it and the person is an administrator.
  openPanel(page = "") {
    if (this._config?.tap === "none" || !this._hass?.user?.is_admin) return;
    globalThis.history.pushState(null, "", page ? `${HK_PANEL_PATH}/${page}` : HK_PANEL_PATH);
    globalThis.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
  }

  // The head of a card: a title, a line below it and, on the right, what the card puts there (a chip, a button).
  head(subtitle = "", right = "", line = false) {
    return `<div class="hk-head${line ? " line" : ""}"><div class="hk-t"><b>${this.esc(this.titleText())}</b>${subtitle ? `<small>${this.esc(subtitle)}</small>` : ""}</div>${right}</div>`;
  }

  // The foot of a card: a line on the left, the link to the panel on the right (only for administrators).
  foot(left = "", page = "") {
    const link = this._config.tap !== "none" && this._hass?.user?.is_admin ? `<span class="hk-link" data-hk-panel="${this.esc(page)}">${this.esc(this.t("cardOpenPanel"))}</span>` : "";
    return `<div class="hk-foot"><span>${this.esc(left)}</span><span class="hk-sp"></span>${link}</div>`;
  }
}

// The card editor: one form for the options every card has plus the options of the card itself.
// The form is Home Assistant's own (ha-form), so the editor looks like the rest of the dashboard editor.
function commonSchema(t) {
  const choice = (name, values) => ({ name, selector: { select: { mode: "dropdown", options: values.map(value => ({ value, label: t(`edit_${name}_${value}`) })) } } });
  return [
    { name: "title", selector: { text: {} } },
    choice("quiet", ["summary", "hide"]),
    choice("tap", ["panel", "none"]),
    { name: "compact", selector: { boolean: {} } },
  ];
}

function makeEditor(CardClass) {
  return class extends HTMLElement {
    constructor() {
      super();
      this._config = null;
      this._hass = null;
      this._form = null;
      this.refresh = () => this.render();
    }

    connectedCallback() { CardTexts.listeners.add(this.refresh); }
    disconnectedCallback() { CardTexts.listeners.delete(this.refresh); }

    setConfig(config) { this._config = { ...HK_DEFAULTS, ...config }; this.render(); }
    set hass(hass) { this._hass = hass; CardTexts.ensure(CardTexts.language(hass)); this.render(); }

    // The options of the card itself come after the common ones; a card names them in static editorSchema(t).
    schema() {
      const t = key => CardTexts.t(CardTexts.language(this._hass), key);
      return [...commonSchema(t), ...(CardClass.editorSchema ? CardClass.editorSchema(t) : [])];
    }

    render() {
      if (!this._config || !this._hass) return;
      const lang = CardTexts.language(this._hass);
      if (!this._form) {
        this._form = globalThis.document.createElement("ha-form");
        this._form.addEventListener("value-changed", event => {
          event.stopPropagation();
          this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: event.detail.value }, bubbles: true, composed: true }));
        });
        this.appendChild(this._form);
      }
      this._form.hass = this._hass;
      this._form.data = this._config;
      this._form.schema = this.schema();
      this._form.computeLabel = field => CardTexts.t(lang, `edit_${field.name}`);
      this._form.computeHelper = field => (CardTexts.has(lang, `edit_${field.name}_help`) ? CardTexts.t(lang, `edit_${field.name}_help`) : "");
    }
  };
}

// Every card is registered here: its element, its editor and its entry in the card picker.
// The picker shows English only, it has no way to translate a name.
function registerCard(CardClass) {
  const tag = CardClass.tag;
  if (!customElements.get(tag)) customElements.define(tag, CardClass);
  if (!customElements.get(CardClass.editorTag)) customElements.define(CardClass.editorTag, makeEditor(CardClass));
  const list = (globalThis.customCards ||= []);
  if (!list.some(card => card.type === tag)) {
    list.push({ type: tag, name: CardClass.pickerName, description: CardClass.pickerDescription, preview: true, documentationURL: "https://github.com/bertel2020/HA-Housekeeper" });
  }
}

// The cards themselves come with the next steps; this file lists them:
// registerCard(HKHealthCard);
