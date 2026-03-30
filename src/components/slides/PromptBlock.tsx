interface PromptBlockProps { label: string; code: string; result: string; variant?: "before" | "after"; }

export function PromptBlock({ label, code, result, variant = "before" }: PromptBlockProps) {
  const borderColor = variant === "after" ? "#10B981" : "var(--slide-primary)";
  return (
    <div className="glass-panel" style={{ borderColor: `${borderColor}30` }}>
      <h4 className="text-lg font-bold mb-3" style={{ color: borderColor }}>{label}</h4>
      <div className="p-4 rounded-lg mb-3 text-sm" style={{ backgroundColor: "rgba(0,0,0,0.4)", fontFamily: "var(--slide-font-mono)", color: variant === "after" ? `${borderColor}cc` : "var(--slide-text-muted)" }}>
        {code}
      </div>
      <p className="text-sm" style={{ color: "var(--slide-text-muted)" }}>{result}</p>
    </div>
  );
}
