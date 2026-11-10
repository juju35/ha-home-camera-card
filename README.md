# ha-camera

[![Marketplace](https://img.shields.io/badge/Marketplace-Custom-41BDF5.svg)](https://www.home-assistant.io/integrations/marketplace/)
[![HACS Validation](https://github.com/juju35/ha-camera/actions/workflows/hacs.yml/badge.svg)](https://github.com/juju35/ha-camera/actions/workflows/hacs.yml)
[![Validate](https://github.com/juju35/ha-camera/actions/workflows/validate.yml/badge.svg)](https://github.com/juju35/ha-camera/actions/workflows/validate.yml)
[![Lint](https://github.com/juju35/ha-camera/actions/workflows/lint.yml/badge.svg)](https://github.com/juju35/ha-camera/actions/workflows/lint.yml)
[![Release](https://img.shields.io/github/v/release/juju35/ha-camera)](https://github.com/juju35/ha-camera/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/juju35/ha-camera/blob/main/LICENSE)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/julienstep9)

<p align="center"><img src="https://raw.githubusercontent.com/juju35/ha-camera/main/custom_components/home_camera/brand/icon.png" alt="Home Camera" width="120"></p>

Home Assistant integration with a **Cameras sidebar panel for every user** — not only administrators — and the Lovelace cards behind it: **every home camera in one grid**, with a **privacy badge per camera**, an **HD / SD switch** and **PTZ controls**.

List the cameras, the cards find their privacy switch, SD stream and PTZ buttons by themselves.

> **Upgrading from ha-home-camera-card 3.x** (a Marketplace *Dashboard* repository): the repository is now an *Integration*. Remove the old Dashboard entry from the Marketplace, add this repository as an **Integration**, then add **Home Camera** in **Settings → Devices & services**. Your dashboards keep working: the cards keep their names (`custom:home-camera-card`, `custom:home-camera-mini-card`) and the integration replaces the old dashboard resource with its own.

[![Open your Home Assistant instance and open a repository inside the Marketplace.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/marketplace_repository/?owner=juju35&repository=ha-camera&category=integration)

| **Cameras panel** | **Cameras panel, dark** |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-camera/main/screenshots/panel.png" alt="Cameras sidebar panel with the camera grid full page" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-camera/main/screenshots/panel-dark.png" alt="Cameras sidebar panel with the camera grid full page, dark theme" width="400"> |
| **Light** | **Dark** |
| <img src="https://raw.githubusercontent.com/juju35/ha-camera/main/screenshots/card.png" alt="Camera card" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-camera/main/screenshots/card-dark.png" alt="Camera card, dark theme" width="400"> |
| **Pan & tilt** | **Pan & tilt, dark** |
| <img src="https://raw.githubusercontent.com/juju35/ha-camera/main/screenshots/card-ptz.png" alt="Camera card with the pan and tilt arrows" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-camera/main/screenshots/card-ptz-dark.png" alt="Camera card with the pan and tilt arrows, dark theme" width="400"> |
| **Single camera** | **Single camera, dark** |
| <img src="https://raw.githubusercontent.com/juju35/ha-camera/main/screenshots/card-single.png" alt="Camera card with a single camera" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-camera/main/screenshots/card-single-dark.png" alt="Camera card with a single camera, dark theme" width="400"> |
| **Every camera hidden** | **Every camera hidden, dark** |
| <img src="https://raw.githubusercontent.com/juju35/ha-camera/main/screenshots/card-hidden-light.png" alt="Camera card with every camera hidden" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-camera/main/screenshots/card-hidden.png" alt="Camera card with every camera hidden, dark theme" width="400"> |
| **Mini card** | **Mini card, dark** |
| <img src="https://raw.githubusercontent.com/juju35/ha-camera/main/screenshots/card-mini.png" alt="Camera mini card with a snapshot per camera" width="300"> | <img src="https://raw.githubusercontent.com/juju35/ha-camera/main/screenshots/card-mini-dark.png" alt="Camera mini card with a snapshot per camera, dark theme" width="300"> |
| **Fullscreen, pan & tilt** | **Fullscreen, pan & tilt, dark** |
| <img src="https://raw.githubusercontent.com/juju35/ha-camera/main/screenshots/card-fullscreen-light.png" alt="Fullscreen camera with the round pan and tilt pad" width="700"> | <img src="https://raw.githubusercontent.com/juju35/ha-camera/main/screenshots/card-fullscreen.png" alt="Fullscreen camera with the round pan and tilt pad, dark theme" width="700"> |

## Features

### Cameras panel

- **Cameras** in the sidebar for **every user** — family members without administrator rights included: a **video wall** edge to edge, with no card around it — a thin status bar (cameras live and hidden, privacy badges, HD / SD) over as many columns as the screen takes — and everything the card does (live streams, privacy badges, HD / SD, PTZ, fullscreen)
- **Settings** tab, for administrators only: the cameras and their options with the card's own visual editor, and the sidebar title (left empty: *Cameras* in the server's language)
- **Camera discovery**: a new entry starts with every camera of Home Assistant, and Settings lists the ones not shown yet, to **Add** one by one or **Add all**; a Tapo camera's two entities (`*_hd_stream`, `*_sd_stream`) count as one camera, whose SD stream the HD / SD switch picks
- **Copy from a dashboard**: takes the first camera card found on your dashboards, to move a cameras dashboard to the panel in one click
- Saved settings reach every open panel at once, on every device; the tab is in the address (`/cameras/settings`)

### Cards

- Header with the number of cameras live and hidden, and an **HD / SD** switch
- One badge per camera: a red live dot while it films, a green lock while it is hidden; tap to toggle its privacy switch (or its smart plug); greyed out, and ignoring taps, while that switch is unavailable (camera offline)
- Each image carries its name with a live dot; when every camera is hidden, a panel says how to bring one back
- **Motion badge**: a pulsing amber sensor icon on the image's name (and on the mini card's snapshot) while a motion, occupancy or person sensor of the camera's device is on
- A single camera: its name is the title, a round *Disable* / *Enable* icon button sits on the right and the HD / SD badge under the title
- Hidden cameras are removed from the grid: a camera is hidden when its **privacy switch is on** or its **power switch is off**
- **HD / SD** switch: from an `input_select` shared by every dashboard, or from the card itself (remembered by the browser)
- Live grid on Home Assistant's own player: WebRTC through go2rtc when available, else HLS or MJPEG — no other card to install
- **Tap a camera to put it fullscreen**, with a round pan & tilt pad at the bottom right; tap again or press Escape to come back (on iPhone, the card covers the screen itself)
- *Details* button on every tile for Home Assistant's camera dialog; **sound** button on streams that carry sound, for one camera at a time (the grid starts muted)
- **PTZ**: a button on the tile shows a round pad of four arrows in the corner of the image, light enough to see through; hold an arrow to keep moving, or use the arrow keys; arrows whose button is unavailable are greyed out
- Spinner until each camera's first frame; privacy badges spin until their switch answers
- Mouse: tile buttons show on hover; touch: always shown, with larger targets
- Hiding or showing a camera, or switching HD / SD, never reloads the streams of the other cameras
- Streams stop while the page is hidden (other tab, phone locked) or the card is scrolled off screen, and resume when it comes back
- **Mini card** (`home-camera-mini-card`): a snapshot of each camera with its name and status, refreshed every 10 seconds instead of a live stream; its detail button (top right) or a tap on a snapshot shows the full card, a click outside folds it back
- Automatic discovery on the camera's device: `switch.*_privacy`, `button.*_move_left/right/up/down`, the motion, occupancy and person `binary_sensor`s, and the `*_sd_stream` camera next to a `*_hd_stream` one (Tapo integration naming)
- Visual editor in the dashboard UI (no YAML needed)
- English, French, German, Spanish, Serbian (Cyrillic and Latin), Italian, Dutch, European Portuguese, Polish, Romanian, Danish, Swedish, Bulgarian, Russian, Ukrainian, Hungarian, Slovak, Czech, Slovenian, Latvian and Greek, follows the Home Assistant language
- Light and dark theme compatible
- Served by the integration and added to the dashboard resources by itself (loaded on every page when the resources are in YAML mode); each language other than English is a small file fetched when needed

## Prerequisites

- Home Assistant 2024.12 or later with `camera` entities (on older Home Assistant versions, the **Cameras** list of the visual editor falls back to a YAML editor — the card itself works the same)
- Optional: an `input_select` with the options `HD` and `SD` to share the quality between dashboards and devices

## Installation

### Via the Marketplace (recommended)

Click the button below to add the repository directly:

[![Add to the Marketplace](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/marketplace_repository/?owner=juju35&repository=ha-camera&category=integration)

Or manually:

1. Open **Settings → Marketplace → Add from link** (top right; this needs a GitHub account connected)
2. Add `https://github.com/juju35/ha-camera` — Type: **Integration**
3. Open **Home Camera** and click **Install**, then restart Home Assistant
4. **Settings → Devices & services → Add integration → Home Camera**

[![Add the integration](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=home_camera)

### Manual

1. Download `home_camera.zip` from the [latest release](https://github.com/juju35/ha-camera/releases/latest)
2. Unzip it into `/config/custom_components/home_camera/`
3. Restart Home Assistant and add **Home Camera** in **Settings → Devices & services**

The integration adds the **Cameras** panel to the sidebar and the cards to the dashboard resources: nothing to add by hand.

## Configuration

### Cameras panel

Open **Cameras** in the sidebar, then its **Settings** tab (administrators): the panel already shows every camera found when the integration was added; **Cameras found** lists the ones added to Home Assistant since (**Add**, **Add all**), the **Cameras** list edits them all — or **Copy from a dashboard** — then **Save**. The panel takes the same options as the card below; every user then sees the cameras in the panel.

### Visual editor

Add the card from the dashboard (**Add card → Home Camera Card**) and add the cameras in the **Cameras** list. Options left at their default are not written to the YAML.

### Minimal

```yaml
type: custom:home-camera-card
cameras:
  - camera.living_room_hd_stream
  - camera.bedroom_hd_stream
```

With the Tapo integration, each camera brings its SD stream, its privacy switch and its PTZ buttons on its own.

### Full options

```yaml
type: custom:home-camera-card
title: Cameras
icon: mdi:cctv
quality_entity: input_select.camera_quality
hd_option: HD
sd_option: SD
columns: 2
aspect_ratio: "16:9"
cameras:
  - camera: camera.living_room_hd_stream
    name: Living room
    short_name: Living
  - camera: camera.bedroom_parents_hd_stream
    name: Parents' bedroom
    short_name: Parents
    sd: camera.bedroom_parents_sd_stream
    privacy: switch.bedroom_parents_privacy
    ptz: button.bedroom_parents_move
    motion: binary_sensor.bedroom_parents_motion
  - camera: camera.terrace
    name: Terrace
    power: switch.terrace_camera_plug
    ptz: false
```

### Mini card

```yaml
type: custom:home-camera-mini-card
cameras:
  - camera.living_room_hd_stream
  - camera.bedroom_hd_stream
```

The mini card takes the same options as the full card, plus `zoom`. Its compact view shows the title with its status and a snapshot of each camera (the SD stream's when there is one; a hidden camera's snapshot is never fetched), refreshed every 10 seconds while the card is on screen in a visible page. The detail button at the top right, or a tap on a snapshot, switches it to the full card (live streams, privacy badges, HD / SD); a click outside the card brings the compact view back.

### Options reference

| Option | Required | Default | Description |
|---|---|---|---|
| `cameras` | ✅ | — | List of cameras, see below; a bare entity id is a camera with every option found automatically |
| `title` | ❌ | `Cameras` | Card title; with a single camera, its name |
| `icon` | ❌ | `mdi:cctv` | Icon next to the title |
| `quality_entity` | ❌ | — | `input_select` (or `select`) holding the quality; without it the card keeps its own choice in the browser |
| `hd_option` | ❌ | `HD` | Option of `quality_entity` meaning HD |
| `sd_option` | ❌ | `SD` | Option of `quality_entity` meaning SD |
| `layout` | ❌ | — | `wall`: the video wall of the Cameras panel — no card around the grid, a status bar instead of the header, as many columns as fit (unless `columns` is set) |
| `columns` | ❌ | `2` | Columns of the grid |
| `aspect_ratio` | ❌ | `16:9` | Shape of the tiles (`16:9`, `4:3`, `1:1`…); the image fills the tile |
| `show_summary` | ❌ | `true` | Summary line under the title |
| `show_badges` | ❌ | `true` | Privacy badges under the header |
| `show_motion` | ❌ | `true` | Motion badge on the images while a camera's motion sensor is on |
| `zoom` | ❌ | `true` | Mini card only: its detail button to the full card; with `false`, a tap on a snapshot opens the camera's dialog |
| `language` | ❌ | Auto | Force language: `en`, `fr`, `de`, `es`, `sr`, `sr-Latn`, `it`, `nl`, `pt`, `pl`, `ro`, `da`, `sv`, `bg`, `ru`, `uk`, `hu`, `sk`, `cs`, `sl`, `lv` or `el` (auto-detects from HA settings) |

**Camera options**

| Option | Description |
|---|---|
| `camera` | Camera entity, shown in HD |
| `name` | Name on the grid; defaults to the entity name |
| `short_name` | Name on the privacy badge; defaults to `name` |
| `sd` | Camera entity shown in SD; defaults to the `*_sd_stream` next to a `*_hd_stream` camera, else the HD one |
| `privacy` | Switch hiding the camera when **on**; defaults to the `switch.*_privacy` of the camera's device, `false` for none |
| `power` | Switch (smart plug) hiding the camera when **off** |
| `ptz` | PTZ buttons: a prefix (`button.x_move` → `button.x_move_left`, `_right`, `_up`, `_down`), an object `{left, right, up, down}`, or `false`; defaults to the `button.*_move_*` of the camera's device |
| `motion` | Motion sensor(s) behind the camera's motion badge: an entity id, a list, or `false` for none; defaults to the `binary_sensor`s of the camera's device whose device class is `motion`, `occupancy` or `presence`, or whose id contains `motion`, `occupancy` or `person` |

## Screenshots

The card animates in three places (all honour `prefers-reduced-motion`): the two below, and the motion badge, which pulses while a camera detects motion. While a camera is live, the red live dot breathes on the stream; it settles to a still card when the stream stops.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-camera/main/screenshots/live.gif" alt="live" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-camera/main/screenshots/live-dark.gif" alt="live dark" width="400"> |

While a tile is waiting for its first frame, a spinner turns over the stream.

| Light | Dark |
|---|---|
| <img src="https://raw.githubusercontent.com/juju35/ha-camera/main/screenshots/loading.gif" alt="loading" width="400"> | <img src="https://raw.githubusercontent.com/juju35/ha-camera/main/screenshots/loading-dark.gif" alt="loading dark" width="400"> |

The still states (the grid; pan & tilt; a single camera; every camera hidden; the mini card; fullscreen), each in light and dark, are shown at the [top of this page](#ha-camera).

## How it works

The card draws its own header, badges and tiles, and plays each camera with Home Assistant's `ha-camera-stream`, the player of the built-in camera cards and dialog: it picks WebRTC, HLS or MJPEG by itself, so go2rtc and the camera's own settings apply as everywhere else in Home Assistant. Tiles are kept between updates and only added or removed when a camera is shown or hidden, so the other streams keep playing. When the quality is SD, every camera that has an SD stream uses it.

Discovery looks at the entities of the camera's device in the entity registry. Anything set in the configuration wins over what is found.

## Development

```bash
npm install
npm run build        # copies the card and the panel into dist/ and splits the card's translations, as the release does
npm run check        # builds and checks the card and the panel (run in CI)
npm test             # unit tests
npm run test:browser # runs the built card and panel in Chromium with stand-ins for Home Assistant (run in CI)
npm run screenshots  # renders the card and the panel with mock cameras into screenshots/ (and the live/loading gifs, needs ffmpeg)
pip install -r requirements_test.txt && pytest  # the integration's tests
```

The sources of the card and the panel live in `custom_components/home_camera/frontend/` with every language; `dist/` is not committed.

### Releasing

1. Bump the version in `manifest.json`, `const.py`, the card (`HOME_CAMERA_CARD_VERSION`), the panel (`HOME_CAMERA_PANEL_VERSION`) and `package.json`
2. Add a `## <version>` section at the top of [CHANGELOG.md](https://github.com/juju35/ha-camera/blob/main/CHANGELOG.md)
3. Push to `main`: the **Release** workflow splits the card's translations, builds `home_camera.zip`, creates the tag and the GitHub release with the changelog section as notes

## Translations

The cards and the panel auto-detect the language from your Home Assistant settings. Currently supported:

| Language | Code |
|---|---|
| English | `en` |
| Français | `fr` |
| Deutsch | `de` |
| Español | `es` |
| Српски | `sr` |
| Srpski (latinica) | `sr-Latn` |
| Italiano | `it` |
| Nederlands | `nl` |
| Português (Portugal) | `pt` |
| Polski | `pl` |
| Română | `ro` |
| Dansk | `da` |
| Svenska | `sv` |
| Български | `bg` |
| Русский | `ru` |
| Українська | `uk` |
| Magyar | `hu` |
| Slovenčina | `sk` |
| Čeština | `cs` |
| Slovenščina | `sl` |
| Latviešu | `lv` |
| Ελληνικά | `el` |

Contributions for additional languages are welcome!

## License

[MIT](https://github.com/juju35/ha-camera/blob/main/LICENSE)

## Support

If you find this project useful, you can support its development:

<a href="https://buymeacoffee.com/julienstep9"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" height="50"></a>
