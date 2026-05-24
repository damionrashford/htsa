import { teal, green, red, border, card, fgDim, fgMuted } from "@/lib/tokens";

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

const headers = [
  { name: "HTSA", highlight: true },
  { name: "PyRCA / BARO", highlight: false },
  { name: "DoWhy", highlight: false },
  { name: "Postmortem templates", highlight: false },
];

type CellValue = boolean | string;

function Cell({ value, highlight }: { value: CellValue; highlight?: boolean }) {
  if (typeof value === "boolean") {
    return value ? <Check /> : <Cross />;
  }
  return <span style={{ color: highlight ? "#dce4f5" : fgMuted }}>{value}</span>;
}

export function ComparisonTable() {
  return (
    <div className="mb-20 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th
              className="px-4 py-3 text-xs font-mono uppercase tracking-wider border-b text-left"
              style={{ borderColor: border, color: fgDim, backgroundColor: "#0f1628" }}
            >
              Feature
            </th>
            {headers.map(({ name, highlight }) => (
              <th
                key={name}
                className="px-4 py-3 text-xs font-mono uppercase tracking-wider border-b text-center"
                style={{
                  borderColor: border,
                  color: highlight ? teal : fgDim,
                  backgroundColor: highlight ? `${teal}08` : "#0f1628",
                }}
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.feature} style={{ backgroundColor: i % 2 === 0 ? card : "#0d1525" }}>
              <td className="px-4 py-3 text-sm border-b" style={{ borderColor: border, color: fgMuted }}>
                {row.feature}
              </td>
              <td className="px-4 py-3 text-sm border-b text-center" style={{ borderColor: border, backgroundColor: `${teal}05` }}>
                <Cell value={row.htsa} highlight />
              </td>
              <td className="px-4 py-3 text-sm border-b text-center" style={{ borderColor: border }}>
                <Cell value={row.pyrca} />
              </td>
              <td className="px-4 py-3 text-sm border-b text-center" style={{ borderColor: border }}>
                <Cell value={row.dowhy} />
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
  );
}
