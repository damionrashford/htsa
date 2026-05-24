"""Tests for PNSCalculator — Pearl & Tian (2000)."""

import math

from ..causation.pns import ExperimentalData, ObservationalData, PNSCalculator
from ..core.models_causation import PNSScore


class TestPNSBounds:
    def test_bounds_hold_for_experimental(self):
        calc = PNSCalculator("n1")
        data = ExperimentalData(p_e_do_c1=0.8, p_e_do_c0=0.1, p_c1=0.4, p_e=0.4, sample_size=100)
        score = calc.from_experimental(data)
        assert score.validate_pns_bounds(), (
            f"PNS={score.pns:.3f} outside [{score.pns_lower_bound:.3f}, {score.pns_upper_bound:.3f}]"
        )

    def test_bounds_hold_for_subjective(self):
        calc = PNSCalculator("n2")
        score = calc.from_subjective(pn=0.8, ps=0.7)
        assert score.validate_pns_bounds()

    def test_pns_lower_bound(self):
        score = PNSScore(node_id="n", pn=0.4, ps=0.3, pns=0.0)
        assert score.pns_lower_bound == 0.0  # max(0, 0.4+0.3-1) = 0

    def test_pns_upper_bound(self):
        score = PNSScore(node_id="n", pn=0.8, ps=0.6, pns=0.5)
        assert score.pns_upper_bound == 0.6  # min(0.8, 0.6)

    def test_pns_must_be_in_bounds(self):
        score = PNSScore(node_id="n", pn=0.9, ps=0.8, pns=0.9)
        # 0.9 > min(0.9, 0.8) = 0.8 → invalid
        assert not score.validate_pns_bounds()


class TestCausationTypes:
    def test_single_root_cause(self):
        calc = PNSCalculator("n")
        data = ExperimentalData(p_e_do_c1=0.9, p_e_do_c0=0.1, p_c1=0.5, p_e=0.5)
        score = calc.from_experimental(data)
        assert score.causation_type == "single_root_cause"

    def test_contributing_factor_low_pns(self):
        score = PNSScore(node_id="n", pn=0.2, ps=0.3, pns=0.1)
        assert score.causation_type == "contributing_factor"

    def test_and_node_high_pn_low_ps(self):
        score = PNSScore(node_id="n", pn=0.8, ps=0.4, pns=0.3)
        assert score.causation_type == "and_node"

    def test_or_node_low_pn_high_ps(self):
        score = PNSScore(node_id="n", pn=0.4, ps=0.8, pns=0.3)
        assert score.causation_type == "or_node"


class TestPNSFromSubjective:
    def test_pns_is_geometric_mean_of_bounds(self):
        calc = PNSCalculator("n")
        score = calc.from_subjective(pn=0.8, ps=0.7)
        lower = max(0.0, 0.8 + 0.7 - 1.0)  # 0.5
        upper = min(0.8, 0.7)               # 0.7
        expected = math.sqrt(lower * upper)
        assert abs(score.pns - expected) < 1e-6

    def test_sample_size_zero_for_subjective(self):
        calc = PNSCalculator("n")
        score = calc.from_subjective(pn=0.5, ps=0.5)
        assert score.sample_size == 0
        assert score.monotonicity_assumed is True

    def test_clamp_out_of_range_inputs(self):
        calc = PNSCalculator("n")
        score = calc.from_subjective(pn=1.5, ps=-0.1)
        assert 0.0 <= score.pn <= 1.0
        assert 0.0 <= score.ps <= 1.0


class TestPNSValidation:
    def test_validate_warns_high_pns_no_data(self):
        calc = PNSCalculator("n")
        score = calc.from_subjective(pn=0.95, ps=0.95)
        warnings = PNSCalculator.validate(score)
        assert any("subjective" in w for w in warnings)

    def test_validate_no_warnings_for_experimental(self):
        calc = PNSCalculator("n")
        data = ExperimentalData(p_e_do_c1=0.8, p_e_do_c0=0.1, p_c1=0.4, p_e=0.4, sample_size=200)
        score = calc.from_experimental(data)
        warnings = PNSCalculator.validate(score)
        assert warnings == []
