// Run with: node --test tests/panel.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

import { buildPanel } from "../scripts/build_panel.mjs";
import { makeLoadFixture } from "../scripts/make_load_fixture.mjs";

const SOURCE = new URL("../custom_components/ha_housekeeper/frontend/ha-housekeeper-panel.js", import.meta.url);

function loadPanel(extra = {}) {
  const downloads = [];
  let PanelClass;
  const shadow = { innerHTML: "", querySelectorAll: () => [], querySelector: () => null };
  class FakeElement {
    attachShadow() { this.shadowRoot = shadow; return shadow; }
  }
  const context = {
    HTMLElement: FakeElement,
    customElements: { get: () => undefined, define: (_, cls) => { PanelClass = cls; } },
    Blob: class { constructor(parts) { this.text = parts.join(""); } },
    URL: { createObjectURL: blob => { downloads.push(blob); return "blob:x"; }, revokeObjectURL() {} },
    document: { createElement: () => ({ click() {}, remove() {} }), body: { appendChild() {} } },
    URLSearchParams,
    Intl, Map, Set, JSON, String, Number, Array, Object, Math, Date, setTimeout: () => 0,
    ...extra,
  };
  vm.runInNewContext(fs.readFileSync(SOURCE, "utf8") + "\nthis.TEXT = TEXT; this.NAV = NAV; this.NAV_GROUPS = NAV_GROUPS; this.OPTION_FIELDS = OPTION_FIELDS;", context);
  return { PanelClass, downloads, TEXT: context.TEXT, NAV: context.NAV, NAV_GROUPS: context.NAV_GROUPS, OPTION_FIELDS: context.OPTION_FIELDS, shadow };
}

const DATA = {
  meta: { scanned_at: "2026-10-07T10:00:00+00:00", object_count: 3, status_counts: { active: 2, orphaned: 1 }, type_counts: { entity: 3 } },
  objects: [
    { object_type: "entity", object_id: "sensor.a", name: "<img src=x onerror=alert(1)>", status: "orphaned", reason: "state_missing", platform: "test" },
    { object_type: "entity", object_id: "sensor.b", name: "B", status: "active", reason: "state_available" },
    { object_type: "automation", object_id: "automation.c", name: "C", status: "active", automation_id: "123" },
  ],
  edges: [],
  findings: [
    { rule_id: "entity.state_missing", object_id: "sensor.a", classification: "orphaned", confidence: 0.75, first_detected_at: "2026-10-01T00:00:00+00:00", evidence: [{ kind: "state_missing" }] },
    { rule_id: "automation.missing_entity", object_id: "automation.c", classification: "orphaned", confidence: 0.98, affected_object: "=HYPERLINK(\"x\")", evidence: [{ location: "actions[0]" }] },
  ],
};

function panel(lang = "en", extra = {}) {
  const env = loadPanel(extra);
  const el = new env.PanelClass();
  el._hass = { language: lang };
  el.data = DATA;
  return { el, ...env };
}

test("German and English texts define the same keys", () => {
  const { TEXT } = loadPanel();
  assert.deepEqual(Object.keys(TEXT.de).sort(), Object.keys(TEXT.en).sort());
});

test("every view renders without throwing and escapes object names", () => {
  const { el, shadow } = panel("de");
  for (const view of ["overview", "inventory", "findingsNav", "graph"]) {
    el.view = view;
    el.render();
    assert.ok(shadow.innerHTML.length > 100, view);
    assert.ok(!shadow.innerHTML.includes("<img src=x"), `${view} leaks unescaped name`);
  }
});

test("detail page renders for an orphaned entity and escapes the name", () => {
  const { el, shadow } = panel();
  el.selected = DATA.objects[0];
  el.render();
  assert.ok(shadow.innerHTML.includes("&lt;img src=x"));
  assert.ok(!shadow.innerHTML.includes("<img src=x"));
  assert.ok(shadow.innerHTML.includes('data-action="back"'));
});

test("navigation keeps a trail and goes back", () => {
  const { el } = panel();
  el.selected = DATA.objects[0];
  el.trail = [];
  el.openObject(DATA.objects[1]);
  assert.equal(el.trail.length, 1);
  el.goBack();
  assert.equal(el.selected, DATA.objects[0]);
  el.goBack();
  assert.equal(el.selected, null);
});

function diagnoseWith(extra, entityOverrides) {
  const { el } = panel();
  el.data = { ...DATA, objects: [...DATA.objects, ...extra] };
  const entity = { object_type: "entity", object_id: "light.x", name: "X", status: "unavailable", reason: "state_unavailable",
    state: "unavailable", config_entry_id: "e1", device_id: "d1", ...entityOverrides };
  return el.diagnose(entity);
}
const ENTRY = { object_type: "config_entry", object_id: "e1", name: "Hue", status: "active", state: "loaded" };
const DEVICE = { object_type: "device", object_id: "d1", name: "Lampe", status: "active" };

test("unavailable with healthy integration and device blames reachability", () => {
  const d = diagnoseWith([ENTRY, DEVICE], {});
  assert.deepEqual(Array.from(d.rows.map(r => r.tone)), ["ok", "ok", "red"]);
  assert.ok(d.cause.includes("nicht erreichbar") || d.cause.includes("unreachable"));
  assert.ok(d.hint);
});

test("unavailable with a failed integration blames the integration", () => {
  const d = diagnoseWith([{ ...ENTRY, state: "setup_error", status: "problem" }, DEVICE], {});
  assert.equal(d.rows[0].tone, "red");
  assert.ok(d.cause.includes("unavailable") || d.cause.includes("not loaded") || d.cause.includes("nicht geladen"));
  assert.ok(!d.cause.includes("nicht erreichbar"));
});

test("missing device and disabled entity are explained without alarm", () => {
  assert.equal(diagnoseWith([ENTRY], { reason: "device_missing", status: "orphaned", state: null }).rows[1].tone, "red");
  const off = diagnoseWith([ENTRY, DEVICE], { reason: "entity_disabled", status: "disabled", state: null, disabled_by: "user" });
  assert.ok(off.rows.every(r => r.tone !== "red"));
});

test("automation diagnosis lists missing references", () => {
  const { el } = panel();
  const d = el.diagnose(DATA.objects[2]);
  assert.equal(d.tone, "red");
  assert.equal(d.rows[0].tone, "red");
  assert.ok(d.rows[0].value.includes("actions[0]"));
});

test("haPath builds Home Assistant paths", () => {
  const { el } = panel();
  assert.equal(el.haPath({ object_type: "entity", object_id: "sensor.a b" }), "/config/entities?search=sensor.a%20b");
  assert.equal(el.haPath({ object_type: "automation", object_id: "automation.c", automation_id: "123" }), "/config/automation/edit/123");
  assert.equal(el.haPath({ object_type: "automation", object_id: "automation.c" }), "/config/entities?search=automation.c");
  assert.equal(el.haPath({ object_type: "device", object_id: "d1" }), "/config/devices/device/d1");
  assert.equal(el.haPath({ object_type: "config_entry", domain: "hue" }), "/config/integrations/integration/hue");
  assert.equal(el.haPath({ object_type: "unknown" }), null);
});

test("filtered applies query, type and status", () => {
  const { el } = panel();
  el.query = "sensor.b";
  assert.equal(JSON.stringify(el.filtered().map(o => o.object_id)), JSON.stringify(["sensor.b"]));
  el.query = "";
  el.typeFilter = "automation";
  assert.deepEqual(el.filtered().map(o => o.object_id), ["automation.c"]);
  el.typeFilter = "";
  el.statusFilter = "orphaned";
  assert.deepEqual(el.filtered().map(o => o.object_id), ["sensor.a"]);
});

test("findings are sorted by confidence", () => {
  const { el } = panel();
  assert.deepEqual(Array.from(el.sortedFindings().map(f => f.object_id)), ["automation.c", "sensor.a"]);
});

test("CSV export neutralises formulas and respects the filter", () => {
  const { el, downloads } = panel();
  el.exportFindings("csv");
  const csv = downloads[0].text;
  assert.ok(csv.startsWith("﻿"));
  assert.ok(csv.includes(`"'=HYPERLINK(""x"")"`), csv);
  assert.equal(csv.split("\r\n").length, 3);

  el.findingFilter = "nothing";
  el.exportFindings("csv");
  assert.equal(downloads[1].text.split("\r\n").length, 1);
});

test("JSON export carries scan time and rows", () => {
  const { el, downloads } = panel();
  el.exportFindings("json");
  const parsed = JSON.parse(downloads[0].text);
  assert.equal(parsed.scanned_at, DATA.meta.scanned_at);
  assert.equal(parsed.findings.length, 2);
  assert.equal(parsed.findings[0].rule_id, "automation.missing_entity");
});

function impactWith(edges, item, key) {
  const { el } = panel();
  el.data = { ...DATA, edges };
  return el.impact(item, key);
}
const E = (source, target, relation, confidence = "certain", location = "actions[0]") => ({ source, target, relation, confidence, location });

test("impact is safe when no automation uses the object", () => {
  const m = impactWith([], DATA.objects[1], "entity:sensor.b");
  assert.equal(m.tone, "ok");
  assert.equal(m.hits.length, 0);
});

test("impact flags certain references and ranks them first", () => {
  const edges = [
    E("automation:automation.p", "entity:sensor.b", "REFERENCES", "probable", "runtime_extraction"),
    E("automation:automation.c", "entity:sensor.b", "TRIGGERS_ON"),
  ];
  const m = impactWith(edges, DATA.objects[1], "entity:sensor.b");
  assert.equal(m.tone, "red");
  assert.equal(m.certain, 1);
  assert.equal(m.hits[0].key, "automation:automation.c");
});

test("impact of a device includes its entities, probable-only is a warning", () => {
  const edges = [
    E("device:d1", "entity:sensor.b", "PROVIDES"),
    E("automation:automation.c", "entity:sensor.b", "REFERENCES", "probable", "runtime_extraction"),
  ];
  const m = impactWith(edges, { object_type: "device", object_id: "d1" }, "device:d1");
  assert.equal(m.related, 1);
  assert.equal(m.tone, "warn");
  assert.equal(m.probable, 1);
});

test("impact card is skipped for automations and shows the verdict", () => {
  const { el } = panel();
  assert.equal(el.impactCard(DATA.objects[2], "automation:automation.c"), "");
  assert.ok(el.impactCard(DATA.objects[1], "entity:sensor.b").includes("No known usage"));
});

test("scripts and scenes get paths, diagnosis, finding keys and impact sources", () => {
  const { el } = panel();
  assert.equal(el.haPath({ object_type: "script", object_id: "script.tidy" }), "/config/script/edit/tidy");
  assert.equal(el.haPath({ object_type: "scene", object_id: "scene.a", scene_id: "42" }), "/config/scene/edit/42");
  assert.equal(el.haPath({ object_type: "scene", object_id: "scene.a" }), "/config/entities?search=scene.a");
  assert.equal(el.findingKey({ rule_id: "script.missing_entity", object_id: "script.tidy" }), "script:script.tidy");

  const script = { object_type: "script", object_id: "script.tidy", name: "Tidy", status: "active" };
  el.data = { ...DATA, objects: [...DATA.objects, script], findings: [
    { rule_id: "script.missing_entity", object_id: "script.tidy", classification: "broken_reference", confidence: 0.98, affected_object: "light.gone", evidence: [{ location: "sequence/1/target/entity_id" }] },
  ] };
  const d = el.diagnose(script);
  assert.equal(d.tone, "red");
  assert.ok(d.rows[0].value.includes("light.gone"));

  el.data.edges = [E("script:script.tidy", "entity:sensor.b", "TARGETS"), E("scene:scene.a", "entity:sensor.b", "TARGETS")];
  const m = el.impact(DATA.objects[1], "entity:sensor.b");
  assert.equal(m.certain, 2);
  assert.equal(el.impact(script, "script:script.tidy"), null);
  el.selected = script;
  el.render();
});

test("dashboards get paths, diagnosis and count as usage in impact", () => {
  const { el } = panel();
  assert.equal(el.haPath({ object_type: "dashboard", object_id: "dash-living", url_path: "dash-living" }), "/dash-living");
  assert.equal(el.haPath({ object_type: "dashboard", object_id: "lovelace", url_path: null }), "/lovelace");
  el.data = { ...DATA, edges: [E("dashboard:dash-living", "entity:sensor.b", "SHOWS")] };
  const m = el.impact(DATA.objects[1], "entity:sensor.b");
  assert.equal(m.certain, 1);
  assert.equal(el.impact({ object_type: "dashboard", object_id: "x" }, "dashboard:x"), null);
  assert.ok(el.t("SHOWS") !== "SHOWS");
});

const COMPARE = {
  available: true, baseline: "previous", baselines: [{ id: "previous", at: "2026-10-06T10:00:00+00:00" }, { id: "2026-10-05T20:00:00+00:00", at: "2026-10-05T20:00:00+00:00" }],
  baseline_at: "2026-10-06T10:00:00+00:00", scanned_at: "2026-10-07T10:00:00+00:00",
  status_changes: { total: 2, items: [
    { object_type: "entity", object_id: "sensor.b", name: "B", from: "unavailable", to: "active" },
    { object_type: "entity", object_id: "sensor.a", name: "<b>A</b>", from: "active", to: "unavailable" },
  ] },
  new_findings: { total: 1, items: [DATA.findings[0]] },
  resolved_findings: { total: 1, items: [{ rule_id: "entity.state_missing", object_id: "sensor.gone", affected_object: null }] },
  new_objects: { total: 0, items: [] },
  removed_objects: { total: 1, items: [{ object_type: "entity", object_id: "sensor.gone" }] },
};

test("changes view lists worsened changes first and escapes names", () => {
  const { el, shadow } = panel("de");
  el.view = "changes";
  el.compare = COMPARE;
  el.render();
  const html = shadow.innerHTML;
  assert.ok(html.includes("&lt;b&gt;A&lt;/b&gt;") && !html.includes("<b>A</b>"));
  assert.ok(html.indexOf("&lt;b&gt;A") < html.indexOf(">B<"), "worsened change must come first");
  assert.ok(html.includes('id="baseline"'));
  assert.ok(html.includes("Neue Befunde") && html.includes("Entfernte Objekte"));
});

test("loadCompare asks the backend with the selected baseline", async () => {
  const { el } = panel();
  const calls = [];
  el._hass.callWS = async msg => { calls.push(msg); return COMPARE; };
  el.view = "changes"; // the overview would fetch its own comparison
  el.compareBaseline = "2026-10-05T20:00:00+00:00";
  await el.loadCompare();
  assert.equal(JSON.stringify(calls), JSON.stringify([{ type: "ha_housekeeper/compare", baseline: "2026-10-05T20:00:00+00:00" }]));
  assert.equal(el.compare, COMPARE);
});

test("the status counts affected objects once, only of the base types, and not hidden findings", () => {
  const { el } = panel("en");
  const entity = id => ({ object_type: "entity", object_id: id, name: id, status: "orphaned" });
  const objects = [...Array.from({ length: 8 }, (_, i) => entity(`sensor.s${i}`)), { object_type: "dashboard", object_id: "dash", name: "d", status: "active" }];
  const finding = (rule, id, extra = {}) => ({ rule_id: rule, object_id: id, classification: "orphaned", confidence: 0.9, evidence: [], ...extra });
  const base = { ...DATA, objects };
  el.data = { ...base, findings: [finding("entity.state_missing", "sensor.s0"), finding("entity.duplicate", "sensor.s0"), finding("entity.unavailable", "sensor.s0")] };
  assert.deepEqual([el.health().affected, el.health().base, el.health().percent], [1, 8, 88]); // one object, three findings
  el.data = { ...base, findings: [finding("entity.state_missing", "sensor.s0"), finding("entity.state_missing", "sensor.s1", { ignored: true })] };
  assert.equal(el.health().affected, 1); // hidden findings do not count
  el.data = { ...base, findings: [finding("dashboard.missing_entity", "dash")] };
  assert.equal(el.health().affected, 0); // other object types are listed but not part of the ring
  el.data = { ...DATA, objects: [], findings: [finding("entity.state_missing", "sensor.s0")] };
  assert.equal(el.health().percent, 100); // empty base
  assert.ok(el.t("healthTip", { affected: 2, base: 8 }).includes("2") && el.t("healthHint").includes("scripts and scenes"));
});

test("hidden findings are excluded from counts, lists and export unless shown", () => {
  const { el, downloads } = panel("en");
  const findings = [{ ...DATA.findings[0], key: "k1", ignored: true, ignored_by: "user" }, { ...DATA.findings[1], key: "k2", ignored: false }];
  el.data = { ...DATA, findings };
  assert.equal(el.sortedFindings().length, 1);
  assert.equal(el.sortedFindings(true).length, 2);
  assert.equal(el.health().percent, 67);
  el.exportFindings("json");
  assert.equal(JSON.parse(downloads[0].text).findings.length, 1);
  el.showIgnored = true;
  el.exportFindings("json");
  assert.equal(JSON.parse(downloads[1].text).findings.length, 2);
  el.view = "findingsNav";
  el.render();
  assert.ok(el.shadowRoot.innerHTML.includes("Show hidden (1)"));
});

test("detail page offers to hide and show findings, but not label-hidden ones", () => {
  const { el } = panel("en");
  el.data = { ...DATA, findings: [
    { ...DATA.findings[0], key: "k1", ignored: false },
    { rule_id: "entity.state_unavailable", object_id: "sensor.a", classification: "unavailable", confidence: 0.75, key: "k3", ignored: true, ignored_by: "label" },
  ] };
  const html = el.findingsCard("entity:sensor.a");
  assert.ok(html.includes('data-ignore="k1" data-ignore-value="1"'));
  assert.ok(!html.includes('data-ignore="k3"'));
  assert.ok(html.includes("housekeeper_ignore"));
});

test("battery view lists the lowest levels first and counts low ones", () => {
  const { el, shadow } = panel("en");
  const battery = (id, state, extra = {}) => ({ object_type: "entity", object_id: id, name: id, status: "active", device_class: "battery", state, unit: "%", ...extra });
  el.data = { ...DATA, meta: { ...DATA.meta, low_battery_percent: 20 }, objects: [
    battery("sensor.full", "95"), battery("sensor.low", "8"), battery("sensor.edge", "20"),
    battery("binary_sensor.flag", "on"), battery("binary_sensor.fine", "off"), battery("sensor.nan", "unknown"),
    battery("sensor.gone", "3", { status: "unavailable" }), { ...battery("sensor.temp", "1"), device_class: "temperature" },
  ] };
  assert.equal(el.lowBatteries().length, 3);
  assert.equal(JSON.stringify(Array.from(el.batteryRows().map(r => r.item.object_id))), JSON.stringify(["binary_sensor.flag", "sensor.low", "sensor.edge", "binary_sensor.fine", "sensor.full"]));
  el.view = "batteries";
  el.render();
  assert.ok(shadow.innerHTML.includes("sumvalue\">3<") && shadow.innerHTML.includes("sumvalue\">5<"));
  assert.ok(!shadow.innerHTML.includes("sensor.full"));
  el.batteryFilter = "all";
  el.render();
  assert.ok(shadow.innerHTML.includes("sensor.full"));
});

test("deep links select view, filter and object once", () => {
  const replaced = [];
  const window = { location: { search: "?view=findingsNav&filter=orphaned", pathname: "/ha-housekeeper" }, history: { replaceState: (_s, _t, url) => replaced.push(url) } };
  const { el } = panel("en", { window });
  el.isConnected = true;
  el._basePath = "/ha-housekeeper";
  el.applyUrl();
  assert.equal(el.view, "findingsNav");
  assert.equal(el.findingFilter, "orphaned");
  el.view = "overview";
  el.applyUrl();
  assert.equal(el.view, "overview", "applied only once");

  window.location.search = "?object=entity:sensor.b";
  const second = panel("en", { window });
  second.el.applyUrl();
  assert.equal(second.el.selected, DATA.objects[1]);

  el.view = "inventory";
  el.render();
  assert.equal(replaced.at(-1), "/ha-housekeeper?view=inventory");
  el.view = "overview";
  el.render();
  assert.equal(replaced.at(-1), "/ha-housekeeper");
  el._basePath = "/somewhere-else";
  const before = replaced.length;
  el.render();
  assert.equal(replaced.length, before, "never rewrites another page's URL");
});

test("unreferenced view lists active entities no source uses", () => {
  const { el, shadow } = panel("en");
  const ent = (id, extra = {}) => ({ object_type: "entity", object_id: id, name: id, status: "active", ...extra });
  el.data = { ...DATA, objects: [
    ent("light.used"), ent("light.lonely"), ent("sensor.lonely_sensor"), ent("sensor.diag", { entity_category: "diagnostic" }),
    ent("sensor.gone", { status: "unavailable" }), ent("automation.a"), ent("switch.in_group"),
  ], edges: [
    { source: "automation:automation.a", target: "entity:light.used", relation: "TARGETS" },
    { source: "entity:group.all", target: "entity:switch.in_group", relation: "INCLUDES" },
    { source: "device:d", target: "entity:sensor.lonely_sensor", relation: "PROVIDES" },
  ] };
  assert.equal(JSON.stringify(Array.from(el.unreferencedRows().map(o => o.object_id))), JSON.stringify(["light.lonely", "sensor.lonely_sensor"]));
  el.view = "unreferenced";
  el.render();
  assert.ok(shadow.innerHTML.includes("light.lonely") && !shadow.innerHTML.includes("light.used"));
  assert.ok(shadow.innerHTML.includes("hint only"));
  el.lv.unreferenced.f.domain = "light";
  el.render();
  assert.ok(shadow.innerHTML.includes("light.lonely") && !shadow.innerHTML.includes("sensor.lonely_sensor"));
});

test("long lists are paged with a default of 20 and a page-size choice", () => {
  const { el, shadow } = panel("en");
  const ent = i => ({ object_type: "entity", object_id: `light.l${String(i).padStart(2, "0")}`, name: `Lamp ${String(i).padStart(2, "0")}`, status: "active" });
  el.data = { ...DATA, objects: Array.from({ length: 45 }, (_, i) => ent(i)), edges: [] };
  el.view = "unreferenced";
  assert.equal(el.pageSize, 20);
  el.render();
  assert.equal((shadow.innerHTML.match(/data-object="entity:light\.l/g) || []).length, 20);
  assert.ok(shadow.innerHTML.includes("1–20 of 45") && shadow.innerHTML.includes("Page 1 of 3"));
  el.pages.unreferenced = 3;
  el.render();
  assert.equal((shadow.innerHTML.match(/data-object="entity:light\.l/g) || []).length, 5);
  assert.ok(shadow.innerHTML.includes("41–45 of 45"));
  el.pageSize = 50;
  el.pages = {};
  el.render();
  assert.equal((shadow.innerHTML.match(/data-object="entity:light\.l/g) || []).length, 45);
  assert.ok(!shadow.innerHTML.includes("Page 1 of"));
});

test("findings can be searched, filtered by type, and sorted; export follows", () => {
  const { el, shadow } = panel("en");
  const f = (rule, id, conf, since) => ({ rule_id: rule, classification: "orphaned", object_id: id, confidence: conf, first_detected_at: since, ignored: false });
  el.data = { ...DATA, objects: [
    { object_type: "entity", object_id: "sensor.b", name: "Bravo", status: "orphaned" },
    { object_type: "entity", object_id: "sensor.a", name: "Alpha", status: "orphaned" },
    { object_type: "automation", object_id: "automation.c", name: "Charlie", status: "active" },
  ], edges: [], findings: [f("entity.x", "sensor.b", 0.9, "2026-01-02T00:00:00+00:00"), f("entity.x", "sensor.a", 0.8, null), f("automation.missing", "automation.c", 0.7, "2026-01-05T00:00:00+00:00")] };
  const ids = () => Array.from(el.visibleFindings().map(x => x.object_id)).join(",");
  el.view = "findingsNav";
  el.render();
  assert.equal(ids(), "sensor.b,sensor.a,automation.c");
  el.lv.findings.sort = "name"; el.lv.findings.dir = "asc";
  assert.equal(ids(), "sensor.a,sensor.b,automation.c");
  el.lv.findings.dir = "desc";
  assert.equal(ids(), "automation.c,sensor.b,sensor.a");
  el.lv.findings.sort = "since"; el.lv.findings.dir = "desc";
  assert.equal(ids(), "automation.c,sensor.b,sensor.a"); // missing date stays last
  el.lv.findings.dir = "asc";
  assert.equal(ids(), "sensor.b,automation.c,sensor.a");
  el.lv.findings.f.type = "entity";
  assert.equal(ids(), "sensor.b,sensor.a");
  el.lv.findings.q = "alpha";
  assert.equal(ids(), "sensor.a");
  assert.equal(el.exportRows().length, 1);
  el.render();
  assert.ok(shadow.innerHTML.includes('data-lq="findings"') && shadow.innerHTML.includes("data-ld=\"findings\""));
  el.lv.findings.q = "zzz";
  el.render();
  assert.ok(shadow.innerHTML.includes("No matches"));
});

test("batteries and unreferenced lists filter by area and sort", () => {
  const { el } = panel("en");
  const ent = (id, name, area, extra = {}) => ({ object_type: "entity", object_id: id, name, area_id: area, status: "active", device_class: "battery", state: "50", unit: "%", ...extra });
  el.data = { ...DATA, objects: [
    { object_type: "area", object_id: "kitchen", name: "Kitchen" }, { object_type: "area", object_id: "hall", name: "Hall" },
    ent("sensor.a", "Zeta", "kitchen", { state: "40" }), ent("sensor.b", "Alpha", "hall", { state: "90" }), ent("sensor.c", "Mid", "kitchen", { state: "10" }),
  ], edges: [] };
  el.view = "batteries"; el.batteryFilter = "all"; el.render();
  const read = () => { el.render(); return el.shadowRoot.innerHTML.match(/<strong>(Zeta|Alpha|Mid)<\/strong>/g).map(m => m.replace(/<\/?strong>/g, "")).join(","); };
  assert.equal(read(), "Mid,Zeta,Alpha"); // lowest level first
  el.lv.batteries.dir = "desc";
  assert.equal(read(), "Alpha,Zeta,Mid");
  el.lv.batteries.sort = "name"; el.lv.batteries.dir = "asc";
  assert.equal(read(), "Alpha,Mid,Zeta");
  el.lv.batteries.f.area = "Kitchen";
  assert.equal(read(), "Mid,Zeta");
  el.lv.batteries.q = "zet";
  assert.equal(read(), "Zeta");
});

function fakeStorage(initial = {}) {
  const store = { ...initial };
  return { store, getItem: key => (key in store ? store[key] : null), setItem: (key, value) => { store[key] = String(value); } };
}

test("settings are available before data has loaded", () => {
  const { el, shadow } = panel("de");
  el.data = null;
  el.view = "settings";
  el.render();
  assert.ok(shadow.innerHTML.includes("Schriftgröße") && shadow.innerHTML.includes("Farbschema"));
});

test("display preferences are saved, validated, and turned into theme CSS", () => {
  const storage = fakeStorage();
  const { el } = panel("en", { localStorage: storage });
  assert.equal(el.prefs.size, "normal");
  assert.ok(el.themeCss().includes("--hk-fs:1.1;") && !el.themeCss().includes("--hk-surface")); // standard + automatic follows Home Assistant
  el.setPref("size", "large");
  el.setPref("mode", "dark");
  el.setPref("scheme", "housekeeper");
  el.setPref("pageSize", "50");
  const css = el.themeCss();
  assert.ok(css.includes("--hk-fs:1.25") && css.includes("color-scheme:dark") && css.includes("--hk-blue:#4fc3ae"));
  assert.equal(el.pageSize, 50);
  const saved = JSON.parse(storage.store["ha_housekeeper.prefs"]);
  assert.equal(saved.scheme, "housekeeper");
  assert.equal(saved.pageSize, 50);
  // a fresh panel reads them back; invalid values fall back to defaults
  assert.equal(panel("en", { localStorage: storage }).el.prefs.mode, "dark");
  const broken = panel("en", { localStorage: fakeStorage({ "ha_housekeeper.prefs": JSON.stringify({ size: "huge", mode: "x", scheme: "neon", pageSize: 7, startView: "nope", graphMode: "cube" }) }) }).el;
  assert.equal(JSON.stringify(broken.prefs), JSON.stringify({ size: "normal", mode: "auto", scheme: "standard", density: "normal", motion: "auto", pageSize: 20, startView: "overview", graphMode: "list" }));
});

test("the start view preference applies unless a deep link says otherwise", () => {
  const win = search => ({ location: { search, pathname: "/ha-housekeeper" }, dispatchEvent() {}, history: {} });
  const a = panel("en", { window: win("") }).el;
  a.prefs = { ...a.prefs, startView: "batteries" };
  a.applyUrl();
  assert.equal(a.view, "batteries");
  const b = panel("en", { window: win("?view=inventory") }).el;
  b.prefs = { ...b.prefs, startView: "batteries" };
  b.applyUrl();
  assert.equal(b.view, "inventory");
});

test("preferences sync with the Home Assistant user profile", async () => {
  const calls = [];
  const stored = { size: "large", mode: "dark", scheme: "modern", density: "compact", motion: "reduced", pageSize: 50, startView: "batteries" };
  const { el } = panel("en", { localStorage: fakeStorage() });
  el._hass = { language: "en", callWS: async msg => { calls.push(msg); return msg.type === "frontend/get_user_data" ? { value: stored } : null; } };
  await el.loadUserPrefs();
  assert.equal(el.prefs.size, "large");
  assert.equal(el.prefs.scheme, "modern");
  assert.equal(el.pageSize, 50);
  el.setPref("density", "normal");
  const write = calls.find(c => c.type === "frontend/set_user_data");
  assert.equal(write.key, "ha_housekeeper");
  assert.equal(write.value.density, "normal");
  // a failing or empty profile leaves the local preferences alone
  const { el: other } = panel("en", { localStorage: fakeStorage() });
  other._hass = { language: "en", callWS: async () => { throw new Error("nope"); } };
  await other.loadUserPrefs();
  assert.equal(other.prefs.size, "normal");
});

test("scan settings are validated and sent to the options command", async () => {
  const { el, shadow } = panel("en");
  const sent = [];
  el._hass = { language: "en", callWS: async msg => { sent.push(msg); return { options: {} }; } };
  el.data = { ...DATA, meta: { ...DATA.meta, min_unavailable_days: 7, unused_automation_days: 90, scan_interval_hours: 24, low_battery_percent: 20 } };
  el.view = "settings"; el.settingsTab = "scan";
  el.render();
  assert.ok(shadow.innerHTML.includes('data-opt="scan_interval_hours"') && shadow.innerHTML.includes('value="24"'));
  const input = (key, value) => ({ dataset: { opt: key }, value });
  el.shadowRoot.querySelectorAll = selector => (selector === "[data-opt]" ? [input("scan_interval_hours", "6"), input("low_battery_percent", "500")] : []);
  await el.saveOptions();
  assert.equal(sent.length, 0);
  assert.ok(el.optionsMessage.includes("allowed range"));
  el.shadowRoot.querySelectorAll = selector => (selector === "[data-opt]" ? [input("scan_interval_hours", "6"), input("low_battery_percent", "15")] : []);
  await el.saveOptions();
  assert.equal(JSON.stringify(sent[0]), JSON.stringify({ type: "ha_housekeeper/set_options", scan_interval_hours: 6, low_battery_percent: 15 }));
  assert.ok(el.optionsMessage.includes("Saved"));
});

test("cleanup view lists candidates, creates a dry-run plan and shows the verdicts", async () => {
  const { el, shadow } = panel("en");
  const ent = (id, status) => ({ object_type: "entity", object_id: id, name: id, status, platform: "x" });
  el.data = { ...DATA, objects: [ent("sensor.old", "orphaned"), ent("sensor.used", "orphaned"), ent("light.fine", "active")], edges: [],
    findings: [
      { rule_id: "entity.state_missing", object_id: "sensor.old", classification: "orphaned", confidence: 0.9, ignored: false },
      { rule_id: "entity.state_missing", object_id: "sensor.used", classification: "orphaned", confidence: 0.9, ignored: false },
      { rule_id: "automation.missing_entity", object_id: "automation.a", classification: "broken_reference", confidence: 0.9, ignored: false },
    ] };
  const calls = [];
  el._hass = { language: "en", callWS: async msg => {
    calls.push(msg);
    if (msg.type === "ha_housekeeper/plan_list") return { plans: [] };
    return { plan_id: "p1", created_at: "2026-10-07T10:00:00+00:00", status: "dry_run", executed: false, summary: { total: 2, ok: 1, review: 0, blocked: 1, uses: 1, statistics: 0 },
      actions: [{ kind: "remove_entity", object_id: "sensor.old", name: "Old", verdict: "ok", reasons: [], used_by: [] },
        { kind: "remove_entity", object_id: "sensor.used", name: "Used", verdict: "blocked", reasons: ["used_certain"], used_by: [{ source: "automation:automation.a", relation: "TARGETS", confidence: "certain" }] }] };
  } };
  assert.equal(el.cleanupCandidates().length, 2); // broken references are not entity candidates
  el.view = "cleanup";
  el.render();
  assert.ok(shadow.innerHTML.includes("Candidates (2)") && shadow.innerHTML.includes("changes nothing") && shadow.innerHTML.includes("disabled"));
  el.cleanupSel = new Set(["sensor.old", "sensor.used"]);
  await el.createPlan();
  const create = calls.find(c => c.type === "ha_housekeeper/plan_create");
  assert.equal(JSON.stringify(create.actions), JSON.stringify([{ kind: "disable_entity", object_id: "sensor.old" }, { kind: "disable_entity", object_id: "sensor.used" }]));
  el.render();
  const html = shadow.innerHTML;
  assert.ok(html.includes("2 checked: 1 with no known use, 0 to review, 1 blocked.") && html.includes("Blocked") && html.includes("Definitely in use"));
  assert.ok(html.includes('data-plan-open="p1"')); // journaled
  await el.deletePlan("p1");
  assert.equal(el.plan, null);
});

test("orphaned statistics have their own tab with search, kind filter and energy flag", () => {
  const { el, shadow } = panel("en");
  el.data = { ...DATA, meta: { ...DATA.meta, recorder_available: true }, objects: [], edges: [], findings: [], orphaned_statistics: [
    { statistic_id: "sensor.old_energy", unit: "kWh", has_sum: true, has_mean: false, in_energy: true },
    { statistic_id: "sensor.old_temp", unit: "°C", has_sum: false, has_mean: true, in_energy: false },
    { statistic_id: "sensor.old_both", unit: null, has_sum: true, has_mean: true, in_energy: false },
  ] };
  el.view = "unreferenced";
  el.unrefTab = "statistics";
  el.render();
  let html = shadow.innerHTML;
  assert.ok(html.includes("Orphaned statistics</span><b class=\"sumvalue\">3</b>") && html.includes("sensor.old_energy") && html.includes("In the Energy dashboard") && html.includes("Developer tools"));
  assert.equal((html.match(/In the Energy dashboard/g) || []).length, 1);
  el.lv.orphanstats.f.kind = "kindMean";
  el.render();
  html = shadow.innerHTML;
  assert.ok(html.includes("sensor.old_temp") && !html.includes("sensor.old_energy"));
  el.lv.orphanstats.q = "nothing";
  el.render();
  assert.ok(shadow.innerHTML.includes("No matches"));
  el.data = { ...el.data, meta: { ...el.data.meta, recorder_available: false }, orphaned_statistics: [] };
  el.lv.orphanstats = undefined;
  el.render();
  assert.ok(shadow.innerHTML.includes("recorder is not available"));
});

test("orphaned statistics show their last entry and sort by it, oldest or newest first", async () => {
  const calls = [];
  const { el, shadow } = panel("en", { setTimeout: () => 0 });
  const day = 86400, now = Date.now() / 1000;
  el._hass = { language: "en", callWS: async msg => { calls.push(msg.type); return { available: true, busy: false, last: { "sensor.a": now - 40 * day, "sensor.b": now - 3 * day, "sensor.c": null } }; } };
  el.data = { ...DATA, meta: { ...DATA.meta, recorder_available: true }, objects: [], edges: [], findings: [], orphaned_statistics: ["a", "b", "c"].map(n => ({ statistic_id: `sensor.${n}`, unit: "%", has_sum: false, has_mean: true, in_energy: false })) };
  el.view = "unreferenced"; el.unrefTab = "statistics";
  el.render();
  const loading = el.loadOrphanLast();
  assert.ok(shadow.innerHTML.includes("<span class=\"muted\">…</span>"), "the column says it is loading");
  await loading;
  assert.deepEqual(calls, ["ha_housekeeper/statistics_last"]);
  const order = () => [...shadow.innerHTML.matchAll(/<strong class="cut">(sensor\.[abc])<\/strong>/g)].map(m => m[1]);
  el.lv.orphanstats.sort = "last"; el.lv.orphanstats.dir = "desc";
  el.render();
  assert.deepEqual(order(), ["sensor.b", "sensor.a", "sensor.c"]); // newest first, no entry last
  assert.ok(shadow.innerHTML.includes("Last entry") && shadow.innerHTML.includes("no entry found") && shadow.innerHTML.includes("days ago"));
  el.lv.orphanstats.dir = "asc";
  el.render();
  assert.deepEqual(order(), ["sensor.a", "sensor.b", "sensor.c"]); // oldest first, no entry still last
  // A busy recorder shows a note and is not asked in a loop; opening the tab again retries.
  el._hass.callWS = async msg => { calls.push(msg.type); return { available: true, busy: true, last: {} }; };
  await el.loadOrphanLast();
  assert.ok(shadow.innerHTML.includes("Recorder busy"));
  const before = calls.length;
  el.render();
  assert.equal(calls.length, before);
  el.retryOrphanLast();
  assert.equal(el._orphanLastRequested, false);
});

test("unused entities are a table with columns that sort and filters for domain, area and integration", () => {
  const { el, shadow } = panel("en");
  const day = 864e5, iso = ms => new Date(Date.now() - ms).toISOString();
  const ent = (id, extra = {}) => ({ object_type: "entity", object_id: id, name: id, status: "active", platform: "hue", device_id: null, area_id: null, ...extra });
  el.data = { ...DATA, meta: { ...DATA.meta, recorder_available: true }, edges: [], findings: [], orphaned_statistics: [], objects: [
    { object_type: "area", object_id: "kitchen", name: "Kitchen", status: "active" },
    ent("light.a", { platform: "hue", area_id: "kitchen", last_changed: iso(3 * day), last_reported: iso(60000), status_since: iso(10 * day), has_statistics: true }),
    ent("sensor.b", { platform: "zha", last_changed: iso(30 * day), last_reported: iso(2 * day) }),
    ent("switch.c", { platform: "hue" }),
  ] };
  el.view = "unreferenced"; el.unrefTab = "entities";
  el.render();
  let html = shadow.innerHTML;
  for (const head of ["Name", "Domain", "Device", "Area", "Integration", "Last change", "Last report", "Observed since", "Statistics"]) assert.ok(html.includes(`>${head}`), head);
  assert.ok(html.includes("data-lsort=\"unreferenced|changed|desc\"") && html.includes('aria-sort="ascending"'));
  assert.ok(html.includes("3 days ago") && html.includes("30 days ago") && html.includes("Kitchen"));
  const order = () => [...shadow.innerHTML.matchAll(/<span class="id cut"[^>]*>([a-z_.]+)<\/span>/g)].map(m => m[1]);
  assert.equal(JSON.stringify(order()), JSON.stringify(["light.a", "sensor.b", "switch.c"]));
  el.lv.unreferenced.sort = "changed"; el.lv.unreferenced.dir = "desc"; el.render();
  assert.equal(JSON.stringify(order()), JSON.stringify(["light.a", "sensor.b", "switch.c"]), "newest first, unknown last");
  el.lv.unreferenced.dir = "asc"; el.render();
  assert.equal(JSON.stringify(order()), JSON.stringify(["sensor.b", "light.a", "switch.c"]), "oldest first, unknown still last");
  el.lv.unreferenced.f.platform = "zha"; el.render();
  assert.equal(JSON.stringify(order()), JSON.stringify(["sensor.b"]));
  el.lv.unreferenced.f.platform = ""; el.lv.unreferenced.q = "kitchen"; el.render();
  assert.equal(JSON.stringify(order()), JSON.stringify(["light.a"]), "the search covers the area");
  assert.ok(shadow.innerHTML.includes("data-object=\"entity:light.a\""), "a row opens the entity");
});

test("orphaned statistics are a table that filters by unit and by the age of the last entry", () => {
  const { el, shadow } = panel("en", { setTimeout: () => 0 });
  const now = Date.now() / 1000, day = 86400;
  el.data = { ...DATA, meta: { ...DATA.meta, recorder_available: true }, objects: [], edges: [], findings: [], orphaned_statistics: [
    { statistic_id: "sensor.new", unit: "kWh", has_sum: true, has_mean: false, in_energy: false },
    { statistic_id: "sensor.old", unit: "°C", has_sum: false, has_mean: true, in_energy: false },
    { statistic_id: "sensor.dead", unit: "°C", has_sum: false, has_mean: true, in_energy: false },
  ] };
  el.orphanLast = { available: true, busy: false, last: { "sensor.new": now - 5 * day, "sensor.old": now - 400 * day, "sensor.dead": now - 900 * day } };
  el._orphanLastRequested = true;
  el.view = "unreferenced"; el.unrefTab = "statistics"; el.render();
  const ids = () => [...shadow.innerHTML.matchAll(/<strong class="cut">(sensor\.[a-z]+)<\/strong>/g)].map(m => m[1]);
  let html = shadow.innerHTML;
  for (const head of ["Statistic ID", "Kind", "Unit", "Last entry", "Energy dashboard"]) assert.ok(html.includes(`>${head}`), head);
  assert.equal(JSON.stringify(ids()), JSON.stringify(["sensor.dead", "sensor.new", "sensor.old"]));
  el.lv.orphanstats.f.age = "365"; el.render();
  assert.equal(JSON.stringify(ids()), JSON.stringify(["sensor.dead", "sensor.old"]), "older than a year");
  el.lv.orphanstats.f.age = "730"; el.render();
  assert.equal(JSON.stringify(ids()), JSON.stringify(["sensor.dead"]));
  el.lv.orphanstats.f.age = ""; el.lv.orphanstats.f.unit = "kWh"; el.render();
  assert.equal(JSON.stringify(ids()), JSON.stringify(["sensor.new"]));
  assert.ok(!shadow.innerHTML.includes('data-object="'), "statistics rows do not open anything");
});

test("changes can be searched and filtered by object type", () => {
  const { el, shadow } = panel("en");
  const part = items => ({ total: items.length, items });
  el.compare = { available: true, baseline_at: "2026-10-06T10:00:00+00:00", scanned_at: "2026-10-07T10:00:00+00:00", baselines: [],
    status_changes: part([]), new_findings: part([]), resolved_findings: part([]), removed_objects: part([]),
    new_objects: part([{ object_type: "entity", object_id: "light.kitchen", name: "Kitchen", status: "active" }, { object_type: "automation", object_id: "automation.night", name: "Night", status: "active" }]) };
  el.view = "changes";
  el.render();
  assert.ok(shadow.innerHTML.includes("light.kitchen") && shadow.innerHTML.includes("automation.night") && shadow.innerHTML.includes('data-lq="changes"'));
  el.lv.changes.f.type = "automation";
  el.render();
  assert.ok(!shadow.innerHTML.includes("light.kitchen") && shadow.innerHTML.includes("automation.night"));
  el.lv.changes.f.type = "";
  el.lv.changes.q = "kitch";
  el.render();
  assert.ok(shadow.innerHTML.includes("light.kitchen") && !shadow.innerHTML.includes("automation.night"));
  assert.ok(!shadow.innerHTML.includes("data-ls="));
});

test("policies: rules switch, violations list with hide buttons, hidden ones are folded away", async () => {
  const calls = [];
  const { el, shadow } = panel("en", { setTimeout: () => 0 });
  const item = (id, ignored = false, by = null) => ({ object_type: "entity", object_id: id, name: id, key: `policy.entity_area|${id}|`, ignored, by });
  el._hass = { language: "en", callWS: async msg => { calls.push(msg); return { available: true, enabled: 1, violations: 2, rules: [
    { id: "entity_area", enabled: true, count: 2, ignored: 2, items: [item("light.a"), item("light.b"), item("light.c", true, "user"), item("light.d", true, "label")] },
    { id: "device_area", enabled: false, count: 0, ignored: 0, items: [] }] }; } };
  el.view = "policies";
  el.render();
  assert.ok(shadow.innerHTML.includes("Checking policies"));
  await el.loadPolicies();
  let html = shadow.innerHTML;
  assert.ok(html.includes("Entity without an area") && html.includes("light.a") && html.includes("light.b") && !html.includes("light.c"), "hidden ones are folded away");
  assert.ok(html.includes("2 hidden") && html.includes("Show hidden"));
  el.viewTab = { policies: "rules" }; el.render(); html = shadow.innerHTML;
  assert.ok(html.includes("2 violations") && html.includes("Device without an area") && html.includes(">off<"));
  assert.equal((html.match(/data-policy-toggle=/g) || []).length, 2);
  assert.ok(/data-policy-toggle="entity_area"[^>]*checked/.test(html) && !/data-policy-toggle="device_area"[^>]*checked/.test(html));
  el.viewTab = {}; el.policyShowHidden = true; el.render(); html = shadow.innerHTML;
  assert.ok(html.includes("light.c") && html.includes("hidden by label") && html.includes(">Show<"));
  assert.equal((html.match(/data-policy-ignore=/g) || []).length, 3, "no button for what the label hides");
  await el.changePolicy({ type: "ha_housekeeper/set_policy", rule: "device_area", enabled: true });
  assert.equal(JSON.stringify(calls.map(c => c.type)), JSON.stringify(["ha_housekeeper/policies", "ha_housekeeper/set_policy", "ha_housekeeper/policies"]));
  el.policies = { available: true, enabled: 0, violations: 0, rules: [{ id: "entity_area", enabled: false, count: 0, ignored: 0, items: [] }] };
  el.render();
  assert.ok(shadow.innerHTML.includes("Switch on a rule above"));
});

test("policies, second stage: duplicate names, labels and the naming scheme with its prefix editor", async () => {
  const calls = [];
  const { el, shadow } = panel("en", { setTimeout: () => 0 });
  const it = (id, extra = {}) => ({ object_type: "entity", object_id: id, name: id, key: `k|${id}`, ignored: false, by: null, ...extra });
  let answer;
  el._hass = { language: "en", callWS: async msg => { calls.push(msg); return msg.type.endsWith("/policies") ? answer : {}; } };
  el.policies = answer = { available: true, enabled: 3, violations: 4, prefixes: { sensor: "wz_" }, rules: [
    { id: "duplicate_name", enabled: true, count: 2, ignored: 0, items: [it("light.k1", { also: ["light.k2"] }), it("light.k2", { also: ["light.k1"] })] },
    { id: "automation_label", enabled: true, count: 1, ignored: 0, items: [it("automation.a")] },
    { id: "naming_scheme", enabled: true, count: 1, ignored: 0, items: [it("sensor.temp", { expected: "wz_" })] }] };
  el._policiesRequested = true; el.view = "policies"; el.render();
  const html = shadow.innerHTML;
  for (const text of ["Duplicate display name", "Automation without a label", "Naming scheme", "Same name as: light.k2", "Expects the prefix wz_"]) assert.ok(html.includes(text), text);
  el.viewTab = { policies: "rules" }; el.render();
  assert.ok(shadow.innerHTML.includes("Prefix: wz_"));
  const rulesHtml = shadow.innerHTML;
  assert.equal((rulesHtml.match(/id="polDomain"/g) || []).length, 1, "the prefix editor belongs to the naming scheme only");
  assert.ok(rulesHtml.includes("data-policy-prefix-add") && rulesHtml.includes('data-policy-prefix-remove="sensor"'));
  await el.addPolicyPrefix("  light ", " wz_ ");
  await el.addPolicyPrefix("", "x_"); // incomplete input sends nothing
  await el.removePolicyPrefix("sensor");
  assert.equal(JSON.stringify(calls.filter(c => c.type.endsWith("set_policy_prefix")).map(c => [c.domain, c.prefix])), JSON.stringify([["light", "wz_"], ["sensor", ""]]));
});

test("an overdue scan is an item in the to-do list of the overview", () => {
  const { el } = panel("en");
  const meta = scanned => ({ ...DATA.meta, scanned_at: scanned, scan_interval_hours: 24 });
  el.data = { ...DATA, meta: meta(new Date().toISOString()) };
  assert.equal(el.staleScan(), null);
  el.data = { ...DATA, meta: meta(new Date(Date.now() - 80 * 3.6e6).toISOString()) };
  assert.equal(el.staleScan().hours, 80);
  assert.ok(el.todoItems().find(i => i.key === "stale").text.includes("scans every 24 hours"));
  el.data = { ...DATA, meta: { ...meta(new Date(Date.now() - 80 * 3.6e6).toISOString()), scan_interval_hours: 0 } };
  assert.equal(el.staleScan(), null); // manual scans: only after a week
  el.data = { ...DATA, meta: { ...meta(new Date(Date.now() - 9 * 24 * 3.6e6).toISOString()), scan_interval_hours: 0 } };
  assert.ok(el.todoItems().find(i => i.key === "stale").text.includes("9 days old"));
});

test("the journal lists short entries and opening one fetches the plan", async () => {
  const { el, shadow } = panel("en");
  el.data = { ...DATA, objects: [], edges: [], findings: [], quarantine: [] };
  el.view = "cleanup";
  el.journal = [{ plan_id: "p9", created_at: "2026-10-07T10:00:00+00:00", status: "verified", executed: true, run: true, summary: { total: 1, ok: 1, review: 0, blocked: 0 } }];
  el.plan = null;
  el.render();
  assert.ok(shadow.innerHTML.includes('data-plan-open="p9"'));
  assert.ok(!shadow.innerHTML.includes("file copy was dropped"));
  el.journal = [{ ...el.journal[0], file_snapshot_dropped: true }];
  el.render();
  assert.ok(shadow.innerHTML.includes("file copy was dropped"));
  const asked = [];
  el._hass = { language: "en", callWS: async msg => { asked.push(msg); return { plan_id: "p9", created_at: "2026-10-07T10:00:00+00:00", status: "verified", executed: true, summary: { total: 1, ok: 1, review: 0, blocked: 0 },
    actions: [{ kind: "disable_entity", object_id: "sensor.a", name: "A", verdict: "ok", executable: true, reasons: [], used_by: [], result: { state: "done" } }] }; } };
  await el.openPlan("p9");
  assert.equal(JSON.stringify(asked), JSON.stringify([{ type: "ha_housekeeper/plan_detail", plan_id: "p9" }]));
  assert.equal(el.plan.plan_id, "p9");
  assert.ok(shadow.innerHTML.includes("sensor.a"));
});

test("navigation marks the current page and progress is announced to screen readers", () => {
  const { el, shadow } = panel("en");
  el.data = { ...DATA };
  el.view = "findingsNav";
  el.render();
  let html = shadow.innerHTML;
  assert.equal((html.match(/aria-current="page"/g) || []).length, 1);
  assert.ok(/data-view="findingsNav"\s+aria-current="page"/.test(html));
  assert.ok(html.includes('role="status" aria-live="polite"'));
  assert.ok(!/aria-live="polite">[^<]/.test(html), "silent while idle");
  el.view = "settings";
  el.render();
  assert.ok(/data-view="settings"\s+aria-current="page"/.test(shadow.innerHTML));
  el.view = "cleanup";
  el.plan = { status: "running", actions: [] };
  el.planProgress = { done: 2, total: 5, phase: "execute" };
  assert.ok(el.liveStatus().includes("2") && el.liveStatus().includes("5"));
  el.plan = { status: "backup", actions: [] };
  assert.equal(el.liveStatus(), el.t("backupRunning"));
  el.plan = null; el.busy = true; el.scanStatus = { running: true, progress: 40 };
  assert.ok(el.liveStatus().includes("40%"));
  assert.ok(shadow.innerHTML.includes(":focus-visible") || el.styles().includes(":focus-visible"), "visible focus style");
  assert.ok(el.styles().includes(".sr-only{"));
});

test("the scan button is disabled while a plan runs", () => {
  const { el } = panel("en");
  el.data = { ...DATA };
  const disabled = () => /data-action="scan"\s+disabled/.test(el.heading());
  el.plan = null;
  assert.equal(disabled(), false);
  for (const status of ["backup", "running"]) { el.plan = { status }; assert.equal(disabled(), true, status); }
  el.plan = { status: "verified" };
  assert.equal(disabled(), false);
  assert.ok(el.t("err_cleanup_busy").includes("plan is running"));
});

test("preliminary data during the Home Assistant start shows a banner on every page", () => {
  const { el } = panel("en");
  el.data = { ...DATA, meta: { ...DATA.meta, preliminary: false } };
  assert.equal(el.warmupBanner(), "");
  assert.ok(!el.heading().includes("still starting"));
  el.data = { ...DATA, meta: { ...DATA.meta, preliminary: true, warmup_seconds_left: 120 } };
  assert.ok(el.warmupBanner().includes("still starting"));
  assert.ok(el.heading().includes("still starting")); // part of the page heading, so on every view
});

test("a dry-run plan is confirmed, typed, executed with progress, and can be undone", async () => {
  const { el, shadow } = panel("en");
  el.data = { ...DATA, objects: [{ object_type: "entity", object_id: "sensor.a", name: "A", status: "orphaned" }, { object_type: "entity", object_id: "sensor.b", name: "B", status: "orphaned" }], edges: [], findings: [] };
  const action = (id, verdict, extra = {}) => ({ kind: "disable_entity", object_id: id, name: id, verdict, executable: verdict !== "blocked", reasons: [], used_by: [], ...extra });
  const base = { plan_id: "p1", created_at: "2026-10-07T10:00:00+00:00", status: "dry_run", executed: false, summary: { total: 2, ok: 1, review: 1, blocked: 0 },
    actions: [action("sensor.a", "ok"), action("sensor.b", "review", { reasons: ["has_statistics"] })] };
  el.plan = base;
  el.view = "cleanup";
  const sent = [];
  let current = base;
  el._hass = { language: "en", callWS: async msg => {
    sent.push(msg);
    if (msg.type === "ha_housekeeper/plan_list") return { plans: [current] };
    if (msg.type === "ha_housekeeper/plan_confirm") return { plan_id: "p1", token: "tok", expires_at: "x", execute: msg.acknowledged.length ? ["sensor.a", "sensor.b"] : ["sensor.a"], needs_acknowledgement: msg.acknowledged.length ? [] : ["sensor.b"], skipped: [] };
    if (msg.type === "ha_housekeeper/plan_execute") return { started: true };
    if (msg.type === "ha_housekeeper/plan_cancel") return { cancelling: true };
    if (msg.type === "ha_housekeeper/plan_status") return { progress: { running: false, done: 1, total: 1 }, plan: current };
    if (msg.type === "ha_housekeeper/plan_undo") { current = { ...current, status: "undone" }; return { results: [{ object_id: "sensor.a", outcome: "undone" }], status: "undone" }; }
    if (msg.type === "ha_housekeeper/scan" || msg.type === "ha_housekeeper/inventory") return el.data;
    return {};
  } };
  el.render();
  let html = shadow.innerHTML;
  assert.ok(html.includes("data-plan-confirm") && html.includes('data-ack="sensor.b"') && !html.includes("data-plan-execute"));
  el.ack.add("sensor.b");
  await el.confirmPlan();
  const confirm = sent.find(m => m.type === "ha_housekeeper/plan_confirm");
  assert.equal(JSON.stringify(confirm.acknowledged), JSON.stringify(["sensor.b"]));
  el.render();
  html = shadow.innerHTML;
  assert.ok(html.includes("2 entities will be disabled") && html.includes("Type “DISABLE”") && html.includes("data-plan-execute") && html.includes("disabled>Run now"));
  el.confirmWord = "disable";
  el.render();
  assert.ok(!shadow.innerHTML.includes("disabled>Run now"));
  current = { ...base, status: "verified", executed: true, run: { started_at: "x" }, verification: { ok: true, checks: [{ check: "disabled", object_id: "sensor.a", ok: true }, { check: "no_new_broken_references", ok: true }] },
    actions: [action("sensor.a", "ok", { result: { state: "done" } }), action("sensor.b", "review", { result: { state: "not_run", reason: "entity_changed" } })] };
  await el.executePlan();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(sent.find(m => m.type === "ha_housekeeper/plan_execute").token, "tok");
  el.render();
  html = shadow.innerHTML;
  assert.ok(html.includes("Executed and verified") && html.includes("Disabled") && html.includes("changed after the preview") && html.includes("data-undo-all") && html.includes('data-undo-one="sensor.a"'));
  assert.ok(html.includes("✓ Entity is disabled") && !html.includes("data-plan-delete"));
  await el.undoPlan();
  assert.ok(el.undoMessage.includes("sensor.a: enabled again"));
  assert.equal(el.plan.status, "undone");
});

test("a blocked removal cannot be confirmed; a ready one asks for the removal word and mentions the backup", async () => {
  const { el, shadow } = panel("en");
  el.data = { ...DATA, objects: [], edges: [], findings: [], quarantine: [] };
  const plan = (executable, reasons) => ({ plan_id: "p2", created_at: "2026-10-07T10:00:00+00:00", status: "dry_run", executed: false, summary: { total: 1, ok: executable ? 1 : 0, review: 0, blocked: executable ? 0 : 1 },
    actions: [{ kind: "remove_entity", object_id: "sensor.a", name: "A", verdict: executable ? "ok" : "blocked", executable, reasons, quarantine_days_left: 6, used_by: [] }] });
  el.view = "cleanup";
  el.journal = [];
  el.plan = plan(false, ["quarantine_too_short"]);
  el.render();
  assert.ok(!shadow.innerHTML.includes("data-plan-confirm") && shadow.innerHTML.includes("No executable actions") && shadow.innerHTML.includes("quarantine is still too short. (6 days to go)"));
  el.plan = plan(true, []);
  el._hass = { language: "en", callWS: async () => ({ plan_id: "p2", token: "t", expires_at: "x", execute: ["sensor.a"], removals: ["sensor.a"], needs_acknowledgement: [], skipped: [] }) };
  el.render();
  assert.ok(shadow.innerHTML.includes("data-plan-confirm"));
  await el.confirmPlan();
  el.render();
  assert.ok(shadow.innerHTML.includes("Type “REMOVE”") && shadow.innerHTML.includes("creates a Home Assistant backup first"));
  el.confirmWord = "remove";
  el.render();
  assert.ok(!shadow.innerHTML.includes("disabled>Run now"));
});

test("removal candidates are the quarantined entities and wait for the quarantine period", () => {
  const { el, shadow } = panel("en");
  const ago = n => new Date(Date.now() - n * 864e5 - 3600e3).toISOString();
  const item = id => ({ object_type: "entity", object_id: id, name: id, status: "disabled" });
  el.data = { ...DATA, meta: { ...DATA.meta, quarantine_days: 14 }, objects: [item("sensor.old"), item("sensor.new")], edges: [], findings: [],
    quarantine: [{ object_id: "sensor.old", plan_id: "p", since: ago(20) }, { object_id: "sensor.new", plan_id: "p", since: ago(2) }] };
  el.journal = [];
  el.view = "cleanup";
  el.cleanupKind = "remove_entity";
  el.render();
  const html = shadow.innerHTML;
  assert.ok(html.includes("Candidates (2)") && html.includes("Ready") && html.includes("12 days to go") && html.includes("Removal is possible only after 14 days"));
  assert.ok(/data-sel="sensor.new"[^>]*disabled/.test(html) && !/data-sel="sensor.old"[^>]*disabled/.test(html));
  assert.equal(JSON.stringify(el._cleanupVisible), JSON.stringify(["sensor.old"]));
  el.lv.cleanup.f.readiness = "waiting";
  el.render();
  assert.ok(shadow.innerHTML.includes("sensor.new") && !shadow.innerHTML.includes('data-sel="sensor.old"'));
});

test("the served panel file is built from panel-src and up to date", () => {
  assert.equal(fs.readFileSync(SOURCE, "utf8"), buildPanel(), "run: node scripts/build_panel.mjs");
});

const stepCData = () => {
  const ago = n => new Date(Date.now() - n * 864e5 - 3600e3).toISOString();
  const entity = (id, status, device_id) => ({ object_type: "entity", object_id: id, name: id, status, device_id });
  const device = (id, name, status = "active", extra = {}) => ({ object_type: "device", object_id: id, name, status, manufacturer: "Acme", model: "X1", ...extra });
  return { ago, data: { ...DATA, meta: { ...DATA.meta, quarantine_days: 14 }, findings: [], edges: [{ source: "automation:automation.heat", target: "entity:sensor.old", relation: "TRIGGERS_ON", confidence: "certain" }],
    objects: [device("d-dead", "Dead lamp"), device("d-live", "Live lamp"), device("d-q", "Quarantined plug", "disabled"), entity("light.dead", "orphaned", "d-dead"), entity("light.live", "active", "d-live"),
      entity("sensor.old", "unavailable"), entity("sensor.new", "active")],
    quarantine: [{ object_type: "device", object_id: "d-q", plan_id: "p", since: ago(20) }],
    recurring_devices: [{ device_id: "d-dead", name: "Dead lamp", forgotten_at: ago(3), plan_id: "p", domains: ["hue"] }] } };
};

test("device candidates are the devices without working entities; removal lists quarantined devices", () => {
  const { el, shadow } = panel("en");
  const { data } = stepCData();
  el.data = data; el.journal = []; el.view = "cleanup";
  el.cleanupKind = "disable_device";
  el.render();
  let html = shadow.innerHTML;
  assert.ok(html.includes("Candidates (1)") && html.includes('data-sel="d-dead"') && !html.includes('data-sel="d-live"') && !html.includes('data-sel="d-q"'));
  assert.ok(html.includes("1 entities") && html.includes('data-object="device:d-dead"'));
  for (const kind of ["remove_device", "forget_device"]) {
    el.cleanupKind = kind; el.lv.cleanup = undefined; el.render();
    html = shadow.innerHTML;
    assert.ok(html.includes('data-sel="d-q"') && html.includes("Devices in quarantine") && !html.includes('data-sel="d-dead"'), kind);
  }
  for (const value of ["disable_device", "remove_device", "forget_device", "replace_references"]) assert.ok(html.includes(`value="${value}"`));
});

test("the replace assistant previews sources and sends the new entity with the plan", async () => {
  const { el, shadow } = panel("en");
  const { data } = stepCData();
  el.data = data; el.journal = []; el.view = "cleanup"; el.cleanupKind = "replace_references";
  el.render();
  let html = shadow.innerHTML;
  assert.ok(html.includes("Replace references") && html.includes('<option value="sensor.old">') && html.includes("data-repl-old"));
  assert.ok(/data-plan-create\s+disabled/.test(html));
  el.replOld = "sensor.old"; el.replNew = "sensor.new";
  el.render();
  html = shadow.innerHTML;
  assert.ok(html.includes('<option value="sensor.new">') && !html.includes('<option value="light.live">') && !/data-plan-create\s+disabled/.test(html));
  const sent = [];
  const plan = { plan_id: "r1", created_at: "2026-10-07T10:00:00+00:00", status: "dry_run", executed: false, summary: { total: 1, ok: 0, review: 1, blocked: 0 },
    actions: [{ kind: "replace_references", object_type: "entity", object_id: "sensor.old", target: "sensor.new", name: "sensor.old", verdict: "review", executable: true, reasons: ["config_rewrite", "source_manual"], used_by: [],
      sources: [{ source: "automation:automation.heat", type: "automation", name: "Heating", writable: true, reason: null, change_count: 2, changes: [{ location: "trigger/0/entity_id", from: "sensor.old", to: "sensor.new" }], manual: ["action/0/data/message"] },
        { source: "dashboard:yamlboard", type: "dashboard", name: "yamlboard", writable: false, reason: "yaml_mode", change_count: 0, changes: [], manual: [] }] }] };
  el._hass = { language: "en", callWS: async msg => { sent.push(msg); return plan; } };
  await el.createPlan();
  assert.equal(JSON.stringify(sent[0]), JSON.stringify({ type: "ha_housekeeper/plan_create", actions: [{ kind: "replace_references", object_id: "sensor.old", target: "sensor.new" }] }));
  el.render();
  html = shadow.innerHTML;
  assert.ok(html.includes("sensor.old → sensor.new") && html.includes("Heating") && html.includes("2 changes") && html.includes("trigger/0/entity_id: sensor.old → sensor.new"));
  assert.ok(html.includes("check by hand: 1 templates") && html.includes("YAML dashboard") && html.includes("Rewrites configuration"));
  assert.equal(el.planWord(plan), "REPLACE");
  assert.ok(el.confirmSummary(plan, 1).startsWith("In 2 entity references"));
});

test("removing a device asks for the removal word and says that its entities go with it", () => {
  const { el } = panel("en");
  const plan = { actions: [{ kind: "forget_device", executable: true }, { kind: "disable_device", executable: true }] };
  assert.equal(el.planWord(plan), "REMOVE");
  assert.ok(el.confirmSummary(plan, 2).includes("2 devices will be removed together with their entities"));
  const quarantine = { actions: [{ kind: "disable_device", executable: true }] };
  assert.equal(el.planWord(quarantine), "DISABLE");
  assert.ok(el.confirmSummary(quarantine, 3).startsWith("3 devices will be disabled"));
  assert.equal(panel("de").el.planWord({ actions: [{ kind: "replace_references", executable: true }] }), "ERSETZEN");
});

// The detail page is split into tabs; some checks look at several of them.
function detailTabsHtml(el, shadow, ...tabs) {
  return tabs.map(tab => { el.detailTab = tab; el.render(); return shadow.innerHTML; }).join("\n");
}

test("an integration page says which integration it is, where it comes from and how it was set up", () => {
  const { el, shadow } = panel("de");
  const entry = { object_type: "config_entry", object_id: "01K72", name: "Bridge", domain: "hue", integration_name: "Philips Hue", custom: true, integration_dir: "custom_components/hue", integration_version: "1.2.3",
    documentation: "https://example.org/hue", source: "zeroconf", state: "setup_error", error: "Cannot connect", unique_id: "abc", entity_count: 4, device_count: 2, created_at: "2026-09-01T10:00:00+00:00", status: "problem" };
  el.data = { ...DATA, objects: [entry], edges: [], findings: [] };
  el.selected = entry; el.view = "detail"; el.details = new Map();
  const html = detailTabsHtml(el, shadow, "overview", "technical");
  for (const text of ["Philips Hue", "(hue)", "custom_components/hue · v1.2.3", "Automatisch entdeckt (zeroconf)", "Cannot connect", "01K72", "abc", "/config/integrations/integration/hue", 'href="https://example.org/hue"']) assert.ok(html.includes(text), text);
  assert.ok(html.includes("Meldung: Cannot connect"));
});

const propertyData = () => {
  const entry = { object_type: "config_entry", object_id: "ce1", name: "Hue Bridge", domain: "hue", integration_name: "Philips Hue", status: "active", state: "loaded" };
  const device = { object_type: "device", object_id: "dev1", name: "Küchenlampe", original_name: "Hue color lamp", manufacturer: "Signify", model: "LCT015", model_id: "9290", serial_number: "SN1", sw_version: "1.88", hw_version: "2", entry_type: null,
    configuration_url: "https://hue.local", area_id: "kitchen", via_device_id: "hub", config_entry_ids: ["ce1"], labels: ["lbl"], identifiers: ["hue:abc"], connections: ["mac:aa:bb"], status: "active", entity_count: 1, created_at: "2026-09-01T10:00:00+00:00" };
  const hub = { object_type: "device", object_id: "hub", name: "Hue Hub", status: "active", config_entry_ids: ["ce1"], labels: [] };
  const entity = { object_type: "entity", object_id: "light.kitchen", name: "Küche", original_name: "Color lamp", unique_id: "u-1", platform: "hue", device_id: "dev1", config_entry_id: "ce1", area_id: null, labels: ["lbl"], aliases: ["Deckenlicht"],
    entity_category: "diagnostic", disabled_by: "user", hidden_by: "integration", icon: "mdi:lamp", status: "active", state: "on", unit: "W", state_class: "measurement", device_class: "light", created_at: "2026-09-01T10:00:00+00:00", last_changed: "2026-10-07T09:00:00+00:00" };
  return { ...DATA, objects: [entry, device, hub, entity, { object_type: "area", object_id: "kitchen", name: "Küche (Raum)", status: "active" }, { object_type: "label", object_id: "lbl", name: "Wichtig", status: "active" }], edges: [], findings: [] };
};

const METER_PLAN = {
  plan_id: "m1", created_at: "2026-10-07T10:00:00+00:00", status: "dry_run", executed: false, summary: { total: 1, ok: 0, review: 1, blocked: 0 },
  actions: [{ kind: "migrate_meter", object_type: "entity", object_id: "sensor.meter_old", target: "sensor.meter_new", mode: "both", alt_id: "sensor.meter_old_alt", name: "Old meter", verdict: "review", executable: true,
    reasons: ["stats_write", "id_takeover", "stats_gap"], used_by: [],
    statistics: { import_count: 48, old_first: 1788220800, old_last: 1788390000, switch: 1788480000, offset: 47, unit: "kWh", dropped_overlap: 3, gap_hours: 24,
      preview: { before: [{ start: 1788386400, sum: 46 }, { start: 1788390000, sum: 47 }], after: [{ start: 1788480000, sum: 0, sum_after: 47 }] } } }],
};

test("the meter assistant offers the modes and sends the pair with the plan", async () => {
  const { el, shadow } = panel("en");
  const { data } = stepCData();
  data.objects.push({ object_type: "entity", object_id: "sensor.meter_old", name: "Old meter", status: "unavailable", has_statistics: true, unit: "kWh" },
    { object_type: "entity", object_id: "sensor.meter_new", name: "New meter", status: "active", unit: "kWh" },
    { object_type: "entity", object_id: "sensor.other_unit", name: "Other", status: "active", unit: "W" });
  el.data = data; el.journal = []; el.view = "cleanup"; el.cleanupKind = "migrate_meter";
  el.render();
  let html = shadow.innerHTML;
  assert.ok(html.includes("Meter change") && html.includes("data-meter-old") && html.includes('<option value="sensor.meter_old">') && html.includes('value="migrate_meter"'));
  assert.ok(html.includes("Continue statistics and take over the ID") && /data-plan-create\s+disabled/.test(html));
  el.meterOld = "sensor.meter_old"; el.meterNew = "sensor.meter_new"; el.meterMode = "statistics";
  el.render();
  html = shadow.innerHTML;
  assert.ok(html.includes('<option value="sensor.meter_new">') && !html.includes('<option value="sensor.other_unit">'), "only new meters with the same unit");
  const sent = [];
  el._hass = { language: "en", callWS: async msg => { sent.push(msg); return METER_PLAN; } };
  await el.createPlan();
  assert.equal(JSON.stringify(sent[0]), JSON.stringify({ type: "ha_housekeeper/plan_create", actions: [{ kind: "migrate_meter", object_id: "sensor.meter_old", target: "sensor.meter_new", mode: "statistics" }] }));
});

test("a meter plan explains the copy, the shifted total and the ID move, and asks for MIGRATE", () => {
  const { el, shadow } = panel("en");
  const { data } = stepCData();
  el.data = data; el.journal = []; el.view = "cleanup"; el.plan = METER_PLAN;
  el.render();
  const html = shadow.innerHTML;
  assert.ok(html.includes("sensor.meter_old → sensor.meter_new") && html.includes("48 hourly values"));
  assert.ok(html.includes("raised by 47 kWh") && html.includes("3 overlapping values") && html.includes("Gap without values: 24 hours"));
  assert.ok(html.includes("sensor.meter_old → sensor.meter_old_alt, then sensor.meter_new → sensor.meter_old"));
  assert.ok(html.includes("Experimental: writes into the recorder database"));
  assert.equal(el.planWord(METER_PLAN), "MIGRATE");
  assert.ok(el.confirmSummary(METER_PLAN, 1).startsWith("1 meter changes: Housekeeper first creates a Home Assistant backup"));
  assert.equal(panel("de").el.planWord(METER_PLAN), "MIGRIEREN");
  const done = { ...METER_PLAN, status: "verified", actions: [{ ...METER_PLAN.actions[0], result: { state: "done", statistics_kept: true } }] };
  el.plan = done; el.render();
  assert.ok(shadow.innerHTML.includes("Migrated") && shadow.innerHTML.includes("only be reset with the backup"));
});

const COSTS = {
  available: true, total_states: 12000, first: 0, last: 1, size_bytes: 5 * 1024 * 1024, keep_days: 10, statistics_total: 300,
  entities: [
    { entity_id: "sensor.noisy", name: "<b>Noisy</b>", states: 9000, per_day: 900, share: 75, used: 0, has_statistics: false, known: true, excluded: false, suggest_exclude: true },
    { entity_id: "sensor.used", name: "Used", states: 2000, per_day: 200, share: 16.7, used: 3, has_statistics: false, known: true, excluded: false, suggest_exclude: false },
    { entity_id: "sensor.gone", name: "Gone", states: 100, per_day: 10, share: 0.8, used: 0, has_statistics: false, known: true, excluded: true, suggest_exclude: false },
  ],
  statistics: [{ statistic_id: "sensor.energy", rows: 250, known: true }],
};

test("the maintenance view loads the preflight; the recorder view offers the cost analysis on request", async () => {
  const { el, shadow } = panel("en", { setTimeout: () => 0 });
  const sent = [];
  const state = { ha_version: "2026.2.3", backup: { available: true, configured: true, newest: "x", age_hours: 5 }, repairs: [{ issue_id: "old", domain: "demo" }], failed_entries: [], broken: [], pending_updates: [{ entity_id: "update.core", name: "Core", installed: "2026.2.3", latest: "2026.3.0" }] };
  const report = { state, checks: [{ check: "backup", level: "ok" }, { check: "repairs", level: "warn", count: 1 }, { check: "failed_entries", level: "ok", count: 0 }, { check: "broken", level: "ok", count: 0 }], record: null, after: null };
  el._hass = { language: "en", callWS: async msg => { sent.push(msg.type); return msg.type.endsWith("recorder_costs") ? COSTS : report; } };
  el.view = "maintenance"; el.viewTab = { maintenance: "preflight" };
  el.render();
  assert.ok(shadow.innerHTML.includes("Update preflight") && shadow.innerHTML.includes("Checking"));
  assert.ok(!shadow.innerHTML.includes("Start analysis") && !shadow.innerHTML.includes("Recorder costs"), "the recorder topics moved to the Recorder view");
  await el.loadPreflight();
  let html = shadow.innerHTML;
  assert.deepEqual(sent, ["ha_housekeeper/preflight"]);
  assert.ok(html.includes("Last backup 5 h ago") && html.includes("Open repairs") && html.includes("1 · old"));
  assert.ok(html.includes("Core 2026.2.3 → 2026.3.0") && html.includes("No starting state saved yet."));
  el.view = "recorder"; el.viewTab = { recorder: "costs" };
  el.render();
  assert.ok(shadow.innerHTML.includes("Start analysis"));
  await el.loadCosts();
  html = shadow.innerHTML;
  assert.ok(html.includes("12,000 stored states") && html.includes("5 MB") && html.includes("kept 10 days"));
  assert.ok(html.includes("&lt;b&gt;Noisy&lt;/b&gt;") && !html.includes("<b>Noisy</b>"), "names are escaped");
  assert.ok(html.includes("can be excluded") && html.includes("already excluded") && html.includes("3 uses"));
  assert.equal(el.exclusionSnippet(), "recorder:\n  exclude:\n    entities:\n      - sensor.noisy\n");
  assert.ok(html.includes("Suggestion for configuration.yaml") && html.includes("- sensor.noisy") && !html.includes("- sensor.used"));
});

test("the recorder costs rank by the current rate, switch to the total and ask for a refresh", async () => {
  const { el, shadow } = panel("en", { setTimeout: () => 0 });
  const costs = { ...COSTS, took_ms: 1234, cached: false, entities: [
    { entity_id: "sensor.history", name: "History", states: 9000, per_day: 300, per_day_avg: 300, states_24h: 2, states_7d: 6, share: 75, used: 0, has_statistics: false, known: true, excluded: false, suggest_exclude: false },
    { entity_id: "sensor.loud", name: "Loud", states: 600, per_day: 600, per_day_avg: 600, states_24h: 500, states_7d: 3000, share: 5, used: 0, has_statistics: false, known: true, excluded: false, suggest_exclude: true },
  ] };
  const sent = [];
  el._hass = { language: "en", callWS: async msg => { sent.push(msg); return costs; } };
  el.view = "recorder"; el.viewTab = { recorder: "costs" };
  await el.loadCosts();
  assert.equal(JSON.stringify(sent[0]), JSON.stringify({ type: "ha_housekeeper/recorder_costs" }));
  let html = shadow.innerHTML;
  assert.ok(html.indexOf("sensor.loud") < html.indexOf("sensor.history"), "current rate first");
  assert.ok(html.includes("24 h: 500 · 7 days: 3,000 · avg 600 per day") && html.includes("calculated in 1,234 ms"));
  assert.ok(html.includes('data-cost-sort="recent"') && html.includes('aria-pressed="true"'));
  const totalButton = { dataset: { costSort: "total" } };
  el.shadowRoot.querySelectorAll = selector => (selector === "[data-cost-sort]" ? [totalButton] : []);
  el.render(); // binds the button
  totalButton.onclick();
  html = shadow.innerHTML;
  assert.ok(html.indexOf("sensor.history") < html.indexOf("sensor.loud"), "by the total in the database");
  assert.ok(html.includes("24 h: 2 · 7 days: 6 · avg 300 per day"));
  await el.loadCosts(true);
  assert.equal(JSON.stringify(sent[1]), JSON.stringify({ type: "ha_housekeeper/recorder_costs", refresh: true }));
  assert.ok(el.t("recorderCached", { ms: 5 }).includes("few minutes"));
});

const BACKUP_REPORT = {
  available: true, overall: "problem", counts: { ok: 3, note: 3, problem: 1, unknown: 0 }, schema: 1, backup_count: 2,
  checks: [
    { id: "setup", level: "ok", values: { agents: ["hassio.local", "cloud.cloud"], recurrence: "daily" } },
    { id: "newest", level: "problem", values: { age_hours: 70, limit_hours: 36, date: "2026-10-05T10:00:00+00:00", recurrence: "daily" } },
    { id: "last_run", level: "problem", values: { attempted: "2026-10-08T03:00:00+00:00", completed: "2026-10-05T03:00:00+00:00", failed_agents: ["cloud.<b>"], failed_attempt: true } },
    { id: "targets", level: "note", values: { local: ["hassio.local"], remote: [] } },
    { id: "size", level: "note", values: { size: 524288000, expected: 1048576000, ratio: 0.5, baseline: 3 } },
    { id: "retention", level: "ok", values: { copies: 3, days: null, count: 2, oldest_days: 6.4 } },
    { id: "encryption", level: "note", values: { configured: false, newest_protected: false } },
    { id: "emergency_kit", level: "note", values: { at: null, age_days: null } },
    { id: "restore_test", level: "ok", values: { at: "2026-09-01T00:00:00+00:00", age_days: 37 } },
    { id: "plan_backups", level: "note", values: { checked: 4, missing: 1 } },
  ],
  backups: [{ date: "2026-10-05T10:00:00+00:00", size: 524288000, agents: ["hassio.local"], protected: false, automatic: true, failed_agents: [] }],
  attest: { emergency_kit: null, restore_test: "2026-09-01T00:00:00+00:00" },
};

test("the backup card puts text and a word next to every level and escapes what comes from outside", async () => {
  const { el, shadow } = panel("en");
  el.data = DATA;
  el._hass = { language: "en", callWS: async () => BACKUP_REPORT };
  el.view = "maintenance"; el.render();
  assert.ok(shadow.innerHTML.includes("Backup protection") && shadow.innerHTML.includes("Checking backups"));
  await el.loadBackup();
  const html = shadow.innerHTML;
  for (const text of ["Targets and schedule", "Targets: hassio.local, cloud.cloud · schedule: daily", "3 days ago · limit for the schedule: 36 h",
    "The last attempt", "no backup; last success", "Targets with errors: cloud.&lt;b&gt;", "Local only (hassio.local)", "500 MB instead of about 1,000 MB (50 %)",
    "Retention: 3 backups · present: 2, the oldest 6 days old", "No backup password set.", "Not confirmed yet", "Last on", "37 days ago",
    "not found any more", "Latest backups", "How to test a restore", "Housekeeper never performs a restore itself"]) assert.ok(html.includes(text), text);
  for (const word of [">OK<", ">Note<", ">Problem<"]) assert.ok(html.includes(word), word);
  assert.ok(!html.includes("<b>>") && !html.includes("cloud.<b>"));
  assert.ok(html.indexOf("Backup protection") < html.indexOf("Update preflight"), "the card comes first");
});

test("the backup card says when the component is missing or the call fails", async () => {
  const { el, shadow } = panel("de");
  el._hass = { language: "de", callWS: async () => ({ available: false, checks: [], backups: [], overall: "unknown" }) };
  el.view = "maintenance"; await el.loadBackup();
  assert.ok(shadow.innerHTML.includes("Backup-Komponente von Home Assistant ist nicht verfügbar"));
  el._hass = { language: "de", callWS: async () => { throw new Error("kaputt"); } };
  await el.loadBackup();
  assert.ok(shadow.innerHTML.includes("kaputt") && !shadow.innerHTML.includes("nicht verfügbar"));
});

test("the two confirmations are saved with their date and can be taken back", async () => {
  const { el, shadow } = panel("en");
  const sent = [];
  el._hass = { language: "en", callWS: async msg => { sent.push(JSON.stringify(msg)); return BACKUP_REPORT; } };
  el.view = "maintenance"; await el.loadBackup();
  const kit = { dataset: { bhSave: "emergency_kit" } }, restore = { dataset: { bhClear: "restore_test" } };
  const dates = { emergency_kit: { value: "2026-10-01" } };
  el.shadowRoot.querySelectorAll = selector => (selector === "[data-bh-save]" ? [kit] : selector === "[data-bh-clear]" ? [restore] : []);
  el.shadowRoot.querySelector = selector => { const m = /data-bh-date="(\w+)"/.exec(selector); return m ? dates[m[1]] || null : null; };
  el.render();
  assert.ok(shadow.innerHTML.includes('data-bh-save="emergency_kit"') && shadow.innerHTML.includes('data-bh-save="restore_test"'));
  assert.ok(shadow.innerHTML.includes('data-bh-clear="restore_test"') && !shadow.innerHTML.includes('data-bh-clear="emergency_kit"'), "only a recorded one can be taken back");
  sent.length = 0;
  kit.onclick();
  await Promise.resolve();
  assert.equal(sent[0], JSON.stringify({ type: "ha_housekeeper/backup_attest", kind: "emergency_kit", date: "2026-10-01" }));
  restore.onclick();
  await Promise.resolve();
  assert.equal(sent[1], JSON.stringify({ type: "ha_housekeeper/backup_attest", kind: "restore_test", clear: true }));
});

test("after an update the preflight lists what is new since the saved state", async () => {
  const { el, shadow } = panel("en");
  const state = { ha_version: "2026.3.0", backup: { available: false }, repairs: [], failed_entries: [], broken: [], pending_updates: [] };
  const after = { from_version: "2026.2.3", to_version: "2026.3.0", new_repairs: [{ issue_id: "deprecated", domain: "hue", severity: "warning" }], new_failed_entries: [{ title: "Hub <x>", domain: "demo", entry_id: "e" }], new_broken: [],
    inventory: { new_objects: { total: 2, items: [] }, removed_objects: { total: 0, items: [] }, status_changes: { total: 1, items: [] }, new_findings: { total: 0, items: [] }, resolved_findings: { total: 0, items: [] } } };
  el.preflight = { state, checks: [{ check: "backup", level: "warn" }], record: { at: "2026-10-01T10:00:00+00:00", ha_version: "2026.2.3", repairs: 0, failed_entries: 0, broken: 0, objects: 40 }, after };
  el.view = "maintenance"; el.viewTab = { maintenance: "preflight" }; el._pfRequested = true;
  el.render();
  const html = shadow.innerHTML;
  assert.ok(html.includes("Since the update: Home Assistant 2026.2.3 → 2026.3.0") && html.includes("hue · deprecated") && html.includes("Hub &lt;x&gt; (demo)"));
  assert.ok(html.includes("New objects") && html.includes("Backup component not available") && html.includes("Saved"));
});

test("inventory rows and sortable headers can be used with the keyboard", () => {
  const { el, shadow } = panel("en");
  el.view = "inventory";
  const row = { dataset: { object: "entity:sensor.b" }, click() { this.clicked = (this.clicked || 0) + 1; } };
  row.target = row;
  el.shadowRoot.querySelectorAll = selector => (selector === "tr[data-object], g[data-graph]" ? [row] : []);
  el.render();
  const html = shadow.innerHTML;
  assert.ok(/<tr data-object="[^"]+" tabindex="0" role="button" aria-label="[^"]+">/.test(html), "rows are focusable");
  assert.ok(/<th data-sort="name" aria-sort="[a-z]+"><button type="button" class="thbtn" data-sortbtn="name">/.test(html), "headers hold a real button");
  const key = (k, target = row) => { const ev = { key: k, target, prevented: false, preventDefault() { this.prevented = true; } }; row.onkeydown(ev); return ev; };
  assert.ok(key("Enter").prevented && row.clicked === 1);
  assert.ok(key(" ").prevented && row.clicked === 2);
  assert.ok(!key("a").prevented && row.clicked === 2, "other keys do nothing");
  assert.ok(!key("Enter", {}).prevented && row.clicked === 2, "keys pressed inside a control are left alone");
});

test("the replacement preview warns about sources that undo only item by item", () => {
  const { el } = panel("en");
  const action = { sources: [
    { name: "Small", type: "automation", writable: true, change_count: 1, changes: [], manual: [], undo_per_item: false },
    { name: "Huge", type: "automation", writable: true, change_count: 1, changes: [], manual: [], undo_per_item: true },
  ] };
  const html = el.sourceList(action);
  assert.equal(html.split(el.t("sourceUndoPerItem")).length - 1, 1, "only the large source is flagged");
  assert.ok(html.indexOf("Huge") < html.indexOf(el.t("sourceUndoPerItem")));
  assert.ok(el.t("sourceUndoPerItem") !== "sourceUndoPerItem" && panel("de").el.t("sourceUndoPerItem").includes("Eintrag"));
});

test("typing in a search field changes the state at once and renders once after a pause", () => {
  const cancelled = new Set();
  const { el, shadow } = panel("en", { clearTimeout: id => cancelled.add(id) });
  el.view = "inventory";
  const queued = [];
  el.defer = fn => { queued.push(fn); return queued.length; };
  const input = { value: "" };
  shadow.querySelector = selector => (selector === "#query" ? input : null);
  el.render(); // binds the field
  let renders = 0;
  const render = el.render.bind(el);
  el.render = () => { renders += 1; render(); };
  for (const text of ["r", "ra", "rau"]) { input.value = text; input.oninput(); }
  assert.equal(el.query, "rau", "the state follows every key");
  assert.equal(renders, 0, "nothing is rebuilt while typing");
  assert.deepEqual([...cancelled], [1, 2], "each key cancels the pending render");
  queued[2]();
  assert.equal(renders, 1);
  assert.ok(shadow.innerHTML.includes('value="rau"'));
});

test("a re-render puts the focus back on the same control", () => {
  const { el, shadow } = panel("en");
  const field = { id: "query", getAttribute() {}, attributes: [], selectionStart: 3, selectionEnd: 5 };
  shadow.activeElement = field;
  assert.deepEqual({ ...el.captureFocus() }, { selector: "#query", start: 3, end: 5 });
  const button = { localName: "button", getAttribute() {}, attributes: [{ name: "class", value: "x" }, { name: "data-sortbtn", value: 'a"b' }], selectionStart: undefined };
  shadow.activeElement = button;
  assert.equal(el.captureFocus().selector, 'button[data-sortbtn="a\\"b"]');
  shadow.activeElement = { getAttribute() {}, attributes: [{ name: "class", value: "x" }] };
  assert.equal(el.captureFocus(), null, "controls without id or data attribute are left alone");

  const calls = [];
  const next = { focus: opts => calls.push(["focus", opts.preventScroll]), setSelectionRange: (a, b) => calls.push(["range", a, b]), disabled: false };
  shadow.querySelector = selector => (selector === "#query" ? next : null);
  el.restoreFocus({ selector: "#query", start: 3, end: 5 });
  assert.deepEqual(calls, [["focus", true], ["range", 3, 5]]);
  calls.length = 0;
  el.restoreFocus({ selector: "#gone", start: null, end: null });
  el.restoreFocus(null);
  assert.deepEqual(calls, []);
});

test("scan progress updates the button and the status line without rebuilding the page", () => {
  const { el, shadow } = panel("en");
  const button = { innerHTML: "", disabled: false };
  const live = { textContent: "" };
  shadow.querySelector = selector => (selector === "[data-action='scan']" ? button : selector === "[role='status']" ? live : null);
  el.busy = true; el.scanStatus = { running: true, progress: 42 };
  el.renderProgress();
  assert.ok(button.innerHTML.includes("Scanning") && button.innerHTML.includes("42%") && button.disabled === true);
  assert.ok(live.textContent.includes("42%"));
  assert.equal(shadow.innerHTML, "", "the page was not rendered");
  shadow.querySelector = () => null; // no heading on screen (detail view): fall back to a full render
  el.renderProgress();
  assert.ok(shadow.innerHTML.includes('class="shell"'));
});

test("derived lists follow the data: cache, search, ignore flag and edge index", () => {
  const { el } = panel("en");
  const first = el.filtered();
  assert.equal(el.filtered(), first, "the same filter returns the cached list");
  el.query = "b"; // matches B, not the two others
  assert.equal(JSON.stringify(el.filtered().map(o => o.object_id)), JSON.stringify(["sensor.b"]));
  el.query = "";
  const findings = el.sortedFindings().length;
  el.data.findings[0].ignored = true; el._rev += 1;
  assert.equal(el.sortedFindings().length, findings - 1);
  el.data.findings[0].ignored = false; el._rev += 1;

  el.data = { ...DATA, edges: [
    { source: "device:d", target: "entity:sensor.b", relation: "PROVIDES", confidence: "certain" },
    { source: "automation:automation.c", target: "entity:sensor.b", relation: "TRIGGERS_ON", confidence: "certain", location: "trigger[0]" },
  ] };
  assert.equal(JSON.stringify(el.edgesTo("entity:sensor.b").map(e => e.source)), JSON.stringify(["device:d", "automation:automation.c"]));
  assert.equal(JSON.stringify(el.edgesFrom("device:d").map(e => e.target)), JSON.stringify(["entity:sensor.b"]));
  assert.ok(el.edgeIndex().used.has("entity:sensor.b") && !el.edgeIndex().used.has("device:d"));
  // A device owns its entities, so what uses them is what breaks with the device.
  const impact = el.impact({ object_type: "device", object_id: "d" }, "device:d");
  assert.equal(JSON.stringify(impact.hits.map(h => h.key)), JSON.stringify(["automation:automation.c"]));
  assert.equal(impact.related, 1);
});

test("the navigation groups every view once, with settings at the foot", () => {
  const { NAV, NAV_GROUPS, TEXT } = loadPanel();
  const grouped = NAV_GROUPS.flatMap(([, views]) => [...views]);
  const expected = [...NAV].map(([view]) => view).filter(view => view !== "settings").sort();
  assert.equal(JSON.stringify([...grouped].sort()), JSON.stringify(expected), "every view except settings is in exactly one group");
  for (const lang of ["de", "en"]) for (const [label] of NAV_GROUPS) assert.ok(TEXT[lang][label], `${lang} ${label}`);
  const { el, shadow } = panel("en");
  el.view = "cleanup";
  el.render();
  const html = shadow.innerHTML;
  const menus = [...html.matchAll(/<div class="navmenu[^"]*"><button[^>]*data-menu="([^"]+)"/g)].map(m => m[1]);
  assert.equal(JSON.stringify(menus), JSON.stringify(["navGroupOperation", "navGroupExplore", "navGroupMaintain"]), "three menus after the direct entries");
  assert.ok(html.includes('<nav class="topnav" id="topnav" aria-label="Main navigation">'));
  const order = ["overview", "findingsNav", "changes", "inventory", "cleanup", "unreferenced", "batteries", "maintenance", "settings"].map(v => html.indexOf(`data-view="${v}"`));
  assert.ok(order.every((at, i) => at > 0 && (i === 0 || at > order[i - 1])), "views keep their order and settings comes last");
  assert.equal((html.match(/aria-current="page"/g) || []).length, 1, "one current entry");
  assert.ok(/data-view="cleanup"\s+aria-current="page"/.test(html));
  assert.ok(/class="nav menubtn group-active" data-menu="navGroupMaintain"/.test(html), "the menu holding the current view is marked");
});

const TREND = {
  available: true, baseline_at: "2026-10-07T09:00:00+00:00",
  new_findings: { total: 3, items: [
    { rule_id: "entity.state_missing", object_id: "sensor.new1", classification: "unavailable", ignored: false },
    { rule_id: "automation.missing_entity", object_id: "automation.new2", classification: "broken_reference", ignored: false },
    { rule_id: "automation.missing_entity", object_id: "automation.hidden", classification: "broken_reference", ignored: true },
  ] },
  resolved_findings: { total: 5, items: [] }, status_changes: { total: 2, items: [] }, new_objects: { total: 0, items: [] },
};

test("the overview starts with what needs doing, most urgent first", () => {
  const { el, shadow } = panel("en");
  const now = new Date().toISOString();
  el.data = {
    ...DATA,
    meta: { ...DATA.meta, scanned_at: new Date(Date.now() - 80 * 3.6e6).toISOString(), scan_interval_hours: 24, quarantine_days: 14 },
    objects: [...DATA.objects, { object_type: "config_entry", object_id: "e1", name: "Hub", status: "problem", domain: "hue", state: "setup_error" }],
    quarantine: [{ object_id: "sensor.old", object_type: "entity", since: new Date(Date.now() - 20 * 864e5).toISOString() }, { object_id: "sensor.fresh", object_type: "entity", since: now }],
  };
  el.trend = TREND;
  el.backup = { available: true, overall: "problem", checks: [{ id: "newest", level: "problem" }, { id: "emergency_kit", level: "note" }, { id: "last_run", level: "problem" }] };
  const keys = el.todoItems().map(i => i.key);
  assert.equal(JSON.stringify(keys), JSON.stringify(["integrations", "critical", "stale", "backup", "quarantine"]));
  const byKey = Object.fromEntries(el.todoItems().map(i => [i.key, i]));
  assert.equal(byKey.integrations.count, 1);
  assert.equal(byKey.critical.count, 2, "hidden findings and other classes do not count");
  assert.equal(byKey.quarantine.count, 1, "only entries past the quarantine period");
  assert.equal(byKey.backup.tone, "red");
  assert.equal(byKey.backup.hintText, "Latest backup, Last automatic run", "only the problems are named, not the notes");

  el.view = "overview"; el.render();
  const html = shadow.innerHTML;
  assert.ok(html.indexOf("What needs doing now?") > html.indexOf('class="summary"'), "the list comes after the key figures");
  assert.ok(html.indexOf('data-todo="integrations"') < html.indexOf('data-todo="critical"') && html.indexOf('data-todo="critical"') < html.indexOf('data-todo="stale"'));
  assert.ok(html.includes('data-jump="inventory" data-type="config_entry" data-status="problem"'));
  assert.ok(html.indexOf('class="summary"') < html.indexOf('class="ring') && html.indexOf('class="ring') < html.indexOf('data-jump="inventory" data-status'), "the health card is the first card of the statistics row");
});

test("jumping from a to-do row to the inventory sets its type and status filter", () => {
  const { el, shadow } = panel("en");
  const row = { dataset: { jump: "inventory", type: "config_entry", status: "problem" } };
  shadow.querySelectorAll = selector => (selector === "[data-jump]" ? [row] : []);
  el.render();
  el.statusFilter = "x"; el.typeFilter = "y";
  row.onclick();
  assert.equal(el.view, "inventory");
  assert.equal(el.typeFilter, "config_entry");
  assert.equal(el.statusFilter, "problem");
});

test("the detail page keeps a summary on top and builds only the open tab", () => {
  const { el, shadow } = panel("en");
  el.data = propertyData();
  const entity = el.data.objects.find(o => o.object_id === "light.kitchen");
  el.selected = entity; el.view = "detail"; el.details = new Map([[el.objectKey(entity), { attributes: { effect_marker: "zebra-77" } }]]);
  el.render();
  let html = shadow.innerHTML;
  const summary = html.slice(html.indexOf('class="panel sumline"'), html.indexOf('class="tabs"'));
  for (const text of ["Integration", "hue", "Device", "Küchenlampe", "Area", "Küche (Raum)", "Risk when removed"]) assert.ok(summary.includes(text), text);
  assert.ok(html.includes('role="tablist"') && html.includes('role="tabpanel"'));
  const tabs = [...html.matchAll(/data-detail-tab="(\w+)"/g)].map(m => m[1]);
  assert.equal(JSON.stringify(tabs), JSON.stringify(["overview", "relations", "technical", "attributes"]));
  assert.ok(/id="hk-tab-overview" aria-selected="true" aria-controls="hk-tabpanel" tabindex="0"/.test(html));
  assert.ok(/id="hk-tab-relations" aria-selected="false" aria-controls="hk-tabpanel" tabindex="-1"/.test(html), "roving tabindex");
  assert.ok(html.includes('class="panelhead"') && html.includes(el.t("facts")), "overview: diagnosis and facts");
  assert.ok(!html.includes("zebra-77") && !html.includes("u-1"), "other tabs are not built");

  html = detailTabsHtml(el, shadow, "attributes");
  assert.ok(html.includes("zebra-77"));
  html = detailTabsHtml(el, shadow, "relations");
  assert.ok(html.includes(el.t("relations") === "relations" ? "Relations" : el.t("relations")) || html.includes("hk-tabpanel"));
  assert.ok(!html.includes("zebra-77"));
  el.details = new Map(); // no attributes: no attributes tab, and a stale choice falls back to the overview
  el.detailTab = "attributes"; el.render();
  html = shadow.innerHTML;
  assert.ok(!html.includes('data-detail-tab="attributes"'));
  assert.ok(/id="hk-tab-overview" aria-selected="true"/.test(html));
});

test("detail tabs are chosen by click and arrow keys, and reset for another object", () => {
  const { el, shadow } = panel("en");
  el.data = propertyData();
  const entity = el.data.objects.find(o => o.object_id === "light.kitchen");
  el.selected = entity; el.view = "detail"; el.details = new Map();
  const buttons = ["overview", "relations", "technical"].map(id => ({ dataset: { detailTab: id } }));
  const focused = [];
  shadow.querySelectorAll = selector => (selector === "[data-detail-tab]" ? buttons : []);
  shadow.querySelector = selector => { const m = /^\[data-detail-tab="(\w+)"\]$/.exec(selector); return m ? { focus: () => focused.push(m[1]) } : null; };
  el.render();
  buttons[2].onclick();
  assert.equal(el.detailTab, "technical");
  const press = (button, key) => { const ev = { key, prevented: false, preventDefault() { this.prevented = true; } }; button.onkeydown(ev); return ev; };
  assert.ok(press(buttons[2], "ArrowRight").prevented);
  assert.equal(el.detailTab, "overview", "wraps around");
  press(buttons[0], "ArrowLeft");
  assert.equal(el.detailTab, "technical");
  press(buttons[2], "Home");
  assert.equal(el.detailTab, "overview");
  press(buttons[0], "End");
  assert.equal(el.detailTab, "technical");
  assert.equal(JSON.stringify(focused), JSON.stringify(["overview", "technical", "overview", "technical"]), "focus follows the arrow keys");
  assert.equal(focused.at(-1), "technical");
  assert.ok(!press(buttons[0], "a").prevented, "other keys are left alone");

  el.detailTab = "technical";
  const device = el.data.objects.find(o => o.object_id === "dev1");
  el.openObject(device);
  assert.equal(el.detailTab, "overview", "another object starts on the overview");
  el._pendingTab = "relations";
  el.openObject(entity);
  assert.equal(el.detailTab, "relations", "a deep link brings its tab");
  el.goBack();
  assert.equal(el.detailTab, "overview");
});

test("the address carries the selected detail tab and a deep link opens it", () => {
  const urls = [];
  const win = { location: { pathname: "/ha-housekeeper", search: "?object=entity%3Alight.kitchen&tab=technical" }, history: { state: null, replaceState: (_s, _t, url) => urls.push(url) } };
  const { el } = panel("en", { window: win });
  el.data = propertyData();
  el.isConnected = true; el._basePath = "/ha-housekeeper";
  el.applyUrl();
  assert.equal(el.selected.object_id, "light.kitchen");
  assert.equal(el.detailTab, "technical");
  el.syncUrl();
  assert.equal(urls.at(-1), "/ha-housekeeper?object=entity%3Alight.kitchen&tab=technical");
  el.detailTab = "overview";
  el.syncUrl();
  assert.equal(urls.at(-1), "/ha-housekeeper?object=entity%3Alight.kitchen", "the overview tab is the default and stays out of the address");
});

const stepStates = steps => steps.map(s => `${s.id.replace("step", "")}:${s.state}`).join(" ");
const act = (kind, extra = {}) => ({ kind, object_id: `sensor.${kind}`, name: kind, verdict: "ok", executable: true, reasons: [], used_by: [], ...extra });
const planOf = (status, actions, extra = {}) => ({ plan_id: "p1", created_at: "2026-10-07T10:00:00+00:00", status, executed: false, summary: { total: actions.length, ok: actions.length, review: 0, blocked: 0 }, actions, ...extra });

test("the plan card shows the steps with text, marks undo kinds and folds the details", () => {
  const { el } = panel("en");
  el.data = { ...DATA, objects: [], edges: [], findings: [], quarantine: [] };
  const plan = planOf("verified", [
    act("disable_entity"),
    act("migrate_meter", { object_id: "sensor.old_meter", target: "sensor.new_meter", sources: [] }),
    act("remove_entity", { executable: false, verdict: "blocked", reasons: ["used_certain"], used_by: [{ source: "automation:automation.a", relation: "TARGETS", confidence: "certain" }] }),
  ], { backup: { job_id: "job-9", at: "2026-10-07T10:05:00+00:00" }, verification: { ok: true, checks: [] } });
  const html = el.planCard(plan);
  assert.ok(html.indexOf('<ol class="steps"') < html.indexOf('class="row planrow'), "the steps come before the actions");
  assert.equal((html.match(/aria-current="step"/g) || []).length, 0, "a finished plan has no current step");
  assert.ok(html.includes('<span class="sr-only">: done</span>') && html.includes('<span class="sr-only">: not needed</span>') === false);
  assert.ok(html.includes("Created") && html.includes(el.t("backupRestoreHint")));
  assert.equal((html.match(/Undo by Housekeeper/g) || []).length, 1);
  assert.equal((html.match(/Backup only/g) || []).length, 1, "merged statistics can only be restored from the backup");
  assert.equal((html.match(/<details class="rowdetails">/g) || []).length, 2, "the meter detail and the uses fold; the plain disable row has none");
  const open = el.planCard(planOf("dry_run", [act("disable_entity")]));
  assert.equal((open.match(/aria-current="step"/g) || []).length, 1);
  assert.ok(open.includes('<span class="sr-only">: not needed</span>') && open.includes('<span class="sr-only">: current</span>') && open.includes('<span class="sr-only">: pending</span>'));
  assert.ok(open.includes("Not needed: everything can be taken back by Housekeeper"));
  for (const lang of ["de", "en"]) {
    const text = panel(lang).el.t.bind(panel(lang).el);
    for (const key of ["stepsLabel", "stepSelect", "stepAnalysis", "stepConfirm", "stepBackup", "stepRun", "stepVerify", "stepDone", "stepCurrent", "stepTodo", "stepSkipped", "stepFailed", "undoHousekeeper", "undoBackupOnly", "backupRestoreHint", "planDetails"]) assert.notEqual(text(key), key, `${lang} ${key}`);
  }
});

const graphData = () => {
  const obj = (object_type, object_id, name, status = "active", extra = {}) => ({ object_type, object_id, name, status, ...extra });
  const edge = (source, target, relation, confidence = "certain") => ({ source, target, relation, confidence });
  return { ...DATA, findings: [],
    objects: [obj("config_entry", "C", "Hub Eintrag"), obj("device", "D", "Gerät D"), obj("entity", "sensor.e", "Sensor E", "orphaned", { device_id: "D" }),
      obj("automation", "automation.a", "Automation A"), obj("script", "script.s", "Skript S"), obj("automation", "automation.b", "Automation B")],
    edges: [
      edge("config_entry:C", "device:D", "OWNS"), edge("device:D", "entity:sensor.e", "PROVIDES"),
      edge("automation:automation.a", "entity:sensor.e", "TRIGGERS_ON"), edge("script:script.s", "entity:sensor.e", "REFERENCES", "probable"),
      edge("automation:automation.b", "script:script.s", "TARGETS"), edge("script:script.s", "automation:automation.a", "TARGETS"),
      edge("entity:sensor.e", "entity:sensor.gone", "REFERENCES"),
    ] };
};
const graphPanel = (lang = "en", pref = "graph") => {
  const env = panel(lang);
  env.el.data = graphData();
  env.el.prefs = { ...env.el.prefs, graphMode: pref };
  env.el.graphSelected = env.el.findObject("entity:sensor.e");
  env.el.view = "graph";
  return env;
};
const keysOf = levels => levels.map(level => level.map(n => n.key).sort().join(","));

test("the graph model walks origin to the left and users to the right, level by level", () => {
  const { el } = graphPanel();
  const item = el.graphSelected, key = "entity:sensor.e";
  const one = el.graphModel(item, key, { depth: 1 });
  assert.equal(JSON.stringify(keysOf(one.left)), JSON.stringify(["device:D"]));
  assert.equal(JSON.stringify(keysOf(one.right)), JSON.stringify(["automation:automation.a,entity:sensor.gone,script:script.s"]));
  assert.equal(one.missing, 1, "the target without an object is counted");
  assert.equal(one.probable, 1);
  const three = el.graphModel(item, key, { depth: 3 });
  assert.equal(JSON.stringify(keysOf(three.left)), JSON.stringify(["device:D", "config_entry:C"]));
  assert.equal(JSON.stringify(keysOf(three.right)), JSON.stringify(["automation:automation.a,entity:sensor.gone,script:script.s", "automation:automation.b"]));
  assert.equal(three.cycles, 1, "script S targets automation A, which already stands one level closer");
  assert.equal(three.count, 6);
  assert.equal(three.hidden, 0);
  assert.equal(three.right[1][0].via, "in");
});

test("graph filters by relation and certainty, and limits the nodes", () => {
  const { el } = graphPanel();
  const item = el.graphSelected, key = "entity:sensor.e";
  const trig = el.graphModel(item, key, { depth: 3, relation: "TRIGGERS_ON" });
  assert.equal(JSON.stringify(keysOf(trig.right)), JSON.stringify(["automation:automation.a"]));
  assert.equal(trig.left.length, 0, "the origin edge is filtered too");
  const sure = el.graphModel(item, key, { depth: 3, certainOnly: true });
  // The probable edge from script S is gone; S is still reached, one level later, over its certain edge to automation A.
  assert.equal(JSON.stringify(keysOf(sure.right)), JSON.stringify(["automation:automation.a,entity:sensor.gone", "script:script.s", "automation:automation.b"]));
  assert.equal(sure.probable, 0);
  const small = el.graphModel(item, key, { depth: 3, limit: 1 });
  assert.equal(small.right.flat().length, 1);
  assert.ok(small.hidden >= 2, "what does not fit is counted");
  assert.ok(small.edges.every(e => [...small.left.flat(), ...small.right.flat()].some(n => n.key === e.from) || e.from === key));
});

test("five or more leaf nodes of one type fold into one node that opens on a click", () => {
  const { el, shadow } = graphPanel();
  const data = graphData();
  for (let i = 0; i < 6; i++) {
    data.objects.push({ object_type: "automation", object_id: `automation.x${i}`, name: `X${i}`, status: "active" });
    data.edges.push({ source: `automation:automation.x${i}`, target: "entity:sensor.e", relation: "TRIGGERS_ON", confidence: "certain" });
  }
  el.data = data;
  const folded = el.graphModel(el.graphSelected, "entity:sensor.e", { depth: 1 });
  const node = folded.right[0].find(n => n.group);
  assert.equal(node.group.length, 7, "the six new automations and automation A");
  assert.ok(folded.edges.every(e => !e.from.startsWith("automation:automation.x")), "edges end at the group");
  el.graphDepth = 1;
  el.render();
  assert.ok(shadow.innerHTML.includes('data-graph-group="'));
  const id = node.key.slice(6);
  const open = el.graphModel(el.graphSelected, "entity:sensor.e", { depth: 1, open: new Set([id]) });
  assert.equal(open.right[0].filter(n => n.group).length, 0);
});

test("the sort and filter of a list come back, the search text does not; findings can be selected", () => {
  const storage = fakeStorage();
  const { el, shadow } = panel("en", { localStorage: storage });
  el.lvState("demo", "name", "asc");
  el.lv.demo.sort = "since"; el.lv.demo.dir = "desc"; el.lv.demo.q = "abc"; el.lv.demo.f.type = "x";
  el.persistLv("demo");
  const again = panel("en", { localStorage: storage }).el.lvState("demo", "name", "asc");
  assert.equal(`${again.sort}|${again.dir}|${again.q}|${again.f.type}`, "since|desc||x");
  el.data = { ...DATA, findings: [{ ...DATA.findings[0], key: "k1" }] };
  el.view = "findingsNav"; el.findSel = new Set(["k1"]);
  el.render();
  assert.ok(shadow.innerHTML.includes('data-fsel="k1" checked') && shadow.innerHTML.includes("data-fsel-hide"));
  assert.equal(el.exportRows().length, 1);
});

test("blueprints tab, notification switch, diagnostics without names and the weekly report", async () => {
  const { el, shadow, downloads } = panel("en");
  el.view = "maintenance"; el.viewTab = { maintenance: "blueprints" };
  el.blueprints = { available: true, unused: 1, missing: 1, broken: 0, domains: [
    { domain: "automation", total: 2, unused: [{ path: "a/idle.yaml", name: "Idle" }], missing: [{ path: "a/gone.yaml", users: [{ id: "automation.c", name: "C" }], count: 1 }], broken: [] },
    { domain: "script", total: 0, unused: [], missing: [], broken: [] }] };
  el._blueprintsRequested = true;
  el.render();
  assert.ok(shadow.innerHTML.includes("a/gone.yaml") && shadow.innerHTML.includes("Idle") && shadow.innerHTML.includes("data-bp-refresh"));
  el.view = "settings"; el.settingsTab = "scan";
  el.data = { ...DATA, meta: { ...DATA.meta, notify: true } };
  el.render();
  assert.ok(/data-notify checked/.test(shadow.innerHTML));
  const diag = JSON.stringify(el.diagnosticsData());
  assert.ok(!diag.includes("sensor.a") && diag.includes("findings_by_rule"), "numbers only, no ids");
  el.data = DATA;
  el.compare = { available: true, baseline_at: "2026-10-01T00:00:00+00:00", baselines: [], status_changes: { total: 0, items: [] }, new_findings: { total: 1, items: [DATA.findings[0]] }, resolved_findings: { total: 0, items: [] }, new_objects: { total: 0, items: [] }, removed_objects: { total: 0, items: [] } };
  await el.weeklyReport();
  assert.ok(downloads.at(-1).text.includes("# Housekeeper report") && downloads.at(-1).text.includes("sensor.a"));
});

test("orphaned statistics can be selected and deleted only after typing the word; replacements get successor hints", async () => {
  const { el, shadow } = panel("en");
  const orphans = [{ statistic_id: "sensor.old_power", unit: "W", has_mean: true, in_energy: false }, { statistic_id: "sensor.grid", unit: "kWh", has_sum: true, in_energy: true }];
  el.data = { ...DATA, meta: { ...DATA.meta, recorder_available: true }, orphaned_statistics: orphans,
    objects: [...DATA.objects, { object_type: "entity", object_id: "sensor.new_power", name: "N", status: "active", unit: "W" }] };
  el.view = "unreferenced"; el.unrefTab = "statistics"; el._orphanLastRequested = true;
  el.render();
  assert.ok(shadow.innerHTML.includes('data-psel="sensor.old_power"') && !shadow.innerHTML.includes('data-psel="sensor.grid"'), "an Energy series cannot be picked");
  el.purgeSel.add("sensor.old_power"); el.purgeOpen = true;
  el.render();
  assert.ok(/data-purge-run disabled/.test(shadow.innerHTML), "disabled until the word is typed");
  el.purgeWord = "DELETE";
  el.render();
  assert.ok(!/data-purge-run disabled/.test(shadow.innerHTML));
  const asked = [];
  el._hass = { language: "en", callWS: async msg => { asked.push(msg); return { removed: ["sensor.old_power"], skipped: [], backup: true }; } };
  el.load = async () => {};
  await el.purgeRun();
  assert.equal(JSON.stringify(asked[0]), JSON.stringify({ type: "ha_housekeeper/purge_statistics", statistic_ids: ["sensor.old_power"], states: false, confirmed: true }));
  assert.equal(el.purgeSel.size, 0);
  assert.equal(el.successorsOf("sensor.power_new", "W")[0].object_id, "sensor.new_power");
});

test("the layout puts levels in columns without overlapping nodes", () => {
  const { el } = graphPanel();
  const model = el.graphModel(el.graphSelected, "entity:sensor.e", { depth: 3 });
  const layout = el.graphLayout(model), x = key => layout.at.get(key).x;
  assert.ok(x("config_entry:C") < x("device:D") && x("device:D") < x("entity:sensor.e") && x("entity:sensor.e") < x("script:script.s") && x("script:script.s") < x("automation:automation.b"));
  const boxes = [...layout.at.values()];
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j];
    assert.ok(a.x + layout.W <= b.x || b.x + layout.W <= a.x || a.y + layout.H <= b.y || b.y + layout.H <= a.y, "no two nodes overlap");
  }
  assert.ok(boxes.every(b => b.y >= 0 && b.y + layout.H <= layout.height + 0.001));
});

test("edges that share a side of a node leave it at different heights", () => {
  const { el, shadow } = graphPanel();
  el.graphDepth = 3;
  el.render();
  const starts = [...shadow.innerHTML.matchAll(/<path class="gedge[^"]*" d="M([\d.]+),([\d.]+) /g)].map(m => `${m[1]},${m[2]}`);
  assert.ok(starts.length > 1);
  const ends = [...shadow.innerHTML.matchAll(/ ([\d.]+),([\d.]+)" (?:marker-end|marker-start)/g)].map(m => `${m[1]},${m[2]}`);
  const both = [...starts, ...ends], rep = both.filter((x, i) => both.indexOf(x) !== i);
  assert.equal(rep.length, 0, "no two edge ends coincide");
});

test("a long journal and long relation groups get a search box", () => {
  const { el, shadow } = panel("en");
  el.data = { ...DATA, objects: [], edges: [], findings: [], quarantine: [] };
  el.view = "cleanup";
  el.journal = Array.from({ length: 8 }, (_, i) => ({ plan_id: `p${i}`, created_at: `2026-10-0${i + 1}T10:00:00+00:00`, status: "verified", summary: { total: 1, ok: 1, review: 0, blocked: 0 } }));
  el.render();
  assert.ok(shadow.innerHTML.includes('data-lq="journal"'));
  el.lv.journal.q = "zzz";
  el.render();
  assert.ok(!shadow.innerHTML.includes("data-plan-open="));
});

test("the graph is an SVG with focusable nodes, edge directions and text for what colour shows", () => {
  const { el, shadow } = graphPanel();
  el.graphDepth = 3;
  el.render();
  const html = shadow.innerHTML;
  assert.ok(html.includes('<svg class="graphsvg" role="group" aria-label="Dependency graph of'));
  assert.equal((html.match(/<g class="gnode[^"]*" data-graph="[^"]+" tabindex="0" role="button"/g) || []).length, 6, "every node but the centre can be opened with the keyboard");
  assert.equal((html.match(/class="gnode center"/g) || []).length, 1);
  assert.ok(html.includes("Orphaned") || html.includes("Verwaist") || /Entity · \w+/.test(html), "status stands in the node as text");
  assert.ok(html.includes("missing") && html.includes('class="gnode missing"'), "a missing target is marked and says so");
  assert.ok(/class="gedge prob"/.test(html) && /class="gedge cycle"/.test(html));
  // device D provides E (left to right): the arrow is at the right end; automation A triggers on E (right to left): at the left end
  const device = /<path class="gedge" d="[^"]+" marker-end="url\(#hk-arrow\)"><title>device:D → entity:sensor.e/.test(html);
  const automation = /<path class="gedge" d="[^"]+" marker-start="url\(#hk-arrow\)"><title>automation:automation.a → entity:sensor.e/.test(html);
  assert.ok(device && automation, "arrows follow the direction of the data");
  assert.ok(html.includes("Missing targets: 1") && html.includes("Probable relations: 1") && html.includes("Cycles: 1"));
  assert.ok(html.includes("Solid: certain"));
});

test("the graph bar switches between list and graph, sets depth and filters", () => {
  const { el, shadow } = graphPanel("en", "list");
  el.render();
  let html = shadow.innerHTML;
  assert.ok(html.includes('data-pref="graphMode|graph"') && html.includes('aria-pressed="false"'));
  assert.ok(!html.includes('<svg class="graphsvg"') && html.includes('<div class="path">'), "the list is the default");
  el.prefs = { ...el.prefs, graphMode: "graph" };
  el.render();
  html = shadow.innerHTML;
  assert.ok(html.includes('<svg class="graphsvg"') && !html.includes('<div class="path">'));
  for (const text of ["Levels", "All relations", "Certain only", "What breaks when removed?"]) assert.ok(html.includes(text), text);
  assert.ok(html.includes('<option value="TRIGGERS_ON"'), "the relation filter lists the relations that exist");

  const depthButtons = [1, 2, 3].map(n => ({ dataset: { graphDepth: String(n) } }));
  const select = id => ({ value: "" });
  const relation = select(), conf = select(), more = {}, impact = {};
  shadow.querySelectorAll = selector => (selector === "[data-graph-depth]" ? depthButtons : []);
  shadow.querySelector = selector => ({ "#graphRel": relation, "#graphConf": conf, "[data-graph-impact]": { addEventListener: (_, fn) => { impact.fn = fn; } }, "[data-graph-more]": { addEventListener: (_, fn) => { more.fn = fn; } } }[selector] || null);
  el.render();
  depthButtons[2].onclick();
  assert.equal(el.graphDepth, 3);
  relation.value = "TRIGGERS_ON"; relation.onchange();
  assert.equal(el.graphRel, "TRIGGERS_ON");
  conf.value = "certain"; conf.onchange();
  assert.equal(el.graphConf, "certain");
  impact.fn();
  assert.equal(el.graphImpact, true);
  more.fn();
  assert.equal(el.graphLimit, 80);
});

test("on a narrow screen only the list is offered", () => {
  const { el, shadow } = graphPanel("en", "graph");
  const narrow = { matchMedia: () => ({ matches: false }) };
  const env = panel("en", narrow);
  env.el.data = graphData(); env.el.prefs = { ...env.el.prefs, graphMode: "graph" }; env.el.graphSelected = env.el.findObject("entity:sensor.e"); env.el.view = "graph";
  assert.equal(env.el.canGraph(), false);
  env.el.render();
  assert.ok(!env.shadow.innerHTML.includes('<svg class="graphsvg"') && env.shadow.innerHTML.includes('<div class="path">'));
  assert.ok(!env.shadow.innerHTML.includes("graphMode|"), "no switch without room for the graph");
  assert.equal(el.canGraph(), true);
  assert.ok(shadow !== undefined);
});

test("what breaks when the object is removed is highlighted, others fade", () => {
  const { el, shadow } = graphPanel();
  el.graphDepth = 2; el.graphImpact = true;
  el.render();
  const html = shadow.innerHTML;
  assert.ok(/<g class="gnode hit" data-graph="automation:automation.a"/.test(html) && /aria-label="Automation: Automation A, [^"]*breaks"/.test(html));
  assert.ok(/<g class="gnode gdim" data-graph="device:D"/.test(html));
  assert.ok(/class="gedge hit"/.test(html));
  const auto = graphPanel();
  auto.el.graphSelected = auto.el.findObject("automation:automation.a");
  auto.el.render();
  assert.ok(!auto.shadow.innerHTML.includes("data-graph-impact"), "nothing breaks when an automation goes: no button");
});

test("graph nodes open with Enter and Space and recentre the graph", () => {
  const { el, shadow } = graphPanel();
  const node = { dataset: { graph: "automation:automation.a" } };
  node.target = node;
  shadow.querySelectorAll = selector => (selector === "tr[data-object], g[data-graph]" ? [node] : selector === "[data-graph]" ? [node] : []);
  el.render();
  assert.equal(typeof node.onclick, "function");
  const ev = { key: "Enter", target: node, preventDefault() { this.prevented = true; } };
  node.onkeydown(ev);
  assert.ok(ev.prevented);
  assert.equal(el.graphSelected.object_id, "automation.a", "SVG nodes have no click(), so the handler is called directly");
  assert.equal(el.graphLimit, 40);
});

test("a large installation renders every view within generous time limits", () => {
  const { el } = panel("en");
  el.data = makeLoadFixture(8000);
  const views = ["overview", "inventory", "findingsNav", "unreferenced", "cleanup", "graph", "changes", "batteries"];
  const timings = {};
  for (const view of views) {
    el.view = view; el.pages = {};
    const started = performance.now();
    el.render();
    timings[view] = performance.now() - started;
  }
  // Limits are far above what a run takes (a few milliseconds) so only a real regression trips them.
  for (const [view, ms] of Object.entries(timings)) assert.ok(ms < 1500, `${view} took ${Math.round(ms)} ms`);
  // The expensive parts are cached: a second render of the same list is cheap.
  el.view = "inventory";
  const again = performance.now();
  el.render();
  assert.ok(performance.now() - again < 500);
  // Detail, relations and impact of one object stay fast with 8,000 objects and their edges.
  const entity = el.data.objects.find(o => o.object_type === "device");
  const started = performance.now();
  el.selected = entity; el.details = new Map(); el.detailTab = "relations"; el.render();
  el.detailTab = "overview"; el.render();
  assert.ok(performance.now() - started < 1500, "an object page");
  const graph = performance.now();
  el.selected = null; el.view = "graph"; el.graphSelected = entity; el.prefs = { ...el.prefs, graphMode: "graph" }; el.graphDepth = 3; el.render();
  assert.ok(performance.now() - graph < 1500, "the graph");
});

test("the whole confirmation flow works end to end against a scripted backend", async () => {
  const sent = [], snapshots = [];
  const action = { kind: "remove_entity", object_id: "sensor.old", name: "Old", verdict: "ok", executable: true, reasons: [], used_by: [] };
  const plan = (status, extra = {}) => ({ plan_id: "p1", created_at: "2026-10-07T10:00:00+00:00", status, executed: status !== "dry_run", summary: { total: 1, ok: 1, review: 0, blocked: 0 }, actions: [{ ...action, ...(extra.result ? { result: extra.result } : {}) }], ...(extra.plan || {}) });
  const statuses = [
    { progress: { running: true, phase: "backup" }, plan: plan("backup") },
    { progress: { running: true, phase: "running", done: 0, total: 1 }, plan: plan("running", { plan: { backup: { job_id: "j1", at: "2026-10-07T10:01:00+00:00" } } }) },
    { progress: { running: false }, plan: plan("verified", { result: { state: "done" }, plan: { backup: { job_id: "j1", at: "2026-10-07T10:01:00+00:00" }, verification: { ok: true, checks: [] } } }) },
  ];
  let undone = false;
  const { el, shadow } = panel("en", { setTimeout: fn => { fn(); return 0; } });
  el.data = { ...DATA, objects: [...DATA.objects, { object_type: "entity", object_id: "sensor.old", name: "Old", status: "disabled" }] };
  el._hass = { language: "en", callWS: async msg => {
    sent.push(msg.type.replace("ha_housekeeper/", ""));
    switch (msg.type) {
      case "ha_housekeeper/plan_create": return plan("dry_run");
      case "ha_housekeeper/plan_confirm": return { plan_id: "p1", token: "tok", execute: ["sensor.old"], needs_acknowledgement: [] };
      case "ha_housekeeper/plan_execute": assert.equal(msg.token, "tok"); return { started: true };
      case "ha_housekeeper/plan_status":
        if (undone) return { progress: { running: false }, plan: plan("undone", { result: { state: "undone" }, plan: { backup: { job_id: "j1", at: "2026-10-07T10:01:00+00:00" }, verification: { ok: true, checks: [] } } }) };
        return statuses.shift() || statuses.at(-1);
      case "ha_housekeeper/plan_undo": undone = true; return { results: [{ object_id: "sensor.old", outcome: "undone" }], status: "undone" };
      default: return el.data;
    } } };
  const render = el.render.bind(el);
  el.render = () => {
    render();
    if (el.plan) snapshots.push({ steps: stepStates(el.planSteps(el.plan, Boolean(el.confirmation))), live: el.liveStatus(), scanDisabled: el.cleanupRunning() });
  };
  el.view = "cleanup"; el.cleanupKind = "remove_entity"; el.cleanupSel = new Set(["sensor.old"]);

  await el.createPlan();
  assert.equal(el.plan.status, "dry_run");
  assert.ok(shadow.innerHTML.includes("data-plan-confirm"), "the plan asks for confirmation");
  assert.equal(stepStates(el.planSteps(el.plan, false)), "Select:done Analysis:current Confirm:todo Backup:todo Run:todo Verify:todo");

  await el.confirmPlan();
  assert.equal(el.confirmation.token, "tok");
  assert.ok(shadow.innerHTML.includes("data-confirm-word") && /data-plan-execute\s+disabled/.test(shadow.innerHTML), "running stays locked until the word is typed");
  el.confirmWord = el.planWord(el.plan);
  el.render();
  assert.ok(!/data-plan-execute\s+disabled/.test(shadow.innerHTML));

  await el.executePlan();
  for (let i = 0; i < 100 && el._polling; i++) await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(el._polling, null, "polling ended");
  assert.equal(el.plan.status, "verified");
  const seen = snapshots.map(s => s.steps);
  assert.ok(seen.includes("Select:done Analysis:done Confirm:done Backup:current Run:todo Verify:todo"), "the backup step was shown while it ran");
  assert.ok(seen.some(s => s.includes("Backup:done Run:current")), "then the run");
  assert.equal(seen.at(-1), "Select:done Analysis:done Confirm:done Backup:done Run:done Verify:done");
  assert.ok(snapshots.some(s => s.live.includes("Backup running")) && snapshots.some(s => s.scanDisabled), "screen readers and the scan button follow the run");
  assert.equal(JSON.stringify(sent.filter(type => type !== "plan_list").slice(0, 7)), JSON.stringify(["plan_create", "plan_confirm", "plan_execute", "plan_status", "plan_status", "plan_status", "inventory"]));
  assert.ok(shadow.innerHTML.includes("data-undo-all") && shadow.innerHTML.includes("Created"), "undo and the backup record are offered");

  await el.undoPlan();
  assert.equal(el.plan.status, "undone");
  assert.ok(el.undoMessage.includes("sensor.old: restored"));
  assert.ok(!el.cleanupRunning());
});

const RELIABILITY = {
  available: true, busy: false, cached: false, took_ms: 2800, window_days: 7,
  entries: [
    { entry_id: "e1", title: "Cloud <b>Hub</b>", domain: "hue", state: "setup_retry", reauth: true, entities: 12, permanent: 2, availability: 93.4, shared_outages: 3, longest_outage: 7200, layer: "cloud", last_disruption: { end: 1791470000, seconds: 3600, shared: true } },
    { entry_id: "e2", title: "Local Box", domain: "zha", state: "loaded", reauth: false, entities: 5, permanent: 0, availability: 100, shared_outages: 0, longest_outage: 0, layer: null, last_disruption: null },
  ],
};

test("the reliability view lists the worst integration first with numbers, words and the guessed layer", async () => {
  const { el, shadow } = panel("en");
  el.data = DATA; el.view = "reliability";
  el._hass = { language: "en", callWS: async () => RELIABILITY };
  el.render();
  assert.ok(shadow.innerHTML.includes("Evaluating the recorder"));
  await el.loadReliability();
  const html = shadow.innerHTML;
  for (const text of ["Integrations by availability", "Cloud &lt;b&gt;Hub&lt;/b&gt;", "93.4 %", "12 entities", "2 down all the time, not counted",
    "3 shared outages, longest 2 h", "probably the cloud or its API (a guess)", "Re-authentication open", "setup_retry", "Last shared outage until",
    "No disruption", "calculated in 2.8 s", "24 hours", "7 days"]) assert.ok(html.includes(text), text);
  assert.ok(html.indexOf("Cloud &lt;b&gt;") < html.indexOf("Local Box"));
  assert.ok(!html.includes("<b>Hub</b>"));
});

test("reliability rows open the integration, and its detail page shows the numbers with the affected entities", async () => {
  const { el, shadow } = panel("en");
  const entry = { object_type: "config_entry", object_id: "e1", name: "Hue", status: "active", state: "loaded", domain: "hue" };
  el.data = { ...DATA, objects: [...DATA.objects.filter(o => o.object_type !== "config_entry"), entry] };
  el.view = "reliability";
  const withEntities = { ...RELIABILITY, computed_at: 1791470000, entries: [{ ...RELIABILITY.entries[0], affected_total: 20, affected: [{ entity_id: "light.a", name: "Lamp <i>A</i>", availability: 91.2 }] }, RELIABILITY.entries[1]] };
  el._hass = { language: "en", callWS: async () => withEntities };
  await el.loadReliability();
  const list = shadow.innerHTML;
  assert.ok(list.includes('<button class="row rel" data-object="config_entry:e1">'), "known entries open");
  assert.ok(!list.includes('data-object="config_entry:e2"'), "unknown entries stay plain rows");
  el.selected = entry; el.view = "detail"; el.detailTab = "reliability";
  el.render();
  const html = shadow.innerHTML;
  assert.ok(html.includes('data-detail-tab="reliability"'));
  for (const text of ["Entities with downtime (20)", "Lamp &lt;i&gt;A&lt;/i&gt;", "91.2 %", 'data-object="entity:light.a"', "Showing the 1 with the lowest availability of 20"]) assert.ok(html.includes(text), text);
  const facts = el.factsCard(entry, "config_entry:e1");
  assert.ok(facts.includes("Availability (7 days)") && facts.includes("93.4 %"));
  el.selected = { ...entry, object_id: "e3" }; el.detailTab = "reliability"; el.render();
  assert.ok(!shadow.innerHTML.includes('data-detail-tab="reliability"'), "no tab without numbers");
});

test("an old reliability reply is shown at once and renewed once in the background", async () => {
  const calls = [];
  const { el, shadow } = panel("en");
  el.data = DATA; el.view = "reliability";
  el._hass = { language: "en", callWS: async msg => { calls.push({ ...msg }); return msg.refresh ? { ...RELIABILITY, stale: false } : { ...RELIABILITY, stale: true, age_seconds: 3600, computed_at: 1791470000 }; } };
  await el.loadReliability();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(JSON.stringify(calls.map(c => c.refresh)), "[false,true]", "one renewal, no loop");
  assert.ok(!el.reliability.stale);
  el.reliability = { ...RELIABILITY, stale: true, age_seconds: 3600, computed_at: 1791470000 };
  assert.ok(el.reliabilityView().includes("As of "), "the age is named");
});

test("the reliability window switch and refresh ask the backend with the right arguments, once per window", async () => {
  const queue = [];
  const { el } = panel("en", { setTimeout: fn => { queue.push(fn); return 0; } });
  const calls = [];
  el._hass.callWS = async msg => { calls.push(msg); return RELIABILITY; };
  const drain = async () => { while (queue.length) await queue.shift()(); };
  el.data = DATA; el.view = "reliability";
  el.ensureReliability(); el.ensureReliability(); el.render();
  await drain();
  assert.equal(calls.length, 1);
  assert.deepEqual({ ...calls[0] }, { type: "ha_housekeeper/reliability", window_days: 7, refresh: false });
  el.relWindow = 1; el.ensureReliability(); await drain();
  assert.equal(calls[1].window_days, 1);
  await el.loadReliability(true);
  assert.equal(calls[2].refresh, true);
});

const UNSTABLE = {
  total: 31, items: [
    { entity_id: "sensor.<b>x</b>", name: "Flatter <i>1</i>", entry_id: "e1", entry_title: "Zigbee", episodes: 12, per_day: 1.7, total_seconds: 4800, mean_seconds: 400, level: "flapping", pattern_hour: 23, used: 2 },
    { entity_id: "sensor.y", name: "Wackler", entry_id: "e1", entry_title: null, episodes: 4, per_day: 0.6, total_seconds: 120, mean_seconds: 30, level: "unstable", pattern_hour: null, used: 0 },
  ],
};

const RUNS = {
  schema: 1, window_days: 7, since: "2026-10-01T08:00:00+00:00", total: 3,
  items: [
    { object_type: "automation", entity_id: "automation.flur", name: "Flur <b>Licht</b>", status: "active", runs: 48, ok: 30, errors: 18, conditions: 0, mean_ms: 1200, max_ms: 95000, per_day: [2, 5, 8, 9, 7, 9, 8], lower_bound: true,
      findings: [{ kind: "failing", level: "warn", errors: 18, runs: 48, step: "action/2", step_count: 12 }, { kind: "long_wait", level: "info", seconds: 600 },
        { kind: "after_update", level: "warn", event: "ha_version", to: "2026.10.0", rate_before: 5, rate_after: 40 }] },
    { object_type: "script", entity_id: "script.nacht", name: "Nacht", status: "active", runs: 6, ok: 0, errors: 6, conditions: 0, mean_ms: null, max_ms: null, per_day: [0, 0, 1, 2, 1, 1, 1], lower_bound: false,
      findings: [{ kind: "never_ok", level: "red", runs: 6 }] },
    { object_type: "automation", entity_id: "automation.heizung", name: "Heizung", status: "active", runs: 140, ok: 140, errors: 0, conditions: 0, mean_ms: 300, max_ms: 900, per_day: [20, 20, 20, 20, 20, 20, 20], lower_bound: false, findings: [] },
  ],
};

test("the runs view loads once per visit and counts again on request", async () => {
  const queue = [];
  const { el } = panel("en", { setTimeout: fn => { queue.push(fn); return 0; } });
  const calls = [];
  el._hass.callWS = async msg => { calls.push(msg); return RUNS; };
  const drain = async () => { while (queue.length) await queue.shift()(); };
  el.data = DATA; el.view = "runs";
  el.ensureRuns(); el.ensureRuns(); el.render();
  await drain();
  assert.equal(calls.length, 1);
  assert.deepEqual({ ...calls[0] }, { type: "ha_housekeeper/automation_runs" });
  await el.loadRuns();
  assert.equal(calls.length, 2);
});

test("conflicts and loops show their stage and escape names", () => {
  const { el } = panel("en");
  const html = el.conflictsPanel({ conflicts: { items: [
    { kind: "opposing", stage: "confirmed", days: 3, entity_id: "light.hall", automations: [{ entity_id: "automation.on", name: "On <i>x</i>" }, { entity_id: "automation.off", name: "Off" }], commands: ["light.turn_on", "light.turn_off"], reason: "trigger", detail: "sensor.door" },
    { kind: "loop", stage: "static", days: 0, entities: ["sensor.x", "sensor.y"], automations: [{ entity_id: "automation.a", name: "A" }] }] } });
  assert.ok(html.includes("repeated") && html.includes("possible") && html.includes("sensor.x</code> → <code>sensor.y"));
  assert.ok(!html.includes("<i>x</i>") && html.includes('data-object="automation:automation.on"'));
  assert.equal(el.conflictsPanel({}), "");
});

test("the graph goes back one node at a time, then to the page it was opened from", () => {
  const { el, shadow } = panel("en");
  const a = { object_type: "entity", object_id: "sensor.a", name: "Alpha", status: "active" };
  const b = { object_type: "entity", object_id: "sensor.b", name: "Beta", status: "active" };
  const c = { object_type: "entity", object_id: "sensor.c", name: "Gamma", status: "active" };
  el.data = { ...DATA, objects: [...DATA.objects, a, b, c] };
  el.selected = a; el.view = "detail"; el.detailTab = "technical";
  el.openGraph(a);
  assert.equal(el.view, "graph"); assert.equal(el.selected, null);
  assert.equal(el.graphBackLabel(), "Alpha", "the first back goes to the detail page");
  el.noteGraphStep(b); el.graphSelected = b;
  el.noteGraphStep(c); el.graphSelected = c;
  assert.equal(el.graphBackLabel(), "Beta");
  assert.ok(shadow.innerHTML.includes('data-action="graph-back"') || el.graph().includes('data-action="graph-back"'));
  el.graphBack();
  assert.equal(el.graphSelected, b);
  el.graphBack();
  assert.equal(el.graphSelected, a);
  el.graphBack();
  assert.equal(el.selected, a, "back on the detail page");
  assert.equal(el.detailTab, "technical", "with the tab it was left on");
  assert.equal(el.graphOrigin, null);
  assert.equal(el.graphBackLabel(), "");
});

test("leaving a page through a link keeps it for back, the menu clears the trail", () => {
  const { el } = panel("en");
  el.data = DATA; el.view = "overview";
  el.noteJump("findingsNav"); el.view = "findingsNav";
  el.noteJump("findingsNav");
  assert.equal(el.viewTrail.length, 1, "no step for the page we are on");
  assert.ok(el.heading().includes('data-action="view-back"') && el.heading().includes("Back to"));
  el.viewBack();
  assert.equal(el.view, "overview");
  assert.equal(el.viewTrail.length, 0);
  assert.ok(!el.heading().includes('data-action="view-back"'));
});

test("going back from a detail page restores the tab the previous one was left on", async () => {
  const { el } = panel("en");
  const a = { object_type: "entity", object_id: "sensor.a", name: "Alpha", status: "active" };
  const b = { object_type: "entity", object_id: "sensor.b", name: "Beta", status: "active" };
  el.data = { ...DATA, objects: [...DATA.objects, a, b] };
  el._hass = { language: "en", callWS: async () => ({}) };
  await el.openObject(a);
  el.detailTab = "relations";
  await el.openObject(b);
  assert.equal(el.detailTab, "overview");
  el.goBack();
  assert.equal(el.selected, a); assert.equal(el.detailTab, "relations");
  el.goBack();
  assert.equal(el.selected, null);
});

test("slow recorder views ask again by themselves while another calculation holds the lock, and renew an old reply once", async () => {
  const timers = [];
  const { el } = panel("en", { setTimeout: (fn, ms) => { timers.push([fn, ms]); return 0; } });
  el.data = DATA; el.view = "recorder";
  const calls = [];
  let answer = { available: true, busy: true, findings: [], window_days: 1 };
  el._hass = { language: "en", callWS: async msg => { if (msg.type.endsWith("/storms")) { calls.push(msg.refresh); return answer; } return { available: true, busy: false, findings: [] }; } };
  await el.loadStorms();
  assert.equal(timers.filter(([, ms]) => ms === 8000).length, 1, "one retry is scheduled");
  assert.ok(el.stormsView().includes("asks again by itself"));
  answer = { ...RELIABILITY, available: true, busy: false, stale: true, age_seconds: 3600, computed_at: 1791470000, findings: [], entities: [], integrations: [], events: [], total_rows: 0, per_day: 0, entity_count: 0, event_total: 0 };
  const [retry] = timers.find(([, ms]) => ms === 8000);
  retry();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(JSON.stringify(calls), "[false,false,true]", "the stale reply is renewed once with refresh");
  el._busyTries = {};
  for (let i = 0; i < 15; i++) el.followUp("x", "recorder", { busy: true }, () => {}, false);
  assert.equal(timers.filter(([, ms]) => ms === 8000).length <= 13, true, "the retries are limited");
});

test("the runs view searches and filters the table and the list of what stands out, and sorts by column", () => {
  const { el } = panel("en");
  el.data = DATA; el.runs = RUNS; el.view = "runs"; el._runsRequested = true;
  assert.ok(!el.runsView().includes('data-lq="runs"'), "a short list needs no search box");
  const st = el.lvState("runs", "runs", "desc");
  st.q = "nacht";
  let html = el.runsView();
  assert.ok(html.includes('data-lq="runs"'), "the box stays while a text is set");
  assert.ok(html.includes("script.nacht") && !html.includes("automation.heizung") && !html.includes("Flur"), "table and attention list are cut");
  st.q = "zzz";
  assert.ok(el.runsView().includes("No matches for these filters."));
  st.q = ""; st.f = { type: "script" };
  html = el.runsView();
  assert.ok(html.includes("script.nacht") && !html.includes("automation.heizung"));
  st.f = { outcome: "errors" };
  html = el.runsView();
  assert.ok(html.includes("script.nacht") && html.includes("automation.flur") && !html.includes("automation.heizung"), "only runs with errors");
  st.f = {}; st.sort = "errors"; st.dir = "desc";
  html = el.runsView();
  assert.ok(html.indexOf("automation.flur") < html.indexOf("script.nacht") && html.indexOf("script.nacht") < html.indexOf("automation.heizung"));
  assert.ok(html.includes('data-lsort="runs|errors|desc"'));
});

test("reliability and the unstable entities can be searched and filtered", () => {
  const { el } = panel("en");
  el.data = DATA; el.view = "reliability"; el._relRequested = 7;
  const entries = Array.from({ length: 7 }, (_, i) => ({ ...RELIABILITY.entries[1], entry_id: `x${i}`, title: `Box ${i}`, domain: i === 3 ? "zha" : "hue", availability: 99 - i, shared_outages: i === 3 ? 2 : 0, reauth: i === 5, state: i === 6 ? "setup_retry" : "loaded" }));
  const unstable = { total: 7, excluded: {}, items: Array.from({ length: 7 }, (_, i) => ({ entity_id: `sensor.u${i}`, name: `Flatter ${i}`, entry_title: "Hue", level: "unstable", episodes: 3, per_day: 1, total_seconds: 60, mean_seconds: 20, used: 0, pattern_hour: null })) };
  el.reliability = { ...RELIABILITY, entries, unstable, coverage: undefined };
  let html = el.reliabilityView();
  assert.ok(html.includes('data-lq="relentries"') && !html.includes('data-lq="relunstable"'), "the open tab holds its list");
  el.viewTab = { reliability: "unstable" };
  assert.ok(el.reliabilityView().includes('data-lq="relunstable"'));
  el.viewTab = {};
  assert.ok(html.indexOf("Box 6") < html.indexOf("Box 0"), "worst availability first");
  el.lvState("relentries", "avail", "asc").f = { state: "outages" };
  html = el.reliabilityView();
  assert.ok(html.includes("Box 3") && !html.includes("Box 0"));
  el.lv.relentries.f = { state: "reauth" };
  assert.ok(el.reliabilityView().includes("Box 5") && !el.reliabilityView().includes("Box 3"));
  el.lv.relentries.f = { state: "notloaded" };
  assert.ok(el.reliabilityView().includes("Box 6") && !el.reliabilityView().includes("Box 5"));
  el.lv.relentries.f = {}; el.lv.relentries.q = "zha";
  assert.ok(el.reliabilityView().includes("Box 3") && !el.reliabilityView().includes("Box 0"));
  el.lv.relentries.q = ""; el.lvState("relunstable", "", "asc").q = "flatter 4"; el.viewTab = { reliability: "unstable" };
  html = el.reliabilityView();
  assert.ok(html.includes("sensor.u4") && !html.includes("sensor.u2"));
});

test("the load view, the policies and the exposure view have a search box once they are long enough", () => {
  const { el } = panel("en");
  el.data = { ...DATA }; el._stormsRequested = 1; el._exposureRequested = true;
  const entities = Array.from({ length: 7 }, (_, i) => ({ entity_id: `sensor.e${i}`, name: `Laut ${i}`, rows: 10 - i, per_day: 10, no_new_state: 0, attr_bytes: null, peak_hour: null }));
  el.storms = { ...STORMS, entities };
  el.viewTab = { recload: "entities" };
  assert.ok(el.stormsView().includes('data-lq="stormentities"'));
  el.lvState("stormentities", "", "asc").q = "laut 5";
  let html = el.stormsView();
  assert.ok(html.includes("sensor.e5") && !html.includes("sensor.e2"));
  const items = Array.from({ length: 12 }, (_, i) => ({ key: `policy.entity_area|light.l${i}|`, object_type: "entity", object_id: `light.l${i}`, name: `Lampe ${i}`, ignored: false }));
  el.policies = { available: true, enabled: 1, violations: 12, prefixes: {}, rules: [{ id: "entity_area", enabled: true, count: 12, ignored: 0, items }] };
  el._policiesRequested = true;
  html = el.policiesView();
  assert.ok(html.includes('data-lq="policies"'), "the violations list has a search box");
  el.lvState("policies", "", "asc").q = "lampe 11";
  html = el.policiesView();
  assert.ok(html.includes("Lampe 11") && !html.includes("Lampe 3"));
  el.exposure = { ...EXPO, findings: [{ kind: "alias_duplicate", level: "warn", assistant: "conversation", alias: "Küche", count: 6, items: Array.from({ length: 6 }, (_, i) => ({ entity_id: `light.k${i}`, name: `Küche ${i}` })) }, EXPO.findings[0]] };
  assert.ok(el.exposureView().includes('data-lq="exposure"'));
  el.lvState("exposure", "", "asc").q = "küche 2";
  html = el.exposureView();
  assert.ok(html.includes("light.k2") && !html.includes("light.k4") && !html.includes("Door"), "only findings with a matching entity");
  el.lv.exposure.q = "nothing like this";
  assert.ok(el.exposureView().includes("No matches for these filters."));
});

test("an object leaves quarantine after a question, through the undo of just that object", async () => {
  const { el, shadow } = panel("en");
  const item = id => ({ object_type: "entity", object_id: id, name: id.toUpperCase(), status: "disabled" });
  el.data = { ...DATA, meta: { ...DATA.meta, quarantine_days: 14 }, objects: [item("sensor.a"), item("sensor.b")], edges: [], findings: [],
    quarantine: [{ object_id: "sensor.a", object_type: "entity", plan_id: "p1", since: new Date().toISOString() }, { object_id: "sensor.b", plan_id: "p2", since: new Date().toISOString() }] };
  el.journal = []; el.view = "cleanup";
  el.render();
  let html = shadow.innerHTML;
  assert.equal(html.split("data-release=\"").length - 1, 2);
  assert.ok(html.includes('class="linklike" data-object="entity:sensor.a"'));
  el.releaseConfirm = "entity:sensor.a"; el.render();
  html = shadow.innerHTML;
  assert.ok(html.includes("Enable it again?") && html.includes('data-release-yes="entity:sensor.a"') && html.includes('data-release="entity:sensor.b"'));
  const calls = [];
  el._hass.callWS = async msg => { calls.push({ ...msg }); return msg.type.endsWith("plan_list") ? { plans: [] } : { results: [{ object_id: "sensor.a", outcome: "undone" }], status: "undone" }; };
  el.load = async () => { el.data = { ...el.data, quarantine: el.data.quarantine.slice(1) }; };
  await el.releaseQuarantine("entity:sensor.a");
  assert.equal(JSON.stringify(calls.filter(c => c.type.endsWith("plan_undo"))), JSON.stringify([{ type: "ha_housekeeper/plan_undo", plan_id: "p1", object_ids: ["sensor.a"] }]));
  html = shadow.innerHTML;
  assert.ok(html.includes("sensor.a: enabled again") && html.includes("Quarantine (1)") && el.releaseConfirm === null);
  el._hass.callWS = async () => { throw new Error("boom"); };
  await el.releaseQuarantine("entity:sensor.b");
  assert.ok(shadow.innerHTML.includes("boom"));
});

test("a quarantined entity's detail page offers to take it out of quarantine", () => {
  const { el, shadow } = panel("en");
  const entity = { object_type: "entity", object_id: "sensor.q", name: "Q", status: "disabled", disabled_by: "user", state: null };
  el.data = { ...DATA, objects: [...DATA.objects, entity], quarantine: [{ object_id: "sensor.q", object_type: "entity", plan_id: "p1", since: new Date().toISOString() }] };
  el.selected = entity; el.view = "detail"; el.detailTab = "overview";
  el.render();
  assert.ok(shadow.innerHTML.includes('data-release="entity:sensor.q"'));
});

test("an orphaned statistic names likely successors by domain, unit and name, and explains what to do", () => {
  const { el, shadow } = panel("en");
  const entity = (id, unit, status = "active") => ({ object_type: "entity", object_id: id, name: id, status, unit });
  el.data = { ...DATA, meta: { ...DATA.meta, recorder_available: true },
    objects: [entity("sensor.wohnzimmer_energie_neu", "kWh"), entity("sensor.wohnzimmer_energie_zaehler", "Wh"), entity("sensor.garten_feuchte", "%"), entity("sensor.wohnzimmer_energie_alt2", "kWh", "disabled"), entity("light.wohnzimmer_energie", "kWh")],
    orphaned_statistics: [{ statistic_id: "sensor.wohnzimmer_energie", unit: "kWh", has_sum: true, has_mean: false, in_energy: false }, { statistic_id: "sensor.garage_tuer", unit: "", has_sum: false, has_mean: true, in_energy: false }] };
  el.view = "unreferenced"; el.unrefTab = "statistics";
  el.render();
  const html = shadow.innerHTML;
  assert.ok(html.includes("Possible successors:") && html.includes('data-object="entity:sensor.wohnzimmer_energie_neu"'));
  assert.ok(!html.includes("energie_zaehler") && !html.includes("energie_alt2") && !html.includes('data-object="entity:light.'), "other unit, disabled and other domain are not suggested");
  assert.equal(html.split("Possible successors:").length - 1, 1, "no suggestion without a similar name");
  assert.ok(html.includes("Meter change (continue statistics)") && html.includes("Developer tools → Statistics"));
});

const STORMS = {
  available: true, busy: false, cached: false, took_ms: 4100, window_days: 1, total_rows: 412000, per_day: 412000, entity_count: 380, event_total: 150000, state_changed_events: 140000,
  findings: [
    { kind: "storm", entity_id: "sensor.laut", name: "Lauter <b>Sensor</b>", window_days: 1, per_day: 72000, peak_hour: 5100, rows: 72000, followers: { automation: 2, entity: 1 } },
    { kind: "attribute_flood", entity_id: "sensor.attr", name: "Attr", window_days: 1, per_day: 2000, attr_bytes: 5200, followers: {} },
    { kind: "no_new_state", entity_id: "sensor.same", name: "Same", window_days: 1, per_day: 9000, share: 96, followers: {} },
    { kind: "integration_share", entry_id: "e1", title: "Cloud-Hub", window_days: 1, per_day: 80000, load_share: 41.5, row_share: 19.4 },
    { kind: "event_burst", event_type: "zha_event", count: 120000, window_days: 1 }],
  entities: [{ entity_id: "sensor.laut", name: "Lauter Sensor", rows: 72000, per_day: 72000, no_new_state: 0.12, attr_bytes: 640, peak_hour: 5100 }, { entity_id: "sensor.calm", name: null, rows: 10, per_day: 10, no_new_state: 0, attr_bytes: null, peak_hour: null }],
  integrations: [{ entry_id: "e1", title: "Cloud-Hub", domain: "hue", entities: 12, rows: 80000, per_day: 80000, row_share: 19.4, load_share: 41.5 }],
  events: [{ type: "state_changed", count: 140000 }],
};

test("the load view loads once per window, asks the backend with the right arguments and counts again on request", async () => {
  const { el } = panel("en");
  const calls = [];
  el._hass = { language: "en", callWS: async msg => { if (msg.type.endsWith("/storms")) calls.push(msg); return STORMS; } };
  el.data = { ...DATA };
  el.stormsView(); el.stormsView();
  await el.loadStorms();
  assert.equal(JSON.stringify(calls[0]), JSON.stringify({ type: "ha_housekeeper/storms", window_days: 1, refresh: false }));
  el.stormsWindow = 7; el.storms = null;
  await el.loadStorms(true);
  assert.equal(JSON.stringify(calls[1]), JSON.stringify({ type: "ha_housekeeper/storms", window_days: 7, refresh: true }));
  el._stormsRequested = 7;
  const before = calls.length; el.stormsView();
  assert.equal(calls.length, before, "no repeated load");
});

const DBH = {
  available: true, busy: false, cached: false, took_ms: 3200, supported: true, dialect: "sqlite", db_bytes: 11 * 1024 ** 3, wal_bytes: 3 * 1024 ** 3, growth: { known: true, per_day: 80 * 1024 ** 2 }, restart_gaps: 2,
  findings: [
    { kind: "duplicates", level: "problem", groups: 7, capped: false, series: [{ statistic_id: "sensor.a", name: "A <i>x</i>", groups: 5 }] },
    { kind: "statistics_issues", level: "problem", series_total: 1, series: [{ statistic_id: "sensor.b", name: "B", types: ["units_changed", "odd_type"] }] },
    { kind: "recorder_gap", level: "problem", gaps: 2, longest_seconds: 7200, latest: [{ start: 1790000000, end: 1790007200, seconds: 7200, cause: "recorder" }] },
    { kind: "wal_large", level: "hint", wal_bytes: 3 * 1024 ** 3, db_bytes: 11 * 1024 ** 3 },
    { kind: "growth", level: "hint", recent_bytes: 600 * 1024 ** 2, base_bytes: 100 * 1024 ** 2 },
    { kind: "missing_hours", level: "hint", series_total: 1, series: [{ statistic_id: "sensor.c", name: "C", missing: 9 }] }],
};

test("the database card loads once per visit of Maintenance and asks the backend", async () => {
  const { el } = panel("en");
  const calls = [];
  el._hass = { language: "en", callWS: async msg => { if (msg.type.endsWith("/db_health")) calls.push(msg); return DBH; } };
  el.data = { ...DATA };
  el.dbCard(); el.ensureDbHealth(); el.ensureDbHealth();
  await el.loadDbHealth();
  assert.equal(JSON.stringify(calls[0]), JSON.stringify({ type: "ha_housekeeper/db_health", refresh: false }));
  await el.loadDbHealth(true);
  assert.equal(calls.at(-1).refresh, true);
});

test("only database problems reach the overview to-do list, and only once they were calculated", () => {
  const { el } = panel("en");
  el.data = { ...DATA, quarantine: [] };
  el.dbHealth = null;
  assert.ok(!el.todoItems().some(i => i.key === "db"));
  el.dbHealth = { ...DBH, findings: [DBH.findings[3]] };
  assert.ok(!el.todoItems().some(i => i.key === "db"), "hints stay out");
  el.dbHealth = DBH;
  const item = el.todoItems().find(i => i.key === "db");
  assert.ok(item && item.view === "recorder" && item.hintText.includes("Duplicate statistics timestamps"));
});

const EXPO = {
  available: true, checked: 12, webhooks: 3,
  assistants: [
    { id: "conversation", status: "ok", exposed: 9 },
    { id: "cloud.alexa", status: "inactive", exposed: 0 },
    { id: "cloud.google_assistant", status: "unavailable", exposed: 0 },
  ],
  bridges: [{ kind: "homekit", title: "Bridge <b>", exposed: 4 }],
  exposed_entities: [{ entity_id: "lock.door", name: "Door <i>", assistants: ["conversation", "homekit"] }, { entity_id: "light.a", name: "A", assistants: ["conversation"] }], exposed_total: 2,
  findings: [
    { kind: "sensitive_exposed", level: "hint", count: 12, items: [{ entity_id: "lock.door", name: "Door <i>", assistants: ["conversation", "homekit"] }] },
    { kind: "alias_duplicate", level: "warn", assistant: "conversation", alias: "Küche", count: 2, items: [{ entity_id: "light.a", name: "A" }, { entity_id: "light.b", name: "B" }] },
    { kind: "webhook_orphan", level: "warn", domain: "gone", count: 2 },
  ],
};

test("the exposure view loads once, asks the backend and handles errors and an empty result", async () => {
  const { el } = panel("en");
  const calls = [];
  el._hass = { language: "en", callWS: async msg => { if (msg.type.endsWith("/exposure")) calls.push(msg); return EXPO; } };
  el.data = { ...DATA };
  el.exposureView(); el.ensureExposure();
  await el.loadExposure();
  assert.equal(JSON.stringify(calls[0]), JSON.stringify({ type: "ha_housekeeper/exposure" }));
  el.exposure = { ...EXPO, findings: [] }; el.viewTab = { exposure: "findings" };
  assert.ok(el.exposureView().includes("Nothing unusual in the exposure."));
  el.exposure = null; el.exposureError = "boom";
  assert.ok(el.exposureView().includes("boom"));
});

test("the reliability comparison asks for the period before and shows the difference in words", async () => {
  const { el, shadow } = panel("en");
  const calls = [];
  const row = { entry_id: "e", title: "Hue", domain: "hue", state: "loaded", entities: 3, permanent: 0, availability: 99, shared_outages: 0, longest_outage: 0, layer: null, last_disruption: null, previous_availability: 95.5, delta: 3.5 };
  el._hass = { language: "en", callWS: async msg => { if (msg.type.endsWith("/reliability")) calls.push(msg); return { available: true, busy: false, window_days: 7, entries: [row, { ...row, entry_id: "f", title: "Zigbee", previous_availability: null, delta: null }], unstable: { items: [], total: 0 }, comparison: { requested: true, available: true }, coverage: { known: 3, with_data: 3, observed_share: 100 } }; } };
  el.data = DATA; el.view = "reliability";
  el.relCompare = true;
  await el.loadReliability();
  assert.equal(calls.at(-1).compare, true);
  const html = el.reliabilityView();
  assert.ok(html.includes("+3.5 percentage points against the period before (95.5 %)"));
  assert.ok(html.includes("no data for the period before") && html.includes('data-rel-compare'));
  el.relCompare = false;
  await el.loadReliability();
  assert.ok(!("compare" in calls.at(-1)));
});

const QUICK = {
  ...DATA,
  objects: [
    { object_type: "entity", object_id: "sensor.kueche_temp", name: "Küche Temperatur", status: "active", platform: "mqtt" },
    { object_type: "entity", object_id: "light.kueche", name: "Küche Licht", status: "active", platform: "hue" },
    { object_type: "automation", object_id: "automation.kueche_aus", name: "Küche aus", status: "active" },
    { object_type: "device", object_id: "dev1", name: "Hue Bridge", status: "active", manufacturer: "Signify", model: "BSB002" },
    { object_type: "area", object_id: "kueche", name: "Küche", status: "active" },
    { object_type: "entity", object_id: "sensor.<b>x</b>", name: "<b>Küche</b> böse", status: "active" },
  ],
};

test("the top bar search finds entities, devices and automations, best match first, and escapes names", () => {
  const { el } = panel("en");
  el.data = QUICK;
  el.quickQuery = "k"; assert.equal(el.quickResults().length, 0, "one letter does not search");
  el.quickQuery = "küche";
  const names = el.quickResults().map(o => o.object_id);
  assert.ok(names.includes("light.kueche") && names.includes("automation.kueche_aus") && !names.includes("kueche"), "areas are not offered");
  el.quickQuery = "signify bsb"; assert.equal(JSON.stringify(el.quickResults().map(o => o.object_id)), JSON.stringify(["dev1"]), "manufacturer and model count");
  el.quickQuery = "küche"; el.quickOpen = true;
  const html = el.quickSearchBox();
  assert.ok(html.includes('role="combobox"') && html.includes('role="listbox"') && html.includes("data-quick-item"));
  assert.ok(html.includes("&lt;b&gt;Küche&lt;/b&gt; böse") && !html.includes("<b>Küche</b>"));
  el.quickQuery = "zzzz"; assert.ok(el.quickSearchBox().includes("No results"));
});

test("the search opens the chosen object and closes; the keyboard moves through the results", () => {
  const { el } = panel("en");
  el.data = QUICK;
  const opened = [];
  el.openObject = o => opened.push(o.object_id);
  el.quickQuery = "küche"; el.quickOpen = true;
  const first = el.quickResults()[0].object_id;
  el.quickPick(`entity:${first}`);
  assert.equal(JSON.stringify(opened), JSON.stringify([first]));
  assert.equal(el.quickQuery, ""); assert.equal(el.quickOpen, false);
  el.quickPick("entity:does.not.exist");
  assert.equal(opened.length, 1);
});

test("a list view can be saved under a name, applied again, overwritten and deleted", () => {
  const storage = fakeStorage({});
  const { el } = panel("en", { localStorage: storage });
  const save = name => { el.saveView("inv"); assert.ok(el.viewsControl("inv").includes("data-lview-form")); el.commitView("inv", name); };
  const read = () => JSON.parse(storage.getItem("ha_housekeeper.views"));
  el.data = DATA;
  const st = el.lvState("inv", "name", "asc");
  assert.equal(el.viewsControl("inv"), "", "nothing to save and nothing saved: no control");
  st.q = "sensor"; st.f = { status: "orphaned", type: "" };
  assert.ok(el.viewsControl("inv").includes("data-lview-save"));
  save("Kaputte Sensoren");
  assert.equal(read().inv[0].name, "Kaputte Sensoren");
  assert.equal(JSON.stringify(read().inv[0].f), JSON.stringify({ status: "orphaned" }), "empty filters are not stored");
  st.q = ""; st.f = {}; st.sort = "status"; st.dir = "desc";
  el.applyView("inv", "Kaputte Sensoren");
  assert.equal(st.q, "sensor"); assert.equal(st.f.status, "orphaned"); assert.equal(st.sort, "name"); assert.equal(st.dir, "asc");
  const bar = el.viewsControl("inv");
  assert.ok(bar.includes("data-lview=") && bar.includes("data-lview-delete") && bar.includes("selected"));
  st.q = "neu"; save("Kaputte Sensoren");
  assert.equal(read().inv.length, 1, "the same name overwrites");
  save("  ");
  assert.equal(read().inv.length, 1, "no name, no view");
  el.cancelView("inv");
  assert.ok(!el.viewsControl("inv").includes("data-lview-form"), "cancel closes the form");
  el.deleteView("inv");
  assert.equal(read().inv.length, 0);
});

test("saved views from a broken browser store are ignored and a failing write does not crash", () => {
  const broken = JSON.stringify({ inv: [1, { name: 5 }, { name: "ok", q: "", f: { a: "b", c: 3 }, sort: "name", dir: "up" }, { name: "ok", q: "x", f: { a: "b", c: 3 }, sort: "name", dir: "asc" }], other: "x" });
  const { el } = panel("en", { localStorage: { getItem: () => broken, setItem() { throw new Error("full"); } } });
  el.data = DATA;
  const views = el.viewsStore();
  assert.equal(views.inv.length, 1); assert.equal(JSON.stringify(views.inv[0].f), JSON.stringify({ a: "b" })); assert.ok(!views.other);
  const st = el.lvState("inv", "name", "asc"); st.q = "z";
  el.saveView("inv"); el.commitView("inv", "neu");
  assert.equal(views.inv.length, 2);
});

test("the Recorder view holds the load, the costs and the database, and starts the database check after the load", async () => {
  const queue = [];
  const { el, shadow } = panel("en", { setTimeout: fn => { queue.push(fn); return 0; } });
  el.data = { ...DATA }; el.view = "recorder";
  el._hass = { language: "en", callWS: async msg => (msg.type.endsWith("/storms") ? STORMS : msg.type.endsWith("/db_health") ? DBH : COSTS) };
  el.render();
  let html = shadow.innerHTML;
  assert.ok(html.includes("Recorder load") && html.includes("Recorder costs") && html.includes("Database"));
  assert.equal(queue.length, 1, "only the load query is started at first");
  assert.ok(!el._dbRequested);
  await el.loadStorms();
  assert.equal(el._dbRequested, true, "the database check follows once the load is there");
  assert.ok(el.maintenanceView && !el.maintenanceView().includes("Recorder costs"));
});

test("the old load link opens the Recorder view", () => {
  const window = { location: { search: "?view=storms", pathname: "/ha-housekeeper" }, history: { replaceState() {} } };
  const { el } = panel("en", { window });
  el.data = { ...DATA };
  el.applyUrl();
  assert.equal(el.view, "recorder");
});

test("a list can hide columns and offers its rows as CSV", () => {
  const { el, shadow } = panel("en");
  el.data = DATA; el.view = "inventory"; el.render();
  assert.ok(shadow.innerHTML.includes('data-export-list="inventory"') && shadow.innerHTML.includes('data-col-open="inventory"'));
  assert.ok(shadow.innerHTML.includes(">Type<"));
  el.toggleCol("inventory", "type");
  assert.ok(!shadow.innerHTML.includes('<th scope="col"') && !shadow.innerHTML.includes('data-sort="type"'));
  assert.ok(el.colHidden("inventory", "type") && !el.colHidden("inventory", "status"));
  const ex = el._exporters.inventory;
  assert.equal(ex.rows().length, el.filtered().length);
});

test("the flow tab shows triggers, conditions and nested actions and marks missing objects", () => {
  const { el } = panel("en");
  el.data = { ...DATA, objects: [{ object_type: "entity", object_id: "light.hall", name: "Hall light", status: "active" }], edges: [], findings: [] };
  const item = {
    object_type: "automation", object_id: "automation.hall", name: "Hall",
    triggers: [{ trigger: "state", entity_id: "binary_sensor.gone", to: "on" }], conditions: [{ condition: "state", entity_id: "light.hall", state: "off" }],
    actions: [{ choose: [{ conditions: [{ condition: "template", value_template: "{{ true }}" }], sequence: [{ action: "light.turn_on", target: { entity_id: "light.hall" } }] }], default: [{ delay: { seconds: 5 } }] }],
  };
  assert.ok(el.detailTabs(item, "automation:automation.hall").some(([id]) => id === "flow"));
  const html = el.flowCard(item, "automation:automation.hall");
  assert.ok(html.includes("Choose") && html.includes("Hall light") && html.includes("light.turn_on") && html.includes("Delay") && html.includes("action/0/choose/0/sequence/0"));
  assert.ok(html.includes("binary_sensor.gone") && html.includes("fstep broken"));
  const script = el.flowCard({ object_type: "script", object_id: "script.x", name: "X", actions: [{ delay: "00:01:00" }] }, "script:script.x");
  assert.ok(script.includes("sequence/0") && !html.includes("Trigger</h2>x"));
});

test("findings that began with an update get a line, a tile and a filter", () => {
  const { el } = panel("en");
  const finding = { key: "k1", rule_id: "entity.unavailable", object_id: "light.a", classification: "unavailable", confidence: 0.9, ignored: false };
  el.data = { ...DATA, objects: [{ object_type: "entity", object_id: "light.a", name: "A", status: "unavailable" }], edges: [], findings: [finding, { ...finding, key: "k2", object_id: "light.b" }] };
  el._corrRequested = true; el._corrKey = el.data.meta.scanned_at || "";
  el.corr = { groups: [{ id: "g", kind: "entry_version", at: "2026-10-01T10:05:00+00:00", domain: "hue", from: "1", to: "2", total: 1, keys: ["k1"], only_group: false }], by_key: { k1: "g" } };
  assert.ok(el.corrLine("k1").includes("Update of hue 1 → 2") && el.corrLine("k2") === "");
  assert.deepEqual(el.visibleFindings().length, 2);
  el.findingAfter = true;
  assert.deepEqual(el.visibleFindings().map(f => f.key), ["k1"]);
  assert.ok(el.findingsView().includes('data-finding-after="1"') && el.corrGroupsCard().includes("Update of hue"));
});

test("a device has a history tab with its steps and note; removed devices are listed in Maintenance", () => {
  const { el } = panel("en");
  el.data = DATA;
  const device = { object_type: "device", object_id: "d1", name: "Hub", status: "active" };
  assert.ok(el.detailTabs(device, "device:d1").some(([id]) => id === "life"));
  el.life = new Map([["d1", { steps: [{ kind: "discovered", at: "2026-01-01T00:00:00+00:00" }, { kind: "replaced", at: "2026-02-01T00:00:00+00:00", from: "light.old", to: "light.new" }], unstable: "flapping", note: { text: "kept <b>", at: "x" } }]]);
  const html = el.lifeCard(device);
  assert.ok(html.includes("Discovered") && html.includes("light.old → light.new") && html.includes("flapping") && html.includes("kept &lt;b&gt;") && !html.includes("<b>kept"));
  el._removedRequested = true;
  el.removed = [{ object_id: "d9", name: "Old hub", kind: "remove_device", at: "2026-03-01T00:00:00+00:00", note: "retired" }];
  const list = el.removedCard();
  assert.ok(list.includes("Old hub") && list.includes("Removed by a plan") && list.includes("retired"));
});

test("the maintenance window is off until switched on, then shows the open step and builds a report", () => {
  const { el } = panel("en");
  el.data = DATA; el._winRequested = true; el.journal = [{ plan_id: "aabbccddeeff", created_at: "2026-10-01T10:00:00+00:00", status: "dry_run", executed: false, summary: { total: 2, ok: 2, review: 0, blocked: 0 } }]; el._journalRequested = true;
  el.win = { enabled: false, state: null, current: null };
  assert.ok(el.windowCard().includes("Switch on (experimental)") && !el.windowCard().includes("data-win-act=\"begin"));
  el.win = { enabled: true, state: null, current: null };
  assert.ok(el.windowCard().includes('data-win-act="begin:aabbccddeeff"'));
  el.win = { enabled: true, current: "plan", state: { started_at: "2026-10-01T10:00:00+00:00", plan_id: "aabbccddeeff", done: ["preflight", "baseline"], log: [{ step: "preflight", at: "2026-10-01T10:01:00+00:00", note: "" }] } };
  const html = el.windowCard();
  assert.ok(html.includes('data-win-act="plan:aabbccddeeff"') && html.includes('data-win-act="next:plan"') && !html.includes("Restart (by you)</strong></span></div><div class=\"pad\">"));
  const report = el.windowReport();
  assert.ok(report.startsWith("# Maintenance window") && report.includes("1. Check first"));
});

test("missing statistics hours say what all series lack, name the periods and list the series", () => {
  const { el } = panel("en");
  el.data = DATA;
  const f = { kind: "missing_hours", level: "hint", series_total: 2, own_series: 1, gap_hours: 20, gaps_total: 1,
    gaps: [{ start: 1_000_000, end: 1_072_000, hours: 20, cause: "recorder" }],
    series: [{ statistic_id: "sensor.b", name: "B <i>", missing: 30, shared: 20, own: 10 }, { statistic_id: "sensor.a", name: "A", missing: 20, shared: 20, own: 0 }] };
  const text = el.dbFindingText(f);
  assert.ok(text.includes("20 hours are missing from all series at once") && text.includes("1 series have gaps of their own"));
  const extra = el.dbFindingExtra(f);
  assert.ok(extra.includes("The recorder was not running") && extra.includes("B &lt;i&gt;") && !extra.includes("<i>"));
  assert.ok(el.dbFindingExtra({ kind: "growth" }) === "");
});

test("the browser's back button steps back inside the panel, one history entry in front of it", () => {
  const calls = [];
  const win = { location: { pathname: "/ha-housekeeper", href: "/ha-housekeeper", search: "" }, history: { state: null, pushState: () => calls.push("push"), back: () => calls.push("back"), replaceState() {} } };
  const { el } = panel("en", { window: win });
  el._basePath = "/ha-housekeeper";
  el.view = "inventory";
  el.syncGuard();
  assert.deepEqual(calls, [], "nothing to go back to: no entry");
  el.selected = DATA.objects[0];
  el.syncGuard(); el.syncGuard();
  assert.deepEqual(calls, ["push"], "one entry while there is a way back");
  el.onPopState();
  assert.equal(el.selected, null, "back leaves the detail page");
  assert.equal(el._guard, false);
  el.selected = DATA.objects[0]; el.syncGuard();
  el.selected = null; el.syncGuard();
  assert.deepEqual(calls, ["push", "push", "back"], "own back button: the spare entry is removed");
  el.onPopState();
  assert.equal(el.view, "inventory", "that pop is ignored");
});
