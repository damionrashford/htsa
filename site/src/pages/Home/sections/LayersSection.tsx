import { Link } from "react-router";
import { teal, violet, amber, green, border, card, fg, fgDim, fgMuted, alpha } from "@/lib/tokens";
import { Section } from "@/components/ui/Section";

const layers = [
  {
    num: "01",
    name: "Situation Map",
    subtitle: "The 5 Ws",
    color: teal,
    desc: "Establish the full picture before drilling into cause. All five Ws before the first hypothesis.",
    items: ["Who was affected?", "What event occurred?", "When did it start?", "Where in the system?", "Why on the surface?"],
  },
  {
    num: "02",
    name: "Causal Chain",
    subtitle: "The 5 Whys",
    color: violet,
    desc: "Start at the surface Why. Ask why again. Branches are mandatory — real problems are rarely single-cause.",
    items: ["Bayesian probability at every node", "Best-First / DFS / BFS search", "Evidence-gated node closure", "Pruning below threshold θ"],
  },
  {
    num: "03",
    name: "Resolution",
    subtitle: "Fix · Mitigate · Accept",
    color: amber,
    desc: "Map each root cause to a concrete change. Every resolution must pass the counterfactual test.",
    items: ["Counterfactual test required", "PNS scoring for priority", "Minimal intervention set", "Fix / Mitigate / Accept classes"],
  },
  {
    num: "04",
    name: "Verification",
    subtitle: "Learning Loop",
    color: green,
    desc: "Confirm the fix worked. Update your priors. The framework compounds — but only when learning is explicit.",
    items: ["Time-based or event-driven window", "Metric confirmation", "Prior update on next investigation", "Pattern library growth"],
  },
];

export function LayersSection() {
  return (
    <Section id="layers" className="pt-10 pb-16 sm:pt-16 sm:pb-24">
      {/* Section header */}
      <div className="mb-6 sm:mb-10 text-center">
        <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: fgDim }}>
          4-Layer Algorithm
        </p>
        <h2
          className="text-3xl sm:text-4xl font-bold"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: fg }}
        >
          Every problem has the{" "}
          <span style={{
            background: `linear-gradient(135deg, ${teal} 0%, ${violet} 50%, ${amber} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>same layers.</span>
        </h2>
      </div>

      {/* Flow indicator — mobile: 2×2 grid, desktop: horizontal chain */}
      <div className="grid grid-cols-2 gap-2 mb-8 sm:hidden">
        {layers.map((layer) => (
          <div
            key={layer.num}
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ backgroundColor: alpha(layer.color, 8), border: `1px solid ${alpha(layer.color, 20)}` }}
          >
            <span className="text-xs font-mono font-bold" style={{ color: alpha(layer.color, 60) }}>
              {layer.num}
            </span>
            <span className="text-xs font-medium" style={{ color: layer.color }}>{layer.name}</span>
          </div>
        ))}
      </div>
      <div className="hidden sm:flex items-center justify-center gap-0 mb-8">
        {layers.map((layer, i) => (
          <div key={layer.num} className="flex items-center">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: alpha(layer.color, 8), border: `1px solid ${alpha(layer.color, 20)}` }}
            >
              <span className="text-xs font-mono font-bold" style={{ color: alpha(layer.color, 60) }}>
                {layer.num}
              </span>
              <span className="text-xs font-medium whitespace-nowrap" style={{ color: layer.color }}>
                {layer.name}
              </span>
            </div>
            {i < layers.length - 1 && (
              <div className="flex items-center mx-1">
                <div className="w-4 h-px" style={{ backgroundColor: alpha(border, 60) }} />
                <svg width="6" height="8" viewBox="0 0 6 8" fill="none" style={{ color: fgDim }}>
                  <path d="M1 1l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {layers.map((layer) => (
          <div
            key={layer.num}
            className="rounded-xl border overflow-hidden"
            style={{
              backgroundColor: layer.num === "04" ? alpha(layer.color, 4) : card,
              borderColor: layer.num === "04" ? alpha(layer.color, 20) : border,
              borderLeft: `3px solid ${alpha(layer.color, layer.num === "04" ? 55 : 25)}`,
              transition: "border-color 150ms cubic-bezier(0.16,1,0.3,1), border-left-color 150ms cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = alpha(layer.color, 25);
              e.currentTarget.style.borderLeftColor = layer.color;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = border;
              e.currentTarget.style.borderLeftColor = alpha(layer.color, 25);
            }}
          >
            <div className="px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4 flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold" style={{ color: layer.color }}>
                  LAYER {layer.num}
                </span>
                <h3
                  className="mt-1 text-lg font-semibold leading-snug"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: fg }}
                >
                  {layer.name}
                </h3>
                <span className="text-xs" style={{ color: fgDim }}>{layer.subtitle}</span>
              </div>
              <span
                className="text-5xl font-mono font-bold select-none shrink-0"
                style={{ color: alpha(layer.color, 7), lineHeight: 1 }}
              >
                {layer.num}
              </span>
            </div>

            <div className="mx-4 sm:mx-6" style={{ height: 1, backgroundColor: alpha(border, 50) }} />

            <div className="px-4 py-3 sm:px-6 sm:py-4">
              <p className="text-[0.9375rem] leading-relaxed mb-4" style={{ color: fgMuted }}>{layer.desc}</p>
              <ul className="space-y-1.5">
                {layer.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[0.9375rem]" style={{ color: fgMuted }}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: alpha(layer.color, 58) }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/algorithm"
          className="text-sm no-underline"
          style={{ color: teal, transition: "opacity 120ms" }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.7"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >
          Full algorithm walkthrough →
        </Link>
      </div>
    </Section>
  );
}
