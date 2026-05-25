import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useParams, Navigate } from "react-router";
import { useState, useCallback } from "react";
import manifest from "@/lib/docs-manifest.json";
import { teal, border, fgMuted, fg, fgDim, alpha } from "@/lib/tokens";

function CopyMdButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [content]);

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border"
      style={{
        borderColor: copied ? alpha(teal, 38) : border,
        color: copied ? teal : fgDim,
        backgroundColor: copied ? alpha(teal, 5) : "transparent",
        transition: "color 150ms cubic-bezier(0.16,1,0.3,1), border-color 150ms cubic-bezier(0.16,1,0.3,1), background-color 150ms cubic-bezier(0.16,1,0.3,1)",
      }}
      onMouseEnter={e => {
        if (!copied) {
          e.currentTarget.style.borderColor = alpha(teal, 25);
          e.currentTarget.style.color = fgMuted;
        }
      }}
      onMouseLeave={e => {
        if (!copied) {
          e.currentTarget.style.borderColor = border;
          e.currentTarget.style.color = fgDim;
        }
      }}
    >
      {copied ? "Copied ✓" : "Copy MD"}
    </button>
  );
}

type DocEntry = typeof manifest.docs[number];

const bySlug = new Map<string, DocEntry>(manifest.docs.map(d => [d.slug, d]));

function resolveDocHref(href: string, currentPath: string): string | null {
  if (!href.endsWith(".md")) return null;
  const dir = currentPath.includes("/") ? currentPath.split("/").slice(0, -1).join("/") : "";
  const raw = dir ? `${dir}/${href}` : href;
  const parts = raw.split("/");
  const resolved: string[] = [];
  for (const p of parts) {
    if (p === "..") resolved.pop();
    else if (p !== ".") resolved.push(p);
  }
  const slug = resolved.join("/").replace(/\.md$/, "").replace(/\//g, "--");
  return `#/docs/${slug}`;
}

const SECTION_LABELS: Record<string, string> = {
  root: "Overview",
  guides: "Guides",
  math: "Math Foundations",
  proofs: "Formal Proofs",
  examples: "Examples",
  research: "Research",
};

export function DocPage() {
  const { slug } = useParams<{ slug: string }>();
  const doc = slug ? bySlug.get(slug) : manifest.docs[0];

  if (!doc) return <Navigate to={`/docs/${manifest.docs[0]?.slug}`} replace />;

  return (
    <article className="max-w-3xl mx-auto px-8 py-10">
      {/* Page header */}
      <div className="mb-8 pb-6 border-b flex items-start justify-between gap-4" style={{ borderColor: border }}>
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: fgDim }}>
            {SECTION_LABELS[doc.section] ?? doc.section}
          </p>
          <h1
            className="text-3xl font-bold leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: fg }}
          >
            {doc.title}
          </h1>
        </div>
        <div className="pt-1 shrink-0">
          <CopyMdButton content={doc.content} />
        </div>
      </div>

      {/* Markdown body */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: () => null,
          h2: ({ children }) => (
            <h2
              className="text-xl font-semibold mt-12 mb-4 pb-3 border-b"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: fg,
                borderColor: alpha(border, 38),
                borderLeft: `3px solid ${teal}`,
                paddingLeft: "0.875rem",
                marginLeft: "-0.875rem",
              }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold mt-8 mb-2" style={{ color: fg }}>{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-semibold mt-5 mb-1.5 uppercase tracking-wide" style={{ color: fgDim }}>{children}</h4>
          ),
          p: ({ children }) => (
            <p className="mb-5 text-base" style={{ color: fgMuted, lineHeight: "1.78" }}>{children}</p>
          ),
          a: ({ href, children }) => {
            const resolved = href ? resolveDocHref(href, doc.path) : null;
            return (
              <a
                href={resolved ?? href}
                className="no-underline border-b"
                style={{
                  color: teal,
                  borderColor: alpha(teal, 21),
                  transition: "border-color 120ms",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = teal; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = alpha(teal, 21); }}
              >
                {children}
              </a>
            );
          },
          code: ({ children, className }) => {
            const isBlock = className?.startsWith("language-");
            return isBlock ? (
              <code className={className}>{children}</code>
            ) : (
              <code
                className="text-xs px-1.5 py-0.5 rounded font-mono"
                style={{ backgroundColor: alpha(teal, 7), color: teal, border: `1px solid ${alpha(teal, 13)}` }}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <div className="my-5 rounded-lg overflow-hidden border" style={{ borderColor: border }}>
              <div
                className="flex items-center gap-1.5 px-4 py-2 border-b"
                style={{ backgroundColor: "var(--color-code-bar)", borderColor: border }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ff5f5740" }} />
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#febc2e40" }} />
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#28c84040" }} />
              </div>
              <pre
                className="px-5 py-4 overflow-x-auto text-xs font-mono leading-relaxed"
                style={{ backgroundColor: "var(--color-code-bg)", color: "var(--color-fg-muted)", margin: 0 }}
              >
                {children}
              </pre>
            </div>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-lg border" style={{ borderColor: border }}>
              <table className="w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead style={{ backgroundColor: "var(--color-paper-2)" }}>{children}</thead>
          ),
          th: ({ children }) => (
            <th
              className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide border-b"
              style={{ color: fgDim, borderColor: border }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              className="px-4 py-3 text-sm border-b"
              style={{ color: fgMuted, borderColor: alpha(border, 31) }}
            >
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr
              style={{ transition: "background-color 100ms" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = alpha(border, 15); }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
            >
              {children}
            </tr>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className="border-l-2 pl-5 my-5 py-1"
              style={{ borderColor: teal }}
            >
              <div className="text-base italic leading-[1.75]" style={{ color: fgMuted }}>{children}</div>
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="mb-5 space-y-2 text-base" style={{ color: fgMuted, paddingLeft: "1.4rem" }}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-5 space-y-2 text-base list-decimal" style={{ color: fgMuted, paddingLeft: "1.4rem" }}>{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-[1.7] pl-1">{children}</li>
          ),
          hr: () => (
            <hr className="my-8" style={{ borderColor: alpha(border, 38) }} />
          ),
          strong: ({ children }) => (
            <strong className="font-semibold" style={{ color: fg }}>{children}</strong>
          ),
          em: ({ children }) => (
            <em style={{ color: fgMuted }}>{children}</em>
          ),
        }}
      >
        {doc.content}
      </ReactMarkdown>
    </article>
  );
}
