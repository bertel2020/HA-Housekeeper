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

  causesCard() {
    const causes = this.causeList();
    if (!causes.length) return "";
    const rows = causes.map(c => `<button class="row" data-object="${this.esc(`${c.object_type}:${c.object_id}`)}">${this.tile(c.object_type, "red")}<span class="row-text"><strong>${this.esc(this.t(`cause_${c.kind}`, { name: c.name }))}</strong><small>${this.esc(this.causeLine(c))}</small></span><span class="pill red">${this.t("causeFollowers", { n: this.formatNumber(c.follower_count) })}</span></button>`).join("");
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
