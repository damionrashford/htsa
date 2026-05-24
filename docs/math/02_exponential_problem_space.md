<h1 align="center">Exponential Problem Space</h1>

> Investigations feel overwhelming because the problem space grows exponentially. This is not a feeling. It is math.

---

## What It Is

When a problem branches — meaning a Why has more than one answer — the number of possible paths to a root cause multiplies at every level. This growth is **exponential**.

---

## The Math

If every Why produces **2 branches**, and you go **5 levels deep**:

```
Level 1:   2 nodes
Level 2:   4 nodes
Level 3:   8 nodes
Level 4:  16 nodes
Level 5:  32 nodes
```

**Formula:**

```
Leaf nodes (possible root causes) = b^d
                               2^5 = 32

Total nodes in the tree = (b^(d+1) - 1) / (b - 1)
                        = (2^6 - 1) / 1 = 63
```

The cognitive burden is the *total* node count — 63 things to track, not just the 32 endpoints. This is why structure matters.

If each Why branches into **3**:
```
3^5 = 243 possible root causes
Total nodes = (3^6 - 1) / 2 = 364
```

---

## Why Investigations Feel Overwhelming

Without structure, your brain is attempting to hold an exponential tree in working memory. Human working memory holds roughly **4 items** (Cowan, 2001 — a refinement of Miller's 1956 estimate of 7±2). An unstructured investigation can have dozens or hundreds of paths.

The framework solves this by:
1. **Fixing the entry point** — the 5 Ws give you one defined starting node
2. **Forcing sequential traversal** — you follow one path at a time
3. **Making branches explicit** — you see the tree instead of feeling lost in it

---

## Branching Factor

The average number of branches per node is called the **branching factor (b)**.

| Branching Factor | Problem Type |
|---|---|
| b = 1 | Simple, linear, single-cause |
| b = 2–3 | Moderate complexity, multiple contributing factors |
| b = 4+ | Systemic, deeply interconnected problems |

The higher the branching factor, the more critical the framework becomes.

---

## The Depth Decision

You control **how deep** you go. Stopping too early means you have a symptom, not a root cause. Going too deep means diminishing returns.

```
Depth 1–2:  Symptoms and immediate causes
Depth 3–4:  Contributing causes
Depth 5+:   Root causes and systemic failures
```

The right depth is when you reach something **you can actually change**.

---

## Pruning

Not every branch needs to be followed to the end. When evidence strongly rules out a branch, you **prune** it — cut it from the tree. This is how the exponential space becomes manageable.

```
[Why 1a] — evidence rules this out → PRUNED
[Why 1b] — evidence supports this → CONTINUE
```

Pruning is what separates a good investigator from a thorough but lost one.

---

## Key Formula

```
Total possible paths = b^d

b = branching factor (average branches per Why)
d = depth (number of Why levels)
```

The framework's job is to reduce **b** through evidence and reduce **d** by stopping at the real root cause.

---

<p align="center"><strong>← Previous</strong> <strong><a href="01_graph_theory.md">01 — Graph Theory</a></strong> · <strong>Next →</strong> <strong><a href="03_causal_inference.md">03 — Causal Inference</a></strong></p>
