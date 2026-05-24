# @htsa/core

TypeScript engine for the [HTSA](../../docs/framework.md) investigation algorithm. Probabilistic root cause analysis: Bayesian updating, causal DAG traversal, and the 5 Ws/5 Whys framework.

Zero runtime dependencies. Strict TypeScript throughout.

## Install

```sh
bun add @htsa/core
# npm install @htsa/core
```

## Quick start

```ts
import {
  Investigation, InvestigationMode, SearchType,
  EvidenceTier, EvidenceDirection, makeEvidence, toMarkdown,
} from "@htsa/core";

const inv = new Investigation({
  title: "API returning 500s since 2:47 AM, EU region only",
  date: "2025-05-24",
  investigator: "you",
  mode: InvestigationMode.Full,
  pruningThreshold: 0.05,
  searchType: SearchType.BestFirst,
});

// Layer 1 — 5 Ws
inv.updateSituation({
  whoAffected: "EU customers",
  what: "500 errors on /checkout",
  whenDuring: "2025-05-24 02:47 UTC",
  where: "EU-WEST-1",
  whySurface: "Payment service timing out",
});

// Layer 2 — Causal chain
const origin = inv.startCausalChain("API returning 500 errors");
const db      = inv.addHypothesis(origin.id, "Database connection pool exhausted");
const cache   = inv.addHypothesis(origin.id, "Cache layer returning stale data");

// Add evidence — Bayesian update fires automatically
const log = makeEvidence("splunk", EvidenceTier.Physical, EvidenceDirection.Supports, {
  description: "Connection pool at 100% 2 min before first 500",
});
inv.addEvidence(db.id, log);

// Mark root cause once depth criteria pass
inv.markRootCause(db.id, {
  actionability: true,
  counterfactualClarity: true,
  systemBoundary: true,
  diminishingReturns: true,
});

// Layer 3 — Resolution
inv.addResolution(db.id, {
  type: "fix",
  change: "Increase pool size from 20 → 100; add circuit breaker",
  owner: "platform-eng",
  deadline: "2025-05-25",
  priorityImpact: 5,
  priorityRecurrence: 4,
  priorityActionability: 5,
});

console.log(toMarkdown(inv));
```

## With an LLM

Point `LLMAdvisor` at any OpenAI-compatible endpoint. It generates hypotheses, evaluates depth criteria, and suggests resolutions automatically.

```ts
import { Investigation, InvestigationMode, SearchType, LLMAdvisor, ChatCompletionsClient } from "@htsa/core";

const client = new ChatCompletionsClient({
  baseUrl: "https://api.openai.com/v1",
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o",
});

const advisor = new LLMAdvisor(client);
const inv = new Investigation({ /* config */ });

inv.startCausalChain("Deployment failed in staging");

const node = inv.nextNode();
const hypotheses = await advisor.suggestHypotheses(inv.graph, inv.situation, node.id);
// → [{ statement, prior_probability, rationale }, ...]
```

Compatible with: OpenAI, Anthropic (via proxy), Groq, Together, Mistral, Ollama, OpenRouter, any `/v1/chat/completions` endpoint.

## Architecture

```
src/
├── types.ts              All enums and interfaces (Node, Evidence, Resolution, ...)
├── graph.ts              InvestigationGraph — the causal DAG
├── investigation.ts      Orchestrator — the public API
├── analysis/
│   ├── probability.ts    Bayesian updating, entropy, pruning
│   ├── search.ts         BestFirst / DFS / BFS search strategies
│   └── bias.ts           7 cognitive bias detectors
├── causation/
│   ├── pns.ts            PNS calculator (Pearl & Tian 2000)
│   ├── counterfactual.ts HP2015 + NESS three-stage test
│   └── intervention.ts   Minimal intervention set solver
├── resolution/
│   ├── engine.ts         Fix / mitigate / accept with counterfactual check
│   └── verification.ts   Verification windows and learning loop
├── llm/
│   ├── client.ts         Provider-agnostic chat completions client
│   ├── prompts.ts        Prompt builders for all 4 layers
│   └── advisor.ts        LLMAdvisor — fills judgment slots
├── serialization.ts      JSON round-trip (toJson / fromJson)
└── export.ts             Markdown export matching FRAMEWORK.md templates
```

## Evidence tiers

| Tier | Type | Weight |
|---|---|---|
| 1 | Physical — logs, sensors, experiments | 1.00 |
| 2 | Observational — direct witness at event time | 0.75 |
| 3 | Inferential — reasoned conclusion from Tier 1/2 | 0.50 |
| 4 | Testimonial — recalled after the fact | 0.25 |

Bayesian likelihood ratios are derived from tier automatically if you don't supply them.

## Depth criteria (required to mark root cause)

All four must be `true`:

- **Actionability** — someone can take a concrete action to fix this
- **Counterfactual Clarity** — "if this hadn't happened, would the problem have occurred?"
- **System Boundary** — this is a system or process cause, not just a person
- **Diminishing Returns** — asking "why" again produces no useful new insight

## Serialization

```ts
import { toJson, fromJson, toMarkdown } from "@htsa/core";

const json = toJson(inv, true);          // pretty JSON string
const restored = fromJson(json);          // full Investigation back
const md = toMarkdown(inv);              // Markdown matching FRAMEWORK.md templates
```

## License

MIT
