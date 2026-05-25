import { teal, border, fgDim } from "@/lib/tokens";

function CL({ children }: { children: React.ReactNode }) {
  return <div className="leading-7">{children}</div>;
}
const cmd = (s: string) => <span style={{ color: teal }}>{s}</span>;
const cm  = (s: string) => <span style={{ color: "var(--color-fg-dim)", fontStyle: "italic" }}>{s}</span>;
const id  = (s: string) => <span style={{ color: "var(--color-fg)" }}>{s}</span>;
const dim = (s: string) => <span style={{ color: "var(--color-fg-muted)" }}>{s}</span>;

export function InstallSection() {
  return (
    <div className="mb-10 sm:mb-16">
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>Install</p>
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: border }}>
        <div
          className="flex items-center gap-2 px-4 py-2.5 border-b"
          style={{ backgroundColor: "var(--color-code-bar)", borderColor: border }}
        >
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "oklch(0.65 0.22 25 / 25%)" }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "oklch(0.78 0.18 75 / 25%)" }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "oklch(0.72 0.18 155 / 25%)" }} />
          <span className="ml-2 text-xs font-mono" style={{ color: fgDim }}>shell</span>
        </div>
        <div className="p-5 text-sm font-mono" style={{ backgroundColor: "var(--color-code-bg)", lineHeight: "1.75" }}>
          <CL>{cmd("bun")} {id("add")} {id("htsa")}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{cm("# or: npm install htsa")}</CL>
          <CL>&nbsp;</CL>
          <CL>{cm("# TypeScript — fully typed, zero runtime deps")}</CL>
          <CL>{dim("import")} {dim("{")} {id("Investigation")} {dim("}")} {dim("from")} {dim('"htsa"')}</CL>
        </div>
      </div>
    </div>
  );
}
