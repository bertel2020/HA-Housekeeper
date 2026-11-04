// Builds the single file Home Assistant serves from the sources in panel-src/.
//
//   node scripts/build_panel.mjs            write custom_components/ha_housekeeper/frontend/ha-housekeeper-panel.js
//   node scripts/build_panel.mjs --check    fail if that file is out of date (used by the tests and CI)
//
// The sources are concatenated in file-name order, so the numeric prefixes decide the order.
// Serving one bundled file (instead of several ES modules) means a browser can never mix a
// new main file with a cached old part after an update.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "panel-src");
const target = path.join(root, "custom_components/ha_housekeeper/frontend/ha-housekeeper-panel.js");

const languagesFile = path.join(root, "custom_components/ha_housekeeper/languages.json");
const i18nDir = path.join(root, "custom_components/ha_housekeeper/frontend/i18n");

const HEADER = `// GENERATED FILE - do not edit. Edit panel-src/*.js and run: node scripts/build_panel.mjs\n\n`;

// The registry of the languages (languages.json) goes into the bundle. A language besides German and
// English is loaded from frontend/i18n/<code>.json; its entry carries a short hash of that file, so the
// bundle changes with every text and the browser never keeps an old translation.
export function languageRegistry() {
  const list = JSON.parse(fs.readFileSync(languagesFile, "utf8"));
  return list.map(lang => {
    if (lang.code === "de" || lang.code === "en") return lang;
    const file = path.join(i18nDir, `${lang.code}.json`);
    if (!fs.existsSync(file)) throw new Error(`languages.json names ${lang.code}, but ${path.relative(root, file)} is missing`);
    return { ...lang, v: crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").slice(0, 10) };
  });
}

export function buildPanel() {
  const files = fs.readdirSync(sourceDir).filter(name => name.endsWith(".js")).sort();
  const parts = files.map(name => fs.readFileSync(path.join(sourceDir, name), "utf8").replace(/\n+$/, ""));
  return HEADER + `const LANGUAGES = ${JSON.stringify(languageRegistry())};\n\n` + parts.join("\n\n") + "\n";
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const built = buildPanel();
  if (process.argv.includes("--check")) {
    const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
    if (current !== built) {
      console.error("ha-housekeeper-panel.js is out of date. Run: node scripts/build_panel.mjs");
      process.exit(1);
    }
    console.log("ha-housekeeper-panel.js is up to date.");
  } else {
    fs.writeFileSync(target, built);
    console.log(`Wrote ${path.relative(root, target)} (${built.split("\n").length} lines).`);
  }
}
