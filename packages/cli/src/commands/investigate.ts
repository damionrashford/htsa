import {
  Investigation,
  InvestigationMode,
  SearchType,
  EvidenceTier,
  EvidenceDirection,
  makeEvidence,
  toJson,
} from "@htsa/core";
import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

export async function investigate(args: string[]): Promise<void> {
  const problem = args.join(" ").trim();
  if (!problem) {
    console.error("Usage: htsa investigate <problem description>");
    process.exit(1);
  }

  const rl = readline.createInterface({ input: stdin, output: stdout });
  const ask = (q: string) => rl.question(q);

  console.log(`\nHTSA Investigation: "${problem}"\n`);

  const investigator = await ask("Your name: ");
  const modeStr = await ask("Mode [full/rapid] (default: full): ");
  const mode = modeStr.trim() === "rapid" ? InvestigationMode.Rapid : InvestigationMode.Full;

  const inv = new Investigation({
    title: problem,
    date: new Date().toISOString().split("T")[0]!,
    investigator: investigator.trim(),
    mode,
    pruningThreshold: 0.05,
    searchType: SearchType.BestFirst,
  });

  console.log("\n── LAYER 1: Situation Map ──────────────────────────────\n");
  console.log("Answer the 5 Ws. Press Enter to skip a field.\n");

  const sitPatch: Record<string, string> = {};
  const sitFields: Array<[string, string]> = [
    ["whoAffected", "Who is affected? "],
    ["whoDetector", "Who detected it? "],
    ["whoOriginator", "Who/what triggered it? "],
    ["what", "What happened? "],
    ["whenBefore", "When (before event)? "],
    ["whenDuring", "When (during event)? "],
    ["whenAfter", "When (after event)? "],
    ["where", "Where did it occur? "],
    ["whySurface", "Surface-level why? "],
  ];
  for (const [key, prompt] of sitFields) {
    const val = (await ask(prompt)).trim();
    if (val) sitPatch[key] = val;
  }
  inv.updateSituation(sitPatch);

  console.log("\n── LAYER 2: Causal Chain (5 Whys) ─────────────────────\n");

  const rootNode = inv.startCausalChain(problem);
  console.log(`Origin node: "${rootNode.statement}" (P=100%)\n`);

  while (true) {
    const current = inv.nextNode();
    if (!current) break;

    console.log(`\nExploring: "${current.statement}" (P=${(current.probability * 100).toFixed(1)}%)`);
    console.log("Options: [w]hy (add hypotheses) | [e]vidence | [r]oot cause | [s]kip | [q]uit\n");

    const action = (await ask("Action: ")).trim().toLowerCase();

    if (action === "q") break;
    if (action === "s") continue;

    if (action === "w") {
      const count = parseInt(await ask("How many hypotheses? (2-5): "), 10) || 2;
      for (let i = 0; i < count; i++) {
        const stmt = (await ask(`  Hypothesis ${i + 1}: `)).trim();
        if (stmt) inv.addHypothesis(current.id, stmt);
      }
    }

    if (action === "e") {
      const desc = (await ask("Evidence description: ")).trim();
      const dirStr = (await ask("Direction [s]upports/[c]ontradicts: ")).trim().toLowerCase();
      const tierStr = (await ask("Tier [1=physical/2=observational/3=inferential/4=testimonial]: ")).trim();

      const direction = dirStr === "c" ? EvidenceDirection.Contradicts : EvidenceDirection.Supports;
      const tier = ([EvidenceTier.Physical, EvidenceTier.Observational, EvidenceTier.Inferential, EvidenceTier.Testimonial][parseInt(tierStr, 10) - 1]) ?? EvidenceTier.Inferential;

      const evidence = makeEvidence("manual", tier, direction, { description: desc });
      const posterior = inv.addEvidence(current.id, evidence);
      console.log(`  → Updated P=${(posterior * 100).toFixed(1)}%`);
    }

    if (action === "r") {
      const dc = {
        actionability: (await ask("Actionability passes? [y/n]: ")).trim() === "y",
        counterfactualClarity: (await ask("Counterfactual clarity passes? [y/n]: ")).trim() === "y",
        systemBoundary: (await ask("System boundary passes? [y/n]: ")).trim() === "y",
        diminishingReturns: (await ask("Diminishing returns? [y/n]: ")).trim() === "y",
      };
      const err = inv.markRootCause(current.id, dc);
      if (err) {
        console.log(`  ✗ ${err}`);
      } else {
        console.log(`  ✓ Root cause confirmed: "${current.statement}"`);
      }
    }
  }

  console.log("\n── LAYER 3: Resolution ─────────────────────────────────\n");

  for (const rc of inv.graph.rootCauses()) {
    console.log(`Root cause: "${rc.statement}"`);
    const typeStr = (await ask("Resolution [fix/mitigate/accept]: ")).trim() as "fix" | "mitigate" | "accept";
    const change = (await ask("What changes? ")).trim();
    const owner = (await ask("Owner: ")).trim();
    const deadline = (await ask("Deadline: ")).trim();

    inv.addResolution(rc.id, {
      type: typeStr as never,
      change,
      owner,
      deadline,
      priorityImpact: parseInt((await ask("Impact 1-5: ")).trim(), 10) || 3,
      priorityRecurrence: parseInt((await ask("Recurrence 1-5: ")).trim(), 10) || 3,
      priorityActionability: parseInt((await ask("Actionability 1-5: ")).trim(), 10) || 3,
    });
  }

  rl.close();

  const filename = `htsa-${Date.now()}.json`;
  await Bun.write(filename, toJson(inv, true));
  console.log(`\nInvestigation saved to ${filename}`);
  console.log(`Run 'htsa export ${filename}' to generate Markdown.`);
}
