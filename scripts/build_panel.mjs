// Builds the two files Home Assistant serves: the panel from panel-src/ and the Lovelace cards from cards-src/.
//
//   node scripts/build_panel.mjs            write frontend/ha-housekeeper-panel.js and frontend/ha-housekeeper-cards.js
//   node scripts/build_panel.mjs --check    fail if one of them is out of date (used by the tests and CI)
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

const cardSourceDir = path.join(root, "cards-src");
const cardTarget = path.join(root, "custom_components/ha_housekeeper/frontend/ha-housekeeper-cards.js");

const languagesFile = path.join(root, "custom_components/ha_housekeeper/languages.json");
const i18nDir = path.join(root, "custom_components/ha_housekeeper/frontend/i18n");

const HEADER = `// GENERATED FILE - do not edit. Edit panel-src/*.js and run: node scripts/build_panel.mjs\n\n`;
const CARD_HEADER = `// GENERATED FILE - do not edit. Edit cards-src/*.js and run: node scripts/build_panel.mjs\n\n`;

// The registry of the languages (languages.json) goes into the bundle. A language besides German and
// English is loaded from frontend/i18n/<code>.json; its entry carries a short hash of that file, so the
// bundle changes with every text and the browser never keeps an old translation.
export function languageRegistry(dir = i18nDir) {
  const list = JSON.parse(fs.readFileSync(languagesFile, "utf8"));
  return list.map(lang => {
    if (lang.code === "de" || lang.code === "en") return lang;
    const file = path.join(dir, `${lang.code}.json`);
    if (!fs.existsSync(file)) throw new Error(`languages.json names ${lang.code}, but ${path.relative(root, file)} is missing`);
    return { ...lang, v: crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").slice(0, 10) };
  });
}

export function buildPanel() {
  const files = fs.readdirSync(sourceDir).filter(name => name.endsWith(".js")).sort();
  const parts = files.map(name => fs.readFileSync(path.join(sourceDir, name), "utf8").replace(/\n+$/, ""));
  return HEADER + `const LANGUAGES = ${JSON.stringify(languageRegistry())};\n\n` + parts.join("\n\n") + "\n";
}

// The cards are a bundle of their own, small enough to load on every dashboard. They share the language functions of the
// panel (02-languages.js) and carry the card texts of German and English; other languages are fetched from frontend/i18n/cards/.
export function buildCards() {
  const files = fs.readdirSync(cardSourceDir).filter(name => name.endsWith(".js")).sort();
  const parts = files.map(name => fs.readFileSync(path.join(cardSourceDir, name), "utf8").replace(/\n+$/, ""));
  const shared = fs.readFileSync(path.join(sourceDir, "02-languages.js"), "utf8").replace(/\n+$/, "");
  return CARD_HEADER + `const LANGUAGES = ${JSON.stringify(languageRegistry(path.join(i18nDir, "cards")))};\n\n` + [shared, ...parts].join("\n\n") + "\n";
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const outputs = [[target, buildPanel()], [cardTarget, buildCards()]];
  if (process.argv.includes("--check")) {
    for (const [file, built] of outputs) {
      const current = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
      if (current !== built) {
        console.error(`${path.basename(file)} is out of date. Run: node scripts/build_panel.mjs`);
        process.exit(1);
      }
      console.log(`${path.basename(file)} is up to date.`);
    }
  } else {
    for (const [file, built] of outputs) {
      fs.writeFileSync(file, built);
      console.log(`Wrote ${path.relative(root, file)} (${built.split("\n").length} lines).`);
    }
  }
}
