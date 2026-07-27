import fs from "node:fs";
import path from "node:path";
import http from "node:http";

export function serveStaticDirectory(options: {
  readonly rootDir: string;
  readonly host?: string;
  readonly port: number;
}): http.Server {
  const host = options.host ?? "127.0.0.1";
  const root = path.resolve(options.rootDir);

  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0] || "/");
    const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
    let filePath = path.join(root, safePath === path.sep ? "index.html" : safePath);
    if (safePath.endsWith(path.sep) || safePath === "/" || safePath === "\\") {
      filePath = path.join(root, "index.html");
    }
    if (!filePath.startsWith(root)) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      const index = path.join(filePath, "index.html");
      if (fs.existsSync(index)) filePath = index;
      else {
        res.writeHead(404).end("Not found");
        return;
      }
    }
    const ext = path.extname(filePath).toLowerCase();
    const type =
      ext === ".html"
        ? "text/html; charset=utf-8"
        : ext === ".json"
          ? "application/json; charset=utf-8"
          : ext === ".css"
            ? "text/css; charset=utf-8"
            : "text/plain; charset=utf-8";
    res.writeHead(200, { "Content-Type": type });
    fs.createReadStream(filePath).pipe(res);
  });

  server.listen(options.port, host);
  return server;
}
