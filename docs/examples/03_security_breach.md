<h1 align="center">Worked Example: SaaS Customer PII Exfiltration</h1>

> A mid-size SaaS company discovers that customer personally identifiable information (PII) has been exfiltrated. The SOC detects anomalous outbound traffic from a database server at 3:15 AM. This walkthrough traces the full HTSA investigation from detection to verified resolution.

---

## Investigation Parameters

```
INVESTIGATION: Customer PII Exfiltration — Project Nightfall
DATE: 2026-03-14
INVESTIGATOR: Security Incident Response Team (SIRT)
MODE: [x] Full
PRUNING THRESHOLD (θ): 0.01 (safety-critical — customer data at risk)
SEARCH STRATEGY: BFS — high stakes, must not miss any attack vector
```

**[SEARCH]** BFS is mandatory here. A DFS approach risks deep-diving into one attack vector while a second, active exploitation channel goes undetected. Every branch at each depth level must be evaluated before going deeper. The cost of missing a vector is regulatory penalty, customer harm, and continued exfiltration.

**[EXP]** The problem space is exponential. A database breach can originate from: external attack (multiple vectors), insider threat (multiple actors), supply chain compromise, misconfiguration, or a combination. Each vector branches further. Without disciplined pruning at θ = 0.01, the investigation sprawls.

---

## Temporal Firewall Protocol — Activated Before Layer 1

**[EVIDENCE]** **[BIAS]** Before any interviews or announcements, the SIRT applies the temporal firewall protocol (see **[math/08_evidence_evaluation.md](../math/08_evidence_evaluation.md)**). The investigation itself will change behavior. Employees who learn about the breach will alter access patterns, delete shell histories, or align their stories.

```
TEMPORAL FIREWALL — EVIDENCE SEPARATION

PRE-INVESTIGATION EVIDENCE (captured before breach was announced):
  - Network flow logs (automated, Tier 1) — no discount
  - Database audit logs (automated, Tier 1) — no discount
  - Authentication logs (automated, Tier 1) — no discount
  - VPN connection records (automated, Tier 1) — no discount
  - Endpoint detection telemetry (automated, Tier 1) — no discount
  - Git commit history and CI/CD pipeline logs (automated, Tier 1) — no discount
  - Badge access records (automated, Tier 1) — no discount

POST-INVESTIGATION EVIDENCE (captured after announcement):
  - Employee interviews (Tier 4) — significant discount, narratives may shift
  - Follow-up system scans (Tier 1, automated) — no discount
  - Vendor communications (Tier 4) — discount, vendors will protect themselves
  - "Newly discovered" configuration files (Tier 2) — discount if discovered
    by someone who knew about the investigation

RULE: When pre and post evidence conflict, default to pre-investigation evidence.
```

The SIRT preserves forensic images of all relevant systems before notifying anyone outside the response team. Network flow data, database audit logs, and authentication records are snapshotted and hashed. This evidence cannot be retroactively altered.

---

## Layer 1 — Situation Map (5 Ws)

### Who

| Role | Actor |
|---|---|
| **Originator** | Unknown — the entity or entities that created the conditions for exfiltration |
| **Trigger** | Unknown — the actor who executed the exfiltration |
| **Affected** | ~42,000 customers whose PII was stored in the `users` and `billing` tables |
| **Detector** | SOC analyst on night shift, responding to an automated SIEM alert |
| **Resolver** | SIRT lead, with escalation path to CISO and legal counsel |
| **Stakeholder** | Customers, regulators (state AGs, potentially GDPR DPA), executive team, board |

**[GRAPH]** The Who map is a directed graph of responsibility. Each actor is a node; edges represent causal or reporting relationships. The originator-trigger distinction matters: if these are different nodes, the attack required conditions (originator) plus execution (trigger) — an AND-causation pattern that will surface in Layer 2.

### What

At 3:15 AM UTC, the SIEM flagged a sustained outbound data transfer from `db-prod-03` (the primary customer database server) to an external IP address (`198.51.100.47`). The transfer used HTTPS on port 443 — standard egress traffic, which is why it was not blocked by the firewall. Volume: approximately 2.3 GB over 47 minutes. The `users` table contains names, emails, hashed passwords, and billing addresses. The `billing` table contains partial card numbers (last four digits) and billing metadata.

### When

```
Timeline (UTC):
  2:28 AM  — Anomalous authentication event on db-prod-03 (service account login
              from non-standard IP, visible in pre-investigation auth logs)
  2:31 AM  — First query against `users` table outside normal batch window
  2:33 AM  — Query against `billing` table — SELECT * with no WHERE clause
  2:34 AM  — Outbound connection established to 198.51.100.47:443
  3:15 AM  — SIEM alert triggers (47-minute delay from first anomalous event)
  3:22 AM  — SOC analyst acknowledges alert, begins triage
  3:45 AM  — SIRT activated, connection severed, forensic snapshot initiated
  4:10 AM  — Forensic images secured, hashed, temporal firewall established
  -------- TEMPORAL FIREWALL --------
  6:00 AM  — CISO notified, legal counsel engaged
  8:00 AM  — Broader team notified — behavior may change from this point
```

**[INFO]** The 47-minute gap between first anomalous event (2:28 AM) and SIEM alert (3:15 AM) is itself a critical data point. It represents an information delay — the detection system's entropy did not drop fast enough to trigger action. This gap is a candidate root cause for Layer 2.

### Where

- `db-prod-03`: PostgreSQL 14 database server, hosted in the company's primary AWS VPC (`us-east-1`)
- The server is in the `data` subnet, which should only be reachable from the `app` subnet
- The exfiltration endpoint (`198.51.100.47`) resolves to a VPS provider in a jurisdiction with limited law enforcement cooperation
- The service account used (`svc-etl-prod`) is provisioned for the nightly ETL pipeline

### Why (Surface)

An unauthorized actor accessed the production database using a legitimate service account and exfiltrated customer PII to an external server. The immediate question: how did they obtain the service account credentials, and why did no control prevent or detect the exfiltration in real time?

---

## Layer 2 — Causal Chain (Branching Why Tree)

**[SEARCH]** BFS execution: all branches at each depth level are enumerated and evaluated before descending. No branch is pursued in depth until all siblings are assessed.

**[BAYES]** Initial priors are set from base rates. Per the Verizon DBIR and internal incident history:

```
INITIAL PRIORS (before any investigation-specific evidence):
  P(external_attack)        = 0.45   (credential theft, exploitation, phishing)
  P(insider_threat)         = 0.20   (malicious or negligent employee)
  P(supply_chain)           = 0.15   (compromised vendor or dependency)
  P(misconfiguration_only)  = 0.15   (exposed credentials, open port, no attacker)
  P(false_positive)         = 0.05   (legitimate activity misclassified)
```

### BFS Depth 0 — Why was PII exfiltrated?

**Why (surface):** An unauthorized actor obtained database credentials, queried the PII tables, and transferred the data to an external endpoint.

### BFS Depth 1 — How did the actor obtain access?

All branches evaluated at this level before descending:

---

**Branch A: Credential compromise — stolen service account** — P = 0.45

The `svc-etl-prod` credentials were obtained by an external attacker.

Evidence (PRE-investigation, Tier 1):
- Auth logs show `svc-etl-prod` login at 2:28 AM from IP `10.0.5.77` — this IP belongs to the `app` subnet, specifically the jump host `bastion-01`
- `bastion-01` SSH logs show a login at 2:14 AM from external IP `203.0.113.22` using a developer SSH key (user: `jpark`)
- The `svc-etl-prod` password was stored in plaintext in a `.env` file committed to the internal GitLab repository `etl-pipeline` — visible in git history since 2025-09-03

Status: [x] Finding (Tier 1 evidence — automated logs, pre-investigation)

**[BAYES]** UPDATE — the plaintext credential in the Git repo is strong evidence for credential compromise. The bastion login from an external IP using a specific developer key narrows the vector.

```
P(external_attack via credential theft) = 0.45 → 0.72  ↑
P(insider_threat)                       = 0.20 → 0.12  ↓
P(supply_chain)                         = 0.15 → 0.08  ↓
P(misconfiguration_only)                = 0.15 → 0.06  ↓
P(false_positive)                       = 0.05 → 0.02  ↓
```

---

**Branch B: Insider threat — malicious employee** — P = 0.12

A current or former employee with legitimate access exfiltrated data.

Evidence (PRE-investigation, Tier 1):
- The SSH key used on `bastion-01` belongs to developer J. Park — but J. Park's badge access log shows no office entry that night, and their corporate laptop's EDR telemetry shows the device powered off since 11:47 PM
- The external IP `203.0.113.22` is not associated with any employee's home network or VPN exit node — it traces to a residential ISP in a different state

**[BIAS]** **ATTRIBUTION BIAS WARNING.** The natural instinct is to suspect J. Park because their SSH key was used. This is the fundamental attribution error — assigning the cause to an individual rather than the system that made the compromise possible. The SSH key could have been stolen. The system that allowed a plaintext credential in a Git repo and an SSH key without MFA is the structural cause. The investigation must follow the system path, not stop at a person.

**[CAUSAL]** Counterfactual test: "If J. Park did not exist, would the breach still have been possible?" Yes — anyone with access to the Git repo could have found the plaintext credential, and any stolen SSH key could have accessed the bastion. The person is interchangeable; the system conditions are the cause.

Status: [x] Hypothesis — pending further evidence. The SSH key theft scenario (Branch A) explains the same evidence without requiring insider action.

```
P(insider_threat) = 0.12 → 0.05  ↓  (approaching θ but not below it)
```

---

**Branch C: Supply chain compromise** — P = 0.08

A vendor or third-party dependency was the entry point.

Evidence (PRE-investigation, Tier 1):
- No third-party service has credentials to `db-prod-03` or `bastion-01`
- The ETL pipeline uses no external SaaS connectors — it runs entirely within the VPC
- Dependency scan of the ETL codebase shows no known compromised packages

Status: [ ] Hypothesis — no supporting evidence found.

```
P(supply_chain) = 0.08 → 0.02  ↓
```

---

**Branch D: Misconfiguration only (no external attacker)** — P = 0.06

The data was exposed through misconfiguration rather than active attack.

Evidence (PRE-investigation, Tier 1):
- The outbound transfer was to a specific external IP, not a broad exposure
- The queries were targeted (`SELECT *` on two specific tables) — not a bot or scanner pattern
- Active session management: the actor opened a connection, ran queries, started the transfer, then terminated the session

This is clearly an intentional, targeted exfiltration — not passive exposure.

```
P(misconfiguration_only) = 0.06 → 0.005  ↓  — PRUNED (below θ = 0.01)
```

**[EXP]** Branch D pruned. Evidence: targeted queries and deliberate exfiltration to a specific IP are inconsistent with passive misconfiguration. P = 0.005 < θ = 0.01.

---

**Branch E: False positive** — P = 0.02

The transfer was legitimate activity misclassified by the SIEM.

Evidence (PRE-investigation, Tier 1):
- The ETL pipeline's scheduled run is at 4:00 AM, not 2:28 AM
- The ETL pipeline writes to the data warehouse — it does not transfer data to external IPs
- No change request or maintenance window was scheduled

```
P(false_positive) = 0.02 → 0.001  — PRUNED (below θ = 0.01)
```

---

**Pruned branches summary:**

| Branch | Pruned at P | Evidence that ruled it out |
|---|---|---|
| D: Misconfiguration only | 0.005 | Targeted queries, deliberate exfiltration pattern |
| E: False positive | 0.001 | No scheduled job, wrong time, external destination |

---

### BFS Depth 2 — Drilling into Branch A (dominant: P = 0.72)

**[SEARCH]** Branch A is now dominant. BFS continues: we enumerate all sub-branches of how the credential compromise occurred before going deeper on any single one.

**Why A1: How did the attacker obtain J. Park's SSH key?**

Sub-branches at this level:

---

**Branch A1a: Phishing / social engineering** — P = 0.30

The attacker phished J. Park's credentials or tricked them into revealing the SSH key.

Evidence (POST-investigation, Tier 4 — interview):
- J. Park reports receiving a suspicious email on 2026-03-08 purporting to be from IT, requesting SSH key rotation via a linked portal. J. Park states they did not click it.
- **[EVIDENCE]** This is POST-investigation Tier 4 testimony. Apply reliability discount per temporal firewall. J. Park knows they are under scrutiny and may minimize their actions.

Evidence (PRE-investigation, Tier 1):
- Email gateway logs show the phishing email was delivered on 2026-03-08 at 9:41 AM
- DNS query logs from J. Park's workstation show a resolution of `it-keyrotation.example-corp.com` (the phishing domain) at 9:52 AM on the same day
- The phishing domain was registered on 2026-03-05 and hosted a credential harvesting page (confirmed via threat intelligence feed, Tier 1)

**[EVIDENCE]** The PRE-investigation Tier 1 evidence (DNS query to the phishing domain) contradicts J. Park's POST-investigation Tier 4 testimony ("I didn't click it"). Per the temporal firewall protocol: default to pre-investigation evidence. J. Park's workstation resolved the phishing domain, which requires clicking the link or the link being followed by a background process.

**[BAYES]** UPDATE:

```
P(phishing_vector) = 0.30 → 0.78  ↑  (DNS evidence is strong Tier 1)
P(key_from_compromised_device) = 0.25 → 0.10  ↓
P(key_from_code_repo) = 0.25 → 0.08  ↓
P(brute_force_or_other) = 0.20 → 0.04  ↓
```

Status: [x] Finding (Tier 1 — DNS logs, email gateway logs, pre-investigation)

---

**Branch A1b: SSH key stored in code repository** — P = 0.08

Evidence (PRE-investigation, Tier 1):
- Scan of all GitLab repositories shows J. Park's private SSH key was NOT committed to any repo
- The `.env` file with the `svc-etl-prod` password was committed, but the SSH key was not

```
P(key_from_code_repo) = 0.08 → 0.01  — AT THRESHOLD, retained (θ = 0.01, safety-critical)
```

---

**Branch A1c: Compromised developer workstation** — P = 0.10

Evidence (PRE-investigation, Tier 1):
- EDR telemetry from J. Park's laptop shows no malware detection, no unusual processes
- However, EDR coverage has a gap: if the phishing page harvested the SSH key via browser, EDR would not flag it as malware — it was a voluntary submission

This branch merges with A1a — the phishing page was the mechanism for key theft. The "compromised device" and "phishing" branches converge.

**[GRAPH]** Convergence detected. Branches A1a and A1c point to the same node: the SSH key was submitted through the phishing page. This is multi-root convergence — two investigation paths arriving at the same cause, which increases confidence.

---

### BFS Depth 3 — Why did phishing succeed? AND Why was exfiltration undetected?

**[CAUSAL]** The breach required two independent failure chains operating simultaneously. This is AND-causation: neither alone was sufficient.

```
Chain 1: ACCESS — How the attacker got in
  Phishing → SSH key stolen → bastion access → plaintext DB credential → data access

Chain 2: DETECTION — Why no control stopped it
  47-minute SIEM delay → no DLP on database egress → service account had
  unrestricted SELECT → no MFA on bastion SSH → no anomaly detection on
  off-hours DB queries
```

**Would the breach have occurred with only Chain 1 (access) but functional detection?**
No — real-time DLP or anomaly detection on off-hours queries would have triggered immediate response before 2.3 GB was exfiltrated.

**Would the breach have occurred with only Chain 2 (detection gaps) but no access?**
No — without the stolen SSH key and plaintext credential, the attacker had no entry.

**Conclusion:** AND-causation confirmed. Both chains must be resolved. Fixing only access controls leaves the detection blind spots. Fixing only detection leaves the access vulnerabilities.

---

#### Chain 1 Root Causes (Access)

**Why A2: Why did the phishing attack succeed?**

Evidence (PRE-investigation, Tier 1):
- The company does not enforce MFA on SSH key authentication to `bastion-01`
- SSH key-based auth bypasses the SSO/MFA stack entirely
- The phishing page harvested the raw private key — once obtained, no second factor was required

**Why A3: Why could the stolen SSH key access the database?**

Evidence (PRE-investigation, Tier 1):
- `bastion-01` has network access to the `data` subnet (firewall rule `allow bastion → data:5432`)
- The `svc-etl-prod` password was in plaintext in the Git repo, accessible to anyone who reached the bastion and cloned the repo
- `svc-etl-prod` has unrestricted `SELECT` privileges on all tables — no column-level or row-level restrictions

**ROOT CAUSE 1: No MFA on SSH bastion access**

The bastion host accepts SSH key authentication without a second factor. A stolen SSH key is sufficient for full access.

```
Depth Criteria Check:
  [x] Actionability — MFA can be enforced on bastion SSH (e.g., SSH certificates
      with short-lived tokens, or FIDO2 hardware keys)
  [x] Counterfactual Clarity — If MFA had been required, the stolen SSH key alone
      would not have granted access. The phishing attack would have failed at the
      authentication step.
  [x] System Boundary — Inside the company's control. This is an infrastructure
      configuration decision.
  [x] Diminishing Returns — Going one Why deeper ("Why was MFA not implemented?")
      yields "it was never prioritized" — which does not change the action (implement
      MFA). The response is the same regardless.
```

All four tests pass. This is a confirmed root cause.

---

**ROOT CAUSE 2: Plaintext database credential in source control**

The `svc-etl-prod` password was committed to the `etl-pipeline` GitLab repository in a `.env` file and never rotated or removed from git history.

```
Depth Criteria Check:
  [x] Actionability — Rotate the credential immediately. Implement secrets management
      (Vault, AWS Secrets Manager). Add pre-commit hooks to block credential commits.
      Rewrite git history to remove the plaintext credential.
  [x] Counterfactual Clarity — If the credential had not been in the repo, the attacker
      would have had bastion access but no database credential. The breach would not
      have occurred in this form.
  [x] System Boundary — Inside the company's control. This is a development practice
      and tooling decision.
  [x] Diminishing Returns — Going deeper ("Why was the credential committed?") yields
      "no secrets scanning in CI/CD" — but this is already captured in the fix. The
      action does not change.
```

All four tests pass. This is a confirmed root cause.

---

**ROOT CAUSE 3: Overprivileged service account**

`svc-etl-prod` has unrestricted `SELECT` on all tables, including PII tables it does not need for the ETL pipeline. The ETL job only reads from `events` and `metrics` tables.

```
Depth Criteria Check:
  [x] Actionability — Restrict `svc-etl-prod` to only the tables and columns required
      for its function. Implement least-privilege access controls.
  [x] Counterfactual Clarity — If the service account could only SELECT from `events`
      and `metrics`, the attacker would have accessed those tables but NOT the `users`
      or `billing` PII tables. The PII exfiltration would not have occurred.
  [x] System Boundary — Inside the company's control.
  [x] Diminishing Returns — Going deeper does not change the action.
```

All four tests pass. This is a confirmed root cause.

---

#### Chain 2 Root Causes (Detection)

**Why B1: Why was the exfiltration not detected for 47 minutes?**

Evidence (PRE-investigation, Tier 1):
- The SIEM alert rule for anomalous outbound traffic uses a 30-minute rolling window with a 2 GB threshold. The transfer reached 2 GB at approximately 3:10 AM — the alert fired at 3:15 AM after the window calculation completed.
- No separate alert exists for off-hours database queries
- No DLP (Data Loss Prevention) agent is deployed on database egress paths

**ROOT CAUSE 4: No real-time anomaly detection on database query patterns**

The monitoring stack has no rule for "service account querying PII tables outside its normal schedule" or "full table scan on sensitive tables." The SIEM only monitors network volume, not query semantics.

```
Depth Criteria Check:
  [x] Actionability — Deploy database activity monitoring (DAM) with rules for:
      off-hours access to PII tables, full table scans, access from service accounts
      outside their scheduled windows.
  [x] Counterfactual Clarity — If DAM had flagged the 2:31 AM query on `users`,
      the SOC would have been alerted 44 minutes earlier. At minimum, the exfiltration
      volume would have been drastically reduced.
  [x] System Boundary — Inside the company's control.
  [x] Diminishing Returns — Going deeper does not change the action.
```

All four tests pass. This is a confirmed root cause.

---

### Adversarial Evidence Assessment

**[EVIDENCE]** **[CAUSAL]** Per **[proofs/00_index.md](../proofs/00_index.md)**: "In security, fraud, and legal investigations, evidence may be fabricated, hidden, or manipulated. The convergence proof assumes truthful evidence; adversarial contexts can cause convergence on a false cause planted by the adversary."

The investigation must consider whether the attacker planted false trails:

```
ADVERSARIAL EVIDENCE CHECK:

1. Was the phishing email a decoy?
   Could the attacker have used a different entry vector and planted
   the phishing evidence to misdirect?

   Assessment: The DNS query log is Tier 1 automated evidence captured
   before any party knew about the breach. The phishing domain registration
   predates the breach by 9 days. The temporal sequence (phish → DNS query
   → breach) is consistent. An attacker would need to compromise the DNS
   logging infrastructure itself to plant this — possible but requires
   significantly more sophistication than the observed attack.

   Conclusion: LOW probability of planted evidence. The phishing vector
   is genuine with high confidence.

2. Was the exfiltration destination (198.51.100.47) a relay or decoy?
   The attacker may have used this VPS as a relay, with the true
   destination elsewhere.

   Assessment: This affects attribution (who is the attacker) but does
   not affect root cause identification (how they got in and why detection
   failed). The root causes are the same regardless of the attacker's
   identity or final data destination.

   Conclusion: Relevant for law enforcement, not for this investigation's
   root cause analysis.

3. Were logs tampered with to hide additional access?
   The attacker had bastion access — could they have modified logs?

   Assessment: Database audit logs on db-prod-03 are shipped to a
   separate log aggregator in real time. The bastion's SSH logs are
   similarly forwarded. The attacker would need to compromise both
   the primary systems AND the log aggregator to erase traces.
   Pre-investigation forensic images were hashed — any tampering
   after the fact is detectable.

   Conclusion: Log integrity is HIGH for the observed events. However,
   we cannot rule out PRIOR access that was more carefully concealed.
   Recommend: full audit of bastion and database access logs for the
   past 90 days.
```

**[BIAS]** Note: the adversarial evidence check itself is vulnerable to a meta-bias — spending so much time questioning evidence that the investigation stalls. The check above is bounded: three specific questions, each with a concrete assessment. Do not spiral into unbounded adversarial paranoia.

---

### Complete Why Tree

```
Why: PII exfiltrated from db-prod-03
  │
  ├──► CHAIN 1 (ACCESS): How did the attacker get in?
  │      │
  │      ├──► Phishing email → J. Park's SSH key stolen         P = 0.78
  │      │      Evidence: DNS logs, email gateway (Tier 1, PRE)
  │      │      Status: [x] Finding
  │      │      │
  │      │      └──► No MFA on bastion SSH                      P = 0.93
  │      │             Evidence: Auth config, access logs (Tier 1, PRE)
  │      │             Status: [x] Finding
  │      │             └──► ROOT CAUSE 1: No MFA on bastion
  │      │
  │      ├──► Plaintext credential in Git repo                  P = 0.95
  │      │      Evidence: Git history (Tier 1, PRE)
  │      │      Status: [x] Finding
  │      │      └──► ROOT CAUSE 2: Credential in source control
  │      │
  │      └──► Overprivileged service account                    P = 0.95
  │             Evidence: PostgreSQL role grants (Tier 1, PRE)
  │             Status: [x] Finding
  │             └──► ROOT CAUSE 3: Excessive DB privileges
  │
  └──► CHAIN 2 (DETECTION): Why was it not stopped?
         │
         └──► No query-level monitoring on PII tables           P = 0.92
                Evidence: SIEM rule config, DAM absence (Tier 1, PRE)
                Status: [x] Finding
                └──► ROOT CAUSE 4: No database activity monitoring

PRUNED BRANCHES:
  Branch D (misconfiguration only) — P = 0.005, pruned: targeted attack pattern
  Branch E (false positive) — P = 0.001, pruned: no scheduled job, external dest
  Branch B (insider) — P = 0.05, retained but subordinate: evidence explained
    by external phishing without requiring insider intent
  Branch A1b (key in repo) — P = 0.01, retained at threshold: SSH key not found
    in any repo scan

CONVERGENT NODES:
  Branches A1a (phishing) and A1c (compromised device) converge — the phishing
  page was the device compromise mechanism.

FEEDBACK LOOPS: [x] Yes
  ROOT CAUSE 3 (overprivileged account) amplifies the impact of ROOT CAUSE 1
  (no MFA) — even if MFA is bypassed in the future, least-privilege limits blast
  radius. These interact as defense-in-depth layers.

ROOT CAUSE INTERACTION:
  [x] AND-causation — Chain 1 AND Chain 2 were both necessary.
      Fixing either chain alone would have prevented THIS breach.
      Fixing both is required to prevent the class of breach.
```

**[INFO]** Total entropy reduction across the investigation: the initial state had 5 equiprobable-ish branches (H ≈ 2.1 bits). The final state has 4 confirmed root causes with high confidence (H ≈ 0.3 bits). Each piece of Tier 1 evidence produced a measurable entropy drop, with the DNS log evidence producing the single largest information gain (eliminating insider threat as the primary hypothesis).

---

## Layer 3 — Resolution

### ROOT CAUSE 1: No MFA on bastion SSH access

```
Type: [x] Fix
Must Change: Enforce MFA on all SSH access to bastion-01. Deploy SSH certificate
  authority with short-lived certificates (max 8 hours). Require FIDO2 hardware
  key as second factor. Decommission long-lived SSH keys.
Owner: Platform Engineering Lead
By When: 72 hours (emergency change — active threat)
Counterfactual: "If MFA had existed, would the breach have occurred?"
  → No. The stolen SSH key would have been insufficient. The attacker would have
    been stopped at authentication. → Fix is correctly targeted.
```

### ROOT CAUSE 2: Plaintext credential in source control

```
Type: [x] Fix
Must Change: (1) Rotate svc-etl-prod credential immediately. (2) Deploy secrets
  manager (Vault) for all service credentials. (3) Add pre-commit hook and CI
  scanner to block credential patterns. (4) Rewrite etl-pipeline git history to
  remove the .env file.
Owner: Security Engineering + DevOps
By When: Credential rotation — immediate (done during incident). Secrets manager —
  14 days. Pre-commit hooks — 7 days. Git history rewrite — 7 days.
Counterfactual: "If the credential had not been in the repo, would the breach
  have occurred?"
  → No. Bastion access alone does not yield database access without the credential.
  → Fix is correctly targeted.
```

### ROOT CAUSE 3: Overprivileged service account

```
Type: [x] Fix
Must Change: Restrict svc-etl-prod to SELECT on `events` and `metrics` tables only.
  Create separate service accounts per pipeline function with minimal required
  privileges. Implement quarterly access reviews for all service accounts.
Owner: Database Administration + Security Engineering
By When: Privilege restriction — 48 hours. Per-function accounts — 30 days.
  Quarterly review process — 45 days.
Counterfactual: "If the service account had least-privilege access, would PII
  have been exfiltrated?"
  → No. The attacker would have accessed only non-PII operational tables.
  → Fix is correctly targeted.
```

### ROOT CAUSE 4: No database activity monitoring

```
Type: [x] Fix
Must Change: Deploy database activity monitoring (DAM) with alert rules for:
  (a) any access to PII-tagged tables outside business hours, (b) full table
  scans on any table with PII classification, (c) service account access outside
  scheduled job windows, (d) any SELECT query returning >10,000 rows from PII tables.
Owner: Security Operations + Database Administration
By When: DAM deployment — 21 days. Alert rules — 28 days. Integration with
  incident response playbook — 35 days.
Counterfactual: "If DAM had been in place, would the exfiltration have succeeded?"
  → Partially. The attacker would still have accessed the data, but the alert at
    2:31 AM (instead of 3:15 AM) would have reduced exfiltration from 2.3 GB to
    near zero if response was immediate. This is a Fix for the detection gap —
    the access gap is addressed by Root Causes 1-3.
```

### Root Cause Interactions

```
[x] AND-causation: Chain 1 (access: RC 1+2+3) AND Chain 2 (detection: RC 4)
    were both necessary for the full breach impact.

    Fixing Chain 1 alone: prevents this attack vector but leaves blind spots
    for future vectors.
    Fixing Chain 2 alone: detects the attack faster but does not prevent access.
    Fixing both: defense in depth — prevents the access AND detects anomalies.

[x] Amplification: RC 3 (overprivileged account) amplifies the impact of any
    access compromise. Even if a future attacker bypasses MFA, least-privilege
    limits the blast radius to non-PII data.
```

### Priority Order

```
Impact × Recurrence × Actionability (scale 1–5):

RC 2: Plaintext credential    5 × 5 × 5 = 125  → Act first (immediate rotation)
RC 1: No MFA on bastion       5 × 4 × 4 =  80  → Act first (72-hour window)
RC 3: Overprivileged account   5 × 4 × 4 =  80  → Act first (48-hour restriction)
RC 4: No DAM                   4 × 4 × 3 =  48  → Plan and schedule (21-day deploy)

Note: RC 1 and RC 3 score identically (within ~0% of each other). Treat as
equal priority. RC 2 is the most urgent because the plaintext credential is
an active, exploitable vulnerability right now.
```

---

## Layer 4 — Verification and Learning

### Verification

```
Verification window: Event-driven — wait for the next occurrence of the
  triggering condition (phishing attempt + credential use). Additionally:
  - Red team exercise simulating the same attack chain within 60 days
  - Continuous monitoring of bastion auth logs for anomalous patterns

Each root cause fix confirmed:
  [ ] RC 1: MFA enforced — verify by attempting SSH with key-only auth (should fail)
  [ ] RC 2: Credential rotated + secrets manager deployed — verify by checking
      for any remaining plaintext credentials via automated scan
  [ ] RC 3: Privileges restricted — verify by running SELECT on `users` table
      as svc-etl-prod (should return permission denied)
  [ ] RC 4: DAM deployed — verify by running a test query matching alert rules
      outside business hours (should trigger alert within 60 seconds)

Any recurrence? [ ] Yes → return to Layer 2   [ ] No → proceed
```

### Learning

```
[x] Were the base rates used at the start accurate?
    The initial prior for external attack (0.45) was close to the actual cause.
    The prior for insider threat (0.20) was too high for this environment —
    update to 0.10 for future investigations given the company's access control
    maturity level.
    → UPDATE PRIORS for next security investigation.

[x] Which branches were followed and later pruned?
    Misconfiguration-only and false positive were pruned early with strong
    evidence. Insider threat persisted longer than it should have — the
    attribution bias toward J. Park delayed pruning.
    → LESSON: In credential-based breaches, always check for credential theft
      before investigating the credential owner.

[x] What was the first hypothesis — and was it correct?
    First hypothesis (by SOC analyst): "data exfiltration by external attacker."
    This was correct at the category level but did not identify the vector.
    No anchoring bias detected — the hypothesis was broad enough to allow
    branching.

[x] Were there any surprises?
    SURPRISE 1: The plaintext credential had been in the Git repo for 18 months.
    The breach could have happened at any point during that window. The company
    may have been breached before without detection.
    → ACTION: Forensic review of the past 18 months of db-prod-03 access logs.

    SURPRISE 2: The 47-minute detection delay was structural, not operational.
    The SOC analyst responded within 7 minutes of the alert — the delay was in
    the SIEM rule design (30-minute rolling window + 2 GB threshold).
    → ACTION: Review all SIEM rules for similar structural delays.

    SURPRISE 3: The temporal firewall caught a discrepancy — J. Park's
    post-investigation testimony contradicted pre-investigation DNS evidence.
    Without the firewall, the investigation might have accepted the testimony
    and missed the phishing vector entirely.
    → LESSON: Always apply the temporal firewall in security investigations.
      Human testimony after breach announcement is systematically unreliable.
```

---

## Summary of Mathematical Foundations Applied

| Foundation | Where Applied |
|---|---|
| **[GRAPH]** Graph theory | Who-map as directed graph; convergence of Branches A1a and A1c; AND-causation between Chain 1 and Chain 2 |
| **[EXP]** Exponential space | Initial enumeration of 5 attack categories, each branching further; pruning at θ = 0.01 to manage combinatorial explosion |
| **[CAUSAL]** Causal inference | Counterfactual tests on every root cause and proposed fix; AND-causation identification; attribution bias counterfactual ("if J. Park did not exist") |
| **[INFO]** Information theory | Entropy reduction tracked across investigation; DNS log evidence as highest information-gain single observation; 47-minute detection delay as information latency |
| **[BAYES]** Bayesian reasoning | Priors set from DBIR base rates; three explicit updates as Tier 1 evidence arrived; probability tracking on every branch |
| **[SEARCH]** Search algorithm | BFS strategy enforced at every depth level; all siblings evaluated before descending; justified by safety-critical stakes |
| **[BIAS]** Cognitive biases | Attribution bias callout on J. Park; temporal firewall catching testimony/evidence discrepancy; bounded adversarial paranoia check |
| **[EVIDENCE]** Evidence evaluation | Temporal firewall protocol; 4-tier classification on every piece of evidence; PRE vs POST separation; adversarial evidence assessment; conflicting evidence protocol on testimony vs DNS logs |

---

<p align="center"><strong><a href="02_medical_diagnosis.md">← Previous</a></strong> · <strong><a href="04_business_bottleneck.md">Next →</a></strong></p>
