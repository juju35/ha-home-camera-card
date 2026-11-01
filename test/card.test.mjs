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

const LANGS = ["fr", "de", "es", "sr", "sr-Latn", "it", "nl", "pt", "pl"];

test("I18N parity: every language has exactly the English keys and placeholders, and no empty value", () => {
  const { HcI18n } = loadCard("home-camera-card.js", ["HcI18n"]);
  const ref = Object.keys(HcI18n.en).sort();
  const ph = (s) => (String(s).match(/\{\w+\}/g) || []).sort();
  assert.deepEqual(Object.keys(HcI18n).sort(), ["en", ...LANGS].sort(), "dictionary languages");
  for (const lang of LANGS) {
    assert.ok(HcI18n[lang], `missing language ${lang}`);
    assert.deepEqual(Object.keys(HcI18n[lang]).sort(), ref, `keys of ${lang}`);
    for (const k of ref) {
      assert.deepEqual(ph(HcI18n[lang][k]), ph(HcI18n.en[k]), `placeholders of ${lang}.${k}`);
      assert.ok(String(HcI18n[lang][k]).trim(), `empty value ${lang}.${k}`);
    }
  }
});

test("I18N parity: every language has the same key paths as en, arrays of the same length", () => {
  const { HcI18n } = loadCard("home-camera-card.js", ["HcI18n"]);
  const paths = (o, p = "") =>
    Object.entries(o).flatMap(([k, v]) => {
      const q = p ? `${p}.${k}` : k;
      if (Array.isArray(v)) return [`${q}[${v.length}]`, ...paths(Object.assign({}, v), q)];
      return v && typeof v === "object" ? paths(v, q) : [q];
    });
  const ref = paths(HcI18n.en).sort();
  for (const lang of LANGS) assert.deepEqual(paths(HcI18n[lang]).sort(), ref, `key paths of ${lang}`);
});

test("the language resolves to the full tag, else its base, else en", () => {
  const { hcLang, customElements } = loadCard("home-camera-card.js", ["hcLang"]);
  const cases = [
    ["fr-FR", "fr"],
    ["de-CH", "de"],
    ["sr-Latn", "sr-Latn"],
    ["sr", "sr"],
    ["it-IT", "it"],
    ["nl-BE", "nl"],
    ["pt", "pt"],
    ["pt-BR", "pt"],
    ["pl-PL", "pl"],
    ["ja", "en"],
  ];
  for (const [language, want] of cases) assert.equal(hcLang(language), want, language);
  // Card and editor: config.language first, then the Home Assistant language.
  for (const tag of ["home-camera-card", "home-camera-card-editor"]) {
    const el = new (customElements.get(tag))();
    for (const [language, want] of cases) {
      el._config = { cameras: [], language };
      assert.equal(el._lang(), want, `${tag} ${language}`);
      el._config = { cameras: [] };
      el._hass = { language };
      assert.equal(el._lang(), want, `${tag} hass ${language}`);
    }
    el._config = { cameras: [], language: "de" };
    el._hass = { language: "sr-Latn" };
    assert.equal(el._lang(), "de", `${tag}: config.language wins`);
  }
});

test("the card accepts de and es, and falls back to en", () => {
  const { customElements } = loadCard("home-camera-card.js", []);
  const card = new (customElements.get("home-camera-card"))();
  for (const [language, want] of [["de", "de"], ["es-ES", "es"], ["it", "it"], ["ja", "en"]]) {
    card.setConfig({ cameras: [], language });
    assert.equal(card._lang(), want);
  }
  card.setConfig({ cameras: [], language: "de" });
  assert.equal(card._t("live_many", { n: 3 }), "3 Kameras live");
});

test("the editor language selector offers every dictionary language", () => {
  const { HcI18n, customElements } = loadCard("home-camera-card.js", ["HcI18n"]);
  const editor = new (customElements.get("home-camera-card-editor"))();
  editor._config = { cameras: [] };
  const field = editor._schema().find((f) => f.name === "language");
  const options = field.selector.select.options;
  assert.deepEqual([...options.map((o) => o.value)].sort(), [...Object.keys(HcI18n)].sort());
  const labels = Object.fromEntries(options.map((o) => [o.value, o.label]));
  assert.deepEqual(
    [labels.it, labels.nl, labels.pt, labels.pl],
    ["Italiano", "Nederlands", "Português (Portugal)", "Polski"],
  );
});

// A card whose header renders into a stub, and whose taps reach a recorded callService.
function headCard(cameras, states, config = {}) {
  const { customElements } = loadCard("home-camera-card.js", []);
  const card = new (customElements.get("home-camera-card"))();
  card.setConfig({ cameras, ...config });
  const head = { innerHTML: "", contains: () => false, querySelectorAll: () => [] };
  const view = { innerHTML: "" };
  card.shadowRoot.querySelector = (sel) => (sel === ".head" ? head : sel === ".view" ? view : null);
  // Header only: the grid of players needs a DOM (covered by the browser tests).
  card._renderView = () => {};
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

// The header summary of a card with `live` cameras filming and `hidden` ones hidden by their privacy switch.
function summaryOf(language, live, hidden) {
  const cameras = [];
  const states = {};
  for (let i = 0; i < live + hidden; i++) {
    cameras.push({ camera: `camera.c${i}`, privacy: `switch.c${i}_privacy` });
    states[`camera.c${i}`] = "idle";
    states[`switch.c${i}_privacy`] = i < live ? "off" : "on";
  }
  const { card, render } = headCard(cameras, states, { language });
  render();
  return /<div class="summary">([^<]*)<\/div>/.exec(card.shadowRoot.querySelector(".head").innerHTML)?.[1].replace(/&#39;/g, "'");
}

test("Serbian counts 2 to 4 cameras with the right form (the counter goes after the label)", () => {
  assert.equal(summaryOf("sr-Latn", 3, 2), "Kamere uživo: 3 · Skrivene: 2");
  assert.equal(summaryOf("sr", 3, 2), "Камере уживо: 3 · Скривене: 2");
  assert.equal(summaryOf("sr-Latn", 1, 1), "1 kamera uživo · 1 skrivena");
});

test("plurals: 1 is singular in every language, 2, 5, 21 and 22 use a form valid for any count", () => {
  const { HcI18n } = loadCard("home-camera-card.js", ["HcI18n"]);
  for (const lang of ["en", ...LANGS]) {
    const s = HcI18n[lang];
    for (const n of [1, 2, 5, 21, 22]) {
      const one = (k) => s[`${k}_one`].replace("{n}", 1);
      const of = (k) => s[`${k}_${n > 1 ? "many" : "one"}`].replace("{n}", n);
      // One camera on the other side, so both halves of the summary show.
      assert.equal(summaryOf(lang, n, 1), `${of("live")} · ${one("hidden")}`, `${lang} live ${n}`);
      assert.equal(summaryOf(lang, 1, n), `${one("live")} · ${of("hidden")}`, `${lang} hidden ${n}`);
    }
  }
  // Serbian and Polish have three forms (1 / 2-4 / 5+, and 21 is singular in Serbian): one string cannot fit
  // every count after the number, so the counter follows a label.
  for (const lang of ["sr", "sr-Latn", "pl"]) {
    for (const k of ["live_many", "hidden_many"]) assert.match(HcI18n[lang][k], /: \{n\}$/, `${lang}.${k}`);
  }
});
