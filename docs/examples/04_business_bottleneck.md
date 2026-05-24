<h1 align="center">Worked Example: B2B Sales Cycle Bottleneck</h1>

> A B2B software company's sales cycle has doubled from 45 days to 90 days over the past two quarters. Revenue targets are being missed. The CEO wants to know why deals are stalling.

---

## Setup

```
INVESTIGATION: Sales Cycle Degradation — 45-day to 90-day cycle expansion
DATE: 2026-01-15
INVESTIGATOR: VP Revenue Operations (with adversarial review by outside consultant)
MODE: [x] Full  [ ] Rapid
PRUNING THRESHOLD (θ): 0.05 (5% — general investigation)
```

**Search strategy:** Best-First search — follow the highest-probability branch first. Switch to BFS if the initial hypothesis fails, to ensure no branch is overlooked. `[SEARCH]`

**Investigation-as-confounder warning:** This investigation involves people — sales reps, managers, prospects. The moment the investigation is announced, behavior changes. Reps who know leadership is watching deal velocity will alter their pipeline management, discount patterns, and reporting. Apply the **Temporal Firewall Protocol** throughout. `[CAUSAL]` `[EVIDENCE]`

```
TEMPORAL FIREWALL — activated before investigation kickoff

PRE-investigation evidence (captured before announcement):
  CRM data, deal stage timestamps, win/loss records, pricing logs,
  product usage telemetry, support ticket history, competitive
  intelligence reports — all dated before 2026-01-15.

POST-investigation evidence (captured after announcement):
  Rep interviews, manager assessments, prospect feedback calls,
  pipeline review observations — all subject to reliability discount.
```

---

## Layer 1 — Situation Map (5 Ws)

**Who:**

| Role | Actor |
|---|---|
| **Originator** | Multiple systemic factors (to be identified) |
| **Trigger** | Unknown — no single event; gradual degradation over two quarters |
| **Affected** | Sales team (missed commissions), company (missed revenue targets), customers (longer procurement cycles) |
| **Detector** | CFO flagged the trend in Q3 board report |
| **Resolver** | Cross-functional — Sales, Product, Marketing (TBD based on root cause) |
| **Stakeholder** | CEO, Board, investors expecting growth metrics |

**What:** Average sales cycle length has increased from 45 days (trailing 4-quarter average) to 90 days (last 2 quarters). Measured from first qualified meeting to closed-won. 62% of deals in the pipeline are stalled at Stage 3 (proposal/evaluation) for 30+ days. Revenue is 23% below plan for the trailing two quarters.

**When:**
- **Before:** Q1–Q2 2025 — 45-day average cycle, on-target revenue.
- **During:** Q3–Q4 2025 — cycle lengthening began mid-Q3. By end of Q4, average hit 90 days.
- **After:** Q1 2026 — current pipeline shows no improvement; board pressure increasing.

`[GRAPH]` The timeline establishes the surface node of the Why tree. The gradual onset rules out single-event causes (e.g., a bad product release) and points toward structural or market-level shifts.

**Where:** All segments affected, but enterprise segment (deals >$100K ACV) shows the sharpest increase — from 60 days to 120 days. Mid-market segment (deals $25K–$100K) went from 35 days to 70 days. The pattern is global, not isolated to one region or vertical.

**Why (surface):** Deals are stalling in the evaluation stage. Prospects are not saying no — they are saying "not yet." This is the entry point into Layer 2.

`[INFO]` The surface Why establishes initial entropy. With no causal chain yet, uncertainty is at maximum. Every Why answer that follows must reduce it measurably.

---

## Layer 2 — Causal Chain (5 Whys)

### Initial hypothesis space

`[EXP]` Before branching, estimate the problem space. B2B sales cycles are driven by: product-market fit, competitive landscape, pricing, sales execution, buyer economics, internal process. Branching factor b = 4 at the first level, with potential depth d = 5 — that is b^d = 4^5 = 1,024 possible paths. Without pruning, this investigation never converges. The pruning threshold (θ = 0.05) and Bayesian updating are what make it tractable.

`[BAYES]` **Setting priors from base rates — not from gut.**

Before seeing any evidence, assign priors based on published research on B2B sales cycle degradation (Gartner, Forrester benchmarks) and the company's own historical investigation data:

```
Branch A: Competitive pressure / product gap     P(A) = 0.30
Branch B: Sales execution / process breakdown     P(B) = 0.25
Branch C: Buyer economic conditions               P(C) = 0.20
Branch D: Pricing / packaging misalignment        P(D) = 0.15
Branch E: Internal tooling / enablement failure   P(E) = 0.10
```

---

### *** BIAS CALLOUT: Groupthink ***

`[BIAS]` **Before any evidence is examined, the leadership team has already aligned on a cause.** In the Q4 board meeting, the CEO stated: "The market is tightening — everyone's cycles are longer." The CRO agreed. The CFO agreed. The CPO agreed. No one cited evidence.

This is textbook **groupthink** — the surprising hypothesis (that the product itself is losing) was never raised because it threatens the collective narrative. The entropy of the leadership team's belief distribution has collapsed to near-zero *before investigation*, which means information gain from evidence is being blocked. `[INFO]`

**Defense applied:** An outside consultant is assigned the explicit adversarial investigator role. Their job is to pursue the hypothesis the room does not want to hear. The investigation proceeds on evidence, not consensus.

---

### Best-First Search: Follow Branch A first (P = 0.30)

`[SEARCH]` Best-First selects the highest-probability branch. Branch A: competitive pressure / product gap.

**Why (surface):** Deals are stalling in the evaluation stage.

**Why 1A:** Prospects are extending evaluation timelines to compare more vendors.

```
Evidence:
  PRE — CRM "competitor mentioned" field: competitor mentions up 85% QoQ
         (Tier 1 — system data, captured automatically by reps at deal creation)
  PRE — Win/loss analysis (conducted by third-party firm in Q4):
         loss reasons cite "feature gaps" in 41% of losses, up from 18%
         (Tier 2 — observational, interviews conducted before this investigation)
  POST — Rep interviews: 8 of 12 reps say "prospects keep asking about
          [Competitor X] capabilities we don't have"
          (Tier 4 — testimonial, reliability-discounted per temporal firewall)

Status: [x] Finding (Tier 1 + Tier 2 evidence)
```

`[BAYES]` **Update after evidence:**

```
P(A | evidence) = 0.30 → 0.48  ↑  (strong Tier 1/2 support)
P(B | evidence) = 0.25 → 0.20  ↓
P(C | evidence) = 0.20 → 0.15  ↓
P(D | evidence) = 0.15 → 0.12  ↓
P(E | evidence) = 0.10 → 0.05  ↓  (approaching pruning threshold)
```

Branch E is at θ = 0.05. One more piece of disconfirming evidence and it is pruned.

**Why 2A:** Prospects are comparing more vendors because a new competitor entered the market with a stronger product in two key feature areas.

```
Evidence:
  PRE — Competitor X launched v3.0 in mid-Q3 2025 with native integrations
        and an AI feature the company lacks (Tier 1 — public product release,
        timestamped, verifiable)
  PRE — G2 and Gartner peer review data shows Competitor X overtook the
        company in "ease of integration" and "analytics" categories in Q4
        (Tier 1 — instrumental/survey data, independently gathered)

Status: [x] Finding
```

`[CAUSAL]` **Counterfactual test:** "If Competitor X had not launched v3.0 with these features, would evaluation timelines still have doubled?" The win/loss data says 41% of losses cite feature gaps — so the competitor launch is a major factor, but not the sole cause. Other deals stall for non-competitive reasons. This branch explains a large portion but not 100%.

**Why 3A:** The company's product roadmap deprioritized the two feature areas where the competitor now leads.

```
Evidence:
  PRE — Product roadmap documents from Q1-Q2 2025 show integration work
        was deprioritized in favor of platform stability
        (Tier 1 — internal documents, timestamped)
  PRE — CPO's Q2 2025 planning memo: "We are betting on reliability over
        feature breadth this year"
        (Tier 1 — internal document)

Status: [x] Finding
```

**Why 4A:** The product team lacked market intelligence on competitor moves and did not weight competitive positioning in roadmap prioritization.

```
Evidence:
  PRE — No competitive intelligence brief was produced in 2025
        (Tier 1 — absence of document in documented process, verified by PM team)
  PRE — Roadmap prioritization framework weights: customer requests (40%),
        engineering cost (30%), strategic alignment (30%), competitive
        positioning (0%) — per the planning template used in Q1 2025
        (Tier 1 — process artifact)

Status: [x] Finding
```

**Why 5A — ROOT CAUSE A:** The product roadmap prioritization framework has no input for competitive positioning, and no process exists to feed competitive intelligence into product planning.

```
P(Root Cause A) = 0.48

Depth criteria check:
  [x] Actionability — "Add competitive intelligence input and weighting to
      the roadmap prioritization framework" is a concrete, implementable change.
  [x] Counterfactual Clarity — If competitive positioning had been weighted,
      the integration and analytics features would have been prioritized, and
      the product gap would not have opened.
  [x] System Boundary — The roadmap framework is entirely within the
      company's control.
  [x] Diminishing Returns — Going one Why deeper would ask "why wasn't
      competitive positioning included?" which leads to historical decisions
      that do not change the required action.

All four tests pass. Root Cause A is confirmed.
```

`[INFO]` Entropy drop at this node is significant. We have moved from "deals are stalling" (maximum uncertainty) to a specific, actionable process gap with Tier 1 evidence at every step.

---

### Value-Separation Principle

`[CAUSAL]` **Layer 2 has produced an uncomfortable truth:** The product is losing to competitors in key feature areas because the company's own prioritization framework failed to account for competitive dynamics.

This finding is evidence-based. It does not depend on whether leadership likes the answer. The CPO's strategic bet on reliability over feature breadth was rational *at the time* — but the competitive landscape shifted.

**Layer 2 identifies what IS true. Layer 3 is where the organization decides what to DO about it** — and that decision legitimately involves trade-offs, politics, and resource constraints. The investigation must not suppress the Layer 2 finding to protect the original strategic decision. Equally, Layer 3 may rationally decide to accept the competitive gap in one area while investing in another — but that is a resolution choice, not a causal finding.

---

### Continue search: Branch B (P = 0.20)

`[SEARCH]` Best-First continues to the next highest-probability branch.

**Why 1B:** Deals that do not involve competitive evaluation are also stalling — the cycle has lengthened even in uncontested deals.

```
Evidence:
  PRE — CRM data filtered to deals with no competitor mentioned:
        cycle length increased from 40 days to 65 days
        (Tier 1 — system data)

Status: [x] Finding
```

`[BAYES]` This is critical — it confirms Branch A does not explain the full problem. A second root cause exists.

```
P(A) = 0.48 (unchanged — still the primary cause)
P(B) = 0.20 → 0.28  ↑  (uncontested deals stalling suggests execution/process)
P(C) = 0.15 → 0.14
P(D) = 0.12 → 0.10
```

**Why 2B:** In uncontested deals, the stall occurs at legal/procurement review, not at evaluation.

```
Evidence:
  PRE — Deal stage duration data: "Legal Review" stage average went from
        5 days to 22 days in Q3-Q4 (Tier 1 — CRM timestamps)
  POST — Reps report that "legal is killing our deals" in pipeline reviews
         (Tier 4 — testimonial, discounted)

Status: [x] Finding (based on Tier 1 CRM data)
```

**Why 3B:** The company changed its contract terms in Q3 2025, adding new data processing clauses that trigger extended legal review on the buyer side.

```
Evidence:
  PRE — Legal team updated the standard contract template on 2025-07-15,
        adding 4 new data processing and liability clauses
        (Tier 1 — document version history)
  PRE — Timeline correlation: legal review stage inflation began 2 weeks
        after the new template went live (Tier 1 — CRM timestamps)

Status: [x] Finding
```

`[CAUSAL]` **Counterfactual test:** "If the contract template had not changed, would legal review times still have increased?" The temporal correlation is strong — a near-exact match between template change and stage inflation. But correlation is not causation. Check for confounders: did anything else change around 2025-07-15 that affects legal review? No other process changes found in that window. The causal link holds.

**Why 4B — ROOT CAUSE B:** New contract clauses were added without assessing the impact on buyer-side legal review timelines, and no process exists for Sales Ops to review contract changes for deal velocity impact before they go live.

```
P(Root Cause B) = 0.28

Depth criteria check:
  [x] Actionability — "Institute a deal-velocity impact review for all
      contract template changes before deployment" is concrete.
  [x] Counterfactual Clarity — If the clauses had been impact-assessed,
      they could have been phased, simplified, or accompanied by pre-approved
      buyer-side language to reduce review time.
  [x] System Boundary — Contract templates and change processes are within
      the company's control.
  [x] Diminishing Returns — Going deeper asks "why was there no impact
      review?" — the answer (no one thought of it) does not change the action.

All four tests pass. Root Cause B is confirmed.
```

---

### Pruning decisions

`[EXP]` `[BAYES]` After two confirmed root causes accounting for ~76% of the probability mass:

```
P(A) = 0.48 — product roadmap lacks competitive intelligence input (confirmed)
P(B) = 0.28 — contract changes lack deal-velocity impact review (confirmed)
P(C) = 0.14 — buyer economic conditions
P(D) = 0.10 — pricing/packaging misalignment
P(E) = 0.05 — internal tooling failure (at θ, pruning candidate)
```

**Branch E pruned.** P(E) = 0.05 = θ. Evidence: CRM adoption metrics show no change in tool usage patterns; pipeline data is complete and timely. Tooling is not a factor. `[SEARCH]`

```
PRUNED BRANCHES:
  Branch E (internal tooling) — P = 0.05 at pruning, evidence: CRM adoption
  metrics stable, no tooling complaints in pre-investigation support tickets.
```

**Branch D investigated briefly:**

```
Why 1D: Pricing is misaligned with market.
Evidence:
  PRE — Win/loss data: only 8% of losses cite price as the primary reason
        (Tier 2 — third-party win/loss study)
  PRE — Average discount rate has not changed significantly (12% → 14%)
        (Tier 1 — CRM data)

P(D) = 0.10 → 0.04 (below θ) — PRUNED.
```

```
PRUNED BRANCHES (updated):
  Branch E (internal tooling)    — P = 0.05 at pruning
  Branch D (pricing misalignment) — P = 0.04 at pruning, evidence: win/loss
    data shows price is primary factor in only 8% of losses
```

**Branch C remains open** at P = 0.14 but is not actionable — macroeconomic buyer conditions are outside the system boundary. This will be documented as an **Accept** in Layer 3, not a root cause to fix.

---

### Search strategy switch: BFS confirmation pass

`[SEARCH]` With two root causes confirmed via Best-First, switch to **BFS across remaining open branches** to ensure no path was overlooked. BFS at depth 1 across all surviving branches confirms no new high-probability cause was missed. Branch C (buyer economics) is the only remaining branch above θ, and it fails the System Boundary depth criterion.

---

### Feedback Loop Detection

`[GRAPH]` During the investigation, a reinforcing cycle emerged from the data:

```
[Deals stall at evaluation]
       │
       ▼
[Reps discount to accelerate close]
       │
       ▼
[Margin drops (avg discount: 12% → 22% on stalled deals)]
       │
       ▼
[Less revenue per deal → less investment in product]
       │
       ▼
[Product falls further behind competitors]
       │
       ▼
[More deals stall at evaluation]  ← CYCLE
```

```
Evidence:
  PRE — CRM discount data on deals with cycle >60 days: average discount
        22%, vs 12% on deals closing within 45 days (Tier 1 — CRM data)
  PRE — CFO's Q4 budget memo: product engineering headcount frozen due
        to margin compression (Tier 1 — internal document)
  PRE — Product roadmap Q1 2026: 3 features cut from plan citing budget
        (Tier 1 — planning document)
```

**This is a genuine feedback loop, not circular reasoning.** Each link has independent Tier 1 evidence. The DAG model cannot directly represent this cycle.

**Applying the Feedback Loop Protocol** (per math/01_graph_theory.md):

1. **Identify the loop.** Confirmed: the causal chain from "deals stall" cycles back to "deals stall" through discounting, margin compression, and product underinvestment.

2. **Break the cycle at the intervention point.** Two viable break points:
   - **Break at discounting:** Implement deal desk controls that prevent excessive discounting on stalled deals. This breaks the Stall → Discount link.
   - **Break at product investment:** Ring-fence product engineering budget so it is not subject to quarterly margin fluctuations. This breaks the Margin → Underinvestment link.

3. **Document the full loop.** The cycle is self-reinforcing. Fixing Root Cause A (competitive gap) addresses the upstream trigger, but the discounting behavior has become habitual and will persist even after the product improves — it must be addressed independently.

4. **Acknowledge the modeling choice.** Both break points are valid. The investigation recommends both — targeting the reinforcing dynamic (the feedback mechanism itself) rather than a single link.

`[CAUSAL]` **Critical:** The break point is a modeling assumption, not an empirical finding. A different investigator could break at "CFO budget allocation" and propose a different root cause. Both would be valid. The investigation documents the full cycle and evaluates each break point as a separate resolution candidate in Layer 3.

---

### Investigation-as-Confounder: Observed Effect

`[EVIDENCE]` `[CAUSAL]` Three weeks into the investigation, pipeline data shows a sudden improvement in deal stage progression — 15% more deals moving from Stage 3 to Stage 4 in the week after the investigation was announced.

**Is this real improvement or the observer effect?**

Applying the Temporal Firewall:

```
PRE evidence:   Stage progression rate was declining steadily for 6 months.
POST evidence:  Stage progression rate jumped 15% in the week after
                the investigation was announced.

Diagnosis: Reps are accelerating stage-changes in CRM to show progress
because they know leadership is watching pipeline velocity. The underlying
buyer behavior has not changed — the deals are being re-staged, not
actually progressing.

Verification: Compare CRM stage-change timestamps with actual buyer
actions (meeting scheduled, POC started, contract sent). Mismatch
confirms gaming.

Result: POST stage-progression data is unreliable (Tier 4 equivalent —
reps are managing the narrative). PRE data remains authoritative.
```

This is exactly the scenario the Temporal Firewall Protocol is designed for. The investigation's existence has contaminated the metric it is trying to measure.

---

### Convergence Check

`[GRAPH]` Root Cause A (no competitive intelligence in roadmap) and the feedback loop share a convergent node: **product underinvestment**. The roadmap gap created the competitive vulnerability; the discount-driven margin compression prevents closing it. This convergence elevates the importance of the product investment issue — two independent paths both point to it.

---

## Layer 3 — Resolution

**Value-separation reminder:** Layer 2 identified that the product is losing to a competitor and that the company's own processes (roadmap prioritization, contract changes, discount behavior) are the causes. These findings stand on Tier 1 evidence. Layer 3 is where the organization decides how to respond — and resource constraints, strategic priorities, and organizational politics legitimately enter.

---

### ROOT CAUSE A: Product roadmap prioritization framework lacks competitive intelligence input

```
Type: [x] Fix  [ ] Mitigate  [ ] Accept

Counterfactual test on fix: "If competitive positioning had been a weighted
input to roadmap prioritization, and competitive intelligence briefs were
produced quarterly, would the product gap have opened?"
→ No. The integration and analytics features would have been prioritized
   alongside or instead of some stability work. Fix is correctly targeted.

Must Change:
  1. Add "competitive positioning" as a weighted factor (minimum 15%) in the
     roadmap prioritization framework.
  2. Institute quarterly competitive intelligence briefs produced by Product
     Marketing, reviewed by Product and Sales leadership.
  3. Create a fast-track process for roadmap reprioritization when a
     competitor ships a significant feature.

Owner: CPO + VP Product Marketing
By When: Framework change by 2026-02-15. First competitive brief by 2026-03-01.
         Feature gap closure (integrations + analytics) estimated Q3 2026.
```

Priority: Impact = 5, Recurrence = 5, Actionability = 4 → Score = 100. Act first.

---

### ROOT CAUSE B: Contract template changes lack deal-velocity impact assessment

```
Type: [x] Fix  [ ] Mitigate  [ ] Accept

Counterfactual test on fix: "If a deal-velocity impact review had been
conducted before the contract template change, would legal review times
still have doubled?"
→ No. The clauses could have been simplified, phased, or accompanied by
   pre-negotiated buyer-side language. Fix is correctly targeted.

Must Change:
  1. Institute mandatory deal-velocity impact review for all contract
     template changes, conducted by Sales Ops before legal deploys changes.
  2. Revise the current clauses: work with external counsel to produce
     a simplified version that satisfies compliance requirements without
     triggering extended buyer-side legal review.
  3. Create a "pre-approved language" library that buyers' legal teams
     can adopt without custom negotiation.

Owner: General Counsel + VP Sales Ops
By When: Impact review process by 2026-02-01. Clause revision by 2026-03-01.
```

Priority: Impact = 4, Recurrence = 4, Actionability = 5 → Score = 80. Quick win — implement fast.

---

### FEEDBACK LOOP BREAK: Discount spiral

```
Type: [ ] Fix  [x] Mitigate  [ ] Accept

This is a mitigation, not a fix, because the underlying trigger (product
gap) is addressed by Root Cause A. The discounting behavior is a secondary
effect that has become habitual.

Must Change:
  1. Implement deal desk approval for any discount >15% on deals with
     cycle >60 days. Removes individual rep discretion on deep discounting.
  2. Ring-fence product engineering budget: minimum 80% of planned
     engineering headcount is protected from quarterly margin fluctuations.
     CFO and CEO sign off on this as a board-level commitment.
  3. Track discount rate as a leading indicator alongside cycle length —
     if discount rate rises while cycle length stays flat, the loop is
     re-engaging.

Owner: CRO (deal desk) + CFO (budget ring-fence)
By When: Deal desk policy by 2026-02-01. Budget ring-fence in Q2 2026 plan.
```

---

### BRANCH C: Buyer economic conditions

```
Type: [ ] Fix  [ ] Mitigate  [x] Accept

Macroeconomic conditions are outside the system boundary. Buyer budget
cycles have lengthened industry-wide. This is a constraint, not a root cause.

The company's response to this constraint (Roots A and B) is within the
boundary. The constraint itself is consciously accepted and documented.
```

---

### Root Cause Interactions

```
[x] Amplification — Root Cause A (product gap) amplifies the feedback loop
    (discount spiral). Fixing A reduces the trigger; breaking the loop
    reduces the secondary damage.

[ ] AND-causation — Root Causes A and B are independently sufficient to
    lengthen the sales cycle. Fixing only A still leaves B adding ~20 days.
    Fixing only B still leaves A adding ~25 days.

[x] OR-causation (overdetermination) — Each root cause independently
    increases cycle length. Both must be resolved. Fixing only one
    leaves the system vulnerable to the other.
```

---

### Priority Order

```
1. Root Cause B (contract template)    — Score 80, fastest to implement,
   immediate impact on uncontested deals
2. Feedback loop break (deal desk)     — Score n/a (mitigation), prevents
   further margin erosion while Root Cause A is addressed
3. Root Cause A (roadmap framework)    — Score 100, highest impact but
   longest time to remediate (feature development takes quarters)
```

Note: Root Cause A has the highest priority score but is sequenced third because the fix timeline is longest. Root Cause B and the feedback loop break are implemented in parallel to stop the bleeding while the product gap is closed. The priority formula is a ranking heuristic — sequencing considers implementation timelines.

---

## Layer 4 — Verification and Learning

### Verification Windows

```
Root Cause A (roadmap framework):
  Type: Process/organizational fix
  Window: 1 full quarter after competitive intelligence process is active
          AND 1 full quarter after feature gap is closed
  Metric: Win rate in competitive deals returns to >50%
          (currently 38%, historical baseline 55%)
  Expected verification date: Q4 2026

Root Cause B (contract template):
  Type: Process fix
  Window: 60 days after revised contract template goes live
  Metric: Legal review stage duration returns to <8 days
          (currently 22 days, historical baseline 5 days)
  Expected verification date: 2026-05-01

Feedback loop break (discount controls):
  Type: Continuous monitoring
  Window: 1 full quarter after deal desk policy is active
  Metric: Average discount rate on deals >60 days drops below 16%
          (currently 22%, target <16%)
  Expected verification date: Q3 2026
```

### Verification Checklist

```
□ Has sales cycle length returned to <55 days? (allowing for macro headwinds)
□ Does CRM data confirm legal review stage duration has normalized?
□ Has win rate in competitive deals improved?
□ Has discount rate on long-cycle deals decreased?
□ Has the counterfactual test been run against actual outcomes?
□ Did the investigation-as-confounder effect (rep behavior change) wash out
  after 30 days, or did it persist? If persistent, the CRM stage data
  needs recalibration.
```

### Learning — Prior Updates

```
□ Were the base rates used at the start accurate?
  → Competitive pressure prior (0.30) was close to actual (0.48).
    Update: for future sales investigations, start competitive
    pressure prior at 0.40.
  → Contract/legal process prior was not in the original hypothesis
    set — it emerged under Branch B (execution/process). Update:
    for future investigations, separate "sales execution" from
    "internal process changes" as distinct branches.

□ Which branches were followed and later pruned?
  → Branch E (tooling) pruned at θ. Correct — no tooling issue.
  → Branch D (pricing) pruned at 0.04. Correct — pricing was not
    the primary driver.
  → Update: pricing is rarely the primary cause of cycle-length
    increases in B2B — it affects win rate, not velocity. Record
    this as a domain insight.

□ What was the first hypothesis — and was it correct?
  → Leadership's initial hypothesis was "market conditions"
    (Branch C). This was the groupthink-driven answer. It was
    partially true (macro conditions are real) but not the root
    cause — it was a constraint, not something the company could
    change. The actual root causes were internal process failures.
  → ANCHORING CHECK: the investigation almost stopped at
    "market conditions" because leadership had pre-committed.
    The adversarial investigator role was essential to pursuing
    the uncomfortable truth.

□ Were there any surprises?
  → SURPRISE: The contract template change was invisible to Sales
    leadership. Legal made the change unilaterally as a compliance
    measure, and no one connected it to deal velocity until the
    investigation surfaced it.
  → This is the highest-value finding. Cross-functional process
    changes with no impact review are a systemic risk.
  → Document: any future process change that touches the deal
    lifecycle must include a deal-velocity impact assessment.

□ Investigation-as-confounder retrospective:
  → The temporal firewall caught the stage-progression gaming
    within 3 weeks. Without it, the investigation would have
    incorrectly concluded that deals were already improving.
  → Update: for any investigation involving sales teams, activate
    the temporal firewall by default.
```

### Final State

```
Root Cause A: Product roadmap lacks competitive intelligence input
  → Fix: Competitive positioning added to prioritization framework
  → Status: In progress (framework change complete, feature work in planning)

Root Cause B: Contract changes lack deal-velocity impact review
  → Fix: Impact review process instituted; clause revision underway
  → Status: In progress (process live, clause revision in legal review)

Feedback loop: Discount spiral
  → Mitigate: Deal desk controls + budget ring-fence
  → Status: Deal desk policy live; budget ring-fence in Q2 plan

Branch C: Macro conditions
  → Accept: Documented as external constraint

Investigation closed: No — verification windows open until Q4 2026.
```

---

<p align="center"><strong>← Previous</strong> <strong><a href="03_security_breach.md">03 — Security Breach</a></strong> · <strong>Next →</strong> <strong><a href="05_legal_investigation.md">05 — Legal Investigation</a></strong></p>
