import { teal, violet, fgMuted, fgDim, alpha } from "@/lib/tokens";
import { LayerCard } from "../components/LayerCard";

const WhoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);
const WhatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v4M12 16h.01"/>
  </svg>
);
const WhenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
  </svg>
);
const WhereIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2C8.7 2 6 4.7 6 8c0 4.5 6 13 6 13s6-8.5 6-13c0-3.3-2.7-6-6-6z"/><circle cx="12" cy="8" r="2"/>
  </svg>
);
const WhyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 6 0c0 2-3 3-3 3M12 17h.01"/>
  </svg>
);

const questions = [
  { q: "Who",   label: "Actor",   a: "Who was affected? Who triggered it? Who first observed it?",           Icon: WhoIcon   },
  { q: "What",  label: "Event",   a: "What exactly happened? What is the precise observable symptom?",        Icon: WhatIcon  },
  { q: "When",  label: "Timeline",a: "When did it start? What changed in the window before it appeared?",     Icon: WhenIcon  },
  { q: "Where", label: "Location",a: "Where in the system? Region, service, component, environment?",         Icon: WhereIcon },
  { q: "Why",   label: "Surface", a: "The immediately apparent reason — before asking Why again in Layer 2.", Icon: WhyIcon   },
];

export function SituationMap() {
  return (
    <LayerCard num="LAYER 01" title="Situation Map — The 5 Ws" color={teal}>
      <p className="text-base mb-6 leading-relaxed" style={{ color: fgMuted }}>
        Establish the full picture before drilling into cause. All five questions must be answered
        before the first hypothesis is generated. Anchoring bias fires if you skip this layer.
      </p>
      <div className="flex flex-col gap-2">
        {questions.map(({ q, label, a, Icon }) => (
          <div
            key={q}
            className="flex items-start gap-4 rounded-lg p-3.5 border"
            style={{ borderColor: alpha(teal, 12), backgroundColor: alpha(teal, 4) }}
          >
            {/* Icon + W badge */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: alpha(teal, 12), color: teal }}
              >
                <Icon />
              </div>
              <span className="text-xs font-mono font-bold" style={{ color: teal }}>{q}</span>
            </div>
            {/* Content */}
            <div className="min-w-0 pt-0.5">
              <span className="text-xs font-mono uppercase tracking-wider" style={{ color: fgDim }}>{label}</span>
              <p className="text-sm mt-0.5" style={{ color: fgMuted }}>{a}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Flow indicator to Layer 2 */}
      <div
        className="mt-5 rounded-lg px-4 py-3 border flex items-center gap-3"
        style={{ borderColor: alpha(violet, 15), backgroundColor: alpha(violet, 5) }}
      >
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: violet }} />
        <p className="text-xs" style={{ color: fgDim }}>
          Once all 5 Ws are answered, move to <strong style={{ color: violet }}>Layer 2: Causal Chain</strong> — start asking Why recursively from the surface reason.
        </p>
      </div>
    </LayerCard>
  );
}
