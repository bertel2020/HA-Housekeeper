// The card after the update: it appears when an update was watched and says what has stopped working since, in the
// words of the watch ("since", never "because"). It shows for a few hours after the update and is hidden otherwise.
// The numbers come from the sensor "after the update" and its attributes.
class HKUpdateCard extends HKCard {
  static tag = "ha-housekeeper-update-card";
  static pickerName = "HA Housekeeper: After the update";
  static pickerDescription = "Appears after an update and shows what has stopped working since, and how long the start took.";
  static get defaults() { return { show_hours: "6", start: true }; }

  static editorSchema(t) {
    return [
      { name: "show_hours", selector: { select: { mode: "dropdown", options: ["1", "3", "6", "24"].map(value => ({ value, label: t(`edit_show_hours_${value}`) })) } } },
      { name: "start", selector: { boolean: {} } },
    ];
  }

  get titleKey() { return "cardUpTitle"; }
  watchedIds() { return [this.idOf("update_watch")].filter(Boolean); }
  verdict() { return this.stateOf("update_watch")?.state; }
  data() { return this.stateOf("update_watch")?.attributes || {}; }
  // "unknown" is also what Home Assistant says for a sensor without a value; only a watch that was judged "unknown" has data.
  hasData() {
    const state = this.verdict();
    return state === "unknown" ? Boolean(this.data().started_at) : Boolean(state) && state !== "unavailable";
  }
  attention() {
    if (this.verdict() !== "worse" || !this.inWindow()) return 0;
    const data = this.data();
    return (data.problems_total || 0) + (data.new_findings || 0) + (data.new_repairs || 0);
  }
  // Quiet is: the update changed nothing for the worse.
  isQuiet() { return ["stable", "transient"].includes(this.verdict()); }
  hiddenKey() { return this.inWindow() ? "cardQuietHidden" : "cardUpHidden"; }
  frameClass() { return this.verdict() === "worse" ? "hk-alert" : ""; }

  // The card shows only for a while after the update that was watched.
  inWindow() {
    const started = Date.parse(this.data().started_at || "");
    return Number.isFinite(started) && this.verdict() !== "none" && Date.now() - started <= Number(this._config.show_hours) * 3600000;
  }

  mode() {
    if (!this.inWindow()) return this.editing() ? "placeholder" : "hide";
    return super.mode();
  }

  // "Home Assistant 2026.11.1, Operating system 14.0": what was updated.
  what() {
    const keys = { ha_version: "cardUpHa", os_version: "cardUpOs", supervisor_version: "cardUpSupervisor" };
    return (this.data().triggers || []).map(t => this.t(keys[t.kind] || "cardUpHa", { to: t.to ?? "" })).join(", ");
  }

  duration(seconds) {
    const total = Math.round(seconds), m = Math.floor(total / 60), s = total % 60;
    return m ? this.t("cardDurMin", { m, s }) : this.t("cardDurSec", { s });
  }

  startLine(data) {
    if (!this._config.start || !Number.isFinite(data.start_seconds)) return "";
    const took = this.duration(data.start_seconds);
    return Number.isFinite(data.start_usual_seconds) ? this.t("cardUpStart", { took, usual: this.duration(data.start_usual_seconds) }) : this.t("cardUpStartOnly", { took });
  }

  problemRow(item) {
    const type = this.t(`cardUpType_${["config_entry", "device", "automation", "script", "scene", "entity"].includes(item.type) ? item.type : "other"}`);
    const status = this.t(`cardUpStatus_${["unavailable", "problem", "stopped"].includes(item.status) ? item.status : "unavailable"}`);
    return `<div class="hk-row r2"><div class="hk-name"><b>${this.esc(item.name)}</b><small>${this.esc(type)}</small></div><span class="hk-tag bad">${this.esc(status)}</span></div>`;
  }

  renderBody() {
    const data = this.data(), state = this.verdict(), title = this._config.title, ago = this.ago(data.started_at);
    const sub = [this.what(), ago].filter(Boolean).join(" · ");
    const head = (text, right = "", line = false, tone = "") => this.head(title ? [text, sub].filter(Boolean).join(" · ") : sub, right, line, tone ? `<span class="hk-dot ${tone}">${tone === "ok" ? "✓" : "!"}</span>` : "", title || text);
    const foot = this.footHtml(this.esc(this.startLine(data)), "view=findingsNav");
    if (state === "none") return head(this.t("cardUpTitle")) + `<div class="hk-note">${this.esc(this.t("cardUpNone"))}</div>`;
    if (state === "pending") {
      const when = this.until(data.next_check);
      return head(this.t("cardUpPending"), "", false, "warn") + (when ? `<div class="hk-note">${this.esc(this.t("cardUpFirstCheck", { when }))}</div>` : "") + foot;
    }
    if (state === "worse") {
      const things = (data.problems_total || 0) + (data.new_findings || 0) + (data.new_repairs || 0);
      const chip = `<span class="hk-chip warn">${this.esc(this.t("cardUpChip", { n: things, count: things }))}</span>`;
      const more = (data.problems_total || 0) - (data.problems || []).length;
      const notes = [
        more > 0 ? this.t("cardUpMore", { n: more, count: more }) : "",
        data.new_findings ? this.t("cardUpFindings", { n: data.new_findings, count: data.new_findings }) : "",
        data.new_repairs ? this.t("cardUpRepairs", { n: data.new_repairs, count: data.new_repairs }) : "",
      ].filter(Boolean).map(text => `<div class="hk-note">${this.esc(text)}</div>`).join("");
      return head(this.t("cardUpWorse"), chip, true, "warn") + (data.problems || []).map(item => this.problemRow(item)).join("") + notes + foot;
    }
    if (state === "unknown") return head(this.t("cardUpUnknown"), "", false, "warn") + `<div class="hk-note">${this.esc(this.t("cardUpUnknownNote"))}</div>` + foot;
    const note = state === "transient" && data.transient ? this.t("cardUpTransientNote", { n: data.transient, count: data.transient }) : this.t("cardUpFineNote");
    return head(this.t("cardUpFine"), `<span class="hk-chip">${this.esc(this.t("cardUpAllFine"))}</span>`, false, "ok") + `<div class="hk-note">${this.esc(note)}</div>` + foot;
  }
}
