interface CTABoxProps {
  text: string;
  color?: string;
  __editable?: boolean;
  __onPropsChange?: (props: Record<string, any>) => void;
}

export function CTABox({ text, color, __editable, __onPropsChange }: CTABoxProps) {
  const lines = text.split("\n");

  if (__editable) {
    return (
      <div
        className="rounded-2xl p-6 text-center outline-none cursor-text"
        style={{ backgroundColor: color || "var(--slide-primary)" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          if (__onPropsChange) __onPropsChange({ text: e.currentTarget.innerText.trim(), color });
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <p className="text-2xl font-black" style={{ color: "var(--slide-bg)", fontFamily: "var(--slide-font-heading)" }}>
          {text}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: color || "var(--slide-primary)" }}>
      {lines.map((line, i) => (
        <p key={i} className={i === 0 ? "text-2xl font-black" : "text-xl italic mt-2"} style={{ color: "var(--slide-bg)", fontFamily: i === 0 ? "var(--slide-font-heading)" : undefined }}>
          {line}
        </p>
      ))}
    </div>
  );
}
