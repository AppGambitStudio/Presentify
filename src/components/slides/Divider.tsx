interface DividerProps { style?: "solid" | "dashed" | "gradient"; }

export function Divider({ style = "solid" }: DividerProps) {
  if (style === "gradient") {
    return <div className="h-px w-full" style={{ background: `linear-gradient(to right, transparent, var(--slide-primary), transparent)` }} />;
  }
  return <hr className="w-full" style={{ border: "none", borderTop: `1px ${style} var(--slide-card-border)` }} />;
}
