import { teal, violet, amber, border, fgDim, fgMuted } from "@/lib/tokens";

const providers = [
  {
    name: "OpenAI",
    color: "oklch(0.78 0.18 196)",
    abbr: "OAI",
    snippet: `LLMAdvisor("https://api.openai.com/v1", api_key="sk-...", model="gpt-4o")`,
  },
  {
    name: "Anthropic",
    note: "via OpenRouter",
    color: "oklch(0.72 0.18 296)",
    abbr: "ANT",
    snippet: `LLMAdvisor("https://openrouter.ai/api/v1", api_key="sk-or-...", model="anthropic/claude-sonnet-4-20250514")`,
  },
  {
    name: "Groq",
    color: "oklch(0.72 0.18 155)",
    abbr: "GRQ",
    snippet: `LLMAdvisor("https://api.groq.com/openai/v1", api_key="gsk_...", model="llama-3.3-70b-versatile")`,
  },
  {
    name: "Mistral",
    color: amber,
    abbr: "MST",
    snippet: `LLMAdvisor("https://api.mistral.ai/v1", api_key="...", model="mistral-large-latest")`,
  },
  {
    name: "Ollama",
    note: "local",
    color: "oklch(0.65 0.22 25)",
    abbr: "OLL",
    snippet: `LLMAdvisor("http://localhost:11434/v1", model="llama3")`,
  },
];

export function ProvidersSection() {
  return (
    <div className="mb-16">
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>
        Supported providers — any OpenAI-compatible endpoint
      </p>
      <div className="space-y-2">
        {providers.map(({ name, note, color, abbr, snippet }) => (
          <div
            key={name}
            className="rounded-lg border overflow-hidden"
            style={{ backgroundColor: "#080d1a", borderColor: `${color}22` }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}55`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}22`; }}
          >
            <div className="flex items-center gap-3 px-4 py-2.5 border-b" style={{ borderColor: border, backgroundColor: "#0a1020" }}>
              <span
                className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                style={{ backgroundColor: `${color}18`, color }}
              >
                {abbr}
              </span>
              <span className="text-sm font-medium" style={{ color: "#dce4f5" }}>{name}</span>
              {note && <span className="text-xs" style={{ color: fgMuted }}>{note}</span>}
            </div>
            <div className="px-4 py-3">
              <code className="text-xs font-mono break-all" style={{ color: teal }}>{snippet}</code>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs" style={{ color: fgDim }}>
        Pass <code className="font-mono" style={{ color: violet }}>api_key=None</code> for providers that don't require auth (Ollama, local endpoints).
      </p>
    </div>
  );
}
