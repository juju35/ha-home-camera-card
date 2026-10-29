# Changelog

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
