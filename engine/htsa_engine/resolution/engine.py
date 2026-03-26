"""
Resolution engine — Layer 3.

Maps root causes to resolutions (fix/mitigate/accept), runs the
counterfactual test on proposed fixes, classifies root cause
interactions, and computes priority scores.
"""

from __future__ import annotations

from dataclasses import dataclass

from ..core import (
    InvestigationGraph,
    InteractionType,
    Node,
    NodeStatus,
    Resolution,
    ResolutionType,
)


@dataclass
class RootCauseInteraction:
    """Describes an interaction between two root causes."""

    cause_a_id: str
    cause_b_id: str
    interaction_type: InteractionType
    description: str


class ResolutionEngine:
    """
    Layer 3 — maps root causes to resolutions and checks correctness.
    """

    MAX_REOPEN = 3

    def __init__(self) -> None:
        self.interactions: list[RootCauseInteraction] = []

    def resolve(
        self,
        graph: InvestigationGraph,
        node_id: str,
        resolution_type: ResolutionType,
        change: str,
        owner: str = "",
        deadline: str = "",
        counterfactual_passes: bool | None = None,
        impact: int = 0,
        recurrence: int = 0,
        actionability: int = 0,
    ) -> Resolution:
        """
        Assign a resolution to a root cause node.

        The node must already be marked as ROOT_CAUSE (depth criteria passed).
        """
        node = graph.get_node(node_id)
        if node.status != NodeStatus.ROOT_CAUSE:
            raise ValueError(
                f"Node {node_id} is not a confirmed root cause (status: {node.status})"
            )

        resolution = Resolution(
            type=resolution_type,
            change=change,
            owner=owner,
            deadline=deadline,
            counterfactual_passes=counterfactual_passes,
            priority_impact=impact,
            priority_recurrence=recurrence,
            priority_actionability=actionability,
        )
        node.resolution = resolution
        return resolution

    def check_counterfactual(
        self, graph: InvestigationGraph, node_id: str, passes: bool
    ) -> str | None:
        """
        Run the counterfactual test on a proposed fix.

        "If this fix had existed before the problem, would the problem
        still have happened?"

        If yes (passes=False) -> fix targets a symptom. Returns guidance.
        If no (passes=True) -> fix is correctly targeted. Returns None.
        """
        node = graph.get_node(node_id)
        if node.resolution:
            node.resolution.counterfactual_passes = passes

        if not passes:
            if node.reopen_count < self.MAX_REOPEN:
                node.reopen_count += 1
                node.status = NodeStatus.OPEN
                node.resolution = None
                return (
                    f"Fix targets a symptom, not the root cause. "
                    f"Node reopened (attempt {node.reopen_count}/{self.MAX_REOPEN}). "
                    f"Go deeper."
                )
            else:
                node.status = NodeStatus.ESCALATED
                return (
                    f"Fix failed counterfactual test {self.MAX_REOPEN} times. "
                    f"Escalated — requires a new, separate investigation."
                )
        return None

    def add_interaction(
        self,
        cause_a_id: str,
        cause_b_id: str,
        interaction_type: InteractionType,
        description: str,
    ) -> RootCauseInteraction:
        """Document an interaction between two root causes."""
        interaction = RootCauseInteraction(
            cause_a_id=cause_a_id,
            cause_b_id=cause_b_id,
            interaction_type=interaction_type,
            description=description,
        )
        self.interactions.append(interaction)
        return interaction

    def prioritize(self, graph: InvestigationGraph) -> list[tuple[Node, int]]:
        """
        Return root causes sorted by priority score (descending).

        Priority = Impact x Recurrence x Actionability (each 1-5).
        Within ~20%, treat as equal priority.
        """
        root_causes = graph.root_causes()
        scored = []
        for node in root_causes:
            if node.resolution:
                scored.append((node, node.resolution.priority_score))
            else:
                scored.append((node, 0))
        scored.sort(key=lambda x: x[1], reverse=True)
        return scored
