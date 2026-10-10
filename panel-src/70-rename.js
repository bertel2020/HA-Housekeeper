// Renaming entity IDs with their references: the form under the selection bar, the plan, the row button. Mixed into the panel in 99-register.js.
Object.assign(TEXT.de, {
  fselRename: "Umbenennen", state_rename: "Umbenennen mit Verweisen", renameMode: "Wie", renameStrip: "Zahl am Ende entfernen (_2, _3 …)", renameReplace: "Text ersetzen",
  renameFind: "Suchen", renameWith: "Ersetzen durch", renameNoItems: "Wähle Entitäten aus.", renameNothing: "Mit dieser Angabe ändert sich keine ID.", renamePreview: "{count} IDs ändern sich:",
  renameMore: "und {count} weitere", renameButton: "Umbenennen vorbereiten", renameNote: "Die Verweise in Automationen, Skripten, Szenen und Dashboards ziehen mit. Das Backup davor ist klein, ohne Datenbank.",
  reason_not_registered: "Die Entität steht nicht in der Registry und lässt sich nicht umbenennen.", reason_bad_new_id: "Die neue ID ist ungültig oder hat eine andere Domain.", reason_target_taken: "Die neue ID ist schon vergeben.",
  reason_rename_unwritable: "Ein Verweis steht in einer Quelle, die Housekeeper nicht schreiben darf (zum Beispiel ein Paket). Er würde brechen.", reason_rename_templates: "Eine Vorlage nennt die ID als Text. Sie würde brechen und muss von Hand angepasst werden.",
  check_entity_renamed: "Neue ID ist da, alte ist weg", confirmedSummaryRename: "{count} Entitäten bekommen eine neue ID, Verweise werden umgeschrieben. Rückgängig ist möglich, solange die Dateien unverändert sind.", result_renamed: "Umbenannt",
  abort_rename_failed: "Home Assistant konnte die ID nicht ändern; die Dateien wurden zurückgesetzt.", confirmWordRename: "UMBENENNEN",
});
Object.assign(TEXT.en, {
  fselRename: "Rename", state_rename: "Rename with references", renameMode: "How", renameStrip: "Remove the trailing number (_2, _3 …)", renameReplace: "Replace text",
  renameFind: "Find", renameWith: "Replace with", renameNoItems: "Select entities.", renameNothing: "With this input no ID changes.", renamePreview: "{count} IDs change:",
  renameMore: "and {count} more", renameButton: "Prepare rename", renameNote: "References in automations, scripts, scenes and dashboards follow. The backup before it is small, without the database.",
  reason_not_registered: "The entity is not in the registry and cannot be renamed.", reason_bad_new_id: "The new ID is invalid or has another domain.", reason_target_taken: "The new ID is taken already.",
  reason_rename_unwritable: "A reference sits in a source Housekeeper may not write (a package, for example). It would break.", reason_rename_templates: "A template names the ID as text. It would break and has to be changed by hand.",
  check_entity_renamed: "New ID exists, old one is gone", confirmedSummaryRename: "{count} entities get a new ID, references are rewritten. Undo works while the files are unchanged.", result_renamed: "Renamed",
  abort_rename_failed: "Home Assistant could not change the ID; the files were put back.", confirmWordRename: "RENAME",
});

class RenameMixin {
  // The new ID of one entity under the chosen rule, or "" when nothing changes. Only the part after the dot is touched.
  renameTarget(id, b) {
    const [domain, ...rest] = id.split("."), name = rest.join(".");
    const next = b.mode === "replace" ? (b.find ? name.split(b.find).join(b.with || "") : name) : name.replace(/_\d+$/, "");
    return next && next !== name ? `${domain}.${next}` : "";
  }

  renameItems() {
    const b = this.bulk;
    const ids = [...new Set(this.bulkTargets().filter(t => t.type === "entity").map(t => t.id))];
    return ids.map(id => [id, this.renameTarget(id, b)]).filter(([, to]) => to);
  }

  renameForm() {
    const b = this.bulk, items = this.renameItems();
    const shown = items.slice(0, 5).map(([from, to]) => `<code>${this.esc(from)}</code> → <code>${this.esc(to)}</code>`).join("<br>");
    const rest = items.length > 5 ? `<br>${this.t("renameMore", { count: items.length - 5 })}` : "";
    const preview = items.length ? `<small class="factnote">${this.t("renamePreview", { count: items.length })}<br>${shown}${rest}</small>` : `<small class="factnote">${this.t("renameNothing")}</small>`;
    return `<form class="polform bulkform" data-bulk-form><strong>${this.t("state_rename")}</strong>
      <select data-bulk-rename-mode aria-label="${this.esc(this.t("renameMode"))}"><option value="strip" ${b.mode !== "replace" ? "selected" : ""}>${this.t("renameStrip")}</option><option value="replace" ${b.mode === "replace" ? "selected" : ""}>${this.t("renameReplace")}</option></select>
      ${b.mode === "replace" ? `<input data-bulk-rename-find value="${this.esc(b.find || "")}" placeholder="${this.esc(this.t("renameFind"))}" aria-label="${this.esc(this.t("renameFind"))}"><input data-bulk-rename-with value="${this.esc(b.with || "")}" placeholder="${this.esc(this.t("renameWith"))}" aria-label="${this.esc(this.t("renameWith"))}">` : ""}
      <button type="submit" class="btn primary" ${items.length ? "" : "disabled"}>${this.t("refactorPlan")}</button><button type="button" class="btn quiet" data-bulk-cancel>${this.t("cancelRun")}</button>
      ${preview}<small class="factnote">${this.t("renameNote")}</small>
      ${b.error ? `<small class="error" role="alert">${this.esc(this.t(b.error))}</small>` : ""}</form>`;
  }

  async makeRenamePlan() {
    const b = this.bulk, items = this.renameItems();
    if (!items.length) { b.error = "renameNothing"; this.render(); return; }
    try {
      const plan = await this._hass.callWS({ type: "ha_housekeeper/plan_create", actions: items.map(([object_id, target]) => ({ kind: "rename_entity", object_id, target })) });
      this.openNewPlan(plan);
      this.bulk = null; this.polSel = new Set();
    } catch (err) { b.error = ""; this.error = err?.message || String(err); }
    this.render();
  }

  // On the violation "ID ends in a number": ticks it and opens the form with the number removed.
  renameButton(item) {
    if (item.rule !== "entity_id_suffix" || item.ignored) return "";
    return `<button class="btn" data-rename-start="${this.esc(item.key)}">${this.t("renameButton")}</button>`;
  }

  bindRename(root) {
    root.querySelectorAll("[data-rename-start]").forEach(el => el.addEventListener("click", () => {
      this.polSel = new Set([el.dataset.renameStart]); this.bulk = { kind: "rename", mode: "strip", find: "", with: "", error: "" }; this.render();
    }));
    const mode = root.querySelector("[data-bulk-rename-mode]");
    if (mode) mode.onchange = ev => { this.bulk.mode = ev.target.value; this.render(); };
    const find = root.querySelector("[data-bulk-rename-find]"), repl = root.querySelector("[data-bulk-rename-with]");
    if (find) find.onchange = ev => { this.bulk.find = ev.target.value; this.render(); };
    if (repl) repl.onchange = ev => { this.bulk.with = ev.target.value; this.render(); };
  }
}
