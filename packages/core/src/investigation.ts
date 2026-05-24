import {
  type DepthCriteria,
  type Evidence,
  type InvestigationConfig,
  type InvestigationEvent,
  type Node,
  type Resolution,
  type SituationMap,
  InvestigationMode,
  NodeStatus,
  ResolutionType,
  SearchType,
  VerificationWindowType,
  depthCriteriaPassed,
  makeNode,
  makeSituationMap,
} from "./types.js";
import { InvestigationGraph } from "./graph.js";
import { ProbabilityEngine } from "./analysis/probability.js";
import { createSearch, type SearchStrategy } from "./analysis/search.js";
import { BiasGuard } from "./analysis/bias.js";
import { ResolutionEngine, MAX_REOPEN } from "./resolution/engine.js";
import { VerificationTracker } from "./resolution/verification.js";
import { CounterfactualTester } from "./causation/counterfactual.js";

export { InvestigationGraph };

export class Investigation {
  readonly graph: InvestigationGraph;
  readonly situation: SituationMap;
  readonly config: InvestigationConfig;
  readonly events: InvestigationEvent[] = [];
  readonly probability: ProbabilityEngine;
  readonly resolution: ResolutionEngine;
  readonly verification: VerificationTracker;
  readonly biasGuard: BiasGuard;

  private _search: SearchStrategy;

  constructor(config: InvestigationConfig) {
    this.config = config;
    this.graph = new InvestigationGraph();
    this.situation = makeSituationMap();
    this.biasGuard = new BiasGuard();
    this.resolution = new ResolutionEngine();
    this.verification = new VerificationTracker();

    const pruningThreshold = config.mode === InvestigationMode.Rapid
      ? Math.max(config.pruningThreshold, 0.20)
      : config.pruningThreshold;

    this.probability = new ProbabilityEngine(pruningThreshold);

    const searchType = config.mode === InvestigationMode.Rapid
      ? SearchType.DFS
      : config.searchType;

    this._search = createSearch(searchType);
  }

  // Layer 1 ─────────────────────────────────────────────────────────────────

  updateSituation(patch: Partial<SituationMap>): void {
    Object.assign(this.situation, patch);
    this._log("situation_updated", patch);
  }

  // Layer 2 ─────────────────────────────────────────────────────────────────

  startCausalChain(surfaceWhy: string): Node {
    const node = makeNode(surfaceWhy, { probability: 1.0, depth: 0 });
    this.graph.addNode(node);
    this._search.add(node);
    this._log("causal_chain_started", { nodeId: node.id, statement: surfaceWhy });
    return this.graph.getNode(node.id);
  }

  addHypothesis(
    parentId: string,
    statement: string,
    probability?: number,
  ): Node {
    const node = makeNode(statement, { probability: probability ?? 0 });
    this.graph.addNode(node, parentId);
    if (probability === undefined) {
      this.probability.setUniformPriors(this.graph, parentId);
    }
    this._search.add(this.graph.getNode(node.id));
    this._log("hypothesis_added", { nodeId: node.id, parentId, statement });
    return this.graph.getNode(node.id);
  }

  addEvidence(
    nodeId: string,
    evidence: Evidence,
    likelihood?: number,
    likelihoodComplement?: number,
  ): number {
    const posterior = this.probability.updateFromEvidence(
      this.graph, nodeId, evidence, likelihood, likelihoodComplement,
    );
    this.probability.checkAndPrune(this.graph, nodeId);
    this._log("evidence_added", { nodeId, evidenceId: evidence.id, posterior });
    return posterior;
  }

  nextNode(): Node | null {
    return this._search.next();
  }

  markRootCause(nodeId: string, depthCriteria: DepthCriteria): string | null {
    const node = this.graph.getNode(nodeId);

    if (!this.graph.isLeaf(nodeId)) {
      return "Only leaf nodes can be marked as root causes.";
    }
    if (node.evidence.length === 0) {
      return "Root cause must have at least one evidence item.";
    }
    if (!depthCriteriaPassed(depthCriteria)) {
      return "All four depth criteria must pass before marking as root cause.";
    }

    this.graph.updateNode(nodeId, {
      status: NodeStatus.RootCause,
      depthCriteria,
    });
    this._log("root_cause_marked", { nodeId });
    return null;
  }

  reopenNode(nodeId: string, newProbability = 0.5): string | null {
    const node = this.graph.getNode(nodeId);
    if (node.reopenCount >= MAX_REOPEN) {
      this.graph.updateNode(nodeId, { status: NodeStatus.Escalated });
      return `Node exceeded reopen limit (${MAX_REOPEN}). Escalated.`;
    }
    this.probability.restorePruned(this.graph, nodeId, newProbability);
    this._search.add(this.graph.getNode(nodeId));
    this._log("node_reopened", { nodeId, attempt: node.reopenCount + 1 });
    return null;
  }

  // Layer 3 ─────────────────────────────────────────────────────────────────

  addResolution(
    nodeId: string,
    opts: {
      type: ResolutionType;
      change: string;
      owner?: string;
      deadline?: string;
      counterfactualPasses?: boolean | null;
      priorityImpact?: number;
      priorityRecurrence?: number;
      priorityActionability?: number;
      minimalIntervention?: boolean;
      interventionCoverage?: number;
    },
  ): Resolution {
    const r = this.resolution.resolve(this.graph, nodeId, opts);
    this._log("resolution_added", { nodeId, type: opts.type });
    return r;
  }

  checkCounterfactual(nodeId: string, passes: boolean): string | null {
    return this.resolution.checkCounterfactual(this.graph, nodeId, passes);
  }

  // Layer 4 ─────────────────────────────────────────────────────────────────

  addVerification(
    nodeId: string,
    windowType: VerificationWindowType,
    description: string,
    metric: string,
  ) {
    return this.verification.addVerification(nodeId, windowType, description, metric);
  }

  verify(nodeId: string, recurred: boolean): string | null {
    return this.verification.verify(this.graph, nodeId, recurred);
  }

  // Queries ─────────────────────────────────────────────────────────────────

  get entropy(): number {
    return this.probability.entropy(this.graph);
  }

  get isComplete(): boolean {
    return (
      this.graph.frontierNodes().length === 0 &&
      this.graph.activeNodes().length === 0
    );
  }

  checkBias(situationComplete?: boolean) {
    return this.biasGuard.checkAll(this.graph, situationComplete);
  }

  testCounterfactual(candidateId: string, outcomeId: string) {
    const tester = new CounterfactualTester(this.graph);
    return tester.testFullStack(candidateId, outcomeId);
  }

  private _log(type: string, data: Record<string, unknown>): void {
    this.events.push({ type, timestamp: new Date().toISOString(), ...data });
  }
}
