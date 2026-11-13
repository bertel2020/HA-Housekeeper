// The languages of the panel. The list itself (LANGUAGES) is languages.json, put in front of the bundle by the build.

// The language for a Home Assistant language code: an exact match of a pattern, else the main part
// (de-AT -> de), else English. Written like this so zh-Hant does not fall to zh-Hans.
function matchLanguage(list, code) {
  const full = String(code || "en").toLowerCase().replace(/_/g, "-"), main = full.split("-")[0];
  const find = key => list.find(l => l.patterns.includes(key));
  return (find(full) || find(main))?.code || "en";
}

const languageInfo = code => LANGUAGES.find(l => l.code === code) || LANGUAGES.find(l => l.code === "en");

// A text with its own plural forms: the form of the number (`count`, else `n`, else the first number
// the text names, like {days}), else `other`.
// The number may already be formatted ("1.234", "1 234"): only its digits count. Plural texts are for whole numbers.
function pluralText(forms, lang, vars) {
  let form = "other";
  try {
    const toNumber = raw => (typeof raw === "number" ? raw : Number(String(raw).replace(/[^\d]/g, "") || NaN));
    const named = [...String(forms.other ?? "").matchAll(/\{(\w+)\}/g)].map(m => m[1]);
    const key = ["count", "n", ...named].find(k => vars && k in vars && !Number.isNaN(toNumber(vars[k])));
    form = new Intl.PluralRules(lang).select(toNumber(vars?.[key]));
  } catch (_) { /* no number: the general form */ }
  return forms[form] ?? forms.other ?? "";
}
