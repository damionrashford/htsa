import { fg, fgDim, fgMuted } from "@/lib/tokens";

interface PageHeaderProps {
  label: string;
  title: string;
  description?: string;
}

export function PageHeader({ label, title, description }: PageHeaderProps) {
  return (
    <div className="mb-16">
      <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: fgDim }}>
        {label}
      </p>
      <h1
        className="text-4xl sm:text-5xl font-bold"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: fg }}
      >
        {title}
      </h1>
      {description && (
        <p className="mt-4 text-lg max-w-2xl" style={{ color: fgMuted }}>
          {description}
        </p>
      )}
    </div>
  );
}
