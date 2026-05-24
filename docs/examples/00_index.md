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
| 02  | [02_medical_diagnosis.md](02_medical_diagnosis.md)       | Medicine    | 58-year-old with sudden chest pain in the ER     | DFS under time pressure, safety-critical θ, base-rate priors, evidence tiers in clinical context, attribution bias         |
| 03  | [03_security_breach.md](03_security_breach.md)           | Security    | Customer PII exfiltrated from SaaS database      | BFS for completeness, adversarial evidence, temporal firewall protocol, AND-causation, attribution bias                    |
| 04  | [04_business_bottleneck.md](04_business_bottleneck.md)   | Business    | Sales cycle doubled from 45 to 90 days           | Groupthink, investigation-as-confounder, feedback loop protocol, value-separation principle, search strategy switching     |
| 05  | [05_legal_investigation.md](05_legal_investigation.md)   | Legal       | Scaffolding collapse with multiple liable parties | BFS for multi-party liability, overdetermination (OR-causation), two-stage counterfactual, conflicting evidence, chain of custody |
| 06  | [06_personal_decision.md](06_personal_decision.md)       | Personal    | Software engineer investigating their own burnout | Confirmation bias, anchoring defense, feedback loop, evidence tiers for self-investigation, DFS-to-BFS switch              |

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

**↑ Back to Framework** [FRAMEWORK.md](../framework.md)
