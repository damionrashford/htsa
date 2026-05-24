<h1 align="center">Search Algorithms</h1>

> How you walk the Why tree is not arbitrary. It is a decision with consequences.

---

## What It Is

Search algorithms are strategies for **systematically traversing a graph or tree** to find a target node. In computer science, these are foundational. In investigation, you are running one every time you decide which Why branch to follow next — whether you know it or not.

The two core strategies are **Depth First Search (DFS)** and **Breadth First Search (BFS)**.

---

## Depth First Search (DFS)

Go as deep as possible down one branch before exploring others.

```
[Surface Why]
      │
      ▼
  [Why 1a]  ← follow this first
      │
      ▼
  [Why 2a]  ← keep going
      │
      ▼
  [Why 3a]  ← keep going
      │
      ▼
[ROOT CAUSE A]  ← found something

  then backtrack and try...

  [Why 1b]
      │
      ▼
  [Why 2b]
      ...
```

**Best for:** Simple problems, linear cause chains, when you have a strong hypothesis about which branch is most likely.

**Risk:** You can go very deep down the wrong branch before realizing it was wrong.

---

## Breadth First Search (BFS)

Explore all branches at the same depth before going deeper.

```
[Surface Why]
      │
      ├──► [Why 1a]   ← explore all Why 1s first
      ├──► [Why 1b]   ←
      └──► [Why 1c]   ←

      then go one level deeper...

      [Why 1a] ──► [Why 2a]
      [Why 1b] ──► [Why 2b]
      [Why 1c] ──► [Why 2c]

      and so on...
```

**Best for:** Complex, multi-cause problems, when you don't know which branch is most likely, when multiple root causes are expected.

**Risk:** Time-consuming on large trees. You may surface many partial answers before reaching any root cause.

---

## Comparison

| Property | DFS | BFS |
|---|---|---|
| Strategy | Go deep fast | Go wide first |
| Memory use | Low | High (holds all frontier nodes) |
| Finds root cause | Fast if branch is correct | Slower but more complete |
| Risk | Wrong branch wastes time | Shallow answers pile up |
| Best for | Linear, hypothesis-driven | Systemic, multi-cause |
| Investigation analogy | Follow your best lead | Gather all first-level evidence before drilling |

---

## Informed Search (Best-First)

A third option: combine BFS and DFS using **priority**. At each step, follow the branch with the **highest probability** (from Bayesian reasoning) or the **highest information gain** (from information theory).

```
[Surface Why]
      │
      ├──► [Why 1a]  P = 0.65  ← follow this first (highest probability)
      ├──► [Why 1b]  P = 0.25
      └──► [Why 1c]  P = 0.10
```

This is called **Best-First Search** (greedy). It picks the most promising node based solely on a heuristic — in this case, Bayesian probability or information gain. It is the most efficient strategy when you have evidence to assign probabilities.

**A\* Search** extends Best-First by adding **cost-so-far** to the heuristic. In investigation terms: A\* accounts for both how likely a root cause is *and* how much time and resources you have already spent on that path. A high-probability branch that has consumed days of investigation may be deprioritized in favor of a moderately-probable branch that can be resolved quickly. A\* is optimal when you have both probability estimates and resource constraints.

---

## When to Use Which Strategy

| Condition | Use | Why |
|---|---|---|
| You have a strong hypothesis with evidence | **Best-First / DFS** | Follow the high-probability path directly |
| Multiple plausible causes, no clear leader | **BFS** | Gather first-level evidence to distinguish before committing |
| Active crisis, time-constrained | **DFS** | Find one actionable root cause fast; completeness can wait |
| High stakes, must not miss any cause | **BFS with low θ** | Systematic coverage over speed |
| Strong priors from base rates | **Best-First** | Probability estimates are reliable enough to guide selection |
| No base rates, unfamiliar domain | **BFS** | Don't trust your heuristic when you have no data |

**Switching strategies mid-investigation:**
- If DFS hits two dead ends in a row → switch to BFS at the last branch point with unexplored children
- If BFS at depth 1 produces a clear probability leader (P > 0.6) → switch to DFS on that branch
- If Best-First is spreading effort across too many branches without closing any → switch to DFS on the highest-probability open branch

---

## Backtracking

When a branch hits a dead end — the Why chain doesn't lead anywhere, or evidence rules it out — you **backtrack**: return to the last branch point and try a different path.

Backtracking is not failure. It is the correct response to a pruned branch. The worst investigators don't backtrack — they force a conclusion at the end of a dead-end branch.

---

## The Cycle Problem

Graphs can contain **cycles** — paths that loop back to a node you've already visited. In an investigation, a cycle looks like:

```
Why 3: "The process failed because the config was wrong"
Why 4: "The config was wrong because the process failed"
```

This may be circular reasoning — or it may be a genuine feedback loop. Both DFS and BFS detect cycles by tracking visited nodes. If you find yourself repeating a Why you've already answered, see the **[Feedback Loops protocol in 01 Graph Theory](01_graph_theory.md)** for how to handle it: break the cycle at the intervention point rather than treating it as an error.

---

## Connecting to the Framework

| Investigation Action | Algorithm Term |
|---|---|
| Following the most likely branch | Best-First / A\* |
| Drilling one Why chain to the end | Depth First Search |
| Checking all first-level causes before going deeper | Breadth First Search |
| Ruling out a branch due to evidence | Pruning |
| Returning to a prior branch point | Backtracking |
| Repeating the same Why answer | Cycle detection |

---

## Key Terms

| Term | Meaning |
|---|---|
| **DFS** | Depth First Search — go deep before going wide |
| **BFS** | Breadth First Search — go wide before going deep |
| **Best-First** | Follow the highest-priority node at each step |
| **A\*** | Famous best-first algorithm using cost + heuristic |
| **Backtracking** | Returning to a branch point after a dead end |
| **Pruning** | Cutting branches ruled out by evidence |
| **Cycle** | A path that loops back to a previously visited node |
| **Frontier** | The set of nodes not yet explored |

---

<p align="center"><strong>← Previous</strong> <strong><a href="05_bayesian_reasoning.md">05 — Bayesian Reasoning</a></strong> · <strong>Next →</strong> <strong><a href="07_cognitive_biases.md">07 — Cognitive Biases</a></strong></p>
