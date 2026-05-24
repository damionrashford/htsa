import type { InterventionResult, PNSScore } from "../types.js";

export interface ANDGroup {
  nodeIds: string[];
  jointPns: number;
}

function computeJointPns(group: ANDGroup, pnsMap: Map<string, PNSScore>): number {
  let result = 1.0;
  for (const nid of group.nodeIds) {
    const score = pnsMap.get(nid);
    result *= score ? score.pns : 0;
  }
  return result;
}

function coverage(
  nodeIds: string[],
  pnsMap: Map<string, PNSScore>,
  andGroups: ANDGroup[],
): number {
  const included = new Set(nodeIds);
  const handled = new Set<string>();
  const effectivePns: number[] = [];

  for (const group of andGroups) {
    if (group.nodeIds.every(id => included.has(id))) {
      effectivePns.push(group.jointPns);
    }
    for (const id of group.nodeIds) handled.add(id);
  }

  for (const id of nodeIds) {
    if (!handled.has(id)) {
      const score = pnsMap.get(id);
      if (score) effectivePns.push(score.pns);
    }
  }

  const product = effectivePns.reduce((acc, p) => acc * (1 - p), 1.0);
  return 1.0 - product;
}

function* combinations<T>(arr: T[], k: number): Generator<T[]> {
  if (k === 0) { yield []; return; }
  if (arr.length < k) return;
  const [first, ...rest] = arr;
  if (first === undefined) return;
  for (const combo of combinations(rest, k - 1)) yield [first, ...combo];
  yield* combinations(rest, k);
}

export function findMinimalInterventionSet(
  rootCauses: PNSScore[],
  andGroups: ANDGroup[] = [],
  theta = 0.90,
): InterventionResult {
  const pnsMap = new Map(rootCauses.map(r => [r.nodeId, r]));
  const processedGroups = andGroups.map(g => ({
    ...g,
    jointPns: computeJointPns(g, pnsMap),
  }));
  const allIds = rootCauses.map(r => r.nodeId);

  for (let k = 1; k <= allIds.length; k++) {
    for (const subset of combinations(allIds, k)) {
      const cov = coverage(subset, pnsMap, processedGroups);
      if (cov >= theta) {
        return {
          minimalSet: subset,
          coverage: cov,
          threshold: theta,
          thresholdAchieved: true,
          iterations: k,
        };
      }
    }
  }

  const fullCov = coverage(allIds, pnsMap, processedGroups);
  return {
    minimalSet: allIds,
    coverage: fullCov,
    threshold: theta,
    thresholdAchieved: fullCov >= theta,
    iterations: allIds.length,
  };
}
