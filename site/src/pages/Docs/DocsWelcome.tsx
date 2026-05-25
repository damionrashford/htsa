import { Link } from "react-router";
import { teal, violet, amber, border, fg, fgMuted, fgDim, bgAlt, alpha } from "@/lib/tokens";
import manifest from "@/lib/docs-manifest.json";

const guides = manifest.docs.filter(d => d.section === "guides");
const examples = manifest.docs.filter(d => d.section === "examples");

const ProcessIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);
const RefIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 6h16M4 10h16M4 14h10M4 18h6"/>
  </svg>
);
const ExamplesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const callouts = [
  {
    Icon: ProcessIcon,
    label: "The Process",
    badge: "Start here",
    desc: "Four layers. Map the situation, trace the cause, pick the fix, verify it worked. Applies to any problem.",
    slug: "guides--cheatsheet",
    color: teal,
  },
  {
    Icon: RefIcon,
    label: "Quick Reference",
    badge: "Cheat sheet",
    desc: "Every step on one page. Print it, bookmark it, or paste it into your notes before your next investigation.",
    slug: "guides--cheatsheet",
    color: violet,
  },
  {
    Icon: ExamplesIcon,
    label: "Real Examples",
    badge: "6 domains",
    desc: "Engineering incidents, medical diagnosis, business bottlenecks. See the full method applied end-to-end.",
    slug: "examples--00_index",
    color: amber,
  },
];

const EXAMPLE_LABELS: Record<string, string> = {
  "examples--00_index": "All examples",
  "examples--01_engineering_incident": "Production outage at 2:47 AM",
  "examples--02_medical_diagnosis": "Emergency chest pain — differential diagnosis",
  "examples--03_security_breach": "SaaS customer data exfiltration",
  "examples--04_business_bottleneck": "B2B sales cycle bottleneck",
  "examples--05_legal_investigation": "Scaffolding collapse investigation",
  "examples--06_personal_decision": "Investigating burnout before quitting",
};

const GUIDE_LABELS: Record<string, string> = {
  "guides--cheatsheet": "The cheat sheet",
  "guides--antipatterns": "How investigations fail",
  "guides--contributing": "Contributing",
};

export function DocsWelcome() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: fgDim }}>
          Documentation
        </p>
        <h1
          className="text-4xl font-bold leading-tight mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: fg }}
        >
          Solve any problem, step by step.
        </h1>
        <p className="text-base leading-7 mb-8 max-w-xl" style={{ color: fgMuted }}>
          How to Solve Anything is a structured investigation method. Pick a guide to start, or
          jump to an example that matches your situation.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link
            to="/docs/guides--cheatsheet"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium no-underline"
            style={{
              backgroundColor: teal,
              color: "var(--color-paper)",
              transition: "opacity 100ms",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.9"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          >
            Start with the cheat sheet →
          </Link>
          <Link
            to="/docs/examples--00_index"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium no-underline border"
            style={{
              borderColor: border,
              color: fgMuted,
              transition: "border-color 150ms cubic-bezier(0.16,1,0.3,1), color 150ms",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = alpha(teal, 38); (e.currentTarget as HTMLElement).style.color = fg; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = border; (e.currentTarget as HTMLElement).style.color = fgMuted; }}
          >
            Browse examples
          </Link>
        </div>
      </div>

      {/* 3-card callout row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
        {callouts.map(c => (
          <Link
            key={c.slug + c.label}
            to={`/docs/${c.slug}`}
            className="block rounded-xl border p-5 no-underline group"
            style={{
              borderColor: alpha(c.color, 15),
              backgroundColor: alpha(c.color, 4),
              transition: "border-color 150ms cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = alpha(c.color, 33); }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = alpha(c.color, 15); }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: alpha(c.color, 12), color: c.color }}
              >
                <c.Icon />
              </div>
              <span
                className="text-xs font-mono px-1.5 py-0.5 rounded"
                style={{ backgroundColor: alpha(c.color, 8), color: alpha(c.color, 70) }}
              >
                {c.badge}
              </span>
            </div>
            <p
              className="text-sm font-semibold mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: fg }}
            >
              {c.label}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: fgMuted }}>
              {c.desc}
            </p>
          </Link>
        ))}
      </div>

      {/* Two-column section list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Guides */}
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>
            Guides
          </p>
          <ul className="flex flex-col gap-1">
            {guides.map(doc => (
              <li key={doc.slug}>
                <Link
                  to={`/docs/${doc.slug}`}
                  className="block px-3 py-2.5 rounded-lg text-sm no-underline border border-transparent"
                  style={{
                    color: fgMuted,
                    transition: "color 150ms, border-color 150ms, background-color 150ms",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = fg;
                    (e.currentTarget as HTMLElement).style.borderColor = border;
                    (e.currentTarget as HTMLElement).style.backgroundColor = bgAlt;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = fgMuted;
                    (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  }}
                >
                  {GUIDE_LABELS[doc.slug] ?? doc.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Examples */}
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: fgDim }}>
            Examples
          </p>
          <ul className="flex flex-col gap-1">
            {examples.map(doc => (
              <li key={doc.slug}>
                <Link
                  to={`/docs/${doc.slug}`}
                  className="block px-3 py-2.5 rounded-lg text-sm no-underline border border-transparent"
                  style={{
                    color: fgMuted,
                    transition: "color 150ms, border-color 150ms, background-color 150ms",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = fg;
                    (e.currentTarget as HTMLElement).style.borderColor = border;
                    (e.currentTarget as HTMLElement).style.backgroundColor = bgAlt;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = fgMuted;
                    (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  }}
                >
                  {EXAMPLE_LABELS[doc.slug] ?? doc.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Advanced divider */}
      <div className="mt-12 pt-8 border-t" style={{ borderColor: alpha(border, 25) }}>
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: fgDim }}>
          Advanced
        </p>
        <p className="text-sm mb-6" style={{ color: fgMuted }}>
          The formal math and proofs behind the method. Not required to use the framework — useful if you want to understand why it works.
        </p>
        <div className="flex gap-4 flex-wrap">
          {(["Math Foundations", "Formal Proofs", "Research"] as const).map((label, i) => {
            const slugMap: Record<string, string> = {
              "Math Foundations": "math--00_index",
              "Formal Proofs": "proofs--00_index",
              "Research": "research--00_index",
            };
            const colorMap = [teal, violet, amber];
            const color = colorMap[i];
            return (
              <Link
                key={label}
                to={`/docs/${slugMap[label]}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium no-underline border"
                style={{
                  borderColor: alpha(color, 19),
                  color,
                  backgroundColor: alpha(color, 5),
                  transition: "border-color 150ms cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = alpha(color, 38); }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = alpha(color, 19); }}
              >
                {label} →
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
