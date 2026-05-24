<h1 align="center">Worked Example: Production 500 Errors at 2:47 AM</h1>

> A full HTSA investigation walkthrough — all four layers, all eight mathematical foundations, annotated at every decision point.

---

## Investigation Header

```
INVESTIGATION: Production API returning 500 errors
DATE: 2025-09-14
INVESTIGATOR: SRE on-call (K. Vasquez), joined by deploy team lead (R. Chen)
MODE: [x] Full  [ ] Rapid
PRUNING THRESHOLD (θ): 0.05 (5% — general investigation)
```

---

## Layer 1 — Situation Map (5 Ws)

**[GRAPH]** Constructing the origin node v₀. Every field here constrains the search space before a single Why is asked.

| W | Answer |
|---|--------|
| **Who** | **Originator:** Deploy pipeline (automated). **Trigger:** Config change merged at 2:31 AM by R. Chen. **Affected:** ~12,000 end users receiving 500s. **Detector:** PagerDuty alert at 2:47 AM (latency + error rate). **Resolver:** SRE on-call K. Vasquez. **Stakeholder:** VP Engineering, customer success team. |
| **What** | Production API (`api-gateway-prod`) returning HTTP 500 on all authenticated endpoints. Unauthenticated health check returns 200. |
| **When** | **Before:** Last successful deploy 2:18 AM. Config merge 2:31 AM. **During:** First 500 at 2:43 AM (log evidence), PagerDuty fires 2:47 AM. **After:** Error rate at 100% on auth endpoints by 2:52 AM. |
| **Where** | `api-gateway-prod` cluster (us-east-1), 6 pods. All 6 affected. Staging environment (`api-gateway-staging`) healthy. |
| **Why (surface)** | The API is returning 500 errors because authenticated requests are failing after a recent deploy. |

**[INFO]** Initial entropy is high. We have a surface Why but no causal depth. The 5 Ws narrow the problem from "something broke" to "authenticated endpoints, all pods, after a deploy window." That constraint alone eliminates large categories of cause (network partition, single-node failure, DNS).

**[EXP]** Without the situation map, the branching factor here is enormous — hardware, software, network, DNS, DDoS, database, config, dependency, human error. The 5 Ws reduce the live search space before Layer 2 begins.

---

## Layer 2 — Causal Chain (Branching Why Tree)

### Setting Priors

**[BAYES]** Before expanding, assign priors from base rates. Historical incident data for this service over the past 18 months:

```
Config-related failures:        40%   (8 of 20 incidents)
Dependency failures (DB, cache): 25%   (5 of 20)
Code bugs in deploy:            20%   (4 of 20)
Infrastructure (node, network):  10%   (2 of 20)
Unknown / other:                 5%   (1 of 20)
```

**[BIAS] Anchoring warning:** The on-call's first instinct is "R. Chen's config change broke it" — a natural anchor given the timeline. The framework requires expanding all plausible branches before pursuing any single one. Name the anchor, then set it aside.

---

### Expanding v₀

**[SEARCH]** Strategy: Best-First search. Expand v₀, then always pursue the highest-posterior branch next.

**[EXP]** v₀ expands to 4 branches. Branching factor b = 4 at depth 0. Without pruning, depth 4 yields 4⁴ = 256 paths. Pruning keeps this tractable.

```
v₀: "Authenticated API endpoints return 500 after deploy window"
  │
  ├──► Branch A: Config change introduced bad values          P₀ = 0.40
  │
  ├──► Branch B: Upstream dependency failure (DB or cache)    P₀ = 0.25
  │
  ├──► Branch C: Code bug deployed in the 2:18 AM release    P₀ = 0.20
  │
  └──► Branch D: Infrastructure failure (node/network)        P₀ = 0.10
```

*Remaining probability mass (unknown/other) = 0.05, at the pruning threshold. Kept on the pruned-but-recoverable list.*

---

### Best-First: Expand Branch A (P = 0.40)

**[SEARCH]** Branch A has the highest prior. Expand it first.

**Why A1:** "Why did the config change introduce bad values?"

**Evidence gathered:**

| # | Evidence | Tier | Direction |
|---|----------|------|-----------|
| e₁ | `git diff` of config merge shows `AUTH_SERVICE_URL` changed from `https://auth.internal:8443` to `https://auth.internal:8443/v2` | Tier 1 (instrumental — version control log) | SUPPORTS |
| e₂ | Auth service `/v2` endpoint exists in staging but **is not deployed to production** | Tier 1 (instrumental — service registry query) | SUPPORTS |
| e₃ | Timestamp: config merged at 2:31 AM, first 500 at 2:43 AM (12-minute gap matches config propagation delay via ConfigMap reload) | Tier 1 (instrumental — Kubernetes event log) | SUPPORTS |

**[BAYES]** Update:

```
P(A | e₁, e₂, e₃) = P(e₁,e₂,e₃ | A) × P(A) / P(e₁,e₂,e₃)

Likelihood P(e₁,e₂,e₃ | A) ≈ 0.95  — this evidence is almost certain if A is true
Prior P(A) = 0.40
Marginal P(e₁,e₂,e₃) ≈ 0.95(0.40) + 0.10(0.60) = 0.44

P(A | evidence) ≈ 0.95 × 0.40 / 0.44 ≈ 0.86
```

**[INFO]** Entropy dropped sharply. Before: H ≈ 1.85 bits (4 branches with spread priors). After this update, Branch A dominates at 0.86. Remaining branches must be updated.

**[BAYES]** Posterior updates for competing branches (evidence e₂ specifically — the `/v2` endpoint not being in prod — is unlikely under hypotheses B, C, D):

```
Branch B (dependency):    P = 0.25 → 0.07   (config evidence doesn't fit dependency failure)
Branch C (code bug):      P = 0.20 → 0.05   (at pruning threshold)
Branch D (infrastructure): P = 0.10 → 0.02  (below θ)
```

**[EXP]** Branch D pruned: P = 0.02 < θ = 0.05.

```
PRUNED: Branch D (infrastructure) — P = 0.02 at time of pruning
  Evidence: All 6 pods affected identically (rules out single-node), config diff
  explains the timing, staging is healthy (rules out shared infrastructure).
  Kept on pruned list for recovery.
```

Branch C is exactly at θ = 0.05. Retain but deprioritize.

---

### Continue Best-First on Branch A (P = 0.86)

**Why A2:** "Why was a config pointing to an undeployed endpoint merged to production?"

**[GRAPH]** Expanding deeper on the highest-probability path.

**Evidence gathered:**

| # | Evidence | Tier | Direction |
|---|----------|------|-----------|
| e₄ | R. Chen's PR description references auth service v2 migration — intended for staging only, accidentally targeted prod ConfigMap | Tier 1 (instrumental — PR metadata) | SUPPORTS |
| e₅ | No CI/CD check validates that referenced service endpoints are live in the target environment | Tier 1 (instrumental — pipeline config audit) | SUPPORTS |
| e₆ | R. Chen confirms: "I thought I was merging to staging" | Tier 4 (testimonial — after the fact) | SUPPORTS (weak) |

**[EVIDENCE]** e₆ is Tier 4 — testimonial, recalled under stress. It supports the hypothesis but cannot anchor the finding alone. e₄ and e₅ are Tier 1 and sufficient.

**[BAYES]** P(A2 | e₄, e₅) ≈ 0.92. The chain is solidifying.

This expands into two sub-branches:

```
Why A2: "Config targeted wrong environment"
  │
  ├──► A2a: Human error — wrong merge target              P = 0.45
  │
  └──► A2b: No automated validation of config targets     P = 0.47
```

**[BIAS] Attribution bias warning:** The chain is converging on "R. Chen made a mistake." Framework rule: any Why answer that names a person requires asking Why once more. The question is not "who made the error" but "what system allowed the error to reach production."

---

### Expand A2a: Human error — wrong merge target (P = 0.45)

**Why A3a:** "Why did R. Chen merge to the wrong environment?"

| # | Evidence | Tier | Direction |
|---|----------|------|-----------|
| e₇ | Repo uses identical branch naming for staging and prod configs, differentiated only by a subdirectory path (`/staging/` vs `/prod/`) | Tier 1 (instrumental — repo structure) | SUPPORTS |
| e₈ | Three other engineers report near-misses with the same repo layout in the past 6 months | Tier 2 (observational — direct reports, contemporaneous Slack messages) | SUPPORTS |

**[BAYES]** P(A3a | e₇, e₈) ≈ 0.90.

**Proposed root cause:** "Confusing repo layout makes environment targeting error-prone."

**Depth Criteria check:**

```
[x] Actionability     — Restructure repo to separate environment configs
                        (e.g., separate repos or branch-per-environment with CI guards)
[x] Counterfactual    — If environments had distinct, guarded config paths,
                        the wrong-environment merge would have been blocked
[x] System Boundary   — Repo structure is fully within the team's control
[x] Diminishing Returns — Going deeper (why was the repo designed this way?)
                          yields "historical accident" — does not change the action
```

All four tests pass. **ROOT CAUSE A: Confusing repo layout for environment configs.** P = 0.90.

---

### Expand A2b: No automated validation (P = 0.47)

**Why A3b:** "Why does no CI check validate that referenced endpoints exist in the target environment?"

| # | Evidence | Tier | Direction |
|---|----------|------|-----------|
| e₉ | CI pipeline runs linting and syntax checks on config but has no integration test step for endpoint reachability | Tier 1 (instrumental — CI pipeline definition) | SUPPORTS |
| e₁₀ | The auth service v2 migration ticket (JIRA-4421) includes a subtask "add config validation to pipeline" — status: backlog, unassigned | Tier 1 (instrumental — project tracker) | SUPPORTS |

**[BAYES]** P(A3b | e₉, e₁₀) ≈ 0.93.

**Proposed root cause:** "CI/CD pipeline lacks endpoint reachability validation for config changes."

**Depth Criteria check:**

```
[x] Actionability     — Add a CI step that curls referenced endpoints in the
                        target environment before allowing merge
[x] Counterfactual    — If this check existed, the merge would have failed CI
                        and never reached production
[x] System Boundary   — Pipeline is fully within the team's control
[x] Diminishing Returns — Going deeper (why wasn't it built?) yields "prioritization
                          decision" — understanding that doesn't change the fix
```

All four tests pass. **ROOT CAUSE B: Missing endpoint validation in CI/CD pipeline.** P = 0.93.

---

### Branch Convergence

**[GRAPH]** Root Causes A and B converge. Both branches trace back from the same surface event and reinforce each other: the confusing repo layout (A) created the conditions for human error, and the missing CI validation (B) removed the safety net that would have caught it. Neither cause alone is sufficient to explain why the incident reached production.

```
v₀ (500 errors)
  └──► A1 (bad config values)
         └──► A2 (config targeted wrong env)
                ├──► ROOT CAUSE A: confusing repo layout        P = 0.90
                │         ↘
                │          [CONVERGE] — AND-causation
                │         ↗
                └──► ROOT CAUSE B: no CI endpoint validation    P = 0.93
```

**Root cause interaction: AND-causation.** The outage required both conditions: the confusing layout caused the error AND the missing validation allowed it through. Fixing either one alone would have prevented this specific incident — but leaving either unfixed leaves the system vulnerable to the same class of failure.

---

### Remaining Branches — Final Status

**Branch B (dependency failure):** P = 0.07 after A's evidence. Additional check: database and Redis both healthy throughout the incident window (CloudWatch metrics, Tier 1). P drops to 0.01. **Pruned.**

```
PRUNED: Branch B (dependency failure) — P = 0.01 at time of pruning
  Evidence: DB and Redis metrics nominal throughout incident window (Tier 1).
```

**Branch C (code bug):** P = 0.05. The 2:18 AM deploy contained no code changes — only a dependency version bump (Tier 1: deploy manifest diff). P drops to 0.01. **Pruned.**

```
PRUNED: Branch C (code bug) — P = 0.01 at time of pruning
  Evidence: Deploy manifest shows dependency bump only, no application code changes (Tier 1).
```

**Branch D:** Already pruned above at P = 0.02.

---

## Layer 3 — Resolution

### ROOT CAUSE A: Confusing repo layout for environment configs

```
Type:             Fix
Must Change:      Separate prod and staging configs into distinct repos with
                  CODEOWNERS requiring SRE approval for prod config changes
Owner:            R. Chen (platform team)
By When:          2025-09-28 (2 weeks)
Counterfactual:   "If separate repos with CODEOWNERS had existed, would the
                  wrong-environment merge have occurred?" → No. Fix is correctly targeted.
```

### ROOT CAUSE B: Missing endpoint validation in CI/CD pipeline

```
Type:             Fix
Must Change:      Add CI step: for each service URL in config, curl the endpoint
                  in the target environment; fail the pipeline if any returns non-2xx
Owner:            K. Vasquez (SRE)
By When:          2025-09-21 (1 week — lower complexity, higher urgency)
Counterfactual:   "If this CI check had existed, would the bad config have reached
                  production?" → No. Fix is correctly targeted.
```

### Root Cause Interactions

```
[x] AND-causation
Both causes needed to produce the incident. Fix both.
```

### Priority

```
Root Cause B (CI validation):
  Impact = 5 × Recurrence = 4 × Actionability = 5 = 100  →  Act first (1 week)

Root Cause A (repo layout):
  Impact = 5 × Recurrence = 3 × Actionability = 4 = 60   →  Act second (2 weeks)

Root Cause B is prioritized: faster to implement, and it provides an
immediate safety net while the larger repo restructure is planned.
```

---

## Layer 4 — Verification and Learning

### Verification Window

```
Type: Event-driven (outage from config change)
Trigger: Next config change deployed to production
Window: Wait for 3 production config deploys after fix is in place
Expected verification date: 2025-10-12 (based on deploy frequency)
```

### Verification Checklist

```
ROOT CAUSE B fix (CI validation) — deployed 2025-09-19:
  [x] Next prod config deploy (2025-09-22): CI caught a typo in CACHE_HOST.
      Pipeline blocked merge. Fix confirmed.
  [x] Monitoring: zero 500 errors from config-related causes since fix.

ROOT CAUSE A fix (repo separation) — deployed 2025-09-27:
  [x] R. Chen attempted a staging-only config change (2025-10-03).
      Change went to correct repo. CODEOWNERS prevented accidental prod path.
  [x] No environment-targeting near-misses reported since restructure.
```

```
Any recurrence? [ ] Yes  [x] No → proceed
```

### Learning Loop

**[BAYES]** Updating priors for next investigation in this domain:

```
[x] Were base rates accurate?
    Config-related was our top prior at 40%. Confirmed. Prior holds.
    → No adjustment needed for this cause class.

[x] Which branches were pruned?
    Infrastructure (D) pruned early and correctly.
    Code bug (C) pruned correctly — but note: if the deploy HAD contained
    code changes, this branch would have competed with A.
    → Prior for code-bug-in-deploy remains at 20%.

[x] Was the first hypothesis correct?
    On-call's first instinct was "R. Chen's config change." This was partially
    correct — the config change was the trigger — but the root causes were
    structural (repo layout, missing validation), not the individual action.
    → Track: anchoring on the human trigger rather than the system condition
      has occurred in 3 of last 5 investigations. Systematic pattern.

[x] Surprises worth documenting?
    The 12-minute propagation delay between config merge (2:31 AM) and first
    error (2:43 AM) was not in any runbook. ConfigMap reload interval was
    undocumented. This delay could mask cause-effect relationships in future
    incidents.
    → ACTION: Document ConfigMap reload interval in service runbook.
    → ACTION: Add ConfigMap reload event to observability dashboard.
```

**[INFO]** Final entropy: near zero. Both root causes confirmed, fixes verified, priors updated. Investigation closed.

---

## Summary: Math Foundation Map

Every step of this investigation engaged specific mathematical foundations. Here is the complete map:

| Step | Foundation | What It Did |
|------|-----------|-------------|
| 5 Ws narrowing the search space | **[EXP]** Exponential Space | Reduced branching factor from unbounded to 4 |
| Constructing the Why tree | **[GRAPH]** Graph Theory | DAG structure with directed edges from surface to root |
| Setting priors from historical data | **[BAYES]** Bayesian Reasoning | Base rates from 18 months of incident data |
| Expanding highest-probability branch first | **[SEARCH]** Search Algorithm | Best-First search via priority queue |
| Updating P(A) from 0.40 to 0.86 | **[BAYES]** Bayesian Reasoning | Posterior update from Tier 1 evidence |
| Entropy drop after first evidence batch | **[INFO]** Information Theory | H dropped from 1.85 to ~0.60 bits |
| Pruning Branch D at P = 0.02 | **[EXP]** Exponential Space | Pruning keeps search tractable |
| Attribution bias callout on R. Chen | **[BIAS]** Cognitive Bias | Prevented stopping at a person instead of a system |
| Anchoring warning on first instinct | **[BIAS]** Cognitive Bias | Named the anchor before it could distort the tree |
| Counterfactual test on each edge | **[CAUSAL]** Causal Inference | "If not A, would the problem still have occurred?" |
| Evidence tiering (e₆ as Tier 4) | **[EVIDENCE]** Evidence Evaluation | Prevented weak evidence from anchoring a finding |
| Root Causes A and B converging | **[GRAPH]** Graph Theory | Convergent node revealing AND-causation |
| Depth criteria at each root cause | **[CAUSAL]** Causal Inference | Four tests confirming actionable root causes |
| Counterfactual test on proposed fixes | **[CAUSAL]** Causal Inference | Verified fixes target causes, not symptoms |
| Verification window and confirmation | **[BAYES]** Bayesian Reasoning | Empirical confirmation updating belief to ~1.0 |
| Prior update for next investigation | **[INFO]** Information Theory | Reducing starting entropy for future incidents |

---

← **[Previous: Worked Examples Index](00_index.md)** · **[Next: Medical Diagnosis](02_medical_diagnosis.md)** →
