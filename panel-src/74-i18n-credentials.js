// Texts for the page "Tokens & secrets"; merged into TEXT.
Object.assign(TEXT.de, {
  secrets: "Tokens & Secrets", secretsSubtitle: "Zugangsdaten, die Integrationen gespeichert haben: API-Keys, Tokens und Passwörter. Maskiert; den vollen Wert gibt es nur auf Klick.",
  secTitle: "Tokens & Secrets", secHint: "API-Keys, Tokens und Passwörter der Integrationen", secLoading: "Die Zugangsdaten werden gelesen …",
  secIntro: "Hier siehst du, welche Zugangsdaten deine Integrationen gespeichert haben. Die Werte sind maskiert; „Anzeigen“ holt den vollen Wert eines einzelnen Feldes. Öffne Werte nur, wenn niemand mitliest.",
  secSumFields: "Felder", secSumEntries: "Integrationen", secSumData: "in den Daten", secSumOptions: "in den Optionen",
  secColIntegration: "Integration", secColSource: "Quelle", secColField: "Feld", secColValue: "Wert", secSource_data: "Daten", secSource_options: "Optionen",
  secShow: "Anzeigen", secHide: "Verbergen", secShowTitle: "Den vollen Wert dieses Feldes anzeigen", secFailed: "Der Wert konnte nicht gelesen werden.",
  secNone: "Keine gespeicherten Zugangsdaten gefunden.", secAllDomains: "Alle Integrationen", secAllSources: "Alle Quellen",
  secFootnote: "Housekeeper sucht in den Daten und Optionen jedes Integrationseintrags nach Feldern, deren Name auf Zugangsdaten deutet (key, token, secret, password, pin, webhook …). Öffentliche Schlüssel, die Art eines Tokens und Ablaufzeiten zählen nicht. Die Liste enthält nur maskierte Werte. Den vollen Wert liefert Home Assistant nur einem Administrator und nur für ein Feld auf einmal; Housekeeper speichert und protokolliert ihn nicht, und er verschwindet, sobald du die Seite verlässt.",
});
Object.assign(TEXT.en, {
  secrets: "Tokens & secrets", secretsSubtitle: "Credentials that integrations have stored: API keys, tokens and passwords. Masked; the full value only on a click.",
  secTitle: "Tokens & secrets", secHint: "API keys, tokens and passwords of the integrations", secLoading: "Reading the credentials …",
  secIntro: "Here you see which credentials your integrations have stored. The values are masked; \"Show\" fetches the full value of one field. Only reveal values when nobody is looking over your shoulder.",
  secSumFields: "Fields", secSumEntries: "Integrations", secSumData: "in the data", secSumOptions: "in the options",
  secColIntegration: "Integration", secColSource: "Source", secColField: "Field", secColValue: "Value", secSource_data: "Data", secSource_options: "Options",
  secShow: "Show", secHide: "Hide", secShowTitle: "Show the full value of this field", secFailed: "The value could not be read.",
  secNone: "No stored credentials found.", secAllDomains: "All integrations", secAllSources: "All sources",
  secFootnote: "Housekeeper looks through the data and options of every integration entry for fields whose name suggests a credential (key, token, secret, password, pin, webhook …). Public keys, the type of a token and expiry times do not count. The list only holds masked values. Home Assistant hands the full value only to an administrator and only for one field at a time; Housekeeper neither stores nor logs it, and it is gone as soon as you leave the page.",
});
