import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const imagesJsonPath = path.join(root, "src/lib/car-images.json");
const publicRoot = path.join(root, "public/cars");

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  Referer: "https://www.autohome.com.cn/",
};

function filenameFromUrl(url, index, folder) {
  const hash = url.match(/autohomecar__([A-Za-z0-9_-]+)/);
  const base = hash ? hash[1] : `${folder}-${String(index).padStart(3, "0")}`;
  if (/\.png/i.test(url)) return `${base}.png`;
  if (/\.webp/i.test(url)) return `${base}.webp`;
  return `${base}.jpg`;
}

async function download(url, dest) {
  if (fs.existsSync(dest)) return true;
  const dir = path.dirname(dest);
  fs.mkdirSync(dir, { recursive: true });
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(120000) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return true;
}

async function mapWithConcurrency(items, fn, limit = 6) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

const data = JSON.parse(fs.readFileSync(imagesJsonPath, "utf8"));
const out = {};

for (const [carId, car] of Object.entries(data)) {
  console.log(`\n=== ${carId} ===`);
  out[carId] = { panovr: [], gallery: [] };

  const panoTasks = car.panovr.map((url, index) => ({
    url,
    dest: path.join(publicRoot, carId, "panovr", filenameFromUrl(url, index, "frame")),
    publicPath: `/cars/${carId}/panovr/${filenameFromUrl(url, index, "frame")}`,
  }));

  const galleryTasks = car.gallery.map((url, index) => ({
    url,
    dest: path.join(publicRoot, carId, "gallery", filenameFromUrl(url, index, "photo")),
    publicPath: `/cars/${carId}/gallery/${filenameFromUrl(url, index, "photo")}`,
  }));

  let ok = 0;
  let fail = 0;
  const allTasks = [...panoTasks, ...galleryTasks];

  await mapWithConcurrency(allTasks, async (task) => {
    try {
      await download(task.url, task.dest);
      ok++;
      process.stdout.write(".");
    } catch (e) {
      fail++;
      console.error("\nFAIL", task.url, e.message);
    }
  });

  out[carId].panovr = panoTasks.map((t, i) => {
    const name = filenameFromUrl(t.url, i, "frame");
    const dest = path.join(publicRoot, carId, "panovr", name);
    return fs.existsSync(dest) ? `/cars/${carId}/panovr/${name}` : t.url;
  });
  out[carId].gallery = galleryTasks.map((t, i) => {
    const name = filenameFromUrl(t.url, i, "photo");
    const dest = path.join(publicRoot, carId, "gallery", name);
    return fs.existsSync(dest) ? `/cars/${carId}/gallery/${name}` : t.url;
  });

  console.log(`\n${carId}: ok=${ok} fail=${fail}`);
}

fs.writeFileSync(imagesJsonPath, JSON.stringify(out, null, 2) + "\n");
console.log("\nUpdated", imagesJsonPath);
