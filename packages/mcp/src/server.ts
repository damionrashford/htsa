import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  Investigation,
  InvestigationMode,
  SearchType,
  EvidenceTier,
  EvidenceDirection,
  makeEvidence,
  toMarkdown,
  toJson,
} from "@htsa/core";

const sessions = new Map<string, Investigation>();

function getInv(id: string): Investigation {
  const inv = sessions.get(id);
  if (!inv) throw new Error(`Investigation "${id}" not found`);
  return inv;
}

const server = new McpServer({ name: "htsa", version: "2.0.0" });

// ── create_investigation ──────────────────────────────────────────────────────
server.registerTool(
  "create_investigation",
  {
    description: "Start a new probabilistic root cause analysis investigation",
    inputSchema: {
      title: z.string().describe("The problem to investigate"),
      investigator: z.string().optional().describe("Your name"),
      mode: z.enum(["full", "rapid"]).optional(),
      pruningThreshold: z.number().min(0).max(1).optional(),
    },
  },
  async ({ title, investigator, mode, pruningThreshold }) => {
    const id = Math.random().toString(36).slice(2, 10);
    const inv = new Investigation({
      title,
      date: new Date().toISOString().split("T")[0]!,
      investigator: investigator ?? "mcp",
      mode: mode === "rapid" ? InvestigationMode.Rapid : InvestigationMode.Full,
      pruningThreshold: pruningThreshold ?? 0.05,
      searchType: SearchType.BestFirst,
    });
    sessions.set(id, inv);
    return { content: [{ type: "text" as const, text: `Created "${id}": ${title}` }] };
  },
);

// ── update_situation ──────────────────────────────────────────────────────────
server.registerTool(
  "update_situation",
  {
    description: "Fill in the 5 Ws (Situation Map — Layer 1)",
    inputSchema: {
      id: z.string(),
      whoAffected: z.string().optional(),
      whoDetector: z.string().optional(),
      what: z.string().optional(),
      when: z.string().optional(),
      where: z.string().optional(),
      whySurface: z.string().optional(),
    },
  },
  async ({ id, ...patch }) => {
    const inv = getInv(id);
    const clean: Record<string, string> = {};
    for (const [k, v] of Object.entries(patch)) {
      if (v !== undefined) clean[k] = v;
    }
    inv.updateSituation(clean);
    return { content: [{ type: "text" as const, text: "Situation updated." }] };
  },
);

// ── start_causal_chain ────────────────────────────────────────────────────────
server.registerTool(
  "start_causal_chain",
  {
    description: "Begin Layer 2 — create the origin node for Why analysis",
    inputSchema: {
      id: z.string(),
      surfaceWhy: z.string(),
    },
  },
  async ({ id, surfaceWhy }) => {
    const inv = getInv(id);
    const node = inv.startCausalChain(surfaceWhy);
    return { content: [{ type: "text" as const, text: `Origin node: "${node.statement}" (id: ${node.id})` }] };
  },
);

// ── add_hypothesis ────────────────────────────────────────────────────────────
server.registerTool(
  "add_hypothesis",
  {
    description: "Add a causal hypothesis as a child node",
    inputSchema: {
      id: z.string(),
      parentId: z.string(),
      statement: z.string(),
      probability: z.number().min(0).max(1).optional(),
    },
  },
  async ({ id, parentId, statement, probability }) => {
    const inv = getInv(id);
    const node = inv.addHypothesis(parentId, statement, probability);
    return { content: [{ type: "text" as const, text: `Hypothesis: "${node.statement}" (id: ${node.id}, P=${(node.probability * 100).toFixed(1)}%)` }] };
  },
);

// ── add_evidence ──────────────────────────────────────────────────────────────
server.registerTool(
  "add_evidence",
  {
    description: "Add evidence to a node and run Bayesian update",
    inputSchema: {
      id: z.string(),
      nodeId: z.string(),
      source: z.string(),
      tier: z.number().int().min(1).max(4).describe("1=physical, 2=observational, 3=inferential, 4=testimonial"),
      direction: z.enum(["supports", "contradicts"]),
      description: z.string().optional(),
    },
  },
  async ({ id, nodeId, source, tier, direction, description }) => {
    const inv = getInv(id);
    const opts = description ? { description } : {};
    const evidence = makeEvidence(
      source,
      tier as EvidenceTier,
      direction === "contradicts" ? EvidenceDirection.Contradicts : EvidenceDirection.Supports,
      opts,
    );
    const posterior = inv.addEvidence(nodeId, evidence);
    return { content: [{ type: "text" as const, text: `Evidence added. P=${(posterior * 100).toFixed(1)}%` }] };
  },
);

// ── mark_root_cause ───────────────────────────────────────────────────────────
server.registerTool(
  "mark_root_cause",
  {
    description: "Mark a leaf node as a confirmed root cause",
    inputSchema: {
      id: z.string(),
      nodeId: z.string(),
      actionability: z.boolean(),
      counterfactualClarity: z.boolean(),
      systemBoundary: z.boolean(),
      diminishingReturns: z.boolean(),
    },
  },
  async ({ id, nodeId, actionability, counterfactualClarity, systemBoundary, diminishingReturns }) => {
    const inv = getInv(id);
    const errMsg = inv.markRootCause(nodeId, { actionability, counterfactualClarity, systemBoundary, diminishingReturns });
    if (errMsg) return { content: [{ type: "text" as const, text: `Error: ${errMsg}` }], isError: true };
    return { content: [{ type: "text" as const, text: "Root cause confirmed." }] };
  },
);

// ── add_resolution ────────────────────────────────────────────────────────────
server.registerTool(
  "add_resolution",
  {
    description: "Assign a resolution to a confirmed root cause (Layer 3)",
    inputSchema: {
      id: z.string(),
      nodeId: z.string(),
      type: z.enum(["fix", "mitigate", "accept"]),
      change: z.string(),
      owner: z.string().optional(),
      deadline: z.string().optional(),
      priorityImpact: z.number().int().min(1).max(5).optional(),
      priorityRecurrence: z.number().int().min(1).max(5).optional(),
      priorityActionability: z.number().int().min(1).max(5).optional(),
    },
  },
  async ({ id, nodeId, type, change, owner, deadline, priorityImpact, priorityRecurrence, priorityActionability }) => {
    const inv = getInv(id);
    const opts: Record<string, unknown> = { type, change };
    if (owner !== undefined) opts["owner"] = owner;
    if (deadline !== undefined) opts["deadline"] = deadline;
    if (priorityImpact !== undefined) opts["priorityImpact"] = priorityImpact;
    if (priorityRecurrence !== undefined) opts["priorityRecurrence"] = priorityRecurrence;
    if (priorityActionability !== undefined) opts["priorityActionability"] = priorityActionability;
    inv.addResolution(nodeId, opts as never);
    return { content: [{ type: "text" as const, text: "Resolution recorded." }] };
  },
);

// ── get_report ────────────────────────────────────────────────────────────────
server.registerTool(
  "get_report",
  {
    description: "Get the investigation as Markdown or JSON",
    inputSchema: {
      id: z.string(),
      format: z.enum(["markdown", "json"]).optional(),
    },
  },
  async ({ id, format }) => {
    const inv = getInv(id);
    const text = format === "json" ? toJson(inv, true) : toMarkdown(inv);
    return { content: [{ type: "text" as const, text }] };
  },
);

// ── check_bias ────────────────────────────────────────────────────────────────
server.registerTool(
  "check_bias",
  {
    description: "Run cognitive bias checks on the current investigation state",
    inputSchema: { id: z.string() },
  },
  async ({ id }) => {
    const inv = getInv(id);
    const alerts = inv.checkBias();
    if (alerts.length === 0) return { content: [{ type: "text" as const, text: "No bias alerts detected." }] };
    const text = alerts.map(a => `[${a.level}] ${a.biasType}: ${a.message}`).join("\n\n");
    return { content: [{ type: "text" as const, text }] };
  },
);

// ── Start ─────────────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
