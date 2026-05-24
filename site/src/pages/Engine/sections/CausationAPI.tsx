import { border, fgDim } from "@/lib/tokens";

const SNIPPET = `# HP2015 + NESS three-stage counterfactual test
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
print(budget.n_required, budget.is_indistinguishable)`;

export function CausationAPI() {
  return (
    <div className="mb-16">
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>
        v2 — Causation analysis
      </p>
      <pre
        className="text-sm"
        style={{ backgroundColor: "#080d1a", border: `1px solid ${border}`, borderRadius: 10, padding: "1.25rem 1.5rem" }}
      >
        {SNIPPET}
      </pre>
    </div>
  );
}
