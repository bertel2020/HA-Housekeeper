const ICONS = {
  entity: "mdi:shape-outline", device: "mdi:devices", config_entry: "mdi:puzzle-outline",
  area: "mdi:floor-plan", automation: "mdi:robot-outline", floor: "mdi:layers-outline",
  label: "mdi:label-outline", script: "mdi:script-text-outline", scene: "mdi:palette-outline", dashboard: "mdi:view-dashboard-outline",
};

const REMOVAL_KINDS = ["remove_entity", "remove_device", "forget_device"];
// Kinds that get a Home Assistant backup first (as in the backend).
const BACKUP_KINDS = ["remove_entity", "remove_device", "forget_device", "replace_references", "migrate_meter"];
const BACKUP_FAILURES = ["backup_failed", "backup_unavailable", "no_backup_agent"];
const DEVICE_KINDS = ["disable_device", "remove_device", "forget_device"];

const PREFS_KEY = "ha_housekeeper.prefs";
const DEFAULT_PREFS = { size: "normal", mode: "auto", scheme: "standard", density: "normal", motion: "auto", pageSize: 20, startView: "overview", graphMode: "list" };
const USER_DATA_KEY = "ha_housekeeper";
const OPTION_LIMITS = { min_unavailable_days: [0, 365], unused_automation_days: [0, 3650], scan_interval_hours: [0, 720], low_battery_percent: [1, 100], history_days: [1, 365] };
// Text scale only; spacing and icons stay put. Normal is a bit larger than the original 1.0.
const SIZES = { small: 1, normal: 1.1, large: 1.25 };
// The dependency graph shows this many nodes per side at first; "more" adds another step.
const GRAPH_NODE_STEP = 40;
// Scan thresholds as cards: option key, title, explanation, unit and default (the defaults of const.py).
const OPTION_FIELDS = [
  ["min_unavailable_days", "optMinUnavailableTitle", "optMinUnavailableHint", "unitDays", 7],
  ["unused_automation_days", "optUnusedAutomationTitle", "optUnusedAutomationHint", "unitDays", 90],
  ["scan_interval_hours", "optScanIntervalTitle", "optScanIntervalHint", "unitHours", 24],
  ["low_battery_percent", "optLowBatteryTitle", "optLowBatteryHint", "unitPercent", 20],
  ["history_days", "optHistoryDaysTitle", "optHistoryDaysHint", "unitDays", 30],
];
const START_VIEWS = ["overview", "findingsNav", "inventory", "changes", "batteries"];
const REPO_URL = "https://github.com/bertel2020/HA-Housekeeping";
// Palettes for explicit light/dark; taken from the Zeitarchiv app's design system (app.css).
// "standard" keeps the Home Assistant accent and, in automatic mode, the Home Assistant theme itself.
const SCHEMES = {
  standard: {
    light: { accent: "var(--primary-color,#0789cf)", bg: "#f3f3f3", surface: "#ffffff", soft: "#ececec", text: "#202020", muted: "#5e5e5e", border: "#e6e6e6", positive: "#2e7d32", warning: "#b77a00", danger: "#b30532" },
    dark: { accent: "var(--primary-color,#37c8fd)", on: "#141414", bg: "#141414", surface: "#202020", soft: "#363636", text: "#f3f3f3", muted: "#cccccc", border: "#4a4a4a", positive: "#66bb6a", warning: "#ffd166", danger: "#fd8f90" },
  },
  housekeeper: {
    light: { accent: "#0c6b5d", bg: "#f5f6f1", surface: "#ffffff", soft: "#eef1e9", text: "#131c17", muted: "#4b584e", border: "#e1e6db", positive: "#2e7d46", warning: "#8a6d1e", danger: "#a23b36" },
    dark: { accent: "#4fc3ae", on: "#0e1512", bg: "#0e1512", surface: "#171f1b", soft: "#1e2822", text: "#e8ece4", muted: "#9fac9b", border: "#2a362f", positive: "#6fcb88", warning: "#d4b65e", danger: "#e28a85" },
  },
  modern: {
    light: { accent: "#3157c8", bg: "#f6f7fb", surface: "#ffffff", soft: "#eef1f6", text: "#172033", muted: "#566176", border: "#d9dee8", positive: "#1f8a54", warning: "#a96700", danger: "#c83737" },
    dark: { accent: "#7ea1ff", on: "#0f1218", bg: "#0f1218", surface: "#171c25", soft: "#222936", text: "#f3f6fb", muted: "#b3bdcc", border: "#303949", positive: "#5fcb89", warning: "#e6a15a", danger: "#f07a7a" },
  },
};
// Earlier builds saved other scheme names.
const SCHEME_ALIASES = { teal: "housekeeper", amber: "housekeeper", sage: "housekeeper", zeitarchiv: "housekeeper", indigo: "modern" };

const USAGE_RELATIONS = ["TRIGGERS_ON", "USES_AS_CONDITION", "TARGETS", "REFERENCES", "SHOWS", "INCLUDES"];

// Pause after the last key stroke in a search field before the list is rebuilt.
const SEARCH_DEBOUNCE_MS = 150;

const NAV = [
  ["overview", "mdi:view-dashboard-outline"],
  ["findingsNav", "mdi:alert-outline"],
  ["changes", "mdi:compare-horizontal"],
  ["inventory", "mdi:database-outline"],
  ["graph", "mdi:source-fork"],
  ["cleanup", "mdi:broom"],
  ["maintenance", "mdi:wrench-clock"],
  ["exposure", "mdi:shield-search"],
  ["policies", "mdi:clipboard-check-outline"],
  ["reliability", "mdi:chart-timeline-variant"],
  ["runs", "mdi:robot-outline"],
  ["recorder", "mdi:database-clock-outline"],
  ["batteries", "mdi:battery-alert-variant-outline"],
  ["unreferenced", "mdi:link-variant-off"],
  ["settings", "mdi:cog-outline"],
];

// The sidebar groups every view but "settings", which stands alone at the foot.
const NAV_GROUPS = [
  ["navGroupOverview", ["overview", "findingsNav", "changes"]],
  ["navGroupOperation", ["reliability", "runs", "recorder"]],
  ["navGroupExplore", ["inventory", "graph"]],
  ["navGroupMaintain", ["cleanup", "unreferenced", "batteries", "policies", "exposure", "maintenance"]],
];
const BUSY_RETRIES = 12, BUSY_WAIT_MS = 8000; // another recorder query holds the lock: ask again by itself
const NAV_ICONS = Object.fromEntries(NAV);

// IBM Plex, shipped with the integration. A shadow root cannot declare fonts, so the rules go into the document once.
const FONT_BASE = "/ha_housekeeper/fonts/";
const FONT_CSS = `@font-face{font-family:"IBM Plex Sans";font-weight:400 700;font-display:swap;src:url(${FONT_BASE}ibm-plex-sans-latin.woff2) format("woff2");unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD}@font-face{font-family:"IBM Plex Sans";font-weight:400 700;font-display:swap;src:url(${FONT_BASE}ibm-plex-sans-latin-ext.woff2) format("woff2");unicode-range:U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF}@font-face{font-family:"IBM Plex Mono";font-weight:400;font-display:swap;src:url(${FONT_BASE}ibm-plex-mono-400-latin.woff2) format("woff2");unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD}@font-face{font-family:"IBM Plex Mono";font-weight:500;font-display:swap;src:url(${FONT_BASE}ibm-plex-mono-500-latin.woff2) format("woff2");unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD}`;

const STATUS_TONE = {
  active: "ok", orphaned: "warn", unavailable: "red", problem: "red", broken_reference: "red",
  disabled: "mute", empty: "mute", unknown: "violet", ignored: "mute", possible_duplicate: "violet", unused: "mute",
};

// Finding classes that call for action when they are new.
const CRITICAL_CLASSES = ["broken_reference", "unavailable", "problem"];

// Object types the housekeeping status is calculated from.
const HEALTH_TYPES = ["entity", "automation", "script", "scene"];
