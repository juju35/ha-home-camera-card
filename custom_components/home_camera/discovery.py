"""Camera discovery: every camera of Home Assistant, as the card's camera entries.

One entry per camera, not per stream: Tapo has no quality selector but two camera entities per camera, a
``*_hd_stream`` and a ``*_sd_stream``. The SD one is the HD camera's SD stream, which the card pairs by itself
(its HD / SD switch, or a shared ``quality_entity``), so only the HD one is listed. Disabled and hidden cameras
are left out. Each entry is named after its device (the entity's own name when it has one), and the list is
sorted by area, then by name.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

CAMERA = "camera"
HD, SD = "_hd_stream", "_sd_stream"


def discover(hass: HomeAssistant) -> list[dict[str, Any]]:
    """The cameras: ``{"camera", "name", "area", "sd"}`` (``sd``, the SD stream it carries, or None)."""
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
            }
        )
    return sorted(found, key=lambda cam: (cam["area"] is None, (cam["area"] or "").casefold(), cam["name"].casefold()))


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


def card_entries(cameras: list[dict[str, Any]]) -> list[dict[str, str]]:
    """The discovered cameras as camera entries of the card."""
    return [{"camera": cam["camera"], "name": cam["name"]} for cam in cameras]
