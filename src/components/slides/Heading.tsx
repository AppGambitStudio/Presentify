import type { JSX } from "react";

interface HeadingProps {
  text: string;
  level?: 1 | 2 | 3;
  align?: "left" | "center" | "right";
  accentText?: string;
}

export function Heading({ text, level = 1, align = "left", accentText }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  // Default sizes as fallback -- can be overridden by CellDecoration.fontSize
  const sizeClass = level === 1 ? "text-4xl md:text-5xl lg:text-6xl" : level === 2 ? "text-2xl md:text-3xl lg:text-4xl" : "text-xl md:text-2xl";
  const alignClass = align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";

  // If accentText overlaps with end of text, remove the overlap to prevent duplication
  let displayText = text;
  if (accentText) {
    // Strip trailing overlap: "Building in the Age of AI" + "Age of AI" -> "Building in the "
    const overlapIndex = text.lastIndexOf(accentText);
    if (overlapIndex >= 0 && overlapIndex + accentText.length === text.length) {
      displayText = text.slice(0, overlapIndex);
    }
  }

  return (
    <Tag
      className={`font-bold leading-tight ${sizeClass} ${alignClass}`}
      style={{ fontFamily: "var(--slide-font-heading)" }}
    >
      {displayText}
      {accentText && (
        <span style={{ color: "var(--slide-primary)" }}>{accentText}</span>
      )}
    </Tag>
  );
}
