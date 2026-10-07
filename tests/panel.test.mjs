// Run with: node --test tests/panel.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const SOURCE = new URL("../custom_components/ha_housekeeper/frontend/ha-housekeeper-panel.js", import.meta.url);

function loadPanel() {
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
    Intl, Map, Set, JSON, String, Number, Array, Object, Math, Date, setTimeout: () => 0,
  };
  vm.runInNewContext(fs.readFileSync(SOURCE, "utf8") + "\nthis.TEXT = TEXT;", context);
  return { PanelClass, downloads, TEXT: context.TEXT, shadow };
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

function panel(lang = "en") {
  const env = loadPanel();
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
  assert.deepEqual(el.filtered().map(o => o.object_id), ["sensor.b"]);
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
  assert.ok(shadow.innerHTML.includes("No earlier scan yet"));
  const empty = { ...COMPARE };
  for (const k of ["status_changes", "new_findings", "resolved_findings", "new_objects", "removed_objects"]) empty[k] = { total: 0, items: [] };
  el.compare = empty;
  el.render();
  assert.ok(shadow.innerHTML.includes("No changes since this scan"));
  el.compare = null;
  el.render();
  assert.ok(shadow.innerHTML.includes("Loading"));
});

test("loadCompare asks the backend with the selected baseline", async () => {
  const { el } = panel();
  const calls = [];
  el._hass.callWS = async msg => { calls.push(msg); return COMPARE; };
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
