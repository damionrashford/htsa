#!/usr/bin/env bun
import { investigate } from "./commands/investigate.js";
import { run } from "./commands/run.js";
import { exportCmd } from "./commands/export.js";

const args = Bun.argv.slice(2);
const cmd = args[0];

const USAGE = `htsa — probabilistic root cause analysis

Commands:
  investigate <problem>    Start an interactive investigation session
  run <problem>            Auto-investigate using LLM (requires HTSA_API_KEY)
  export <file.json>       Export a saved investigation to Markdown

Options:
  --help, -h               Show this help
  --version, -v            Print version

Environment (for 'run'):
  HTSA_API_KEY             API key for the LLM provider
  HTSA_BASE_URL            LLM base URL (default: https://api.openai.com/v1)
  HTSA_MODEL               Model name (default: gpt-4o)
`;

if (!cmd || cmd === "--help" || cmd === "-h") {
  console.log(USAGE);
  process.exit(0);
}

if (cmd === "--version" || cmd === "-v") {
  console.log("2.0.0");
  process.exit(0);
}

try {
  switch (cmd) {
    case "investigate":
      await investigate(args.slice(1));
      break;
    case "run":
      await run(args.slice(1));
      break;
    case "export":
      await exportCmd(args.slice(1));
      break;
    default:
      console.error(`Unknown command: ${cmd}\n`);
      console.log(USAGE);
      process.exit(1);
  }
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`Error: ${msg}`);
  process.exit(1);
}
