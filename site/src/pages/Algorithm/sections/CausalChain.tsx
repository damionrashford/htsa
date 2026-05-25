import { teal, violet, amber, bg, border, fgMuted, fgDim, alpha } from "@/lib/tokens";
import { LayerCard } from "../components/LayerCard";

const depthCriteria = [
  { name: "Actionability", desc: "A concrete change addresses this node — it's within your power to change." },
  { name: "Counterfactual Clarity", desc: "If this cause hadn't existed, the problem would not have occurred." },
  { name: "System Boundary", desc: "The cause is inside the system's control, not an external given." },
  { name: "Diminishing Returns", desc: "Going one Why deeper would not change the action you take." },
];

const strategies = [
  { name: "Best-First", desc: "Follow highest probability branch first", color: teal },
  { name: "DFS", desc: "Go deep on one branch before exploring", color: violet },
  { name: "BFS", desc: "Explore all branches at equal depth", color: amber },
];

const WHY_TREE = `Why (surface)
  └─► Why 1
        └─► Why 2
              └─► Why 3
                    ├─► Why 4a: ROOT
                    └─► Why 4b: ROOT`;

export function CausalChain() {
  return (
    <LayerCard num="LAYER 02" title="Causal Chain — The 5 Whys" color={violet}>
      <p className="text-base mb-6 leading-relaxed" style={{ color: fgMuted }}>
        Start at the surface Why from Layer 1. Ask why again. Keep going until you hit something
        you can actually change — defined by four explicit depth criteria, not a count of five.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-mono mb-3 uppercase tracking-wider" style={{ color: fgDim }}>
            The Why tree
          </p>
          <pre
            className="text-sm"
            style={{ backgroundColor: bg, border: `1px solid ${border}`, borderRadius: 8, padding: "1rem", margin: 0 }}
          >
            {WHY_TREE}
          </pre>
          <p className="text-xs mt-2" style={{ color: fgDim }}>Whys branch. Real problems are multi-cause.</p>
        </div>
        <div>
          <p className="text-xs font-mono mb-3 uppercase tracking-wider" style={{ color: fgDim }}>
            Four depth criteria (all must pass)
          </p>
          <div className="space-y-2">
            {depthCriteria.map(({ name, desc }) => (
              <div
                key={name}
                className="rounded-lg p-3 border"
                style={{ borderColor: alpha(violet, 15), backgroundColor: alpha(violet, 5) }}
              >
                <div className="text-xs font-medium mb-0.5" style={{ color: violet }}>{name}</div>
                <div className="text-xs" style={{ color: fgMuted }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-lg p-4 border" style={{ borderColor: border, backgroundColor: bg }}>
        <p className="text-xs font-mono mb-2" style={{ color: fgDim }}>Search strategy</p>
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          {strategies.map(({ name, desc, color }) => (
            <div
              key={name}
              className="rounded p-2"
              style={{ backgroundColor: alpha(color, 6), border: `1px solid ${alpha(color, 19)}` }}
            >
              <div className="font-mono font-medium mb-0.5" style={{ color }}>{name}</div>
              <div style={{ color: fgDim }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </LayerCard>
  );
}
