interface CTABoxProps {
  text: string;
  color?: string;
}

export function CTABox({ text, color }: CTABoxProps) {
  const lines = text.split("\n");
  return (
    <div
      className="rounded-2xl p-6 text-center"
      style={{ backgroundColor: color || "var(--slide-primary)" }}
    >
      {lines.map((line, i) => (
        <p
          key={i}
          className={i === 0 ? "text-xl font-black" : "text-lg italic mt-2"}
          style={{
            color: "var(--slide-bg)",
            fontFamily: i === 0 ? "var(--slide-font-heading)" : undefined,
          }}
        >
          {line}
        </p>
      ))}
    </div>
  );
}
