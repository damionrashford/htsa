import {
  Investigation,
  InvestigationMode,
  SearchType,
  EvidenceTier,
  EvidenceDirection,
  makeEvidence,
  toJson,
  toMarkdown,
  type DepthCriteria,
} from "@htsa/core";

// In-memory store for active investigations
const sessions = new Map<string, Investigation>();

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function err(message: string, status = 400): Response {
  return json({ error: message }, status);
}

export async function route(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const method = req.method.toUpperCase();
  const segments = url.pathname.split("/").filter(Boolean);

  // POST /investigations — create new investigation
  if (method === "POST" && segments[0] === "investigations" && segments.length === 1) {
    const body = await req.json() as {
      title: string;
      investigator?: string;
      mode?: string;
      pruningThreshold?: number;
    };
    if (!body.title) return err("title is required");

    const id = Math.random().toString(36).slice(2, 12);
    const inv = new Investigation({
      title: body.title,
      date: new Date().toISOString().split("T")[0]!,
      investigator: body.investigator ?? "api",
      mode: body.mode === "rapid" ? InvestigationMode.Rapid : InvestigationMode.Full,
      pruningThreshold: body.pruningThreshold ?? 0.05,
      searchType: SearchType.BestFirst,
    });
    sessions.set(id, inv);
    return json({ id, title: body.title }, 201);
  }

  // GET /investigations — list all
  if (method === "GET" && segments[0] === "investigations" && segments.length === 1) {
    const list = [...sessions.entries()].map(([id, inv]) => ({
      id,
      title: inv.config.title,
      mode: inv.config.mode,
      entropy: inv.entropy,
      rootCauses: inv.graph.rootCauses().length,
    }));
    return json(list);
  }

  const invId = segments[1];
  if (!invId) return err("Not found", 404);
  const inv = sessions.get(invId);

  // GET /investigations/:id — full dump
  if (method === "GET" && segments[0] === "investigations" && segments.length === 2) {
    if (!inv) return err("Not found", 404);
    return new Response(toJson(inv, true), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // GET /investigations/:id/report — markdown
  if (method === "GET" && segments[2] === "report") {
    if (!inv) return err("Not found", 404);
    return new Response(toMarkdown(inv), {
      headers: { "Content-Type": "text/markdown" },
    });
  }

  if (!inv) return err("Not found", 404);

  // PATCH /investigations/:id/situation
  if (method === "PATCH" && segments[2] === "situation") {
    const body = await req.json() as Record<string, string>;
    inv.updateSituation(body);
    return json({ ok: true });
  }

  // POST /investigations/:id/causal-chain
  if (method === "POST" && segments[2] === "causal-chain") {
    const body = await req.json() as { surfaceWhy: string };
    const node = inv.startCausalChain(body.surfaceWhy);
    return json(node, 201);
  }

  // POST /investigations/:id/hypotheses
  if (method === "POST" && segments[2] === "hypotheses") {
    const body = await req.json() as { parentId: string; statement: string; probability?: number };
    const node = inv.addHypothesis(body.parentId, body.statement, body.probability);
    return json(node, 201);
  }

  // POST /investigations/:id/evidence
  if (method === "POST" && segments[2] === "evidence") {
    const body = await req.json() as {
      nodeId: string;
      source: string;
      tier: number;
      direction: string;
      description?: string;
    };
    const tier = body.tier as EvidenceTier;
    const direction = body.direction === "contradicts"
      ? EvidenceDirection.Contradicts
      : EvidenceDirection.Supports;
    const evOpts = body.description ? { description: body.description } : {};
    const evidence = makeEvidence(body.source, tier, direction, evOpts);
    const posterior = inv.addEvidence(body.nodeId, evidence);
    return json({ posterior, evidenceId: evidence.id });
  }

  // POST /investigations/:id/root-cause
  if (method === "POST" && segments[2] === "root-cause") {
    const body = await req.json() as { nodeId: string; depthCriteria: DepthCriteria };
    const errMsg = inv.markRootCause(body.nodeId, body.depthCriteria);
    if (errMsg) return err(errMsg);
    return json({ ok: true });
  }

  // POST /investigations/:id/resolutions
  if (method === "POST" && segments[2] === "resolutions") {
    const body = await req.json() as {
      nodeId: string;
      type: "fix" | "mitigate" | "accept";
      change: string;
      owner?: string;
      deadline?: string;
      priorityImpact?: number;
      priorityRecurrence?: number;
      priorityActionability?: number;
    };
    const resOpts: Record<string, unknown> = { type: body.type, change: body.change };
    if (body.owner !== undefined) resOpts["owner"] = body.owner;
    if (body.deadline !== undefined) resOpts["deadline"] = body.deadline;
    if (body.priorityImpact !== undefined) resOpts["priorityImpact"] = body.priorityImpact;
    if (body.priorityRecurrence !== undefined) resOpts["priorityRecurrence"] = body.priorityRecurrence;
    if (body.priorityActionability !== undefined) resOpts["priorityActionability"] = body.priorityActionability;
    const r = inv.addResolution(body.nodeId, resOpts as never);
    return json(r, 201);
  }

  // GET /investigations/:id/bias-check
  if (method === "GET" && segments[2] === "bias-check") {
    return json(inv.checkBias());
  }

  return err("Not found", 404);
}
