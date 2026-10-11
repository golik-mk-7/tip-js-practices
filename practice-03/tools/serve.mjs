import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = normalize(join(__dirname, ".."));
const PORT = Number(process.argv[2]) || 5503;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs":  "text/javascript; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".ico":  "image/x-icon",
};

const server = createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/") urlPath = "/index.html";

    const fullPath = normalize(join(ROOT, urlPath));

    if (!fullPath.startsWith(ROOT)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    const info = await stat(fullPath);
    if (info.isDirectory()) {
      res.writeHead(302, { Location: urlPath + "/" });
      res.end();
      return;
    }

    const data = await readFile(fullPath);
    const type = MIME[extname(fullPath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Сервер запущен: http://127.0.0.1:${PORT}/`);
  console.log("Остановить: Ctrl+C");
});