import { Link } from "react-router";
import { teal, violet, border, card, fg, fgDim, fgMuted, alpha } from "@/lib/tokens";
import { Tag } from "@/components/ui/Tag";

const stats = [
  { value: "4", label: "Layers" },
  { value: "10", label: "Math foundations" },
  { value: "7", label: "Formal proofs" },
  { value: "6+", label: "Domains" },
];

const features = [
  { icon: "⬡", label: "Provider-agnostic", desc: "OpenAI · Anthropic · Groq · Ollama" },
  { icon: "◈", label: "Fully manual mode", desc: "Drive every decision yourself" },
  { icon: "∿", label: "Bayesian engine", desc: "Probability at every node" },
  { icon: "◉", label: "Zero dependencies", desc: "TypeScript, stdlib only" },
];

export function EngineCTA() {
  return (
    <section className="py-12 sm:py-20 border-t" style={{ borderColor: border }}>
      <div className="max-w-[90rem] mx-auto px-6">
        <div
          className="rounded-2xl p-6 sm:p-14 text-center relative overflow-hidden border"
          style={{ backgroundColor: card, borderColor: alpha(teal, 16) }}
        >
          {/* Glows */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${alpha(teal, 7)} 0%, transparent 60%)` }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 80% 100%, ${alpha(violet, 5)} 0%, transparent 55%)` }}
          />

          <div className="relative">
            <Tag>TypeScript · v2.0.0 · Zero dependencies</Tag>
            <h2
              className="mt-6 text-3xl sm:text-4xl font-bold"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: fg }}
            >
              The algorithm, codified.
            </h2>
            <p className="mt-4 text-base w-full max-w-xl mx-auto leading-relaxed" style={{ color: fgMuted, marginInline: "auto" }}>
              A TypeScript library implementing every layer of HTSA. Works with any LLM provider or fully manual — complete control over every decision.
            </p>

            {/* Stats row */}
            <div className="flex justify-center gap-6 sm:gap-8 mt-6 sm:mt-8 flex-wrap">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold font-mono" style={{ color: teal }}>{value}</div>
                  <div className="text-xs mt-0.5" style={{ color: fgDim }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 text-left max-w-2xl mx-auto">
              {features.map(({ icon, label, desc }) => (
                <div
                  key={label}
                  className="rounded-lg px-3 py-3 border"
                  style={{ borderColor: alpha(border, 60), backgroundColor: alpha(border, 8) }}
                >
                  <span className="text-lg block mb-1.5" style={{ color: teal }}>{icon}</span>
                  <div className="text-xs font-semibold mb-0.5" style={{ color: fg }}>{label}</div>
                  <div className="text-xs leading-relaxed" style={{ color: fgDim }}>{desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link
                to="/engine"
                className="px-6 py-3 rounded-lg font-medium text-sm no-underline"
                style={{
                  backgroundColor: teal,
                  color: "var(--color-paper)",
                  transition: "transform 150ms cubic-bezier(0.16,1,0.3,1), opacity 100ms",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.opacity = "1";
                }}
              >
                Engine docs →
              </Link>
              <a
                href="https://github.com/damionrashford/htsa"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-lg font-medium text-sm border no-underline"
                style={{
                  borderColor: border,
                  color: fg,
                  transition: "border-color 150ms cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = alpha(teal, 33); }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; }}
              >
                View source ↗
              </a>
            </div>

            {/* Quick install */}
            <div className="mt-8 max-w-sm mx-auto">
              <div className="rounded-lg border overflow-hidden text-left" style={{ borderColor: border }}>
                <div
                  className="px-4 py-2 border-b flex items-center gap-2"
                  style={{ backgroundColor: "var(--color-code-bar)", borderColor: border }}
                >
                  <span className="text-xs font-mono" style={{ color: fgMuted }}>terminal</span>
                </div>
                <div
                  className="px-4 py-3 font-mono text-sm"
                  style={{ backgroundColor: "var(--color-code-bg)", color: teal }}
                >
                  bun add htsa
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
