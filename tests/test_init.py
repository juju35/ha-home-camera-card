"""Setup, config flow, the panel open to every user, the card resource and the panel's WebSocket commands."""

import pytest
from homeassistant.components.frontend import DATA_PANELS
from homeassistant.config_entries import SOURCE_USER, ConfigEntryState
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.home_camera.const import CARD_URL, DOMAIN, PANEL_PATH, PANEL_URL, SIGNAL_UPDATED, VERSION

CARD = {"quality_entity": "input_select.camera_quality", "cameras": ["camera.living_room", {"camera": "camera.garden"}]}


@pytest.fixture
def entry(hass):
    entry = MockConfigEntry(domain=DOMAIN, title="Home Camera", data={}, options={"card": CARD, "title": ""})
    entry.add_to_hass(hass)
    return entry


async def _setup(hass, entry):
    assert await async_setup_component(hass, "lovelace", {})
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()


async def _ws(hass, client, payload):
    await client.send_json_auto_id(payload)
    return await client.receive_json()


async def test_config_flow_single_entry(hass):
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["options"] == {"card": {"cameras": []}, "title": ""}
    again = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    assert again["type"] is FlowResultType.ABORT
    assert again["reason"] == "single_instance_allowed"


async def test_panel_for_every_user_and_files_served(hass, entry, hass_client):
    await _setup(hass, entry)
    assert entry.state is ConfigEntryState.LOADED
    panel = hass.data[DATA_PANELS][PANEL_PATH]
    assert not panel.require_admin
    assert panel.sidebar_icon == "mdi:cctv"
    assert panel.sidebar_title == "Cameras"
    custom = panel.config["_panel_custom"]
    assert custom["name"] == "home-camera-panel"
    assert custom["module_url"] == f"{PANEL_URL}?v={VERSION}"
    assert panel.config["card_url"] == f"{CARD_URL}?v={VERSION}"
    client = await hass_client()
    for url, marker in (
        (PANEL_URL, f"HOME_CAMERA_PANEL_VERSION = '{VERSION}'"),
        (CARD_URL, f"HOME_CAMERA_CARD_VERSION = '{VERSION}'"),
    ):
        resp = await client.get(url)
        assert resp.status == 200
        assert marker in await resp.text()


async def test_sidebar_title_in_the_server_language(hass, entry):
    hass.config.language = "fr"
    await _setup(hass, entry)
    assert hass.data[DATA_PANELS][PANEL_PATH].sidebar_title == "Caméras"


async def test_unload_removes_panel(hass, entry):
    await _setup(hass, entry)
    await hass.config_entries.async_unload(entry.entry_id)
    assert PANEL_PATH not in hass.data[DATA_PANELS]
    await hass.config_entries.async_setup(entry.entry_id)
    assert PANEL_PATH in hass.data[DATA_PANELS]


async def test_card_resource_replaces_the_marketplace_dashboard_card(hass, entry):
    assert await async_setup_component(hass, "lovelace", {})
    resources = hass.data["lovelace"].resources
    await resources.async_get_info()
    await resources.async_create_item(
        {"res_type": "module", "url": "/hacsfiles/ha-home-camera-card/home-camera-card.js?hacstag=1"}
    )
    await resources.async_create_item({"res_type": "module", "url": "/local/other-card.js"})
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    urls = sorted(item["url"] for item in resources.async_items())
    assert urls == sorted([f"{CARD_URL}?v={VERSION}", "/local/other-card.js"])
    # Removed with the entry
    await hass.config_entries.async_remove(entry.entry_id)
    assert [item["url"] for item in resources.async_items()] == ["/local/other-card.js"]


async def test_yaml_dashboards_load_the_card_on_every_page(hass, entry, stub_frontend):
    assert await async_setup_component(hass, "lovelace", {"lovelace": {"resource_mode": "yaml"}})
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    stub_frontend.assert_called_once_with(hass, f"{CARD_URL}?v={VERSION}")


async def test_every_user_reads_the_settings_and_follows_their_changes(hass, entry, hass_ws_client, hass_admin_user):
    await _setup(hass, entry)
    hass_admin_user.groups = []  # an ordinary user
    client = await hass_ws_client(hass)
    msg = await _ws(hass, client, {"type": f"{DOMAIN}/subscribe"})
    assert msg["success"]
    event = await client.receive_json()
    assert event["event"] == {
        "configured": True,
        "card": CARD,
        "title": "",
        "sidebar_title": "Cameras",
        "default_title": "Cameras",
    }
    # Saved by an administrator: pushed to the subscribed panel
    hass.config_entries.async_update_entry(entry, options={"card": {"cameras": ["camera.door"]}, "title": ""})
    async_dispatcher_send(hass, SIGNAL_UPDATED)
    event = await client.receive_json()
    assert event["event"]["card"] == {"cameras": ["camera.door"]}


async def test_only_administrators_save(hass, entry, hass_ws_client, hass_admin_user):
    await _setup(hass, entry)
    hass_admin_user.groups = []
    client = await hass_ws_client(hass)
    msg = await _ws(hass, client, {"type": f"{DOMAIN}/update_settings", "title": "Surveillance"})
    assert not msg["success"]
    assert msg["error"]["code"] == "unauthorized"
    assert entry.options["title"] == ""


async def test_save_card_and_title(hass, entry, hass_ws_client):
    await _setup(hass, entry)
    client = await hass_ws_client(hass)
    sub = await _ws(hass, client, {"type": f"{DOMAIN}/subscribe"})
    await client.receive_json()  # the settings at once
    card = {"type": "custom:home-camera-card", "columns": 3, "cameras": [{"camera": "camera.garden", "name": "Garden"}]}
    msg = await _ws(hass, client, {"type": f"{DOMAIN}/update_settings", "card": card, "title": "  Surveillance "})
    # The subscription's event may arrive before the result
    replies = [msg, await client.receive_json()]
    result = next(r for r in replies if r.get("type") == "result")
    event = next(r for r in replies if r.get("type") == "event")
    assert result["success"]
    assert event["id"] == sub["id"]
    assert result["result"]["card"] == {"columns": 3, "cameras": [{"camera": "camera.garden", "name": "Garden"}]}
    assert result["result"]["sidebar_title"] == "Surveillance"
    assert entry.options == {"card": result["result"]["card"], "title": "Surveillance"}
    # The sidebar follows the new title
    assert hass.data[DATA_PANELS][PANEL_PATH].sidebar_title == "Surveillance"
    # Back to the default
    msg = await _ws(hass, client, {"type": f"{DOMAIN}/update_settings", "title": ""})
    await client.receive_json()
    assert hass.data[DATA_PANELS][PANEL_PATH].sidebar_title == "Cameras"


@pytest.mark.parametrize(
    "card",
    [
        ["camera.garden"],
        {"cameras": "camera.garden"},
        {"cameras": ["light.kitchen"]},
        {"cameras": [{"name": "No camera"}]},
        {"cameras": ["camera.x"] * 65},
        {"cameras": [], "notes": "x" * 40_000},
    ],
)
async def test_invalid_cards_are_refused(hass, entry, hass_ws_client, card):
    await _setup(hass, entry)
    client = await hass_ws_client(hass)
    msg = await _ws(hass, client, {"type": f"{DOMAIN}/update_settings", "card": card})
    assert not msg["success"]
    assert msg["error"]["code"] == "invalid_format"
    assert entry.options["card"] == CARD
