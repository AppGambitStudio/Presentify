interface TagListProps { tags: string[]; color?: string; }

export function TagList({ tags, color }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full" style={{ backgroundColor: `${color || "var(--slide-primary)"}15`, color: color || "var(--slide-primary)" }}>
          {tag}
        </span>
      ))}
    </div>
  );
}
