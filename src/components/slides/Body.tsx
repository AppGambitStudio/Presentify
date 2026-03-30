import React from "react";

interface BodyProps {
  markdown: string;
}

function parseInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(<strong key={key++}>{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={key++}>{match[3]}</em>);
    } else if (match[4]) {
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 rounded text-sm" style={{
          backgroundColor: "var(--slide-card-bg)",
          fontFamily: "var(--slide-font-mono)",
        }}>
          {match[4]}
        </code>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export function Body({ markdown }: BodyProps) {
  const paragraphs = markdown.split("\n\n");
  return (
    <div className="space-y-4" style={{ color: "var(--slide-text-muted)" }}>
      {paragraphs.map((para, i) => (
        <p key={i} className="text-xl leading-relaxed">
          {parseInlineMarkdown(para)}
        </p>
      ))}
    </div>
  );
}
