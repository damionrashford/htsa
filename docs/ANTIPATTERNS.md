<h1 align="center">How Investigations Fail</h1>

> Every anti-pattern below has been observed in real investigations. Each one feels like progress while producing the wrong answer.

---

## 1. Skipping the Map

**The pattern:** Jump straight to "why" without establishing "what."

**What it looks like:**
```
"The deploy failed."
"Why? Probably a config issue."
"Let me check the config..."
```

The investigator never asked: What exactly failed? When did it start? Where in the system? Who was affected? Which deploy — the 2 PM deploy or the 4 PM deploy?

**Why it fails:** Without the situation map, you are investigating a vague impression, not a defined problem. Two investigators on the same team will pursue different "whys" because they are solving different "whats."

**The fix:** Complete all 5 Ws before asking the first Why. This takes five minutes. Skipping it costs hours.

---

## 2. The Single-Cause Trap

**The pattern:** Follow one branch to a satisfying answer and stop.

**What it looks like:**
```
Why did the outage happen?
  └── Bad config pushed to production
        └── Config wasn't validated
              └── ROOT CAUSE: No config validation in CI pipeline
```

The investigation stops. The team builds config validation. Three weeks later, a different bad config causes another outage — because the real problem was that deploys bypass CI entirely during hotfixes. The branch was real but incomplete.

**Why it fails:** Real problems rarely have one cause. The first root cause found is the most obvious one — not necessarily the most important one. Stopping at the first answer is premature closure.

**The fix:** After finding Root Cause A, ask: "Does this explain 100% of the problem?" If no, continue the search. Check remaining branches above the pruning threshold.

---

## 3. Stopping at a Person

**The pattern:** The Why chain terminates at a human being.

**What it looks like:**
```
Why did the wrong version deploy?
  └── John pushed to main without review
        └── ROOT CAUSE: John didn't follow process
```

**Why it fails:** People operate within systems. "John didn't follow process" is a description, not a root cause. Why didn't John follow process? Was the process enforced? Was it even documented? Was there time pressure that made skipping review rational? Attribution bias stops the chain at the most visible actor and ignores the system that produced the action.

**The fix:** Any Why answer that names a person — ask Why once more. The root cause is almost always a missing guardrail, an unclear process, a misaligned incentive, or a system that made the wrong action easy and the right action hard.

---

## 4. Circular Whys

**The pattern:** The Why chain loops back on itself and the investigator doesn't notice.

**What it looks like:**
```
Why are deployments slow?
  └── Because the pipeline has too many steps
        └── Because we added steps after the last outage
              └── Because deployments were unreliable
                    └── Because deployments were slow ← LOOP
```

**Why it fails:** This is not root cause analysis — it is describing a feedback loop. Each link feels like progress, but the chain never reaches something actionable. The investigator is tracing a cycle, not a path.

**The fix:** If a Why chain returns to an earlier node, stop and name it as a feedback loop. Apply the Feedback Loop Protocol: identify the full cycle, choose a break point, document why that break point was chosen. The break point is a modeling decision — state it explicitly.

---

## 5. Evidence-Free Whys

**The pattern:** Every Why answer is stated as fact but supported only by intuition.

**What it looks like:**
```
Why are customers churning?
  └── Product isn't meeting their needs (no data cited)
        └── We haven't shipped enough features (no data cited)
              └── Engineering is too slow (no data cited)
                    └── ROOT CAUSE: We need to hire more engineers
```

Every step sounds reasonable. None is grounded in evidence. The "root cause" is a pre-existing belief that the investigation was used to justify, not discover.

**Why it fails:** An assertion without evidence is a guess. Chaining five guesses together does not produce a root cause — it produces a narrative that confirms what the investigator already believed. This is confirmation bias wearing the disguise of structured analysis.

**The fix:** Every Why answer must link to evidence with a tier classification. No evidence, no Finding — it stays a Hypothesis until proven. If the entire chain is Tier 3/4 hypotheses, the investigation has not yet started.

---

## 6. Groupthink Investigation

**The pattern:** The room converges on a cause before examining evidence, and the investigation exists only to confirm the consensus.

**What it looks like:** The leadership team agrees in a meeting: "The market is tightening." The investigation is assigned. The investigator, knowing what the room expects, finds data that supports "market conditions" and stops. Uncomfortable evidence (internal process failures, product gaps) is noted but not pursued because no one asked for it.

**Why it fails:** The investigation's purpose — to reduce uncertainty — is defeated when the conclusion is predetermined. Entropy never drops to its true minimum because the hypothesis space was artificially narrowed before evidence was gathered.

**The fix:** Assign an adversarial investigator whose explicit job is to pursue the hypothesis the room does not want to hear. The adversarial role is structural — it is a process requirement, not a personality trait. The investigation must follow evidence regardless of whether the answer is comfortable.

---

## 7. Symptom Fix

**The pattern:** The resolution targets a visible symptom, not the root cause. The problem recurs in a different form.

**What it looks like:**
```
Problem: API returns 500 errors under load
Investigation: Server runs out of memory at 10K concurrent requests
"Root Cause": Not enough memory
Fix: Double the server memory
```

Three months later, the same problem returns at 20K requests. The fix addressed the symptom (insufficient memory) rather than the cause (a memory leak in the request handler, or missing connection pooling, or unbounded query results).

**Why it fails:** The counterfactual test was not applied — or was applied incorrectly. "If we had more memory, would the problem have happened?" Yes, it would have — just later. The fix delays the problem; it does not prevent it.

**The fix:** Run the counterfactual test on every proposed resolution. "If this change had existed before the problem, would the problem still have happened?" If the honest answer is "yes, eventually" — you are fixing a symptom. Go deeper.

---

## 8. Premature Pruning

**The pattern:** A branch is dismissed too early because it seems unlikely, and the pruning is not revisited when new evidence arrives.

**What it looks like:**
```
Branch A: Infrastructure failure  P = 0.60
Branch B: Application bug         P = 0.25
Branch C: External dependency     P = 0.10
Branch D: Data corruption         P = 0.05 ← pruned

Investigation pursues A, finds it was not the cause.
Pursues B, finds it was not the cause.
Pursues C, finds a partial cause.

Branch D — never revisited — was the actual root cause.
```

**Why it fails:** Pruning is necessary (the exponential problem space demands it), but pruned branches must be recoverable. When the leading hypotheses fail, the pruned branches should be reconsidered with updated probabilities. Bayesian updating works in both directions — disconfirming the favorites should raise the posteriors of the pruned alternatives.

**The fix:** Record every pruned branch with the probability at time of pruning and the evidence that justified it. When a leading branch is disconfirmed, recalculate posteriors on pruned branches before concluding that the cause is unknown.

---

## 9. Infinite Depth

**The pattern:** The Why chain never stops because the investigator keeps finding "deeper" causes.

**What it looks like:**
```
Why was there no config validation?
  └── The CI pipeline was set up before validation tools existed
        └── The team didn't revisit the pipeline when tools became available
              └── There's no process for periodic pipeline review
                    └── Engineering leadership didn't prioritize process work
                          └── The company culture undervalues operational maturity
                                └── The founders are product-focused...
```

Every link is true. None is useful. The investigator has passed the actionable root cause three levels ago and is now doing organizational archaeology.

**Why it fails:** The Diminishing Returns test was never applied. At "no process for periodic pipeline review," the action is clear: create the process. Going deeper produces understanding but does not change the response. Every subsequent Why is intellectually interesting and operationally useless.

**The fix:** Apply all four depth criteria at every level. When the Diminishing Returns test fails — "would going one Why deeper change what we do?" — stop. Root cause analysis is not philosophy. It ends at the point of action.

---

## 10. The Unfalsifiable Root Cause

**The pattern:** The stated root cause cannot be tested, disproven, or verified.

**What it looks like:**
```
ROOT CAUSE: "Communication breakdown between teams"
ROOT CAUSE: "Lack of ownership culture"
ROOT CAUSE: "Technical debt"
```

These are conditions, not causes. They cannot be counterfactually tested ("If communication were better, would the problem not have occurred?" — how would you verify this?). They cannot be fixed with a concrete action. They are vague enough to explain any problem, which means they explain nothing.

**Why it fails:** The Actionability and Counterfactual Clarity depth criteria both fail. "Communication breakdown" is not a root cause — it is a category that contains dozens of possible root causes. Which communication? Between whom? About what? When? The Why chain stopped at a label instead of a mechanism.

**The fix:** If the root cause cannot be stated as a specific, testable claim with a concrete fix, it is not a root cause. Push through the abstraction: "Communication broke down" → Why? → "Team A did not notify Team B of the schema change" → Why? → "No notification process exists for schema changes." Now you have something actionable, testable, and falsifiable.

---

## Summary

| # | Anti-Pattern | Core Error | Defense |
|---|---|---|---|
| 1 | Skipping the Map | Investigating a vague impression | Complete all 5 Ws first |
| 2 | Single-Cause Trap | Stopping at the first satisfying answer | Ask "does this explain 100%?" |
| 3 | Stopping at a Person | Attribution bias | Person named → ask Why once more |
| 4 | Circular Whys | Tracing a cycle, not a path | Name it as a feedback loop |
| 5 | Evidence-Free Whys | Confirmation bias in disguise | Evidence + tier at every node |
| 6 | Groupthink Investigation | Predetermined conclusion | Assign adversarial investigator |
| 7 | Symptom Fix | Failed counterfactual test | Run counterfactual on every fix |
| 8 | Premature Pruning | Non-recoverable branch elimination | Record and revisit pruned branches |
| 9 | Infinite Depth | Passing the point of action | Apply Diminishing Returns test |
| 10 | Unfalsifiable Root Cause | Label instead of mechanism | Push through the abstraction |

---

**[Cheat Sheet](CHEATSHEET.md)** · **[Full Framework](FRAMEWORK.md)** · **[The Math](math/00_index.md)** · **[Examples](examples/00_index.md)**
