// Run with: node --test tests/panel.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

import { buildPanel } from "../scripts/build_panel.mjs";

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
    ...extra,
    URLSearchParams,
    Intl, Map, Set, JSON, String, Number, Array, Object, Math, Date, setTimeout: () => 0,
  };
  vm.runInNewContext(fs.readFileSync(SOURCE, "utf8") + "\nthis.TEXT = TEXT; this.NAV = NAV; this.NAV_GROUPS = NAV_GROUPS;", context);
  return { PanelClass, downloads, TEXT: context.TEXT, NAV: context.NAV, NAV_GROUPS: context.NAV_GROUPS, shadow };
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

test("settings view shows version info, appearance, behavior and hidden findings", () => {
  const { el, shadow } = panel("en");
  el.data = { ...DATA, meta: { ...DATA.meta, version: "0.3.1", ha_version: "2026.9.4", scan_interval_hours: 24, min_unavailable_days: 7, unused_automation_days: 90, low_battery_percent: 20 },
    findings: [{ ...DATA.findings[0], key: "k1", ignored: true, ignored_by: "user" }, { ...DATA.findings[1], key: "k2", ignored: true, ignored_by: "label" }] };
  el.view = "settings";
  el.render();
  const html = shadow.innerHTML;
  assert.ok(html.includes("0.3.1") && html.includes("2026.9.4") && html.includes("every 24 hours") && html.includes("7 days") && html.includes("20 %"));
  assert.ok(html.includes('data-pref="size|small"') && html.includes('data-pref="mode|dark"') && html.includes('data-pref="scheme|modern"'));
  assert.ok(html.includes('data-pref-select="pageSize"') && html.includes("Hidden findings (2)"));
  assert.ok(html.includes('data-ignore="k1" data-ignore-value="0"') && !html.includes('data-ignore="k2"'));
  assert.ok(html.includes("https://github.com/bertel2020/HA-Housekeeping/issues"));
  assert.ok(el.infoText().includes("HA Housekeeper 0.3.1") && el.infoText().includes("Home Assistant 2026.9.4"));
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
  const broken = panel("en", { localStorage: fakeStorage({ "ha_housekeeper.prefs": JSON.stringify({ size: "huge", mode: "x", scheme: "neon", pageSize: 7, startView: "nope" }) }) }).el;
  assert.equal(JSON.stringify(broken.prefs), JSON.stringify({ size: "normal", mode: "auto", scheme: "standard", density: "normal", motion: "auto", pageSize: 20, startView: "overview" }));
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
  el.view = "settings";
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

test("the safety badge names the backup and the changes that only a backup can undo", () => {
  for (const [lang, backup, only] of [["de", "Backup", "nur durch Wiederherstellen"], ["en", "backup", "only be taken back by restoring"]]) {
    const { el } = panel(lang);
    const hint = el.t("safeBadgeHint");
    assert.ok(hint.includes(backup) && hint.includes(only), hint);
    assert.ok(!/Deaktivieren|disabling/.test(hint), "must not describe disabling as the only change");
    assert.equal(el.t("riskNotice"), "riskNotice", "the unused read-only notice is gone");
  }
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

test("the safety badge sits in the header, the sidebar is fixed, and tiles are equal width", () => {
  const { el, shadow } = panel("en");
  el.render();
  const html = shadow.innerHTML;
  assert.ok(html.includes('class="safe-badge"') && html.includes("Changes only on confirmation"));
  assert.ok(!html.includes("Read only") && !html.includes('class="lock"'));
  assert.ok(html.includes(".side{position:sticky;top:0") && html.includes("repeat(auto-fit,minmax(210px,1fr))"));
  assert.ok(html.indexOf('class="safe-badge"') > html.indexOf('class="heading"'));
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

test("an integration page says which integration it is, where it comes from and how it was set up", () => {
  const { el, shadow } = panel("de");
  const entry = { object_type: "config_entry", object_id: "01K72", name: "Bridge", domain: "hue", integration_name: "Philips Hue", custom: true, integration_dir: "custom_components/hue", integration_version: "1.2.3",
    documentation: "https://example.org/hue", source: "zeroconf", state: "setup_error", error: "Cannot connect", unique_id: "abc", entity_count: 4, device_count: 2, created_at: "2026-09-01T10:00:00+00:00", status: "problem" };
  el.data = { ...DATA, objects: [entry], edges: [], findings: [] };
  el.selected = entry; el.view = "detail"; el.details = new Map();
  el.render();
  const html = shadow.innerHTML;
  for (const text of ["Philips Hue", "(hue)", "custom_components/hue · v1.2.3", "Automatisch entdeckt (zeroconf)", "Cannot connect", "01K72", "abc", "/config/integrations/integration/hue", 'href="https://example.org/hue"']) assert.ok(html.includes(text), text);
  assert.ok(html.includes("Meldung: Cannot connect"));
});

test("an ignored discovery is explained and not shown as a problem", () => {
  const { el, shadow } = panel("de");
  const entry = { object_type: "config_entry", object_id: "01K73", name: "FBH Diele", domain: "battery_notes", source: "ignore", state: "not_loaded", status: "ignored", custom: false, entity_count: 0, device_count: 0 };
  el.data = { ...DATA, objects: [entry], edges: [], findings: [] };
  el.selected = entry; el.view = "detail"; el.details = new Map();
  el.render();
  const html = shadow.innerHTML;
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
  el.selected = el.data.objects.find(o => o.object_id === "light.kitchen"); el.view = "detail"; el.details = new Map();
  el.render();
  const html = shadow.innerHTML;
  for (const text of ["Zuordnung", "Philips Hue", "(hue)", 'data-object="config_entry:ce1"', "Küchenlampe", "Signify LCT015", 'data-object="device:dev1"', "(vom Gerät)",
    "Wichtig", "Eigenschaften", "Diagnose", "Zustandsklasse", "measurement", "Color lamp", "Deckenlicht", "mdi:lamp", "Benutzer", "Integration", "Technische Angaben", "u-1", "Zeiten", "Letzter Zustandswechsel"]) assert.ok(html.includes(text), text);
  assert.ok(!html.includes("<dt>reason</dt>"));
});

test("a device page lists manufacturer, firmware, links and its entities", () => {
  const { el, shadow } = panel("de");
  el.data = propertyData();
  el.selected = el.data.objects.find(o => o.object_id === "dev1"); el.view = "detail"; el.details = new Map();
  el.render();
  const html = shadow.innerHTML;
  for (const text of ["Signify", "LCT015 (9290)", "SN1", "1.88", "Name laut Integration", "Hue color lamp", "Philips Hue", 'data-object="area:kitchen"', "Hue Hub", 'data-object="device:hub"', "Wichtig",
    'href="https://hue.local"', "Entities des Geräts (1)", 'data-object="entity:light.kitchen"', "hue:abc", "mac:aa:bb", "Technische Angaben"]) assert.ok(html.includes(text), text);
  el.selected = el.data.objects.find(o => o.object_id === "hub"); el.render();
  assert.ok(shadow.innerHTML.includes("1 Geräte") && shadow.innerHTML.includes("hat keine Entities"));
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
  el.shadowRoot.querySelectorAll = selector => (selector === "tr[data-object]" ? [row] : []);
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
  const groups = [...html.matchAll(/<div class="navgroup" role="group" aria-label="([^"]+)">/g)].map(m => m[1]);
  assert.equal(JSON.stringify(groups), JSON.stringify(["Overview", "Explore", "Maintain", "Special views"]));
  assert.ok(html.includes('<nav aria-label="Main navigation">'));
  assert.ok(html.indexOf('data-view="maintenance"') < html.indexOf('data-view="batteries"') && html.indexOf('data-view="batteries"') < html.indexOf('data-view="settings"'));
  assert.equal((html.match(/aria-current="page"/g) || []).length, 1, "one current entry");
  assert.ok(/data-view="cleanup"\s+aria-current="page"/.test(html));
});

test("the sidebar keeps its scroll position and shows the current entry after a view change", () => {
  const { el, shadow } = panel("en");
  const side = { scrollLeft: 120, scrollTop: 30 };
  const revealed = [];
  const active = { scrollIntoView: opts => revealed.push(opts.inline) };
  shadow.querySelector = selector => (selector === ".side" ? side : selector === ".nav.active" ? active : null);
  el.restoreSideScroll({ left: 120, top: 30 }); // first render: nothing to reveal yet
  side.scrollLeft = 0; side.scrollTop = 0;
  el.restoreSideScroll({ left: 120, top: 30 }); // same view: the saved position comes back
  assert.equal(side.scrollLeft, 120);
  assert.equal(side.scrollTop, 30);
  assert.equal(revealed.length, 0);
  el.view = "maintenance";
  el.restoreSideScroll({ left: 120, top: 30 }); // another view: scroll the current entry into view
  assert.deepEqual(revealed, ["center"]);
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
  el.preflight = { checks: [{ check: "backup", level: "warn" }] };
  const keys = el.todoItems().map(i => i.key);
  assert.equal(JSON.stringify(keys), JSON.stringify(["integrations", "critical", "stale", "backup", "quarantine"]));
  const byKey = Object.fromEntries(el.todoItems().map(i => [i.key, i]));
  assert.equal(byKey.integrations.count, 1);
  assert.equal(byKey.critical.count, 2, "hidden findings and other classes do not count");
  assert.equal(byKey.quarantine.count, 1, "only entries past the quarantine period");
  assert.equal(byKey.backup.tone, "warn");

  el.view = "overview"; el.render();
  const html = shadow.innerHTML;
  assert.ok(html.indexOf("What needs doing now?") < html.indexOf('class="summary"'), "the list comes before the statistics");
  assert.ok(html.indexOf('data-todo="integrations"') < html.indexOf('data-todo="critical"') && html.indexOf('data-todo="critical"') < html.indexOf('data-todo="stale"'));
  assert.ok(html.includes('data-jump="inventory" data-type="config_entry" data-status="problem"'));
  assert.ok(html.indexOf('class="summary"') < html.indexOf('class="ring'), "the health ring moved behind the statistics");
});

test("without anything to do the list says so, and rows without data are left out", () => {
  const { el, shadow } = panel("en");
  el.data = { ...DATA, meta: { ...DATA.meta, scanned_at: new Date().toISOString(), scan_interval_hours: 24 }, objects: [], quarantine: [] };
  assert.equal(el.todoItems().length, 0);
  el.view = "overview"; el.render();
  assert.ok(shadow.innerHTML.includes("Nothing to do. Last scan:"));
  el.preflight = { checks: [{ check: "backup", level: "ok" }] };
  assert.equal(el.todoItems().length, 0, "a healthy backup is no item");
  el.preflight = { checks: [{ check: "backup", level: "red" }] };
  assert.equal(el.todoItems()[0].tone, "red");
  el.preflight = null;
  assert.equal(el.todoItems().length, 0, "no preflight loaded: no backup row");
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
