import { teal, violet, amber, border, fg, fgDim, fgMuted, alpha } from "@/lib/tokens";

const SREIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
    <path d="M7 8h.01M10 8h4" />
    <path d="M7 11h.01M10 11h4" />
  </svg>
);

const MedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SecIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const BizIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

const LawIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
    <path d="M3 5h18M12 19V5" />
  </svg>
);

const YouIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const domains = [
  { abbr: "SRE", domain: "Engineering", what: "Outage, incident, postmortem", color: teal, Icon: SREIcon },
  { abbr: "MED", domain: "Medicine", what: "Diagnosis, differential", color: "oklch(0.72 0.18 155)", Icon: MedIcon },
  { abbr: "SEC", domain: "Security", what: "Breach, threat model", color: "oklch(0.65 0.22 25)", Icon: SecIcon },
  { abbr: "BIZ", domain: "Business", what: "Bottleneck, regression", color: amber, Icon: BizIcon },
  { abbr: "LAW", domain: "Legal", what: "Liability, causation", color: violet, Icon: LawIcon },
  { abbr: "YOU", domain: "Personal", what: "Decision, burnout, goal", color: "oklch(0.72 0.18 296)", Icon: YouIcon },
];

export function WorksEverywhere() {
  return (
    <section className="py-14 sm:py-24 border-y" style={{ borderColor: border, backgroundColor: "var(--color-paper-2)" }}>
      <div className="max-w-[90rem] mx-auto px-6">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: fgDim }}>
            Domain-agnostic
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: fg }}
          >
            Works everywhere.
          </h2>
          <p className="mt-4 text-base w-full max-w-sm mx-auto leading-relaxed" style={{ color: fgMuted, marginInline: "auto" }}>
            Same algorithm. Same math. Different vocabulary.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {domains.map(({ abbr, domain, what, color, Icon }) => (
            <div
              key={domain}
              className="rounded-xl p-3 sm:p-5 border flex flex-row sm:flex-col items-start gap-3 sm:gap-4 cursor-default"
              style={{
                backgroundColor: abbr === "YOU" ? alpha(color, 6) : "var(--color-card)",
                borderColor: abbr === "YOU" ? alpha(color, 38) : alpha(color, 13),
                boxShadow: abbr === "YOU" ? `0 0 0 1px ${alpha(color, 16)}, 0 0 14px ${alpha(color, 8)}` : "none",
                transition: "border-color 200ms cubic-bezier(0.16,1,0.3,1), transform 200ms cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = alpha(color, 48);
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = abbr === "YOU" ? alpha(color, 38) : alpha(color, 13);
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: alpha(color, 10), color }}
              >
                <Icon />
              </div>

              <div className="min-w-0">
                <div
                  className="text-xs font-mono font-bold px-1.5 py-0.5 rounded w-fit mb-1"
                  style={{ backgroundColor: alpha(color, 8), color, fontSize: "0.65rem" }}
                >
                  {abbr}
                </div>
                <div className="text-sm font-semibold leading-snug mb-1" style={{ color: fg }}>{domain}</div>
                <div className="text-xs leading-relaxed" style={{ color: fgDim }}>{what}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
