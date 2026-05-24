"""
Shared test fixtures — graph structures for causation tests.

Three standard fixtures from math/09 causation theory:

  simple_chain:       n1 (surface) -> n2 (mid) -> n3 (root cause)
  overdetermination:  e (outcome)  -> a AND b (both sufficient independently)
  preemption:         e (outcome)  -> a (acted first, b would have acted later)
                      a -> preempted_b (link shows b was available but preempted)
"""

from __future__ import annotations

from dataclasses import dataclass

from ..core import InvestigationGraph, Node


@dataclass
class SimpleChainFixture:
    graph: InvestigationGraph
    origin_id: str    # surface problem
    mid_id: str       # intermediate cause
    leaf_id: str      # root cause (deepest)


@dataclass
class OverdeterminationFixture:
    graph: InvestigationGraph
    outcome_id: str   # the effect
    cause_a_id: str   # first independent sufficient cause
    cause_b_id: str   # second independent sufficient cause


@dataclass
class PreemptionFixture:
    graph: InvestigationGraph
    outcome_id: str       # the effect
    preempting_id: str    # cause that acted first (Billy)
    preempted_id: str     # cause that would have acted (Suzy, preempted)


def simple_chain() -> SimpleChainFixture:
    """Linear chain: surface -> intermediate -> root cause."""
    g = InvestigationGraph()
    n1 = Node("Alert fired", probability=1.0)
    g.add_node(n1)
    n2 = Node("Config was invalid", probability=0.7)
    g.add_node(n2, parent_id=n1.id)
    n3 = Node("No validation step in deploy pipeline", probability=0.8)
    g.add_node(n3, parent_id=n2.id)
    return SimpleChainFixture(graph=g, origin_id=n1.id, mid_id=n2.id, leaf_id=n3.id)


def overdetermination() -> OverdeterminationFixture:
    """
    Symmetric overdetermination: two independent sufficient causes.

    Both A and B independently cause E (OR-node).
    Stage 1 fails for each (the other would have caused E anyway).
    HP2015 with W-partition handles this correctly.
    """
    g = InvestigationGraph()
    e = Node("Database unavailable", probability=1.0)
    g.add_node(e)
    a = Node("Primary node crashed", probability=0.5)
    g.add_node(a, parent_id=e.id)
    b = Node("Replica also failed simultaneously", probability=0.5)
    g.add_node(b, parent_id=e.id)
    return OverdeterminationFixture(graph=g, outcome_id=e.id, cause_a_id=a.id, cause_b_id=b.id)


def preemption() -> PreemptionFixture:
    """
    Late preemption: preempting cause acts before backup cause can.

    E.g.: Alerting silenced by expired schedule (preempting) acted first.
    PagerDuty escalation (preempted) would have fired 30 minutes later.
    The preempting cause IS the root cause.
    """
    g = InvestigationGraph()
    e = Node("On-call engineer not notified", probability=1.0)
    g.add_node(e)
    preempting = Node("On-call schedule expired, silenced alert routing", probability=0.8)
    g.add_node(preempting, parent_id=e.id)
    preempted = Node("PagerDuty escalation would have fired (30m later)", probability=0.3)
    g.add_node(preempted, parent_id=e.id)
    return PreemptionFixture(
        graph=g,
        outcome_id=e.id,
        preempting_id=preempting.id,
        preempted_id=preempted.id,
    )
