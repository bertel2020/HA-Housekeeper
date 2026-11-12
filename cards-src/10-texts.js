// Texts of the Lovelace cards. German and English live here; every other language is a file,
// frontend/i18n/cards/<code>.json, that a card fetches once (see 20-texts.js). A text that is missing shows in English.
// Keys: card* are shown on a card, edit_* label the card editor (edit_<field>, edit_<field>_<option>, edit_<field>_help).
const CARD_TEXT = {
  de: {
    cardNotFound: "HA Housekeeper wurde nicht gefunden. Ist die Integration eingerichtet?",
    cardNoData: "Noch keine Daten: der erste Scan steht noch aus.",
    cardQuietHidden: "Im Ruhezustand ist diese Karte ausgeblendet. Im Editor siehst du sie trotzdem.",
    cardOpenPanel: "Im Panel öffnen →",
    edit_title: "Titel",
    edit_quiet: "Im Ruhezustand", edit_quiet_summary: "Zusammenfassung zeigen", edit_quiet_hide: "Karte ausblenden",
    edit_quiet_help: "Ruhezustand heißt: nichts zu tun. Ausgeblendet verschwindet die Karte vom Dashboard, bis wieder etwas anliegt.",
    edit_tap: "Tipp öffnet", edit_tap_panel: "Panel von Housekeeper", edit_tap_none: "Nichts",
    edit_tap_help: "Ins Panel kommen nur Administratoren.",
    edit_compact: "Kompakt",
  },
  en: {
    cardNotFound: "HA Housekeeper was not found. Is the integration set up?",
    cardNoData: "No data yet: the first scan is still to come.",
    cardQuietHidden: "This card is hidden while everything is quiet. You still see it here in the editor.",
    cardOpenPanel: "Open in the panel →",
    edit_title: "Title",
    edit_quiet: "When quiet", edit_quiet_summary: "Show the summary", edit_quiet_hide: "Hide the card",
    edit_quiet_help: "Quiet means there is nothing to do. Hidden removes the card from the dashboard until something is due again.",
    edit_tap: "A tap opens", edit_tap_panel: "The Housekeeper panel", edit_tap_none: "Nothing",
    edit_tap_help: "Only administrators can open the panel.",
    edit_compact: "Compact",
  },
};
