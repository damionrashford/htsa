import { fromJson, toMarkdown } from "@htsa/core";

export async function exportCmd(args: string[]): Promise<void> {
  const file = args[0];
  if (!file) {
    console.error("Usage: htsa export <file.json>");
    process.exit(1);
  }

  const json = await Bun.file(file).text();
  const inv = fromJson(json);
  const md = toMarkdown(inv);

  const outFile = file.replace(/\.json$/, ".md");
  await Bun.write(outFile, md);
  console.log(`Exported: ${outFile}`);
}
