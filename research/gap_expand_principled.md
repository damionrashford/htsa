<h1 align="center">Gap: EXPAND Question Ordering</h1>

> **Status:** closed — Phase 5B (analysis/heredity.py) and math/10_intervention_theory.md (Phase 2B)

---

## What HTSA v1 Claimed

The EXPAND subroutine generates child nodes for a given Why question. The framework specified that EXPAND should generate "the most plausible child hypotheses." No formal criterion determined which questions to ask first, and in what order.

In practice: best-first search by posterior probability guided exploration. But the *questions asked during EXPAND* — which hypotheses to even generate — relied entirely on domain knowledge and investigator intuition.

---

## The Mathematical Discrepancy

HTSA's best-first search correctly prioritizes *which existing hypothesis to expand next*. It does not address *which new hypothesis to generate when expanding* — this is the EXPAND question-ordering problem.

Without a principled ordering, EXPAND is vulnerable to:

- Generating hypotheses that confirm prior beliefs (confirmation bias in EXPAND)
- Missing hypotheses that would provide maximum disambiguation between alternatives
- Asking questions that gather evidence about the leading hypothesis but not the hardest-to-distinguish alternative

The principled criterion is **interventional information gain**:

```
Q* = argmax_Q IG_causal(Q; Y | current_belief)
```

Ask the question whose answer, under a causal intervention, most reduces uncertainty about the root cause. This is strictly stronger than observational IG when hypotheses share confounders.

---

## What the Literature Proves

**Zhang et al. (2022)** — arxiv:2209.04744:

Active causal structure learning via IG maximization over interventions. Proves that the optimal query policy selects Q* to maximize the expected reduction in causal entropy over the hypothesis space. In finite hypothesis spaces with discrete observations, this converges in O(log|H|) queries.

**von Kügelgen et al. (2019)** — arxiv:1910.03962:

Proves that optimal active causal structure learning selects interventions by expected information gain over the space of causal graphs, not over observational data. When the investigator can direct evidence-gathering (commission an experiment, run a query, instrument a system), interventional IG ordering reduces total evidence required by a factor of log(|H|) vs. passive observational evidence collection.

**Panayiotou & Simsek (2026)** — arxiv:2603.22620:

Chain-reaction causal systems (common in engineering) have a special structure: root causes propagate through a linear chain. In this structure, bisection search is provably optimal — asking about the midpoint of the chain at each step achieves O(log n) causal discovery regardless of chain length.

---

## Precise Discrepancy

HTSA v1 EXPAND has no formal ordering criterion. The investigator picks questions guided only by domain intuition. In investigations with 10+ hypotheses, this can require significantly more evidence than the optimal interventional IG ordering.

---

## Resolution

Phase 5B: `analysis/heredity.py` (`HeredityPriorCalculator`) provides ancestor-informed priors — a tractable approximation to interventional IG that works without full causal structure knowledge.

Phase 2B: `math/10_intervention_theory.md` documents interventional IG maximization and the chain-reaction bisection heuristic as practical EXPAND guidance.

---

## Literature

- [paper_zhang2022](paper_zhang2022.md) — Active causal learning, IG maximization over interventions
- [paper_von_kuelgelgen2019](paper_von_kuelgelgen2019.md) — Optimal query policy via expected information gain
- [paper_panayiotou2026](paper_panayiotou2026.md) — Chain-reaction bisection, O(log n) discovery
