import carImages from "./car-images.json";

export type CarSpec = { label: string; value: string };

export type Car = {
  slug: string;
  autohomeId: "3429" | "792" | "6120";
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  price: string;
  oldPrice?: string;
  panoId: string;
  thumbnail: string;
  hero: string;
  gallery: string[];
  pano360: string[];
  specs: CarSpec[];
  highlights: { title: string; text: string }[];
};

const ids = carImages as Record<string, { panovr: string[]; gallery: string[] }>;

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
    thumbnail: ids["3429"].gallery[0],
    hero: ids["3429"].gallery[0],
    gallery: ids["3429"].gallery,
    pano360: ids["3429"].panovr,
    specs: [
      { label: "Тип кузова", value: "Кроссовер" },
      { label: "Двигатель", value: "1.2 л, турбо" },
      { label: "Мощность", value: "136 л.с." },
      { label: "Коробка передач", value: "6-АКПП" },
      { label: "Привод", value: "Передний" },
      { label: "Разгон 0–100 км/ч", value: "10.1 с" },
      { label: "Расход топлива", value: "5.9 л / 100 км" },
      { label: "Длина", value: "4288 мм" },
      { label: "Ширина", value: "1748 мм" },
      { label: "Высота", value: "1570 мм" },
      { label: "Колёсная база", value: "2655 мм" },
      { label: "Объём багажника", value: "520 л" },
    ],
    highlights: [
      { title: "Турбомотор 1.2T", value: "", text: "136 л.с. крутящего удовольствия и низкий расход топлива." } as never,
      { title: "Просторный салон", text: "Колёсная база 2655 мм — комфорт для пятерых." },
      { title: "Французский дизайн", text: "Узнаваемая оптика и фирменные шевроны Citroën." },
    ].map(({ title, text }) => ({ title, text })),
  },
  {
    slug: "c5",
    autohomeId: "792",
    name: "Citroën C5",
    subtitle: "Бизнес-седан",
    tagline: "Комфорт высшего класса",
    description:
      "Флагманский седан с гидропневматической родословной, плавностью хода и продуманной эргономикой для дальних поездок.",
    price: "78 900 BYN",
    oldPrice: "84 500 BYN",
    panoId: "30786",
    thumbnail: ids["792"].gallery[0],
    hero: ids["792"].gallery[0],
    gallery: ids["792"].gallery,
    pano360: ids["792"].panovr,
    specs: [
      { label: "Тип кузова", value: "Седан" },
      { label: "Двигатель", value: "1.8 л, турбо" },
      { label: "Мощность", value: "204 л.с." },
      { label: "Коробка передач", value: "6-АКПП" },
      { label: "Привод", value: "Передний" },
      { label: "Разгон 0–100 км/ч", value: "8.9 с" },
      { label: "Расход топлива", value: "6.8 л / 100 км" },
      { label: "Длина", value: "4805 мм" },
      { label: "Ширина", value: "1860 мм" },
      { label: "Высота", value: "1475 мм" },
      { label: "Колёсная база", value: "2815 мм" },
      { label: "Объём багажника", value: "532 л" },
    ],
    highlights: [
      { title: "Плавность хода", text: "Подвеска с прогрессивными гидравлическими упорами." },
      { title: "Тихий салон", text: "Шумоизоляция уровня премиум-класса." },
      { title: "Богатое оснащение", text: "Климат, кожа, проекция на лобовое — в стандарте." },
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
    specs: [
      { label: "Тип кузова", value: "Кроссовер-фастбэк" },
      { label: "Двигатель", value: "1.6 л, турбо" },
      { label: "Мощность", value: "175 л.с." },
      { label: "Коробка передач", value: "8-АКПП" },
      { label: "Привод", value: "Передний" },
      { label: "Разгон 0–100 км/ч", value: "8.6 с" },
      { label: "Расход топлива", value: "6.4 л / 100 км" },
      { label: "Длина", value: "4805 мм" },
      { label: "Ширина", value: "1865 мм" },
      { label: "Высота", value: "1505 мм" },
      { label: "Колёсная база", value: "2785 мм" },
      { label: "Объём багажника", value: "545 л" },
    ],
    highlights: [
      { title: "Advanced Comfort®", text: "Прогрессивные подушки сидений и адаптивная подвеска." },
      { title: "12\" мультимедиа", text: "Большой экран, беспроводной CarPlay и Android Auto." },
      { title: "Полный пакет ADAS", text: "Адаптивный круиз, удержание в полосе, автоторможение." },
    ],
  },
];

export function getCarBySlug(slug: string): Car | undefined {
  return CARS.find((c) => c.slug === slug);
}
