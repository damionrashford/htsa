"""
Analysis modules — the computational engines of HTSA.

Probability, search, bias detection, evidence management, feedback loops,
evidence budget, and heredity prior propagation.
"""

from .bias import AlertLevel, BiasAlert, BiasGuard, BiasType
from .budget import EvidenceBudget, EvidenceBudgetCalculator
from .evidence import EvidenceStore, TemporalFirewall
from .heredity import HeredityPriorCalculator
from .loops import BreakPoint, FeedbackLoop, FeedbackLoopHandler
from .probability import ProbabilityEngine, PruningRecord
from .search import (
    BestFirstSearch,
    BreadthFirstSearch,
    create_search,
    DepthFirstSearch,
    SearchStrategy,
    SearchType,
)

__all__ = [
    # Probability
    "ProbabilityEngine",
    "PruningRecord",
    # Search
    "SearchStrategy",
    "SearchType",
    "BestFirstSearch",
    "DepthFirstSearch",
    "BreadthFirstSearch",
    "create_search",
    # Bias
    "BiasGuard",
    "BiasAlert",
    "BiasType",
    "AlertLevel",
    # Evidence
    "EvidenceStore",
    "TemporalFirewall",
    # Loops
    "FeedbackLoopHandler",
    "FeedbackLoop",
    "BreakPoint",
    # Evidence budget
    "EvidenceBudgetCalculator",
    "EvidenceBudget",
    # Heredity
    "HeredityPriorCalculator",
]
