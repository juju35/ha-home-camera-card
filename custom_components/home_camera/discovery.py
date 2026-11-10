"""Camera discovery: every camera of Home Assistant, as the card's camera entries.

One entry per camera, not per stream: Tapo has no quality selector but two camera entities per camera, a
``*_hd_stream`` and a ``*_sd_stream``. The SD one is the HD camera's SD stream, which the card pairs by itself
(its HD / SD switch, or a shared ``quality_entity``), so only the HD one is listed. Disabled and hidden cameras
are left out. Each entry is named after its device (the entity's own name when it has one), and the list is
sorted by area, then by name.

Each entry also carries the controls found on the camera's device — privacy switch, pan and tilt buttons, motion
sensors — matched by their translation key (Tapo Cameras names its entities in the user's language:
``button.salon_gauche`` is ``move_left``) or by the end of their entity id (Tapo: Cameras Control), so they show in
the panel's editor instead of being guessed by the card.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

CAMERA = "camera"
HD, SD = "_hd_stream", "_sd_stream"
PRIVACY_KEYS = ("privacy_mode", "privacy")
PTZ_DIRECTIONS = ("left", "right", "up", "down")
# Detections shown as the camera's motion badge: by translation key when the integration gives them (Tapo Cameras:
# motion and person, not vehicles or pets), else by device class
MOTION_KEYS = ("motion", "person")
MOTION_CLASSES = ("motion", "occupancy", "presence")


def discover(hass: HomeAssistant) -> list[dict[str, Any]]:
    """The cameras: ``{"camera", "name", "area", "sd", "privacy", "ptz", "motion"}``.

    ``sd``: the SD stream it carries; ``privacy``: switch; ``ptz``: ``{direction: button}``; ``motion``: binary sensors.
    Each is None (or empty) when not found.
    """
    entities = er.async_get(hass)
    devices = dr.async_get(hass)
    areas = ar.async_get(hass)

    ids: set[str] = set()
    for entry in entities.entities.values():
        if entry.domain == CAMERA and not entry.disabled_by and not entry.hidden_by:
            ids.add(entry.entity_id)
    # Cameras without a registry entry (set up in YAML): only their state says they exist
    ids.update(eid for eid in hass.states.async_entity_ids(CAMERA) if entities.async_get(eid) is None)

    found = []
    for eid in ids:
        if eid.endswith(SD) and eid.removesuffix(SD) + HD in ids:
            continue  # the SD stream of a listed HD camera
        sd = eid.removesuffix(HD) + SD if eid.endswith(HD) else None
        entry = entities.async_get(eid)
        device = devices.async_get(entry.device_id) if entry and entry.device_id else None
        area_id = (entry.area_id if entry else None) or (device.area_id if device else None)
        area = areas.async_get_area(area_id) if area_id else None
        found.append(
            {
                "camera": eid,
                "name": _name(hass, eid, entry, device),
                "area": area.name if area else None,
                "sd": sd if sd in ids else None,
                **_controls(hass, entities, entry.device_id if entry else None),
            }
        )
    return sorted(found, key=lambda cam: (cam["area"] is None, (cam["area"] or "").casefold(), cam["name"].casefold()))


def _controls(hass: HomeAssistant, entities: er.EntityRegistry, device_id: str | None) -> dict[str, Any]:
    """Privacy switch, pan and tilt buttons and motion sensors of the camera's device."""
    if not device_id:
        return {"privacy": None, "ptz": None, "motion": []}
    siblings = [e for e in er.async_entries_for_device(entities, device_id) if not e.disabled_by and not e.hidden_by]

    def find(domain: str, key: str) -> str | None:
        own = [e for e in siblings if e.domain == domain]
        match = next((e for e in own if e.translation_key == key), None) or next(
            (e for e in own if e.entity_id.endswith(f"_{key}")), None
        )
        return match.entity_id if match else None

    privacy = next((found for key in PRIVACY_KEYS if (found := find("switch", key))), None)
    ptz = {d: found for d in PTZ_DIRECTIONS if (found := find("button", f"move_{d}"))}
    sensors = [e for e in siblings if e.domain == "binary_sensor"]
    motion = [e.entity_id for e in sensors if e.translation_key in MOTION_KEYS]
    if not motion:
        motion = [
            e.entity_id
            for e in sensors
            if (e.device_class or e.original_device_class) in MOTION_CLASSES
            or (not (e.device_class or e.original_device_class) and _state_class(hass, e.entity_id) in MOTION_CLASSES)
        ]
    return {"privacy": privacy, "ptz": ptz or None, "motion": sorted(motion)}


def _state_class(hass: HomeAssistant, entity_id: str) -> str | None:
    state = hass.states.get(entity_id)
    return state.attributes.get("device_class") if state else None


def _name(hass: HomeAssistant, entity_id: str, entry: er.RegistryEntry | None, device: dr.DeviceEntry | None) -> str:
    """The name a person gave (entity, then device), else the device's, else the state's friendly name."""
    if entry and entry.name:
        return entry.name
    if device and (device.name_by_user or device.name):
        return device.name_by_user or device.name
    state = hass.states.get(entity_id)
    if state and state.attributes.get("friendly_name"):
        return state.attributes["friendly_name"]
    return entity_id.split(".", 1)[1].replace("_", " ").capitalize()


def card_entry(cam: dict[str, Any]) -> dict[str, Any]:
    """A discovered camera as a camera entry of the card, with the controls found."""
    entry: dict[str, Any] = {"camera": cam["camera"], "name": cam["name"]}
    for key in ("privacy", "ptz"):
        if cam.get(key):
            entry[key] = cam[key]
    if cam.get("motion"):
        entry["motion"] = cam["motion"][0] if len(cam["motion"]) == 1 else cam["motion"]
    return entry


def card_entries(cameras: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """The discovered cameras as camera entries of the card."""
    return [card_entry(cam) for cam in cameras]
