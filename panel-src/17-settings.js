// SettingsMixin: methods of the panel element, mixed into the class in 99-register.js.
class SettingsMixin {
  infoText() {
    const m = this.data?.meta || {};
    return [`HA Housekeeper ${m.version || "?"}`, `Home Assistant ${m.ha_version || "?"}`, `${this.t("lastScan")}: ${m.scanned_at || "-"}`,
      `${this.t("objects")}: ${m.object_count ?? "-"}`, `${this.t("findings")}: ${this.data ? this.data.findings.filter(f => !f.ignored).length : "-"}`].join("\n");
  }

  segment(pref, options) {
    return `<div class="seg">${options.map(([value, label, dot]) => `<button class="chip ${String(this.prefs[pref]) === String(value) ? "active" : ""}" data-pref="${pref}|${value}">${dot ? `<span class="swatch" style="background:${dot}"></span>` : ""}${label}</button>`).join("")}</div>`;
  }

  settingsView() {
    const m = this.data?.meta || {}, p = this.prefs;
    const days = n => (n > 0 ? this.t("daysValue", { n }) : this.t("immediately"));
    const fact = (k, v) => `<div class="fact"><span>${k}</span><b>${v}</b></div>`;
    const facts = [
      fact(this.t("version"), this.esc(m.version || "–")), fact(this.t("haVersion"), this.esc(m.ha_version || "–")),
      fact(this.t("mode"), this.t("readOnlyValue")),
      fact(this.t("lastScan"), m.scanned_at ? this.formatDate(m.scanned_at) : "–"),
      fact(this.t("objects"), this.formatNumber(m.object_count ?? 0)),
      fact(this.t("scanInterval"), m.scan_interval_hours > 0 ? this.t("hoursValue", { n: m.scan_interval_hours }) : this.t("offValue")),
      fact(this.t("unavailableAfter"), days(m.min_unavailable_days ?? 0)),
      fact(this.t("unusedAfter"), m.unused_automation_days > 0 ? this.t("daysValue", { n: m.unused_automation_days }) : this.t("offValue")),
      fact(this.t("lowBatteryAt"), `${this.esc(m.low_battery_percent ?? 20)} %`),
    ].join("");
    const links = `<div class="actions" style="padding:14px 16px;display:flex;flex-wrap:wrap;gap:8px">
      <button class="btn" data-ha-path="/config/integrations/integration/ha_housekeeper"><ha-icon icon="mdi:cog-outline"></ha-icon>${this.t("openOptions")}</button>
      <a class="btn" href="${REPO_URL}" target="_blank" rel="noopener noreferrer"><ha-icon icon="mdi:github"></ha-icon>${this.t("repository")}</a>
      <a class="btn" href="${REPO_URL}/issues" target="_blank" rel="noopener noreferrer"><ha-icon icon="mdi:bug-outline"></ha-icon>${this.t("reportIssue")}</a>
      <a class="btn" href="${REPO_URL}/blob/main/CHANGELOG.md" target="_blank" rel="noopener noreferrer"><ha-icon icon="mdi:history"></ha-icon>${this.t("changelog")}</a>
      <button class="btn" data-copy-info><ha-icon icon="mdi:content-copy"></ha-icon>${this.t(this.copied ? "copied" : "copyInfo")}</button></div>`;
    const row = (label, hint, control) => `<div class="setrow"><div>${label}${hint ? `<small>${hint}</small>` : ""}</div>${control}</div>`;
    const select = (key, options) => `<select data-pref-select="${key}">${options.map(([v, l]) => `<option value="${v}" ${String(p[key]) === String(v) ? "selected" : ""}>${l}</option>`).join("")}</select>`;
    const appearance = `<section class="panel"><div class="panelhead"><h2>${this.t("appearance")}</h2></div>
      ${row(this.t("fontSize"), "", this.segment("size", [["small", this.t("fontSmall")], ["normal", this.t("fontNormal")], ["large", this.t("fontLarge")]]))}
      ${row(this.t("colorMode"), this.t("modeHint"), this.segment("mode", [["auto", this.t("modeAuto")], ["light", this.t("modeLight")], ["dark", this.t("modeDark")]]))}
      ${row(this.t("density"), "", this.segment("density", [["normal", this.t("densityNormal")], ["compact", this.t("densityCompact")]]))}
      ${row(this.t("motion"), this.t("motionHint"), this.segment("motion", [["auto", this.t("motionAuto")], ["reduced", this.t("motionReduced")]]))}
      ${row(this.t("colorScheme"), "", this.segment("scheme", [["standard", this.t("schemeStandard"), "#0789cf"], ["housekeeper", this.t("schemeHousekeeper"), SCHEMES.housekeeper.light.accent], ["modern", this.t("schemeModern"), SCHEMES.modern.light.accent]]))}</section>`;
    const behavior = `<section class="panel"><div class="panelhead"><h2>${this.t("behavior")}</h2></div>
      ${row(this.t("startView"), "", select("startView", START_VIEWS.map(v => [v, this.t(v)])))}
      ${row(this.t("pageSizeSetting"), "", select("pageSize", [20, 50, 100].map(n => [n, n])))}
      <div class="setrow"><small style="margin:0">${this.t("prefsNote")}</small><button class="btn" data-pref-reset>${this.t("resetPrefs")}</button></div></section>`;
    const optionRow = (key, label) => {
      const [min, max] = OPTION_LIMITS[key];
      return row(label, "", `<input type="number" data-opt="${key}" min="${min}" max="${max}" step="1" value="${this.esc(m[key] ?? "")}" style="max-width:160px">`);
    };
    const optionsCard = this.data ? `<section class="panel"><div class="panelhead"><div><h2>${this.t("scanSettings")}</h2><p>${this.t("scanSettingsHint")}</p></div></div>
      ${optionRow("min_unavailable_days", this.t("optMinUnavailable"))}${optionRow("unused_automation_days", this.t("optUnusedAutomation"))}${optionRow("scan_interval_hours", this.t("optScanInterval"))}${optionRow("low_battery_percent", this.t("optLowBattery"))}${optionRow("history_days", this.t("optHistoryDays"))}
      <div class="setrow"><small style="margin:0">${this.esc(this.optionsMessage || "")}</small><button class="btn primary" data-opts-save>${this.t("saveOptions")}</button></div></section>` : "";
    const hidden = (this.data?.findings || []).filter(f => f.ignored);
    const pg = this.paginate("hidden", hidden);
    const hiddenRow = f => {
      const object = this.findObject(this.findingKey(f));
      const action = f.ignored_by === "label" ? `<span class="pill mute">${this.t("ignoredByLabel")}</span>` : `<button class="btn" data-ignore="${this.esc(f.key)}" data-ignore-value="0">${this.t("showFinding")}</button>`;
      return `<div class="row"><span class="tile mute"><ha-icon icon="mdi:eye-off-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(object?.name || f.object_id)}</strong><small>${this.esc(f.object_id)} · ${this.esc(this.findingTitle(f))}</small></span>${action}</div>`;
    };
    const hiddenCard = `<section class="panel"><div class="panelhead"><div><h2>${this.t("hiddenFindings")} (${hidden.length})</h2><p>${this.t("hiddenHint")}</p></div></div>${hidden.length ? pg.rows.map(hiddenRow).join("") : `<div class="emptymsg"><ha-icon icon="mdi:eye-check-outline"></ha-icon>${this.t("hiddenNone")}</div>`}${pg.footer}</section>`;
    return `<div class="grid2"><div class="stack">${appearance}${behavior}${optionsCard}${hiddenCard}</div><div class="stack"><section class="panel"><div class="panelhead"><h2>${this.t("about")}</h2></div><div class="facts">${facts}</div>${links}</section></div></div>`;
  }

  async saveOptions() {
    const changes = {};
    for (const input of this.shadowRoot.querySelectorAll("[data-opt]")) {
      const [min, max] = OPTION_LIMITS[input.dataset.opt], value = Number(input.value);
      if (input.value === "" || !Number.isInteger(value) || value < min || value > max) { this.optionsMessage = this.t("optionsInvalid"); this.render(); return; }
      changes[input.dataset.opt] = value;
    }
    try {
      await this._hass.callWS({ type: "ha_housekeeper/set_options", ...changes });
      this.optionsMessage = this.t("optionsSaved");
      this.data = null; // the integration reloads; fetch again once it is back
      this.render();
      setTimeout(() => { this.optionsMessage = ""; this.busy = false; this.load(false); }, 4000);
    } catch (err) { this.optionsMessage = err?.message || String(err); this.render(); }
  }
}
