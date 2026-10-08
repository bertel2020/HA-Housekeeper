// ListsMixin: methods of the panel element, mixed into the class in 99-register.js.
const VIEWS_KEY = "ha_housekeeper.views";
const VIEWS_LIMIT = 10;

class ListsMixin {
  th(key, label) {
    const on = this.sort === key;
    return `<th data-sort="${key}" aria-sort="${on ? (this.sortDir === "desc" ? "descending" : "ascending") : "none"}"><button type="button" class="thbtn" data-sortbtn="${key}">${this.t(label)}${on ? ` <span aria-hidden="true">${this.sortDir === "desc" ? "▼" : "▲"}</span>` : ""}</button></th>`;
  }

  // Shared list controls: per-list search, filters and sort kept in this.lv[id].
  lvState(id, sort, dir) { return (this.lv[id] ||= { q: "", sort, dir, f: {}, view: "" }); }

  areaName(item) {
    const device = item.device_id ? this.findObject(`device:${item.device_id}`) : null;
    return this.findObject(`area:${item.area_id || device?.area_id}`)?.name || "";
  }

  // Filter by search text and select filters, then sort. Empty values always sort last.
  refine(id, items, { text, filters = {}, sorts, tie }) {
    const st = this.lv[id], q = st.q.trim().toLowerCase();
    const get = sorts.find(x => x.key === st.sort)?.get || sorts[0].get;
    const sign = st.dir === "desc" ? -1 : 1;
    const empty = v => v === null || v === undefined || v === "";
    const { natural, ids } = this.collators();
    const rows = items.filter(it => (!q || text(it).toLowerCase().includes(q))
      && Object.entries(st.f).every(([name, value]) => !value || !filters[name] || filters[name](it, value)))
      .map(it => ({ it, key: get(it) })); // the sort key is read once per item, not per comparison
    rows.sort((a, b) => {
      const x = a.key, y = b.key;
      if (empty(x) !== empty(y)) return empty(x) ? 1 : -1;
      const order = typeof x === "number" && typeof y === "number" ? x - y : natural.compare(String(x ?? ""), String(y ?? ""));
      return order * sign || ids.compare(String(tie(a.it)), String(tie(b.it)));
    });
    return rows.map(row => row.it);
  }

  // A search box over a list that keeps its own order. The box shows from `min` items on, or while a text is set.
  searchList(id, items, text, min = 6) {
    const st = this.lvState(id, "", "asc"), q = st.q.trim().toLowerCase();
    const rows = q ? items.filter(item => text(item).toLowerCase().includes(q)) : items;
    return { rows, bar: items.length >= min || st.q ? this.listBar(id, { sorts: [] }) : "", none: q && !rows.length ? `<div class="emptymsg">${this.t("noMatches")}</div>` : "" };
  }

  listBar(id, { sorts, filters = [] }) {
    const st = this.lv[id];
    (this.lvDirs ||= {})[id] = Object.fromEntries(sorts.map(x => [x.key, x.dir]));
    const selects = filters.map(f => `<select data-lf="${id}|${f.name}" aria-label="${this.esc(f.all)}"><option value="">${this.esc(f.all)}</option>${f.options.map(([v, label]) => `<option value="${this.esc(v)}" ${st.f[f.name] === v ? "selected" : ""}>${this.esc(label)}</option>`).join("")}</select>`).join("");
    const sortOptions = sorts.map(x => `<option value="${x.key}" ${st.sort === x.key ? "selected" : ""}>${this.t(x.label)}</option>`).join("");
    const desc = st.dir === "desc";
    return `<div class="listbar"><input type="search" data-lq="${id}" value="${this.esc(st.q)}" placeholder="${this.t("searchList")}">${selects}${sorts.length ? `<span class="sortgroup"><select data-ls="${id}" aria-label="${this.t("sortBy")}">${sortOptions}</select><button class="dirbtn" data-ld="${id}" title="${this.t(desc ? "sortDescending" : "sortAscending")}" aria-label="${this.t(desc ? "sortDescending" : "sortAscending")}"><ha-icon icon="${desc ? "mdi:sort-descending" : "mdi:sort-ascending"}"></ha-icon></button></span>` : ""}${this.viewsControl(id)}</div>`;
  }

  // A sortable table for a list built with lvState/refine: header buttons set sort and direction, the phone shows cards.
  // columns: [{ key, label, cell(item) -> html, sortable, dir }]; rowAttrs(item) adds attributes to the row.
  listTable(id, columns, rows, { rowAttrs = () => "", cls = "" } = {}) {
    const st = this.lv[id];
    const head = columns.map(c => {
      const on = st.sort === c.key;
      const inner = c.sortable === false ? this.t(c.label) : `<button type="button" class="thbtn" data-lsort="${id}|${c.key}|${c.dir || "asc"}">${this.t(c.label)}${on ? ` <span aria-hidden="true">${st.dir === "desc" ? "↓" : "↑"}</span>` : ""}</button>`;
      return `<th scope="col" aria-sort="${on ? (st.dir === "desc" ? "descending" : "ascending") : "none"}">${inner}</th>`;
    }).join("");
    const body = rows.map(item => {
      const attrs = rowAttrs(item);
      return `<tr ${attrs}>${columns.map((c, i) => `<td${i ? ` data-label="${this.esc(this.t(c.label))}"` : ""}>${c.cell(item)}</td>`).join("")}</tr>`;
    }).join("");
    return `<div class="tablewrap lt ${cls}"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
  }

  // The date of a table cell: how long ago, with the exact time as a tooltip; empty when unknown.
  ageCell(iso) {
    if (!iso) return `<span class="muted">–</span>`;
    return `<span title="${this.esc(this.formatDate(iso))}">${this.esc(this.relTime(iso))}</span>`;
  }

  // Saved list views: search text, filters and sort under a name, kept in this browser only.
  viewsStore() {
    if (this._views) return this._views;
    let stored = {};
    try { stored = JSON.parse(globalThis.localStorage?.getItem(VIEWS_KEY) || "{}"); } catch (_) { stored = {}; }
    const clean = {};
    if (stored && typeof stored === "object") {
      for (const [id, list] of Object.entries(stored)) {
        if (!Array.isArray(list)) continue;
        clean[id] = list.filter(v => v && typeof v.name === "string" && v.name && typeof v.q === "string" && v.f && typeof v.f === "object" && typeof v.sort === "string" && (v.dir === "asc" || v.dir === "desc"))
          .slice(0, VIEWS_LIMIT).map(v => ({ name: v.name.slice(0, 40), q: v.q, f: Object.fromEntries(Object.entries(v.f).filter(([, x]) => typeof x === "string")), sort: v.sort, dir: v.dir }));
      }
    }
    return (this._views = clean);
  }

  persistViews() {
    try { globalThis.localStorage?.setItem(VIEWS_KEY, JSON.stringify(this._views || {})); } catch (_) { /* a private window: the views last until the page closes */ }
  }

  viewsControl(id) {
    const st = this.lv[id], saved = this.viewsStore()[id] || [];
    const dirty = Boolean(st.q.trim()) || Object.values(st.f).some(Boolean);
    if (!saved.length && !dirty) return "";
    const select = saved.length ? `<select data-lview="${id}" aria-label="${this.esc(this.t("viewsLabel"))}"><option value="">${this.t("viewsNone")}</option>${saved.map(v => `<option value="${this.esc(v.name)}" ${st.view === v.name ? "selected" : ""}>${this.esc(v.name)}</option>`).join("")}</select>` : "";
    const save = dirty ? `<button type="button" class="btn quiet" data-lview-save="${id}">${this.t("viewSave")}</button>` : "";
    const remove = st.view && saved.some(v => v.name === st.view) ? `<button type="button" class="btn quiet" data-lview-delete="${id}">${this.t("viewDelete")}</button>` : "";
    return `<span class="viewgroup">${select}${save}${remove}</span>`;
  }

  applyView(id, name) {
    const st = this.lv[id], view = (this.viewsStore()[id] || []).find(v => v.name === name);
    st.view = view ? view.name : "";
    if (view) { st.q = view.q; st.f = { ...view.f }; st.sort = view.sort; st.dir = view.dir; }
    this.pages = {}; this.render();
  }

  saveView(id) {
    const st = this.lv[id];
    const name = String(globalThis.prompt?.(this.t("viewName"), st.view || "") || "").trim().slice(0, 40);
    if (!name) return;
    const store = this.viewsStore(), list = (store[id] ||= []);
    const view = { name, q: st.q, f: Object.fromEntries(Object.entries(st.f).filter(([, v]) => v)), sort: st.sort, dir: st.dir };
    const at = list.findIndex(v => v.name === name);
    if (at >= 0) list[at] = view; else if (list.length < VIEWS_LIMIT) list.push(view); else list[list.length - 1] = view;
    st.view = name; this.persistViews(); this.render();
  }

  deleteView(id) {
    const st = this.lv[id], store = this.viewsStore();
    store[id] = (store[id] || []).filter(v => v.name !== st.view);
    st.view = ""; this.persistViews(); this.render();
  }

  // Long explanations of how a number is counted fold away, so the lists end earlier.
  howCounted(key, vars) {
    return `<details class="howto"><summary>${this.t("howCounted")}</summary><p class="factnote">${this.t(key, vars)}</p></details>`;
  }

  // Shared paging for long lists: returns the visible slice and the footer markup.
  paginate(id, items) {
    const count = Math.max(1, Math.ceil(items.length / this.pageSize));
    const page = Math.min(Math.max(1, this.pages[id] || 1), count);
    this.pages[id] = page;
    const from = (page - 1) * this.pageSize;
    const rows = items.slice(from, from + this.pageSize);
    if (items.length <= 20) return { rows, footer: "" };
    const sizes = [20, 50, 100].map(n => `<option value="${n}" ${n === this.pageSize ? "selected" : ""}>${n}</option>`).join("");
    const footer = `<div class="tablefoot"><span>${this.formatNumber(from + 1)}–${this.formatNumber(from + rows.length)} ${this.t("of")} ${this.formatNumber(items.length)} · ${this.t("perPage")} <select data-pagesize aria-label="${this.t("perPage")}">${sizes}</select></span>${count > 1 ? `<span class="pager"><button data-lpage="${id}|${page - 1}" ${page === 1 ? "disabled" : ""}>${this.t("previous")}</button> ${this.t("page")} ${page} ${this.t("of")} ${count} <button data-lpage="${id}|${page + 1}" ${page === count ? "disabled" : ""}>${this.t("next")}</button></span>` : ""}</div>`;
    return { rows, footer };
  }
}
