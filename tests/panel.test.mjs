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

test("changes view handles missing baseline, empty diff and loading", () => {
  const { el, shadow } = panel("en");
  el.view = "changes";
  el.compare = { available: false, baselines: [] };
  el.render();
  assert.ok(shadow.innerHTML.includes("only one saved scan"));
  const empty = { ...COMPARE };
  for (const k of ["status_changes", "new_findings", "resolved_findings", "new_objects", "removed_objects"]) empty[k] = { total: 0, items: [] };
  el.compare = empty;
  el.render();
  assert.ok(shadow.innerHTML.includes("No changes since this scan"));
  el.compare = null;
  el.render();
  assert.ok(shadow.innerHTML.includes("Loading"));
});

test("changes view explains a young history and lists stored scans as comparison bases", () => {
  const { el, shadow } = panel("de");
  el.view = "changes";
  el.compare = { ...COMPARE, retention_days: 30, current: { objects: 12, findings: 5 }, baselines: [{ id: "previous", at: "2026-10-07T19:19:00+00:00", objects: 12, findings: 3 }] };
  el.render();
  assert.ok(shadow.innerHTML.includes("Der Verlauf baut sich auf") && shadow.innerHTML.includes("30 Tage"));
  assert.ok(!shadow.innerHTML.includes("data-baseline"));
  el.compare = { ...el.compare, baselines: [el.compare.baselines[0], { id: "2026-10-06T20:00:00+00:00", at: "2026-10-06T20:00:00+00:00", objects: 10, findings: 7 }] };
  el.render();
  const html = shadow.innerHTML;
  assert.ok(!html.includes("Der Verlauf baut sich auf"));
  assert.ok(html.includes("Verlauf der Scans") && html.includes('data-baseline="previous"') && html.includes('data-baseline="2026-10-06T20:00:00+00:00"'));
  assert.ok(html.includes("5 Befunde") && html.includes("+2") && html.includes("-4"));
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

test("duplicate entities and unused automations are explained", () => {
  const { el } = panel("de");
  const dup = diagnoseWith([ENTRY, DEVICE], { object_id: "media_player.tv_2", duplicate_of: "media_player.tv" });
  assert.ok(dup.rows.some(r => r.value === "media_player.tv" && r.tone === "violet"));
  assert.ok(dup.cause.includes("media_player.tv"));
  assert.ok(dup.hint.includes("working entity"));

  const automation = { object_type: "automation", object_id: "automation.old", name: "Old", status: "active", last_triggered: null };
  el.data = { ...DATA, objects: [...DATA.objects, automation], findings: [
    { rule_id: "automation.never_triggered", object_id: "automation.old", classification: "unused", confidence: 0.6, evidence: [{ days: 120 }] },
  ] };
  const d = el.diagnose(automation);
  assert.equal(d.tone, "warn");
  assert.ok(d.cause.includes("120"));
  assert.equal(d.rows.find(r => r.value === "Nie").tone, "warn");

  el.selected = automation;
  el.view = "findingsNav";
  el.selected = null;
  el.render();
  assert.ok(el.findingRow(el.data.findings[0]).includes("Wurde nie ausgelöst"));
  assert.ok(el.findingRow({ rule_id: "entity.possible_duplicate", object_id: "media_player.tv_2", classification: "possible_duplicate", confidence: 0.7, affected_object: "media_player.tv" }).includes("Mögliches Duplikat von media_player.tv"));
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
  assert.ok(shadow.innerHTML.includes("Low (3)") && shadow.innerHTML.includes("All (5)"));
  assert.ok(!shadow.innerHTML.includes("sensor.full"));
  el.batteryFilter = "all";
  el.render();
  assert.ok(shadow.innerHTML.includes("sensor.full"));
});

test("integrations with problems appear on the overview", () => {
  const { el } = panel("en");
  el.data = { ...DATA, objects: [...DATA.objects, { object_type: "config_entry", object_id: "e9", name: "Hue", domain: "hue", status: "problem", state: "setup_retry" }] };
  const html = el.integrationProblems();
  assert.ok(html.includes("Integrations with problems (1)") && html.includes("Retrying setup"));
  el.data = DATA;
  assert.equal(el.integrationProblems(), "");
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

test("short lists show no pager", () => {
  const { el, shadow } = panel("en");
  el.data = { ...DATA, objects: [{ object_type: "entity", object_id: "light.a", name: "A", status: "active" }], edges: [] };
  el.view = "unreferenced";
  el.render();
  assert.ok(!shadow.innerHTML.includes("data-lpage") && !shadow.innerHTML.includes("data-pagesize"));
});

test("overview offers quick links to the tidy-up views", () => {
  const { el, shadow } = panel("en");
  const find = (rule, classification, id) => ({ rule_id: rule, classification, object_id: id, confidence: 0.7, ignored: false });
  el.data = { ...DATA, objects: [{ object_type: "entity", object_id: "light.a", name: "A", status: "active" }], edges: [],
    findings: [find("entity.possible_duplicate", "possible_duplicate", "sensor.x_2"), find("automation.stale", "unused", "automation.a"), find("automation.never_triggered", "unused", "automation.b")] };
  el.render();
  const html = shadow.innerHTML;
  assert.ok(html.includes('data-jump="findingsNav" data-filter="unused"') && html.includes('data-jump="unreferenced"'));
  assert.ok(html.includes("Tidy up"));
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

test("settings view has a header band and four tabs: appearance, thresholds, hidden findings, info", () => {
  const { el, shadow } = panel("en");
  el.data = { ...DATA, meta: { ...DATA.meta, version: "0.3.1", ha_version: "2026.9.4", scanned_at: new Date(Date.now() - 3 * 3600e3).toISOString(), scan_interval_hours: 24, min_unavailable_days: 7, unused_automation_days: 90, low_battery_percent: 20, history_days: 30 },
    findings: [{ ...DATA.findings[0], key: "k1", ignored: true, ignored_by: "user" }, { ...DATA.findings[1], key: "k2", ignored: true, ignored_by: "label" }] };
  el.view = "settings";
  const show = tab => { el.settingsTab = tab; el.render(); return shadow.innerHTML; };
  let html = show("look");
  assert.ok(html.includes("0.3.1") && html.includes("2026.9.4") && html.includes("data-copy-info"), "header band");
  const tabs = [...html.matchAll(/data-set-tab="(\w+)"/g)].map(m => m[1]);
  assert.equal(JSON.stringify(tabs), JSON.stringify(["look", "scan", "hidden", "info"]));
  assert.ok(/id="hk-set-look" aria-selected="true" aria-controls="hk-setpanel" tabindex="0"/.test(html) && /id="hk-set-scan" aria-selected="false"[^>]*tabindex="-1"/.test(html));
  assert.ok(html.includes("<em>2</em>"), "the hidden tab carries its count");
  for (const key of ['data-pref="size|small"', 'data-pref="mode|dark"', 'data-pref="scheme|modern"', 'data-pref="density|compact"', 'data-pref-select="pageSize"', 'data-pref-reset']) assert.ok(html.includes(key), key);
  assert.ok(html.includes('aria-pressed="true"') && html.includes('class="mini"'), "scheme tiles show a preview");
  html = show("scan");
  for (const key of ["min_unavailable_days", "unused_automation_days", "scan_interval_hours", "low_battery_percent", "history_days"]) assert.ok(html.includes(`data-opt="${key}"`), key);
  assert.ok(html.includes("Default: 7 days") && html.includes("Default: 24 h") && html.includes("Default: 20 %") && html.includes("Default: 30 days"));
  assert.ok(/data-opts-save disabled/.test(html), "saving is off until a value changes");
  assert.ok(!html.includes("optHistoryDays"), "no raw text key");
  html = show("hidden");
  assert.ok(html.includes("Hidden findings (2)") && html.includes('data-ignore="k1" data-ignore-value="0"') && !html.includes('data-ignore="k2"'));
  html = show("info");
  assert.ok(html.includes("https://github.com/bertel2020/HA-Housekeeping/issues") && html.includes("What Housekeeper stores") && html.includes("5,000"));
  assert.ok(el.infoText().includes("HA Housekeeper 0.3.1") && el.infoText().includes("Home Assistant 2026.9.4"));
  el.settingsTab = "nonsense";
  assert.ok(el.settingsView().includes('id="hk-set-look" aria-selected="true"'), "a stale tab falls back to appearance");
});

test("every settings text exists in both languages", () => {
  const { TEXT, OPTION_FIELDS } = loadPanel();
  for (const [, title, hint, unit] of OPTION_FIELDS) for (const key of [title, hint, unit]) for (const lang of ["de", "en"]) assert.ok(TEXT[lang][key], `${lang}:${key}`);
});

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

test("automatic mode follows the Home Assistant theme for the extra schemes", () => {
  const { el } = panel("en");
  el.prefs = { ...el.prefs, scheme: "modern" };
  el._hass = { language: "en", themes: { darkMode: false } };
  assert.ok(el.themeCss().includes("--hk-blue:#3157c8") && el.themeCss().includes("color-scheme:light"));
  el._hass = { language: "en", themes: { darkMode: true } };
  assert.ok(el.themeCss().includes("--hk-blue:#7ea1ff") && el.themeCss().includes("color-scheme:dark"));
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

test("old scheme names from earlier builds are migrated", () => {
  const stored = scheme => fakeStorage({ "ha_housekeeper.prefs": JSON.stringify({ scheme }) });
  assert.equal(panel("en", { localStorage: stored("teal") }).el.prefs.scheme, "housekeeper");
  assert.equal(panel("en", { localStorage: stored("indigo") }).el.prefs.scheme, "modern");
  assert.equal(panel("en", { localStorage: stored("housekeeper") }).el.prefs.scheme, "housekeeper");
});

test("schemes also set the status colors", () => {
  const { el } = panel("en");
  el.prefs = { ...el.prefs, scheme: "housekeeper", mode: "light" };
  const css = el.themeCss();
  assert.ok(css.includes("--hk-green:#2e7d46") && css.includes("--hk-amber:#8a6d1e") && css.includes("--hk-red:#a23b36") && css.includes("--hk-bg:#f5f6f1"));
});

test("the former Zeitarchiv scheme name is migrated to Housekeeper", () => {
  const { el } = panel("en", { localStorage: fakeStorage({ "ha_housekeeper.prefs": JSON.stringify({ scheme: "zeitarchiv" }) }) });
  assert.equal(el.prefs.scheme, "housekeeper");
});

test("compact density and reduced motion change the generated CSS", () => {
  const { el } = panel("en");
  assert.ok(!el.themeCss().includes(".row{padding-top:6px") && el.themeCss().includes("@media(prefers-reduced-motion:reduce)"));
  el.setPref("density", "compact");
  el.setPref("motion", "reduced");
  const css = el.themeCss();
  assert.ok(css.includes(".row{padding-top:6px") && css.includes("animation:none!important") && !css.includes("@media(prefers-reduced-motion"));
  el.setPref("density", "wide");
  assert.equal(el.sanitizePrefs({ density: "wide", motion: "off" }).density, "normal");
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

test("entities with long-term statistics get a note and a fact", () => {
  const { el, shadow } = panel("en");
  const item = { object_type: "entity", object_id: "sensor.energy", name: "Energy", status: "orphaned", has_statistics: true };
  el.data = { ...DATA, meta: { ...DATA.meta, recorder_available: true }, objects: [item], edges: [], findings: [] };
  el.openObject(item);
  el.render();
  assert.ok(shadow.innerHTML.includes("Long-term statistics") && shadow.innerHTML.includes("long-term statistics in the recorder"));
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
  assert.ok(html.includes("Orphaned statistics (3)") && html.includes("sensor.old_energy") && html.includes("In the Energy dashboard") && html.includes("Developer tools"));
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

test("many integration problems get a search; few do not", () => {
  const { el, shadow } = panel("en");
  const entry = i => ({ object_type: "config_entry", object_id: `e${i}`, name: `Integration ${i}`, domain: `d${i}`, status: "problem", state: "setup_retry" });
  el.data = { ...DATA, objects: Array.from({ length: 3 }, (_, i) => entry(i)) };
  assert.ok(!el.integrationProblems().includes("data-lq"));
  el.data = { ...DATA, objects: Array.from({ length: 8 }, (_, i) => entry(i)) };
  assert.ok(el.integrationProblems().includes('data-lq="integrations"'));
  el.lv.integrations.q = "integration 7";
  const html = el.integrationProblems();
  assert.ok(html.includes("Integration 7") && !html.includes("Integration 2"));
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

test("on small screens reason and observed-since stay visible and the list can still be sorted", () => {
  const { el, shadow } = panel("en");
  el.data = { ...DATA };
  el.view = "inventory";
  el.render();
  let html = shadow.innerHTML;
  for (const label of ["Type", "Status", "Reason", "Observed since"]) assert.ok(html.includes(`data-label="${label}"`), label);
  const mobile = html.slice(html.indexOf("@media(max-width:860px)"), html.indexOf("@media(max-width:520px)"));
  assert.ok(!/(th|td):nth-child\((4|5)\)\{display:none/.test(mobile), "reason and since are not hidden");
  assert.ok(mobile.includes("td[data-label]::before") && mobile.includes(".tablewrap thead{display:none}") && mobile.includes(".mobsort{display:flex"));
  assert.ok(html.includes('id="sortKey"') && html.includes('id="sortDir"'));
  // the sort controls drive the same state as the table headers
  const key = { value: "since" }, dir = {};
  el.shadowRoot.querySelector = selector => (selector === "#sortKey" ? key : selector === "#sortDir" ? dir : null);
  el.render();
  key.onchange();
  assert.equal(el.sort, "since");
  const before = el.sortDir;
  dir.onclick();
  assert.notEqual(el.sortDir, before);
  // findings carry the date in the text line for the small layout
  el.view = "findingsNav";
  el.shadowRoot.querySelector = () => null;
  el.render();
  html = shadow.innerHTML;
  assert.ok(html.includes('class="msince"') && html.includes("Detected since"));
  assert.ok(html.includes(".msince{display:none}") && html.includes(".msince{display:inline}"));
  assert.ok(mobile.includes(".row-text small{white-space:normal;overflow:visible"), "long reasons wrap instead of being cut off");
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

test("the heading names the menu group and shows how old the last scan is", () => {
  const { el } = panel("en");
  const hours = n => new Date(Date.now() - n * 3600e3).toISOString();
  el.data = { ...DATA, meta: { ...DATA.meta, scanned_at: hours(3) } };
  const eyebrow = view => { el.view = view; return /class="eyebrow">([^<]*)</.exec(el.heading())[1]; };
  assert.equal(eyebrow("findingsNav"), "Overview");
  assert.equal(eyebrow("reliability"), "Operation");
  assert.equal(eyebrow("cleanup"), "Maintain");
  assert.equal(eyebrow("batteries"), "Special views");
  assert.equal(eyebrow("settings"), el.t("title"));
  assert.ok(!el.heading().includes("Root-cause"));
  assert.ok(el.heading().includes("Last scan: 3 h ago"));
  for (const [ago, text] of [[0.01, "just now"], [0.5, "30 min ago"], [30, "30 h ago"], [72, "3 days ago"]]) assert.equal(el.agoText(hours(ago)), text);
  assert.equal(el.agoText("nonsense"), "");
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

test("the header has no safety badge, the top bar is fixed, and tiles are equal width", () => {
  const { el, shadow } = panel("en");
  el.render();
  const html = shadow.innerHTML;
  assert.ok(!html.includes("safe-badge") && !html.includes("Changes only on confirmation"));
  assert.ok(!html.includes("Read only") && !html.includes('class="lock"'));
  assert.ok(html.includes(".top{position:sticky;top:0") && html.includes("repeat(auto-fit,minmax(210px,1fr))"));
});

test("quarantined entities show how long they have been disabled and when removal is earliest", () => {
  const { el, shadow } = panel("en");
  const days = n => new Date(Date.now() - n * 864e5 - 3600e3).toISOString();
  const item = id => ({ object_type: "entity", object_id: id, name: id.toUpperCase(), status: "disabled" });
  el.data = { ...DATA, meta: { ...DATA.meta, quarantine_days: 14 }, objects: [item("sensor.young"), item("sensor.mature")], edges: [], findings: [],
    quarantine: [{ object_id: "sensor.mature", plan_id: "p1", since: days(20) }, { object_id: "sensor.young", plan_id: "p1", since: days(3) }] };
  el.journal = [];
  el.view = "cleanup";
  el.render();
  const html = shadow.innerHTML;
  assert.ok(html.includes("Quarantine (2)") && html.includes("11 days to go") && html.includes("Removable at the earliest") && html.includes("no earlier than after 14 days"));
  assert.ok(html.includes("· 20 days") && html.includes("· 3 days"));
  assert.equal(el.daysSince(days(3)), 3);
  assert.equal(el.daysSince("not a date"), 0);
  el.openObject(item("sensor.young"));
  el.render();
  assert.ok(shadow.innerHTML.includes("since") && shadow.innerHTML.includes("(3 days)"));
});

test("without quarantined entities the card is absent and the overview row is zero", () => {
  const { el, shadow } = panel("en");
  el.data = { ...DATA, objects: [], edges: [], findings: [], quarantine: [] };
  el.journal = [];
  el.view = "cleanup";
  el.render();
  assert.ok(!shadow.innerHTML.includes("Quarantine ("));
  assert.ok(el.cleanupCard().includes('data-jump="cleanup"'));
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

test("quarantine and returning devices have their own rows", () => {
  const { el, shadow } = panel("en");
  const { data } = stepCData();
  el.data = data; el.journal = []; el.view = "cleanup";
  el.render();
  const html = shadow.innerHTML;
  assert.ok(html.includes("Quarantine (1)") && html.includes("Quarantined plug") && html.includes("Acme X1") && html.includes('data-object="device:d-q"'));
  assert.ok(html.includes("Returning devices (1)") && html.includes("Dead lamp") && html.includes("integration: hue"));
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

test("an ignored discovery is explained and not shown as a problem", () => {
  const { el, shadow } = panel("de");
  const entry = { object_type: "config_entry", object_id: "01K73", name: "FBH Diele", domain: "battery_notes", source: "ignore", state: "not_loaded", status: "ignored", custom: false, entity_count: 0, device_count: 0 };
  el.data = { ...DATA, objects: [entry], edges: [], findings: [] };
  el.selected = entry; el.view = "detail"; el.details = new Map();
  const html = detailTabsHtml(el, shadow, "overview", "technical");
  assert.ok(html.includes("Ignorierte Entdeckung") && html.includes("kein Fehler") && html.includes("Hinzufügen"));
  assert.ok(html.includes(">Ignoriert<") && !html.includes("Fehler beim Einrichten"));
  assert.equal(el.tone("ignored"), "mute");
  el.data = { ...DATA, objects: [entry], edges: [], findings: [] };
  el.selected = null; el.view = "overview"; el.render();
  assert.ok(!shadow.innerHTML.includes("FBH Diele"));
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

test("an entity page shows its integration, device, area, labels and technical data", () => {
  const { el, shadow } = panel("de");
  el.data = propertyData();
  el.selected = el.data.objects.find(o => o.object_id === "light.kitchen"); el.view = "detail"; el.details = new Map(); el.detailTab = "technical";
  el.render();
  const html = shadow.innerHTML;
  for (const text of ["Zuordnung", "Philips Hue", "(hue)", 'data-object="config_entry:ce1"', "Küchenlampe", "Signify LCT015", 'data-object="device:dev1"', "(vom Gerät)",
    "Wichtig", "Eigenschaften", "Diagnose", "Zustandsklasse", "measurement", "Color lamp", "Deckenlicht", "mdi:lamp", "Benutzer", "Integration", "Technische Angaben", "u-1", "Zeiten", "Letzter Zustandswechsel"]) assert.ok(html.includes(text), text);
  assert.ok(!html.includes("<dt>reason</dt>"));
});

test("a device page lists manufacturer, firmware, links and its entities", () => {
  const { el, shadow } = panel("de");
  el.data = propertyData();
  el.selected = el.data.objects.find(o => o.object_id === "dev1"); el.view = "detail"; el.details = new Map(); el.detailTab = "technical";
  el.render();
  const html = shadow.innerHTML;
  for (const text of ["Signify", "LCT015 (9290)", "SN1", "1.88", "Name laut Integration", "Hue color lamp", "Philips Hue", 'data-object="area:kitchen"', "Hue Hub", 'data-object="device:hub"', "Wichtig",
    'href="https://hue.local"', "Entities des Geräts (1)", 'data-object="entity:light.kitchen"', "hue:abc", "mac:aa:bb", "Technische Angaben"]) assert.ok(html.includes(text), text);
  el.selected = el.data.objects.find(o => o.object_id === "hub"); el.render();
  assert.ok(shadow.innerHTML.includes("1 Geräte") && shadow.innerHTML.includes("hat keine Entities"));
});

test("a child device page names its kind and parent, and a hub explains why cleanup is blocked", () => {
  const { el, shadow } = panel("de");
  const data = propertyData();
  const child = { object_type: "device", object_id: "kid", name: "Zigbee-Kind", device_kind: "child", parent_device_id: "hub", via_device_id: null, config_entry_ids: ["ce1"], labels: [], status: "active" };
  data.objects.push(child);
  el.data = data;
  el.selected = child; el.view = "detail"; el.details = new Map(); el.detailTab = "technical"; el.render();
  let html = shadow.innerHTML;
  for (const text of ["Untergerät", "Übergeordnetes Gerät", 'data-object="device:hub"', "Aufräumen gesperrt", "Untergeräte lassen sich noch nicht entfernen"]) assert.ok(html.includes(text), text);
  el.selected = data.objects.find(o => o.object_id === "hub"); el.render();
  html = shadow.innerHTML;
  assert.ok(html.includes("Aufräumen gesperrt") && html.includes("Andere Geräte hängen an diesem Gerät") && html.includes("2 Geräte"));
  assert.ok(!html.includes("<dt>Art</dt>"));
  el.selected = data.objects.find(o => o.object_id === "dev1"); el.render();
  assert.ok(!shadow.innerHTML.includes("Aufräumen gesperrt") && !shadow.innerHTML.includes("Übergeordnetes Gerät"));
});

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

test("the maintenance view loads the preflight and offers the recorder analysis on request", async () => {
  const { el, shadow } = panel("en");
  const sent = [];
  const state = { ha_version: "2026.2.3", backup: { available: true, configured: true, newest: "x", age_hours: 5 }, repairs: [{ issue_id: "old", domain: "demo" }], failed_entries: [], broken: [], pending_updates: [{ entity_id: "update.core", name: "Core", installed: "2026.2.3", latest: "2026.3.0" }] };
  const report = { state, checks: [{ check: "backup", level: "ok" }, { check: "repairs", level: "warn", count: 1 }, { check: "failed_entries", level: "ok", count: 0 }, { check: "broken", level: "ok", count: 0 }], record: null, after: null };
  el._hass = { language: "en", callWS: async msg => { sent.push(msg.type); return msg.type.endsWith("recorder_costs") ? COSTS : report; } };
  el.view = "maintenance";
  el.render();
  assert.ok(shadow.innerHTML.includes("Update preflight") && shadow.innerHTML.includes("Start analysis") && shadow.innerHTML.includes("Checking"));
  await el.loadPreflight();
  let html = shadow.innerHTML;
  assert.deepEqual(sent, ["ha_housekeeper/preflight"]);
  assert.ok(html.includes("Last backup 5 h ago") && html.includes("Open repairs") && html.includes("1 · old"));
  assert.ok(html.includes("Core 2026.2.3 → 2026.3.0") && html.includes("No starting state saved yet."));
  await el.loadCosts();
  html = shadow.innerHTML;
  assert.ok(html.includes("12,000 stored states") && html.includes("5 MB") && html.includes("kept 10 days"));
  assert.ok(html.includes("&lt;b&gt;Noisy&lt;/b&gt;") && !html.includes("<b>Noisy</b>"), "names are escaped");
  assert.ok(html.includes("can be excluded") && html.includes("already excluded") && html.includes("3 uses"));
  assert.equal(el.exclusionSnippet(), "recorder:\n  exclude:\n    entities:\n      - sensor.noisy\n");
  assert.ok(html.includes("Suggestion for configuration.yaml") && html.includes("- sensor.noisy") && !html.includes("- sensor.used"));
});

test("the recorder costs rank by the current rate, switch to the total and ask for a refresh", async () => {
  const { el, shadow } = panel("en");
  const costs = { ...COSTS, took_ms: 1234, cached: false, entities: [
    { entity_id: "sensor.history", name: "History", states: 9000, per_day: 300, per_day_avg: 300, states_24h: 2, states_7d: 6, share: 75, used: 0, has_statistics: false, known: true, excluded: false, suggest_exclude: false },
    { entity_id: "sensor.loud", name: "Loud", states: 600, per_day: 600, per_day_avg: 600, states_24h: 500, states_7d: 3000, share: 5, used: 0, has_statistics: false, known: true, excluded: false, suggest_exclude: true },
  ] };
  const sent = [];
  el._hass = { language: "en", callWS: async msg => { sent.push(msg); return costs; } };
  el.view = "maintenance";
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
  el.view = "maintenance"; el._pfRequested = true;
  el.render();
  const html = shadow.innerHTML;
  assert.ok(html.includes("Since the update: Home Assistant 2026.2.3 → 2026.3.0") && html.includes("hue · deprecated") && html.includes("Hub &lt;x&gt; (demo)"));
  assert.ok(html.includes("New objects") && html.includes("Backup component not available") && html.includes("Saved"));
});

test("the maintenance entry is in the navigation in both languages", () => {
  for (const lang of ["de", "en"]) {
    const { el, shadow } = panel(lang);
    el.render();
    assert.ok(shadow.innerHTML.includes('data-view="maintenance"') && shadow.innerHTML.includes(lang === "de" ? "Wartung" : "Maintenance"));
  }
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

test("the style sheet is kept while only the page changes", () => {
  const { el, shadow } = panel("en");
  el.render();
  assert.ok(shadow.innerHTML.includes("<style data-hk>"));
  const shell = { outerHTML: "" };
  shadow.querySelector = selector => (selector === ".shell" ? shell : selector === "style[data-hk]" ? {} : null);
  shadow.innerHTML = "KEEP";
  el.render();
  assert.equal(shadow.innerHTML, "KEEP", "the sheet and shell were not rewritten as a whole");
  assert.ok(shell.outerHTML.startsWith('<div class="shell">'));
  el.prefs = { ...el.prefs, mode: "dark" }; // a theme change needs the sheet again
  el.render();
  assert.ok(shadow.innerHTML.includes("<style data-hk>"));
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

test("the journal list is paged like the other long lists", () => {
  const { el } = panel("en");
  el.view = "cleanup";
  el.journal = Array.from({ length: 45 }, (_, i) => ({ plan_id: `p${i}`, created_at: "2026-10-01T10:00:00+00:00", status: "dry_run", summary: {} }));
  const html = el.cleanupView();
  assert.equal((html.match(/data-plan-open=/g) || []).length, 20);
  assert.ok(html.includes("data-pagesize"));
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
  assert.equal(JSON.stringify(menus), JSON.stringify(["navGroupOperation", "navGroupExplore", "navGroupMaintain", "navGroupSpecial"]), "four menus after the direct entries");
  assert.ok(html.includes('<nav class="topnav" id="topnav" aria-label="Main navigation">'));
  const order = ["overview", "findingsNav", "changes", "inventory", "cleanup", "maintenance", "batteries", "settings"].map(v => html.indexOf(`data-view="${v}"`));
  assert.ok(order.every((at, i) => at > 0 && (i === 0 || at > order[i - 1])), "views keep their order and settings comes last");
  assert.equal((html.match(/aria-current="page"/g) || []).length, 1, "one current entry");
  assert.ok(/data-view="cleanup"\s+aria-current="page"/.test(html));
  assert.ok(/class="nav menubtn group-active" data-menu="navGroupMaintain"/.test(html), "the menu holding the current view is marked");
});

test("an open menu and the phone menu show their state in the markup", () => {
  const { el, shadow } = panel("en");
  el.render();
  assert.ok(shadow.innerHTML.includes('data-menu="navGroupExplore" aria-expanded="false"'));
  el.menuOpen = "navGroupExplore"; el.render();
  assert.ok(shadow.innerHTML.includes('class="navmenu open"') && shadow.innerHTML.includes('aria-expanded="true"'));
  el.navOpen = true; el.render();
  assert.ok(shadow.innerHTML.includes('<header class="top open">') && shadow.innerHTML.includes('data-navtoggle aria-expanded="true"'));
  const css = el.styles();
  assert.ok(css.includes(".navmenu.open .navpop{display:grid"));
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
  assert.ok(html.indexOf("What needs doing now?") < html.indexOf('class="summary"'), "the list comes before the statistics");
  assert.ok(html.indexOf('data-todo="integrations"') < html.indexOf('data-todo="critical"') && html.indexOf('data-todo="critical"') < html.indexOf('data-todo="stale"'));
  assert.ok(html.includes('data-jump="inventory" data-type="config_entry" data-status="problem"'));
  assert.ok(html.indexOf('class="summary"') < html.indexOf('class="ring') && html.indexOf('class="ring') < html.indexOf('data-jump="inventory" data-status'), "the health card is the first card of the statistics row");
});

test("without anything to do the list says so, and rows without data are left out", () => {
  const { el, shadow } = panel("en");
  el.data = { ...DATA, meta: { ...DATA.meta, scanned_at: new Date().toISOString(), scan_interval_hours: 24 }, objects: [], quarantine: [] };
  assert.equal(el.todoItems().length, 0);
  el.view = "overview"; el.render();
  assert.ok(shadow.innerHTML.includes("Nothing to do. Last scan:"));
  el.backup = { available: true, overall: "note", checks: [{ id: "emergency_kit", level: "note" }] };
  assert.equal(el.todoItems().length, 0, "notes are no item");
  el.backup = { available: true, overall: "problem", checks: [{ id: "newest", level: "problem" }] };
  assert.equal(el.todoItems()[0].tone, "red");
  el.backup = { available: false, checks: [], overall: "unknown" };
  assert.equal(el.todoItems().length, 0, "no backup component: no row");
  el.backup = null;
  assert.equal(el.todoItems().length, 0, "nothing loaded yet: no backup row");
});

test("the overview loads the backup report without a visit to Maintenance, once per scan", async () => {
  const queue = [];
  const { el, shadow } = panel("en", { setTimeout: fn => { queue.push(fn); return 0; } });
  const calls = [];
  el._hass.callWS = async msg => { calls.push(msg.type); return msg.type.endsWith("backup_health") ? { available: true, overall: "problem", checks: [{ id: "newest", level: "problem", values: {} }], backups: [] } : TREND; };
  const drain = async () => { while (queue.length) await queue.shift()(); };
  const asked = () => calls.filter(c => c.endsWith("backup_health")).length;
  el.data = { ...DATA, meta: { ...DATA.meta, scanned_at: "2026-10-08T10:00:00+00:00", scan_interval_hours: 24 } };
  el.view = "overview";
  el.ensureBackup(); el.ensureBackup(); el.render(); el.render();
  await drain();
  assert.equal(asked(), 1, "asked once for the same scan, however often the view is drawn");
  assert.ok(shadow.innerHTML.includes('data-todo="backup"') && shadow.innerHTML.includes("Latest backup"));
  el.render(); await drain();
  assert.equal(asked(), 1);
  el.data = { ...el.data, meta: { ...el.data.meta, scanned_at: "2026-10-08T11:00:00+00:00" } };
  el.render(); await drain();
  assert.equal(asked(), 2, "a new scan asks again");
});

test("the trend is fetched once per data set and summarised with signs and text", async () => {
  const { el, shadow } = panel("en");
  const calls = [];
  el._hass.callWS = async msg => { calls.push(msg.type + ":" + msg.baseline); return TREND; };
  el.view = "overview";
  el.render(); el.render();
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(JSON.stringify(calls), JSON.stringify(["ha_housekeeper/compare:previous"]), "one request for the same data");
  assert.equal(el.trend, TREND);
  const html = el.trendCard();
  assert.ok(html.includes("Since the last scan") && html.includes("+3") && html.includes("−5") && html.includes(">2<"));
  assert.ok(!html.includes("New objects"), "zero rows are left out");
  el.data = { ...DATA }; // a new scan: fetched again
  el.render();
  assert.equal(calls.length, 2);
  el.trend = { ...TREND, new_findings: { total: 0, items: [] }, resolved_findings: { total: 0, items: [] }, status_changes: { total: 0, items: [] } };
  assert.ok(el.trendCard().includes("No changes since the scan of"));
  el.trend = { available: false };
  assert.equal(el.trendCard(), "");
  assert.ok(shadow.innerHTML.length > 0);
});

test("a failed or empty comparison leaves the overview without a trend card", async () => {
  const { el } = panel("en");
  el._hass.callWS = async () => { throw new Error("nope"); };
  el.view = "overview";
  el.render();
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(el.trend, null);
  assert.equal(el.trendCard(), "");
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

test("the detail summary leaves out what is not known", () => {
  const { el } = panel("en");
  el.data = { ...DATA, objects: [], edges: [], findings: [] };
  const item = { object_type: "automation", object_id: "automation.c", name: "C", status: "active" };
  const labels = el.detailSummary(item, "automation:automation.c").map(([label]) => label);
  assert.equal(JSON.stringify(labels), JSON.stringify([]), "no cause, integration, device or area; no risk for automations; the status is in the page head only");
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

test("the plan steps follow the order of the run: confirmation first, backup when the run starts", () => {
  const { el } = panel("en");
  const disable = [act("disable_entity")], remove = [act("remove_entity")];
  assert.equal(stepStates(el.planSteps(planOf("dry_run", disable), false)), "Select:done Analysis:current Confirm:todo Backup:skipped Run:todo Verify:todo");
  assert.equal(stepStates(el.planSteps(planOf("dry_run", remove), false)), "Select:done Analysis:current Confirm:todo Backup:todo Run:todo Verify:todo");
  assert.equal(stepStates(el.planSteps(planOf("dry_run", remove), true)), "Select:done Analysis:done Confirm:current Backup:todo Run:todo Verify:todo");
  assert.equal(stepStates(el.planSteps(planOf("dry_run", [act("remove_entity", { executable: false, verdict: "blocked" })]), false)), "Select:done Analysis:failed Confirm:todo Backup:skipped Run:todo Verify:todo");

  const backup = el.planSteps(planOf("backup", remove), false);
  assert.equal(stepStates(backup), "Select:done Analysis:done Confirm:done Backup:current Run:todo Verify:todo");
  assert.ok(backup[3].note.includes("Backup running"));

  const running = el.planSteps(planOf("running", remove, { backup: { job_id: "job-7", at: "2026-10-07T10:05:00+00:00" } }), false);
  assert.equal(stepStates(running), "Select:done Analysis:done Confirm:done Backup:done Run:current Verify:todo");
  assert.ok(running[3].note.includes("Created") && running[3].note.includes("job job-7"));

  const verified = planOf("verified", remove, { backup: { job_id: null, at: "2026-10-07T10:05:00+00:00" }, verification: { ok: true, checks: [] } });
  assert.equal(stepStates(el.planSteps(verified, false)), "Select:done Analysis:done Confirm:done Backup:done Run:done Verify:done");
  assert.ok(!el.planSteps(verified, false)[3].note.includes("job"));
});

test("a failed backup, a partial run and a failed check each mark their own step", () => {
  const { el } = panel("en");
  const failedBackup = planOf("aborted", [act("remove_entity", { result: { state: "not_run", reason: "no_backup_agent" } })]);
  const steps = el.planSteps(failedBackup, false);
  assert.equal(stepStates(steps), "Select:done Analysis:done Confirm:done Backup:failed Run:todo Verify:todo", "nothing ran after a failed backup");
  assert.ok(steps[3].note.includes("No backup location"));
  assert.equal(stepStates(el.planSteps(planOf("partial", [act("disable_entity")]), false)), "Select:done Analysis:done Confirm:done Backup:skipped Run:failed Verify:todo");
  assert.equal(stepStates(el.planSteps(planOf("executed", [act("disable_entity")]), false)), "Select:done Analysis:done Confirm:done Backup:skipped Run:done Verify:current");
  const unchecked = planOf("executed", [act("disable_entity")], { verification: { ok: false, checks: [] } });
  assert.equal(stepStates(el.planSteps(unchecked, false)), "Select:done Analysis:done Confirm:done Backup:skipped Run:done Verify:failed");
  assert.equal(stepStates(el.planSteps(planOf("undone", [act("disable_entity")], { verification: { ok: true, checks: [] } }), false)), "Select:done Analysis:done Confirm:done Backup:skipped Run:done Verify:done");
});

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

test("on a phone the cause, the time and the plan steps stay visible", () => {
  const { el } = panel("en");
  const css = el.styles();
  const phone = css.slice(css.indexOf("@media(max-width:860px){.top{flex-wrap"));
  const hidden = [...phone.matchAll(/([^{}]+)\{([^}]*)\}/g)].filter(([, , body]) => /display:none/.test(body)).map(([, selector]) => selector.trim());
  for (const kept of [".sumline", ".steps", ".step", ".planrow", ".msince", ".tab", ".tabs", ".graphbar"]) {
    assert.ok(!hidden.some(selector => selector.split(",").some(part => part.trim() === kept || part.trim().startsWith(`${kept} `))), `${kept} is not hidden on a phone`);
  }
  assert.ok(phone.includes(".msince{display:inline}"), "the observed-since text shows in the list rows");
  assert.ok(phone.includes(".planrow{grid-template-columns:auto minmax(0,1fr)}"), "plan rows give the text the full width");
  // The table rows keep their reason and date columns as labelled lines instead of dropping them.
  assert.ok(phone.includes(".tablewrap td[data-label]::before"));
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

test("the reliability view says so when the recorder is missing, busy or has nothing", async () => {
  const { el, shadow } = panel("en");
  el.data = DATA; el.view = "reliability";
  for (const [reply, text] of [[{ available: false, entries: [] }, "recorder is not available"], [{ available: true, busy: true, entries: [] }, "Another calculation is still running"], [{ ...RELIABILITY, entries: [] }, "no integration states"]]) {
    el._hass = { language: "en", callWS: async () => reply };
    await el.loadReliability();
    assert.ok(shadow.innerHTML.includes(text), text);
  }
  el._hass = { language: "en", callWS: async () => { throw new Error("boom <i>"); } };
  await el.loadReliability();
  assert.ok(shadow.innerHTML.includes("boom &lt;i&gt;"));
});

const UNSTABLE = {
  total: 31, items: [
    { entity_id: "sensor.<b>x</b>", name: "Flatter <i>1</i>", entry_id: "e1", entry_title: "Zigbee", episodes: 12, per_day: 1.7, total_seconds: 4800, mean_seconds: 400, level: "flapping", pattern_hour: 23, used: 2 },
    { entity_id: "sensor.y", name: "Wackler", entry_id: "e1", entry_title: null, episodes: 4, per_day: 0.6, total_seconds: 120, mean_seconds: 30, level: "unstable", pattern_hour: null, used: 0 },
  ],
};

test("the unstable card names level in words, pattern and followers, escapes names and opens the entity", async () => {
  const { el, shadow } = panel("en");
  el.data = DATA; el.view = "reliability";
  el._hass = { language: "en", callWS: async () => ({ ...RELIABILITY, unstable: UNSTABLE }) };
  await el.loadReliability();
  const html = shadow.innerHTML;
  for (const text of ["Unstable entities", "flapping", "12 failures in 7 days (1.7 a day)", "80 min in all, 7 min on average",
    "used by 2 automations, scripts or scenes", "2 of 31 entities shown", "Flatter &lt;i&gt;1&lt;/i&gt;", "Zigbee"]) assert.ok(html.includes(text), text);
  assert.ok(/recurring, mostly between 23 and 01 o(&#39;|')clock/.test(html));
  assert.ok(html.includes('data-object="entity:sensor.&lt;b&gt;x&lt;/b&gt;"') && !html.includes("<i>1</i>"));
  assert.equal((html.match(/recurring/g) || []).length, 1, "no pattern line without a pattern");
});

test("without any unstable entity the card says so, and an old backend without the field shows no card", async () => {
  const { el, shadow } = panel("en");
  el.data = DATA; el.view = "reliability";
  el._hass = { language: "en", callWS: async () => ({ ...RELIABILITY, unstable: { items: [], total: 0 } }) };
  await el.loadReliability();
  assert.ok(shadow.innerHTML.includes("No entity fails unusually often"));
  el._hass = { language: "en", callWS: async () => RELIABILITY };
  await el.loadReliability();
  assert.ok(!shadow.innerHTML.includes("Unstable entities"));
});

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

test("the runs view names each finding in words with its numbers and escapes names", async () => {
  const { el, shadow } = panel("en");
  el.data = DATA; el.view = "runs";
  el._hass = { language: "en", callWS: async () => RUNS };
  el.render();
  assert.ok(shadow.innerHTML.includes("Counting the runs"));
  await el.loadRuns();
  const html = shadow.innerHTML;
  for (const text of ["Needs a look", "Counted since", "Flur &lt;b&gt;Licht&lt;/b&gt;", "18 of 48 runs ended with an error.", "Mostly at step action/2 (12 times).",
    "Contains a wait of 10 min; it is lost on a restart.", "Error rate 40 % after the update (Home Assistant 2026.10.0) instead of 5 % before. Close in time, not proven as the cause.",
    "No run succeeded (6 runs).", "at least, runs may be missing", "failing", "never succeeds", "after update", "long wait", "All counted runs", "1.2 s / 2 min",
    "Runs per day, oldest first: 2, 5, 8, 9, 7, 9, 8", "not a verdict"]) assert.ok(html.includes(text), text);
  assert.ok(!html.includes("<b>Licht</b>"));
  assert.ok(html.includes('data-object="automation:automation.flur"') && html.includes('data-object="script:script.nacht"'));
  assert.ok(html.indexOf("Flur &lt;b&gt;") < html.indexOf("Heizung"));
  assert.equal(html.split('class="row"').length - 1, 2, "only the two with findings are in the attention list");
});

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

test("the runs view says so when nothing was counted, nothing stands out, or the call fails", async () => {
  const { el, shadow } = panel("en");
  el.data = DATA; el.view = "runs";
  el.runs = { items: [], total: 0, since: null };
  el.render();
  assert.ok(shadow.innerHTML.includes("No runs counted yet"));
  el.runs = { ...RUNS, items: [RUNS.items[2]], total: 1 };
  el.render();
  assert.ok(shadow.innerHTML.includes("Nothing stands out in the counted runs."));
  el.runs = null; el._hass = { language: "en", callWS: async () => { throw new Error("boom"); } };
  await el.loadRuns();
  assert.ok(shadow.innerHTML.includes("boom"));
});

test("the runs texts exist in both languages and the entry sits in the overview group", () => {
  const { TEXT, NAV_GROUPS } = loadPanel();
  assert.ok(NAV_GROUPS.some(([, views]) => views.includes("runs")));
  const keys = new Set([...Object.keys(TEXT.de), ...Object.keys(TEXT.en)].filter(k => k.startsWith("runs") || k.startsWith("rf")));
  for (const key of keys) for (const lang of ["de", "en"]) assert.ok(TEXT[lang][key], `${lang} ${key}`);
});

test("an automation's detail page gets a Runs tab only when runs were counted for it", () => {
  const { el, shadow } = panel("en");
  const auto = { object_type: "automation", object_id: "automation.flur", name: "Flur", status: "active", actions: [], triggers: [], conditions: [] };
  const other = { object_type: "automation", object_id: "automation.other", name: "Other", status: "active", actions: [], triggers: [], conditions: [] };
  el.data = { ...DATA, objects: [...DATA.objects, auto, other] };
  el.selected = auto; el.view = "detail"; el.detailTab = "runs";
  el.runs = RUNS;
  el.render();
  const html = shadow.innerHTML;
  assert.ok(html.includes('data-detail-tab="runs"'));
  for (const text of ["Last 7 days, counted since", "18 of 48 runs ended with an error.", "1.2 s / 2 min", "Runs per day, oldest first"]) assert.ok(html.includes(text), text);
  el.selected = other; el.detailTab = "runs"; el.render();
  assert.ok(!shadow.innerHTML.includes('data-detail-tab="runs"'));
  assert.ok(shadow.innerHTML.includes('aria-selected="true"'), "falls back to an existing tab");
});

test("the runtime state shows its unit, but not for special states or entities without one", () => {
  const { el } = panel("en");
  const html = state => {
    const entity = { object_type: "entity", object_id: "sensor.t", name: "T", status: "active", state, unit: "°C", disabled_by: null };
    return el.diagnosisCard(entity);
  };
  assert.ok(html("23.5").includes("23.5 °C"));
  assert.ok(!html("unavailable").includes("unavailable °C"));
  const plain = el.diagnosisCard({ object_type: "entity", object_id: "light.a", name: "A", status: "active", state: "on", unit: null, disabled_by: null });
  assert.ok(plain.includes(">on<") || plain.includes("on</"));
  assert.ok(!plain.includes("on null") && !plain.includes("on undefined"));
});

test("the reliability and runs lists are split into pages", () => {
  const { el, shadow } = panel("en");
  el.data = DATA; el.view = "reliability";
  const entries = Array.from({ length: 45 }, (_, n) => ({ entry_id: `e${n}`, title: `Eintrag ${String(n).padStart(2, "0")}`, domain: "x", state: "loaded", reauth: false, entities: 3, permanent: 0, availability: 99, shared_outages: 0, longest_outage: 0, layer: null, last_disruption: null }));
  el.reliability = { ...RELIABILITY, entries, unstable: { total: 0, items: [] } };
  el.render();
  let html = shadow.innerHTML;
  assert.ok(html.includes("Eintrag 00") && html.includes("Eintrag 19") && !html.includes("Eintrag 20"));
  assert.ok(html.includes("1–20") && html.includes("45"));
  el.pages.relentries = 3; el.render();
  html = shadow.innerHTML;
  assert.ok(html.includes("Eintrag 44") && !html.includes("Eintrag 19"));
  el.view = "runs";
  const rows = Array.from({ length: 30 }, (_, n) => ({ object_type: "automation", entity_id: `automation.a${n}`, name: `Lauf ${String(n).padStart(2, "0")}`, status: "active", runs: 5, ok: 5, errors: 0, conditions: 0, mean_ms: 100, max_ms: 200, per_day: [0, 0, 0, 0, 0, 0, 5], lower_bound: false, findings: [] }));
  el.runs = { ...RUNS, items: rows, total: 30 };
  el.render();
  html = shadow.innerHTML;
  assert.ok(html.includes("Lauf 19") && !html.includes("Lauf 20") && html.includes("1–20"));
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

test("the changes view says why there is no comparison yet and offers to set a comparison point", () => {
  const { el, shadow } = panel("en");
  el.view = "changes";
  el.compare = { available: false, baselines: [], retention_days: 30 };
  el.data = { ...DATA, meta: { ...DATA.meta, preliminary: true } };
  el.render();
  let html = shadow.innerHTML;
  assert.ok(html.includes("The last scan was preliminary") && html.includes("data-scan-point") && html.includes("Scan now and set a comparison point"));
  el.data = { ...DATA, meta: { ...DATA.meta, preliminary: false, scan_interval_hours: 12 } };
  el.render();
  html = shadow.innerHTML;
  assert.ok(html.includes("only one saved scan") && html.includes("every 12 hours") && !html.includes("was preliminary"));
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

test("findings and hidden findings name the rule in words, never as a raw id", () => {
  const { el } = panel("de");
  el.data = { ...DATA, objects: [], edges: [], findings: [] };
  const finding = { rule_id: "entity.device_missing", object_id: "light.a", object_type: "entity", key: "k", classification: "likely", confidence: 0.8, evidence: [] };
  const row = el.findingRow(finding);
  assert.ok(!row.includes("entity.device_missing"), row);
  assert.ok(row.includes(el.t("device_missing")));
  assert.equal(el.t("enabled"), "aktiviert");
});

test("a changes section whose rows are all filtered out says so instead of showing an empty card", () => {
  const { el } = panel("en");
  el.data = { ...DATA, objects: [], edges: [], findings: [] };
  const part = (items) => ({ total: items.length, items });
  el.compare = { available: true, baselines: [{ id: "previous", at: "2026-10-01T00:00:00+00:00" }], baseline_at: "2026-10-01T00:00:00+00:00",
    status_changes: part([]), new_findings: part([]), resolved_findings: part([]), removed_objects: part([]),
    new_objects: part([{ object_type: "entity", object_id: "light.a", name: "A", status: "active" }]) };
  el.lvState("changes", "", "asc").q = "zzz";
  const html = el.changesView();
  assert.ok(html.includes("The filter hides all 1 entries"), html.slice(0, 400));
});

test("settings tabs follow click and arrow keys, and saving the thresholds is allowed only after a change", () => {
  const { el, shadow } = panel("en");
  el.data = { ...DATA, meta: { ...DATA.meta, min_unavailable_days: 7 } };
  el.view = "settings";
  const buttons = ["look", "scan", "hidden", "info"].map(id => ({ dataset: { setTab: id } }));
  const focused = [];
  const save = { disabled: true, addEventListener() {} };
  const inputs = [{ dataset: { saved: "7" }, value: "7" }, { dataset: { saved: "24" }, value: "24" }];
  shadow.querySelectorAll = selector => (selector === "[data-set-tab]" ? buttons : selector === "[data-opt]" ? inputs : []);
  shadow.querySelector = selector => { const m = /^\[data-set-tab="(\w+)"\]$/.exec(selector); return m ? { focus: () => focused.push(m[1]) } : selector === "[data-opts-save]" ? save : null; };
  el.render();
  buttons[1].onclick();
  assert.equal(el.settingsTab, "scan");
  const press = (button, key) => { const ev = { key, preventDefault() {} }; button.onkeydown(ev); };
  press(buttons[1], "ArrowRight"); assert.equal(el.settingsTab, "hidden");
  press(buttons[2], "End"); assert.equal(el.settingsTab, "info");
  press(buttons[3], "ArrowRight"); assert.equal(el.settingsTab, "look", "wraps around");
  assert.equal(JSON.stringify(focused), JSON.stringify(["hidden", "info", "look"]));
  inputs[0].value = "10"; inputs[0].oninput();
  assert.equal(save.disabled, false);
  inputs[0].value = "7"; inputs[0].oninput();
  assert.equal(save.disabled, true, "back to the saved value");
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

test("the load view names each finding in words with its numbers, the followers, and escapes names", () => {
  const { el } = panel("en");
  el.data = { ...DATA };
  el.storms = STORMS; el._stormsRequested = 1;
  const html = el.stormsView();
  assert.ok(html.includes("72,000 rows a day, 5,100 in the busiest hour") && html.includes("Depending on it: 2 Automation, 1 Entity"), html.slice(0, 600));
  assert.ok(html.includes("5.1 KB of attributes") && html.includes("96 % of the rows are updates without a new state"));
  assert.ok(html.includes("About 41.5 % of the recorder load") && html.includes("120,000 events of type zha_event"));
  assert.ok(!html.includes("<b>Sensor</b>") && html.includes("&lt;b&gt;Sensor"), "names are escaped");
  assert.ok(html.includes('data-object="entity:sensor.laut"') && html.includes("41.5 %") && html.includes('class="sharebar" aria-hidden="true"'));
  assert.ok(html.includes("How is this counted?"));
  el.pageSize = 20;
});

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

test("the load view says so when the recorder is missing, busy, quiet or the call fails", () => {
  const { el } = panel("en");
  el.data = { ...DATA }; el._stormsRequested = 1;
  el.storms = { available: false, findings: [] };
  assert.ok(el.stormsView().includes("Home Assistant recorder is not available"));
  el.storms = { available: true, busy: true, findings: [] };
  assert.ok(el.stormsView().includes("Another calculation is still running"));
  el.storms = { ...STORMS, findings: [], entities: [], integrations: [], events: [] };
  assert.ok(el.stormsView().includes("Nothing writes unusually much."));
  el.storms = null; el.stormsError = "boom";
  assert.ok(el.stormsView().includes("boom"));
});

test("the load entry sits in the operation menu and has texts in both languages", () => {
  const { NAV_GROUPS, TEXT } = loadPanel();
  assert.ok(NAV_GROUPS.find(([label]) => label === "navGroupOperation")[1].includes("storms"));
  for (const key of Object.keys(TEXT.de).filter(k => /^storm/.test(k))) assert.ok(TEXT.en[key], key);
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

test("the database card names each finding in words with numbers and advice, and escapes names", () => {
  const { el } = panel("en");
  el.data = { ...DATA }; el.dbHealth = DBH; el._dbRequested = true;
  const html = el.dbCard();
  for (const text of ["Duplicate statistics timestamps", "7 timestamps appear twice", "unit changed, odd_type", "2 periods without a single entry, the longest 2 h", "Large WAL file", "Unusual growth", "9 h missing", "Housekeeper does not repair this", "Database 11 GB, WAL file 3 GB", "Recent growth about 80 MB a day", "2 gaps from restarts"]) assert.ok(html.includes(text), text);
  assert.ok(!html.includes("<i>x</i>") && html.includes("&lt;i&gt;x"), "names are escaped");
  assert.ok(html.indexOf("Duplicate statistics") < html.indexOf("Large WAL"), "problems come first");
});

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

test("the database card says so when nothing stands out, the database is not SQLite, or the call fails", () => {
  const { el } = panel("en");
  el.data = { ...DATA }; el._dbRequested = true;
  el.dbHealth = { ...DBH, findings: [], restart_gaps: 0, growth: { known: false } };
  const quiet = el.dbCard();
  assert.ok(quiet.includes("Nothing unusual in the database.") && quiet.includes("shows here after a week"));
  el.dbHealth = { ...DBH, findings: [], supported: false, dialect: "mysql", db_bytes: null };
  assert.ok(el.dbCard().includes("only SQLite is measured"));
  el.dbHealth = { available: false, findings: [] };
  assert.ok(el.dbCard().includes("recorder is not available"));
  el.dbHealth = null; el.dbError = "boom";
  assert.ok(el.dbCard().includes("boom"));
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
  assert.ok(item && item.view === "maintenance" && item.hintText.includes("Duplicate statistics timestamps"));
});

const EXPO = {
  available: true, checked: 12, webhooks: 3,
  assistants: [
    { id: "conversation", status: "ok", exposed: 9 },
    { id: "cloud.alexa", status: "inactive", exposed: 0 },
    { id: "cloud.google_assistant", status: "unavailable", exposed: 0 },
  ],
  bridges: [{ kind: "homekit", title: "Bridge <b>", exposed: 4 }],
  findings: [
    { kind: "sensitive_exposed", level: "hint", count: 12, items: [{ entity_id: "lock.door", name: "Door <i>", assistants: ["conversation", "homekit"] }] },
    { kind: "alias_duplicate", level: "warn", assistant: "conversation", alias: "Küche", count: 2, items: [{ entity_id: "light.a", name: "A" }, { entity_id: "light.b", name: "B" }] },
    { kind: "webhook_orphan", level: "warn", domain: "gone", count: 2 },
  ],
};

test("the exposure view lists each source with its state and names every finding in words", () => {
  const { el } = panel("en");
  el.data = { ...DATA }; el._exposureRequested = true;
  el.exposure = EXPO;
  const html = el.exposureView();
  assert.ok(html.includes("Assist") && html.includes("9 entities exposed"));
  assert.ok(html.includes("not set up") && html.includes("cannot be checked"));
  assert.ok(html.includes("HomeKit: Bridge &lt;b&gt;") && html.includes("4 entities through the filter"));
  assert.ok(html.includes("Sensitive entities exposed") && html.includes("and 11 more"));
  assert.ok(html.includes("Door &lt;i&gt;") && html.includes("Assist, HomeKit"));
  assert.ok(html.includes("&quot;Küche&quot; names 2 entities for Assist"));
  assert.ok(html.includes("2 webhooks belong to &quot;gone&quot;"));
  assert.ok(html.includes("data-object=\"entity:lock.door\""));
  assert.ok(!html.includes("<b>") && !html.includes("<i>"));
});

test("the exposure view loads once, asks the backend and handles errors and an empty result", async () => {
  const { el } = panel("en");
  const calls = [];
  el._hass = { language: "en", callWS: async msg => { if (msg.type.endsWith("/exposure")) calls.push(msg); return EXPO; } };
  el.data = { ...DATA };
  el.exposureView(); el.ensureExposure();
  await el.loadExposure();
  assert.equal(JSON.stringify(calls[0]), JSON.stringify({ type: "ha_housekeeper/exposure" }));
  el.exposure = { ...EXPO, findings: [] };
  assert.ok(el.exposureView().includes("Nothing unusual in the exposure."));
  el.exposure = null; el.exposureError = "boom";
  assert.ok(el.exposureView().includes("boom"));
});

test("the exposure entry sits in the Maintain menu and has texts in both languages", () => {
  const { NAV_GROUPS, TEXT } = loadPanel();
  assert.ok(NAV_GROUPS.find(([name]) => name === "navGroupMaintain")[1].includes("exposure"));
  for (const lang of ["de", "en"]) {
    for (const key of ["exposure", "exposureSubtitle", "expoTitle", "expoNone", "expoFootnote", "expoKind_webhook_orphan", "expoText_alias_duplicate", "expoAdvice_sensitive_exposed"]) {
      assert.ok(TEXT[lang][key], `${lang}.${key}`);
    }
  }
});

test("every number cell of the runs table carries its label, and only the inventory hides the third", () => {
  const { el } = panel("en");
  el.data = DATA;
  const html = el.runsTable(RUNS.items);
  const cells = [...html.split("<tbody>")[1].split("</tr>")[0].matchAll(/<td([^>]*)>/g)].map(m => m[1]);
  assert.equal(cells.length, 6);
  for (const attrs of cells.slice(1)) assert.ok(/data-label="[^"]+"/.test(attrs), attrs);
  assert.ok(html.includes('data-label="Errors"'));
  assert.ok(!html.includes("tablewrap inv"));
  const css = loadPanel().TEXT && el.styles ? el.styles() : "";
  assert.ok(!css.includes(".tablewrap td:nth-child(3)::before"), "no position based label hiding for every table");
});

test("loading cards show placeholder lines and keep the text for screen readers", () => {
  const { el } = panel("en");
  el.data = { ...DATA }; el._runsRequested = true; el._exposureRequested = true;
  for (const html of [el.runsView(), el.exposureView()]) {
    assert.ok(html.includes('class="skeleton"') && html.includes('role="status"') && html.includes("sr-only"));
    assert.ok(!html.includes("mdi:loading"));
  }
  assert.ok(el.runsView().includes("Counting the runs"));
});

test("runs and reliability say how complete their numbers are", () => {
  const { el } = panel("en");
  el.data = { ...DATA }; el._runsRequested = true;
  el.runs = { ...RUNS, window_days: 7 };
  assert.ok(el.runsView().includes("trace store was full"));
  el.runs = { ...RUNS, window_days: 7, items: RUNS.items.map(i => ({ ...i, lower_bound: false })) };
  assert.ok(el.runsView().includes("all numbers complete"));
  el._relRequested = true;
  el.reliability = { available: true, busy: false, window_days: 7, entries: [{ entry_id: "e", title: "Hue", domain: "hue", state: "loaded", entities: 3, permanent: 0, availability: 99, shared_outages: 0, longest_outage: 0, layer: null, last_disruption: null }], unstable: { items: [] }, coverage: { known: 430, with_data: 412, observed_share: 96 } };
  const html = el.reliabilityView();
  assert.ok(html.includes("412 of 430 entities with data") && html.includes("96 %"));
});

test("the info card shows how much space each stored file takes", () => {
  const { el } = panel("en");
  el.data = { ...DATA, meta: { ...DATA.meta, storage: { events: 2048, runs: 1048576 } } };
  const html = el.infoCard();
  assert.ok(html.includes("2 KB") || html.includes("2.0 KB") || html.includes("2 kB"));
  assert.ok(html.includes("1 MB") || html.includes("1.0 MB"));
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

test("the search sits in the top bar and its texts exist in both languages", () => {
  const { el } = panel("en");
  el.data = QUICK;
  assert.ok(el.topbar().includes("data-quick"));
  const { TEXT } = loadPanel();
  for (const lang of ["de", "en"]) for (const key of ["quickPlaceholder", "quickLabel", "quickNone"]) assert.ok(TEXT[lang][key], `${lang}.${key}`);
});

test("a list view can be saved under a name, applied again, overwritten and deleted", () => {
  const storage = fakeStorage({});
  let answer = "Kaputte Sensoren";
  const { el } = panel("en", { localStorage: storage, prompt: () => answer });
  const read = () => JSON.parse(storage.getItem("ha_housekeeper.views"));
  el.data = DATA;
  const st = el.lvState("inv", "name", "asc");
  assert.equal(el.viewsControl("inv"), "", "nothing to save and nothing saved: no control");
  st.q = "sensor"; st.f = { status: "orphaned", type: "" };
  assert.ok(el.viewsControl("inv").includes("data-lview-save"));
  el.saveView("inv");
  assert.equal(read().inv[0].name, "Kaputte Sensoren");
  assert.equal(JSON.stringify(read().inv[0].f), JSON.stringify({ status: "orphaned" }), "empty filters are not stored");
  st.q = ""; st.f = {}; st.sort = "status"; st.dir = "desc";
  el.applyView("inv", "Kaputte Sensoren");
  assert.equal(st.q, "sensor"); assert.equal(st.f.status, "orphaned"); assert.equal(st.sort, "name"); assert.equal(st.dir, "asc");
  const bar = el.viewsControl("inv");
  assert.ok(bar.includes("data-lview=") && bar.includes("data-lview-delete") && bar.includes("selected"));
  st.q = "neu"; el.saveView("inv");
  assert.equal(read().inv.length, 1, "the same name overwrites");
  answer = "";
  el.saveView("inv");
  assert.equal(read().inv.length, 1, "no name, no view");
  el.deleteView("inv");
  assert.equal(read().inv.length, 0);
});

test("saved views from a broken browser store are ignored and a failing write does not crash", () => {
  const broken = JSON.stringify({ inv: [1, { name: 5 }, { name: "ok", q: "", f: { a: "b", c: 3 }, sort: "name", dir: "up" }, { name: "ok", q: "x", f: { a: "b", c: 3 }, sort: "name", dir: "asc" }], other: "x" });
  const { el } = panel("en", { localStorage: { getItem: () => broken, setItem() { throw new Error("full"); } }, prompt: () => "neu" });
  el.data = DATA;
  const views = el.viewsStore();
  assert.equal(views.inv.length, 1); assert.equal(JSON.stringify(views.inv[0].f), JSON.stringify({ a: "b" })); assert.ok(!views.other);
  const st = el.lvState("inv", "name", "asc"); st.q = "z";
  el.saveView("inv");
  assert.equal(views.inv.length, 2);
});
