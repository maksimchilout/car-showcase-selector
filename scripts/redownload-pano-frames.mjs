import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const PANO_EXT_ID = "5863";
const imagesJsonPath = path.join(root, "src/lib/car-images.json");

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  Referer: "https://pano.autohome.com.cn/",
};

/** frameIndex: 0-based; frameNumber = index + 1 */
const FIXES = [
  {
    colorId: "1175",
    frameIndex: 13,
    frameNumber: 14,
    legacyCopy: path.join(root, "public/cars/4370/panovr/ChxoHmhSknSAFxhgABHeqsF8yoc750.png"),
  },
  { colorId: "7188", frameIndex: 22, frameNumber: 23 },
];

function panoUrl(rel) {
  const p = rel.replace(/\.png\.png$/i, ".png").replace(/1200x0_/, "2400x0_");
  return `https://img3.autoimg.cn/pano/${p}`;
}

function filenameFromUrl(url) {
  const hash = url.match(/autohomecar__([A-Za-z0-9_-]+)/);
  return hash ? `${hash[1]}.png` : `frame.png`;
}

async function download(url, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(120000) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const tmp = `${dest}.download`;
  fs.writeFileSync(tmp, Buffer.from(await res.arrayBuffer()));
  fs.renameSync(tmp, dest);
}

const baseinfo = await fetch(
  `https://pano.autohome.com.cn/api/ext/baseinfo/${PANO_EXT_ID}?src=m&category=car`,
  { headers },
).then((r) => r.json());

const data = JSON.parse(fs.readFileSync(imagesJsonPath, "utf8"));
const colors = data["4370"].pano360Colors;

for (const fix of FIXES) {
  const color = baseinfo.color_info?.find((c) => String(c.ColorId) === fix.colorId);
  const entry = colors.find((c) => c.id === fix.colorId);
  if (!color || !entry) {
    console.error("Missing color", fix.colorId);
    continue;
  }

  const frameMeta = color.Hori?.Normal?.[fix.frameIndex];
  if (!frameMeta?.Url) {
    console.error("Missing API frame", fix.colorId, fix.frameNumber);
    continue;
  }

  const file = filenameFromUrl(frameMeta.Url);
  const dest = path.join(root, "public/cars/4370/panovr", fix.colorId, file);
  const publicPath = `/cars/4370/panovr/${fix.colorId}/${file}`;
  const url = panoUrl(frameMeta.Url);

  console.log(`\n${fix.colorId} frame ${fix.frameNumber}: ${file}`);

  if (fix.legacyCopy && fs.existsSync(fix.legacyCopy)) {
    fs.copyFileSync(fix.legacyCopy, dest);
    console.log(`  copied legacy ${path.basename(fix.legacyCopy)} (${fs.statSync(dest).size} bytes)`);
  } else {
    await download(url, dest);
    console.log(`  downloaded (${fs.statSync(dest).size} bytes)`);
  }

  const idx = entry.frames.findIndex((p) => p.includes(file) || p.endsWith(`/${file}`));
  if (idx === -1) {
    entry.frames[fix.frameIndex] = publicPath;
  } else {
    entry.frames[idx] = publicPath;
  }
  if (fix.colorId === "1175") {
    data["4370"].panovr[fix.frameIndex] = publicPath;
  }
}

fs.writeFileSync(imagesJsonPath, JSON.stringify(data, null, 2) + "\n");
console.log("\nUpdated car-images.json");
