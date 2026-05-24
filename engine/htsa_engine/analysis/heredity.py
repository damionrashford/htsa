"""
Heredity prior propagation — BayesFLo-inspired ancestor-informed priors.

References:
  Ji et al. (2024) BayesFLo: Bayesian fault localization — ancestor priors
  math/05_bayesian_reasoning.md §§ prior propagation

Key insight from BayesFLo heredity:
  If a parent node has low posterior probability (i.e., unlikely to be the
  root cause), its children should inherit a discounted prior. Conversely,
  if the parent has high posterior, children are elevated relative to their
  siblings.

  This prevents the engine from deeply expanding branches that are already
  low-probability at the parent level, while focusing resources on branches
  where the parent evidence is strong.

Heredity rule:
  prior(child) = parent_posterior × base_prior
  sibling_discount: if a sibling is confirmed (high posterior), all other
    siblings' priors are discounted by (1 - sibling_posterior).
"""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from ..core.graph import InvestigationGraph
    from ..core.models import Node


# ---------------------------------------------------------------------------
# HeredityPriorCalculator
# ---------------------------------------------------------------------------

class HeredityPriorCalculator:
    """
    Adjusts node priors based on ancestor posterior probabilities.

    Two operations:
      elevate_children: set each child's prior = parent.probability × child.probability
      discount_siblings_of_confirmed: when one sibling is high-posterior, reduce others

    Neither operation overwrites Bayesian-updated posteriors — only the
    initial prior before evidence is attached. Call before the first evidence
    update on new child nodes.
    """

    def __init__(self, graph: "InvestigationGraph") -> None:
        self._g = graph

    def elevate_children(self, parent_id: str) -> dict[str, float]:
        """
        For each child of parent_id, set its prior to:
            child.probability = parent.probability × child.probability

        This propagates the parent's credibility downward. Returns a dict
        {child_id: new_prior} of the adjustments made.

        Rationale: if parent has P=0.3 (unlikely), expanding its children
        at their raw prior (say P=0.5) overestimates their plausibility.
        The product P_parent × P_child_raw gives a more calibrated prior.
        """
        parent = self._g.get_node(parent_id)
        adjustments: dict[str, float] = {}

        for child in self._g.children(parent_id):
            adjusted = parent.probability * child.probability
            child.probability = adjusted
            adjustments[child.id] = adjusted

        return adjustments

    def discount_siblings_of_confirmed(
        self,
        confirmed_sibling_id: str,
        discount_threshold: float = 0.70,
    ) -> dict[str, float]:
        """
        When one sibling reaches high posterior, reduce all other siblings.

        If confirmed_sibling.probability >= discount_threshold:
          other_sibling.probability *= (1 - confirmed_sibling.probability)

        This reflects the intuition: if sibling A is almost certainly the
        root cause (P=0.85), the probability that sibling B is ALSO a root
        cause is reduced by the "already explained" mass.

        Returns {sibling_id: new_prior} for the discounted siblings.
        """
        confirmed = self._g.get_node(confirmed_sibling_id)
        if confirmed.probability < discount_threshold:
            return {}

        siblings = self._g.siblings(confirmed_sibling_id)
        adjustments: dict[str, float] = {}

        for sibling in siblings:
            discount_factor = 1.0 - confirmed.probability
            sibling.probability = sibling.probability * discount_factor
            adjustments[sibling.id] = sibling.probability

        return adjustments

    def propagate_from_root(self, max_depth: int = 5) -> int:
        """
        Run elevate_children from the origin node downward, level by level.

        BFS traversal: processes each level before descending. Stops at
        max_depth to prevent unbounded propagation in deep graphs.

        Returns the number of nodes whose priors were adjusted.
        """
        if self._g.origin_id is None:
            return 0

        adjusted_count = 0
        visited: set[str] = set()
        queue: list[tuple[str, int]] = [(self._g.origin_id, 0)]

        while queue:
            current_id, depth = queue.pop(0)
            if current_id in visited or depth >= max_depth:
                continue
            visited.add(current_id)

            adj = self.elevate_children(current_id)
            adjusted_count += len(adj)

            for child_id in self._g.children_ids(current_id):
                queue.append((child_id, depth + 1))

        return adjusted_count

    def compute_heredity_prior(
        self,
        node_id: str,
        base_prior: float = 0.5,
    ) -> float:
        """
        Compute the heredity-adjusted prior for a NEW node to be added under node_id.

        prior = ancestor_chain_product × base_prior

        ancestor_chain_product = ∏ ancestor.probability (from root to node_id)

        This is the prior to assign to the child BEFORE it is added to the graph.
        """
        product = base_prior
        current_id: str | None = node_id

        while current_id is not None:
            node = self._g.get_node(current_id)
            product *= node.probability
            current_id = self._g.parent_id(current_id)

        return max(0.0, min(1.0, product))
