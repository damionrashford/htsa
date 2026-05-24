# htsa

CLI for the [HTSA](../../FRAMEWORK.md) investigation algorithm. Run a structured root cause analysis from the terminal.

## Install

```sh
bun add -g htsa
# npm install -g htsa
```

Or run without installing:

```sh
bunx htsa investigate "API returning 500s since 2:47 AM"
```

## Commands

### `htsa investigate <problem>`

Interactive, step-by-step investigation. You drive every decision — the engine handles the math.

```sh
htsa investigate "Checkout service timing out for EU customers"
```

Walks through:
1. **5 Ws** — situation map
2. **5 Whys** — causal chain with Bayesian probability updates
3. **Resolution** — fix / mitigate / accept per root cause

Saves to `htsa-<timestamp>.json` when done.

### `htsa run <problem>`

Fully automatic investigation via LLM. Requires `HTSA_API_KEY`.

```sh
export HTSA_API_KEY=sk-...
export HTSA_BASE_URL=https://api.openai.com/v1   # default
export HTSA_MODEL=gpt-4o                          # default

htsa run "Database connection pool exhausted during deploy"
```

Outputs `htsa-report-<timestamp>.md` and `htsa-data-<timestamp>.json`.

Compatible with any OpenAI-compatible endpoint — OpenAI, Groq, Together, Mistral, Ollama, OpenRouter.

### `htsa export <file.json>`

Convert a saved investigation JSON to Markdown.

```sh
htsa export htsa-1234567890.json
# → htsa-1234567890.md
```

## Options

```
--help, -h     Show help
--version, -v  Print version
```

## License

MIT
