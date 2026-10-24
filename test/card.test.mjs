import assert from "node:assert/strict";
import { test } from "node:test";
import { loadCard } from "./load.mjs";

const { hcSibling, hcOwnControl, hcDeviceIndex } = loadCard("home-camera-card.js", ["hcSibling", "hcOwnControl", "hcDeviceIndex"]);

const entities = () => ({
  "camera.salon_hd_stream": { entity_id: "camera.salon_hd_stream", device_id: "d1" },
  "switch.salon_privacy": { entity_id: "switch.salon_privacy", device_id: "d1" },
  "button.salon_move_left": { entity_id: "button.salon_move_left", device_id: "d1" },
  "switch.garage_privacy": { entity_id: "switch.garage_privacy", device_id: "d2" },
  "sensor.orphan": { entity_id: "sensor.orphan" },
});

test("hcSibling finds an entity of the camera's own device", () => {
  const hass = { entities: entities() };
  assert.equal(hcSibling(hass, "camera.salon_hd_stream", "switch", "_privacy"), "switch.salon_privacy");
  assert.equal(hcSibling(hass, "camera.salon_hd_stream", "button", "_move_left"), "button.salon_move_left");
  assert.equal(hcSibling(hass, "camera.salon_hd_stream", "switch", "_nope"), undefined);
  assert.equal(hcSibling(hass, "camera.unknown", "switch", "_privacy"), undefined);
});

test("the device index is built once per registry object and rebuilt when it changes", () => {
  const reg = entities();
  const hass = { entities: reg };
  hcSibling(hass, "camera.salon_hd_stream", "switch", "_privacy");
  const index = hcDeviceIndex.get(reg);
  assert.ok(index);
  hcSibling(hass, "camera.salon_hd_stream", "button", "_move_left");
  assert.equal(hcDeviceIndex.get(reg), index);

  const reg2 = entities();
  delete reg2["switch.salon_privacy"];
  assert.equal(hcSibling({ entities: reg2 }, "camera.salon_hd_stream", "switch", "_privacy"), undefined);
});

test("only the card's own controls handle Enter/Space", () => {
  assert.equal(hcOwnControl([{ dataset: { toggle: "switch.salon_privacy" } }, {}]), true);
  assert.equal(hcOwnControl([{ dataset: { quality: "1" } }]), true);
  // A button inside the embedded advanced-camera-card: not ours, left alone.
  assert.equal(hcOwnControl([{ dataset: {} }, { tagName: "BUTTON" }, {}]), false);
});
