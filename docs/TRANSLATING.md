# Translating HA Housekeeper

German and English are the source languages and live in the code. Every other language is a set of JSON files, so a translation never needs a change in the panel code.

| What | File | Source of truth |
|---|---|---|
| The panel | `custom_components/ha_housekeeper/frontend/i18n/<code>.json` | `TEXT.en` in `panel-src/` |
| Setup, entities, services, issues | `custom_components/ha_housekeeper/translations/<code>.json` | `translations/en.json` |
| Notifications, logbook, audit report | `custom_components/ha_housekeeper/locales/<code>.json` | the `en` entries of the text tables in the Python files |
| The list of languages | `custom_components/ha_housekeeper/languages.json` | |

A text that is missing shows in English, so a translation can start small and grow.

## Rules

- **Address the user informally** ("du" in German): tu in French, Italian and Portuguese, tú in Spanish, ty in Slovak, ты in Russian, 你 in Chinese. Imperatives follow ("Verifica", "Нажми"). Texts about an object ("its triggers") stay in the third person.
- Keep every `{placeholder}`, markdown link, `` `code` `` and symbol exactly. A translation may use fewer placeholders than English, never others.
- Do not translate product and technical names (Housekeeper, Home Assistant, HACS, Recorder, entity IDs, service names).
- Texts of a counted noun come as a pair, such as `x_1` and `x_n`. A language with more plural forms writes the `_n` text as an object `{"one": "…", "few": "…", "many": "…", "other": "…"}`; the number that picks the form is `count`, else `n`. `other` is required.
- Keep a text about as long as English: it sits in buttons and table headers.
- Use the terms the language file already uses; look a term up with `grep` before choosing a new one.

## Adding or updating a language

1. Copy the files of a similar language, or start with an empty `frontend/i18n/<code>.json` (`{}`) and an entry in `languages.json`: `code` (the code Home Assistant uses, e.g. `zh-Hans`), `name` in the language itself, `patterns` (Home Assistant language codes that map to it, lower case, e.g. `["pt", "pt-pt", "pt-br"]`; `zh-Hant` must not match `zh-Hans`), `quotes`, `lowerKind` (whether a noun is written in lower case inside a sentence) and `status: "community"` while it is a draft.
2. Translate. The panel bundle is built from `panel-src/`, never edit `ha-housekeeper-panel.js` by hand: `node scripts/build_panel.mjs`.
3. See what is left: `node scripts/i18n_report.mjs` (counts), `node scripts/i18n_report.mjs --list <code>` (the missing and outdated keys).
4. When English changed after a text was translated, the report calls the key *outdated*. Check the translation, then `node scripts/i18n_report.mjs --accept <code> <key> …` records the current English text for it. `--accept <code>` alone records only keys that were never recorded, so a new translation starts clean and never hides an outdated one.
5. Run the checks: `node --test tests/panel.test.mjs` and `pytest` (they fail on a key English does not have, a placeholder English does not have, and a plural text without `other`).

## When English changes

A new or changed English text is written in German and English only. Every other language shows English until someone translates it; `scripts/i18n_report.mjs` lists those keys before a release.
