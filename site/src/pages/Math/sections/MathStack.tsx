import { teal, violet, amber, border, card, fgDim, fgMuted } from "@/lib/tokens";

const stack = [
  { num: 10, name: "Intervention Theory", role: "What to fix and in what order", color: violet },
  { num: 9, name: "Causation Theory", role: "What actually caused it", color: violet },
  { num: 8, name: "Evidence Evaluation", role: "What counts as proof", color: violet },
  { num: 7, name: "Cognitive Biases", role: "What corrupts the mind", color: violet },
  { num: 6, name: "Search Algorithms", role: "How you move", color: amber },
  { num: 5, name: "Bayesian Reasoning", role: "How you weigh branches", color: amber },
  { num: 4, name: "Information Theory", role: "How you measure progress", color: teal },
  { num: 3, name: "Causal Inference", role: "How you prove causation", color: teal },
  { num: 2, name: "Exponential Space", role: "Why structure matters", color: teal },
  { num: 1, name: "Graph Theory", role: "The foundation", color: teal },
];

export function MathStack() {
  return (
    <div className="mb-20">
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>
        How they stack
      </p>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: border }}>
        {stack.map((layer, i) => (
          <div
            key={layer.name}
            className="flex items-center gap-5 px-5 py-3 border-b last:border-b-0 transition-colors group"
            style={{ borderColor: border, backgroundColor: i % 2 === 0 ? card : "#0d1525" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = `${layer.color}0a`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = i % 2 === 0 ? card : "#0d1525"; }}
          >
            <span
              className="text-xs font-mono w-6 text-right shrink-0 tabular-nums"
              style={{ color: `${layer.color}80` }}
            >
              {String(layer.num).padStart(2, "0")}
            </span>
            <span className="text-sm font-medium flex-1" style={{ color: layer.color }}>{layer.name}</span>
            <span className="text-xs text-right" style={{ color: fgMuted }}>{layer.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
