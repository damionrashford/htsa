import { AlertLevel, BiasType, EvidenceDirection, EvidenceTier, NodeStatus } from "../types.js";
import type { BiasAlert } from "../types.js";
import type { InvestigationGraph } from "../graph.js";

export class BiasGuard {
  checkAll(graph: InvestigationGraph, situationComplete = true): BiasAlert[] {
    const alerts: BiasAlert[] = [];
    alerts.push(...this.checkConfirmation(graph));
    alerts.push(...this.checkAvailability(graph));
    alerts.push(...this.checkPrematureClosure(graph));
    if (!situationComplete) alerts.push(...this.checkAnchoring(graph));
    return alerts;
  }

  checkConfirmation(graph: InvestigationGraph): BiasAlert[] {
    const active = graph.activeNodes();
    if (active.length === 0) return [];
    const leader = active.reduce((a, b) => a.probability > b.probability ? a : b);
    const supporting = leader.evidence.filter(e => e.direction === EvidenceDirection.Supports);
    const contradicting = leader.evidence.filter(e => e.direction === EvidenceDirection.Contradicts);
    if (supporting.length >= 3 && contradicting.length === 0) {
      return [{
        biasType: BiasType.Confirmation,
        level: AlertLevel.Warn,
        message: `Leading hypothesis "${leader.statement}" (P=${leader.probability.toFixed(2)}) has ${supporting.length} supporting items and zero contradicting. Actively seek disconfirming evidence.`,
        nodeId: leader.id,
      }];
    }
    return [];
  }

  checkAvailability(graph: InvestigationGraph): BiasAlert[] {
    const active = graph.activeNodes();
    if (active.length < 2) return [];
    const leader = active.reduce((a, b) => a.probability > b.probability ? a : b);
    if (leader.probability <= 0.5) return [];
    const hasStrongEvidence = leader.evidence.some(e => e.tier <= EvidenceTier.Observational);
    const hasOnlyWeak = leader.evidence.length > 0 && leader.evidence.every(e => e.tier >= EvidenceTier.Inferential);
    if (!hasStrongEvidence && (!leader.evidence.length || hasOnlyWeak)) {
      return [{
        biasType: BiasType.Availability,
        level: AlertLevel.Warn,
        message: `Leading hypothesis "${leader.statement}" has P=${leader.probability.toFixed(2)} but no Tier 1/2 evidence. Priors should come from documented base rates, not recent memory.`,
        nodeId: leader.id,
      }];
    }
    return [];
  }

  checkAnchoring(graph: InvestigationGraph): BiasAlert[] {
    if (graph.origin && graph.allNodes().length > 1) {
      return [{
        biasType: BiasType.Anchoring,
        level: AlertLevel.Block,
        message: "Causal hypotheses are being generated before the Situation Map (5 Ws) is complete. Complete all 5 Ws before starting the Why chain.",
        nodeId: null,
      }];
    }
    return [];
  }

  checkPrematureClosure(graph: InvestigationGraph): BiasAlert[] {
    const alerts: BiasAlert[] = [];
    for (const node of graph.allNodes()) {
      if (node.status !== NodeStatus.RootCause) continue;
      const dc = node.depthCriteria;
      if (!dc) {
        alerts.push({
          biasType: BiasType.PrematureClosure,
          level: AlertLevel.Block,
          message: `Node "${node.statement}" is marked as root cause but depth criteria have not been evaluated.`,
          nodeId: node.id,
        });
        continue;
      }
      const allEvaluated = [dc.actionability, dc.counterfactualClarity, dc.systemBoundary, dc.diminishingReturns].every(v => v !== null);
      if (!allEvaluated) {
        alerts.push({
          biasType: BiasType.PrematureClosure,
          level: AlertLevel.Block,
          message: `Node "${node.statement}" is marked as root cause but not all depth criteria have been evaluated.`,
          nodeId: node.id,
        });
      } else if (
        dc.actionability !== true || dc.counterfactualClarity !== true ||
        dc.systemBoundary !== true || dc.diminishingReturns !== true
      ) {
        alerts.push({
          biasType: BiasType.PrematureClosure,
          level: AlertLevel.Block,
          message: `Node "${node.statement}" is marked as root cause but not all depth criteria pass.`,
          nodeId: node.id,
        });
      }
    }
    return alerts;
  }
}
