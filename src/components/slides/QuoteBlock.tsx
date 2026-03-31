interface QuoteBlockProps {
  text: string;
  attribution?: string;
  __editable?: boolean;
  __onPropsChange?: (props: Record<string, any>) => void;
}

export function QuoteBlock({ text, attribution, __editable, __onPropsChange }: QuoteBlockProps) {
  const cleanText = text.replace(/^[""\u201C\u201D]+|[""\u201C\u201D]+$/g, "").trim();

  return (
    <blockquote className="text-center py-4">
      {__editable ? (
        <p
          className="text-2xl font-bold italic leading-relaxed outline-none cursor-text"
          style={{ color: "var(--slide-primary)", fontFamily: "var(--slide-font-heading)" }}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            if (__onPropsChange) __onPropsChange({ text: e.currentTarget.innerText.trim(), attribution });
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {cleanText}
        </p>
      ) : (
        <p
          className="text-2xl font-bold italic leading-relaxed"
          style={{ color: "var(--slide-primary)", fontFamily: "var(--slide-font-heading)" }}
        >
          &ldquo;{cleanText}&rdquo;
        </p>
      )}
      {attribution && (
        <cite className="block mt-4 text-base not-italic" style={{ color: "var(--slide-text-muted)" }}>
          — {attribution}
        </cite>
      )}
    </blockquote>
  );
}
