import { Link } from "react-router";
import { teal, border, card, fgMuted } from "@/lib/tokens";
import { Tag } from "@/components/ui/Tag";

const INSTALL_SNIPPET = `# Install
cd engine && uv sync

# Auto-investigate with any LLM
advisor.run("API returning 500 errors")`;

export function EngineCTA() {
  return (
    <section className="py-20 border-t" style={{ borderColor: border }}>
      <div className="max-w-6xl mx-auto px-6">
        <div
          className="rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden border"
          style={{ backgroundColor: card, borderColor: `${teal}30` }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${teal}10 0%, transparent 60%)` }}
          />
          <div className="relative">
            <Tag>Python · v2.0.0 · Zero dependencies</Tag>
            <h2
              className="mt-6 text-3xl sm:text-4xl font-bold"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}
            >
              The algorithm, codified.
            </h2>
            <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: fgMuted }}>
              A Python library implementing every layer of HTSA. Works with any LLM provider — OpenAI, Anthropic,
              Groq, Mistral, Ollama. Or drive it manually, full control over every decision.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link
                to="/engine"
                className="px-6 py-3 rounded-lg font-medium text-sm no-underline"
                style={{ backgroundColor: teal, color: "#080d1a" }}
              >
                Engine docs →
              </Link>
              <a
                href="https://github.com/damionrashford/htsa/tree/main/engine"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-lg font-medium text-sm border no-underline"
                style={{ borderColor: border, color: "#dce4f5" }}
              >
                View source ↗
              </a>
            </div>
            <div className="mt-8 text-left max-w-lg mx-auto">
              <pre
                className="text-sm"
                style={{ backgroundColor: "#080d1a", border: `1px solid ${border}`, borderRadius: 8, padding: "1rem 1.25rem", margin: 0 }}
              >
                {INSTALL_SNIPPET}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
