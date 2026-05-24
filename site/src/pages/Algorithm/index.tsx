import { teal, violet, amber, green } from "@/lib/tokens";
import { PageHeader } from "@/components/ui/PageHeader";
import { LayerConnector } from "./components/LayerConnector";
import { SituationMap } from "./sections/SituationMap";
import { CausalChain } from "./sections/CausalChain";
import { Resolution } from "./sections/Resolution";
import { Verification } from "./sections/Verification";
import { AlgorithmRules } from "./sections/AlgorithmRules";
import { ProofsCTA } from "./sections/ProofsCTA";

export default function Algorithm() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <PageHeader
        label="The Four Layers"
        title="The HTSA Algorithm"
        description="A formal procedure with defined inputs, outputs, and termination guarantees. Not a template — an algorithm."
      />

      <div className="space-y-6 mb-24">
        <SituationMap />
        <LayerConnector from={teal} to={violet} />
        <CausalChain />
        <LayerConnector from={violet} to={amber} />
        <Resolution />
        <LayerConnector from={amber} to={green} />
        <Verification />
      </div>

      <AlgorithmRules />
      <ProofsCTA />
    </div>
  );
}
