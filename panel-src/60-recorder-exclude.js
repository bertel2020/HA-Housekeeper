// Pick entities in the recorder views and get the exclusion for configuration.yaml; Housekeeper never writes it.
// Mixed into the panel in 99-register.js.
Object.assign(TEXT.de, {
  exclHint: "Das ändert nichts in Home Assistant, es ist nur Text zum Einfügen. Ausgeschlossene Entitäten haben danach keinen Verlauf mehr.",
  exTrimCount: "{count} zum Kürzen", exLeft: "Ausgeschlossen, aber noch gespeichert: {count} Entitäten, mindestens {rows} Zeilen", exLeftPick: "Zum Kürzen wählen",
  exCount: "{count} ausgewählt", exSugCount: "{count} Vorschläge", exPickSuggested: "Alle Vorgeschlagenen wählen", exClear: "Leeren", exCopy: "YAML kopieren",
  exStepsTitle: "So geht es weiter", exStep1: "Einfügen in die configuration.yaml. Gibt es dort schon einen recorder:-Abschnitt, trage nur die Zeilen unter entities: in dessen exclude:-Liste ein, nicht noch einmal recorder:.",
  exStep2: "Prüfen unter Entwicklerwerkzeuge → YAML → Konfiguration prüfen.", exStep3: "Neu starten. Der Recorder liest den Ausschluss nur beim Start. Danach steht die Entität hier als „bereits ausgeschlossen“.",
  exSuggest: "Empfohlen", exOnlySug: "Nur Vorschläge", exWhy: "Nicht verwendet, keine Statistik, {perDay} Zeilen in den letzten 24 Stunden", exRule: "Empfohlen ist, was nirgends verwendet wird, keine Statistik hat und in den letzten 24 Stunden mindestens {min} Zeilen schreibt.", exHasStats: "Statistik vorhanden", exUsedBy: "{count} Verwendungen",
  trimTitle: "Alten Verlauf kürzen", trimHint: "Der Ausschluss gilt nur für neue Daten. Schon gespeicherte Zustände bleiben, bis du sie hier löschst.", trimChosen: "{count} Entitäten ausgewählt", trimChosenOne: "1 Entität ausgewählt",
  trimKeep: "Zustände behalten, die jünger sind als", trimDays: "{days} Tage", trimGone: "Wird gelöscht", trimGoneSub: "Zustände älter als {days} Tage", trimStay: "Bleibt", trimStaySub: "die letzten {days} Tage", trimEarlier: "früher", trimAgo: "vor {days} Tagen", trimToday: "heute",
  trimFactStats: "Statistiken bleiben", trimFactStatsSub: "Energie-Dashboard und Langzeitdiagramme ändern sich nicht.", trimFactRows: "Zeilenzahl erst in der Vorschau", trimFactRowsSub: "Du siehst pro Entität, wie viele Zeilen wegfallen, bevor etwas passiert.",
  trimFoot: "Vor dem Löschen legt Housekeeper ein Home-Assistant-Backup mit Datenbank an. Zurücknehmen geht nur mit diesem Backup.", trimPreview: "Vorschau erstellen ({count})", trimPreviewOne: "Vorschau erstellen (1)", trimBusy: "Plan wird erstellt …", trimFailed: "Der Plan konnte nicht erstellt werden: {detail}",
  trimSub: "älter als {days} Tage: {rows} Zeilen", reason_bad_keep_days: "Die Zeit zum Behalten ist ungültig.", reason_not_counted: "Die Zeilen ließen sich nicht zählen.", reason_nothing_to_trim: "Nichts zu löschen: Es gibt keine so alten Zustände.",
  check_history_trimmed: "Alter Verlauf ist gelöscht", abort_trim_unverified: "Gelöscht, aber die übrigen Zeilen ließen sich nicht zählen.", abort_trim_left: "Nach dem Löschen gab es noch ältere Zeilen.",
  confirmedSummaryTrim: "Der alte Verlauf von {count} Entitäten wird gelöscht. Vorher legt Housekeeper ein Home-Assistant-Backup an, einschließlich der Datenbank. Das lässt sich nur mit dem Backup zurücknehmen.",
});
Object.assign(TEXT.en, {
  exclHint: "This changes nothing in Home Assistant, it is only text to paste. Excluded entities have no history afterwards.",
  exTrimCount: "{count} to trim", exLeft: "Excluded but still stored: {count} entities, at least {rows} rows", exLeftPick: "Select to trim",
  exCount: "{count} selected", exSugCount: "{count} suggestions", exPickSuggested: "Select all suggested", exClear: "Clear", exCopy: "Copy YAML",
  exStepsTitle: "What to do next", exStep1: "Paste it into configuration.yaml. If there is a recorder: section already, add only the lines under entities: to its exclude: list, not recorder: again.",
  exStep2: "Check under Developer tools → YAML → Check configuration.", exStep3: "Restart. The recorder reads the exclusion only at start. Afterwards the entity shows here as “already excluded”.",
  exSuggest: "Recommended", exOnlySug: "Only suggestions", exWhy: "Not used, no statistics, {perDay} rows in the last 24 hours", exRule: "Recommended means: used nowhere, no statistics and wrote at least {min} rows in the last 24 hours.", exHasStats: "has statistics", exUsedBy: "{count} uses",
  trimTitle: "Trim the old history", trimHint: "The exclusion only applies to new data. States already stored stay until you delete them here.", trimChosen: "{count} entities selected", trimChosenOne: "1 entity selected",
  trimKeep: "Keep states that are younger than", trimDays: "{days} days", trimGone: "Will be deleted", trimGoneSub: "States older than {days} days", trimStay: "Stays", trimStaySub: "the last {days} days", trimEarlier: "earlier", trimAgo: "{days} days ago", trimToday: "today",
  trimFactStats: "Statistics stay", trimFactStatsSub: "The Energy dashboard and long-term charts do not change.", trimFactRows: "Row count comes with the preview", trimFactRowsSub: "You see per entity how many rows go before anything happens.",
  trimFoot: "Before deleting, Housekeeper creates a Home Assistant backup including the database. It can only be undone with that backup.", trimPreview: "Create preview ({count})", trimPreviewOne: "Create preview (1)", trimBusy: "Creating the plan …", trimFailed: "The plan could not be created: {detail}",
  trimSub: "older than {days} days: {rows} rows", reason_bad_keep_days: "The time to keep is not valid.", reason_not_counted: "The rows could not be counted.", reason_nothing_to_trim: "Nothing to delete: there are no states that old.",
  check_history_trimmed: "Old history is deleted", abort_trim_unverified: "Deleted, but the rows left could not be counted.", abort_trim_left: "Older rows were still there after deleting.",
  confirmedSummaryTrim: "The old history of {count} entities will be deleted. Housekeeper creates a Home Assistant backup first, including the database. It can only be taken back with that backup.",
});

const EXCLUDE_MIN_PER_DAY = 100; // only for the text of the rule: the backend decides (SUGGEST_MIN_PER_DAY in maintenance.py)

class ExcludeMixin {
  // What speaks for or against excluding one entity. The backend decides (`suggest_exclude`, one rule for both views);
  // this only words it. `item` is a row of the write load or of the storage use.
  excludeInfo(item) {
    const tag = (cls, text) => `<span class="pill ${cls}">${text}</span>`;
    if (item.excluded) return { suggest: false, tags: tag("ok", this.t("recorderExcluded")) };
    if (!this.findObject(`entity:${item.entity_id}`)) return { suggest: false, tags: "" };
    const suggest = Boolean(item.suggest_exclude), uses = item.used || 0;
    const rate = item.states_24h ?? item.rows_24h ?? 0;
    const tags = suggest ? tag("warn", this.t("exSuggest")) : [item.has_statistics ? tag("mute", this.t("exHasStats")) : "", uses ? tag("mute", this.t("exUsedBy", { count: uses })) : ""].join("");
    return { suggest, tags, why: suggest ? this.t("exWhy", { perDay: this.formatNumber(Math.round(rate)) }) : "" };
  }

  // What the recorder keeps out already, from the lists in view.
  excludedIds() {
    return new Set([...(this.costs?.entities || []), ...(this.storms?.entities || [])].filter(e => e.excluded).map(e => e.entity_id));
  }

  // An excluded entity stays pickable: it adds nothing to the block, but its old rows can be trimmed.
  excludeBox(entityId) {
    return `<input type="checkbox" class="selbox" data-exsel="${this.esc(entityId)}" ${this.excludeSel.has(entityId) ? "checked" : ""} aria-label="${this.esc(entityId)}">`;
  }

  // The box in the head of the picking column: ticks or clears the entities of the page in view (the ids ride on the box).
  excludeAllBox(ids) {
    if (!ids.length) return "";
    const n = ids.filter(id => this.excludeSel.has(id)).length;
    return `<input type="checkbox" class="selbox" data-exsel-all="${this.esc(ids.join(","))}" ${n === ids.length ? "checked" : ""} ${n && n < ids.length ? "data-partial" : ""} aria-label="${this.esc(this.t("selectPage"))}">`;
  }

  // The picked entities that are not excluded yet, in the order of the block.
  excludeChosen() {
    const done = this.excludedIds();
    return [...this.excludeSel].filter(id => !done.has(id)).sort();
  }

  // Excluded entities of the cost list that still hold rows. The list shows only the largest, so this is a lower bound.
  excludeLeft() {
    const rows = (this.costs?.entities || []).filter(e => e.excluded && e.states > 0);
    return { ids: rows.map(e => e.entity_id), rows: rows.reduce((sum, e) => sum + e.states, 0) };
  }

  excludeSnippet() {
    return `recorder:\n  exclude:\n    entities:\n${this.excludeChosen().map(id => `      - ${id}`).join("\n")}\n`;
  }

  // One bar over the list: what is picked and what can be done with it. The block and the steps open once something is
  // to be excluded, the trim block once anything is picked. `suggested` are the entity ids of the list in view that the Suggest button ticks.
  excludeCard(suggested, { only = true } = {}) {
    this._exSuggested = suggested;
    const n = this.excludeChosen().length, trim = this.excludeSel.size - n, sug = suggested.length, left = this.excludeLeft();
    const label = [n ? this.t("exCount", { count: n }) : "", trim ? this.t("exTrimCount", { count: trim }) : ""].filter(Boolean).join(" · ") || (sug ? this.t("exSugCount", { count: sug }) : ""); // nothing picked: only the suggestions, if any
    const leftNote = left.ids.length && left.ids.some(id => !this.excludeSel.has(id))
      ? `<span class="date">${this.t("exLeft", { count: this.formatNumber(left.ids.length), rows: this.formatNumber(left.rows) })}</span><button class="btn quiet" data-ex-left>${this.t("exLeftPick")}</button>` : "";
    const any = n || trim;
    const bar = `<div class="toolbar exbar${any ? "" : " nosel"}">${only && (sug || this.exOnlySug) ? `<button class="btn quiet${this.exOnlySug ? " on" : ""}" data-ex-only aria-pressed="${Boolean(this.exOnlySug)}">${this.t("exOnlySug")}</button>` : ""}${sug ? `<button class="btn quiet" data-ex-suggested>${this.t("exPickSuggested")}</button>` : ""}${any ? `<button class="btn quiet" data-ex-clear>${this.t("exClear")}</button>` : ""}${label ? `<span class="selcount" role="status" title="${this.esc(this.t("exclHint"))}">${label}</span>` : ""}<span class="toolgap"></span>${n ? `<button class="btn primary" data-copy-snippet title="${this.esc(this.t("exclHint"))}">${this.snippetCopied ? this.t("recorderCopied") : this.t("exCopy")}</button>` : ""}${leftNote}</div>`;
    const steps = `<div class="exsteps"><strong>${this.t("exStepsTitle")}</strong><ol><li>${this.t("exStep1")}</li><li>${this.t("exStep2")}</li><li>${this.t("exStep3")}</li></ol></div>`;
    const rule = `<p class="factnote exrule">${this.t("exRule", { min: EXCLUDE_MIN_PER_DAY })}</p>`;
    return `${bar}${rule}${n ? `<pre class="code exblock">${this.esc(this.excludeSnippet())}</pre>${steps}` : ""}${any ? this.trimBlock() : ""}`;
  }

  // Deleting the states stored before: the exclusion alone leaves them. Made as an ordinary plan.
  trimBlock() {
    const days = this.trimDays || 14, n = Math.min(this.excludeSel.size, MAX_PLAN_ACTIONS), all = this.excludeSel.size;
    const seg = [7, 14, 30, 90].map(d => `<button type="button" class="${d === days ? "on" : ""}" data-trim-days="${d}" role="radio" aria-checked="${d === days}">${this.t("trimDays", { days: d })}</button>`).join("");
    const timeline = all > 1 ? `<div><div class="trimline"><div class="gone"><strong>${this.t("trimGone")}</strong><small>${this.t("trimGoneSub", { days })}</small></div><div class="stay"><strong>${this.t("trimStay")}</strong><small>${this.t("trimStaySub", { days })}</small></div></div>
        <div class="trimaxis"><span>${this.t("trimEarlier")}</span><span>${this.t("trimAgo", { days })}</span><span>${this.t("trimToday")}</span></div></div>
      <div class="trimfacts"><div><strong>${this.t("trimFactStats")}</strong><small>${this.t("trimFactStatsSub")}</small></div><div><strong>${this.t("trimFactRows")}</strong><small>${this.t("trimFactRowsSub")}</small></div></div>` : "";
    return `<div class="trimbox"><div class="trimhead"><div><h3>${this.t("trimTitle")}</h3><p class="factnote">${this.t("trimHint")}</p></div><span class="pill mute">${all === 1 ? this.t("trimChosenOne") : this.t("trimChosen", { count: all })}</span></div>
      <div class="trimsentence"><strong>${this.t("trimKeep")}</strong><span class="trimseg" role="radiogroup">${seg}</span></div>${timeline}
      <div class="trimfoot"><p class="factnote">${this.t("trimFoot")}</p><button class="btn primary" data-trim-plan ${this.trimBusy ? 'disabled aria-busy="true"' : ""}>${this.trimBusy ? this.t("trimBusy") : n === 1 ? this.t("trimPreviewOne") : this.t("trimPreview", { count: n })}</button></div>${this.trimError ? `<p class="factnote" role="alert">${this.esc(this.t("trimFailed", { detail: this.trimError }))}</p>` : ""}</div>`;
  }

  async trimPlan() {
    this.trimBusy = true; this.trimError = ""; this.render();
    try {
      const keep_days = this.trimDays || 14;
      const actions = [...this.excludeSel].slice(0, MAX_PLAN_ACTIONS).map(object_id => ({ kind: "trim_history", object_id, keep_days }));
      const plan = await this._hass.callWS({ type: "ha_housekeeper/plan_create", actions });
      this.openNewPlan(plan);
    } catch (err) { this.trimError = this.errText(err); }
    this.trimBusy = false;
    this.render();
  }

  bindExclude(root) {
    root.querySelectorAll("[data-trim-days]").forEach(el => el.onclick = () => { this.trimDays = Number(el.dataset.trimDays) || 14; this.render(); });
    root.querySelector("[data-trim-plan]")?.addEventListener("click", () => this.trimPlan());
    root.querySelectorAll("[data-exsel]").forEach(el => el.onchange = () => { el.checked ? this.excludeSel.add(el.dataset.exsel) : this.excludeSel.delete(el.dataset.exsel); this.render(); });
    root.querySelectorAll("[data-exsel-all]").forEach(el => { el.indeterminate = el.hasAttribute("data-partial"); el.onchange = () => { el.dataset.exselAll.split(",").forEach(id => (el.checked ? this.excludeSel.add(id) : this.excludeSel.delete(id))); this.render(); }; });
    root.querySelector("[data-ex-suggested]")?.addEventListener("click", () => { (this._exSuggested || []).forEach(id => this.excludeSel.add(id)); this.render(); });
    root.querySelector("[data-ex-left]")?.addEventListener("click", () => { this.excludeLeft().ids.forEach(id => this.excludeSel.add(id)); this.render(); });
    root.querySelector("[data-ex-only]")?.addEventListener("click", () => { this.exOnlySug = !this.exOnlySug; this.pages.costs = 1; this.pages.stormentities = 1; this.render(); });
    root.querySelector("[data-ex-clear]")?.addEventListener("click", () => { this.excludeSel.clear(); this.render(); });
    root.querySelector("[data-copy-snippet]")?.addEventListener("click", async () => {
      try { await this.copyText(this.excludeSnippet()); this.snippetCopied = true; } catch (_) { this.snippetCopied = false; }
      this.render();
      setTimeout(() => { this.snippetCopied = false; this.render(); }, 1500);
    });
  }
}

// Simplified Chinese texts; merged into TEXT.
Object.assign(TEXT.zh, {
  "exclHint": "这不会更改 Home Assistant 中的任何内容，只是供粘贴的文本。被排除的实体之后将没有历史记录。",
  "exTrimCount": "{count} 个可裁剪",
  "exLeft": "已排除但仍存储：{count} 个实体，至少 {rows} 行",
  "exLeftPick": "选择以裁剪",
  "exCount": "已选择 {count} 个",
  "exSugCount": "{count} 条建议",
  "exPickSuggested": "选择所有建议项",
  "exClear": "清除",
  "exCopy": "复制 YAML",
  "exStepsTitle": "后续操作",
  "exStep1": "将其粘贴到 configuration.yaml 中。如果已有 recorder: 部分，只需在 entities: 下的 exclude: 列表中添加这些行，不要再添加一次 recorder:。",
  "exStep2": "在开发者工具 → YAML → 检查配置中进行检查。",
  "exStep3": "重启。记录器仅在启动时读取排除配置。之后该实体将在此处显示为「已排除」。",
  "exSuggest": "推荐",
  "exOnlySug": "仅建议项",
  "exWhy": "未被使用，无统计，过去 24 小时有 {perDay} 行",
  "exRule": "「推荐」表示：未在任何地方使用、无统计，且过去 24 小时至少写入 {min} 行。",
  "exHasStats": "有统计",
  "exUsedBy": "{count} 处使用",
  "trimTitle": "裁剪旧历史记录",
  "trimHint": "排除仅对新数据生效。已存储的状态会保留，直到你在此处删除它们。",
  "trimChosen": "已选择 {count} 个实体",
  "trimChosenOne": "已选择 1 个实体",
  "trimKeep": "保留在此时间之后的状态",
  "trimDays": "{days} 天",
  "trimGone": "将被删除",
  "trimGoneSub": "早于 {days} 天的状态",
  "trimStay": "保留",
  "trimStaySub": "最近 {days} 天",
  "trimEarlier": "更早",
  "trimAgo": "{days} 天前",
  "trimToday": "今天",
  "trimFactStats": "统计保留",
  "trimFactStatsSub": "能源仪表板和长期图表不会改变。",
  "trimFactRows": "行数将在预览中显示",
  "trimFactRowsSub": "在执行任何操作之前，你会看到每个实体将删除多少行。",
  "trimFoot": "删除之前，Housekeeper 会创建包含数据库的 Home Assistant 备份。只能通过该备份撤销。",
  "trimPreview": "创建预览（{count}）",
  "trimPreviewOne": "创建预览（1）",
  "trimBusy": "正在创建计划…",
  "trimFailed": "无法创建计划：{detail}",
  "trimSub": "早于 {days} 天：{rows} 行",
  "reason_bad_keep_days": "保留时间无效。",
  "reason_not_counted": "无法统计行数。",
  "reason_nothing_to_trim": "没有可删除的内容：不存在那么早的状态。",
  "check_history_trimmed": "旧历史记录已删除",
  "abort_trim_unverified": "已删除，但无法统计剩余行数。",
  "abort_trim_left": "删除后仍存在更早的行。",
  "confirmedSummaryTrim": "将删除 {count} 个实体的旧历史记录。Housekeeper 会先创建包含数据库的 Home Assistant 备份。只能通过该备份撤销。",
});
