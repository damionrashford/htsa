import { teal, violet, amber, border, fg, fgDim, fgMuted, alpha } from "@/lib/tokens";

const providers = [
  {
    name: "OpenAI",
    color: "oklch(0.78 0.18 196)",
    abbr: "OAI",
    snippet: `{ baseUrl: "https://api.openai.com/v1", apiKey: "sk-...", model: "gpt-4o" }`,
  },
  {
    name: "Anthropic",
    note: "via OpenRouter",
    color: "oklch(0.72 0.18 296)",
    abbr: "ANT",
    snippet: `{ baseUrl: "https://openrouter.ai/api/v1", apiKey: "sk-or-...", model: "anthropic/claude-sonnet-4-20250514" }`,
  },
  {
    name: "Groq",
    color: "oklch(0.72 0.18 155)",
    abbr: "GRQ",
    snippet: `{ baseUrl: "https://api.groq.com/openai/v1", apiKey: "gsk_...", model: "llama-3.3-70b-versatile" }`,
  },
  {
    name: "Mistral",
    color: amber,
    abbr: "MST",
    snippet: `{ baseUrl: "https://api.mistral.ai/v1", apiKey: "...", model: "mistral-large-latest" }`,
  },
  {
    name: "Ollama",
    note: "local",
    color: "oklch(0.65 0.22 25)",
    abbr: "OLL",
    snippet: `{ baseUrl: "http://localhost:11434/v1", model: "llama3" }`,
  },
];

export function ProvidersSection() {
  return (
    <div className="mb-10 sm:mb-16">
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>
        Supported providers — any OpenAI-compatible endpoint
      </p>
      <div className="space-y-2">
        {providers.map(({ name, note, color, abbr, snippet }) => (
          <div
            key={name}
            className="rounded-lg border overflow-hidden"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: alpha(color, 13),
              transition: "border-color 150ms cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = alpha(color, 33); }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = alpha(color, 13); }}
          >
            <div className="flex items-center gap-3 px-4 py-2.5 border-b" style={{ borderColor: border, backgroundColor: "var(--color-code-bar)" }}>
              <span
                className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                style={{ backgroundColor: alpha(color, 11), color }}
              >
                {abbr}
              </span>
              <span className="text-sm font-medium" style={{ color: fg }}>{name}</span>
              {note && <span className="text-xs" style={{ color: fgMuted }}>{note}</span>}
            </div>
            <div className="px-4 py-3">
              <code className="text-xs font-mono break-all" style={{ color: teal }}>{snippet}</code>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs" style={{ color: fgDim }}>
        Pass <code className="font-mono" style={{ color: violet }}>apiKey: undefined</code> for providers that don't require auth (Ollama, local endpoints).
      </p>
    </div>
  );
}
