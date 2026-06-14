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

export type CarHeroFacts = {
  dimensions: string;
  modelYear: string;
  gearbox: string;
};

export const CAR_HERO_FACTS_COMMON = [
  "Белорусская сборка",
  "Доступны финансовые программы",
] as const;

export function carMetaDescription(car: { name: string; heroFacts: CarHeroFacts }): string {
  const { dimensions, modelYear, gearbox } = car.heroFacts;
  return `${car.name}: габариты ${dimensions}, ${modelYear} г., ${gearbox}. ${CAR_HERO_FACTS_COMMON.join(". ")}.`;
}

export type Car = {
  slug: string;
  autohomeId: "3429" | "4370" | "6120";
  name: string;
  subtitle: string;
  heroFacts: CarHeroFacts;
  price: string;
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
  ecoStd?: string;
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
  steeringWheelMat?: string;
  steeringAdjust?: string;
  climateLabel?: string;
  climateZonesLabel?: string;
  emergencyBrakeLabel?: string;
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
        ...(p.ecoStd ? [{ label: "Экологический стандарт", value: p.ecoStd }] : []),
        { label: "Гарантия", value: "3 года или 100 000 км" },
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
        ...(p.features.curtainAirbag !== undefined
          ? [{ label: "Шторки безопасности", value: f("curtainAirbag") }]
          : []),
        { label: "ABS (антиблокировочная система)", value: "есть" },
        { label: "EBD (распределение тормозных усилий)", value: "есть" },
        { label: "ESP (стабилизация)", value: "есть" },
        { label: "Система контроля давления в шинах", value: f("tpms") },
        { label: "Изофикс", value: "есть" },
        {
          label: p.emergencyBrakeLabel ?? "Помощь при экстренном торможении (BAS)",
          value: "есть",
        },
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
      ].filter((item) => item.value !== "—"),
    },
    {
      label: "Экстерьер",
      items: [
        ...(p.features.mirrorPower !== undefined
          ? [{ label: "Электропривод зеркал", value: f("mirrorPower") }]
          : []),
        ...(p.features.foldMirror !== undefined
          ? [{ label: "Электропривод складывания зеркал", value: f("foldMirror") }]
          : []),
        ...(p.features.mirrorHeat !== undefined
          ? [{ label: "Подогрев боковых зеркал", value: f("mirrorHeat") }]
          : []),
        ...(p.features.sunroof !== undefined
          ? [{ label: "Люк / панорамная крыша", value: f("sunroof") }]
          : []),
        ...(p.features.roofRails !== undefined
          ? [{ label: "Рейлинги на крыше", value: f("roofRails") }]
          : []),
        ...(p.features.chromeMoldings !== undefined
          ? [{ label: "Хромированные молдинги", value: f("chromeMoldings") }]
          : []),
      ],
    },
    {
      label: "Интерьер",
      items: [
        { label: "Отделка руля", value: p.steeringWheelMat ?? "кожа" },
        ...(p.features.seatMat !== undefined
          ? [{ label: "Отделка сидений", value: f("seatMat") }]
          : []),
        { label: "Регулировка руля", value: p.steeringAdjust ?? "по высоте и вылету" },
        ...(p.features.driverSeatHeight !== undefined
          ? [
              {
                label: "Регулировка водительского сиденья по высоте",
                value: f("driverSeatHeight"),
              },
            ]
          : []),
        { label: "Электропривод водительского сиденья", value: f("powerSeatDrv") },
        { label: "Электропривод сиденья пассажира", value: f("powerSeatPsg") },
        { label: "Память настроек водительского сиденья", value: f("memorySeat") },
        ...(p.features.frontSeatHeat !== undefined
          ? [{ label: "Подогрев передних сидений", value: f("frontSeatHeat") }]
          : []),
        { label: "Вентиляция передних сидений", value: f("ventSeat") },
        { label: "Подогрев задних сидений", value: f("heatRear") },
        { label: "Подогрев руля", value: f("heatWheel") },
        ...(p.features.rearSeatFold !== undefined
          ? [{ label: "Складывание заднего ряда сидений", value: f("rearSeatFold") }]
          : []),
        ...(p.features.cargoShelf !== undefined
          ? [{ label: "Багажная полка", value: f("cargoShelf") }]
          : []),
      ].filter((item) => item.value !== "—"),
    },
    {
      label: "Комфорт и удобства",
      items: [
        ...(p.features.climate !== undefined
          ? [{ label: p.climateLabel ?? "Климат-контроль", value: f("climate") }]
          : []),
        ...(p.features.climateZones !== undefined
          ? [{ label: p.climateZonesLabel ?? "Зоны климат-контроля", value: f("climateZones") }]
          : []),
        ...(p.features.keyless !== undefined
          ? [{ label: "Бесключевой доступ", value: f("keyless") }]
          : []),
        ...(p.features.startStop !== undefined
          ? [{ label: "Запуск двигателя кнопкой", value: f("startStop") }]
          : []),
        { label: "Электростеклоподъёмники", value: "все" },
        ...(p.features.rainSensor !== undefined
          ? [{ label: "Датчик дождя", value: f("rainSensor") }]
          : []),
        ...(p.features.lightSensor !== undefined
          ? [{ label: "Датчик света", value: f("lightSensor") }]
          : []),
        ...(p.features.ambientLight !== undefined
          ? [{ label: "Атмосферная подсветка салона", value: f("ambientLight") }]
          : []),
        ...(p.features.powerTrunk !== undefined
          ? [{ label: "Электропривод багажника", value: f("powerTrunk") }]
          : []),
      ].filter((item) => item.value !== "—"),
    },
    {
      label: "Мультимедиа",
      items: [
        ...(p.features.display !== undefined
          ? [{ label: "Центральный экран", value: f("display") }]
          : []),
        ...(p.features.digitalCluster !== undefined
          ? [{ label: "Цифровая приборная панель", value: f("digitalCluster") }]
          : []),
        { label: "Bluetooth", value: "есть" },
        ...(p.features.carplay !== undefined
          ? [{ label: "Поддержка CarPlay / Android Auto", value: f("carplay") }]
          : []),
        ...(p.features.nav !== undefined ? [{ label: "Навигация", value: f("nav") }] : []),
        ...(p.features.voice !== undefined
          ? [{ label: "Голосовое управление", value: f("voice") }]
          : []),
        ...(p.features.speakers !== undefined
          ? [{ label: "Количество динамиков", value: f("speakers") }]
          : []),
        ...(p.features.usb !== undefined ? [{ label: "USB-разъёмы", value: f("usb") }] : []),
        ...(p.features.wirelessChg !== undefined
          ? [{ label: "Беспроводная зарядка", value: f("wirelessChg") }]
          : []),
      ].filter((item) => item.value !== "—"),
    },
    {
      label: "Освещение",
      items: [
        ...(p.features.headlights !== undefined
          ? [{ label: "Тип передних фар", value: f("headlights") }]
          : []),
        ...(p.features.drl !== undefined
          ? [{ label: "Светодиодные дневные ходовые огни", value: f("drl") }]
          : []),
        ...(p.features.autoLevel !== undefined
          ? [{ label: "Автоматический корректор фар", value: f("autoLevel") }]
          : []),
        ...(p.features.adaptiveLight !== undefined
          ? [{ label: "Адаптивный свет", value: f("adaptiveLight") }]
          : []),
        ...(p.features.fog !== undefined
          ? [{ label: "Противотуманные фары", value: f("fog") }]
          : []),
        ...(p.features.washer !== undefined
          ? [{ label: "Омыватель фар", value: f("washer") }]
          : []),
        ...(p.features.rearFogLight !== undefined
          ? [{ label: "Задний противотуманный фонарь", value: f("rearFogLight") }]
          : []),
      ].filter((item) => item.value !== "—"),
    },
  ];
}

// ---- Cars ------------------------------------------------------------------

const c3xrGroups = buildGroups({
  bodyType: "Компактный кроссовер (SUV)",
  drive: "Передний (FWD)",
  steeringWheelMat: "пластик",
  steeringAdjust: "по высоте",
  climateLabel: "Кондиционер",
  climateZonesLabel: "Зоны кондиционера",
  power: "85 кВт/116 л.с. при 5500 об/мин",
  torque: "190 Н·м при 1500-3500 об/мин",
  accel: "12.0 с",
  topSpeed: "185 км/ч",
  fuel: "5,98 л / 100 км",
  fuelType: "АИ-95",
  length: "4288 мм", width: "1748 мм", height: "1557 мм", wheelbase: "2655 мм",
  curbWeight: "1220 кг", trunk: "420 л", fuelTank: "47 л",
  engineCode: "PSA, 1.2 PureTech",
  displacement: "1199 см³", cylinders: "3, рядное", valves: "4",
  intake: "Турбонаддув", layout: "Поперечное переднее", compression: "10.5",
  gearbox: "6-ступенчатая роботизированная 6DCT", gears: "6",
  frontSusp: "Независимая, McPherson",
  rearSusp: "Полузависимая, торсионная балка",
  frontBrake: "Дисковые вентилируемые",
  rearBrake: "Дисковые",
  parkBrake: "Механический",
  steering: "Электроусилитель (EPS)",
  frontTire: "205/60 R16", rearTire: "205/60 R16",
  wheel: "Легкосплавные 16\"",
  features: {
    sideAirbag: "есть", tpms: "есть",
    cruise: "есть",
    mirrorPower: "есть",
    roofRails: "есть",
    driverSeatHeight: "есть",
    cargoShelf: "есть",
    climate: "есть",
    climateZones: "1",
    rainSensor: "есть",
    lightSensor: "есть",
    display: "9\" сенсорный",
    digitalCluster: "есть",
    speakers: "4",
    usb: "2 (Type-A и Type-C)",
    headlights: "Галогеновые",
    rearFogLight: "есть",
  },
});

const c5Groups = buildGroups({
  bodyType: "Компактный кроссовер (SUV)",
  drive: "Передний (FWD)",
  power: "129 кВт/175 л.с. при 5500 об/мин",
  torque: "250 Н·м при 1750-4500 об/мин",
  accel: "10.4 с",
  topSpeed: "200 км/ч",
  fuel: "6,96 л / 100 км",
  fuelType: "АИ-95",
  length: "4510 мм", width: "1860 мм", height: "1705 мм", wheelbase: "2730 мм",
  curbWeight: "1485 кг", trunk: "516–1310 л", fuelTank: "53 л",
  engineCode: "PSA, 1.6T PureTech",
  displacement: "1598 см³", cylinders: "4, рядное", valves: "4",
  intake: "Турбонаддув Twin-Scroll",
  layout: "Поперечное переднее", compression: "10,5",
  gearbox: "8-ступенчатый автомат Aisin AT8", gears: "8",
  frontSusp:
    "Независимая пружинная типа McPherson со стабилизатором поперечной устойчивости и с амортизаторами Progressive Hydraulic Cushions",
  rearSusp:
    "Полузависимая пружинная с амортизаторами Progressive Hydraulic Cushions и стабилизатором поперечной устойчивости",
  frontBrake: "Дисковые вентилируемые",
  rearBrake: "Дисковые",
  parkBrake: "Электронный (EPB)",
  steering: "Электроусилитель (EPS)",
  frontTire: "225/55 R18", rearTire: "225/55 R18",
  wheel: "Легкосплавные 18\"",
  features: {
    sideAirbag: "есть", curtainAirbag: "есть", tpms: "есть",
    cruise: "есть",
    ppdcF: "есть",
    cam360: "есть",
    foldMirror: "электрический",
    mirrorHeat: "есть",
    roofRails: "есть",
    chromeMoldings: "есть",
    seatMat: "кожа / эко-кожа",
    rearSeatFold: "есть, 40/60",
    powerSeatDrv: "6 направлений",
    powerSeatPsg: "6 направлений",
    frontSeatHeat: "есть",
    cargoShelf: "есть",
    climate: "автоматический",
    climateZones: "2",
    keyless: "есть",
    startStop: "есть",
    rainSensor: "есть",
    lightSensor: "есть",
    display: "10\" сенсорный",
    digitalCluster: "12.3\"",
    speakers: "6",
    usb: "2 (Type-A и Type-C)",
    wirelessChg: "есть",
    headlights: "Светодиодные (LED)",
    drl: "есть",
    autoLevel: "есть",
    fog: "светодиодные",
  },
});

const c5xGroups = buildGroups({
  bodyType: "кроссбэк",
  drive: "Передний (FWD)",
  emergencyBrakeLabel: "Система экстренного торможения EBA",
  power: "129 кВт / 175 л.с. при 5500 об/мин",
  torque: "250 Н·м при 1750-4500 об/мин",
  accel: "8.9 с",
  topSpeed: "221 км/ч",
  fuel: "6,96 л / 100 км",
  fuelType: "АИ-95",
  length: "4805 мм", width: "1865 мм", height: "1505 мм", wheelbase: "2785 мм",
  curbWeight: "1505 кг", trunk: "545 л (до 1640 л со сложенным рядом)",
  fuelTank: "51 л",
  engineCode: "PSA, 1.6T PureTech",
  displacement: "1598 см³", cylinders: "4, рядное", valves: "4",
  intake: "Турбонаддув Twin-Scroll",
  layout: "Поперечное переднее", compression: "10.5",
  gearbox: "8-ступенчатый автомат Aisin AT8", gears: "8",
  frontSusp:
    "Независимая пружинная типа McPherson со стабилизатором поперечной устойчивости и с амортизаторами Progressive Hydraulic Cushions",
  rearSusp:
    "Полузависимая пружинная с амортизаторами Progressive Hydraulic Cushions и стабилизатором поперечной устойчивости",
  frontBrake: "Дисковые вентилируемые",
  rearBrake: "Дисковые",
  parkBrake: "Электронный (EPB)",
  steering: "Электроусилитель (EPS)",
  frontTire: "225/55 R18", rearTire: "225/55 R18",
  wheel: "Легкосплавные 18\"",
  features: {
    sideAirbag: "есть",
    curtainAirbag: "есть",
    tpms: "есть",
    cruise: "есть",
    foldMirror: "есть",
    sunroof: "есть",
    roofRails: "есть",
    seatMat: "экокожа",
    rearSeatFold: "есть, 40/60",
    powerSeatDrv: "6 направлений",
    frontSeatHeat: "есть",
    cargoShelf: "есть",
    climate: "автоматический",
    climateZones: "2",
    keyless: "есть",
    startStop: "есть",
    rainSensor: "есть",
    lightSensor: "есть",
    display: "10\" сенсорный HD",
    digitalCluster: "7\"",
    speakers: "8",
    usb: "3 (Type-C)",
    headlights: "Adaptive LED Vision",
    drl: "есть",
    autoLevel: "есть",
    fog: "есть",
  },
});

export const CARS: Car[] = [
  {
    slug: "c3-xr",
    autohomeId: "3429",
    name: "Citroën C3-XR",
    subtitle: "Городской кроссовер",
    heroFacts: {
      dimensions: "4288×1748×1557 мм",
      modelYear: "2026",
      gearbox: "6-ступенчатая роботизированная 6DCT",
    },
    price: "74 900 BYN",
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
      { title: "Турбомотор 1.2 PureTech", text: "116 л.с. крутящего удовольствия и низкий расход топлива." },
      { title: "Просторный салон", text: "Колёсная база 2655 мм — комфорт для пятерых." },
      { title: "Французский дизайн", text: "Узнаваемая оптика и фирменные шевроны Citroën." },
    ],
    reasons: [
      { title: "Доступная роскошь", text: "Французский дизайн и качество сборки по цене массового сегмента. Вы получаете узнаваемый стиль и премиальные детали без переплаты." },
      { title: "Экономичность", text: "Расход всего 5,98 л/100 км в смешанном цикле. Надёжный 3-цилиндровый турбомотор PureTech сочетает отзывчивость и бережливость." },
      { title: "Манёвренность в городе", text: "Компактные габариты при просторном салоне на 5 человек. Легко паркуется, удобно передвигаться по плотному трафику." },
      { title: "Панорамная крыша", text: "Свет и воздух в салоне уже в базовой комплектации. Создаёт ощущение простора и открытости каждой поездке." },
      {
        title: "Цифровой салон",
        text: "10\" сенсорный экран, Apple CarPlay и Android Auto, светодиодная оптика и доступ без ключа — технологии, которые упрощают каждую поездку.",
      },
      { title: "Гарантия", text: "Гарантия 3 года или 100 000 км." },
    ],
  },
  {
    slug: "c5",
    autohomeId: "4370",
    name: "Citroën C5 Aircross",
    subtitle: "Компактный кроссовер",
    heroFacts: {
      dimensions: "4510×1860×1705 мм",
      modelYear: "2026",
      gearbox: "8-ступенчатый автомат Aisin AT8",
    },
    price: "94 900 BYN",
    panoId: "73365",
    vrSalonSrc: "https://pano.autohome.com.cn/car/pano/73365?appversion=",
    thumbnail: ids["4370"].gallery[0],
    hero: ids["4370"].gallery[0],
    gallery: ids["4370"].gallery,
    galleryAlbums: ids["4370"].galleryAlbums,
    pano360: ids["4370"].panovr,
    pano360Colors: ids["4370"].pano360Colors,
    specs: c5Groups[0].items,
    specGroups: c5Groups,
    highlights: [
      { title: "1.6T PureTech 175 л.с.", text: "Двигатель PSA и 8AT Aisin — от 1750 об/мин доступны 250 Н·м." },
      { title: "Простор и практичность", text: "Колёсная база 2730 мм, багажник 516–1310 л." },
      { title: "Панорамный обзор", text: "360° экстерьер и VR-салон с autohome." },
    ],
    reasons: [
      { title: "Золотая связка", text: "1.6T PureTech + 8-ступенчатый автомат Aisin — отзывчивый разгон и плавные переключения. Расход 6,96 л/100 км, топливо АИ-95." },
      { title: "Комфорт Citroën", text: "Передние сиденья с подогревом, панорамная крыша, 2-зонный климат и электропривод багажника в топовой комплектации 400THP." },
      { title: "Безопасность и ADAS", text: "Полный скоростной адаптивный круиз, удержание в полосе, контроль слепых зон и камера 360°." },
      { title: "Доступный SUV", text: "Компактные габариты 4510×1860×1705 мм при высоком клиренсе и углах въезда 20°/27°." },
      {
        title: "Вместительный багажник",
        text: "От 516 до 1310 л при сложенных сиденьях — один из самых практичных багажников в классе. Удобно для семьи и дальних поездок.",
      },
      { title: "Гарантия", text: "Гарантия 3 года или 100 000 км." },
    ],
  },
  {
    slug: "c5-x",
    autohomeId: "6120",
    name: "Citroën C5 X",
    subtitle: "Кроссовер-фастбэк",
    heroFacts: {
      dimensions: "4805×1865×1505 мм",
      modelYear: "2026",
      gearbox: "8-ступенчатый автомат Aisin AT8",
    },
    price: "95 900 BYN",
    panoId: "76917",
    vrSalonSrc: "https://pano.autohome.com.cn/car/pano/76915?appversion=",
    thumbnail: ids["6120"].gallery[0],
    hero: ids["6120"].gallery[0],
    gallery: ids["6120"].gallery,
    galleryAlbums: ids["6120"].galleryAlbums,
    pano360: ids["6120"].panovr,
    pano360Colors: ids["6120"].pano360Colors,
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
      {
        title: "Простор бизнес-класса",
        text: "Колёсная база 2785 мм и багажник до 1640 л. Задний ряд с комфортом для взрослых — редкое сочетание для кроссовера-фастбэка.",
      },
      { title: "Гарантия", text: "Гарантия 3 года или 100 000 км." },
    ],
  },
];

export function getCarBySlug(slug: string): Car | undefined {
  return CARS.find((c) => c.slug === slug);
}
