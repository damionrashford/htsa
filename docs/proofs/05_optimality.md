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

Since EXTRACT_MAX always selects the highest-probability node from OPEN, the algorithm always expands the most promising node across all active branches. The nodes on the path to r* will be prioritized whenever their posteriors are highest among all nodes in OPEN.

When r* is reached and passes depth criteria, it is added to R. Because every node explored before r* either (a) was on the path to r*, (b) was a higher-probability intermediate node on another path, or (c) was pruned — r* is the first root cause added to R, provided the priority ordering reflects true probabilities.

**Step 4: This is best-first search.**

The algorithm is equivalent to best-first search (greedy) with P(v | evidence) as the evaluation function.

**Important qualification on consistency:**

In classical best-first search, optimality requires a consistent evaluation function — where a child's value never exceeds its parent's. In HTSA, this condition does **not** always hold:

```
P(child | evidence) CAN exceed P(parent | evidence)

Example: parent "deploy-related cause" at P = 0.30
         child "specific config key was wrong" at P = 0.85
         after strong Tier 1 log evidence for the child

A specific explanation WITH strong evidence CAN be more probable
than a general category WITHOUT specific evidence.
```

This means HTSA's best-first search is **greedy-optimal, not globally optimal**. It finds the root cause that appears most probable based on the evidence gathered so far, following the highest-posterior path at each step. It is not guaranteed to find the globally most probable root cause if strong evidence for a deep node arrives after the algorithm has already committed to a different branch.

**When is the greedy order correct?**

The greedy order matches the true optimal order when:
1. Bayesian updates are computed correctly (no bias)
2. Evidence quality is sufficient to distinguish branches early
3. Priors reflect actual base rates

Under these conditions, the algorithm explores the most promising path first and finds the highest-probability root cause first. ∎

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
