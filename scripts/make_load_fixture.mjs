// Writes a synthetic inventory of a large installation for panel load checks.
//
//   node scripts/make_load_fixture.mjs [out.json] [objects]     default: 8000 objects
//
// Deterministic (no randomness), so timings of two runs are comparable.
import fs from "node:fs";

export function makeLoadFixture(count = 8000) {
  const statuses = ["active", "active", "active", "active", "unavailable", "orphaned", "disabled", "unknown"];
  const objects = [], edges = [], findings = [];
  const automations = Math.round(count * 0.04), devices = Math.round(count * 0.15), entities = count - automations - devices;
  const at = day => `2026-10-${String(1 + (day % 7)).padStart(2, "0")}T10:00:00+00:00`;
  for (let i = 0; i < devices; i++) {
    objects.push({ object_type: "device", object_id: `dev${i}`, name: `Gerät ${i}`, status: "active", reason: "has_entities", manufacturer: "Acme", model: `M${i % 40}`, status_since: at(i) });
  }
  for (let i = 0; i < entities; i++) {
    const status = statuses[i % statuses.length], id = `sensor.beispiel_${i}`;
    objects.push({ object_type: "entity", object_id: id, name: `Beispielsensor ${i} Raum ${i % 60}`, status, reason: status === "active" ? "state_available" : "state_missing", platform: `plat${i % 25}`, device_id: `dev${i % devices}`, status_since: at(i) });
    edges.push({ source: `device:dev${i % devices}`, target: `entity:${id}`, relation: "PROVIDES", confidence: "certain" });
    if (status !== "active" && status !== "disabled") {
      findings.push({ key: `entity:${id}`, rule_id: "entity.state_missing", object_id: id, classification: status === "unavailable" ? "unavailable" : "orphaned", confidence: 0.75, first_detected_at: at(i), evidence: [{ kind: "state_missing" }], ignored: false, ignored_by: null });
    }
  }
  for (let i = 0; i < automations; i++) {
    const id = `automation.a${i}`;
    objects.push({ object_type: "automation", object_id: id, name: `Automation ${i}`, status: "active", reason: "enabled", automation_id: String(1000 + i), triggers: [], conditions: [], actions: [], status_since: at(i) });
    for (let k = 0; k < 6; k++) edges.push({ source: `automation:${id}`, target: `entity:sensor.beispiel_${(i * 7 + k * 13) % entities}`, relation: k % 2 ? "TARGETS" : "TRIGGERS_ON", confidence: "certain" });
  }
  const counts = {}, types = {};
  for (const o of objects) { counts[o.status] = (counts[o.status] || 0) + 1; types[o.object_type] = (types[o.object_type] || 0) + 1; }
  return {
    meta: { scanned_at: "2026-10-08T10:00:00+00:00", object_count: objects.length, status_counts: counts, type_counts: types, version: "load", ha_version: "2026.10.0", scan_interval_hours: 24, quarantine_days: 14, low_batteries: 0 },
    objects, edges, findings, quarantine: [], recurring_devices: [], orphaned_statistics: [],
  };
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const out = process.argv[2] || "load-fixture.json";
  const data = makeLoadFixture(Number(process.argv[3]) || 8000);
  fs.writeFileSync(out, JSON.stringify(data));
  console.log(`${out}: ${data.objects.length} objects, ${data.edges.length} edges, ${data.findings.length} findings`);
}
