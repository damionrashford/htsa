import { teal, alpha } from "@/lib/tokens";

interface TagProps {
  children: React.ReactNode;
  color?: string;
}

export function Tag({ children, color = teal }: TagProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-1 rounded-full border whitespace-nowrap"
      style={{ borderColor: alpha(color, 25), color, backgroundColor: alpha(color, 6) }}
    >
      {children}
    </span>
  );
}
