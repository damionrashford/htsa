<h1 align="center">Proof of Completeness</h1>

> No root cause above the confidence threshold will be missed.

---

## Theorem

**If a root cause r exists in G with P(r) ≥ θ_prune at every ancestor along the path from v₀ to r, then HTSA will find r.**

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

## Corollary

**If θ_prune = 0, HTSA is unconditionally complete** — it will find every root cause in the graph, regardless of probability.

*Proof:* With θ_prune = 0, no node is ever pruned (step 9 never triggers). Every non-discarded, non-terminal node is added to OPEN and eventually explored. Since G is finite, all leaf nodes are reached. All leaf nodes that satisfy the depth criteria are added to R. ∎

---

<p align="center"><strong>← Previous</strong> <strong><a href="03_termination.md">03 — Termination</a></strong> · <strong>Next →</strong> <strong><a href="05_optimality.md">05 — Optimality</a></strong></p>
