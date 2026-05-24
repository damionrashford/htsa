<h1 align="center">Kim et al. (2026) — LLM Accuracy in Formal Causal Reasoning</h1>

**Citation:** Kim, S., Park, J., Lee, H., Choi, Y. (2026). *LLM-based Root Cause Analysis: Opportunities and Limits.* arxiv:2602.09937  
**Primary gap:** LLM guard rails (Phase 6)

---

## Three Results Most Relevant to HTSA

**1. LLM Accuracy on Formal Causation Tasks Is 3.9–12.5%:**  
Kim et al. evaluate multiple LLM families on formal causation tasks: counterfactual testing, NESS set construction, PNS bounds computation, and Bayesian posterior updates. Accuracy ranges from 3.9% (worst model, PNS bounds) to 12.5% (best model, simple counterfactual). All models confidently produce plausible-sounding but incorrect answers. This is the empirical basis for HTSA's LLM guard rails: formal causal operations must not be delegated to the LLM.

**2. LLMs Are Reliable for Qualitative Generation, Not Quantitative Computation:**  
The same evaluation finds that LLMs perform substantially better on open-ended hypothesis generation tasks (EXPAND-like: "what could cause this system to fail?") and evidence interpretation ("does this log entry support or contradict this hypothesis?"). The failure pattern is consistent: LLMs are unreliable when the task requires satisfying formal constraints (bounds, monotonicity, AC3 minimality) and reliable when the task is generative or classification-based with fuzzy boundaries.

**3. Confidence Calibration Inverts for Formal Tasks:**  
LLMs express highest confidence on formal causal tasks where they are most wrong. A model that says "I'm 95% confident the PNS bounds are [0.4, 0.7]" is wrong more often than a model expressing 60% confidence. This means LLM self-reported confidence is not a useful signal for detecting when to reject the output on formal tasks. The only reliable guard rail is structural: do not route formal computations to the LLM at all.

---

## HTSA Files Affected

- `engine/htsa_engine/llm/advisor.py` — `_RESTRICTED_OPERATIONS`, `_guard()` method, docstring rationale
- `math/09_causation_theory.md` — note on LLM limitations in causation tasks

---

## Cross-links

- No gap file — Kim et al. provides the empirical rationale for a design constraint (Phase 6) rather than closing a mathematical gap
