<h1 align="center">Gap: Causal Entropy</h1>

> **Status:** closed — Phase 1A (proofs/07_information_gain.md correction)

---

## What HTSA v1 Claimed

Proof 07 (Information Gain) stated that every correct Why answer reduces entropy, and that the information gain from asking question Q is:

```
IG(Q) = H(G) - Σ P(answer_i) × H(G | answer_i)
```

This is **observational conditional entropy** — the Shannon entropy of the investigation's hypothesis distribution conditioned on the observable answer to Q.

Proof 07 presented this as the exact measure of investigative progress, without qualification.

---

## The Mathematical Discrepancy

Observational information gain and **causal** information gain are not the same quantity when confounders are present.

Observational IG measures: how much does learning Q's answer reduce my uncertainty about *which hypothesis I observe*?

Causal IG measures: how much would *intervening* to set Q change my uncertainty about *which hypothesis is actually true*?

The formal statement (Pearl notation):

```
IG_observational(Q) = H(Y) - H(Y | Q)     [observational conditioning]
IG_causal(Q)        = H(Y) - H_do(Q)(Y)   [causal do-conditioning]
```

These are equal only when no hidden confounder links Q to Y. When confounders exist:

```
H_do(Q)(Y) ≤ H(Y | Q)
```

Equivalently: IG_causal ≤ IG_observational. The observational quantity **over-estimates** the actual epistemic progress.

---

## Precise Discrepancy

Proof 07 Theorem header was unqualified. In domains with confounders (social investigations, organizational root causes, anything involving human behavior), the HTSA IG estimate is optimistic. The investigation may believe it has gained more information than it actually has, leading to premature convergence.

---

## What the Literature Proves

**Simoes, Janzing, Schölkopf (2024)** — arxiv:2402.01341:

Formalizes the causal entropy bound within the do-calculus framework. Proves that interventional entropy H_do(Q)(Y) ≤ H(Y|Q) with equality iff no active backdoor path exists between Q and Y. When Tier 1 experimental evidence (controlled interventions, Granger causality, interrupted time series) is gathered, the observational and causal estimates converge because the intervention eliminates the backdoor.

---

## Resolution

Phase 1A adds to `proofs/07_information_gain.md`:

1. Qualifier on the theorem header: "(observational bound)"
2. Explanation of H_do(Q)(Y) ≤ H(Y|Q) — the causal entropy bound
3. Corollary 2: When confounders may be present, IG_HTSA is an upper bound on true causal IG. Convergence (equality) holds when Tier 1 experimental evidence is gathered.

This does not change the algorithm — HTSA's IG correctly guides question ordering when confounders are absent (the common case in engineering incident investigations). The qualification matters most in social and organizational investigations.

---

## Literature

- [paper_simoes2024](paper_simoes2024.md) — Causal vs. observational entropy; interventional upper bound
