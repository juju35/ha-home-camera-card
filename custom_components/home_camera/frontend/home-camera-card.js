const HOME_CAMERA_CARD_VERSION = '4.3.1';

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
    privacy_unavailable: '{c} : indisponible',
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
    ed_columns_wall_helper: 'Vide : autant que la largeur le permet',
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
    zoom_in: 'Afficher la carte complète',
    zoom_out: 'Revenir à la vue compacte',
    ed_zoom: 'Bouton détail',
    motion: 'Mouvement détecté',
    cam_hidden: '{c} : masquée',
    ed_show_motion: 'Pastille de mouvement',
    cf_motion: 'Capteur de mouvement (pastille sur l\'image)',
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
    privacy_unavailable: '{c}: unavailable',
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
    ed_columns_wall_helper: 'Empty: as many as the width takes',
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
    zoom_in: 'Show the full card',
    zoom_out: 'Back to the compact view',
    ed_zoom: 'Detail button',
    motion: 'Motion detected',
    cam_hidden: '{c}: hidden',
    ed_show_motion: 'Motion badge',
    cf_motion: 'Motion sensor (badge on the image)',
  },
  de: {
    title: 'Kameras',
    live_one: '{n} Kamera live',
    live_many: '{n} Kameras live',
    hidden_one: '{n} ausgeblendet',
    hidden_many: '{n} ausgeblendet',
    all_hidden: 'Alle Kameras sind ausgeblendet',
    one_hidden: 'Kamera deaktiviert',
    no_cameras: 'Keine Kamera konfiguriert',
    hint_all: 'Tippe auf ein Badge, um eine Kamera anzuzeigen',
    live: 'Live',
    hint_one: 'Aktiviere die Kamera, um sie hier zu sehen',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Zwischen HD und SD wechseln',
    privacy_on: '{c}: ausgeblendet, tippen zum Anzeigen',
    privacy_off: '{c}: sichtbar, tippen zum Ausblenden',
    privacy_unavailable: '{c}: nicht verfügbar',
    enable: 'Aktivieren',
    disable: 'Deaktivieren',
    unavailable: 'Nicht verfügbar',
    ptz: 'Schwenken & Neigen',
    open: '{c} im Vollbild anzeigen',
    exit_fullscreen: 'Vollbild beenden',
    details: 'Details',
    pending: 'Wird aktualisiert…',
    sound_on: 'Ton einschalten',
    sound_off: 'Ton ausschalten',
    move_left: 'Nach links',
    move_right: 'Nach rechts',
    move_up: 'Nach oben',
    move_down: 'Nach unten',
    ed_title: 'Titel',
    ed_title_helper: 'Leer lassen für „Kameras“',
    ed_icon: 'Symbol',
    ed_quality_entity: 'Qualitätsauswahl',
    ed_quality_entity_helper: 'input_select mit den Optionen HD und SD; ohne sie wird die Qualität auf der Karte umgeschaltet',
    ed_hd_option: 'HD-Option',
    ed_sd_option: 'SD-Option',
    ed_columns: 'Spalten',
    ed_columns_wall_helper: 'Leer: so viele, wie die Breite zulässt',
    ed_aspect_ratio: 'Seitenverhältnis der Kacheln',
    ed_aspect_ratio_helper: 'Zum Beispiel 16:9 (Standard) oder 4:3',
    ed_show_summary: 'Zusammenfassung',
    ed_show_badges: 'Privatsphäre-Badges',
    ed_language: 'Sprache',
    ed_language_helper: 'Leer lassen, um der Sprache von Home Assistant zu folgen',
    ed_cameras: 'Kameras',
    cf_name: 'Name',
    cf_short_name: 'Kurzname (Badge)',
    cf_camera: 'Kamera (HD)',
    cf_sd: 'SD-Kamera',
    cf_privacy: 'Privatsphäre-Schalter (an = ausgeblendet)',
    cf_power: 'Stromversorgung (aus = ausgeblendet)',
    cf_ptz: 'PTZ-Präfix, zum Beispiel button.wohnzimmer_move',
    zoom_in: 'Vollständige Karte anzeigen',
    zoom_out: 'Zurück zur kompakten Ansicht',
    ed_zoom: 'Detail-Schaltfläche',
    motion: 'Bewegung erkannt',
    cam_hidden: '{c}: ausgeblendet',
    ed_show_motion: 'Bewegungs-Badge',
    cf_motion: 'Bewegungssensor (Badge auf dem Bild)',
  },
  es: {
    title: 'Cámaras',
    live_one: '{n} cámara en directo',
    live_many: '{n} cámaras en directo',
    hidden_one: '{n} oculta',
    hidden_many: '{n} ocultas',
    all_hidden: 'Todas las cámaras están ocultas',
    one_hidden: 'Cámara desactivada',
    no_cameras: 'No hay ninguna cámara configurada',
    hint_all: 'Toca una insignia para mostrar una cámara',
    live: 'En directo',
    hint_one: 'Activa la cámara para verla aquí',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Cambiar entre HD y SD',
    privacy_on: '{c}: oculta, toca para mostrarla',
    privacy_off: '{c}: visible, toca para ocultarla',
    privacy_unavailable: '{c}: no disponible',
    enable: 'Activar',
    disable: 'Desactivar',
    unavailable: 'No disponible',
    ptz: 'Orientación',
    open: 'Mostrar {c} en pantalla completa',
    exit_fullscreen: 'Salir de pantalla completa',
    details: 'Detalles',
    pending: 'Actualizando…',
    sound_on: 'Activar sonido',
    sound_off: 'Silenciar',
    move_left: 'Izquierda',
    move_right: 'Derecha',
    move_up: 'Arriba',
    move_down: 'Abajo',
    ed_title: 'Título',
    ed_title_helper: 'Déjalo vacío para «Cámaras»',
    ed_icon: 'Icono',
    ed_quality_entity: 'Selector de calidad',
    ed_quality_entity_helper: 'input_select con las opciones HD y SD; sin él, la calidad se cambia en la tarjeta',
    ed_hd_option: 'Opción HD',
    ed_sd_option: 'Opción SD',
    ed_columns: 'Columnas',
    ed_columns_wall_helper: 'Vacío: tantas como quepan a lo ancho',
    ed_aspect_ratio: 'Relación de aspecto de las miniaturas',
    ed_aspect_ratio_helper: 'Por ejemplo 16:9 (predeterminado) o 4:3',
    ed_show_summary: 'Resumen',
    ed_show_badges: 'Insignias de privacidad',
    ed_language: 'Idioma',
    ed_language_helper: 'Déjalo vacío para seguir el idioma de Home Assistant',
    ed_cameras: 'Cámaras',
    cf_name: 'Nombre',
    cf_short_name: 'Nombre corto (insignia)',
    cf_camera: 'Cámara (HD)',
    cf_sd: 'Cámara SD',
    cf_privacy: 'Interruptor de privacidad (encendido = oculta)',
    cf_power: 'Alimentación (apagada = oculta)',
    cf_ptz: 'Prefijo PTZ, por ejemplo button.salon_move',
    zoom_in: 'Mostrar la tarjeta completa',
    zoom_out: 'Volver a la vista compacta',
    ed_zoom: 'Botón de detalle',
    motion: 'Movimiento detectado',
    cam_hidden: '{c}: oculta',
    ed_show_motion: 'Insignia de movimiento',
    cf_motion: 'Sensor de movimiento (insignia en la imagen)',
  },
  sr: {
    title: 'Камере',
    live_one: '{n} камера уживо',
    live_many: 'Камере уживо: {n}',
    hidden_one: '{n} скривена',
    hidden_many: 'Скривене: {n}',
    all_hidden: 'Све камере су скривене',
    one_hidden: 'Камера је онемогућена',
    no_cameras: 'Нема подешених камера',
    hint_all: 'Додирните значку да прикажете камеру',
    live: 'Уживо',
    hint_one: 'Омогућите камеру да бисте је видели овде',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Пребацивање између HD и SD квалитета',
    privacy_on: '{c}: скривена, додирните да је прикажете',
    privacy_off: '{c}: видљива, додирните да је сакријете',
    privacy_unavailable: '{c}: недоступна',
    enable: 'Омогући',
    disable: 'Онемогући',
    unavailable: 'Недоступно',
    ptz: 'Окретање и нагиб (PTZ)',
    open: 'Прикажи {c} преко целог екрана',
    exit_fullscreen: 'Затвори цео екран',
    details: 'Детаљи',
    pending: 'Ажурирање…',
    sound_on: 'Укључи звук',
    sound_off: 'Искључи звук',
    move_left: 'Лево',
    move_right: 'Десно',
    move_up: 'Горе',
    move_down: 'Доле',
    ed_title: 'Наслов',
    ed_title_helper: 'Остави празно за „Камере“',
    ed_icon: 'Икона',
    ed_quality_entity: 'Бирач квалитета',
    ed_quality_entity_helper: 'input_select са опцијама HD и SD; без овога, квалитет се мења директно на картици',
    ed_hd_option: 'HD опција',
    ed_sd_option: 'SD опција',
    ed_columns: 'Колоне',
    ed_columns_wall_helper: 'Празно: колико стане по ширини',
    ed_aspect_ratio: 'Пропорција плочице (Aspect ratio)',
    ed_aspect_ratio_helper: 'На пример 16:9 (подразумевано) или 4:3',
    ed_show_summary: 'Садржај / Резиме',
    ed_show_badges: 'Значке приватности',
    ed_language: 'Језик',
    ed_language_helper: 'Остави празно да прати језик Home Assistant-а',
    ed_cameras: 'Камере',
    cf_name: 'Назив',
    cf_short_name: 'Скраћени назив (значка)',
    cf_camera: 'Камера (HD)',
    cf_sd: 'SD камера',
    cf_privacy: 'Прекидач приватности (укључено = скривено)',
    cf_power: 'Напајање (искључено = скривено)',
    cf_ptz: 'PTZ префикс, на пример button.living_room_move',
    zoom_in: 'Прикажи целу картицу',
    zoom_out: 'Назад на компактни приказ',
    ed_zoom: 'Дугме за детаље',
    motion: 'Откривен покрет',
    cam_hidden: '{c}: скривена',
    ed_show_motion: 'Значка покрета',
    cf_motion: 'Сензор покрета (значка на слици)',
  },
  'sr-Latn': {
    title: 'Kamere',
    live_one: '{n} kamera uživo',
    live_many: 'Kamere uživo: {n}',
    hidden_one: '{n} skrivena',
    hidden_many: 'Skrivene: {n}',
    all_hidden: 'Sve kamere su skrivene',
    one_hidden: 'Kamera je onemogućena',
    no_cameras: 'Nema podešenih kamera',
    hint_all: 'Dodirnite značku da prikažete kameru',
    live: 'Uživo',
    hint_one: 'Omogućite kameru da biste je videli ovde',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Prebacivanje između HD i SD kvaliteta',
    privacy_on: '{c}: skrivena, dodirnite da je prikažete',
    privacy_off: '{c}: vidljiva, dodirnite da je sakrijete',
    privacy_unavailable: '{c}: nedostupna',
    enable: 'Omogući',
    disable: 'Onemogući',
    unavailable: 'Nedostupno',
    ptz: 'Okretanje i nagib (PTZ)',
    open: 'Prikaži {c} preko celog ekrana',
    exit_fullscreen: 'Zatvori ceo ekran',
    details: 'Detalji',
    pending: 'Ažuriranje…',
    sound_on: 'Uključi zvuk',
    sound_off: 'Isključi zvuk',
    move_left: 'Levo',
    move_right: 'Desno',
    move_up: 'Gore',
    move_down: 'Dole',
    ed_title: 'Naslov',
    ed_title_helper: 'Ostavi prazno za „Kamere“',
    ed_icon: 'Ikona',
    ed_quality_entity: 'Birač kvaliteta',
    ed_quality_entity_helper: 'input_select sa opcijama HD i SD; bez ovoga, kvalitet se menja direktno na kartici',
    ed_hd_option: 'HD opcija',
    ed_sd_option: 'SD opcija',
    ed_columns: 'Kolone',
    ed_columns_wall_helper: 'Prazno: koliko stane po širini',
    ed_aspect_ratio: 'Proporcija pločice (Aspect ratio)',
    ed_aspect_ratio_helper: 'Na primer 16:9 (podrazumevano) ili 4:3',
    ed_show_summary: 'Sadržaj / Rezime',
    ed_show_badges: 'Značke privatnosti',
    ed_language: 'Jezik',
    ed_language_helper: 'Ostavi prazno da prati jezik Home Assistant-a',
    ed_cameras: 'Kamere',
    cf_name: 'Naziv',
    cf_short_name: 'Skraćeni naziv (značka)',
    cf_camera: 'Kamera (HD)',
    cf_sd: 'SD kamera',
    cf_privacy: 'Prekidač privatnosti (uključeno = skriveno)',
    cf_power: 'Napajanje (isključeno = skriveno)',
    cf_ptz: 'PTZ prefiks, na primer button.living_room_move',
    zoom_in: 'Prikaži celu karticu',
    zoom_out: 'Nazad na kompaktni prikaz',
    ed_zoom: 'Dugme za detalje',
    motion: 'Otkriven pokret',
    cam_hidden: '{c}: skrivena',
    ed_show_motion: 'Značka pokreta',
    cf_motion: 'Senzor pokreta (značka na slici)',
  },
  it: {
    title: 'Telecamere',
    live_one: '{n} telecamera in diretta',
    live_many: '{n} telecamere in diretta',
    hidden_one: '{n} nascosta',
    hidden_many: '{n} nascoste',
    all_hidden: 'Tutte le telecamere sono nascoste',
    one_hidden: 'Telecamera disattivata',
    no_cameras: 'Nessuna telecamera configurata',
    hint_all: 'Tocca un badge per mostrare una telecamera',
    live: 'In diretta',
    hint_one: 'Attiva la telecamera per vederla qui',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Passa da HD a SD e viceversa',
    privacy_on: '{c}: nascosta, tocca per mostrarla',
    privacy_off: '{c}: visibile, tocca per nasconderla',
    privacy_unavailable: '{c}: non disponibile',
    enable: 'Attiva',
    disable: 'Disattiva',
    unavailable: 'Non disponibile',
    ptz: 'Rotazione e inclinazione',
    open: 'Mostra {c} a schermo intero',
    exit_fullscreen: 'Esci da schermo intero',
    details: 'Dettagli',
    pending: 'Aggiornamento…',
    sound_on: 'Attiva audio',
    sound_off: 'Disattiva audio',
    move_left: 'A sinistra',
    move_right: 'A destra',
    move_up: 'In alto',
    move_down: 'In basso',
    ed_title: 'Titolo',
    ed_title_helper: 'Lascia vuoto per «Telecamere»',
    ed_icon: 'Icona',
    ed_quality_entity: 'Selettore di qualità',
    ed_quality_entity_helper: 'input_select con le opzioni HD e SD; senza di esso, la qualità si cambia sulla scheda',
    ed_hd_option: 'Opzione HD',
    ed_sd_option: 'Opzione SD',
    ed_columns: 'Colonne',
    ed_columns_wall_helper: 'Vuoto: quante ne entrano in larghezza',
    ed_aspect_ratio: 'Proporzioni dei riquadri',
    ed_aspect_ratio_helper: 'Ad esempio 16:9 (predefinito) o 4:3',
    ed_show_summary: 'Riepilogo',
    ed_show_badges: 'Badge di privacy',
    ed_language: 'Lingua',
    ed_language_helper: 'Lascia vuoto per seguire la lingua di Home Assistant',
    ed_cameras: 'Telecamere',
    cf_name: 'Nome',
    cf_short_name: 'Nome breve (badge)',
    cf_camera: 'Telecamera (HD)',
    cf_sd: 'Telecamera SD',
    cf_privacy: 'Interruttore privacy (attivo = nascosta)',
    cf_power: 'Alimentazione (spenta = nascosta)',
    cf_ptz: 'Prefisso PTZ, ad esempio button.soggiorno_move',
    zoom_in: 'Mostra la scheda completa',
    zoom_out: 'Torna alla vista compatta',
    ed_zoom: 'Pulsante dettagli',
    motion: 'Movimento rilevato',
    cam_hidden: '{c}: nascosta',
    ed_show_motion: 'Badge di movimento',
    cf_motion: 'Sensore di movimento (badge sull\'immagine)',
  },
  nl: {
    title: 'Camera\'s',
    live_one: '{n} camera live',
    live_many: '{n} camera\'s live',
    hidden_one: '{n} verborgen',
    hidden_many: '{n} verborgen',
    all_hidden: 'Alle camera\'s zijn verborgen',
    one_hidden: 'Camera uitgeschakeld',
    no_cameras: 'Geen camera geconfigureerd',
    hint_all: 'Tik op een badge om een camera te tonen',
    live: 'Live',
    hint_one: 'Schakel de camera in om hem hier te zien',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Wisselen tussen HD en SD',
    privacy_on: '{c}: verborgen, tik om te tonen',
    privacy_off: '{c}: zichtbaar, tik om te verbergen',
    privacy_unavailable: '{c}: niet beschikbaar',
    enable: 'Inschakelen',
    disable: 'Uitschakelen',
    unavailable: 'Niet beschikbaar',
    ptz: 'Pannen & kantelen',
    open: '{c} op volledig scherm tonen',
    exit_fullscreen: 'Volledig scherm afsluiten',
    details: 'Details',
    pending: 'Bijwerken…',
    sound_on: 'Geluid aan',
    sound_off: 'Geluid uit',
    move_left: 'Naar links',
    move_right: 'Naar rechts',
    move_up: 'Omhoog',
    move_down: 'Omlaag',
    ed_title: 'Titel',
    ed_title_helper: 'Leeg laten voor “Camera\'s”',
    ed_icon: 'Pictogram',
    ed_quality_entity: 'Kwaliteitskeuze',
    ed_quality_entity_helper: 'input_select met de opties HD en SD; zonder deze wordt de kwaliteit op de kaart gewisseld',
    ed_hd_option: 'HD-optie',
    ed_sd_option: 'SD-optie',
    ed_columns: 'Kolommen',
    ed_columns_wall_helper: 'Leeg: zoveel als de breedte toelaat',
    ed_aspect_ratio: 'Beeldverhouding van de tegels',
    ed_aspect_ratio_helper: 'Bijvoorbeeld 16:9 (standaard) of 4:3',
    ed_show_summary: 'Samenvatting',
    ed_show_badges: 'Privacybadges',
    ed_language: 'Taal',
    ed_language_helper: 'Leeg laten om de taal van Home Assistant te volgen',
    ed_cameras: 'Camera\'s',
    cf_name: 'Naam',
    cf_short_name: 'Korte naam (badge)',
    cf_camera: 'Camera (HD)',
    cf_sd: 'SD-camera',
    cf_privacy: 'Privacyschakelaar (aan = verborgen)',
    cf_power: 'Voeding (uit = verborgen)',
    cf_ptz: 'PTZ-voorvoegsel, bijvoorbeeld button.woonkamer_move',
    zoom_in: 'Volledige kaart tonen',
    zoom_out: 'Terug naar de compacte weergave',
    ed_zoom: 'Detailknop',
    motion: 'Beweging gedetecteerd',
    cam_hidden: '{c}: verborgen',
    ed_show_motion: 'Bewegingsbadge',
    cf_motion: 'Bewegingssensor (badge op het beeld)',
  },
  pt: {
    title: 'Câmaras',
    live_one: '{n} câmara em direto',
    live_many: '{n} câmaras em direto',
    hidden_one: '{n} oculta',
    hidden_many: '{n} ocultas',
    all_hidden: 'Todas as câmaras estão ocultas',
    one_hidden: 'Câmara desativada',
    no_cameras: 'Nenhuma câmara configurada',
    hint_all: 'Toque num emblema para mostrar uma câmara',
    live: 'Em direto',
    hint_one: 'Ative a câmara para a ver aqui',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Alternar entre HD e SD',
    privacy_on: '{c}: oculta, toque para a mostrar',
    privacy_off: '{c}: visível, toque para a ocultar',
    privacy_unavailable: '{c}: indisponível',
    enable: 'Ativar',
    disable: 'Desativar',
    unavailable: 'Indisponível',
    ptz: 'Rotação e inclinação',
    open: 'Mostrar {c} em ecrã inteiro',
    exit_fullscreen: 'Sair do ecrã inteiro',
    details: 'Detalhes',
    pending: 'A atualizar…',
    sound_on: 'Ativar som',
    sound_off: 'Desativar som',
    move_left: 'Para a esquerda',
    move_right: 'Para a direita',
    move_up: 'Para cima',
    move_down: 'Para baixo',
    ed_title: 'Título',
    ed_title_helper: 'Deixar vazio para «Câmaras»',
    ed_icon: 'Ícone',
    ed_quality_entity: 'Seletor de qualidade',
    ed_quality_entity_helper: 'input_select com as opções HD e SD; sem ele, a qualidade é alterada no cartão',
    ed_hd_option: 'Opção HD',
    ed_sd_option: 'Opção SD',
    ed_columns: 'Colunas',
    ed_columns_wall_helper: 'Vazio: tantas quantas couberem na largura',
    ed_aspect_ratio: 'Proporção das miniaturas',
    ed_aspect_ratio_helper: 'Por exemplo 16:9 (predefinição) ou 4:3',
    ed_show_summary: 'Resumo',
    ed_show_badges: 'Emblemas de privacidade',
    ed_language: 'Idioma',
    ed_language_helper: 'Deixar vazio para seguir o idioma do Home Assistant',
    ed_cameras: 'Câmaras',
    cf_name: 'Nome',
    cf_short_name: 'Nome curto (emblema)',
    cf_camera: 'Câmara (HD)',
    cf_sd: 'Câmara SD',
    cf_privacy: 'Interruptor de privacidade (ligado = oculta)',
    cf_power: 'Alimentação (desligada = oculta)',
    cf_ptz: 'Prefixo PTZ, por exemplo button.sala_move',
    zoom_in: 'Mostrar o cartão completo',
    zoom_out: 'Voltar à vista compacta',
    ed_zoom: 'Botão de detalhe',
    motion: 'Movimento detetado',
    cam_hidden: '{c}: oculta',
    ed_show_motion: 'Emblema de movimento',
    cf_motion: 'Sensor de movimento (emblema na imagem)',
  },
  pl: {
    title: 'Kamery',
    live_one: '{n} kamera na żywo',
    live_many: 'Kamery na żywo: {n}',
    hidden_one: '{n} ukryta',
    hidden_many: 'Ukryte: {n}',
    all_hidden: 'Wszystkie kamery są ukryte',
    one_hidden: 'Kamera wyłączona',
    no_cameras: 'Nie skonfigurowano żadnej kamery',
    hint_all: 'Dotknij plakietki, aby pokazać kamerę',
    live: 'Na żywo',
    hint_one: 'Włącz kamerę, aby ją tu zobaczyć',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Przełącz między HD a SD',
    privacy_on: '{c}: ukryta, dotknij, aby pokazać',
    privacy_off: '{c}: widoczna, dotknij, aby ukryć',
    privacy_unavailable: '{c}: niedostępna',
    enable: 'Włącz',
    disable: 'Wyłącz',
    unavailable: 'Niedostępna',
    ptz: 'Obrót i pochylenie',
    open: 'Pokaż {c} na pełnym ekranie',
    exit_fullscreen: 'Zamknij pełny ekran',
    details: 'Szczegóły',
    pending: 'Aktualizowanie…',
    sound_on: 'Włącz dźwięk',
    sound_off: 'Wycisz',
    move_left: 'W lewo',
    move_right: 'W prawo',
    move_up: 'W górę',
    move_down: 'W dół',
    ed_title: 'Tytuł',
    ed_title_helper: 'Pozostaw puste, aby użyć „Kamery”',
    ed_icon: 'Ikona',
    ed_quality_entity: 'Wybór jakości',
    ed_quality_entity_helper: 'input_select z opcjami HD i SD; bez niego jakość przełącza się na karcie',
    ed_hd_option: 'Opcja HD',
    ed_sd_option: 'Opcja SD',
    ed_columns: 'Kolumny',
    ed_columns_wall_helper: 'Puste: tyle, ile zmieści szerokość',
    ed_aspect_ratio: 'Proporcje kafelków',
    ed_aspect_ratio_helper: 'Na przykład 16:9 (domyślnie) lub 4:3',
    ed_show_summary: 'Podsumowanie',
    ed_show_badges: 'Plakietki prywatności',
    ed_language: 'Język',
    ed_language_helper: 'Pozostaw puste, aby używać języka Home Assistanta',
    ed_cameras: 'Kamery',
    cf_name: 'Nazwa',
    cf_short_name: 'Krótka nazwa (plakietka)',
    cf_camera: 'Kamera (HD)',
    cf_sd: 'Kamera SD',
    cf_privacy: 'Przełącznik prywatności (włączony = ukryta)',
    cf_power: 'Zasilanie (wyłączone = ukryta)',
    cf_ptz: 'Prefiks PTZ, na przykład button.salon_move',
    zoom_in: 'Pokaż pełną kartę',
    zoom_out: 'Wróć do widoku kompaktowego',
    ed_zoom: 'Przycisk szczegółów',
    motion: 'Wykryto ruch',
    cam_hidden: '{c}: ukryta',
    ed_show_motion: 'Plakietka ruchu',
    cf_motion: 'Czujnik ruchu (plakietka na obrazie)',
  },
  ro: {
    title: 'Camere',
    live_one: '{n} cameră în direct',
    live_many: 'Camere în direct: {n}',
    hidden_one: '{n} ascunsă',
    hidden_many: 'Ascunse: {n}',
    all_hidden: 'Toate camerele sunt ascunse',
    one_hidden: 'Cameră dezactivată',
    no_cameras: 'Nicio cameră configurată',
    hint_all: 'Atingeți o insignă pentru a afișa o cameră',
    live: 'În direct',
    hint_one: 'Activați camera pentru a o vedea aici',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Comutați între HD și SD',
    privacy_on: '{c}: ascunsă, atingeți pentru a o afișa',
    privacy_off: '{c}: vizibilă, atingeți pentru a o ascunde',
    privacy_unavailable: '{c}: indisponibilă',
    enable: 'Activează',
    disable: 'Dezactivează',
    unavailable: 'Indisponibilă',
    ptz: 'Rotire și înclinare',
    open: 'Afișează {c} pe tot ecranul',
    exit_fullscreen: 'Ieși din modul ecran complet',
    details: 'Detalii',
    pending: 'Se actualizează…',
    sound_on: 'Activează sunetul',
    sound_off: 'Dezactivează sunetul',
    move_left: 'Stânga',
    move_right: 'Dreapta',
    move_up: 'Sus',
    move_down: 'Jos',
    ed_title: 'Titlu',
    ed_title_helper: 'Lăsați gol pentru „Camere”',
    ed_icon: 'Pictogramă',
    ed_quality_entity: 'Selector de calitate',
    ed_quality_entity_helper: 'input_select cu opțiunile HD și SD; fără el, calitatea se comută pe card',
    ed_hd_option: 'Opțiunea HD',
    ed_sd_option: 'Opțiunea SD',
    ed_columns: 'Coloane',
    ed_columns_wall_helper: 'Gol: câte încap pe lățime',
    ed_aspect_ratio: 'Raportul de aspect al plăcilor',
    ed_aspect_ratio_helper: 'De exemplu 16:9 (implicit) sau 4:3',
    ed_show_summary: 'Rezumat',
    ed_show_badges: 'Insigne de confidențialitate',
    ed_language: 'Limbă',
    ed_language_helper: 'Lăsați gol pentru a urma limba Home Assistant',
    ed_cameras: 'Camere',
    cf_name: 'Nume',
    cf_short_name: 'Nume scurt (insignă)',
    cf_camera: 'Cameră (HD)',
    cf_sd: 'Cameră SD',
    cf_privacy: 'Comutator de confidențialitate (pornit = ascunsă)',
    cf_power: 'Alimentare (oprită = ascunsă)',
    cf_ptz: 'Prefix PTZ, de exemplu button.sufragerie_move',
    zoom_in: 'Afișează cardul complet',
    zoom_out: 'Înapoi la vizualizarea compactă',
    ed_zoom: 'Buton de detalii',
    motion: 'Mișcare detectată',
    cam_hidden: '{c}: ascunsă',
    ed_show_motion: 'Insignă de mișcare',
    cf_motion: 'Senzor de mișcare (insignă pe imagine)',
  },
  da: {
    title: 'Kameraer',
    live_one: '{n} kamera live',
    live_many: '{n} kameraer live',
    hidden_one: '{n} skjult',
    hidden_many: '{n} skjulte',
    all_hidden: 'Alle kameraer er skjult',
    one_hidden: 'Kamera deaktiveret',
    no_cameras: 'Intet kamera konfigureret',
    hint_all: 'Tryk på et badge for at vise et kamera',
    live: 'Live',
    hint_one: 'Aktivér kameraet for at se det her',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Skift mellem HD og SD',
    privacy_on: '{c}: skjult, tryk for at vise det',
    privacy_off: '{c}: synligt, tryk for at skjule det',
    privacy_unavailable: '{c}: utilgængeligt',
    enable: 'Aktivér',
    disable: 'Deaktivér',
    unavailable: 'Utilgængelig',
    ptz: 'Panorering og vipning',
    open: 'Vis {c} i fuld skærm',
    exit_fullscreen: 'Afslut fuld skærm',
    details: 'Detaljer',
    pending: 'Opdaterer…',
    sound_on: 'Slå lyd til',
    sound_off: 'Slå lyd fra',
    move_left: 'Venstre',
    move_right: 'Højre',
    move_up: 'Op',
    move_down: 'Ned',
    ed_title: 'Titel',
    ed_title_helper: 'Lad stå tomt for »Kameraer«',
    ed_icon: 'Ikon',
    ed_quality_entity: 'Kvalitetsvælger',
    ed_quality_entity_helper: 'input_select med valgmulighederne HD og SD; uden den skiftes kvaliteten på kortet',
    ed_hd_option: 'HD-valgmulighed',
    ed_sd_option: 'SD-valgmulighed',
    ed_columns: 'Kolonner',
    ed_columns_wall_helper: 'Tom: så mange som bredden giver plads til',
    ed_aspect_ratio: 'Billedformat for felterne',
    ed_aspect_ratio_helper: 'For eksempel 16:9 (standard) eller 4:3',
    ed_show_summary: 'Oversigt',
    ed_show_badges: 'Privatlivsbadges',
    ed_language: 'Sprog',
    ed_language_helper: 'Lad stå tomt for at følge sproget i Home Assistant',
    ed_cameras: 'Kameraer',
    cf_name: 'Navn',
    cf_short_name: 'Kort navn (badge)',
    cf_camera: 'Kamera (HD)',
    cf_sd: 'SD-kamera',
    cf_privacy: 'Privatlivskontakt (til = skjult)',
    cf_power: 'Strøm (fra = skjult)',
    cf_ptz: 'PTZ-præfiks, for eksempel button.stue_move',
    zoom_in: 'Vis hele kortet',
    zoom_out: 'Tilbage til kompakt visning',
    ed_zoom: 'Detaljeknap',
    motion: 'Bevægelse registreret',
    cam_hidden: '{c}: skjult',
    ed_show_motion: 'Bevægelsesbadge',
    cf_motion: 'Bevægelsessensor (badge på billedet)',
  },
  sv: {
    title: 'Kameror',
    live_one: '{n} kamera live',
    live_many: '{n} kameror live',
    hidden_one: '{n} dold',
    hidden_many: '{n} dolda',
    all_hidden: 'Alla kameror är dolda',
    one_hidden: 'Kamera inaktiverad',
    no_cameras: 'Ingen kamera konfigurerad',
    hint_all: 'Tryck på en bricka för att visa en kamera',
    live: 'Live',
    hint_one: 'Aktivera kameran för att se den här',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Växla mellan HD och SD',
    privacy_on: '{c}: dold, tryck för att visa den',
    privacy_off: '{c}: synlig, tryck för att dölja den',
    privacy_unavailable: '{c}: inte tillgänglig',
    enable: 'Aktivera',
    disable: 'Inaktivera',
    unavailable: 'Inte tillgänglig',
    ptz: 'Panorering och lutning',
    open: 'Visa {c} i helskärm',
    exit_fullscreen: 'Avsluta helskärm',
    details: 'Detaljer',
    pending: 'Uppdaterar…',
    sound_on: 'Slå på ljud',
    sound_off: 'Stäng av ljud',
    move_left: 'Vänster',
    move_right: 'Höger',
    move_up: 'Upp',
    move_down: 'Ner',
    ed_title: 'Titel',
    ed_title_helper: 'Lämna tomt för ”Kameror”',
    ed_icon: 'Ikon',
    ed_quality_entity: 'Kvalitetsväljare',
    ed_quality_entity_helper: 'input_select med alternativen HD och SD; utan den byts kvaliteten på kortet',
    ed_hd_option: 'HD-alternativ',
    ed_sd_option: 'SD-alternativ',
    ed_columns: 'Kolumner',
    ed_columns_wall_helper: 'Tomt: så många som får plats på bredden',
    ed_aspect_ratio: 'Bildformat för rutorna',
    ed_aspect_ratio_helper: 'Till exempel 16:9 (standard) eller 4:3',
    ed_show_summary: 'Sammanfattning',
    ed_show_badges: 'Integritetsbrickor',
    ed_language: 'Språk',
    ed_language_helper: 'Lämna tomt för att följa språket i Home Assistant',
    ed_cameras: 'Kameror',
    cf_name: 'Namn',
    cf_short_name: 'Kort namn (bricka)',
    cf_camera: 'Kamera (HD)',
    cf_sd: 'SD-kamera',
    cf_privacy: 'Integritetsbrytare (på = dold)',
    cf_power: 'Ström (av = dold)',
    cf_ptz: 'PTZ-prefix, till exempel button.vardagsrum_move',
    zoom_in: 'Visa hela kortet',
    zoom_out: 'Tillbaka till kompakt vy',
    ed_zoom: 'Detaljknapp',
    motion: 'Rörelse upptäckt',
    cam_hidden: '{c}: dold',
    ed_show_motion: 'Rörelsebricka',
    cf_motion: 'Rörelsesensor (bricka på bilden)',
  },
  bg: {
    title: 'Камери',
    live_one: '{n} камера на живо',
    live_many: '{n} камери на живо',
    hidden_one: '{n} скрита',
    hidden_many: '{n} скрити',
    all_hidden: 'Всички камери са скрити',
    one_hidden: 'Камера изключена',
    no_cameras: 'Няма настроени камери',
    hint_all: 'Докоснете значка, за да покажете камера',
    live: 'На живо',
    hint_one: 'Активирайте камерата, за да я видите тук',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Превключване между HD и SD',
    privacy_on: '{c}: скрита, докоснете, за да я покажете',
    privacy_off: '{c}: видима, докоснете, за да я скриете',
    privacy_unavailable: '{c}: недостъпна',
    enable: 'Активиране',
    disable: 'Деактивиране',
    unavailable: 'Недостъпна',
    ptz: 'Завъртане и накланяне',
    open: 'Показване на {c} на цял екран',
    exit_fullscreen: 'Изход от цял екран',
    details: 'Подробности',
    pending: 'Актуализиране…',
    sound_on: 'Включване на звука',
    sound_off: 'Изключване на звука',
    move_left: 'Наляво',
    move_right: 'Надясно',
    move_up: 'Нагоре',
    move_down: 'Надолу',
    ed_title: 'Заглавие',
    ed_title_helper: 'Оставете празно за „Камери“',
    ed_icon: 'Икона',
    ed_quality_entity: 'Избор на качество',
    ed_quality_entity_helper: 'input_select с опции HD и SD; без него качеството се превключва от картата',
    ed_hd_option: 'Опция HD',
    ed_sd_option: 'Опция SD',
    ed_columns: 'Колони',
    ed_columns_wall_helper: 'Празно: колкото се събират по ширина',
    ed_aspect_ratio: 'Съотношение на плочките',
    ed_aspect_ratio_helper: 'Например 16:9 (по подразбиране) или 4:3',
    ed_show_summary: 'Обобщение',
    ed_show_badges: 'Значки за поверителност',
    ed_language: 'Език',
    ed_language_helper: 'Оставете празно, за да се използва езикът на Home Assistant',
    ed_cameras: 'Камери',
    cf_name: 'Име',
    cf_short_name: 'Кратко име (значка)',
    cf_camera: 'Камера (HD)',
    cf_sd: 'SD камера',
    cf_privacy: 'Превключвател за поверителност (включен = скрита)',
    cf_power: 'Захранване (изключено = скрита)',
    cf_ptz: 'PTZ префикс, например button.vsekidnevna_move',
    zoom_in: 'Покажи цялата карта',
    zoom_out: 'Обратно към компактния изглед',
    ed_zoom: 'Бутон за подробности',
    motion: 'Открито движение',
    cam_hidden: '{c}: скрита',
    ed_show_motion: 'Значка за движение',
    cf_motion: 'Сензор за движение (значка върху изображението)',
  },
  ru: {
    title: 'Камеры',
    live_one: '{n} камера в эфире',
    live_many: 'Камеры в эфире: {n}',
    hidden_one: '{n} скрыта',
    hidden_many: 'Скрыты: {n}',
    all_hidden: 'Все камеры скрыты',
    one_hidden: 'Камера отключена',
    no_cameras: 'Камеры не настроены',
    hint_all: 'Нажмите на значок, чтобы показать камеру',
    live: 'В эфире',
    hint_one: 'Включите камеру, чтобы увидеть её здесь',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Переключение между HD и SD',
    privacy_on: '{c}: скрыта, нажмите, чтобы показать',
    privacy_off: '{c}: видна, нажмите, чтобы скрыть',
    privacy_unavailable: '{c}: недоступна',
    enable: 'Включить',
    disable: 'Отключить',
    unavailable: 'Недоступна',
    ptz: 'Поворот и наклон',
    open: 'Показать {c} на весь экран',
    exit_fullscreen: 'Выйти из полноэкранного режима',
    details: 'Подробнее',
    pending: 'Обновление…',
    sound_on: 'Включить звук',
    sound_off: 'Выключить звук',
    move_left: 'Влево',
    move_right: 'Вправо',
    move_up: 'Вверх',
    move_down: 'Вниз',
    ed_title: 'Заголовок',
    ed_title_helper: 'Оставьте пустым для «Камеры»',
    ed_icon: 'Значок',
    ed_quality_entity: 'Выбор качества',
    ed_quality_entity_helper: 'input_select с вариантами HD и SD; без него качество переключается на карточке',
    ed_hd_option: 'Вариант HD',
    ed_sd_option: 'Вариант SD',
    ed_columns: 'Столбцы',
    ed_columns_wall_helper: 'Пусто: сколько поместится по ширине',
    ed_aspect_ratio: 'Соотношение сторон плиток',
    ed_aspect_ratio_helper: 'Например, 16:9 (по умолчанию) или 4:3',
    ed_show_summary: 'Сводка',
    ed_show_badges: 'Значки конфиденциальности',
    ed_language: 'Язык',
    ed_language_helper: 'Оставьте пустым, чтобы использовать язык Home Assistant',
    ed_cameras: 'Камеры',
    cf_name: 'Название',
    cf_short_name: 'Краткое название (значок)',
    cf_camera: 'Камера (HD)',
    cf_sd: 'Камера SD',
    cf_privacy: 'Переключатель конфиденциальности (вкл. = скрыта)',
    cf_power: 'Питание (выкл. = скрыта)',
    cf_ptz: 'Префикс PTZ, например button.gostinaya_move',
    zoom_in: 'Показать полную карточку',
    zoom_out: 'Вернуться к компактному виду',
    ed_zoom: 'Кнопка подробностей',
    motion: 'Обнаружено движение',
    cam_hidden: '{c}: скрыта',
    ed_show_motion: 'Значок движения',
    cf_motion: 'Датчик движения (значок на изображении)',
  },
  uk: {
    title: 'Камери',
    live_one: '{n} камера в ефірі',
    live_many: 'Камери в ефірі: {n}',
    hidden_one: '{n} прихована',
    hidden_many: 'Приховані: {n}',
    all_hidden: 'Усі камери приховано',
    one_hidden: 'Камеру вимкнено',
    no_cameras: 'Камери не налаштовано',
    hint_all: 'Торкніться значка, щоб показати камеру',
    live: 'В ефірі',
    hint_one: 'Увімкніть камеру, щоб побачити її тут',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Перемикання між HD і SD',
    privacy_on: '{c}: прихована, торкніться, щоб показати',
    privacy_off: '{c}: видима, торкніться, щоб приховати',
    privacy_unavailable: '{c}: недоступна',
    enable: 'Увімкнути',
    disable: 'Вимкнути',
    unavailable: 'Недоступна',
    ptz: 'Поворот і нахил',
    open: 'Показати {c} на весь екран',
    exit_fullscreen: 'Вийти з повноекранного режиму',
    details: 'Докладніше',
    pending: 'Оновлення…',
    sound_on: 'Увімкнути звук',
    sound_off: 'Вимкнути звук',
    move_left: 'Ліворуч',
    move_right: 'Праворуч',
    move_up: 'Вгору',
    move_down: 'Вниз',
    ed_title: 'Заголовок',
    ed_title_helper: 'Залиште порожнім для «Камери»',
    ed_icon: 'Значок',
    ed_quality_entity: 'Вибір якості',
    ed_quality_entity_helper: 'input_select з варіантами HD і SD; без нього якість перемикається на картці',
    ed_hd_option: 'Варіант HD',
    ed_sd_option: 'Варіант SD',
    ed_columns: 'Стовпці',
    ed_columns_wall_helper: 'Порожньо: скільки вміститься по ширині',
    ed_aspect_ratio: 'Співвідношення сторін плиток',
    ed_aspect_ratio_helper: 'Наприклад, 16:9 (типово) або 4:3',
    ed_show_summary: 'Зведення',
    ed_show_badges: 'Значки приватності',
    ed_language: 'Мова',
    ed_language_helper: 'Залиште порожнім, щоб використовувати мову Home Assistant',
    ed_cameras: 'Камери',
    cf_name: 'Назва',
    cf_short_name: 'Коротка назва (значок)',
    cf_camera: 'Камера (HD)',
    cf_sd: 'Камера SD',
    cf_privacy: 'Перемикач приватності (увімк. = прихована)',
    cf_power: 'Живлення (вимк. = прихована)',
    cf_ptz: 'Префікс PTZ, наприклад button.vitalnia_move',
    zoom_in: 'Показати повну картку',
    zoom_out: 'Повернутися до компактного вигляду',
    ed_zoom: 'Кнопка деталей',
    motion: 'Виявлено рух',
    cam_hidden: '{c}: прихована',
    ed_show_motion: 'Значок руху',
    cf_motion: 'Датчик руху (значок на зображенні)',
  },
  hu: {
    title: 'Kamerák',
    live_one: '{n} kamera élőben',
    live_many: '{n} kamera élőben',
    hidden_one: '{n} rejtett',
    hidden_many: '{n} rejtett',
    all_hidden: 'Minden kamera rejtve van',
    one_hidden: 'Kamera kikapcsolva',
    no_cameras: 'Nincs beállított kamera',
    hint_all: 'Koppintson egy jelvényre egy kamera megjelenítéséhez',
    live: 'Élő',
    hint_one: 'Kapcsolja be a kamerát, hogy itt lássa',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Váltás HD és SD között',
    privacy_on: '{c}: rejtett, koppintson a megjelenítéséhez',
    privacy_off: '{c}: látható, koppintson az elrejtéséhez',
    privacy_unavailable: '{c}: nem elérhető',
    enable: 'Engedélyezés',
    disable: 'Letiltás',
    unavailable: 'Nem elérhető',
    ptz: 'Forgatás és döntés',
    open: '{c} megjelenítése teljes képernyőn',
    exit_fullscreen: 'Kilépés a teljes képernyős módból',
    details: 'Részletek',
    pending: 'Frissítés…',
    sound_on: 'Hang bekapcsolása',
    sound_off: 'Némítás',
    move_left: 'Balra',
    move_right: 'Jobbra',
    move_up: 'Fel',
    move_down: 'Le',
    ed_title: 'Cím',
    ed_title_helper: 'Hagyja üresen a „Kamerák” címhez',
    ed_icon: 'Ikon',
    ed_quality_entity: 'Minőségválasztó',
    ed_quality_entity_helper: 'input_select HD és SD opciókkal; nélküle a minőség a kártyán váltható',
    ed_hd_option: 'HD opció',
    ed_sd_option: 'SD opció',
    ed_columns: 'Oszlopok',
    ed_columns_wall_helper: 'Üresen: amennyi a szélességbe belefér',
    ed_aspect_ratio: 'Csempék méretaránya',
    ed_aspect_ratio_helper: 'Például 16:9 (alapértelmezett) vagy 4:3',
    ed_show_summary: 'Összegzés',
    ed_show_badges: 'Adatvédelmi jelvények',
    ed_language: 'Nyelv',
    ed_language_helper: 'Hagyja üresen a Home Assistant nyelvének követéséhez',
    ed_cameras: 'Kamerák',
    cf_name: 'Név',
    cf_short_name: 'Rövid név (jelvény)',
    cf_camera: 'Kamera (HD)',
    cf_sd: 'SD kamera',
    cf_privacy: 'Adatvédelmi kapcsoló (be = rejtett)',
    cf_power: 'Tápellátás (ki = rejtett)',
    cf_ptz: 'PTZ előtag, például button.nappali_move',
    zoom_in: 'Teljes kártya megjelenítése',
    zoom_out: 'Vissza a kompakt nézethez',
    ed_zoom: 'Részletek gomb',
    motion: 'Mozgás észlelve',
    cam_hidden: '{c}: rejtett',
    ed_show_motion: 'Mozgásjelvény',
    cf_motion: 'Mozgásérzékelő (jelvény a képen)',
  },
  sk: {
    title: 'Kamery',
    live_one: '{n} kamera naživo',
    live_many: 'Kamery naživo: {n}',
    hidden_one: '{n} skrytá',
    hidden_many: 'Skryté: {n}',
    all_hidden: 'Všetky kamery sú skryté',
    one_hidden: 'Kamera je vypnutá',
    no_cameras: 'Nie je nastavená žiadna kamera',
    hint_all: 'Ťuknutím na odznak zobrazíte kameru',
    live: 'Naživo',
    hint_one: 'Zapnite kameru, aby ste ju tu videli',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Prepnúť medzi HD a SD',
    privacy_on: '{c}: skrytá, ťuknutím zobrazíte',
    privacy_off: '{c}: viditeľná, ťuknutím skryjete',
    privacy_unavailable: '{c}: nedostupná',
    enable: 'Zapnúť',
    disable: 'Vypnúť',
    unavailable: 'Nedostupná',
    ptz: 'Otáčanie a náklon',
    open: 'Zobraziť {c} na celú obrazovku',
    exit_fullscreen: 'Ukončiť režim celej obrazovky',
    details: 'Podrobnosti',
    pending: 'Aktualizuje sa…',
    sound_on: 'Zapnúť zvuk',
    sound_off: 'Stlmiť',
    move_left: 'Doľava',
    move_right: 'Doprava',
    move_up: 'Hore',
    move_down: 'Dole',
    ed_title: 'Názov',
    ed_title_helper: 'Nechajte prázdne pre „Kamery“',
    ed_icon: 'Ikona',
    ed_quality_entity: 'Výber kvality',
    ed_quality_entity_helper: 'input_select s možnosťami HD a SD; bez neho sa kvalita prepína na karte',
    ed_hd_option: 'Možnosť HD',
    ed_sd_option: 'Možnosť SD',
    ed_columns: 'Stĺpce',
    ed_columns_wall_helper: 'Prázdne: koľko sa zmestí na šírku',
    ed_aspect_ratio: 'Pomer strán dlaždíc',
    ed_aspect_ratio_helper: 'Napríklad 16:9 (predvolené) alebo 4:3',
    ed_show_summary: 'Súhrn',
    ed_show_badges: 'Odznaky súkromia',
    ed_language: 'Jazyk',
    ed_language_helper: 'Nechajte prázdne, ak chcete použiť jazyk Home Assistant',
    ed_cameras: 'Kamery',
    cf_name: 'Názov',
    cf_short_name: 'Krátky názov (odznak)',
    cf_camera: 'Kamera (HD)',
    cf_sd: 'Kamera SD',
    cf_privacy: 'Prepínač súkromia (zapnutý = skrytá)',
    cf_power: 'Napájanie (vypnuté = skrytá)',
    cf_ptz: 'Predpona PTZ, napríklad button.obyvacka_move',
    zoom_in: 'Zobraziť celú kartu',
    zoom_out: 'Späť na kompaktné zobrazenie',
    ed_zoom: 'Tlačidlo podrobností',
    motion: 'Zistený pohyb',
    cam_hidden: '{c}: skrytá',
    ed_show_motion: 'Odznak pohybu',
    cf_motion: 'Senzor pohybu (odznak na obraze)',
  },
  cs: {
    title: 'Kamery',
    live_one: '{n} kamera živě',
    live_many: 'Kamery živě: {n}',
    hidden_one: '{n} skrytá',
    hidden_many: 'Skryté: {n}',
    all_hidden: 'Všechny kamery jsou skryté',
    one_hidden: 'Kamera je vypnutá',
    no_cameras: 'Není nastavena žádná kamera',
    hint_all: 'Klepnutím na odznak zobrazíte kameru',
    live: 'Živě',
    hint_one: 'Zapněte kameru, abyste ji zde viděli',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Přepnout mezi HD a SD',
    privacy_on: '{c}: skrytá, klepnutím zobrazíte',
    privacy_off: '{c}: viditelná, klepnutím skryjete',
    privacy_unavailable: '{c}: nedostupná',
    enable: 'Zapnout',
    disable: 'Vypnout',
    unavailable: 'Nedostupná',
    ptz: 'Otáčení a náklon',
    open: 'Zobrazit {c} na celou obrazovku',
    exit_fullscreen: 'Ukončit režim celé obrazovky',
    details: 'Podrobnosti',
    pending: 'Aktualizace…',
    sound_on: 'Zapnout zvuk',
    sound_off: 'Ztlumit',
    move_left: 'Doleva',
    move_right: 'Doprava',
    move_up: 'Nahoru',
    move_down: 'Dolů',
    ed_title: 'Název',
    ed_title_helper: 'Ponechte prázdné pro „Kamery“',
    ed_icon: 'Ikona',
    ed_quality_entity: 'Výběr kvality',
    ed_quality_entity_helper: 'input_select s možnostmi HD a SD; bez něj se kvalita přepíná na kartě',
    ed_hd_option: 'Možnost HD',
    ed_sd_option: 'Možnost SD',
    ed_columns: 'Sloupce',
    ed_columns_wall_helper: 'Prázdné: kolik se vejde na šířku',
    ed_aspect_ratio: 'Poměr stran dlaždic',
    ed_aspect_ratio_helper: 'Například 16:9 (výchozí) nebo 4:3',
    ed_show_summary: 'Souhrn',
    ed_show_badges: 'Odznaky soukromí',
    ed_language: 'Jazyk',
    ed_language_helper: 'Ponechte prázdné pro použití jazyka Home Assistant',
    ed_cameras: 'Kamery',
    cf_name: 'Název',
    cf_short_name: 'Krátký název (odznak)',
    cf_camera: 'Kamera (HD)',
    cf_sd: 'Kamera SD',
    cf_privacy: 'Přepínač soukromí (zapnuto = skrytá)',
    cf_power: 'Napájení (vypnuto = skrytá)',
    cf_ptz: 'Předpona PTZ, například button.obyvak_move',
    zoom_in: 'Zobrazit celou kartu',
    zoom_out: 'Zpět na kompaktní zobrazení',
    ed_zoom: 'Tlačítko podrobností',
    motion: 'Zjištěn pohyb',
    cam_hidden: '{c}: skrytá',
    ed_show_motion: 'Odznak pohybu',
    cf_motion: 'Senzor pohybu (odznak na obraze)',
  },
  sl: {
    title: 'Kamere',
    live_one: '{n} kamera v živo',
    live_many: 'Kamere v živo: {n}',
    hidden_one: '{n} skrita',
    hidden_many: 'Skrite: {n}',
    all_hidden: 'Vse kamere so skrite',
    one_hidden: 'Kamera je izklopljena',
    no_cameras: 'Nobena kamera ni nastavljena',
    hint_all: 'Tapnite značko, da prikažete kamero',
    live: 'V živo',
    hint_one: 'Omogočite kamero, da jo vidite tukaj',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Preklopi med HD in SD',
    privacy_on: '{c}: skrita, tapnite za prikaz',
    privacy_off: '{c}: vidna, tapnite, da jo skrijete',
    privacy_unavailable: '{c}: ni na voljo',
    enable: 'Omogoči',
    disable: 'Onemogoči',
    unavailable: 'Ni na voljo',
    ptz: 'Vrtenje in nagib',
    open: 'Prikaži {c} v celozaslonskem načinu',
    exit_fullscreen: 'Izhod iz celozaslonskega načina',
    details: 'Podrobnosti',
    pending: 'Posodabljanje…',
    sound_on: 'Vklopi zvok',
    sound_off: 'Izklopi zvok',
    move_left: 'Levo',
    move_right: 'Desno',
    move_up: 'Gor',
    move_down: 'Dol',
    ed_title: 'Naslov',
    ed_title_helper: 'Pustite prazno za »Kamere«',
    ed_icon: 'Ikona',
    ed_quality_entity: 'Izbirnik kakovosti',
    ed_quality_entity_helper: 'input_select z možnostma HD in SD; brez njega se kakovost preklaplja na kartici',
    ed_hd_option: 'Možnost HD',
    ed_sd_option: 'Možnost SD',
    ed_columns: 'Stolpci',
    ed_columns_wall_helper: 'Prazno: kolikor jih gre v širino',
    ed_aspect_ratio: 'Razmerje stranic ploščic',
    ed_aspect_ratio_helper: 'Na primer 16:9 (privzeto) ali 4:3',
    ed_show_summary: 'Povzetek',
    ed_show_badges: 'Značke zasebnosti',
    ed_language: 'Jezik',
    ed_language_helper: 'Pustite prazno, da sledi jeziku Home Assistanta',
    ed_cameras: 'Kamere',
    cf_name: 'Ime',
    cf_short_name: 'Kratko ime (značka)',
    cf_camera: 'Kamera (HD)',
    cf_sd: 'Kamera SD',
    cf_privacy: 'Stikalo zasebnosti (vklopljeno = skrita)',
    cf_power: 'Napajanje (izklopljeno = skrita)',
    cf_ptz: 'Predpona PTZ, na primer button.dnevna_soba_move',
    zoom_in: 'Prikaži celotno kartico',
    zoom_out: 'Nazaj na kompaktni pogled',
    ed_zoom: 'Gumb za podrobnosti',
    motion: 'Zaznano gibanje',
    cam_hidden: '{c}: skrita',
    ed_show_motion: 'Značka gibanja',
    cf_motion: 'Senzor gibanja (značka na sliki)',
  },
  lv: {
    title: 'Kameras',
    live_one: '{n} kamera tiešraidē',
    live_many: 'Kameras tiešraidē: {n}',
    hidden_one: '{n} paslēpta',
    hidden_many: 'Paslēptas: {n}',
    all_hidden: 'Visas kameras ir paslēptas',
    one_hidden: 'Kamera atspējota',
    no_cameras: 'Nav konfigurēta neviena kamera',
    hint_all: 'Pieskarieties žetonam, lai parādītu kameru',
    live: 'Tiešraide',
    hint_one: 'Iespējojiet kameru, lai to redzētu šeit',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Pārslēgt starp HD un SD',
    privacy_on: '{c}: paslēpta, pieskarieties, lai parādītu',
    privacy_off: '{c}: redzama, pieskarieties, lai paslēptu',
    privacy_unavailable: '{c}: nav pieejama',
    enable: 'Iespējot',
    disable: 'Atspējot',
    unavailable: 'Nav pieejama',
    ptz: 'Pagriešana un slīpums',
    open: 'Rādīt {c} pilnekrānā',
    exit_fullscreen: 'Iziet no pilnekrāna',
    details: 'Detaļas',
    pending: 'Atjaunina…',
    sound_on: 'Ieslēgt skaņu',
    sound_off: 'Izslēgt skaņu',
    move_left: 'Pa kreisi',
    move_right: 'Pa labi',
    move_up: 'Uz augšu',
    move_down: 'Uz leju',
    ed_title: 'Virsraksts',
    ed_title_helper: 'Atstājiet tukšu, lai būtu “Kameras”',
    ed_icon: 'Ikona',
    ed_quality_entity: 'Kvalitātes atlasītājs',
    ed_quality_entity_helper: 'input_select ar opcijām HD un SD; bez tā kvalitāti pārslēdz kartītē',
    ed_hd_option: 'HD opcija',
    ed_sd_option: 'SD opcija',
    ed_columns: 'Kolonnas',
    ed_columns_wall_helper: 'Tukšs: cik ietilpst platumā',
    ed_aspect_ratio: 'Flīžu malu attiecība',
    ed_aspect_ratio_helper: 'Piemēram, 16:9 (noklusējums) vai 4:3',
    ed_show_summary: 'Kopsavilkums',
    ed_show_badges: 'Privātuma žetoni',
    ed_language: 'Valoda',
    ed_language_helper: 'Atstājiet tukšu, lai izmantotu Home Assistant valodu',
    ed_cameras: 'Kameras',
    cf_name: 'Nosaukums',
    cf_short_name: 'Īsais nosaukums (žetons)',
    cf_camera: 'Kamera (HD)',
    cf_sd: 'SD kamera',
    cf_privacy: 'Privātuma slēdzis (ieslēgts = paslēpta)',
    cf_power: 'Barošana (izslēgta = paslēpta)',
    cf_ptz: 'PTZ prefikss, piemēram, button.dzivojama_istaba_move',
    zoom_in: 'Rādīt pilno karti',
    zoom_out: 'Atpakaļ uz kompakto skatu',
    ed_zoom: 'Detaļu poga',
    motion: 'Konstatēta kustība',
    cam_hidden: '{c}: paslēpta',
    ed_show_motion: 'Kustības žetons',
    cf_motion: 'Kustības sensors (žetons attēlā)',
  },
  el: {
    title: 'Κάμερες',
    live_one: '{n} κάμερα ζωντανά',
    live_many: '{n} κάμερες ζωντανά',
    hidden_one: '{n} κρυφή',
    hidden_many: '{n} κρυφές',
    all_hidden: 'Όλες οι κάμερες είναι κρυφές',
    one_hidden: 'Κάμερα ανενεργή',
    no_cameras: 'Δεν έχει ρυθμιστεί καμία κάμερα',
    hint_all: 'Πατήστε ένα σήμα για να εμφανίσετε μια κάμερα',
    live: 'Ζωντανά',
    hint_one: 'Ενεργοποιήστε την κάμερα για να τη δείτε εδώ',
    hd: 'HD',
    sd: 'SD',
    quality_hint: 'Εναλλαγή μεταξύ HD και SD',
    privacy_on: '{c}: κρυφή, πατήστε για εμφάνιση',
    privacy_off: '{c}: ορατή, πατήστε για απόκρυψη',
    privacy_unavailable: '{c}: μη διαθέσιμη',
    enable: 'Ενεργοποίηση',
    disable: 'Απενεργοποίηση',
    unavailable: 'Μη διαθέσιμη',
    ptz: 'Περιστροφή και κλίση',
    open: 'Εμφάνιση {c} σε πλήρη οθόνη',
    exit_fullscreen: 'Έξοδος από πλήρη οθόνη',
    details: 'Λεπτομέρειες',
    pending: 'Ενημέρωση…',
    sound_on: 'Ενεργοποίηση ήχου',
    sound_off: 'Σίγαση',
    move_left: 'Αριστερά',
    move_right: 'Δεξιά',
    move_up: 'Πάνω',
    move_down: 'Κάτω',
    ed_title: 'Τίτλος',
    ed_title_helper: 'Αφήστε κενό για «Κάμερες»',
    ed_icon: 'Εικονίδιο',
    ed_quality_entity: 'Επιλογέας ποιότητας',
    ed_quality_entity_helper: 'input_select με επιλογές HD και SD· χωρίς αυτό, η ποιότητα αλλάζει στην κάρτα',
    ed_hd_option: 'Επιλογή HD',
    ed_sd_option: 'Επιλογή SD',
    ed_columns: 'Στήλες',
    ed_columns_wall_helper: 'Κενό: όσες χωρούν στο πλάτος',
    ed_aspect_ratio: 'Αναλογία πλακιδίων',
    ed_aspect_ratio_helper: 'Για παράδειγμα 16:9 (προεπιλογή) ή 4:3',
    ed_show_summary: 'Σύνοψη',
    ed_show_badges: 'Σήματα απορρήτου',
    ed_language: 'Γλώσσα',
    ed_language_helper: 'Αφήστε κενό για να ακολουθεί τη γλώσσα του Home Assistant',
    ed_cameras: 'Κάμερες',
    cf_name: 'Όνομα',
    cf_short_name: 'Σύντομο όνομα (σήμα)',
    cf_camera: 'Κάμερα (HD)',
    cf_sd: 'Κάμερα SD',
    cf_privacy: 'Διακόπτης απορρήτου (ενεργός = κρυφή)',
    cf_power: 'Τροφοδοσία (απενεργοποιημένη = κρυφή)',
    cf_ptz: 'Πρόθεμα PTZ, για παράδειγμα button.saloni_move',
    zoom_in: 'Εμφάνιση πλήρους κάρτας',
    zoom_out: 'Επιστροφή στη συμπαγή προβολή',
    ed_zoom: 'Κουμπί λεπτομερειών',
    motion: 'Εντοπίστηκε κίνηση',
    cam_hidden: '{c}: κρυφή',
    ed_show_motion: 'Σήμα κίνησης',
    cf_motion: 'Αισθητήρας κίνησης (σήμα στην εικόνα)',
  },
};

// Full tag when the dictionary has it (sr-Latn), else the part before the dash (fr-FR -> fr, pt-BR -> pt), else English.
function hcLang(raw) {
  const l = String(raw || 'en');
  if (HcI18n[l]) return l;
  const base = l.split('-')[0];
  return HcI18n[base] ? base : 'en';
}

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
  show_motion: true,
};

const HC_PTZ_DIRS = ['left', 'right', 'up', 'down'];
// PTZ arrow held down: first repeat after HC_PTZ_HOLD_MS, then one press every HC_PTZ_REPEAT_MS.
const HC_PTZ_HOLD_MS = 500;
const HC_PTZ_REPEAT_MS = 350;
// How long a privacy badge waits for its switch to answer before giving up.
const HC_PENDING_MS = 15000;
// Mini card: how often the camera snapshots of its compact view are refreshed.
const HC_SNAPSHOT_MS = 10000;
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

// An entity of the camera's device whose id ends with `suffix` (Tapo: switch.*_privacy, button.*_move_left), or
// whose translation key is that suffix: integrations that name their entities in the user's language (Tapo Cameras:
// button.salon_gauche is the move_left button) only keep the English key in the registry.
function hcSibling(hass, cameraId, domain, suffix) {
  const reg = hass?.entities;
  const device = reg?.[cameraId]?.device_id;
  if (!device) return undefined;
  const key = suffix.replace(/^_/, '');
  const ids = hcDeviceEntities(reg, device).filter((id) => id.startsWith(`${domain}.`));
  return ids.find((id) => id.endsWith(suffix)) || ids.find((id) => reg[id]?.translation_key === key);
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
      if (!helpers) throw new Error('loadCardHelpers unavailable');
      helpers.createCardElement({ type: 'picture-entity', entity: entity, camera_view: 'live' });
      // whenDefined never rejects: time out so a failed load rearms hcStreamLoad instead of hanging forever.
      let timer;
      try {
        await Promise.race([
          customElements.whenDefined('ha-camera-stream'),
          new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error('ha-camera-stream not loaded')), 15000);
          }),
        ]);
      } finally {
        clearTimeout(timer);
      }
    })().catch((err) => {
      hcStreamLoad = null; // the next hass update tries again
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
    // Each direction on its own: translated entity ids share no prefix (Tapo Cameras: *_gauche, *_monter…)
    const found = {};
    for (const d of HC_PTZ_DIRS) {
      const id = hcSibling(hass, cameraId, 'button', `_move_${d}`);
      if (id) found[d] = id;
    }
    return found.left || found.right || found.up || found.down ? found : null;
  }
  if (typeof ptz === 'string') {
    const out = {};
    for (const d of HC_PTZ_DIRS) out[d] = `${ptz}_${d}`;
    return out;
  }
  return ptz;
}

// Motion sensors of the camera's device: binary sensors whose device class or id says motion, occupancy or person
// (Tapo: binary_sensor.*_motion, *_person_detection). An entity id or a list in the config replaces the lookup.
const HC_MOTION_CLASSES = ['motion', 'occupancy', 'presence'];
function hcMotion(hass, cam, cameraId) {
  if (cam.motion === false) return [];
  if (cam.motion) return [].concat(cam.motion);
  const reg = hass?.entities;
  const device = reg?.[cameraId]?.device_id;
  if (!device) return [];
  return hcDeviceEntities(reg, device).filter(
    (id) =>
      id.startsWith('binary_sensor.') &&
      (HC_MOTION_CLASSES.includes(hass.states?.[id]?.attributes?.device_class) || /(motion|occupancy|person)/.test(id)),
  );
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
  // Tapo Cameras (ha-tapo) names it switch.*_privacy_mode
  const privacy =
    cam.privacy === false
      ? null
      : cam.privacy || hcSibling(hass, id, 'switch', '_privacy') || hcSibling(hass, id, 'switch', '_privacy_mode') || null;
  // Tapo Cameras (ha-tapo): one camera entity whose stream is chosen by its select.*_stream_quality (hd / sd),
  // instead of an SD camera entity next to the HD one
  const quality = sd ? null : hcSibling(hass, id, 'select', '_stream_quality') || null;
  const name = cam.name || st?.attributes.friendly_name || id;
  return {
    key: cam.id || id.replace(/^camera\./, '') || `camera_${index}`,
    camera: id,
    sd: sd || null,
    name: name,
    short: cam.short_name || name,
    privacy: privacy,
    quality: quality,
    power: cam.power || null,
    ptz: hcPtz(hass, cam, id),
    motion: hcMotion(hass, cam, id),
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
    // Video wall (the Cameras panel, or `layout: wall` on a dashboard): no card around the grid, a status bar
    // instead of the header, and as many columns as fit unless `columns` is set.
    this._wall = config.layout === 'wall' && !this.hasAttribute?.('mini');
    this._columnsSet = config.columns != null;
    this.toggleAttribute?.('wall', this._wall);
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
      this._onVisibility = () => this._syncLive();
      // Escape leaves the card's own fullscreen (the browser handles its native one).
      this._onEscape = (ev) => {
        if (ev.key === 'Escape' && this._pseudo) this._setPseudo(this._pseudo, false);
      };
    }
    window.addEventListener('storage', this._onQuality);
    window.addEventListener(HC_QUALITY_EVENT, this._onQuality);
    document.addEventListener('visibilitychange', this._onVisibility);
    window.addEventListener('keydown', this._onEscape);
    // Scrolled out of view (or in a closed view, a collapsed stack): the streams and snapshots stop until
    // the card shows again. Without IntersectionObserver the card counts as always on screen.
    if (!this._observer && window.IntersectionObserver) {
      this._observer = new window.IntersectionObserver((entries) => {
        const off = !entries[entries.length - 1].isIntersecting;
        if (off === this._offscreen) return;
        this._offscreen = off;
        this._syncLive();
      });
    }
    this._observer?.observe(this);
    this._syncLive();
    // The HD/SD choice may have changed while detached (listeners removed): catch up. _update() is
    // a no-op before setConfig/hass, and the signatures skip the render when nothing changed.
    this._update();
  }

  disconnectedCallback() {
    window.removeEventListener('storage', this._onQuality);
    window.removeEventListener(HC_QUALITY_EVENT, this._onQuality);
    document.removeEventListener('visibilitychange', this._onVisibility);
    window.removeEventListener('keydown', this._onEscape);
    this._observer?.disconnect();
    this._stopSnapshots();
    this._stopRepeat();
    // Privacy badges waiting for their switch: drop their timers so none fires on the detached card.
    for (const p of this._pending?.values() || []) clearTimeout(p.timer);
    this._pending?.clear();
    if (this._pseudo) this._setPseudo(this._pseudo, false);
  }

  set hass(hass) {
    this._hass = hass;
    this._viewRendered = false;
    this._update();
    // _renderView has just synced the tiles it rendered: no second pass over them.
    if (!this._viewRendered) {
      this._syncTiles();
      // A failed player load is retried on every update until it succeeds, not only when the grid changes.
      this._loadStream();
    }
    this._syncSnapshots();
  }

  // The live parts of the card follow the page and the viewport: players and snapshot refresh.
  _syncLive() {
    this._syncTiles();
    this._syncSnapshots();
  }

  // Nothing live while the page is hidden (other tab, phone locked) or the card is off screen. A tile in
  // fullscreen keeps playing when the card itself is scrolled away (the browser's fullscreen may report it so).
  _paused(tile) {
    if (document.visibilityState === 'hidden') return true;
    return !!this._offscreen && !(tile && this._fullscreen(tile));
  }

  // Overridden by the mini card: compact view and its detail button.
  _compact() {
    return false;
  }

  _zoomButton() {
    return '';
  }

  // Home Assistant's player, loaded through the first tile's camera; tiles spin until it is defined.
  _loadStream() {
    if (!this._streamEntity || customElements.get('ha-camera-stream')) return;
    hcLoadStream(this._streamEntity).catch(() => {});
  }

  getCardSize() {
    return 8;
  }

  getGridOptions() {
    return { columns: 'full', min_columns: 6 };
  }

  _lang() {
    return hcLang(this._config?.language || this._hass?.language || document.documentElement.lang || 'en');
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
    // Tapo Cameras: what the cameras' own stream quality selects say (the first one; the switch sets them all)
    const select = this._qualitySelects()[0];
    if (select && this._usable(select)) return this._state(select) !== 'sd';
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

  // False for a switch that is unavailable, unknown or missing: toggling it would do nothing (Home Assistant
  // skips unavailable entities without an error), so its badge is shown disabled instead.
  _usable(id) {
    const state = this._state(id);
    return state !== undefined && state !== 'unavailable' && state !== 'unknown';
  }

  // The switch a tap on the camera's badge toggles: its power switch while that is off (the privacy
  // switch cannot bring the camera back then, and is usually unavailable with the power cut), else
  // its privacy switch, or its power switch when it has no privacy switch.
  _target(cam) {
    if (cam.power && this._state(cam.power) === 'off') return cam.power;
    return cam.privacy || cam.power;
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
    const compact = this._compact();
    this.shadowRoot.querySelector('ha-card')?.classList.toggle('mini', compact);

    const headSig = JSON.stringify([
      this._lang(),
      compact,
      this._zoomButton(),
      hd,
      [...(this._pending?.keys() || [])],
      cams.map((cam) => [
        cam.name,
        cam.short,
        cam.privacy,
        cam.power,
        this._hidden(cam),
        this._target(cam),
        this._usable(this._target(cam)),
      ]),
    ]);
    if (headSig !== this._headSig) {
      this._headSig = headSig;
      this._renderHead(cams, visible, hd);
    }

    const viewSig = compact
      ? JSON.stringify([
          this._lang(),
          'compact',
          this._config.aspect_ratio,
          this._config.zoom,
          cams.map((cam) => [cam.key, this._snapEntity(cam), cam.name, cam.short, this._thumbState(cam), cam.motion]),
        ])
      : JSON.stringify([
          this._lang(),
          hd,
          this._config.columns,
          this._config.aspect_ratio,
          cams.length,
          visible.map((cam) => [cam.key, cam.camera, cam.sd, cam.name, cam.ptz, cam.motion]),
        ]);
    if (viewSig !== this._viewSig) {
      this._viewSig = viewSig;
      if (compact) this._renderThumbs(cams);
      else this._renderView(visible, hd, cams.length);
    }
    this._syncMotion();
  }

  // Motion badge of each tile and snapshot: shown while one of its camera's motion sensors is on.
  // Toggled in place, so a motion never reloads a snapshot or a player.
  _syncMotion() {
    const show = this._config.show_motion !== false;
    for (const el of this.shadowRoot.querySelectorAll('[data-motion]')) {
      const ids = el.dataset.motion.split(' ').filter(Boolean);
      el.classList.toggle('motion', show && ids.some((id) => this._state(id) === 'on'));
    }
  }

  // The motion mark of a snapshot label (shown by _syncMotion); a tile has its own, labelled in _fillTile.
  _motionMark() {
    const label = hcEsc(this._t('motion'));
    return `<span class="mot" role="img" aria-label="${label}"><ha-icon icon="mdi:motion-sensor"></ha-icon></span>`;
  }

  // ── Compact view (mini card): a snapshot per camera, refreshed every HC_SNAPSHOT_MS ──
  // The lighter SD stream when the camera has one: a thumbnail needs no more.
  _snapEntity(cam) {
    return cam.sd || cam.camera;
  }

  // live, hidden (privacy: no snapshot is fetched) or off (camera unavailable).
  _thumbState(cam) {
    if (this._hidden(cam)) return 'hidden';
    const st = this._hass.states[this._snapEntity(cam)];
    return st && st.state !== 'unavailable' ? 'live' : 'off';
  }

  _renderThumbs(cams) {
    this._viewRendered = true;
    this._dropTiles();
    const view = this.shadowRoot.querySelector('.view');
    if (!cams.length) {
      view.innerHTML = `<div class="empty"><ha-icon icon="mdi:cctv-off"></ha-icon>${hcEsc(this._t('no_cameras'))}</div>`;
      this._syncSnapshots();
      return;
    }
    const thumbs = cams.map((cam) => {
      const state = this._thumbState(cam);
      const mark =
        state === 'live'
          ? '<span class="dot"></span>'
          : `<ha-icon icon="${state === 'hidden' ? 'mdi:eye-lock' : 'mdi:cctv-off'}"></ha-icon>`;
      // A tap on a thumbnail opens the full card, so a hidden one's tooltip only says it is hidden.
      const title = state === 'hidden' ? this._t('cam_hidden', { c: cam.name }) : state === 'off' ? this._t('unavailable') : cam.name;
      // Screen readers get the state the image shows: hidden or offline, not just the camera's name.
      const label =
        state === 'hidden'
          ? this._t('cam_hidden', { c: cam.name })
          : state === 'off'
            ? this._t('privacy_unavailable', { c: cam.name })
            : cam.name;
      return (
        `<div class="thumb ${state}" data-action="zoom" data-entity="${hcEsc(cam.camera)}"` +
        ` data-motion="${hcEsc(cam.motion.join(' '))}" data-name="${hcEsc(cam.name)}" role="button" tabindex="0"` +
        ` title="${hcEsc(title)}" aria-label="${hcEsc(label)}">` +
        (state === 'live' ? `<img alt="" data-snap="${hcEsc(this._snapEntity(cam))}">` : '') +
        '<div class="na"></div>' +
        `<div class="label">${mark}<span class="text">${hcEsc(cam.short)}</span>${this._motionMark()}</div></div>`
      );
    });
    view.innerHTML =
      `<div class="thumbs" style="--hc-ratio: ${hcRatio(this._config.aspect_ratio)}">${thumbs.join('')}</div>`;
    for (const img of view.querySelectorAll('.thumb img')) {
      img.addEventListener('error', () => this._snapFailed(img, true));
      img.addEventListener('load', () => this._snapFailed(img, false));
    }
    this._syncSnapshots();
  }

  // A snapshot that fails to load shows the offline look instead of a broken image, until one loads again.
  _snapFailed(img, failed) {
    const thumb = img.closest('.thumb');
    if (!thumb || thumb.classList.contains('failed') === failed) return;
    const name = thumb.dataset.name;
    thumb.classList.toggle('failed', failed);
    const mark = failed ? document.createElement('ha-icon') : Object.assign(document.createElement('span'), { className: 'dot' });
    if (failed) mark.setAttribute('icon', 'mdi:cctv-off');
    thumb.querySelector('.label').firstElementChild.replaceWith(mark);
    thumb.title = failed ? this._t('unavailable') : name;
    thumb.setAttribute('aria-label', failed ? this._t('privacy_unavailable', { c: name }) : name);
  }

  // Snapshot of each live thumbnail, with a cache-busting stamp that moves on every refresh. The refresh
  // only runs while thumbnails are shown and the card is on screen in a visible page; it takes a fresh
  // snapshot as soon as it starts again.
  _syncSnapshots() {
    const imgs = this.isConnected && this._hass ? this.shadowRoot?.querySelectorAll('.thumb img') || [] : [];
    if (!imgs.length || this._paused()) {
      this._stopSnapshots();
      return;
    }
    if (!this._snapTimer) {
      this._snapAt = Date.now();
      this._snapTimer = setInterval(() => {
        this._snapAt = Date.now();
        this._syncSnapshots();
      }, HC_SNAPSHOT_MS);
    }
    for (const img of imgs) {
      const id = img.dataset.snap;
      const pic = this._hass.states[id]?.attributes?.entity_picture || `/api/camera_proxy/${id}`;
      const src = `${pic}${pic.includes('?') ? '&' : '?'}_t=${this._snapAt}`;
      if (img.getAttribute('src') !== src) img.setAttribute('src', src);
    }
  }

  _stopSnapshots() {
    clearInterval(this._snapTimer);
    this._snapTimer = null;
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
      `<span class="opt${on ? ' on' : ''}" data-quality="${q}" role="radio" aria-checked="${on}" tabindex="${on ? 0 : -1}">${this._t(q)}</span>`;
    const quality = `<span class="seg" role="radiogroup" title="${hcEsc(this._t('quality_hint'))}">${opt('hd', hd)}${opt('sd', !hd)}</span>`;

    // Lock icon by state; a spinning icon while the switch toggled from the card has not answered yet.
    const lock = (cam) => {
      const target = this._target(cam);
      if (this._isPending(target)) return { cls: 'pending', icon: 'mdi:loading', title: this._t('pending') };
      // Its switch unavailable (camera offline): a tap would do nothing, the badge says so instead of "visible".
      if (!this._usable(target)) return { cls: 'dis', icon: 'mdi:cancel', title: this._t('privacy_unavailable', { c: cam.name }) };
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
          const target = this._target(cam);
          const label = single ? this._t(this._hidden(cam) ? 'enable' : 'disable') : cam.short;
          const attrs = `data-toggle="${hcEsc(target)}"${l.cls === 'dis' ? ' aria-disabled="true"' : ''}`;
          return this._chip(l.cls, attrs, badgeIcon(l), label, l.title);
        })
        .join('');
    }

    // A single camera with a toggle: the toggle sits on the right of the title, the quality under it
    // (only while the camera films: once it is hidden, the line says so instead).
    // No camera on screen: nothing to choose a quality for.
    let right = visible.length ? quality : '';
    let side = '';
    let sub = summary ? `<div class="summary">${hcEsc(summary)}</div>` : '';
    if (single && badges && !this._wall) {
      // Icon only, the size of the header icon; the text stays in the tooltip and for screen readers.
      // Same marks as the badges: the red live dot while the camera films, the lock while it is hidden.
      const cam = cams[0];
      const l = lock(cam);
      const label = l.cls === 'pending' || l.cls === 'dis' ? l.title : this._t(this._hidden(cam) ? 'enable' : 'disable');
      right = '';
      side =
        `<span class="toggle ${l.cls}" data-toggle="${hcEsc(this._target(cam))}" role="button" tabindex="0"` +
        (l.cls === 'dis' ? ' aria-disabled="true"' : '') +
        ` title="${hcEsc(label)}" aria-label="${hcEsc(label)}">` +
        `${badgeIcon(l) ? `<ha-icon icon="${l.icon}"></ha-icon>` : '<span class="dot"></span>'}</span>`;
      if (visible.length) sub = `<div class="chips sub">${quality}</div>`;
      badges = '';
    }
    // Compact view (mini card): the title and its status only; the toggles and HD / SD are in the full view.
    if (this._compact()) {
      right = '';
      side = '';
      badges = '';
      const status = single && visible.length && c.show_summary ? this._t('live') : summary;
      sub = status ? `<div class="summary">${hcEsc(status)}</div>` : '';
    }

    const head = this.shadowRoot.querySelector('.head');
    // Replacing the header drops the keyboard focus (HD/SD toggled, a badge tapped): remember which
    // control held it, and give it back to its replacement.
    const focused = this.shadowRoot.activeElement;
    const kind = head.contains(focused) && (focused.dataset?.quality ? 'quality' : focused.dataset?.toggle ? 'toggle' : null);
    if (this._wall) {
      // Video wall: one thin bar, the status on the left, the privacy badges, HD / SD on the right.
      head.innerHTML =
        `<div class="wallbar">${summary ? `<div class="summary">${hcEsc(summary)}</div>` : ''}` +
        `<div class="chips badges">${badges}</div><div class="chips">${right}</div></div>`;
    } else {
      this._renderHeader(head, { title, right, side, sub, badges, level: cams.length && !visible.length ? 'off' : 'on' });
    }
    if (kind) {
      for (const el of head.querySelectorAll(`[data-${kind}]`)) {
        if (el.dataset[kind] !== focused.dataset[kind]) continue;
        el.focus({ preventScroll: true });
        break;
      }
    }
  }

  // The card's own header: icon, title with HD / SD, status line, then the privacy badges.
  _renderHeader(head, { title, right, side, sub, badges, level }) {
    const c = this._config;
    head.innerHTML =
      `<div class="header"><div class="hicon ${level}"><ha-icon icon="${hcEsc(c.icon || 'mdi:cctv')}"></ha-icon></div>` +
      `<div class="titles"><div class="name-row"><div class="name">${hcEsc(title)}</div><div class="chips">${right}</div></div>` +
      sub +
      `</div>${side}${this._zoomButton()}</div>` +
      (badges ? `<div class="chips badges">${badges}</div>` : '');
  }

  // The grid of tiles, one per visible camera. Tiles are kept across renders and only added or removed
  // where needed: a tile that stays in place keeps its stream running (moving a player reconnects it).
  // count: cameras the card shows (entries without a camera entity are skipped), as in the header.
  _renderView(visible, hd, count) {
    this._viewRendered = true;
    const view = this.shadowRoot.querySelector('.view');
    if (!this._tiles) this._tiles = new Map();
    // Back from the compact view: its thumbnails give way to the grid.
    if (view.querySelector('.thumbs')) view.replaceChildren();
    if (!visible.length) {
      this._dropTiles();
      const n = count;
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
    this._streamEntity = visible[0].camera;
    this._loadStream();
    let grid = view.querySelector('.grid');
    if (!grid) {
      grid = document.createElement('div');
      grid.className = 'grid';
      view.replaceChildren(grid);
    }
    // The wall fits as many tiles of at least 360 px as the width takes (one per row on a phone)
    grid.style.gridTemplateColumns =
      this._wall && !this._columnsSet
        ? 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))'
        : `repeat(${hcColumns(this._config, visible.length)}, minmax(0, 1fr))`;
    grid.style.setProperty('--hc-ratio', String(hcRatio(this._config.aspect_ratio)));

    const keys = new Set(visible.map((cam) => cam.key));
    for (const [key, tile] of this._tiles) {
      if (keys.has(key)) continue;
      this._dropTile(tile);
      tile.remove();
      this._tiles.delete(key);
    }
    visible.forEach((cam, i) => {
      let tile = this._tiles.get(cam.key);
      if (!tile) {
        tile = this._tile();
        this._tiles.set(cam.key, tile);
      }
      this._fillTile(tile, cam, hd, count === 1);
      if (grid.children[i] !== tile) grid.insertBefore(tile, grid.children[i] || null);
    });
    this._syncTiles();
  }

  // Every tile goes (all cameras hidden, or the compact view): their players close with them.
  _dropTiles() {
    for (const tile of this._tiles?.values() || []) this._dropTile(tile);
    this._tiles?.clear();
    this._streamEntity = null;
  }

  // A tile leaving the grid: it gives back the page scroll if it covered the screen, and stops a held arrow.
  _dropTile(tile) {
    if (tile === this._pseudo) this._setPseudo(tile, false);
    if (this._repeatBtn && tile.contains(this._repeatBtn)) this._stopRepeat();
  }

  _tile() {
    const tile = document.createElement('div');
    tile.className = 'tile';
    // A group of controls; the image itself is a button (.open) under the other buttons, never around them.
    tile.setAttribute('role', 'group');
    tile.innerHTML =
      '<div class="na"><ha-icon icon="mdi:cctv-off"></ha-icon><span></span></div><div class="spin"></div>' +
      '<div class="label"><span class="dot"></span><span class="text"></span><span class="mot" role="img"><ha-icon icon="mdi:motion-sensor"></ha-icon></span></div>' +
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
  _fillTile(tile, cam, hd, single) {
    tile._cam = cam;
    tile._entity = hd || !cam.sd ? cam.camera : cam.sd;
    tile.dataset.cam = cam.key;
    tile.setAttribute('aria-label', cam.name);
    tile.querySelector('.open').title = cam.name;
    // A single camera already has its name as the card title: its image just says it is live.
    tile.querySelector('.label .text').textContent = single ? this._t('live') : cam.name;
    tile.querySelector('.na span').textContent = this._t('unavailable');
    tile.dataset.motion = cam.motion.join(' ');
    tile.querySelector('.mot').setAttribute('aria-label', this._t('motion'));
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
    tile.classList.toggle('has-ptz', !!cam.ptz);
    if (!cam.ptz) tile.classList.remove('ptz-open');
    this._soundIcon(tile);
    this._syncPtz(tile);
  }

  // Live state of every tile: the camera's state object, and which PTZ buttons can be pressed.
  // While the page is hidden (other tab, phone locked) or the card off screen, the players are emptied,
  // which closes the streams; they connect again once it shows.
  _syncTiles() {
    if (!this._tiles || !this._hass) return;
    for (const tile of this._tiles.values()) {
      const paused = this._paused(tile);
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
      // A camera that switched its stream itself (Tapo Cameras: the stream_quality attribute) plays again,
      // so the player negotiates the new stream instead of keeping the old one.
      const q = obj?.attributes?.stream_quality;
      if (obj && stream.stateObj && tile._q !== undefined && q !== tile._q) {
        stream.stateObj = undefined;
        tile.classList.add('loading');
      }
      if (obj) tile._q = q;
      if (stream.stateObj !== obj) stream.stateObj = obj;
      this._syncPtz(tile);
    }
  }

  _syncPtz(tile) {
    if (!tile._cam?.ptz) return;
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
    // The tile only covers the page: a drag on the image would still scroll the dashboard behind it.
    // The page's own overflow is put back on the way out, not cleared.
    const html = document.documentElement.style;
    const body = document.body.style;
    if (on) {
      if (!this._overflow) this._overflow = [html.overflow, body.overflow];
      html.overflow = 'hidden';
      body.overflow = 'hidden';
    } else if (this._overflow) {
      [html.overflow, body.overflow] = this._overflow;
      this._overflow = null;
    }
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
    this._call('button', 'press', { entity_id: b.dataset.entity }).catch(() => {});
  }

  // A service call as a promise, whether Home Assistant's callService throws, rejects or returns nothing.
  _call(domain, service, data) {
    try {
      return Promise.resolve(this._hass.callService(domain, service, data));
    } catch (err) {
      return Promise.reject(err);
    }
  }

  _onPointerDown(ev) {
    const b = ev.composedPath().find((n) => n.dataset?.action === 'move');
    if (!b || ev.button > 0) return;
    this._stopRepeat();
    this._move(b);
    this._repeatBtn = b;
    this._repeat = setTimeout(() => {
      this._repeat = setInterval(() => {
        // The arrow was re-rendered or its tile removed while held: its pointerup will never come.
        if (!b.isConnected) this._stopRepeat();
        else this._move(b);
      }, HC_PTZ_REPEAT_MS);
    }, HC_PTZ_HOLD_MS);
    // The release is heard on the window (it still arrives if the arrow is replaced meanwhile); the
    // listeners all go away together, so none piles up on the button.
    this._repeatAbort = new AbortController();
    const opts = { signal: this._repeatAbort.signal };
    const stop = () => this._stopRepeat();
    window.addEventListener('pointerup', stop, opts);
    window.addEventListener('pointercancel', stop, opts);
    b.addEventListener('pointerleave', stop, opts);
  }

  _stopRepeat() {
    clearTimeout(this._repeat);
    clearInterval(this._repeat);
    this._repeat = null;
    this._repeatBtn = null;
    this._repeatAbort?.abort();
    this._repeatAbort = null;
  }

  _onKey(ev) {
    const path = ev.composedPath();
    // HD / SD radio group: the arrow keys select the other option and move the focus to it.
    const radio = path.find((n) => n.dataset?.quality);
    if (radio && /^Arrow(Left|Right|Up|Down)$/.test(ev.key)) {
      ev.preventDefault();
      const other = radio.parentNode.querySelector(`[data-quality="${radio.dataset.quality === 'hd' ? 'sd' : 'hd'}"]`);
      other?.focus({ preventScroll: true });
      if ((other?.dataset.quality === 'hd') !== this._hd()) this._toggleQuality();
      return;
    }
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
      // --hc-on-ink: the hidden state's green for text and lone icons, pulled toward the text colour so it
      // stays readable on its tinted badge (darker in a light theme, lighter in a dark one).
      // A one-column grid whose track may shrink to 0: the card takes its width from its parent (its header and tiles
      // never set a minimum width, so in a 1fr 1fr grid it keeps to its half, placed directly or in a <div>), while a
      // parent sized by its content (inline-block, an auto grid column) still gets the card's natural width.
      ':host { display: grid; grid-template-columns: minmax(0, 1fr); --hc-on: var(--success-color, #43a047);' +
      ' --hc-on-ink: color-mix(in srgb, var(--hc-on) 60%, var(--primary-text-color, #212121));' +
      ' --hc-live: var(--error-color, #db4437); --hc-glass: rgba(14, 16, 20, 0.46); --hc-glass-line: rgba(255, 255, 255, 0.14); }' +
      'ha-card { box-sizing: border-box; padding: 12px; display: flex; flex-direction: column; gap: 8px; overflow: hidden; }' +
      // Icon and single-camera toggle at the top of the header row (12 px from the card's edge), the titles
      // centred beside them, even when the HD / SD switch under a single camera's name makes them taller.
      '.header { display: flex; align-items: flex-start; gap: 10px; }' +
      '.hicon { width: 40px; height: 40px; border-radius: 50%; flex: none; display: grid; place-items: center;' +
      ' --hc-c: var(--primary-color, #03a9f4); background: color-mix(in srgb, var(--hc-c) 16%, transparent); color: var(--hc-c); }' +
      '.hicon.off { --hc-c: var(--secondary-text-color); }' +
      '.hicon ha-icon { --mdc-icon-size: 24px; }' +
      // Narrow card (half a Sections view, or a narrow column): the title shrinks to an ellipsis but keeps a few letters,
      // the HD / SD switch goes under it rather than out of the card, and the round buttons never shrink.
      '.titles { flex: 1 1 auto; min-width: 0; align-self: center; }' +
      '.name-row { display: flex; flex-wrap: wrap; align-items: center; column-gap: 8px; row-gap: 4px; }' +
      '.name-row > .chips { flex: none; margin-left: auto; }' +
      '.chips:empty { display: none; }' +
      '.name { flex: 1 1 0; min-width: 4ch; font-size: 16px; font-weight: 500; line-height: 1.25; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }' +
      '.summary { font-size: 12px; line-height: 1.35; margin-top: 2px; color: var(--secondary-text-color); }' +
      '.chips { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px; }' +
      '.chips.badges, .chips.sub { justify-content: flex-start; }' +
      '.chips.badges { margin-top: 8px; }' +
      '.chips.sub { margin-top: 4px; }' +
      // HD / SD switch: a track with the current option raised on it.
      '.seg { display: inline-flex; padding: 2px; gap: 2px; border-radius: 12px; background: var(--secondary-background-color, rgba(128,128,128,0.12)); }' +
      '.opt { font-size: 11px; font-weight: 600; letter-spacing: 0.02em; line-height: 18px; padding: 0 8px; border-radius: 10px; cursor: pointer;' +
      ' color: var(--secondary-text-color); user-select: none; transition: background 0.15s, color 0.15s; }' +
      '.opt.on { background: var(--card-background-color, #fff); color: var(--primary-color, #03a9f4); box-shadow: 0 1px 2px rgba(0,0,0,0.18); cursor: default; }' +
      '.opt:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }' +
      // Single camera: its badge as a round button, styled like the badges (neutral with the live dot,
      // green-tinted with the lock).
      '.toggle { width: 40px; height: 40px; border-radius: 50%; flex: none; display: flex; align-items: center; justify-content: center; cursor: pointer;' +
      ' background: var(--secondary-background-color, rgba(128,128,128,0.12)); color: var(--primary-text-color); }' +
      '.toggle.private { background: color-mix(in srgb, var(--hc-on) 16%, transparent); color: var(--hc-on-ink); }' +
      '.toggle.pending { color: var(--secondary-text-color); cursor: progress; }' +
      '.toggle ha-icon { --mdc-icon-size: 22px; }' +
      '.toggle .dot { width: 12px; height: 12px; }' +
      // Badges: neutral with a red live dot while the camera films, green-tinted with a lock while hidden.
      '.chip { display: inline-flex; align-items: center; gap: 5px; max-width: 100%; min-width: 0; box-sizing: border-box; font-size: 11px; font-weight: 500; line-height: 18px; padding: 1px 9px 1px 7px; border-radius: 12px;' +
      ' cursor: pointer; white-space: nowrap; user-select: none; background: var(--secondary-background-color, rgba(128,128,128,0.12)); color: var(--primary-text-color); }' +
      '.chip ha-icon { --mdc-icon-size: 13px; flex: none; }' +
      // A long badge name ends with an ellipsis instead of running out of the card (the full name is in the title).
      '.chip > span:last-child { min-width: 0; overflow: hidden; text-overflow: ellipsis; }' +
      '.chip.private { background: color-mix(in srgb, var(--hc-on) 16%, transparent); color: var(--hc-on-ink); }' +
      ':is(.chip, .toggle).private:hover { background: color-mix(in srgb, var(--hc-on) 24%, transparent); }' +
      '.chip.pending { cursor: progress; color: var(--secondary-text-color); }' +
      // Switch unavailable: greyed out, and a tap does nothing.
      ':is(.chip, .toggle).dis { opacity: 0.5; cursor: not-allowed; color: var(--secondary-text-color); }' +
      '.chip:focus-visible, .toggle:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }' +
      '.dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; background: var(--hc-live); }' +
      '.pending ha-icon { animation: hc-spin 0.9s linear infinite; }' +
      '@keyframes hc-spin { to { transform: rotate(360deg); } }' +
      // The one moving thing: the live dot on the images breathes, like a recording light.
      '@keyframes hc-live { 50% { opacity: 0.35; } }' +
      '.view:empty { display: none; }' +
      // Video wall: no card, the grid edge to edge under a thin status bar.
      ':host([wall]) ha-card { background: none; border: none; box-shadow: none; border-radius: 0; padding: 0; gap: 8px; overflow: visible; }' +
      '.wallbar { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 12px; min-height: 28px; }' +
      '.wallbar .summary { margin: 0; font-size: 13px; }' +
      '.wallbar .chips.badges { margin: 0; flex: 1 1 auto; }' +
      // On the page background, the badges and the HD / SD track take the card colour to stand out from it
      ':host([wall]) :is(.chip:not(.private), .seg) { background: var(--card-background-color, #fff); }' +
      ':host([wall]) .opt.on { background: var(--secondary-background-color, rgba(128,128,128,0.12)); box-shadow: none; }' +
      ':host([wall]) .grid { gap: 6px; }' +
      ':host([wall]) .tile { border-radius: 10px; }' +
      '.grid { display: grid; gap: 8px; }' +
      // container-type: size gives the tile no width of its own: in a parent sized by its content (inline-block,
      // an auto grid column) the card would fold to its padding. contain-intrinsic-width stands in for the image
      // there, and changes nothing where the card is given its width (the Sections view, a stack).
      '.tile { position: relative; aspect-ratio: var(--hc-ratio, 1.7778); border-radius: 12px; overflow: hidden; background: #0d0f12; container-type: size;' +
      ' contain-intrinsic-width: 240px; }' +
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
      // Above the pan & tilt pad: on narrow tiles the pad reaches the corner of the pan & tilt button.
      '.tools { position: absolute; top: 8px; right: 8px; z-index: 1; display: flex; gap: 6px; transition: opacity 0.15s; }' +
      ':is(.tile:fullscreen, .tile.pseudo) .tools { top: max(16px, env(safe-area-inset-top)); right: max(16px, env(safe-area-inset-right)); }' +
      '.btn { width: 30px; height: 30px; box-sizing: border-box; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;' +
      ' color: #fff; background: var(--hc-glass); border: 1px solid var(--hc-glass-line); -webkit-backdrop-filter: blur(10px) saturate(1.3); backdrop-filter: blur(10px) saturate(1.3);' +
      ' -webkit-tap-highlight-color: transparent; user-select: none; transition: background 0.15s, transform 0.1s; }' +
      '.btn:hover { background: rgba(14, 16, 20, 0.66); }' +
      '.btn:active { transform: scale(0.94); }' +
      '.btn:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }' +
      '.btn ha-icon { --mdc-icon-size: 17px; }' +
      // On: the same glass, the icon in the accent colour (no fill, like the other ha-* cards), and a faint
      // accent ring that keeps the state readable where light scenes turn the glass grey.
      '.tile.ptz-open .btn.ptz, .btn.sound.on, .move:active { color: var(--primary-color, #03a9f4);' +
      ' box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color, #03a9f4) 40%, transparent); }' +
      // Narrow tiles: the up arrow would run into the other buttons.
      '.tile.ptz-open .tools .btn:not(.ptz) { display: none; }' +
      // Pan & tilt: a round pad, its four arrows around a centre dot, in the bottom right corner (under the
      // thumb), sized to the tile (container units). Lightly tinted and not blurred: the image stays visible
      // through it, the arrows keep a shadow to stay readable on any scene.
      '.tile { --pad: min(120px, 58cqh); }' +
      '.pad { display: none; position: absolute; width: var(--pad); height: var(--pad); border-radius: 50%;' +
      ' right: 8px; bottom: 8px; background: rgba(14, 16, 20, 0.26); border: 1px solid rgba(255, 255, 255, 0.2); }' +
      '.tile.ptz-open .pad, :is(.tile:fullscreen, .tile.pseudo).has-ptz .pad { display: block; }' +
      '.pad::after { content: ""; position: absolute; inset: 0; margin: auto; width: calc(var(--pad) * 0.07); height: calc(var(--pad) * 0.07); border-radius: 50%;' +
      ' background: rgba(255,255,255,0.22); pointer-events: none; }' +
      '.move { --s: calc(var(--pad) * 0.32); position: absolute; width: var(--s); height: var(--s); touch-action: none;' +
      ' background: transparent; border-color: transparent; -webkit-backdrop-filter: none; backdrop-filter: none; }' +
      '.move:hover { background: rgba(255,255,255,0.12); }' +
      '.move:active { background: var(--hc-glass); }' +
      '.move ha-icon { --mdc-icon-size: calc(var(--s) * 0.62); filter: drop-shadow(0 1px 2px rgba(0,0,0,0.7)); }' +
      '.move.left { left: 2px; top: calc(50% - var(--s) / 2); }' +
      '.move.right { right: 2px; top: calc(50% - var(--s) / 2); }' +
      '.move.up { top: 2px; left: calc(50% - var(--s) / 2); }' +
      '.move.down { bottom: 2px; left: calc(50% - var(--s) / 2); }' +
      '.move.dis { opacity: 0.35; cursor: default; }' +
      // The name keeps clear of the pad.
      '.tile.ptz-open .label { max-width: calc(100% - var(--pad) - 24px); }' +
      ':is(.tile:fullscreen, .tile.pseudo) { --pad: 164px; }' +
      ':is(.tile:fullscreen, .tile.pseudo) .pad { right: max(24px, env(safe-area-inset-right)); bottom: max(24px, env(safe-area-inset-bottom)); }' +
      ':is(.tile:fullscreen, .tile.pseudo) .btn:not(.move) { width: 40px; height: 40px; }' +
      ':is(.tile:fullscreen, .tile.pseudo) .btn:not(.move) ha-icon { --mdc-icon-size: 20px; }' +
      // Mouse: the buttons show on hover, so the image stays clear. Touch: always shown, and larger.
      '@media (hover: hover) and (pointer: fine) {' +
      ' .tile:not(:hover):not(:focus-within):not(.ptz-open) .tools { opacity: 0; } }' +
      // Touch: buttons larger, and a pad never too small for a finger, even on a narrow tile.
      '@media (pointer: coarse) { .btn:not(.move) { width: 36px; height: 36px; } .btn:not(.move) ha-icon { --mdc-icon-size: 20px; }' +
      ' .tile { --pad: min(120px, max(84px, 58cqh)); } }' +
      // Motion badge on the image's label: an amber sensor icon that pulses while a motion sensor is on.
      '.mot { display: none; flex: none; color: var(--warning-color, #ffa600); animation: hc-motion 1.2s ease-in-out infinite; }' +
      '.label .mot ha-icon { --mdc-icon-size: 14px; }' +
      '.tile.motion .label .mot, .thumb.live.motion .label .mot { display: inline-flex; }' +
      ':is(.tile:fullscreen, .tile.pseudo) .label .mot ha-icon { --mdc-icon-size: 18px; }' +
      '@keyframes hc-motion { 50% { opacity: 0.45; transform: scale(0.82); } }' +
      '@media (prefers-reduced-motion: reduce) { .label .dot, .spin, .pending ha-icon, .mot { animation: none; } }' +
      // Every camera hidden: a quiet panel where the grid would be, saying how to bring one back.
      '.asleep { display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 64px; padding: 12px; box-sizing: border-box;' +
      ' border-radius: 12px; border: 1px dashed var(--divider-color, rgba(128,128,128,0.3)); font-size: 12px; color: var(--secondary-text-color); text-align: center; }' +
      '.asleep ha-icon { --mdc-icon-size: 18px; color: var(--hc-on); }' +
      '.empty { display: flex; align-items: center; gap: 10px; color: var(--secondary-text-color); }' +
      // Mini card. Only its compact ha-card is a size container; a size container takes no width from its
      // content, so in a parent sized by its content it would fold to its padding: an empty, zero-height grid
      // before it gives the host up to 240px there, and no minimum. The header icon keeps its 40px.
      ':host([mini]) { display: block; min-width: 0; }' +
      ':host([mini])::before { content: ""; display: grid; grid-template-columns: minmax(0, 240px); height: 0; }' +
      'ha-card.mini { container-type: inline-size; }' +
      // Detail button, top right of the header: the full card and back.
      '.zoom { flex: none; cursor: pointer; width: 24px; height: 24px; margin: -4px -4px 0 0; border-radius: 50%; display: grid; place-items: center;' +
      ' color: var(--secondary-text-color); --mdc-icon-size: 16px; -webkit-tap-highlight-color: transparent; }' +
      '.zoom:hover { background: color-mix(in srgb, var(--secondary-text-color) 14%, transparent); color: var(--primary-text-color); }' +
      '.zoom:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }' +
      // Compact view: a snapshot per camera, as many per row as fit (one camera takes the whole width).
      '.thumbs { display: grid; gap: 6px; grid-template-columns: repeat(auto-fit, minmax(84px, 1fr)); }' +
      '.thumb { position: relative; aspect-ratio: var(--hc-ratio, 1.7778); border-radius: 10px; overflow: hidden; background: #0d0f12; cursor: pointer;' +
      ' -webkit-tap-highlight-color: transparent; }' +
      '.thumb::after { content: ""; position: absolute; inset: 0; border-radius: inherit; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.07); pointer-events: none; }' +
      '.thumb:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 1px; }' +
      '.thumb img { display: block; width: 100%; height: 100%; object-fit: cover; }' +
      '.thumb .na { display: block; }' +
      '.thumb.live:not(.failed) .na, .thumb.failed img { display: none; }' +
      '.thumb .label { left: 4px; bottom: 4px; max-width: calc(100% - 8px); padding: 1px 8px 1px 6px; font-size: 11px; gap: 5px; }' +
      '.thumb .label ha-icon { --mdc-icon-size: 13px; flex: none; }' +
      '.thumb.hidden .label { color: color-mix(in srgb, var(--hc-on) 55%, #fff); }' +
      '.thumb:is(.off, .failed) .label { color: rgba(255,255,255,0.62); }' +
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
      // One toggle at a time: taps while the switch has not answered are ignored, and so are taps on an
      // unavailable switch (its badge is disabled).
      if (this._isPending(id) || !this._usable(id)) return;
      this._call(id.split('.')[0], 'toggle', { entity_id: id }).catch(() => {
        // Refused (not allowed, entity gone): the badge stops waiting at once instead of spinning for 15 s.
        const p = this._pending?.get(id);
        if (!p) return;
        clearTimeout(p.timer);
        this._pending.delete(id);
        this._headSig = null;
        this._update();
      });
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
    else if (action === 'details') this._moreInfo(tile._cam?.camera || tile._entity);
    else if (action === 'move') {
      // A pointer press already moved the camera (pointerdown); a click without a pointer did not.
      if (ev.type !== 'click' || !ev.detail) this._move(btn);
    } else if (tile.classList.contains('ptz-open')) tile.classList.remove('ptz-open');
    // A tap on the image: fullscreen, and out of it again (arrows or not).
    else this._toggleFullscreen(tile);
  }

  // The stream quality selects of the cameras that switch their stream themselves (Tapo Cameras)
  _qualitySelects() {
    if (!this._hass || !this._config) return [];
    return this._cameras()
      .map((cam) => cam.quality)
      .filter(Boolean);
  }

  _toggleQuality() {
    const c = this._config;
    const next = !this._hd();
    // Tapo Cameras: each camera's own select switches its stream (for every viewer: it is the camera's stream)
    const option = next ? 'hd' : 'sd';
    for (const select of this._qualitySelects()) {
      if (this._usable(select) && this._state(select) !== option) {
        this._call('select', 'select_option', { entity_id: select, option }).catch(() => {});
      }
    }
    if (c.quality_entity) {
      const domain = c.quality_entity.split('.')[0];
      this._call(domain, 'select_option', {
        entity_id: c.quality_entity,
        option: next ? c.hd_option : c.sd_option,
      }).catch(() => {});
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
const HC_CAMERA_FIELDS = ['name', 'short_name', 'camera', 'sd', 'privacy', 'power', 'ptz', 'motion'];

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
    return hcLang(this._config?.language || this._hass?.language || document.documentElement.lang || 'en');
  }

  _wall() {
    return this._config?.layout === 'wall' && !this.constructor.mini;
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
      motion: { selector: { entity: { domain: 'binary_sensor' } } },
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
          { name: 'show_motion', selector: { boolean: {} } },
        ],
      },
      // Mini card: its detail button (on unless `zoom: false`).
      ...(this.constructor.mini ? [{ name: 'zoom', selector: { boolean: {} } }] : []),
      {
        name: 'language',
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'fr', label: 'Français' },
              { value: 'en', label: 'English' },
              { value: 'de', label: 'Deutsch' },
              { value: 'es', label: 'Español' },
              { value: 'sr', label: 'Српски' },
              { value: 'sr-Latn', label: 'Srpski (latinica)' },
              { value: 'it', label: 'Italiano' },
              { value: 'nl', label: 'Nederlands' },
              { value: 'pt', label: 'Português (Portugal)' },
              { value: 'pl', label: 'Polski' },
              { value: 'ro', label: 'Română' },
              { value: 'da', label: 'Dansk' },
              { value: 'sv', label: 'Svenska' },
              { value: 'bg', label: 'Български' },
              { value: 'ru', label: 'Русский' },
              { value: 'uk', label: 'Українська' },
              { value: 'hu', label: 'Magyar' },
              { value: 'sk', label: 'Slovenčina' },
              { value: 'cs', label: 'Čeština' },
              { value: 'sl', label: 'Slovenščina' },
              { value: 'lv', label: 'Latviešu' },
              { value: 'el', label: 'Ελληνικά' },
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
      const key = s.name === 'columns' && this._wall() ? 'ed_columns_wall_helper' : `ed_${s.name}_helper`;
      const txt = hcT(lang, key);
      return txt === key ? undefined : txt;
    };
    // Video wall (the Cameras panel): no column count by default, the wall fits as many as the width takes
    const defaults = this._wall() ? Object.assign({}, HC_DEFAULTS, { columns: undefined }) : HC_DEFAULTS;
    const data = Object.assign({}, defaults, this.constructor.mini ? { zoom: true } : {}, this._config);
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
    // On the wall, any column count is a choice (the default is none): 2 is kept like the others
    for (const key of Object.keys(HC_DEFAULTS)) {
      if (key === 'columns' && this._wall()) continue;
      if (value[key] === HC_DEFAULTS[key]) delete value[key];
    }
    if (value.zoom === true) delete value.zoom;
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

class HomeCameraMiniCardEditor extends HomeCameraCardEditor {
  static get mini() {
    return true;
  }
}

// ── home-camera-mini-card ────────────────────────────────────────────────────
// A click in a dialog opened from the card (a camera's more-info) does not fold it back.
const hcInDialog = (ev) => ev.composedPath().some((n) => ['ha-more-info-dialog', 'ha-dialog', 'dialog'].includes(n.localName));

/**
 * Compact card: the header with its status, and a snapshot of each camera (no stream). Its detail button
 * (top right, `zoom: false` removes it) or a tap on a snapshot switches it to the full card and back; a
 * click outside the card brings the compact view back.
 */
class HomeCameraMiniCard extends HomeCameraCard {
  constructor() {
    super();
    this._zoomed = false;
    this._onOutside = (ev) => {
      if (this._zoomed && !ev.composedPath().includes(this) && !hcInDialog(ev)) this._setZoom(false);
    };
  }

  static getConfigElement() {
    return document.createElement('home-camera-mini-card-editor');
  }

  setConfig(config) {
    // The host attribute behind the mini card's styles (its size container); never set in the constructor.
    this.setAttribute?.('mini', '');
    super.setConfig(config);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._onOutside, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._onOutside, true);
  }

  getCardSize() {
    return this._zoomed ? super.getCardSize() : 3;
  }

  getGridOptions() {
    return this._zoomed ? super.getGridOptions() : { columns: 6, min_columns: 6, rows: 'auto' };
  }

  _compact() {
    return !this._zoomed;
  }

  _setZoom(zoomed) {
    this._zoomed = zoomed;
    this._update();
    this._syncLive();
  }

  _zoomButton() {
    if (this._config?.zoom === false) return '';
    const label = this._t(this._zoomed ? 'zoom_out' : 'zoom_in');
    return (
      `<span class="zoom" data-action="zoom" role="button" tabindex="0" title="${hcEsc(label)}" aria-label="${hcEsc(label)}">` +
      `<ha-icon icon="${this._zoomed ? 'mdi:arrow-collapse' : 'mdi:arrow-expand'}"></ha-icon></span>`
    );
  }

  _onClick(ev) {
    const target = ev.composedPath().find((n) => n.dataset?.action === 'zoom');
    if (!target) {
      super._onClick(ev);
      return;
    }
    ev.stopPropagation?.();
    // Without the detail button, a snapshot opens its camera's dialog instead of the full card.
    if (this._config.zoom === false) {
      if (target.dataset.entity) this._moreInfo(target.dataset.entity);
      return;
    }
    this._setZoom(!this._zoomed);
    // Keyboard use (Enter / Space: no click count) keeps the focus on the button, without scrolling the page.
    if (!ev.detail) this.shadowRoot.querySelector('.zoom')?.focus({ preventScroll: true });
  }
}

if (!customElements.get('home-camera-card-editor')) {
  customElements.define('home-camera-card-editor', HomeCameraCardEditor);
}
if (!customElements.get('home-camera-mini-card-editor')) {
  customElements.define('home-camera-mini-card-editor', HomeCameraMiniCardEditor);
}

if (!customElements.get('home-camera-card')) {
  customElements.define('home-camera-card', HomeCameraCard);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'home-camera-card',
    name: 'Home Camera Card',
    description: 'Every home camera in one grid, with privacy toggles, HD/SD switching and PTZ',
    preview: true,
    documentationURL: 'https://github.com/juju35/ha-camera',
  });
}
if (!customElements.get('home-camera-mini-card')) {
  customElements.define('home-camera-mini-card', HomeCameraMiniCard);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'home-camera-mini-card',
    name: 'Home Camera Mini Card',
    description: 'A snapshot of each home camera with its status, and a button to show the full camera card',
    preview: true,
    documentationURL: 'https://github.com/juju35/ha-camera',
  });
}

console.info(
  `%c HOME-CAMERA-CARD %c v${HOME_CAMERA_CARD_VERSION} `,
  'color:#fff;background:#03a9f4;font-weight:700',
  'color:#000;background:#fff',
);
