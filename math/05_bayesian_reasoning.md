<h1 align="center">Bayesian Reasoning</h1>

> You do not find the truth all at once. You update toward it, one piece of evidence at a time.

---

## What It Is

Bayesian reasoning is a mathematical framework for **updating beliefs in the presence of new evidence**. It is named after Reverend Thomas Bayes, whose theorem describes how to rationally revise a probability estimate when you learn something new.

---

## Bayes' Theorem

```
P(H | E) = P(E | H) × P(H) / P(E)
```

| Symbol | Meaning |
|---|---|
| **P(H)** | Prior — your belief in hypothesis H before seeing evidence |
| **P(E \| H)** | Likelihood — how probable the evidence is if H is true |
| **P(E)** | Marginal — overall probability of seeing this evidence |
| **P(H \| E)** | Posterior — your updated belief after seeing the evidence |

In plain English: **start with a belief, observe evidence, update the belief.**

---

## How This Applies to Investigation

When you have multiple branches in a Why tree, each branch represents a **hypothesis** about the cause. Bayesian reasoning gives you a principled way to assign and update probabilities as evidence comes in.

```
HYPOTHESIS A: "Root cause is a misconfigured timeout"   → P(A) = 0.40
HYPOTHESIS B: "Root cause is a memory leak"             → P(B) = 0.35
HYPOTHESIS C: "Root cause is a bad deploy"              → P(C) = 0.25
```

You gather evidence:

> Evidence: The problem occurs even on builds that predate the last deploy.

This evidence is unlikely if C is true, so P(C) drops. It is consistent with A and B, so they rise:

```
HYPOTHESIS A: P(A) = 0.50  ↑
HYPOTHESIS B: P(B) = 0.44  ↑
HYPOTHESIS C: P(C) = 0.06  ↓ (nearly ruled out)
```

---

## The Prior

The **prior** is your belief before you see evidence. It should be based on:
- Past investigations in this domain
- Base rates (how often does each cause occur in similar situations?)
- Domain expertise

A good investigator does not start with equal priors on all hypotheses. They use knowledge to set informed starting points. Then they update.

**The line between informed priors and anchoring bias** (see **[07 Cognitive Biases](07_cognitive_biases.md)**):
- An **informed prior** is based on **documented frequency data** — "80% of past outages in this system were deploy-related" from an incident database. This is data.
- An **anchoring prior** is based on **personal recall or gut feeling** — "I think it's usually deploys" from memory. This is availability bias disguised as domain knowledge.

**The test:** Can you cite the source of your prior? If it comes from a base rate you can point to, use it. If it comes from what feels right, treat it as a rough estimate and be prepared to move it substantially when evidence arrives.

---

## The Bayesian Investigation Loop

```
1. Set priors on all hypotheses (branches)
2. Gather evidence at the current Why node
3. Update probabilities using Bayes' theorem
4. Prune low-probability branches (below threshold; set this before starting — see note on domain-appropriate thresholds below)
5. Follow highest-probability branch
6. Repeat until one hypothesis dominates
```

---

## How to Estimate Probabilities in Practice

Bayes' theorem is precise. Human probability estimation is not. Here is how to bridge the gap:

**For priors — use one of these methods (in order of preference):**

```
1. Frequency data:  "Of the last 50 outages, 35 were deploy-related"
                    → P(deploy) = 0.70

2. Reference class:  "In systems like ours, the industry benchmark is
                     ~40% config, ~30% capacity, ~30% code defect"
                    → Use these as starting priors

3. Structured estimate:  When no data exists, use a calibrated scale:
   Almost certain:  0.90+
   Likely:          0.70–0.89
   Possible:        0.30–0.69
   Unlikely:        0.10–0.29
   Very unlikely:   < 0.10

   Assign each hypothesis a label, then convert to numbers.
   Ensure all priors sum to 1.0 (normalize if needed).
```

**For likelihoods P(evidence | hypothesis):**

Ask: "If this hypothesis were true, how expected is this evidence?"
```
   Would definitely see this evidence:    P(e|H) = 0.90–0.99
   Would probably see it:                 P(e|H) = 0.60–0.89
   Might or might not see it:             P(e|H) = 0.40–0.59
   Would be surprised to see it:          P(e|H) = 0.10–0.39
   Would be shocked to see it:            P(e|H) = 0.01–0.09
```

**The key insight:** Approximate probabilities that get updated by evidence are far better than no probabilities at all. Even rough estimates create a ranking. Bayesian updating corrects miscalibrated priors over time — that is its core property.

---

## Avoiding Two Failure Modes

**1. Anchoring (too little updating)**
You set a prior and refuse to move it even when evidence contradicts it. You find the cause you expected, not the real one.

**2. Overreacting to single data points (too much updating)**
One surprising piece of evidence sends you chasing a low-probability hypothesis and abandoning correct ones. Each piece of evidence should move your belief — but proportionally.

Bayes' theorem is the cure for both. It tells you exactly how much to update.

---

## Base Rates Matter

If 80% of similar outages in your system are caused by deploys, your prior for deploy-related root causes should be 0.80, not 0.33. Ignoring base rates is one of the most common investigation errors.

```
Without base rates:  Three equal hypotheses, each at 33%
With base rates:     Deploy at 80%, config at 15%, other at 5%

Same evidence, very different investigation paths.
```

---

## Domain-Appropriate Pruning Thresholds

The pruning threshold must be set before the investigation begins. Different domains warrant different thresholds:

```
General investigation:               5%  (θ = 0.05)
Safety-critical (aviation, nuclear,
  medical, infrastructure):          1% or lower (θ ≤ 0.01)
  — any plausible cause that could harm people must be investigated
Exploratory / low-stakes:           10%  (θ = 0.10)
  — faster convergence when consequences are reversible
```

In safety-critical domains, a 5% cause can kill. Err toward θ → 0 when lives or critical systems are at stake.

---

## Convergence

As evidence accumulates, posteriors converge — the probabilities bunch up around the true cause, and alternatives drop toward zero. A well-run Bayesian investigation **converges** on the root cause. A poorly run one stays uncertain because evidence is not being gathered or evaluated properly.

---

## Key Terms

| Term | Meaning |
|---|---|
| **Prior** | Belief before seeing evidence |
| **Posterior** | Updated belief after seeing evidence |
| **Likelihood** | How probable the evidence is under a given hypothesis |
| **Hypothesis** | A candidate root cause being evaluated |
| **Base rate** | The background frequency of a cause in similar situations |
| **Convergence** | Posteriors approaching certainty as evidence accumulates |
| **Anchoring** | Failure to update priors in response to evidence |

---

<p align="center"><strong>← Previous</strong> <strong><a href="04_information_theory.md">04 — Information Theory</a></strong> · <strong>Next →</strong> <strong><a href="06_search_algorithms.md">06 — Search Algorithms</a></strong></p>
