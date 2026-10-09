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

  // What to do now, most urgent first: broken integrations and new critical findings, then an
  // overdue scan and the backup, then removals that are ready. Rows without data are left out.
  todoItems() {
    const items = [], m = this.data.meta;
    const broken = this.data.objects.filter(o => o.object_type === "config_entry" && o.status === "problem").length;
    if (broken) items.push({ key: "integrations", tone: "red", icon: "mdi:puzzle-remove-outline", label: "actIntegrations", hint: "actIntegrationsHint", count: broken, view: "inventory", type: "config_entry", status: "problem" });
    const causes = this.causeList().length;
    if (causes) items.push({ key: "causes", tone: "red", icon: "mdi:source-branch", label: "actCauses", hint: "actCausesHint", count: causes, view: "findingsNav", filter: "" });
    const regressions = (this.data.regressions || []).length;
    if (regressions) items.push({ key: "followup", tone: "red", icon: "mdi:history", label: "actFollowup", hint: "actFollowupHint", count: regressions, view: "cleanup" });
    const fresh = (this.trend?.new_findings?.items || []).filter(f => !f.ignored && CRITICAL_CLASSES.includes(f.classification)).length;
    if (fresh) items.push({ key: "critical", tone: "red", icon: "mdi:alert-circle-outline", label: "actNewCritical", hint: "actNewCriticalHint", count: fresh, view: "findingsNav", filter: "" });
    const stale = this.staleScan();
    if (stale) {
      const age = stale.hours >= 48 ? this.t("daysValue", { n: Math.round(stale.hours / 24) }) : `${stale.hours} h`;
      items.push({ key: "stale", tone: "warn", icon: "mdi:clock-alert-outline", text: stale.interval > 0 ? this.t("staleScan", { age, hours: stale.interval }) : this.t("staleScanManual", { age }), scan: true });
    }
    // Only real problems are listed; notes such as "emergency kit not confirmed" stay on the Maintenance card.
    const problems = this.backup?.available && this.backup.overall === "problem" ? this.backup.checks.filter(c => c.level === "problem") : [];
    const dbProblems = this.dbHealth?.available ? this.dbHealth.findings.filter(f => f.level === "problem") : [];
    if (dbProblems.length) items.push({ key: "db", tone: "red", icon: "mdi:database-alert-outline", label: "todoDbProblem", hintText: dbProblems.map(f => this.t(`dbKind_${f.kind}`)).join(", "), view: "recorder" });
    if (problems.length) items.push({ key: "backup", tone: "red", icon: "mdi:backup-restore", label: "todoBackupProblem", hintText: problems.map(c => this.t(`bh_${c.id}`)).join(", "), view: "maintenance" });
    const limit = m.quarantine_days ?? 14;
    const ready = (this.data.quarantine || []).filter(q => this.daysSince(q.since) >= limit).length;
    if (ready) items.push({ key: "quarantine", tone: "warn", icon: "mdi:archive-clock-outline", label: "actQuarantine", hint: "actQuarantineHint", count: ready, view: "cleanup" });
    return items;
  }

  todoCard() {
    const items = this.todoItems();
    const row = it => {
      const inner = `<span class="tile ${it.tone}"><ha-icon icon="${it.icon}"></ha-icon></span><span class="row-text"><strong>${this.esc(it.text || this.t(it.label))}</strong>${it.hint || it.hintText ? `<small>${this.esc(it.hintText || this.t(it.hint))}</small>` : ""}</span>`;
      if (it.scan) return `<div class="row todo" data-todo="${it.key}">${inner}<button class="btn" data-action="scan">${this.t("scan")}</button></div>`;
      const target = `data-jump="${it.view}"${it.filter !== undefined ? ` data-filter="${it.filter}"` : ""}${it.type ? ` data-type="${it.type}"` : ""}${it.status ? ` data-status="${it.status}"` : ""}`;
      return `<button class="row todo" data-todo="${it.key}" ${target}>${inner}${it.count !== undefined ? `<span class="pill ${it.tone}">${this.formatNumber(it.count)}</span>` : ""}</button>`;
    };
    const body = items.length ? items.map(row).join("")
      : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.esc(this.t("actNone", { date: this.formatDate(this.data.meta.scanned_at) }))}</div>`;
    return `<section class="panel" style="margin-bottom:14px" aria-labelledby="hk-todo"><div class="panelhead"><div><h2 id="hk-todo">${this.t("actTitle")}</h2><p>${this.t("actSub")}</p></div></div>${body}</section>`;
  }

  // The comparison with the previous scan is fetched once per data set; the overview shows it when it is there.
  ensureTrend() {
    if (this._trendFor === this.data || !this._hass?.callWS) return;
    this._trendFor = this.data;
    this.loadTrend(this.data);
  }

  async loadTrend(data) {
    try {
      const result = await this._hass.callWS({ type: "ha_housekeeper/compare", baseline: "previous" });
      if (this.data !== data) return;
      this.trend = result?.available === true ? result : null;
      if (this.view === "overview" && !this.selected) this.render();
    } catch (_) { if (this.data === data) this.trend = null; }
  }

  trendCard() {
    const c = this.trend;
    if (!c?.available) return "";
    const date = this.formatDate(c.baseline_at);
    const rows = [
      ["trendNewFindings", c.new_findings?.total, "mdi:arrow-up-bold", "red", "+"],
      ["trendResolved", c.resolved_findings?.total, "mdi:arrow-down-bold", "ok", "−"],
      ["trendChanged", c.status_changes?.total, "mdi:swap-horizontal", "warn", ""],
      ["trendNewObjects", c.new_objects?.total, "mdi:plus-circle-outline", "mute", "+"],
    ].filter(([, n]) => n);
    const body = rows.length
      ? rows.map(([label, n, icon, tone, sign]) => `<button class="row" data-jump="changes"><span class="tile ${tone}"><ha-icon icon="${icon}"></ha-icon></span><span class="row-text"><strong>${this.t(label)}</strong></span><span class="pill ${tone}">${sign}${this.formatNumber(n)}</span></button>`).join("")
      : `<div class="emptymsg">${this.esc(this.t("trendNone", { date }))}</div>`;
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("trendTitle")}</h2><p>${this.esc(this.t("trendSince", { date }))}</p></div></div>${body}</div>`;
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
    this.ensureTrend();
    this.ensureBackup();
    return `<div class="summary">
      <div class="card" title="${this.esc(this.t("healthTip", { affected: health.affected, base: health.base }))}"><span class="ring ${health.tone}" style="--p:${health.percent}"><b>${health.percent}%</b></span><span class="card-text"><small>${this.t("health")}</small><strong>${this.t(health.label)}</strong><em>${this.t("healthHint")}</em></span></div>
      ${stats.map(([label, value, icon, tone, view, status]) => `<button class="card" data-jump="${view}" data-status="${status || ""}"><span class="tile ${tone}"><ha-icon icon="${icon}"></ha-icon></span><span class="card-text"><small>${this.t(label)}</small><strong>${this.formatNumber(value)}</strong></span></button>`).join("")}</div>
      ${this.todoCard()}${this.goalsCard()}<div class="grid2"><div class="stack">${this.inventoryStatusCard()}<div class="panel"><div class="panelhead"><div><h2>${this.t("needsAttention")}</h2><p>${this.t("sortedBySure")}</p></div><button class="link" data-jump="findingsNav">${this.t("allFindings")} (${findings.length}) <ha-icon icon="mdi:chevron-right"></ha-icon></button></div>
      ${findings.length ? findings.filter(f => !f.cause_id).slice(0, 8).map(f => this.findingRow(f)).join("") : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("noFindings")}</div>`}</div>${this.integrationProblems()}</div>
      <div class="stack">${this.databaseCard()}${this.trendCard()}${this.cleanupCard()}
      <div class="panel"><div class="panelhead"><h2>${this.t("byType")}</h2></div><div class="types">${["entity", "device", "config_entry", "automation", "script", "scene", "dashboard", "area", "floor", "label"].filter(t => types[t]).map(type => `<button class="type" data-type-jump="${type}">${this.tile(type)}<span>${this.t(type)}</span><b>${this.formatNumber(types[type])}</b></button>`).join("")}</div></div></div></div>`;
  }

  // Three groups instead of seven raw statuses: what is fine, what to look at, what is broken.
  inventoryStatusCard() {
    const m = this.data.meta, counts = m.status_counts || {}, total = Math.max(1, m.object_count);
    const groups = [
      ["invOk", "ok", ["active"]],
      ["invCheck", "warn", ["unknown", "disabled", "empty"]],
      ["invProblem", "red", ["unavailable", "orphaned", "problem"]],
    ].map(([label, tone, statuses]) => ({ label, tone, statuses, n: statuses.reduce((sum, s) => sum + (counts[s] || 0), 0) }));
    const known = groups.reduce((sum, g) => sum + g.n, 0);
    const percent = n => `${new Intl.NumberFormat(this.lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(100 * n / total)} %`;
    const detail = g => g.statuses.filter(s => counts[s]).map(s => `${this.formatNumber(counts[s])} ${this.t(s)}`).join(" · ");
    const rows = groups.map(g => `<div title="${this.esc(detail(g))}"><span><i class="dot ${g.tone}"></i>${this.t(g.label)}</span><span class="nums"><b>${this.formatNumber(g.n)}</b><em class="pct">${percent(g.n)}</em></span></div>`).join("");
    const bar = groups.filter(g => g.n).map(g => `<i class="${g.tone}" style="width:${(100 * g.n / Math.max(1, known)).toFixed(2)}%"></i>`).join("");
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("inventoryStatus")}</h2><p>${this.t("invHint")}</p></div></div><div class="legend invlegend">${rows}</div><div class="bar">${bar}</div></div>`;
  }

  // Size of the recorder database from two file stats taken during the scan; the table queries stay in the Recorder view.
  databaseCard() {
    const d = this.data.meta.database;
    if (!d) return "";
    const measured = d.db_bytes !== null && d.db_bytes !== undefined;
    const rows = measured ? [
      [this.t("dbOvSize"), this.formatBytes(d.db_bytes)],
      [this.t("dbOvWal"), this.formatBytes(d.wal_bytes || 0)],
      ...(d.keep_days ? [[this.t("dbOvKeep"), this.t("dbOvKeepDays", { n: this.formatNumber(d.keep_days) })]] : []),
      [this.t("dbOvGrowth"), d.per_day !== null && d.per_day !== undefined ? this.t("dbOvPerDay", { size: this.formatBytes(Math.max(0, d.per_day)) }) : this.t("dbOvObserving")],
    ] : [[this.t("dbOvSize"), this.t("dbOvNoSize", { dialect: this.esc(d.dialect || "?") })]];
    const purgeOff = d.auto_purge === false ? `<p class="factnote">${this.t("dbOvPurgeOff")}</p>` : "";
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("dbOvTitle")}</h2><p>${this.t("dbOvHint")}</p></div><button class="link" data-jump="recorder">${this.t("dbOvDetails")} <ha-icon icon="mdi:chevron-right"></ha-icon></button></div><div class="facts">${rows.map(([k, v]) => `<div class="fact"><span>${k}</span><b>${v}</b></div>`).join("")}</div>${purgeOff}</div>`;
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
