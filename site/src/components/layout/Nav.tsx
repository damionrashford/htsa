import { NavLink, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { teal, border, fg, fgMuted, fgDim, alpha } from "@/lib/tokens";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { to: "/", label: "Home", exact: true },
  { to: "/algorithm", label: "Algorithm" },
  { to: "/math", label: "Math" },
  { to: "/engine", label: "Engine" },
  { to: "/docs", label: "Docs" },
  { to: "/blog", label: "Blog" },
];

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* Skip to main content */}
      <a href="#main-content" className="skip-to-content">Skip to content</a>

      <header
        role="banner"
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: `color-mix(in oklch, var(--color-paper) 94%, transparent)`,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderColor: border,
        }}
      >
        <nav
          aria-label="Main navigation"
          className="max-w-[90rem] mx-auto px-5 flex items-center justify-between h-14"
        >
          {/* Wordmark */}
          <NavLink to="/" className="flex items-center gap-2.5 no-underline shrink-0" aria-label="HTSA home">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="9" height="9" rx="2" fill={teal} opacity="0.9" />
              <rect x="13" y="2" width="9" height="9" rx="2" fill={teal} opacity="0.4" />
              <rect x="2" y="13" width="9" height="9" rx="2" fill={teal} opacity="0.4" />
              <rect x="13" y="13" width="9" height="9" rx="2" fill={teal} opacity="0.15" />
            </svg>
            <span className="font-mono font-bold text-sm" style={{ color: teal, letterSpacing: "0.12em" }}>
              HTSA
            </span>
            <span
              className="text-xs px-1.5 py-0.5 rounded font-mono hidden xs:inline-block"
              style={{ backgroundColor: alpha(teal, 9), color: teal, border: `1px solid ${alpha(teal, 20)}` }}
            >
              v2
            </span>
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-0.5" role="list">
              {navItems.map(({ to, label, exact }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={exact}
                  role="listitem"
                  className="px-3 py-1.5 rounded-md text-sm no-underline"
                  style={({ isActive }) => ({
                    color: isActive ? teal : fgMuted,
                    fontWeight: isActive ? 500 : 400,
                    backgroundColor: isActive ? alpha(teal, 8) : "transparent",
                    transition: "color 150ms cubic-bezier(0.16,1,0.3,1), background-color 150ms cubic-bezier(0.16,1,0.3,1)",
                  })}
                  onMouseEnter={e => {
                    if (e.currentTarget.getAttribute("aria-current") !== "page") {
                      e.currentTarget.style.color = fg;
                      e.currentTarget.style.backgroundColor = alpha(border, 38);
                    }
                  }}
                  onMouseLeave={e => {
                    if (e.currentTarget.getAttribute("aria-current") !== "page") {
                      e.currentTarget.style.color = fgMuted;
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {label}
                </NavLink>
              ))}
            </div>

            <ThemeToggle />

            <a
              href="https://github.com/damionrashford/htsa"
              target="_blank"
              rel="noreferrer"
              aria-label="View HTSA on GitHub"
              className="hidden lg:flex px-3 py-1.5 rounded-md text-sm border no-underline"
              style={{ borderColor: border, color: fgMuted, transition: "color 150ms, border-color 150ms" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = alpha(teal, 38); e.currentTarget.style.color = fg; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = fgMuted; }}
            >
              GitHub ↗
            </a>
          </div>

          {/* Mobile right: theme + hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg"
              style={{
                backgroundColor: menuOpen ? alpha(teal, 10) : "transparent",
                border: `1px solid ${menuOpen ? alpha(teal, 25) : alpha(border, 60)}`,
                transition: "background-color 150ms, border-color 150ms",
              }}
            >
              <span
                className="w-4.5 h-px block rounded-full"
                style={{
                  backgroundColor: menuOpen ? teal : fgMuted,
                  transform: menuOpen ? "translateY(3px) rotate(45deg)" : "none",
                  transition: "transform 200ms cubic-bezier(0.16,1,0.3,1), background-color 150ms",
                  width: "18px",
                }}
              />
              <span
                className="block rounded-full"
                style={{
                  backgroundColor: menuOpen ? teal : fgMuted,
                  width: "18px",
                  height: "1px",
                  opacity: menuOpen ? 0 : 1,
                  transition: "opacity 150ms",
                }}
              />
              <span
                className="block rounded-full"
                style={{
                  backgroundColor: menuOpen ? teal : fgMuted,
                  width: "18px",
                  height: "1px",
                  transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
                  transition: "transform 200ms cubic-bezier(0.16,1,0.3,1), background-color 150ms",
                }}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 sm:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu drawer */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed top-14 left-0 right-0 z-40 sm:hidden border-b overflow-hidden"
        style={{
          backgroundColor: "var(--color-paper)",
          borderColor: border,
          maxHeight: menuOpen ? "calc(100vh - 56px)" : "0",
          transition: "max-height 280ms cubic-bezier(0.16,1,0.3,1)",
          overflowY: "auto",
        }}
      >
        <div className="px-5 py-4 space-y-1">
          {navItems.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className="flex items-center px-4 py-3 rounded-xl text-base no-underline"
              style={({ isActive }) => ({
                color: isActive ? teal : fgMuted,
                fontWeight: isActive ? 500 : 400,
                backgroundColor: isActive ? alpha(teal, 8) : "transparent",
                borderLeft: isActive ? `2px solid ${teal}` : "2px solid transparent",
                transition: "background-color 150ms, color 150ms",
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="mx-5 h-px" style={{ backgroundColor: alpha(border, 50) }} />

        <div className="px-5 py-4">
          <a
            href="https://github.com/damionrashford/htsa"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm no-underline"
            style={{ color: fgDim }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub ↗
          </a>
        </div>
      </div>
    </>
  );
}
