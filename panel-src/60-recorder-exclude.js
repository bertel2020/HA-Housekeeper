// Pick entities in the recorder views and get the exclusion for configuration.yaml; Housekeeper never writes it.
// Mixed into the panel in 99-register.js.
Object.assign(TEXT.de, {
  exTitle: "Vorschlag für die configuration.yaml", exHint: "Häkchen in der Liste setzen; der Block baut sich daraus. Das ändert nichts in Home Assistant, es ist nur Text zum Einfügen. Ausgeschlossene Entitäten haben danach keinen Verlauf mehr.",
  exCount: "{count} ausgewählt", exEmpty: "Noch nichts ausgewählt.", exPickSuggested: "Alle Vorgeschlagenen wählen", exClear: "Auswahl leeren",
  exSuggest: "Ausschluss möglich", exHasStats: "Statistik vorhanden", exUsedBy: "{count} Verwendungen",
});
Object.assign(TEXT.en, {
  exTitle: "Suggestion for configuration.yaml", exHint: "Tick entities in the list; the block builds from them. This changes nothing in Home Assistant, it is only text to paste. Excluded entities have no history afterwards.",
  exCount: "{count} selected", exEmpty: "Nothing selected yet.", exPickSuggested: "Select all suggested", exClear: "Clear selection",
  exSuggest: "can be excluded", exHasStats: "has statistics", exUsedBy: "{count} uses",
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
    return `<div class="panel" style="margin:14px 16px"><div class="panelhead"><div><h3>${this.t("exTitle")}</h3><p>${this.t("exHint")}</p></div><div class="actions"><span class="factnote">${this.t("exCount", { count: n })}</span>${suggested.length ? `<button class="btn" data-ex-suggested>${this.t("exPickSuggested")}</button>` : ""}${n ? `<button class="btn" data-ex-clear>${this.t("exClear")}</button><button class="btn" data-copy-snippet>${this.snippetCopied ? this.t("recorderCopied") : this.t("recorderCopy")}</button>` : ""}</div></div>${body}</div>`;
  }

  bindExclude(root) {
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
