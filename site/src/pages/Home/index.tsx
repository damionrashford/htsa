import { Hero } from "./sections/Hero";
import { CoreInsight } from "./sections/CoreInsight";
import { LayersSection } from "./sections/LayersSection";
import { WorksEverywhere } from "./sections/WorksEverywhere";
import { MathTeaser } from "./sections/MathTeaser";
import { EngineCTA } from "./sections/EngineCTA";

export default function Home() {
  return (
    <div>
      <Hero />
      <CoreInsight />
      <LayersSection />
      <WorksEverywhere />
      <MathTeaser />
      <EngineCTA />
    </div>
  );
}
