// FlowMixin: the "Ablauf" tab of an automation or script: triggers, conditions and actions as a readable tree; mixed in by 99-register.js.
// The configuration is the one the detail request already delivers; nothing here reads Home Assistant.
const FLOW_NESTED = ["sequence", "then", "else", "default", "parallel", "conditions", "condition", "choose", "if", "repeat"];
const FLOW_LIMIT = 300;
const FLOW_DEPTH = 6;
const FLOW_REF_KEYS = ["entity_id", "device_id", "area_id", "floor_id", "label_id"];

class FlowMixin {
  // The concrete ids a block names itself (not what its nested blocks name): target, data and the block's own keys.
  flowRefs(step) {
    const out = [];
    const take = (type, value) => {
      for (const v of Array.isArray(value) ? value : [value]) {
        if (typeof v === "string" && v && !["all", "none"].includes(v) && !v.includes("{{") && !v.startsWith("!input")) out.push([type, v]);
      }
    };
    const walk = (node, depth) => {
      if (!node || typeof node !== "object" || Array.isArray(node) || depth > 3) return;
      for (const [k, v] of Object.entries(node)) {
        if (FLOW_NESTED.includes(k)) continue;
        if (FLOW_REF_KEYS.includes(k)) take(k.replace("_id", ""), v);
        else if (typeof v === "object") walk(v, depth + 1);
      }
    };
    walk(step, 0);
    return out;
  }

  flowType(step, kind) {
    if (!step || typeof step !== "object") return "unknown";
    if (kind === "trigger") return step.trigger || step.platform || "unknown";
    if (kind === "condition") return step.condition || "unknown";
    for (const key of ["choose", "if", "repeat", "parallel", "sequence", "wait_template", "wait_for_trigger", "delay", "variables", "stop", "event", "scene", "set_conversation_response"]) if (key in step) return key;
    if ("action" in step || "service" in step) return "action";
    if ("condition" in step) return "condition";
    if (step.device_id && step.domain && step.type) return "device";
    return "unknown";
  }

  flowLabel(type) { const key = `flow_${type}`; const text = this.t(key); return text === key ? type : text; }

  // One line of facts for a block, built from the keys people look for first.
  flowFacts(step, type) {
    const facts = [];
    const add = v => { if (v !== undefined && v !== null && v !== "" && typeof v !== "object") facts.push(String(v)); };
    if (step.alias) add(step.alias);
    if (type === "action") add(step.action || step.service);
    if (["state", "numeric_state"].includes(type)) { add(step.attribute); add(step.from !== undefined ? `${this.t("flowFrom")} ${step.from}` : ""); add(step.to !== undefined ? `${this.t("flowTo")} ${step.to}` : ""); add(step.state !== undefined ? `= ${Array.isArray(step.state) ? step.state.join(", ") : step.state}` : ""); add(step.above !== undefined ? `> ${step.above}` : ""); add(step.below !== undefined ? `< ${step.below}` : ""); }
    if (["time", "sun"].includes(type)) { add(step.at); add(step.event); add(step.after); add(step.before); add(step.offset); }
    if (type === "time_pattern") add([step.hours, step.minutes, step.seconds].filter(x => x !== undefined).join(":"));
    if (type === "event") add(step.event_type);
    if (type === "delay") add(typeof step.delay === "object" ? Object.entries(step.delay).map(([k, v]) => `${v} ${k}`).join(" ") : step.delay);
    if (type === "wait_template") add(this.t("flowTemplate"));
    if (type === "template") add(this.t("flowTemplate"));
    if (type === "repeat") { const r = step.repeat || {}; add(r.count !== undefined ? `${r.count}×` : r.while ? this.t("flowWhile") : r.until ? this.t("flowUntil") : r.for_each !== undefined ? this.t("flowForEach") : ""); }
    if (type === "choose") add(this.t("flowBranches", { n: (step.choose || []).length }));
    if (type === "stop") add(step.stop);
    if (type === "device") add(`${step.domain} · ${step.type}`);
    if (step.for !== undefined && type === "state") add(`${this.t("flowFor")} ${typeof step.for === "object" ? Object.values(step.for).join(":") : step.for}`);
    if (step.continue_on_error) add(this.t("flowContinueOnError"));
    if (step.enabled === false) add(this.t("flowDisabled"));
    return facts;
  }

  flowRefButton([type, id]) {
    const key = `${type}:${id}`, obj = this.findObject(key);
    return obj
      ? `<button class="chip flowref" data-object="${this.esc(key)}">${this.esc(obj.name || id)}</button>`
      : `<span class="chip flowref missing" title="${this.esc(id)}">${this.esc(id)} · ${this.t("missing")}</span>`;
  }

  // Locations of the findings of this object, with the root keys of the lists made equal ("actions" and "action").
  flowNormal(path) { return String(path).replace(/^(trigger|condition|action)s?(?=\/|$)/, "$1").replace(/\/conditions?\//g, "/condition/"); }

  // One block and what it contains. `ctx` carries the counter, the finding places and the kind of the list.
  flowNode(step, path, kind, depth, ctx) {
    if (ctx.count >= FLOW_LIMIT) { ctx.cut += 1; return ""; }
    ctx.count += 1;
    const type = this.flowType(step, kind);
    const refs = this.flowRefs(step);
    const broken = ctx.places.some(place => place.startsWith(this.flowNormal(path))) || refs.some(([t, id]) => !this.findObject(`${t}:${id}`));
    const facts = this.flowFacts(step, type).map(f => this.esc(f)).join(" · ");
    const head = `<span class="fhead"><ha-icon icon="${FLOW_ICONS[type] || "mdi:circle-small"}"></ha-icon><b>${this.esc(this.flowLabel(type))}</b>${facts ? `<span class="ffacts">${facts}</span>` : ""}${refs.map(r => this.flowRefButton(r)).join("")}<code class="fpath">${this.esc(path)}</code></span>`;
    const kids = depth >= FLOW_DEPTH ? "" : this.flowChildren(step, type, path, depth, ctx);
    const cls = `fstep${broken ? " broken" : ""}`;
    return kids ? `<details class="${cls}" open><summary>${head}</summary><div class="fkids">${kids}</div></details>` : `<div class="${cls}">${head}</div>`;
  }

  flowList(list, path, kind, depth, ctx) {
    return (Array.isArray(list) ? list : list ? [list] : []).map((step, i) => this.flowNode(step, `${path}/${i}`, kind, depth + 1, ctx)).join("");
  }

  flowGroup(label, body) { return body ? `<div class="fgroup"><small>${this.esc(label)}</small>${body}</div>` : ""; }

  flowChildren(step, type, path, depth, ctx) {
    if (type === "choose") {
      const branches = (step.choose || []).map((b, i) => `<div class="fbranch"><b>${this.t("flowBranch", { n: i + 1 })}</b>${this.flowGroup(this.t("flowIf"), this.flowList(b.conditions ?? b.condition, `${path}/choose/${i}/conditions`, "condition", depth + 1, ctx))}${this.flowGroup(this.t("flowThen"), this.flowList(b.sequence, `${path}/choose/${i}/sequence`, "action", depth + 1, ctx))}</div>`).join("");
      return branches + this.flowGroup(this.t("flowElse"), this.flowList(step.default, `${path}/default`, "action", depth, ctx));
    }
    if (type === "if") return this.flowGroup(this.t("flowIf"), this.flowList(step.if, `${path}/if`, "condition", depth, ctx)) + this.flowGroup(this.t("flowThen"), this.flowList(step.then, `${path}/then`, "action", depth, ctx)) + this.flowGroup(this.t("flowElse"), this.flowList(step.else, `${path}/else`, "action", depth, ctx));
    if (type === "repeat") { const r = step.repeat || {}; return this.flowList(r.sequence, `${path}/repeat/sequence`, "action", depth, ctx) + this.flowGroup(this.t("flowWhile"), this.flowList(r.while, `${path}/repeat/while`, "condition", depth, ctx)) + this.flowGroup(this.t("flowUntil"), this.flowList(r.until, `${path}/repeat/until`, "condition", depth, ctx)); }
    if (type === "parallel") return this.flowList(step.parallel, `${path}/parallel`, "action", depth, ctx);
    if (type === "sequence") return this.flowList(step.sequence, `${path}/sequence`, "action", depth, ctx);
    if (["and", "or", "not"].includes(type)) return this.flowList(step.conditions, `${path}/conditions`, "condition", depth, ctx);
    return "";
  }

  flowCard(item, key) {
    const script = item.object_type === "script";
    const places = (this.data?.findings || []).filter(f => this.findingKey(f) === key && !f.ignored).map(f => this.flowNormal(f.evidence?.[0]?.location || "")).filter(Boolean);
    const ctx = { count: 0, cut: 0, places };
    const root = script ? ["sequence"] : ["trigger", "condition", "action"];
    const blocks = script ? [["actions", item.actions, "sequence", "action"]] : [["triggers", item.triggers, "trigger", "trigger"], ["conditions", item.conditions, "condition", "condition"], ["actions", item.actions, "action", "action"]];
    const sections = blocks.map(([label, list, path, kind]) => {
      const body = this.flowList(list, root.length === 1 ? "sequence" : path, kind, 0, ctx);
      return `<section class="panel"><div class="panelhead"><h2>${this.t(label)} <em class="date">${this.formatNumber((list || []).length)}</em></h2></div><div class="fflow">${body || `<p class="factnote">${this.t(label === "conditions" ? "flowNoConditions" : "flowNone")}</p>`}</div></section>`;
    }).join("");
    const facts = [item.mode ? [this.t("flowMode"), item.mode] : null, item.max ? [this.t("flowMax"), item.max] : null].filter(Boolean).map(([k, v]) => `<span><small>${k}</small><b>${this.esc(String(v))}</b></span>`).join("");
    const cut = ctx.cut ? `<p class="factnote">${this.t("flowCut", { n: ctx.cut })}</p>` : "";
    return `<div class="stack">${facts ? `<div class="panel sumline">${facts}</div>` : ""}${sections}${cut}<p class="factnote">${this.t("flowNote")}</p></div>`;
  }
}

const FLOW_ICONS = {
  state: "mdi:toggle-switch-outline", numeric_state: "mdi:numeric", time: "mdi:clock-outline", time_pattern: "mdi:timer-sand", sun: "mdi:weather-sunny", event: "mdi:lightning-bolt-outline", template: "mdi:code-braces", webhook: "mdi:webhook", mqtt: "mdi:message-text-outline", homeassistant: "mdi:home-assistant", zone: "mdi:map-marker-outline", device: "mdi:devices", trigger: "mdi:flash-outline",
  action: "mdi:play-circle-outline", choose: "mdi:source-branch", if: "mdi:help-rhombus-outline", repeat: "mdi:repeat", parallel: "mdi:call-split", sequence: "mdi:format-list-numbered", wait_template: "mdi:timer-sand-empty", wait_for_trigger: "mdi:timer-sand-empty", delay: "mdi:timer-outline", variables: "mdi:variable", stop: "mdi:stop-circle-outline", scene: "mdi:palette-outline", and: "mdi:set-all", or: "mdi:set-merge", not: "mdi:not-equal-variant", condition: "mdi:filter-outline",
};
