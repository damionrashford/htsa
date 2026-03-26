# Worked Examples

> The framework is abstract. Problems are concrete. These examples close the gap.

---

## What These Examples Are

Each worked example traces a real-world problem type through the complete HTSA framework — all four layers, all eight mathematical foundations. They are not summaries. They are full investigations, run from the surface event to verified resolution, with annotations showing which math is operating at each step.

Use them to:

- See how the abstract framework behaves on a real problem
- Understand what each decision point looks like in practice
- Learn to recognize when to branch, when to prune, when to stop
- Train on the gap between "this feels like a root cause" and "this passes the Depth Criteria"

---

## The Examples

| #   | File                                                     | Domain      | Problem                                          | Key Concepts Demonstrated                                                                                                  |
| --- | -------------------------------------------------------- | ----------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| 01  | [01_engineering_incident.md](01_engineering_incident.md) | Engineering | Production service returns 500 errors at 2:47 AM | Branching, convergence, Best-First search, Bayesian updating, attribution bias, evidence evaluation, Layer 4 learning loop |

---

## How to Read a Worked Example

Each example is structured as a live investigation. As you read, you will see:

- **[MATH: concept]** annotations showing which mathematical foundation is operating at each step
- **Probability assignments** updated as evidence arrives
- **Pruned branches** explicitly marked with the evidence that ruled them out
- **Depth Criteria checks** at each proposed root cause
- **A bias callout** wherever a cognitive bias would have derailed the investigation

Reading annotation key:

```
[GRAPH]      — graph theory property in play (convergence, cycle, path)
[EXP]        — exponential problem space (branching factor, pruning)
[CAUSAL]     — causal inference (counterfactual, do-calculus, confounder)
[INFO]       — information theory (entropy drop, information gain, surprise)
[BAYES]      — Bayesian reasoning (prior, update, posterior)
[SEARCH]     — search algorithm (DFS, BFS, Best-First, backtrack)
[BIAS]       — cognitive bias warning
[EVIDENCE]   — evidence evaluation (tier, quality, conflict)
```

---

**↑ Back to Framework** [FRAMEWORK.md](../FRAMEWORK.md)
