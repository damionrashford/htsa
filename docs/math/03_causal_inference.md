<h1 align="center">Causal Inference</h1>

> Correlation tells you what moves together. Causation tells you what actually caused what. These are not the same thing.

---

## What It Is

Causal inference is the mathematical discipline of determining **cause and effect** from data and evidence. It was formalized by statistician and computer scientist **Judea Pearl**, whose work established that causation cannot be derived from correlation alone — it requires a model.

Pearl's central tool: the **DAG** (Directed Acyclic Graph) — the exact same structure as the 5 Whys tree.

---

## The Problem With "Why"

When you ask why something happened, you are making a causal claim. But two things can be correlated — moving together — without either causing the other.

**Classic example:**
- Ice cream sales and drowning rates are correlated.
- Ice cream does not cause drowning.
- A third variable — **hot weather** — causes both.

This third variable is called a **confounder**. Causal inference is largely about identifying and controlling for confounders.

---

## Pearl's Ladder of Causation

Pearl describes three levels of causal reasoning:

| Level | Question | Example |
|---|---|---|
| **1. Association** | What is? | "The system crashed when the deploy ran." |
| **2. Intervention** | What if I do X? | "If I roll back the deploy, will the system recover?" |
| **3. Counterfactual** | What if X had not happened? | "Would the crash have happened without the deploy?" |

The 5 Whys operates primarily at **Level 2 and 3**. Each Why answer is an intervention claim — "this caused that." Strong investigations test counterfactuals at every node.

---

## The Do-Calculus

Pearl formalized causation with **do-notation**:

```
P(Y | X)       = probability of Y given that we observe X
P(Y | do(X))   = probability of Y given that we intervene and SET X
```

These are different. Observing that it's raining does not cause wet ground. Intervening (making it rain) does. The 5 Whys *should* be asking the **do(X)** question — not just "did these things co-occur?" but "did this actively produce that?"

**In practice**, most investigators default to Level 1 (association) questions: "What happened when X was present?" The counterfactual test is what forces the investigation to Level 2/3: "Would the problem still have occurred if X had NOT been present?" Without the counterfactual test, the 5 Whys can degenerate into a chain of correlations.

---

## How This Applies to the Framework

At every Why node, you are making a causal claim. That claim must meet a minimum standard.

**The Counterfactual Test** is the framework's primary causal validation tool. It operates in two stages — Stage 1 handles standard causes, Stage 2 catches overdetermined causes that naive counterfactual testing misses. **The two-stage design is a core contribution of this framework** — without Stage 2, any investigation with multiple independently sufficient causes will incorrectly discard genuine root causes. See also **[FRAMEWORK.md](../framework.md)** (Root Cause Interaction section) for how overdetermined causes are handled at the resolution layer.

**Stage 1 — Simple counterfactual:**
> "If this Why answer had NOT been true, would the problem still have occurred?"

- If **no** → this is a genuine causal factor. Record it and continue down.
- If **yes** → proceed to Stage 2 before discarding.

**Stage 2 — Contingent counterfactual (overdetermination check):**
> "If this Why answer had NOT been true AND [other candidate cause] had ALSO not been true, would the problem still have occurred?"

Test against each other active cause in the Why tree. If ANY combination returns **no**:
- This IS a genuine cause — it was **masked** by another independently sufficient cause.
- Flag both as **overdetermined** (see Overdetermination below).

If ALL combinations still return **yes** → this is genuinely not a cause. Discard.

```
Why 3: "The alert threshold was set too high"
  Stage 1: If the threshold had been correct, would the outage still have happened?
  Answer: No → genuine cause → continue to Why 4

Why 3: "Memory leak in service A"  (another branch also has "Disk full on host B")
  Stage 1: Without the memory leak, would the crash still have occurred?
  Answer: Yes (disk was full) → proceed to Stage 2
  Stage 2: Without the memory leak AND without the disk-full condition?
  Answer: No → memory leak IS a genuine cause (overdetermined — masked by disk-full)
```

Most investigations never reach Stage 2. It triggers only when multiple independently sufficient causes coexist — rare, but critical to catch when it occurs.

---

## Confounders in Investigations

A **confounder** is a hidden variable that causes two things to appear related when they are not.

```
[Deploy ran] ──────────────► [System crashed]
      ▲                              ▲
      └──── [Traffic spike] ─────────┘
```

Both the deploy and the crash correlate. But the real cause is the traffic spike. The deploy just happened to coincide with it. Without causal inference discipline, you blame the deploy and fix the wrong thing.

**The investigation itself as a confounder:** In social systems (organizations, teams, communities), the act of investigating can change the system being investigated. Interviews alert people, who change behavior. Metrics get gamed once people know they are being measured. This creates a confounder between pre-investigation evidence and post-investigation evidence. The defense: maintain a **temporal firewall** — clearly separate evidence gathered before the investigation was announced from evidence gathered after. Weight pre-investigation evidence higher, and document when each piece was collected relative to the investigation's start. See **[08_evidence_evaluation.md](08_evidence_evaluation.md)** for the full protocol.

---

## Overdetermination

**Overdetermination** occurs when multiple causes are each independently sufficient to produce the effect. If Cause A alone would produce the problem, and Cause B alone would also produce the problem, then both are genuine causes — but a naive counterfactual test will miss one of them.

```
[Memory leak] ──────────────► [System crash]
[Disk full]   ──────────────► [System crash]

Either alone is sufficient. Removing one does not prevent the crash
(the other is still sufficient). The simple counterfactual test
incorrectly discards both.
```

This is why the framework uses a **two-stage counterfactual test** (see "How This Applies to the Framework" above):

- **Stage 1** catches standard causes (independently necessary).
- **Stage 2** catches overdetermined causes (independently sufficient but masked).

**Root cause interaction type:** Overdetermined causes are **OR-causation** — any one is sufficient. This contrasts with AND-causation (all are necessary). See **[FRAMEWORK.md](../framework.md)** for the full interaction table.

When overdetermined causes are found:
1. Flag both as genuine root causes
2. Document the overdetermination relationship
3. Resolve both — fixing only one leaves the system vulnerable to the other

---

## Key Principles

1. **Correlation is not causation.** Always test the counterfactual.
2. **Confounders exist.** Look for hidden variables that explain the correlation.
3. **Causation is strengthened by a stated mechanism.** How did X produce Y? A stated mechanism makes the causal claim stronger and more testable. However, causal inference is possible without a complete mechanism when statistical evidence is overwhelming — epidemiologists established that smoking causes cancer (Bradford Hill, 1965) before the biological mechanism was fully understood. When the mechanism is unknown, demand stronger statistical evidence (Tier 1) to compensate.
4. **The DAG is the model.** Drawing your Why tree IS doing causal inference. The structure of the graph encodes your causal assumptions.

---

## Key Terms

| Term | Meaning |
|---|---|
| **Causal inference** | The math of determining what caused what |
| **Confounder** | A hidden variable that creates false correlations |
| **Counterfactual** | "What would have happened if X had not occurred?" |
| **Do-calculus** | Pearl's formal notation for intervention vs. observation |
| **DAG** | Directed Acyclic Graph — the mathematical model of causation |
| **Mechanism** | The process by which a cause produces an effect |
| **Overdetermination** | Multiple causes each independently sufficient to produce the effect |
| **OR-causation** | Any single cause is sufficient; contrasts with AND-causation where all are necessary |
| **Contingent counterfactual** | Stage 2 test: removing multiple causes simultaneously to unmask overdetermined causes |
| **Temporal firewall** | Separating pre-investigation from post-investigation evidence to control for the investigation itself as a confounder |

---

<p align="center"><strong>← Previous</strong> <strong><a href="02_exponential_problem_space.md">02 — Exponential Problem Space</a></strong> · <strong>Next →</strong> <strong><a href="04_information_theory.md">04 — Information Theory</a></strong></p>
