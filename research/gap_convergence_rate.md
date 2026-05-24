<h1 align="center">Gap: Convergence Rate</h1>

> **Status:** closed — Phase 1C (proofs/06 formula exposed), Phase 5A (analysis/budget.py)

---

## What HTSA v1 Claimed

Proof 06 (Convergence) proved that the investigation's posterior probabilities converge toward the true causal distribution as evidence accumulates. The proof invoked the Bayesian consistency theorem (Doob 1949): given a correctly specified likelihood model, the posterior P(v | e₁, e₂, ..., eₙ) → P(v | truth) as n → ∞.

This proves *that* the investigation converges. It does not specify *how much evidence* is required to confidently distinguish the leading hypothesis from alternatives.

---

## The Mathematical Discrepancy

Proof 06 proved convergence without providing a stopping criterion grounded in evidence quantity. The framework prescribed stopping when "confidence is sufficient," but provided no formula for computing whether gathered evidence was sufficient.

In practice: investigators either gather too much evidence (inefficient) or close investigations before alternatives are adequately ruled out (incomplete).

---

## What the Literature Proves

**Sequential analysis / KL divergence stopping** (classical information theory, applied in BayesFLo — Ji et al. 2024, arxiv:2403.08079):

To distinguish a leading hypothesis P(·|C*) from the hardest-to-distinguish alternative P(·|Cⱼ) with confidence ε, the required sample size is:

```
n_required ≥ log((1 - ε) / ε) / min_j KL(P(·|C*) ‖ P(·|Cⱼ))
```

where KL(p ‖ q) = p log(p/q) + (1-p) log((1-p)/(1-q)) is the Bernoulli KL divergence between the expected evidence distributions under the two hypotheses.

**Interpretation:**
- High ε (e.g., 0.20): stop early, accept higher error rate
- Low ε (e.g., 0.05): stop when the leading hypothesis is 19× more likely than each alternative
- Large KL: alternatives are easily distinguished, few observations needed
- Small KL (similar hypotheses): many observations needed; this signals that gathering more evidence may not resolve the investigation

When min_j KL → 0: the leading hypothesis and an alternative are nearly indistinguishable from their evidence patterns. The formula returns n → ∞. In practice: flag these as **indistinguishable under current evidence model** and report the ambiguity rather than forcing a conclusion.

---

## Precise Discrepancy

v1: convergence proved, no formula. Investigator guesses when to stop.  
v2: evidence budget formula exposed as a computable quantity, with a sentinel case for near-identical alternatives.

---

## Resolution

Phase 1C: `proofs/06_convergence.md` — adds "Evidence Budget Formula" section with the n_required formula and a worked example (3 hypotheses, KL=0.05, ε=0.05 → n ≥ 59).

Phase 5A: `analysis/budget.py` — `EvidenceBudgetCalculator` implementing the formula. Accessible via `investigation.evidence_budget()`.

---

## Literature

- [paper_ji2024](paper_ji2024.md) — BayesFLo; KL-based stopping criterion in fault localization
