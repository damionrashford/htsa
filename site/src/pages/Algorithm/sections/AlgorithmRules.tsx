import { teal, border, fg, fgDim, fgMuted, alpha } from "@/lib/tokens";

const rules = [
  {
    num: "01",
    rule: "Map before you drill.",
    detail: "Complete the 5 Ws before starting the 5 Whys. The Situation Map prevents anchoring bias.",
  },
  {
    num: "02",
    rule: "Evidence at every node.",
    detail: "An assertion without evidence is a guess — tier your evidence (physical → observational → inferential → testimonial).",
  },
  {
    num: "03",
    rule: "Branch when reality branches.",
    detail: "Real incidents have multiple root causes. Follow all of them. Do not force a single chain.",
  },
  {
    num: "04",
    rule: "5 is a heuristic, not a rule.",
    detail: "Stop when you reach something you can actually change. Depth is determined by the four criteria, not a count.",
  },
  {
    num: "05",
    rule: "The counterfactual test closes the loop.",
    detail: "If the fix had existed before the problem occurred, would the problem still have happened? If yes, go deeper.",
  },
  {
    num: "06",
    rule: "The framework is recursive.",
    detail: "A root cause can become a new incident. Run the algorithm again from Layer 1.",
  },
];

export function AlgorithmRules() {
  return (
    <div className="mb-10 sm:mb-16">
      <p className="text-xs font-mono uppercase tracking-widest mb-6" style={{ color: fgDim }}>
        The Rules
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rules.map(({ num, rule, detail }) => (
          <div
            key={rule}
            className="rounded-lg p-5 border"
            style={{
              backgroundColor: "var(--color-paper-2)",
              borderColor: alpha(border, 50),
              borderLeft: `2px solid ${alpha(teal, 25)}`,
              transition: "border-left-color 150ms cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderLeftColor = teal; }}
            onMouseLeave={e => { e.currentTarget.style.borderLeftColor = alpha(teal, 25); }}
          >
            <div className="flex items-start gap-3">
              <span className="text-xs font-mono mt-0.5 shrink-0" style={{ color: alpha(teal, 38) }}>{num}</span>
              <div>
                <p className="font-semibold text-sm" style={{ color: fg }}>{rule}</p>
                <p className="mt-1.5 text-xs leading-relaxed" style={{ color: fgMuted }}>{detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
