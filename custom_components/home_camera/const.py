"""Constants for the Home Camera integration."""

DOMAIN = "home_camera"
VERSION = "4.4.2"

# Files served by the integration (their own base, so the panel's route never shadows them)
URL_BASE = f"/{DOMAIN}"
CARD_URL = f"{URL_BASE}/home-camera-card.js"
PANEL_URL = f"{URL_BASE}/home-camera-panel.js"
# Resource of the card installed as a Marketplace dashboard plugin before 4.0, replaced by the integration's
LEGACY_CARD_PATH = "ha-home-camera-card/home-camera-card.js"

# The sidebar panel: every user sees it, only administrators get its Settings tab
PANEL_PATH = "cameras"
PANEL_ICON = "mdi:cctv"
PANEL_ELEMENT = "home-camera-panel"

# Options of the config entry, edited in the panel's Settings tab
CONF_CARD = "card"  # the home-camera-card configuration the panel shows
CONF_TITLE = "title"  # sidebar title, empty: "Cameras" in the server's language
DEFAULTS = {CONF_CARD: {"cameras": []}, CONF_TITLE: ""}
MAX_CAMERAS = 64
MAX_TITLE_LENGTH = 50
MAX_CARD_SIZE = 32_000  # bytes of the card configuration, as JSON

# Sidebar title when none is set, in the server's language (the frontend cannot translate a panel's title)
TITLES = {
    "en": "Cameras",
    "fr": "Caméras",
    "de": "Kameras",
    "es": "Cámaras",
    "sr": "Камере",
    "sr-Latn": "Kamere",
    "it": "Telecamere",
    "nl": "Camera's",
    "pt": "Câmaras",
    "pl": "Kamery",
    "ro": "Camere",
    "da": "Kameraer",
    "sv": "Kameror",
    "bg": "Камери",
    "ru": "Камеры",
    "uk": "Камери",
    "hu": "Kamerák",
    "sk": "Kamery",
    "cs": "Kamery",
    "sl": "Kamere",
    "lv": "Kameras",
    "el": "Κάμερες",
}

# Sent to the panels' subscriptions when the settings change
SIGNAL_UPDATED = f"{DOMAIN}_updated"
