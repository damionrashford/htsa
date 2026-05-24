import tailwind from "bun-plugin-tailwind";
import { copyFile } from "node:fs/promises";
import { join } from "node:path";

const outdir = join(import.meta.dir, "../docs");

console.log("Building HTSA site...");

const result = await Bun.build({
  entrypoints: [join(import.meta.dir, "index.html")],
  outdir,
  minify: true,
  plugins: [tailwind],
});

if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}

// Copy index.html to 404.html for GitHub Pages SPA routing
await copyFile(join(outdir, "index.html"), join(outdir, "404.html"));

console.log(`Built ${result.outputs.length} files to docs/`);
console.log("Copied index.html → 404.html for GitHub Pages SPA routing");
