"""Constants for HA Housekeeper."""

from typing import Final

DOMAIN: Final = "ha_housekeeper"
NAME: Final = "HA Housekeeper"

PANEL_URL: Final = "ha-housekeeper"
PANEL_ELEMENT: Final = "ha-housekeeper-panel"
FRONTEND_URL: Final = "/ha_housekeeper/ha-housekeeper-panel.js"
LOGO_URL: Final = "/ha_housekeeper/logo.png"

STORAGE_KEY: Final = f"{DOMAIN}.observations"
IGNORED_STORAGE_KEY: Final = f"{DOMAIN}.ignored"
HISTORY_STORAGE_KEY: Final = f"{DOMAIN}.history"
STORAGE_VERSION: Final = 1

CONF_MIN_UNAVAILABLE_DAYS: Final = "min_unavailable_days"
DEFAULT_MIN_UNAVAILABLE_DAYS: Final = 7
CONF_SCAN_INTERVAL_HOURS: Final = "scan_interval_hours"
DEFAULT_SCAN_INTERVAL_HOURS: Final = 24
CONF_UNUSED_AUTOMATION_DAYS: Final = "unused_automation_days"
DEFAULT_UNUSED_AUTOMATION_DAYS: Final = 90
CONF_LOW_BATTERY_PERCENT: Final = "low_battery_percent"
DEFAULT_LOW_BATTERY_PERCENT: Final = 20
JOURNAL_STORAGE_KEY: Final = f"{DOMAIN}.journal"
IGNORE_LABEL: Final = "housekeeper_ignore"
# Allowed range (min, max) per option, shared by the options flow and the panel command.
OPTION_LIMITS: Final = {
    CONF_MIN_UNAVAILABLE_DAYS: (0, 365),
    CONF_UNUSED_AUTOMATION_DAYS: (0, 3650),
    CONF_SCAN_INTERVAL_HOURS: (0, 720),
    CONF_LOW_BATTERY_PERCENT: (1, 100),
}
SIGNAL_SCAN_COMPLETE: Final = f"{DOMAIN}_scan_complete"
