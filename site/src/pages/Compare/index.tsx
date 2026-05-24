import { PageHeader } from "@/components/ui/PageHeader";
import { ComparisonTable } from "./sections/ComparisonTable";
import { Differentiators } from "./sections/Differentiators";
import { WhenToUse } from "./sections/WhenToUse";

export default function Compare() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <PageHeader
        label="HTSA vs alternatives"
        title="How HTSA differs"
        description="There are two other serious open-source RCA tools: PyRCA (Salesforce) and DoWhy (Microsoft). They solve real problems. They just solve different problems than HTSA."
      />
      <ComparisonTable />
      <Differentiators />
      <WhenToUse />
    </div>
  );
}
