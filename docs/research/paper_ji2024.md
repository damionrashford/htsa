<h1 align="center">Ji et al. (2024) — BayesFLo</h1>

**Citation:** Ji, T., Zhao, Y., Wang, Y., Song, J. (2024). *BayesFLo: Bayesian Fault Localization of Infrastructure Failures.* arxiv:2403.08079  
**Primary gap:** [gap_convergence_rate](gap_convergence_rate.md)

---

## Three Results Most Relevant to HTSA

**1. KL-Based Evidence Budget:**  
BayesFLo introduces a formal stopping criterion for fault localization investigations. The minimum evidence required to distinguish the leading hypothesis from the hardest-to-distinguish alternative at confidence ε is: `n ≥ log((1-ε)/ε) / min_j KL(P(e|C*) ‖ P(e|Cⱼ))`. This gives a computable n_required before investigation begins — investigations with low KL between alternatives require much more evidence than those with high KL.

**2. Heredity Priors via BayesFLo Combination Hierarchy:**  
When a parent node in the causal graph is confirmed as a root cause, its children inherit elevated priors proportional to the parent's posterior probability. This "heredity" prior — P₀(child | parent_confirmed) = α × base_prior + (1-α) × parent.posterior — substantially reduces evidence needed to confirm the root cause when the causal chain is long. Ji et al. show this is equivalent to applying the causal structure as a prior over the space of possible root causes.

**3. Second-Order Uncertainty Prevents Premature Pruning:**  
BayesFLo tracks the posterior as a Beta distribution (alpha/beta pseudo-counts) rather than a point estimate. A node with P_point = 0.04 after n=2 observations should NOT be pruned — the credible interval is wide. Pruning is correct only when the upper bound of the credible interval is below θ. This prevents the "sparse evidence pruning" failure mode that corrupts investigations in the early stages.

---

## HTSA Files Affected

- `engine/htsa_engine/analysis/budget.py` — EvidenceBudgetCalculator
- `engine/htsa_engine/analysis/heredity.py` — HeredityPriorCalculator
- `engine/htsa_engine/core/models_causation.py` — SecondOrderUncertainty dataclass
- `engine/htsa_engine/analysis/probability.py` — second_order_update, check_and_prune_with_uncertainty
- `proofs/06_convergence.md` — evidence budget formula section

---

## Cross-links

- [gap_convergence_rate](gap_convergence_rate.md) — primary gap closed
- [gap_expand_principled](gap_expand_principled.md) — heredity priors support principled EXPAND ordering
