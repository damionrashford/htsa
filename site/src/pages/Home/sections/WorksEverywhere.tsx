import { teal, violet, amber, border, fgDim, fgMuted } from "@/lib/tokens";

const domains = [
  { abbr: "SRE", domain: "SRE / Engineering", what: "Outage, incident, postmortem", color: teal },
  { abbr: "MED", domain: "Medicine", what: "Diagnosis, differential", color: "oklch(0.72 0.18 155)" },
  { abbr: "SEC", domain: "Security", what: "Breach, threat model", color: "oklch(0.65 0.22 25)" },
  { abbr: "BIZ", domain: "Business", what: "Bottleneck, regression", color: amber },
  { abbr: "LAW", domain: "Legal", what: "Liability, causation", color: violet },
  { abbr: "YOU", domain: "Personal", what: "Decision, burnout, goal", color: "oklch(0.72 0.18 296)" },
];

export function WorksEverywhere() {
  return (
    <section className="py-24 border-y" style={{ borderColor: border, backgroundColor: "#050910" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: fgDim }}>
            Domain-agnostic
          </p>
          <h2
            className="text-3xl font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}
          >
            Works everywhere
          </h2>
          <p className="mt-3 text-base" style={{ color: fgMuted }}>
            Same algorithm. Same math. Different vocabulary.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {domains.map((d) => (
            <div
              key={d.domain}
              className="rounded-xl p-5 border flex flex-col gap-3 transition-all"
              style={{ backgroundColor: "#080d1a", borderColor: `${d.color}22` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${d.color}55`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${d.color}22`; }}
            >
              <span
                className="inline-block text-xs font-mono font-bold px-2 py-1 rounded w-fit"
                style={{ backgroundColor: `${d.color}18`, color: d.color }}
              >
                {d.abbr}
              </span>
              <div>
                <div className="text-sm font-semibold leading-snug" style={{ color: "#dce4f5" }}>{d.domain}</div>
                <div className="text-xs mt-1 leading-relaxed" style={{ color: fgDim }}>{d.what}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
