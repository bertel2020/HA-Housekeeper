// Slovak search aliases live outside the upstream page-search implementation.
const SK_SEARCH_WORDS = {
  overview: "prehľad stav domácnosť úvod",
  findingsNav: "nálezy problémy chyby upozornenia osirotené",
  cleanup: "upratovanie čistenie vymazať odstrániť karanténa",
  repair: "oprava opraviť merač nahradiť vymeniť",
  journal: "denník plány vrátiť história",
  maintenance: "údržba zálohy obnovenie aktualizácie ciele",
  batteries: "batérie batéria akumulátor vybíjanie",
  reminders: "pripomienky termíny filter údržba",
  policies: "pravidlá porušenia",
  reliability: "spoľahlivosť výpadky nedostupnosť",
  runs: "spustenia automatizácie behy",
  recorder: "databáza štatistiky zaťaženie záznamy",
  storage: "úložisko disk pamäť systém",
  exposure: "sprístupnenie hlasový asistent",
  dataflow: "prístupy údaje tok riziko oprávnenia",
  secrets: "heslá prihlasovanie tokeny kľúče",
  inventory: "inventár entity zariadenia objekty",
  components: "aplikácie integrácie doplnky",
  graph: "závislosti vzťahy graf",
  changes: "zmeny porovnanie kontrol denník",
  settings: "nastavenia konfigurácia možnosti",
  look: "vzhľad tmavý svetlý písmo farby",
  protection: "ochrana bezpečnosť",
  scan: "kontrola interval limity",
  notify: "upozornenie oznámenie",
  goals: "ciele údržba",
  hidden: "skryté ignorované",
  info: "informácie verzia diagnostika",
  compare: "porovnať históriu kontrol",
  logbook: "denník poznámky"
};
for (const [key, words] of Object.entries(SK_SEARCH_WORDS)) if (Object.hasOwn(SEARCH_WORDS, key)) SEARCH_WORDS[key] += " " + words;

Object.assign(SEARCH_WORDS, {
  removedDevices: (SEARCH_WORDS.removedDevices || "") + " odstránené zariadenia zabudnuté zariadenia",
  exceptions: (SEARCH_WORDS.exceptions || "") + " výnimky ignorované pravidlá",
  mcp: (SEARCH_WORDS.mcp || "") + " umelá inteligencia AI prístup agenti MCP",
});
Object.assign(SEARCH_STATE_WORDS, {
  "": SEARCH_STATE_WORDS[""] + " otvorené",
  new: SEARCH_STATE_WORDS.new + " nové",
  inwork: SEARCH_STATE_WORDS.inwork + " rozpracované",
  known: SEARCH_STATE_WORDS.known + " známe ponechané",
  snoozed: SEARCH_STATE_WORDS.snoozed + " odložené",
  hidden: SEARCH_STATE_WORDS.hidden + " skryté",
  fixed: SEARCH_STATE_WORDS.fixed + " vyriešené opravené",
});
