import { teal, border, fgDim } from "@/lib/tokens";

function CL({ children }: { children: React.ReactNode }) {
  return <div className="leading-7">{children}</div>;
}
const cm = (s: string) => <span style={{ color: "#4a5e82", fontStyle: "italic" }}>{s}</span>;
const cmd = (s: string) => <span style={{ color: teal }}>{s}</span>;
const id = (s: string) => <span style={{ color: "#dce4f5" }}>{s}</span>;

export function InstallSection() {
  return (
    <div className="mb-16">
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>Install</p>
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: border }}>
        <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ backgroundColor: "#0f1628", borderColor: border }}>
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#1e2d4a" }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#1e2d4a" }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#1e2d4a" }} />
          <span className="ml-2 text-xs font-mono" style={{ color: fgDim }}>shell</span>
        </div>
        <div className="p-5 text-sm font-mono" style={{ backgroundColor: "#080d1a", lineHeight: "1.75" }}>
          <CL>{cmd("cd")} {id("engine")}</CL>
          <CL>{cmd("uv sync")}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{cm("# recommended — installs htsa-engine in editable mode")}</CL>
          <CL>{cm("# or: pip install -e .")}</CL>
        </div>
      </div>
    </div>
  );
}
