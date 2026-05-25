import { Link } from "react-router";
import { teal, violet, border, fgMuted, fgDim } from "@/lib/tokens";
import { Tag } from "@/components/ui/Tag";
import hero from "../assets/hero.png";

// Syntax-highlighted spans for the code preview
function CodeLine({ children }: { children: React.ReactNode }) {
  return <div className="leading-7">{children}</div>;
}
const kw = (s: string) => <span style={{ color: "oklch(0.68 0.22 272)" }}>{s}</span>;
const fn = (s: string) => <span style={{ color: "oklch(0.78 0.18 196)" }}>{s}</span>;
const str = (s: string) => <span style={{ color: "oklch(0.72 0.18 75)" }}>{s}</span>;
const cm = (s: string) => <span style={{ color: "#4a5e82", fontStyle: "italic" }}>{s}</span>;
const id = (s: string) => <span style={{ color: "#dce4f5" }}>{s}</span>;
const dim = (s: string) => <span style={{ color: "#8899bb" }}>{s}</span>;

export function Hero() {
  return (
    <div className="relative overflow-hidden" style={{ borderBottom: `1px solid ${border}` }}>
      {/* Background layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `url(${hero})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.18 }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #080d1a00 0%, #080d1a 100%)" }}
      />
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, oklch(0.72 0.20 196 / 0.07) 1px, transparent 0)", backgroundSize: "32px 32px" }}
      />
      <div
        className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${teal}18 0%, transparent 70%)`, filter: "blur(40px)" }}
      />
      <div
        className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${violet}15 0%, transparent 70%)`, filter: "blur(40px)" }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-28 text-center">
        <Tag>Root Cause Analysis · v2.0.0</Tag>

        <h1
          className="mt-8 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span style={{ color: "#dce4f5" }}>How to Solve</span>{" "}
          <span style={{
            background: `linear-gradient(135deg, ${teal}, ${violet})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Anything
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: fgMuted }}>
          A structured root cause analysis framework combining the 5 Ws and 5 Whys.<br />
          <span style={{ color: "#dce4f5" }}>Not a template. An algorithm.</span>
        </p>
        <p className="mt-2 text-base max-w-xl mx-auto" style={{ color: fgDim }}>
          Bayesian probability at every node · Causal inference at every edge · LLM-assisted or fully manual
        </p>

        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            to="/algorithm"
            className="px-6 py-3 rounded-lg font-medium text-sm no-underline"
            style={{ backgroundColor: teal, color: "#080d1a" }}
            onMouseEnter={e => { (e.target as HTMLElement).style.opacity = "0.85"; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.opacity = "1"; }}
          >
            Learn the Algorithm →
          </Link>
          <Link
            to="/engine"
            className="px-6 py-3 rounded-lg font-medium text-sm border no-underline"
            style={{ borderColor: border, color: "#dce4f5" }}
            onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = `${teal}60`; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = border; }}
          >
            Use the Engine
          </Link>
        </div>

        {/* Code window */}
        <div className="mt-14 max-w-2xl mx-auto text-left">
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: border }}>
            <div
              className="flex items-center gap-2 px-4 py-2.5 border-b"
              style={{ backgroundColor: "#0f1628", borderColor: border }}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#1e2d4a" }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#1e2d4a" }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#1e2d4a" }} />
              <span className="ml-2 text-xs font-mono" style={{ color: fgDim }}>quick start</span>
            </div>
            <div
              className="p-5 text-sm font-mono overflow-x-auto"
              style={{ backgroundColor: "#080d1a", lineHeight: "1.75" }}
            >
              <CodeLine>{kw("from")} {id("htsa_engine.llm")} {kw("import")} {fn("LLMAdvisor")}</CodeLine>
              <CodeLine>&nbsp;</CodeLine>
              <CodeLine>{id("advisor")} {dim("=")} {fn("LLMAdvisor")}(</CodeLine>
              <CodeLine>&nbsp;&nbsp;&nbsp;&nbsp;{str('"https://api.openai.com/v1"')},</CodeLine>
              <CodeLine>&nbsp;&nbsp;&nbsp;&nbsp;{id("api_key")}{dim("=")}{str('"sk-..."')},</CodeLine>
              <CodeLine>&nbsp;&nbsp;&nbsp;&nbsp;{id("model")}{dim("=")}{str('"gpt-4o"')}</CodeLine>
              <CodeLine>)</CodeLine>
              <CodeLine>&nbsp;</CodeLine>
              <CodeLine>{cm("# One call — all 4 layers")}</CodeLine>
              <CodeLine>{id("inv")} {dim("=")} {id("advisor")}.{fn("run")}(</CodeLine>
              <CodeLine>&nbsp;&nbsp;&nbsp;&nbsp;{str('"API returning 500 errors since 2:47 AM, EU region only"')}</CodeLine>
              <CodeLine>)</CodeLine>
              <CodeLine>&nbsp;</CodeLine>
              <CodeLine>{fn("print")}({id("inv")}.{id("root_causes")})&nbsp;&nbsp;&nbsp;{cm("# what to fix")}</CodeLine>
              <CodeLine>{fn("print")}({id("inv")}.{id("entropy")})&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{cm("# investigation confidence")}</CodeLine>
              <CodeLine>{id("inv")}.{fn("save")}({str('"postmortem.json"')})</CodeLine>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
