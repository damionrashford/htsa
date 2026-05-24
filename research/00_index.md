<h1 align="center">Research Index</h1>

> This folder documents the academic literature that drove HTSA v2. Every change in v2 traces to a specific paper and a specific gap. Papers and gaps are cross-linked.

---

## Gap Status

| Gap | Description | Status | Closed by Phase |
|---|---|:---:|---|
| [gap_causation_formalism](gap_causation_formalism.md) | Binary counterfactual replaced by HP2015/NESS | closed | 4, 7 |
| [gap_causal_entropy](gap_causal_entropy.md) | Observational IG ≠ causal IG when confounders present | closed | 1A |
| [gap_expand_principled](gap_expand_principled.md) | EXPAND question ordering had no formal basis | closed | 5B |
| [gap_quantitative_causation](gap_quantitative_causation.md) | No quantitative causation measure (PNS, normality) | closed | 3, 4 |
| [gap_convergence_rate](gap_convergence_rate.md) | Convergence proven but rate formula not exposed | closed | 1C, 5A |

---

## Paper Index

| File | Author(s) | Year | arxiv | Gap addressed |
|---|---|:---:|---|---|
| [paper_simoes2024](paper_simoes2024.md) | Simoes, Janzing, Schölkopf | 2024 | 2402.01341 | gap_causal_entropy |
| [paper_halpern2015](paper_halpern2015.md) | Halpern | 2015 | 1505.00162 | gap_causation_formalism |
| [paper_beckers2021](paper_beckers2021.md) | Beckers | 2021 | 2102.02311 | gap_causation_formalism |
| [paper_beckers2025](paper_beckers2025.md) | Beckers | 2025 | 2503.07849 | gap_causation_formalism (scope) |
| [paper_zhang2022](paper_zhang2022.md) | Zhang et al. | 2022 | 2209.04744 | gap_expand_principled |
| [paper_von_kuelgelgen2019](paper_von_kuelgelgen2019.md) | von Kügelgen et al. | 2019 | 1910.03962 | gap_expand_principled |
| [paper_li2022](paper_li2022.md) | Li et al. | 2022 | 2206.05871 | gap_quantitative_causation |
| [paper_halpern_hitchcock2013](paper_halpern_hitchcock2013.md) | Halpern & Hitchcock | 2013 | 1309.1226 | gap_quantitative_causation |
| [paper_albantakis2017](paper_albantakis2017.md) | Albantakis et al. | 2017 | 1708.06716 | gap_quantitative_causation |
| [paper_ji2024](paper_ji2024.md) | Ji et al. | 2024 | 2403.08079 | gap_convergence_rate |
| [paper_panayiotou2026](paper_panayiotou2026.md) | Panayiotou & Simsek | 2026 | 2603.22620 | gap_expand_principled |
| [paper_kim2026](paper_kim2026.md) | Kim et al. | 2026 | 2602.09937 | LLM guard rails (Phase 6) |

---

## How to Add a New Paper

1. Create `research/paper_<lastname><year>.md` using the template in any existing paper file.
2. Identify which gap the paper addresses. If it reveals a new gap, create `research/gap_<topic>.md`.
3. Add a row to the Paper Index table and the Gap Status table above.
4. In the paper file, link to the relevant gap file under "HTSA files affected."
5. In the gap file, add a cross-link to the new paper under "Literature."
6. If the paper drives an engine or doc change, reference the relevant Phase in the gap file.

---

<p align="center"><strong><a href="../math/00_index.md">Math</a></strong> · <strong><a href="../proofs/00_index.md">Proofs</a></strong> · <strong><a href="../FRAMEWORK.md">Framework</a></strong></p>
