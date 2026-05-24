<h1 align="center">The Math Behind the Framework</h1>

> SOMETHING HAPPENED → TO SOMEONE → SOMEWHERE → AT SOME POINT → FOR SOME REASON

**How to Solve Anything (HTSA)** is not just a thinking tool.
It is an **applied graph traversal algorithm for causal inference** — with probability weighting, entropy reduction, and Bayesian evidence updating at every node.

The math is always running underneath. These documents make it visible.

---

## The Ten Mathematical Foundations

| # | Concept | What It Answers |
|---|---|---|
| **[01](01_graph_theory.md)** | **Graph Theory** | What is the structure of an investigation? |
| **[02](02_exponential_problem_space.md)** | **Exponential Problem Space** | Why do investigations feel overwhelming? |
| **[03](03_causal_inference.md)** | **Causal Inference** | How do you prove something caused something else? |
| **[04](04_information_theory.md)** | **Information Theory** | How do you measure investigative progress? |
| **[05](05_bayesian_reasoning.md)** | **Bayesian Reasoning** | How do you weigh competing causes? |
| **[06](06_search_algorithms.md)** | **Search Algorithms** | How do you move through the Why tree? |
| **[07](07_cognitive_biases.md)** | **Cognitive Biases** | What corrupts the investigation? |
| **[08](08_evidence_evaluation.md)** | **Evidence Evaluation** | How do you know which evidence to trust? |
| **[09](09_causation_theory.md)** | **Causation Theory** | How do you classify and quantify actual causes? |
| **[10](10_intervention_theory.md)** | **Intervention Theory** | How do you find the minimal set of fixes? |

---

## How They Connect

Each concept is a layer. They stack on top of each other:

```
┌──────────────────────────────────────────────┐
│         INTERVENTION THEORY                  │  What to fix and in what order
│  Minimal set · Coverage · do(fix(C))         │
├──────────────────────────────────────────────┤
│         CAUSATION THEORY                     │  What actually caused it
│  HP2015 · NESS · PNS · Graded causation     │
├──────────────────────────────────────────────┤
│         EVIDENCE EVALUATION                  │  What counts as proof
│  Tiers · Reliability · Validity · Chain      │
├──────────────────────────────────────────────┤
│         COGNITIVE BIASES                     │  What corrupts the mind
│  Confirmation · Anchoring · Groupthink       │
├──────────────────────────────────────────────┤
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

**Information Theory** — Every *correct* Why answer reduces entropy; a good question is one that maximizes information gain.

**Bayesian Reasoning** — Start with priors, gather evidence, update probabilities, converge on truth.

**Search Algorithms** — DFS goes deep fast, BFS goes wide first, Best-First follows probability — choose based on the problem.

**Cognitive Biases** — The math assumes a rational agent; biases break that assumption at every stage — know them or they win.

**Evidence Evaluation** — Not all evidence is equal; quality determines whether the investigation converges on truth or on a plausible fiction.

**Causation Theory** — Binary counterfactuals break on overdetermination and preemption; HP2015 W-partition + NESS minimal sufficiency + PNS scoring give precise, quantitative actual causation.

**Intervention Theory** — Root cause is formalized as do(fix(C)) → outcome restoration; the minimal intervention set is the smallest set of fixes achieving a coverage threshold.

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
| Investigation reaching the wrong conclusion | Cognitive Biases |
| Closing a Why node as a finding | Evidence Evaluation |
| Classifying preemption and overdetermination | Causation Theory (HP2015) |
| Prioritizing which root causes to fix first | Causation Theory (PNS, normality) |
| Finding the smallest set of fixes that works | Intervention Theory |

---

## Beyond the Math — Formal Proofs

The math explains each concept. The **[Formal Proofs](../proofs/00_index.md)** go further — they formalize HTSA as an algorithm and prove that it terminates, finds all root causes, explores them in optimal order, converges on truth, and measurably advances with every question.

---

## Back to the Framework

**[Return to FRAMEWORK.md](../FRAMEWORK.md)**

---

<p align="center"><strong>Next →</strong> <strong><a href="01_graph_theory.md">01 — Graph Theory</a></strong></p>

<p align="center"><strong><a href="../research/00_index.md">Research Index</a></strong> — academic sources for v2 additions</p>
