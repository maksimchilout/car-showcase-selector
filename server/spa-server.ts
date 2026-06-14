/**
 * Продакшен: статика из dist/ + POST /api/lead (Bitrix).
 * Запуск: npm run build && npm run start
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

import { handleLeadRequest } from "../src/lib/lead-handler";

config();

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const distDir = join(__dirname, "../dist");
const port = Number(process.env.PORT) || 4173;

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

function readBody(req: import("node:http").IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(Buffer.from(c)));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

async function serveFile(pathname: string): Promise<{ body: Buffer; type: string } | null> {
  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  let filePath = join(distDir, safe === "/" ? "index.html" : safe);

  if (existsSync(filePath) && !extname(filePath)) {
    const withHtml = `${filePath}.html`;
    if (existsSync(withHtml)) filePath = withHtml;
  }

  if (!existsSync(filePath) || !filePath.startsWith(distDir)) {
    filePath = join(distDir, "index.html");
  }

  const body = await readFile(filePath);
  const type = MIME[extname(filePath)] ?? "application/octet-stream";
  return { body, type };
}

if (!existsSync(join(distDir, "index.html"))) {
  console.error("dist/index.html not found. Run: npm run build");
  process.exit(1);
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  if (url.pathname === "/api/lead" && req.method === "POST") {
    try {
      const body = await readBody(req);
      await handleLeadRequest(body);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Lead submit failed";
      console.error("[api/lead]", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: message }));
    }
    return;
  }

  try {
    const file = await serveFile(url.pathname);
    if (!file) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": file.type });
    res.end(file.body);
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end("Server error");
  }
}).listen(port, () => {
  console.log(`Citroën SPA: http://localhost:${port}`);
});
