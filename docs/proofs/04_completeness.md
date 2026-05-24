<h1 align="center">Proof of Completeness</h1>

> No root cause above the confidence threshold will be missed.

---

## Theorem

**If a root cause r exists in G with P(r) ≥ θ_prune at every ancestor along the path from v₀ to r, then HTSA will find r.**

**Critical scope:** This theorem guarantees completeness *over the graph G that was constructed*. G is built by the EXPAND subroutine — which is a human operation. If the true root cause was never generated as a child node during any EXPAND step, it does not exist in G, and this theorem does not apply. HTSA is complete over the investigation space the investigator managed to construct. It cannot find causes no one thought to ask about. See the [EXPAND method in 02_algorithm.md](02_algorithm.md) for techniques to maximize coverage.

---

## Setup

Given:
- G = (V, E, P, Ev) is a finite DAG
- r ∈ V is a root cause (satisfies all conditions in Definition 4)
- θ_prune is the pruning threshold
- There exists a path v₀ → v₁ → ... → vₖ → r in G
- For every node vᵢ on this path: P(vᵢ | evidence) ≥ θ_prune

---

## Proof

**Step 1: The origin node is explored.**

v₀ is inserted into OPEN during initialization (step 1 of the algorithm). Since OPEN is non-empty, the WHILE loop executes and v₀ is extracted.

**Step 2: Each node on the path to r is explored.**

We prove by induction on the path v₀ → v₁ → ... → vₖ → r:

*Base case:* v₀ is explored (Step 1).

*Inductive step:* Assume vᵢ is explored. When vᵢ is extracted from OPEN, EXPAND(vᵢ) generates all children, including vᵢ₊₁. For vᵢ₊₁ to reach OPEN, it must:

```
(a) Pass the counterfactual test
    → It does, because vᵢ₊₁ is on the path to a genuine root cause r.
      If vᵢ₊₁ were not a genuine causal factor, r could not be
      a root cause reachable through vᵢ₊₁.

(b) Have P(vᵢ₊₁ | evidence) ≥ θ_prune
    → It does, by our assumption that all nodes on the path
      maintain probability above threshold.

(c) Fail the depth criteria (otherwise it would be classified as a root cause itself)
    → It does, because vᵢ₊₁ is an intermediate node, not r.
      The depth criteria would fail at least on diminishing returns —
      going deeper (to r) WOULD change the action.
```

Therefore vᵢ₊₁ is inserted into OPEN.

Since OPEN is a priority queue and the algorithm exhausts all nodes in OPEN, vᵢ₊₁ will eventually be extracted and expanded.

*By induction,* every node on the path from v₀ to r is explored.

**Step 3: The root cause r is found.**

When vₖ (the parent of r) is extracted and expanded, r is generated as a child. Since r is a root cause:

```
(a) r passes the counterfactual test (by definition — removing r
    would have prevented the problem)
(b) P(r | evidence) ≥ θ_prune (by assumption)
(c) r passes all four depth criteria (by definition of root cause)
```

Therefore r is added to R.

**Step 4: Conclusion.**

R contains r. The root cause was not missed. ∎

---

## Important Caveat

The completeness guarantee depends on the assumption that **P(vᵢ) ≥ θ_prune for every ancestor of r**. If any ancestor's probability drops below the threshold, the entire subtree containing r is pruned.

This is a feature, not a bug — it is the mechanism that prevents exponential blowup. But it means:

```
Completeness guarantee = f(θ_prune)

  θ_prune = 0     → complete (all root causes found, but no pruning benefit)
  θ_prune = 0.05  → complete for root causes with ≥5% probability at every ancestor
  θ_prune = 0.50  → only finds root causes on the most probable path
```

The pruning threshold is a **precision-recall tradeoff**. Lower θ means more completeness but more work. Higher θ means faster convergence but risk of missing low-probability root causes.

---

## Additional Caveat — Faithfulness (Assumption A4)

The completeness proof also requires **A4 (Faithfulness)**: G is faithful to the underlying causal structure. Faithfulness can be violated when:

```
Violation 1 — Canceling paths:
  Two causal paths from root cause r to the outcome have
  coefficients of opposite sign. The paths cancel — r appears
  statistically independent of the outcome even though it is a cause.
  Bayesian updates cannot raise P(r | evidence) above θ_prune.
  r is pruned despite being genuine.

Violation 2 — Measurement noise:
  Instrument error creates artificial independence between a cause
  and its observable effects. Tier 1 evidence appears non-diagnostic.

Violation 3 — Near-cancellation:
  Paths don't cancel exactly but are close enough that evidence
  is too weak to raise P(r) above threshold before the budget runs out.
```

When faithfulness cannot be assumed:

```
Option 1: θ_prune = 0 — unconditional completeness (no pruning)
Option 2: Lower θ_prune toward 0.01 and explicitly seek
          counter-evidence (evidence that would DISPROVE r if false)
Option 3: Label conclusions as provisional — subject to revision
          if stronger experimental evidence becomes available
```

The completeness guarantee is **unconditional over the graph G under A1–A5**. It is **conditional on A4** in the presence of potential path cancellation. This is not a failure of the algorithm — it is a fundamental limit of observational investigation: a cause that leaves no observable trace cannot be confirmed by any observational method.

---

## Corollary

**If θ_prune = 0, HTSA is unconditionally complete** — it will find every root cause in the graph, regardless of probability.

*Proof:* With θ_prune = 0, no node is ever pruned (step 9 never triggers). Every non-discarded, non-terminal node is added to OPEN and eventually explored. Since G is finite, all leaf nodes are reached. All leaf nodes that satisfy the depth criteria are added to R. ∎

---

<p align="center"><strong>← Previous</strong> <strong><a href="03_termination.md">03 — Termination</a></strong> · <strong>Next →</strong> <strong><a href="05_optimality.md">05 — Optimality</a></strong></p>
