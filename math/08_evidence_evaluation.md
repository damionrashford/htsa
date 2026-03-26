<h1 align="center">Evidence Evaluation</h1>

> An assertion without evidence is a guess. But not all evidence is equal. Knowing the difference is what separates a strong investigation from a lucky one.

---

## What It Is

Evidence evaluation is the discipline of assessing the quality, reliability, and weight of information before accepting it as proof of a causal claim. Rule 2 of the framework states: "evidence at every node." This document defines what counts as evidence and how to evaluate it.

The framework's Bayesian engine runs on evidence. Garbage evidence produces garbage posteriors. The quality of the evidence determines whether the investigation converges on the truth or on a plausible fiction.

---

## The Evidence Hierarchy

Not all evidence is created equal. Four tiers, from strongest to weakest:

```
┌─────────────────────────────────────────────┐
│  TIER 1 — Physical / Instrumental           │
│  Direct measurement, logs, sensor data,     │
│  recordings, controlled experiments (A/B    │
│  tests). The event left a measurable        │
│  record.                                    │
├─────────────────────────────────────────────┤
│  TIER 2 — Observational                     │
│  What a witness directly saw, heard, or     │
│  experienced at the time of the event.      │
├─────────────────────────────────────────────┤
│  TIER 3 — Inferential                       │
│  What can be reasonably concluded from      │
│  Tier 1 or Tier 2 evidence, given a         │
│  stated causal mechanism. Includes          │
│  regression analysis and statistical        │
│  modeling (model-dependent results).        │
├─────────────────────────────────────────────┤
│  TIER 4 — Testimonial / Reconstructive      │
│  What someone believes happened, recalled   │
│  after the fact. Memory degrades.           │
└─────────────────────────────────────────────┘
```

**The rule:** A Why node supported only by Tier 4 evidence is a hypothesis, not a finding. Work up the hierarchy — seek Tier 1 or Tier 2 evidence before closing the node.

---

## Four Quality Dimensions

Every piece of evidence should be evaluated on four dimensions:

### 1. Reliability
Does this source consistently produce accurate observations?

```
High reliability:  Timestamped system logs, calibrated instruments
Low reliability:   A single observer's memory from six months ago
```

Ask: "If we checked this source again, would we get the same answer?"

### 2. Validity
Does this evidence actually measure what we think it measures?

```
Valid:    CPU utilization spiking at the time of the failure
Invalid:  CPU utilization spiking at an unrelated time, cited as evidence of the failure
```

Ask: "Does this evidence speak to the specific causal claim we are making — or just something nearby?"

### 3. Completeness
Is this the full picture, or a fragment?

```
Complete:   The full error log from the relevant window
Incomplete: One error message extracted from the log, context removed
```

Ask: "What would the complete evidence set look like, and do we have it?"

### 4. Timeliness
Was this evidence gathered close to the event? Evidence degrades.

```
Timely:     Log data captured automatically at time of incident
Untimely:   Interview conducted 90 days after the incident
```

Ask: "Could the passage of time have changed what this evidence shows?"

---

## Evidence Independence

This is the most commonly misunderstood principle in multi-source investigation.

**The problem:** Two pieces of evidence that seem to corroborate each other may not be independent. If they came from the same source, or if one caused the other, they count as one data point — not two.

```
Example:

Evidence A:  Engineer reports the config was wrong.
Evidence B:  The incident report (written by the same engineer) says the config was wrong.

These are not two independent pieces of evidence.
They are one piece of evidence recorded twice.

Bayesian update for two independent pieces is multiplicative.
Bayesian update for two correlated pieces is not.
```

**The rule:** Before treating two pieces of evidence as independent corroboration, ask: "Could one of these have caused or influenced the other?" If yes, treat them as a single data point.

---

## Conflicting Evidence

When two pieces of evidence point in opposite directions, do not average them or ignore one. Conflicting evidence is one of the most valuable signals in an investigation.

**The conflicting evidence protocol:**

```
Step 1: Verify each piece independently
        → Is each piece reliable, valid, complete, and timely?

Step 2: Check for a third variable
        → Is there a confounder that would cause both pieces
          to appear conflicting even though both are true?

Step 3: Identify the mechanism that would make each true
        → If A is true, what must the causal chain look like?
        → If B is true, what must the causal chain look like?
        → Are both mechanisms plausible?

Step 4: Design a test that distinguishes them
        → What observation would be possible if A is true
          but impossible if B is true?
```

Conflicting evidence usually means the investigation model is incomplete. The conflict is the clue.

---

## The Minimum Evidence Standard

For a Why node to be closed as a finding (not a hypothesis), it must meet this standard:

```
1. At least one piece of Tier 1 or Tier 2 evidence supports the claim
2. The evidence is valid — it speaks to the specific causal claim
3. The counterfactual test passes:
   "If this cause were false, would this evidence still exist?"
   → If yes: the evidence does not actually support the cause
   → If no: the evidence genuinely points to this cause
4. No unresolved conflicting evidence remains
```

A node that passes this standard is a **finding**.
A node that does not is a **hypothesis** — label it as such and continue gathering.

**Evidence-scarce investigations:** Some domains (historical analysis, cold cases, strategic planning) may structurally lack Tier 1 or Tier 2 evidence. When the minimum standard cannot be met:
1. Label the node as a **best-available hypothesis** (not a finding)
2. Document what evidence *would* be needed to elevate it to a finding
3. Record the highest-tier evidence available and its limitations
4. Apply stricter counterfactual and independence checks to compensate for weaker evidence
5. Flag the conclusion as provisional — subject to revision if better evidence emerges

This does not lower the standard. It makes the investigation's confidence level explicit.

**Note on the counterfactual test:** The counterfactual test itself (step 3 above) is an inferential judgment — it is Tier 3 evidence, not Tier 1 or 2. The counterfactual test validates the *causal relationship*, while criteria 1 requires separate Tier 1/2 evidence for the *factual claim*. Both are needed: evidence that the cause occurred (Tier 1/2) and reasoning that the cause explains the effect (counterfactual test, Tier 3).

---

## Chain of Evidence

In a documented investigation, each piece of evidence must be traceable. This is not bureaucracy — it is the only way to reconstruct the investigation later if the fix does not work.

For every piece of evidence attached to a Why node, record:

```
Source:    Where did this evidence come from?
Captured:  When was it captured, relative to the event?
By whom:   Who gathered or observed it?
Tier:      What tier is it (1–4)?
Link:      Can you point to the original artifact?
```

An investigation where the evidence cannot be traced is an investigation that cannot be audited, corrected, or learned from.

---

## Evidence and Bayesian Updating

Evidence quality directly affects the magnitude of your Bayesian update.

```
Strong evidence (Tier 1, high reliability, valid, complete):
→ Large update to posterior
→ Low-probability branches can be decisively pruned

Weak evidence (Tier 4, low reliability, partial):
→ Small update to posterior
→ Branches remain alive longer
→ Investigation takes longer to converge
```

This means: the fastest path to convergence is gathering the highest-quality evidence first. Time spent retrieving a Tier 1 source is usually faster than spending hours reasoning from Tier 4.

---

## Evidence Traps

### Cherry-picking
Selecting only the evidence that supports the leading hypothesis while failing to note evidence that contradicts it. Combine with confirmation bias and an investigation becomes a closing argument, not an inquiry.

**Defense:** Before closing any Why node, ask: "What evidence against this claim exists — and have I documented it?"

### Hearsay chains
Testimonial evidence passed through multiple people before it reaches you. Each transmission introduces distortion. By the third hand, it is nearly worthless.

**Defense:** Go to the original source. If the original source is unavailable, label the evidence as a hearsay chain and weight it accordingly.

### Recency contamination
Evidence gathered after the investigation has already developed a leading hypothesis is systematically biased. The people providing it know what you are looking for.

**Important distinction:** This does not contradict Bayesian iterative evidence gathering (see **[05 Bayesian Reasoning](05_bayesian_reasoning.md)**). Forming hypotheses and then seeking evidence is correct — that is how investigation works. The trap is *filtering* evidence to confirm the hypothesis: asking leading questions, ignoring contradicting data, or only looking where you expect to find support. Gather evidence that could distinguish between hypotheses, not evidence that confirms the leading one.

**Defense:** Gather raw evidence before forming and sharing hypotheses. Lock the evidence set before forming conclusions. When gathering evidence iteratively, always seek evidence that could *disprove* the leading hypothesis, not just confirm it.

---

## Key Terms

| Term | Meaning |
|---|---|
| **Evidence hierarchy** | Four-tier ranking from physical/instrumental (strongest) to testimonial/reconstructive (weakest) |
| **Reliability** | Whether a source consistently produces accurate observations |
| **Validity** | Whether the evidence actually measures what the causal claim requires |
| **Independence** | Two pieces of evidence are independent only if neither caused nor influenced the other |
| **Conflicting evidence** | Two observations that point in opposite directions — treat as a signal, not noise |
| **Minimum evidence standard** | The threshold a Why node must meet to be closed as a finding |
| **Chain of evidence** | A traceable record of the source, timing, and nature of each piece of evidence |
| **Cherry-picking** | Selecting only confirming evidence; a form of confirmation bias in evidence handling |
| **Finding** | A Why node with evidence meeting the minimum standard |
| **Hypothesis** | A Why node not yet supported by sufficient evidence |

---

<p align="center"><strong>← Previous</strong> <strong><a href="07_cognitive_biases.md">07 — Cognitive Biases</a></strong> · <strong>Next →</strong> <strong><a href="../proofs/00_index.md">Formal Proofs</a></strong> · <strong>↑ Back to Framework</strong> <strong><a href="../FRAMEWORK.md">FRAMEWORK.md</a></strong></p>
