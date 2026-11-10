"""Config flow: one entry, no question. The panel starts with every camera found (its Settings tab edits them)."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

from .const import CONF_CARD, DEFAULTS, DOMAIN
from .discovery import card_entries, discover


class HomeCameraConfigFlow(ConfigFlow, domain=DOMAIN):
    """Add the Cameras panel and the cards."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is None:
            return self.async_show_form(step_id="user")
        card = {**DEFAULTS[CONF_CARD], "cameras": card_entries(discover(self.hass))}
        return self.async_create_entry(title="Home Camera", data={}, options={**DEFAULTS, CONF_CARD: card})
