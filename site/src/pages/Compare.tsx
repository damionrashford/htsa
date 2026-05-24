import { Link } from "react-router";

const teal = "oklch(0.72 0.20 196)";
const violet = "oklch(0.68 0.22 272)";
const border = "#1e2d4a";
const card = "#111827";
const fgMuted = "#8899bb";
const fgDim = "#4a5e82";
const green = "oklch(0.72 0.18 155)";
const red = "oklch(0.65 0.22 25)";

const Check = () => <span style={{ color: green }}>✓</span>;
const Cross = () => <span style={{ color: red }}>✗</span>;
const Partial = () => <span style={{ color: fgMuted }}>~</span>;

const rows = [
  { feature: "Approach", htsa: "Structured algorithm", pyrca: "ML / metrics", dowhy: "Statistical", templates: "Blank form" },
  { feature: "Input", htsa: "Any problem", pyrca: "Prometheus metrics", dowhy: "Data frames", templates: "Text" },
  { feature: "Causal proof", htsa: "HP2015 + NESS + PNS", pyrca: "Correlation-based", dowhy: "do-calculus", templates: "None" },
  { feature: "Works without data", htsa: true, pyrca: false, dowhy: false, templates: true },
  { feature: "Cross-domain", htsa: true, pyrca: false, dowhy: false, templates: true },
  { feature: "LLM integration", htsa: true, pyrca: false, dowhy: false, templates: false },
  { feature: "Bayesian updating", htsa: true, pyrca: false, dowhy: true, templates: false },
  { feature: "Bias detection", htsa: "7 detectors", pyrca: false, dowhy: false, templates: "None" },
  { feature: "Human-driven", htsa: true, pyrca: false, dowhy: false, templates: true },
  { feature: "Formal proofs", htsa: "7 proofs", pyrca: false, dowhy: false, templates: "None" },
];


const differentiators = [
  {
    title: "Works without observability data",
    color: teal,
    detail: "PyRCA and DoWhy require structured metrics or data frames. HTSA works from a plain-language description of the problem — no Prometheus, no data warehouse required. Logs, memory, and human observation are enough.",
  },
  {
    title: "Human-driven investigation, not ML attribution",
    color: violet,
    detail: "ML-based RCA (BARO, PyRCA) identifies statistical correlations in metric time series. HTSA is structured argumentation — you build a causal case with evidence, not a model that predicts blame. Both are useful. They solve different problems.",
  },
  {
    title: "Cross-domain by design",
    color: teal,
    detail: "PyRCA is AIOps-specific. DoWhy is academic statistics. HTSA was designed from the start to apply to SRE incidents, medical diagnosis, security breaches, business bottlenecks, legal investigations, and personal decisions.",
  },
  {
    title: "Causal proof, not correlation",
    color: violet,
    detail: "Correlation-based RCA correctly identifies the anomalous node but cannot prove it caused the outcome. HTSA uses HP2015 W-partition + NESS to formally prove actual causation, and PNS to quantify causation strength.",
  },
  {
    title: "Built-in LLM integration",
    color: teal,
    detail: "No other RCA tool ships with built-in LLM integration that works with any OpenAI-compatible endpoint. The LLMAdvisor fills the judgment slots (hypothesis generation, evidence classification, depth criteria) while the engine enforces the math.",
  },
];

export default function Compare() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-16">
        <Link to="/" className="text-sm no-underline mb-6 inline-block" style={{ color: fgDim }}>← Home</Link>
        <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: fgDim }}>HTSA vs alternatives</p>
        <h1 className="text-4xl sm:text-5xl font-display font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}>
          How HTSA differs
        </h1>
        <p className="mt-4 text-lg max-w-2xl" style={{ color: fgMuted }}>
          There are two other serious open-source RCA tools: PyRCA (Salesforce) and DoWhy (Microsoft). They solve real problems. They just solve different problems than HTSA.
        </p>
      </div>

      {/* Comparison table */}
      <div className="mb-20 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider border-b text-left" style={{ borderColor: border, color: fgDim, backgroundColor: "#0f1628" }}>Feature</th>
              {[
                { name: "HTSA", highlight: true },
                { name: "PyRCA / BARO", highlight: false },
                { name: "DoWhy", highlight: false },
                { name: "Postmortem templates", highlight: false },
              ].map(({ name, highlight }) => (
                <th key={name} className="px-4 py-3 text-xs font-mono uppercase tracking-wider border-b text-center"
                  style={{ borderColor: border, color: highlight ? teal : fgDim, backgroundColor: highlight ? `${teal}08` : "#0f1628" }}>
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.feature} style={{ backgroundColor: i % 2 === 0 ? card : "#0d1525" }}>
                <td className="px-4 py-3 text-sm border-b" style={{ borderColor: border, color: fgMuted }}>{row.feature}</td>
                <td className="px-4 py-3 text-sm border-b text-center" style={{ borderColor: border, backgroundColor: `${teal}05` }}>
                  {typeof row.htsa === "boolean"
                    ? (row.htsa ? <Check /> : <Cross />)
                    : <span style={{ color: "#dce4f5" }}>{row.htsa}</span>
                  }
                </td>
                <td className="px-4 py-3 text-sm border-b text-center" style={{ borderColor: border }}>
                  {typeof row.pyrca === "boolean"
                    ? (row.pyrca ? <Check /> : <Cross />)
                    : <span style={{ color: fgMuted }}>{row.pyrca}</span>
                  }
                </td>
                <td className="px-4 py-3 text-sm border-b text-center" style={{ borderColor: border }}>
                  {typeof row.dowhy === "boolean"
                    ? (row.dowhy ? <Check /> : <Cross />)
                    : <span style={{ color: fgMuted }}>{row.dowhy}</span>
                  }
                </td>
                <td className="px-4 py-3 text-sm border-b text-center" style={{ borderColor: border }}>
                  {typeof row.templates === "boolean"
                    ? (row.templates ? <Partial /> : <Cross />)
                    : <span style={{ color: fgMuted }}>{row.templates}</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Differentiators */}
      <div className="mb-16">
        <p className="text-xs font-mono uppercase tracking-widest mb-6" style={{ color: fgDim }}>The key differences</p>
        <div className="space-y-4">
          {differentiators.map(({ title, color, detail }) => (
            <div key={title} className="rounded-xl p-6 border" style={{ backgroundColor: card, borderColor: border }}>
              <h3 className="text-base font-semibold mb-2" style={{ color: "#dce4f5", fontFamily: "'Space Grotesk', sans-serif" }}>
                <span style={{ color }}>›</span> {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: fgMuted }}>{detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* When to use what */}
      <div className="rounded-xl p-8 border" style={{ borderColor: border, backgroundColor: card }}>
        <p className="text-xs font-mono uppercase tracking-widest mb-6" style={{ color: fgDim }}>When to use what</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm font-medium mb-2" style={{ color: teal }}>Use HTSA when:</div>
            <ul className="space-y-1.5 text-sm" style={{ color: fgMuted }}>
              {["You're doing a postmortem, not running ML", "The problem spans multiple domains", "You want to prove causation, not correlate metrics", "You want LLM assistance in the investigation", "You need a trail of evidence and reasoning"].map(item => (
                <li key={item} className="flex gap-2"><span style={{ color: teal }}>›</span>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium mb-2" style={{ color: fgMuted }}>Use PyRCA/BARO when:</div>
            <ul className="space-y-1.5 text-sm" style={{ color: fgMuted }}>
              {["You have structured Prometheus/Jaeger metrics", "You need to triage fast from metric anomalies", "Your problem is AIOps microservice attribution", "You have labeled historical incident data"].map(item => (
                <li key={item} className="flex gap-2"><span style={{ color: fgDim }}>›</span>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium mb-2" style={{ color: fgMuted }}>Use DoWhy when:</div>
            <ul className="space-y-1.5 text-sm" style={{ color: fgMuted }}>
              {["You have a data frame with observational data", "You want do-calculus counterfactual reasoning", "Your problem is a research statistics question", "You have a known causal graph to verify"].map(item => (
                <li key={item} className="flex gap-2"><span style={{ color: fgDim }}>›</span>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
