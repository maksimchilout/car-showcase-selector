import carImages from "./car-images.json";

export type CarSpec = { label: string; value: string };
export type SpecGroup = { label: string; items: CarSpec[] };

export type GalleryAlbums = {
  main: string[];
  kuzov?: string[];
  salon: string[];
  exterier: string[];
  interier: string[];
};

export type GalleryCategory = { id: string; label: string; images: string[] };

export type Pano360Color = { id: string; name: string; hex: string; frames: string[] };

export type Car = {
  slug: string;
  autohomeId: "3429" | "4370" | "6120";
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  price: string;
  oldPrice?: string;
  panoId: string;
  /** Полный URL iframe VR-салона (если отличается от /car/inn/{panoId}) */
  vrSalonSrc?: string;
  thumbnail: string;
  hero: string;
  gallery: string[];
  galleryAlbums?: GalleryAlbums;
  pano360: string[];
  pano360Colors?: Pano360Color[];
  specs: CarSpec[];
  specGroups: SpecGroup[];
  highlights: { title: string; text: string }[];
  reasons: { title: string; text: string }[];
};

const ids = carImages as Record<
  string,
  {
    panovr: string[];
    gallery: string[];
    galleryAlbums?: GalleryAlbums;
    pano360Colors?: Pano360Color[];
  }
>;

const GALLERY_ALBUM_LABELS: { id: keyof GalleryAlbums; label: string }[] = [
  { id: "main", label: "Общие" },
  { id: "kuzov", label: "Кузов" },
  { id: "salon", label: "Салон" },
  { id: "exterier", label: "Экстерьер" },
  { id: "interier", label: "Интерьер" },
];

export function getGalleryCategories(albums?: GalleryAlbums): GalleryCategory[] | undefined {
  if (!albums) return undefined;
  const categories = GALLERY_ALBUM_LABELS.map(({ id, label }) => ({
    id,
    label,
    images: albums[id] ?? [],
  })).filter((cat) => cat.images.length > 0);
  return categories.length > 0 ? categories : undefined;
}

// ---- Spec group factory ----------------------------------------------------
function buildGroups(p: {
  bodyType: string;
  drive: string;
  power: string; // "136 л.с. (100 кВт)"
  torque: string;
  accel: string;
  topSpeed: string;
  fuel: string;
  fuelType: string;
  ecoStd: string;
  // dimensions
  length: string; width: string; height: string; wheelbase: string;
  curbWeight: string; trunk: string;
  fuelTank: string;
  // engine
  engineCode: string; displacement: string; cylinders: string; valves: string;
  intake: string; layout: string; compression: string;
  // transmission
  gearbox: string; gears: string;
  // chassis
  frontSusp: string; rearSusp: string;
  frontBrake: string; rearBrake: string;
  parkBrake: string;
  steering: string;
  frontTire: string; rearTire: string; wheel: string;
  // safety / features (booleans rendered as есть/нет)
  features: Partial<Record<string, string>>;
}): SpecGroup[] {
  const f = (k: string) => p.features[k] ?? "—";
  return [
    {
      label: "Основные",
      items: [
        { label: "Тип кузова", value: p.bodyType },
        { label: "Привод", value: p.drive },
        { label: "Мощность", value: p.power },
        { label: "Крутящий момент", value: p.torque },
        { label: "Разгон 0–100 км/ч", value: p.accel },
        { label: "Максимальная скорость", value: p.topSpeed },
        { label: "Расход топлива (смеш.)", value: p.fuel },
        { label: "Тип топлива", value: p.fuelType },
        { label: "Экологический стандарт", value: p.ecoStd },
        { label: "Гарантия", value: "1 год" },
      ],
    },
    {
      label: "Габариты",
      items: [
        { label: "Длина", value: p.length },
        { label: "Ширина", value: p.width },
        { label: "Высота", value: p.height },
        { label: "Колёсная база", value: p.wheelbase },
        { label: "Снаряжённая масса", value: p.curbWeight },
        { label: "Объём багажника", value: p.trunk },
        { label: "Объём топливного бака", value: p.fuelTank },
        { label: "Количество мест", value: "5" },
        { label: "Количество дверей", value: "5" },
      ],
    },
    {
      label: "Двигатель",
      items: [
        { label: "Модель двигателя", value: p.engineCode },
        { label: "Рабочий объём", value: p.displacement },
        { label: "Количество цилиндров", value: p.cylinders },
        { label: "Клапанов на цилиндр", value: p.valves },
        { label: "Тип впуска", value: p.intake },
        { label: "Расположение", value: p.layout },
        { label: "Степень сжатия", value: p.compression },
        { label: "Максимальная мощность", value: p.power },
        { label: "Максимальный крутящий момент", value: p.torque },
      ],
    },
    {
      label: "Трансмиссия",
      items: [
        { label: "Коробка передач", value: p.gearbox },
        { label: "Число передач", value: p.gears },
        { label: "Привод", value: p.drive },
      ],
    },
    {
      label: "Шасси и подвеска",
      items: [
        { label: "Передняя подвеска", value: p.frontSusp },
        { label: "Задняя подвеска", value: p.rearSusp },
        { label: "Передние тормоза", value: p.frontBrake },
        { label: "Задние тормоза", value: p.rearBrake },
        { label: "Стояночный тормоз", value: p.parkBrake },
        { label: "Усилитель руля", value: p.steering },
        { label: "Передние шины", value: p.frontTire },
        { label: "Задние шины", value: p.rearTire },
        { label: "Колёсные диски", value: p.wheel },
      ],
    },
    {
      label: "Безопасность",
      items: [
        { label: "Подушки безопасности водителя", value: "есть" },
        { label: "Подушки безопасности переднего пассажира", value: "есть" },
        { label: "Боковые подушки безопасности", value: f("sideAirbag") },
        { label: "Шторки безопасности", value: f("curtainAirbag") },
        { label: "ABS (антиблокировочная система)", value: "есть" },
        { label: "EBD (распределение тормозных усилий)", value: "есть" },
        { label: "ESP (стабилизация)", value: "есть" },
        { label: "Система контроля давления в шинах", value: f("tpms") },
        { label: "Изофикс", value: "есть" },
        { label: "Помощь при экстренном торможении (BAS)", value: "есть" },
      ],
    },
    {
      label: "Помощь водителю",
      items: [
        { label: "Круиз-контроль", value: f("cruise") },
        { label: "Адаптивный круиз-контроль", value: f("acc") },
        { label: "Удержание в полосе", value: f("lka") },
        { label: "Автоматическое экстренное торможение", value: f("aeb") },
        { label: "Контроль слепых зон", value: f("blind") },
        { label: "Парктроник передний", value: f("ppdcF") },
        { label: "Парктроник задний", value: "есть" },
        { label: "Камера заднего вида", value: "есть" },
        { label: "Камера 360°", value: f("cam360") },
        { label: "Автопарковка", value: f("apa") },
        { label: "Распознавание дорожных знаков", value: f("tsr") },
      ],
    },
    {
      label: "Экстерьер",
      items: [
        { label: "Электропривод складывания зеркал", value: f("foldMirror") },
        { label: "Подогрев боковых зеркал", value: "есть" },
        { label: "Люк / панорамная крыша", value: f("sunroof") },
        { label: "Рейлинги на крыше", value: f("roofRails") },
        { label: "Хромированные молдинги", value: "есть" },
      ],
    },
    {
      label: "Интерьер",
      items: [
        { label: "Отделка руля", value: "кожа" },
        { label: "Отделка сидений", value: f("seatMat") },
        { label: "Регулировка руля", value: "по высоте и вылету" },
        { label: "Электропривод водительского сиденья", value: f("powerSeatDrv") },
        { label: "Электропривод сиденья пассажира", value: f("powerSeatPsg") },
        { label: "Память настроек водительского сиденья", value: f("memorySeat") },
        { label: "Подогрев передних сидений", value: "есть" },
        { label: "Вентиляция передних сидений", value: f("ventSeat") },
        { label: "Подогрев задних сидений", value: f("heatRear") },
        { label: "Подогрев руля", value: f("heatWheel") },
        { label: "Складывание заднего ряда сидений", value: "есть, 40/60" },
      ],
    },
    {
      label: "Комфорт и удобства",
      items: [
        { label: "Климат-контроль", value: f("climate") },
        { label: "Зоны климат-контроля", value: f("climateZones") },
        { label: "Бесключевой доступ", value: f("keyless") },
        { label: "Запуск двигателя кнопкой", value: f("startStop") },
        { label: "Электростеклоподъёмники", value: "все" },
        { label: "Датчик дождя", value: f("rainSensor") },
        { label: "Датчик света", value: f("lightSensor") },
        { label: "Атмосферная подсветка салона", value: f("ambientLight") },
        { label: "Электропривод багажника", value: f("powerTrunk") },
      ],
    },
    {
      label: "Мультимедиа",
      items: [
        { label: "Центральный экран", value: f("display") },
        { label: "Цифровая приборная панель", value: f("digitalCluster") },
        { label: "Bluetooth", value: "есть" },
        { label: "Поддержка CarPlay / Android Auto", value: f("carplay") },
        { label: "Навигация", value: f("nav") },
        { label: "Голосовое управление", value: f("voice") },
        { label: "Количество динамиков", value: f("speakers") },
        { label: "USB-разъёмы", value: f("usb") },
        { label: "Беспроводная зарядка", value: f("wirelessChg") },
      ],
    },
    {
      label: "Освещение",
      items: [
        { label: "Тип передних фар", value: f("headlights") },
        { label: "Светодиодные дневные ходовые огни", value: "есть" },
        { label: "Автоматический корректор фар", value: f("autoLevel") },
        { label: "Адаптивный свет", value: f("adaptiveLight") },
        { label: "Противотуманные фары", value: f("fog") },
        { label: "Омыватель фар", value: f("washer") },
      ],
    },
  ];
}

// ---- Cars ------------------------------------------------------------------

const c3xrGroups = buildGroups({
  bodyType: "Компактный кроссовер (SUV)",
  drive: "Передний (FWD)",
  power: "100 кВт / 136 л.с. при 5500 об/мин",
  torque: "230 Н·м при 1750 об/мин",
  accel: "10.1 с",
  topSpeed: "190 км/ч",
  fuel: "5.9 л / 100 км",
  fuelType: "АИ-95",
  ecoStd: "Евро-6",
  length: "4288 мм", width: "1748 мм", height: "1570 мм", wheelbase: "2655 мм",
  curbWeight: "1265 кг", trunk: "520 л", fuelTank: "53 л",
  engineCode: "PSA EB2ADTS, 1.2 THP",
  displacement: "1199 см³", cylinders: "3, рядное", valves: "4",
  intake: "Турбонаддув", layout: "Поперечное переднее", compression: "10.5",
  gearbox: "6-ступенчатый автомат AT6", gears: "6",
  frontSusp: "Независимая, McPherson",
  rearSusp: "Полузависимая, торсионная балка",
  frontBrake: "Дисковые вентилируемые",
  rearBrake: "Дисковые",
  parkBrake: "Механический",
  steering: "Электроусилитель (EPS)",
  frontTire: "215/50 R17", rearTire: "215/50 R17",
  wheel: "Легкосплавные 17\"",
  features: {
    sideAirbag: "есть", curtainAirbag: "есть", tpms: "есть",
    cruise: "есть", acc: "—", lka: "—", aeb: "—", blind: "—",
    ppdcF: "—", cam360: "—", apa: "—", tsr: "—",
    foldMirror: "электрический", sunroof: "панорамная крыша", roofRails: "есть",
    seatMat: "ткань / эко-кожа",
    powerSeatDrv: "—", powerSeatPsg: "—", memorySeat: "—",
    ventSeat: "—", heatRear: "—", heatWheel: "—",
    climate: "автоматический", climateZones: "1",
    keyless: "есть", startStop: "есть",
    rainSensor: "есть", lightSensor: "есть", ambientLight: "есть", powerTrunk: "—",
    display: "10\" сенсорный", digitalCluster: "—",
    carplay: "Apple CarPlay, Android Auto", nav: "есть", voice: "есть",
    speakers: "6", usb: "2", wirelessChg: "—",
    headlights: "Светодиодные (LED)", autoLevel: "есть",
    adaptiveLight: "—", fog: "светодиодные", washer: "—",
  },
});

const c5Groups = buildGroups({
  bodyType: "Компактный кроссовер (SUV)",
  drive: "Передний (FWD)",
  power: "155 кВт / 211 л.с. при 5500 об/мин",
  torque: "300 Н·м при 1900–4500 об/мин",
  accel: "—",
  topSpeed: "220 км/ч",
  fuel: "6.97 л / 100 км (WLTC)",
  fuelType: "АИ-92",
  ecoStd: "Китай-6",
  length: "4510 мм", width: "1860 мм", height: "1705 мм", wheelbase: "2730 мм",
  curbWeight: "1457 кг", trunk: "516–1310 л", fuelTank: "53 л",
  engineCode: "6G03, 1.8T",
  displacement: "1751 см³", cylinders: "4, рядное", valves: "4",
  intake: "Турбонаддув, CVVT/CVVL",
  layout: "Поперечное переднее", compression: "—",
  gearbox: "8-ступенчатый автомат Aisin AT8", gears: "8",
  frontSusp: "Независимая, McPherson",
  rearSusp: "Полузависимая, торсионная балка",
  frontBrake: "Дисковые вентилируемые",
  rearBrake: "Дисковые",
  parkBrake: "Электронный (EPB)",
  steering: "Электроусилитель (EPS)",
  frontTire: "225/55 R18", rearTire: "225/55 R18",
  wheel: "Легкосплавные 18\"",
  features: {
    sideAirbag: "есть", curtainAirbag: "есть", tpms: "есть",
    cruise: "есть", acc: "есть, полный скоростной диапазон", lka: "есть", aeb: "есть", blind: "есть",
    ppdcF: "есть", cam360: "есть", apa: "—", tsr: "есть",
    foldMirror: "электрический", sunroof: "панорамная",
    roofRails: "есть",
    seatMat: "кожа / эко-кожа",
    powerSeatDrv: "6 направлений", powerSeatPsg: "4 направления",
    memorySeat: "—",
    ventSeat: "—", heatRear: "есть", heatWheel: "есть",
    climate: "автоматический", climateZones: "2",
    keyless: "есть", startStop: "есть",
    rainSensor: "есть", lightSensor: "есть", ambientLight: "есть",
    powerTrunk: "электропривод",
    display: "10\" сенсорный", digitalCluster: "12.3\"",
    carplay: "Apple CarPlay, Android Auto",
    nav: "есть",
    voice: "есть",
    speakers: "8", usb: "2 (Type-A и Type-C)",
    wirelessChg: "—",
    headlights: "Светодиодные (LED)",
    autoLevel: "есть", adaptiveLight: "—",
    fog: "светодиодные", washer: "—",
  },
});

const c5xGroups = buildGroups({
  bodyType: "Кроссовер-фастбэк",
  drive: "Передний (FWD)",
  power: "129 кВт / 175 л.с. при 5500 об/мин",
  torque: "250 Н·м при 1650 об/мин",
  accel: "8.6 с",
  topSpeed: "210 км/ч",
  fuel: "6.4 л / 100 км",
  fuelType: "АИ-95",
  ecoStd: "Евро-6",
  length: "4805 мм", width: "1865 мм", height: "1505 мм", wheelbase: "2785 мм",
  curbWeight: "1560 кг", trunk: "545 л (до 1640 л со сложенным рядом)",
  fuelTank: "53 л",
  engineCode: "PSA EP6FDT, 1.6T PureTech",
  displacement: "1598 см³", cylinders: "4, рядное", valves: "4",
  intake: "Турбонаддув Twin-Scroll",
  layout: "Поперечное переднее", compression: "10.5",
  gearbox: "8-ступенчатый автомат Aisin AT8", gears: "8",
  frontSusp: "McPherson с прогрессивными гидравлическими упорами PHC",
  rearSusp: "Многорычажная с PHC (Citroën Advanced Comfort®)",
  frontBrake: "Дисковые вентилируемые",
  rearBrake: "Дисковые",
  parkBrake: "Электронный (EPB) с авто-удержанием",
  steering: "Электроусилитель (EPS)",
  frontTire: "235/55 R19", rearTire: "235/55 R19",
  wheel: "Легкосплавные 19\" диамантированные",
  features: {
    sideAirbag: "есть", curtainAirbag: "есть, на оба ряда",
    tpms: "с индикацией давления",
    cruise: "есть", acc: "есть, Stop&Go", lka: "есть",
    aeb: "есть, с распознаванием пешеходов и велосипедистов",
    blind: "есть", ppdcF: "есть", cam360: "Top Rear Vision 360°",
    apa: "Park Assist полуавтомат", tsr: "есть",
    foldMirror: "электрический складывающийся с памятью",
    sunroof: "панорамная стеклянная крыша",
    roofRails: "хромированные",
    seatMat: "Advanced Comfort кожа / Alcantara",
    powerSeatDrv: "8 направлений с массажем",
    powerSeatPsg: "6 направлений", memorySeat: "есть, 2 профиля",
    ventSeat: "есть", heatRear: "есть", heatWheel: "есть",
    climate: "автоматический", climateZones: "2",
    keyless: "Hands Free Access",
    startStop: "есть",
    rainSensor: "есть", lightSensor: "есть",
    ambientLight: "многоцветная LED 8 цветов",
    powerTrunk: "электропривод с сенсорным открыванием",
    display: "12\" сенсорный HD", digitalCluster: "12\"",
    carplay: "Беспроводные Apple CarPlay и Android Auto",
    nav: "Connected Nav в реальном времени",
    voice: "есть, естественный язык",
    speakers: "12 Hi-Fi Premium", usb: "4 (Type-C)",
    wirelessChg: "есть, 15 Вт",
    headlights: "Adaptive LED Vision",
    autoLevel: "есть", adaptiveLight: "адаптивный AFS",
    fog: "интегрированы в LED-блок", washer: "есть",
  },
});

export const CARS: Car[] = [
  {
    slug: "c3-xr",
    autohomeId: "3429",
    name: "Citroën C3-XR",
    subtitle: "Городской кроссовер",
    tagline: "Французский стиль для города",
    description:
      "Компактный кроссовер с яркой внешностью, просторным салоном и экономичным турбомотором. Идеален для города и коротких путешествий.",
    price: "55 700 BYN",
    oldPrice: "62 400 BYN",
    panoId: "51393",
    vrSalonSrc: "https://pano.autohome.com.cn/car/pano/51393?appversion=",
    thumbnail: ids["3429"].gallery[0],
    hero: ids["3429"].gallery[0],
    gallery: ids["3429"].gallery,
    galleryAlbums: ids["3429"].galleryAlbums,
    pano360: ids["3429"].panovr,
    specs: c3xrGroups[0].items,
    specGroups: c3xrGroups,
    highlights: [
      { title: "Турбомотор 1.2 THP", text: "136 л.с. крутящего удовольствия и низкий расход топлива." },
      { title: "Просторный салон", text: "Колёсная база 2655 мм — комфорт для пятерых." },
      { title: "Французский дизайн", text: "Узнаваемая оптика и фирменные шевроны Citroën." },
    ],
    reasons: [
      { title: "Доступная роскошь", text: "Французский дизайн и качество сборки по цене массового сегмента. Вы получаете узнаваемый стиль и премиальные детали без переплаты." },
      { title: "Экономичность", text: "Расход всего 5.9 л/100 км в смешанном цикле. Надёжный 3-цилиндровый турбомотор THP сочетает отзывчивость и бережливость." },
      { title: "Манёвренность в городе", text: "Компактные габариты при просторном салоне на 5 человек. Легко паркуется, удобно передвигаться по плотному трафику." },
      { title: "Панорамная крыша", text: "Свет и воздух в салоне уже в базовой комплектации. Создаёт ощущение простора и открытости каждой поездке." },
    ],
  },
  {
    slug: "c5",
    autohomeId: "4370",
    name: "Citroën C5 Aircross",
    subtitle: "Компактный кроссовер",
    tagline: "Французский комфорт в формате SUV",
    description:
      "Компактный кроссовер 2026 модельного года с турбомотором 1.8T (211 л.с.), 8-ступенчатым автоматом и просторным салоном. Плавность хода и узнаваемый стиль Citroën.",
    price: "60 900 BYN",
    oldPrice: "66 400 BYN",
    panoId: "73365",
    thumbnail: ids["4370"].gallery[0],
    hero: ids["4370"].gallery[0],
    gallery: ids["4370"].gallery,
    pano360: ids["4370"].panovr,
    pano360Colors: ids["4370"].pano360Colors,
    specs: c5Groups[0].items,
    specGroups: c5Groups,
    highlights: [
      { title: "1.8T 211 л.с.", text: "Двигатель 6G03 и 8AT Aisin — от 1900 об/мин доступны 300 Н·м." },
      { title: "Простор и практичность", text: "Колёсная база 2730 мм, багажник 516–1310 л." },
      { title: "Панорамный обзор", text: "360° экстерьер и VR-салон с autohome." },
    ],
    reasons: [
      { title: "Золотая связка", text: "1.8T + 8-ступенчатый автомат Aisin — отзывчивый разгон и плавные переключения. Расход WLTC 6.97 л/100 км, топливо АИ-92." },
      { title: "Комфорт Citroën", text: "Передние сиденья с подогревом, панорамная крыша, 2-зонный климат и электропривод багажника в топовой комплектации 400THP." },
      { title: "Безопасность и ADAS", text: "Полный скоростной адаптивный круиз, удержание в полосе, контроль слепых зон и камера 360°." },
      { title: "Доступный SUV", text: "Компактные габариты 4510×1860×1705 мм при высоком клиренсе и углах въезда 20°/27°." },
    ],
  },
  {
    slug: "c5-x",
    autohomeId: "6120",
    name: "Citroën C5 X (Versailles)",
    subtitle: "Кроссовер-фастбэк",
    tagline: "Новая эра комфорта",
    description:
      "Гибрид седана, универсала и кроссовера. Уникальный силуэт, продвинутая мультимедиа и фирменная плавность Citroën Advanced Comfort®.",
    price: "92 400 BYN",
    oldPrice: "99 800 BYN",
    panoId: "76917",
    thumbnail: ids["6120"].gallery[0],
    hero: ids["6120"].gallery[0],
    gallery: ids["6120"].gallery,
    pano360: ids["6120"].panovr,
    specs: c5xGroups[0].items,
    specGroups: c5xGroups,
    highlights: [
      { title: "Advanced Comfort®", text: "Прогрессивные подушки сидений и адаптивная подвеска." },
      { title: "12\" мультимедиа", text: "Большой экран, беспроводной CarPlay и Android Auto." },
      { title: "Полный пакет ADAS", text: "Адаптивный круиз, удержание в полосе, автоторможение." },
    ],
    reasons: [
      { title: "Уникальный силуэт", text: "Единственный в классе кроссовер-фастбэк. Соединяет элегантность седана, практичность универсала и проходимость кроссовера в одном автомобиле." },
      { title: "Advanced Comfort®", text: "Прогрессивные подушки сидений и адаптивная подвеска PHC гасят даже мелкие неровности. Вы почувствуете разницу с первого метра." },
      { title: "Цифровой кокпит", text: "Два 12-дюймовых экрана, беспроводной CarPlay и Android Auto, премиум-аудио на 12 динамиков. Технологии уровня люкс-автомобилей." },
      { title: "Всё включено", text: "360° камера, массаж водительского кресла, полуавтоматическая парковка, многоцветная атмосферная подсветка — вся инновационная начинка уже в комплектации." },
    ],
  },
];

export function getCarBySlug(slug: string): Car | undefined {
  return CARS.find((c) => c.slug === slug);
}
