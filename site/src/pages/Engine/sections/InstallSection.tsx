import { border, fgDim } from "@/lib/tokens";

export function InstallSection() {
  return (
    <div className="mb-16">
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>Install</p>
      <pre
        className="text-sm"
        style={{ backgroundColor: "#080d1a", border: `1px solid ${border}`, borderRadius: 10, padding: "1rem 1.25rem" }}
      >
        {`cd engine\nuv sync          # recommended — installs htsa-engine in editable mode\n# or: pip install -e .`}
      </pre>
    </div>
  );
}
