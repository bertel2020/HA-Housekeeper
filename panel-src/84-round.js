// RoundMixin: the cleanup round (Aufräum-Runde) over everything unneeded. The backend judges each object with the cleanup
// plan and sorts it: removable at once, to look at first, not removable now. The round only names and collects; the
// removals run as one plan with preview and confirmation, "keep" is the decision "intended" with the mark "do not remove".
class RoundMixin {
  openRound() {
    this.noteJump("round");
    this.view = "round"; this.round = { rows: null, picked: new Set(), error: "" }; this.selected = null; this.pages = {};
    this.render();
    this.loadRound();
  }

  async loadRound() {
    const round = this.round;
    try {
      const reply = await this._hass.callWS({ type: "ha_housekeeper/cleanup_round" });
      if (this.round !== round) return;
      round.rows = reply?.rows || [];
      round.rows.filter(r => r.group === "safe").forEach(r => round.picked.add(r.finding_key));
    } catch (err) { if (this.round === round) { round.rows = []; round.error = this.errText(err); } }
    if (this.view === "round") this.render();
  }

  roundRow(r, picked) {
    const finding = this.data.findings.find(f => f.key === r.finding_key);
    const action = { remove_entity: "roundRemove", delete_automation: "roundDelete", disable_entity: "roundDisable", merge: "roundMerge" }[r.kind];
    const reasons = (r.reasons || []).filter(x => x !== "config_rewrite").map(x => this.t(`reason_${x}`)).join(" ");
    const box = r.kind !== "merge" && r.group !== "blocked" ? `<input type="checkbox" data-round-pick="${this.esc(r.finding_key)}" ${picked.has(r.finding_key) ? "checked" : ""} aria-label="${this.esc(r.name)}">` : "";
    const keep = `<button type="button" class="btn quiet" data-round-keep="${this.esc(r.finding_key)}">${this.t("roundKeep")}</button>`;
    const main = r.group === "blocked" ? "" : r.kind === "merge"
      ? (r.duplicate_of ? `<button type="button" class="btn" data-round-merge="${this.esc(r.object_id)}" data-round-into="${this.esc(r.duplicate_of)}">${this.t(action)}</button>` : "")
      : `<button type="button" class="btn" data-round-one="${this.esc(r.finding_key)}">${this.t(action)}</button>`;
    const why = r.kind === "merge" ? this.t("roundDuplicateOf", { name: r.duplicate_of || "?" }) : [r.first_step ? this.t("roundFirstStep") : "", reasons].filter(Boolean).join(" · ");
    return `<div class="row${box ? "" : " fixway"}">${box}<span class="row-text"><strong>${this.esc(r.name)}</strong><small>${this.esc([finding ? this.findingTitle(finding) : "", why].filter(Boolean).join(" · "))}</small></span>${main}${keep}</div>`;
  }

  roundGroup(title, hint, rows, picked, withAll) {
    if (!rows.length) return "";
    const keys = rows.filter(r => r.kind !== "merge" && r.group !== "blocked").map(r => r.finding_key);
    const all = withAll && keys.length ? `<button type="button" class="btn" data-round-all="${this.esc(keys.join("|"))}">${this.t("roundPickAll")}</button>` : "";
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t(title)} (${this.formatNumber(rows.length)})</h2><p>${this.t(hint)}</p></div>${all}</div>${rows.map(r => this.roundRow(r, picked)).join("")}</section>`;
  }

  roundView() {
    const round = this.round || { rows: null, picked: new Set(), error: "" };
    const back = this.fcWizOn() ? "" : `<div class="pad"><button class="btn" data-action="view-back">${this.t("fixBack")}</button></div>`;
    if (round.rows === null) return `<div class="stack"><section class="panel"><div class="pad"><small>${this.t("loading")}</small></div></section>${back}</div>`;
    const rows = round.rows, by = group => rows.filter(r => r.group === group);
    const chosen = rows.filter(r => round.picked.has(r.finding_key) && r.kind !== "merge" && r.group !== "blocked");
    const error = round.error ? this.notice("warn", this.esc(round.error)) : "";
    const empty = rows.length ? "" : `<section class="panel"><div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("roundEmpty")}</div></section>`;
    const bar = chosen.length ? `<div class="mbtns"><button type="button" class="btn primary" data-round-plan ${this.planBusy ? "disabled" : ""}><ha-icon icon="mdi:clipboard-list-outline"></ha-icon>${this.t("roundPlan", { n: chosen.length })}</button></div><p class="factnote">${this.t("roundPlanHint")}</p>` : "";
    return `<div class="stack">${error}${empty}${this.roundGroup("roundSafe", "roundSafeHint", by("safe"), round.picked, true)}${this.roundGroup("roundLook", "roundLookHint", by("look"), round.picked, false)}${this.roundGroup("roundBlocked", "roundBlockedHint", by("blocked"), round.picked, false)}${bar ? `<section class="panel">${bar}</section>` : ""}${back}</div>`;
  }

  // "Keep": the decision "intended" with the usual 90 days, and for an entity or device also the mark that locks cleanup steps.
  async roundKeepOne(key) {
    const finding = this.data.findings.find(f => f.key === key);
    if (!finding) return;
    const days = this.defaultDays("keep");
    await this._hass.callWS({ type: "ha_housekeeper/ignore", finding_key: key, ignored: true, kind: "keep", reason: this.t("roundKeepReason"), days });
    const [type, ...rest] = this.findingKey(finding).split(":");
    if (["entity", "device"].includes(type)) await this._hass.callWS({ type: "ha_housekeeper/mark_set", object_type: type, object_id: rest.join(":"), kind: "keep", reason: this.t("roundKeepReason") });
  }

  async roundPlan(keys) {
    const round = this.round, rows = round.rows.filter(r => keys.includes(r.finding_key));
    round.error = "";
    try { await this.newPlan(rows.map(r => ({ kind: r.kind, object_id: r.object_id })), "cleanup"); }
    catch (err) { round.error = this.errText(err); this.render(); }
  }

  bindRound(root) {
    root.querySelectorAll("[data-round-pick]").forEach(el => el.onchange = () => { if (el.checked) this.round.picked.add(el.dataset.roundPick); else this.round.picked.delete(el.dataset.roundPick); this.render(); });
    root.querySelectorAll("[data-round-all]").forEach(el => el.onclick = () => { el.dataset.roundAll.split("|").forEach(k => this.round.picked.add(k)); this.render(); });
    root.querySelectorAll("[data-round-one]").forEach(el => el.onclick = () => this.roundPlan([el.dataset.roundOne]));
    root.querySelector("[data-round-plan]")?.addEventListener("click", () => this.roundPlan([...this.round.picked]));
    root.querySelectorAll("[data-round-merge]").forEach(el => el.onclick = () => this.startCleanup("replace_references", () => { this.replOld = el.dataset.roundMerge; this.replNew = el.dataset.roundInto; }));
    root.querySelectorAll("[data-round-keep]").forEach(el => el.onclick = async () => {
      try { await this.roundKeepOne(el.dataset.roundKeep); await this.refreshData(); this.round.rows = this.round.rows.filter(r => r.finding_key !== el.dataset.roundKeep); }
      catch (err) { this.round.error = this.errText(err); }
      this.render();
    });
  }
}
Object.assign(TEXT.de, {
  roundTitle: "Aufräum-Runde", roundSubtitle: "Alles Überflüssige auf einmal durchgehen.",
  roundSafe: "Sicher entfernbar", roundSafeHint: "Nirgends verwendet, ohne Vermerk „Nicht entfernen“, nicht kritisch. Die Auswahl lässt sich ändern.",
  roundLook: "Erst ansehen", roundLookHint: "Verwendet, nur ein erster Schritt (erst deaktivieren) oder ein mögliches Duplikat: jedes einzeln entscheiden.",
  roundBlocked: "Jetzt nicht entfernbar", roundBlockedHint: "Der Plan würde es sperren. Du kannst es behalten.",
  roundRemove: "Entfernen", roundDelete: "Löschen", roundDisable: "Deaktivieren", roundMerge: "Zusammenführen", roundKeep: "Behalten", roundPickAll: "Alle wählen",
  roundFirstStep: "erst deaktivieren (Quarantäne)", roundDuplicateOf: "mögliches Duplikat von {name}",
  roundPlan: "Plan anlegen ({n})", roundPlanHint: "Der Plan zeigt jede Änderung zur Vorschau; nichts läuft ohne deine Bestätigung. Backup und Zurücknehmen wie sonst.",
  roundEmpty: "Nichts Überflüssiges offen.", roundKeepReason: "In der Aufräum-Runde behalten", fixWay_cleanup_round: "Aufräum-Runde", fixWayHint_cleanup_round: "Alles Überflüssige durchgehen: sicher Entfernbares gesammelt, den Rest einzeln, jeweils mit Behalten.", fixRoundStart: "Aufräum-Runde öffnen",
});
Object.assign(TEXT.en, {
  roundTitle: "Cleanup round", roundSubtitle: "Go through everything unneeded at once.",
  roundSafe: "Safe to remove", roundSafeHint: "Used nowhere, without the mark “do not remove”, not critical. The selection can be changed.",
  roundLook: "Look first", roundLookHint: "Used, only a first step (disable first) or a possible duplicate: decide each one on its own.",
  roundBlocked: "Not removable now", roundBlockedHint: "The plan would block it. You can keep it.",
  roundRemove: "Remove", roundDelete: "Delete", roundDisable: "Disable", roundMerge: "Merge", roundKeep: "Keep", roundPickAll: "Pick all",
  roundFirstStep: "disable first (quarantine)", roundDuplicateOf: "possible duplicate of {name}",
  roundPlan: "Create plan ({n})", roundPlanHint: "The plan shows every change as a preview; nothing runs without your confirmation. Backup and undo as usual.",
  roundEmpty: "Nothing unneeded is open.", roundKeepReason: "Kept in the cleanup round", fixWay_cleanup_round: "Cleanup round", fixWayHint_cleanup_round: "Go through everything unneeded: what is safe to remove together, the rest one by one, each with Keep.", fixRoundStart: "Open the cleanup round",
});
