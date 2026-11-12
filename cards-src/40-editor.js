// The card editor: one form for the options every card has plus the options of the card itself.
// The form is Home Assistant's own (ha-form), so the editor looks like the rest of the dashboard editor.
function commonSchema(t) {
  const choice = (name, values) => ({ name, selector: { select: { mode: "dropdown", options: values.map(value => ({ value, label: t(`edit_${name}_${value}`) })) } } });
  return [
    { name: "title", selector: { text: {} } },
    choice("quiet", ["summary", "hide"]),
    choice("tap", ["panel", "none"]),
    { name: "compact", selector: { boolean: {} } },
  ];
}

function makeEditor(CardClass) {
  return class extends HTMLElement {
    constructor() {
      super();
      this._config = null;
      this._hass = null;
      this._form = null;
      this.refresh = () => this.render();
    }

    connectedCallback() { CardTexts.listeners.add(this.refresh); }
    disconnectedCallback() { CardTexts.listeners.delete(this.refresh); }

    setConfig(config) { this._config = { ...HK_DEFAULTS, ...config }; this.render(); }
    set hass(hass) { this._hass = hass; CardTexts.ensure(CardTexts.language(hass)); this.render(); }

    // The options of the card itself come after the common ones; a card names them in static editorSchema(t).
    schema() {
      const t = key => CardTexts.t(CardTexts.language(this._hass), key);
      return [...commonSchema(t), ...(CardClass.editorSchema ? CardClass.editorSchema(t) : [])];
    }

    render() {
      if (!this._config || !this._hass) return;
      const lang = CardTexts.language(this._hass);
      if (!this._form) {
        this._form = globalThis.document.createElement("ha-form");
        this._form.addEventListener("value-changed", event => {
          event.stopPropagation();
          this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: event.detail.value }, bubbles: true, composed: true }));
        });
        this.appendChild(this._form);
      }
      this._form.hass = this._hass;
      this._form.data = this._config;
      this._form.schema = this.schema();
      this._form.computeLabel = field => CardTexts.t(lang, `edit_${field.name}`);
      this._form.computeHelper = field => (CardTexts.has(lang, `edit_${field.name}_help`) ? CardTexts.t(lang, `edit_${field.name}_help`) : "");
    }
  };
}
