import type { Connect } from "vite";
import type { Plugin } from "vite";
import { loadEnv } from "vite";

function readBody(req: Connect.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function attachLeadApi(middlewares: Connect.Server, mode: string) {
  const env = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(env)) {
    if (value !== undefined) process.env[key] = value;
  }

  middlewares.use(async (req, res, next) => {
    const url = req.url?.split("?")[0];
    if (url !== "/api/lead" || req.method !== "POST") {
      next();
      return;
    }

    try {
      const body = await readBody(req);
      const { handleLeadRequest } = await import("../src/lib/lead-handler");
      await handleLeadRequest(body);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ ok: true }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Lead submit failed";
      console.error("[api/lead]", error);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: message }));
    }
  });
}

export function leadApiPlugin(): Plugin {
  return {
    name: "citroen-lead-api",
    configureServer(server) {
      attachLeadApi(server.middlewares, server.config.mode);
    },
    configurePreviewServer(server) {
      attachLeadApi(server.middlewares, server.config.mode);
    },
  };
}
