"""
Enumerations used throughout the HTSA engine.

Separated from models to avoid circular imports — enums have zero dependencies.
"""

from enum import Enum


class NodeStatus(Enum):
    OPEN = "open"
    ROOT_CAUSE = "root_cause"
    PRUNED = "pruned"
    DISCARDED = "discarded"
    ESCALATED = "escalated"


class ResolutionType(Enum):
    FIX = "fix"
    MITIGATE = "mitigate"
    ACCEPT = "accept"


class EvidenceTier(Enum):
    PHYSICAL = 1       # logs, sensors, controlled experiments
    OBSERVATIONAL = 2  # direct witness observation at time of event
    INFERENTIAL = 3    # reasoned conclusion from Tier 1/2 evidence
    TESTIMONIAL = 4    # recalled after the fact


class EvidenceDirection(Enum):
    SUPPORTS = "supports"
    CONTRADICTS = "contradicts"


class InteractionType(Enum):
    AND = "and"                    # problem only occurs when both present
    OR = "or"                      # each independently sufficient (overdetermination)
    AMPLIFICATION = "amplification"  # one makes the other worse
    CONFLICT = "conflict"          # fixing one worsens the other
