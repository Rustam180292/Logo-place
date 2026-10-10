import type { TranslationKey } from './uz';

/** Русские тексты. Набор ключей должен совпадать с `uz.ts`. */
export const ru: Record<TranslationKey, string> = {
  // Общее
  appName: 'Найти логопеда',
  appTagline: 'Логопедические центры рядом с вами',
  loading: 'Загрузка…',
  retry: 'Повторить',
  cancel: 'Отмена',
  close: 'Закрыть',
  save: 'Сохранить',
  send: 'Отправить',
  all: 'Все',
  clear: 'Сбросить',
  apply: 'Применить',
  km: 'км',
  soum: 'сум',
  error: 'Произошла ошибка',
  errorHint: 'Проверьте подключение к интернету и попробуйте снова.',

  // Табы
  tabMap: 'Карта',
  tabList: 'Список',
  tabSaved: 'Сохранённые',
  tabSettings: 'Настройки',

  // Карта
  mapTitle: 'Карта',
  mapMyLocation: 'Моё местоположение',
  mapNoKeyTitle: 'Ключ карты не настроен',
  mapNoKeyBody:
    'Чтобы увидеть карту, добавьте ключ Yandex Maps API в переменную EXPO_PUBLIC_YANDEX_MAPS_API_KEY в файле .env. А пока центры доступны в разделе «Список».',
  mapOpenList: 'Открыть список',
  mapCentersFound: 'центров найдено',

  // Местоположение
  locationAsk: 'Разрешите доступ к местоположению, чтобы видеть центры рядом',
  locationAskButton: 'Разрешить',
  locationDenied: 'Доступ к местоположению запрещён',
  locationDeniedBody:
    'Местоположение нужно для расчёта расстояния. Разрешение можно включить в настройках телефона.',
  locationDefaultCity: 'Показан центр Ташкента',

  // Список и поиск
  searchPlaceholder: 'Название центра или район…',
  listNearby: 'Центры рядом',
  listPromoted: 'Реклама',
  listPromotedHint: 'Размещено на платной основе',
  listEmptyTitle: 'Центры не найдены',
  listEmptyBody: 'Измените фильтры или очистите поиск.',
  listResults: 'результатов',

  // Фильтры
  filters: 'Фильтры',
  filterService: 'Вид услуги',
  filterAge: 'Возраст ребёнка',
  filterDistrict: 'Район',
  filterPrice: 'Максимальная цена (за занятие)',
  filterOnlyVerified: 'Только проверенные центры',
  filterOnlyOpen: 'Только открытые сейчас',
  filterSort: 'Сортировка',
  sortDistance: 'По расстоянию',
  sortRating: 'По рейтингу',
  sortPrice: 'По цене (сначала дешёвые)',

  // Карточка и страница центра
  verified: 'Проверен',
  premium: 'Премиум',
  reviews: 'отзывов',
  noRating: 'Нет рейтинга',
  priceFrom: 'от',
  priceUnknown: 'Цена не указана',
  openNow: 'Сейчас открыто',
  closedNow: 'Сейчас закрыто',
  dayOff: 'Выходной',
  call: 'Позвонить',
  route: 'Маршрут',
  share: 'Поделиться',
  saveToFavorites: 'Сохранить',
  savedToFavorites: 'Сохранено',
  aboutCenter: 'О центре',
  services: 'Услуги',
  ageGroups: 'Возрастные группы',
  workingHours: 'Часы работы',
  contacts: 'Контакты',
  priceSection: 'Цена',
  addressSection: 'Адрес',
  openInTelegram: 'Telegram',
  openInInstagram: 'Instagram',
  openWebsite: 'Веб-сайт',
  centerNotFound: 'Центр не найден',

  // Сохранённые
  savedTitle: 'Сохранённые центры',
  savedEmptyTitle: 'Пока ничего не сохранено',
  savedEmptyBody: 'Сохранить центр можно кнопкой с сердечком на его странице.',
  removeFromSaved: 'Убрать из сохранённых',

  // Настройки
  settingsTitle: 'Настройки',
  settingsLanguage: 'Язык',
  settingsLangUz: 'Узбекский',
  settingsLangRu: 'Русский',
  settingsData: 'Источник данных',
  settingsDataLive: 'Supabase (онлайн)',
  settingsDataDemo: 'Демо-данные (ключ не настроен)',
  settingsForOwners: 'Владельцам центров',
  settingsAddCenter: 'Добавить свой центр',
  settingsAbout: 'О приложении',
  settingsVersion: 'Версия',

  // Заявка на добавление центра
  leadTitle: 'Добавить свой центр',
  leadIntro:
    'Если вы владелец логопедического центра, оставьте заявку — мы свяжемся с вами по условиям размещения и рекламы в приложении.',
  leadCenterName: 'Название центра',
  leadContactName: 'Контактное лицо',
  leadPhone: 'Номер телефона',
  leadCity: 'Город',
  leadNote: 'Дополнительный комментарий',
  leadSubmit: 'Отправить заявку',
  leadSuccessTitle: 'Заявка отправлена',
  leadSuccessBody: 'Мы свяжемся с вами в ближайшее время. Спасибо!',
  leadRequired: 'Заполните обязательные поля',

  // Названия услуг
  'service.speech_delay': 'Задержка речевого развития (ЗРР)',
  'service.dyslalia': 'Нарушение звукопроизношения (дислалия)',
  'service.dysarthria': 'Дизартрия',
  'service.alalia': 'Алалия',
  'service.stuttering': 'Заикание',
  'service.dyslexia': 'Дислексия и дисграфия',
  'service.rhinolalia': 'Ринолалия',
  'service.autism': 'Расстройства аутистического спектра',
  'service.logomassage': 'Логопедический массаж',
  'service.defectologist': 'Дефектолог',
  'service.psychologist': 'Психолог',
  'service.group_lessons': 'Групповые занятия',
  'service.home_visit': 'Выезд на дом',
  'service.online': 'Онлайн-занятия',

  // Возрастные группы
  'age.0_3': '0–3 года',
  'age.3_5': '3–5 лет',
  'age.5_7': '5–7 лет',
  'age.7_12': '7–12 лет',
  'age.12_plus': '12+ лет',

  // Дни недели
  'day.mon': 'Понедельник',
  'day.tue': 'Вторник',
  'day.wed': 'Среда',
  'day.thu': 'Четверг',
  'day.fri': 'Пятница',
  'day.sat': 'Суббота',
  'day.sun': 'Воскресенье',
};
