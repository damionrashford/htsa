<h1 align="center">Intervention Theory</h1>

> Finding the root cause is not the same as finding the right fix. Intervention theory answers: "What is the minimum change that would have prevented this outcome?"

---

## Root Cause as an Intervention Problem

HTSA's Layer 3 (Resolution) asks: "What change will prevent recurrence?" This is an **intervention question**, not just a causal question. The formal framing:

```
Root cause analysis as intervention:

  Find the smallest set S ⊆ R such that:
    P(E_prevented | do(fix(s₁)), do(fix(s₂)), ...) ≥ θ_intervention

  where:
    E_prevented = the outcome E does not recur after fixes are applied
    do(fix(sᵢ)) = the intervention of correcting root cause sᵢ
    θ_intervention = the minimum acceptable prevention probability (default: 0.90)
```

This is different from asking "which causes existed?" — it asks "which causes, if removed, would prevent recurrence with sufficient probability?"

The key insight from CIRCA (Li et al. 2022, KDD): standard Root Cause Analysis conflates P(symptom | cause) with P(cause | symptom). The correct question is:

```
NOT: "Which cause is correlated with this outcome?" (observational)
BUT: "Which cause, if fixed, would restore normal operation?" (interventional)

P(outcome = normal | do(fix(C))) ← this is the right quantity
P(outcome = normal | C was fixed) ← this is NOT — it's observational and biased
```

The do(·) operator forces the question into the interventional frame. Correlation-based RCA (anomaly detection → correlation → root cause declaration) is mathematically unsound because it confuses these two quantities.

---

## The Minimal Intervention Set

**Why minimal matters:**

Given root causes R = {r₁, r₂, r₃}, fixing all three eliminates the problem — but may require significant resources. The minimal intervention set is the **smallest subset** S ⊆ R such that fixing S is sufficient.

```
Coverage formula (assuming independence between root causes):
  P(E_prevented | do(fix(S))) ≈ 1 - ∏ᵢ∈S (1 - PNS(rᵢ))

  This uses inclusion-exclusion under independence.
  For AND-node causes (must be fixed jointly), coverage is 0 unless
  the entire AND-group is included in S.
```

**Algorithm (minimum size first):**

```
FIND_MINIMAL_INTERVENTION(R, θ_intervention):

  For k = 1, 2, ..., |R|:
    For each subset S of size k:
      Compute coverage(S)
      If coverage(S) ≥ θ_intervention:
        RETURN S as minimal intervention set

  If no subset achieves threshold:
    RETURN R (full set required) with a note that even full remediation
    may be insufficient — investigate whether root causes were correctly identified
```

**AND-node handling:**

When root causes A and B are AND-related (the outcome required both), they must be included together in S. An AND-group contributes 0 coverage unless all members are in S.

```
AND-group {A, B}: coverage = PNS(A) × PNS(B)  if both in S
                  coverage = 0                  if only one in S

OR-node {A, B}: coverage(A) = PNS(A)
                coverage(B) = PNS(B)
                coverage({A}) ≥ θ → fix A alone; B is redundant
```

---

## Active Causal Learning for EXPAND

The EXPAND subroutine in HTSA currently generates child hypotheses through six human-cognitive techniques. Intervention theory provides a principled, computable basis for which hypotheses to generate first.

**The active causal learning framework (Zhang et al. 2022, von Kügelgen et al. 2019):**

```
Goal: learn the causal structure G with minimum number of interventions

At each step:
  1. Maintain posterior P(G | observations and interventions so far)
  2. Select intervention I* = argmax_I E[IG(G; I)]
     where IG = expected reduction in uncertainty about causal structure
  3. Intervene, observe outcome, update P(G | ...)
  4. Repeat until P(G | ...) is sufficiently concentrated
```

In investigation terms: instead of generating all possible child hypotheses and asking about them in arbitrary order, select the next question by asking which question would give the most information about the causal structure.

**Interventional information gain for question selection:**

```
For candidate question Q about variable X:

  IG_causal(Q) = H_do(X)(root_causes) - E[H(root_causes | answer)]

  where H_do(X) is the interventional entropy under do(X = x)

Prioritize questions with highest IG_causal.
Stop generating new questions when:
  max_Q IG_causal(Q) < θ_expand  (diminishing returns threshold)
```

**Practical SMART_EXPAND heuristic (when full Bayesian structure is unavailable):**

```
SMART_EXPAND(v, current_posteriors):

  1. List candidate child hypotheses using the six EXPAND techniques
  2. For each candidate c_i:
     a. Estimate: "If I knew c_i were true/false, how much would
        the posteriors of all other hypotheses change?"
     b. Score: IG_estimate(c_i) = estimated posterior shift magnitude
  3. Sort candidates by IG_estimate descending
  4. Present top-k to investigator (k = 3 by default)
  5. Stop generating when IG_estimate of remaining candidates < θ_expand

This is not optimal (it's greedy), but it is better than arbitrary ordering.
The investigator's time is finite; focus it on high-IG questions first.
```

---

## Chain-Reaction Systems and Bisection Search

In causal chain systems — cascading failures, dependency chains, multi-stage processes — the causal structure has a specific topology that allows more efficient investigation than general graph search.

Panayiotou & Simsek (2026) prove that in chain-reaction systems:

```
Causal chain: v₁ → v₂ → v₃ → ... → vₙ → E

Optimal investigation strategy: bisection

  Step 1: Test the midpoint vₙ/₂
    If vₙ/₂ is faulty: root cause is in [v₁, ..., vₙ/₂]
    If vₙ/₂ is healthy: root cause is in [vₙ/₂₊₁, ..., vₙ]

  Step 2: Repeat on the relevant half

  Complexity: O(log n) tests instead of O(n)
```

**When to apply bisection in HTSA:**

```
Apply bisection when:
  - The causal chain is known or strongly hypothesized to be linear
  - Each node has a binary "faulty/healthy" state testable by evidence
  - The failure propagates from root to symptom in one direction

Do NOT apply bisection when:
  - The causal graph has multiple branches (use best-first search instead)
  - Nodes can be both causes and effects (feedback loops — use loop protocol)
  - The chain structure is uncertain (use standard EXPAND)
```

**Integration with HTSA's search strategies:**

The framework already supports strategy switching mid-investigation. Add bisection as a fourth strategy for chain-topology situations:

```
DFS:       explore one branch completely before branching
BFS:       explore all branches at each depth level before going deeper
Best-First: follow highest-probability node at each step (default)
Bisection: binary search on linear causal chains (new in v2)
```

Switch to Bisection when the investigator identifies the investigation as a linear chain (e.g., a deployment pipeline, a network packet path, a sequential process).

---

## Observational vs. Interventional Quantities

A recurring theme in intervention theory is the distinction between what is observable and what requires intervention.

```
Observational quantities (can be measured without changing the system):
  P(E | C=1)         — outcome rate when C is present
  P(E | C=0)         — outcome rate when C is absent
  ρ(C, E)            — correlation between C and E

Interventional quantities (require active manipulation):
  P(E | do(C=1))     — outcome rate when C is forced to 1
  P(E | do(C=0))     — outcome rate when C is forced to 0
  P(E | do(fix(C)))  — outcome rate when C's fault is corrected
```

The gap between observational and interventional quantities is the confounding gap — how much of the apparent association between C and E is driven by common causes, not by C itself.

**Tier 1 evidence closes the gap:**

```
Tier 1 experimental evidence (A/B test, RCT, controlled experiment):
  Provides interventional data directly.
  P(E | do(C=1)) = P(E | C=1) in a well-designed RCT.

Tier 1 observational evidence (logs, sensors):
  Still observational. Does NOT directly estimate interventional quantities.
  May be confounded by system state, selection bias, or common causes.
  Use Granger causality or interrupted time series to approach intervention
  under stationarity and no-contemporaneous-confounders assumptions.

Tier 3-4 evidence:
  Always observational.
  Never estimate interventional quantities from these tiers alone.
```

**Rule:** Only use do(fix(C)) notation (interventional) when you have Tier 1 experimental evidence or a validated causal model. For Tier 2-4 evidence, state the claim as observational: "C was associated with E" rather than "fixing C prevents E."

---

## Connection to HTSA's Layer 3

Layer 3 (Resolution) of HTSA handles: what action addresses each root cause? Intervention theory formalizes this:

```
Step 1 (HTSA Layer 2): Identify root causes R via causal chain analysis
Step 2 (new — intervention):
  For each rᵢ ∈ R: compute PNS(rᵢ) and causal_grade(rᵢ)
Step 3 (new — minimal set): Find minimal S ⊆ R such that coverage(S) ≥ θ
Step 4 (HTSA Layer 3): Assign resolutions to nodes in S with priority by causal_grade
Step 5 (HTSA Layer 4): Verify: does do(fix(S)) actually prevent recurrence?
```

The counterfactual test on the fix (Definition 9 in proofs/01) is exactly the interventional check: "If this change had existed before the problem occurred, would the problem still have happened?" This is P(E | do(fix(S))) < threshold.

---

## Key Terms

| Term | Definition |
|---|---|
| **do(·) operator** | Forces a variable to a value by intervention, cutting it from its causal parents |
| **Interventional quantity** | A probability computed under do(·) — not obtainable from passive observation alone |
| **Observational quantity** | A probability computed from passive observation — may be confounded |
| **Minimal intervention set** | The smallest subset of root causes whose fixing achieves the prevention threshold |
| **Coverage** | P(E_prevented \| do(fix(S))) — the probability of prevention given fixing subset S |
| **Active causal learning** | Selecting questions/interventions to maximize information gain about causal structure |
| **Bisection search** | Binary search strategy for linear causal chains: O(log n) tests |
| **Confounding gap** | The difference between P(E \| C) and P(E \| do(C)), driven by common causes |
| **CIRCA** | Causal Inference-Based Root Cause Analysis (Li et al. 2022) — RCA as intervention problem |
| **Chain-reaction system** | A system where failures cascade along a linear causal chain |

---

<p align="center"><strong>← Previous</strong> <strong><a href="09_causation_theory.md">09 — Causation Theory</a></strong> · <strong>↑ Back to Index</strong> <strong><a href="00_index.md">Math Index</a></strong> · <strong><a href="../FRAMEWORK.md">Framework</a></strong></p>
