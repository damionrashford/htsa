import { teal, violet, amber, fgDim, fgMuted } from "@/lib/tokens";

const groups = [
  {
    pkg: "htsa_engine/",
    label: "Core",
    color: teal,
    modules: [
      { file: "investigation.py", what: "Orchestrator tying all modules together" },
      { file: "serialization.py", what: "JSON round-trip for full investigation state" },
      { file: "export.py", what: "Markdown rendering matching FRAMEWORK.md templates" },
    ],
  },
  {
    pkg: "core/",
    label: "Types",
    color: "oklch(0.68 0.22 272)",
    modules: [
      { file: "enums.py", what: "All enumerations — zero dependencies" },
      { file: "models.py", what: "Evidence, Node, DepthCriteria, Resolution, SituationMap" },
      { file: "graph.py", what: "DAG structure, convergence detection" },
    ],
  },
  {
    pkg: "analysis/",
    label: "Analysis",
    color: "oklch(0.72 0.18 155)",
    modules: [
      { file: "probability.py", what: "Bayesian updates, entropy tracking, pruning with recovery" },
      { file: "search.py", what: "Best-First (live priority), DFS (stack), BFS (queue)" },
      { file: "bias.py", what: "7 cognitive hazard detectors (warning + blocking alerts)" },
      { file: "evidence.py", what: "Tier classification, temporal firewall, conflict detection" },
      { file: "budget.py", what: "KL-based evidence budget: how many Tier-1 items are needed?" },
      { file: "heredity.py", what: "BayesFLo ancestor-informed prior propagation" },
    ],
  },
  {
    pkg: "causation/",
    label: "Causation",
    color: amber,
    modules: [
      { file: "counterfactual.py", what: "HP2015 W-partition + NESS three-stage test" },
      { file: "pns.py", what: "PN, PS, PNS bounds — causation strength scoring" },
      { file: "graded.py", what: "causal_grade = PNS × (1 − normality)" },
      { file: "intervention.py", what: "Minimal intervention set via coverage optimization" },
    ],
  },
  {
    pkg: "resolution/",
    label: "Resolution",
    color: violet,
    modules: [
      { file: "engine.py", what: "Fix/mitigate/accept, counterfactual test, priority scoring" },
      { file: "verification.py", what: "Verification windows, learning loop" },
    ],
  },
  {
    pkg: "llm/",
    label: "LLM",
    color: "oklch(0.72 0.18 296)",
    modules: [
      { file: "client.py", what: "Provider-agnostic chat completions client (stdlib only)" },
      { file: "prompts.py", what: "System prompt + prompt builders for each judgment type" },
      { file: "advisor.py", what: "LLMAdvisor — fills judgment slots, drives auto-investigation" },
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
          <div key={pkg} className="rounded-xl border overflow-hidden" style={{ borderColor: `${color}30` }}>
            <div
              className="flex items-center gap-3 px-4 py-2 border-b"
              style={{ backgroundColor: `${color}0a`, borderColor: `${color}30` }}
            >
              <span
                className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                style={{ backgroundColor: `${color}18`, color }}
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
                  style={{ backgroundColor: i % 2 === 0 ? "#080d1a" : "#0a1020", borderColor: `${color}15` }}
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
