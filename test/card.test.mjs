import assert from "node:assert/strict";
import { test } from "node:test";
import { loadCard } from "./load.mjs";

const { hcSibling, hcOwnControl, hcDeviceIndex, hcRatio } = loadCard("home-camera-card.js", [
  "hcSibling",
  "hcOwnControl",
  "hcDeviceIndex",
  "hcRatio",
]);

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
  assert.equal(hcOwnControl([{ dataset: { action: "fullscreen" } }, { dataset: { cam: "salon" } }]), true);
  assert.equal(hcOwnControl([{ tagName: "VIDEO" }, { dataset: { cam: "salon" } }]), true);
  // Outside the card's controls (e.g. the header text): left alone.
  assert.equal(hcOwnControl([{ dataset: {} }, { tagName: "DIV" }, {}]), false);
});

test("hcRatio reads 16:9, 4/3 or a number, and falls back to 16:9", () => {
  assert.equal(hcRatio("16:9"), 16 / 9);
  assert.equal(hcRatio("4/3"), 4 / 3);
  assert.equal(hcRatio(" 1 : 1 "), 1);
  assert.equal(hcRatio(1.5), 1.5);
  assert.equal(hcRatio("2"), 2);
  assert.equal(hcRatio(undefined), 16 / 9);
  assert.equal(hcRatio("wide"), 16 / 9);
  assert.equal(hcRatio("0:9"), 16 / 9);
});

test("the local HD/SD choice is shared by every card of the page", () => {
  const store = new Map();
  const listeners = new Map();
  const { customElements } = loadCard("home-camera-card.js", [], {
    localStorage: { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)) },
    CustomEvent: class {
      constructor(type) {
        this.type = type;
      }
    },
    addEventListener: (type, fn) => listeners.set(type, [...(listeners.get(type) || []), fn]),
    removeEventListener: (type, fn) => listeners.set(type, (listeners.get(type) || []).filter((f) => f !== fn)),
    dispatchEvent: (ev) => {
      for (const fn of listeners.get(ev.type) || []) fn(ev);
    },
  });
  const Card = customElements.get("home-camera-card");
  const a = new Card();
  const b = new Card();
  a.setConfig({ cameras: [] });
  b.setConfig({ cameras: [] });
  a.connectedCallback();
  b.connectedCallback();
  let updates = 0;
  b._update = () => updates++;

  assert.equal(a._hd(), true);
  assert.equal(b._hd(), true);
  a._toggleQuality();
  assert.equal(a._hd(), false);
  assert.equal(b._hd(), false);
  assert.equal(updates, 1);

  b.disconnectedCallback();
  a._toggleQuality();
  assert.equal(updates, 1);
  assert.equal(b._hd(), true);

  // Re-attached after missing the toggle: it catches up without waiting for the next hass update.
  b.connectedCallback();
  assert.equal(updates, 2);
});

test("the same camera listed twice gets two distinct tile keys", () => {
  const { customElements } = loadCard("home-camera-card.js", []);
  const card = new (customElements.get("home-camera-card"))();
  card.setConfig({ cameras: ["camera.salon_hd_stream", "camera.garage", "camera.salon_hd_stream"] });
  card._hass = { states: {}, entities: {} };
  assert.deepEqual(
    card._cameras().map((c) => c.key),
    ["salon_hd_stream", "garage", "salon_hd_stream_2"],
  );
});
