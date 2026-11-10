// Builds the integration's frontend files as the release ships them: the card and the panel are copied from
// custom_components/home_camera/frontend/ to dist/, and the card's translations are split out (English stays in
// the bundle, every other language goes to dist/home-camera-card.i18n.<lang>.js, scripts/i18n-split.mjs).
// The panel keeps every language: Home Assistant does not wait for a panel's language file as it does for a card.
// Usage: node scripts/build.mjs          → dist/ (browser tests, screenshots; not committed)
//        node scripts/build.mjs --into  → the same, then copied into custom_components/home_camera/frontend/ (release zip)
import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { splitDist } from "./i18n-split.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const source = `${root}custom_components/home_camera/frontend`;
const dist = `${root}dist`;
const { version } = JSON.parse(readFileSync(`${root}custom_components/home_camera/manifest.json`, "utf8"));

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
for (const file of readdirSync(source).filter((f) => f.endsWith(".js") && !f.includes(".i18n."))) {
  copyFileSync(`${source}/${file}`, `${dist}/${file}`);
}
splitDist(dist, "home-camera-card.js", { version });
const kb = (f) => `${(readFileSync(`${dist}/${f}`).length / 1024).toFixed(1)} KB`;
console.log(`Built dist/: ${readdirSync(dist).length} files, home-camera-card.js ${kb("home-camera-card.js")}`);

if (process.argv.includes("--into")) {
  for (const file of readdirSync(dist)) copyFileSync(`${dist}/${file}`, `${source}/${file}`);
  console.log("Copied into custom_components/home_camera/frontend/");
}
