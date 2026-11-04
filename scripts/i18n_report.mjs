// What each language still lacks, before a release:  node scripts/i18n_report.mjs
// Counts the texts of the panel, of the setup and entities (translations/) and of the backend (locales/)
// that English has and the language does not (backend: only what the file holds). A text whose English changed later is not found here.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const component = path.join(root, "custom_components/ha_housekeeper");
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const exists = file => fs.existsSync(file);

class FakeElement { attachShadow() { return {}; } }
const context = { HTMLElement: FakeElement, customElements: { get: () => undefined, define() {} }, document: {}, URLSearchParams, Intl, Map, Set, JSON, String, Number, Array, Object, Math, Date, setTimeout: () => 0 };
vm.runInNewContext(fs.readFileSync(path.join(component, "frontend/ha-housekeeper-panel.js"), "utf8") + "\nthis.TEXT = TEXT;", context);
const panelKeys = Object.keys(context.TEXT.en);

const leaves = (value, prefix = "") => typeof value === "object" && value !== null && !Array.isArray(value)
  ? Object.entries(value).flatMap(([key, child]) => leaves(child, prefix ? `${prefix}.${key}` : key)) : [prefix];
const setupKeys = leaves(read(path.join(component, "translations/en.json")));

const row = (label, have, total) => `${label} ${String(have).padStart(5)} / ${total} (${Math.round(100 * have / total)} %)`;
for (const { code, status } of read(path.join(component, "languages.json")).filter(l => l.code !== "de" && l.code !== "en")) {
  const panel = read(path.join(component, `frontend/i18n/${code}.json`));
  const setupFile = path.join(component, `translations/${code}.json`), setup = exists(setupFile) ? new Set(leaves(read(setupFile))) : new Set();
  const backendFile = path.join(component, `locales/${code}.json`), backend = exists(backendFile) ? new Set(leaves(read(backendFile))) : new Set();
  console.log(`${code} (${status || "stable"})`);
  console.log("  " + row("panel  ", panelKeys.filter(k => k in panel).length, panelKeys.length));
  console.log("  " + row("setup  ", setupKeys.filter(k => setup.has(k)).length, setupKeys.length));
  console.log(`  backend ${String(backend.size).padStart(5)} texts in locales/${code}.json (the tables are in the Python files)`);
}
