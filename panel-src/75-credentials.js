// CredentialsMixin: the page "Tokens & secrets" under Explore; mixed in by 99-register.js.
// Stored credentials of the integrations, masked; the full value of one field only on a click.
// It uses the loader and the list of SystemMixin (73-system.js).
SYS_COMMANDS.secrets = "credentials";

class CredentialsMixin {
  secKey(c) { return `${c.entry_id}|${c.source}|${c.key}`; }

  secretsView() {
    return this.sysFrame("secrets", "secTitle", "secHint", "secLoading", (r, head) => {
      const list = r.credentials || [];
      if (this._secData !== r) { this._secData = r; this.secShown = null; } // a fresh list starts masked
      const shown = this.secShown || new Map();
      const tiles = this.sumTiles([
        { label: this.t("secSumFields"), value: this.esc(this.formatNumber(list.length)), tone: "mute" },
        { label: this.t("secSumEntries"), value: this.esc(this.formatNumber(r.entries || 0)), tone: "mute" },
        { label: this.t("secSumData"), value: this.esc(this.formatNumber(list.filter(c => c.source === "data").length)), tone: "mute" },
        { label: this.t("secSumOptions"), value: this.esc(this.formatNumber(list.filter(c => c.source === "options").length)), tone: "mute" },
      ]);
      const domains = [...new Set(list.map(c => c.domain))].sort();
      const value = c => {
        const key = this.secKey(c), plain = shown.get(key);
        const text = plain === undefined ? `<code class="secval">${this.esc(c.masked)}</code>` : `<code class="secval shown">${this.esc(plain)}</code>`;
        const copy = plain === undefined ? "" : `<button type="button" class="btn quiet" data-copy="${this.esc(plain)}" title="${this.esc(this.t("copyId"))}" aria-label="${this.esc(this.t("copyId"))}"><ha-icon icon="mdi:content-copy"></ha-icon></button>`;
        const toggle = plain === undefined
          ? `<button type="button" class="btn quiet" data-sec-show="${this.esc(key)}" title="${this.esc(this.t("secShowTitle"))}"><ha-icon icon="mdi:eye-outline"></ha-icon>${this.t("secShow")}</button>`
          : `<button type="button" class="btn quiet" data-sec-hide="${this.esc(key)}"><ha-icon icon="mdi:eye-off-outline"></ha-icon>${this.t("secHide")}</button>`;
        return `<div class="seccell">${text}<span class="secbtns">${toggle}${copy}</span></div>`;
      };
      const table = this.sysList("secrets", list, {
        sort: "domain", dir: "asc",
        sorts: [{ key: "domain", label: "secColIntegration", dir: "asc", get: c => `${c.domain} ${c.title}` }, { key: "field", label: "secColField", dir: "asc", get: c => c.key }, { key: "source", label: "secColSource", dir: "asc", get: c => c.source }],
        filters: [
          { name: "domain", all: this.t("secAllDomains"), options: domains.map(d => [d, d]) },
          { name: "source", all: this.t("secAllSources"), options: [["data", this.t("secSource_data")], ["options", this.t("secSource_options")]] },
        ],
        filterFns: { domain: (c, v) => c.domain === v, source: (c, v) => c.source === v },
        text: c => `${c.domain} ${c.title} ${c.key}`, tie: c => this.secKey(c), empty: "secNone", cls: "secrets",
        columns: [
          { key: "domain", label: "secColIntegration", cell: c => this.nameCell(c.title || c.domain, c.domain) },
          { key: "source", label: "secColSource", cell: c => `<span class="pill mute">${this.t(`secSource_${c.source}`)}</span>` },
          { key: "field", label: "secColField", cell: c => `<code class="secfield">${this.esc(c.key)}</code>` },
          { key: "value", label: "secColValue", sortable: false, cell: value },
        ],
        // No export: a file with credentials should not come from a click on a list.
      });
      return `<div class="stack"><div class="panel">${head}<div class="pad"><p class="factnote">${this.t("secIntro")}</p></div></div>${tiles}<div class="panel">${table}${this.howCounted("secFootnote")}</div></div>`;
    });
  }

  async secReveal(key) {
    const [entryId, source, ...rest] = String(key).split("|");
    try {
      const res = await this._hass.callWS({ type: "ha_housekeeper/credential_reveal", entry_id: entryId, source, key: rest.join("|") });
      (this.secShown ||= new Map()).set(key, String(res?.value ?? ""));
      this.render();
    } catch (err) {
      this.noteError("action", err);
      this.toast(this.t("secFailed"), true);
    }
  }

  bindCredentials(root) {
    root.querySelectorAll("[data-sec-show]").forEach(el => el.onclick = ev => { ev.stopPropagation(); this.secReveal(el.dataset.secShow); });
    root.querySelectorAll("[data-sec-hide]").forEach(el => el.onclick = ev => { ev.stopPropagation(); this.secShown?.delete(el.dataset.secHide); this.render(); });
  }
}
