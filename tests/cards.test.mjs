// Run with: node --test tests/cards.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const FRONTEND = new URL("../custom_components/ha_housekeeper/frontend/", import.meta.url);

function loadCards() {
  const registered = {}, pushed = [], events = [];
  class FakeElement {
    constructor() { this.style = {}; }
    attachShadow() { this.shadowRoot = { innerHTML: "", querySelectorAll: () => [] }; return this.shadowRoot; }
    addEventListener() {}
    appendChild() {}
    dispatchEvent(event) { (this.fired ||= []).push(event); }
  }
  const context = {
    HTMLElement: FakeElement,
    customElements: { get: name => registered[name], define: (name, cls) => { registered[name] = cls; } },
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init?.detail; } },
    document: { createElement: () => ({ addEventListener() {} }) },
    history: { pushState: (...args) => pushed.push(args) },
    dispatchEvent: event => events.push(event),
    fetch: () => new Promise(() => {}),
    Intl, Map, Set, JSON, String, Number, Array, Object, Math, Date, Promise,
  };
  vm.runInNewContext(fs.readFileSync(new URL("ha-housekeeper-cards.js", FRONTEND), "utf8") + "\nthis.X = { findEntities, cardVisibility, commonSchema, makeEditor, registerCard, HKCard, HKHealthCard, HKBatteryCard, HKFunctionsCard, HKAutoPauseCard, HKUpdateCard, CARD_TEXT };", context);
  return { ...context.X, registered, pushed, events, context };
}

const ENTITY = (id, key, platform = "ha_housekeeper") => ({ entity_id: id, platform, translation_key: key });

test("the cards find the Housekeeper entities themselves and hide only when quiet and asked to, but stay visible while editing", () => {
  const { findEntities, cardVisibility } = loadCards();
  const found = findEntities({ a: ENTITY("sensor.a", "findings"), m1: ENTITY("sensor.m1", "monitor"), m2: ENTITY("sensor.m2", "monitor"), x: ENTITY("sensor.x", "findings", "other") });
  assert.deepEqual(JSON.parse(JSON.stringify(found)), { byKey: { findings: ["sensor.a"], monitor: ["sensor.m1", "sensor.m2"] } });
  assert.deepEqual([[false, "hide", false], [true, "summary", false], [true, "hide", false], [true, "hide", true]].map(a => cardVisibility(...a)), ["show", "show", "hide", "placeholder"]);
});

test("a card says so when Housekeeper is missing, draws again only when a shown state changed, and links to the panel only for administrators", () => {
  const { HKCard, registerCard, registered, pushed, events, context } = loadCards();
  let quiet = false;
  class Demo extends HKCard {
    static tag = "hk-demo";
    static pickerName = "Demo";
    static pickerDescription = "A demo";
    isQuiet() { return quiet; }
    renderBody() { this.renders = (this.renders || 0) + 1; return this.head("x") + this.foot("y"); }
  }
  registerCard(Demo);
  assert.ok(registered["hk-demo"] && registered["hk-demo-editor"]);
  assert.ok(context.customCards.some(card => card.type === "hk-demo"));
  const card = new Demo();
  card.setConfig({ title: "Mein Haus" });
  const base = { language: "de", user: { is_admin: false }, entities: {}, states: {} };
  card.hass = base;
  assert.match(card.shadowRoot.innerHTML, /nicht gefunden/);
  const hass = { ...base, entities: { f: ENTITY("sensor.f", "findings") }, states: { "sensor.f": { last_updated: "1" } } };
  card.hass = hass;
  assert.match(card.shadowRoot.innerHTML, /Mein Haus/);
  card.hass = { ...hass };
  assert.equal(card.renders, 1, "the same states: no new drawing");
  card.hass = { ...hass, states: { "sensor.f": { last_updated: "2" } } };
  assert.equal(card.renders, 2);
  assert.ok(!card.shadowRoot.innerHTML.includes("data-hk-panel"), "a person who is no administrator gets no link to the panel");
  card.openPanel();
  assert.equal(pushed.length, 0);
  card.hass = { ...hass, user: { is_admin: true } };
  assert.ok(card.shadowRoot.innerHTML.includes("data-hk-panel"));
  card.openPanel();
  assert.equal(pushed[0][2], "/ha-housekeeper");
  assert.equal(events[0].type, "location-changed");
  quiet = true;
  card.setConfig({ quiet: "hide" });
  assert.equal(card.style.display, "none");
  assert.equal(card.shadowRoot.innerHTML, "");
  card.preview = true;
  card.update(true);
  assert.equal(card.style.display, "");
  assert.match(card.shadowRoot.innerHTML, /Editor/, "while editing the card stays and says why it would be hidden");
});

test("the editor offers the common options and every card language file keeps the keys and placeholders of English", () => {
  const { commonSchema, makeEditor, registerCard, HKCard, CARD_TEXT } = loadCards();
  assert.deepEqual([...commonSchema(key => key).map(field => field.name)], ["title", "quiet", "tap", "compact"]);
  class Demo extends HKCard { static tag = "hk-demo"; static editorSchema() { return [{ name: "rows", selector: { number: {} } }]; } }
  const editor = new (makeEditor(Demo))();
  editor.setConfig({});
  editor.hass = { language: "en" };
  assert.deepEqual([...editor._form.schema.map(field => field.name)], ["title", "quiet", "tap", "compact", "rows"], "the options of the card come after the common ones");
  assert.equal(editor._form.computeLabel({ name: "quiet" }), "When quiet");
  assert.equal(editor._form.computeHelper({ name: "title" }), "");
  const registry = JSON.parse(fs.readFileSync(new URL("../custom_components/ha_housekeeper/languages.json", import.meta.url), "utf8"));
  const holders = text => new Set(String(text).match(/\{\w+\}/g) || []);
  for (const { code } of registry.filter(l => l.code !== "de" && l.code !== "en")) {
    const texts = JSON.parse(fs.readFileSync(new URL(`i18n/cards/${code}.json`, FRONTEND), "utf8"));
    assert.deepEqual(Object.keys(texts).sort(), Object.keys(CARD_TEXT.en).sort(), `${code}: the same texts as English`);
    for (const [key, value] of Object.entries(texts)) {
      const english = JSON.stringify(CARD_TEXT.en[key]);
      for (const form of typeof value === "string" ? [value] : Object.values(value)) {
        assert.ok([...holders(form)].every(name => holders(english).has(name)), `${code}: ${key} names a placeholder English does not have`);
      }
      if (typeof value === "object") assert.ok(typeof value.other === "string", `${code}: ${key} has no other form`);
    }
  }
  assert.deepEqual(Object.keys(CARD_TEXT.de).sort(), Object.keys(CARD_TEXT.en).sort(), "German and English have the same texts");
});

test("the health card names what is wrong in the words of the panel, scans on a click, keeps quiet when all is well and never hides while the scan fails", () => {
  const { HKHealthCard, registered } = loadCards();
  assert.ok(registered["ha-housekeeper-health-card"], "the card is registered");
  const calls = [];
  const entities = { h: ENTITY("sensor.house", "house_health"), s: ENTITY("sensor.scan", "scan_health"), a: ENTITY("sensor.act", "activity"), l: ENTITY("sensor.last", "last_scan"), b: ENTITY("button.scan", "scan") };
  const topics = { down: { objects: 2, level: "high" }, broken_references: { objects: 1, level: "medium" }, failing_automations: { objects: 0, level: "none" }, unneeded: { objects: 0, level: "none" } };
  const states = (house, extra = {}) => ({
    "sensor.house": { state: "attention", last_updated: "1", attributes: { objects: 3, topics, new: 2, resolved: 1, ...house } },
    "sensor.scan": { state: "ok", last_updated: "1" },
    "sensor.act": { state: "idle", last_updated: "1" },
    "sensor.last": { state: new Date(Date.now() - 12 * 60000).toISOString(), last_updated: "1" },
    ...extra,
  });
  const hass = (st, admin = true) => ({ language: "de", user: { is_admin: admin }, entities, states: st, callService: (...args) => calls.push(args) });
  const card = new HKHealthCard();
  card.setConfig({});
  card.hass = hass(states());
  const html = () => card.shadowRoot.innerHTML;
  assert.match(html(), /3 Objekte brauchen Aufmerksamkeit/);
  assert.match(html(), /Kaputte Verweise/, "the wording of the panel");
  assert.match(html(), /hk-tile bad go" data-hk-panel="view=findingsNav&amp;filter=topic:down"/, "a topic with findings opens its list in the panel");
  assert.match(html(), /\+2 neu[\s\S]*−1 behoben/);
  card.act("scan");
  assert.equal(JSON.stringify(calls[0]), JSON.stringify(["button", "press", { entity_id: "button.scan" }]));
  card.hass = hass(states({}, { "sensor.act": { state: "scanning", last_updated: "2" } }));
  card.act("scan");
  assert.equal(calls.length, 1, "no second scan while one runs");
  assert.match(html(), /disabled/);
  card.hass = hass(states(), false);
  assert.ok(!html().includes("data-hk-panel") && !html().includes("data-hk-act"), "a person who is no administrator sees the numbers, no link and no scan button");

  const calm = { state: "ok", attributes: { objects: 0, topics: Object.fromEntries(Object.keys(topics).map(name => [name, { objects: 0, level: "none" }])), new: 0, resolved: 0 } };
  card.setConfig({ quiet: "hide" });
  card.hass = hass(states({}, { "sensor.house": { ...calm, last_updated: "3" } }));
  assert.equal(card.style.display, "none", "quiet and asked to hide");
  card.setConfig({});
  card.update(true);
  assert.match(html(), /Alles in Ordnung/);
  assert.ok(!html().includes('class="hk-tiles"'), "no tiles while there is nothing to list");
  assert.match(html(), /Keine offenen Befunde/);
  card.setConfig({ quiet: "hide" });
  card.hass = hass(states({}, { "sensor.house": { ...calm, last_updated: "4" }, "sensor.scan": { state: "failed", last_updated: "4" } }));
  assert.notEqual(card.style.display, "none", "a card that cannot trust its numbers stays");
  assert.match(html(), /Der Scan läuft nicht durch/);
});

test("the battery card sorts out the weakest, the round by area and the shopping list, and says when the forecast follows", () => {
  const { HKBatteryCard, registered } = loadCards();
  assert.ok(registered["ha-housekeeper-battery-card"], "the card is registered");
  const entities = { w: ENTITY("sensor.weak", "battery_weakest"), n: ENTITY("sensor.next", "battery_next_change") };
  const smoke = { name: "Rauchmelder Flur", area: "Flur", type: "9 V", percent: 8, low: true, days_left: 0, quality: "low" };
  const door = { name: "Türsensor Keller", area: "Keller", type: "CR2032", percent: 44, low: false, days_left: 12, quality: "estimate" };
  const office = { name: "Fensterkontakt Büro", area: "Büro", type: "CR2032", percent: 52, low: false, days_left: null, quality: "stable" };
  const garage = { name: "Garage", area: "", type: "", percent: 60, low: false, days_left: null, quality: "pending" };
  const attrs = { weakest: [smoke, door, office, garage], round: [smoke, door], round_days: 14, total: 31, low: 1, shopping: [{ type: "9 V", count: 1, names: ["Rauchmelder Flur"] }, { type: "CR2032", count: 2, names: ["Türsensor Keller", "Fensterkontakt Keller"] }], unknown_type: ["Garage"] };
  let stamp = 0;
  const hass = (a, next = "") => ({ language: "de", user: { is_admin: true }, entities, states: { "sensor.weak": { state: "8", last_updated: String(++stamp), attributes: a }, "sensor.next": { state: next, last_updated: String(stamp) } } });
  const card = new HKBatteryCard();
  card.setConfig({ view: "both" });
  card.hass = hass(attrs);
  const html = () => card.shadowRoot.innerHTML;
  assert.match(html(), /Rauchmelder Flur[\s\S]*Türsensor Keller/);
  assert.match(html(), /Wechsel fällig/);
  assert.match(html(), /ca\. 12 Tage/);
  assert.match(html(), /Schätzung/);
  assert.match(html(), /kaum Verbrauch[\s\S]*stabil/);
  assert.match(html(), /Prognose folgt/, "a battery without a forecast yet says so");
  assert.match(html(), /1 schwach/);
  assert.match(html(), /Wechselrunde[\s\S]*Flur[\s\S]*Keller/, "the round names the areas, the nearest first");
  assert.match(html(), /2 ×<\/span><span class="w"><b>CR2032/);
  assert.match(html(), /Typ unbekannt[\s\S]*Garage/);
  card.setConfig({ view: "weakest", rows: 3, forecast: false });
  assert.ok(!/Schätzung|Prognose folgt/.test(html()) && !html().includes("Wechselrunde</div>"), "only what was asked for");
  assert.equal((html().match(/class="hk-row r3"/g) || []).length, 3);
  const calm = { weakest: [office], round: [], round_days: 14, total: 31, low: 0, shopping: [], unknown_type: [], lowest: 52 };
  card.setConfig({ view: "both" });
  card.hass = hass({ ...calm, lowest: 52 }, new Date(Date.now() + 120 * 86400000).toISOString());
  assert.match(html(), /31 überwacht[\s\S]*Alles gut[\s\S]*Keine Batterie unter dem Grenzwert[\s\S]*Nächster Wechsel voraussichtlich im/);
  assert.ok(!html().includes("Fensterkontakt Büro"), "when quiet the card shows only the summary");
});

test("the home functions card puts the troubled functions first, says why in words and draws the days as a strip", () => {
  const { HKFunctionsCard, registered } = loadCards();
  assert.ok(registered["ha-housekeeper-functions-card"], "the card is registered");
  const entities = { a: ENTITY("sensor.heat", "monitor"), b: ENTITY("sensor.pv", "monitor"), e: ENTITY("event.functions", "monitor"), n: ENTITY("sensor.other", "findings") };
  const days = ["ok", "ok", "problem", "flapping", "unverified", "", "ok"];
  const fn = (state, extra) => ({ state, last_updated: "1", attributes: { function_id: extra.id, function_name: extra.name, members_total: extra.total, members_ok: extra.ok, history_30d: days, availability_30d: extra.avail, reason: extra.reason, problem_object: extra.object } });
  const states = {
    "sensor.heat": fn("ok", { id: "f1", name: "Heizung", total: 6, ok: 6, avail: 100 }),
    "sensor.pv": fn("problem", { id: "f2", name: "Photovoltaik", total: 3, ok: 2, avail: 83.5, reason: "rule_stale", object: "Wechselrichter 2" }),
    "event.functions": { state: "x", last_updated: "1", attributes: {} },
  };
  const hass = (st, admin = true) => ({ language: "de", user: { is_admin: admin }, entities, states: st });
  const card = new HKFunctionsCard();
  card.setConfig({});
  card.hass = hass(states);
  const html = () => card.shadowRoot.innerHTML;
  assert.match(html(), /Photovoltaik[\s\S]*Heizung/, "the troubled function comes first");
  assert.match(html(), /Wechselrichter 2 meldet nichts mehr/);
  assert.match(html(), /6 von 6 Objekten erreichbar/);
  assert.match(html(), /1 gestört/);
  assert.match(html(), /83,5 %/);
  assert.equal((html().match(/<i class="/g) || []).length, 14, "a strip of seven days for each of the two functions");
  assert.match(html(), /<i class="problem">/);
  assert.match(html(), /data-hk-panel="view=monitor&amp;function=f2"/, "a click opens the function in the panel");
  card.setConfig({ history: "0", entities: ["sensor.heat"] });
  assert.ok(!html().includes("Photovoltaik") && !html().includes("hk-strip\""), "the chosen function only, and no strip");
  card.hass = hass(states, false);
  assert.ok(!html().includes("data-hk-panel"), "a person who is no administrator sees no link");
  const calm = { ...states, "sensor.pv": fn("ok", { id: "f2", name: "Photovoltaik", total: 3, ok: 3, avail: 100 }) };
  card.setConfig({ quiet: "hide" });
  card.hass = hass({ ...calm, "sensor.heat": { ...calm["sensor.heat"], last_updated: "2" } });
  assert.equal(card.style.display, "none", "every function is fine and the card was asked to hide");
  card.setConfig({});
  card.hass = hass({});
  assert.match(html(), /Noch keine Hausfunktion/);
});

test("the auto-pause card names who is paused and when the next try is, and its menu acts only for administrators through the command of the panel", async () => {
  const { HKAutoPauseCard, registered } = loadCards();
  assert.ok(registered["ha-housekeeper-auto-pause-card"], "the card is registered");
  const entities = { p: ENTITY("sensor.paused", "auto_pause") };
  const at = minutes => new Date(Date.now() + minutes * 60000).toISOString();
  const waiting = { entry_id: "e1", title: "Wetterdienst Alpen", reason: "auto", failures: 25, attempts_done: 2, attempts_total: 21, step_hours: 1, next: at(54), since: at(-120), trying: false, exhausted: false };
  const given = { entry_id: "e2", title: "Heizungsregler", reason: "manual", failures: null, attempts_done: 21, attempts_total: 21, step_hours: 12, next: null, since: at(-9000), trying: false, exhausted: true };
  let stamp = 0;
  const calls = [];
  const hass = (attrs, admin = true, fail = false) => ({ language: "de", user: { is_admin: admin }, entities, states: { "sensor.paused": { state: String(attrs.paused.length), last_updated: String(++stamp), attributes: attrs } }, callWS: async msg => { calls.push(msg); if (fail) throw new Error("boom"); } });
  const card = new HKAutoPauseCard();
  card.setConfig({});
  card.hass = hass({ enabled: true, max_days: 7, paused: [waiting, given] });
  const html = () => card.shadowRoot.innerHTML;
  assert.match(html(), /Wetterdienst Alpen[\s\S]*25 Fehlversuche · pausiert vor 2 Stunden/);
  assert.match(html(), /Nächster Versuch in 54 Minuten/);
  assert.match(html(), /Versuch 2 von 21 · alle 1 Std\./);
  assert.match(html(), /Aufgegeben: nach 7 Tagen nicht wieder eingerichtet/);
  assert.match(html(), /von dir pausiert/);
  assert.match(html(), /2 pausiert/);
  assert.match(html(), /Die Pause endet spätestens nach 7 Tagen/);
  assert.ok(!html().includes("hk-menu\" style"), "no menu until the button is pressed");
  card.act("menu:e1", { currentTarget: { getBoundingClientRect: () => ({ bottom: 100, right: 300 }) } });
  assert.match(html(), /class="hk-menu" style="top:104px;right:/);
  assert.match(html(), /Jetzt versuchen[\s\S]*Pause beenden[\s\S]*Nie pausieren/);
  card.act("try:e1");
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(JSON.stringify(calls[0]), JSON.stringify({ type: "ha_housekeeper/auto_pause_set", action: "try", entry_id: "e1" }));
  assert.equal(card.fired.at(-1).detail.message, "Neuer Versuch gestartet");
  assert.ok(!html().includes('class="hk-menu"'), "the menu closes after an action");
  card.act("never:e2");
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(calls[1].on, true, "never pause switches the exclusion on");
  card.hass = hass({ enabled: true, max_days: 7, paused: [waiting] }, true, true);
  card.act("resume:e1");
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(card.fired.at(-1).detail.message, "Das hat nicht geklappt: boom");
  card.hass = hass({ enabled: true, max_days: 7, paused: [waiting] }, false);
  assert.ok(!html().includes("hk-kebab\"") && !html().includes("data-hk-act"), "a person who is no administrator sees the list without a menu");
  const before = calls.length;
  card.act("try:e1");
  assert.equal(calls.length, before, "and cannot act");
  card.setConfig({ quiet: "hide" });
  card.hass = hass({ enabled: true, max_days: 7, paused: [] });
  assert.equal(card.style.display, "none", "auto-pause is on and nothing is paused");
  card.setConfig({});
  card.hass = hass({ enabled: false, max_days: 7, paused: [] });
  assert.match(html(), /Auto-Pause ist aus[\s\S]*Im Panel einschalten/);
});

test("the card after the update appears for a while, names what is worse since the update and keeps quiet when nothing is", () => {
  const { HKUpdateCard, registered } = loadCards();
  assert.ok(registered["ha-housekeeper-update-card"], "the card is registered");
  const entities = { u: ENTITY("sensor.update", "update_watch") };
  const at = minutes => new Date(Date.now() + minutes * 60000).toISOString();
  let stamp = 0;
  const hass = (state, attrs, admin = true) => ({ language: "de", user: { is_admin: admin }, entities, states: { "sensor.update": { state, last_updated: String(++stamp), attributes: attrs } } });
  const base = { started_at: at(-25), until: at(600), open: true, samples: 1, triggers: [{ kind: "ha_version", to: "2026.11.1" }], problems: [], problems_total: 0, new_findings: 0, new_repairs: 0, transient: 0, start_seconds: 192, start_usual_seconds: 160 };
  const worse = { ...base, problems: [{ name: "Hue", type: "config_entry", status: "problem" }, { name: "Licht Flur Abend", type: "automation", status: "unavailable" }], problems_total: 3, new_findings: 1 };
  const card = new HKUpdateCard();
  card.setConfig({});
  card.hass = hass("worse", worse);
  const html = () => card.shadowRoot.innerHTML;
  assert.match(html(), /Seit dem Update läuft etwas nicht mehr/);
  assert.match(html(), /Home Assistant 2026\.11\.1 · vor 25 Minuten/);
  assert.match(html(), /4 Dinge/, "the objects and the new findings together");
  assert.match(html(), /Hue[\s\S]*Integration[\s\S]*Problem[\s\S]*Licht Flur Abend[\s\S]*Automation[\s\S]*Nicht erreichbar/);
  assert.match(html(), /und 1 weitere[\s\S]*1 neuer Befund/);
  assert.match(html(), /Start dauerte 3 min 12 s \(sonst 2 min 40 s\)/);
  assert.match(html(), /class="hk-alert"/);
  assert.match(html(), /data-hk-panel="view=findingsNav"/);
  card.setConfig({ start: false });
  assert.ok(!html().includes("Start dauerte"), "the start time can be left out");

  card.setConfig({ show_hours: "6" });
  card.hass = hass("worse", { ...worse, started_at: at(-7 * 60) });
  assert.equal(card.style.display, "none", "seven hours after the update the card has gone");
  card.setConfig({ show_hours: "24" });
  assert.notEqual(card.style.display, "none");
  card.hass = hass("none", {});
  assert.equal(card.style.display, "none", "without a watched update it does not show");
  card.preview = true;
  card.update(true);
  assert.match(html(), /erscheint nur kurz nach einem Update[\s\S]*Es wurde noch kein Update beobachtet/, "the editor still shows it");
  card.preview = false;

  card.setConfig({});
  card.hass = hass("stable", base);
  assert.match(html(), /Update ohne Auffälligkeiten[\s\S]*Alles läuft[\s\S]*Nichts läuft schlechter/);
  card.setConfig({ quiet: "hide" });
  assert.equal(card.style.display, "none", "nothing is worse and the card was asked to hide");
  card.setConfig({});
  card.hass = hass("pending", { ...base, samples: 0, next_check: at(20) });
  assert.match(html(), /Housekeeper prüft nach dem Update[\s\S]*Die erste Prüfung kommt in 20 Minuten/);
  card.hass = hass("unknown", {});
  assert.equal(card.style.display, "none", "unknown without attributes is Home Assistant's own, not a verdict: nothing to show");
});
