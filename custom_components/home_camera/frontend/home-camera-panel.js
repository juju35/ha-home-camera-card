/*
 * Home Camera sidebar panel — every home camera on one page, for every user (not only administrators).
 *
 * Two tabs under the toolbar, as in Smart Comfort: Cameras (the cameras full page, as a video wall edge to edge,
 * with no card around them) and, for administrators only, Settings (the sidebar title, the cameras of Home
 * Assistant not shown yet, from home_camera/discover, and the card's own visual editor, with a copy of a camera card found
 * on a dashboard). The settings come from home_camera/subscribe,
 * open to every user and pushed again whenever they change; home_camera/update_settings (administrators)
 * saves them. The tab is in the address (/cameras/settings). The panel draws its toolbar, tabs and forms itself;
 * the camera grid is the card's (streams, privacy, HD / SD, PTZ, fullscreen).
 *
 * https://github.com/juju35/ha-camera
 */
var HOME_CAMERA_PANEL_VERSION = '4.5.1';

var HomeCameraPanelI18n = {
  en: {
    cameras: 'Cameras',
    settings: 'Settings',
    sidebar_title: 'Sidebar title',
    sidebar_title_helper: 'Left empty: “{d}”, in the server’s language',
    cameras_heading: 'Cameras shown',
    save: 'Save',
    revert: 'Cancel changes',
    saved: 'Saved',
    save_error: 'Could not save: {e}',
    unsaved: 'Unsaved changes',
    empty_admin: 'No camera yet: choose them in the Settings tab.',
    empty_user: 'No camera yet: an administrator chooses them in the Settings tab.',
    choose: 'Choose the cameras',
    load_error: 'Could not load the cameras: {e}',
    retry: 'Retry',
    import: 'Copy from a dashboard',
    import_none: 'No camera card found on the dashboards.',
    imported: 'Cameras copied from “{d}”: save to keep them.',
    integration: 'Open the integration',
    found_heading: 'Cameras found',
    found_hint: 'Cameras of Home Assistant not shown in the panel yet.',
    found_none: 'Every camera found is already in the panel.',
    add: 'Add',
    add_all: 'Add all',
    added: 'Cameras added: {n}. Save to keep them.',
    card_error: 'The camera card could not be loaded: clear the browser cache and reload the page.',
  },
  fr: {
    cameras: 'Caméras',
    settings: 'Réglages',
    sidebar_title: 'Titre dans la barre latérale',
    sidebar_title_helper: 'Vide : « {d} », dans la langue du serveur',
    cameras_heading: 'Caméras affichées',
    save: 'Enregistrer',
    revert: 'Annuler les modifications',
    saved: 'Enregistré',
    save_error: 'Enregistrement impossible : {e}',
    unsaved: 'Modifications non enregistrées',
    empty_admin: 'Aucune caméra pour l’instant : choisissez-les dans l’onglet Réglages.',
    empty_user: 'Aucune caméra pour l’instant : un administrateur les choisit dans l’onglet Réglages.',
    choose: 'Choisir les caméras',
    load_error: 'Impossible de charger les caméras : {e}',
    retry: 'Réessayer',
    import: 'Copier depuis un tableau de bord',
    import_none: 'Aucune carte caméras trouvée sur les tableaux de bord.',
    imported: 'Caméras copiées depuis « {d} » : enregistrez pour les garder.',
    integration: 'Ouvrir l’intégration',
    found_heading: 'Caméras trouvées',
    found_hint: 'Caméras de Home Assistant pas encore affichées dans le panneau.',
    found_none: 'Toutes les caméras trouvées sont déjà dans le panneau.',
    add: 'Ajouter',
    add_all: 'Tout ajouter',
    added: 'Caméras ajoutées : {n}. Enregistrez pour les garder.',
    card_error: 'La carte caméras n’a pas pu être chargée : videz le cache du navigateur et rechargez la page.',
  },
  de: {
    cameras: 'Kameras',
    settings: 'Einstellungen',
    sidebar_title: 'Titel in der Seitenleiste',
    sidebar_title_helper: 'Leer: „{d}“, in der Sprache des Servers',
    cameras_heading: 'Angezeigte Kameras',
    save: 'Speichern',
    revert: 'Änderungen verwerfen',
    saved: 'Gespeichert',
    save_error: 'Speichern nicht möglich: {e}',
    unsaved: 'Nicht gespeicherte Änderungen',
    empty_admin: 'Noch keine Kamera: wähle sie im Tab Einstellungen.',
    empty_user: 'Noch keine Kamera: ein Administrator wählt sie im Tab Einstellungen.',
    choose: 'Kameras wählen',
    load_error: 'Kameras konnten nicht geladen werden: {e}',
    retry: 'Erneut versuchen',
    import: 'Aus einem Dashboard kopieren',
    import_none: 'Keine Kamerakarte in den Dashboards gefunden.',
    imported: 'Kameras aus „{d}“ kopiert: speichern, um sie zu behalten.',
    integration: 'Integration öffnen',
    found_heading: 'Gefundene Kameras',
    found_hint: 'Kameras aus Home Assistant, die das Panel noch nicht zeigt.',
    found_none: 'Alle gefundenen Kameras sind bereits im Panel.',
    add: 'Hinzufügen',
    add_all: 'Alle hinzufügen',
    added: 'Kameras hinzugefügt: {n}. Speichern, um sie zu behalten.',
    card_error: 'Die Kamerakarte konnte nicht geladen werden: Browser-Cache leeren und Seite neu laden.',
  },
  es: {
    cameras: 'Cámaras',
    settings: 'Ajustes',
    sidebar_title: 'Título en la barra lateral',
    sidebar_title_helper: 'Vacío: «{d}», en el idioma del servidor',
    cameras_heading: 'Cámaras mostradas',
    save: 'Guardar',
    revert: 'Descartar cambios',
    saved: 'Guardado',
    save_error: 'No se pudo guardar: {e}',
    unsaved: 'Cambios sin guardar',
    empty_admin: 'Aún no hay cámaras: elígelas en la pestaña Ajustes.',
    empty_user: 'Aún no hay cámaras: un administrador las elige en la pestaña Ajustes.',
    choose: 'Elegir las cámaras',
    load_error: 'No se pudieron cargar las cámaras: {e}',
    retry: 'Reintentar',
    import: 'Copiar de un panel',
    import_none: 'No se encontró ninguna tarjeta de cámaras en los paneles.',
    imported: 'Cámaras copiadas de «{d}»: guarda para conservarlas.',
    integration: 'Abrir la integración',
    found_heading: 'Cámaras encontradas',
    found_hint: 'Cámaras de Home Assistant que el panel aún no muestra.',
    found_none: 'Todas las cámaras encontradas ya están en el panel.',
    add: 'Añadir',
    add_all: 'Añadir todas',
    added: 'Cámaras añadidas: {n}. Guarda para conservarlas.',
    card_error: 'No se pudo cargar la tarjeta de cámaras: vacía la caché del navegador y recarga la página.',
  },
  sr: {
    cameras: 'Камере',
    settings: 'Подешавања',
    sidebar_title: 'Наслов у бочној траци',
    sidebar_title_helper: 'Празно: „{d}”, на језику сервера',
    cameras_heading: 'Приказане камере',
    save: 'Сачувај',
    revert: 'Откажи измене',
    saved: 'Сачувано',
    save_error: 'Чување није успело: {e}',
    unsaved: 'Несачуване измене',
    empty_admin: 'Још нема камера: изаберите их на картици Подешавања.',
    empty_user: 'Још нема камера: администратор их бира на картици Подешавања.',
    choose: 'Изабери камере',
    load_error: 'Учитавање камера није успело: {e}',
    retry: 'Покушај поново',
    import: 'Копирај са контролне табле',
    import_none: 'На контролним таблама није пронађена картица камера.',
    imported: 'Камере копиране са „{d}”: сачувајте да бисте их задржали.',
    integration: 'Отвори интеграцију',
    found_heading: 'Пронађене камере',
    found_hint: 'Камере из Home Assistant-а које панел још не приказује.',
    found_none: 'Све пронађене камере су већ у панелу.',
    add: 'Додај',
    add_all: 'Додај све',
    added: 'Додате камере: {n}. Сачувајте да бисте их задржали.',
    card_error: 'Картица камера није учитана: обришите кеш прегледача и поново учитајте страницу.',
  },
  'sr-Latn': {
    cameras: 'Kamere',
    settings: 'Podešavanja',
    sidebar_title: 'Naslov u bočnoj traci',
    sidebar_title_helper: 'Prazno: „{d}”, na jeziku servera',
    cameras_heading: 'Prikazane kamere',
    save: 'Sačuvaj',
    revert: 'Otkaži izmene',
    saved: 'Sačuvano',
    save_error: 'Čuvanje nije uspelo: {e}',
    unsaved: 'Nesačuvane izmene',
    empty_admin: 'Još nema kamera: izaberite ih na kartici Podešavanja.',
    empty_user: 'Još nema kamera: administrator ih bira na kartici Podešavanja.',
    choose: 'Izaberi kamere',
    load_error: 'Učitavanje kamera nije uspelo: {e}',
    retry: 'Pokušaj ponovo',
    import: 'Kopiraj sa kontrolne table',
    import_none: 'Na kontrolnim tablama nije pronađena kartica kamera.',
    imported: 'Kamere kopirane sa „{d}”: sačuvajte da biste ih zadržali.',
    integration: 'Otvori integraciju',
    found_heading: 'Pronađene kamere',
    found_hint: 'Kamere iz Home Assistant-a koje panel još ne prikazuje.',
    found_none: 'Sve pronađene kamere su već u panelu.',
    add: 'Dodaj',
    add_all: 'Dodaj sve',
    added: 'Dodate kamere: {n}. Sačuvajte da biste ih zadržali.',
    card_error: 'Kartica kamera nije učitana: obrišite keš pregledača i ponovo učitajte stranicu.',
  },
  it: {
    cameras: 'Telecamere',
    settings: 'Impostazioni',
    sidebar_title: 'Titolo nella barra laterale',
    sidebar_title_helper: 'Vuoto: «{d}», nella lingua del server',
    cameras_heading: 'Telecamere mostrate',
    save: 'Salva',
    revert: 'Annulla le modifiche',
    saved: 'Salvato',
    save_error: 'Impossibile salvare: {e}',
    unsaved: 'Modifiche non salvate',
    empty_admin: 'Ancora nessuna telecamera: sceglile nella scheda Impostazioni.',
    empty_user: 'Ancora nessuna telecamera: un amministratore le sceglie nella scheda Impostazioni.',
    choose: 'Scegli le telecamere',
    load_error: 'Impossibile caricare le telecamere: {e}',
    retry: 'Riprova',
    import: 'Copia da una plancia',
    import_none: 'Nessuna scheda telecamere trovata nelle plance.',
    imported: 'Telecamere copiate da «{d}»: salva per mantenerle.',
    integration: 'Apri l’integrazione',
    found_heading: 'Telecamere trovate',
    found_hint: 'Telecamere di Home Assistant non ancora mostrate nel pannello.',
    found_none: 'Tutte le telecamere trovate sono già nel pannello.',
    add: 'Aggiungi',
    add_all: 'Aggiungi tutte',
    added: 'Telecamere aggiunte: {n}. Salva per mantenerle.',
    card_error: 'Impossibile caricare la scheda telecamere: svuota la cache del browser e ricarica la pagina.',
  },
  nl: {
    cameras: "Camera's",
    settings: 'Instellingen',
    sidebar_title: 'Titel in de zijbalk',
    sidebar_title_helper: 'Leeg: “{d}”, in de taal van de server',
    cameras_heading: "Getoonde camera's",
    save: 'Opslaan',
    revert: 'Wijzigingen annuleren',
    saved: 'Opgeslagen',
    save_error: 'Opslaan mislukt: {e}',
    unsaved: 'Niet-opgeslagen wijzigingen',
    empty_admin: "Nog geen camera's: kies ze op het tabblad Instellingen.",
    empty_user: "Nog geen camera's: een beheerder kiest ze op het tabblad Instellingen.",
    choose: "Camera's kiezen",
    load_error: "Camera's konden niet worden geladen: {e}",
    retry: 'Opnieuw proberen',
    import: 'Kopiëren uit een dashboard',
    import_none: 'Geen camerakaart gevonden op de dashboards.',
    imported: "Camera's gekopieerd uit “{d}”: sla op om ze te bewaren.",
    integration: 'Integratie openen',
    found_heading: 'Gevonden camera\'s',
    found_hint: 'Camera\'s uit Home Assistant die het paneel nog niet toont.',
    found_none: 'Alle gevonden camera\'s staan al in het paneel.',
    add: 'Toevoegen',
    add_all: 'Alles toevoegen',
    added: 'Camera\'s toegevoegd: {n}. Sla op om ze te bewaren.',
    card_error: 'De camerakaart kon niet worden geladen: wis de browsercache en laad de pagina opnieuw.',
  },
  pt: {
    cameras: 'Câmaras',
    settings: 'Definições',
    sidebar_title: 'Título na barra lateral',
    sidebar_title_helper: 'Vazio: «{d}», no idioma do servidor',
    cameras_heading: 'Câmaras apresentadas',
    save: 'Guardar',
    revert: 'Cancelar alterações',
    saved: 'Guardado',
    save_error: 'Não foi possível guardar: {e}',
    unsaved: 'Alterações não guardadas',
    empty_admin: 'Ainda sem câmaras: escolha-as no separador Definições.',
    empty_user: 'Ainda sem câmaras: um administrador escolhe-as no separador Definições.',
    choose: 'Escolher as câmaras',
    load_error: 'Não foi possível carregar as câmaras: {e}',
    retry: 'Tentar novamente',
    import: 'Copiar de um painel',
    import_none: 'Nenhum cartão de câmaras encontrado nos painéis.',
    imported: 'Câmaras copiadas de «{d}»: guarde para as manter.',
    integration: 'Abrir a integração',
    found_heading: 'Câmaras encontradas',
    found_hint: 'Câmaras do Home Assistant que o painel ainda não mostra.',
    found_none: 'Todas as câmaras encontradas já estão no painel.',
    add: 'Adicionar',
    add_all: 'Adicionar todas',
    added: 'Câmaras adicionadas: {n}. Guarde para as manter.',
    card_error: 'Não foi possível carregar o cartão de câmaras: limpe a cache do navegador e recarregue a página.',
  },
  pl: {
    cameras: 'Kamery',
    settings: 'Ustawienia',
    sidebar_title: 'Tytuł na pasku bocznym',
    sidebar_title_helper: 'Puste: „{d}”, w języku serwera',
    cameras_heading: 'Wyświetlane kamery',
    save: 'Zapisz',
    revert: 'Anuluj zmiany',
    saved: 'Zapisano',
    save_error: 'Nie udało się zapisać: {e}',
    unsaved: 'Niezapisane zmiany',
    empty_admin: 'Brak kamer: wybierz je w karcie Ustawienia.',
    empty_user: 'Brak kamer: administrator wybiera je w karcie Ustawienia.',
    choose: 'Wybierz kamery',
    load_error: 'Nie udało się wczytać kamer: {e}',
    retry: 'Spróbuj ponownie',
    import: 'Skopiuj z dashboardu',
    import_none: 'Nie znaleziono karty kamer na dashboardach.',
    imported: 'Kamery skopiowane z „{d}”: zapisz, aby je zachować.',
    integration: 'Otwórz integrację',
    found_heading: 'Znalezione kamery',
    found_hint: 'Kamery z Home Assistant, których panel jeszcze nie pokazuje.',
    found_none: 'Wszystkie znalezione kamery są już w panelu.',
    add: 'Dodaj',
    add_all: 'Dodaj wszystkie',
    added: 'Dodane kamery: {n}. Zapisz, aby je zachować.',
    card_error: 'Nie udało się wczytać karty kamer: wyczyść pamięć podręczną przeglądarki i odśwież stronę.',
  },
  ro: {
    cameras: 'Camere',
    settings: 'Setări',
    sidebar_title: 'Titlu în bara laterală',
    sidebar_title_helper: 'Gol: „{d}”, în limba serverului',
    cameras_heading: 'Camere afișate',
    save: 'Salvează',
    revert: 'Anulează modificările',
    saved: 'Salvat',
    save_error: 'Salvarea a eșuat: {e}',
    unsaved: 'Modificări nesalvate',
    empty_admin: 'Nicio cameră încă: alegeți-le în fila Setări.',
    empty_user: 'Nicio cameră încă: un administrator le alege în fila Setări.',
    choose: 'Alege camerele',
    load_error: 'Camerele nu au putut fi încărcate: {e}',
    retry: 'Reîncearcă',
    import: 'Copiază dintr-un tablou de bord',
    import_none: 'Niciun card de camere găsit în tablourile de bord.',
    imported: 'Camere copiate din „{d}”: salvați pentru a le păstra.',
    integration: 'Deschide integrarea',
    found_heading: 'Camere găsite',
    found_hint: 'Camere din Home Assistant pe care panoul nu le afișează încă.',
    found_none: 'Toate camerele găsite sunt deja în panou.',
    add: 'Adaugă',
    add_all: 'Adaugă toate',
    added: 'Camere adăugate: {n}. Salvați pentru a le păstra.',
    card_error: 'Cardul camerelor nu a putut fi încărcat: goliți memoria cache a browserului și reîncărcați pagina.',
  },
  da: {
    cameras: 'Kameraer',
    settings: 'Indstillinger',
    sidebar_title: 'Titel i sidepanelet',
    sidebar_title_helper: 'Tom: “{d}”, på serverens sprog',
    cameras_heading: 'Viste kameraer',
    save: 'Gem',
    revert: 'Fortryd ændringer',
    saved: 'Gemt',
    save_error: 'Kunne ikke gemme: {e}',
    unsaved: 'Ikke-gemte ændringer',
    empty_admin: 'Ingen kameraer endnu: vælg dem under fanen Indstillinger.',
    empty_user: 'Ingen kameraer endnu: en administrator vælger dem under fanen Indstillinger.',
    choose: 'Vælg kameraerne',
    load_error: 'Kameraerne kunne ikke indlæses: {e}',
    retry: 'Prøv igen',
    import: 'Kopiér fra et dashboard',
    import_none: 'Intet kamerakort fundet på dashboardene.',
    imported: 'Kameraer kopieret fra “{d}”: gem for at beholde dem.',
    integration: 'Åbn integrationen',
    found_heading: 'Fundne kameraer',
    found_hint: 'Kameraer i Home Assistant, som panelet endnu ikke viser.',
    found_none: 'Alle fundne kameraer er allerede i panelet.',
    add: 'Tilføj',
    add_all: 'Tilføj alle',
    added: 'Kameraer tilføjet: {n}. Gem for at beholde dem.',
    card_error: 'Kamerakortet kunne ikke indlæses: ryd browserens cache, og genindlæs siden.',
  },
  sv: {
    cameras: 'Kameror',
    settings: 'Inställningar',
    sidebar_title: 'Titel i sidofältet',
    sidebar_title_helper: 'Tomt: ”{d}”, på serverns språk',
    cameras_heading: 'Visade kameror',
    save: 'Spara',
    revert: 'Ångra ändringar',
    saved: 'Sparat',
    save_error: 'Kunde inte spara: {e}',
    unsaved: 'Osparade ändringar',
    empty_admin: 'Inga kameror ännu: välj dem på fliken Inställningar.',
    empty_user: 'Inga kameror ännu: en administratör väljer dem på fliken Inställningar.',
    choose: 'Välj kamerorna',
    load_error: 'Kamerorna kunde inte läsas in: {e}',
    retry: 'Försök igen',
    import: 'Kopiera från en instrumentpanel',
    import_none: 'Inget kamerakort hittades på instrumentpanelerna.',
    imported: 'Kameror kopierade från ”{d}”: spara för att behålla dem.',
    integration: 'Öppna integrationen',
    found_heading: 'Hittade kameror',
    found_hint: 'Kameror i Home Assistant som panelen ännu inte visar.',
    found_none: 'Alla hittade kameror finns redan i panelen.',
    add: 'Lägg till',
    add_all: 'Lägg till alla',
    added: 'Kameror tillagda: {n}. Spara för att behålla dem.',
    card_error: 'Kamerakortet kunde inte läsas in: rensa webbläsarens cache och ladda om sidan.',
  },
  bg: {
    cameras: 'Камери',
    settings: 'Настройки',
    sidebar_title: 'Заглавие в страничната лента',
    sidebar_title_helper: 'Празно: „{d}“, на езика на сървъра',
    cameras_heading: 'Показани камери',
    save: 'Запази',
    revert: 'Отказ от промените',
    saved: 'Запазено',
    save_error: 'Неуспешно запазване: {e}',
    unsaved: 'Незапазени промени',
    empty_admin: 'Все още няма камери: изберете ги в раздела Настройки.',
    empty_user: 'Все още няма камери: администратор ги избира в раздела Настройки.',
    choose: 'Изберете камерите',
    load_error: 'Камерите не можаха да се заредят: {e}',
    retry: 'Опитай отново',
    import: 'Копиране от табло',
    import_none: 'Не е намерена карта с камери в таблата.',
    imported: 'Камерите са копирани от „{d}“: запазете, за да ги задържите.',
    integration: 'Отвори интеграцията',
    found_heading: 'Открити камери',
    found_hint: 'Камери от Home Assistant, които панелът още не показва.',
    found_none: 'Всички открити камери вече са в панела.',
    add: 'Добави',
    add_all: 'Добави всички',
    added: 'Добавени камери: {n}. Запазете, за да ги задържите.',
    card_error: 'Картата с камери не можа да се зареди: изчистете кеша на браузъра и презаредете страницата.',
  },
  ru: {
    cameras: 'Камеры',
    settings: 'Настройки',
    sidebar_title: 'Заголовок на боковой панели',
    sidebar_title_helper: 'Пусто: «{d}», на языке сервера',
    cameras_heading: 'Показываемые камеры',
    save: 'Сохранить',
    revert: 'Отменить изменения',
    saved: 'Сохранено',
    save_error: 'Не удалось сохранить: {e}',
    unsaved: 'Несохранённые изменения',
    empty_admin: 'Камер пока нет: выберите их на вкладке «Настройки».',
    empty_user: 'Камер пока нет: администратор выбирает их на вкладке «Настройки».',
    choose: 'Выбрать камеры',
    load_error: 'Не удалось загрузить камеры: {e}',
    retry: 'Повторить',
    import: 'Скопировать с дашборда',
    import_none: 'На дашбордах не найдена карточка камер.',
    imported: 'Камеры скопированы с «{d}»: сохраните, чтобы оставить их.',
    integration: 'Открыть интеграцию',
    found_heading: 'Найденные камеры',
    found_hint: 'Камеры Home Assistant, которых ещё нет на панели.',
    found_none: 'Все найденные камеры уже на панели.',
    add: 'Добавить',
    add_all: 'Добавить все',
    added: 'Добавлено камер: {n}. Сохраните, чтобы оставить их.',
    card_error: 'Не удалось загрузить карточку камер: очистите кэш браузера и перезагрузите страницу.',
  },
  uk: {
    cameras: 'Камери',
    settings: 'Налаштування',
    sidebar_title: 'Заголовок на бічній панелі',
    sidebar_title_helper: 'Порожньо: «{d}», мовою сервера',
    cameras_heading: 'Показані камери',
    save: 'Зберегти',
    revert: 'Скасувати зміни',
    saved: 'Збережено',
    save_error: 'Не вдалося зберегти: {e}',
    unsaved: 'Незбережені зміни',
    empty_admin: 'Камер поки немає: виберіть їх на вкладці «Налаштування».',
    empty_user: 'Камер поки немає: адміністратор вибирає їх на вкладці «Налаштування».',
    choose: 'Вибрати камери',
    load_error: 'Не вдалося завантажити камери: {e}',
    retry: 'Повторити',
    import: 'Скопіювати з дашборда',
    import_none: 'На дашбордах не знайдено картки камер.',
    imported: 'Камери скопійовано з «{d}»: збережіть, щоб залишити їх.',
    integration: 'Відкрити інтеграцію',
    found_heading: 'Знайдені камери',
    found_hint: 'Камери Home Assistant, яких ще немає на панелі.',
    found_none: 'Усі знайдені камери вже на панелі.',
    add: 'Додати',
    add_all: 'Додати всі',
    added: 'Додано камер: {n}. Збережіть, щоб залишити їх.',
    card_error: 'Не вдалося завантажити картку камер: очистьте кеш браузера та перезавантажте сторінку.',
  },
  hu: {
    cameras: 'Kamerák',
    settings: 'Beállítások',
    sidebar_title: 'Cím az oldalsávban',
    sidebar_title_helper: 'Üresen: „{d}”, a szerver nyelvén',
    cameras_heading: 'Megjelenített kamerák',
    save: 'Mentés',
    revert: 'Módosítások elvetése',
    saved: 'Mentve',
    save_error: 'A mentés nem sikerült: {e}',
    unsaved: 'Nem mentett módosítások',
    empty_admin: 'Még nincs kamera: válaszd ki őket a Beállítások lapon.',
    empty_user: 'Még nincs kamera: egy rendszergazda választja ki őket a Beállítások lapon.',
    choose: 'Kamerák kiválasztása',
    load_error: 'A kamerák nem tölthetők be: {e}',
    retry: 'Újra',
    import: 'Másolás irányítópultról',
    import_none: 'Nem található kamerakártya az irányítópultokon.',
    imported: 'Kamerák átmásolva innen: „{d}”; mentsd, hogy megmaradjanak.',
    integration: 'Integráció megnyitása',
    found_heading: 'Talált kamerák',
    found_hint: 'Home Assistant-kamerák, amelyeket a panel még nem mutat.',
    found_none: 'Minden talált kamera már a panelen van.',
    add: 'Hozzáadás',
    add_all: 'Összes hozzáadása',
    added: 'Hozzáadott kamerák: {n}. Mentsd, hogy megmaradjanak.',
    card_error: 'A kamerakártya nem tölthető be: ürítsd a böngésző gyorsítótárát, és töltsd újra az oldalt.',
  },
  sk: {
    cameras: 'Kamery',
    settings: 'Nastavenia',
    sidebar_title: 'Názov v bočnom paneli',
    sidebar_title_helper: 'Prázdne: „{d}“, v jazyku servera',
    cameras_heading: 'Zobrazené kamery',
    save: 'Uložiť',
    revert: 'Zrušiť zmeny',
    saved: 'Uložené',
    save_error: 'Uloženie zlyhalo: {e}',
    unsaved: 'Neuložené zmeny',
    empty_admin: 'Zatiaľ žiadne kamery: vyberte ich na karte Nastavenia.',
    empty_user: 'Zatiaľ žiadne kamery: správca ich vyberá na karte Nastavenia.',
    choose: 'Vybrať kamery',
    load_error: 'Kamery sa nepodarilo načítať: {e}',
    retry: 'Skúsiť znova',
    import: 'Kopírovať z dashboardu',
    import_none: 'Na dashboardoch sa nenašla karta kamier.',
    imported: 'Kamery skopírované z „{d}“: uložte ich, aby zostali.',
    integration: 'Otvoriť integráciu',
    found_heading: 'Nájdené kamery',
    found_hint: 'Kamery z Home Assistant, ktoré panel ešte nezobrazuje.',
    found_none: 'Všetky nájdené kamery sú už v paneli.',
    add: 'Pridať',
    add_all: 'Pridať všetky',
    added: 'Pridané kamery: {n}. Uložte ich, aby zostali.',
    card_error: 'Kartu kamier sa nepodarilo načítať: vymažte vyrovnávaciu pamäť prehliadača a obnovte stránku.',
  },
  cs: {
    cameras: 'Kamery',
    settings: 'Nastavení',
    sidebar_title: 'Název v postranním panelu',
    sidebar_title_helper: 'Prázdné: „{d}“, v jazyce serveru',
    cameras_heading: 'Zobrazené kamery',
    save: 'Uložit',
    revert: 'Zrušit změny',
    saved: 'Uloženo',
    save_error: 'Uložení se nezdařilo: {e}',
    unsaved: 'Neuložené změny',
    empty_admin: 'Zatím žádné kamery: vyberte je na kartě Nastavení.',
    empty_user: 'Zatím žádné kamery: správce je vybírá na kartě Nastavení.',
    choose: 'Vybrat kamery',
    load_error: 'Kamery se nepodařilo načíst: {e}',
    retry: 'Zkusit znovu',
    import: 'Kopírovat z dashboardu',
    import_none: 'Na dashboardech nebyla nalezena karta kamer.',
    imported: 'Kamery zkopírovány z „{d}“: uložte je, aby zůstaly.',
    integration: 'Otevřít integraci',
    found_heading: 'Nalezené kamery',
    found_hint: 'Kamery z Home Assistant, které panel zatím nezobrazuje.',
    found_none: 'Všechny nalezené kamery už jsou v panelu.',
    add: 'Přidat',
    add_all: 'Přidat vše',
    added: 'Přidané kamery: {n}. Uložte je, aby zůstaly.',
    card_error: 'Kartu kamer se nepodařilo načíst: vymažte mezipaměť prohlížeče a obnovte stránku.',
  },
  sl: {
    cameras: 'Kamere',
    settings: 'Nastavitve',
    sidebar_title: 'Naslov v stranski vrstici',
    sidebar_title_helper: 'Prazno: »{d}«, v jeziku strežnika',
    cameras_heading: 'Prikazane kamere',
    save: 'Shrani',
    revert: 'Prekliči spremembe',
    saved: 'Shranjeno',
    save_error: 'Shranjevanje ni uspelo: {e}',
    unsaved: 'Neshranjene spremembe',
    empty_admin: 'Še ni kamer: izberite jih na zavihku Nastavitve.',
    empty_user: 'Še ni kamer: skrbnik jih izbere na zavihku Nastavitve.',
    choose: 'Izberi kamere',
    load_error: 'Kamer ni bilo mogoče naložiti: {e}',
    retry: 'Poskusi znova',
    import: 'Kopiraj z nadzorne plošče',
    import_none: 'Na nadzornih ploščah ni kartice kamer.',
    imported: 'Kamere kopirane iz »{d}«: shranite, da jih obdržite.',
    integration: 'Odpri integracijo',
    found_heading: 'Najdene kamere',
    found_hint: 'Kamere iz Home Assistanta, ki jih plošča še ne prikazuje.',
    found_none: 'Vse najdene kamere so že na plošči.',
    add: 'Dodaj',
    add_all: 'Dodaj vse',
    added: 'Dodane kamere: {n}. Shranite, da jih obdržite.',
    card_error: 'Kartice kamer ni bilo mogoče naložiti: počistite predpomnilnik brskalnika in znova naložite stran.',
  },
  lv: {
    cameras: 'Kameras',
    settings: 'Iestatījumi',
    sidebar_title: 'Virsraksts sānjoslā',
    sidebar_title_helper: 'Tukšs: “{d}”, servera valodā',
    cameras_heading: 'Rādītās kameras',
    save: 'Saglabāt',
    revert: 'Atcelt izmaiņas',
    saved: 'Saglabāts',
    save_error: 'Neizdevās saglabāt: {e}',
    unsaved: 'Nesaglabātas izmaiņas',
    empty_admin: 'Vēl nav kameru: izvēlieties tās cilnē Iestatījumi.',
    empty_user: 'Vēl nav kameru: administrators tās izvēlas cilnē Iestatījumi.',
    choose: 'Izvēlēties kameras',
    load_error: 'Neizdevās ielādēt kameras: {e}',
    retry: 'Mēģināt vēlreiz',
    import: 'Kopēt no informācijas paneļa',
    import_none: 'Informācijas paneļos nav atrasta kameru kartīte.',
    imported: 'Kameras nokopētas no “{d}”: saglabājiet, lai tās paturētu.',
    integration: 'Atvērt integrāciju',
    found_heading: 'Atrastās kameras',
    found_hint: 'Home Assistant kameras, kuras panelis vēl nerāda.',
    found_none: 'Visas atrastās kameras jau ir panelī.',
    add: 'Pievienot',
    add_all: 'Pievienot visas',
    added: 'Pievienotas kameras: {n}. Saglabājiet, lai tās paturētu.',
    card_error: 'Neizdevās ielādēt kameru kartīti: notīriet pārlūka kešatmiņu un pārlādējiet lapu.',
  },
  el: {
    cameras: 'Κάμερες',
    settings: 'Ρυθμίσεις',
    sidebar_title: 'Τίτλος στην πλαϊνή μπάρα',
    sidebar_title_helper: 'Κενό: «{d}», στη γλώσσα του διακομιστή',
    cameras_heading: 'Κάμερες που εμφανίζονται',
    save: 'Αποθήκευση',
    revert: 'Ακύρωση αλλαγών',
    saved: 'Αποθηκεύτηκε',
    save_error: 'Αδυναμία αποθήκευσης: {e}',
    unsaved: 'Μη αποθηκευμένες αλλαγές',
    empty_admin: 'Δεν υπάρχουν ακόμη κάμερες: επιλέξτε τις στην καρτέλα Ρυθμίσεις.',
    empty_user: 'Δεν υπάρχουν ακόμη κάμερες: ένας διαχειριστής τις επιλέγει στην καρτέλα Ρυθμίσεις.',
    choose: 'Επιλογή καμερών',
    load_error: 'Αδυναμία φόρτωσης των καμερών: {e}',
    retry: 'Επανάληψη',
    import: 'Αντιγραφή από πίνακα ελέγχου',
    import_none: 'Δεν βρέθηκε κάρτα καμερών στους πίνακες ελέγχου.',
    imported: 'Οι κάμερες αντιγράφηκαν από «{d}»: αποθηκεύστε για να τις κρατήσετε.',
    integration: 'Άνοιγμα ενσωμάτωσης',
    found_heading: 'Κάμερες που βρέθηκαν',
    found_hint: 'Κάμερες του Home Assistant που ο πίνακας δεν εμφανίζει ακόμη.',
    found_none: 'Όλες οι κάμερες που βρέθηκαν είναι ήδη στον πίνακα.',
    add: 'Προσθήκη',
    add_all: 'Προσθήκη όλων',
    added: 'Κάμερες που προστέθηκαν: {n}. Αποθηκεύστε για να τις κρατήσετε.',
    card_error: 'Η κάρτα καμερών δεν φορτώθηκε: καθαρίστε την κρυφή μνήμη του προγράμματος περιήγησης και φορτώστε ξανά τη σελίδα.',
  },
};

var HCP_TABS = ['cameras', 'settings'];
var HCP_CARD = 'home-camera-card';

// Text into HTML: the five special characters as numeric references
function hcpEsc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function hcpT(lang, key, vars) {
  var text = (HomeCameraPanelI18n[lang] || HomeCameraPanelI18n.en)[key] || HomeCameraPanelI18n.en[key] || key;
  for (var name of Object.keys(vars || {})) text = text.replace(`{${name}}`, vars[name]);
  return text;
}

// The first camera card (the full one, not the mini) of a dashboard configuration: views, sections, stacks.
function hcpFindCard(node) {
  if (!node || typeof node !== 'object') return null;
  if (Array.isArray(node)) {
    for (var item of node) {
      var found = hcpFindCard(item);
      if (found) return found;
    }
    return null;
  }
  if (node.type === `custom:${HCP_CARD}` && Array.isArray(node.cameras)) return node;
  for (var key of ['views', 'sections', 'cards', 'card']) {
    var inner = hcpFindCard(node[key]);
    if (inner) return inner;
  }
  return null;
}

// A found camera as a camera entry of the card, with the controls found on its device (privacy switch, pan and tilt
// buttons, motion sensors), so they show in the editor; the same entry as the server's discovery.card_entry
function hcpFoundEntry(cam) {
  var entry = { camera: cam.camera, name: cam.name };
  if (cam.privacy) entry.privacy = cam.privacy;
  if (cam.ptz) entry.ptz = cam.ptz;
  if (cam.motion?.length) entry.motion = cam.motion.length === 1 ? cam.motion[0] : cam.motion;
  return entry;
}

// The card configuration the panel stores: no type, no layout options of the dashboard it came from.
function hcpCardConfig(card) {
  var out = Object.assign({}, card);
  // `layout` too: the panel always shows the wall, whatever the stored configuration says
  for (var key of ['type', 'layout', 'grid_options', 'view_layout', 'layout_options', 'visibility']) delete out[key];
  return out;
}

class HomeCameraPanel extends HTMLElement {
  static VERSION = HOME_CAMERA_PANEL_VERSION;

  static STYLE = `
    :host { display:block; min-height:100%; background:var(--primary-background-color); color:var(--primary-text-color); }
    .toolbar { height:var(--header-height, 56px); display:flex; align-items:center; gap:8px; padding:0 12px; box-sizing:border-box;
               background:var(--app-header-background-color, var(--primary-color)); color:var(--app-header-text-color, #fff);
               border-bottom:var(--app-header-border-bottom, none); font-size:20px; position:sticky; top:0; z-index:2; }
    .toolbar .grow { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .toolbar a { color:inherit; display:flex; padding:8px; border-radius:50%; --mdc-icon-size:22px; }
    .toolbar a:hover { background:rgba(255,255,255,.12); }
    /* Tabs under the toolbar, as in Smart Comfort: text, the active one underlined, sticky with the toolbar */
    .tabs { display:flex; gap:4px; padding:0 12px; overflow-x:auto; background:var(--app-header-background-color, var(--primary-color));
            position:sticky; top:var(--header-height, 56px); z-index:2; }
    .tabs[hidden] { display:none; }
    .tab { background:none; border:none; border-bottom:2px solid transparent; color:var(--app-header-text-color, #fff); opacity:.75;
           padding:12px 14px; font:inherit; font-size:14px; cursor:pointer; white-space:nowrap; }
    .tab:hover, .tab:focus-visible { opacity:1; outline:none; }
    .tab.active { opacity:1; border-bottom-color:var(--app-header-text-color, #fff); }
    main { margin:0 auto; padding:16px; box-sizing:border-box; }
    /* The cameras as a video wall, edge to edge; the settings at reading width */
    main.cameras { padding:8px 12px 12px; }
    main.settings { max-width:900px; }
    section[hidden] { display:none; }
    .column { display:flex; flex-direction:column; gap:12px; min-width:0; }
    .note { padding:16px; color:var(--secondary-text-color); display:flex; flex-direction:column; gap:10px; align-items:flex-start; }
    .note.error { color:var(--primary-text-color); border-left:3px solid var(--error-color, #db4437); }
    .block { padding:14px 16px; display:flex; flex-direction:column; gap:12px; }
    .block h2 { margin:0; font-size:16px; font-weight:500; }
    .ctl { display:flex; flex-direction:column; gap:4px; min-width:0; }
    .ctl > span { font-size:12px; color:var(--secondary-text-color); }
    .ctl small { font-size:11px; color:var(--secondary-text-color); opacity:.85; }
    .box { display:flex; align-items:center; border-radius:8px; border:1px solid var(--divider-color, rgba(127,127,127,.3));
           background:var(--secondary-background-color, rgba(127,127,127,.08)); }
    .box:focus-within { border-color:var(--primary-color); }
    .box input { flex:1; min-width:0; border:0; outline:0; background:none; color:inherit; font:inherit; font-size:14px; padding:8px 10px; }
    .bar { display:flex; align-items:center; flex-wrap:wrap; gap:8px; }
    .bar .grow { flex:1; }
    .msg { font-size:12px; color:var(--secondary-text-color); overflow-wrap:anywhere; }
    .msg.good { color:color-mix(in srgb, var(--success-color, #43a047) 50%, var(--primary-text-color)); }
    .msg.bad { color:color-mix(in srgb, var(--error-color, #db4437) 50%, var(--primary-text-color)); }
    /* Tinted buttons, never filled (the convention of the ha-* cards) */
    .act { display:inline-flex; align-items:center; gap:6px; border:0; cursor:pointer; font:inherit; font-size:13px; font-weight:500;
           padding:7px 12px; border-radius:8px; --mdc-icon-size:16px; color:var(--primary-color); text-decoration:none;
           background:color-mix(in srgb, var(--primary-color) 14%, transparent); }
    .act:hover:not([disabled]) { background:color-mix(in srgb, var(--primary-color) 22%, transparent); }
    .act.quiet { color:var(--primary-text-color); background:var(--secondary-background-color, rgba(127,127,127,.12)); }
    .act[disabled] { opacity:.5; cursor:default; }
    ha-card { display:block; }
    ha-card[hidden] { display:none; }
    .bar.head h2 { margin:0; }
    .found { display:flex; align-items:center; gap:12px; padding:6px 0; border-top:1px solid var(--divider-color, rgba(127,127,127,.2)); }
    .found > ha-icon { color:var(--primary-color); --mdc-icon-size:22px; flex:none; }
    .found .who { flex:1; min-width:0; }
    .found .n { font-size:14px; font-weight:500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .found .s { font-size:12px; color:var(--secondary-text-color); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  `;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._tab = 'cameras';
    this._data = null; // the settings pushed by home_camera/subscribe
    this._draft = null; // the Settings tab's edits: { card, title }
    this._shownCard = null; // the card configuration the Cameras tab shows, as JSON
    this._status = null; // { tone, text } under the Settings tab's buttons
  }

  // /cameras/settings opens Settings (administrators); the base address is Cameras
  set route(route) {
    // Kept: before hass (who the user is), Settings cannot be told apart from a tab the user may not open
    this._wanted = (route?.path || '').split('/').filter(Boolean)[0];
    var tab = this._tabs().includes(this._wanted) ? this._wanted : 'cameras';
    if (tab !== this._tab) this._showTab(tab);
  }

  set narrow(narrow) {
    this._narrow = narrow;
    if (this._menu) this._menu.narrow = narrow;
  }

  set panel(panel) {
    this._panel = panel;
  }

  set hass(hass) {
    var first = !this._hass;
    var langBefore = this._lang();
    var adminBefore = this._admin();
    this._hass = hass;
    if (this._menu) this._menu.hass = hass;
    if (this._card) this._card.hass = hass;
    if (this._editor) this._editor.hass = hass;
    if (first) this._start();
    else if (this._lang() !== langBefore || this._admin() !== adminBefore) this._render();
  }

  // Home Assistant may set panel, narrow, route and hass before the element is defined: they land as plain
  // properties hiding the setters, so they are passed through them (hass last: it starts the panel).
  _upgradeProperties() {
    ['panel', 'narrow', 'route', 'hass'].forEach((name) => {
      if (!Object.hasOwn(this, name)) return;
      var value = this[name];
      delete this[name];
      this[name] = value;
    });
  }

  connectedCallback() {
    this._upgradeProperties();
    if (this._hass && !this._unsub) this._subscribe();
  }

  disconnectedCallback() {
    if (this._unsub) {
      this._unsub.then((off) => off()).catch(() => {});
      this._unsub = null;
    }
  }

  _admin() {
    return !!this._hass?.user?.is_admin;
  }

  // Settings is the administrators' only
  _tabs() {
    return this._admin() ? HCP_TABS : ['cameras'];
  }

  // Full code when it has a table (sr-Latn), else its base (de-AT → de), else English
  _lang() {
    var code = this._hass?.language || 'en';
    if (HomeCameraPanelI18n[code]) return code;
    var base = code.split('-')[0];
    return HomeCameraPanelI18n[base] ? base : 'en';
  }

  _t(key, vars) {
    return hcpT(this._lang(), key, vars);
  }

  _start() {
    this._render();
    this._loadCard();
    this._subscribe();
  }

  // The card is a dashboard resource, loaded on dashboards only: the panel loads it itself (same file, cached).
  async _loadCard() {
    if (customElements.get(HCP_CARD)) return;
    var url = this._panel?.config?.card_url || '/home_camera/home-camera-card.js';
    try {
      await import(url);
      await customElements.whenDefined(HCP_CARD);
    } catch (err) {
      console.error('Home Camera panel: could not load the card', err);
      this._cardError = true;
    }
    this._renderCameras();
  }

  // The settings at once, then on every change (saved here or on another device). The connection resubscribes
  // by itself after a reconnection.
  _subscribe() {
    if (this._unsub || !this._hass?.connection) return;
    this._unsub = this._hass.connection
      .subscribeMessage((data) => this._onSettings(data), { type: 'home_camera/subscribe' })
      .catch((err) => {
        this._unsub = null;
        this._loadError = String(err?.message || err).replace(/\.\s*$/, '');
        this._renderCameras();
        return () => {};
      });
  }

  _onSettings(data) {
    var dirty = this._dirty();
    this._data = data;
    this._loadError = null;
    // Unsaved edits are kept; otherwise the form follows what was saved (here or elsewhere)
    if (!dirty) this._draft = null;
    this._renderCameras();
    this._renderSettings();
  }

  _dirty() {
    if (!this._draft || !this._data) return false;
    return JSON.stringify(this._draft.card) !== JSON.stringify(this._data.card) || this._draft.title !== this._data.title;
  }

  _goTab(tab, focus) {
    if (!this._tabs().includes(tab)) return;
    this._wanted = tab;
    this._showTab(tab, focus);
    var base = (this._panel?.url_path || 'cameras').replace(/^\//, '');
    try {
      history.replaceState(history.state, '', `/${base}${tab === 'cameras' ? '' : `/${tab}`}`);
    } catch (_err) {
      // no history (a test, a sandboxed page): the tab still shows
    }
  }

  _showTab(tab, focus) {
    this._tab = tab;
    var root = this.shadowRoot;
    root.querySelectorAll?.('.tab').forEach((button) => {
      var selected = button.dataset.tab === tab;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected && focus) button.focus({ preventScroll: true });
    });
    HCP_TABS.forEach((name) => {
      var section = root.getElementById?.(`tab-${name}`);
      if (section) section.hidden = name !== tab;
    });
    var main = root.querySelector?.('main');
    if (main) main.className = tab;
    if (tab === 'settings') this._renderSettings();
  }

  _render() {
    var root = this.shadowRoot;
    var esc = hcpEsc;
    var tabs = this._tabs();
    if (tabs.includes(this._wanted)) this._tab = this._wanted;
    if (!tabs.includes(this._tab)) this._tab = 'cameras';
    var title = this._data?.sidebar_title || this._panel?.title || this._t('cameras');
    root.innerHTML = `
      <style>${HomeCameraPanel.STYLE}</style>
      <div class="toolbar">
        <ha-menu-button></ha-menu-button>
        <span class="grow">${esc(title)}</span>
        ${this._admin() ? `<a href="/config/integrations/integration/home_camera" title="${esc(this._t('integration'))}"><ha-icon icon="mdi:cog"></ha-icon></a>` : ''}
      </div>
      <div class="tabs" role="tablist"${tabs.length < 2 ? ' hidden' : ''}>${tabs.map((tab) => this._tabHtml(tab)).join('')}</div>
      <main class="${this._tab}">
        <section class="column" id="tab-cameras" role="tabpanel" aria-labelledby="tabbtn-cameras"></section>
        <section class="column" id="tab-settings" role="tabpanel" aria-labelledby="tabbtn-settings"></section>
      </main>`;
    this._menu = root.querySelector('ha-menu-button');
    this._menu.hass = this._hass;
    this._menu.narrow = this._narrow;
    root.querySelectorAll('.tab').forEach((button) => {
      button.addEventListener('click', () => this._goTab(button.dataset.tab));
      // Left and right arrows move between the tabs, as in a native tab bar
      button.addEventListener('keydown', (ev) => {
        var step = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0;
        if (!step) return;
        ev.preventDefault();
        var i = tabs.indexOf(this._tab);
        this._goTab(tabs[(i + step + tabs.length) % tabs.length], true);
      });
    });
    // A new shadow DOM: the card and the editor are drawn again
    this._card = null;
    this._shownCard = null;
    this._editor = null;
    this._showTab(this._tab);
    this._renderCameras();
  }

  _tabHtml(tab) {
    var selected = tab === this._tab;
    return `<button class="tab${selected ? ' active' : ''}" role="tab" id="tabbtn-${tab}" data-tab="${tab}" aria-selected="${selected}" aria-controls="tab-${tab}" tabindex="${selected ? 0 : -1}">${hcpEsc(this._t(tab))}</button>`;
  }

  // ── Cameras tab ────────────────────────────────────────────────────────────
  _renderCameras() {
    var section = this.shadowRoot.getElementById?.('tab-cameras');
    if (!section) return;
    var toolbarTitle = this.shadowRoot.querySelector('.toolbar .grow');
    if (toolbarTitle && this._data?.sidebar_title) toolbarTitle.textContent = this._data.sidebar_title;
    var note = (html, error) => {
      this._card = null;
      this._shownCard = null;
      section.innerHTML = `<ha-card><div class="note${error ? ' error' : ''}">${html}</div></ha-card>`;
    };
    if (this._loadError && !this._data) {
      note(`<span>${hcpEsc(this._t('load_error', { e: this._loadError }))}</span><button class="act quiet" data-retry>${hcpEsc(this._t('retry'))}</button>`, true);
      section.querySelector('[data-retry]').addEventListener('click', () => {
        this._loadError = null;
        this._subscribe();
      });
      return;
    }
    if (this._cardError) {
      note(`<span>${hcpEsc(this._t('card_error'))}</span>`, true);
      return;
    }
    if (!this._data || !customElements.get(HCP_CARD)) {
      if (!section.querySelector('ha-circular-progress')) {
        section.innerHTML = '<div class="note"><ha-circular-progress indeterminate size="small"></ha-circular-progress></div>';
      }
      this._card = null;
      this._shownCard = null;
      return;
    }
    var card = this._data.card || {};
    if (!(card.cameras || []).length) {
      if (this._admin()) {
        note(`<span>${hcpEsc(this._t('empty_admin'))}</span><button class="act" data-choose><ha-icon icon="mdi:cctv"></ha-icon>${hcpEsc(this._t('choose'))}</button>`);
        section.querySelector('[data-choose]').addEventListener('click', () => this._goTab('settings'));
      } else note(`<span>${hcpEsc(this._t('empty_user'))}</span>`);
      return;
    }
    // Drawn again only when the configuration changed: a new card would reconnect every stream
    var json = JSON.stringify(card);
    if (this._card && json === this._shownCard) return;
    if (!this._card) {
      section.replaceChildren();
      this._card = document.createElement(HCP_CARD);
    }
    try {
      // Always the video wall here: no card around the cameras (the configuration keeps its own layout for dashboards)
      this._card.setConfig(Object.assign({ type: `custom:${HCP_CARD}` }, card, { layout: 'wall' }));
    } catch (err) {
      note(`<span>${hcpEsc(String(err?.message || err))}</span>`, true);
      return;
    }
    this._shownCard = json;
    this._card.hass = this._hass;
    if (!this._card.isConnected) section.appendChild(this._card);
  }

  // ── Settings tab (administrators) ──────────────────────────────────────────
  _formValues() {
    if (!this._draft && this._data) {
      this._draft = { card: JSON.parse(JSON.stringify(this._data.card || {})), title: this._data.title || '' };
    }
    return this._draft;
  }

  async _renderSettings() {
    var section = this.shadowRoot.getElementById?.('tab-settings');
    if (!section || !this._admin() || this._tab !== 'settings' || !this._data) return;
    var values = this._formValues();
    var esc = hcpEsc;
    if (!section.querySelector('.settings-form')) {
      section.innerHTML = `
        <ha-card class="settings-form"><div class="block">
          <label class="ctl"><span>${esc(this._t('sidebar_title'))}</span>
            <div class="box"><input data-title maxlength="50" autocomplete="off"></div>
            <small data-title-helper></small></label>
        </div></ha-card>
        <ha-card data-found hidden></ha-card>
        <ha-card><div class="block">
          <h2>${esc(this._t('cameras_heading'))}</h2>
          <div data-editor></div>
        </div></ha-card>
        <div class="bar">
          <button class="act" data-save><ha-icon icon="mdi:content-save"></ha-icon>${esc(this._t('save'))}</button>
          <button class="act quiet" data-revert>${esc(this._t('revert'))}</button>
          <button class="act quiet" data-import><ha-icon icon="mdi:content-copy"></ha-icon>${esc(this._t('import'))}</button>
          <span class="grow msg" data-msg aria-live="polite"></span>
        </div>`;
      var field = section.querySelector('[data-title]');
      field.addEventListener('input', () => {
        this._formValues().title = field.value;
        this._status = null;
        this._renderStatus();
      });
      section.querySelector('[data-save]').addEventListener('click', () => this._save());
      section.querySelector('[data-revert]').addEventListener('click', () => {
        this._draft = null;
        this._status = null;
        this._renderSettings();
      });
      section.querySelector('[data-import]').addEventListener('click', () => this._import());
      section.querySelector('[data-found]').addEventListener('click', (ev) => {
        var button = ev.composedPath().find((n) => n.dataset?.add !== undefined);
        if (button) this._addFound(button.dataset.add ? [button.dataset.add] : null);
      });
      this._discover();
    }
    var input = section.querySelector('[data-title]');
    if (input.value !== values.title && this.shadowRoot.activeElement !== input) input.value = values.title;
    section.querySelector('[data-title-helper]').textContent = this._t('sidebar_title_helper', { d: this._defaultTitle() });
    this._renderFound();
    await this._renderEditor(section.querySelector('[data-editor]'), values.card);
    this._renderStatus();
  }

  // ── Camera discovery (home_camera/discover): the cameras of Home Assistant the panel does not show yet ──
  async _discover() {
    try {
      this._found = (await this._hass.callWS({ type: 'home_camera/discover' })).cameras || [];
    } catch (err) {
      console.warn('Home Camera panel: camera discovery failed', err);
      this._found = [];
    }
    this._renderFound();
  }

  // Found cameras missing from the edited list: neither the camera nor its SD stream is in it
  _newFound() {
    var listed = new Set();
    for (var cam of this._formValues()?.card?.cameras || []) {
      var id = typeof cam === 'string' ? cam : cam?.camera;
      if (id) listed.add(id);
      if (cam?.sd) listed.add(cam.sd);
    }
    return (this._found || []).filter((cam) => !listed.has(cam.camera) && !(cam.sd && listed.has(cam.sd)));
  }

  _renderFound() {
    var host = this.shadowRoot.getElementById?.('tab-settings')?.querySelector('[data-found]');
    if (!host || !this._found) return;
    var esc = hcpEsc;
    var found = this._newFound();
    host.hidden = false;
    var rows = found
      .map(
        (cam) => `<div class="found">
          <ha-icon icon="mdi:cctv"></ha-icon>
          <div class="who"><div class="n">${esc(cam.name)}</div><div class="s">${esc([cam.area, cam.camera, cam.sd ? 'HD + SD' : ''].filter(Boolean).join(' · '))}</div></div>
          <button class="act quiet" data-add="${esc(cam.camera)}"><ha-icon icon="mdi:plus"></ha-icon>${esc(this._t('add'))}</button>
        </div>`,
      )
      .join('');
    host.innerHTML = `<div class="block">
      <div class="bar head"><h2 class="grow">${esc(this._t('found_heading'))}</h2>${
        found.length > 1 ? `<button class="act" data-add=""><ha-icon icon="mdi:plus-box-multiple"></ha-icon>${esc(this._t('add_all'))}</button>` : ''
      }</div>
      <div class="msg">${esc(this._t(found.length ? 'found_hint' : 'found_none'))}</div>
      ${rows}
    </div>`;
  }

  // Adds the given found cameras (all the new ones when `ids` is null) to the edited list, named after their device,
  // with their controls
  _addFound(ids) {
    var add = this._newFound().filter((cam) => !ids || ids.includes(cam.camera));
    if (!add.length) return;
    var values = this._formValues();
    values.card = Object.assign({}, values.card, {
      cameras: (values.card.cameras || []).concat(add.map(hcpFoundEntry)),
    });
    this._status = { tone: 'good', text: this._t('added', { n: add.length }) };
    this._renderSettings();
  }

  // The title the server gives the panel when none is set ("Cameras" in the server's language)
  _defaultTitle() {
    return this._data?.default_title || this._t('cameras');
  }

  // The card's own visual editor (cameras, HD / SD, columns…), built on Home Assistant's ha-form
  async _renderEditor(host, card) {
    if (!host) return;
    await this._ensureForm();
    if (!customElements.get('home-camera-card-editor')) return;
    if (!this._editor?.isConnected) {
      this._editor = document.createElement('home-camera-card-editor');
      // Always the wall here: no layout choice
      this._editor.panel = true;
      this._editor.addEventListener('config-changed', (ev) => {
        ev.stopPropagation();
        this._formValues().card = hcpCardConfig(ev.detail.config);
        this._editorConfig = JSON.stringify(this._formValues().card);
        this._status = null;
        this._renderStatus();
      });
      host.replaceChildren(this._editor);
      this._editorConfig = null;
    }
    this._editor.hass = this._hass;
    // Given again only when it changed from outside (saved elsewhere, reverted, copied): never under the typing
    var json = JSON.stringify(card);
    if (json !== this._editorConfig) {
      this._editorConfig = json;
      // As the wall: the editor offers no column count by default and keeps any count chosen
      this._editor.setConfig(Object.assign({ type: `custom:${HCP_CARD}` }, card, { layout: 'wall' }));
    }
  }

  // ha-form is loaded with the dashboard editor, not on a custom panel: a card editor of Home Assistant brings it
  async _ensureForm() {
    if (customElements.get('ha-form')) return;
    try {
      var helpers = await window.loadCardHelpers?.();
      var card = await helpers?.createCardElement({ type: 'entities', entities: [] });
      await card?.constructor?.getConfigElement?.();
      await Promise.race([customElements.whenDefined('ha-form'), new Promise((r) => setTimeout(r, 3000))]);
    } catch (err) {
      console.warn('Home Camera panel: could not load the form elements', err);
    }
  }

  _renderStatus() {
    var section = this.shadowRoot.getElementById?.('tab-settings');
    var msg = section?.querySelector('[data-msg]');
    if (!msg) return;
    var dirty = this._dirty();
    var status = this._status || (dirty ? { tone: '', text: this._t('unsaved') } : null);
    msg.className = `grow msg${status?.tone ? ` ${status.tone}` : ''}`;
    msg.textContent = status?.text || '';
    section.querySelector('[data-save]').disabled = !dirty || this._saving;
    section.querySelector('[data-revert]').disabled = !dirty || this._saving;
  }

  async _save() {
    var values = this._formValues();
    this._saving = true;
    this._renderStatus();
    try {
      var data = await this._hass.callWS({ type: 'home_camera/update_settings', card: values.card, title: values.title.trim() });
      this._draft = null;
      this._status = { tone: 'good', text: this._t('saved') };
      this._onSettings(data);
    } catch (err) {
      this._status = { tone: 'bad', text: this._t('save_error', { e: String(err?.message || err) }) };
    }
    this._saving = false;
    this._renderStatus();
  }

  // The first camera card found on the dashboards (the default one first), as a starting point
  async _import() {
    var found = null;
    try {
      var dashboards = await this._hass.callWS({ type: 'lovelace/dashboards/list' });
      var targets = [{ url_path: null, title: 'Overview' }].concat(
        (dashboards || []).filter((d) => d.mode !== 'yaml' || d.url_path).map((d) => ({ url_path: d.url_path, title: d.title || d.url_path })),
      );
      for (var target of targets) {
        var config = await this._hass.callWS({ type: 'lovelace/config', url_path: target.url_path }).catch(() => null);
        var card = hcpFindCard(config);
        if (card) {
          found = { card: hcpCardConfig(card), title: target.title };
          break;
        }
      }
    } catch (err) {
      console.warn('Home Camera panel: could not read the dashboards', err);
    }
    if (!found) {
      this._status = { tone: 'bad', text: this._t('import_none') };
      this._renderStatus();
      return;
    }
    this._formValues().card = found.card;
    this._status = { tone: 'good', text: this._t('imported', { d: found.title }) };
    this._renderSettings();
  }
}

if (!customElements.get('home-camera-panel')) {
  customElements.define('home-camera-panel', HomeCameraPanel);
}
