import { teal, violet, border, card, fgMuted } from "@/lib/tokens";

const foundations = [
  {
    num: "01", name: "Graph Theory", color: teal,
    what: "What is the structure of an investigation?",
    detail: "The Why tree is a directed acyclic graph (DAG). Nodes are causal claims. Edges are causal links. Convergent nodes — multiple paths pointing to the same cause — identify the most impactful root causes. G = (V, E, P, Ev).",
    math: "G = (V, E, P, Ev)",
  },
  {
    num: "02", name: "Exponential Problem Space", color: teal,
    what: "Why do investigations feel overwhelming?",
    detail: "Unstructured investigation explores b^d nodes where b is the branching factor and d is the depth. With b=3 and d=5, that's 243 paths. The framework tames this through evidence-based pruning and Bayesian ordering.",
    math: "|paths| ≤ b^d · (1 - θ)^k",
  },
  {
    num: "03", name: "Causal Inference", color: teal,
    what: "How do you prove something caused something else?",
    detail: "Correlation is not causation. Every Why claim must pass the counterfactual test: P(effect | do(¬cause)) ≠ P(effect | do(cause)). For overdetermination, apply the three-stage HP2015 W-partition test.",
    math: "do(¬C) ≠ do(C) → C is causal",
  },
  {
    num: "04", name: "Information Theory", color: teal,
    what: "How do you measure investigative progress?",
    detail: "Every correct Why answer reduces entropy H(G). Progress is the entropy drop from one step to the next. A good question is one that maximizes expected information gain across all possible answers.",
    math: "H(G) = -Σ P(vᵢ) · log₂ P(vᵢ)",
  },
  {
    num: "05", name: "Bayesian Reasoning", color: teal,
    what: "How do you weigh competing causes?",
    detail: "Start with priors based on base rates. Gather evidence. Update probabilities via Bayes' theorem. Sibling nodes are normalized to sum to 1.0 after every update. Converge on truth through evidence accumulation.",
    math: "P(v|e) = P(e|v)·P(v) / P(e)",
  },
  {
    num: "06", name: "Search Algorithms", color: violet,
    what: "How do you move through the Why tree?",
    detail: "DFS goes deep fast — best for time-constrained rapid-mode investigations. BFS goes wide first — best when completeness matters more than speed. Best-First follows probability — optimal for most investigations.",
    math: "Best-First: argmax P(v) at frontier",
  },
  {
    num: "07", name: "Cognitive Biases", color: violet,
    what: "What corrupts the investigation?",
    detail: "The math assumes a rational agent. Seven biases break this assumption: anchoring, confirmation bias, groupthink, availability heuristic, sunk cost, authority bias, and narrative fallacy. The engine detects all seven.",
    math: "7 detectors: warn + block modes",
  },
  {
    num: "08", name: "Evidence Evaluation", color: violet,
    what: "How do you know which evidence to trust?",
    detail: "Four tiers: Tier 1 physical/instrumental (logs, sensors), Tier 2 observational (direct witness), Tier 3 inferential (reasoned conclusion), Tier 4 testimonial/reconstructive (recalled). Only Tier 1–2 closes a node as Finding.",
    math: "tier ∈ {1, 2, 3, 4}, direction ∈ {↑, ↓}",
  },
  {
    num: "09", name: "Causation Theory", color: violet,
    what: "How do you classify and quantify actual causes?",
    detail: "Binary counterfactuals break on overdetermination and preemption. HP2015 W-partition + NESS (Necessary Element of a Sufficient Set) + PNS (Probability of Necessity and Sufficiency) give precise, quantitative actual causation.",
    math: "PNS = max(0, PN+PS-1) to min(PN, PS)",
  },
  {
    num: "10", name: "Intervention Theory", color: violet,
    what: "How do you find the minimal set of fixes?",
    detail: "Root cause is formalized as do(fix(C)) → outcome restoration. The minimal intervention set is the smallest set of fixes S achieving coverage ≥ θ, where coverage(S) = 1 - ∏(1 - PNSᵢ).",
    math: "coverage(S) = 1 - ∏(1 - PNSᵢ) ≥ θ",
  },
];

export function FoundationsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {foundations.map((f) => (
        <div
          key={f.num}
          className="rounded-xl p-6 border transition-all"
          style={{ backgroundColor: card, borderColor: border }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${f.color}50`; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = border; }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-xs font-mono" style={{ color: f.color }}>{f.num}</span>
              <h3
                className="text-lg font-semibold mt-0.5"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}
              >
                {f.name}
              </h3>
              <p className="text-sm" style={{ color: fgMuted }}>{f.what}</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed mb-4" style={{ color: fgMuted }}>{f.detail}</p>
          <div
            className="rounded px-3 py-2 font-mono text-xs"
            style={{ backgroundColor: "#080d1a", border: `1px solid ${border}`, color: f.color }}
          >
            {f.math}
          </div>
        </div>
      ))}
    </div>
  );
}
