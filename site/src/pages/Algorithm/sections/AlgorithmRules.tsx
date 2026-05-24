import { border, card, fg, fgDim, fgMuted } from "@/lib/tokens";

const rules = [
  {
    rule: "Map before you drill.",
    detail: "Complete the 5 Ws before starting the 5 Whys. The Situation Map prevents anchoring bias.",
  },
  {
    rule: "Evidence at every node.",
    detail: "An assertion without evidence is a guess — tier your evidence (physical → observational → inferential → testimonial).",
  },
  {
    rule: "Branch when reality branches.",
    detail: "Real incidents have multiple root causes. Follow all of them. Do not force a single chain.",
  },
  {
    rule: "5 is a heuristic, not a rule.",
    detail: "Stop when you reach something you can actually change. Depth is determined by the four criteria, not a count.",
  },
  {
    rule: "The counterfactual test closes the loop.",
    detail: "If the fix had existed before the problem occurred, would the problem still have happened? If yes, go deeper.",
  },
  {
    rule: "The framework is recursive.",
    detail: "A root cause can become a new incident. Run the algorithm again from Layer 1.",
  },
];

export function AlgorithmRules() {
  return (
    <div className="mb-16">
      <p className="text-xs font-mono uppercase tracking-widest mb-6" style={{ color: fgDim }}>
        The Rules
      </p>
      <div className="space-y-3">
        {rules.map(({ rule, detail }) => (
          <div
            key={rule}
            className="rounded-lg p-5 border"
            style={{ backgroundColor: card, borderColor: border }}
          >
            <p className="font-medium text-sm" style={{ color: fg }}>{rule}</p>
            <p className="mt-1 text-sm" style={{ color: fgMuted }}>{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
