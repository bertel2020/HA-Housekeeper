// Templates with placeholders, so the word order can differ by language: the pager, the last scan, the way back.
Object.assign(TEXT.de, {
  pagerRange: "{from}–{to} von {total}", pagerPage: "Seite {page} von {pages}", lastScanAgo: "Letzter Scan: {ago}", backToName: "Zurück zu {name}",
});
Object.assign(TEXT.en, {
  pagerRange: "{from}–{to} of {total}", pagerPage: "Page {page} of {pages}", lastScanAgo: "Last scan: {ago}", backToName: "Back to {name}",
});
