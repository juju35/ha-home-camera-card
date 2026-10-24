# Changelog

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
