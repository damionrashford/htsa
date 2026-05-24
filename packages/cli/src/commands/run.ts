import {
  Investigation,
  InvestigationMode,
  SearchType,
  LLMAdvisor,
  ChatCompletionsClient,
  toJson,
  toMarkdown,
} from "@htsa/core";

export async function run(args: string[]): Promise<void> {
  const problem = args.join(" ").trim();
  if (!problem) {
    console.error("Usage: htsa run <problem description>");
    process.exit(1);
  }

  const apiKey = Bun.env["HTSA_API_KEY"] ?? "";
  const baseUrl = Bun.env["HTSA_BASE_URL"] ?? "https://api.openai.com/v1";
  const model = Bun.env["HTSA_MODEL"] ?? "gpt-4o";

  if (!apiKey) {
    console.error("Set HTSA_API_KEY to use automatic investigation.");
    process.exit(1);
  }

  console.log(`\nHTSA Auto-Investigation: "${problem}"`);
  console.log(`Provider: ${baseUrl} | Model: ${model}\n`);

  const inv = new Investigation({
    title: problem,
    date: new Date().toISOString().split("T")[0]!,
    investigator: "LLMAdvisor",
    mode: InvestigationMode.Full,
    pruningThreshold: 0.05,
    searchType: SearchType.BestFirst,
  });

  const client = new ChatCompletionsClient({ baseUrl, apiKey, model });
  const advisor = new LLMAdvisor(client);

  inv.updateSituation({ what: problem, whySurface: problem });
  inv.startCausalChain(problem);

  let iterations = 0;
  const MAX_ITER = 10;

  while (iterations < MAX_ITER) {
    const node = inv.nextNode();
    if (!node) break;

    console.log(`→ Exploring: "${node.statement}" (P=${(node.probability * 100).toFixed(1)}%)`);

    const hypotheses = await advisor.suggestHypotheses(inv.graph, inv.situation, node.id);
    console.log(`  ${hypotheses.length} hypotheses generated`);

    for (const h of hypotheses) {
      inv.addHypothesis(node.id, h.statement, h.prior_probability);
    }

    const dc = await advisor.evaluateDepthCriteria(inv.graph, inv.situation, node.id);
    const allPass = [dc.actionability, dc.counterfactualClarity, dc.systemBoundary, dc.diminishingReturns].every(Boolean);

    if (allPass) {
      const err = inv.markRootCause(node.id, dc);
      if (!err) {
        console.log(`  ✓ Root cause: "${node.statement}"`);
        const resolution = await advisor.suggestResolution(inv.graph, inv.situation, node.id);
        inv.addResolution(node.id, {
          type: resolution.type as never,
          change: resolution.change,
          owner: resolution.owner,
          deadline: resolution.deadline,
          counterfactualPasses: resolution.counterfactual_passes,
          priorityImpact: resolution.priority_impact,
          priorityRecurrence: resolution.priority_recurrence,
          priorityActionability: resolution.priority_actionability,
        });
      }
    }

    iterations++;
  }

  const md = toMarkdown(inv);
  const mdFile = `htsa-report-${Date.now()}.md`;
  const jsonFile = `htsa-data-${Date.now()}.json`;

  await Bun.write(mdFile, md);
  await Bun.write(jsonFile, toJson(inv, true));

  console.log(`\nReport: ${mdFile}`);
  console.log(`Data:   ${jsonFile}`);
}
