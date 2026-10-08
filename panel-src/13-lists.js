// ListsMixin: methods of the panel element, mixed into the class in 99-register.js.
class ListsMixin {
  th(key, label) {
    const on = this.sort === key;
    return `<th data-sort="${key}" aria-sort="${on ? (this.sortDir === "desc" ? "descending" : "ascending") : "none"}"><button type="button" class="thbtn" data-sortbtn="${key}">${this.t(label)}${on ? ` <span aria-hidden="true">${this.sortDir === "desc" ? "▼" : "▲"}</span>` : ""}</button></th>`;
  }

  // Shared list controls: per-list search, filters and sort kept in this.lv[id].
  lvState(id, sort, dir) { return (this.lv[id] ||= { q: "", sort, dir, f: {} }); }

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

  listBar(id, { sorts, filters = [] }) {
    const st = this.lv[id];
    (this.lvDirs ||= {})[id] = Object.fromEntries(sorts.map(x => [x.key, x.dir]));
    const selects = filters.map(f => `<select data-lf="${id}|${f.name}" aria-label="${this.esc(f.all)}"><option value="">${this.esc(f.all)}</option>${f.options.map(([v, label]) => `<option value="${this.esc(v)}" ${st.f[f.name] === v ? "selected" : ""}>${this.esc(label)}</option>`).join("")}</select>`).join("");
    const sortOptions = sorts.map(x => `<option value="${x.key}" ${st.sort === x.key ? "selected" : ""}>${this.t(x.label)}</option>`).join("");
    const desc = st.dir === "desc";
    return `<div class="listbar"><input type="search" data-lq="${id}" value="${this.esc(st.q)}" placeholder="${this.t("searchList")}">${selects}${sorts.length ? `<span class="sortgroup"><select data-ls="${id}" aria-label="${this.t("sortBy")}">${sortOptions}</select><button class="dirbtn" data-ld="${id}" title="${this.t(desc ? "sortDescending" : "sortAscending")}" aria-label="${this.t(desc ? "sortDescending" : "sortAscending")}"><ha-icon icon="${desc ? "mdi:sort-descending" : "mdi:sort-ascending"}"></ha-icon></button></span>` : ""}</div>`;
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
