// LayoutMixin: the pieces every long view shares (a row of key figures and tabs for its sections); mixed in by 99-register.js.
class LayoutMixin {
  // A row of key figures. tile: { label, value, sub, tone ("ok"|"warn"|"red"|"mute"), tab, filter } where tab ("view|id") makes it a button.
  sumTiles(tiles) {
    const cells = tiles.filter(Boolean).map(t => {
      const inner = `<span class="sumlabel">${this.esc(t.label)}</span><b class="sumvalue">${t.value}</b>${t.sub ? `<small>${t.sub}</small>` : ""}${t.spark ? `<span class="spark-row">${t.spark}</span>` : ""}`;
      if (t.filter !== undefined) return `<button class="sumtile ${t.tone || "mute"}" data-finding-filter="${this.esc(t.filter)}" aria-pressed="${Boolean(t.active)}">${inner}</button>`;
      if (t.attr) return `<button class="sumtile ${t.tone || "mute"}" ${t.attr[0]}="${this.esc(t.attr[1])}" aria-pressed="${Boolean(t.active)}">${inner}</button>`;
      if (t.unref) return `<button class="sumtile ${t.tone || "mute"}" data-unref-tab="${t.unref}" aria-pressed="${Boolean(t.active)}">${inner}</button>`;
      if (t.inv !== undefined) return `<button class="sumtile ${t.tone || "mute"}" data-inv-filter="${this.esc(t.inv)}" aria-pressed="${Boolean(t.active)}">${inner}</button>`;
      return t.tab ? `<button class="sumtile ${t.tone || "mute"}" data-view-tab="${this.esc(t.tab)}">${inner}</button>` : `<div class="sumtile ${t.tone || "mute"}">${inner}</div>`;
    }).join("");
    return cells ? `<div class="sumtiles" role="group" aria-label="${this.esc(this.t("sumLabel"))}">${cells}</div>` : "";
  }

  // Tiles that switch between the areas of one view: icon, title, number and a short hint; the open one is marked.
  // tab: { id, icon, label, hint, count, tone, pill, pillTone, disabled }.
  navTiles(view, tabs, open, label) {
    const cells = tabs.map(t => {
      const tone = t.tone || "mute", has = t.count !== undefined && t.count !== null;
      const pills = `${has ? `<span class="pill ${tone}">${this.esc(this.formatNumber(t.count))}</span>` : ""}${t.pill ? `<span class="pill ${t.pillTone || tone}">${this.esc(t.pill)}</span>` : ""}`;
      const inner = `<ha-icon icon="${t.icon}"></ha-icon><strong>${this.esc(t.label)}</strong><span class="setpill">${pills}</span><small>${this.esc(t.hint || "")}</small>`;
      if (t.disabled) return `<div class="taskcard t-mute off" aria-disabled="true">${inner}</div>`;
      return `<button class="taskcard t-${tone}${t.id === open ? " on" : ""}" aria-pressed="${t.id === open}" data-view-tab="${this.esc(`${view}|${t.id}`)}">${inner}</button>`;
    }).join("");
    return `<div class="taskgrid compactgrid setgrid navtiles" role="group" aria-label="${this.esc(label)}">${cells}</div>`;
  }

  // The tab that is open in a view: the chosen one if it exists, else the first one of `tabs` or `prefer`.
  viewTabOf(view, tabs, prefer) {
    const chosen = (this.viewTab ||= {})[view];
    if (tabs.some(t => t.id === chosen)) return chosen;
    return tabs.some(t => t.id === prefer) ? prefer : tabs[0].id;
  }

  // Tabs of one view; a coloured dot marks a tab that holds something to look at. tab: { id, label, count, tone }.
  viewTabBar(view, tabs, active) {
    const list = tabs.map(t => `<button class="tab" role="tab" aria-selected="${t.id === active}" tabindex="${t.id === active ? 0 : -1}" data-view-tab="${this.esc(`${view}|${t.id}`)}">${this.esc(t.label)}${t.count !== undefined && t.count !== null ? ` <em>${this.formatNumber(t.count)}</em>` : ""}${t.tone && t.tone !== "ok" && t.tone !== "mute" ? `<i class="tabdot ${t.tone}" aria-hidden="true"></i>` : ""}</button>`).join("");
    return `<div class="tabs" role="tablist" aria-label="${this.esc(this.t("tabsLabel"))}">${list}</div>`;
  }

  pickViewTab(tab) {
    const [view, id] = String(tab || "").split("|");
    if (!view || !id) return;
    (this.viewTab ||= {})[view] = id;
    if (view === "cleanup") { this.cleanupSel = new Set(); if (this.lv?.cleanup) this.lv.cleanup.f = {}; this.pages = {}; }
    if (view === "unreferenced") { this.unrefTab = id; this.retryOrphanLast(); this.pages = {}; }
    this.render();
  }
}
