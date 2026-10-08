// FindingsMixin: methods of the panel element, mixed into the class in 99-register.js.
class FindingsMixin {
  sortedFindings(includeIgnored = false) {
    const { plain } = this.collators();
    return this.data.findings.filter(f => includeIgnored || !f.ignored).sort((a, b) => (b.confidence - a.confidence)
      || plain.compare(String(a.object_id), String(b.object_id)));
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
    return `<button class="row ${finding.ignored ? "dim" : ""}" data-object="${this.esc(key)}">${this.tile(object?.object_type || "entity", this.tone(finding.classification))}<span class="row-text"><strong>${this.esc(title)}</strong><small>${subtitle}${finding.ignored ? ` · ${this.t("ignoredLabel")}` : ""}${finding.first_detected_at ? `<span class="msince"> · ${this.t("sortSince")} ${this.formatDate(finding.first_detected_at)}</span>` : ""}</small></span>${this.pill(finding.classification)}<span class="date">${finding.first_detected_at ? this.formatDate(finding.first_detected_at) : ""}</span></button>`;
  }

  findingSorts() {
    return [
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
    const byClass = this.findingFilter ? all.filter(f => f.classification === this.findingFilter) : all;
    this.lvState("findings", "certainty", "desc");
    return this.refine("findings", byClass, {
      text: f => [this.findObject(this.findingKey(f))?.name, f.object_id, f.rule_id, f.affected_object].join(" "),
      filters: { type: (f, v) => this.findingType(f) === v },
      sorts: this.findingSorts(), tie: f => f.object_id,
    });
  }

  exportRows() {
    const list = this.visibleFindings();
    return list.map(f => {
      const key = this.findingKey(f), object = this.findObject(key);
      return {
        rule_id: f.rule_id, classification: f.classification, confidence: f.confidence,
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
    const list = this.visibleFindings();
    const types = [...new Set(all.map(f => this.findingType(f)))].sort();
    const bar = this.listBar("findings", { sorts: this.findingSorts(), filters: [{ name: "type", all: this.t("allTypes"), options: types.map(x => [x, this.t(x)]) }] });
    const pg = this.paginate("findings", list);
    const h = this.health();
    const classTone = c => { const tone = this.tone(c); return tone === "red" ? "red" : tone === "warn" ? "warn" : "mute"; };
    const tiles = this.sumTiles([
      { label: this.t("health"), value: `${h.percent} %`, sub: this.t("findSumAffected", { n: this.formatNumber(h.affected), m: this.formatNumber(h.base) }), tone: h.tone },
      { label: this.t("all"), value: this.formatNumber(all.length), tone: all.length ? "warn" : "ok", filter: "", active: !this.findingFilter },
      ...classes.map(c => ({ label: this.t(c), value: this.formatNumber(all.filter(f => f.classification === c).length), tone: classTone(c), filter: c, active: this.findingFilter === c })),
    ]);
    return `<div class="stack">${tiles}<div class="panel"><div class="chips">${ignoredCount ? `<button class="chip ${this.showIgnored ? "active" : ""}" data-toggle-ignored>${this.t("showIgnored")} (${ignoredCount})</button>` : ""}<span class="spacer"></span><button class="chip" data-export="csv" title="${this.t("exportTitle")}">${this.t("exportCsv")}</button><button class="chip" data-export="json" title="${this.t("exportTitle")}">${this.t("exportJson")}</button></div>
      ${bar}${list.length ? pg.rows.map(f => this.findingRow(f)).join("") : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t(all.length ? "noMatches" : "noFindings")}</div>`}${pg.footer}</div></div>`;
  }

  findingTitle(f) {
    const sub = f.rule_id.split(".")[1] || f.rule_id;
    if (sub.startsWith("missing_")) return `${this.t(sub)}: ${f.affected_object}`;
    if (f.rule_id === "entity.possible_duplicate") return `${this.t("duplicateOf")} ${f.affected_object}`;
    const text = this.t(f.rule_id);
    return text === f.rule_id ? this.t(sub) : text;
  }

  findingsCard(key) {
    const list = this.data.findings.filter(f => this.findingKey(f) === key);
    if (!list.length) return "";
    const rows = list.map(f => `<div class="finding"><div><strong>${this.esc(this.findingTitle(f))}</strong><small>${this.pill(f.classification)} ${this.t("certainty")}: ${Math.round(f.confidence * 100)} %${f.ignored ? ` · ${this.t("ignoredLabel")}` : ""}</small>${f.ignored_by === "label" ? `<small>${this.t("ignoredByLabel")}</small>` : ""}</div>${f.ignored_by === "label" ? "" : `<button class="btn" data-ignore="${this.esc(f.key)}" data-ignore-value="${f.ignored ? 0 : 1}"><ha-icon icon="${f.ignored ? "mdi:eye-outline" : "mdi:eye-off-outline"}"></ha-icon>${this.t(f.ignored ? "showFinding" : "hideFinding")}</button>`}</div>`).join("");
    return `<section class="panel"><div class="panelhead"><h2>${this.t("findingsOfObject")} (${list.length})</h2></div>${rows}</section>`;
  }
}
