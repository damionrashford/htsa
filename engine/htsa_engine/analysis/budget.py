"""
Evidence budget — minimum evidence count for hypothesis discrimination.

References:
  proofs/06_convergence.md §§ "Evidence Budget Formula"
  Walley (1991) imprecise probabilities (second-order uncertainty)

Formula:
  n_required ≥ log((1 - ε) / ε) / min_j KL(r* ‖ rⱼ)

  where:
    r*      = the posterior under the true hypothesis (target update direction)
    rⱼ      = the posterior under competing alternative j
    ε       = acceptable error rate (probability of still being wrong after n pieces)
    KL(·‖·) = KL divergence between two Bernoulli distributions

Practical interpretation:
  "How many independent pieces of Tier 1 evidence do I need to be confident
   that the right root cause is identified, given the competing alternatives?"
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field


# ---------------------------------------------------------------------------
# KL divergence between two Bernoulli distributions
# ---------------------------------------------------------------------------

def _kl_bernoulli(p: float, q: float) -> float:
    """
    KL(P ‖ Q) for Bernoulli(p) and Bernoulli(q).

    KL = p·log(p/q) + (1-p)·log((1-p)/(1-q))

    Returns 0 when p == q. Returns inf when q is 0 or 1 and p ≠ q.
    Clamped to avoid log(0) instability with small epsilon.
    """
    _eps = 1e-10
    p = max(_eps, min(1.0 - _eps, p))
    q = max(_eps, min(1.0 - _eps, q))
    return p * math.log(p / q) + (1.0 - p) * math.log((1.0 - p) / (1.0 - q))


# ---------------------------------------------------------------------------
# Input/output types
# ---------------------------------------------------------------------------

@dataclass
class EvidenceBudget:
    """
    Result of a budget calculation.

    n_required: minimum pieces of Tier 1 evidence needed
    confidence_target: the ε target used (acceptable error rate)
    hardest_alternative: the competing hypothesis that requires the most evidence
    min_kl_divergence: KL divergence against the hardest alternative
    notes: warnings about degenerate inputs or near-indistinguishable alternatives
    """
    n_required: int
    confidence_target: float
    hardest_alternative: str = ""
    min_kl_divergence: float = 0.0
    notes: list[str] = field(default_factory=list)

    @property
    def is_indistinguishable(self) -> bool:
        """True if KL divergence is effectively zero — alternatives look identical."""
        return self.min_kl_divergence < 1e-6


# ---------------------------------------------------------------------------
# EvidenceBudgetCalculator
# ---------------------------------------------------------------------------

class EvidenceBudgetCalculator:
    """
    Computes the minimum evidence count for identifying the true root cause.

    Usage:
        calc = EvidenceBudgetCalculator(
            target_posterior=0.80,        # r*: posterior if the node is a root cause
            alternative_posteriors={"alternative_1": 0.70, "alternative_2": 0.65},
            confidence_target=0.05,       # ε: acceptable error rate
        )
        budget = calc.compute()
        print(f"Need at least {budget.n_required} independent Tier-1 evidence pieces")

    target_posterior: the posterior probability for the TRUE root cause hypothesis
    alternative_posteriors: {label: posterior} for each competing hypothesis
    confidence_target: ε — acceptable probability of still being wrong after n pieces
      Default 0.05 (5% error rate). Use 0.01 for safety-critical investigations.
    """

    def __init__(
        self,
        target_posterior: float,
        alternative_posteriors: dict[str, float],
        confidence_target: float = 0.05,
    ) -> None:
        self._r_star = target_posterior
        self._alternatives = alternative_posteriors
        self._epsilon = confidence_target

    def compute(self) -> EvidenceBudget:
        """
        Compute n_required and identify the hardest alternative.

        n_required = ceil(log((1 - ε) / ε) / min_j KL(r* ‖ rⱼ))
        """
        notes: list[str] = []

        if not self._alternatives:
            return EvidenceBudget(
                n_required=0,
                confidence_target=self._epsilon,
                notes=["No competing alternatives — single hypothesis, no budget needed"],
            )

        if self._epsilon <= 0 or self._epsilon >= 1:
            raise ValueError(f"confidence_target must be in (0, 1), got {self._epsilon}")

        kl_values: dict[str, float] = {}
        for label, r_j in self._alternatives.items():
            kl = _kl_bernoulli(self._r_star, r_j)
            kl_values[label] = kl

        min_label = min(kl_values, key=kl_values.__getitem__)
        min_kl = kl_values[min_label]

        if min_kl < 1e-6:
            notes.append(
                f"Alternative '{min_label}' is nearly indistinguishable from the true "
                "hypothesis (KL ≈ 0). Evidence alone may not resolve this — seek a "
                "discriminating test (observational variable that differs between them)."
            )
            return EvidenceBudget(
                n_required=10_000,  # sentinel: effectively infinite
                confidence_target=self._epsilon,
                hardest_alternative=min_label,
                min_kl_divergence=min_kl,
                notes=notes,
            )

        log_ratio = math.log((1.0 - self._epsilon) / self._epsilon)
        n_raw = log_ratio / min_kl
        n_required = math.ceil(n_raw)

        if n_required > 1000:
            notes.append(
                f"Budget is very large ({n_required} pieces). The alternatives are "
                "nearly indistinguishable — consider redesigning the investigation to "
                "include discriminating questions."
            )

        return EvidenceBudget(
            n_required=n_required,
            confidence_target=self._epsilon,
            hardest_alternative=min_label,
            min_kl_divergence=min_kl,
            notes=notes,
        )

    def budget_for_node(
        self,
        current_posterior: float,
        alternative_posteriors: dict[str, float],
        confidence_target: float = 0.05,
    ) -> EvidenceBudget:
        """
        Convenience method: compute budget using the current node's posterior
        as r* and the provided alternatives.
        """
        calc = EvidenceBudgetCalculator(
            target_posterior=current_posterior,
            alternative_posteriors=alternative_posteriors,
            confidence_target=confidence_target,
        )
        return calc.compute()
