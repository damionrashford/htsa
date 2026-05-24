import { Investigation } from "./investigation.js";
import type { InvestigationConfig, Node, SituationMap } from "./types.js";

interface SerializedGraph {
  nodes: Node[];
  edges: Array<{ parentId: string; childId: string }>;
  originId: string | null;
}

interface SerializedInvestigation {
  version: 2;
  config: InvestigationConfig;
  situation: SituationMap;
  graph: SerializedGraph;
  events: unknown[];
}

export function toDict(inv: Investigation): SerializedInvestigation {
  const nodes = inv.graph.allNodes();
  const edges: Array<{ parentId: string; childId: string }> = [];

  for (const node of nodes) {
    for (const childId of inv.graph.childrenIds(node.id)) {
      edges.push({ parentId: node.id, childId });
    }
  }

  return {
    version: 2,
    config: inv.config,
    situation: { ...inv.situation },
    graph: {
      nodes,
      edges,
      originId: inv.graph.originId,
    },
    events: inv.events,
  };
}

export function fromDict(data: SerializedInvestigation): Investigation {
  const inv = new Investigation(data.config);
  Object.assign(inv.situation, data.situation);

  const nodeMap = new Map<string, Node>(data.graph.nodes.map(n => [n.id, n]));
  const childrenOf = new Map<string, string[]>();
  const parentOf = new Map<string, string>();

  for (const { parentId, childId } of data.graph.edges) {
    if (!childrenOf.has(parentId)) childrenOf.set(parentId, []);
    childrenOf.get(parentId)!.push(childId);
    parentOf.set(childId, parentId);
  }

  if (data.graph.originId) {
    const bfs: string[] = [data.graph.originId];
    const visited = new Set<string>();
    while (bfs.length > 0) {
      const id = bfs.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      const node = nodeMap.get(id);
      if (!node) continue;
      const pid = parentOf.get(id);
      inv.graph.addNode(node, pid);
      for (const childId of childrenOf.get(id) ?? []) {
        bfs.push(childId);
      }
    }
  }

  return inv;
}

export function toJson(inv: Investigation, pretty = false): string {
  return JSON.stringify(toDict(inv), null, pretty ? 2 : undefined);
}

export function fromJson(json: string): Investigation {
  return fromDict(JSON.parse(json) as SerializedInvestigation);
}
