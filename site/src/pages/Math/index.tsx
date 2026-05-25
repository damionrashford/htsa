import { PageHeader } from "@/components/ui/PageHeader";
import { MathStack } from "./sections/MathStack";
import { FoundationsGrid } from "./sections/FoundationsGrid";
import { ResearchCTA } from "./sections/ResearchCTA";

export default function MathPage() {
  return (
    <div className="max-w-[90rem] mx-auto px-6 py-10 sm:py-16">
      <PageHeader
        label="Mathematical Foundations"
        title="The math, made visible."
        description="The math is always running underneath. These ten concepts explain how the framework works — and why it works."
      />
      <MathStack />
      <FoundationsGrid />
      <ResearchCTA />
    </div>
  );
}
