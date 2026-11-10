"""Config flow: one entry, no question (the cameras are set in the panel's Settings tab)."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

from .const import CONF_CARD, DEFAULTS, DOMAIN


class HomeCameraConfigFlow(ConfigFlow, domain=DOMAIN):
    """Add the Cameras panel and the cards."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is None:
            return self.async_show_form(step_id="user")
        return self.async_create_entry(
            title="Home Camera", data={}, options={**DEFAULTS, CONF_CARD: dict(DEFAULTS[CONF_CARD])}
        )
