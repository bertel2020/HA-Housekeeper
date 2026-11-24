// The assistant "Replace entities" from a CSV file: the file chooses the old entities and fills in the new ones (and, if it says so, the kind); everything after that is the assistant as it is (83-replace-wizard.js).
// Nothing is written by the file: the preview of the plan has to be confirmed, like for a pair set by hand.
Object.assign(TEXT.de, {
  rwCsvButton: "CSV", rwCsvLoad: "Zuordnung aus Datei laden …", rwCsvLoadHint: "Spalten alt und neu, freiwillig art; füllt Auswahl und Zuordnung vor.",
  rwCsvTemplate: "Vorlage herunterladen", rwCsvTemplateHint: "Mit der gewählten Auswahl in der Spalte alt.",
  rwCsvSave: "Zuordnung als CSV sichern", rwCsvSaveHint: "Dieselbe Datei aus dem aktuellen Stand, zum Bearbeiten und erneuten Laden.",
  rwCsvTooBig: "Die Datei ist größer als 1 MB.", rwCsvNone: "In der Datei steht keine Zeile mit einer alten Entität.", rwCsvReadFailed: "Die Datei lässt sich nicht lesen.",
  rwCsvFrom: "Aus „{file}“: {total} gelesen", rwCsvApplied: "{count} übernommen", rwCsvSkipped: "{count} übersprungen", rwCsvOver: "Nur die ersten 200 Zeilen wurden gelesen.",
  rwCsvList: "Übersprungene Zeilen anzeigen", rwCsvLine: "Zeile {line}", rwCsvSaveSkipped: "Übersprungene als CSV sichern", rwCsvFromFile: "aus Datei",
  rwCsvR_badid: "Das ist keine Entitäts-ID.", rwCsvR_same: "Alt und neu sind gleich.", rwCsvR_dup: "Die alte Entität steht schon in einer früheren Zeile.", rwCsvR_how: "Die Art „{how}“ gibt es nicht.",
  rwCsvR_old: "Die alte Entität gibt es nicht.", rwCsvR_new: "Die neue Entität gibt es nicht.", rwCsvR_off: "Die neue Entität ist deaktiviert.", rwCsvR_domain: "Alt und neu sind verschiedene Arten von Entitäten (Domain).",
  rwCsvR_howfit: "Die Art „{how}“ passt nicht zu dieser Entität.", rwCsvR_nopair: "Für die alte Entität gibt es keinen Vorschlag zum Zuordnen.",
});
Object.assign(TEXT.en, {
  rwCsvButton: "CSV", rwCsvLoad: "Load assignment from file …", rwCsvLoadHint: "Columns old and new, optional how; fills in the choice and the assignment.",
  rwCsvTemplate: "Download template", rwCsvTemplateHint: "With the current choice in the column old.",
  rwCsvSave: "Save assignment as CSV", rwCsvSaveHint: "The same file from the current state, to edit and load again.",
  rwCsvTooBig: "The file is larger than 1 MB.", rwCsvNone: "The file has no row with an old entity.", rwCsvReadFailed: "The file cannot be read.",
  rwCsvFrom: "From “{file}”: {total} read", rwCsvApplied: "{count} taken", rwCsvSkipped: "{count} skipped", rwCsvOver: "Only the first 200 rows were read.",
  rwCsvList: "Show skipped rows", rwCsvLine: "Row {line}", rwCsvSaveSkipped: "Save skipped rows as CSV", rwCsvFromFile: "from file",
  rwCsvR_badid: "This is not an entity ID.", rwCsvR_same: "Old and new are the same.", rwCsvR_dup: "The old entity is already in an earlier row.", rwCsvR_how: "There is no kind “{how}”.",
  rwCsvR_old: "The old entity does not exist.", rwCsvR_new: "The new entity does not exist.", rwCsvR_off: "The new entity is disabled.", rwCsvR_domain: "Old and new are different kinds of entity (domain).",
  rwCsvR_howfit: "The kind “{how}” does not fit this entity.", rwCsvR_nopair: "There is no proposal to assign for the old entity.",
});

const RW_CSV_MAX_ROWS = 200, RW_CSV_MAX_BYTES = 1024 * 1024, RW_CSV_ID = /^[a-z0-9_]+\.[a-z0-9_]+$/;
// The names of the three columns in the languages of the panel; a file may use either.
const RW_CSV_COLUMNS = { old: ["alt", "old"], target: ["neu", "new"], how: ["art", "how"] };

class ReplaceCsvMixin {
  // One line of the file as cells: the delimiter outside quotes splits, "" inside quotes is one quote.
  rwCsvSplit(line, delimiter) {
    const cells = [];
    let cell = "", quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (quoted) {
        if (ch === '"' && line[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') quoted = false; else cell += ch;
      } else if (ch === '"') quoted = true;
      else if (ch === delimiter) { cells.push(cell); cell = ""; } else cell += ch;
    }
    cells.push(cell);
    return cells.map(c => c.trim());
  }

  // The delimiter of the file: the one that occurs most in its first line with content (a spreadsheet in German writes ";").
  rwCsvDelimiter(lines) {
    const first = lines.find(l => l.trim() && !l.trim().startsWith("#")) || "";
    const unquoted = first.replace(/"[^"]*"/g, "");
    const best = [";", ",", "\t"].map(d => [d, unquoted.split(d).length - 1]).sort((a, b) => b[1] - a[1])[0];
    return best[1] ? best[0] : ";";
  }

  // The text of a file as rows {line, old, target, how} and the lines that cannot be used ({line, old, target, how, key, vars}).
  // Only what the text itself says is checked here; whether an entity exists is checked when the rows are applied.
  rwParseCsv(text) {
    const lines = String(text || "").replace(/^﻿/, "").split(/\r\n|\n|\r/);
    const delimiter = this.rwCsvDelimiter(lines);
    const pos = { old: 0, target: 1, how: 2 };
    const rows = [], skipped = [], seen = new Map();
    let total = 0, over = 0, header = true;
    lines.forEach((raw, index) => {
      const cells = this.rwCsvSplit(raw, delimiter);
      if (cells.every(c => !c) || cells[0].startsWith("#")) return;
      const names = cells.map(c => c.toLowerCase());
      if (header) {
        header = false;
        if (RW_CSV_COLUMNS.old.includes(names[0]) || names.some(n => RW_CSV_COLUMNS.target.includes(n))) {
          for (const [key, list] of Object.entries(RW_CSV_COLUMNS)) { const at = names.findIndex(n => list.includes(n)); if (at >= 0) pos[key] = at; }
          return;
        }
      }
      total += 1;
      if (rows.length + skipped.length >= RW_CSV_MAX_ROWS) { over += 1; return; }
      const line = index + 1, old = (cells[pos.old] || "").toLowerCase(), target = (cells[pos.target] || "").toLowerCase(), how = (cells[pos.how] || "").toLowerCase();
      const skip = (key, vars = {}) => skipped.push({ line, old: cells[pos.old] || "", target: cells[pos.target] || "", how: cells[pos.how] || "", key, vars });
      if (!RW_CSV_ID.test(old) || (target && !RW_CSV_ID.test(target))) return skip("badid");
      if (old === target) return skip("same");
      if (seen.has(old)) return skip("dup");
      if (how && !RW_HOWS.includes(how)) return skip("how", { how });
      seen.set(old, line);
      rows.push({ line, old, target, how });
    });
    return { rows, skipped, total, over };
  }

  // The rows of a file into the assistant: the old entities are chosen, then the suggestions are loaded (the assistant needs them for each pair), then the new entities are set.
  // A row of the file wins over what is chosen already for the same old entity; everything else stays as it is.
  async rwCsvApply(parsed, file) {
    const rw = this.rwState(), skipped = [...parsed.skipped], good = [];
    const known = id => this.findObject(`entity:${id}`);
    for (const row of parsed.rows) {
      const old = known(row.old), target = row.target ? known(row.target) : null;
      const reason = !old ? ["old"] : row.target && !target ? ["new"] : target && target.status === "disabled" ? ["off"] : target && !this.sameDomain(target, row.old) ? ["domain"] : null;
      if (reason) skipped.push({ ...row, key: reason[0], vars: {} }); else good.push(row);
    }
    if (!good.length) return { applied: 0, skipped, parsed };
    rw.single = false;
    good.forEach(row => rw.sel.add(row.old));
    rw.step = 2;
    await this.rwLoadPairs();
    const pairs = rw.result?.pairs || [], fromFile = new Map();
    let applied = 0;
    for (const row of good) {
      const pair = pairs.find(p => p.object_id === row.old);
      if (!pair) { skipped.push({ ...row, key: "nopair", vars: {} }); continue; }
      if (row.how && !this.rwHowsOf(pair).includes(row.how)) { skipped.push({ ...row, key: "howfit", vars: { how: row.how } }); continue; }
      this.rwChoose(row.old, row.target);
      if (row.target) { rw.choices[row.old].how = row.how || this.rwDefaultHow(pair); fromFile.set(row.old, row.target); }
      applied += 1;
    }
    rw.fromFile = new Map([...(rw.fromFile || []), ...fromFile]);
    return { applied, skipped, parsed };
  }

  async rwCsvLoadFile(file) {
    if (!file) return;
    if (file.size > RW_CSV_MAX_BYTES) { this.toast(this.t("rwCsvTooBig"), true); return; }
    let text;
    try { text = await file.text(); } catch { this.toast(this.t("rwCsvReadFailed"), true); return; }
    const parsed = this.rwParseCsv(text);
    if (!parsed.rows.length && !parsed.skipped.length) { this.toast(this.t("rwCsvNone"), true); return; }
    const done = await this.rwCsvApply(parsed, file.name);
    this.rwState().csv = { file: file.name, total: parsed.total, applied: done.applied, skipped: done.skipped.sort((a, b) => a.line - b.line), over: parsed.over };
    this._expOpen = "";
    this.render();
  }

  // The file as lines: ";" between the columns, a leading byte-order mark so a spreadsheet reads umlauts right.
  rwCsvText(rows, extra = []) {
    const head = this.lang === "de" ? ["alt", "neu", "art"] : ["old", "new", "how"];
    return `﻿${[[...head, ...extra.map(e => e[0])], ...rows].map(r => r.map(csvCell).join(";")).join("\r\n")}`;
  }

  rwCsvTemplate() {
    const rw = this.rwState(), ids = [...rw.sel];
    const rows = ids.length ? ids.map(id => [id, "", ""]) : [["# light.wohnzimmer_alt;light.wohnzimmer_neu;"]];
    this.downloadText("replace-template.csv", this.rwCsvText(rows), "text/csv");
  }

  // The assignment as it stands: a pair without a new entity has an empty column; the kind only where it differs from the usual one.
  rwCsvSave() {
    const rw = this.rwState();
    const rows = (rw.result?.pairs || []).map(p => {
      const c = rw.choices[p.object_id];
      return [p.object_id, c?.target || "", c && c.how !== this.rwDefaultHow(p) ? c.how : ""];
    });
    this.downloadText("replace-pairs.csv", this.rwCsvText(rows), "text/csv");
  }

  rwCsvSaveSkipped() {
    const csv = this.rwState().csv;
    if (!csv?.skipped.length) return;
    const rows = csv.skipped.map(s => [s.old, s.target, s.how, this.t(`rwCsvR_${s.key}`, s.vars)]);
    this.downloadText("replace-skipped.csv", this.rwCsvText(rows, [["reason"]]), "text/csv");
  }

  // The button "CSV" and its menu, in the tool bar of both steps; the menu is the one the export menus use.
  rwCsvMenu(left = false) {
    const open = this._expOpen === "rwcsv", rw = this.rwState();
    const item = (attr, label, hint) => `<button type="button" class="expitem" role="menuitem" ${attr}><strong>${this.t(label)}</strong><small>${this.t(hint)}</small></button>`;
    const menu = open ? `<span class="colpop exppop" role="menu">${item("data-rw-csv-load", "rwCsvLoad", "rwCsvLoadHint")}${item("data-rw-csv-template", "rwCsvTemplate", "rwCsvTemplateHint")}${rw.step === 2 && rw.result?.pairs?.length ? item("data-rw-csv-save", "rwCsvSave", "rwCsvSaveHint") : ""}</span>` : "";
    return `<span class="colwrap${left ? " popleft" : ""}"><button type="button" class="btn expbtn ${open ? "on" : ""}" data-exp-menu="rwcsv" aria-haspopup="menu" aria-expanded="${open}"><ha-icon icon="mdi:file-delimited-outline"></ha-icon>${this.t("rwCsvButton")}<ha-icon icon="mdi:chevron-down"></ha-icon></button>${menu}</span>`;
  }

  // What the file did, above the list of the pairs: the counts, and behind a fold each row that was left out and why.
  rwCsvBanner() {
    const csv = this.rwState().csv;
    if (!csv) return "";
    const list = csv.skipped.map(s => `<li><strong>${this.t("rwCsvLine", { line: s.line })}</strong> <code>${this.esc([s.old, s.target].filter(Boolean).join(" → "))}</code> · ${this.esc(this.t(`rwCsvR_${s.key}`, s.vars))}</li>`).join("");
    const fold = csv.skipped.length ? `<details class="howto"><summary>${this.t("rwCsvList")}</summary><ul class="factnote">${list}</ul><button class="btn quiet" data-rw-csv-skipped>${this.t("rwCsvSaveSkipped")}</button></details>` : "";
    return `<div class="hintbox"><ha-icon icon="mdi:file-delimited-outline"></ha-icon><div><p><strong>${this.t("rwCsvFrom", { file: `<span style="text-transform:none">${this.esc(csv.file)}</span>`, total: csv.total })}</strong> <span class="pill ok">${this.t("rwCsvApplied", { count: csv.applied })}</span>${csv.skipped.length ? ` <span class="pill warn">${this.t("rwCsvSkipped", { count: csv.skipped.length })}</span>` : ""}</p>${csv.over ? `<p>${this.t("rwCsvOver")}</p>` : ""}${fold}</div></div>`;
  }

  // The mark on a row whose new entity is still the one the file named.
  rwCsvMark(id) {
    const rw = this.rwState();
    return rw.fromFile?.get(id) && rw.choices[id]?.target === rw.fromFile.get(id) ? `<span class="tag">${this.t("rwCsvFromFile")}</span>` : "";
  }

  bindReplaceCsv(root) {
    root.querySelector("[data-rw-csv-load]")?.addEventListener("click", () => {
      const input = (this._rwCsvInput = document.createElement("input"));
      input.type = "file"; input.accept = ".csv,.txt,text/csv,text/plain";
      input.onchange = () => { const file = input.files?.[0]; this._rwCsvInput = null; this.rwCsvLoadFile(file); };
      input.click();
    });
    root.querySelector("[data-rw-csv-template]")?.addEventListener("click", () => { this._expOpen = ""; this.rwCsvTemplate(); this.render(); });
    root.querySelector("[data-rw-csv-save]")?.addEventListener("click", () => { this._expOpen = ""; this.rwCsvSave(); this.render(); });
    root.querySelector("[data-rw-csv-skipped]")?.addEventListener("click", () => this.rwCsvSaveSkipped());
  }
}
