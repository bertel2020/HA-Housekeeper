// Loads the panel in WebKit, the engine of Safari and of the Home Assistant app on Apple devices,
// and fails on any page error. Chrome accepts some things WebKit refuses (issue #7: outerHTML on a
// child of the shadow root), and ui-check.mjs only drives Chrome.
//
//   npm install --no-save playwright@1.48.2 && npx playwright install webkit
//   node scripts/webkit-check.mjs [--lang de|en]
//
// It serves the same test page as ui-check.mjs (--serve), opens it, then shows every view of the
// navigation and one object page, each rendered twice so the page swap runs, and finally clicks a
// tab of the top bar. Exit code 1 lists every error; nothing here touches a Home Assistant instance.
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

let playwright;
try { playwright = await import("playwright"); } catch {
  console.error("Playwright is missing. Run: npm install --no-save playwright@1.48.2 && npx playwright install webkit");
  process.exit(2);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lang = process.argv.includes("--lang") ? process.argv[process.argv.indexOf("--lang") + 1] : "de";
const server = spawn(process.execPath, [path.join(root, "scripts/ui-check.mjs"), "--serve", "--objects", "200", "--lang", lang], { stdio: ["ignore", "pipe", "inherit"] });
const stop = () => { try { server.kill("SIGKILL"); } catch { /* already gone */ } };
const problems = [];
let browser;
try {
  const url = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("the test page did not start within 30 s")), 30000);
    server.stdout.on("data", chunk => { const m = /http:\/\/\S+/.exec(String(chunk)); if (m) { clearTimeout(timer); resolve(m[0]); } });
    server.on("exit", code => reject(new Error(`the test page ended with ${code}`)));
  });
  browser = await playwright.webkit.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  // axe.js is optional on the test page; its missing file is no error of the panel.
  page.on("pageerror", err => problems.push(`page error: ${err.message}`));
  page.on("console", msg => { if (msg.type() === "error" && !/axe/.test(msg.text())) problems.push(`console: ${msg.text()}`); });
  await page.goto(url);
  await page.waitForFunction(() => document.querySelector("ha-housekeeper-panel")?.data, null, { timeout: 30000 });
  const shown = await page.evaluate(async () => {
    const el = document.querySelector("ha-housekeeper-panel"), tick = () => new Promise(r => setTimeout(r, 50)), out = [];
    // NAV is a top-level constant of the panel script, so it is visible here.
    const check = name => {
      const shells = el.shadowRoot.querySelectorAll(".shell").length;
      if (shells !== 1) out.push(`${name}: ${shells} page roots`);
      if (el.shadowRoot.querySelector(".error[role='alert'] [data-view='overview']")) out.push(`${name}: the view could not be shown`);
    };
    for (const [name] of NAV) { el.selected = null; el.view = name; el.render(); await tick(); el.render(); await tick(); check(name); }
    el.selected = el.data.objects.find(o => o.object_type === "entity") || null;
    el.render(); await tick(); el.render(); await tick(); check("object page");
    el.selected = null; el.view = "overview"; el.render(); await tick();
    return out;
  });
  problems.push(...shown);
  // A real click as well: the top bar tab for the findings.
  await page.locator("ha-housekeeper-panel").locator("[data-view='findingsNav']").first().click();
  await page.waitForTimeout(300);
  if (!(await page.evaluate(() => document.querySelector("ha-housekeeper-panel").view === "findingsNav"))) problems.push("a click on the findings tab did not change the view");
} catch (err) {
  problems.push(`run failed: ${err.message}`);
} finally {
  await browser?.close();
  stop();
}
if (problems.length) { console.error(`WebKit check: ${problems.length} problem(s)\n- ${problems.join("\n- ")}`); process.exit(1); }
console.log("WebKit check: no errors");
