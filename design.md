# Design — How to Solve Anything

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

<!-- Studio · genre: editorial · design-system: design.md · designed-as-app -->

## Genre
editorial

## Macrostructure family

- Marketing pages (Home, Compare, Math, Algorithm): existing structure — do not touch in a docs-only pass.
- Content pages (Docs welcome): Long Document — Welcome variant with 3-card callout row above section grid.
- Reader pages (DocPage): Long Document — prose-first, manifest title as h1, section breadcrumb, no enrichment.

## Theme

All values inherited from `design/design.json` (confidence 1.0, manually locked).

```
--color-paper:      oklch(0.07 0.03 250)   /* #060d1c deep navy */
--color-paper-2:    oklch(0.09 0.03 250)   /* card surface */
--color-ink:        oklch(0.95 0.01 250)   /* #dce4f5 near-white */
--color-ink-2:      oklch(0.70 0.05 250)   /* #8899bb muted */
--color-rule:       oklch(0.20 0.05 250)   /* border #182235 */
--color-accent:     oklch(0.72 0.18 196)   /* teal */
--color-accent-2:   oklch(0.68 0.22 272)   /* violet */
--color-accent-3:   oklch(0.78 0.18 75)    /* amber */
--color-focus:      oklch(0.72 0.18 196)   /* same as accent */
```

## Typography

- Display: "Space Grotesk", weight 600–700, tracking -0.02em
- Body: "DM Sans", weight 400, line-height 1.75
- Mono: "JetBrains Mono", weight 400
- Type scale anchor: display uses clamp(2rem, 4vw, 3rem); body fixed 0.875rem–1rem
- Max 5 sizes per page

## Spacing

4-point base. Named scale:
- xs: 0.75rem  sm: 1rem  md: 1.5rem  lg: 2rem  xl: 3rem  2xl: 4.5rem

## Motion

- Easings: cubic-bezier(0.16, 1, 0.3, 1)
- Reveal: none (docs are reading-first — no scroll reveals)
- Reduced-motion: opacity-only, ≤150ms

## Microinteractions stance

- Hover: border/color transition, 150ms ease
- Focus: 2px ring, accent color
- No toasts on docs pages
- Sidebar section toggle: chevron rotation 150ms

## CTA voice

- Primary: filled teal, rounded-lg, "Verb phrase →"
- Secondary: ghost (border-only), rounded-lg, "Verb phrase"
- Never: "Submit", "Click here", "Learn more" (without verb context)
- Docs CTAs: "Start with the cheat sheet →", "Browse examples →", "See the framework →"

## Per-page allowances

- Marketing pages MAY use enrichment (CSS art, SVG animation).
- App pages (docs reader) MUST NOT — typography carries the page.
- Docs welcome: ONE decorative element max (the 3-card row with accent borders).

## What pages MUST share

- Deep navy background (#060d1c / oklch(0.07 0.03 250))
- Teal accent, ≤10% per viewport
- Space Grotesk display + DM Sans body
- Border color: oklch(0.20 0.05 250) at 40–60% opacity
- Nav + footer from Layout.tsx — unchanged

## What pages MAY differ on

- Macrostructure within family (welcome vs reader vs advanced)
- Sidebar section ordering (consumer-first: Guides → Examples → Overview → Advanced)

## Consumer-first sidebar order

1. Guides (cheat sheet, antipatterns, contributing)
2. Examples (all worked examples)
3. Overview (root: framework, README, diagrams)
4. Advanced (math, proofs, research) — collapsed by default

## Consumer voice rules (docs copy)

- Plain English headings. No "Layer N —" prefixes in UI labels.
- Sidebar labels: "Guides", "Examples", "Overview", "Advanced" (not "root", "math", "proofs")
- Guide content: verb-first paragraphs, no jargon without one-line definition
- No hedging ("may", "could potentially") — state things directly
