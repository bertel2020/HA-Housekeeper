// Texts for the policies view; merged into TEXT.
Object.assign(TEXT.de, {
  policies: "Richtlinien", policiesSubtitle: "Eigene Regeln für Ordnung in Home Assistant. Hinweise, keine Defekte; liest nur.",
  polTitle: "Qualitätsrichtlinien", polHint: "Schalte ein, was in deiner Installation gelten soll. Alle Regeln sind zunächst aus.", polLoading: "Richtlinien werden geprüft",
  polOff: "aus", polCount: "{n} Verstöße", polCountOne: "1 Verstoß", polNone: "Keine Verstöße", polNoneOn: "Schalte oben eine Regel ein, um Verstöße zu sehen.",
  polRule_entity_area: "Entity ohne Bereich", polDesc_entity_area: "Entities von physischen Geräten brauchen einen Bereich, eigenen oder den des Geräts. Diagnose-, Konfigurations- und deaktivierte Entities und Dienst-Geräte zählen nicht.",
  polRule_device_area: "Gerät ohne Bereich", polDesc_device_area: "Aktive Geräte brauchen einen Bereich. Dienst-Geräte, Untergeräte, deaktivierte und leere Geräte zählen nicht.",
  polRule_automation_description: "Automation ohne Beschreibung", polDesc_automation_description: "Automationen aus der Konfiguration brauchen eine Beschreibung.",
  polRule_battery_device: "Batterie-Entity ohne Gerät", polDesc_battery_device: "Entities mit der Geräteklasse Batterie sollen zu einem Gerät gehören.",
  polHide: "Ausblenden", polShow: "Einblenden", polHiddenLabel: "ausgeblendet", polByLabel: "per Label ausgeblendet",
  polHiddenN: "{n} ausgeblendet", polShowHidden: "Ausgeblendete zeigen", polHideHidden: "Ausgeblendete verbergen", polMore: "und {n} weitere",
  polFootnote: "Richtlinien sind Hinweise zur Ordnung und keine Defekte: Sie zählen nicht in Gesundheit, Befunde, Reparaturhinweise oder Sensoren. Housekeeper vergleicht nur die vorhandenen Daten des letzten Scans. Mit dem Label housekeeper_ignore an einer Entity, einem Gerät oder einer Automation oder über Ausblenden nimmst du ein Objekt aus. Die Schalter liegen nur in Housekeeper.",
});
Object.assign(TEXT.en, {
  policies: "Policies", policiesSubtitle: "Your own rules for tidiness in Home Assistant. Hints, not defects; only reads.",
  polTitle: "Quality policies", polHint: "Switch on what should apply to your installation. All rules start off.", polLoading: "Checking policies",
  polOff: "off", polCount: "{n} violations", polCountOne: "1 violation", polNone: "No violations", polNoneOn: "Switch on a rule above to see violations.",
  polRule_entity_area: "Entity without an area", polDesc_entity_area: "Entities of physical devices need an area, their own or the device's. Diagnostic, configuration and disabled entities and service devices do not count.",
  polRule_device_area: "Device without an area", polDesc_device_area: "Active devices need an area. Service devices, sub-devices, disabled and empty devices do not count.",
  polRule_automation_description: "Automation without a description", polDesc_automation_description: "Automations from the configuration need a description.",
  polRule_battery_device: "Battery entity without a device", polDesc_battery_device: "Entities with the battery device class should belong to a device.",
  polHide: "Hide", polShow: "Show", polHiddenLabel: "hidden", polByLabel: "hidden by label",
  polHiddenN: "{n} hidden", polShowHidden: "Show hidden", polHideHidden: "Hide hidden", polMore: "and {n} more",
  polFootnote: "Policies are hints about tidiness and not defects: they do not count in health, findings, repair hints or sensors. Housekeeper only compares the data of the last scan. The label housekeeper_ignore on an entity, device or automation, or Hide, takes an object out. The switches live only in Housekeeper.",
});
