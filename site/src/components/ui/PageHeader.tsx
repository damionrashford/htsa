import { teal, violet, fg, fgDim, fgMuted, alpha } from "@/lib/tokens";

interface PageHeaderProps {
  label: string;
  title: string;
  description?: string;
  accent?: string;
}

export function PageHeader({ label, title, description, accent = teal }: PageHeaderProps) {
  return (
    <div className="mb-16 pb-10 border-b" style={{ borderColor: alpha(accent, 15) }}>
      {/* Label */}
      <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>
        {label}
      </p>

      {/* Accent bar */}
      <div
        className="w-10 h-0.5 rounded-full mb-5"
        style={{ background: `linear-gradient(to right, ${accent}, ${violet})` }}
      />

      {/* Title */}
      <h1
        className="text-4xl sm:text-5xl font-bold leading-[1.08] tracking-tight"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: fg }}
      >
        {title}
      </h1>

      {description && (
        <p className="mt-4 text-lg max-w-2xl leading-relaxed" style={{ color: fgMuted }}>
          {description}
        </p>
      )}
    </div>
  );
}
