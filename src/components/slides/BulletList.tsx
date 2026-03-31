import { resolveIcon } from "@/lib/iconResolver";
import { parseInlineMarkdown } from "@/lib/parseMarkdown";

interface BulletListProps {
  items: string[];
  icon?: string;
}


export function BulletList({ items, icon }: BulletListProps) {
  const Icon = icon ? resolveIcon(icon) : null;
  return (
    <ul className="space-y-5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-4 text-xl" style={{ color: "var(--slide-text-muted)" }}>
          {Icon ? (
            <Icon size={22} className="shrink-0 mt-1" style={{ color: "var(--slide-primary)" }} />
          ) : (
            <span className="shrink-0 mt-2.5 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--slide-primary)" }} />
          )}
          <span>{parseInlineMarkdown(item)}</span>
        </li>
      ))}
    </ul>
  );
}
