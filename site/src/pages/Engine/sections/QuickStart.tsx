import { border, fgDim } from "@/lib/tokens";

function CL({ children }: { children: React.ReactNode }) {
  return <div className="leading-7">{children}</div>;
}
const kw = (s: string) => <span style={{ color: "oklch(0.68 0.22 272)" }}>{s}</span>;
const fn = (s: string) => <span style={{ color: "oklch(0.78 0.18 196)" }}>{s}</span>;
const str = (s: string) => <span style={{ color: "oklch(0.72 0.18 75)" }}>{s}</span>;
const cm = (s: string) => <span style={{ color: "#4a5e82", fontStyle: "italic" }}>{s}</span>;
const id = (s: string) => <span style={{ color: "#dce4f5" }}>{s}</span>;
const dim = (s: string) => <span style={{ color: "#8899bb" }}>{s}</span>;
const fst = (s: string) => <span style={{ color: "oklch(0.72 0.18 155)" }}>{s}</span>;

export function QuickStart() {
  return (
    <div className="mb-16">
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>
        Quick start — with an LLM (easiest)
      </p>
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: border }}>
        <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ backgroundColor: "#0f1628", borderColor: border }}>
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#1e2d4a" }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#1e2d4a" }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#1e2d4a" }} />
          <span className="ml-2 text-xs font-mono" style={{ color: fgDim }}>investigation.py</span>
        </div>
        <div className="p-5 text-sm font-mono overflow-x-auto" style={{ backgroundColor: "#080d1a", lineHeight: "1.75" }}>
          <CL>{kw("from")} {id("htsa_engine.llm")} {kw("import")} {fn("LLMAdvisor")}</CL>
          <CL>&nbsp;</CL>
          <CL>{id("advisor")} {dim("=")} {fn("LLMAdvisor")}(</CL>
          <CL>&nbsp;&nbsp;&nbsp;&nbsp;{str('"https://api.openai.com/v1"')},</CL>
          <CL>&nbsp;&nbsp;&nbsp;&nbsp;{id("api_key")}{dim("=")}{str('"sk-..."')},</CL>
          <CL>&nbsp;&nbsp;&nbsp;&nbsp;{id("model")}{dim("=")}{str('"gpt-4o"')}</CL>
          <CL>)</CL>
          <CL>&nbsp;</CL>
          <CL>{cm("# One call — all 4 layers")}</CL>
          <CL>{id("inv")} {dim("=")} {id("advisor")}.{fn("run")}(</CL>
          <CL>&nbsp;&nbsp;&nbsp;&nbsp;{str('"API returning 500 errors since 2:47 AM, EU region only"')}</CL>
          <CL>)</CL>
          <CL>&nbsp;</CL>
          <CL>{fn("print")}({fst("f")}{str('"Root causes: {[n.statement for n in inv.root_causes]}"')})</CL>
          <CL>{fn("print")}({fst("f")}{str('"Entropy: {inv.entropy:.3f}"')})</CL>
          <CL>&nbsp;</CL>
          <CL>{id("inv")}.{fn("save")}({str('"investigation.json"')})</CL>
          <CL>{id("inv")}.{fn("save_markdown")}({str('"investigation.md"')})</CL>
        </div>
      </div>
    </div>
  );
}
