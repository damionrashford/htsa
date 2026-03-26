<h1 align="center">Formal Definitions</h1>

> Before you can prove anything, you must define everything. These are the mathematical objects that make up an HTSA investigation.

---

## Definition 1 — Investigation Graph

An investigation is a tuple **G = (V, E, P, Ev)** where:

- **V** = {v₀, v₁, ..., vₙ} is a finite set of nodes (Why answers)
- **E** ⊆ V × V is a set of directed edges (causal links)
- **P**: V → [0, 1] is a probability function assigning P(vᵢ) to each node
- **Ev**: V → 𝒫(Evidence) maps each node to its supporting evidence set
- **G is acyclic** — there are no directed cycles
- **v₀ is the origin node** — the surface Why derived from the 5 Ws

The graph is a DAG (Directed Acyclic Graph). This is the same structure used in Pearl's causal inference framework.

---

## Definition 2 — Node

A node v ∈ V represents a single causal claim — an answer to a Why question. Each node carries:

```
v = {
  statement:    the causal claim (e.g., "the config was wrong")
  P(v):         posterior probability that this is a genuine cause
  Ev(v):        set of evidence supporting or contradicting the claim
  depth(v):     number of edges from v₀ to v
  children(v):  set of nodes reachable by one edge from v
}
```

---

## Definition 3 — Edge

An edge (u, v) ∈ E represents a causal relationship: **u caused v**, or equivalently, **v is a deeper Why answer to u**.

An edge is valid if and only if it passes the **counterfactual test**:

```
(u, v) is valid  ⟺  P(effect | do(¬u)) ≠ P(effect | do(u))
```

If removing cause u does not change the probability of the effect, the edge is spurious and should be removed.

---

## Definition 4 — Root Cause

A node v ∈ V is a **root cause** if and only if all of the following hold:

```
(a)  children(v) = ∅           v is a leaf node (no deeper Why)
(b)  Ev(v) ≠ ∅                 evidence exists for the claim
(c)  ACTIONABILITY(v) = true   a concrete change addresses v
(d)  COUNTERFACTUAL(v) = true  removing v would have prevented the problem
(e)  BOUNDARY(v) = inside      v is within the system's control
(f)  RETURNS(v) = false        going one Why deeper would not change the action
```

Conditions (c)–(f) are the four depth criteria from the framework.

---

## Definition 5 — Evidence

An evidence item e ∈ Ev(v) is a tuple:

```
e = (source, tier, timestamp, direction)

where:
  source:     origin of the evidence (log, witness, measurement, etc.)
  tier:       evidence quality tier (1 = direct/physical, 2 = documentary, 3 = testimonial)
  timestamp:  when the evidence was collected
  direction:  SUPPORTS or CONTRADICTS the node's causal claim
```

---

## Definition 6 — Prior Probability

The prior probability P₀(v) is the probability assigned to a node **before** evidence is gathered. It is set from:

- Base rates for this class of problem (if known)
- Domain knowledge
- Uniform distribution (if no information exists): P₀(vᵢ) = 1/|children(parent(vᵢ))|

---

## Definition 7 — Posterior Probability

After evidence e is gathered, the posterior probability is computed by Bayes' theorem:

```
P(v | e) = P(e | v) × P(v) / P(e)

where:
  P(v | e)  = posterior — updated belief that v is a cause, given evidence e
  P(e | v)  = likelihood — probability of seeing this evidence if v is true
  P(v)      = prior — belief before this evidence
  P(e)      = marginal — probability of seeing this evidence under any hypothesis
```

---

## Definition 8 — Entropy

The entropy of an investigation at any point is:

```
H(G) = -Σ P(vᵢ) × log₂ P(vᵢ)

summed over all active (non-pruned) leaf nodes.
```

- **Maximum entropy**: all causes equally likely (investigation has not started)
- **Zero entropy**: one cause has P = 1 (investigation is complete)
- **Progress** = reduction in entropy from one step to the next

---

## Definition 9 — Pruning Threshold

A pruning threshold **θ** ∈ (0, 1) is set before the investigation begins. Any node whose posterior probability drops below θ is pruned:

```
IF P(v | e) < θ  →  remove v from active exploration
```

A common default is θ = 0.05 (5%).

---

## Summary

| Object | Symbol | What It Represents |
|:---:|:---:|---|
| Investigation graph | G = (V, E, P, Ev) | The full structure of the investigation |
| Node | v ∈ V | A single causal claim |
| Edge | (u, v) ∈ E | A causal link between claims |
| Root cause | v where children(v) = ∅ + depth criteria | The actionable end of a causal chain |
| Evidence | e ∈ Ev(v) | Data supporting or contradicting a claim |
| Prior | P₀(v) | Belief before evidence |
| Posterior | P(v \| e) | Belief after evidence |
| Entropy | H(G) | Uncertainty remaining in the investigation |
| Pruning threshold | θ | Minimum probability to continue exploring |

---

<p align="center"><strong>Next →</strong> <strong><a href="02_algorithm.md">02 — The Algorithm</a></strong></p>
