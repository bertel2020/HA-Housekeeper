// The backup card: how old the newest backup is, whether a copy lies off the device and the last week as a strip. The
// verdict and the figures come from the sensor "backup protection" and its attributes, which the scan fills from the
// backup report; the limits are those of the backup protection in the panel. Red is only for a missing protection.
class HKBackupCard extends HKCard {
  static tag = "ha-housekeeper-backup-card";
  static pickerName = "HA Housekeeper: Backup";
  static pickerDescription = "How old the newest backup is, whether a copy lies off the device and the last week.";
  static get defaults() { return { history: "7", facts: true }; }

  static editorSchema(t) {
    return [
      { name: "history", selector: { select: { mode: "dropdown", options: ["7", "0"].map(value => ({ value, label: t(`edit_history_${value}`) })) } } },
      { name: "facts", selector: { boolean: {} } },
    ];
  }

  get titleKey() { return "cardBkTitle"; }
  watchedIds() { return [this.idOf("backup")].filter(Boolean); }
  data() { return this.stateOf("backup")?.attributes || {}; }
  verdict() { return this.stateOf("backup")?.state; }
  hasData() { return ["ok", "warn", "bad", "unclear"].includes(this.verdict()); }
  attention() { return ["warn", "bad"].includes(this.verdict()) ? 1 : 0; }
  // Quiet is: the backups are in order.
  isQuiet() { return this.verdict() === "ok"; }

  // "9 h" under two days, then days.
  age(hours) {
    return hours < 48 ? this.t("cardBkHours", { n: Math.round(hours), count: Math.round(hours) }) : this.t("cardBkDays", { n: Math.round(hours / 24), count: Math.round(hours / 24) });
  }

  size(bytes) {
    const big = bytes >= 1024 ** 3;
    try {
      return new Intl.NumberFormat(this.lang, { style: "unit", unit: big ? "gigabyte" : "megabyte", unitDisplay: "short", maximumFractionDigits: big ? 1 : 0 }).format(bytes / (big ? 1024 ** 3 : 1024 ** 2));
    } catch (_) { return `${Math.round(bytes / 1024 ** 2)} MB`; }
  }

  // The sentence under the title: what is wrong, in the order of weight; else when the last backup was made.
  reason(data) {
    if (data.age_hours == null) return this.t("cardBkNone");
    if (data.external_copy === false) return this.t("cardBkNoCopy");
    if (data.limit_hours != null && data.age_hours > data.limit_hours) return this.t("cardBkOld", { age: this.age(data.age_hours) });
    if (data.last_run_failed) return this.t("cardBkRunFailed");
    if (data.failed_days) return this.t("cardBkCopyFailed");
    if (data.size_unusual) return this.t("cardBkSizeOdd");
    return this.t("cardBkCheck");
  }

  fact(label, value, sub, tone = "") {
    return `<div class="hk-fact"><div class="l">${this.esc(label)}</div><div class="v ${tone}">${this.esc(value)}</div>${sub ? `<div class="s">${this.esc(sub)}</div>` : ""}</div>`;
  }

  facts(data) {
    if (!this._config.facts) return "";
    const cells = [];
    if (data.age_hours != null) {
      const old = data.limit_hours != null && data.age_hours > data.limit_hours;
      cells.push(this.fact(this.t("cardBkAge"), this.age(data.age_hours), data.limit_hours != null ? this.t("cardBkLimit", { age: this.age(data.limit_hours) }) : "", old ? "warnt" : "good"));
    }
    if (data.external_copy != null) {
      cells.push(this.fact(this.t("cardBkExternal"), this.t(data.external_copy ? "cardBkYes" : "cardBkNo"), data.external_count ? this.t("cardBkPlaces", { n: data.external_count, count: data.external_count }) : "", data.external_copy ? "good" : "badt"));
    }
    if (data.failed_days) cells.push(this.fact(this.t("cardBkFailed"), String(data.failed_days), this.t("cardBkInWeek"), "warnt"));
    else if (data.size != null) cells.push(this.fact(this.t("cardBkSize"), this.size(data.size), data.size_unusual == null ? "" : this.t(data.size_unusual ? "cardBkSizeUnusual" : "cardBkSizeUsual"), data.size_unusual ? "warnt" : ""));
    return cells.length ? `<div class="hk-facts n${cells.length}">${cells.join("")}</div>` : "";
  }

  // One cell a day, the oldest first: a backup, a backup that did not reach every target, no backup.
  strip(days) {
    if (this._config.history === "0" || !Array.isArray(days) || !days.length) return "";
    const cls = { ok: "", failed: "flapping", none: "none" };
    return `<div class="hk-stripbox"><div class="hk-strip">${days.map(day => `<i class="${cls[day] ?? "none"}"></i>`).join("")}</div><div class="hk-striplab"><span>${this.esc(this.t("cardBkDaysAgo", { n: days.length - 1, count: days.length - 1 }))}</span><span>${this.esc(this.t("cardBkToday"))}</span></div></div>`;
  }

  renderBody() {
    const data = this.data(), verdict = this.verdict(), ago = this.ago(data.newest_at);
    if (verdict === "unclear") {
      return this.head(this.t(data.outside ? "cardBkOutside" : "cardBkUnclear"), `<span class="hk-chip">${this.esc(this.t("cardBkUnclearChip"))}</span>`) + this.foot("", "view=maintenance&tab=backup");
    }
    const last = ago ? this.t("cardBkLast", { ago }) : this.t("cardBkNone");
    if (verdict === "ok") {
      return this.head(last, `<span class="hk-chip">${this.esc(this.t("cardBkOk"))}</span>`) + this.foot("", "view=maintenance&tab=backup");
    }
    const chip = `<span class="hk-chip ${verdict === "bad" ? "bad" : "warn"}">${this.esc(this.t(verdict === "bad" ? "cardBkBad" : "cardBkWarn"))}</span>`;
    const foot = data.external_copy === false ? this.t("cardBkNoCopyNote") : data.encrypted ? this.t("cardBkEncrypted") : "";
    return this.head(this.reason(data), chip, true) + this.facts(data) + this.strip(data.history) + this.foot(foot, "view=maintenance&tab=backup");
  }
}
