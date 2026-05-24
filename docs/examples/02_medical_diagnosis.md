<h1 align="center">Worked Example: Emergency Chest Pain — Differential Diagnosis</h1>

> A 58-year-old patient presents to the ER with sudden-onset chest pain radiating to the left arm, shortness of breath, and diaphoresis. The differential diagnosis must distinguish between acute myocardial infarction, pulmonary embolism, aortic dissection, and other causes — under time pressure, with incomplete information, where getting it wrong is fatal.

---

## Investigation Header

```
INVESTIGATION: Emergency Chest Pain — Differential Diagnosis
DATE: 2026-03-26
INVESTIGATOR: ER attending physician
MODE: [x] Rapid (patient in crisis — schedule full review later)
PRUNING THRESHOLD (θ): 0.01 (safety-critical domain — ≤1%)
```

**Search strategy: DFS.** [SEARCH] Rationale: active patient crisis. Time-to-treatment determines outcome. Best-First or BFS would explore multiple branches simultaneously — appropriate for post-hoc analysis, not for a patient whose myocardium may be dying. DFS follows the single highest-probability branch first, treating the most likely killer earliest. If initial treatment fails, backtrack.

---

## Layer 1 — Situation Map (5 Ws)

| Question | Answer |
|---|---|
| **Who** | **Patient (affected):** 58-year-old male, history of hypertension, smoker (30 pack-years), family history of coronary artery disease. **Trigger:** unknown — onset during rest. **Detector:** patient called 911. **Resolver:** ER attending + cardiology consult. |
| **What** | Sudden-onset substernal chest pain (8/10), radiating to left arm, with dyspnea and diaphoresis. Onset 45 minutes ago. |
| **When** | 14:32 — patient at rest, watching television. No exertional trigger. Pain has not resolved. |
| **Where** | Cardiovascular system (presenting symptoms), but location is not yet confirmed — pulmonary and aortic systems are in scope. |
| **Why (surface)** | Unknown. The surface Why in medicine is the presenting complaint, not the diagnosis. The patient is in pain; the mechanism is what Layer 2 must determine. |

[GRAPH] The situation map establishes the root node of the investigation DAG. All causal branches will descend from this node. The "Where" answer is deliberately broad — premature localization is how diagnoses get missed.

---

## Layer 2 — Causal Chain (5 Whys)

### Setting Priors

[BAYES] Before examining any test results, assign priors from epidemiological base rates for this presentation profile (58M, chest pain + radiation + diaphoresis + hypertension + smoker):

```
H1: Acute Myocardial Infarction (AMI)    P = 0.55
H2: Pulmonary Embolism (PE)              P = 0.10
H3: Aortic Dissection                    P = 0.08
H4: Unstable Angina                      P = 0.15
H5: Other (GERD, musculoskeletal,        P = 0.12
    pericarditis, pneumothorax, anxiety)
                                    Total: 1.00
```

**Where these priors come from:** [BAYES] In a 58-year-old male smoker with hypertension and family history of CAD presenting with substernal chest pain radiating to the left arm plus diaphoresis, AMI dominates the base rate. The ACS (acute coronary syndrome) family — AMI plus unstable angina — accounts for roughly 70% of this presentation profile in published ER data. PE and aortic dissection are less common but cannot be pruned at these priors — both exceed θ = 0.01 by a wide margin.

[EXP] The full differential for "chest pain" includes dozens of etiologies. Without pruning, the branching factor is unmanageable. Base rates and presenting features reduce the working set to five hypothesis classes. This is the first pruning pass — cutting the exponential space before any tests are ordered.

> [BIAS] **Availability bias warning.** AMI is the most common diagnosis in this presentation. ER physicians see it frequently, which inflates subjective probability beyond the base rate. The prior of 0.55 is set from published epidemiological data, not from "I see a lot of MIs." The danger: if AMI dominates attention, PE and aortic dissection get inadequate workup. Aortic dissection in particular has a 1-2% mortality increase per hour of delayed diagnosis. The prior is 0.08 — low but far above the pruning threshold. It stays in scope.

---

### DFS — Following the Highest-Probability Branch First

[SEARCH] DFS entry point: H1 (AMI), P = 0.55.

**Why is the patient having chest pain? → Hypothesis: Acute Myocardial Infarction**

#### Evidence Gathering — Round 1

**12-lead ECG** (obtained at T+3 minutes):
- ST-segment elevation in leads II, III, aVF (inferior leads)
- Reciprocal ST depression in I, aVL

[EVIDENCE] **Tier 1 — Instrumental.** ECG is a direct electrical measurement. ST-elevation in a contiguous lead pattern is the strongest non-invasive indicator for STEMI.

[INFO] Information gain from this ECG is high. Prior entropy across five hypotheses:

```
H(prior) = -[0.55·log₂(0.55) + 0.10·log₂(0.10) + 0.08·log₂(0.08)
            + 0.15·log₂(0.15) + 0.12·log₂(0.12)]
         ≈ 1.93 bits
```

ST-elevation in II, III, aVF with reciprocal changes is highly specific. Likelihood ratios:

```
P(this ECG | AMI)               ≈ 0.85
P(this ECG | PE)                ≈ 0.03  (PE can cause right heart strain, not this pattern)
P(this ECG | Aortic Dissection) ≈ 0.05  (dissection can occlude coronary → mimic STEMI)
P(this ECG | Unstable Angina)   ≈ 0.08  (UA typically shows ST depression or T-wave changes)
P(this ECG | Other)             ≈ 0.02
```

[BAYES] **Update:**

```
P(E) = Σ P(E|Hᵢ)·P(Hᵢ)
     = (0.85)(0.55) + (0.03)(0.10) + (0.05)(0.08) + (0.08)(0.15) + (0.02)(0.12)
     = 0.4675 + 0.003 + 0.004 + 0.012 + 0.0024
     = 0.4889

P(AMI | ECG)              = (0.85 × 0.55) / 0.4889 = 0.956
P(PE | ECG)               = (0.03 × 0.10) / 0.4889 = 0.006  ← BELOW θ
P(Aortic Dissection | ECG)= (0.05 × 0.08) / 0.4889 = 0.008  ← BELOW θ but borderline
P(Unstable Angina | ECG)  = (0.08 × 0.15) / 0.4889 = 0.025
P(Other | ECG)            = (0.02 × 0.12) / 0.4889 = 0.005  ← BELOW θ
```

**Post-ECG probabilities:**

```
H1: AMI                    P = 0.956  ↑↑
H2: PE                     P = 0.006  ↓↓  → PRUNED (below θ = 0.01)
H3: Aortic Dissection      P = 0.008  ↓↓  → RETAIN (see note below)
H4: Unstable Angina        P = 0.025  ↓
H5: Other                  P = 0.005  ↓↓  → PRUNED (below θ = 0.01)
```

> **Note on H3 (Aortic Dissection):** P = 0.008, technically below θ = 0.01. However, aortic dissection has an asymmetric cost profile — if missed and the patient receives anticoagulation (standard AMI treatment), dissection becomes rapidly fatal. [SEARCH] In safety-critical domains, the pruning threshold is a floor, not a cliff. When the cost of a false negative is catastrophic and the ruling-out test is fast, retain the branch. A single bedside test — bilateral blood pressure comparison — takes 60 seconds and can eliminate or escalate H3.

[GRAPH] Pruned branches: H2 (PE) and H5 (Other) are removed from the active DAG. They are stored with their posterior at time of pruning for recovery if new evidence contradicts the leading hypothesis.

```
Pruned branches:
  H2 (PE)    — P = 0.006 at pruning, evidence: ECG pattern inconsistent with right heart strain
  H5 (Other) — P = 0.005 at pruning, evidence: ECG shows acute ischemic pattern, rules out non-cardiac
```

---

#### Evidence Gathering — Round 2

**Troponin I (point-of-care, T+15 minutes):** Elevated at 2.8 ng/mL (normal < 0.04 ng/mL). [EVIDENCE] **Tier 1 — Instrumental.** Quantitative lab assay. Troponin is the gold-standard biomarker for myocardial injury.

**Bilateral blood pressure (T+5 minutes):** Right arm 148/92, Left arm 144/88. Difference of 4 mmHg systolic. [EVIDENCE] **Tier 2 — Observational.** Manual BP measurement. A difference >20 mmHg would suggest dissection. 4 mmHg is within normal variation.

**Patient history (T+8 minutes):** Patient reports no tearing or ripping quality to the pain. Pain is pressure-like, not sharp. No history of Marfan syndrome or connective tissue disorder. [EVIDENCE] **Tier 4 — Testimonial.** Patient recall and self-report. Useful for narrowing differential but lowest-tier evidence.

[BAYES] **Update with troponin + BP + history:**

Troponin 2.8 ng/mL — 70x the upper limit of normal:
```
P(troponin this high | AMI)               ≈ 0.95
P(troponin this high | Aortic Dissection) ≈ 0.15  (dissection can cause secondary MI)
P(troponin this high | Unstable Angina)   ≈ 0.10  (UA has mild troponin elevation, not 70x)
```

Symmetric bilateral BP + no tearing pain + no connective tissue history:
```
P(these findings | Aortic Dissection) ≈ 0.20  (substantially reduces dissection probability)
P(these findings | AMI)               ≈ 0.85  (consistent)
```

Combined update:
```
H1: AMI                    P = 0.992
H3: Aortic Dissection      P = 0.001  → PRUNED (below θ, cost-asymmetry resolved by BP + history)
H4: Unstable Angina        P = 0.007  → PRUNED (troponin 70x ULN rules out UA — UA has minimal necrosis)
```

[INFO] Post-update entropy:

```
H(posterior) ≈ -[0.992·log₂(0.992)] ≈ 0.012 bits
```

Entropy has dropped from 1.93 bits to 0.012 bits. The investigation has nearly converged. [INFO] Each correct Why answer reduced entropy — the ECG provided ~1.4 bits of information gain, and the troponin + BP combination provided the remaining ~0.5 bits.

```
Final pruned branches:
  H2 (PE)                — P = 0.006, pruned at Round 1 (ECG)
  H3 (Aortic Dissection) — P = 0.001, pruned at Round 2 (symmetric BP + troponin pattern + history)
  H4 (Unstable Angina)   — P = 0.007, pruned at Round 2 (troponin 70x ULN inconsistent with UA)
  H5 (Other)             — P = 0.005, pruned at Round 1 (ECG)
```

---

### The Why Chain — AMI Confirmed, Now Find the Root Cause

The differential is resolved. AMI is the diagnosis at P = 0.992. But "the patient is having a heart attack" is not a root cause — it is the What. The Why chain now drills into mechanism.

**Why 1: Why is the patient having an acute myocardial infarction?**
→ Acute thrombotic occlusion of the right coronary artery (RCA), causing inferior STEMI.
Evidence: ST-elevation pattern in II, III, aVF localizes to inferior wall / RCA territory. [EVIDENCE] Tier 1 (ECG) + Tier 3 (inferential — lead pattern maps to vascular territory by established cardiology).
Status: [x] Finding (Tier 1 + Tier 3 evidence)
P = 0.95

**Why 2: Why did the RCA acutely occlude?**
→ Rupture of an atherosclerotic plaque with superimposed thrombus formation.
Evidence: This is the mechanism in >90% of STEMI cases (epidemiological base rate). Confirmed mechanism requires catheterization. [EVIDENCE] Tier 3 — Inferential. The mechanism is inferred from base rates and presentation; direct visualization awaits cath lab.
Status: [x] Hypothesis (Tier 3 only — awaiting cath confirmation)
P = 0.92

[CAUSAL] Counterfactual framing: "If the plaque had not ruptured, would the artery have occluded?" In >90% of acute STEMI, the answer is no. Plaque rupture is the proximate mechanism. Non-rupture occlusion (vasospasm, embolism) accounts for <10% and is inconsistent with this risk-factor profile.

**Why 3: Why did the plaque rupture?**
→ Vulnerable plaque morphology (thin-cap fibroatheroma) destabilized by systemic risk factors.
Evidence: Patient has three major risk factors — hypertension (shear stress on plaque cap), smoking (endothelial dysfunction + inflammation), and family history (genetic predisposition to plaque instability). [EVIDENCE] Tier 4 (patient-reported history) + Tier 3 (inferential from established pathophysiology).
Status: [x] Hypothesis (Tier 3/4 evidence)
P = 0.88

[CAUSAL] This is where the causal chain branches. Three systemic risk factors each contribute independently and synergistically to plaque vulnerability. This is AND-causation with amplification — each factor worsens the others.

**Why 4: Why does the patient have these risk factors?**

[GRAPH] The Why tree branches here into three parallel causes:

```
Why 4 (branches):
  ├──► 4a: Hypertension — uncontrolled (patient reports medication non-compliance)
  │      Evidence: BP 148/92 in acute setting; patient states he stopped lisinopril 6 months ago
  │      [EVIDENCE] Tier 2 (current BP) + Tier 4 (patient report of non-compliance)
  │      Status: [x] Finding (Tier 2) / Hypothesis (compliance claim is Tier 4)
  │
  ├──► 4b: Smoking — 30 pack-years, ongoing
  │      Evidence: Patient confirms active smoking. Nicotine staining on fingers.
  │      [EVIDENCE] Tier 2 (physical exam observation) + Tier 4 (patient report)
  │      Status: [x] Finding
  │
  └──► 4c: Family history of CAD (father MI at age 52)
         Evidence: Patient report only.
         [EVIDENCE] Tier 4 — Testimonial
         Status: [x] Hypothesis (unverifiable in acute setting)
```

---

### Depth Criteria Check — Where to Stop

The Why chain has reached systemic risk factors. Apply the four depth criteria to determine if we have reached actionable root causes.

**Proposed root cause cluster: Uncontrolled hypertension + active smoking + genetic predisposition, producing vulnerable coronary plaque → rupture → thrombotic occlusion → inferior STEMI.**

For the **acute crisis**, the root cause is the thrombotic occlusion (Why 1-2). For **long-term prevention**, the root causes are the modifiable risk factors (Why 4a, 4b).

#### Acute Root Cause: Thrombotic RCA Occlusion

| Test | Result |
|---|---|
| **Actionability** | Yes. Percutaneous coronary intervention (PCI) can mechanically restore blood flow. Antiplatelet + anticoagulation therapy can dissolve/prevent further thrombus. Direct, concrete intervention exists. |
| **Counterfactual Clarity** | Yes. "If the thrombus were removed, would blood flow restore and myocardial necrosis halt?" Mechanism is fully understood and verified by decades of interventional cardiology. |
| **System Boundary** | Inside. The thrombus is in the patient's coronary artery. It is directly accessible via catheterization. |
| **Diminishing Returns** | Yes. Going one Why deeper (Why did the thrombus form at this moment rather than yesterday?) does not change the acute intervention. Open the artery now. |

All four tests pass. **Acute root cause confirmed.**

#### Chronic Root Causes: Medication Non-Compliance (4a) + Active Smoking (4b)

| Test | 4a: Medication Non-Compliance | 4b: Active Smoking |
|---|---|---|
| **Actionability** | Yes. Resume antihypertensive therapy. Address barriers to compliance (cost, side effects, health literacy). | Yes. Smoking cessation intervention — pharmacotherapy (varenicline/NRT) + behavioral counseling. |
| **Counterfactual Clarity** | Yes. Controlled BP reduces plaque shear stress and rupture risk. The mechanism linking hypertension → plaque vulnerability → rupture is established. | Yes. Smoking cessation reduces endothelial dysfunction, inflammation, and thrombotic tendency. Established causal mechanism. |
| **System Boundary** | Inside (patient behavior + healthcare system access). If non-compliance is driven by medication cost, the boundary extends to insurance/formulary — which may require a Mitigate or Accept resolution. | Inside (patient behavior). Addiction is a medical condition with evidence-based treatments. |
| **Diminishing Returns** | Going deeper: "Why did the patient stop taking lisinopril?" may change the intervention (cost → formulary change vs. side effects → medication switch vs. health literacy → education). Worth one more Why. | Going deeper: "Why does the patient smoke?" reaches addiction neurobiology — not actionable at the individual clinical level. Stop here. |

[SEARCH] **Diminishing Returns test triggers one more DFS step on branch 4a.**

**Why 5 (on branch 4a): Why did the patient stop taking lisinopril?**
→ Patient reports persistent dry cough (a known ACE inhibitor side effect) and could not afford the specialist visit to switch medications.
Evidence: [EVIDENCE] Tier 4 — Patient report. Cough is a documented ACE inhibitor side effect occurring in 5-20% of patients. Cost barrier is patient-reported but consistent with insurance status (uninsured).
Status: [x] Hypothesis (Tier 4, but clinically consistent)

**Depth criteria on Why 5:**

| Test | Result |
|---|---|
| **Actionability** | Yes. Switch to an ARB (e.g., losartan) — same efficacy, no cough. Connect patient with financial assistance program or generic formulary. Two concrete changes. |
| **Counterfactual Clarity** | Yes. If the patient had been switched to an ARB and given affordable access, he would likely have remained compliant, maintaining BP control. |
| **System Boundary** | Inside (medication choice is clinician-controlled; cost barrier is partially inside via generic substitution and assistance programs). |
| **Diminishing Returns** | Going deeper ("Why is healthcare expensive?") does not change what this clinician does today. Stop. |

All four tests pass. **Chronic root cause 4a refined: inadequate medication management (wrong drug for this patient + cost barrier to follow-up).**

#### Why 4c (Family History) — Depth Criteria

| Test | Result |
|---|---|
| **Actionability** | No. Genetic predisposition to CAD cannot be altered. |
| **System Boundary** | Outside. Genetic inheritance is not modifiable. |

4c is a **constraint**, not a root cause. Resolution type: **Accept.** It informs risk stratification but does not change the intervention.

---

## Layer 3 — Resolution

```
ACUTE ROOT CAUSE: Thrombotic occlusion of RCA
  Type: Fix
  Must Change: Restore coronary blood flow
  Action: Emergent PCI (primary percutaneous coronary intervention) with stent placement
         + Dual antiplatelet therapy (aspirin + P2Y12 inhibitor)
         + Anticoagulation (heparin during procedure)
  Owner: Interventional cardiology (cath lab activated)
  By When: Door-to-balloon time target: <90 minutes (patient arrived 14:32, cath lab target 16:02)
  Counterfactual test: "If PCI had been performed before symptom onset, would STEMI have occurred?" → No (the occlusion would have been prevented/reversed). Fix is correctly targeted.

CHRONIC ROOT CAUSE A: Inadequate antihypertensive management
  Type: Fix
  Must Change: Switch ACE inhibitor → ARB (losartan 50mg). Enroll in patient assistance program for medication cost. Schedule 2-week follow-up for BP check.
  Owner: Attending physician (inpatient) → PCP (outpatient)
  By When: Medication switch before discharge. Assistance enrollment within 48 hours. Follow-up scheduled at discharge.
  Counterfactual test: "If the patient had been on an ARB with affordable access, would compliance have been maintained and BP controlled?" → Likely yes. Fix targets both the side-effect barrier and the cost barrier.

CHRONIC ROOT CAUSE B: Active smoking (30 pack-years)
  Type: Mitigate
  Must Change: Initiate smoking cessation intervention — varenicline + behavioral counseling referral. Nicotine replacement therapy as bridge.
  Owner: Attending physician (initiate inpatient) → PCP (continue outpatient)
  By When: Inpatient counseling before discharge. Varenicline prescription at discharge. Cessation program enrollment within 1 week.
  Counterfactual test: "If the patient had never smoked, would this MI have occurred?" → Possibly not, but smoking is one of multiple contributing factors (AND-causation with amplification). Cessation reduces future risk; it cannot undo 30 years of vascular damage. Hence: Mitigate, not Fix.

CONSTRAINT: Genetic predisposition to CAD
  Type: Accept
  Action: Document family history in risk stratification. Inform aggressive secondary prevention targets (LDL < 70 mg/dL). Genetic testing not indicated at this time.
```

**Root cause interactions:** [CAUSAL]
- Hypertension + Smoking + Genetics → **AND-causation with amplification.** Each factor independently increases risk; together they multiply it. Hypertension creates mechanical stress on plaques. Smoking inflames and destabilizes them. Genetics determines baseline plaque vulnerability. The MI required the confluence, not any single factor.
- Acute occlusion is downstream of all three chronic causes. Fixing the acute cause (PCI) treats this event. Fixing/mitigating the chronic causes (BP control + smoking cessation) prevents the next one.

**Priority order:**

```
1. Thrombotic occlusion (acute) — Impact=5, Recurrence=5, Actionability=5 → Fix NOW
2. Medication non-compliance    — Impact=4, Recurrence=5, Actionability=4 → Fix before discharge
3. Active smoking               — Impact=4, Recurrence=5, Actionability=3 → Mitigate, initiate before discharge
4. Genetic predisposition       — Impact=3, Recurrence=5, Actionability=1 → Accept, document
```

---

## Layer 4 — Verification and Learning

### Verification

```
ACUTE FIX (PCI):
  Verification window: Immediate (intra-procedural) + 24-48 hours post-procedure
  □ Angiography confirms TIMI 3 flow restored in RCA post-stent?
  □ ST-segment resolution >50% within 90 minutes of PCI?
  □ Troponin trend peaks and begins declining within 12-24 hours?
  □ Patient chest-pain free post-procedure?

  If ST-elevation persists or troponin continues rising → stent thrombosis or incomplete
  revascularization. Return to Layer 2 — re-evaluate.

CHRONIC FIX A (Medication management):
  Verification window: 2-week follow-up, then 3-month follow-up
  □ BP at follow-up < 140/90 (target < 130/80 for post-MI)?
  □ Patient tolerating ARB (no cough, no angioedema)?
  □ Patient able to afford medication?
  □ Patient adherent (pill count or pharmacy refill records)?

CHRONIC MITIGATE B (Smoking cessation):
  Verification window: 6 months (smoking cessation standard verification period)
  □ Patient self-reports abstinence at 1 month, 3 months, 6 months?
  □ Cotinine level confirms abstinence if self-report is questionable?
    [EVIDENCE] Self-report is Tier 4. Cotinine is Tier 1. For verification, seek Tier 1.
  □ If relapse → not a failure of the investigation, but expected (cessation success rate ~30%
    at 6 months with pharmacotherapy). Re-intervene. Mitigations require ongoing management.
```

### Learning

```
□ Were the base rates accurate?
  → The prior of 0.55 for AMI was appropriate for this presentation profile. The ECG
    rapidly confirmed it. In future cases with this risk factor profile + classic presentation,
    a prior of 0.55-0.60 is well-calibrated.
  → PE prior of 0.10 may have been slightly high for a patient without PE risk factors
    (no recent immobilization, no DVT history, no tachycardia). Consider Wells score
    integration into prior-setting for future cases.

□ Which branches were followed and later pruned?
  → H3 (Aortic Dissection) was retained one round beyond the pruning threshold due to
    cost-asymmetry reasoning. The bilateral BP test resolved it in 60 seconds. This was
    the correct decision — always retain catastrophic-if-missed diagnoses until a fast
    rule-out test is performed, even below θ.
  → Update: In future chest pain cases, bilateral BP should be part of the initial
    assessment battery, not a second-round add-on.

□ What was the first hypothesis — and was it correct?
  → AMI was the leading hypothesis from the priors. It was confirmed. Track this: if
    the first hypothesis is always correct, either the cases are straightforward or
    anchoring is not being tested. [BIAS] Over time, monitor the rate at which the
    initial hypothesis survives investigation. If it exceeds 90% across diverse cases,
    suspect anchoring bias in prior-setting.

□ Surprises worth documenting:
  → The root cause of medication non-compliance was not "patient irresponsibility" but
    a combination of drug side effect + cost barrier. [BIAS] Attribution bias would
    have stopped the Why chain at "patient stopped taking medication" — blaming the
    person rather than investigating the system. Why 5 revealed actionable causes
    that the clinician can address.
  → This is the highest-value learning from this investigation. Document it as a
    protocol update: when medication non-compliance is identified, always ask one
    more Why to distinguish willful non-adherence from systemic barriers.
```

[GRAPH] The investigation DAG converges: four initial branches reduced to one confirmed diagnosis, which then produced a linear Why chain with one branch point (risk factors), leading to two modifiable root causes and one constraint. Total nodes explored: 12. Nodes pruned: 4 (H2, H3, H4, H5). The DAG is acyclic — no feedback loops detected in the acute investigation. (Chronic disease management involves feedback loops — smoking damages vessels, vessel damage causes events, events motivate cessation — but these are outside the scope of this acute investigation.)

---

## Summary of Mathematical Foundations Used

| Foundation | Where It Operated |
|---|---|
| [GRAPH] | DAG structure of differential diagnosis; branch/prune/converge pattern; pruned branch storage |
| [EXP] | Reduction from dozens of chest pain etiologies to five working hypotheses via base rates |
| [CAUSAL] | Counterfactual framing at each Why level; AND-causation with amplification across risk factors |
| [INFO] | Entropy calculation showing convergence from 1.93 bits to 0.012 bits across two evidence rounds |
| [BAYES] | Prior-setting from epidemiological base rates; two explicit Bayesian updates with likelihood ratios |
| [SEARCH] | DFS justified by time pressure; retention of H3 below threshold due to cost-asymmetry |
| [BIAS] | Availability bias in AMI-dominant priors; attribution bias in medication non-compliance |
| [EVIDENCE] | Four-tier classification: ECG + troponin (Tier 1), BP + physical exam (Tier 2), pathophysiology inference (Tier 3), patient history (Tier 4) |

---

[← Previous: Engineering Incident](01_engineering_incident.md) · [Next: Security Breach →](03_security_breach.md)