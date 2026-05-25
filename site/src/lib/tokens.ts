/* CSS variable references — resolve to dark or light theme values via [data-theme] */
export const teal   = "var(--color-teal)";
export const violet = "var(--color-violet)";
export const amber  = "var(--color-amber)";
export const green  = "var(--color-green)";
export const red    = "var(--color-red)";

export const bg     = "var(--color-paper)";
export const bgAlt  = "var(--color-paper-2)";
export const border = "var(--color-border)";
export const card   = "var(--color-card)";

export const fg     = "var(--color-fg)";
export const fgMuted = "var(--color-fg-muted)";
export const fgDim  = "var(--color-fg-dim)";

/* alpha(token, pct) — mix token with transparent at pct% opacity.
   Replaces the invalid `${token}40` hex-suffix pattern throughout the codebase. */
export const alpha = (token: string, pct: number): string =>
  `color-mix(in oklch, ${token} ${pct}%, transparent)`;

/* Convenience shorthands for common opacity levels */
export const teala  = (pct: number) => alpha(teal, pct);
export const violeta = (pct: number) => alpha(violet, pct);
export const ambera = (pct: number) => alpha(amber, pct);
export const greena = (pct: number) => alpha(green, pct);
export const bordera = (pct: number) => alpha(border, pct);
