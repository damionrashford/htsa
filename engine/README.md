# HTSA Engine

The [How to Solve Anything](../FRAMEWORK.md) framework, codified as a Python library.

## What this is

A graph-based investigation engine that implements the HTSA algorithm from [proofs/02_algorithm.md](../proofs/02_algorithm.md). It provides the **deterministic layer** — the math, constraints, and structure — while leaving the **judgment layer** (the actual Why answers, evidence interpretation, depth criteria evaluation) to a human or LLM interface.

## Architecture

```
Investigation (orchestrator)
├── core/                    Foundational types
│   ├── enums.py             NodeStatus, EvidenceTier, EvidenceDirection, etc.
│   ├── models.py            Evidence, Node, DepthCriteria, Resolution, SituationMap
│   └── graph.py             DAG with typed nodes and edges
├── analysis/                Computational engines
│   ├── probability.py       Bayesian updating, entropy, pruning
│   ├── search.py            Best-First / DFS / BFS
│   ├── evidence.py          Tier classification, temporal firewall
│   ├── bias.py              7 cognitive hazard detectors
│   └── loops.py             Feedback loop detection and break points
├── resolution/              Layers 3 & 4
│   ├── engine.py            Fix/mitigate/accept with counterfactual test
│   └── verification.py      Verification windows and learning loop
├── serialization.py         JSON round-trip (to_dict / from_dict)
└── export.py                Markdown rendering matching FRAMEWORK.md templates
```

## Install

```bash
cd engine
pip install -e .
```

## Quick start

```python
from htsa_engine import (
    Investigation, Evidence, EvidenceTier, EvidenceDirection,
    DepthCriteria, ResolutionType, VerificationWindowType,
)

# Create an investigation
inv = Investigation(title="API returning 500 errors", pruning_threshold=0.05)

# Layer 1 — Situation Map (5 Ws)
inv.set_situation(
    who_affected="All users in EU region",
    who_detector="Monitoring system",
    what="API returning 500 errors on /checkout endpoint",
    when_before="Normal operation until 2:47 AM",
    when_during="Errors began at 2:47 AM, 100% failure rate by 2:52 AM",
    where="/checkout endpoint, EU-west region only",
    why_surface="Server errors under load",
)
inv.complete_situation()

# Layer 2 — Causal Chain
origin = inv.start_causal_chain("Server errors under load")

# Add hypotheses with priors
branch_a = inv.add_hypothesis(origin, "Memory leak in request handler", probability=0.40)
branch_b = inv.add_hypothesis(origin, "Database connection pool exhausted", probability=0.35)
branch_c = inv.add_hypothesis(origin, "Bad deploy at 2:30 AM", probability=0.25)

# Add evidence and update probabilities
inv.add_evidence(branch_c, Evidence(
    source="Deploy log",
    tier=EvidenceTier.PHYSICAL,
    timestamp="2026-01-15T02:30:00Z",
    direction=EvidenceDirection.CONTRADICTS,
    description="No deploy occurred in the last 24 hours",
))

# Check pruning
inv.check_pruning(branch_c, reason="No deploy occurred")

# Continue deeper on branch_a...
cause_a1 = inv.add_hypothesis(branch_a, "Unbounded query results cached in memory")
inv.add_evidence(cause_a1, Evidence(
    source="Heap dump analysis",
    tier=EvidenceTier.PHYSICAL,
    timestamp="2026-01-15T03:15:00Z",
    direction=EvidenceDirection.SUPPORTS,
    description="Heap shows 2.1GB of cached query results, limit is 512MB",
))

# Mark root cause (all depth criteria must pass)
alerts = inv.mark_root_cause(cause_a1, DepthCriteria(
    actionability=True,
    counterfactual_clarity=True,
    system_boundary=True,
    diminishing_returns=True,
))

# Layer 3 — Resolution
inv.resolve(
    cause_a1,
    ResolutionType.FIX,
    change="Add result-set size limit to query cache (max 1000 rows)",
    owner="Backend team",
    deadline="2026-01-22",
    impact=5, recurrence=4, actionability=5,
)

# Test the fix counterfactual
inv.test_fix_counterfactual(cause_a1, passes=True)

# Layer 4 — Verification
inv.add_verification(
    cause_a1,
    VerificationWindowType.EVENT_DRIVEN,
    window_description="Wait for next traffic spike above 10K concurrent",
    metric="Zero 500 errors during peak load",
)

# Check investigation state
print(f"Entropy: {inv.entropy:.3f}")
print(f"Root causes: {[n.statement for n in inv.root_causes]}")
print(f"Bias alerts: {inv.check_biases()}")

# Save and reload
inv.save("investigation.json")
loaded = Investigation.load("investigation.json")

# Export as markdown
inv.save_markdown("investigation.md")
```

## Package structure

| Subpackage | Module | What it does |
|---|---|---|
| `core/` | `enums.py` | All enumerations (zero dependencies) |
| `core/` | `models.py` | Evidence, Node, DepthCriteria, Resolution, SituationMap |
| `core/` | `graph.py` | DAG structure, convergence detection |
| `analysis/` | `probability.py` | Bayesian updates, entropy tracking, pruning with recovery |
| `analysis/` | `search.py` | Best-First (live priority), DFS (stack), BFS (queue) |
| `analysis/` | `bias.py` | 7 cognitive hazard detectors (warning + blocking alerts) |
| `analysis/` | `evidence.py` | Tier classification, temporal firewall, conflict detection |
| `analysis/` | `loops.py` | Feedback loop registration and break point analysis |
| `resolution/` | `engine.py` | Fix/mitigate/accept, counterfactual test, priority scoring |
| `resolution/` | `verification.py` | Verification windows, learning loop |
| — | `investigation.py` | Orchestrator tying all modules together |
| — | `serialization.py` | JSON round-trip for full investigation state |
| — | `export.py` | Markdown rendering matching FRAMEWORK.md templates |

## What the engine enforces

- **No skipping Layer 1.** Anchoring bias alert fires if hypotheses are added before the situation map is complete.
- **Evidence at every node.** Nodes without Tier 1/2 evidence stay as Hypotheses, not Findings.
- **Probability normalization.** Sibling probabilities always sum to 1.0 after every Bayesian update.
- **Pruning with recovery.** Pruned branches are recorded, not deleted. They can be restored if new evidence raises their probability.
- **Depth criteria gate.** A node cannot be marked as a root cause unless it is a leaf, has evidence, and all four depth criteria pass.
- **Counterfactual test on fixes.** Resolutions that fail the counterfactual test reopen the node (up to MAX_REOPEN=3, then escalate).
- **Bias detection.** Seven pattern-based checks run against the investigation state.
- **Rapid mode.** Forces DFS search and raises pruning threshold to 0.20 for time-constrained investigations.

## What the engine does NOT do

- **Generate Why answers.** The engine structures and constrains — a human or LLM provides the content.
- **Interpret evidence.** You classify tier and direction; the engine calculates the math.
- **Evaluate depth criteria.** You answer the four questions; the engine enforces that you answered them.

That boundary — engine provides structure, human/LLM provides judgment — is the core design decision.
