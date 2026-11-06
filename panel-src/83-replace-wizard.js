// The assistant "Replace entities": choose several old entities, give each its new one, then one plan (see device_pairs.py suggest_entities, cleanup.py _mark_target_clashes); mixed into the panel in 99-register.js.
Object.assign(TEXT.de, {
  repairTaskWizard: "Entitäten ersetzen", repairTaskWizardHint: "Eine oder mehrere Entitäten durch neue ersetzen: Verweise umstellen, Statistik und ID übernehmen. Zum Beispiel beim Wechsel eines Zählers oder einer Integration.",
  rwOneHint: "Ersetzt eine Entität durch eine andere. Was dabei geschieht, wählst du unten; bis du die Vorschau bestätigst, ändert sich nichts.",
  rwModeOne: "Eine Entität", rwModeMany: "Mehrere Entitäten", rwGroupKeep: "Die neue Entität behält ihre ID", rwGroupTake: "Die neue Entität übernimmt die alte ID",
  rwOffPair: "Die beiden Entitäten passen nicht zusammen.", rwOffNoStats: "Die alte Entität hat keine Statistik.", rwOffUnused: "Die alte Entität wird nirgends verwendet, es gibt keine Verweise umzustellen.", rwOffUnit: "Einheit oder Geräteklasse weichen ab.", rwResultLabel: "Ergebnis:",
  rwResult_replace: "{new} behält ihre ID. Verweise zeigen auf sie. {old} bleibt unverändert.",
  rwResult_replace_statistics: "{new} behält ihre ID. Verweise zeigen auf sie, und ihre Statistik beginnt mit dem Verlauf von {old}. {old} bleibt unverändert.",
  rwResult_statistics: "{new} behält ihre ID, ihre Statistik beginnt mit dem Verlauf von {old}. Verweise bleiben, wie sie sind.",
  rwResult_both: "{new} übernimmt die ID {old} und den Verlauf. Verweise laufen unverändert weiter. {old} bekommt eine andere ID.",
  rwResult_id: "{new} übernimmt die ID {old}, ihre Statistik beginnt neu. Verweise laufen unverändert weiter. {old} bekommt eine andere ID.",
  rwHow_replace_statistics: "Verweise und Statistik", rwHowHint_replace_statistics: "Automationen, Skripte, Szenen und Dashboards zeigen danach auf die neue ID, und die alte Statistik wird an die neue gehängt. Die Statistik ist nur über das Backup umkehrbar.",
  actReplaceMany: "Ersetzen …", actHintReplaceMany: "Diese Entität durch eine neue ersetzen, mit dem Assistenten für mehrere.",
  rwPickTitle: "Welche Entitäten sollen ersetzt werden?", rwPickHint: "Wähle die alten Entitäten. Im nächsten Schritt ordnest du jeder die neue zu; bis zur bestätigten Vorschau wird nichts geändert.",
  rwColEntity: "Entität", rwColStatus: "Status", rwColUsed: "Verwendet", rwNowhere: "nirgends verwendet", rwUsesMore: "{n} weitere", rwPart: "Teil {n} von 2", exUsedOne: "1 Verwendung", rwUsesShow: "Verwendungen anzeigen", rwUsesHide: "Verwendungen ausblenden", rwUseReplaced: "wird ersetzt", rwUseManual: "bleibt, von Hand prüfen", rwUsesNote: "Automatisch umgeschrieben: {auto}. Bleiben unverändert: {manual}.",
  rwFilterDomain: "Alle Arten", rwFilterPlatform: "Alle Integrationen", rwFilterScope: "Alle", rwFilterUsed: "Nur verwendete", rwFilterGone: "Nur nicht verfügbare",
  rwSelectFiltered: "Alle {count} gefilterten wählen", rwNext: "Weiter zu „Zuordnen“ ({count})", rwNoEntities: "Keine Entitäten.",
  rwSetupTitle: "Welche neue Entität ersetzt welche?", rwSetupHint: "Housekeeper schlägt vor (Klasse, Einheit, Bereich, Name, ID-Endung). Nichts ist vorausgewählt, was du nicht bestätigst.",
  rwScope: "Vorschläge aus", rwScopeAll: "Allen Entitäten", rwLoad: "Vorschläge laden", rwLoading: "Lade …", rwFailed: "Keine Vorschläge: {reason}", rwUnknown: "Nicht mehr bekannt: {list}",
  rwTakeAll: "Alle Vorschläge übernehmen ({count})", rwBack: "Zurück zur Auswahl",
  rwSumPairs: "{count} Paare", rwSumChosen: "{count} zugeordnet", rwSumErrors: "{count} mit Fehler", rwSumSuggest: "{count} mit Vorschlag", rwSumNone: "{count} ohne Verwendung",
  rwColTarget: "Neue Entität", rwColHow: "Art", rwNoTarget: "Kein Ersatz (überspringen)", rwSuggested: "Vorschlag",
  rwHow_replace: "Verweise umstellen", rwHow_both: "Statistik und ID", rwHow_statistics: "Nur Statistik", rwHow_id: "Nur ID",
  rwHowHint_replace: "Automationen, Skripte, Szenen und Dashboards zeigen danach auf die neue ID. Eine alte Statistik bleibt unter der alten ID stehen.",
  rwHowHint_both: "Die alte Statistik wird an die neue gehängt, die neue bekommt die alte ID. Verweise bleiben unverändert. Nur über das Backup umkehrbar.",
  rwHowHint_statistics: "Beide behalten ihre ID; Verweise müssen auf die neue zeigen. Nur über das Backup umkehrbar.",
  rwHowHint_id: "Die neue Entität übernimmt die ID, die Statistik bleibt getrennt.",
  rwErrDuplicate: "Ziel schon für {name} vergeben", rwWarnGone: "Ziel läuft nicht", rwWarnUnit: "Einheit weicht ab ({old} → {new})",
  rwMenuHow: "Art ändern …", rwMenuSuggest: "Vorschlag übernehmen", rwMenuSkip: "Zeile überspringen",
  rwDisableOld: "Alte Entität danach deaktivieren", rwDisableOldHint: "Sie wird in Quarantäne gelegt und lässt sich wieder aktivieren. Entfernt wird nichts. Bei „ID übernehmen“ entfällt das, die alte Entität bekommt dort ohnehin eine andere ID.",
  rwChosen: "{count} Paare bestätigt", rwCreate: "Vorschau erstellen ({count})", rwFixFirst: "Behebe zuerst die Fehler in den Zeilen.", rwManyPairs: "Ab 50 Paaren wird die Vorschau langsam; mehrere Läufe sind übersichtlicher.",
  reason_target_duplicate: "Dieselbe neue Entität ist für mehrere alte gewählt.", reason_target_replaced: "Die neue Entität wird selbst ersetzt (oder ersetzt eine andere).",
});
Object.assign(TEXT.en, {
  repairTaskWizard: "Replace entities", repairTaskWizardHint: "Replace one or several entities with new ones: switch references, take over statistics and ID. For example when changing a meter or an integration.",
  rwOneHint: "Replaces one entity with another. You choose below what happens; nothing changes until you confirm the preview.",
  rwModeOne: "One entity", rwModeMany: "Several entities", rwGroupKeep: "The new entity keeps its ID", rwGroupTake: "The new entity takes over the old ID",
  rwOffPair: "The two entities do not fit together.", rwOffNoStats: "The old entity has no statistics.", rwOffUnused: "The old entity is not used anywhere, so there are no references to switch.", rwOffUnit: "Unit or device class differ.", rwResultLabel: "Result:",
  rwResult_replace: "{new} keeps its ID. References point to it. {old} stays unchanged.",
  rwResult_replace_statistics: "{new} keeps its ID. References point to it, and its statistics begin with the history of {old}. {old} stays unchanged.",
  rwResult_statistics: "{new} keeps its ID, and its statistics begin with the history of {old}. References stay as they are.",
  rwResult_both: "{new} takes over the ID {old} and the history. References keep working unchanged. {old} gets another ID.",
  rwResult_id: "{new} takes over the ID {old}, and its statistics start anew. References keep working unchanged. {old} gets another ID.",
  rwHow_replace_statistics: "References and statistics", rwHowHint_replace_statistics: "Automations, scripts, scenes and dashboards then point to the new ID, and the old statistics are attached to the new ones. The statistics can only be undone through the backup.",
  actReplaceMany: "Replace …", actHintReplaceMany: "Replace this entity with a new one, using the assistant for several.",
  rwPickTitle: "Which entities should be replaced?", rwPickHint: "Pick the old entities. In the next step you give each one its new entity; nothing changes until you confirm the preview.",
  rwColEntity: "Entity", rwColStatus: "Status", rwColUsed: "Used", rwNowhere: "not used anywhere", rwUsesMore: "{n} more", rwPart: "Part {n} of 2", exUsedOne: "1 use", rwUsesShow: "Show uses", rwUsesHide: "Hide uses", rwUseReplaced: "will be replaced", rwUseManual: "stays, check by hand", rwUsesNote: "Rewritten automatically: {auto}. Left unchanged: {manual}.",
  rwFilterDomain: "All kinds", rwFilterPlatform: "All integrations", rwFilterScope: "All", rwFilterUsed: "Used only", rwFilterGone: "Unavailable only",
  rwSelectFiltered: "Select all {count} filtered", rwNext: "On to \"Set up\" ({count})", rwNoEntities: "No entities.",
  rwSetupTitle: "Which new entity replaces which?", rwSetupHint: "Housekeeper proposes (class, unit, area, name, ID ending). Nothing is preselected that you do not confirm.",
  rwScope: "Proposals from", rwScopeAll: "All entities", rwLoad: "Load proposals", rwLoading: "Loading …", rwFailed: "No proposals: {reason}", rwUnknown: "No longer known: {list}",
  rwTakeAll: "Take all proposals ({count})", rwBack: "Back to the choice",
  rwSumPairs: "{count} pairs", rwSumChosen: "{count} assigned", rwSumErrors: "{count} with an error", rwSumSuggest: "{count} with a proposal", rwSumNone: "{count} unused",
  rwColTarget: "New entity", rwColHow: "Kind", rwNoTarget: "No replacement (skip)", rwSuggested: "suggested",
  rwHow_replace: "Switch references", rwHow_both: "Statistics and ID", rwHow_statistics: "Statistics only", rwHow_id: "ID only",
  rwHowHint_replace: "Automations, scripts, scenes and dashboards then point at the new ID. Old statistics stay under the old ID.",
  rwHowHint_both: "The old statistics are attached to the new ones, the new entity gets the old ID. References stay unchanged. Reversible only from the backup.",
  rwHowHint_statistics: "Both keep their ID; references have to point at the new one. Reversible only from the backup.",
  rwHowHint_id: "The new entity takes the ID, the statistics stay separate.",
  rwErrDuplicate: "Target already taken for {name}", rwWarnGone: "Target is not working", rwWarnUnit: "Unit differs ({old} → {new})",
  rwMenuHow: "Change kind …", rwMenuSuggest: "Take the proposal", rwMenuSkip: "Skip this row",
  rwDisableOld: "Disable the old entity afterwards", rwDisableOldHint: "It is put in quarantine and can be enabled again. Nothing is removed. Not needed for \"take over the ID\": the old entity gets another ID there anyway.",
  rwChosen: "{count} pairs confirmed", rwCreate: "Create preview ({count})", rwFixFirst: "Fix the errors in the rows first.", rwManyPairs: "From 50 pairs on the preview gets slow; several runs are easier to read.",
  reason_target_duplicate: "The same new entity is chosen for several old ones.", reason_target_replaced: "The new entity is replaced itself (or replaces another one).",
});

const RW_HOWS = ["replace", "replace_statistics", "statistics", "both", "id"];
const RW_TONE = { replace: ["var(--hk-blue)", "link-variant"], replace_statistics: ["color-mix(in srgb,var(--hk-blue) 50%,var(--hk-green))", "link-plus"], statistics: ["var(--hk-green)", "chart-line"], both: ["var(--hk-violet)", "swap-horizontal"], id: ["var(--hk-amber)", "identifier"] };
const RW_KEEP = ["replace", "replace_statistics", "statistics"], RW_TAKE = ["both", "id"];

class ReplaceWizardMixin {
  rwState() {
    return (this.rw ||= { single: true, step: 1, sel: new Set(), result: null, choices: {}, scope: "", loading: false, error: "" });
  }

  // "Cancel": nothing was created, so the assistant is emptied and the person is back at the choice of a task.
  rwCancel() {
    this.rw = null; this._oneHints = null;
    this.replOld = ""; this.replNew = ""; this.replHow = ""; this.rwDisable = false;
    this.repairTask = null;
    this.render();
  }

  // From a detail page or a finding: the choice is filled in, the person lands on step 1 with it.
  rwStart(ids) {
    this.startCleanup("replace_wizard", () => { this.rw = null; const rw = this.rwState(); rw.single = false; ids.forEach(id => rw.sel.add(id)); });
  }

  // How a pair is replaced when the person has not said: statistics are carried on, otherwise references are switched.
  // Only a real meter (a total that keeps counting) takes over the history and the ID by default; for a measurement, switching the references is enough and touches no database.
  rwDefaultHow(pair) { return pair.has_statistics && pair.meter ? "replace_statistics" : "replace"; }

  rwHowsOf(pair) { return RW_HOWS.filter(h => pair.has_statistics || !["replace_statistics", "statistics", "both"].includes(h)); }

  // Only what the person chose becomes an action: a pair without a chosen target is left out.
  rwActions() {
    const rw = this.rwState();
    return Object.entries(rw.choices).filter(([, c]) => c.target).map(([object_id, c]) => (c.how && c.how !== "replace"
      ? { kind: "migrate_meter", object_id, target: c.target, mode: c.how, ...this.rwDisableFlag(c.how) }
      : { kind: "replace_references", object_id, target: c.target, ...this.rwDisableFlag(c.how) }));
  }

  // The old entity is only disabled where it keeps its ID; the modes that hand its ID over move it aside anyway.
  rwDisableFlag(how) { return this.rwDisable && !RW_TAKE.includes(how) ? { disable_old: true } : {}; }

  rwDisableSwitch() {
    return `<label class="optswitch inpanel"><input class="policyswitch" type="checkbox" role="switch" data-rw-disable ${this.rwDisable ? "checked" : ""} ${this.cleanupBusy ? "disabled" : ""}><span><strong>${this.t("rwDisableOld")}</strong><small>${this.t("rwDisableOldHint")}</small></span></label>`;
  }

  // Row problems that the panel can see before any preview: one new entity for two old ones.
  rwProblems(pair) {
    const rw = this.rwState(), choice = rw.choices[pair.object_id] || {};
    if (!choice.target) return [];
    const out = [];
    const other = (rw.result?.pairs || []).find(p => p.object_id !== pair.object_id && rw.choices[p.object_id]?.target === choice.target);
    if (other) out.push({ tone: "red", text: this.t("rwErrDuplicate", { name: other.name }) });
    const picked = this.findObject(`entity:${choice.target}`);
    if (picked && picked.status !== "active") out.push({ tone: "warn", text: this.t("rwWarnGone") });
    if (picked && (picked.unit ?? "") !== (pair.unit ?? "")) out.push({ tone: "warn", text: this.t("rwWarnUnit", { old: pair.unit || "–", new: picked.unit || "–" }) });
    return out;
  }

  rwErrorCount() {
    return (this.rwState().result?.pairs || []).filter(p => this.rwProblems(p).some(x => x.tone === "red")).length;
  }

  async rwLoadPairs() {
    const rw = this.rwState();
    if (!rw.sel.size || rw.loading) return;
    rw.loading = true; rw.error = ""; this.render();
    try {
      const msg = { type: "ha_housekeeper/entity_pairs", old_entity_ids: [...rw.sel] };
      if (rw.scope) msg.platform = rw.scope;
      rw.result = await this._hass.callWS(msg);
      for (const id of Object.keys(rw.choices)) if (!rw.result.pairs.some(p => p.object_id === id)) delete rw.choices[id];
    } catch (err) { rw.result = null; rw.error = this.t("rwFailed", { reason: this.errText(err) }); }
    rw.loading = false; this.render();
  }

  rwChoose(id, target) {
    const rw = this.rwState(), pair = (rw.result?.pairs || []).find(p => p.object_id === id);
    if (!pair) return;
    if (rw.texts) delete rw.texts[id];
    if (!target) { delete rw.choices[id]; return; }
    const kept = rw.choices[id]?.how;
    rw.choices[id] = { target, how: kept && this.rwHowsOf(pair).includes(kept) ? kept : this.rwDefaultHow(pair) };
  }

  rwTakeAll() {
    const rw = this.rwState();
    for (const pair of rw.result?.pairs || []) {
      const best = pair.candidates[0];
      if (best && best.score > 0 && !rw.choices[pair.object_id] && (pair.used || pair.has_statistics)) this.rwChoose(pair.object_id, best.object_id);
    }
  }

  async rwCreatePlan() {
    const actions = this.rwActions();
    if (!actions.length || this.rwErrorCount()) return;
    this.cleanupBusy = true; this.cleanupError = ""; this.render();
    try {
      const plan = await this._hass.callWS({ type: "ha_housekeeper/plan_create", actions });
      this.openNewPlan(plan, null);
    } catch (err) { this.cleanupError = this.errText(err); }
    this.cleanupBusy = false; this.render();
  }

  // -- step 1: choose ----------------------------------------------------------------------

  rwHeadBox() {
    const ids = this._rwVisible || [], rw = this.rwState();
    if (!ids.length) return "";
    const n = ids.filter(id => rw.sel.has(id)).length;
    return `<input type="checkbox" class="selbox" data-rw-page ${n === ids.length ? "checked" : ""} ${n && n < ids.length ? "data-partial" : ""} aria-label="${this.esc(this.t("selectPage"))}">`;
  }

  rwPickCard() {
    const rw = this.rwState();
    const all = this.data.objects.filter(o => o.object_type === "entity").map(item => ({ item, tags: this.usageTags(item.object_id) }));
    this.lvState("rwpick", "name", "asc");
    const sorts = [
      { key: "name", label: "sortName", dir: "asc", get: r => r.item.name },
      { key: "id", label: "sortId", dir: "asc", get: r => r.item.object_id },
      { key: "used", label: "rwColUsed", dir: "desc", get: r => r.tags.length },
    ];
    const domains = [...new Set(all.map(r => r.item.object_id.split(".")[0]))].sort();
    const platforms = [...new Set(all.map(r => r.item.platform).filter(Boolean))].sort();
    const filters = [
      { name: "scope", all: this.t("rwFilterScope"), options: [["used", this.t("rwFilterUsed")], ["gone", this.t("rwFilterGone")]] },
      { name: "platform", all: this.t("rwFilterPlatform"), options: platforms.map(p => [p, p]) },
      { name: "domain", all: this.t("rwFilterDomain"), options: domains.map(d => [d, d]) },
    ];
    const bar = this.listBar("rwpick", { table: true, dense: true, sorts, filters });
    const list = this.refine("rwpick", all, {
      text: r => [r.item.name, r.item.object_id, r.item.platform].join(" "),
      filters: { scope: (r, v) => (v === "used" ? r.tags.length > 0 : r.item.status !== "active"), platform: (r, v) => r.item.platform === v, domain: (r, v) => r.item.object_id.startsWith(`${v}.`) },
      sorts, tie: r => r.item.object_id,
    });
    const pg = this.paginate("rwpick", list);
    this._rwVisible = pg.rows.map(r => r.item.object_id);
    this._rwFiltered = list.map(r => r.item.object_id);
    const columns = [
      { key: "sel", label: "selectPage", narrow: true, sortable: false, allBox: () => this.rwHeadBox(),
        cell: r => `<input type="checkbox" class="selbox" data-rw-sel="${this.esc(r.item.object_id)}" ${rw.sel.has(r.item.object_id) ? "checked" : ""} aria-label="${this.esc(r.item.name)}">` },
      { key: "name", label: "rwColEntity", dir: "asc", sortKeys: ["id"], cell: r => this.nameCell(r.item.name, r.item.object_id) },
      { key: "status", label: "rwColStatus", sortable: false, cell: r => this.pill(r.item.status) },
      { key: "used", label: "rwColUsed", dir: "desc", cell: r => (r.tags.length ? `<span class="exptags">${r.tags.map(x => `<span class="tag">${this.esc(x)}</span>`).join("")}</span>` : `<small>${this.t("rwNowhere")}</small>`) },
    ];
    const table = list.length ? this.listTable("rwpick", columns, pg.rows, { cls: "objs", rowAttrs: () => 'class="static"' }) : `<div class="emptymsg">${all.length ? this.noMatches("rwpick") : this.t("rwNoEntities")}</div>`;
    const n = rw.sel.size;
    const allBtn = list.length && list.length <= 500 && list.some(r => !rw.sel.has(r.item.object_id)) ? `<button class="btn quiet" data-rw-all>${this.t("rwSelectFiltered", { count: list.length })}</button>` : "";
    return `<div class="panel ovvis"><div class="panelhead"><div><small class="fceyebrow">${this.t("rwPart", { n: 1 })}</small><h2>${this.t("rwPickTitle")}</h2><p>${this.t("rwPickHint")}</p></div><div class="actions">${this.rwSeg()}</div></div>
      <div class="toolbar${n ? "" : " nosel"}">${this.selTools("rwpick", n, "data-rw-clear")}${allBtn}<span class="toolgap"></span>
      <button class="btn primary" data-rw-next ${n ? "" : "disabled"}>${this.t("rwNext", { count: n })}</button></div>
      ${bar}${table}${pg.footer}</div>`;
  }

  // -- step 2: set up ----------------------------------------------------------------------

  // The field of one row is the standard picker (search, the likelier entities first when nothing is typed).
  rwPickerDef(id) {
    const rw = this.rwState(), pair = (rw.result?.pairs || []).find(p => p.object_id === id);
    const found = new Map((pair?.candidates || []).map((c, i) => [c.object_id, { ...c, rank: i }]));
    return {
      get: () => (rw.texts && id in rw.texts ? rw.texts[id] : rw.choices[id]?.target || ""),
      set: v => { (rw.texts ||= {})[id] = v; if (!v) delete rw.choices[id]; },
      min: 0, browse: true, types: ["entity"], limit: 30,
      sub: o => [o.object_id, found.get(o.object_id)?.rank === 0 && found.get(o.object_id).score > 0 ? this.t("rwSuggested") : "", (found.get(o.object_id)?.reasons || []).map(r => this.t(`exReason_${r}`)).join(", ")].filter(Boolean).join(" · "),
      filter: o => o.status !== "disabled" && !rw.sel.has(o.object_id) && this.sameDomain(o, id) && (!rw.scope || o.platform === rw.scope),
      rank: o => (found.has(o.object_id) ? found.get(o.object_id).rank : 99),
      pick: o => { if (rw.texts) delete rw.texts[id]; this.rwChoose(id, o.object_id); },
    };
  }

  rwTargetCell(pair) {
    const choice = this.rwState().choices[pair.object_id] || {};
    const reasons = (pair.candidates.find(c => c.object_id === choice.target)?.reasons || []).map(r => `<span class="tag">${this.esc(this.t(`exReason_${r}`))}</span>`);
    const tags = [...reasons, ...this.rwProblems(pair).map(p => `<span class="pill ${p.tone}">${this.esc(p.text)}</span>`)];
    return `${this.pickerBox(`rwt:${pair.object_id}`, this.t("rwNoTarget"))}${tags.length ? `<span class="exptags">${tags.join("")}</span>` : ""}`;
  }

  rwHowCell(pair) {
    const choice = this.rwState().choices[pair.object_id];
    if (!choice) return "";
    return `<select data-rw-how="${this.esc(pair.object_id)}" aria-label="${this.t("rwColHow")}" title="${this.esc(this.t(`rwHowHint_${choice.how}`))}">${this.rwHowsOf(pair).map(h => `<option value="${h}" ${choice.how === h ? "selected" : ""}>${this.t(`rwHow_${h}`)}</option>`).join("")}</select>`;
  }

  // The count of uses as a toggle: the person sees where an entity is used before choosing what replaces it.
  usesToggle(pair) {
    if (!pair.used) return this.esc(this.t("exUnused"));
    const open = (this.useOpen || []).includes(pair.object_id), label = this.t(open ? "rwUsesHide" : "rwUsesShow");
    return `<button type="button" class="linklike usetoggle" data-use-more="${this.esc(pair.object_id)}" aria-expanded="${open}" title="${this.esc(label)}"><ha-icon icon="mdi:chevron-${open ? "down" : "right"}"></ha-icon>${this.esc(this.t(pair.used === 1 ? "exUsedOne" : "exUsed", { count: pair.used }))}</button>`;
  }

  // The places that use an entity, one line each, and whether Housekeeper rewrites them or leaves them for a manual check.
  usesList(objectId, cap = 0) {
    const uses = this.mergePlaces(this.edgesTo(`entity:${objectId}`).filter(e => USAGE_RELATIONS.includes(e.relation)).map(e => ({ other: e.source, label: this.t(e.relation), edge: e })));
    const sure = x => (x.edge.confidence || "certain") === "certain";
    const row = x => {
      const places = x.places.filter(Boolean).map(pl => `<code>${this.esc(pl)}</code>`).join("");
      return `<li class="useitem"><span class="userole">${this.esc(x.label)}</span><span class="useplace">${places}</span><span class="pill ${sure(x) ? "ok" : "warn"}">${this.t(sure(x) ? "rwUseReplaced" : "rwUseManual")}</span></li>`;
    };
    // One head per object (an automation that uses the entity twice is named once), its places below.
    const group = list => {
      const byObj = new Map();
      for (const x of list) { if (!byObj.has(x.other)) byObj.set(x.other, []); byObj.get(x.other).push(x); }
      return [...byObj].map(([other, items]) => {
        const obj = this.findObject(other), energy = other === "dashboard:energy", name = this.esc(energy ? this.t("energyDashboard") : obj?.name || other.split(":").slice(1).join(":"));
        return `<li class="usegroup"><div class="usehead">${obj ? `<button class="linklike" data-object="${this.esc(other)}">${name}</button>` : name} <small class="muted">${this.esc(this.t(this.isHelper(obj || {}) ? "helperKind" : obj?.object_type || other.split(":")[0]))}</small></div><ul class="uselist">${items.map(row).join("")}</ul></li>`;
      }).join("");
    };
    const auto = uses.filter(sure).length, groups = [...new Set(uses.map(x => x.other))], keep = cap && groups.length > cap + 1 ? new Set(groups.slice(0, cap)) : new Set(groups);
    const shown = uses.filter(x => keep.has(x.other)), rest = uses.filter(x => !keep.has(x.other));
    const more = rest.length ? `<details class="usemore"><summary>${this.t("rwUsesMore", { n: groups.length - keep.size })}</summary><ul class="usegroups">${group(rest)}</ul></details>` : "";
    return `<ul class="usegroups">${group(shown)}</ul>${more}<p class="factnote">${this.t("rwUsesNote", { auto, manual: uses.length - auto })}</p>`;
  }

  // The row under an open pair in a list.
  usesDetail(pair, cols) {
    if (!pair.used || !(this.useOpen || []).includes(pair.object_id)) return "";
    return `<tr class="static"><td colspan="${cols}">${this.usesList(pair.object_id)}</td></tr>`;
  }

  // One entity: where the old one is used, over the full width and with every place named.
  rwOneUses() {
    if (!this.replOld) return "";
    const count = this.edgesTo(`entity:${this.replOld}`).filter(e => USAGE_RELATIONS.includes(e.relation)).length;
    if (!count) return `<div class="rwuses"><p class="factnote">${this.t("replUsedNowhere")}</p></div>`;
    return `<div class="rwuses"><p class="rwgroup">${this.t("replUsedHere")} <span class="pill mute">${this.t(count === 1 ? "exUsedOne" : "exUsed", { count })}</span></p>${this.usesList(this.replOld, 6)}</div>`;
  }

  // Candidates for the new entity: the same suggestion as in the list of several, asked once per old entity.
  // Until the answer is in (or when it fails) the simple word match answers.
  ensureOneHints() {
    const id = this.replOld, cur = this._oneHints;
    if (!id || (cur && cur.id === id)) return;
    this._oneHints = { id, list: null };
    if (!this._hass?.callWS) return;
    this._hass.callWS({ type: "ha_housekeeper/entity_pairs", old_entity_ids: [id] })
      .then(res => { if (this._oneHints?.id === id) this._oneHints.list = res?.pairs?.[0]?.candidates || []; })
      .catch(() => { if (this._oneHints?.id === id) this._oneHints.list = []; })
      .then(() => { if (this.replOld === id) this.render(); });
  }

  rwOneHints() {
    this.ensureOneHints();
    const cur = this._oneHints?.id === this.replOld ? this._oneHints : null;
    const found = (cur?.list || []).filter(c => c.score > 0 && c.object_id !== this.replOld).slice(0, 3);
    if (!found.length) return cur?.list ? this.successorHints(this.replOld, this.entityUnit(this.replOld), "data-repl-pick") : "";
    const why = c => c.reasons.map(r => this.t(`exReason_${r}`)).join(", ");
    return `<div class="setrow planfoot"><small class="u-m0">${this.t("successorHint")}</small><span class="chips">${found.map((c, i) => `<button class="chip${this.replNew === c.object_id ? " active" : ""}" data-repl-pick="${this.esc(c.object_id)}" title="${this.esc(`${c.name}${why(c) ? ` · ${why(c)}` : ""}`)}">${this.esc(c.object_id)}${i === 0 ? ` <span class="pill ok">${this.t("exSuggested")}</span>` : ""}</button>`).join("")}</span></div>`;
  }

  // The reasons why the chosen new entity was suggested, under its field.
  rwOneWhy() {
    const c = (this._oneHints?.id === this.replOld ? this._oneHints.list || [] : []).find(x => x.object_id === this.replNew);
    return c?.reasons?.length ? `<span class="exptags">${c.reasons.map(r => `<span class="tag">${this.esc(this.t(`exReason_${r}`))}</span>`).join("")}</span>` : "";
  }

  rwPairsList(pairs) {
    const rw = this.rwState();
    const sorts = [
      { key: "name", label: "rwColEntity", dir: "asc", get: p => p.name },
      { key: "used", label: "rwColUsed", dir: "desc", get: p => p.used || 0 },
    ];
    const columns = [
      { key: "name", label: "rwColEntity", dir: "asc", cell: p => this.nameCell(p.name, p.object_id) },
      { key: "used", label: "rwColUsed", dir: "desc", cell: p => this.usesToggle(p) },
      { key: "target", label: "rwColTarget", sortable: false, cell: p => this.rwTargetCell(p) },
      { key: "how", label: "rwColHow", sortable: false, cell: p => this.rwHowCell(p) },
      { key: "menu", label: "rowMenu", menu: true, narrow: true, sortable: false, cell: p => this.rowMenuHtml([
        rw.choices[p.object_id] ? ["mdi:tune-variant", "rwMenuHow", `data-rw-how-open="${this.esc(p.object_id)}"`] : null,
        p.candidates[0]?.score > 0 && !rw.choices[p.object_id] ? ["mdi:check", "rwMenuSuggest", `data-rw-suggest="${this.esc(p.object_id)}"`] : null,
        rw.choices[p.object_id] ? ["mdi:skip-next", "rwMenuSkip", `data-rw-skip="${this.esc(p.object_id)}"`] : null,
      ].filter(Boolean)) },
    ];
    return this.sysList("rwpairs", pairs, {
      sort: "name", dir: "asc", sorts, columns, cls: "pairs", empty: "exNoPairs",
      after: p => this.usesDetail(p, columns.length),
      text: p => `${p.name} ${p.object_id}`, tie: p => p.object_id,
    });
  }

  rwSetupCard() {
    const rw = this.rwState(), pairs = rw.result?.pairs || [];
    const chosen = this.rwActions().length, errors = this.rwErrorCount();
    const platforms = [...new Set(this.data.objects.filter(o => o.object_type === "entity" && o.status === "active" && o.platform && !rw.sel.has(o.object_id)).map(o => o.platform))].sort();
    const scope = `<div class="setrow"><div><label>${this.t("rwScope")}</label></div><select data-rw-scope><option value="">${this.t("rwScopeAll")}</option>${platforms.map(p => `<option value="${this.esc(p)}" ${rw.scope === p ? "selected" : ""}>${this.esc(p)}</option>`).join("")}</select></div>`;
    const suggestable = pairs.filter(p => p.candidates[0]?.score > 0 && !rw.choices[p.object_id] && (p.used || p.has_statistics)).length;
    const sum = pairs.length ? `<div class="exsum"><strong>${this.t("rwSumPairs", { count: pairs.length })}</strong><span class="pill ok">${this.t("rwSumChosen", { count: chosen })}</span>${errors ? `<span class="pill red">${this.t("rwSumErrors", { count: errors })}</span>` : ""}<span class="pill">${this.t("rwSumSuggest", { count: pairs.filter(p => p.candidates[0]?.score > 0).length })}</span><span class="pill">${this.t("rwSumNone", { count: pairs.filter(p => !p.used && !p.has_statistics).length })}</span><span class="toolgap"></span><button class="btn small" data-rw-take ${suggestable ? "" : "disabled"}>${this.t("rwTakeAll", { count: suggestable })}</button></div>` : "";
    const unknown = rw.result?.unknown?.length ? `<p class="factnote">${this.t("rwUnknown", { list: this.esc(rw.result.unknown.slice(0, 10).join(", ")) })}</p>` : "";
    const many = chosen >= 50 ? `<p class="factnote">${this.t("rwManyPairs")}</p>` : "";
    const how = Object.keys(rw.choices).length && rw.howOpen && rw.choices[rw.howOpen] ? this.rwHowCards(rw.howOpen) : "";
    const foot = `<div class="setrow planfoot"><small class="u-m0">${this.t("rwChosen", { count: chosen })} · ${this.t("repairDryRun")}${errors ? ` · ${this.t("rwFixFirst")}` : ""}</small><span class="rwfoot"><button class="btn" data-rw-back>${this.t("rwBack")}</button> <button class="btn" data-rw-cancel>${this.t("confirmCancel")}</button> <button class="btn primary" data-rw-create ${chosen && !errors && !this.cleanupBusy ? "" : "disabled"}>${this.cleanupBusy ? this.t("planCreating") : this.t("rwCreate", { count: chosen })}</button></span></div>`;
    return `<div class="panel ovvis"><div class="panelhead"><div><small class="fceyebrow">${this.t("rwPart", { n: 2 })}</small><h2>${this.t("rwSetupTitle")}</h2><p>${this.t("rwSetupHint")}</p></div></div>
      ${scope}<div class="setrow planfoot"><small class="u-m0">${this.esc(rw.error)}</small><button class="btn" data-rw-load ${rw.loading ? "disabled" : ""}>${rw.loading ? this.t("rwLoading") : this.t("rwLoad")}</button></div>
      ${sum}${rw.result ? (pairs.length ? this.rwPairsList(pairs) : `<div class="emptymsg">${this.t("exNoPairs")}</div>`) : ""}${how}${unknown}${many}${this.rwDisableSwitch()}${foot}</div>`;
  }

  // The kinds as cards for one pair, opened from its menu; picking one closes them.
  rwHowCards(id) {
    const rw = this.rwState(), pair = rw.result.pairs.find(p => p.object_id === id);
    if (!pair) return "";
    const choice = rw.choices[id];
    const cards = this.rwHowsOf(pair).map(h => `<button class="modecard${choice.how === h ? " on" : ""}" role="radio" aria-checked="${choice.how === h}" data-rw-how-pick="${h}"><strong>${this.t(`rwHow_${h}`)}${h === this.rwDefaultHow(pair) ? ` <span class="pill ok">${this.t("meterUsual")}</span>` : ""}</strong><small>${this.t(`rwHowHint_${h}`)}</small></button>`).join("");
    return `<div class="setrow"><div><label>${this.esc(pair.name)}</label></div></div><div class="modecards" role="radiogroup" aria-label="${this.esc(this.t("rwColHow"))}">${cards}</div>`;
  }

  rwCard() {
    const rw = this.rwState();
    return rw.single ? this.rwOneCard() : rw.step === 2 ? this.rwSetupCard() : this.rwPickCard();
  }

  // -- one entity: the same assistant for a single pair ------------------------------------

  rwSeg() {
    const one = this.rwState().single;
    return `<div class="seg" role="group" aria-label="${this.esc(this.t("repairTaskWizard"))}">${[["one", "rwModeOne", one], ["many", "rwModeMany", !one]].map(([v, k, on]) => `<button class="chip ${on ? "active" : ""}" data-rw-mode="${v}" aria-pressed="${on}">${this.t(k)}</button>`).join("")}</div>`;
  }

  // What the panel can say before a preview: which kinds fit this pair (the reason stands on the card that does not), and the one that is chosen.
  rwOneInfo() {
    const old = this.replOld && this.findObject(`entity:${this.replOld}`), nu = this.replNew && this.findObject(`entity:${this.replNew}`);
    const checks = this.replaceChecks(this.replOld, this.replNew), known = Boolean(old && nu), off = {};
    for (const id of RW_HOWS) {
      off[id] = "";
      if (!known) continue;
      if (checks.bad) off[id] = "rwOffPair";
      else if (["replace", "replace_statistics"].includes(id) && !this.usageTags(this.replOld).length) off[id] = "rwOffUnused";
      else if (id !== "replace") {
        if (!old.has_statistics && id !== "id") off[id] = "rwOffNoStats";
        else if ((old.unit ?? "") !== (nu.unit ?? "") || (old.device_class ?? "") !== (nu.device_class ?? "")) off[id] = "rwOffUnit";
      }
    }
    const meter = Boolean(old?.has_statistics && ["total", "total_increasing"].includes(old.state_class));
    const usual = (meter ? ["replace_statistics", "statistics"] : []).find(id => !off[id]) || "replace";
    return { known, checks, off, usual, how: this.replHow && !off[this.replHow] ? this.replHow : usual };
  }

  rwOneActions() {
    const { how } = this.rwOneInfo();
    const flag = this.rwDisableFlag(how);
    return [how === "replace" ? { kind: "replace_references", object_id: this.replOld, target: this.replNew, ...flag } : { kind: "migrate_meter", object_id: this.replOld, target: this.replNew, mode: how, ...flag }];
  }

  rwOneCard() {
    const info = this.rwOneInfo(), { checks, off, how, usual, known } = info;
    const tile = id => `<button class="modecard mc${how === id ? " on" : ""}${off[id] ? " off" : ""}" style="--mc:${RW_TONE[id][0]}" role="radio" aria-checked="${how === id}" ${off[id] ? 'aria-disabled="true" data-off' : ""} data-rw-one-how="${id}"><span class="mcico"><ha-icon icon="mdi:${RW_TONE[id][1]}" aria-hidden="true"></ha-icon></span><strong>${this.t(`rwHow_${id}`)}${known && id === usual ? ` <span class="pill ok">${this.t("meterUsual")}</span>` : ""}</strong><small>${this.t(`rwHowHint_${id}`)}</small>${off[id] ? `<small class="modefollow">${this.t(off[id])}</small>` : ""}</button>`;
    const group = (key, ids) => `<p class="rwgroup">${this.t(key)}</p><div class="modecards" role="radiogroup" aria-label="${this.esc(this.t(key))}">${ids.map(tile).join("")}</div>`;
    const result = known && !checks.bad ? `<p class="factnote rwresult"><strong>${this.t("rwResultLabel")}</strong> ${this.t(`rwResult_${how}`, { old: this.esc(this.replOld), new: this.esc(this.replNew) })}</p>` : "";
    const ready = this.replOld && this.replNew && !this.cleanupBusy && !checks.bad && !off[how];
    const hints = this.rwOneHints();
    return `<div class="panel ovvis"><div class="panelhead"><div><h2>${this.t("repairTaskWizard")}</h2><p>${this.t("rwOneHint")}</p></div><div class="actions">${this.rwSeg()}</div></div>
      <div class="exgrid two"><div><label>${this.t("replaceOld")}</label>${this.pickerBox("replOld", "sensor.old_entity")}</div><ha-icon icon="mdi:arrow-right" aria-hidden="true"></ha-icon><div><label>${this.t("replaceNew")}</label>${this.pickerBox("replNew", "sensor.new_entity")}${this.rwOneWhy()}${checks.fit}</div></div>
      ${hints}${this.rwOneUses()}${group("rwGroupKeep", RW_KEEP)}${group("rwGroupTake", RW_TAKE)}${result}${this.rwDisableSwitch()}
      <div class="setrow planfoot"><small class="u-m0">${this.t("repairDryRun")}</small><span class="rwfoot"><button class="btn" data-rw-cancel>${this.t("confirmCancel")}</button> <button class="btn primary" data-plan-create ${ready ? "" : "disabled"}>${this.cleanupBusy ? this.t("planCreating") : this.t("replacePreview")}</button></span></div></div>`;
  }

  bindReplaceWizard(root) {
    const rw = () => this.rwState();
    root.querySelectorAll("[data-rw-sel]").forEach(el => el.onchange = () => { this.pickRows("rw", el.dataset.rwSel, el.checked, rw().sel, this._rwVisible); this.render(); });
    root.querySelector("[data-rw-page]")?.addEventListener("change", ev => { (this._rwVisible || []).forEach(id => (ev.target.checked ? rw().sel.add(id) : rw().sel.delete(id))); this.render(); });
    const pageBox = root.querySelector("[data-rw-page]"); if (pageBox) pageBox.indeterminate = pageBox.hasAttribute("data-partial");
    root.querySelector("[data-rw-all]")?.addEventListener("click", () => { (this._rwFiltered || []).forEach(id => rw().sel.add(id)); this.render(); });
    root.querySelector("[data-rw-clear]")?.addEventListener("click", () => { rw().sel.clear(); this.render(); });
    root.querySelector("[data-rw-next]")?.addEventListener("click", () => { rw().step = 2; this.rwLoadPairs(); });
    root.querySelectorAll("[data-rw-disable]").forEach(el => el.onchange = () => { this.rwDisable = el.checked; this.render(); });
    root.querySelector("[data-rw-cancel]")?.addEventListener("click", () => this.rwCancel());
    root.querySelector("[data-rw-back]")?.addEventListener("click", () => { rw().step = 1; this.render(); });
    root.querySelector("[data-rw-load]")?.addEventListener("click", () => this.rwLoadPairs());
    root.querySelector("[data-rw-scope]")?.addEventListener("change", ev => { rw().scope = ev.target.value; this.rwLoadPairs(); });
    root.querySelector("[data-rw-take]")?.addEventListener("click", () => { this.rwTakeAll(); this.render(); });
    root.querySelector("[data-rw-create]")?.addEventListener("click", () => this.rwCreatePlan());
    root.querySelectorAll("[data-rw-how]").forEach(el => el.onchange = () => { const c = rw().choices[el.dataset.rwHow]; if (c) c.how = el.value; this.render(); });
    root.querySelectorAll("[data-rw-suggest]").forEach(el => el.onclick = () => { const p = (rw().result?.pairs || []).find(x => x.object_id === el.dataset.rwSuggest); if (p?.candidates[0]) this.rwChoose(p.object_id, p.candidates[0].object_id); this.render(); });
    root.querySelectorAll("[data-rw-skip]").forEach(el => el.onclick = () => { this.rwChoose(el.dataset.rwSkip, ""); this.render(); });
    root.querySelectorAll("[data-rw-how-open]").forEach(el => el.onclick = () => { rw().howOpen = el.dataset.rwHowOpen; this.render(); });
    root.querySelectorAll("[data-rw-how-pick]").forEach(el => el.onclick = () => { const c = rw().choices[rw().howOpen]; if (c) c.how = el.dataset.rwHowPick; rw().howOpen = ""; this.render(); });
    root.querySelectorAll("[data-rw-mode]").forEach(el => el.onclick = () => { rw().single = el.dataset.rwMode === "one"; this.render(); });
    root.querySelectorAll("[data-rw-one-how]").forEach(el => el.onclick = () => { if (el.hasAttribute("data-off")) return; this.replHow = el.dataset.rwOneHow; this.render(); });
    root.querySelectorAll("[data-act-replace-many]").forEach(el => el.onclick = () => this.rwStart([el.dataset.actReplaceMany]));
  }
}
