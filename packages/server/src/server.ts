import { createApp } from "./router.js";

const port = parseInt(Bun.env["PORT"] ?? "3000", 10);

createApp().listen(port, () => {
  console.log(`HTSA server running on http://localhost:${port}`);
  console.log(`Swagger UI:          http://localhost:${port}/swagger`);
});
