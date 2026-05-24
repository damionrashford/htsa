import { route } from "./router.js";

const port = parseInt(Bun.env["PORT"] ?? "3000", 10);

Bun.serve({
  port,
  async fetch(req) {
    // CORS for local dev
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }
    const res = await route(req);
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  },
  error(err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  },
});

console.log(`HTSA server running on http://localhost:${port}`);
