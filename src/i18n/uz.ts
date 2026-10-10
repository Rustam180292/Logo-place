/** O'zbekcha matnlar. Kalitlar `ru.ts` bilan bir xil bo'lishi shart. */
export const uz = {
  // Umumiy
  appName: 'Logoped Topish',
  appTagline: 'Yaqin atrofdagi logopedik markazlar',
  loading: 'Yuklanmoqda…',
  retry: 'Qayta urinish',
  cancel: 'Bekor qilish',
  close: 'Yopish',
  save: 'Saqlash',
  send: 'Yuborish',
  all: 'Hammasi',
  clear: 'Tozalash',
  apply: 'Qo‘llash',
  km: 'km',
  soum: 'so‘m',
  error: 'Xatolik yuz berdi',
  errorHint: 'Internet aloqasini tekshirib, qayta urinib ko‘ring.',

  // Tablar
  tabMap: 'Harita',
  tabList: 'Ro‘yxat',
  tabSaved: 'Saqlangan',
  tabSettings: 'Sozlamalar',

  // Harita
  mapTitle: 'Harita',
  mapMyLocation: 'Mening joylashuvim',
  mapNoKeyTitle: 'Harita kaliti sozlanmagan',
  mapNoKeyBody:
    'Haritani ko‘rish uchun Yandex Maps API kalitini .env faylidagi EXPO_PUBLIC_YANDEX_MAPS_API_KEY ga qo‘shing. Shu paytgacha markazlarni "Ro‘yxat" bo‘limida ko‘rishingiz mumkin.',
  mapOpenList: 'Ro‘yxatni ochish',
  mapCentersFound: 'markaz topildi',

  // Joylashuv
  locationAsk: 'Yaqin markazlarni ko‘rsatish uchun joylashuvga ruxsat bering',
  locationAskButton: 'Ruxsat berish',
  locationDenied: 'Joylashuvga ruxsat berilmagan',
  locationDeniedBody:
    'Masofani hisoblash uchun joylashuv kerak. Ruxsatni telefon sozlamalaridan yoqishingiz mumkin.',
  locationDefaultCity: 'Toshkent markazi ko‘rsatilmoqda',

  // Ro'yxat va qidiruv
  searchPlaceholder: 'Markaz nomi yoki tuman…',
  listNearby: 'Yaqin atrofdagi markazlar',
  listPromoted: 'Reklama',
  listPromotedHint: 'To‘lov asosida joylashtirilgan',
  listEmptyTitle: 'Markaz topilmadi',
  listEmptyBody: 'Filtrlarni o‘zgartirib yoki qidiruvni tozalab ko‘ring.',
  listResults: 'natija',

  // Filtrlar
  filters: 'Filtrlar',
  filterService: 'Xizmat turi',
  filterAge: 'Bolaning yoshi',
  filterDistrict: 'Tuman',
  filterPrice: 'Eng ko‘p narx (bir mashg‘ulot)',
  filterOnlyVerified: 'Faqat tekshirilgan markazlar',
  filterOnlyOpen: 'Faqat hozir ishlayotganlar',
  filterSort: 'Tartiblash',
  sortDistance: 'Masofa bo‘yicha',
  sortRating: 'Reyting bo‘yicha',
  sortPrice: 'Narx bo‘yicha (arzondan)',

  // Markaz kartochkasi va sahifasi
  verified: 'Tekshirilgan',
  premium: 'Premium',
  reviews: 'sharh',
  noRating: 'Reyting yo‘q',
  priceFrom: 'dan',
  priceUnknown: 'Narx ko‘rsatilmagan',
  openNow: 'Hozir ishlaydi',
  closedNow: 'Hozir yopiq',
  dayOff: 'Dam olish kuni',
  call: 'Qo‘ng‘iroq',
  route: 'Yo‘nalish',
  share: 'Ulashish',
  saveToFavorites: 'Saqlash',
  savedToFavorites: 'Saqlangan',
  aboutCenter: 'Markaz haqida',
  services: 'Xizmatlar',
  ageGroups: 'Yosh guruhlari',
  workingHours: 'Ish vaqti',
  contacts: 'Aloqa',
  priceSection: 'Narx',
  addressSection: 'Manzil',
  openInTelegram: 'Telegram',
  openInInstagram: 'Instagram',
  openWebsite: 'Veb-sayt',
  centerNotFound: 'Markaz topilmadi',

  // Saqlangan
  savedTitle: 'Saqlangan markazlar',
  savedEmptyTitle: 'Hali hech narsa saqlanmagan',
  savedEmptyBody: 'Markaz sahifasidagi yurakcha tugmasi orqali saqlab qo‘yishingiz mumkin.',
  removeFromSaved: 'Saqlanganlardan olib tashlash',

  // Sozlamalar
  settingsTitle: 'Sozlamalar',
  settingsLanguage: 'Til',
  settingsLangUz: 'O‘zbekcha',
  settingsLangRu: 'Ruscha',
  settingsData: 'Ma’lumot manbasi',
  settingsDataLive: 'Supabase (onlayn)',
  settingsDataDemo: 'Demo ma’lumot (kalit sozlanmagan)',
  settingsForOwners: 'Markaz egalariga',
  settingsAddCenter: 'Markazingizni qo‘shish',
  settingsAbout: 'Ilova haqida',
  settingsVersion: 'Versiya',

  // Markaz qo'shish arizasi
  leadTitle: 'Markazingizni qo‘shish',
  leadIntro:
    'Logopedik markaz egasi bo‘lsangiz, arizani qoldiring — ilovada joylashtirish va reklama shartlari bo‘yicha siz bilan bog‘lanamiz.',
  leadCenterName: 'Markaz nomi',
  leadContactName: 'Mas‘ul shaxs',
  leadPhone: 'Telefon raqam',
  leadCity: 'Shahar',
  leadNote: 'Qo‘shimcha izoh',
  leadSubmit: 'Arizani yuborish',
  leadSuccessTitle: 'Ariza yuborildi',
  leadSuccessBody: 'Tez orada siz bilan bog‘lanamiz. Rahmat!',
  leadRequired: 'Majburiy maydonlarni to‘ldiring',

  // Xizmat nomlari
  'service.speech_delay': 'Nutq rivojlanishi kechikishi (ZRR)',
  'service.dyslalia': 'Tovush talaffuzi (dislaliya)',
  'service.dysarthria': 'Dizartriya',
  'service.alalia': 'Alaliya',
  'service.stuttering': 'Duduqlanish',
  'service.dyslexia': 'Disleksiya va disgrafiya',
  'service.rhinolalia': 'Rinolaliya',
  'service.autism': 'Autizm spektri',
  'service.logomassage': 'Logopedik massaj',
  'service.defectologist': 'Defektolog',
  'service.psychologist': 'Psixolog',
  'service.group_lessons': 'Guruhli mashg‘ulot',
  'service.home_visit': 'Uyga chiqish',
  'service.online': 'Onlayn mashg‘ulot',

  // Yosh guruhlari
  'age.0_3': '0–3 yosh',
  'age.3_5': '3–5 yosh',
  'age.5_7': '5–7 yosh',
  'age.7_12': '7–12 yosh',
  'age.12_plus': '12+ yosh',

  // Hafta kunlari
  'day.mon': 'Dushanba',
  'day.tue': 'Seshanba',
  'day.wed': 'Chorshanba',
  'day.thu': 'Payshanba',
  'day.fri': 'Juma',
  'day.sat': 'Shanba',
  'day.sun': 'Yakshanba',
} as const;

export type TranslationKey = keyof typeof uz;
