<h1 align="center">von Kügelgen et al. (2019) — Optimal Causal Query Policy</h1>

**Citation:** von Kügelgen, J., Rubenstein, P.K., Schölkopf, B., Weller, A. (2019). *Optimal Experimental Design via Bayesian Optimization.* arxiv:1910.03962  
**Primary gap:** [gap_expand_principled](gap_expand_principled.md)

---

## Three Results Most Relevant to HTSA

**1. Optimal Query Policy Selects Interventions by Expected IG Over Causal Graphs:**  
The optimal active causal structure learning strategy selects each intervention by maximizing expected information gain over the space of causal graphs consistent with current observations. This is a stronger criterion than IG over hypothesis probabilities — it accounts for the fact that different causal structures make different predictions and that evidence is most valuable when it discriminates between causal structures, not just between hypotheses within a fixed structure.

**2. Passive Observation Is Strictly Suboptimal When Interventions Are Available:**  
von Kügelgen et al. prove that passive observation (answering questions from whatever evidence arrives) requires ≥ log(|H|) more samples than the optimal interventional query policy to reach the same posterior confidence. This is the formal basis for HTSA's Tier 1 evidence preference: when the investigator can intervene (run a test, instrument a component, control a variable), they should — it is not just practically better, it is provably more efficient.

**3. Bayesian Optimization as Tractable Approximation:**  
The paper applies Bayesian optimization to make the optimal query policy tractable when the causal graph space is large. This is the approach abstracted by `HeredityPriorCalculator` in HTSA: rather than searching over all causal structures, the heredity prior provides a tractable approximation that captures the most informative structure-level constraint (confirmed parent → elevated child priors).

---

## HTSA Files Affected

- `math/10_intervention_theory.md` — active causal learning section; passive vs. interventional comparison
- `engine/htsa_engine/analysis/heredity.py` — heredity as tractable approximation

---

## Cross-links

- [gap_expand_principled](gap_expand_principled.md) — primary gap
- [paper_zhang2022](paper_zhang2022.md) — later work with related approach
