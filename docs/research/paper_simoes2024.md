<h1 align="center">Simoes, Janzing, Schölkopf (2024) — Causal Entropy</h1>

**Citation:** Simoes, M., Janzing, D., Schölkopf, B. (2024). *On the Relationship Between Causal and Observational Conditional Entropy.* arxiv:2402.01341  
**Primary gap:** [gap_causal_entropy](gap_causal_entropy.md)

---

## Three Results Most Relevant to HTSA

**1. Causal Entropy Bound:**  
The paper proves that `H_do(X)(Y) ≤ H(Y|X)` — causal conditional entropy is less than or equal to observational conditional entropy. Equality holds iff no active backdoor path exists between X and Y (no unblocked confounding). This means observational information gain systematically overestimates the actual epistemic progress made by asking a question.

**2. Convergence When Using Experimental Evidence:**  
When evidence is gathered through intervention (controlled experiments, Tier 1 instrumental evidence in HTSA's evidence tier taxonomy), the intervention blocks all backdoor paths. Under intervention, `H_do(X)(Y) = H(Y|do(X)) = H(Y|X)` — the observational and causal quantities converge. This justifies the evidence tier hierarchy in HTSA: Tier 1 experimental evidence produces accurate IG estimates; Tier 3–4 inferential/testimonial evidence is subject to the causal entropy bias.

**3. Practical Implication for EXPAND:**  
The optimal next question (AC2 maximizer) should preferentially target questions that can be answered with Tier 1 evidence (instrumentation, system queries, controlled tests) rather than Tier 3–4 (inference, recall). This aligns EXPAND's question ordering with the causal IG maximization principle: when you can intervene, do; when you can only observe, apply the causal entropy discount.

---

## HTSA Files Affected

- `proofs/07_information_gain.md` — causal entropy bound qualifier, Corollary 2
- `math/04_information_theory.md` — causal vs. observational IG note

---

## Cross-links

- [gap_causal_entropy](gap_causal_entropy.md) — primary gap closed
- [gap_expand_principled](gap_expand_principled.md) — indirect: motivates Tier 1 preference in EXPAND
