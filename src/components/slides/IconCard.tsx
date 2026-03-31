import { resolveIcon } from "@/lib/iconResolver";
import { parseInlineMarkdown } from "@/lib/parseMarkdown";

interface IconCardProps {
  icon?: string;
  title: string;
  desc: string;
  color?: string;
  __editable?: boolean;
  __onPropsChange?: (props: Record<string, any>) => void;
}

export function IconCard({ icon, title, desc, color, __editable, __onPropsChange }: IconCardProps) {
  const accentColor = color || "var(--slide-primary)";
  const Icon = icon ? resolveIcon(icon) : null;

  return (
    <div className="glass-panel flex flex-col gap-4">
      {Icon && (
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
          <Icon size={24} style={{ color: accentColor }} />
        </div>
      )}
      {__editable ? (
        <>
          <h3
            className="text-xl font-bold outline-none cursor-text"
            style={{ fontFamily: "var(--slide-font-heading)" }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => __onPropsChange?.({ icon, title: e.currentTarget.innerText.trim(), desc, color })}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {title}
          </h3>
          <p
            className="text-base outline-none cursor-text"
            style={{ color: "var(--slide-text-muted)" }}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => __onPropsChange?.({ icon, title, desc: e.currentTarget.innerText.trim(), color })}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {desc}
          </p>
        </>
      ) : (
        <>
          <h3 className="text-xl font-bold" style={{ fontFamily: "var(--slide-font-heading)" }}>{title}</h3>
          <p className="text-base" style={{ color: "var(--slide-text-muted)" }}>{parseInlineMarkdown(desc)}</p>
        </>
      )}
    </div>
  );
}
