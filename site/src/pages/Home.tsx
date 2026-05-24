import { Link } from "react-router";
import hero from "../assets/images/hero.png";

const teal = "oklch(0.72 0.20 196)";
const violet = "oklch(0.68 0.22 272)";
const border = "#1e2d4a";
const card = "#111827";
const fgMuted = "#8899bb";
const fgDim = "#4a5e82";

function Section({ children, id, className = "" }: { children: React.ReactNode; id?: string; className?: string }) {
  return (
    <section id={id} className={`max-w-6xl mx-auto px-6 ${className}`}>
      {children}
    </section>
  );
}

function Tag({ children, color = teal }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-1 rounded-full border"
      style={{ borderColor: `${color}40`, color, backgroundColor: `${color}10` }}>
      {children}
    </span>
  );
}

const layers = [
  {
    num: "01",
    name: "Situation Map",
    subtitle: "The 5 Ws",
    color: teal,
    desc: "Establish the full picture before drilling into cause. Who, What, When, Where, Why-surface — all five before the first hypothesis.",
    items: ["Who was affected?", "What event occurred?", "When did it start?", "Where in the system?", "Why on the surface?"],
  },
  {
    num: "02",
    name: "Causal Chain",
    subtitle: "The 5 Whys",
    color: violet,
    desc: "Start at the surface Why. Ask why again. Keep going until you reach something you can actually change. Branches are mandatory — real problems are rarely single-cause.",
    items: ["Bayesian probability at every node", "Best-First / DFS / BFS search", "Evidence-gated node closure", "Pruning below threshold θ"],
  },
  {
    num: "03",
    name: "Resolution",
    subtitle: "Fix · Mitigate · Accept",
    color: "oklch(0.78 0.18 75)",
    desc: "Map each root cause to a concrete change. Every resolution must pass the counterfactual test: would the fix have prevented the problem?",
    items: ["HP2015 + NESS causal proof", "PNS scoring for priority", "Minimal intervention set", "Fix / Mitigate / Accept classification"],
  },
  {
    num: "04",
    name: "Verification",
    subtitle: "Learning Loop",
    color: "oklch(0.72 0.18 155)",
    desc: "Confirm the fix worked. Update your priors. The framework compounds over time — but only if learning is explicit and structured.",
    items: ["Time-based or event-driven window", "Metric confirmation", "Prior update on next investigation", "Pattern library growth"],
  },
];

const mathConcepts = [
  { num: "01", name: "Graph Theory", what: "Structure of an investigation" },
  { num: "02", name: "Exponential Space", what: "Why investigations feel overwhelming" },
  { num: "03", name: "Causal Inference", what: "How to prove something caused something else" },
  { num: "04", name: "Information Theory", what: "How to measure investigative progress" },
  { num: "05", name: "Bayesian Reasoning", what: "How to weigh competing causes" },
  { num: "06", name: "Search Algorithms", what: "How to move through the Why tree" },
  { num: "07", name: "Cognitive Biases", what: "What corrupts the investigation" },
  { num: "08", name: "Evidence Evaluation", what: "How to know which evidence to trust" },
  { num: "09", name: "Causation Theory", what: "How to classify and quantify actual causes" },
  { num: "10", name: "Intervention Theory", what: "How to find the minimal set of fixes" },
];

const domains = [
  { icon: "⚙️", domain: "SRE / Engineering", what: "Outage, incident" },
  { icon: "🏥", domain: "Medicine", what: "Diagnosis" },
  { icon: "🔒", domain: "Security", what: "Breach" },
  { icon: "📈", domain: "Business", what: "Bottleneck" },
  { icon: "⚖️", domain: "Legal", what: "Act" },
  { icon: "🧠", domain: "Personal", what: "Decision" },
];

export default function Home() {
  return (
    <div>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ borderBottom: `1px solid ${border}` }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: `url(${hero})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.18 }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, #080d1a00 0%, #080d1a 100%)" }} />
        <div className="absolute inset-0 opacity-40 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, oklch(0.72 0.20 196 / 0.07) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${teal}18 0%, transparent 70%)`, filter: "blur(40px)" }} />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${violet}15 0%, transparent 70%)`, filter: "blur(40px)" }} />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-28 text-center">
          <Tag>Root Cause Analysis · v2.0.0</Tag>

          <h1 className="mt-8 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span style={{ color: "#dce4f5" }}>How to Solve</span>{" "}
            <span style={{
              background: `linear-gradient(135deg, ${teal}, ${violet})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Anything</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: fgMuted }}>
            A structured root cause analysis framework combining the 5 Ws and 5 Whys.<br />
            <span style={{ color: "#dce4f5" }}>Not a template. An algorithm.</span>
          </p>
          <p className="mt-2 text-base max-w-xl mx-auto" style={{ color: fgDim }}>
            Bayesian probability at every node · Causal inference at every edge · LLM-assisted or fully manual
          </p>

          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link to="/algorithm"
              className="px-6 py-3 rounded-lg font-medium text-sm no-underline"
              style={{ backgroundColor: teal, color: "#080d1a" }}
              onMouseEnter={e => { (e.target as HTMLElement).style.opacity = "0.85"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.opacity = "1"; }}
            >
              Learn the Algorithm →
            </Link>
            <Link to="/engine"
              className="px-6 py-3 rounded-lg font-medium text-sm border no-underline"
              style={{ borderColor: border, color: "#dce4f5" }}
              onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = `${teal}60`; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = border; }}
            >
              Use the Engine
            </Link>
          </div>

          <div className="mt-14 max-w-2xl mx-auto text-left">
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: border }}>
              <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ backgroundColor: "#0f1628", borderColor: border }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#1e2d4a" }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#1e2d4a" }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#1e2d4a" }} />
                <span className="ml-2 text-xs font-mono" style={{ color: fgDim }}>quick start</span>
              </div>
              <pre className="p-5 text-sm overflow-x-auto" style={{ backgroundColor: "#080d1a", margin: 0, border: "none", borderRadius: 0 }}>{`from htsa_engine.llm import LLMAdvisor

advisor = LLMAdvisor(
    "https://api.openai.com/v1",
    api_key="sk-...",
    model="gpt-4o"
)

# One call — all 4 layers
inv = advisor.run(
    "API returning 500 errors since 2:47 AM, EU region only"
)

print(inv.root_causes)   # what to fix
print(inv.entropy)       # investigation confidence
inv.save("postmortem.json")`}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* ── The Algorithm tagline ── */}
      <Section className="pt-24 pb-4 text-center">
        <p className="text-xs font-mono uppercase tracking-widest" style={{ color: fgDim }}>The Core Insight</p>
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}>
          Every problem has the same anatomy.
        </h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: fgMuted }}>
          The vocabulary changes. The causal structure never does.<br />
          The <strong style={{ color: "#dce4f5" }}>5 Ws</strong> tell you what happened.
          The <strong style={{ color: "#dce4f5" }}>5 Whys</strong> tell you why it happened.
          Together they tell you <strong style={{ color: "#dce4f5" }}>what to fix — and in what order.</strong>
        </p>
      </Section>

      {/* ── 4 Layers ── */}
      <Section id="layers" className="pt-16 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {layers.map((layer) => (
            <div key={layer.num} className="rounded-xl p-6 border transition-all"
              style={{ backgroundColor: card, borderColor: border }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${layer.color}50`; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 28px ${layer.color}10`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = border; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono" style={{ color: layer.color }}>Layer {layer.num}</span>
                  <h3 className="mt-1 text-xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}>
                    {layer.name}
                  </h3>
                  <span className="text-sm" style={{ color: fgMuted }}>{layer.subtitle}</span>
                </div>
                <span className="text-3xl font-mono font-bold opacity-15" style={{ color: layer.color }}>{layer.num}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: fgMuted }}>{layer.desc}</p>
              <ul className="mt-4 space-y-1.5">
                {layer.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm" style={{ color: fgMuted }}>
                    <span style={{ color: layer.color }}>›</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/algorithm" className="text-sm no-underline" style={{ color: teal }}
            onMouseEnter={e => { (e.target as HTMLElement).style.opacity = "0.7"; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.opacity = "1"; }}>
            Full algorithm walkthrough →
          </Link>
        </div>
      </Section>

      {/* ── Works Everywhere ── */}
      <section className="py-24 border-y" style={{ borderColor: border, backgroundColor: "#0a0f1e" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-mono uppercase tracking-widest" style={{ color: fgDim }}>Domain-agnostic</p>
            <h2 className="mt-3 text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}>
              Works everywhere
            </h2>
            <p className="mt-3 text-base" style={{ color: fgMuted }}>Same algorithm. Same math. Different vocabulary.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {domains.map((d) => (
              <div key={d.domain} className="rounded-xl p-4 border text-center"
                style={{ backgroundColor: card, borderColor: border }}>
                <div className="text-2xl mb-2">{d.icon}</div>
                <div className="text-sm font-medium" style={{ color: "#dce4f5" }}>{d.domain}</div>
                <div className="text-xs mt-1" style={{ color: fgDim }}>{d.what}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Math ── */}
      <Section className="pt-24 pb-24">
        <div className="text-center mb-12">
          <p className="text-xs font-mono uppercase tracking-widest" style={{ color: fgDim }}>10 Mathematical Foundations</p>
          <h2 className="mt-3 text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}>
            The math is always running.
          </h2>
          <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: fgMuted }}>
            Applied graph traversal algorithm for causal inference — with probability weighting, entropy reduction, and Bayesian evidence updating at every node.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {mathConcepts.map((c, i) => (
            <div key={c.num} className="rounded-lg p-4 border transition-all"
              style={{ backgroundColor: card, borderColor: border }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = i < 5 ? `${teal}50` : `${violet}50`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = border; }}
            >
              <div className="text-xs font-mono mb-1" style={{ color: i < 5 ? teal : violet }}>{c.num}</div>
              <div className="text-sm font-medium" style={{ color: "#dce4f5" }}>{c.name}</div>
              <div className="text-xs mt-1 leading-relaxed" style={{ color: fgDim }}>{c.what}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/math" className="text-sm no-underline" style={{ color: teal }}>
            Explore the math →
          </Link>
        </div>
      </Section>

      {/* ── Engine CTA ── */}
      <section className="py-20 border-t" style={{ borderColor: border }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden border"
            style={{ backgroundColor: card, borderColor: `${teal}30` }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 50% 0%, ${teal}10 0%, transparent 60%)` }} />
            <div className="relative">
              <Tag>Python · v2.0.0 · Zero dependencies</Tag>
              <h2 className="mt-6 text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}>
                The algorithm, codified.
              </h2>
              <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: fgMuted }}>
                A Python library implementing every layer of HTSA. Works with any LLM provider — OpenAI, Anthropic, Groq, Mistral, Ollama. Or drive it manually, full control over every decision.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <Link to="/engine"
                  className="px-6 py-3 rounded-lg font-medium text-sm no-underline"
                  style={{ backgroundColor: teal, color: "#080d1a" }}>
                  Engine docs →
                </Link>
                <a href="https://github.com/damionrashford/htsa/tree/main/engine"
                  target="_blank" rel="noreferrer"
                  className="px-6 py-3 rounded-lg font-medium text-sm border no-underline"
                  style={{ borderColor: border, color: "#dce4f5" }}>
                  View source ↗
                </a>
              </div>
              <div className="mt-8 text-left max-w-lg mx-auto">
                <pre className="text-sm" style={{ backgroundColor: "#080d1a", border: `1px solid ${border}`, borderRadius: 8, padding: "1rem 1.25rem", margin: 0 }}>{`# Install
cd engine && uv sync

# Auto-investigate with any LLM
advisor.run("API returning 500 errors")`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
