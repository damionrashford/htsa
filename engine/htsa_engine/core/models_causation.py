"""
Causation-theoretic models — quantitative outputs from the causation/ package.

These extend the base Node model without modifying it. They are computed
after Layer 2 (Causal Chain) completes and are optional — investigations
that don't need quantitative causation scoring can skip these entirely.

References:
  PNSScore:               Pearl & Tian (2000)
  NormalityScore:         Halpern & Hitchcock (2013)
  SecondOrderUncertainty: Walley (1991) imprecise probabilities; Beta conjugate prior
  TimeIndex:              Extends Definition 1 to G = (V, E, P, Ev, τ)
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field


# ---------------------------------------------------------------------------
# PNS Score (Pearl & Tian 2000)
# ---------------------------------------------------------------------------

@dataclass
class PNSScore:
    """
    Probability of Necessity and Sufficiency for a root cause candidate.

    PN  = P(~E | do(~C))  — probability C was necessary for E
    PS  = P(E | do(C))    — probability C was sufficient for E
    PNS = P(~E_{C=0} and E_{C=1})  — jointly necessary and sufficient

    Bounds: max(0, PN + PS - 1)  ≤  PNS  ≤  min(PN, PS)

    monotonicity_assumed: True when PNS was computed under the assumption
      that P(E_{C=1}) ≥ P(E_{C=0}) everywhere. This is required for
      point-identification of PNS from experimental data alone.
      Without monotonicity, PNS can only be bounded (Pearl 2000, §9.2).

    sample_size: 0 = subjective estimate; > 0 = computed from data
    """
    node_id: str
    pn: float = 0.0
    ps: float = 0.0
    pns: float = 0.0
    monotonicity_assumed: bool = True
    sample_size: int = 0

    @property
    def causation_type(self) -> str:
        """Map PNS profile to HTSA node taxonomy (math/09_causation_theory.md)."""
        if self.pns >= 0.7:
            return "single_root_cause"
        if self.pn >= 0.7 and self.ps < 0.5:
            return "and_node"
        if self.ps >= 0.7 and self.pn < 0.5:
            return "or_node"
        return "contributing_factor"

    @property
    def pns_lower_bound(self) -> float:
        return max(0.0, self.pn + self.ps - 1.0)

    @property
    def pns_upper_bound(self) -> float:
        return min(self.pn, self.ps)

    def validate_pns_bounds(self) -> bool:
        """True if pns falls within the Pearl & Tian (2000) bounds."""
        return self.pns_lower_bound <= self.pns <= self.pns_upper_bound


# ---------------------------------------------------------------------------
# Normality Score (Halpern & Hitchcock 2013)
# ---------------------------------------------------------------------------

@dataclass
class NormalityScore:
    """
    Normality and causal grade for a root cause.

    normality = P(this factor's state | baseline system operation)
      0.0 = never seen in normal operation (maximally abnormal)
      1.0 = always happens this way (maximally normal)

    causal_grade = PNS × (1 - normality)
      High grade: strong cause (high PNS) AND abnormal → fix first
      Low grade:  weak cause OR normal (expected behavior) → fix later or accept

    Used to prioritize root causes in Layer 3 resolution ordering.
    """
    node_id: str
    normality: float = 0.5
    baseline_source: str = ""
    causal_grade: float = 0.0

    def compute_grade(self, pns: float) -> None:
        """Compute and store causal_grade from PNS score."""
        self.causal_grade = pns * (1.0 - self.normality)


# ---------------------------------------------------------------------------
# Second-Order Uncertainty (Beta conjugate prior)
# ---------------------------------------------------------------------------

@dataclass
class SecondOrderUncertainty:
    """
    Beta distribution tracking uncertainty about a node's probability estimate.

    The node's point probability is the Beta mean: P = alpha / (alpha + beta).

    Width of the credible interval reflects evidence count:
      Low alpha+beta:  wide interval, low confidence in the point estimate
      High alpha+beta: narrow interval, high confidence

    This guards against premature pruning when evidence is sparse:
      Prune when P_upper < theta (not P_point < theta).

    alpha: pseudo-count of supporting observations (starts at 1 — uninformative)
    beta:  pseudo-count of contradicting observations (starts at 1 — uninformative)
    """
    node_id: str
    alpha: float = 1.0
    beta: float = 1.0

    @property
    def mean(self) -> float:
        return self.alpha / (self.alpha + self.beta)

    @property
    def effective_n(self) -> float:
        return self.alpha + self.beta

    def credible_interval_95(self) -> tuple[float, float]:
        """
        95% credible interval using Wilson score approximation.
        No scipy dependency — stdlib math only.
        Valid for effective_n >= 3.
        """
        p = self.mean
        n = self.effective_n
        z = 1.96
        margin = z * math.sqrt(p * (1.0 - p) / n)
        return (max(0.0, p - margin), min(1.0, p + margin))

    def p_lower(self) -> float:
        """Lower bound of 95% credible interval — use for conservative pruning."""
        return self.credible_interval_95()[0]

    def p_upper(self) -> float:
        """Upper bound of 95% credible interval."""
        return self.credible_interval_95()[1]

    def update(self, supports: bool) -> None:
        """Add one observation to the Beta distribution."""
        if supports:
            self.alpha += 1.0
        else:
            self.beta += 1.0

    def interval_width(self) -> float:
        low, high = self.credible_interval_95()
        return high - low


# ---------------------------------------------------------------------------
# Time Index (extends Definition 1 to G = (V, E, P, Ev, τ))
# ---------------------------------------------------------------------------

@dataclass
class TimeIndex:
    """
    Optional timestamp for time-indexed nodes.

    Extends the investigation graph definition to G = (V, E, P, Ev, τ)
    where τ: V → ℝ assigns a timestamp to each node.

    Edge constraint: τ(parent) < τ(child) must hold for all valid edges.
    Temporal ordering prevents an effect from being listed as a cause of
    an event that preceded it.

    When absent from a node, no temporal ordering is enforced for that node.
    """
    node_id: str
    timestamp_iso: str = ""
    relative_to_incident: str = ""   # e.g., "T-2h", "T+15m"
    ordering_index: int = 0          # integer for comparison when exact time unknown

    def precedes(self, other: "TimeIndex") -> bool:
        """
        Returns True if this node's time index is strictly before other's.
        Uses ordering_index when ISO timestamps are unavailable.
        """
        if self.timestamp_iso and other.timestamp_iso:
            return self.timestamp_iso < other.timestamp_iso
        return self.ordering_index < other.ordering_index
