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

  orphanStatsView() {
    const all = this.data.orphaned_statistics || [];
    this.lvState("orphanstats", "id", "asc");
    const kind = o => (o.has_sum && o.has_mean ? "kindBoth" : o.has_sum ? "kindSum" : "kindMean");
    const sorts = [
      { key: "id", label: "sortId", dir: "asc", get: o => o.statistic_id },
      { key: "unit", label: "sortUnit", dir: "asc", get: o => o.unit },
    ];
    const kinds = [...new Set(all.map(kind))];
    const bar = this.listBar("orphanstats", { sorts, filters: [{ name: "kind", all: this.t("allKinds"), options: kinds.map(k => [k, this.t(k)]) }] });
    const rows = this.refine("orphanstats", all, { text: o => [o.statistic_id, o.unit].join(" "), filters: { kind: (o, v) => kind(o) === v }, sorts, tie: o => o.statistic_id });
    const pg = this.paginate("orphanstats", rows);
    const row = o => `<div class="row"><span class="tile mute"><ha-icon icon="mdi:chart-line-variant"></ha-icon></span><span class="row-text"><strong>${this.esc(o.statistic_id)}</strong><small>${this.esc([this.t(kind(o)), o.unit].filter(Boolean).join(" · "))}</small></span>${o.in_energy ? `<span class="pill warn">${this.t("inEnergy")}</span>` : ""}</div>`;
    const empty = this.t(this.data.meta.recorder_available ? (all.length ? "noMatches" : "noOrphanStats") : "noRecorder");
    return `<div class="panel">${this.unrefTabs()}<p class="factnote">${this.t("orphanStatsHint")}</p>${bar}${rows.length ? pg.rows.map(row).join("") : `<div class="emptymsg"><ha-icon icon="mdi:chart-line-variant"></ha-icon>${empty}</div>`}${pg.footer}</div>`;
  }

  unreferencedView() {
    if (this.unrefTab === "statistics") return this.orphanStatsView();
    const all = this.unreferencedRows();
    this.lvState("unreferenced", "id", "asc");
    const domains = [...new Set(all.map(o => o.object_id.split(".")[0]))].sort();
    const areas = [...new Set(all.map(o => this.areaName(o)).filter(Boolean))].sort();
    const sorts = [
      { key: "id", label: "sortId", dir: "asc", get: o => o.object_id },
      { key: "name", label: "sortName", dir: "asc", get: o => o.name },
      { key: "area", label: "sortArea", dir: "asc", get: o => this.areaName(o) },
    ];
    const bar = this.listBar("unreferenced", { sorts, filters: [
      { name: "domain", all: this.t("allDomains"), options: domains.map(d => [d, `${d} (${all.filter(o => o.object_id.startsWith(`${d}.`)).length})`]) },
      { name: "area", all: this.t("allAreas"), options: areas.map(a => [a, a]) },
    ] });
    const rows = this.refine("unreferenced", all, {
      text: o => [o.name, o.object_id, this.areaName(o)].join(" "),
      filters: { domain: (o, v) => o.object_id.startsWith(`${v}.`), area: (o, v) => this.areaName(o) === v }, sorts, tie: o => o.object_id,
    });
    const pg = this.paginate("unreferenced", rows);
    const row = item => {
      const device = item.device_id ? this.findObject(`device:${item.device_id}`) : null;
      const area = this.findObject(`area:${item.area_id || device?.area_id}`);
      return `<button class="row rel" data-object="${this.esc(this.objectKey(item))}"><span class="tile mute"><ha-icon icon="mdi:link-variant-off"></ha-icon></span><span class="row-text"><strong>${this.esc(item.name)}</strong><small>${this.esc([item.object_id, device?.name, area?.name].filter(Boolean).join(" · "))}</small></span></button>`;
    };
    return `<div class="panel">${this.unrefTabs()}<p class="factnote">${this.t("unreferencedHint")}</p>${bar}${rows.length ? pg.rows.map(row).join("") : `<div class="emptymsg"><ha-icon icon="mdi:link-variant"></ha-icon>${this.t(all.length ? "noMatches" : "noUnreferenced")}</div>`}${pg.footer}</div>`;
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
