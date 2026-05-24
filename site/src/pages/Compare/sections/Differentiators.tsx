import { teal, violet, border, card, fgDim, fgMuted } from "@/lib/tokens";

const differentiators = [
  {
    title: "Works without observability data",
    color: teal,
    detail: "PyRCA and DoWhy require structured metrics or data frames. HTSA works from a plain-language description of the problem — no Prometheus, no data warehouse required. Logs, memory, and human observation are enough.",
  },
  {
    title: "Human-driven investigation, not ML attribution",
    color: violet,
    detail: "ML-based RCA (BARO, PyRCA) identifies statistical correlations in metric time series. HTSA is structured argumentation — you build a causal case with evidence, not a model that predicts blame. Both are useful. They solve different problems.",
  },
  {
    title: "Cross-domain by design",
    color: teal,
    detail: "PyRCA is AIOps-specific. DoWhy is academic statistics. HTSA was designed from the start to apply to SRE incidents, medical diagnosis, security breaches, business bottlenecks, legal investigations, and personal decisions.",
  },
  {
    title: "Causal proof, not correlation",
    color: violet,
    detail: "Correlation-based RCA correctly identifies the anomalous node but cannot prove it caused the outcome. HTSA uses HP2015 W-partition + NESS to formally prove actual causation, and PNS to quantify causation strength.",
  },
  {
    title: "Built-in LLM integration",
    color: teal,
    detail: "No other RCA tool ships with built-in LLM integration that works with any OpenAI-compatible endpoint. The LLMAdvisor fills the judgment slots (hypothesis generation, evidence classification, depth criteria) while the engine enforces the math.",
  },
];

export function Differentiators() {
  return (
    <div className="mb-16">
      <p className="text-xs font-mono uppercase tracking-widest mb-6" style={{ color: fgDim }}>
        The key differences
      </p>
      <div className="space-y-4">
        {differentiators.map(({ title, color, detail }) => (
          <div
            key={title}
            className="rounded-xl p-6 border"
            style={{ backgroundColor: card, borderColor: border }}
          >
            <h3
              className="text-base font-semibold mb-2"
              style={{ color: "#dce4f5", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span style={{ color }}>›</span> {title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: fgMuted }}>{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
