<h1 align="center">Gap: Causation Formalism</h1>

> **Status:** closed — Phase 4 (causation/ package) and Phase 7 (proofs/02 update)

---

## What HTSA v1 Claimed

The COUNTERFACTUAL_TEST applied a single-stage necessity check:

```
IF P(effect | do(¬cause)) = P(effect | do(cause)):
  REJECT — not a causal edge
ELSE:
  ACCEPT — cause is valid
```

This is the **Lewis 1973 simple counterfactual**: C causes E iff, without C, E would not have occurred.

---

## The Mathematical Discrepancy

The Lewis formulation breaks on three well-known cases that occur in real investigations:

**Overdetermination (OR-causation):** A database goes down because both its primary node and its replica fail simultaneously. Removing cause A still leaves cause B — so `P(E | do(¬A)) = P(E)`. Lewis 1973 rejects A as a cause. But A *is* a genuine cause.

**Preemption:** Alert routing was silenced by an expired on-call schedule (cause A, acted at T=0). The PagerDuty escalation (cause B) would have fired at T+30m. Remove A, and E still occurs via B. Lewis rejects A. But A is the actual root cause.

**Trumping / Late preemption:** Merlin cast a spell at T=1; Morgana cast the same spell at T=2; the king turned into a frog. Each spell alone was sufficient. Lewis cannot distinguish which cause to credit.

---

## What the Literature Proves

**Halpern & Pearl (2015)** — HP2015 Modified Definition (arxiv:1505.00162):

Actual causation requires three conditions:

- **AC1:** C = c and E = e in the actual world.
- **AC2 (W-partition):** There exists a set W of variables and values w such that, holding W = w, there is no path from C to E except through c; and the actual outcome changes when C is set to ¬c under this partition. This is the "contingent counterfactual" — it handles overdetermination by blocking the alternative sufficient causes in W.
- **AC3 (Minimality):** No strict subset of {C = c} satisfies AC1 and AC2.

**Beckers (2021)** — NESS in SCMs (arxiv:2102.02311):

The NESS (Necessary Element of a Sufficient Set) test, formalized by Wright 1988 and Mackie 1965, provides a complementary criterion: C is a cause if there exists a minimal set S containing C such that S is sufficient for E, and removing C from S makes S insufficient. Beckers 2021 places this within Structural Causal Models, making it mechanically applicable.

---

## Precise Discrepancy

v1 HTSA uses Lewis 1973 (AC2 without W-partition). HP2015 and NESS require the full three-stage stack. Missing AC2 W-partition means:

- OR-node causes in real incidents are incorrectly rejected
- Preempting causes may be marked as non-causes
- Asymmetric overdetermination (trumping) cannot be resolved

---

## Resolution

Phase 4: `causation/counterfactual.py` — `CounterfactualTester` implementing three-stage HP2015 + NESS.  
Phase 7: `proofs/02_algorithm.md` — COUNTERFACTUAL_TEST pseudocode updated.

---

## Literature

- [paper_halpern2015](paper_halpern2015.md) — HP2015 Modified Definition, AC1/AC2/AC3
- [paper_beckers2021](paper_beckers2021.md) — NESS in structural causal models
- [paper_beckers2025](paper_beckers2025.md) — Nondeterministic scope and limitations
