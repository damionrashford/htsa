<h1 align="center">Albantakis et al. (2017) — Quantitative Causation</h1>

**Citation:** Albantakis, L., Marshall, W., Hoel, E., Tononi, G. (2017). *What caused what? A quantitative account of actual causation using dynamical causal networks.* arxiv:1708.06716  
**Venue:** PLOS Computational Biology  
**Primary gap:** [gap_quantitative_causation](gap_quantitative_causation.md)

---

## Three Results Most Relevant to HTSA

**1. PNS as the Core Quantitative Measure:**  
Albantakis et al. operationalize Pearl & Tian (2000)'s probability of necessity and sufficiency as the fundamental measure of actual causation strength. PNS = PS - P(E|do(C=0)) under monotonicity. This is the quantity that maps to HTSA's root cause strength: PNS near 1 = deterministic root cause; PNS near 0 = weak contributing factor.

**2. Causal Taxonomy from PN and PS Separately:**  
The paper shows that PN and PS decompose causation into structurally distinct types: high PN + low PS = AND-node (necessary but not alone sufficient); low PN + high PS = OR-node (sufficient but replaceable); both high = single root cause; both low = contributing factor. This maps directly to HTSA's `causation_type` property on `PNSScore`.

**3. Independence Assumption for Multi-Cause Coverage:**  
When multiple root causes are independent (no shared confounders), the probability that all of them are not the cause is ∏(1 - PNS_i). Coverage of a set S of simultaneous interventions is 1 - ∏(1 - PNS_i). This is the formula used in `MinimalInterventionCalculator.coverage()`. The independence assumption fails for AND-node causes — they must be handled as a joint term.

---

## HTSA Files Affected

- `engine/htsa_engine/causation/pns.py` — PNSCalculator, PNS formula
- `engine/htsa_engine/causation/intervention.py` — coverage formula, AND-group handling
- `math/09_causation_theory.md` — PNS maps to HTSA taxonomy section

---

## Cross-links

- [gap_quantitative_causation](gap_quantitative_causation.md) — primary gap closed
- [paper_halpern_hitchcock2013](paper_halpern_hitchcock2013.md) — normality scoring complement
- [paper_li2022](paper_li2022.md) — uses PNS coverage for intervention set selection
