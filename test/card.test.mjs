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
  assert.equal(hcOwnControl([{ dataset: { action: "open" } }, { dataset: { cam: "salon" } }]), true);
  // The tile itself is a group, not a control.
  assert.equal(hcOwnControl([{ tagName: "VIDEO" }, { dataset: { cam: "salon" } }]), false);
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

test("hcLoadStream rejects (and rearms) instead of hanging when the stream element cannot load", async () => {
  let helpersAvailable = false;
  let defined = false;
  const timeouts = [];
  const { hcLoadStream } = loadCard("home-camera-card.js", ["hcLoadStream"], {
    loadCardHelpers: async () => (helpersAvailable ? { createCardElement() {} } : null),
    customElements: {
      get: () => undefined,
      define() {},
      whenDefined: () => (defined ? Promise.resolve() : new Promise(() => {})),
    },
    setTimeout: (fn) => timeouts.push(fn),
  });

  // No loadCardHelpers: explicit rejection, not a forever-pending promise.
  await assert.rejects(hcLoadStream("camera.salon_hd_stream"), /loadCardHelpers/);

  // Rearmed after the failure: the next call retries; the element never defines, so the timeout rejects.
  helpersAvailable = true;
  const second = hcLoadStream("camera.salon_hd_stream");
  second.catch(() => {});
  await new Promise((r) => setImmediate(r));
  assert.equal(timeouts.length, 1);
  timeouts[0]();
  await assert.rejects(second, /ha-camera-stream/);

  // Rearmed again: once the element defines, the load resolves.
  defined = true;
  await hcLoadStream("camera.salon_hd_stream");
});

test("a failed player load is retried on the next hass update, not only when the grid changes", async () => {
  let loads = 0;
  const { customElements } = loadCard("home-camera-card.js", [], {
    loadCardHelpers: async () => {
      loads++;
      return null;
    },
  });
  const card = new (customElements.get("home-camera-card"))();
  card._streamEntity = "camera.salon_hd_stream";
  card.hass = { states: {}, entities: {} };
  await new Promise((r) => setImmediate(r));
  card.hass = { states: {}, entities: {} };
  await new Promise((r) => setImmediate(r));
  assert.equal(loads, 2);
});

test("I18N parity: every language has exactly the English keys and placeholders", () => {
  const { HcI18n } = loadCard("home-camera-card.js", ["HcI18n"]);
  const ref = Object.keys(HcI18n.en).sort();
  const ph = (s) => (String(s).match(/\{\w+\}/g) || []).sort();
  for (const lang of ["fr", "de", "es"]) {
    assert.ok(HcI18n[lang], `missing language ${lang}`);
    assert.deepEqual(Object.keys(HcI18n[lang]).sort(), ref, `keys of ${lang}`);
    for (const k of ref) assert.deepEqual(ph(HcI18n[lang][k]), ph(HcI18n.en[k]), `placeholders of ${lang}.${k}`);
  }
});

test("the card accepts de and es, and falls back to en", () => {
  const { customElements } = loadCard("home-camera-card.js", []);
  const card = new (customElements.get("home-camera-card"))();
  for (const [language, want] of [["de", "de"], ["es-ES", "es"], ["it", "en"]]) {
    card.setConfig({ cameras: [], language });
    assert.equal(card._lang(), want);
  }
  card.setConfig({ cameras: [], language: "de" });
  assert.equal(card._t("live_many", { n: 3 }), "3 Kameras live");
});

// A card whose header renders into a stub, and whose taps reach a recorded callService.
function headCard(cameras, states) {
  const { customElements } = loadCard("home-camera-card.js", []);
  const card = new (customElements.get("home-camera-card"))();
  card.setConfig({ cameras });
  const head = { innerHTML: "", contains: () => false, querySelectorAll: () => [] };
  const view = { innerHTML: "" };
  card.shadowRoot.querySelector = (sel) => (sel === ".head" ? head : sel === ".view" ? view : null);
  const calls = [];
  card._hass = {
    states: Object.fromEntries(Object.entries(states).map(([id, state]) => [id, { entity_id: id, state, attributes: {} }])),
    entities: {},
    callService: (domain, service, data) => {
      calls.push(`${domain}.${service} ${data.entity_id}`);
      return Promise.resolve();
    },
  };
  const render = () => {
    const cams = card._cameras();
    card._renderHead(cams, cams.filter((cam) => !card._hidden(cam)), true);
    return [...head.innerHTML.matchAll(/data-toggle="([^"]*)"/g)].map((m) => m[1]);
  };
  const tap = (id) => card._onClick({ composedPath: () => [{ dataset: { toggle: id } }] });
  return { card, render, tap, calls };
}

test("a camera hidden by its power switch is switched back on by its badge, not by its privacy switch", () => {
  const states = { "camera.terrace": "idle", "switch.terrace_privacy": "unavailable", "switch.terrace_plug": "off" };
  const cam = { camera: "camera.terrace", privacy: "switch.terrace_privacy", power: "switch.terrace_plug" };

  // Single camera: the round toggle beside the title.
  const one = headCard([cam], states);
  assert.deepEqual(one.render(), ["switch.terrace_plug"]);
  one.tap("switch.terrace_plug");
  assert.deepEqual(one.calls, ["switch.toggle switch.terrace_plug"]);
  // A second tap toggles the plug again (or waits for it), never the unavailable privacy switch.
  one.tap(one.render()[0]);
  assert.deepEqual(one.calls, ["switch.toggle switch.terrace_plug"]);

  // Several cameras: the badge row.
  const many = headCard([cam, "camera.garage"], { ...states, "camera.garage": "idle" });
  assert.deepEqual(many.render(), ["switch.terrace_plug"]);
});

test("the badge spins on the power switch it toggled, then targets the privacy switch once powered", () => {
  const states = { "camera.terrace": "idle", "switch.terrace_privacy": "unavailable", "switch.terrace_plug": "off" };
  const cam = { camera: "camera.terrace", privacy: "switch.terrace_privacy", power: "switch.terrace_plug" };
  const { card, render, tap } = headCard([cam], states);
  render();
  tap("switch.terrace_plug");
  render();
  assert.match(card.shadowRoot.querySelector(".head").innerHTML, /class="toggle pending" data-toggle="switch\.terrace_plug"/);

  // The plug is back on and the privacy switch with it: the badge now hides the camera with privacy.
  card._hass.states["switch.terrace_plug"].state = "on";
  card._hass.states["switch.terrace_privacy"].state = "off";
  card._pending.clear();
  assert.deepEqual(render(), ["switch.terrace_privacy"]);
});

test("power on and privacy on: the badge still toggles the privacy switch", () => {
  const { render } = headCard(
    [{ camera: "camera.terrace", privacy: "switch.terrace_privacy", power: "switch.terrace_plug" }],
    { "camera.terrace": "idle", "switch.terrace_privacy": "on", "switch.terrace_plug": "on" },
  );
  assert.deepEqual(render(), ["switch.terrace_privacy"]);
});

test("the header follows the badge target when the power comes back elsewhere while privacy stays on", () => {
  const { card } = headCard(
    [{ camera: "camera.terrace", privacy: "switch.terrace_privacy", power: "switch.terrace_plug" }],
    { "camera.terrace": "idle", "switch.terrace_privacy": "on", "switch.terrace_plug": "off" },
  );
  const toggles = () => [...card.shadowRoot.querySelector(".head").innerHTML.matchAll(/data-toggle="([^"]*)"/g)].map((m) => m[1]);
  card._update();
  assert.deepEqual(toggles(), ["switch.terrace_plug"]);
  // Plug switched on from elsewhere: still hidden (privacy on), but a tap must now turn privacy off.
  card._hass = { ...card._hass, states: { ...card._hass.states, "switch.terrace_plug": { state: "on", attributes: {} } } };
  card._update();
  assert.deepEqual(toggles(), ["switch.terrace_privacy"]);
});
