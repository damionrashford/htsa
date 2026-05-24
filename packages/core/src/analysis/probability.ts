import { type Evidence, EvidenceDirection, EvidenceTier, NodeStatus } from "../types.js";
import type { InvestigationGraph } from "../graph.js";

export interface PruningRecord {
  nodeId: string;
  probabilityAtPruning: number;
  reason: string;
  evidenceIds: string[];
}

export class ProbabilityEngine {
  readonly pruningThreshold: number;
  readonly pruningLog: PruningRecord[] = [];
  private _entropyHistory: number[] = [];

  constructor(pruningThreshold = 0.05) {
    this.pruningThreshold = pruningThreshold;
  }

  setUniformPriors(graph: InvestigationGraph, parentId: string): void {
    const children = graph.children(parentId);
    const active = children.filter(c => c.status === NodeStatus.Open);
    if (active.length === 0) return;
    const p = 1.0 / active.length;
    for (const child of active) {
      graph.updateNode(child.id, { probability: p });
    }
  }

  bayesianUpdate(
    graph: InvestigationGraph,
    nodeId: string,
    likelihood: number,
    likelihoodComplement: number,
  ): number {
    const node = graph.getNode(nodeId);
    const prior = node.probability;
    const marginal = likelihood * prior + likelihoodComplement * (1.0 - prior);
    if (marginal === 0) return prior;

    const posterior = (likelihood * prior) / marginal;
    graph.updateNode(nodeId, { probability: posterior });
    this._renormalizeSiblings(graph, nodeId);
    this._entropyHistory.push(this.entropy(graph));
    return posterior;
  }

  updateFromEvidence(
    graph: InvestigationGraph,
    nodeId: string,
    evidence: Evidence,
    likelihood?: number,
    likelihoodComplement?: number,
  ): number {
    const node = graph.getNode(nodeId);
    graph.updateNode(nodeId, { evidence: [...node.evidence, evidence] });

    const [l, lc] = likelihood !== undefined && likelihoodComplement !== undefined
      ? [likelihood, likelihoodComplement]
      : this._estimateLikelihoods(evidence);

    return this.bayesianUpdate(graph, nodeId, l, lc);
  }

  checkAndPrune(graph: InvestigationGraph, nodeId: string, reason = ""): boolean {
    const node = graph.getNode(nodeId);
    if (node.probability < this.pruningThreshold) {
      graph.updateNode(nodeId, {
        prunedProbability: node.probability,
        status: NodeStatus.Pruned,
      });
      this.pruningLog.push({
        nodeId,
        probabilityAtPruning: node.probability,
        reason: reason || `P=${node.probability.toFixed(4)} < threshold=${this.pruningThreshold}`,
        evidenceIds: node.evidence.map(e => e.id),
      });
      this._renormalizeSiblings(graph, nodeId);
      return true;
    }
    return false;
  }

  restorePruned(graph: InvestigationGraph, nodeId: string, newProbability: number): void {
    const node = graph.getNode(nodeId);
    if (node.status !== NodeStatus.Pruned) {
      throw new Error(`Node ${nodeId} is not pruned`);
    }
    graph.updateNode(nodeId, {
      status: NodeStatus.Open,
      probability: newProbability,
      prunedProbability: null,
      reopenCount: node.reopenCount + 1,
    });
    this._renormalizeSiblings(graph, nodeId);
  }

  entropy(graph: InvestigationGraph): number {
    const frontier = graph.frontierNodes();
    if (frontier.length === 0) return 0;
    let h = 0;
    for (const node of frontier) {
      if (node.probability > 0) {
        h -= node.probability * Math.log2(node.probability);
      }
    }
    return h;
  }

  informationGain(): number {
    if (this._entropyHistory.length < 2) return 0;
    const len = this._entropyHistory.length;
    return (this._entropyHistory[len - 2] ?? 0) - (this._entropyHistory[len - 1] ?? 0);
  }

  get entropyHistory(): number[] {
    return [...this._entropyHistory];
  }

  recordEntropy(graph: InvestigationGraph): number {
    const h = this.entropy(graph);
    this._entropyHistory.push(h);
    return h;
  }

  private _renormalizeSiblings(graph: InvestigationGraph, nodeId: string): void {
    const group = graph.siblingGroup(nodeId);
    const active = group.filter(
      n => n.status === NodeStatus.Open || n.status === NodeStatus.RootCause,
    );
    const total = active.reduce((s, n) => s + n.probability, 0);
    if (total <= 0 || active.length <= 1) return;
    for (const n of active) {
      graph.updateNode(n.id, { probability: n.probability / total });
    }
  }

  private _estimateLikelihoods(evidence: Evidence): [number, number] {
    const tierStrength: Record<EvidenceTier, number> = {
      [EvidenceTier.Physical]: 0.90,
      [EvidenceTier.Observational]: 0.75,
      [EvidenceTier.Inferential]: 0.60,
      [EvidenceTier.Testimonial]: 0.45,
    };
    const strength = tierStrength[evidence.tier];
    if (evidence.direction === EvidenceDirection.Supports) {
      return [strength, 1.0 - strength];
    }
    return [1.0 - strength, strength];
  }
}
