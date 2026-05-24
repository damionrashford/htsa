import { Link } from "react-router";

const teal = "oklch(0.72 0.20 196)";
const violet = "oklch(0.68 0.22 272)";
const amber = "oklch(0.78 0.18 75)";
const green = "oklch(0.72 0.18 155)";
const border = "#1e2d4a";
const card = "#111827";
const fgMuted = "#8899bb";
const fgDim = "#4a5e82";

const depthCriteria = [
  { name: "Actionability", desc: "A concrete change addresses this node — it's within your power to change." },
  { name: "Counterfactual Clarity", desc: "If this cause hadn't existed, the problem would not have occurred." },
  { name: "System Boundary", desc: "The cause is inside the system's control, not an external given." },
  { name: "Diminishing Returns", desc: "Going one Why deeper would not change the action you take." },
];

const rules = [
  { rule: "Map before you drill.", detail: "Complete the 5 Ws before starting the 5 Whys. The Situation Map prevents anchoring bias." },
  { rule: "Evidence at every node.", detail: "An assertion without evidence is a guess — tier your evidence (physical → observational → inferential → testimonial)." },
  { rule: "Branch when reality branches.", detail: "Real incidents have multiple root causes. Follow all of them. Do not force a single chain." },
  { rule: "5 is a heuristic, not a rule.", detail: "Stop when you reach something you can actually change. Depth is determined by the four criteria, not a count." },
  { rule: "The counterfactual test closes the loop.", detail: "If the fix had existed before the problem occurred, would the problem still have happened? If yes, go deeper." },
  { rule: "The framework is recursive.", detail: "A root cause can become a new incident. Run the algorithm again from Layer 1." },
];

export default function Algorithm() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-16">
        <Link to="/" className="text-sm no-underline mb-6 inline-block" style={{ color: fgDim }}>← Home</Link>
        <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: fgDim }}>The Four Layers</p>
        <h1 className="text-4xl sm:text-5xl font-display font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}>
          The HTSA Algorithm
        </h1>
        <p className="mt-4 text-lg max-w-2xl" style={{ color: fgMuted }}>
          A formal procedure with defined inputs, outputs, and termination guarantees. Not a template — an algorithm.
        </p>
      </div>

      {/* Algorithm flow */}
      <div className="space-y-6 mb-24">

        {/* Layer 1 */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${teal}40` }}>
          <div className="px-6 py-4 border-b flex items-center gap-4" style={{ backgroundColor: `${teal}0d`, borderColor: `${teal}30` }}>
            <span className="font-mono text-sm font-bold" style={{ color: teal }}>LAYER 01</span>
            <span className="text-lg font-display font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}>Situation Map — The 5 Ws</span>
          </div>
          <div className="p-6" style={{ backgroundColor: card }}>
            <p className="text-sm mb-6" style={{ color: fgMuted }}>
              Establish the full picture before drilling into cause. All five questions must be answered before the first hypothesis is generated. Anchoring bias fires if you skip this layer.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[
                { q: "Who", a: "The actor, subject, or stakeholder involved" },
                { q: "What", a: "The event, problem, or incident" },
                { q: "When", a: "Timeline — before, during, and after" },
                { q: "Where", a: "Location, system, environment, context" },
                { q: "Why", a: "Surface-level, immediately apparent reason" },
              ].map(({ q, a }) => (
                <div key={q} className="rounded-lg p-4 border text-center" style={{ borderColor: `${teal}25`, backgroundColor: `${teal}08` }}>
                  <div className="text-lg font-bold mb-1" style={{ color: teal }}>{q}</div>
                  <div className="text-xs" style={{ color: fgMuted }}>{a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center">
          <div className="h-6 w-px" style={{ background: `linear-gradient(${teal}, ${violet})` }} />
        </div>

        {/* Layer 2 */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${violet}40` }}>
          <div className="px-6 py-4 border-b flex items-center gap-4" style={{ backgroundColor: `${violet}0d`, borderColor: `${violet}30` }}>
            <span className="font-mono text-sm font-bold" style={{ color: violet }}>LAYER 02</span>
            <span className="text-lg font-display font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}>Causal Chain — The 5 Whys</span>
          </div>
          <div className="p-6" style={{ backgroundColor: card }}>
            <p className="text-sm mb-6" style={{ color: fgMuted }}>
              Start at the surface Why from Layer 1. Ask why again. Keep going until you hit something you can actually change — defined by four explicit depth criteria, not a count of five.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-mono mb-3 uppercase tracking-wider" style={{ color: fgDim }}>The Why tree</p>
                <pre className="text-sm" style={{ backgroundColor: "#080d1a", border: `1px solid ${border}`, borderRadius: 8, padding: "1rem", margin: 0 }}>{`Why (surface)
  └─► Why 1
        └─► Why 2
              └─► Why 3
                    ├─► Why 4a: ROOT
                    └─► Why 4b: ROOT`}</pre>
                <p className="text-xs mt-2" style={{ color: fgDim }}>Whys branch. Real problems are multi-cause.</p>
              </div>
              <div>
                <p className="text-xs font-mono mb-3 uppercase tracking-wider" style={{ color: fgDim }}>Four depth criteria (all must pass)</p>
                <div className="space-y-2">
                  {depthCriteria.map(({ name, desc }) => (
                    <div key={name} className="rounded-lg p-3 border" style={{ borderColor: `${violet}25`, backgroundColor: `${violet}08` }}>
                      <div className="text-xs font-medium mb-0.5" style={{ color: violet }}>{name}</div>
                      <div className="text-xs" style={{ color: fgMuted }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-lg p-4 border" style={{ borderColor: border, backgroundColor: "#080d1a" }}>
              <p className="text-xs font-mono mb-2" style={{ color: fgDim }}>Search strategy</p>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                {[
                  { name: "Best-First", desc: "Follow highest probability branch first", color: teal },
                  { name: "DFS", desc: "Go deep on one branch before exploring", color: violet },
                  { name: "BFS", desc: "Explore all branches at equal depth", color: amber },
                ].map(({ name, desc, color }) => (
                  <div key={name} className="rounded p-2" style={{ backgroundColor: `${color}10`, border: `1px solid ${color}30` }}>
                    <div className="font-mono font-medium mb-0.5" style={{ color }}>{name}</div>
                    <div style={{ color: fgDim }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center">
          <div className="h-6 w-px" style={{ background: `linear-gradient(${violet}, ${amber})` }} />
        </div>

        {/* Layer 3 */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${amber}40` }}>
          <div className="px-6 py-4 border-b flex items-center gap-4" style={{ backgroundColor: `${amber}0d`, borderColor: `${amber}30` }}>
            <span className="font-mono text-sm font-bold" style={{ color: amber }}>LAYER 03</span>
            <span className="text-lg font-display font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}>Resolution</span>
          </div>
          <div className="p-6" style={{ backgroundColor: card }}>
            <p className="text-sm mb-6" style={{ color: fgMuted }}>
              Map each root cause to a concrete change. Every resolution must pass the counterfactual test on the fix.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { type: "FIX", desc: "Root cause eliminated. Problem cannot recur via this causal path.", color: green },
                { type: "MITIGATE", desc: "Impact reduced. Root cause still present but constrained.", color: amber },
                { type: "ACCEPT", desc: "Risk acknowledged. Cost of fix exceeds cost of recurrence.", color: fgMuted },
              ].map(({ type, desc, color }) => (
                <div key={type} className="rounded-lg p-4 border text-center" style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}>
                  <div className="font-mono font-bold text-sm mb-2" style={{ color }}>{type}</div>
                  <div className="text-xs" style={{ color: fgMuted }}>{desc}</div>
                </div>
              ))}
            </div>
            <div className="rounded-lg p-4 border" style={{ borderColor: border, backgroundColor: "#080d1a" }}>
              <p className="text-xs font-mono mb-1" style={{ color: amber }}>Counterfactual test on the fix</p>
              <p className="text-sm" style={{ color: fgMuted }}>
                "If this change had existed before the problem occurred, would the problem still have happened?"<br />
                <span style={{ color: "#dce4f5" }}>If yes → the fix targets a symptom. Go deeper.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center">
          <div className="h-6 w-px" style={{ background: `linear-gradient(${amber}, ${green})` }} />
        </div>

        {/* Layer 4 */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${green}40` }}>
          <div className="px-6 py-4 border-b flex items-center gap-4" style={{ backgroundColor: `${green}0d`, borderColor: `${green}30` }}>
            <span className="font-mono text-sm font-bold" style={{ color: green }}>LAYER 04</span>
            <span className="text-lg font-display font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}>Verification & Learning</span>
          </div>
          <div className="p-6" style={{ backgroundColor: card }}>
            <p className="text-sm mb-6" style={{ color: fgMuted }}>
              Confirm the fix worked. Update your priors. The framework compounds over time — but only if learning is explicit.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "Time-based window", desc: "Monitor for N days/hours after deploy. No recurrence within window = verified." },
                { name: "Event-driven window", desc: "Wait for next triggering event (traffic spike, monthly batch, etc.)." },
                { name: "Metric confirmation", desc: "Define the exact metric that proves the fix worked before deploying." },
                { name: "Prior update", desc: "Feed the outcome back as evidence for the next investigation in the same domain." },
              ].map(({ name, desc }) => (
                <div key={name} className="rounded-lg p-3 border" style={{ borderColor: `${green}25`, backgroundColor: `${green}08` }}>
                  <div className="text-xs font-medium mb-0.5" style={{ color: green }}>{name}</div>
                  <div className="text-xs" style={{ color: fgMuted }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="mb-16">
        <p className="text-xs font-mono uppercase tracking-widest mb-6" style={{ color: fgDim }}>The Rules</p>
        <div className="space-y-3">
          {rules.map(({ rule, detail }) => (
            <div key={rule} className="rounded-lg p-5 border" style={{ backgroundColor: card, borderColor: border }}>
              <p className="font-medium text-sm" style={{ color: "#dce4f5" }}>{rule}</p>
              <p className="mt-1 text-sm" style={{ color: fgMuted }}>{detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Proofs link */}
      <div className="rounded-xl p-8 border text-center" style={{ borderColor: `${violet}30`, backgroundColor: `${violet}08` }}>
        <p className="text-sm font-medium mb-2" style={{ color: "#dce4f5" }}>Want the formal proofs?</p>
        <p className="text-sm mb-4" style={{ color: fgMuted }}>Seven proofs: termination, completeness, optimality, convergence, information gain.</p>
        <a href="https://github.com/damionrashford/htsa/tree/main/proofs" target="_blank" rel="noreferrer"
          className="text-sm no-underline" style={{ color: violet }}>
          View proofs on GitHub →
        </a>
      </div>
    </div>
  );
}
