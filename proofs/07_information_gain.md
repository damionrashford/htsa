<h1 align="center">Proof of Information Gain</h1>

> Every well-formed Why question measurably advances the investigation.

---

## Theorem

**Every Why question that produces a non-trivial partition of the hypothesis space strictly reduces the entropy of the investigation.**

---

## Setup

Given:
- H_before = entropy of the investigation before asking a Why question
- The question partitions the current hypothesis set into k ≥ 2 non-empty groups
- At least two groups have different probability distributions

---

## Proof

**Step 1: Define entropy before the question.**

Let the current set of active hypotheses (leaf nodes) be {h₁, h₂, ..., hₘ} with probabilities P(hᵢ). The entropy is:

```
H_before = -Σᵢ P(hᵢ) × log₂ P(hᵢ)
```

**Step 2: The question partitions the hypothesis space.**

A Why question at node v generates children {c₁, c₂, ..., cₖ}. Each child represents a subset of the hypothesis space — a group of scenarios consistent with that answer.

After observing which answer is correct (say cⱼ), the probabilities update:

```
P(hᵢ | cⱼ) = P(cⱼ | hᵢ) × P(hᵢ) / P(cⱼ)
```

**Step 3: Define entropy after the question.**

The expected entropy after asking the question is:

```
H_after = Σⱼ P(cⱼ) × H(hypotheses | cⱼ)

where H(hypotheses | cⱼ) = -Σᵢ P(hᵢ | cⱼ) × log₂ P(hᵢ | cⱼ)
```

**Step 4: Apply the information theory inequality.**

By the property of conditional entropy:

```
H(X | Y) ≤ H(X)

with equality if and only if X and Y are independent.
```

Therefore:

```
H_after = H(hypotheses | question answer) ≤ H(hypotheses) = H_before
```

**Step 5: Strict inequality for non-trivial questions.**

Equality holds only when the question answer is independent of the hypotheses — meaning the answer tells you nothing about which hypothesis is true. This is a trivial question.

A **well-formed Why question** is one where the answer is correlated with the hypotheses — different root causes would produce different answers. For any such question:

```
H_after < H_before
```

The entropy strictly decreases. ∎

---

## Information Gain

The information gain of a question is the difference:

```
IG(question) = H_before - H_after ≥ 0

with IG > 0 for any non-trivial question.
```

This quantity measures how much investigative progress a single question produces, in bits.

---

## Optimal Questions

The question that maximizes information gain is the one that produces the most even partition of the hypothesis space:

```
IG is maximized when P(c₁) = P(c₂) = ... = P(cₖ) = 1/k
```

This is a binary search in probability space. A question that splits hypotheses into two equally likely groups reduces entropy by exactly 1 bit — the theoretical maximum per binary question.

In investigation terms: **the best Why question is the one whose answer you are most uncertain about.** If you already know the answer before asking, the question carries zero information.

---

## Connection to the Framework

This proof formalizes a core rule of the framework: **"Evidence at every node."**

A Why answer without evidence is a guess — it does not partition the hypothesis space because you cannot verify which side of the partition you are on. Without verification, H_after = H_before. No progress is made.

Evidence is what makes the entropy reduction real. Without it, you are just rearranging uncertainty, not reducing it.

---

## The Counterfactual Test as Information Gain

The counterfactual test (step 7 of the algorithm) is itself an information-theoretic operation:

```
Counterfactual test: "If this cause were false, would the problem still have occurred?"

  IF answer = "yes"  → P(cause | problem) drops sharply → high information gain
  IF answer = "no"   → P(cause | problem) stays high → moderate information gain
  IF answer = "unknown" → no update → zero information gain
```

A counterfactual test that produces a clear yes/no answer always has positive information gain. An ambiguous answer has near-zero information gain — which is why the framework demands clarity at every node.

---

<p align="center"><strong>← Previous</strong> <strong><a href="06_convergence.md">06 — Convergence</a></strong> · <strong><a href="00_index.md">Back to Index</a></strong></p>
