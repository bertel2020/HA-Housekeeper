// FcRecommendMixin: the row "Recommendation" of a card of the cleanup, and the way "Fix" unfolds in the card. The
// recommendation is worked out from the facts the card shows (how long, what hangs on it, how often, what uses it), is
// always exactly one of the answers of that card with its reason, and decides nothing: the person clicks. "Keep"
// ("Ist so gewollt") is never recommended by itself. Mixed into the panel in 99-register.js.
Object.assign(TEXT.de, {
  fcRecLabel: "Empfehlung", fcRecTag: "Empfohlen",
  fcRecFix: "Beheben.", fcRecLater: "Später erinnern.", fcRecTake: "Vermerk setzen.", fcRecPick: "Zum Entfernen vormerken.", fcRecPickAll: "Alle vormerken.", fcRecMerge: "Zusammenführen.", fcRecRest: "Auf „Später“ legen.",
  fcRecFixBroken: "Ein kaputter Verweis oder Fehler geht nicht von selbst weg.",
  fcRecFixNoSince: "Seit wann es besteht, ist nicht bekannt; lieber jetzt ansehen.",
  fcRecFixLong: "Seit {span} aus, die Wirkung ist schon Mittel oder höher.",
  fcRecFixFollows: "{n} Folgen hängen daran; eine Ursache löst sie alle.",
  fcRecLaterShort: "Wird es schlimmer, kommt es von selbst zurück: seit {span} aus, die nächste Stufe ({level}) beginnt in {next}",
  fcRecLaterOften: "Es fällt immer wieder aus; ein einzelner Ausfall sagt wenig. Für ein wiederkehrendes Muster passt ein Vermerk (Etappe 2).",
  fcRecTakeText: "Das Muster wiederholt sich ({n} Ausfälle in {days} Tagen); der Vermerk blendet es aus, bis es sich ändert.",
  fcRecTakeGeneric: "Das Muster wiederholt sich; ein Vermerk blendet es aus, statt jedes Mal einen Befund zu melden.",
  fcRecPickSafe: "Nichts verweist darauf. Es läuft erst am Ende als ein Plan mit Vorschau und Backup.",
  fcRecLaterLook: "Hier spricht etwas dagegen ({reason}). Erst ansehen, später entscheiden.",
  fcRecLaterLookNone: "Hier spricht etwas dagegen. Erst ansehen, später entscheiden.",
  fcRecMergeText: "Es ist ein Duplikat von {name}; Zusammenführen räumt es sauber auf.",
  fcRecPickAllText: "Nichts verweist darauf. Es läuft erst am Ende als ein Plan mit Vorschau und Backup.",
  fcRecRestText: "{n} Befunde mit niedriger Wirkung oder Info, nichts ist zu tun und an Home Assistant ändert sich nichts. Sie kommen nach {days} Tagen zurück.",
  fcFixWaysHead: "Wege zum Beheben", fcFixObject: "Zum Objekt", fcFixObjectHint: "Selbst ansehen und lösen. Von dort kommst du hierher zurück.",
  fcFixNone: "Für diesen Befund führt Housekeeper keinen Schritt aus; die Seite des Objekts zeigt, was du in Home Assistant tun kannst.",
});
Object.assign(TEXT.en, {
  fcRecLabel: "Recommendation", fcRecTag: "Recommended",
  fcRecFix: "Fix.", fcRecLater: "Remind me later.", fcRecTake: "Set a mark.", fcRecPick: "Mark for removal.", fcRecPickAll: "Mark them all.", fcRecMerge: "Merge.", fcRecRest: "Put off to “Later”.",
  fcRecFixBroken: "A broken reference or a fault does not go away by itself.",
  fcRecFixNoSince: "It is not known since when this has been the case; better to look at it now.",
  fcRecFixLong: "Down for {span}, the impact is already medium or higher.",
  fcRecFixFollows: "{n} findings hang on it; one cause solves them all.",
  fcRecLaterShort: "If it gets worse, it comes back by itself: down for {span}, the next level ({level}) starts in {next}",
  fcRecLaterOften: "It keeps failing; a single outage says little. For a recurring pattern a mark fits (stage 2).",
  fcRecTakeText: "The pattern repeats ({n} outages in {days} days); the mark hides it until it changes.",
  fcRecTakeGeneric: "The pattern repeats; a mark hides it instead of reporting a finding every time.",
  fcRecPickSafe: "Nothing refers to it. It only runs at the end as one plan with preview and backup.",
  fcRecLaterLook: "Something speaks against it ({reason}). Look at it first, decide later.",
  fcRecLaterLookNone: "Something speaks against it. Look at it first, decide later.",
  fcRecMergeText: "It is a duplicate of {name}; merging tidies it up cleanly.",
  fcRecPickAllText: "Nothing refers to them. It only runs at the end as one plan with preview and backup.",
  fcRecRestText: "{n} findings with low impact or info, nothing to do and nothing changes in Home Assistant. They come back after {days} days.",
  fcFixWaysHead: "Ways to fix it", fcFixObject: "Go to the object", fcFixObjectHint: "Look at it and solve it yourself. You come back here from there.",
  fcFixNone: "Housekeeper runs no step for this finding; the page of the object shows what you can do in Home Assistant.",
});

class FcRecommendMixin {
  // A card of stage 1 or 3: a finding with its object. Returns { act, head, body }; `act` names the answer that is recommended.
  fcRecCard(f, key) {
    const t = (k, p) => this.t(k, p);
    const cause = this.causeList().find(c => c.finding_key === f.key);
    const outage = Boolean(cause) || OUTAGE_RULES.includes(f.rule_id);
    if (!outage) return { act: "fix", head: t("fcRecFix"), body: t("fcRecFixBroken") };
    const followers = this.fcFollowers(f), since = Date.parse(f.first_detected_at);
    if (followers >= 5) return { act: "fix", head: t("fcRecFix"), body: t("fcRecFixFollows", { n: this.formatNumber(followers) }) };
    if (!since) return { act: "fix", head: t("fcRecFix"), body: t("fcRecFixNoSince") };
    const hours = Math.max(0, (Date.now() - since) / 3600000), steps = this.outageSteps();
    if (hours >= (steps.find(([id]) => id === "medium") || [0, 24])[1]) return { act: "fix", head: t("fcRecFix"), body: t("fcRecFixLong", { span: this.spanText(hours) }) };
    if (this.oftenFor?.(f)) return { act: "later", head: t("fcRecLater"), body: t("fcRecLaterOften") };
    const next = steps.find(([, at]) => at > hours);
    return { act: "later", head: t("fcRecLater"), body: next ? t("fcRecLaterShort", { span: this.spanText(hours), level: t(`chip_${next[0]}`), next: this.spanText(next[1] - hours) }) : t("fcRecLaterOften") };
  }

  // A suggestion of stage 2: always "set the mark"; the reason names the pattern.
  fcRecOften(item) {
    const info = item.often?.info || {}, t = (k, p) => this.t(k, p);
    return { act: "take", head: t("fcRecTake"), body: info.episodes ? t("fcRecTakeText", { n: this.formatNumber(info.episodes), days: item.often?.days || "" }) : t("fcRecTakeGeneric") };
  }

  // One object of stage 4: a duplicate merges, what nothing uses is marked, the rest is looked at first.
  fcRecRound(r) {
    const t = (k, p) => this.t(k, p);
    if (r.kind === "merge") return { act: "merge", head: t("fcRecMerge"), body: t("fcRecMergeText", { name: r.duplicate_of || "?" }) };
    if (r.group === "safe") return { act: "pick", head: t("fcRecPick"), body: t("fcRecPickSafe") };
    const reason = (r.reasons || []).filter(x => x !== "config_rewrite").map(x => t(`reason_${x}`))[0];
    return { act: "later", head: t("fcRecLater"), body: reason ? t("fcRecLaterLook", { reason }) : t("fcRecLaterLookNone") };
  }

  fcRecSafe() { return { act: "pick", head: this.t("fcRecPickAll"), body: this.t("fcRecPickAllText") }; }

  fcRecRest(count, days) { return { act: "rest", head: this.t("fcRecRest"), body: this.t("fcRecRestText", { n: this.formatNumber(count), days }) }; }

  // The row for fcInfoHtml.
  fcRecRow(rec) { return { id: "rec", rec: true, label: this.t("fcRecLabel"), head: rec.head, text: rec.body, empty: false, tab: "" }; }

  // The ways of "Fix" for one object, unfolded in the card: what Housekeeper can do for it, and the page of the object.
  fcFixWays(key, obj) {
    if (!obj || this.fcFixOpen !== key) return "";
    const items = this.fixItems(obj, key).items;
    const rows = items.map(it => `<div class="fcway"><span class="fcii fcii-blue"><ha-icon icon="${this.esc(it.icon)}"></ha-icon></span><span class="fctxt"><strong>${it.label}</strong><small>${this.t(it.hint)}</small></span><button type="button" class="btn" ${it.attr}>${this.t("actOpen")}</button></div>`).join("");
    const object = `<div class="fcway"><span class="fcii fcii-mute"><ha-icon icon="mdi:open-in-new"></ha-icon></span><span class="fctxt"><strong>${this.t("fcFixObject")}</strong><small>${this.t("fcFixObjectHint")}</small></span><button type="button" class="btn quiet" data-fc-object="${this.esc(key)}">${this.t("actOpen")}</button></div>`;
    return `<div class="fcways"><small class="fceyebrow">${this.t("fcFixWaysHead")}</small>${rows}${object}${items.length ? "" : `<p class="fcfacts">${this.t("fcFixNone")}</p>`}</div>`;
  }
}
