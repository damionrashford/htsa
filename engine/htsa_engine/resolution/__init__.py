"""
Resolution and verification — Layers 3 & 4 of the HTSA framework.
"""

from .engine import ResolutionEngine, RootCauseInteraction
from .verification import (
    LearningRecord,
    VerificationRecord,
    VerificationTracker,
    VerificationWindowType,
)

__all__ = [
    "ResolutionEngine",
    "RootCauseInteraction",
    "VerificationTracker",
    "VerificationRecord",
    "VerificationWindowType",
    "LearningRecord",
]
