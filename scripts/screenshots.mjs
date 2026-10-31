// Renders the card with mock cameras and saves the README screenshots.
// Usage: npm install && npm run screenshots (CHROMIUM_PATH=... to use an installed Chromium)
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import * as mdi from "@mdi/js";
import { chromium } from "playwright";

const root = fileURLToPath(new URL("..", import.meta.url));
const cardJs = readFileSync(`${root}dist/home-camera-card.js`, "utf8");

// Every mdi:* icon the card and the mock camera view use, as SVG paths for the <ha-icon> stand-in.
const icons = {};
for (const name of new Set(cardJs.match(/mdi:[a-z0-9-]+/g))) {
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

// ha-card, ha-icon and a stand-in ha-camera-stream drawing a still scene per camera.
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
// Mock camera views: simple rooms in SVG (wall, floor, window light, furniture), seen from a ceiling corner.
const svg = (body) => 'url("data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice">' + body + '</svg>') + '")';
const room = (wall, floor, win, extra) =>
  '<defs><radialGradient id="v" cx="50%" cy="45%" r="75%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".45"/></radialGradient>' +
  '<linearGradient id="l" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>' +
  '<rect width="160" height="90" fill="' + wall + '"/><path d="M0 58 L160 50 L160 90 L0 90Z" fill="' + floor + '"/>' +
  '<rect x="18" y="12" width="34" height="30" rx="1" fill="' + win + '"/><path d="M18 42 L52 42 L96 72 L40 76Z" fill="url(#l)"/>' + extra +
  '<rect width="160" height="90" fill="url(#v)"/>';
const SCENES = [
  // Living room: sofa and low table.
  svg(room('#b9a48f', '#7d6450', '#f3eadb', '<rect x="92" y="40" width="54" height="20" rx="4" fill="#5b6b78"/><rect x="88" y="36" width="62" height="10" rx="4" fill="#4d5c68"/><rect x="70" y="62" width="34" height="5" rx="1" fill="#3f3027"/>')),
  // Kids' room: bed and rug.
  svg(room('#9fb3bf', '#c7b59c', '#eef4f7', '<rect x="86" y="44" width="62" height="18" rx="3" fill="#e9e3d6"/><rect x="86" y="40" width="16" height="10" rx="3" fill="#f6f1e8"/><ellipse cx="64" cy="72" rx="26" ry="7" fill="#d98c7a" opacity=".7"/>')),
  // Office: desk and screen.
  svg(room('#c9b8c6', '#8a7f86', '#f5eff4', '<rect x="84" y="46" width="56" height="4" fill="#3d3438"/><rect x="88" y="50" width="3" height="16" fill="#3d3438"/><rect x="133" y="50" width="3" height="16" fill="#3d3438"/><rect x="102" y="30" width="22" height="14" rx="1" fill="#2a2d33"/><rect x="104" y="32" width="18" height="10" fill="#6f8fb0"/>')),
  // Spare.
  svg(room('#a9b49a', '#6f6a57', '#eef2e6', '<rect x="96" y="38" width="40" height="26" rx="2" fill="#5d5242"/>')),
  // Terrace: sky, hedge, deck, chairs.
  svg('<defs><linearGradient id="s" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#8fbfe3"/><stop offset="1" stop-color="#d7e9f2"/></linearGradient>' +
    '<radialGradient id="v" cx="50%" cy="45%" r="75%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".4"/></radialGradient></defs>' +
    '<rect width="160" height="90" fill="url(#s)"/><path d="M0 40 Q20 30 40 38 T80 36 T120 34 T160 38 L160 56 L0 58Z" fill="#4f7d3a"/>' +
    '<path d="M0 58 L160 54 L160 90 L0 90Z" fill="#a9825c"/><g stroke="#8c6a48" stroke-width=".6"><path d="M0 64 L160 60"/><path d="M0 72 L160 68"/><path d="M0 81 L160 77"/></g>' +
    '<rect x="58" y="52" width="14" height="12" rx="1" fill="#e9e4da"/><rect x="88" y="52" width="14" height="12" rx="1" fill="#e9e4da"/><rect x="70" y="60" width="20" height="3" fill="#5c4a3a"/>' +
    '<rect width="160" height="90" fill="url(#v)"/>'),
];
// Each mock camera shows the room it is named after.
const SCENE_OF = { living_room: 0, kids_room: 1, office: 2, terrace: 4 };
customElements.define("ha-camera-stream", class extends HTMLElement {
  connectedCallback() { this.style.aspectRatio = "16 / 9"; this.style.maxHeight = "100vh"; this.style.maxWidth = "calc(100vh * 16 / 9)"; }
  get stateObj() { return this._st; }
  set stateObj(st) {
    this._st = st;
    const id = st ? st.entity_id.replace(/_(hd|sd)_stream$/, "") : "";
    const key = id.replace(/^camera[.]/, "");
    this.style.background = id ? SCENES[SCENE_OF[key] ?? 3] + " center / cover" : "";
    if (!id) return;
    // Like Home Assistant's players: first frame, then whether the stream carries sound (not the terrace).
    setTimeout(() => {
      const fire = (type, detail) => this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
      fire("load");
      fire("streams", { hasAudio: !id.includes("terrace"), hasVideo: true });
    });
  }
});
`;

// The card on the theme background, with a 16 px frame around it (the captured area).
const pageHtml = (theme, width) => `<!doctype html><html><head><meta charset="utf-8">
<style>
  :root { ${Object.entries({ ...THEMES[theme], ...COMMON }).map(([k, v]) => `${k}:${v};`).join("")} }
  body { margin: 0; padding: 16px; background: var(--primary-background-color); color: var(--primary-text-color);
         font-family: Roboto, "Segoe UI", Helvetica, Arial, sans-serif; width: ${width}px; }
  /* Fullscreen shot: the screen is the framed box (a transform makes it the tile's fixed-position container). */
  #root.screen { height: ${Math.round((width * 9) / 16)}px; transform: translateZ(0); overflow: hidden; }
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

// All in English, card 460 px wide. The mouse rests on a tile (its buttons only show on hover).
// Every shot comes as a light / dark pair of the exact same state: only the theme changes.
const SHOTS = [
  { file: "card", theme: "light", lang: "en", hover: 0 },
  { file: "card-dark", theme: "dark", lang: "en", hover: 0 },
  // The pan & tilt arrows open on the first camera.
  { file: "card-ptz", theme: "light", lang: "en", ptz: true },
  { file: "card-ptz-dark", theme: "dark", lang: "en", ptz: true },
  // A single camera: its name as the title, the privacy toggle on the right.
  { file: "card-single", theme: "light", lang: "en", config: { cameras: [{ camera: "camera.kids_room_hd_stream", name: "Kids' room" }] } },
  { file: "card-single-dark", theme: "dark", lang: "en", config: { cameras: [{ camera: "camera.kids_room_hd_stream", name: "Kids' room" }] } },
  // Every camera hidden.
  { file: "card-hidden", theme: "dark", lang: "en", hidden: true },
  { file: "card-hidden-light", theme: "light", lang: "en", hidden: true },
  // Fullscreen on the first camera, with its pan & tilt arrows: a 1280 x 720 screen in the frame.
  { file: "card-fullscreen", theme: "dark", lang: "en", fullscreen: 0, width: 1280 },
  { file: "card-fullscreen-light", theme: "light", lang: "en", fullscreen: 0, width: 1280 },
];

// Mount the card for one shot on a fresh page and return it (shared by the stills and the GIF).
async function openCard(browser, s) {
  const width = s.width || 460;
  // The fullscreen shot stays at 1.5x: a 1280 px screen needs no more to be sharp in the README.
  const page = await browser.newPage({ deviceScaleFactor: s.fullscreen !== undefined ? 1.5 : 2, viewport: { width: Math.max(1000, width + 32), height: 2000 } });
  page.on("pageerror", (err) => console.error(`pageerror (${s.file}): ${err.message}`));
  page.on("console", (msg) => msg.type() === "error" && console.error(`console (${s.file}): ${msg.text()}`));
  // A frozen clock, installed and paused before the content so no timer escapes it, holds every tile in
  // its loading state: the stand-in's setTimeout("load") never fires, so the hc-spin spinner keeps
  // running. install() alone only fakes the clock, which keeps ticking in real time: the timer fired and
  // the tiles loaded before the first frame. CSS animations run on the document timeline, not this clock.
  if (s.freezeClock) {
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(1000);
  }
  await page.setContent(pageHtml(s.theme, width));
  await page.addScriptTag({ content: haElements });
  await page.addScriptTag({ content: cardJs });
  const shotStates = s.hidden
    ? Object.fromEntries(Object.entries(states).map(([k, v]) => [k, k.endsWith("_privacy") ? { ...v, state: "on" } : k.endsWith("_plug") ? { ...v, state: "off" } : v]))
    : states;
  await page.evaluate(({ config, hass }) => {
    const el = document.createElement("home-camera-card");
    el.setConfig({ type: "custom:home-camera-card", ...config });
    el.hass = { ...hass, callService: async () => {} };
    document.getElementById("root").appendChild(el);
  }, { config: s.config || config, hass: { states: shotStates, entities, language: s.lang, locale: { language: s.lang }, themes: { darkMode: s.theme === "dark" } } });
  return page;
}

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
// A fresh page per shot: re-running the scripts in the same realm would redeclare their globals.
for (const s of SHOTS) {
  const width = s.width || 460;
  const page = await openCard(browser, s);
  await page.waitForTimeout(100);
  const tile = (i) => page.locator("home-camera-card .tile").nth(i);
  if (s.ptz) await tile(0).locator(".btn.ptz").click();
  if (s.hover !== undefined) await tile(s.hover).hover();
  // The card's own fullscreen (what a headless browser can show): same look as the browser's.
  if (s.fullscreen !== undefined) {
    await page.evaluate(() => document.getElementById("root").classList.add("screen"));
    await page.evaluate((i) => {
      const el = document.querySelector("home-camera-card");
      el._setPseudo(el.shadowRoot.querySelectorAll(".tile")[i], true);
    }, s.fullscreen);
    await tile(s.fullscreen).hover();
  }
  await page.waitForTimeout(400);
  // The card (or the screen) and the 16 px frame of theme background around it.
  const box = await page.locator("#root").boundingBox();
  await page.screenshot({
    path: `${root}screenshots/${s.file}.png`,
    clip: { x: 0, y: 0, width: width + 32, height: Math.ceil(box.height) + 32 },
    animations: "disabled",
  });
  console.log(`screenshots/${s.file}.png`);
  await page.close();
}

// A looping GIF of the card's animations. Needs ffmpeg on PATH. Every animation is paused and stepped
// frame by frame, so the GIF is identical whatever the machine's speed. With freezeClock a tile stays
// loading, so hc-spin keeps spinning; without it the stream loads and hc-live breathes on it.
async function makeGif(browser, gif, { fps = 20, seconds = 3, freezeClock = false } = {}) {
  const page = await openCard(browser, { ...gif, freezeClock });
  await page.waitForTimeout(300);
  const box = await page.locator("#root").boundingBox();
  const clip = { x: 0, y: 0, width: gif.width + 32, height: Math.ceil(box.height) + 32 };
  const dir = mkdtempSync(join(tmpdir(), "hc-frames-"));
  const frames = Math.round(fps * seconds);
  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = t; } }, (i * 1000) / fps);
    await page.screenshot({ path: join(dir, `f${String(i).padStart(3, "0")}.png`), clip });
  }
  await page.close();
  const out = `${root}screenshots/${gif.file}.gif`;
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-framerate", String(fps), "-i", join(dir, "f%03d.png"),
    "-vf", `scale=${clip.width}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=4`,
    "-loop", "0", out,
  ]);
  rmSync(dir, { recursive: true });
  console.log(`screenshots/${gif.file}.gif`);
}

// Each animation is rendered twice, light then dark (X-dark.gif), with the exact same setup.
// live: the breathing red live dot on a streaming camera (hc-live).
await makeGif(browser, { file: "live", theme: "light", lang: "en", hover: 0, width: 460 });
await makeGif(browser, { file: "live-dark", theme: "dark", lang: "en", hover: 0, width: 460 });
// loading: the same card with the clock frozen, so a tile never gets its first frame and the hc-spin
// spinner runs. 2.4 s loops both hc-spin (0.8 s) and the live dot's hc-live (2.4 s) seamlessly.
await makeGif(browser, { file: "loading", theme: "light", lang: "en", width: 460 }, { freezeClock: true, seconds: 2.4 });
await makeGif(browser, { file: "loading-dark", theme: "dark", lang: "en", width: 460 }, { freezeClock: true, seconds: 2.4 });
await browser.close();
