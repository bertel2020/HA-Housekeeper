const TEXT = {
  de: {
    title: "Housekeeper", subtitle: "Deine Home-Assistant-Installation im Blick",
    overview: "Übersicht", inventory: "Inventar", graph: "Abhängigkeiten",
    scan: "Neu scannen", scanning: "Scan läuft …", all: "Alle Typen",
    allStatus: "Alle Zustände", search: "Name, ID, Integration …",
    name: "Name", type: "Typ", status: "Zustand", reason: "Begründung",
    since: "Beobachtet seit", dependencies: "Beziehungen", objects: "Objekte",
    findings: "Befunde", active: "Aktiv", orphaned: "Verwaist",
    unavailable: "Nicht verfügbar", disabled: "Deaktiviert", unknown: "Unbekannt",
    empty: "Leer", problem: "Problem", details: "Details", close: "Schließen",
    noResults: "Keine passenden Objekte gefunden.", readOnly: "Schreibgeschützt",
    lastScan: "Letzter Scan", evidence: "Nachweis", registry: "Registry",
    state: "Zustand & Attribute", incoming: "Eingehend", outgoing: "Ausgehend",
    graphHint: "Wähle ein Objekt aus, um seine direkten Beziehungen zu untersuchen.",
    select: "Objekt auswählen", firstObservation: "Erster durch Housekeeper bestätigter Zeitpunkt",
    entity: "Entity", device: "Gerät", config_entry: "Integration", area: "Bereich",
    automation: "Automation", entity_disabled: "Entity wurde deaktiviert",
    floor: "Etage", label: "Label", broken_reference: "Defekte Referenz",
    triggers: "Trigger", conditions: "Bedingungen", actions: "Aktionen",
    automationStructure: "Automationsstruktur", previous: "Zurück", next: "Weiter",
    page: "Seite", of: "von", missingReferences: "Fehlende Referenzen",
    integration_disabled: "Zugehörige Integration wurde deaktiviert",
    device_disabled: "Zugehöriges Gerät wurde deaktiviert",
    device_missing: "Zugehöriges Gerät existiert nicht mehr in der Geräte-Registry",
    config_entry_missing: "Zugehöriger Konfigurationseintrag fehlt",
    state_missing: "Entity ist registriert, besitzt aber keinen Zustand",
    state_unavailable: "Integration meldet den Zustand unavailable",
    state_unknown: "Integration meldet den Zustand unknown", state_available: "Zustand ist verfügbar",
    loading: "Inventar wird geladen …", loadError: "Inventar konnte nicht geladen werden",
    total: "Gesamt", riskNotice: "Diese Version analysiert ausschließlich und nimmt keine Änderungen vor.",
    recentFindings: "Aktuelle Befunde", affected: "Betroffenes Objekt",
  },
  en: {
    title: "Housekeeper", subtitle: "Keep your Home Assistant installation in view",
    overview: "Overview", inventory: "Inventory", graph: "Dependencies",
    scan: "Scan now", scanning: "Scanning …", all: "All types",
    allStatus: "All states", search: "Name, ID, integration …",
    name: "Name", type: "Type", status: "Status", reason: "Reason",
    since: "Observed since", dependencies: "Relations", objects: "Objects",
    findings: "Findings", active: "Active", orphaned: "Orphaned",
    unavailable: "Unavailable", disabled: "Disabled", unknown: "Unknown",
    empty: "Empty", problem: "Problem", details: "Details", close: "Close",
    noResults: "No matching objects found.", readOnly: "Read only",
    lastScan: "Last scan", evidence: "Evidence", registry: "Registry",
    state: "State & attributes", incoming: "Incoming", outgoing: "Outgoing",
    graphHint: "Select an object to inspect its direct relationships.",
    select: "Select object", firstObservation: "First confirmed observation by Housekeeper",
    entity: "Entity", device: "Device", config_entry: "Integration", area: "Area",
    automation: "Automation", entity_disabled: "Entity was disabled",
    floor: "Floor", label: "Label", broken_reference: "Broken reference",
    triggers: "Triggers", conditions: "Conditions", actions: "Actions",
    automationStructure: "Automation structure", previous: "Previous", next: "Next",
    page: "Page", of: "of", missingReferences: "Missing references",
    integration_disabled: "Related integration was disabled",
    device_disabled: "Related device was disabled",
    device_missing: "Related device no longer exists in the device registry",
    config_entry_missing: "Related config entry is missing",
    state_missing: "Entity is registered but has no state",
    state_unavailable: "Integration reports unavailable",
    state_unknown: "Integration reports unknown", state_available: "State is available",
    loading: "Loading inventory …", loadError: "Could not load inventory",
    total: "Total", riskNotice: "This version only analyses and makes no changes.",
    recentFindings: "Current findings", affected: "Affected object",
  },
};

const ICONS = {
  entity: "mdi:shape-outline", device: "mdi:devices", config_entry: "mdi:puzzle-outline",
  area: "mdi:floor-plan", automation: "mdi:robot-outline", floor: "mdi:layers-outline",
  label: "mdi:label-outline",
};

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
    this.sort = "name";
    this.selected = null;
    this.page = 1;
    this.pageSize = 100;
    this.busy = false;
    this.scanStatus = null;
    this.error = null;
  }

  set hass(value) {
    const first = !this._hass;
    this._hass = value;
    if (first) this.load(false);
  }
  get hass() { return this._hass; }

  connectedCallback() { this.render(); }

  get lang() { return String(this._hass?.language || "en").toLowerCase().startsWith("de") ? "de" : "en"; }
  t(key) { return TEXT[this.lang][key] || TEXT.en[key] || key; }
  esc(value) {
    return String(value ?? "—").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  }
  formatDate(value) {
    if (!value) return "—";
    try { return new Intl.DateTimeFormat(this.lang, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
    catch (_) { return value; }
  }

  async load(fresh = false) {
    if (!this._hass || this.busy) return;
    this.busy = true; this.error = null; this.render();
    let progressTimer = null;
    if (fresh) progressTimer = window.setInterval(() => this.updateScanStatus(), 250);
    try {
      this.data = await this._hass.callWS({ type: fresh ? "ha_housekeeper/scan" : "ha_housekeeper/inventory" });
    } catch (err) {
      this.error = err?.message || String(err);
    } finally {
      if (progressTimer) window.clearInterval(progressTimer);
      this.scanStatus = null;
      this.busy = false; this.render();
    }
  }

  async updateScanStatus() {
    try {
      this.scanStatus = await this._hass.callWS({ type: "ha_housekeeper/status" });
      this.render();
    } catch (_) { /* The main scan request reports actionable errors. */ }
  }

  filtered() {
    if (!this.data) return [];
    const q = this.query.trim().toLowerCase();
    return this.data.objects.filter(item => {
      const haystack = [item.name, item.object_id, item.platform, item.domain, item.unique_id].join(" ").toLowerCase();
      return (!q || haystack.includes(q)) && (!this.typeFilter || item.object_type === this.typeFilter)
        && (!this.statusFilter || item.status === this.statusFilter);
    }).sort((a, b) => {
      const left = this.sort === "status" ? a.status : this.sort === "type" ? a.object_type : (a.name || a.object_id);
      const right = this.sort === "status" ? b.status : this.sort === "type" ? b.object_type : (b.name || b.object_id);
      return String(left).localeCompare(String(right), this.lang, { numeric: true, sensitivity: "base" });
    });
  }

  statusLabel(status) { return this.t(status); }
  objectKey(item) { return `${item.object_type}:${item.object_id}`; }
  findObject(key) { return this.data?.objects.find(item => this.objectKey(item) === key); }

  styles() {
    return `<style>
      :host{display:block;min-height:100%;background:var(--primary-background-color,#f4f6f8);color:var(--primary-text-color,#182026);font-family:var(--paper-font-body1_-_font-family,Inter,system-ui,sans-serif)}
      *{box-sizing:border-box} button,input,select{font:inherit} button{cursor:pointer}
      .shell{max-width:1500px;margin:auto;padding:28px clamp(16px,3vw,40px) 60px}
      header{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:22px}
      .brand{display:flex;align-items:center;gap:14px}.brandmark{width:48px;height:48px;border-radius:15px;background:linear-gradient(145deg,#15a58a,#087c72);display:grid;place-items:center;color:white;box-shadow:0 8px 22px #087c7240}.brandmark ha-icon{--mdc-icon-size:28px}
      h1{font-size:25px;margin:0;line-height:1.1}.subtitle{margin:5px 0 0;color:var(--secondary-text-color,#687078);font-size:14px}
      .actions{display:flex;align-items:center;gap:10px}.readonly{font-size:12px;padding:6px 10px;border-radius:99px;color:#087c72;background:#d9f4ef;font-weight:700;text-transform:uppercase;letter-spacing:.04em}
      .primary{border:0;border-radius:10px;background:var(--primary-color,#0b897b);color:white;padding:10px 15px;font-weight:650;display:flex;align-items:center;gap:7px}.primary[disabled]{opacity:.6;cursor:wait}
      nav{display:flex;gap:4px;border-bottom:1px solid var(--divider-color,#dfe3e7);margin-bottom:22px}nav button{border:0;background:none;color:var(--secondary-text-color,#667);padding:12px 16px;border-bottom:3px solid transparent;font-weight:650}nav button.active{color:var(--primary-color,#087c72);border-color:var(--primary-color,#087c72)}
      .notice{display:flex;align-items:center;gap:9px;background:#e6f5f2;color:#12655d;border:1px solid #bce2db;border-radius:12px;padding:11px 14px;margin-bottom:18px;font-size:13px}
      .stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:20px}.stat{background:var(--card-background-color,#fff);border:1px solid var(--divider-color,#e3e6e8);border-radius:16px;padding:18px;box-shadow:0 2px 8px #00000009}.stat-label{color:var(--secondary-text-color,#687078);font-size:13px}.stat-value{font-size:29px;font-weight:750;margin-top:7px}.stat.orphaned .stat-value{color:#d36b19}.stat.unavailable .stat-value{color:#c14343}.stat.disabled .stat-value{color:#71777d}
      .panel{background:var(--card-background-color,#fff);border:1px solid var(--divider-color,#e1e5e8);border-radius:16px;overflow:hidden;box-shadow:0 3px 12px #0000000a}.panelhead{display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid var(--divider-color,#e5e7e9)}.panelhead h2{font-size:17px;margin:0}.muted{color:var(--secondary-text-color,#687078);font-size:13px}
      .breakdown{display:grid;grid-template-columns:repeat(5,1fr);gap:1px;background:var(--divider-color,#e5e7e9)}.breakdown button{border:0;background:var(--card-background-color,#fff);padding:22px;text-align:left;color:inherit}.breakdown button:hover{background:var(--secondary-background-color,#f6f7f8)}.kind{display:flex;align-items:center;gap:10px;color:var(--secondary-text-color,#687078);font-size:13px}.kind ha-icon{color:var(--primary-color,#087c72)}.count{font-size:24px;font-weight:730;margin-top:8px}
      .filters{display:grid;grid-template-columns:minmax(240px,1fr) 190px 190px;gap:10px;padding:14px;border-bottom:1px solid var(--divider-color,#e5e7e9)}input,select{border:1px solid var(--divider-color,#d6dadd);border-radius:10px;background:var(--card-background-color,#fff);color:inherit;padding:10px 12px;min-width:0}input:focus,select:focus{outline:2px solid color-mix(in srgb,var(--primary-color,#087c72) 30%,transparent);border-color:var(--primary-color,#087c72)}
      table{border-collapse:collapse;width:100%}th{text-align:left;color:var(--secondary-text-color,#687078);font-size:12px;text-transform:uppercase;letter-spacing:.04em;padding:12px 16px;background:var(--secondary-background-color,#f7f8f9);cursor:pointer}td{padding:12px 16px;border-top:1px solid var(--divider-color,#eceeef);font-size:14px}tbody tr{cursor:pointer}tbody tr:hover{background:var(--secondary-background-color,#f7faf9)}.object{display:flex;align-items:center;gap:11px;min-width:260px}.object ha-icon{color:var(--primary-color,#087c72)}.object strong{display:block}.id{display:block;color:var(--secondary-text-color,#778087);font-family:ui-monospace,SFMono-Regular,monospace;font-size:11px;margin-top:3px;max-width:390px;overflow:hidden;text-overflow:ellipsis}
      .badge{display:inline-flex;align-items:center;gap:6px;border-radius:99px;padding:5px 9px;font-size:12px;font-weight:650;background:#e4f4ef;color:#137261}.badge:before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}.badge.orphaned{background:#fff0e2;color:#bc5c12}.badge.unavailable,.badge.problem{background:#fde9e9;color:#b83838}.badge.disabled,.badge.empty{background:#eceeef;color:#626a70}.badge.unknown{background:#eee9fb;color:#6651a5}
      .emptymsg,.loading{padding:50px;text-align:center;color:var(--secondary-text-color,#687078)}.error{padding:18px;border-radius:12px;background:#fdeaea;color:#a92f2f}.tablewrap{overflow:auto}.tablefoot{padding:12px 16px;border-top:1px solid var(--divider-color,#e5e7e9);color:var(--secondary-text-color,#687078);font-size:12px;display:flex;align-items:center;justify-content:space-between}.pager button{border:1px solid var(--divider-color,#d6dadd);background:var(--card-background-color,#fff);color:inherit;border-radius:7px;padding:5px 8px}.pager button:disabled{opacity:.4}
      .graphlayout{display:grid;grid-template-columns:300px 1fr;min-height:520px}.graphlist{border-right:1px solid var(--divider-color,#e5e7e9);padding:14px}.graphlist select{width:100%}.canvas{padding:28px;position:relative;background:radial-gradient(circle at 1px 1px,var(--divider-color,#dce1e3) 1px,transparent 1px);background-size:22px 22px}.graph-empty{display:grid;place-items:center;height:430px;color:var(--secondary-text-color,#687078);text-align:center}.node-center{max-width:420px;margin:150px auto 30px;background:var(--card-background-color,#fff);border:2px solid var(--primary-color,#087c72);border-radius:14px;padding:16px;box-shadow:0 8px 24px #0002;text-align:center}.relations{display:grid;grid-template-columns:1fr 1fr;gap:16px}.relation-col h3{font-size:13px;color:var(--secondary-text-color,#687078);text-transform:uppercase}.rel{background:var(--card-background-color,#fff);border:1px solid var(--divider-color,#dce1e3);border-radius:10px;padding:10px;margin:8px 0;font-size:12px}.rel strong{display:block;margin-bottom:3px}.relation{color:var(--primary-color,#087c72);font-size:10px;font-weight:700}
      .drawerback{position:fixed;inset:0;background:#0006;z-index:10}.drawer{position:fixed;right:0;top:0;bottom:0;width:min(620px,94vw);background:var(--card-background-color,#fff);z-index:11;box-shadow:-8px 0 30px #0003;overflow:auto}.drawerhead{position:sticky;top:0;background:var(--card-background-color,#fff);z-index:1;display:flex;align-items:flex-start;justify-content:space-between;padding:22px;border-bottom:1px solid var(--divider-color,#e2e5e7)}.drawerhead h2{margin:4px 0;font-size:20px}.iconbtn{border:0;background:var(--secondary-background-color,#f0f2f3);color:inherit;width:38px;height:38px;border-radius:50%;display:grid;place-items:center}.drawerbody{padding:22px}.section{margin-bottom:24px}.section h3{font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:var(--secondary-text-color,#687078);margin:0 0 10px}.kv{display:grid;grid-template-columns:155px 1fr;gap:8px 14px;font-size:13px}.kv dt{color:var(--secondary-text-color,#687078)}.kv dd{margin:0;overflow-wrap:anywhere}.code{white-space:pre-wrap;word-break:break-word;background:var(--secondary-background-color,#f4f5f6);border-radius:10px;padding:12px;font:11px/1.55 ui-monospace,SFMono-Regular,monospace;max-height:270px;overflow:auto}.why{padding:13px;border-radius:10px;background:#fff4e8;color:#924b12;margin:12px 0}.why.active{background:#e5f5ef;color:#126b59}
      @media(max-width:800px){.shell{padding:18px 10px 40px}header{align-items:flex-start}.subtitle,.readonly{display:none}.stats{grid-template-columns:1fr 1fr}.breakdown{grid-template-columns:1fr 1fr}.filters{grid-template-columns:1fr}.graphlayout{grid-template-columns:1fr}.graphlist{border-right:0;border-bottom:1px solid var(--divider-color,#ddd)}th:nth-child(3),td:nth-child(3),th:nth-child(5),td:nth-child(5){display:none}}
    </style>`;
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `${this.styles()}<div class="shell">${this.header()}${this.content()}</div>${this.drawer()}`;
    this.bind();
  }

  header() {
    const progress = this.scanStatus?.running ? ` ${this.scanStatus.progress}%` : "";
    return `<header><div class="brand"><div class="brandmark"><ha-icon icon="mdi:broom"></ha-icon></div><div><h1>HA ${this.t("title")}</h1><p class="subtitle">${this.t("subtitle")}</p></div></div><div class="actions"><span class="readonly">${this.t("readOnly")}</span><button class="primary" data-action="scan" ${this.busy ? "disabled" : ""}><ha-icon icon="mdi:refresh"></ha-icon>${this.busy ? this.t("scanning")+progress : this.t("scan")}</button></div></header>
      <nav>${["overview","inventory","graph"].map(v => `<button data-view="${v}" class="${this.view===v?"active":""}">${this.t(v)}</button>`).join("")}</nav>`;
  }

  content() {
    if (this.error) return `<div class="error"><strong>${this.t("loadError")}</strong><br>${this.esc(this.error)}</div>`;
    if (!this.data) return `<div class="panel loading"><ha-icon icon="mdi:loading"></ha-icon><p>${this.t("loading")}</p></div>`;
    if (this.view === "inventory") return this.inventory();
    if (this.view === "graph") return this.graph();
    return this.overview();
  }

  overview() {
    const m = this.data.meta, counts = m.status_counts || {}, types = m.type_counts || {};
    const cards = [["total",m.object_count,""],["findings",this.data.findings.length,"orphaned"],["unavailable",counts.unavailable||0,"unavailable"],["disabled",counts.disabled||0,"disabled"]];
    return `<div class="notice"><ha-icon icon="mdi:shield-check-outline"></ha-icon>${this.t("riskNotice")}</div>
      <div class="stats">${cards.map(([k,v,c])=>`<div class="stat ${c}"><div class="stat-label">${this.t(k)}</div><div class="stat-value">${v}</div></div>`).join("")}</div>
      <div class="panel"><div class="panelhead"><div><h2>${this.t("objects")}</h2><span class="muted">${this.t("lastScan")}: ${this.formatDate(m.scanned_at)}</span></div></div><div class="breakdown">${["entity","device","config_entry","automation","area"].map(type=>`<button data-type-jump="${type}"><span class="kind"><ha-icon icon="${ICONS[type]}"></ha-icon>${this.t(type)}</span><span class="count">${types[type]||0}</span></button>`).join("")}</div></div>${this.findingsPanel()}`;
  }

  findingsPanel() {
    if (!this.data.findings.length) return "";
    return `<div class="panel" style="margin-top:20px"><div class="panelhead"><h2>${this.t("recentFindings")}</h2><span class="muted">${this.data.findings.length}</span></div><div class="tablewrap"><table><thead><tr><th>${this.t("status")}</th><th>${this.t("affected")}</th><th>${this.t("evidence")}</th></tr></thead><tbody>${this.data.findings.slice(0,10).map(f=>{const key=(f.rule_id.startsWith("automation.")?"automation:":"entity:")+f.object_id;return `<tr data-object="${this.esc(key)}"><td><span class="badge ${this.esc(f.classification)}">${this.t(f.classification)}</span></td><td><strong>${this.esc(f.object_id)}</strong>${f.affected_object?`<span class="id">${this.esc(f.affected_object)}</span>`:""}</td><td>${this.esc(f.evidence?.[0]?.location||f.evidence?.[0]?.kind||"—")}</td></tr>`}).join("")}</tbody></table></div></div>`;
  }

  inventory() {
    const rows = this.filtered();
    const pageCount = Math.max(1, Math.ceil(rows.length / this.pageSize));
    this.page = Math.min(this.page, pageCount);
    const visibleRows = rows.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
    const types = [...new Set(this.data.objects.map(x => x.object_type))].sort();
    const statuses = [...new Set(this.data.objects.map(x => x.status))].sort();
    return `<div class="panel"><div class="filters"><input id="query" type="search" value="${this.esc(this.query)}" placeholder="${this.t("search")}"><select id="typeFilter"><option value="">${this.t("all")}</option>${types.map(x=>`<option value="${x}" ${this.typeFilter===x?"selected":""}>${this.t(x)}</option>`).join("")}</select><select id="statusFilter"><option value="">${this.t("allStatus")}</option>${statuses.map(x=>`<option value="${x}" ${this.statusFilter===x?"selected":""}>${this.statusLabel(x)}</option>`).join("")}</select></div>
      <div class="tablewrap"><table><thead><tr><th data-sort="name">${this.t("name")}</th><th data-sort="type">${this.t("type")}</th><th data-sort="status">${this.t("status")}</th><th>${this.t("reason")}</th><th>${this.t("since")}</th></tr></thead><tbody>${visibleRows.map(item=>`<tr data-object="${this.esc(this.objectKey(item))}"><td><span class="object"><ha-icon icon="${ICONS[item.object_type]||"mdi:help-circle-outline"}"></ha-icon><span><strong>${this.esc(item.name)}</strong><span class="id">${this.esc(item.object_id)}</span></span></span></td><td>${this.t(item.object_type)}</td><td><span class="badge ${this.esc(item.status)}">${this.statusLabel(item.status)}</span></td><td>${this.esc(item.reason ? this.t(item.reason) : item.missing_reference_count ? `${item.missing_reference_count} ${this.t("missingReferences")}` : "—")}</td><td>${this.formatDate(item.status_since)}</td></tr>`).join("")}</tbody></table>${rows.length?"":`<div class="emptymsg">${this.t("noResults")}</div>`}</div><div class="tablefoot"><span>${rows.length} / ${this.data.objects.length}</span>${pageCount>1?`<span class="pager"><button data-page="${this.page-1}" ${this.page===1?"disabled":""}>${this.t("previous")}</button> ${this.t("page")} ${this.page} ${this.t("of")} ${pageCount} <button data-page="${this.page+1}" ${this.page===pageCount?"disabled":""}>${this.t("next")}</button></span>`:""}</div></div>`;
  }

  graph() {
    const key = this.selected ? this.objectKey(this.selected) : "";
    const edges = key ? this.data.edges.filter(e => e.source === key || e.target === key) : [];
    const incoming = edges.filter(e=>e.target===key), outgoing = edges.filter(e=>e.source===key);
    const rel = (edge, direction) => { const targetKey = direction === "in" ? edge.source : edge.target; const obj=this.findObject(targetKey); return `<div class="rel" data-object="${this.esc(targetKey)}"><strong>${this.esc(obj?.name || targetKey)}</strong><span class="relation">${this.esc(edge.relation)} · ${this.esc(edge.confidence)}</span></div>`; };
    return `<div class="panel graphlayout"><aside class="graphlist"><h3>${this.t("select")}</h3><select id="graphSelect"><option value="">—</option>${this.data.objects.map(o=>`<option value="${this.esc(this.objectKey(o))}" ${key===this.objectKey(o)?"selected":""}>${this.esc(o.name)} · ${this.t(o.object_type)}</option>`).join("")}</select><p class="muted">${this.t("graphHint")}</p></aside><div class="canvas">${!this.selected?`<div class="graph-empty"><div><ha-icon icon="mdi:graph-outline"></ha-icon><p>${this.t("graphHint")}</p></div></div>`:`<div class="node-center"><ha-icon icon="${ICONS[this.selected.object_type]}"></ha-icon><strong>${this.esc(this.selected.name)}</strong><span class="id">${this.esc(this.selected.object_id)}</span></div><div class="relations"><div class="relation-col"><h3>${this.t("incoming")} (${incoming.length})</h3>${incoming.map(e=>rel(e,"in")).join("")}</div><div class="relation-col"><h3>${this.t("outgoing")} (${outgoing.length})</h3>${outgoing.map(e=>rel(e,"out")).join("")}</div></div>`}</div></div>`;
  }

  drawer() {
    const item = this.selected;
    if (!item || this.view === "graph") return "";
    const key = this.objectKey(item), incoming=this.data.edges.filter(e=>e.target===key), outgoing=this.data.edges.filter(e=>e.source===key);
    const skip = new Set(["attributes","name","object_id","object_type","status","reason"]);
    const fields = Object.entries(item).filter(([k,v])=>!skip.has(k)&&v!==null&&v!==undefined&&(typeof v!=="object"||Array.isArray(v)));
    const automation = item.object_type === "automation" ? `<section class="section"><h3>${this.t("automationStructure")}</h3>${["triggers","conditions","actions"].map(part=>`<h4>${this.t(part)} (${item[part]?.length||0})</h4><div class="code">${this.esc(JSON.stringify(item[part]||[],null,2))}</div>`).join("")}</section>` : "";
    const missingWarning = item.missing_reference_count ? `<div class="why"><strong>${this.t("missingReferences")}:</strong> ${item.missing_reference_count}</div>` : "";
    return `<div class="drawerback" data-action="close"></div><aside class="drawer"><div class="drawerhead"><div><span class="badge ${this.esc(item.status)}">${this.statusLabel(item.status)}</span><h2>${this.esc(item.name)}</h2><span class="id">${this.esc(item.object_id)}</span></div><button class="iconbtn" data-action="close" title="${this.t("close")}"><ha-icon icon="mdi:close"></ha-icon></button></div><div class="drawerbody">${item.reason?`<div class="why ${item.status}"><strong>${this.t("reason")}:</strong> ${this.esc(this.t(item.reason))}${item.status_since?`<br><small>${this.t("firstObservation")}: ${this.formatDate(item.status_since)}</small>`:""}</div>`:""}${missingWarning}<section class="section"><h3>${this.t("registry")}</h3><dl class="kv"><dt>${this.t("type")}</dt><dd>${this.t(item.object_type)}</dd>${fields.map(([k,v])=>`<dt>${this.esc(k)}</dt><dd>${this.esc(Array.isArray(v)?v.join(", "):v)}</dd>`).join("")}</dl></section>${automation}<section class="section"><h3>${this.t("dependencies")} (${incoming.length+outgoing.length})</h3><div class="code">${this.esc([...incoming.map(e=>`${e.source} → ${e.relation} → ${key}${e.location?` @ ${e.location}`:""}`),...outgoing.map(e=>`${key} → ${e.relation} → ${e.target}${e.location?` @ ${e.location}`:""}`)].join("\n")||"—")}</div></section>${item.attributes?`<section class="section"><h3>${this.t("state")}</h3><div class="code">${this.esc(JSON.stringify(item.attributes,null,2))}</div></section>`:""}</div></aside>`;
  }

  bind() {
    this.shadowRoot.querySelectorAll("[data-view]").forEach(el=>el.onclick=()=>{this.view=el.dataset.view;this.selected=null;this.render();});
    this.shadowRoot.querySelector("[data-action='scan']")?.addEventListener("click",()=>this.load(true));
    this.shadowRoot.querySelectorAll("[data-action='close']").forEach(el=>el.onclick=()=>{this.selected=null;this.render();});
    this.shadowRoot.querySelectorAll("[data-type-jump]").forEach(el=>el.onclick=()=>{this.typeFilter=el.dataset.typeJump;this.view="inventory";this.render();});
    const q=this.shadowRoot.querySelector("#query"); if(q) q.oninput=()=>{this.query=q.value;this.page=1;this.render();this.shadowRoot.querySelector("#query")?.focus();};
    const tf=this.shadowRoot.querySelector("#typeFilter"); if(tf) tf.onchange=()=>{this.typeFilter=tf.value;this.page=1;this.render();};
    const sf=this.shadowRoot.querySelector("#statusFilter"); if(sf) sf.onchange=()=>{this.statusFilter=sf.value;this.page=1;this.render();};
    this.shadowRoot.querySelectorAll("th[data-sort]").forEach(el=>el.onclick=()=>{this.sort=el.dataset.sort;this.render();});
    this.shadowRoot.querySelectorAll("[data-object]").forEach(el=>el.onclick=()=>{const obj=this.findObject(el.dataset.object);if(obj){this.selected=obj;this.render();}});
    const gs=this.shadowRoot.querySelector("#graphSelect"); if(gs) gs.onchange=()=>{this.selected=this.findObject(gs.value)||null;this.render();};
    this.shadowRoot.querySelectorAll("[data-page]").forEach(el=>el.onclick=()=>{this.page=Number(el.dataset.page);this.render();});
  }
}

if (!customElements.get("ha-housekeeper-panel")) customElements.define("ha-housekeeper-panel", HAHousekeeperPanel);
