import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useParams, Navigate } from "react-router";
import { useState, useCallback } from "react";
import manifest from "@/lib/docs-manifest.json";
import { teal, border, fgMuted, fg, fgDim } from "@/lib/tokens";

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
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors"
      style={{
        borderColor: copied ? `${teal}60` : `${border}`,
        color: copied ? teal : fgDim,
        backgroundColor: copied ? `${teal}0d` : "transparent",
      }}
    >
      {copied ? "Copied ✓" : "Copy MD"}
    </button>
  );
}

type DocEntry = typeof manifest.docs[number];

const bySlug = new Map<string, DocEntry>(manifest.docs.map(d => [d.slug, d]));

// Resolve a relative .md link to a SPA hash route
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
      {/* Page header — from manifest, not from raw markdown */}
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

      {/* Markdown body — h1s suppressed since we render the title above */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: () => null,
          h2: ({ children }) => (
            <h2
              className="text-xl font-semibold mt-10 mb-4 pb-2 border-b"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: fg, borderColor: border }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: fg }}>{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-semibold mt-4 mb-1 uppercase tracking-wide" style={{ color: fgDim }}>{children}</h4>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-7 text-sm" style={{ color: fgMuted }}>{children}</p>
          ),
          a: ({ href, children }) => {
            const resolved = href ? resolveDocHref(href, doc.path) : null;
            return (
              <a
                href={resolved ?? href}
                className="no-underline border-b transition-colors"
                style={{ color: teal, borderColor: `${teal}40` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = teal; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${teal}40`; }}
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
                style={{ backgroundColor: `${teal}15`, color: teal }}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre
              className="rounded-lg px-5 py-4 my-5 overflow-x-auto text-xs font-mono leading-relaxed"
              style={{ backgroundColor: "#080d1a", border: `1px solid ${border}`, color: "#8899bb" }}
            >
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-lg border" style={{ borderColor: border }}>
              <table className="w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead style={{ backgroundColor: "#0a111f" }}>{children}</thead>
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
              style={{ color: fgMuted, borderColor: `${border}60` }}
            >
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr className="transition-colors hover:bg-white/[0.02]">{children}</tr>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className="border-l-2 pl-5 my-5 py-1"
              style={{ borderColor: teal }}
            >
              <div className="text-sm italic leading-relaxed" style={{ color: fgMuted }}>{children}</div>
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 space-y-1.5 text-sm" style={{ color: fgMuted, paddingLeft: "1.25rem" }}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 space-y-1.5 text-sm list-decimal" style={{ color: fgMuted, paddingLeft: "1.25rem" }}>{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-6 pl-1">{children}</li>
          ),
          hr: () => (
            <hr className="my-8" style={{ borderColor: border }} />
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
