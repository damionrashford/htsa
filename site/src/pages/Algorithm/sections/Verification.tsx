import { green, teal, border, fgMuted, fgDim, alpha } from "@/lib/tokens";
import { LayerCard } from "../components/LayerCard";

const methods = [
  {
    name: "Time-based window",
    trigger: "N days/hours after deploy",
    desc: "Monitor for N days after deployment. No recurrence within the window = verified.",
  },
  {
    name: "Event-driven window",
    trigger: "Next natural trigger",
    desc: "Wait for the next triggering event — traffic spike, monthly batch, seasonal load.",
  },
  {
    name: "Metric confirmation",
    trigger: "Pre-defined before deploy",
    desc: "Define the exact metric that proves the fix worked before any code ships.",
  },
  {
    name: "Prior update",
    trigger: "Feeds next investigation",
    desc: "Feed the verified outcome as evidence back into the domain's prior for future investigations.",
  },
];

const loopSteps = [
  { label: "Deploy fix", color: green },
  { label: "Monitor", color: teal },
  { label: "Confirm", color: green },
  { label: "Update priors", color: teal },
];

export function Verification() {
  return (
    <LayerCard num="LAYER 04" title="Verification & Learning" color={green}>
      <p className="text-base mb-6 leading-relaxed" style={{ color: fgMuted }}>
        Confirm the fix worked. Update your priors. The framework compounds over time — but only
        if learning is explicit and structured.
      </p>

      {/* Learning loop */}
      <div
        className="rounded-lg px-5 py-4 border mb-5 flex items-center justify-center gap-2 flex-wrap"
        style={{ borderColor: alpha(green, 15), backgroundColor: alpha(green, 4) }}
      >
        {loopSteps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <span
              className="text-xs font-mono font-semibold px-2.5 py-1 rounded"
              style={{ backgroundColor: alpha(step.color, 10), color: step.color, border: `1px solid ${alpha(step.color, 20)}` }}
            >
              {step.label}
            </span>
            {i < loopSteps.length - 1 ? (
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" style={{ color: fgDim }}>
                <path d="M1 5h12M9 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <span className="text-xs" style={{ color: fgDim }}>↩ repeat</span>
            )}
          </div>
        ))}
      </div>

      {/* Verification methods */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: border }}>
        {methods.map((m, i) => (
          <div
            key={m.name}
            className="grid px-4 py-3.5 border-b last:border-b-0 gap-1"
            style={{
              gridTemplateColumns: "1fr auto",
              backgroundColor: i % 2 === 0 ? "var(--color-card)" : "var(--color-paper-2)",
              borderColor: border,
            }}
          >
            <div>
              <div className="text-xs font-semibold mb-0.5" style={{ color: green }}>{m.name}</div>
              <div className="text-xs leading-relaxed" style={{ color: fgMuted }}>{m.desc}</div>
            </div>
            <span
              className="text-xs font-mono px-2 py-0.5 rounded self-start shrink-0 ml-3 hidden sm:block"
              style={{ backgroundColor: alpha(green, 6), color: alpha(green, 60) }}
            >
              {m.trigger}
            </span>
          </div>
        ))}
      </div>
    </LayerCard>
  );
}
