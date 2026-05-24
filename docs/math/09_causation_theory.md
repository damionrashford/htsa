<h1 align="center">Causation Theory</h1>

> Knowing that X caused Y is not enough. You need to know *how*, *how much*, and *whether removing X would have prevented Y even given everything else that was happening*.

---

## Why Binary Causation Falls Short

The HTSA counterfactual test in its simplest form asks: "Would the problem have occurred without this cause?" This is **necessity-based causation** — a cause is necessary if removing it would have prevented the outcome.

Necessity works for clean causal chains. It fails in three common patterns that appear in real investigations:

**Pattern 1 — Late preemption:**
Billy throws a rock at a window at t=1. Suzy throws a rock at t=2. Billy's hits first and breaks the window. Suzy's would have hit anyway. Is Billy's throw a cause? Yes. But the simple counterfactual fails: "Would the window have broken without Billy's throw?" — yes, because Suzy's would have hit it.

**Pattern 2 — Trumping:**
Merlin casts a spell at t=1 that turns the prince into a frog. Morgana casts the same spell at t=2. Only one spell is needed. Merlin's takes effect (temporal priority). Is Merlin's the cause? Yes. The simple counterfactual fails: "Would the prince have been turned into a frog without Merlin's spell?" — yes, because Morgana's would have done it.

**Pattern 3 — Symmetric overdetermination:**
Two fires, each independently sufficient to burn a building, arrive at the same time. Both causes are real. Neither is necessary — removing either one still leaves the other. The simple counterfactual fails for both.

HTSA's Stage 2 (contingent counterfactual) handles symmetric overdetermination (Pattern 3). It does not handle Patterns 1 and 2. The theories below address all three.

---

## The HP2015 Modified Definition

Halpern and Pearl (2005, updated 2015) provide the Modified HP Definition of actual causation. It solves all three patterns above.

**Definition:**

C = c is an actual cause of E in model M under context u if and only if:

```
AC1 — Realization:
  (M, u) |= [X ← x] φ
  C actually has value c, and E actually occurred.

AC2 — Counterfactual sensitivity (W-partition):
  There exists a partition (Z, W) of variables and values x', w such that:
  (M, u) |= [X ← x', Z_W ← z_W] ¬φ

  Where:
  - x' ≠ x is an alternative value for C
  - W is a set of "context variables" held fixed at their actual values z_W
  - Under this contingency, changing C to x' prevents E

AC3 — Minimality:
  X is minimal — no strict subset of X satisfies both AC1 and AC2.
```

**How AC2 solves the preemption and trumping cases:**

```
Late preemption (Billy/Suzy):
  W = {Suzy's throw} held at its actual value (throw exists)
  Under W: if Billy did NOT throw, E would not occur —
  because Suzy's rock hasn't hit yet (the timing matters)
  → Billy's throw passes AC2 ✓

Trumping (Merlin/Morgana):
  W = {Morgana's spell} held at actual value (spell exists)
  Under W: if Merlin had NOT cast, the frog transformation
  would still occur — but Merlin's IS the cause because
  temporal priority means it's Merlin's that takes effect
  The W-partition correctly identifies Merlin's as the cause ✓
```

**Implementing HP2015 in HTSA:**

The W-partition construction strategy: W = all variables **not** on any causal path from the candidate cause C to the outcome E. This is the minimal W that makes late preemption and trumping detectable without overfitting the context.

```
COUNTERFACTUAL_TEST_HP2015(C, E, all_variables):

  1. Construct W = {v ∈ all_variables : v is not on any path C → E}
  2. Test: does E not occur under [C ← c', W ← w_actual]?
  3. If yes: C passes AC2 — it is an actual cause of E
  4. If no: C fails — it is not a cause, or a different W is needed

  Note: if multiple W-partitions exist, AC2 requires at least one works.
  The investigator may need to try several W constructions for complex graphs.
```

---

## The NESS Test — Minimal Sufficiency

NESS (Necessary Element of a Sufficient Set) was introduced by Mackie (1965) as INUS conditions and formalized by Wright (1988) and Beckers (2021) in structural causal models.

**Definition:**

C is a cause of E if and only if C is a **necessary element of a sufficient set** for E:

```
A set S is sufficient for E if:
  S → E  (S being true guarantees E under the actual context)

C is a necessary element of S if:
  S \ {C} is NOT sufficient for E
  (removing C from S makes S insufficient)

NESS holds if there exists such an S containing C.
```

**Why NESS is more precise than HP2015:**

HP2015 requires that some W-partition exists where C is counterfactually sensitive. NESS requires that C is necessary within a specific *minimal sufficient set*. Beckers (2021) proves that HP2015 accepts some causes that NESS rejects — cases where C is in a sufficient set but is not necessary within any minimal one.

**Practical implication for HTSA:**

After the HP2015 test confirms actual causation, the NESS test confirms **causal minimality** — that C is genuinely necessary, not just present in a sufficient context.

```
Stage 3 — Minimal Sufficiency (NESS):

  1. Identify the smallest set S containing C such that S is sufficient for E
  2. Test: is S \ {C} insufficient?
     If yes: C is a necessary element of S → NESS passes → full root cause
     If no:  C is replaceable within S → NESS fails → contributing factor

  CONTRIBUTING FACTOR: C is part of the causal picture but not a root cause
  in the strict sense. Label it, document it, but the fix priority is lower.
```

**AND-node vs. OR-node clarity:**

```
AND-node (joint causation):
  S = {A, B}  where A ∧ B → E
  A is necessary within S: S \ {A} = {B}, which is insufficient
  B is necessary within S: S \ {B} = {A}, which is insufficient
  → Both A and B pass NESS → both are root causes (AND-type)

OR-node (disjunctive causation):
  S₁ = {A} → E independently
  S₂ = {B} → E independently
  A is necessary within S₁: S₁ \ {A} = {} → insufficient ✓
  B is necessary within S₂: S₂ \ {B} = {} → insufficient ✓
  → Both A and B pass NESS independently → both are root causes (OR-type)

CONTRIBUTING FACTOR:
  S = {A, B, C} → E,  but S \ {C} = {A, B} also → E
  C is NOT necessary within S → C is a contributing factor, not root cause
```

---

## Probability of Necessity and Sufficiency

Pearl and Tian (2000) provide a quantitative framework for causation: instead of binary "is/is not a cause," compute probabilities of necessity and sufficiency.

**Three measures:**

```
PN  = P(Necessity)   = P(~E_{C=0} | C=1, E=1)
    Probability that E would NOT have occurred if C had not occurred,
    given that both C and E actually occurred.
    "Was C necessary for E in this case?"

PS  = P(Sufficiency) = P(E_{C=1} | C=0, E=0)
    Probability that E WOULD have occurred if C had occurred,
    given that neither C nor E actually occurred.
    "Would C have been sufficient to cause E?"

PNS = P(Necessity AND Sufficiency)
    = P(~E_{C=0} AND E_{C=1})
    Probability that C was both necessary and sufficient for E.
    "Was C the cause — both needed and able?"
```

**Bounds (when only observational data is available):**

```
PNS is bounded but not point-identified from observation alone:

  max(0, PN + PS - 1)  ≤  PNS  ≤  min(PN, PS)

Lower bound: max(0, PN + PS - 1)
Upper bound: min(PN, PS)

When monotonicity holds (P(E_{C=1}) ≥ P(E_{C=0}) everywhere):
  PNS = PS - P(E | C=0)  ← point-identified from experimental data
```

**PNS maps to HTSA's node taxonomy:**

```
PNS Profile       HTSA Node Type         Interpretation
─────────────────────────────────────────────────────────────────────
High PNS (≥0.7)   Single root cause      Necessary and sufficient alone
High PN, Low PS   AND-node               Necessary but not sufficient alone
Low PN, High PS   OR-node                Sufficient but not necessary
                                         (another cause would have done it)
Low PN, Low PS    Contributing factor    Present but not causally decisive
```

**How to compute in practice:**

```
Experimental data available (RCT, A/B test):
  PS = P(E | do(C=1)) — directly observable
  PN = (PS - P(E)) / P(C=1)  under monotonicity
  PNS = PS - P(E | do(C=0))  under monotonicity

Observational data only:
  Use bounds. Report PNS as [lower, upper] not a point estimate.
  Document whether monotonicity was assumed.

Investigator estimate only:
  Set PN and PS from judgment.
  PNS = geometric mean of max(0, PN+PS-1) and min(PN, PS)
  Label clearly as estimate, not computed value.
```

---

## Graded Causation — Normality and Causal Attribution

Halpern and Hitchcock (2013) extend causation theory to include **normality**: how expected or typical the causal factor was. Their result: actual causation judgments are graded, not binary — and the grading correlates with abnormality.

**The key finding:**

When two factors are both actual causes of E (both pass NESS), human investigators and legal/ethical systems consistently assign higher causal responsibility to the **more abnormal** factor. This is not a bias — it is a principled distinction.

```
Example:
  A fire starts because:
    Factor A: Engineer merged code (routine, expected)
    Factor B: Alerting system was silenced by an expired on-call schedule (abnormal)

  Both A and B pass the NESS test — both are genuine causes.
  But B has higher causal grade because it is more abnormal.

  Remediation priority follows causal grade:
    B → systemic fix (expired on-call schedules should auto-escalate)
    A → design fix (blue-green deploys, canary releases)
    
  Fixing A addresses normal risk. Fixing B addresses the abnormal failure.
  Abnormal failures are typically the ones that create incidents.
```

**Causal grade formula:**

```
normality(C) = P(C's state | baseline system operation)

  0.0 = never seen in normal operation (maximally abnormal)
  1.0 = always happens this way (maximally normal)

causal_grade(C) = PNS(C) × (1 - normality(C))

  High grade: C is a strong cause (high PNS) AND abnormal
  Low grade:  C is a weak cause OR normal (expected behavior)
```

**Prioritizing root causes by causal grade:**

```
Sort R by causal_grade descending:

1. Highest causal_grade → fix first (strong, abnormal cause)
2. Medium causal_grade → fix second (moderate cause or somewhat abnormal)
3. Lowest causal_grade → fix last or accept (weak/normal cause — may be
                          better addressed through system redesign)
```

**How to estimate normality in practice:**

```
From historical data:
  normality = occurrence_count / total_operational_periods
  Source: incident history, operational metrics, monitoring data

From expert judgment:
  normality = investigator's estimate on [0, 1]
  Label as "investigator_estimate" and document reasoning

From base rates:
  normality = industry base rate for this class of event
  Source: MTBF tables, security CVE frequency, industry benchmarks
```

---

## The Full Causation Stack

HTSA implements causation testing in three stages. Each stage catches a different class of causal relationship:

```
Stage 1 — Simple Necessity (Lewis 1973):
  "Would the problem have occurred without C?"
  Catches: simple causal chains, most day-to-day root causes
  Misses: preemption, trumping, symmetric overdetermination

Stage 2 — Actual Causation / HP2015 (Halpern & Pearl 2015):
  W-partition counterfactual sensitivity
  Catches: preemption, trumping, asymmetric overdetermination
  Misses: non-minimal causes in sufficient sets

Stage 3 — Minimal Sufficiency / NESS (Beckers 2021):
  Necessary element of a sufficient set
  Catches: contributing factors that fail minimality
  Distinguishes root causes from mere causal context

Quantitative layer — PNS (Pearl & Tian 2000):
  Probability of Necessity and Sufficiency
  Maps causes to AND-node / OR-node / single-root-cause categories
  Provides numerical strength scores for prioritization

Grading layer — Causal Grade (Halpern & Hitchcock 2013):
  Causal grade = PNS × (1 - normality)
  Determines remediation priority
  Separates "what went wrong" from "what was routine"
```

Each layer refines the output of the one below. Investigators can operate at Stage 1 for simple investigations and escalate to PNS + causal grade for complex multi-cause incidents.

---

## Key Terms

| Term | Definition |
|---|---|
| **Actual causation** | C caused E in this specific instance (not just in general) |
| **W-partition** | The set of context variables held fixed to test AC2 (HP2015) |
| **NESS** | Necessary Element of a Sufficient Set — the minimal sufficiency criterion |
| **Sufficient set** | A set S where S → E is guaranteed |
| **Necessary element** | C is necessary within S if removing C makes S insufficient |
| **Contributing factor** | Part of the causal picture but fails NESS — not a root cause |
| **PN** | Probability of Necessity — was C needed for E in this case? |
| **PS** | Probability of Sufficiency — would C alone have caused E? |
| **PNS** | Probability of Necessity and Sufficiency — the strongest claim |
| **Normality** | P(C's state \| baseline operation) — how expected was this factor? |
| **Causal grade** | PNS × (1 − normality) — prioritization score for remediation |
| **Preemption** | One cause acts before another backup cause can take effect |
| **Trumping** | Earlier cause takes effect; later identical cause is preempted |

---

<p align="center"><strong>← Previous</strong> <strong><a href="08_evidence_evaluation.md">08 — Evidence Evaluation</a></strong> · <strong>Next →</strong> <strong><a href="10_intervention_theory.md">10 — Intervention Theory</a></strong> · <strong>↑ Back to Index</strong> <strong><a href="00_index.md">Math Index</a></strong></p>
