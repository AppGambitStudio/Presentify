interface QuoteBlockProps {
  text: string;
  attribution?: string;
}

export function QuoteBlock({ text, attribution }: QuoteBlockProps) {
  // Strip leading/trailing quotes that AI might include in the text
  const cleanText = text.replace(/^[""\u201C\u201D]+|[""\u201C\u201D]+$/g, "").trim();

  return (
    <blockquote className="text-center py-4">
      <p
        className="text-2xl font-bold italic leading-relaxed"
        style={{ color: "var(--slide-primary)", fontFamily: "var(--slide-font-heading)" }}
      >
        &ldquo;{cleanText}&rdquo;
      </p>
      {attribution && (
        <cite className="block mt-4 text-base not-italic" style={{ color: "var(--slide-text-muted)" }}>
          — {attribution}
        </cite>
      )}
    </blockquote>
  );
}
