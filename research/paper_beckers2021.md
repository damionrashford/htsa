<h1 align="center">Beckers (2021) — NESS in Structural Causal Models</h1>

**Citation:** Beckers, S. (2021). *NESS Meets Lewis: Formal Causation and Omissions.* arxiv:2102.02311  
**Venue:** Philosophy of Science 89(1), 1–28  
**Primary gap:** [gap_causation_formalism](gap_causation_formalism.md)

---

## Three Results Most Relevant to HTSA

**1. NESS Formalized in SCMs:**  
Wright's 1988 NESS test (Necessary Element of a Sufficient Set) is placed within the structural causal model framework. A cause C is a NESS cause of E if there exists a minimal set S of simultaneous factors such that (a) S together with background conditions is sufficient for E, and (b) removing C from S makes S insufficient. This provides a mechanically applicable definition compatible with Pearl's do-calculus.

**2. NESS and HP2015 Are Complementary, Not Competing:**  
Beckers shows that NESS catches certain contributing factors that HP2015 AC2 accepts as full causes when the W-partition is constructed liberally. Specifically: in AND-node configurations (C requires D to cause E), HP2015 may classify C alone as a cause when D is held fixed in W; NESS correctly identifies that C is a NESS cause only when D is also present. HTSA Stage 3 (NESS) adds a minimality check that Stage 2 (HP2015) does not provide for AND-node discrimination.

**3. Scope Limitation — Deterministic SCMs Only:**  
The 2021 formalization applies to deterministic SCMs (binary variables, deterministic structural equations). Nondeterministic or probabilistic causation requires extension. Beckers 2025 (arxiv:2503.07849) addresses this, but with additional assumptions that may not hold in practice.

---

## HTSA Files Affected

- `engine/htsa_engine/causation/counterfactual.py` — `test_ness()` and `_minimal_sufficient_set()`
- `math/09_causation_theory.md` — NESS section; comparison table HP2015 vs. NESS

---

## Cross-links

- [gap_causation_formalism](gap_causation_formalism.md)
- [paper_halpern2015](paper_halpern2015.md) — HP2015, Stage 2
- [paper_beckers2025](paper_beckers2025.md) — nondeterministic extension
