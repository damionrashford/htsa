import { violet, fg, fgMuted } from "@/lib/tokens";

export function ProofsCTA() {
  return (
    <div
      className="rounded-xl p-8 border text-center"
      style={{ borderColor: `${violet}30`, backgroundColor: `${violet}08` }}
    >
      <p className="text-sm font-medium mb-2" style={{ color: fg }}>Want the formal proofs?</p>
      <p className="text-sm mb-4" style={{ color: fgMuted }}>
        Seven proofs: termination, completeness, optimality, convergence, information gain.
      </p>
      <a
        href="https://github.com/damionrashford/htsa/tree/main/proofs"
        target="_blank"
        rel="noreferrer"
        className="text-sm no-underline"
        style={{ color: violet }}
      >
        View proofs on GitHub →
      </a>
    </div>
  );
}
