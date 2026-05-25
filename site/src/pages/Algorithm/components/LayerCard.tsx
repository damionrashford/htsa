import { fg, bgAlt, alpha } from "@/lib/tokens";

interface LayerCardProps {
  num: string;
  title: string;
  color: string;
  children: React.ReactNode;
}

export function LayerCard({ num, title, color, children }: LayerCardProps) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: `1px solid ${alpha(color, 21)}`,
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div
        className="px-4 py-3 sm:px-6 sm:py-4 border-b flex items-center gap-3 sm:gap-4"
        style={{
          background: `linear-gradient(to right, ${alpha(color, 6)}, transparent)`,
          borderColor: alpha(color, 15),
        }}
      >
        <span className="font-mono text-xs font-bold tracking-widest" style={{ color }}>{num}</span>
        <span
          className="text-lg font-semibold"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: fg }}
        >
          {title}
        </span>
      </div>
      <div className="p-4 sm:p-6" style={{ backgroundColor: bgAlt }}>
        {children}
      </div>
    </div>
  );
}
