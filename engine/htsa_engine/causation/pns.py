"""
PNS Calculator — Probability of Necessity and Sufficiency.

References:
  Pearl & Tian (2000) Probabilities of causation: bounds and identification
  math/09_causation_theory.md §§ "Probability of Necessity and Sufficiency"

Three computation modes:
  from_experimental — RCT / A/B test data; point-identification under monotonicity
  from_observational — observational data; produces bounded [lower, upper] interval
  from_subjective    — investigator estimates; PN and PS set directly

PNSScore is defined in core/models_causation.py.
This module computes PNSScore instances from raw inputs.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from typing import Optional

from ..core.models_causation import PNSScore


# ---------------------------------------------------------------------------
# Input types
# ---------------------------------------------------------------------------

@dataclass
class ExperimentalData:
    """
    Data from a controlled experiment (RCT, A/B test).

    p_e_do_c1: P(E | do(C=1)) — outcome rate with cause forced present
    p_e_do_c0: P(E | do(C=0)) — outcome rate with cause forced absent
    p_c1:      P(C=1)          — base rate of cause in the population
    p_e:       P(E)             — unconditional outcome rate

    sample_size: total observations used for estimation
    monotonicity_assumed: True if P(E_{C=1}) >= P(E_{C=0}) everywhere assumed
    """
    p_e_do_c1: float  # P(E | do(C=1))
    p_e_do_c0: float  # P(E | do(C=0))
    p_c1: float       # P(C=1)
    p_e: float        # P(E)
    sample_size: int = 0
    monotonicity_assumed: bool = True


@dataclass
class ObservationalData:
    """
    Data from passive observation (logs, sensors, monitoring).

    p_e_given_c1: P(E | C=1) — observed outcome rate when C is present
    p_e_given_c0: P(E | C=0) — observed outcome rate when C is absent

    Caution: these are NOT interventional. They may be confounded.
    PNS can only be bounded from these, not point-identified.
    """
    p_e_given_c1: float
    p_e_given_c0: float
    sample_size: int = 0


# ---------------------------------------------------------------------------
# PNSCalculator
# ---------------------------------------------------------------------------

class PNSCalculator:
    """
    Computes PNSScore from experimental, observational, or subjective inputs.

    Usage:
        calc = PNSCalculator("node_abc")
        score = calc.from_experimental(data)
        score = calc.from_observational(data)
        score = calc.from_subjective(pn=0.8, ps=0.7)
    """

    def __init__(self, node_id: str) -> None:
        self._node_id = node_id

    def from_experimental(self, data: ExperimentalData) -> PNSScore:
        """
        Point-identification of PNS from experimental data under monotonicity.

        Formulas (Pearl & Tian 2000, monotonicity assumed):
          PS  = P(E | do(C=1))
          PN  = (PS - P(E)) / P(C=1)     [derived via total probability]
          PNS = PS - P(E | do(C=0))
        """
        pns = data.p_e_do_c1 - data.p_e_do_c0
        ps = data.p_e_do_c1

        # PN = PNS / PS — share of experimental outcomes attributable to C
        # (approximation; exact PN requires observational P(E|C=1) not available here)
        pn = pns / ps if ps > 0 else 0.0

        # Clamp to valid probability range
        pn = max(0.0, min(1.0, pn))
        ps = max(0.0, min(1.0, ps))
        pns = max(0.0, min(1.0, pns))

        score = PNSScore(
            node_id=self._node_id,
            pn=pn,
            ps=ps,
            pns=pns,
            monotonicity_assumed=data.monotonicity_assumed,
            sample_size=data.sample_size,
        )
        return score

    def from_observational(self, data: ObservationalData) -> PNSScore:
        """
        Bounded PNS from observational data (no do(·) available).

        Without monotonicity or experimental data, PNS can only be bounded:
          PN  ≈ P(E | C=1) — P(E | C=0)   [upper bound approximation]
          PS  ≈ P(E | C=1)                  [upper bound approximation]
          PNS ∈ [max(0, PN+PS-1), min(PN, PS)]

        These are observational proxies subject to confounding.
        The caller should treat the resulting PNSScore as an upper-bound
        estimate and set monotonicity_assumed=False.
        """
        # Observational approximation — NOT interventional
        pn_approx = max(0.0, data.p_e_given_c1 - data.p_e_given_c0)
        ps_approx = data.p_e_given_c1

        pns_lower = max(0.0, pn_approx + ps_approx - 1.0)
        pns_upper = min(pn_approx, ps_approx)
        # Use geometric mean of bounds as point estimate when monotonicity unknown
        pns_point = math.sqrt(pns_lower * pns_upper) if pns_lower > 0 else pns_lower

        score = PNSScore(
            node_id=self._node_id,
            pn=pn_approx,
            ps=ps_approx,
            pns=pns_point,
            monotonicity_assumed=False,
            sample_size=data.sample_size,
        )
        return score

    def from_subjective(
        self,
        pn: float,
        ps: float,
        monotonicity_assumed: bool = True,
    ) -> PNSScore:
        """
        Subjective PNS estimate from investigator judgment.

        PN and PS are set directly from investigator's assessment [0,1].
        PNS is the geometric mean of the Pearl & Tian bounds when the
        bounds have positive overlap; otherwise the lower bound.

        Label the score with sample_size=0 to indicate no empirical data.
        """
        pn = max(0.0, min(1.0, pn))
        ps = max(0.0, min(1.0, ps))

        lower = max(0.0, pn + ps - 1.0)
        upper = min(pn, ps)

        if lower > 0 and upper > 0:
            pns = math.sqrt(lower * upper)
        else:
            pns = lower

        return PNSScore(
            node_id=self._node_id,
            pn=pn,
            ps=ps,
            pns=pns,
            monotonicity_assumed=monotonicity_assumed,
            sample_size=0,
        )

    @staticmethod
    def validate(score: PNSScore) -> list[str]:
        """
        Return a list of validation warnings for a PNSScore.
        Empty list = no issues.
        """
        warnings: list[str] = []
        if not score.validate_pns_bounds():
            warnings.append(
                f"PNS={score.pns:.3f} outside bounds "
                f"[{score.pns_lower_bound:.3f}, {score.pns_upper_bound:.3f}]"
            )
        if score.sample_size == 0 and score.pns > 0.5:
            warnings.append("High PNS from subjective estimate only — no empirical data")
        if not score.monotonicity_assumed and score.pns == score.pn + score.ps - 1.0:
            warnings.append(
                "PNS at lower bound with monotonicity not assumed — "
                "report as interval, not point estimate"
            )
        return warnings
