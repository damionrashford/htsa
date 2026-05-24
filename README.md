<h1 align="center">How to Solve Anything</h1>

<p align="center"><strong>A structured root cause analysis (RCA) framework combining the 5 Ws and 5 Whys.</strong><br>Probabilistic, formally proven, and domain-agnostic — engineering incidents, medicine, security, business, legal.</p>

<p align="center">
<code>SOMETHING HAPPENED → TO SOMEONE → SOMEWHERE → AT SOME POINT → FOR SOME REASON</code>
</p>

<p align="center">
<em>Not a template. An algorithm.</em><br>
<em>Bayesian probability at every node. Causal inference at every edge. LLM-assisted or fully manual.</em>
</p>

<p align="center">
<strong><a href="FRAMEWORK.md">📋 Framework</a></strong>&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;<strong><a href="math/00_index.md">🧮 The Math</a></strong>&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;<strong><a href="proofs/00_index.md">🔬 Proofs</a></strong>&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;<strong><a href="DIAGRAMS.md">📊 Diagrams</a></strong>&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;<strong><a href="engine/README.md">⚙️ Engine</a></strong>&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;<strong><a href="research/00_index.md">📚 Research</a></strong>
</p>

---

<h3 align="center">💡 The Core Insight</h3>

<p align="center">Every incident, outage, failure, or decision has the same anatomy.<br>The vocabulary changes. The causal structure never does.</p>

<p align="center">
The <strong>5 Ws</strong> tell you <em>what happened.</em><br>
The <strong>5 Whys</strong> tell you <em>why it happened.</em><br>
Together they tell you <em>what to fix — and in what order.</em>
</p>

<p align="center">
HTSA replaces the blank postmortem doc and the sticky-note 5 Whys session<br>
with a formal algorithm: DAG traversal + Bayesian updating + causal counterfactual tests.
</p>

---

<h3 align="center">🔍 The Four Layers</h3>

<h4 align="center">Layer 1 — Situation Map (5 Ws)</h4>

<p align="center">Establish the full picture before drilling into cause.</p>

<div align="center">

| Question | What It Captures |
|:---:|:---:|
| **Who** | The actor, subject, or stakeholder involved |
| **What** | The event, problem, or incident |
| **When** | The timeline — before, during, and after |
| **Where** | The location, system, environment, or context |
| **Why** | The surface-level, immediately apparent reason |

</div>

<h4 align="center">Layer 2 — Causal Chain (5 Whys)</h4>

<p align="center">Start at the surface Why. Ask why again.<br>Keep going until you hit something you can actually change.</p>

```
Why (surface)
  └─► Why 1
        └─► Why 2
              └─► Why 3
                    └─► Why 4
                          └─► Why 5: ROOT CAUSE
```

<p align="center"><em>Whys can and should branch. Real problems are rarely single-cause.</em></p>

<h4 align="center">Layer 3 — Resolution</h4>

<p align="center">Map each root cause to a concrete change. Apply the counterfactual test:</p>

<p align="center"><em>"If this change had existed before the problem occurred,<br>would the problem still have happened?"</em></p>

<p align="center">Each root cause is either <strong>fixed</strong>, <strong>mitigated</strong>, or <strong>accepted</strong>.</p>

<h4 align="center">Layer 4 — Verification and Learning</h4>

<p align="center">Confirm the fix worked. Update your priors.<br>The framework compounds over time — but only if learning is explicit.</p>

---

<h3 align="center">🌐 Works Everywhere</h3>

<div align="center">

| Domain | Who | What | When | Where | Why |
|:---:|:---:|:---:|:---:|:---:|:---:|
| ⚙️ SRE / Engineering | System / Team | Outage, incident | Incident timeline | Service / Component | Alert or error |
| 🏥 Medicine | Patient | Diagnosis | Onset | Body system | Presenting symptom |
| 🔒 Security | Threat actor | Breach | Attack window | Vulnerability | Attack vector |
| 📈 Business | Team / Process | Bottleneck | Quarter | Department | Stated reason |
| ⚖️ Legal | Defendant | Act | Date | Jurisdiction | Motive |
| 🧠 Personal | You | Decision | Moment | Context | Emotion |

</div>

<p align="center"><em>Each domain uses the same algorithm. The math is domain-agnostic.</em></p>

---

<h3 align="center">🧮 The Math</h3>

<p align="center">The framework is an applied graph traversal algorithm for causal inference —<br>with probability weighting, entropy reduction, and Bayesian evidence updating at every node.</p>

<div align="center">

| # | Concept | What It Answers |
|:---:|:---:|:---:|
| **[01](math/01_graph_theory.md)** | Graph Theory | What is the structure of an investigation? |
| **[02](math/02_exponential_problem_space.md)** | Exponential Problem Space | Why do investigations feel overwhelming? |
| **[03](math/03_causal_inference.md)** | Causal Inference | How do you prove something caused something else? |
| **[04](math/04_information_theory.md)** | Information Theory | How do you measure investigative progress? |
| **[05](math/05_bayesian_reasoning.md)** | Bayesian Reasoning | How do you weigh competing causes? |
| **[06](math/06_search_algorithms.md)** | Search Algorithms | How do you move through the Why tree? |
| **[07](math/07_cognitive_biases.md)** | Cognitive Biases | What corrupts the investigation? |
| **[08](math/08_evidence_evaluation.md)** | Evidence Evaluation | How do you know which evidence to trust? |
| **[09](math/09_causation_theory.md)** | Causation Theory | How do you classify and quantify actual causes? |
| **[10](math/10_intervention_theory.md)** | Intervention Theory | How do you find the minimal set of fixes? |

</div>

---

<h3 align="center">📏 Rules</h3>

<p align="center"><strong>Map before you drill.</strong> Complete the 5 Ws before starting the 5 Whys.</p>
<p align="center"><strong>Evidence at every node.</strong> An assertion without evidence is a guess — tier your evidence.</p>
<p align="center"><strong>Branch when reality branches.</strong> Real incidents have multiple root causes. Follow all of them.</p>
<p align="center"><strong>5 is a heuristic, not a rule.</strong> Stop when you reach something you can actually change.</p>
<p align="center"><strong>The counterfactual test closes the loop.</strong> If the fix had existed, would the incident still have happened? If yes, go deeper.</p>
<p align="center"><strong>The framework is recursive.</strong> A root cause can become a new incident. Run it again.</p>

---

<h3 align="center">⚙️ Engine</h3>

<p align="center">The framework is also available as a <strong>Python library</strong> (v2.0.0) with built-in LLM integration.<br>Works with any provider — OpenAI, Anthropic, Groq, Mistral, Ollama, or any OpenAI-compatible endpoint.</p>

```bash
cd engine && uv run python -c "from htsa_engine import Investigation; print('ready')"
```

**Auto-investigate with any LLM** — one call, all 4 layers:

```python
from htsa_engine.llm import LLMAdvisor

advisor = LLMAdvisor("https://api.openai.com/v1", api_key="sk-...", model="gpt-4o")
inv = advisor.run("API returning 500 errors since 2:47 AM, EU region only")

print(inv.root_causes)
inv.save("investigation.json")
```

**Or drive it manually** — full control over every decision:

```python
from htsa_engine import Investigation, Evidence, EvidenceTier, EvidenceDirection

inv = Investigation(title="API 500 errors", pruning_threshold=0.05)
inv.set_situation(who_affected="Users", what="500 errors", when_during="2:47 AM", where="EU-west", why_surface="Load spike")
inv.complete_situation()
origin = inv.start_causal_chain("Server errors under load")
branch = inv.add_hypothesis(origin, "Memory leak", probability=0.6)
# ... add evidence, mark root cause, resolve, verify
inv.save("investigation.json")
```

**v2 — Causation analysis** — quantify and prioritize root causes:

```python
# HP2015 + NESS three-stage counterfactual test
result = inv.run_hp2015_test(branch, origin)
print(result.is_root_cause, result.w_partition)

# Probability of Necessity and Sufficiency
pns = inv.compute_pns(branch, pn=0.8, ps=0.7)
print(pns.causation_type)  # "single_root_cause" | "and_node" | "or_node"

# Find the smallest set of fixes that achieves 90% coverage
intervention = inv.compute_minimal_intervention_set(theta=0.90)
print(intervention.minimal_set, intervention.coverage)

# Evidence budget — how many Tier-1 evidence items are needed?
budget = inv.evidence_budget(branch, alternative_posteriors={"other_node": 0.3})
print(budget.n_required, budget.is_indistinguishable)
```

<p align="center"><strong><a href="engine/README.md">Full engine documentation →</a></strong></p>

---

---

<h3 align="center">🔍 How HTSA Differs</h3>

<div align="center">

| | HTSA | PyRCA / BARO | DoWhy | Postmortem templates |
|:---:|:---:|:---:|:---:|:---:|
| **Approach** | Structured algorithm | ML / metrics | Statistical | Blank form |
| **Input** | Any problem | Prometheus metrics | Data frames | Text |
| **Causal proof** | HP2015 + NESS + PNS | Correlation-based | do-calculus | None |
| **Works without data** | Yes | No | No | Yes |
| **Cross-domain** | Yes | AIOps only | Research only | Yes |
| **LLM integration** | Built-in | No | No | No |

</div>

---

<p align="center"><a href="LICENSE"><em>MIT Licensed</em></a> · <a href="CONTRIBUTING.md"><em>Contributions welcome</em></a></p>
