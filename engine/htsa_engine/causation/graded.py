"""
Graded causation — Normality scoring and causal grade computation.

References:
  Halpern & Hitchcock (2013) Graded causation and defaults
  math/09_causation_theory.md §§ "Graded Causation — Normality and Causal Attribution"

causal_grade = PNS × (1 − normality)

  High grade: strong cause (high PNS) AND abnormal factor → fix first
  Low grade:  weak cause OR normal/expected behavior → fix later or accept

NormalityScore is defined in core/models_causation.py.
This module computes NormalityScore instances and prioritizes root causes.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING

from ..core.models_causation import NormalityScore, PNSScore

if TYPE_CHECKING:
    from ..core.models import Node


# ---------------------------------------------------------------------------
# NormalityScorer
# ---------------------------------------------------------------------------

class NormalityScorer:
    """
    Computes normality scores and causal grades for root cause candidates.

    normality = P(this factor's state | baseline system operation)
      0.0 = never observed in normal operation (maximally abnormal)
      1.0 = always happens this way (maximally normal)

    Three input modes:
      from_base_rate  — historical occurrence count / total operational periods
      from_subjective — investigator's direct estimate on [0, 1]
      from_industry   — industry baseline rate (MTBF, CVE frequency, etc.)
    """

    def from_base_rate(
        self,
        node_id: str,
        occurrence_count: int,
        total_periods: int,
        baseline_source: str = "",
    ) -> NormalityScore:
        """
        Compute normality from historical data.

        normality = occurrence_count / total_periods

        Example: if this config error occurred 3 times in 100 deployment
        periods, normality = 0.03 (very abnormal — likely a real root cause).
        """
        if total_periods <= 0:
            normality = 0.5
        else:
            normality = min(1.0, occurrence_count / total_periods)

        return NormalityScore(
            node_id=node_id,
            normality=normality,
            baseline_source=baseline_source or f"historical: {occurrence_count}/{total_periods}",
        )

    def from_subjective(
        self,
        node_id: str,
        normality: float,
        reasoning: str = "",
    ) -> NormalityScore:
        """
        Investigator's direct normality estimate.

        normality should be on [0, 1]:
          0.0 — "this never happens in normal operation" (bug, outage, breach)
          0.5 — "I'm uncertain whether this is normal"
          1.0 — "this happens in every deployment" (expected behavior)
        """
        return NormalityScore(
            node_id=node_id,
            normality=max(0.0, min(1.0, normality)),
            baseline_source=f"investigator_estimate: {reasoning}" if reasoning else "investigator_estimate",
        )

    def from_industry_rate(
        self,
        node_id: str,
        industry_rate: float,
        source: str = "",
    ) -> NormalityScore:
        """
        Normality from industry baseline (MTBF tables, CVE frequency, benchmarks).

        industry_rate is the fraction of similar systems/deployments that
        experience this factor in normal operation.
        """
        return NormalityScore(
            node_id=node_id,
            normality=max(0.0, min(1.0, industry_rate)),
            baseline_source=source or "industry_baseline",
        )

    def compute_grade(self, score: NormalityScore, pns: PNSScore) -> None:
        """
        Set score.causal_grade = pns.pns × (1 − normality).

        Modifies score in-place. Call this after both PNS and normality are set.
        """
        score.compute_grade(pns.pns)


# ---------------------------------------------------------------------------
# Root cause prioritization
# ---------------------------------------------------------------------------

@dataclass
class PrioritizedRootCause:
    """A root cause with its causal grade and rank."""
    node_id: str
    statement: str
    causal_grade: float
    pns: float
    normality: float
    rank: int = 0
    resolution_priority: str = ""  # "fix_first", "fix_second", "fix_last", "accept"


def prioritize_root_causes(
    candidates: list[tuple["Node", PNSScore, NormalityScore]],
) -> list[PrioritizedRootCause]:
    """
    Sort root cause candidates by causal_grade descending and assign ranks.

    Input: list of (Node, PNSScore, NormalityScore) tuples.
    Output: ranked PrioritizedRootCause list.

    Priority labels (from math/09):
      fix_first:  grade >= 0.5 — strong, abnormal cause
      fix_second: 0.2 <= grade < 0.5 — moderate cause or somewhat abnormal
      fix_last:   0.05 <= grade < 0.2 — weak/normal cause
      accept:     grade < 0.05 — negligible causal contribution
    """
    scored: list[PrioritizedRootCause] = []
    for node, pns_score, norm_score in candidates:
        grade = pns_score.pns * (1.0 - norm_score.normality)
        norm_score.causal_grade = grade  # sync the score object

        if grade >= 0.5:
            priority = "fix_first"
        elif grade >= 0.2:
            priority = "fix_second"
        elif grade >= 0.05:
            priority = "fix_last"
        else:
            priority = "accept"

        scored.append(PrioritizedRootCause(
            node_id=node.id,
            statement=node.statement,
            causal_grade=grade,
            pns=pns_score.pns,
            normality=norm_score.normality,
            resolution_priority=priority,
        ))

    scored.sort(key=lambda x: x.causal_grade, reverse=True)
    for i, item in enumerate(scored):
        item.rank = i + 1

    return scored
