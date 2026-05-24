import { teal, fgMuted } from "@/lib/tokens";
import { LayerCard } from "../components/LayerCard";

const questions = [
  { q: "Who", a: "The actor, subject, or stakeholder involved" },
  { q: "What", a: "The event, problem, or incident" },
  { q: "When", a: "Timeline — before, during, and after" },
  { q: "Where", a: "Location, system, environment, context" },
  { q: "Why", a: "Surface-level, immediately apparent reason" },
];

export function SituationMap() {
  return (
    <LayerCard num="LAYER 01" title="Situation Map — The 5 Ws" color={teal}>
      <p className="text-sm mb-6" style={{ color: fgMuted }}>
        Establish the full picture before drilling into cause. All five questions must be answered
        before the first hypothesis is generated. Anchoring bias fires if you skip this layer.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {questions.map(({ q, a }) => (
          <div
            key={q}
            className="rounded-lg p-4 border text-center"
            style={{ borderColor: `${teal}25`, backgroundColor: `${teal}08` }}
          >
            <div className="text-lg font-bold mb-1" style={{ color: teal }}>{q}</div>
            <div className="text-xs" style={{ color: fgMuted }}>{a}</div>
          </div>
        ))}
      </div>
    </LayerCard>
  );
}
