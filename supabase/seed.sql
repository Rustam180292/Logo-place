-- =============================================================================
-- Logoped Topish — namuna (DEMO) ma'lumot
--
-- MUHIM: bu yozuvlar O'YLAB TOPILGAN. Markazlar nomi, telefon raqamlari
-- (+998 90 000-00-0X ataylab haqiqiy emas) va reytinglar haqiqiy emas.
-- Ularni interfeysni sinash uchun ishlatib, keyin o'chirib tashlang:
--     delete from public.centers where phone like '+99890000000%';
--
-- Bu fayl `src/data/fallback-centers.ts` dan generatsiya qilingan,
-- shuning uchun ilovaning demo rejimi va baza bir xil ma'lumotni ko'rsatadi.
-- =============================================================================

insert into public.centers (
  name, name_ru,
  description,
  description_ru,
  address, address_ru,
  city, district,
  lat, lng,
  phone, phone_alt,
  telegram, instagram, website,
  services, age_groups,
  price_from, price_note, price_note_ru,
  working_hours,
  rating, reviews_count,
  tier, is_verified, is_active
) values
  (
    'Nutq Bog‘i logopedik markazi', 'Логопедический центр «Нутк Боги»',
    'Maktabgacha yoshdagi bolalar bilan individual va guruhli mashg‘ulotlar. Logopedik massaj va defektolog qabuli mavjud.',
    'Индивидуальные и групповые занятия с детьми дошкольного возраста. Есть логопедический массаж и приём дефектолога.',
    'Chilonzor tumani, Bunyodkor shoh ko‘chasi 12', 'Чиланзарский район, проспект Бунёдкор, 12',
    'Toshkent', 'Chilonzor',
    41.2761, 69.2043,
    '+998900000001', null,
    'nutqbogi_demo', 'nutqbogi_demo', null,
    array['speech_delay', 'dyslalia', 'logomassage', 'defectologist', 'group_lessons'], array['3_5', '5_7', '7_12'],
    90000, 'Bir mashg‘ulot 45 daqiqa', 'Одно занятие 45 минут',
    '{"mon":{"open":"09:00","close":"18:00"},"tue":{"open":"09:00","close":"18:00"},"wed":{"open":"09:00","close":"18:00"},"thu":{"open":"09:00","close":"18:00"},"fri":{"open":"09:00","close":"18:00"},"sat":{"open":"10:00","close":"15:00"},"sun":null}'::jsonb,
    4.8, 64,
    'premium'::center_tier, true, true
  ),
  (
    'Baraka Speech markazi', 'Центр «Baraka Speech»',
    'Duduqlanish va dizartriya bilan ishlashga ixtisoslashgan. Ota-onalar uchun bepul birinchi konsultatsiya.',
    'Специализация на заикании и дизартрии. Первая консультация для родителей бесплатно.',
    'Yunusobod tumani, Amir Temur shoh ko‘chasi 108', 'Юнусабадский район, проспект Амира Темура, 108',
    'Toshkent', 'Yunusobod',
    41.3669, 69.2887,
    '+998900000002', '+998900000012',
    'baraka_speech_demo', null, null,
    array['stuttering', 'dysarthria', 'speech_delay', 'psychologist', 'online'], array['5_7', '7_12', '12_plus'],
    120000, 'Birinchi konsultatsiya bepul', 'Первая консультация бесплатно',
    '{"mon":{"open":"08:30","close":"19:00"},"tue":{"open":"08:30","close":"19:00"},"wed":{"open":"08:30","close":"19:00"},"thu":{"open":"08:30","close":"19:00"},"fri":{"open":"08:30","close":"19:00"},"sat":{"open":"09:00","close":"16:00"},"sun":null}'::jsonb,
    4.6, 41,
    'premium'::center_tier, true, true
  ),
  (
    'Kichkintoy nutq studiyasi', 'Речевая студия «Кичкинтой»',
    'Erta yoshdagi bolalar uchun nutqni rivojlantirish mashg‘ulotlari, o‘yin terapiyasi elementlari bilan.',
    'Занятия по развитию речи для детей раннего возраста с элементами игровой терапии.',
    'Mirzo Ulug‘bek tumani, Mustaqillik shoh ko‘chasi 45', 'Мирзо-Улугбекский район, проспект Мустакиллик, 45',
    'Toshkent', 'Mirzo Ulug‘bek',
    41.3347, 69.3398,
    '+998900000003', null,
    null, 'kichkintoy_demo', null,
    array['speech_delay', 'alalia', 'group_lessons', 'home_visit'], array['0_3', '3_5', '5_7'],
    75000, null, null,
    '{"mon":{"open":"09:00","close":"17:00"},"tue":{"open":"09:00","close":"17:00"},"wed":{"open":"09:00","close":"17:00"},"thu":{"open":"09:00","close":"17:00"},"fri":{"open":"09:00","close":"17:00"},"sat":null,"sun":null}'::jsonb,
    4.4, 23,
    'standard'::center_tier, true, true
  ),
  (
    'Logos defektologiya kabineti', 'Дефектологический кабинет «Логос»',
    'Disleksiya va disgrafiya bilan maktab yoshidagi bolalar bilan ishlash. Maktabga tayyorlov guruhi.',
    'Работа со школьниками при дислексии и дисграфии. Группа подготовки к школе.',
    'Shayxontohur tumani, Navoiy ko‘chasi 30', 'Шайхантахурский район, улица Навои, 30',
    'Toshkent', 'Shayxontohur',
    41.3254, 69.2297,
    '+998900000004', null,
    'logos_demo', null, null,
    array['dyslexia', 'defectologist', 'speech_delay', 'group_lessons'], array['5_7', '7_12'],
    100000, null, null,
    '{"mon":{"open":"10:00","close":"19:00"},"tue":{"open":"10:00","close":"19:00"},"wed":{"open":"10:00","close":"19:00"},"thu":{"open":"10:00","close":"19:00"},"fri":{"open":"10:00","close":"19:00"},"sat":{"open":"10:00","close":"14:00"},"sun":null}'::jsonb,
    4.2, 17,
    'standard'::center_tier, false, true
  ),
  (
    'Umid inklyuziv markazi', 'Инклюзивный центр «Умид»',
    'Autizm spektri va murakkab nutq buzilishlari bilan bolalar uchun kompleks yondashuv: logoped, psixolog, defektolog.',
    'Комплексный подход для детей с РАС и сложными речевыми нарушениями: логопед, психолог, дефектолог.',
    'Yakkasaroy tumani, Shota Rustaveli ko‘chasi 56', 'Яккасарайский район, улица Шота Руставели, 56',
    'Toshkent', 'Yakkasaroy',
    41.2847, 69.2516,
    '+998900000005', null,
    null, 'umid_demo', null,
    array['autism', 'alalia', 'psychologist', 'defectologist', 'logomassage'], array['3_5', '5_7', '7_12'],
    150000, 'Kompleks dastur oyiga hisoblanadi', 'Комплексная программа рассчитывается на месяц',
    '{"mon":{"open":"09:00","close":"18:00"},"tue":{"open":"09:00","close":"18:00"},"wed":{"open":"09:00","close":"18:00"},"thu":{"open":"09:00","close":"18:00"},"fri":{"open":"09:00","close":"18:00"},"sat":{"open":"09:00","close":"13:00"},"sun":null}'::jsonb,
    4.9, 88,
    'standard'::center_tier, true, true
  ),
  (
    'Talaffuz logoped kabineti', 'Логопедический кабинет «Талаффуз»',
    'Tovush talaffuzini to‘g‘rilash bo‘yicha individual mashg‘ulotlar.',
    'Индивидуальные занятия по коррекции звукопроизношения.',
    'Mirobod tumani, Oybek ko‘chasi 18', 'Мирабадский район, улица Айбека, 18',
    'Toshkent', 'Mirobod',
    41.2978, 69.2948,
    '+998900000006', null,
    null, null, null,
    array['dyslalia', 'rhinolalia', 'speech_delay'], array['3_5', '5_7'],
    70000, null, null,
    '{"mon":{"open":"14:00","close":"20:00"},"tue":{"open":"14:00","close":"20:00"},"wed":{"open":"14:00","close":"20:00"},"thu":{"open":"14:00","close":"20:00"},"fri":{"open":"14:00","close":"20:00"},"sat":null,"sun":null}'::jsonb,
    4, 9,
    'free'::center_tier, false, true
  ),
  (
    'Yangi Qadam bolalar markazi', 'Детский центр «Янги Кадам»',
    'Nutq rivojlanishi va maktabga tayyorlov. Uyga chiqish xizmati Olmazor va Uchtepa tumanlari bo‘ylab.',
    'Развитие речи и подготовка к школе. Выезд на дом по Алмазарскому и Учтепинскому районам.',
    'Olmazor tumani, Qorasaroy ko‘chasi 71', 'Алмазарский район, улица Карасарай, 71',
    'Toshkent', 'Olmazor',
    41.3528, 69.2204,
    '+998900000007', null,
    'yangiqadam_demo', null, null,
    array['speech_delay', 'home_visit', 'group_lessons', 'dyslalia'], array['3_5', '5_7', '7_12'],
    80000, 'Uyga chiqish narxi alohida', 'Выезд на дом оплачивается отдельно',
    '{"mon":{"open":"09:00","close":"18:00"},"tue":{"open":"09:00","close":"18:00"},"wed":{"open":"09:00","close":"18:00"},"thu":{"open":"09:00","close":"18:00"},"fri":{"open":"09:00","close":"18:00"},"sat":{"open":"10:00","close":"16:00"},"sun":null}'::jsonb,
    4.3, 31,
    'free'::center_tier, true, true
  ),
  (
    'Sergeli nutq markazi', 'Речевой центр «Сергели»',
    'Onlayn va oflayn mashg‘ulotlar, logopedik massaj.',
    'Онлайн и офлайн занятия, логопедический массаж.',
    'Sergeli tumani, Yangi Sergeli ko‘chasi 4', 'Сергелийский район, улица Янги Сергели, 4',
    'Toshkent', 'Sergeli',
    41.2204, 69.2209,
    '+998900000008', null,
    null, 'sergeli_nutq_demo', null,
    array['logomassage', 'online', 'speech_delay', 'dysarthria'], array['0_3', '3_5', '5_7'],
    65000, null, null,
    '{"mon":{"open":"09:00","close":"17:00"},"tue":{"open":"09:00","close":"17:00"},"wed":{"open":"09:00","close":"17:00"},"thu":{"open":"09:00","close":"17:00"},"fri":{"open":"09:00","close":"17:00"},"sat":null,"sun":null}'::jsonb,
    null, 0,
    'free'::center_tier, false, true
  ),
  (
    'Shifo logoped xizmati', 'Логопедическая служба «Шифо»',
    'Dizartriya va alaliya bo‘yicha neyrologik yondashuv.',
    'Нейрологический подход при дизартрии и алалии.',
    'Yashnobod tumani, Tuzel 1-mavze 9', 'Яшнабадский район, Тузель 1-й квартал, 9',
    'Toshkent', 'Yashnobod',
    41.2896, 69.3203,
    '+998900000009', null,
    null, null, null,
    array['dysarthria', 'alalia', 'logomassage', 'defectologist'], array['3_5', '5_7', '7_12'],
    110000, null, null,
    '{"mon":{"open":"10:00","close":"18:00"},"tue":{"open":"10:00","close":"18:00"},"wed":{"open":"10:00","close":"18:00"},"thu":{"open":"10:00","close":"18:00"},"fri":{"open":"10:00","close":"18:00"},"sat":{"open":"10:00","close":"14:00"},"sun":null}'::jsonb,
    4.5, 26,
    'free'::center_tier, true, true
  ),
  (
    'Uchtepa bolalar nutq kabineti', 'Детский речевой кабинет «Учтепа»',
    'Hamyonbop narxlarda guruhli mashg‘ulotlar.',
    'Групповые занятия по доступным ценам.',
    'Uchtepa tumani, Chinobod ko‘chasi 22', 'Учтепинский район, улица Чинабад, 22',
    'Toshkent', 'Uchtepa',
    41.2948, 69.1704,
    '+998900000010', null,
    null, null, null,
    array['group_lessons', 'speech_delay', 'dyslalia'], array['3_5', '5_7'],
    50000, 'Guruhda 4–6 bola', 'В группе 4–6 детей',
    '{"mon":{"open":"09:00","close":"16:00"},"tue":{"open":"09:00","close":"16:00"},"wed":{"open":"09:00","close":"16:00"},"thu":{"open":"09:00","close":"16:00"},"fri":{"open":"09:00","close":"16:00"},"sat":null,"sun":null}'::jsonb,
    3.9, 12,
    'free'::center_tier, false, true
  );
