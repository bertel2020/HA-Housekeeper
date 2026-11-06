// Helpers as a file: export the options and entity settings of helper entries, create them from such a file. A deleted helper is created anew by "Undo"; the file is the same note.
Object.assign(TEXT.de, {
  helperAreaCol: "Bereich", helperLabelCol: "Labels", helperGapAny: "Bereich und Labels", helperNoArea: "Ohne Bereich", helperNoLabel: "Ohne Label",
  helperExportAll: "Alle exportieren", helperImport: "Importieren …",
  helperIoHint: "Als Datei sichern und später wieder anlegen. Importieren erzeugt einen Plan mit Vorschau; Rückgängig löscht den neuen Helfer wieder.",
  helperImportBad: "Das ist keine Housekeeper-Helferdatei.", helperExportNone: "In der Liste ist kein Helfer, den Housekeeper exportieren kann.",
  actExportHelper: "Helfer exportieren", actHintExportHelper: "Speichert die Optionen und Entitäts-Einstellungen des Helfers als Datei. Housekeeper legt sie auch vor jedem Löschen im Journal ab.",
  err_not_helper: "Das ist kein Helfer, den Housekeeper exportieren darf.",
  undo_conflict_helper_flow: "nicht wiederhergestellt: Home Assistant konnte den Helfer nicht neu anlegen. Das Backup bringt ihn zurück",
  reason_invalid_helper: "Die Datei enthält für diesen Helfer keine brauchbaren Angaben.",
  sim_helper_created: "{count} Helfer werden erstellt (rückgängig: werden gelöscht)", check_helper_created: "Helfer ist erstellt", actKind_import_helper: "Helfer erstellt",
  confirmedSummaryHelperImport: "Der Helfer wird aus der Datei neu erstellt, mit den alten Entitäts-IDs und Einstellungen. Das lässt sich rückgängig machen: der neue Helfer wird gelöscht.",
});
Object.assign(TEXT.en, {
  helperAreaCol: "Area", helperLabelCol: "Labels", helperGapAny: "Area and labels", helperNoArea: "No area", helperNoLabel: "No label",
  helperExportAll: "Export all", helperImport: "Import …",
  helperIoHint: "Save as a file and create them again later. Importing makes a plan with a preview; Undo deletes the new helper again.",
  helperImportBad: "This is not a Housekeeper helper file.", helperExportNone: "The list has no helper Housekeeper can export.",
  actExportHelper: "Export the helper", actHintExportHelper: "Saves the options and entity settings of the helper as a file. Housekeeper also keeps them in the journal before every deletion.",
  err_not_helper: "This is not a helper Housekeeper may export.",
  undo_conflict_helper_flow: "not restored: Home Assistant could not create the helper anew. The backup brings it back",
  reason_invalid_helper: "The file holds no usable details for this helper.",
  sim_helper_created: "{count} helper(s) are created (undo deletes them)", check_helper_created: "Helper is created", actKind_import_helper: "Helper created",
  confirmedSummaryHelperImport: "The helper is created anew from the file, with the old entity IDs and settings. This can be undone: the new helper is deleted.",
});

class HelperIoMixin {
  // Whether the domain is a config-entry helper; the list is the backend's, sent with the inventory.
  helperDomain(domain) {
    return (this.data?.meta?.helper_domains || []).includes(domain);
  }

  // The bar over the helper list: export every helper in it, or create helpers from a file.
  helperIoBar(rows) {
    const ids = rows.filter(r => r.object_type === "config_entry").map(r => r.object_id);
    return `<div class="toolbar"><button class="btn" data-helper-export-all="${this.esc(ids.join(","))}" ${ids.length ? "" : "disabled"}><ha-icon icon="mdi:export"></ha-icon>${this.t("helperExportAll")}</button><button class="btn" data-helper-import><ha-icon icon="mdi:import"></ha-icon>${this.t("helperImport")}</button><input type="file" accept=".json,application/json" data-helper-file hidden><span class="toolgap"></span><span class="muted">${this.t("helperIoHint")}</span></div>`;
  }

  bindHelperIo(root) {
    root.querySelectorAll("[data-helper-export-all]").forEach(el => el.onclick = () => this.exportHelpers(el.dataset.helperExportAll.split(",").filter(Boolean)));
    root.querySelectorAll("[data-act-export-helper]").forEach(el => el.onclick = () => this.exportHelpers([el.dataset.actExportHelper]));
    root.querySelectorAll("[data-helper-import]").forEach(el => el.onclick = () => root.querySelector("[data-helper-file]")?.click());
    root.querySelectorAll("[data-helper-file]").forEach(el => el.onchange = () => { const file = el.files?.[0]; el.value = ""; if (file) this.importHelpers(file); });
  }

  async exportHelpers(entryIds) {
    if (!entryIds.length) { this.toast(this.t("helperExportNone"), true); return; }
    try {
      const file = await this._hass.callWS({ type: "ha_housekeeper/helper_export", entry_ids: entryIds.slice(0, 200) });
      this.downloadText(`helpers-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(file, null, 2), "application/json");
    } catch (err) { this.failed(err); }
  }

  // The file becomes one plan with a step per helper; nothing is created before the person confirms it.
  async importHelpers(file) {
    let data;
    try { data = JSON.parse(await file.text()); } catch { data = null; }
    const helpers = data && data.format === "housekeeper-helper-export" && Array.isArray(data.helpers) ? data.helpers.filter(h => h && typeof h === "object") : [];
    if (!helpers.length) { this.toast(this.t("helperImportBad"), true); return; }
    try {
      if (!await this.newPlan(helpers.slice(0, MAX_PLAN_ACTIONS).map((helper, i) => ({ kind: "import_helper", object_id: `import:${i + 1}:${helper.domain || ""}`, helper })))) return;
    } catch (err) { this.failed(err); }
    this.render();
  }
}
