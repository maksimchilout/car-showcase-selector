import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const CAR_ID = "6120";
const PANO_EXT_ID = "6856";
/** Белый, синий, тёмно-серый (как у C5 Aircross) */
const COLOR_IDS = new Set(["1175", "11477", "7188"]);
const imagesJsonPath = path.join(root, "src/lib/car-images.json");
const publicRoot = path.join(root, "public/cars", CAR_ID, "panovr");

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  Referer: "https://pano.autohome.com.cn/",
};

function panoUrl(rel) {
  const p = rel.replace(/\.png\.png$/i, ".png");
  const hd = p.replace(/1200x0_/, "2400x0_");
  return `https://img3.autoimg.cn/pano/${hd}`;
}

function filenameFromUrl(url) {
  const hash = url.match(/autohomecar__([A-Za-z0-9_-]+)/);
  return hash ? `${hash[1]}.png` : `frame-${Date.now()}.png`;
}

async function download(url, dest) {
  if (fs.existsSync(dest)) return true;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(120000) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  return true;
}

const baseinfo = await fetch(
  `https://pano.autohome.com.cn/api/ext/baseinfo/${PANO_EXT_ID}?src=m&category=car`,
  { headers },
).then((r) => r.json());

const colorInfo = (baseinfo.color_info ?? []).filter((c) => COLOR_IDS.has(String(c.ColorId)));
console.log(`Colors to download: ${colorInfo.length}`);

const pano360Colors = [];

for (const color of colorInfo) {
  const id = String(color.ColorId);
  const name = color.ColorName ?? `Color ${id}`;
  const hex = `#${String(color.ColorValue ?? "888888").replace(/^#/, "")}`;
  const frames = color.Hori?.Normal ?? [];
  const localFrames = [];

  console.log(`\n${name} (${id}) — ${frames.length} frames`);

  for (let i = 0; i < frames.length; i++) {
    const url = panoUrl(frames[i].Url);
    const file = filenameFromUrl(url);
    const dest = path.join(publicRoot, id, file);
    const publicPath = `/cars/${CAR_ID}/panovr/${id}/${file}`;
    try {
      await download(url, dest);
      localFrames.push(publicPath);
      process.stdout.write(".");
    } catch (e) {
      console.error("\nFAIL", url, e.message);
      localFrames.push(url);
    }
  }

  pano360Colors.push({ id, name, hex, frames: localFrames });
}

// Белый первым в списке
pano360Colors.sort((a, b) => {
  const order = ["1175", "11477", "7188"];
  return order.indexOf(a.id) - order.indexOf(b.id);
});

const data = JSON.parse(fs.readFileSync(imagesJsonPath, "utf8"));
data[CAR_ID] = {
  ...data[CAR_ID],
  panovr: pano360Colors[0]?.frames ?? [],
  pano360Colors,
};
fs.writeFileSync(imagesJsonPath, JSON.stringify(data, null, 2) + "\n");
console.log("\nUpdated car-images.json:", pano360Colors.map((c) => `${c.name} (${c.frames.length})`).join(", "));
