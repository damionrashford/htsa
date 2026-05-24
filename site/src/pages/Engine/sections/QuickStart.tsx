import { border, fgDim } from "@/lib/tokens";

const SNIPPET = `from htsa_engine.llm import LLMAdvisor

advisor = LLMAdvisor("https://api.openai.com/v1", api_key="sk-...", model="gpt-4o")

# One call — all 4 layers
inv = advisor.run("API returning 500 errors since 2:47 AM, EU region only")

print(f"Root causes: {[n.statement for n in inv.root_causes]}")
print(f"Entropy: {inv.entropy:.3f}")

inv.save("investigation.json")
inv.save_markdown("investigation.md")`;

export function QuickStart() {
  return (
    <div className="mb-16">
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>
        Quick start — with an LLM (easiest)
      </p>
      <pre
        className="text-sm"
        style={{ backgroundColor: "#080d1a", border: `1px solid ${border}`, borderRadius: 10, padding: "1.25rem 1.5rem" }}
      >
        {SNIPPET}
      </pre>
    </div>
  );
}
