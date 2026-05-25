#!/usr/bin/env bun
/**
 * gen-docs.ts — Walk docs/ and emit src/lib/docs-manifest.json
 *
 * Each entry carries: id, title, slug, section, path (relative to docs/), content (raw markdown).
 * Run before every dev start or build:
 *   bun site/scripts/gen-docs.ts
 */

import { readdir, readFile } from "node:fs/promises";
import { join, relative, basename } from "node:path";

const DOCS_ROOT = join(import.meta.dir, "..", "..", "docs");
const OUT = join(import.meta.dir, "..", "src", "lib", "docs-manifest.json");

interface DocEntry {
  id: string;
  title: string;
  slug: string;
  section: string;
  path: string;
  content: string;
  order: number;
}

function titleFromMarkdown(content: string, filename: string): string {
  // HTSA docs use <h1 align="center">Title</h1> — check that first
  const htmlH1 = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (htmlH1) return htmlH1[1].trim();
  // Standard markdown heading
  const mdH1 = content.match(/^#\s+(.+)$/m);
  if (mdH1) return mdH1[1].replace(/<[^>]+>/g, "").trim();
  // Fall back to filename
  return basename(filename, ".md")
    .replace(/^\d+[-_]/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

function orderFromFilename(name: string): number {
  const m = name.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : 999;
}

async function walkMd(dir: string, section: string): Promise<DocEntry[]> {
  const entries: DocEntry[] = [];
  const items = await readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const full = join(dir, item.name);
    if (item.isDirectory()) {
      if (item.name === "assets") continue;
      const sub = await walkMd(full, item.name);
      entries.push(...sub);
    } else if (item.name.endsWith(".md")) {
      // Skip README.md in subdirectories (duplicate of section title)
      if (item.name === "README.md" && section !== "root") continue;
      const content = await readFile(full, "utf-8");
      const rel = relative(DOCS_ROOT, full).replace(/\\/g, "/");
      const slug = rel.replace(/\.md$/, "").replace(/\//g, "--");
      // Override title for framework.md (the actual h1 is the 5W formula, not useful as nav label)
      let title = titleFromMarkdown(content, item.name);
      if (item.name === "framework.md") title = "The Framework";
      entries.push({ id: slug, title, slug, section, path: rel, content, order: orderFromFilename(item.name) });
    }
  }

  return entries;
}

const docs = await walkMd(DOCS_ROOT, "root");
docs.sort((a, b) => {
  if (a.section !== b.section) return a.section.localeCompare(b.section);
  return a.order - b.order;
});

await Bun.write(OUT, JSON.stringify({ docs, generated: new Date().toISOString() }, null, 2));
console.log(`gen-docs: wrote ${docs.length} entries → src/lib/docs-manifest.json`);
