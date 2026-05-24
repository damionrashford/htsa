<h1 align="center">Cognitive Biases</h1>

> The framework is only as good as the mind running it. Biases corrupt the investigation before the first Why is asked.

---

## What They Are

Cognitive biases are systematic errors in reasoning — patterns where the human mind reliably produces wrong answers. They are not random mistakes. They are predictable distortions that operate below conscious awareness and affect every stage of an investigation.

The math of the framework assumes a rational agent: one who updates priors correctly, follows highest-probability branches, and prunes on evidence. Cognitive biases break each of these assumptions. Understanding them is not optional — it is part of the framework.

---

## How Biases Corrupt the Math

| Bias | Math It Corrupts | How |
|---|---|---|
| Confirmation bias | Bayesian updating | Evidence that contradicts the prior is discounted; posterior barely moves |
| Availability bias | Prior setting | Priors reflect recent memory, not base rates |
| Attribution bias | Graph structure | Cause is assigned to a person (leaf node), not the system behind them |
| Sunk cost | Search strategy | Continues DFS down a failed branch because time was already spent |
| Groupthink | Information gain | High-surprise answers are suppressed; entropy never drops to minimum |
| Anchoring | Prior setting | First hypothesis sets the prior and it never moves far enough |
| Premature closure | Depth decision | Investigation stops before reaching an actionable root cause |

---

## The Seven Biases

### 1. Confirmation Bias

**What it is:** Seeking, interpreting, and remembering evidence in ways that confirm what you already believe.

**What it looks like in investigation:**
- Asking questions that can only confirm the suspected cause
- Dismissing evidence that contradicts the leading hypothesis
- Stopping the Why chain when you reach a familiar answer

**Mathematical damage:** The Bayesian update becomes:
```
P(H | E_confirming) rises normally
P(H | E_contradicting) barely changes

→ Posterior converges on the prior, not the truth
```

**Countermeasure:** At every Why node, actively look for evidence that would disprove the current branch. The counterfactual test is the primary defense: "If this cause were false, what would we expect to see?"

---

### 2. Availability Bias

**What it is:** Overweighting causes that come easily to mind — usually because they are recent, vivid, or frequently discussed.

**What it looks like in investigation:**
- "The last three outages were deploy-related, so this one must be too"
- Assigning high prior probability to the most memorable cause
- Ignoring rare but relevant possibilities

**Mathematical damage:** The prior is set by recall speed, not by base rates:
```
Correct prior:    P(cause) = actual frequency in similar situations
Availability prior: P(cause) = how easily it comes to mind

→ These are not the same distribution
```

**Countermeasure:** Set priors from data, not memory. Before beginning the investigation, write down what the base rates actually are for this class of problem. If you do not know them, that is the first gap to fill.

---

### 3. Attribution Bias (Fundamental Attribution Error)

**What it is:** Attributing causes to individual people rather than the systems, processes, and contexts that produced the behavior.

**What it looks like in investigation:**
- "The engineer made a mistake" as a root cause
- Why chain stops at a human action instead of the conditions that made the action likely
- Resolution targets the person rather than the system

**Mathematical damage:** The Why tree is truncated at a person node:
```
[Outage]
  └──► [Engineer deployed bad config]  ← STOPS HERE

The correct tree continues:
  └──► [Engineer deployed bad config]
         └──► [No pre-deploy validation existed]
                └──► [Process had no config review step]
                       └──► ROOT CAUSE: systemic gap
```

**Countermeasure:** Any Why answer that names a person should trigger one more Why: "Why was the person in a position to cause this?" In most cases, the root cause is a system condition, not a person.

**Important exceptions where the person IS the root cause:**
- **Deliberate acts** — fraud, sabotage, targeted attacks — where intent is the cause
- **Gross negligence** — where an individual violated clear, well-communicated standards
- **Unique authority** — where one person had unchecked power and exercised it recklessly

Even in these cases, ask whether a systemic control *should* have prevented it. But do not force a systemic explanation when the evidence points to individual responsibility. Doing so is itself a bias — the inverse of the fundamental attribution error.

---

### 4. Sunk Cost Bias

**What it is:** Continuing to invest in a failing approach because of resources already spent, not because of expected future value.

**What it looks like in investigation:**
- Following a Why branch for hours after evidence has undermined it
- Reluctance to backtrack because "we've already been down this path"
- Escalating commitment to an unlikely hypothesis

**Mathematical damage:** Search strategy becomes path-dependent instead of evidence-dependent:
```
Correct behavior:    P(branch) drops below threshold → prune → backtrack
Sunk cost behavior:  P(branch) drops below threshold → continue anyway

→ Resources spent on low-probability branches; high-probability branches unexplored
```

**Countermeasure:** The pruning threshold must be set before the investigation begins. Agree in advance: "If a branch's probability drops below X%, we backtrack regardless of time spent." Sunk cost is easier to resist when the rule is made before you are in the situation.

---

### 5. Groupthink

**What it is:** The tendency for groups to converge on a shared belief and suppress dissenting information to preserve consensus.

**What it looks like in investigation:**
- Team quickly agrees on a root cause without exhausting alternatives
- Individuals self-censor doubts about the leading hypothesis
- Surprising evidence is minimized or ignored to maintain group harmony
- The investigation feels fast and smooth — which is itself a warning sign

**Mathematical damage:** Surprise is suppressed. From information theory:
```
Surprise(x) = -log₂ P(x)

Surprising answers carry the most information.
Groupthink systematically filters out high-surprise answers.

→ Information gain per question approaches zero
→ Entropy never drops to minimum
→ Investigation converges on the expected answer, not the correct one
```

**Countermeasure:** Assign someone the explicit role of adversarial investigator — their job is to challenge every leading hypothesis and surface evidence against it. Rotate this role. Make it structurally required, not optional.

---

### 6. Anchoring

**What it is:** Over-relying on the first piece of information encountered, which sets a reference point that all subsequent reasoning is adjusted from — insufficiently.

**What it looks like in investigation:**
- The first hypothesis raised in the room becomes the implicit front-runner
- All subsequent evidence is evaluated relative to the anchor, not independently
- The investigation ends near where it started

**Mathematical damage:** The prior is fixed at the anchor value and updates are proportionally too small:
```
True Bayesian update:   P_posterior = (P_likelihood × P_prior) / P_evidence
Anchored update:        P_posterior ≈ P_anchor ± small_adjustment

→ Posterior never reflects the full weight of accumulated evidence
```

**Countermeasure:** Do not name a leading hypothesis before the 5 Ws are complete. Generate all plausible hypotheses simultaneously before assigning any probability. No single hypothesis should have special status until evidence creates it.

**The distinction from informed priors:** Setting a prior based on documented base rates (see **[05 Bayesian Reasoning](05_bayesian_reasoning.md)**) is not anchoring — it is data. Anchoring occurs when the prior comes from recall, intuition, or whoever spoke first. **The test:** Can you cite the data source for your prior? If yes, it is an informed prior. If no, it is an anchor.

---

### 7. Premature Closure

**What it is:** Accepting the first explanation that seems sufficient, without testing whether deeper causes exist.

**What it looks like in investigation:**
- Stopping at Why 2 or Why 3 because an answer feels complete
- Resolving a symptom and calling it a root cause
- The fix works once — until the root cause produces the problem a different way

**Mathematical damage:** Entropy appears to drop, but it has not actually reached minimum:
```
Why 2 answer:  "The config was wrong"
Entropy feels low. But:

Why 3:  "The config was wrong because there is no config validation step"
Why 4:  "There is no validation step because no one owns config governance"
Why 5:  "No one owns config governance because that role was never defined"

→ Each additional Why significantly changed what action was needed
→ Premature closure produces a fix that treats the symptom
```

**Countermeasure:** Apply the Depth Criteria test at every stopping point: "Would the problem have occurred even if this Why answer had not been true?" If the answer is "the system could still have produced this problem another way," you have not reached a root cause.

---

## Bias Detection Checklist

Run this checklist at each major decision point in an investigation:

```
□ Have I looked for evidence that contradicts my leading hypothesis?
□ Are my priors based on data or on what I remember most easily?
□ Does my root cause name a person — and if so, have I asked why once more?
□ Am I continuing this branch because of evidence or because of time already spent?
□ Has anyone in the room voiced dissent? Have I actually engaged with it?
□ Did the first hypothesis raised still dominate — and why?
□ Have I applied the Depth Criteria before stopping?
```

---

## The Meta-Rule

Cognitive biases cannot be eliminated. They can only be detected and countered by structure. The framework is that structure — but only if it is followed with discipline. Every shortcut, every "we already know what this is," every suppressed Why is a bias winning.

The best defense is the counterfactual test, applied at every node, by a team that has agreed in advance to use it.

---

## Key Terms

| Term | Meaning |
|---|---|
| **Confirmation bias** | Seeking evidence that confirms existing beliefs; ignoring contradicting evidence |
| **Availability bias** | Overweighting causes that come easily to mind |
| **Attribution bias** | Blaming individuals rather than systems |
| **Sunk cost bias** | Continuing a failing path because of past investment |
| **Groupthink** | Group convergence that suppresses dissent and surprise |
| **Anchoring** | Over-relying on the first hypothesis; insufficient updating |
| **Premature closure** | Stopping before reaching an actionable root cause |
| **Adversarial investigator** | A designated role whose job is to challenge the leading hypothesis |

---

<p align="center"><strong>← Previous</strong> <strong><a href="06_search_algorithms.md">06 — Search Algorithms</a></strong> · <strong>Next →</strong> <strong><a href="08_evidence_evaluation.md">08 — Evidence Evaluation</a></strong></p>
