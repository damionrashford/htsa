import { teal, fg, fgMuted } from "@/lib/tokens";

export function ResearchCTA() {
  return (
    <div
      className="mt-16 rounded-xl p-8 border text-center"
      style={{ borderColor: `${teal}30`, backgroundColor: `${teal}08` }}
    >
      <p className="text-sm font-medium mb-2" style={{ color: fg }}>Research foundations</p>
      <p className="text-sm mb-4" style={{ color: fgMuted }}>
        12 paper summaries covering HP2015, NESS, PNS, causal entropy, heredity priors, and more.
        Each gap in the original framework is documented, traced to a paper, and closed by a specific implementation phase.
      </p>
      <a
        href="https://github.com/damionrashford/htsa/tree/main/research"
        target="_blank"
        rel="noreferrer"
        className="text-sm no-underline"
        style={{ color: teal }}
      >
        Browse the research library →
      </a>
    </div>
  );
}
