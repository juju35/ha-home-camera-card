// Runs the built panel in Chromium with the built card and stand-ins for Home Assistant's elements and connection:
// the Cameras tab for every user, the Settings tab for administrators only, saving and copying from a dashboard.
// Usage: npm run test:browser (CHROMIUM_PATH=... to use an installed Chromium)
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const dist = (f) => readFileSync(fileURLToPath(new URL(`../../dist/${f}`, import.meta.url)), "utf8");
const cardJs = dist("home-camera-card.js");
const panelJs = dist("home-camera-panel.js");

const stubs = `
for (const tag of ["ha-card", "ha-icon", "ha-menu-button", "ha-circular-progress"]) customElements.define(tag, class extends HTMLElement {});
customElements.define("ha-camera-stream", class extends HTMLElement { static elementProperties = new Map([["hass", {}]]); });
// ha-form: keeps what it is given; window.formChange(value) plays a change made in the form.
customElements.define("ha-form", class extends HTMLElement {
  connectedCallback() { window.form = this; }
});
window.formChange = (value) => form.dispatchEvent(new CustomEvent("value-changed", { detail: { value } }));
window.sent = [];
window.makeHass = ({ admin, card, title = "" }) => {
  const listeners = [];
  window.push = (data) => listeners.forEach((cb) => cb(data));
  const settings = (c, t) => ({ configured: true, card: c, title: t, sidebar_title: t || "Cameras", default_title: "Cameras" });
  return {
    language: "en",
    user: { is_admin: admin },
    states: { "camera.a": { entity_id: "camera.a", state: "idle", attributes: {} }, "camera.b": { entity_id: "camera.b", state: "idle", attributes: {} } },
    entities: {},
    callService: () => {},
    connection: {
      subscribeMessage: (cb, msg) => {
        sent.push(msg);
        listeners.push(cb);
        setTimeout(() => cb(settings(card, title)));
        return Promise.resolve(() => {});
      },
    },
    callWS: async (msg) => {
      sent.push(msg);
      if (msg.type === "home_camera/update_settings") return settings(msg.card, msg.title);
      if (msg.type === "home_camera/discover") {
        return {
          cameras: [
            { camera: "camera.a", name: "Living room", area: "Living room", sd: null },
            { camera: "camera.b_hd_stream", name: "Kids", area: "Bedroom", sd: "camera.b_sd_stream" },
            { camera: "camera.c_hd_stream", name: "Office", area: null, sd: "camera.c_sd_stream" },
            { camera: "camera.d", name: "Terrace", area: null, sd: null },
          ],
        };
      }
      if (msg.type === "lovelace/dashboards/list") return [{ url_path: "dashboard-cameras", title: "Cameras", mode: "storage" }];
      if (msg.type === "lovelace/config" && msg.url_path === "dashboard-cameras") {
        return { views: [{ sections: [{ cards: [{ type: "custom:home-camera-card", cameras: ["camera.b"], grid_options: { columns: 36 } }] }] }] };
      }
      return { views: [] };
    },
  };
};
window.open = async (opts, path = "") => {
  document.body.replaceChildren();
  sent.length = 0;
  const el = document.createElement("home-camera-panel");
  el.panel = { url_path: "cameras", config: {} };
  el.route = { path };
  document.body.appendChild(el);
  el.hass = makeHass(opts);
  window.panel = el;
  await new Promise((r) => setTimeout(r, 50));
  return el;
};
window.$ = (sel) => panel.shadowRoot.querySelector(sel);
window.tabs = () => [...panel.shadowRoot.querySelectorAll(".tab")].map((t) => t.dataset.tab);
`;

let browser;
let page;

before(async () => {
  browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  page = await browser.newPage();
  await page.setContent("<!doctype html><html><body></body></html>");
  await page.addScriptTag({ content: stubs });
  await page.addScriptTag({ content: cardJs });
  await page.addScriptTag({ content: panelJs });
});

after(async () => {
  await browser?.close();
});

test("every user gets the cameras full page, without the Settings tab", async () => {
  const r = await page.evaluate(async () => {
    await open({ admin: false, card: { cameras: ["camera.a", "camera.b"] } });
    const card = $("#tab-cameras home-camera-card");
    return {
      subscribed: sent.some((m) => m.type === "home_camera/subscribe"),
      tabs: tabs(),
      tabsHidden: $(".tabs").hidden,
      settingsLink: !!$(".toolbar a"),
      tiles: card?.shadowRoot.querySelectorAll(".tile").length,
      wall: card?.hasAttribute("wall"),
    };
  });
  assert.deepEqual(r, { subscribed: true, tabs: ["cameras"], tabsHidden: true, settingsLink: false, tiles: 2, wall: true });
});

test("a user cannot open Settings from the address", async () => {
  const r = await page.evaluate(async () => {
    await open({ admin: false, card: { cameras: ["camera.a"] } }, "settings");
    return { cameras: !$("#tab-cameras").hidden, settings: !$("#tab-settings").hidden };
  });
  assert.deepEqual(r, { cameras: true, settings: false });
});

test("no camera yet: a user is told an administrator chooses them, an administrator gets a button", async () => {
  const r = await page.evaluate(async () => {
    await open({ admin: false, card: { cameras: [] } });
    const user = $("#tab-cameras .note").textContent;
    await open({ admin: true, card: { cameras: [] } });
    $("[data-choose]").click();
    return { user, adminTabs: tabs(), now: !$("#tab-settings").hidden };
  });
  assert.match(r.user, /an administrator chooses them/);
  assert.deepEqual(r.adminTabs, ["cameras", "settings"]);
  assert.equal(r.now, true);
});

test("new settings pushed by the server redraw the card, the same ones never do", async () => {
  const r = await page.evaluate(async () => {
    await open({ admin: false, card: { cameras: ["camera.a"] } });
    const card = $("#tab-cameras home-camera-card");
    const tile = card.shadowRoot.querySelector(".tile");
    const settings = (c) => ({ configured: true, card: c, title: "", sidebar_title: "Cameras", default_title: "Cameras" });
    push(settings({ cameras: ["camera.a"] }));
    const kept = card.shadowRoot.querySelector(".tile") === tile;
    push(settings({ cameras: ["camera.a", "camera.b"] }));
    return { kept, same: $("#tab-cameras home-camera-card") === card, tiles: card.shadowRoot.querySelectorAll(".tile").length };
  });
  assert.deepEqual(r, { kept: true, same: true, tiles: 2 });
});

test("an administrator edits the cameras and the title in Settings, then saves them", async () => {
  const r = await page.evaluate(async () => {
    await open({ admin: true, card: { cameras: ["camera.a"] } }, "settings");
    const before = { save: $("[data-save]").disabled, data: form.data.cameras };
    formChange({ cameras: [{ camera: "camera.a" }, { camera: "camera.b", name: "Garden" }] });
    const input = $("[data-title]");
    input.value = "Surveillance";
    input.dispatchEvent(new Event("input"));
    const dirty = { save: $("[data-save]").disabled, msg: $("[data-msg]").textContent };
    $("[data-save]").click();
    await new Promise((r) => setTimeout(r, 50));
    return { before, dirty, saved: sent.find((m) => m.type === "home_camera/update_settings"), msg: $("[data-msg]").textContent, toolbar: $(".toolbar .grow").textContent };
  });
  assert.deepEqual(r.before, { save: true, data: [{ camera: "camera.a" }] });
  assert.deepEqual(r.dirty, { save: false, msg: "Unsaved changes" });
  assert.deepEqual(r.saved, {
    type: "home_camera/update_settings",
    card: { cameras: ["camera.a", { camera: "camera.b", name: "Garden" }] },
    title: "Surveillance",
  });
  assert.equal(r.msg, "Saved");
  assert.equal(r.toolbar, "Surveillance");
});

test("Copy from a dashboard takes the first camera card, without its type or layout", async () => {
  const r = await page.evaluate(async () => {
    await open({ admin: true, card: { cameras: [] } }, "settings");
    $("[data-import]").click();
    await new Promise((r) => setTimeout(r, 50));
    return { msg: $("[data-msg]").textContent, data: form.data.cameras, save: $("[data-save]").disabled };
  });
  assert.match(r.msg, /copied from “Cameras”/);
  assert.deepEqual(r.data, [{ camera: "camera.b" }]);
  assert.equal(r.save, false);
});

test("Settings lists the cameras found that the panel does not show yet, and adds them", async () => {
  const r = await page.evaluate(async () => {
    // camera.a is shown; Office is listed through its SD stream
    await open({ admin: true, card: { cameras: ["camera.a", { camera: "camera.x", sd: "camera.c_sd_stream" }] } }, "settings");
    const names = () => [...panel.shadowRoot.querySelectorAll(".found .n")].map((n) => n.textContent);
    const first = { names: names(), sub: $(".found .s").textContent, addAll: !!$('[data-add=""]') };
    $('[data-add="camera.d"]').click();
    await new Promise((r) => setTimeout(r));
    const one = { names: names(), cameras: form.data.cameras.map((c) => c.camera), save: $("[data-save]").disabled };
    $('[data-add="camera.b_hd_stream"]').click();
    await new Promise((r) => setTimeout(r));
    return { first, one, all: { names: names(), msg: $("[data-msg]").textContent, none: $("[data-found] .msg").textContent }, cameras: form.data.cameras };
  });
  assert.deepEqual(r.first, { names: ["Kids", "Terrace"], sub: "Bedroom · camera.b_hd_stream · HD + SD", addAll: true });
  assert.deepEqual(r.one, { names: ["Kids"], cameras: ["camera.a", "camera.x", "camera.d"], save: false });
  assert.deepEqual(r.all, { names: [], msg: "Cameras added: 1. Save to keep them.", none: "Every camera found is already in the panel." });
  assert.deepEqual(r.cameras.at(-1), { camera: "camera.b_hd_stream", name: "Kids" });
});

test("Add all takes every camera found at once", async () => {
  const r = await page.evaluate(async () => {
    await open({ admin: true, card: { cameras: [] } }, "settings");
    $('[data-add=""]').click();
    await new Promise((r) => setTimeout(r));
    return { cameras: form.data.cameras.map((c) => c.camera), msg: $("[data-msg]").textContent };
  });
  assert.deepEqual(r.cameras, ["camera.a", "camera.b_hd_stream", "camera.c_hd_stream", "camera.d"]);
  assert.equal(r.msg, "Cameras added: 4. Save to keep them.");
});

test("on the wall, the column count is empty by default and 2 is kept when chosen", async () => {
  const r = await page.evaluate(async () => {
    await open({ admin: true, card: { cameras: ["camera.a", "camera.b"] } }, "settings");
    const before = form.data.columns;
    formChange({ cameras: [{ camera: "camera.a" }, { camera: "camera.b" }], columns: 2 });
    $("[data-save]").click();
    await new Promise((r) => setTimeout(r, 50));
    const saved = sent.find((m) => m.type === "home_camera/update_settings").card;
    const grid = $("#tab-cameras home-camera-card").shadowRoot.querySelector(".grid").style.gridTemplateColumns;
    return { before, saved, grid };
  });
  assert.equal(r.before, undefined);
  assert.deepEqual(r.saved, { cameras: ["camera.a", "camera.b"], columns: 2 });
  assert.equal(r.grid, "repeat(2, minmax(0px, 1fr))");
});
