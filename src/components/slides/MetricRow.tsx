interface Metric {
  value: string;
  label: string;
  color?: string;
}

interface MetricRowProps {
  metrics: Metric[];
  size?: "default" | "compact" | "large";
}

export function MetricRow({ metrics, size = "default" }: MetricRowProps) {
  const valueSize = size === "large" ? "text-5xl md:text-6xl" : size === "compact" ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl";
  const labelSize = size === "large" ? "text-base" : size === "compact" ? "text-xs" : "text-sm";

  return (
    <div className="flex justify-center gap-8 md:gap-12" style={{ width: "fit-content", margin: "0 auto" }}>
      {metrics.map((m, i) => (
        <div key={i} className="text-center">
          <div
            className={`${valueSize} font-black`}
            style={{ color: m.color || "var(--slide-primary)", fontFamily: "var(--slide-font-heading)" }}
          >
            {m.value}
          </div>
          <div className={`${labelSize} mt-1`} style={{ color: "var(--slide-text-muted)" }}>
            {m.label}
          </div>
        </div>
      ))}
    </div>
  );
}
