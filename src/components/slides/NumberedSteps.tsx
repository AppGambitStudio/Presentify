import { parseInlineMarkdown } from "@/lib/parseMarkdown";

interface Step { title: string; desc: string; }
interface NumberedStepsProps { steps: Step[]; style?: "compact" | "hero"; }

export function NumberedSteps({ steps, style = "compact" }: NumberedStepsProps) {
  if (style === "hero") {
    return (
      <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
        {steps.map((step, i) => (
          <div key={i} className="glass-panel relative">
            <div className="text-6xl font-black absolute top-4 right-4" style={{ color: "var(--slide-text)", opacity: 0.05, fontFamily: "var(--slide-font-heading)" }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--slide-primary)", fontFamily: "var(--slide-font-heading)" }}>{step.title}</h3>
            <p style={{ color: "var(--slide-text-muted)" }}>{parseInlineMarkdown(step.desc)}</p>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-4 p-4 rounded-lg" style={{ backgroundColor: "var(--slide-card-bg)", border: "1px solid var(--slide-card-border)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ backgroundColor: "var(--slide-primary)", color: "var(--slide-bg)" }}>{i + 1}</div>
          <div>
            <div className="font-bold">{step.title}</div>
            <div className="text-base" style={{ color: "var(--slide-text-muted)" }}>{parseInlineMarkdown(step.desc)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
