import { teal, border, fgDim } from "@/lib/tokens";

const links = [
  { href: "https://github.com/damionrashford/htsa", label: "GitHub" },
  { href: "https://github.com/damionrashford/htsa/blob/main/FRAMEWORK.md", label: "Framework" },
  { href: "https://github.com/damionrashford/htsa/blob/main/engine/README.md", label: "Engine" },
];

export function Footer() {
  return (
    <footer className="border-t mt-24 py-10" style={{ borderColor: border }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm" style={{ color: teal }}>HTSA</span>
          <span className="text-sm" style={{ color: fgDim }}>— How to Solve Anything</span>
        </div>
        <div className="flex items-center gap-6">
          {links.map(({ href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-sm no-underline transition-colors"
              style={{ color: fgDim }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = "#dce4f5"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = fgDim; }}
            >
              {label}
            </a>
          ))}
        </div>
        <span className="text-sm" style={{ color: fgDim }}>MIT License</span>
      </div>
    </footer>
  );
}
