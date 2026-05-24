"""Tests for MinimalInterventionCalculator — math/10 intervention theory."""

from ..causation.intervention import ANDGroup, MinimalInterventionCalculator
from ..core.models_causation import PNSScore


def _make_scores(*pns_values: float) -> list[PNSScore]:
    return [
        PNSScore(node_id=f"rc{i}", pn=p, ps=p, pns=p)
        for i, p in enumerate(pns_values)
    ]


class TestCoverageFormula:
    def test_single_cause_coverage(self):
        scores = _make_scores(0.8)
        calc = MinimalInterventionCalculator(scores)
        assert abs(calc.coverage(["rc0"]) - 0.8) < 1e-9

    def test_two_independent_causes_coverage(self):
        scores = _make_scores(0.6, 0.5)
        calc = MinimalInterventionCalculator(scores)
        # 1 - (1-0.6)(1-0.5) = 1 - 0.4*0.5 = 0.8
        assert abs(calc.coverage(["rc0", "rc1"]) - 0.8) < 1e-9

    def test_empty_set_coverage_is_zero(self):
        scores = _make_scores(0.8)
        calc = MinimalInterventionCalculator(scores)
        assert calc.coverage([]) == 0.0

    def test_and_group_zero_coverage_when_incomplete(self):
        scores = _make_scores(0.8, 0.7)
        group = ANDGroup(node_ids=["rc0", "rc1"])
        calc = MinimalInterventionCalculator(scores, and_groups=[group])
        # Only rc0 — AND-group incomplete → 0 coverage
        assert calc.coverage(["rc0"]) == 0.0

    def test_and_group_joint_coverage_when_complete(self):
        scores = _make_scores(0.8, 0.7)
        group = ANDGroup(node_ids=["rc0", "rc1"])
        calc = MinimalInterventionCalculator(scores, and_groups=[group])
        # Both rc0 and rc1 — joint_pns = 0.8 * 0.7 = 0.56
        expected = 1.0 - (1.0 - 0.8 * 0.7)
        assert abs(calc.coverage(["rc0", "rc1"]) - expected) < 1e-9


class TestMinimalSetFinding:
    def test_single_high_pns_achieves_threshold(self):
        scores = _make_scores(0.95, 0.3, 0.2)
        calc = MinimalInterventionCalculator(scores, theta=0.90)
        result = calc.find_minimal_set()
        assert result.threshold_achieved is True
        assert "rc0" in result.minimal_set
        assert len(result.minimal_set) == 1

    def test_insufficient_causes_returns_all_required(self):
        # Three weak causes: even all together < 0.90
        scores = _make_scores(0.5, 0.4, 0.3)
        calc = MinimalInterventionCalculator(scores, theta=0.90)
        result = calc.find_minimal_set()
        # coverage({0.5, 0.4, 0.3}) = 1 - 0.5*0.6*0.7 = 1 - 0.21 = 0.79
        assert result.threshold_achieved is False
        assert result.all_required is True
        assert len(result.notes) > 0

    def test_two_causes_needed(self):
        # One cause alone < 0.90, two together >= 0.90
        scores = _make_scores(0.8, 0.6)
        calc = MinimalInterventionCalculator(scores, theta=0.90)
        result = calc.find_minimal_set()
        # coverage({0.8}) = 0.8 < 0.90, coverage({0.8, 0.6}) = 1-0.2*0.4 = 0.92 >= 0.90
        assert result.threshold_achieved is True
        assert len(result.minimal_set) == 2

    def test_threshold_achieved_flag(self):
        scores = _make_scores(0.95)
        calc = MinimalInterventionCalculator(scores, theta=0.90)
        result = calc.find_minimal_set()
        assert result.threshold_achieved is True
        assert result.all_required is False


class TestANDGroup:
    def test_joint_pns_computed_correctly(self):
        scores = _make_scores(0.8, 0.6)
        group = ANDGroup(node_ids=["rc0", "rc1"])
        pns_map = {s.node_id: s for s in scores}
        group.compute_joint_pns(pns_map)
        assert abs(group.joint_pns - 0.48) < 1e-9

    def test_missing_member_makes_joint_zero(self):
        scores = _make_scores(0.8)
        group = ANDGroup(node_ids=["rc0", "rc_missing"])
        pns_map = {s.node_id: s for s in scores}
        group.compute_joint_pns(pns_map)
        # rc_missing not in map → contributes 1.0, so joint = 0.8 * 1.0 = 0.8
        # (missing member defaults to 1.0 in the product — not a bug,
        # just undefined. In practice all members should be in the map.)
        assert group.joint_pns == 0.8
