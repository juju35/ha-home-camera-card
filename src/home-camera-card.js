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
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Basculer entre HD et SD',
    privacy_on: '{c} : masquée, toucher pour l\'afficher',
    privacy_off: '{c} : visible, toucher pour la masquer',
    enable: 'Activer',
    disable: 'Désactiver',
    ed_title: 'Titre',
    ed_title_helper: 'Laisser vide pour « Caméras »',
    ed_icon: 'Icône',
    ed_quality_entity: 'Sélecteur de qualité',
    ed_quality_entity_helper: 'input_select avec les options HD et SD ; sans lui, la qualité se change sur la carte',
    ed_hd_option: 'Option HD',
    ed_sd_option: 'Option SD',
    ed_columns: 'Colonnes',
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
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Switch between HD and SD',
    privacy_on: '{c}: hidden, tap to show it',
    privacy_off: '{c}: visible, tap to hide it',
    enable: 'Enable',
    disable: 'Disable',
    ed_title: 'Title',
    ed_title_helper: 'Leave empty for "Cameras"',
    ed_icon: 'Icon',
    ed_quality_entity: 'Quality selector',
    ed_quality_entity_helper: 'input_select with HD and SD options; without it, the quality is switched on the card',
    ed_hd_option: 'HD option',
    ed_sd_option: 'SD option',
    ed_columns: 'Columns',
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

// True when an event path goes through one of the card's own controls (privacy toggle, HD/SD switch).
function hcOwnControl(path) {
  return path.some((n) => n.dataset?.toggle || n.dataset?.quality);
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
      this.shadowRoot.addEventListener('keydown', (ev) => {
        if (ev.key !== 'Enter' && ev.key !== ' ') return;
        // Only the card's own controls: keys bubbling up from the embedded cards keep their behaviour.
        if (!hcOwnControl(ev.composedPath())) return;
        ev.preventDefault();
        this._onClick(ev);
      });
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
    }
    window.addEventListener('storage', this._onQuality);
    window.addEventListener(HC_QUALITY_EVENT, this._onQuality);
    // The HD/SD choice may have changed while detached (listeners removed): catch up. _update() is
    // a no-op before setConfig/hass, and the signatures skip the render when nothing changed.
    this._update();
  }

  disconnectedCallback() {
    window.removeEventListener('storage', this._onQuality);
    window.removeEventListener(HC_QUALITY_EVENT, this._onQuality);
  }

  set hass(hass) {
    this._hass = hass;
    this._update();
    if (this._inner) this._inner.hass = hass;
    for (const el of this._fallback || []) el.hass = hass;
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

  _cameras() {
    return (this._config.cameras || []).map((raw, i) => hcCamera(this._hass, raw, i)).filter((cam) => cam.camera);
  }

  _update() {
    if (!this._config || !this._hass || !this.shadowRoot) return;
    const cams = this._cameras();
    const hd = this._hd();
    const visible = cams.filter((cam) => !this._hidden(cam));

    const headSig = JSON.stringify([
      this._lang(),
      hd,
      cams.map((cam) => [cam.name, cam.short, cam.privacy, cam.power, this._hidden(cam)]),
    ]);
    if (headSig !== this._headSig) {
      this._headSig = headSig;
      this._renderHead(cams, visible, hd);
    }

    const acc = !!customElements.get('advanced-camera-card');
    const viewSig = JSON.stringify([
      acc,
      hd,
      this._config.columns,
      this._config.camera_card,
      visible.map((cam) => [cam.key, cam.camera, cam.sd, cam.name, cam.ptz]),
    ]);
    if (viewSig !== this._viewSig) {
      this._viewSig = viewSig;
      this._renderView(visible, hd, acc);
    }
  }

  _chip(cls, attrs, icon, label, title) {
    return (
      `<span class="chip ${cls}" ${attrs} role="button" tabindex="0" title="${hcEsc(title)}">` +
      `<ha-icon icon="${icon}"></ha-icon><span>${hcEsc(label)}</span></span>`
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

    const quality = this._chip(
      hd ? 'hd' : 'sd',
      'data-quality="1"',
      hd ? 'mdi:high-definition' : 'mdi:standard-definition',
      this._t(hd ? 'hd' : 'sd'),
      this._t('quality_hint'),
    );

    let badges = '';
    if (c.show_badges) {
      badges = cams
        .filter((cam) => cam.privacy || cam.power)
        .map((cam) => {
          const off = this._hidden(cam);
          const target = cam.privacy || cam.power;
          return this._chip(
            off ? 'private' : 'exposed',
            `data-toggle="${hcEsc(target)}"`,
            off ? 'mdi:eye-lock' : 'mdi:eye-lock-open',
            single ? this._t(off ? 'enable' : 'disable') : cam.short,
            this._t(off ? 'privacy_on' : 'privacy_off', { c: cam.name }),
          );
        })
        .join('');
    }

    // A single camera with a toggle: the toggle sits on the right of the title, the quality under it
    // (only while the camera films: once it is hidden, the line says so instead).
    let right = quality;
    let side = '';
    let sub = summary ? `<div class="summary">${hcEsc(summary)}</div>` : '';
    if (single && badges) {
      // Icon only, the size of the header icon; the text stays in the tooltip and for screen readers.
      const cam = cams[0];
      const off = this._hidden(cam);
      const label = this._t(off ? 'enable' : 'disable');
      right = '';
      side =
        `<span class="toggle ${off ? 'private' : 'exposed'}" data-toggle="${hcEsc(cam.privacy || cam.power)}" role="button" tabindex="0"` +
        ` title="${hcEsc(label)}" aria-label="${hcEsc(label)}"><ha-icon icon="${off ? 'mdi:eye-lock' : 'mdi:eye-lock-open'}"></ha-icon></span>`;
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

  // advanced-camera-card config: the visible cameras, in HD or SD, with their PTZ buttons.
  _accConfig(visible, hd) {
    const c = this._config;
    const cameras = visible.map((cam) => {
      const out = { camera_entity: hd || !cam.sd ? cam.camera : cam.sd, title: cam.name, id: cam.key };
      if (cam.ptz) {
        out.ptz = {};
        for (const d of HC_PTZ_DIRS) {
          if (!cam.ptz[d]) continue;
          out.ptz[`actions_${d}`] = {
            action: 'perform-action',
            perform_action: 'button.press',
            target: { entity_id: cam.ptz[d] },
          };
        }
      }
      return out;
    });
    const enabled = { enabled: true };
    const base = {
      type: 'custom:advanced-camera-card',
      cameras: cameras,
      view: { default: 'live' },
      live: { display: { mode: visible.length > 1 ? 'grid' : 'single', grid_columns: hcColumns(c, visible) } },
      menu: {
        style: 'overlay',
        position: 'top',
        alignment: 'left',
        buttons: {
          cameras: enabled,
          live: enabled,
          clips: enabled,
          snapshots: enabled,
          ptz: enabled,
          fullscreen: enabled,
        },
      },
      status_bar: { style: 'hover-card', position: 'bottom' },
    };
    return hcMerge(base, c.camera_card || {});
  }

  async _renderView(visible, hd, acc) {
    const sig = this._viewSig;
    const view = this.shadowRoot.querySelector('.view');
    this._inner = null;
    this._fallback = null;
    if (!visible.length) {
      view.innerHTML = this._config.cameras?.length
        ? ''
        : `<div class="empty"><ha-icon icon="mdi:cctv-off"></ha-icon>${hcEsc(this._t('no_cameras'))}</div>`;
      return;
    }
    const helpers = window.loadCardHelpers ? await window.loadCardHelpers() : null;
    if (sig !== this._viewSig) return; // a newer render started meanwhile
    if (!helpers) {
      view.innerHTML = '';
      return;
    }
    if (acc) {
      const el = helpers.createCardElement(this._accConfig(visible, hd));
      el.hass = this._hass;
      this._inner = el;
      view.replaceChildren(el);
      return;
    }
    // Without advanced-camera-card: Home Assistant's own picture-entity cards, live, in a grid.
    const grid = document.createElement('div');
    grid.className = 'grid';
    grid.style.gridTemplateColumns = `repeat(${hcColumns(this._config, visible)}, minmax(0, 1fr))`;
    this._fallback = visible.map((cam) => {
      const el = helpers.createCardElement({
        type: 'picture-entity',
        entity: hd || !cam.sd ? cam.camera : cam.sd,
        name: cam.name,
        camera_view: 'live',
        show_state: false,
      });
      el.hass = this._hass;
      grid.appendChild(el);
      return el;
    });
    view.replaceChildren(grid);
    // advanced-camera-card may load after this card: switch to it once it is defined.
    if (!this._waitAcc) {
      this._waitAcc = customElements.whenDefined('advanced-camera-card').then(() => {
        this._viewSig = null;
        this._update();
      });
    }
  }

  _styles() {
    return (
      '<style>' +
      ':host { display: block; --hc-on: var(--success-color, #43a047); --hc-off: var(--error-color, #db4437); }' +
      'ha-card { box-sizing: border-box; padding: 12px; display: flex; flex-direction: column; gap: 10px; overflow: hidden; }' +
      '.header { display: flex; align-items: center; gap: 10px; }' +
      '.hicon { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center;' +
      ' --hc-c: var(--primary-color, #03a9f4); background: color-mix(in srgb, var(--hc-c) 15%, transparent); color: var(--hc-c); }' +
      '.hicon.off { --hc-c: var(--secondary-text-color); }' +
      '.hicon ha-icon { --mdc-icon-size: 24px; }' +
      '.titles { flex: 1; min-width: 0; }' +
      '.name-row { display: flex; align-items: center; gap: 8px; }' +
      '.name { flex: 1; min-width: 0; font-size: 16px; font-weight: 500; line-height: 1.25; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }' +
      '.summary { font-size: 12px; line-height: 1.35; margin-top: 2px; color: var(--secondary-text-color); }' +
      '.chips { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px; }' +
      '.chips.badges, .chips.sub { justify-content: flex-start; }' +
      '.chips.sub { margin-top: 3px; }' +
      '.toggle { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; cursor: pointer;' +
      ' --hc-c: var(--hc-off); background: color-mix(in srgb, var(--hc-c) 15%, transparent); color: var(--hc-c); }' +
      '.toggle.private { --hc-c: var(--hc-on); }' +
      '.toggle ha-icon { --mdc-icon-size: 22px; }' +
      '.chip { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500; padding: 1px 8px 1px 5px; border-radius: 12px; cursor: pointer;' +
      ' background: var(--secondary-background-color, rgba(128,128,128,0.12)); color: var(--primary-text-color); white-space: nowrap; user-select: none; }' +
      '.chip ha-icon { --mdc-icon-size: 13px; color: var(--secondary-text-color); }' +
      '.chip.hd ha-icon { color: var(--primary-color, #03a9f4); }' +
      '.chip.private ha-icon { color: var(--hc-on); }' +
      '.chip.exposed ha-icon { color: var(--hc-off); }' +
      '.view:empty { display: none; }' +
      '.grid { display: grid; gap: 6px; }' +
      '.empty { display: flex; align-items: center; gap: 10px; color: var(--secondary-text-color); }' +
      '</style>'
    );
  }

  _onClick(ev) {
    const path = ev.composedPath();
    if (path.some((n) => n.dataset?.quality)) {
      this._toggleQuality();
      return;
    }
    const toggle = path.find((n) => n.dataset?.toggle);
    if (toggle) {
      const id = toggle.dataset.toggle;
      this._hass.callService(id.split('.')[0], 'toggle', { entity_id: id });
    }
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
function hcColumns(config, visible) {
  return Math.max(1, Math.min(Number(config.columns) || 2, visible.length));
}

// Deep merge for camera_card overrides: objects merge, everything else replaces.
function hcMerge(base, extra) {
  const out = Object.assign({}, base);
  for (const k of Object.keys(extra)) {
    const a = out[k];
    const b = extra[k];
    const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
    out[k] = isObj(a) && isObj(b) ? hcMerge(a, b) : b;
  }
  return out;
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
