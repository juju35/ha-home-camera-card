# Changelog

## 4.4.2 - 2026-11-12

### Fixes
- Cameras without a live stream (HomeKit cameras, a Tapo in privacy mode…) show in Safari: Home Assistant's player gave them an MJPEG image that Safari left broken, with the spinner turning forever. The card now shows their still, refreshed about every second (the next one asked once the previous one has loaded), in every browser; it stops while the page is hidden or the card off screen.

## 4.4.1 - 2026-11-11

### Improvements
- WebRTC tiles show the camera's last still at once, while the session starts (connection to the camera, then its first keyframe), instead of a black frame.

## 4.4.0 - 2026-11-11

### Improvements
- Lower latency and steadier streams: a camera that offers WebRTC (go2rtc) plays it alone, one RTSP session per camera, instead of Home Assistant's player starting HLS next to it. Cameras that allow few sessions (Tapo…) dropped one, go2rtc kept reconnecting and the player could fall back to HLS, seconds behind. Home Assistant's player stays for the other cameras, for privacy mode (its still) and when a WebRTC session brings no video.

## 4.3.3 - 2026-11-11

### Fixes
- Sound button on cameras whose audio only WebRTC plays (G.711, such as Tapo C2xx cameras), now for good: it shows as soon as Home Assistant says the camera can play WebRTC, whichever player is shown first, instead of waiting for the WebRTC player to be the one shown. Turning the sound on starts a new session, in which the player picks WebRTC with its sound.

## 4.3.2 - 2026-11-11

### Fixes
- Sound on cameras whose audio only WebRTC plays (G.711, such as Tapo C2xx cameras): Home Assistant's WebRTC player drops the sound of a muted session, so their stream always said it had none and the sound button never showed. A WebRTC stream now gets the button, and turning the sound on starts a new session that keeps it.
- A camera switching its stream itself (Tapo Cameras' HD / SD) really plays the new stream: the player is emptied, then given the camera again once it has rendered without it, which is what makes it start a new session.

## 4.3.1 - 2026-11-11

### Fixes
- Tapo Cameras (ha-tapo): pan and tilt, the privacy badge and the HD / SD switch now work when its entities are named in another language than English (`button.salon_gauche` for the move_left button, for instance). The card looks for them by translation key on the camera's device, not only by the end of their entity id, and finds each pan and tilt direction on its own. Its motion badge follows the camera's motion and person detections only (not its vehicle, pet or line-crossing ones).
- Camera discovery fills in the controls found on each camera's device — privacy switch, pan and tilt buttons, motion and person sensors — so a camera added from **Cameras found** (or a new entry) shows them in the editor.

## 4.3.0 - 2026-11-11

### What's new
- **Tapo Cameras (ha-tapo) support**: its single camera entity per camera is found with its privacy switch (`switch.*_privacy_mode`), its PTZ buttons and its detections. The HD / SD switch sets each camera's own **Stream quality** select (`hd` / `sd`) — and the shared `quality_entity` when there is one — and shows what those selects say when there is no `quality_entity`. When a camera's stream changes, its player plays again so it picks the new stream up.
- README: a **Supported integrations** section (Tapo Cameras, Tapo: Cameras Control).

## 4.2.1 - 2026-11-11

### Fixes
- Cameras panel: the column count chosen in Settings is applied. The editor took 2 for the default and dropped it when saved, so the wall fell back to as many columns as fit; on the wall the field now starts empty (as many as fit) and keeps any count chosen, 2 included. A count of 2 saved before this version has to be chosen again.

## 4.2.0 - 2026-11-10

### What's new
- **Video wall in the Cameras panel**: no card around the cameras any more. A thin status bar (cameras live and hidden, privacy badges, HD / SD) sits over a grid edge to edge, with as many columns as the width takes (tiles of at least 360 px, one per row on a phone).
- New card option `layout: wall`, the same look on a dashboard (a panel view, for instance); `columns` still sets the number of columns when given.

## 4.1.0 - 2026-11-10

### What's new
- **Camera discovery**: a new entry starts with every camera of Home Assistant, and the panel's Settings tab lists the cameras it does not show yet (**Add** one, or **Add all**). One entry per camera, not per stream: Tapo's two camera entities (`*_hd_stream` and `*_sd_stream`, no quality selector) count as one camera shown in HD, its SD stream being picked by the HD / SD switch. Cameras are named after their device, sorted by area; disabled and hidden ones are left out.

## 4.0.0 - 2026-11-10

The repository becomes **ha-camera**, a Home Assistant integration (`home_camera`) carrying the cards and a sidebar panel.

### What's new
- **Cameras panel** in the sidebar, open to **every user**, not only administrators: the camera grid full page, as the cameras dashboard showed it, with live streams, privacy badges, HD / SD, PTZ and fullscreen.
- **Settings** tab for administrators: the cameras with the card's visual editor, the sidebar title (empty: *Cameras* in the server's language), and **Copy from a dashboard** to take over an existing camera card. Saved settings reach every open panel at once.
- The integration serves the cards and adds them to the dashboard resources by itself (on every page when the resources are in YAML mode), replacing the resource of the former Marketplace dashboard card.

### Breaking changes
- The Marketplace repository type is now **Integration** (it was **Dashboard**): remove the old entry, add `https://github.com/juju35/ha-camera` as an Integration, restart and add **Home Camera** in **Settings → Devices & services**. Dashboards keep their `custom:home-camera-card` and `custom:home-camera-mini-card` cards unchanged.
- The release ships `home_camera.zip` instead of the card's `.js` files.

### Maintenance
- The card's source moves from `src/` to `custom_components/home_camera/frontend/`; `scripts/build.mjs` builds the card and the panel into `dist/` as the release ships them.
- CI: Hassfest, the integration's pytest suite, Ruff and Vulture join the existing checks; HACS validation as an integration.

## 3.8.1 - 2026-11-09

### Fixes
- Translations: the cards are defined once the page's language file has arrived (at most 1.5 s; Home Assistant builds a card when its element gets defined), so the first render is already translated instead of English then redrawn; until a language file is in, a missing text reads the English one wherever the card has no fallback of its own.

## 3.8.0 - 2026-11-09

### Performance
- **Translations load on demand**: the bundle keeps English only (120 KB → 78 KB) and each other language is its own `home-camera-card.i18n.<lang>.js` file next to it, fetched the first time a card needs it. Home Assistant loads every dashboard resource on every dashboard, so each page used to download and parse all 22 languages to use one. Until a language file has arrived (a few milliseconds), texts fall back to English, and the cards redraw once it is there.

### Maintenance
- Build: `scripts/i18n-split.mjs` splits the built bundle and rebuilds every table from the split files to check them (the build fails on any difference); `src/` keeps every language as before.
- Release: every file of `dist/` is attached. Manual installation copies the translation files too.

## 3.7.1 - 2026-11-08
### Fixes
- On the mini card, a snapshot that fails to load shows the offline look instead of a broken image, until a snapshot loads again.
- On the mini card, a hidden camera's tooltip no longer says a tap shows it: a tap opens the full card.

## 3.7.0 - 2026-11-07
### What's new
- Motion badge: a pulsing amber icon on a camera's image, and on its mini card snapshot, while a motion, occupancy or person sensor of its device is on (`show_motion: false` removes it, a camera's `motion` option picks its sensors).
- The HD / SD switch is a single stop for the Tab key, and the arrow keys move between HD and SD.
- On the mini card, a screen reader says when a snapshot's camera is hidden or offline, not only its name.

### Fixes
- Leaving the card's own fullscreen (iPhone) gives the page back the scrolling it had before, instead of clearing it.

## 3.6.0 - 2026-11-07
### What's new
- New mini card (`custom:home-camera-mini-card`): a snapshot of each camera with its name and status, refreshed every 10 seconds; its detail button or a tap on a snapshot shows the full card, and a click outside brings the compact view back.
- Streams and snapshot refreshes now also stop while the card is scrolled off screen, and resume when it comes back into view.

## 3.5.10 - 2026-11-04

### Documentation
- README: images and links use absolute URLs, so the screenshots, icons, badges and links display in HACS (relative paths broke there).
- README: screenshots get a display size, so cards no longer show oversized in HACS and on GitHub.

## 3.5.9 - 2026-11-04
### Fixes
- In fullscreen, a camera without pan & tilt no longer shows an empty round pad in the bottom right corner.

## 3.5.8 - 2026-11-04
### What's new
- Added Romanian, Danish, Swedish, Bulgarian, Russian, Ukrainian, Hungarian, Slovak, Czech, Slovenian, Latvian and Greek translations: the card and its visual editor (including the language selector).

## 3.5.7 - 2026-11-01
### Fixes
- Serbian: the header now counts 2 to 4 cameras correctly ("Kamere uživo: 3 · Skrivene: 2" instead of "3 kamera uživo · 2 skrivenih").
- A camera whose privacy switch (or power switch) is unavailable, for example a camera gone offline, no longer shows a "visible, tap to hide it" badge that spins for 15 seconds when tapped: the badge is greyed out, says the switch is unavailable, and ignores taps until the switch is back.
- On a narrow card (half the width of a Sections view, or a narrow column), the title keeps a few letters instead of disappearing, the HD / SD switch moves under it instead of being cut off, and long badge names end with an ellipsis instead of running out of the card.
- Toggling HD / SD or a privacy badge with the keyboard no longer scrolls the page back to the card when Home Assistant updates it: the focus returns to the control without moving the page.
- In a container that sizes itself to its content (a custom layout card, an `auto` grid column), the card no longer folds to a thin strip: its images keep a usable width.
- Two cards side by side in a custom layout (for example a layout card with two equal columns) now each keep to their half, even with a long title, a single camera's long name or its privacy badge: the text ends with an ellipsis instead of pushing the card out of its column.

## 3.5.6 - 2026-11-01
### What's new
- Added Italian, Dutch, European Portuguese and Polish translations: the card and its visual editor (including the language selector). Brazilian Portuguese (`pt-BR`) falls back to European Portuguese.

## 3.5.5 - 2026-11-01
### What's new
- Serbian translations, in Cyrillic (`sr`) and Latin (`sr-Latn`) script: the card and its visual editor (including the language selector). Serbian translations by @cpmarexel2f (#28).

### Fixes
- Language detection now uses the full language tag when the card has it (`sr-Latn`), then the part before the dash (`fr-FR` gives French), then English, in both the card and the visual editor.

## 3.5.4 - 2026-11-01
### Fixes
- The green "hidden" badges, and the lock of a single hidden camera, are easier to read in the light theme: their text and icon now use a deeper green (a lighter one in the dark theme), while the badge keeps its green tint.

## 3.5.3 - 2026-10-29
### Fixes
- An entry without a camera entity (for example a mistyped `entity_id:` key) no longer counts as a camera: with one real camera left, its image says "Live" like the title already showed, and once it is hidden the panel says "Enable the camera to see it here" instead of pointing to badges that are not shown. A card whose entries have no camera at all shows "No camera configured".

## 3.5.2 - 2026-10-29
### Fixes
- A camera with both a privacy switch and a `power` switch can be turned back on from the card again: while its power is off, the badge (and the single-camera toggle) switches the power on instead of the privacy switch, which could not bring the camera back and is usually unavailable with the power cut.

## 3.5.1 - 2026-10-29
### Fixes
- The dashboard no longer stays unscrollable when a camera shown in the card's own fullscreen (iPhone) is hidden from elsewhere, or when the card's configuration changes.
- A held pan & tilt arrow no longer keeps turning the camera when the arrows are redrawn under the finger (the stream reports its sound, fullscreen changes) or the tile goes away.
- Camera streams that failed to load are retried on the next Home Assistant update, instead of spinning until the grid changes.
- A refused privacy toggle (non-admin user, removed entity) stops the badge spinner at once instead of after 15 s; refused pan & tilt and HD / SD calls no longer raise errors in the console.
- German: "Badge" instead of "Abzeichen", and "Nach links / rechts / oben / unten" for the pan & tilt arrows.
- The visual editor follows the page language when Home Assistant does not give one, like the card.

### Maintenance
- CI: fork-safe checkout in the Screenshots workflow, time-boxed and retried Chromium system deps in Validate and Release (failing explicitly after three attempts), browser tests run before a release, Playwright floor aligned with the lockfile. After pushing refreshed screenshots onto a pull request, the Screenshots workflow re-runs Lint, Validate and HACS on that commit (via `workflow_dispatch`, since a `GITHUB_TOKEN` push does not trigger them).

## 3.5.0 - 2026-10-28
### What's new
- German and Spanish translations: the card and its visual editor (including the language selector) now support `de` and `es`, alongside English and French.

## 3.4.1 - 2026-10-28
### Fixes
- Camera streams no longer stay blank for the rest of the session when Home Assistant's player fails to load: loading now gives up after 15 s (or at once when the card helpers are missing) and is retried on the next render.
- *Details* opens the main camera's dialog while in SD, instead of the `*_sd_stream` entity's.
- The keyboard focus stays on the HD / SD switch or the privacy badge that held it when the header re-renders.
- The card's own fullscreen (iPhone) locks the page scroll behind the tile and releases it on exit.
- Fewer updates: the tiles are no longer synced twice after a grid re-render, and cameras without PTZ skip the pan & tilt sync.

### Maintenance
- README: live and loading animation GIFs, Lint badge, duplicated screenshot table removed, current HACS custom-repository wording, note that the visual editor's Cameras form needs a recent Home Assistant (older versions fall back to YAML for that list).
- CI: hardened apt handling in the Screenshots workflow, screenshot commits guarded against forks and manual runs, release gated on build and tests, unused ruff tooling removed, Dependabot covers npm devDependencies.

## 3.4.0 - 2026-10-26
### Fixes
- Privacy badge timers are now cleared when the card is removed from the DOM. Toggling a privacy badge arms a 15 s timer (`HC_PENDING_MS`) that calls `_update()` if the switch does not answer; this timer was never cancelled in `disconnectedCallback`. If the card left the DOM (view change, dashboard edit) while a switch was still pending, the timer survived and fired `_update()` on a detached element. `disconnectedCallback` now cancels these timers and clears `_pending`, as it already does for PTZ repeat and fullscreen.

## 3.3.0
### Changes
- Header icon: a round badge drawn like the other ha-* cards (16 % tint of its colour, icon centred at 24 px).
- Header spacing like the other cards: the camera badges and the camera view start 8 px under the header (were 10 px and 12 px). With a single camera, the header icon and the toggle sit 12 px from the top of the card instead of being pushed down by the HD / SD switch under the title.
- Green badges and the single camera's green toggle use the shared 16 % tint, 24 % on hover.
- Buttons and arrows on the images: when on (pan & tilt open, sound on) or pressed, they keep the smoked glass and show their icon in the accent colour with a faint accent ring, instead of a solid accent fill.

### Maintenance
- Screenshots: 16 px frame on the theme background, shared theme tokens and card border, 460 px card (the fullscreen view stays a 1280 × 720 screen, now framed too), page errors logged. Nothing changes for users.

## 3.2.1

### Fixes
- Single camera: its round toggle uses the same marks as the badges of a multi-camera card, the red live dot on a neutral background while the camera films and the green lock while it is hidden (it showed a red open-lock eye while filming).

## 3.2.0

Visual pass: the same card, nicer to look at.

### Changes
- **HD / SD switch**: both options shown in the header, the current one raised; a tap picks the one you tap.
- **Badges**: a red live dot while the camera films, green with a lock while it is hidden (was: an eye icon on every badge).
- **Images**: each name sits in a glass pill with a softly blinking live dot, instead of a dark band over the bottom of the picture; a single camera's pill just says *Live*, its name being the title. Rounder corners, a hairline edge so dark scenes stay framed on a dark card, wider gaps.
- **Buttons and arrows** on the images are smoked glass with a thin outline, and give under the finger.
- **Pan & tilt pad**: the four arrows gather in a round pad around a centre dot, in the bottom right corner, instead of sitting at the four edges of the image. Lightly tinted and not blurred, so the image stays visible through it. Sized to the tile in the grid (never under 84 px on touch screens), larger in fullscreen, where it sits within thumb reach on a phone and keeps the arrows close together on a large screen. Larger buttons and name in fullscreen.
- **Unavailable** cameras show a softer placeholder; the loading spinner is finer.
- **Every camera hidden**: a panel where the grid would be says how to bring one back; the HD / SD switch hides.
- Blinking and spinning stop when the system asks for reduced motion.
- Screenshots: mock rooms instead of flat colours, plus single-camera, every-camera-hidden and fullscreen views.

## 3.1.0

Ergonomics pass: quicker to read, quicker to act on.

### What's new
- **Tap a camera to put it fullscreen**, with its pan & tilt arrows always shown (larger) when the camera has some, and its sound and exit buttons; tap again, the exit button or Escape to come back. On iPhone, where pages cannot go fullscreen, the card covers the screen itself, arrows included.
- The camera dialog moves to a *Details* button on each tile.
- **Pan & tilt**: hold an arrow to keep moving; arrow keys move the camera while its arrows are shown; the pressed arrow lights up.
- A spinner shows on each tile until its first frame arrives.
- The sound button only shows on streams that carry sound.
- Privacy badges and the single-camera toggle spin until the switch answers, and ignore taps meanwhile (no more double toggles).

### Changes
- Mouse: the tile buttons show on hover, so the images stay clear. Touch: they stay shown, and buttons and arrows are larger.
- Header icon and single-camera toggle are 40 px, like the other cards; more room between the summary and the badges.

## 3.0.0

Advanced Camera Card is no longer used: the card plays the cameras itself with Home Assistant's own player.

### Breaking changes
- `camera_card` is gone (it passed options to Advanced Camera Card) and is now ignored; the clips and snapshots menu goes with it.

### What's new
- Every tile plays with Home Assistant's camera player: WebRTC through go2rtc when available, else HLS or MJPEG, as in the built-in cards. Nothing else to install.
- Tap a camera to open Home Assistant's camera dialog; a fullscreen button on each tile.
- Sound button on each tile, for one camera at a time; the grid starts muted.
- PTZ: a button on the tile shows four arrows over the image; arrows whose button is unavailable are greyed out. A tap on the image closes them.
- Unavailable cameras show *Unavailable* in their tile.
- `aspect_ratio` option (default `16:9`), also in the visual editor.

### Changes
- Hiding or showing a camera, or switching HD / SD, no longer reloads the streams of the other cameras.
- Streams stop while the page is hidden (other tab, phone locked) and resume when it comes back.
- Accessibility: each tile is a labelled group, and the image is its own *Open* button instead of a button wrapping the others.

### Maintenance
- Browser tests (`npm run test:browser`) run the built card in Chromium in CI. Nothing changes for users.

## 2.1.1

### Fixes
- A card shown again (e.g. back on its dashboard view) picks up the HD / SD choice made on another card in the meantime.

### Maintenance
- Screenshot script renders each capture in a fresh page; duplication checks no longer scan the tests. Nothing changes for users.

## 2.1.0

### Fixes
- Keyboard: Enter / Space reach the buttons of the embedded camera card again (menu, fullscreen, PTZ) instead of being swallowed by the card.
- Without `quality_entity`, the HD / SD choice made on the card is shared by every camera card of the page and by other browser tabs.
- Lighter updates: the privacy switch and PTZ buttons are no longer looked up in the whole entity registry on every Home Assistant update.

### Maintenance
- CI hardening: actions pinned by commit SHA, read-only workflow token, monthly Dependabot updates, duplication findings annotated in pull requests.
- Unit tests (`npm test`) run in CI. Nothing changes for users.

## 2.0.0

No change since 1.2.1: this version groups the 1.x changes to the single-camera layout.

### Changes
- Single camera: its name is the card title, unless `title` is set.
- Single camera: a round icon button on the right of the header disables or enables it (*Disable* / *Enable* as tooltip); the HD / SD badge moves under the title.
- Single camera: no summary line while it films; *Camera disabled* while it is hidden.
- Single camera: it takes the full width; the grid never has more columns than cameras shown.

## 1.2.1

### Changes
- The single camera's toggle is a round icon button the size of the header icon, without text (*Disable* / *Enable* stays as its tooltip), centred on the right of the header.

## 1.2.0

### Changes
- With a single camera, its **Disable** / **Enable** toggle takes the right of the title, and the HD / SD badge moves under the title (hidden while the camera is disabled, where *Camera disabled* shows instead).

### Fixes
- The grid never has more columns than cameras shown: a single visible camera takes the full width instead of half of it.

## 1.1.2

### Changes
- With a single camera, no summary line while it films ("1 camera live" is gone); *Camera disabled* still shows while it is hidden.

## 1.1.1

### Fixes
- With a single camera, the summary reads **Camera disabled** (*Caméra désactivée*) while it is hidden, instead of "All cameras are hidden".

## 1.1.0

### Changes
- With a single camera, its name is the card title (unless `title` is set) and its privacy badge reads **Disable** while it films and **Enable** while it is hidden (*Désactiver* / *Activer* in French).

## 1.0.0

First public release.

### What's new
- Camera card: every home camera in one grid, with the number of cameras live and hidden in the header.
- One privacy badge per camera; tap to toggle its privacy switch or its smart plug. Hidden cameras leave the grid.
- HD / SD switch, from an `input_select` shared by every dashboard or from the card itself.
- Live grid, clips, snapshots, PTZ and fullscreen through Advanced Camera Card, with `camera_card` to set any of its options; Home Assistant's own camera cards when it is not installed.
- Automatic discovery on the camera's device: privacy switch, PTZ buttons and SD stream (Tapo naming).
- Visual editor in the dashboard UI, labels in English and French.
- Light and dark theme compatible, installable via HACS.
