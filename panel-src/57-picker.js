// PickerMixin: a text field for an entity id that shows matching entities while typing, like the search in the top bar.
// A field is described by its name: where its value lives and which entities it may offer.
class PickerMixin {
  pickerDef(name) {
    return {
      counter: { get: () => this.counterId || "", set: v => { this.counterId = v; }, filter: o => o.has_statistics && o.object_id.startsWith("sensor.") },
    }[name];
  }

  pickerResults(name) {
    const def = this.pickerDef(name), q = def ? String(def.get()).trim().toLowerCase() : "";
    if (!q || !this.data) return [];
    const terms = q.split(/\s+/), found = [];
    for (const o of this.data.objects) {
      if (o.object_type !== "entity" || !def.filter(o)) continue;
      const id = o.object_id.toLowerCase(), label = String(o.name || "").toLowerCase();
      if (!terms.every(term => id.includes(term) || label.includes(term))) continue;
      found.push({ o, rank: id.startsWith(q) || label.startsWith(q) ? 0 : 1 });
    }
    found.sort((a, b) => a.rank - b.rank || a.o.object_id.localeCompare(b.o.object_id));
    return found.slice(0, QUICK_LIMIT).map(entry => entry.o);
  }

  // The input plus, while it is open, the list of matches. `attrs` carries the field's own data attribute.
  pickerBox(name, placeholder, attrs = "") {
    const def = this.pickerDef(name), value = def.get(), open = this._picker?.name === name && this._picker.open && String(value).trim();
    const results = open ? this.pickerResults(name) : [];
    const active = Math.min(this._picker?.index || 0, Math.max(results.length - 1, 0));
    const list = open ? `<ul class="quicklist" id="picker-${name}" role="listbox" aria-label="${this.esc(this.t("quickLabel"))}">${results.length
      ? results.map((o, i) => `<li role="option" id="picker-${name}-${i}" aria-selected="${i === active}" data-picker-item="${this.esc(o.object_id)}" data-picker-name="${name}" class="${i === active ? "on" : ""}">${this.tile("entity")}<span class="row-text"><strong>${this.esc(o.name)}</strong><small>${this.esc(o.object_id)}</small></span></li>`).join("")
      : `<li class="none">${this.t("quickNone")}</li>`}</ul>` : "";
    return `<div class="picker"><input type="text" data-picker="${name}" ${attrs} value="${this.esc(value)}" placeholder="${this.esc(placeholder)}" autocomplete="off" role="combobox" aria-expanded="${Boolean(open)}" aria-controls="picker-${name}" aria-autocomplete="list" ${open && results.length ? `aria-activedescendant="picker-${name}-${active}"` : ""}>${list}</div>`;
  }

  pickerPick(name, id) {
    this.pickerDef(name).set(id);
    this._picker = { name, open: false, index: 0 };
    this.render();
  }

  bindPicker(root) {
    root.querySelectorAll("[data-picker]").forEach(input => {
      const name = input.dataset.picker;
      input.oninput = () => { this.pickerDef(name).set(input.value.trim()); this._picker = { name, open: true, index: 0 }; this.scheduleRender(); };
      input.onkeydown = ev => {
        const results = this._picker?.open ? this.pickerResults(name) : [];
        if ((ev.key === "ArrowDown" || ev.key === "ArrowUp") && results.length) {
          ev.preventDefault();
          this._picker.index = (this._picker.index + (ev.key === "ArrowDown" ? 1 : results.length - 1)) % results.length;
          this.render();
        } else if (ev.key === "Enter" && results.length) {
          ev.preventDefault();
          this.pickerPick(name, results[Math.min(this._picker.index, results.length - 1)].object_id);
        } else if (ev.key === "Escape" && this._picker?.open) {
          ev.stopPropagation();
          this._picker.open = false; this.render();
        }
      };
    });
    root.querySelectorAll("[data-picker-item]").forEach(el => { el.onclick = () => this.pickerPick(el.dataset.pickerName, el.dataset.pickerItem); });
    if (!this._pickerBound && root.addEventListener) {
      this._pickerBound = true;
      root.addEventListener("click", ev => {
        if (!this._picker?.open || (ev.composedPath?.() || []).some(node => node.classList?.contains?.("picker"))) return;
        this._picker.open = false; this.render();
      });
    }
  }
}
