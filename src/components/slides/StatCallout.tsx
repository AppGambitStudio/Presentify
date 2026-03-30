interface StatCalloutProps {
  value: string;
  label: string;
  color?: string;
}

export function StatCallout({ value, label, color }: StatCalloutProps) {
  return (
    <div className="text-center">
      <div
        className="text-6xl md:text-7xl font-black"
        style={{ color: color || "var(--slide-primary)", fontFamily: "var(--slide-font-heading)" }}
      >
        {value}
      </div>
      <div className="text-base mt-2" style={{ color: "var(--slide-text-muted)" }}>
        {label}
      </div>
    </div>
  );
}
