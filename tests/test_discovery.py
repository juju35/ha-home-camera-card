"""Camera discovery: one entry per camera (Tapo's HD and SD streams paired), named after the device, by area."""

from homeassistant.config_entries import SOURCE_USER
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.home_camera.const import DOMAIN
from custom_components.home_camera.discovery import card_entry, discover

NONE = {"privacy": None, "ptz": None, "motion": []}


def _tapo(hass, key, device_name, area):
    """A Tapo camera: one device, an HD and an SD camera entity."""
    entry = next(iter(hass.config_entries.async_entries("tapo_control")), None)
    if entry is None:
        entry = MockConfigEntry(domain="tapo_control")
        entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id, identifiers={("tapo_control", key)}, name=device_name
    )
    dr.async_get(hass).async_update_device(device.id, area_id=ar.async_get(hass).async_get_or_create(area).id)
    for stream in ("hd_stream", "sd_stream"):
        ent = er.async_get(hass).async_get_or_create(
            "camera",
            "tapo_control",
            f"{key}_{stream}",
            config_entry=entry,
            device_id=device.id,
            suggested_object_id=f"{key}_{stream}",
        )
        hass.states.async_set(ent.entity_id, "idle", {"friendly_name": f"{device_name} {stream}"})


async def test_tapo_streams_paired_named_by_device_sorted_by_area(hass):
    _tapo(hass, "living", "Living room camera", "Living room")
    _tapo(hass, "kids", "Kids camera", "Bedroom")
    # A camera without a device or area (YAML), and a hidden one
    hass.states.async_set("camera.terrace", "idle", {"friendly_name": "Terrace"})
    hidden = er.async_get(hass).async_get_or_create("camera", "demo", "attic", suggested_object_id="attic")
    er.async_get(hass).async_update_entity(hidden.entity_id, hidden_by=er.RegistryEntryHider.USER)
    assert discover(hass) == [
        {
            "camera": "camera.kids_hd_stream",
            "name": "Kids camera",
            "area": "Bedroom",
            "sd": "camera.kids_sd_stream",
            **NONE,
        },
        {
            "camera": "camera.living_hd_stream",
            "name": "Living room camera",
            "area": "Living room",
            "sd": "camera.living_sd_stream",
            **NONE,
        },
        {"camera": "camera.terrace", "name": "Terrace", "area": None, "sd": None, **NONE},
    ]


async def test_new_entry_starts_with_the_cameras_found(hass):
    _tapo(hass, "living", "Living room camera", "Living room")
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {})
    assert result["options"]["card"] == {
        "cameras": [{"camera": "camera.living_hd_stream", "name": "Living room camera"}]
    }


async def test_discover_command_for_administrators(hass, hass_ws_client, hass_admin_user):
    _tapo(hass, "living", "Living room camera", "Living room")
    entry = MockConfigEntry(domain=DOMAIN, options={"card": {"cameras": []}, "title": ""})
    entry.add_to_hass(hass)
    assert await async_setup_component(hass, "lovelace", {})
    await hass.config_entries.async_setup(entry.entry_id)
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": f"{DOMAIN}/discover"})
    msg = await client.receive_json()
    assert [cam["camera"] for cam in msg["result"]["cameras"]] == ["camera.living_hd_stream"]
    hass_admin_user.groups = []
    await client.send_json_auto_id({"type": f"{DOMAIN}/discover"})
    msg = await client.receive_json()
    assert msg["error"]["code"] == "unauthorized"


def _ha_tapo(hass):
    """A Tapo Cameras camera named in French: one camera entity, translated entity ids, English translation keys."""
    entry = MockConfigEntry(domain="tapo_cameras")
    entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id, identifiers={("tapo_cameras", "salon")}, name="Séjour"
    )
    reg = er.async_get(hass)

    def add(domain, key, object_id, device_class=None, **kw):
        ent = reg.async_get_or_create(
            domain,
            "tapo_cameras",
            f"salon_{key}",
            config_entry=entry,
            device_id=device.id,
            suggested_object_id=object_id,
            translation_key=key,
            original_device_class=device_class,
            **kw,
        )
        hass.states.async_set(ent.entity_id, "off", {"device_class": device_class} if device_class else {})
        return ent.entity_id

    add("camera", "camera", "sejour")
    reg.async_update_entity("camera.sejour", translation_key=None)
    add("switch", "privacy_mode", "sejour_mode_prive")
    for key, object_id in (
        ("move_left", "gauche"),
        ("move_right", "droite"),
        ("move_up", "monter"),
        ("move_down", "descendre"),
    ):
        add("button", key, f"sejour_{object_id}")
    add("binary_sensor", "motion", "sejour_mouvement", "motion")
    add("binary_sensor", "person", "sejour_personne", "occupancy")
    add("binary_sensor", "vehicle", "sejour_vehicule", "motion")
    add("binary_sensor", "event_subscription", "sejour_evenements", "connectivity")
    add("binary_sensor", "bark", "sejour_aboiements", "sound")


async def test_tapo_cameras_controls_found_by_translation_key(hass):
    _ha_tapo(hass)
    [cam] = discover(hass)
    assert cam["camera"] == "camera.sejour"
    assert cam["privacy"] == "switch.sejour_mode_prive"
    assert cam["ptz"] == {
        "left": "button.sejour_gauche",
        "right": "button.sejour_droite",
        "up": "button.sejour_monter",
        "down": "button.sejour_descendre",
    }
    # Motion and person, not vehicles, sounds or the subscription's connectivity
    assert cam["motion"] == ["binary_sensor.sejour_mouvement", "binary_sensor.sejour_personne"]
    assert card_entry(cam) == {
        "camera": "camera.sejour",
        "name": "Séjour",
        "privacy": "switch.sejour_mode_prive",
        "ptz": cam["ptz"],
        "motion": ["binary_sensor.sejour_mouvement", "binary_sensor.sejour_personne"],
    }


async def test_tapo_control_controls_found_by_entity_id(hass):
    _tapo(hass, "living", "Living room camera", "Living room")
    device_id = er.async_get(hass).async_get("camera.living_hd_stream").device_id
    entry = hass.config_entries.async_entries("tapo_control")[0]
    reg = er.async_get(hass)
    for object_id in ("living_privacy", "living_move_left", "living_motion"):
        domain = {"privacy": "switch", "left": "button", "motion": "binary_sensor"}[object_id.rsplit("_", 1)[1]]
        ent = reg.async_get_or_create(
            domain, "tapo_control", object_id, config_entry=entry, device_id=device_id, suggested_object_id=object_id
        )
        hass.states.async_set(ent.entity_id, "off", {"device_class": "motion"} if domain == "binary_sensor" else {})
    [cam] = discover(hass)
    assert cam["privacy"] == "switch.living_privacy"
    assert cam["ptz"] == {"left": "button.living_move_left"}
    assert cam["motion"] == ["binary_sensor.living_motion"]
