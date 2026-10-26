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
window.emit = (i, type, detail) =>
  streams()[i].dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
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

test("a tap on a camera puts its tile fullscreen, without reconnecting any player", async () => {
  const r = await page.evaluate(async () => {
    mount(CAMS);
    const start = window.__connects;
    const requested = [];
    const original = Element.prototype.requestFullscreen;
    Element.prototype.requestFullscreen = function () {
      requested.push(this.dataset.cam);
      return Promise.resolve();
    };
    tiles()[1].querySelector(".open").click();
    tiles()[0].querySelector(".open").dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, composed: true }));
    Element.prototype.requestFullscreen = original;
    return { requested, connects: window.__connects - start };
  });
  assert.deepEqual(r.requested, ["b_hd_stream", "a_hd_stream"]);
  assert.equal(r.connects, 0);
});

test("in fullscreen: image fitted, exit button instead of details, a tap exits", async () => {
  const r = await page.evaluate(() => {
    mount(CAMS);
    const tile = tiles()[0];
    // Fullscreen as the browser reports it.
    Object.defineProperty(el.shadowRoot, "fullscreenElement", { configurable: true, get: () => tile });
    tile.dispatchEvent(new Event("fullscreenchange"));
    const inside = {
      fit: tile.querySelector("ha-camera-stream").fitMode,
      exit: !!tile.querySelector('[data-action="fullscreen"]'),
      details: !!tile.querySelector('[data-action="details"]'),
      label: tile.querySelector(".open").getAttribute("aria-label"),
    };
    let exited = 0;
    const original = document.exitFullscreen;
    document.exitFullscreen = () => {
      exited++;
      return Promise.resolve();
    };
    tile.querySelector(".open").click();
    tile.querySelector('[data-action="fullscreen"]').click();
    document.exitFullscreen = original;
    delete el.shadowRoot.fullscreenElement;
    tile.dispatchEvent(new Event("fullscreenchange"));
    return {
      inside,
      exited,
      after: { fit: tile.querySelector("ha-camera-stream").fitMode, details: !!tile.querySelector('[data-action="details"]') },
    };
  });
  assert.deepEqual(r.inside, { fit: "contain", exit: true, details: false, label: "Exit fullscreen" });
  assert.equal(r.exited, 2);
  assert.deepEqual(r.after, { fit: "cover", details: true });
});

test("without element fullscreen (iPhone), the video goes fullscreen, else the dialog opens", async () => {
  const r = await page.evaluate(() => {
    mount(CAMS);
    const opened = [];
    el.addEventListener("hass-more-info", (e) => opened.push(e.detail.entityId));
    const original = [Element.prototype.requestFullscreen, Element.prototype.webkitRequestFullscreen];
    Element.prototype.requestFullscreen = undefined;
    Element.prototype.webkitRequestFullscreen = undefined;
    const video = document.createElement("video");
    let native = 0;
    video.webkitEnterFullscreen = () => native++;
    streams()[0].appendChild(video);
    tiles()[0].querySelector(".open").click();
    tiles()[2].querySelector(".open").click();
    [Element.prototype.requestFullscreen, Element.prototype.webkitRequestFullscreen] = original;
    return { native, opened };
  });
  assert.equal(r.native, 1);
  assert.deepEqual(r.opened, ["camera.c"]);
});

test("the details button opens the camera dialog", async () => {
  const r = await page.evaluate(() => {
    mount(CAMS);
    const opened = [];
    el.addEventListener("hass-more-info", (e) => opened.push(e.detail.entityId));
    tiles()[1].querySelector('[data-action="details"]').click();
    return opened;
  });
  assert.deepEqual(r, ["camera.b_hd_stream"]);
});

test("with the arrows shown, a tap on the image closes them instead of going fullscreen", async () => {
  const r = await page.evaluate(() => {
    mount(CAMS);
    let requested = 0;
    const original = Element.prototype.requestFullscreen;
    Element.prototype.requestFullscreen = () => {
      requested++;
      return Promise.resolve();
    };
    const tile = tiles()[0];
    tile.querySelector('[data-action="ptz"]').click();
    tile.querySelector(".open").click();
    Element.prototype.requestFullscreen = original;
    return { closed: !tile.classList.contains("ptz-open"), requested };
  });
  assert.deepEqual(r, { closed: true, requested: 0 });
});

test("a held arrow keeps moving the camera; arrow keys move it too", async () => {
  const r = await page.evaluate(async () => {
    mount(CAMS);
    calls.length = 0;
    const tile = tiles()[0];
    tile.querySelector('[data-action="ptz"]').click();
    const left = tile.querySelector(".move.left");
    left.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true, button: 0 }));
    await new Promise((r) => setTimeout(r, 1000));
    left.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, composed: true }));
    const held = calls.length;
    await new Promise((r) => setTimeout(r, 500));
    const afterRelease = calls.length;
    // The click that follows a pointer press does not press again.
    left.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true, detail: 1 }));
    const afterClick = calls.length;
    tile.querySelector(".open").dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, composed: true }));
    return { held, afterRelease, afterClick, last: calls.at(-1) };
  });
  // Press at 0, then 500 ms hold, then every 350 ms: 2 or 3 presses within a second.
  assert.ok(r.held >= 2 && r.held <= 3, `held: ${r.held}`);
  assert.equal(r.afterRelease, r.held);
  assert.equal(r.afterClick, r.held);
  assert.deepEqual(r.last, ["button", "press", "button.a_move_up"]);
});

test("a spinner shows until the first frame", async () => {
  const r = await page.evaluate(() => {
    mount(CAMS);
    const loading = tiles().map((t) => t.classList.contains("loading"));
    emit(0, "load");
    el.hass = makeHass(baseStates()); // a mere state update keeps it loaded
    return { loading, after: tiles().map((t) => t.classList.contains("loading")) };
  });
  assert.deepEqual(r.loading, [true, true, true]);
  assert.deepEqual(r.after, [false, true, true]);
});

test("a privacy badge spins until its switch answers, and ignores taps meanwhile", async () => {
  const r = await page.evaluate(() => {
    mount(CAMS);
    calls.length = 0;
    const chip = () => el.shadowRoot.querySelector('[data-toggle="switch.b_privacy"]');
    chip().click();
    const pending = chip().classList.contains("pending");
    chip().click();
    const taps = calls.length;
    el.hass = makeHass({ ...baseStates(), "switch.b_privacy": st("switch.b_privacy", "on") });
    return { pending, taps, after: chip().className };
  });
  assert.equal(r.pending, true);
  assert.equal(r.taps, 1);
  assert.match(r.after, /private/);
});

test("the sound button shows on streams with sound, for one camera at a time", async () => {
  const r = await page.evaluate(() => {
    mount(CAMS);
    const sound = (i) => tiles()[i].querySelector('[data-action="sound"]');
    const before = !!sound(0);
    for (const i of [0, 1]) emit(i, "streams", { hasAudio: true, hasVideo: true });
    emit(2, "streams", { hasAudio: false, hasVideo: true });
    const shown = [0, 1, 2].map((i) => !!sound(i));
    sound(0).click();
    const first = streams().map((s) => s.muted);
    sound(1).click();
    const second = streams().map((s) => s.muted);
    sound(1).click();
    return {
      before,
      shown,
      first,
      second,
      third: streams().map((s) => s.muted),
      icon: sound(0).querySelector("ha-icon").getAttribute("icon"),
    };
  });
  // Only streams that carry sound get the button.
  assert.equal(r.before, false);
  assert.deepEqual(r.shown, [true, true, false]);
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
