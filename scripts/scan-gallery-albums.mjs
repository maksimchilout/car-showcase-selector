import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "public/cars");
const carId = "3429";
const albums = [
  { id: "main", label: "Общие" },
  { id: "kuzov", label: "Кузов" },
  { id: "salon", label: "Салон" },
  { id: "exterier", label: "Экстерьер" },
  { id: "interier", label: "Интерьер" },
];

const galleryAlbums = {};
for (const { id } of albums) {
  const dir = path.join(root, carId, "gallery", id);
  if (!fs.existsSync(dir)) {
    galleryAlbums[id] = [];
    continue;
  }
  galleryAlbums[id] = fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort()
    .map((f) => `/cars/${carId}/gallery/${id}/${f}`);
}

const imagesPath = path.join(process.cwd(), "src/lib/car-images.json");
const data = JSON.parse(fs.readFileSync(imagesPath, "utf8"));
const heroOverride = "/cars/3429/gallery/1400x1050_autohomecar__ChsEoF8VVsqAbcFqAALXISp_WfQ424.jpg";
const flat = Object.values(galleryAlbums).flat();
const hero = fs.existsSync(path.join(process.cwd(), "public", heroOverride.slice(1)))
  ? heroOverride
  : galleryAlbums.main[0] ?? flat[0];

data[carId] = {
  ...data[carId],
  galleryAlbums,
  gallery: [hero, ...flat.filter((u) => u !== hero)],
};

fs.writeFileSync(imagesPath, JSON.stringify(data, null, 2) + "\n");
console.log(
  Object.entries(galleryAlbums)
    .map(([k, v]) => `${k}: ${v.length}`)
    .join(", "),
);
