import { violet, teal, border, fg, fgMuted, fgDim, alpha } from "@/lib/tokens";

const proofs = [
  { num: "01", name: "Termination",       desc: "Algorithm terminates in finite steps" },
  { num: "02", name: "Completeness",      desc: "All causes above threshold are found" },
  { num: "03", name: "Optimality",        desc: "Greedy-optimal traversal given priors" },
  { num: "04", name: "Convergence",       desc: "Bayesian beliefs converge via Doob (1949)" },
  { num: "05", name: "Information Gain",  desc: "Each correct Why reduces entropy H(G)" },
  { num: "06", name: "Causal Soundness",  desc: "HP2015 + NESS + PNS formalization" },
  { num: "07", name: "Coverage Bounds",   desc: "Minimal fix set achieves coverage ≥ θ" },
];

export function ProofsCTA() {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: alpha(violet, 19) }}
    >
      {/* Header */}
      <div
        className="px-6 py-5 border-b"
        style={{ backgroundColor: alpha(violet, 5), borderColor: alpha(violet, 15) }}
      >
        <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: fgDim }}>
          Formal proofs
        </p>
        <p className="text-base font-semibold" style={{ color: fg }}>
          Seven proofs — termination, completeness, optimality, convergence, information gain.
        </p>
        <p className="text-base mt-2 leading-relaxed" style={{ color: fgMuted }}>
          Each gap in the original framework is documented, traced to a paper, and closed with a specific proof.
        </p>
      </div>

      {/* Proof list */}
      <div>
        {proofs.map((p, i) => (
          <div
            key={p.num}
            className="flex items-center gap-4 px-5 py-3 border-b last:border-b-0"
            style={{
              borderColor: alpha(violet, 10),
              backgroundColor: i % 2 === 0 ? "var(--color-card)" : "var(--color-paper-2)",
            }}
          >
            <span className="text-xs font-mono tabular-nums shrink-0" style={{ color: alpha(violet, 50) }}>
              {p.num}
            </span>
            <span className="text-sm font-medium flex-1" style={{ color: violet }}>{p.name}</span>
            <span className="text-xs text-right" style={{ color: fgMuted }}>{p.desc}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: alpha(border, 30), borderTop: `1px solid ${alpha(violet, 10)}` }}
      >
        <span className="text-xs" style={{ color: fgDim }}>
          Proofs reference HP2015, NESS, Doob (1949), and Shannon entropy.
        </span>
        <a
          href="https://github.com/damionrashford/htsa/tree/main/proofs"
          target="_blank"
          rel="noreferrer"
          className="text-sm no-underline shrink-0 ml-4"
          style={{
            color: teal,
            transition: "opacity 120ms",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.7"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >
          View proofs on GitHub →
        </a>
      </div>
    </div>
  );
}
