<h1 align="center">Formal Proofs</h1>

> The framework is built from proven components. This section formalizes HTSA as an algorithm and proves its properties.

---

## What This Section Does

Each mathematical foundation in [the math](../math/00_index.md) explains a concept and maps it to the framework. This section goes further — it defines the framework as a formal algorithm and proves that it has specific guarantees.

---

## The Proofs

| # | Proof | What It Guarantees |
|:---:|---|---|
| **[01](01_formal_definitions.md)** | Formal Definitions | The precise mathematical objects that make up an investigation |
| **[02](02_algorithm.md)** | The Algorithm | HTSA expressed as a formal procedure with defined inputs and outputs |
| **[03](03_termination.md)** | Termination | The investigation will finish in finite time |
| **[04](04_completeness.md)** | Completeness | No root cause above the confidence threshold will be missed |
| **[05](05_optimality.md)** | Optimality | The most likely root cause is found first |
| **[06](06_convergence.md)** | Convergence | Beliefs approach the truth as evidence accumulates |
| **[07](07_information_gain.md)** | Information Gain | Every well-formed question measurably advances the investigation |

---

## What the Proofs Assume

The proofs hold under these assumptions:

1. The problem has causal structure that can be modeled as a directed acyclic graph
2. The investigator correctly generates child nodes (asks valid Why questions)
3. Evidence is truthful (not fabricated or systematically misleading)
4. The prior assigns nonzero probability to the true root cause

These are modeling assumptions, not theorems. If any assumption is violated, the corresponding guarantee weakens.

---

## What the Proofs Do NOT Cover

- That all problems fit a DAG model (this is a modeling choice, not a provable claim)
- That cognitive biases won't corrupt execution (see [07 — Cognitive Biases](../math/07_cognitive_biases.md))
- That evidence quality is sufficient (see [08 — Evidence Evaluation](../math/08_evidence_evaluation.md))

The math is sound. The operator is the variable.

---

<p align="center"><strong><a href="../math/00_index.md">← The Math</a></strong> · <strong><a href="../FRAMEWORK.md">Framework</a></strong> · <strong><a href="../README.md">README</a></strong></p>
