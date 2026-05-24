import { border, card, fgDim, fgMuted } from "@/lib/tokens";

const domains = [
  { icon: "⚙️", domain: "SRE / Engineering", what: "Outage, incident" },
  { icon: "🏥", domain: "Medicine", what: "Diagnosis" },
  { icon: "🔒", domain: "Security", what: "Breach" },
  { icon: "📈", domain: "Business", what: "Bottleneck" },
  { icon: "⚖️", domain: "Legal", what: "Act" },
  { icon: "🧠", domain: "Personal", what: "Decision" },
];

export function WorksEverywhere() {
  return (
    <section className="py-24 border-y" style={{ borderColor: border, backgroundColor: "#0a0f1e" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-mono uppercase tracking-widest" style={{ color: fgDim }}>
            Domain-agnostic
          </p>
          <h2
            className="mt-3 text-3xl font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}
          >
            Works everywhere
          </h2>
          <p className="mt-3 text-base" style={{ color: fgMuted }}>Same algorithm. Same math. Different vocabulary.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {domains.map((d) => (
            <div
              key={d.domain}
              className="rounded-xl p-4 border text-center"
              style={{ backgroundColor: card, borderColor: border }}
            >
              <div className="text-2xl mb-2">{d.icon}</div>
              <div className="text-sm font-medium" style={{ color: "#dce4f5" }}>{d.domain}</div>
              <div className="text-xs mt-1" style={{ color: fgDim }}>{d.what}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
