"""
Causation package — HP2015, NESS, PNS, graded causation, and intervention theory.

Implements the quantitative causation stack from math/09 and math/10:
  Stage 1-3 counterfactual testing  →  counterfactual.py
  PNS computation (Pearl & Tian)    →  pns.py
  Normality scoring (Halpern & Hitchcock) → graded.py
  Minimal intervention set (CIRCA)  →  intervention.py
"""

from .counterfactual import CounterfactualResult, CounterfactualTester
from .graded import NormalityScorer, PrioritizedRootCause, prioritize_root_causes
from .intervention import ANDGroup, InterventionResult, MinimalInterventionCalculator
from .pns import ExperimentalData, ObservationalData, PNSCalculator

__all__ = [
    # Counterfactual testing
    "CounterfactualTester",
    "CounterfactualResult",
    # PNS
    "PNSCalculator",
    "ExperimentalData",
    "ObservationalData",
    # Graded causation
    "NormalityScorer",
    "PrioritizedRootCause",
    "prioritize_root_causes",
    # Intervention
    "MinimalInterventionCalculator",
    "InterventionResult",
    "ANDGroup",
]
