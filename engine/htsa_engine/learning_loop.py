"""
Learning Loop mixin — Layer 4 of the HTSA algorithm.

Handles Verification & Learning and recursive sub-investigation spawning.
Extracted from investigation.py to satisfy the 400-line file limit.
All attributes used here are initialised in Investigation.__init__.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from .core import InvestigationGraph, NodeStatus
from .resolution import VerificationTracker, VerificationWindowType

if TYPE_CHECKING:
    from .investigation import Investigation, InvestigationConfig


class LearningLoopMixin:
    """Layer 4 — Verification, Learning, and sub-investigation for the Investigation orchestrator."""

    # Declared for type checkers; initialised in Investigation.__init__
    graph: InvestigationGraph
    verification: VerificationTracker
    config: "InvestigationConfig"

    def _log(self, event_type: str, data: dict) -> None: ...  # type: ignore[empty-body]

    # -----------------------------------------------------------------------
    # Layer 4 — Verification & Learning
    # -----------------------------------------------------------------------

    def add_verification(
        self,
        node_id: str,
        window_type: VerificationWindowType,
        window_description: str,
        metric: str,
        expected_date: str = "",
    ) -> None:
        """Attach a verification window to a resolved root cause."""
        self.verification.add_verification(
            node_id, window_type, window_description, metric, expected_date
        )
        self._log("verification_added", {
            "node_id": node_id,
            "window_type": window_type.value,
        })

    def verify(self, node_id: str, recurred: bool) -> str | None:
        """
        Record whether the root cause recurred after the fix was applied.
        Returns a status string or None.
        """
        result = self.verification.verify(self.graph, node_id, recurred)
        self._log("verification_result", {
            "node_id": node_id,
            "recurred": recurred,
            "result": result,
        })
        return result

    def record_learning(self, **kwargs) -> None:
        """Record learnings from the investigation for future prior calibration."""
        self.verification.record_learning(**kwargs)

    @property
    def is_closed(self) -> bool:
        """True when all root causes have passed their verification windows."""
        return self.verification.is_investigation_closed()

    # -----------------------------------------------------------------------
    # Sub-investigation (recursive property of HTSA)
    # -----------------------------------------------------------------------

    def spawn_sub_investigation(
        self,
        root_cause_id: str,
        title: str = "",
    ) -> "Investigation":
        """
        Spawn a child investigation from a confirmed root cause.

        The root cause's statement becomes the new investigation's 'what',
        and the parent's config (threshold, mode, search type) carries over.
        This is the recursive property of HTSA: a root cause can itself be
        a new 'What' requiring its own 5 Ws and 5 Whys.
        """
        from .investigation import Investigation  # local to break circular import

        node = self.graph.get_node(root_cause_id)
        if node.status != NodeStatus.ROOT_CAUSE:
            raise ValueError(
                f"Node {root_cause_id} is not a confirmed root cause — "
                f"cannot spawn sub-investigation from status '{node.status.value}'"
            )

        sub_title = title or f"Sub-investigation: {node.statement}"
        sub = Investigation(
            title=sub_title,
            pruning_threshold=self.config.pruning_threshold,
            mode=self.config.mode,
            search_type=self.config.search_type,
            investigator=self.config.investigator,
        )
        sub.set_situation(
            what=node.statement,
            why_surface=f"Deeper investigation of: {node.statement}",
        )
        self._log("sub_investigation_spawned", {
            "parent_root_cause_id": root_cause_id,
            "sub_investigation_title": sub_title,
        })
        return sub
