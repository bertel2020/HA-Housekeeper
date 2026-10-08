// BlueprintsMixin: blueprints nothing uses and automations whose blueprint is gone; mixed into the panel in 99-register.js.
class BlueprintsMixin {
  ensureBlueprints() {
    if (this._blueprintsRequested) return;
    this._blueprintsRequested = true;
    setTimeout(async () => {
      try { this.blueprints = await this._hass.callWS({ type: "ha_housekeeper/blueprints" }); this.blueprintsError = ""; }
      catch (err) { this.blueprints = null; this.blueprintsError = err?.message || String(err); }
      this.render();
    }, 0);
  }

  blueprintsCount() { const b = this.blueprints; return b ? b.unused + b.missing + b.broken : null; }

  blueprintsCard() {
    this.ensureBlueprints();
    const head = `<div class="panelhead"><div><h2>${this.t("bpTitle")}</h2><p>${this.t("bpHint")}</p></div><div class="actions"><button class="btn" data-bp-refresh>${this.t("relRefresh")}</button></div></div>`;
    if (this.blueprintsError) return `<div class="panel">${head}<div class="error">${this.esc(this.blueprintsError)}</div></div>`;
    if (!this.blueprints) return `<div class="panel">${head}${this.skeleton("loading")}</div>`;
    const users = (b) => (b.users || []).map(u => {
      const obj = this.findObject(`${u.id.split(".")[0]}:${u.id}`);
      return obj ? `<button class="linklike" data-object="${this.esc(this.objectKey(obj))}">${this.esc(u.name)}</button>` : this.esc(u.name);
    }).join(", ") + (b.count > (b.users || []).length ? ` +${b.count - b.users.length}` : "");
    const row = (tone, icon, title, sub) => `<div class="row rel"><span class="tile ${tone}"><ha-icon icon="${icon}"></ha-icon></span><span class="row-text"><strong>${this.esc(title)}</strong><small>${sub}</small></span></div>`;
    const blocks = this.blueprints.domains.map(d => {
      const rows = [
        ...d.missing.map(b => row("red", "mdi:file-question-outline", b.path, `${this.t("bpMissing")} · ${users(b)}`)),
        ...d.broken.map(b => row("red", "mdi:file-alert-outline", b.path, `${this.t("bpBroken")}${b.count ? ` · ${users(b)}` : ""}`)),
        ...d.unused.map(b => row("mute", "mdi:file-hidden", b.name === b.path ? b.path : b.name, `${this.t("bpUnused")} · ${this.esc(b.path)}`)),
      ].join("");
      return `<div class="sectionlabel">${this.t(d.domain)} (${this.formatNumber(d.total)} ${this.t("bpFiles")})</div>${rows || `<div class="emptymsg"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${this.t("bpNone")}</div>`}`;
    }).join("");
    return `<div class="panel">${head}${blocks}</div>`;
  }
}
