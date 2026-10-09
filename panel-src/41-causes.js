// CausesMixin: one note for the common cause behind many "not available" findings (see causes.py).
class CausesMixin {
  causeList() { return this.data?.causes || []; }

  // Follow-up findings of a cause stay out of the list until asked for; the export keeps them.
  collapseFollowers(list) { return this.showFollowers ? list : list.filter(f => !f.cause_id); }

  causeLine(c) {
    const used = ["automation", "script", "dashboard"].filter(k => c.consumers?.[k]).map(k => this.t(`causeUses_${k}`, { n: c.consumers[k] }));
    const why = c.kind === "integration_down" ? [c.state ? this.t("causeState", { state: c.state }) : "", c.error || ""].filter(Boolean) : [];
    return [...why, ...used, c.impact && c.impact !== "none" ? this.t(`impact_${c.impact}`) : ""].filter(Boolean).join(" · ");
  }

  // One headline per cause with the counts of what it touches; the follow-up findings sit in a fold.
  causeCounts(c) {
    const parts = [this.t("causeN_entity", { n: this.formatNumber(c.follower_count) }), ...["automation", "script", "dashboard"].filter(k => c.consumers?.[k]).map(k => this.t(`causeN_${k}`, { n: c.consumers[k] }))];
    return this.t("causeCounts", { parts: parts.join(", ") });
  }

  causesCard() {
    const causes = this.causeList();
    if (!causes.length) return "";
    const followers = id => (this.data.findings || []).filter(f => f.cause_id === id && !f.ignored);
    const rows = causes.map(c => {
      const head = { tone: "red", title: this.esc(this.t(`cause_${c.kind}`, { name: c.name })), sub: [this.causeCounts(c), this.causeLine(c)].filter(Boolean).join(" · "), pill: this.t("causeFollowers", { n: this.formatNumber(c.follower_count) }) };
      const body = `<button class="row" data-object="${this.esc(`${c.object_type}:${c.object_id}`)}">${this.tile(c.object_type, "red")}<span class="row-text"><strong>${this.esc(c.name)}</strong></span></button>${followers(c.id).slice(0, 20).map(f => this.findingRow(f)).join("")}`;
      return this.fold(`cause_${c.id}`, head, body, false);
    }).join("");
    return `<div class="panel"><div class="panelhead"><div><h2>${this.t("causesTitle")}</h2><p>${this.t("causesSub")}</p></div></div>${rows}</div>`;
  }

  followerCount() { return this.data.findings.filter(f => f.cause_id && !f.ignored).length; }
}
Object.assign(TEXT.de, {
  causesTitle: "Gemeinsame Ursachen", causesSub: "Viele Befunde haben wahrscheinlich dieselbe Ursache. Beheb sie zuerst.",
  cause_integration_down: "Integration {name} ist nicht geladen", cause_device_down: "Gerät {name} ist ganz ausgefallen",
  causeFollowers: "{n} Folgebefunde", causeState: "Zustand: {state}", causeUses_automation: "{n} Automationen betroffen", causeUses_script: "{n} Skripte betroffen", causeUses_dashboard: "{n} Dashboards betroffen",
  causeShow: "Folgebefunde anzeigen", causeHide: "Folgebefunde ausblenden", actCauses: "Gemeinsame Ursachen", actCausesHint: "Ein Ausfall erklärt viele Befunde",
});
Object.assign(TEXT.en, {
  causesTitle: "Common causes", causesSub: "Many findings probably share one cause. Fix it first.",
  cause_integration_down: "Integration {name} is not loaded", cause_device_down: "Device {name} is down completely",
  causeFollowers: "{n} follow-up findings", causeState: "State: {state}", causeUses_automation: "{n} automations affected", causeUses_script: "{n} scripts affected", causeUses_dashboard: "{n} dashboards affected",
  causeShow: "Show follow-up findings", causeHide: "Hide follow-up findings", actCauses: "Common causes", actCausesHint: "One outage explains many findings",
});
