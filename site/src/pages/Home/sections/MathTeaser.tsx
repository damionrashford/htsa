import { Link } from "react-router";
import { teal, violet, border, card, fgDim, fgMuted } from "@/lib/tokens";
import { Section } from "@/components/ui/Section";

const mathConcepts = [
  { num: "01", name: "Graph Theory", what: "Structure of an investigation" },
  { num: "02", name: "Exponential Space", what: "Why investigations feel overwhelming" },
  { num: "03", name: "Causal Inference", what: "How to prove something caused something else" },
  { num: "04", name: "Information Theory", what: "How to measure investigative progress" },
  { num: "05", name: "Bayesian Reasoning", what: "How to weigh competing causes" },
  { num: "06", name: "Search Algorithms", what: "How to move through the Why tree" },
  { num: "07", name: "Cognitive Biases", what: "What corrupts the investigation" },
  { num: "08", name: "Evidence Evaluation", what: "How to know which evidence to trust" },
  { num: "09", name: "Causation Theory", what: "How to classify and quantify actual causes" },
  { num: "10", name: "Intervention Theory", what: "How to find the minimal set of fixes" },
];

export function MathTeaser() {
  return (
    <Section className="pt-24 pb-24">
      <div className="text-center mb-12">
        <p className="text-xs font-mono uppercase tracking-widest" style={{ color: fgDim }}>
          10 Mathematical Foundations
        </p>
        <h2
          className="mt-3 text-3xl font-bold"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}
        >
          The math is always running.
        </h2>
        <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: fgMuted }}>
          Applied graph traversal algorithm for causal inference — with probability weighting,
          entropy reduction, and Bayesian evidence updating at every node.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {mathConcepts.map((c, i) => (
          <div
            key={c.num}
            className="rounded-lg p-4 border transition-all"
            style={{ backgroundColor: card, borderColor: border }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = i < 5 ? `${teal}50` : `${violet}50`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = border;
            }}
          >
            <div className="text-xs font-mono mb-1" style={{ color: i < 5 ? teal : violet }}>{c.num}</div>
            <div className="text-sm font-medium" style={{ color: "#dce4f5" }}>{c.name}</div>
            <div className="text-xs mt-1 leading-relaxed" style={{ color: fgDim }}>{c.what}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link to="/math" className="text-sm no-underline" style={{ color: teal }}>
          Explore the math →
        </Link>
      </div>
    </Section>
  );
}
