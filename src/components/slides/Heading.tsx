import type { JSX } from "react";

interface HeadingProps {
  text: string;
  level?: 1 | 2 | 3;
  align?: "left" | "center" | "right";
  accentText?: string;
}

export function Heading({ text, level = 1, align = "left", accentText }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const sizeClass = level === 1 ? "text-5xl md:text-6xl" : level === 2 ? "text-3xl md:text-4xl" : "text-2xl";
  const alignClass = align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";

  return (
    <Tag
      className={`font-bold ${sizeClass} ${alignClass}`}
      style={{ fontFamily: "var(--slide-font-heading)" }}
    >
      {text}
      {accentText && (
        <span style={{ color: "var(--slide-primary)" }}>{accentText}</span>
      )}
    </Tag>
  );
}
