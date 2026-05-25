import { alpha } from "@/lib/tokens";

export function LayerConnector({ from, to }: { from: string; to: string }) {
  return (
    <div className="flex flex-col items-center gap-0 py-1">
      <div
        className="w-px h-6"
        style={{ background: `linear-gradient(to bottom, ${alpha(from, 38)}, ${alpha(to, 38)})` }}
      />
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
        <path d="M1 1L5 5L9 1" stroke={to} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      </svg>
    </div>
  );
}
