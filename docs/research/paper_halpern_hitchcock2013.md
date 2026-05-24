<h1 align="center">Halpern & Hitchcock (2013) — Graded Causation</h1>

**Citation:** Halpern, J.Y., Hitchcock, C. (2013). *Graded Causation and Defaults.* arxiv:1309.1226  
**Venue:** British Journal for the Philosophy of Science 66(2), 413–457  
**Primary gap:** [gap_quantitative_causation](gap_quantitative_causation.md)

---

## Three Results Most Relevant to HTSA

**1. Normality Score Formalizes "Expected vs. Abnormal":**  
Halpern and Hitchcock introduce normality as a formal quantity: P(C | baseline_operations). A factor with high normality is part of expected system behavior; a factor with low normality is a deviation. The causal grade = PNS × (1 - normality) correctly ranks an abnormal trigger above a routine background condition that happens to be causally necessary, which matches practitioner intuition about "what went wrong."

**2. Graded Causation Resolves Priority Conflicts:**  
Two root causes may have equal PNS but different normality. A configuration error (normality = 0.01, rare) and a race condition (normality = 0.80, frequent) with the same PNS should NOT receive the same priority. Causal grade separates them: the rare configuration error has a higher causal grade and should be fixed first. This resolves ambiguity in v1's qualitative priority formula.

**3. Defaults Are Contextual, Not Universal:**  
What counts as "normal" depends on the investigation context. Normality for a security breach investigation is the base rate of that access pattern under normal operations; normality for a medical investigation is the population prevalence of the factor. HTSA's `NormalityScorer` must accept a `baseline_source` argument to document which context was used — without this, normality scores from different investigations are not comparable.

---

## HTSA Files Affected

- `engine/htsa_engine/causation/graded.py` — NormalityScorer, compute_grade, prioritize_root_causes
- `engine/htsa_engine/core/models_causation.py` — NormalityScore dataclass
- `math/09_causation_theory.md` — graded causation section

---

## Cross-links

- [gap_quantitative_causation](gap_quantitative_causation.md) — primary gap closed
- [paper_albantakis2017](paper_albantakis2017.md) — PNS as the causal strength input
- [paper_halpern2015](paper_halpern2015.md) — same first author; graded causation extends HP2015
