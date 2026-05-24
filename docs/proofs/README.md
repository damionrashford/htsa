<h1 align="center">Formal Proofs</h1>

<p align="center"><strong>Seven formal proofs that the root cause analysis algorithm has specific guarantees.</strong><br>The math explains the concepts. The proofs show they hold — termination, completeness, optimality, convergence.</p>

---

## The Proofs

| # | Proof | What It Guarantees |
|:---:|---|---|
| **[01](01_formal_definitions.md)** | **Formal Definitions** | The precise mathematical objects that make up an investigation |
| **[02](02_algorithm.md)** | **The Algorithm** | HTSA expressed as a formal procedure with defined inputs and outputs |
| **[03](03_termination.md)** | **Termination** | The investigation will finish in finite time (with bounded re-entry) |
| **[04](04_completeness.md)** | **Completeness** | No root cause above the confidence threshold will be missed |
| **[05](05_optimality.md)** | **Optimality** | The most likely root cause is found first (greedy-optimal) |
| **[06](06_convergence.md)** | **Convergence** | Beliefs approach the truth as evidence accumulates |
| **[07](07_information_gain.md)** | **Information Gain** | Every well-formed question measurably advances the investigation |

---

## Assumptions

The proofs hold under five assumptions (A1–A5). A1–A3 were implicit in the original formulation. A4 (Faithfulness) and A5 (Causal Sufficiency) are stated explicitly because their violation degrades specific guarantees in causal edge identification and Bayesian convergence.

1. **A1 — Finite Graph**: The problem has causal structure that can be modeled as a finite directed acyclic graph
2. **A2 — Acyclicity**: The investigation graph is acyclic (feedback loops handled via the Feedback Loop Protocol)
3. **A3 — Positive Prior**: The investigator correctly generates child nodes with nonzero prior probability on the true root cause
4. **A4 — Faithfulness**: The graph faithfully represents causal structure — conditional independence corresponds to missing edges
5. **A5 — Causal Sufficiency**: The graph contains all common causes of variables; no hidden confounders

If any assumption is violated, the corresponding guarantee weakens. See **[00_index.md](00_index.md)** for the full discussion of assumptions and limitations.

---

## Reading Order

Start at **[01 — Formal Definitions](01_formal_definitions.md)** and read sequentially. Each proof builds on the previous one. The proofs depend on the **[mathematical foundations](../math/00_index.md)** — read those first if you haven't.

---

<p align="center"><strong><a href="../math/00_index.md">The Math</a></strong>&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;<strong><a href="../framework.md">Framework</a></strong>&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;<strong><a href="../README.md">README</a></strong></p>
