"""
HTSA Engine — How to Solve Anything, codified.

A graph-based investigation engine implementing the HTSA framework:
Bayesian probability tracking, entropy-based progress measurement,
search strategy selection, evidence tier classification, depth criteria
enforcement, bias detection, feedback loop handling, causation theory
(HP2015 / NESS / PNS), and intervention theory.
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
    EvidenceBudget,
    EvidenceBudgetCalculator,
    EvidenceStore,
    FeedbackLoop,
    FeedbackLoopHandler,
    HeredityPriorCalculator,
    ProbabilityEngine,
    SearchStrategy,
    SearchType,
    TemporalFirewall,
    create_search,
)
from .causation import (
    ANDGroup,
    CounterfactualResult,
    CounterfactualTester,
    ExperimentalData,
    InterventionResult,
    MinimalInterventionCalculator,
    NormalityScorer,
    ObservationalData,
    PNSCalculator,
    PrioritizedRootCause,
    prioritize_root_causes,
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
    NormalityScore,
    PNSScore,
    Resolution,
    ResolutionType,
    SecondOrderUncertainty,
    SituationMap,
    TimeIndex,
)
from .export import to_markdown
from .investigation import Investigation, InvestigationMode
from .llm import ChatCompletionsClient, LLMAdvisor
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
    # Causation models
    "PNSScore",
    "NormalityScore",
    "SecondOrderUncertainty",
    "TimeIndex",
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
    # Evidence budget
    "EvidenceBudgetCalculator",
    "EvidenceBudget",
    # Heredity
    "HeredityPriorCalculator",
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
    # LLM
    "LLMAdvisor",
    "ChatCompletionsClient",
    # Causation
    "CounterfactualTester",
    "CounterfactualResult",
    "PNSCalculator",
    "ExperimentalData",
    "ObservationalData",
    "NormalityScorer",
    "PrioritizedRootCause",
    "prioritize_root_causes",
    "MinimalInterventionCalculator",
    "InterventionResult",
    "ANDGroup",
]
