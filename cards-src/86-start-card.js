// The start time card: how long the last start of Home Assistant took against the usual, the last starts as bars and
// the integrations that took longest. The figures are those of the start page of the panel; they come from the
// sensor "start time" and its attributes.
class HKStartCard extends HKCard {
  static tag = "ha-housekeeper-start-card";
  static pickerName = "HA Housekeeper: Start time";
  static pickerDescription = "How long the last start took against the usual, the last starts and the integrations that took longest.";
  static get defaults() { return { history: "14", slowest: 3 }; }

  static editorSchema(t) {
    return [
      { name: "history", selector: { select: { mode: "dropdown", options: ["14", "30", "7", "0"].map(value => ({ value, label: t(`edit_history_${value}`) })) } } },
      { name: "slowest", selector: { number: { min: 0, max: 10, mode: "box" } } },
    ];
  }

  get titleKey() { return "cardStTitle"; }
  watchedIds() { return [this.idOf("start_time")].filter(Boolean); }
  data() { return this.stateOf("start_time")?.attributes || {}; }
  seconds() { const value = Number(this.stateOf("start_time")?.state); return Number.isFinite(value) ? value : null; }
  hasData() { return this.seconds() !== null; }
  attention() { return this.hasData() && this.data().slower ? 1 : 0; }
  // Quiet is: the start took about as long as usual.
  isQuiet() { return this.hasData() && !this.data().slower; }

  duration(seconds) {
    const total = Math.round(seconds), m = Math.floor(total / 60), s = total % 60;
    return m ? this.t("cardDurMin", { m, s }) : this.t("cardDurSec", { s });
  }

  // The last starts as bars, the last one in colour; the height is the share of the longest start shown.
  bars(history, slower) {
    const count = Number(this._config.history);
    if (!count || !Array.isArray(history) || history.length < 2) return "";
    const rows = history.slice(-count), top = Math.max(...rows, 1);
    return `<div class="hk-bars">${rows.map((value, i) => `<i class="${i === rows.length - 1 ? (slower ? "hi" : "now") : ""}" style="height:${Math.max(6, Math.round((value / top) * 100))}%"></i>`).join("")}</div>`;
  }

  slowestHtml(list) {
    const rows = (list || []).slice(0, Number(this._config.slowest) || 0);
    if (!rows.length) return "";
    return `<div class="hk-sec top">${this.esc(this.t("cardStSlowest"))}</div>${rows.map(item => `<div class="hk-row r2"><div class="hk-name"><b>${this.esc(item.name)}</b>${item.state && item.state !== "loaded" ? `<small>${this.esc(this.t("cardStNotLoaded"))}</small>` : ""}</div><div class="hk-right"><b class="${item === rows[0] && this.data().slower ? "warnt" : ""}">${this.esc(this.duration(item.seconds))}</b></div></div>`).join("")}`;
  }

  renderBody() {
    const data = this.data(), seconds = this.seconds(), ago = this.ago(data.started_at);
    const sub = ago ? this.t("cardStLast", { ago }) : "";
    if (this.isQuiet()) {
      return this.head(this.t("cardStQuietSub", { took: this.duration(seconds) }), `<span class="hk-chip">${this.esc(this.t("cardStNormal"))}</span>`) + this.foot("", "view=storage");
    }
    const chip = data.change_percent != null ? `<span class="hk-chip warn">${this.esc(this.t("cardStSlower", { n: data.change_percent }))}</span>` : "";
    const usual = data.usual_seconds != null ? `<span>${this.esc(this.t("cardStUsual", { usual: this.duration(data.usual_seconds) }))}</span>` : "";
    return this.head(sub, chip, true) + `<div class="hk-big"><b>${this.esc(this.duration(seconds))}</b>${usual}</div>` + this.bars(data.history, data.slower) + this.slowestHtml(data.slowest) + this.foot("", "view=storage");
  }
}
