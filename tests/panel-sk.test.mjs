// Run with: node --test tests/panel-sk.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const SOURCE = new URL("../custom_components/ha_housekeeper/frontend/ha-housekeeper-panel.js", import.meta.url);

function loadPanel() {
  let PanelClass;
  const context = {
    HTMLElement: class {},
    customElements: { get: () => undefined, define: (_, cls) => { PanelClass = cls; } },
    Intl, Map, Set, JSON, String, Number, Array, Object, Math, Date, URLSearchParams,
    setTimeout: () => 0,
  };
  vm.runInNewContext(fs.readFileSync(SOURCE, "utf8") + "\nthis.TEXT = TEXT;", context);
  return { PanelClass, TEXT: context.TEXT };
}

const vars = text => [...String(text).matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort().join(",");

test("Slovak panel strings keep available placeholders and fallback to English", () => {
  const { PanelClass, TEXT } = loadPanel();
  assert.equal(typeof TEXT.sk.title, "string");
  for (const [key, translation] of Object.entries(TEXT.sk)) {
    if (!(key in TEXT.en)) continue;
    const baseline = TEXT.en[key];
    const values = translation && typeof translation === "object"
      ? Object.values(translation) : [translation];
    for (const value of values) {
      if (typeof value === "string") assert.equal(vars(value), vars(baseline), key);
    }
  }
  const panel = Object.create(PanelClass.prototype);
  panel.prefs = { language: "auto" };
  panel._hass = { language: "sk-SK" };
  assert.equal(panel.lang, "sk");
  assert.equal(panel.t("__not_a_real_key__"), "__not_a_real_key__");
  assert.equal(panel.t("title"), TEXT.sk.title);
  panel._hass = { language: "fr-FR" };
  assert.equal(panel.lang, "en");
  panel.prefs = { language: "sk" };
  assert.equal(panel.lang, "sk");
  assert.equal(panel.sanitizePrefs({ language: "sk" }).language, "sk");
});

test("Slovak plurals and an English fallback work for dynamically registered locales", () => {
  const { PanelClass, TEXT } = loadPanel();
  const panel = Object.create(PanelClass.prototype);
  panel.prefs = { language: "sk" };
  TEXT.sk.__testPlural = { one: "{n} položka", few: "{n} položky", other: "{n} položiek" };
  assert.equal(panel.t("__testPlural", { n: 1 }), "1 položka");
  assert.equal(panel.t("__testPlural", { n: 3 }), "3 položky");
  assert.equal(panel.t("__testPlural", { n: 5 }), "5 položiek");
  const englishOnlyKey = Object.keys(TEXT.en).find(key => !(key in TEXT.sk));
  if (englishOnlyKey) {
    const fallback = TEXT.en[englishOnlyKey];
    if (typeof fallback === "string") assert.equal(panel.t(englishOnlyKey), fallback);
  }
});
