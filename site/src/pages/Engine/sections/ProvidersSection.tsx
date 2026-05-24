import { teal, border, card, fgDim, fgMuted } from "@/lib/tokens";

const providers = [
  { name: "OpenAI", snippet: `LLMAdvisor("https://api.openai.com/v1", api_key="sk-...", model="gpt-4o")` },
  { name: "Anthropic (OpenRouter)", snippet: `LLMAdvisor("https://openrouter.ai/api/v1", api_key="sk-or-...", model="anthropic/claude-sonnet-4-20250514")` },
  { name: "Groq", snippet: `LLMAdvisor("https://api.groq.com/openai/v1", api_key="gsk_...", model="llama-3.3-70b-versatile")` },
  { name: "Mistral", snippet: `LLMAdvisor("https://api.mistral.ai/v1", api_key="...", model="mistral-large-latest")` },
  { name: "Ollama (local)", snippet: `LLMAdvisor("http://localhost:11434/v1", model="llama3")` },
];

export function ProvidersSection() {
  return (
    <div className="mb-16">
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>
        Supported providers (any OpenAI-compatible endpoint)
      </p>
      <div className="space-y-2">
        {providers.map(({ name, snippet }) => (
          <div key={name} className="rounded-lg p-4 border" style={{ backgroundColor: card, borderColor: border }}>
            <div className="text-xs font-medium mb-2" style={{ color: fgMuted }}>{name}</div>
            <pre className="text-xs overflow-x-auto" style={{ margin: 0, color: teal }}>{snippet}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
