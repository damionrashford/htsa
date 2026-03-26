"""
Markdown export — renders an investigation to the FRAMEWORK.md template format.

Produces both Linear and Branching template output depending on the
investigation structure.
"""

from __future__ import annotations

from .core import (
    EvidenceDirection,
    InvestigationGraph,
    Node,
    NodeStatus,
    SituationMap,
)


def to_markdown(
    config: dict,
    situation: SituationMap,
    graph: InvestigationGraph,
    pruning_log: list,
    loops: list,
    interactions: list,
    verification_records: list,
    learning: dict,
) -> str:
    """Render a full investigation as a markdown document."""
    lines: list[str] = []

    # Header
    lines.append(f"# Investigation: {config.get('title', 'Untitled')}")
    lines.append("")
    lines.append("```")
    lines.append(f"INVESTIGATION: {config.get('title', '')}")
    lines.append(f"DATE: {config.get('date', '')}")
    lines.append(f"INVESTIGATOR: {config.get('investigator', '')}")
    mode = config.get("mode", "full")
    if mode == "full":
        lines.append("MODE: [x] Full  [ ] Rapid")
    else:
        lines.append("MODE: [ ] Full  [x] Rapid (time-constrained — schedule full review later)")
    lines.append(f"PRUNING THRESHOLD (θ): {config.get('pruning_threshold', 0.05)}")
    lines.append("```")
    lines.append("")

    # Layer 1
    lines.append("---")
    lines.append("")
    lines.append("## Layer 1 — Situation Map (5 Ws)")
    lines.append("")
    _render_who(lines, situation)
    lines.append("")
    lines.append(f"**What:** {situation.what}")
    lines.append("")
    lines.append("**When:**")
    if situation.when_before:
        lines.append(f"- **Before:** {situation.when_before}")
    if situation.when_during:
        lines.append(f"- **During:** {situation.when_during}")
    if situation.when_after:
        lines.append(f"- **After:** {situation.when_after}")
    lines.append("")
    lines.append(f"**Where:** {situation.where}")
    lines.append("")
    lines.append(f"**Why (surface):** {situation.why_surface}")
    lines.append("")

    # Layer 2
    lines.append("---")
    lines.append("")
    lines.append("## Layer 2 — Causal Chain (5 Whys)")
    lines.append("")

    origin = graph.origin
    if origin:
        is_branching = _is_branching(graph, origin.id)
        if is_branching:
            _render_branching_tree(lines, graph, origin.id, indent=0)
        else:
            _render_linear_chain(lines, graph, origin.id)

    # Pruned branches
    if pruning_log:
        lines.append("")
        lines.append("### Pruned Branches")
        lines.append("")
        lines.append("```")
        for pr in pruning_log:
            nid = pr["node_id"] if isinstance(pr, dict) else getattr(pr, "node_id", "?")
            prob = pr["probability_at_pruning"] if isinstance(pr, dict) else getattr(pr, "probability_at_pruning", 0)
            reason = pr["reason"] if isinstance(pr, dict) else getattr(pr, "reason", "")
            lines.append(f"  {nid} — P = {prob:.4f} at pruning, {reason}")
        lines.append("```")

    # Feedback loops
    if loops:
        lines.append("")
        lines.append("### Feedback Loops")
        lines.append("")
        for loop in loops:
            descs = loop["cycle_descriptions"] if isinstance(loop, dict) else getattr(loop, "cycle_descriptions", [])
            lines.append("```")
            for desc in descs:
                lines.append(f"  {desc}")
            chosen = loop["chosen_break_point"] if isinstance(loop, dict) else getattr(loop, "chosen_break_point", None)
            if chosen:
                lines.append(f"  BREAK POINT: {chosen}")
            lines.append("```")
    lines.append("")

    # Layer 3
    lines.append("---")
    lines.append("")
    lines.append("## Layer 3 — Resolution")
    lines.append("")

    root_causes = graph.root_causes()
    for rc in root_causes:
        lines.append(f"### ROOT CAUSE: {rc.statement}")
        lines.append("")
        lines.append("```")
        if rc.resolution:
            res = rc.resolution
            lines.append(f"Type: {'[x]' if res.type.value == 'fix' else '[ ]'} Fix  "
                         f"{'[x]' if res.type.value == 'mitigate' else '[ ]'} Mitigate  "
                         f"{'[x]' if res.type.value == 'accept' else '[ ]'} Accept")
            lines.append(f"Must Change: {res.change}")
            lines.append(f"Owner: {res.owner}")
            lines.append(f"By When: {res.deadline}")
            cf = res.counterfactual_passes
            if cf is not None:
                lines.append(f"Counterfactual test on fix: {'Passes' if cf else 'FAILS — fix targets symptom'}")
            lines.append(f"Priority: Impact={res.priority_impact} × Recurrence={res.priority_recurrence} "
                         f"× Actionability={res.priority_actionability} = {res.priority_score}")
        lines.append("```")
        lines.append("")
        # Depth criteria
        dc = rc.depth_criteria
        lines.append(f"Depth criteria: "
                     f"[{'x' if dc.actionability else ' '}] Actionability  "
                     f"[{'x' if dc.counterfactual_clarity else ' '}] Counterfactual  "
                     f"[{'x' if dc.system_boundary else ' '}] Boundary  "
                     f"[{'x' if dc.diminishing_returns else ' '}] Returns")
        lines.append("")

    # Root cause interactions
    if interactions:
        lines.append("### Root Cause Interactions")
        lines.append("")
        for inter in interactions:
            itype = inter["interaction_type"] if isinstance(inter, dict) else getattr(inter, "interaction_type", "")
            if hasattr(itype, "value"):
                itype = itype.value
            desc = inter["description"] if isinstance(inter, dict) else getattr(inter, "description", "")
            lines.append(f"- **{itype.upper()}**: {desc}")
        lines.append("")

    # Layer 4
    lines.append("---")
    lines.append("")
    lines.append("## Layer 4 — Verification and Learning")
    lines.append("")

    if verification_records:
        lines.append("### Verification Windows")
        lines.append("")
        lines.append("```")
        for vr in verification_records:
            _g = lambda obj, key, default="": obj[key] if isinstance(obj, dict) else getattr(obj, key, default)
            nid = _g(vr, "node_id", "?")
            wtype = _g(vr, "window_type", "")
            if hasattr(wtype, "value"):
                wtype = wtype.value
            desc = _g(vr, "window_description", "")
            metric = _g(vr, "metric", "")
            exp = _g(vr, "expected_date", "")
            verified = _g(vr, "verified", None)
            lines.append(f"  Node: {nid}")
            lines.append(f"  Type: {wtype}")
            lines.append(f"  Window: {desc}")
            lines.append(f"  Metric: {metric}")
            if exp:
                lines.append(f"  Expected: {exp}")
            if verified is not None:
                lines.append(f"  Verified: {'Yes' if verified else 'No — return to Layer 2'}")
            lines.append("")
        lines.append("```")

    lines.append("")
    lines.append("### Learning")
    lines.append("")
    lines.append("```")
    if isinstance(learning, dict):
        pa = learning.get("prior_accuracy", "")
        pb = learning.get("pruned_branches", "")
        fhc = learning.get("first_hypothesis_correct")
        surprises = learning.get("surprises", [])
        lines.append(f"Prior accuracy: {pa or 'Not yet evaluated'}")
        lines.append(f"Pruned branches: {pb or 'Not yet evaluated'}")
        if fhc is not None:
            lines.append(f"First hypothesis correct: {'Yes' if fhc else 'No'}")
        if surprises:
            lines.append("Surprises:")
            for s in surprises:
                lines.append(f"  - {s}")
    lines.append("```")
    lines.append("")

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Internal rendering helpers
# ---------------------------------------------------------------------------

def _render_who(lines: list[str], situation: SituationMap) -> None:
    lines.append("**Who:**")
    lines.append("")
    lines.append("| Role | Actor |")
    lines.append("|---|---|")
    if situation.who_originator:
        lines.append(f"| **Originator** | {situation.who_originator} |")
    if situation.who_trigger:
        lines.append(f"| **Trigger** | {situation.who_trigger} |")
    if situation.who_affected:
        lines.append(f"| **Affected** | {situation.who_affected} |")
    if situation.who_detector:
        lines.append(f"| **Detector** | {situation.who_detector} |")
    if situation.who_resolver:
        lines.append(f"| **Resolver** | {situation.who_resolver} |")
    if situation.who_stakeholder:
        lines.append(f"| **Stakeholder** | {situation.who_stakeholder} |")


def _is_branching(graph: InvestigationGraph, node_id: str) -> bool:
    """Check if any node in the tree has more than one child."""
    if len(graph.children_ids(node_id)) > 1:
        return True
    for cid in graph.children_ids(node_id):
        if _is_branching(graph, cid):
            return True
    return False


def _render_linear_chain(lines: list[str], graph: InvestigationGraph, node_id: str) -> None:
    """Render a single-branch chain as the Linear Template."""
    level = 0
    current = node_id
    while current:
        node = graph.get_node(current)
        _render_why_node(lines, node, level)
        children = graph.children_ids(current)
        current = children[0] if children else None
        level += 1


def _render_branching_tree(
    lines: list[str], graph: InvestigationGraph, node_id: str, indent: int
) -> None:
    """Render a multi-branch tree as the Branching Template."""
    node = graph.get_node(node_id)
    _render_why_node(lines, node, indent)
    children = graph.children_ids(node_id)
    for cid in children:
        _render_branching_tree(lines, graph, cid, indent + 1)


def _render_why_node(lines: list[str], node: Node, level: int) -> None:
    """Render a single Why node with evidence and status."""
    prefix = "  " * level
    status_label = ""
    if node.status == NodeStatus.ROOT_CAUSE:
        status_label = " ← ROOT CAUSE"
    elif node.status == NodeStatus.PRUNED:
        status_label = " [PRUNED]"
    elif node.status == NodeStatus.DISCARDED:
        status_label = " [DISCARDED]"
    elif node.status == NodeStatus.ESCALATED:
        status_label = " [ESCALATED]"

    label = f"Why {level}" if level > 0 else "Why (surface)"
    lines.append(f"{prefix}**{label}:** {node.statement}{status_label}  P = {node.probability:.2f}")

    if node.evidence:
        lines.append(f"{prefix}  Evidence:")
        for e in node.evidence:
            direction = "+" if e.direction == EvidenceDirection.SUPPORTS else "-"
            lines.append(f"{prefix}    [{direction}] Tier {e.tier.value} — {e.source}: {e.description}")

    finding = node.is_finding
    lines.append(f"{prefix}  Status: {'[x] Finding' if finding else '[ ] Hypothesis'}")
    lines.append("")
