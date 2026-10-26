// Runs the built card in Chromium with a stand-in ha-camera-stream: tile reuse, PTZ, sound, dialog, pause.
// Usage: npm run test:browser (CHROMIUM_PATH=... to use an installed Chromium)
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const cardJs = readFileSync(fileURLToPath(new URL("../../dist/home-camera-card.js", import.meta.url)), "utf8");

// The stand-in player counts how often it is (re)connected: a moved or recreated player reconnects its stream.
const stubs = `
customElements.define("ha-card", class extends HTMLElement {});
customElements.define("ha-icon", class extends HTMLElement {});
window.__connects = 0;
customElements.define("ha-camera-stream", class extends HTMLElement {
  static elementProperties = new Map([["hass", {}]]);
  connectedCallback() { window.__connects++; }
});
window.st = (id, state) => ({ entity_id: id, state, attributes: {} });
window.baseStates = () => {
  const out = {};
  for (const [id, s] of [
    ["camera.a_hd_stream", "idle"], ["camera.a_sd_stream", "idle"], ["camera.b_hd_stream", "idle"], ["camera.c", "idle"],
    ["switch.b_privacy", "off"], ["button.a_move_left", "unknown"], ["button.a_move_right", "unavailable"],
    ["button.a_move_up", "unknown"], ["button.a_move_down", "unknown"],
  ]) out[id] = st(id, s);
  return out;
};
window.calls = [];
window.makeHass = (states) => ({
  states,
  entities: {
    "camera.b_hd_stream": { entity_id: "camera.b_hd_stream", device_id: "b" },
    "switch.b_privacy": { entity_id: "switch.b_privacy", device_id: "b" },
  },
  language: "en",
  callService: (domain, service, data) => calls.push([domain, service, data.entity_id]),
});
window.mount = (cameras) => {
  document.body.replaceChildren();
  const el = document.createElement("home-camera-card");
  el.setConfig({ cameras });
  document.body.appendChild(el);
  el.hass = makeHass(baseStates());
  window.el = el;
  window.tiles = () => [...el.shadowRoot.querySelectorAll(".tile")];
  window.streams = () => tiles().map((t) => t.querySelector("ha-camera-stream"));
  return el;
};
window.CAMS = [{ camera: "camera.a_hd_stream", ptz: "button.a_move" }, "camera.b_hd_stream", "camera.c"];
`;

let browser;
let page;

before(async () => {
  browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  page = await browser.newPage();
  await page.setContent("<!doctype html><html><body></body></html>");
  await page.addScriptTag({ content: stubs });
  await page.addScriptTag({ content: cardJs });
});

after(async () => {
  await browser?.close();
});

test("one tile per visible camera, each player given its camera and hass", async () => {
  const r = await page.evaluate(() => {
    mount(CAMS);
    return {
      cams: tiles().map((t) => t.dataset.cam),
      entities: streams().map((s) => s.stateObj?.entity_id),
      hass: streams().every((s) => s.hass === el._hass),
      muted: streams().every((s) => s.muted),
    };
  });
  assert.deepEqual(r.cams, ["a_hd_stream", "b_hd_stream", "c"]);
  assert.deepEqual(r.entities, ["camera.a_hd_stream", "camera.b_hd_stream", "camera.c"]);
  assert.equal(r.hass, true);
  assert.equal(r.muted, true);
});

test("hiding, showing a camera or switching HD/SD never reconnects the other players", async () => {
  const r = await page.evaluate(() => {
    mount(CAMS);
    const [a, , c] = streams();
    const start = window.__connects;
    el.hass = makeHass({ ...baseStates(), "switch.b_privacy": st("switch.b_privacy", "on") });
    const hidden = { count: tiles().length, same: streams()[0] === a && streams()[1] === c, connects: window.__connects - start };
    el.hass = makeHass(baseStates());
    const shown = { order: tiles().map((t) => t.dataset.cam).join(","), connects: window.__connects - start };
    el._toggleQuality();
    const sd = { entity: streams()[0].stateObj?.entity_id, same: streams()[0] === a, connects: window.__connects - start };
    el._toggleQuality();
    return { hidden, shown, sd };
  });
  assert.deepEqual(r.hidden, { count: 2, same: true, connects: 0 });
  // Only the camera shown again gets a new player.
  assert.deepEqual(r.shown, { order: "a_hd_stream,b_hd_stream,c", connects: 1 });
  assert.deepEqual(r.sd, { entity: "camera.a_sd_stream", same: true, connects: 1 });
});

test("an unavailable camera shows its placeholder and an empty player", async () => {
  const r = await page.evaluate(() => {
    mount(CAMS);
    el.hass = makeHass({ ...baseStates(), "camera.c": st("camera.c", "unavailable") });
    return { off: tiles()[2].classList.contains("off"), empty: streams()[2].stateObj === undefined };
  });
  assert.deepEqual(r, { off: true, empty: true });
});

test("PTZ: arrows press their button, unavailable ones are greyed out and ignored", async () => {
  const r = await page.evaluate(() => {
    mount(CAMS);
    calls.length = 0;
    const tile = tiles()[0];
    tile.querySelector('[data-action="ptz"]').click();
    const open = tile.classList.contains("ptz-open");
    tile.querySelector(".move.left").click();
    tile.querySelector(".move.right").click();
    return {
      open,
      dis: tile.querySelector(".move.right").classList.contains("dis"),
      calls: [...calls],
      noPtzOnOthers: !tiles()[1].querySelector('[data-action="ptz"]'),
    };
  });
  assert.equal(r.open, true);
  assert.equal(r.dis, true);
  assert.deepEqual(r.calls, [["button", "press", "button.a_move_left"]]);
  assert.equal(r.noPtzOnOthers, true);
});

test("a tap or Enter on the image opens the camera dialog; with the arrows shown it closes them", async () => {
  const r = await page.evaluate(() => {
    mount(CAMS);
    const opened = [];
    el.addEventListener("hass-more-info", (e) => opened.push(e.detail.entityId));
    tiles()[1].querySelector(".open").click();
    tiles()[2].querySelector(".open").dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, composed: true }));
    const tile = tiles()[0];
    tile.querySelector('[data-action="ptz"]').click();
    tile.querySelector(".open").click();
    return { opened, closed: !tile.classList.contains("ptz-open") };
  });
  assert.deepEqual(r.opened, ["camera.b_hd_stream", "camera.c"]);
  assert.equal(r.closed, true);
});

test("sound is on for one camera at a time", async () => {
  const r = await page.evaluate(() => {
    mount(CAMS);
    const sound = (i) => tiles()[i].querySelector('[data-action="sound"]');
    sound(0).click();
    const first = streams().map((s) => s.muted);
    sound(1).click();
    const second = streams().map((s) => s.muted);
    sound(1).click();
    return { first, second, third: streams().map((s) => s.muted), icon: sound(0).querySelector("ha-icon").getAttribute("icon") };
  });
  assert.deepEqual(r.first, [false, true, true]);
  assert.deepEqual(r.second, [true, false, true]);
  assert.deepEqual(r.third, [true, true, true]);
  assert.equal(r.icon, "mdi:volume-off");
});

test("players are emptied while the page is hidden and filled again when it comes back", async () => {
  const r = await page.evaluate(() => {
    mount(CAMS);
    const setVisibility = (v) => {
      Object.defineProperty(document, "visibilityState", { configurable: true, get: () => v });
      document.dispatchEvent(new Event("visibilitychange"));
    };
    setVisibility("hidden");
    const paused = streams().every((s) => s.stateObj === undefined);
    setVisibility("visible");
    return { paused, resumed: streams().map((s) => s.stateObj?.entity_id) };
  });
  assert.equal(r.paused, true);
  assert.deepEqual(r.resumed, ["camera.a_hd_stream", "camera.b_hd_stream", "camera.c"]);
});

test("the same camera listed twice gets two tiles", async () => {
  const n = await page.evaluate(() => {
    mount(["camera.c", "camera.c"]);
    return tiles().length;
  });
  assert.equal(n, 2);
});
