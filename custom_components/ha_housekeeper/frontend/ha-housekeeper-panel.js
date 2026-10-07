const TEXT = {
  de: {
    title: "Housekeeper", subtitle: "Deine Home-Assistant-Installation im Blick",
    overview: "Übersicht", inventory: "Inventar", graph: "Abhängigkeiten", findingsNav: "Befunde",
    scan: "Neu scannen", exportJson: "JSON", exportCsv: "CSV", exportTitle: "Befunde exportieren", scanning: "Scan läuft …", all: "Alle Typen",
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
    systemState: "Systemzustand", health: "Housekeeping-Status", healthGood: "Gut", healthCheck: "Prüfen",
    healthBad: "Problematisch", healthHint: "Anteil unauffälliger Entities und Automationen",
    openFindings: "Offene Befunde", needsAttention: "Benötigt Aufmerksamkeit",
    sortedBySure: "Nach Sicherheit der Diagnose sortiert", allFindings: "Alle Befunde",
    inventoryStatus: "Inventarstatus", byType: "Nach Objekttyp", noFindings: "Keine Befunde – alles unauffällig.",
    openInHA: "In Home Assistant öffnen", diagnosis: "Ursachendiagnose", present: "Vorhanden", missing: "Fehlt",
    certain: "Bestätigt", probable: "Wahrscheinlich", confidence: "Sicherheit", origin: "Herkunft",
    usage: "Verwendung", pathTitle: "Abhängigkeitspfad", pathSubtitle: "Herkunft und Verwendung eines Objekts prüfen.",
    searchObject: "Objekt suchen …", noRelations: "Keine Beziehungen gefunden.", firstSeenNote: "seit erster Beobachtung",
    findingsSubtitle: "Alle Diagnosen mit Verweis auf das betroffene Objekt.", inventorySubtitle: "Alle erfassten Objekte der Installation.",
    scanDone: "Scan aktuell", of_total: "von", shown: "angezeigt", integration: "Integration",
    PROVIDES: "stellt bereit", OWNS: "besitzt", CONTAINS: "enthält", VIA_DEVICE: "über Gerät",
    TRIGGERS_ON: "löst aus durch", USES_AS_CONDITION: "prüft als Bedingung", TARGETS: "steuert", REFERENCES: "verweist auf",
    runtimeState: "Laufzeit-Zustand", usedBy: "verwendet von",
    backTo: "Zurück zu", facts: "Eckdaten", relations: "Beziehungen", showInGraph: "Im Abhängigkeitsdiagramm", noState: "Kein Zustand vorhanden", notExpected: "Nicht erwartet",
    available: "Verfügbar", causeLabel: "Ursache", hintLabel: "Empfehlung", certainty: "Sicherheit", finding: "Befund", noFinding: "Kein Befund",
    belowThreshold: "Noch kein Befund: nicht verfügbare Entities werden erst nach {days} Tagen gemeldet.", refCount: "Verwendet von",
    moreItems: "und {count} weitere", automationOff: "Automation ist ausgeschaltet", refsResolved: "Alle Referenzen aufgelöst", entities: "Entities",
    cs_loaded: "Geladen", cs_setup_error: "Fehler beim Einrichten", cs_setup_retry: "Einrichtung wird wiederholt", cs_not_loaded: "Nicht geladen",
    cs_migration_error: "Fehler bei der Migration", cs_failed_unload: "Entladen fehlgeschlagen", cs_setup_in_progress: "Wird eingerichtet",
    missing_entity: "Entity", missing_device: "Gerät", missing_area: "Bereich", missing_floor: "Etage", missing_label: "Label",
    cause_ok: "Integration, Gerät und Zustand sind in Ordnung. Hier ist nichts zu tun.",
    cause_entity_disabled: "Die Entity wurde deaktiviert und besitzt deshalb keinen Zustand. Das ist kein Fehler.",
    cause_device_disabled: "Das zugehörige Gerät ist deaktiviert, daher liefert die Entity keinen Zustand. Das ist kein Fehler.",
    cause_integration_disabled: "Die zugehörige Integration ist deaktiviert, daher liefert die Entity keinen Zustand. Das ist kein Fehler.",
    cause_device_missing: "Die Entity verweist auf ein Gerät, das nicht mehr in der Geräte-Registry existiert. Der Registry-Eintrag ist sehr wahrscheinlich ein Überbleibsel.",
    cause_config_entry_missing: "Die Integration, zu der die Entity gehört, wurde entfernt. Der Registry-Eintrag ist verwaist.",
    cause_state_missing: "Die Entity ist registriert, aber die Integration stellt sie nicht mehr bereit. Typisch nach dem Umbau einer Integration, geänderter unique_id oder entferntem Gerät.",
    cause_state_missing_integration: "Die Integration ist nicht geladen ({state}). Deshalb fehlt der Zustand der Entity.",
    cause_state_unavailable: "Integration und Gerät sind vorhanden, aber die Integration meldet die Entity als nicht verfügbar. Meist ist das Gerät oder der Dienst nicht erreichbar, etwa ausgeschaltet, ohne Netzwerk oder Cloud-Ausfall.",
    cause_state_unavailable_integration: "Die Integration ist nicht geladen ({state}). Ihre Entities sind deshalb nicht verfügbar.",
    cause_state_unknown: "Die Integration hat bisher keinen Wert geliefert. Das ist nach einem Neustart oder bei selten aktualisierten Entities normal.",
    hint_state_unavailable: "Gerät oder Dienst auf Erreichbarkeit prüfen. Ist es erreichbar, die Integration neu laden.",
    hint_integration: "In den Integrationen die Fehlermeldung der Integration prüfen und sie neu laden.",
    hint_state_unknown: "Abwarten. Bleibt der Zustand dauerhaft unbekannt, die Integration prüfen.",
    hint_orphan: "Vor dem Entfernen unter Beziehungen prüfen, ob Automationen oder andere Objekte die Entity noch verwenden.",
    cause_device_active: "Das Gerät ist aktiv und stellt Entities bereit.",
    cause_device_empty: "Dem Gerät ist keine Entity zugeordnet. Möglicherweise ist es ein Überbleibsel.",
    cause_device_off: "Das Gerät ist deaktiviert. Das ist kein Fehler.",
    cause_entry_ok: "Die Integration ist geladen.",
    cause_entry_problem: "Die Integration ist nicht geladen ({state}). Ihre Entities sind deshalb nicht verfügbar.",
    cause_entry_off: "Die Integration ist deaktiviert. Das ist kein Fehler.",
    cause_automation_ok: "Alle Referenzen der Automation zeigen auf vorhandene Objekte.",
    cause_automation_broken: "{count} Referenz(en) zeigen auf Objekte, die nicht mehr existieren. Die Automation läuft an diesen Stellen ins Leere.",
    hint_automation_broken: "Die fehlenden Referenzen in der Automation ersetzen oder entfernen.",
  },
  en: {
    title: "Housekeeper", subtitle: "Keep your Home Assistant installation in view",
    overview: "Overview", inventory: "Inventory", graph: "Dependencies", findingsNav: "Findings",
    scan: "Scan now", exportJson: "JSON", exportCsv: "CSV", exportTitle: "Export findings", scanning: "Scanning …", all: "All types",
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
    systemState: "System health", health: "Housekeeping status", healthGood: "Good", healthCheck: "Review",
    healthBad: "Problematic", healthHint: "Share of entities and automations without findings",
    openFindings: "Open findings", needsAttention: "Needs attention",
    sortedBySure: "Sorted by diagnosis confidence", allFindings: "All findings",
    inventoryStatus: "Inventory status", byType: "By object type", noFindings: "No findings – everything looks fine.",
    openInHA: "Open in Home Assistant", diagnosis: "Root-cause diagnosis", present: "Present", missing: "Missing",
    certain: "Confirmed", probable: "Probable", confidence: "Confidence", origin: "Origin",
    usage: "Usage", pathTitle: "Dependency path", pathSubtitle: "Inspect the origin and usage of an object.",
    searchObject: "Search object …", noRelations: "No relationships found.", firstSeenNote: "since first observation",
    findingsSubtitle: "All diagnoses with a link to the affected object.", inventorySubtitle: "All recorded objects of the installation.",
    scanDone: "Scan up to date", of_total: "of", shown: "shown", integration: "Integration",
    PROVIDES: "provides", OWNS: "owns", CONTAINS: "contains", VIA_DEVICE: "via device",
    TRIGGERS_ON: "triggers on", USES_AS_CONDITION: "checks as condition", TARGETS: "targets", REFERENCES: "references",
    runtimeState: "Runtime state", usedBy: "used by",
    backTo: "Back to", facts: "Key facts", relations: "Relationships", showInGraph: "In dependency graph", noState: "No state available", notExpected: "Not expected",
    available: "Available", causeLabel: "Cause", hintLabel: "Recommendation", certainty: "Confidence", finding: "Finding", noFinding: "No finding",
    belowThreshold: "Not a finding yet: unavailable entities are reported only after {days} days.", refCount: "Used by",
    moreItems: "and {count} more", automationOff: "Automation is turned off", refsResolved: "All references resolved", entities: "Entities",
    cs_loaded: "Loaded", cs_setup_error: "Setup error", cs_setup_retry: "Retrying setup", cs_not_loaded: "Not loaded",
    cs_migration_error: "Migration error", cs_failed_unload: "Unload failed", cs_setup_in_progress: "Setting up",
    missing_entity: "Entity", missing_device: "Device", missing_area: "Area", missing_floor: "Floor", missing_label: "Label",
    cause_ok: "Integration, device and state are fine. Nothing to do here.",
    cause_entity_disabled: "The entity was disabled and therefore has no state. This is not an error.",
    cause_device_disabled: "The related device is disabled, so the entity provides no state. This is not an error.",
    cause_integration_disabled: "The related integration is disabled, so the entity provides no state. This is not an error.",
    cause_device_missing: "The entity points to a device that no longer exists in the device registry. The registry entry is very likely a leftover.",
    cause_config_entry_missing: "The integration this entity belongs to was removed. The registry entry is orphaned.",
    cause_state_missing: "The entity is registered, but the integration no longer provides it. Typical after an integration rework, a changed unique_id or a removed device.",
    cause_state_missing_integration: "The integration is not loaded ({state}), which is why the entity has no state.",
    cause_state_unavailable: "Integration and device exist, but the integration reports the entity as unavailable. Usually the device or service is unreachable, for example powered off, offline or a cloud outage.",
    cause_state_unavailable_integration: "The integration is not loaded ({state}), so its entities are unavailable.",
    cause_state_unknown: "The integration has not delivered a value yet. This is normal after a restart or for rarely updated entities.",
    hint_state_unavailable: "Check whether the device or service is reachable. If it is, reload the integration.",
    hint_integration: "Check the integration's error message under integrations and reload it.",
    hint_state_unknown: "Wait. If the state stays unknown permanently, check the integration.",
    hint_orphan: "Before removing it, check under relationships whether automations or other objects still use the entity.",
    cause_device_active: "The device is active and provides entities.",
    cause_device_empty: "No entity is assigned to the device. It may be a leftover.",
    cause_device_off: "The device is disabled. This is not an error.",
    cause_entry_ok: "The integration is loaded.",
    cause_entry_problem: "The integration is not loaded ({state}), so its entities are unavailable.",
    cause_entry_off: "The integration is disabled. This is not an error.",
    cause_automation_ok: "All references of the automation point to existing objects.",
    cause_automation_broken: "{count} reference(s) point to objects that no longer exist. The automation runs into nothing at these places.",
    hint_automation_broken: "Replace or remove the missing references in the automation.",
  },
};

const ICONS = {
  entity: "mdi:shape-outline", device: "mdi:devices", config_entry: "mdi:puzzle-outline",
  area: "mdi:floor-plan", automation: "mdi:robot-outline", floor: "mdi:layers-outline",
  label: "mdi:label-outline",
};

const NAV = [
  ["overview", "mdi:view-dashboard-outline"],
  ["inventory", "mdi:database-outline"],
  ["findingsNav", "mdi:alert-outline"],
  ["graph", "mdi:source-fork"],
];

const STATUS_TONE = {
  active: "ok", orphaned: "warn", unavailable: "red", problem: "red", broken_reference: "red",
  disabled: "mute", empty: "mute", unknown: "violet",
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
    this.findingFilter = "";
    this.sort = "name";
    this.selected = null;
    this.trail = [];
    this.graphSelected = null;
    this.details = new Map();
    this.detailLoading = false;
    this.graphQuery = "";
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
    this.busy = true; this.error = null; this.render();
    let progressTimer = null;
    if (fresh) progressTimer = window.setInterval(() => this.updateScanStatus(), 250);
    try {
      this.data = await this._hass.callWS({ type: fresh ? "ha_housekeeper/scan" : "ha_housekeeper/inventory" });
      this.details = new Map();
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

  async openObject(obj) {
    if (this.selected && this.selected !== obj) this.trail.push(this.selected);
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

  goBack() { this.selected = this.trail.pop() || null; this.render(); }

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

  findingKey(finding) { return (finding.rule_id.startsWith("automation.") ? "automation:" : "entity:") + finding.object_id; }
  sortedFindings() {
    return [...this.data.findings].sort((a, b) => (b.confidence - a.confidence)
      || String(a.object_id).localeCompare(String(b.object_id)));
  }

  health() {
    const base = this.data.objects.filter(o => o.object_type === "entity" || o.object_type === "automation").length;
    const percent = base ? Math.max(0, Math.round(100 * (1 - this.data.findings.length / base))) : 100;
    const tone = percent >= 95 ? "ok" : percent >= 80 ? "warn" : "red";
    const label = tone === "ok" ? "healthGood" : tone === "warn" ? "healthCheck" : "healthBad";
    return { percent, tone, label };
  }

  haPath(item) {
    switch (item.object_type) {
      case "entity": return `/config/entities?search=${encodeURIComponent(item.object_id)}`;
      case "device": return `/config/devices/device/${encodeURIComponent(item.object_id)}`;
      case "area": return `/config/areas/area/${encodeURIComponent(item.object_id)}`;
      case "automation": return item.automation_id
        ? `/config/automation/edit/${encodeURIComponent(item.automation_id)}`
        : `/config/entities?search=${encodeURIComponent(item.object_id)}`;
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

  styles() {
    return `<style>
      :host{--hk-blue:var(--primary-color,#0789cf);--hk-surface:var(--card-background-color,#fff);--hk-bg:var(--primary-background-color,#f4f6f9);--hk-soft:var(--secondary-background-color,#f6f8fa);--hk-text:var(--primary-text-color,#17212b);--hk-muted:var(--secondary-text-color,#637281);--hk-border:var(--divider-color,#dde4ea);--hk-green:#1f9d63;--hk-amber:#d68a00;--hk-red:#d94452;--hk-violet:#7a62c9;--hk-gray:#7b8794;display:block;min-height:100%;background:var(--hk-bg);color:var(--hk-text);font-family:var(--paper-font-body1_-_font-family,Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif)}
      *{box-sizing:border-box} button,input,select{font:inherit;color:inherit} button{cursor:pointer} h1,h2,h3,h4,p{margin:0}
      ha-icon{--mdc-icon-size:20px}
      .shell{min-height:100vh;display:grid;grid-template-columns:208px minmax(0,1fr)}
      .side{display:flex;flex-direction:column;gap:18px;padding:20px 12px 14px;border-right:1px solid var(--hk-border);background:var(--hk-surface)}
      .brand{display:flex;align-items:center;gap:10px;padding:0 8px}.brandmark{width:40px;height:40px;display:grid;place-items:center;flex:none}.brandmark img{width:40px;height:40px;object-fit:contain}.brandmark ha-icon{display:none}.brandmark.nologo{width:34px;height:34px;border-radius:10px;color:#fff;background:linear-gradient(135deg,#0394d5,#087dbb)}.brandmark.nologo ha-icon{display:block}.brand strong{font-weight:600;font-size:15px}.brand small{display:block;color:var(--hk-muted);font-size:10px;margin-top:1px}
      .side nav{display:grid;gap:4px}.nav{width:100%;min-height:40px;display:grid;grid-template-columns:22px 1fr auto;align-items:center;gap:9px;padding:7px 10px;border:0;border-radius:8px;color:var(--hk-muted);background:transparent;text-align:left}.nav:hover{background:var(--hk-soft)}
      .nav.active{color:var(--hk-blue);background:color-mix(in srgb,var(--hk-blue) 12%,transparent);font-weight:600}.nav em{min-width:22px;padding:2px 6px;border-radius:10px;color:var(--hk-muted);background:var(--hk-soft);font-size:10px;font-style:normal;text-align:center}
      .side-foot{margin-top:auto;display:grid;gap:8px;padding:0 8px}.lock{display:flex;align-items:center;gap:7px;font-size:11px;color:var(--hk-green)}.lock ha-icon{--mdc-icon-size:16px}
      .main{min-width:0;padding:26px clamp(16px,2.4vw,32px) 60px}
      .heading{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:20px}.eyebrow{color:var(--hk-blue);font-size:10px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;margin-bottom:3px}
      h1{font-size:25px;font-weight:600;line-height:1.2}.sub{display:block;margin-top:6px;color:var(--hk-muted);font-size:13px}
      .btn{min-height:37px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:8px 14px;border-radius:8px;font-weight:600;border:1px solid var(--hk-border);background:var(--hk-surface)}.btn:hover{background:var(--hk-soft)}
      .btn.primary{border-color:#087cb9;color:#fff;background:#087cb9}.btn.primary:hover{background:#0a8ccf}.btn[disabled]{opacity:.6;cursor:wait}
      .summary{display:grid;grid-template-columns:1.3fr repeat(4,1fr);gap:12px;margin-bottom:14px}
      .card{min-width:0;display:grid;grid-template-columns:auto 1fr;align-items:center;gap:12px;padding:15px;border:1px solid var(--hk-border);border-radius:12px;background:var(--hk-surface);color:inherit;text-align:left}
      button.card:hover{border-color:var(--hk-blue)}
      .ring{--p:90;--c:var(--hk-green);width:58px;height:58px;display:grid;place-content:center;border-radius:50%;text-align:center;background:radial-gradient(circle at center,var(--hk-surface) 58%,transparent 60%),conic-gradient(var(--c) calc(var(--p)*1%),var(--hk-soft) 0)}.ring b{font-size:16px;font-weight:600;line-height:1}.ring.warn{--c:var(--hk-amber)}.ring.red{--c:var(--hk-red)}
      .card-text{min-width:0;display:grid;gap:2px}.card-text small{color:var(--hk-muted);font-size:11px}.card-text strong{font-size:22px;font-weight:600;line-height:1.2}.card-text em{overflow:hidden;color:var(--hk-muted);font-size:11px;font-style:normal;text-overflow:ellipsis;white-space:nowrap}
      .tile{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;color:var(--hk-blue);background:color-mix(in srgb,var(--hk-blue) 13%,transparent);flex:none}
      .tile.ok{color:var(--hk-green);background:color-mix(in srgb,var(--hk-green) 14%,transparent)}.tile.warn{color:var(--hk-amber);background:color-mix(in srgb,var(--hk-amber) 15%,transparent)}.tile.red{color:var(--hk-red);background:color-mix(in srgb,var(--hk-red) 13%,transparent)}.tile.mute{color:var(--hk-gray);background:color-mix(in srgb,var(--hk-gray) 15%,transparent)}.tile.violet{color:var(--hk-violet);background:color-mix(in srgb,var(--hk-violet) 14%,transparent)}
      .grid2{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(280px,.8fr);gap:14px;align-items:start}.stack{display:grid;gap:14px}
      .panel{border:1px solid var(--hk-border);border-radius:12px;background:var(--hk-surface);overflow:hidden}.panelhead{min-height:56px;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--hk-border)}.panelhead h2{font-size:15px;font-weight:600}.panelhead p{margin-top:3px;color:var(--hk-muted);font-size:11px}
      .link{display:inline-flex;align-items:center;gap:4px;padding:4px;border:0;color:var(--hk-blue);background:transparent;font-size:12px;font-weight:600}
      .row{width:100%;display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;align-items:center;gap:12px;padding:12px 16px;border:0;border-bottom:1px solid var(--hk-border);background:transparent;color:inherit;text-align:left}.row:last-child{border-bottom:0}.row:hover{background:var(--hk-soft)}
      .row .tile{width:34px;height:34px}.row-text{min-width:0;display:grid;gap:2px}.row-text strong{overflow:hidden;font-size:13px;font-weight:600;text-overflow:ellipsis;white-space:nowrap}.row-text small{overflow:hidden;color:var(--hk-muted);font-size:11px;text-overflow:ellipsis;white-space:nowrap}.date{color:var(--hk-muted);font-size:11px;white-space:nowrap}
      .pill{display:inline-flex;align-items:center;gap:6px;width:max-content;padding:3px 9px;border-radius:99px;font-size:11px;font-weight:600;white-space:nowrap;color:var(--hk-blue);background:color-mix(in srgb,var(--hk-blue) 13%,transparent)}
      .pill.ok{color:var(--hk-green);background:color-mix(in srgb,var(--hk-green) 14%,transparent)}.pill.warn{color:var(--hk-amber);background:color-mix(in srgb,var(--hk-amber) 16%,transparent)}.pill.red{color:var(--hk-red);background:color-mix(in srgb,var(--hk-red) 13%,transparent)}.pill.mute{color:var(--hk-gray);background:color-mix(in srgb,var(--hk-gray) 16%,transparent)}.pill.violet{color:var(--hk-violet);background:color-mix(in srgb,var(--hk-violet) 14%,transparent)}
      .bar{display:flex;height:10px;margin:16px;border-radius:99px;overflow:hidden;background:var(--hk-soft)}.bar i{display:block;min-width:2px}.legend{display:grid;gap:9px;padding:0 16px 16px;font-size:12px}.legend div{display:flex;align-items:center;justify-content:space-between;gap:8px}.legend span{display:flex;align-items:center;gap:8px}.dot{width:9px;height:9px;border-radius:50%;background:var(--hk-blue)}
      .dot.ok,.bar .ok{background:var(--hk-green)}.dot.warn,.bar .warn{background:var(--hk-amber)}.dot.red,.bar .red{background:var(--hk-red)}.dot.mute,.bar .mute{background:var(--hk-gray)}.dot.violet,.bar .violet{background:var(--hk-violet)}
      .types{display:grid}.type{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px;padding:10px 16px;border:0;border-top:1px solid var(--hk-border);background:transparent;text-align:left;font-size:13px}.type:hover{background:var(--hk-soft)}.type .tile{width:30px;height:30px}.type b{font-weight:600}
      .filters{display:grid;grid-template-columns:minmax(240px,1fr) 190px 190px;gap:10px;padding:14px;border-bottom:1px solid var(--hk-border)}
      input,select{border:1px solid var(--hk-border);border-radius:8px;background:var(--hk-surface);padding:9px 12px;min-width:0}input:focus,select:focus{outline:2px solid color-mix(in srgb,var(--hk-blue) 35%,transparent);border-color:var(--hk-blue)}
      .tablewrap{overflow:auto}table{border-collapse:collapse;width:100%}th{text-align:left;color:var(--hk-muted);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;padding:11px 16px;background:var(--hk-soft);cursor:pointer;white-space:nowrap}td{padding:11px 16px;border-top:1px solid var(--hk-border);font-size:13px}tbody tr{cursor:pointer}tbody tr:hover{background:var(--hk-soft)}
      .object{display:flex;align-items:center;gap:11px;min-width:260px}.object .tile{width:34px;height:34px}.object strong{display:block;font-weight:600}.id{display:block;color:var(--hk-muted);font-family:ui-monospace,SFMono-Regular,monospace;font-size:11px;margin-top:2px;max-width:390px;overflow:hidden;text-overflow:ellipsis}
      .tablefoot{padding:12px 16px;border-top:1px solid var(--hk-border);color:var(--hk-muted);font-size:12px;display:flex;align-items:center;justify-content:space-between;gap:10px}.pager{display:flex;align-items:center;gap:8px}.pager button{border:1px solid var(--hk-border);background:var(--hk-surface);border-radius:7px;padding:5px 10px}.pager button:disabled{opacity:.4}
      .chips .spacer{flex:1}.chips{display:flex;flex-wrap:wrap;gap:8px;padding:12px 16px;border-bottom:1px solid var(--hk-border)}.chip{border:1px solid var(--hk-border);background:var(--hk-surface);border-radius:99px;padding:5px 12px;font-size:12px;color:var(--hk-muted)}.chip.active{color:var(--hk-blue);border-color:var(--hk-blue);background:color-mix(in srgb,var(--hk-blue) 11%,transparent);font-weight:600}
      .emptymsg,.loading{padding:46px;text-align:center;color:var(--hk-muted)}.emptymsg ha-icon{--mdc-icon-size:34px;color:var(--hk-green);display:block;margin:0 auto 8px}.error{padding:18px;border-radius:12px;background:color-mix(in srgb,var(--hk-red) 12%,transparent);color:var(--hk-red)}
      .pathcard{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:14px;padding:16px;margin-bottom:14px}.pathcard h2{font-size:17px;font-weight:600}
      .path{padding:16px;display:grid;gap:0}.node{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;padding:11px 13px;border:1px solid var(--hk-border);border-radius:10px;background:var(--hk-surface);color:inherit;text-align:left;width:100%}button.node:hover{border-color:var(--hk-blue)}
      .node.current{border:2px solid var(--hk-blue);background:color-mix(in srgb,var(--hk-blue) 8%,var(--hk-surface))}.node .tile{width:34px;height:34px}.node small{display:block;color:var(--hk-blue);font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase}.node strong{display:block;font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.node span.meta{display:block;color:var(--hk-muted);font-size:11px}
      .link-label{margin:0 0 0 22px;padding:3px 0 3px 14px;border-left:2px solid var(--hk-border);color:var(--hk-muted);font-size:11px;min-height:26px;display:flex;align-items:center;gap:8px}
      .branch{margin:0 0 0 22px;padding:6px 0 0 18px;border-left:2px solid var(--hk-border);display:grid;gap:8px}
      .sectionlabel{padding:14px 16px 0;color:var(--hk-muted);font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase}
      .search{padding:14px;border-bottom:1px solid var(--hk-border)}.search input{width:100%}.hits{display:grid;max-height:280px;overflow:auto}.hit{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center;padding:9px 16px;border:0;border-top:1px solid var(--hk-border);background:transparent;text-align:left}.hit:hover{background:var(--hk-soft)}.hit .tile{width:30px;height:30px}
      .crumbs{display:flex;align-items:center;gap:12px;margin-bottom:14px}.crumbs .trail{color:var(--hk-muted);font-size:12px;text-transform:uppercase;letter-spacing:.07em}
      .detailhead{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:16px;padding:18px 20px;margin-bottom:14px}.detailhead .tile{width:48px;height:48px}.detailhead h1{margin:6px 0 2px;font-size:22px}.actions{display:flex;flex-wrap:wrap;gap:8px}
      .detailgrid{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(320px,1fr);gap:14px;align-items:start}.pad{padding:16px}
      .facts{display:grid}.fact{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:11px 16px;border-top:1px solid var(--hk-border);font-size:13px}.fact:first-child{border-top:0}.fact span{color:var(--hk-muted)}.fact b{font-weight:600;text-align:right}.fact small{display:block;margin-top:2px;color:var(--hk-muted);font-size:11px;font-weight:400}
      .factnote{padding:12px 16px;border-top:1px solid var(--hk-border);color:var(--hk-muted);font-size:12px;line-height:1.5}
      .diagcard{display:grid;gap:12px;padding:16px}.checks{display:grid;gap:8px}
      .check{display:grid;grid-template-columns:22px minmax(100px,150px) minmax(0,1fr) auto;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--hk-border);border-radius:10px;background:var(--hk-soft);font-size:13px}.check b{font-weight:600}.check .val{overflow:hidden;color:var(--hk-muted);text-overflow:ellipsis;white-space:nowrap}
      .check ha-icon{--mdc-icon-size:20px}.check.ok ha-icon{color:var(--hk-green)}.check.warn ha-icon{color:var(--hk-amber)}.check.red ha-icon{color:var(--hk-red)}.check.mute ha-icon{color:var(--hk-gray)}.check.violet ha-icon{color:var(--hk-violet)}
      .cause,.hintbox{display:grid;grid-template-columns:auto 1fr;gap:12px;padding:14px;border:1px solid var(--hk-border);border-radius:10px;background:var(--hk-soft)}.cause strong,.hintbox strong{display:block;margin-bottom:4px;color:var(--hk-muted);font-size:11px;letter-spacing:.07em;text-transform:uppercase}.cause p,.hintbox p{font-size:13px;line-height:1.55}
      .cause.ok{background:color-mix(in srgb,var(--hk-green) 9%,transparent);border-color:color-mix(in srgb,var(--hk-green) 35%,transparent)}.cause.warn{background:color-mix(in srgb,var(--hk-amber) 10%,transparent);border-color:color-mix(in srgb,var(--hk-amber) 35%,transparent)}.cause.red{background:color-mix(in srgb,var(--hk-red) 9%,transparent);border-color:color-mix(in srgb,var(--hk-red) 35%,transparent)}.cause.violet{background:color-mix(in srgb,var(--hk-violet) 9%,transparent);border-color:color-mix(in srgb,var(--hk-violet) 35%,transparent)}
      .cause ha-icon{color:var(--hk-muted)}.hintbox ha-icon{color:var(--hk-amber)}.row.rel{grid-template-columns:auto minmax(0,1fr) auto}
      .kv{display:grid;grid-template-columns:155px 1fr;gap:8px 14px;font-size:13px}.kv dt{color:var(--hk-muted)}.kv dd{margin:0;overflow-wrap:anywhere}
      .code{white-space:pre-wrap;word-break:break-word;background:var(--hk-soft);border-radius:10px;padding:12px;font:11px/1.55 ui-monospace,SFMono-Regular,monospace;max-height:270px;overflow:auto}
      h4{font-size:12px;margin:12px 0 6px;color:var(--hk-muted)}
      @media(max-width:1100px){.summary{grid-template-columns:1fr 1fr}.grid2,.detailgrid{grid-template-columns:1fr}}
      @media(max-width:860px){.shell{grid-template-columns:1fr}.side{flex-direction:row;align-items:center;gap:8px;padding:10px;border-right:0;border-bottom:1px solid var(--hk-border);overflow-x:auto}.brand small,.side-foot{display:none}.side nav{display:flex}.nav{width:auto;grid-template-columns:22px auto auto;white-space:nowrap}.main{padding:16px 12px 40px}.heading{flex-wrap:wrap}.filters{grid-template-columns:1fr}.row{grid-template-columns:auto minmax(0,1fr) auto}.row .date{display:none}th:nth-child(4),td:nth-child(4),th:nth-child(5),td:nth-child(5){display:none}.pathcard{grid-template-columns:auto 1fr}.pathcard .btn{grid-column:1/-1}.detailhead{grid-template-columns:auto 1fr}.actions{grid-column:1/-1}.check{grid-template-columns:22px 1fr auto}.check .val{grid-column:2/-1;grid-row:2;white-space:normal}}
      @media(max-width:520px){.summary{grid-template-columns:1fr}}
    </style>`;
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `${this.styles()}<div class="shell">${this.sidebar()}<main class="main">${this.selected && this.data ? this.detail() : `${this.heading()}${this.content()}`}</main></div>`;
    this.bind();
  }

  sidebar() {
    const counts = this.data ? { inventory: this.formatNumber(this.data.meta.object_count), findingsNav: this.data.findings.length } : {};
    return `<aside class="side"><div class="brand"><span class="brandmark"><img src="/ha_housekeeper/logo.png" alt="" onerror="this.parentNode.classList.add('nologo');this.remove()"><ha-icon icon="mdi:broom"></ha-icon></span><div><strong>${this.t("title")}</strong><small>${this.t("systemState")}</small></div></div>
      <nav>${NAV.map(([view, icon]) => `<button class="nav ${this.view === view ? "active" : ""}" data-view="${view}"><ha-icon icon="${icon}"></ha-icon><span>${this.t(view)}</span>${counts[view] !== undefined ? `<em>${counts[view]}</em>` : ""}</button>`).join("")}</nav>
      <div class="side-foot"><span class="lock"><ha-icon icon="mdi:shield-check-outline"></ha-icon>${this.t("readOnly")}</span></div></aside>`;
  }

  heading() {
    const titles = {
      overview: [this.t("systemState"), this.t("health"), this.data ? `${this.t("lastScan")}: <b>${this.formatDate(this.data.meta.scanned_at)}</b>` : this.t("subtitle")],
      inventory: [this.t("objects"), this.t("inventory"), this.t("inventorySubtitle")],
      findingsNav: [this.t("diagnosis"), this.t("findings"), this.t("findingsSubtitle")],
      graph: [this.t("graph"), this.t("pathTitle"), this.t("pathSubtitle")],
    };
    const [eyebrow, title, sub] = titles[this.view] || titles.overview;
    const progress = this.scanStatus?.running ? ` ${this.scanStatus.progress}%` : "";
    return `<div class="heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><span class="sub">${sub}</span></div>
      <button class="btn primary" data-action="scan" ${this.busy ? "disabled" : ""}><ha-icon icon="mdi:refresh"></ha-icon>${this.busy ? this.t("scanning") + progress : this.t("scan")}</button></div>`;
  }

  content() {
    if (this.error) return `<div class="error"><strong>${this.t("loadError")}</strong><br>${this.esc(this.error)}</div>`;
    if (!this.data) return `<div class="panel loading"><ha-icon icon="mdi:loading"></ha-icon><p>${this.t("loading")}</p></div>`;
    if (this.view === "inventory") return this.inventory();
    if (this.view === "findingsNav") return this.findingsView();
    if (this.view === "graph") return this.graph();
    return this.overview();
  }

  tone(status) { return STATUS_TONE[status] || "blue"; }
  pill(status) { return `<span class="pill ${this.tone(status)}">${this.esc(this.statusLabel(status))}</span>`; }
  tile(type, tone = "") { return `<span class="tile ${tone}"><ha-icon icon="${ICONS[type] || "mdi:help-circle-outline"}"></ha-icon></span>`; }

  findingRow(finding) {
    const key = this.findingKey(finding), object = this.findObject(key);
    const title = object?.name || finding.object_id;
    const subtitle = finding.affected_object
      ? `${this.esc(finding.affected_object)} · ${this.esc(finding.evidence?.[0]?.location || "")}`
      : this.esc(object?.reason ? this.t(object.reason) : finding.rule_id);
    return `<button class="row" data-object="${this.esc(key)}">${this.tile(object?.object_type || "entity", this.tone(finding.classification))}<span class="row-text"><strong>${this.esc(title)}</strong><small>${subtitle}</small></span>${this.pill(finding.classification)}<span class="date">${finding.first_detected_at ? this.formatDate(finding.first_detected_at) : ""}</span></button>`;
  }

  overview() {
    const m = this.data.meta, counts = m.status_counts || {}, types = m.type_counts || {}, health = this.health();
    const findings = this.sortedFindings();
    const stats = [
      ["objects", m.object_count, "mdi:shape-outline", "", "inventory"],
      ["openFindings", findings.length, "mdi:alert-outline", findings.length ? "warn" : "ok", "findingsNav"],
      ["unavailable", counts.unavailable || 0, "mdi:lan-disconnect", counts.unavailable ? "red" : "ok", "inventory", "unavailable"],
      ["disabled", counts.disabled || 0, "mdi:cancel", "mute", "inventory", "disabled"],
    ];
    const order = ["active", "unknown", "unavailable", "orphaned", "disabled", "empty", "problem"].filter(s => counts[s]);
    const total = Math.max(1, m.object_count);
    return `<div class="summary"><div class="card"><span class="ring ${health.tone}" style="--p:${health.percent}"><b>${health.percent}%</b></span><span class="card-text"><small>${this.t("health")}</small><strong>${this.t(health.label)}</strong><em>${this.t("healthHint")}</em></span></div>
      ${stats.map(([label, value, icon, tone, view, status]) => `<button class="card" data-jump="${view}" data-status="${status || ""}"><span class="tile ${tone}"><ha-icon icon="${icon}"></ha-icon></span><span class="card-text"><small>${this.t(label)}</small><strong>${this.formatNumber(value)}</strong></span></button>`).join("")}</div>
      <div class="grid2"><div class="panel"><div class="panelhead"><div><h2>${this.t("needsAttention")}</h2><p>${this.t("sortedBySure")}</p></div><button class="link" data-jump="findingsNav">${this.t("allFindings")} (${findings.length}) <ha-icon icon="mdi:chevron-right"></ha-icon></button></div>
      ${findings.length ? findings.slice(0, 8).map(f => this.findingRow(f)).join("") : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("noFindings")}</div>`}</div>
      <div class="stack"><div class="panel"><div class="panelhead"><h2>${this.t("inventoryStatus")}</h2><span class="date">${this.formatNumber(m.object_count)}</span></div>
      <div class="bar">${order.map(s => `<i class="${this.tone(s)}" style="width:${(100 * counts[s] / total).toFixed(2)}%"></i>`).join("")}</div>
      <div class="legend">${order.map(s => `<div><span><i class="dot ${this.tone(s)}"></i>${this.t(s)}</span><b>${this.formatNumber(counts[s])}</b></div>`).join("")}</div></div>
      <div class="panel"><div class="panelhead"><h2>${this.t("byType")}</h2></div><div class="types">${["entity", "device", "config_entry", "automation", "area", "floor", "label"].filter(t => types[t]).map(type => `<button class="type" data-type-jump="${type}">${this.tile(type)}<span>${this.t(type)}</span><b>${this.formatNumber(types[type])}</b></button>`).join("")}</div></div></div></div>`;
  }

  exportRows() {
    const list = this.findingFilter ? this.sortedFindings().filter(f => f.classification === this.findingFilter) : this.sortedFindings();
    return list.map(f => {
      const key = this.findingKey(f), object = this.findObject(key);
      return {
        rule_id: f.rule_id, classification: f.classification, confidence: f.confidence,
        object_id: f.object_id, name: object?.name || "", affected_object: f.affected_object || "",
        first_detected_at: f.first_detected_at || "", location: f.evidence?.[0]?.location || "",
      };
    });
  }

  exportFindings(format) {
    const rows = this.exportRows();
    let body, type;
    if (format === "json") {
      body = JSON.stringify({ scanned_at: this.data.meta.scanned_at, findings: rows }, null, 2);
      type = "application/json";
    } else {
      const cols = Object.keys(rows[0] || { rule_id: 0, classification: 0, confidence: 0, object_id: 0, name: 0, affected_object: 0, first_detected_at: 0, location: 0 });
      // Leading =,+,-,@ would be evaluated as a formula by spreadsheet tools.
      const cell = v => { let t = String(v ?? ""); if (/^[=+\-@\t\r]/.test(t)) t = "'" + t; return `"${t.replace(/"/g, '""')}"`; };
      body = "\ufeff" + [cols.join(","), ...rows.map(r => cols.map(c => cell(r[c])).join(","))].join("\r\n");
      type = "text/csv";
    }
    const url = URL.createObjectURL(new Blob([body], { type: `${type};charset=utf-8` }));
    const a = document.createElement("a");
    a.href = url; a.download = `ha-housekeeper-findings.${format}`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  findingsView() {
    const all = this.sortedFindings();
    const classes = [...new Set(all.map(f => f.classification))];
    const list = this.findingFilter ? all.filter(f => f.classification === this.findingFilter) : all;
    return `<div class="panel"><div class="chips"><button class="chip ${this.findingFilter ? "" : "active"}" data-finding-filter="">${this.t("all")} (${all.length})</button>${classes.map(c => `<button class="chip ${this.findingFilter === c ? "active" : ""}" data-finding-filter="${this.esc(c)}">${this.t(c)} (${all.filter(f => f.classification === c).length})</button>`).join("")}<span class="spacer"></span><button class="chip" data-export="csv" title="${this.t("exportTitle")}">${this.t("exportCsv")}</button><button class="chip" data-export="json" title="${this.t("exportTitle")}">${this.t("exportJson")}</button></div>
      ${list.length ? list.map(f => this.findingRow(f)).join("") : `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("noFindings")}</div>`}</div>`;
  }

  inventory() {
    const rows = this.filtered();
    const pageCount = Math.max(1, Math.ceil(rows.length / this.pageSize));
    this.page = Math.min(this.page, pageCount);
    const visibleRows = rows.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
    const types = [...new Set(this.data.objects.map(x => x.object_type))].sort();
    const statuses = [...new Set(this.data.objects.map(x => x.status))].sort();
    return `<div class="panel"><div class="filters"><input id="query" type="search" value="${this.esc(this.query)}" placeholder="${this.t("search")}"><select id="typeFilter"><option value="">${this.t("all")}</option>${types.map(x => `<option value="${x}" ${this.typeFilter === x ? "selected" : ""}>${this.t(x)}</option>`).join("")}</select><select id="statusFilter"><option value="">${this.t("allStatus")}</option>${statuses.map(x => `<option value="${x}" ${this.statusFilter === x ? "selected" : ""}>${this.statusLabel(x)}</option>`).join("")}</select></div>
      <div class="tablewrap"><table><thead><tr><th data-sort="name">${this.t("name")}</th><th data-sort="type">${this.t("type")}</th><th data-sort="status">${this.t("status")}</th><th>${this.t("reason")}</th><th>${this.t("since")}</th></tr></thead><tbody>${visibleRows.map(item => `<tr data-object="${this.esc(this.objectKey(item))}"><td><span class="object">${this.tile(item.object_type, this.tone(item.status) === "ok" ? "" : this.tone(item.status))}<span><strong>${this.esc(item.name)}</strong><span class="id">${this.esc(item.object_id)}</span></span></span></td><td>${this.t(item.object_type)}</td><td>${this.pill(item.status)}</td><td>${this.esc(item.reason ? this.t(item.reason) : item.missing_reference_count ? `${item.missing_reference_count} ${this.t("missingReferences")}` : "—")}</td><td>${this.formatDate(item.status_since)}</td></tr>`).join("")}</tbody></table>${rows.length ? "" : `<div class="emptymsg">${this.t("noResults")}</div>`}</div>
      <div class="tablefoot"><span>${this.formatNumber(rows.length)} ${this.t("of_total")} ${this.formatNumber(this.data.objects.length)} ${this.t("shown")}</span>${pageCount > 1 ? `<span class="pager"><button data-page="${this.page - 1}" ${this.page === 1 ? "disabled" : ""}>${this.t("previous")}</button> ${this.t("page")} ${this.page} ${this.t("of")} ${pageCount} <button data-page="${this.page + 1}" ${this.page === pageCount ? "disabled" : ""}>${this.t("next")}</button></span>` : ""}</div></div>`;
  }

  nodeButton(key, label, tone = "") {
    const obj = this.findObject(key);
    const [type, ...rest] = key.split(":");
    const id = rest.join(":");
    return `<button class="node" data-graph="${this.esc(key)}">${this.tile(type, tone)}<span><small>${this.t(type)}</small><strong>${this.esc(obj?.name || id)}</strong><span class="meta">${this.esc(label || (obj ? obj.object_id : this.t("missing")))}</span></span>${obj ? this.pill(obj.status) : `<span class="pill red">${this.t("missing")}</span>`}</button>`;
  }

  graph() {
    const q = this.graphQuery.trim().toLowerCase();
    const hits = q ? this.data.objects.filter(o => [o.name, o.object_id].join(" ").toLowerCase().includes(q)).slice(0, 40) : [];
    const search = `<div class="panel" style="margin-bottom:14px"><div class="search"><input id="graphQuery" type="search" value="${this.esc(this.graphQuery)}" placeholder="${this.t("searchObject")}"></div>${hits.length ? `<div class="hits">${hits.map(o => `<button class="hit" data-graph="${this.esc(this.objectKey(o))}">${this.tile(o.object_type)}<span class="row-text"><strong>${this.esc(o.name)}</strong><small>${this.t(o.object_type)} · ${this.esc(o.object_id)}</small></span></button>`).join("")}</div>` : ""}</div>`;
    if (!this.graphSelected) {
      return `${search}<div class="panel"><div class="emptymsg"><ha-icon icon="mdi:graph-outline"></ha-icon>${this.t("graphHint")}</div></div>`;
    }
    const item = this.graphSelected, key = this.objectKey(item);
    const USAGE = ["TRIGGERS_ON", "USES_AS_CONDITION", "TARGETS", "REFERENCES"];
    const incoming = this.data.edges.filter(e => e.target === key), outgoing = this.data.edges.filter(e => e.source === key);
    const originEdges = incoming.filter(e => !USAGE.includes(e.relation));
    const usageEntries = [
      ...incoming.filter(e => USAGE.includes(e.relation)).map(e => ({ key: e.source, edge: e, label: `${this.t("usedBy")} · ${this.t(e.relation)}` })),
      ...outgoing.map(e => ({ key: e.target, edge: e, label: this.t(e.relation) })),
    ];
    const edgeNote = edge => `${this.t(edge.confidence)}${edge.location && edge.location !== "runtime_extraction" ? ` · ${edge.location}` : ""}`;
    const origin = originEdges.map(e => `${this.nodeButton(e.source, edgeNote(e))}<div class="link-label"><ha-icon icon="mdi:arrow-down" style="--mdc-icon-size:14px"></ha-icon>${this.t(e.relation)}</div>`).join("");
    const usage = usageEntries.length
      ? `<div class="branch">${usageEntries.map(u => `<div><div class="link-label" style="margin:0;border:0;padding:0 0 4px">${u.label}</div>${this.nodeButton(u.key, edgeNote(u.edge))}</div>`).join("")}</div>`
      : `<p style="padding:6px 16px;color:var(--hk-muted);font-size:12px">${this.t("noRelations")}</p>`;
    return `${search}<div class="panel pathcard">${this.tile(item.object_type, this.tone(item.status) === "ok" ? "" : this.tone(item.status))}<div><h2>${this.esc(item.name)} ${this.pill(item.status)}</h2><span class="id">${this.esc(item.object_id)}</span></div><button class="btn" data-object="${this.esc(key)}">${this.t("details")}</button></div>
      <div class="panel"><div class="panelhead"><h2>${this.t("origin")} → ${this.t("usage")}</h2><span class="date">${this.t("origin")} ${originEdges.length} · ${this.t("usage")} ${usageEntries.length}</span></div>
      <div class="path">${origin}<div class="node current">${this.tile(item.object_type, this.tone(item.status) === "ok" ? "" : this.tone(item.status))}<span><small>${this.t(item.object_type)}</small><strong>${this.esc(item.name)}</strong><span class="meta">${this.esc(item.object_id)}</span></span>${this.pill(item.status)}</div>${usage}</div></div>`;
  }

  relTime(value) {
    if (!value) return "";
    const diff = (Date.now() - new Date(value).getTime()) / 1000;
    if (!(diff >= 0)) return "";
    const rtf = new Intl.RelativeTimeFormat(this.lang, { numeric: "auto" });
    for (const [unit, secs] of [["day", 86400], ["hour", 3600], ["minute", 60]]) {
      if (diff >= secs) return rtf.format(-Math.floor(diff / secs), unit);
    }
    return rtf.format(0, "second");
  }

  check(label, tone, value, badge) { return { label, tone, value, badge }; }

  integrationCheck(entryId) {
    const entry = this.findObject(`config_entry:${entryId}`), label = this.t("integration");
    if (!entry) return { row: this.check(label, "red", entryId, this.t("missing")), entry };
    if (entry.disabled_by) return { row: this.check(label, "mute", entry.name, this.t("disabled")), entry };
    const state = entry.state || "not_loaded";
    const tone = state === "loaded" ? "ok" : ["setup_error", "migration_error", "failed_unload"].includes(state) ? "red" : "warn";
    return { row: this.check(label, tone, entry.name, this.t(`cs_${state}`)), entry, broken: state !== "loaded", state };
  }

  // Builds the check list and the plain-language cause for one object. Returns null when nothing is worth explaining.
  diagnose(item) {
    const t = (k, v) => this.t(k, v);
    const rows = [];
    let cause = "", hint = "", tone = this.tone(item.status);
    if (tone === "blue") tone = "ok";

    if (item.object_type === "entity") {
      const integ = item.config_entry_id ? this.integrationCheck(item.config_entry_id) : null;
      if (integ) rows.push(integ.row);
      const device = item.device_id ? this.findObject(`device:${item.device_id}`) : null;
      if (item.device_id) {
        rows.push(!device ? this.check(t("device"), "red", item.device_id, t("missing"))
          : device.status === "disabled" ? this.check(t("device"), "mute", device.name, t("disabled"))
          : this.check(t("device"), "ok", device.name, t("active")));
      }
      if (item.disabled_by) rows.push(this.check(t("entity"), "mute", t("entity_disabled"), t("disabled")));
      const state = item.state;
      if (state === null || state === undefined) {
        rows.push(this.check(t("runtimeState"), item.disabled_by ? "mute" : "red", t("noState"), item.disabled_by ? t("notExpected") : t("missing")));
      } else if (state === "unavailable") rows.push(this.check(t("runtimeState"), "red", state, t("unavailable")));
      else if (state === "unknown") rows.push(this.check(t("runtimeState"), "violet", state, t("unknown")));
      else rows.push(this.check(t("runtimeState"), "ok", state, t("available")));

      const broken = integ?.broken ? { state: t(`cs_${integ.state}`) } : null;
      switch (item.reason) {
        case "state_available": cause = t("cause_ok"); break;
        case "entity_disabled": case "device_disabled": case "integration_disabled": case "device_missing": case "config_entry_missing":
          cause = t(`cause_${item.reason}`); break;
        case "state_missing": cause = broken ? t("cause_state_missing_integration", broken) : t("cause_state_missing"); break;
        case "state_unavailable": cause = broken ? t("cause_state_unavailable_integration", broken) : t("cause_state_unavailable"); break;
        case "state_unknown": cause = t("cause_state_unknown"); break;
        default: cause = item.reason ? t(item.reason) : "";
      }
      if (item.reason === "state_unavailable") hint = broken ? t("hint_integration") : t("hint_state_unavailable");
      else if (item.reason === "state_unknown") hint = t("hint_state_unknown");
      else if (item.reason === "state_missing" && broken) hint = t("hint_integration");
      else if (["state_missing", "device_missing", "config_entry_missing"].includes(item.reason)) hint = t("hint_orphan");
    } else if (item.object_type === "device") {
      const ids = item.config_entry_ids || [];
      ids.forEach(id => rows.push(this.integrationCheck(id).row));
      rows.push(this.check(t("entities"), item.entity_count ? "ok" : "warn", this.formatNumber(item.entity_count), item.entity_count ? t("present") : t("empty")));
      cause = item.status === "disabled" ? t("cause_device_off") : item.status === "empty" ? t("cause_device_empty") : t("cause_device_active");
    } else if (item.object_type === "config_entry") {
      const state = item.state || "not_loaded";
      if (item.disabled_by) { rows.push(this.check(t("status"), "mute", item.name, t("disabled"))); cause = t("cause_entry_off"); }
      else if (state === "loaded") { rows.push(this.check(t("status"), "ok", item.name, t("cs_loaded"))); cause = t("cause_entry_ok"); }
      else { rows.push(this.check(t("status"), tone, item.name, t(`cs_${state}`))); cause = t("cause_entry_problem", { state: t(`cs_${state}`) }); hint = t("hint_integration"); }
    } else if (item.object_type === "automation") {
      const key = this.objectKey(item);
      const broken = this.data.findings.filter(f => this.findingKey(f) === key && f.rule_id.startsWith("automation.missing_"));
      broken.forEach(f => rows.push(this.check(t(f.rule_id.replace("automation.", "")), "red", `${f.affected_object}${f.evidence?.[0]?.location ? ` · ${f.evidence[0].location}` : ""}`, t("missing"))));
      if (item.status === "disabled") rows.push(this.check(t("status"), "mute", t("automationOff"), t("disabled")));
      if (!broken.length) rows.push(this.check(t("dependencies"), "ok", t("refsResolved"), t("present")));
      cause = broken.length ? t("cause_automation_broken", { count: broken.length }) : t("cause_automation_ok");
      if (broken.length) { hint = t("hint_automation_broken"); tone = "red"; }
    } else return null;
    return { rows, cause, hint, tone };
  }

  diagnosisCard(item) {
    const d = this.diagnose(item);
    if (!d) return "";
    const icon = { ok: "mdi:check-circle", warn: "mdi:alert-circle", red: "mdi:close-circle", mute: "mdi:minus-circle", violet: "mdi:help-circle" };
    const rows = d.rows.map(r => `<div class="check ${r.tone}"><ha-icon icon="${icon[r.tone] || icon.ok}"></ha-icon><b>${this.esc(r.label)}</b><span class="val">${this.esc(r.value)}</span><i class="pill ${r.tone}">${this.esc(r.badge)}</i></div>`).join("");
    return `<section class="panel"><div class="panelhead"><div><h2>${this.t("diagnosis")}</h2>${item.reason ? `<p>${this.esc(this.t(item.reason))}</p>` : ""}</div></div>
      <div class="diagcard"><div class="checks">${rows}</div>
      ${d.cause ? `<div class="cause ${d.tone}"><ha-icon icon="mdi:text-search"></ha-icon><div><strong>${this.t("causeLabel")}</strong><p>${this.esc(d.cause)}</p></div></div>` : ""}
      ${d.hint ? `<div class="hintbox"><ha-icon icon="mdi:lightbulb-on-outline"></ha-icon><div><strong>${this.t("hintLabel")}</strong><p>${this.esc(d.hint)}</p></div></div>` : ""}</div></section>`;
  }

  factsCard(item, key) {
    const finding = this.data.findings.find(f => this.findingKey(f) === key);
    const usage = this.data.edges.filter(e => e.target === key && ["TRIGGERS_ON", "USES_AS_CONDITION", "TARGETS", "REFERENCES"].includes(e.relation)).length;
    const min = this.data.meta.min_unavailable_days || 0;
    const facts = [[this.t("status"), this.pill(item.status)]];
    if (item.status_since) facts.push([this.t("since"), `${this.formatDate(item.status_since)}<small>${this.esc(this.relTime(item.status_since))} · ${this.t("firstSeenNote")}</small>`]);
    if (item.object_type === "entity" || item.object_type === "automation") {
      facts.push([this.t("finding"), finding ? `${this.pill(finding.classification)}<small>${this.t("certainty")}: ${Math.round(finding.confidence * 100)} %</small>` : this.t("noFinding")]);
    }
    if (item.object_type === "entity") facts.push([this.t("refCount"), this.formatNumber(usage)]);
    const note = item.status === "unavailable" && !finding && min > 0 ? `<p class="factnote">${this.t("belowThreshold", { days: min })}</p>` : "";
    return `<section class="panel"><div class="panelhead"><h2>${this.t("facts")}</h2></div><div class="facts">${facts.map(([k, v]) => `<div class="fact"><span>${k}</span><b>${v}</b></div>`).join("")}</div>${note}</section>`;
  }

  relationsCard(key) {
    const USAGE = ["TRIGGERS_ON", "USES_AS_CONDITION", "TARGETS", "REFERENCES"];
    const incoming = this.data.edges.filter(e => e.target === key), outgoing = this.data.edges.filter(e => e.source === key);
    const groups = [
      [this.t("origin"), incoming.filter(e => !USAGE.includes(e.relation)).map(e => ({ other: e.source, label: this.t(e.relation), edge: e }))],
      [this.t("usage"), [
        ...incoming.filter(e => USAGE.includes(e.relation)).map(e => ({ other: e.source, label: `${this.t("usedBy")} · ${this.t(e.relation)}`, edge: e })),
        ...outgoing.map(e => ({ other: e.target, label: this.t(e.relation), edge: e })),
      ]],
    ].filter(([, list]) => list.length);
    const LIMIT = 25;
    const row = ({ other, label, edge }) => {
      const obj = this.findObject(other), [type, ...rest] = other.split(":");
      const note = `${label}${edge.location && edge.location !== "runtime_extraction" ? ` · ${edge.location}` : ""}`;
      const text = `${this.tile(obj?.object_type || type, obj ? (this.tone(obj.status) === "ok" ? "" : this.tone(obj.status)) : "red")}<span class="row-text"><strong>${this.esc(obj?.name || rest.join(":"))}</strong><small>${this.esc(note)}</small></span>${obj ? this.pill(obj.status) : `<span class="pill red">${this.t("missing")}</span>`}`;
      return obj ? `<button class="row rel" data-object="${this.esc(other)}">${text}</button>` : `<div class="row rel">${text}</div>`;
    };
    const body = groups.map(([title, list]) => `<div class="sectionlabel">${title} (${list.length})</div>${list.slice(0, LIMIT).map(row).join("")}${list.length > LIMIT ? `<p class="factnote">${this.t("moreItems", { count: list.length - LIMIT })}</p>` : ""}`).join("");
    return `<section class="panel"><div class="panelhead"><h2>${this.t("relations")} (${incoming.length + outgoing.length})</h2></div>${body || `<p class="factnote">${this.t("noRelations")}</p>`}</section>`;
  }

  detail() {
    const base = this.selected;
    const item = { ...base, ...(this.details.get(this.objectKey(base)) || {}) };
    const key = this.objectKey(item);
    const skip = new Set(["attributes", "references", "name", "object_id", "object_type", "status", "reason", "state", "status_since", "status_since_source", "triggers", "conditions", "actions"]);
    const fields = Object.entries(item).filter(([k, v]) => !skip.has(k) && v !== null && v !== undefined && (typeof v !== "object" || Array.isArray(v)));
    const automation = item.object_type === "automation" && !this.detailLoading
      ? `<section class="panel"><div class="panelhead"><h2>${this.t("automationStructure")}</h2></div><div class="pad">${["triggers", "conditions", "actions"].map(part => `<h4>${this.t(part)} (${item[part]?.length || 0})</h4><div class="code">${this.esc(JSON.stringify(item[part] || [], null, 2))}</div>`).join("")}</div></section>` : "";
    const attrs = item.attributes && Object.keys(item.attributes).length
      ? `<section class="panel"><div class="panelhead"><h2>${this.t("state")}</h2></div><div class="pad"><div class="code">${this.esc(JSON.stringify(item.attributes, null, 2))}</div></div></section>` : "";
    const path = this.haPath(item), tone = this.tone(item.status) === "ok" ? "" : this.tone(item.status);
    const back = this.trail.length ? this.trail[this.trail.length - 1].name : this.t(this.view);
    return `<div class="crumbs"><button class="btn" data-action="back"><ha-icon icon="mdi:arrow-left"></ha-icon>${this.t("backTo")} ${this.esc(back)}</button><span class="trail">${this.t(item.object_type)}</span></div>
      <div class="panel detailhead">${this.tile(item.object_type, tone)}<div>${this.pill(item.status)}<h1>${this.esc(item.name)}</h1><span class="id">${this.esc(item.object_id)}</span></div>
      <div class="actions">${path ? `<button class="btn" data-ha-path="${this.esc(path)}"><ha-icon icon="mdi:open-in-new"></ha-icon>${this.t("openInHA")}</button>` : ""}<button class="btn" data-graph-open="${this.esc(key)}"><ha-icon icon="mdi:source-fork"></ha-icon>${this.t("showInGraph")}</button></div></div>
      <div class="detailgrid"><div class="stack">${this.diagnosisCard(item)}
        <section class="panel"><div class="panelhead"><h2>${this.t("registry")}</h2></div><div class="pad"><dl class="kv"><dt>${this.t("type")}</dt><dd>${this.t(item.object_type)}</dd>${fields.map(([k, v]) => `<dt>${this.esc(k)}</dt><dd>${this.esc(Array.isArray(v) ? v.join(", ") : v)}</dd>`).join("")}</dl></div></section>
        ${automation}${attrs}${this.detailLoading ? `<p class="sub">${this.t("loading")}</p>` : ""}</div>
      <div class="stack">${this.factsCard(item, key)}${this.relationsCard(key)}</div></div>`;
  }

  bind() {
    const root = this.shadowRoot;
    root.querySelectorAll("[data-view]").forEach(el => el.onclick = () => { this.view = el.dataset.view; this.selected = null; this.trail = []; this.render(); });
    root.querySelector("[data-action='scan']")?.addEventListener("click", () => this.load(true));
    root.querySelector("[data-action='back']")?.addEventListener("click", () => this.goBack());
    root.querySelectorAll("[data-graph-open]").forEach(el => el.onclick = () => {
      const obj = this.findObject(el.dataset.graphOpen);
      if (obj) { this.graphSelected = obj; this.graphQuery = ""; this.view = "graph"; this.selected = null; this.trail = []; this.render(); }
    });
    root.querySelectorAll("[data-jump]").forEach(el => el.onclick = () => {
      this.view = el.dataset.jump;
      if (el.dataset.jump === "inventory") { this.statusFilter = el.dataset.status || ""; this.typeFilter = ""; this.page = 1; }
      this.render();
    });
    root.querySelectorAll("[data-type-jump]").forEach(el => el.onclick = () => { this.typeFilter = el.dataset.typeJump; this.statusFilter = ""; this.page = 1; this.view = "inventory"; this.render(); });
    root.querySelectorAll("[data-export]").forEach(el => el.onclick = () => this.exportFindings(el.dataset.export));
    root.querySelectorAll("[data-finding-filter]").forEach(el => el.onclick = () => { this.findingFilter = el.dataset.findingFilter; this.render(); });
    const focusKeep = (selector, setter) => {
      const input = root.querySelector(selector);
      if (!input) return;
      input.oninput = () => {
        setter(input.value);
        const caret = input.selectionStart;
        this.render();
        const next = this.shadowRoot.querySelector(selector);
        if (next) { next.focus(); next.setSelectionRange(caret, caret); }
      };
    };
    focusKeep("#query", v => { this.query = v; this.page = 1; });
    focusKeep("#graphQuery", v => { this.graphQuery = v; });
    const tf = root.querySelector("#typeFilter"); if (tf) tf.onchange = () => { this.typeFilter = tf.value; this.page = 1; this.render(); };
    const sf = root.querySelector("#statusFilter"); if (sf) sf.onchange = () => { this.statusFilter = sf.value; this.page = 1; this.render(); };
    root.querySelectorAll("th[data-sort]").forEach(el => el.onclick = () => { this.sort = el.dataset.sort; this.render(); });
    root.querySelectorAll("[data-object]").forEach(el => el.onclick = () => { const obj = this.findObject(el.dataset.object); if (obj) this.openObject(obj); });
    root.querySelectorAll("[data-graph]").forEach(el => el.onclick = () => { const obj = this.findObject(el.dataset.graph); if (obj) { this.graphSelected = obj; this.graphQuery = ""; this.render(); } });
    root.querySelectorAll("[data-ha-path]").forEach(el => el.onclick = () => this.navigateHA(el.dataset.haPath));
    root.querySelectorAll("[data-page]").forEach(el => el.onclick = () => { this.page = Number(el.dataset.page); this.render(); });
  }
}

if (!customElements.get("ha-housekeeper-panel")) customElements.define("ha-housekeeper-panel", HAHousekeeperPanel);
