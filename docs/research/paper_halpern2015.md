<h1 align="center">Halpern (2015) — Actual Causality</h1>

**Citation:** Halpern, J.Y. (2015). *Graded Causation and Defaults.* arxiv:1505.00162  
**Venue:** British Journal for the Philosophy of Science 66(2), 413–457  
**Primary gap:** [gap_causation_formalism](gap_causation_formalism.md)

---

## Three Results Most Relevant to HTSA

**1. HP2015 Modified Definition (AC1/AC2/AC3):**  
Causation is not binary. Halpern defines actual causation in structural causal models via three conditions: AC1 (realization — C and E both occurred), AC2 (W-partition contingent counterfactual — there exists a set W of context variables such that, fixing W = w, setting C to ¬c changes E), and AC3 (minimality — no strict subset of C satisfies AC1+AC2). This handles preemption, overdetermination, and trumping that break Lewis 1973.

**2. W-Partition Construction:**  
The correct W for AC2 is the set of variables *not on any path from C to E*. Holding these fixed "blocks" alternative sufficient causes without blocking the candidate's own path to E. This is the mechanically precise procedure HTSA needs to handle OR-node root causes.

**3. Why Minimality (AC3) Matters:**  
Without AC3, conjunctions of causes trivially pass AC2 — "the sky being blue AND the disk failing" would be a cause of the outage. AC3 ensures only causally relevant factors are included. In HTSA, this corresponds to the structural minimality check: a root cause must not be reducible to a strict subset that already passes the counterfactual test.

---

## HTSA Files Affected

- `engine/htsa_engine/causation/counterfactual.py` — implements HP2015 three-stage stack
- `proofs/02_algorithm.md` — COUNTERFACTUAL_TEST pseudocode update
- `math/09_causation_theory.md` — section on HP2015 Modified Definition

---

## Cross-links

- [gap_causation_formalism](gap_causation_formalism.md) — the primary gap this paper closes
- [paper_beckers2021](paper_beckers2021.md) — complementary NESS test in SCMs
