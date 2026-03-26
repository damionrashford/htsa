"""
Bias guard — pattern-based detection of the 7 cognitive hazards.

These are heuristic checks, not guarantees. They catch the most
common investigation failures and surface warnings.

Some checks (attribution, premature closure) can BLOCK actions.
Others (confirmation, groupthink) produce WARNINGS.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum

from ..core import (
    EvidenceDirection,
    InvestigationGraph,
    NodeStatus,
)


class BiasType(Enum):
    CONFIRMATION = "confirmation"
    AVAILABILITY = "availability"
    ATTRIBUTION = "attribution"
    SUNK_COST = "sunk_cost"
    GROUPTHINK = "groupthink"
    ANCHORING = "anchoring"
    PREMATURE_CLOSURE = "premature_closure"


class AlertLevel(Enum):
    WARNING = "warning"   # informational, does not block
    BLOCK = "block"       # prevents the action until resolved


@dataclass
class BiasAlert:
    bias_type: BiasType
    level: AlertLevel
    message: str
    node_id: str | None = None


class BiasGuard:
    """
    Scans investigation state for cognitive bias patterns.

    Call check_all() periodically, or use individual checks
    at specific decision points.
    """

    def check_all(
        self,
        graph: InvestigationGraph,
        situation_complete: bool = True,
    ) -> list[BiasAlert]:
        """Run all bias checks and return any alerts."""
        alerts: list[BiasAlert] = []
        alerts.extend(self.check_confirmation(graph))
        alerts.extend(self.check_attribution(graph))
        alerts.extend(self.check_availability(graph))
        alerts.extend(self.check_groupthink(graph))
        alerts.extend(self.check_premature_closure(graph))
        if not situation_complete:
            alerts.extend(self.check_anchoring(graph))
        return alerts

    def check_confirmation(self, graph: InvestigationGraph) -> list[BiasAlert]:
        """
        Confirmation bias: only supporting evidence exists for the leading hypothesis.

        Checks if the highest-probability active node has zero contradicting evidence
        while having 3+ pieces of supporting evidence. Suggests actively seeking
        disconfirming evidence.
        """
        alerts: list[BiasAlert] = []
        active = graph.active_nodes()
        if not active:
            return alerts

        leader = max(active, key=lambda n: n.probability)
        supporting = [
            e for e in leader.evidence
            if e.direction == EvidenceDirection.SUPPORTS
        ]
        contradicting = [
            e for e in leader.evidence
            if e.direction == EvidenceDirection.CONTRADICTS
        ]

        if len(supporting) >= 3 and len(contradicting) == 0:
            alerts.append(BiasAlert(
                bias_type=BiasType.CONFIRMATION,
                level=AlertLevel.WARNING,
                message=(
                    f"Leading hypothesis '{leader.statement}' (P={leader.probability:.2f}) "
                    f"has {len(supporting)} supporting evidence items and zero contradicting. "
                    f"Actively seek evidence that would disprove this hypothesis."
                ),
                node_id=leader.id,
            ))
        return alerts

    def check_attribution(self, graph: InvestigationGraph) -> list[BiasAlert]:
        """
        Attribution bias: a Why answer names a person as the cause.

        Any node whose statement looks like it blames an individual
        should trigger "ask Why once more" to find the system.
        """
        alerts: list[BiasAlert] = []
        person_indicators = [
            "didn't follow", "forgot to", "failed to", "should have",
            "neglected", "wasn't careful", "made a mistake", "human error",
            "operator error", "user error",
        ]
        for node in graph.active_nodes():
            stmt_lower = node.statement.lower()
            if any(indicator in stmt_lower for indicator in person_indicators):
                alerts.append(BiasAlert(
                    bias_type=BiasType.ATTRIBUTION,
                    level=AlertLevel.WARNING,
                    message=(
                        f"Node '{node.statement}' appears to attribute cause to a person. "
                        f"Ask Why once more — find the system, process, or missing guardrail."
                    ),
                    node_id=node.id,
                ))
        return alerts

    def check_availability(self, graph: InvestigationGraph) -> list[BiasAlert]:
        """
        Availability bias: priors reflect recent memory, not actual base rates.

        Detects when the leading hypothesis has a high prior (> 0.50) but
        its only evidence is Tier 3/4 (inferential or testimonial). Strong
        priors should be backed by Tier 1/2 base rate data, not gut feeling.
        """
        alerts: list[BiasAlert] = []
        active = graph.active_nodes()
        if len(active) < 2:
            return alerts

        leader = max(active, key=lambda n: n.probability)
        if leader.probability <= 0.50:
            return alerts

        # Check if the leader has ANY Tier 1/2 evidence
        has_strong_evidence = any(
            e.tier.value <= 2 for e in leader.evidence
        )
        # Check if it has ONLY weak evidence (Tier 3/4)
        has_only_weak = (
            len(leader.evidence) > 0
            and all(e.tier.value >= 3 for e in leader.evidence)
        )

        if not has_strong_evidence and (not leader.evidence or has_only_weak):
            alerts.append(BiasAlert(
                bias_type=BiasType.AVAILABILITY,
                level=AlertLevel.WARNING,
                message=(
                    f"Leading hypothesis '{leader.statement}' has P={leader.probability:.2f} "
                    f"but no Tier 1/2 evidence supporting the prior. "
                    f"Priors should come from documented base rates, not recent memory. "
                    f"Can you cite the source of this prior?"
                ),
                node_id=leader.id,
            ))
        return alerts

    def check_sunk_cost(
        self,
        graph: InvestigationGraph,
        node_id: str,
        time_spent: float,
        threshold_minutes: float = 30.0,
    ) -> list[BiasAlert]:
        """
        Sunk cost: significant time invested in a branch with low probability.

        Triggers when a branch has consumed substantial time but its probability
        has dropped significantly.
        """
        alerts: list[BiasAlert] = []
        node = graph.get_node(node_id)
        if time_spent > threshold_minutes and node.probability < 0.15:
            alerts.append(BiasAlert(
                bias_type=BiasType.SUNK_COST,
                level=AlertLevel.WARNING,
                message=(
                    f"Branch '{node.statement}' has P={node.probability:.2f} "
                    f"after {time_spent:.0f} minutes invested. "
                    f"Consider pruning — follow the threshold, not the investment."
                ),
                node_id=node.id,
            ))
        return alerts

    def check_groupthink(self, graph: InvestigationGraph) -> list[BiasAlert]:
        """
        Groupthink: entropy is near-zero before sufficient evidence exists.

        If one hypothesis dominates (P > 0.80) but has no Tier 1/2 evidence,
        the convergence is likely social, not evidential.
        """
        alerts: list[BiasAlert] = []
        active = graph.active_nodes()
        if not active:
            return alerts

        leader = max(active, key=lambda n: n.probability)
        has_strong_evidence = any(
            e.tier.value <= 2 and e.direction == EvidenceDirection.SUPPORTS
            for e in leader.evidence
        )

        if leader.probability > 0.80 and not has_strong_evidence:
            alerts.append(BiasAlert(
                bias_type=BiasType.GROUPTHINK,
                level=AlertLevel.WARNING,
                message=(
                    f"Hypothesis '{leader.statement}' dominates at P={leader.probability:.2f} "
                    f"but lacks Tier 1/2 supporting evidence. "
                    f"Convergence may be social consensus, not evidence-based. "
                    f"Assign an adversarial investigator to pursue alternatives."
                ),
                node_id=leader.id,
            ))
        return alerts

    def check_anchoring(self, graph: InvestigationGraph) -> list[BiasAlert]:
        """
        Anchoring: hypothesis named before the 5 Ws are complete.

        This check is triggered when situation_complete=False is passed
        to check_all(), meaning the caller started Layer 2 before
        finishing Layer 1.
        """
        alerts: list[BiasAlert] = []
        if graph.origin and len(graph.all_nodes()) > 1:
            alerts.append(BiasAlert(
                bias_type=BiasType.ANCHORING,
                level=AlertLevel.BLOCK,
                message=(
                    "Causal hypotheses are being generated before the Situation Map "
                    "(5 Ws) is complete. Complete all 5 Ws before starting the Why chain. "
                    "This is the #1 cause of investigating the wrong problem."
                ),
            ))
        return alerts

    def check_premature_closure(
        self, graph: InvestigationGraph
    ) -> list[BiasAlert]:
        """
        Premature closure: a node is marked as root cause but
        depth criteria are not all evaluated or not all passing.
        """
        alerts: list[BiasAlert] = []
        for node in graph.all_nodes():
            if node.status == NodeStatus.ROOT_CAUSE:
                dc = node.depth_criteria
                if not dc.all_evaluated:
                    alerts.append(BiasAlert(
                        bias_type=BiasType.PREMATURE_CLOSURE,
                        level=AlertLevel.BLOCK,
                        message=(
                            f"Node '{node.statement}' is marked as root cause but "
                            f"not all depth criteria have been evaluated. "
                            f"All four tests must pass before closing the chain."
                        ),
                        node_id=node.id,
                    ))
                elif not dc.all_passed:
                    alerts.append(BiasAlert(
                        bias_type=BiasType.PREMATURE_CLOSURE,
                        level=AlertLevel.BLOCK,
                        message=(
                            f"Node '{node.statement}' is marked as root cause but "
                            f"not all depth criteria pass. Three out of four is not enough."
                        ),
                        node_id=node.id,
                    ))
        return alerts
