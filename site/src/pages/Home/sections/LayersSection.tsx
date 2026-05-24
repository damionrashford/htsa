import { Link } from "react-router";
import { teal, border, card, fgMuted } from "@/lib/tokens";
import { Section } from "@/components/ui/Section";

const layers = [
  {
    num: "01",
    name: "Situation Map",
    subtitle: "The 5 Ws",
    color: teal,
    desc: "Establish the full picture before drilling into cause. Who, What, When, Where, Why-surface — all five before the first hypothesis.",
    items: ["Who was affected?", "What event occurred?", "When did it start?", "Where in the system?", "Why on the surface?"],
  },
  {
    num: "02",
    name: "Causal Chain",
    subtitle: "The 5 Whys",
    color: "oklch(0.68 0.22 272)",
    desc: "Start at the surface Why. Ask why again. Keep going until you reach something you can actually change. Branches are mandatory — real problems are rarely single-cause.",
    items: ["Bayesian probability at every node", "Best-First / DFS / BFS search", "Evidence-gated node closure", "Pruning below threshold θ"],
  },
  {
    num: "03",
    name: "Resolution",
    subtitle: "Fix · Mitigate · Accept",
    color: "oklch(0.78 0.18 75)",
    desc: "Map each root cause to a concrete change. Every resolution must pass the counterfactual test: would the fix have prevented the problem?",
    items: ["HP2015 + NESS causal proof", "PNS scoring for priority", "Minimal intervention set", "Fix / Mitigate / Accept classification"],
  },
  {
    num: "04",
    name: "Verification",
    subtitle: "Learning Loop",
    color: "oklch(0.72 0.18 155)",
    desc: "Confirm the fix worked. Update your priors. The framework compounds over time — but only if learning is explicit and structured.",
    items: ["Time-based or event-driven window", "Metric confirmation", "Prior update on next investigation", "Pattern library growth"],
  },
];

export function LayersSection() {
  return (
    <Section id="layers" className="pt-16 pb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {layers.map((layer) => (
          <div
            key={layer.num}
            className="rounded-xl p-6 border transition-all"
            style={{ backgroundColor: card, borderColor: border }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = `${layer.color}50`;
              (e.currentTarget as HTMLElement).style.boxShadow = `0 0 28px ${layer.color}10`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = border;
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono" style={{ color: layer.color }}>Layer {layer.num}</span>
                <h3
                  className="mt-1 text-xl font-semibold"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}
                >
                  {layer.name}
                </h3>
                <span className="text-sm" style={{ color: fgMuted }}>{layer.subtitle}</span>
              </div>
              <span className="text-3xl font-mono font-bold opacity-15" style={{ color: layer.color }}>
                {layer.num}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: fgMuted }}>{layer.desc}</p>
            <ul className="mt-4 space-y-1.5">
              {layer.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm" style={{ color: fgMuted }}>
                  <span style={{ color: layer.color }}>›</span> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link
          to="/algorithm"
          className="text-sm no-underline"
          style={{ color: teal }}
          onMouseEnter={e => { (e.target as HTMLElement).style.opacity = "0.7"; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.opacity = "1"; }}
        >
          Full algorithm walkthrough →
        </Link>
      </div>
    </Section>
  );
}
