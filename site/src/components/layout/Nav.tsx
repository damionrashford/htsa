import { NavLink } from "react-router";
import { teal, border, fgMuted } from "@/lib/tokens";

const navItems = [
  { to: "/", label: "Home", exact: true },
  { to: "/algorithm", label: "Algorithm" },
  { to: "/math", label: "Math" },
  { to: "/engine", label: "Engine" },
  { to: "/docs", label: "Docs" },
];

export function Nav() {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: "#080d1a99", backdropFilter: "blur(12px)", borderColor: border }}
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
        <NavLink to="/" className="flex items-center gap-2.5 no-underline">
          <span className="text-sm font-mono font-medium" style={{ color: teal }}>HTSA</span>
          <span
            className="text-xs px-1.5 py-0.5 rounded"
            style={{ backgroundColor: border, color: fgMuted }}
          >
            v2
          </span>
        </NavLink>

        <div className="flex items-center gap-1">
          {navItems.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className="px-3 py-1.5 rounded text-sm transition-colors no-underline"
              style={({ isActive }) => ({
                color: isActive ? teal : fgMuted,
                fontWeight: isActive ? 500 : undefined,
              })}
            >
              {label}
            </NavLink>
          ))}
          <a
            href="https://github.com/damionrashford/htsa"
            target="_blank"
            rel="noreferrer"
            className="ml-3 px-3 py-1.5 rounded text-sm border transition-colors no-underline"
            style={{ borderColor: border, color: fgMuted }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.borderColor = `${teal}80`;
              (e.target as HTMLElement).style.color = "#dce4f5";
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.borderColor = border;
              (e.target as HTMLElement).style.color = fgMuted;
            }}
          >
            GitHub ↗
          </a>
        </div>
      </nav>
    </header>
  );
}
