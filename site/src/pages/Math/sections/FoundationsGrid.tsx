import { teal, violet, border, card, fg, fgMuted, fgDim, alpha } from "@/lib/tokens";

const foundations = [
  {
    num: "01", name: "Graph Theory", color: teal,
    what: "What is the structure of an investigation?",
    detail: "The Why tree is a directed acyclic graph (DAG). Nodes are causal claims. Edges are causal links. Convergent nodes identify the most impactful root causes.",
    math: "G = (V, E, P, Ev)",
    category: "Foundation",
  },
  {
    num: "02", name: "Exponential Problem Space", color: teal,
    what: "Why do investigations feel overwhelming?",
    detail: "Unstructured investigation explores b^d nodes. With b=3 and d=5, that's 243 paths. The framework tames this through evidence-based pruning and Bayesian ordering.",
    math: "|paths| ≤ b^d · (1 − θ)^k",
    category: "Foundation",
  },
  {
    num: "03", name: "Causal Inference", color: teal,
    what: "How do you prove something caused something else?",
    detail: "Correlation is not causation. Every Why claim must pass the counterfactual test. For overdetermination, apply the three-stage HP2015 W-partition test.",
    math: "do(¬C) ≠ do(C) → C is causal",
    category: "Foundation",
  },
  {
    num: "04", name: "Information Theory", color: teal,
    what: "How do you measure investigative progress?",
    detail: "Every correct Why answer reduces entropy H(G). A good question is one that maximizes expected information gain across all possible answers.",
    math: "H(G) = −Σ P(vᵢ) · log₂ P(vᵢ)",
    category: "Foundation",
  },
  {
    num: "05", name: "Bayesian Reasoning", color: teal,
    what: "How do you weigh competing causes?",
    detail: "Start with priors based on base rates. Gather evidence. Update probabilities via Bayes' theorem. Sibling nodes are normalized to sum to 1.0 after every update.",
    math: "P(v|e) = P(e|v)·P(v) / P(e)",
    category: "Foundation",
  },
  {
    num: "06", name: "Search Algorithms", color: violet,
    what: "How do you move through the Why tree?",
    detail: "DFS goes deep fast — best for time-constrained investigations. BFS goes wide first — best when completeness matters. Best-First follows probability — optimal for most.",
    math: "Best-First: argmax P(v) at frontier",
    category: "Analysis",
  },
  {
    num: "07", name: "Cognitive Biases", color: violet,
    what: "What corrupts the investigation?",
    detail: "Seven biases break rational investigation: anchoring, confirmation bias, groupthink, availability heuristic, sunk cost, authority bias, and narrative fallacy.",
    math: "7 detectors: warn + block modes",
    category: "Analysis",
  },
  {
    num: "08", name: "Evidence Evaluation", color: violet,
    what: "How do you know which evidence to trust?",
    detail: "Four tiers: Tier 1 physical/instrumental, Tier 2 observational, Tier 3 inferential, Tier 4 testimonial. Only Tier 1–2 closes a node as Finding.",
    math: "tier ∈ {1,2,3,4}, dir ∈ {↑,↓}",
    category: "Analysis",
  },
  {
    num: "09", name: "Causation Theory", color: violet,
    what: "How do you classify and quantify actual causes?",
    detail: "HP2015 W-partition + NESS (Necessary Element of a Sufficient Set) + PNS (Probability of Necessity and Sufficiency) give precise, quantitative actual causation.",
    math: "PNS = max(0, PN+PS−1) to min(PN,PS)",
    category: "Analysis",
  },
  {
    num: "10", name: "Intervention Theory", color: violet,
    what: "How do you find the minimal set of fixes?",
    detail: "Root cause is formalized as do(fix(C)) → outcome restoration. The minimal intervention set is the smallest set of fixes S achieving coverage ≥ θ.",
    math: "coverage(S) = 1 − ∏(1 − PNSᵢ) ≥ θ",
    category: "Analysis",
  },
];

const foundationGroup = foundations.filter(f => f.category === "Foundation");
const analysisGroup = foundations.filter(f => f.category === "Analysis");

function FoundationCard({ f }: { f: typeof foundations[0] }) {
  return (
    <div
      className="rounded-xl p-5 border"
      style={{
        backgroundColor: card,
        borderColor: border,
        borderLeft: `3px solid ${alpha(f.color, 15)}`,
        transition: "border-left-color 150ms cubic-bezier(0.16,1,0.3,1), border-color 150ms",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderLeftColor = f.color;
        e.currentTarget.style.borderColor = alpha(f.color, 25);
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderLeftColor = alpha(f.color, 15);
        e.currentTarget.style.borderColor = border;
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <span
          className="text-xs font-mono font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5"
          style={{ backgroundColor: alpha(f.color, 10), color: f.color }}
        >
          {f.num}
        </span>
        <div>
          <h3 className="text-base font-semibold leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif", color: fg }}>
            {f.name}
          </h3>
          <p className="text-[0.9375rem] mt-0.5 leading-snug" style={{ color: fgMuted }}>{f.what}</p>
        </div>
      </div>
      <p className="text-[0.9375rem] leading-relaxed mb-3" style={{ color: fgMuted }}>{f.detail}</p>
      <div
        className="rounded px-3 py-2 font-mono text-xs"
        style={{ backgroundColor: "var(--color-paper)", border: `1px solid ${border}`, color: f.color }}
      >
        {f.math}
      </div>
    </div>
  );
}

export function FoundationsGrid() {
  return (
    <div className="mb-12 sm:mb-20">
      {/* Foundation group */}
      <div className="flex items-center gap-3 mb-5">
        <span
          className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded"
          style={{ backgroundColor: alpha(teal, 8), color: teal, border: `1px solid ${alpha(teal, 20)}` }}
        >
          Foundation
        </span>
        <div className="text-xs" style={{ color: fgDim }}>01–05 · Graph · Space · Causality · Information · Bayes</div>
        <div className="h-px flex-1" style={{ backgroundColor: alpha(teal, 15) }} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {foundationGroup.map(f => <FoundationCard key={f.num} f={f} />)}
      </div>

      {/* Analysis group */}
      <div className="flex items-center gap-3 mb-5">
        <span
          className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded"
          style={{ backgroundColor: alpha(violet, 8), color: violet, border: `1px solid ${alpha(violet, 20)}` }}
        >
          Analysis
        </span>
        <div className="text-xs" style={{ color: fgDim }}>06–10 · Search · Bias · Evidence · Causation · Intervention</div>
        <div className="h-px flex-1" style={{ backgroundColor: alpha(violet, 15) }} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analysisGroup.map(f => <FoundationCard key={f.num} f={f} />)}
      </div>
    </div>
  );
}
