import { border, fgDim } from "@/lib/tokens";

function CL({ children }: { children: React.ReactNode }) {
  return <div className="leading-6">{children}</div>;
}
const kw = (s: string) => <span style={{ color: "oklch(0.68 0.22 272)" }}>{s}</span>;
const fn = (s: string) => <span style={{ color: "oklch(0.78 0.18 196)" }}>{s}</span>;
const str = (s: string) => <span style={{ color: "oklch(0.72 0.18 75)" }}>{s}</span>;
const cm = (s: string) => <span style={{ color: "var(--color-fg-dim)", fontStyle: "italic" }}>{s}</span>;
const id = (s: string) => <span style={{ color: "var(--color-fg)" }}>{s}</span>;
const dim = (s: string) => <span style={{ color: "var(--color-fg-muted)" }}>{s}</span>;
const num = (s: string) => <span style={{ color: "oklch(0.72 0.18 155)" }}>{s}</span>;

export function CausationAPI() {
  return (
    <div className="mb-10 sm:mb-16">
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>
        v2 — Causation analysis
      </p>
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: border }}>
        <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ backgroundColor: "var(--color-code-bar)", borderColor: border }}>
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "oklch(0.65 0.22 25 / 25%)" }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "oklch(0.78 0.18 75 / 25%)" }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "oklch(0.72 0.18 155 / 25%)" }} />
          <span className="ml-2 text-xs font-mono" style={{ color: fgDim }}>causation.ts</span>
        </div>
        <div className="p-5 text-sm font-mono overflow-x-auto" style={{ backgroundColor: "var(--color-code-bg)", lineHeight: "1.75" }}>
          <CL>{cm("// HP2015 + NESS three-stage counterfactual test")}</CL>
          <CL>{kw("const")} {id("result")} {dim("=")} {kw("await")} {id("inv")}{dim(".")}{fn("runHP2015Test")}({id("branch")}{dim(",")} {id("origin")}){dim(";")}</CL>
          <CL>{fn("console")}{dim(".")}{fn("log")}({id("result")}{dim(".")}{id("isRootCause")}{dim(",")} {id("result")}{dim(".")}{id("wPartition")}){dim(";")}</CL>
          <CL>&nbsp;</CL>
          <CL>{cm("// Probability of Necessity and Sufficiency")}</CL>
          <CL>{kw("const")} {id("pns")} {dim("=")} {id("inv")}{dim(".")}{fn("computePNS")}({id("branch")}{dim(",")} {dim("{")} {id("pn")}{dim(":")} {num("0.8")}{dim(",")} {id("ps")}{dim(":")} {num("0.7")} {dim("}")}){dim(";")}</CL>
          <CL>{fn("console")}{dim(".")}{fn("log")}({id("pns")}{dim(".")}{id("causationType")}){dim(";")}&nbsp;&nbsp;{cm('// "single_root_cause" | "and_node" | "or_node"')}</CL>
          <CL>&nbsp;</CL>
          <CL>{cm("// Smallest fix set achieving 90% coverage")}</CL>
          <CL>{kw("const")} {id("plan")} {dim("=")} {id("inv")}{dim(".")}{fn("computeMinimalInterventionSet")}({dim("{")} {id("theta")}{dim(":")} {num("0.90")} {dim("}")}){dim(";")}</CL>
          <CL>{fn("console")}{dim(".")}{fn("log")}({id("plan")}{dim(".")}{id("minimalSet")}{dim(",")} {id("plan")}{dim(".")}{id("coverage")}){dim(";")}</CL>
          <CL>&nbsp;</CL>
          <CL>{cm("// Evidence budget — how many Tier-1 items are needed?")}</CL>
          <CL>{kw("const")} {id("budget")} {dim("=")} {id("inv")}{dim(".")}{fn("evidenceBudget")}({id("branch")}{dim(",")} {dim("{")} {id("alternativePosteriors")}{dim(":")} {dim("{")} {str('"other"')}{dim(":")} {num("0.3")} {dim("}}")}){dim(";")}</CL>
          <CL>{fn("console")}{dim(".")}{fn("log")}({id("budget")}{dim(".")}{id("nRequired")}{dim(",")} {id("budget")}{dim(".")}{id("isIndistinguishable")}){dim(";")}</CL>
        </div>
      </div>
    </div>
  );
}
