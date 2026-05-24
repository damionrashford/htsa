import { teal, violet, border, card, fgDim } from "@/lib/tokens";

const stack = [
  { name: "Intervention Theory", role: "What to fix and in what order", color: violet },
  { name: "Causation Theory", role: "What actually caused it", color: violet },
  { name: "Evidence Evaluation", role: "What counts as proof", color: violet },
  { name: "Cognitive Biases", role: "What corrupts the mind", color: violet },
  { name: "Search Algorithms", role: "How you move", color: "#8899bb" },
  { name: "Bayesian Reasoning", role: "How you weigh branches", color: "#8899bb" },
  { name: "Information Theory", role: "How you measure progress", color: teal },
  { name: "Causal Inference", role: "How you prove causation", color: teal },
  { name: "Exponential Space", role: "Why structure matters", color: teal },
  { name: "Graph Theory", role: "The foundation", color: teal },
];

export function MathStack() {
  return (
    <div className="mb-20 max-w-xl">
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>
        How they stack
      </p>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: border }}>
        {stack.map((layer, i) => (
          <div
            key={layer.name}
            className="flex items-center justify-between px-5 py-3 border-b last:border-b-0 transition-colors"
            style={{ borderColor: border, backgroundColor: i % 2 === 0 ? card : "#0d1525" }}
          >
            <span className="text-sm font-medium" style={{ color: layer.color }}>{layer.name}</span>
            <span className="text-xs" style={{ color: fgDim }}>{layer.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
