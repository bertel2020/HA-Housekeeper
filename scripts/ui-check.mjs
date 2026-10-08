// Looks at the panel in a real browser: screenshots of the main views at desktop, tablet and phone
// size in light and dark, and optionally an accessibility scan with axe-core.
//
//   node scripts/ui-check.mjs [--out DIR] [--objects N] [--views a,b] [--viewports desktop,mobile] [--axe]
//
// Needs Google Chrome (CHROME=/path, the macOS default path, or google-chrome/chromium on PATH).
// --axe also needs axe-core: `npm install --no-save axe-core@4.10.2` in the repository, or
// AXE_PATH=/path/to/axe.min.js. It exits with 1 when axe finds a serious or critical problem.
// The panel is built from panel-src/ on the fly; nothing here touches a Home Assistant instance.
import { execFile, execFileSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { buildPanel } from "./build_panel.mjs";
import { makeLoadFixture } from "./make_load_fixture.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (name, fallback) => { const i = process.argv.indexOf(`--${name}`); return i >= 0 ? process.argv[i + 1] : fallback; };
// Not execFileSync: the page is served by this process, which must stay free to answer Chrome.
const run = promisify(execFile);
const flag = name => process.argv.includes(`--${name}`);

const VIEWPORTS = { desktop: [1280, 1000], tablet: [768, 1100], mobile: [375, 1700] };
const VIEWS = {
  overview: "view=overview", findings: "view=findingsNav", inventory: "view=inventory", changes: "view=changes",
  graph: "view=graph&graph=1&gobj=automation%3Aautomation.a1", detail: "object=entity%3Asensor.beispiel_7&tab=overview",
  attributes: "object=entity%3Asensor.beispiel_7&tab=technical", cleanup: "view=cleanup&plan=running", plan: "view=cleanup&plan=preview", maintenance: "view=maintenance",
};
const SCHEMES = ["light", "dark"];

function chromePath() {
  const candidates = [process.env.CHROME, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "google-chrome", "chromium", "chromium-browser"].filter(Boolean);
  for (const candidate of candidates) {
    if (candidate.includes("/") ? fs.existsSync(candidate) : (() => { try { execFileSync("which", [candidate], { stdio: "ignore" }); return true; } catch { return false; } })()) return candidate;
  }
  throw new Error("Chrome not found: set CHROME=/path/to/chrome");
}

// The synthetic installation plus the cases a screenshot should show: a broken integration, a loop,
// a missing target, objects in quarantine.
function showcase(objects) {
  const data = makeLoadFixture(objects);
  data.meta.scanned_at = new Date().toISOString();
  data.meta.scan_interval_hours = 24;
  data.objects.push({ object_type: "config_entry", object_id: "ce-hue", name: "Philips Hue", domain: "hue", integration_name: "Philips Hue", status: "problem", state: "setup_error", error: "Cannot connect", source: "user", status_since: data.meta.scanned_at });
  data.meta.object_count = data.objects.length;
  data.meta.status_counts.problem = (data.meta.status_counts.problem || 0) + 1;
  data.meta.type_counts.config_entry = (data.meta.type_counts.config_entry || 0) + 1;
  data.edges.push(
    { source: "automation:automation.a2", target: "automation:automation.a1", relation: "TARGETS", confidence: "certain" },
    { source: "automation:automation.a1", target: "automation:automation.a2", relation: "TARGETS", confidence: "probable" },
    { source: "automation:automation.a1", target: "entity:sensor.removed_long_ago", relation: "TARGETS", confidence: "certain", location: "actions[2]" },
  );
  data.findings.unshift({ key: "automation:automation.a1", rule_id: "automation.missing_entity", object_id: "automation.a1", classification: "broken_reference", confidence: 0.95, affected_object: "sensor.removed_long_ago", first_detected_at: data.meta.scanned_at, evidence: [{ location: "actions[2]" }], ignored: false, ignored_by: null });
  data.quarantine = [{ object_id: "sensor.beispiel_4", object_type: "entity", since: new Date(Date.now() - 20 * 864e5).toISOString() }];
  return data;
}

const TREND = {
  available: true, baseline_at: new Date(Date.now() - 864e5).toISOString(), baselines: [], current: { objects: 0, findings: 0 },
  new_findings: { total: 3, items: [{ rule_id: "automation.missing_entity", object_id: "automation.a1", classification: "broken_reference", ignored: false }] },
  resolved_findings: { total: 5, items: [] }, status_changes: { total: 2, items: [] }, new_objects: { total: 1, items: [] }, removed_objects: { total: 0, items: [] },
};

const PAGE = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ui-check</title><style>body{margin:0}</style></head><body>
<script src="/panel.js"></script><script src="/axe.js"></script>
<script>
(async () => {
  const q = new URLSearchParams(location.search), wait = ms => new Promise(r => setTimeout(r, ms));
  localStorage.setItem("ha_housekeeper.prefs", JSON.stringify({ mode: q.get("scheme") === "dark" ? "dark" : "light", graphMode: q.get("graph") ? "graph" : "list" }));
  const ago = h => new Date(Date.now() - h * 3600000).toISOString(), MB = 1048576;
  const BACKUP = { available: true, overall: "problem", schema: 1, backup_count: 3, counts: { ok: 3, note: 3, problem: 2, unknown: 0 },
    checks: [{ id: "setup", level: "ok", values: { agents: ["hassio.local", "cloud.cloud"], recurrence: "daily" } },
      { id: "newest", level: "problem", values: { age_hours: 70, limit_hours: 36, date: ago(70), recurrence: "daily" } },
      { id: "last_run", level: "problem", values: { attempted: ago(5), completed: ago(70), failed_agents: [], failed_attempt: true } },
      { id: "targets", level: "note", values: { local: ["hassio.local"], remote: [] } },
      { id: "size", level: "ok", values: { size: 900 * MB, expected: 880 * MB, ratio: 1.02, baseline: 2 } },
      { id: "retention", level: "ok", values: { copies: 3, days: null, count: 3, oldest_days: 6.4 } },
      { id: "encryption", level: "note", values: { configured: false, newest_protected: false } },
      { id: "emergency_kit", level: "note", values: { at: null, age_days: null } },
      { id: "restore_test", level: "ok", values: { at: ago(24 * 37), age_days: 37 } }],
    backups: [70, 94, 118].map((h, i) => ({ date: ago(h), size: (900 - i * 10) * MB, agents: ["hassio.local"], protected: false, automatic: true, failed_agents: [] })),
    attest: { emergency_kit: null, restore_test: ago(24 * 37) } };
  const data = await (await fetch("/data.json")).json(), trend = await (await fetch("/trend.json")).json();
  const el = document.createElement("ha-housekeeper-panel");
  document.body.appendChild(el);
  el.hass = { language: "de", themes: { darkMode: q.get("scheme") === "dark" }, locale: { language: "de" },
    callWS: async msg => { const t = msg.type;
      if (t.endsWith("/inventory") || t.endsWith("/scan")) return data;
      if (t.endsWith("/status")) return { running: false };
      if (t.endsWith("/plan_list")) return { plans: [] };
      if (t.endsWith("/compare")) return trend;
      if (t.endsWith("/detail")) return { attributes: { friendly_name: "Beispiel", unit_of_measurement: "W" } };
      if (t.endsWith("/backup_health")) return BACKUP;
      if (t.endsWith("/preflight")) return { state: { ha_version: "2026.10.0", backup: { available: true, configured: true, newest: "x", age_hours: 5 }, repairs: [], failed_entries: [], broken: [], pending_updates: [] }, checks: [{ check: "backup", level: "ok" }, { check: "repairs", level: "ok", count: 0 }, { check: "failed_entries", level: "ok", count: 0 }, { check: "broken", level: "ok", count: 0 }], record: null, after: null };
      return {}; } };
  for (let i = 0; i < 50 && !el.data; i++) await wait(100);
  const plan = q.get("plan");
  if (plan) {
    const act = (kind, extra = {}) => ({ kind, object_id: "sensor.beispiel_" + kind.length, name: "Beispielsensor " + kind, verdict: "ok", executable: true, reasons: [], used_by: [], ...extra });
    el.plan = { plan_id: "p1", created_at: new Date().toISOString(), status: plan === "running" ? "running" : "dry_run", executed: false, summary: { total: 3, ok: 2, review: 0, blocked: 1 },
      backup: plan === "running" ? { job_id: "a1b2c3", at: new Date().toISOString() } : undefined,
      actions: [act("remove_entity"), act("migrate_meter", { object_id: "sensor.alt", target: "sensor.neu", name: "Zähler alt" }),
        act("remove_entity", { object_id: "sensor.x", name: "Genutzt", verdict: "blocked", executable: false, reasons: ["used_certain"], used_by: [{ source: "automation:automation.a1", relation: "TARGETS", confidence: "certain" }] })] };
    if (plan === "running") el.planProgress = { done: 1, total: 2 };
  }
  if (q.get("view")) { el.view = q.get("view"); if (el.view === "changes") await el.loadCompare(); }
  if (q.get("graph")) { el.graphSelected = el.findObject(q.get("gobj")); el.graphDepth = 3; el.view = "graph"; }
  else if (q.get("object")) { await el.openObject(el.findObject(q.get("object"))); el.detailTab = q.get("tab") || "overview"; }
  el.render();
  await wait(300);
  if (q.get("axe") && window.axe) {
    const result = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } });
    const out = result.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, count: v.nodes.length, sample: v.nodes.slice(0, 2).map(n => n.html.slice(0, 160)) }));
    const text = JSON.stringify(out);
    if (q.get("inner")) parent.postMessage({ axe: text }, "*");
    else document.body.insertAdjacentHTML("beforeend", "<pre id=axe-result>" + btoa(unescape(encodeURIComponent(text))) + "</pre>");
  }
  document.body.dataset.ready = "1";
})();
</script></body></html>`;

// Chrome will not make a window narrower than about 500 px, so narrower sizes are shown in an iframe
// of the real width: media queries look at the iframe, not at the window.
const FRAME = `<!doctype html><html><head><meta charset="utf-8"><title>frame</title><style>body{margin:0;background:#888}iframe{border:0;display:block;background:#fff}</style></head><body>
<script>
  const q = new URLSearchParams(location.search), w = q.get("w"), h = q.get("h");
  q.delete("w"); q.delete("h"); q.set("inner", "1");
  const f = document.createElement("iframe"); f.width = w; f.height = h; f.src = "/?" + q.toString(); document.body.appendChild(f);
  addEventListener("message", e => { if (e.data && e.data.axe) document.body.insertAdjacentHTML("beforeend", "<pre id=axe-result>" + btoa(unescape(encodeURIComponent(e.data.axe))) + "</pre>"); });
</script></body></html>`;

function serve(data) {
  const panel = buildPanel();
  const axePath = process.env.AXE_PATH || path.join(root, "node_modules/axe-core/axe.min.js");
  const routes = {
    "/": ["text/html", PAGE], "/frame": ["text/html", FRAME], "/panel.js": ["text/javascript", panel], "/data.json": ["application/json", JSON.stringify(data)],
    "/trend.json": ["application/json", JSON.stringify(TREND)],
    "/axe.js": ["text/javascript", fs.existsSync(axePath) ? fs.readFileSync(axePath, "utf8") : "window.axe=undefined;"],
  };
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      const hit = routes[new URL(req.url, "http://x").pathname];
      if (!hit) { res.writeHead(404).end(); return; }
      res.writeHead(200, { "content-type": `${hit[0]}; charset=utf-8` }).end(hit[1]);
    }).listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port, hasAxe: fs.existsSync(axePath) }));
  });
}

// Each Chrome run gets its own profile so that several can run side by side.
async function pool(jobs, size, worker) {
  const queue = [...jobs], results = [];
  await Promise.all(Array.from({ length: size }, async () => {
    for (let job = queue.shift(); job; job = queue.shift()) results.push(await worker(job));
  }));
  return results;
}

const NARROW = 500; // window sizes below this go through the frame
const pageUrl = (port, view, [w, h], scheme, extra = "") => w < NARROW
  ? `http://127.0.0.1:${port}/frame?w=${w}&h=${h}&${VIEWS[view]}&scheme=${scheme}${extra}`
  : `http://127.0.0.1:${port}/?${VIEWS[view]}&scheme=${scheme}${extra}`;
const windowSize = ([w, h]) => [Math.max(w, NARROW), h];

const chromeArgs = (profile, w, h) => ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--no-default-browser-check", `--user-data-dir=${profile}`, `--window-size=${w},${h}`, "--virtual-time-budget=3000"];

const out = path.resolve(arg("out", path.join(os.tmpdir(), "ha-housekeeper-ui-check")));
const views = (arg("views", Object.keys(VIEWS).join(","))).split(",").filter(v => VIEWS[v]);
const viewports = (arg("viewports", Object.keys(VIEWPORTS).join(","))).split(",").filter(v => VIEWPORTS[v]);
fs.mkdirSync(out, { recursive: true });
const chrome = chromePath();
const { server, port, hasAxe } = await serve(showcase(Number(arg("objects", 400))));
const root_profile = fs.mkdtempSync(path.join(os.tmpdir(), "hk-chrome-"));
let failed = false;
const jobsParallel = Number(arg("jobs", 3));
let counter = 0;
const withProfile = async fn => {
  const profile = path.join(root_profile, String(counter++));
  return fn(profile);
};
try {
  const shots = [];
  for (const view of views) for (const viewport of viewports) for (const scheme of SCHEMES) shots.push({ view, viewport, scheme });
  const files = await pool(shots, jobsParallel, ({ view, viewport, scheme }) => withProfile(async profile => {
    const size = VIEWPORTS[viewport], [w, h] = windowSize(size), file = path.join(out, `${view}-${viewport}-${scheme}.png`);
    await run(chrome, [...chromeArgs(profile, w, h), `--screenshot=${file}`, pageUrl(port, view, size, scheme)], { timeout: 60000 });
    return file;
  }));
  for (const file of files.sort()) console.log(file);
  if (flag("axe")) {
    if (!hasAxe) throw new Error("axe-core not found: npm install --no-save axe-core@4.10.2, or set AXE_PATH");
    const seen = new Map(), scans = [];
    for (const view of views) for (const viewport of ["desktop", "mobile"]) for (const scheme of SCHEMES) scans.push({ view, viewport, scheme });
    const found = await pool(scans, jobsParallel, ({ view, viewport, scheme }) => withProfile(async profile => {
      const size = VIEWPORTS[viewport], [w, h] = windowSize(size);
      const { stdout: dom } = await run(chrome, [...chromeArgs(profile, w, h), "--dump-dom", pageUrl(port, view, size, scheme, "&axe=1")], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 90000 });
      const match = /<pre id="axe-result">(.*?)<\/pre>/s.exec(dom);
      return { view, viewport, scheme, violations: match ? JSON.parse(Buffer.from(match[1].trim(), "base64").toString("utf8")) : null };
    }));
    for (const { view, viewport, scheme, violations } of found) {
      if (!violations) { console.log(`axe: no result for ${view} ${viewport} ${scheme}`); failed = true; continue; }
      for (const v of violations) {
        const entry = seen.get(v.id) || { ...v, where: new Set() };
        entry.where.add(`${view}/${viewport}/${scheme}`); seen.set(v.id, entry);
      }
    }
    for (const v of [...seen.values()].sort((a, b) => String(a.impact).localeCompare(String(b.impact)))) {
      console.log(`axe ${v.impact} ${v.id}: ${v.help} (${v.count} nodes in ${[...v.where].join(", ")})`);
      for (const html of v.sample) console.log(`    ${html}`);
      if (v.impact === "serious" || v.impact === "critical") failed = true;
    }
    if (!seen.size) console.log("axe: no violations");
  }
} finally {
  server.close();
  try { fs.rmSync(root_profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch { /* Chrome may still be flushing its profile */ }
}
process.exit(failed ? 1 : 0);
