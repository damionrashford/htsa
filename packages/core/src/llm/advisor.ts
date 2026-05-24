import { type ChatCompletionsClient, type ChatMessage } from "./client.js";
import {
  SYSTEM_PROMPT,
  promptSuggestHypotheses,
  promptEvaluateDepthCriteria,
  promptSuggestResolution,
} from "./prompts.js";
import { makeDepthCriteria } from "../types.js";
import type { InvestigationGraph } from "../graph.js";
import type { SituationMap, DepthCriteria } from "../types.js";

interface HypothesisSuggestion {
  statement: string;
  prior_probability: number;
  rationale: string;
}

interface DepthCriteriaResponse {
  actionability: boolean;
  counterfactual_clarity: boolean;
  system_boundary: boolean;
  diminishing_returns: boolean;
  rationale: string;
}

interface ResolutionResponse {
  type: "fix" | "mitigate" | "accept";
  change: string;
  owner: string;
  deadline: string;
  counterfactual_passes: boolean;
  priority_impact: number;
  priority_recurrence: number;
  priority_actionability: number;
  rationale: string;
}

export class LLMAdvisor {
  constructor(private readonly client: ChatCompletionsClient) {}

  async suggestHypotheses(
    graph: InvestigationGraph,
    situation: SituationMap,
    parentId: string,
  ): Promise<HypothesisSuggestion[]> {
    const userMsg = promptSuggestHypotheses(graph, situation, parentId);
    const raw = await this._complete(userMsg);
    const parsed = JSON.parse(raw) as { hypotheses: HypothesisSuggestion[] };
    return parsed.hypotheses ?? [];
  }

  async evaluateDepthCriteria(
    graph: InvestigationGraph,
    situation: SituationMap,
    nodeId: string,
  ): Promise<DepthCriteria> {
    const userMsg = promptEvaluateDepthCriteria(graph, situation, nodeId);
    const raw = await this._complete(userMsg);
    const r = JSON.parse(raw) as DepthCriteriaResponse;
    return makeDepthCriteria(
      r.actionability,
      r.counterfactual_clarity,
      r.system_boundary,
      r.diminishing_returns,
    );
  }

  async suggestResolution(
    graph: InvestigationGraph,
    situation: SituationMap,
    nodeId: string,
  ): Promise<ResolutionResponse> {
    const userMsg = promptSuggestResolution(graph, situation, nodeId);
    const raw = await this._complete(userMsg);
    return JSON.parse(raw) as ResolutionResponse;
  }

  private async _complete(userContent: string): Promise<string> {
    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ];
    return this.client.complete(messages, { jsonMode: true });
  }
}
