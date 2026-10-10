// Pick entities in the recorder views and get the exclusion for configuration.yaml; Housekeeper never writes it.
// Mixed into the panel in 99-register.js.
Object.assign(TEXT.de, {
  exTitle: "Vorschlag für die configuration.yaml", exHint: "Häkchen in der Liste setzen; der Block baut sich daraus. Das ändert nichts in Home Assistant, es ist nur Text zum Einfügen. Ausgeschlossene Entitäten haben danach keinen Verlauf mehr.",
  exCount: "{count} ausgewählt", exEmpty: "Noch nichts ausgewählt.", exPickSuggested: "Alle Vorgeschlagenen wählen", exClear: "Auswahl leeren",
  exSuggest: "Ausschluss möglich", exHasStats: "Statistik vorhanden", exUsedBy: "{count} Verwendungen",
  trimTitle: "Alten Verlauf der Auswahl kürzen", trimHint: "Der Ausschluss wirkt nur für neue Daten. Hier löschst du die bereits gespeicherten Zustände der Auswahl, die älter sind als die gewählte Zeit. Statistiken bleiben. Daraus wird ein Plan unter Aufräumen: Vorschau mit Zeilenzahl, Bestätigung, Backup, Nachprüfung.",
  trimKeep: "Behalten", trimDays: "{days} Tage", trimPreview: "Plan für das Kürzen erstellen", trimBusy: "Plan wird erstellt …", trimFailed: "Der Plan konnte nicht erstellt werden: {detail}",
  trimSub: "älter als {days} Tage: {rows} Zeilen", reason_bad_keep_days: "Die Zeit zum Behalten ist ungültig.", reason_not_counted: "Die Zeilen ließen sich nicht zählen.", reason_nothing_to_trim: "Nichts zu löschen: Es gibt keine so alten Zustände.",
  check_history_trimmed: "Alter Verlauf ist gelöscht", abort_trim_left: "Nach dem Löschen gab es noch ältere Zeilen.",
  confirmedSummaryTrim: "Der alte Verlauf von {count} Entitäten wird gelöscht. Vorher legt Housekeeper ein Home-Assistant-Backup an, einschließlich der Datenbank. Das lässt sich nur mit dem Backup zurücknehmen.",
});
Object.assign(TEXT.en, {
  exTitle: "Suggestion for configuration.yaml", exHint: "Tick entities in the list; the block builds from them. This changes nothing in Home Assistant, it is only text to paste. Excluded entities have no history afterwards.",
  exCount: "{count} selected", exEmpty: "Nothing selected yet.", exPickSuggested: "Select all suggested", exClear: "Clear selection",
  exSuggest: "can be excluded", exHasStats: "has statistics", exUsedBy: "{count} uses",
  trimTitle: "Trim the old history of the selection", trimHint: "The exclusion only works for new data. Here you delete the states already stored for the selection that are older than the chosen time. Statistics stay. This becomes a plan under Cleanup: preview with row count, confirmation, backup, check afterwards.",
  trimKeep: "Keep", trimDays: "{days} days", trimPreview: "Create a plan to trim", trimBusy: "Creating the plan …", trimFailed: "The plan could not be created: {detail}",
  trimSub: "older than {days} days: {rows} rows", reason_bad_keep_days: "The time to keep is not valid.", reason_not_counted: "The rows could not be counted.", reason_nothing_to_trim: "Nothing to delete: there are no states that old.",
  check_history_trimmed: "Old history is deleted", abort_trim_left: "Older rows were still there after deleting.",
  confirmedSummaryTrim: "The old history of {count} entities will be deleted. Housekeeper creates a Home Assistant backup first, including the database. It can only be taken back with that backup.",
});

const EXCLUDE_MIN_PER_DAY = 100; // rows per day from which an unused entity is worth excluding

class ExcludeMixin {
  // What speaks for or against excluding one entity, from the inventory.
  excludeInfo(entityId, perDay) {
    const obj = this.findObject(`entity:${entityId}`);
    if (!obj) return { suggest: false, tags: "" };
    const uses = this.edgesTo(`entity:${entityId}`).filter(e => USAGE_RELATIONS.includes(e.relation)).length;
    const suggest = !uses && !obj.has_statistics && perDay >= EXCLUDE_MIN_PER_DAY;
    const tag = (cls, text) => `<span class="pill ${cls}">${text}</span>`;
    const tags = suggest ? tag("warn", this.t("exSuggest")) : [obj.has_statistics ? tag("mute", this.t("exHasStats")) : "", uses ? tag("mute", this.t("exUsedBy", { count: uses })) : ""].join("");
    return { suggest, tags };
  }

  excludeBox(entityId) {
    return `<input type="checkbox" class="selbox" data-exsel="${this.esc(entityId)}" ${this.excludeSel.has(entityId) ? "checked" : ""} aria-label="${this.esc(entityId)}">`;
  }

  excludeSnippet() {
    return `recorder:\n  exclude:\n    entities:\n${[...this.excludeSel].sort().map(id => `      - ${id}`).join("\n")}\n`;
  }

  // `suggested` are the entity ids of the list in view that the Suggest button ticks.
  excludeCard(suggested) {
    this._exSuggested = suggested;
    const n = this.excludeSel.size;
    const body = n ? `<pre class="code" style="max-height:none">${this.esc(this.excludeSnippet())}</pre>` : `<p class="factnote">${this.t("exEmpty")}</p>`;
    return `<div class="panel" style="margin:14px 16px"><div class="panelhead"><div><h3>${this.t("exTitle")}</h3><p>${this.t("exHint")}</p></div><div class="actions"><span class="factnote">${this.t("exCount", { count: n })}</span>${suggested.length ? `<button class="btn" data-ex-suggested>${this.t("exPickSuggested")}</button>` : ""}${n ? `<button class="btn" data-ex-clear>${this.t("exClear")}</button><button class="btn" data-copy-snippet>${this.snippetCopied ? this.t("recorderCopied") : this.t("recorderCopy")}</button>` : ""}</div></div>${body}${n ? this.trimBlock() : ""}</div>`;
  }

  // Deleting the states stored before: the exclusion alone leaves them. Made as an ordinary plan.
  trimBlock() {
    const days = this.trimDays || 14, n = Math.min(this.excludeSel.size, MAX_PLAN_ACTIONS);
    const options = [7, 14, 30, 90].map(d => `<option value="${d}" ${d === days ? "selected" : ""}>${this.t("trimDays", { days: d })}</option>`).join("");
    return `<div class="trimbox"><h3>${this.t("trimTitle")}</h3><p class="factnote">${this.t("trimHint")}</p><div class="actions"><label class="factnote" for="hk-trim-days">${this.t("trimKeep")}</label><select id="hk-trim-days" data-trim-days>${options}</select><button class="btn accent" data-trim-plan ${this.trimBusy ? "disabled" : ""}>${this.trimBusy ? this.t("trimBusy") : `${this.t("trimPreview")} (${n})`}</button></div>${this.trimError ? `<p class="factnote" role="alert">${this.esc(this.t("trimFailed", { detail: this.trimError }))}</p>` : ""}</div>`;
  }

  async trimPlan() {
    this.trimBusy = true; this.trimError = ""; this.render();
    try {
      const keep_days = this.trimDays || 14;
      const actions = [...this.excludeSel].slice(0, MAX_PLAN_ACTIONS).map(object_id => ({ kind: "trim_history", object_id, keep_days }));
      const plan = await this._hass.callWS({ type: "ha_housekeeper/plan_create", actions });
      this.plan = plan; this.confirmation = null; this.ack = new Set(); this.confirmWord = "";
      this.journal = [plan, ...(this.journal || [])];
      this._scrollPlan = true; this.view = "cleanup"; this.pages = {};
    } catch (err) { this.trimError = err?.message || String(err); }
    this.trimBusy = false;
    this.render();
  }

  bindExclude(root) {
    root.querySelector("[data-trim-days]")?.addEventListener("change", e => { this.trimDays = Number(e.target.value) || 14; this.render(); });
    root.querySelector("[data-trim-plan]")?.addEventListener("click", () => this.trimPlan());
    root.querySelectorAll("[data-exsel]").forEach(el => el.onchange = () => { el.checked ? this.excludeSel.add(el.dataset.exsel) : this.excludeSel.delete(el.dataset.exsel); this.render(); });
    root.querySelector("[data-ex-suggested]")?.addEventListener("click", () => { (this._exSuggested || []).forEach(id => this.excludeSel.add(id)); this.render(); });
    root.querySelector("[data-ex-clear]")?.addEventListener("click", () => { this.excludeSel.clear(); this.render(); });
    root.querySelector("[data-copy-snippet]")?.addEventListener("click", async () => {
      try { await globalThis.navigator?.clipboard?.writeText(this.excludeSnippet()); this.snippetCopied = true; } catch (_) { this.snippetCopied = false; }
      this.render();
      setTimeout(() => { this.snippetCopied = false; this.render(); }, 1500);
    });
  }
}
