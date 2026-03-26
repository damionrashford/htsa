"""
Serialization — JSON round-trip for investigation state.

Extracted from investigation.py to keep the orchestrator focused
on investigation logic. This module handles to_dict / from_dict
for the full investigation state including graph, probability,
loops, interactions, verification, and events.
"""

from __future__ import annotations

import json
from typing import TYPE_CHECKING

from .analysis.loops import BreakPoint, FeedbackLoop
from .analysis.probability import PruningRecord
from .core import (
    DepthCriteria,
    Evidence,
    EvidenceDirection,
    EvidenceTier,
    InteractionType,
    Node,
    NodeStatus,
    Resolution,
    ResolutionType,
)
from .resolution.engine import RootCauseInteraction
from .resolution.verification import (
    LearningRecord,
    VerificationRecord,
    VerificationWindowType,
)

if TYPE_CHECKING:
    from .investigation import Investigation, InvestigationMode


# ---------------------------------------------------------------------------
# Serialize
# ---------------------------------------------------------------------------

def investigation_to_dict(inv: Investigation) -> dict:
    """Serialize the entire investigation state to a dictionary."""

    def _node_to_dict(node: Node) -> dict:
        d = {
            "id": node.id,
            "statement": node.statement,
            "probability": node.probability,
            "depth": node.depth,
            "status": node.status.value,
            "reopen_count": node.reopen_count,
            "pruned_probability": node.pruned_probability,
            "evidence": [
                {
                    "id": e.id,
                    "source": e.source,
                    "tier": e.tier.value,
                    "timestamp": e.timestamp,
                    "direction": e.direction.value,
                    "description": e.description,
                }
                for e in node.evidence
            ],
            "depth_criteria": {
                "actionability": node.depth_criteria.actionability,
                "counterfactual_clarity": node.depth_criteria.counterfactual_clarity,
                "system_boundary": node.depth_criteria.system_boundary,
                "diminishing_returns": node.depth_criteria.diminishing_returns,
            },
        }
        if node.resolution:
            d["resolution"] = {
                "type": node.resolution.type.value,
                "change": node.resolution.change,
                "owner": node.resolution.owner,
                "deadline": node.resolution.deadline,
                "counterfactual_passes": node.resolution.counterfactual_passes,
                "priority_impact": node.resolution.priority_impact,
                "priority_recurrence": node.resolution.priority_recurrence,
                "priority_actionability": node.resolution.priority_actionability,
            }
        return d

    nodes = {}
    edges = {}
    for node in inv.graph.all_nodes():
        nodes[node.id] = _node_to_dict(node)
        children_ids = inv.graph.children_ids(node.id)
        if children_ids:
            edges[node.id] = children_ids

    # Temporal firewall config
    firewall_data = None
    if inv.evidence_store.firewall:
        firewall_data = {
            "investigation_start": inv.evidence_store.firewall.investigation_start,
            "reliability_discount": inv.evidence_store.firewall.reliability_discount,
        }

    return {
        "config": {
            "title": inv.config.title,
            "date": inv.config.date,
            "investigator": inv.config.investigator,
            "mode": inv.config.mode.value,
            "pruning_threshold": inv.config.pruning_threshold,
            "search_type": inv.config.search_type.value,
            "temporal_firewall": firewall_data,
        },
        "situation": {
            "who_originator": inv.situation.who_originator,
            "who_trigger": inv.situation.who_trigger,
            "who_affected": inv.situation.who_affected,
            "who_detector": inv.situation.who_detector,
            "who_resolver": inv.situation.who_resolver,
            "who_stakeholder": inv.situation.who_stakeholder,
            "what": inv.situation.what,
            "when_before": inv.situation.when_before,
            "when_during": inv.situation.when_during,
            "when_after": inv.situation.when_after,
            "where": inv.situation.where,
            "why_surface": inv.situation.why_surface,
        },
        "graph": {
            "origin_id": inv.graph.origin_id,
            "nodes": nodes,
            "edges": edges,
        },
        "probability": {
            "entropy_history": inv.probability.entropy_history,
            "pruning_log": [
                {
                    "node_id": r.node_id,
                    "probability_at_pruning": r.probability_at_pruning,
                    "reason": r.reason,
                    "evidence_ids": r.evidence_ids,
                }
                for r in inv.probability.pruning_log
            ],
        },
        "loops": [
            {
                "cycle_nodes": loop.cycle_nodes,
                "cycle_descriptions": loop.cycle_descriptions,
                "break_points": [
                    {
                        "node_id": bp.node_id,
                        "description": bp.description,
                        "feasibility": bp.feasibility,
                        "rationale": bp.rationale,
                    }
                    for bp in loop.break_points
                ],
                "chosen_break_point": loop.chosen_break_point,
            }
            for loop in inv.loop_handler.loops
        ],
        "interactions": [
            {
                "cause_a_id": i.cause_a_id,
                "cause_b_id": i.cause_b_id,
                "interaction_type": i.interaction_type.value,
                "description": i.description,
            }
            for i in inv.resolution_engine.interactions
        ],
        "verification": {
            "records": [
                {
                    "node_id": r.node_id,
                    "window_type": r.window_type.value,
                    "window_description": r.window_description,
                    "metric": r.metric,
                    "expected_date": r.expected_date,
                    "verified": r.verified,
                    "recurred": r.recurred,
                }
                for r in inv.verification.records
            ],
            "learning": {
                "prior_accuracy": inv.verification.learning.prior_accuracy,
                "pruned_branches": inv.verification.learning.pruned_branches,
                "first_hypothesis_correct": inv.verification.learning.first_hypothesis_correct,
                "surprises": inv.verification.learning.surprises,
                "prior_updates": inv.verification.learning.prior_updates,
            },
        },
        "events": inv._events,
    }


# ---------------------------------------------------------------------------
# Deserialize
# ---------------------------------------------------------------------------

def investigation_from_dict(cls: type[Investigation], data: dict) -> Investigation:
    """Deserialize an investigation from a dictionary."""
    from .analysis import SearchType
    from .investigation import InvestigationMode

    config = data["config"]

    # Restore temporal firewall
    fw_data = config.get("temporal_firewall")
    fw_start = None
    if fw_data:
        fw_start = fw_data.get("investigation_start")

    inv = cls(
        title=config["title"],
        pruning_threshold=config["pruning_threshold"],
        mode=InvestigationMode(config["mode"]),
        search_type=SearchType(config["search_type"]),
        investigator=config.get("investigator", ""),
        temporal_firewall_start=fw_start,
    )
    inv.config.date = config["date"]

    # Restore firewall discount if non-default
    if fw_data and inv.evidence_store.firewall:
        inv.evidence_store.firewall.reliability_discount = fw_data.get(
            "reliability_discount", 0.5
        )

    # Restore situation
    sit = data.get("situation", {})
    for key, value in sit.items():
        if hasattr(inv.situation, key):
            setattr(inv.situation, key, value)
    inv._situation_complete = inv.situation.is_complete

    # Restore nodes
    graph_data = data.get("graph", {})
    node_objects: dict[str, Node] = {}

    for nid, ndata in graph_data.get("nodes", {}).items():
        evidence_list = [
            Evidence(
                id=e["id"],
                source=e["source"],
                tier=EvidenceTier(e["tier"]),
                timestamp=e["timestamp"],
                direction=EvidenceDirection(e["direction"]),
                description=e.get("description", ""),
            )
            for e in ndata.get("evidence", [])
        ]
        dc_data = ndata.get("depth_criteria", {})
        depth_criteria = DepthCriteria(
            actionability=dc_data.get("actionability"),
            counterfactual_clarity=dc_data.get("counterfactual_clarity"),
            system_boundary=dc_data.get("system_boundary"),
            diminishing_returns=dc_data.get("diminishing_returns"),
        )
        res_data = ndata.get("resolution")
        resolution = None
        if res_data:
            resolution = Resolution(
                type=ResolutionType(res_data["type"]),
                change=res_data["change"],
                owner=res_data.get("owner", ""),
                deadline=res_data.get("deadline", ""),
                counterfactual_passes=res_data.get("counterfactual_passes"),
                priority_impact=res_data.get("priority_impact", 0),
                priority_recurrence=res_data.get("priority_recurrence", 0),
                priority_actionability=res_data.get("priority_actionability", 0),
            )

        node = Node(
            id=nid,
            statement=ndata["statement"],
            probability=ndata["probability"],
            depth=ndata.get("depth", 0),
            status=NodeStatus(ndata["status"]),
            evidence=evidence_list,
            depth_criteria=depth_criteria,
            resolution=resolution,
            reopen_count=ndata.get("reopen_count", 0),
            pruned_probability=ndata.get("pruned_probability"),
        )
        node_objects[nid] = node

    # Rebuild graph structure
    origin_id = graph_data.get("origin_id")
    if origin_id and origin_id in node_objects:
        inv.graph.add_node(node_objects[origin_id])

    # Add children in edge order
    edges = graph_data.get("edges", {})
    added = {origin_id} if origin_id else set()
    queue = [origin_id] if origin_id else []
    while queue:
        pid = queue.pop(0)
        for cid in edges.get(pid, []):
            if cid in node_objects and cid not in added:
                inv.graph.add_node(node_objects[cid], parent_id=pid)
                added.add(cid)
                queue.append(cid)
                if node_objects[cid].status == NodeStatus.OPEN:
                    inv.search.add(node_objects[cid])

    # Restore probability state
    prob_data = data.get("probability", {})
    inv.probability._entropy_history = prob_data.get("entropy_history", [])
    for pr in prob_data.get("pruning_log", []):
        inv.probability.pruning_log.append(PruningRecord(
            node_id=pr["node_id"],
            probability_at_pruning=pr["probability_at_pruning"],
            reason=pr["reason"],
            evidence_ids=pr.get("evidence_ids", []),
        ))

    # Restore feedback loops
    for loop_data in data.get("loops", []):
        loop = FeedbackLoop(
            cycle_nodes=loop_data["cycle_nodes"],
            cycle_descriptions=loop_data["cycle_descriptions"],
            chosen_break_point=loop_data.get("chosen_break_point"),
        )
        for bp_data in loop_data.get("break_points", []):
            loop.break_points.append(BreakPoint(
                node_id=bp_data["node_id"],
                description=bp_data["description"],
                feasibility=bp_data.get("feasibility", ""),
                rationale=bp_data.get("rationale", ""),
            ))
        inv.loop_handler.loops.append(loop)

    # Restore root cause interactions
    for i_data in data.get("interactions", []):
        inv.resolution_engine.interactions.append(RootCauseInteraction(
            cause_a_id=i_data["cause_a_id"],
            cause_b_id=i_data["cause_b_id"],
            interaction_type=InteractionType(i_data["interaction_type"]),
            description=i_data["description"],
        ))

    # Restore verification records and learning
    v_data = data.get("verification", {})
    for vr in v_data.get("records", []):
        inv.verification.records.append(VerificationRecord(
            node_id=vr["node_id"],
            window_type=VerificationWindowType(vr["window_type"]),
            window_description=vr["window_description"],
            metric=vr["metric"],
            expected_date=vr.get("expected_date", ""),
            verified=vr.get("verified"),
            recurred=vr.get("recurred"),
        ))
    learn = v_data.get("learning", {})
    if learn:
        inv.verification.learning = LearningRecord(
            prior_accuracy=learn.get("prior_accuracy", ""),
            pruned_branches=learn.get("pruned_branches", ""),
            first_hypothesis_correct=learn.get("first_hypothesis_correct"),
            surprises=learn.get("surprises", []),
            prior_updates=learn.get("prior_updates", {}),
        )

    # Restore events
    inv._events = data.get("events", [])

    return inv
