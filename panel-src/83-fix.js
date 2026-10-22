// FixMixin: the page "Fix" (Beheben) of one finding: understand, decide, carry out, check. A page of its own without a
// menu entry; "back" returns to the list with its selection and scroll position. It names the ways and opens the
// existing steps (plan with preview, links into Home Assistant, marks, exits); it changes nothing by itself.
class FixMixin {
  openFix(key) {
    this.noteJump("fix");
    this.view = "fix"; this.fixKey = key; this.fixWays = null; this.fixFailure = null; this.fixCheckedFrom = null; this.selected = null; this.pages = {};
    this.render();
    this.loadFixWays(key);
  }

  async loadFixWays(key) {
    try {
      const reply = await this._hass.callWS({ type: "ha_housekeeper/fix_ways", finding_key: key });
      if (this.fixKey === key) { this.fixWays = reply?.ways || []; if (this.view === "fix") this.render(); }
    } catch (_) { if (this.fixKey === key) { this.fixWays = []; if (this.view === "fix") this.render(); } }
    const finding = this.data?.findings?.find(x => x.key === key);
    if (finding?.topic !== "failing_automations") return;
    try {
      const info = await this._hass.callWS({ type: "ha_housekeeper/failure_info", finding_key: key });
      if (this.fixKey === key) { this.fixFailure = info || {}; if (this.view === "fix") this.render(); }
    } catch (_) { /* the last run is a convenience; the ways stand without it */ }
  }

  // A step on a way is "in work": the finding stays open but is marked, and goes back after a week without a step.
  async fixWork(active) {
    const f = this.data?.findings?.find(x => x.key === this.fixKey);
    if (!f) return;
    try {
      const reply = await this._hass.callWS({ type: "ha_housekeeper/work_set", finding_key: f.key, active });
      f.in_work = reply?.in_work || undefined; f.work_expired = reply?.work_expired || undefined;
      this._rev++;
      if (this.view === "fix") this.render();
    } catch (_) { /* a note of progress is a convenience */ }
  }

  // Step 1: what is wrong, since when, what it affects, how sure Housekeeper is.
  fixUnderstand(f) {
    const cause = f.cause_id ? this.causeById(f.cause_id) : this.causeList().find(c => c.finding_key === f.key);
    const own = cause && cause.finding_key === f.key, since = f.first_detected_at || f.first_seen_at;
    const pattern = (f.confidence_notes || []).find(n => n.code === "pattern");
    const rows = [
      [this.t("fixWhat"), this.esc(this.findingTitle(f))],
      f.in_work ? [this.t("freshInwork"), this.esc(this.t("fixWorkSince", { date: this.formatDate(f.in_work.started_at) }))] : f.work_expired ? [this.t("freshInwork"), this.esc(this.t("workExpired", { date: this.formatDate(f.work_expired.started_at) }))] : null,
      since ? [this.t("sortSince"), this.esc(this.formatDate(since))] : null,
      f.impact ? [this.t("sortImpact"), this.esc(this.impactLine(f))] : null,
      cause && !own ? [this.t("causeLabel"), this.esc(this.t(`cause_${cause.kind}`, { name: cause.name }))] : null,
      cause && own && cause.total_followers ? [this.t("fixAffects"), this.esc(this.tCount("causeFollowers", cause.total_followers))] : null,
      this.fixFailure?.failure ? [this.t("fixLastFailure"), this.esc(this.fixFailureText(this.fixFailure.failure))] : null,
      this.fixFailure?.hint ? [this.t("fixFailureHint"), `${this.esc(this.t("fixFailureHintText", { entity: this.fixFailure.hint.entity_id }))} <button type="button" class="btn quiet" data-fix-open="${this.esc(this.fixFailure.hint.finding_key)}">${this.t("fixToFinding")}</button>`] : null,
      pattern ? [this.t("fixPattern"), this.esc(this.t("fixPatternAt", { hour: pattern.hour }))] : null,
      f.confidence_level ? [this.t("sortCertainty"), `${Math.round(f.confidence * 100)} %<small class="factnote">${this.esc(this.certaintyText(f))}</small>`] : null,
    ].filter(Boolean);
    return `<div class="rating">${rows.map(([label, value]) => `<div class="rrow"><b>${label}</b><div>${value}</div></div>`).join("")}</div>`;
  }

  fixFailureText(failure) {
    return [failure.at ? this.formatDate(failure.at) : "", failure.step ? this.t("fixFailureStep", { step: failure.step }) : "", failure.error || ""].filter(Boolean).join(" · ");
  }

  // One way as a card: its name, what it does, and the button that starts it; the recommended one is marked.
  fixWayCard(w, f) {
    const key = this.findingKey(f), object = this.findObject(key);
    let action = "";
    if (w.kind === "link") action = `<button type="button" class="btn" data-ha-path="${this.esc(w.path)}"><ha-icon icon="mdi:open-in-new"></ha-icon>${this.t("fixOpenHA")}</button>`;
    else if (w.way === "catch_error") {
      const step = this.fixFailure?.failure?.step;
      action = !step ? `<small class="factnote">${this.t("fixCatchNoStep")}</small>` : w.enabled
        ? `<button type="button" class="btn" data-fix-catch="${this.esc(step)}"><ha-icon icon="mdi:shield-check-outline"></ha-icon>${this.t("fixCatchStart")}</button>`
        : `<button type="button" class="btn" data-fix-refactor-on><ha-icon icon="mdi:toggle-switch-outline"></ha-icon>${this.t("fixRefactorOn")}</button>`;
    } else if (w.way === "fix_cause") {
      const cause = f.cause_id ? this.causeById(f.cause_id) : null;
      if (cause?.finding_key) action = `<button type="button" class="btn" data-fix-open="${this.esc(cause.finding_key)}"><ha-icon icon="mdi:arrow-right"></ha-icon>${this.t("fixToFinding")}</button>`;
    } else if (w.way === "cleanup_round") action = `<button type="button" class="btn" data-fix-round><ha-icon icon="mdi:broom"></ha-icon>${this.t("fixRoundStart")}</button>`;
    else if (w.way === "replace_target" && w.target_kind) {
      const options = (this.data?.objects || []).filter(o => o.object_type === w.target_kind && o.object_id !== w.target);
      action = options.length ? `<span class="setrow"><select data-fix-id-new aria-label="${this.esc(this.t("fixReplaceWith"))}">${options.map(o => `<option value="${this.esc(o.object_id)}">${this.esc(o.name || o.object_id)}</option>`).join("")}</select><button type="button" class="btn" data-fix-id-replace="${this.esc(w.target)}" data-fix-id-kind="${this.esc(w.target_kind)}"><ha-icon icon="mdi:swap-horizontal"></ha-icon>${this.t("fixReplaceStart")}</button></span>` : `<small class="factnote">${this.t("fixReplaceNone")}</small>`;
    } else if (w.way === "replace_target") action = `<button type="button" class="btn" data-fix-replace="${this.esc(w.target)}" data-fix-new="${this.esc(w.suggestion || "")}"><ha-icon icon="mdi:swap-horizontal"></ha-icon>${this.t("fixReplaceStart")}</button>`;
    else if (w.way === "remove_reference") action = w.enabled
      ? `<button type="button" class="btn" data-fix-remove="${this.esc(w.target)}"><ha-icon icon="mdi:link-variant-minus"></ha-icon>${this.t("fixRemoveStart")}</button>`
      : `<button type="button" class="btn" data-fix-refactor-on><ha-icon icon="mdi:toggle-switch-outline"></ha-icon>${this.t("fixRefactorOn")}</button>`;
    else if (w.way === "open_editor" && object && this.haPath(object)) action = `<button type="button" class="btn" data-ha-path="${this.esc(this.haPath(object))}"><ha-icon icon="mdi:open-in-new"></ha-icon>${this.t("fixOpenHA")}</button>`;
    else if (w.way === "mark" && object && MARK_TYPES.includes(object.object_type)) action = `<button type="button" class="btn" data-watch-mark="${this.esc(key)}"><ha-icon icon="${FSEL_ICONS.mark}"></ha-icon>${this.t("markSet")}</button>`;
    else if (w.kind === "panel" && object) action = `<button type="button" class="btn" data-fix-object="${this.esc(key)}"><ha-icon icon="mdi:tools"></ha-icon>${this.t("fixOpenActions")}</button>`;
    return `<div class="row"><span class="row-text"><strong>${this.esc(this.t(`fixWay_${w.way}`))}${w.recommended ? ` <span class="pill ok">${this.t("fixRecommended")}</span>` : ""}</strong><small>${this.esc(this.t(`fixWayHint_${w.way}`))}</small></span>${action}</div>`;
  }

  // Step 2: the ways of the topic, and always the three exits.
  fixDecide(f) {
    const ways = this.fixWays;
    const list = ways === null ? `<p class="factnote">${this.t("loading")}</p>` : ways.length ? [...ways].sort((a, b) => Number(b.recommended) - Number(a.recommended)).map(w => this.fixWayCard(w, f)).join("") : `<p class="factnote">${this.t("fixNoWays")}</p>`;
    const key = this.esc(f.key);
    const exit = (kind, icon) => `<button type="button" class="btn" data-decide-open="${key}" data-decide-preset="${kind}"><ha-icon icon="${icon}"></ha-icon>${this.t(`decideKind_${kind}`)}<small>${this.t(`decideKindHint_${kind}`)}</small></button>`;
    return `${list}<h3 class="ratinghead">${this.t("fixExits")}</h3><div class="mbtns">${exit("keep", "mdi:check")}${exit("snooze", "mdi:clock-outline")}${exit("ignore", "mdi:eye-off-outline")}</div>${this.rowDecide(f)}`;
  }

  // For a cause with several findings below it: pick which to include, then one way for all.
  fixCollect(f) {
    const cause = f.cause_id ? this.causeById(f.cause_id) : this.causeList().find(c => c.finding_key === f.key);
    if (!cause) return "";
    const below = this.data.findings.filter(x => !x.ignored && x.key !== f.key && this.causeKeys(cause.id).has(x.key));
    if (below.length < 2) return "";
    const rows = below.map(x => `<label class="row"><input type="checkbox" data-fix-pick="${this.esc(x.key)}" ${this.findSel.has(x.key) ? "checked" : ""}><span class="row-text"><strong>${this.esc(this.findObject(this.findingKey(x))?.name || x.object_id)}</strong><small>${this.esc(this.findingTitle(x))}</small></span></label>`).join("");
    const picked = below.filter(x => this.findSel.has(x.key)).length, off = picked ? "" : "disabled";
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("fixCollectTitle")}</h2><p>${this.t("fixCollectHint")}</p></div></div>${rows}
      <div class="mbtns"><button type="button" class="btn" data-fix-pick-all="${this.esc(below.map(x => x.key).join("|"))}">${this.t("fixPickAll")}</button><button type="button" class="btn" data-fsel-state="status" ${off}>${this.t("fselStatus")}</button><button type="button" class="btn" data-fsel-state="mark" ${off}>${this.t("markSet")}</button></div>${this.bulkForm()}</section>`;
  }

  // Step 4: check by scanning again; the verdict stands once a scan after the click is in.
  fixCheck(f) {
    const checked = this.fixCheckedFrom && this.data?.meta?.scanned_at !== this.fixCheckedFrom;
    const verdict = !checked ? "" : f ? this.notice("warn", this.t("fixStillOpen")) : this.notice("info", this.t("fixDone"));
    return `<p class="factnote">${this.t("fixCheckHint")}</p><div class="mbtns"><button type="button" class="btn primary" data-fix-check ${this.busy ? "disabled" : ""}><ha-icon icon="mdi:magnify-scan"></ha-icon>${this.t("fixCheckNow")}</button>${f?.in_work ? `<button type="button" class="btn quiet" data-fix-work-off>${this.t("fixWorkOff")}</button>` : ""}</div>${verdict}`;
  }

  fixView() {
    const f = this.data?.findings?.find(x => x.key === this.fixKey);
    const step = (n, title, body) => `<section class="panel"><div class="panelhead"><div><h2>${n} · ${this.t(title)}</h2></div></div>${body}</section>`;
    if (!f) return `<div class="stack">${step(4, "fixStepCheck", `${this.fixCheckedFrom ? this.notice("info", this.t("fixDone")) : this.notice("info", this.t("fixGone"))}`)}<div class="pad"><button class="btn" data-action="view-back">${this.t("fixBack")}</button></div></div>`;
    return `<div class="stack">${step(1, "fixStepUnderstand", this.fixUnderstand(f))}${step(2, "fixStepDecide", this.fixDecide(f))}${this.fixCollect(f)}${step(3, "fixStepRun", `<p class="factnote">${this.t("fixRunHint")}</p>`)}${step(4, "fixStepCheck", this.fixCheck(f))}</div>`;
  }

  bindFix(root) {
    root.querySelectorAll("[data-fix-open]").forEach(el => el.onclick = ev => { ev.stopPropagation(); el.closest("details")?.removeAttribute("open"); this.openFix(el.dataset.fixOpen); });
    root.querySelectorAll("[data-fix-object]").forEach(el => el.onclick = () => { const obj = this.findObject(el.dataset.fixObject); if (obj) { this._pendingTab = "actions"; this.openObject(obj); } });
    root.querySelectorAll("[data-fix-replace]").forEach(el => el.onclick = () => this.startCleanup("replace_references", () => { this.replOld = el.dataset.fixReplace; this.replNew = el.dataset.fixNew || ""; }));
    root.querySelectorAll("[data-fix-id-replace]").forEach(el => el.onclick = async () => {
      const target = el.closest(".row")?.querySelector("[data-fix-id-new]")?.value;
      if (target) await this.newPlan([{ kind: "replace_references", object_id: el.dataset.fixIdReplace, target, target_kind: el.dataset.fixIdKind }], "repair");
    });
    root.querySelectorAll("[data-fix-catch]").forEach(el => el.onclick = async () => {
      const f = this.data?.findings?.find(x => x.key === this.fixKey);
      if (f) await this.newPlan([{ kind: "refactor_automation", object_id: f.object_id, fix: "continue_on_error", values: { path: el.dataset.fixCatch } }], "repair");
    });
    root.querySelectorAll("[data-fix-round]").forEach(el => el.onclick = () => this.openRound());
    root.querySelectorAll("[data-fix-remove]").forEach(el => el.onclick = async () => {
      const f = this.data?.findings?.find(x => x.key === this.fixKey);
      if (f) await this.newPlan([{ kind: "refactor_automation", object_id: f.object_id, fix: "remove_reference", values: { reference: el.dataset.fixRemove } }], "repair");
    });
    root.querySelectorAll("[data-fix-refactor-on]").forEach(el => el.onclick = async () => { await this._hass.callWS({ type: "ha_housekeeper/refactor_set", enabled: true }); this.loadFixWays(this.fixKey); });
    root.querySelectorAll("[data-fix-pick]").forEach(el => el.onchange = () => { if (el.checked) this.findSel.add(el.dataset.fixPick); else this.findSel.delete(el.dataset.fixPick); this.render(); });
    root.querySelectorAll("[data-fix-pick-all]").forEach(el => el.onclick = () => { el.dataset.fixPickAll.split("|").forEach(k => this.findSel.add(k)); this.render(); });
    root.querySelectorAll("[data-fix-work-off]").forEach(el => el.onclick = () => this.fixWork(false));
    root.querySelectorAll("[data-ha-path],[data-fix-replace],[data-fix-id-replace],[data-fix-remove],[data-fix-catch],[data-fix-object],[data-fix-round],[data-fix-check]").forEach(el => { if (this.view === "fix") el.addEventListener("click", () => this.fixWork(true)); });
    root.querySelectorAll("[data-fix-check]").forEach(el => el.onclick = () => { this.fixCheckedFrom = this.data?.meta?.scanned_at || ""; this.load(true); });
  }
}
Object.assign(TEXT.de, {
  fix: "Beheben", fixTitle: "Beheben", fixSubtitle: "Verstehen, entscheiden, ausführen, nachprüfen.", fixBack: "Zurück", fixRowOpen: "Beheben",
  fixStepUnderstand: "Verstehen", fixStepDecide: "Entscheiden", fixStepRun: "Ausführen", fixStepCheck: "Nachprüfen",
  fixWhat: "Was los ist", fixAffects: "Betroffen", fixPattern: "Muster", fixPatternAt: "Fällt immer gegen {hour} Uhr aus", fixRecommended: "empfohlen", fixExits: "Oder entscheiden, nicht zu beheben", fixNoWays: "Für diese Art von Befund gibt es noch keine geführten Wege. Du kannst ihn entscheiden oder das Objekt öffnen.",
  fixOpenHA: "In Home Assistant öffnen", fixOpenActions: "Aktionen des Objekts", fixCollectTitle: "Gesammelt beheben", fixCollectHint: "Wähle aus, was einbezogen wird, dann ein Weg für alle.", fixPickAll: "Alle wählen",
  fixRunHint: "Was etwas ändert, läuft über einen Plan mit Vorschau, Bestätigung, Backup und Zurücknehmen. Wege in Home Assistant öffnen sich dort. Nichts geschieht ohne deinen Klick.",
  fixCheckHint: "Housekeeper scannt neu und sagt, ob der Befund noch da ist.", fixCheckNow: "Neu scannen und prüfen", fixDone: "Behoben: der Befund ist im neuen Scan nicht mehr da.", fixStillOpen: "Bleibt offen: der Befund ist im neuen Scan noch da. Prüfe, ob der gewählte Weg schon durchgelaufen ist, oder warte auf den nächsten Scan.", fixGone: "Der Befund ist nicht mehr da.",
  fixWay_wait: "Abwarten", fixWayHint_wait: "Die Integration versucht es von selbst noch einmal.",
  fixWay_restart_or_update: "Home Assistant neu starten oder aktualisieren", fixWayHint_restart_or_update: "Eine Migration oder das Entladen ist hängen geblieben; meist hilft ein Neustart oder ein Update der Integration.",
  fixWay_open_integration: "Integration ansehen", fixWayHint_open_integration: "Die Integrationsseite zeigt den Fehler und bietet dort „Neu laden“ an.",
  fixWay_reauth: "Neu anmelden", fixWayHint_reauth: "Die Zugangsdaten gelten nicht mehr. Die Integrationsseite führt durch die Anmeldung.",
  fixWay_mark: "Ist so gewollt (Vermerk)", fixWayHint_mark: "Sag Housekeeper, dass das Objekt absichtlich offline ist, auch mit Zeitfenster.",
  fixWay_exchange: "Gerät austauschen", fixWayHint_exchange: "Für ein ersetztes Gerät: Automationen und Szenen auf das neue Gerät umstellen.",
  fixWay_replace_entity: "Entität ersetzen", fixWayHint_replace_entity: "Alle Stellen, die diese Entität nutzen, auf eine andere umstellen.",
  fixWay_object_actions: "Deaktivieren oder entfernen", fixWayHint_object_actions: "Die Aktionen des Objekts: deaktivieren, entfernen, austauschen, jeweils mit Vorschau.",
  fixWay_replace_target: "Ziel ersetzen", fixWayHint_replace_target: "Alle Stellen, die das fehlende Ziel nennen, auf ein vorhandenes umstellen: bei einer Entität mit einem ähnlichen Vorschlag, bei Bereich, Etage und Label nach deiner Wahl (nur dort, wo der Schlüssel dafür steht). Die Vorschau zeigt jede Stelle.",
  fixWay_open_editor: "Im Editor öffnen", fixWayHint_open_editor: "Die Stelle in Home Assistant selbst anpassen.", fixReplaceStart: "Ersetzen …", fixReplaceWith: "Ersetzen durch", fixReplaceNone: "Es gibt kein anderes Ziel dieser Art, auf das sich umstellen ließe.",
  fixWay_remove_reference: "Verweis entfernen", fixWayHint_remove_reference: "Nimmt das fehlende Ziel nur aus Ziellisten der Aktionen heraus, in denen weitere Ziele stehen bleiben. Trigger, Bedingungen und Ziele, die allein stehen, fasst Housekeeper nie an; dort bleibt der Editor. Mit Vorschau, Prüfung, Backup und Zurücknehmen.", fixRemoveStart: "Entfernen …", fixRefactorOn: "Verbessern einschalten (experimentell)",
  fixWorkSince: "angefangen am {date}", fixWorkOff: "Nicht mehr bearbeiten",
  fixLastFailure: "Letzter Fehler", fixFailureStep: "bei {step}", fixFailureHint: "Hinweis", fixFailureHintText: "Der Fehlertext nennt {entity}, und die ist ausgefallen. Eine sichere Zuordnung ist das nicht.", fixToFinding: "Zum Befund",
  fixWay_fix_cause: "Erst die Ursache beheben", fixWayHint_fix_cause: "Die Automation scheitert, weil etwas darunter ausgefallen ist. Ist die Ursache behoben, läuft sie von selbst wieder.",
  fixWay_catch_error: "Fehler abfangen", fixWayHint_catch_error: "Setzt „bei Fehler weitermachen“ nur an der einen Aktion, die zuletzt gescheitert ist, nie für die ganze Automation. Der Fehler erscheint danach nicht mehr in den Läufen, und der Rest läuft weiter. Mit Vorschau, Prüfung, Backup und Zurücknehmen.", fixCatchStart: "Abfangen …", fixCatchNoStep: "Dafür braucht es einen letzten Fehler im Ablaufprotokoll von Home Assistant; der ist gerade nicht da.",
  fixWay_start_app: "App starten", fixWayHint_start_app: "Die App ist gestoppt, ihre Integration hängt vermutlich daran. In Home Assistant unter Einstellungen → Apps starten.",
});
Object.assign(TEXT.en, {
  fix: "Fix", fixTitle: "Fix", fixSubtitle: "Understand, decide, carry out, check.", fixBack: "Back", fixRowOpen: "Fix",
  fixStepUnderstand: "Understand", fixStepDecide: "Decide", fixStepRun: "Carry out", fixStepCheck: "Check",
  fixWhat: "What is wrong", fixAffects: "Affects", fixPattern: "Pattern", fixPatternAt: "Always fails around {hour}:00", fixRecommended: "recommended", fixExits: "Or decide not to fix it", fixNoWays: "There are no guided ways for this kind of finding yet. You can decide it or open the object.",
  fixOpenHA: "Open in Home Assistant", fixOpenActions: "Actions of the object", fixCollectTitle: "Fix together", fixCollectHint: "Choose what is included, then one way for all.", fixPickAll: "Pick all",
  fixRunHint: "Whatever changes something goes through a plan with preview, confirmation, backup and undo. Ways in Home Assistant open there. Nothing happens without your click.",
  fixCheckHint: "Housekeeper scans again and says whether the finding is still there.", fixCheckNow: "Scan again and check", fixDone: "Fixed: the finding is gone in the new scan.", fixStillOpen: "Still open: the finding is still there in the new scan. Check whether the chosen way has finished, or wait for the next scan.", fixGone: "The finding is gone.",
  fixWay_wait: "Wait", fixWayHint_wait: "The integration tries again by itself.",
  fixWay_restart_or_update: "Restart or update Home Assistant", fixWayHint_restart_or_update: "A migration or an unload got stuck; a restart or an update of the integration usually helps.",
  fixWay_open_integration: "Look at the integration", fixWayHint_open_integration: "The integration page shows the error and offers “Reload” there.",
  fixWay_reauth: "Log in again", fixWayHint_reauth: "The credentials no longer work. The integration page leads through the login.",
  fixWay_mark: "Intended (mark)", fixWayHint_mark: "Tell Housekeeper the object is offline on purpose, also with a time window.",
  fixWay_exchange: "Exchange the device", fixWayHint_exchange: "For a replaced device: move automations and scenes to the new device.",
  fixWay_replace_entity: "Replace the entity", fixWayHint_replace_entity: "Move every place that uses this entity to another one.",
  fixWay_object_actions: "Disable or remove", fixWayHint_object_actions: "The actions of the object: disable, remove, exchange, each with a preview.",
  fixWay_replace_target: "Replace the target", fixWayHint_replace_target: "Move every place that names the missing target to an existing one: for an entity with a similar one proposed, for an area, floor or label as you choose (only where the key for it stands). The preview shows each place.",
  fixWay_open_editor: "Open in the editor", fixWayHint_open_editor: "Adjust the place in Home Assistant yourself.", fixReplaceStart: "Replace …", fixReplaceWith: "Replace with", fixReplaceNone: "There is no other target of this kind to move to.",
  fixWay_remove_reference: "Remove the reference", fixWayHint_remove_reference: "Takes the missing target only out of target lists of the actions in which other targets stay. Housekeeper never touches triggers, conditions or a target that stands alone; the editor is for those. With preview, check, backup and undo.", fixRemoveStart: "Remove …", fixRefactorOn: "Turn on Improve (experimental)",
  fixWorkSince: "started on {date}", fixWorkOff: "Stop working on it",
  fixLastFailure: "Last failure", fixFailureStep: "at {step}", fixFailureHint: "Hint", fixFailureHintText: "The error text names {entity}, and that is down. It is no safe attribution.", fixToFinding: "Go to the finding",
  fixWay_fix_cause: "Fix the cause first", fixWayHint_fix_cause: "The automation fails because something below it is down. Once the cause is fixed, it runs again by itself.",
  fixWay_catch_error: "Catch the error", fixWayHint_catch_error: "Sets “continue on error” only on the one action that failed last, never for the whole automation. Afterwards the error no longer shows in the runs, and the rest keeps running. With preview, check, backup and undo.", fixCatchStart: "Catch …", fixCatchNoStep: "This needs a last failure in Home Assistant's trace buffer; there is none right now.",
  fixWay_start_app: "Start the app", fixWayHint_start_app: "The app is stopped, its integration probably hangs on it. Start it in Home Assistant under Settings → Apps.",
});
