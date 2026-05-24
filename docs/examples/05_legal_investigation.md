<h1 align="center">Worked Example — Legal: Scaffolding Collapse Liability Investigation</h1>

> A construction worker is severely injured when scaffolding collapses on a commercial building site. Multiple parties may be liable. The investigation must determine causation for potential litigation.

---

## Investigation Parameters

```
INVESTIGATION: Scaffolding Collapse — Multi-Party Liability Determination
DATE: 2025-09-15
INVESTIGATOR: Lead forensic engineer + litigation team
MODE: [x] Full
PRUNING THRESHOLD (θ): 0.01 (safety-critical, legal liability context)
SEARCH STRATEGY: BFS — must identify ALL liable parties, not just the first
```

**[SEARCH]** BFS is mandatory here. In litigation, identifying the *first* liable party is insufficient — every party whose negligence contributed to the injury must be identified. DFS would risk premature closure on the most obvious defendant. BFS explores all branches at each depth level before going deeper, ensuring no liable party is missed.

**[EXP]** Four potential defendants (general contractor, scaffolding subcontractor, equipment manufacturer, site safety inspector), each with multiple possible failure modes, each with sub-causes. The branching factor is 3–4 at each level. Without pruning: 4 × 3 × 3 = 36+ terminal nodes by depth 3. The θ = 0.01 threshold (safety-critical) means branches are pruned only when probability drops below 1% — almost nothing is discarded early. This is correct for litigation: missing a liable party is far more costly than investigating a dead end.

---

## Layer 1 — Situation Map (5 Ws)

| Question | Answer |
|---|---|
| **Who** | See role map below |
| **What** | Third-level scaffolding on the south face of a 6-story commercial building collapsed during routine work, injuring one worker severely (fractured pelvis, spinal compression) |
| **When** | September 12, 2025, 10:47 AM. Scaffolding erected September 8–9. Last safety inspection September 10. Collapse occurred during normal operations — no unusual weather, no extraordinary loads |
| **Where** | 4200 Industrial Parkway, commercial construction site. South face, bays 7–9, levels 2–3 |
| **Why (surface)** | The scaffolding structure failed under normal working loads |

**Who — Role Map:**

| Role | Party |
|---|---|
| **Originator** | Multiple candidates — the investigation must determine this |
| **Trigger** | The worker (Marcus Delaney) was performing exterior cladding work at the time of collapse — normal activity, not the cause |
| **Affected** | Marcus Delaney, 34, severe injuries |
| **Detector** | Site foreman James Holt, who witnessed the collapse from ground level |
| **Resolver** | Litigation team, OSHA investigators, insurance adjusters |
| **Stakeholders** | General contractor (Meridian Construction), scaffolding subcontractor (ProScaff Inc.), equipment manufacturer (Atlas Scaffold Systems), site safety inspector (SafeCheck Consulting), building owner (Parkway Development LLC), workers' compensation carrier |

**[GRAPH]** The Who map reveals the causal graph's starting topology. Four potential source nodes (originator candidates), one trigger node (ruled out — normal activity), one affected node. The investigation's task is to determine which originator nodes have valid causal edges to the collapse event.

---

## Layer 2 — Causal Chain (5 Whys, Branching)

### Why (surface): The scaffolding collapsed under normal working loads.

**[BAYES]** Setting priors before any investigation. Base rates for scaffolding collapse causes from OSHA data (2015–2024):

```
Improper erection/assembly:          35%     P = 0.35
Component failure (equipment):       25%     P = 0.25
Overloading (exceeded rated load):   15%     P = 0.15
Foundation/base failure:             12%     P = 0.12
Inadequate inspection:                8%     P = 0.08
Environmental (wind, ice):            5%     P = 0.05
```

**[BIAS] PREMATURE CLOSURE WARNING:** The general contractor is the most visible party. Litigation teams — and juries — default to the entity with the deepest pockets and the most apparent authority. This is a combination of **availability bias** (the GC's name is on the site) and **premature closure** (stopping at "the GC is responsible for site safety" without investigating the specific causal chain). The defense: BFS forces exploration of ALL branches before concluding. No party is named as liable until the causal chain from their specific failure to the injury is established with Tier 1 or Tier 2 evidence.

---

### BFS — Depth 1: Immediate Causes

**[SEARCH]** BFS Level 1 — explore all branches before going deeper on any single one.

#### Branch A: Structural assembly error (improper erection)

```
Why A1: The scaffolding was not assembled according to manufacturer specifications.
P(A1) = 0.35 (prior from base rates)
Evidence: Site photographs taken post-collapse (Tier 1, Sept 12 11:30 AM)
  — Photos show cross-braces in bays 7–8 were installed at non-standard angles
  — Locking pins on three vertical standards were not fully engaged
Status: [x] Finding (Tier 1 evidence — photographic record)
```

**[INFO]** The photographs are high information-gain evidence. Before the photos: 6 competing hypotheses, entropy is high. After: one hypothesis jumps from P = 0.35 to P = 0.55. Entropy drops significantly.

**[BAYES]** Update after photographic evidence:
```
Prior P(A1) = 0.35
Likelihood: P(photos showing assembly errors | assembly was faulty) ≈ 0.95
Likelihood: P(photos showing assembly errors | assembly was correct) ≈ 0.05
Posterior P(A1) ≈ 0.55
```

#### Branch B: Component failure (equipment defect)

```
Why B1: A critical scaffolding component failed (material defect or fatigue).
P(B1) = 0.25 (prior)
Evidence: Recovered components sent to metallurgical lab (Tier 1, pending results)
  — Visual inspection shows fracture surface on one coupling consistent
    with pre-existing crack (Tier 2 — forensic engineer's field observation)
Status: [x] Hypothesis (pending Tier 1 lab results)
```

#### Branch C: Overloading

```
Why C1: The scaffolding was loaded beyond its rated capacity.
P(C1) = 0.15 (prior)
Evidence: Material manifest for work in progress (Tier 1, Sept 12)
  — Total load on bays 7–9 at time of collapse: estimated 1,800 lbs
  — Rated capacity for that configuration: 2,500 lbs
  — Load was within rated capacity
Status: [x] Finding — RULED OUT by Tier 1 evidence
```

**[BAYES]** Update: P(C1) → 0.02. Load was 72% of rated capacity. Not zero — the rated capacity assumes correct assembly, so if assembly was faulty, the effective capacity was lower. But overloading itself is not the cause.

#### Branch D: Foundation/base failure

```
Why D1: The scaffolding base plates or mudsills shifted or failed.
P(D1) = 0.12 (prior)
Evidence: Post-collapse inspection of base plates and ground conditions (Tier 1, Sept 12)
  — Base plates intact, mudsills undisturbed, ground firm and level
  — No evidence of settlement or lateral displacement at base
Status: [x] Finding — RULED OUT by Tier 1 evidence
```

**[BAYES]** Update: P(D1) → 0.01. At θ = 0.01 this branch sits exactly at the pruning threshold. In safety-critical litigation, we retain it but deprioritize. If new evidence emerges, it can be recovered.

#### Branch E: Inadequate inspection

```
Why E1: The safety inspection failed to identify the hazardous condition.
P(E1) = 0.08 (prior)
Evidence: SafeCheck inspection report dated September 10 (Tier 1 — document)
  — Report states "scaffolding inspected, all components secure, no deficiencies noted"
  — But photographic evidence (Branch A) shows deficiencies were present on Sept 12
  — Cross-braces and locking pins do not change position by themselves
Status: [x] Finding (Tier 1 — inspection report contradicts physical evidence)
```

**[INFO]** The contradiction between the inspection report and the physical evidence is a high-surprise finding. Either (a) the deficiencies existed on Sept 10 and the inspector missed them, or (b) someone disturbed the scaffolding between Sept 10 and Sept 12. This requires further investigation.

**[BAYES]** Update: P(E1) → 0.30. The inspection report's claim that everything was secure, contradicted by the post-collapse photos, sharply increases the probability that the inspection was deficient.

#### Branch F: Environmental

```
Why F1: Wind, weather, or seismic event caused or contributed to the collapse.
P(F1) = 0.05 (prior)
Evidence: Weather records for Sept 12 (Tier 1 — National Weather Service data)
  — Wind: 8 mph sustained, gusts to 12 mph. Well below scaffold wind threshold (25 mph)
  — No precipitation, no seismic activity
Status: [x] Finding — RULED OUT by Tier 1 evidence
```

**[BAYES]** Update: P(F1) → 0.005 < θ. **PRUNED.** Evidence: NWS data, Sept 12.

---

### Pruned Branches Summary

```
Branch C (Overloading):    P = 0.02, evidence: load manifest vs. rated capacity
Branch D (Base failure):   P = 0.01, evidence: post-collapse base inspection
Branch F (Environmental):  P = 0.005, PRUNED, evidence: NWS weather data
```

**[EXP]** Three branches eliminated at depth 1. Problem space reduced from 6 to 3 active branches: A (assembly error), B (component failure), E (inspection failure).

---

### BFS — Depth 2: Deeper Causes

**[SEARCH]** BFS Level 2 — explore all three active branches one level deeper before committing to any.

#### Branch A2: Why was the scaffolding assembled incorrectly?

```
Why A2: The erection crew did not follow the manufacturer's assembly instructions.
P(A2) = 0.55
Evidence:
  — ProScaff crew foreman's daily log, Sept 8–9 (Tier 1 — contemporaneous document):
    "Completed south face bays 1–12, levels 1–3. Assembly per standard procedure."
  — Manufacturer's assembly manual (Tier 1 — document): specifies cross-brace angles
    of 45° ± 2° and mandatory locking pin engagement checks at each standard
  — Post-collapse measurement of cross-braces in bays 7–8: angles at 38° and 52°
    (Tier 1 — engineering measurement, Sept 13)
  — Locking pin engagement: 3 of 8 pins in bays 7–8 not fully seated
    (Tier 1 — forensic inspection, Sept 13)
Status: [x] Finding (Tier 1 evidence — measurements vs. specifications)
```

**[EVIDENCE]** Note the conflict: the crew foreman's log claims "assembly per standard procedure" but the physical measurements contradict this. The foreman's log is Tier 1 (contemporaneous written record), but the physical measurements are also Tier 1 and are more reliable because they are not subject to self-serving bias. The log records intent or belief; the measurements record physical reality.

#### Branch B2: Why did the coupling component fail?

```
Why B2: The coupling had a pre-existing crack (material defect from manufacturing).
P(B2) = 0.25
Evidence:
  — Metallurgical lab report (Tier 1, received Sept 18):
    "Fracture surface analysis reveals fatigue crack propagation originating from
     a casting void approximately 2mm in diameter. Crack had propagated to 40% of
     the coupling cross-section prior to final failure. Estimated crack age: 6–18
     months based on corrosion of fracture surface."
  — Atlas Scaffold Systems quality control records for batch #A7-2024-0891
    (Tier 1, subpoenaed Sept 20): QC inspection passed with no defects noted
Status: [x] Finding (Tier 1 — metallurgical analysis)
```

**[BAYES]** Update after lab report: P(B2) → 0.45. The lab report establishes that the coupling had a manufacturing defect (casting void) that led to fatigue crack growth. This is a second independently viable cause of the collapse.

**[INFO]** Critical finding: the lab report changes the structure of the investigation. Two independently sufficient causes now exist — assembly error AND component defect. This triggers the overdetermination analysis.

#### Branch E2: Why did the inspector fail to identify the hazardous condition?

```
Why E2: The inspector either did not perform a thorough inspection or lacked
competence to identify the deficiencies.
P(E2) = 0.30
Evidence:
  — SafeCheck's inspection protocol document (Tier 1 — company procedure):
    requires visual check of every coupling, pin engagement check on every
    standard, and cross-brace angle verification with inclinometer
  — Inspector's time-on-site records (Tier 1 — GPS/badge data, Sept 10):
    inspector was on-site for 22 minutes. The south face alone has 96 couplings,
    36 standards, and 24 cross-braces. A thorough inspection of the south face
    alone would require approximately 45–60 minutes.
Status: [x] Finding (Tier 1 — time records vs. inspection protocol requirements)
```

**[BAYES]** Update: P(E2) → 0.40. The 22-minute site time makes a thorough inspection physically impossible. The inspector signed off on a scaffold he could not have fully inspected.

---

### BFS — Depth 3: Root Cause Identification

#### Branch A3: Why did the erection crew deviate from manufacturer specifications?

```
Why A3a: ProScaff did not provide the manufacturer's assembly manual to the
erection crew for this specific scaffold model.
P(A3a) = 0.40
Evidence:
  — Deposition of erection crew lead (Tier 4 — testimonial, Oct 2):
    "We always build the same way. I've been doing scaffolds for 11 years.
     We didn't have the Atlas manual on site — we use our own procedures."
  — ProScaff's internal procedure manual (Tier 1 — document, subpoenaed Oct 5):
    Generic procedure. Does not reference Atlas-specific angle tolerances or
    pin engagement verification. Omits the ±2° tolerance specification entirely.
Status: [x] Finding (Tier 1 — ProScaff procedure vs. Atlas specification)
```

**[EVIDENCE] CONFLICTING EVIDENCE — Tier 4 vs. Tier 1:** The crew lead's testimony (Tier 4) states they followed their standard procedures. The engineering analysis (Tier 1) shows the result did not meet manufacturer specifications. These do not actually conflict: the crew likely *did* follow ProScaff's internal procedures — the problem is that ProScaff's procedures were deficient relative to the manufacturer's requirements. The Tier 4 testimony is credible on the narrow question of what procedures were followed; the Tier 1 evidence establishes that those procedures were inadequate.

**Legal significance:** This matters for apportioning liability. The individual workers are not negligent — they followed the procedures they were given. The negligence sits with ProScaff for maintaining deficient procedures.

```
Why A3b: Meridian Construction (general contractor) did not verify that ProScaff's
procedures met manufacturer specifications.
P(A3b) = 0.35
Evidence:
  — Meridian's subcontractor oversight protocol (Tier 1 — document):
    "Subcontractors are responsible for compliance with manufacturer specifications
     for their respective scopes of work."
  — Contract between Meridian and ProScaff (Tier 1 — document, Section 7.3):
    "Subcontractor shall erect scaffolding in accordance with manufacturer
     specifications and applicable OSHA standards."
  — Meridian's site safety plan (Tier 1 — document): No provision for verifying
    subcontractor compliance with scaffold manufacturer specifications.
    Verification delegated entirely to SafeCheck inspections.
Status: [x] Finding (Tier 1 — contractual delegation without verification mechanism)
```

#### Branch B3: Why did the defective coupling reach the job site?

```
Why B3: Atlas Scaffold Systems' quality control process failed to detect the
casting void during manufacturing inspection.
P(B3) = 0.45
Evidence:
  — Atlas QC records for batch #A7-2024-0891 (Tier 1): All units passed visual
    and dimensional inspection. No non-destructive testing (NDT) performed.
  — Industry standard ANSI/SSFI SC100-8/17 (Tier 1 — published standard):
    Recommends NDT (ultrasonic or radiographic) for load-bearing couplings in
    safety-critical applications.
  — Atlas's QC protocol (Tier 1 — document): Visual and dimensional only.
    NDT is listed as "optional, performed on customer request."
Status: [x] Finding (Tier 1 — QC protocol vs. industry standard)
```

#### Branch E3: Why was the inspection inadequate?

```
Why E3: SafeCheck's business model incentivizes speed over thoroughness.
P(E3) = 0.35
Evidence:
  — SafeCheck billing records (Tier 1 — subpoenaed): Inspector conducted 6
    site inspections on September 10 across 4 different job sites. Average
    time per site: 25 minutes.
  — SafeCheck compensation structure (Tier 1 — internal documents): Inspectors
    are paid per inspection, not per hour.
  — Expert opinion on minimum inspection time (Tier 3 — retained expert):
    "A competent scaffold inspection for a structure of this size requires a
     minimum of 90 minutes for the full perimeter."
Status: [x] Finding (Tier 1 billing records + Tier 3 expert opinion)
```

---

### Overdetermination Analysis (OR-Causation)

**[CAUSAL]** Two independent failure chains have been identified, each potentially sufficient to cause the collapse:

```
Failure Chain 1: Defective assembly (cross-braces at wrong angles, pins not engaged)
  → Reduced structural capacity → Collapse under normal load

Failure Chain 2: Defective coupling (casting void → fatigue crack → 40% cross-section loss)
  → Coupling fails under normal load → Collapse
```

**Two-Stage Counterfactual Test:**

**Stage 1 — Simple counterfactual for each cause:**

> "If the scaffolding had been assembled correctly (Chain 1 removed), would the collapse still have occurred?"

The defective coupling had lost 40% of its cross-section. Engineering analysis (Tier 1, retained structural engineer, Oct 8): "A coupling at 60% effective cross-section, in a correctly assembled scaffold with proper load distribution, operates at a safety factor of 1.2 — marginal but within rated parameters under static load. However, dynamic loading (workers moving, material placement) could produce transient loads exceeding the reduced capacity."

Answer: **Possibly yes.** The collapse might still have occurred from the defective coupling alone, but with lower probability. P(collapse | correct assembly, defective coupling) ≈ 0.40.

> "If the coupling had been sound (Chain 2 removed), would the collapse still have occurred?"

Engineering analysis: "Incorrect cross-brace angles reduce lateral stability by approximately 35%. Unengaged locking pins allow vertical standards to separate under lateral load. Under normal working conditions with wind loading within design parameters, a correctly manufactured scaffold with these assembly defects would have a progressive failure probability of approximately 0.55 over a typical work cycle."

Answer: **Probably yes.** P(collapse | defective assembly, sound coupling) ≈ 0.55.

**Stage 2 — Contingent counterfactual:**

> "If the scaffolding had been assembled correctly AND the coupling had been sound, would the collapse still have occurred?"

Answer: **No.** A correctly assembled scaffold with sound components, loaded to 72% of rated capacity in 8 mph winds, does not collapse. P(collapse | correct assembly, sound coupling) ≈ 0.001.

**[CAUSAL]** Stage 2 confirms **overdetermination (OR-causation)**. Each failure chain is independently sufficient (or nearly so) to cause the collapse. Removing either one alone leaves the system vulnerable. Both are genuine root causes. Both liable parties must be held accountable — fixing only one failure mode leaves the system exposed to the other.

---

## Depth Criteria Checks

### ROOT CAUSE A: ProScaff's deficient assembly procedures

```
(1) Actionability Test:
    "Is there a concrete change that addresses this cause?"
    → Yes. ProScaff must adopt manufacturer-specific procedures for each scaffold
      system and verify crew training on those procedures.
    [x] PASS

(2) Counterfactual Clarity Test:
    "Is the causal mechanism clear?"
    → Yes. ProScaff's generic procedure omitted angle tolerances and pin verification
      → crew assembled bays 7–8 out of spec → reduced structural capacity → collapse.
    [x] PASS

(3) System Boundary Test:
    "Is this cause inside the system's control?"
    → Yes. ProScaff controls its own assembly procedures and crew training.
      The manufacturer's specifications were available — ProScaff chose not to
      incorporate them.
    [x] PASS

(4) Diminishing Returns Test:
    "If we went one Why deeper, would it change the action?"
    → One deeper: "Why did ProScaff not incorporate manufacturer specs?"
      → Possible answers: cost pressure, ignorance, complacency.
      → These might matter for punitive damages but do not change the corrective
        action (adopt manufacturer procedures). The action is the same regardless.
    [x] PASS
```

**[GRAPH]** Root Cause A is a leaf node. All four depth criteria pass. This is a confirmed root cause.

### ROOT CAUSE B: Atlas Scaffold Systems' inadequate quality control

```
(1) Actionability Test:
    → Yes. Atlas must implement NDT (ultrasonic or radiographic testing) for
      load-bearing couplings per ANSI/SSFI SC100 recommendations.
    [x] PASS

(2) Counterfactual Clarity Test:
    → Yes. Casting void → fatigue crack propagation → 40% cross-section loss
      → coupling failure → collapse. Mechanism established by metallurgical
      analysis (Tier 1).
    [x] PASS

(3) System Boundary Test:
    → Yes. Atlas controls its manufacturing QC process. The industry standard
      recommending NDT was published and available. Atlas chose visual-only inspection.
    [x] PASS

(4) Diminishing Returns Test:
    → One deeper: "Why did the casting void exist?" → foundry process variation,
      which is normal in casting. The actionable level is QC detection, not
      elimination of all casting defects (which is physically impossible).
    [x] PASS
```

### ROOT CAUSE C: SafeCheck's inadequate inspection

```
(1) Actionability Test:
    → Yes. SafeCheck must restructure inspection protocols to require minimum
      time-on-site proportional to scaffold size, and change compensation from
      per-inspection to per-hour.
    [x] PASS

(2) Counterfactual Clarity Test:
    → Yes. Per-inspection pay → incentive to rush → 22 minutes for a 90-minute
      job → deficiencies not detected → no remediation before collapse.
    [x] PASS

(3) System Boundary Test:
    → Yes. SafeCheck controls its compensation structure and inspection protocols.

    BOUNDARY NOTE: The question of whether Meridian (GC) should have independently
    verified scaffold compliance is a separate boundary question. Meridian delegated
    safety verification to SafeCheck contractually — but delegation of duty does not
    eliminate duty of care. This is a legal boundary question (duty vs. delegation)
    that maps to the framework's system boundary test:

    Meridian's position: "Inspection is outside our boundary — we hired SafeCheck."
    Legal reality: A general contractor's duty to maintain a safe worksite is
    non-delegable. The *task* of inspection can be delegated; the *liability* cannot.

    Therefore: Meridian's failure to verify SafeCheck's adequacy is INSIDE Meridian's
    boundary. The lack of a verification mechanism (see Branch A3b) is an additional
    contributing cause, though not independently sufficient for the collapse.
    [x] PASS

(4) Diminishing Returns Test:
    → One deeper: "Why does SafeCheck use per-inspection compensation?"
      → Industry norm, cost competition. Changing SafeCheck's business model is
        actionable for SafeCheck. Going deeper into industry economics does not
        change the required action.
    [x] PASS
```

### CONTRIBUTING CAUSE D: Meridian Construction's failure to verify subcontractor compliance

```
(1) Actionability Test:
    → Yes. Meridian must implement independent verification of safety-critical
      subcontractor work, not rely solely on third-party inspection.
    [x] PASS

(2) Counterfactual Clarity Test:
    → Partial. If Meridian had verified ProScaff's procedures against manufacturer
      specs, they would have caught the deficiency. But Meridian's failure alone did
      not cause the collapse — it allowed the assembly error to persist uncaught.
      This is a contributing cause (AND-causation with Root Cause A), not an
      independently sufficient cause.
    [x] PASS (mechanism is clear, though causal contribution is partial)

(3) System Boundary Test:
    → Yes. Meridian controls its own oversight protocols.
    [x] PASS

(4) Diminishing Returns Test:
    → One deeper: "Why did Meridian not verify?" → Contractual delegation, cost
      of oversight. Does not change the action.
    [x] PASS
```

---

## Evidence Chain of Custody

**[EVIDENCE]** Legal context demands meticulous chain of custody for all physical evidence. Any break in the chain provides defense counsel grounds to challenge admissibility.

```
CHAIN OF CUSTODY LOG

Item 1: Fractured coupling (Atlas part #SC-445, batch #A7-2024-0891)
  Collected: Sept 12, 2:15 PM by OSHA investigator R. Martinez
  Sealed: Evidence bag #OSHA-2025-4471, photographed in situ before removal
  Transferred: Sept 14, to MetalTech Labs (chain of custody form #MT-0891)
  Lab receipt: Sept 14, 9:00 AM, received by Dr. K. Vasquez
  Analysis completed: Sept 18. Report sealed and transmitted to parties.
  Storage: MetalTech evidence vault, controlled access.

Item 2: Post-collapse photographs (247 images)
  Captured: Sept 12, 11:15 AM – 12:40 PM by forensic photographer L. Chen
  Equipment: calibrated Nikon D850, GPS-tagged, timestamp verified
  Hash: SHA-256 computed on original memory card before any transfer
  Stored: Original card sealed (evidence bag #OSHA-2025-4472)
  Working copies distributed to all parties from verified hash

Item 3: ProScaff crew foreman's daily log (Sept 8–9 entries)
  Original: In possession of ProScaff. Subpoenaed Sept 15.
  Received: Sept 17, certified copy. Original retained by ProScaff under
  litigation hold notice served Sept 13.

Item 4: SafeCheck inspection report (Sept 10)
  Original: Digital, SafeCheck's inspection management system.
  Metadata: Creation timestamp Sept 10, 11:22 AM. No subsequent edits.
  Certified export provided Sept 16 under subpoena.

Item 5: SafeCheck inspector GPS/badge data (Sept 10)
  Original: Digital, SafeCheck's fleet management system.
  Arrival: 10:58 AM. Departure: 11:20 AM. Total on-site: 22 minutes.
  Certified export provided Sept 20 under subpoena.

Item 6: Atlas QC records, batch #A7-2024-0891
  Original: Digital, Atlas quality management system.
  Subpoenaed Sept 19. Certified export received Sept 22.
  Records show visual/dimensional pass, no NDT performed.
```

**[EVIDENCE]** Every physical item has: collector identity, collection time, seal/hash, transfer records, and current custodian. Every digital item has: creation metadata, litigation hold confirmation, and certified export. A gap in any chain converts Tier 1 evidence to Tier 3 (inferential — "we believe this is what the evidence showed") and weakens the causal claim it supports.

---

## Conflicting Evidence Analysis

**[EVIDENCE]** Key conflict: Witness testimony vs. engineering analysis.

```
CONFLICT: SafeCheck inspector's testimony vs. physical evidence

Tier 4 (Testimonial):
  Inspector David Paulson's deposition (Oct 15):
  "I inspected the south face scaffolding on September 10. I checked the
   couplings, the braces, the pins. Everything was properly secured. I've
   been doing this for 9 years. I would have noticed if cross-braces were
   at the wrong angle or pins weren't engaged."

Tier 1 (Physical/Instrumental):
  — Post-collapse measurements: cross-braces at 38° and 52° (spec: 45° ± 2°)
  — 3 of 8 locking pins in bays 7–8 not fully seated
  — Cross-braces and locking pins do not change position spontaneously
  — No work was performed on the scaffolding structure between Sept 10 and Sept 12
    (confirmed by site access logs — Tier 1)

RESOLUTION:
  The Tier 1 physical evidence controls. The deficiencies existed on Sept 10
  and were not detected by the inspector. Two explanations:
  (a) Inspector did not actually check bays 7–8 (consistent with 22-minute
      site time being insufficient for full inspection)
  (b) Inspector checked but failed to recognize the deficiencies

  Either way, the inspection was inadequate. The inspector's testimony (Tier 4)
  is contradicted by physical evidence (Tier 1) and time records (Tier 1).
  Per the evidence hierarchy: when Tier 4 conflicts with Tier 1, Tier 1 prevails.
```

**[BIAS]** The inspector's testimony is subject to **self-serving bias** (a form of confirmation bias). He has strong motivation to assert competence. This does not mean he is lying — memory reconstruction under stress genuinely produces confident but inaccurate recall. The Tier 1 evidence resolves the conflict without requiring a credibility judgment.

---

## Layer 3 — Resolution

### Root Cause Interactions

**[CAUSAL]** The root causes interact as follows:

```
Root Cause A (ProScaff assembly) ←──OR-causation──→ Root Cause B (Atlas defect)
  Either alone is sufficient to cause the collapse (overdetermination).
  Both must be resolved.

Root Cause C (SafeCheck inspection) ←──AND-causation──→ Root Cause A
  The inspection failure did not cause the collapse directly.
  It allowed the assembly error to persist. If the inspection had caught
  the assembly error, Root Cause A would have been remediated.
  C is necessary-but-not-sufficient alone.

Contributing Cause D (Meridian oversight) ←──AND-causation──→ Root Cause C
  Meridian's failure to verify SafeCheck's adequacy allowed the inadequate
  inspection to go unchallenged. D enabled C, which enabled A.
```

### Resolution Table

```
ROOT CAUSE A — ProScaff's deficient assembly procedures
  Type: Fix
  Must Change: ProScaff must adopt and train crews on manufacturer-specific
    assembly procedures for each scaffold system. Verified competency testing
    required before crew deployment.
  Counterfactual: "If ProScaff had trained crews on Atlas specifications and
    verified compliance, would the assembly errors have occurred?" → No.
  Owner: ProScaff Inc.
  By When: Immediate (all current job sites) + systemic (30 days for procedure update)
  Liability: ProScaff bears primary liability for the assembly deficiency.

ROOT CAUSE B — Atlas Scaffold Systems' inadequate quality control
  Type: Fix
  Must Change: Atlas must implement NDT (ultrasonic testing minimum) for all
    load-bearing couplings. Visual-only QC for safety-critical components is
    insufficient per ANSI/SSFI SC100.
  Counterfactual: "If Atlas had performed NDT on batch #A7-2024-0891, would
    the defective coupling have reached the job site?" → No. The 2mm casting
    void would have been detected by ultrasonic testing.
  Owner: Atlas Scaffold Systems
  By When: Immediate recall/inspection of batch #A7-2024-0891 + systemic QC
    process update (60 days)
  Liability: Atlas bears primary liability for the product defect. Potential
    strict liability (manufacturing defect) independent of negligence.

ROOT CAUSE C — SafeCheck's inadequate inspection
  Type: Fix
  Must Change: SafeCheck must (1) restructure inspector compensation to
    hourly/salary basis, (2) establish minimum time-on-site requirements
    proportional to scaffold size, (3) implement digital verification
    checklists with photographic documentation at each checkpoint.
  Counterfactual: "If SafeCheck had conducted a thorough 90-minute inspection,
    would the assembly deficiencies have been caught?" → Yes, with high
    probability. The cross-brace angles and pin engagement are standard
    inspection items.
  Owner: SafeCheck Consulting
  By When: Immediate (all current contracts) + systemic (45 days)
  Liability: SafeCheck bears liability for negligent inspection.

CONTRIBUTING CAUSE D — Meridian Construction's failure to verify
  Type: Mitigate
  Must Change: Meridian must implement independent spot-checks of
    safety-critical subcontractor work, in addition to third-party inspection.
    Delegation of inspection does not eliminate duty of care.
  Counterfactual: "If Meridian had verified ProScaff's procedures, would they
    have caught the gap?" → Probably yes — the discrepancy between ProScaff's
    generic procedure and Atlas's specific requirements is straightforward
    to identify.
  Owner: Meridian Construction
  By When: 30 days for updated oversight protocol
  Liability: Meridian bears contributory liability as general contractor
    with non-delegable duty of care.
```

### Priority Order

```
Impact × Recurrence × Actionability (scale 1–5):

Root Cause A (ProScaff assembly):   5 × 4 × 5 = 100  → Act first
Root Cause B (Atlas QC):            5 × 3 × 4 = 60   → Act first (product recall)
Root Cause C (SafeCheck inspection): 4 × 5 × 4 = 80  → Act first
Contributing D (Meridian oversight): 3 × 4 × 4 = 48  → Plan and schedule

Note: A and B score within 40% but Root Cause B involves a potential product
recall affecting other job sites — urgency exceeds what the formula captures.
Both are "act first."
```

---

## Layer 4 — Verification and Learning

### Verification Windows

```
Root Cause A (ProScaff assembly):
  Trigger-based: Next scaffold erection by ProScaff crews.
  Verification: Independent engineering review of first 3 erections under
  new procedures. All measurements within manufacturer tolerances? → Verified.
  Expected: Within 30 days.

Root Cause B (Atlas QC):
  Trigger-based: Next production batch of SC-445 couplings.
  Verification: NDT performed on 100% of batch. Defect detection rate vs.
  previous visual-only baseline. Any casting voids detected? → QC working.
  Expected: Within 60 days.
  ADDITIONAL: Batch #A7-2024-0891 recall/inspection results. How many
  additional defective units found? This data quantifies the pre-existing risk.

Root Cause C (SafeCheck inspection):
  Time-based: 1 quarter (90 days).
  Verification: Audit of inspector time-on-site records under new protocol.
  Average time vs. minimum required time. Deficiency detection rate compared
  to previous quarter.
  Expected: December 2025.

Contributing Cause D (Meridian oversight):
  Trigger-based: Next subcontractor safety audit cycle.
  Verification: Does Meridian's new protocol include independent spot-checks?
  Were spot-checks actually performed? Any gaps identified?
  Expected: Within 45 days.
```

### Learning — Prior Updates

```
□ Base rate update: Scaffolding collapse causes.
  Prior: Improper erection 35%, component failure 25%.
  Posterior: This case was overdetermined — both assembly AND component failure.
  Lesson: Overdetermination in scaffolding collapses may be underreported.
  When one sufficient cause is found, investigators stop looking (premature
  closure). The actual rate of multi-cause collapses is likely higher than
  historical data suggests.

□ Prior update: Inspection adequacy.
  Prior: Inadequate inspection contributes to 8% of collapses.
  Posterior: Revise upward. If inspectors are systematically under-resourced
  (per-inspection pay, insufficient time), the 8% base rate reflects detected
  inspection failures, not actual inspection failures.

□ First hypothesis tracking:
  First hypothesis after initial briefing: "The general contractor cut corners."
  Was it correct? → Partially. Meridian is a contributing cause, not the primary
  cause. The first hypothesis was driven by availability bias (GC is the most
  visible party) and attribution bias (assigning cause to the authority figure).
  [BIAS] This confirms the premature closure warning issued at the start.

□ Surprises worth documenting:
  — The overdetermination. Two independently sufficient causes in a single
    collapse. This changes the litigation strategy from "identify the liable
    party" to "apportion liability among multiple parties whose independent
    failures each could have caused the injury."
  — The inspection time data. 22 minutes for a job requiring 90. This is not
    a marginal shortfall — it is a structural impossibility. The inspection
    was performative, not substantive.
  — The coupling defect age (6–18 months). This component had been in service
    on previous projects. The defect was a ticking clock. If the assembly had
    been correct, the coupling might have failed on a different project,
    injuring a different worker. The system had two independent time bombs.
```

### Liability Apportionment Summary

```
Party                  Liability Basis                     Type
─────────────────────  ──────────────────────────────────  ──────────────
ProScaff Inc.          Negligent assembly (deficient       Primary
                       procedures, deviation from
                       manufacturer specs)

Atlas Scaffold Systems Manufacturing defect (casting void  Primary /
                       + inadequate QC vs. industry        Strict liability
                       standard)

SafeCheck Consulting   Negligent inspection (physically    Primary
                       impossible to complete in time
                       spent on site)

Meridian Construction  Failure to verify subcontractor     Contributory
                       compliance (non-delegable duty
                       of care)
```

**[CAUSAL]** The overdetermination finding (OR-causation between Root Causes A and B) has a specific legal consequence: each defendant cannot escape liability by pointing to the other sufficient cause. Under joint and several liability principles, each party whose negligence was independently sufficient bears full liability for the injury, with contribution rights among themselves. The two-stage counterfactual test provides the evidentiary framework to establish this in court.

---

## Summary of Mathematical Foundations Applied

| Foundation | Where Applied |
|---|---|
| **[GRAPH]** Graph theory | Who map topology, root cause identification as leaf nodes, DAG structure of the causal chain |
| **[EXP]** Exponential space | Branching factor analysis (4 × 3 × 3 = 36+), pruning three branches at depth 1, θ = 0.01 retention |
| **[CAUSAL]** Causal inference | Two-stage counterfactual test, overdetermination (OR-causation), AND-causation between inspection and assembly failures, confounder control |
| **[INFO]** Information theory | Entropy reduction from post-collapse photographs, high-surprise finding of overdetermination, information gain prioritization |
| **[BAYES]** Bayesian reasoning | OSHA base rate priors, updates after photographic evidence (0.35 → 0.55), lab report (0.25 → 0.45), time records (0.08 → 0.40) |
| **[SEARCH]** Search algorithm | BFS strategy (mandatory for multi-party liability), systematic depth-level exploration, no premature commitment |
| **[BIAS]** Cognitive biases | Premature closure warning (defaulting to GC), availability bias (most visible party), attribution bias (naming the authority figure), self-serving bias in inspector testimony |
| **[EVIDENCE]** Evidence evaluation | 4-tier hierarchy applied throughout, Tier 4 vs. Tier 1 conflict resolution, chain of custody requirements, evidence quality assessment |

---

<p align="center"><strong>← Previous</strong> <strong><a href="04_business_bottleneck.md">04 — Business Bottleneck</a></strong> · <strong>Next →</strong> <strong><a href="06_personal_decision.md">06 — Personal Decision</a></strong></p>
