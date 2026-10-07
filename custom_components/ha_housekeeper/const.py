"""Constants for HA Housekeeper."""

from typing import Final

DOMAIN: Final = "ha_housekeeper"
NAME: Final = "HA Housekeeper"
VERSION: Final = "0.1.0"

PANEL_URL: Final = "ha-housekeeper"
PANEL_ELEMENT: Final = "ha-housekeeper-panel"
FRONTEND_URL: Final = "/ha_housekeeper/ha-housekeeper-panel.js"

STORAGE_KEY: Final = f"{DOMAIN}.observations"
STORAGE_VERSION: Final = 1
