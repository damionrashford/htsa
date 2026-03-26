"""
Data models — the typed nodes and structures from Definition 1.

Evidence, Node, DepthCriteria, Resolution, and SituationMap.
"""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from typing import Optional

from .enums import (
    EvidenceDirection,
    EvidenceTier,
    NodeStatus,
    ResolutionType,
)


# ---------------------------------------------------------------------------
# Evidence (Definition 5)
# ---------------------------------------------------------------------------

@dataclass
class Evidence:
    source: str
    tier: EvidenceTier
    timestamp: str
    direction: EvidenceDirection
    description: str = ""
    id: str = field(default_factory=lambda: uuid.uuid4().hex[:8])

    @property
    def reliability_weight(self) -> float:
        return {
            EvidenceTier.PHYSICAL: 1.0,
            EvidenceTier.OBSERVATIONAL: 0.75,
            EvidenceTier.INFERENTIAL: 0.5,
            EvidenceTier.TESTIMONIAL: 0.25,
        }[self.tier]


# ---------------------------------------------------------------------------
# Depth Criteria (Definition 4, conditions c-f)
# ---------------------------------------------------------------------------

@dataclass
class DepthCriteria:
    actionability: Optional[bool] = None
    counterfactual_clarity: Optional[bool] = None
    system_boundary: Optional[bool] = None
    diminishing_returns: Optional[bool] = None

    @property
    def all_passed(self) -> bool:
        values = [
            self.actionability,
            self.counterfactual_clarity,
            self.system_boundary,
            self.diminishing_returns,
        ]
        return all(v is True for v in values)

    @property
    def all_evaluated(self) -> bool:
        values = [
            self.actionability,
            self.counterfactual_clarity,
            self.system_boundary,
            self.diminishing_returns,
        ]
        return all(v is not None for v in values)


# ---------------------------------------------------------------------------
# Resolution (Definition 9)
# ---------------------------------------------------------------------------

@dataclass
class Resolution:
    type: ResolutionType
    change: str
    owner: str = ""
    deadline: str = ""
    counterfactual_passes: Optional[bool] = None
    priority_impact: int = 0       # 1-5
    priority_recurrence: int = 0   # 1-5
    priority_actionability: int = 0  # 1-5

    @property
    def priority_score(self) -> int:
        return self.priority_impact * self.priority_recurrence * self.priority_actionability


# ---------------------------------------------------------------------------
# Node (Definition 2)
# ---------------------------------------------------------------------------

@dataclass
class Node:
    statement: str
    id: str = field(default_factory=lambda: uuid.uuid4().hex[:8])
    probability: float = 0.0
    depth: int = 0
    status: NodeStatus = NodeStatus.OPEN
    evidence: list[Evidence] = field(default_factory=list)
    depth_criteria: DepthCriteria = field(default_factory=DepthCriteria)
    resolution: Optional[Resolution] = None
    reopen_count: int = 0
    pruned_probability: Optional[float] = None  # P at time of pruning

    @property
    def is_finding(self) -> bool:
        """A node is a Finding if it has Tier 1 or Tier 2 supporting evidence."""
        return any(
            e.direction == EvidenceDirection.SUPPORTS and e.tier.value <= 2
            for e in self.evidence
        )


# ---------------------------------------------------------------------------
# Situation Map (Layer 1 — 5 Ws)
# ---------------------------------------------------------------------------

@dataclass
class SituationMap:
    who_originator: str = ""
    who_trigger: str = ""
    who_affected: str = ""
    who_detector: str = ""
    who_resolver: str = ""
    who_stakeholder: str = ""
    what: str = ""
    when_before: str = ""
    when_during: str = ""
    when_after: str = ""
    where: str = ""
    why_surface: str = ""

    @property
    def is_complete(self) -> bool:
        """
        All 5 Ws must be present. The framework is explicit:
        'Complete the 5 Ws before starting the 5 Whys.'

        Who: at least one actor role filled.
        What: the event or problem.
        When: at least one timeline field (before, during, or after).
        Where: the location or system.
        Why: the surface-level apparent reason.
        """
        who_fields = [
            self.who_originator, self.who_trigger, self.who_affected,
            self.who_detector, self.who_resolver,
        ]
        when_fields = [self.when_before, self.when_during, self.when_after]
        return (
            any(who_fields)          # Who
            and bool(self.what)      # What
            and any(when_fields)     # When
            and bool(self.where)     # Where
            and bool(self.why_surface)  # Why
        )
