"""
Counterfactual testing — HP2015 Modified Definition and NESS Test.

References:
  Halpern & Pearl (2015) Modified HP Definition: AC1 / AC2 / AC3
  Beckers (2021) NESS formalization in structural causal models
  Wright (1988) Necessary Element of a Sufficient Set

Three-stage stack (math/09_causation_theory.md):
  Stage 1 — simple necessity (Lewis 1973)
  Stage 2 — HP2015 W-partition counterfactual sensitivity
  Stage 3 — NESS minimal sufficiency

Graph direction note:
  In the HTSA DAG, edges run effect → cause (parent → child).
  Causal paths run cause → effect, i.e. upward via parent pointers.
  All traversal helpers follow parent pointers unless stated otherwise.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from ..core.graph import InvestigationGraph


# ---------------------------------------------------------------------------
# Result types
# ---------------------------------------------------------------------------

@dataclass
class CounterfactualResult:
    """Outcome of a three-stage counterfactual test for one candidate cause."""
    node_id: str
    # Stage 1 — simple necessity: is candidate on every causal path to outcome?
    stage1_passes: Optional[bool] = None
    # Stage 2 — HP2015: AC1 / AC2(W-partition) / AC3(minimality)
    stage2_hp2015_ac1: Optional[bool] = None
    stage2_hp2015_ac2: Optional[bool] = None
    stage2_hp2015_ac3: Optional[bool] = None
    # W-partition used in AC2: node IDs held fixed at actual values
    w_partition: list[str] = field(default_factory=list)
    # Stage 3 — NESS: is this node a necessary element of a minimal sufficient set?
    stage3_ness_passes: Optional[bool] = None
    ness_sufficient_set: list[str] = field(default_factory=list)
    # Final classification
    is_root_cause: Optional[bool] = None
    is_contributing_factor: bool = False
    notes: str = ""

    @property
    def stage2_passes(self) -> Optional[bool]:
        if any(v is None for v in [self.stage2_hp2015_ac1, self.stage2_hp2015_ac2, self.stage2_hp2015_ac3]):
            return None
        return bool(self.stage2_hp2015_ac1 and self.stage2_hp2015_ac2 and self.stage2_hp2015_ac3)

    def classify(self) -> None:
        """Set is_root_cause and is_contributing_factor from stage results."""
        if self.stage3_ness_passes is True and self.stage2_passes is True:
            self.is_root_cause = True
            self.is_contributing_factor = False
        elif self.stage1_passes is False and self.stage2_passes is False:
            self.is_root_cause = False
            self.is_contributing_factor = False
        elif self.stage2_passes is True and self.stage3_ness_passes is False:
            # Passes HP2015 but fails NESS minimality — contributing factor
            self.is_root_cause = False
            self.is_contributing_factor = True


# ---------------------------------------------------------------------------
# CounterfactualTester
# ---------------------------------------------------------------------------

class CounterfactualTester:
    """
    Runs the three-stage counterfactual stack against the investigation graph.

    The graph is treated as a structural causal model. Edge direction:
      DAG parent → child  =  effect → cause
      Causal flow: cause → effect (i.e. upward via parent pointers)

    Limitations:
      - AC2 W-partition construction uses the heuristic from math/09:
        W = all variables NOT on any causal path from candidate to outcome.
      - NESS minimal sufficient set is approximated from the shortest causal path.
      - Structural tests on graph topology; not full SCM simulation.
    """

    def __init__(self, graph: "InvestigationGraph") -> None:
        self._g = graph

    # ------------------------------------------------------------------
    # Stage 1 — Simple necessity
    # ------------------------------------------------------------------

    def test_stage1(self, candidate_id: str, outcome_id: str) -> bool:
        """
        True if candidate lies on every causal path to outcome_id.

        Causal paths run from DAG leaves (deepest causes) to outcome via
        parent pointers. Stage 1 passes if all such paths include candidate.
        """
        all_paths = self._all_causal_paths_to(outcome_id)
        if not all_paths:
            return False
        candidate_paths = [p for p in all_paths if candidate_id in p]
        return len(candidate_paths) == len(all_paths)

    # ------------------------------------------------------------------
    # Stage 2 — HP2015 Modified Definition
    # ------------------------------------------------------------------

    def test_hp2015(self, candidate_id: str, outcome_id: str) -> CounterfactualResult:
        """
        Apply AC1 / AC2 / AC3 (Halpern & Pearl 2015).

        AC1: Both candidate and outcome exist in the graph.
        AC2: W-partition exists where removing candidate prevents outcome.
        AC3: No strict subset of {candidate} satisfies AC1+AC2 (trivially
             true for single-node candidates).
        """
        result = CounterfactualResult(node_id=candidate_id)

        # AC1
        result.stage2_hp2015_ac1 = (
            candidate_id in self._g and outcome_id in self._g
        )
        if not result.stage2_hp2015_ac1:
            result.stage2_hp2015_ac2 = False
            result.stage2_hp2015_ac3 = False
            result.notes = "AC1 failed: candidate or outcome not in graph"
            return result

        # AC2 — W = all nodes NOT on any causal path candidate → outcome
        paths = self._causal_paths_between(candidate_id, outcome_id)
        on_paths: set[str] = set()
        for p in paths:
            on_paths.update(p)
        all_ids = set(self._g._nodes.keys())
        result.w_partition = list(all_ids - on_paths - {candidate_id, outcome_id})

        # Under W held fixed (held at counterfactual-absent):
        # block candidate AND all W-partition members.
        # This correctly handles OR-nodes: alternative paths are in W and blocked.
        result.stage2_hp2015_ac2 = not self._causally_reachable_without(
            outcome_id, candidate_id, also_block=result.w_partition
        )

        # AC3 — trivially satisfied for single-node candidates
        result.stage2_hp2015_ac3 = True

        result.classify()
        return result

    # ------------------------------------------------------------------
    # Stage 3 — NESS Test
    # ------------------------------------------------------------------

    def test_ness(self, candidate_id: str, outcome_id: str) -> CounterfactualResult:
        """
        Find the minimal sufficient set S containing candidate s.t.
        S guarantees outcome, and S minus candidate does not.
        """
        result = CounterfactualResult(node_id=candidate_id)

        # Causal ancestors of outcome = DAG descendants (children)
        causal_ancestors = self._causal_ancestors_of(outcome_id)
        if candidate_id not in causal_ancestors and candidate_id != outcome_id:
            result.stage3_ness_passes = False
            result.notes = "Candidate is not a causal ancestor of outcome"
            return result

        minimal_set = self._minimal_sufficient_set(candidate_id, outcome_id)
        result.ness_sufficient_set = minimal_set

        if not minimal_set:
            result.stage3_ness_passes = False
            result.notes = "No sufficient set containing candidate found"
            return result

        reduced = [n for n in minimal_set if n != candidate_id]
        result.stage3_ness_passes = not self._is_causally_sufficient(reduced, outcome_id)

        if result.stage3_ness_passes:
            result.is_root_cause = True
        else:
            result.is_contributing_factor = True
            result.notes = "S minus candidate still sufficient — contributing factor"

        return result

    def test_full_stack(self, candidate_id: str, outcome_id: str) -> CounterfactualResult:
        """Run all three stages and return unified result."""
        result = CounterfactualResult(node_id=candidate_id)

        result.stage1_passes = self.test_stage1(candidate_id, outcome_id)

        hp = self.test_hp2015(candidate_id, outcome_id)
        result.stage2_hp2015_ac1 = hp.stage2_hp2015_ac1
        result.stage2_hp2015_ac2 = hp.stage2_hp2015_ac2
        result.stage2_hp2015_ac3 = hp.stage2_hp2015_ac3
        result.w_partition = hp.w_partition

        ness = self.test_ness(candidate_id, outcome_id)
        result.stage3_ness_passes = ness.stage3_ness_passes
        result.ness_sufficient_set = ness.ness_sufficient_set

        result.classify()
        return result

    # ------------------------------------------------------------------
    # Graph traversal helpers
    # "Causal" direction = toward outcome = upward via parent pointers
    # ------------------------------------------------------------------

    def _all_causal_paths_to(self, outcome_id: str) -> list[list[str]]:
        """All causal paths ending at outcome_id, starting from DAG leaves."""
        leaves = [nid for nid in self._g._nodes if self._g.is_leaf(nid)]
        all_paths: list[list[str]] = []
        for leaf in leaves:
            all_paths.extend(self._causal_paths_between(leaf, outcome_id))
        return all_paths

    def _causal_paths_between(self, source: str, target: str) -> list[list[str]]:
        """
        All simple causal paths from source to target following parent pointers.
        source = deeper cause, target = surface effect (ancestor in DAG).
        """
        if source == target:
            return [[source]]
        paths: list[list[str]] = []
        stack: list[tuple[str, list[str]]] = [(source, [source])]
        while stack:
            current, path = stack.pop()
            pid = self._g.parent_id(current)
            if pid is None:
                continue
            if pid == target:
                paths.append(path + [pid])
            elif pid not in path:
                stack.append((pid, path + [pid]))
        return paths

    def _causally_reachable_without(
        self,
        outcome: str,
        blocked: str,
        also_block: Optional[list[str]] = None,
    ) -> bool:
        """
        True if outcome is causally reachable from any DAG leaf while blocked
        (and also_block members) are treated as absent.

        also_block is the W-partition — suppressing alternative causal paths
        (OR-node siblings) so AC2 can pass for each individual OR-node member.
        """
        blocked_set: set[str] = {blocked} | set(also_block or [])
        leaves = [
            nid for nid in self._g._nodes
            if self._g.is_leaf(nid) and nid not in blocked_set
        ]
        visited: set[str] = set()
        stack = list(leaves)
        while stack:
            current = stack.pop()
            if current == outcome:
                return True
            if current in visited or current in blocked_set:
                continue
            visited.add(current)
            pid = self._g.parent_id(current)
            if pid and pid not in blocked_set:
                stack.append(pid)
        return False

    def _causal_ancestors_of(self, outcome_id: str) -> set[str]:
        """
        All causal ancestors of outcome = all DAG descendants (children).
        These are the nodes that can potentially cause outcome_id.
        """
        visited: set[str] = set()
        queue = list(self._g.children_ids(outcome_id))
        while queue:
            current = queue.pop(0)
            if current in visited:
                continue
            visited.add(current)
            queue.extend(self._g.children_ids(current))
        return visited

    def _minimal_sufficient_set(self, candidate_id: str, outcome_id: str) -> list[str]:
        """
        Structural approximation: {candidate_id} is its own sufficient set
        when candidate has a causal path to outcome.

        Limitation: AND/OR node distinctions require explicit SCM edge labels
        not present in the graph topology. The sibling-based set would conflate
        OR-siblings (each independently sufficient) with AND-siblings (jointly
        needed). PNS scores (causation/pns.py) provide the quantitative signal
        for distinguishing these cases.
        """
        paths = self._causal_paths_between(candidate_id, outcome_id)
        if not paths:
            return []
        return [candidate_id]

    def _is_causally_sufficient(self, node_ids: list[str], outcome_id: str) -> bool:
        """True if at least one node in node_ids has a causal path to outcome_id."""
        if not node_ids:
            return False
        return any(
            bool(self._causal_paths_between(nid, outcome_id))
            for nid in node_ids
        )
