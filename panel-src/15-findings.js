// FindingsMixin: methods of the panel element, mixed into the class in 99-register.js.
class FindingsMixin {
  sortedFindings(includeIgnored = false) {
    const { plain } = this.collators();
    return this.data.findings.filter(f => includeIgnored || !f.ignored).sort((a, b) => (this.impactScore(b) - this.impactScore(a))
      || plain.compare(String(a.object_id), String(b.object_id)));
  }

  // Impact first, then how sure the diagnosis is: the fraction keeps the certainty from outranking a level.
  impactScore(f) { return (IMPACT_RANK[f.impact] ?? 0) + (f.confidence || 0) / 2; }

  // The level and the facts behind it, as text: "High impact (critical · used by 3 automations)".
  impactLine(f, withFacts = true) {
    if (!f.impact) return "";
    const facts = withFacts ? (f.impact_facts || []).map(x => this.t(`impactFact_${x.fact}`, { n: x.n ?? "", id: x.id ?? "", why: this.t(`impactWhy_${x.why}`) })) : [];
    return `${this.t(`impact_${f.impact}`)}${facts.length ? ` (${facts.join(" · ")})` : ""}`;
  }

  // The share of objects without a finding. It counts affected objects, not findings, so an object
  // with several findings is subtracted once; only the base types count, hidden findings do not.
  health() {
    const objects = this.data.objects.filter(o => HEALTH_TYPES.includes(o.object_type));
    const base = objects.length;
    const known = new Set(objects.map(o => this.objectKey(o)));
    const affected = new Set(this.data.findings.filter(f => !f.ignored).map(f => this.findingKey(f)).filter(key => known.has(key)));
    const percent = base ? Math.max(0, Math.round(100 * (1 - affected.size / base))) : 100;
    const tone = percent >= 95 ? "ok" : percent >= 80 ? "warn" : "red";
    const label = tone === "ok" ? "healthGood" : tone === "warn" ? "healthCheck" : "healthBad";
    return { percent, tone, label, affected: affected.size, base };
  }

  findingRow(finding) {
    const key = this.findingKey(finding), object = this.findObject(key);
    const title = object?.name || finding.object_id;
    const subtitle = finding.rule_id === "entity.possible_duplicate"
      ? `${this.t("duplicateOf")} ${this.esc(finding.affected_object)}`
      : finding.affected_object
        ? `${this.esc(finding.affected_object)} · ${this.esc(finding.evidence?.[0]?.location || "")}`
        : this.esc(object?.reason ? this.t(object.reason) : this.findingTitle(finding));
    const button = `<button class="row ${finding.ignored ? "dim" : ""}" data-object="${this.esc(key)}">${this.tile(object?.object_type || "entity", this.tone(finding.classification))}<span class="row-text"><strong>${this.esc(title)}</strong><small>${subtitle}${finding.ignored ? ` · ${this.esc(finding.mark ? this.markLine(finding.mark) : this.decisionLabel(finding))}` : ""}${finding.resurfaced ? ` · ${this.t("dueLabel")}` : ""}${finding.impact && finding.impact !== "none" ? ` · ${this.t(`impact_${finding.impact}`)}` : ""}${finding.first_detected_at ? `<span class="msince"> · ${this.t("sortSince")} ${this.formatDate(finding.first_detected_at)}</span>` : ""}</small></span>${this.pill(finding.classification)}<span class="date">${finding.first_detected_at ? this.formatDate(finding.first_detected_at) : ""}</span></button>`;
    return `<div class="rowwrap"><input type="checkbox" class="selbox" data-fsel="${this.esc(finding.key)}" ${this.findSel.has(finding.key) ? "checked" : ""} aria-label="${this.esc(title)}">${button}</div>`;
  }

  findingSorts() {
    return [
      { key: "impact", label: "sortImpact", dir: "desc", get: f => this.impactScore(f) },
      { key: "certainty", label: "sortCertainty", dir: "desc", get: f => f.confidence },
      { key: "name", label: "sortName", dir: "asc", get: f => this.findObject(this.findingKey(f))?.name || f.object_id },
      { key: "id", label: "sortId", dir: "asc", get: f => f.object_id },
      { key: "since", label: "sortSince", dir: "desc", get: f => f.first_detected_at },
      { key: "rule", label: "sortRule", dir: "asc", get: f => f.rule_id },
    ];
  }

  // The findings as shown (classification chip, search, type filter, sort); the export uses the same list.
  visibleFindings() {
    const all = this.sortedFindings(this.showIgnored);
    const classed = this.findingFilter ? all.filter(f => f.classification === this.findingFilter) : all;
    const afterOnly = this.findingAfter ? classed.filter(f => this.corr?.by_key?.[f.key]) : classed;
    const byClass = this.findingDue ? afterOnly.filter(f => f.resurfaced) : afterOnly;
    this.lvState("findings", "impact", "desc");
    return this.refine("findings", byClass, {
      text: f => [this.findObject(this.findingKey(f))?.name, f.object_id, f.rule_id, f.affected_object].join(" "),
      filters: { type: (f, v) => this.findingType(f) === v, impact: (f, v) => (f.impact || "none") === v },
      sorts: this.findingSorts(), tie: f => f.object_id,
    });
  }

  exportRows() {
    const shown = this.visibleFindings();
    const list = this.findSel.size ? shown.filter(f => this.findSel.has(f.key)) : shown;
    return list.map(f => {
      const key = this.findingKey(f), object = this.findObject(key);
      return {
        rule_id: f.rule_id, classification: f.classification, confidence: f.confidence, impact: f.impact || "", cause: f.cause_id || "",
        object_id: f.object_id, name: object?.name || "", affected_object: f.affected_object || "",
        first_detected_at: f.first_detected_at || "", location: f.evidence?.[0]?.location || "",
      };
    });
  }

  exportFindings(format) {
    const rows = this.exportRows();
    let body, type;
    if (format === "json") {
      body = JSON.stringify({ scanned_at: this.data.meta.scanned_at, findings: rows }, null, 2);
      type = "application/json";
    } else {
      const cols = Object.keys(rows[0] || { rule_id: 0, classification: 0, confidence: 0, object_id: 0, name: 0, affected_object: 0, first_detected_at: 0, location: 0 });
      // Leading =,+,-,@ would be evaluated as a formula by spreadsheet tools.
      const cell = v => { let t = String(v ?? ""); if (/^[=+\-@\t\r]/.test(t)) t = "'" + t; return `"${t.replace(/"/g, '""')}"`; };
      body = "\ufeff" + [cols.join(","), ...rows.map(r => cols.map(c => cell(r[c])).join(","))].join("\r\n");
      type = "text/csv";
    }
    const url = URL.createObjectURL(new Blob([body], { type: `${type};charset=utf-8` }));
    const a = document.createElement("a");
    a.href = url; a.download = `ha-housekeeper-findings.${format}`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  findingsView() {
    const all = this.sortedFindings(this.showIgnored);
    const ignoredCount = this.data.findings.filter(f => f.ignored).length;
    const classes = [...new Set(all.map(f => f.classification))];
    const list = this.collapseFollowers(this.visibleFindings());
    const types = [...new Set(all.map(f => this.findingType(f)))].sort();
    const bar = this.listBar("findings", { sorts: this.findingSorts(), filters: [{ name: "type", all: this.t("allTypes"), options: types.map(x => [x, this.t(x)]) }, { name: "impact", all: this.t("allImpacts"), options: ["high", "medium", "low", "none"].map(x => [x, this.t(`impact_${x}`)]) }] });
    const pg = this.paginate("findings", list);
    const h = this.health();
    const classTone = c => { const tone = this.tone(c); return tone === "red" ? "red" : tone === "warn" ? "warn" : "mute"; };
    this.ensureCorrelations();
    const afterCount = all.filter(f => this.corr?.by_key?.[f.key]).length;
    const tiles = this.sumTiles([
      { label: this.t("health"), value: `${h.percent} %`, sub: this.t("findSumAffected", { n: this.formatNumber(h.affected), m: this.formatNumber(h.base) }), tone: h.tone },
      { label: this.t("all"), value: this.formatNumber(all.length), tone: all.length ? "warn" : "ok", filter: "", active: !this.findingFilter },
      afterCount ? { label: this.t("corrTile"), value: this.formatNumber(afterCount), sub: this.t("corrTileSub"), tone: "warn", attr: ["data-finding-after", "1"], active: this.findingAfter } : null,
      ...classes.map(c => ({ label: this.t(c), value: this.formatNumber(all.filter(f => f.classification === c).length), tone: classTone(c), filter: c, active: this.findingFilter === c })),
    ]);
    const dueCount = this.data.findings.filter(f => f.resurfaced).length;
    const followers = this.followerCount();
    return `<div class="stack">${tiles}${this.causesCard()}<div class="panel"><div class="chips">${followers ? `<button class="chip ${this.showFollowers ? "active" : ""}" data-toggle-followers>${this.t(this.showFollowers ? "causeHide" : "causeShow")} (${followers})</button>` : ""}${dueCount ? `<button class="chip ${this.findingDue ? "active" : ""}" data-finding-due>${this.t("dueFilter")} (${dueCount})</button>` : ""}${ignoredCount ? `<button class="chip ${this.showIgnored ? "active" : ""}" data-toggle-ignored>${this.t("showIgnored")} (${ignoredCount})</button>` : ""}<span class="spacer"></span><button class="chip" data-export="csv" title="${this.t("exportTitle")}">${this.t("exportCsv")}</button><button class="chip" data-export="json" title="${this.t("exportTitle")}">${this.t("exportJson")}</button></div>
      ${this.findSelBar(pg.rows)}${bar}${list.length ? pg.rows.map(f => this.findingRow(f)).join("") : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t(all.length ? "noMatches" : "noFindings")}</div>`}${pg.footer}</div></div>`;
  }

  // The selection of findings: hide several at once, or export just those. Kept across pages until cleared.
  findSelBar(pageRows) {
    const n = this.findSel.size;
    this._findPage = pageRows.map(f => f.key);
    if (!pageRows.length && !n) return "";
    return `<div class="toolbar"><span class="date">${this.t("selectedCount", { count: n })}</span><button class="btn quiet" data-fsel-page>${this.t("selectPage")}</button><button class="btn quiet" data-fsel-clear ${n ? "" : "disabled"}>${this.t("clearSelection")}</button><span class="toolgap"></span><button class="btn" data-fsel-hide ${n ? "" : "disabled"}>${this.t("findHideSelected")}</button></div>`;
  }

  async hideSelectedFindings() {
    const keys = [...this.findSel].filter(key => this.data.findings.some(f => f.key === key && !f.ignored));
    try {
      for (const key of keys) {
        await this._hass.callWS({ type: "ha_housekeeper/ignore", finding_key: key, ignored: true });
        const finding = this.data.findings.find(f => f.key === key);
        if (finding) { finding.ignored = true; finding.ignored_by = "user"; }
      }
      this._rev++;
    } catch (err) { this.error = err?.message || String(err); }
    this.findSel.clear();
    this.render();
  }

  findingTitle(f) {
    const sub = f.rule_id.split(".")[1] || f.rule_id;
    if (sub.startsWith("missing_")) return `${this.t(sub)}: ${f.affected_object}`;
    if (f.rule_id === "entity.possible_duplicate") return `${this.t("duplicateOf")} ${f.affected_object}`;
    const text = this.t(f.rule_id);
    return text === f.rule_id ? this.t(sub) : text;
  }

  // What was decided about a hidden finding, as one line: kind, until when, why.
  decisionLabel(f) {
    const info = f.ignore_info;
    if (!info) return this.t("ignoredLabel");
    const until = info.until ? ` · ${this.t("decideUntil", { date: this.formatDate(info.until) })}` : "";
    return `${this.t(`decideKind_${info.kind}`)}${until}${info.reason ? ` · ${info.reason}` : ""}`;
  }

  // The small form that asks what to do with a finding: hide it, keep it on purpose, or look again later.
  decideForm(f) {
    const d = this.decide, snooze = d.kind === "snooze";
    const kinds = ["ignore", "keep", "snooze"].map(k => `<option value="${k}" ${d.kind === k ? "selected" : ""}>${this.t(`decideKind_${k}`)}</option>`).join("");
    const days = [...(snooze ? [] : [0]), 7, 30, 90, 365].map(n => `<option value="${n}" ${Number(d.days) === n ? "selected" : ""}>${n ? this.t("decideDays", { n }) : this.t("decideForever")}</option>`).join("");
    return `<form class="polform" data-decide-form="${this.esc(f.key)}"><select data-decide-kind aria-label="${this.esc(this.t("decideKind"))}">${kinds}</select>
      <input data-decide-reason maxlength="200" autocomplete="off" value="${this.esc(d.reason)}" aria-label="${this.esc(this.t("decideReason"))}" placeholder="${this.esc(this.t(d.kind === "keep" ? "decideReasonNeeded" : "decideReason"))}">
      <select data-decide-days aria-label="${this.esc(this.t("decideHow"))}">${days}</select>
      <button type="submit" class="btn primary">${this.t("viewSave")}</button><button type="button" class="btn quiet" data-decide-cancel>${this.t("cancelRun")}</button>
      ${d.error ? `<small class="error" role="alert">${this.esc(this.t(d.error))}</small>` : ""}</form>`;
  }

  openDecide(key) { this.decide = { key, kind: "ignore", reason: "", days: 0, error: "" }; this.render(); this.shadowRoot?.querySelector?.("[data-decide-kind]")?.focus?.(); }

  async commitDecide() {
    const d = this.decide;
    if (!d) return;
    if (d.kind === "keep" && !d.reason.trim()) { d.error = "decideNeedReason"; this.render(); return; }
    if (d.kind === "snooze" && !Number(d.days)) d.days = 30;
    try {
      const msg = { type: "ha_housekeeper/ignore", finding_key: d.key, ignored: true, kind: d.kind, reason: d.reason.trim() };
      if (Number(d.days)) msg.days = Number(d.days);
      await this._hass.callWS(msg);
      if (d.key.startsWith("policy.")) { this.decide = null; await this.loadPolicies(); return; }  // a policy violation is no finding
      const finding = this.data.findings.find(f => f.key === d.key);
      if (finding) {
        const until = msg.days ? new Date(Date.now() + msg.days * 864e5).toISOString() : null;
        finding.ignored = true; finding.ignored_by = "user"; finding.resurfaced = false;
        finding.ignore_info = { kind: d.kind, reason: msg.reason, until, at: new Date().toISOString() };
        this._rev++;
      }
      this.decide = null;
    } catch (err) { this.error = err?.message || String(err); this.decide = null; }
    this.render();
  }

  findingsCard(key) {
    const list = this.data.findings.filter(f => this.findingKey(f) === key);
    if (!list.length) return "";
    const hideButton = f => this.decide && this.decide.key === f.key ? this.decideForm(f)
      : `<button class="btn" data-decide-open="${this.esc(f.key)}"><ha-icon icon="mdi:eye-off-outline"></ha-icon>${this.t("hideFinding")}</button>`;
    const rows = list.map(f => `<div class="finding"><div><strong>${this.esc(this.findingTitle(f))}</strong><small>${this.pill(f.classification)} ${this.t("certainty")}: ${Math.round(f.confidence * 100)} %${f.ignored ? ` · ${this.esc(f.mark ? this.markLine(f.mark) : this.decisionLabel(f))}` : ""}${f.resurfaced ? ` · ${this.t("dueLabel")}` : ""}</small>${f.impact ? `<small>${this.esc(this.impactLine(f))}</small>` : ""}${this.corrLine(f.key) ? `<small>${this.corrLine(f.key)}</small>` : ""}${f.ignored_by === "label" ? `<small>${this.t("ignoredByLabel")}</small>` : ""}</div>${f.ignored_by === "label" || f.ignored_by === "mark" ? "" : f.ignored ? `<button class="btn" data-ignore="${this.esc(f.key)}" data-ignore-value="0"><ha-icon icon="mdi:eye-outline"></ha-icon>${this.t("showFinding")}</button>` : hideButton(f)}</div>`).join("");
    return `<section class="panel"><div class="panelhead"><h2>${this.t("findingsOfObject")} (${list.length})</h2></div>${rows}</section>`;
  }
}
