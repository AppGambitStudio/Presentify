import { parseInlineMarkdown } from "@/lib/parseMarkdown";

interface Step { title: string; desc: string; }
interface NumberedStepsProps { steps: Step[]; style?: "compact" | "hero"; }

export function NumberedSteps({ steps, style = "compact" }: NumberedStepsProps) {
  if (style === "hero") {
    // For 4+ steps, use 2-column grid instead of single row to prevent overflow
    const cols = steps.length > 3 ? Math.min(3, Math.ceil(steps.length / 2)) : steps.length;
    return (
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {steps.map((step, i) => (
          <div key={i} className="glass-panel relative p-5">
            <div className="text-4xl font-black absolute top-3 right-3" style={{ color: "var(--slide-text)", opacity: 0.05, fontFamily: "var(--slide-font-heading)" }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="text-base font-bold mb-1" style={{ color: "var(--slide-primary)", fontFamily: "var(--slide-font-heading)" }}>{step.title}</h3>
            <p className="text-sm" style={{ color: "var(--slide-text-muted)" }}>{parseInlineMarkdown(step.desc)}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: "var(--slide-card-bg)", border: "1px solid var(--slide-card-border)" }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: "var(--slide-primary)", color: "var(--slide-bg)" }}>{i + 1}</div>
          <div>
            <div className="font-bold text-sm">{step.title}</div>
            <div className="text-sm" style={{ color: "var(--slide-text-muted)" }}>{parseInlineMarkdown(step.desc)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
