import { green, fgMuted } from "@/lib/tokens";
import { LayerCard } from "../components/LayerCard";

const methods = [
  { name: "Time-based window", desc: "Monitor for N days/hours after deploy. No recurrence within window = verified." },
  { name: "Event-driven window", desc: "Wait for next triggering event (traffic spike, monthly batch, etc.)." },
  { name: "Metric confirmation", desc: "Define the exact metric that proves the fix worked before deploying." },
  { name: "Prior update", desc: "Feed the outcome back as evidence for the next investigation in the same domain." },
];

export function Verification() {
  return (
    <LayerCard num="LAYER 04" title="Verification & Learning" color={green}>
      <p className="text-sm mb-6" style={{ color: fgMuted }}>
        Confirm the fix worked. Update your priors. The framework compounds over time — but only
        if learning is explicit.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {methods.map(({ name, desc }) => (
          <div
            key={name}
            className="rounded-lg p-3 border"
            style={{ borderColor: `${green}25`, backgroundColor: `${green}08` }}
          >
            <div className="text-xs font-medium mb-0.5" style={{ color: green }}>{name}</div>
            <div className="text-xs" style={{ color: fgMuted }}>{desc}</div>
          </div>
        ))}
      </div>
    </LayerCard>
  );
}
