// The battery card: the weakest batteries with a forecast, the next round of changes by area and what to buy for it.
// The numbers come from the sensor "weakest battery" and its attributes; the forecast is read once a day, so until it
// is there the card sorts by level and says "forecast follows".
class HKBatteryCard extends HKCard {
  static tag = "ha-housekeeper-battery-card";
  static pickerName = "HA Housekeeper: Batteries";
  static pickerDescription = "The weakest batteries with a forecast, the next round of changes by area and what to buy for it.";
  static get defaults() { return { view: "weakest", rows: 5, shopping: true, forecast: true }; }

  static editorSchema(t) {
    return [
      { name: "view", selector: { select: { mode: "dropdown", options: ["weakest", "round", "both"].map(value => ({ value, label: t(`edit_view_${value}`) })) } } },
      { name: "rows", selector: { number: { min: 3, max: 10, mode: "box" } } },
      { name: "shopping", selector: { boolean: {} } },
      { name: "forecast", selector: { boolean: {} } },
    ];
  }

  get titleKey() { return "cardBatTitle"; }
  watchedIds() { return ["battery_weakest", "battery_next_change"].map(key => this.idOf(key)).filter(Boolean); }

  data() { return this.stateOf("battery_weakest")?.attributes || {}; }
  hasData() { return Array.isArray(this.data().weakest); }
  // Quiet is: no battery is low and none is due within the round.
  isQuiet() { return this.hasData() && !this.data().low && !(this.data().round || []).length; }

  // "about 5 days", "about 3 weeks", "about 4 months": the unit that fits the distance.
  span(days) {
    if (days < 1) return this.t("cardBatSoon");
    if (days < 14) return this.t("cardBatDays", { n: days, count: days });
    if (days < 60) { const n = Math.round(days / 7); return this.t("cardBatWeeks", { n, count: n }); }
    const n = Math.round(days / 30);
    return this.t("cardBatMonths", { n, count: n });
  }

  // What the forecast of one battery says, and how far to trust it.
  outlook(item) {
    const quality = { estimate: "cardBatQEstimate", stable: "cardBatQStable", few_data: "cardBatQFew" }[item.quality];
    const text = item.quality === "low" ? this.t("cardBatLowNow")
      : item.quality === "estimate" ? this.span(item.days_left ?? 0)
      : item.quality === "stable" ? this.t("cardBatStable")
      : this.t("cardBatFollows");
    return { text, quality: quality ? this.t(quality) : "" };
  }

  tone(item) { return item.low ? "bad" : item.days_left != null && item.days_left <= (this.data().round_days || 14) ? "warn" : "ok"; }

  weakestRow(item) {
    const out = this._config.forecast ? this.outlook(item) : { text: "", quality: "" };
    const where = [item.area, item.type].filter(Boolean).join(" · ");
    const bar = item.percent == null ? "<div></div>" : `<div class="hk-bar ${this.tone(item)}"><i style="width:${Math.max(2, Math.min(100, item.percent))}%"></i></div>`;
    const percent = item.percent == null ? "" : `<b>${this.esc(item.percent)} %</b>`;
    return `<div class="hk-row r3"><div class="hk-name"><b>${this.esc(item.name)}</b>${where ? `<small>${this.esc(where)}</small>` : ""}</div>${bar}<div class="hk-right">${percent}${out.text ? `<small>${this.esc(out.text)}</small>` : ""}${out.quality ? `<span class="hk-q">${this.esc(out.quality)}</span>` : ""}</div></div>`;
  }

  // The round of the next days, by area: the nearest area first, inside it the soonest.
  roundHtml(items) {
    const groups = new Map();
    for (const item of items) {
      const key = item.area || "";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    }
    const soonest = list => Math.min(...list.map(i => i.days_left ?? 0));
    const ordered = [...groups.entries()].sort((a, b) => soonest(a[1]) - soonest(b[1]) || a[0].localeCompare(b[0]));
    return ordered.map(([area, list]) => `<div class="hk-area">${this.esc(area || this.t("cardBatNoArea"))}</div>${list.map(item => {
      const out = this.outlook(item);
      return `<div class="hk-row r2"><div class="hk-name"><b>${this.esc(item.name)}</b>${item.type ? `<small>${this.esc(item.type)}</small>` : ""}</div><div class="hk-right"><b>${this.esc(out.text)}</b></div></div>`;
    }).join("")}`).join("");
  }

  shoppingHtml(data) {
    const lines = (data.shopping || []).map(entry => `<span class="q">${this.esc(entry.count)} ×</span><span class="w"><b>${this.esc(entry.type)}</b><br><small>${this.esc(entry.names.join(", "))}</small></span>`);
    const unknown = data.unknown_type || [];
    if (unknown.length) lines.push(`<span class="q mute">${this.esc(unknown.length)}</span><span class="w"><b>${this.esc(this.t("cardBatUnknown"))}</b><br><small>${this.esc(unknown.join(", "))} · ${this.esc(this.t("cardBatUnknownHint"))}</small></span>`);
    return lines.length ? `<div class="hk-sec">${this.esc(this.t("cardBatShopping"))}</div><div class="hk-shop">${lines.join("")}</div>` : "";
  }

  // When the first battery will probably run low, said in months: "in March".
  nextText() {
    const when = Date.parse(this.stateOf("battery_next_change")?.state || "");
    if (!Number.isFinite(when) || when < Date.now() - 86400000) return "";
    const date = new Date(when), sameYear = date.getFullYear() === new Date().getFullYear();
    try { return this.t("cardBatNext", { when: new Intl.DateTimeFormat(this.lang, sameYear ? { month: "long" } : { month: "long", year: "numeric" }).format(date) }); } catch (_) { return ""; }
  }

  renderBody() {
    const data = this.data(), view = this._config.view, round = data.round || [], low = data.low || 0;
    const showWeakest = view === "weakest" || view === "both", showRound = view === "round" || view === "both";
    const chip = low ? `<span class="hk-chip warn">${this.esc(this.t("cardBatLowChip", { n: low, count: low }))}</span>` : `<span class="hk-chip">${this.esc(this.t("cardBatAllGood"))}</span>`;
    if (this.isQuiet()) {
      const sub = data.lowest == null ? "" : this.t("cardBatQuietSub", { total: data.total || 0, lowest: data.lowest });
      return this.head(sub, chip) + this.foot([this.t("cardBatQuietFoot"), this.nextText()].filter(Boolean).join(" · "), "view=batteries");
    }
    const rows = (data.weakest || []).slice(0, Number(this._config.rows) || 5);
    const sub = showWeakest ? this.t("cardBatWeakestSub", { n: rows.length, total: data.total || 0 })
      : this.t("cardBatRoundSub", { days: data.round_days || 14, n: round.length, count: round.length });
    let body = this.head(sub, chip, true);
    if (showWeakest) body += rows.map(item => this.weakestRow(item)).join("");
    if (showRound && round.length) {
      body += `<div class="hk-sec top">${this.esc(this.t("cardBatRound"))}</div>${this.roundHtml(round)}`;
      if (this._config.shopping) body += this.shoppingHtml(data);
    }
    return body + this.foot(this._config.shopping && showRound ? this.t("cardBatNoRechargeable") : "", "view=batteries");
  }
}
