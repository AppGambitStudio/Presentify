import { resolveIcon } from "@/lib/iconResolver";
import { parseInlineMarkdown } from "@/lib/parseMarkdown";

interface IconCardProps {
  icon?: string;
  title: string;
  desc: string;
  color?: string;
  layout?: "vertical" | "horizontal";
  __editable?: boolean;
  __onPropsChange?: (props: Record<string, any>) => void;
}

export function IconCard({ icon, title, desc, color, layout = "vertical", __editable, __onPropsChange }: IconCardProps) {
  const accentColor = color || "var(--slide-primary)";
  const Icon = icon ? resolveIcon(icon) : null;
  const isHorizontal = layout === "horizontal";

  const titleEl = __editable ? (
    <h3
      className="text-lg font-bold outline-none cursor-text"
      style={{ fontFamily: "var(--slide-font-heading)" }}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => __onPropsChange?.({ icon, title: e.currentTarget.innerText.trim(), desc, color, layout })}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {title}
    </h3>
  ) : (
    <h3 className="text-lg font-bold" style={{ fontFamily: "var(--slide-font-heading)" }}>{title}</h3>
  );

  const descEl = __editable ? (
    <p
      className="text-base outline-none cursor-text"
      style={{ color: "var(--slide-text-muted)" }}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => __onPropsChange?.({ icon, title, desc: e.currentTarget.innerText.trim(), color, layout })}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {desc}
    </p>
  ) : (
    <p className="text-base" style={{ color: "var(--slide-text-muted)" }}>{parseInlineMarkdown(desc)}</p>
  );

  if (isHorizontal) {
    return (
      <div className="glass-panel flex items-start gap-4">
        {Icon && (
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${accentColor}20` }}>
            <Icon size={20} style={{ color: accentColor }} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {titleEl}
          {descEl}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel flex flex-col gap-3">
      {Icon && (
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
          <Icon size={24} style={{ color: accentColor }} />
        </div>
      )}
      {titleEl}
      {descEl}
    </div>
  );
}
