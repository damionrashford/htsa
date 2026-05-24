// ─── Enums ───────────────────────────────────────────────────────────────────

export enum NodeStatus {
  Open       = "open",
  RootCause  = "root_cause",
  Pruned     = "pruned",
  Discarded  = "discarded",
  Escalated  = "escalated",
}

export enum ResolutionType {
  Fix      = "fix",
  Mitigate = "mitigate",
  Accept   = "accept",
}

export enum EvidenceTier {
  Physical      = 1,  // logs, sensors, controlled experiments
  Observational = 2,  // direct witness at time of event
  Inferential   = 3,  // reasoned conclusion from Tier 1/2
  Testimonial   = 4,  // recalled after the fact
}

export enum EvidenceDirection {
  Supports     = "supports",
  Contradicts  = "contradicts",
}

export enum InteractionType {
  And          = "and",           // problem only occurs when both present
  Or           = "or",            // each independently sufficient
  Amplification = "amplification", // one makes the other worse
  Conflict     = "conflict",      // fixing one worsens the other
}

export enum SearchType {
  BestFirst = "best_first",
  DFS       = "dfs",
  BFS       = "bfs",
}

export enum InvestigationMode {
  Full  = "full",
  Rapid = "rapid",
}

export enum AlertLevel {
  Warn  = "warn",
  Block = "block",
}

export enum BiasType {
  Anchoring         = "anchoring",
  Confirmation      = "confirmation",
  PrematureClosure  = "premature_closure",
  SingleCause       = "single_cause",
  Availability      = "availability_heuristic",
  Authority         = "authority_bias",
  NarrativeFallacy  = "narrative_fallacy",
}

// ─── Evidence ────────────────────────────────────────────────────────────────

export interface Evidence {
  readonly id: string;
  readonly source: string;
  readonly tier: EvidenceTier;
  readonly timestamp: string;
  readonly direction: EvidenceDirection;
  readonly description: string;
  readonly preInvestigation: boolean | null;
  readonly grangerLag: number | null;
}

export function evidenceReliability(e: Evidence): number {
  const weights: Record<EvidenceTier, number> = {
    [EvidenceTier.Physical]:      1.00,
    [EvidenceTier.Observational]: 0.75,
    [EvidenceTier.Inferential]:   0.50,
    [EvidenceTier.Testimonial]:   0.25,
  };
  return weights[e.tier];
}

export function makeEvidence(
  source: string,
  tier: EvidenceTier,
  direction: EvidenceDirection,
  opts: Partial<{
    description: string;
    timestamp: string;
    preInvestigation: boolean;
    grangerLag: number;
  }> = {},
): Evidence {
  return {
    id: Math.random().toString(36).slice(2, 10),
    source,
    tier,
    direction,
    description: opts.description ?? "",
    timestamp: opts.timestamp ?? new Date().toISOString(),
    preInvestigation: opts.preInvestigation ?? null,
    grangerLag: opts.grangerLag ?? null,
  };
}

// ─── Depth Criteria (Definition 4) ───────────────────────────────────────────

export interface DepthCriteria {
  actionability:        boolean | null;
  counterfactualClarity: boolean | null;
  systemBoundary:       boolean | null;
  diminishingReturns:   boolean | null;
}

export function depthCriteriaPassed(dc: DepthCriteria): boolean {
  return (
    dc.actionability === true &&
    dc.counterfactualClarity === true &&
    dc.systemBoundary === true &&
    dc.diminishingReturns === true
  );
}

export function makeDepthCriteria(
  actionability: boolean,
  counterfactualClarity: boolean,
  systemBoundary: boolean,
  diminishingReturns: boolean,
): DepthCriteria {
  return { actionability, counterfactualClarity, systemBoundary, diminishingReturns };
}

// ─── Resolution ──────────────────────────────────────────────────────────────

export interface Resolution {
  type:                 ResolutionType;
  change:               string;
  owner:                string;
  deadline:             string;
  counterfactualPasses: boolean | null;
  priorityImpact:       number; // 1–5
  priorityRecurrence:   number; // 1–5
  priorityActionability: number; // 1–5
  minimalIntervention:  boolean;
  interventionCoverage: number;
}

export function resolutionPriorityScore(r: Resolution): number {
  return r.priorityImpact * r.priorityRecurrence * r.priorityActionability;
}

// ─── Node (Definition 2) ─────────────────────────────────────────────────────

export interface Node {
  id:              string;
  statement:       string;
  probability:     number;
  depth:           number;
  status:          NodeStatus;
  evidence:        Evidence[];
  depthCriteria:   DepthCriteria | null;
  resolution:      Resolution | null;
  reopenCount:     number;
  prunedProbability: number | null;
  hp2015Result:    boolean | null;
  hp2015WPartition: string[] | null;
  nessSufficientSet: string[] | null;
  pns:             PNSScore | null;
  causalGrade:     number | null;
}

export function nodeIsFinding(node: Node): boolean {
  return node.evidence.some(
    e => e.direction === EvidenceDirection.Supports && e.tier <= EvidenceTier.Observational,
  );
}

export function makeNode(statement: string, opts: Partial<{
  id: string;
  probability: number;
  depth: number;
}> = {}): Node {
  return {
    id: opts.id ?? Math.random().toString(36).slice(2, 10),
    statement,
    probability: opts.probability ?? 0.0,
    depth: opts.depth ?? 0,
    status: NodeStatus.Open,
    evidence: [],
    depthCriteria: null,
    resolution: null,
    reopenCount: 0,
    prunedProbability: null,
    hp2015Result: null,
    hp2015WPartition: null,
    nessSufficientSet: null,
    pns: null,
    causalGrade: null,
  };
}

// ─── Situation Map (Layer 1) ──────────────────────────────────────────────────

export interface SituationMap {
  whoOriginator: string;
  whoTrigger:    string;
  whoAffected:   string;
  whoDetector:   string;
  whoResolver:   string;
  what:          string;
  whenBefore:    string;
  whenDuring:    string;
  whenAfter:     string;
  where:         string;
  whySurface:    string;
}

export function situationIsComplete(s: SituationMap): boolean {
  const who = [s.whoOriginator, s.whoTrigger, s.whoAffected, s.whoDetector, s.whoResolver];
  const when = [s.whenBefore, s.whenDuring, s.whenAfter];
  return (
    who.some(Boolean) &&
    Boolean(s.what) &&
    when.some(Boolean) &&
    Boolean(s.where) &&
    Boolean(s.whySurface)
  );
}

export function makeSituationMap(): SituationMap {
  return {
    whoOriginator: "", whoTrigger: "", whoAffected: "", whoDetector: "", whoResolver: "",
    what: "", whenBefore: "", whenDuring: "", whenAfter: "", where: "", whySurface: "",
  };
}

// ─── PNS (Definition — causation strength) ───────────────────────────────────

export interface PNSScore {
  nodeId:        string;
  pn:            number;
  ps:            number;
  pnsLower:      number;
  pnsUpper:      number;
  pns:           number;
  causationType: "single_root_cause" | "and_node" | "or_node" | "contributing_factor";
}

// ─── Bias Alert ───────────────────────────────────────────────────────────────

export interface BiasAlert {
  biasType: BiasType;
  level:    AlertLevel;
  message:  string;
  nodeId:   string | null;
}

// ─── Counterfactual Result ────────────────────────────────────────────────────

export interface CounterfactualResult {
  candidateId:       string;
  outcomeId:         string;
  isRootCause:       boolean;
  stage1Passes:      boolean;
  stage2Passes:      boolean;
  stage3NessPasses:  boolean;
  wPartition:        string[];
  nessSufficientSet: string[];
}

// ─── Intervention Result ──────────────────────────────────────────────────────

export interface InterventionResult {
  minimalSet:        string[];
  coverage:          number;
  threshold:         number;
  thresholdAchieved: boolean;
  iterations:        number;
}

// ─── Verification ────────────────────────────────────────────────────────────

export enum VerificationWindowType {
  TimeBased    = "time_based",
  EventDriven  = "event_driven",
  Metric       = "metric",
}

export interface VerificationRecord {
  nodeId:       string;
  windowType:   VerificationWindowType;
  description:  string;
  metric:       string;
  confirmed:    boolean | null;
  confirmedAt:  string | null;
}

// ─── Event log ───────────────────────────────────────────────────────────────

export interface InvestigationEvent {
  type:      string;
  timestamp: string;
  [key: string]: unknown;
}

// ─── Config ───────────────────────────────────────────────────────────────────

export interface InvestigationConfig {
  title:             string;
  date:              string;
  investigator:      string;
  mode:              InvestigationMode;
  pruningThreshold:  number;
  searchType:        SearchType;
}
