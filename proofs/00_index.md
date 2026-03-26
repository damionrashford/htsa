<h1 align="center">Formal Proofs</h1>

> The framework is built from proven components. This section formalizes HTSA as an algorithm and proves its properties.

---

## What This Section Does

The **[eight mathematical foundations](../math/00_index.md)** explain the concepts. This section goes further — it defines HTSA as a formal algorithm and proves that it has specific guarantees. The proofs build directly on the math: every theorem references the mathematical foundation it depends on.

---

## The Proofs

| # | Proof | What It Guarantees |
|:---:|---|---|
| **[01](01_formal_definitions.md)** | Formal Definitions | The precise mathematical objects that make up an investigation |
| **[02](02_algorithm.md)** | The Algorithm | HTSA expressed as a formal procedure with defined inputs and outputs |
| **[03](03_termination.md)** | Termination | The investigation will finish in finite time (with bounded re-entry) |
| **[04](04_completeness.md)** | Completeness | No root cause above the confidence threshold will be missed |
| **[05](05_optimality.md)** | Optimality | The most likely root cause is found first (greedy-optimal) |
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

- That all problems fit a DAG model (this is a modeling choice, not a provable claim — see [01 Graph Theory: Feedback Loops](../math/01_graph_theory.md))
- That cognitive biases won't corrupt execution (see [07 — Cognitive Biases](../math/07_cognitive_biases.md))
- That evidence quality is sufficient (see [08 — Evidence Evaluation](../math/08_evidence_evaluation.md))
- That the investigator will generate the correct child nodes — unknown unknowns (causes no one thinks to ask about) cannot be found by any systematic method
- That the framework is the right lens — some problems are better served by correlation (prediction), constraints (optimization), narrative (meaning-making), or emergence (complexity theory)
- That evidence is not adversarial — in security, fraud, and legal investigations, evidence may be fabricated, hidden, or manipulated. The convergence proof assumes truthful evidence; adversarial contexts can cause convergence on a false cause planted by the adversary

The math is sound given correct inputs. The operator, the modeling choice, and the evidence environment are the variables.

---

<p align="center"><strong><a href="../math/08_evidence_evaluation.md">← 08 Evidence Evaluation</a></strong> · <strong><a href="../math/00_index.md">The Math</a></strong> · <strong><a href="../FRAMEWORK.md">Framework</a></strong> · <strong><a href="../README.md">README</a></strong></p>
