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
// Waits for the IntersectionObserver to report (it calls back on the next rendering steps).
window.frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 50))));
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

test("in fullscreen: image fitted, arrows shown, exit button instead of details, a tap exits", async () => {
  const r = await page.evaluate(() => {
    mount(CAMS);
    const tile = tiles()[0];
    tile.querySelector('[data-action="ptz"]').click(); // opened in the grid: replaced by the fullscreen arrows
    // Fullscreen as the browser reports it.
    Object.defineProperty(el.shadowRoot, "fullscreenElement", { configurable: true, get: () => tile });
    tile.dispatchEvent(new Event("fullscreenchange"));
    const inside = {
      fit: tile.querySelector("ha-camera-stream").fitMode,
      buttons: [...tile.querySelectorAll(".tools [data-action]")].map((b) => b.dataset.action),
      arrows: tile.querySelectorAll(".move").length,
      label: tile.querySelector(".open").getAttribute("aria-label"),
    };
    calls.length = 0;
    tile.querySelector(".open").dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, composed: true }));
    inside.key = calls.at(-1)?.[2];
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
      after: [...tile.querySelectorAll(".tools [data-action]")].map((b) => b.dataset.action),
    };
  });
  assert.deepEqual(r.inside, {
    fit: "contain",
    buttons: ["fullscreen"],
    arrows: 4,
    label: "Exit fullscreen",
    key: "button.a_move_left",
  });
  assert.equal(r.exited, 2);
  assert.deepEqual(r.after, ["ptz", "details"]);
});

test("without element fullscreen (iPhone), the card covers the screen itself, with the arrows", async () => {
  const r = await page.evaluate(() => {
    mount(CAMS);
    const original = [Element.prototype.requestFullscreen, Element.prototype.webkitRequestFullscreen];
    Element.prototype.requestFullscreen = undefined;
    Element.prototype.webkitRequestFullscreen = undefined;
    const start = window.__connects;
    const tile = tiles()[0];
    tile.querySelector(".open").click();
    const rect = tile.getBoundingClientRect();
    const pad = getComputedStyle(tile.querySelector(".pad")).display;
    calls.length = 0;
    tile.querySelector(".move.up").click();
    const press = calls.at(-1)?.[2];
    // A tap on the image leaves; Escape too.
    tile.querySelector(".open").click();
    const afterTap = tile.classList.contains("pseudo");
    tile.querySelector(".open").click();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    const afterEscape = tile.classList.contains("pseudo");
    [Element.prototype.requestFullscreen, Element.prototype.webkitRequestFullscreen] = original;
    return {
      covers: Math.round(rect.width) === innerWidth && Math.round(rect.height) === innerHeight,
      pad,
      press,
      afterTap,
      afterEscape,
      connects: window.__connects - start,
    };
  });
  assert.deepEqual(r, {
    covers: true,
    pad: "block",
    press: "button.a_move_up",
    afterTap: false,
    afterEscape: false,
    connects: 0,
  });
});

test("in fullscreen, a camera without pan & tilt shows no pad", async () => {
  const r = await page.evaluate(() => {
    mount(CAMS);
    const original = [Element.prototype.requestFullscreen, Element.prototype.webkitRequestFullscreen];
    Element.prototype.requestFullscreen = undefined;
    Element.prototype.webkitRequestFullscreen = undefined;
    const tile = tiles()[1];
    tile.querySelector(".open").click();
    const pseudo = tile.classList.contains("pseudo");
    const pad = getComputedStyle(tile.querySelector(".pad")).display;
    tile.querySelector(".open").click();
    [Element.prototype.requestFullscreen, Element.prototype.webkitRequestFullscreen] = original;
    return { pseudo, pad };
  });
  assert.deepEqual(r, { pseudo: true, pad: "none" });
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

test("the HD / SD switch selects the option tapped, and a tap on the current one does nothing", async () => {
  const r = await page.evaluate(() => {
    mount(CAMS);
    const opt = (q) => el.shadowRoot.querySelector(`[data-quality="${q}"]`);
    const state = () => ({ hd: opt("hd").classList.contains("on"), entity: streams()[0].stateObj?.entity_id });
    opt("hd").click();
    const first = state();
    opt("sd").click();
    const second = state();
    opt("sd").click();
    const third = state();
    opt("hd").click();
    return { first, second, third, checked: opt("hd").getAttribute("aria-checked") };
  });
  assert.deepEqual(r.first, { hd: true, entity: "camera.a_hd_stream" });
  assert.deepEqual(r.second, { hd: false, entity: "camera.a_sd_stream" });
  assert.deepEqual(r.third, r.second);
  assert.equal(r.checked, "true");
});

test("every camera hidden: no quality switch, a panel saying how to bring one back", async () => {
  const r = await page.evaluate(() => {
    mount(["camera.b_hd_stream"]);
    el.hass = makeHass({ ...baseStates(), "switch.b_privacy": st("switch.b_privacy", "on") });
    return {
      tiles: tiles().length,
      quality: !!el.shadowRoot.querySelector(".seg"),
      panel: el.shadowRoot.querySelector(".asleep")?.textContent,
    };
  });
  assert.deepEqual(r, { tiles: 0, quality: false, panel: "Enable the camera to see it here" });
});

test("an entry without a camera entity does not count: header, tile label and hidden panel all treat the card as single", async () => {
  const r = await page.evaluate(() => {
    // A mistyped key: the second entry has no camera and is skipped.
    mount(["camera.b_hd_stream", { entity_id: "camera.c" }]);
    const head = {
      toggle: !!el.shadowRoot.querySelector(".toggle"),
      label: tiles()[0].querySelector(".label .text").textContent,
    };
    el.hass = makeHass({ ...baseStates(), "switch.b_privacy": st("switch.b_privacy", "on") });
    return { ...head, panel: el.shadowRoot.querySelector(".asleep")?.textContent };
  });
  assert.deepEqual(r, { toggle: true, label: "Live", panel: "Enable the camera to see it here" });
});

test("several cameras all hidden still point to the badges", async () => {
  const r = await page.evaluate(() => {
    mount(["camera.b_hd_stream", "camera.b_hd_stream"]);
    const label = tiles()[0].querySelector(".label .text").textContent;
    el.hass = makeHass({ ...baseStates(), "switch.b_privacy": st("switch.b_privacy", "on") });
    return { label, panel: el.shadowRoot.querySelector(".asleep")?.textContent };
  });
  assert.notEqual(r.label, "Live");
  assert.equal(r.panel, "Tap a badge to show a camera");
});

test("a tile kept when the card goes from two cameras to one switches its label to Live", async () => {
  const r = await page.evaluate(() => {
    mount(["camera.c", "camera.b_hd_stream"]);
    const tile = tiles()[0];
    const before = tile.querySelector(".label .text").textContent;
    el.setConfig({ cameras: ["camera.c"] });
    return { before, same: tiles()[0] === tile, after: tiles()[0].querySelector(".label .text").textContent };
  });
  assert.deepEqual(r, { before: "camera.c", same: true, after: "Live" });
});

test("entries without any camera entity show the empty-card message, not a hint about badges", async () => {
  const r = await page.evaluate(() => {
    mount([{ entity_id: "camera.c" }]);
    return { asleep: !!el.shadowRoot.querySelector(".asleep"), empty: !!el.shadowRoot.querySelector(".empty") };
  });
  assert.deepEqual(r, { asleep: false, empty: true });
});

test("a single camera's toggle uses the badge marks: live dot while filming, lock while hidden", async () => {
  const r = await page.evaluate(() => {
    mount(["camera.b_hd_stream"]);
    const mark = () => {
      const t = el.shadowRoot.querySelector(".toggle");
      return { cls: t.className, dot: !!t.querySelector(".dot"), icon: t.querySelector("ha-icon")?.getAttribute("icon") ?? null };
    };
    const live = mark();
    el.hass = makeHass({ ...baseStates(), "switch.b_privacy": st("switch.b_privacy", "on") });
    return { live, hidden: mark() };
  });
  assert.deepEqual(r.live, { cls: "toggle exposed", dot: true, icon: null });
  assert.deepEqual(r.hidden, { cls: "toggle private", dot: false, icon: "mdi:eye-lock" });
});

test("a fullscreen tile (iPhone) removed by its camera going hidden gives the page scroll back", async () => {
  const r = await page.evaluate(() => {
    const scroll = () => [document.documentElement.style.overflow, document.body.style.overflow];
    const original = [Element.prototype.requestFullscreen, Element.prototype.webkitRequestFullscreen];
    Element.prototype.requestFullscreen = undefined;
    Element.prototype.webkitRequestFullscreen = undefined;
    const out = {};
    // One of several cameras hidden, then the only camera hidden.
    for (const [name, cams, index] of [["some", CAMS, 1], ["all", ["camera.b_hd_stream"], 0]]) {
      mount(cams);
      tiles()[index].querySelector(".open").click();
      const locked = scroll();
      el.hass = makeHass({ ...baseStates(), "switch.b_privacy": st("switch.b_privacy", "on") });
      out[name] = { locked, released: scroll(), pseudo: el._pseudo };
    }
    [Element.prototype.requestFullscreen, Element.prototype.webkitRequestFullscreen] = original;
    return out;
  });
  for (const name of ["some", "all"]) {
    assert.deepEqual(r[name], { locked: ["hidden", "hidden"], released: ["", ""], pseudo: null }, name);
  }
});

test("a held arrow stops when it is re-rendered or its tile removed before the release", async () => {
  const r = await page.evaluate(async () => {
    const hold = async (detach) => {
      mount(CAMS);
      const tile = tiles()[0];
      tile.querySelector('[data-action="ptz"]').click();
      calls.length = 0;
      tile.querySelector(".move.left").dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true, button: 0 }));
      detach(tile);
      await new Promise((r) => setTimeout(r, 1300));
      return calls.length;
    };
    return {
      // The player reports sound: the buttons and arrows are re-rendered under the finger.
      rerendered: await hold(() => emit(0, "streams", { hasAudio: true, hasVideo: true })),
      removed: await hold(() => el.setConfig({ cameras: ["camera.c"] })),
    };
  });
  // Only the press at pointerdown: no repeat on a button that is gone.
  assert.deepEqual(r, { rerendered: 1, removed: 1 });
});

test("a refused privacy toggle stops the badge spinning at once", async () => {
  const r = await page.evaluate(async () => {
    mount(CAMS);
    const unhandled = [];
    const onUnhandled = (e) => unhandled.push(String(e.reason));
    window.addEventListener("unhandledrejection", onUnhandled);
    el._hass.callService = () => Promise.reject(new Error("Unauthorized"));
    const chip = () => el.shadowRoot.querySelector('[data-toggle="switch.b_privacy"]');
    chip().click();
    const pending = chip().classList.contains("pending");
    await new Promise((r) => setTimeout(r, 50));
    window.removeEventListener("unhandledrejection", onUnhandled);
    return { pending, after: chip().classList.contains("pending"), unhandled };
  });
  assert.deepEqual(r, { pending: true, after: false, unhandled: [] });
});

// WCAG contrast of the hidden camera's badge and toggle over the card, in HA's default light and dark themes:
// the label is 11 px text (4.5:1), the toggle's lock an icon that carries the state on its own (3:1).
const THEMES = {
  light: { "--success-color": "#43a047", "--primary-text-color": "#212121", "--card-background-color": "#ffffff" },
  dark: { "--success-color": "#43a047", "--primary-text-color": "#e1e1e1", "--card-background-color": "#1c1c1c" },
  // A theme that leaves --success-color out: the card's own green fallback.
  "light (no --success-color)": { "--primary-text-color": "#212121", "--card-background-color": "#ffffff" },
};
const parseColor = (s) => {
  let m = s.match(/^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)$/);
  if (m) return { rgb: [+m[1], +m[2], +m[3]], a: m[4] === undefined ? 1 : +m[4] };
  m = s.match(/^color\(srgb ([\d.e-]+) ([\d.e-]+) ([\d.e-]+)(?: \/ ([\d.]+))?\)$/);
  if (m) return { rgb: [+m[1] * 255, +m[2] * 255, +m[3] * 255], a: m[4] === undefined ? 1 : +m[4] };
  throw new Error(`unparsed colour ${s}`);
};
const over = (top, under) => top.rgb.map((c, i) => c * top.a + under[i] * (1 - top.a));
const lum = (rgb) => {
  const [r, g, b] = rgb.map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

for (const [name, vars] of Object.entries(THEMES)) {
  test(`a hidden camera's badge text and toggle icon stay readable in the ${name} theme`, async () => {
    const styles = await page.evaluate((vars) => {
      const read = (cameras) => {
        mount(cameras);
        for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
        el.hass = makeHass({ ...baseStates(), "switch.b_privacy": st("switch.b_privacy", "on") });
        return el.shadowRoot;
      };
      let root = read(["camera.b_hd_stream", "camera.c"]);
      const chip = root.querySelector(".chip.private");
      const badge = { text: getComputedStyle(chip.querySelector("span")).color, bg: getComputedStyle(chip).backgroundColor };
      root = read(["camera.b_hd_stream"]);
      const t = root.querySelector(".toggle.private");
      const toggle = { text: getComputedStyle(t.querySelector("ha-icon")).color, bg: getComputedStyle(t).backgroundColor };
      return { badge, toggle };
    }, vars);
    const card = parseColor(vars["--card-background-color"].replace(/^#(..)(..)(..)$/, (_, r, g, b) => `rgb(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)})`)).rgb;
    const ratio = ({ text, bg }) => {
      const back = over(parseColor(bg), card);
      return contrast(over(parseColor(text), back), back);
    };
    const badge = ratio(styles.badge);
    const toggle = ratio(styles.toggle);
    assert.ok(badge >= 4.5, `badge label ${badge.toFixed(2)}:1 < 4.5:1 (${JSON.stringify(styles.badge)})`);
    assert.ok(toggle >= 3, `toggle icon ${toggle.toFixed(2)}:1 < 3:1 (${JSON.stringify(styles.toggle)})`);
  });
}

// Narrow header (Sections view, 4 to 6 columns: about 160 to 250 px): the title keeps a few letters, and no
// badge, toggle or HD / SD switch sticks out of the card, with a long title and long badge names.
for (const width of [160, 245]) {
  test(`at ${width} px the header keeps its title readable and every control inside the card`, async () => {
    const r = await page.evaluate((width) => {
      const out = [];
      for (const language of ["en", "pl", "sr-Latn", "el", "bg", "ro"]) {
        for (const cameras of [
          [{ camera: "camera.b_hd_stream", name: "Living room camera by the window", privacy: "switch.b_privacy" }],
          [
            { camera: "camera.a_hd_stream", short_name: "Living room by the window", privacy: "switch.a_privacy" },
            { camera: "camera.b_hd_stream", short_name: "Garden and terrace", privacy: "switch.b_privacy" },
            "camera.c",
          ],
        ]) {
          document.body.replaceChildren();
          const box = document.createElement("div");
          box.style.width = `${width}px`;
          document.body.appendChild(box);
          const card = document.createElement("home-camera-card");
          card.setConfig({ cameras, language, title: cameras.length > 1 ? "Cameras of the house and garden" : undefined });
          box.appendChild(card);
          const states = baseStates();
          states["switch.a_privacy"] = st("switch.a_privacy", "off");
          card.hass = makeHass(states);
          const root = card.shadowRoot;
          // The stand-in ha-icon has no size of its own: give it Home Assistant's.
          for (const i of root.querySelectorAll("ha-icon"))
            Object.assign(i.style, { display: "inline-block", width: "var(--mdc-icon-size, 24px)", height: "var(--mdc-icon-size, 24px)" });
          const inner = root.querySelector(".head").getBoundingClientRect();
          const name = root.querySelector(".name");
          const outside = [...root.querySelectorAll(".head *")]
            .filter((n) => {
              const b = n.getBoundingClientRect();
              return b.width && (b.right > inner.right + 0.5 || b.left < inner.left - 0.5);
            })
            .map((n) => n.className || n.tagName);
          const ch = parseFloat(getComputedStyle(name).fontSize) * 0.5;
          out.push({ language, cameras: cameras.length, name: name.getBoundingClientRect().width, ch, outside });
        }
      }
      return out;
    }, width);
    for (const m of r) {
      const what = `${m.language}, ${m.cameras} camera(s)`;
      assert.ok(m.name >= 4 * m.ch, `${what}: title ${m.name.toFixed(1)} px, under 4 characters`);
      assert.deepEqual(m.outside, [], `${what}: outside the card`);
    }
  });
}

test("a header re-render gives the focus back without scrolling the page", async () => {
  const r = await page.evaluate(() => {
    document.body.replaceChildren();
    // The card below the fold, its badge focused, the page scrolled back to the top.
    const spacer = document.createElement("div");
    spacer.style.height = "3000px";
    document.body.appendChild(spacer);
    const card = document.createElement("home-camera-card");
    card.setConfig({ cameras: CAMS });
    document.body.appendChild(card);
    card.hass = makeHass(baseStates());
    card.shadowRoot.querySelector('.chip[data-toggle="switch.b_privacy"]').focus({ preventScroll: true });
    window.scrollTo(0, 0);
    const args = [];
    const focus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function (...a) {
      args.push(a[0] ?? null);
      return focus.apply(this, a);
    };
    try {
      // The switch turns on: the header is rebuilt and the new badge takes the focus back.
      const states = baseStates();
      states["switch.b_privacy"] = st("switch.b_privacy", "on");
      card.hass = makeHass(states);
    } finally {
      HTMLElement.prototype.focus = focus;
    }
    const active = card.shadowRoot.activeElement;
    return { args, scrollY: window.scrollY, toggle: active?.dataset?.toggle };
  });
  assert.equal(r.toggle, "switch.b_privacy");
  assert.deepEqual(r.args, [{ preventScroll: true }]);
  assert.equal(r.scrollY, 0);
});

// Six layouts, each with the card placed directly and wrapped in a <div> (as layout-card, button-card or a
// custom stack do): a parent sized by its content (inline-block, an auto grid column) must not fold the card,
// and two cards side by side in a 1fr 1fr grid (layout-card, grid card, horizontal-stack) must shrink to their
// half instead of overflowing it, at 320, 360 and 500 px.
test("in content-sized containers the card keeps a usable width, and in a 1fr 1fr grid it shrinks to its half", async () => {
  const r = await page.evaluate(() => {
    const out = [];
    for (const [name, css, width] of [
      ["inline-block", "display: inline-block", 0],
      ["grid auto", "display: grid; grid-template-columns: auto", 0],
      ["grid 1fr 1fr at 320 px", "display: grid; grid-template-columns: 1fr 1fr; gap: 8px", 320],
      ["grid 1fr 1fr at 360 px", "display: grid; grid-template-columns: 1fr 1fr; gap: 8px", 360],
      ["grid 1fr 1fr at 500 px", "display: grid; grid-template-columns: 1fr 1fr; gap: 8px", 500],
    ]) {
      for (const wrapped of [false, true]) {
        document.body.replaceChildren();
        const box = document.createElement("div");
        box.style.cssText = css;
        if (width) box.style.width = `${width}px`;
        document.body.appendChild(box);
        const cards = [];
        for (const cameras of width ? [CAMS, ["camera.c"]] : [CAMS]) {
          const card = document.createElement("home-camera-card");
          card.setConfig({ cameras });
          if (wrapped) {
            const div = document.createElement("div");
            div.appendChild(card);
            box.appendChild(div);
          } else box.appendChild(card);
          card.hass = makeHass(baseStates());
          // The stand-in ha-icon has no size of its own: give it Home Assistant's.
          for (const i of card.shadowRoot.querySelectorAll("ha-icon"))
            Object.assign(i.style, { display: "inline-block", width: "var(--mdc-icon-size, 24px)", height: "var(--mdc-icon-size, 24px)" });
          cards.push(card);
        }
        const outer = box.getBoundingClientRect();
        for (const card of cards) {
          const c = card.getBoundingClientRect();
          const tile = card.shadowRoot.querySelector(".tile").getBoundingClientRect();
          out.push({
            what: `${name}, ${wrapped ? "in a div" : "direct"}, ${card._config.cameras.length} camera(s)`,
            split: !!width,
            half: width ? (width - 8) / 2 : 0,
            card: c.width,
            overflow: Math.max(c.right - outer.right, 0),
            tile: tile.width,
            h: tile.height,
            tileOut: Math.max(tile.right - c.right, 0),
            // Content cut off by ha-card (overflow: hidden): its scroll width goes past its own.
            clipped: (() => {
              const ha = card.shadowRoot.querySelector("ha-card");
              return ha.scrollWidth - ha.clientWidth;
            })(),
          });
        }
      }
    }
    return out;
  });
  for (const m of r) {
    if (m.split) {
      assert.ok(Math.abs(m.card - m.half) < 1, `${m.what}: card ${m.card} px wide, its column ${m.half} px`);
      assert.ok(m.overflow < 0.5, `${m.what}: ${m.overflow} px past the grid`);
      assert.ok(m.tile > 0 && m.tileOut < 0.5, `${m.what}: tile ${m.tile} px, ${m.tileOut} px past the card`);
      assert.ok(m.clipped <= 0, `${m.what}: ${m.clipped} px of content cut off inside the card`);
    } else {
      assert.ok(m.card >= 240, `${m.what}: card ${m.card} px wide`);
      assert.ok(m.tile >= 200 && m.h >= 100, `${m.what}: tile ${m.tile} x ${m.h} px`);
    }
  }
});

// The header's text must not set the card's minimum width: `.name` and the badges are nowrap, and overflow: hidden
// does not lower an element's min-content width, so a long title, a single camera's long name or its privacy badge
// made the card refuse its half of a 1fr 1fr grid (layout-card) and run 35 to 395 px past it, placed directly or
// wrapped in a <div>. Each header ends with an ellipsis instead, and content-sized parents keep their width.
test("a long title, a single camera's long name or its privacy badge never widens the card past its grid column", async () => {
  const r = await page.evaluate(() => {
    const out = [];
    const configs = [
      ["long title", { title: "Cameras of the house and garden", cameras: [{ camera: "camera.a_hd_stream", short_name: "Living room by the window", privacy: "switch.b_privacy" }, "camera.b_hd_stream", "camera.c"] }],
      ["single camera, long name", { cameras: [{ camera: "camera.c", name: "Living room camera by the window", privacy: "switch.b_privacy" }] }],
      ["single camera, privacy off", { cameras: [{ camera: "camera.c", privacy: "switch.b_privacy" }] }],
      ["single camera, privacy unavailable", { cameras: [{ camera: "camera.c", privacy: "switch.u" }] }],
    ];
    for (const [name, css, width] of [
      ["inline-block", "display: inline-block", 0],
      ["grid auto", "display: grid; grid-template-columns: auto", 0],
      ["grid 1fr 1fr at 320 px", "display: grid; grid-template-columns: 1fr 1fr; gap: 8px", 320],
      ["grid 1fr 1fr at 360 px", "display: grid; grid-template-columns: 1fr 1fr; gap: 8px", 360],
      ["grid 1fr 1fr at 500 px", "display: grid; grid-template-columns: 1fr 1fr; gap: 8px", 500],
    ]) {
      for (const wrapped of [false, true]) {
        for (const [cfgName, cfg] of configs) {
          document.body.replaceChildren();
          const box = document.createElement("div");
          box.style.cssText = css;
          if (width) box.style.width = `${width}px`;
          document.body.appendChild(box);
          const cards = [];
          for (let i = 0; i < (width ? 2 : 1); i++) {
            const card = document.createElement("home-camera-card");
            card.setConfig(cfg);
            if (wrapped) {
              const div = document.createElement("div");
              div.appendChild(card);
              box.appendChild(div);
            } else box.appendChild(card);
            const states = baseStates();
            states["switch.u"] = st("switch.u", "unavailable");
            card.hass = makeHass(states);
            for (const ic of card.shadowRoot.querySelectorAll("ha-icon"))
              Object.assign(ic.style, { display: "inline-block", width: "var(--mdc-icon-size, 24px)", height: "var(--mdc-icon-size, 24px)" });
            cards.push(card);
          }
          const outer = box.getBoundingClientRect();
          for (const card of cards) {
            const c = card.getBoundingClientRect();
            const ha = card.shadowRoot.querySelector("ha-card");
            const head = card.shadowRoot.querySelector(".header").getBoundingClientRect();
            const title = card.shadowRoot.querySelector(".name");
            out.push({
              what: `${cfgName}, ${name}, ${wrapped ? "in a div" : "direct"}`,
              split: !!width,
              half: width ? (width - 8) / 2 : 0,
              card: c.width,
              overflow: Math.max(c.right - outer.right, 0),
              headOut: Math.max(head.right - c.right, 0),
              clipped: ha.scrollWidth - ha.clientWidth,
              title: title ? title.getBoundingClientRect().width : null,
            });
          }
        }
      }
    }
    return out;
  });
  assert.equal(r.length, 4 * (2 + 3 * 2) * 2);
  for (const m of r) {
    if (m.split) {
      assert.ok(Math.abs(m.card - m.half) < 1, `${m.what}: card ${m.card} px wide, its column ${m.half} px`);
      assert.ok(m.overflow < 0.5, `${m.what}: ${m.overflow} px past the grid`);
    } else assert.ok(m.card >= 240, `${m.what}: card ${m.card} px wide`);
    assert.ok(m.headOut < 0.5 && m.clipped <= 0, `${m.what}: header ${m.headOut} px past the card, ${m.clipped} px cut off`);
    // The title keeps a few letters (min-width: 4ch on .name, about 30 px at 16 px).
    if (m.title !== null) assert.ok(m.title >= 28, `${m.what}: title ${m.title} px`);
  }
});


test("players are emptied while the card is scrolled off screen and filled again when it comes back", async () => {
  const r = await page.evaluate(async () => {
    mount(CAMS);
    await frames();
    const shown = streams().map((s) => s.stateObj?.entity_id);
    el.style.display = "block";
    el.style.marginTop = "5000px";
    await frames();
    const paused = streams().every((s) => s.stateObj === undefined);
    // A state update while off screen does not bring the streams back.
    el.hass = makeHass(baseStates());
    const stillPaused = streams().every((s) => s.stateObj === undefined);
    el.style.marginTop = "";
    await frames();
    const resumed = streams().map((s) => s.stateObj?.entity_id);
    el.remove();
    return { shown, paused, stillPaused, resumed };
  });
  assert.deepEqual(r.shown, ["camera.a_hd_stream", "camera.b_hd_stream", "camera.c"]);
  assert.equal(r.paused, true);
  assert.equal(r.stillPaused, true);
  assert.deepEqual(r.resumed, r.shown);
});

test("a tile in the card's own fullscreen keeps playing while the card is off screen", async () => {
  const r = await page.evaluate(async () => {
    mount(CAMS);
    el._setPseudo(tiles()[0], true);
    el.style.display = "block";
    el.style.marginTop = "5000px";
    await frames();
    const out = streams().map((s) => s.stateObj?.entity_id);
    el._setPseudo(tiles()[0], false);
    el.remove();
    return out;
  });
  assert.deepEqual(r, ["camera.a_hd_stream", undefined, undefined]);
});

// The mini card, on the same cameras; camera.a has a snapshot URL, camera.b is hidden by its privacy switch.
const mountMini = (config = {}) =>
  page.evaluate((config) => {
    document.body.replaceChildren();
    const el = document.createElement("home-camera-mini-card");
    el.setConfig({ cameras: CAMS, ...config });
    document.body.appendChild(el);
    const states = baseStates();
    states["camera.a_sd_stream"].attributes = { entity_picture: "/api/camera_proxy/camera.a_sd_stream?token=abc" };
    states["switch.b_privacy"] = st("switch.b_privacy", "on");
    el.hass = makeHass(states);
    window.el = el;
    window.$ = (sel) => el.shadowRoot.querySelector(sel);
    window.$$ = (sel) => [...el.shadowRoot.querySelectorAll(sel)];
  }, config);

test("mini card: a snapshot per camera, no player, the header icon at 40px and a detail button", async () => {
  await mountMini();
  const r = await page.evaluate(() => {
    const thumbs = $$(".thumb");
    const icon = $(".hicon").getBoundingClientRect();
    return {
      mini: el.hasAttribute("mini") && $("ha-card").classList.contains("mini"),
      container: getComputedStyle($("ha-card")).containerType,
      players: $$("ha-camera-stream").length,
      // Snapshot URLs do not resolve on this test page: a failed load is covered by its own test.
      states: thumbs.map((t) => t.className.replace(" failed", "")),
      srcs: thumbs.map((t) => t.querySelector("img")?.getAttribute("src") ?? null),
      labels: thumbs.map((t) => t.querySelector(".text").textContent),
      icon: [icon.width, icon.height],
      zoom: $(".zoom")?.getAttribute("aria-label"),
      quality: !!$(".seg"),
      badges: !!$(".badges"),
      grid: el.getGridOptions(),
      size: el.getCardSize(),
      registered: window.customCards.some((c) => c.type === "home-camera-mini-card"),
    };
  });
  assert.equal(r.mini, true);
  assert.equal(r.container, "inline-size");
  assert.equal(r.players, 0);
  assert.deepEqual(r.states, ["thumb live", "thumb hidden", "thumb live"]);
  // The SD stream's snapshot when there is one; a hidden camera's snapshot is never fetched.
  assert.match(r.srcs[0], /^\/api\/camera_proxy\/camera\.a_sd_stream\?token=abc&_t=\d+$/);
  assert.equal(r.srcs[1], null);
  assert.match(r.srcs[2], /^\/api\/camera_proxy\/camera\.c\?_t=\d+$/);
  assert.deepEqual(r.labels, ["camera.a_hd_stream", "camera.b_hd_stream", "camera.c"]);
  assert.deepEqual(r.icon, [40, 40]);
  assert.equal(r.zoom, "Show the full card");
  assert.equal(r.quality, false);
  assert.equal(r.badges, false);
  assert.deepEqual(r.grid, { columns: 6, min_columns: 6, rows: "auto" });
  assert.equal(r.size, 3);
  assert.equal(r.registered, true);
});

test("mini card: the detail button opens the full card, a click outside folds it back", async () => {
  await mountMini();
  const r = await page.evaluate(() => {
    $(".zoom").click();
    const full = {
      players: $$("ha-camera-stream").length,
      thumbs: $$(".thumb").length,
      mini: $("ha-card").classList.contains("mini"),
      quality: !!$(".seg"),
      zoom: $(".zoom").getAttribute("aria-label"),
    };
    // Inside the card (a tile's button) or in a dialog opened from it: it stays open.
    $$(".tile")[0].querySelector('[data-action="ptz"]').click();
    const dialog = document.createElement("ha-dialog");
    document.body.appendChild(dialog);
    dialog.click();
    const stays = $$("ha-camera-stream").length;
    document.body.click();
    return { full, stays, folded: { players: $$("ha-camera-stream").length, thumbs: $$(".thumb").length, mini: $("ha-card").classList.contains("mini") } };
  });
  assert.deepEqual(r.full, { players: 2, thumbs: 0, mini: false, quality: true, zoom: "Back to the compact view" });
  assert.equal(r.stays, 2);
  assert.deepEqual(r.folded, { players: 0, thumbs: 3, mini: true });
});

test("mini card: a tap on a snapshot opens the full card; without the detail button it opens the camera's dialog", async () => {
  await mountMini();
  const opened = await page.evaluate(() => {
    $(".thumb").click();
    return $$("ha-camera-stream").length;
  });
  assert.equal(opened, 2);
  await mountMini({ zoom: false });
  const r = await page.evaluate(() => {
    const seen = [];
    el.addEventListener("hass-more-info", (ev) => seen.push(ev.detail.entityId));
    $$(".thumb")[2].click();
    return { button: !!$(".zoom"), seen, players: $$("ha-camera-stream").length };
  });
  assert.deepEqual(r, { button: false, seen: ["camera.c"], players: 0 });
});

test("mini card: snapshots stop refreshing while the page is hidden or the card off screen, and refresh on return", async () => {
  await mountMini();
  const r = await page.evaluate(async () => {
    await frames();
    const running = !!el._snapTimer;
    const before = $("img").getAttribute("src");
    const setVisibility = (v) => {
      Object.defineProperty(document, "visibilityState", { configurable: true, get: () => v });
      document.dispatchEvent(new Event("visibilitychange"));
    };
    setVisibility("hidden");
    const hidden = !!el._snapTimer;
    await new Promise((res) => setTimeout(res, 5));
    setVisibility("visible");
    const back = { timer: !!el._snapTimer, fresh: $("img").getAttribute("src") !== before };
    el.style.marginTop = "5000px";
    await frames();
    const offscreen = !!el._snapTimer;
    el.style.marginTop = "";
    await frames();
    const onscreen = !!el._snapTimer;
    el.remove();
    return { running, hidden, back, offscreen, onscreen, detached: !!el._snapTimer };
  });
  assert.deepEqual(r, { running: true, hidden: false, back: { timer: true, fresh: true }, offscreen: false, onscreen: true, detached: false });
});

test("motion badge: shown on a tile and its snapshot while a motion sensor of its device is on, and show_motion: false removes it", async () => {
  const r = await page.evaluate(() => {
    const withMotion = (on) => {
      const states = baseStates();
      states["binary_sensor.b_motion"] = st("binary_sensor.b_motion", on ? "on" : "off");
      const hass = makeHass(states);
      hass.entities["binary_sensor.b_motion"] = { entity_id: "binary_sensor.b_motion", device_id: "b" };
      return hass;
    };
    const shown = (node) => getComputedStyle(node.querySelector(".mot")).display !== "none";
    mount(CAMS);
    el.hass = withMotion(false);
    const start = window.__connects;
    const off = tiles().map(shown);
    el.hass = withMotion(true);
    const on = tiles().map(shown);
    const label = tiles()[1].querySelector(".mot").getAttribute("aria-label");
    const connects = window.__connects - start;
    el.setConfig({ cameras: CAMS, show_motion: false });
    const disabled = tiles().map(shown);

    document.body.replaceChildren();
    const mini = document.createElement("home-camera-mini-card");
    mini.setConfig({ cameras: CAMS });
    document.body.appendChild(mini);
    mini.hass = withMotion(true);
    const thumbs = [...mini.shadowRoot.querySelectorAll(".thumb")];
    const img = thumbs[1].querySelector("img");
    const thumbOn = thumbs.map(shown);
    mini.hass = withMotion(false);
    return { off, on, label, connects, disabled, thumbOn, thumbOff: thumbs.map(shown), sameImg: mini.shadowRoot.querySelectorAll(".thumb")[1].querySelector("img") === img };
  });
  assert.deepEqual(r.off, [false, false, false]);
  assert.deepEqual(r.on, [false, true, false]);
  assert.equal(r.label, "Motion detected");
  assert.equal(r.connects, 0);
  assert.deepEqual(r.disabled, [false, false, false]);
  assert.deepEqual(r.thumbOn, [false, true, false]);
  assert.deepEqual(r.thumbOff, [false, false, false]);
  // Toggled in place: the snapshot is not reloaded.
  assert.equal(r.sameImg, true);
});

test("HD / SD radio group: one tab stop, the arrow keys select the other option and move the focus", async () => {
  const r = await page.evaluate(() => {
    mount(CAMS);
    el._toggleQuality();
    if (!el._hd()) el._toggleQuality();
    const opt = (q) => el.shadowRoot.querySelector(`[data-quality="${q}"]`);
    const tabs = () => [opt("hd").tabIndex, opt("sd").tabIndex];
    const key = (k) => el.shadowRoot.activeElement.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, composed: true }));
    const start = tabs();
    opt("hd").focus();
    key("ArrowRight");
    const right = { focus: el.shadowRoot.activeElement?.dataset.quality, hd: el._hd(), tabs: tabs(), entity: streams()[0].stateObj?.entity_id };
    key("ArrowLeft");
    const left = { focus: el.shadowRoot.activeElement?.dataset.quality, hd: el._hd(), tabs: tabs() };
    return { start, right, left };
  });
  assert.deepEqual(r.start, [0, -1]);
  assert.deepEqual(r.right, { focus: "sd", hd: false, tabs: [-1, 0], entity: "camera.a_sd_stream" });
  assert.deepEqual(r.left, { focus: "hd", hd: true, tabs: [0, -1] });
});

test("mini card: a snapshot's accessible name says when its camera is hidden or offline", async () => {
  await mountMini();
  const r = await page.evaluate(() => {
    const states = baseStates();
    states["switch.b_privacy"] = st("switch.b_privacy", "on");
    states["camera.c"] = st("camera.c", "unavailable");
    el.hass = makeHass(states);
    return $$(".thumb").map((t) => t.getAttribute("aria-label"));
  });
  assert.deepEqual(r, ["camera.a_hd_stream", "camera.b_hd_stream: hidden", "camera.c: unavailable"]);
});

test("mini card: a snapshot that fails to load shows the offline look until one loads again", async () => {
  await mountMini();
  // Snapshot URLs do not resolve on this test page, so every live thumbnail's image fails to load.
  await page.waitForFunction(() => $$(".thumb.failed").length === 2);
  const r = await page.evaluate(() => {
    const thumb = $$(".thumb")[2];
    const look = () => ({
      cls: thumb.className,
      title: thumb.title,
      label: thumb.getAttribute("aria-label"),
      img: getComputedStyle(thumb.querySelector("img")).display,
      na: getComputedStyle(thumb.querySelector(".na")).display,
      mark: thumb.querySelector(".label").firstElementChild.outerHTML,
    });
    const failed = look();
    thumb.querySelector("img").dispatchEvent(new Event("load"));
    return { failed, loaded: look(), hiddenTitle: $$(".thumb")[1].title };
  });
  assert.deepEqual(r.failed, {
    cls: "thumb live failed",
    title: "Unavailable",
    label: "camera.c: unavailable",
    img: "none",
    na: "block",
    mark: '<ha-icon icon="mdi:cctv-off"></ha-icon>',
  });
  assert.deepEqual(r.loaded, {
    cls: "thumb live",
    title: "camera.c",
    label: "camera.c",
    img: "block",
    na: "none",
    mark: '<span class="dot"></span>',
  });
  // A tap on a hidden thumbnail opens the full card: its tooltip does not offer to show the camera.
  assert.equal(r.hiddenTitle, "camera.b_hd_stream: hidden");
});

test("the card's own fullscreen gives the page its previous overflow back on the way out", async () => {
  const r = await page.evaluate(() => {
    mount(CAMS);
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "scroll";
    const original = [Element.prototype.requestFullscreen, Element.prototype.webkitRequestFullscreen];
    Element.prototype.requestFullscreen = undefined;
    Element.prototype.webkitRequestFullscreen = undefined;
    const tile = tiles()[0];
    tile.querySelector(".open").click();
    const during = [document.documentElement.style.overflow, document.body.style.overflow];
    tile.querySelector(".open").click();
    const after = [document.documentElement.style.overflow, document.body.style.overflow];
    [Element.prototype.requestFullscreen, Element.prototype.webkitRequestFullscreen] = original;
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    return { during, after };
  });
  assert.deepEqual(r, { during: ["hidden", "hidden"], after: ["auto", "scroll"] });
});
