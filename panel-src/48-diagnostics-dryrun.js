// The dry run of one automation (see dry_run.py): explains, never executes; mixed into the panel in 99-register.js.
Object.assign(TEXT.de, {
  dryTitle: "Testlauf (erklärend)", dryHint: "Rechnet durch, was die Automation mit den aktuellen Zuständen und deinen Testzuständen tun würde. Es wird nichts ausgeführt und nichts an Geräte gesendet.",
  dryStateEntity: "Entität", dryStateValue: "Testzustand", dryAddState: "Testzustand hinzufügen", dryRemove: "Entfernen", dryRun: "Durchrechnen", dryRunning: "Rechne …", dryFailed: "Nicht möglich: {reason}",
  dryTriggers: "Trigger", dryConditions: "Bedingungen", dryBranches: "Wahrscheinlicher Weg", dryCalls: "Aufgerufene Dienste", dryNoCalls: "Keine Dienste auf dem berechneten Weg.",
  dryYes: "feuert", dryNo: "feuert nicht", dryOpen: "offen", dryTrue: "erfüllt", dryFalse: "nicht erfüllt, die Automation bräche hier ab", dryUnknown: "nicht beurteilbar",
  dryUncertain: "Teile des Wegs lassen sich nicht sicher beurteilen; Dienste daraus sind als „unsicher“ markiert.", dryCertain: "sicher", dryMaybe: "unsicher",
  dryCritical: "kritisch (Schloss, Alarm, Garage)", dryMissing: "fehlt: {list}", dryDisabled: "deaktiviert: {list}", dryTemplated: "Ziel per Vorlage",
  dryLimits: "Grenzen: Vorlagen, Sonne, Zonen, Geräte-Bedingungen und Abläufe außerhalb von Home Assistant werden nicht beurteilt.",
});
Object.assign(TEXT.en, {
  dryTitle: "Test run (explaining)", dryHint: "Works out what the automation would do with the current states and your test states. Nothing is executed and nothing is sent to devices.",
  dryStateEntity: "Entity", dryStateValue: "Test state", dryAddState: "Add test state", dryRemove: "Remove", dryRun: "Work it out", dryRunning: "Working …", dryFailed: "Not possible: {reason}",
  dryTriggers: "Triggers", dryConditions: "Conditions", dryBranches: "Likely path", dryCalls: "Services called", dryNoCalls: "No services on the calculated path.",
  dryYes: "fires", dryNo: "does not fire", dryOpen: "open", dryTrue: "met", dryFalse: "not met, the automation would stop here", dryUnknown: "cannot be judged",
  dryUncertain: "Parts of the path cannot be judged for certain; services from there are marked “uncertain”.", dryCertain: "certain", dryMaybe: "uncertain",
  dryCritical: "critical (lock, alarm, garage)", dryMissing: "missing: {list}", dryDisabled: "disabled: {list}", dryTemplated: "target by template",
  dryLimits: "Limits: templates, sun, zones, device conditions and anything outside Home Assistant are not judged.",
});

class DryRunMixin {
  dryState() {
    const d = this.diagState();
    return (d.dry ||= { states: [{ entity_id: "", state: "" }], result: null, error: "", busy: false });
  }

  async runDry() {
    const dry = this.dryState(), d = this.diagState();
    const states = Object.fromEntries(dry.states.filter(s => s.entity_id.trim() && s.state.trim()).map(s => [s.entity_id.trim(), s.state.trim()]));
    dry.busy = true; dry.error = ""; this.render();
    try { dry.result = await this._hass.callWS({ type: "ha_housekeeper/automation_dry_run", entity_id: d.sel, states }); }
    catch (err) { dry.result = null; dry.error = this.t("dryFailed", { reason: this.errText(err) }); }
    dry.busy = false; this.render();
  }

  dryVerdict(value, yes, no) { return value === true ? `<span class="pill ok">${this.t(yes)}</span>` : value === false ? `<span class="pill warn">${this.t(no)}</span>` : `<span class="pill mute">${this.t("dryOpen")}</span>`; }

  dryResult(r) {
    const triggers = r.triggers.map(t => `<div class="row"><span class="row-text"><strong>${this.t("dryTriggers")} ${t.index + 1}</strong><small>${this.esc(t.platform || "")}</small></span>${this.dryVerdict(t.result, "dryYes", "dryNo")}</div>`).join("");
    const conditions = `<div class="row"><span class="row-text"><strong>${this.t("dryConditions")}</strong><small>${this.t(r.conditions === true ? "dryTrue" : r.conditions === false ? "dryFalse" : "dryUnknown")}</small></span>${this.dryVerdict(r.conditions, "dryTrue", "dryNo")}</div>`;
    const path = r.branches.length ? `<div class="pad"><small><b>${this.t("dryBranches")}:</b> ${this.esc(r.branches.join(" → "))}</small></div>` : "";
    const calls = r.calls.length ? r.calls.map(c => {
      const notes = [c.critical ? this.t("dryCritical") : "", c.missing.length ? this.t("dryMissing", { list: c.missing.join(", ") }) : "", c.disabled.length ? this.t("dryDisabled", { list: c.disabled.join(", ") }) : "", c.templated ? this.t("dryTemplated") : ""].filter(Boolean);
      return `<div class="row"><span class="tile ${c.critical ? "red" : "mute"}"><ha-icon icon="${c.critical ? "mdi:alert-outline" : "mdi:flash-outline"}"></ha-icon></span><span class="row-text"><strong>${this.esc(c.service)}</strong><small>${this.esc(c.targets.join(", ") || "—")}${notes.length ? ` · ${this.esc(notes.join(" · "))}` : ""}</small></span><span class="pill ${c.certain ? "ok" : "warn"}">${this.t(c.certain ? "dryCertain" : "dryMaybe")}</span></div>`;
    }).join("") : `<div class="emptymsg">${this.t("dryNoCalls")}</div>`;
    return `${triggers}${conditions}${path}<div class="sectionlabel">${this.t("dryCalls")}</div>${calls}${r.uncertain ? `<div class="pad"><small>${this.t("dryUncertain")}</small></div>` : ""}<div class="pad"><small>${this.t("dryLimits")}</small></div>`;
  }

  dryRunCard() {
    const dry = this.dryState();
    const rows = dry.states.map((s, i) => `<div class="setrow"><input type="text" data-dry-entity="${i}" value="${this.esc(s.entity_id)}" placeholder="binary_sensor.door" aria-label="${this.esc(this.t("dryStateEntity"))}" class="w260"><input type="text" data-dry-state="${i}" value="${this.esc(s.state)}" placeholder="on" aria-label="${this.esc(this.t("dryStateValue"))}" class="w140">${dry.states.length > 1 ? `<button class="btn quiet" data-dry-del="${i}">${this.t("dryRemove")}</button>` : ""}</div>`).join("");
    return `<div class="panelhead"><div><h2>${this.t("dryTitle")}</h2><p>${this.t("dryHint")}</p></div></div><div class="pad polform">${rows}<div class="acts"><button class="btn quiet" data-dry-add>${this.t("dryAddState")}</button><button class="btn primary" data-dry-run ${dry.busy ? "disabled" : ""}>${dry.busy ? this.t("dryRunning") : this.t("dryRun")}</button></div></div>${dry.error ? `${this.notice("err", dry.error)}` : ""}${dry.result ? this.dryResult(dry.result) : ""}`;
  }

  bindDryRun(root) {
    const dry = () => this.dryState();
    root.querySelector("[data-dry-run]")?.addEventListener("click", () => this.runDry());
    root.querySelector("[data-dry-add]")?.addEventListener("click", () => { dry().states.push({ entity_id: "", state: "" }); this.render(); });
    root.querySelectorAll("[data-dry-del]").forEach(el => el.onclick = () => { dry().states.splice(Number(el.dataset.dryDel), 1); this.render(); });
    root.querySelectorAll("[data-dry-entity]").forEach(el => el.oninput = () => { dry().states[Number(el.dataset.dryEntity)].entity_id = el.value; });
    root.querySelectorAll("[data-dry-state]").forEach(el => el.oninput = () => { dry().states[Number(el.dataset.dryState)].state = el.value; });
  }
}

// Simplified Chinese texts; merged into TEXT.
Object.assign(TEXT.zh, {
  "dryRun": "试算",
  "dryTitle": "测试运行（说明）",
  "dryHint": "根据当前状态和你的测试状态推演自动化会执行的操作。不会执行任何操作，也不会向设备发送任何内容。",
  "dryStateEntity": "实体",
  "dryStateValue": "测试状态",
  "dryAddState": "添加测试状态",
  "dryRemove": "移除",
  "dryRunning": "处理中…",
  "dryFailed": "无法执行：{reason}",
  "dryTriggers": "触发器",
  "dryConditions": "条件",
  "dryBranches": "可能的路径",
  "dryCalls": "调用的服务",
  "dryNoCalls": "计算出的路径上没有服务调用。",
  "dryYes": "会触发",
  "dryNo": "不会触发",
  "dryOpen": "开放",
  "dryTrue": "已满足",
  "dryFalse": "未满足，自动化将在此停止",
  "dryUnknown": "无法判断",
  "dryUncertain": "路径的某些部分无法可靠判断；从那里开始的服务会标记为「不确定」。",
  "dryCertain": "确定",
  "dryMaybe": "不确定",
  "dryCritical": "关键（门锁、警报、车库）",
  "dryMissing": "缺失：{list}",
  "dryDisabled": "已禁用：{list}",
  "dryTemplated": "通过模板指定目标",
  "dryLimits": "限制：模板、太阳、区域（zone）、设备条件以及 Home Assistant 之外的任何内容均不做判断。",
});
