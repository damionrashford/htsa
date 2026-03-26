"""
HTSA Engine — How to Solve Anything, codified.

A graph-based investigation engine implementing the HTSA framework:
Bayesian probability tracking, entropy-based progress measurement,
search strategy selection, evidence tier classification, depth criteria
enforcement, bias detection, and feedback loop handling.
"""

from .analysis import (
    AlertLevel,
    BiasAlert,
    BiasGuard,
    BiasType,
    BestFirstSearch,
    BreadthFirstSearch,
    BreakPoint,
    DepthFirstSearch,
    EvidenceStore,
    FeedbackLoop,
    FeedbackLoopHandler,
    ProbabilityEngine,
    SearchStrategy,
    SearchType,
    TemporalFirewall,
    create_search,
)
from .core import (
    DepthCriteria,
    Evidence,
    EvidenceDirection,
    EvidenceTier,
    InteractionType,
    InvestigationGraph,
    Node,
    NodeStatus,
    Resolution,
    ResolutionType,
    SituationMap,
)
from .export import to_markdown
from .investigation import Investigation, InvestigationMode
from .resolution import (
    ResolutionEngine,
    VerificationRecord,
    VerificationTracker,
    VerificationWindowType,
)

__all__ = [
    # Core
    "Investigation",
    "InvestigationMode",
    # Graph
    "InvestigationGraph",
    "Node",
    "NodeStatus",
    "Evidence",
    "EvidenceTier",
    "EvidenceDirection",
    "DepthCriteria",
    "Resolution",
    "ResolutionType",
    "InteractionType",
    "SituationMap",
    # Probability
    "ProbabilityEngine",
    # Search
    "SearchStrategy",
    "SearchType",
    "BestFirstSearch",
    "DepthFirstSearch",
    "BreadthFirstSearch",
    "create_search",
    # Evidence
    "EvidenceStore",
    "TemporalFirewall",
    # Bias
    "BiasGuard",
    "BiasAlert",
    "BiasType",
    "AlertLevel",
    # Loops
    "FeedbackLoopHandler",
    "FeedbackLoop",
    "BreakPoint",
    # Export
    "to_markdown",
    # Resolution
    "ResolutionEngine",
    "VerificationTracker",
    "VerificationRecord",
    "VerificationWindowType",
]
