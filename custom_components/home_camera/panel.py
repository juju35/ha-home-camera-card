"""The Cameras sidebar panel and its WebSocket commands.

The panel (``frontend/home-camera-panel.js``) is open to every user, not only administrators: its Cameras tab
shows the home camera card full page, as the cameras dashboard did. Administrators also get a Settings tab
(the card's visual editor and the sidebar title). Commands:

- ``home_camera/subscribe`` (every user): the settings at once, then again each time they change;
- ``home_camera/update_settings`` (administrators): changes the card configuration and the sidebar title;
- ``home_camera/discover`` (administrators): every camera of Home Assistant, for the Settings tab to add the
  ones the panel does not show yet (``discovery.py``).
"""

from __future__ import annotations

import json
import re
from typing import Any

import voluptuous as vol
from homeassistant.components import frontend, panel_custom, websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect, async_dispatcher_send

from .const import (
    CARD_URL,
    CONF_CARD,
    CONF_TITLE,
    DEFAULTS,
    DOMAIN,
    MAX_CAMERAS,
    MAX_CARD_SIZE,
    MAX_TITLE_LENGTH,
    PANEL_ELEMENT,
    PANEL_ICON,
    PANEL_PATH,
    PANEL_URL,
    SIGNAL_UPDATED,
    TITLES,
    VERSION,
)
from .discovery import discover

_ENTITY = re.compile(r"^[a-z_]+\.[a-z0-9_]+$")


def settings(entry: ConfigEntry | None) -> dict[str, Any]:
    """The settings, defaults filled in."""
    return {**DEFAULTS, **(entry.options if entry else {})}


def sidebar_title(hass: HomeAssistant, title: str) -> str:
    """The title set in the panel, else "Cameras" in the server's language."""
    if title:
        return title
    language = hass.config.language or "en"
    return TITLES.get(language) or TITLES.get(language.split("-")[0], TITLES["en"])


def _entry(hass: HomeAssistant) -> ConfigEntry | None:
    entries = hass.config_entries.async_entries(DOMAIN)
    return entries[0] if entries else None


def _payload(hass: HomeAssistant) -> dict[str, Any]:
    entry = _entry(hass)
    current = settings(entry)
    return {
        "configured": entry is not None,
        CONF_CARD: current[CONF_CARD],
        CONF_TITLE: current[CONF_TITLE],
        "sidebar_title": sidebar_title(hass, current[CONF_TITLE]),
        "default_title": sidebar_title(hass, ""),
    }


async def async_register_panel(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Add Cameras to the sidebar, for every user (require_admin is off)."""
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_PATH,
        webcomponent_name=PANEL_ELEMENT,
        sidebar_title=sidebar_title(hass, settings(entry)[CONF_TITLE]),
        sidebar_icon=PANEL_ICON,
        module_url=f"{PANEL_URL}?v={VERSION}",
        require_admin=False,
        config={"version": VERSION, "card_url": f"{CARD_URL}?v={VERSION}"},
    )


@callback
def async_register_commands(hass: HomeAssistant) -> None:
    """The panel's commands, registered once per start."""
    websocket_api.async_register_command(hass, _ws_subscribe)
    websocket_api.async_register_command(hass, _ws_update_settings)
    websocket_api.async_register_command(hass, _ws_discover)


def validate_card(card: Any) -> dict[str, Any]:
    """A home-camera-card configuration: a dict with a list of cameras (entity ids or dicts with a camera)."""
    if not isinstance(card, dict):
        raise vol.Invalid("the card configuration must be a dictionary")
    try:
        size = len(json.dumps(card))
    except (TypeError, ValueError) as err:
        raise vol.Invalid("the card configuration must be plain JSON") from err
    if size > MAX_CARD_SIZE:
        raise vol.Invalid("the card configuration is too large")
    cameras = card.get("cameras", [])
    if not isinstance(cameras, list) or len(cameras) > MAX_CAMERAS:
        raise vol.Invalid(f"cameras must be a list of at most {MAX_CAMERAS} cameras")
    for cam in cameras:
        entity = cam.get("camera") if isinstance(cam, dict) else cam
        if not isinstance(entity, str) or not entity.startswith("camera.") or not _ENTITY.match(entity):
            raise vol.Invalid(f"not a camera: {entity!r}")
    # The card's own type is the panel's business, not the stored configuration's
    return {key: value for key, value in card.items() if key != "type"}


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/subscribe"})
@websocket_api.async_response
async def _ws_subscribe(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    """The settings, then their changes: open to every user, the panel needs them to draw the cameras."""

    @callback
    def _send() -> None:
        connection.send_message(websocket_api.event_message(msg["id"], _payload(hass)))

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(hass, SIGNAL_UPDATED, _send)
    connection.send_result(msg["id"])
    _send()


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/update_settings",
        vol.Optional(CONF_CARD): validate_card,
        vol.Optional(CONF_TITLE): vol.All(str, vol.Strip, vol.Length(max=MAX_TITLE_LENGTH)),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def _ws_update_settings(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    if (entry := _entry(hass)) is None:
        connection.send_error(msg["id"], "not_found", "Home Camera is not set up")
        return
    current = settings(entry)
    updated = {**current, **{key: msg[key] for key in DEFAULTS if key in msg}}
    if updated != current:
        hass.config_entries.async_update_entry(entry, options=updated)
        if updated[CONF_TITLE] != current[CONF_TITLE]:
            # The sidebar title is the panel's: registered again under the new one
            frontend.async_remove_panel(hass, PANEL_PATH)
            await async_register_panel(hass, entry)
        async_dispatcher_send(hass, SIGNAL_UPDATED)
    connection.send_result(msg["id"], _payload(hass))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/discover"})
@websocket_api.require_admin
@callback
def _ws_discover(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict) -> None:
    connection.send_result(msg["id"], {"cameras": discover(hass)})
