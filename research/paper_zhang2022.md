<h1 align="center">Zhang et al. (2022) — Active Causal Learning</h1>

**Citation:** Zhang, J., Squires, C., Uhler, C. (2022). *Matching a Desired Causal State via Shift Interventions.* arxiv:2209.04744  
**Primary gap:** [gap_expand_principled](gap_expand_principled.md)

---

## Three Results Most Relevant to HTSA

**1. Optimal Query Policy via Interventional IG:**  
Zhang et al. prove that the optimal active causal learning strategy selects each intervention to maximize the expected reduction in causal entropy H_do(X)(Y) over the hypothesis space. In finite settings, this produces a query sequence that converges to the correct causal structure in O(log|H|) interventions — optimal in the information-theoretic sense.

**2. Shift Interventions vs. Hard Interventions:**  
The paper distinguishes two types of interventions relevant to HTSA: hard interventions (do(X=x), fully fixes X) and shift interventions (changes the distribution of X without fixing it). Most HTSA evidence-gathering is shift interventions — instrumenting a component, running a query, enabling verbose logging — rather than true do-interventions. The IG bounds apply to both, but the causal entropy reduction is smaller for shift interventions.

**3. Connection to EXPAND in HTSA:**  
When an investigator can choose what evidence to gather next, the principled criterion is: pick the investigation action (instrument component A, query database B, interview witness C) whose answer provides the largest reduction in causal entropy over the remaining hypotheses. Zhang et al.'s framework makes this formally tractable when the causal graph structure is partially known — which is exactly the situation during an active HTSA investigation.

---

## HTSA Files Affected

- `math/10_intervention_theory.md` — active causal learning section; interventional IG for EXPAND
- `engine/htsa_engine/analysis/heredity.py` — heredity priors as tractable approximation to IG ordering

---

## Cross-links

- [gap_expand_principled](gap_expand_principled.md) — primary gap
- [paper_von_kuelgelgen2019](paper_von_kuelgelgen2019.md) — earlier work on optimal query policy
- [paper_simoes2024](paper_simoes2024.md) — causal entropy bound motivating the intervention preference
