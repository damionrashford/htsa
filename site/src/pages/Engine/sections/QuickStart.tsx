import { border, fgDim } from "@/lib/tokens";

function CL({ children }: { children: React.ReactNode }) {
  return <div className="leading-7">{children}</div>;
}
const kw = (s: string) => <span style={{ color: "oklch(0.68 0.22 272)" }}>{s}</span>;
const fn = (s: string) => <span style={{ color: "oklch(0.78 0.18 196)" }}>{s}</span>;
const str = (s: string) => <span style={{ color: "oklch(0.72 0.18 75)" }}>{s}</span>;
const cm = (s: string) => <span style={{ color: "var(--color-fg-dim)", fontStyle: "italic" }}>{s}</span>;
const id = (s: string) => <span style={{ color: "var(--color-fg)" }}>{s}</span>;
const dim = (s: string) => <span style={{ color: "var(--color-fg-muted)" }}>{s}</span>;
const fst = (s: string) => <span style={{ color: "oklch(0.72 0.18 155)" }}>{s}</span>;

export function QuickStart() {
  return (
    <div className="mb-10 sm:mb-16">
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>
        Quick start — with an LLM (easiest)
      </p>
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: border }}>
        <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ backgroundColor: "var(--color-code-bar)", borderColor: border }}>
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "oklch(0.65 0.22 25 / 25%)" }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "oklch(0.78 0.18 75 / 25%)" }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "oklch(0.72 0.18 155 / 25%)" }} />
          <span className="ml-2 text-xs font-mono" style={{ color: fgDim }}>quick-start.ts</span>
        </div>
        <div className="p-5 text-sm font-mono overflow-x-auto" style={{ backgroundColor: "var(--color-code-bg)", lineHeight: "1.75" }}>
          <CL>{kw("import")} {dim("{")} {fn("Investigation")} {dim("}")} {kw("from")} {str('"htsa"')}{dim(";")}</CL>
          <CL>&nbsp;</CL>
          <CL>{kw("const")} {id("inv")} {dim("=")} {kw("new")} {fn("Investigation")}({dim("{")}</CL>
          <CL>&nbsp;&nbsp;{id("problem")}{dim(":")} {str('"API returning 500 errors since 2:47 AM, EU region only"')}{dim(",")}</CL>
          <CL>&nbsp;&nbsp;{id("provider")}{dim(":")} {dim("{")} {id("baseUrl")}{dim(":")} {str('"https://api.openai.com/v1"')}{dim(",")} {id("apiKey")}{dim(":")} {str('"sk-..."')}{dim(",")} {id("model")}{dim(":")} {str('"gpt-4o"')} {dim("}")}</CL>
          <CL>{dim("}")}{dim(")")}{dim(";")}</CL>
          <CL>&nbsp;</CL>
          <CL>{cm("// One call — all 4 layers")}</CL>
          <CL>{kw("const")} {id("result")} {dim("=")} {kw("await")} {id("inv")}{dim(".")}{fn("run")}(){dim(";")}</CL>
          <CL>&nbsp;</CL>
          <CL>{fn("console")}{dim(".")}{fn("log")}({fst("`")}{dim("Root causes: ")}{fst("${")}{id("result")}{dim(".")}{id("rootCauses")}{dim(".")}{fn("map")}({id("n")} {dim("=>")} {id("n")}{dim(".")}{id("statement")}){fst("}`")}){dim(";")}</CL>
          <CL>{fn("console")}{dim(".")}{fn("log")}({fst("`")}{dim("Entropy: ")}{fst("${")}{id("result")}{dim(".")}{id("entropy")}{dim(".")}{fn("toFixed")}({dim("3")}){fst("}`")}){dim(";")}</CL>
          <CL>&nbsp;</CL>
          <CL>{kw("await")} {id("result")}{dim(".")}{fn("save")}({str('"investigation.json"')}){dim(";")}</CL>
          <CL>{kw("await")} {id("result")}{dim(".")}{fn("saveMarkdown")}({str('"investigation.md"')}){dim(";")}</CL>
        </div>
      </div>
    </div>
  );
}
