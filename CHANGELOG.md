# Changelog

## 3.2.0

Visual pass: the same card, nicer to look at.

### Changes
- **HD / SD switch**: both options shown in the header, the current one raised; a tap picks the one you tap.
- **Badges**: a red live dot while the camera films, green with a lock while it is hidden (was: an eye icon on every badge).
- **Images**: each name sits in a glass pill with a softly blinking live dot, instead of a dark band over the bottom of the picture; a single camera's pill just says *Live*, its name being the title. Rounder corners, a hairline edge so dark scenes stay framed on a dark card, wider gaps.
- **Buttons and arrows** on the images are smoked glass with a thin outline, and give under the finger.
- **Unavailable** cameras show a softer placeholder; the loading spinner is finer.
- **Every camera hidden**: a panel where the grid would be says how to bring one back; the HD / SD switch hides.
- Blinking and spinning stop when the system asks for reduced motion.
- Screenshots: mock rooms instead of flat colours, plus a single-camera and an every-camera-hidden view.

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
