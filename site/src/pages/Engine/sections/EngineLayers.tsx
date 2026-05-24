import { teal, violet, card, fgDim, fgMuted } from "@/lib/tokens";

export function EngineLayers() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
      <div className="rounded-xl p-6 border" style={{ backgroundColor: card, borderColor: `${teal}40` }}>
        <div className="text-xs font-mono mb-2" style={{ color: teal }}>DETERMINISTIC LAYER</div>
        <h3
          className="text-base font-semibold mb-3"
          style={{ color: "#dce4f5", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          The engine
        </h3>
        <p className="text-sm mb-3" style={{ color: fgMuted }}>
          DAG traversal · Bayesian probability · Entropy tracking · Pruning · Bias detection ·
          HP2015 + NESS · PNS scoring · Minimal intervention set
        </p>
        <p className="text-xs" style={{ color: fgDim }}>The engine enforces the rules.</p>
      </div>
      <div className="rounded-xl p-6 border" style={{ backgroundColor: card, borderColor: `${violet}40` }}>
        <div className="text-xs font-mono mb-2" style={{ color: violet }}>JUDGMENT LAYER</div>
        <h3
          className="text-base font-semibold mb-3"
          style={{ color: "#dce4f5", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          You or an LLM
        </h3>
        <p className="text-sm mb-3" style={{ color: fgMuted }}>
          Generating hypotheses · Interpreting evidence · Evaluating depth criteria · Proposing resolutions
        </p>
        <p className="text-xs" style={{ color: fgDim }}>You (or the LLM) make the calls.</p>
      </div>
    </div>
  );
}
