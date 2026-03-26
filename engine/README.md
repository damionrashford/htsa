# HTSA Engine

The [How to Solve Anything](../FRAMEWORK.md) framework, codified as a Python library.

## What this is

A graph-based investigation engine that implements the HTSA algorithm from [proofs/02_algorithm.md](../proofs/02_algorithm.md). Two layers work together:

- **Deterministic layer** (the engine) — graph structure, Bayesian math, entropy tracking, pruning, bias detection, constraint enforcement.
- **Judgment layer** (you or an LLM) — generating hypotheses, interpreting evidence, evaluating depth criteria, proposing resolutions.

The engine enforces the rules. You (or the LLM) make the calls.

## Architecture

```
htsa_engine/
├── core/                       Foundational types
│   ├── enums.py                NodeStatus, EvidenceTier, EvidenceDirection, etc.
│   ├── models.py               Evidence, Node, DepthCriteria, Resolution, SituationMap
│   └── graph.py                DAG with typed nodes and edges
├── analysis/                   Computational engines
│   ├── probability.py          Bayesian updating, entropy, pruning
│   ├── search.py               Best-First / DFS / BFS
│   ├── evidence.py             Tier classification, temporal firewall
│   ├── bias.py                 7 cognitive hazard detectors
│   └── loops.py                Feedback loop detection and break points
├── resolution/                 Layers 3 & 4
│   ├── engine.py               Fix/mitigate/accept with counterfactual test
│   └── verification.py         Verification windows and learning loop
├── llm/                        LLM integration (any provider)
│   ├── client.py               Provider-agnostic chat completions client
│   ├── prompts.py              System prompt + judgment prompt templates
│   └── advisor.py              LLMAdvisor — fills judgment slots via LLM
├── investigation.py            Orchestrator tying all modules together
├── serialization.py            JSON round-trip (to_dict / from_dict)
└── export.py                   Markdown rendering matching FRAMEWORK.md templates
```

## Install

```bash
cd engine
pip install -e .
```

## Quick start — with an LLM (easiest)

Point the advisor at any OpenAI-compatible endpoint. One call runs the full 4-layer investigation.

```python
from htsa_engine.llm import LLMAdvisor

# Pick any provider (see "Supported providers" below)
advisor = LLMAdvisor("https://api.openai.com/v1", api_key="sk-...", model="gpt-4o")

# One call — all 4 layers
inv = advisor.run("API returning 500 errors since 2:47 AM, EU region only")

print(f"Root causes: {[n.statement for n in inv.root_causes]}")
print(f"Entropy: {inv.entropy:.3f}")

inv.save("investigation.json")
inv.save_markdown("investigation.md")
```

## Quick start — manual (full control)

Drive every decision yourself. The engine handles the math.

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

## LLM integration

The `llm/` subpackage connects **any LLM** to the engine through the OpenAI chat completions standard. Zero external dependencies — uses `urllib` from the standard library.

### Supported providers

```python
from htsa_engine.llm import LLMAdvisor

# OpenAI
advisor = LLMAdvisor("https://api.openai.com/v1", api_key="sk-...", model="gpt-4o")

# Anthropic via OpenRouter
advisor = LLMAdvisor("https://openrouter.ai/api/v1", api_key="sk-or-...", model="anthropic/claude-sonnet-4-20250514")

# Groq
advisor = LLMAdvisor("https://api.groq.com/openai/v1", api_key="gsk_...", model="llama-3.3-70b-versatile")

# Together
advisor = LLMAdvisor("https://api.together.xyz/v1", api_key="...", model="meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo")

# Mistral
advisor = LLMAdvisor("https://api.mistral.ai/v1", api_key="...", model="mistral-large-latest")

# Local Ollama (no API key needed)
advisor = LLMAdvisor("http://localhost:11434/v1", model="llama3")

# Azure OpenAI
advisor = LLMAdvisor(
    "https://myresource.openai.azure.com/openai/deployments/gpt-4o",
    headers={"api-key": "..."},
)
```

Any endpoint that implements `/v1/chat/completions` works. This covers every major provider.

### Step-by-step (human drives, LLM advises)

Use individual advisor methods when you want control over each step and are providing real evidence.

```python
from htsa_engine import Investigation, Evidence, EvidenceTier, EvidenceDirection, ResolutionType
from htsa_engine.llm import LLMAdvisor

advisor = LLMAdvisor("https://api.openai.com/v1", api_key="sk-...", model="gpt-4o")
inv = Investigation(title="API 500 errors", pruning_threshold=0.05)

# LLM extracts the 5 Ws from your problem description
situation = advisor.analyze_situation("API returning 500 errors since 2:47 AM, EU-west only")
inv.set_situation(**situation)
inv.complete_situation()

# LLM generates hypotheses with priors
origin = inv.start_causal_chain(inv.situation.why_surface)
hypotheses = advisor.generate_hypotheses(inv, origin, count=3)
for h in hypotheses:
    inv.add_hypothesis(origin, h["statement"], h["probability"])

# You provide real evidence — LLM classifies tier and direction
classification = advisor.classify_evidence(
    node_statement="Memory leak in request handler",
    description="Heap dump shows 2.1GB cached, limit is 512MB",
    source="Heap dump analysis",
)
# Returns: {"tier": 1, "direction": "supports", "reasoning": "..."}

# LLM suggests what evidence to look for
suggestions = advisor.suggest_evidence(inv, node_id)
# Returns: [{"what_to_check": "...", "source": "...", "if_found": "...", ...}]

# LLM evaluates depth criteria
criteria = advisor.evaluate_depth_criteria(inv, node_id)
inv.mark_root_cause(node_id, criteria)

# LLM proposes resolution
resolution = advisor.propose_resolution(inv, node_id)
inv.resolve(
    node_id,
    ResolutionType(resolution["type"]),
    change=resolution["change"],
    owner=resolution.get("owner", ""),
    impact=resolution["impact"],
    recurrence=resolution["recurrence"],
    actionability=resolution["actionability"],
)

# LLM evaluates counterfactual
passes = advisor.evaluate_counterfactual(inv, node_id)
inv.test_fix_counterfactual(node_id, passes)
```

### How LLMs connect to the engine

The engine has a clear boundary: **structure vs. judgment**. Every engine method that needs a judgment call maps to an advisor method:

| Engine Method | Judgment Needed | LLM Advisor Method |
|---|---|---|
| `set_situation()` | Decompose problem into 5 Ws | `analyze_situation()` |
| `add_hypothesis()` | Generate Why + assign prior | `generate_hypotheses()` |
| `add_evidence()` | Classify tier and direction | `classify_evidence()` |
| `mark_root_cause()` | Evaluate 4 depth criteria | `evaluate_depth_criteria()` |
| `resolve()` | Propose fix/mitigate/accept | `propose_resolution()` |
| `test_fix_counterfactual()` | Would fix prevent recurrence? | `evaluate_counterfactual()` |
| `add_verification()` | Define verification window | `propose_verification()` |

The engine handles all the math (Bayesian updates, entropy, normalization, pruning). The LLM handles all the reasoning (what caused what, what evidence means, what to fix). Neither can do the other's job.

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
| `llm/` | `client.py` | Provider-agnostic chat completions client (stdlib only) |
| `llm/` | `prompts.py` | System prompt + prompt builders for each judgment type |
| `llm/` | `advisor.py` | LLMAdvisor — fills judgment slots, drives auto-investigation |
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

- **Generate Why answers.** The engine structures and constrains — you or the LLM provide the content.
- **Interpret evidence.** You classify tier and direction; the engine calculates the math.
- **Evaluate depth criteria.** You answer the four questions; the engine enforces that you answered them.

That boundary — engine provides structure, you provide judgment — is the core design decision. The `llm/` subpackage automates the judgment side for any provider that speaks the chat completions protocol.
