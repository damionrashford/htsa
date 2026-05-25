import { teal, violet, amber, border, fg, fgDim, fgMuted, alpha } from "@/lib/tokens";
import { Section } from "@/components/ui/Section";

export function CoreInsight() {
  return (
    <Section className="py-12 sm:py-20 text-center">
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="h-px flex-1 max-w-24" style={{ background: `linear-gradient(to right, transparent, ${border})` }} />
        <span className="text-xs font-mono uppercase tracking-widest" style={{ color: fgDim }}>The Core Insight</span>
        <div className="h-px flex-1 max-w-24" style={{ background: `linear-gradient(to left, transparent, ${border})` }} />
      </div>

      <div className="max-w-3xl mx-auto">
        <h2
          className="text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: fg }}
        >
          Every problem has{" "}
          <span style={{
            background: `linear-gradient(135deg, ${teal}, ${violet})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            the same anatomy.
          </span>
        </h2>

        <div className="flex justify-center my-4 sm:my-8">
          <div className="w-px h-10 sm:h-12" style={{ background: `linear-gradient(to bottom, ${alpha(teal, 38)}, transparent)` }} />
        </div>

        <p className="text-lg w-full max-w-2xl mx-auto leading-relaxed" style={{ color: fgMuted, marginInline: "auto" }}>
          The vocabulary changes. The causal structure never does.{" "}
          <strong style={{ color: fg, fontWeight: 500 }}>The 5 Ws</strong> tell you what happened.{" "}
          <strong style={{ color: fg, fontWeight: 500 }}>The 5 Whys</strong> tell you why it happened.{" "}
          Together they reveal <strong style={{ color: fg, fontWeight: 500 }}>what to fix — and in what order.</strong>
        </p>

        {/* Framework equation */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-10 px-5 py-5 rounded-xl border"
          style={{ borderColor: alpha(border, 60), backgroundColor: alpha(border, 8) }}
        >
          {/* 5 Ws cluster */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-1.5">
              {["Who", "What", "When"].map(w => (
                <span
                  key={w}
                  className="text-xs font-mono font-semibold px-2 py-0.5 rounded"
                  style={{ backgroundColor: alpha(teal, 8), color: teal, border: `1px solid ${alpha(teal, 18)}` }}
                >
                  {w}
                </span>
              ))}
            </div>
            <div className="flex gap-1.5 mt-1">
              {["Where", "Why"].map(w => (
                <span
                  key={w}
                  className="text-xs font-mono font-semibold px-2 py-0.5 rounded"
                  style={{ backgroundColor: alpha(teal, 8), color: teal, border: `1px solid ${alpha(teal, 18)}` }}
                >
                  {w}
                </span>
              ))}
            </div>
            <span className="text-xs mt-1.5" style={{ color: fgDim }}>5 Ws</span>
          </div>

          <div className="text-lg font-light leading-none" style={{ color: fgDim }}>×</div>

          {/* 5 Whys cluster */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-1.5">
              {["Why¹", "Why²", "Why³"].map(w => (
                <span
                  key={w}
                  className="text-xs font-mono font-semibold px-2 py-0.5 rounded"
                  style={{ backgroundColor: alpha(violet, 8), color: violet, border: `1px solid ${alpha(violet, 18)}` }}
                >
                  {w}
                </span>
              ))}
            </div>
            <div className="flex gap-1.5 mt-1">
              {["Why⁴", "Why⁵"].map(w => (
                <span
                  key={w}
                  className="text-xs font-mono font-semibold px-2 py-0.5 rounded"
                  style={{ backgroundColor: alpha(violet, 8), color: violet, border: `1px solid ${alpha(violet, 18)}` }}
                >
                  {w}
                </span>
              ))}
            </div>
            <span className="text-xs mt-1.5" style={{ color: fgDim }}>5 Whys</span>
          </div>

          <div className="text-lg font-light leading-none" style={{ color: fgDim }}>=</div>

          {/* Result — the payoff; visually dominant */}
          <div className="flex flex-col items-center gap-1">
            <span
              className="text-base font-mono font-bold px-5 py-2 rounded-xl"
              style={{
                backgroundColor: alpha(amber, 14),
                color: amber,
                border: `1.5px solid ${alpha(amber, 42)}`,
                boxShadow: `0 0 0 4px ${alpha(amber, 7)}, 0 0 22px ${alpha(amber, 24)}`,
              }}
            >
              Root Cause
            </span>
            <span className="text-xs mt-1" style={{ color: fgDim }}>+ fix order</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
