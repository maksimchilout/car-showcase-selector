import fs from "fs";
import path from "path";

const carId = "6120";
const root = path.join(process.cwd(), "public/cars", carId, "gallery");
const hero = `/cars/${carId}/gallery/1400x1050_autohomecar__ChtpWGnBItOAB5BGACUyvxVQjUA637.jpg`;

const albumDirs = [
  ["main", "main"],
  ["kuzov", "kuzov"],
  ["salon", "salon"],
  ["exterier", "exterier"],
  ["interier", "interier"],
];

function numericSort(files) {
  return files.sort((a, b) => {
    const na = parseInt(path.basename(a).match(/^(\d+)/)?.[1] ?? "NaN", 10);
    const nb = parseInt(path.basename(b).match(/^(\d+)/)?.[1] ?? "NaN", 10);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
    return a.localeCompare(b, undefined, { numeric: true });
  });
}

function listAlbum(dir) {
  const p = path.join(root, dir);
  if (!fs.existsSync(p)) return [];
  const files = fs
    .readdirSync(p)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .map((f) => `/cars/${carId}/gallery/${dir}/${f}`);

  const allNumbered = files.every((f) => /\/\d+\.(jpe?g|png|webp)$/i.test(f));
  return allNumbered ? numericSort(files) : files.sort((a, b) => a.localeCompare(b));
}

const galleryAlbums = {};
for (const [id, dir] of albumDirs) {
  galleryAlbums[id] = listAlbum(dir);
  console.log(`${id}:`, galleryAlbums[id].map((u) => path.basename(u)).join(", "));
}

const flat = Object.values(galleryAlbums).flat();
const imagesPath = path.join(process.cwd(), "src/lib/car-images.json");
const data = JSON.parse(fs.readFileSync(imagesPath, "utf8"));
data[carId] = {
  ...data[carId],
  galleryAlbums,
  gallery: [hero, ...flat.filter((u) => u !== hero)],
};
fs.writeFileSync(imagesPath, JSON.stringify(data, null, 2) + "\n");
console.log("\nDone. gallery length:", data[carId].gallery.length);
