import { Link } from "react-router";

const teal = "oklch(0.72 0.20 196)";
const violet = "oklch(0.68 0.22 272)";
const border = "#1e2d4a";
const card = "#111827";
const fgMuted = "#8899bb";
const fgDim = "#4a5e82";

const providers = [
  { name: "OpenAI", snippet: `LLMAdvisor("https://api.openai.com/v1", api_key="sk-...", model="gpt-4o")` },
  { name: "Anthropic (OpenRouter)", snippet: `LLMAdvisor("https://openrouter.ai/api/v1", api_key="sk-or-...", model="anthropic/claude-sonnet-4-20250514")` },
  { name: "Groq", snippet: `LLMAdvisor("https://api.groq.com/openai/v1", api_key="gsk_...", model="llama-3.3-70b-versatile")` },
  { name: "Mistral", snippet: `LLMAdvisor("https://api.mistral.ai/v1", api_key="...", model="mistral-large-latest")` },
  { name: "Ollama (local)", snippet: `LLMAdvisor("http://localhost:11434/v1", model="llama3")` },
];

const modules = [
  { pkg: "core/", module: "enums.py", what: "All enumerations — zero dependencies" },
  { pkg: "core/", module: "models.py", what: "Evidence, Node, DepthCriteria, Resolution, SituationMap" },
  { pkg: "core/", module: "graph.py", what: "DAG structure, convergence detection" },
  { pkg: "analysis/", module: "probability.py", what: "Bayesian updates, entropy tracking, pruning with recovery" },
  { pkg: "analysis/", module: "search.py", what: "Best-First (live priority), DFS (stack), BFS (queue)" },
  { pkg: "analysis/", module: "bias.py", what: "7 cognitive hazard detectors (warning + blocking alerts)" },
  { pkg: "analysis/", module: "evidence.py", what: "Tier classification, temporal firewall, conflict detection" },
  { pkg: "analysis/", module: "budget.py", what: "KL-based evidence budget: how many Tier-1 items are needed?" },
  { pkg: "analysis/", module: "heredity.py", what: "BayesFLo ancestor-informed prior propagation" },
  { pkg: "causation/", module: "counterfactual.py", what: "HP2015 W-partition + NESS three-stage test" },
  { pkg: "causation/", module: "pns.py", what: "PN, PS, PNS bounds — causation strength scoring" },
  { pkg: "causation/", module: "graded.py", what: "causal_grade = PNS × (1 - normality)" },
  { pkg: "causation/", module: "intervention.py", what: "Minimal intervention set via coverage optimization" },
  { pkg: "resolution/", module: "engine.py", what: "Fix/mitigate/accept, counterfactual test, priority scoring" },
  { pkg: "resolution/", module: "verification.py", what: "Verification windows, learning loop" },
  { pkg: "llm/", module: "client.py", what: "Provider-agnostic chat completions client (stdlib only)" },
  { pkg: "llm/", module: "prompts.py", what: "System prompt + prompt builders for each judgment type" },
  { pkg: "llm/", module: "advisor.py", what: "LLMAdvisor — fills judgment slots, drives auto-investigation" },
  { pkg: "", module: "investigation.py", what: "Orchestrator tying all modules together" },
  { pkg: "", module: "serialization.py", what: "JSON round-trip for full investigation state" },
  { pkg: "", module: "export.py", what: "Markdown rendering matching FRAMEWORK.md templates" },
];

const boundaryRows = [
  { method: "set_situation()", judgment: "Decompose problem into 5 Ws", advisor: "analyze_situation()" },
  { method: "add_hypothesis()", judgment: "Generate Why + assign prior", advisor: "generate_hypotheses()" },
  { method: "add_evidence()", judgment: "Classify tier and direction", advisor: "classify_evidence()" },
  { method: "mark_root_cause()", judgment: "Evaluate 4 depth criteria", advisor: "evaluate_depth_criteria()" },
  { method: "resolve()", judgment: "Propose fix/mitigate/accept", advisor: "propose_resolution()" },
  { method: "test_fix_counterfactual()", judgment: "Would fix prevent recurrence?", advisor: "evaluate_counterfactual()" },
  { method: "add_verification()", judgment: "Define verification window", advisor: "propose_verification()" },
];

export default function Engine() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-16">
        <Link to="/" className="text-sm no-underline mb-6 inline-block" style={{ color: fgDim }}>← Home</Link>
        <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: fgDim }}>Python Library · v2.0.0</p>
        <h1 className="text-4xl sm:text-5xl font-display font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}>
          HTSA Engine
        </h1>
        <p className="mt-4 text-lg max-w-2xl" style={{ color: fgMuted }}>
          The algorithm, codified. A graph-based incident investigation engine implementing the HTSA algorithm.
          Zero external dependencies. Works with any LLM provider.
        </p>
      </div>

      {/* Two layers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        <div className="rounded-xl p-6 border" style={{ backgroundColor: card, borderColor: `${teal}40` }}>
          <div className="text-xs font-mono mb-2" style={{ color: teal }}>DETERMINISTIC LAYER</div>
          <h3 className="text-base font-semibold mb-3" style={{ color: "#dce4f5", fontFamily: "'Space Grotesk', sans-serif" }}>The engine</h3>
          <p className="text-sm mb-3" style={{ color: fgMuted }}>DAG traversal · Bayesian probability · Entropy tracking · Pruning · Bias detection · HP2015 + NESS · PNS scoring · Minimal intervention set</p>
          <p className="text-xs" style={{ color: fgDim }}>The engine enforces the rules.</p>
        </div>
        <div className="rounded-xl p-6 border" style={{ backgroundColor: card, borderColor: `${violet}40` }}>
          <div className="text-xs font-mono mb-2" style={{ color: violet }}>JUDGMENT LAYER</div>
          <h3 className="text-base font-semibold mb-3" style={{ color: "#dce4f5", fontFamily: "'Space Grotesk', sans-serif" }}>You or an LLM</h3>
          <p className="text-sm mb-3" style={{ color: fgMuted }}>Generating hypotheses · Interpreting evidence · Evaluating depth criteria · Proposing resolutions</p>
          <p className="text-xs" style={{ color: fgDim }}>You (or the LLM) make the calls.</p>
        </div>
      </div>

      {/* Install */}
      <div className="mb-16">
        <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>Install</p>
        <pre className="text-sm" style={{ backgroundColor: "#080d1a", border: `1px solid ${border}`, borderRadius: 10, padding: "1rem 1.25rem" }}>{`cd engine
uv sync          # recommended — installs htsa-engine in editable mode
# or: pip install -e .`}</pre>
      </div>

      {/* Quick start — LLM */}
      <div className="mb-16">
        <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>Quick start — with an LLM (easiest)</p>
        <pre className="text-sm" style={{ backgroundColor: "#080d1a", border: `1px solid ${border}`, borderRadius: 10, padding: "1.25rem 1.5rem" }}>{`from htsa_engine.llm import LLMAdvisor

advisor = LLMAdvisor("https://api.openai.com/v1", api_key="sk-...", model="gpt-4o")

# One call — all 4 layers
inv = advisor.run("API returning 500 errors since 2:47 AM, EU region only")

print(f"Root causes: {[n.statement for n in inv.root_causes]}")
print(f"Entropy: {inv.entropy:.3f}")

inv.save("investigation.json")
inv.save_markdown("investigation.md")`}</pre>
      </div>

      {/* Providers */}
      <div className="mb-16">
        <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>Supported providers (any OpenAI-compatible endpoint)</p>
        <div className="space-y-2">
          {providers.map(({ name, snippet }) => (
            <div key={name} className="rounded-lg p-4 border" style={{ backgroundColor: card, borderColor: border }}>
              <div className="text-xs font-medium mb-2" style={{ color: fgMuted }}>{name}</div>
              <pre className="text-xs overflow-x-auto" style={{ margin: 0, color: teal }}>{snippet}</pre>
            </div>
          ))}
        </div>
      </div>

      {/* v2 causation API */}
      <div className="mb-16">
        <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>v2 — Causation analysis</p>
        <pre className="text-sm" style={{ backgroundColor: "#080d1a", border: `1px solid ${border}`, borderRadius: 10, padding: "1.25rem 1.5rem" }}>{`# HP2015 + NESS three-stage counterfactual test
result = inv.run_hp2015_test(branch, origin)
print(result.is_root_cause, result.w_partition)

# Probability of Necessity and Sufficiency
pns = inv.compute_pns(branch, pn=0.8, ps=0.7)
print(pns.causation_type)  # "single_root_cause" | "and_node" | "or_node"

# Find the smallest set of fixes that achieves 90% coverage
intervention = inv.compute_minimal_intervention_set(theta=0.90)
print(intervention.minimal_set, intervention.coverage)

# Evidence budget — how many Tier-1 evidence items are needed?
budget = inv.evidence_budget(branch, alternative_posteriors={"other": 0.3})
print(budget.n_required, budget.is_indistinguishable)`}</pre>
      </div>

      {/* Engine / LLM boundary */}
      <div className="mb-16">
        <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>The engine / LLM boundary</p>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: border }}>
          <div className="grid grid-cols-3 text-xs font-mono px-4 py-2.5 border-b" style={{ backgroundColor: "#0f1628", borderColor: border, color: fgDim }}>
            <span>Engine method</span>
            <span>Judgment needed</span>
            <span>LLMAdvisor method</span>
          </div>
          {boundaryRows.map((row, i) => (
            <div key={row.method} className="grid grid-cols-3 px-4 py-3 border-b last:border-b-0 text-xs"
              style={{ backgroundColor: i % 2 === 0 ? card : "#0d1525", borderColor: border }}>
              <code style={{ color: teal }}>{row.method}</code>
              <span style={{ color: fgMuted }}>{row.judgment}</span>
              <code style={{ color: violet }}>{row.advisor}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Module list */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>Package structure</p>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: border }}>
          {modules.map((m, i) => (
            <div key={`${m.pkg}${m.module}`} className="flex items-center gap-3 px-4 py-2.5 border-b last:border-b-0 text-xs"
              style={{ backgroundColor: i % 2 === 0 ? card : "#0d1525", borderColor: border }}>
              {m.pkg && <span style={{ color: fgDim }}>{m.pkg}</span>}
              <code className="font-mono" style={{ color: teal }}>{m.module}</code>
              <span className="ml-auto text-right max-w-xs" style={{ color: fgMuted }}>{m.what}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
