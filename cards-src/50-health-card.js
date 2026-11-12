// The health card: how the house is doing at a glance, without opening the panel. The numbers are those of the
// tiles on the overview page of the panel; they come from the sensor "house health" and its attributes.
const HK_TOPICS = ["down", "broken_references", "failing_automations", "unneeded"];

class HKHealthCard extends HKCard {
  static tag = "ha-housekeeper-health-card";
  static pickerName = "HA Housekeeper: House health";
  static pickerDescription = "How the house is doing: what is down, broken, failing or no longer needed, and what changed since the last scan.";
  static get defaults() { return { tiles: "findings", changes: true, scan_button: true }; }

  static editorSchema(t) {
    return [
      { name: "tiles", selector: { select: { mode: "dropdown", options: ["findings", "always", "never"].map(value => ({ value, label: t(`edit_tiles_${value}`) })) } } },
      { name: "changes", selector: { boolean: {} } },
      { name: "scan_button", selector: { boolean: {} } },
    ];
  }

  watchedIds() { return ["house_health", "scan_health", "activity", "last_scan"].map(key => this.idOf(key)).filter(Boolean); }

  // Where the numbers come from: the state of the house, the health of the scans and what Housekeeper does right now.
  health() { return this.stateOf("house_health"); }
  scanState() { return this.stateOf("scan_health")?.state; }
  scanBroken() { return ["failed", "stale"].includes(this.scanState()); }
  scanning() { return this.stateOf("activity")?.state === "scanning"; }

  hasData() { return Boolean(this.health()) && !["unknown", "unavailable"].includes(this.health().state); }
  // Quiet is: nothing is due and the scans run. A card that cannot trust its numbers never hides.
  isQuiet() { return this.hasData() && this.health().state === "ok" && !this.scanBroken(); }

  // The colour of the dot and the sentence beside it.
  verdict() {
    const attrs = this.health().attributes || {}, n = attrs.objects || 0;
    if (this.scanBroken()) return { tone: "bad", glyph: "!", text: this.t("cardHealthScanBad") };
    if (this.health().state === "urgent") return { tone: "bad", glyph: "!", text: this.t("cardHealthUrgent") };
    if (this.health().state === "attention") return { tone: "warn", glyph: "!", text: this.t("cardHealthAttention", { n, count: n }) };
    return { tone: "ok", glyph: "✓", text: this.t("cardHealthOk") };
  }

  tile(name, topics) {
    const info = topics[name] || {}, n = info.objects || 0;
    const tone = n && info.level === "high" ? "bad" : n && info.level === "medium" ? "warn" : n ? "" : "zero";
    const go = this._config.tap !== "none" && this._hass?.user?.is_admin && n;
    const link = go ? ` data-hk-panel="view=findingsNav&amp;filter=topic:${name}"` : "";
    return `<div class="hk-tile ${tone}${go ? " go" : ""}"${link}><div class="n">${this.esc(n)}</div><div class="l">${this.esc(this.t(`cardTopic_${name}`))}</div></div>`;
  }

  // What changed since the scan before: "+2 new · −1 fixed", or the plain statement that nothing did.
  changesHtml(attrs, any) {
    if (!this._config.changes || attrs.new == null) return "";
    const parts = [attrs.new ? `<span class="hk-up">${this.esc(this.t("cardNew", { n: attrs.new }))}</span>` : "", attrs.resolved ? `<span class="hk-down">${this.esc(this.t("cardResolved", { n: attrs.resolved }))}</span>` : ""].filter(Boolean);
    return parts.length ? `${this.esc(this.t("cardSince"))} ${parts.join(" · ")}` : any ? this.esc(this.t("cardNoChanges")) : "";
  }

  renderBody() {
    const attrs = this.health().attributes || {}, topics = attrs.topics || {};
    const verdict = this.verdict(), scanAgo = this.ago(this.stateOf("last_scan")?.state);
    const subtitle = this.scanBroken() ? this.t("cardScanOld") : scanAgo ? this.t("cardLastScan", { ago: scanAgo }) : "";
    const title = this._config.title, busy = this.scanning();
    const button = this._config.scan_button && this._hass?.user?.is_admin && this.idOf("scan", "button")
      ? `<button type="button" class="hk-btn" data-hk-act="scan"${busy ? " disabled" : ""}>${this.esc(busy ? this.t("cardScanning") : `⟳ ${this.t("cardScan")}`)}</button>` : "";
    const head = this.head(title ? [verdict.text, subtitle].filter(Boolean).join(" · ") : subtitle, button, false, `<span class="hk-dot ${verdict.tone}">${verdict.glyph}</span>`, title || verdict.text);
    const any = HK_TOPICS.some(name => (topics[name]?.objects || 0) > 0);
    const tiles = this._config.tiles === "always" || (this._config.tiles === "findings" && any)
      ? `<div class="hk-tiles">${HK_TOPICS.map(name => this.tile(name, topics)).join("")}</div>` : "";
    const left = [any || this.scanBroken() ? "" : this.esc(this.t("cardNoFindings")), this.changesHtml(attrs, any)].filter(Boolean).join(" · ");
    return head + tiles + this.footHtml(left, "");
  }

  // The scan button: the same entity the panel and automations use.
  act(name) {
    const id = this.idOf("scan", "button");
    if (name === "scan" && id && this._hass?.user?.is_admin && !this.scanning()) this._hass.callService("button", "press", { entity_id: id });
  }
}
