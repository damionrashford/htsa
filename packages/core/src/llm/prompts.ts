import type { InvestigationGraph } from "../graph.js";
import type { SituationMap } from "../types.js";

export const SYSTEM_PROMPT = `You are an investigation advisor using the HTSA (How to Solve Anything) framework.

HTSA investigates problems through 4 layers:
1. Situation Map — establish the 5 Ws (Who, What, When, Where, Why-surface)
2. Causal Chain — recursive Why questions forming a tree of hypotheses
3. Resolution — fix, mitigate, or accept each root cause
4. Verification — confirm fixes work, capture learning

Key rules:
- Evidence tiers: Physical (1, strongest), Observational (2), Inferential (3), Testimonial (4, weakest)
- Evidence direction: supports or contradicts a hypothesis
- Sibling hypothesis probabilities must sum to 1.0
- Root cause requires 4 depth criteria: Actionability, Counterfactual Clarity, System Boundary, Diminishing Returns
- Resolution types: fix (eliminate cause), mitigate (reduce impact), accept (acknowledge and monitor)
- Counterfactual test: "If this fix had existed before the problem, would the problem still have happened?"

Always respond with valid JSON matching the requested schema. No markdown fences.`;

export function buildContext(
  graph: InvestigationGraph,
  situation: SituationMap,
  focusNodeId?: string,
): string {
  const lines: string[] = [];

  if (situation.what) {
    lines.push("SITUATION:");
    const fields: Array<[keyof SituationMap, string]> = [
      ["whoAffected", "Who affected"],
      ["whoDetector", "Who detected"],
      ["what", "What"],
      ["whenBefore", "Before"],
      ["whenDuring", "During"],
      ["whenAfter", "After"],
      ["where", "Where"],
      ["whySurface", "Surface Why"],
    ];
    for (const [key, label] of fields) {
      const val = situation[key];
      if (val) lines.push(`  ${label}: ${val}`);
    }
    lines.push("");
  }

  if (graph.originId) {
    lines.push("INVESTIGATION TREE:");
    renderTree(graph, graph.originId, lines, focusNodeId);
    lines.push("");
  }

  const pruned = graph.prunedNodes();
  if (pruned.length > 0) {
    lines.push("PRUNED:");
    for (const n of pruned) {
      const p = n.prunedProbability !== null ? `${(n.prunedProbability * 100).toFixed(0)}%` : "?";
      lines.push(`  - ${n.statement} (was ${p})`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

function renderTree(
  graph: InvestigationGraph,
  nodeId: string,
  lines: string[],
  focusId?: string,
): void {
  const node = graph.getNode(nodeId);
  const indent = "  ".repeat(node.depth + 1);
  const marker = focusId && node.id === focusId ? " << FOCUS" : "";
  const prob = node.probability > 0 ? `${(node.probability * 100).toFixed(0)}%` : "?";
  lines.push(`${indent}[${prob}] ${node.statement} (${node.status})${marker}`);
  for (const e of node.evidence) {
    lines.push(`${indent}  | ${e.direction}: ${e.description} (Tier ${e.tier})`);
  }
  for (const childId of graph.childrenIds(nodeId)) {
    renderTree(graph, childId, lines, focusId);
  }
}

export function promptSuggestHypotheses(
  graph: InvestigationGraph,
  situation: SituationMap,
  parentId: string,
): string {
  const ctx = buildContext(graph, situation, parentId);
  const parent = graph.getNode(parentId);
  return `${ctx}

For the node marked FOCUS ("${parent.statement}"), suggest 2-5 hypotheses that could explain WHY this occurred.

Return JSON: {"hypotheses": [{"statement": string, "prior_probability": number, "rationale": string}]}
Probabilities must sum to 1.0.`;
}

export function promptEvaluateDepthCriteria(
  graph: InvestigationGraph,
  situation: SituationMap,
  nodeId: string,
): string {
  const ctx = buildContext(graph, situation, nodeId);
  const node = graph.getNode(nodeId);
  return `${ctx}

Evaluate depth criteria for the FOCUS node ("${node.statement}"):
1. Actionability: Can someone take a concrete action to fix this?
2. Counterfactual Clarity: Is the counterfactual clearly defined?
3. System Boundary: Is this a system/process cause, not just a person?
4. Diminishing Returns: Would asking "why" again produce useful new insight?

Return JSON: {"actionability": bool, "counterfactual_clarity": bool, "system_boundary": bool, "diminishing_returns": bool, "rationale": string}`;
}

export function promptSuggestResolution(
  graph: InvestigationGraph,
  situation: SituationMap,
  nodeId: string,
): string {
  const ctx = buildContext(graph, situation, nodeId);
  const node = graph.getNode(nodeId);
  return `${ctx}

Suggest a resolution for the confirmed root cause: "${node.statement}"

Return JSON: {"type": "fix"|"mitigate"|"accept", "change": string, "owner": string, "deadline": string, "counterfactual_passes": bool, "priority_impact": 1-5, "priority_recurrence": 1-5, "priority_actionability": 1-5, "rationale": string}`;
}
