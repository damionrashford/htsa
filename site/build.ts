import tailwind from "bun-plugin-tailwind";
import { copyFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const outdir = join(import.meta.dir, "dist");
const publicDir = join(import.meta.dir, "src", "public");

console.log("Building HTSA site...");

// Regenerate docs manifest before bundling
const genDocs = Bun.spawnSync(["bun", join(import.meta.dir, "scripts", "gen-docs.ts")]);
if (genDocs.exitCode !== 0) {
  console.error(genDocs.stderr.toString());
  process.exit(1);
}
console.log(genDocs.stdout.toString().trim());

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

// Copy static public files (robots.txt, sitemap.xml, llms.txt, etc.)
const publicFiles = await readdir(publicDir).catch(() => []);
await Promise.all(
  publicFiles.map((file) => copyFile(join(publicDir, file), join(outdir, file)))
);

console.log(`Built ${result.outputs.length} files to dist/`);
if (publicFiles.length > 0) {
  console.log(`Copied static files: ${publicFiles.join(", ")}`);
}
console.log("Copied index.html → 404.html for GitHub Pages SPA routing");
