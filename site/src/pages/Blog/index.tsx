import { Link } from "react-router";
import { posts } from "./posts";
import { teal, violet, amber, border, card, fg, fgDim, fgMuted, alpha } from "@/lib/tokens";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";

const tagColors: Record<string, string> = {
  "Framework": teal,
  "Root Cause": teal,
  "Bayesian": violet,
  "Math": violet,
  "Algorithm": violet,
  "SRE": amber,
  "Culture": amber,
  "Postmortem": amber,
  "Cognitive Bias": "var(--color-red)",
  "Medicine": "var(--color-green)",
  "Diagnosis": "var(--color-green)",
  "Domain": "var(--color-green)",
};

function Tag({ label }: { label: string }) {
  const color = tagColors[label] ?? fgDim;
  return (
    <span
      className="text-xs font-mono px-2 py-0.5 rounded"
      style={{ backgroundColor: alpha(color, 8), color, border: `1px solid ${alpha(color, 18)}` }}
    >
      {label}
    </span>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function Blog() {
  const [featured, ...rest] = posts;

  return (
    <Section>
      <PageHeader
        label="Blog"
        title="Writing on root cause analysis"
        description="Investigation methods, formal proofs, domain applications, and the reasoning behind the framework."
      />

      {/* Featured post */}
      <Link
        to={`/blog/${featured.slug}`}
        className="block no-underline mb-12 rounded-2xl border overflow-hidden group"
        style={{
          backgroundColor: card,
          borderColor: alpha(teal, 18),
          transition: "border-color 200ms cubic-bezier(0.16,1,0.3,1)",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = alpha(teal, 40); }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = alpha(teal, 18); }}
      >
        {/* Gradient header strip */}
        <div
          className="h-1"
          style={{ background: `linear-gradient(to right, ${teal}, ${violet})` }}
        />

        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-xs font-mono px-2 py-0.5 rounded"
              style={{ backgroundColor: alpha(teal, 10), color: teal, border: `1px solid ${alpha(teal, 20)}` }}
            >
              Featured
            </span>
            <span className="text-xs" style={{ color: fgDim }}>{formatDate(featured.date)}</span>
            <span className="text-xs" style={{ color: fgDim }}>·</span>
            <span className="text-xs" style={{ color: fgDim }}>{featured.readTime} read</span>
          </div>

          <h2
            className="text-2xl sm:text-3xl font-bold mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: fg, letterSpacing: "-0.02em", lineHeight: "1.15" }}
          >
            {featured.title}
          </h2>
          <p className="text-base leading-relaxed mb-5" style={{ color: fgMuted, maxWidth: "72ch" }}>
            {featured.excerpt}
          </p>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex flex-wrap gap-1.5">
              {featured.tags.map(t => <Tag key={t} label={t} />)}
            </div>
            <span
              className="text-sm font-medium"
              style={{ color: teal, transition: "opacity 150ms" }}
            >
              Read article →
            </span>
          </div>
        </div>
      </Link>

      {/* Post grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rest.map(post => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="block no-underline rounded-xl border overflow-hidden"
            style={{
              backgroundColor: card,
              borderColor: border,
              transition: "border-color 200ms cubic-bezier(0.16,1,0.3,1), transform 200ms cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = alpha(teal, 30);
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = border;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs" style={{ color: fgDim }}>{formatDate(post.date)}</span>
                <span className="text-xs" style={{ color: fgDim }}>·</span>
                <span className="text-xs" style={{ color: fgDim }}>{post.readTime} read</span>
              </div>

              <h3
                className="text-lg font-semibold mb-2 leading-snug"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: fg, letterSpacing: "-0.018em" }}
              >
                {post.title}
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: fgMuted }}>
                {post.subtitle}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {post.tags.map(t => <Tag key={t} label={t} />)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
