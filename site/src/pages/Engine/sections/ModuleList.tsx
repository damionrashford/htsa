import { teal, violet, amber, fgDim, fgMuted, alpha } from "@/lib/tokens";

const groups = [
  {
    pkg: "src/",
    label: "Core",
    color: teal,
    modules: [
      { file: "Investigation.ts", what: "Orchestrator tying all modules together" },
      { file: "Serialization.ts", what: "JSON round-trip for full investigation state" },
      { file: "Export.ts", what: "Markdown rendering matching FRAMEWORK.md templates" },
    ],
  },
  {
    pkg: "core/",
    label: "Types",
    color: "oklch(0.68 0.22 272)",
    modules: [
      { file: "enums.ts", what: "All enumerations — zero dependencies" },
      { file: "models.ts", what: "Evidence, Node, DepthCriteria, Resolution, SituationMap" },
      { file: "graph.ts", what: "DAG structure, convergence detection" },
    ],
  },
  {
    pkg: "analysis/",
    label: "Analysis",
    color: "oklch(0.72 0.18 155)",
    modules: [
      { file: "probability.ts", what: "Bayesian updates, entropy tracking, pruning with recovery" },
      { file: "search.ts", what: "Best-First (live priority), DFS (stack), BFS (queue)" },
      { file: "bias.ts", what: "7 cognitive hazard detectors (warning + blocking alerts)" },
      { file: "evidence.ts", what: "Tier classification, temporal firewall, conflict detection" },
      { file: "budget.ts", what: "KL-based evidence budget: how many Tier-1 items are needed?" },
      { file: "heredity.ts", what: "BayesFLo ancestor-informed prior propagation" },
    ],
  },
  {
    pkg: "causation/",
    label: "Causation",
    color: amber,
    modules: [
      { file: "counterfactual.ts", what: "HP2015 W-partition + NESS three-stage test" },
      { file: "pns.ts", what: "PN, PS, PNS bounds — causation strength scoring" },
      { file: "graded.ts", what: "causalGrade = PNS × (1 − normality)" },
      { file: "intervention.ts", what: "Minimal intervention set via coverage optimization" },
    ],
  },
  {
    pkg: "resolution/",
    label: "Resolution",
    color: violet,
    modules: [
      { file: "engine.ts", what: "Fix/mitigate/accept, counterfactual test, priority scoring" },
      { file: "verification.ts", what: "Verification windows, learning loop" },
    ],
  },
  {
    pkg: "llm/",
    label: "LLM",
    color: "oklch(0.72 0.18 296)",
    modules: [
      { file: "client.ts", what: "Provider-agnostic chat completions client (fetch only)" },
      { file: "prompts.ts", what: "System prompt + prompt builders for each judgment type" },
      { file: "advisor.ts", what: "LLMAdvisor — fills judgment slots, drives auto-investigation" },
    ],
  },
];

export function ModuleList() {
  return (
    <div>
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>
        Package structure
      </p>
      <div className="space-y-3">
        {groups.map(({ pkg, label, color, modules }) => (
          <div key={pkg} className="rounded-xl border overflow-hidden" style={{ borderColor: alpha(color, 19) }}>
            <div
              className="flex items-center gap-3 px-4 py-2 border-b"
              style={{ backgroundColor: alpha(color, 6), borderColor: alpha(color, 19) }}
            >
              <span
                className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                style={{ backgroundColor: alpha(color, 11), color }}
              >
                {label}
              </span>
              <code className="text-xs font-mono" style={{ color: fgDim }}>{pkg}</code>
            </div>
            <div>
              {modules.map((m, i) => (
                <div
                  key={m.file}
                  className="flex items-start gap-4 px-4 py-2.5 text-xs border-b last:border-b-0"
                  style={{ backgroundColor: i % 2 === 0 ? "var(--color-code-bg)" : "var(--color-code-bar)", borderColor: alpha(color, 9) }}
                >
                  <code className="font-mono shrink-0" style={{ color }}>{m.file}</code>
                  <span className="leading-relaxed" style={{ color: fgMuted }}>{m.what}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
