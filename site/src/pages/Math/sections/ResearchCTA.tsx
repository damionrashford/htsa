import { teal, fg, fgMuted, alpha } from "@/lib/tokens";

export function ResearchCTA() {
  return (
    <div
      className="mt-16 rounded-xl p-8 border text-center"
      style={{ borderColor: alpha(teal, 19), backgroundColor: alpha(teal, 5) }}
    >
      <p className="text-base font-medium mb-2" style={{ color: fg }}>Research foundations</p>
      <p className="text-base mb-5 leading-relaxed" style={{ color: fgMuted }}>
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
