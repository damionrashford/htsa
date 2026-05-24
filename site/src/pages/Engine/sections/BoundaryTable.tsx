import { teal, violet, border, card, fgDim, fgMuted } from "@/lib/tokens";

const rows = [
  { method: "set_situation()", judgment: "Decompose problem into 5 Ws", advisor: "analyze_situation()" },
  { method: "add_hypothesis()", judgment: "Generate Why + assign prior", advisor: "generate_hypotheses()" },
  { method: "add_evidence()", judgment: "Classify tier and direction", advisor: "classify_evidence()" },
  { method: "mark_root_cause()", judgment: "Evaluate 4 depth criteria", advisor: "evaluate_depth_criteria()" },
  { method: "resolve()", judgment: "Propose fix/mitigate/accept", advisor: "propose_resolution()" },
  { method: "test_fix_counterfactual()", judgment: "Would fix prevent recurrence?", advisor: "evaluate_counterfactual()" },
  { method: "add_verification()", judgment: "Define verification window", advisor: "propose_verification()" },
];

export function BoundaryTable() {
  return (
    <div className="mb-16">
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>
        The engine / LLM boundary
      </p>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: border }}>
        <div
          className="grid grid-cols-3 text-xs font-mono px-4 py-2.5 border-b"
          style={{ backgroundColor: "#0f1628", borderColor: border, color: fgDim }}
        >
          <span>Engine method</span>
          <span>Judgment needed</span>
          <span>LLMAdvisor method</span>
        </div>
        {rows.map((row, i) => (
          <div
            key={row.method}
            className="grid grid-cols-3 px-4 py-3 border-b last:border-b-0 text-xs"
            style={{ backgroundColor: i % 2 === 0 ? card : "#0d1525", borderColor: border }}
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
