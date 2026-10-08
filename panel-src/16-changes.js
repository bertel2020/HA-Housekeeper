// ChangesMixin: methods of the panel element, mixed into the class in 99-register.js.
class ChangesMixin {
  async loadCompare() {
    this.compareLoading = true; this.render();
    try {
      this.compare = await this._hass.callWS({ type: "ha_housekeeper/compare", baseline: this.compareBaseline });
    } catch (err) {
      this.compare = null; this.error = err?.message || String(err);
    }
    this.compareLoading = false; this.render();
  }

  // One row per stored scan (newest first) with its totals; a click picks it as the comparison base.
  historyTimeline(c, baselines) {
    if (baselines.length < 2) return "";
    const rows = [{ id: "", at: this.data?.meta?.scanned_at, ...c.current, now: true }, ...baselines];
    const max = Math.max(1, ...rows.map(r => r.findings || 0));
    const body = rows.map((r, i) => {
      const older = rows[i + 1], delta = older ? (r.findings || 0) - (older.findings || 0) : 0;
      const pill = delta ? `<span class="pill ${delta > 0 ? "red" : "ok"}">${delta > 0 ? "+" : ""}${delta}</span>` : "";
      const selected = !r.now && r.id === this.compareBaseline;
      const label = r.now ? this.t("currentScan") : r.id === "previous" ? this.t("previousScan") : this.t("storedScan");
      const inner = `<span class="tile ${selected ? "" : "mute"}"><ha-icon icon="${r.now ? "mdi:clock-check-outline" : "mdi:history"}"></ha-icon></span><span class="row-text"><strong>${label} · ${this.esc(this.formatDate(r.at))}</strong><small>${this.t("historyCounts", { objects: this.formatNumber(r.objects || 0), findings: this.formatNumber(r.findings || 0) })}</small><span class="bar" style="margin-top:4px"><i style="width:${Math.round(((r.findings || 0) / max) * 100)}%"></i></span></span>${pill}`;
      return r.now ? `<div class="row rel">${inner}</div>` : `<button class="row rel ${selected ? "sel" : ""}" data-baseline="${this.esc(r.id)}">${inner}</button>`;
    }).join("");
    return `<section class="panel" style="margin-bottom:14px"><div class="panelhead"><div><h2>${this.t("historyTitle")}</h2><p>${this.t("historyHint", { days: c.retention_days ?? 30 })}</p></div></div>${body}</section>`;
  }

  changeRank(status) { return { active: 0, disabled: 1, empty: 1, unknown: 2, problem: 3, orphaned: 3, unavailable: 3 }[status] ?? 1; }

  changesView() {
    const c = this.compare;
    if (!c) return `${this.skeleton("loading")}`;
    this.ensureCorrelations();
    const baselines = c.baselines || [];
    const options = baselines.map(b => `<option value="${this.esc(b.id)}" ${b.id === this.compareBaseline ? "selected" : ""}>${b.id === "previous" ? `${this.t("previousScan")} · ` : ""}${this.esc(this.formatDate(b.at))}</option>`).join("");
    const hint = baselines.length <= 1 ? `<p class="factnote" style="margin:10px 0 0">${this.t("historyBuilding", { days: c.retention_days ?? 30 })}</p>` : "";
    const picker = options ? `<div class="panel" style="margin-bottom:14px"><div class="filters" style="grid-template-columns:auto minmax(220px,360px)"><label style="align-self:center;color:var(--hk-muted);font-size:calc(12px*var(--hk-fs,1))">${this.t("compareWith")}</label><select id="baseline">${options}</select></div>${hint}</div>${this.historyTimeline(c, baselines)}` : "";
    if (!c.available) {
      const meta = this.data?.meta || {};
      const why = meta.preliminary ? this.t("noBaselinePreliminary") : this.t("noBaselineOneScan", { hours: meta.scan_interval_hours || 24 });
      return `${picker}<div class="panel"><div class="emptymsg"><ha-icon icon="mdi:history"></ha-icon>${why}<button class="btn primary" data-scan-point ${this.busy || this.cleanupRunning() ? "disabled" : ""}>${this.t("scanPoint")}</button></div></div>`;
    }
    const sections = [
      ["statusChanges", "mdi:swap-horizontal", c.status_changes], ["newFindings", "mdi:alert-outline", c.new_findings],
      ["resolvedFindings", "mdi:check-circle-outline", c.resolved_findings], ["newObjects", "mdi:plus-circle-outline", c.new_objects],
      ["removedObjects", "mdi:minus-circle-outline", c.removed_objects],
    ];
    const total = sections.reduce((n, [, , part]) => n + part.total, 0);
    const cards = this.sumTiles(sections.map(([label, , part]) => ({ label: this.t(label), value: this.formatNumber(part.total), tone: !part.total ? "mute" : label === "resolvedFindings" ? "ok" : label === "newFindings" ? "warn" : "mute" })));
    const more = part => part.total > part.items.length ? `<p class="factnote">${this.t("moreItems", { count: part.total - part.items.length })}</p>` : "";
    const st = this.lvState("changes", "", "asc"), query = st.q.trim().toLowerCase();
    const typeOf = it => it.object_type || String(it.rule_id || "").split(".")[0];
    const matches = it => (!query || [it.name, it.object_id, it.rule_id, it.affected_object, typeOf(it)].join(" ").toLowerCase().includes(query)) && (!st.f.type || typeOf(it) === st.f.type);
    const allTypes = [...new Set(sections.flatMap(([, , part]) => part.items.map(typeOf)).filter(Boolean))].sort();
    const bar = total ? this.listBar("changes", { sorts: [], filters: [{ name: "type", all: this.t("allTypes"), options: allTypes.map(x => [x, this.t(x)]) }] }) : "";
    const paged = (id, items, render) => {
      const shown = items.filter(matches);
      if (items.length && !shown.length) return `<div class="emptymsg">${this.t("changesFiltered", { n: items.length })}</div>`;
      const pg = this.paginate(`changes-${id}`, shown);
      return pg.rows.map(render).join("") + pg.footer;
    };
    const objectRow = (o, note, pillHtml) => {
      const key = `${o.object_type}:${o.object_id}`, obj = this.findObject(key);
      const inner = `${this.tile(o.object_type, obj ? (this.tone(obj.status) === "ok" ? "" : this.tone(obj.status)) : "mute")}<span class="row-text"><strong>${this.esc(o.name || obj?.name || o.object_id)}</strong><small>${this.esc(note)}</small></span>${pillHtml}`;
      return obj ? `<button class="row rel" data-object="${this.esc(key)}">${inner}</button>` : `<div class="row rel">${inner}</div>`;
    };
    const changes = [...c.status_changes.items].sort((a, b) => (this.changeRank(b.to) - this.changeRank(b.from)) - (this.changeRank(a.to) - this.changeRank(a.from)));
    const body = {
      statusChanges: paged("statusChanges", changes, ch => objectRow(ch, `${this.t(ch.from)} → ${this.t(ch.to)} · ${this.t(ch.object_type)}`, `<span class="pill ${this.changeRank(ch.to) > this.changeRank(ch.from) ? "red" : this.changeRank(ch.to) < this.changeRank(ch.from) ? "ok" : "mute"}">${this.t(this.changeRank(ch.to) > this.changeRank(ch.from) ? "worsened" : this.changeRank(ch.to) < this.changeRank(ch.from) ? "improved" : "changed")}</span>`)),
      newFindings: paged("newFindings", c.new_findings.items, f => this.findingRow(f)),
      resolvedFindings: paged("resolvedFindings", c.resolved_findings.items, f => {
        const type = f.rule_id.split(".")[0];
        return objectRow({ object_type: type, object_id: f.object_id }, `${f.affected_object ? `${f.affected_object} · ` : ""}${this.findingTitle(f)}`, `<span class="pill ok">${this.t("improved")}</span>`);
      }),
      newObjects: paged("newObjects", c.new_objects.items, o => objectRow(o, `${this.t(o.object_type)} · ${o.object_id}`, this.pill(o.status))),
      removedObjects: paged("removedObjects", c.removed_objects.items, o => objectRow(o, `${this.t(o.object_type)} · ${this.t("gone")}`, "")),
    };
    const panels = sections.filter(([, , part]) => part.total).map(([label, , part]) => `<section class="panel" style="margin-bottom:14px"><div class="panelhead"><h2>${this.t(label)}</h2><span class="date">${this.formatNumber(part.total)}</span></div>${body[label]}${more(part)}</section>`).join("");
    return `${picker}<p class="sub" style="margin:0 0 14px">${this.t("comparedWith")} <b>${this.formatDate(c.baseline_at)}</b></p>${cards}${this.corrGroupsCard()}${total ? `<div class="panel" style="margin-bottom:14px">${bar}</div>${panels}` : `<div class="panel"><div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("noChanges")}</div></div>`}`;
  }
}
