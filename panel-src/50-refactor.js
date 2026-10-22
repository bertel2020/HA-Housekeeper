// Mechanical improvements of one automation (see refactor.py): proposals in the diagnosis card, the plan runs under Cleanup.
Object.assign(TEXT.de, {
  refactorTitle: "Verbessern (experimentell)",
  refactorHint: "Kleine, genau benannte Änderungen an der Konfiguration. Logik, Bedingungen und Templates fasst Housekeeper nie an. Jede Änderung ist ein Plan mit Vorschau, Backup und Rückgängig.",
  refactorOff: "Das Verbessern ist ausgeschaltet. Es schreibt in deine Automationen-Datei und wurde auf einer echten Instanz noch nicht erprobt.",
  refactorTurnOn: "Experimentell einschalten", refactorTurnOff: "Ausschalten", refactorLoading: "Vorschläge werden gesucht …",
  refactorNothing: "Nichts vorzuschlagen.", refactorNotEditable: "Diese Automation lässt sich nicht automatisch ändern: {reason}.",
  refactorFix_add_description: "Beschreibung ergänzen", refactorFixHint_add_description: "Ohne Beschreibung weiß später niemand, wofür die Automation da ist. Den Text schreibst du.",
  refactorFix_remove_duplicate_triggers: "Doppelte Trigger entfernen", refactorFixHint_remove_duplicate_triggers: "{count} Trigger sind völlig gleich. Danach läuft die Automation einmal statt zweimal je Ereignis.",
  refactorFix_hint_device_trigger: "Geräte-Trigger", refactorFixHint_hint_device_trigger: "{count} Trigger hängen an einer Geräte-ID ({paths}). Wird das Gerät neu angelegt, löst die Automation nicht mehr aus. Ein Trigger auf die Entität ist stabiler. Housekeeper ändert das nicht selbst, weil sich dabei das Auslöseverhalten ändern kann.",
  refactorFix_hint_long_delay: "Lange Verzögerung", refactorFixHint_hint_long_delay: "{count} Verzögerungen dauern fünf Minuten oder länger, die längste {longest} ({paths}). Bei einem Neustart von Home Assistant gehen sie verloren und der Rest läuft nie. Ein Trigger mit „for“ oder ein Warteschritt mit Zeitgrenze übersteht den Neustart. Das schreibt Housekeeper nicht um.",
  refactorFix_hint_dead_branch: "Zweig ohne Wirkung", refactorFixHint_hint_dead_branch: "{count} Zweige von „choose“ prüfen Entitäten, die es nicht gibt ({entities}); sie treffen nie zu ({paths}). Ob der Zweig gestrichen oder repariert wird, entscheidest du.", refactorHintOnly: "Nur ein Hinweis, Housekeeper schreibt hier nichts.",
  refactorDescription: "Beschreibung", refactorPlan: "Plan erstellen", refactorFailed: "Plan nicht erstellt: {reason}", refactorDiffBefore: "vorher", refactorDiffNone: "entfällt",
  refactorFix_set_timeout: "Timeout bei Warteschritten ergänzen", refactorFixHint_set_timeout: "{count} Warteschritte (wait_template / wait_for_trigger) haben kein Timeout und können ewig warten: {paths}.",
  refactorTimeout: "Timeout (Sekunden)", refactorKeepGoing: "Nach Ablauf trotzdem weitermachen (Standard von Home Assistant)",
  refactorFix_set_mode: "Modus und Limit ändern", refactorFixHint_set_mode: "Jetzt: {mode}{limit}. Der Modus entscheidet, was bei einer Auslösung geschieht, während die Automation noch läuft.", refactorOverlap: "Läufe überschneiden sich bei dieser Automation.",
  refactorMode: "Modus", refactorMax: "Höchstens gleichzeitig / in der Schlange", mode_single: "single (neue Auslösung verwerfen)", mode_restart: "restart (laufenden Lauf abbrechen)", mode_queued: "queued (hintereinander)", mode_parallel: "parallel (gleichzeitig)",
  fu_class_run_error: "Fehlerlauf",
  source_blueprint: "basiert auf einem Blueprint",
  reason_refactor_disabled: "Das Verbessern ist ausgeschaltet.", reason_not_editable: "Die Automation lässt sich nicht automatisch ändern.", reason_invalid_fix: "Die Angaben für diese Änderung sind nicht gültig.", reason_invalid_config: "Home Assistant würde die geänderte Automation nicht annehmen.",
  abort_invalid_config: "Home Assistant hätte die geänderte Automation nicht angenommen.", abort_reload_failed: "Die Automation wurde nach dem Neuladen nicht geladen; die Datei ist zurückgesetzt.", abort_invalid_fix: "Die Angaben für diese Änderung sind nicht gültig.",
  check_refactor_applied: "Änderung ist in der Datei und die Automation ist geladen", confirmedSummaryRefactor: "{count} Automationen werden in der Konfiguration geändert (Backup vorher, Vorher-Datei bleibt für Rückgängig).", result_refactored: "Geändert",
});
Object.assign(TEXT.en, {
  refactorTitle: "Improve (experimental)",
  refactorHint: "Small, exactly named changes to the configuration. Housekeeper never touches logic, conditions or templates. Every change is a plan with a preview, a backup and an undo.",
  refactorOff: "Improving is switched off. It writes into your automations file and has not been tried on a real instance yet.",
  refactorTurnOn: "Switch on (experimental)", refactorTurnOff: "Switch off", refactorLoading: "Looking for suggestions …",
  refactorNothing: "Nothing to suggest.", refactorNotEditable: "This automation cannot be changed automatically: {reason}.",
  refactorFix_add_description: "Add a description", refactorFixHint_add_description: "Without a description nobody knows later what the automation is for. You write the text.",
  refactorFix_remove_duplicate_triggers: "Remove duplicate triggers", refactorFixHint_remove_duplicate_triggers: "{count} triggers are exactly the same. Afterwards the automation runs once instead of twice per event.",
  refactorFix_hint_device_trigger: "Device triggers", refactorFixHint_hint_device_trigger: "{count} triggers hang on a device id ({paths}). If the device is added again, the automation no longer fires. A trigger on the entity is more stable. Housekeeper does not change this itself because what fires the automation could change.",
  refactorFix_hint_long_delay: "Long delay", refactorFixHint_hint_long_delay: "{count} delays take five minutes or more, the longest {longest} ({paths}). A restart of Home Assistant loses them and the rest never runs. A trigger with “for” or a wait step with a time limit survives a restart. Housekeeper does not rewrite this.",
  refactorFix_hint_dead_branch: "Branch without effect", refactorFixHint_hint_dead_branch: "{count} branches of “choose” check entities that do not exist ({entities}); they never apply ({paths}). Whether to remove or repair the branch is up to you.", refactorHintOnly: "Only a hint, Housekeeper writes nothing here.",
  refactorDescription: "Description", refactorPlan: "Create plan", refactorFailed: "Plan not created: {reason}", refactorDiffBefore: "before", refactorDiffNone: "removed",
  refactorFix_set_timeout: "Add a timeout to wait steps", refactorFixHint_set_timeout: "{count} wait steps (wait_template / wait_for_trigger) have no timeout and can wait forever: {paths}.",
  refactorTimeout: "Timeout (seconds)", refactorKeepGoing: "Carry on after the timeout (Home Assistant's default)",
  refactorFix_set_mode: "Change mode and limit", refactorFixHint_set_mode: "Now: {mode}{limit}. The mode decides what a trigger does while the automation is still running.", refactorOverlap: "Runs of this automation overlap.",
  refactorMode: "Mode", refactorMax: "At most at once / in the queue", mode_single: "single (drop the new trigger)", mode_restart: "restart (stop the running one)", mode_queued: "queued (one after the other)", mode_parallel: "parallel (at the same time)",
  fu_class_run_error: "Error run",
  source_blueprint: "is based on a blueprint",
  reason_refactor_disabled: "Improving is switched off.", reason_not_editable: "The automation cannot be changed automatically.", reason_invalid_fix: "The values for this change are not valid.", reason_invalid_config: "Home Assistant would not accept the changed automation.",
  abort_invalid_config: "Home Assistant would not have accepted the changed automation.", abort_reload_failed: "The automation was not loaded after the reload; the file was put back.", abort_invalid_fix: "The values for this change are not valid.",
  check_refactor_applied: "The change is in the file and the automation is loaded", confirmedSummaryRefactor: "{count} automations are changed in the configuration (backup first, the old file is kept for undo).", result_refactored: "Changed",
});

class RefactorMixin {
  refactorState() {
    return (this.refactor ||= { by: {}, text: {}, message: "" });
  }

  async loadRefactor(entityId) {
    const r = this.refactorState();
    try { r.by[entityId] = await this._hass.callWS({ type: "ha_housekeeper/refactor_proposals", entity_id: entityId }); }
    catch (_) { r.by[entityId] = { enabled: false, editable: false, reason: "not_editable", proposals: [], failed: true }; }
    this.render();
  }

  async setRefactor(enabled) {
    await this._hass.callWS({ type: "ha_housekeeper/refactor_set", enabled });
    await this.loadRefactor(this.diagState().sel);
  }

  refactorCard(entityId) {
    const r = this.refactorState(), view = r.by[entityId];
    const note = r.message ? `<div class="pad"><small role="status">${this.esc(r.message)}</small></div>` : "";
    if (!view) return `<div class="pad"><small>${this.t("refactorLoading")}</small></div>`;
    if (!view.enabled) return `<div class="pad"><small>${this.t("refactorOff")}</small></div><div class="pad"><button class="btn" data-refactor-switch="on">${this.t("refactorTurnOn")}</button></div>`;
    const off = `<div class="pad"><button class="btn quiet" data-refactor-switch="off">${this.t("refactorTurnOff")}</button></div>`;
    if (!view.editable) return `<div class="pad"><small>${this.t("refactorNotEditable", { reason: this.t(`source_${view.reason}`) })}</small></div>${off}`;
    const overlap = this.diagState().quality?.items.find(i => i.entity_id === entityId)?.dimensions.reliability.reasons.some(x => x.key === "overlap");
    const rows = view.proposals.map(p => {
      let input = "", hint = this.t(`refactorFixHint_${p.fix}`, { count: p.count || 0, paths: (p.paths || []).join(", "), mode: p.mode || "", limit: p.max ? ` (max ${p.max})` : "", entities: (p.entities || []).join(", "), longest: this.delayText(p.longest) });
      if (p.fix.startsWith("hint_")) return `<div class="pad polform"><strong>${this.t(`refactorFix_${p.fix}`)}</strong><small class="u-block">${this.esc(hint)}</small><small class="dim7">${this.t("refactorHintOnly")}</small></div>`;
      if (p.fix === "add_description") input = `<textarea data-refactor-text="add_description" maxlength="300" rows="2" aria-label="${this.esc(this.t("refactorDescription"))}" class="refactext">${this.esc(r.text.add_description || "")}</textarea>`;
      if (p.fix === "set_timeout") input = `<div class="setrow"><label>${this.t("refactorTimeout")} <input type="number" min="1" max="86400" data-refactor-timeout value="${this.esc(String(r.timeout || 60))}"></label><label><input type="checkbox" data-refactor-keep ${r.keep === false ? "" : "checked"}> ${this.t("refactorKeepGoing")}</label></div>`;
      if (p.fix === "set_mode") {
        const mode = r.mode || p.mode;
        input = `<div class="setrow"><label>${this.t("refactorMode")} <select data-refactor-mode>${["single", "restart", "queued", "parallel"].map(m => `<option value="${m}" ${m === mode ? "selected" : ""}>${this.esc(this.t(`mode_${m}`))}</option>`).join("")}</select></label>${mode === "queued" || mode === "parallel" ? `<label>${this.t("refactorMax")} <input type="number" min="2" max="100" data-refactor-max value="${this.esc(String(r.max || p.max || 10))}"></label>` : ""}</div>${overlap ? `<small class="error">${this.t("refactorOverlap")}</small>` : ""}`;
      }
      return `<div class="pad polform"><strong>${this.t(`refactorFix_${p.fix}`)}</strong><small class="u-block">${this.esc(hint)}</small>${input}<button class="btn" data-refactor-plan="${this.esc(p.fix)}" ${this.planBusy ? 'disabled aria-busy="true"' : ""}>${this.t("refactorPlan")}</button></div>`;
    }).join("");
    return `<div class="pad"><small>${this.t("refactorHint")}</small></div>${rows || `<div class="pad"><small>${this.t("refactorNothing")}</small></div>`}${note}${off}`;
  }

  delayText(seconds) {
    if (!seconds) return "";
    return seconds >= 3600 ? `${Math.round(seconds / 360) / 10} h` : `${Math.round(seconds / 60)} min`;
  }

  // What the plan shows for one edit: the path and what stood there.
  refactorDiff(action) {
    const lines = (action.sources || []).flatMap(s => s.changes || []).slice(0, 5).map(c => `<small class="u-dim u-block">${this.esc(c.path)}: ${c.after === null ? this.esc(this.t("refactorDiffNone")) : this.esc(String(c.after))}${c.before === null ? "" : ` (${this.esc(this.t("refactorDiffBefore"))}: ${this.esc(JSON.stringify(c.before)).slice(0, 120)})`}</small>`).join("");
    return `<span class="u-pt6 u-block">${lines}</span>`;
  }

  async makeRefactorPlan(entityId, fix) {
    const r = this.refactorState();
    const view = r.by[entityId], current = view?.proposals.find(p => p.fix === "set_mode");
    const mode = r.mode || current?.mode;
    const values = fix === "add_description" ? { description: (r.text[fix] || "").trim() }
      : fix === "set_timeout" ? { timeout: Number.parseInt(r.timeout || 60, 10), continue_on_timeout: r.keep !== false }
      : fix === "set_mode" ? { mode, ...(mode === "queued" || mode === "parallel" ? { max: Number.parseInt(r.max || current?.max || 10, 10) } : {}) }
      : {};
    r.message = "";
    try {
      if (!await this.newPlan([{ kind: "refactor_automation", object_id: entityId, fix, values }], "repair")) return;
      this.repairTask = null;
    } catch (err) { r.message = this.t("refactorFailed", { reason: this.errText(err) }); }
    this.render();
  }

  bindRefactor(root) {
    const sel = () => this.diagState().sel;
    root.querySelectorAll("[data-refactor-switch]").forEach(el => el.onclick = () => this.setRefactor(el.dataset.refactorSwitch === "on"));
    root.querySelectorAll("[data-refactor-text]").forEach(el => el.oninput = () => { this.refactorState().text[el.dataset.refactorText] = el.value; });
    root.querySelectorAll("[data-refactor-timeout]").forEach(el => el.oninput = () => { this.refactorState().timeout = el.value; });
    root.querySelectorAll("[data-refactor-keep]").forEach(el => el.onchange = () => { this.refactorState().keep = el.checked; });
    root.querySelectorAll("[data-refactor-max]").forEach(el => el.oninput = () => { this.refactorState().max = el.value; });
    root.querySelectorAll("[data-refactor-mode]").forEach(el => el.onchange = () => { this.refactorState().mode = el.value; this.render(); });
    root.querySelectorAll("[data-refactor-plan]").forEach(el => el.onclick = () => this.makeRefactorPlan(sel(), el.dataset.refactorPlan));
  }
}

// Simplified Chinese texts; merged into TEXT.
Object.assign(TEXT.zh, {
  "refactorTitle": "改进（实验性）",
  "refactorHint": "对配置进行明确命名的小幅更改。Housekeeper 从不改动逻辑、条件或模板。每项更改都是一个包含预览、备份和撤销的计划。",
  "refactorOff": "改进功能已关闭。它会写入你的自动化文件，且尚未在真实实例上测试过。",
  "refactorTurnOn": "开启（实验性）",
  "refactorTurnOff": "关闭",
  "refactorLoading": "正在查找建议…",
  "refactorNothing": "无建议。",
  "refactorNotEditable": "此自动化无法自动更改：{reason}。",
  "refactorFix_add_description": "添加描述",
  "refactorFixHint_add_description": "没有描述，日后无人知道该自动化的用途。文本由你填写。",
  "refactorFix_remove_duplicate_triggers": "移除重复触发器",
  "refactorFixHint_remove_duplicate_triggers": "{count} 个触发器完全相同。之后每个事件只会运行一次而不是两次。",
  "refactorFix_hint_device_trigger": "设备触发器",
  "refactorFixHint_hint_device_trigger": "{count} 个触发器依赖于设备 ID（{paths}）。如果设备被重新添加，自动化将不再触发。基于实体的触发器更稳定。Housekeeper 不自行更改此项，因为触发自动化的原因可能会改变。",
  "refactorFix_hint_long_delay": "长延迟",
  "refactorFixHint_hint_long_delay": "{count} 个延迟长达五分钟或更久，最长 {longest}（{paths}）。Home Assistant 重启会丢失它们，后续内容永远不会运行。带「for」的触发器或带时间限制的等待步骤可在重启后继续。Housekeeper 不会重写此项。",
  "refactorFix_hint_dead_branch": "无效分支",
  "refactorFixHint_hint_dead_branch": "{count} 个「choose」分支检查的实体不存在（{entities}）；它们永远不会生效（{paths}）。删除还是修复该分支由你决定。",
  "refactorHintOnly": "仅为提示，Housekeeper 不会在此写入任何内容。",
  "refactorDescription": "描述",
  "refactorPlan": "创建计划",
  "refactorFailed": "计划未创建：{reason}",
  "refactorDiffBefore": "之前",
  "refactorDiffNone": "已移除",
  "refactorFix_set_timeout": "为等待步骤添加超时",
  "refactorFixHint_set_timeout": "{count} 个等待步骤（wait_template / wait_for_trigger）没有超时，可能永远等待：{paths}。",
  "refactorTimeout": "超时（秒）",
  "refactorKeepGoing": "超时后继续（Home Assistant 默认行为）",
  "refactorFix_set_mode": "更改模式和限制",
  "refactorFixHint_set_mode": "当前：{mode}{limit}。模式决定自动化仍在运行时触发器的处理方式。",
  "refactorOverlap": "此自动化的运行存在重叠。",
  "refactorMode": "模式",
  "refactorMax": "同时运行/队列上限",
  "mode_single": "single（丢弃新触发）",
  "mode_restart": "restart（停止正在运行的）",
  "mode_queued": "queued（依次执行）",
  "mode_parallel": "parallel（同时执行）",
  "fu_class_run_error": "错误运行",
  "source_blueprint": "基于蓝图",
  "reason_refactor_disabled": "改进功能已关闭。",
  "reason_not_editable": "此自动化无法自动更改。",
  "reason_invalid_fix": "此更改的值无效。",
  "reason_invalid_config": "Home Assistant 不会接受更改后的自动化。",
  "abort_invalid_config": "Home Assistant 原本不会接受更改后的自动化。",
  "abort_reload_failed": "重新加载后自动化未被加载；文件已恢复原状。",
  "abort_invalid_fix": "此更改的值无效。",
  "check_refactor_applied": "更改已写入文件且自动化已加载",
  "confirmedSummaryRefactor": "将在配置中更改 {count} 个自动化（先备份，旧文件保留用于撤销）。",
  "result_refactored": "已更改",
});
