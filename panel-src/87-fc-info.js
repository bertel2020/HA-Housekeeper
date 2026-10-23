// FcInfoMixin: the block "Why is this here?" of a card of the cleanup. Four rows with fixed labels and a fixed height, so
// the answers of every card stand in the same place; a row with nothing to say reads "No information". A row with a
// detail page behind it opens that tab of the object (the band on top leads back to the cleanup).
class FcInfoMixin {
  // The first of the wanted tabs the object has, else its overview.
  fcTabFor(item, key, wanted) {
    const ids = this.detailTabs(item, key).map(tab => tab[0]);
    return wanted.find(id => ids.includes(id)) || "overview";
  }

  fcInfoRows(f, key, obj) {
    const cause = this.causeList().find(c => c.finding_key === f.key || (c.object_type === obj?.object_type && c.object_id === obj?.object_id));
    const none = this.t("fcInfoNone");
    // Duration: an outage counts its hours and says when it gets worse; anything else says since when it is known.
    const outage = Boolean(cause) || OUTAGE_RULES.includes(f.rule_id);
    const duration = (outage && this.outageLineOf(f)) || (f.first_detected_at ? this.t("fcSince", { age: this.agoText(f.first_detected_at) }) : "");
    // State: what the integration says and its log; for an entity how often it fails, else its state.
    let state = "";
    if (cause?.kind === "integration_down") state = [cause.state ? this.t("causeState", { state: cause.state }) : "", cause.error || "", this.logLine(cause.log)].filter(Boolean).join(" · ");
    else if (this.oftenFor(f)) { const w = this.oftenWindow(this.oftenFor(f).info); state = w ? this.t("oftenChipAt", w) : this.t("oftenChip"); }
    else if (obj?.object_type === "entity" && typeof obj.state === "string") state = obj.state;
    // What hangs on it: the follow-ups and what uses it; nothing is an answer as well.
    const followers = cause ? this.causeTotal(cause) : 0, uses = ["automation", "script", "dashboard"].filter(k => cause?.consumers?.[k]).map(k => this.t(`causeUses_${k}`, { n: cause.consumers[k] }));
    const edges = obj ? this.edgesTo(key).length : 0;
    const links = [followers ? this.t(followers === 1 ? "causeFollowers1" : "causeFollowers", { n: this.formatNumber(followers) }) : "", ...uses, !followers && !uses.length && edges ? this.t(edges === 1 ? "fcInfoUsedBy1" : "fcInfoUsedBy", { n: this.formatNumber(edges) }) : ""].filter(Boolean).join(" · ");
    const row = (id, label, text, tabs, tone = "") => ({ id, label: this.t(label), text: text || none, empty: !text, tone: text ? tone : "", tab: obj && text ? this.fcTabFor(obj, key, tabs) : "" });
    return [
      row("duration", "fcInfoDuration", duration, ["history", "reliability", "overview"]),
      row("state", "fcInfoState", state, ["diagnosis", "reliability", "overview"]),
      links || !outage ? row("links", "fcInfoLinks", links || this.t("fcInfoNothing"), ["relations", "used", "members", "overview"], links ? "" : "ok") : row("links", "fcInfoLinks", this.t("fcInfoNothing"), ["relations", "used", "members", "overview"], "ok"),
      row("impact", "fcInfoImpact", f.impact && f.impact !== "none" ? this.impactLine(f) : "", ["overview"]),
    ];
  }

  fcInfoBlock(f, key, obj) { return this.fcInfoHtml(this.fcInfoRows(f, key, obj), key); }

  // The rows of a suggestion of stage 2: the pattern, how often, how long, and what the mark would hide. "How often" opens the reliability of the object.
  fcOftenInfo(item, r) {
    const info = item.often?.info || {}, none = this.t("fcInfoNone"), obj = this.findObject(r.link);
    const often = info.episodes ? this.t("fcInfoEpisodes", { n: this.formatNumber(info.episodes), days: item.often.days || "" }) : "";
    const mean = info.mean_seconds ? this.t("fcInfoMean", { span: this.spanText(info.mean_seconds / 3600) }) : "";
    const hides = item.hides ? this.t(item.hides === 1 ? "fcInfoHides1" : "fcInfoHides", { n: this.formatNumber(item.hides) }) : this.t("fcInfoHidesNone");
    const row = (id, label, text, tabs) => ({ id, label: this.t(label), text: text || none, empty: !text, tab: obj && text && tabs ? this.fcTabFor(obj, r.link, tabs) : "" });
    return this.fcInfoHtml([row("pattern", "fcInfoPattern", r.pattern), row("often", "fcInfoOften", often, ["reliability", "overview"]), row("mean", "fcInfoMean_", mean), row("hides", "fcInfoImpact", hides)], r.link);
  }

  fcInfoHtml(list, key) {
    const rows = list.map(r => {
      const text = `<span>${this.esc(r.label)}</span><span class="${r.empty ? "fcino" : r.tone ? `fci${r.tone}` : ""}">${this.esc(r.text)}</span>`;
      return r.tab ? `<button type="button" class="fcirow" data-fc-info="${this.esc(`${key}|${r.tab}`)}" title="${this.esc(r.text)}" aria-label="${this.esc(`${r.label}: ${r.text}`)}">${text}<ha-icon icon="mdi:chevron-right"></ha-icon></button>` : `<div class="fcirow static">${text}<i></i></div>`;
    }).join("");
    return `<div class="fcinfo" role="group" aria-label="${this.esc(this.t("fcInfoTitle"))}">${rows}</div>`;
  }

  bindFcInfo(root) {
    root.querySelectorAll("[data-fc-info]").forEach(el => el.onclick = () => {
      const [key, tab] = [el.dataset.fcInfo.slice(0, el.dataset.fcInfo.lastIndexOf("|")), el.dataset.fcInfo.slice(el.dataset.fcInfo.lastIndexOf("|") + 1)], obj = this.findObject(key);
      if (obj) { this._pendingTab = tab; this.openObject(obj); }
    });
  }
}
Object.assign(TEXT.de, {
  fcInfoTitle: "Warum steht das hier?", fcInfoDuration: "Dauer", fcInfoState: "Zustand", fcInfoLinks: "Daran hängt", fcInfoImpact: "Wirkung",
  fcInfoPattern: "Muster", fcInfoOften: "Häufigkeit", fcInfoMean_: "Dauer", fcInfoEpisodes: "{n} Ausfälle in {days} Tagen", fcInfoMean: "Im Schnitt {span} pro Ausfall",
  fcInfoHides: "Der Vermerk blendet {n} Befunde aus", fcInfoHides1: "Der Vermerk blendet 1 Befund aus", fcInfoHidesNone: "Der Vermerk blendet keinen Befund aus",
  fcInfoNone: "Keine Angabe", fcInfoNothing: "Nichts hängt daran", fcInfoUsedBy: "Von {n} Objekten verwendet", fcInfoUsedBy1: "Von 1 Objekt verwendet",
});
Object.assign(TEXT.en, {
  fcInfoTitle: "Why is this here?", fcInfoDuration: "Duration", fcInfoState: "State", fcInfoLinks: "Depends on it", fcInfoImpact: "Impact",
  fcInfoPattern: "Pattern", fcInfoOften: "Frequency", fcInfoMean_: "Duration", fcInfoEpisodes: "{n} outages in {days} days", fcInfoMean: "{span} per outage on average",
  fcInfoHides: "The mark hides {n} findings", fcInfoHides1: "The mark hides 1 finding", fcInfoHidesNone: "The mark hides no finding",
  fcInfoNone: "No information", fcInfoNothing: "Nothing depends on it", fcInfoUsedBy: "Used by {n} objects", fcInfoUsedBy1: "Used by 1 object",
});
