// SearchMixin: one search box in the top bar for entities, devices, integrations, automations and scripts.
const QUICK_TYPES = ["entity", "device", "config_entry", "automation", "script"];
const QUICK_LIMIT = 12;

class SearchMixin {
  // The one object search: every word must occur in the name, the id, the integration, the maker or the model; names that
  // start with the first word come first. The top bar, the dependency path and the sensor fields all use it.
  searchObjects(query, { types = QUICK_TYPES, limit = QUICK_LIMIT, filter = null } = {}) {
    const terms = String(query).toLowerCase().split(/\s+/).filter(Boolean);
    if (!this.data || !terms.length) return [];
    const found = [];
    for (const item of this.data.objects) {
      if ((types && !types.includes(item.object_type)) || (filter && !filter(item))) continue;
      const name = String(item.name || "").toLowerCase();
      const hay = `${name} ${String(item.object_id).toLowerCase()} ${String(item.platform || item.domain || "").toLowerCase()} ${String(item.manufacturer || "").toLowerCase()} ${String(item.model || "").toLowerCase()}`;
      if (!terms.every(term => hay.includes(term))) continue;
      found.push({ item, rank: name.startsWith(terms[0]) ? 0 : name.includes(terms[0]) ? 1 : 2 });
    }
    const order = types || QUICK_TYPES;
    found.sort((a, b) => a.rank - b.rank || order.indexOf(a.item.object_type) - order.indexOf(b.item.object_type) || String(a.item.name).localeCompare(String(b.item.name)));
    return found.slice(0, limit).map(entry => entry.item);
  }

  quickResults() {
    return this.quickQuery.trim().length < 2 ? [] : this.searchObjects(this.quickQuery);
  }

  quickSearchBox() {
    if (!this.data) return "";
    const results = this.quickOpen ? this.quickResults() : [];
    const active = Math.min(this.quickIndex, Math.max(results.length - 1, 0));
    const list = this.quickOpen && this.quickQuery.trim().length >= 2
      ? `<ul class="quicklist" id="quick-list" role="listbox" aria-label="${this.esc(this.t("quickLabel"))}">${results.length
        ? results.map((item, i) => `<li role="option" id="quick-opt-${i}" aria-selected="${i === active}" data-quick-item="${this.esc(this.objectKey(item))}" class="${i === active ? "on" : ""}">${this.tile(item.object_type)}<span class="row-text"><strong>${this.esc(item.name)}</strong><small>${this.esc(this.t(item.object_type))} · ${this.esc(item.object_id)}</small></span></li>`).join("")
        : `<li class="none">${this.t("quickNone")}</li>`}</ul>` : "";
    return `<div class="quick"><ha-icon icon="mdi:magnify"></ha-icon><input type="search" data-quick autocomplete="off" role="combobox" aria-expanded="${Boolean(list)}" aria-controls="quick-list" aria-autocomplete="list" ${list && results.length ? `aria-activedescendant="quick-opt-${active}"` : ""} placeholder="${this.esc(this.t("quickPlaceholder"))}" aria-label="${this.esc(this.t("quickLabel"))}" value="${this.esc(this.quickQuery)}">${list}</div>`;
  }

  quickPick(key) {
    const obj = this.findObject(key);
    if (!obj) return;
    this.quickQuery = ""; this.quickOpen = false; this.quickIndex = 0; this.menuOpen = null; this.navOpen = false;
    this.openObject(obj);
  }

  bindQuick(root) {
    const input = root.querySelector("[data-quick]");
    if (input) {
      input.oninput = () => { this.quickQuery = input.value; this.quickOpen = true; this.quickIndex = 0; this.scheduleRender(); };
      input.onfocus = () => { if (this.quickQuery && !this.quickOpen) { this.quickOpen = true; this.render(); } };
      input.onkeydown = ev => {
        const results = this.quickResults();
        if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
          if (!results.length) return;
          ev.preventDefault();
          this.quickOpen = true;
          this.quickIndex = (this.quickIndex + (ev.key === "ArrowDown" ? 1 : results.length - 1)) % results.length;
          this.render();
        } else if (ev.key === "Enter" && results.length) {
          ev.preventDefault();
          this.quickPick(this.objectKey(results[Math.min(this.quickIndex, results.length - 1)]));
        } else if (ev.key === "Escape" && (this.quickOpen || this.quickQuery)) {
          ev.stopPropagation();
          this.quickQuery = ""; this.quickOpen = false; this.render();
        }
      };
    }
    root.querySelectorAll("[data-quick-item]").forEach(el => el.onclick = () => this.quickPick(el.dataset.quickItem));
    if (!this._quickBound && root.addEventListener) {
      this._quickBound = true;
      root.addEventListener("click", ev => {
        if (!this.quickOpen || (ev.composedPath?.() || []).some(node => node.classList?.contains?.("quick"))) return;
        this.quickOpen = false; this.render();
      });
    }
  }
}
