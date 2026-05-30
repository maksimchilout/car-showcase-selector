import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const TARGET_DIRS = [
  path.join(root, "public/cars/4370/panovr/1175"),
  path.join(root, "public/cars/4370/panovr/7188"),
];

const WHITE_MIN = 235;
const ROW_WHITE_RATIO = 0.92;

async function stripTopWhite(filePath) {
  const img = sharp(filePath);
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  let strippedRows = 0;

  for (let y = 0; y < height; y++) {
    let white = 0;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r >= WHITE_MIN && g >= WHITE_MIN && b >= WHITE_MIN) white++;
    }
    if (white / width < ROW_WHITE_RATIO) break;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      data[i + 3] = 0;
    }
    strippedRows++;
  }

  if (strippedRows === 0) return false;

  const tmp = `${filePath}.tmp`;
  await sharp(data, { raw: { width, height, channels: 4 } }).png().toFile(tmp);
  fs.renameSync(tmp, filePath);
  return strippedRows;
}

for (const dir of TARGET_DIRS) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".png"));
  for (const file of files) {
    const full = path.join(dir, file);
    const rows = await stripTopWhite(full);
    if (rows) console.log(`fixed ${path.relative(root, full)}: ${rows} rows`);
  }
}

console.log("done");
