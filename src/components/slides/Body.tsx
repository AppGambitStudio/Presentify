import React from "react";

interface BodyProps {
  markdown: string;
  variant?: "default" | "callout" | "quote";
  accentColor?: string;     // hex color for callout border
  __editable?: boolean;
  __onPropsChange?: (props: Record<string, any>) => void;
}

function parseInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (match[2]) parts.push(<strong key={key++} style={{ color: "var(--slide-text)" }}>{match[2]}</strong>);
    else if (match[3]) parts.push(<em key={key++}>{match[3]}</em>);
    else if (match[4]) parts.push(<code key={key++} className="px-1.5 py-0.5 rounded text-sm" style={{ backgroundColor: "var(--slide-card-bg)", fontFamily: "var(--slide-font-mono)" }}>{match[4]}</code>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function renderParagraphs(markdown: string) {
  const paragraphs = markdown.split("\n\n");
  return paragraphs.map((para, i) => {
    const lines = para.split("\n");
    return (
      <p key={i} className="text-lg md:text-xl leading-relaxed">
        {lines.map((line, j) => (
          <React.Fragment key={j}>
            {j > 0 && <br />}
            {parseInlineMarkdown(line)}
          </React.Fragment>
        ))}
      </p>
    );
  });
}

export function Body({ markdown, variant = "default", accentColor, __editable, __onPropsChange }: BodyProps) {
  if (__editable) {
    return (
      <div
        className="space-y-3 text-lg md:text-xl leading-relaxed outline-none cursor-text"
        style={{ color: "var(--slide-text-muted)", borderBottom: "1px dashed transparent" }}
        contentEditable
        suppressContentEditableWarning
        onFocus={(e) => { e.currentTarget.style.borderBottomColor = "var(--slide-primary)"; }}
        onBlur={(e) => {
          e.currentTarget.style.borderBottomColor = "transparent";
          if (__onPropsChange) __onPropsChange({ markdown: e.currentTarget.innerText.trim(), variant, accentColor });
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {markdown}
      </div>
    );
  }

  if (variant === "callout") {
    const borderColor = accentColor || "var(--slide-primary)";
    return (
      <div
        className="rounded-xl px-6 py-5 space-y-2"
        style={{
          backgroundColor: "var(--slide-card-bg)",
          borderLeft: `4px solid ${borderColor}`,
          color: "var(--slide-text-muted)",
        }}
      >
        {renderParagraphs(markdown)}
      </div>
    );
  }

  if (variant === "quote") {
    return (
      <div
        className="rounded-xl px-6 py-5 space-y-2 italic"
        style={{
          backgroundColor: "var(--slide-card-bg)",
          borderLeft: "4px solid var(--slide-text-muted)",
          color: "var(--slide-text-muted)",
        }}
      >
        {renderParagraphs(markdown)}
      </div>
    );
  }

  return (
    <div className="space-y-3" style={{ color: "var(--slide-text-muted)" }}>
      {renderParagraphs(markdown)}
    </div>
  );
}
