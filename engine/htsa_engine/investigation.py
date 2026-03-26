"""
Investigation orchestrator — the main entry point.

Ties together the graph, probability engine, search strategy, evidence store,
bias guard, feedback loop handler, resolution engine, and verification tracker
into a single coherent investigation session.

This implements the HTSA algorithm from proofs/02_algorithm.md.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum

from .analysis import (
    AlertLevel,
    BiasAlert,
    BiasGuard,
    BiasType,
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
    InteractionType,
    InvestigationGraph,
    Node,
    NodeStatus,
    Resolution,
    ResolutionType,
    SituationMap,
)
from .resolution import (
    ResolutionEngine,
    VerificationTracker,
    VerificationWindowType,
)


class InvestigationMode(Enum):
    FULL = "full"
    RAPID = "rapid"


@dataclass
class InvestigationConfig:
    title: str = ""
    date: str = ""
    investigator: str = ""
    mode: InvestigationMode = InvestigationMode.FULL
    pruning_threshold: float = 0.05
    search_type: SearchType = SearchType.BEST_FIRST


class Investigation:
    """
    The main investigation session.

    Usage:
        inv = Investigation(title="Service outage", pruning_threshold=0.05)

        # Layer 1 — Situation Map
        inv.set_situation(what="API returning 500s", why_surface="Server errors")

        # Layer 2 — Causal Chain
        origin = inv.start_causal_chain("Server errors under load")
        branch_a = inv.add_hypothesis(origin, "Memory leak", probability=0.4)
        inv.add_evidence(branch_a, Evidence(...))
        inv.update_probability(branch_a, likelihood=0.9, likelihood_complement=0.2)

        # ... continue until root causes found
        inv.mark_root_cause(branch_a, depth_criteria=DepthCriteria(...))

        # Layer 3 — Resolution
        inv.resolve(branch_a, ResolutionType.FIX, "Fix memory leak in handler")

        # Layer 4 — Verification
        inv.add_verification(branch_a, VerificationWindowType.EVENT_DRIVEN, ...)

        # Serialize
        data = inv.to_dict()
        inv2 = Investigation.from_dict(data)
    """

    def __init__(
        self,
        title: str = "",
        pruning_threshold: float = 0.05,
        mode: InvestigationMode = InvestigationMode.FULL,
        search_type: SearchType = SearchType.BEST_FIRST,
        investigator: str = "",
        temporal_firewall_start: str | None = None,
    ) -> None:
        self.config = InvestigationConfig(
            title=title,
            date=datetime.now(timezone.utc).isoformat(),
            investigator=investigator,
            mode=mode,
            pruning_threshold=pruning_threshold,
            search_type=search_type,
        )

        # Rapid mode overrides (FRAMEWORK.md Time-Pressure Mode)
        if mode == InvestigationMode.RAPID:
            pruning_threshold = max(pruning_threshold, 0.20)
            search_type = SearchType.DFS
            self.config.pruning_threshold = pruning_threshold
            self.config.search_type = search_type

        # Core modules
        self.graph = InvestigationGraph()
        self.probability = ProbabilityEngine(pruning_threshold=pruning_threshold)
        self.search: SearchStrategy = create_search(search_type)
        self.bias_guard = BiasGuard()
        self.loop_handler = FeedbackLoopHandler()
        self.resolution_engine = ResolutionEngine()
        self.verification = VerificationTracker()

        # Evidence store with optional temporal firewall
        firewall = None
        if temporal_firewall_start:
            firewall = TemporalFirewall(investigation_start=temporal_firewall_start)
        self.evidence_store = EvidenceStore(firewall=firewall)

        # Layer 1
        self.situation = SituationMap()
        self._situation_complete = False

        # Event log
        self._events: list[dict] = []

    # -----------------------------------------------------------------------
    # Layer 1 — Situation Map
    # -----------------------------------------------------------------------

    def set_situation(self, **kwargs: str) -> SituationMap:
        """Set situation map fields. Valid keys match SituationMap fields."""
        for key, value in kwargs.items():
            if hasattr(self.situation, key):
                setattr(self.situation, key, value)
        self._situation_complete = self.situation.is_complete
        self._log("situation_updated", {"fields": list(kwargs.keys())})
        return self.situation

    def complete_situation(self) -> list[BiasAlert]:
        """
        Mark the situation map as complete and check for anchoring bias.
        Returns any bias alerts.
        """
        self._situation_complete = True
        self._log("situation_complete", {})
        return self.bias_guard.check_anchoring(self.graph)

    # -----------------------------------------------------------------------
    # Layer 2 — Causal Chain
    # -----------------------------------------------------------------------

    def start_causal_chain(self, surface_why: str) -> str:
        """
        Create the origin node from the surface Why.
        Returns the origin node ID.
        """
        if not self._situation_complete:
            alerts = self.bias_guard.check_anchoring(self.graph)
            if alerts:
                self._log("bias_alert", {"alerts": [a.message for a in alerts]})

        origin = Node(statement=surface_why, probability=1.0)
        node_id = self.graph.add_node(origin)
        self.search.add(origin)
        self.probability.record_entropy(self.graph)
        self._log("origin_created", {"node_id": node_id, "statement": surface_why})
        return node_id

    def add_hypothesis(
        self,
        parent_id: str,
        statement: str,
        probability: float | None = None,
    ) -> str:
        """
        Add a child hypothesis to a node in the Why tree.
        Returns the new node ID.
        """
        node = Node(statement=statement)
        node_id = self.graph.add_node(node, parent_id=parent_id)

        if probability is not None:
            node.probability = probability
        else:
            self.probability.set_uniform_priors(self.graph, parent_id)

        self.search.add(node)
        self.probability.record_entropy(self.graph)
        self._log("hypothesis_added", {
            "node_id": node_id,
            "parent_id": parent_id,
            "statement": statement,
            "probability": node.probability,
        })
        return node_id

    def set_branch_priors(self, priors: dict[str, float]) -> None:
        """Set explicit priors on a set of sibling nodes."""
        self.probability.set_priors(self.graph, priors)
        self.probability.record_entropy(self.graph)
        self._log("priors_set", {"priors": priors})

    def add_evidence(
        self,
        node_id: str,
        evidence: Evidence,
        likelihood: float | None = None,
        likelihood_complement: float | None = None,
    ) -> float:
        """
        Add evidence to a node and update its probability.
        Returns the new posterior.
        """
        posterior = self.probability.update_from_evidence(
            self.graph, node_id, evidence,
            likelihood=likelihood,
            likelihood_complement=likelihood_complement,
        )
        self._log("evidence_added", {
            "node_id": node_id,
            "evidence_id": evidence.id,
            "tier": evidence.tier.value,
            "direction": evidence.direction.value,
            "posterior": posterior,
        })
        return posterior

    def update_probability(
        self,
        node_id: str,
        evidence: Evidence,
        likelihood: float,
        likelihood_complement: float,
    ) -> float:
        """Explicit Bayesian update with provided likelihoods."""
        return self.probability.bayesian_update(
            self.graph, node_id, evidence, likelihood, likelihood_complement
        )

    def discard_hypothesis(
        self,
        node_id: str,
        reason: str = "",
    ) -> None:
        """
        Discard a hypothesis that fails the edge counterfactual test
        (proofs/02 step 7). The node is marked DISCARDED and removed
        from the search frontier.

        Use this when removing cause c would NOT change the outcome —
        meaning c is not a genuine causal factor.
        """
        node = self.graph.get_node(node_id)
        node.status = NodeStatus.DISCARDED
        self._log("hypothesis_discarded", {
            "node_id": node_id,
            "statement": node.statement,
            "reason": reason or "failed edge counterfactual test",
        })

    def flag_overdetermination(
        self,
        node_a_id: str,
        node_b_id: str,
    ) -> None:
        """
        Flag two nodes as overdetermined (OR-causation) per the two-stage
        COUNTERFACTUAL_TEST in proofs/02.

        Stage 1: Removing cause A alone doesn't change outcome (because B
                 is independently sufficient).
        Stage 2: Removing BOTH A and B does change outcome — so A IS a
                 genuine cause, masked by B.

        Both are genuine causes. Both must be resolved.
        """
        self.resolution_engine.add_interaction(
            node_a_id, node_b_id,
            InteractionType.OR,
            "Overdetermined — each cause is independently sufficient. "
            "Detected via contingent counterfactual test.",
        )
        self._log("overdetermination_flagged", {
            "node_a_id": node_a_id,
            "node_b_id": node_b_id,
        })

    def check_pruning(self, node_id: str, reason: str = "") -> bool:
        """Check if a node should be pruned. Returns True if pruned."""
        pruned = self.probability.check_and_prune(self.graph, node_id, reason)
        if pruned:
            self._log("node_pruned", {
                "node_id": node_id,
                "probability": self.graph.get_node(node_id).pruned_probability,
            })
        return pruned

    def restore_pruned(self, node_id: str, new_probability: float) -> None:
        """Un-prune a node if new evidence raises its probability."""
        self.probability.restore_pruned(self.graph, node_id, new_probability)
        self.search.add(self.graph.get_node(node_id))
        self._log("node_restored", {
            "node_id": node_id,
            "new_probability": new_probability,
        })

    def next_to_explore(self) -> Node | None:
        """Get the next node to explore from the search frontier."""
        return self.search.next()

    def switch_search_strategy(self, strategy: SearchType) -> None:
        """Switch search strategy mid-investigation (e.g., Best-First → BFS)."""
        old_type = self.search.strategy_type
        self.search = create_search(strategy)
        # Re-add all active frontier nodes
        for node in self.graph.frontier_nodes():
            self.search.add(node)
        self._log("search_switched", {
            "from": old_type.value,
            "to": strategy.value,
        })

    def mark_root_cause(
        self, node_id: str, depth_criteria: DepthCriteria
    ) -> list[BiasAlert]:
        """
        Mark a node as a confirmed root cause.

        Enforces Definition 4 from the formal spec:
          (a) children(v) = empty   — node must be a leaf
          (b) Ev(v) != empty        — evidence must exist
          (c-f) depth criteria      — all four tests must pass

        Returns any bias alerts (premature closure if criteria don't pass).
        """
        node = self.graph.get_node(node_id)
        node.depth_criteria = depth_criteria

        # Definition 4(a): must be a leaf node
        if not self.graph.is_leaf(node_id):
            self._log("root_cause_rejected", {
                "node_id": node_id,
                "reason": "not a leaf node — has unexplored children",
            })
            return [BiasAlert(
                bias_type=BiasType.PREMATURE_CLOSURE,
                level=AlertLevel.BLOCK,
                message=(
                    f"Node '{node.statement}' cannot be a root cause — it has children. "
                    f"A root cause must be a leaf node (Definition 4a)."
                ),
                node_id=node_id,
            )]

        # Definition 4(b): evidence must exist
        if not node.evidence:
            self._log("root_cause_rejected", {
                "node_id": node_id,
                "reason": "no evidence exists for this claim",
            })
            return [BiasAlert(
                bias_type=BiasType.PREMATURE_CLOSURE,
                level=AlertLevel.BLOCK,
                message=(
                    f"Node '{node.statement}' cannot be a root cause — it has no evidence. "
                    f"An assertion without evidence is a guess (Definition 4b)."
                ),
                node_id=node_id,
            )]

        # Definition 4(c-f): all four depth criteria must pass
        if not depth_criteria.all_passed:
            alerts = self.bias_guard.check_premature_closure(self.graph)
            self._log("root_cause_rejected", {
                "node_id": node_id,
                "reason": "depth criteria not all passed",
            })
            return alerts

        node.status = NodeStatus.ROOT_CAUSE
        self.probability.record_entropy(self.graph)
        self._log("root_cause_confirmed", {
            "node_id": node_id,
            "statement": node.statement,
            "probability": node.probability,
        })
        return []

    def check_biases(self) -> list[BiasAlert]:
        """Run all bias checks against current investigation state."""
        return self.bias_guard.check_all(
            self.graph,
            situation_complete=self._situation_complete,
        )

    # -----------------------------------------------------------------------
    # Feedback Loops
    # -----------------------------------------------------------------------

    def register_feedback_loop(
        self,
        cycle_nodes: list[str],
        cycle_descriptions: list[str],
    ) -> FeedbackLoop:
        """Register a detected feedback loop."""
        loop = self.loop_handler.register_loop(cycle_nodes, cycle_descriptions)
        self._log("feedback_loop_registered", {
            "cycle_nodes": cycle_nodes,
        })
        return loop

    # -----------------------------------------------------------------------
    # Layer 3 — Resolution
    # -----------------------------------------------------------------------

    def resolve(
        self,
        node_id: str,
        resolution_type: ResolutionType,
        change: str,
        owner: str = "",
        deadline: str = "",
        impact: int = 0,
        recurrence: int = 0,
        actionability: int = 0,
    ) -> Resolution:
        """Assign a resolution to a root cause."""
        resolution = self.resolution_engine.resolve(
            self.graph, node_id, resolution_type, change,
            owner=owner, deadline=deadline,
            impact=impact, recurrence=recurrence, actionability=actionability,
        )
        self._log("resolution_assigned", {
            "node_id": node_id,
            "type": resolution_type.value,
            "change": change,
            "priority_score": resolution.priority_score,
        })
        return resolution

    def test_fix_counterfactual(self, node_id: str, passes: bool) -> str | None:
        """Run the counterfactual test on a proposed fix."""
        result = self.resolution_engine.check_counterfactual(
            self.graph, node_id, passes
        )
        self._log("counterfactual_tested", {
            "node_id": node_id,
            "passes": passes,
            "result": result,
        })
        return result

    def add_root_cause_interaction(
        self,
        cause_a_id: str,
        cause_b_id: str,
        interaction_type: InteractionType,
        description: str,
    ) -> None:
        """Document an interaction between two root causes."""
        self.resolution_engine.add_interaction(
            cause_a_id, cause_b_id, interaction_type, description
        )

    def get_priority_order(self) -> list[tuple[Node, int]]:
        """Get root causes sorted by priority score."""
        return self.resolution_engine.prioritize(self.graph)

    # -----------------------------------------------------------------------
    # Layer 4 — Verification & Learning
    # -----------------------------------------------------------------------

    def add_verification(
        self,
        node_id: str,
        window_type: VerificationWindowType,
        window_description: str,
        metric: str,
        expected_date: str = "",
    ) -> None:
        self.verification.add_verification(
            node_id, window_type, window_description, metric, expected_date
        )
        self._log("verification_added", {
            "node_id": node_id,
            "window_type": window_type.value,
        })

    def verify(self, node_id: str, recurred: bool) -> str | None:
        result = self.verification.verify(self.graph, node_id, recurred)
        self._log("verification_result", {
            "node_id": node_id,
            "recurred": recurred,
            "result": result,
        })
        return result

    def record_learning(self, **kwargs) -> None:
        self.verification.record_learning(**kwargs)

    @property
    def is_closed(self) -> bool:
        return self.verification.is_investigation_closed()

    # -----------------------------------------------------------------------
    # Sub-investigations (recursive property)
    # -----------------------------------------------------------------------

    def spawn_sub_investigation(
        self,
        root_cause_id: str,
        title: str = "",
    ) -> "Investigation":
        """
        The framework is recursive: a root cause can become a new 'What'.

        Spawns a child investigation from a confirmed root cause node.
        The root cause's statement becomes the new investigation's 'what',
        and the parent investigation's context carries over.

        Returns a new Investigation instance linked to this one.
        """
        node = self.graph.get_node(root_cause_id)
        if node.status != NodeStatus.ROOT_CAUSE:
            raise ValueError(
                f"Node {root_cause_id} is not a confirmed root cause — "
                f"cannot spawn sub-investigation from status '{node.status.value}'"
            )

        sub_title = title or f"Sub-investigation: {node.statement}"
        sub = Investigation(
            title=sub_title,
            pruning_threshold=self.config.pruning_threshold,
            mode=self.config.mode,
            search_type=self.config.search_type,
            investigator=self.config.investigator,
        )

        # The root cause becomes the new 'what'
        sub.set_situation(
            what=node.statement,
            why_surface=f"Deeper investigation of: {node.statement}",
        )

        self._log("sub_investigation_spawned", {
            "parent_root_cause_id": root_cause_id,
            "sub_investigation_title": sub_title,
        })

        return sub

    # -----------------------------------------------------------------------
    # State queries
    # -----------------------------------------------------------------------

    @property
    def entropy(self) -> float:
        return self.probability.entropy(self.graph)

    @property
    def information_gain(self) -> float:
        return self.probability.information_gain()

    @property
    def entropy_history(self) -> list[float]:
        return self.probability.entropy_history

    @property
    def root_causes(self) -> list[Node]:
        return self.graph.root_causes()

    @property
    def pruned_branches(self) -> list[Node]:
        return self.graph.pruned_nodes()

    @property
    def events(self) -> list[dict]:
        return list(self._events)

    # -----------------------------------------------------------------------
    # Serialization (delegated to serialization.py)
    # -----------------------------------------------------------------------

    def to_dict(self) -> dict:
        """Serialize the entire investigation state to a dictionary."""
        from .serialization import investigation_to_dict
        return investigation_to_dict(self)

    def to_markdown(self) -> str:
        """Export the investigation as a markdown document matching FRAMEWORK.md templates."""
        from .export import to_markdown
        return to_markdown(
            config={
                "title": self.config.title,
                "date": self.config.date,
                "investigator": self.config.investigator,
                "mode": self.config.mode.value,
                "pruning_threshold": self.config.pruning_threshold,
            },
            situation=self.situation,
            graph=self.graph,
            pruning_log=self.probability.pruning_log,
            loops=self.loop_handler.loops,
            interactions=self.resolution_engine.interactions,
            verification_records=self.verification.records,
            learning={
                "prior_accuracy": self.verification.learning.prior_accuracy,
                "pruned_branches": self.verification.learning.pruned_branches,
                "first_hypothesis_correct": self.verification.learning.first_hypothesis_correct,
                "surprises": self.verification.learning.surprises,
                "prior_updates": self.verification.learning.prior_updates,
            },
        )

    def save_markdown(self, path: str) -> None:
        """Save investigation as a markdown file."""
        with open(path, "w") as f:
            f.write(self.to_markdown())

    def to_json(self, indent: int = 2) -> str:
        """Serialize to JSON string."""
        return json.dumps(self.to_dict(), indent=indent, default=str)

    def save(self, path: str) -> None:
        """Save investigation state to a JSON file."""
        with open(path, "w") as f:
            f.write(self.to_json())

    @classmethod
    def from_dict(cls, data: dict) -> Investigation:
        """Deserialize an investigation from a dictionary."""
        from .serialization import investigation_from_dict
        return investigation_from_dict(cls, data)

    @classmethod
    def load(cls, path: str) -> Investigation:
        """Load investigation state from a JSON file."""
        with open(path) as f:
            return cls.from_dict(json.loads(f.read()))

    # -----------------------------------------------------------------------
    # Internal
    # -----------------------------------------------------------------------

    def _log(self, event_type: str, data: dict) -> None:
        self._events.append({
            "type": event_type,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            **data,
        })
