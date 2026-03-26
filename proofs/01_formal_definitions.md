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

An edge (u, v) ∈ E represents a causal relationship: **v is a deeper cause of u** — asking "Why is u true?" yields v as an answer. Edges point from surface toward root cause.

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
  tier:       evidence quality tier:
                1 = physical/instrumental (logs, sensors, controlled experiments)
                2 = observational (direct witness observation at time of event)
                3 = inferential (reasoned conclusion from Tier 1 or 2 evidence)
                4 = testimonial/reconstructive (recalled after the fact)
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

summed over all active (non-pruned) frontier nodes —
nodes that are either unexpanded leaves (not yet explored deeper)
or confirmed root causes (exploration complete on that branch).

Note: For measuring remaining investigative uncertainty, the most
relevant subset is the frontier nodes (unexpanded leaves only).
Confirmed root causes have low uncertainty by definition. When
tracking "how much work remains," compute entropy over the frontier.
```

- **Maximum entropy**: all causes equally likely (investigation has not started)
- **Zero entropy**: one cause has P = 1 (investigation is complete)
- **Progress** = reduction in entropy from one step to the next

---

## Definition 9 — Resolution

A resolution for a root cause r ∈ R is a tuple:

```
res(r) = (type, change, owner, deadline, priority)

where:
  type:       FIX (root cause eliminated), MITIGATE (impact reduced), or ACCEPT (risk acknowledged)
  change:     the specific system/process/policy alteration
  owner:      who is responsible for implementing the change
  deadline:   when the change must be implemented
  priority:   Impact(r) × Recurrence(r) × Actionability(r)
```

A resolution is valid if and only if it passes the **counterfactual test on the fix**:

```
"If this change had existed before the problem occurred, would the problem still have happened?"
  IF yes → the fix targets a symptom, not the root cause. Go deeper.
  IF no  → the fix is correctly targeted.
```

---

## Definition 10 — Pruning Threshold

A pruning threshold **θ** ∈ (0, 1) is set before the investigation begins. Any node whose posterior probability drops below θ is pruned:

```
IF P(v | e) < θ  →  remove v from active exploration
```

Common defaults by domain:

```
General investigation:         θ = 0.05 (5%)
Safety-critical (aviation,
  nuclear, medical):           θ = 0.01 (1%) or lower
                               — any plausible cause that could cause harm
                                 must be investigated regardless of probability
Exploratory / research:        θ = 0.10 (10%)
                               — faster convergence when consequences are low
```

The threshold must be set before the investigation begins to avoid sunk cost bias. In safety-critical domains, err toward θ → 0.

**Pruning recovery:** Pruning is normally permanent — once a branch drops below θ, it is removed from active exploration. However, if evidence discovered later on a different branch retroactively raises the probability of a pruned branch, the investigator may **un-prune** it:

```
IF new evidence e′ is discovered such that P(v_pruned | e′) ≥ θ:
  → Restore v_pruned to OPEN
  → Document the evidence that triggered restoration
  → This counts as a re-opening (subject to MAX_REOPEN bound)
```

Un-pruning is rare but important. It prevents the framework from permanently discarding a valid hypothesis due to insufficient early evidence. To enable this, maintain a **pruned list** rather than deleting pruned nodes entirely.

---

## Summary

| Object | Symbol | What It Represents |
|:---:|:---:|---|
| Investigation graph | G = (V, E, P, Ev) | The full structure of the investigation |
| Node | v ∈ V | A single causal claim |
| Edge | (u, v) ∈ E | A causal link between claims |
| Root cause | v where children(v) = ∅ + depth criteria | The actionable end of a causal chain |
| Evidence | e ∈ Ev(v) | Data supporting or contradicting a claim (4 tiers) |
| Prior | P₀(v) | Belief before evidence |
| Posterior | P(v \| e) | Belief after evidence |
| Entropy | H(G) | Uncertainty remaining in the investigation |
| Resolution | res(r) = (type, change, owner, deadline, priority) | The action taken for each root cause |
| Pruning threshold | θ | Minimum probability to continue exploring |

---

<p align="center"><strong>Next →</strong> <strong><a href="02_algorithm.md">02 — The Algorithm</a></strong></p>
