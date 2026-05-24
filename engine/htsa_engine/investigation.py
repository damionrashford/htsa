"""
Investigation orchestrator — the main entry point for an HTSA session.

Implements the HTSA algorithm from proofs/02_algorithm.md.
Layer 1 (Situation Map) lives in situation_map.py.
Layer 4 (Verification & Learning) lives in learning_loop.py.
This file owns Layer 2 (Causal Chain), Layer 3 (Resolution),
state queries, serialization, and the event log.
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
    EvidenceBudget,
    FeedbackLoop,
    FeedbackLoopHandler,
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
    InterventionResult,
    MinimalInterventionCalculator,
    NormalityScorer,
    PNSCalculator,
    PrioritizedRootCause,
    prioritize_root_causes,
)
from .core import (
    NormalityScore,
    PNSScore,
    SecondOrderUncertainty,
    TimeIndex,
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
from .learning_loop import LearningLoopMixin
from .resolution import (
    ResolutionEngine,
    VerificationTracker,
    VerificationWindowType,
)
from .situation_map import SituationMapMixin


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


class Investigation(SituationMapMixin, LearningLoopMixin):
    """
    The main investigation session.

    Layers:
      1 — Situation Map  → set_situation(), complete_situation()  [situation_map.py]
      2 — Causal Chain   → start_causal_chain(), add_hypothesis(), add_evidence(), ...
      3 — Resolution     → resolve(), test_fix_counterfactual(), get_priority_order()
      4 — Verification   → add_verification(), verify(), record_learning()  [learning_loop.py]

    Quick start:
        inv = Investigation(title="Service outage")
        inv.set_situation(what="API returning 500s", why_surface="Server errors")
        origin = inv.start_causal_chain("Server errors under load")
        h = inv.add_hypothesis(origin, "Memory leak", probability=0.4)
        inv.add_evidence(h, Evidence(...))
        inv.mark_root_cause(h, DepthCriteria(...))
        inv.resolve(h, ResolutionType.FIX, "Fix memory leak in handler")
        inv.add_verification(h, VerificationWindowType.EVENT_DRIVEN, ...)
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

        # Rapid mode overrides — FRAMEWORK.md Time-Pressure Mode
        if mode == InvestigationMode.RAPID:
            pruning_threshold = max(pruning_threshold, 0.20)
            search_type = SearchType.DFS
            self.config.pruning_threshold = pruning_threshold
            self.config.search_type = search_type

        self.graph = InvestigationGraph()
        self.probability = ProbabilityEngine(pruning_threshold=pruning_threshold)
        self.search: SearchStrategy = create_search(search_type)
        self.bias_guard = BiasGuard()
        self.loop_handler = FeedbackLoopHandler()
        self.resolution_engine = ResolutionEngine()
        self.verification = VerificationTracker()

        firewall = None
        if temporal_firewall_start:
            firewall = TemporalFirewall(investigation_start=temporal_firewall_start)
        self.evidence_store = EvidenceStore(firewall=firewall)

        self.situation = SituationMap()
        self._situation_complete = False
        self._events: list[dict] = []

    # -----------------------------------------------------------------------
    # Layer 2 — Causal Chain
    # -----------------------------------------------------------------------

    def start_causal_chain(self, surface_why: str) -> str:
        """Create the origin node from the surface Why. Returns the origin node ID."""
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
        """Add a child hypothesis to the Why tree. Returns the new node ID."""
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
        """Add evidence to a node and update its probability. Returns the new posterior."""
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

    def discard_hypothesis(self, node_id: str, reason: str = "") -> None:
        """
        Discard a hypothesis that fails the counterfactual test.
        Removing this cause would NOT change the outcome — it is not a genuine causal factor.
        """
        node = self.graph.get_node(node_id)
        node.status = NodeStatus.DISCARDED
        self._log("hypothesis_discarded", {
            "node_id": node_id,
            "statement": node.statement,
            "reason": reason or "failed edge counterfactual test",
        })

    def flag_overdetermination(self, node_a_id: str, node_b_id: str) -> None:
        """
        Flag two nodes as overdetermined OR-causes (proofs/02 Stage 2).
        Both are genuine causes; each is independently sufficient.
        Both must be resolved.
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
        """Un-prune a node when new evidence raises its probability above threshold."""
        self.probability.restore_pruned(self.graph, node_id, new_probability)
        self.search.add(self.graph.get_node(node_id))
        self._log("node_restored", {
            "node_id": node_id,
            "new_probability": new_probability,
        })

    def next_to_explore(self) -> Node | None:
        """Return the next node to explore from the search frontier."""
        return self.search.next()

    def switch_search_strategy(self, strategy: SearchType) -> None:
        """Switch search strategy mid-investigation (e.g., Best-First → BFS)."""
        old_type = self.search.strategy_type
        self.search = create_search(strategy)
        for node in self.graph.frontier_nodes():
            self.search.add(node)
        self._log("search_switched", {"from": old_type.value, "to": strategy.value})

    def mark_root_cause(self, node_id: str, depth_criteria: DepthCriteria) -> list[BiasAlert]:
        """
        Mark a node as a confirmed root cause.

        Enforces Definition 4 from proofs/01_formal_definitions.md:
          (a) children(v) = empty   — must be a leaf node
          (b) Ev(v) != empty        — evidence must exist
          (c-f) depth criteria      — all four tests must pass

        Returns bias alerts if criteria aren't met (blocks premature closure).
        """
        node = self.graph.get_node(node_id)
        node.depth_criteria = depth_criteria

        if not self.graph.is_leaf(node_id):
            self._log("root_cause_rejected", {
                "node_id": node_id, "reason": "not a leaf node"
            })
            return [BiasAlert(
                bias_type=BiasType.PREMATURE_CLOSURE,
                level=AlertLevel.BLOCK,
                message=(
                    f"Node '{node.statement}' cannot be a root cause — it has children. "
                    "A root cause must be a leaf node (Definition 4a)."
                ),
                node_id=node_id,
            )]

        if not node.evidence:
            self._log("root_cause_rejected", {
                "node_id": node_id, "reason": "no evidence"
            })
            return [BiasAlert(
                bias_type=BiasType.PREMATURE_CLOSURE,
                level=AlertLevel.BLOCK,
                message=(
                    f"Node '{node.statement}' cannot be a root cause — it has no evidence. "
                    "An assertion without evidence is a guess (Definition 4b)."
                ),
                node_id=node_id,
            )]

        if not depth_criteria.all_passed:
            alerts = self.bias_guard.check_premature_closure(self.graph)
            self._log("root_cause_rejected", {
                "node_id": node_id, "reason": "depth criteria not all passed"
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
        """Run all bias checks against the current investigation state."""
        return self.bias_guard.check_all(
            self.graph, situation_complete=self._situation_complete,
        )

    # -----------------------------------------------------------------------
    # Feedback Loops
    # -----------------------------------------------------------------------

    def register_feedback_loop(
        self,
        cycle_nodes: list[str],
        cycle_descriptions: list[str],
    ) -> FeedbackLoop:
        """Register a detected feedback loop in the causal graph."""
        loop = self.loop_handler.register_loop(cycle_nodes, cycle_descriptions)
        self._log("feedback_loop_registered", {"cycle_nodes": cycle_nodes})
        return loop

    # -----------------------------------------------------------------------
    # Causation analysis (math/09, math/10)
    # -----------------------------------------------------------------------

    def run_hp2015_test(
        self,
        candidate_id: str,
        outcome_id: str,
    ) -> CounterfactualResult:
        """
        Run the three-stage counterfactual stack (HP2015 + NESS).

        Stores results on the candidate node (hp2015_result, hp2015_w_partition,
        ness_minimal_set). Returns the full CounterfactualResult.
        """
        tester = CounterfactualTester(self.graph)
        result = tester.test_full_stack(candidate_id, outcome_id)

        node = self.graph.get_node(candidate_id)
        node.hp2015_result = result.is_root_cause
        node.hp2015_w_partition = result.w_partition
        node.ness_minimal_set = result.ness_sufficient_set

        self._log("hp2015_test_run", {
            "candidate_id": candidate_id,
            "outcome_id": outcome_id,
            "is_root_cause": result.is_root_cause,
            "stage1": result.stage1_passes,
            "stage2": result.stage2_passes,
            "stage3": result.stage3_ness_passes,
        })
        return result

    def compute_pns(
        self,
        node_id: str,
        pn: float,
        ps: float,
        monotonicity_assumed: bool = True,
    ) -> PNSScore:
        """
        Compute PNS from investigator-provided PN and PS estimates.

        Stores result on node.pns_score. For experimental/observational data,
        use PNSCalculator directly and pass the result to this method.
        """
        score = PNSCalculator(node_id).from_subjective(
            pn=pn, ps=ps, monotonicity_assumed=monotonicity_assumed
        )
        self.graph.get_node(node_id).pns_score = score
        self._log("pns_computed", {
            "node_id": node_id, "pn": pn, "ps": ps,
            "pns": score.pns, "type": score.causation_type,
        })
        return score

    def compute_normality_score(
        self,
        node_id: str,
        normality: float,
        reasoning: str = "",
    ) -> NormalityScore:
        """
        Set a normality score (from investigator judgment) on a node.

        Also computes causal_grade if node.pns_score is already set.
        """
        scorer = NormalityScorer()
        norm_score = scorer.from_subjective(node_id, normality, reasoning)

        node = self.graph.get_node(node_id)
        node.normality_score = norm_score

        if node.pns_score is not None:
            scorer.compute_grade(norm_score, node.pns_score)

        self._log("normality_scored", {
            "node_id": node_id, "normality": normality,
            "causal_grade": norm_score.causal_grade,
        })
        return norm_score

    def compute_minimal_intervention_set(
        self,
        theta: float = 0.90,
        and_groups: list[ANDGroup] | None = None,
    ) -> InterventionResult:
        """
        Find the minimal subset of root causes whose fixing achieves coverage >= theta.

        Updates Resolution.minimal_intervention and Resolution.intervention_coverage
        on the nodes in the minimal set.
        """
        root_cause_nodes = self.graph.root_causes()
        pns_scores: list[PNSScore] = []

        for node in root_cause_nodes:
            if node.pns_score is not None:
                pns_scores.append(node.pns_score)
            else:
                # Default: treat as contributing factor (PNS=0.3) if no score set
                default = PNSCalculator(node.id).from_subjective(pn=0.5, ps=0.5)
                pns_scores.append(default)

        calc = MinimalInterventionCalculator(
            root_causes=pns_scores,
            and_groups=and_groups,
            theta=theta,
        )
        result = calc.find_minimal_set()

        # Tag the minimal set nodes
        minimal_set = set(result.minimal_set)
        for node in root_cause_nodes:
            if node.resolution is not None:
                node.resolution.minimal_intervention = node.id in minimal_set
                node.resolution.intervention_coverage = (
                    calc.coverage([node.id]) if node.id in minimal_set else 0.0
                )

        self._log("minimal_intervention_computed", {
            "minimal_set": result.minimal_set,
            "coverage": result.coverage,
            "threshold": theta,
            "achieved": result.threshold_achieved,
        })
        return result

    def evidence_budget(
        self,
        node_id: str,
        alternative_posteriors: dict[str, float],
        confidence_target: float = 0.05,
    ) -> EvidenceBudget:
        """
        Compute how many independent Tier-1 evidence pieces are needed to
        discriminate this node from its alternatives.
        """
        node = self.graph.get_node(node_id)
        return self.probability.evidence_budget(
            current_posterior=node.probability,
            alternative_posteriors=alternative_posteriors,
            confidence_target=confidence_target,
        )

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
        """Assign a resolution to a confirmed root cause."""
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
        """
        Run the counterfactual test on a proposed fix.
        'If this fix had existed, would the problem still have occurred?'
        """
        result = self.resolution_engine.check_counterfactual(self.graph, node_id, passes)
        self._log("counterfactual_tested", {
            "node_id": node_id, "passes": passes, "result": result,
        })
        return result

    def add_root_cause_interaction(
        self,
        cause_a_id: str,
        cause_b_id: str,
        interaction_type: InteractionType,
        description: str,
    ) -> None:
        """Document a causal interaction (AND, OR, amplification, conflict) between two root causes."""
        self.resolution_engine.add_interaction(
            cause_a_id, cause_b_id, interaction_type, description
        )

    def get_priority_order(self) -> list[tuple[Node, int]]:
        """Return root causes sorted by priority score (impact × recurrence × actionability)."""
        return self.resolution_engine.prioritize(self.graph)

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
    # Serialization
    # -----------------------------------------------------------------------

    def to_dict(self) -> dict:
        """Serialize the entire investigation state to a dictionary."""
        from .serialization import investigation_to_dict
        return investigation_to_dict(self)

    def to_markdown(self) -> str:
        """Export as a markdown document matching FRAMEWORK.md templates."""
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
        with open(path, "w") as f:
            f.write(self.to_markdown())

    def to_json(self, indent: int = 2) -> str:
        return json.dumps(self.to_dict(), indent=indent, default=str)

    def save(self, path: str) -> None:
        with open(path, "w") as f:
            f.write(self.to_json())

    @classmethod
    def from_dict(cls, data: dict) -> Investigation:
        from .serialization import investigation_from_dict
        return investigation_from_dict(cls, data)

    @classmethod
    def load(cls, path: str) -> Investigation:
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
