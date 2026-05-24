# HTSA Documentation

**How to Solve Anything** — a universal investigation framework combining the 5 Ws and 5 Whys, backed by eight mathematical foundations and seven formal proofs.

---

## Framework

| Document | Description |
|---|---|
| [framework.md](framework.md) | Complete framework — 4 layers, depth criteria, investigation templates |
| [diagrams.md](diagrams.md) | Algorithm flow diagrams and visual references |

---

## Mathematics

Eight concepts that ground the algorithm in formal theory.

| # | Document | Topic |
|---|---|---|
| 0 | [Index](math/00_index.md) | How the 8 concepts connect |
| 1 | [Graph Theory](math/01_graph_theory.md) | Causal DAG representation |
| 2 | [Exponential Problem Space](math/02_exponential_problem_space.md) | Why search strategies matter |
| 3 | [Causal Inference](math/03_causal_inference.md) | Pearl's do-calculus foundations |
| 4 | [Information Theory](math/04_information_theory.md) | Entropy and information gain |
| 5 | [Bayesian Reasoning](math/05_bayesian_reasoning.md) | Posterior updating on evidence |
| 6 | [Search Algorithms](math/06_search_algorithms.md) | Best-first, DFS, BFS strategies |
| 7 | [Cognitive Biases](math/07_cognitive_biases.md) | The 7 bias patterns HTSA guards against |
| 8 | [Evidence Evaluation](math/08_evidence_evaluation.md) | Tier weights and likelihood ratios |
| 9 | [Causation Theory](math/09_causation_theory.md) | PNS, HP2015, NESS |
| 10 | [Intervention Theory](math/10_intervention_theory.md) | Minimal intervention sets |

---

## Proofs

Seven formal proofs establishing soundness and completeness.

| # | Document | Claim |
|---|---|---|
| 0 | [Index](proofs/00_index.md) | Overview, assumptions, limitations |
| 1 | [Formal Definitions](proofs/01_formal_definitions.md) | Nodes, depth criteria, evidence tiers |
| 2 | [Algorithm](proofs/02_algorithm.md) | HTSA algorithm correctness |
| 3 | [Termination](proofs/03_termination.md) | The algorithm always halts |
| 4 | [Completeness](proofs/04_completeness.md) | All root causes are reachable |
| 5 | [Optimality](proofs/05_optimality.md) | Greedy-optimal (not globally optimal) |
| 6 | [Convergence](proofs/06_convergence.md) | Doob (1949) martingale convergence |
| 7 | [Information Gain](proofs/07_information_gain.md) | Every correct Why answer reduces entropy |

---

## Examples

Domain-specific worked investigations.

| # | Document | Domain |
|---|---|---|
| 0 | [Index](examples/00_index.md) | Annotation key and reading guide |
| 1 | [Engineering Incident](examples/01_engineering_incident.md) | Service outage RCA |
| 2 | [Medical Diagnosis](examples/02_medical_diagnosis.md) | Symptom → cause chain |
| 3 | [Security Breach](examples/03_security_breach.md) | Incident investigation |
| 4 | [Business Bottleneck](examples/04_business_bottleneck.md) | Process failure analysis |
| 5 | [Legal Investigation](examples/05_legal_investigation.md) | Evidence-weighted reasoning |
| 6 | [Personal Decision](examples/06_personal_decision.md) | Applied to everyday choices |

---

## Guides

| Document | Description |
|---|---|
| [guides/cheatsheet.md](guides/cheatsheet.md) | Quick reference — commands, depth criteria, evidence tiers |
| [guides/antipatterns.md](guides/antipatterns.md) | Common failure modes and how to avoid them |
| [guides/contributing.md](guides/contributing.md) | How to contribute to the framework |

---

## Research

Background papers and identified gaps. See [research/00_index.md](research/00_index.md).

---

## Assets

- [assets/algorithm.svg](assets/algorithm.svg) — Algorithm flow diagram
- [assets/diagram.svg](assets/diagram.svg) — Framework overview diagram
