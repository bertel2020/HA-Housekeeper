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
  vm.runInNewContext(fs.readFileSync(new URL("ha-housekeeper-cards.js", FRONTEND), "utf8") + "\nthis.X = { findEntities, cardVisibility, commonSchema, makeEditor, registerCard, HKCard, HKHealthCard, CARD_TEXT };", context);
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
