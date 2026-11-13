// Every card is registered here: its element, its editor and its entry in the card picker.
// The picker shows English only, it has no way to translate a name.
function registerCard(CardClass) {
  const tag = CardClass.tag;
  if (!customElements.get(tag)) customElements.define(tag, CardClass);
  if (!customElements.get(CardClass.editorTag)) customElements.define(CardClass.editorTag, makeEditor(CardClass));
  const list = (globalThis.customCards ||= []);
  if (!list.some(card => card.type === tag)) {
    list.push({ type: tag, name: CardClass.pickerName, description: CardClass.pickerDescription, preview: true, documentationURL: "https://github.com/bertel2020/HA-Housekeeper" });
  }
}

registerCard(HKHealthCard);
registerCard(HKBatteryCard);
registerCard(HKFunctionsCard);
registerCard(HKAutoPauseCard);
registerCard(HKUpdateCard);
registerCard(HKStartCard);
registerCard(HKOverviewCard);
