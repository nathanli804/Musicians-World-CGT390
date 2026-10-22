// Local stand-in for Vercel Functions: serves /api/* using the same handler files.
// Run with `npm run dev:api`; Vite proxies /api here (see vite.config.js).
import http from "node:http";
import createOrList from "../api/lesson-requests/index.js";
import byId from "../api/lesson-requests/[id].js";

const PORT = Number(process.env.API_PORT || 3001);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  req.query = Object.fromEntries(url.searchParams);
  try {
    if (url.pathname === "/api/lesson-requests") return await createOrList(req, res);
    const m = url.pathname.match(/^\/api\/lesson-requests\/([^/]+)$/);
    if (m) {
      req.query.id = decodeURIComponent(m[1]);
      return await byId(req, res);
    }
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "not_found" }));
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "server_error" }));
  }
});

server.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
