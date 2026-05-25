import { Link } from "react-router";
import { teal, violet, border, card, fg, fgDim, fgMuted, alpha } from "@/lib/tokens";
import { Section } from "@/components/ui/Section";

const foundations = [
  { num: "01", name: "Graph Theory",      formula: "G = (V, E, P, Ev)",               what: "Investigation structure as DAG" },
  { num: "02", name: "Problem Space",     formula: "|paths| ≤ b^d · (1 − θ)^k",      what: "Why unstructured search fails" },
  { num: "03", name: "Causal Inference",  formula: "do(¬C) ≠ do(C) → C is causal",   what: "Proving causation, not correlation" },
  { num: "04", name: "Information Theory",formula: "H(G) = −Σ P(vᵢ) log₂ P(vᵢ)",    what: "Measuring investigative progress" },
  { num: "05", name: "Bayesian Reasoning",formula: "P(v|e) = P(e|v)·P(v) / P(e)",    what: "Updating beliefs with evidence" },
];

const analysis = [
  { num: "06", name: "Search Algorithms", formula: "argmax P(v) at frontier",         what: "Traversing the Why tree optimally" },
  { num: "07", name: "Cognitive Biases",  formula: "7 detectors: warn + block",       what: "What corrupts the investigation" },
  { num: "08", name: "Evidence Tiers",    formula: "tier ∈ {1,2,3,4}, dir ∈ {↑,↓}",  what: "Knowing which evidence to trust" },
  { num: "09", name: "Causation Theory",  formula: "PNS = max(0, PN+PS−1)",           what: "Classifying and quantifying causes" },
  { num: "10", name: "Intervention",      formula: "coverage(S) = 1 − ∏(1 − PNSᵢ)", what: "Finding the minimal fix set" },
];

function ConceptRow({ num, name, formula, what, color }: {
  num: string; name: string; formula: string; what: string; color: string;
}) {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: card,
        borderColor: alpha(border, 50),
        transition: "border-color 150ms cubic-bezier(0.16,1,0.3,1), transform 150ms cubic-bezier(0.16,1,0.3,1)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = alpha(color, 25);
        e.currentTarget.style.transform = "translateX(2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = alpha(border, 50);
        e.currentTarget.style.transform = "translateX(0)";
      }}
    >
      <div className="grid gap-3 px-4 py-3" style={{ gridTemplateColumns: "2rem 1fr" }}>
        <span className="text-xs font-mono tabular-nums pt-0.5 text-right" style={{ color: alpha(color, 44) }}>
          {num}
        </span>
        <div className="min-w-0">
          <span className="text-sm font-semibold block leading-snug" style={{ color: fg }}>{name}</span>
          <span className="text-xs" style={{ color: fgDim }}>{what}</span>
        </div>
      </div>
      <div
        className="px-4 py-1.5 border-t font-mono text-xs truncate"
        style={{ borderColor: alpha(color, 10), backgroundColor: alpha(color, 4), color: alpha(color, 65) }}
      >
        {formula}
      </div>
    </div>
  );
}

export function MathTeaser() {
  return (
    <Section className="pt-14 pb-14 sm:pt-24 sm:pb-24">
      <div className="text-center mb-8 sm:mb-12">
        <p className="text-xs font-mono uppercase tracking-widest" style={{ color: fgDim }}>
          10 Mathematical Foundations
        </p>
        <h2
          className="mt-3 text-3xl font-bold"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: fg }}
        >
          The math is always running.
        </h2>
        <p className="mt-4 text-base w-full max-w-xl mx-auto leading-relaxed" style={{ color: fgMuted, marginInline: "auto" }}>
          Graph traversal · Bayesian probability · Entropy reduction · Causal inference — at every node.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
        {/* Foundations group */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ backgroundColor: alpha(teal, 8), color: teal, border: `1px solid ${alpha(teal, 20)}` }}
            >
              Foundation
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: alpha(teal, 15) }} />
          </div>
          <div className="flex flex-col gap-2">
            {foundations.map(c => <ConceptRow key={c.num} {...c} color={teal} />)}
          </div>
        </div>

        {/* Analysis group */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ backgroundColor: alpha(violet, 8), color: violet, border: `1px solid ${alpha(violet, 20)}` }}
            >
              Analysis
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: alpha(violet, 15) }} />
          </div>
          <div className="flex flex-col gap-2">
            {analysis.map(c => <ConceptRow key={c.num} {...c} color={violet} />)}
          </div>
        </div>
      </div>

      <div className="mt-5 sm:mt-8 text-center">
        <Link
          to="/math"
          className="text-sm no-underline"
          style={{ color: teal, transition: "opacity 120ms" }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.7"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >
          Explore the math →
        </Link>
      </div>
    </Section>
  );
}
