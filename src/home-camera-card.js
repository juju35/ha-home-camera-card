const HOME_CAMERA_CARD_VERSION = '__VERSION__';

// ── i18n ─────────────────────────────────────────────────────────────────────
const HcI18n = {
  fr: {
    title: 'Caméras',
    live_one: '{n} caméra en direct',
    live_many: '{n} caméras en direct',
    hidden_one: '{n} masquée',
    hidden_many: '{n} masquées',
    all_hidden: 'Toutes les caméras sont masquées',
    one_hidden: 'Caméra désactivée',
    no_cameras: 'Aucune caméra configurée',
    hint_all: 'Touchez une pastille pour afficher une caméra',
    live: 'En direct',
    hint_one: 'Activez la caméra pour la voir ici',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Basculer entre HD et SD',
    privacy_on: '{c} : masquée, toucher pour l\'afficher',
    privacy_off: '{c} : visible, toucher pour la masquer',
    enable: 'Activer',
    disable: 'Désactiver',
    unavailable: 'Indisponible',
    ptz: 'Orientation',
    open: 'Afficher {c} en plein écran',
    exit_fullscreen: 'Quitter le plein écran',
    details: 'Détails',
    pending: 'Changement en cours…',
    sound_on: 'Activer le son',
    sound_off: 'Couper le son',
    move_left: 'Gauche',
    move_right: 'Droite',
    move_up: 'Haut',
    move_down: 'Bas',
    ed_title: 'Titre',
    ed_title_helper: 'Laisser vide pour « Caméras »',
    ed_icon: 'Icône',
    ed_quality_entity: 'Sélecteur de qualité',
    ed_quality_entity_helper: 'input_select avec les options HD et SD ; sans lui, la qualité se change sur la carte',
    ed_hd_option: 'Option HD',
    ed_sd_option: 'Option SD',
    ed_columns: 'Colonnes',
    ed_aspect_ratio: 'Format des vignettes',
    ed_aspect_ratio_helper: 'Par exemple 16:9 (par défaut) ou 4:3',
    ed_show_summary: 'Résumé',
    ed_show_badges: 'Pastilles de confidentialité',
    ed_language: 'Langue',
    ed_language_helper: 'Laisser vide pour suivre la langue de Home Assistant',
    ed_cameras: 'Caméras',
    cf_name: 'Nom',
    cf_short_name: 'Nom court (pastille)',
    cf_camera: 'Caméra (HD)',
    cf_sd: 'Caméra SD',
    cf_privacy: 'Interrupteur de confidentialité (activé = masquée)',
    cf_power: 'Alimentation (éteinte = masquée)',
    cf_ptz: 'Préfixe PTZ, par exemple button.sejour_move',
  },
  en: {
    title: 'Cameras',
    live_one: '{n} camera live',
    live_many: '{n} cameras live',
    hidden_one: '{n} hidden',
    hidden_many: '{n} hidden',
    all_hidden: 'All cameras are hidden',
    one_hidden: 'Camera disabled',
    no_cameras: 'No camera configured',
    hint_all: 'Tap a badge to show a camera',
    live: 'Live',
    hint_one: 'Enable the camera to see it here',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Switch between HD and SD',
    privacy_on: '{c}: hidden, tap to show it',
    privacy_off: '{c}: visible, tap to hide it',
    enable: 'Enable',
    disable: 'Disable',
    unavailable: 'Unavailable',
    ptz: 'Pan & tilt',
    open: 'Show {c} fullscreen',
    exit_fullscreen: 'Exit fullscreen',
    details: 'Details',
    pending: 'Updating…',
    sound_on: 'Unmute',
    sound_off: 'Mute',
    move_left: 'Left',
    move_right: 'Right',
    move_up: 'Up',
    move_down: 'Down',
    ed_title: 'Title',
    ed_title_helper: 'Leave empty for "Cameras"',
    ed_icon: 'Icon',
    ed_quality_entity: 'Quality selector',
    ed_quality_entity_helper: 'input_select with HD and SD options; without it, the quality is switched on the card',
    ed_hd_option: 'HD option',
    ed_sd_option: 'SD option',
    ed_columns: 'Columns',
    ed_aspect_ratio: 'Tile aspect ratio',
    ed_aspect_ratio_helper: 'For example 16:9 (default) or 4:3',
    ed_show_summary: 'Summary',
    ed_show_badges: 'Privacy badges',
    ed_language: 'Language',
    ed_language_helper: 'Leave empty to follow the Home Assistant language',
    ed_cameras: 'Cameras',
    cf_name: 'Name',
    cf_short_name: 'Short name (badge)',
    cf_camera: 'Camera (HD)',
    cf_sd: 'SD camera',
    cf_privacy: 'Privacy switch (on = hidden)',
    cf_power: 'Power (off = hidden)',
    cf_ptz: 'PTZ prefix, for example button.living_room_move',
  },
};

function hcT(lang, key) {
  const strings = HcI18n[lang] || HcI18n.en;
  return strings[key] || HcI18n.en[key] || key;
}

function hcEsc(s) {
  return String(s == null ? '' : s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
}

const HC_DEFAULTS = {
  hd_option: 'HD',
  sd_option: 'SD',
  columns: 2,
  show_summary: true,
  show_badges: true,
};

const HC_PTZ_DIRS = ['left', 'right', 'up', 'down'];
// PTZ arrow held down: first repeat after HC_PTZ_HOLD_MS, then one press every HC_PTZ_REPEAT_MS.
const HC_PTZ_HOLD_MS = 500;
const HC_PTZ_REPEAT_MS = 350;
// How long a privacy badge waits for its switch to answer before giving up.
const HC_PENDING_MS = 15000;
const HC_PTZ_ICONS = { left: 'mdi:chevron-left', right: 'mdi:chevron-right', up: 'mdi:chevron-up', down: 'mdi:chevron-down' };

// ── Entity discovery ─────────────────────────────────────────────────────────
// The registry is indexed by device once per `hass.entities` object (it only changes with the registry).
const hcDeviceIndex = new WeakMap();
function hcDeviceEntities(reg, device) {
  let index = hcDeviceIndex.get(reg);
  if (!index) {
    index = new Map();
    for (const e of Object.values(reg)) {
      if (!e.device_id) continue;
      if (!index.has(e.device_id)) index.set(e.device_id, []);
      index.get(e.device_id).push(e.entity_id);
    }
    hcDeviceIndex.set(reg, index);
  }
  return index.get(device) || [];
}

// An entity of the camera's device whose id ends with `suffix` (Tapo: switch.*_privacy, button.*_move_left).
function hcSibling(hass, cameraId, domain, suffix) {
  const reg = hass?.entities;
  const device = reg?.[cameraId]?.device_id;
  if (!device) return undefined;
  return hcDeviceEntities(reg, device).find((id) => id.startsWith(`${domain}.`) && id.endsWith(suffix));
}

// True when an event path goes through one of the card's own controls (privacy toggle, HD/SD switch,
// tile buttons, including the one covering the image that opens the camera).
function hcOwnControl(path) {
  return path.some((n) => n.dataset?.toggle || n.dataset?.quality || n.dataset?.action);
}

// "16:9", "4/3" or 1.5 as a width / height ratio; 16:9 when missing or invalid.
function hcRatio(value) {
  if (typeof value === 'number' && value > 0) return value;
  const m = /^\s*(\d+(?:\.\d+)?)\s*[:/x]\s*(\d+(?:\.\d+)?)\s*$/.exec(String(value || ''));
  const r = m ? Number(m[1]) / Number(m[2]) : Number(value);
  return Number.isFinite(r) && r > 0 ? r : 16 / 9;
}

// Home Assistant's own live player (WebRTC through go2rtc, HLS or MJPEG, whichever the camera offers).
// It ships with the picture cards, which are loaded on demand: building one loads it.
let hcStreamLoad = null;
function hcLoadStream(entity) {
  if (customElements.get('ha-camera-stream')) return Promise.resolve();
  if (!hcStreamLoad) {
    hcStreamLoad = (async () => {
      const helpers = window.loadCardHelpers ? await window.loadCardHelpers() : null;
      helpers?.createCardElement({ type: 'picture-entity', entity: entity, camera_view: 'live' });
      await customElements.whenDefined('ha-camera-stream');
    })().catch((err) => {
      hcStreamLoad = null; // the next render tries again
      throw err;
    });
  }
  return hcStreamLoad;
}

// PTZ buttons as { left, right, up, down }: a prefix ("button.x_move" + "_left"…), an object, or found on the device.
function hcPtz(hass, cam, cameraId) {
  if (cam.ptz === false) return null;
  let ptz = cam.ptz;
  if (!ptz) {
    const left = hcSibling(hass, cameraId, 'button', '_move_left');
    if (!left) return null;
    ptz = left.slice(0, -'_left'.length);
  }
  if (typeof ptz === 'string') {
    const out = {};
    for (const d of HC_PTZ_DIRS) out[d] = `${ptz}_${d}`;
    return out;
  }
  return ptz;
}

// A camera entry, completed from its device: SD stream, privacy switch and PTZ buttons.
function hcCamera(hass, raw, index) {
  const cam = typeof raw === 'string' ? { camera: raw } : Object.assign({}, raw);
  const id = cam.camera || cam.entity || '';
  const st = hass?.states?.[id];
  let sd = cam.sd;
  if (sd === undefined && /_hd_stream$/.test(id)) {
    const guess = id.replace(/_hd_stream$/, '_sd_stream');
    if (hass?.states?.[guess]) sd = guess;
  }
  const privacy = cam.privacy === false ? null : cam.privacy || hcSibling(hass, id, 'switch', '_privacy') || null;
  const name = cam.name || st?.attributes.friendly_name || id;
  return {
    key: cam.id || id.replace(/^camera\./, '') || `camera_${index}`,
    camera: id,
    sd: sd || null,
    name: name,
    short: cam.short_name || name,
    privacy: privacy,
    power: cam.power || null,
    ptz: hcPtz(hass, cam, id),
  };
}

// HD / SD choice of the cards without quality_entity, shared by every card of the browser.
const HC_QUALITY_KEY = 'home-camera-card-quality';
const HC_QUALITY_EVENT = 'home-camera-card-quality';

// ── home-camera-card ─────────────────────────────────────────────────────────
class HomeCameraCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement('home-camera-card-editor');
  }

  static getStubConfig(hass) {
    const cams = Object.keys(hass?.states || {})
      .filter((id) => id.startsWith('camera.'))
      .slice(0, 2);
    return { cameras: cams };
  }

  setConfig(config) {
    if (!config) throw new Error('Invalid configuration');
    if (config.cameras && !Array.isArray(config.cameras)) throw new Error('cameras must be a list');
    this._config = Object.assign({}, HC_DEFAULTS, config);
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `${this._styles()}<ha-card><div class="head"></div><div class="view"></div></ha-card>`;
      this.shadowRoot.addEventListener('click', (ev) => this._onClick(ev));
      this.shadowRoot.addEventListener('keydown', (ev) => this._onKey(ev));
      this.shadowRoot.addEventListener('pointerdown', (ev) => this._onPointerDown(ev));
    }
    this._headSig = null;
    this._viewSig = null;
    this._update();
  }

  connectedCallback() {
    if (!this._onQuality) {
      this._onQuality = (ev) => {
        if (!ev.key || ev.key === HC_QUALITY_KEY) this._update();
      };
      this._onVisibility = () => this._syncTiles();
      // Escape leaves the card's own fullscreen (the browser handles its native one).
      this._onEscape = (ev) => {
        if (ev.key === 'Escape' && this._pseudo) this._setPseudo(this._pseudo, false);
      };
    }
    window.addEventListener('storage', this._onQuality);
    window.addEventListener(HC_QUALITY_EVENT, this._onQuality);
    document.addEventListener('visibilitychange', this._onVisibility);
    window.addEventListener('keydown', this._onEscape);
    this._syncTiles();
    // The HD/SD choice may have changed while detached (listeners removed): catch up. _update() is
    // a no-op before setConfig/hass, and the signatures skip the render when nothing changed.
    this._update();
  }

  disconnectedCallback() {
    window.removeEventListener('storage', this._onQuality);
    window.removeEventListener(HC_QUALITY_EVENT, this._onQuality);
    document.removeEventListener('visibilitychange', this._onVisibility);
    window.removeEventListener('keydown', this._onEscape);
    this._stopRepeat();
    if (this._pseudo) this._setPseudo(this._pseudo, false);
  }

  set hass(hass) {
    this._hass = hass;
    this._update();
    this._syncTiles();
  }

  getCardSize() {
    return 8;
  }

  getGridOptions() {
    return { columns: 'full', min_columns: 6 };
  }

  _lang() {
    let l = this._config?.language || this._hass?.language || document.documentElement.lang || 'en';
    l = l.split('-')[0];
    return HcI18n[l] ? l : 'en';
  }

  _t(k, vars) {
    let s = hcT(this._lang(), k);
    for (const v of Object.keys(vars || {})) s = s.replace(`{${v}}`, vars[v]);
    return s;
  }

  _state(id) {
    return id ? this._hass.states[id]?.state : undefined;
  }

  // HD unless the quality selector (or the card's own toggle) says SD.
  // The local choice is read from storage each time, so every card of the dashboard agrees.
  _hd() {
    const c = this._config;
    if (c.quality_entity) return this._state(c.quality_entity) !== c.sd_option;
    let quality = this._quality;
    try {
      quality = localStorage.getItem(HC_QUALITY_KEY) || quality;
    } catch (_e) {
      // storage unavailable: the card's own choice
    }
    return quality !== 'sd';
  }

  // A camera is hidden when its privacy switch is on or its power switch is off.
  _hidden(cam) {
    return (cam.privacy && this._state(cam.privacy) === 'on') || (cam.power && this._state(cam.power) === 'off');
  }

  // Each camera gets a unique key (the same camera listed twice gets two tiles, not one shared tile).
  _cameras() {
    const seen = new Set();
    return (this._config.cameras || [])
      .map((raw, i) => hcCamera(this._hass, raw, i))
      .filter((cam) => cam.camera)
      .map((cam, i) => {
        if (seen.has(cam.key)) cam.key = `${cam.key}_${i}`;
        seen.add(cam.key);
        return cam;
      });
  }

  // Privacy switches toggled from the card, until Home Assistant reports their new state.
  _setPending(id) {
    if (!this._pending) this._pending = new Map();
    clearTimeout(this._pending.get(id)?.timer);
    // A camera that never answers: the badge stops waiting after a while.
    const timer = setTimeout(() => {
      this._pending.delete(id);
      this._headSig = null;
      this._update();
    }, HC_PENDING_MS);
    this._pending.set(id, { from: this._state(id), timer });
    this._headSig = null;
    this._update();
  }

  _isPending(id) {
    return !!id && !!this._pending?.has(id);
  }

  _update() {
    if (!this._config || !this._hass || !this.shadowRoot) return;
    for (const [id, p] of this._pending || []) {
      if (this._state(id) === p.from) continue;
      clearTimeout(p.timer);
      this._pending.delete(id);
    }
    const cams = this._cameras();
    const hd = this._hd();
    const visible = cams.filter((cam) => !this._hidden(cam));

    const headSig = JSON.stringify([
      this._lang(),
      hd,
      [...(this._pending?.keys() || [])],
      cams.map((cam) => [cam.name, cam.short, cam.privacy, cam.power, this._hidden(cam)]),
    ]);
    if (headSig !== this._headSig) {
      this._headSig = headSig;
      this._renderHead(cams, visible, hd);
    }

    const viewSig = JSON.stringify([
      this._lang(),
      hd,
      this._config.columns,
      this._config.aspect_ratio,
      visible.map((cam) => [cam.key, cam.camera, cam.sd, cam.name, cam.ptz]),
    ]);
    if (viewSig !== this._viewSig) {
      this._viewSig = viewSig;
      this._renderView(visible, hd);
    }
  }

  // A badge: an icon, or the red live dot when icon is null.
  _chip(cls, attrs, icon, label, title) {
    const mark = icon ? `<ha-icon icon="${icon}"></ha-icon>` : '<span class="dot"></span>';
    return (
      `<span class="chip ${cls}" ${attrs} role="button" tabindex="0" title="${hcEsc(title)}">` +
      `${mark}<span>${hcEsc(label)}</span></span>`
    );
  }

  _renderHead(cams, visible, hd) {
    const c = this._config;
    // A single camera: its name is the title, and its badge says what a tap does.
    const single = cams.length === 1;
    let title = c.title;
    if (title == null || title === '') title = single ? cams[0].name : this._t('title');
    const hidden = cams.length - visible.length;

    let summary = '';
    if (c.show_summary && cams.length) {
      if (!visible.length) summary = this._t(single ? 'one_hidden' : 'all_hidden');
      else if (!single) {
        summary = this._t(visible.length > 1 ? 'live_many' : 'live_one', { n: visible.length });
        if (hidden) summary += ` · ${this._t(hidden > 1 ? 'hidden_many' : 'hidden_one', { n: hidden })}`;
      }
    }

    // HD / SD as a two-way switch: both options shown, the current one raised.
    const opt = (q, on) =>
      `<span class="opt${on ? ' on' : ''}" data-quality="${q}" role="radio" aria-checked="${on}" tabindex="0">${this._t(q)}</span>`;
    const quality = `<span class="seg" role="radiogroup" title="${hcEsc(this._t('quality_hint'))}">${opt('hd', hd)}${opt('sd', !hd)}</span>`;

    // Lock icon by state; a spinning icon while the switch toggled from the card has not answered yet.
    const lock = (cam) => {
      const target = cam.privacy || cam.power;
      if (this._isPending(target)) return { cls: 'pending', icon: 'mdi:loading', title: this._t('pending') };
      const off = this._hidden(cam);
      return {
        cls: off ? 'private' : 'exposed',
        icon: off ? 'mdi:eye-lock' : 'mdi:eye-lock-open',
        title: this._t(off ? 'privacy_on' : 'privacy_off', { c: cam.name }),
      };
    };
    // Badges: a live camera shows the red dot, a hidden one its lock.
    const badgeIcon = (l) => (l.cls === 'exposed' ? null : l.icon);

    let badges = '';
    if (c.show_badges) {
      badges = cams
        .filter((cam) => cam.privacy || cam.power)
        .map((cam) => {
          const l = lock(cam);
          const target = cam.privacy || cam.power;
          const label = single ? this._t(this._hidden(cam) ? 'enable' : 'disable') : cam.short;
          return this._chip(l.cls, `data-toggle="${hcEsc(target)}"`, badgeIcon(l), label, l.title);
        })
        .join('');
    }

    // A single camera with a toggle: the toggle sits on the right of the title, the quality under it
    // (only while the camera films: once it is hidden, the line says so instead).
    // No camera on screen: nothing to choose a quality for.
    let right = visible.length ? quality : '';
    let side = '';
    let sub = summary ? `<div class="summary">${hcEsc(summary)}</div>` : '';
    if (single && badges) {
      // Icon only, the size of the header icon; the text stays in the tooltip and for screen readers.
      const cam = cams[0];
      const l = lock(cam);
      const label = l.cls === 'pending' ? l.title : this._t(this._hidden(cam) ? 'enable' : 'disable');
      right = '';
      side =
        `<span class="toggle ${l.cls}" data-toggle="${hcEsc(cam.privacy || cam.power)}" role="button" tabindex="0"` +
        ` title="${hcEsc(label)}" aria-label="${hcEsc(label)}"><ha-icon icon="${l.icon}"></ha-icon></span>`;
      if (visible.length) sub = `<div class="chips sub">${quality}</div>`;
      badges = '';
    }

    const level = cams.length && !visible.length ? 'off' : 'on';
    this.shadowRoot.querySelector('.head').innerHTML =
      `<div class="header"><div class="hicon ${level}"><ha-icon icon="${hcEsc(c.icon || 'mdi:cctv')}"></ha-icon></div>` +
      `<div class="titles"><div class="name-row"><div class="name">${hcEsc(title)}</div><div class="chips">${right}</div></div>` +
      sub +
      `</div>${side}</div>` +
      (badges ? `<div class="chips badges">${badges}</div>` : '');
  }

  // The grid of tiles, one per visible camera. Tiles are kept across renders and only added or removed
  // where needed: a tile that stays in place keeps its stream running (moving a player reconnects it).
  _renderView(visible, hd) {
    const view = this.shadowRoot.querySelector('.view');
    if (!this._tiles) this._tiles = new Map();
    if (!visible.length) {
      this._tiles.clear();
      const n = this._config.cameras?.length || 0;
      // Every camera hidden: what brings one back, where the grid would be.
      if (n && this._config.show_badges) {
        view.innerHTML =
          `<div class="asleep"><ha-icon icon="mdi:eye-lock"></ha-icon>` +
          `<span>${hcEsc(this._t(n === 1 ? 'hint_one' : 'hint_all'))}</span></div>`;
      } else {
        view.innerHTML = n
          ? ''
          : `<div class="empty"><ha-icon icon="mdi:cctv-off"></ha-icon>${hcEsc(this._t('no_cameras'))}</div>`;
      }
      return;
    }
    hcLoadStream(visible[0].camera).catch(() => {});
    let grid = view.querySelector('.grid');
    if (!grid) {
      grid = document.createElement('div');
      grid.className = 'grid';
      view.replaceChildren(grid);
    }
    grid.style.gridTemplateColumns = `repeat(${hcColumns(this._config, visible.length)}, minmax(0, 1fr))`;
    grid.style.setProperty('--hc-ratio', String(hcRatio(this._config.aspect_ratio)));

    const keys = new Set(visible.map((cam) => cam.key));
    for (const [key, tile] of this._tiles) {
      if (keys.has(key)) continue;
      tile.remove();
      this._tiles.delete(key);
    }
    visible.forEach((cam, i) => {
      let tile = this._tiles.get(cam.key);
      if (!tile) {
        tile = this._tile();
        this._tiles.set(cam.key, tile);
      }
      this._fillTile(tile, cam, hd);
      if (grid.children[i] !== tile) grid.insertBefore(tile, grid.children[i] || null);
    });
    this._syncTiles();
  }

  _tile() {
    const tile = document.createElement('div');
    tile.className = 'tile';
    // A group of controls; the image itself is a button (.open) under the other buttons, never around them.
    tile.setAttribute('role', 'group');
    tile.innerHTML =
      '<div class="na"><ha-icon icon="mdi:cctv-off"></ha-icon><span></span></div><div class="spin"></div>' +
      '<div class="label"><span class="dot"></span><span class="text"></span></div>' +
      '<span class="open" data-action="open" role="button" tabindex="0"></span>' +
      '<div class="tools"></div><div class="pad"></div>';
    const stream = document.createElement('ha-camera-stream');
    stream.muted = true;
    stream.fitMode = 'cover';
    tile.prepend(stream);
    tile._stream = stream;
    tile._audio = false;
    tile.addEventListener('fullscreenchange', () => this._fullscreenChanged(tile));
    tile.addEventListener('webkitfullscreenchange', () => this._fullscreenChanged(tile));
    // The players report their first frame (load) and whether the stream carries sound (streams).
    tile.addEventListener('load', () => tile.classList.remove('loading'));
    tile.addEventListener('streams', (ev) => {
      if (!ev.detail?.hasAudio || tile._audio) return;
      tile._audio = true;
      this._renderTools(tile);
    });
    return tile;
  }

  // Name and buttons of a tile; the stream element itself is left alone.
  _fillTile(tile, cam, hd) {
    tile._cam = cam;
    tile._entity = hd || !cam.sd ? cam.camera : cam.sd;
    tile.dataset.cam = cam.key;
    tile.setAttribute('aria-label', cam.name);
    tile.querySelector('.open').title = cam.name;
    // A single camera already has its name as the card title: its image just says it is live.
    const single = (this._config.cameras?.length || 0) === 1;
    tile.querySelector('.label .text').textContent = single ? this._t('live') : cam.name;
    tile.querySelector('.na span').textContent = this._t('unavailable');
    if (!this._fullscreen(tile)) tile._stream.aspectRatio = hcRatio(this._config.aspect_ratio);
    this._renderTools(tile);
  }

  // Buttons of a tile: pan & tilt, sound (when the stream has some), and the camera dialog. In
  // fullscreen: sound and an exit button; the arrows are always shown there, and the dialog would open
  // behind the fullscreen tile.
  _renderTools(tile) {
    const cam = tile._cam;
    if (!cam) return;
    const full = this._fullscreen(tile);
    const sig = JSON.stringify([this._lang(), cam.ptz, full, tile._audio]);
    if (sig === tile._toolsSig) return;
    tile._toolsSig = sig;

    tile.querySelector('.open').setAttribute('aria-label', full ? this._t('exit_fullscreen') : this._t('open', { c: cam.name }));
    const btn = (cls, attrs, icon, label) =>
      `<span class="btn ${cls}" ${attrs} role="button" tabindex="0" title="${hcEsc(label)}" aria-label="${hcEsc(label)}">` +
      `<ha-icon icon="${icon}"></ha-icon></span>`;
    let tools = '';
    if (cam.ptz && !full) tools += btn('ptz', 'data-action="ptz"', 'mdi:arrow-all', this._t('ptz'));
    if (tile._audio) tools += btn('sound', 'data-action="sound"', 'mdi:volume-off', this._t('sound_on'));
    if (full) tools += btn('full', 'data-action="fullscreen"', 'mdi:fullscreen-exit', this._t('exit_fullscreen'));
    else tools += btn('details', 'data-action="details"', 'mdi:information-outline', this._t('details'));
    tile.querySelector('.tools').innerHTML = tools;
    tile.querySelector('.pad').innerHTML = cam.ptz
      ? HC_PTZ_DIRS.filter((d) => cam.ptz[d])
          .map((d) =>
            btn(`move ${d}`, `data-action="move" data-entity="${hcEsc(cam.ptz[d])}"`, HC_PTZ_ICONS[d], this._t(`move_${d}`)),
          )
          .join('')
      : '';
    if (!cam.ptz) tile.classList.remove('ptz-open');
    this._soundIcon(tile);
    this._syncPtz(tile);
  }

  // Live state of every tile: the camera's state object, and which PTZ buttons can be pressed.
  // While the page is hidden (other tab, phone locked) the players are emptied, which closes the streams.
  _syncTiles() {
    if (!this._tiles || !this._hass) return;
    const paused = document.visibilityState === 'hidden';
    for (const tile of this._tiles.values()) {
      const st = this._hass.states[tile._entity];
      const ok = !!st && st.state !== 'unavailable';
      tile.classList.toggle('off', !ok);
      const stream = tile._stream;
      // Older Home Assistant versions take hass; newer ones read it from the page (Lit context) and
      // do not declare it, so it is only given to a player that asks for it.
      if (stream.constructor.elementProperties?.has?.('hass')) stream.hass = this._hass;
      const obj = ok && !paused ? st : undefined;
      // A new camera (or the same one coming back) loads again: spinner until its first frame, and
      // its sound is unknown until its player says. A mere state update keeps both.
      if (obj?.entity_id !== stream.stateObj?.entity_id) {
        tile.classList.toggle('loading', !!obj);
        if (tile._audio) {
          tile._audio = false;
          stream.muted = true;
          this._renderTools(tile);
        }
      }
      if (stream.stateObj !== obj) stream.stateObj = obj;
      this._syncPtz(tile);
    }
  }

  _syncPtz(tile) {
    for (const b of tile.querySelectorAll('.move')) {
      b.classList.toggle('dis', this._state(b.dataset.entity) === 'unavailable');
    }
  }

  // Fullscreen: the browser's own (the tile is the fullscreen element), or the card's (iPhone).
  _fullscreen(tile) {
    const root = this.shadowRoot;
    return (
      !!tile &&
      (root.fullscreenElement === tile || root.webkitFullscreenElement === tile || tile.classList.contains('pseudo'))
    );
  }

  // The card's own fullscreen, where pages cannot use the browser's (iPhone): the tile covers the
  // screen with position: fixed. It stays where it is in the page, so its stream keeps playing.
  _setPseudo(tile, on) {
    tile.classList.toggle('pseudo', on);
    this._pseudo = on ? tile : null;
    this._fullscreenChanged(tile);
  }

  _fullscreenChanged(tile) {
    const on = this._fullscreen(tile);
    // The arrows are always shown in fullscreen: the grid's own toggle does not apply.
    tile.classList.remove('ptz-open');
    tile._stream.fitMode = on ? 'contain' : 'cover';
    tile._stream.aspectRatio = on ? undefined : hcRatio(this._config.aspect_ratio);
    this._renderTools(tile);
  }

  // The tile goes fullscreen with its buttons and its pan & tilt arrows. Where the browser cannot put
  // an element fullscreen (iPhone), or refuses, the card covers the screen itself.
  _toggleFullscreen(tile) {
    if (this._fullscreen(tile)) {
      if (tile.classList.contains('pseudo')) this._setPseudo(tile, false);
      else (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
      return;
    }
    const fallback = () => this._setPseudo(tile, true);
    const request = tile.requestFullscreen || tile.webkitRequestFullscreen;
    if (!request) {
      fallback();
      return;
    }
    try {
      Promise.resolve(request.call(tile)).catch(fallback);
    } catch (_e) {
      fallback();
    }
  }

  // Sound on one camera at a time: unmuting a tile mutes the others.
  _toggleSound(tile) {
    const on = tile._stream.muted;
    for (const t of this._tiles?.values() || []) {
      if (t === tile || t._stream.muted) continue;
      t._stream.muted = true;
      this._soundIcon(t);
    }
    tile._stream.muted = !on;
    this._soundIcon(tile);
  }

  _soundIcon(tile) {
    const b = tile.querySelector('.sound');
    if (!b) return;
    const on = !tile._stream.muted;
    const label = this._t(on ? 'sound_off' : 'sound_on');
    b.classList.toggle('on', on);
    b.title = label;
    b.setAttribute('aria-label', label);
    b.querySelector('ha-icon').setAttribute('icon', on ? 'mdi:volume-high' : 'mdi:volume-off');
  }

  _moreInfo(entityId) {
    this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true }));
  }

  // PTZ: one press per tap, repeated while the arrow is held down.
  _move(b) {
    if (b.classList.contains('dis')) return;
    this._hass.callService('button', 'press', { entity_id: b.dataset.entity });
  }

  _onPointerDown(ev) {
    const b = ev.composedPath().find((n) => n.dataset?.action === 'move');
    if (!b || ev.button > 0) return;
    this._stopRepeat();
    this._move(b);
    this._repeat = setTimeout(() => {
      this._repeat = setInterval(() => this._move(b), HC_PTZ_REPEAT_MS);
    }, HC_PTZ_HOLD_MS);
    const stop = () => this._stopRepeat();
    for (const type of ['pointerup', 'pointercancel', 'pointerleave']) b.addEventListener(type, stop, { once: true });
  }

  _stopRepeat() {
    clearTimeout(this._repeat);
    clearInterval(this._repeat);
    this._repeat = null;
  }

  _onKey(ev) {
    const path = ev.composedPath();
    // Arrow keys move the camera whose pan & tilt arrows are shown (always, in fullscreen).
    if (ev.key?.startsWith('Arrow')) {
      const tile = path.find((n) => n.dataset?.cam);
      const shown = tile && (tile.classList.contains('ptz-open') || this._fullscreen(tile));
      const b = shown && tile.querySelector(`.move.${ev.key.slice(5).toLowerCase()}`);
      if (!b) return;
      ev.preventDefault();
      this._move(b);
      return;
    }
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    // Only the card's own controls: keys bubbling up from elsewhere keep their behaviour.
    if (!hcOwnControl(path)) return;
    ev.preventDefault();
    this._onClick(ev);
  }

  _styles() {
    return (
      '<style>' +
      // --hc-glass: the smoked glass of everything laid over the images (labels, buttons, arrows).
      ':host { display: block; --hc-on: var(--success-color, #43a047); --hc-off: var(--error-color, #db4437);' +
      ' --hc-live: var(--error-color, #db4437); --hc-glass: rgba(14, 16, 20, 0.46); --hc-glass-line: rgba(255, 255, 255, 0.14); }' +
      'ha-card { box-sizing: border-box; padding: 12px; display: flex; flex-direction: column; gap: 12px; overflow: hidden; }' +
      '.header { display: flex; align-items: center; gap: 10px; }' +
      '.hicon { width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center;' +
      ' --hc-c: var(--primary-color, #03a9f4); background: color-mix(in srgb, var(--hc-c) 15%, transparent); color: var(--hc-c); }' +
      '.hicon.off { --hc-c: var(--secondary-text-color); }' +
      '.hicon ha-icon { --mdc-icon-size: 24px; }' +
      '.titles { flex: 1; min-width: 0; }' +
      '.name-row { display: flex; align-items: center; gap: 8px; }' +
      '.name { flex: 1; min-width: 0; font-size: 16px; font-weight: 500; line-height: 1.25; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }' +
      '.summary { font-size: 12px; line-height: 1.35; margin-top: 2px; color: var(--secondary-text-color); }' +
      '.chips { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px; }' +
      '.chips.badges, .chips.sub { justify-content: flex-start; }' +
      '.chips.badges { margin-top: 10px; }' +
      '.chips.sub { margin-top: 4px; }' +
      // HD / SD switch: a track with the current option raised on it.
      '.seg { display: inline-flex; padding: 2px; gap: 2px; border-radius: 12px; background: var(--secondary-background-color, rgba(128,128,128,0.12)); }' +
      '.opt { font-size: 11px; font-weight: 600; letter-spacing: 0.02em; line-height: 18px; padding: 0 8px; border-radius: 10px; cursor: pointer;' +
      ' color: var(--secondary-text-color); user-select: none; transition: background 0.15s, color 0.15s; }' +
      '.opt.on { background: var(--card-background-color, #fff); color: var(--primary-color, #03a9f4); box-shadow: 0 1px 2px rgba(0,0,0,0.18); cursor: default; }' +
      '.opt:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }' +
      '.toggle { width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; cursor: pointer;' +
      ' --hc-c: var(--hc-off); background: color-mix(in srgb, var(--hc-c) 15%, transparent); color: var(--hc-c); }' +
      '.toggle.private { --hc-c: var(--hc-on); }' +
      '.toggle.pending { --hc-c: var(--secondary-text-color); cursor: progress; }' +
      '.toggle ha-icon { --mdc-icon-size: 22px; }' +
      // Badges: neutral with a red live dot while the camera films, green-tinted with a lock while hidden.
      '.chip { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 500; line-height: 18px; padding: 1px 9px 1px 7px; border-radius: 12px;' +
      ' cursor: pointer; white-space: nowrap; user-select: none; background: var(--secondary-background-color, rgba(128,128,128,0.12)); color: var(--primary-text-color); }' +
      '.chip ha-icon { --mdc-icon-size: 13px; }' +
      '.chip.private { background: color-mix(in srgb, var(--hc-on) 15%, transparent); color: var(--hc-on); }' +
      '.chip.pending { cursor: progress; color: var(--secondary-text-color); }' +
      '.chip:focus-visible, .toggle:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }' +
      '.dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; background: var(--hc-live); }' +
      '.pending ha-icon { animation: hc-spin 0.9s linear infinite; }' +
      '@keyframes hc-spin { to { transform: rotate(360deg); } }' +
      // The one moving thing: the live dot on the images breathes, like a recording light.
      '@keyframes hc-live { 50% { opacity: 0.35; } }' +
      '.view:empty { display: none; }' +
      '.grid { display: grid; gap: 8px; }' +
      '.tile { position: relative; aspect-ratio: var(--hc-ratio, 1.7778); border-radius: 12px; overflow: hidden; background: #0d0f12; }' +
      // A hairline ring over the image, so dark scenes keep their edge on a dark card.
      '.tile::after { content: ""; position: absolute; inset: 0; border-radius: inherit; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.07); pointer-events: none; }' +
      ':is(.tile:fullscreen, .tile.pseudo)::after { display: none; }' +
      '.open { position: absolute; inset: 0; outline: none; border-radius: inherit; -webkit-tap-highlight-color: transparent; }' +
      '.open:focus-visible { box-shadow: inset 0 0 0 2px var(--primary-color, #03a9f4); }' +
      // A tap on the image puts it fullscreen, a second tap brings it back.
      '.open { cursor: zoom-in; }' +
      ':is(.tile:fullscreen, .tile.pseudo) .open { cursor: zoom-out; }' +
      '.tile ha-camera-stream { display: block; width: 100%; height: 100%; --video-max-height: 100%; }' +
      ':is(.tile:fullscreen, .tile.pseudo) { display: flex; align-items: center; justify-content: center; border-radius: 0; background: #000; }' +
      '.tile.pseudo { position: fixed; inset: 0; z-index: 10000; aspect-ratio: auto; }' +
      ':is(.tile:fullscreen, .tile.pseudo) ha-camera-stream { height: auto; --video-max-height: 100vh; }' +
      '.tile.off ha-camera-stream { display: none; }' +
      '.na { position: absolute; inset: 0; display: none; flex-direction: column; align-items: center; justify-content: center; gap: 8px; font-size: 12px;' +
      ' color: rgba(255,255,255,0.62); background: radial-gradient(circle at 50% 42%, #2a2e35, #121418 72%); }' +
      '.na ha-icon { --mdc-icon-size: 20px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%;' +
      ' background: rgba(255,255,255,0.07); }' +
      '.tile.off .na { display: flex; }' +
      '.tile.off .label .dot { display: none; }' +
      '.spin { position: absolute; inset: 0; margin: auto; width: 24px; height: 24px; box-sizing: border-box; border-radius: 50%; display: none;' +
      ' border: 2px solid rgba(255,255,255,0.18); border-top-color: rgba(255,255,255,0.9); animation: hc-spin 0.8s linear infinite; pointer-events: none; }' +
      '.tile.loading:not(.off) .spin { display: block; }' +
      // Name on the image: a glass pill with the live dot, not a dark gradient over the bottom of the picture.
      '.label { position: absolute; left: 8px; bottom: 8px; max-width: calc(100% - 16px); box-sizing: border-box; display: inline-flex; align-items: center; gap: 6px;' +
      ' padding: 3px 10px 3px 8px; border-radius: 999px; font-size: 12px; font-weight: 500; line-height: 18px; color: #fff; pointer-events: none;' +
      ' background: var(--hc-glass); -webkit-backdrop-filter: blur(10px) saturate(1.3); backdrop-filter: blur(10px) saturate(1.3); }' +
      '.label .dot { animation: hc-live 2.4s ease-in-out infinite; }' +
      '.label .text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }' +
      ':is(.tile:fullscreen, .tile.pseudo) .label { font-size: 15px; padding: 5px 14px 5px 12px; left: max(16px, env(safe-area-inset-left));' +
      ' bottom: max(16px, env(safe-area-inset-bottom)); }' +
      '.tools { position: absolute; top: 8px; right: 8px; display: flex; gap: 6px; transition: opacity 0.15s; }' +
      ':is(.tile:fullscreen, .tile.pseudo) .tools { top: max(16px, env(safe-area-inset-top)); right: max(16px, env(safe-area-inset-right)); }' +
      '.btn { width: 30px; height: 30px; box-sizing: border-box; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;' +
      ' color: #fff; background: var(--hc-glass); border: 1px solid var(--hc-glass-line); -webkit-backdrop-filter: blur(10px) saturate(1.3); backdrop-filter: blur(10px) saturate(1.3);' +
      ' -webkit-tap-highlight-color: transparent; user-select: none; transition: background 0.15s, transform 0.1s; }' +
      '.btn:hover { background: rgba(14, 16, 20, 0.66); }' +
      '.btn:active { transform: scale(0.94); }' +
      '.btn:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }' +
      '.btn ha-icon { --mdc-icon-size: 17px; }' +
      '.tile.ptz-open .btn.ptz, .btn.sound.on, .move:active { background: var(--primary-color, #03a9f4); border-color: transparent; }' +
      // Narrow tiles: the up arrow would run into the other buttons.
      '.tile.ptz-open .tools .btn:not(.ptz) { display: none; }' +
      '.pad { display: none; }' +
      '.tile.ptz-open .pad, :is(.tile:fullscreen, .tile.pseudo) .pad { display: block; }' +
      '.move { --s: 40px; position: absolute; width: var(--s); height: var(--s); touch-action: none; }' +
      '.move ha-icon { --mdc-icon-size: 26px; }' +
      '.move.left { left: 8px; top: calc(50% - var(--s) / 2); }' +
      '.move.right { right: 8px; top: calc(50% - var(--s) / 2); }' +
      '.move.up { top: 8px; left: calc(50% - var(--s) / 2); }' +
      '.move.down { bottom: 8px; left: calc(50% - var(--s) / 2); }' +
      '.move.dis { opacity: 0.35; cursor: default; }' +
      // Fullscreen: the arrows gather in a round pad at the bottom right, under the thumb on a phone and
      // within reach of each other on a large screen; the buttons grow.
      ':is(.tile:fullscreen, .tile.pseudo) .pad { position: absolute; width: 164px; height: 164px; border-radius: 50%;' +
      ' right: max(24px, env(safe-area-inset-right)); bottom: max(24px, env(safe-area-inset-bottom));' +
      ' background: var(--hc-glass); border: 1px solid var(--hc-glass-line); -webkit-backdrop-filter: blur(12px) saturate(1.3); backdrop-filter: blur(12px) saturate(1.3); }' +
      ':is(.tile:fullscreen, .tile.pseudo) .pad::after { content: ""; position: absolute; inset: 0; margin: auto; width: 12px; height: 12px; border-radius: 50%;' +
      ' background: rgba(255,255,255,0.22); pointer-events: none; }' +
      ':is(.tile:fullscreen, .tile.pseudo) .move { --s: 52px; background: transparent; border-color: transparent; -webkit-backdrop-filter: none; backdrop-filter: none; }' +
      ':is(.tile:fullscreen, .tile.pseudo) .move:hover { background: rgba(255,255,255,0.12); }' +
      ':is(.tile:fullscreen, .tile.pseudo) .move ha-icon { --mdc-icon-size: 32px; }' +
      ':is(.tile:fullscreen, .tile.pseudo) .move.left { left: 4px; }' +
      ':is(.tile:fullscreen, .tile.pseudo) .move.right { right: 4px; }' +
      ':is(.tile:fullscreen, .tile.pseudo) .move.up { top: 4px; }' +
      ':is(.tile:fullscreen, .tile.pseudo) .move.down { bottom: 4px; }' +
      ':is(.tile:fullscreen, .tile.pseudo) .btn:not(.move) { width: 40px; height: 40px; }' +
      ':is(.tile:fullscreen, .tile.pseudo) .btn:not(.move) ha-icon { --mdc-icon-size: 20px; }' +
      // Mouse: the buttons show on hover, so the image stays clear. Touch: always shown, and larger.
      '@media (hover: hover) and (pointer: fine) {' +
      ' .tile:not(:hover):not(:focus-within):not(.ptz-open) .tools { opacity: 0; } }' +
      '@media (pointer: coarse) { .btn { width: 36px; height: 36px; } .btn ha-icon { --mdc-icon-size: 20px; } .move { --s: 46px; } }' +
      '@media (prefers-reduced-motion: reduce) { .label .dot, .spin, .pending ha-icon { animation: none; } }' +
      // Every camera hidden: a quiet panel where the grid would be, saying how to bring one back.
      '.asleep { display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 64px; padding: 12px; box-sizing: border-box;' +
      ' border-radius: 12px; border: 1px dashed var(--divider-color, rgba(128,128,128,0.3)); font-size: 12px; color: var(--secondary-text-color); text-align: center; }' +
      '.asleep ha-icon { --mdc-icon-size: 18px; color: var(--hc-on); }' +
      '.empty { display: flex; align-items: center; gap: 10px; color: var(--secondary-text-color); }' +
      '</style>'
    );
  }

  _onClick(ev) {
    const path = ev.composedPath();
    const q = path.find((n) => n.dataset?.quality)?.dataset.quality;
    if (q) {
      if ((q === 'hd') !== this._hd()) this._toggleQuality();
      return;
    }
    const toggle = path.find((n) => n.dataset?.toggle);
    if (toggle) {
      const id = toggle.dataset.toggle;
      // One toggle at a time: taps while the switch has not answered are ignored.
      if (this._isPending(id)) return;
      this._hass.callService(id.split('.')[0], 'toggle', { entity_id: id });
      this._setPending(id);
      return;
    }
    const tile = path.find((n) => n.dataset?.cam);
    if (!tile) return;
    const btn = path.find((n) => n.dataset?.action);
    const action = btn?.dataset.action;
    if (action === 'ptz') tile.classList.toggle('ptz-open');
    else if (action === 'sound') this._toggleSound(tile);
    else if (action === 'fullscreen') this._toggleFullscreen(tile);
    else if (action === 'details') this._moreInfo(tile._entity);
    else if (action === 'move') {
      // A pointer press already moved the camera (pointerdown); a click without a pointer did not.
      if (ev.type !== 'click' || !ev.detail) this._move(btn);
    } else if (tile.classList.contains('ptz-open')) tile.classList.remove('ptz-open');
    // A tap on the image: fullscreen, and out of it again (arrows or not).
    else this._toggleFullscreen(tile);
  }

  _toggleQuality() {
    const c = this._config;
    const next = !this._hd();
    if (c.quality_entity) {
      const domain = c.quality_entity.split('.')[0];
      this._hass.callService(domain, 'select_option', {
        entity_id: c.quality_entity,
        option: next ? c.hd_option : c.sd_option,
      });
      return;
    }
    this._quality = next ? 'hd' : 'sd';
    try {
      localStorage.setItem(HC_QUALITY_KEY, this._quality);
    } catch (_e) {
      // storage unavailable: the choice lasts until the page reloads
    }
    this._update();
    // The other cards of this page follow (the storage event only reaches the other tabs).
    window.dispatchEvent(new CustomEvent(HC_QUALITY_EVENT));
  }
}

// Grid columns, never more than the cameras shown: one camera takes the full width.
function hcColumns(config, count) {
  return Math.max(1, Math.min(Number(config.columns) || 2, count));
}

// ── home-camera-card-editor (visual editor, built on HA's ha-form) ───────────
const HC_CAMERA_FIELDS = ['name', 'short_name', 'camera', 'sd', 'privacy', 'power', 'ptz'];

class HomeCameraCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = Object.assign({}, config);
    this._render();
  }

  set hass(hass) {
    const prevLang = this._hass?.language;
    this._hass = hass;
    if (this._form && prevLang === hass?.language) this._form.hass = hass;
    else this._render();
  }

  _lang() {
    const lang = (this._config?.language || this._hass?.language || 'en').split('-')[0];
    return HcI18n[lang] ? lang : 'en';
  }

  _schema() {
    const t = (k) => hcT(this._lang(), k);
    const camera = { entity: { domain: 'camera' } };
    const sw = { entity: { domain: ['switch', 'input_boolean'] } };
    const fields = {
      name: { selector: { text: {} } },
      short_name: { selector: { text: {} } },
      camera: { selector: camera, required: true },
      sd: { selector: camera },
      privacy: { selector: sw },
      power: { selector: sw },
      ptz: { selector: { text: {} } },
    };
    for (const k of HC_CAMERA_FIELDS) fields[k].label = t(`cf_${k}`);
    return [
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'title', selector: { text: {} } },
          { name: 'icon', selector: { icon: {} } },
        ],
      },
      { name: 'quality_entity', selector: { entity: { domain: ['input_select', 'select'] } } },
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'hd_option', selector: { text: {} } },
          { name: 'sd_option', selector: { text: {} } },
        ],
      },
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'columns', selector: { number: { min: 1, max: 4, step: 1, mode: 'box' } } },
          { name: 'aspect_ratio', selector: { text: {} } },
        ],
      },
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'show_summary', selector: { boolean: {} } },
          { name: 'show_badges', selector: { boolean: {} } },
        ],
      },
      {
        name: 'language',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'fr', label: 'Français' },
              { value: 'en', label: 'English' },
            ],
          },
        },
      },
      { name: 'cameras', selector: { object: { multiple: true, label_field: 'name', fields: fields } } },
    ];
  }

  _render() {
    if (!this._config || !this._hass) return;
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.addEventListener('value-changed', (ev) => this._valueChanged(ev));
      this.appendChild(this._form);
    }
    const lang = this._lang();
    this._form.hass = this._hass;
    this._form.schema = this._schema();
    this._form.computeLabel = (s) => hcT(lang, `ed_${s.name}`);
    this._form.computeHelper = (s) => {
      const key = `ed_${s.name}_helper`;
      const txt = hcT(lang, key);
      return txt === key ? undefined : txt;
    };
    const data = Object.assign({}, HC_DEFAULTS, this._config);
    // The object selector edits objects: a camera given as a bare entity id becomes { camera }.
    data.cameras = (data.cameras || []).map((cam) => (typeof cam === 'string' ? { camera: cam } : cam));
    this._form.data = data;
  }

  _valueChanged(ev) {
    ev.stopPropagation();
    let value = Object.assign({}, ev.detail.value);
    const lang = this._lang();
    const clean = (o) => {
      for (const k of Object.keys(o)) if (o[k] === '' || o[k] === null || o[k] === undefined) delete o[k];
      return o;
    };
    // Keep the YAML short: drop options left empty or at their default.
    clean(value);
    for (const key of Object.keys(HC_DEFAULTS)) if (value[key] === HC_DEFAULTS[key]) delete value[key];
    if (Array.isArray(value.cameras)) {
      value.cameras = value.cameras.map((cam) => {
        const out = clean(Object.assign({}, cam));
        return Object.keys(out).length === 1 && out.camera ? out.camera : out;
      });
      if (!value.cameras.length) delete value.cameras;
    }
    if (this._config.type) value = Object.assign({ type: this._config.type }, value);
    this._config = value;
    if (lang !== this._lang()) this._render();
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: value }, bubbles: true, composed: true }));
  }
}

if (!customElements.get('home-camera-card-editor')) {
  customElements.define('home-camera-card-editor', HomeCameraCardEditor);
}

if (!customElements.get('home-camera-card')) {
  customElements.define('home-camera-card', HomeCameraCard);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'home-camera-card',
    name: 'Home Camera Card',
    description: 'Every home camera in one grid, with privacy toggles, HD/SD switching and PTZ',
    preview: true,
    documentationURL: 'https://github.com/juju35/ha-home-camera-card',
  });
}

console.info(
  `%c HOME-CAMERA-CARD %c v${HOME_CAMERA_CARD_VERSION} `,
  'color:#fff;background:#03a9f4;font-weight:700',
  'color:#000;background:#fff',
);
