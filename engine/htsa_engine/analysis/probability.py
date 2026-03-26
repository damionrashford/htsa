"""
Probability engine — Bayesian updating, entropy tracking, and pruning.

Implements Definitions 6-8, 10 from the formal spec.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field

from ..core import (
    Evidence,
    EvidenceDirection,
    InvestigationGraph,
    Node,
    NodeStatus,
)


@dataclass
class PruningRecord:
    node_id: str
    probability_at_pruning: float
    reason: str
    evidence_ids: list[str] = field(default_factory=list)


class ProbabilityEngine:
    """
    Manages probability distributions across the investigation graph.

    Key invariant: sibling probabilities (children of the same parent)
    must sum to 1.0 after every update. This engine enforces that.
    """

    def __init__(self, pruning_threshold: float = 0.05) -> None:
        self.pruning_threshold = pruning_threshold
        self.pruning_log: list[PruningRecord] = []
        self._entropy_history: list[float] = []

    # -- Prior assignment (Definition 6) --

    def set_uniform_priors(self, graph: InvestigationGraph, parent_id: str) -> None:
        """Assign equal priors to all children of a node."""
        children = graph.children(parent_id)
        active = [c for c in children if c.status == NodeStatus.OPEN]
        if not active:
            return
        p = 1.0 / len(active)
        for child in active:
            child.probability = p

    def set_priors(
        self, graph: InvestigationGraph, priors: dict[str, float]
    ) -> None:
        """
        Set explicit priors. Keys are node IDs, values are probabilities.
        Normalizes to sum to 1.0 within each sibling group.
        """
        # Group by parent
        groups: dict[str | None, list[str]] = {}
        for nid in priors:
            pid = graph.parent_id(nid)
            groups.setdefault(pid, []).append(nid)

        for pid, nids in groups.items():
            total = sum(priors[nid] for nid in nids)
            if total <= 0:
                continue
            for nid in nids:
                graph.get_node(nid).probability = priors[nid] / total

    # -- Bayesian update (Definition 7) --

    def bayesian_update(
        self,
        graph: InvestigationGraph,
        node_id: str,
        evidence: Evidence,
        likelihood: float,
        likelihood_complement: float,
    ) -> float:
        """
        Update P(node | evidence) using Bayes' theorem.

        P(H|E) = P(E|H) * P(H) / P(E)
        where P(E) = P(E|H)*P(H) + P(E|~H)*P(~H)

        After updating the target node, re-normalizes all siblings
        so the group still sums to 1.0.
        """
        node = graph.get_node(node_id)
        prior = node.probability

        # Marginal P(E)
        marginal = likelihood * prior + likelihood_complement * (1.0 - prior)
        if marginal == 0:
            return prior

        # Posterior
        posterior = (likelihood * prior) / marginal
        node.probability = posterior

        # Re-normalize siblings
        self._renormalize_siblings(graph, node_id)

        # Record entropy
        self._entropy_history.append(self.entropy(graph))

        return posterior

    def update_from_evidence(
        self,
        graph: InvestigationGraph,
        node_id: str,
        evidence: Evidence,
        likelihood: float | None = None,
        likelihood_complement: float | None = None,
    ) -> float:
        """
        Convenience method that adds evidence to the node and updates probability.

        If likelihoods aren't provided, estimates them from evidence tier and direction.
        """
        node = graph.get_node(node_id)
        node.evidence.append(evidence)

        if likelihood is None or likelihood_complement is None:
            likelihood, likelihood_complement = self._estimate_likelihoods(evidence)

        return self.bayesian_update(
            graph, node_id, evidence, likelihood, likelihood_complement
        )

    # -- Pruning (Definition 10) --

    def check_and_prune(
        self, graph: InvestigationGraph, node_id: str, reason: str = ""
    ) -> bool:
        """
        Check if a node's probability is below the pruning threshold.
        If so, prune it (mark as PRUNED, record in log).

        Returns True if the node was pruned.
        """
        node = graph.get_node(node_id)
        if node.probability < self.pruning_threshold:
            node.pruned_probability = node.probability
            node.status = NodeStatus.PRUNED
            self.pruning_log.append(
                PruningRecord(
                    node_id=node_id,
                    probability_at_pruning=node.probability,
                    reason=reason or f"P={node.probability:.4f} < threshold={self.pruning_threshold}",
                    evidence_ids=[e.id for e in node.evidence],
                )
            )
            self._renormalize_siblings(graph, node_id)
            return True
        return False

    def restore_pruned(
        self, graph: InvestigationGraph, node_id: str, new_probability: float
    ) -> None:
        """
        Un-prune a node if new evidence raises its probability above threshold.
        Subject to MAX_REOPEN bound (checked by caller).
        """
        node = graph.get_node(node_id)
        if node.status != NodeStatus.PRUNED:
            raise ValueError(f"Node {node_id} is not pruned")
        node.status = NodeStatus.OPEN
        node.probability = new_probability
        node.pruned_probability = None
        node.reopen_count += 1
        self._renormalize_siblings(graph, node_id)

    # -- Entropy (Definition 8) --

    def entropy(self, graph: InvestigationGraph) -> float:
        """
        H(G) = -sum(P(vi) * log2(P(vi))) over frontier nodes.

        Frontier = unexpanded OPEN leaves.
        """
        frontier = graph.frontier_nodes()
        if not frontier:
            return 0.0
        h = 0.0
        for node in frontier:
            if node.probability > 0:
                h -= node.probability * math.log2(node.probability)
        return h

    def entropy_over_all_active(self, graph: InvestigationGraph) -> float:
        """Entropy over all active (non-pruned) nodes, not just frontier."""
        active = graph.active_nodes()
        if not active:
            return 0.0
        h = 0.0
        for node in active:
            if node.probability > 0:
                h -= node.probability * math.log2(node.probability)
        return h

    def information_gain(self) -> float:
        """Entropy drop from the last update."""
        if len(self._entropy_history) < 2:
            return 0.0
        return self._entropy_history[-2] - self._entropy_history[-1]

    @property
    def entropy_history(self) -> list[float]:
        return list(self._entropy_history)

    def record_entropy(self, graph: InvestigationGraph) -> float:
        h = self.entropy(graph)
        self._entropy_history.append(h)
        return h

    # -- Internal helpers --

    def _renormalize_siblings(
        self, graph: InvestigationGraph, node_id: str
    ) -> None:
        """
        After updating one node's probability, re-normalize its sibling group
        so active siblings sum to 1.0.
        """
        group = graph.sibling_group(node_id)
        active = [n for n in group if n.status == NodeStatus.OPEN or n.status == NodeStatus.ROOT_CAUSE]
        total = sum(n.probability for n in active)
        if total <= 0 or len(active) <= 1:
            return
        for n in active:
            n.probability = n.probability / total

    def _estimate_likelihoods(
        self, evidence: Evidence
    ) -> tuple[float, float]:
        """
        Estimate P(E|H) and P(E|~H) from evidence tier and direction.

        Higher-tier evidence produces stronger likelihood ratios.
        Supporting evidence makes the hypothesis more likely.
        Contradicting evidence makes it less likely.
        """
        # Base likelihood ratio by tier
        tier_strength = {
            1: 0.90,  # physical — very diagnostic
            2: 0.75,  # observational
            3: 0.60,  # inferential
            4: 0.45,  # testimonial — weakly diagnostic
        }
        strength = tier_strength.get(evidence.tier.value, 0.5)

        if evidence.direction == EvidenceDirection.SUPPORTS:
            return strength, 1.0 - strength
        else:
            return 1.0 - strength, strength
