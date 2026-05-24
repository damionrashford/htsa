<h1 align="center">Personal Decision — Investigating Burnout Before Quitting</h1>

> A software engineer uses HTSA to investigate their own situation before making a major life decision.

---

## Context

A mid-career software engineer — call them R — has been feeling burned out and disengaged for roughly six months. The impulse is to quit. But "I should quit" is a conclusion, not an investigation. R decides to run the framework on themselves before making an irreversible decision.

**[BIAS] Anchoring defense — applied immediately.** The framework rule: *do not name a leading hypothesis before the 5 Ws are complete.* R's gut says "quit the job." That gut feeling is noted and set aside. It is not allowed to become the frame through which evidence is filtered. The investigation will determine whether the job, the role, the industry, or something personal is the root cause. "Quit" is one possible resolution — not the starting assumption.

---

```
INVESTIGATION: Burnout and Disengagement — Root Cause Investigation
DATE: 2026-03-15
INVESTIGATOR: R (self-investigation)
MODE: [x] Full  [ ] Rapid
PRUNING THRESHOLD (θ): 0.10 (exploratory — low-stakes relative to safety-critical)
```

---

## Layer 1 — Situation Map (5 Ws)

**[GRAPH] Establishing the origin node. Every node that follows must be reachable from this starting point.**

### Who (Multiple Actors)

| Role | Actor | Notes |
|---|---|---|
| **Affected** | R | Experiencing burnout and disengagement |
| **Originator** | Unknown — this is what the investigation determines | Could be R, manager, company, or external |
| **Trigger** | Unknown — surface Why is entry point | |
| **Detector** | R | Self-reported; partner also noted behavioral changes |
| **Resolver** | R | Personal domain — R owns the resolution |
| **Stakeholders** | Manager, team, partner, family | Decisions here affect all of them |

**[BIAS] Attribution bias warning:** R is both the investigator and the subject. The temptation is to externalize ("the job is the problem") or internalize ("I'm the problem") based on temperament, not evidence. Map all actors. The root cause may sit with any of them — or between them.

### What

Persistent burnout, loss of motivation, disengagement from work. Manifests as: dreading Monday mornings, declining quality of output, social withdrawal from the team, irritability outside work, and recurring thoughts of quitting.

### When

- **Before (12+ months ago):** Generally engaged, positive performance reviews, occasional stress but recoverable.
- **Transition (6–8 months ago):** Gradual onset. No single triggering event identified — this is important. Gradual onset suggests systemic cause, not incident-driven.
- **During (past 6 months):** Escalating. Sleep disruption started ~4 months ago. Last performance review (2 months ago) was noticeably weaker.
- **After (now):** At a decision point. Considering quitting.

### Where

- Primary context: workplace (remote, home office)
- Secondary context: personal life (same physical environment due to remote work — boundary collapse is a candidate)
- Tertiary: industry (tech layoffs, shifting market, AI disruption anxiety)

### Why (Surface)

"I'm burned out and want to quit my job."

> This is the entry point into Layer 2. It is not a root cause. It is a feeling attached to a proposed action.

---

## Evidence Tier Mapping for Personal Investigation

Before entering Layer 2, R establishes what counts as evidence in a self-investigation.

**[EVIDENCE] Tier mapping — personal domain:**

| Tier | Type | Personal Equivalent | Example |
|---|---|---|---|
| **Tier 1** | Physical / Instrumental | Calendar data, health tracking, git commit history, sleep tracker, screen time logs | Fitbit shows average sleep dropped from 7.2h to 5.8h over 4 months |
| **Tier 2** | Observational | Journal entries written at the time, partner's contemporaneous observations | Journal entry from Oct 15: "Dreaded the standup today. Couldn't focus after." |
| **Tier 3** | Inferential | Patterns derived from Tier 1/2 data, correlation analysis | Sleep decline correlates with project reassignment timeline |
| **Tier 4** | Testimonial / Reconstructive | Current feelings, recalled memories, narrative about what happened | "I think this started when the reorg happened" (reconstructed, not recorded) |

**The critical distinction:** R's current feeling of "I should quit" is Tier 4 — reconstructive memory filtered through present emotional state. It is a hypothesis, not a finding. The investigation requires Tier 1 and Tier 2 evidence before closing any node.

---

## Layer 2 — Causal Chain (5 Whys)

**[EXP] Problem space estimation.** Before starting, estimate the branching factor to understand the scope of investigation.

R identifies four broad candidate branches for the surface Why ("I'm burned out"):

1. The job itself (tasks, workload, environment)
2. The role (career fit, growth trajectory)
3. The industry (market conditions, existential concerns)
4. Something personal (health, relationships, life stage)

With branching factor b=4 and potential depth d=5, the unconstrained search space is 4^5 = 1024 nodes. Pruning at θ = 0.10 is essential.

**[SEARCH] Strategy: DFS first.** R follows the strongest signal — the feeling that the job itself is the problem. This is the highest-probability branch based on available Tier 4 evidence. DFS will go deep on this branch first.

---

### DFS — Branch A: The Job

```
Why (surface): "I'm burned out and want to quit"
  │
  └──► Branch A: "The job is draining me"                    P = 0.45
         Evidence: Current feeling (Tier 4), partner observation
                   "You complain about work every night" (Tier 2,
                   contemporaneous)
         Status: [x] Hypothesis (Tier 4 dominant)
```

**Why A1:** "Why is the job draining?"

```
         └──► A1: "My project changed 6 months ago"          P = 0.40
                Evidence: Calendar data shows reassignment
                          to Platform Migration project
                          on 2025-09-20 (Tier 1)
                Status: [x] Finding
```

**[INFO] High information gain.** The timeline of project reassignment (Tier 1: calendar) aligns precisely with the onset of burnout symptoms. This is a strong temporal correlation. But correlation is not causation — investigate further.

**Why A2:** "Why does the new project cause burnout?"

```
              └──► A2: "The work is ambiguous, the goals shift     P = 0.35
                        weekly, and I have no autonomy"
                   Evidence:
                     - Jira ticket history: 14 scope changes in
                       6 months (Tier 1, instrumental)
                     - Journal, Nov 3: "Third rewrite of the
                       migration plan. Nobody knows what we're
                       building." (Tier 2, contemporaneous)
                     - 1:1 notes with manager show R raised
                       concern twice (Tier 2)
                   Status: [x] Finding
```

**Why A3:** "Why is the project so ambiguous?"

```
                   └──► A3: "Leadership hasn't committed to a       P = 0.30
                             technical direction. The team is
                             building throwaway work."
                        Evidence:
                          - Slack messages from VP engineering
                            contradicting previous direction,
                            3 instances (Tier 1, timestamped)
                          - Team retro notes cite "unclear
                            direction" in 4 of 6 sprints (Tier 2)
                        Status: [x] Finding
```

**[SEARCH] DFS pause.** At this depth, the branch is pointing toward organizational dysfunction beyond R's control. Before going deeper, check the depth criteria on the current candidate.

**Depth Criteria Check — "Leadership hasn't committed to a technical direction":**

| Test | Result |
|---|---|
| **Actionability** | Can R change leadership's technical direction? No — not in R's scope of authority. |
| **Counterfactual Clarity** | If leadership had committed to a direction, would R still be burned out? Unclear — other factors may contribute. |
| **System Boundary** | This cause is outside R's system boundary. R cannot fix organizational leadership. |
| **Diminishing Returns** | Going deeper (Why is leadership uncommitted?) would not change R's available actions. |

**Result: 3 of 4 pass (Counterfactual fails).** The counterfactual is unclear because we haven't investigated whether other branches contribute. This cannot be the sole root cause yet.

**[SEARCH] Strategy switch: DFS → BFS.** The job branch is deeper and more complex than expected — it points to organizational dynamics R cannot control. Rather than continuing to drill into leadership dysfunction, R switches to BFS to check the other candidate branches at level 1. This prevents tunnel vision on a single cause.

**[BIAS] Confirmation bias callout.** R wants to quit. The job branch is producing evidence that supports quitting. This is exactly when confirmation bias is most dangerous — the evidence feels satisfying because it confirms the desired conclusion. Defense: actively investigate the other branches with equal rigor. Seek evidence that the job is *not* the primary cause.

---

### BFS — Branch B: The Role

```
  └──► Branch B: "The role no longer fits me"                P = 0.25
         Evidence: R's current feeling of career stagnation
                   (Tier 4)
         Status: [x] Hypothesis
```

**Why B1:** "Why doesn't the role fit?"

```
         └──► B1: "I haven't learned anything new in 2 years" P = 0.20
                Evidence:
                  - Git history: R's commits are maintenance
                    and bug fixes, no new architecture work
                    in 18 months (Tier 1)
                  - Training budget: $0 used of $2,000
                    allocation in 2025 (Tier 1)
                  - Journal, Dec 8: "I used to build things.
                    Now I fix things other people broke."
                    (Tier 2)
                Status: [x] Finding
```

**[BAYES] Update.** The Tier 1 git history evidence is strong. R's actual work product has shifted from creative to maintenance. This is not just a feeling — the data confirms it. Update probabilities:

```
Branch A (the job):        P = 0.35 (down from 0.45 — still strong,
                                     but not sole cause)
Branch B (the role):       P = 0.30 (up from 0.25 — Tier 1 evidence
                                     supports it)
Branch C (the industry):   P = 0.15 (unchanged)
Branch D (personal):       P = 0.20 (unchanged)
```

**Depth Criteria Check — "No growth or learning opportunities in current role":**

| Test | Result |
|---|---|
| **Actionability** | Can R change this? Partially — R could request a transfer, propose new projects, or pursue learning independently. |
| **Counterfactual Clarity** | If R had been building new systems and learning, would the burnout still exist? Likely reduced but possibly not eliminated (other factors). |
| **System Boundary** | Partially inside R's boundary. R has not advocated strongly for role change. |
| **Diminishing Returns** | Going deeper would ask "Why hasn't R pursued growth?" — that changes the action. Go deeper. |

**Result: 3 of 4 pass (Diminishing Returns fails).** Go one level deeper.

**Why B2:** "Why hasn't R pursued growth or role change?"

```
              └──► B2: "Low energy, no initiative —             P = 0.25
                        because of the burnout itself"
                   Evidence:
                     - R has not updated resume, applied
                       internally, or used training budget
                       despite knowing about all three
                       (self-report, Tier 4 — but corroborated
                       by Tier 1 training spend = $0)
                   Status: [x] Finding (Tier 1 corroboration)
```

**[GRAPH] Feedback loop detected.** This node points back toward the surface problem. Burnout causes disengagement, which causes stagnation, which deepens burnout. This is a cycle, not a chain. Flag for the feedback loop protocol.

---

### BFS — Branch C: The Industry

```
  └──► Branch C: "Tech industry anxiety"                     P = 0.15
         Evidence: R reports feeling anxious about AI
                   replacing developers (Tier 4)
         Status: [x] Hypothesis
```

**Why C1:** "What evidence supports industry-level threat?"

```
         └──► C1: "Layoffs at peer companies, AI tooling      P = 0.10
                   changing the landscape"
                Evidence:
                  - R's company has NOT had layoffs (Tier 1,
                    HR communications)
                  - R's team is fully staffed and hiring
                    (Tier 1, headcount data)
                  - R uses AI tools daily and reports
                    increased productivity (self-report
                    corroborated by git velocity, Tier 1)
                Status: [x] Finding — AGAINST this branch
```

**[BAYES] Strong disconfirming evidence.** The industry anxiety is real as a feeling (Tier 4) but contradicted by R's actual situation (Tier 1). R's company is stable, R's team is growing, and R's productivity with AI tools is measurably higher. The anxiety is a symptom, not a cause.

```
Branch C:  P = 0.05 (down from 0.15 — below θ = 0.10)
```

**[EXP] Branch C pruned.** P = 0.05 < θ = 0.10. Evidence: R's employment is stable, team is hiring, AI tools are increasing R's productivity. Industry anxiety is a mood amplifier, not a root cause.

**Redistribute pruned probability:**

```
Branch A (the job):        P = 0.38
Branch B (the role):       P = 0.35
Branch D (personal):       P = 0.22
Pruned: Branch C           P = 0.05
```

---

### BFS — Branch D: Personal Factors

```
  └──► Branch D: "Something personal / health"               P = 0.22
         Evidence: Partner noted R is "not yourself" even
                   on weekends (Tier 2, contemporaneous)
         Status: [x] Hypothesis — needs Tier 1 evidence
```

**Why D1:** "Is there a health or personal factor independent of work?"

```
         └──► D1: "Sleep deprivation and no exercise for       P = 0.22
                   6 months"
                Evidence:
                  - Fitbit data: avg sleep dropped from
                    7.2h → 5.8h over past 4 months (Tier 1)
                  - Gym check-in app: 0 visits in past
                    5 months, was 3x/week before (Tier 1)
                  - Annual physical: Vitamin D deficient,
                    weight up 15 lbs (Tier 1, lab results)
                Status: [x] Finding
```

**[INFO] High information gain.** Three independent Tier 1 data sources converge on the same finding: R's physical health has deteriorated significantly. This is not reconstructive memory — it is measured data.

**[BAYES] Major update.** Physical health decline is confirmed by Tier 1 evidence and plausibly explains cognitive and emotional symptoms independent of the job.

```
Branch A (the job):        P = 0.30
Branch B (the role):       P = 0.28
Branch D (personal):       P = 0.37 (up — strongest Tier 1 evidence cluster)
Pruned: Branch C           P = 0.05
```

**[BIAS] Confirmation bias — second callout.** R wants to quit. R does NOT want the answer to be "you stopped exercising and sleeping." That discomfort is itself a signal. The investigation follows evidence, not preference. Three Tier 1 data points outweigh Tier 4 feelings about the job.

**Why D2:** "Why did R stop exercising and sleeping?"

```
              └──► D2: "Started working longer hours after       P = 0.30
                        the project reassignment. Gym time
                        was replaced by evening work sessions.
                        Blue light and stress disrupted sleep."
                   Evidence:
                     - Screen time logs: avg daily screen
                       time up from 9h to 13h (Tier 1)
                     - Calendar: evening meetings added
                       starting Oct 2025 (Tier 1)
                     - Gym check-in ceased same month as
                       evening meetings began (Tier 1)
                   Status: [x] Finding
```

**[GRAPH] Convergence detected.** Branch D (personal health) and Branch A (the job/project) converge at the same event: the project reassignment in September 2025. The reassignment caused longer hours, which eliminated exercise, which degraded sleep, which produced burnout symptoms. Two independent investigation paths point to the same originating event.

**[CAUSAL] Causal chain clarified:**

```
Project reassignment (Sept 2025)
  → Ambiguous scope, shifting goals
  → Longer hours to compensate for rework
  → Evening meetings replace gym time
  → No exercise → weight gain, vitamin D deficiency
  → Blue light + stress → sleep deprivation
  → Cognitive decline → worse performance
  → Negative feedback → more stress → deeper burnout
```

---

## Feedback Loop Identification and Protocol

**[GRAPH] Cycle detected.** The causal chain forms a reinforcing loop:

```
┌──► Burnout ──► Disengagement ──► Poor performance ──┐
│                                                       │
│         Negative feedback ◄── Reduced output ◄────────┘
│              │
└──────────────┘
```

**Feedback loop protocol (from math/01_graph_theory.md):**

1. **Identify the loop.** Done — mapped above.
2. **Break the cycle at the intervention point.** Where can R intervene?
   - **Break point 1:** Sleep and exercise (physical inputs) — R controls these directly.
   - **Break point 2:** Working hours (reduce evening sessions) — R can negotiate this.
   - **Break point 3:** Project assignment (request transfer) — R can request, not guarantee.
3. **Document the full loop.** The root cause is not a single node — it is the reinforcing dynamic. But the investigation must select intervention points.
4. **Accept the limitation.** The break points are modeling choices. R selects the break points with highest actionability.

**Break point selected: Sleep + exercise recovery (Break point 1) AND working hours reduction (Break point 2).** These are inside R's system boundary and directly interrupt the reinforcing cycle.

---

## Root Cause Synthesis

The investigation reveals not one root cause but an interacting system. Two primary root causes and one amplifier:

**ROOT CAUSE A: Project reassignment to an ambiguously scoped, leadership-directionless project**

This is the originating event. It created the conditions for longer hours, rework, and loss of meaningful work.

**Depth Criteria Check:**

| Test | Result | Pass? |
|---|---|---|
| Actionability | R can request reassignment or project scope clarification | Yes |
| Counterfactual Clarity | If R had stayed on the previous project, the burnout cascade would not have started — supported by timeline data | Yes |
| System Boundary | The reassignment was a management decision; requesting reversal is inside R's boundary; guaranteeing it is not | Partial — see resolution |
| Diminishing Returns | Going deeper (why did leadership reassign R?) would not change R's available actions | Yes |

**ROOT CAUSE B: Collapse of health-sustaining routines (sleep, exercise) with no recovery mechanism**

Once the routines collapsed, the burnout became self-reinforcing. Even if the project improved, the health debt would sustain the symptoms.

**Depth Criteria Check:**

| Test | Result | Pass? |
|---|---|---|
| Actionability | R directly controls sleep hygiene and exercise schedule | Yes |
| Counterfactual Clarity | If R had maintained exercise and sleep despite the project change, burnout severity would be significantly lower — supported by health research base rates | Yes |
| System Boundary | Entirely inside R's boundary | Yes |
| Diminishing Returns | Going deeper (why didn't R maintain routines?) leads back to the feedback loop, not to new action | Yes |

**ROOT CAUSE INTERACTION: Amplification.** Root Cause A created the conditions. Root Cause B amplified the impact into a self-sustaining cycle. Fixing either alone would help; fixing both breaks the cycle at two points.

**[CAUSAL] Confounder check.** Is there a hidden variable causing both the project reassignment and the health decline independently? Possible candidate: a pre-existing depressive episode. Evidence check: R's health data shows normal sleep and exercise up until the reassignment month. No evidence of prior mood disorder in medical records (Tier 1). The timeline supports A causing B, not a hidden C causing both.

---

## Pruned Branches (Preserved for Recovery)

| Branch | Reason Pruned | P at Pruning | Evidence |
|---|---|---|---|
| C: Industry anxiety | R's company stable, team hiring, AI tools increasing R's productivity. Three Tier 1 disconfirmations. | 0.05 | HR communications, headcount data, git velocity |
| A3 (deep): Leadership dysfunction as root | Outside R's system boundary; going deeper does not change available actions | N/A — folded into Root Cause A at higher level | Jira scope changes, Slack contradictions |
| "I should quit" (initial impulse) | Not investigated as a root cause — it is a proposed resolution, tested in Layer 3 | N/A | Anchoring defense applied at investigation start |

---

## Layer 3 — Resolution

**[CAUSAL] Value-separation principle.** Layers 1–2 identified what is true: the project change triggered a health collapse that became self-reinforcing. Layer 3 is where R decides what to do — and that involves values, trade-offs, and personal priorities.

### ROOT CAUSE A: Ambiguous project with no leadership direction

**Resolution type: Mitigate (with Fix escalation path)**

| Field | Value |
|---|---|
| What must change | R's assignment to the current project, OR the project's scope and direction |
| Counterfactual test | "If R had not been reassigned, would the burnout have occurred?" → No (timeline evidence) |
| Action | Step 1: Request 1:1 with manager. Present the Tier 1 evidence (scope changes, rework). Request reassignment or clear scope commitment. Step 2: If denied, escalate to skip-level. Step 3: If no change in 30 days, begin external job search. |
| Type | **Mitigate** — R cannot fix leadership dysfunction. R can change R's position relative to it. |
| Owner | R |
| By when | 1:1 within 1 week. Decision point at 30 days. |

**Why "Mitigate" and not "Fix":** R cannot fix organizational leadership. R can remove themselves from the dysfunctional project. This does not eliminate the root cause — it eliminates R's exposure to it. The distinction matters: if R transfers to another project under the same leadership, the problem may recur.

**Why not "Quit" immediately:** The investigation shows the job is a contributing cause, not the sole cause. Quitting without addressing Root Cause B means R carries the health debt and feedback loop into the next position. The impulse to quit was Tier 4 evidence; the investigation produced a more targeted action.

### ROOT CAUSE B: Collapsed health routines

**Resolution type: Fix**

| Field | Value |
|---|---|
| What must change | Sleep schedule and exercise routine must be restored |
| Counterfactual test | "If R had maintained 7+ hours of sleep and 3x/week exercise, would the burnout severity be the same?" → No (health data, research base rates) |
| Action | Week 1: No screens after 9pm. Set sleep alarm. Walk 30 min daily. Week 2–4: Resume gym 3x/week. Track with existing Fitbit. Week 4+: Review Fitbit data for improvement. |
| Type | **Fix** — directly eliminates the root cause |
| Owner | R |
| By when | Start immediately. Measurable within 30 days. |

### FEEDBACK LOOP BREAK: Working hours boundary

**Resolution type: Fix**

| Field | Value |
|---|---|
| What must change | Evening work sessions must end |
| Counterfactual test | "If R had hard-stopped work at 6pm, would the gym time and sleep have been preserved?" → Yes (calendar data shows evening meetings are the direct cause of schedule collapse) |
| Action | Decline all meetings after 5:30pm. Set Slack status to offline at 6pm. Communicate boundary to manager in the same 1:1 as Root Cause A discussion. |
| Type | **Fix** — directly breaks the feedback loop at the hours node |
| Owner | R |
| By when | Immediate. |

### Root Cause Interaction

**[x] Amplification** — A created the conditions; B amplified the damage into a self-sustaining cycle. Both must be addressed. Fixing B alone (health recovery) while remaining on the dysfunctional project would create a fragile equilibrium — the project pressure would erode the routines again. Fixing A alone (project change) without health recovery would leave R operating from a depleted baseline.

### Priority Order

```
Priority = Impact x Recurrence x Actionability (scale 1–5)

Root Cause B (health routines):    5 x 5 x 5 = 125  → Act first
  (Highest actionability, immediate impact, recurs daily)

Feedback loop (working hours):     4 x 5 x 5 = 100  → Act first (same day)
  (Directly enables Root Cause B fix)

Root Cause A (project assignment):  5 x 3 x 3 = 45   → Plan and schedule
  (High impact, requires negotiation, lower certainty of outcome)
```

### Resolution Sequencing

1. **Today:** Hard stop on evening work. Restore sleep hygiene.
2. **This week:** Resume exercise. Schedule manager 1:1.
3. **Within 30 days:** Assess project situation. Decide on transfer, scope change, or external search.
4. **Do NOT quit yet.** Re-evaluate the "quit" option after 60 days of data with Root Causes A and B addressed. If burnout persists after both are resolved, the investigation was incomplete — return to Layer 2.

### The "Accept" Component

**Industry anxiety (pruned Branch C):** Accept. The tech industry is changing. This is outside R's system boundary. The appropriate response is not to fix the industry but to consciously accept the uncertainty and stop treating ambient anxiety as actionable signal. R's actual employment situation (Tier 1 data) does not support the anxiety (Tier 4 feeling).

---

## Layer 4 — Verification and Learning

### Verification Windows

| Root Cause | Verification Method | Window | Metric |
|---|---|---|---|
| B: Health routines | Fitbit sleep data, gym check-ins | 30 days (continuous problem → measurement interval) | Sleep avg > 7h, gym visits >= 12/month |
| Feedback loop: Hours | Screen time logs, calendar audit | 14 days (event-driven — next week's meetings are the trigger) | No meetings after 5:30pm, screen time < 10h/day |
| A: Project assignment | 1:1 outcome, scope stability | 1 quarter (process/organizational fix) | Scope changes < 2 per quarter, or successful reassignment |
| Overall: Burnout | Self-assessment + partner check-in + performance review | 90 days | Subjective engagement, review quality, partner observation |

### Verification Checklist

```
□ Has burnout intensity decreased after 30 days of health recovery?
  → If yes: Root Cause B confirmed.
  → If no: Return to Layer 2. Investigate deeper personal factors
           (depression screening with clinician — Tier 1 instrumental).

□ Has the project situation changed after the manager conversation?
  → If yes: Root Cause A confirmed (or at least mitigated).
  → If no: Escalate per the resolution plan.

□ Does monitoring confirm the feedback loop is broken?
  → Track: Are working hours staying within boundary?
  → Track: Is exercise being maintained under project pressure?
  → If the loop re-engages: the hours boundary is the weak link.
    Strengthen it or address Root Cause A more aggressively.

□ After 60 days with both root causes addressed, does "quit" still
  feel like the right answer?
  → If yes: The investigation may have missed something. Consider
    professional coaching or therapy (new investigation, Layer 1).
  → If no: The impulse to quit was a symptom of the burnout cycle,
    not an independent conclusion. Documented as a learning.
```

### Prior Updates for Future Investigations

```
□ Were the initial priors accurate?
  → Initial: Job = 0.45, Role = 0.25, Industry = 0.15, Personal = 0.20
  → Final:   Job = 0.30, Role = 0.28, Industry = 0.05, Personal = 0.37
  → Learning: R overweighted the job (Tier 4 feelings) and underweighted
    personal health (required Tier 1 data to surface). In future personal
    investigations, check health data FIRST — before entertaining
    external explanations.

□ Which branches were followed and later pruned?
  → Industry anxiety: pruned. Update prior for "industry fear as root
    cause of personal burnout" from 0.15 to 0.05 in future.

□ What was the first hypothesis — and was it correct?
  → First hypothesis: "I should quit my job."
  → Actual finding: The job is a contributing cause, but the self-reinforcing
    health collapse is the primary driver. Quitting without addressing health
    would have carried the problem to the next job.
  → [BIAS] This is a textbook case of anchoring. The initial impulse
    (quit) would have led to a resolution that does not address the
    largest root cause.

□ Surprises worth documenting?
  → The strongest evidence (Tier 1 health data) pointed to the cause R
    least wanted to investigate. The emotional intensity of "I hate my
    job" (Tier 4) was louder than "I stopped sleeping and exercising"
    (Tier 1). In personal investigations, emotional volume and causal
    weight are inversely correlated. The thing that feels most urgent
    is often the symptom, not the cause.
```

---

## Investigation Summary

**[INFO] Entropy reduction.** The investigation began with four equiprobable branches and high uncertainty. It ends with a clear causal model supported by Tier 1 evidence:

```
Project reassignment (ROOT CAUSE A)
  → Longer hours → Health collapse (ROOT CAUSE B)
    → Burnout → Disengagement → Poor performance
      → Negative feedback → More burnout (FEEDBACK LOOP)
        → "I should quit" (SYMPTOM, not root cause)
```

**Resolution:** Fix health routines and working hours boundary immediately. Mitigate project assignment through negotiation. Re-evaluate the "quit" option with 60 days of data. The investigation prevented a Tier 4 feeling from driving a major life decision without Tier 1 evidence.

---

<p align="center"><strong>← Previous</strong> <strong><a href="05_legal_investigation.md">05 — Legal Investigation</a></strong> · <strong><a href="00_index.md">Back to Index</a></strong></p>
