import { teal, border, card, fgDim, fgMuted } from "@/lib/tokens";

const columns = [
  {
    label: "Use HTSA when:",
    color: teal,
    items: [
      "You're doing a postmortem, not running ML",
      "The problem spans multiple domains",
      "You want to prove causation, not correlate metrics",
      "You want LLM assistance in the investigation",
      "You need a trail of evidence and reasoning",
    ],
  },
  {
    label: "Use PyRCA/BARO when:",
    color: fgMuted,
    items: [
      "You have structured Prometheus/Jaeger metrics",
      "You need to triage fast from metric anomalies",
      "Your problem is AIOps microservice attribution",
      "You have labeled historical incident data",
    ],
  },
  {
    label: "Use DoWhy when:",
    color: fgMuted,
    items: [
      "You have a data frame with observational data",
      "You want do-calculus counterfactual reasoning",
      "Your problem is a research statistics question",
      "You have a known causal graph to verify",
    ],
  },
];

export function WhenToUse() {
  return (
    <div className="rounded-xl p-8 border" style={{ borderColor: border, backgroundColor: card }}>
      <p className="text-xs font-mono uppercase tracking-widest mb-6" style={{ color: fgDim }}>
        When to use what
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(({ label, color, items }) => (
          <div key={label}>
            <div className="text-sm font-medium mb-2" style={{ color }}>{label}</div>
            <ul className="space-y-1.5 text-sm" style={{ color: fgMuted }}>
              {items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span style={{ color }}>›</span>{item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
