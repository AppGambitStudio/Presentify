interface QuoteBlockProps {
  text: string;
  attribution?: string;
}

export function QuoteBlock({ text, attribution }: QuoteBlockProps) {
  return (
    <blockquote className="text-center py-4">
      <p
        className="text-xl font-bold italic leading-relaxed"
        style={{ color: "var(--slide-primary)", fontFamily: "var(--slide-font-heading)" }}
      >
        &ldquo;{text}&rdquo;
      </p>
      {attribution && (
        <cite className="block mt-4 text-base not-italic" style={{ color: "var(--slide-text-muted)" }}>
          — {attribution}
        </cite>
      )}
    </blockquote>
  );
}
