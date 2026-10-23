// FcRoundMixin: stage 4 of the cleanup as cards. The cleanup round (84-round.js) judges every unneeded object; here each one
// is a card with the same frame as the other stages: "Mark for removal", "Keep", "Later", "Skip". Nothing is removed on a
// card: what is marked (kept in the history as "pick") goes into one plan at the end, with preview, backup and confirmation.
// The objects nothing uses come first as one card.
class FcRoundMixin {
  // The cards still to answer: not marked, not skipped, not blocked, not decided; null while the round loads.
  fcRoundQueue() {
    const round = this.round;
    if (!round?.rows) return null;
    const skipped = this.fcSkipped(4);
    return round.rows.filter(r => r.group !== "blocked" && !round.picked.has(r.finding_key) && !skipped.has(r.finding_key));
  }

  fcRoundSafe(queue) { return queue.filter(r => r.group === "safe" && r.kind !== "merge"); }

  fcRoundKind(rows) {
    const count = kind => rows.filter(r => r.kind === kind).length;
    return [[count("remove_entity"), "fcRoundEntities"], [count("delete_automation"), "fcRoundAutomations"], [count("disable_entity"), "fcRoundDisable"]].filter(([n]) => n).map(([n, key]) => this.t(key, { n: this.formatNumber(n) })).join(" · ");
  }

  // The four rows of a card of one object.
  fcRoundRows(r, finding) {
    const link = `${r.object_type}:${r.object_id}`, obj = this.findObject(link), none = this.t("fcInfoNone");
    const reasons = (r.reasons || []).filter(x => x !== "config_rewrite").map(x => this.t(`reason_${x}`));
    const used = r.kind === "merge" ? this.t("roundDuplicateOf", { name: r.duplicate_of || "?" }) : r.group === "safe" ? this.t("fcRoundUnused") : reasons[0] || "";
    const since = finding?.first_detected_at ? this.t("fcSince", { age: this.agoText(finding.first_detected_at) }) : "";
    const row = (id, label, text, tabs, tone = "") => ({ id, label: this.t(label), text: text || none, empty: !text, tone: text ? tone : "", tab: obj && text && tabs ? this.fcTabFor(obj, link, tabs) : "" });
    return [
      row("action", "fcRoundAction", [r.first_step ? this.t("roundFirstStep") : "", this.t(`fcRoundHint_${r.kind}`)].filter(Boolean).join(", ")),
      row("used", "fcRoundUsed", used, ["relations", "overview"], r.group === "safe" && r.kind !== "merge" ? "ok" : ""),
      row("since", "fcRoundSince", since, ["history", "overview"]),
      row("undo", "fcRoundUndoRow", this.t(r.kind === "merge" ? "fcRoundUndoMerge" : "fcRoundUndoText")),
    ];
  }

  fcRoundCards() {
    const queue = this.fcRoundQueue(), round = this.round, listBtn = `<button type="button" class="btn quiet" data-fc-look="1">${this.t("fcAsList")}</button>`;
    if (queue === null) return `<section class="panel fcpanel"><div class="pad"><small>${this.t("loading")}</small></div></section>`;
    if (round.error) return `<section class="panel fcpanel"><div class="pad">${this.notice("warn", this.esc(round.error))}</div></section>`;
    const prevBtn = this.fcPrevButton(4);
    const picked = round.rows.filter(r => round.picked.has(r.finding_key));
    if (!queue.length) return this.fcRoundEnd(picked, prevBtn, listBtn);
    const safe = this.fcRoundSafe(queue);
    if (safe.length >= 2 && !round.single && queue[0].group === "safe") return this.fcRoundCollect(safe, queue, prevBtn, listBtn);
    return this.fcRoundOne(queue[0], queue, prevBtn, listBtn);
  }

  fcRoundOne(r, queue, prevBtn, listBtn) {
    const finding = this.data.findings.find(f => f.key === r.finding_key), link = `${r.object_type}:${r.object_id}`, obj = this.findObject(link), kattr = `data-keys="${this.esc(JSON.stringify([r.finding_key]))}"`;
    const rec = this.fcRecRound(r);
    const first = r.kind === "merge"
      ? this.fcAct(`data-fc-rmerge="${this.esc(r.object_id)}" data-into="${this.esc(r.duplicate_of || "")}"`, this.t("roundMerge"), this.t("fcRoundHint_merge"), false, "mdi:call-merge", "blue", rec.act === "merge")
      : this.fcAct(`data-fc-rpick="${this.esc(r.finding_key)}" data-name="${this.esc(r.name)}"`, this.t("fcRoundPick"), this.t("fcRoundPickHint"), false, "mdi:playlist-plus", "blue", rec.act === "pick");
    const acts = first
      + this.fcAct(`data-fc-rkeep="${this.esc(r.finding_key)}" data-link="${this.esc(link)}" data-name="${this.esc(r.name)}"`, this.t("fcKeep"), this.t("fcKeepHint", { days: this.defaultDays("keep") }), false, "mdi:check-circle-outline", "green")
      + this.fcAct(`data-fc-rlater="${this.esc(r.finding_key)}"`, this.t("fcLater"), this.t("fcLaterHint", { days: this.fc?.later_days || 90 }), false, "mdi:clock-outline", "amber", rec.act === "later");
    const pill = `<span class="pill ${r.group === "safe" ? "ok" : "warn"}">${this.t(r.group === "safe" ? "fcRoundSafe" : "fcRoundLook")}</span>`;
    return `<section class="panel fccard${this.fcAnim(`4:${r.finding_key}`)}"><div class="pad"><small class="fceyebrow">${this.fcPosition(4, queue.length)}</small><div class="fctitle">${this.tile(r.object_type, "mute")}<div><h3>${obj ? `<button type="button" class="linkbtn fclink" data-object="${this.esc(link)}">${this.esc(r.name)}</button>` : this.esc(r.name)}</h3><small class="fcid">${this.esc(r.object_id)}</small></div></div><p class="fcwhat"><strong>${this.esc(finding ? this.findingTitle(finding) : this.t("fcRoundTitle"))}</strong></p><p class="fcchips">${pill}</p>${this.fcInfoHtml([...this.fcRoundRows(r, finding), this.fcRecRow(rec)], link)}<div class="fcacts">${acts}</div><div class="fcmore">${prevBtn}<button type="button" class="btn" data-fc-skipcard="${this.esc(r.finding_key)}" ${kattr}>${this.t("fcSkipCard")}<ha-icon icon="mdi:arrow-right"></ha-icon></button>${listBtn}</div></div></section>`;
  }

  // The objects nothing uses, as one card: one click marks them all, "one by one" goes through them.
  fcRoundCollect(safe, queue, prevBtn, listBtn) {
    const keys = safe.map(r => r.finding_key), attr = `data-keys="${this.esc(JSON.stringify(keys))}"`, n = this.formatNumber(safe.length);
    const oldest = safe.map(r => this.data.findings.find(f => f.key === r.finding_key)?.first_detected_at).filter(Boolean).sort()[0];
    const info = [
      { label: this.t("fcRoundWhat"), text: this.fcRoundKind(safe) },
      { label: this.t("fcRoundUsed"), text: this.t("fcRoundUnused"), tone: "ok" },
      { label: this.t("fcRoundSince"), text: oldest ? this.t("fcRoundOldest", { age: this.agoText(oldest) }) : "", empty: !oldest },
      { label: this.t("fcRoundUndoRow"), text: this.t("fcRoundUndoText") },
    ].map(x => ({ ...x, text: x.text || this.t("fcInfoNone"), empty: x.empty || !x.text, tone: x.tone || "", tab: "" }));
    const acts = this.fcAct(`data-fc-rpick="${this.esc(keys[0])}" ${attr} data-name="${this.esc(this.t("fcLogSeveral", { n: safe.length }))}"`, this.t("fcRoundPickAll", { n }), this.t("fcRoundPickHint"), false, "mdi:playlist-plus", "blue", true)
      + this.fcAct("data-fc-rsingle", this.t("fcRoundSingle"), this.t("fcRoundSingleHint"), false, "mdi:format-list-bulleted", "mute");
    return `<section class="panel fccard${this.fcAnim("4:collect")}"><div class="pad"><small class="fceyebrow">${this.fcPosition(4, queue.length)}</small><div class="fctitle">${this.tile("entity", "ok")}<div><h3>${this.t("fcRoundCollectTitle", { n })}</h3><small class="fcid">${this.t("fcRoundCollectId")}</small></div></div><p class="fcwhat"><strong>${this.t("fcRoundTitle")}</strong></p><p class="fcchips"><span class="pill ok">${this.t("fcRoundSafe")}</span></p>${this.fcInfoHtml([...info, this.fcRecRow(this.fcRecSafe())], "")}<div class="fcacts">${acts}</div><div class="fcmore">${prevBtn}<button type="button" class="btn" data-fc-skipcard="${this.esc(keys[0])}" ${attr}>${this.t("fcSkipCard")}<ha-icon icon="mdi:arrow-right"></ha-icon></button>${listBtn}</div></div></section>`;
  }

  // Everything is answered: the marked ones go into one plan.
  fcRoundEnd(picked, prevBtn, listBtn) {
    const rest = this.stageCount(4) - picked.length, blocked = this.round.rows.filter(r => r.group === "blocked").length;
    if (!picked.length) {
      const left = this.round.rows.filter(r => r.group !== "blocked").length;
      return `<section class="panel fcpanel"><div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t(left ? "fcCardsLeft" : "fcCardsDone", { n: this.formatNumber(left) })}</div><div class="pad fcmore">${prevBtn}${left ? `<button type="button" class="btn" data-fc-again>${this.t("fcCardsAgain")}</button>` : ""}${listBtn}</div></section>`;
    }
    const n = this.formatNumber(picked.length), planBusy = this.planBusy ? "disabled" : "";
    const info = [
      { label: this.t("fcRoundWhat"), text: this.fcRoundKind(picked) },
      { label: this.t("fcRoundPlanRow"), text: this.t("fcRoundPlanText") },
      { label: this.t("fcRoundNotRemovable"), text: blocked ? this.t("fcRoundBlocked", { n: this.formatNumber(blocked) }) : this.t("fcRoundNoBlocked"), tone: blocked ? "" : "ok" },
      { label: this.t("fcRoundUndoRow"), text: this.t("fcRoundUndoText") },
    ].map(x => ({ ...x, empty: !x.text, tone: x.tone || "", tab: "" }));
    const act = `<button type="button" class="fcact primary blue" data-fc-rplan ${planBusy}><span class="fcicon"><ha-icon icon="mdi:clipboard-list-outline"></ha-icon></span><span class="fctxt"><strong>${this.t("roundPlan", { n })}</strong><small>${this.t("fcRoundPlanHint")}</small></span></button>`;
    return `<section class="panel fccard"><div class="pad"><small class="fceyebrow">${this.t("fcRoundEndEyebrow")}</small><div class="fctitle">${this.tile("entity", "mute")}<div><h3>${this.t("fcRoundEndTitle", { n })}</h3><small class="fcid">${this.t("fcRoundEndId")}</small></div></div><p class="fcwhat"><strong>${this.t("fcRoundTitle")}</strong></p><p class="fcchips"><small>${rest > 0 ? this.t("fcRoundRest", { n: this.formatNumber(rest) }) : ""}</small></p>${this.fcInfoHtml(info, "")}<div class="fcacts">${act}</div><div class="fcmore">${prevBtn}<button type="button" class="btn" data-fc-again>${this.t("fcCardsAgain")}</button>${listBtn}</div></div></section>`;
  }

  async fcRoundPick(keys, name) {
    const round = this.round;
    keys.forEach(k => round.picked.add(k));
    this.fcNotify(this.fcLogAdd({ stage: 4, action: "pick", key: keys[0], keys, n: keys.length, name }));
    if (keys.includes(this.fcFocus)) this.fcFocus = "";
    this.render();
  }

  async fcRoundKeep(key, link, name) {
    try {
      await this.roundKeepOne(key);
      this.round.rows = this.round.rows.filter(r => r.finding_key !== key);
      this.fcNotify(this.fcLogAdd({ stage: 4, action: "keep", key, keys: [key], n: 1, name, targets: [link] }));
      await this.refreshData();
    } catch (err) { this.failed(err); }
    this.render();
  }

  async fcRoundLater(key) {
    await this.fcDecide([key], "snooze");
    if (this.round?.rows) this.round.rows = this.round.rows.filter(r => r.finding_key !== key);
    this.render();
  }

  bindFcRound(root) {
    const keysOf = el => { try { const k = JSON.parse(el.dataset.keys || "null"); if (Array.isArray(k) && k.length) return k; } catch (_) { /* one key */ } return [el.dataset.fcRpick]; };
    root.querySelectorAll("[data-fc-rpick]").forEach(el => el.onclick = () => this.fcRoundPick(keysOf(el), el.dataset.name));
    root.querySelectorAll("[data-fc-rkeep]").forEach(el => el.onclick = () => this.fcRoundKeep(el.dataset.fcRkeep, el.dataset.link, el.dataset.name));
    root.querySelectorAll("[data-fc-rlater]").forEach(el => el.onclick = () => this.fcRoundLater(el.dataset.fcRlater));
    root.querySelector("[data-fc-rsingle]")?.addEventListener("click", () => { this.round.single = true; this.render(); });
    root.querySelectorAll("[data-fc-rmerge]").forEach(el => el.onclick = () => this.startCleanup("replace_references", () => { this.replOld = el.dataset.fcRmerge; this.replNew = el.dataset.into; }));
    root.querySelector("[data-fc-rplan]")?.addEventListener("click", () => this.roundPlan(this.round.rows.filter(r => this.round.picked.has(r.finding_key)).map(r => r.finding_key)));
  }
}
Object.assign(TEXT.de, {
  fcRoundTitle: "Überflüssig", fcRoundSafe: "Sicher entfernbar", fcRoundLook: "Erst ansehen", fcRoundPick: "Vormerken", fcRoundPickHint: "Zum Entfernen im Plan am Ende. Nichts läuft jetzt.", fcRoundPickAll: "Alle {n} vormerken",
  fcRoundSingle: "Einzeln ansehen", fcRoundSingleHint: "Jedes mit einer eigenen Karte.", fcRoundCollectTitle: "{n} Objekte sind sicher entfernbar", fcRoundCollectId: "Nirgends verwendet, nicht kritisch, ohne Vermerk",
  fcRoundAction: "Aktion", fcRoundUsed: "Verwendet", fcRoundSince: "Erkannt", fcRoundUndoRow: "Rückgängig", fcRoundWhat: "Was", fcRoundUnused: "Nirgends verwendet", fcRoundOldest: "der älteste {age}",
  fcRoundUndoText: "Im Journal, solange nichts geändert wurde", fcRoundUndoMerge: "Im Journal",
  fcRoundHint_remove_entity: "Entfernt den Registry-Eintrag, mit Backup und Vorschau", fcRoundHint_delete_automation: "Löscht die Automation aus der Datei", fcRoundHint_disable_entity: "Deaktiviert, entfernt wird später", fcRoundHint_merge: "Ersetzt sie überall durch die andere Entität",
  fcRoundEntities: "{n} Entitäten", fcRoundAutomations: "{n} Automationen", fcRoundDisable: "{n} zum Deaktivieren",
  fcRoundEndEyebrow: "Abschluss", fcRoundEndTitle: "{n} vorgemerkt", fcRoundEndId: "Sie laufen als ein Plan", fcRoundRest: "{n} weitere Befunde dieser Etappe bleiben offen.", fcRoundPlanRow: "Plan", fcRoundPlanText: "Vorschau, Backup und Bestätigung, erst dann läuft etwas", fcRoundNotRemovable: "Nicht entfernbar", fcRoundBlocked: "{n} Objekte sind jetzt gesperrt", fcRoundNoBlocked: "Nichts gesperrt",
  fcRoundPlanHint: "Zeigt jede Änderung zur Vorschau.", fcLogPick: "Vorgemerkt", fcSumPick: "{n} vorgemerkt",
});
Object.assign(TEXT.en, {
  fcRoundTitle: "Unneeded", fcRoundSafe: "Safe to remove", fcRoundLook: "Look first", fcRoundPick: "Mark", fcRoundPickHint: "For removal in the plan at the end. Nothing runs now.", fcRoundPickAll: "Mark all {n}",
  fcRoundSingle: "One by one", fcRoundSingleHint: "Each with a card of its own.", fcRoundCollectTitle: "{n} objects are safe to remove", fcRoundCollectId: "Used nowhere, not critical, without a mark",
  fcRoundAction: "Action", fcRoundUsed: "Used", fcRoundSince: "Found", fcRoundUndoRow: "Undo", fcRoundWhat: "What", fcRoundUnused: "Used nowhere", fcRoundOldest: "the oldest {age}",
  fcRoundUndoText: "In the Journal, as long as nothing was changed", fcRoundUndoMerge: "In the Journal",
  fcRoundHint_remove_entity: "Removes the registry entry, with backup and preview", fcRoundHint_delete_automation: "Deletes the automation from the file", fcRoundHint_disable_entity: "Disables it, removal comes later", fcRoundHint_merge: "Replaces it everywhere by the other entity",
  fcRoundEntities: "{n} entities", fcRoundAutomations: "{n} automations", fcRoundDisable: "{n} to disable",
  fcRoundEndEyebrow: "Wrap-up", fcRoundEndTitle: "{n} marked", fcRoundEndId: "They run as one plan", fcRoundRest: "{n} more findings of this stage stay open.", fcRoundPlanRow: "Plan", fcRoundPlanText: "Preview, backup and confirmation, only then something runs", fcRoundNotRemovable: "Not removable", fcRoundBlocked: "{n} objects are locked now", fcRoundNoBlocked: "Nothing locked",
  fcRoundPlanHint: "Shows every change as a preview.", fcLogPick: "Marked", fcSumPick: "{n} marked",
});
