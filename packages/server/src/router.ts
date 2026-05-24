import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
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

const sessions = new Map<string, Investigation>();

export function createApp() {
  return (
    new Elysia()
      .use(
        swagger({
          path: "/swagger",
          documentation: {
            info: { title: "HTSA API", version: "2.0.0", description: "Probabilistic root cause analysis via REST" },
          },
        }),
      )

      .post(
        "/investigations",
        ({ body, set }) => {
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
          set.status = 201;
          return { id, title: body.title };
        },
        {
          body: t.Object({
            title: t.String(),
            investigator: t.Optional(t.String()),
            mode: t.Optional(t.String()),
            pruningThreshold: t.Optional(t.Number()),
          }),
        },
      )

      .get("/investigations", () =>
        [...sessions.entries()].map(([id, inv]) => ({
          id,
          title: inv.config.title,
          mode: inv.config.mode,
          entropy: inv.entropy,
          rootCauses: inv.graph.rootCauses().length,
        })),
      )

      .get("/investigations/:id", ({ params, set }) => {
        const inv = sessions.get(params.id);
        if (!inv) { set.status = 404; return { error: "Not found" }; }
        return new Response(toJson(inv, true), { headers: { "Content-Type": "application/json" } });
      })

      .get("/investigations/:id/report", ({ params, set }) => {
        const inv = sessions.get(params.id);
        if (!inv) { set.status = 404; return { error: "Not found" }; }
        return new Response(toMarkdown(inv), { headers: { "Content-Type": "text/markdown" } });
      })

      .patch(
        "/investigations/:id/situation",
        ({ params, body, set }) => {
          const inv = sessions.get(params.id);
          if (!inv) { set.status = 404; return { error: "Not found" }; }
          inv.updateSituation(body as Record<string, string>);
          return { ok: true };
        },
        { body: t.Record(t.String(), t.String()) },
      )

      .post(
        "/investigations/:id/causal-chain",
        ({ params, body, set }) => {
          const inv = sessions.get(params.id);
          if (!inv) { set.status = 404; return { error: "Not found" }; }
          set.status = 201;
          return inv.startCausalChain(body.surfaceWhy);
        },
        { body: t.Object({ surfaceWhy: t.String() }) },
      )

      .post(
        "/investigations/:id/hypotheses",
        ({ params, body, set }) => {
          const inv = sessions.get(params.id);
          if (!inv) { set.status = 404; return { error: "Not found" }; }
          set.status = 201;
          return inv.addHypothesis(body.parentId, body.statement, body.probability);
        },
        {
          body: t.Object({
            parentId: t.String(),
            statement: t.String(),
            probability: t.Optional(t.Number()),
          }),
        },
      )

      .post(
        "/investigations/:id/evidence",
        ({ params, body, set }) => {
          const inv = sessions.get(params.id);
          if (!inv) { set.status = 404; return { error: "Not found" }; }
          const tier = body.tier as EvidenceTier;
          const direction =
            body.direction === "contradicts" ? EvidenceDirection.Contradicts : EvidenceDirection.Supports;
          const opts = body.description ? { description: body.description } : {};
          const evidence = makeEvidence(body.source, tier, direction, opts);
          const posterior = inv.addEvidence(body.nodeId, evidence);
          set.status = 201;
          return { posterior, evidenceId: evidence.id };
        },
        {
          body: t.Object({
            nodeId: t.String(),
            source: t.String(),
            tier: t.Number(),
            direction: t.String(),
            description: t.Optional(t.String()),
          }),
        },
      )

      .post(
        "/investigations/:id/root-cause",
        ({ params, body, set }) => {
          const inv = sessions.get(params.id);
          if (!inv) { set.status = 404; return { error: "Not found" }; }
          const msg = inv.markRootCause(body.nodeId, body.depthCriteria as DepthCriteria);
          if (msg) { set.status = 400; return { error: msg }; }
          return { ok: true };
        },
        {
          body: t.Object({
            nodeId: t.String(),
            depthCriteria: t.Object({
              actionability: t.Boolean(),
              counterfactualClarity: t.Boolean(),
              systemBoundary: t.Boolean(),
              diminishingReturns: t.Boolean(),
            }),
          }),
        },
      )

      .post(
        "/investigations/:id/resolutions",
        ({ params, body, set }) => {
          const inv = sessions.get(params.id);
          if (!inv) { set.status = 404; return { error: "Not found" }; }
          const opts: Record<string, unknown> = { type: body.type, change: body.change };
          if (body.owner !== undefined) opts["owner"] = body.owner;
          if (body.deadline !== undefined) opts["deadline"] = body.deadline;
          if (body.priorityImpact !== undefined) opts["priorityImpact"] = body.priorityImpact;
          if (body.priorityRecurrence !== undefined) opts["priorityRecurrence"] = body.priorityRecurrence;
          if (body.priorityActionability !== undefined) opts["priorityActionability"] = body.priorityActionability;
          set.status = 201;
          return inv.addResolution(body.nodeId, opts as never);
        },
        {
          body: t.Object({
            nodeId: t.String(),
            type: t.Union([t.Literal("fix"), t.Literal("mitigate"), t.Literal("accept")]),
            change: t.String(),
            owner: t.Optional(t.String()),
            deadline: t.Optional(t.String()),
            priorityImpact: t.Optional(t.Number()),
            priorityRecurrence: t.Optional(t.Number()),
            priorityActionability: t.Optional(t.Number()),
          }),
        },
      )

      .get("/investigations/:id/bias-check", ({ params, set }) => {
        const inv = sessions.get(params.id);
        if (!inv) { set.status = 404; return { error: "Not found" }; }
        return inv.checkBias();
      })
  );
}
