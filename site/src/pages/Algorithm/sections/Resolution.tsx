import { amber, green, bg, border, fg, fgMuted } from "@/lib/tokens";
import { LayerCard } from "../components/LayerCard";

const resolutionTypes = [
  { type: "FIX", desc: "Root cause eliminated. Problem cannot recur via this causal path.", color: green },
  { type: "MITIGATE", desc: "Impact reduced. Root cause still present but constrained.", color: amber },
  { type: "ACCEPT", desc: "Risk acknowledged. Cost of fix exceeds cost of recurrence.", color: "#8899bb" },
];

export function Resolution() {
  return (
    <LayerCard num="LAYER 03" title="Resolution" color={amber}>
      <p className="text-sm mb-6" style={{ color: fgMuted }}>
        Map each root cause to a concrete change. Every resolution must pass the counterfactual
        test on the fix.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {resolutionTypes.map(({ type, desc, color }) => (
          <div
            key={type}
            className="rounded-lg p-4 border text-center"
            style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}
          >
            <div className="font-mono font-bold text-sm mb-2" style={{ color }}>{type}</div>
            <div className="text-xs" style={{ color: fgMuted }}>{desc}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg p-4 border" style={{ borderColor: border, backgroundColor: bg }}>
        <p className="text-xs font-mono mb-1" style={{ color: amber }}>Counterfactual test on the fix</p>
        <p className="text-sm" style={{ color: fgMuted }}>
          "If this change had existed before the problem occurred, would the problem still have happened?"
          <br />
          <span style={{ color: fg }}>If yes → the fix targets a symptom. Go deeper.</span>
        </p>
      </div>
    </LayerCard>
  );
}
