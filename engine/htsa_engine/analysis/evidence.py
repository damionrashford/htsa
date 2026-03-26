"""
Evidence store — manages evidence collection, tier classification,
and the Temporal Firewall Protocol.

Evidence items are attached to nodes via the graph, but this module
provides collection-level operations: filtering, conflict detection,
and the pre/post investigation firewall.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime

from ..core import (
    Evidence,
    EvidenceDirection,
    EvidenceTier,
    InvestigationGraph,
    Node,
)


@dataclass
class TemporalFirewall:
    """
    Separates evidence collected before the investigation was announced
    from evidence collected after.

    POST-investigation evidence is subject to observer effects:
    people change behavior when they know they're being investigated.
    POST evidence receives a reliability discount.
    """

    investigation_start: str  # ISO timestamp
    reliability_discount: float = 0.5  # POST evidence weighted at 50%

    def classify(self, evidence: Evidence) -> str:
        """Returns 'PRE' or 'POST' based on evidence timestamp."""
        try:
            ev_time = datetime.fromisoformat(evidence.timestamp)
            start_time = datetime.fromisoformat(self.investigation_start)
            return "PRE" if ev_time < start_time else "POST"
        except (ValueError, TypeError):
            return "POST"  # if we can't parse, assume POST (conservative)

    def adjusted_weight(self, evidence: Evidence) -> float:
        """
        Returns the reliability weight adjusted for temporal firewall.
        POST evidence gets discounted.
        """
        base_weight = evidence.reliability_weight
        if self.classify(evidence) == "POST":
            return base_weight * self.reliability_discount
        return base_weight


class EvidenceStore:
    """
    Collection-level operations on evidence across the investigation.
    """

    def __init__(
        self, firewall: TemporalFirewall | None = None
    ) -> None:
        self.firewall = firewall

    def all_evidence(self, graph: InvestigationGraph) -> list[Evidence]:
        """Collect all evidence from all nodes."""
        result = []
        for node in graph.all_nodes():
            result.extend(node.evidence)
        return result

    def evidence_for_node(self, node: Node) -> list[Evidence]:
        return list(node.evidence)

    def supporting_evidence(self, node: Node) -> list[Evidence]:
        return [e for e in node.evidence if e.direction == EvidenceDirection.SUPPORTS]

    def contradicting_evidence(self, node: Node) -> list[Evidence]:
        return [e for e in node.evidence if e.direction == EvidenceDirection.CONTRADICTS]

    def highest_tier(self, node: Node) -> EvidenceTier | None:
        """Return the highest-quality (lowest number) evidence tier for a node."""
        if not node.evidence:
            return None
        return min(node.evidence, key=lambda e: e.tier.value).tier

    def has_tier1_or_2(self, node: Node) -> bool:
        """Does this node have Tier 1 or Tier 2 supporting evidence?"""
        return any(
            e.tier.value <= 2 and e.direction == EvidenceDirection.SUPPORTS
            for e in node.evidence
        )

    # -- Conflict detection --

    def has_conflicting_evidence(self, node: Node) -> bool:
        """Does this node have both supporting and contradicting evidence?"""
        has_support = any(
            e.direction == EvidenceDirection.SUPPORTS for e in node.evidence
        )
        has_contra = any(
            e.direction == EvidenceDirection.CONTRADICTS for e in node.evidence
        )
        return has_support and has_contra

    def net_evidence_weight(self, node: Node) -> float:
        """
        Net evidence weight: sum of supporting weights minus contradicting weights.
        Positive = evidence favors the claim. Negative = evidence opposes it.
        """
        total = 0.0
        for e in node.evidence:
            weight = e.reliability_weight
            if self.firewall:
                weight = self.firewall.adjusted_weight(e)
            if e.direction == EvidenceDirection.SUPPORTS:
                total += weight
            else:
                total -= weight
        return total

    # -- Temporal firewall queries --

    def pre_evidence(self, node: Node) -> list[Evidence]:
        """Evidence collected before the investigation started."""
        if not self.firewall:
            return list(node.evidence)
        return [e for e in node.evidence if self.firewall.classify(e) == "PRE"]

    def post_evidence(self, node: Node) -> list[Evidence]:
        """Evidence collected after the investigation started (subject to discount)."""
        if not self.firewall:
            return []
        return [e for e in node.evidence if self.firewall.classify(e) == "POST"]

    # -- Summary statistics --

    def evidence_summary(self, node: Node) -> dict:
        """Summary of evidence for a node."""
        supporting = self.supporting_evidence(node)
        contradicting = self.contradicting_evidence(node)
        return {
            "total": len(node.evidence),
            "supporting": len(supporting),
            "contradicting": len(contradicting),
            "highest_tier": self.highest_tier(node),
            "is_finding": node.is_finding,
            "has_conflict": self.has_conflicting_evidence(node),
            "net_weight": self.net_evidence_weight(node),
        }
