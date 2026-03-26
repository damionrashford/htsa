<h1 align="center">Proof of Optimality</h1>

> The most likely root cause is found first.

---

## Theorem

**HTSA explores nodes in order of decreasing posterior probability. The highest-probability root cause is the first root cause added to R.**

---

## Setup

Given:
- G = (V, E, P, Ev) is a finite DAG
- OPEN is a max-priority queue ordered by P(v | evidence)
- EXTRACT_MAX always returns the node with the highest posterior probability
- Multiple root causes r₁, r₂, ..., rₘ exist in G

---

## Proof

**Step 1: OPEN is a max-priority queue.**

By construction (step 1 of the algorithm), OPEN orders nodes by their posterior probability P(v | evidence) in descending order. EXTRACT_MAX returns the node with the highest posterior.

**Step 2: Nodes are explored in probability order.**

At each iteration, the algorithm extracts the node with the highest P(v) from OPEN. When children are generated and their posteriors are computed via Bayesian update (step 8), they are inserted into OPEN at their correct priority position.

This means at any point during execution, the next node explored is always the most probable unexplored node across all active branches.

**Step 3: The first root cause found has the highest probability.**

Let r* be the root cause with the highest posterior probability among all root causes in G.

Consider the path from v₀ to r*. Every node on this path has posterior probability ≥ P(r*) at the time it is explored (because probability flows downward — a child's probability cannot exceed its parent's probability times the likelihood ratio).

Since EXTRACT_MAX always selects the highest-probability node, the nodes on the path to r* are explored before nodes on paths to lower-probability root causes, provided their posteriors remain highest after Bayesian updates.

When r* is reached and passes depth criteria, it is the first root cause added to R.

**Step 4: This is best-first search.**

The algorithm is equivalent to best-first search with P(v | evidence) as the evaluation function. Best-first search is optimal when the evaluation function is consistent — meaning the estimated value of a node is never greater than the estimated value of its parent minus the edge cost.

In HTSA, consistency holds because:

```
P(child | evidence) ≤ P(parent | evidence)

in the worst case (when evidence fully supports the child),
and typically:

P(child | evidence) = P(parent | evidence) × P(child | parent, evidence)
```

The probability of a specific child is always ≤ the probability of its parent (a specific explanation is never more likely than the general category containing it). ∎

---

## Qualification

Optimality holds under the assumption that **Bayesian updates are computed correctly**. If priors are badly miscalibrated or evidence is misinterpreted, the priority ordering may not reflect true probabilities.

This is where cognitive biases attack optimality:

| Bias | How It Breaks Optimality |
|:---:|---|
| Anchoring | First hypothesis gets inflated priority, stays at the top of OPEN |
| Availability | Recent/vivid causes get inflated priors |
| Confirmation | Contradicting evidence is underweighted, so bad posteriors persist |

The algorithm is optimal **given correct inputs**. The proofs guarantee the math. The cognitive biases chapter addresses the operator.

---

<p align="center"><strong>← Previous</strong> <strong><a href="04_completeness.md">04 — Completeness</a></strong> · <strong>Next →</strong> <strong><a href="06_convergence.md">06 — Convergence</a></strong></p>
