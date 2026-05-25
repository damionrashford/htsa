import { teal, violet, card, border, fg, fgDim, fgMuted, alpha } from "@/lib/tokens";

const engineFeatures = [
  "DAG traversal", "Bayesian probability", "Entropy tracking",
  "Pruning θ-threshold", "7 bias detectors", "HP2015 + NESS",
  "PNS scoring", "Minimal intervention set",
];

const llmFeatures = [
  "Hypothesis generation", "Evidence interpretation",
  "Depth criteria evaluation", "Resolution proposals",
];

export function EngineLayers() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
      {/* Deterministic engine */}
      <div
        className="rounded-xl p-6 border"
        style={{ backgroundColor: card, borderColor: alpha(teal, 20), borderLeft: `3px solid ${teal}` }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-7 h-7 rounded flex items-center justify-center shrink-0"
            style={{ backgroundColor: alpha(teal, 12) }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 20V4M4 12h16M4 8l8-4 8 4M4 16l8 4 8-4"/>
            </svg>
          </div>
          <div>
            <div className="text-xs font-mono" style={{ color: teal }}>DETERMINISTIC LAYER</div>
            <h3 className="text-base font-semibold" style={{ color: fg, fontFamily: "'Space Grotesk', sans-serif" }}>
              The engine
            </h3>
          </div>
        </div>
        <p className="text-base mb-4 leading-relaxed" style={{ color: fgMuted }}>
          Pure math. The engine enforces every rule — graph construction, probability updates,
          entropy tracking, bias detection. No judgment calls.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {engineFeatures.map(f => (
            <span
              key={f}
              className="text-xs px-2 py-0.5 rounded font-mono"
              style={{ backgroundColor: alpha(teal, 8), color: teal, border: `1px solid ${alpha(teal, 15)}` }}
            >
              {f}
            </span>
          ))}
        </div>
        <p className="text-xs mt-4 pt-3 border-t" style={{ color: fgDim, borderColor: alpha(border, 40) }}>
          Deterministic · Reproducible · Auditable
        </p>
      </div>

      {/* Judgment layer */}
      <div
        className="rounded-xl p-6 border"
        style={{ backgroundColor: card, borderColor: alpha(violet, 20), borderLeft: `3px solid ${violet}` }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-7 h-7 rounded flex items-center justify-center shrink-0"
            style={{ backgroundColor: alpha(violet, 12) }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={violet} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>
            </svg>
          </div>
          <div>
            <div className="text-xs font-mono" style={{ color: violet }}>JUDGMENT LAYER</div>
            <h3 className="text-base font-semibold" style={{ color: fg, fontFamily: "'Space Grotesk', sans-serif" }}>
              You or an LLM
            </h3>
          </div>
        </div>
        <p className="text-base mb-4 leading-relaxed" style={{ color: fgMuted }}>
          Contextual reasoning. The layer that requires reading between the lines — what is likely, what makes sense, what the data suggests.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {llmFeatures.map(f => (
            <span
              key={f}
              className="text-xs px-2 py-0.5 rounded font-mono"
              style={{ backgroundColor: alpha(violet, 8), color: violet, border: `1px solid ${alpha(violet, 15)}` }}
            >
              {f}
            </span>
          ))}
        </div>
        <p className="text-xs mt-4 pt-3 border-t" style={{ color: fgDim, borderColor: alpha(border, 40) }}>
          Works with any OpenAI-compatible API · Or drive manually
        </p>
      </div>
    </div>
  );
}
