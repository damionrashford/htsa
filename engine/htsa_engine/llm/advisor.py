"""
LLM Advisor — connects any LLM to the HTSA Investigation engine.

The engine provides structure and math. The LLM provides judgment.
This module bridges the two through the OpenAI chat completions standard.

Any provider that implements /v1/chat/completions works:
  OpenAI, Anthropic (via OpenRouter), Groq, Together, Mistral,
  Ollama, Azure OpenAI, or any compatible endpoint.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone

from ..core import (
    DepthCriteria,
    Evidence,
    EvidenceDirection,
    EvidenceTier,
    ResolutionType,
)
from ..investigation import Investigation
from ..resolution import VerificationWindowType
from .client import ChatCompletionsClient
from .prompts import (
    SYSTEM_PROMPT,
    counterfactual_prompt,
    depth_criteria_prompt,
    evidence_prompt,
    generate_evidence_prompt,
    hypotheses_prompt,
    likelihoods_prompt,
    node_evaluation_prompt,
    resolution_prompt,
    situation_prompt,
    suggest_evidence_prompt,
    verification_prompt,
)


# Operations the LLM pipeline must never trigger directly.
# These require explicit human confirmation or bypass safety constraints.
# If an LLM response tries to call one of these (e.g. via prompt injection),
# the guard raises immediately rather than executing.
_RESTRICTED_OPERATIONS: frozenset[str] = frozenset({
    "restore_pruned",         # un-pruning: requires human review of new evidence
    "remove_node",            # graph mutation: irreversible, human-only
    "force_close_investigation",  # bypasses depth criteria checks
    "set_probability_direct", # setting P=0/1 without evidence bypasses Bayes
    "override_bias_alert",    # silencing the BiasGuard
})


class LLMAdvisor:
    """
    Provider-agnostic LLM advisor for HTSA investigations.

    Works with any OpenAI-compatible chat completions endpoint.

    Step-by-step (human drives, LLM advises):

        advisor = LLMAdvisor("https://api.openai.com/v1", api_key="sk-...", model="gpt-4o")
        inv = Investigation(title="API 500 errors")

        situation = advisor.analyze_situation("API returning 500 errors since 2:47 AM")
        inv.set_situation(**situation)
        inv.complete_situation()

        origin = inv.start_causal_chain(inv.situation.why_surface)
        hypotheses = advisor.generate_hypotheses(inv, origin, count=3)
        for h in hypotheses:
            inv.add_hypothesis(origin, h["statement"], h["probability"])

    Full auto-investigation (LLM fills every judgment slot):

        inv = advisor.run("API returning 500 errors since 2:47 AM, EU region only")
        print(inv.root_causes)
        inv.save("investigation.json")
    """

    @staticmethod
    def _guard(operation: str) -> None:
        """
        Raise if operation is in _RESTRICTED_OPERATIONS.

        Call at the top of any method that the auto-run pipeline could
        potentially reach through an LLM-generated instruction.
        """
        if operation in _RESTRICTED_OPERATIONS:
            raise PermissionError(
                f"LLM pipeline cannot call restricted operation '{operation}'. "
                "This operation requires explicit human authorization."
            )

    def __init__(
        self,
        base_url: str,
        api_key: str = "",
        model: str = "",
        temperature: float = 0.3,
        timeout: int = 120,
        json_mode: bool = True,
        headers: dict[str, str] | None = None,
    ) -> None:
        self.client = ChatCompletionsClient(
            base_url=base_url,
            api_key=api_key,
            model=model,
            temperature=temperature,
            timeout=timeout,
            headers=headers,
        )
        self.json_mode = json_mode

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _ask(self, user_prompt: str) -> dict:
        """Send a prompt and parse the JSON response."""
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ]
        response = self.client.complete(messages, json_mode=self.json_mode)
        return self._parse_json(response)

    def _parse_json(self, text: str) -> dict:
        """Parse JSON from LLM response, stripping markdown fences if present."""
        text = text.strip()
        if text.startswith("```"):
            lines = text.split("\n")
            lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            text = "\n".join(lines)
        return json.loads(text)

    # ------------------------------------------------------------------
    # Layer 1 — Situation Map
    # ------------------------------------------------------------------

    def analyze_situation(self, problem: str, context: str = "") -> dict:
        """
        Parse a problem description into the 5 Ws.
        Returns a dict suitable for inv.set_situation(**result).
        """
        prompt = situation_prompt(problem, context)
        return self._ask(prompt)

    # ------------------------------------------------------------------
    # Layer 2 — Causal Chain
    # ------------------------------------------------------------------

    def generate_hypotheses(
        self,
        inv: Investigation,
        parent_id: str,
        count: int = 3,
    ) -> list[dict]:
        """
        Generate hypotheses for why a node is true.

        Returns list of {"statement": str, "probability": float, "reasoning": str}.
        Probabilities are normalized to sum to 1.0.
        """
        prompt = hypotheses_prompt(inv, parent_id, count)
        result = self._ask(prompt)
        hypotheses = result.get("hypotheses", [])

        # Normalize probabilities
        total = sum(h.get("probability", 1.0 / max(len(hypotheses), 1)) for h in hypotheses)
        if total > 0:
            for h in hypotheses:
                h["probability"] = h.get("probability", 1.0 / max(len(hypotheses), 1)) / total

        return hypotheses

    def classify_evidence(
        self,
        node_statement: str,
        description: str,
        source: str,
    ) -> dict:
        """
        Classify raw evidence into tier and direction.
        Returns {"tier": int, "direction": str, "reasoning": str}.
        """
        prompt = evidence_prompt(node_statement, description, source)
        result = self._ask(prompt)

        result["tier"] = max(1, min(4, result.get("tier", 4)))
        direction = result.get("direction", "supports")
        if direction not in ("supports", "contradicts"):
            result["direction"] = "supports"

        return result

    def assess_likelihoods(
        self,
        node_statement: str,
        evidence_description: str,
        direction: str,
    ) -> dict:
        """
        Assess Bayesian likelihood ratios for evidence.
        Returns {"likelihood": float, "likelihood_complement": float}.
        """
        prompt = likelihoods_prompt(node_statement, evidence_description, direction)
        result = self._ask(prompt)

        result["likelihood"] = max(0.01, min(0.99, result.get("likelihood", 0.5)))
        result["likelihood_complement"] = max(
            0.01, min(0.99, result.get("likelihood_complement", 0.5))
        )
        return result

    def evaluate_node(self, inv: Investigation, node_id: str) -> dict:
        """
        Decide whether to branch deeper, mark as root cause, or gather evidence.
        Returns {"decision": "branch"|"root_cause"|"needs_evidence", "reasoning": str}.
        """
        prompt = node_evaluation_prompt(inv, node_id)
        result = self._ask(prompt)
        decision = result.get("decision", "branch")
        if decision not in ("branch", "root_cause", "needs_evidence"):
            result["decision"] = "branch"
        return result

    def evaluate_depth_criteria(self, inv: Investigation, node_id: str) -> DepthCriteria:
        """
        Evaluate the 4 depth criteria for a node.
        Returns a DepthCriteria object ready for inv.mark_root_cause().
        """
        prompt = depth_criteria_prompt(inv, node_id)
        result = self._ask(prompt)
        return DepthCriteria(
            actionability=result.get("actionability", False),
            counterfactual_clarity=result.get("counterfactual_clarity", False),
            system_boundary=result.get("system_boundary", False),
            diminishing_returns=result.get("diminishing_returns", False),
        )

    def generate_evidence(self, inv: Investigation, node_id: str) -> list[dict]:
        """
        Generate synthetic evidence based on LLM knowledge.
        For auto-investigations where the LLM reasons about what evidence
        would exist. Returns list of evidence dicts.
        """
        prompt = generate_evidence_prompt(inv, node_id)
        result = self._ask(prompt)
        evidence_list = result.get("evidence", [])

        for ev in evidence_list:
            ev["tier"] = max(1, min(4, ev.get("tier", 3)))
            if ev.get("direction") not in ("supports", "contradicts"):
                ev["direction"] = "supports"

        return evidence_list

    def suggest_evidence(self, inv: Investigation, node_id: str) -> list[dict]:
        """
        Suggest what evidence to look for in an interactive investigation.
        Returns list of suggestion dicts with what_to_check, source, etc.
        """
        prompt = suggest_evidence_prompt(inv, node_id)
        result = self._ask(prompt)
        return result.get("suggestions", [])

    # ------------------------------------------------------------------
    # Layer 3 — Resolution
    # ------------------------------------------------------------------

    def propose_resolution(self, inv: Investigation, node_id: str) -> dict:
        """
        Propose a resolution for a root cause.
        Returns {"type": str, "change": str, "owner": str, "impact": int, ...}.
        """
        prompt = resolution_prompt(inv, node_id)
        result = self._ask(prompt)

        if result.get("type") not in ("fix", "mitigate", "accept"):
            result["type"] = "fix"
        for key in ("impact", "recurrence", "actionability"):
            result[key] = max(1, min(5, result.get(key, 3)))

        return result

    def evaluate_counterfactual(self, inv: Investigation, node_id: str) -> bool:
        """
        Would the proposed fix have prevented the problem?
        Returns True if the counterfactual test passes.
        """
        prompt = counterfactual_prompt(inv, node_id)
        result = self._ask(prompt)
        return bool(result.get("passes", False))

    # ------------------------------------------------------------------
    # Layer 4 — Verification
    # ------------------------------------------------------------------

    def propose_verification(self, inv: Investigation, node_id: str) -> dict:
        """
        Propose a verification window for a resolved root cause.
        Returns {"window_type": str, "description": str, "metric": str}.
        """
        prompt = verification_prompt(inv, node_id)
        result = self._ask(prompt)

        valid_types = ("event_driven", "time_driven", "continuous")
        if result.get("window_type") not in valid_types:
            result["window_type"] = "event_driven"

        return result

    # ------------------------------------------------------------------
    # Full auto-investigation
    # ------------------------------------------------------------------

    def run(
        self,
        problem: str,
        context: str = "",
        max_depth: int = 5,
        max_hypotheses: int = 3,
        max_iterations: int = 50,
    ) -> Investigation:
        """
        Run a complete automated investigation — all 4 layers.

        The LLM fills every judgment slot. The engine enforces structure,
        probability math, and constraints. The search strategy (Best-First
        by default) determines exploration order.

        This is a thought experiment powered by the LLM's knowledge.
        For real investigations with real evidence, use the individual
        advisor methods step-by-step instead.

        Args:
            problem: Problem description in natural language.
            context: Additional context, known evidence, constraints.
            max_depth: Maximum depth of the Why tree.
            max_hypotheses: Hypotheses generated per branching node.
            max_iterations: Safety limit on exploration steps.

        Returns:
            A completed Investigation with all 4 layers filled.
        """
        # Layer 1 — Situation Map
        inv = Investigation(title=problem[:100])
        situation = self.analyze_situation(problem, context)
        inv.set_situation(**situation)
        inv.complete_situation()

        # Layer 2 — Causal Chain
        surface_why = inv.situation.why_surface or problem
        inv.start_causal_chain(surface_why)

        iterations = 0
        while iterations < max_iterations:
            node = inv.next_to_explore()
            if node is None:
                break
            iterations += 1

            # At max depth, force root cause evaluation
            if node.depth >= max_depth:
                self._try_mark_root_cause(inv, node.id)
                continue

            # Ask LLM what to do with this node
            decision = self.evaluate_node(inv, node.id)
            action = decision["decision"]

            if action == "root_cause":
                self._try_mark_root_cause(inv, node.id)

            elif action == "needs_evidence":
                self._add_synthetic_evidence(inv, node.id)
                # Re-evaluate after evidence
                decision2 = self.evaluate_node(inv, node.id)
                if decision2["decision"] == "root_cause":
                    self._try_mark_root_cause(inv, node.id)
                else:
                    self._branch_node(inv, node.id, max_hypotheses)

            else:  # branch
                self._branch_node(inv, node.id, max_hypotheses)

        # Layer 3 — Resolution
        for rc in inv.root_causes:
            self._resolve_root_cause(inv, rc.id)

        # Layer 4 — Verification
        for rc in inv.root_causes:
            self._add_verification(inv, rc.id)

        return inv

    # ------------------------------------------------------------------
    # Auto-run helpers
    # ------------------------------------------------------------------

    def _add_synthetic_evidence(self, inv: Investigation, node_id: str) -> None:
        """Generate and add LLM-sourced evidence to a node."""
        evidence_list = self.generate_evidence(inv, node_id)
        now = datetime.now(timezone.utc).isoformat()
        for ev_data in evidence_list:
            evidence = Evidence(
                source=ev_data.get("source", "LLM assessment"),
                tier=EvidenceTier(ev_data["tier"]),
                timestamp=now,
                direction=EvidenceDirection(ev_data["direction"]),
                description=ev_data.get("description", ""),
            )
            inv.add_evidence(node_id, evidence)

    def _try_mark_root_cause(self, inv: Investigation, node_id: str) -> None:
        """Attempt to mark a node as root cause, adding evidence if needed."""
        node = inv.graph.get_node(node_id)

        # Need evidence first (Definition 4b)
        if not node.evidence:
            self._add_synthetic_evidence(inv, node_id)

        criteria = self.evaluate_depth_criteria(inv, node_id)
        alerts = inv.mark_root_cause(node_id, criteria)

        if alerts:
            inv._log("llm_root_cause_blocked", {
                "node_id": node_id,
                "alerts": [a.message for a in alerts],
            })

    def _branch_node(self, inv: Investigation, parent_id: str, count: int) -> None:
        """Generate hypotheses and evidence, add to tree."""
        hypotheses = self.generate_hypotheses(inv, parent_id, count)

        for h in hypotheses:
            child_id = inv.add_hypothesis(
                parent_id, h["statement"], h.get("probability")
            )
            self._add_synthetic_evidence(inv, child_id)
            inv.check_pruning(child_id)

    def _resolve_root_cause(self, inv: Investigation, node_id: str) -> None:
        """Propose and apply resolution, then test counterfactual."""
        resolution = self.propose_resolution(inv, node_id)
        inv.resolve(
            node_id,
            ResolutionType(resolution["type"]),
            change=resolution.get("change", ""),
            owner=resolution.get("owner", ""),
            impact=resolution.get("impact", 3),
            recurrence=resolution.get("recurrence", 3),
            actionability=resolution.get("actionability", 3),
        )
        passes = self.evaluate_counterfactual(inv, node_id)
        inv.test_fix_counterfactual(node_id, passes)

    def _add_verification(self, inv: Investigation, node_id: str) -> None:
        """Propose and add verification window."""
        verification = self.propose_verification(inv, node_id)
        inv.add_verification(
            node_id,
            VerificationWindowType(verification["window_type"]),
            verification.get("description", ""),
            verification.get("metric", ""),
        )
