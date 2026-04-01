import { resolveIcon } from "@/lib/iconResolver";
import { parseInlineMarkdown } from "@/lib/parseMarkdown";
import { Minus } from "lucide-react";

interface BulletListProps {
  items: string[];
  icon?: string;
  variant?: "default" | "muted" | "highlighted" | "numbered";
  color?: string;            // hex color for icons/bullets
  __editable?: boolean;
  __onPropsChange?: (props: Record<string, any>) => void;
}

export function BulletList({ items, icon, variant = "default", color, __editable, __onPropsChange }: BulletListProps) {
  const Icon = icon ? resolveIcon(icon) : null;
  const accentColor = color || "var(--slide-primary)";

  const handleItemBlur = (index: number, newText: string) => {
    if (__onPropsChange && newText !== items[index]) {
      const newItems = [...items];
      newItems[index] = newText;
      __onPropsChange({ items: newItems, icon, variant, color });
    }
  };

  const isMuted = variant === "muted";
  const isHighlighted = variant === "highlighted";
  const isNumbered = variant === "numbered";

  const textColor = isMuted ? "var(--slide-text-muted)" : isHighlighted ? "var(--slide-text)" : "var(--slide-text-muted)";
  const textOpacity = isMuted ? 0.6 : 1;
  const iconColor = isMuted ? "var(--slide-text-muted)" : accentColor;

  return (
    <ul className="space-y-4" style={{ width: "fit-content" }}>
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-3 text-lg"
          style={{ color: textColor, opacity: textOpacity }}
        >
          {/* Icon/bullet */}
          {isNumbered ? (
            <span
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
              {i + 1}
            </span>
          ) : isMuted ? (
            <Minus size={18} className="shrink-0 mt-1" style={{ color: iconColor, opacity: 0.4 }} />
          ) : Icon ? (
            <Icon size={20} className="shrink-0 mt-1" style={{ color: iconColor }} />
          ) : (
            <span className="shrink-0 mt-2 w-2 h-2 rounded-full" style={{ backgroundColor: iconColor }} />
          )}

          {/* Text */}
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
