// The finding "a template helper reads an attribute its entity has never shown" (config_entry.missing_attribute).
Object.assign(TEXT.de, {
  missing_attribute: "Attribut",
  findingMissingAttr: "Liest das Attribut „{attr}“ von {target}, das die Entität nie gezeigt hat",
  findingWaitingTitle: "Der Hinweis steht in der Liste, zählt aber erst ab {date}: so lange wird die Entität beobachtet.",
  fixAttrSeen: "Gesehen",
  fixAttrSeenNote: "Die Entität {entity} zeigt bisher diese Attribute (rot: das gesuchte, das nie dabei war). Beobachtet seit {since}.",
  fixAttrWaiting: "Der Hinweis zählt erst ab {date}.",
});
Object.assign(TEXT.en, {
  missing_attribute: "Attribute",
  findingMissingAttr: "Reads the attribute “{attr}” of {target}, which the entity has never shown",
  findingWaitingTitle: "The hint is in the list but counts only from {date}: the entity is watched until then.",
  fixAttrSeen: "Seen",
  fixAttrSeenNote: "The entity {entity} has shown these attributes so far (red: the one that is read and never came). Watched since {since}.",
  fixAttrWaiting: "The hint counts only from {date}.",
});
