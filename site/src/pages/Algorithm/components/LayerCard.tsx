import { card, fg } from "@/lib/tokens";

interface LayerCardProps {
  num: string;
  title: string;
  color: string;
  children: React.ReactNode;
}

export function LayerCard({ num, title, color, children }: LayerCardProps) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${color}40` }}>
      <div
        className="px-6 py-4 border-b flex items-center gap-4"
        style={{ backgroundColor: `${color}0d`, borderColor: `${color}30` }}
      >
        <span className="font-mono text-sm font-bold" style={{ color }}>{num}</span>
        <span
          className="text-lg font-semibold"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: fg }}
        >
          {title}
        </span>
      </div>
      <div className="p-6" style={{ backgroundColor: card }}>
        {children}
      </div>
    </div>
  );
}
