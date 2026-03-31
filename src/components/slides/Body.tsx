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
  // Split on double newlines for paragraphs, single newlines become <br/>
  const paragraphs = markdown.split("\n\n");
  return (
    <div className="space-y-3" style={{ color: "var(--slide-text-muted)" }}>
      {paragraphs.map((para, i) => {
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
      })}
    </div>
  );
}
