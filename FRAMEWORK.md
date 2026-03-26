# SOMETHING HAPPENED → TO SOMEONE → SOMEWHERE → AT SOME POINT → FOR SOME REASON

> How to Solve Anything (HTSA) — A universal investigation framework combining the 5 Ws and 5 Whys.
> Applicable to any problem, in any discipline, at any scale.

---

## The Core Insight

Every problem in every field has the same anatomy. The vocabulary changes. The structure never does.

The **5 Ws** tell you *what happened*.
The **5 Whys** tell you *why it happened*.
Together they tell you *what to do about it*.

---

## The Two Layers

### Layer 1 — Situation Map (5 Ws)

Establish the full picture before drilling into cause.

| Question | What It Captures |
|---|---|
| **Who** | The actor, subject, or stakeholder involved |
| **What** | The event, problem, or incident |
| **When** | The timeline — before, during, and after |
| **Where** | The location, system, environment, or context |
| **Why** | The surface-level, immediately apparent reason |

> The "Why" here is not the root cause. It is the entry point into Layer 2.

---

### Layer 2 — Causal Chain (5 Whys)

Start at the surface Why. Ask why again. Keep going until you hit something you can actually change.

```
Why (surface)
  └─► Why 1:  answer
        └─► Why 2:  answer
              └─► Why 3:  answer
                    └─► Why 4:  answer
                          └─► Why 5:  ROOT CAUSE
```

**Whys can and should branch.** Real problems are rarely single-cause.

```
Why (surface)
  ├─► Why 1a ──► Why 2a ──► ROOT CAUSE A
  └─► Why 1b
        ├─► Why 2b ──► ROOT CAUSE B
        └─► Why 2c ──► ROOT CAUSE C
```

---

### Layer 3 — Resolution

Map each root cause to a concrete change. A resolution is not complete until three questions are answered for each root cause.

**1. What must change?**
The specific system, process, policy, or condition that must be altered. Not "fix the config" — but "add automated config validation to the deploy pipeline."

**2. Does the change actually target the root cause?**
Apply the counterfactual test to the proposed fix:
> "If this change had existed before the problem occurred, would the problem still have happened?"
- If **yes** → the fix targets a symptom, not the root cause. Go deeper.
- If **no** → the fix is correctly targeted.

**3. Fix or mitigate?**
Not every root cause can be eliminated. Some can only be managed.

| Type | Meaning | Example |
|---|---|---|
| **Fix** | The root cause is permanently eliminated | Adding config validation |
| **Mitigate** | The root cause remains; its impact is reduced | Adding alerting so failures are caught faster |
| **Accept** | The root cause is outside the system's control; risk is consciously accepted | Third-party API instability |

Document which type you are applying. A mitigation treated as a fix is a future incident waiting to happen.

**Prioritizing multiple root causes:**

When the Why tree produces several root causes, prioritize by:

```
Priority = Impact × Likelihood of recurrence × Actionability

High impact + high recurrence + easy to change  →  Act first
High impact + low recurrence + hard to change   →  Plan and schedule
Low impact + any recurrence + easy to change    →  Quick win
Low impact + any recurrence + hard to change    →  Accept and document
```

```
Root Cause A  →  What must change  →  Owner  →  By When  →  Fix/Mitigate/Accept
Root Cause B  →  What must change  →  Owner  →  By When  →  Fix/Mitigate/Accept
Root Cause C  →  What must change  →  Owner  →  By When  →  Fix/Mitigate/Accept
```

---

### Layer 4 — Verification and Learning

Resolution is not the end. The investigation is not closed until the fix is confirmed to have worked — and until what you learned updates your approach to the next investigation.

**Verification:**

After the change is implemented, confirm the outcome:

```
□ Has the problem recurred since the fix was applied?
□ Does monitoring confirm the condition is no longer present?
□ Has the counterfactual test been run against the actual outcome?
```

If the problem recurs, the root cause identification was incomplete. Return to Layer 2. The most common reason a fix fails is that it resolved a contributing cause, not the deepest root cause.

**Learning:**

Every completed investigation is a data point that should update your priors for the next one. After verification:

```
□ Were the base rates used at the start accurate?
   → Update them for the next investigation in this domain.

□ Which branches were followed and later pruned?
   → These update the prior probability of that class of cause.

□ What was the first hypothesis — and was it correct?
   → Track this over time to detect systematic anchoring.

□ Were there any surprises?
   → Surprising correct answers are the highest-value signal.
     Document them explicitly.
```

The investigation system compounds over time only if learning is explicit. An organization that runs investigations without updating its priors is running the same investigation over and over.

---

## Full Structure

```
┌─────────────────────────────────────────────┐
│              SITUATION LAYER (5 Ws)          │
│  Who + What + When + Where + Why (surface)  │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│             CAUSATION LAYER (5 Whys)         │
│                                             │
│  Why (surface) ──► Why 1                   │
│                      ├──► Why 2            │
│                      │      ├──► Why 3     │
│                      │      │      └──► ROOT CAUSE A
│                      │      └──► Why 3b ──► ROOT CAUSE B
│                      └──► Why 2b ─────────► ROOT CAUSE C
│                                             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│             RESOLUTION LAYER                 │
│  Root Cause(s) → Change → Owner → By When  │
│  Fix / Mitigate / Accept each root cause    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         VERIFICATION & LEARNING LAYER        │
│  Confirm fix worked → Update priors →       │
│  Document surprises → Close investigation   │
└─────────────────────────────────────────────┘
```

---

## Who — Multiple Actors

"Who" is rarely one person. Real investigations involve multiple actors with different roles. Map all of them before drilling into cause.

| Role | Question |
|---|---|
| **Originator** | Who or what produced the conditions that made the problem possible? |
| **Trigger** | Who or what acted in the moment the problem occurred? |
| **Affected** | Who experienced the impact? |
| **Detector** | Who first noticed or reported it? |
| **Resolver** | Who owns the fix? |
| **Stakeholder** | Who needs to be informed regardless of role? |

A Who answer that is just one person is almost always incomplete. Systems produce conditions. People act within those conditions.

---

## Universal Application

The same framework, across every discipline:

| Domain | Who | What | When | Where | Why (surface) |
|---|---|---|---|---|---|
| Medicine | Patient | Symptom | Onset | Body system | Presenting complaint |
| Security | Threat actor | Breach | Attack window | Vulnerability | Attack vector |
| Engineering | System | Failure | Timeline | Component | Error message |
| Business | Team / Process | Bottleneck | Quarter | Department | Stated reason |
| Legal | Defendant | Act | Date | Jurisdiction | Motive |
| Personal | You | Decision | Moment | Context | Emotion |

---

## Depth Criteria — When to Stop

"Stop when you reach something you can actually change" is the rule. Here is how to test it.

Apply all four tests before closing the Why chain:

**1. The Actionability Test**
> "Is there a concrete change — to a system, process, policy, or structure — that directly addresses this cause?"
- If yes: this is a candidate root cause.
- If no: go deeper. You have reached a description, not a cause.

**2. The Counterfactual Clarity Test**
> "Is the causal mechanism clear enough to state precisely? Do you know *how* this cause produced the effect?"
- If yes: proceed.
- If no: the cause is still too vague. A mechanism you cannot state is a cause you have not understood.

**3. The System Boundary Test**
> "Is this cause inside or outside the system's control?"
- If inside: it is a root cause. Fix or mitigate.
- If outside: it is a constraint. Accept and document it. Design around it.

**4. The Diminishing Returns Test**
> "If we went one Why deeper, would it change what action we take?"
- If yes: go deeper.
- If no: you are at the root cause. Going further produces understanding without changing the response.

All four tests must pass. A Why chain that passes three out of four has not reached the root cause.

---

## Cognitive Hazards

Seven biases reliably derail investigations. Know them before you start.

| Bias | How It Corrupts | Defense |
|---|---|---|
| **Confirmation bias** | Only evidence that supports the leading hypothesis is registered | Actively seek evidence that would disprove each Why answer |
| **Availability bias** | Priors reflect recent memory, not actual base rates | Set priors from data before beginning |
| **Attribution bias** | Why chain stops at a person instead of the system behind them | Any answer that names a person — ask Why once more |
| **Sunk cost** | Continues down a failed branch because time was already spent | Set a pruning threshold before starting; follow it regardless |
| **Groupthink** | Surprising evidence is suppressed; entropy never drops to minimum | Assign an adversarial investigator role explicitly |
| **Anchoring** | First hypothesis raised dominates despite evidence | Do not name a leading hypothesis before the 5 Ws are complete |
| **Premature closure** | Investigation stops at a symptom that feels like a cause | Apply all four Depth Criteria tests before closing the Why chain |

Full treatment: [math/07_cognitive_biases.md](math/07_cognitive_biases.md)

---

## Rules of the Framework

1. **Map before you drill.** Complete the 5 Ws before starting the 5 Whys.
2. **Evidence at every node.** An assertion without evidence is a guess. Each Why answer must link to proof.
3. **Branch when reality branches.** If a Why has multiple answers, follow all of them.
4. **5 is a heuristic, not a rule.** Stop when you reach something you can actually change — not at a count.
5. **The framework is recursive.** A root cause can become a new "What." Run the whole thing again at a deeper level if needed.

---

## The Loop

```
5 Ws  (situational map)
  └─► 5 Whys  (causal depth)
        └─► Root Cause identified
              └─► Root Cause becomes new "What"?
                    └─► Run again if needed
```

---

## Investigation Template

Two versions. Use the Linear Template for simple, single-cause problems. Use the Branching Template for any problem where a Why has more than one answer.

### Linear Template

```
INVESTIGATION: [Title]
DATE: [Date]
INVESTIGATOR: [Name]

--- SITUATION (5 Ws) ---

Who (originator / trigger / affected / detector / resolver):
What:
When (timeline — before / during / after):
Where:
Why (surface):

--- CAUSATION (5 Whys) ---

Why 1:   [answer]
  Evidence:  [source, tier, timestamp]

Why 2:   [answer]
  Evidence:  [source, tier, timestamp]

Why 3:   [answer]
  Evidence:  [source, tier, timestamp]

Why 4:   [answer]
  Evidence:  [source, tier, timestamp]

Why 5:   [answer]  ← ROOT CAUSE
  Evidence:  [source, tier, timestamp]
  Depth criteria passed:  [ ] Actionability  [ ] Counterfactual Clarity  [ ] System Boundary  [ ] Diminishing Returns

--- RESOLUTION ---

Root Cause:
Counterfactual test on proposed fix: "If this change had existed, would the problem still have occurred?" → [Yes/No]
Type: [ ] Fix  [ ] Mitigate  [ ] Accept
Must Change:
Owner:
By When:

--- VERIFICATION ---

Problem recurred after fix? [ ] Yes → return to Layer 2   [ ] No → proceed
Monitoring confirms fix? [ ] Yes   [ ] No
Priors updated for next investigation? [ ] Yes
Surprises worth documenting:
```

---

### Branching Template

Use this when any Why produces more than one answer. Each branch is tracked separately and converges at the resolution layer.

```
INVESTIGATION: [Title]
DATE: [Date]
INVESTIGATOR: [Name]

--- SITUATION (5 Ws) ---

Who (originator / trigger / affected / detector / resolver):
What:
When (timeline — before / during / after):
Where:
Why (surface):

--- CAUSATION (branching Why tree) ---

Why (surface): [answer]
  │
  ├──► Branch A: [first cause]
  │      Evidence: [source, tier]
  │      │
  │      └──► Why A2: [answer]
  │             Evidence: [source, tier]
  │             │
  │             └──► ROOT CAUSE A: [state it]
  │                    Depth criteria: [ ] Actionability [ ] Counterfactual [ ] Boundary [ ] Returns
  │
  └──► Branch B: [second cause]
         Evidence: [source, tier]
         │
         ├──► Why B2a: [answer]
         │      Evidence: [source, tier]
         │      └──► ROOT CAUSE B: [state it]
         │             Depth criteria: [ ] Actionability [ ] Counterfactual [ ] Boundary [ ] Returns
         │
         └──► Why B2b: [answer]
                Evidence: [source, tier]
                └──► ROOT CAUSE C: [state it]
                       Depth criteria: [ ] Actionability [ ] Counterfactual [ ] Boundary [ ] Returns

Convergent nodes (root causes reached by multiple branches):

--- RESOLUTION ---

ROOT CAUSE A:
  Fix / Mitigate / Accept:
  Must Change:
  Owner / By When:
  Counterfactual test on fix: [Yes/No — if Yes, go deeper]

ROOT CAUSE B:
  Fix / Mitigate / Accept:
  Must Change:
  Owner / By When:
  Counterfactual test on fix:

ROOT CAUSE C:
  Fix / Mitigate / Accept:
  Must Change:
  Owner / By When:
  Counterfactual test on fix:

Priority order (Impact × Recurrence × Actionability):

--- VERIFICATION ---

Each root cause fix confirmed? [ ] A  [ ] B  [ ] C
Any recurrence? [ ] Yes → return to Layer 2   [ ] No
Priors updated:
Surprises documented:
```
