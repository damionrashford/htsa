<h1 align="center">Panayiotou & Simsek (2026) — Chain-Reaction Causal Discovery</h1>

**Citation:** Panayiotou, T., Simsek, O. (2026). *Efficient Causal Discovery in Chain-Reaction Systems.* arxiv:2603.22620  
**Primary gap:** [gap_expand_principled](gap_expand_principled.md)

---

## Three Results Most Relevant to HTSA

**1. Chain-Reaction Structure Is Common in Engineering Incidents:**  
Many engineering failures propagate through a linear causal chain: a root cause triggers a service failure, which cascades to a dependent service, which produces the observable incident. Panayiotou and Simsek prove that in chain-structured systems, bisection search (probe the midpoint of the chain) achieves O(log n) causal discovery regardless of chain length. This is substantially better than the O(n) worst-case of unguided best-first search in a linear chain.

**2. Bisection Is Optimal When Chain Structure Is Known:**  
For a chain of n potential root causes ordered by causal distance from the outcome, the optimal probing strategy is binary search: test the midpoint first, then the midpoint of the confirmed half. This is provably optimal under the information-theoretic lower bound for causal discovery in chain structures. The intuition maps directly to HTSA: in a linear causal chain, the best next Why question is the one at the midpoint of the unresolved portion of the chain.

**3. Chain Structure Detection From Topology:**  
The paper provides conditions under which a system is chain-structured: each node has at most one parent in the causal direction, and no node has more than one child that could independently cause the outcome. In HTSA terms: a simple causal chain (as opposed to a convergent DAG with OR/AND nodes) is detectable from the graph topology, and when detected, bisection should replace probability-ordered best-first search.

---

## HTSA Files Affected

- `math/10_intervention_theory.md` — chain-reaction bisection section
- `engine/htsa_engine/analysis/search.py` — potential future bisection search variant

---

## Cross-links

- [gap_expand_principled](gap_expand_principled.md) — primary gap
- [paper_zhang2022](paper_zhang2022.md) — general interventional IG approach; chain bisection is a specialization
