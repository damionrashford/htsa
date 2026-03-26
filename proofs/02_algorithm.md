<h1 align="center">The Algorithm</h1>

> HTSA expressed as a formal procedure — with defined inputs, outputs, and steps that can be analyzed for correctness.

---

## Formal Algorithm

```
ALGORITHM: HTSA(v₀, θ_prune)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INPUT
  v₀         origin node (surface Why from 5 Ws)
  θ_prune    pruning threshold (default: 0.05)

OUTPUT
  R          set of identified root causes with resolutions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ── LAYER 1: SITUATION MAP ──

1.   INITIALIZE
     Run 5 Ws → construct origin node v₀
     Set prior P₀(v₀) from base rates
     OPEN ← priority queue containing {v₀}, ordered by P(v) descending
     R ← ∅

  ── LAYER 2: CAUSAL CHAIN ──

2.   WHILE OPEN ≠ ∅:

3.     v ← EXTRACT_MAX(OPEN)
       // Select the node with highest posterior probability

4.     C ← EXPAND(v)
       // Ask "Why is v true?" → generate child nodes C = {c₁, c₂, ..., cₖ}
       // Each child is a possible deeper cause

5.     FOR EACH c ∈ C:

6.       e ← GATHER_EVIDENCE(c)
         // Collect evidence relevant to causal claim c

7.       IF ¬COUNTERFACTUAL_TEST(c, e):
           DISCARD(c)
           CONTINUE
         // If removing c would not change the outcome,
         // c is not a genuine cause — skip it

8.       P(c) ← BAYESIAN_UPDATE(P(c), e)
         // P(c | e) = P(e | c) × P(c) / P(e)

9.       IF P(c) < θ_prune:
           PRUNE(c)
           CONTINUE
         // Below confidence threshold — stop exploring this branch

10.      IF DEPTH_CRITERIA(c):
           R ← R ∪ {c}
         // All four tests pass:
         //   (a) Actionability — a concrete change exists
         //   (b) Counterfactual clarity — the mechanism is understood
         //   (c) System boundary — the cause is within control
         //   (d) Diminishing returns — going deeper won't change the action

11.      ELSE:
           INSERT(OPEN, c)
         // Depth criteria not met — continue exploring deeper

  ── LAYER 3: RESOLUTION ──

12.  reopen_count ← {}    // tracks re-openings per node
     MAX_REOPEN ← 3       // configurable bound

     FOR EACH r ∈ R:
       RESOLVE(r)
       // Assign: fix, mitigate, or accept
       // Run counterfactual test on the proposed fix:
       //   "If this fix had existed, would the problem still have occurred?"
       //   If yes → fix targets a symptom, go deeper:
       //     IF reopen_count[r] < MAX_REOPEN:
       //       reopen_count[r] ← reopen_count[r] + 1
       //       return r to OPEN
       //     ELSE:
       //       ESCALATE(r) — flag as requiring a new investigation
       //   If no  → fix is correctly targeted
       // Assign owner and deadline
       // Priority = Impact(r) × Recurrence(r) × Actionability(r)

  ── LAYER 4: VERIFICATION & LEARNING ──

13.  MAX_VERIFY ← 3       // configurable bound

     FOR EACH r ∈ R:
       IMPLEMENT fix for r
       IF VERIFY(r) = false:
         IF reopen_count[r] ≥ MAX_VERIFY:
           ESCALATE(r)
           // Problem is beyond this investigation's scope
           // Launch a separate, independent investigation
           CONTINUE
         reopen_count[r] ← reopen_count[r] + 1
         // Problem recurred → root cause identification was incomplete
         // Return r to OPEN as a new origin node (recursive property)
         OPEN ← {r}
         GOTO step 2
       // Fix confirmed → update priors for next investigation
       UPDATE_PRIORS(r)

14.  RETURN R
```

---

## Step-by-Step Mapping

Each step maps to a specific mathematical foundation:

| Step | Operation | Layer | Math Foundation |
|:---:|---|:---:|---|
| 1 | Initialize from 5 Ws | 1 | **[01 Graph Theory](../math/01_graph_theory.md)** — construct the DAG |
| 1 | Set priors | 1 | **[05 Bayesian Reasoning](../math/05_bayesian_reasoning.md)** — prior assignment |
| 3 | Select highest-probability node | 2 | **[06 Search Algorithms](../math/06_search_algorithms.md)** — best-first search |
| 4 | Expand node | 2 | **[02 Exponential Problem Space](../math/02_exponential_problem_space.md)** — branching |
| 6 | Gather evidence | 2 | **[08 Evidence Evaluation](../math/08_evidence_evaluation.md)** — evidence tiers |
| 7 | Counterfactual test | 2 | **[03 Causal Inference](../math/03_causal_inference.md)** — do-calculus |
| 8 | Bayesian update | 2 | **[05 Bayesian Reasoning](../math/05_bayesian_reasoning.md)** — posterior computation |
| 9 | Prune low-probability | 2 | **[04 Information Theory](../math/04_information_theory.md)** — entropy reduction |
| 10 | Depth criteria | 2 | **[03 Causal Inference](../math/03_causal_inference.md)** — root cause identification |
| 12 | Resolve root causes | 3 | **[03 Causal Inference](../math/03_causal_inference.md)** — counterfactual test on fix |
| 13 | Verify and update priors | 4 | **[05 Bayesian Reasoning](../math/05_bayesian_reasoning.md)** — prior update for next investigation |
| All | Bias resistance | All | **[07 Cognitive Biases](../math/07_cognitive_biases.md)** — operator discipline |

---

## Subroutines

### EXPAND(v)

```
EXPAND(v):
  Ask: "Why is v true?"
  Generate all plausible answers → {c₁, c₂, ..., cₖ}
  For each cᵢ: set P₀(cᵢ) = prior from base rates or 1/k if unknown
  Create edges (v, cᵢ) for each child
  RETURN {c₁, c₂, ..., cₖ}
```

**How to generate good children (the EXPAND method):**

EXPAND is the most consequential step — the investigation can only find causes that someone thinks to generate. Use these techniques to maximize coverage:

```
1. CATEGORY SCAN — check each cause class:
   □ People      — who acted, and what enabled them?
   □ Process     — what step failed or was missing?
   □ Technology  — what system, tool, or component failed?
   □ Environment — what external condition contributed?
   □ Information — what was unknown, misunderstood, or miscommunicated?

2. INVERSION — ask the opposite:
   "What would have had to be true for v to NOT occur?"
   Each answer is a candidate child (the absence of a preventive condition).

3. TEMPORAL DECOMPOSITION — break the timeline:
   "What changed just before v became true?"
   Recent changes are high-probability children.

4. ANALOGICAL TRANSFER — ask:
   "In similar past investigations, what were the causes at this level?"
   Historical root causes seed the child list.

5. ADVERSARIAL GENERATION — assign one person to ask:
   "What cause would we NOT want to find?"
   This surfaces politically uncomfortable but real causes.
```

The goal is not exhaustive enumeration (impossible), but structured coverage across cause categories. A single-category EXPAND (e.g., only technical causes) will miss entire branches.

### COUNTERFACTUAL_TEST(c, e)

```
COUNTERFACTUAL_TEST(c, e):
  Ask: "If c had NOT been true, would the problem still have occurred?"
  IF yes  → RETURN false    // c is not a genuine cause
  IF no   → RETURN true     // c is a genuine causal factor
```

### BAYESIAN_UPDATE(P, e)

```
BAYESIAN_UPDATE(P(c), e):
  Compute likelihood:  P(e | c)
  Compute marginal:    P(e) = P(e | c)P(c) + P(e | ¬c)P(¬c)
  Compute posterior:   P(c | e) = P(e | c) × P(c) / P(e)
  RETURN P(c | e)
```

### DEPTH_CRITERIA(c)

```
DEPTH_CRITERIA(c):
  (a) ← ACTIONABILITY(c)         // Does a concrete change exist?
  (b) ← COUNTERFACTUAL_CLARITY(c) // Is the mechanism understood?
  (c) ← SYSTEM_BOUNDARY(c)       // Is the cause within control?
  (d) ← DIMINISHING_RETURNS(c)   // Would going deeper change the action?
  RETURN (a) ∧ (b) ∧ (c) ∧ ¬(d)
```

### RESOLVE(r)

```
RESOLVE(r):
  Determine type: FIX, MITIGATE, or ACCEPT
  Propose concrete change
  Run counterfactual test on proposed fix:
    "If this fix had existed before the problem, would the problem still have occurred?"
    IF yes → fix targets a symptom, not the root cause
      IF reopen_count[r] < MAX_REOPEN → return r to OPEN, increment reopen_count[r]
      ELSE → ESCALATE(r) — requires a new, separate investigation
    IF no  → fix is correctly targeted → proceed
  Assign owner and deadline
  Compute priority: Impact(r) × Recurrence(r) × Actionability(r)
```

### VERIFY(r)

```
VERIFY(r):
  After fix is implemented:
    Has the problem recurred?        → IF yes: RETURN false
    Does monitoring confirm the fix? → IF no:  RETURN false
  RETURN true
```

### UPDATE_PRIORS(r)

```
UPDATE_PRIORS(r):
  Record: were base rates accurate?       → adjust for next investigation
  Record: which branches were pruned?     → update prior for that cause class
  Record: was the first hypothesis correct? → track over time for anchoring detection
  Record: any surprises?                  → document explicitly (highest-value signal)
```

---

## Properties to Prove

This algorithm has five provable properties:

| Property | Claim | Proof |
|:---:|---|---|
| Termination | The algorithm halts in finite time | **[03](03_termination.md)** |
| Completeness | All root causes above θ are found | **[04](04_completeness.md)** |
| Optimality | The most likely root cause is found first | **[05](05_optimality.md)** |
| Convergence | Posteriors approach truth with more evidence | **[06](06_convergence.md)** |
| Information gain | Every good question reduces entropy | **[07](07_information_gain.md)** |

---

<p align="center"><strong>← Previous</strong> <strong><a href="01_formal_definitions.md">01 — Formal Definitions</a></strong> · <strong>Next →</strong> <strong><a href="03_termination.md">03 — Termination</a></strong></p>
