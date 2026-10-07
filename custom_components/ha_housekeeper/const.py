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
LOW_BATTERY_PERCENT: Final = 20
IGNORE_LABEL: Final = "housekeeper_ignore"
SIGNAL_SCAN_COMPLETE: Final = f"{DOMAIN}_scan_complete"
