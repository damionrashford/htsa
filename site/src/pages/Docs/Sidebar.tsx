import { useState } from "react";
import { NavLink, useParams, Link } from "react-router";
import { teal, border, fgMuted, fgDim } from "@/lib/tokens";
import manifest from "@/lib/docs-manifest.json";

const SECTION_LABELS: Record<string, string> = {
  guides: "Guides",
  examples: "Examples",
  root: "Overview",
  math: "Math Foundations",
  proofs: "Formal Proofs",
  research: "Research",
};

// Consumer-first order: guides and examples up top, advanced at bottom
const PRIMARY_ORDER = ["guides", "examples", "root"];
const ADVANCED_ORDER = ["math", "proofs", "research"];

type DocEntry = typeof manifest.docs[number];

function groupBySection(docs: DocEntry[]): Map<string, DocEntry[]> {
  const map = new Map<string, DocEntry[]>();
  for (const doc of docs) {
    if (!map.has(doc.section)) map.set(doc.section, []);
    map.get(doc.section)!.push(doc);
  }
  return map;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 150ms ease",
        opacity: 0.5,
        flexShrink: 0,
      }}
    >
      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionGroup({
  section,
  items,
  isOpen,
  hasActive,
  onToggle,
  onNavigate,
}: {
  section: string;
  items: DocEntry[];
  isOpen: boolean;
  hasActive: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors"
        style={{ color: hasActive ? teal : fgDim }}
        onMouseEnter={e => { if (!hasActive) (e.currentTarget as HTMLElement).style.color = fgMuted; }}
        onMouseLeave={e => { if (!hasActive) (e.currentTarget as HTMLElement).style.color = fgDim; }}
      >
        <span className="text-xs font-semibold uppercase tracking-widest">
          {SECTION_LABELS[section] ?? section}
        </span>
        <Chevron open={isOpen} />
      </button>

      {isOpen && (
        <ul className="flex flex-col gap-0.5 mt-0.5 mb-2">
          {items.map(doc => (
            <li key={doc.slug}>
              <NavLink
                to={`/docs/${doc.slug}`}
                onClick={onNavigate}
                className="block px-2 py-1.5 rounded text-sm no-underline transition-colors leading-snug"
                style={({ isActive }) => ({
                  color: isActive ? teal : fgMuted,
                  backgroundColor: isActive ? `${teal}12` : "transparent",
                  fontWeight: isActive ? 500 : undefined,
                  paddingLeft: "0.75rem",
                })}
              >
                {doc.title}
              </NavLink>
            </li>
          ))}
        </ul>
      )}

      {!isOpen && (
        <div className="mx-2 mb-1" style={{ height: 1, backgroundColor: `${border}40` }} />
      )}
    </div>
  );
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { slug } = useParams<{ slug: string }>();
  const groups = groupBySection(manifest.docs);

  const activeSection = manifest.docs.find(d => d.slug === slug)?.section ?? null;
  const isAdvancedActive = activeSection ? ADVANCED_ORDER.includes(activeSection) : false;

  const allSections = [...PRIMARY_ORDER, ...ADVANCED_ORDER];

  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      allSections.map(s => [
        s,
        ADVANCED_ORDER.includes(s) ? s === activeSection : s === activeSection || s === "guides",
      ])
    )
  );
  const [advancedOpen, setAdvancedOpen] = useState(isAdvancedActive);

  const toggle = (section: string) =>
    setOpen(prev => ({ ...prev, [section]: !prev[section] }));

  return (
    <nav className="flex flex-col py-4 px-3">
      {/* Welcome link */}
      <div className="mb-3">
        <Link
          to="/docs"
          onClick={onNavigate}
          className="flex items-center gap-2 px-2 py-1.5 rounded text-sm no-underline transition-colors"
          style={{ color: !slug ? teal : fgDim }}
          onMouseEnter={e => { if (slug) (e.currentTarget as HTMLElement).style.color = fgMuted; }}
          onMouseLeave={e => { if (slug) (e.currentTarget as HTMLElement).style.color = fgDim; }}
        >
          <span className="text-xs font-semibold uppercase tracking-widest">Home</span>
        </Link>
        <div className="mx-2 mt-1 mb-2" style={{ height: 1, backgroundColor: `${border}40` }} />
      </div>

      {/* Primary sections — Guides, Examples, Overview */}
      {PRIMARY_ORDER.filter(s => groups.has(s)).map(section => (
        <SectionGroup
          key={section}
          section={section}
          items={groups.get(section)!}
          isOpen={open[section] ?? false}
          hasActive={activeSection === section}
          onToggle={() => toggle(section)}
          onNavigate={onNavigate}
        />
      ))}

      {/* Advanced collapsible group */}
      {ADVANCED_ORDER.some(s => groups.has(s)) && (
        <div className="mt-1">
          <button
            onClick={() => setAdvancedOpen(p => !p)}
            className="w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors"
            style={{ color: isAdvancedActive ? teal : fgDim }}
            onMouseEnter={e => { if (!isAdvancedActive) (e.currentTarget as HTMLElement).style.color = fgMuted; }}
            onMouseLeave={e => { if (!isAdvancedActive) (e.currentTarget as HTMLElement).style.color = fgDim; }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest">Advanced</span>
            <Chevron open={advancedOpen} />
          </button>

          {advancedOpen && (
            <div className="ml-2 mt-1">
              {ADVANCED_ORDER.filter(s => groups.has(s)).map(section => (
                <SectionGroup
                  key={section}
                  section={section}
                  items={groups.get(section)!}
                  isOpen={open[section] ?? false}
                  hasActive={activeSection === section}
                  onToggle={() => toggle(section)}
                  onNavigate={onNavigate}
                        />
              ))}
            </div>
          )}

          {!advancedOpen && (
            <div className="mx-2 mb-1" style={{ height: 1, backgroundColor: `${border}40` }} />
          )}
        </div>
      )}
    </nav>
  );
}
