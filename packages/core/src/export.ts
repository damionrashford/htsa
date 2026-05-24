import { Investigation } from "./investigation.js";
import { NodeStatus } from "./types.js";

export function toMarkdown(inv: Investigation): string {
  const lines: string[] = [];
  const { config, situation, graph } = inv;

  lines.push(`# HTSA Investigation: ${config.title}`);
  lines.push(`**Date:** ${config.date}  **Investigator:** ${config.investigator}  **Mode:** ${config.mode}`);
  lines.push("");

  // Layer 1
  lines.push("## Layer 1 — Situation Map");
  lines.push("");
  const sitFields: Array<[keyof typeof situation, string]> = [
    ["whoOriginator", "Who (Originator)"],
    ["whoTrigger", "Who (Trigger)"],
    ["whoAffected", "Who (Affected)"],
    ["whoDetector", "Who (Detector)"],
    ["whoResolver", "Who (Resolver)"],
    ["what", "What"],
    ["whenBefore", "When (Before)"],
    ["whenDuring", "When (During)"],
    ["whenAfter", "When (After)"],
    ["where", "Where"],
    ["whySurface", "Why (Surface)"],
  ];
  for (const [key, label] of sitFields) {
    const val = situation[key];
    if (val) lines.push(`**${label}:** ${val}`);
  }
  lines.push("");

  // Layer 2
  lines.push("## Layer 2 — Causal Chain");
  lines.push("");
  if (graph.originId) {
    renderNode(inv, graph.originId, lines, 0);
  }
  lines.push("");

  // Root causes
  const rootCauses = graph.rootCauses();
  if (rootCauses.length > 0) {
    lines.push("## Layer 3 — Root Causes & Resolutions");
    lines.push("");
    for (const node of rootCauses) {
      lines.push(`### ${node.statement}`);
      lines.push(`**Probability:** ${(node.probability * 100).toFixed(1)}%`);
      if (node.depthCriteria) {
        const dc = node.depthCriteria;
        lines.push(`**Depth Criteria:** Actionability=${dc.actionability} | Counterfactual=${dc.counterfactualClarity} | System Boundary=${dc.systemBoundary} | Diminishing Returns=${dc.diminishingReturns}`);
      }
      if (node.resolution) {
        const r = node.resolution;
        lines.push(`**Resolution:** [${r.type.toUpperCase()}] ${r.change}`);
        if (r.owner) lines.push(`**Owner:** ${r.owner}`);
        if (r.deadline) lines.push(`**Deadline:** ${r.deadline}`);
        lines.push(`**Priority Score:** ${r.priorityImpact * r.priorityRecurrence * r.priorityActionability} (Impact=${r.priorityImpact} × Recurrence=${r.priorityRecurrence} × Actionability=${r.priorityActionability})`);
      }
      lines.push("");
    }
  }

  // Layer 4
  const verRecords = inv.verification.records;
  if (verRecords.length > 0) {
    lines.push("## Layer 4 — Verification");
    lines.push("");
    for (const r of verRecords) {
      const status = r.confirmed === null ? "PENDING" : r.confirmed ? "CONFIRMED" : "FAILED";
      lines.push(`- **[${status}]** Node ${r.nodeId}: ${r.description} | Metric: ${r.metric}`);
    }
    lines.push("");
  }

  // Pruned
  const pruned = graph.prunedNodes();
  if (pruned.length > 0) {
    lines.push("## Pruned Branches");
    lines.push("");
    for (const n of pruned) {
      const p = n.prunedProbability !== null ? `${(n.prunedProbability * 100).toFixed(1)}%` : "?";
      lines.push(`- ${n.statement} (P=${p} at pruning)`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

function renderNode(
  inv: Investigation,
  nodeId: string,
  lines: string[],
  depth: number,
): void {
  const node = inv.graph.getNode(nodeId);
  const indent = "  ".repeat(depth);
  const prob = `${(node.probability * 100).toFixed(1)}%`;
  const statusBadge =
    node.status === NodeStatus.RootCause ? " ✓ ROOT CAUSE" :
    node.status === NodeStatus.Pruned ? " ✗ PRUNED" :
    node.status === NodeStatus.Escalated ? " ⚠ ESCALATED" : "";

  lines.push(`${indent}- **[${prob}]** ${node.statement}${statusBadge}`);

  for (const e of node.evidence) {
    const dir = e.direction === "supports" ? "+" : "-";
    lines.push(`${indent}  - [${dir}T${e.tier}] ${e.description}`);
  }

  for (const childId of inv.graph.childrenIds(nodeId)) {
    renderNode(inv, childId, lines, depth + 1);
  }
}
