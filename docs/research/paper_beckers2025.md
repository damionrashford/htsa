<h1 align="center">Beckers (2025) — Nondeterministic Causation</h1>

**Citation:** Beckers, S. (2025). *Nondeterministic Causal Models.* arxiv:2503.07849  
**Primary gap:** [gap_causation_formalism](gap_causation_formalism.md) (scope)

---

## Three Results Most Relevant to HTSA

**1. Scope Boundary for NESS:**  
The 2021 NESS formalization requires deterministic structural equations. When causal relationships are probabilistic (as they are in most real-world investigations), NESS requires modification. Beckers 2025 provides conditions under which the deterministic NESS result extends to nondeterministic settings, but these require additional assumptions about the causal ordering and the absence of specific cancellation patterns.

**2. Implication for HTSA:**  
HTSA investigations are typically run on probabilistic causal graphs (each node carries P(v) ∈ (0, 1)). The structural NESS implementation in `counterfactual.py` uses graph topology as a deterministic proxy — it treats ancestry (is C a causal ancestor of E?) as the NESS criterion. This is a correct approximation in the common case; it fails when the actual causal connection is probabilistic and below a threshold. PNS scores (from `pns.py`) provide the quantitative complement.

**3. Conservative Recommendation:**  
When nondeterminism is suspected (probabilistic triggers, race conditions, load-dependent failures), rely on PNS bounds rather than NESS for causation classification. NESS provides structural confirmation; PNS provides the probabilistic weight. Both together give the strongest conclusion.

---

## HTSA Files Affected

- `engine/htsa_engine/causation/counterfactual.py` — documents NESS scope limitation in docstring
- `math/09_causation_theory.md` — scope boundary section

---

## Cross-links

- [gap_causation_formalism](gap_causation_formalism.md)
- [paper_beckers2021](paper_beckers2021.md) — deterministic foundation
- [paper_albantakis2017](paper_albantakis2017.md) — quantitative causation as complement
