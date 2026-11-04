// What each language still lacks or has translated from an older English text.
//
//   node scripts/i18n_report.mjs                    counts per language
//   node scripts/i18n_report.mjs --list fr          the missing and the outdated keys of one language
//   node scripts/i18n_report.mjs --accept fr        record the English text of every translated key that has no record yet
//   node scripts/i18n_report.mjs --accept fr key …  record the current English text of these keys, after the translation was checked
//
// Panel texts (frontend/i18n/<code>.json) and the setup and entity texts (translations/<code>.json) are compared
// with English. scripts/i18n-source/<code>.json holds a short hash of the English text each key was translated from:
// when English changes, the hash no longer fits and the key counts as outdated. The backend texts (locales/) only
// show how many texts a file holds; their tables are in the Python files.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const component = path.join(root, "custom_components/ha_housekeeper");
const sourceDir = path.join(root, "scripts/i18n-source");
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const exists = file => fs.existsSync(file);
const hash = text => crypto.createHash("sha256").update(typeof text === "string" ? text : JSON.stringify(text)).digest("hex").slice(0, 8);

class FakeElement { attachShadow() { return {}; } }
const context = { HTMLElement: FakeElement, customElements: { get: () => undefined, define() {} }, document: {}, URLSearchParams, Intl, Map, Set, JSON, String, Number, Array, Object, Math, Date, setTimeout: () => 0 };
vm.runInNewContext(fs.readFileSync(path.join(component, "frontend/ha-housekeeper-panel.js"), "utf8") + "\nthis.TEXT = TEXT;", context);

const leaves = (value, prefix = "") => typeof value === "object" && value !== null && !Array.isArray(value)
  ? Object.entries(value).flatMap(([key, child]) => leaves(child, prefix ? `${prefix}.${key}` : key)) : [prefix];
const flat = value => Object.fromEntries(leaves(value).map(key => [key, key.split(".").reduce((o, part) => o[part], value)]));

const english = { panel: context.TEXT.en, setup: flat(read(path.join(component, "translations/en.json"))) };
const translated = code => ({
  panel: read(path.join(component, `frontend/i18n/${code}.json`)),
  setup: exists(path.join(component, `translations/${code}.json`)) ? flat(read(path.join(component, `translations/${code}.json`))) : {},
});
const recordFile = code => path.join(sourceDir, `${code}.json`);
const records = code => (exists(recordFile(code)) ? read(recordFile(code)) : { panel: {}, setup: {} });

const languages = read(path.join(component, "languages.json")).filter(l => l.code !== "de" && l.code !== "en");
const args = process.argv.slice(2);
const mode = args[0] === "--list" || args[0] === "--accept" ? args[0] : "";
const only = mode ? args[1] : "";
if (mode && !languages.some(l => l.code === only)) { console.error(`Usage: node scripts/i18n_report.mjs [--list|--accept] <${languages.map(l => l.code).join("|")}> [key …]`); process.exit(1); }

function state(code) {
  const have = translated(code), rec = records(code), out = {};
  for (const part of ["panel", "setup"]) {
    const missing = [], outdated = [], fresh = [], unrecorded = [];
    for (const key of Object.keys(english[part])) {
      if (!(key in have[part])) missing.push(key);
      else if (!(key in (rec[part] || {}))) unrecorded.push(key);
      else if (rec[part][key] !== hash(english[part][key])) outdated.push(key);
      else fresh.push(key);
    }
    out[part] = { missing, outdated, fresh, unrecorded, total: Object.keys(english[part]).length };
  }
  return out;
}

if (mode === "--accept") {
  const rec = records(only), st = state(only), keys = args.slice(2);
  for (const part of ["panel", "setup"]) {
    rec[part] ||= {};
    const take = keys.length ? keys.filter(k => k in english[part] && k in translated(only)[part]) : st[part].unrecorded;
    for (const key of take) rec[part][key] = hash(english[part][key]);
    console.log(`${part}: ${take.length} recorded`);
  }
  fs.mkdirSync(sourceDir, { recursive: true });
  const part = name => `"${name}": {\n${Object.entries(rec[name]).map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(",\n")}\n}`;
  fs.writeFileSync(recordFile(only), `{\n${part("panel")},\n${part("setup")}\n}\n`); // one key per line keeps the diff readable
  process.exit(0);
}

for (const { code, status } of languages) {
  if (only && code !== only) continue;
  const st = state(code), line = (label, s) => `${label} ${String(s.fresh.length + s.unrecorded.length).padStart(5)} / ${s.total} translated, ${s.missing.length} missing, ${s.outdated.length} outdated`;
  console.log(`${code} (${status || "stable"})`);
  console.log("  " + line("panel  ", st.panel));
  console.log("  " + line("setup  ", st.setup));
  const backend = exists(path.join(component, `locales/${code}.json`)) ? leaves(read(path.join(component, `locales/${code}.json`))).length : 0;
  console.log(`  backend ${String(backend).padStart(5)} texts in locales/${code}.json`);
  if (st.panel.unrecorded.length + st.setup.unrecorded.length) console.log(`  ${st.panel.unrecorded.length + st.setup.unrecorded.length} translated keys without a record: node scripts/i18n_report.mjs --accept ${code}`);
  if (mode === "--list") {
    for (const part of ["panel", "setup"]) {
      for (const [label, keys] of [["missing", st[part].missing], ["outdated", st[part].outdated]]) if (keys.length) console.log(`  ${part} ${label}:\n    ${keys.join("\n    ")}`);
    }
  }
}
