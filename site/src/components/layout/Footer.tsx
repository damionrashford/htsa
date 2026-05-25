import { Link, NavLink } from "react-router";
import { teal, violet, border, fg, fgDim, fgMuted, alpha } from "@/lib/tokens";

const framework = [
  { to: "/algorithm", label: "The Algorithm" },
  { to: "/math", label: "Math Foundations" },
  { to: "/docs", label: "Documentation" },
  { to: "/engine", label: "TypeScript Engine" },
];

const resources = [
  { to: "/blog", label: "Blog" },
  { href: "https://github.com/damionrashford/htsa", label: "GitHub ↗" },
  { href: "https://github.com/damionrashford/htsa/blob/main/FRAMEWORK.md", label: "Framework MD ↗" },
  { href: "https://github.com/damionrashford/htsa/tree/main/proofs", label: "Formal Proofs ↗" },
];

const community = [
  { href: "https://github.com/damionrashford/htsa/issues", label: "Report Issue ↗" },
  { href: "https://github.com/damionrashford/htsa/discussions", label: "Discussions ↗" },
  { href: "https://github.com/damionrashford/htsa/blob/main/CONTRIBUTING.md", label: "Contribute ↗" },
  { href: "https://github.com/damionrashford", label: "Author ↗" },
];

function FootColHeader({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-mono uppercase mb-4"
      style={{ color: fgDim, letterSpacing: "0.08em" }}
    >
      {children}
    </p>
  );
}

export function Footer() {
  return (
    <footer
      className="border-t"
      style={{ borderColor: border, backgroundColor: "var(--color-paper-2)" }}
    >
      {/* Main footer body */}
      <div className="max-w-[90rem] mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 no-underline mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="9" height="9" rx="2" fill={teal} opacity="0.9" />
                <rect x="13" y="2" width="9" height="9" rx="2" fill={teal} opacity="0.4" />
                <rect x="2" y="13" width="9" height="9" rx="2" fill={teal} opacity="0.4" />
                <rect x="13" y="13" width="9" height="9" rx="2" fill={teal} opacity="0.15" />
              </svg>
              <span
                className="font-mono font-bold"
                style={{ color: teal, letterSpacing: "0.12em", fontSize: "0.875rem" }}
              >
                HTSA
              </span>
            </Link>

            <p className="text-sm leading-relaxed mb-5" style={{ color: fgMuted, maxWidth: "26ch" }}>
              How to Solve Anything. A structured, probabilistic root cause analysis framework.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={{ backgroundColor: alpha(teal, 8), color: teal, border: `1px solid ${alpha(teal, 18)}` }}
              >
                v2.0.0
              </span>
              <span
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={{ backgroundColor: alpha(violet, 6), color: violet, border: `1px solid ${alpha(violet, 15)}` }}
              >
                MIT License
              </span>
              <span
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={{ backgroundColor: alpha(border, 30), color: fgDim, border: `1px solid ${alpha(border, 50)}` }}
              >
                Zero deps
              </span>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/damionrashford/htsa"
                target="_blank"
                rel="noreferrer"
                aria-label="HTSA on GitHub"
                className="no-underline flex items-center gap-1.5 text-xs"
                style={{ color: fgDim, transition: "color 140ms" }}
                onMouseEnter={e => { e.currentTarget.style.color = fg; }}
                onMouseLeave={e => { e.currentTarget.style.color = fgDim; }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>

          {/* Framework column */}
          <div>
            <FootColHeader>Framework</FootColHeader>
            <ul className="space-y-2.5">
              {framework.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className="text-sm no-underline"
                    style={({ isActive }) => ({
                      color: isActive ? teal : fgMuted,
                      transition: "color 140ms",
                    })}
                    onMouseEnter={e => { e.currentTarget.style.color = fg; }}
                    onMouseLeave={e => { e.currentTarget.style.color = fgMuted; }}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources column */}
          <div>
            <FootColHeader>Resources</FootColHeader>
            <ul className="space-y-2.5">
              {resources.map(({ to, href, label }) => (
                <li key={label}>
                  {to ? (
                    <NavLink
                      to={to}
                      className="text-sm no-underline"
                      style={({ isActive }) => ({
                        color: isActive ? teal : fgMuted,
                        transition: "color 140ms",
                      })}
                      onMouseEnter={e => { e.currentTarget.style.color = fg; }}
                      onMouseLeave={e => { e.currentTarget.style.color = fgMuted; }}
                    >
                      {label}
                    </NavLink>
                  ) : (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm no-underline"
                      style={{ color: fgMuted, transition: "color 140ms" }}
                      onMouseEnter={e => { e.currentTarget.style.color = fg; }}
                      onMouseLeave={e => { e.currentTarget.style.color = fgMuted; }}
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Community column */}
          <div>
            <FootColHeader>Community</FootColHeader>
            <ul className="space-y-2.5">
              {community.map(({ href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm no-underline"
                    style={{ color: fgMuted, transition: "color 140ms" }}
                    onMouseEnter={e => { e.currentTarget.style.color = fg; }}
                    onMouseLeave={e => { e.currentTarget.style.color = fgMuted; }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t"
        style={{ borderColor: alpha(border, 50) }}
      >
        <div className="max-w-[90rem] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: fgDim }}>
            © {new Date().getFullYear()} Damion Rashford. Released under the MIT License.
          </p>
          <div className="flex items-center gap-5">
            <p className="text-xs" style={{ color: fgDim }}>
              Built with TypeScript · Bun · React
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
