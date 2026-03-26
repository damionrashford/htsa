"""
Verification tracker and learning loop — Layer 4.

Tracks verification windows, records whether fixes hold,
and captures learning outcomes for future investigations.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum

from ..core import InvestigationGraph, NodeStatus


class VerificationWindowType(Enum):
    EVENT_DRIVEN = "event_driven"    # wait for next trigger
    TIME_DRIVEN = "time_driven"     # wait one full cycle
    CONTINUOUS = "continuous"       # measure over interval
    DEFAULT = "default"            # 2 weeks tech, 1 quarter org


@dataclass
class VerificationRecord:
    node_id: str
    window_type: VerificationWindowType
    window_description: str
    metric: str
    expected_date: str = ""
    verified: bool | None = None  # None = not yet checked
    recurred: bool | None = None


@dataclass
class LearningRecord:
    prior_accuracy: str = ""       # were base rates accurate?
    pruned_branches: str = ""      # which were pruned, were they correct?
    first_hypothesis_correct: bool | None = None
    surprises: list[str] = field(default_factory=list)
    prior_updates: dict[str, float] = field(default_factory=dict)


class VerificationTracker:
    """
    Layer 4 — tracks verification windows and learning outcomes.
    """

    MAX_VERIFY = 3

    def __init__(self) -> None:
        self.records: list[VerificationRecord] = []
        self.learning: LearningRecord = LearningRecord()

    def add_verification(
        self,
        node_id: str,
        window_type: VerificationWindowType,
        window_description: str,
        metric: str,
        expected_date: str = "",
    ) -> VerificationRecord:
        record = VerificationRecord(
            node_id=node_id,
            window_type=window_type,
            window_description=window_description,
            metric=metric,
            expected_date=expected_date,
        )
        self.records.append(record)
        return record

    def verify(
        self,
        graph: InvestigationGraph,
        node_id: str,
        recurred: bool,
    ) -> str | None:
        """
        Record verification result.

        If the problem recurred, the root cause was incomplete.
        Returns guidance or None.
        """
        node = graph.get_node(node_id)

        # Update the matching record
        for record in self.records:
            if record.node_id == node_id and record.verified is None:
                record.verified = not recurred
                record.recurred = recurred
                break

        if recurred:
            if node.reopen_count >= self.MAX_VERIFY:
                node.status = NodeStatus.ESCALATED
                return (
                    f"Problem recurred after {self.MAX_VERIFY} verification attempts. "
                    f"Escalated — launch a separate investigation."
                )
            node.reopen_count += 1
            node.status = NodeStatus.OPEN
            node.resolution = None
            return (
                f"Problem recurred. Root cause identification was incomplete. "
                f"Reopened (attempt {node.reopen_count}). Return to Layer 2."
            )
        return None

    def record_learning(
        self,
        prior_accuracy: str = "",
        pruned_branches: str = "",
        first_hypothesis_correct: bool | None = None,
        surprises: list[str] | None = None,
        prior_updates: dict[str, float] | None = None,
    ) -> None:
        """Record learning outcomes for future investigations."""
        if prior_accuracy:
            self.learning.prior_accuracy = prior_accuracy
        if pruned_branches:
            self.learning.pruned_branches = pruned_branches
        if first_hypothesis_correct is not None:
            self.learning.first_hypothesis_correct = first_hypothesis_correct
        if surprises:
            self.learning.surprises.extend(surprises)
        if prior_updates:
            self.learning.prior_updates.update(prior_updates)

    def is_investigation_closed(self) -> bool:
        """
        An investigation is closed when all verification records are resolved.
        No open windows = investigation complete.
        """
        if not self.records:
            return False  # no verification set up = not closed, just abandoned
        return all(r.verified is not None for r in self.records)
