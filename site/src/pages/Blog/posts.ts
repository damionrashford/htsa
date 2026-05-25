export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  tags: string[];
  excerpt: string;
  content: string;
}

export const posts: BlogPost[] = [
  {
    slug: "why-5-whys-fails",
    title: "Why the 5 Whys Fails (and What to Do About It)",
    subtitle: "Linear chains, premature stops, and the cognitive biases that corrupt every investigation.",
    date: "2025-05-20",
    readTime: "8 min",
    tags: ["Framework", "Root Cause", "Cognitive Bias"],
    excerpt: "The 5 Whys is the most-taught root cause analysis method in engineering and medicine. It's also one of the most frequently misapplied. Here's what actually goes wrong — and the structural fixes that HTSA applies.",
    content: `The 5 Whys was developed at Toyota in the 1930s to find the root cause of manufacturing defects. It's simple: ask "why?" five times, and you'll arrive at the root cause. The problem is that this almost never works as described.

## The linear chain problem

Real problems are not linear. A production incident doesn't have one cause — it has a web of contributing factors that intersect at a failure point. A deployment succeeded 47 times before it failed. Why did it fail on the 48th? Usually: a concurrence of three or four independent conditions that individually were harmless.

The 5 Whys treats the problem as a chain:

\`\`\`
Why did the server crash?
  → Because memory ran out.
Why did memory run out?
  → Because we had a memory leak.
Why did we have a memory leak?
  → Because the connection pool wasn't closed.
...
\`\`\`

HTSA treats it as a graph:

\`\`\`
Why (surface)
  └─► Why 1a: Memory leak in connection pool
  └─► Why 1b: Traffic spike 3× normal
        └─► Why 2a: Marketing campaign launched without SRE review
        └─► Why 2b: Autoscaling threshold misconfigured
\`\`\`

The fix for 1a alone doesn't prevent recurrence — because 1b still exists, and the next spike will find a different ceiling.

## Anchoring bias fires immediately

The moment you form the first hypothesis, anchoring bias begins narrowing your search. The 5 Whys has no defense against this: it asks you to start asking "why?" with no prior evidence collection phase.

HTSA enforces a complete Situation Map (the 5 Ws) before any hypothesis is generated. This is not bureaucracy — it's a structural defense against anchoring. You cannot know which hypothesis to investigate first until you know: who was affected, what specifically happened, when it started, where in the system, and what the surface symptom is.

## Premature termination

"Stop when you reach root cause" is circular advice. How do you know when you've reached root cause? The 5 Whys doesn't say. In practice, people stop when:
- They run out of knowledge
- The answer implicates someone uncomfortable
- They reach a "force of nature" (third-party dependency, user behavior)
- They've asked five times

HTSA uses four formal depth criteria. A candidate root cause must pass all four before the branch closes:

1. **Actionability** — there is a concrete change that addresses this node
2. **Counterfactual clarity** — if this cause hadn't existed, the problem would not have occurred
3. **System boundary** — the cause is inside the system's control
4. **Diminishing returns** — going one Why deeper would not change the action you take

These criteria can be checked mechanically. You don't need to guess.

## What HTSA adds

- Bayesian probability at every hypothesis node — so you search in order of likelihood, not arbitrary order
- Explicit pruning threshold (5% general, 1% safety-critical) — branches below this are deprioritized, not ignored
- Evidence tiers — so you know how much weight to give each data source
- Seven cognitive bias detectors — so the investigation structure alerts when a known bias pattern is firing

The math underneath isn't ceremonial. The convergence proof (Doob 1949) guarantees that if you follow the algorithm, your beliefs will converge to the correct root cause given sufficient evidence. That's not a claim the original 5 Whys can make.`,
  },
  {
    slug: "bayesian-root-cause",
    title: "Bayesian Reasoning in Root Cause Analysis",
    subtitle: "Every node is a hypothesis with a probability. Here's how to update it correctly.",
    date: "2025-05-12",
    readTime: "10 min",
    tags: ["Bayesian", "Math", "Algorithm"],
    excerpt: "Most investigators update their beliefs informally — a gut feeling that adjusts when new data arrives. Bayesian inference makes this update explicit, reversible, and auditable. This is what sits at the core of HTSA's causal chain.",
    content: `Bayes' theorem tells you how to update a belief when new evidence arrives:

\`\`\`
P(cause | evidence) = P(evidence | cause) × P(cause) / P(evidence)
\`\`\`

In root cause analysis, this maps directly:

- **P(cause)** — your prior: how likely is this cause before you look at specific evidence?
- **P(evidence | cause)** — the likelihood: if this cause is real, how likely is this evidence?
- **P(cause | evidence)** — your posterior: how likely is this cause now that you've seen the evidence?

## Why priors matter

Most investigators start with equal priors — every hypothesis gets the same initial weight. This is often wrong. In a production system, you have history. Memory leaks have caused 60% of your last 10 incidents. A new deployment is the trigger in 40% of cases. These are real priors, and ignoring them wastes investigative time.

HTSA allows three prior sources:

1. **Historical frequency** — past incident data
2. **Domain model** — what you know about how this system fails
3. **Uniform** — when you genuinely have no basis for differentiation

When you have data, use it. When you don't, start uniform and let the evidence do the work.

## The update at each Why

At each node in the causal graph, you collect evidence. Evidence has a tier:

- **Tier 1** — physical or instrumental measurement (logs, metrics, traces)
- **Tier 2** — observational (direct human observation)
- **Tier 3** — inferential (reasoning from other observations)
- **Tier 4** — testimonial (second-hand accounts)

Tier 1 evidence updates probabilities more aggressively than Tier 4. A log timestamp showing the connection pool exhausted at 14:03:22.041 is not the same as a developer saying "I think the connection pool was the problem."

The update formula is applied at every node. Branches whose posterior probability falls below the pruning threshold (5% by default) are deprioritized — they're still tracked, not discarded, because a seemingly low-probability cause can gain evidence later.

## Convergence

Doob's martingale convergence theorem (1949) guarantees that repeated Bayesian updates on a consistent data-generating process will converge to the true posterior. In root cause terms: if you keep collecting evidence and updating correctly, you will converge to the real cause.

This is the formal basis for HTSA's convergence proof. The algorithm terminates not just because it's bounded (MAX_REOPEN=3) but because convergence is provable.

## In practice

The hardest part of Bayesian RCA is specifying likelihoods. "How likely is this evidence if the cause is a memory leak?" requires domain knowledge. The LLM advisor in HTSA helps with this — it can propose likelihood estimates based on system context, which you then verify or correct.

The key discipline is keeping the update explicit. Write down your prior. Write down the evidence. Write down your posterior. When the investigation concludes, you have an audit trail showing exactly how each belief changed and why.`,
  },
  {
    slug: "postmortem-without-blame",
    title: "Postmortem Without Blame: Why Blameless RCA Requires a Formal Algorithm",
    subtitle: "Saying 'no blame' isn't enough. The investigation structure itself must be bias-resistant.",
    date: "2025-05-05",
    readTime: "7 min",
    tags: ["SRE", "Culture", "Postmortem"],
    excerpt: "Most organizations declare their postmortems blameless. Most of those postmortems still end with an implicit finger pointing at a person. The problem isn't culture — it's that the investigation method itself has no defense against attribution bias.",
    content: `Google popularized the blameless postmortem. The idea is correct: if engineers fear punishment for mistakes, they hide information, and the system never learns. A blame-free culture surfaces more data, enables better analysis, and produces more effective fixes.

But here's the problem: telling people to be blameless doesn't make the analysis blameless. The investigation method itself shapes the output.

## Attribution bias is structural

Attribution bias (Fundamental Attribution Error) is the tendency to explain outcomes through person-level causes rather than system-level causes. It's a cognitive default. Under pressure, after an incident, when you're looking at a sequence of events, the human brain naturally lands on "a person made a decision that caused this."

The 5 Whys has no defense against this. You can state "this is blameless" and then ask "Why did the server crash?" → "Because the engineer deployed without running integration tests." That's a person. The chain stops there in practice, even if you continue asking.

## The structural fix

HTSA has a formal cognitive bias detector for attribution bias. When a Why answer identifies a human action as the cause, the detector fires:

> **Attribution bias alert**: This node blames a person. Verify that system-level causes are explored: Was the process documented? Was the tooling available? Was the failure mode preventable by system design?

The investigation cannot close the branch without explicitly checking these system-level conditions. This isn't a culture intervention — it's a structural constraint on the analysis.

## The seven detectors

HTSA includes seven bias detectors, each triggered by specific patterns:

1. **Anchoring bias** — first hypothesis given disproportionate weight
2. **Confirmation bias** — evidence is selectively collected to support the leading hypothesis
3. **Attribution bias** — person-level rather than system-level cause identified
4. **Availability heuristic** — recent or memorable causes overweighted
5. **Framing effect** — conclusion depends on how the problem was framed initially
6. **Sunk cost** — investigation continues on a low-probability branch due to prior investment
7. **Narrative fallacy** — the investigation is being shaped to fit a coherent story rather than the actual causal structure

Each detector has both a warning mode (flag and continue) and a blocking mode (cannot proceed until addressed). In safety-critical contexts, the blocking threshold is lower.

## What blameless really means

A truly blameless postmortem doesn't just avoid punishment — it actively searches for the system-level cause. Every human action has a context: the tools available, the process in place, the information visible at decision time. A person who made a "wrong" decision usually made a reasonable decision given what they knew.

The job of a postmortem is to find the conditions that made that decision possible. Fix the conditions, and the next person in the same situation makes a better decision automatically — not because you trained them, but because the system is different.

HTSA's System Boundary depth criterion encodes this directly: a root cause must be inside the system's control. "Engineer made a mistake" fails the system boundary test unless you can change the engineer's context — the process, the tooling, the information flow. Fixing the person is not a fix.`,
  },
  {
    slug: "htsa-for-medicine",
    title: "HTSA in Clinical Diagnosis: Root Cause Analysis Beyond Engineering",
    subtitle: "The same algorithm that finds your server's root cause can structure differential diagnosis.",
    date: "2025-04-28",
    readTime: "9 min",
    tags: ["Medicine", "Diagnosis", "Domain"],
    excerpt: "HTSA is domain-agnostic by design. The causal structure of a production incident and a clinical differential are formally identical. The vocabulary changes; the algorithm does not.",
    content: `When a software engineer reads HTSA, they see a postmortem framework. When a clinician reads it, they should see a differential diagnosis framework. The algorithm is the same.

## The mapping

| HTSA term | Medical equivalent |
|-----------|-------------------|
| Problem statement | Chief complaint |
| Situation Map (5 Ws) | History of presenting illness |
| Root cause hypothesis | Diagnosis |
| Evidence tier | Diagnostic test hierarchy |
| Counterfactual test | "Would this treatment have prevented this outcome?" |
| Fix / Mitigate / Accept | Treat / Manage / Watchful waiting |
| Verification window | Follow-up period |

The vocabulary is different. The causal structure is not.

## The 5 Ws in clinical context

**Who**: Patient demographics, comorbidities, medications, family history. Who else presents this way?

**What**: Precise symptom description — not "chest pain" but "pressure-like, 7/10, radiating to left arm, onset with exertion."

**When**: Timeline. When did it start? What changed in the window before onset? Sudden vs. gradual.

**Where**: Location in the body. Which system? Which region?

**Why (surface)**: The presenting complaint in the patient's own words, before any clinical interpretation.

Completing all five before forming a diagnosis is equivalent to HTSA's requirement to complete the Situation Map before hypothesizing. Anchoring bias in clinical diagnosis causes premature narrowing — the classic diagnostic error that misses zebras because the investigation stopped at "horse."

## Bayesian differential diagnosis

Every experienced clinician reasons probabilistically. "Given this presentation, what's the prior probability of MI vs. PE vs. GERD?" This is informal Bayesian reasoning.

HTSA formalizes it: assign explicit priors based on base rates and patient history, update on each diagnostic test result using Bayes' rule, prune low-probability branches at the threshold appropriate for the stakes (lower threshold for "diagnose and treat" decisions in serious conditions).

A Tier 1 piece of evidence (troponin assay) updates the MI hypothesis much more aggressively than a Tier 4 piece (patient reporting their father "had heart problems"). HTSA's evidence tier system maps directly to clinical evidence hierarchy: RCT data > observational data > expert opinion > anecdote.

## Depth criteria in diagnosis

The four depth criteria apply directly:

1. **Actionability**: Is there a treatment for this diagnosis?
2. **Counterfactual clarity**: If this diagnosis is wrong, would the proposed treatment fail to help?
3. **System boundary**: Is this condition one you can actually influence?
4. **Diminishing returns**: Would further testing change your treatment plan?

The fourth criterion is particularly important in medicine: when does additional testing stop adding information? HTSA's information gain metric (entropy reduction per Why answered) formalizes the point at which further investigation has no expected value.

## What changes

The vocabulary changes. The threshold on the pruning threshold changes (lower in life-critical situations — HTSA's safety-critical mode uses ≤1% instead of 5%). The verification window changes (follow-up at one week vs. 30-day reliability engineering window).

The structure does not change. The causal graph, the Bayesian update, the bias detectors, the depth criteria — these are domain-agnostic. That's not a claim about generality for its own sake. It's a consequence of the math. Causal inference works the same way regardless of the domain.`,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find(p => p.slug === slug);
}
