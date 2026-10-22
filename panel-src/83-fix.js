// FixMixin: the page "Fix" (Beheben) of one finding: understand, decide, carry out, check. A page of its own without a
// menu entry; "back" returns to the list with its selection and scroll position. It names the ways and opens the
// existing steps (plan with preview, links into Home Assistant, marks, exits); it changes nothing by itself.
class FixMixin {
  openFix(key) {
    this.noteJump("fix");
    this.view = "fix"; this.fixKey = key; this.fixWays = null; this.fixCheckedFrom = null; this.selected = null; this.pages = {};
    this.render();
    this.loadFixWays(key);
  }

  async loadFixWays(key) {
    try {
      const reply = await this._hass.callWS({ type: "ha_housekeeper/fix_ways", finding_key: key });
      if (this.fixKey === key) { this.fixWays = reply?.ways || []; if (this.view === "fix") this.render(); }
    } catch (_) { if (this.fixKey === key) { this.fixWays = []; if (this.view === "fix") this.render(); } }
  }

  // Step 1: what is wrong, since when, what it affects, how sure Housekeeper is.
  fixUnderstand(f) {
    const cause = f.cause_id ? this.causeById(f.cause_id) : this.causeList().find(c => c.finding_key === f.key);
    const own = cause && cause.finding_key === f.key, since = f.first_detected_at || f.first_seen_at;
    const pattern = (f.confidence_notes || []).find(n => n.code === "pattern");
    const rows = [
      [this.t("fixWhat"), this.esc(this.findingTitle(f))],
      since ? [this.t("sortSince"), this.esc(this.formatDate(since))] : null,
      f.impact ? [this.t("sortImpact"), this.esc(this.impactLine(f))] : null,
      cause && !own ? [this.t("causeLabel"), this.esc(this.t(`cause_${cause.kind}`, { name: cause.name }))] : null,
      cause && own && cause.total_followers ? [this.t("fixAffects"), this.esc(this.tCount("causeFollowers", cause.total_followers))] : null,
      pattern ? [this.t("fixPattern"), this.esc(this.t("fixPatternAt", { hour: pattern.hour }))] : null,
      f.confidence_level ? [this.t("sortCertainty"), `${Math.round(f.confidence * 100)} %<small class="factnote">${this.esc(this.certaintyText(f))}</small>`] : null,
    ].filter(Boolean);
    return `<div class="rating">${rows.map(([label, value]) => `<div class="rrow"><b>${label}</b><div>${value}</div></div>`).join("")}</div>`;
  }

  // One way as a card: its name, what it does, and the button that starts it; the recommended one is marked.
  fixWayCard(w, f) {
    const key = this.findingKey(f), object = this.findObject(key);
    let action = "";
    if (w.kind === "link") action = `<button type="button" class="btn" data-ha-path="${this.esc(w.path)}"><ha-icon icon="mdi:open-in-new"></ha-icon>${this.t("fixOpenHA")}</button>`;
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
    return `<p class="factnote">${this.t("fixCheckHint")}</p><div class="mbtns"><button type="button" class="btn primary" data-fix-check ${this.busy ? "disabled" : ""}><ha-icon icon="mdi:magnify-scan"></ha-icon>${this.t("fixCheckNow")}</button></div>${verdict}`;
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
    root.querySelectorAll("[data-fix-pick]").forEach(el => el.onchange = () => { if (el.checked) this.findSel.add(el.dataset.fixPick); else this.findSel.delete(el.dataset.fixPick); this.render(); });
    root.querySelectorAll("[data-fix-pick-all]").forEach(el => el.onclick = () => { el.dataset.fixPickAll.split("|").forEach(k => this.findSel.add(k)); this.render(); });
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
  fixWay_start_app: "Start the app", fixWayHint_start_app: "The app is stopped, its integration probably hangs on it. Start it in Home Assistant under Settings → Apps.",
});
