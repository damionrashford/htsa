<h1 align="center">HTSA Cheat Sheet</h1>

> One page. No explanation. Just the steps.

---

## Layer 1 — Situation Map (5 Ws)

Complete ALL five before moving to Layer 2.

| W | Answer |
|---|---|
| **Who** | Originator / Trigger / Affected / Detector / Resolver / Stakeholder |
| **What** | The event — specific and measurable |
| **When** | Before (normal) / During (onset) / After (current) |
| **Where** | Location, system, scope — global or isolated? |
| **Why (surface)** | The obvious reason — this is NOT the root cause |

---

## Layer 2 — Causal Chain (5 Whys)

**Before branching:** Set priors from data. Assign probabilities. Pick a search strategy.

| Search | When to use |
|---|---|
| **Best-First** | Default — follow highest-probability branch |
| **DFS** | Time pressure — go deep fast on one branch |
| **BFS** | Must not miss anything — explore all branches at each level |

**At each Why:** State answer → Cite evidence with tier → Mark Finding or Hypothesis → Update probabilities → Prune below threshold.

| Evidence Tier | Type | Reliability |
|---|---|---|
| Tier 1 | Physical / instrumental (logs, metrics, documents) | Highest |
| Tier 2 | Observational (direct observation, surveys) | High |
| Tier 3 | Inferential (correlation, pattern matching) | Medium |
| Tier 4 | Testimonial (interviews, self-reports) | Lowest |

**Pruning thresholds:** 5% general, 1% safety-critical, 10% exploratory.

**Branch when reality branches.** Follow all paths. 5 is a heuristic — stop when actionable.

**Depth criteria — ALL four must pass to declare a root cause:**

1. **Actionability** — Is there a concrete change that addresses this cause?
2. **Counterfactual Clarity** — Can you state how this cause produced the effect?
3. **System Boundary** — Is this inside the system's control?
4. **Diminishing Returns** — Would going deeper change what action you take?

---

## Layer 3 — Resolution

For each root cause:

```
Root Cause → What Must Change → Fix/Mitigate/Accept → Owner → By When
```

**Counterfactual test on the fix:** "If this change had existed, would the problem still have happened?"
- Yes → you are fixing a symptom. Go deeper.
- No → fix is correctly targeted.

| Type | Meaning |
|---|---|
| **Fix** | Root cause permanently eliminated |
| **Mitigate** | Root cause remains, impact reduced |
| **Accept** | Outside system control, risk accepted |

**Priority:** Impact x Recurrence x Actionability (each 1-5). Within 20%, treat as equal.

**Root cause interactions:**

| Type | Test |
|---|---|
| **AND** | Fixing A alone doesn't prevent the problem |
| **OR (overdetermination)** | Fixing A alone does prevent it — but so does fixing B alone. Fix both. |
| **Amplification** | A makes B worse |
| **Conflict** | Fixing A worsens B |

---

## Layer 4 — Verification and Learning

**Verification window:**
- Event-driven → wait for next trigger
- Time-driven → wait one full cycle
- Continuous → measure before/after over set interval
- No trigger → 2 weeks (technical), 1 quarter (organizational)

**Checklist:**

```
□ Problem recurred?          → Yes: return to Layer 2
□ Monitoring confirms fix?
□ Counterfactual tested against actual outcome?
□ Priors updated for next investigation?
□ Surprises documented?
```

---

## Bias Defenses

| Bias | One-line defense |
|---|---|
| Confirmation | Seek disconfirming evidence |
| Availability | Set priors from data, not memory |
| Attribution | Person named? Ask Why once more. |
| Sunk cost | Follow the pruning threshold |
| Groupthink | Surface the unwanted hypothesis |
| Anchoring | No leading hypothesis before 5 Ws complete |
| Premature closure | All four depth criteria must pass |

---

## Rapid Mode (minutes, not hours)

Same framework, compressed:
- 5 Ws: one sentence each — do not skip
- DFS only, single branch, raise threshold to 20%
- Accept Tier 2-3 evidence temporarily
- Label fix as "rapid — verify later"
- Schedule full investigation after crisis

**Non-negotiable even under pressure:** Complete 5 Ws. Run counterfactual test. Document what you skipped.

---

**[Full Framework](FRAMEWORK.md)** · **[The Math](math/00_index.md)** · **[Proofs](proofs/00_index.md)** · **[Examples](examples/00_index.md)**
