"""Tests for CounterfactualTester — HP2015 + NESS stack."""

from ..causation.counterfactual import CounterfactualTester
from .fixtures import overdetermination, preemption, simple_chain


class TestSimpleChain:
    def setup_method(self):
        self.f = simple_chain()
        self.tester = CounterfactualTester(self.f.graph)

    def test_leaf_passes_stage1(self):
        r = self.tester.test_stage1(self.f.leaf_id, self.f.origin_id)
        assert r is True

    def test_leaf_passes_hp2015(self):
        r = self.tester.test_hp2015(self.f.leaf_id, self.f.origin_id)
        assert r.stage2_hp2015_ac1 is True
        assert r.stage2_hp2015_ac2 is True
        assert r.stage2_hp2015_ac3 is True
        assert r.stage2_passes is True

    def test_leaf_passes_ness(self):
        r = self.tester.test_ness(self.f.leaf_id, self.f.origin_id)
        assert r.stage3_ness_passes is True

    def test_leaf_classified_as_root_cause(self):
        r = self.tester.test_full_stack(self.f.leaf_id, self.f.origin_id)
        assert r.is_root_cause is True
        assert r.is_contributing_factor is False

    def test_ac1_fails_for_unknown_node(self):
        r = self.tester.test_hp2015("nonexistent", self.f.origin_id)
        assert r.stage2_hp2015_ac1 is False

    def test_ness_fails_when_not_ancestor(self):
        r = self.tester.test_ness(self.f.origin_id, self.f.leaf_id)
        assert r.stage3_ness_passes is False


class TestOverdetermination:
    def setup_method(self):
        self.f = overdetermination()
        self.tester = CounterfactualTester(self.f.graph)

    def test_stage1_fails_for_or_nodes(self):
        # Stage 1 fails — removing A still leaves B as cause
        assert self.tester.test_stage1(self.f.cause_a_id, self.f.outcome_id) is False
        assert self.tester.test_stage1(self.f.cause_b_id, self.f.outcome_id) is False

    def test_hp2015_passes_for_both_or_nodes(self):
        # HP2015 with W-partition: each is an actual cause despite OR
        ra = self.tester.test_hp2015(self.f.cause_a_id, self.f.outcome_id)
        rb = self.tester.test_hp2015(self.f.cause_b_id, self.f.outcome_id)
        assert ra.stage2_passes is True
        assert rb.stage2_passes is True

    def test_or_nodes_classified_as_root_causes(self):
        ra = self.tester.test_full_stack(self.f.cause_a_id, self.f.outcome_id)
        rb = self.tester.test_full_stack(self.f.cause_b_id, self.f.outcome_id)
        assert ra.is_root_cause is True
        assert rb.is_root_cause is True

    def test_w_partition_contains_sibling(self):
        ra = self.tester.test_hp2015(self.f.cause_a_id, self.f.outcome_id)
        assert self.f.cause_b_id in ra.w_partition


class TestPreemption:
    def setup_method(self):
        self.f = preemption()
        self.tester = CounterfactualTester(self.f.graph)

    def test_preempting_cause_passes_hp2015(self):
        r = self.tester.test_hp2015(self.f.preempting_id, self.f.outcome_id)
        assert r.stage2_passes is True

    def test_preempted_cause_passes_hp2015(self):
        # The preempted cause also passes HP2015 — both are in the same graph.
        # Distinguishing temporal preemption requires TimeIndex, not graph topology.
        r = self.tester.test_hp2015(self.f.preempted_id, self.f.outcome_id)
        # With W-partition blocking the other, each passes HP2015
        assert r.stage2_hp2015_ac1 is True


class TestCounterfactualResult:
    def test_classify_sets_root_cause(self):
        from ..causation.counterfactual import CounterfactualResult
        r = CounterfactualResult(node_id="n1")
        r.stage1_passes = True
        r.stage2_hp2015_ac1 = True
        r.stage2_hp2015_ac2 = True
        r.stage2_hp2015_ac3 = True
        r.stage3_ness_passes = True
        r.classify()
        assert r.is_root_cause is True
        assert r.is_contributing_factor is False

    def test_classify_contributing_factor(self):
        from ..causation.counterfactual import CounterfactualResult
        r = CounterfactualResult(node_id="n1")
        r.stage2_hp2015_ac1 = True
        r.stage2_hp2015_ac2 = True
        r.stage2_hp2015_ac3 = True
        r.stage3_ness_passes = False
        r.classify()
        assert r.is_contributing_factor is True
        assert r.is_root_cause is False
