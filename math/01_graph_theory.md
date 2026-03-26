# Graph Theory

> The Why tree is not a metaphor. It is a graph.

---

## What It Is

Graph theory is the mathematical study of **nodes** (points) and **edges** (connections between points). It is the foundation of network analysis, routing algorithms, social networks, and — investigation frameworks.

---

## How It Applies Here

Every investigation you run using **How to Solve Anything (HTSA)** is a directed acyclic graph (DAG).

| Framework Element | Graph Term | Definition |
|---|---|---|
| Each Why answer | **Node** | A point in the graph |
| "This caused that" | **Edge** | A directed connection between two nodes |
| Surface → Root | **Direction** | Edges point from effect to cause |
| No loops | **Acyclic** | A cause cannot eventually cause itself |

---

## Visual

```
[Surface Why]
      │
      ▼
  [Why 1a] ──────────────► [Why 1b]
      │                        │
      ▼                        ▼
  [Why 2a]                 [Why 2b]
      │                     /     \
      ▼                    ▼       ▼
[ROOT CAUSE A]      [ROOT CAUSE B] [ROOT CAUSE C]
```

Each box is a node. Each arrow is a directed edge. The whole structure is the graph.

---

## Why This Matters

Graph theory gives the framework **formal properties**:

- **Reachability** — Can you get from the surface Why to a root cause? If not, the investigation has a gap.
- **Convergence** — Two separate branches pointing to the same root cause is called a **convergent node**. It means that root cause is more likely and more impactful.
- **Cycles** — If a Why chain loops back to itself, something is wrong. The investigation is circular. Graph theory catches this.
- **Depth** — The longest path from surface to root tells you the complexity of the problem.

---

## Convergence Is the Key Signal

```
[Why 2a] ──────┐
               ▼
           [ROOT CAUSE X]
               ▲
[Why 2b] ──────┘
```

When two independent branches both lead to the same root cause, that is **not a coincidence**. That root cause is the real target. Graph theory makes this visible.

---

## Key Terms

| Term | Meaning |
|---|---|
| **Node** | A Why answer or root cause |
| **Edge** | A causal link between two nodes |
| **DAG** | Directed Acyclic Graph — direction matters, no loops |
| **Root node** | The starting point (surface Why) |
| **Leaf node** | The end point (root cause) |
| **Convergent node** | A node reached by two or more independent paths |
| **Path** | A sequence of nodes from surface to root cause |
| **Depth** | The number of edges from surface to a given node |

---

**← Previous** [00 — Index](00_index.md) · **Next →** [02 — Exponential Problem Space](02_exponential_problem_space.md)
