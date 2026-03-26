# The Math Behind the Framework

> SOMETHING HAPPENED → TO SOMEONE → SOMEWHERE → AT SOME POINT → FOR SOME REASON

**How to Solve Anything (HTSA)** is not just a thinking tool.
It is an **applied graph traversal algorithm for causal inference** — with probability weighting, entropy reduction, and Bayesian evidence updating at every node.

The math is always running underneath. These documents make it visible.

---

## The Six Mathematical Foundations

| # | Concept | What It Answers |
|---|---|---|
| [01](01_graph_theory.md) | **Graph Theory** | What is the structure of an investigation? |
| [02](02_exponential_problem_space.md) | **Exponential Problem Space** | Why do investigations feel overwhelming? |
| [03](03_causal_inference.md) | **Causal Inference** | How do you prove something caused something else? |
| [04](04_information_theory.md) | **Information Theory** | How do you measure investigative progress? |
| [05](05_bayesian_reasoning.md) | **Bayesian Reasoning** | How do you weigh competing causes? |
| [06](06_search_algorithms.md) | **Search Algorithms** | How do you move through the Why tree? |

---

## How They Connect

Each concept is a layer. They stack on top of each other:

```
┌──────────────────────────────────────────────┐
│         SEARCH ALGORITHMS                    │  How you move
│  DFS · BFS · Best-First · Backtracking       │
├──────────────────────────────────────────────┤
│         BAYESIAN REASONING                   │  How you weigh branches
│  Priors · Evidence · Posterior updates       │
├──────────────────────────────────────────────┤
│         INFORMATION THEORY                   │  How you measure progress
│  Entropy · Information gain · Surprise       │
├──────────────────────────────────────────────┤
│         CAUSAL INFERENCE                     │  How you prove causation
│  DAGs · Confounders · Counterfactuals        │
├──────────────────────────────────────────────┤
│         EXPONENTIAL PROBLEM SPACE            │  Why structure matters
│  b^d · Branching factor · Pruning           │
├──────────────────────────────────────────────┤
│         GRAPH THEORY                         │  The foundation
│  Nodes · Edges · DAG · Convergence          │
└──────────────────────────────────────────────┘
```

---

## One Sentence Each

**Graph Theory** — The Why tree is a directed acyclic graph; convergent nodes reveal the most important root causes.

**Exponential Problem Space** — Every branch doubles your paths; the framework tames `b^d` through evidence and pruning.

**Causal Inference** — Correlation is not causation; every Why claim must pass the counterfactual test.

**Information Theory** — Every Why answer reduces entropy; a good question is one that maximizes information gain.

**Bayesian Reasoning** — Start with priors, gather evidence, update probabilities, converge on truth.

**Search Algorithms** — DFS goes deep fast, BFS goes wide first, Best-First follows probability — choose based on the problem.

---

## How They Map to the Framework

| Framework Action | Math Concept |
|---|---|
| Drawing the Why tree | Graph Theory |
| Feeling lost in a complex problem | Exponential Problem Space |
| Asking "did this actually cause that?" | Causal Inference |
| Each Why answer narrowing the field | Information Theory |
| Assigning likelihood to each branch | Bayesian Reasoning |
| Deciding which branch to follow next | Search Algorithms |
| Ruling out a branch with evidence | Pruning (Graph + Bayes) |
| Two branches pointing to the same cause | Convergence (Graph Theory) |
| Going in circles | Cycle detection (Search) |
| Stopping at the right depth | Entropy minimum (Info Theory) |

---

## Back to the Framework

[Return to FRAMEWORK.md](../FRAMEWORK.md)

---

**Next →** [01 — Graph Theory](01_graph_theory.md)
