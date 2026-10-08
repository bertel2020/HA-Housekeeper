// Texts for the reliability view; merged into TEXT.
Object.assign(TEXT.de, {
  reliability: "Zuverlässigkeit", reliabilitySubtitle: "Wie verfügbar die Entities jeder Integration waren und wann sie gemeinsam ausfielen. Liest nur den Recorder.",
  relTitle: "Integrationen nach Verfügbarkeit", relHint: "Schlechteste zuerst. Gerechnet aus den Zuständen im Recorder",
  relWindow1: "24 Stunden", relWindow7: "7 Tage", relRefresh: "Neu berechnen", relLoading: "Der Recorder wird ausgewertet. Das kann bei einer großen Datenbank einige Sekunden dauern …",
  relTook: "berechnet in {s} s", relCached: "aus dem Zwischenspeicher ({s} s)", relNoRecorder: "Der Recorder von Home Assistant ist nicht verfügbar.",
  relBusy: "Eine andere Berechnung läuft noch. Bitte gleich mit „Neu berechnen“ erneut abrufen.", relEmpty: "Im Zeitraum gibt es keine Zustände von Integrationen.",
  relEntities: "{n} Entities", relPermanent: "{n} dauerhaft ausgefallen, nicht eingerechnet",
  relShared: "{n} gemeinsame Ausfälle, längster {longest}", relSharedOne: "1 gemeinsamer Ausfall, {longest}", relLayerCloud: "wahrscheinlich Cloud oder API (Vermutung)", relLayerLocal: "wahrscheinlich Gerät, Netz oder Integration (Vermutung)",
  relReauth: "Neu anmelden offen", relLastShared: "Letzter gemeinsamer Ausfall bis {date} ({duration})", relLastSingle: "Letzte Störung bis {date} ({duration})", relNoDisruption: "Keine Störung",
  relMinutes: "{n} Min.", relHours: "{n} Std.", relDays: "{n} Tage",
  relFootnote: "Verfügbarkeit: Anteil der Zeit ohne „nicht verfügbar“ in den letzten {days} Tagen, gerechnet ab der ersten Meldung im Zeitraum. Ein gemeinsamer Ausfall heißt: mindestens 80 % der Entities des Eintrags, mindestens drei, mindestens 5 Minuten zugleich nicht verfügbar. Ein Ausfall, der vor dem Zeitraum begann, zählt erst ab der ersten Meldung darin.",
});
Object.assign(TEXT.en, {
  reliability: "Reliability", reliabilitySubtitle: "How available each integration's entities were and when they failed together. Only reads the recorder.",
  relTitle: "Integrations by availability", relHint: "Worst first. Calculated from the states in the recorder",
  relWindow1: "24 hours", relWindow7: "7 days", relRefresh: "Recalculate", relLoading: "Evaluating the recorder. On a large database this can take a few seconds …",
  relTook: "calculated in {s} s", relCached: "from the cache ({s} s)", relNoRecorder: "The Home Assistant recorder is not available.",
  relBusy: "Another calculation is still running. Fetch it again in a moment with “Recalculate”.", relEmpty: "There are no integration states in this period.",
  relEntities: "{n} entities", relPermanent: "{n} down all the time, not counted",
  relShared: "{n} shared outages, longest {longest}", relSharedOne: "1 shared outage, {longest}", relLayerCloud: "probably the cloud or its API (a guess)", relLayerLocal: "probably the device, the network or the integration (a guess)",
  relReauth: "Re-authentication open", relLastShared: "Last shared outage until {date} ({duration})", relLastSingle: "Last disruption until {date} ({duration})", relNoDisruption: "No disruption",
  relMinutes: "{n} min", relHours: "{n} h", relDays: "{n} days",
  relFootnote: "Availability: the share of time without “unavailable” in the last {days} days, counted from the first report in the period. A shared outage means at least 80 % of the entry's entities, at least three, were unavailable together for at least 5 minutes. An outage that began before the period counts from the first report in it.",
});
