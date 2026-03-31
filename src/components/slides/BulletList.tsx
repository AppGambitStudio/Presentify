import { resolveIcon } from "@/lib/iconResolver";
import { parseInlineMarkdown } from "@/lib/parseMarkdown";

interface BulletListProps {
  items: string[];
  icon?: string;
  __editable?: boolean;
  __onPropsChange?: (props: Record<string, any>) => void;
}

export function BulletList({ items, icon, __editable, __onPropsChange }: BulletListProps) {
  const Icon = icon ? resolveIcon(icon) : null;

  const handleItemBlur = (index: number, newText: string) => {
    if (__onPropsChange && newText !== items[index]) {
      const newItems = [...items];
      newItems[index] = newText;
      __onPropsChange({ items: newItems, icon });
    }
  };

  return (
    <ul className="space-y-5" style={{ width: "fit-content" }}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-4 text-xl" style={{ color: "var(--slide-text-muted)" }}>
          {Icon ? (
            <Icon size={22} className="shrink-0 mt-1" style={{ color: "var(--slide-primary)" }} />
          ) : (
            <span className="shrink-0 mt-2.5 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--slide-primary)" }} />
          )}
          {__editable ? (
            <span
              contentEditable
              suppressContentEditableWarning
              className="outline-none cursor-text"
              style={{ borderBottom: "1px dashed transparent" }}
              onFocus={(e) => { e.currentTarget.style.borderBottomColor = "var(--slide-primary)"; }}
              onBlur={(e) => {
                e.currentTarget.style.borderBottomColor = "transparent";
                handleItemBlur(i, e.currentTarget.innerText.trim());
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); e.currentTarget.blur(); }
                e.stopPropagation();
              }}
            >
              {item}
            </span>
          ) : (
            <span>{parseInlineMarkdown(item)}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
