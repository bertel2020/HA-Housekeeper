class HAHousekeeperPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._hass = null;
    this.data = null;
    this.view = "overview";
    this.query = "";
    this.typeFilter = "";
    this.statusFilter = "";
    this.findingFilter = "";
    this.showIgnored = false;
    this.batteryFilter = "low";

    this._urlApplied = false;
    this.sort = "name";
    this.selected = null;
    this.detailTab = "overview";
    this.trail = [];
    this.compare = null;
    this.compareBaseline = "previous";
    this.compareLoading = false;
    this.graphSelected = null;
    this.details = new Map();
    this.detailLoading = false;
    this.graphQuery = "";
    this.pages = {};
    this.lv = {};
    this.unrefTab = "entities";
    this.cleanupSel = new Set();
    this.cleanupKind = "disable_entity";
    this.replOld = ""; this.replNew = "";
    this.meterOld = ""; this.meterNew = ""; this.meterMode = "both";
    this.preflight = null; this.costs = null; this.costSort = "recent"; this.costsLoading = false; this.preflightLoading = false;
    this.ack = new Set();
    this.confirmation = null;
    this.confirmWord = "";
    this.plan = null;
    this.journal = null;
    this.prefs = this.loadPrefs();
    this.pageSize = this.prefs.pageSize;
    this.sortDir = "asc";
    this.pages = {};
    this.busy = false;
    this.scanStatus = null;
    this.error = null;
    this.trend = null;
    this._rev = 0; // bumped when data is changed in place (ignore flags), so cached lists are rebuilt
    this._debug = this.debugEnabled();
  }

  set hass(value) {
    const first = !this._hass, wasDark = this._hass?.themes?.darkMode;
    this._hass = value;
    if (first) { this.load(false); this.loadUserPrefs(); }
    else if (this.prefs.mode === "auto" && wasDark !== value?.themes?.darkMode) this.render();
  }

  get hass() { return this._hass; }

  connectedCallback() {
    this._basePath = typeof window === "undefined" ? null : window.location.pathname;
    this.render();
  }

  get lang() { return String(this._hass?.language || "en").toLowerCase().startsWith("de") ? "de" : "en"; }

  t(key, vars) {
    const text = TEXT[this.lang][key] || TEXT.en[key] || key;
    return vars ? text.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "") : text;
  }

  esc(value) {
    return String(value ?? "—").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  }

  formatDate(value) {
    if (!value) return "—";
    try { return new Intl.DateTimeFormat(this.lang, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
    catch (_) { return value; }
  }

  formatNumber(value) { return new Intl.NumberFormat(this.lang).format(value ?? 0); }

  async load(fresh = false) {
    if (!this._hass || this.busy) return;
    if (this._warmupTimer) window.clearTimeout(this._warmupTimer);
    this.busy = true; this.error = null; this.render();
    let progressTimer = null;
    if (fresh) progressTimer = window.setInterval(() => this.updateScanStatus(), 250);
    try {
      this.data = await this._hass.callWS({ type: fresh ? "ha_housekeeper/scan" : "ha_housekeeper/inventory" });
      this.details = new Map();
      this.compare = null;
      this.applyUrl();
    } catch (err) {
      this.error = err?.message || String(err);
    } finally {
      if (progressTimer) window.clearInterval(progressTimer);
      this.scanStatus = null;
      this.busy = false; this.render();
    }
    if (this.view === "changes" && this.data) this.loadCompare();
    // Preliminary data: fetch the final scan once the backend's warm-up is over.
    if (this.data?.meta?.preliminary) {
      const wait = ((Number(this.data.meta.warmup_seconds_left) || 0) + 20) * 1000;
      this._warmupTimer = window.setTimeout(() => this.load(), wait);
    }
  }

  async updateScanStatus() {
    try {
      this.scanStatus = await this._hass.callWS({ type: "ha_housekeeper/status" });
      this.renderProgress();
    } catch (_) { /* The main scan request reports actionable errors. */ }
  }

  async openObject(obj) {
    if (this.selected && this.selected !== obj) this.trail.push(this.selected);
    if (this.selected !== obj) { this.detailTab = this._pendingTab || "overview"; this._pendingTab = null; }
    this.selected = obj;
    const key = this.objectKey(obj);
    if (this.details.has(key)) { this.render(); this.scrollIntoView?.({ block: "start" }); return; }
    this.detailLoading = true;
    this.render();
    this.scrollIntoView?.({ block: "start" });
    try {
      this.details.set(key, await this._hass.callWS({
        type: "ha_housekeeper/detail", object_type: obj.object_type, object_id: obj.object_id,
      }));
    } catch (_) { this.details.set(key, {}); }
    this.detailLoading = false;
    if (this.selected === obj) this.render();
  }

  goBack() { this.selected = this.trail.pop() || null; this.detailTab = "overview"; this.render(); }

  statusLabel(status) { return this.t(status); }

  objectKey(item) { return `${item.object_type}:${item.object_id}`; }

  findObject(key) {
    if (!this.data) return undefined;
    if (!this._index || this._indexSource !== this.data) {
      this._index = new Map(this.data.objects.map(item => [this.objectKey(item), item]));
      this._indexSource = this.data;
    }
    return this._index.get(key);
  }

  findingKey(finding) { return `${finding.rule_id.split(".")[0]}:${finding.object_id}`; }

  haPath(item) {
    switch (item.object_type) {
      case "entity": return `/config/entities?search=${encodeURIComponent(item.object_id)}`;
      case "device": return `/config/devices/device/${encodeURIComponent(item.object_id)}`;
      case "area": return `/config/areas/area/${encodeURIComponent(item.object_id)}`;
      case "automation": return item.automation_id
        ? `/config/automation/edit/${encodeURIComponent(item.automation_id)}`
        : `/config/entities?search=${encodeURIComponent(item.object_id)}`;
      case "script": return `/config/script/edit/${encodeURIComponent(item.object_id.replace(/^script\./, ""))}`;
      case "scene": return item.scene_id
        ? `/config/scene/edit/${encodeURIComponent(item.scene_id)}`
        : `/config/entities?search=${encodeURIComponent(item.object_id)}`;
      case "dashboard": return `/${encodeURIComponent(item.url_path || "lovelace")}`;
      case "config_entry": return `/config/integrations/integration/${encodeURIComponent(item.domain)}`;
      case "floor": return "/config/areas/dashboard";
      case "label": return "/config/labels";
      default: return null;
    }
  }

  navigateHA(path) {
    window.history.pushState(null, "", path);
    window.dispatchEvent(new CustomEvent("location-changed"));
  }

  // What a screen reader announces: scan, backup and plan progress, nothing while idle.
  liveStatus() {
    if (this.busy) return `${this.t("scanning")}${this.scanStatus?.running ? ` ${this.scanStatus.progress}%` : ""}`;
    const plan = this.plan;
    if (plan && (plan.status === "backup" || plan.status === "running")) {
      if (plan.status === "backup" || this.planProgress?.phase === "backup") return this.t("backupRunning");
      return `${this.t("running")} ${this.planProgress ? this.t("progressOf", { done: this.planProgress.done, total: this.planProgress.total }) : ""}`.trim();
    }
    return "";
  }

  // The sidebar is rebuilt with the page: keep its scroll position, and bring the current entry into
  // view when the view changed (on a small screen the navigation scrolls sideways).
  restoreSideScroll(saved) {
    const side = this.shadowRoot.querySelector?.(".side");
    if (!side) return;
    if (this._navView !== this.view && this._navView !== undefined) {
      this.shadowRoot.querySelector(".nav.active")?.scrollIntoView?.({ inline: "center", block: "nearest" });
    } else if (saved) { side.scrollLeft = saved.left; side.scrollTop = saved.top; }
    this._navView = this.view;
  }

  scanButtonInner() {
    const progress = this.scanStatus?.running ? ` ${this.scanStatus.progress}%` : "";
    return `<ha-icon icon="mdi:refresh"></ha-icon>${this.busy ? this.t("scanning") + progress : this.t("scan")}`;
  }

  // The scan status arrives every few hundred milliseconds: only the scan button and the status
  // line for screen readers change, so the page is not rebuilt for it.
  renderProgress() {
    const root = this.shadowRoot, button = root?.querySelector?.("[data-action='scan']");
    const live = root?.querySelector?.("[role='status']");
    if (!button || !live) { this.render(); return; }
    button.innerHTML = this.scanButtonInner();
    button.disabled = Boolean(this.busy || this.cleanupRunning());
    live.textContent = this.liveStatus();
  }

  // Search fields change their state at once but re-render after a short pause.
  scheduleRender() {
    if (this._searchTimer) globalThis.clearTimeout?.(this._searchTimer);
    this._searchTimer = this.defer(() => { this._searchTimer = null; this.render(); }, SEARCH_DEBOUNCE_MS);
  }

  defer(fn, ms) { return setTimeout(fn, ms); }

  debugEnabled() {
    try { return globalThis.localStorage?.getItem("hk_debug") === "1"; } catch (_) { return false; }
  }

  // A re-render replaces the page, so the focused control is found again by id or data attribute.
  captureFocus() {
    const el = this.shadowRoot?.activeElement;
    if (!el?.getAttribute) return null;
    let selector = null;
    if (el.id) selector = `#${el.id}`;
    else {
      for (const attr of el.attributes || []) {
        if (attr.name.startsWith("data-")) { selector = `${el.localName}[${attr.name}="${String(attr.value).replace(/["\\]/g, "\\$&")}"]`; break; }
      }
    }
    return selector ? { selector, start: el.selectionStart ?? null, end: el.selectionEnd ?? null } : null;
  }

  restoreFocus(saved) {
    if (!saved) return;
    let next = null;
    try { next = this.shadowRoot.querySelector(saved.selector); } catch (_) { return; }
    if (!next || next.disabled) return;
    next.focus({ preventScroll: true });
    if (saved.start !== null && next.setSelectionRange) {
      try { next.setSelectionRange(saved.start, saved.end); } catch (_) { /* not a text field */ }
    }
  }

  // Derived data is kept per data set; it is rebuilt when the data, a change in place or one of the
  // given values changes.
  memo(name, deps, build) {
    const cache = this._memo ||= new Map(), hit = cache.get(name);
    if (hit && hit.data === this.data && hit.rev === this._rev && hit.deps.length === deps.length && hit.deps.every((d, i) => d === deps[i])) return hit.value;
    const value = build();
    cache.set(name, { data: this.data, rev: this._rev, deps, value });
    return value;
  }

  // Collators are created once per language; creating one per comparison is slow.
  collators() {
    if (this._collators?.lang !== this.lang) {
      this._collators = { lang: this.lang, natural: new Intl.Collator(this.lang, { numeric: true, sensitivity: "base" }), ids: new Intl.Collator(this.lang, { numeric: true }), plain: new Intl.Collator() };
    }
    return this._collators;
  }

  // Edges by source and by target, plus every target that something uses (in edge order).
  edgeIndex() {
    return this.memo("edges", [], () => {
      const bySource = new Map(), byTarget = new Map(), used = new Set(), order = new Map();
      (this.data.edges || []).forEach((edge, i) => {
        order.set(edge, i);
        (bySource.get(edge.source) || bySource.set(edge.source, []).get(edge.source)).push(edge);
        (byTarget.get(edge.target) || byTarget.set(edge.target, []).get(edge.target)).push(edge);
        if (USAGE_RELATIONS.includes(edge.relation)) used.add(edge.target);
      });
      return { bySource, byTarget, used, order };
    });
  }

  edgesFrom(key) { return this.edgeIndex().bySource.get(key) || []; }

  edgesTo(key) { return this.edgeIndex().byTarget.get(key) || []; }

  render() {
    if (!this.shadowRoot) return;
    if (this._searchTimer) { globalThis.clearTimeout?.(this._searchTimer); this._searchTimer = null; }
    const started = this._debug ? globalThis.performance?.now?.() : null;
    const focus = this.captureFocus();
    const side = this.shadowRoot.querySelector?.(".side");
    const sideScroll = side ? { left: side.scrollLeft, top: side.scrollTop } : null;
    const shell = `<div class="shell">${this.sidebar()}<main class="main">${this.selected && this.data ? this.detail() : `${this.heading()}${this.content()}`}</main><div class="sr-only" role="status" aria-live="polite">${this.esc(this.liveStatus())}</div></div>`;
    // The style sheet is only parsed again when the theme changed; otherwise just the page is replaced.
    const root = this.shadowRoot, css = this.themeCss(), current = root.querySelector?.(".shell");
    if (current && this._styleKey === css && root.querySelector("style[data-hk]")) current.outerHTML = shell;
    else { root.innerHTML = `${this.styles()}${shell}`; this._styleKey = css; }
    this.restoreFocus(focus);
    this.restoreSideScroll(sideScroll);
    this.bind();
    if (started !== null) console.debug(`[ha_housekeeper] render ${this.selected ? "detail" : this.view}: ${(globalThis.performance.now() - started).toFixed(1)} ms`);
    if (this.data) this.syncUrl();
  }

  // Deep links: /ha-housekeeper?view=findingsNav&filter=orphaned or ?object=entity:sensor.x
  applyUrl() {
    if (this._urlApplied || typeof window === "undefined" || !this.data) return;
    this._urlApplied = true;
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");
    if (view && NAV.some(([name]) => name === view)) this.view = view;
    else if (!params.get("object") && this.prefs.startView !== "overview") this.view = this.prefs.startView;
    if (params.get("filter")) this.findingFilter = params.get("filter");
    this._pendingTab = params.get("tab");
    const obj = this.findObject(params.get("object") || "");
    if (obj) this.openObject(obj);
    else if (this.view === "changes" && !this.compare) this.loadCompare();
  }

  syncUrl() {
    if (typeof window === "undefined" || !this.isConnected || !window.history?.replaceState) return;
    if (window.location.pathname !== this._basePath) return; // HA already navigated elsewhere
    const params = new URLSearchParams();
    if (this.selected) {
      params.set("object", this.objectKey(this.selected));
      if (this.detailTab !== "overview") params.set("tab", this.detailTab);
    }
    else {
      if (this.view !== "overview") params.set("view", this.view);
      if (this.view === "findingsNav" && this.findingFilter) params.set("filter", this.findingFilter);
    }
    const query = params.toString();
    try { window.history.replaceState(window.history.state, "", window.location.pathname + (query ? `?${query}` : "")); } catch (_) { /* ignore */ }
  }

  sidebar() {
    const counts = this.data ? { inventory: this.formatNumber(this.data.meta.object_count), findingsNav: this.data.findings.filter(f => !f.ignored).length, batteries: this.lowBatteries().length || undefined } : {};
    return `<aside class="side"><div class="brand"><span class="brandmark"><img src="/ha_housekeeper/logo.png" alt="" onerror="this.parentNode.classList.add('nologo');this.remove()"><ha-icon icon="mdi:broom"></ha-icon></span><div><strong>${this.t("title")}</strong><small>${this.t("systemState")}</small></div></div>
      <nav aria-label="${this.esc(this.t("navMain"))}">${NAV_GROUPS.map(([label, views]) => `<div class="navgroup" role="group" aria-label="${this.esc(this.t(label))}"><p class="navhead" aria-hidden="true">${this.t(label)}</p>${views.map(view => `<button class="nav ${this.view === view ? "active" : ""}" data-view="${view}" ${this.view === view ? 'aria-current="page"' : ""}><ha-icon icon="${NAV_ICONS[view]}"></ha-icon><span>${this.t(view)}</span>${counts[view] !== undefined ? `<em>${counts[view]}</em>` : ""}</button>`).join("")}</div>`).join("")}</nav>
      <div class="side-foot"><button class="nav ${this.view === "settings" ? "active" : ""}" data-view="settings" ${this.view === "settings" ? 'aria-current="page"' : ""}><ha-icon icon="mdi:cog-outline"></ha-icon><span>${this.t("settings")}</span></button></div></aside>`;
  }

  heading() {
    const titles = {
      overview: [this.t("systemState"), this.t("health"), this.data ? `${this.t("lastScan")}: <b>${this.formatDate(this.data.meta.scanned_at)}</b>` : this.t("subtitle")],
      inventory: [this.t("objects"), this.t("inventory"), this.t("inventorySubtitle")],
      findingsNav: [this.t("diagnosis"), this.t("findings"), this.t("findingsSubtitle")],
      changes: [this.t("diagnosis"), this.t("changes"), this.t("changesSubtitle")],
      batteries: [this.t("objects"), this.t("batteries"), this.t("batteriesSubtitle")],
      unreferenced: [this.t("objects"), this.t("unreferenced"), this.t("unreferencedSubtitle")],
      graph: [this.t("graph"), this.t("pathTitle"), this.t("pathSubtitle")],
      settings: [this.t("objects"), this.t("settings"), this.t("settingsSubtitle")],
      cleanup: [this.t("diagnosis"), this.t("cleanup"), this.t("cleanupSubtitle")],
      maintenance: [this.t("diagnosis"), this.t("maintenance"), this.t("maintenanceSubtitle")],
    };
    const [eyebrow, title, sub] = titles[this.view] || titles.overview;
    return `<div class="heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><span class="sub">${sub}</span></div>
      <div class="head-actions"><span class="safe-badge" title="${this.esc(this.t("safeBadgeHint"))}"><ha-icon icon="mdi:shield-check-outline"></ha-icon>${this.t("safeBadge")}</span>
      <button class="btn primary" data-action="scan" ${this.busy || this.cleanupRunning() ? "disabled" : ""}>${this.scanButtonInner()}</button></div></div>${this.warmupBanner()}`;
  }

  content() {
    if (this.view === "settings") return this.settingsView();
    if (this.error) return `<div class="error"><strong>${this.t("loadError")}</strong><br>${this.esc(this.error)}</div>`;
    if (!this.data) return `<div class="panel loading"><ha-icon icon="mdi:loading"></ha-icon><p>${this.t("loading")}</p></div>`;
    if (this.view === "inventory") return this.inventory();
    if (this.view === "findingsNav") return this.findingsView();
    if (this.view === "changes") return this.changesView();
    if (this.view === "batteries") return this.batteriesView();
    if (this.view === "unreferenced") return this.unreferencedView();
    if (this.view === "cleanup") return this.cleanupView();
    if (this.view === "maintenance") return this.maintenanceView();
    if (this.view === "graph") return this.graph();
    return this.overview();
  }

  tone(status) { return STATUS_TONE[status] || "blue"; }

  pill(status) { return `<span class="pill ${this.tone(status)}">${this.esc(this.statusLabel(status))}</span>`; }

  tile(type, tone = "") { return `<span class="tile ${tone}"><ha-icon icon="${ICONS[type] || "mdi:help-circle-outline"}"></ha-icon></span>`; }

  findingType(f) { return this.findObject(this.findingKey(f))?.object_type || f.rule_id.split(".")[0]; }

  check(label, tone, value, badge) { return { label, tone, value, badge }; }

  bind() {
    const root = this.shadowRoot;
    root.querySelectorAll("[data-view]").forEach(el => el.onclick = () => { this.view = el.dataset.view; this.pages = {}; this.selected = null; this.trail = []; this.render(); if (this.view === "changes" && !this.compare) this.loadCompare(); });
    root.querySelectorAll("[data-action='scan']").forEach(el => el.addEventListener("click", () => this.load(true)));
    root.querySelector("[data-action='back']")?.addEventListener("click", () => this.goBack());
    root.querySelectorAll("[data-detail-tab]").forEach(el => {
      el.onclick = () => { this.detailTab = el.dataset.detailTab; this.render(); };
      el.onkeydown = ev => {
        const ids = [...root.querySelectorAll("[data-detail-tab]")].map(b => b.dataset.detailTab), at = ids.indexOf(el.dataset.detailTab);
        const next = { ArrowRight: ids[(at + 1) % ids.length], ArrowLeft: ids[(at - 1 + ids.length) % ids.length], Home: ids[0], End: ids[ids.length - 1] }[ev.key];
        if (!next) return;
        ev.preventDefault();
        this.detailTab = next;
        this.render();
        this.shadowRoot.querySelector(`[data-detail-tab="${next}"]`)?.focus();
      };
    });
    root.querySelectorAll("[data-graph-open]").forEach(el => el.onclick = () => {
      const obj = this.findObject(el.dataset.graphOpen);
      if (obj) { this.graphSelected = obj; this.graphQuery = ""; this.view = "graph"; this.selected = null; this.trail = []; this.render(); }
    });
    root.querySelectorAll("[data-jump]").forEach(el => el.onclick = () => {
      this.view = el.dataset.jump; this.pages = {};
      if (el.dataset.filter !== undefined) this.findingFilter = el.dataset.filter;
      if (el.dataset.jump === "inventory") { this.statusFilter = el.dataset.status || ""; this.typeFilter = el.dataset.type || ""; this.pages = {}; }
      this.render();
    });
    root.querySelectorAll("[data-type-jump]").forEach(el => el.onclick = () => { this.typeFilter = el.dataset.typeJump; this.statusFilter = ""; this.pages = {}; this.view = "inventory"; this.render(); });
    root.querySelectorAll("[data-export]").forEach(el => el.onclick = () => this.exportFindings(el.dataset.export));
    root.querySelector("[data-toggle-ignored]")?.addEventListener("click", () => { this.showIgnored = !this.showIgnored; this.pages = {}; this.render(); });
    root.querySelectorAll("[data-battery-filter]").forEach(el => el.onclick = () => { this.batteryFilter = el.dataset.batteryFilter; this.pages = {}; this.render(); });
    root.querySelectorAll("[data-ignore]").forEach(el => el.onclick = async () => {
      const key = el.dataset.ignore, ignored = el.dataset.ignoreValue === "1";
      try {
        await this._hass.callWS({ type: "ha_housekeeper/ignore", finding_key: key, ignored });
        const finding = this.data.findings.find(f => f.key === key);
        if (finding) { finding.ignored = ignored; finding.ignored_by = ignored ? "user" : null; this._rev++; }
      } catch (err) { this.error = err?.message || String(err); }
      this.render();
    });
    root.querySelectorAll("[data-finding-filter]").forEach(el => el.onclick = () => { this.findingFilter = el.dataset.findingFilter; this.pages = {}; this.render(); });
    const searchField = (selector, setter) => {
      const input = root.querySelector(selector);
      if (input) input.oninput = () => { setter(input.value); this.scheduleRender(); };
    };
    searchField("#query", v => { this.query = v; this.pages = {}; });
    searchField("#graphQuery", v => { this.graphQuery = v; });
    root.querySelectorAll("[data-baseline]").forEach(b => b.addEventListener("click", () => { this.compareBaseline = b.dataset.baseline; this.pages = {}; this.loadCompare(); }));
    const bl = root.querySelector("#baseline"); if (bl) bl.onchange = () => { this.compareBaseline = bl.value; this.pages = {}; this.loadCompare(); };
    const tf = root.querySelector("#typeFilter"); if (tf) tf.onchange = () => { this.typeFilter = tf.value; this.pages = {}; this.render(); };
    const sf = root.querySelector("#statusFilter"); if (sf) sf.onchange = () => { this.statusFilter = sf.value; this.pages = {}; this.render(); };
    const sk = root.querySelector("#sortKey"); if (sk) sk.onchange = () => { this.sort = sk.value; this.pages = {}; this.render(); };
    const sd = root.querySelector("#sortDir"); if (sd) sd.onclick = () => { this.sortDir = this.sortDir === "asc" ? "desc" : "asc"; this.pages = {}; this.render(); };
    root.querySelectorAll("th[data-sort]").forEach(el => el.onclick = () => {
      if (this.sort === el.dataset.sort) this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
      else { this.sort = el.dataset.sort; this.sortDir = "asc"; }
      this.pages = {}; this.render();
    });
    root.querySelectorAll("[data-object]").forEach(el => el.onclick = () => { const obj = this.findObject(el.dataset.object); if (obj) this.openObject(obj); });
    // Table rows are not native buttons: Enter and Space open them like a click.
    root.querySelectorAll("tr[data-object]").forEach(el => el.onkeydown = ev => {
      if (ev.target !== el || (ev.key !== "Enter" && ev.key !== " ")) return;
      ev.preventDefault();
      el.click();
    });
    root.querySelectorAll("[data-graph]").forEach(el => el.onclick = () => { const obj = this.findObject(el.dataset.graph); if (obj) { this.graphSelected = obj; this.graphQuery = ""; this.render(); } });
    root.querySelectorAll("[data-ha-path]").forEach(el => el.onclick = () => this.navigateHA(el.dataset.haPath));
    root.querySelectorAll("[data-pref]").forEach(el => el.onclick = () => { const [key, value] = el.dataset.pref.split("|"); this.setPref(key, value); });
    root.querySelectorAll("[data-pref-select]").forEach(el => el.onchange = () => this.setPref(el.dataset.prefSelect, el.value));
    root.querySelectorAll("[data-unref-tab]").forEach(el => el.onclick = () => { this.unrefTab = el.dataset.unrefTab; this.pages = {}; this.render(); });
    root.querySelectorAll("[data-sel]").forEach(el => el.onchange = () => { el.checked ? this.cleanupSel.add(el.dataset.sel) : this.cleanupSel.delete(el.dataset.sel); this.render(); });
    root.querySelector("[data-sel-page]")?.addEventListener("click", () => { (this._cleanupVisible || []).forEach(id => this.cleanupSel.add(id)); this.render(); });
    root.querySelector("[data-sel-clear]")?.addEventListener("click", () => { this.cleanupSel.clear(); this.render(); });
    const kind = root.querySelector("[data-cleanup-kind]"); if (kind) kind.onchange = () => { this.cleanupKind = kind.value; this.cleanupSel = new Set(); if (this.lv.cleanup) this.lv.cleanup.f = {}; this.pages = {}; this.render(); };
    root.querySelectorAll("[data-ack]").forEach(el => el.onchange = () => { el.checked ? this.ack.add(el.dataset.ack) : this.ack.delete(el.dataset.ack); this.render(); });
    root.querySelector("[data-plan-confirm]")?.addEventListener("click", () => this.confirmPlan());
    const word = root.querySelector("[data-confirm-word]");
    if (word) word.oninput = () => {
      this.confirmWord = word.value;
      const run = this.shadowRoot.querySelector("[data-plan-execute]");
      if (run) run.disabled = word.value.trim().toUpperCase() !== this.planWord(this.plan);
    };
    root.querySelector("[data-plan-execute]")?.addEventListener("click", () => this.executePlan());
    root.querySelector("[data-plan-cancel]")?.addEventListener("click", () => this.cancelPlan());
    root.querySelector("[data-undo-all]")?.addEventListener("click", () => this.undoPlan());
    root.querySelectorAll("[data-undo-one]").forEach(el => el.onclick = () => this.undoPlan([el.dataset.undoOne]));
    root.querySelector("[data-plan-create]")?.addEventListener("click", () => this.createPlan());
    root.querySelector("[data-repl-old]")?.addEventListener("change", e => { this.replOld = e.target.value.trim(); if (this.replNew && this.replNew.split(".")[0] !== this.replOld.split(".")[0]) this.replNew = ""; this.render(); });
    root.querySelector("[data-repl-new]")?.addEventListener("change", e => { this.replNew = e.target.value.trim(); this.render(); });
    root.querySelector("[data-meter-old]")?.addEventListener("change", e => { this.meterOld = e.target.value.trim(); if (this.meterNew && this.meterNew.split(".")[0] !== this.meterOld.split(".")[0]) this.meterNew = ""; this.render(); });
    root.querySelector("[data-meter-new]")?.addEventListener("change", e => { this.meterNew = e.target.value.trim(); this.render(); });
    root.querySelector("[data-meter-mode]")?.addEventListener("change", e => { this.meterMode = e.target.value; this.render(); });
    root.querySelector("[data-costs-load]")?.addEventListener("click", ev => this.loadCosts(ev.currentTarget.hasAttribute("data-refresh")));
    root.querySelectorAll("[data-cost-sort]").forEach(el => el.onclick = () => { this.costSort = el.dataset.costSort; this.render(); });
    root.querySelector("[data-pf-refresh]")?.addEventListener("click", () => this.loadPreflight());
    root.querySelector("[data-pf-save]")?.addEventListener("click", () => this.loadPreflight("save"));
    root.querySelector("[data-pf-clear]")?.addEventListener("click", () => this.loadPreflight("clear"));
    root.querySelector("[data-copy-snippet]")?.addEventListener("click", async () => {
      try { await globalThis.navigator?.clipboard?.writeText(this.exclusionSnippet()); this.snippetCopied = true; } catch (_) { this.snippetCopied = false; }
      this.render();
      setTimeout(() => { this.snippetCopied = false; this.render(); }, 1500);
    });
    root.querySelector("[data-plan-close]")?.addEventListener("click", () => { this.plan = null; this.render(); });
    root.querySelectorAll("[data-plan-open]").forEach(el => el.onclick = () => this.openPlan(el.dataset.planOpen));
    root.querySelectorAll("[data-plan-delete]").forEach(el => el.onclick = () => this.deletePlan(el.dataset.planDelete));
    root.querySelector("[data-opts-save]")?.addEventListener("click", () => this.saveOptions());
    root.querySelector("[data-pref-reset]")?.addEventListener("click", () => { this.prefs = { ...DEFAULT_PREFS }; this.pageSize = DEFAULT_PREFS.pageSize; this.pages = {}; this.savePrefs(); this.render(); });
    root.querySelector("[data-copy-info]")?.addEventListener("click", async () => {
      try { await globalThis.navigator?.clipboard?.writeText(this.infoText()); this.copied = true; } catch (_) { this.copied = false; }
      this.render();
      setTimeout(() => { this.copied = false; this.render(); }, 1500);
    });
    root.querySelectorAll("[data-lq]").forEach(input => input.oninput = () => {
      this.lv[input.dataset.lq].q = input.value; this.pages = {};
      this.scheduleRender();
    });
    root.querySelectorAll("[data-lf]").forEach(el => el.onchange = () => { const [id, name] = el.dataset.lf.split("|"); this.lv[id].f[name] = el.value; this.pages = {}; this.render(); });
    root.querySelectorAll("[data-ls]").forEach(el => el.onchange = () => { const st = this.lv[el.dataset.ls]; st.sort = el.value; st.dir = this.lvDirs[el.dataset.ls][el.value] || "asc"; this.pages = {}; this.render(); });
    root.querySelectorAll("[data-ld]").forEach(el => el.onclick = () => { const st = this.lv[el.dataset.ld]; st.dir = st.dir === "desc" ? "asc" : "desc"; this.pages = {}; this.render(); });
    root.querySelectorAll("[data-lpage]").forEach(el => el.onclick = () => { const [id, n] = el.dataset.lpage.split("|"); this.pages[id] = Number(n); this.render(); });
    root.querySelectorAll("[data-pagesize]").forEach(el => el.onchange = () => { this.pageSize = Number(el.value); this.pages = {}; this.render(); });
  }
}
