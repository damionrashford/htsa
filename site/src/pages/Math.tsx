import { Link } from "react-router";

const teal = "oklch(0.72 0.20 196)";
const violet = "oklch(0.68 0.22 272)";
const border = "#1e2d4a";
const card = "#111827";
const fgMuted = "#8899bb";
const fgDim = "#4a5e82";

const foundations = [
  {
    num: "01",
    name: "Graph Theory",
    what: "What is the structure of an investigation?",
    detail: "The Why tree is a directed acyclic graph (DAG). Nodes are causal claims. Edges are causal links. Convergent nodes — multiple paths pointing to the same cause — identify the most impactful root causes. G = (V, E, P, Ev).",
    color: teal,
    math: "G = (V, E, P, Ev)",
  },
  {
    num: "02",
    name: "Exponential Problem Space",
    what: "Why do investigations feel overwhelming?",
    detail: "Unstructured investigation explores b^d nodes where b is the branching factor and d is the depth. With b=3 and d=5, that's 243 paths. The framework tames this through evidence-based pruning and Bayesian ordering.",
    color: teal,
    math: "|paths| ≤ b^d · (1 - θ)^k",
  },
  {
    num: "03",
    name: "Causal Inference",
    what: "How do you prove something caused something else?",
    detail: "Correlation is not causation. Every Why claim must pass the counterfactual test: P(effect | do(¬cause)) ≠ P(effect | do(cause)). For overdetermination, apply the three-stage HP2015 W-partition test.",
    color: teal,
    math: "do(¬C) ≠ do(C) → C is causal",
  },
  {
    num: "04",
    name: "Information Theory",
    what: "How do you measure investigative progress?",
    detail: "Every correct Why answer reduces entropy H(G). Progress is the entropy drop from one step to the next. A good question is one that maximizes expected information gain across all possible answers.",
    color: teal,
    math: "H(G) = -Σ P(vᵢ) · log₂ P(vᵢ)",
  },
  {
    num: "05",
    name: "Bayesian Reasoning",
    what: "How do you weigh competing causes?",
    detail: "Start with priors based on base rates. Gather evidence. Update probabilities via Bayes' theorem. Sibling nodes are normalized to sum to 1.0 after every update. Converge on truth through evidence accumulation.",
    color: teal,
    math: "P(v|e) = P(e|v)·P(v) / P(e)",
  },
  {
    num: "06",
    name: "Search Algorithms",
    what: "How do you move through the Why tree?",
    detail: "DFS goes deep fast — best for time-constrained rapid-mode investigations. BFS goes wide first — best when completeness matters more than speed. Best-First follows probability — optimal for most investigations.",
    color: violet,
    math: "Best-First: argmax P(v) at frontier",
  },
  {
    num: "07",
    name: "Cognitive Biases",
    what: "What corrupts the investigation?",
    detail: "The math assumes a rational agent. Seven biases break this assumption: anchoring, confirmation bias, groupthink, availability heuristic, sunk cost, authority bias, and narrative fallacy. The engine detects all seven.",
    color: violet,
    math: "7 detectors: warn + block modes",
  },
  {
    num: "08",
    name: "Evidence Evaluation",
    what: "How do you know which evidence to trust?",
    detail: "Four tiers: Tier 1 physical/instrumental (logs, sensors), Tier 2 observational (direct witness), Tier 3 inferential (reasoned conclusion), Tier 4 testimonial/reconstructive (recalled). Only Tier 1–2 closes a node as Finding.",
    color: violet,
    math: "tier ∈ {1, 2, 3, 4}, direction ∈ {↑, ↓}",
  },
  {
    num: "09",
    name: "Causation Theory",
    what: "How do you classify and quantify actual causes?",
    detail: "Binary counterfactuals break on overdetermination and preemption. HP2015 W-partition + NESS (Necessary Element of a Sufficient Set) + PNS (Probability of Necessity and Sufficiency) give precise, quantitative actual causation.",
    color: violet,
    math: "PNS = max(0, PN+PS-1) to min(PN, PS)",
  },
  {
    num: "10",
    name: "Intervention Theory",
    what: "How do you find the minimal set of fixes?",
    detail: "Root cause is formalized as do(fix(C)) → outcome restoration. The minimal intervention set is the smallest set of fixes S achieving coverage ≥ θ, where coverage(S) = 1 - ∏(1 - PNSᵢ).",
    color: violet,
    math: "coverage(S) = 1 - ∏(1 - PNSᵢ) ≥ θ",
  },
];

const stack = [
  { name: "Intervention Theory", role: "What to fix and in what order", color: violet },
  { name: "Causation Theory", role: "What actually caused it", color: violet },
  { name: "Evidence Evaluation", role: "What counts as proof", color: violet },
  { name: "Cognitive Biases", role: "What corrupts the mind", color: violet },
  { name: "Search Algorithms", role: "How you move", color: fgMuted },
  { name: "Bayesian Reasoning", role: "How you weigh branches", color: fgMuted },
  { name: "Information Theory", role: "How you measure progress", color: teal },
  { name: "Causal Inference", role: "How you prove causation", color: teal },
  { name: "Exponential Space", role: "Why structure matters", color: teal },
  { name: "Graph Theory", role: "The foundation", color: teal },
];

export default function MathPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-16">
        <Link to="/" className="text-sm no-underline mb-6 inline-block" style={{ color: fgDim }}>← Home</Link>
        <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: fgDim }}>Mathematical Foundations</p>
        <h1 className="text-4xl sm:text-5xl font-display font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}>
          The math, made visible.
        </h1>
        <p className="mt-4 text-lg max-w-2xl" style={{ color: fgMuted }}>
          The math is always running underneath. These ten concepts explain how the framework works — and why it works.
        </p>
      </div>

      {/* Stack diagram */}
      <div className="mb-20 max-w-xl">
        <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>How they stack</p>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: border }}>
          {stack.map((layer, i) => (
            <div key={layer.name}
              className="flex items-center justify-between px-5 py-3 border-b last:border-b-0 transition-colors"
              style={{ borderColor: border, backgroundColor: i % 2 === 0 ? card : "#0d1525" }}>
              <span className="text-sm font-medium" style={{ color: layer.color }}>{layer.name}</span>
              <span className="text-xs" style={{ color: fgDim }}>{layer.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* All 10 concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {foundations.map((f) => (
          <div key={f.num} className="rounded-xl p-6 border transition-all"
            style={{ backgroundColor: card, borderColor: border }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${f.color}50`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = border; }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs font-mono" style={{ color: f.color }}>{f.num}</span>
                <h3 className="text-lg font-display font-semibold mt-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}>
                  {f.name}
                </h3>
                <p className="text-sm" style={{ color: fgMuted }}>{f.what}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: fgMuted }}>{f.detail}</p>
            <div className="rounded px-3 py-2 font-mono text-xs" style={{ backgroundColor: "#080d1a", border: `1px solid ${border}`, color: f.color }}>
              {f.math}
            </div>
          </div>
        ))}
      </div>

      {/* Research */}
      <div className="mt-16 rounded-xl p-8 border text-center" style={{ borderColor: `${teal}30`, backgroundColor: `${teal}08` }}>
        <p className="text-sm font-medium mb-2" style={{ color: "#dce4f5" }}>Research foundations</p>
        <p className="text-sm mb-4" style={{ color: fgMuted }}>
          12 paper summaries covering HP2015, NESS, PNS, causal entropy, heredity priors, and more.
          Each gap in the original framework is documented, traced to a paper, and closed by a specific implementation phase.
        </p>
        <a href="https://github.com/damionrashford/htsa/tree/main/research" target="_blank" rel="noreferrer"
          className="text-sm no-underline" style={{ color: teal }}>
          Browse the research library →
        </a>
      </div>
    </div>
  );
}
