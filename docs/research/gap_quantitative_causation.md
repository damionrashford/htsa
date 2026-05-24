<h1 align="center">Gap: Quantitative Causation</h1>

> **Status:** closed — Phase 3 (models_causation.py), Phase 4 (causation/ package)

---

## What HTSA v1 Claimed

Root causes were binary: a node either passes the counterfactual test or it does not. Priority among root causes was computed as:

```
priority(v) = Impact(v) × Recurrence(v) × Actionability(v)
```

These three factors were qualitative judgments, not computed from causal structure. No formal link existed between the counterfactual test and the priority formula.

---

## The Mathematical Discrepancy

Binary causation cannot express:

- **Degree of causation** — how strongly does C cause E?
- **Necessity vs. sufficiency asymmetry** — is C required for E, sufficient for E, or both?
- **Context sensitivity** — is C abnormal (a deviation) or normal (expected background)?

Without quantitative causation, two root causes with identical binary status are treated as equally fixable, when in practice one may be 5× more causally potent than the other.

The precise quantities missing:

**Probability of Necessity (PN):** P(¬E | do(¬C), C=c, E=e) — the probability that the outcome would not have occurred had C not occurred, given that C and E both actually occurred.

**Probability of Sufficiency (PS):** P(E | do(C), C=¬c, E=¬e) — the probability that the outcome would have occurred had C occurred, given that neither occurred in the actual world.

**Probability of Necessity and Sufficiency (PNS):** P(¬E | do(¬C)) - P(¬E | do(C)) under monotonicity. Bounded by: `max(0, PN+PS-1) ≤ PNS ≤ min(PN, PS)`.

**Normality / Abnormality:** P(C | baseline operations) — how often does C occur under normal conditions? An abnormal cause (low baseline rate) deserves higher priority to fix than a normal one with the same PNS.

**Causal Grade:** PNS × (1 - normality) — the combined measure of causal strength and abnormality, providing the principled priority score.

---

## What the Literature Proves

**Pearl & Tian (2000)** (referenced in Albantakis et al. 2017 — arxiv:1708.06716):

Under monotonicity: PNS = PS - P(E | do(C=0)). Bounds hold for both experimental and observational data. PNS > 0 is necessary for causation; PNS = 1 is sufficient for deterministic causation.

**Halpern & Hitchcock (2013)** — arxiv:1309.1226:

Graded causation: normality (P(C | baseline)) distinguishes causes that are structurally necessary from causes that are abnormal deviations. Causal grade = PNS × (1 - normality) correctly ranks an unusual trigger above a routine failure with the same PNS.

**Li et al. (2022)** — arxiv:2206.05871 (CIRCA):

Formalizes root cause as `do(fix(C)) → outcome restoration`. The minimal intervention set problem: find the smallest set S of root causes such that P(E | do(fix(S))) ≥ θ. Coverage: 1 - ∏(1 - PNS_i) for independent causes in S. This provides the principled link between PNS scores and fix prioritization.

---

## Precise Discrepancy

v1 HTSA: qualitative priority = Impact × Recurrence × Actionability. No formal link to causal structure.

v2 HTSA: causal_grade = PNS × (1 - normality). Priority is derived from causal structure, not from qualitative judgment alone. The minimal intervention set is computed from PNS coverage, not from practitioner intuition.

---

## Resolution

Phase 3: `core/models_causation.py` — `PNSScore`, `NormalityScore` dataclasses.  
Phase 4: `causation/pns.py`, `causation/graded.py`, `causation/intervention.py`.  
Phase 7: `investigation.py` — `compute_pns()`, `compute_normality_score()`, `compute_minimal_intervention_set()`.

---

## Literature

- [paper_albantakis2017](paper_albantakis2017.md) — PNS formal basis; quantitative causation
- [paper_halpern_hitchcock2013](paper_halpern_hitchcock2013.md) — Graded causation, normality score
- [paper_li2022](paper_li2022.md) — CIRCA; minimal intervention set from PNS coverage
