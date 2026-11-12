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
