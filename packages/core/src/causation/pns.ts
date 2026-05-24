import type { PNSScore } from "../types.js";

export interface ExperimentalData {
  pEDoC1: number;
  pEDoC0: number;
  pC1: number;
  pE: number;
  sampleSize?: number;
  monotonicityAssumed?: boolean;
}

export interface ObservationalData {
  pEGivenC1: number;
  pEGivenC0: number;
  sampleSize?: number;
}

export class PNSCalculator {
  constructor(private readonly nodeId: string) {}

  fromExperimental(data: ExperimentalData): PNSScore {
    const pns = Math.max(0, Math.min(1, data.pEDoC1 - data.pEDoC0));
    const ps = Math.max(0, Math.min(1, data.pEDoC1));
    const pn = ps > 0 ? Math.max(0, Math.min(1, pns / ps)) : 0;

    const lower = Math.max(0, pn + ps - 1);
    const upper = Math.min(pn, ps);

    return {
      nodeId: this.nodeId,
      pn,
      ps,
      pnsLower: lower,
      pnsUpper: upper,
      pns,
      causationType: "single_root_cause",
    };
  }

  fromObservational(data: ObservationalData): PNSScore {
    const pn = Math.max(0, data.pEGivenC1 - data.pEGivenC0);
    const ps = data.pEGivenC1;

    const lower = Math.max(0, pn + ps - 1);
    const upper = Math.min(pn, ps);
    const pns = lower > 0 ? Math.sqrt(lower * upper) : lower;

    return {
      nodeId: this.nodeId,
      pn,
      ps,
      pnsLower: lower,
      pnsUpper: upper,
      pns,
      causationType: "single_root_cause",
    };
  }

  fromSubjective(pn: number, ps: number): PNSScore {
    pn = Math.max(0, Math.min(1, pn));
    ps = Math.max(0, Math.min(1, ps));

    const lower = Math.max(0, pn + ps - 1);
    const upper = Math.min(pn, ps);
    const pns = lower > 0 && upper > 0 ? Math.sqrt(lower * upper) : lower;

    return {
      nodeId: this.nodeId,
      pn,
      ps,
      pnsLower: lower,
      pnsUpper: upper,
      pns,
      causationType: "single_root_cause",
    };
  }
}
