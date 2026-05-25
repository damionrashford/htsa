import { useTheme, type Theme } from "@/lib/ThemeContext";
import { teal, border, fgDim, fgMuted, alpha } from "@/lib/tokens";

const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: "light",
    label: "Light",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
  },
  {
    value: "system",
    label: "System",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Color theme"
      className="flex items-center rounded-lg p-0.5"
      style={{
        border: `1px solid ${border}`,
        backgroundColor: alpha(border, 30),
      }}
    >
      {options.map(({ value, label, icon }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            aria-label={`${label} theme`}
            aria-pressed={isActive}
            title={`Switch to ${label.toLowerCase()} theme`}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-mono"
            style={{
              color: isActive ? teal : fgDim,
              backgroundColor: isActive ? alpha(teal, 12) : "transparent",
              border: isActive ? `1px solid ${alpha(teal, 30)}` : "1px solid transparent",
              transition: "color 150ms cubic-bezier(0.16,1,0.3,1), background-color 150ms cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.color = fgMuted;
                e.currentTarget.style.backgroundColor = alpha(border, 40);
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.color = fgDim;
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
