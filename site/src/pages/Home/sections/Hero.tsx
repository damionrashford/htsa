import { Link } from "react-router";
import { teal, violet, border, fgMuted, fgDim, alpha } from "@/lib/tokens";
import { Tag } from "@/components/ui/Tag";
import hero from "../assets/hero.png";

function CodeLine({ children }: { children: React.ReactNode }) {
  return <div className="leading-7">{children}</div>;
}
const kw  = (s: string) => <span style={{ color: "oklch(0.68 0.22 272)" }}>{s}</span>;
const fn  = (s: string) => <span style={{ color: "oklch(0.78 0.18 196)" }}>{s}</span>;
const str = (s: string) => <span style={{ color: "oklch(0.78 0.18 75)" }}>{s}</span>;
const cm  = (s: string) => <span style={{ color: "var(--color-fg-dim)", fontStyle: "italic" }}>{s}</span>;
const id  = (s: string) => <span style={{ color: "var(--color-fg)" }}>{s}</span>;
const dim = (s: string) => <span style={{ color: "var(--color-fg-muted)" }}>{s}</span>;

export function Hero() {
  return (
    <div className="relative overflow-hidden" style={{ borderBottom: `1px solid ${border}` }}>
      {/* Background layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `url(${hero})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15 }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent 0%, var(--color-paper) 100%)" }}
      />
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, oklch(0.72 0.20 196 / 0.10) 1px, transparent 0)", backgroundSize: "28px 28px" }}
      />
      <div
        className="absolute top-1/3 left-1/4 w-md h-112 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${alpha(teal, 8)} 0%, transparent 70%)`, filter: "blur(48px)" }}
      />
      <div
        className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${alpha(violet, 6)} 0%, transparent 70%)`, filter: "blur(40px)" }}
      />

      <div className="relative max-w-[90rem] mx-auto px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
        <Tag>Root Cause Analysis · v2.0.0</Tag>

        <h1
          className="mt-8 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span style={{ color: "var(--color-fg)" }}>How to Solve</span>{" "}
          <span style={{
            background: `linear-gradient(135deg, ${teal} 20%, ${violet} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Anything
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl w-full max-w-2xl mx-auto leading-relaxed" style={{ color: fgMuted, marginInline: "auto" }}>
          A structured root cause analysis framework combining the 5 Ws and 5 Whys.<br />
          <strong style={{ color: teal, fontWeight: 600 }}>Not a template. An algorithm.</strong>
        </p>
        <p className="mt-2 text-sm w-full max-w-xl mx-auto" style={{ color: fgDim, marginInline: "auto" }}>
          Bayesian probability at every node · Causal inference at every edge · LLM-assisted or fully manual
        </p>

        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            to="/algorithm"
            className="px-6 py-3 rounded-lg font-medium text-sm no-underline"
            style={{
              backgroundColor: teal,
              color: "var(--color-paper)",
              transition: "transform 150ms cubic-bezier(0.16,1,0.3,1), opacity 100ms",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.opacity = "0.92";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.opacity = "1";
            }}
            onMouseDown={e => { e.currentTarget.style.transform = "translateY(0) scale(0.98)"; }}
            onMouseUp={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
          >
            Learn the Algorithm →
          </Link>
          <Link
            to="/engine"
            className="px-6 py-3 rounded-lg font-medium text-sm border no-underline"
            style={{
              borderColor: `${border}`,
              color: "var(--color-fg)",
              transition: "border-color 150ms cubic-bezier(0.16,1,0.3,1), transform 150ms cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = alpha(teal, 38);
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = border;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Use the Engine
          </Link>
        </div>

        {/* Stats strip */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-x-10 gap-y-5 max-w-xs sm:max-w-none mx-auto">
          {[
            { value: "10", label: "Math foundations" },
            { value: "7", label: "Formal proofs" },
            { value: "6+", label: "Domains" },
            { value: "4", label: "Layers" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div
                className="text-2xl font-bold font-mono"
                style={{
                  background: `linear-gradient(135deg, ${teal}, ${violet})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {value}
              </div>
              <div className="text-xs mt-0.5" style={{ color: fgDim }}>{label}</div>
            </div>
          ))}
        </div>

        {/* TypeScript code window */}
        <div className="mt-10 max-w-2xl mx-auto text-left">
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: border }}>
            <div
              className="flex items-center gap-2 px-4 py-2.5 border-b"
              style={{ backgroundColor: "var(--color-code-bar)", borderColor: border }}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#febc2e" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#28c840" }} />
              <span className="ml-2 text-xs font-mono" style={{ color: fgDim }}>quick-start.ts</span>
            </div>
            <div
              className="p-5 text-sm font-mono overflow-x-auto"
              style={{ backgroundColor: "var(--color-code-bg)", lineHeight: "1.8" }}
            >
              <CodeLine>{kw("import")} {dim("{")} {id("Investigation")} {dim("}")} {kw("from")} {str('"htsa"')}</CodeLine>
              <CodeLine>&nbsp;</CodeLine>
              <CodeLine>{kw("const")} {id("inv")} {dim("=")} {kw("new")} {fn("Investigation")}({dim("{")}</CodeLine>
              <CodeLine>&nbsp;&nbsp;{id("problem")}{dim(":")} {str('"API returning 500 errors since 2:47 AM, EU region only"')}{dim(",")}</CodeLine>
              <CodeLine>&nbsp;&nbsp;{id("provider")}{dim(":")} {str('"anthropic"')}{dim(",")}</CodeLine>
              <CodeLine>{dim("}")})</CodeLine>
              <CodeLine>&nbsp;</CodeLine>
              <CodeLine>{cm("// Run all 4 layers — returns typed result")}</CodeLine>
              <CodeLine>{kw("const")} {id("result")} {dim("=")} {kw("await")} {id("inv")}{dim(".")}{fn("run")}()</CodeLine>
              <CodeLine>&nbsp;</CodeLine>
              <CodeLine>{fn("console")}{dim(".")}{fn("log")}({id("result")}{dim(".")}{id("rootCauses")})&nbsp;&nbsp;{cm("// what to fix")}</CodeLine>
              <CodeLine>{fn("console")}{dim(".")}{fn("log")}({id("result")}{dim(".")}{id("entropy")})&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{cm("// confidence score")}</CodeLine>
              <CodeLine>{kw("await")} {id("result")}{dim(".")}{fn("save")}({str('"postmortem.json"')})</CodeLine>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
