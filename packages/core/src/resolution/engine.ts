import {
  type Node,
  type Resolution,
  InteractionType,
  NodeStatus,
  ResolutionType,
} from "../types.js";
import type { InvestigationGraph } from "../graph.js";

export interface RootCauseInteraction {
  causeAId: string;
  causeBId: string;
  interactionType: InteractionType;
  description: string;
}

export const MAX_REOPEN = 3;

export class ResolutionEngine {
  readonly interactions: RootCauseInteraction[] = [];

  resolve(
    graph: InvestigationGraph,
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
    const node = graph.getNode(nodeId);
    if (node.status !== NodeStatus.RootCause) {
      throw new Error(`Node ${nodeId} is not a confirmed root cause (status: ${node.status})`);
    }

    const resolution: Resolution = {
      type: opts.type,
      change: opts.change,
      owner: opts.owner ?? "",
      deadline: opts.deadline ?? "",
      counterfactualPasses: opts.counterfactualPasses ?? null,
      priorityImpact: opts.priorityImpact ?? 0,
      priorityRecurrence: opts.priorityRecurrence ?? 0,
      priorityActionability: opts.priorityActionability ?? 0,
      minimalIntervention: opts.minimalIntervention ?? false,
      interventionCoverage: opts.interventionCoverage ?? 0,
    };

    graph.updateNode(nodeId, { resolution });
    return resolution;
  }

  checkCounterfactual(
    graph: InvestigationGraph,
    nodeId: string,
    passes: boolean,
  ): string | null {
    const node = graph.getNode(nodeId);
    if (node.resolution) {
      graph.updateNode(nodeId, {
        resolution: { ...node.resolution, counterfactualPasses: passes },
      });
    }

    if (!passes) {
      if (node.reopenCount < MAX_REOPEN) {
        graph.updateNode(nodeId, {
          status: NodeStatus.Open,
          resolution: null,
          reopenCount: node.reopenCount + 1,
        });
        return `Fix targets a symptom, not the root cause. Node reopened (attempt ${node.reopenCount + 1}/${MAX_REOPEN}). Go deeper.`;
      } else {
        graph.updateNode(nodeId, { status: NodeStatus.Escalated });
        return `Fix failed counterfactual test ${MAX_REOPEN} times. Escalated — requires a new investigation.`;
      }
    }
    return null;
  }

  addInteraction(
    causeAId: string,
    causeBId: string,
    interactionType: InteractionType,
    description: string,
  ): RootCauseInteraction {
    const interaction: RootCauseInteraction = { causeAId, causeBId, interactionType, description };
    this.interactions.push(interaction);
    return interaction;
  }

  prioritize(graph: InvestigationGraph): Array<[Node, number]> {
    return graph.rootCauses()
      .map(node => {
        const score = node.resolution
          ? node.resolution.priorityImpact * node.resolution.priorityRecurrence * node.resolution.priorityActionability
          : 0;
        return [node, score] as [Node, number];
      })
      .sort(([, a], [, b]) => b - a);
  }
}
