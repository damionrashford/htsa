import { teal, violet, border, card, fgDim, fgMuted } from "@/lib/tokens";

const rows = [
  { method: "setSituation()", judgment: "Decompose problem into 5 Ws", advisor: "analyzeSituation()" },
  { method: "addHypothesis()", judgment: "Generate Why + assign prior", advisor: "generateHypotheses()" },
  { method: "addEvidence()", judgment: "Classify tier and direction", advisor: "classifyEvidence()" },
  { method: "markRootCause()", judgment: "Evaluate 4 depth criteria", advisor: "evaluateDepthCriteria()" },
  { method: "resolve()", judgment: "Propose fix/mitigate/accept", advisor: "proposeResolution()" },
  { method: "testFixCounterfactual()", judgment: "Would fix prevent recurrence?", advisor: "evaluateCounterfactual()" },
  { method: "addVerification()", judgment: "Define verification window", advisor: "proposeVerification()" },
];

export function BoundaryTable() {
  return (
    <div className="mb-10 sm:mb-16">
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>
        The engine / LLM boundary
      </p>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: border }}>
        <div
          className="grid grid-cols-3 text-xs font-mono px-4 py-2.5 border-b"
          style={{ backgroundColor: "var(--color-paper-2)", borderColor: border, color: fgDim }}
        >
          <span>Engine method</span>
          <span>Judgment needed</span>
          <span>Advisor method</span>
        </div>
        {rows.map((row, i) => (
          <div
            key={row.method}
            className="grid grid-cols-3 px-4 py-3 border-b last:border-b-0 text-xs"
            style={{ backgroundColor: i % 2 === 0 ? card : "var(--color-paper-2)", borderColor: border }}
          >
            <code style={{ color: teal }}>{row.method}</code>
            <span style={{ color: fgMuted }}>{row.judgment}</span>
            <code style={{ color: violet }}>{row.advisor}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
