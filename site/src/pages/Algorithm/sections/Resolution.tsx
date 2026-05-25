import { amber, green, red, border, bg, fg, fgMuted, fgDim, alpha } from "@/lib/tokens";
import { LayerCard } from "../components/LayerCard";

const resolutionTypes = [
  {
    type: "FIX",
    badge: "Causal path closed",
    desc: "Root cause eliminated. Problem cannot recur via this causal path.",
    color: green,
  },
  {
    type: "MITIGATE",
    badge: "Impact bounded",
    desc: "Impact reduced. Root cause still present but constrained below threshold.",
    color: amber,
  },
  {
    type: "ACCEPT",
    badge: "Risk acknowledged",
    desc: "Cost of fix exceeds cost of recurrence. Documented, monitored, revisited.",
    color: fgDim,
  },
];

const pnsRows = [
  { label: "PN (Probability of Necessity)", formula: "P(¬effect | do(¬cause))", note: "Would removing the cause prevent the effect?" },
  { label: "PS (Probability of Sufficiency)", formula: "P(effect | do(cause))", note: "Would adding the cause produce the effect?" },
  { label: "PNS", formula: "max(0, PN + PS − 1)", note: "Combined causal strength — used for fix priority." },
];

export function Resolution() {
  return (
    <LayerCard num="LAYER 03" title="Resolution" color={amber}>
      <p className="text-base mb-6 leading-relaxed" style={{ color: fgMuted }}>
        Map each root cause to a concrete change. Every resolution must pass the counterfactual
        test — and is scored by PNS to determine fix priority.
      </p>

      {/* Resolution types */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {resolutionTypes.map(({ type, badge, desc, color }) => (
          <div
            key={type}
            className="rounded-lg p-4 border"
            style={{ borderColor: alpha(color, 19), backgroundColor: alpha(color, 5) }}
          >
            <div className="font-mono font-bold text-sm mb-1" style={{ color }}>{type}</div>
            <div
              className="text-xs font-mono px-1.5 py-0.5 rounded w-fit mb-2"
              style={{ backgroundColor: alpha(color, 8), color: alpha(color, 70) }}
            >
              {badge}
            </div>
            <div className="text-xs leading-relaxed" style={{ color: fgMuted }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* Counterfactual test */}
      <div
        className="rounded-lg p-4 border mb-4"
        style={{ borderColor: alpha(amber, 20), backgroundColor: alpha(amber, 5) }}
      >
        <p className="text-xs font-mono mb-1.5 uppercase tracking-wider" style={{ color: amber }}>Counterfactual test on the fix</p>
        <p className="text-sm italic" style={{ color: fgMuted }}>
          "If this fix had existed before the problem occurred, would the problem still have happened?"
        </p>
        <div className="flex gap-4 mt-3">
          <div className="flex items-start gap-2">
            <span className="text-xs font-mono font-bold mt-0.5" style={{ color: green }}>No →</span>
            <span className="text-xs" style={{ color: fgMuted }}>Addresses a root cause. Proceed.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs font-mono font-bold mt-0.5" style={{ color: red }}>Yes →</span>
            <span className="text-xs" style={{ color: fgMuted }}>Targets a symptom. Go deeper in Layer 2.</span>
          </div>
        </div>
      </div>

      {/* PNS scoring */}
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: border }}>
        <div
          className="px-4 py-2 border-b"
          style={{ backgroundColor: "var(--color-paper-2)", borderColor: border }}
        >
          <span className="text-xs font-mono uppercase tracking-wider" style={{ color: fgDim }}>
            PNS — fix priority scoring
          </span>
        </div>
        {pnsRows.map((row, i) => (
          <div
            key={row.label}
            className="grid px-4 py-3 border-b last:border-b-0 gap-2"
            style={{ gridTemplateColumns: "1fr auto", backgroundColor: i % 2 === 0 ? bg : "var(--color-paper-2)", borderColor: border }}
          >
            <div>
              <div className="text-xs font-medium mb-0.5" style={{ color: fg }}>{row.label}</div>
              <div className="text-xs" style={{ color: fgDim }}>{row.note}</div>
            </div>
            <code className="text-xs font-mono self-center" style={{ color: amber }}>{row.formula}</code>
          </div>
        ))}
      </div>
    </LayerCard>
  );
}
