import { teal, border, card, fgDim, fgMuted } from "@/lib/tokens";

const modules = [
  { pkg: "core/", module: "enums.py", what: "All enumerations — zero dependencies" },
  { pkg: "core/", module: "models.py", what: "Evidence, Node, DepthCriteria, Resolution, SituationMap" },
  { pkg: "core/", module: "graph.py", what: "DAG structure, convergence detection" },
  { pkg: "analysis/", module: "probability.py", what: "Bayesian updates, entropy tracking, pruning with recovery" },
  { pkg: "analysis/", module: "search.py", what: "Best-First (live priority), DFS (stack), BFS (queue)" },
  { pkg: "analysis/", module: "bias.py", what: "7 cognitive hazard detectors (warning + blocking alerts)" },
  { pkg: "analysis/", module: "evidence.py", what: "Tier classification, temporal firewall, conflict detection" },
  { pkg: "analysis/", module: "budget.py", what: "KL-based evidence budget: how many Tier-1 items are needed?" },
  { pkg: "analysis/", module: "heredity.py", what: "BayesFLo ancestor-informed prior propagation" },
  { pkg: "causation/", module: "counterfactual.py", what: "HP2015 W-partition + NESS three-stage test" },
  { pkg: "causation/", module: "pns.py", what: "PN, PS, PNS bounds — causation strength scoring" },
  { pkg: "causation/", module: "graded.py", what: "causal_grade = PNS × (1 - normality)" },
  { pkg: "causation/", module: "intervention.py", what: "Minimal intervention set via coverage optimization" },
  { pkg: "resolution/", module: "engine.py", what: "Fix/mitigate/accept, counterfactual test, priority scoring" },
  { pkg: "resolution/", module: "verification.py", what: "Verification windows, learning loop" },
  { pkg: "llm/", module: "client.py", what: "Provider-agnostic chat completions client (stdlib only)" },
  { pkg: "llm/", module: "prompts.py", what: "System prompt + prompt builders for each judgment type" },
  { pkg: "llm/", module: "advisor.py", what: "LLMAdvisor — fills judgment slots, drives auto-investigation" },
  { pkg: "", module: "investigation.py", what: "Orchestrator tying all modules together" },
  { pkg: "", module: "serialization.py", what: "JSON round-trip for full investigation state" },
  { pkg: "", module: "export.py", what: "Markdown rendering matching FRAMEWORK.md templates" },
];

export function ModuleList() {
  return (
    <div>
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>
        Package structure
      </p>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: border }}>
        {modules.map((m, i) => (
          <div
            key={`${m.pkg}${m.module}`}
            className="flex items-center gap-3 px-4 py-2.5 border-b last:border-b-0 text-xs"
            style={{ backgroundColor: i % 2 === 0 ? card : "#0d1525", borderColor: border }}
          >
            {m.pkg && <span style={{ color: fgDim }}>{m.pkg}</span>}
            <code className="font-mono" style={{ color: teal }}>{m.module}</code>
            <span className="ml-auto text-right max-w-xs" style={{ color: fgMuted }}>{m.what}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
