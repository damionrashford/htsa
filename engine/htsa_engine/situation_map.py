"""
Situation Map mixin — Layer 1 of the HTSA algorithm.

Handles the 5 Ws: Who, What, When, Where, Why (surface).
Extracted from investigation.py to satisfy the 400-line file limit.
All attributes used here (situation, bias_guard, graph, _situation_complete, _log)
are initialised in Investigation.__init__.
"""

from __future__ import annotations

from .analysis import BiasAlert, BiasGuard
from .core import InvestigationGraph, SituationMap


class SituationMapMixin:
    """Layer 1 — Situation Map operations for the Investigation orchestrator."""

    # Declared for type checkers; initialised in Investigation.__init__
    situation: SituationMap
    bias_guard: BiasGuard
    graph: InvestigationGraph
    _situation_complete: bool

    def _log(self, event_type: str, data: dict) -> None: ...  # type: ignore[empty-body]

    def set_situation(self, **kwargs: str) -> SituationMap:
        """
        Set situation map fields. Valid keys match SituationMap field names.
        Partial updates are allowed — call multiple times to fill incrementally.
        """
        for key, value in kwargs.items():
            if hasattr(self.situation, key):
                setattr(self.situation, key, value)
        self._situation_complete = self.situation.is_complete
        self._log("situation_updated", {"fields": list(kwargs.keys())})
        return self.situation

    def complete_situation(self) -> list[BiasAlert]:
        """
        Mark the situation map as complete and run the anchoring bias check.
        Call this before start_causal_chain. Returns any bias alerts detected.
        """
        self._situation_complete = True
        self._log("situation_complete", {})
        return self.bias_guard.check_anchoring(self.graph)
