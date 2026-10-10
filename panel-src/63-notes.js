// Entries you write yourself in the history of the changes ("Zigbee stick replaced"); mixed into the panel in 99-register.js.
// They are kept by Housekeeper only and count as an event for the correlation, always worded "at about the same time".
Object.assign(TEXT.de, {
  noteAdd: "Eigener Eintrag", noteMine: "Eigener Eintrag", noteEdit: "Bearbeiten", noteDelete: "Löschen",
  noteAskDelete: "Diesen Eintrag löschen?", noteYes: "Ja, löschen", noteNo: "Abbrechen",
  noteFormTitle: "Titel", noteTitlePh: "z. B. Zigbee-Stick getauscht", noteWhen: "Wann", noteTarget: "Betrifft (optional)", noteTargetPh: "Entität, Gerät, Integration, Bereich",
  noteText: "Notiz (optional)", noteTextPh: "Was genau hast du geändert?", noteSave: "Speichern", noteCancel: "Abbrechen",
  noteNeedTitle: "Gib dem Eintrag einen Titel.", noteBadTime: "Die Zeit ist ungültig oder liegt zu weit in der Zukunft.", noteFailed: "Der Eintrag konnte nicht gespeichert werden: {reason}",
  noteConcerns: "Betrifft: {name}", noteHint: "Nur für dich: Housekeeper ändert nichts in Home Assistant. Die Einträge erscheinen nicht im Prüfbericht.",
  noteDetailTitle: "Deine Einträge", noteDetailNone: "Noch kein Eintrag zu diesem Objekt.", noteAddHere: "Eintrag dazu",
  corr_note: "deinem Eintrag „{title}“",
});
Object.assign(TEXT.en, {
  noteAdd: "Own entry", noteMine: "Own entry", noteEdit: "Edit", noteDelete: "Delete",
  noteAskDelete: "Delete this entry?", noteYes: "Yes, delete", noteNo: "Cancel",
  noteFormTitle: "Title", noteTitlePh: "e.g. Zigbee stick replaced", noteWhen: "When", noteTarget: "Concerns (optional)", noteTargetPh: "Entity, device, integration, area",
  noteText: "Note (optional)", noteTextPh: "What exactly did you change?", noteSave: "Save", noteCancel: "Cancel",
  noteNeedTitle: "Give the entry a title.", noteBadTime: "The time is invalid or too far in the future.", noteFailed: "The entry could not be saved: {reason}",
  noteConcerns: "Concerns: {name}", noteHint: "Only for you: Housekeeper changes nothing in Home Assistant. The entries do not appear in the audit report.",
  noteDetailTitle: "Your entries", noteDetailNone: "No entry for this object yet.", noteAddHere: "Add an entry",
  corr_note: "your entry “{title}”",
});

class NotesMixin {
  notesList() { return this.data?.notes || []; }

  // `<input type="datetime-local">` speaks local time without a zone.
  noteLocal(iso) {
    const d = new Date(iso), p = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  noteOpen(note = null, target = "") {
    const obj = target ? this.findObject(target) : null;
    this.noteDraft = note
      ? { id: note.id, title: note.title, at: this.noteLocal(note.at), target: note.target, targetText: this.findObject(note.target)?.name || note.target || "", note: note.note, error: "" }
      : { id: null, title: "", at: this.noteLocal(new Date().toISOString()), target, targetText: obj?.name || "", note: "", error: "" };
    this.noteAsk = null;
  }

  noteTargetName(target) {
    return target ? this.findObject(target)?.name || target.split(":").slice(1).join(":") : "";
  }

  noteRow(n) {
    const name = this.noteTargetName(n.target), obj = n.target ? this.findObject(n.target) : null;
    const asking = this.noteAsk === n.id;
    const sub = [this.esc(this.formatDate(n.at)), name ? (obj ? `<button class="link" data-object="${this.esc(n.target)}">${this.esc(this.t("noteConcerns", { name }))}</button>` : this.esc(this.t("noteConcerns", { name }))) : "", n.note ? this.esc(n.note) : ""].filter(Boolean).join(" · ");
    const actions = asking
      ? `<span class="askrow"><span>${this.t("noteAskDelete")}</span><button class="btn danger" data-note-del-yes="${this.esc(n.id)}">${this.t("noteYes")}</button><button class="btn" data-note-del-no>${this.t("noteNo")}</button></span>`
      : `<span class="pill violet">${this.t("noteMine")}</span><button class="link" data-note-edit="${this.esc(n.id)}">${this.t("noteEdit")}</button><button class="link" data-note-del="${this.esc(n.id)}">${this.t("noteDelete")}</button>`;
    return `<div class="row rel"><span class="tile"><ha-icon icon="mdi:pin-outline"></ha-icon></span><span class="row-text"><strong>${this.esc(n.title)}</strong><small>${sub}</small></span><span style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:flex-end">${actions}</span></div>`;
  }

  noteForm() {
    const d = this.noteDraft;
    if (!d) return "";
    return `<form class="pad polform noteform" data-note-form>
      <div><label for="hk-note-title">${this.t("noteFormTitle")}</label><input id="hk-note-title" type="text" maxlength="80" data-note-title value="${this.esc(d.title)}" placeholder="${this.esc(this.t("noteTitlePh"))}" autocomplete="off"></div>
      <div class="notetwo"><div><label for="hk-note-at">${this.t("noteWhen")}</label><input id="hk-note-at" type="datetime-local" data-note-at value="${this.esc(d.at)}"></div>
      <div><label>${this.t("noteTarget")}</label>${this.pickerBox("note", this.t("noteTargetPh"))}</div></div>
      <div><label for="hk-note-text">${this.t("noteText")}</label><textarea id="hk-note-text" rows="2" maxlength="500" data-note-text placeholder="${this.esc(this.t("noteTextPh"))}">${this.esc(d.note)}</textarea></div>
      ${d.error ? `<div class="error" role="alert">${this.esc(d.error)}</div>` : ""}
      <div class="noteact"><small>${this.t("noteHint")}</small><span><button type="button" class="btn" data-note-cancel>${this.t("noteCancel")}</button><button type="submit" class="btn primary">${this.t("noteSave")}</button></span></div></form>`;
  }

  noteHeadButton() { return `<button class="btn" data-note-add><ha-icon icon="mdi:plus"></ha-icon>${this.t("noteAdd")}</button>`; }

  // On the details page of an object: what you wrote about it, and a way to add an entry.
  noteCard(item) {
    if (!["entity", "device", "config_entry", "area", "automation", "script"].includes(item.object_type)) return "";
    const key = this.objectKey(item), mine = this.notesList().filter(n => n.target === key);
    return `<section class="panel"><div class="panelhead"><h2>${this.t("noteDetailTitle")}</h2><button class="btn" data-note-add-for="${this.esc(key)}"><ha-icon icon="mdi:plus"></ha-icon>${this.t("noteAddHere")}</button></div>${mine.length ? mine.map(n => this.noteRow(n)).join("") : `<p class="factnote">${this.t("noteDetailNone")}</p>`}</section>`;
  }

  async noteSave() {
    const d = this.noteDraft;
    if (!d) return;
    const title = d.title.trim();
    if (!title) { d.error = this.t("noteNeedTitle"); this.render(); return; }
    const when = new Date(d.at);
    if (Number.isNaN(when.getTime())) { d.error = this.t("noteBadTime"); this.render(); return; }
    try {
      const res = await this._hass.callWS({ type: "ha_housekeeper/note_set", action: "save", ...(d.id ? { note_id: d.id } : {}), title, at: when.toISOString(), target: d.target || "", note: d.note.trim() });
      this.data = { ...this.data, notes: res.notes };
      this._corrRequested = false;
      this.noteDraft = null; this._rev++;
    } catch (err) { d.error = this.t("noteFailed", { reason: err?.message || String(err) }); }
    this.render();
  }

  async noteDeleteConfirmed(id) {
    this.noteAsk = null;
    try {
      const res = await this._hass.callWS({ type: "ha_housekeeper/note_set", action: "delete", note_id: id });
      this.data = { ...this.data, notes: res.notes };
      this._corrRequested = false; this._rev++;
    } catch (err) { this.error = err?.message || String(err); }
    this.render();
  }

  bindNotes(root) {
    root.querySelectorAll("[data-note-add]").forEach(el => el.onclick = () => { this.noteOpen(); this.render(); });
    root.querySelectorAll("[data-note-add-for]").forEach(el => el.onclick = () => {
      this.noteOpen(null, el.dataset.noteAddFor);
      this.view = "changes"; this.selected = null; this.trail = []; this.pages = {};
      this.render();
    });
    root.querySelectorAll("[data-note-edit]").forEach(el => el.onclick = () => { const n = this.notesList().find(x => x.id === el.dataset.noteEdit); if (n) { this.noteOpen(n); this.render(); } });
    root.querySelectorAll("[data-note-del]").forEach(el => el.onclick = () => { this.noteAsk = el.dataset.noteDel; this.render(); });
    root.querySelectorAll("[data-note-del-yes]").forEach(el => el.onclick = () => this.noteDeleteConfirmed(el.dataset.noteDelYes));
    root.querySelectorAll("[data-note-del-no]").forEach(el => el.onclick = () => { this.noteAsk = null; this.render(); });
    root.querySelector("[data-note-cancel]")?.addEventListener("click", () => { this.noteDraft = null; this.render(); });
    root.querySelector("[data-note-title]")?.addEventListener("input", ev => { this.noteDraft.title = ev.target.value; this.noteDraft.error = ""; });
    root.querySelector("[data-note-at]")?.addEventListener("input", ev => { this.noteDraft.at = ev.target.value; });
    root.querySelector("[data-note-text]")?.addEventListener("input", ev => { this.noteDraft.note = ev.target.value; });
    root.querySelector("[data-note-form]")?.addEventListener("submit", ev => { ev.preventDefault(); this.noteSave(); });
  }
}
