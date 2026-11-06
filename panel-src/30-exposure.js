// ExposureMixin: which entities assistants and bridges can reach; mixed into the panel in 99-register.js.
const EXPO_DOMAIN_ICONS = {
  light: "mdi:lightbulb-outline", switch: "mdi:toggle-switch-outline", sensor: "mdi:eye-outline", binary_sensor: "mdi:radiobox-marked", climate: "mdi:thermostat",
  cover: "mdi:window-shutter", media_player: "mdi:play-box-outline", lock: "mdi:lock-outline", fan: "mdi:fan", scene: "mdi:palette-outline", script: "mdi:script-text-outline",
  automation: "mdi:robot-outline", input_boolean: "mdi:toggle-switch-variant-outline", button: "mdi:gesture-tap-button", camera: "mdi:cctv", vacuum: "mdi:robot-vacuum",
  humidifier: "mdi:air-humidifier", water_heater: "mdi:water-boiler", alarm_control_panel: "mdi:shield-home-outline", number: "mdi:numeric", select: "mdi:format-list-bulleted",
  weather: "mdi:weather-partly-cloudy", remote: "mdi:remote", valve: "mdi:valve", siren: "mdi:bullhorn-outline", todo: "mdi:clipboard-list-outline", person: "mdi:account-outline",
};

// The findings that offer a plan: what it does and the name of its button.
const EXPO_PLAN_KINDS = {
  stale_exposed: { target: "remove", label: "expoActRemove" },
  diagnostic_exposed: { target: "remove", label: "expoActRemove" },
  sensitive_exposed: { target: "remove", label: "expoActRemove" },
  google_without_pin: { target: "pin", label: "expoActPin" },
  auto_expose: { target: "off", label: "expoActNewOff", kind: "set_expose_new" },
};

// What the three dots of an entity row offer: one entity at a time for the sensitive ones, a jump to Home Assistant for voice names.
const EXPO_ROW_MENU = {
  diagnostic_exposed: (item, esc) => [["mdi:shield-off-outline", "expoActRemoveOne", `data-expo-one="${esc(item.entity_id)}"`]],
  sensitive_exposed: (item, esc) => [["mdi:shield-off-outline", "expoActRemoveOne", `data-expo-one="${esc(item.entity_id)}"`]],
  alias_duplicate: () => [["mdi:open-in-new", "expoOpenNames", 'data-ha-path="/config/voice-assistants/expose"']],
};

// The sources whose exposures Housekeeper can take back; a bridge (HomeKit) keeps its filter in its own settings.
const EXPO_ASSISTANTS = ["conversation", "cloud.alexa", "cloud.google_assistant"];

class ExposureMixin {
  // The ticked entities of the list of one assistant.
  expoSelOf(sourceId) { return ((this.expoSel ||= {})[sourceId] ||= new Set()); }

  expoSelBox(sourceId, e) {
    return `<input type="checkbox" class="selbox" data-expo-sel="${this.esc(`${sourceId}|${e.entity_id}`)}" ${this.expoSelOf(sourceId).has(e.entity_id) ? "checked" : ""} aria-label="${this.esc(e.name)}">`;
  }

  // The box in the head of the column ticks the entities of the page, as in the inventory.
  expoHeadBox(sourceId, pageRows) {
    const ids = pageRows.map(e => e.entity_id), sel = this.expoSelOf(sourceId), n = ids.filter(id => sel.has(id)).length;
    return ids.length ? `<input type="checkbox" class="selbox" data-expo-sel-page="${this.esc(sourceId)}" ${n === ids.length ? "checked" : ""} ${n && n < ids.length ? "data-partial" : ""} aria-label="${this.esc(this.t("selectPage"))}">` : "";
  }

  // The bar over the table, as over the inventory: how many are ticked and what can be done with them.
  expoSelBar(source, rows) {
    const sel = this.expoSelOf(source.id), n = sel.size, over = n > MAX_PLAN_ACTIONS, busy = this.planBusy ? 'disabled aria-busy="true"' : "";
    const btn = `<button class="btn" data-expo-sel-plan="${this.esc(source.id)}" ${n ? busy : "disabled"}><ha-icon icon="mdi:shield-off-outline"></ha-icon>${this.t("expoActRemoveFrom", { name: this.esc(source.label) })}</button>`;
    return `<div class="toolbar${n ? "" : " nosel"}"><button class="btn quiet" data-expo-sel-all="${this.esc(source.id)}" ${rows.length ? "" : "disabled"}>${this.t("stateAllFiltered", { count: this.formatNumber(rows.length) })}</button><button class="btn quiet" data-expo-sel-clear="${this.esc(source.id)}" ${n ? "" : "disabled"}>${this.t("stateClear")}</button><span class="selcount" role="status">${this.t("stateSel", { count: n })}</span><span class="toolgap"></span><div class="fbtns">${btn}</div>${this.viewCount(rows.length)}</div>${over ? `<p class="factnote">${this.t("purgeChunk", { max: MAX_PLAN_ACTIONS, n, rest: n - MAX_PLAN_ACTIONS })}</p>` : ""}`;
  }

  bindExpoSel(root) {
    root.querySelectorAll("[data-expo-sel]").forEach(el => {
      el.onclick = ev => ev.stopPropagation();
      el.onchange = () => { const [src, id] = el.dataset.expoSel.split("|"); this.expoSelOf(src)[el.checked ? "add" : "delete"](id); this.render(); };
    });
    const page = root.querySelector("[data-expo-sel-page]");
    if (page) {
      page.indeterminate = page.hasAttribute("data-partial");
      page.onchange = () => { const src = page.dataset.expoSelPage, sel = this.expoSelOf(src); for (const id of this._expoPage?.[src] || []) sel[page.checked ? "add" : "delete"](id); this.render(); };
    }
    root.querySelector("[data-expo-sel-all]")?.addEventListener("click", ev => { const src = ev.currentTarget.dataset.expoSelAll, sel = this.expoSelOf(src); for (const id of this._expoRows?.[src] || []) sel.add(id); this.render(); });
    root.querySelector("[data-expo-sel-clear]")?.addEventListener("click", ev => { this.expoSelOf(ev.currentTarget.dataset.expoSelClear).clear(); this.render(); });
    root.querySelector("[data-expo-sel-plan]")?.addEventListener("click", ev => this.makeExposureFrom(ev.currentTarget.dataset.expoSelPlan));
    root.querySelectorAll("[data-expo-from]").forEach(el => el.addEventListener("click", () => { const [src, id] = el.dataset.expoFrom.split("|"); this.makeExposureFrom(src, [id]); }));
  }

  // A plan that takes the ticked entities (or one) out of the one assistant whose list is open; the others keep them.
  async makeExposureFrom(sourceId, ids) {
    const chosen = ids || [...this.expoSelOf(sourceId)], list = chosen.slice(0, MAX_PLAN_ACTIONS);
    if (!list.length) return;
    try {
      if (!await this.newPlan(list.map(object_id => ({ kind: "set_exposure", object_id, target: "remove", assistants: [sourceId] })))) return;
      if (!ids) this.expoSelOf(sourceId).clear();
      if (!ids) for (const id of chosen.slice(MAX_PLAN_ACTIONS)) this.expoSelOf(sourceId).add(id);
      this._exposureRequested = false;
    } catch (err) { this.failed(err); }
    this.render();
  }

  // One entity out of its assistants, as a plan of its own: the sensitive ones are never taken out in bulk.
  async makeExposureOne(entityId) {
    try {
      if (!await this.newPlan([{ kind: "set_exposure", object_id: entityId, target: "remove" }])) return;
      this._exposureRequested = false;
    } catch (err) { this.failed(err); }
    this.render();
  }

  // A plan for the entities of one finding; Housekeeper reads the live state again and judges each one.
  async makeExposurePlan(kind) {
    const f = this.exposure?.findings.find(x => x.kind === kind), spec = EXPO_PLAN_KINDS[kind];
    const actions = spec?.kind === "set_expose_new"
      ? (f?.assistants || []).map(object_id => ({ kind: spec.kind, object_id, target: spec.target }))
      : (f?.items || []).slice(0, MAX_PLAN_ACTIONS).map(i => ({ kind: "set_exposure", object_id: i.entity_id, target: spec.target }));
    if (!spec || !actions.length) return;
    try {
      if (!await this.newPlan(actions)) return;
      this._exposureRequested = false; // the view reads again when it is opened next
    } catch (err) { this.failed(err); }
    this.render();
  }

  // The line under the name of an action in a plan.
  expoPlanSub(a) {
    if (a.kind === "set_expose_new") return this.t("expoPlanNewOff");
    const what = a.target === "pin" ? this.t("expoPlanPin") : this.t("expoPlanRemove", { list: this.expoAssistantList(a.assistants) || "?" });
    return `${a.object_id} · ${what}`;
  }

  async loadExposure() {
    this.exposureLoading = true; this.exposureError = ""; this.render();
    try { this.exposure = await this._hass.callWS({ type: "ha_housekeeper/exposure" }); this.exposureAt = new Date().toISOString(); this.expoSel = {}; }
    catch (err) { this.exposureError = this.errText(err); }
    this.exposureLoading = false; this.render();
  }

  // Loads on the first visit; a refresh button reloads. The query is cheap and only reads registries.
  ensureExposure() {
    if (this.exposureLoading || this._exposureRequested) return;
    this._exposureRequested = true;
    setTimeout(() => this.loadExposure(), 0);
  }

  // The tile of an entity row: the symbol of its domain, so the row reads as an entity and not as something that unfolds.
  expoTile(entityId, tone = "mute") {
    const icon = EXPO_DOMAIN_ICONS[String(entityId).split(".")[0]] || ICONS.entity;
    return `<span class="tile ${tone}"><ha-icon icon="${icon}"></ha-icon></span>`;
  }

  expoAssistantName(id) {
    return this.t(`expoName_${id.replace(/\./g, "_")}`);
  }

  expoAssistantList(ids) {
    return (ids || []).map(id => this.expoAssistantName(id)).join(", ");
  }

  expoFindingText(f) {
    return this.t(`expoText_${f.kind}`, { n: this.formatNumber(f.count), alias: f.alias || "", assistant: f.assistant ? this.expoAssistantName(f.assistant) : "", domain: f.domain || "", list: this.expoAssistantList(f.assistants), reach: this.formatNumber(f.reach || 0) });
  }

  // One finding as a fold: the head always shows, the entities (a table of their own, with search, sorting and pages) and the advice only when open.
  expoFindingRows(f) {
    const tone = f.level === "warn" ? "warn" : "mute";
    const items = (f.items || []).map(item => {
      const obj = this.findObject(`entity:${item.entity_id}`);
      return { ...item, domain: item.entity_id.split(".")[0], area: obj ? this.areaName(obj) : "" };
    });
    const act = EXPO_PLAN_KINDS[f.kind] && (items.length || f.assistants?.length) ? `<button type="button" class="btn" data-expo-plan="${f.kind}" ${this.planBusy ? 'disabled aria-busy="true"' : ""}><ha-icon icon="mdi:shield-edit-outline"></ha-icon>${this.t(EXPO_PLAN_KINDS[f.kind].label)}</button>` : "";
    const table = items.length ? this.sysList(`expofind_${f.kind}`, items, {
      lead: act, sort: "name", tie: item => item.entity_id, empty: "expoNone",
      sorts: [
        { key: "name", label: "expoColName", dir: "asc", get: item => item.name || item.entity_id },
        { key: "domain", label: "expoColDomain", dir: "asc", get: item => item.domain },
        { key: "area", label: "expoColArea", dir: "asc", get: item => item.area },
      ],
      text: item => [item.name, item.entity_id, item.area, ...(item.assistants || [])].join(" "),
      rowAttrs: item => `data-object="entity:${this.esc(item.entity_id)}" tabindex="0" role="button" aria-label="${this.esc(item.name || item.entity_id)}"`,
      columns: [
        { key: "name", label: "expoColName", dir: "asc", cell: item => `<div class="statcell">${this.expoTile(item.entity_id)}<div>${this.nameCell(item.name || item.entity_id, item.entity_id)}</div></div>` },
        { key: "domain", label: "expoColDomain", dir: "asc", cell: item => this.esc(item.domain) },
        { key: "area", label: "expoColArea", dir: "asc", cell: item => (item.area ? this.esc(item.area) : `<span class="muted">—</span>`) },
        { key: "assistants", label: "expoColAssistants", sortable: false, cell: item => (item.assistants?.length ? this.esc(this.expoAssistantList(item.assistants)) : `<span class="muted">—</span>`) },
        ...(EXPO_ROW_MENU[f.kind] ? [{ key: "menu", label: "rowMenu", menu: true, narrow: true, sortable: false, cell: item => this.rowMenuHtml(EXPO_ROW_MENU[f.kind](item, v => this.esc(v))) }] : []),
      ],
    }) : "";
    const agents = f.integrations?.length ? this.sysList(`expofind_${f.kind}`, f.integrations, {
      sort: "name", tie: i => i.entry_id, empty: "expoNone",
      sorts: [{ key: "name", label: "expoColIntegration", dir: "asc", get: i => i.title || i.domain }],
      text: i => [i.title, i.domain].join(" "),
      rowAttrs: i => `data-ha-path="${this.esc(`/config/integrations/integration/${encodeURIComponent(i.domain)}`)}" tabindex="0" role="link" aria-label="${this.esc(i.title || i.domain)}"`,
      columns: [
        { key: "name", label: "expoColIntegration", dir: "asc", cell: i => this.nameCell(i.title || i.domain, i.domain) },
        { key: "target", label: "expoColTarget", sortable: false, cell: i => this.esc(this.t(`expoTarget_${i.target}`)) },
      ],
    }) : "";
    const more = items.length && f.count > items.length ? `<p class="factnote">${this.t("expoMore", { n: this.formatNumber(f.count - items.length) })}</p>` : "";
    const body = `<p class="factnote foldadvice">${this.t(`expoAdvice_${f.kind}`)}</p>${items.length ? "" : act ? `<div class="toolbar"><span class="toolgap"></span>${act}</div>` : ""}${table}${agents}${more}`;
    const head = { tone, title: this.t(`expoKind_${f.kind}`), sub: this.expoFindingText(f), pill: this.t(f.level === "warn" ? "expoWarn" : "expoHint2") };
    return this.fold(`expo_${f.kind}`, head, body, false);
  }

  expoSection(titleKey, list) {
    return list.length ? `<h3 class="expohd">${this.t(titleKey)}</h3>${list.map(f => this.expoFindingRows(f)).join("")}` : "";
  }

  // Voice assistants and bridges as one list: id, name, state and how many entities each one reaches.
  expoSources(r) {
    const list = r.assistants.map(a => ({ id: a.id, label: this.expoAssistantName(a.id), status: a.status, count: a.exposed }));
    const kinds = {};
    for (const b of r.bridges) {
      const kind = (kinds[b.kind] ||= { id: b.kind, label: this.expoAssistantName(b.kind), status: "ok", count: 0, titles: [] });
      kind.count += b.exposed; kind.titles.push(b.title);
    }
    return [...list, ...Object.values(kinds)];
  }

  // The entities one assistant or bridge can reach, as a table: sortable, filterable by domain and by the other assistants; a row opens the entity.
  expoSourceTab(r, source) {
    const id = `expo_${source.id}`;
    const all = (r.exposed_entities || []).filter(e => e.assistants.includes(source.id)).map(e => {
      const obj = this.findObject(`entity:${e.entity_id}`);
      return { ...e, domain: e.entity_id.split(".")[0], area: obj ? this.areaName(obj) : "", others: e.assistants.filter(x => x !== source.id) };
    });
    this.lvState(id, "name", "asc");
    const domains = [...new Set(all.map(e => e.domain))].sort();
    const others = [...new Set(all.flatMap(e => e.others))].sort();
    const sorts = [
      { key: "name", label: "expoColName", dir: "asc", get: e => e.name },
      { key: "domain", label: "expoColDomain", dir: "asc", get: e => e.domain },
      { key: "area", label: "expoColArea", dir: "asc", get: e => e.area },
      { key: "also", label: "expoColAlso", dir: "desc", get: e => e.others.length },
    ];
    const bar = all.length ? this.listBar(id, { table: true, dense: true, sorts, filters: [
      { name: "domain", all: this.t("expoAllDomains"), options: domains.map(d => [d, d]) },
      ...(others.length ? [{ name: "also", all: this.t("expoAllAlso"), options: others.map(o => [o, this.expoAssistantName(o)]) }] : []),
    ] }) : "";
    const rows = all.length ? this.refine(id, all, { text: e => [e.name, e.entity_id, e.area].join(" "), filters: { domain: (e, v) => e.domain === v, also: (e, v) => e.others.includes(v) }, sorts, tie: e => e.entity_id }) : [];
    const pg = this.paginate(id, rows);
    const editable = EXPO_ASSISTANTS.includes(source.id);
    (this._expoRows ||= {})[source.id] = rows.map(e => e.entity_id);
    (this._expoPage ||= {})[source.id] = pg.rows.map(e => e.entity_id);
    const columns = [
      ...(editable ? [{ key: "sel", label: "selectPage", narrow: true, sortable: false, allBox: () => this.expoHeadBox(source.id, pg.rows), cell: e => this.expoSelBox(source.id, e) }] : []),
      { key: "name", label: "expoColName", dir: "asc", cell: e => `<div class="statcell">${this.expoTile(e.entity_id)}<div>${this.nameCell(e.name, e.entity_id)}</div></div>` },
      { key: "domain", label: "expoColDomain", dir: "asc", cell: e => this.esc(e.domain) },
      { key: "area", label: "expoColArea", dir: "asc", cell: e => e.area ? this.esc(e.area) : `<span class="muted">—</span>` },
      { key: "also", label: "expoColAlso", dir: "desc", cell: e => e.others.length ? this.esc(this.expoAssistantList(e.others)) : `<span class="muted">—</span>` },
      ...(editable ? [{ key: "menu", label: "rowMenu", menu: true, narrow: true, sortable: false, cell: e => this.rowMenuHtml([["mdi:shield-off-outline", "expoActRemoveOne", `data-expo-from="${this.esc(`${source.id}|${e.entity_id}`)}"`]]) }] : []),
    ];
    const table = rows.length ? this.listTable(id, columns, pg.rows, { cls: "expo", rowAttrs: e => `data-object="entity:${this.esc(e.entity_id)}" tabindex="0" role="button" aria-label="${this.esc(e.name)}"` }) : "";
    const none = all.length && !rows.length ? `<div class="emptymsg">${this.noMatches(id)}</div>` : "";
    const where = source.titles?.length ? ` (${this.esc(source.titles.join(", "))})` : "";
    const capped = r.exposed_total > (r.exposed_entities || []).length ? `<p class="factnote">${this.t("expoCapped", { n: this.formatNumber(r.exposed_entities.length) })}</p>` : "";
    const empty = all.length ? "" : `<div class="emptymsg">${this.t(source.status === "inactive" ? "expoInactiveText" : "expoNoneFor")}</div>`;
    return `<div class="panel"><div class="panelhead"><div><h2>${this.esc(source.label)}${where}</h2><p>${this.t("expoSourceHint", { n: this.formatNumber(source.count), name: this.esc(source.label) })}</p></div></div>${bar}${none}${empty}${editable && rows.length ? this.expoSelBar(source, rows) : ""}${table}${pg.footer}${capped}</div>`;
  }

  exposureView() {
    this.ensureExposure();
    const r = this.exposure;
    const head = this.pageBar({ at: this.exposureAt, loading: this.exposureLoading, attr: "data-expo-refresh" });
    if (this.exposureError) return `<div class="stack">${head}<div class="panel">${this.notice("err", this.exposureError)}</div></div>`;
    if (!r) return `<div class="stack">${head}<div class="panel">${this.skeleton("expoLoading")}</div></div>`;
    const sources = this.expoSources(r);
    const live = sources.filter(x => x.status === "ok");
    const warn = r.findings.filter(f => f.level === "warn").length;
    const tabs = [
      { id: "findings", icon: "mdi:shield-alert-outline", label: this.t("expoTabFindings"), hint: this.t("expoTileFindingsHint"), count: r.findings.length, tone: warn ? "warn" : "ok" },
      ...sources.map(x => x.status === "ok"
        ? { id: x.id, icon: "mdi:microphone-outline", label: x.label, hint: this.t("expoTileSourceHint", { n: this.formatNumber(x.count) }), count: x.count, tone: "ok" }
        : { id: x.id, icon: "mdi:microphone-off", label: x.label, hint: this.t(x.status === "inactive" ? "expoInactive" : x.status === "off" ? "expoOff" : "expoUnavailable"), disabled: true }),
    ];
    const open = this.viewTabOf("exposure", tabs.filter(x => !x.disabled), r.findings.length || !live.length ? "findings" : live[0].id);
    let body;
    if (open === "findings") {
      const rows = r.findings.length ? this.expoSection("expoToCheck", r.findings.filter(f => f.level === "warn")) + this.expoSection("expoToNote", r.findings.filter(f => f.level !== "warn")) : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("expoNone")}</div>`;
      body = `<div class="panel">${rows}${this.howCounted("expoFootnote")}</div>`;
    } else body = this.expoSourceTab(r, sources.find(x => x.id === open));
    return `<div class="stack">${head}${this.navTiles("exposure", tabs, open, this.t("exposure"), true)}${body}</div>`;
  }
}
