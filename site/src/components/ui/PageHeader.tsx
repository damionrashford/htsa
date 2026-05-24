import { Link } from "react-router";
import { fg, fgDim, fgMuted } from "@/lib/tokens";

interface PageHeaderProps {
  label: string;
  title: string;
  description?: string;
  backTo?: string;
}

export function PageHeader({ label, title, description, backTo = "/" }: PageHeaderProps) {
  return (
    <div className="mb-16">
      <Link to={backTo} className="text-sm no-underline mb-6 inline-block" style={{ color: fgDim }}>
        ← Home
      </Link>
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
