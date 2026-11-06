// Texts of the opened row of an orphaned statistic: period, cause, origin and what the database holds.
Object.assign(TEXT.de, {
  statPeriod: "Zeitraum und Umfang", statRowsHourly: "{n} Stundenwerte", statSpanDays: "{n} Tage Verlauf", statSpanMonths: "{n} Monate Verlauf", statLongData: "Langzeitdaten, vor dem Löschen prüfen",
  statWhy: "Warum verwaist", statWhyEntity: "Die Entität wurde aus der Registry entfernt. Integration: {platform}.", statWhyIntegration: "Die Integration {platform} wurde entfernt, ihre Entitäten damit auch.", statWhenRemoved: "Entfernt {when}.",
  statWhyUnknown: "Weder Entität noch Registry-Eintrag sind zu finden. Die Registry merkt sich entfernte Entitäten nur etwa 30 Tage, der Grund lässt sich daher nicht mehr ermitteln.",
  statOrigin: "Herkunft und Art", statSource: "Quelle", statUnitClass: "Einheitenklasse", statSumHint: "Mit Summenwerten: ein Zähler. Soll sein Verlauf erhalten bleiben, übernimm ihn über Reparieren → Zähler wechseln, statt ihn zu löschen.",
  statEnergy: "Energie-Dashboard", statEnergyNo: "Nicht im Energie-Dashboard",
  statDb: "Was in der Datenbank dazu liegt", statDbStatistics: "Stundenwerte (Langzeit), bleiben unbegrenzt", statDbShort: "5-Minuten-Werte, nach etwa 10 Tagen zu Stunden verdichtet", statDbStates: "Rohwerte (Verlauf und Logbuch), je nach Aufbewahrungszeit des Recorders",
  statDbNote: "Beim Löschen verschwinden alle drei. Der Plan legt vorher eine Sicherung an.", statDetailLoading: "Wird gelesen …", statDetailBusy: "Der Recorder ist gerade beschäftigt. Öffne die Details später noch einmal.", statDetailFailed: "Die Details konnten nicht gelesen werden.",
});
Object.assign(TEXT.en, {
  statPeriod: "Period and volume", statRowsHourly: "{n} hourly values", statSpanDays: "{n} days of history", statSpanMonths: "{n} months of history", statLongData: "Long-term data, check before deleting",
  statWhy: "Why orphaned", statWhyEntity: "The entity was removed from the registry. Integration: {platform}.", statWhyIntegration: "The {platform} integration was removed, and its entities with it.", statWhenRemoved: "Removed {when}.",
  statWhyUnknown: "Neither an entity nor a registry entry can be found. The registry only remembers removed entities for about 30 days, so the cause can no longer be told.",
  statOrigin: "Origin and kind", statSource: "Source", statUnitClass: "Unit class", statSumHint: "With sums: a counter. To keep its history, carry it over with Repair → Switch counter instead of deleting it.",
  statEnergy: "Energy dashboard", statEnergyNo: "Not in the Energy dashboard",
  statDb: "What the database holds for it", statDbStatistics: "Hourly values (long-term), kept indefinitely", statDbShort: "5-minute values, condensed to hours after about 10 days", statDbStates: "Raw values (history and logbook), depending on the recorder's retention",
  statDbNote: "Deleting removes all three. The plan makes a backup first.", statDetailLoading: "Reading …", statDetailBusy: "The recorder is busy. Open the details again later.", statDetailFailed: "The details could not be read.",
});
