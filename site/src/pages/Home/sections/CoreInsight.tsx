import { fgDim, fgMuted } from "@/lib/tokens";
import { Section } from "@/components/ui/Section";

export function CoreInsight() {
  return (
    <Section className="pt-24 pb-4 text-center">
      <p className="text-xs font-mono uppercase tracking-widest" style={{ color: fgDim }}>
        The Core Insight
      </p>
      <h2
        className="mt-4 text-3xl sm:text-4xl font-bold"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#dce4f5" }}
      >
        Every problem has the same anatomy.
      </h2>
      <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: fgMuted }}>
        The vocabulary changes. The causal structure never does.<br />
        The <strong style={{ color: "#dce4f5" }}>5 Ws</strong> tell you what happened.{" "}
        The <strong style={{ color: "#dce4f5" }}>5 Whys</strong> tell you why it happened.{" "}
        Together they tell you <strong style={{ color: "#dce4f5" }}>what to fix — and in what order.</strong>
      </p>
    </Section>
  );
}
