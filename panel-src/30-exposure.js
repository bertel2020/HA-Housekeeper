// ExposureMixin: which entities assistants and bridges can reach; mixed into the panel in 99-register.js.
class ExposureMixin {
  async loadExposure() {
    this.exposureLoading = true; this.exposureError = ""; this.render();
    try { this.exposure = await this._hass.callWS({ type: "ha_housekeeper/exposure" }); }
    catch (err) { this.exposureError = err?.message || String(err); }
    this.exposureLoading = false; this.render();
  }

  // Loads on the first visit; a refresh button reloads. The query is cheap and only reads registries.
  ensureExposure() {
    if (this.exposureLoading || this._exposureRequested) return;
    this._exposureRequested = true;
    setTimeout(() => this.loadExposure(), 0);
  }

  expoAssistantName(id) {
    return this.t(`expoName_${id.replace(/\./g, "_")}`);
  }

  expoAssistantList(ids) {
    return (ids || []).map(id => this.expoAssistantName(id)).join(", ");
  }

  expoFindingText(f) {
    return this.t(`expoText_${f.kind}`, { n: this.formatNumber(f.count), alias: f.alias || "", assistant: f.assistant ? this.expoAssistantName(f.assistant) : "", domain: f.domain || "" });
  }

  expoFindingRows(f) {
    const tone = f.level === "warn" ? "warn" : "mute";
    const pill = `<span class="pill ${tone}">${this.t(f.level === "warn" ? "expoWarn" : "expoHint2")}</span>`;
    const head = `<div class="row"><span class="tile ${tone}"><ha-icon icon="mdi:shield-search"></ha-icon></span><span class="row-text"><strong>${this.t(`expoKind_${f.kind}`)}</strong><small>${this.esc(this.expoFindingText(f))}</small><small>${this.t(`expoAdvice_${f.kind}`)}</small></span>${pill}</div>`;
    const q = (this.lv.exposure?.q || "").trim().toLowerCase();
    const matching = (f.items || []).filter(item => !q || [item.name, item.entity_id, ...(item.assistants || [])].join(" ").toLowerCase().includes(q));
    const shown = matching.slice(0, q ? 50 : 10);
    const rows = shown.map(item => `<button class="row" data-object="entity:${this.esc(item.entity_id)}"><span class="tile mute"><ha-icon icon="mdi:chevron-right"></ha-icon></span><span class="row-text"><strong>${this.esc(item.name || item.entity_id)}</strong><small>${this.esc(item.entity_id)}${item.assistants?.length ? ` · ${this.esc(this.expoAssistantList(item.assistants))}` : ""}</small></span></button>`).join("");
    const left = q ? matching.length - shown.length : f.count - shown.length;
    const more = left > 0 ? `<p class="factnote">${this.t("expoMore", { n: this.formatNumber(left) })}</p>` : "";
    return head + rows + more;
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

  // The entities one assistant or bridge can reach, searchable; a click opens the entity.
  expoSourceTab(r, source) {
    const all = (r.exposed_entities || []).filter(e => e.assistants.includes(source.id));
    const found = this.searchList(`expo_${source.id}`, all, e => [e.name, e.entity_id].join(" "));
    const pg = this.paginate(`expo_${source.id}`, found.rows);
    const rows = pg.rows.map(e => {
      const others = e.assistants.filter(id => id !== source.id);
      return `<button class="row" data-object="entity:${this.esc(e.entity_id)}"><span class="tile mute"><ha-icon icon="mdi:chevron-right"></ha-icon></span><span class="row-text"><strong>${this.esc(e.name)}</strong><small>${this.esc(e.entity_id)}${others.length ? ` · ${this.esc(this.t("expoAlso", { list: this.expoAssistantList(others) }))}` : ""}</small></span></button>`;
    }).join("");
    const where = source.titles?.length ? ` (${this.esc(source.titles.join(", "))})` : "";
    const capped = r.exposed_total > (r.exposed_entities || []).length ? `<p class="factnote">${this.t("expoCapped", { n: this.formatNumber(r.exposed_entities.length) })}</p>` : "";
    const empty = all.length ? "" : `<div class="emptymsg">${this.t(source.status === "inactive" ? "expoInactiveText" : "expoNoneFor")}</div>`;
    return `<div class="panel"><div class="panelhead"><div><h2>${this.esc(source.label)}${where}</h2><p>${this.t("expoSourceHint", { n: this.formatNumber(source.count), name: this.esc(source.label) })}</p></div></div>${found.bar}${found.none}${empty}${rows}${pg.footer}${capped}</div>`;
  }

  exposureView() {
    this.ensureExposure();
    const r = this.exposure;
    const head = `<div class="panelhead"><div><h2>${this.t("expoTitle")}</h2><p>${this.t("expoHint")}</p></div><div class="actions"><button class="btn" data-expo-refresh ${this.exposureLoading ? "disabled" : ""}>${this.t("relRefresh")}</button></div></div>`;
    if (this.exposureError) return `<div class="panel">${head}<div class="error">${this.esc(this.exposureError)}</div></div>`;
    if (!r) return `<div class="panel">${head}${this.skeleton("expoLoading")}</div>`;
    const sources = this.expoSources(r);
    const live = sources.filter(x => x.status === "ok");
    const warn = r.findings.filter(f => f.level === "warn").length;
    const tiles = this.sumTiles([
      { label: this.t("expoSumFindings"), value: this.formatNumber(r.findings.length), tone: warn ? "warn" : r.findings.length ? "mute" : "ok", tab: "exposure|findings" },
      ...sources.map(x => ({
        label: x.label,
        value: x.status === "ok" ? this.formatNumber(x.count) : "–",
        sub: x.status === "ok" ? this.t("expoSumEntities") : this.t(x.status === "inactive" ? "expoInactive" : "expoUnavailable"),
        tone: x.status === "ok" ? "ok" : x.status === "inactive" ? "mute" : "warn",
        tab: x.status === "ok" ? `exposure|${x.id}` : "",
      })),
    ]);
    const tabs = [
      { id: "findings", label: this.t("expoTabFindings"), count: r.findings.length, tone: warn ? "warn" : "ok" },
      ...live.map(x => ({ id: x.id, label: x.label, count: x.count })),
    ];
    const open = this.viewTabOf("exposure", tabs, r.findings.length || !live.length ? "findings" : live[0].id);
    let body;
    if (open === "findings") {
      this.lvState("exposure", "", "asc");
      const q = this.lv.exposure.q.trim().toLowerCase();
      const itemCount = r.findings.reduce((n, f) => n + (f.items || []).length, 0);
      const bar = itemCount >= 6 || q ? this.listBar("exposure", { sorts: [] }) : "";
      const shown = q ? r.findings.filter(f => (f.items || []).some(item => [item.name, item.entity_id, ...(item.assistants || [])].join(" ").toLowerCase().includes(q))) : r.findings;
      const rows = shown.length ? shown.map(f => this.expoFindingRows(f)).join("") : q ? `<div class="emptymsg">${this.t("noMatches")}</div>` : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("expoNone")}</div>`;
      body = `<div class="panel"><div class="panelhead"><div><h2>${this.t("expoTabFindings")}</h2><p>${this.t("expoFindingsHint")}</p></div></div>${bar}${rows}${this.howCounted("expoFootnote")}</div>`;
    } else body = this.expoSourceTab(r, sources.find(x => x.id === open));
    return `<div class="stack"><div class="panel">${head}<p class="factnote">${this.t("expoIntro")}</p></div>${tiles}${this.viewTabBar("exposure", tabs, open)}${body}</div>`;
  }
}
