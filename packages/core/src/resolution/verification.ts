import {
  NodeStatus,
  VerificationWindowType,
  type VerificationRecord,
} from "../types.js";
import type { InvestigationGraph } from "../graph.js";

export const MAX_VERIFY = 3;

export interface LearningRecord {
  priorAccuracy: string;
  prunedBranches: string;
  firstHypothesisCorrect: boolean | null;
  surprises: string[];
  priorUpdates: Record<string, number>;
}

export class VerificationTracker {
  readonly records: VerificationRecord[] = [];
  readonly learning: LearningRecord = {
    priorAccuracy: "",
    prunedBranches: "",
    firstHypothesisCorrect: null,
    surprises: [],
    priorUpdates: {},
  };

  addVerification(
    nodeId: string,
    windowType: VerificationWindowType,
    description: string,
    metric: string,
    confirmedAt?: string,
  ): VerificationRecord {
    const record: VerificationRecord = {
      nodeId,
      windowType,
      description,
      metric,
      confirmed: null,
      confirmedAt: confirmedAt ?? null,
    };
    this.records.push(record);
    return record;
  }

  verify(
    graph: InvestigationGraph,
    nodeId: string,
    recurred: boolean,
  ): string | null {
    const node = graph.getNode(nodeId);

    for (const record of this.records) {
      if (record.nodeId === nodeId && record.confirmed === null) {
        record.confirmed = !recurred;
        record.confirmedAt = new Date().toISOString();
        break;
      }
    }

    if (recurred) {
      if (node.reopenCount >= MAX_VERIFY) {
        graph.updateNode(nodeId, { status: NodeStatus.Escalated });
        return `Problem recurred after ${MAX_VERIFY} verification attempts. Escalated — launch a separate investigation.`;
      }
      graph.updateNode(nodeId, {
        status: NodeStatus.Open,
        resolution: null,
        reopenCount: node.reopenCount + 1,
      });
      return `Problem recurred. Root cause identification was incomplete. Reopened (attempt ${node.reopenCount + 1}). Return to Layer 2.`;
    }
    return null;
  }

  recordLearning(opts: Partial<LearningRecord>): void {
    if (opts.priorAccuracy) this.learning.priorAccuracy = opts.priorAccuracy;
    if (opts.prunedBranches) this.learning.prunedBranches = opts.prunedBranches;
    if (opts.firstHypothesisCorrect !== undefined) this.learning.firstHypothesisCorrect = opts.firstHypothesisCorrect;
    if (opts.surprises) this.learning.surprises.push(...opts.surprises);
    if (opts.priorUpdates) Object.assign(this.learning.priorUpdates, opts.priorUpdates);
  }

  isClosed(): boolean {
    if (this.records.length === 0) return false;
    return this.records.every(r => r.confirmed !== null);
  }
}
