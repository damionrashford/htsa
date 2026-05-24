<h1 align="center">Li et al. (2022) — CIRCA</h1>

**Citation:** Li, M., Zheng, Z., Lyu, M.R. (2022). *Causal Inference-Based Root Cause Analysis Over Microservice Systems with Observation Limitation.* arxiv:2206.05871  
**Venue:** KDD 2022  
**Primary gap:** [gap_quantitative_causation](gap_quantitative_causation.md)

---

## Three Results Most Relevant to HTSA

**1. Root Cause as do(fix(C)) → Outcome Restoration:**  
CIRCA formalizes root cause identification in terms of do-calculus: C is a root cause of incident E iff `do(fix(C))` restores the normal outcome. This is more precise than "C caused E" — it specifies that a fix to C must suffice to prevent E. HTSA's counterfactual test on the resolution (`"If this fix had existed, would the problem still have occurred?"`) is the practitioner form of this criterion.

**2. Minimal Intervention Set via Coverage:**  
CIRCA introduces the minimal intervention set problem for microservice RCA: find the smallest set S of root causes such that fixing all of S prevents E with probability ≥ θ. Coverage(S) = 1 - ∏(1 - RCA_score_i) for independent causes i in S. This maps directly to HTSA's `MinimalInterventionCalculator`: use PNS as the per-cause score, and find the smallest S achieving coverage ≥ θ.

**3. Correlation-Based RCA Is Mathematically Unsound:**  
CIRCA proves that correlation-based root cause ranking (which cause has the highest correlation with the incident metric?) systematically misidentifies downstream effects as root causes when the causal structure is a chain. A downstream effect with high correlation to the incident is always a worse fix target than the upstream root cause. This motivates HTSA's causal DAG structure over metric correlation approaches.

---

## HTSA Files Affected

- `engine/htsa_engine/causation/intervention.py` — MinimalInterventionCalculator, coverage formula
- `math/10_intervention_theory.md` — CIRCA section; do(fix(C)) formalization
- `proofs/01_formal_definitions.md` — Definition 9 (Resolution) counterfactual test on fix

---

## Cross-links

- [gap_quantitative_causation](gap_quantitative_causation.md)
- [paper_albantakis2017](paper_albantakis2017.md) — PNS as the intervention score input
