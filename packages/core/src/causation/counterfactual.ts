import type { CounterfactualResult } from "../types.js";
import type { InvestigationGraph } from "../graph.js";

export class CounterfactualTester {
  constructor(private readonly graph: InvestigationGraph) {}

  testStage1(candidateId: string, outcomeId: string): boolean {
    const allPaths = this._allCausalPathsTo(outcomeId);
    if (allPaths.length === 0) return false;
    const candidatePaths = allPaths.filter(p => p.includes(candidateId));
    return candidatePaths.length === allPaths.length;
  }

  testHp2015(candidateId: string, outcomeId: string): Partial<CounterfactualResult> {
    const ac1 = this.graph.has(candidateId) && this.graph.has(outcomeId);
    if (!ac1) {
      return {
        stage1Passes: false,
        stage2Passes: false,
        stage3NessPasses: false,
        wPartition: [],
        nessSufficientSet: [],
        isRootCause: false,
      };
    }

    const paths = this._causalPathsBetween(candidateId, outcomeId);
    const onPaths = new Set<string>(paths.flat());
    const allIds = new Set(this.graph.allNodes().map(n => n.id));
    const wPartition = [...allIds].filter(
      id => !onPaths.has(id) && id !== candidateId && id !== outcomeId,
    );

    const ac2 = !this._causallReachableWithout(outcomeId, candidateId, wPartition);
    const stage2Passes = ac1 && ac2;

    return {
      stage2Passes,
      wPartition,
      isRootCause: stage2Passes,
    };
  }

  testNess(candidateId: string, outcomeId: string): Partial<CounterfactualResult> {
    const causalAncestors = this._causalAncestorsOf(outcomeId);
    if (!causalAncestors.has(candidateId) && candidateId !== outcomeId) {
      return { stage3NessPasses: false, nessSufficientSet: [], isRootCause: false };
    }

    const minimalSet = this._minimalSufficientSet(candidateId, outcomeId);
    if (minimalSet.length === 0) {
      return { stage3NessPasses: false, nessSufficientSet: [], isRootCause: false };
    }

    const reduced = minimalSet.filter(id => id !== candidateId);
    const stage3Passes = !this._isCausallySufficient(reduced, outcomeId);

    return {
      stage3NessPasses: stage3Passes,
      nessSufficientSet: minimalSet,
      isRootCause: stage3Passes,
    };
  }

  testFullStack(candidateId: string, outcomeId: string): CounterfactualResult {
    const stage1 = this.testStage1(candidateId, outcomeId);
    const hp = this.testHp2015(candidateId, outcomeId);
    const ness = this.testNess(candidateId, outcomeId);

    const isRootCause = (hp.stage2Passes === true) && (ness.stage3NessPasses === true);

    return {
      candidateId,
      outcomeId,
      isRootCause,
      stage1Passes: stage1,
      stage2Passes: hp.stage2Passes ?? false,
      stage3NessPasses: ness.stage3NessPasses ?? false,
      wPartition: hp.wPartition ?? [],
      nessSufficientSet: ness.nessSufficientSet ?? [],
    };
  }

  private _allCausalPathsTo(outcomeId: string): string[][] {
    const leaves = this.graph.allNodes()
      .filter(n => this.graph.isLeaf(n.id))
      .map(n => n.id);
    const allPaths: string[][] = [];
    for (const leaf of leaves) {
      allPaths.push(...this._causalPathsBetween(leaf, outcomeId));
    }
    return allPaths;
  }

  private _causalPathsBetween(source: string, target: string): string[][] {
    if (source === target) return [[source]];
    const paths: string[][] = [];
    const stack: [string, string[]][] = [[source, [source]]];
    while (stack.length > 0) {
      const [current, path] = stack.pop()!;
      const pid = this.graph.parentId(current);
      if (pid === null) continue;
      if (pid === target) {
        paths.push([...path, pid]);
      } else if (!path.includes(pid)) {
        stack.push([pid, [...path, pid]]);
      }
    }
    return paths;
  }

  private _causallReachableWithout(
    outcome: string,
    blocked: string,
    alsoBlock: string[] = [],
  ): boolean {
    const blockedSet = new Set([blocked, ...alsoBlock]);
    const leaves = this.graph.allNodes()
      .filter(n => this.graph.isLeaf(n.id) && !blockedSet.has(n.id))
      .map(n => n.id);

    const visited = new Set<string>();
    const stack = [...leaves];
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (current === outcome) return true;
      if (visited.has(current) || blockedSet.has(current)) continue;
      visited.add(current);
      const pid = this.graph.parentId(current);
      if (pid && !blockedSet.has(pid)) stack.push(pid);
    }
    return false;
  }

  private _causalAncestorsOf(outcomeId: string): Set<string> {
    const visited = new Set<string>();
    const queue = [...this.graph.childrenIds(outcomeId)];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);
      queue.push(...this.graph.childrenIds(current));
    }
    return visited;
  }

  private _minimalSufficientSet(candidateId: string, outcomeId: string): string[] {
    const paths = this._causalPathsBetween(candidateId, outcomeId);
    return paths.length > 0 ? [candidateId] : [];
  }

  private _isCausallySufficient(nodeIds: string[], outcomeId: string): boolean {
    return nodeIds.some(id => this._causalPathsBetween(id, outcomeId).length > 0);
  }
}
