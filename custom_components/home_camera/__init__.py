"""Home Camera: the Cameras sidebar panel for every user, and the home camera Lovelace cards."""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

from homeassistant.components import frontend
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED
from homeassistant.core import CoreState, Event, HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .const import CARD_URL, DOMAIN, LEGACY_CARD_PATH, PANEL_PATH, PANEL_URL, URL_BASE, VERSION
from .panel import async_register_commands, async_register_panel

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Serve the card, its language files and the panel; register the panel's commands."""
    base = Path(__file__).parent / "frontend"
    # The release splits the card's translations into home-camera-card.i18n.<lang>.js (scripts/build.mjs)
    languages = await hass.async_add_executor_job(_language_files, base)
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(CARD_URL, str(base / "home-camera-card.js"), True),
            StaticPathConfig(PANEL_URL, str(base / "home-camera-panel.js"), True),
            *(StaticPathConfig(f"{URL_BASE}/{name}", str(base / name), True) for name in languages),
        ]
    )
    async_register_commands(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Add the Cameras panel to the sidebar and load the cards on every dashboard."""
    await async_register_panel(hass, entry)

    async def _load_card(_: Event | None = None) -> None:
        if not await _async_register_resource(hass):
            # Dashboard resources in YAML mode: the card is loaded on every page instead
            add_extra_js_url(hass, f"{CARD_URL}?v={VERSION}")

    if hass.state is CoreState.running:
        await _load_card()
    else:
        entry.async_on_unload(hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _load_card))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Remove the panel; the cards stay loaded until the entry is removed."""
    frontend.async_remove_panel(hass, PANEL_PATH)
    return True


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Drop the card's dashboard resource."""
    if (resources := _storage_resources(hass)) is None:
        return
    await resources.async_get_info()
    for item in list(resources.async_items()):
        if item.get("url", "").split("?")[0] == CARD_URL:
            await resources.async_delete_item(item["id"])


def _language_files(frontend_dir: Path) -> list[str]:
    """The card's translation files the release split out, if any."""
    return sorted(p.name for p in frontend_dir.glob("*.i18n.*.js"))


def _storage_resources(hass: HomeAssistant) -> Any | None:
    """The dashboard resources collection when it is editable from the UI.

    hass.data["lovelace"] is a dict before 2025.2, then a dataclass whose `mode` field became `resource_mode` in 2026.2.
    """
    lovelace = hass.data.get("lovelace")
    if isinstance(lovelace, dict):
        mode, resources = lovelace.get("resource_mode", lovelace.get("mode")), lovelace.get("resources")
    else:
        mode = getattr(lovelace, "resource_mode", getattr(lovelace, "mode", None))
        resources = getattr(lovelace, "resources", None)
    return resources if mode == "storage" else None


async def _async_register_resource(hass: HomeAssistant) -> bool:
    """Add or update the card in Settings → Dashboards → Resources, replacing the card installed before 4.0."""
    resources = _storage_resources(hass)
    if resources is None:
        return False
    url = f"{CARD_URL}?v={VERSION}"
    try:
        await resources.async_get_info()  # loads the collection from storage
        for item in list(resources.async_items()):
            if LEGACY_CARD_PATH in item.get("url", ""):
                await resources.async_delete_item(item["id"])
        existing = [item for item in resources.async_items() if item.get("url", "").split("?")[0] == CARD_URL]
        if not existing:
            await resources.async_create_item({"res_type": "module", "url": url})
            return True
        if existing[0]["url"] != url:
            await resources.async_update_item(existing[0]["id"], {"res_type": "module", "url": url})
        for duplicate in existing[1:]:
            await resources.async_delete_item(duplicate["id"])
    except Exception:  # noqa: BLE001 - never block the integration on the card
        _LOGGER.exception("Could not register the Home Camera card as a dashboard resource")
        return False
    return True
