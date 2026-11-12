// GENERATED FILE - do not edit. Edit cards-src/*.js and run: node scripts/build_panel.mjs

const LANGUAGES = [{"code":"de","name":"Deutsch","patterns":["de"],"quotes":["„","“"],"lowerKind":false},{"code":"en","name":"English","patterns":["en"],"quotes":["“","”"],"lowerKind":true},{"code":"fr","name":"Français","patterns":["fr"],"quotes":["« "," »"],"lowerKind":true,"status":"community","v":"2afb8d3e61"},{"code":"es","name":"Español","patterns":["es"],"quotes":["“","”"],"lowerKind":true,"status":"community","v":"cb9feb2e20"},{"code":"pt","name":"Português","patterns":["pt","pt-pt","pt-br"],"quotes":["«","»"],"lowerKind":true,"status":"community","v":"e770da8052"},{"code":"it","name":"Italiano","patterns":["it"],"quotes":["«","»"],"lowerKind":true,"status":"community","v":"7c4a3174b4"},{"code":"sk","name":"Slovenčina","patterns":["sk"],"quotes":["„","“"],"lowerKind":false,"status":"community","v":"738e78ff3f"},{"code":"ru","name":"Русский","patterns":["ru"],"quotes":["«","»"],"lowerKind":false,"status":"community","v":"ccc88673b4"},{"code":"zh-Hans","name":"简体中文","patterns":["zh-hans","zh-cn","zh-sg"],"quotes":["“","”"],"lowerKind":false,"status":"community","v":"9e5a8f8409"}];

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
    cardTopic_down: "Ausgefallen",
    cardTopic_broken_references: "Kaputte Verweise",
    cardTopic_failing_automations: "Fehlerhafte Automationen",
    cardTopic_unneeded: "Überflüssig",
    cardHealthOk: "Alles in Ordnung",
    cardHealthAttention: {"one": "{n} Objekt braucht Aufmerksamkeit", "other": "{n} Objekte brauchen Aufmerksamkeit"},
    cardHealthUrgent: "Es gibt Dringendes",
    cardHealthScanBad: "Der Scan läuft nicht durch",
    cardScanOld: "Die Zahlen können veraltet sein.",
    cardLastScan: "Letzter Scan {ago}",
    cardScan: "Scan",
    cardScanning: "Scan läuft …",
    cardSince: "Seit dem letzten Scan:",
    cardNew: "+{n} neu",
    cardResolved: "−{n} behoben",
    cardNoChanges: "Keine Änderungen seit dem letzten Scan",
    cardNoFindings: "Keine offenen Befunde",
    edit_tiles: "Kacheln",
    edit_tiles_findings: "Nur bei Befunden",
    edit_tiles_always: "Immer",
    edit_tiles_never: "Nie",
    edit_changes: "Änderungen seit dem letzten Scan zeigen",
    edit_scan_button: "Scan-Knopf zeigen",
    edit_scan_button_help: "Nur Administratoren sehen den Knopf.",
    cardBatTitle: "Batterien",
    cardBatWeakestSub: "Schwächste {n} von {total}",
    cardBatRoundSub: {"one": "In den nächsten {days} Tagen: {n} Batterie", "other": "In den nächsten {days} Tagen: {n} Batterien"},
    cardBatLowChip: {"one": "{n} schwach", "other": "{n} schwach"},
    cardBatAllGood: "Alles gut",
    cardBatQuietSub: "{total} überwacht · niedrigste {lowest} %",
    cardBatQuietFoot: "Keine Batterie unter dem Grenzwert",
    cardBatNext: "Nächster Wechsel voraussichtlich im {when}",
    cardBatLowNow: "Wechsel fällig",
    cardBatDays: {"one": "ca. {n} Tag", "other": "ca. {n} Tage"},
    cardBatWeeks: {"one": "ca. {n} Woche", "other": "ca. {n} Wochen"},
    cardBatMonths: {"one": "ca. {n} Monat", "other": "ca. {n} Monate"},
    cardBatSoon: "in Kürze",
    cardBatStable: "kaum Verbrauch",
    cardBatFollows: "Prognose folgt",
    cardBatQEstimate: "Schätzung",
    cardBatQStable: "stabil",
    cardBatQFew: "zu wenig Daten",
    cardBatRound: "Wechselrunde",
    cardBatNoArea: "Ohne Bereich",
    cardBatShopping: "Einkaufsliste",
    cardBatUnknown: "Typ unbekannt",
    cardBatUnknownHint: "Typ im Panel setzen",
    cardBatNoRechargeable: "Akkus („Rechargeable“) stehen nicht auf der Liste",
    edit_view: "Ansicht",
    edit_view_weakest: "Schwächste",
    edit_view_round: "Wechselrunde",
    edit_view_both: "Beides",
    edit_rows: "Zeilen bei „Schwächste“",
    edit_shopping: "Einkaufsliste zeigen",
    edit_shopping_help: "Die Einkaufsliste gehört zur Wechselrunde.",
    edit_forecast: "Prognose und Güte zeigen",
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
    cardTopic_down: "Down",
    cardTopic_broken_references: "Broken references",
    cardTopic_failing_automations: "Failing automations",
    cardTopic_unneeded: "Unneeded",
    cardHealthOk: "All in order",
    cardHealthAttention: {"one": "{n} object needs attention", "other": "{n} objects need attention"},
    cardHealthUrgent: "Something is urgent",
    cardHealthScanBad: "The scan is not getting through",
    cardScanOld: "The numbers may be out of date.",
    cardLastScan: "Last scan {ago}",
    cardScan: "Scan",
    cardScanning: "Scanning …",
    cardSince: "Since the last scan:",
    cardNew: "+{n} new",
    cardResolved: "−{n} fixed",
    cardNoChanges: "No changes since the last scan",
    cardNoFindings: "No open findings",
    edit_tiles: "Tiles",
    edit_tiles_findings: "Only when there are findings",
    edit_tiles_always: "Always",
    edit_tiles_never: "Never",
    edit_changes: "Show the changes since the last scan",
    edit_scan_button: "Show the scan button",
    edit_scan_button_help: "Only administrators see the button.",
    cardBatTitle: "Batteries",
    cardBatWeakestSub: "Weakest {n} of {total}",
    cardBatRoundSub: {"one": "In the next {days} days: {n} battery", "other": "In the next {days} days: {n} batteries"},
    cardBatLowChip: {"one": "{n} low", "other": "{n} low"},
    cardBatAllGood: "All good",
    cardBatQuietSub: "{total} watched · lowest {lowest} %",
    cardBatQuietFoot: "No battery below the limit",
    cardBatNext: "Next change expected in {when}",
    cardBatLowNow: "Change due",
    cardBatDays: {"one": "about {n} day", "other": "about {n} days"},
    cardBatWeeks: {"one": "about {n} week", "other": "about {n} weeks"},
    cardBatMonths: {"one": "about {n} month", "other": "about {n} months"},
    cardBatSoon: "soon",
    cardBatStable: "hardly any use",
    cardBatFollows: "Forecast follows",
    cardBatQEstimate: "Estimate",
    cardBatQStable: "stable",
    cardBatQFew: "too little data",
    cardBatRound: "Round of changes",
    cardBatNoArea: "No area",
    cardBatShopping: "Shopping list",
    cardBatUnknown: "Type unknown",
    cardBatUnknownHint: "set the type in the panel",
    cardBatNoRechargeable: "Rechargeable batteries are not on the list",
    edit_view: "View",
    edit_view_weakest: "Weakest",
    edit_view_round: "Round of changes",
    edit_view_both: "Both",
    edit_rows: "Rows for “Weakest”",
    edit_shopping: "Show the shopping list",
    edit_shopping_help: "The shopping list belongs to the round of changes.",
    edit_forecast: "Show the forecast and its quality",
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
  .hk-dot { width: 38px; height: 38px; border-radius: 50%; flex: none; display: grid; place-items: center; font-size: 18px; font-weight: 700; color: #fff; }
  .hk-dot.ok { background: var(--success-color); }
  .hk-dot.warn { background: var(--warning-color); }
  .hk-dot.bad { background: var(--error-color); }
  .hk-btn { min-height: 36px; padding: 6px 12px; border-radius: 10px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); font: inherit; font-weight: 600; font-size: 13px; cursor: pointer; white-space: nowrap; }
  .hk-btn[disabled] { opacity: .6; cursor: default; }
  .hk-tiles { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; background: var(--divider-color); border-top: 1px solid var(--divider-color); }
  .hk-tiles + .hk-foot { border-top: 1px solid var(--divider-color); }
  .hk-tile { background: var(--card-background-color); padding: 12px 14px; min-width: 0; box-shadow: none; }
  .hk-tile.go { cursor: pointer; }
  .hk-tile .n { font-size: 26px; font-weight: 700; line-height: 1.1; color: var(--primary-text-color); }
  .hk-tile .l { font-size: 12px; color: var(--secondary-text-color); margin-top: 2px; }
  .hk-tile.zero .n { color: var(--secondary-text-color); font-weight: 600; }
  .hk-tile.warn { box-shadow: inset 0 3px 0 var(--warning-color); }
  .hk-tile.bad { box-shadow: inset 0 3px 0 var(--error-color); }
  .hk-compact .hk-tile { padding: 8px 10px; }
  .hk-compact .hk-tile .n { font-size: 20px; }
  @media (max-width: 520px) { .hk-tiles { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  .hk-up { color: var(--error-color); font-weight: 600; }
  .hk-down { color: var(--success-color); font-weight: 600; }
  .hk-row { display: grid; gap: 12px; align-items: center; padding: 10px 16px; border-top: 1px solid var(--divider-color); }
  .hk-head.line + .hk-row { border-top: 0; }
  .hk-row.r3 { grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr) auto; }
  .hk-row.r2 { grid-template-columns: minmax(0, 1fr) auto; }
  .hk-name b { display: block; font-size: 13.5px; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hk-name small, .hk-right small { display: block; color: var(--secondary-text-color); font-size: 12px; }
  .hk-right { text-align: right; min-width: 70px; }
  .hk-right b { font-size: 14px; color: var(--primary-text-color); }
  .hk-q { display: inline-block; font-size: 11px; font-weight: 600; padding: 1px 7px; border-radius: 99px; background: var(--secondary-background-color); color: var(--secondary-text-color); margin-top: 2px; }
  .hk-bar { height: 8px; border-radius: 99px; background: var(--secondary-background-color); overflow: hidden; }
  .hk-bar i { display: block; height: 100%; border-radius: 99px; background: var(--success-color); }
  .hk-bar.warn i { background: var(--warning-color); }
  .hk-bar.bad i { background: var(--error-color); }
  .hk-area { padding: 8px 16px 2px; font-size: 12px; font-weight: 700; color: var(--primary-color); border-top: 1px solid var(--divider-color); }
  .hk-sec { padding: 10px 16px 4px; font-size: 11px; letter-spacing: .05em; text-transform: uppercase; color: var(--secondary-text-color); font-weight: 600; }
  .hk-sec.top { border-top: 1px solid var(--divider-color); }
  .hk-shop { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 4px 14px; padding: 4px 16px 12px; align-items: baseline; }
  .hk-shop .q { font-weight: 700; font-size: 15px; text-align: right; min-width: 52px; color: var(--primary-text-color); }
  .hk-shop .q.mute { color: var(--secondary-text-color); }
  .hk-shop .w b { font-size: 13.5px; color: var(--primary-text-color); }
  .hk-shop .w small { color: var(--secondary-text-color); font-size: 12px; }
  @media (max-width: 520px) { .hk-row.r3 { grid-template-columns: minmax(0, 1fr) auto; } .hk-row.r3 .hk-bar { display: none; } }
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
    this.shadowRoot.querySelectorAll("[data-hk-act]").forEach(el => el.addEventListener("click", () => this.act(el.getAttribute("data-hk-act"))));
  }

  // A card overrides: what a click on an element with data-hk-act does.
  act(_name) {}

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

    setConfig(config) { this._config = { ...HK_DEFAULTS, ...CardClass.defaults, ...config }; this.render(); }
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

// The health card: how the house is doing at a glance, without opening the panel. The numbers are those of the
// tiles on the overview page of the panel; they come from the sensor "house health" and its attributes.
const HK_TOPICS = ["down", "broken_references", "failing_automations", "unneeded"];

class HKHealthCard extends HKCard {
  static tag = "ha-housekeeper-health-card";
  static pickerName = "HA Housekeeper: House health";
  static pickerDescription = "How the house is doing: what is down, broken, failing or no longer needed, and what changed since the last scan.";
  static get defaults() { return { tiles: "findings", changes: true, scan_button: true }; }

  static editorSchema(t) {
    return [
      { name: "tiles", selector: { select: { mode: "dropdown", options: ["findings", "always", "never"].map(value => ({ value, label: t(`edit_tiles_${value}`) })) } } },
      { name: "changes", selector: { boolean: {} } },
      { name: "scan_button", selector: { boolean: {} } },
    ];
  }

  watchedIds() { return ["house_health", "scan_health", "activity", "last_scan"].map(key => this.idOf(key)).filter(Boolean); }

  // Where the numbers come from: the state of the house, the health of the scans and what Housekeeper does right now.
  health() { return this.stateOf("house_health"); }
  scanState() { return this.stateOf("scan_health")?.state; }
  scanBroken() { return ["failed", "stale"].includes(this.scanState()); }
  scanning() { return this.stateOf("activity")?.state === "scanning"; }

  hasData() { return Boolean(this.health()) && !["unknown", "unavailable"].includes(this.health().state); }
  // Quiet is: nothing is due and the scans run. A card that cannot trust its numbers never hides.
  isQuiet() { return this.hasData() && this.health().state === "ok" && !this.scanBroken(); }

  // The colour of the dot and the sentence beside it.
  verdict() {
    const attrs = this.health().attributes || {}, n = attrs.objects || 0;
    if (this.scanBroken()) return { tone: "bad", glyph: "!", text: this.t("cardHealthScanBad") };
    if (this.health().state === "urgent") return { tone: "bad", glyph: "!", text: this.t("cardHealthUrgent") };
    if (this.health().state === "attention") return { tone: "warn", glyph: "!", text: this.t("cardHealthAttention", { n, count: n }) };
    return { tone: "ok", glyph: "✓", text: this.t("cardHealthOk") };
  }

  tile(name, topics) {
    const info = topics[name] || {}, n = info.objects || 0;
    const tone = n && info.level === "high" ? "bad" : n && info.level === "medium" ? "warn" : n ? "" : "zero";
    const go = this._config.tap !== "none" && this._hass?.user?.is_admin && n;
    const link = go ? ` data-hk-panel="view=findingsNav&amp;filter=topic:${name}"` : "";
    return `<div class="hk-tile ${tone}${go ? " go" : ""}"${link}><div class="n">${this.esc(n)}</div><div class="l">${this.esc(this.t(`cardTopic_${name}`))}</div></div>`;
  }

  // What changed since the scan before: "+2 new · −1 fixed", or the plain statement that nothing did.
  changesHtml(attrs, any) {
    if (!this._config.changes || attrs.new == null) return "";
    const parts = [attrs.new ? `<span class="hk-up">${this.esc(this.t("cardNew", { n: attrs.new }))}</span>` : "", attrs.resolved ? `<span class="hk-down">${this.esc(this.t("cardResolved", { n: attrs.resolved }))}</span>` : ""].filter(Boolean);
    return parts.length ? `${this.esc(this.t("cardSince"))} ${parts.join(" · ")}` : any ? this.esc(this.t("cardNoChanges")) : "";
  }

  renderBody() {
    const attrs = this.health().attributes || {}, topics = attrs.topics || {};
    const verdict = this.verdict(), scanAgo = this.ago(this.stateOf("last_scan")?.state);
    const subtitle = this.scanBroken() ? this.t("cardScanOld") : scanAgo ? this.t("cardLastScan", { ago: scanAgo }) : "";
    const title = this._config.title, busy = this.scanning();
    const button = this._config.scan_button && this._hass?.user?.is_admin && this.idOf("scan", "button")
      ? `<button type="button" class="hk-btn" data-hk-act="scan"${busy ? " disabled" : ""}>${this.esc(busy ? this.t("cardScanning") : `⟳ ${this.t("cardScan")}`)}</button>` : "";
    const head = this.head(title ? [verdict.text, subtitle].filter(Boolean).join(" · ") : subtitle, button, false, `<span class="hk-dot ${verdict.tone}">${verdict.glyph}</span>`, title || verdict.text);
    const any = HK_TOPICS.some(name => (topics[name]?.objects || 0) > 0);
    const tiles = this._config.tiles === "always" || (this._config.tiles === "findings" && any)
      ? `<div class="hk-tiles">${HK_TOPICS.map(name => this.tile(name, topics)).join("")}</div>` : "";
    const left = [any || this.scanBroken() ? "" : this.esc(this.t("cardNoFindings")), this.changesHtml(attrs, any)].filter(Boolean).join(" · ");
    return head + tiles + this.footHtml(left, "");
  }

  // The scan button: the same entity the panel and automations use.
  act(name) {
    const id = this.idOf("scan", "button");
    if (name === "scan" && id && this._hass?.user?.is_admin && !this.scanning()) this._hass.callService("button", "press", { entity_id: id });
  }
}

// The battery card: the weakest batteries with a forecast, the next round of changes by area and what to buy for it.
// The numbers come from the sensor "weakest battery" and its attributes; the forecast is read once a day, so until it
// is there the card sorts by level and says "forecast follows".
class HKBatteryCard extends HKCard {
  static tag = "ha-housekeeper-battery-card";
  static pickerName = "HA Housekeeper: Batteries";
  static pickerDescription = "The weakest batteries with a forecast, the next round of changes by area and what to buy for it.";
  static get defaults() { return { view: "weakest", rows: 5, shopping: true, forecast: true }; }

  static editorSchema(t) {
    return [
      { name: "view", selector: { select: { mode: "dropdown", options: ["weakest", "round", "both"].map(value => ({ value, label: t(`edit_view_${value}`) })) } } },
      { name: "rows", selector: { number: { min: 3, max: 10, mode: "box" } } },
      { name: "shopping", selector: { boolean: {} } },
      { name: "forecast", selector: { boolean: {} } },
    ];
  }

  get titleKey() { return "cardBatTitle"; }
  watchedIds() { return ["battery_weakest", "battery_next_change"].map(key => this.idOf(key)).filter(Boolean); }

  data() { return this.stateOf("battery_weakest")?.attributes || {}; }
  hasData() { return Array.isArray(this.data().weakest); }
  // Quiet is: no battery is low and none is due within the round.
  isQuiet() { return this.hasData() && !this.data().low && !(this.data().round || []).length; }

  // "about 5 days", "about 3 weeks", "about 4 months": the unit that fits the distance.
  span(days) {
    if (days < 1) return this.t("cardBatSoon");
    if (days < 14) return this.t("cardBatDays", { n: days, count: days });
    if (days < 60) { const n = Math.round(days / 7); return this.t("cardBatWeeks", { n, count: n }); }
    const n = Math.round(days / 30);
    return this.t("cardBatMonths", { n, count: n });
  }

  // What the forecast of one battery says, and how far to trust it.
  outlook(item) {
    const quality = { estimate: "cardBatQEstimate", stable: "cardBatQStable", few_data: "cardBatQFew" }[item.quality];
    const text = item.quality === "low" ? this.t("cardBatLowNow")
      : item.quality === "estimate" ? this.span(item.days_left ?? 0)
      : item.quality === "stable" ? this.t("cardBatStable")
      : this.t("cardBatFollows");
    return { text, quality: quality ? this.t(quality) : "" };
  }

  tone(item) { return item.low ? "bad" : item.days_left != null && item.days_left <= (this.data().round_days || 14) ? "warn" : "ok"; }

  weakestRow(item) {
    const out = this._config.forecast ? this.outlook(item) : { text: "", quality: "" };
    const where = [item.area, item.type].filter(Boolean).join(" · ");
    const bar = item.percent == null ? "<div></div>" : `<div class="hk-bar ${this.tone(item)}"><i style="width:${Math.max(2, Math.min(100, item.percent))}%"></i></div>`;
    const percent = item.percent == null ? "" : `<b>${this.esc(item.percent)} %</b>`;
    return `<div class="hk-row r3"><div class="hk-name"><b>${this.esc(item.name)}</b>${where ? `<small>${this.esc(where)}</small>` : ""}</div>${bar}<div class="hk-right">${percent}${out.text ? `<small>${this.esc(out.text)}</small>` : ""}${out.quality ? `<span class="hk-q">${this.esc(out.quality)}</span>` : ""}</div></div>`;
  }

  // The round of the next days, by area: the nearest area first, inside it the soonest.
  roundHtml(items) {
    const groups = new Map();
    for (const item of items) {
      const key = item.area || "";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    }
    const soonest = list => Math.min(...list.map(i => i.days_left ?? 0));
    const ordered = [...groups.entries()].sort((a, b) => soonest(a[1]) - soonest(b[1]) || a[0].localeCompare(b[0]));
    return ordered.map(([area, list]) => `<div class="hk-area">${this.esc(area || this.t("cardBatNoArea"))}</div>${list.map(item => {
      const out = this.outlook(item);
      return `<div class="hk-row r2"><div class="hk-name"><b>${this.esc(item.name)}</b>${item.type ? `<small>${this.esc(item.type)}</small>` : ""}</div><div class="hk-right"><b>${this.esc(out.text)}</b></div></div>`;
    }).join("")}`).join("");
  }

  shoppingHtml(data) {
    const lines = (data.shopping || []).map(entry => `<span class="q">${this.esc(entry.count)} ×</span><span class="w"><b>${this.esc(entry.type)}</b><br><small>${this.esc(entry.names.join(", "))}</small></span>`);
    const unknown = data.unknown_type || [];
    if (unknown.length) lines.push(`<span class="q mute">${this.esc(unknown.length)}</span><span class="w"><b>${this.esc(this.t("cardBatUnknown"))}</b><br><small>${this.esc(unknown.join(", "))} · ${this.esc(this.t("cardBatUnknownHint"))}</small></span>`);
    return lines.length ? `<div class="hk-sec">${this.esc(this.t("cardBatShopping"))}</div><div class="hk-shop">${lines.join("")}</div>` : "";
  }

  // When the first battery will probably run low, said in months: "in March".
  nextText() {
    const when = Date.parse(this.stateOf("battery_next_change")?.state || "");
    if (!Number.isFinite(when) || when < Date.now() - 86400000) return "";
    const date = new Date(when), sameYear = date.getFullYear() === new Date().getFullYear();
    try { return this.t("cardBatNext", { when: new Intl.DateTimeFormat(this.lang, sameYear ? { month: "long" } : { month: "long", year: "numeric" }).format(date) }); } catch (_) { return ""; }
  }

  renderBody() {
    const data = this.data(), view = this._config.view, round = data.round || [], low = data.low || 0;
    const showWeakest = view === "weakest" || view === "both", showRound = view === "round" || view === "both";
    const chip = low ? `<span class="hk-chip warn">${this.esc(this.t("cardBatLowChip", { n: low, count: low }))}</span>` : `<span class="hk-chip">${this.esc(this.t("cardBatAllGood"))}</span>`;
    if (this.isQuiet()) {
      const sub = data.lowest == null ? "" : this.t("cardBatQuietSub", { total: data.total || 0, lowest: data.lowest });
      return this.head(sub, chip) + this.foot([this.t("cardBatQuietFoot"), this.nextText()].filter(Boolean).join(" · "), "view=batteries");
    }
    const rows = (data.weakest || []).slice(0, Number(this._config.rows) || 5);
    const sub = showWeakest ? this.t("cardBatWeakestSub", { n: rows.length, total: data.total || 0 })
      : this.t("cardBatRoundSub", { days: data.round_days || 14, n: round.length, count: round.length });
    let body = this.head(sub, chip, true);
    if (showWeakest) body += rows.map(item => this.weakestRow(item)).join("");
    if (showRound && round.length) {
      body += `<div class="hk-sec top">${this.esc(this.t("cardBatRound"))}</div>${this.roundHtml(round)}`;
      if (this._config.shopping) body += this.shoppingHtml(data);
    }
    return body + this.foot(this._config.shopping && showRound ? this.t("cardBatNoRechargeable") : "", "view=batteries");
  }
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

registerCard(HKHealthCard);
registerCard(HKBatteryCard);
