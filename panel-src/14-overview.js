// OverviewMixin: methods of the panel element, mixed into the class in 99-register.js.
class OverviewMixin {
  // Hours since the last scan when it is clearly overdue for the configured interval, else null.
  staleScan() {
    const m = this.data?.meta;
    if (!m?.scanned_at) return null;
    const hours = (Date.now() - new Date(m.scanned_at).getTime()) / 3.6e6;
    const interval = Number(m.scan_interval_hours) || 0;
    if (!Number.isFinite(hours)) return null;
    if (interval > 0 ? hours > interval * 1.5 + 1 : hours > 24 * 7) return { hours: Math.round(hours), interval };
    return null;
  }

  // Shown while the backend treats scans as preliminary because Home Assistant is still starting.
  warmupBanner() {
    if (!this.data?.meta?.preliminary) return "";
    return `<div class="panel" style="margin-bottom:14px"><div class="row"><span class="tile warn"><ha-icon icon="mdi:timer-sand"></ha-icon></span><span class="row-text"><strong>${this.esc(this.t("warmupBanner"))}</strong></span></div></div>`;
  }

  staleBanner() {
    const stale = this.staleScan();
    if (!stale) return "";
    const age = stale.hours >= 48 ? this.t("daysValue", { n: Math.round(stale.hours / 24) }) : `${stale.hours} h`;
    const text = stale.interval > 0 ? this.t("staleScan", { age, hours: stale.interval }) : this.t("staleScanManual", { age });
    return `<div class="panel" style="margin-bottom:14px"><div class="row"><span class="tile warn"><ha-icon icon="mdi:clock-alert-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(text)}</strong></span><button class="btn" data-action="scan">${this.t("scan")}</button></div></div>`;
  }

  overview() {
    const m = this.data.meta, counts = m.status_counts || {}, types = m.type_counts || {}, health = this.health();
    const findings = this.sortedFindings();
    const stats = [
      ["objects", m.object_count, "mdi:shape-outline", "", "inventory"],
      ["openFindings", findings.length, "mdi:alert-outline", findings.length ? "warn" : "ok", "findingsNav"],
      ["unavailable", counts.unavailable || 0, "mdi:lan-disconnect", counts.unavailable ? "red" : "ok", "inventory", "unavailable"],
      ["disabled", counts.disabled || 0, "mdi:cancel", "mute", "inventory", "disabled"],
    ];
    const order = ["active", "unknown", "unavailable", "orphaned", "disabled", "empty", "problem"].filter(s => counts[s]);
    const total = Math.max(1, m.object_count);
    return `${this.staleBanner()}<div class="summary"><div class="card" title="${this.esc(this.t("healthTip", { affected: health.affected, base: health.base }))}"><span class="ring ${health.tone}" style="--p:${health.percent}"><b>${health.percent}%</b></span><span class="card-text"><small>${this.t("health")}</small><strong>${this.t(health.label)}</strong><em>${this.t("healthHint")}</em></span></div>
      ${stats.map(([label, value, icon, tone, view, status]) => `<button class="card" data-jump="${view}" data-status="${status || ""}"><span class="tile ${tone}"><ha-icon icon="${icon}"></ha-icon></span><span class="card-text"><small>${this.t(label)}</small><strong>${this.formatNumber(value)}</strong></span></button>`).join("")}</div>
      <div class="grid2"><div class="stack"><div class="panel"><div class="panelhead"><div><h2>${this.t("needsAttention")}</h2><p>${this.t("sortedBySure")}</p></div><button class="link" data-jump="findingsNav">${this.t("allFindings")} (${findings.length}) <ha-icon icon="mdi:chevron-right"></ha-icon></button></div>
      ${findings.length ? findings.slice(0, 8).map(f => this.findingRow(f)).join("") : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("noFindings")}</div>`}</div>${this.integrationProblems()}</div>
      <div class="stack">${this.cleanupCard()}<div class="panel"><div class="panelhead"><h2>${this.t("inventoryStatus")}</h2><span class="date">${this.formatNumber(m.object_count)}</span></div>
      <div class="bar">${order.map(s => `<i class="${this.tone(s)}" style="width:${(100 * counts[s] / total).toFixed(2)}%"></i>`).join("")}</div>
      <div class="legend">${order.map(s => `<div><span><i class="dot ${this.tone(s)}"></i>${this.t(s)}</span><b>${this.formatNumber(counts[s])}</b></div>`).join("")}</div></div>
      <div class="panel"><div class="panelhead"><h2>${this.t("byType")}</h2></div><div class="types">${["entity", "device", "config_entry", "automation", "script", "scene", "dashboard", "area", "floor", "label"].filter(t => types[t]).map(type => `<button class="type" data-type-jump="${type}">${this.tile(type)}<span>${this.t(type)}</span><b>${this.formatNumber(types[type])}</b></button>`).join("")}</div></div></div></div>`;
  }

  // Quick links to the hint views; counts exclude hidden findings.
  cleanupCard() {
    const open = this.data.findings.filter(f => !f.ignored);
    const items = [
      ["batteries", "mdi:battery-alert-variant-outline", "batteries", this.lowBatteries().length, "batteries"],
      ["possible_duplicate", "mdi:content-duplicate", "findingsNav", open.filter(f => f.classification === "possible_duplicate").length, "possible_duplicate"],
      ["unused", "mdi:sleep", "findingsNav", open.filter(f => f.classification === "unused").length, "unused"],
      ["unreferenced", "mdi:link-variant-off", "unreferenced", this.unreferencedRows().length, undefined],
      ["quarantine", "mdi:archive-clock-outline", "cleanup", (this.data.quarantine || []).length, undefined],
    ];
    const rows = items.map(([label, icon, view, count, filter]) => `<button class="row" data-jump="${view}"${filter !== undefined && view === "findingsNav" ? ` data-filter="${filter}"` : ""}><span class="tile ${count ? "warn" : "mute"}"><ha-icon icon="${icon}"></ha-icon></span><span class="row-text"><strong>${this.t(label)}</strong></span><span class="pill ${count ? "warn" : "mute"}">${this.formatNumber(count)}</span></button>`).join("");
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("cleanup")}</h2><p>${this.t("cleanupHint")}</p></div></div>${rows}</div>`;
  }

  integrationProblems() {
    const broken = this.data.objects.filter(o => o.object_type === "config_entry" && o.status === "problem");
    if (!broken.length) return "";
    this.lvState("integrations", "name", "asc");
    const sorts = [{ key: "name", label: "sortName", dir: "asc", get: o => o.name }, { key: "state", label: "sortStatus", dir: "asc", get: o => o.state || "" }];
    const bar = broken.length > 5 ? this.listBar("integrations", { sorts }) : "";
    const shown = broken.length > 5 ? this.refine("integrations", broken, { text: o => [o.name, o.domain, o.state].join(" "), sorts, tie: o => o.object_id }) : broken;
    const pg = this.paginate("integrations", shown);
    const rows = pg.rows.map(o => `<button class="row rel" data-object="${this.esc(this.objectKey(o))}">${this.tile("config_entry", "red")}<span class="row-text"><strong>${this.esc(o.name)}</strong><small>${this.esc(o.domain)} · ${this.t(`cs_${o.state || "not_loaded"}`)}</small></span>${this.pill(o.status)}</button>`).join("");
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("integrationProblems")} (${broken.length})</h2><p>${this.t("integrationProblemsHint")}</p></div></div>${bar}${rows}${pg.footer}</div>`;
  }
}
