import { teal } from "@/lib/tokens";

interface TagProps {
  children: React.ReactNode;
  color?: string;
}

export function Tag({ children, color = teal }: TagProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-1 rounded-full border"
      style={{ borderColor: `${color}40`, color, backgroundColor: `${color}10` }}
    >
      {children}
    </span>
  );
}
