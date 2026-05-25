<h1 align="center">HTSA Cheat Sheet</h1>

> One page. No explanation. Just the steps.

---

## Step 1 — Map the situation

Answer all five before moving to Step 2. Skip none.

| Question | What you're looking for |
|---|---|
| **Who** | Who triggered it? Who was affected? Who found it? Who needs to fix it? |
| **What** | The specific event — measurable, not vague |
| **When** | Before (what was normal), during (when it started), after (right now) |
| **Where** | Where in the system, process, or world did this happen? |
| **Why (surface)** | The obvious reason — this is NOT the root cause yet |

---

## Step 2 — Trace the cause

**Before you dig:** Set your starting probabilities. Pick a search strategy.

| Strategy | When to use |
|---|---|
| **Best-First** | Default — follow the most likely branch first |
| **DFS** | Under time pressure — go deep fast on one branch |
| **BFS** | Can't miss anything — explore all branches at each level |

**At each Why:** State your answer → cite your evidence → mark it as confirmed or a hypothesis → update probabilities → cut branches below the threshold.

| Evidence quality | Type | How reliable |
|---|---|---|
| Tier 1 | Physical or recorded (logs, metrics, documents) | Highest |
| Tier 2 | Direct observation (you saw it, surveys) | High |
| Tier 3 | Inferred (pattern matching, correlation) | Medium |
| Tier 4 | Secondhand (interviews, self-reports) | Lowest |

**Cut a branch when its probability drops below:** 5% (general), 1% (safety-critical), 10% (exploratory).

**Branch when reality branches.** Follow every live path. Five whys is a starting point — stop when you have something actionable.

**A root cause must pass all four tests:**

1. **Actionable** — Is there a concrete change that addresses it?
2. **Counterfactual** — Can you explain exactly how this caused the effect?
3. **In scope** — Is this inside your system's control?
4. **No deeper** — Would going deeper change what you'd actually do?

---

## Step 3 — Choose the fix

For each root cause:

```
Root Cause → What Must Change → Fix / Mitigate / Accept → Owner → By When
```

**Test your fix:** "If this change had existed, would the problem still have happened?"
- Yes → you're fixing a symptom. Go deeper.
- No → the fix is correctly aimed.

| Type | What it means |
|---|---|
| **Fix** | Root cause permanently eliminated |
| **Mitigate** | Root cause stays, impact is reduced |
| **Accept** | Outside your control — risk acknowledged |

**Priority:** Score each fix on Impact × Recurrence × Actionability (each 1–5). Within 20% of each other, treat them as equal.

**When causes interact:**

| Pattern | What to do |
|---|---|
| **AND** | Fixing one alone doesn't solve it — fix both |
| **OR** | Either fix alone works — still fix both |
| **Amplification** | A makes B worse — address A first |
| **Conflict** | Fixing A worsens B — resolve the tension explicitly |

---

## Step 4 — Verify it worked

**Set your verification window:**
- Event-driven → wait for the next time the trigger happens
- Time-driven → wait one full cycle
- Continuous → measure before and after over a set interval
- No clear trigger → 2 weeks (technical), 1 quarter (organizational)

**Before you close it:**

```
□ Did the problem recur?          → Yes: go back to Step 2
□ Does monitoring confirm the fix?
□ Does the outcome match your prediction?
□ Have you updated your priors for next time?
□ Did anything surprise you? Document it.
```

---

## Watch out for these thinking traps

| Trap | One-line defense |
|---|---|
| Confirmation bias | Actively look for evidence that proves you wrong |
| Availability bias | Set probabilities from data, not what comes to mind first |
| Attribution bias | Named a person? Ask Why once more. |
| Sunk cost | Follow the pruning threshold — past effort doesn't count |
| Groupthink | Say the uncomfortable hypothesis out loud |
| Anchoring | No leading hypothesis before Step 1 is complete |
| Premature closure | All four root cause tests must pass |

---

## Under pressure? Use rapid mode

Same framework, compressed:
- Step 1: one sentence per question — do not skip
- DFS only, single branch, raise threshold to 20%
- Accept Tier 2–3 evidence temporarily
- Label fix as "rapid — verify later"
- Schedule a full investigation after the crisis

**Even under pressure, never skip:** Complete Step 1. Run the counterfactual test. Write down what you skipped.

---

**[Full Framework](../FRAMEWORK.md)** · **[The Math](../math/00_index.md)** · **[Proofs](../proofs/00_index.md)** · **[Examples](../examples/00_index.md)**
