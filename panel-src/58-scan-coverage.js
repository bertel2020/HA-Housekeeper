// What the last scan read and what it could not (the coverage of the sources): a line in the overview,
// a list in Settings > Info. Mixed into the panel in 99-register.js.
Object.assign(TEXT.de, {
  covLine: "Prüfung: {n} von {m} Quellen",
  covAll: "Prüfung: alle {m} Quellen gelesen", covBar: "Scan vollständig",
  covGaps: "Nicht vollständig gelesen: {list}. Befunde dort fehlen in den Zahlen.", covRetry: "Housekeeper versucht es in {n} Minuten noch einmal.",
  covDetails: "Details",
  covListTitle: "Was zuletzt geprüft wurde",
  covListHint: "Scan von {date}. Quellen mit Lücke stehen oben. „Nicht vorhanden“ heißt: Diese Quelle gibt es in deiner Installation nicht.",
  covPartial: "{read} gelesen, {failed} nicht",
  covUnread: "{n} Objekte aus nicht gelesenen Quellen zählen weder als neu noch als entfernt.",
  covSrc_registry: "Register (Entitäten, Geräte, Bereiche)",
  covSrc_automations: "Automationen, Skripte und Szenen",
  covSrc_blueprints: "Blueprint-Dateien",
  covSrc_dashboards: "Dashboards",
  covSrc_energy: "Energie-Dashboard",
  covSrc_apps: "Apps",
  covSrc_statistics: "Langzeitstatistik",
  covSrc_database: "Datenbank-Größe",
  covState_checked: "Gelesen",
  covState_partial: "Teilweise",
  covState_skipped: "Übersprungen",
  covState_absent: "Nicht vorhanden",
  covState_unknown: "Unbekannt",
  covReason_no_supervisor: "Kein Supervisor",
  covReason_not_reachable: "Supervisor antwortet nicht",
  covReason_no_recorder: "Kein Recorder",
  covReason_not_ready: "Noch nicht bereit",
  covReason_unavailable: "Nicht verfügbar",
  covReason_unreadable: "Nicht lesbar",
  covReason_not_set_up: "Nicht eingerichtet",
  covReason_resources_unknown: "Dashboard-Ressourcen unbekannt",
  covReason_automation_not_ready: "Automationen noch nicht bereit",
  covReason_script_not_ready: "Skripte noch nicht bereit",
  covItemReason_invalid: "Konfiguration ungültig",
  covItemReason_error: "Konnte nicht geladen werden",
  covItems: "Nicht lesbar: {list}",
  covCount_entities: "{n} Entitäten", covCount_devices: "{n} Geräte", covCount_areas: "{n} Bereiche", covCount_automations: "{n} Automationen", covCount_scripts: "{n} Skripte", covCount_scenes: "{n} Szenen", covCount_dashboards: "{n} Dashboards", covCount_apps: "{n} Apps", covCount_statistics: "{n} Statistiken",
  endedUncheckedSrc: "Quelle nicht gelesen: {source}",
});
Object.assign(TEXT.en, {
  covLine: "Check: {n} of {m} sources",
  covAll: "Check: all {m} sources read", covBar: "Scan complete",
  covGaps: "Not read in full: {list}. Findings there are missing from the numbers.", covRetry: "Housekeeper tries again in {n} minutes.",
  covDetails: "Details",
  covListTitle: "What was checked last",
  covListHint: "Scan of {date}. Sources with a gap come first. \"Not present\" means this source does not exist in your installation.",
  covPartial: "{read} read, {failed} not",
  covUnread: "{n} objects of sources that were not read count neither as new nor as removed.",
  covSrc_registry: "Registry (entities, devices, areas)",
  covSrc_automations: "Automations, scripts and scenes",
  covSrc_blueprints: "Blueprint files",
  covSrc_dashboards: "Dashboards",
  covSrc_energy: "Energy dashboard",
  covSrc_apps: "Apps",
  covSrc_statistics: "Long-term statistics",
  covSrc_database: "Database size",
  covState_checked: "Read",
  covState_partial: "Partly",
  covState_skipped: "Skipped",
  covState_absent: "Not present",
  covState_unknown: "Unknown",
  covReason_no_supervisor: "No Supervisor",
  covReason_not_reachable: "Supervisor does not answer",
  covReason_no_recorder: "No recorder",
  covReason_not_ready: "Not ready yet",
  covReason_unavailable: "Not available",
  covReason_unreadable: "Not readable",
  covReason_not_set_up: "Not set up",
  covReason_resources_unknown: "Dashboard resources unknown",
  covReason_automation_not_ready: "Automations not ready yet",
  covReason_script_not_ready: "Scripts not ready yet",
  covItemReason_invalid: "Configuration invalid",
  covItemReason_error: "Could not be loaded",
  covItems: "Not readable: {list}",
  covCount_entities: "{n} entities", covCount_devices: "{n} devices", covCount_areas: "{n} areas", covCount_automations: "{n} automations", covCount_scripts: "{n} scripts", covCount_scenes: "{n} scenes", covCount_dashboards: "{n} dashboards", covCount_apps: "{n} apps", covCount_statistics: "{n} statistics",
  endedUncheckedSrc: "Source not read: {source}",
});

// The source behind an owner type of a finding: what "not checked" means for it.
const SCAN_SOURCE_OF_TYPE = { dashboard: "dashboards", app: "apps" };

class ScanCoverageMixin {
  scanCoverageItems() { return this.data?.meta?.coverage || []; }

  // The sources that are missing something: skipped, partial or never reached. Absent ones are not a gap.
  scanCoverageGaps() { return this.scanCoverageItems().filter(c => ["skipped", "partial", "unknown"].includes(c.state)); }

  scanCoverageLabel(item) {
    const reason = item.reason ? this.t(`covReason_${item.reason}`) : "";
    const part = item.state === "partial" && item.failed ? this.t("covPartial", { read: item.read ?? 0, failed: item.failed }) : "";
    return [reason, part].filter(Boolean).join(" · ");
  }

  // What a read source contained: "412 Entitäten, 58 Geräte".
  scanCoverageCountsLabel(item) {
    return Object.entries(item.counts || {}).map(([key, n]) => this.t(`covCount_${key}`, { n: this.formatNumber(n) })).join(", ");
  }

  // The objects of a partly read source that failed, each with its category: "keller (Konfiguration ungültig)".
  scanCoverageItemsLabel(item) {
    if (!item.items?.length) return "";
    const list = item.items.map(i => `${i.id} (${this.t(`covItemReason_${i.reason}`)})`).join(", ");
    return this.t("covItems", { list });
  }

  // One row in the overview, grey while everything was read and yellow with the names once something was not.
  scanCoverageComplete() {
    const items = this.scanCoverageItems().filter(c => c.state !== "absent");
    return items.length > 0 && !this.scanCoverageGaps().length;
  }

  scanCoverageLine() {
    const items = this.scanCoverageItems().filter(c => c.state !== "absent");
    if (!items.length) return "";
    const gaps = this.scanCoverageGaps(), read = items.length - gaps.length;
    if (!gaps.length) return ""; // A complete check is one item in the bar under the menu (safetyItems).
    const text = gaps.length ? this.t("covLine", { n: read, m: items.length }) : this.t("covAll", { m: items.length });
    const list = gaps.map(c => this.t(`covSrc_${c.source}`)).join(", ");
    return `<div class="panel u-mb14" data-coverage><div class="row"><span class="tile ${gaps.length ? "warn" : "mute"}"><ha-icon icon="${gaps.length ? "mdi:shield-alert-outline" : "mdi:shield-check-outline"}"></ha-icon></span><span class="row-text"><strong>${this.esc(text)}</strong>${gaps.length ? `<small>${this.esc(this.t("covGaps", { list }))}${this.data?.meta?.coverage_retry_minutes ? ` ${this.esc(this.t("covRetry", { n: this.data.meta.coverage_retry_minutes }))}` : ""}</small>` : ""}</span><button class="btn" data-cov-details>${this.t("covDetails")}</button></div></div>`;
  }

  // The list in Settings > Info: every source with its state, the reason and the time of the scan; gaps first.
  scanCoverageCard() {
    const items = this.scanCoverageItems();
    if (!items.length) return "";
    const rank = { skipped: 0, partial: 1, unknown: 2, checked: 3, absent: 4 };
    const rows = [...items].sort((a, b) => rank[a.state] - rank[b.state]).map(c => {
      const tone = c.state === "checked" ? "ok" : c.state === "absent" ? "mute" : "warn";
      const reason = this.scanCoverageLabel(c);
      return `<div class="row" data-coverage-source="${this.esc(c.source)}"><span class="tile mute"><ha-icon icon="mdi:shield-search"></ha-icon></span><span class="row-text"><strong>${this.t(`covSrc_${c.source}`)}</strong>${reason ? `<small>${this.esc(reason)}</small>` : ""}${[this.scanCoverageCountsLabel(c), this.scanCoverageItemsLabel(c)].filter(Boolean).map(t => `<small>${this.esc(t)}</small>`).join("")}</span><span class="pill ${tone}">${this.t(`covState_${c.state}`)}</span></div>`;
    }).join("");
    const at = this.data?.meta?.scanned_at ? this.formatDate(this.data.meta.scanned_at) : "–";
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("covListTitle")}</h2><p>${this.t("covListHint", { date: at })}</p></div></div>${rows}</section>`;
  }

  // "not checked" with the source that was not read, where the owner type tells which one.
  endedSourceLabel(f) {
    const source = SCAN_SOURCE_OF_TYPE[f.rule_id.split(".")[0]];
    return source ? this.t("endedUncheckedSrc", { source: this.t(`covSrc_${source}`) }) : this.t("endedUnchecked");
  }
}

// Simplified Chinese texts; merged into TEXT.
Object.assign(TEXT.zh, {
  "covLine": "检查：{n}/{m} 个来源",
  "covAll": "检查：已读取全部 {m} 个来源",
  "covBar": "扫描完成",
  "covGaps": "未完整读取：{list}。其中的发现项未计入统计数字。",
  "covRetry": "Housekeeper 将在 {n} 分钟后重试。",
  "covDetails": "详情",
  "covListTitle": "上次检查的内容",
  "covListHint": "扫描时间 {date}。有缺口的来源排在前面。「不存在」表示你的安装中没有此来源。",
  "covPartial": "已读取 {read} 个，未读取 {failed} 个",
  "covUnread": "未读取来源中的 {n} 个对象既不计为新增，也不计为移除。",
  "covSrc_registry": "注册表（实体、设备、区域）",
  "covSrc_automations": "自动化、脚本和场景",
  "covSrc_blueprints": "蓝图文件",
  "covSrc_dashboards": "仪表板",
  "covSrc_energy": "能源仪表板",
  "covSrc_apps": "应用",
  "covSrc_statistics": "长期统计",
  "covSrc_database": "数据库大小",
  "covState_checked": "已读取",
  "covState_partial": "部分读取",
  "covState_skipped": "已跳过",
  "covState_absent": "不存在",
  "covState_unknown": "未知",
  "covReason_no_supervisor": "无 Supervisor",
  "covReason_not_reachable": "Supervisor 无响应",
  "covReason_no_recorder": "无记录器",
  "covReason_not_ready": "尚未就绪",
  "covReason_unavailable": "不可用",
  "covReason_unreadable": "无法读取",
  "covReason_not_set_up": "未设置",
  "covReason_resources_unknown": "仪表板资源未知",
  "covReason_automation_not_ready": "自动化尚未就绪",
  "covReason_script_not_ready": "脚本尚未就绪",
  "covItemReason_invalid": "配置无效",
  "covItemReason_error": "无法加载",
  "covItems": "无法读取：{list}",
  "covCount_entities": "{n} 个实体",
  "covCount_devices": "{n} 个设备",
  "covCount_areas": "{n} 个区域",
  "covCount_automations": "{n} 个自动化",
  "covCount_scripts": "{n} 个脚本",
  "covCount_scenes": "{n} 个场景",
  "covCount_dashboards": "{n} 个仪表板",
  "covCount_apps": "{n} 个应用",
  "covCount_statistics": "{n} 项统计",
  "endedUncheckedSrc": "来源未读取：{source}",
});
