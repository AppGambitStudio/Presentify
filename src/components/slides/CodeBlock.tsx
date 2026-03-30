interface CodeBlockProps { code: string; language?: string; }

export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "rgba(0,0,0,0.4)", border: "1px solid var(--slide-card-border)" }}>
      {language && (
        <div className="px-4 py-2 text-xs uppercase tracking-wider font-bold" style={{ color: "var(--slide-text-muted)", borderBottom: "1px solid var(--slide-card-border)" }}>{language}</div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm leading-relaxed" style={{ fontFamily: "var(--slide-font-mono)", color: "var(--slide-text)" }}>{code}</code>
      </pre>
    </div>
  );
}
