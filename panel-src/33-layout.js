// LayoutMixin: the pieces every long view shares (a row of key figures and tabs for its sections); mixed in by 99-register.js.
class LayoutMixin {
  // A row of key figures. tile: { label, value, sub, tone ("ok"|"warn"|"red"|"mute"), tab } where tab ("view|id") makes it a button.
  sumTiles(tiles) {
    const cells = tiles.filter(Boolean).map(t => {
      const inner = `<span class="sumlabel">${this.esc(t.label)}</span><b class="sumvalue">${t.value}</b>${t.sub ? `<small>${t.sub}</small>` : ""}`;
      return t.tab ? `<button class="sumtile ${t.tone || "mute"}" data-view-tab="${this.esc(t.tab)}">${inner}</button>` : `<div class="sumtile ${t.tone || "mute"}">${inner}</div>`;
    }).join("");
    return cells ? `<div class="sumtiles" role="group" aria-label="${this.esc(this.t("sumLabel"))}">${cells}</div>` : "";
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
    this.render();
  }
}
