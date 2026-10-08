// UnusedMixin: methods of the panel element, mixed into the class in 99-register.js.
class UnusedMixin {
  batteryRows() {
    const rows = [];
    for (const o of this.data.objects) {
      if (o.object_type !== "entity" || o.device_class !== "battery" || o.status !== "active") continue;
      const domain = o.object_id.split(".")[0];
      if (domain === "binary_sensor") rows.push({ item: o, level: null, low: o.state === "on" });
      else if (domain === "sensor" && o.state !== null && o.state !== "" && !Number.isNaN(Number(o.state))) rows.push({ item: o, level: Number(o.state), low: false });
    }
    const limit = this.data.meta.low_battery_percent ?? 20;
    rows.forEach(r => { r.low = r.low || (r.level !== null && r.level <= limit); });
    return rows.sort((a, b) => (Number(b.low) - Number(a.low)) || ((a.level ?? -1) - (b.level ?? -1)) || a.item.name.localeCompare(b.item.name));
  }

  // Active entities no source refers to. A hint only; see unreferencedHint for the blind spots.
  unreferencedRows() {
    const { used } = this.edgeIndex();
    const SELF = ["automation", "script", "scene"];
    return this.data.objects.filter(o => o.object_type === "entity" && o.status === "active" && !o.entity_category
      && !SELF.includes(o.object_id.split(".")[0]) && !used.has(this.objectKey(o)))
      .sort((a, b) => a.object_id.localeCompare(b.object_id));
  }

  unrefTabs() {
    const stats = this.data.orphaned_statistics || [];
    const chip = (tab, label, count) => `<button class="chip ${this.unrefTab === tab ? "active" : ""}" data-unref-tab="${tab}">${label} (${count})</button>`;
    return `<div class="chips">${chip("entities", this.t("unreferencedEntities"), this.unreferencedRows().length)}${chip("statistics", this.t("orphanStats"), stats.length)}</div>`;
  }

  // Key figures of both tabs; the two main ones switch the tab.
  unrefTiles() {
    const stats = this.data.orphaned_statistics || [], rows = this.unreferencedRows();
    const top = list => { const counts = new Map(); list.forEach(x => x && counts.set(x, (counts.get(x) || 0) + 1)); return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]; };
    const domain = top(rows.map(o => o.object_id.split(".")[0])), platform = top(rows.map(o => o.platform));
    const withStats = rows.filter(o => o.has_statistics).length, inEnergy = stats.filter(o => o.in_energy).length;
    return this.sumTiles([
      { label: this.t("unreferencedEntities"), value: this.formatNumber(rows.length), tone: rows.length ? "warn" : "ok", unref: "entities", active: this.unrefTab !== "statistics" },
      this.data.meta.recorder_available && rows.length ? { label: this.t("unrefSumStats"), value: this.formatNumber(withStats), sub: this.t("unrefSumStatsHint"), tone: "mute" } : null,
      domain ? { label: this.t("unrefSumDomain"), value: this.esc(domain[0]), sub: this.formatNumber(domain[1]), tone: "mute" } : null,
      platform ? { label: this.t("unrefSumPlatform"), value: this.esc(platform[0]), sub: this.formatNumber(platform[1]), tone: "mute" } : null,
      { label: this.t("orphanStats"), value: this.formatNumber(stats.length), tone: stats.length ? "warn" : "ok", unref: "statistics", active: this.unrefTab === "statistics" },
      inEnergy ? { label: this.t("unrefSumEnergy"), value: this.formatNumber(inEnergy), sub: this.t("unrefSumEnergyHint"), tone: "red", unref: "statistics" } : null,
    ]);
  }

  // Active entities that look like what an orphaned statistic became after a rename: same domain, same unit, similar name.
  statSuccessors(orphan) {
    const [domain, name = ""] = orphan.statistic_id.split(".");
    const words = new Set(name.split("_").filter(Boolean));
    const found = [];
    for (const o of this.data.objects) {
      if (o.object_type !== "entity" || o.status !== "active" || o.object_id === orphan.statistic_id || !o.object_id.startsWith(`${domain}.`)) continue;
      if (orphan.unit && o.unit !== orphan.unit) continue;
      const other = new Set(o.object_id.split(".")[1].split("_").filter(Boolean));
      const shared = [...words].filter(w => other.has(w)).length;
      const score = shared / (words.size + other.size - shared || 1);
      if (score >= 0.5) found.push({ item: o, score });
    }
    return found.sort((a, b) => b.score - a.score || a.item.object_id.localeCompare(b.item.object_id)).slice(0, 2).map(f => f.item);
  }

  statSuccessorLine(orphan) {
    const successors = this.statSuccessors(orphan);
    if (!successors.length) return "";
    const links = successors.map(s => `<button class="linklike" data-object="entity:${this.esc(s.object_id)}">${this.esc(s.object_id)}</button>`).join(", ");
    return `<small>${this.t("statSuccessors")} ${links}</small>`;
  }

  // When the statistic last received a value: read on the first visit of the list, never during a scan.
  async loadOrphanLast(refresh = false) {
    this.orphanLastLoading = true; this.render();
    try { this.orphanLast = await this._hass.callWS({ type: "ha_housekeeper/statistics_last", refresh }); }
    catch (_) { this.orphanLast = null; }
    this.orphanLastLoading = false; this.render();
  }

  // Switching to the tab asks again after a failure or a busy recorder; rendering alone never loops.
  retryOrphanLast() {
    if (!this.orphanLast || this.orphanLast.busy) this._orphanLastRequested = false;
  }

  ensureOrphanLast() {
    if (this.orphanLastLoading || this._orphanLastRequested || !this.data?.meta?.recorder_available) return;
    this._orphanLastRequested = true;
    setTimeout(() => this.loadOrphanLast(), 0);
  }

  orphanStatsView() {
    const all = this.data.orphaned_statistics || [];
    this.lvState("orphanstats", "id", "asc");
    const kind = o => (o.has_sum && o.has_mean ? "kindBoth" : o.has_sum ? "kindSum" : "kindMean");
    const lastOf = o => this.orphanLast?.last?.[o.statistic_id];
    const sorts = [
      { key: "id", label: "sortId", dir: "asc", get: o => o.statistic_id },
      { key: "kind", label: "sortKind", dir: "asc", get: o => this.t(kind(o)) },
      { key: "unit", label: "sortUnit", dir: "asc", get: o => o.unit },
      { key: "last", label: "sortLastEntry", dir: "desc", get: lastOf },
    ];
    this.ensureOrphanLast();
    const kinds = [...new Set(all.map(kind))];
    const units = [...new Set(all.map(o => o.unit).filter(Boolean))].sort();
    const AGES = [30, 365, 730];
    const bar = this.listBar("orphanstats", { sorts, filters: [
      { name: "kind", all: this.t("allKinds"), options: kinds.map(k => [k, this.t(k)]) },
      { name: "unit", all: this.t("allUnits"), options: units.map(u => [u, u]) },
      { name: "age", all: this.t("allAges"), options: AGES.map(d => [String(d), this.t(`statAge${d}`)]) },
    ] });
    const rows = this.refine("orphanstats", all, { text: o => [o.statistic_id, o.unit].join(" "), filters: {
      kind: (o, v) => kind(o) === v, unit: (o, v) => o.unit === v,
      age: (o, v) => { const ts = lastOf(o); return typeof ts === "number" && Date.now() - ts * 1000 > Number(v) * 864e5; },
    }, sorts, tie: o => o.statistic_id });
    const pg = this.paginate("orphanstats", rows);
    const lastCell = o => {
      if (this.orphanLastLoading && !this.orphanLast) return `<span class="muted">…</span>`;
      if (this.orphanLast?.busy) return `<span class="muted">${this.t("lastEntryBusyShort")}</span>`;
      const ts = lastOf(o);
      if (ts === null || ts === undefined) return `<span class="muted">${this.orphanLast?.available ? this.t("lastEntryNone") : "–"}</span>`;
      return this.ageCell(new Date(ts * 1000).toISOString());
    };
    const columns = [
      { key: "id", label: "utStatId", dir: "asc", cell: o => `<strong>${this.esc(o.statistic_id)}</strong>${this.statSuccessorLine(o)}` },
      { key: "kind", label: "utKind", cell: o => this.esc(this.t(kind(o))) },
      { key: "unit", label: "utUnit", cell: o => this.esc(o.unit || "–") },
      { key: "last", label: "utLast", dir: "desc", cell: lastCell },
      { key: "energy", label: "utEnergy", sortable: false, cell: o => (o.in_energy ? `<span class="pill warn">${this.t("inEnergy")}</span>` : "") },
    ];
    const empty = this.t(this.data.meta.recorder_available ? (all.length ? "noMatches" : "noOrphanStats") : "noRecorder");
    const table = rows.length ? this.listTable("orphanstats", columns, pg.rows, { cls: "stat", rowAttrs: () => 'class="static"' }) : `<div class="emptymsg"><ha-icon icon="mdi:chart-line-variant"></ha-icon>${empty}</div>`;
    return `<div class="stack">${this.unrefTiles()}<div class="panel"><p class="factnote">${this.t("orphanStatsHint")}</p>${bar}${table}${pg.footer}</div></div>`;
  }

  unreferencedView() {
    if (this.unrefTab === "statistics") return this.orphanStatsView();
    const all = this.unreferencedRows();
    this.lvState("unreferenced", "name", "asc");
    const domainOf = o => o.object_id.split(".")[0];
    const deviceName = o => (o.device_id ? this.findObject(`device:${o.device_id}`)?.name : "") || "";
    const ts = v => (v ? Date.parse(v) || null : null);
    const sorts = [
      { key: "id", label: "sortId", dir: "asc", get: o => o.object_id },
      { key: "name", label: "sortName", dir: "asc", get: o => o.name },
      { key: "domain", label: "sortDomain", dir: "asc", get: domainOf },
      { key: "device", label: "sortDevice", dir: "asc", get: deviceName },
      { key: "area", label: "sortArea", dir: "asc", get: o => this.areaName(o) },
      { key: "platform", label: "sortIntegration", dir: "asc", get: o => o.platform },
      { key: "changed", label: "sortChanged", dir: "desc", get: o => ts(o.last_changed) },
      { key: "reported", label: "sortReported", dir: "desc", get: o => ts(o.last_reported || o.last_updated) },
      { key: "since", label: "sortSince", dir: "asc", get: o => ts(o.status_since) },
      { key: "stats", label: "sortStats", dir: "desc", get: o => (o.has_statistics ? 1 : 0) },
    ];
    const domains = [...new Set(all.map(domainOf))].sort();
    const areas = [...new Set(all.map(o => this.areaName(o)).filter(Boolean))].sort();
    const platforms = [...new Set(all.map(o => o.platform).filter(Boolean))].sort();
    const bar = this.listBar("unreferenced", { sorts, filters: [
      { name: "domain", all: this.t("allDomains"), options: domains.map(d => [d, `${d} (${all.filter(o => domainOf(o) === d).length})`]) },
      { name: "area", all: this.t("allAreas"), options: areas.map(a => [a, a]) },
      { name: "platform", all: this.t("allIntegrations"), options: platforms.map(p => [p, p]) },
    ] });
    const rows = this.refine("unreferenced", all, {
      text: o => [o.name, o.object_id, this.areaName(o), deviceName(o), o.platform].join(" "),
      filters: { domain: (o, v) => domainOf(o) === v, area: (o, v) => this.areaName(o) === v, platform: (o, v) => o.platform === v }, sorts, tie: o => o.object_id,
    });
    const pg = this.paginate("unreferenced", rows);
    const dash = `<span class="muted">–</span>`;
    const columns = [
      { key: "name", label: "utName", dir: "asc", cell: o => `<div title="${this.esc(o.name)}&#10;${this.esc(o.object_id)}"><strong class="cut">${this.esc(o.name)}</strong><span class="id cut">${this.esc(o.object_id)}</span></div>` },
      { key: "domain", label: "utDomain", cell: o => this.esc(domainOf(o)) },
      { key: "device", label: "utDevice", cell: o => this.esc(deviceName(o)) || dash },
      { key: "area", label: "utArea", cell: o => this.esc(this.areaName(o)) || dash },
      { key: "platform", label: "utIntegration", cell: o => this.esc(o.platform || "") || dash },
      { key: "changed", label: "utChanged", dir: "desc", cell: o => this.ageCell(o.last_changed) },
      { key: "reported", label: "utReported", dir: "desc", cell: o => this.ageCell(o.last_reported || o.last_updated) },
      { key: "since", label: "utSince", cell: o => this.ageCell(o.status_since) },
      { key: "stats", label: "utStats", dir: "desc", cell: o => (this.data.meta.recorder_available ? this.t(o.has_statistics ? "yes" : "no") : dash) },
    ];
    const table = rows.length ? this.listTable("unreferenced", columns, pg.rows, { cls: "unref", rowAttrs: o => `data-object="${this.esc(this.objectKey(o))}" tabindex="0" role="button" aria-label="${this.esc(o.name)}"` }) : `<div class="emptymsg"><ha-icon icon="mdi:link-variant"></ha-icon>${this.t(all.length ? "noMatches" : "noUnreferenced")}</div>`;
    return `<div class="stack">${this.unrefTiles()}<div class="panel"><p class="factnote">${this.t("unreferencedHint")}</p>${bar}${table}${pg.footer}</div></div>`;
  }

  batterySorts() {
    return [
      // Low batteries first, then the lowest level.
      { key: "level", label: "sortLevel", dir: "asc", get: r => (r.low ? 0 : 1e6) + (r.level ?? -1) },
      { key: "name", label: "sortName", dir: "asc", get: r => r.item.name },
      { key: "area", label: "sortArea", dir: "asc", get: r => this.areaName(r.item) },
    ];
  }

  lowBatteries() { return this.data ? this.batteryRows().filter(r => r.low) : []; }

  batteriesView() {
    const all = this.batteryRows(), low = all.filter(r => r.low);
    this.lvState("batteries", "level", "asc");
    const areas = [...new Set(all.map(r => this.areaName(r.item)).filter(Boolean))].sort();
    const bar = this.listBar("batteries", { sorts: this.batterySorts(), filters: [{ name: "area", all: this.t("allAreas"), options: areas.map(a => [a, a]) }] });
    const list = this.refine("batteries", this.batteryFilter === "low" ? low : all, {
      text: r => [r.item.name, r.item.object_id, this.areaName(r.item)].join(" "),
      filters: { area: (r, v) => this.areaName(r.item) === v }, sorts: this.batterySorts(), tie: r => r.item.object_id,
    });
    const limit = this.data.meta.low_battery_percent ?? 20;
    const chips = `<div class="chips"><button class="chip ${this.batteryFilter === "low" ? "active" : ""}" data-battery-filter="low">${this.t("batteryLow")} (${low.length})</button><button class="chip ${this.batteryFilter === "low" ? "" : "active"}" data-battery-filter="all">${this.t("batteryAll")} (${all.length})</button></div>`;
    const row = ({ item, level, low: isLow }) => {
      const device = item.device_id ? this.findObject(`device:${item.device_id}`) : null;
      const area = this.findObject(`area:${item.area_id || device?.area_id}`);
      const tone = isLow ? (level !== null && level <= limit / 2 ? "red" : "warn") : "ok";
      return `<button class="row rel" data-object="${this.esc(this.objectKey(item))}"><span class="tile ${tone === "ok" ? "ok" : tone}"><ha-icon icon="${isLow ? "mdi:battery-alert-variant-outline" : "mdi:battery-high"}"></ha-icon></span><span class="row-text"><strong>${this.esc(item.name)}</strong><small>${this.esc([device?.name, area?.name].filter(Boolean).join(" · ") || item.object_id)}</small></span><span class="pill ${tone}">${level !== null ? `${this.esc(Math.round(level))} ${this.esc(item.unit || "%")}` : this.t("batteryLow")}</span></button>`;
    };
    const pg = this.paginate(`batteries-${this.batteryFilter}`, list);
    return `<div class="panel">${chips}${bar}${list.length ? pg.rows.map(row).join("") : `<div class="emptymsg"><ha-icon icon="mdi:battery-check-outline"></ha-icon>${this.t(all.length ? "noMatches" : "noBatteries")}</div>`}${pg.footer}</div>`;
  }
}
