<h1 align="center">How to Solve Anything</h1>

<p align="center"><strong>A universal investigation framework combining the 5 Ws and 5 Whys.</strong><br>Applicable to any problem with decomposable causal structure — across disciplines, domains, and scales.</p>

<p align="center">
<code>SOMETHING HAPPENED → TO SOMEONE → SOMEWHERE → AT SOME POINT → FOR SOME REASON</code>
</p>

<p align="center">
<strong><a href="FRAMEWORK.md">📋 Framework</a></strong>&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;<strong><a href="math/00_index.md">🧮 The Math</a></strong>&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;<strong><a href="proofs/00_index.md">🔬 Proofs</a></strong>&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;<strong><a href="DIAGRAMS.md">📊 Diagrams</a></strong>
</p>

---

<h3 align="center">💡 The Core Insight</h3>

<p align="center">Every problem in every field has the same anatomy.<br>The vocabulary changes. The structure never does.</p>

<p align="center">
The <strong>5 Ws</strong> tell you <em>what happened.</em><br>
The <strong>5 Whys</strong> tell you <em>why it happened.</em><br>
Together they tell you <em>what to do about it.</em>
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
| 🏥 Medicine | Patient | Symptom | Onset | Body system | Presenting complaint |
| 🔒 Security | Threat actor | Breach | Attack window | Vulnerability | Attack vector |
| ⚙️ Engineering | System | Failure | Timeline | Component | Error message |
| 📈 Business | Team / Process | Bottleneck | Quarter | Department | Stated reason |
| ⚖️ Legal | Defendant | Act | Date | Jurisdiction | Motive |
| 🧠 Personal | You | Decision | Moment | Context | Emotion |

</div>

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

</div>

---

<h3 align="center">📏 Rules</h3>

<p align="center"><strong>Map before you drill.</strong> Complete the 5 Ws before starting the 5 Whys.</p>
<p align="center"><strong>Evidence at every node.</strong> An assertion without evidence is a guess.</p>
<p align="center"><strong>Branch when reality branches.</strong> If a Why has multiple answers, follow all of them.</p>
<p align="center"><strong>5 is a heuristic, not a rule.</strong> Stop when you reach something you can actually change.</p>
<p align="center"><strong>The framework is recursive.</strong> A root cause can become a new "What." Run it again if needed.</p>

---

<h3 align="center">⚙️ Engine</h3>

<p align="center">The framework is also available as a <strong>Python library</strong> that codifies the algorithm.<br>The engine provides structure and math — you provide judgment.</p>

```bash
cd engine && pip install -e .
```

```python
from htsa_engine import Investigation, Evidence, EvidenceTier, EvidenceDirection, DepthCriteria

inv = Investigation(title="API 500 errors", pruning_threshold=0.05)
inv.set_situation(who_affected="Users", what="500 errors", when_during="2:47 AM", where="EU-west", why_surface="Load spike")
inv.complete_situation()
origin = inv.start_causal_chain("Server errors under load")
branch = inv.add_hypothesis(origin, "Memory leak", probability=0.6)
# ... add evidence, mark root cause, resolve, verify
inv.save("investigation.json")
```

<p align="center"><strong><a href="engine/README.md">Full engine documentation →</a></strong></p>

---

<p align="center"><a href="LICENSE"><em>MIT Licensed</em></a> · <a href="CONTRIBUTING.md"><em>Contributions welcome</em></a></p>
