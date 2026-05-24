<h1 align="center">Information Theory</h1>

> Every *correct* Why answer reduces uncertainty. That is not a metaphor — it is the definition of information.

---

## What It Is

Information theory is the mathematical study of **quantifying, storing, and transmitting information**. Founded by Claude Shannon in 1948, it defines information precisely: the amount by which a message reduces uncertainty.

The core unit is **entropy** — a measure of uncertainty or unpredictability in a system.

---

## Shannon Entropy

```
H(X) = -Σ P(x) log₂ P(x)
```

- **H(X)** = entropy of the system (measured in bits)
- **P(x)** = probability of each possible outcome
- **Higher entropy** = more uncertainty = more possible states
- **Lower entropy** = less uncertainty = fewer possible states

---

## How This Applies to Investigation

When you begin an investigation, you have **maximum uncertainty** about the root cause. There are many possible causes. Entropy is high.

Each *correct* Why answer you collect **reduces the possibility space**. Entropy drops. You are gaining information in the precise mathematical sense.

**Caveat:** An *incorrect* Why answer can increase entropy by introducing false branches into the tree. If a wrong answer at depth 2 sends the investigation down two spurious paths, the search space expands rather than contracts. This is why the framework demands evidence at every node — evidence is what ensures the answer is correct and the entropy reduction is real. An answer without evidence is a guess that may increase rather than decrease uncertainty.

```
START:    High entropy  — root cause is one of many possibilities
Why 1:    Entropy drops — some branches eliminated
Why 2:    Entropy drops — more branches eliminated
Why 3:    Entropy drops — approaching a single path
Why 4:    Entropy drops — near certainty
ROOT:     Low entropy   — one root cause identified
```

---

## Information Gain

When you ask a Why question, the answer gives you **information gain** — the reduction in entropy produced by that answer.

```
Information Gain = H(before) - H(after)
```

A Why answer that eliminates half the possible root causes has high information gain.
A Why answer that eliminates one unlikely possibility has low information gain.

**Good investigation = maximizing information gain per question asked.**

---

## What Makes a High-Value Why Question

A Why question is high-value if:
- It can divide the possibility space roughly in half (maximum entropy reduction per question, assuming equal priors — see **[05 Bayesian Reasoning](05_bayesian_reasoning.md)** for the weighted version with non-uniform priors)
- The answer is verifiable with evidence
- It rules in or rules out major branches of the tree

A Why question is low-value if:
- It only eliminates unlikely possibilities
- The answer cannot be verified
- It is leading (presupposes the answer)

---

## The Surprise Factor

Shannon also formalized **surprise** — how unexpected an answer is:

```
Surprise(x) = -log₂ P(x)
```

- A likely outcome has low surprise and carries little new information.
- An unlikely outcome has high surprise and carries a lot of new information.

In investigation terms: **expected answers confirm your model. Surprising answers break it — and breaking your model is where the real insights live.**

---

## Entropy at the Start vs. End

| Phase | Entropy State | Meaning |
|---|---|---|
| Before any Whys | Maximum entropy | Any cause is possible |
| Mid-investigation | Moderate entropy | Some causes ruled out |
| Root cause found | Minimum entropy | One cause identified |
| After resolution | Near-zero entropy | Problem understood and fixed |

---

## The Connection to Evidence

Evidence is information. Every piece of evidence you attach to a Why node is a **entropy-reducing observation**. An investigation with no evidence is pure speculation — entropy never drops. An investigation with strong evidence at every node converges rapidly to the truth.

---

## Key Terms

| Term | Meaning |
|---|---|
| **Entropy** | A measure of uncertainty or unpredictability |
| **Information** | Anything that reduces uncertainty |
| **Information gain** | The reduction in entropy produced by an answer |
| **Surprise** | How unexpected an answer is — unexpected = more information |
| **Bit** | The unit of information — one binary choice |
| **Shannon** | Claude Shannon, founder of information theory (1948) |

---

<p align="center"><strong>← Previous</strong> <strong><a href="03_causal_inference.md">03 — Causal Inference</a></strong> · <strong>Next →</strong> <strong><a href="05_bayesian_reasoning.md">05 — Bayesian Reasoning</a></strong></p>
