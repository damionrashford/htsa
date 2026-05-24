import { Outlet, NavLink, useLocation } from "react-router";
import { useEffect } from "react";

const navItems = [
  { to: "/", label: "Home", exact: true },
  { to: "/algorithm", label: "Algorithm" },
  { to: "/math", label: "Math" },
  { to: "/engine", label: "Engine" },
  { to: "/compare", label: "Compare" },
];

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#080d1a", color: "#dce4f5" }}>
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: "#080d1a99", backdropFilter: "blur(12px)", borderColor: "#1e2d4a" }}>
        <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
          <NavLink to="/" className="flex items-center gap-2.5 no-underline">
            <span className="text-sm font-mono font-medium" style={{ color: "oklch(0.72 0.20 196)" }}>HTSA</span>
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#1e2d4a", color: "#8899bb" }}>v2</span>
          </NavLink>

          <div className="flex items-center gap-1">
            {navItems.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded text-sm transition-colors no-underline ${
                    isActive
                      ? "text-teal font-medium"
                      : "text-fg-muted hover:text-fg"
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? "oklch(0.72 0.20 196)" : undefined,
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
              style={{ borderColor: "#1e2d4a", color: "#8899bb" }}
              onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = "oklch(0.72 0.20 196 / 0.5)"; (e.target as HTMLElement).style.color = "#dce4f5"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = "#1e2d4a"; (e.target as HTMLElement).style.color = "#8899bb"; }}
            >
              GitHub ↗
            </a>
          </div>
        </nav>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t mt-24 py-10" style={{ borderColor: "#1e2d4a" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm" style={{ color: "oklch(0.72 0.20 196)" }}>HTSA</span>
            <span className="text-sm" style={{ color: "#4a5e82" }}>— How to Solve Anything</span>
          </div>
          <div className="flex items-center gap-6">
            {[
              { href: "https://github.com/damionrashford/htsa", label: "GitHub" },
              { href: "https://github.com/damionrashford/htsa/blob/main/FRAMEWORK.md", label: "Framework" },
              { href: "https://github.com/damionrashford/htsa/blob/main/engine/README.md", label: "Engine" },
            ].map(({ href, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                className="text-sm no-underline transition-colors"
                style={{ color: "#4a5e82" }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = "#dce4f5"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = "#4a5e82"; }}
              >
                {label}
              </a>
            ))}
          </div>
          <span className="text-sm" style={{ color: "#4a5e82" }}>MIT License</span>
        </div>
      </footer>
    </div>
  );
}
