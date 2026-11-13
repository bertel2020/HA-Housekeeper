// The database card, the simple variant: how big the database is, whether it grows fast, the line of the daily sizes
// and what the recorder keeps. Everything comes from the sensor "database size" and its attributes, which a scan reads
// from the files and from the daily sizes Housekeeper has noted; which entities write the most is on the database
// page of the panel.
// Home Assistant shows a size in the unit of the person's choice and says which one in the attribute.
const HK_BYTE_UNITS = { B: 1, kB: 1e3, MB: 1e6, GB: 1e9, TB: 1e12, KiB: 1024, MiB: 1024 ** 2, GiB: 1024 ** 3, TiB: 1024 ** 4 };

class HKDatabaseCard extends HKCard {
  static tag = "ha-housekeeper-database-card";
  static pickerName = "HA Housekeeper: Database";
  static pickerDescription = "How big the database is, whether it grows fast and what the recorder keeps.";
  static get defaults() { return { history: "30", facts: true }; }

  static editorSchema(t) {
    return [
      { name: "history", selector: { select: { mode: "dropdown", options: ["30", "90", "14", "7", "0"].map(value => ({ value, label: t(`edit_history_${value}`) })) } } },
      { name: "facts", selector: { boolean: {} } },
    ];
  }

  get titleKey() { return "cardDbTitle"; }
  watchedIds() { return [this.idOf("database_size")].filter(Boolean); }
  data() { return this.stateOf("database_size")?.attributes || {}; }
  bytes() {
    const state = this.stateOf("database_size"), value = Number(state?.state);
    return state && Number.isFinite(value) ? value * (HK_BYTE_UNITS[state.attributes?.unit_of_measurement] ?? 1) : null;
  }
  hasData() { return this.bytes() !== null; }
  attention() { return this.hasData() && !this.isQuiet() ? 1 : 0; }
  // Quiet is: it does not grow fast and the journal is not large.
  isQuiet() { return this.hasData() && !this.data().growing_fast && !this.data().wal_large; }

  // "3,4 GB" or "180 MB": gigabytes from one gigabyte on, in the number format of the language; `sign` adds + and −.
  size(bytes, sign = false) {
    const big = Math.abs(bytes) >= 1024 ** 3;
    try {
      return new Intl.NumberFormat(this.lang, { style: "unit", unit: big ? "gigabyte" : "megabyte", unitDisplay: "short", maximumFractionDigits: big ? 1 : 0, signDisplay: sign ? "exceptZero" : "auto" }).format(bytes / (big ? 1024 ** 3 : 1024 ** 2));
    } catch (_) { return `${Math.round(bytes / 1024 ** 2)} MB`; }
  }

  engine(data) {
    const name = { sqlite: "SQLite", mysql: "MariaDB/MySQL", postgresql: "PostgreSQL" }[data.dialect] || data.dialect || "";
    return [name, data.estimated ? this.t("cardDbEstimated") : ""].filter(Boolean).join(" · ");
  }

  // The daily sizes as a line with the area under it, as wide as the card.
  line(history) {
    const count = Number(this._config.history);
    const rows = count && Array.isArray(history) ? history.slice(-count) : [];
    if (rows.length < 2) return "";
    const w = 300, h = 44, lo = Math.min(...rows), hi = Math.max(...rows), span = Math.max(hi - lo, 1);
    const points = rows.map((value, i) => `${((i / (rows.length - 1)) * w).toFixed(1)} ${(h - 4 - ((value - lo) / span) * (h - 8)).toFixed(1)}`);
    return `<svg class="hk-line" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img"><path class="a" d="M${points.join(" L")} L${w} ${h} L0 ${h}Z"/><path d="M${points.join(" L")}"/></svg>`;
  }

  facts(data) {
    if (!this._config.facts) return "";
    const cells = [];
    if (data.wal_bytes != null) cells.push(`<div class="hk-fact"><div class="l">${this.esc(this.t("cardDbWal"))}</div><div class="v ${data.wal_large ? "warnt" : ""}">${this.esc(this.size(data.wal_bytes))}</div><div class="s">${this.esc(this.t(data.wal_large ? "cardDbWalBig" : "cardDbWalNormal"))}</div></div>`);
    if (data.keep_days != null) cells.push(`<div class="hk-fact"><div class="l">${this.esc(this.t("cardDbKeep"))}</div><div class="v">${this.esc(this.t("cardDbKeepDays", { n: data.keep_days, count: data.keep_days }))}</div><div class="s">Recorder</div></div>`);
    return cells.length ? `<div class="hk-facts n${cells.length}">${cells.join("")}</div>` : "";
  }

  renderBody() {
    const data = this.data(), bytes = this.bytes();
    if (this.isQuiet()) {
      return this.head(this.t("cardDbQuietSub", { size: this.size(bytes) }), `<span class="hk-chip">${this.esc(this.t("cardDbOk"))}</span>`) + this.foot("", "view=recorder");
    }
    const chip = `<span class="hk-chip warn">${this.esc(this.t(data.growing_fast ? "cardDbGrowing" : "cardDbWalLarge"))}</span>`;
    const parts = [];
    if (data.change_bytes != null && data.change_days) parts.push(this.t("cardDbGrowth", { change: this.size(data.change_bytes, true), days: data.change_days, count: data.change_days }));
    if (data.per_day > 0) parts.push(this.t("cardDbPerDay", { size: this.size(data.per_day) }));
    const big = `<div class="hk-big"><b>${this.esc(this.size(bytes))}</b>${parts.length ? `<span>${this.esc(parts.join(" · "))}</span>` : ""}</div>`;
    return this.head(this.engine(data), chip, true) + big + this.line(data.history) + this.facts(data) + this.foot("", "view=recorder");
  }
}
