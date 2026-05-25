import { useParams, Link, Navigate } from "react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPost, posts } from "./posts";
import { teal, violet, border, card, fg, fgDim, fgMuted, alpha } from "@/lib/tokens";

const tagColors: Record<string, string> = {
  "Framework": teal, "Root Cause": teal,
  "Bayesian": violet, "Math": violet, "Algorithm": violet,
  "SRE": "var(--color-amber)", "Culture": "var(--color-amber)", "Postmortem": "var(--color-amber)",
  "Cognitive Bias": "var(--color-red)",
  "Medicine": "var(--color-green)", "Diagnosis": "var(--color-green)", "Domain": "var(--color-green)",
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

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPost(slug ?? "");

  if (!post) return <Navigate to="/blog" replace />;

  const idx = posts.findIndex(p => p.slug === post.slug);
  const prev = idx < posts.length - 1 ? posts[idx + 1] : null;
  const next = idx > 0 ? posts[idx - 1] : null;

  return (
    <div className="max-w-[90rem] mx-auto px-6 py-10 sm:py-16">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm no-underline mb-10"
          style={{ color: fgDim, transition: "color 140ms" }}
          onMouseEnter={e => { e.currentTarget.style.color = fg; }}
          onMouseLeave={e => { e.currentTarget.style.color = fgDim; }}
        >
          ← All posts
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {post.tags.map(t => <Tag key={t} label={t} />)}
          </div>

          <h1
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: fg,
              letterSpacing: "-0.025em",
              lineHeight: "1.1",
            }}
          >
            {post.title}
          </h1>

          <p className="text-lg leading-relaxed mb-5" style={{ color: fgMuted }}>
            {post.subtitle}
          </p>

          <div className="flex items-center gap-3 pb-8 border-b" style={{ borderColor: alpha(border, 50) }}>
            <span className="text-sm" style={{ color: fgDim }}>{formatDate(post.date)}</span>
            <span style={{ color: fgDim }}>·</span>
            <span className="text-sm" style={{ color: fgDim }}>{post.readTime} read</span>
          </div>
        </header>

        {/* Content */}
        <article>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => (
                <h2
                  className="text-xl font-semibold mt-12 mb-4"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: fg,
                    letterSpacing: "-0.02em",
                    lineHeight: "1.25",
                    borderLeft: `3px solid ${teal}`,
                    paddingLeft: "0.875rem",
                    marginLeft: "-0.875rem",
                  }}
                >
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3
                  className="text-base font-semibold mt-8 mb-2"
                  style={{ color: fg, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.015em" }}
                >
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-base mb-5" style={{ color: fgMuted, lineHeight: "1.78" }}>
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="mb-5 space-y-1.5 text-base" style={{ color: fgMuted, paddingLeft: "1.4rem", lineHeight: "1.7" }}>
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-5 space-y-1.5 text-base list-decimal" style={{ color: fgMuted, paddingLeft: "1.4rem", lineHeight: "1.7" }}>
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="leading-[1.7] pl-1">{children}</li>,
              code: ({ children, className }) => {
                const isBlock = className?.startsWith("language-");
                return isBlock ? (
                  <code className={className}>{children}</code>
                ) : (
                  <code
                    className="text-[0.8125em] px-1.5 py-0.5 rounded font-mono"
                    style={{ backgroundColor: alpha(teal, 7), color: teal, border: `1px solid ${alpha(teal, 13)}` }}
                  >
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <div className="my-6 rounded-xl overflow-hidden border" style={{ borderColor: border }}>
                  <div
                    className="flex items-center gap-1.5 px-4 py-2.5 border-b"
                    style={{ backgroundColor: "var(--color-code-bar)", borderColor: border }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "oklch(0.65 0.22 25 / 25%)" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "oklch(0.78 0.18 75 / 25%)" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "oklch(0.72 0.18 155 / 25%)" }} />
                  </div>
                  <pre
                    className="px-5 py-4 overflow-x-auto text-[0.8125rem] font-mono leading-[1.75]"
                    style={{ backgroundColor: "var(--color-code-bg)", color: "var(--color-fg-muted)", margin: 0 }}
                  >
                    {children}
                  </pre>
                </div>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-6 rounded-xl border" style={{ borderColor: border }}>
                  <table className="w-full text-sm border-collapse">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead style={{ backgroundColor: "var(--color-paper-2)" }}>{children}</thead>,
              th: ({ children }) => (
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide border-b" style={{ color: fgDim, borderColor: border, letterSpacing: "0.06em" }}>
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3 text-sm border-b" style={{ color: fgMuted, borderColor: alpha(border, 31) }}>
                  {children}
                </td>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 pl-5 my-6 py-1" style={{ borderColor: teal }}>
                  <div className="text-base italic leading-[1.75]" style={{ color: fgMuted }}>{children}</div>
                </blockquote>
              ),
              strong: ({ children }) => <strong className="font-semibold" style={{ color: fg }}>{children}</strong>,
              hr: () => <hr className="my-10" style={{ borderColor: alpha(border, 38) }} />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Prev / Next nav */}
        {(prev || next) && (
          <nav
            className="mt-16 pt-8 border-t grid grid-cols-1 sm:grid-cols-2 gap-4"
            style={{ borderColor: alpha(border, 50) }}
            aria-label="Post navigation"
          >
            {prev ? (
              <Link
                to={`/blog/${prev.slug}`}
                className="no-underline rounded-xl p-5 border"
                style={{
                  backgroundColor: card,
                  borderColor: border,
                  transition: "border-color 180ms cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = alpha(teal, 30); }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; }}
              >
                <p className="text-xs mb-1" style={{ color: fgDim }}>← Previous</p>
                <p className="text-sm font-medium leading-snug" style={{ color: fg }}>{prev.title}</p>
              </Link>
            ) : <div />}
            {next && (
              <Link
                to={`/blog/${next.slug}`}
                className="no-underline rounded-xl p-5 border text-right"
                style={{
                  backgroundColor: card,
                  borderColor: border,
                  transition: "border-color 180ms cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = alpha(teal, 30); }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = border; }}
              >
                <p className="text-xs mb-1" style={{ color: fgDim }}>Next →</p>
                <p className="text-sm font-medium leading-snug" style={{ color: fg }}>{next.title}</p>
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
