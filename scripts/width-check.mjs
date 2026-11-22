// Looks for panel views whose page is wider than the window (horizontal page scroll).
//
//   node scripts/width-check.mjs [--widths 900,1024,1280] [--height 900] [--views a,b]
//
// Starts the preview of ui-check.mjs (--serve) and a headless Chrome, takes the views from the VIEWS
// map of ui-check.mjs and measures document.documentElement.scrollWidth against window.innerWidth
// at each width. Prints a table (view x width) and, for offenders, the widest elements.
// It is a report: the exit code is always 0. Needs Node with a global WebSocket and Google Chrome
// (CHROME=/path, the macOS default path or google-chrome/chromium on PATH).
import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (name, fallback) => { const i = process.argv.indexOf(`--${name}`); return i >= 0 ? process.argv[i + 1] : fallback; };
const wait = ms => new Promise(r => setTimeout(r, ms));
const widths = arg("widths", "900,1024,1280").split(",").map(Number);
const height = Number(arg("height", 900));

// The VIEWS map is read from ui-check.mjs so that both stay in step.
const source = fs.readFileSync(path.join(root, "scripts/ui-check.mjs"), "utf8");
const ALL = new Function(`return ${/const VIEWS = (\{[\s\S]*?\n\});/.exec(source)[1]}`)();
const views = arg("views", Object.keys(ALL).join(",")).split(",").filter(v => ALL[v]);

function chromePath() {
  const candidates = [process.env.CHROME, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "google-chrome", "chromium", "chromium-browser"].filter(Boolean);
  for (const c of candidates) {
    if (c.includes("/") ? fs.existsSync(c) : (() => { try { execFileSync("which", [c], { stdio: "ignore" }); return true; } catch { return false; } })()) return c;
  }
  throw new Error("Chrome not found: set CHROME=/path/to/chrome");
}

// Runs in the page: overall overflow, the widest elements past the window edge and the findings table.
const MEASURE = `(() => {
  const iw = innerWidth, panel = document.querySelector("ha-housekeeper-panel"), sr = panel && panel.shadowRoot;
  const out = { iw, sw: document.documentElement.scrollWidth, rendered: !!sr, items: [], table: null };
  if (!sr) return out;
  const clipped = el => { for (let p = el.parentElement || (el.getRootNode() && el.getRootNode().host); p; p = p.parentElement || (p.getRootNode() && p.getRootNode().host)) {
    const s = getComputedStyle(p); if (/auto|hidden|scroll|clip/.test(s.overflowX)) return p.tagName.toLowerCase() + "." + String(p.className).split(" ")[0] + "(" + s.overflowX + ")"; } return ""; };
  for (const el of sr.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (r.width && r.right > iw + 0.5) out.items.push({ tag: el.tagName.toLowerCase(), cls: String(el.className.baseVal ?? el.className).slice(0, 40), right: Math.round(r.right), pos: getComputedStyle(el).position, clip: clipped(el) });
  }
  out.items.sort((a, b) => b.right - a.right);
  out.items = out.items.slice(0, 5);
  const t = sr.querySelector(".findings-table");
  if (t) { const frame = t.parentElement; out.table = { table: Math.round(t.getBoundingClientRect().width), frame: Math.round(frame.getBoundingClientRect().width) }; }
  return out;
})()`;

// Minimal CDP client over the global WebSocket.
async function connect(port) {
  let list;
  for (let i = 0; i < 50; i++) { try { list = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await wait(200); } }
  const target = list.find(t => t.type === "page");
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener("open", r));
  let id = 0; const pending = new Map();
  ws.addEventListener("message", e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
  return (method, params = {}) => new Promise((resolve, reject) => {
    const n = ++id; pending.set(n, m => m.error ? reject(new Error(m.error.message)) : resolve(m.result));
    ws.send(JSON.stringify({ id: n, method, params }));
  });
}
const evaluate = async (send, expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value;

const preview = spawn("node", [path.join(root, "scripts/ui-check.mjs"), "--serve"], { stdio: ["ignore", "pipe", "inherit"] });
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "hk-width-"));
let chrome;
try {
  const origin = await new Promise((resolve, reject) => {
    let text = ""; preview.stdout.on("data", c => { text += c; const m = /(http:\/\/127\.0\.0\.1:\d+)\//.exec(text); if (m) resolve(m[1]); });
    preview.on("exit", () => reject(new Error("preview did not start")));
    setTimeout(() => reject(new Error("preview timeout")), 60000);
  });
  const debugPort = 9300 + Math.floor(Math.random() * 500);
  chrome = spawn(chromePath(), ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
  const send = await connect(debugPort);
  await send("Page.enable");

  const rows = [], notes = [];
  for (const view of views) {
    const row = { view, cells: [] };
    for (const w of widths) {
      await send("Emulation.setDeviceMetricsOverride", { width: w, height, deviceScaleFactor: 1, mobile: false });
      await send("Page.navigate", { url: `${origin}/?${ALL[view]}&scheme=light` });
      let ready = false;
      for (let i = 0; i < 100 && !ready; i++) { await wait(150); try { ready = await evaluate(send, `document.body && document.body.dataset.ready === "1"`); } catch { /* page still navigating */ } }
      if (!ready) { row.cells.push("n/a"); notes.push(`${view}@${w}: page never became ready`); continue; }
      await wait(400);
      const m = await evaluate(send, MEASURE);
      if (!m.rendered) { row.cells.push("n/a"); notes.push(`${view}@${w}: no panel shadowRoot`); continue; }
      const over = m.sw - m.iw;
      row.cells.push(over > 0 ? `+${over}` : "ok");
      if (m.table) notes.push(`${view}@${w}: findings-table ${m.table.table}px in frame ${m.table.frame}px${m.table.table > m.table.frame ? ` (+${m.table.table - m.table.frame})` : ""}`);
      if (over > 0) notes.push(`${view}@${w}: page ${m.sw}px > window ${m.iw}px (+${over})`, ...m.items.map(i => `    ${i.tag}.${i.cls} right=${i.right} position=${i.pos}${i.clip ? ` inside ${i.clip}` : " (no clipping ancestor)"}`));
    }
    rows.push(row);
  }
  const pad = Math.max(...views.map(v => v.length)) + 2;
  console.log("view".padEnd(pad) + widths.map(w => String(w).padStart(7)).join(""));
  for (const r of rows) console.log(r.view.padEnd(pad) + r.cells.map(c => c.padStart(7)).join(""));
  console.log("\nDetails (tables of the findings view, offenders):");
  for (const n of notes) console.log(n);
} catch (err) {
  console.error(`width-check failed: ${err.message}`);
} finally {
  try { chrome?.kill("SIGKILL"); } catch { /* already gone */ }
  preview.kill();
  try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch { /* Chrome may still be flushing */ }
  process.exit(0);
}
