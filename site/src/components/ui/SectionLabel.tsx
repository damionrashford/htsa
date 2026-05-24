import { fgDim } from "@/lib/tokens";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-mono uppercase tracking-widest" style={{ color: fgDim }}>
      {children}
    </p>
  );
}
