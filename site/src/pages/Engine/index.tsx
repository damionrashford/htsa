import { PageHeader } from "@/components/ui/PageHeader";
import { EngineLayers } from "./sections/EngineLayers";
import { InstallSection } from "./sections/InstallSection";
import { QuickStart } from "./sections/QuickStart";
import { ProvidersSection } from "./sections/ProvidersSection";
import { CausationAPI } from "./sections/CausationAPI";
import { BoundaryTable } from "./sections/BoundaryTable";
import { ModuleList } from "./sections/ModuleList";

export default function Engine() {
  return (
    <div className="max-w-[90rem] mx-auto px-6 py-10 sm:py-16">
      <PageHeader
        label="TypeScript Library · v2.0.0"
        title="HTSA Engine"
        description="The algorithm, codified. A graph-based incident investigation engine implementing the HTSA algorithm. Zero external dependencies. Works with any LLM provider."
      />
      <EngineLayers />
      <InstallSection />
      <QuickStart />
      <ProvidersSection />
      <CausationAPI />
      <BoundaryTable />
      <ModuleList />
    </div>
  );
}
