"""
Feedback loop handler — detection, documentation, and break point analysis.

The investigation graph is a DAG, but real causal systems can have cycles.
When a Why chain loops back to an earlier node, this module detects it
and helps the investigator choose where to break the cycle.
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class FeedbackLoop:
    """A detected causal cycle in the investigation."""

    cycle_nodes: list[str]          # ordered list of node IDs forming the cycle
    cycle_descriptions: list[str]   # human-readable description of each link
    break_points: list[BreakPoint] = field(default_factory=list)
    chosen_break_point: str | None = None  # node_id where the cycle is broken


@dataclass
class BreakPoint:
    """A candidate intervention point to break a feedback loop."""

    node_id: str
    description: str
    feasibility: str = ""           # how practical is this intervention
    rationale: str = ""             # why break here vs. elsewhere


class FeedbackLoopHandler:
    """
    Detects and manages feedback loops in the investigation.

    Feedback loops are documented as separate structures alongside the DAG.
    They cannot be represented in the DAG directly (cycles violate the
    acyclic property), so they are tracked here.
    """

    def __init__(self) -> None:
        self.loops: list[FeedbackLoop] = []

    def register_loop(
        self,
        cycle_nodes: list[str],
        cycle_descriptions: list[str],
    ) -> FeedbackLoop:
        """
        Register a detected feedback loop.

        Args:
            cycle_nodes: ordered node IDs forming the cycle
            cycle_descriptions: human-readable description of each causal link

        Returns:
            The created FeedbackLoop object.
        """
        loop = FeedbackLoop(
            cycle_nodes=cycle_nodes,
            cycle_descriptions=cycle_descriptions,
        )
        self.loops.append(loop)
        return loop

    def add_break_point(
        self,
        loop: FeedbackLoop,
        node_id: str,
        description: str,
        feasibility: str = "",
        rationale: str = "",
    ) -> BreakPoint:
        """Add a candidate break point to a feedback loop."""
        bp = BreakPoint(
            node_id=node_id,
            description=description,
            feasibility=feasibility,
            rationale=rationale,
        )
        loop.break_points.append(bp)
        return bp

    def choose_break_point(self, loop: FeedbackLoop, node_id: str) -> None:
        """
        Select the intervention point for breaking a loop.
        This is a modeling decision — document the rationale.
        """
        if not any(bp.node_id == node_id for bp in loop.break_points):
            raise ValueError(
                f"Node {node_id} is not a registered break point for this loop"
            )
        loop.chosen_break_point = node_id

    def has_loops(self) -> bool:
        return len(self.loops) > 0
