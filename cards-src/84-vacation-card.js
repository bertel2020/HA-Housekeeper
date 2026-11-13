// The vacation mode card: whether the mode is on, where it comes from, how many failures it holds back and how long the
// grace period after it is. Pure display: the switch belongs to the helper or the calendar the person chose, so the card
// has none. Without a vacation mode it is hidden (in the editor only a placeholder). When the switch is a calendar, the
// card reads "since" and "until" from that calendar's own attributes; a helper has no end.
class HKVacationCard extends HKCard {
  static tag = "ha-housekeeper-vacation-card";
  static pickerName = "HA Housekeeper: Vacation mode";
  static pickerDescription = "Shows while the vacation mode is on: the source, the period and how many failures are held back.";
  static get defaults() { return { quiet: "hide", numbers: true, source: true }; }

  static editorSchema() {
    return [
      { name: "numbers", selector: { boolean: {} } },
      { name: "source", selector: { boolean: {} } },
    ];
  }

  get titleKey() { return "cardVaTitle"; }
  data() { return this.stateOf("vacation")?.attributes || {}; }
  verdict() { return this.stateOf("vacation")?.state; }
  watchedIds() { return [this.idOf("vacation"), this.data().entity].filter(Boolean); }
  hasData() { return ["off", "on", "after", "unset"].includes(this.verdict()); }
  attention() { return 0; }
  // Quiet is: there is no vacation mode to show.
  isQuiet() { return this.verdict() !== "on" && this.verdict() !== "after"; }
  hiddenKey() { return "cardVaHidden"; }

  source() {
    const entity = this.data().entity, state = entity && this._hass?.states?.[entity];
    return { id: entity, state, name: state?.attributes?.friendly_name || entity || "", calendar: Boolean(entity?.startsWith("calendar.")) };
  }

  // A time of a calendar ("2026-11-17 00:00:00", local) as a Date, or null.
  when(value) {
    const date = new Date(String(value || "").replace(" ", "T"));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  day(date) {
    try { return new Intl.DateTimeFormat(this.lang, { day: "numeric", month: "short" }).format(date); } catch (_) { return date.toDateString(); }
  }

  // The end of a calendar event as the last day of the absence: an all-day event ends at midnight of the day after it.
  lastDay(end, allDay) {
    if (!end || !allDay || end.getHours() || end.getMinutes() || end.getSeconds()) return end;
    const day = new Date(end);
    day.setDate(day.getDate() - 1);
    return day;
  }

  fact(label, value, sub) {
    return `<div class="hk-fact"><div class="l">${this.esc(label)}</div><div class="v">${this.esc(value)}</div>${sub ? `<div class="s">${this.esc(sub)}</div>` : ""}</div>`;
  }

  facts(data, since, until) {
    if (!this._config.numbers) return "";
    const cells = [];
    if (since) {
      const left = until ? Math.max(0, Math.ceil((until - Date.now()) / 86400000)) : null;
      cells.push(this.fact(this.t("cardVaSince"), this.day(since), left == null ? "" : this.t("cardVaLeft", { n: left, count: left })));
    }
    cells.push(this.fact(this.t("cardVaHeld"), String(data.held ?? 0), this.t("cardVaHeldSub")));
    if (data.grace_hours != null) cells.push(this.fact(this.t("cardVaGrace"), this.t("cardVaGraceHours", { n: data.grace_hours }), this.t("cardVaGraceSub")));
    return `<div class="hk-facts n${cells.length}">${cells.join("")}</div>`;
  }

  renderBody() {
    const data = this.data(), verdict = this.verdict(), src = this.source(), link = "view=exceptions";
    if (verdict === "unset") return this.head(this.t("cardVaUnset"), `<span class="hk-chip">${this.esc(this.t("cardVaChipOff"))}</span>`) + this.foot("", link);
    if (verdict === "off") return this.head(this.t("cardVaOff"), `<span class="hk-chip">${this.esc(this.t("cardVaChipOff"))}</span>`) + this.foot("", link);
    const attrs = src.calendar && src.state?.attributes || {}, since = this.when(attrs.start_time), until = this.when(attrs.end_time);
    let sub = "", chip;
    if (verdict === "after") {
      const end = new Date(data.after_until);
      sub = this.t("cardVaAfterSub", { until: Number.isNaN(end.getTime()) ? "" : this.day(end) }).replace(/\.\.$/, "."); // a short month already ends in a full stop
      chip = this.t("cardVaChipAfter");
    } else {
      if (this._config.source && src.name) sub = this.t(src.calendar ? "cardVaSourceCal" : "cardVaSource", { name: src.name });
      const last = this.lastDay(until, attrs.all_day);
      chip = last ? this.t("cardVaChipUntil", { date: this.day(last) }) : this.t("cardVaChipOn");
    }
    const rules = data.rules && this._config.numbers
      ? `<div class="hk-note">${this.esc(this.t("cardVaRules", { n: data.rules }))} <small>${this.esc(this.t("cardVaRestore"))}</small></div>` : "";
    return this.head(sub, `<span class="hk-chip warn">${this.esc(chip)}</span>`, true) + this.facts(data, verdict === "on" ? since : null, until) + rules + this.foot("", link);
  }
}
