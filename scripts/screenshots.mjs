// Renders the card with mock cameras and saves the README screenshots.
// Usage: npm install && npm run screenshots (CHROMIUM_PATH=... to use an installed Chromium)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as mdi from "@mdi/js";
import { chromium } from "playwright";

const root = fileURLToPath(new URL("..", import.meta.url));
const cardJs = readFileSync(`${root}dist/home-camera-card.js`, "utf8");

// Every mdi:* icon the card and the mock camera view use, as SVG paths for the <ha-icon> stand-in.
const icons = {};
for (const name of new Set([...cardJs.match(/mdi:[a-z0-9-]+/g), "mdi:cctv", "mdi:video", "mdi:filmstrip", "mdi:camera", "mdi:pan", "mdi:fullscreen"])) {
  const key = `mdi${name.slice(4).replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase())}`;
  if (mdi[key]) icons[name.slice(4)] = mdi[key];
}

const THEMES = {
  light: {
    "--primary-background-color": "#e8eaed", "--secondary-background-color": "#ececec", "--card-background-color": "#ffffff",
    "--primary-text-color": "#212121", "--secondary-text-color": "#727272", "--divider-color": "rgba(0,0,0,.12)",
  },
  dark: {
    "--primary-background-color": "#111111", "--secondary-background-color": "#282828", "--card-background-color": "#1c1c1c",
    "--primary-text-color": "#e1e1e1", "--secondary-text-color": "#9b9b9b", "--divider-color": "rgba(225,225,225,.12)",
  },
};
const COMMON = {
  "--primary-color": "#03a9f4", "--success-color": "#43a047", "--warning-color": "#ffa600", "--error-color": "#db4437",
  "--text-primary-color": "#ffffff",
};

// ha-card, ha-icon and a stand-in advanced-camera-card drawing one tile per camera.
const haElements = `
const ICONS = ${JSON.stringify(icons)};
customElements.define("ha-card", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML =
      "<style>:host{display:block;background:var(--card-background-color);border-radius:12px;" +
      "border:1px solid var(--divider-color);color:var(--primary-text-color);overflow:hidden}</style><slot></slot>";
  }
});
customElements.define("ha-icon", class extends HTMLElement {
  static get observedAttributes() { return ["icon"]; }
  connectedCallback() { this._draw(); }
  attributeChangedCallback() { this._draw(); }
  _draw() {
    const path = ICONS[(this.getAttribute("icon") || "").replace("mdi:", "")] || "";
    this.style.display = "inline-flex";
    this.innerHTML = '<svg viewBox="0 0 24 24" style="width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px);fill:currentColor"><path d="' + path + '"/></svg>';
  }
});
const SCENES = [
  "linear-gradient(160deg,#8d6e63 0%,#5d4037 55%,#3e2723 100%)",
  "linear-gradient(160deg,#90a4ae 0%,#546e7a 50%,#263238 100%)",
  "linear-gradient(160deg,#f8bbd0 0%,#ad7a99 50%,#4a3a48 100%)",
  "linear-gradient(160deg,#a5d6a7 0%,#558b2f 55%,#1b3a10 100%)",
  "linear-gradient(180deg,#81d4fa 0%,#b3e5fc 45%,#7cb342 46%,#33691e 100%)",
];
customElements.define("advanced-camera-card", class extends HTMLElement {
  setConfig(c) { this._c = c; }
  set hass(_) {}
  connectedCallback() {
    const c = this._c, cols = c.live.display.grid_columns;
    const tile = (cam, i) =>
      '<div style="position:relative;aspect-ratio:16/9;background:' + SCENES[i % SCENES.length] + '">' +
      '<span style="position:absolute;left:8px;bottom:6px;color:#fff;font:500 12px Roboto,sans-serif;text-shadow:0 1px 3px #000">' + cam.title + '</span>' +
      '<span style="position:absolute;right:8px;top:6px;color:#fff;font:600 9px Roboto,sans-serif;background:#db4437;padding:1px 5px;border-radius:4px">LIVE</span></div>';
    const menu = ["cctv", "video", "filmstrip", "camera", "pan", "fullscreen"].map((i) => '<ha-icon icon="mdi:' + i + '" style="--mdc-icon-size:18px"></ha-icon>').join("");
    this.innerHTML = '<div style="position:relative;border-radius:8px;overflow:hidden;background:#000">' +
      '<div style="display:grid;grid-template-columns:repeat(' + cols + ',1fr);gap:2px">' + c.cameras.map(tile).join("") + '</div>' +
      '<div style="position:absolute;left:6px;top:6px;display:flex;gap:6px;padding:4px 6px;border-radius:8px;background:rgba(0,0,0,.45);color:#fff">' + menu + '</div></div>';
  }
});
window.loadCardHelpers = async () => ({
  createCardElement(config) {
    const el = document.createElement(config.type.replace("custom:", ""));
    el.setConfig(config);
    return el;
  },
});`;

const pageHtml = (theme) => `<!doctype html><html><head><meta charset="utf-8">
<style>
  :root { ${Object.entries({ ...THEMES[theme], ...COMMON }).map(([k, v]) => `${k}:${v};`).join("")} }
  body { margin: 0; padding: 16px; background: var(--primary-background-color); color: var(--primary-text-color);
         font-family: Roboto, "Segoe UI", Helvetica, Arial, sans-serif; width: 460px; }
</style></head><body><div id="root"></div></body></html>`;

// Mock Tapo cameras: [key, name, short name, privacy on].
const CAMS = [
  ["living_room", "Living room", "Living", false],
  ["bedroom_parents", "Parents' bedroom", "Parents", true],
  ["kids_room", "Kids' room", "Kids", false],
  ["office", "Office", "Office", false],
];
const states = {}, entities = {};
const add = (entity_id, state, device_id, attributes = {}) => {
  states[entity_id] = { entity_id, state, attributes };
  entities[entity_id] = { entity_id, device_id };
};
for (const [key, name, , privacy] of CAMS) {
  add(`camera.${key}_hd_stream`, "streaming", key, { friendly_name: name });
  add(`camera.${key}_sd_stream`, "streaming", key, { friendly_name: name });
  add(`switch.${key}_privacy`, privacy ? "on" : "off", key);
  for (const d of ["left", "right", "up", "down"]) add(`button.${key}_move_${d}`, "unknown", key);
}
add("camera.terrace", "streaming", "terrace", { friendly_name: "Terrace" });
add("switch.terrace_camera_plug", "on", "plug");
add("input_select.camera_quality", "HD", null, { options: ["HD", "SD"] });

const config = {
  quality_entity: "input_select.camera_quality",
  cameras: [
    ...CAMS.map(([key, name, short]) => ({ camera: `camera.${key}_hd_stream`, name, short_name: short })),
    { camera: "camera.terrace", name: "Terrace", power: "switch.terrace_camera_plug" },
  ],
};

const SHOTS = [
  { file: "card", theme: "light", lang: "en" },
  { file: "card-dark", theme: "dark", lang: "en" },
];

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
// A fresh page per shot: re-running the scripts in the same realm would redeclare their globals.
for (const s of SHOTS) {
  const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 1000, height: 2000 } });
  page.on("pageerror", (err) => console.error(`pageerror (${s.file}): ${err.message}`));
  await page.setContent(pageHtml(s.theme));
  await page.addScriptTag({ content: haElements });
  await page.addScriptTag({ content: cardJs });
  await page.evaluate(({ config, hass }) => {
    const el = document.createElement("home-camera-card");
    el.setConfig({ type: "custom:home-camera-card", ...config });
    el.hass = { ...hass, callService: async () => {} };
    document.getElementById("root").appendChild(el);
  }, { config, hass: { states, entities, language: s.lang, locale: { language: s.lang }, themes: { darkMode: s.theme === "dark" } } });
  await page.waitForTimeout(400);
  // The card and a 16 px frame of the theme background around it.
  const box = await page.locator("#root").boundingBox();
  await page.screenshot({
    path: `${root}screenshots/${s.file}.png`,
    clip: { x: 0, y: 0, width: 460 + 32, height: Math.ceil(box.height) + 32 },
    animations: "disabled",
  });
  console.log(`screenshots/${s.file}.png`);
  await page.close();
}
await browser.close();
