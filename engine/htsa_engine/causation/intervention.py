"""
Intervention theory — Minimal Intervention Set.

References:
  math/10_intervention_theory.md
  CIRCA (Li et al. 2022 KDD) — RCA as do(fix(C)) → outcome restoration
  Pearl (2000) §9 — do(·) operator

Root cause analysis as intervention:

  Find the smallest set S ⊆ R such that:
    coverage(S) = P(E_prevented | do(fix(s₁)), do(fix(s₂)), ...) ≥ θ

  coverage(S) under independence:
    1 - ∏ᵢ∈S (1 - PNS(rᵢ))

  AND-node groups contribute 0 coverage unless ALL members are in S.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from itertools import combinations
from typing import Optional

from ..core.models_causation import PNSScore


# ---------------------------------------------------------------------------
# AND-group definition
# ---------------------------------------------------------------------------

@dataclass
class ANDGroup:
    """
    A set of root causes that must ALL be fixed together.

    When causes A and B are AND-related (both required for the outcome),
    including only one gives 0 coverage. Only including both contributes
    PNS(A) × PNS(B) to coverage.

    node_ids: the IDs of the AND-related root causes
    joint_pns: PNS(A) × PNS(B) × ... — combined coverage when full group is fixed
    """
    node_ids: list[str]
    joint_pns: float = 0.0

    def compute_joint_pns(self, pns_map: dict[str, PNSScore]) -> None:
        result = 1.0
        for nid in self.node_ids:
            if nid in pns_map:
                result *= pns_map[nid].pns
        self.joint_pns = result


# ---------------------------------------------------------------------------
# Result type
# ---------------------------------------------------------------------------

@dataclass
class InterventionResult:
    """
    Output of MinimalInterventionCalculator.find_minimal_set().

    minimal_set: node IDs forming the minimal intervention set S
    coverage: P(E_prevented | do(fix(S))) — probability of prevention
    threshold: the θ_intervention target used
    threshold_achieved: True if coverage(S) >= threshold
    all_required: True if even fixing all root causes may be insufficient
    notes: list of warnings or observations
    """
    minimal_set: list[str]
    coverage: float
    threshold: float
    threshold_achieved: bool
    all_required: bool = False
    notes: list[str] = field(default_factory=list)


# ---------------------------------------------------------------------------
# MinimalInterventionCalculator
# ---------------------------------------------------------------------------

class MinimalInterventionCalculator:
    """
    Finds the minimal subset of root causes whose joint fixing achieves
    the prevention probability threshold.

    Algorithm (math/10 — minimum size first):
      For k = 1, 2, ..., |R|:
        For each subset S of size k:
          Compute coverage(S)
          If coverage(S) >= θ: return S

      If no subset achieves threshold:
        Return full set R with all_required=True and a note that even
        full remediation may be insufficient.

    AND-group handling:
      AND-group {A, B}: coverage = 0 unless both A and B are in S.
      OR-node {A}: coverage = PNS(A) independently.
    """

    DEFAULT_THETA = 0.90  # from math/10: minimum acceptable prevention probability

    def __init__(
        self,
        root_causes: list[PNSScore],
        and_groups: Optional[list[ANDGroup]] = None,
        theta: float = DEFAULT_THETA,
    ) -> None:
        self._pns_map: dict[str, PNSScore] = {r.node_id: r for r in root_causes}
        self._and_groups = and_groups or []
        self._theta = theta

        # Precompute AND-group joint PNS values
        for group in self._and_groups:
            group.compute_joint_pns(self._pns_map)

        # Which node IDs are part of AND-groups?
        self._and_members: set[str] = set()
        for group in self._and_groups:
            self._and_members.update(group.node_ids)

    def find_minimal_set(self) -> InterventionResult:
        """
        Return the minimal intervention set achieving coverage >= theta.
        """
        all_ids = list(self._pns_map.keys())

        for k in range(1, len(all_ids) + 1):
            for subset in combinations(all_ids, k):
                s = list(subset)
                cov = self._coverage(s)
                if cov >= self._theta:
                    return InterventionResult(
                        minimal_set=s,
                        coverage=cov,
                        threshold=self._theta,
                        threshold_achieved=True,
                    )

        # No subset achieves the threshold
        full_cov = self._coverage(all_ids)
        notes: list[str] = []
        if full_cov < self._theta:
            notes.append(
                f"Even fixing all {len(all_ids)} root causes achieves only "
                f"{full_cov:.1%} prevention probability (threshold: {self._theta:.0%}). "
                "Verify that root causes were correctly identified."
            )

        return InterventionResult(
            minimal_set=all_ids,
            coverage=full_cov,
            threshold=self._theta,
            threshold_achieved=full_cov >= self._theta,
            all_required=True,
            notes=notes,
        )

    def coverage(self, node_ids: list[str]) -> float:
        """Public coverage query for an arbitrary subset."""
        return self._coverage(node_ids)

    def _coverage(self, node_ids: list[str]) -> float:
        """
        coverage(S) = 1 - ∏ᵢ∈S_effective (1 - effective_pns(i))

        Handles AND-groups: an AND-group contributes its joint_pns only when
        ALL its members are in S. Otherwise it contributes 0.
        """
        effective_pns: list[float] = []
        included = set(node_ids)

        # Process AND-groups first
        handled: set[str] = set()
        for group in self._and_groups:
            if all(nid in included for nid in group.node_ids):
                effective_pns.append(group.joint_pns)
            # Whether the group is complete or not, those members are "handled"
            handled.update(group.node_ids)

        # Process standalone (non-AND) root causes
        for nid in node_ids:
            if nid not in handled:
                effective_pns.append(self._pns_map[nid].pns)

        # coverage = 1 - ∏ (1 - pns_i) under independence
        product = 1.0
        for p in effective_pns:
            product *= (1.0 - p)

        return 1.0 - product

    def coverage_table(self) -> list[tuple[list[str], float]]:
        """
        Return all subsets with their coverage, sorted descending by coverage.
        Useful for debugging and reporting.
        """
        all_ids = list(self._pns_map.keys())
        rows: list[tuple[list[str], float]] = []
        for k in range(1, len(all_ids) + 1):
            for subset in combinations(all_ids, k):
                s = list(subset)
                rows.append((s, self._coverage(s)))
        rows.sort(key=lambda x: x[1], reverse=True)
        return rows
