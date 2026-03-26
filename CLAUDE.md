# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

HTSA (How to Solve Anything) formalizes a universal investigation framework combining the 5 Ws and 5 Whys, backed by eight mathematical foundations and seven formal proofs. The repository contains framework documentation (Markdown) and a Python engine that codifies the algorithm with provider-agnostic LLM integration.

## Repository Structure

```
FRAMEWORK.md           ← The complete framework (4 layers, depth criteria, templates)
math/
  00_index.md          ← How the 8 math concepts connect
  01-08_*.md           ← Graph theory → exponential space → causal inference →
                         information theory → Bayesian reasoning → search algorithms →
                         cognitive biases → evidence evaluation
proofs/
  00_index.md          ← Proof overview, assumptions, and limitations
  01-07_*.md           ← Formal definitions → algorithm → termination →
                         completeness → optimality → convergence → information gain
examples/
  00_index.md          ← Worked examples with annotation key
  01_*.md              ← Domain-specific walkthroughs
engine/                ← Python implementation of the HTSA algorithm
  htsa_engine/
    __init__.py        ← Public API re-exports
    investigation.py   ← Main orchestrator (Investigation class)
    serialization.py   ← JSON round-trip (to_dict / from_dict)
    export.py          ← Markdown rendering matching FRAMEWORK.md templates
    core/              ← Foundational types (enums, models, graph DAG)
    analysis/          ← Computational engines (probability, search, bias, evidence, loops)
    resolution/        ← Layers 3 & 4 (resolution engine, verification tracker)
    llm/               ← LLM integration (any OpenAI-compatible provider, stdlib only)
      client.py        ← Provider-agnostic /v1/chat/completions HTTP client
      prompts.py       ← System prompt + judgment prompt templates
      advisor.py       ← LLMAdvisor — fills judgment slots, auto-investigation via run()
  pyproject.toml       ← Package config, Python 3.11+, zero dependencies
  README.md            ← Engine docs, LLM integration guide, quick start
assets/                ← SVG diagrams referenced by DIAGRAMS.md
DIAGRAMS.md            ← Visual references for the framework and algorithm
```

## Reading Order and Document Chain

Documents form a circular chain. Each file has prev/next navigation links at the bottom. The intended reading order is:

FRAMEWORK.md → math/00-08 → proofs/00-07 → back to FRAMEWORK.md

## Critical Cross-File Invariants

When editing any file, these definitions must stay consistent across all documents that reference them:

- **Four Layers**: Situation Map (Layer 1), Causal Chain (Layer 2), Resolution (Layer 3), Verification & Learning (Layer 4) — used in FRAMEWORK.md, proofs/02_algorithm.md
- **Evidence tiers (4 tiers)**: Tier 1 physical/instrumental, Tier 2 observational, Tier 3 inferential, Tier 4 testimonial — defined in math/08, referenced in proofs/01
- **Depth criteria (4 tests)**: Actionability, Counterfactual Clarity, System Boundary, Diminishing Returns — defined in FRAMEWORK.md, formalized in proofs/01 Definition 4, used in proofs/02 DEPTH_CRITERIA subroutine
- **Pruning thresholds**: 5% general, ≤1% safety-critical, 10% exploratory — must match across math/05, proofs/01, and FRAMEWORK.md templates
- **Algorithm bounds**: MAX_REOPEN=3, MAX_VERIFY=3 with ESCALATE path — proofs/02 and proofs/03 must agree
- **Optimality qualifier**: "greedy-optimal, not globally optimal" — proofs/05 and proofs/00_index
- **Convergence theorem**: Doob (1949), NOT Bernstein-von Mises — proofs/06
- **Information theory qualifier**: "Every *correct* Why answer" — math/00_index and math/04

## Markdown Conventions

- Titles use `<h1 align="center">` HTML tags, not `#`
- Tables use `<div align="center">` wrappers in README.md; plain markdown elsewhere
- Navigation footers at the bottom of every math/ and proofs/ file: `← Previous · Next →`
- Bold links in references: `**[display text](path)**`
- Math notation uses code blocks, not LaTeX
- No emoji in content files (README.md is the exception)

## Style Rules

- Every sentence earns its place — no filler
- Match existing tone: direct, precise, no hedging unless formally qualified
- Causal claims require counterfactual framing
- New mathematical content requires sources or formal justification
- When adding limitations or caveats, state them as explicit scope boundaries, not apologies

## Templates

FRAMEWORK.md contains two investigation templates (Linear and Branching) that must include: MODE field, PRUNING THRESHOLD, probability per node, Finding/Hypothesis status, verification window, and depth criteria checkboxes. The Branching template additionally requires: pruned branches list, feedback loops field, root cause interactions, and priority scale notation.
